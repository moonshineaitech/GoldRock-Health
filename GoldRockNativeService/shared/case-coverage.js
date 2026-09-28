/** Local user-recorded coverage evidence. Never an eligibility or primary-payer decision. */
export const COVERAGE_CONTEXT_KINDS=Object.freeze(['private','medicare_original','medicare_advantage','medicaid','other','unknown']);
export const COVERAGE_CONTEXT_FUNDING=Object.freeze(['fully_insured','self_funded','not_applicable','unknown']);
export const COVERAGE_CONTEXT_ERISA=Object.freeze(['yes','no','unknown']);
export const COVERAGE_CONTEXT_AUTHORITIES=Object.freeze(['state_insurance','ebsa','medicare','state_medicaid','other','unknown']);
export const COVERAGE_DOCUMENT_TYPES=Object.freeze(['spd','sbc','policy','amendment','coverage_notice','denial_notice','other','unknown']);
export const COVERAGE_CONTEXT_LIMITS=Object.freeze({periods:100,documents:200,reviews:200,selectedPeriods:30,selectedDocuments:50,label:160,reference:700,note:2000,serializedCharacters:2_000_000});
export class CoverageContextError extends Error{constructor(code,message){super(message);this.name='CoverageContextError';this.code=code;}}
const coverageContextFail=(code,message)=>{throw new CoverageContextError(code,message);};
function coverageContextObject(value,allowed,required=allowed){
  if(value===null||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))coverageContextFail('INVALID_COVERAGE_FIELDS','Use a plain local coverage record.');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!allowed.includes(key)||!descriptors[key].enumerable||!Object.hasOwn(descriptors[key],'value')||descriptors[key].value===undefined)||required.some(key=>!Object.hasOwn(value,key)))coverageContextFail('INVALID_COVERAGE_FIELDS','A local coverage record has missing or unsupported fields.');
}
function coverageContextArray(value,max){
  if(!Array.isArray(value)||value.length>max||Object.keys(value).length!==value.length||Reflect.ownKeys(value).length!==value.length+1)coverageContextFail('COVERAGE_LIMIT','Use a bounded list of plain coverage records.');
  for(let index=0;index<value.length;index++){const descriptor=Object.getOwnPropertyDescriptor(value,String(index));if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))coverageContextFail('INVALID_COVERAGE_FIELDS','Coverage lists cannot contain missing or computed entries.');}return value;
}
function coverageContextText(value,max,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim())||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/.test(value))coverageContextFail('INVALID_COVERAGE_TEXT','Use bounded text and fill in required labels or evidence references.');return value;}
function coverageContextChoice(value,choices){if(!choices.includes(value))coverageContextFail('INVALID_COVERAGE_CHOICE','Choose a supported coverage-record option.');return value;}
function coverageContextId(value){if(typeof value!=='string'||!/^cc_[A-Za-z0-9_-]{8,80}$/.test(value))coverageContextFail('INVALID_COVERAGE_ID','The local coverage identifier is invalid.');return value;}
function coverageContextDate(value){
  if(value===null)return null;
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01'||value>'2200-12-31')coverageContextFail('INVALID_COVERAGE_DATE','Use a real calendar date from 1900 through 2200, or leave it unknown.');
  const date=new Date(`${value}T12:00:00.000Z`);if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)coverageContextFail('INVALID_COVERAGE_DATE','Use a real calendar date.');return value;
}
function coverageContextInstant(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)||value<'1900-01-01T00:00:00.000Z'||value>'2200-12-31T23:59:59.999Z')coverageContextFail('INVALID_COVERAGE_TIMESTAMP','The local coverage timestamp is invalid.');
  const date=new Date(value);if(!Number.isFinite(date.getTime())||date.toISOString()!==value)coverageContextFail('INVALID_COVERAGE_TIMESTAMP','The local coverage timestamp is invalid.');return value;
}
function coverageContextStamp(options={}){coverageContextObject(options,['id','now'],[]);const id=Object.hasOwn(options,'id')?options.id:(globalThis.crypto?.randomUUID?`cc_${globalThis.crypto.randomUUID()}`:null);if(!id)coverageContextFail('LOCAL_RANDOM_UNAVAILABLE','Secure local identifiers are unavailable.');return {id:coverageContextId(id),createdAt:coverageContextInstant(Object.hasOwn(options,'now')?options.now:new Date().toISOString())};}
function coverageContextCommon(record,seen,earliest){coverageContextId(record.id);if(seen.has(record.id))coverageContextFail('DUPLICATE_COVERAGE_ID','Every local coverage record needs a distinct identifier.');seen.add(record.id);coverageContextInstant(record.createdAt);if(earliest&&record.createdAt<earliest)coverageContextFail('INVALID_COVERAGE_TIMESTAMP','A record cannot precede its existing history.');}
const coverageContextStates=new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI unknown'.split(' '));
const coverageContextPeriodFields=['label','personLabel','memberReference','coverage','funding','erisa','authority','state','startDate','endDate','verification','verifiedOn','reference','note','replacesId'];
const coverageContextDocumentFields=['periodId','documentType','label','documentDate','effectiveDate','receivedDate','reference','revisionOfId','note','replacesId'];
const coverageContextReviewFields=['serviceDate','scopeLabel','periodIds','documentIds','reason'];
const coverageContextPeriodDefaults=()=>({personLabel:'',memberReference:'',coverage:'unknown',funding:'unknown',erisa:'unknown',authority:'unknown',state:'unknown',startDate:null,endDate:null,verification:'unverified',verifiedOn:null,reference:'',note:'',replacesId:null});
const coverageContextDocumentDefaults=()=>({documentDate:null,effectiveDate:null,receivedDate:null,revisionOfId:null,note:'',replacesId:null});
const coverageContextVoidPeriod=()=>({label:'',personLabel:'',memberReference:'',coverage:null,funding:null,erisa:null,authority:null,state:null,startDate:null,endDate:null,verification:null,verifiedOn:null,reference:''});
const coverageContextVoidDocument=()=>({periodId:null,documentType:null,label:'',documentDate:null,effectiveDate:null,receivedDate:null,reference:'',revisionOfId:null});
const coverageContextNotice='These are user-recorded dates and references, not verified coverage, benefits, regulator jurisdiction or payer order. Confirm the same person and service date with the actual plan. Unknown dates and empty records do not prove a coverage gap. Nothing is sent or added to cloud facts.';

