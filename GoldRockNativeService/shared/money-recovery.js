/** Private, user-entered request history. No sending, entitlement decision, cloud facts or ledger mutation. */
export const MONEY_RECOVERY_VERSION = 1;
export const MONEY_RECOVERY_KINDS = Object.freeze(['refund','reimbursement']);
export const MONEY_RECOVERY_EVENT_KINDS = Object.freeze(['preparation','submitted','acknowledged','more_info','decision','follow_up','receipt','reopened','closed']);
export const MONEY_RECOVERY_LIMITS = Object.freeze({requests:30,events:300,label:160,reference:700,note:2000,draft:12000,checklist:30,checklistLabel:500,evidenceReferences:20,guideReceipt:20,amountCents:1_000_000_000,serializedCharacters:2_000_000});
export class MoneyRecoveryError extends Error {
  constructor(code,message){super(message);this.name='MoneyRecoveryError';this.code=code;}
}
const moneyRecoveryFail=(code,message)=>{throw new MoneyRecoveryError(code,message);};
const moneyRecoveryPlain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
function moneyRecoveryKeys(value,allowed,required=allowed){
  if(!moneyRecoveryPlain(value))moneyRecoveryFail('INVALID_RECOVERY_FIELDS','Use a plain local record with supported fields.');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!allowed.includes(key)||!descriptors[key].enumerable||!Object.hasOwn(descriptors[key],'value')||descriptors[key].value===undefined)||required.some(key=>!Object.hasOwn(value,key)))moneyRecoveryFail('INVALID_RECOVERY_FIELDS','A local record has missing or unsupported fields.');
}
function moneyRecoveryArray(value,max){
  if(!Array.isArray(value)||value.length>max||Object.keys(value).length!==value.length||Reflect.ownKeys(value).length!==value.length+1)moneyRecoveryFail('RECOVERY_LIMIT','Use a bounded list of plain local records.');
  for(let index=0;index<value.length;index++){
    const descriptor=Object.getOwnPropertyDescriptor(value,String(index));
    if(!descriptor||!descriptor.enumerable||!Object.hasOwn(descriptor,'value'))moneyRecoveryFail('INVALID_RECOVERY_FIELDS','Local lists cannot contain missing or computed entries.');
  }
  return value;
}
function moneyRecoveryText(value,max,required=false){
  if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)||(required&&!value.trim()))moneyRecoveryFail('INVALID_RECOVERY_TEXT','Use bounded plain text, with required labels and references filled in.');
  return value;
}
function moneyRecoveryChoice(value,choices){if(!choices.includes(value))moneyRecoveryFail('INVALID_RECOVERY_CHOICE','Choose a supported local record option.');return value;}
function moneyRecoveryDate(value){
  if(value===null)return null;
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01'||value>'2200-12-31')moneyRecoveryFail('INVALID_RECOVERY_DATE','Use a real calendar date from 1900 through 2200.');
  const parsed=new Date(`${value}T12:00:00.000Z`);
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==value)moneyRecoveryFail('INVALID_RECOVERY_DATE','Use a real calendar date from 1900 through 2200.');return value;
}
function moneyRecoveryInstant(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)||value<'1900-01-01T00:00:00.000Z'||value>'2200-12-31T23:59:59.999Z')moneyRecoveryFail('INVALID_RECOVERY_TIMESTAMP','The local record timestamp is invalid.');
  const parsed=new Date(value);if(!Number.isFinite(parsed.getTime())||parsed.toISOString()!==value)moneyRecoveryFail('INVALID_RECOVERY_TIMESTAMP','The local record timestamp is invalid.');return value;
}
function moneyRecoveryId(value){if(typeof value!=='string'||!/^mr_[A-Za-z0-9_-]{8,80}$/.test(value))moneyRecoveryFail('INVALID_RECOVERY_ID','The local record identifier is invalid.');return value;}
function moneyRecoveryMoney(value){
  if(value===null)return null;
  if(!Number.isSafeInteger(value)||value<0||value>MONEY_RECOVERY_LIMITS.amountCents||Object.is(value,-0))moneyRecoveryFail('INVALID_RECOVERY_AMOUNT','Use whole USD cents up to 1,000,000,000 cents per amount, with unknown amounts left blank.');return value;
}
function moneyRecoveryAdd(left,right){const result=left+right;if(!Number.isSafeInteger(result))moneyRecoveryFail('RECOVERY_OVERFLOW','The combined amounts exceed the safe local calculation range.');return result;}
function moneyRecoveryStamp(options={}){
  moneyRecoveryKeys(options,['id','now'],[]);
  const id=Object.hasOwn(options,'id')?options.id:(globalThis.crypto?.randomUUID?`mr_${globalThis.crypto.randomUUID()}`:null);
  if(!id)moneyRecoveryFail('LOCAL_RANDOM_UNAVAILABLE','Secure local identifiers are unavailable.');
  return {id:moneyRecoveryId(id),createdAt:moneyRecoveryInstant(Object.hasOwn(options,'now')?options.now:new Date().toISOString())};
}
function moneyRecoveryCommon(record,seen,earliest=null){
  moneyRecoveryId(record.id);if(seen.has(record.id))moneyRecoveryFail('DUPLICATE_RECOVERY_ID','Every local record must have a distinct identifier.');seen.add(record.id);
  moneyRecoveryInstant(record.createdAt);if(earliest&&record.createdAt<earliest)moneyRecoveryFail('INVALID_RECOVERY_TIMESTAMP','A record cannot precede the history it belongs to.');
}
const moneyRecoveryBaseFields=['id','createdAt'];
const moneyRecoveryRequestFields=['kind','label','recipientLabel','scopeLabel','personLabel'];
const moneyRecoveryEventFields=['kind','date','reference','note','requestedCents','approvedCents','receivedCents','decision','payee','preparation','replacesId'];
const moneyRecoveryNotice='User-recorded requests, decisions and receipts only. Verify the recipient, person and services. Requested or approved amounts are not guaranteed money owed, and approval is not money received. Nothing is sent, filed, added to Reconcile or shared with an employer.';
const moneyRecoveryEventDefaults=()=>({date:null,reference:'',note:'',requestedCents:null,approvedCents:null,receivedCents:null,decision:null,payee:null,preparation:null,replacesId:null});

