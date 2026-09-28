import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { request as httpsRequest } from 'node:https';
import { createHash } from 'node:crypto';
import { HttpError, exactKeys } from './security.js';

const REVIEWED_AT = '2026-09-27T00:00:00.000Z';
const EXPIRES_AT = '2026-12-27T00:00:00.000Z';
const MAX_BYTES = 2_000_000;
const MAX_TEXT = 18_000;
const TIMEOUT_MS = 10_000;
const provider = (id, name, stateScope, policyUrl, alternateUrls, linkRoutes, scopeNotes=[]) => Object.freeze({ id, name, stateScope: Object.freeze(stateScope), policyUrl, alternateUrls: Object.freeze(alternateUrls), linkRoutes: Object.freeze(linkRoutes), scopeNotes:Object.freeze(scopeNotes), reviewedAt: REVIEWED_AT, expiresAt: EXPIRES_AT });
const CATALOG = Object.freeze([
  provider('mayo', 'Mayo Clinic', ['AZ', 'FL', 'MN'], 'https://www.mayoclinic.org/billing-insurance/financial-assistance', [], [
    { host:'www.mayoclinic.org', prefix:'/billing-insurance/financial-assistance' },
    { host:'mcforms.mayo.edu', prefix:'/mc4200-mc4299/' },
  ]),
  provider('cleveland', 'Cleveland Clinic', ['OH', 'NV', 'FL'], 'https://my.clevelandclinic.org/patients/billing-finance/financial-assistance', [], [
    { host:'my.clevelandclinic.org', prefix:'/patients/billing-finance/financial-assistance' },
    { host:'my.clevelandclinic.org', prefix:'/-/scassets/files/org/patients-visitors/billing/' },
  ]),
  provider('stanford', 'Stanford Health Care', ['CA'], 'https://stanfordhealthcare.org/for-patients-visitors/financial-assistance.html', ['https://stanfordhealthcare.org/for-patients-visitors/billing/financial-assistance.html'], [
    { host:'stanfordhealthcare.org', prefix:'/for-patients-visitors/financial-assistance' },
    { host:'stanfordhealthcare.org', prefix:'/content/dam/SHC/patientsandvisitors/' },
  ]),
  provider('northwestern', 'Northwestern Medicine', ['IL'], 'https://www.nm.org/patients-and-visitors/billing-and-insurance/financial-assistance', [], [
    {host:'www.nm.org',prefix:'/patients-and-visitors/billing-and-insurance/financial-assistance'},
    {host:'www.nm.org',prefix:'/-/media/northwestern/resources/patients-and-visitors/billing-and-insurance/financial-assistance/'},
    {host:'www.nm.org',prefix:'/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/'},
  ], ['Check whether the physician or other non-hospital biller participates; a hospital approval may not cover that separate bill.', 'Ask which supporting documents remain missing and retain acknowledgement of the completed application.']),
  provider('johns-hopkins', 'Johns Hopkins Medicine', ['MD','DC','FL'], 'https://www.hopkinsmedicine.org/patient-care/patients-visitors/billing-insurance/financial-assistance', [], [
    {host:'www.hopkinsmedicine.org',prefix:'/patient-care/patients-visitors/billing-insurance/financial-assistance'},
    {host:'www.hopkinsmedicine.org',prefix:'/-/media/patient-care/documents/billing-insurance/'},
  ], ['Check the facility-specific appendix, particularly Sibley, All Children’s or Care at Home.', 'Use the application’s current submission instructions. An initial response may still require supporting documents before a final decision.']),
  provider('mass-general-brigham', 'Mass General Brigham', ['MA','NH'], 'https://www.massgeneralbrigham.org/en/patients-visitors/billing-insurance/billing/financial-assistance', [], [
    {host:'www.massgeneralbrigham.org',prefix:'/en/patients-visitors/billing-insurance/billing/financial-assistance'},
    {host:'www.massgeneralbrigham.org',prefix:'/content/dam/unified-xwalk/documents/en/patients-visitors/'},
    {host:'www.massgeneralbrigham.org',prefix:'/content/dam/mgb-global/en/patient-care/patient-and-visitor-information/financial-assistance/'},
  ], ['Ask which program applies to the bill: discount, state assistance and payment-plan criteria differ.', 'Compare the full policy, facility/provider list and service date; an interest-free plan is not a reduction in the balance.']),
  provider('uchealth-colorado', 'UCHealth (Colorado)', ['CO'], 'https://www.uchealth.org/billing-and-pricing/financial-assistance/', [], [
    {host:'www.uchealth.org',prefix:'/billing-and-pricing/financial-assistance'},
    {host:'www.uchealth.org',prefix:'/about/uchealth-visitation-policy/uchealth-financial-assistance'},
  ], ['UCHealth in Colorado is different from UC Health in Ohio. Confirm the exact facility and its provider list.', 'Ask about both hospital financial assistance and Colorado Hospital Discounted Care; their criteria are not interchangeable.']),
  provider('ucla', 'UCLA Health', ['CA'], 'https://www.uclahealth.org/patient-resources/billing-insurance/patient-financial-assistance-program', [], [
    {host:'www.uclahealth.org',prefix:'/patient-resources/billing-insurance/patient-financial-assistance-program'},
    {host:'www.uclahealth.org',prefix:'/workfiles/patientbilling/'},
  ], ['Confirm the services were provided and billed by UCLA Health and which hospital or physician policy applies.', 'If assistance is denied, request the written reason and review the official page’s Hospital Bill Complaint Program information.']),
  provider('providence', 'Providence', ['AK','CA','MT','NM','OR','TX','WA'], 'https://www.providence.org/billing-support/help-paying-your-bill', [], [
    {host:'www.providence.org',prefix:'/billing-support/help-paying-your-bill'},
    {host:'www.providence.org',prefix:'/billing-support/financial-assistance-application-support'},
    {host:'www.providence.org',prefix:'/-/media/Project/psjh/shared/Files/financial-assistance/'},
  ], ['Select the state where care was received, then the exact facility; the policy selector is not simply your home address.', 'Check separately billed community providers. Confirm receipt of an application and the actual scope of any billing hold.']),
  provider('nyu-langone', 'NYU Langone Health', ['NY'], 'https://nyulangone.org/insurance-billing-financial-assistance', [], [
    {host:'nyulangone.org',prefix:'/insurance-billing-financial-assistance'},
    {host:'nyulangone.org',prefix:'/files/'},
  ], ['Separate hospital, emergency and physician bills before requesting assistance or a correction.', 'Confirm the specific plan network and the applicable hospital assistance policy; a system’s general insurance list is not a personal coverage decision.']),
  provider('baylor-scott-white', 'Baylor Scott & White Health', ['TX'], 'https://www.bswhealth.com/patient-tools/registration-and-billing/financial-assistance/program', [], [
    {host:'www.bswhealth.com',prefix:'/patient-tools/registration-and-billing/financial-assistance/'},
  ], ['Check the hospital versus non-hospital policy and Attachment C for separately billed professionals.', 'Ask for the policy and poverty-guideline year applicable to your care. The reviewed overview displays a 2025 table; it is not a verified current-dollar eligibility calculator.']),
]);

