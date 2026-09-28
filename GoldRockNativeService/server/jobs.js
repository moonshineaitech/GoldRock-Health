import { validateFacts } from '../shared/validation.js';
import { analyzeFacts } from '../shared/engine.js';
import { sources, getCurrentSources } from '../shared/sources.js';
import { HttpError, exactKeys, id, requestFingerprint, seal, unseal } from './security.js';
import { hasBenefit } from './auth.js';
import { OpenAIProvider } from './provider.js';
import { ConversationProvider, buildConversationContext } from './conversation-provider.js';
import { validateConversationRequest } from '../shared/conversation-privacy.js';
import { flushContentRemnants } from './store.js';

const canonical = x => Array.isArray(x) ? `[${x.map(canonical).join(',')}]` : x && typeof x === 'object' ? `{${Object.keys(x).sort().map(k => JSON.stringify(k)+':'+canonical(x[k])).join(',')}}` : JSON.stringify(x);
function guidanceSourcesCurrent(result, now) {
  if (!Array.isArray(result?.sourceIds)) return false;
  const current = new Map(getCurrentSources({now:new Date(now)}).map(source=>[source.id,source]));
  const receipts = result.knowledgeReceipt ?? result.provenance?.sourceReviews ?? [];
  if (!Array.isArray(receipts)) return false;
  const requiredIds=result.kind==='conversation'?receipts.map(receipt=>receipt?.id):result.sourceIds;
  return requiredIds.every(id=>{
    const source=current.get(id),receipt=receipts.find(item=>item?.id===id);
    return source && receipt && receipt.reviewedAt===source.reviewedAt && receipt.expiresAt===source.expiresAt;
  });
}
const messages = {
  PROCESSING_INTERRUPTED: 'Processing was interrupted by a server restart. Review the local guidance before starting another request.',
  PROCESSING_TIMED_OUT: 'The provider did not finish within the processing limit. The request was not replayed. Local guidance remains available.',
  BENEFIT_EXPIRED: 'Sponsored access ended before processing. Your local case remains available.',
  PROVIDER_BUSY: 'The AI provider is busy. Try again later.',
  PROVIDER_QUOTA: 'The configured API project needs available quota or billing capacity. Local guidance remains available.',
  UNVERIFIED_AI_RESULT: 'The response did not pass validation. Local guidance remains available.',
  PROVIDER_CONNECTION_UNCERTAIN: 'The provider connection was interrupted. This request was not replayed automatically.',
  AI_INCOMPLETE: 'The provider returned an incomplete result.',
  PROVIDER_REJECTED: 'The provider could not process this request.',
  SOURCE_REVIEW_REQUIRED: 'One or more guidance sources need review before cloud processing.',
  PROCESSING_FAILED: 'Processing could not finish. Your local case remains available.'
};

