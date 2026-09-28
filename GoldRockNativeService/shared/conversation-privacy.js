/** A local review candidate, never a de-identification guarantee. Server validation never cleans input. */
export const CONVERSATION_PRIVACY_LIMITS=Object.freeze({raw:20000,question:2000,answer:6000,history:4,knowledgeIds:6});
export class ConversationPrivacyError extends Error {
  constructor(code='INVALID_CONVERSATION_REQUEST'){
    super(code==='CONVERSATION_PRIVACY_REVIEW_REQUIRED'?'Review the minimized text again. A known identifier, document-like block or unsupported control pattern remains.':code==='INVALID_CONVERSATION_CANDIDATE'?'Use a shorter plain-text question for local privacy review.':'Use the supported reviewed question, context and knowledge fields within their limits.');
    this.name='ConversationPrivacyError';this.code=code;
  }
}
const conversationPrivacyControls=/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g;
const conversationPrivacyPatterns=[
  {flag:'email',pattern:/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,replacement:'[email removed]'},
  {flag:'ssn',pattern:/\b\d{3}[- ]\d{2}[- ]\d{4}\b/g,replacement:'[SSN removed]'},
  {flag:'phone',pattern:/(?:\+1[ .-]?)?(?:\([2-9]\d{2}\)|\b[2-9]\d{2})[ .-]?\d{3}[ .-]?\d{4}\b/g,replacement:'[phone removed]'},
  {flag:'exact_date',pattern:/\b(?:\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+\d{4})?)\b/gi,replacement:'[exact date removed]'},
  {flag:'url',pattern:/\b(?:https?:\/\/|www\.)[^\s<>()]+|\b(?:[a-z0-9-]+\.)+(?:com|org|net|edu|gov|health|io)(?:\/[^\s<>()]*)?/gi,replacement:'[link removed]'},
  {flag:'street_address',pattern:/\b\d{1,6}\s+(?:[A-Za-z0-9.'-]+\s+){1,7}(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|court|ct|way|place|pl|terrace|ter)\b(?:\.?\s*(?:apt|unit|suite|ste|#)\s*[A-Za-z0-9-]+)?/gi,replacement:'[street address removed]'},
  {flag:'card_number',pattern:/\b(?:\d{4}[ -]){3}\d{4}\b/g,replacement:'[payment number removed]'},
  {flag:'postal_code',pattern:/\b(?:ZIP(?:\s+code)?|postal\s+code)\s*(?:[:=#]|\bis\b)\s*\d{5}(?:-\d{4})?\b/gi,replacement:'[postal code removed]'},
  {flag:'labeled_identifier',pattern:/\b(?:member\s*(?:id|number|no\.?)|account\s*(?:id|number|no\.?)|claim\s*(?:id|number|no\.?)|policy\s*(?:id|number|no\.?)|medical\s*record(?:\s*(?:id|number|no\.?))?|MRN|SSN|DOB|date\s+of\s+birth)\s*(?:[:=#]|\bis\b)\s*[A-Za-z0-9][A-Za-z0-9._\/-]{1,119}\b/gi,replacement:'[account reference removed]'},
  {flag:'labeled_identifier',pattern:/\b(?:subscriber|beneficiary|patient|insurance|group|authorization|encounter|invoice|statement|receipt)\s*(?:id|number|no\.?|#)\s*(?:[:=#]|\bis\b)?\s*(?=[A-Za-z0-9._\/-]*\d)[A-Za-z0-9][A-Za-z0-9._\/-]{1,119}\b/gi,replacement:'[account reference removed]'},
  {flag:'labeled_identifier',pattern:/\b(?:member|account|claim|policy)\s*#\s*[A-Za-z0-9][A-Za-z0-9._\/-]{1,119}\b/gi,replacement:'[account reference removed]'},
  {flag:'labeled_identifier',pattern:/\b(?:member\s*(?:id|number)|account\s*(?:id|number)|claim\s*(?:id|number)|policy\s*(?:id|number)|MRN)\s+(?=[A-Za-z0-9._\/-]*\d)[A-Za-z0-9][A-Za-z0-9._\/-]{1,119}\b/gi,replacement:'[account reference removed]'},
  {flag:'name_introduction',pattern:/\b(?:[Mm]y name is|[Pp]atient(?: name)?\s*[:=]|[Gg]uarantor\s*[:=]|[Ii] am called)\s*[^\n,;.?!]{1,120}/g,replacement:'[name introduction removed]'},
  {flag:'name_introduction',pattern:/\b(?:subscriber|beneficiary|insured|guarantor|patient)\s+name\s*[:=]\s*[^\n,;.?!]{1,120}/gi,replacement:'[name introduction removed]'},
  {flag:'name_introduction',pattern:/\b(?:I['’]m|I am)\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?(?:\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?){0,3}\b/g,replacement:'[name introduction removed]'},
  {flag:'long_identifier',pattern:/\b\d{8,}\b/g,replacement:'[numeric identifier removed]'},
];
const conversationPrivacyLimitations=Object.freeze([
  'Review and edit the exact candidate before sending. Pattern removal does not make it anonymous or certify that PHI is absent.',
  'Names outside common introductions, employers, locations, rare circumstances and indirect identifiers may remain. Keep the question about the billing process and omit personal details.',
  'Do not paste a full bill, EOB, denial or medical record into chat. Summarize only the question you need answered after reviewing structured facts.',
  'Only the text you approve should be stored or sent. Original editor text, documents and private case notes are not part of this candidate.'
]);
function conversationPrivacyMatchApplies(check,match){
  if(check.flag!=='labeled_identifier')return true;
  const value=match.match(/([A-Za-z0-9._\/-]+)$/)?.[1]??'';
  return !/^(?:wrong|missing|unknown|required|needed|optional|private|sensitive|incorrect|correct|unavailable|redacted|not|the|a|an|on|in|where|what|how|which|it|my|your)$/i.test(value);
}
const documentLine=/^(?:patient(?:\s+name|\s+id)?|subscriber(?:\s+name|\s+id)?|member(?:\s+id|\s+number)?|account(?:\s+number|\s+id)?|claim(?:\s+number|\s+id)?|medical\s+record(?:\s+number)?|MRN|DOB|date\s+of\s+(?:birth|service)|diagnos(?:is|es)|procedure|service\s+description|total\s+charges|insurance\s+paid|patient\s+responsibility|amount\s+due|balance\s+due|adjustments?)\s*[:=#]/i;
function conversationLooksLikeDocument(text){
  const lines=text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
  return lines.length>=4&&lines.filter(line=>documentLine.test(line)).length>=3;
}
function conversationPrivacyObject(value,keys){
  if(value===null||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw new ConversationPrivacyError();
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!keys.includes(key)||!descriptors[key].enumerable||!Object.hasOwn(descriptors[key],'value')||descriptors[key].value===undefined)||keys.some(key=>!Object.hasOwn(value,key)))throw new ConversationPrivacyError();
}
function conversationPrivacyArray(value,max){
  if(!Array.isArray(value)||value.length>max||Reflect.ownKeys(value).length!==value.length+1||Object.keys(value).length!==value.length)throw new ConversationPrivacyError();
  for(let index=0;index<value.length;index++){const descriptor=Object.getOwnPropertyDescriptor(value,String(index));if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))throw new ConversationPrivacyError();}return value;
}
export function detectConversationIdentifiers(text){
  if(typeof text!=='string'||text.length>CONVERSATION_PRIVACY_LIMITS.raw)throw new ConversationPrivacyError();
  const normalized=text.normalize('NFKC'),flags=[];
  if(new RegExp(conversationPrivacyControls.source,'g').test(normalized))flags.push('control_characters');
  if(conversationLooksLikeDocument(normalized))flags.push('document_like_text');
  for(const check of conversationPrivacyPatterns)if([...normalized.matchAll(new RegExp(check.pattern.source,check.pattern.flags))].some(match=>conversationPrivacyMatchApplies(check,match[0]))&&!flags.includes(check.flag))flags.push(check.flag);
  return flags;
}
export function prepareConversationCandidate(rawText){
  if(typeof rawText!=='string'||rawText.length>CONVERSATION_PRIVACY_LIMITS.raw)throw new ConversationPrivacyError('INVALID_CONVERSATION_CANDIDATE');
  let candidate=rawText.normalize('NFKC');const flags=detectConversationIdentifiers(rawText);
  if(candidate!==rawText)flags.push('unicode_normalization');
  if(flags.includes('document_like_text'))return {candidate:'',flags,requiresReview:true,limitations:[...conversationPrivacyLimitations]};
  candidate=candidate.replace(new RegExp(conversationPrivacyControls.source,'g'),'');
  for(const check of conversationPrivacyPatterns)candidate=candidate.replace(new RegExp(check.pattern.source,check.pattern.flags),match=>conversationPrivacyMatchApplies(check,match)?check.replacement:match);
  return {candidate,flags,requiresReview:true,limitations:[...conversationPrivacyLimitations]};
}
function conversationPrivacyText(value,max){
  if(typeof value!=='string'||!value.trim()||value.length>max)throw new ConversationPrivacyError();
  if(detectConversationIdentifiers(value).length)throw new ConversationPrivacyError('CONVERSATION_PRIVACY_REVIEW_REQUIRED');return value;
}
export function validateConversationRequest(input){
  conversationPrivacyObject(input,['question','history','knowledgeIds']);
  const question=conversationPrivacyText(input.question,CONVERSATION_PRIVACY_LIMITS.question);
  const history=conversationPrivacyArray(input.history,CONVERSATION_PRIVACY_LIMITS.history).map(pair=>{conversationPrivacyObject(pair,['question','answer']);return {question:conversationPrivacyText(pair.question,CONVERSATION_PRIVACY_LIMITS.question),answer:conversationPrivacyText(pair.answer,CONVERSATION_PRIVACY_LIMITS.answer)};});
  const ids=new Set();const knowledgeIds=conversationPrivacyArray(input.knowledgeIds,CONVERSATION_PRIVACY_LIMITS.knowledgeIds).map(id=>{if(typeof id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(id)||ids.has(id))throw new ConversationPrivacyError();ids.add(id);return id;});
  return {question,history,knowledgeIds};
}