export function getPublicResearchCatalog({now=new Date()}={}) {
  const time=new Date(now).getTime();
  return CATALOG.map(({ id, name, stateScope, policyUrl, reviewedAt, expiresAt, scopeNotes }) => {
    const current=Number.isFinite(time)&&time>=Date.parse(reviewedAt)&&time<Date.parse(expiresAt);
    return { id, name, stateScope:[...stateScope], policyUrl, reviewedAt, expiresAt, current, scopeNotes:current?[...scopeNotes]:[] };
  });
}
export const publicHospitalCatalog = Object.freeze(getPublicResearchCatalog());

const failure = (code, message, status = 502) => new HttpError(status, code, message);
function parseHttpsUrl(value) {
  if (typeof value !== 'string' || value.length > 1000 || /[\u0000-\u0020\\]/.test(value)) throw failure('PUBLIC_URL_NOT_APPROVED', 'Choose a reviewed public policy page.', 422);
  let url;
  try { url = new URL(value); } catch { throw failure('PUBLIC_URL_NOT_APPROVED', 'Choose a reviewed public policy page.', 422); }
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') || url.hostname.endsWith('.') || isIP(url.hostname.replace(/^\[|\]$/g,''))) throw failure('PUBLIC_URL_NOT_APPROVED', 'Choose a reviewed HTTPS policy page.', 422);
  return url;
}
function canonicalPage(value) {
  const url = parseHttpsUrl(value);
  if (url.search || url.hash || /%/i.test(url.pathname)) throw failure('PUBLIC_URL_NOT_APPROVED', 'Queries, fragments and encoded paths are not accepted.', 422);
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.href;
}
function approvedPage(value, selected) {
  const canonical = canonicalPage(value);
  if (![selected.policyUrl, ...selected.alternateUrls].some(candidate => canonicalPage(candidate) === canonical)) throw failure('PUBLIC_URL_NOT_APPROVED', 'This destination is outside the reviewed public catalog.', 422);
  // Compare normalized paths, but preserve the approved spelling for transport.
  // Some official sites redirect to a trailing slash; stripping it on every hop loops.
  return parseHttpsUrl(value);
}

