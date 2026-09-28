/** Device-local case work. Never pass this object to the analysis API.
 * Records describe what a person entered; they are not independent verification,
 * legal deadline calculations, filed requests, receipt confirmation or approvals.
 */
export const WORKBOOK_VERSION = 1;
export const PROCESS_KINDS = Object.freeze(['appeal','correction','assistance','billing_hold','collection','court','estimate_dispute']);
export const PROCESS_STATUSES = Object.freeze(['preparing','in_progress','waiting','resolved','closed']);
export const EVIDENCE_KINDS = Object.freeze(['bill','eob','denial','estimate','policy','plan','receipt','letter','note','other']);
export const CRITERION_ASSESSMENTS = Object.freeze(['unknown','supported','missing','disputed']);
export const DEADLINE_KINDS = Object.freeze(['filing','response','follow_up','court','other']);
export const COMMUNICATION_CHANNELS = Object.freeze(['portal','mail','fax','phone','email','in_person','other']);
export const COMMUNICATION_DIRECTIONS = Object.freeze(['outgoing','incoming']);
export const HOLD_SCOPES = Object.freeze(['billing','collections','both','other']);
export const HOLD_STATUSES = Object.freeze(['requested','confirmed','denied','expired','released']);
export const OUTCOME_DECISIONS = Object.freeze(['approved','partly_approved','denied','withdrawn','resolved_other']);
export const WORKBOOK_LIMITS = Object.freeze({processes:30,evidence:200,criteria:50,deadlines:50,communications:100,holds:30,notes:4000,serializedCharacters:2_000_000});

