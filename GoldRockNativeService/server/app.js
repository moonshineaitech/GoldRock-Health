import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { makeConfig, publicConfig } from './config.js';
import { openStore, transaction, audit } from './store.js';
import { HttpError, id, token, digest, exactKeys, plainText, integer, emailAddress, hashPassword, verifyPassword, readJson, rateLimiter } from './security.js';
import { createSession, setSessionCookie, getSession, requireSession, sessionView, requireOrganization, confirmPassword, isActiveContract } from './auth.js';
import { Jobs } from './jobs.js';
import { sources } from '../shared/sources.js';
import { getPublicResearchCatalog, lookupHospitalPolicy } from './public-research.js';
import { createRecoveryCode, revokeRecoveryCode, recoverAccount, changeAccountPassword } from './account-security.js';

const iso = value => value == null ? null : new Date(value).toISOString();
const MIME = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.wasm':'application/wasm','.gz':'application/gzip','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8' };

export function createApplication(options = {}) {
  const config = options.config || makeConfig();
  const db = options.db || openStore(config);
  const jobs = new Jobs(db, config, options.jobs);
  const limit = rateLimiter();
  let closed = false;

  function json(res, status, body) { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store' }); res.end(JSON.stringify(body)); }
  function viewSession(session, accessToken) {
    const view = sessionView(db, session, accessToken);
    view.benefits = view.benefits.map(b => ({ ...b, endsAt: iso(b.endsAt) }));
    return view;
  }
  function orgView(actorId, orgId) {
    const org = requireOrganization(db, actorId, orgId);
    const invites = db.prepare('SELECT id,expires_at,max_uses,revoked FROM invites WHERE organization_id=? ORDER BY expires_at DESC').all(orgId).map(row => ({ id:row.id,expiresAt:iso(row.expires_at),uses:row.max_uses,revoked:Boolean(row.revoked) }));
    // Intentionally no member names, activation lists, health jobs or utilization joins.
    return { organization: { id:org.id,name:org.name,status:org.status,eligibleCount:org.eligible_count,priceCents:org.price_cents }, roles:[org.role],invites,
      invoicePreview: { monthlyCents:org.eligible_count*org.price_cents,annualCents:org.eligible_count*org.price_cents*12,currency:'USD',basis:'eligible_employee_month',charged:false } };
  }
  async function loginResponse(req, res, userId) {
    const created = createSession(db, config, userId);
    setSessionCookie(res, config, created.accessToken);
    const session = getSession({ headers:{ authorization:`Bearer ${created.accessToken}` } }, db);
    json(res, 200, viewSession(session, req.headers['x-goldrock-client']==='native' ? created.accessToken : null));
  }

  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Permissions-Policy','camera=(self), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; worker-src 'self' blob:; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    if (config.environment==='production') res.setHeader('Strict-Transport-Security','max-age=31536000');
    const requestId = id('req');
    try {
      const origin = new URL(config.origin);
      const allowedHosts = new Set([origin.host]);
      if (config.environment !== 'production') {
        allowedHosts.add(`127.0.0.1:${config.port}`); allowedHosts.add(`localhost:${config.port}`);
      }
      if (!allowedHosts.has(req.headers.host)) throw new HttpError(421,'UNEXPECTED_HOST','Use the configured application address.');
      const incoming = new URL(req.url, config.origin);
      let route;
      try { route=decodeURIComponent(incoming.pathname); } catch { throw new HttpError(400,'INVALID_PATH','Invalid request path.'); }
      const method=req.method;
      // The first-iPhone presentation embeds the working app.
      if (route==='/app.html' && (method==='GET'||method==='HEAD')) {
        res.setHeader('X-Frame-Options','SAMEORIGIN');
        res.setHeader('Content-Security-Policy', String(res.getHeader('Content-Security-Policy')).replace("frame-ancestors 'none'", "frame-ancestors 'self'"));
      }
      if (!['GET','HEAD','POST','PATCH','DELETE'].includes(method)) throw new HttpError(405,'METHOD_NOT_ALLOWED','This method is not supported.');
      if (['POST','PATCH','DELETE'].includes(method)) {
        const requestOrigin=req.headers.origin;
        if (requestOrigin && requestOrigin !== `${origin.protocol}//${req.headers.host}`) throw new HttpError(403,'ORIGIN_REJECTED','This request came from another site.');
        if (req.headers['sec-fetch-site']==='cross-site') throw new HttpError(403,'ORIGIN_REJECTED','Cross-site requests are not allowed.');
      }
      const ip=req.socket.remoteAddress || 'unknown';
      if (route.startsWith('/api/')) limit(`api:${ip}`,300);
      if (route==='/api/config' && method==='GET') return json(res,200,publicConfig(config));
      if (route==='/api/sources' && method==='GET') return json(res,200,{sources});
      if (route==='/api/research/catalog' && method==='GET') return json(res,200,{providers:getPublicResearchCatalog()});
      if (route==='/api/research/lookup' && method==='POST') {
        limit(`public-research:${ip}`,10);
        const body=await readJson(req,2048);exactKeys(body,['providerId','consent'],['providerId','consent']);
        const controller=new AbortController();const onClosed=()=>{if(!res.writableFinished)controller.abort();};res.on('close',onClosed);
        try { const research=await lookupHospitalPolicy(body,{signal:controller.signal});return json(res,200,{research}); }
        finally { res.off('close',onClosed); }
      }
      if (route==='/api/session' && method==='GET') return json(res,200,viewSession(getSession(req,db)));
      if(route==='/api/auth/recover' && method==='POST') {
        limit(`auth:${ip}`,config.environment==='test'?100:10);
        const body=await readJson(req,4096);
        if(typeof body.email==='string')limit(`recovery-account:${digest(body.email.trim().toLowerCase())}`,5);
        const recovered=await recoverAccount(db,body);return await loginResponse(req,res,recovered.userId);
      }
      if(route==='/api/account/recovery-code' && ['POST','DELETE'].includes(method)) {
        const session=requireSession(req,db,true);limit(`account-security:${session.user_id}`,5);
        const body=await readJson(req,4096);
        const result=method==='POST'?await createRecoveryCode(db,session.user_id,body):await revokeRecoveryCode(db,session.user_id,body);
        return json(res,200,result);
      }
      if(route==='/api/account/password' && method==='POST') {
        const session=requireSession(req,db,true);limit(`account-security:${session.user_id}`,5);
        const changed=await changeAccountPassword(db,session.user_id,await readJson(req,4096));return await loginResponse(req,res,changed.userId);
      }
      if (['/api/auth/register','/api/auth/login'].includes(route) && method==='POST') {
        limit(`auth:${ip}`,config.environment==='test'?100:10);
        const body=await readJson(req,4096);
        exactKeys(body,route.endsWith('register')?['email','password','displayName']:['email','password'],route.endsWith('register')?['email','password','displayName']:['email','password']);
        const email=emailAddress(body.email);
        if (route.endsWith('register')) {
          const name=plainText(body.displayName,1,80), passwordHash=await hashPassword(body.password), userId=id('usr');
          try { db.prepare('INSERT INTO users VALUES(?,?,?,?,?)').run(userId,email,name,passwordHash,Date.now()); }
          catch(error) { if (String(error.code).includes('SQLITE') || String(error.message).includes('UNIQUE')) throw new HttpError(409,'ACCOUNT_UNAVAILABLE','An account cannot be created with these details. Try signing in.'); throw error; }
          audit(db,userId,'account.created');
          return await loginResponse(req,res,userId);
        }
        const user=db.prepare('SELECT id,password_hash FROM users WHERE email=?').get(email);
        const valid=await verifyPassword(body.password,user?.password_hash);
        if (!valid || !user) throw new HttpError(401,'SIGN_IN_FAILED','The email or password was not accepted.');
        return await loginResponse(req,res,user.id);
      }
      if (route==='/api/auth/logout' && method==='POST') {
        const session=requireSession(req,db,true); exactKeys(await readJson(req),[]);
        db.prepare('DELETE FROM sessions WHERE token_hash=?').run(session.token_hash);setSessionCookie(res,config,'');
        return json(res,200,{signedOut:true});
      }
      if (route==='/api/account' && method==='DELETE') {
        const session=requireSession(req,db,true), body=await readJson(req,4096);exactKeys(body,['password'],['password']);
        await confirmPassword(db,session.user_id,body.password);
        const owned=db.prepare("SELECT r.organization_id FROM organization_roles r WHERE r.user_id=? AND r.role='owner' AND (SELECT count(*) FROM organization_roles x WHERE x.organization_id=r.organization_id AND x.role='owner')=1").all(session.user_id);
        if (owned.length) throw new HttpError(409,'ORGANIZATION_OWNER','Close your employer organization or transfer ownership before deleting its last owner account.');
        transaction(db,()=>{jobs.removeActor(session.user_id);db.prepare('DELETE FROM audit_events WHERE actor_id=?').run(session.user_id);db.prepare('DELETE FROM users WHERE id=?').run(session.user_id);});
        jobs.flushRemnants();
        setSessionCookie(res,config,'');return json(res,200,{deleted:true,localActionRequired:'Clear this account’s local vault on each device. Exported copies remain outside this service.'});
      }
      if (route==='/api/jobs' && method==='POST') {
        const session=requireSession(req,db,true),body=await readJson(req,32768);
        return json(res,202,{job:jobs.create(session.user_id,body,req.headers['idempotency-key'])});
      }
      if (route==='/api/conversations' && method==='POST') {
        const session=requireSession(req,db,true),body=await readJson(req,131072);
        return json(res,202,{job:jobs.create(session.user_id,body,req.headers['idempotency-key'],'conversation')});
      }
      const operationMatch=route.match(/^\/api\/jobs\/by-operation\/([A-Za-z0-9_-]{8,80})$/);
      if(operationMatch&&['GET','DELETE'].includes(method)){
        const session=requireSession(req,db,method==='DELETE');
        if(method==='DELETE'){exactKeys(await readJson(req),[]);return json(res,200,jobs.deleteOperation(session.user_id,operationMatch[1]));}
        return json(res,200,{job:jobs.getOperation(session.user_id,operationMatch[1])});
      }
      const jobMatch=route.match(/^\/api\/jobs\/(job_[a-f0-9]{32})$/);
      if (jobMatch && ['GET','DELETE'].includes(method)) {
        const session=requireSession(req,db,method==='DELETE');
        if (method==='DELETE') { exactKeys(await readJson(req),[]);return json(res,200,jobs.delete(session.user_id,jobMatch[1])); }
        return json(res,200,{job:jobs.get(session.user_id,jobMatch[1])});
      }
      if (route==='/api/organizations' && method==='POST') {
        const session=requireSession(req,db,true),body=await readJson(req,4096);exactKeys(body,['name','eligibleCount'],['name','eligibleCount']);
        const name=plainText(body.name,2,100),count=integer(body.eligibleCount,1,1000000),orgId=id('org');
        if (db.prepare('SELECT count(*) n FROM organization_roles WHERE user_id=?').get(session.user_id).n>=10) throw new HttpError(429,'ORGANIZATION_LIMIT','Contact support before creating more organizations.');
        transaction(db,()=>{db.prepare('INSERT INTO organizations VALUES(?,?,?,?,?,?)').run(orgId,name,'draft',count,800,Date.now());db.prepare('INSERT INTO organization_roles VALUES(?,?,?)').run(orgId,session.user_id,'owner');audit(db,session.user_id,'organization.created',orgId);});
        return json(res,201,orgView(session.user_id,orgId));
      }
      const orgMatch=route.match(/^\/api\/organizations\/(org_[a-f0-9]{32})(?:\/(.*))?$/);
      if (orgMatch) {
        const session=requireSession(req,db,method!=='GET'),orgId=orgMatch[1],suffix=orgMatch[2]||'',org=requireOrganization(db,session.user_id,orgId);
        if (!suffix && method==='GET') return json(res,200,orgView(session.user_id,orgId));
        if (!suffix && method==='PATCH') {
          const body=await readJson(req,4096);exactKeys(body,['name','eligibleCount']);
          const count=body.eligibleCount===undefined?org.eligible_count:integer(body.eligibleCount,1,1000000);
          const enrolled=db.prepare("SELECT count(*) n FROM benefits WHERE organization_id=? AND status='active'").get(orgId).n;
          if (count<enrolled) throw new HttpError(409,'ELIGIBILITY_CAPACITY','Eligible capacity cannot be lower than existing sponsorships. End the relevant sponsorships first.');
          db.prepare('UPDATE organizations SET name=?,eligible_count=? WHERE id=?').run(body.name===undefined?org.name:plainText(body.name,2,100),count,orgId);
          audit(db,session.user_id,'organization.updated',orgId);return json(res,200,orgView(session.user_id,orgId));
        }
        if (!suffix && method==='DELETE') {
          const body=await readJson(req,4096);exactKeys(body,['password'],['password']);await confirmPassword(db,session.user_id,body.password);
          if (org.role!=='owner') throw new HttpError(403,'OWNER_REQUIRED','Only an organization owner can close it.');
          transaction(db,()=>{db.prepare("UPDATE benefits SET status='ended',ends_at=? WHERE organization_id=?").run(Date.now(),orgId);db.prepare('UPDATE invites SET revoked=1 WHERE organization_id=?').run(orgId);db.prepare("UPDATE organizations SET status='closed' WHERE id=?").run(orgId);db.prepare('DELETE FROM organization_roles WHERE organization_id=?').run(orgId);audit(db,session.user_id,'organization.closed',orgId);});
          return json(res,200,{closed:true,note:'Sponsorship ended. Personal accounts and their device-local cases are unchanged.'});
        }
        if (suffix==='activate-development' && method==='POST') {
          exactKeys(await readJson(req),[]);
          if (config.environment==='production') throw new HttpError(403,'DEVELOPMENT_ONLY','A real contract must be activated through an approved billing integration.');
          if (org.status==='closed') throw new HttpError(409,'ORGANIZATION_CLOSED','Create a new organization rather than reopening a closed contract.');
          db.prepare("UPDATE organizations SET status='active_development' WHERE id=?").run(orgId);audit(db,session.user_id,'contract.development_activation',orgId);
          return json(res,200,orgView(session.user_id,orgId));
        }
        if (suffix==='invites' && method==='POST') {
          const body=await readJson(req,4096);exactKeys(body,['expiresInDays','uses'],['expiresInDays','uses']);
          if (!isActiveContract(org.status,config.environment)) throw new HttpError(409,'CONTRACT_INACTIVE','Activate the benefit contract before creating invitations.');
          const days=integer(body.expiresInDays,1,30),uses=integer(body.uses,1,Math.min(org.eligible_count,10000)),inviteToken=token(),inviteId=id('inv'),expires=Date.now()+days*86400000;
          db.prepare('INSERT INTO invites VALUES(?,?,?,?,?,?,?)').run(inviteId,orgId,digest(inviteToken),expires,uses,0,0);audit(db,session.user_id,'eligibility.invite_created',orgId);
          return json(res,201,{invite:{id:inviteId,token:inviteToken,expiresAt:iso(expires),uses}});
        }
        const inviteMatch=suffix.match(/^invites\/(inv_[a-f0-9]{32})$/);
        if (inviteMatch && method==='DELETE') {
          exactKeys(await readJson(req),[]);
          const update=db.prepare('UPDATE invites SET revoked=1 WHERE id=? AND organization_id=?').run(inviteMatch[1],orgId);
          if (!update.changes) throw new HttpError(404,'NOT_FOUND','The invitation was not found.');
          audit(db,session.user_id,'eligibility.invite_revoked',orgId);return json(res,200,{revoked:true});
        }
        throw new HttpError(404,'NOT_FOUND','That employer operation was not found.');
      }
      if (route==='/api/benefits/redeem' && method==='POST') {
        const session=requireSession(req,db,true),body=await readJson(req,4096);exactKeys(body,['token'],['token']);limit(`redeem:${session.user_id}`,20);
        if (typeof body.token!=='string'|| !/^[A-Za-z0-9_-]{43}$/.test(body.token)) throw new HttpError(422,'INVITE_INVALID','The invitation is invalid or no longer available.');
        transaction(db,()=>{
          const invite=db.prepare(`SELECT i.*,o.status AS contract_status,o.eligible_count FROM invites i JOIN organizations o ON o.id=i.organization_id WHERE token_hash=?`).get(digest(body.token));
          if (!invite || invite.revoked || invite.expires_at<=Date.now() || invite.used>=invite.max_uses || !isActiveContract(invite.contract_status,config.environment)) throw new HttpError(422,'INVITE_INVALID','The invitation is invalid or no longer available.');
          const current=db.prepare('SELECT id,status FROM benefits WHERE user_id=? AND organization_id=?').get(session.user_id,invite.organization_id);
          if (current?.status==='active') return;
          const assigned=db.prepare("SELECT count(*) n FROM benefits WHERE organization_id=? AND status='active'").get(invite.organization_id).n;
          if (assigned>=invite.eligible_count) throw new HttpError(409,'BENEFIT_FULL','This benefit has reached its eligible capacity. Contact the benefit administrator without sharing medical information.');
          if (current) db.prepare("UPDATE benefits SET status='active',ends_at=NULL WHERE id=?").run(current.id);
          else db.prepare('INSERT INTO benefits(id,user_id,organization_id,status) VALUES(?,?,?,?)').run(id('ben'),session.user_id,invite.organization_id,'active');
          db.prepare('UPDATE invites SET used=used+1 WHERE id=?').run(invite.id);
        });
        return json(res,200,viewSession(session));
      }
      const benefitMatch=route.match(/^\/api\/benefits\/(ben_[a-f0-9]{32})$/);
      if (benefitMatch && method==='DELETE') {
        const session=requireSession(req,db,true);exactKeys(await readJson(req),[]);
        const update=db.prepare("UPDATE benefits SET status='ended',ends_at=? WHERE id=? AND user_id=?").run(Date.now(),benefitMatch[1],session.user_id);
        if (!update.changes) throw new HttpError(404,'NOT_FOUND','The sponsorship was not found.');
        return json(res,200,{ended:true});
      }
      if (route.startsWith('/api/')) throw new HttpError(404,'NOT_FOUND','That operation was not found.');
      if (!['GET','HEAD'].includes(method)) throw new HttpError(405,'METHOD_NOT_ALLOWED','Only document navigation is supported here.');
      const shared=route.startsWith('/shared/');
      const root=path.resolve(config.root,shared?'shared':'web');
      const publicPage=route==='/site'||route.startsWith('/site/');
      const relative=shared?route.slice('/shared/'.length):route==='/'?'iphone.html':route==='/app.html'?'index.html':publicPage?'site.html':route.slice(1);
      const file=path.resolve(root,relative);
      if (!file.startsWith(root+path.sep) || path.basename(file).startsWith('.') || /(?:^|[\\/])\./.test(relative)) throw new HttpError(404,'NOT_FOUND','That file was not found.');
      const real=await fs.promises.realpath(file).catch(()=>null);
      if (!real || !real.startsWith(root+path.sep)) throw new HttpError(404,'NOT_FOUND','That file was not found.');
      const stat=await fs.promises.stat(real);
      if (!stat.isFile()) throw new HttpError(404,'NOT_FOUND','That file was not found.');
      res.writeHead(200,{'Content-Type':MIME[path.extname(real)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':route.startsWith('/vendor/')?'public,max-age=86400':'no-cache'});
      if(method==='HEAD')return res.end();
      const stream=fs.createReadStream(real);stream.on('error',()=>res.destroy());stream.pipe(res);
    } catch (error) {
      if(res.headersSent)return res.destroy();
      const known=error instanceof HttpError || error.code==='INVALID_FACTS';
      // Log only error class and request correlation, never body/URL query/vendor response.
      if (!known) console.error(JSON.stringify({event:'request.failed',requestId,kind:'internal'}));
      json(res,error.status||(error.code==='INVALID_FACTS'?422:500),{error:{code:known?error.code:'INTERNAL_ERROR',message:known?error.message:'The request could not be completed. Try again.',requestId}});
    }
  });
  server.requestTimeout=30000;server.headersTimeout=15000;server.maxHeadersCount=40;
  function close() { if(closed)return;closed=true;jobs.close();server.close();db.close(); }
  return {server,db,jobs,config,close};
}