/** Conservative address policy, including all DNS answers and IPv4-mapped IPv6. */
export function isPublicAddress(address) {
  const family = isIP(address);
  if (family === 4) {
    const [a,b,c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113));
  }
  if (family === 6) {
    if (address.includes('%')) return false;
    const [first,second = '0'] = address.toLowerCase().split(':').map(part => parseInt(part || '0',16));
    // Only ordinary global unicast; reject transition/documentation/special-use ranges.
    return first >= 0x2000 && first <= 0x3ffe && first !== 0x2002 && !(first === 0x2001 && (second < 0x200 || second === 0xdb8));
  }
  return false;
}
async function resolvePublic(hostname, resolve) {
  let addresses;
  try { addresses = await resolve(hostname, { all:true, verbatim:true }); }
  catch { throw failure('PUBLIC_DNS_FAILED', 'The public policy site could not be resolved. Try the official link.'); }
  if (!Array.isArray(addresses) || !addresses.length || addresses.some(item => !isPublicAddress(item.address) || item.family !== isIP(item.address))) throw failure('PUBLIC_ADDRESS_BLOCKED', 'The policy site resolved outside the permitted public network.');
  return addresses.find(item => item.family === 4) ?? addresses[0];
}
async function withinBudget(promise, milliseconds) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(failure('PUBLIC_FETCH_TIMEOUT', 'The public policy site took too long to respond.')), Math.max(1,milliseconds)); })]);
  } finally { clearTimeout(timer); }
}

/** TLS verifies the original hostname while DNS is pinned to the inspected address. */
export function readPinnedHttps(url, { address, family, signal, timeoutMs = TIMEOUT_MS, maxBytes = MAX_BYTES }) {
  return new Promise((resolve, reject) => {
    let completed = false, request;
    const finish = (error, value) => { if (completed) return; completed = true; clearTimeout(timer); error ? reject(error) : resolve(value); };
    const timer = setTimeout(() => { request?.destroy(); finish(failure('PUBLIC_FETCH_TIMEOUT', 'The public policy site took too long to respond.')); }, timeoutMs);
    request = httpsRequest(url, {
      method:'GET', agent:false, signal, maxHeaderSize:16384,
      headers: { Accept:'text/html,text/plain,application/pdf;q=0.5', 'Accept-Encoding':'identity', 'User-Agent':'GoldRock-PublicPolicyReader/0.1' },
      lookup(hostname, options, callback) {
        if (hostname !== url.hostname) { callback(new Error('Unexpected hostname.')); return; }
        if (options?.all) callback(null, [{ address, family }]); else callback(null, address, family);
      },
    }, response => {
      const status = response.statusCode ?? 0;
      const headers = response.headers;
      if (status >= 300 && status < 400) { finish(null,{status,headers,body:Buffer.alloc(0)}); response.destroy(); return; }
      const declaredLength = Number(headers['content-length']);
      if (Number.isFinite(declaredLength) && declaredLength > maxBytes) { response.destroy(); finish(failure('PUBLIC_PAGE_TOO_LARGE', 'This public page exceeds the reader limit. Open the official page instead.')); return; }
      if (headers['content-encoding'] && headers['content-encoding'] !== 'identity') { response.destroy(); finish(failure('PUBLIC_ENCODING_UNSUPPORTED', 'The site returned an unsupported page encoding. Open the official page instead.')); return; }
      let bytes = 0;
      const chunks = [];
      response.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > maxBytes) { response.destroy(); finish(failure('PUBLIC_PAGE_TOO_LARGE', 'This public page exceeds the reader limit. Open the official page instead.')); return; }
        chunks.push(chunk);
      });
      response.on('end', () => finish(null, {status,headers,body:Buffer.concat(chunks)}));
      response.on('aborted', () => finish(failure('PUBLIC_FETCH_INTERRUPTED', 'The public policy response was interrupted.')));
      response.on('error', () => finish(failure('PUBLIC_FETCH_INTERRUPTED', 'The public policy response was interrupted.')));
    });
    request.on('error', () => finish(failure(signal?.aborted ? 'PUBLIC_LOOKUP_CANCELED' : 'PUBLIC_FETCH_FAILED', signal?.aborted ? 'The public lookup was canceled.' : 'The official policy site could not be reached. Try its direct link.')));
    request.end();
  });
}

