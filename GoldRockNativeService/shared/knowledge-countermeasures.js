// Narrow, source-linked countermeasures. Each route requires the member to confirm its applicability.
export const countermeasureSources = [
  {
    id:'irs-fap-collection-application',
    title:'Billing and collections under section 501(r)(6)',
    publisher:'IRS',
    url:'https://www.irs.gov/charities-non-profits/billing-and-collections-section-501r6',
    applicability:'Tax-exempt hospital facility, care covered by its FAP, and a complete application within the applicable application period; ordinary collection contact and court response dates need separate review.',
    summary:'A qualifying complete application requires suspension of extraordinary collection actions while eligibility is determined; an eligible person may be owed account correction, an excess-payment refund, and reasonably available reversal of an ECA.'
  },
  {
    id:'cms-no-surprises-complaint',
    title:'Submit a No Surprises Act complaint',
    publisher:'CMS',
    url:'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/submit-complaint',
    applicability:'Potential violation of federal surprise-billing protections; coverage, care setting, service and any valid notice and consent must be checked first.',
    summary:'The No Surprises Help Desk accepts a question or complaint with relevant bill, insurance and notice records and provides a confirmation number for follow-up.'
  },
  {
    id:'medicare-abn-protections',
    title:'Original Medicare Advance Beneficiary Notice choices',
    publisher:'Medicare.gov',
    url:'https://www.medicare.gov/basics/your-medicare-rights/your-protections',
    applicability:'Original Medicare ABN for specified items or services; not a general rule for Medicare Advantage or a final Medicare coverage decision.',
    summary:'ABN options determine whether the beneficiary requests the service and whether a claim is submitted; an appeal follows an actual denial on a submitted claim.'
  },
  {
    id:'cms-other-insurance-reporting',
    title:'Report other health insurance for Medicare coordination',
    publisher:'CMS',
    url:'https://www.cms.gov/medicare/coordination-benefits-recovery/beneficiary-services/reporting-other-health-insurance',
    applicability:'Medicare beneficiary with other health coverage; primary-payer order depends on the coverage arrangement and service dates.',
    summary:'The Benefits Coordination & Recovery Center maintains other-insurance information in the Medicare record to support correct payment order.'
  },
  {
    id:'cms-benefit-coordination',
    title:'Medicare coordination of benefits',
    publisher:'CMS',
    url:'https://www.cms.gov/medicare/coordination-benefits-recovery/overview/coordination-benefits',
    applicability:'Medicare with other health or drug coverage; a crossover to a secondary insurer may depend on an agreement, and claims processing remains with the appropriate payer or contractor.',
    summary:'Primary and secondary payment responsibilities must be established; secondary claim crossover is not automatic in every arrangement.'
  },
  {
    id:'medicaid-retroactive-eligibility',
    title:'Medicaid eligibility policy and effective date of coverage',
    publisher:'Medicaid.gov',
    url:'https://www.medicaid.gov/medicaid/eligibility-policy',
    applicability:'Medicaid applicant with care before the application month; the state must determine eligibility for the earlier month and whether retroactive benefits apply to that care.',
    summary:'Medicaid benefits may cover up to three months before the application month when the person would have been eligible then; approval and service coverage require state confirmation.',
    reviewedAt:'2026-09-28T00:00:00.000Z'
  },
  {
    id:'hhs-hipaa-billing-record-access',
    title:'Your medical and billing records under HIPAA',
    publisher:'HHS Office for Civil Rights',
    url:'https://www.hhs.gov/hipaa/for-individuals/medical-records/index.html',
    applicability:'Records held by a HIPAA-covered provider or health plan; access is to existing information in the designated record set, subject to limited exceptions.',
    summary:'A person may request existing medical and billing records even when a bill is unpaid; the right to access records does not require a provider or plan to create a new analysis.',
    reviewedAt:'2026-09-28T00:00:00.000Z'
  },
  {
    id:'cfpb-collector-stop-contact',
    title:'How to ask a debt collector to stop contacting you',
    publisher:'CFPB',
    url:'https://www.consumerfinance.gov/ask-cfpb/how-do-i-get-a-debt-collector-to-stop-contacting-me-en-1411/',
    applicability:'FDCPA-covered debt collector; a stop-contact request is separate from a timely written dispute, debt validity and any lawsuit.',
    summary:'A written stop-contact request limits later collector communications, with narrow exceptions, but does not cancel a debt or bar other lawful collection action.',
    reviewedAt:'2026-09-28T00:00:00.000Z'
  }
];

