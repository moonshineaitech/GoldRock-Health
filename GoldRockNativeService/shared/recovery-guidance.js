/** Curated public preparation only. No member data, entitlement decision or sending. */
const recoveryReviewedAt='2026-09-27T00:00:00.000Z';
const recoveryExpiresAt='2026-12-27T00:00:00.000Z';
const recoverySourceRecords={
  'recovery-provider-ledger':{title:'Understanding provider charges and payments',publisher:'Mayo Clinic',url:'https://www.mayoclinic.org/billing-insurance/bills-payments/billing-process',applicability:'A provider-specific example of visit, payment, receipt and itemized-statement records. Other providers use their own processes.'},
  'recovery-irs-assistance':{title:'Refunds after hospital financial-assistance determinations',publisher:'IRS',url:'https://www.irs.gov/charities-non-profits/billing-and-collections-section-501r6',applicability:'Section 501(r) hospital facilities, covered care and a confirmed FAP-eligibility determination; not every provider or ordinary billing dispute.'},
  'recovery-dol-claim':{title:'Filing a claim for workplace health benefits',publisher:'U.S. Department of Labor',url:'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/filing-a-claim-for-your-health-benefits',applicability:'ERISA-covered workplace health plans. Confirm the plan document, claim procedure, recipient and relevant notice; different programs use different rules.'},
  'recovery-medicare-claim':{title:'Filing an Original Medicare claim',publisher:'Medicare.gov',url:'https://www.medicare.gov/providers-services/claims-appeals-complaints/claims',applicability:'Original Medicare beneficiary filing when the provider has not filed; Medicare Advantage and Part D use their own plan routes.'},
  'recovery-denial-review':{title:'Internal appeals after an insurer decision',publisher:'HealthCare.gov',url:'https://www.healthcare.gov/appeal-insurance-company-decision/internal-appeals/',applicability:'Applicable insurance appeal rights. Use the actual denial notice and plan-specific procedure, rather than assuming every request is an appeal.'}
};
const recoveryGuideRecords={
  refund:{
    title:'Ask the provider to review money you already paid',
    sourceIds:['recovery-provider-ledger','recovery-irs-assistance'],
    checklist:[
      'Match the same person, billing entity and services. Gather the current statement, EOB or assistance decision, payment receipts and any previous refunds; keep originals somewhere you control.',
      'Ask for the account ledger and a written explanation of payments, adjustments, transfers and any credit. A calculated difference is a question to resolve, not a confirmed refund.',
      'If a covered hospital has determined you eligible for its financial-assistance policy, ask how earlier payments were recalculated. Section 501(r) rules require refunds of qualifying excess payments, with an exception below $5; verify the covered care and determination.',
      'Confirm the billing team, secure channel and references needed. Ask whether any confirmed credit will be returned or applied elsewhere, to whom, by which method, and on what expected date.',
      'Keep your sent copy, acknowledgement and written decision separately. Record a personal follow-up date; verify applicable deadlines independently.',
      'Compare the actual returned payment or posted reversal with the decision. Track partial receipts, failed delivery or remaining questions before closing your record.'
    ],
    draft:'Subject: Please review my payment and account balance\n\nHello,\n\nI would like a review of the payments for the biller and services I identify through your secure channel. Please provide a ledger showing charges, adjustments, payments, transfers and refunds, and explain any difference from the current insurance or assistance decision.\n\nPlease confirm whether a credit is owed to me. If so, please explain the amount, intended recipient, payment method and expected timing. If a credit was applied elsewhere, please identify the account and basis so I can check it.\n\nIf you disagree or need more information, please identify what is missing and provide your explanation in writing. Please acknowledge this request and provide a reference for follow-up.\n\nThank you.',
    limitations:[
      'The preparation questions are GoldRock’s original workflow suggestions. A provider example or an apparent credit does not establish a universal refund right or response deadline.',
      'An approved credit, promised check or adjustment is not evidence that money reached you. Confirm the actual recipient and transaction.',
      'Recording a receipt here does not also enter it in Reconcile. If you separately update that ledger, avoid counting the same refund twice.'
    ]
  },
  reimbursement:{
    title:'Prepare a claim for care you paid for',
    sourceIds:['recovery-dol-claim','recovery-medicare-claim','recovery-denial-review'],
    checklist:[
      'Confirm which plan covered the service date, whether this care can be claimed, and whether the provider already filed. Ask who would receive any payment; paying the bill yourself does not establish coverage.',
      'Get the plan’s member-claim procedure and required form, supporting documents, filing destination and time limit. Keep a copy of what you actually send and proof of receipt.',
      'Use the actual itemized bill, proof of payment and any requested supporting records. Submit sensitive details directly through the recipient’s verified secure channel; GoldRock stores only references you choose.',
      'For Original Medicare, first ask the provider to file and check the official beneficiary-filing instructions if it has not. The usual filing limit is 12 months from service, subject to exceptions; do not apply it to every plan.',
      'Record requests for missing information, their actual response instructions and your response receipt. A personal follow-up reminder is not a verified filing or appeal deadline.',
      'Keep the decision/EOB and stated reason. If denied or partly allowed, check the notice’s correction or appeal route. Track actual receipts separately from approved benefits.'
    ],
    draft:'Subject: Member claim procedure and payment review\n\nHello,\n\nI paid for care and would like to confirm the correct member-claim procedure for my plan. I will provide the service and account details through your verified secure channel.\n\nPlease confirm whether a claim already exists, the form and supporting documents required, the submission destination and applicable filing limit. Please explain who would receive any approved payment and how I can track it.\n\nIf you have already received my request, please confirm receipt and the claim reference, identify missing information, and provide the decision or current review status. For any denied or partially allowed amount, please provide the reason, relevant plan provision and correction or appeal instructions.\n\nThank you.',
    limitations:[
      'This checklist is preparation, not a completed insurance claim. A plan may require its own form, signatures or additional evidence.',
      'Plan payment can go to a provider rather than you. A deductible, exclusion, network rule or earlier claim may change the result; the requested amount is not an entitlement.',
      'FSA/HSA tax reimbursement, disability claims and recovery by an insurer against you are different processes and are not determined by this workflow.'
    ]
  }
};

export function getMoneyRecoveryGuide(kind,{now=new Date()}={}){
  if(!Object.hasOwn(recoveryGuideRecords,kind))return null;
  const entry=recoveryGuideRecords[kind],time=new Date(now).getTime();
  const current=Number.isFinite(time)&&time>=Date.parse(recoveryReviewedAt)&&time<Date.parse(recoveryExpiresAt);
  const sources=entry.sourceIds.map(id=>({id,...recoverySourceRecords[id],reviewedAt:recoveryReviewedAt,expiresAt:recoveryExpiresAt,current}));
  return {kind,title:entry.title,draft:current?entry.draft:'',checklist:current?[...entry.checklist]:[],sources,sourceIds:[...entry.sourceIds],current,reviewedAt:recoveryReviewedAt,expiresAt:recoveryExpiresAt,
    limitations:[...(current?[]:['This preparation guide needs a fresh source review. Open the official sources and verify the current route before using generated wording.']),...entry.limitations]};
}