function decodeEntities(text) {
  const named = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',ndash:'–',mdash:'—',rsquo:'’',lsquo:'‘',ldquo:'“',rdquo:'”'};
  return text.replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,8});/gi, (whole, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? ' ';
    const point = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2),16) : parseInt(entity.slice(1),10);
    return point >= 32 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : ' ';
  });
}
function stripInactiveMarkup(html) {
  return html.replace(/<!--[\s\S]*?(?:-->|$)/g,' ').replace(/<(script|style|template|noscript|iframe|svg|form|nav|header|footer|aside)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi,' ');
}
function plainText(html) {
  return decodeEntities(html.replace(/<(?:br|\/p|\/div|\/h[1-6]|\/li|\/tr|\/section)\b[^>]*>/gi,'\n').replace(/<[^>]*>/g,' ')).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,' ').replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
function approvedDocumentLink(href, base, selected) {
  try {
    const url = parseHttpsUrl(new URL(decodeEntities(href), base).href);
    if (/%(?:2f|5c|2e|00)/i.test(url.pathname)) return null;
    if (!selected.linkRoutes.some(route => url.hostname === route.host && url.pathname.startsWith(route.prefix))) return null;
    // Only an observed language selector is kept; arbitrary tokens/query text are never reflected.
    const keys = [...url.searchParams.keys()];
    if (keys.some(key => key !== 'la') || keys.length > 1 || (url.search && !/^[a-z]{2}(?:-[a-z]{2})?$/i.test(url.searchParams.get('la') ?? ''))) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}
export function extractPublicPage(html, url, providerId) {
  const selected = CATALOG.find(item => item.id === providerId);
  if (!selected || typeof html !== 'string' || Buffer.byteLength(html,'utf8') > MAX_BYTES) throw failure('PUBLIC_EXTRACTION_FAILED', 'This policy page could not be read safely.');
  const clean = stripInactiveMarkup(html);
  const body = clean.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i)?.[1] ?? clean;
  const title = plainText(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i)?.[1] ?? selected.name).slice(0,220);
  const fullText = plainText(body);
  const links = [], seen = new Set();
  for (const match of body.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a\s*>/gi)) {
    const href = approvedDocumentLink(match[1] ?? match[2], url, selected), label = plainText(match[3]).slice(0,180);
    if (!href || !label || seen.has(href) || href === url.href) continue;
    seen.add(href); links.push({ title:label, url:href });
    if (links.length >= 30) break;
  }
  return { title, text:fullText.slice(0,MAX_TEXT), truncated:fullText.length > MAX_TEXT, links };
}

