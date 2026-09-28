import { validateFacts, FACT_KEYS } from './validation.js';

/** Local suggestion only. This adapter cannot save, select evidence or create payments. */
export const RECONCILIATION_INTAKE_VERSION = 1;
export class ReconciliationIntakeError extends Error {
  constructor(){super('The extracted facts could not be safely prepared for reconciliation. Review the original and use manual entry.');this.name='ReconciliationIntakeError';this.code='INVALID_RECONCILIATION_INTAKE_FACTS';}
}
const reconciliationIntakeMessages=Object.freeze({
  REVIEW_ORIGINAL:'Check every proposed value against the original document. Local extraction can confuse labels, amounts and document types.',
  CONFIRM_DOCUMENT_SCOPE:'Choose the person, biller and services deliberately. This proposal does not match documents, select current evidence or confirm payment history.',
  UNKNOWN_DOCUMENT_TYPE:'The document type is unknown or mixed. Review or separate the source before recording its type and amounts; scoped values and lines have been withheld.',
  DENIAL_REQUIRES_MANUAL_ENTRY:'A denial notice is not automatically a bill, EOB or estimate. Review the source and record the appropriate evidence manually; amounts and lines have been withheld.',
  PAYMENT_TOTAL_NOT_IMPORTED:'An extracted patient-payment total is not a payment receipt or complete history. No payment or refund transaction was created or proposed.',
  OUT_OF_SCOPE_AMOUNTS_OMITTED:'Other extracted money fields were omitted. Gross charges, adjustments, plan payments and unrelated amounts do not establish this document’s total patient responsibility.',
  BILL_RESPONSIBILITY_MEANING:'Confirm that the responsibility label means total patient responsibility before your payments. A remaining bill balance must not be used as that total.',
  MISSING_DOCUMENT_AMOUNTS:'No supported document-level amount was available for this type. Leave unknown amounts blank or enter them after reviewing the original; line totals are not substituted.',
  LINES_ARE_OBSERVATIONS:'Code, amount and unit observations need review. Amounts are not multiplied by units, summed into responsibility, matched to other documents or treated as proven duplicate charges.'
});
const reconciliationIntakeWarning=code=>({code,message:reconciliationIntakeMessages[code]});
function reconciliationIntakePlain(value){return value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));}
function reconciliationIntakeCheckObject(value,allowed){
  if(!reconciliationIntakePlain(value))throw new ReconciliationIntakeError();
  const descriptors=Object.getOwnPropertyDescriptors(value);
  for(const key of Reflect.ownKeys(descriptors)){
    const descriptor=descriptors[key];
    if(typeof key!=='string'||!allowed.includes(key)||!descriptor.enumerable||!Object.hasOwn(descriptor,'value')||descriptor.value===undefined)throw new ReconciliationIntakeError();
  }
}
function reconciliationIntakePrimitive(value){
  if(value!==null&&!['string','number','boolean'].includes(typeof value))throw new ReconciliationIntakeError();
  if(typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))throw new ReconciliationIntakeError();
}
function reconciliationIntakeValidate(input){
  try{
    reconciliationIntakeCheckObject(input,FACT_KEYS);
    for(const key of Object.keys(input)){
      if(key!=='lines'){reconciliationIntakePrimitive(input[key]);continue;}
      const lines=input.lines;
      if(!Array.isArray(lines)||lines.length>100||Object.keys(lines).length!==lines.length||Reflect.ownKeys(lines).length!==lines.length+1)throw new ReconciliationIntakeError();
      for(let index=0;index<lines.length;index++){
        const descriptor=Object.getOwnPropertyDescriptor(lines,String(index));
        if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))throw new ReconciliationIntakeError();
        reconciliationIntakeCheckObject(descriptor.value,['id','code','amountCents','units']);
        for(const value of Object.values(descriptor.value))reconciliationIntakePrimitive(value);
      }
    }
    return validateFacts(input);
  }catch{throw new ReconciliationIntakeError();}
}

export function proposeReconciliationIntake(input){
  const facts=reconciliationIntakeValidate(input);
  const candidateKind=['bill','eob','estimate'].includes(facts.documentType)?facts.documentType:null;
  const draft={totalPatientResponsibilityCents:null,statementBalanceCents:null,estimateCents:null,lines:[]};
  const sourceFields={totalPatientResponsibilityCents:null,statementBalanceCents:null,estimateCents:null,lines:null};
  const warnings=['REVIEW_ORIGINAL','CONFIRM_DOCUMENT_SCOPE'].map(reconciliationIntakeWarning);
  if(candidateKind===null){
    warnings.push(reconciliationIntakeWarning(facts.documentType==='denial'?'DENIAL_REQUIRES_MANUAL_ENTRY':'UNKNOWN_DOCUMENT_TYPE'));
  }else{
    if((candidateKind==='bill'||candidateKind==='eob')&&facts.eobResponsibilityCents!==undefined&&facts.eobResponsibilityCents!==null){
      draft.totalPatientResponsibilityCents=facts.eobResponsibilityCents;sourceFields.totalPatientResponsibilityCents='eobResponsibilityCents';
      if(candidateKind==='bill')warnings.push(reconciliationIntakeWarning('BILL_RESPONSIBILITY_MEANING'));
    }
    if(candidateKind==='bill'&&facts.balanceCents!==undefined&&facts.balanceCents!==null){draft.statementBalanceCents=facts.balanceCents;sourceFields.statementBalanceCents='balanceCents';}
    if(candidateKind==='estimate'&&facts.estimateCents!==undefined&&facts.estimateCents!==null){draft.estimateCents=facts.estimateCents;sourceFields.estimateCents='estimateCents';}
    if(facts.lines?.length){
      draft.lines=facts.lines.map(line=>({code:line.code,amountCents:line.amountCents,units:line.units}));sourceFields.lines='lines';warnings.push(reconciliationIntakeWarning('LINES_ARE_OBSERVATIONS'));
    }
    if([draft.totalPatientResponsibilityCents,draft.statementBalanceCents,draft.estimateCents].every(value=>value===null))warnings.push(reconciliationIntakeWarning('MISSING_DOCUMENT_AMOUNTS'));
  }
  if(facts.paidCents!==undefined&&facts.paidCents!==null)warnings.push(reconciliationIntakeWarning('PAYMENT_TOTAL_NOT_IMPORTED'));
  const applicableMoney=new Set(Object.values(sourceFields).filter(field=>field!==null));
  if(['billedCents','adjustmentCents','insurancePaidCents','balanceCents','eobResponsibilityCents','estimateCents'].some(field=>facts[field]!==undefined&&facts[field]!==null&&!applicableMoney.has(field)))warnings.push(reconciliationIntakeWarning('OUT_OF_SCOPE_AMOUNTS_OMITTED'));
  return {version:RECONCILIATION_INTAKE_VERSION,requiresReview:true,status:candidateKind===null?'manual_type_required':'ready_for_review',candidateKind,draft,sourceFields,warnings};
}
