import {validateFacts,FACT_KEYS} from './validation.js';
import {getSource} from './sources.js';
import {validateConversationRequest} from './conversation-privacy.js';

/** Reviewed private conversation history. No networking or mutation of case facts. */
export const CONVERSATION_VERSION=1;
export const CONVERSATION_LIMITS=Object.freeze({turns:100,events:2,answer:6000,sourceReceipt:60,sourceIds:60,followUpQuestions:6,nextSteps:6,limitations:10,serializedCharacters:2_000_000});
export class ConversationError extends Error{constructor(code,message){super(message);this.name='ConversationError';this.code=code;}}
const conversationFail=(code,message)=>{throw new ConversationError(code,message);};
function conversationObject(value,allowed,required=allowed){
  if(value===null||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))conversationFail('INVALID_CONVERSATION_FIELDS','Use a plain conversation record with supported fields.');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!allowed.includes(key)||!descriptors[key].enumerable||!Object.hasOwn(descriptors[key],'value')||descriptors[key].value===undefined)||required.some(key=>!Object.hasOwn(value,key)))conversationFail('INVALID_CONVERSATION_FIELDS','A conversation record has missing or unsupported fields.');
}
function conversationArray(value,max){
  if(!Array.isArray(value)||value.length>max||Reflect.ownKeys(value).length!==value.length+1||Object.keys(value).length!==value.length)conversationFail('CONVERSATION_LIMIT','Use bounded lists of plain conversation records.');
  for(let index=0;index<value.length;index++){const descriptor=Object.getOwnPropertyDescriptor(value,String(index));if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))conversationFail('INVALID_CONVERSATION_FIELDS','Conversation lists cannot contain missing or computed entries.');}return value;
}
function conversationText(value,max,required=true){
  if(typeof value!=='string'||value.length>max||(required&&!value.trim())||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/.test(value))conversationFail('INVALID_CONVERSATION_TEXT','Use bounded text without hidden control characters.');return value;
}
function conversationId(value){if(typeof value!=='string'||!/^cv_[A-Za-z0-9_-]{8,76}$/.test(value))conversationFail('INVALID_CONVERSATION_ID','The conversation identifier is invalid.');return value;}
function conversationInstant(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)||value<'1900-01-01T00:00:00.000Z'||value>'2200-12-31T23:59:59.999Z')conversationFail('INVALID_CONVERSATION_TIMESTAMP','The conversation timestamp is invalid.');
  const parsed=new Date(value);if(!Number.isFinite(parsed.getTime())||parsed.toISOString()!==value)conversationFail('INVALID_CONVERSATION_TIMESTAMP','The conversation timestamp is invalid.');return value;
}
function conversationStamp(options={}){
  conversationObject(options,['id','now'],[]);const id=Object.hasOwn(options,'id')?options.id:(globalThis.crypto?.randomUUID?`cv_${globalThis.crypto.randomUUID()}`:null);
  if(!id)conversationFail('LOCAL_RANDOM_UNAVAILABLE','Secure local identifiers are unavailable.');return {id:conversationId(id),createdAt:conversationInstant(Object.hasOwn(options,'now')?options.now:new Date().toISOString())};
}
function conversationCommon(record,seen,earliest=null){
  conversationId(record.id);if(seen.has(record.id))conversationFail('DUPLICATE_CONVERSATION_ID','Every conversation record needs a distinct identifier.');seen.add(record.id);
  conversationInstant(record.createdAt);if(earliest&&record.createdAt<earliest)conversationFail('INVALID_CONVERSATION_TIMESTAMP','A conversation record cannot precede its existing history.');
}
function conversationFacts(input){
  try{
    conversationObject(input,FACT_KEYS,[]);
    for(const key of Object.keys(input)){
      if(key==='lines'){
        for(const line of conversationArray(input.lines,100)){
          conversationObject(line,['id','code','amountCents','units']);
          for(const value of Object.values(line))if(value!==null&&!['string','number','boolean'].includes(typeof value)||typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))throw new Error();
        }
      }else{const value=input[key];if(value!==null&&!['string','number','boolean'].includes(typeof value)||typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))throw new Error();}
    }
    return validateFacts(input);
  }catch{conversationFail('INVALID_CONVERSATION_FACTS','Use only the approved structured facts for this conversation snapshot.');}
}
function conversationReviewedPayload(input){try{return validateConversationRequest(input);}catch{conversationFail('CONVERSATION_REVIEW_REQUIRED','Review the minimized question and context again before recording this turn.');}}
function conversationIdentifiers(input,max){
  const ids=new Set();return conversationArray(input,max).map(id=>{if(typeof id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(id)||ids.has(id))conversationFail('INVALID_CONVERSATION_SOURCE','Use distinct supported knowledge or source identifiers.');ids.add(id);return id;});
}
function conversationCheckReceipts(receipts){
  const ids=new Set();for(const receipt of conversationArray(receipts,CONVERSATION_LIMITS.sourceReceipt)){
    conversationObject(receipt,['id','reviewedAt','expiresAt']);conversationIdentifiers([receipt.id],1);
    if(ids.has(receipt.id))conversationFail('INVALID_CONVERSATION_SOURCE','Source receipts must have distinct identifiers.');ids.add(receipt.id);
    conversationInstant(receipt.reviewedAt);conversationInstant(receipt.expiresAt);
    if(receipt.expiresAt<=receipt.reviewedAt)conversationFail('INVALID_CONVERSATION_SOURCE','Source receipt expiry must follow its review timestamp.');
  }return ids;
}
function conversationCheckConsent(consent,facts){
  if(consent===null)return;
  conversationObject(consent,['policyVersion','approvedFields','processor','accepted','conversationReviewed']);
  if(typeof consent.policyVersion!=='string'||!/^[A-Za-z0-9._-]{1,120}$/.test(consent.policyVersion)||consent.processor!=='openai'||consent.accepted!==true||consent.conversationReviewed!==true)conversationFail('INVALID_CONVERSATION_CONSENT','Record the exact approved processor notice and conversation review receipt.');
  const fields=conversationArray(consent.approvedFields,FACT_KEYS.length);
  if(fields.some(field=>typeof field!=='string'||!FACT_KEYS.includes(field))||new Set(fields).size!==fields.length||JSON.stringify([...fields].sort())!==JSON.stringify(Object.keys(facts).sort()))conversationFail('INVALID_CONVERSATION_CONSENT','The consent receipt must identify exactly the approved fact fields.');
}
const conversationEventFields=['kind','jobId','answer','answerKind','sourceIds','followUpQuestions','nextSteps','limitations','sourceReceipt','errorCode'];
const conversationTurnFields=['question','history','historyTurnIds','knowledgeIds','facts','replyToId','consent'];
const conversationEventDefaults=()=>({jobId:null,answer:null,answerKind:null,sourceIds:[],followUpQuestions:[],nextSteps:[],limitations:[],sourceReceipt:[],errorCode:null});
const conversationNotice='Reviewed question and case facts, with source receipts. AI can be wrong; verify applicability before acting. A conversation does not submit a claim, contact anyone, establish entitlement or change your case facts. Privacy pattern checks do not certify de-identification.';
function conversationCheckEvent(event,turn){
  if(!['job','completed','failed','canceled'].includes(event.kind))conversationFail('INVALID_CONVERSATION_EVENT','Choose a supported conversation event.');
  if(event.kind==='job'){
    if(typeof event.jobId!=='string'||!/^job_[a-f0-9]{32}$/.test(event.jobId))conversationFail('INVALID_CONVERSATION_JOB','Use the returned processing job identifier.');
    if(turn.consent===null)conversationFail('INVALID_CONVERSATION_CONSENT','A cloud job requires the original approved consent receipt.');
  }else if(event.jobId!==null)conversationFail('INVALID_CONVERSATION_EVENT','Only a job event may bind a processing job.');
  if(event.kind==='failed'){
    if(typeof event.errorCode!=='string'||!/^[A-Z][A-Z0-9_]{0,79}$/.test(event.errorCode))conversationFail('INVALID_CONVERSATION_ERROR','Use a supported machine error code without provider text.');
  }else if(event.errorCode!==null)conversationFail('INVALID_CONVERSATION_EVENT','Only a failed event may record an error code.');
  if(event.kind==='completed'){
    conversationText(event.answer,CONVERSATION_LIMITS.answer);if(!['cloud','library'].includes(event.answerKind))conversationFail('INVALID_CONVERSATION_EVENT','Identify a cloud answer or an honestly labelled local library result.');
    if(event.answerKind==='cloud'&&turn.consent===null)conversationFail('INVALID_CONVERSATION_CONSENT','A cloud answer requires the original approved consent receipt.');
    const receiptIds=conversationCheckReceipts(event.sourceReceipt),sourceIds=conversationIdentifiers(event.sourceIds,CONVERSATION_LIMITS.sourceIds);
    if(sourceIds.some(id=>!receiptIds.has(id))||(event.answerKind==='cloud'&&(!receiptIds.size||!sourceIds.length)))conversationFail('INVALID_CONVERSATION_SOURCE','Answer citations must belong to the recorded grounding sources.');
    for(const question of conversationArray(event.followUpQuestions,CONVERSATION_LIMITS.followUpQuestions))conversationText(question,500);
    for(const step of conversationArray(event.nextSteps,CONVERSATION_LIMITS.nextSteps)){
      conversationObject(step,['title','steps','sourceIds']);conversationText(step.title,200);
      const steps=conversationArray(step.steps,6);if(!steps.length)conversationFail('INVALID_CONVERSATION_EVENT','A suggested next step must contain its instructions.');for(const text of steps)conversationText(text,1000);
      if(conversationIdentifiers(step.sourceIds,CONVERSATION_LIMITS.sourceIds).some(id=>!sourceIds.includes(id)))conversationFail('INVALID_CONVERSATION_SOURCE','Next-step citations must also appear in the answer citations.');
    }
    for(const limitation of conversationArray(event.limitations,CONVERSATION_LIMITS.limitations))conversationText(limitation,1000);
  }else{
    if(event.answer!==null||event.answerKind!==null)conversationFail('INVALID_CONVERSATION_EVENT','Only completion events can contain an answer.');
    for(const field of ['sourceIds','followUpQuestions','nextSteps','limitations','sourceReceipt'])if(conversationArray(event[field],0).length)conversationFail('INVALID_CONVERSATION_EVENT','Only completion events can contain answer data.');
  }
}
export function createConversation(){return {version:CONVERSATION_VERSION,turns:[]};}
export function validateConversation(input){
  if(input===undefined)return createConversation();conversationObject(input,['version','turns']);if(input.version!==CONVERSATION_VERSION)conversationFail('CONVERSATION_VERSION_UNSUPPORTED','This conversation version needs a supported migration.');
  const seen=new Set(),earlierTurns=new Map();let previousTurnAt=null;
  for(const turn of conversationArray(input.turns,CONVERSATION_LIMITS.turns)){
    conversationObject(turn,['id','createdAt',...conversationTurnFields,'events']);conversationCommon(turn,seen,previousTurnAt);previousTurnAt=turn.createdAt;
    conversationReviewedPayload({question:turn.question,history:turn.history,knowledgeIds:turn.knowledgeIds});const facts=conversationFacts(turn.facts);conversationCheckConsent(turn.consent,facts);
    if(turn.replyToId!==null){conversationId(turn.replyToId);if(!earlierTurns.has(turn.replyToId))conversationFail('INVALID_CONVERSATION_REPLY','Choose an earlier turn from this conversation as the follow-up reference.');}
    conversationArray(turn.historyTurnIds,4);
    if(turn.historyTurnIds.length!==turn.history.length||new Set(turn.historyTurnIds).size!==turn.historyTurnIds.length)conversationFail('INVALID_CONVERSATION_HISTORY','Every reviewed context pair needs its distinct originating turn.');
    for(const id of turn.historyTurnIds){
      conversationId(id);const origin=earlierTurns.get(id),answer=origin?.events.find(event=>event.kind==='completed');
      if(!origin||answer?.answerKind!=='cloud'||conversationFactsChanged(origin.facts,facts))conversationFail('INVALID_CONVERSATION_HISTORY','Context must come from earlier completed cloud turns with the same approved facts.');
    }
    let previousAt=turn.createdAt,hasJob=false,terminal=false;
    for(const event of conversationArray(turn.events,CONVERSATION_LIMITS.events)){
      conversationObject(event,['id','createdAt',...conversationEventFields]);conversationCommon(event,seen,previousAt);previousAt=event.createdAt;
      if(terminal)conversationFail('CONVERSATION_TURN_FINISHED','This turn is finished. A new request needs a new reviewed turn.');
      conversationCheckEvent(event,turn);
      if(event.kind==='job'){if(hasJob)conversationFail('CONVERSATION_JOB_ALREADY_BOUND','This turn already has a processing job.');hasJob=true;}
      else terminal=true;
    }
    earlierTurns.set(turn.id,turn);
  }
  let encoded;try{encoded=JSON.stringify(input);}catch{conversationFail('INVALID_CONVERSATION_DATA','Use plain serializable conversation records.');}
  if(encoded.length>CONVERSATION_LIMITS.serializedCharacters)conversationFail('CONVERSATION_LIMIT','This conversation exceeds the local record size limit.');return JSON.parse(encoded);
}
function conversationTurn(state,id){conversationId(id);const turn=state.turns.find(item=>item.id===id);if(!turn)conversationFail('CONVERSATION_TURN_NOT_FOUND','This turn is not in the selected case conversation.');return turn;}
export function addConversationTurn(input,fields,options={}){
  conversationObject(fields,conversationTurnFields,['question','history','knowledgeIds','facts']);const state=validateConversation(input);
  const payload=conversationReviewedPayload({question:fields.question,history:fields.history,knowledgeIds:fields.knowledgeIds});const facts=conversationFacts(fields.facts);
  state.turns.push({...conversationStamp(options),...payload,historyTurnIds:Object.hasOwn(fields,'historyTurnIds')?fields.historyTurnIds:[],facts,replyToId:Object.hasOwn(fields,'replyToId')?fields.replyToId:null,consent:Object.hasOwn(fields,'consent')?fields.consent:null,events:[]});return validateConversation(state);
}
export function appendConversationEvent(input,turnId,fields,options={}){
  conversationObject(fields,conversationEventFields,['kind']);const state=validateConversation(input),turn=conversationTurn(state,turnId);
  turn.events.push({...conversationStamp(options),...conversationEventDefaults(),...fields});return validateConversation(state);
}
export function conversationFactsChanged(snapshot,current){return JSON.stringify(conversationFacts(snapshot))!==JSON.stringify(conversationFacts(current));}
export function conversationSourcesCurrent(receipts,options={}){
  conversationObject(options,['now'],[]);const now=Object.hasOwn(options,'now')?options.now:new Date();
  conversationCheckReceipts(receipts);if(!receipts.length)return false;
  let time;try{time=new Date(now).getTime();}catch{return false;}if(!Number.isFinite(time))return false;
  return receipts.every(receipt=>{const source=getSource(receipt.id,{now:new Date(time)});return source?.current===true&&source.reviewedAt===receipt.reviewedAt&&source.expiresAt===receipt.expiresAt;});
}
function conversationContextEligible(state,turn,facts,now,checked=new Set()){
  if(facts===null||conversationFactsChanged(turn.facts,facts))return false;
  if(checked.has(turn.id))return true;checked.add(turn.id);
  return turn.historyTurnIds.every(id=>{
    const origin=state.turns.find(item=>item.id===id),answer=origin?.events.find(event=>event.kind==='completed');
    return answer?.answerKind==='cloud'&&!conversationFactsChanged(origin.facts,facts)&&conversationSourcesCurrent(answer.sourceReceipt,{now})&&conversationContextEligible(state,origin,facts,now,checked);
  });
}
export function conversationTurnContextCurrent(input,turnId,options={}){
  conversationObject(options,['facts','now'],['facts']);const state=validateConversation(input),turn=conversationTurn(state,turnId),facts=conversationFacts(options.facts),now=Object.hasOwn(options,'now')?options.now:new Date();
  return !turn.events.some(event=>event.kind!=='job')&&conversationContextEligible(state,turn,facts,now);
}
export function summarizeConversation(input,options={}){
  conversationObject(options,['facts','now'],[]);const state=validateConversation(input),currentFacts=Object.hasOwn(options,'facts')?conversationFacts(options.facts):null,now=Object.hasOwn(options,'now')?options.now:new Date();
  const turns=state.turns.map(turn=>{
    const job=turn.events.find(event=>event.kind==='job'),terminal=turn.events.find(event=>event.kind!=='job');
    const status=terminal?.kind??'pending',completed=status==='completed'?terminal:null;
    const factsChanged=currentFacts===null?null:conversationFactsChanged(turn.facts,currentFacts);
    const sourcesCurrent=completed?conversationSourcesCurrent(completed.sourceReceipt,{now}):false;
    const contextCurrent=conversationContextEligible(state,turn,currentFacts,now);
    const answerAvailable=Boolean(completed&&factsChanged===false&&sourcesCurrent&&contextCurrent);
    let canUseAsContext=answerAvailable&&completed.answerKind==='cloud';
    if(canUseAsContext)try{validateConversationRequest({question:turn.question,history:[{question:turn.question,answer:completed.answer}],knowledgeIds:[]});}catch{canUseAsContext=false;}
    const limitations=answerAvailable?[...completed.limitations]:completed?[factsChanged===null?'Select the current approved facts before reusing this historical answer.':factsChanged?'The approved facts have changed. This historical answer is withheld from current guidance and context.':'One or more answer or original-context source receipts are stale, changed or unavailable. This historical answer is withheld from current guidance and context.']:[];
    if(answerAvailable&&!canUseAsContext)limitations.push(completed.answerKind==='library'?'This is a local library response. Cloud conversation context currently uses completed cloud turns only.':'This answer needs another text privacy review before it can be included in outbound conversation context.');
    return {id:turn.id,createdAt:turn.createdAt,replyToId:turn.replyToId,question:turn.question,status,jobId:job?.jobId??null,terminalEventId:terminal?.id??null,errorCode:terminal?.errorCode??null,
      answerKind:completed?.answerKind??null,sourceIds:completed?.sourceIds??[],sourceReceipt:completed?.sourceReceipt??[],factsChanged,sourcesCurrent,contextCurrent,answerAvailable,canUseAsContext,
      answer:answerAvailable?completed.answer:null,followUpQuestions:answerAvailable?completed.followUpQuestions:[],nextSteps:answerAvailable?completed.nextSteps:[],limitations};
  });return {version:CONVERSATION_VERSION,turns,notice:conversationNotice};
}