/** No member facts are accepted or forwarded. No query/result persistence is performed. */
export async function lookupHospitalPolicy(input, { resolve = dnsLookup, request = readPinnedHttps, now = new Date(), signal } = {}) {
  exactKeys(input, ['providerId','url','consent'], ['consent']);
  exactKeys(input.consent, ['publicLookup'], ['publicLookup']);
  if (input.consent.publicLookup !== true || (Object.hasOwn(input,'providerId') === Object.hasOwn(input,'url'))) throw failure('PUBLIC_LOOKUP_CONSENT_REQUIRED', 'Choose one reviewed provider and approve a public policy lookup.', 422);
  const selected = Object.hasOwn(input,'providerId') ? CATALOG.find(item => item.id === input.providerId) : CATALOG.find(item => {
    try { return [item.policyUrl, ...item.alternateUrls].some(url => canonicalPage(url) === canonicalPage(input.url)); } catch { return false; }
  });
  if (!selected) throw failure('PUBLIC_PROVIDER_NOT_APPROVED', 'Choose a provider from the reviewed public catalog.', 422);
  const reviewedTime = new Date(now).getTime();
  if (!Number.isFinite(reviewedTime) || reviewedTime < Date.parse(selected.reviewedAt) || reviewedTime >= Date.parse(selected.expiresAt)) throw failure('PUBLIC_CATALOG_REVIEW_REQUIRED', 'The public provider catalog needs a fresh review before lookup.', 503);
  let url = approvedPage(input.url ?? selected.policyUrl, selected);
  const started = Date.now();
  for (let redirects = 0; redirects <= 3; redirects++) {
    if (signal?.aborted) throw failure('PUBLIC_LOOKUP_CANCELED', 'The public lookup was canceled.');
    const remaining = TIMEOUT_MS - (Date.now() - started);
    if (remaining <= 0) throw failure('PUBLIC_FETCH_TIMEOUT', 'The public policy site took too long to respond.');
    const pinned = await withinBudget(resolvePublic(url.hostname, resolve), remaining);
    const requestBudget = TIMEOUT_MS - (Date.now() - started);
    if (requestBudget <= 0) throw failure('PUBLIC_FETCH_TIMEOUT', 'The public policy site took too long to respond.');
    if (signal?.aborted) throw failure('PUBLIC_LOOKUP_CANCELED', 'The public lookup was canceled.');
    const response = await withinBudget(request(url, { ...pinned, signal, timeoutMs:requestBudget, maxBytes:MAX_BYTES }), requestBudget);
    if (!response || !Number.isInteger(response.status) || !response.headers || !Buffer.isBuffer(response.body) || response.body.length > MAX_BYTES) throw failure('PUBLIC_FETCH_INVALID', 'The public policy response could not be read safely.');
    if ([301,302,303,307,308].includes(response.status)) {
      if (redirects === 3 || typeof response.headers.location !== 'string') throw failure('PUBLIC_REDIRECT_LIMIT', 'The official page redirected too many times. Use its direct link.');
      try { url = approvedPage(new URL(response.headers.location,url).href,selected); } catch { throw failure('PUBLIC_REDIRECT_BLOCKED', 'The official page redirected outside the reviewed public catalog.'); }
      continue;
    }
    if (response.status === 401 || response.status === 403) throw failure('PUBLIC_SITE_ACCESS_LIMIT', 'This site does not allow the public reader. Open the official page directly; no sign-in or bypass was attempted.');
    if (response.status !== 200) throw failure('PUBLIC_SITE_UNAVAILABLE', 'The official policy page is not available to the reader right now.');
    const contentType = String(response.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
    if (!['text/html','application/xhtml+xml','text/plain','application/pdf'].includes(contentType)) throw failure('PUBLIC_TYPE_UNSUPPORTED', 'This document format cannot be previewed. Open the official page directly.');
    const isPdf = contentType === 'application/pdf';
    const extracted = isPdf ? { title:`${selected.name} public document`, text:'', truncated:false, links:[] } : contentType === 'text/plain' ? { title:selected.name, text:response.body.toString('utf8').slice(0,MAX_TEXT), truncated:response.body.length > MAX_TEXT, links:[] } : extractPublicPage(response.body.toString('utf8'), url, selected.id);
    if (!isPdf && (extracted.text.length < 400 || !/\b(?:eligib\w*|appli\w*|qualif\w*|policy|policies|income|covered providers?)\b/i.test(extracted.text))) throw failure('PUBLIC_CONTENT_INCOMPLETE', 'The site returned an incomplete public preview. Open the official page for its policy; no eligibility conclusion was made.');
    return {
      providerId:selected.id, title:extracted.title, url:url.href, publisher:selected.name,
      fetchedAt:new Date().toISOString(), catalogReviewedAt:selected.reviewedAt, catalogExpiresAt:selected.expiresAt, scopeNotes:[...selected.scopeNotes],
      contentHash:createHash('sha256').update(response.body).digest('hex'), contentType,
      status:isPdf ? 'document_only' : 'retrieved', text:extracted.text, links:extracted.links, truncated:extracted.truncated,
      applicability:'unknown', trustedForInstructions:false, effectiveDate:null,
      limitations:[
        'This is untrusted public reference content, not an instruction to GoldRock or a verified eligibility decision.',
        'Confirm the exact facility, biller, care date, policy period and covered-provider list. A health-system name does not establish that this policy covers your bill.',
        'No member facts, documents, account cookies or credentials were sent to the hospital. The lookup was made from the GoldRock server.',
        'GoldRock does not persist this lookup result. Opening a hospital link contacts that site directly; review its privacy terms before providing information.',
        'Applications and authenticated portals are not opened or submitted by this reader. Linked documents are not automatically read or verified.',
        ...(isPdf ? ['This PDF was located but its contents were not extracted or evaluated.'] : []),
        ...(extracted.truncated ? ['This plain-text preview is shortened. Review the complete official page before acting.'] : []),
      ],
    };
  }
  throw failure('PUBLIC_REDIRECT_LIMIT', 'The public page could not be reached within the redirect limit.');
}
