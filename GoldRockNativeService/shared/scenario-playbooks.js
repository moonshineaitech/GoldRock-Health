/** Original GoldRock scenario intents, rewritten as sourced evidence and response journeys. */
export const scenarioSources = [
  { id: 'scenario-medicare-cpap', title: 'Medicare CPAP therapy and rental payments', publisher: 'Medicare.gov', url: 'https://www.medicare.gov/coverage/continuous-positive-airway-pressure-devices', applicability: 'Original Medicare Part B CPAP conditions; continuous paid rental months and supplier participation must be verified. Not every DME item or plan.', summary: 'CPAP ownership follows thirteen continuous months of Medicare rental payments under the described conditions; supplies and coverage requirements remain separate.' },
  { id: 'scenario-medicare-oxygen', title: 'Medicare oxygen equipment and accessories', publisher: 'Medicare.gov', url: 'https://www.medicare.gov/coverage/oxygen-equipment-accessories', applicability: 'Original Medicare oxygen equipment; its rental and service arrangement differs from CPAP.', summary: 'Oxygen equipment has a thirty-six-month rental payment period and continuing supplier obligations subject to the stated conditions; do not apply CPAP ownership rules.' },
  { id: 'scenario-cfpb-deceased-debt', title: 'Debt after a person dies', publisher: 'CFPB', url: 'https://www.consumerfinance.gov/ask-cfpb/does-a-persons-debt-go-away-when-they-die-en-1463/', applicability: 'Survivors and estate representatives; shared obligations, state law, and the actual agreement can change responsibility.', summary: 'Family relationship alone does not establish personal liability. Determine the estate role and any applicable exception.' },
  { id: 'scenario-cfpb-estate-contact', title: 'When debt collectors contact survivors', publisher: 'CFPB', url: 'https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/financial-security-as-you-age/when-a-loved-one-dies-and-debt-collectors-come-calling/', applicability: 'Contact and validation questions depend on whether the recipient is a spouse, representative, parent of a deceased minor, or another person.', summary: 'Estate administration is distinct from paying with personal funds; get written information and obtain legal help for disputed responsibility.' },
  { id: 'scenario-cfpb-caregiver', title: 'Caregivers and nursing-home debt', publisher: 'CFPB', url: 'https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/know-your-rights-caregivers-and-nursing-home-debt/', applicability: 'Nursing-home admission and collection disputes involving a caregiver; examine the complete contract and any court notice.', summary: 'Examine responsible-party clauses and alleged personal guarantees. Legal aid, an ombudsman, or a State Survey Agency may be appropriate contacts.' },
  { id: 'scenario-ecfr-nursing-guarantee', title: '42 CFR 483.15(a)(3): nursing-home admission guarantees', publisher: 'eCFR / CMS', url: 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-483/subpart-B/section-483.15', applicability: 'Medicare/Medicaid-participating facilities, including residents not personally enrolled in those programs. State-law claims and alleged misuse of resources require separate review.', summary: 'Covered facilities cannot make a third-party personal guarantee an admission or continued-stay condition. A representative with legal access to resident funds may agree to pay from those funds without personal financial liability.', reviewMethod: 'Current eCFR text read; displayed Title 42 current through September 24, 2026. Uses the regulation, not the withdrawn CFPB 2022-05 circular.' },
  { id: 'scenario-hhs-record-access', title: 'Access to medical and billing records', publisher: 'HHS', url: 'https://www.hhs.gov/hipaa/for-individuals/medical-records/index.html', applicability: 'Records held by covered providers or plans, subject to access exceptions and the Ciox court-order qualification described on the page.', summary: 'Request relevant medical and billing records through the holder’s access process. Unpaid care does not alone permit withholding copies; do not assume all notes or requested records are included.' },
].map(scenarioSource => ({ ...scenarioSource, reviewedAt: '2026-09-27T00:00:00.000Z', expiresAt: '2026-12-27T00:00:00.000Z' }));

const scenarioSourceGroups = {
  bill: ['cms-read-medical-bill', 'insurance-cms-eob'],
  coding: ['cms-read-medical-bill', 'knowledge-cms-repeat-services'],
  records: ['cms-read-medical-bill', 'scenario-hhs-record-access'],
  appeal: ['healthcare-appeals', 'insurance-dol-claim-file'],
  emergency: ['cms-read-medical-bill', 'cms-no-surprises'],
  public: ['medicare-appeals', 'medicaid-appeals'],
  coverage: ['insurance-dol-claim-file', 'insurance-wa-jurisdiction', 'cfpb-assistance-steps'],
  network: ['cms-no-surprises', 'knowledge-cms-notice-consent', 'insurance-cms-directory'],
  legal: ['cfpb-debt-legal-process', 'cfpb-collection-contact'],
  dme: ['scenario-medicare-cpap', 'scenario-medicare-oxygen', 'cms-read-medical-bill'],
  deceased: ['scenario-cfpb-deceased-debt', 'scenario-cfpb-estate-contact', 'cfpb-debt-legal-process'],
  nursing: ['scenario-cfpb-caregiver', 'scenario-ecfr-nursing-guarantee', 'cfpb-debt-legal-process'],
};
const scenarioAllCoverage = ['private', 'medicare', 'medicaid', 'uninsured', 'self_pay', 'unknown'];

function scenarioBuildRoute(seed) {
  const topic = scenarioTopicData[seed.topic];
  const collection = seed.stage === 'collections';
  const sources = [...new Set([...scenarioSourceGroups[topic.group], ...(collection ? ['cfpb-collection-scope', 'cfpb-validation-disputes', 'cfpb-paid-wrong-debt'] : [])])];
  const receiptQuestion = collection ? 'Please provide the written validation information and identify the original creditor and the amount being collected.' : 'Please provide the itemized statement and matching payment, credit, and adjustment history.';
  const question = topic.checks[0];
  const route = {
    id: seed.id, title: topic.title + (collection ? ' in collections' : ''), category: collection ? 'collections' : 'bill',
    summary: topic.mechanism,
    pattern: collection ? `A collection demand overlaps an unresolved ${topic.title.toLowerCase()} question.` : `You need to understand or question ${topic.title.toLowerCase()}.`,
    appliesWhen: `Choose this scenario only if it describes your situation. ${collection ? 'Confirm who is collecting and whether a validation or court notice exists.' : 'Match the person, biller, and service before comparing documents.'} Sources support the stated evidence and review process; they do not decide specialty coding, clinical necessity, plan eligibility, or liability.`,
    verify: [...topic.checks, collection ? 'Who is collecting, what does the notice say, and is there a separate court deadline?' : 'Which document version is current, and what actual response notice or due date exists?'],
    evidence: [...topic.evidence, ...(collection ? ['Collector notice and proof of delivery for any response'] : [])],
    counterQuestions: [{ statementToCheck: topic.claim, response: topic.counter, evidence: [...topic.evidence] }],
    firstMove: {
      title: collection ? 'Separate the collector response from the underlying review' : 'Ask one precise question with the right records',
      steps: collection ? [
        'Verify the collector and follow the actual validation notice instructions; keep any court response on its own track.',
        `Ask the provider or plan: ${question}`,
        `Gather: ${topic.evidence.join('; ')}. Send only relevant copies through a verified channel, retaining originals.`,
        'Ask whether any requested account hold was accepted, its scope, and its end date; do not assume one exists.',
      ] : [
        `Gather: ${topic.evidence.join('; ')}. Keep original documents outside this app.`,
        `Ask: ${question}`,
        `Then clarify: ${topic.checks[1]}`,
        'Record the response owner, reference, and promised follow-up date; keep formal notice deadlines separate.',
      ],
      draft: `${receiptQuestion} I am reviewing [specific service or line]. ${question} ${topic.counter} Please explain the review process and when I should expect a written response.`,
    },
    responses: {
      no_reply: {
        title: 'Follow up on the unresolved evidence request',
        steps: [`Confirm receipt of the request about ${topic.title.toLowerCase()}.`, `Identify what is still missing from: ${topic.evidence.join('; ')}.`, 'Ask the appropriate supervisor for a response owner and date. A follow-up is not a substitute for a formal appeal, dispute, or court response.'],
        draft: `I requested a review of [specific line or decision] on [date] and have not received the explanation. ${question} Please confirm receipt, identify who owns the review, and give me a response date. Any formal filing requirement remains separate.`,
      },
      more_info: {
        title: 'Answer the specific missing-information request',
        steps: [`Ask which missing record would resolve: ${topic.checks[1]}`, 'Check that the recipient and submission channel are authentic before sharing private documents.', 'Provide the relevant copy, keep the original and delivery receipt, and ask whether the submission is complete.'],
        draft: `Please identify the exact information missing from my request and how it relates to the decision. ${topic.checks[1]} I can provide the relevant record through your verified channel. Please confirm what you received and what remains outstanding.`,
      },
      denied: {
        title: 'Get the reason and choose the correct next review',
        steps: [`Request the written rationale and record or policy supporting the answer to: ${topic.checks[2]}`, `Address the stated reason with: ${topic.evidence.join('; ')}.`, collection ? 'Keep the provider/plan review distinct from the collector dispute. Obtain legal help for a summons or disputed personal liability.' : 'Confirm whether the next step is a provider correction, plan appeal, assistance review, or a complaint; use that notice’s actual instructions.'],
        draft: `Please send the reason for declining my request and the specific record or policy you relied on. ${topic.counter} What is the next review process, filing channel, and applicable deadline? I am requesting an explanation, not treating this message as a completed formal filing.`,
      },
    },
    watchouts: [
      'This scenario is a preparation path, not a finding of error, fraud, eligibility, or a guaranteed reduction.',
      'Do not infer a filing deadline, collection pause, or payment obligation from a template. Check the actual notice and applicable procedure.',
      'Specialty coding and clinical judgments belong with qualified reviewers; high prices or repeated codes alone do not establish misconduct.',
    ],
    sourceIds: sources, sourceCoverage: 'general-evidence-and-review-process',
    recommendationMode: 'manual-only', taskIds: [...topic.taskIds], original: { ...seed.original },
    triggers: { documentTypes: ['bill', 'eob', 'denial'], goals: ['understand', 'check', 'afford', 'appeal', 'plan'], coverage: [...scenarioAllCoverage] },
  };
  if (topic.group === 'dme') {
    route.watchouts.push('Original Medicare CPAP ownership follows 13 continuous paid rental months under its stated conditions. Oxygen uses a different 36-month rental arrangement; do not extend either rule to another item or plan.');
    route.sourceCoverage = 'general-process-plus-original-medicare-equipment-distinction';
  }
  if (seed.topic === 'nursing') {
    route.watchouts.push('At a Medicare/Medicaid-participating facility, a third-party personal guarantee cannot be required for admission or continued stay. Payment from resident resources is different; other state-law or conduct allegations need legal review.');
    route.sourceCoverage = 'general-process-plus-qualified-third-party-guarantee-rule';
  }
  if (seed.topic === 'deceased' || seed.topic === 'hospice') route.watchouts.push('Estate representation alone does not make every debt personally yours. Shared obligations and state-law exceptions require case-specific review; do not ignore court papers.');
  return route;
}

const scenarioTopicData = {
  "birth": {
    "title": "Childbirth and newborn bills",
    "mechanism": "Keep the parent's and newborn's charges separate, then check the delivery, nursery, and clinician records.",
    "checks": [
      "Which person's account contains each charge?",
      "What is included in the billed obstetric package?",
      "Which record supports nursery, lactation, or assistant-clinician entries?"
    ],
    "evidence": [
      "Separate parent and newborn bills",
      "Delivery and newborn record references",
      "Matching EOBs"
    ],
    "claim": "Everything from the birth is one bill",
    "counter": "Please identify each patient, biller, and service and explain what the package includes.",
    "taskIds": [
      "surgery-bill-analysis",
      "multi-bill-portfolio-manager"
    ],
    "group": "bill"
  },
  "er": {
    "title": "Emergency-room bills",
    "mechanism": "Separate facility, emergency-clinician, imaging, and laboratory statements before comparing charges.",
    "checks": [
      "Which entity billed the facility and professional components?",
      "What supports the service level and any observation hours?",
      "What coverage and network rules were used for this emergency claim?"
    ],
    "evidence": [
      "ER itemization",
      "Service-level and observation record references",
      "EOB and separate provider statements"
    ],
    "claim": "Waiting a long time proves the visit was low-level",
    "counter": "Please explain the documented factors behind this service level; I am not assuming that waiting time determines the code.",
    "taskIds": [
      "emergency-room-dispute"
    ],
    "group": "emergency"
  },
  "surgery": {
    "title": "Surgery bills",
    "mechanism": "Compare the surgical bill with operative, anesthesia, and implant records, one billing entity at a time.",
    "checks": [
      "Which record supports the billed OR and anesthesia times?",
      "Who billed as surgeon, assistant, or co-surgeon?",
      "Which devices and follow-up services were included or separate?"
    ],
    "evidence": [
      "Operative and anesthesia record references",
      "Itemized time, units, and implant lines",
      "Facility and clinician EOBs"
    ],
    "claim": "Every extra surgical line must be a duplicate",
    "counter": "Please explain the role, time, component, or applicable billing rule for each questioned line.",
    "taskIds": [
      "surgery-bill-analysis",
      "bundling-error-detector"
    ],
    "group": "records"
  },
  "imaging": {
    "title": "Imaging bills",
    "mechanism": "Check scan, contrast, interpretation, and technical components before comparing bills.",
    "checks": [
      "Are the technical and reading components billed by different entities?",
      "Were with/without contrast or repeat studies combined or separately coded?",
      "Which authorization and network facts were used?"
    ],
    "evidence": [
      "Imaging order and report references",
      "Codes and modifiers",
      "Facility and radiologist EOBs"
    ],
    "claim": "Two imaging bills always mean double billing",
    "counter": "Please identify the component on each bill and show whether the same service was charged twice.",
    "taskIds": [
      "radiology-billing-challenge",
      "diagnostic-overcharges"
    ],
    "group": "bill"
  },
  "stay": {
    "title": "Hospital stays",
    "mechanism": "Reconstruct room dates and admission status before questioning a large stay balance.",
    "checks": [
      "What inpatient or observation status was recorded and when?",
      "Do unit transfers match the billed room days?",
      "Which clinicians and therapies are billed separately?"
    ],
    "evidence": [
      "Admission or observation notices",
      "Room-transfer and service record references",
      "Daily charges and EOB"
    ],
    "claim": "An overnight stay automatically means inpatient coverage",
    "counter": "Please provide the status notice and explain how that status affected this claim.",
    "taskIds": [
      "room-rate-challenges"
    ],
    "group": "bill"
  },
  "lab": {
    "title": "Laboratory bills",
    "mechanism": "Compare ordered tests, panels, dates, and outside-lab components.",
    "checks": [
      "Which tests were ordered and performed?",
      "Does a panel overlap a separately listed component?",
      "Was a repeat sample or reference laboratory involved?"
    ],
    "evidence": [
      "Order and result references",
      "Panel and component codes",
      "Lab bill and EOB"
    ],
    "claim": "Repeated test codes prove an error",
    "counter": "Please explain the dates, repeat services, panel relationship, and modifiers before deciding whether a correction is needed.",
    "taskIds": [
      "laboratory-disputes",
      "diagnostic-overcharges"
    ],
    "group": "coding"
  },
  "anesthesia": {
    "title": "Anesthesia bills",
    "mechanism": "Ask for the components of the anesthesia calculation and supporting time record.",
    "checks": [
      "What base, time, and modifier units were used?",
      "How were start and stop times defined?",
      "Which clinicians billed and how did the plan process them?"
    ],
    "evidence": [
      "Anesthesia record reference",
      "Unit and conversion-factor calculation",
      "Anesthesia EOB"
    ],
    "claim": "Anesthesia time must exactly equal surgery time",
    "counter": "Please explain the covered anesthesia time and each unit component rather than compare only incision time.",
    "taskIds": [
      "surgery-bill-analysis"
    ],
    "group": "records"
  },
  "specialist": {
    "title": "Specialist bills",
    "mechanism": "Separate consultation, procedures, and facility fees, then ask what supports the billed level.",
    "checks": [
      "Was this a new or established-patient service?",
      "Was a procedure or facility component billed separately?",
      "What documented factors support the service level?"
    ],
    "evidence": [
      "Visit record reference",
      "Code and modifier lines",
      "EOB and facility statement"
    ],
    "claim": "A short visit proves the code is wrong",
    "counter": "Please explain the code using the documented service and applicable billing criteria.",
    "taskIds": [
      "specialist-consultation-review",
      "upcoding-detector"
    ],
    "group": "coding"
  },
  "therapy": {
    "title": "Therapy and rehabilitation bills",
    "mechanism": "Review sessions and timed units alongside benefit limits and authorization decisions.",
    "checks": [
      "Which dates and units were billed?",
      "Which services were individual, group, or otherwise timed?",
      "Is the problem a charge discrepancy or a coverage/visit-limit decision?"
    ],
    "evidence": [
      "Session and time references",
      "Itemized units",
      "Authorization and EOB"
    ],
    "claim": "All therapy after surgery is included in the surgeon's fee",
    "counter": "Please identify the applicable coverage or billing rule for these particular therapy services.",
    "taskIds": [
      "physical-therapy-review"
    ],
    "group": "bill"
  },
  "mental": {
    "title": "Mental-health treatment bills",
    "mechanism": "Distinguish session-charge questions from a plan's clinical or benefit-limit decision.",
    "checks": [
      "Which session length and setting were billed?",
      "What plan provision and clinical criterion support the denial?",
      "What appeal route applies and should the treating team raise a parity question?"
    ],
    "evidence": [
      "Session billing record",
      "Denial and cited criteria",
      "Plan and treating-team references"
    ],
    "claim": "A prescribed service is automatically covered",
    "counter": "Please explain the coverage criterion separately from the treating clinician's recommendation.",
    "taskIds": [
      "mental-health-billing",
      "medical-necessity-builder"
    ],
    "group": "appeal"
  },
  "ambulance": {
    "title": "Ambulance bills",
    "mechanism": "Verify transport type, mileage, service level, and the applicable coverage route.",
    "checks": [
      "Was this ground, air, or non-emergency transport?",
      "What trip record supports the mileage and service level?",
      "Which coverage and state or federal protection was considered?"
    ],
    "evidence": [
      "Transport or run-report reference",
      "Mileage and service-level lines",
      "EOB or denial"
    ],
    "claim": "Ground and air ambulances have identical federal protections",
    "counter": "Please identify the transport type and the rule you applied to this bill.",
    "taskIds": [
      "ambulance-negotiations"
    ],
    "group": "emergency"
  },
  "dental": {
    "title": "Dental and oral-surgery bills",
    "mechanism": "Separate dental, medical, anesthesia, and facility claims and any financing agreement.",
    "checks": [
      "Which plan processed each part of care?",
      "Is the issue an exclusion, annual limit, coding issue, or missing claim?",
      "Do package and financing terms match the statement?"
    ],
    "evidence": [
      "Dental and medical EOBs",
      "Procedure and facility itemization",
      "Quote or financing agreement"
    ],
    "claim": "Medical necessity automatically makes dental insurance pay",
    "counter": "Please identify the applicable benefit and reason for the decision before we choose an appeal route.",
    "taskIds": [
      "dental-oral-surgery"
    ],
    "group": "bill"
  },
  "dme": {
    "title": "Equipment rental and ownership",
    "mechanism": "Check the exact equipment and payer rule before assuming that rental payments transfer ownership.",
    "checks": [
      "What item and rental category is billed?",
      "Which months did the payer actually pay and were they continuous?",
      "Does the new charge cover rental, supplies, maintenance, or something else?"
    ],
    "evidence": [
      "Rental agreement and equipment identity",
      "Paid claim-month history",
      "Current bill and supplier response"
    ],
    "claim": "Every device becomes yours after thirteen months",
    "counter": "Please identify the equipment-specific rule. Original Medicare CPAP and oxygen follow different arrangements.",
    "taskIds": [
      "medical-device-billing"
    ],
    "group": "dme"
  },
  "medications": {
    "title": "Medication and pharmacy bills",
    "mechanism": "Separate drug units, administration, dispensing, and assistance questions.",
    "checks": [
      "What drug quantity and unit definition were billed?",
      "Which pharmacy or medical benefit processed it?",
      "What current assistance policy and insurance restrictions apply?"
    ],
    "evidence": [
      "Drug and administration line items",
      "Benefit explanation",
      "Program policy or assistance decision"
    ],
    "claim": "Manufacturer assistance always applies retroactively",
    "counter": "Please provide the program's current eligibility and date rules before I rely on assistance.",
    "taskIds": [
      "pharmacy-drug-overcharges",
      "hidden-revenue-stream-detector"
    ],
    "group": "bill"
  },
  "preventive": {
    "title": "Preventive-care billing",
    "mechanism": "Ask whether the documented service and current plan meet preventive-benefit conditions.",
    "checks": [
      "What service and diagnosis codes were submitted?",
      "Was a separate problem-focused service also performed?",
      "Which benefit criteria and network conditions did the plan apply?"
    ],
    "evidence": [
      "Visit purpose and service references",
      "Procedure and diagnosis codes",
      "EOB and plan benefit text"
    ],
    "claim": "Changing a code always makes the visit free",
    "counter": "Please review coding against the actual care and explain the plan's preventive-benefit decision.",
    "taskIds": [
      "medical-codes-guide",
      "insurance-appeal-mastery"
    ],
    "group": "appeal"
  },
  "urgent": {
    "title": "Urgent care or freestanding ER",
    "mechanism": "Verify the facility's actual classification and disclosures before comparing charges.",
    "checks": [
      "Was the location an urgent care or licensed emergency department?",
      "Which facility and clinician fees were disclosed?",
      "Did the insurer process it under the correct setting?"
    ],
    "evidence": [
      "Facility classification reference",
      "Estimate or disclosure",
      "Bill and EOB"
    ],
    "claim": "The sign alone determines the insurance benefit",
    "counter": "Please identify the licensed setting and explain the benefit and fees applied to it.",
    "taskIds": [
      "find-overcharges",
      "provider-network-leverage"
    ],
    "group": "bill"
  },
  "telehealth": {
    "title": "Telehealth bills",
    "mechanism": "Check the visit modality, location, codes, and applicable plan terms.",
    "checks": [
      "Was the visit audio, video, or another remote service?",
      "What time or service basis supports the code?",
      "What rule explains any separately billed facility component?"
    ],
    "evidence": [
      "Visit record reference",
      "Itemized codes and modifiers",
      "Telehealth benefit or EOB"
    ],
    "claim": "A remote visit must always cost less",
    "counter": "Please explain this plan's cost-sharing and the specific basis for the billed service.",
    "taskIds": [
      "specialist-consultation-review"
    ],
    "group": "bill"
  },
  "cancer": {
    "title": "Cancer-treatment bills",
    "mechanism": "Break a treatment course into billers, drug units, denials, and assistance requests.",
    "checks": [
      "Which treatment dates and drug units belong to each biller?",
      "What exact criterion supports any experimental or necessity denial?",
      "Which current assistance program covers the person, drug, and date?"
    ],
    "evidence": [
      "Treatment and drug-unit references",
      "Separate EOBs and denials",
      "Program application and response"
    ],
    "claim": "An experimental denial means there is no review route",
    "counter": "Please provide the policy criterion, review instructions, and records considered so my treating team can respond.",
    "taskIds": [
      "experimental-treatment-coverage",
      "medical-necessity-builder",
      "pharmacy-drug-overcharges"
    ],
    "group": "appeal"
  },
  "cardiac": {
    "title": "Cardiac-procedure bills",
    "mechanism": "Separate procedure, device, stay, and follow-up questions in a complex cardiac episode.",
    "checks": [
      "Which device and procedure are listed?",
      "Do admission status and room days match records?",
      "Which follow-up services were included or billed separately?"
    ],
    "evidence": [
      "Procedure and device references",
      "Stay notices",
      "Separate bills and EOBs"
    ],
    "claim": "A high device price alone proves fraud",
    "counter": "Please explain the device line and calculation; I am asking for a review rather than asserting misconduct.",
    "taskIds": [
      "surgery-bill-analysis",
      "medical-device-billing"
    ],
    "group": "bill"
  },
  "dialysis": {
    "title": "Dialysis bills",
    "mechanism": "Check enrollment dates, payer coordination, and recurring treatment charges.",
    "checks": [
      "Which coverage was active for each treatment date?",
      "What coordination decision did the payers make?",
      "Which services does the relevant payment arrangement include?"
    ],
    "evidence": [
      "Coverage-effective-date notices",
      "Payer coordination correspondence",
      "Recurring treatment bills"
    ],
    "claim": "The same payer always pays first for dialysis",
    "counter": "Please explain the coordination rule and dates for this specific coverage combination.",
    "taskIds": [
      "medicare-medicaid-review",
      "recurring-bill-audit-system"
    ],
    "group": "public"
  },
  "homehealth": {
    "title": "Home-health bills",
    "mechanism": "Compare the service, coverage decision, and any advance noncoverage notice.",
    "checks": [
      "Which services were billed as skilled or other care?",
      "What reason did the plan give for nonpayment?",
      "Was a relevant advance notice issued and what exactly did it cover?"
    ],
    "evidence": [
      "Care plan and visit references",
      "Coverage decision",
      "Any advance noncoverage notice"
    ],
    "claim": "No notice means every home-health charge disappears",
    "counter": "Please identify whether a notice was required for this specific service and the rule supporting patient responsibility.",
    "taskIds": [
      "medicare-medicaid-review",
      "insurance-appeal-mastery"
    ],
    "group": "public"
  },
  "pathology": {
    "title": "Pathology and biopsy bills",
    "mechanism": "Trace collection, technical processing, interpretation, and additional tests.",
    "checks": [
      "Who collected, processed, and interpreted the specimen?",
      "What record supports additional stains or tests?",
      "Do separate components and dates explain the bills?"
    ],
    "evidence": [
      "Specimen and report references",
      "Component codes and modifiers",
      "Separate pathology EOBs"
    ],
    "claim": "A second pathology bill is automatically a duplicate",
    "counter": "Please identify the service component and explain any overlapping or additional test lines.",
    "taskIds": [
      "laboratory-disputes",
      "radiology-billing-challenge"
    ],
    "group": "coding"
  },
  "outpatient": {
    "title": "Outpatient surgery bills",
    "mechanism": "Track the center, surgeon, anesthesia group, and device charges separately.",
    "checks": [
      "What setting and facility billed the procedure?",
      "What is included in the quoted package or surgical fee?",
      "Which follow-up or device lines need explanation?"
    ],
    "evidence": [
      "Estimate or package terms",
      "Procedure and device references",
      "Separate bills and EOBs"
    ],
    "claim": "All follow-up is included for the same number of days",
    "counter": "Please identify the procedure-specific rule and whether it covers this particular follow-up service.",
    "taskIds": [
      "surgery-bill-analysis",
      "bundling-error-detector"
    ],
    "group": "bill"
  },
  "birthgap": {
    "title": "Childbirth during a coverage gap",
    "mechanism": "Investigate why coverage ended and which dates a correction could affect.",
    "checks": [
      "What do termination, enrollment, and premium records show?",
      "Who administers the plan and has authority to correct the record?",
      "What actual notice describes enrollment or appeal options?"
    ],
    "evidence": [
      "Coverage and termination notices",
      "Premium or enrollment receipts",
      "Parent and newborn service dates"
    ],
    "claim": "Pregnancy automatically restores terminated coverage",
    "counter": "Please explain the effective dates and the available correction or enrollment route; I am not assuming retroactive coverage.",
    "taskIds": [
      "retroactive-coverage-activator",
      "multi-bill-portfolio-manager"
    ],
    "group": "coverage"
  },
  "birthrestored": {
    "title": "Old childbirth bills after coverage resumes",
    "mechanism": "Keep new coverage dates separate from the earlier service dates and assistance review.",
    "checks": [
      "Did the current plan cover the dates on these old bills?",
      "Is there a pending correction or program-specific retroactive decision?",
      "Which billers can review financial assistance separately?"
    ],
    "evidence": [
      "Old and new coverage notices",
      "Prior service bills",
      "Assistance or correction receipts"
    ],
    "claim": "A new insurance card pays every old bill",
    "counter": "Please confirm which service dates are covered and provide the decision in writing.",
    "taskIds": [
      "retroactive-coverage-activator",
      "charity-care-optimizer"
    ],
    "group": "coverage"
  },
  "accident": {
    "title": "Accident-related medical bills",
    "mechanism": "Map the possible payers and any lien or legal notice before assuming payment order.",
    "checks": [
      "Which health, auto, or liability claims exist?",
      "What written coordination instructions came from each payer?",
      "Is there a lien, lawsuit, or settlement requiring legal review?"
    ],
    "evidence": [
      "Policy and claim notices",
      "Provider statements",
      "Lien or settlement correspondence"
    ],
    "claim": "Auto insurance always pays first",
    "counter": "Please explain the applicable coordination process and confirm which claim is still pending.",
    "taskIds": [
      "auto-insurance-medical"
    ],
    "group": "coverage"
  },
  "network": {
    "title": "Out-of-network bills at an in-network facility",
    "mechanism": "Check the facility, clinician, service, plan, and any notice-and-consent record.",
    "checks": [
      "Was the facility in network on the service date?",
      "Which service and provider generated the balance?",
      "Does any notice-and-consent exception actually apply?"
    ],
    "evidence": [
      "Network verification reference",
      "Bill and EOB",
      "Any notice and consent form"
    ],
    "claim": "Any signed form removes all surprise-billing protection",
    "counter": "Please identify the applicable exception and explain whether this service permits it.",
    "taskIds": [
      "provider-network-leverage",
      "out-of-network-exception"
    ],
    "group": "network"
  },
  "deceased": {
    "title": "A deceased family member's bill",
    "mechanism": "Separate the estate's obligation from an allegation that a survivor must pay personally.",
    "checks": [
      "Who is named as debtor and who is being contacted?",
      "Was there shared liability or a relevant state-law exception?",
      "Is there an estate representative or actual court notice?"
    ],
    "evidence": [
      "Written collection notice",
      "Agreement or signature pages",
      "Estate-role and court references"
    ],
    "claim": "Being executor automatically makes the debt personal",
    "counter": "Please identify the specific basis for seeking my own funds rather than payment through the estate.",
    "taskIds": [
      "collections-agency-destroyer"
    ],
    "group": "deceased"
  },
  "nursing": {
    "title": "A nursing-home bill sent to a caregiver",
    "mechanism": "Inspect the admission agreement and the precise basis for alleged personal liability.",
    "checks": [
      "Does the facility participate in Medicare or Medicaid?",
      "Was a personal guarantee made a condition of admission or continued stay?",
      "Is the demand about resident funds, your own funds, or a separate allegation?"
    ],
    "evidence": [
      "Complete admission agreement",
      "Demand and account ledger",
      "Relevant resource-handling correspondence"
    ],
    "claim": "Responsible party always means personal guarantor",
    "counter": "Please identify the clause and legal basis you rely on, distinguishing resident resources from my personal funds.",
    "taskIds": [
      "collections-agency-destroyer"
    ],
    "group": "nursing"
  },
  "pediatric": {
    "title": "NICU and pediatric bills",
    "mechanism": "Keep the child's enrollment, benefits, and bill separate from the parent's records.",
    "checks": [
      "Was the child enrolled for each service date?",
      "Which costs counted toward which person's plan limit?",
      "Which daily services and separately billing clinicians need review?"
    ],
    "evidence": [
      "Child coverage confirmation",
      "Benefit accumulator explanation",
      "NICU bill and EOB"
    ],
    "claim": "The parent's coverage record settles every newborn charge",
    "counter": "Please identify the child's enrollment and claim processing separately.",
    "taskIds": [
      "multi-bill-portfolio-manager",
      "financial-hardship-application"
    ],
    "group": "coverage"
  },
  "covid": {
    "title": "Older COVID-related bills",
    "mechanism": "Check the policy and program that actually applied on the service date.",
    "checks": [
      "What coverage and waiver terms were effective then?",
      "What claim reason or coding issue is documented?",
      "Is the claimed assistance program currently open for this request?"
    ],
    "evidence": [
      "Service-date policy or waiver",
      "Bill and denial",
      "Program correspondence"
    ],
    "claim": "An old relief program is still accepting every claim",
    "counter": "Please identify the program, service-date rules, and current claim status rather than assume funding remains available.",
    "taskIds": [
      "insurance-policy-loophole-finder"
    ],
    "group": "coverage"
  },
  "workers": {
    "title": "Work-injury bills",
    "mechanism": "Track the compensation claim and disputed responsibility without assuming acceptance.",
    "checks": [
      "Was the work-injury claim accepted, denied, or still pending?",
      "What state process and notice apply?",
      "What does the provider say supports billing the patient personally?"
    ],
    "evidence": [
      "Claim decision",
      "Work-injury documentation reference",
      "Provider and collector notices"
    ],
    "claim": "Calling it a work injury settles all liability",
    "counter": "Please explain the current claim decision and the basis for this billing demand.",
    "taskIds": [
      "workers-comp-medical"
    ],
    "group": "legal"
  },
  "jobloss": {
    "title": "Bills after losing job-based coverage",
    "mechanism": "Put coverage-end dates, enrollment notices, and assistance options on separate tracks.",
    "checks": [
      "What date did coverage actually end?",
      "What continuation or enrollment notice was received and when?",
      "Which current hospital policy addresses changed income?"
    ],
    "evidence": [
      "Termination and enrollment notices",
      "Service dates",
      "Income-change and assistance references"
    ],
    "claim": "Every job loss has the same retroactive coverage window",
    "counter": "Please identify the actual notice, program, and effective-date conditions for the option being offered.",
    "taskIds": [
      "retroactive-coverage-activator",
      "financial-hardship-application"
    ],
    "group": "coverage"
  },
  "genetic": {
    "title": "Genetic-testing bills",
    "mechanism": "Compare the promised price, test order, claim decision, and lab assistance policy.",
    "checks": [
      "What price or coverage representation was provided before testing?",
      "What test was ordered and billed?",
      "What denial criterion or assistance rule applies?"
    ],
    "evidence": [
      "Pretest estimate or message",
      "Test order reference",
      "Lab bill and plan decision"
    ],
    "claim": "Insurance will cover it is a final payment decision",
    "counter": "Please reconcile the original representation with the claim decision and explain available review or assistance.",
    "taskIds": [
      "laboratory-disputes",
      "insurance-appeal-mastery"
    ],
    "group": "appeal"
  },
  "fertility": {
    "title": "Fertility-treatment bills",
    "mechanism": "Separate package terms, medication costs, and plan-specific benefit questions.",
    "checks": [
      "Which services or cycles does the written package include?",
      "What plan benefit or exclusion was used?",
      "What are the actual refund or cancellation terms?"
    ],
    "evidence": [
      "Package agreement",
      "Cycle and medication itemization",
      "Plan decision"
    ],
    "claim": "Every plan must follow the same fertility mandate",
    "counter": "Please identify this plan's funding, jurisdiction, benefit, and applicable exception rather than assume coverage.",
    "taskIds": [
      "insurance-policy-loophole-finder",
      "pharmacy-drug-overcharges"
    ],
    "group": "coverage"
  },
  "bariatric": {
    "title": "Bariatric-surgery bills",
    "mechanism": "Separate an exclusion from a medical-necessity denial and financial-assistance request.",
    "checks": [
      "Does the notice cite exclusion or clinical criteria?",
      "What evidence did the reviewer consider?",
      "Which formal review route is available for this decision?"
    ],
    "evidence": [
      "Plan exclusion or criterion",
      "Denial and surgical record references",
      "Appeal history"
    ],
    "claim": "More medical evidence always overrides a plan exclusion",
    "counter": "Please identify whether the decision concerns benefit design or clinical criteria so the response addresses the right issue.",
    "taskIds": [
      "medical-necessity-builder",
      "insurance-policy-loophole-finder"
    ],
    "group": "appeal"
  },
  "reconstructive": {
    "title": "Reconstructive versus cosmetic decisions",
    "mechanism": "Ask the treating team to address the specific functional or coverage criterion.",
    "checks": [
      "What policy definition produced the cosmetic classification?",
      "Which clinical evidence addresses functional impairment?",
      "Which statutory or plan protection, if any, applies to this procedure?"
    ],
    "evidence": [
      "Denial definition",
      "Treating-team evidence references",
      "Plan and appeal instructions"
    ],
    "claim": "A cosmetic label ends every review option",
    "counter": "Please supply the policy definition and review procedure so my clinician can respond to the actual criterion.",
    "taskIds": [
      "medical-necessity-builder",
      "peer-to-peer-prep"
    ],
    "group": "appeal"
  },
  "vision": {
    "title": "Vision and eye-surgery bills",
    "mechanism": "Separate elective upgrades, medical coverage, quoted prices, and financing.",
    "checks": [
      "Which lens, procedure, or enhancement was actually supplied?",
      "Which component was covered, excluded, or upgraded?",
      "Does the bill match per-eye pricing and financing terms?"
    ],
    "evidence": [
      "Lens and procedure references",
      "Quote and financing agreement",
      "Medical or vision EOB"
    ],
    "claim": "One price quote necessarily covers every upgrade",
    "counter": "Please itemize the base service, elected upgrades, and any difference from the written quote.",
    "taskIds": [
      "medical-device-billing",
      "specialist-consultation-review"
    ],
    "group": "bill"
  },
  "sleep": {
    "title": "Sleep-study and CPAP bills",
    "mechanism": "Keep the study claim separate from equipment coverage, usage documentation, and rental.",
    "checks": [
      "What study and authorization decision are recorded?",
      "What documentation supports continued equipment coverage?",
      "Which rental months and supplies are in this bill?"
    ],
    "evidence": [
      "Study and authorization references",
      "Usage or coverage decision",
      "Equipment agreement and paid claims"
    ],
    "claim": "A cheaper home test proves the ordered study was unnecessary",
    "counter": "Please explain the ordered service and coverage criterion; treatment alternatives require the clinician's judgment.",
    "taskIds": [
      "medical-device-billing",
      "diagnostic-overcharges"
    ],
    "group": "dme"
  },
  "chronic": {
    "title": "Recurring chronic-care bills",
    "mechanism": "Audit repeated bills and assistance renewals without mixing people or service periods.",
    "checks": [
      "Which balances are new versus repeated statements?",
      "What current benefit or authorization limit applies?",
      "When do assistance approvals expire or need renewal?"
    ],
    "evidence": [
      "Recurring bill versions",
      "Authorization and benefit decisions",
      "Assistance approvals and receipts"
    ],
    "claim": "Recurring treatment means every repeated code is wrong",
    "counter": "Please identify the service date and actual service behind each repeated line.",
    "taskIds": [
      "recurring-bill-audit-system",
      "hidden-revenue-stream-detector"
    ],
    "group": "bill"
  },
  "hospice": {
    "title": "Hospice and end-of-life bills",
    "mechanism": "Separate hospice-related services, other care, and the identity of the person asked to pay.",
    "checks": [
      "What service was billed and how was its relationship to the hospice election classified?",
      "What coverage notice explains the amount?",
      "Is the demand directed to the patient, estate, or a family member personally?"
    ],
    "evidence": [
      "Hospice election and coverage notice",
      "Service itemization",
      "Collection and estate-role records"
    ],
    "claim": "A hospice election removes every possible bill",
    "counter": "Please identify the specific service and coverage rule; separately explain any claim of personal family liability.",
    "taskIds": [
      "medicare-medicaid-review",
      "collections-agency-destroyer"
    ],
    "group": "deceased"
  },
  "psych": {
    "title": "Psychiatric-hospital bills",
    "mechanism": "Separate admission and continued-stay decisions from daily-charge review.",
    "checks": [
      "Which days were approved or denied?",
      "What criterion and daily evidence did the reviewer use?",
      "Which urgent or formal review route does the notice provide?"
    ],
    "evidence": [
      "Admission and daily record references",
      "Day-by-day denial",
      "Plan review instructions"
    ],
    "claim": "An initial approval guarantees every later day",
    "counter": "Please explain the continued-stay decision and the evidence needed to review the disputed dates.",
    "taskIds": [
      "mental-health-billing",
      "medical-necessity-builder"
    ],
    "group": "appeal"
  },
  "allergy": {
    "title": "Allergy-testing and immunotherapy bills",
    "mechanism": "Check the billed allergens, units, preparation, and administration against records.",
    "checks": [
      "How many tests or doses were ordered and billed?",
      "Which charges cover preparation versus administration?",
      "What criterion caused any denial?"
    ],
    "evidence": [
      "Order and service references",
      "Unit-based itemization",
      "EOB or denial"
    ],
    "claim": "A large panel alone proves unnecessary care",
    "counter": "Please explain the ordered tests and units; clinical appropriateness needs the treating team's review.",
    "taskIds": [
      "laboratory-disputes",
      "pharmacy-drug-overcharges"
    ],
    "group": "bill"
  },
  "chiropractic": {
    "title": "Chiropractic and treatment-package bills",
    "mechanism": "Compare actual visits, plan limits, add-ons, and unused prepaid services.",
    "checks": [
      "Which visits and add-ons were delivered?",
      "What benefit limit or exclusion was applied?",
      "What does the prepaid contract say about unused visits or refunds?"
    ],
    "evidence": [
      "Treatment-package terms",
      "Visit and charge ledger",
      "Plan decision and payment receipts"
    ],
    "claim": "A prepaid package means unused services can never be reviewed",
    "counter": "Please identify the contract provision and accounting for services delivered and unused.",
    "taskIds": [
      "recurring-bill-audit-system",
      "simple-payment-negotiation"
    ],
    "group": "bill"
  }
};
const scenarioSeedData = [
  {
    "id": "scenario-childbirth-hospital-bill",
    "topic": "birth",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        182,
        487
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-er-hospital-bill",
    "topic": "er",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        487,
        680
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-surgery-hospital-bill",
    "topic": "surgery",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        680,
        912
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-imaging-hospital-bill",
    "topic": "imaging",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        912,
        1062
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-hospitalization-bill",
    "topic": "stay",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1062,
        1229
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-lab-work-bill",
    "topic": "lab",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1229,
        1386
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-anesthesia-bill",
    "topic": "anesthesia",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1386,
        1488
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-specialist-bill",
    "topic": "specialist",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1488,
        1589
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-physical-therapy-bill",
    "topic": "therapy",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1589,
        1692
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-mental-health-bill",
    "topic": "mental",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1692,
        1795
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-ambulance-bill",
    "topic": "ambulance",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1795,
        1899
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-dental-hospital-bill",
    "topic": "dental",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        1899,
        2001
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-durable-equipment-bill",
    "topic": "dme",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2001,
        2104
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-medication-bill",
    "topic": "medications",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2104,
        2206
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-preventive-care-bill",
    "topic": "preventive",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2206,
        2309
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-urgent-care-bill",
    "topic": "urgent",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2309,
        2410
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-telehealth-bill",
    "topic": "telehealth",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2410,
        2512
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-cancer-treatment-bill",
    "topic": "cancer",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2512,
        2614
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-cardiac-care-bill",
    "topic": "cardiac",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2614,
        2716
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-dialysis-bill",
    "topic": "dialysis",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2716,
        2818
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-home-health-bill",
    "topic": "homehealth",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2818,
        2920
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-pathology-bill",
    "topic": "pathology",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        2920,
        3023
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-outpatient-surgery-bill",
    "topic": "outpatient",
    "stage": "hospital",
    "original": {
      "path": "client/src/pages/hospital-bill-playbook.tsx",
      "lines": [
        3023,
        3123
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-childbirth-collections",
    "topic": "birth",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        109,
        472
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-childbirth-insurance-kickoff",
    "topic": "birthgap",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        472,
        890
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-childbirth-back-on-insurance",
    "topic": "birthrestored",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        890,
        1143
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-emergency-room-collections",
    "topic": "er",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1143,
        1256
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-surgery-collections",
    "topic": "surgery",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1256,
        1369
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-mental-health-collections",
    "topic": "mental",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1369,
        1482
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-ambulance-collections",
    "topic": "ambulance",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1482,
        1596
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-cancer-treatment-collections",
    "topic": "cancer",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1596,
        1709
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-car-accident-collections",
    "topic": "accident",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1709,
        1822
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-diagnostic-imaging-collections",
    "topic": "imaging",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1822,
        1935
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-physical-therapy-collections",
    "topic": "therapy",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        1935,
        2048
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-prescription-drug-collections",
    "topic": "medications",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2048,
        2161
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-urgent-care-collections",
    "topic": "urgent",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2161,
        2274
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-out-of-network-collections",
    "topic": "network",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2274,
        2387
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-deceased-family-member-collections",
    "topic": "deceased",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2387,
        2500
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-nursing-home-collections",
    "topic": "nursing",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2500,
        2613
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-durable-medical-equipment-collections",
    "topic": "dme",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2613,
        2726
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-pediatric-nicu-collections",
    "topic": "pediatric",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2726,
        2839
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-covid-medical-collections",
    "topic": "covid",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2839,
        2952
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-workers-comp-collections",
    "topic": "workers",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        2952,
        3065
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-job-loss-collections",
    "topic": "jobloss",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3065,
        3178
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-dental-collections",
    "topic": "dental",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3178,
        3291
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-telemedicine-billing-collections",
    "topic": "telehealth",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3291,
        3404
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-preventive-care-billing-collections",
    "topic": "preventive",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3404,
        3517
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-genetic-testing-collections",
    "topic": "genetic",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3517,
        3630
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-fertility-ivf-collections",
    "topic": "fertility",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3630,
        3743
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-bariatric-surgery-collections",
    "topic": "bariatric",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3743,
        3856
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-cosmetic-vs-reconstructive-collections",
    "topic": "reconstructive",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3856,
        3969
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-home-health-care-collections",
    "topic": "homehealth",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        3969,
        4082
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-dialysis-collections",
    "topic": "dialysis",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4082,
        4195
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-vision-lasik-collections",
    "topic": "vision",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4195,
        4308
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-sleep-study-collections",
    "topic": "sleep",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4308,
        4421
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-chronic-condition-collections",
    "topic": "chronic",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4421,
        4534
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-hospice-end-of-life-collections",
    "topic": "hospice",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4534,
        4647
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-psychiatric-hospital-collections",
    "topic": "psych",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4647,
        4760
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-allergy-testing-collections",
    "topic": "allergy",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4760,
        4873
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  },
  {
    "id": "scenario-chiropractic-collections",
    "topic": "chiropractic",
    "stage": "collections",
    "original": {
      "path": "client/src/pages/collections-defense-guide.tsx",
      "lines": [
        4873,
        4984
      ],
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    }
  }
];

export const scenarioPlaybooks = scenarioSeedData.map(scenarioBuildRoute);
export const scenarioKnowledgeConcepts = scenarioPlaybooks.map(route => ({
  id: route.id, category: route.category, title: route.title,
  question: `What should I check about ${route.title.toLowerCase()}?`,
  summary: route.summary, mechanism: `${route.pattern} ${route.appliesWhen}`,
  actions: route.firstMove.steps, verify: route.verify, avoid: route.watchouts,
  evidence: route.evidence, completion: ['The relevant records, written response, and next review route are identified; the bill or debt is not automatically resolved.'],
  sourceIds: route.sourceIds, coverage: route.triggers.coverage, documentTypes: route.triggers.documentTypes, goals: route.triggers.goals,
  tags: [...new Set([...route.title.toLowerCase().split(/[^a-z]+/).filter(Boolean), ...route.taskIds.flatMap(id => id.split('-'))])],
  kind: 'procedure', manualOnly: true, sourceCoverage: route.sourceCoverage, countermeasureId: route.id,
  counterQuestions: route.counterQuestions, responseBranches: route.responses,
  handoffRefs: [{ artifact: 'original-repository', path: route.original.path, lines: route.original.lines, commit: route.original.commit }],
}));