export class Jobs {
  constructor(db, config, { provider = new OpenAIProvider(config), conversationProvider = new ConversationProvider(config), now = () => Date.now(), processingTimeoutMs = 90000 } = {}) {
    if (!Number.isSafeInteger(processingTimeoutMs) || processingTimeoutMs < 1 || processingTimeoutMs > 90000) throw new RangeError('Processing timeout must be between 1 and 90000 milliseconds.');
    this.db = db; this.config = config; this.provider = provider; this.conversationProvider=conversationProvider; this.now = now;
    this.processingTimeoutMs = processingTimeoutMs;
    this.closed = false; this.busy = false; this.controllers = new Map();
    this.remnantsPending = false;
    // A restarted running request may already have reached the vendor. Never blindly replay it.
    const interrupted=db.prepare("UPDATE jobs SET status='failed',payload=NULL,error_code='PROCESSING_INTERRUPTED' WHERE status='running' AND deleted_at IS NULL").run().changes;
    if(interrupted)this.remnantsPending=true;
    this.cleanup();
    this.interval = setInterval(() => { this.cleanup(); this.kick(); }, 1000);
    this.interval.unref(); queueMicrotask(() => this.kick());
  }
  create(actor, body, idempotencyKey, kind='analysis') {
    this.cleanup();
    const isConversation=kind==='conversation';
    const bodyKeys=['clientOperationId','facts','consent',...(isConversation?['conversation']:[])];
    exactKeys(body, bodyKeys, bodyKeys);
    const operation = body.clientOperationId;
    if (typeof operation !== 'string' || !/^[A-Za-z0-9_-]{8,80}$/.test(operation) || operation !== idempotencyKey) throw new HttpError(422, 'IDEMPOTENCY_REQUIRED', 'Use the same unique operation ID in the request and Idempotency-Key header.');
    const facts = validateFacts(body.facts);
    let conversation;
    if(isConversation)try {conversation=validateConversationRequest(body.conversation);}catch {throw new HttpError(422,'INVALID_CONVERSATION','Review the minimized question and selected history. Known identifier patterns or unsupported fields are not accepted.');}
    const consentKeys=['policyVersion','approvedFields','processor','accepted',...(isConversation?['conversationReviewed']:[])];
    exactKeys(body.consent, consentKeys, consentKeys);
    const consent = body.consent;
    if (consent.policyVersion !== this.config.policyVersion || consent.processor !== 'openai' || consent.accepted !== true || !Array.isArray(consent.approvedFields) || canonical([...consent.approvedFields].sort()) !== canonical(Object.keys(facts).sort())) throw new HttpError(422, 'CONSENT_REQUIRED', 'Review the current processor notice and approve exactly the fields being sent.');
    if(isConversation&&consent.conversationReviewed!==true)throw new HttpError(422,'CONVERSATION_REVIEW_REQUIRED','Review the exact question and selected prior turns before sending.');
    const payload=isConversation?{kind:'conversation',facts,conversation,consent}:{facts,consent};
    const requestHash = requestFingerprint(canonical(payload), this.config.dataKey, actor);
    const existing = this.db.prepare('SELECT * FROM jobs WHERE user_id=? AND operation_id=?').get(actor, operation);
    if (existing) {
      if (existing.deleted_at) throw new HttpError(410, 'OPERATION_DELETED', 'This operation was deleted. Retries are blocked during the 30-day replay-protection period.');
      if(existing.expires_at<=this.now())return this.view(existing);
      if (existing.request_hash !== requestHash) throw new HttpError(409, 'OPERATION_CONFLICT', 'This operation ID was already used with different content.');
      return this.view(existing);
    }
    if (!this.config.enableCloud || !this.config.apiKey || !this.config.model) throw new HttpError(503, 'AI_UNAVAILABLE', 'Cloud guidance is not configured. The local plan is available without sending information.');
    if (!hasBenefit(this.db, actor, this.config.environment)) throw new HttpError(403, 'BENEFIT_REQUIRED', 'Connect an active employer benefit to request sponsored cloud guidance.');
    if(isConversation)buildConversationContext(facts,conversation,{now:new Date(this.now())});
    const active = this.db.prepare("SELECT count(*) n FROM jobs WHERE user_id=? AND status IN ('queued','running') AND deleted_at IS NULL").get(actor).n;
    if (active >= 3) throw new HttpError(429, 'TOO_MANY_JOBS', 'Wait for an existing review to finish or cancel it first.');
    const recent = this.db.prepare('SELECT count(*) n FROM jobs WHERE user_id=? AND created_at>?').get(actor, this.now() - 86400000).n;
    if (recent >= 50) throw new HttpError(429, 'DAILY_REVIEW_LIMIT', 'The daily cloud review limit has been reached. Local guidance and existing cases remain available.');
    const jobId = id('job'), now = this.now();
    this.db.prepare(`INSERT INTO jobs(id,user_id,operation_id,request_hash,status,payload,created_at,expires_at) VALUES(?,?,?,?,?,?,?,?)`).run(jobId, actor, operation, requestHash, 'queued', seal(payload, this.config.dataKey, jobId), now, now + this.config.jobTtlSeconds * 1000);
    queueMicrotask(() => this.kick());
    return this.view(this.db.prepare('SELECT * FROM jobs WHERE id=?').get(jobId));
  }
  get(actor, jobId) {
    this.cleanup();
    const job = this.db.prepare('SELECT * FROM jobs WHERE id=? AND user_id=? AND deleted_at IS NULL').get(jobId, actor);
    if (!job) throw new HttpError(404, 'NOT_FOUND', 'The review was not found.');
    return this.view(job);
  }
  getOperation(actor, operation) {
    this.cleanup();
    const job=this.db.prepare('SELECT * FROM jobs WHERE user_id=? AND operation_id=? AND deleted_at IS NULL').get(actor,operation);
    if(!job)throw new HttpError(404,'NOT_FOUND','That operation was not found.');
    return this.view(job);
  }
  deleteOperation(actor, operation) {
    this.cleanup();
    const job=this.db.prepare('SELECT * FROM jobs WHERE user_id=? AND operation_id=?').get(actor,operation);
    if(job&&!job.deleted_at)return this.delete(actor,job.id);
    if(!job){
      const now=this.now(),count=this.db.prepare('SELECT count(*) n FROM jobs WHERE user_id=? AND created_at>?').get(actor,now-86400000).n;
      if(count>=500)throw new HttpError(429,'OPERATION_LIMIT','Too many recent operations. Try again later.');
      // A missing POST may still be in flight. A content-free tombstone prevents it
      // from starting new provider work after the member has canceled locally.
      this.db.prepare("INSERT INTO jobs(id,user_id,operation_id,request_hash,status,payload,created_at,expires_at,deleted_at) VALUES(?,?,?,'','canceled',NULL,?,?,?)").run(id('job'),actor,operation,now,now+this.config.jobTtlSeconds*1000,now);
    }
    return {deleted:true,providerCancellation:'best_effort',note:'This operation is canceled and late submissions are blocked for 30 days. Processing already received by a provider cannot be recalled.'};
  }
  view(job) {
    // Enforce the deadline on every read path, even between background cleanup ticks.
    const expired = job.expires_at <= this.now();
    let result = !expired && job.status==='succeeded' && job.result ? unseal(job.result,this.config.dataKey,job.id) : null;
    if (result && !guidanceSourcesCurrent(result,this.now())) {
      this.db.prepare("UPDATE jobs SET status='failed',payload=NULL,result=NULL,error_code='SOURCE_REVIEW_REQUIRED' WHERE id=? AND status='succeeded' AND deleted_at IS NULL").run(job.id);
      this.remnantsPending=true;this.flushRemnants();
      job={...job,status:'failed',error_code:'SOURCE_REVIEW_REQUIRED'};result=null;
    }
    return { id: job.id, status: expired && job.status !== 'canceled' ? 'expired' : job.status, expiresAt: new Date(job.expires_at).toISOString(),
      ...(result ? {result} : {}),
      ...(!expired && job.error_code ? { error: { code: job.error_code, message: messages[job.error_code] || messages.PROCESSING_FAILED } } : {}) };
  }
  delete(actor, jobId) {
    const job = this.db.prepare('SELECT id FROM jobs WHERE id=? AND user_id=? AND deleted_at IS NULL').get(jobId, actor);
    if (!job) throw new HttpError(404, 'NOT_FOUND', 'The review was not found.');
    this.db.prepare("UPDATE jobs SET status='canceled',payload=NULL,result=NULL,request_hash='',error_code=NULL,deleted_at=? WHERE id=? AND user_id=?").run(this.now(), jobId, actor);
    this.controllers.get(jobId)?.abort();
    this.remnantsPending=true;this.flushRemnants();
    return { deleted: true, providerCancellation: 'best_effort', note: 'Local service access and stored job content have been removed. Processing already received by a provider cannot be recalled.' };
  }
  removeActor(actor) {
    for (const job of this.db.prepare('SELECT id FROM jobs WHERE user_id=?').all(actor)) this.controllers.get(job.id)?.abort();
    this.db.prepare("UPDATE jobs SET payload=NULL,result=NULL,request_hash='',deleted_at=? WHERE user_id=?").run(this.now(), actor);
    this.remnantsPending=true;
  }
  cleanup() {
    if (this.closed) return;
    const expired = this.db.prepare("SELECT id FROM jobs WHERE expires_at<=? AND status NOT IN ('expired','canceled')").all(this.now());
    for (const job of expired) this.controllers.get(job.id)?.abort();
    const changed=this.db.prepare("UPDATE jobs SET status='expired',payload=NULL,result=NULL,request_hash='',error_code=NULL WHERE expires_at<=? AND status!='canceled' AND (status!='expired' OR payload IS NOT NULL OR result IS NOT NULL OR request_hash!='')").run(this.now()).changes;
    // Keep content-free operation tombstones 30 days to stop stale retries from recreating work.
    const removed=this.db.prepare("DELETE FROM jobs WHERE created_at<? AND status IN ('expired','canceled','failed','succeeded')").run(this.now() - 30 * 86400000).changes;
    this.db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(this.now());
    if(changed||removed)this.remnantsPending=true;
    this.flushRemnants();
  }
  flushRemnants() { if(this.closed||!this.remnantsPending)return;this.remnantsPending=!flushContentRemnants(this.db).complete; }
  async kick() {
    if (this.closed || this.busy) return;
    const job = this.db.prepare("SELECT * FROM jobs WHERE status='queued' AND deleted_at IS NULL AND expires_at>? ORDER BY created_at LIMIT 1").get(this.now());
    if (!job) return;
    this.busy = true;
    const changed = this.db.prepare("UPDATE jobs SET status='running',attempts=attempts+1 WHERE id=? AND status='queued' AND deleted_at IS NULL").run(job.id).changes;
    if (!changed) { this.busy = false; return; }
    const controller = new AbortController(); this.controllers.set(job.id, controller);
    let timeoutReached = false, abortListener;
    const timer = setTimeout(() => { timeoutReached = true; controller.abort(); }, Math.min(this.processingTimeoutMs, Math.max(1, job.expires_at - this.now())));
    try {
      if (!hasBenefit(this.db, job.user_id, this.config.environment)) throw new HttpError(403, 'BENEFIT_EXPIRED', 'Access expired.');
      const payload = unseal(job.payload, this.config.dataKey, job.id), {facts}=payload;
      const context=payload.kind==='conversation'?buildConversationContext(facts,payload.conversation,{now:new Date(this.now())}):null;
      const base = context?.base || analyzeFacts(facts, { now: new Date(this.now()) });
      const current = getCurrentSources({ now: new Date(this.now()) });
      if (base.findings.some(finding => finding.id === 'source-review-needed') || base.sourceIds.some(sourceId => !current.some(x => x.id === sourceId))) throw new HttpError(503, 'SOURCE_REVIEW_REQUIRED', 'Source review required.');
      const relevant = context?.sources || sources.filter(x => base.sourceIds.includes(x.id));
      const knowledgeReceipt = relevant.map(source=>({id:source.id,reviewedAt:source.reviewedAt,expiresAt:source.expiresAt}));
      // Abort must release the worker even if a provider adapter ignores its signal.
      // A late provider completion is never written after cancellation or timeout.
      const stopped = new Promise((resolve,reject) => {
        abortListener = () => reject(new HttpError(504, timeoutReached ? 'PROCESSING_TIMED_OUT' : 'PROCESSING_FAILED', 'Processing stopped.'));
        controller.signal.addEventListener('abort',abortListener,{once:true});
      });
      const result = await Promise.race([context?this.conversationProvider.converse({context,signal:controller.signal}):this.provider.analyze({ facts, base, sources: relevant, signal: controller.signal }),stopped]);
      if (controller.signal.aborted || this.closed) return;
      const reviewedResult={...result,knowledgeReceipt};
      if (!guidanceSourcesCurrent(reviewedResult,this.now())) throw new HttpError(503,'SOURCE_REVIEW_REQUIRED','Source review required.');
      this.db.prepare("UPDATE jobs SET status='succeeded',result=?,payload=NULL WHERE id=? AND status='running' AND deleted_at IS NULL AND expires_at>?").run(seal(reviewedResult, this.config.dataKey, job.id), job.id, this.now());
      this.remnantsPending=true;
    } catch (error) {
      if (!this.closed) {this.db.prepare("UPDATE jobs SET status='failed',payload=NULL,error_code=? WHERE id=? AND status='running' AND deleted_at IS NULL AND expires_at>?").run(messages[error.code] ? error.code : 'PROCESSING_FAILED', job.id, this.now());this.remnantsPending=true;}
    } finally {
      clearTimeout(timer); if(abortListener)controller.signal.removeEventListener('abort',abortListener); this.controllers.delete(job.id); this.busy = false;
      this.flushRemnants();
      if (!this.closed) setImmediate(() => this.kick());
    }
  }
  close() { this.closed = true; clearInterval(this.interval); for (const controller of this.controllers.values()) controller.abort(); }
}