export class WorkbookError extends Error {
  constructor(code,message) { super(message); this.name='WorkbookError'; this.code=code; }
}
const workbookFail=(code,message)=>{throw new WorkbookError(code,message);};
const workbookPlain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
function workbookKeys(value,allowed,required=[]) {
  if(!workbookPlain(value)||Object.keys(value).some(key=>!allowed.includes(key))||required.some(key=>!Object.hasOwn(value,key))) workbookFail('INVALID_WORKBOOK_FIELDS','A local workbook record has missing or unsupported fields.');
}
function workbookText(value,max,required=false) {
  if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)||(required&&!value.trim())) workbookFail('INVALID_WORKBOOK_TEXT',`Use ${required?'nonempty ':''}text of at most ${max} characters.`);
  return value;
}
function workbookEnum(value,choices){if(!choices.includes(value))workbookFail('INVALID_WORKBOOK_CHOICE','Choose a supported workbook option.');return value;}
function workbookDate(value,nullable=false){
  if(nullable&&value===null)return null;
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01'||value>'2200-12-31')workbookFail('INVALID_WORKBOOK_DATE','Use a real calendar date from 1900 through 2200.');
  const parsed=new Date(`${value}T12:00:00.000Z`);
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==value)workbookFail('INVALID_WORKBOOK_DATE','Use a real calendar date.');
  return value;
}
function workbookInstant(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value))workbookFail('INVALID_WORKBOOK_TIMESTAMP','The local record timestamp is invalid.');
  const parsed=new Date(value);if(!Number.isFinite(parsed.getTime())||parsed.toISOString()!==value)workbookFail('INVALID_WORKBOOK_TIMESTAMP','The local record timestamp is invalid.');return value;
}
function workbookId(value){if(typeof value!=='string'||!/^wb_[A-Za-z0-9_-]{8,80}$/.test(value))workbookFail('INVALID_WORKBOOK_ID','The local record identifier is invalid.');return value;}
function workbookStamp(options={}){
  const at=workbookInstant(options.now??new Date().toISOString());
  // Native bridges can pass a locally generated UUID through options.id.
  const recordId=options.id??(globalThis.crypto?.randomUUID?`wb_${globalThis.crypto.randomUUID()}`:null);
  if(!recordId)workbookFail('LOCAL_RANDOM_UNAVAILABLE','Secure local identifiers are unavailable.');
  return {id:workbookId(recordId),createdAt:at,updatedAt:at};
}
function workbookArray(value,max){if(!Array.isArray(value)||value.length>max)workbookFail('WORKBOOK_LIMIT','This local workbook has too many records.');return value;}
function workbookCommon(record,seen){workbookId(record.id);if(seen.has(record.id))workbookFail('DUPLICATE_WORKBOOK_ID','Local record identifiers must be unique.');seen.add(record.id);workbookInstant(record.createdAt);workbookInstant(record.updatedAt);if(record.updatedAt<record.createdAt)workbookFail('INVALID_WORKBOOK_TIMESTAMP','An update cannot precede creation.');}
const workbookBaseKeys=['id','createdAt','updatedAt'];
const workbookRecordFields={
  evidence:['label','kind','locator','note'],
  criteria:['requirement','sourceLabel','assessment','evidenceIds','note'],
  deadlines:['title','date','kind','confirmed','sourceLabel','note'],
  communications:['direction','channel','recipient','subject','sentAt','receivedAt','receiptReference','note'],
  holds:['scope','status','requestedAt','confirmedAt','throughDate','confirmedBy','reference','note']
};
function workbookCheckRecord(collection,record,seen,evidenceIds){
  const fields=workbookRecordFields[collection];workbookKeys(record,[...workbookBaseKeys,...fields],[...workbookBaseKeys,...fields]);workbookCommon(record,seen);
  workbookText(record.note,WORKBOOK_LIMITS.notes);
  if(collection==='evidence'){
    workbookText(record.label,240,true);workbookEnum(record.kind,EVIDENCE_KINDS);workbookText(record.locator,500);
  }else if(collection==='criteria'){
    workbookText(record.requirement,1000,true);workbookText(record.sourceLabel,500);workbookEnum(record.assessment,CRITERION_ASSESSMENTS);
    workbookArray(record.evidenceIds,50);const refs=new Set();for(const reference of record.evidenceIds){workbookId(reference);if(!evidenceIds.has(reference)||refs.has(reference))workbookFail('INVALID_EVIDENCE_REFERENCE','Choose distinct evidence records from this case.');refs.add(reference);}
    if(record.assessment==='supported'&&!record.evidenceIds.length)workbookFail('EVIDENCE_REQUIRED','Link the user-recorded evidence supporting this criterion.');
  }else if(collection==='deadlines'){
    workbookText(record.title,240,true);workbookDate(record.date);workbookEnum(record.kind,DEADLINE_KINDS);workbookText(record.sourceLabel,500);
    if(typeof record.confirmed!=='boolean')workbookFail('DEADLINE_CONFIRMATION_REQUIRED','Choose whether you have confirmed this date from its source.');
    if(record.confirmed&&!record.sourceLabel.trim())workbookFail('DEADLINE_SOURCE_REQUIRED','Record the notice, rule or other source you used to confirm this date.');
    if(record.kind==='follow_up'&&record.confirmed)workbookFail('REMINDER_NOT_DEADLINE','A chosen follow-up reminder is not a confirmed legal deadline.');
  }else if(collection==='communications'){
    workbookEnum(record.direction,COMMUNICATION_DIRECTIONS);workbookEnum(record.channel,COMMUNICATION_CHANNELS);workbookText(record.recipient,240,true);workbookText(record.subject,300,true);
    workbookDate(record.sentAt,true);workbookDate(record.receivedAt,true);workbookText(record.receiptReference,700);
    if(record.receivedAt&&!record.receiptReference.trim())workbookFail('RECEIPT_REFERENCE_REQUIRED','Describe the receipt or acknowledgement that supports the recorded received date.');
    if(record.direction==='outgoing'&&record.receivedAt&&!record.sentAt)workbookFail('SENT_DATE_REQUIRED','Record when you actually sent the outgoing request before recording receipt.');
    if(record.sentAt&&record.receivedAt&&record.receivedAt<record.sentAt)workbookFail('INVALID_RECEIPT_DATE','Receipt cannot precede the recorded sent date.');
  }else if(collection==='holds'){
    workbookEnum(record.scope,HOLD_SCOPES);workbookEnum(record.status,HOLD_STATUSES);workbookDate(record.requestedAt,true);workbookDate(record.confirmedAt,true);workbookDate(record.throughDate,true);workbookText(record.confirmedBy,240);workbookText(record.reference,700);
    if(record.status==='requested'&&!record.requestedAt)workbookFail('REQUEST_DATE_REQUIRED','Record the date you actually requested the hold.');
    if(record.status==='confirmed'&&(!record.confirmedAt||!record.confirmedBy.trim()||!record.reference.trim()))workbookFail('HOLD_CONFIRMATION_REQUIRED','Record who confirmed the hold, when, and the supporting reference.');
    if(record.throughDate&&!record.confirmedAt)workbookFail('HOLD_CONFIRMATION_REQUIRED','A confirmed hold end needs its confirmation date. Put an unconfirmed proposed end in notes instead.');
    if(['requested','denied'].includes(record.status)&&record.confirmedAt)workbookFail('CONFLICTING_HOLD_STATE','A requested or denied hold cannot also have a confirmed date.');
    if(record.requestedAt&&record.confirmedAt&&record.confirmedAt<record.requestedAt)workbookFail('INVALID_HOLD_DATE','Hold confirmation cannot precede the recorded request.');
    if(record.confirmedAt&&record.throughDate&&record.throughDate<record.confirmedAt)workbookFail('INVALID_HOLD_DATE','The recorded hold end cannot precede its confirmation.');
  }
}
function workbookCheckOutcome(outcome){
  if(outcome===null)return;
  workbookKeys(outcome,['decision','date','sourceLabel','note'],['decision','date','sourceLabel','note']);
  workbookEnum(outcome.decision,OUTCOME_DECISIONS);workbookDate(outcome.date);workbookText(outcome.sourceLabel,500,true);workbookText(outcome.note,WORKBOOK_LIMITS.notes);
}

