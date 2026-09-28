/** User-entered local evidence and arithmetic. Never include this state in cloud facts.
 * Mutations append history to a new validated copy; no automatic matching or legal conclusions.
 */
export const RECONCILIATION_VERSION = 1;
export const RECONCILIATION_DOCUMENT_KINDS = Object.freeze(['bill','eob','estimate']);
export const RECONCILIATION_PAYMENT_KINDS = Object.freeze(['payment','refund']);
export const RECONCILIATION_LIMITS = Object.freeze({groups:30,documents:100,payments:300,selections:300,lines:100,serializedCharacters:2_000_000,amountCents:1_000_000_000});
export class ReconciliationError extends Error {
  constructor(code,message){super(message);this.name='ReconciliationError';this.code=code;}
}
const reconciliationFail=(code,message)=>{throw new ReconciliationError(code,message);};
const reconciliationPlain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
function reconciliationKeys(value,allowed,required=allowed){
  if(!reconciliationPlain(value))reconciliationFail('INVALID_RECONCILIATION_FIELDS','Use a plain local record with supported fields.');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!allowed.includes(key)||!descriptors[key].enumerable||!Object.hasOwn(descriptors[key],'value')||descriptors[key].value===undefined)||required.some(key=>!Object.hasOwn(value,key)))reconciliationFail('INVALID_RECONCILIATION_FIELDS','A local record has missing or unsupported fields.');
}
function reconciliationArray(value,max){
  if(!Array.isArray(value)||value.length>max||Object.keys(value).length!==value.length||Reflect.ownKeys(value).length!==value.length+1)reconciliationFail('RECONCILIATION_LIMIT','Use a bounded list of plain local records.');
  for(let index=0;index<value.length;index++){
    const descriptor=Object.getOwnPropertyDescriptor(value,String(index));
    if(!descriptor||!descriptor.enumerable||!Object.hasOwn(descriptor,'value'))reconciliationFail('INVALID_RECONCILIATION_FIELDS','Local lists cannot contain missing or computed entries.');
  }
  return value;
}
function reconciliationText(value,max,required=false){
  if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)||(required&&!value.trim()))reconciliationFail('INVALID_RECONCILIATION_TEXT',`Use ${required?'nonempty ':''}text of at most ${max} characters.`);
  return value;
}
function reconciliationChoice(value,choices){if(!choices.includes(value))reconciliationFail('INVALID_RECONCILIATION_CHOICE','Choose a supported local record option.');return value;}
function reconciliationDate(value){
  if(value===null)return null;
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01'||value>'2200-12-31')reconciliationFail('INVALID_RECONCILIATION_DATE','Use a real date from 1900 through 2200, or leave it unknown.');
  const parsed=new Date(`${value}T12:00:00.000Z`);
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==value)reconciliationFail('INVALID_RECONCILIATION_DATE','Use a real calendar date.');return value;
}
function reconciliationInstant(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)||value<'1900-01-01T00:00:00.000Z'||value>'2200-12-31T23:59:59.999Z')reconciliationFail('INVALID_RECONCILIATION_TIMESTAMP','The local record timestamp is invalid.');
  const parsed=new Date(value);if(!Number.isFinite(parsed.getTime())||parsed.toISOString()!==value)reconciliationFail('INVALID_RECONCILIATION_TIMESTAMP','The local record timestamp is invalid.');return value;
}
function reconciliationId(value){if(typeof value!=='string'||!/^rc_[A-Za-z0-9_-]{8,80}$/.test(value))reconciliationFail('INVALID_RECONCILIATION_ID','The local record identifier is invalid.');return value;}
function reconciliationMoney(value,nullable=true,positive=false){
  if(nullable&&value===null)return null;
  if(!Number.isSafeInteger(value)||value<(positive?1:0)||value>RECONCILIATION_LIMITS.amountCents||Object.is(value,-0))reconciliationFail('INVALID_RECONCILIATION_AMOUNT','Use whole USD cents up to 1,000,000,000 cents per amount, with unknown amounts left blank.');return value;
}
function reconciliationAdd(left,right){const result=left+right;if(!Number.isSafeInteger(result))reconciliationFail('RECONCILIATION_OVERFLOW','The combined amounts exceed the safe local calculation range.');return result;}
function reconciliationStamp(options={}){
  reconciliationKeys(options,['id','now'],[]);
  const id=Object.hasOwn(options,'id')?options.id:(globalThis.crypto?.randomUUID?`rc_${globalThis.crypto.randomUUID()}`:null);
  if(!id)reconciliationFail('LOCAL_RANDOM_UNAVAILABLE','Secure local identifiers are unavailable.');
  return {id:reconciliationId(id),createdAt:reconciliationInstant(Object.hasOwn(options,'now')?options.now:new Date().toISOString())};
}
function reconciliationCommon(record,seen,earliest=null){
  reconciliationId(record.id);if(seen.has(record.id))reconciliationFail('DUPLICATE_RECONCILIATION_ID','Every local record must have a distinct identifier.');seen.add(record.id);
  reconciliationInstant(record.createdAt);if(earliest&&record.createdAt<earliest)reconciliationFail('INVALID_RECONCILIATION_TIMESTAMP','A record cannot precede the history it belongs to.');
}
const reconciliationDocumentFields=['kind','label','documentDate','receivedDate','reference','revisionOfId','totalPatientResponsibilityCents','statementBalanceCents','estimateCents','lines'];
const reconciliationPaymentFields=['kind','amountCents','transactionDate','receiptReference','note','replacesId'];
const reconciliationSelectionFields=['billId','eobId','estimateId','responsibilitySource','paymentsComplete','reason'];
const reconciliationLineFields=['label','code','amountCents','units'];
const reconciliationBaseFields=['id','createdAt'];
const reconciliationNotice='User-entered evidence and arithmetic only. Check the same person, biller and services, current documents and complete payment history. A difference or possible credit is a question to verify, not a debt decision, refund entitlement or savings claim.';