function coverageContextView(records){
  const roots=new Map(),slots=[],slotById=new Map(),replaced=new Set(),voided=[];
  for(const record of records){let slot;if(record.replacesId===null){slot=slots.length;slots.push(record);roots.set(record.id,record.id);}else{slot=slotById.get(record.replacesId);slots[slot]=record.kind==='void'?null:record;roots.set(record.id,roots.get(record.replacesId));replaced.add(record.replacesId);if(record.kind==='void')voided.push(record.replacesId);}slotById.set(record.id,slot);}
  return {active:slots.filter(Boolean),roots,replaced,voided};
}
function coverageContextLink(record,earlier,replaced,normalKind){
  if(record.replacesId===null){if(record.kind==='void')coverageContextFail('INVALID_COVERAGE_VOID','A void must refer to an active record.');return null;}
  coverageContextId(record.replacesId);const target=earlier.get(record.replacesId);
  if(!target||target.kind!==normalKind||replaced.has(target.id))coverageContextFail('INVALID_COVERAGE_REPLACEMENT','Choose an earlier active record of the same kind from this coverage context.');
  coverageContextText(record.note,2000,true);replaced.add(target.id);return target;
}
function coverageContextCheckPeriod(record){
  coverageContextChoice(record.kind,['period','void']);coverageContextText(record.note,2000);
  if(record.kind==='void'){for(const [key,value] of Object.entries(coverageContextVoidPeriod()))if(record[key]!==value)coverageContextFail('INVALID_COVERAGE_VOID','A void contains only the recorded correction reason and target.');return;}
  coverageContextText(record.label,160,true);coverageContextText(record.personLabel,160);coverageContextText(record.memberReference,700);coverageContextText(record.reference,700);
  coverageContextChoice(record.coverage,COVERAGE_CONTEXT_KINDS);coverageContextChoice(record.funding,COVERAGE_CONTEXT_FUNDING);coverageContextChoice(record.erisa,COVERAGE_CONTEXT_ERISA);coverageContextChoice(record.authority,COVERAGE_CONTEXT_AUTHORITIES);
  if(!coverageContextStates.has(record.state))coverageContextFail('INVALID_COVERAGE_CHOICE','Use a supported state or territory code, or unknown.');
  if(['medicare_original','medicare_advantage','medicaid'].includes(record.coverage)&&!['not_applicable','unknown'].includes(record.funding))coverageContextFail('INVALID_COVERAGE_FUNDING','Public-program records do not use the private employer-plan funding classification.');
  coverageContextChoice(record.verification,['confirmed','unverified']);for(const key of ['startDate','endDate','verifiedOn'])coverageContextDate(record[key]);
  if(record.startDate&&record.endDate&&record.endDate<record.startDate)coverageContextFail('INVALID_COVERAGE_DATE','A recorded coverage end cannot precede its start.');
  if(record.verification==='confirmed'&&(!record.verifiedOn||!record.reference.trim()))coverageContextFail('COVERAGE_CONFIRMATION_REQUIRED','A recorded confirmation needs its date and evidence reference.');
}
function coverageContextIdList(value,max){const seen=new Set();for(const id of coverageContextArray(value,max)){coverageContextId(id);if(seen.has(id))coverageContextFail('INVALID_COVERAGE_SELECTION','Selected record identifiers must be distinct.');seen.add(id);}return value;}
function coverageContextSnapshot(ids,records,max,createdAt){coverageContextIdList(ids,max);for(let index=0;index<ids.length;index++)if(records[index]?.id!==ids[index]||records[index].createdAt>createdAt)coverageContextFail('INVALID_COVERAGE_SNAPSHOT','A review must preserve the recorded evidence available at that point.');if(records.slice(ids.length).some(record=>record.createdAt<createdAt))coverageContextFail('INVALID_COVERAGE_SNAPSHOT','A review cannot omit records entered before that review.');return records.slice(0,ids.length);}
function coverageContextCheckReview(review,state){
  coverageContextDate(review.serviceDate);coverageContextText(review.scopeLabel,160,true);coverageContextText(review.reason,2000);
  coverageContextIdList(review.periodIds,30);coverageContextIdList(review.documentIds,50);
  const periods=coverageContextSnapshot(review.periodRecordIds,state.periods,100,review.createdAt),documents=coverageContextSnapshot(review.documentRecordIds,state.documents,200,review.createdAt);
  const periodView=coverageContextView(periods),documentView=coverageContextView(documents),periodIds=new Set(periodView.active.map(record=>record.id)),documentIds=new Set(documentView.active.map(record=>record.id));
  if(review.periodIds.some(id=>!periodIds.has(id))||review.documentIds.some(id=>!documentIds.has(id)))coverageContextFail('INVALID_COVERAGE_SELECTION','Deliberately select active period and document records from this review snapshot.');
  const roots=new Set(review.periodIds.map(id=>periodView.roots.get(id)));
  for(const id of review.documentIds){const doc=documentView.active.find(record=>record.id===id);if(!roots.has(periodView.roots.get(doc.periodId)))coverageContextFail('INVALID_COVERAGE_DOCUMENT_SCOPE','Selected documents must belong to a selected period lineage.');}
}
export function createCoverageContext(){return {version:1,periods:[],documents:[],reviews:[]};}
export function validateCoverageContext(input){
  if(input===undefined)return createCoverageContext();coverageContextObject(input,['version','periods','documents','reviews']);if(input.version!==1)coverageContextFail('COVERAGE_VERSION_UNSUPPORTED','This local coverage version needs a supported migration.');
  const seen=new Set(),periods=new Map(),periodReplaced=new Set();let prior=null;
  for(const record of coverageContextArray(input.periods,100)){coverageContextObject(record,['id','createdAt','kind',...coverageContextPeriodFields]);coverageContextCommon(record,seen,prior);prior=record.createdAt;coverageContextCheckPeriod(record);coverageContextLink(record,periods,periodReplaced,'period');periods.set(record.id,record);}
  const periodView=coverageContextView(input.periods),documents=new Map(),documentReplaced=new Set();prior=null;
  for(const record of coverageContextArray(input.documents,200)){
    coverageContextObject(record,['id','createdAt','kind',...coverageContextDocumentFields]);coverageContextCommon(record,seen,prior);prior=record.createdAt;coverageContextChoice(record.kind,['document','void']);coverageContextText(record.note,2000);
    const target=coverageContextLink(record,documents,documentReplaced,'document');
    if(record.kind==='void'){for(const [key,value] of Object.entries(coverageContextVoidDocument()))if(record[key]!==value)coverageContextFail('INVALID_COVERAGE_VOID','A void contains only the recorded correction reason and target.');}
    else{
      coverageContextId(record.periodId);const period=periods.get(record.periodId);if(!period||period.kind!=='period'||period.createdAt>record.createdAt)coverageContextFail('INVALID_COVERAGE_DOCUMENT_SCOPE','Choose an existing period record for this document reference.');
      coverageContextChoice(record.documentType,COVERAGE_DOCUMENT_TYPES);coverageContextText(record.label,160,true);coverageContextText(record.reference,700,true);for(const key of ['documentDate','effectiveDate','receivedDate'])coverageContextDate(record[key]);
      if(record.documentDate&&record.receivedDate&&record.receivedDate<record.documentDate)coverageContextFail('INVALID_COVERAGE_DATE','A received date cannot precede its recorded document date.');
      if(target&&periodView.roots.get(record.periodId)!==periodView.roots.get(target.periodId))coverageContextFail('INVALID_COVERAGE_DOCUMENT_SCOPE','A document correction must stay in its original period lineage.');
      if(record.revisionOfId!==null){coverageContextId(record.revisionOfId);const original=documents.get(record.revisionOfId);if(!original||original.kind!=='document'||periodView.roots.get(original.periodId)!==periodView.roots.get(record.periodId))coverageContextFail('INVALID_COVERAGE_REVISION','A document revision must refer to earlier evidence from the same period lineage.');}
      if(target){const priorView=coverageContextView([...documents.values()]);if((record.revisionOfId===null)!==(target.revisionOfId===null)||(record.revisionOfId!==null&&priorView.roots.get(record.revisionOfId)!==priorView.roots.get(target.revisionOfId)))coverageContextFail('INVALID_COVERAGE_REVISION','A correction cannot replace the document revision relationship with a different original.');}
    }
    documents.set(record.id,record);
  }
  prior=null;for(const review of coverageContextArray(input.reviews,200)){coverageContextObject(review,['id','createdAt',...coverageContextReviewFields,'periodRecordIds','documentRecordIds']);coverageContextCommon(review,seen,prior);prior=review.createdAt;coverageContextCheckReview(review,input);}
  let encoded;try{encoded=JSON.stringify(input);}catch{coverageContextFail('INVALID_COVERAGE_DATA','Use plain serializable local coverage records.');}if(encoded.length>2_000_000)coverageContextFail('COVERAGE_LIMIT','This coverage history exceeds the local size limit.');return JSON.parse(encoded);
}
function coverageContextAppendStamp(state,options){const stamp=coverageContextStamp(options),latest=[state.periods.at(-1)?.createdAt,state.documents.at(-1)?.createdAt,state.reviews.at(-1)?.createdAt].filter(Boolean).sort().at(-1);if(latest&&stamp.createdAt<latest)coverageContextFail('INVALID_COVERAGE_TIMESTAMP','A new record cannot precede the existing coverage history.');return stamp;}
export function addCoveragePeriod(input,fields,options={}){coverageContextObject(fields,coverageContextPeriodFields,['label']);const state=validateCoverageContext(input);state.periods.push({...coverageContextAppendStamp(state,options),kind:'period',...coverageContextPeriodDefaults(),...fields});return validateCoverageContext(state);}
export function voidCoveragePeriod(input,id,fields,options={}){coverageContextObject(fields,['reason']);coverageContextText(fields.reason,2000,true);const state=validateCoverageContext(input);state.periods.push({...coverageContextAppendStamp(state,options),kind:'void',...coverageContextVoidPeriod(),note:fields.reason,replacesId:id});return validateCoverageContext(state);}
export function addCoverageDocument(input,fields,options={}){
  coverageContextObject(fields,coverageContextDocumentFields,['periodId','documentType','label','reference']);const state=validateCoverageContext(input),view=coverageContextView(state.periods);
  if(!view.active.some(record=>view.roots.get(record.id)===view.roots.get(fields.periodId)))coverageContextFail('INVALID_COVERAGE_DOCUMENT_SCOPE','Choose an active period lineage for the document.');
  state.documents.push({...coverageContextAppendStamp(state,options),kind:'document',...coverageContextDocumentDefaults(),...fields});return validateCoverageContext(state);
}
export function voidCoverageDocument(input,id,fields,options={}){coverageContextObject(fields,['reason']);coverageContextText(fields.reason,2000,true);const state=validateCoverageContext(input);state.documents.push({...coverageContextAppendStamp(state,options),kind:'void',...coverageContextVoidDocument(),note:fields.reason,replacesId:id});return validateCoverageContext(state);}
export function selectCoverageContext(input,fields,options={}){coverageContextObject(fields,coverageContextReviewFields,['serviceDate','scopeLabel','periodIds','documentIds']);const state=validateCoverageContext(input);state.reviews.push({...coverageContextAppendStamp(state,options),reason:'',...fields,periodRecordIds:state.periods.map(record=>record.id),documentRecordIds:state.documents.map(record=>record.id)});return validateCoverageContext(state);}