function moneyRecoveryCheckPreparation(preparation){
  moneyRecoveryKeys(preparation,['draft','checklist','evidenceReferences','guideReceipt']);
  moneyRecoveryText(preparation.draft,MONEY_RECOVERY_LIMITS.draft);
  for(const item of moneyRecoveryArray(preparation.checklist,MONEY_RECOVERY_LIMITS.checklist)){
    moneyRecoveryKeys(item,['label','checked']);moneyRecoveryText(item.label,MONEY_RECOVERY_LIMITS.checklistLabel,true);
    if(typeof item.checked!=='boolean')moneyRecoveryFail('INVALID_RECOVERY_CHECKLIST','Explicitly mark each preparation item checked or unchecked.');
  }
  for(const reference of moneyRecoveryArray(preparation.evidenceReferences,MONEY_RECOVERY_LIMITS.evidenceReferences))moneyRecoveryText(reference,MONEY_RECOVERY_LIMITS.reference,true);
  const sourceIds=new Set();
  for(const receipt of moneyRecoveryArray(preparation.guideReceipt,MONEY_RECOVERY_LIMITS.guideReceipt)){
    moneyRecoveryKeys(receipt,['id','reviewedAt','expiresAt']);
    if(typeof receipt.id!=='string'||! /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(receipt.id)||sourceIds.has(receipt.id))moneyRecoveryFail('INVALID_RECOVERY_GUIDE_RECEIPT','Use distinct supported source receipt identifiers.');
    sourceIds.add(receipt.id);moneyRecoveryInstant(receipt.reviewedAt);moneyRecoveryInstant(receipt.expiresAt);
    if(receipt.expiresAt<=receipt.reviewedAt)moneyRecoveryFail('INVALID_RECOVERY_GUIDE_RECEIPT','The source receipt expiry must follow its review timestamp.');
  }
}
function moneyRecoveryCheckEvent(event){
  moneyRecoveryChoice(event.kind,[...MONEY_RECOVERY_EVENT_KINDS,'void']);moneyRecoveryDate(event.date);
  moneyRecoveryText(event.reference,MONEY_RECOVERY_LIMITS.reference);moneyRecoveryText(event.note,MONEY_RECOVERY_LIMITS.note);
  for(const field of ['requestedCents','approvedCents','receivedCents'])moneyRecoveryMoney(event[field]);
  if(!['preparation','submitted'].includes(event.kind)&&event.requestedCents!==null)moneyRecoveryFail('INVALID_RECOVERY_AMOUNT_SCOPE','Record requested, approved and received amounts only on their matching events.');
  if(event.kind!=='decision'&&event.approvedCents!==null)moneyRecoveryFail('INVALID_RECOVERY_AMOUNT_SCOPE','Record requested, approved and received amounts only on their matching events.');
  if(event.kind!=='receipt'&&event.receivedCents!==null)moneyRecoveryFail('INVALID_RECOVERY_AMOUNT_SCOPE','Record requested, approved and received amounts only on their matching events.');
  if(event.kind==='preparation')moneyRecoveryCheckPreparation(event.preparation);
  else if(event.preparation!==null)moneyRecoveryFail('INVALID_RECOVERY_PREPARATION','Only a preparation event can contain a draft and checklist snapshot.');
  if(event.kind==='decision'){
    moneyRecoveryChoice(event.decision,['approved','partly_approved','denied']);moneyRecoveryChoice(event.payee,['member','provider','unknown']);
    if(event.decision==='denied'&&event.approvedCents!==null&&event.approvedCents!==0)moneyRecoveryFail('INVALID_RECOVERY_DECISION','A denied decision cannot also record a positive approved amount.');
  }else{
    if(event.decision!==null)moneyRecoveryFail('INVALID_RECOVERY_DECISION','Only a decision event can contain a decision.');
    if(event.kind==='receipt')moneyRecoveryChoice(event.payee,['member']);
    else if(event.payee!==null)moneyRecoveryFail('INVALID_RECOVERY_PAYEE','Only a decision or actual member receipt can record a payee.');
  }
  if(event.kind==='void'){
    if(event.date!==null||event.reference!==''||event.replacesId===null)moneyRecoveryFail('INVALID_RECOVERY_VOID','A void preserves a correction reason, not a new request, decision or money transfer.');
  }else if(event.kind!=='preparation'){
    if(event.date===null)moneyRecoveryFail('RECOVERY_DATE_REQUIRED','Record the event date, or the personal follow-up date.');
    if(event.kind!=='follow_up')moneyRecoveryText(event.reference,MONEY_RECOVERY_LIMITS.reference,true);
  }
  if(['reopened','closed','void'].includes(event.kind)||event.replacesId!==null)moneyRecoveryText(event.note,MONEY_RECOVERY_LIMITS.note,true);
}
// Replacements keep the original logical slot. A correction entered today must not rewind a later decision.
function moneyRecoveryEffective(request){
  const slots=[],slotById=new Map(),superseded=new Set(),voided=[];
  for(const event of request.events){
    let slot;
    if(event.replacesId===null){slot=slots.length;slots.push(event);}
    else{slot=slotById.get(event.replacesId);slots[slot]=event.kind==='void'?null:event;superseded.add(event.replacesId);if(event.kind==='void')voided.push(event.replacesId);}
    slotById.set(event.id,slot);
  }
  const logical=slots.map((event,index)=>({event,index})).filter(item=>item.event!==null);
  const ordered=[...logical].sort((left,right)=>{
    const leftDate=left.event.date??left.event.createdAt.slice(0,10),rightDate=right.event.date??right.event.createdAt.slice(0,10);
    return leftDate<rightDate?-1:leftDate>rightDate?1:left.index-right.index;
  }).map(item=>item.event);
  let knownReceived=0;for(const {event} of logical)if(event.kind==='receipt'&&event.receivedCents!==null)knownReceived=moneyRecoveryAdd(knownReceived,event.receivedCents);
  return {active:logical.map(item=>item.event),ordered,superseded,voided,knownReceived};
}
function moneyRecoveryCheckRequest(request,seen){
  moneyRecoveryKeys(request,[...moneyRecoveryBaseFields,...moneyRecoveryRequestFields,'events']);moneyRecoveryCommon(request,seen);
  moneyRecoveryChoice(request.kind,MONEY_RECOVERY_KINDS);
  for(const field of ['label','recipientLabel','scopeLabel'])moneyRecoveryText(request[field],MONEY_RECOVERY_LIMITS.label,true);moneyRecoveryText(request.personLabel,MONEY_RECOVERY_LIMITS.label);
  const events=new Map(),replaced=new Set();let previousAt=request.createdAt;
  for(const event of moneyRecoveryArray(request.events,MONEY_RECOVERY_LIMITS.events)){
    moneyRecoveryKeys(event,[...moneyRecoveryBaseFields,...moneyRecoveryEventFields]);moneyRecoveryCommon(event,seen,previousAt);previousAt=event.createdAt;
    moneyRecoveryCheckEvent(event);
    if(event.replacesId!==null){
      moneyRecoveryId(event.replacesId);const target=events.get(event.replacesId);
      if(!target||target.kind==='void'||replaced.has(target.id)||(event.kind!=='void'&&event.kind!==target.kind))moneyRecoveryFail('INVALID_RECOVERY_REPLACEMENT','Choose an active event of the same kind in this request; a void can target any active nonvoid event.');
      replaced.add(target.id);
    }
    events.set(event.id,event);
  }
  moneyRecoveryEffective(request); // Validate safe subtotal arithmetic even without a decision.
}