function reconciliationCheckLine(line){
  reconciliationKeys(line,reconciliationLineFields);reconciliationText(line.label,240);
  if(line.code!==null)reconciliationText(line.code,40,true);
  reconciliationMoney(line.amountCents);
  if(line.units!==null&&(!Number.isSafeInteger(line.units)||line.units<1||line.units>100000))reconciliationFail('INVALID_RECONCILIATION_UNITS','Use positive whole recorded units, or leave units unknown.');
}
function reconciliationPaymentView(group){
  const replaced=new Set(group.payments.filter(payment=>payment.replacesId!==null).map(payment=>payment.replacesId));
  const active=group.payments.filter(payment=>payment.kind!=='void'&&!replaced.has(payment.id));
  let paid=0,refunded=0;
  for(const payment of active){if(payment.kind==='payment')paid=reconciliationAdd(paid,payment.amountCents);else refunded=reconciliationAdd(refunded,payment.amountCents);}
  return {active,paid,refunded,net:reconciliationAdd(paid,-refunded),replaced};
}
function reconciliationCheckGroup(group,seen){
  reconciliationKeys(group,[...reconciliationBaseFields,'label','billerLabel','serviceLabel','personLabel','documents','payments','selections']);
  reconciliationCommon(group,seen);for(const field of ['label','billerLabel','serviceLabel'])reconciliationText(group[field],160,true);reconciliationText(group.personLabel,160);
  const documents=new Map(),payments=new Map(),replaced=new Set();
  let previousAt=group.createdAt;
  for(const doc of reconciliationArray(group.documents,RECONCILIATION_LIMITS.documents)){
    reconciliationKeys(doc,[...reconciliationBaseFields,...reconciliationDocumentFields]);reconciliationCommon(doc,seen,previousAt);previousAt=doc.createdAt;
    reconciliationChoice(doc.kind,RECONCILIATION_DOCUMENT_KINDS);reconciliationText(doc.label,240,true);reconciliationText(doc.reference,700);
    reconciliationDate(doc.documentDate);reconciliationDate(doc.receivedDate);
    if(doc.documentDate&&doc.receivedDate&&doc.receivedDate<doc.documentDate)reconciliationFail('INVALID_RECONCILIATION_DATE','A received date cannot precede the recorded document date.');
    for(const field of ['totalPatientResponsibilityCents','statementBalanceCents','estimateCents'])reconciliationMoney(doc[field]);
    if((doc.kind!=='bill'&&doc.statementBalanceCents!==null)||(doc.kind!=='estimate'&&doc.estimateCents!==null)||(doc.kind==='estimate'&&doc.totalPatientResponsibilityCents!==null))reconciliationFail('INVALID_DOCUMENT_AMOUNT_SCOPE','Use amounts appropriate to the document: a bill balance, bill/EOB total responsibility, or an estimate.');
    if(doc.revisionOfId!==null){reconciliationId(doc.revisionOfId);const parent=documents.get(doc.revisionOfId);if(!parent||parent.kind!==doc.kind)reconciliationFail('INVALID_DOCUMENT_REVISION','Choose an earlier document of the same kind from this group.');}
    let knownLineSum=0;for(const line of reconciliationArray(doc.lines,RECONCILIATION_LIMITS.lines)){reconciliationCheckLine(line);if(line.amountCents!==null)knownLineSum=reconciliationAdd(knownLineSum,line.amountCents);}
    documents.set(doc.id,doc);
  }
  previousAt=group.createdAt;
  for(const payment of reconciliationArray(group.payments,RECONCILIATION_LIMITS.payments)){
    reconciliationKeys(payment,[...reconciliationBaseFields,...reconciliationPaymentFields]);reconciliationCommon(payment,seen,previousAt);previousAt=payment.createdAt;
    reconciliationChoice(payment.kind,[...RECONCILIATION_PAYMENT_KINDS,'void']);reconciliationDate(payment.transactionDate);reconciliationText(payment.receiptReference,700);reconciliationText(payment.note,2000);
    if(payment.kind==='void'){
      if(payment.amountCents!==null||payment.transactionDate!==null||payment.receiptReference!==''||payment.replacesId===null)reconciliationFail('INVALID_PAYMENT_VOID','A void records a correction to an existing payment entry, not a money transfer.');
    }else reconciliationMoney(payment.amountCents,false,true);
    if(payment.replacesId!==null){
      reconciliationId(payment.replacesId);const target=payments.get(payment.replacesId);
      if(!target||target.kind==='void'||replaced.has(target.id))reconciliationFail('INVALID_PAYMENT_REPLACEMENT','Choose an active payment or refund from this group; previous corrections remain in history.');
      reconciliationText(payment.note,2000,true);replaced.add(target.id);
    }
    payments.set(payment.id,payment);
  }
  reconciliationPaymentView(group); // Check subtotal overflow even before any selection exists.
  previousAt=group.createdAt;
  for(const selection of reconciliationArray(group.selections,RECONCILIATION_LIMITS.selections)){
    reconciliationKeys(selection,[...reconciliationBaseFields,...reconciliationSelectionFields,'paymentRecordIds']);reconciliationCommon(selection,seen,previousAt);previousAt=selection.createdAt;
    reconciliationText(selection.reason,1000);reconciliationChoice(selection.responsibilitySource,[null,'bill','eob']);
    if(typeof selection.paymentsComplete!=='boolean')reconciliationFail('PAYMENT_REVIEW_REQUIRED','Explicitly choose whether the relevant payment and refund history is complete.');
    for(const kind of RECONCILIATION_DOCUMENT_KINDS){
      const id=selection[`${kind}Id`];if(id===null)continue;reconciliationId(id);const doc=documents.get(id);
      if(!doc||doc.kind!==kind||doc.createdAt>selection.createdAt)reconciliationFail('INVALID_DOCUMENT_SELECTION','Choose a document of the matching kind already recorded in this group.');
    }
    if(selection.responsibilitySource&&selection[`${selection.responsibilitySource}Id`]===null)reconciliationFail('RESPONSIBILITY_SOURCE_REQUIRED','Select the bill or EOB supplying the total patient responsibility.');
    reconciliationArray(selection.paymentRecordIds,RECONCILIATION_LIMITS.payments);
    for(let index=0;index<selection.paymentRecordIds.length;index++){
      const id=selection.paymentRecordIds[index];reconciliationId(id);
      if(group.payments[index]?.id!==id||group.payments[index].createdAt>selection.createdAt)reconciliationFail('INVALID_PAYMENT_REVIEW_SNAPSHOT','The payment review must preserve the complete recorded history at that point.');
    }
  }
}