const coverageContextReviewedAt='2026-09-27T00:00:00.000Z',coverageContextExpiresAt='2026-12-27T00:00:00.000Z';
const coverageContextPublicSources=[
  {id:'coverage-dol-plan-documents',title:'Plan information and changes',url:'https://www.dol.gov/general/topic/health-plans/planinformation',publisher:'U.S. Department of Labor',applicability:'ERISA plan disclosures; confirm actual applicability.',reviewMethod:'Official indexed source text reviewed; direct retrieval failed.'},
  {id:'coverage-dol-claims',title:'Filing a health-benefit claim',url:'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/filing-a-claim-for-your-health-benefits',publisher:'U.S. Department of Labor',applicability:'ERISA-covered health plans; government and most church plans use other rules.',reviewMethod:'Official indexed source material reviewed; direct retrieval failed.'},
  {id:'coverage-wa-plan-authority',title:'Finding the right employer-plan contact',url:'https://www.insurance.wa.gov/insurance-resources/health-insurance/health-insurance-coverage/who-contact-issues-your-employer-health-plan',publisher:'Washington Office of the Insurance Commissioner',applicability:'Washington guidance illustrating plan-type distinctions; verify other jurisdictions separately.',reviewMethod:'Official indexed page text reviewed; direct retrieval failed.'},
  {id:'coverage-cms-coordination',title:'Medicare coordination of benefits',url:'https://www.cms.gov/medicare/coordination-benefits-recovery/overview/coordination-benefits',publisher:'CMS',applicability:'Medicare and other coverage; actual payer order requires applicable coordination rules.',reviewMethod:'Public primary page retrieved and reviewed.'},
  {id:'coverage-medicare-other',title:'Medicare and other insurance',url:'https://www.medicare.gov/health-drug-plans/coordination',publisher:'Medicare.gov',applicability:'People with Medicare and another payer; no universal payer-order rule inferred.',reviewMethod:'Public primary page retrieved and reviewed.'},
  {id:'coverage-medicaid-effective',title:'Medicaid eligibility and effective coverage',url:'https://www.medicaid.gov/medicaid/eligibility-policy',publisher:'Medicaid.gov',applicability:'Actual state/program determination; no automatic retroactive-coverage calculation.',reviewMethod:'Public primary page retrieved and reviewed.'},
  {id:'coverage-marketplace-activation',title:'Marketplace coverage questions',url:'https://www.healthcare.gov/get-answers/',publisher:'HealthCare.gov',applicability:'Marketplace enrollment and activation; not every insurance program.',reviewMethod:'Official indexed page text reviewed.'}
];
function coverageContextGuidance(periods,now){
  let time;try{time=new Date(now).getTime();}catch{time=NaN;}const current=Number.isFinite(time)&&time>=Date.parse(coverageContextReviewedAt)&&time<Date.parse(coverageContextExpiresAt);
  const sources=coverageContextPublicSources.map(source=>({...source,reviewedAt:coverageContextReviewedAt,expiresAt:coverageContextExpiresAt,current}));
  const checklist=current?['Locate the confirmation of enrollment and dates for this person; a current card or selected plan alone may not answer whether the service date was covered.','Keep the applicable plan or policy, summary and amendments separately. Record their effective and receipt dates, and ask which version governed the care.','Keep the actual EOB or decision and claim procedure with their references. Confirm any filing or appeal instructions from the applicable notice; this workspace does not calculate a deadline.']:[];
  const questions=current?['Which documents and period confirmation apply to this person and service date, and what remains unverified?']:[];
  if(current){
    if(periods.some(period=>period.coverage==='private'))questions.push('Is the private plan insured or self-funded, and does ERISA apply? Ask the administrator; a carrier logo may identify an administrator rather than the party funding claims. Verify the appropriate regulator, including government or religious-plan exceptions.');
    if(periods.some(period=>period.coverage==='private'&&period.erisa==='yes'))questions.push('For the recorded ERISA plan, do you have the SPD, SBC, relevant modifications and actual claims procedure? Ask which terms were effective for the service date.');
    if(periods.some(period=>period.coverage==='medicare_original'||period.coverage==='medicare_advantage'))questions.push('Is this Original Medicare or a Medicare Advantage plan for the service date? Confirm other coverage and the applicable coordination process; do not choose the primary payer from overlapping dates.');
    if(periods.some(period=>period.coverage==='medicaid'))questions.push('What effective dates did the state or program actually determine, and which plan administered the care then? Keep later notices without automatically backdating coverage.');
    if(periods.some(period=>period.coverage==='private'&&period.funding==='unknown'))questions.push('If this was Marketplace coverage, did the insurer confirm activation and the first premium? That requirement is Marketplace-specific, not a universal employer-plan rule.');
  }
  return {current,reviewedAt:coverageContextReviewedAt,expiresAt:coverageContextExpiresAt,sources,checklist,questions};
}
function coverageContextDateMatch(period,serviceDate){if(!serviceDate)return 'not_checked';if(period.startDate&&serviceDate<period.startDate||period.endDate&&serviceDate>period.endDate)return 'outside_recorded_period';return period.startDate&&period.endDate?'within_recorded_period':'uncertain';}
export function summarizeCoverageContext(input,options={}){
  coverageContextObject(options,['now'],[]);const state=validateCoverageContext(input),periodView=coverageContextView(state.periods),documentView=coverageContextView(state.documents),review=state.reviews.at(-1)??null;
  const reviewCurrent=Boolean(review&&review.periodRecordIds.length===state.periods.length&&review.documentRecordIds.length===state.documents.length);
  const selectedPeriodIds=review?.periodIds??[],selectedDocumentIds=review?.documentIds??[],serviceDate=review?.serviceDate??null;
  const selectedPeriods=periodView.active.filter(period=>selectedPeriodIds.includes(period.id));
  const personLabels=new Set(selectedPeriods.map(period=>period.personLabel.trim().toLocaleLowerCase()).filter(Boolean)),scopeConflict=personLabels.size>1;
  const periods=periodView.active.map(period=>({...period,selected:selectedPeriodIds.includes(period.id),dateMatch:reviewCurrent&&selectedPeriodIds.includes(period.id)?coverageContextDateMatch(period,serviceDate):'not_checked',documentIds:documentView.active.filter(doc=>periodView.roots.get(doc.periodId)===periodView.roots.get(period.id)).map(doc=>doc.id)}));
  const documents=documentView.active.map(doc=>{const activePeriod=periodView.active.find(period=>periodView.roots.get(period.id)===periodView.roots.get(doc.periodId));return {...doc,selected:selectedDocumentIds.includes(doc.id),periodActive:Boolean(activePeriod),earlierPeriodVersion:Boolean(activePeriod&&activePeriod.id!==doc.periodId),effectiveAfterService:reviewCurrent&&serviceDate&&doc.effectiveDate?doc.effectiveDate>serviceDate:null};});
  const matching=periods.filter(period=>period.selected&&period.dateMatch==='within_recorded_period'),uncertain=periods.filter(period=>period.selected&&period.dateMatch==='uncertain');
  let status=!review?'unreviewed':!reviewCurrent?'review_needed':!serviceDate?'date_unknown':!selectedPeriodIds.length?'scope_empty':scopeConflict?'uncertain':matching.length>1?'possible_overlap':uncertain.length?'uncertain':matching.length===1?(matching[0].verification==='confirmed'?'candidate':'uncertain'):'possible_gap';
  const docsById=new Map(state.documents.map(doc=>[doc.id,doc]));
  const selectedDocumentRoots=new Set(selectedDocumentIds.map(id=>documentView.roots.get(id)));
  const unselectedRevisionIds=documentView.active.filter(doc=>{if(selectedDocumentIds.includes(doc.id))return false;let ancestor=doc.revisionOfId;const visited=new Set();while(ancestor){if(visited.has(ancestor))break;visited.add(ancestor);if(selectedDocumentRoots.has(documentView.roots.get(ancestor)))return true;ancestor=docsById.get(ancestor)?.revisionOfId??null;}return false;}).map(doc=>doc.id);
  const questions=[];
  if(!review)questions.push('Choose the service date, person/service scope and period/document records you want to compare. Nothing is selected automatically.');
  else if(!reviewCurrent)questions.push('Coverage evidence changed after the last review. Deliberately review the selected date, periods and document versions again; earlier selections remain in history.');
  if(reviewCurrent&&!serviceDate)questions.push('Which service date are you checking? A bill date or document receipt date does not substitute for the care date.');
  if(reviewCurrent&&!selectedPeriodIds.length)questions.push('Which period records belong to this review? No selection does not establish that the person was uninsured.');
  if(scopeConflict)questions.push('The selected records use different person labels. Verify the same person and service scope before interpreting any apparent overlap or gap.');
  if(status==='possible_overlap')questions.push('More than one recorded period contains this date. Check whether these records concern separate overlapping plans, duplicated entries or different benefits; confirm coordination with the plans without assigning a primary payer here.');
  if(status==='possible_gap')questions.push('The selected records do not contain this service date. Ask whether a period, correction or effective-date notice is missing before concluding there was no coverage.');
  if(status==='uncertain'&&!scopeConflict)questions.push('At least one potentially relevant period has unknown dates or an unverified confirmation. Check the original evidence; unknown end dates are not treated as ongoing coverage.');
  if(reviewCurrent&&!selectedDocumentIds.length)questions.push('Which plan, policy or notice references support this comparison? Selecting a period does not select any document automatically.');
  if(documents.some(doc=>doc.selected&&doc.earlierPeriodVersion))questions.push('A selected document was attached to an earlier corrected period record. Its link is preserved; verify that it applies to the current selected period.');
  if(documents.some(doc=>doc.selected&&doc.effectiveAfterService))questions.push('A selected document has an effective date after the service date. Ask which terms applied to the earlier care; neither a later receipt nor a revision automatically changes that answer.');
  if(unselectedRevisionIds.length)questions.push('A revision of selected document evidence is recorded but not selected. Review whether the original, amendment or both apply; no version was selected automatically.');
  const guidance=coverageContextGuidance(reviewCurrent?selectedPeriods:[],Object.hasOwn(options,'now')?options.now:new Date());if(!guidance.current)questions.push('The public guidance needs a new source review. Your local dates and references remain available; open the official sources to verify current procedures.');
  return {version:1,reviewId:review?.id??null,reviewCurrent,serviceDate,scopeLabel:review?.scopeLabel??'',status,scopeConflict,selectedPeriodIds,selectedDocumentIds,
    activePeriodIds:periodView.active.map(record=>record.id),supersededPeriodIds:state.periods.filter(record=>periodView.replaced.has(record.id)).map(record=>record.id),voidedPeriodIds:periodView.voided,
    activeDocumentIds:documentView.active.map(record=>record.id),supersededDocumentIds:state.documents.filter(record=>documentView.replaced.has(record.id)).map(record=>record.id),voidedDocumentIds:documentView.voided,
    unselectedRevisionIds,periods,documents,questions,guidance,notice:coverageContextNotice};
}