export function createWorkbook(){return {version:WORKBOOK_VERSION,evidence:[],processes:[]};}
/** Calendar-only records follow the device's local day, not the UTC date. */
export function localCalendarDate(date=new Date()){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))workbookFail('INVALID_WORKBOOK_DATE','Use a valid local calendar date.');
  return workbookDate(`${String(date.getFullYear()).padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`);
}
/** Strict validation returns a deep plain-data copy; unsupported future versions fail visibly. */
export function validateWorkbook(input){
  workbookKeys(input,['version','evidence','processes'],['version','evidence','processes']);
  if(input.version!==WORKBOOK_VERSION)workbookFail('WORKBOOK_VERSION_UNSUPPORTED','This workbook version needs a supported migration.');
  workbookArray(input.evidence,WORKBOOK_LIMITS.evidence);workbookArray(input.processes,WORKBOOK_LIMITS.processes);
  const seen=new Set(),evidenceIds=new Set(input.evidence.map(record=>record?.id));
  for(const record of input.evidence)workbookCheckRecord('evidence',record,seen,evidenceIds);
  for(const process of input.processes){
    workbookKeys(process,[...workbookBaseKeys,'kind','title','status','notes','criteria','deadlines','communications','holds','outcome'],[...workbookBaseKeys,'kind','title','status','notes','criteria','deadlines','communications','holds','outcome']);
    workbookCommon(process,seen);workbookEnum(process.kind,PROCESS_KINDS);workbookText(process.title,240,true);workbookEnum(process.status,PROCESS_STATUSES);workbookText(process.notes,WORKBOOK_LIMITS.notes);workbookCheckOutcome(process.outcome);
    if(process.status==='resolved'&&!process.outcome)workbookFail('OUTCOME_REQUIRED','Record the actual outcome and its source before marking this process resolved.');
    for(const collection of ['criteria','deadlines','communications','holds'])for(const record of workbookArray(process[collection],WORKBOOK_LIMITS[collection]))workbookCheckRecord(collection,record,seen,evidenceIds);
  }
  let encoded;try{encoded=JSON.stringify(input);}catch{workbookFail('INVALID_WORKBOOK_DATA','The local workbook must contain plain serializable data.');}
  if(encoded.length>WORKBOOK_LIMITS.serializedCharacters)workbookFail('WORKBOOK_LIMIT','This workbook exceeds the local record size limit.');
  return JSON.parse(encoded);
}
function workbookProcess(workbook,processId){const process=workbook.processes.find(record=>record.id===processId);if(!process)workbookFail('PROCESS_NOT_FOUND','The selected process is no longer in this case.');return process;}
function workbookTouch(record,options={}){const at=workbookInstant(options.now??new Date().toISOString());if(at<record.createdAt)workbookFail('INVALID_WORKBOOK_TIMESTAMP','An update cannot precede creation.');record.updatedAt=at;}
export function addProcess(input,fields,options={}){
  workbookKeys(fields,['kind','title','notes'],['kind','title']);const workbook=validateWorkbook(input);
  workbook.processes.push({...workbookStamp(options),kind:fields.kind,title:fields.title,status:'preparing',notes:fields.notes??'',criteria:[],deadlines:[],communications:[],holds:[],outcome:null});
  return validateWorkbook(workbook);
}
export function updateProcess(input,processId,patch,options={}){
  workbookKeys(patch,['title','status','notes','outcome']);const workbook=validateWorkbook(input),process=workbookProcess(workbook,processId);Object.assign(process,patch);workbookTouch(process,options);return validateWorkbook(workbook);
}
/** Deleting a process explicitly removes its local criteria/dates/history; shared evidence remains. */
export function removeProcess(input,processId){const workbook=validateWorkbook(input);workbookProcess(workbook,processId);workbook.processes=workbook.processes.filter(process=>process.id!==processId);return validateWorkbook(workbook);}
function workbookDefaults(collection,fields){
  if(collection==='evidence')return {label:'',kind:'other',locator:'',note:'',...fields};
  if(collection==='criteria')return {requirement:'',sourceLabel:'',assessment:'unknown',evidenceIds:[],note:'',...fields};
  if(collection==='deadlines')return {title:'',date:null,kind:'follow_up',confirmed:false,sourceLabel:'',note:'',...fields};
  if(collection==='communications')return {direction:'outgoing',channel:'other',recipient:'',subject:'',sentAt:null,receivedAt:null,receiptReference:'',note:'',...fields};
  return {scope:'billing',status:'requested',requestedAt:null,confirmedAt:null,throughDate:null,confirmedBy:'',reference:'',note:'',...fields};
}
function workbookAdd(input,processId,collection,fields,options={}){
  workbookKeys(fields,workbookRecordFields[collection]);const workbook=validateWorkbook(input);
  const owner=collection==='evidence'?workbook:workbookProcess(workbook,processId);
  owner[collection].push({...workbookStamp(options),...workbookDefaults(collection,fields)});
  if(collection!=='evidence')workbookTouch(owner,options);return validateWorkbook(workbook);
}
function workbookUpdate(input,processId,collection,recordId,patch,options={}){
  workbookKeys(patch,workbookRecordFields[collection]);const workbook=validateWorkbook(input),owner=collection==='evidence'?workbook:workbookProcess(workbook,processId);
  const record=owner[collection].find(record=>record.id===recordId);if(!record)workbookFail('RECORD_NOT_FOUND','The selected record is no longer in this process.');
  Object.assign(record,patch);workbookTouch(record,options);if(collection!=='evidence')workbookTouch(owner,options);return validateWorkbook(workbook);
}
function workbookRemove(input,processId,collection,recordId,options={}){
  const workbook=validateWorkbook(input),owner=collection==='evidence'?workbook:workbookProcess(workbook,processId);
  if(!owner[collection].some(record=>record.id===recordId))workbookFail('RECORD_NOT_FOUND','The selected record is no longer in this process.');
  if(collection==='evidence'&&workbook.processes.some(process=>process.criteria.some(criterion=>criterion.evidenceIds.includes(recordId))))workbookFail('EVIDENCE_IN_USE','Remove this evidence link from every criterion before deleting the evidence record.');
  owner[collection]=owner[collection].filter(record=>record.id!==recordId);if(collection!=='evidence')workbookTouch(owner,options);return validateWorkbook(workbook);
}
export const addEvidence=(w,fields,options)=>workbookAdd(w,null,'evidence',fields,options);
export const updateEvidence=(w,id,patch,options)=>workbookUpdate(w,null,'evidence',id,patch,options);
export const removeEvidence=(w,id,options)=>workbookRemove(w,null,'evidence',id,options);
export const addCriterion=(w,p,fields,options)=>workbookAdd(w,p,'criteria',fields,options);
export const updateCriterion=(w,p,id,patch,options)=>workbookUpdate(w,p,'criteria',id,patch,options);
export const removeCriterion=(w,p,id,options)=>workbookRemove(w,p,'criteria',id,options);
export const addDeadline=(w,p,fields,options)=>workbookAdd(w,p,'deadlines',fields,options);
export const updateDeadline=(w,p,id,patch,options)=>workbookUpdate(w,p,'deadlines',id,patch,options);
export const removeDeadline=(w,p,id,options)=>workbookRemove(w,p,'deadlines',id,options);
export const addCommunication=(w,p,fields,options)=>workbookAdd(w,p,'communications',fields,options);
export const updateCommunication=(w,p,id,patch,options)=>workbookUpdate(w,p,'communications',id,patch,options);
export const removeCommunication=(w,p,id,options)=>workbookRemove(w,p,'communications',id,options);
export const addHold=(w,p,fields,options)=>workbookAdd(w,p,'holds',fields,options);
export const updateHold=(w,p,id,patch,options)=>workbookUpdate(w,p,'holds',id,patch,options);
export const removeHold=(w,p,id,options)=>workbookRemove(w,p,'holds',id,options);