export function createMoneyRecovery(){return {version:MONEY_RECOVERY_VERSION,requests:[]};}
export function validateMoneyRecovery(input){
  if(input===undefined)return createMoneyRecovery();
  moneyRecoveryKeys(input,['version','requests']);if(input.version!==MONEY_RECOVERY_VERSION)moneyRecoveryFail('RECOVERY_VERSION_UNSUPPORTED','This local money recovery version needs a supported migration.');
  const seen=new Set();for(const request of moneyRecoveryArray(input.requests,MONEY_RECOVERY_LIMITS.requests))moneyRecoveryCheckRequest(request,seen);
  let encoded;try{encoded=JSON.stringify(input);}catch{moneyRecoveryFail('INVALID_RECOVERY_DATA','Use plain serializable local records.');}
  if(encoded.length>MONEY_RECOVERY_LIMITS.serializedCharacters)moneyRecoveryFail('RECOVERY_LIMIT','This money recovery history exceeds the local record size limit.');
  return JSON.parse(encoded);
}
function moneyRecoveryRequest(state,id){moneyRecoveryId(id);const request=state.requests.find(record=>record.id===id);if(!request)moneyRecoveryFail('RECOVERY_REQUEST_NOT_FOUND','The selected money recovery request is not in this case.');return request;}
export function addRecoveryRequest(input,fields,options={}){
  moneyRecoveryKeys(fields,moneyRecoveryRequestFields,['kind','label','recipientLabel','scopeLabel']);const state=validateMoneyRecovery(input);
  state.requests.push({...moneyRecoveryStamp(options),personLabel:'',...fields,events:[]});return validateMoneyRecovery(state);
}
export function addRecoveryEvent(input,requestId,fields,options={}){
  moneyRecoveryKeys(fields,moneyRecoveryEventFields,['kind']);moneyRecoveryChoice(fields.kind,MONEY_RECOVERY_EVENT_KINDS);
  const state=validateMoneyRecovery(input),request=moneyRecoveryRequest(state,requestId);
  request.events.push({...moneyRecoveryStamp(options),...moneyRecoveryEventDefaults(),...fields});return validateMoneyRecovery(state);
}
export function voidRecoveryEvent(input,requestId,eventId,fields,options={}){
  moneyRecoveryKeys(fields,['reason']);moneyRecoveryText(fields.reason,MONEY_RECOVERY_LIMITS.note,true);const state=validateMoneyRecovery(input),request=moneyRecoveryRequest(state,requestId);
  request.events.push({...moneyRecoveryStamp(options),...moneyRecoveryEventDefaults(),kind:'void',note:fields.reason,replacesId:eventId});return validateMoneyRecovery(state);
}
export function summarizeMoneyRecovery(input){
  const state=validateMoneyRecovery(input);
  const requests=state.requests.map(request=>{
    const view=moneyRecoveryEffective(request),latest=kind=>view.ordered.filter(event=>event.kind===kind).at(-1)??null;
    const preparation=latest('preparation'),submission=latest('submitted'),decision=latest('decision');
    const workflow=view.ordered.filter(event=>['submitted','acknowledged','more_info','decision','reopened','closed'].includes(event.kind)).at(-1)??null;
    const status=workflow?.kind==='decision'?workflow.decision:workflow?.kind==='more_info'?'needs_info':workflow?.kind??'preparing';
    const requestedCents=submission?submission.requestedCents:preparation?.requestedCents??null;
    const receipts=view.active.filter(event=>event.kind==='receipt'),unknownReceipts=receipts.some(event=>event.receivedCents===null);
    const receivedCents=receipts.length&&!unknownReceipts?view.knownReceived:null;
    const decisionIndex=decision?view.ordered.indexOf(decision):-1;
    const awaitingNewDecision=decisionIndex>=0&&view.ordered.slice(decisionIndex+1).some(event=>['submitted','acknowledged','more_info','reopened'].includes(event.kind));
    const comparable=Boolean(decision&&decision.decision!=='denied'&&decision.payee==='member'&&decision.approvedCents!==null&&!awaitingNewDecision);
    let receiptStatus=!receipts.length?'none_recorded':unknownReceipts?'amount_unknown':'received_uncompared';
    let unreceivedApprovedCents=null;
    if(comparable&&receivedCents!==null){
      const difference=moneyRecoveryAdd(decision.approvedCents,-receivedCents);unreceivedApprovedCents=Math.max(difference,0);
      receiptStatus=difference>0?'partial_recorded':difference===0?'matches_approval':'exceeds_approval';
    }
    const questions=[];
    if(!submission&&view.active.some(event=>!['preparation','follow_up'].includes(event.kind)))questions.push('Where is your sent copy and submission receipt for this request? Later observations are retained, but no submission proof is recorded here.');
    if(submission&&!latest('acknowledged')&&!decision)questions.push('Has the recipient confirmed receiving your request? A saved submission record does not establish external acceptance.');
    if(requestedCents===null)questions.push('What amount, if any, did you ask the recipient to review? Leave it unknown until verified; paying a bill does not establish coverage or a refund right.');
    if(workflow?.kind==='more_info')questions.push('Which information did the recipient request, and how will you document your response? Verify the actual instructions and any applicable deadline independently.');
    if(decision?.approvedCents===null&&decision.decision!=='denied')questions.push('Does the decision state the total approved for this entire request? Do not add separate approval letters or components together without reconciling their scope.');
    if(decision?.decision==='denied')questions.push('What reason and correction or appeal instructions appear in the actual decision? Reopening this local record does not file an appeal or extend a deadline.');
    if(decision?.decision==='partly_approved')questions.push('What happened to the remaining requested amount? Check the explanation and applicable review route; a partial approval does not establish a right to the remainder.');
    if(decision&&decision.payee!=='member')questions.push('Who will receive any approved payment? Payment to a provider or an unknown recipient is not money received by you.');
    if(awaitingNewDecision)questions.push('An observation after the recorded decision puts the request back in review. The older approval remains in history; verify the current total and recipient before comparing it with receipts.');
    if(!receipts.length)questions.push('Have any funds actually reached you? No receipt entries does not prove nothing was received, and approval or a promised check is not a receipt.');
    if(unknownReceipts)questions.push('At least one recorded member receipt has an unknown amount. Verify its receipt before calculating a total or comparing it with approval.');
    if(receiptStatus==='exceeds_approval')questions.push('Recorded member receipts exceed the current recorded approval. Check duplicate entries, interest, a revised decision or a different service scope before drawing a conclusion.');
    if(requestedCents!==null&&decision?.approvedCents!==null&&decision?.approvedCents!==undefined&&decision.approvedCents>requestedCents)questions.push('The recorded approval exceeds the recorded request. Check whether the request total, decision scope or another component needs correction.');
    if(receipts.length)questions.push('Do these receipts cover the same person, recipient and services, and are any receipts missing? This recorded subtotal does not assert complete payment history or automatically update Reconcile.');
    if(status==='closed')questions.push('You stopped tracking this request. This local status does not confirm settlement, receipt of all funds or expiration of any rights.');
    return {id:request.id,kind:request.kind,label:request.label,recipientLabel:request.recipientLabel,scopeLabel:request.scopeLabel,personLabel:request.personLabel,
      status,lastEventId:request.events.at(-1)?.id??null,latestPreparationId:preparation?.id??null,latestSubmissionId:submission?.id??null,latestDecisionId:decision?.id??null,
      decision:decision?.decision??null,decisionPayee:decision?.payee??null,requestedCents,approvedCents:decision?.approvedCents??null,
      recordedReceivedCents:view.knownReceived,receivedCents,unreceivedApprovedCents,receiptStatus,
      activeEventIds:view.active.map(event=>event.id),supersededEventIds:request.events.filter(event=>view.superseded.has(event.id)).map(event=>event.id),voidedEventIds:view.voided,
      followUps:view.ordered.filter(event=>event.kind==='follow_up').map(event=>({id:event.id,date:event.date,note:event.note,reference:event.reference})),questions,notice:moneyRecoveryNotice};
  });
  return {version:MONEY_RECOVERY_VERSION,requests,notice:moneyRecoveryNotice};
}