export function createReconciliation(){return {version:RECONCILIATION_VERSION,groups:[]};}
export function validateReconciliation(input){
  if(input===undefined)return createReconciliation();
  reconciliationKeys(input,['version','groups']);
  if(input.version!==RECONCILIATION_VERSION)reconciliationFail('RECONCILIATION_VERSION_UNSUPPORTED','This local reconciliation version needs a supported migration.');
  const seen=new Set();for(const group of reconciliationArray(input.groups,RECONCILIATION_LIMITS.groups))reconciliationCheckGroup(group,seen);
  let encoded;try{encoded=JSON.stringify(input);}catch{reconciliationFail('INVALID_RECONCILIATION_DATA','Use plain serializable local records.');}
  if(encoded.length>RECONCILIATION_LIMITS.serializedCharacters)reconciliationFail('RECONCILIATION_LIMIT','This reconciliation exceeds the local record size limit.');
  return JSON.parse(encoded);
}
function reconciliationGroup(state,id){reconciliationId(id);const group=state.groups.find(record=>record.id===id);if(!group)reconciliationFail('RECONCILIATION_GROUP_NOT_FOUND','The selected billing group is not in this case.');return group;}
export function addReconciliationGroup(input,fields,options={}){
  reconciliationKeys(fields,['label','billerLabel','serviceLabel','personLabel'],['label','billerLabel','serviceLabel']);const state=validateReconciliation(input);
  state.groups.push({...reconciliationStamp(options),personLabel:'',...fields,documents:[],payments:[],selections:[]});return validateReconciliation(state);
}
export function addReconciliationDocument(input,groupId,fields,options={}){
  reconciliationKeys(fields,reconciliationDocumentFields,['kind','label']);const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  const lines=reconciliationArray(Object.hasOwn(fields,'lines')?fields.lines:[],RECONCILIATION_LIMITS.lines).map(line=>{reconciliationKeys(line,reconciliationLineFields,[]);return {label:'',code:null,amountCents:null,units:null,...line};});
  group.documents.push({...reconciliationStamp(options),documentDate:null,receivedDate:null,reference:'',revisionOfId:null,totalPatientResponsibilityCents:null,statementBalanceCents:null,estimateCents:null,...fields,lines});return validateReconciliation(state);
}
export function addReconciliationPayment(input,groupId,fields,options={}){
  reconciliationKeys(fields,reconciliationPaymentFields,['kind','amountCents']);reconciliationChoice(fields.kind,RECONCILIATION_PAYMENT_KINDS);
  const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  group.payments.push({...reconciliationStamp(options),transactionDate:null,receiptReference:'',note:'',replacesId:null,...fields});return validateReconciliation(state);
}
export function voidReconciliationPayment(input,groupId,paymentId,fields,options={}){
  reconciliationKeys(fields,['reason']);reconciliationText(fields.reason,2000,true);const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  group.payments.push({...reconciliationStamp(options),kind:'void',amountCents:null,transactionDate:null,receiptReference:'',note:fields.reason,replacesId:paymentId});return validateReconciliation(state);
}
export function selectReconciliationDocuments(input,groupId,fields,options={}){
  reconciliationKeys(fields,reconciliationSelectionFields,['billId','eobId','estimateId','responsibilitySource','paymentsComplete']);const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  group.selections.push({...reconciliationStamp(options),reason:'',...fields,paymentRecordIds:group.payments.map(payment=>payment.id)});return validateReconciliation(state);
}