/** Summary is a view of user-entered records, never a legal clock or eligibility engine. */
export function summarizeWorkbook(input,{today}={}){
  const workbook=validateWorkbook(input);today=workbookDate(today??localCalendarDate());
  const deadlines=[],holds=[],processes=workbook.processes.map(process=>{
    const closed=['resolved','closed'].includes(process.status);
    for(const record of process.deadlines)deadlines.push({...record,processId:process.id,processTitle:process.title,processClosed:closed,dateStatus:record.date<today?'past':record.date===today?'today':'upcoming',isConfirmedDeadline:record.confirmed&&record.kind!=='follow_up',isReminder:record.kind==='follow_up',userRecorded:true});
    for(const record of process.holds)holds.push({...record,processId:process.id,effectiveStatus:record.status==='confirmed'&&record.throughDate&&record.throughDate<today?'past_recorded_end':record.status,changesDeadlines:false,userRecorded:true});
    return {id:process.id,title:process.title,kind:process.kind,status:process.status,criteria:process.criteria.length,missingCriteria:process.criteria.filter(row=>['unknown','missing','disputed'].includes(row.assessment)).length,sent:process.communications.filter(row=>row.sentAt&&row.direction==='outgoing').length,received:process.communications.filter(row=>row.receivedAt).length,awaitingReceipt:process.communications.filter(row=>row.direction==='outgoing'&&row.sentAt&&!row.receivedAt).length,hasRecordedOutcome:Boolean(process.outcome),userRecorded:true};
  });
  deadlines.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  return {version:WORKBOOK_VERSION,processes,deadlines,holds,evidenceCount:workbook.evidence.length,notice:'User-recorded preparation and history. Sent is not received; received is not approved. A requested or confirmed billing/collection hold does not change an appeal, dispute or court deadline.'};
}
