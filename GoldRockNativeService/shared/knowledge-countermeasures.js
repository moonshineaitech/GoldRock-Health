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
  }
];