export function summarizeReconciliation(input){
  const state=validateReconciliation(input);
  const groups=state.groups.map(group=>{
    const selection=group.selections.at(-1)??null;
    const selected={billId:selection?.billId??null,eobId:selection?.eobId??null,estimateId:selection?.estimateId??null,responsibilitySource:selection?.responsibilitySource??null};
    const docById=new Map(group.documents.map(doc=>[doc.id,doc]));
    const bill=docById.get(selected.billId),eob=docById.get(selected.eobId),estimate=docById.get(selected.estimateId);
    const total=(selected.responsibilitySource==='bill'?bill:selected.responsibilitySource==='eob'?eob:null)?.totalPatientResponsibilityCents??null;
    const paymentView=reconciliationPaymentView(group);
    const paymentHistoryComplete=Boolean(selection?.paymentsComplete&&selection.paymentRecordIds.length===group.payments.length&&selection.paymentRecordIds.every((id,index)=>id===group.payments[index].id));
    let expectedRemainingCents=null,possibleCreditCents=null;
    if(total!==null&&paymentHistoryComplete&&paymentView.net>=0){const remainder=reconciliationAdd(total,-paymentView.net);expectedRemainingCents=Math.max(remainder,0);possibleCreditCents=Math.max(-remainder,0);}
    const statementBalanceCents=bill?.statementBalanceCents??null;
    const statementDifferenceCents=statementBalanceCents!==null&&expectedRemainingCents!==null?reconciliationAdd(statementBalanceCents,-expectedRemainingCents):null;
    const unselectedRevisionIds=group.documents.filter(doc=>{
      if(doc.id===selected[`${doc.kind}Id`]||!selected[`${doc.kind}Id`])return false;
      let ancestor=doc.revisionOfId;while(ancestor!==null){if(ancestor===selected[`${doc.kind}Id`])return true;ancestor=docById.get(ancestor).revisionOfId;}return false;
    }).map(doc=>doc.id);
    const questions=[];
    if(!selection)questions.push('Which bill and EOB versions belong to this person, biller and service group? Deliberately select the documents to compare.');
    if(total===null)questions.push('Does the selected bill or EOB explicitly show total patient responsibility before your payments? A displayed remaining balance or estimate cannot substitute for that total.');
    if(!paymentHistoryComplete)questions.push('Have you checked all relevant payments and refunds, including any deposits, and confirmed the current history? No entries alone does not mean nothing was paid.');
    if(paymentView.net<0)questions.push('Recorded refunds exceed recorded payments. Is an earlier payment missing, or does a refund belong to another person, biller or service? Review the scope before calculating a remainder or credit.');
    if(paymentView.active.some(payment=>!payment.transactionDate||!payment.receiptReference.trim()))questions.push('Can you add or locate the missing payment dates and receipt references? Correct an entry by appending a replacement so its history is preserved.');
    if(unselectedRevisionIds.length)questions.push('A revision of a selected document is recorded. Review its scope and deliberately select the version you want to use; the current selection has not changed.');
    if(bill?.totalPatientResponsibilityCents!==null&&bill?.totalPatientResponsibilityCents!==undefined&&eob?.totalPatientResponsibilityCents!==null&&eob?.totalPatientResponsibilityCents!==undefined&&bill.totalPatientResponsibilityCents!==eob.totalPatientResponsibilityCents)questions.push('The selected bill and EOB show different total patient responsibilities. Ask whether processing, scope or a later correction explains the difference.');
    if(statementDifferenceCents!==null&&statementDifferenceCents!==0)questions.push('The displayed statement balance differs from the amount calculated from your selected responsibility and payment history. Ask the biller to reconcile the documents and receipts before treating the difference as an error.');
    if(possibleCreditCents!==null&&possibleCreditCents>0)questions.push('Your recorded net payments exceed the selected responsibility. Ask the biller to verify any credit and how it will be handled; this calculation does not establish a refund entitlement.');
    return {id:group.id,label:group.label,billerLabel:group.billerLabel,serviceLabel:group.serviceLabel,personLabel:group.personLabel,selectionId:selection?.id??null,selected,paymentHistoryComplete,
      amounts:{statementBalanceCents,totalPatientResponsibilityCents:total,estimateCents:estimate?.estimateCents??null,recordedPaymentsCents:paymentView.paid,recordedRefundsCents:paymentView.refunded,recordedNetPaymentsCents:paymentView.net,expectedRemainingCents,possibleCreditCents,statementDifferenceCents},
      activePaymentIds:paymentView.active.map(payment=>payment.id),supersededPaymentIds:group.payments.filter(payment=>paymentView.replaced.has(payment.id)).map(payment=>payment.id),voidedPaymentIds:group.payments.filter(payment=>payment.kind==='void').map(payment=>payment.replacesId),unselectedRevisionIds,questions,notice:reconciliationNotice};
  });
  return {version:RECONCILIATION_VERSION,groups,notice:reconciliationNotice};
}