export const countermeasureConcepts = [
  {
    id:'hospital-assistance-during-collections',category:'collections',kind:'procedure',
    title:'Ask the hospital to review assistance during collections',
    question:'The hospital sent my bill to collections while I applied for financial assistance. What should I ask for?',
    summary:'For a tax-exempt hospital and a qualifying complete application, ask the hospital to confirm the application period, suspend extraordinary collection actions, and issue a written assistance decision.',
    mechanism:'Section 501(r)(6) ties a covered hospital’s extraordinary collection actions to reasonable efforts to determine eligibility under its own financial assistance policy.',
    actions:[
      'Identify the hospital facility, the care and the first post-discharge statement; ask for its financial assistance and billing-and-collections policies.',
      'Send the requested application information through the hospital’s confirmed channel and keep proof of when the application became complete.',
      'If the complete application is within the applicable period, ask the hospital to confirm suspension of any extraordinary collection action for that care while it decides eligibility, including actions by its collector.',
      'If assistance is granted, request the written amount owed, any excess-payment refund and correction or reasonably available reversal of an extraordinary collection action.'
    ],
    verify:[
      'Is this a tax-exempt hospital facility and care covered by its policy, rather than a separately billing clinician?',
      'What is the date of the first post-discharge statement, and is the application period still open?',
      'Is the application complete under the published policy, and what specific collection action is occurring?'
    ],
    avoid:[
      'Do not assume that submitting an incomplete application stops every collection contact or court deadline.',
      'Do not promise cancellation of the entire balance; the written eligibility decision controls the adjusted amount.'
    ],
    evidence:['Hospital policy and first post-discharge statement','Application, missing-item notices and completion receipt','Collector or court notices','Written assistance decision and revised account'],
    completion:['Written eligibility decision, corrected balance and any required refund or ECA correction are separately confirmed.'],
    sourceIds:['irs-fap-collection-application','irs-financial-assistance'],
    coverage:['private','medicare','medicaid','uninsured','self_pay','unknown'],
    documentTypes:['bill','unknown'],goals:['check','afford','appeal','plan'],
    tags:['charity care','financial assistance','collections','501r','application period','hospital','refund','ECA'],
    handoffRefs:[{artifact:'source-linked-countermeasures-2026-09-27',lines:[5,9]}]
  },
  {
    id:'surprise-bill-complaint',category:'coverage',kind:'procedure',
    title:'Escalate a possible surprise-billing violation',
    question:'The out-of-network bill still looks wrong after I asked the provider and plan. Where can I report it?',
    summary:'When federal surprise-billing protections may apply, organize the bill, EOB and any notice and consent, then submit a question or complaint to the No Surprises Help Desk.',
    mechanism:'CMS can review a possible provider, facility or insurer compliance problem and refer it to the appropriate authority; a complaint is distinct from an insurance appeal or a self-pay estimate dispute.',
    actions:[
      'Confirm the plan, care setting, service and any notice-and-consent exception before describing the suspected violation.',
      'Match the provider bill to the EOB and keep the relevant insurance card, notice, consent form and correspondence.',
      'Use the CMS No Surprises Help Desk complaint route; retain the confirmation number and record any request for more information.',
      'Continue to track any separate plan appeal, provider correction or court response on its own timeline.'
    ],
    verify:['Is the coverage and service within the federal protection or a state route?','Does the EOB concern the same provider, service and date?','Was a notice and consent form used, and could that exception apply to this service?'],
    avoid:['Do not treat the provider-versus-plan federal IDR process as a patient appeal.','Do not assume filing a complaint by itself changes a bill or pauses another deadline.'],
    evidence:['Provider bill','EOB and insurance card','Any signed notice and consent','Provider and plan correspondence','CMS complaint confirmation'],
    completion:['CMS confirmation and subsequent response are tracked; any corrected bill or claim is verified separately.'],
    sourceIds:['cms-no-surprises-complaint','cms-no-surprises','knowledge-cms-notice-consent'],
    coverage:['private','unknown'],documentTypes:['bill','eob','denial','unknown'],goals:['check','understand','appeal','afford'],
    tags:['No Surprises Act','surprise bill','out of network','complaint','balance bill','help desk','consent'],
    handoffRefs:[{artifact:'source-linked-countermeasures-2026-09-27',lines:[11,15]}]
  },
  {
    id:'original-medicare-abn-choice',category:'coverage',kind:'plan-specific',
    title:'Read an Original Medicare ABN before accepting a charge',
    question:'I signed an Advance Beneficiary Notice. Does that mean Medicare denied the claim?',
    summary:'An ABN is an advance warning, not a Medicare denial. Compare its listed service, reason, cost estimate and selected option with any later claim decision.',
    mechanism:'Under Original Medicare, ABN option 1 asks for the service and a Medicare claim, preserving an appeal after a denial; option 2 asks for the service without a claim, so there is no Medicare appeal of that claim.',
    actions:[
      'Obtain the actual ABN and identify the specified service, expected cost, reason and option selected before care.',
      'If option 1 was selected, ask for the Medicare claim and compare the resulting Medicare Summary Notice with the provider bill.',
      'If a submitted claim is denied, use the decision notice to check the appropriate Medicare appeal route and date.'
    ],
    verify:['Original Medicare rather than a Medicare Advantage plan?','Which service and date does the ABN actually cover?','Which option was chosen, and was a claim submitted and decided?'],
    avoid:['Do not call the ABN itself a denial or promise that signing it always makes the patient liable.','Do not promise an appeal when option 2 requested that no claim be submitted.'],
    evidence:['Signed ABN and selected option','Provider bill','Medicare Summary Notice or claim decision'],
    completion:['The ABN choice and actual claim status are documented; any appeal follows the issued decision rather than the ABN alone.'],
    sourceIds:['medicare-abn-protections','medicare-appeals'],
    coverage:['medicare'],documentTypes:['bill','eob','denial','unknown'],goals:['understand','check','appeal','plan'],
    tags:['ABN','Advance Beneficiary Notice','Original Medicare','noncoverage','option 1','option 2','claim','appeal'],
    handoffRefs:[{artifact:'source-linked-countermeasures-2026-09-27',lines:[17,21]}]
  },
  {
    id:'medicare-other-payer-order',category:'coverage',kind:'plan-specific',
    title:'Resolve a Medicare claim held for other insurance',
    question:'Medicare says another insurer should pay first. What record should I check?',
    summary:'Confirm the other coverage and service dates before accepting a patient balance; an incorrect primary-payer record can send the claim down the wrong payment path.',
    mechanism:'Medicare coordination rules identify the primary payer. CMS maintains other-insurance information, while the appropriate payer or contractor processes the claim; secondary crossover is not assured in every arrangement.',
    actions:[
      'Compare the denial or claim notice with your actual coverage for the service date, including any employer, retiree, liability or workers’ compensation coverage.',
      'Ask the Benefits Coordination & Recovery Center or Medicare to verify the other-insurance record and primary-payer order for that date.',
      'Ask the biller which payer received the claim first, whether a corrected or secondary claim is needed, and how to confirm the final patient amount.'
    ],
    verify:['Was Medicare active for the service period?','What other coverage applied on that date, and what kind was it?','Which payer processed a claim and which has not?'],
    avoid:['Do not assume Medicare always pays first or that a second plan automatically receives a crossover claim.','Do not treat a primary-payer denial as proof that the full billed charge is owed.'],
    evidence:['Medicare claim notice','Other coverage cards and effective dates','Primary payer EOB, if any','Provider claim-submission record'],
    completion:['Payer order and claim routing are confirmed in writing or a documented call, followed by a processed claim and reconciled patient balance.'],
    sourceIds:['cms-other-insurance-reporting','cms-benefit-coordination'],
    coverage:['medicare'],documentTypes:['bill','eob','denial','unknown'],goals:['understand','check','appeal'],
    tags:['coordination of benefits','primary payer','secondary payer','Medicare','other insurance','BCRC','crossover'],
    handoffRefs:[{artifact:'source-linked-countermeasures-2026-09-27',lines:[23,27]}]
  },
  {
    id:'medicaid-care-before-application',category:'coverage',kind:'program-specific',
    title:'Ask Medicaid about care before your application',
    question:'I received a bill for care shortly before I applied for Medicaid. Can the state review that month?',
    summary:'Ask the state to determine whether retroactive Medicaid coverage applies to the service month before treating the old bill as a final patient balance.',
    mechanism:'Medicaid may cover benefits for up to three months before the application month if the person would have been eligible then; the state must decide eligibility and service coverage.',
    actions:[
      'Write down the application month, each service date, the provider and the coverage decision you already received.',
      'Ask the state Medicaid agency how to request an eligibility determination for the earlier month and what evidence it needs for that month.',
      'If the state confirms coverage for the service period, ask the provider how it will submit or correct the claim, then compare the processed claim with the bill.'
    ],
    verify:['Was a Medicaid application submitted, and in which month?','Would the person have met the applicable eligibility rules during the earlier service month?','Does the state confirm retroactive coverage and that this service is covered?'],
    avoid:['Do not assume every bill in the preceding three months is covered or that the state will approve eligibility.','Do not promise that an application or pending determination alone pauses collections or a court deadline.'],
    evidence:['Application acknowledgement and date','Service dates and provider bills','Earlier-month eligibility evidence requested by the state','State coverage decision and processed claim'],
    completion:['The state’s written effective date and the provider’s processed claim are compared with the remaining patient balance.'],
    sourceIds:['medicaid-retroactive-eligibility','medicaid-appeals'],
    coverage:['medicaid','uninsured','unknown'],documentTypes:['bill','unknown'],goals:['understand','check','afford','plan'],
    tags:['Medicaid','retroactive coverage','before application','eligibility month','backdated coverage','old bill'],
    reviewedAt:'2026-09-28T00:00:00.000Z',handoffRefs:[{artifact:'native-countermeasures-2026-09-28',lines:[5,9]}]
  },
  {
    id:'hipaa-existing-billing-records',category:'bill',kind:'procedure',
    title:'Get the existing records behind a disputed charge',
    question:'The provider or plan says I must pay before they will show me my billing records. What can I request?',
    summary:'Request the existing medical, billing or claims records held by a HIPAA-covered provider or plan; an unpaid bill alone is not a reason to withhold a copy.',
    mechanism:'The HIPAA access right reaches information about the person in covered entities’ designated record sets, including billing and payment records, with limited exceptions.',
    actions:[
      'Identify which provider or health plan maintains the record you need, such as the account ledger, payment entries or claim decision data.',
      'Submit an access request through the covered entity’s stated process, describing the existing records and service period; keep the request and receipt.',
      'Compare the records you receive with the charge. If an existing record is inaccurate, use the separate amendment process rather than assuming access itself corrects the bill.'
    ],
    verify:['Is the recipient a HIPAA-covered provider or health plan?','Are you requesting existing records about yourself, rather than a new explanation or analysis?','What response, access limitation or copying charge did the entity actually state?'],
    avoid:['Do not claim HIPAA requires a new itemized bill, coding analysis or automatic balance adjustment.','Do not send private records to an unrelated party merely to prove you requested access.'],
    evidence:['Access request and delivery record','Provider ledger or plan claim record received','Bill and EOB being checked','Any written denial or amendment response'],
    completion:['The requested existing records or a written access response are retained and compared with the disputed charge.'],
    sourceIds:['hhs-hipaa-billing-record-access'],
    coverage:['private','medicare','medicaid','uninsured','self_pay','unknown'],documentTypes:['bill','eob','denial','unknown'],goals:['understand','check','appeal'],
    tags:['HIPAA','billing records','medical records','claim records','right of access','unpaid bill','ledger'],
    reviewedAt:'2026-09-28T00:00:00.000Z',handoffRefs:[{artifact:'native-countermeasures-2026-09-28',lines:[11,15]}]
  },
  {
    id:'collector-stop-contact-versus-dispute',category:'collections',kind:'procedure',
    title:'Separate a stop-contact request from a debt dispute',
    question:'Can I stop a medical debt collector’s calls while I check whether the amount is right?',
    summary:'A written stop-contact request can limit an FDCPA-covered collector’s communications, while a timely written debt dispute serves a different purpose and should be considered first when accuracy is in question.',
    mechanism:'CFPB explains that a collector generally must stop contacting you after receiving a written request, subject to narrow notices about no further contact or lawful action. The debt and possible legal collection remain separate.',
    actions:[
      'Identify the collector and read the validation notice, including its dispute date and itemized balance.',
      'If the debt or amount is wrong, consider a written dispute promptly and keep proof of delivery before choosing to stop contact.',
      'If you want contact to stop, send a separate written request through the collector’s stated address or accepted electronic channel; keep a copy and receipt.',
      'Watch for court papers or other lawful action and respond on their own required timeline.'
    ],
    verify:['Is this an FDCPA-covered collector rather than the original provider or a court?','Was a validation notice received, and is its dispute period still open?','Did the collector receive the written stop-contact request?'],
    avoid:['Do not treat silence as proof that the debt was canceled or verified.','Do not assume the request bars a lawsuit, credit reporting or court response date.'],
    evidence:['Collector identity and validation notice','Dispute letter, if sent','Stop-contact request and delivery proof','Any later legal notice'],
    completion:['The communication request and any debt dispute are recorded separately; later notices and court dates remain visible.'],
    sourceIds:['cfpb-collector-stop-contact','cfpb-debt-validation'],
    coverage:['private','medicare','medicaid','uninsured','self_pay','unknown'],documentTypes:['bill','unknown'],goals:['understand','check','afford','appeal'],
    tags:['collector calls','stop contact','cease communication','debt dispute','validation notice','FDCPA'],
    reviewedAt:'2026-09-28T00:00:00.000Z',handoffRefs:[{artifact:'native-countermeasures-2026-09-28',lines:[17,21]}]
  }
];
