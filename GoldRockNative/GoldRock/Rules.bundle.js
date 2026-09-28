// GENERATED from shared domain modules. Run node ios/sync-rules.mjs after domain changes.
// money.js: 6717a63a34701d0f42300f58cbc90bb74b4d722af54fb6f13d9b407766bbd6f1
/** Exact USD parsing: no binary-float multiplication and no silent OCR corrections. */
function parseMoneyToCents(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') throw new TypeError('Enter the amount as text.');
  const clean = value.trim().replace(/^\$\s?/, '');
  if (!/^(?:0|[1-9][0-9]*|[1-9][0-9]{0,2}(?:,[0-9]{3})+)(?:\.[0-9]{1,2})?$/.test(clean)) throw new RangeError('Use dollars and at most two decimal places.');
  const [whole, fraction = ''] = clean.replaceAll(',', '').split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (cents > 1_000_000_000n) throw new RangeError('Amount exceeds the supported range.');
  return Number(cents);
}
function formatMoney(cents) {
  if (cents === null || cents === undefined) return 'Not entered';
  if (!Number.isSafeInteger(cents)) throw new TypeError('Amount must use integer cents.');
  // Dividing a large safe integer by 100 can lose its final cent before formatting.
  // The product uses USD/en-US; format the integer digits without a float conversion.
  const digits = String(Math.abs(cents)).padStart(3, '0');
  const dollars = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${cents < 0 ? '-' : ''}$${dollars}.${digits.slice(-2)}`;
}
function sumMoney(values) {
  if (!Array.isArray(values) || values.some(value => !Number.isSafeInteger(value))) throw new TypeError('All amounts must use integer cents.');
  const result = values.reduce((sum, value) => sum + BigInt(value), 0n);
  if (result > BigInt(Number.MAX_SAFE_INTEGER) || result < BigInt(Number.MIN_SAFE_INTEGER)) throw new RangeError('Money total exceeds safe integer range.');
  return Number(result);
}

// validation.js: 76f62714e053fffbd6f821524a58c7c385b548519c33fe4af1adbd87573de20a
/** Public analysis boundary. Unknown fields are rejected rather than silently discarded. */
const FACT_ENUMS = Object.freeze({
  documentType: ['bill', 'eob', 'denial', 'estimate', 'unknown'],
  goal: ['understand', 'check', 'afford', 'appeal', 'plan'],
  coverage: ['private', 'medicare', 'medicaid', 'uninsured', 'self_pay', 'unknown'],
  careSetting: ['emergency', 'in_network_facility', 'out_of_network_facility', 'air_ambulance', 'ground_ambulance', 'other', 'unknown'],
  claimStatus: ['pending', 'processed', 'denied', 'unknown'],
  denialReason: ['administrative', 'coverage', 'medical_necessity', 'unknown'],
});
const MONEY_FIELDS = Object.freeze(['billedCents', 'adjustmentCents', 'insurancePaidCents', 'paidCents', 'balanceCents', 'estimateCents', 'eobResponsibilityCents']);
const FACT_KEYS = Object.freeze([...Object.keys(FACT_ENUMS), 'state', ...MONEY_FIELDS, 'hasItemization', 'hasEstimate', 'daysSinceInitialBill', 'daysSinceDenialReceived', 'lines']);
const STATES = new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI'.split(' '));
class DomainError extends Error {
  constructor(details) { super('Review the approved facts. One or more fields are invalid.'); this.name = 'DomainError'; this.code = 'INVALID_FACTS'; this.details = details; }
}
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
// Medical codes are not a channel for names, diagnoses in prose, or document text.
// CPT I, CPT II/III, HCPCS and dotted/undotted ICD-10 forms; syntax does not establish coding validity.
function isMedicalCode(code) { return typeof code === 'string' && /^(?:[0-9]{4,5}|[0-9]{4}[FTU]|[A-Z][0-9]{4}|[A-Z][0-9][0-9A-Z](?:\.[0-9A-Z]{1,3}|[0-9A-Z]{1,4}))$/.test(code); }
function validateFacts(input) {
  if (!plain(input)) throw new DomainError([{ field: 'facts', reason: 'Expected a JSON object.' }]);
  const issues = [], output = {};
  const issue = (field, reason) => issues.push({ field, reason });
  // Never echo unknown field names: a malicious property name can itself contain PHI.
  if (Object.keys(input).some(key => !FACT_KEYS.includes(key))) issue('facts', 'Unapproved fields are not accepted.');
  for (const field of ['documentType', 'goal', 'coverage']) if (!Object.hasOwn(input, field)) issue(field, 'Choose an option, including unknown when available.');
  for (const [field, choices] of Object.entries(FACT_ENUMS)) if (Object.hasOwn(input, field)) {
    if (!choices.includes(input[field])) issue(field, 'Choose one of the supported options.'); else output[field] = input[field];
  }
  if (Object.hasOwn(input, 'state')) { if (input.state !== 'unknown' && !STATES.has(input.state)) issue('state', 'Use a supported two-letter state/territory code or unknown.'); else output.state = input.state; }
  for (const field of [...MONEY_FIELDS, 'daysSinceInitialBill', 'daysSinceDenialReceived']) if (Object.hasOwn(input, field)) {
    const value = input[field], max = MONEY_FIELDS.includes(field) ? 1_000_000_000 : 36_500;
    if (value !== null && (!Number.isSafeInteger(value) || value < 0 || value > max)) issue(field, 'Use a nonnegative whole number within the supported range, or null.'); else output[field] = value;
  }
  for (const field of ['hasItemization', 'hasEstimate']) if (Object.hasOwn(input, field)) { if (typeof input[field] !== 'boolean') issue(field, 'Use true or false.'); else output[field] = input[field]; }
  if (Object.hasOwn(input, 'lines')) {
    if (!Array.isArray(input.lines) || input.lines.length > 100) issue('lines', 'Use at most 100 line items.');
    else {
      const ids = new Set();
      output.lines = input.lines.map((line, index) => {
        const field = `lines[${index}]`;
        if (!plain(line)) { issue(field, 'Expected a line item object.'); return {}; }
        if (Object.keys(line).some(key => !['id', 'code', 'amountCents', 'units'].includes(key))) issue(field, 'Unapproved line fields are not accepted.');
        if (typeof line.id !== 'string' || !/^line-[1-9][0-9]{0,3}$/.test(line.id) || ids.has(line.id)) issue(`${field}.id`, 'Use a unique generated line identifier.');
        ids.add(line.id);
        if (line.code !== null && !isMedicalCode(line.code)) issue(`${field}.code`, 'Use a supported medical code or null.');
        if (!Number.isSafeInteger(line.amountCents) || line.amountCents < 0 || line.amountCents > 1_000_000_000) issue(`${field}.amountCents`, 'Use nonnegative whole USD cents.');
        if (!Number.isSafeInteger(line.units) || line.units < 1 || line.units > 10000) issue(`${field}.units`, 'Use whole units from 1 to 10000.');
        return { id: line.id, code: line.code, amountCents: line.amountCents, units: line.units };
      });
    }
  }
  if (issues.length) throw new DomainError(issues);
  return output;
}

// billing-routes.js: 8383d492d5859cf75cfbf5a30e9d22eac92f35f0a4bb2d324ddafa75042f67d1
/** Original consumer-request templates. Reviewed primary sources; no eligibility or deadline inference. */
const billingSources = [
  {id:'cms-read-medical-bill',title:'Read a medical bill alongside the EOB',url:'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/medical-bill-guides-resources/how-read-your-medical-bill',publisher:'CMS',applicability:'Provider bills and matching health-plan explanations; separate providers and service dates must be matched.',summary:'If an EOB is missing, ask the plan whether it received the claim. Compare the bill with the matching EOB; an EOB is not a bill.'},
  {id:'cfpb-assistance-steps',title:'Applying for help with medical bills',url:'https://www.consumerfinance.gov/ask-cfpb/is-there-financial-help-for-my-medical-bills-en-2124/',publisher:'CFPB',applicability:'Assistance varies by provider, policy and state; insured people may also qualify.',summary:'Request the policy and application, ask what happens while it is reviewed, and follow up. Collection placement does not necessarily end assistance options.'},
  {id:'irs-fap-provider-list',title:'Which providers a hospital assistance policy covers',url:'https://www.irs.gov/pub/irs-drop/n-15-46.pdf',publisher:'IRS',applicability:'Section 501(r) tax-exempt hospital facilities; coverage may differ by provider and service.',summary:'The hospital policy must identify covered and excluded providers. An excluded practice may have a separate assistance program.'},
  {id:'irs-fap-final-regulations',title:'Financial-assistance application and collection procedures',url:'https://www.irs.gov/irb/2015-05_IRB',publisher:'IRS',applicability:'TD 9708, sections 1.501(r)-1 and 1.501(r)-6; confirm hospital, care, application, notices and procedural route.',summary:'Application timing, incomplete applications and presumptive discounts have distinct requirements. A discount does not by itself establish that the most generous assistance was considered.'},
  {id:'cfpb-deferred-interest',title:'How deferred interest works',url:'https://www.consumerfinance.gov/ask-cfpb/i-got-a-credit-card-promising-no-interest-for-a-purchase-if-i-pay-in-full-within-12-months-how-does-this-work-en-40/',publisher:'CFPB',applicability:'Deferred-interest credit-card offers; the actual agreement and promotion control.',summary:'A remaining balance at the promotion deadline can trigger interest dating back to the purchase. Minimum payments may not retire the promotional balance in time.'},
  {id:'cfpb-collection-scope',title:'Which debt-collection rules apply',url:'https://www.consumerfinance.gov/ask-cfpb/what-laws-limit-what-debt-collectors-can-say-or-do-en-329/',publisher:'CFPB',applicability:'FDCPA consumer debts and covered debt collectors; original-creditor collection generally falls outside that federal law.',summary:'Identify who is collecting before applying FDCPA procedures. State protections and credit-report accuracy requirements are separate.'},
  {id:'cfpb-validation-disputes',title:'Written debt disputes and original-creditor requests',url:'https://www.consumerfinance.gov/rules-policy/regulations/1006/38/',publisher:'CFPB',applicability:'Regulation F section 1006.38; covered collector, timely written submission, disputed portion and duplicative-dispute rules.',summary:'Timely written disputes trigger verification procedures. A collector-accepted electronic channel can qualify as writing; repeating a resolved dispute without material new information has different rules.'},
  {id:'cfpb-paid-wrong-debt',title:'When the debt is wrong or already paid',url:'https://www.consumerfinance.gov/ask-cfpb/what-can-i-do-if-a-debt-collector-contacts-me-about-a-debt-i-already-paid-or-dont-think-i-owe-en-1403/',publisher:'CFPB',applicability:'Confirm a legitimate collector and the specific disputed amount before sharing evidence.',summary:'Explain the discrepancy, retain originals, and keep copies and delivery records. Payment evidence can help resolve an already-paid claim.'},
  {id:'cfpb-old-debt',title:'Older debt and lawsuit time limits',url:'https://www.consumerfinance.gov/ask-cfpb/can-debt-collectors-collect-a-debt-thats-several-years-old-en-1423/',publisher:'CFPB',applicability:'State, contract, debt type, payments and procedural history determine any limitation defense.',summary:'Debt age alone does not erase it. Payment or acknowledgment can affect lawsuit time limits in some states; a summons requires a timely response.'},
  {id:'cfpb-medical-reporting-status',title:'Status of the federal medical-debt reporting rule',url:'https://www.consumerfinance.gov/rules-policy/final-rules/consumer-reporting-regulation-v/',publisher:'CFPB',applicability:'Federal Regulation V medical-debt rule status; state law and bureau policies require separate review.',summary:'The 2025 medical-debt reporting rule was vacated on July 11, 2025. Do not infer a nationwide ban on reporting medical debt.'},
  {id:'bureau-medical-reporting',title:'Nationwide credit-bureau medical collection policies',url:'https://www.experianplc.com/newsroom/press-releases/2023/equifax-experian-and-transunion-remove-medical-collections-debt-under-500-from-us-credit-reports',publisher:'Equifax, Experian and TransUnion',applicability:'Voluntary policies for medical collection tradelines at these three bureaus; not cancellation of debt or a credit-card exemption.',summary:'Their announced policies exclude paid medical collections and initial reported balances under $500, with a one-year delay for unpaid medical collections.'},
];

const billingRoutes = [
  {
    id:'bill-reconcile',title:'Reconcile a bill that does not add up',category:'bill',
    summary:'Build one clear question from the itemized bill, account ledger and matching insurer decision.',
    pattern:'A balance arrives before claim processing is clear, or payments and adjustments appear to be missing.',
    appliesWhen:'You have a provider bill or EOB and want to verify what the records actually show.',
    verify:[
      'Do the documents describe the same provider, service dates and episode of care?',
      'Is the insurer still processing, asking for information, or issuing a denial?',
      'Which exact charge, payment or adjustment needs an explanation?',
      'What due date or follow-up date appears on the actual notice?',
    ],
    firstMove:{title:'Ask for the records behind the balance',steps:[
      'Request an itemized statement and a ledger of payments, credits and adjustments.',
      'If insurance was used, ask the plan whether it received and processed the matching claim.',
      'Point to one specific mismatch; keep the question separate from a conclusion that it is an error.',
      'Request written review timing and any available billing hold, including its scope and end date.',
    ],draft:'Please explain the balance for [service date]. I need an itemized statement and the ledger showing payments, credits and adjustments. My question is [specific mismatch]. If insurance is involved, please confirm the claim status. What happens to billing while you review this, and when should I follow up?'},
    responses:{
      no_reply:{title:'Find the person responsible for the review',steps:[
        'Check that the request reached the billing office.',
        'Ask for the review owner and a written response date.',
        'If that date passes, ask a billing supervisor or patient-relations office to help route the request.',
      ],draft:'I requested a balance review on [date] and have not received a response. Please confirm receipt, who is handling it, and the response date. Please also confirm the current account status.'},
      more_info:{title:'Answer the missing-record question',steps:[
        'Ask which specific document or line is missing.',
        'Use the verified provider or plan channel to supply only what is needed.',
        'Keep a copy and ask whether the review is now complete enough to proceed.',
      ],draft:'Please identify the missing item and the question it will resolve. I can provide it through your verified channel. After receipt, please confirm the next review step and date.'},
      denied:{title:'Separate a billing answer from a coverage decision',steps:[
        'Ask for the written calculation and reason the questioned amount remains.',
        'Request coding or account review if the charge itself remains unexplained.',
        'If the issue is a plan denial, use that notice to check the separate appeal route and deadline.',
      ],draft:'Please show how the remaining balance was calculated and answer [specific unresolved question]. Is this a provider billing determination or an insurer coverage decision? Please identify the next review process and its deadline.'},
    },
    watchouts:[
      'A repeated code or different total is a question to investigate, not proof of fraud or a promised refund.',
      'A pending claim or records request does not automatically pause a bill. Confirm any hold in writing.',
      'An EOB is not a payment request. Match it to the actual provider bill.',
    ],
    sourceIds:['cms-read-medical-bill','cfpb-medical-debt','healthcare-appeals'],
    triggers:{documentTypes:['bill','eob'],goals:['understand','check'],coverage:['private','medicare','medicaid','uninsured','self_pay']},
  },
  {
    id:'assistance-recheck',title:'Ask for assistance or a fresh review',category:'assistance',
    summary:'Check the actual policy, the providers it covers and whether your current circumstances were considered.',
    pattern:'A payment demand or partial discount arrives without a clear assistance decision.',
    appliesWhen:'A hospital or other provider offers assistance, or you need to find out whether it does.',
    verify:[
      'Which facility and separately billing practices issued these charges?',
      'Which policy and provider list apply to this care?',
      'Was the outcome a full application decision, an automatic discount, or a missing-information notice?',
      'Have household circumstances changed, and what evidence does the policy accept?',
    ],
    firstMove:{title:'Get the policy and application route',steps:[
      'Request the assistance policy, application and covered-provider list.',
      'Ask which care and accounts the application will cover.',
      'Submit through the provider channel and keep a dated receipt.',
      'Ask about the response date, billing status and any notices needing a separate response.',
    ],draft:'Please send the financial-assistance policy, application and covered-provider list for my care. I would like a review using my current circumstances. Which accounts are included, what evidence is required, and what happens to the bills while you decide?'},
    responses:{
      no_reply:{title:'Confirm the application reached a reviewer',steps:[
        'Use the submission receipt to ask for status.',
        'Ask whether the application is recorded as complete.',
        'Bring an unanswered request to the financial-assistance supervisor or patient-relations office.',
      ],draft:'My application was submitted on [date]. Please confirm its status, whether anything is missing, and the expected decision date. Please review the account status while it is pending.'},
      more_info:{title:'Clarify the remaining evidence',steps:[
        'Get a written list of missing items and the response date.',
        'Ask what alternatives are accepted if an item is unavailable.',
        'Send the evidence to the provider and keep confirmation of receipt.',
      ],draft:'Please list the items still required by the policy and the date to provide them. I cannot obtain [item]; what alternative evidence is accepted? Please confirm how to keep the application under review.'},
      denied:{title:'Request the reason and another review where available',steps:[
        'Ask which eligibility criterion or provider exclusion caused the decision.',
        'For an automatic partial discount, ask how to seek more generous assistance; for changed facts, ask about reconsideration.',
        'If a separate practice is excluded, ask that practice for its own assistance options.',
      ],draft:'Please identify the policy provision and facts supporting the decision. Does [corrected or changed fact] permit reconsideration, or can I apply for assistance beyond the automatic discount? If this provider is excluded, please identify who handles its assistance requests.'},
    },
    watchouts:[
      'Insurance does not automatically rule assistance out, but no national income threshold guarantees approval.',
      'Hospital approval may exclude a separately billing practice or particular service.',
      'The federal tax-exempt hospital rules concern specific extraordinary collection actions. They are not a blanket freeze on all billing.',
      'Confirm the application window and any collection or court notice. Asking for help alone does not establish a hold.',
    ],
    sourceIds:['irs-financial-assistance','irs-collections','irs-fap-provider-list','irs-fap-final-regulations','cfpb-assistance-steps'],
    triggers:{documentTypes:['bill','estimate'],goals:['afford','plan'],coverage:['private','medicare','medicaid','uninsured','self_pay']},
  },
  {
    id:'financing-pressure',title:'Review financing before agreeing',category:'bill',
    summary:'Understand who you would owe and the full cost before choosing a payment arrangement.',
    pattern:'A desk, portal or bill offers monthly payments before assistance and the final balance are clear.',
    appliesWhen:'You are considering a provider payment plan, medical credit card or third-party financing offer.',
    verify:[
      'Is this a direct provider arrangement or a new lender account?',
      'Have the bill and available assistance been reviewed?',
      'What interest, fees, promotion deadline and missed-payment terms appear in writing?',
      'What payment fits your budget after essential expenses?',
    ],
    firstMove:{title:'Request a written comparison',steps:[
      'Ask about assistance before accepting financing.',
      'Request the creditor name, full agreement, total cost and payment schedule.',
      'Ask whether a direct interest-free provider plan is available.',
      'For deferred interest, compare the payoff needed by the promotion date with the stated minimum payment.',
    ],draft:'Before I choose financing, please explain the assistance and direct provider payment options. For this offer, please send the creditor name, written terms, total cost, interest and fees, payment schedule, and any promotion deadline. I need to review affordability before deciding.'},
    responses:{
      no_reply:{title:'Get the terms from the agreement owner',steps:[
        'Ask the billing office who issues the agreement.',
        'Request a copy through that party’s verified channel.',
        'Record any existing bill deadline separately from the offer’s expiration.',
      ],draft:'I still need the written terms requested on [date]. Who issues this agreement, and how can I obtain a copy? Please confirm the current bill due date separately from the financing offer.'},
      more_info:{title:'Clarify the purpose of the request',steps:[
        'Ask whether information is for an assistance review or a credit application.',
        'Review the required disclosures before authorizing a lender application.',
        'Provide sensitive financial information only through the verified recipient’s channel.',
      ],draft:'Is this information needed for financial assistance, a provider arrangement, or a lender credit application? Please explain which process I would be starting and provide its disclosures before I decide.'},
      denied:{title:'Ask which affordable options remain',steps:[
        'Ask whether a smaller installment or different schedule is available.',
        'Request written terms for any revised offer.',
        'If assistance was denied, review its reason and reconsideration process separately.',
      ],draft:'The proposed payment is not affordable for me. Is a smaller installment or different schedule available directly from the provider? Please send any revised terms and the reason for any separate assistance decision.'},
    },
    watchouts:[
      'A financing offer is not proof that you owe the amount or that assistance was considered.',
      'Deferred interest can reach back to the purchase; minimum payments may not clear the balance by the promotion deadline.',
      'Medical credit-card or financing delinquencies do not get the same bureau treatment as medical collection tradelines.',
      'A request for terms does not change an existing payment obligation. Confirm any change with the creditor.',
    ],
    sourceIds:['cfpb-medical-financing','cfpb-deferred-interest','cfpb-medical-debt'],
    triggers:{documentTypes:['bill','estimate'],goals:['afford','plan'],coverage:['private','medicare','medicaid','uninsured','self_pay']},
  },
  {
    id:'collection-validation',title:'Respond to a collector with the facts',category:'collections',
    summary:'Check the notice, preserve the response date and dispute the specific amount you question.',
    pattern:'A third-party collector contacts you about a medical balance you cannot verify or believe is wrong.',
    appliesWhen:'You confirm actual collector contact. A large bill alone does not mean the account is in collections.',
    verify:[
      'Who is contacting you, and have you independently verified the collector and creditor?',
      'When did you receive the validation information, and what response date does it state?',
      'What amount is disputed, and what payment or assistance records support that question?',
      'Is there a lawsuit, summons or separate court deadline?',
    ],
    firstMove:{title:'Prepare a specific written dispute',steps:[
      'Check the validation information and notice response channel promptly.',
      'State truthfully which amount you dispute and why; ask for verification and original-creditor information.',
      'Use mail or an electronic channel the collector accepts; keep the submission and delivery record.',
      'Treat a summons as a separate legal matter and seek timely legal help.',
    ],draft:'I dispute [all or specified portion] of the amount in your notice because [brief facts]. Please provide verification of that amount and the name and address of the original creditor if different. Please also explain the itemization and record this dispute. My supporting information is [list, if available].'},
    responses:{
      no_reply:{title:'Check delivery and document further activity',steps:[
        'Confirm where and when the dispute was delivered.',
        'Keep later notices and communication dates with that record.',
        'If collection continues despite a qualifying timely dispute, consider CFPB assistance or a consumer-law attorney.',
      ],draft:'My written dispute was sent on [date] through [channel]. Please confirm receipt and provide your response. I have also received [later communication]; please explain the account’s dispute status.'},
      more_info:{title:'Supply the relevant proof safely',steps:[
        'Ask which specific discrepancy needs more information.',
        'Send copies of relevant payment or assistance records through the verified channel; keep originals.',
        'Keep unrelated medical and financial information out of the reply.',
      ],draft:'Please identify the specific information needed to review [discrepancy]. The enclosed copies show [relevant fact]. Please explain whether and how they change the amount you are collecting.'},
      denied:{title:'Identify what remains unresolved',steps:[
        'Read the verification against the actual disputed point.',
        'If you have new material evidence, explain it rather than resending an unchanged dispute.',
        'Consider a CFPB complaint or legal help for unresolved collection problems; respond to any court notice on time.',
      ],draft:'Your response does not address [specific unresolved point]. New information is [fact and supporting copy, if any]. Please explain your position and correct any amount that the evidence shows is inaccurate.'},
    },
    watchouts:[
      'For a covered collector, a written dispute within the validation period can pause collection of the disputed amount pending verification. Use the notice’s 30-day response date; a late request does not automatically create that protection.',
      'FDCPA rules generally do not cover the original provider collecting its own bill. Neither a missing response nor a missed dispute period automatically cancels the debt.',
      'Before paying or acknowledging an older debt, check state-specific legal advice; this can affect lawsuit time limits. Never ignore a summons.',
      'Credit-report exclusion does not erase a debt. The 2025 federal medical-debt reporting rule was vacated; bureau policies and state protections need separate checking.',
    ],
    sourceIds:['cfpb-debt-validation','cfpb-validation-disputes','cfpb-paid-wrong-debt','cfpb-collection-scope','cfpb-old-debt','cfpb-medical-reporting-status','bureau-medical-reporting'],
    triggers:{documentTypes:['bill'],goals:['understand','check','afford'],coverage:['private','medicare','medicaid','uninsured','self_pay']},
  },
];

// insurance-routes.js: 51f4d86dee3261d593e547e58431e95f87f97aef1a6d6a405df35c8eea00b720
// Reviewed against the linked primary sources on 2026-09-27.
// These are editable, unsent self-advocacy templates. Source freshness is applied
// by the shared registry; a route is a question path, never an eligibility ruling.
const insuranceSources = [
  { id:'insurance-wa-correction', title:'How to appeal a health insurance denial', publisher:'Washington Office of the Insurance Commissioner', url:'https://www.insurance.wa.gov/insurance-resources/health-insurance/appealing-health-insurance-denial/how-appeal-health-insurance-denial', applicability:'Washington consumer guidance. Processing-versus-coverage distinction is useful elsewhere; state appeal rights must be verified.', summary:'Separates claim-processing correction from a request to reverse a coverage decision.' },
  { id:'insurance-cms-eob', title:'How to read a health insurance explanation of benefits', publisher:'CMS', url:'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/medical-bill-guides-resources/how-read-health-insurance-explanation-benefits', applicability:'Consumer explanation of EOB fields; the actual plan and current claim determine responsibility.', summary:'An EOB describes claim processing; it is not a payment demand.' },
  { id:'insurance-cms-cost-sharing', title:'Health insurance terms you should know', publisher:'CMS', url:'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/medical-bill-guides-resources/health-insurance-terms-you-should-know', applicability:'General insurance terminology, with covered-service and network conditions.', summary:'Allowed charges, plan payment, deductibles, coinsurance and patient responsibility are different amounts.' },
  { id:'insurance-cms-network-bill', title:'Action plan: bill with an in-network provider', publisher:'CMS', url:'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/find-action-plan-your-medical-bill/action-plan-bill-network-provider', applicability:'Insured patients comparing a bill with the corresponding in-network EOB.', summary:'Compare the bill with the EOB; request provider correction for discrepancies or a plan appeal for an incorrect determination.' },
  { id:'insurance-uhc-2026-guide', title:'2026 UnitedHealthcare provider administrative guide', publisher:'UnitedHealthcare', url:'https://www.uhcprovider.com/content/dam/provider/docs/public/admin-guides/2026-UHC-Administrative-Guide.pdf', applicability:'Named UnitedHealthcare products, agreements and supplements only; not a universal patient right or filing deadline.', summary:'Provider filing rules depend on agreements and state requirements; accepted-claim evidence matters. Peer discussions and formal appeals are distinct.' },
  { id:'insurance-cms-directory', title:'ACA and Consolidated Appropriations Act implementation FAQs, Part 49', publisher:'U.S. Departments of Labor, HHS and Treasury', url:'https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/downloads/faqs-part-49.pdf', applicability:'Provider-directory reliance protections for applicable group and individual coverage; verify plan, timing and evidence.', summary:'Inaccurate network information supplied by a plan can affect the permitted cost sharing and accumulator treatment.', effectiveFrom:'2022-01-01' },
  { id:'insurance-healthcare-internal', title:'Internal health plan appeals', publisher:'HealthCare.gov', url:'https://www.healthcare.gov/appeal-insurance-company-decision/internal-appeals/', applicability:'Applicable private health coverage; separate Medicare, Medicaid and other program procedures must be used.', summary:'A formal appeal asks the plan to reconsider a denial; evidence, submission proof and the correct appeal deadline matter.' },
  { id:'insurance-healthcare-external', title:'External review of health plan decisions', publisher:'HealthCare.gov', url:'https://www.healthcare.gov/appeal-insurance-company-decision/external-review/', applicability:'Eligible adverse decisions under applicable state or federal review processes; not every billing dispute qualifies.', summary:'Eligible medical-judgment and other specified denials may receive independent review using the process identified in the notice.' },
  { id:'insurance-healthcare-preauth', title:'Preauthorization', publisher:'HealthCare.gov', url:'https://www.healthcare.gov/glossary/preauthorization/', applicability:'General private insurance definition; coverage and payment conditions remain plan-specific.', summary:'Prior authorization by itself does not guarantee payment.' },
  { id:'insurance-naic-denials', title:'How to appeal a denied health care claim', publisher:'National Association of Insurance Commissioners', url:'https://content.naic.org/sites/default/files/inline-files/how-to-appeal-a-denied-claim.pdf', applicability:'General consumer claim-denial guidance; check the member notice and governing plan process.', summary:'Read the denial and policy, assemble supporting material, and follow the correct internal or external review path.' },
  { id:'insurance-dol-claim-file', title:'Filing a claim for health or disability benefits', publisher:'U.S. Department of Labor, EBSA', url:'https://www.dol.gov/node/63367', applicability:'ERISA-covered employee benefit plans; additional protections depend on plan and claim type.', summary:'Explains denial reasons, plan provisions, relevant records, benefit-claim procedures and review rights.' },
  { id:'insurance-dol-fiduciary', title:'Fiduciary responsibilities under a group health plan', publisher:'U.S. Department of Labor, EBSA', url:'https://www.dol.gov/node/63394', applicability:'ERISA group health plans; not every employer arrangement is covered.', summary:'Addresses claims administration, relevant claim records and clinical reasons supporting adverse decisions.' },
  { id:'insurance-dol-procedures', title:'Benefit claims procedure regulation FAQs', publisher:'U.S. Department of Labor, EBSA', url:'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/benefit-claims-procedure-regulation', applicability:'ERISA procedure guidance; additional ACA standards and current plan-specific rules also matter.', summary:'Distinguishes informal inquiries from claims filed through reasonable procedures and explains relevant claim information.' },
  { id:'insurance-dol-recordings', title:'Information letter on relevant claim recordings', publisher:'U.S. Department of Labor, EBSA', url:'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/information-letters/06-14-2021', applicability:'ERISA claim-file disclosure where an existing recording or transcript is relevant to the benefit determination.', summary:'A retained call recording may be relevant claim material even when created for quality assurance.' },
  { id:'insurance-wa-jurisdiction', title:'Who to contact about an employer health plan', publisher:'Washington Office of the Insurance Commissioner', url:'https://www.insurance.wa.gov/insurance-resources/health-insurance/health-insurance-coverage/who-contact-issues-your-employer-health-plan', applicability:'Washington routing examples; use the regulator for the actual plan and jurisdiction elsewhere.', summary:'Fully insured, self-funded private, government and religious-employer arrangements require different escalation paths.' },
  { id:'insurance-cms-government', title:'Self-funded non-federal governmental plans', publisher:'CMS', url:'https://www.cms.gov/marketplace/private-health-insurance/self-funded-non-federal-governmental-plans', applicability:'State and local government health plans subject to applicable Public Health Service Act provisions.', summary:'CMS has a distinct enforcement role for non-federal governmental plans; private-employer ERISA routing cannot simply be assumed.' }
];

const insuranceRoutes = [
  {
    id:'insurance-processing-correction', title:'Get a claim processing problem corrected', category:'coverage',
    summary:'Find the specific data or payment mismatch and the team that can fix it.',
    pattern:'A rejection, missing record, unposted payment or deductible calculation can resemble a coverage denial.',
    appliesWhen:'Insurance is involved and the claim status or reason for nonpayment is unclear.',
    verify:['Is this a provider bill, an EOB, or a written denial?', 'Was the claim accepted, returned, awaiting information, partly paid, or denied?', 'Do the latest EOB and bill describe the same services?', 'Which field, record or cost-sharing amount is disputed?'],
    firstMove:{title:'Ask for a specific correction path',steps:['Get the current EOB and itemized provider ledger.', 'Ask the payer to classify the issue and identify the exact missing or incorrect information.', 'Ask the provider to verify the original record and submit a supported correction if needed.', 'Record the formal appeal route and deadline separately.'],draft:'Please explain the current claim status and the precise reason for nonpayment. Is this a processing correction or an adverse coverage decision? Identify what must change, who must submit it, and how I will confirm receipt. Please also identify my separate appeal procedure and deadline.'},
    responses:{
      no_reply:{title:'Confirm receipt and preserve the appeal path',steps:['Request written receipt and a follow-up date from the responsible team.', 'If there is a denial, follow its formal appeal instructions before the stated deadline.'],draft:'I have not received confirmation of this correction request. Please confirm receipt and the next step. I also need the instructions for a formal member appeal; please do not treat this inquiry as a substitute.'},
      more_info:{title:'Match the request to the actual missing evidence',steps:['Ask exactly which record or field is missing.', 'Have its owner send it through the payer’s verified secure channel.', 'Keep receipt evidence locally.'],draft:'Please list the missing information and explain which unresolved issue it addresses. Confirm the secure submission method and whether a separate appeal filing is still required.'},
      denied:{title:'Switch to a documented appeal if coverage remains disputed',steps:['Get the written rationale and applicable plan provision.', 'Choose the denial-evidence route; retain proof of any formal filing.'],draft:'The correction did not resolve this claim. Please provide the written determination, the policy provision applied and the remaining member appeal options.'}
    },
    watchouts:['An EOB is not a bill. Zero plan payment can reflect a deductible.', 'Ask the provider to correct factual errors; do not invent diagnoses or change accurate codes to obtain coverage.', 'A call or corrected claim does not automatically extend a member appeal deadline or suspend billing.'],
    sourceIds:['insurance-wa-correction','insurance-cms-eob','insurance-cms-cost-sharing','insurance-naic-denials','insurance-dol-procedures'],
    triggers:{documentTypes:['bill','eob','denial'],goals:['understand','check','appeal'],coverage:['private']}
  },
  {
    id:'insurance-network-liability', title:'Check who owes a disputed network charge', category:'coverage',
    summary:'Challenge an unexplained transfer of provider or insurer responsibility to you.',
    pattern:'A bill above the EOB, late provider filing or an authorization dispute needs a responsibility check.',
    appliesWhen:'The provider was believed to be in-network and a bill conflicts with the EOB or an administrative denial.',
    verify:['Was this provider and location in-network for the service?', 'Is the EOB final and matched to this bill?', 'What patient responsibility does it actually show?', 'Is the reason late filing, missing authorization, a contract adjustment or a coverage exclusion?', 'Is there saved plan-directory or network-confirmation evidence?'],
    firstMove:{title:'Ask the plan to explain member liability',steps:['Compare the current EOB with payments and adjustments on the provider ledger.', 'Ask whether the disputed amount is patient cost sharing or provider responsibility.', 'For late filing, ask the provider for accepted-claim evidence and its contract-specific correction path.', 'Request a written billing hold; keep the appeal deadline independently.'],draft:'Please reconcile this bill with the current EOB. If the issue is provider filing or authorization compliance, identify the applicable provision that permits charging me. Please have the plan’s provider-relations team clarify responsibility and issue corrected statements if appropriate.'},
    responses:{
      no_reply:{title:'Escalate the responsibility question',steps:['Request a billing supervisor and plan provider-relations review.', 'Preserve the member appeal and any collection-response deadlines.'],draft:'Please route this unresolved patient-responsibility question to a billing supervisor and the plan’s provider-relations team. Confirm any billing hold in writing; I have not assumed one exists.'},
      more_info:{title:'Supply the matching evidence',steps:['Send only the relevant EOB, ledger or network confirmation through verified channels.', 'Ask which item supports charging the disputed amount.'],draft:'Please identify the precise mismatch and the evidence you need. If your network information was incorrect, explain the applicable cost-sharing protection and how to request reprocessing.'},
      denied:{title:'Get the contractual reason before the next escalation',steps:['Request the written basis and applicable member appeal path.', 'If needed, seek help from the regulator responsible for this plan.'],draft:'Please provide the written basis for assigning this amount to me, including the controlling plan or contract provision and the next review process. A general statement that insurance did not pay does not resolve the responsibility question.'}
    },
    watchouts:['Administrative denial does not prove that a debt is invalid; coverage, agreements and law matter.', 'Provider filing limits and member appeal limits are different.', 'Ask for written correction or refund confirmation; do not count an unresolved amount as savings.'],
    sourceIds:['insurance-cms-network-bill','insurance-cms-cost-sharing','insurance-uhc-2026-guide','insurance-cms-directory'],
    triggers:{documentTypes:['bill','eob','denial'],goals:['understand','check','afford','appeal'],coverage:['private']}
  },
  {
    id:'insurance-evidence-appeal', title:'Build an appeal around the actual denial reason', category:'coverage',
    summary:'Connect the plan’s stated requirement to the evidence that answers it.',
    pattern:'A generic complaint may leave the actual coverage or clinical criterion unanswered.',
    appliesWhen:'There is a written private-plan denial that the member disputes.',
    verify:['What is the written reason and policy provision?', 'Is this missing evidence, medical necessity, an exclusion or another issue?', 'Which records and criteria did the reviewer use?', 'Has a clinician confirmed urgency or offered supporting evidence?', 'What appeal level, channel and deadline does the notice specify?'],
    firstMove:{title:'Request the reasoning and assemble a focused appeal',steps:['Obtain the denial, governing plan terms and relevant claim file; ask about free access rights.', 'Where ERISA applies, request relevant retained call recordings or transcripts as part of that file.', 'Ask the clinician to address the specific criterion using existing records when appropriate.', 'Submit the member appeal through the required channel and retain receipt proof.', 'Ask whether any peer discussion changes the decision or counts as an appeal.'],draft:'I am appealing the decision described in the attached notice. My requested correction is [state it]. The supporting evidence is [list the records]. Please explain [the disputed criterion] and provide the relevant claim file. Confirm receipt as a formal member appeal and identify any missing filing requirement.'},
    responses:{
      no_reply:{title:'Check the formal appeal was received',steps:['Distinguish a records request from an accepted appeal.', 'Seek plan-administrator or regulator help with an unresolved procedural delay.'],draft:'Please confirm whether my submission is recorded as a formal appeal, its received date and the response deadline. If it is incomplete, specify the missing requirement promptly.'},
      more_info:{title:'Answer each stated gap',steps:['Match each requested item to an actual record or clinician response.', 'Confirm the supplement arrived and whether deadlines changed in writing.'],draft:'Please identify each remaining evidentiary gap and the criterion it relates to. I am requesting a targeted response from my clinician. Confirm how supplemental material will be included in the review.'},
      denied:{title:'Check remaining review rights',steps:['Obtain the final rationale and notice of remaining internal or external review.', 'Check eligibility and the applicable filing deadline before requesting independent review.'],draft:'Please provide the final reason, any new evidence or rationale relied on, and the instructions for the next available review. Identify whether independent external review is available for this decision.'}
    },
    watchouts:['Do not let a records request delay a required appeal; clinicians must support clinical arguments and urgency.', 'Prior authorization alone is not a payment guarantee.', 'A peer discussion, records request or phone call may not satisfy formal appeal requirements.', 'External review does not cover every disagreement.'],
    sourceIds:['insurance-dol-claim-file','insurance-dol-fiduciary','insurance-dol-recordings','insurance-healthcare-internal','insurance-healthcare-external','insurance-healthcare-preauth','insurance-naic-denials','insurance-uhc-2026-guide'],
    triggers:{documentTypes:['denial','eob','bill'],goals:['appeal','check','understand'],coverage:['private'],anyOf:[{documentType:'denial'},{claimStatus:'denied'},{goal:'appeal'}]}
  },
  {
    id:'insurance-plan-escalation', title:'Find the authority responsible for your plan', category:'coverage',
    summary:'Confirm funding and plan type before escalating an unresolved denial.',
    pattern:'The company on an insurance card may administer claims without funding them.',
    appliesWhen:'An employer-plan dispute is unresolved or its review process is unclear.',
    verify:['Is the arrangement fully insured, self-funded, mixed or unknown?', 'Is the sponsor private, government or religious?', 'Who is the named plan administrator?', 'Which plan documents and claims procedures are available?', 'What formal appeals have been filed or decided?'],
    firstMove:{title:'Get the plan’s identity and review map',steps:['Request the current plan description, controlling coverage terms and claims procedures.', 'Ask the administrator to confirm funding, applicable protections and the next review body.', 'Use state insurance assistance for an insured-policy issue, EBSA for applicable private ERISA issues, or the appropriate government-plan process.', 'Keep formal filings active while seeking help.'],draft:'Please identify the named plan administrator, whether this coverage is insured or self-funded, and whether ERISA applies. Please provide the governing benefit and claims documents and identify the proper appeal and external-review process. I only need plan-level information from my employer’s benefits contact.'},
    responses:{
      no_reply:{title:'Ask the appropriate assistance office to help identify the plan',steps:['Use plan documents and the denial notice to request routing help.', 'Keep proof of prior requests and preserve the member filing deadline.'],draft:'I need help identifying the correct authority and review process. The administrator has not answered my plan-level request. Please explain your jurisdiction and any additional routing information needed.'},
      more_info:{title:'Share a focused procedural record',steps:['Provide the denial, plan details and appeal history only through the recipient’s secure channel.', 'Keep medical narratives out of ordinary HR correspondence.'],draft:'Please identify the documents needed to determine your authority or review this procedural issue. I will submit any necessary claim material directly through the designated secure process.'},
      denied:{title:'Request the next available route',steps:['Ask whether this is a jurisdiction decision, a complaint closure or a benefit determination.', 'Follow the appropriate remaining appeal, external review or legal-assistance path.'],draft:'Please explain whether this response decides benefits or only closes your assistance review. Identify any remaining appeal, independent review or other process and its filing requirements.'}
    },
    watchouts:['Government and church arrangements are not automatically ERISA plans.', 'A regulator complaint is not automatically a formal benefit appeal.', 'A plan-specific exception can be requested, but approval is discretionary unless an applicable right is established.', 'GoldRock does not send case details to an employer; choosing to contact a plan fiduciary can disclose details to that recipient.'],
    sourceIds:['insurance-wa-jurisdiction','insurance-cms-government','insurance-dol-claim-file','insurance-dol-fiduciary','insurance-healthcare-external'],
    triggers:{documentTypes:['bill','eob','denial','estimate'],goals:['understand','check','appeal','plan'],coverage:['private']}
  }
];

// price-routes.js: 1cdb957b7b0de14bcd4e872612ee44d38cd997d86a4b489e0c1d1ad587996057
/** Reviewed public education. These are preparation routes, not price or coverage decisions. */
const priceSources = [
  { id:'cms-hospital-price-consumers', title:'Use hospital price transparency', url:'https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency/consumers', publisher:'CMS', applicability:'Published hospital standard charges and scheduled services; confirm the matching service and setting.', summary:'Public cash and negotiated charges are useful comparison inputs; request an estimate for the actual care.' },
  { id:'cms-price-faq', title:'Hospital price transparency: limits of standard charges', url:'https://www.cms.gov/files/document/hospital-price-transparency-frequently-asked-questions.pdf', publisher:'CMS', applicability:'Hospital standard-charge information; this does not determine a particular patient’s responsibility.', summary:'A standard charge is neither an individual out-of-pocket obligation nor a guaranteed price.' },
  { id:'cms-provider-bill-conversation', title:'Discuss a medical bill with your provider', url:'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/medical-bill-guides-resources/talk-your-provider-about-your-medical-bill', publisher:'CMS', applicability:'Provider billing discussion and requested reductions; no guaranteed discount or payment hold.', summary:'Use specific charges and written questions to discuss an unexplained or unaffordable bill.' },
];
const priceRoutes = [{
  id:'compare-real-cost', title:'A lower cash price caught my eye', category:'before-care',
  summary:'Compare the same included services and your full cost before choosing a payment route.',
  pattern:'A headline price may omit another biller or differ from the amount you would owe using insurance.',
  appliesWhen:'For planned, non-urgent care or a question about a listed price. A comparison does not establish that an existing bill is wrong.',
  verify:['Same service, code, setting and included billers?', 'Does the quote use insurance or require self-pay?', 'If you can use insurance, what does the plan estimate you would owe?', 'Which services, fees or complications are excluded?'],
  firstMove:{title:'Compare like-for-like written estimates',steps:['Ask the provider to itemize the offer and included services.', 'If using insurance, ask your plan for your estimated share and how choosing self-pay affects deductible or out-of-pocket credit.', 'If uninsured or not using insurance, ask about a good faith estimate and clarify separate providers’ charges.', 'Match services and exclusions before comparing the quoted totals.'],draft:'Please itemize the quoted services, separate billers and exclusions. If I can use insurance, I will compare the plan’s estimate and ask about deductible or out-of-pocket credit. If I will not use insurance, please explain the good faith estimate process and which separate providers I should contact.'},
  responses:{
    no_reply:{title:'Ask the right estimate team',steps:['Request the provider’s estimate or financial-counseling team.', 'Use the official published pricing page as a question, preserving its service description.'],draft:'I need clarification of the quoted services and my payment options. Please route this to the team that can provide a written estimate.'},
    more_info:{title:'Resolve the comparison gaps',steps:['List services included on one quote but missing from the other.', 'Ask the clinician or scheduler to confirm the planned service without changing care solely for price.'],draft:'These estimates appear to include different services. Please identify what is missing and which clinicians may bill separately.'},
    denied:{title:'Separate a refused discount from an error',steps:['Ask which term makes the advertised price inapplicable.', 'For an existing bill, consider assistance or an accuracy review separately.', 'For future care, discuss clinically appropriate alternatives with your clinician.'],draft:'Please explain which condition of the published price does not match my care. If a reduction is unavailable, please provide the assistance policy and direct payment-plan options.'},
  },
  watchouts:['Published standard charges do not automatically replace a bill.', 'Do not delay urgent care for price comparison.', 'An estimate and prior authorization do not guarantee coverage or a final price.'],
  sourceIds:['cms-hospital-price-consumers','cms-price-faq','cms-provider-bill-conversation','cms-price-transparency','healthcare-preauthorization','cms-gfe-dispute'],
  triggers:{documentTypes:['estimate'],goals:['plan'],coverage:['private','uninsured','self_pay']},
}];

// knowledge-concepts.js: 36b9aa56fc2862d13758521706970284715e5ae3f0f31fca5e3316e7ef8454b4
/** Reviewed public consumer knowledge,2026-09-27. Original questions and evidence checklists; no member data or outbound actions. */
const knowledgeSources = [
  {
    "id": "knowledge-cms-repeat-services",
    "title": "Repeat or duplicate services on the same day",
    "publisher": "CMS Medicare Coverage Database / Palmetto GBA",
    "url": "https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=53482",
    "applicability": "Medicare contractor guidance, not a universal private-plan coding rule. Used only to explain why repeated codes require context.",
    "summary": "Separate real services and claim corrections can require different billing treatment; a repeated code alone does not establish duplicate billing."
  },
  {
    "id": "knowledge-cms-notice-consent",
    "title": "When surprise-billing notice and consent can apply",
    "publisher": "CMS",
    "url": "https://www.cms.gov/files/document/nsa-notice-and-consent-guidelines.pdf",
    "applicability": "Applicable No Surprises Act coverage/settings; clinical status, service type, notice procedure and state rules must be confirmed.",
    "summary": "A signature does not universally waive protections. Emergency and specified ancillary services have restrictions on the notice-and-consent exception."
  },
  {
    "id": "knowledge-cms-selfpay-estimate",
    "title": "Medical-bill rights when not using insurance",
    "publisher": "CMS",
    "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-medical-bill-rights/know-your-medical-bill-rights-when-not-using-insurance",
    "applicability": "Uninsured or self-pay care, with scheduling/request conditions; emergency care and separate billers need separate consideration.",
    "summary": "Written advance estimates help compare expected charges with later bills; verify which provider and services each estimate covers."
  }
];

const knowledgeConcepts = [
  {
    "id": "eob-is-explanation",
    "category": "bill",
    "title": "An EOB is not a payment request",
    "question": "Do I pay the amount shown on this EOB?",
    "summary": "Use the insurer’s explanation to check a matching provider statement.",
    "mechanism": "Insurance processing and provider billing are separate records.",
    "actions": [
      "Identify the sender and document heading.",
      "Match the service and provider before comparing balances."
    ],
    "verify": [
      "Is there an actual provider bill?",
      "Does the EOB describe the same care?"
    ],
    "avoid": [
      "Do not count an EOB and bill as two separate debts."
    ],
    "evidence": [
      "Current EOB",
      "Matching provider statement"
    ],
    "completion": [
      "Document type and matching statement are identified."
    ],
    "sourceIds": [
      "cms-eob"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "unknown"
    ],
    "documentTypes": [
      "eob",
      "bill",
      "unknown"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "eob",
      "explanation",
      "owe",
      "pay",
      "statement"
    ],
    "kind": "general",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          60,
          63
        ]
      }
    ]
  },
  {
    "id": "charges-allowed-share",
    "category": "coverage",
    "title": "Charged, allowed and owed are different",
    "question": "Why does the billed amount differ from the allowed amount?",
    "summary": "Read each amount by its role rather than treating the largest number as your balance.",
    "mechanism": "Plan adjustments, insurer payment and member cost sharing affect different columns.",
    "actions": [
      "Label the charge, allowed amount, plan payment and member share.",
      "Ask the plan to explain an unclear column."
    ],
    "verify": [
      "Same claim and version?",
      "Are existing patient payments shown elsewhere?"
    ],
    "avoid": [
      "Do not subtract an allowed amount as though it were a payment."
    ],
    "evidence": [
      "EOB amount columns",
      "Provider payment ledger"
    ],
    "completion": [
      "Each entered amount has a confirmed meaning."
    ],
    "sourceIds": [
      "insurance-cms-eob"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid"
    ],
    "documentTypes": [
      "eob",
      "bill"
    ],
    "goals": [
      "understand",
      "check",
      "afford"
    ],
    "tags": [
      "allowed",
      "charge",
      "contracted",
      "responsibility",
      "columns"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          783,
          791
        ]
      }
    ]
  },
  {
    "id": "zero-payment-deductible",
    "category": "coverage",
    "title": "Zero paid does not always mean denied",
    "question": "Did insurance deny my claim because it paid nothing?",
    "summary": "Ask whether the claim was covered but allocated to your deductible.",
    "mechanism": "Coverage status and the dollar amount paid are different questions.",
    "actions": [
      "Read the status and explanatory codes.",
      "Ask which deductible or cost-sharing rule produced the amount."
    ],
    "verify": [
      "Processed, pending or denied?",
      "Which benefit-year accumulator was used?"
    ],
    "avoid": [
      "Do not infer denial from zero plan payment."
    ],
    "evidence": [
      "EOB status and remarks",
      "Plan explanation of deductible allocation"
    ],
    "completion": [
      "Plan confirms the status and calculation or identifies a correction."
    ],
    "sourceIds": [
      "insurance-cms-cost-sharing"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid"
    ],
    "documentTypes": [
      "eob",
      "bill"
    ],
    "goals": [
      "understand",
      "check",
      "appeal"
    ],
    "tags": [
      "zero",
      "deductible",
      "nothing",
      "paid",
      "denied"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          783,
          786
        ]
      }
    ]
  },
  {
    "id": "latest-eob-payments",
    "category": "bill",
    "title": "Compare the latest EOB and posted payments",
    "question": "Why is the bill different from my EOB?",
    "summary": "Check document versions and payment posting before calling a mismatch an error.",
    "mechanism": "An older determination or missing credit can create an apparent difference.",
    "actions": [
      "Ask whether the claim was reprocessed.",
      "Request a ledger showing payments and adjustments against the current bill."
    ],
    "verify": [
      "Same service and biller?",
      "Is either record superseded?"
    ],
    "avoid": [
      "A difference alone is not confirmed overbilling."
    ],
    "evidence": [
      "Newest EOB",
      "Dated statements",
      "Payment receipt"
    ],
    "completion": [
      "Provider or plan reconciles the difference in writing."
    ],
    "sourceIds": [
      "insurance-cms-network-bill"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid"
    ],
    "documentTypes": [
      "bill",
      "eob"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "revised",
      "corrected",
      "eob",
      "payment",
      "mismatch",
      "credit"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          797,
          805
        ]
      }
    ]
  },
  {
    "id": "itemized-ledger",
    "category": "bill",
    "title": "Ask for the ledger behind the total",
    "question": "What should I request when a bill only gives one number?",
    "summary": "Ask for itemized charges and the account’s payment-and-adjustment history.",
    "mechanism": "A total does not reveal which entry needs correction.",
    "actions": [
      "Request line-level services, units and amounts.",
      "Identify one unexplained charge, missing payment or adjustment."
    ],
    "verify": [
      "Does the ledger cover this statement?",
      "Have all known payments posted?"
    ],
    "avoid": [
      "Do not treat missing detail as proof the debt disappears."
    ],
    "evidence": [
      "Itemized statement",
      "Account ledger",
      "Your receipts"
    ],
    "completion": [
      "The balance can be traced to specific entries."
    ],
    "sourceIds": [
      "cfpb-medical-debt"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "unknown"
    ],
    "goals": [
      "understand",
      "check",
      "afford"
    ],
    "tags": [
      "itemized",
      "ledger",
      "breakdown",
      "charges",
      "receipt"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          783,
          805
        ]
      }
    ]
  },
  {
    "id": "duplicate-statement-or-charge",
    "category": "bill",
    "title": "A second notice may be the same balance",
    "question": "Was I billed twice, or sent a reminder?",
    "summary": "Compare the underlying charge and ledger before adding two statements together.",
    "mechanism": "Repeated paperwork and repeated service entries are different issues.",
    "actions": [
      "Match biller, care and statement history locally.",
      "Ask whether the later notice replaces or adds a charge."
    ],
    "verify": [
      "Same episode and balance?",
      "New charge or carried balance?"
    ],
    "avoid": [
      "Do not label a reminder as a second debt."
    ],
    "evidence": [
      "Both notices",
      "Itemized account ledger"
    ],
    "completion": [
      "The provider identifies replacement notices or confirms a duplicate entry."
    ],
    "sourceIds": [
      "cms-read-medical-bill"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill"
    ],
    "goals": [
      "understand",
      "check"
    ],
    "tags": [
      "duplicate",
      "twice",
      "second",
      "reminder",
      "statement"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          56,
          65
        ]
      }
    ]
  },
  {
    "id": "repeat-code-context",
    "category": "bill",
    "title": "Matching codes need service context",
    "question": "Do repeated procedure codes prove duplicate billing?",
    "summary": "Ask what distinguishes the services; matching codes alone are insufficient.",
    "mechanism": "Real repeat services and modifier details can affect claim processing. Medicare guidance illustrates this; other plans differ.",
    "actions": [
      "Ask billing staff to explain each line using the actual record.",
      "Request correction only if the record supports an error."
    ],
    "verify": [
      "Same time, provider and service?",
      "Are units or modifiers omitted from the statement?"
    ],
    "avoid": [
      "Do not invent a diagnosis or modifier to obtain payment."
    ],
    "evidence": [
      "Itemized lines",
      "Provider’s service explanation"
    ],
    "completion": [
      "Each repeat is explained or a corrected statement is issued."
    ],
    "sourceIds": [
      "knowledge-cms-repeat-services"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "eob"
    ],
    "goals": [
      "understand",
      "check",
      "appeal"
    ],
    "tags": [
      "duplicate",
      "code",
      "modifier",
      "units",
      "repeat",
      "coding"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          673,
          674
        ]
      }
    ]
  },
  {
    "id": "separate-billers",
    "category": "bill",
    "title": "One visit can produce several bills",
    "question": "Why did another clinician or facility send a bill?",
    "summary": "Identify each billing entity before deciding whether charges overlap.",
    "mechanism": "One episode can involve separately billed services.",
    "actions": [
      "List the facility and professional billers.",
      "Ask each to identify its service and related claim."
    ],
    "verify": [
      "Different biller or same account?",
      "Which service does each amount cover?"
    ],
    "avoid": [
      "Different envelopes do not prove duplicate care."
    ],
    "evidence": [
      "Statements from each entity",
      "Matching EOBs or estimates"
    ],
    "completion": [
      "The scope of each bill is documented."
    ],
    "sourceIds": [
      "cms-read-medical-bill"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "eob",
      "estimate"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "facility",
      "professional",
      "anesthesia",
      "radiology",
      "multiple",
      "separate"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          65,
          69
        ]
      }
    ]
  },
  {
    "id": "assistance-policy-first",
    "category": "assistance",
    "title": "Get the actual assistance policy",
    "question": "How do I know which financial-assistance rules apply?",
    "summary": "Start with the exact hospital’s policy, application and covered-provider list.",
    "mechanism": "Assistance depends on that facility’s rules and the care being billed.",
    "actions": [
      "Obtain the current policy and plain-language summary.",
      "Ask which application path fits your bill."
    ],
    "verify": [
      "Correct facility and care?",
      "Current policy and submission channel?"
    ],
    "avoid": [
      "Do not infer eligibility from a generic income threshold."
    ],
    "evidence": [
      "Official policy",
      "Application checklist"
    ],
    "completion": [
      "You have the correct policy and a complete list of required items."
    ],
    "sourceIds": [
      "irs-financial-assistance"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "estimate"
    ],
    "goals": [
      "afford",
      "plan",
      "check"
    ],
    "tags": [
      "charity",
      "financial assistance",
      "fap",
      "policy",
      "application"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          63
        ]
      }
    ]
  },
  {
    "id": "insured-assistance",
    "category": "assistance",
    "title": "Insurance does not answer the assistance question",
    "question": "Can I ask for financial help if I have insurance?",
    "summary": "Ask whether the provider’s program includes insured patients and remaining cost sharing.",
    "mechanism": "Having coverage does not by itself settle program eligibility.",
    "actions": [
      "Ask for the insured-patient criteria.",
      "Request the official review rather than relying on a verbal assumption."
    ],
    "verify": [
      "Which balance remains yours?",
      "What household or hardship criteria apply?"
    ],
    "avoid": [
      "Do not promise a waiver because the bill is unaffordable."
    ],
    "evidence": [
      "Assistance policy",
      "Current patient balance"
    ],
    "completion": [
      "A policy-based eligibility answer or application path is documented."
    ],
    "sourceIds": [
      "cfpb-assistance-steps"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid"
    ],
    "documentTypes": [
      "bill",
      "estimate"
    ],
    "goals": [
      "afford",
      "plan"
    ],
    "tags": [
      "insured",
      "deductible",
      "copay",
      "coinsurance",
      "charity"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "assistance-excluded-biller",
    "category": "assistance",
    "title": "Check which clinicians the hospital policy covers",
    "question": "Does hospital charity care include the separate doctor’s bill?",
    "summary": "Use the covered-provider list; one approval may not cover every biller.",
    "mechanism": "Hospital and independent-practice assistance can have different scopes.",
    "actions": [
      "Match the exact billing entity to the policy list.",
      "Ask an excluded practice about its own assistance."
    ],
    "verify": [
      "Which entity issued this bill?",
      "Does the policy include this service/provider?"
    ],
    "avoid": [
      "Do not apply one approval automatically to another account."
    ],
    "evidence": [
      "Covered-provider list",
      "Separate statement",
      "Approval letter"
    ],
    "completion": [
      "Coverage is confirmed separately for each balance."
    ],
    "sourceIds": [
      "irs-fap-provider-list"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "estimate"
    ],
    "goals": [
      "afford",
      "plan",
      "check"
    ],
    "tags": [
      "excluded",
      "provider list",
      "doctor",
      "anesthesia",
      "hospital charity"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "partial-discount-review",
    "category": "assistance",
    "title": "A discount may not be the final assistance review",
    "question": "They reduced the bill a little. Can I request a fuller review?",
    "summary": "Ask whether the reduction was a policy determination or a limited automatic discount.",
    "mechanism": "For covered tax-exempt hospitals, presumptive reductions and full applications can follow different procedures.",
    "actions": [
      "Ask which assistance category was applied.",
      "Request the route to submit information for a more generous determination."
    ],
    "verify": [
      "Which hospital/policy applies?",
      "Was a complete application reviewed?"
    ],
    "avoid": [
      "Do not assume every discount entitles you to a larger one."
    ],
    "evidence": [
      "Discount notice",
      "Policy criteria",
      "Application record"
    ],
    "completion": [
      "A written decision states the reviewed assistance category."
    ],
    "sourceIds": [
      "irs-fap-final-regulations"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill"
    ],
    "goals": [
      "afford",
      "check"
    ],
    "tags": [
      "partial",
      "discount",
      "presumptive",
      "reconsideration",
      "hardship"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "assistance-missing-information",
    "category": "assistance",
    "title": "Make an incomplete application actionable",
    "question": "They say my assistance application is incomplete. What next?",
    "summary": "Turn a vague request into an exact missing-item checklist.",
    "mechanism": "A pending review is different from a completed denial.",
    "actions": [
      "Ask which item is missing and its accepted format.",
      "Submit only relevant copies through the verified channel and keep receipt."
    ],
    "verify": [
      "What deadline is stated?",
      "Is the request an incompleteness notice or final decision?"
    ],
    "avoid": [
      "Do not assume billing is paused while documents are gathered."
    ],
    "evidence": [
      "Missing-item notice",
      "Submission receipt",
      "Policy instructions"
    ],
    "completion": [
      "The office confirms completeness or identifies the remaining item."
    ],
    "sourceIds": [
      "cfpb-assistance-steps"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill"
    ],
    "goals": [
      "afford",
      "check"
    ],
    "tags": [
      "incomplete",
      "missing documents",
      "application",
      "receipt",
      "follow up"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          64,
          65
        ]
      }
    ]
  },
  {
    "id": "correction-or-appeal",
    "category": "coverage",
    "title": "Separate claim correction from a coverage appeal",
    "question": "Should the provider resend a claim, or should I appeal?",
    "summary": "First identify whether information is wrong/missing or a coverage decision is disputed.",
    "mechanism": "Those questions can require different teams and parallel procedures.",
    "actions": [
      "Ask for the precise claim status and reason.",
      "Confirm the member-appeal instructions independently of any correction request."
    ],
    "verify": [
      "Accepted, returned, pending or denied?",
      "Who can correct the specific item?"
    ],
    "avoid": [
      "A phone call or resubmission may not preserve appeal rights."
    ],
    "evidence": [
      "Written claim status",
      "EOB or denial notice"
    ],
    "completion": [
      "Correction ownership and any formal appeal path are separately recorded."
    ],
    "sourceIds": [
      "insurance-wa-correction"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "bill",
      "eob",
      "denial"
    ],
    "goals": [
      "understand",
      "check",
      "appeal"
    ],
    "tags": [
      "rejection",
      "returned",
      "processing",
      "correction",
      "resubmit",
      "appeal"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "denial-plan-criterion",
    "category": "coverage",
    "title": "Ask for the precise rule behind a denial",
    "question": "What does “not covered” actually mean for this decision?",
    "summary": "Tie the stated reason to the governing plan provision and the evidence reviewed.",
    "mechanism": "A general complaint may miss the criterion that drove the decision.",
    "actions": [
      "Request the written rationale and relevant plan terms.",
      "Organize your response around the disputed requirement."
    ],
    "verify": [
      "Which denial and appeal level?",
      "Missing information, exclusion or clinical judgment?"
    ],
    "avoid": [
      "Do not infer bad faith merely from a denial."
    ],
    "evidence": [
      "Denial notice",
      "Plan provision",
      "Relevant supporting record"
    ],
    "completion": [
      "The appeal answers the actual disputed requirement."
    ],
    "sourceIds": [
      "healthcare-appeals"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial",
      "eob",
      "bill"
    ],
    "goals": [
      "appeal",
      "check",
      "understand"
    ],
    "tags": [
      "denial",
      "reason",
      "criterion",
      "exclusion",
      "policy",
      "appeal"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          673,
          674
        ]
      }
    ]
  },
  {
    "id": "claim-file-access",
    "category": "coverage",
    "title": "Request the relevant claim file",
    "question": "What evidence did the reviewer use?",
    "summary": "Ask about access to the records and criteria relevant to your determination.",
    "mechanism": "ERISA-covered plans have specific disclosure procedures; other coverage needs its own rules.",
    "actions": [
      "Request the relevant file through the plan’s stated process.",
      "Continue any required appeal filing while awaiting records."
    ],
    "verify": [
      "Does ERISA apply?",
      "Which records or criteria address this denial?"
    ],
    "avoid": [
      "Do not wait past an appeal deadline for a records response."
    ],
    "evidence": [
      "Denial notice",
      "Records request",
      "Delivered claim file"
    ],
    "completion": [
      "You can identify what the reviewer relied on and what remains missing."
    ],
    "sourceIds": [
      "insurance-dol-claim-file"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial",
      "eob"
    ],
    "goals": [
      "appeal",
      "check"
    ],
    "tags": [
      "claim file",
      "records",
      "guidelines",
      "criteria",
      "disclosure"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          673,
          674
        ]
      }
    ]
  },
  {
    "id": "relevant-call-recording",
    "category": "coverage",
    "title": "Relevant retained calls may be claim evidence",
    "question": "Can I request the call recording about my denied benefit?",
    "summary": "For an ERISA claim, ask whether a retained recording or transcript is relevant claim material.",
    "mechanism": "A quality-assurance label alone does not settle relevance.",
    "actions": [
      "Identify the call locally by date and topic.",
      "Request its inclusion with relevant claim records."
    ],
    "verify": [
      "Is a recording or transcript retained?",
      "How does it relate to the determination?"
    ],
    "avoid": [
      "Do not claim entitlement to every company recording or require one to be created."
    ],
    "evidence": [
      "Your call log",
      "Claim-file request",
      "Plan response"
    ],
    "completion": [
      "Relevant retained material is supplied or its exclusion is explained."
    ],
    "sourceIds": [
      "insurance-dol-recordings"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial"
    ],
    "goals": [
      "appeal",
      "check"
    ],
    "tags": [
      "call",
      "recording",
      "transcript",
      "quality assurance",
      "claim file"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          673,
          674
        ]
      }
    ]
  },
  {
    "id": "clinical-appeal-evidence",
    "category": "coverage",
    "title": "Ask the clinician to address the denial criterion",
    "question": "How can my clinician help with a medical-necessity denial?",
    "summary": "Request a targeted response using the actual clinical record.",
    "mechanism": "A reviewer needs evidence addressing the stated reason, not invented symptoms.",
    "actions": [
      "Share the exact denial criterion with the treating team.",
      "Confirm how supporting material enters the member appeal."
    ],
    "verify": [
      "What clinical issue was disputed?",
      "Has a clinician confirmed urgency?"
    ],
    "avoid": [
      "Do not invent diagnoses or assume peer discussion replaces an appeal."
    ],
    "evidence": [
      "Denial rationale",
      "Clinician’s response",
      "Submission receipt"
    ],
    "completion": [
      "The formal review file contains the targeted supporting evidence."
    ],
    "sourceIds": [
      "insurance-naic-denials"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial"
    ],
    "goals": [
      "appeal"
    ],
    "tags": [
      "medical necessity",
      "clinician",
      "peer to peer",
      "clinical",
      "urgent"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          81,
          81
        ]
      }
    ]
  },
  {
    "id": "formal-appeal-receipt",
    "category": "coverage",
    "title": "Confirm that an appeal was actually filed",
    "question": "Does my call or complaint count as a formal appeal?",
    "summary": "Get confirmation of the filing route, receipt and review level.",
    "mechanism": "Informal inquiries and benefit claims are not interchangeable.",
    "actions": [
      "Use the notice’s formal submission instructions.",
      "Keep proof and ask whether any filing requirement is missing."
    ],
    "verify": [
      "Which submission was accepted as the appeal?",
      "What deadline does the actual notice state?"
    ],
    "avoid": [
      "Do not infer deadline extensions from an open complaint or promised callback."
    ],
    "evidence": [
      "Denial instructions",
      "Submitted appeal",
      "Receipt confirmation"
    ],
    "completion": [
      "The plan confirms a formal appeal and its recorded receipt."
    ],
    "sourceIds": [
      "insurance-dol-procedures"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial",
      "eob",
      "bill"
    ],
    "goals": [
      "appeal"
    ],
    "tags": [
      "deadline",
      "receipt",
      "formal",
      "appeal",
      "phone call",
      "complaint"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          64,
          65
        ]
      }
    ]
  },
  {
    "id": "plan-funding-authority",
    "category": "coverage",
    "title": "The card logo does not identify the regulator",
    "question": "Who can help with an employer-plan dispute?",
    "summary": "Confirm funding, sponsor type and administrator before escalating.",
    "mechanism": "A claims administrator may process benefits without insuring them.",
    "actions": [
      "Request plan-level funding and administrator information.",
      "Ask which authority handles this plan and issue."
    ],
    "verify": [
      "Fully insured or self-funded?",
      "Private, government or religious employer?"
    ],
    "avoid": [
      "Do not send medical narratives to ordinary HR correspondence.",
      "Do not assume every employer plan is ERISA-covered."
    ],
    "evidence": [
      "Plan description",
      "Administrator response",
      "Denial review instructions"
    ],
    "completion": [
      "The correct review body and plan process are identified."
    ],
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-cms-government"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial",
      "bill",
      "eob",
      "estimate"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "self funded",
      "erisa",
      "administrator",
      "regulator",
      "employer",
      "ebsa"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          203,
          203
        ]
      }
    ]
  },
  {
    "id": "network-administrative-liability",
    "category": "coverage",
    "title": "Ask why a filing problem became your balance",
    "question": "Must I pay because an in-network provider filed late?",
    "summary": "Ask for the contract/plan basis for assigning that amount to you.",
    "mechanism": "Provider filing rules and member responsibility are separate questions; agreements differ.",
    "actions": [
      "Ask the plan to identify member liability and provider-relations review.",
      "Ask the provider for accepted-claim evidence and its correction route."
    ],
    "verify": [
      "Network status for the service?",
      "What does the current EOB assign to the member?"
    ],
    "avoid": [
      "A filing denial does not automatically invalidate every debt."
    ],
    "evidence": [
      "Current EOB",
      "Provider’s filing explanation",
      "Applicable plan/contract response"
    ],
    "completion": [
      "Responsibility is explained or corrected in writing."
    ],
    "sourceIds": [
      "insurance-uhc-2026-guide",
      "insurance-cms-network-bill"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "bill",
      "eob",
      "denial"
    ],
    "goals": [
      "check",
      "appeal",
      "understand"
    ],
    "tags": [
      "timely filing",
      "late claim",
      "in network",
      "provider responsibility",
      "authorization"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "authorization-not-guarantee",
    "category": "coverage",
    "title": "Authorization is one part of coverage",
    "question": "Why can I owe money after prior authorization?",
    "summary": "Verify the authorization scope and the separate payment conditions.",
    "mechanism": "Prior authorization alone does not guarantee payment.",
    "actions": [
      "Match approved service, provider and validity period locally.",
      "Ask which remaining benefit or billing condition affected payment."
    ],
    "verify": [
      "Does the performed care match the approval?",
      "Is this denial or ordinary cost sharing?"
    ],
    "avoid": [
      "Do not treat approval as a guaranteed zero balance."
    ],
    "evidence": [
      "Authorization notice",
      "EOB",
      "Coverage terms"
    ],
    "completion": [
      "The remaining condition or correction path is identified."
    ],
    "sourceIds": [
      "healthcare-preauthorization"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid"
    ],
    "documentTypes": [
      "estimate",
      "bill",
      "eob",
      "denial"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "preauthorization",
      "prior authorization",
      "approved",
      "referral",
      "guarantee"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          63
        ]
      }
    ]
  },
  {
    "id": "external-review-fit",
    "category": "coverage",
    "title": "Check whether independent review fits the denial",
    "question": "Can someone outside the insurer review this decision?",
    "summary": "Use the applicable final notice to confirm external-review eligibility and procedure.",
    "mechanism": "Not every billing disagreement qualifies for external review.",
    "actions": [
      "Identify remaining internal steps or a qualifying exception.",
      "Ask about expedited review when a clinician supports urgency."
    ],
    "verify": [
      "Which denial type and plan process?",
      "What filing requirements and deadline apply?"
    ],
    "avoid": [
      "Do not calculate a universal deadline from a generic article."
    ],
    "evidence": [
      "Final notice",
      "Appeal history",
      "Supporting records"
    ],
    "completion": [
      "Eligibility, destination and filing requirements are confirmed."
    ],
    "sourceIds": [
      "healthcare-external-review"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "denial",
      "eob"
    ],
    "goals": [
      "appeal"
    ],
    "tags": [
      "external",
      "independent",
      "review",
      "final denial",
      "expedited"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "surprise-bill-scope",
    "category": "coverage",
    "title": "Check the setting before invoking surprise-billing protections",
    "question": "Does this unexpected out-of-network bill have special protections?",
    "summary": "Confirm the coverage, care setting and provider role first.",
    "mechanism": "Federal protections apply to specified situations, not every expensive bill.",
    "actions": [
      "Identify emergency care, an in-network facility visit or air ambulance.",
      "Ask the plan how the claim was processed under applicable protections."
    ],
    "verify": [
      "What coverage was used?",
      "Which facility and clinician were in-network?"
    ],
    "avoid": [
      "A high deductible alone does not establish a violation."
    ],
    "evidence": [
      "EOB",
      "Provider statement",
      "Network confirmation"
    ],
    "completion": [
      "The plan explains the protection and cost-sharing determination."
    ],
    "sourceIds": [
      "cms-no-surprises"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "bill",
      "eob",
      "denial"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "surprise",
      "balance billing",
      "out of network",
      "emergency",
      "protections"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "notice-consent-limits",
    "category": "coverage",
    "title": "A signature is not a universal waiver",
    "question": "They say I signed away my surprise-billing protections. Is that enough?",
    "summary": "Request the actual notice and consent, then check whether the exception was available.",
    "mechanism": "Emergency-before-stabilization and specified ancillary services have restrictions; post-stabilization exceptions require additional conditions.",
    "actions": [
      "Obtain the form and the provider’s explanation.",
      "Ask the plan or CMS which requirements apply to this service."
    ],
    "verify": [
      "Emergency, post-stabilization or non-emergency care?",
      "Ancillary service or other provider?",
      "Was the required procedure followed?"
    ],
    "avoid": [
      "Do not treat a general financial-responsibility signature as automatic valid waiver."
    ],
    "evidence": [
      "Signed form",
      "Service context",
      "Plan response"
    ],
    "completion": [
      "Applicability is evaluated against the actual form and care."
    ],
    "sourceIds": [
      "knowledge-cms-notice-consent"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "bill",
      "eob",
      "denial",
      "estimate"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "waiver",
      "consent",
      "signature",
      "ancillary",
      "anesthesiology",
      "stabilized"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "ambulance-ground-air",
    "category": "coverage",
    "title": "Ground and air ambulance need different checks",
    "question": "Are ambulance bills covered by the same surprise-billing rule?",
    "summary": "Identify the transport type before choosing a route.",
    "mechanism": "Federal surprise-billing treatment differs for ground and air ambulance; state and plan rules also matter.",
    "actions": [
      "Ask the plan which transport benefit and protections apply.",
      "For ground transport, check the relevant state process."
    ],
    "verify": [
      "Ground or air?",
      "What coverage and jurisdiction apply?"
    ],
    "avoid": [
      "Do not apply the air-ambulance route automatically to ground transport."
    ],
    "evidence": [
      "Transport bill",
      "EOB",
      "Plan/state response"
    ],
    "completion": [
      "The correct transport-specific review route is identified."
    ],
    "sourceIds": [
      "cms-no-surprises"
    ],
    "coverage": [
      "private"
    ],
    "documentTypes": [
      "bill",
      "eob",
      "denial"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal",
      "plan"
    ],
    "tags": [
      "ambulance",
      "ground",
      "air",
      "transport",
      "emergency"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "written-selfpay-estimate",
    "category": "before-care",
    "title": "Request a written self-pay estimate",
    "question": "What should I ask for before care if I am not using insurance?",
    "summary": "Tell the provider that insurance will not be used and request the applicable written estimate.",
    "mechanism": "Scheduling/request conditions matter; emergency care follows a different situation.",
    "actions": [
      "Ask what services and billers the estimate includes.",
      "Keep the estimate locally for later comparison."
    ],
    "verify": [
      "Uninsured or choosing self-pay?",
      "Which provider and scheduled services are covered?"
    ],
    "avoid": [
      "Do not delay emergency care to obtain an estimate."
    ],
    "evidence": [
      "Written estimate",
      "Scheduled-service description"
    ],
    "completion": [
      "You know the estimate’s scope and expected separate charges."
    ],
    "sourceIds": [
      "knowledge-cms-selfpay-estimate"
    ],
    "coverage": [
      "uninsured",
      "self_pay"
    ],
    "documentTypes": [
      "estimate",
      "unknown"
    ],
    "goals": [
      "plan",
      "afford",
      "understand"
    ],
    "tags": [
      "good faith",
      "estimate",
      "self pay",
      "uninsured",
      "before care"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          63
        ]
      }
    ]
  },
  {
    "id": "estimate-dispute-fit",
    "category": "bill",
    "title": "A bill above an estimate needs a same-scope comparison",
    "question": "Can I use the federal patient-provider dispute process?",
    "summary": "A price difference is only one eligibility check.",
    "mechanism": "The applicable process also depends on estimate, provider, care and timing requirements.",
    "actions": [
      "Compare the same provider’s written estimate and initial bill.",
      "Check the current CMS filing conditions and fee before choosing to file."
    ],
    "verify": [
      "Was insurance not used?",
      "Same provider and service scope?",
      "What does the actual initial-bill timing show?"
    ],
    "avoid": [
      "Do not infer a filing deadline or eligibility from the dollar difference alone."
    ],
    "evidence": [
      "Good faith estimate",
      "Initial bill",
      "Current CMS instructions"
    ],
    "completion": [
      "Each required condition is checked before a filing decision."
    ],
    "sourceIds": [
      "cms-gfe-dispute"
    ],
    "coverage": [
      "uninsured",
      "self_pay"
    ],
    "documentTypes": [
      "bill"
    ],
    "goals": [
      "check",
      "afford",
      "appeal"
    ],
    "tags": [
      "ppdr",
      "400",
      "estimate",
      "dispute",
      "initial bill"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "missing-good-faith-estimate",
    "category": "bill",
    "title": "No estimate means a different next question",
    "question": "Can I dispute the bill when no good faith estimate was provided?",
    "summary": "Ask whether an estimate was required and obtain any version the provider supplied.",
    "mechanism": "An estimate-based dispute needs the required estimate; complaint and assistance paths are separate.",
    "actions": [
      "Request the provider’s estimate record or explanation.",
      "Use current CMS guidance to identify the applicable complaint route."
    ],
    "verify": [
      "Was this scheduled care or emergency care?",
      "Was an estimate requested or sent?"
    ],
    "avoid": [
      "Do not fabricate an estimate or treat absence as automatic debt cancellation."
    ],
    "evidence": [
      "Scheduling/request record",
      "Provider response"
    ],
    "completion": [
      "You have the missing record or the correct alternative route."
    ],
    "sourceIds": [
      "cms-gfe-dispute"
    ],
    "coverage": [
      "uninsured",
      "self_pay"
    ],
    "documentTypes": [
      "bill"
    ],
    "goals": [
      "check",
      "afford",
      "appeal"
    ],
    "tags": [
      "missing",
      "no estimate",
      "good faith",
      "complaint"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "cash-versus-insured",
    "category": "before-care",
    "title": "Compare cash price with your full insured cost",
    "question": "Is the cheaper cash price necessarily the better choice?",
    "summary": "Compare like-for-like services and ask how each route affects your plan totals.",
    "mechanism": "A cash quote and the plan’s expected member share measure different things.",
    "actions": [
      "Get itemized quotes with exclusions.",
      "If insurance is available, ask about deductible/out-of-pocket credit under each choice."
    ],
    "verify": [
      "Same services and billers?",
      "Does the quote require not using insurance?"
    ],
    "avoid": [
      "Do not promise that self-pay counts toward a deductible."
    ],
    "evidence": [
      "Cash quote",
      "Plan cost estimate",
      "Accumulator explanation"
    ],
    "completion": [
      "Both options have comparable scope and understood plan effects."
    ],
    "sourceIds": [
      "cms-price-transparency"
    ],
    "coverage": [
      "private",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "estimate"
    ],
    "goals": [
      "plan",
      "afford",
      "understand"
    ],
    "tags": [
      "cash",
      "self pay",
      "deductible",
      "insured",
      "compare",
      "price"
    ],
    "kind": "plan-specific",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          783,
          791
        ]
      }
    ]
  },
  {
    "id": "published-price-limit",
    "category": "before-care",
    "title": "A listed price is a comparison input",
    "question": "Does a hospital’s published price replace my bill?",
    "summary": "Ask which listed service and conditions match your actual care.",
    "mechanism": "Published standard charges do not themselves determine your personal final responsibility.",
    "actions": [
      "Save the service description and price type locally.",
      "Ask for a matching individualized explanation or estimate."
    ],
    "verify": [
      "Cash, negotiated or gross charge?",
      "Same setting, code and included services?"
    ],
    "avoid": [
      "Do not treat the lowest displayed number as a guaranteed rate."
    ],
    "evidence": [
      "Published price entry",
      "Actual quote or bill"
    ],
    "completion": [
      "The hospital explains whether the entry applies."
    ],
    "sourceIds": [
      "cms-price-faq"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "estimate",
      "bill"
    ],
    "goals": [
      "plan",
      "check",
      "afford"
    ],
    "tags": [
      "transparency",
      "published",
      "chargemaster",
      "negotiated",
      "standard charge"
    ],
    "kind": "data-check",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "precare-separate-estimates",
    "category": "before-care",
    "title": "Ask who else may bill before the visit",
    "question": "How do I avoid comparing an incomplete estimate?",
    "summary": "Identify expected separate billers and what each quote leaves out.",
    "mechanism": "A facility quote may not describe the complete episode.",
    "actions": [
      "Ask the scheduler which clinicians and services may bill separately.",
      "Request a scoped estimate from each relevant biller."
    ],
    "verify": [
      "Professional, facility, lab and imaging included?",
      "What could change the expected services?"
    ],
    "avoid": [
      "An estimate is not a guarantee of coverage or final cost."
    ],
    "evidence": [
      "Planned-service description",
      "Scoped written estimates"
    ],
    "completion": [
      "Known separate charges and exclusions are listed before comparison."
    ],
    "sourceIds": [
      "cms-price-transparency"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "estimate",
      "unknown"
    ],
    "goals": [
      "plan",
      "afford"
    ],
    "tags": [
      "facility fee",
      "separate billers",
      "estimate",
      "lab",
      "before care"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "assistance-before-financing",
    "category": "payment",
    "title": "Check assistance before accepting financing",
    "question": "The office offered a medical credit product. What should I ask first?",
    "summary": "Check coverage, bill accuracy and assistance before taking on a credit obligation.",
    "mechanism": "Financing can pay the provider while creating a separate repayment relationship.",
    "actions": [
      "Ask for assistance screening and direct-provider options.",
      "Request the full credit agreement before choosing."
    ],
    "verify": [
      "Who would be the creditor?",
      "Has assistance been reviewed?"
    ],
    "avoid": [
      "A provider recommendation is not proof the product is your best option."
    ],
    "evidence": [
      "Assistance response",
      "Written financing offer"
    ],
    "completion": [
      "You understand non-credit alternatives and the proposed creditor."
    ],
    "sourceIds": [
      "cfpb-medical-financing"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "estimate"
    ],
    "goals": [
      "afford",
      "plan"
    ],
    "tags": [
      "financing",
      "medical credit",
      "carecredit",
      "assistance",
      "loan"
    ],
    "kind": "general",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "deferred-interest",
    "category": "payment",
    "title": "Deferred interest is not the same as free credit",
    "question": "What happens if a promotional balance is not fully paid?",
    "summary": "Read the promotion’s payoff and late-payment conditions.",
    "mechanism": "Deferred interest can reach back to the purchase when the required terms are not met.",
    "actions": [
      "Ask for the full promotional payoff amount and date.",
      "Compare the required payoff schedule with minimum payments."
    ],
    "verify": [
      "True zero interest or deferred interest?",
      "What triggers accrued interest or fees?"
    ],
    "avoid": [
      "Do not assume minimum payments clear the promotion."
    ],
    "evidence": [
      "Credit agreement",
      "Promotion terms",
      "Repayment schedule"
    ],
    "completion": [
      "You can explain the total cost if the promotion is missed."
    ],
    "sourceIds": [
      "cfpb-deferred-interest"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "estimate"
    ],
    "goals": [
      "afford",
      "plan"
    ],
    "tags": [
      "deferred",
      "interest",
      "promotion",
      "minimum payment",
      "credit"
    ],
    "kind": "general",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "payment-plan-terms",
    "category": "payment",
    "title": "Get the payment plan’s full terms",
    "question": "How do I compare an offered monthly payment plan?",
    "summary": "Compare the full obligation and consequences, not just the monthly amount.",
    "mechanism": "Installment offers can differ in fees, interest and missed-payment treatment.",
    "actions": [
      "Ask for total repayment and every fee in writing.",
      "Ask what happens after a missed payment and whether the creditor changes."
    ],
    "verify": [
      "Direct provider or outside lender?",
      "Affordable payment and clear end point?"
    ],
    "avoid": [
      "Do not promise an interest-free plan exists."
    ],
    "evidence": [
      "Written plan offer",
      "Confirmed current balance"
    ],
    "completion": [
      "The amount, total cost and default terms are understood."
    ],
    "sourceIds": [
      "cfpb-medical-debt"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "estimate"
    ],
    "goals": [
      "afford",
      "plan"
    ],
    "tags": [
      "payment plan",
      "monthly",
      "installment",
      "fees",
      "repayment"
    ],
    "kind": "general",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          63,
          65
        ]
      }
    ]
  },
  {
    "id": "written-billing-hold",
    "category": "payment",
    "title": "A review request is not a billing hold",
    "question": "Can I stop paying while they look into the bill?",
    "summary": "Ask what billing activity, if any, the provider agrees to pause.",
    "mechanism": "An open question or assistance request does not itself establish a hold.",
    "actions": [
      "Request written confirmation of scope and end date.",
      "Track the ordinary due date until the response changes it."
    ],
    "verify": [
      "Which account and activity are paused?",
      "When should you follow up?"
    ],
    "avoid": [
      "Do not mark a hold confirmed because you requested one."
    ],
    "evidence": [
      "Provider’s written response",
      "Current statement"
    ],
    "completion": [
      "A hold is documented or the absence of one is clear."
    ],
    "sourceIds": [
      "cfpb-assistance-steps"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill"
    ],
    "goals": [
      "check",
      "afford",
      "appeal"
    ],
    "tags": [
      "hold",
      "pause",
      "due date",
      "collections",
      "review pending"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          65,
          65
        ]
      }
    ]
  },
  {
    "id": "verify-collector",
    "category": "collections",
    "title": "Verify who is asking for payment",
    "question": "What should I do when a collector contacts me?",
    "summary": "Establish the collector and debt before sharing payment information.",
    "mechanism": "Collector identity, original creditor and balance are separate facts to verify.",
    "actions": [
      "Use an independently verified contact channel.",
      "Request the validation information and keep the notice."
    ],
    "verify": [
      "Original provider or outside collector?",
      "Does the debt match your records?"
    ],
    "avoid": [
      "Do not send financial details merely because a caller knows your name."
    ],
    "evidence": [
      "Collection notice",
      "Your billing records"
    ],
    "completion": [
      "The recipient and claimed debt are identified."
    ],
    "sourceIds": [
      "cfpb-collection-contact"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "unknown"
    ],
    "goals": [
      "understand",
      "check",
      "afford"
    ],
    "tags": [
      "collector",
      "debt",
      "phone",
      "validation",
      "scam"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "written-collection-dispute",
    "category": "collections",
    "title": "Use the notice’s dispute procedure",
    "question": "How do I challenge a collection amount I do not agree with?",
    "summary": "State the actual discrepancy and preserve submission proof.",
    "mechanism": "Timely written disputes to covered collectors have procedures that informal requests may not trigger.",
    "actions": [
      "Check the notice’s response date and accepted channel.",
      "Identify the disputed portion and request verification."
    ],
    "verify": [
      "Does the collector fall under the relevant rule?",
      "What timing and delivery method apply?"
    ],
    "avoid": [
      "Do not infer a universal hold or automatic debt cancellation."
    ],
    "evidence": [
      "Validation notice",
      "Your dispute copy",
      "Delivery record"
    ],
    "completion": [
      "Receipt and the collector’s verification response are tracked."
    ],
    "sourceIds": [
      "cfpb-debt-validation"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "unknown"
    ],
    "goals": [
      "check",
      "afford",
      "appeal"
    ],
    "tags": [
      "dispute",
      "validation",
      "written",
      "30 days",
      "collector"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  },
  {
    "id": "reporting-versus-debt",
    "category": "collections",
    "title": "Credit reporting and the debt are different",
    "question": "If a medical collection is not on my report, is it gone?",
    "summary": "A reporting exclusion does not cancel the underlying obligation.",
    "mechanism": "Bureau policies, state rules and the vacated2025 federal rule require separate checks.",
    "actions": [
      "Review the actual tradeline and creditor.",
      "Check current bureau policy and dispute inaccurate reporting through the appropriate channel."
    ],
    "verify": [
      "Medical collection or credit-card debt?",
      "Which bureau, balance and payment status?"
    ],
    "avoid": [
      "Do not assume a nationwide medical-debt reporting ban."
    ],
    "evidence": [
      "Credit report entry",
      "Payment/balance records",
      "Current policy"
    ],
    "completion": [
      "Reporting accuracy and debt responsibility are assessed separately."
    ],
    "sourceIds": [
      "cfpb-medical-reporting-status",
      "bureau-medical-reporting"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "unknown"
    ],
    "goals": [
      "understand",
      "check",
      "afford"
    ],
    "tags": [
      "credit report",
      "500",
      "paid medical",
      "tradeline",
      "bureau"
    ],
    "kind": "general",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          199
        ]
      }
    ]
  },
  {
    "id": "court-and-old-debt",
    "category": "collections",
    "title": "A summons has its own response path",
    "question": "Can I ignore a lawsuit about an old medical debt?",
    "summary": "Treat court papers separately from ordinary billing correspondence.",
    "mechanism": "Debt age, state law and prior payments can affect legal defenses; age alone does not erase a debt.",
    "actions": [
      "Read the court instructions promptly and seek appropriate legal help.",
      "Ask about limitation rules before paying or acknowledging an older debt."
    ],
    "verify": [
      "Actual summons or collection letter?",
      "Which court/state and stated response date?"
    ],
    "avoid": [
      "Do not assume an unanswered billing dispute pauses court deadlines."
    ],
    "evidence": [
      "Court papers",
      "Debt/payment history"
    ],
    "completion": [
      "The court response and any legal advice are tracked independently."
    ],
    "sourceIds": [
      "cfpb-old-debt",
      "cfpb-debt-legal-process"
    ],
    "coverage": [
      "private",
      "medicare",
      "medicaid",
      "uninsured",
      "self_pay",
      "unknown"
    ],
    "documentTypes": [
      "bill",
      "unknown"
    ],
    "goals": [
      "understand",
      "check",
      "afford",
      "appeal"
    ],
    "tags": [
      "court",
      "summons",
      "lawsuit",
      "old debt",
      "statute",
      "limitations"
    ],
    "kind": "procedure",
    "handoffRefs": [
      {
        "artifact": "original-handoff",
        "lines": [
          198,
          198
        ]
      }
    ]
  }
];

// knowledge-exceptions.js: 10563019d14492199ecf58ab0bf4c287a7819ebe6bf656243421f2cc6e7a3f48
// Time-sensitive and program-specific primary research; never infer eligibility from a bill alone.
const exceptionSources = [
  { id: 'cms-ferp-2026-reopening', title: 'HHS external-review reopening and temporary deadline extension', url: 'https://www.cms.gov/files/document/hhs-administered-ferp-deadline-extension-07-31-26.pdf', publisher: 'CMS', applicability: 'Specified HHS-administered FERP participants, original deadlines July 1–August 3, 2026; excludes prior final HHS FERP decisions.', summary: 'A narrow reopening provision extends qualifying external-review requests to October 2, 2026. This is not a general extension of insurance appeals.', effectiveFrom: '2026-07-31', expiresAt: '2026-10-03T12:00:00.000Z' },
  { id: 'medicare-qmb-billing', title: 'Medicare Savings Programs and QMB billing protections', url: 'https://www.medicare.gov/basics/costs/help/medicare-savings-programs', publisher: 'Medicare.gov', applicability: 'Confirmed QMB participation and Medicare-covered services/items; not all Medicare beneficiaries or all charges.', summary: 'QMB beneficiaries have specific protection from Medicare cost-sharing bills. State eligibility and covered service status must be confirmed.' }
];

const exceptionConcepts = [
  {
    id: 'ferp-temporary-reopening', category: 'coverage', title: 'A narrow 2026 external-review extension',
    question: 'Did the HHS external-review interruption affect my filing deadline?',
    summary: 'A temporary HHS rule may preserve an external-review opportunity through October 2, 2026 for a specifically defined group. An old appeal deadline alone does not establish eligibility.',
    mechanism: 'The HHS-administered process reopened July 31, 2026. The extension is tied to that process and the original external-review deadline; it does not extend every insurer or state appeal.',
    actions: ['Confirm that the notice directs your plan to HHS-administered FERP, and check the official reopening notice with the reviewer.', 'Compare the original external-review deadline with July 1–August 3, 2026, inclusive.', 'If the route and timing fit, confirm submission requirements and the October 2 cutoff directly; keep filing and receipt evidence.'],
    verify: ['The plan or issuer elected HHS-administered FERP.', 'The notice’s state/territory and route qualify, or this is an electing self-insured non-federal governmental plan.', 'No final HHS FERP decision has already been issued for this case.'],
    avoid: ['Do not treat this as a new internal-appeal period or a universal late-filing exception.', 'An eligible request filed before July 1 that still awaits a decision does not need to be refiled solely because of reopening.'],
    evidence: ['Final denial and route instructions', 'Original external-review deadline and plan election confirmation', 'Any earlier filing receipt and decision'],
    completion: ['Reviewer-confirmed acceptance and a retained receipt; filing alone is not a favorable review decision.'],
    sourceIds: ['cms-ferp-2026-reopening'], coverage: ['private','unknown'], documentTypes: ['denial','bill','unknown'], goals: ['appeal','understand','check'],
    tags: ['FERP','HHS','MAXIMUS','reopening','external review','extension','late deadline','October 2026'], kind: 'procedure',
    expiresAt: '2026-10-03T12:00:00.000Z', validThroughDate: '2026-10-02',
    handoffRefs: [{artifact:'bill-advocacy-playbook',lines:[188,259]}]
  },
  {
    id: 'qmb-medicare-cost-sharing', category: 'coverage', title: 'Check QMB before paying Medicare cost sharing',
    question: 'I have QMB and received a Medicare deductible or coinsurance bill. What should I check?',
    summary: 'For a confirmed QMB beneficiary, Medicare providers cannot charge the beneficiary Medicare-covered deductibles, coinsurance or copayments. A small applicable Medicaid copayment is different.',
    mechanism: 'QMB is a specific Medicare Savings Program. Other savings programs do not necessarily carry the same cost-sharing protection, and Medicare enrollment alone does not prove QMB status.',
    actions: ['Confirm QMB enrollment for the relevant period with your state or coverage records.', 'Ask the biller to review the Medicare-covered service and QMB status together.', 'Show the appropriate coverage evidence directly to the biller and request a corrected account statement.'],
    verify: ['QMB, not merely SLMB, QI or unspecified Medicaid coverage', 'Coverage for the service period', 'The charge is Medicare-covered cost sharing, not an unrelated noncovered service or applicable Medicaid copayment'],
    avoid: ['Do not infer QMB eligibility from income or age.', 'Do not use a general Medicare benefit explanation as proof that this particular service is covered.'],
    evidence: ['QMB/Medicaid evidence or Medicare Summary Notice showing QMB', 'Provider bill', 'Claim statement identifying covered service and cost sharing'],
    completion: ['Corrected bill or written account explanation reflecting the confirmed coverage.'],
    sourceIds: ['medicare-qmb-billing'], coverage: ['medicare'], documentTypes: ['bill','eob','denial','unknown'], goals: ['check','understand','afford','appeal'],
    tags: ['QMB','Medicare Savings Program','deductible','coinsurance','copayment','dual eligible'], kind: 'plan-specific',
    handoffRefs: [{artifact:'original-handoff',lines:[1634,1694]}]
  }
];

const ferpStates = ['AL','FL','GA','WI','TX','AS','GU','MP','VI'];
/** Local questionnaire only. No exact dates or plan details are added to cloud facts. */
function checkFerpExtension(input = {}, { today } = {}) {
  const result = (status, message, missing = []) => ({ status, message, missing, sourceIds: ['cms-ferp-2026-reopening'], deadline: status === 'potential_match' ? '2026-10-02' : null });
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10) === value;
  if (!validDate(today)) return result('needs_confirmation', 'Confirm today’s local date before checking a temporary rule.', ['today']);
  if (today > '2026-10-02') return result('expired', 'The published temporary filing window has ended. Ask the reviewer about your actual case and any other applicable route.');
  if (today < '2026-07-31') return result('not_current', 'This reopening provision was not yet in effect on the selected date.');
  if (input.priorFinalDecision === true) return result('excluded', 'The notice excludes cases with a prior final HHS FERP decision.');
  if (input.electedHhsFerp === false) return result('excluded', 'This extension applies to the HHS-administered process, not every external-review route.');
  const missing = [];
  if (input.electedHhsFerp !== true) missing.push('electedHhsFerp');
  if (input.priorFinalDecision !== false) missing.push('priorFinalDecision');
  if (!validDate(input.originalDeadline)) missing.push('originalDeadline');
  if (input.selfInsuredNonFederalGovernmental !== true && !ferpStates.includes(input.state)) {
    if (input.selfInsuredNonFederalGovernmental === false && typeof input.state === 'string' && /^[A-Z]{2}$/.test(input.state) && input.state !== 'XX') return result('outside_listed_scope', 'The supplied route does not match the state/territory branch in this notice. Confirm the applicable review process directly.');
    missing.push('qualifyingPlanAndJurisdiction');
  }
  if (missing.length) return result('needs_confirmation', 'Confirm the route, original deadline and prior-decision status before relying on the extension.', missing);
  if (input.originalDeadline < '2026-07-01' || input.originalDeadline > '2026-08-03') return result('outside_window', 'The supplied original external-review deadline is outside the notice’s July 1–August 3 window.');
  return result('potential_match', 'These answers match the notice’s basic gates. Confirm acceptance, the October 2 cutoff and filing instructions with the HHS FERP reviewer. This is not an eligibility decision.');
}

// scenario-playbooks.js: 69f1850ee1980b1c386cec4c53fdfe6a9416865ccd8256d79711681d055690e6
/** Original GoldRock scenario intents, rewritten as sourced evidence and response journeys. */
const scenarioSources = [
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

const scenarioPlaybooks = scenarioSeedData.map(scenarioBuildRoute);
const scenarioKnowledgeConcepts = scenarioPlaybooks.map(route => ({
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

// knowledge-countermeasures.js: 4a67a842fc03a1f89f1286e40ec869a18d6bf70ee76b0b541e212ea1fade4b95
// Narrow, source-linked countermeasures. Each route requires the member to confirm its applicability.
const countermeasureSources = [
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

const countermeasureConcepts = [
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

// sources.js: 992243a6ac2386eb289fd7a883907276df99047251abc4bd02e4a80b392e3b96
/** Reviewed primary-source knowledge registry; this is curated research, not live retrieval. */
const SOURCE_REVIEWED_AT = '2026-09-27T00:00:00.000Z';
const SOURCE_EXPIRES_AT = '2026-12-27T00:00:00.000Z';
const entry = (id, title, url, publisher, applicability, summary, effectiveFrom = null) => Object.freeze({ id, title, url, publisher, jurisdiction: 'US', applicability, summary, reviewedAt: SOURCE_REVIEWED_AT, expiresAt: SOURCE_EXPIRES_AT, effectiveFrom, reviewMethod: 'Official source material reviewed (page, PDF or indexed excerpts); applicability still requires case facts.' });
const sources = Object.freeze([
  ...[...billingSources,...insuranceSources,...priceSources,...knowledgeSources,...exceptionSources,...scenarioSources,...countermeasureSources].map(source => Object.freeze({...entry(source.id,source.title,source.url,source.publisher,source.applicability,source.summary,source.effectiveFrom ?? null),...(source.reviewedAt?{reviewedAt:source.reviewedAt}:{}),...(source.expiresAt?{expiresAt:source.expiresAt}:{}),...(source.reviewMethod?{reviewMethod:source.reviewMethod}:{})})),
  entry('cms-eob', 'EOB or medical bill: understand the difference', 'https://www.tdi.texas.gov/podcast/explanation-of-benefits-medical-bill-differences.html', 'Texas Department of Insurance', 'General document explanation; no state-specific remedy inferred.', 'An EOB explains claim processing and possible responsibility; it is not a demand for payment.'),
  entry('cms-medical-bill-rights', 'Know your medical bill rights', 'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-medical-bill-rights', 'CMS', 'Coverage and setting must be confirmed.', 'The correct consumer route depends on whether insurance was used and the type of care.'),
  entry('cms-no-surprises', 'Protection from unexpected out-of-network bills', 'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-medical-bill-rights', 'CMS', 'Qualifying private coverage; emergency, certain in-network facility services, air ambulance; confirm exceptions.', 'Federal protections can limit some out-of-network patient charges; ground ambulance generally needs another route.', '2022-01-01'),
  entry('cms-gfe-dispute', 'Dispute a bill above a good faith estimate', 'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/dispute-bill', 'CMS', 'Uninsured/self-pay; matching provider estimate and bill; qualifying timing and notice.', 'Check the $400 difference, 120-calendar-day initial bill window, advance estimate, care timing and self-pay conditions before filing.', '2022-01-01'),
  entry('healthcare-appeals', 'Internal health-plan appeals', 'https://www.healthcare.gov/appeal-insurance-company-decision/internal-appeals/', 'HealthCare.gov', 'Applicable health plans; actual notice and plan procedure control individual routing.', 'A denial can be reviewed through a documented appeal with relevant supporting records. Confirm the deadline in the notice.'),
  entry('healthcare-external-review', 'Independent external review', 'https://www.healthcare.gov/appeal-insurance-company-decision/external-review/', 'HealthCare.gov', 'Eligible denial types and applicable state/federal or plan review process; not every billing dispute.', 'The final denial and plan type identify the review route. Urgent situations may require an expedited process.'),
  entry('irs-financial-assistance', 'Hospital financial assistance policies', 'https://www.irs.gov/charities-non-profits/financial-assistance-policies-faps', 'IRS', 'Covered tax-exempt hospital facilities; exact policy, care and provider list must be checked.', 'Policies specify eligibility and application rules; a hospital policy may exclude separately billing providers.'),
  entry('irs-collections', 'Hospital billing and collection requirements', 'https://www.irs.gov/charities-non-profits/billing-and-collections-section-501r6', 'IRS', 'Section 501(r) hospital extraordinary collection actions; not a blanket hold on all bills.', 'Covered hospitals must make reasonable efforts to determine financial-assistance eligibility before extraordinary collection actions.'),
  entry('cfpb-medical-debt', 'When you cannot pay a medical bill', 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-do-if-i-cant-pay-a-medical-bill-en-2125/', 'CFPB', 'General bill review, assistance and payment options; state/plan details may differ.', 'Review accuracy and assistance before choosing repayment or financing; ask for clear written terms.'),
  entry('medicare-appeals', 'Medicare appeals', 'https://www.medicare.gov/providers-services/claims-appeals-complaints/appeals', 'Medicare.gov', 'Original Medicare, Medicare health or drug plans each have their own appeal process.', 'Use the coverage-specific decision notice and next-level appeal instructions.'),
  entry('medicaid-appeals', 'Medicaid and CHIP state assistance', 'https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip', 'Medicaid.gov', 'State Medicaid agency and plan, confirmed from the member notice.', 'Contact the appropriate state agency for Medicaid coverage and claims assistance.'),
  entry('cms-price-transparency', 'Compare planned-care costs', 'https://www.cms.gov/priorities/healthplan-price-transparency/overview/consumers', 'CMS', 'Applicable plan comparison tools; estimates are not final responsibility.', 'Ask for an estimate reflecting the service, network and plan and identify separately billed care.'),
  entry('healthcare-preauthorization', 'What preauthorization means', 'https://www.healthcare.gov/glossary/preauthorization/', 'HealthCare.gov', 'Applicable plan authorization requirements.', 'Preauthorization does not guarantee that the plan pays all costs.'),
  entry('cfpb-collection-contact', 'Responding to a debt collector', 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-do-when-a-debt-collector-contacts-me-en-1695/', 'CFPB', 'Debt collectors; establish identity and the debt before sharing financial information.', 'Request validation and keep records of your response. Do not ignore a court deadline.'),
  entry('cfpb-debt-validation', 'Debt validation information', 'https://www.consumerfinance.gov/ask-cfpb/what-information-does-a-debt-collector-have-to-give-me-about-the-debt-en-331/', 'CFPB', 'Applicable third-party debt collection; notice, dates and debt must be verified.', 'A timely written dispute can require a collector to pause collection of the disputed amount pending verification.'),
  entry('cfpb-medical-financing', 'Medical credit cards and payment plans', 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-medical-credit-cards-and-payment-plans-for-medical-bills-en-1827/', 'CFPB', 'Actual financing agreement and provider options; no lender recommendation.', 'Review assistance, total cost and deferred-interest conditions before accepting medical financing.'),
  entry('cfpb-debt-legal-process', 'Debt collection and court process', 'https://www.consumerfinance.gov/consumer-tools/debt-collection/answers/key-terms/', 'CFPB', 'Applicable state law, court notice and debt type; individual legal help may be needed.', 'A collection letter is distinct from a lawsuit. Court deadlines and statutes of limitation require case-specific review.'),
]);
const SOURCE_IDS = Object.freeze(sources.map(source => source.id));
function getSource(id, { now = new Date() } = {}) {
  const source = sources.find(item => item.id === id);
  if (!source) return null;
  const time = new Date(now).getTime();
  return { ...source, current: Number.isFinite(time) && time >= Date.parse(source.reviewedAt) && time < Date.parse(source.expiresAt) };
}
function getCurrentSources({ now = new Date() } = {}) { return sources.filter(source => getSource(source.id, { now }).current); }

// engine.js: 404720c3ce4d0784cd75d4973c5c1252b11eaf5ce98d74a7db548102eced202f

/** Deterministic guidance. No network, model call, original text, or inferred savings. */
function analyzeFacts(input, { now = new Date() } = {}) {
  const facts = validateFacts(input), date = new Date(now);
  if (!Number.isFinite(date.getTime())) throw new TypeError('A valid analysis date is required.');
  const result = { version: 1, engine: 'rules', generatedAt: date.toISOString(), summary: '', findings: [], actions: [], questions: [], sourceIds: [], limitations: [
    'Calculated checks and researched guidance. These are questions to verify, not a finding of billing error or savings.',
    'The entered facts do not establish hospital-policy eligibility, plan terms, a filing deadline, or a payment hold.',
    'Drafts are editable and are not sent by GoldRock. Personal references can be added locally before you share.',
  ] };
  const stale = new Set();
  const current = ids => ids.every(id => { if (!getSource(id, { now: date })?.current) { stale.add(id); return false; } return true; });
  const finding = (id, title, detail, severity, evidenceIds = [], sourceIds = [], amountCents) => {
    if (!current(sourceIds)) return;
    result.findings.push({ id, title, detail, severity, ...(amountCents === undefined ? {} : { amountCents }), evidenceIds, sourceIds });
  };
  const action = (id, title, reason, steps, draft, sourceIds = [], priority = 2) => { if (current(sourceIds)) result.actions.push({ id, title, reason, steps, draft, sourceIds, priority }); };
  const question = text => { if (!result.questions.includes(text)) result.questions.push(text); };
  const known = key => Number.isSafeInteger(facts[key]);
  const insured = ['private', 'medicare', 'medicaid'].includes(facts.coverage);
  const selfPay = ['self_pay', 'uninsured'].includes(facts.coverage);
  const isBill = facts.documentType === 'bill';
  const denial = facts.documentType === 'denial' || facts.claimStatus === 'denied' || facts.goal === 'appeal';
  const planned = facts.documentType === 'estimate' || facts.goal === 'plan';
  if (facts.documentType === 'unknown') {
    question('Does the document request payment, explain insurance processing, deny coverage, or estimate future care?');
    action('identify-document', 'Identify the document first', 'The next step changes depending on who sent it and what it asks you to do.', ['Check the sender and document heading locally.', 'Choose bill, EOB, denial, or estimate and run the checks again.'], 'Please explain whether this document is a bill requesting payment, an insurance explanation, a denial, or an estimate.', ['cms-eob'], 1);
  }
  if (facts.coverage === 'unknown') question('Did you use private insurance, Medicare, Medicaid, or no insurance for this care?');
  if (!facts.state || facts.state === 'unknown') question('Which state was the care provided in? Local protections may differ.');

  if (facts.documentType === 'eob') {
    finding('eob-not-bill', 'This EOB is not a payment request', 'It explains insurance processing. Match it with the provider’s bill for the same care before deciding what is due.', 'info', ['documentType'], ['cms-eob']);
    action('match-eob', 'Match the EOB to the provider statement', 'A billed charge and patient responsibility describe different amounts.', ['Keep the EOB for comparison.', 'Check the claim status and whether a provider statement exists.', 'If amounts differ, confirm the documents describe the same services and processing stage.'], 'Please confirm whether this EOB and the provider statement refer to the same claim. Has processing finished, and what explains any difference in patient responsibility?', ['cms-eob'], 1);
  }
  if (facts.claimStatus === 'pending') {
    finding('claim-pending', 'Insurance processing is still pending', 'An unfinished claim can change the final patient balance. Confirm the status with the plan and provider.', 'question', ['claimStatus'], ['cms-eob']);
    action('confirm-processing', 'Confirm processing and ask about the due date', 'Pending insurance is not confirmation that the provider has paused billing.', ['Ask the plan what information is missing and who must supply it.', 'Ask the provider to confirm the due date and whether a hold is available.', 'Record a hold only after receiving its scope and end date.'], 'The claim appears to be pending. What is needed to finish processing? While that is resolved, can you confirm the current due date and whether you will place a billing hold in writing?', ['cms-eob'], 1);
  }

  if (isBill) {
    if (['billedCents', 'adjustmentCents', 'insurancePaidCents', 'paidCents', 'balanceCents'].every(known)) {
      const expected = facts.billedCents - facts.adjustmentCents - facts.insurancePaidCents - facts.paidCents;
      const difference = facts.balanceCents - expected;
      const evidence = ['billedCents', 'adjustmentCents', 'insurancePaidCents', 'paidCents', 'balanceCents'];
      if (difference !== 0) {
        finding('balance-mismatch', 'The entered amounts do not reconcile', `Charges minus adjustments, insurer payments and your payments equal ${formatMoney(expected)}. The entered balance is ${formatMoney(facts.balanceCents)}: a ${formatMoney(Math.abs(difference))} difference to explain, not confirmed savings.`, 'question', evidence, [], Math.abs(difference));
        action('reconcile-balance', 'Ask for a reconciled statement', 'The arithmetic differs; a missing adjustment, credit, or document version could explain it.', ['Check that all five amounts cover the same statement period.', 'Request a ledger of charges, adjustments and payments.', 'Compare the revised statement before marking the issue resolved.'], `My entered figures calculate to ${formatMoney(expected)}, while the statement balance is ${formatMoney(facts.balanceCents)}. Please provide an account ledger explaining the difference and confirm which payments and adjustments are included.`, ['cfpb-medical-debt'], 1);
      } else finding('balance-reconciles', 'The entered balance adds up', 'The arithmetic reconciles. This does not establish that the charges, coverage, or coding are correct.', 'info', evidence);
    } else question('Do you have the total charges, adjustments, insurer payments, your payments, and current balance from the same statement? Missing amounts are not treated as zero.');

    if (insured && known('balanceCents') && known('eobResponsibilityCents') && facts.balanceCents !== facts.eobResponsibilityCents) {
      finding('eob-mismatch', 'The statement and EOB show different amounts', `The entered statement balance is ${formatMoney(facts.balanceCents)} and the EOB responsibility is ${formatMoney(facts.eobResponsibilityCents)}. Check matching services, later payments and claim versions before treating the difference as an error.`, 'question', ['balanceCents', 'eobResponsibilityCents'], ['cms-eob'], Math.abs(facts.balanceCents - facts.eobResponsibilityCents));
      action('reconcile-eob', 'Compare the bill with the latest EOB', 'The documents may cover different services or processing stages.', ['Confirm the same care and billing entity using details kept locally.', 'Check whether a corrected EOB or a credited payment is missing.', 'Ask the plan and provider for a written explanation.'], 'The provider balance and EOB responsibility differ. Please confirm that they concern the same services, show any later payments or reprocessing, and explain the remaining responsibility.', ['cms-eob'], 1);
    }
    if (facts.hasItemization !== true || !facts.lines?.length) action('request-itemization', 'Get an itemized statement', 'A total alone does not explain the charges.', ['Ask for services, codes, units, charges and the payment ledger.', 'Keep the itemization on your device.', 'Review any repeated lines and unfamiliar services with the billing office.'], 'Please send an itemized statement with codes, units, charges, adjustments, insurer payments, my payments, and the current balance. Please confirm whether every insurance claim has finished processing.', ['cfpb-medical-debt'], 2);
  }
  const groups = new Map();
  for (const line of facts.lines ?? []) if (line.code) {
    const key = `${line.code}:${line.amountCents}:${line.units}`;
    groups.set(key, [...(groups.get(key) ?? []), line]);
  }
  let repeatedIndex = 0;
  for (const group of groups.values()) if (group.length > 1) {
    const ids = group.map(line => line.id), first = group[0];
    finding(`repeated-lines-${++repeatedIndex}`, 'Similar line items need an explanation', `${group.length} lines share code ${first.code}, amount ${formatMoney(first.amountCents)}, and ${first.units} unit(s). Separate visits, modifiers, or different billers can make repetition legitimate.`, 'question', ids, ['cfpb-medical-debt']);
  }
  if (repeatedIndex) action('explain-lines', 'Ask how the repeated lines differ', 'A matching code and amount is a question, not proof of duplicate billing.', ['Compare service dates, modifiers and billers locally.', 'Ask which service each line represents.', 'If the provider confirms an error, request a corrected balance in writing.'], 'Some itemized lines have the same code, amount and units. Could you explain the separate service represented by each line and check that none was entered twice? Please send a corrected statement if you find an error.', ['cfpb-medical-debt'], 2);

  if (denial && insured) {
    const source = facts.coverage === 'medicare' ? 'medicare-appeals' : facts.coverage === 'medicaid' ? 'medicaid-appeals' : 'healthcare-appeals';
    const label = facts.coverage === 'medicare' ? 'Medicare coverage and appeal level' : facts.coverage === 'medicaid' ? 'state Medicaid or managed-care process' : 'plan’s appeal process';
    finding('denial-route', 'Start with the reason and the actual notice', `Your ${label} determines where and when to request review. A generic countdown would not establish your deadline.`, 'important', ['documentType', 'coverage', ...(facts.claimStatus ? ['claimStatus'] : [])], [source]);
    question('What deadline, submission method, and review level are stated in the actual denial notice? Keep exact dates and claim identifiers local.');
    if (!facts.denialReason || facts.denialReason === 'unknown') question('Does the notice describe missing information, a coverage exclusion, or a medical-necessity decision?');
    action('prepare-appeal', 'Prepare a response to the stated denial', `Use the ${label}; preserve proof of receipt.`, ['Read the reason and request the records or criteria behind it.', 'Confirm the required form, recipient and deadline directly from the notice or plan.', facts.denialReason === 'medical_necessity' ? 'Ask the treating clinician for supporting clinical rationale; do not invent medical facts.' : 'Gather the actual records that answer the stated reason.', 'Edit the draft, submit through the verified channel, then record receipt.'], 'I request review of the decision identified in my attached notice. Please provide the plan provision and records relied on, confirm the filing deadline and submission method, and consider my attached supporting information. My reason for requesting review is [add verified facts addressing the denial]. Please confirm receipt and issue a written decision.', [source], 1);
    if (facts.denialReason === 'administrative') action('correct-claim', 'Ask whether a corrected claim is needed', 'A missing or incorrect administrative field may require the provider to resubmit.', ['Ask which specific field or document is missing.', 'Confirm who will make the correction and when.', 'Keep the appeal deadline active unless the plan confirms a change.'], 'Please identify the missing or incorrect claim information and who needs to correct it. Will you reprocess the claim when it is supplied? Please also confirm whether my appeal deadline remains unchanged.', [source], 1);
    if (facts.coverage === 'private') action('external-review', 'Check the next review route if the denial stands', 'Independent review is available for eligible decisions through the applicable process.', ['Read the final denial’s external-review instructions.', 'Confirm whether the decision qualifies and whether internal review is exhausted or an exception applies.', 'If care is urgent, ask the clinician and plan about expedited review now.'], 'If this denial is upheld, please identify the applicable external-review process, eligibility requirements, deadline, and documents. If urgent review is available, please explain how my clinician and I request it.', ['healthcare-external-review'], 3);
  }
  if (denial && !insured) {
    question('Is this actually an insurance denial, or a provider declining a discount? Confirm coverage before using an insurance appeal draft.');
    action('confirm-denial-route', 'Confirm who made the decision', 'Insurance appeals and provider discount requests have different routes.', ['Read who issued the decision and what it declined.', 'Confirm whether insurance was used for this care.', 'Ask the sender which review process and deadline apply.'], 'Please explain what decision this notice makes, who can review it, and the applicable review process and deadline.', ['cms-medical-bill-rights'], 1);
  }

  if (facts.coverage === 'private' && ['emergency', 'in_network_facility', 'air_ambulance'].includes(facts.careSetting)) {
    finding('surprise-bill-check', 'Check unexpected out-of-network responsibility', 'This care setting can involve federal surprise-billing protections. Coverage, care date, network facts, provider role and any notice or consent still need verification.', 'question', ['coverage', 'careSetting'], ['cms-no-surprises']);
    action('surprise-bill-review', 'Ask the plan to review billing protections', 'A high deductible alone does not show a violation.', ['Confirm the facility and provider network status for the exact plan.', 'Request any notice-and-consent document relied on.', 'Compare the corrected EOB or explanation and use CMS help if unresolved.'], 'Please review whether federal or state surprise-billing protections apply to this charge. Explain the network processing and patient responsibility, and provide any notice or consent used in the decision.', ['cms-no-surprises'], 1);
  }
  if (facts.careSetting === 'ground_ambulance') {
    finding('ground-ambulance', 'Ground ambulance needs a separate check', 'Federal No Surprises Act protections generally exclude ground ambulance. Ask about applicable state protections and the plan’s terms.', 'info', ['careSetting'], ['cms-no-surprises']);
  }
  if (selfPay && isBill) {
    if (facts.hasEstimate === true && known('estimateCents') && known('billedCents')) {
      const excess = facts.billedCents - facts.estimateCents;
      finding('estimate-comparison', 'Compare the charge with your estimate', `The billed charge is ${formatMoney(Math.abs(excess))} ${excess >= 0 ? 'above' : 'below'} the entered estimate. This comparison must be for the same provider and scope.`, 'info', ['billedCents', 'estimateCents'], [], Math.abs(excess));
      if (excess >= 40000 && (!known('daysSinceInitialBill') || facts.daysSinceInitialBill <= 120)) {
        finding('ppdr-check', 'A federal estimate-dispute route is worth checking', 'The entered difference meets the $400 threshold. Eligibility is not established: confirm self-pay notice, qualifying care and estimate timing, matching provider/scope, and the initial-bill date.', 'important', ['coverage', 'hasEstimate', 'estimateCents', 'billedCents', ...(known('daysSinceInitialBill') ? ['daysSinceInitialBill'] : [])], ['cms-gfe-dispute']);
        action('ppdr-verify', 'Verify every estimate-dispute requirement', 'CMS uses a 120-calendar-day initial-bill window; verify promptly with the official process.', ['Confirm you did not use insurance and told the provider before care.', 'Confirm care was on or after January 1, 2022 and the advance-estimate timing qualifies.', 'Match this provider’s estimate and bill and verify the initial-bill date.', 'Review current CMS requirements and fee before deciding whether to file.'], `The billed charge of ${formatMoney(facts.billedCents)} is ${formatMoney(excess)} above the estimate of ${formatMoney(facts.estimateCents)}. Please explain the difference. I am checking the applicable patient-provider dispute process and would like a written response.`, ['cms-gfe-dispute'], 1);
        question('Do the estimate and bill cover the same provider and services, and were the required estimate and self-pay notices provided before qualifying care?');
        if (!known('daysSinceInitialBill')) question('How many calendar days have passed since the initial bill date? Check the official filing rule promptly.');
      } else if (excess >= 40000 && facts.daysSinceInitialBill > 120) {
        finding('ppdr-window', 'The entered bill age exceeds the standard dispute window', 'The entered age is beyond the standard CMS 120-calendar-day window. Verify the dates and ask CMS which other assistance or complaint routes fit.', 'important', ['daysSinceInitialBill'], ['cms-gfe-dispute']);
      }
    } else {
      question('Did you receive a written good faith estimate for this provider before the care?');
      action('missing-estimate', 'Ask about the missing estimate', 'Without an estimate, this comparison cannot establish an estimate-dispute case.', ['Ask the provider for any written estimate it supplied.', 'Use the official CMS information and complaint route if an estimate should have been provided.', 'Continue reviewing financial assistance and billing accuracy.'], 'Please send any good faith estimate provided before my care, or explain whether one was required and why it was not supplied.', ['cms-gfe-dispute'], 2);
    }
  }

  if (facts.goal === 'afford' || (isBill && known('balanceCents') && facts.balanceCents > 0)) {
    action('financial-assistance', 'Check financial assistance before financing', 'A hospital’s actual policy determines eligibility and which bills it covers.', ['Find the official policy, plain-language summary and application for the exact hospital.', 'Check the covered-provider list; separately billed clinicians may be excluded.', 'Ask about insured eligibility, required documents, deadlines and reconsideration.', 'Apply directly through the verified recipient and retain receipt.'], 'Please send your financial-assistance policy, application, plain-language summary and covered-provider list. Can I be screened given my insurance and household situation? Please explain required documents, deadlines, hardship options and reconsideration.', ['irs-financial-assistance'], facts.goal === 'afford' ? 1 : 2);
    if (isBill) action('payment-options', 'Request written payment options', 'Compare assistance and affordable terms before committing to financing.', ['Ask about interest-free plans and any direct-pay discount after checking assistance.', 'Request total cost, interest, fees, missed-payment terms and credit effects.', 'Confirm the balance and any billing hold in writing before relying on it.'], 'After reviewing assistance, what affordable payment options are available? Please give me the total repayment cost, interest, fees, and missed-payment terms in writing. Can you confirm whether any billing or collection hold applies, and its end date?', ['cfpb-medical-debt'], 3);
  }
  if (planned) {
    action('plan-care', 'Get an estimate with the right scope', 'Separate billers and plan rules can change the eventual cost.', ['Ask which facility, clinicians, labs and other services may bill separately.', insured ? 'Verify network status, coverage, referral and authorization with the exact plan.' : 'Ask the provider for a written good faith estimate and expected separate billers.', 'Keep written estimates and confirmations locally and compare the eventual bill.'], 'Please provide a written estimate identifying included services, expected separate billers and what could change the cost. Please confirm the coverage and authorization questions I should check with my plan, or the good faith estimate process if I am not using insurance.', ['cms-price-transparency', 'healthcare-preauthorization'], 1);
    finding('estimate-not-final', 'An estimate is a planning tool', 'Final responsibility can change with services and plan processing. Prior authorization does not guarantee full payment.', 'info', ['documentType', 'goal'], ['healthcare-preauthorization']);
  }
  if (stale.size) {
    result.limitations.push('Some policy sources need a fresh review. Related recommendations were withheld; verify the official sources before choosing a route.');
    finding('source-review-needed', 'Policy guidance needs a fresh source review', 'Arithmetic remains available. Review current official guidance before relying on a legal or policy route.', 'important');
  }
  result.actions.sort((a, b) => a.priority - b.priority);
  result.sourceIds = [...new Set([...result.findings, ...result.actions].flatMap(item => item.sourceIds))];
  result.summary = facts.documentType === 'eob' ? 'Understand what the plan processed, then match it to a provider statement.' : denial ? 'Use the actual denial to confirm the route, evidence and next step.' : planned ? 'Clarify scope, coverage and written estimates before planned care.' : result.findings.some(item => item.severity === 'question') ? 'There are specific questions worth checking before deciding what to do next.' : 'Start with the facts, then choose the most useful next step.';
  return result;
}
const generateGuidance = analyzeFacts;

// public-playbooks.js: 3707ab452947b6579cf9a2d2cd23a7ff53f15ecda88a8283dd53ad5dc5eb9403

const playbook = value => Object.freeze({ ...value, reviewedAt: SOURCE_REVIEWED_AT, expiresAt: SOURCE_EXPIRES_AT });
/** Public education: no patient data, automatic submission, payment or individualized legal conclusion. */
const publicPlaybooks = Object.freeze([
  playbook({
    id: 'collections', title: 'A collector contacted me',
    summary: 'Verify the notice, preserve your response options, and keep court deadlines separate.',
    applicability: 'For a debt-collection contact. Original-provider bills, court papers, credit reporting and debt-collector notices have different processes. State rules may add protections.',
    steps: [
      'Verify the collector and creditor using trusted contact information before sharing financial details.',
      'Find the validation notice and its dispute end date. Ask for the creditor, itemized amount and information linking the debt to you.',
      'If you dispute the debt, respond in writing through the verified channel promptly. A qualifying written dispute within the notice’s 30-day period can require the collector to pause collection of the disputed amount until verification; this is not debt cancellation.',
      'Keep the notice, a copy of what you sent and proof of delivery locally. The app does not submit this request.',
      'If you have court papers, a judgment or questions about old debt, contact legal aid or a qualified attorney promptly. A collector dispute does not replace a court response.',
    ],
    draft: 'I am requesting information about the debt identified in your notice. Please identify the current and original creditor, provide an itemized calculation of the amount, and explain the records connecting this debt to me. [If accurate, describe the amount or part you dispute and the reason.] Please respond through [my chosen contact method].',
    sourceIds: ['cfpb-collection-contact', 'cfpb-debt-validation', 'cfpb-debt-legal-process'],
    limitations: ['Confirm the applicable notice and deadline; GoldRock does not calculate them from a generic collection call.', 'Do not add a denial of owing the debt unless it reflects your facts.'],
  }),
  playbook({
    id: 'payment-plans', title: 'Compare payment options',
    summary: 'Check assistance first, then compare the full cost and terms of each option.',
    applicability: 'For a confirmed provider balance. An EOB alone is not a payment request. Financing terms and assistance rules are provider-specific.',
    steps: [
      'Check the bill, insurance processing and hospital assistance before committing to a payment product.',
      'Ask the provider for an interest-free direct payment plan and whether assistance or a discount can still apply.',
      'For each offer, record the creditor, financed amount, total cost, interest rate, term, fees and what happens after a missed payment.',
      'Distinguish deferred interest from true zero interest. Ask whether interest can be charged back to the purchase date and whether minimum payments clear the balance before a promotional period ends.',
      'Request the agreement in writing and check that the installment fits your budget. Confirm whether the original provider balance will be paid and which obligations remain.',
    ],
    draft: 'Please provide your financial-assistance options and any interest-free direct payment plan. For each financing alternative, show the total repayment amount, interest and fees, promotional end date, required payment to clear the balance in time, and consequences of late payment. I would like to review the written terms before agreeing.',
    sourceIds: ['cfpb-medical-financing', 'cfpb-medical-debt', 'irs-financial-assistance', 'cms-eob'],
    limitations: ['A small monthly installment does not establish an affordable total cost.', 'No loan, payment, discount or collection hold is arranged by this playbook.'],
  }),
  playbook({
    id: 'failed-request', title: 'My first request did not work',
    summary: 'Separate a missing response, an incomplete application and a final decision before escalating.',
    applicability: 'For an unanswered or declined billing, assistance or insurance request. The next reviewer depends on the actual decision and plan or hospital policy.',
    steps: [
      'Check whether the recipient received the request. Save a reference number, receipt and the response locally.',
      'Ask whether the request is incomplete or denied, and request the specific missing item or written reason.',
      'For insurance, follow the actual denial’s next-level appeal instructions and ask whether external review or an urgent process applies. Medicare and Medicaid use their own routes.',
      'For hospital assistance, ask for the applicable policy, reconsideration route and explanation of covered or excluded billers.',
      'If unresolved, use the appropriate official consumer-assistance or complaint route. Preserve any separate appeal, payment or court deadline; an escalation is not an automatic extension.',
    ],
    draft: 'I previously requested [describe the request] and have [receipt/reference]. Please confirm its status and provide the written decision or identify exactly what is missing. If the request was denied, please explain the reason, relevant policy, next review channel and deadline. Please also confirm whether any payment or collection hold exists and when it ends.',
    sourceIds: ['healthcare-appeals', 'healthcare-external-review', 'irs-financial-assistance', 'medicare-appeals', 'medicaid-appeals', 'cms-medical-bill-rights'],
    limitations: ['An external review is not available for every billing disagreement.', 'A hospital discount request is distinct from an insurance coverage appeal.'],
  }),
  playbook({
    id: 'before-care', title: 'Plan before scheduled care',
    summary: 'Clarify who may bill, coverage requirements and written estimates.',
    applicability: 'For scheduled care when there is time to compare options. Do not delay urgent or medically necessary treatment for price research.',
    steps: [
      'Ask the provider which services, facility, clinicians, labs and other billers are expected.',
      'If using insurance, verify network status for the exact plan, coverage, referral and authorization requirements directly with the plan.',
      'Ask for a written estimate with included services, expected separate bills, assumptions and what could change the cost.',
      'If not using insurance, ask about the applicable good faith estimate process and get estimates from relevant separate providers.',
      'Keep the estimates and plan confirmations locally. Compare the later bill and EOB to the same services and provider.',
    ],
    draft: 'Please identify the services and separate providers expected for my scheduled care and give me a written estimate showing what is included and what could change. I will confirm network status, coverage and authorization with my plan. If I am not using insurance, please explain the good faith estimate process and which other providers I should ask for estimates.',
    sourceIds: ['cms-price-transparency', 'healthcare-preauthorization', 'cms-gfe-dispute'],
    limitations: ['Prior authorization does not guarantee full payment.', 'An estimate is not a final balance or an automatic entitlement to a particular price.'],
  }),
]);

function getPlaybook(id, { now = new Date() } = {}) {
  const item = publicPlaybooks.find(value => value.id === id);
  if (!item) return null;
  const current = item.sourceIds.every(sourceId => getSource(sourceId, { now })?.current);
  return { ...item, current, steps: current ? [...item.steps] : [], draft: current ? item.draft : '', limitations: [...item.limitations, ...(current ? [] : ['This playbook needs a fresh source review before use. Open the official sources for current information.'])] };
}
function listPublicPlaybooks(options) { return publicPlaybooks.map(item => getPlaybook(item.id, options)); }

// countermeasures.js: a3170d4e22a4d166d9c9407cc2574453db1ea79f21f72be77158025c06dc5d51

const COUNTERMEASURE_RESPONSES = Object.freeze(['prepare','no_reply','more_info','denied']);
const COUNTERMEASURE_CATEGORIES = Object.freeze(['bill','coverage','assistance','collections','before-care']);
const routeCatalog = [...billingRoutes,...insuranceRoutes,...priceRoutes,...scenarioPlaybooks];
const copyRoute = route => JSON.parse(JSON.stringify(route));
const emptyMove = move => ({title:move.title,steps:[],draft:''});

/** The selection and any edited drafts stay local. No clinical inference or network call. */
function getCountermeasure(id, { now = new Date() } = {}) {
  const raw = routeCatalog.find(route => route.id === id);
  if (!raw) return null;
  const route = copyRoute(raw);
  const time = new Date(now).getTime();
  const current = Number.isFinite(time) && time >= Date.parse(SOURCE_REVIEWED_AT) && time < Date.parse(SOURCE_EXPIRES_AT) && route.sourceIds.length > 0 && route.sourceIds.every(sourceId => getSource(sourceId,{now})?.current);
  if (!current) {
    route.firstMove = emptyMove(route.firstMove);
    route.responses = Object.fromEntries(Object.entries(route.responses).map(([key,move]) => [key,emptyMove(move)]));
    route.verify = [];
    if (route.evidence) route.evidence = [];
    if (route.counterQuestions) route.counterQuestions = [];
    route.watchouts = ['This route needs a fresh source review. Open the official sources before preparing a request.'];
  }
  return {...route,reviewedAt:SOURCE_REVIEWED_AT,expiresAt:SOURCE_EXPIRES_AT,current};
}

function listCountermeasures(options) {
  return routeCatalog.map(route => getCountermeasure(route.id,options));
}

function getCountermeasureMove(id, response='prepare', options) {
  if (!COUNTERMEASURE_RESPONSES.includes(response)) return null;
  const route = getCountermeasure(id,options);
  if (!route) return null;
  const move = response === 'prepare' ? route.firstMove : route.responses[response];
  return {...move,routeId:id,response,sourceIds:[...route.sourceIds],current:route.current,reviewedAt:route.reviewedAt,expiresAt:route.expiresAt,applicability:route.appliesWhen};
}

/** Suggestions explain their limited matching signal; they never assert a problem exists. */
function recommendCountermeasures(input, options) {
  const facts = validateFacts(input);
  const labels = {bill:'provider bill',eob:'insurance explanation',denial:'denial notice',estimate:'estimate',understand:'understand the document',check:'check the bill',afford:'find an affordable path',appeal:'challenge a decision',plan:'plan before care'};
  return listCountermeasures(options).flatMap(route => {
    const triggers = route.triggers;
    // Collection contact cannot be inferred from having a bill or a high balance.
    if (!route.current || route.recommendationMode === 'manual-only' || route.category === 'collections' || !triggers.coverage.includes(facts.coverage)) return [];
    const documentMatch = triggers.documentTypes.includes(facts.documentType);
    const goalMatch = triggers.goals.includes(facts.goal);
    if (!documentMatch || !goalMatch) return [];
    if (triggers.anyOf?.length && !triggers.anyOf.some(clause => Object.entries(clause).every(([field,value]) => facts[field] === value))) return [];
    return [{...route,matchReasons:[`You selected a ${labels[facts.documentType] || facts.documentType} and want to ${labels[facts.goal] || facts.goal}.`, 'Confirm the checks in this route; this suggestion does not establish eligibility, a billing error or a payment hold.']}];
  });
}

// knowledge.js: 8f59ac766aef7f86c2ba15d19883643669f9f4b46c5c20787a10314e6715dfb6

const knowledgeCopy = value => JSON.parse(JSON.stringify(value));
const knowledgeTokens = value => String(value ?? '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) || [];
const knowledgeStopWords = new Set('a an and are as at be can do does for from how i in is it me my of on or the this to was what when why with you your'.split(' '));
const knowledgeQueryTokens = value => [...new Set(knowledgeTokens(value).filter(token => !knowledgeStopWords.has(token)))];
const knowledgeReviewNotice = 'This answer needs a fresh source review. Open the official sources and verify the current process before acting.';
const knowledgeCatalog = [...knowledgeConcepts, ...exceptionConcepts, ...scenarioKnowledgeConcepts, ...countermeasureConcepts];

/** Reviewed public knowledge. Queries and case matching are entirely device-local. */
function getKnowledge(id, { now = new Date() } = {}) {
  const raw = knowledgeCatalog.find(record => record.id === id);
  if (!raw) return null;
  const record = knowledgeCopy(raw);
  const reviewedAt = record.reviewedAt || SOURCE_REVIEWED_AT;
  const sourceRecords = record.sourceIds.map(sourceId => getSource(sourceId, { now })).filter(Boolean);
  const expirations = [record.expiresAt || SOURCE_EXPIRES_AT, ...sourceRecords.map(source => source.expiresAt)];
  const expiresAt = new Date(Math.min(...expirations.map(value => Date.parse(value)))).toISOString();
  const time = new Date(now).getTime();
  const localDate = new Date(now);
  const localDay = `${localDate.getFullYear()}-${String(localDate.getMonth()+1).padStart(2,'0')}-${String(localDate.getDate()).padStart(2,'0')}`;
  const current = Number.isFinite(time) && time >= Date.parse(reviewedAt) && time < Date.parse(expiresAt) && (!record.validThroughDate || localDay <= record.validThroughDate)
    && record.sourceIds.length > 0 && sourceRecords.length === record.sourceIds.length && sourceRecords.every(source => source.current);
  if (!current) {
    record.summary = knowledgeReviewNotice;
    record.mechanism = '';
    for (const field of ['actions', 'verify', 'avoid', 'evidence', 'completion']) record[field] = [];
    if (record.counterQuestions) record.counterQuestions = [];
    if (record.responseBranches) record.responseBranches = {};
  }
  return { ...record, reviewedAt, expiresAt, current };
}

function listKnowledge(options) { return knowledgeCatalog.map(record => getKnowledge(record.id, options)); }
function getKnowledgeCategories() { return [...new Set(knowledgeCatalog.map(record => record.category))]; }

function knowledgeMatchesScope(record, facts) {
  if (!facts) return true;
  // Unknown is a separate allowed value, never a guess that someone has private coverage.
  return record.coverage.includes(facts.coverage)
    && record.documentTypes.includes(facts.documentType)
    && record.goals.includes(facts.goal);
}

/** Lexical retrieval, not an AI answer or a determination that a protection applies. */
function searchKnowledge(query = '', { facts, category, limit = 12, now = new Date() } = {}) {
  const checkedFacts = facts ? validateFacts(facts) : null;
  const tokens = knowledgeQueryTokens(String(query).slice(0, 400));
  const maxResults = Number.isSafeInteger(limit) ? Math.max(0, Math.min(256, limit)) : 12;
  return listKnowledge({ now }).flatMap(record => {
    if (category && category !== 'all' && record.category !== category) return [];
    if (!knowledgeMatchesScope(record, checkedFacts)) return [];
    const primary = new Set(knowledgeTokens([record.title, record.question, ...record.tags].join(' ')));
    const secondary = new Set(knowledgeTokens([record.summary, record.mechanism, ...record.actions, ...record.verify].join(' ')));
    const matched = tokens.filter(token => primary.has(token) || secondary.has(token));
    if (tokens.length && matched.length === 0) return [];
    const score = matched.reduce((sum, token) => sum + (primary.has(token) ? 6 : 1), 0) + (matched.length === tokens.length && tokens.length ? 4 : 0);
    const matchReasons = [];
    // Do not echo query text: it may contain identifiers. Only curated explanations leave this function.
    if (tokens.length) matchReasons.push('Matches terms in this reviewed answer.');
    if (checkedFacts) matchReasons.push('Within the document, goal and coverage categories you selected. Confirm the answer’s checks; this is not an eligibility decision.');
    return [{ ...record, score, matchReasons }];
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, maxResults);
}

/**
 * Supplemental model context is restricted to the already-approved canonical source set.
 * No query, local workbook, raw document or new identifier is accepted by this boundary.
 */
function retrieveKnowledgeForGuidance(facts, base, { now = new Date(), limit = 6 } = {}) {
  const allowedSources = new Set(Array.isArray(base?.sourceIds) ? base.sourceIds : []);
  const query = [facts.documentType, facts.goal, facts.claimStatus, facts.denialReason,
    ...(base?.findings || []).map(item => item.title), ...(base?.actions || []).map(item => item.title)].filter(Boolean).join(' ');
  return searchKnowledge(query, { facts, limit: 100, now }).filter(record => record.current && !record.manualOnly && record.sourceIds.every(id => allowedSources.has(id)))
    .slice(0, Math.max(0, Math.min(10, Number.isSafeInteger(limit) ? limit : 6)))
    .map(({ id, title, question, summary, mechanism, actions, verify, avoid, evidence, completion, sourceIds, reviewedAt, expiresAt }) =>
      ({ id, title, question, summary, mechanism, actions, verify, avoid, evidence, completion, sourceIds, reviewedAt, expiresAt }));
}

// case-workbook.js: b0b05ba25675fede30c3b3ea27dc76e5ab2dca098146d21002aef8603fb43a24
/** Device-local case work. Never pass this object to the analysis API.
 * Records describe what a person entered; they are not independent verification,
 * legal deadline calculations, filed requests, receipt confirmation or approvals.
 */
const WORKBOOK_VERSION = 1;
const PROCESS_KINDS = Object.freeze(['appeal','correction','assistance','billing_hold','collection','court','estimate_dispute']);
const PROCESS_STATUSES = Object.freeze(['preparing','in_progress','waiting','resolved','closed']);
const EVIDENCE_KINDS = Object.freeze(['bill','eob','denial','estimate','policy','plan','receipt','letter','note','other']);
const CRITERION_ASSESSMENTS = Object.freeze(['unknown','supported','missing','disputed']);
const DEADLINE_KINDS = Object.freeze(['filing','response','follow_up','court','other']);
const COMMUNICATION_CHANNELS = Object.freeze(['portal','mail','fax','phone','email','in_person','other']);
const COMMUNICATION_DIRECTIONS = Object.freeze(['outgoing','incoming']);
const HOLD_SCOPES = Object.freeze(['billing','collections','both','other']);
const HOLD_STATUSES = Object.freeze(['requested','confirmed','denied','expired','released']);
const OUTCOME_DECISIONS = Object.freeze(['approved','partly_approved','denied','withdrawn','resolved_other']);
const WORKBOOK_LIMITS = Object.freeze({processes:30,evidence:200,criteria:50,deadlines:50,communications:100,holds:30,notes:4000,serializedCharacters:2_000_000});

class WorkbookError extends Error {
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

function createWorkbook(){return {version:WORKBOOK_VERSION,evidence:[],processes:[]};}
/** Calendar-only records follow the device's local day, not the UTC date. */
function localCalendarDate(date=new Date()){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))workbookFail('INVALID_WORKBOOK_DATE','Use a valid local calendar date.');
  return workbookDate(`${String(date.getFullYear()).padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`);
}
/** Strict validation returns a deep plain-data copy; unsupported future versions fail visibly. */
function validateWorkbook(input){
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
function addProcess(input,fields,options={}){
  workbookKeys(fields,['kind','title','notes'],['kind','title']);const workbook=validateWorkbook(input);
  workbook.processes.push({...workbookStamp(options),kind:fields.kind,title:fields.title,status:'preparing',notes:fields.notes??'',criteria:[],deadlines:[],communications:[],holds:[],outcome:null});
  return validateWorkbook(workbook);
}
function updateProcess(input,processId,patch,options={}){
  workbookKeys(patch,['title','status','notes','outcome']);const workbook=validateWorkbook(input),process=workbookProcess(workbook,processId);Object.assign(process,patch);workbookTouch(process,options);return validateWorkbook(workbook);
}
/** Deleting a process explicitly removes its local criteria/dates/history; shared evidence remains. */
function removeProcess(input,processId){const workbook=validateWorkbook(input);workbookProcess(workbook,processId);workbook.processes=workbook.processes.filter(process=>process.id!==processId);return validateWorkbook(workbook);}
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
const addEvidence=(w,fields,options)=>workbookAdd(w,null,'evidence',fields,options);
const updateEvidence=(w,id,patch,options)=>workbookUpdate(w,null,'evidence',id,patch,options);
const removeEvidence=(w,id,options)=>workbookRemove(w,null,'evidence',id,options);
const addCriterion=(w,p,fields,options)=>workbookAdd(w,p,'criteria',fields,options);
const updateCriterion=(w,p,id,patch,options)=>workbookUpdate(w,p,'criteria',id,patch,options);
const removeCriterion=(w,p,id,options)=>workbookRemove(w,p,'criteria',id,options);
const addDeadline=(w,p,fields,options)=>workbookAdd(w,p,'deadlines',fields,options);
const updateDeadline=(w,p,id,patch,options)=>workbookUpdate(w,p,'deadlines',id,patch,options);
const removeDeadline=(w,p,id,options)=>workbookRemove(w,p,'deadlines',id,options);
const addCommunication=(w,p,fields,options)=>workbookAdd(w,p,'communications',fields,options);
const updateCommunication=(w,p,id,patch,options)=>workbookUpdate(w,p,'communications',id,patch,options);
const removeCommunication=(w,p,id,options)=>workbookRemove(w,p,'communications',id,options);
const addHold=(w,p,fields,options)=>workbookAdd(w,p,'holds',fields,options);
const updateHold=(w,p,id,patch,options)=>workbookUpdate(w,p,'holds',id,patch,options);
const removeHold=(w,p,id,options)=>workbookRemove(w,p,'holds',id,options);

/** Summary is a view of user-entered records, never a legal clock or eligibility engine. */
function summarizeWorkbook(input,{today}={}){
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

// case-reconciliation.js: 1acceee66ea3422051f1aea492f39c7ab007b4881987d4937405cc526bf4bdab
/** User-entered local evidence and arithmetic. Never include this state in cloud facts.
 * Mutations append history to a new validated copy; no automatic matching or legal conclusions.
 */
const RECONCILIATION_VERSION = 1;
const RECONCILIATION_DOCUMENT_KINDS = Object.freeze(['bill','eob','estimate']);
const RECONCILIATION_PAYMENT_KINDS = Object.freeze(['payment','refund']);
const RECONCILIATION_LIMITS = Object.freeze({groups:30,documents:100,payments:300,selections:300,lines:100,serializedCharacters:2_000_000,amountCents:1_000_000_000});
class ReconciliationError extends Error {
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

function createReconciliation(){return {version:RECONCILIATION_VERSION,groups:[]};}
function validateReconciliation(input){
  if(input===undefined)return createReconciliation();
  reconciliationKeys(input,['version','groups']);
  if(input.version!==RECONCILIATION_VERSION)reconciliationFail('RECONCILIATION_VERSION_UNSUPPORTED','This local reconciliation version needs a supported migration.');
  const seen=new Set();for(const group of reconciliationArray(input.groups,RECONCILIATION_LIMITS.groups))reconciliationCheckGroup(group,seen);
  let encoded;try{encoded=JSON.stringify(input);}catch{reconciliationFail('INVALID_RECONCILIATION_DATA','Use plain serializable local records.');}
  if(encoded.length>RECONCILIATION_LIMITS.serializedCharacters)reconciliationFail('RECONCILIATION_LIMIT','This reconciliation exceeds the local record size limit.');
  return JSON.parse(encoded);
}
function reconciliationGroup(state,id){reconciliationId(id);const group=state.groups.find(record=>record.id===id);if(!group)reconciliationFail('RECONCILIATION_GROUP_NOT_FOUND','The selected billing group is not in this case.');return group;}
function addReconciliationGroup(input,fields,options={}){
  reconciliationKeys(fields,['label','billerLabel','serviceLabel','personLabel'],['label','billerLabel','serviceLabel']);const state=validateReconciliation(input);
  state.groups.push({...reconciliationStamp(options),personLabel:'',...fields,documents:[],payments:[],selections:[]});return validateReconciliation(state);
}
function addReconciliationDocument(input,groupId,fields,options={}){
  reconciliationKeys(fields,reconciliationDocumentFields,['kind','label']);const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  const lines=reconciliationArray(Object.hasOwn(fields,'lines')?fields.lines:[],RECONCILIATION_LIMITS.lines).map(line=>{reconciliationKeys(line,reconciliationLineFields,[]);return {label:'',code:null,amountCents:null,units:null,...line};});
  group.documents.push({...reconciliationStamp(options),documentDate:null,receivedDate:null,reference:'',revisionOfId:null,totalPatientResponsibilityCents:null,statementBalanceCents:null,estimateCents:null,...fields,lines});return validateReconciliation(state);
}
function addReconciliationPayment(input,groupId,fields,options={}){
  reconciliationKeys(fields,reconciliationPaymentFields,['kind','amountCents']);reconciliationChoice(fields.kind,RECONCILIATION_PAYMENT_KINDS);
  const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  group.payments.push({...reconciliationStamp(options),transactionDate:null,receiptReference:'',note:'',replacesId:null,...fields});return validateReconciliation(state);
}
function voidReconciliationPayment(input,groupId,paymentId,fields,options={}){
  reconciliationKeys(fields,['reason']);reconciliationText(fields.reason,2000,true);const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  group.payments.push({...reconciliationStamp(options),kind:'void',amountCents:null,transactionDate:null,receiptReference:'',note:fields.reason,replacesId:paymentId});return validateReconciliation(state);
}
function selectReconciliationDocuments(input,groupId,fields,options={}){
  reconciliationKeys(fields,reconciliationSelectionFields,['billId','eobId','estimateId','responsibilitySource','paymentsComplete']);const state=validateReconciliation(input),group=reconciliationGroup(state,groupId);
  group.selections.push({...reconciliationStamp(options),reason:'',...fields,paymentRecordIds:group.payments.map(payment=>payment.id)});return validateReconciliation(state);
}

function summarizeReconciliation(input){
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

// reconciliation-intake.js: 58d17098a537c862a1ab9fe4a806e05a8e90db1e2bde819cae39648f3a6c8131

/** Local suggestion only. This adapter cannot save, select evidence or create payments. */
const RECONCILIATION_INTAKE_VERSION = 1;
class ReconciliationIntakeError extends Error {
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

function proposeReconciliationIntake(input){
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

// money-recovery.js: 3b71a80f0fead35e09dfd877ebb55d3bd33b7c2f913b8078410381349b989701
/** Private, user-entered request history. No sending, entitlement decision, cloud facts or ledger mutation. */
const MONEY_RECOVERY_VERSION = 1;
const MONEY_RECOVERY_KINDS = Object.freeze(['refund','reimbursement']);
const MONEY_RECOVERY_EVENT_KINDS = Object.freeze(['preparation','submitted','acknowledged','more_info','decision','follow_up','receipt','reopened','closed']);
const MONEY_RECOVERY_LIMITS = Object.freeze({requests:30,events:300,label:160,reference:700,note:2000,draft:12000,checklist:30,checklistLabel:500,evidenceReferences:20,guideReceipt:20,amountCents:1_000_000_000,serializedCharacters:2_000_000});
class MoneyRecoveryError extends Error {
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

function createMoneyRecovery(){return {version:MONEY_RECOVERY_VERSION,requests:[]};}
function validateMoneyRecovery(input){
  if(input===undefined)return createMoneyRecovery();
  moneyRecoveryKeys(input,['version','requests']);if(input.version!==MONEY_RECOVERY_VERSION)moneyRecoveryFail('RECOVERY_VERSION_UNSUPPORTED','This local money recovery version needs a supported migration.');
  const seen=new Set();for(const request of moneyRecoveryArray(input.requests,MONEY_RECOVERY_LIMITS.requests))moneyRecoveryCheckRequest(request,seen);
  let encoded;try{encoded=JSON.stringify(input);}catch{moneyRecoveryFail('INVALID_RECOVERY_DATA','Use plain serializable local records.');}
  if(encoded.length>MONEY_RECOVERY_LIMITS.serializedCharacters)moneyRecoveryFail('RECOVERY_LIMIT','This money recovery history exceeds the local record size limit.');
  return JSON.parse(encoded);
}
function moneyRecoveryRequest(state,id){moneyRecoveryId(id);const request=state.requests.find(record=>record.id===id);if(!request)moneyRecoveryFail('RECOVERY_REQUEST_NOT_FOUND','The selected money recovery request is not in this case.');return request;}
function addRecoveryRequest(input,fields,options={}){
  moneyRecoveryKeys(fields,moneyRecoveryRequestFields,['kind','label','recipientLabel','scopeLabel']);const state=validateMoneyRecovery(input);
  state.requests.push({...moneyRecoveryStamp(options),personLabel:'',...fields,events:[]});return validateMoneyRecovery(state);
}
function addRecoveryEvent(input,requestId,fields,options={}){
  moneyRecoveryKeys(fields,moneyRecoveryEventFields,['kind']);moneyRecoveryChoice(fields.kind,MONEY_RECOVERY_EVENT_KINDS);
  const state=validateMoneyRecovery(input),request=moneyRecoveryRequest(state,requestId);
  request.events.push({...moneyRecoveryStamp(options),...moneyRecoveryEventDefaults(),...fields});return validateMoneyRecovery(state);
}
function voidRecoveryEvent(input,requestId,eventId,fields,options={}){
  moneyRecoveryKeys(fields,['reason']);moneyRecoveryText(fields.reason,MONEY_RECOVERY_LIMITS.note,true);const state=validateMoneyRecovery(input),request=moneyRecoveryRequest(state,requestId);
  request.events.push({...moneyRecoveryStamp(options),...moneyRecoveryEventDefaults(),kind:'void',note:fields.reason,replacesId:eventId});return validateMoneyRecovery(state);
}
function summarizeMoneyRecovery(input){
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

// recovery-guidance.js: c1b186e2dca791b10fe363e521fd2a2b25ea9b9b063bae28a96e14a84c9f8972
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

function getMoneyRecoveryGuide(kind,{now=new Date()}={}){
  if(!Object.hasOwn(recoveryGuideRecords,kind))return null;
  const entry=recoveryGuideRecords[kind],time=new Date(now).getTime();
  const current=Number.isFinite(time)&&time>=Date.parse(recoveryReviewedAt)&&time<Date.parse(recoveryExpiresAt);
  const sources=entry.sourceIds.map(id=>({id,...recoverySourceRecords[id],reviewedAt:recoveryReviewedAt,expiresAt:recoveryExpiresAt,current}));
  return {kind,title:entry.title,draft:current?entry.draft:'',checklist:current?[...entry.checklist]:[],sources,sourceIds:[...entry.sourceIds],current,reviewedAt:recoveryReviewedAt,expiresAt:recoveryExpiresAt,
    limitations:[...(current?[]:['This preparation guide needs a fresh source review. Open the official sources and verify the current route before using generated wording.']),...entry.limitations]};
}

// conversation-privacy.js: 5073c3a40f31d9cbb01f0b0391e4b3b897af16b8f1734443bbcb1745a6001b5e
/** A local review candidate, never a de-identification guarantee. Server validation never cleans input. */
const CONVERSATION_PRIVACY_LIMITS=Object.freeze({raw:20000,question:2000,answer:6000,history:4,knowledgeIds:6});
class ConversationPrivacyError extends Error {
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
function detectConversationIdentifiers(text){
  if(typeof text!=='string'||text.length>CONVERSATION_PRIVACY_LIMITS.raw)throw new ConversationPrivacyError();
  const normalized=text.normalize('NFKC'),flags=[];
  if(new RegExp(conversationPrivacyControls.source,'g').test(normalized))flags.push('control_characters');
  if(conversationLooksLikeDocument(normalized))flags.push('document_like_text');
  for(const check of conversationPrivacyPatterns)if([...normalized.matchAll(new RegExp(check.pattern.source,check.pattern.flags))].some(match=>conversationPrivacyMatchApplies(check,match[0]))&&!flags.includes(check.flag))flags.push(check.flag);
  return flags;
}
function prepareConversationCandidate(rawText){
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
function validateConversationRequest(input){
  conversationPrivacyObject(input,['question','history','knowledgeIds']);
  const question=conversationPrivacyText(input.question,CONVERSATION_PRIVACY_LIMITS.question);
  const history=conversationPrivacyArray(input.history,CONVERSATION_PRIVACY_LIMITS.history).map(pair=>{conversationPrivacyObject(pair,['question','answer']);return {question:conversationPrivacyText(pair.question,CONVERSATION_PRIVACY_LIMITS.question),answer:conversationPrivacyText(pair.answer,CONVERSATION_PRIVACY_LIMITS.answer)};});
  const ids=new Set();const knowledgeIds=conversationPrivacyArray(input.knowledgeIds,CONVERSATION_PRIVACY_LIMITS.knowledgeIds).map(id=>{if(typeof id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(id)||ids.has(id))throw new ConversationPrivacyError();ids.add(id);return id;});
  return {question,history,knowledgeIds};
}

// conversation.js: 8e1f941fde15f91fddc798af3a3f7760ce68c0d70d08213d91133be3baabd27e

/** Reviewed private conversation history. No networking or mutation of case facts. */
const CONVERSATION_VERSION=1;
const CONVERSATION_LIMITS=Object.freeze({turns:100,events:2,answer:6000,sourceReceipt:60,sourceIds:60,followUpQuestions:6,nextSteps:6,limitations:10,serializedCharacters:2_000_000});
class ConversationError extends Error{constructor(code,message){super(message);this.name='ConversationError';this.code=code;}}
const conversationFail=(code,message)=>{throw new ConversationError(code,message);};
function conversationObject(value,allowed,required=allowed){
  if(value===null||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))conversationFail('INVALID_CONVERSATION_FIELDS','Use a plain conversation record with supported fields.');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!allowed.includes(key)||!descriptors[key].enumerable||!Object.hasOwn(descriptors[key],'value')||descriptors[key].value===undefined)||required.some(key=>!Object.hasOwn(value,key)))conversationFail('INVALID_CONVERSATION_FIELDS','A conversation record has missing or unsupported fields.');
}
function conversationArray(value,max){
  if(!Array.isArray(value)||value.length>max||Reflect.ownKeys(value).length!==value.length+1||Object.keys(value).length!==value.length)conversationFail('CONVERSATION_LIMIT','Use bounded lists of plain conversation records.');
  for(let index=0;index<value.length;index++){const descriptor=Object.getOwnPropertyDescriptor(value,String(index));if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))conversationFail('INVALID_CONVERSATION_FIELDS','Conversation lists cannot contain missing or computed entries.');}return value;
}
function conversationText(value,max,required=true){
  if(typeof value!=='string'||value.length>max||(required&&!value.trim())||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/.test(value))conversationFail('INVALID_CONVERSATION_TEXT','Use bounded text without hidden control characters.');return value;
}
function conversationId(value){if(typeof value!=='string'||!/^cv_[A-Za-z0-9_-]{8,76}$/.test(value))conversationFail('INVALID_CONVERSATION_ID','The conversation identifier is invalid.');return value;}
function conversationInstant(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)||value<'1900-01-01T00:00:00.000Z'||value>'2200-12-31T23:59:59.999Z')conversationFail('INVALID_CONVERSATION_TIMESTAMP','The conversation timestamp is invalid.');
  const parsed=new Date(value);if(!Number.isFinite(parsed.getTime())||parsed.toISOString()!==value)conversationFail('INVALID_CONVERSATION_TIMESTAMP','The conversation timestamp is invalid.');return value;
}
function conversationStamp(options={}){
  conversationObject(options,['id','now'],[]);const id=Object.hasOwn(options,'id')?options.id:(globalThis.crypto?.randomUUID?`cv_${globalThis.crypto.randomUUID()}`:null);
  if(!id)conversationFail('LOCAL_RANDOM_UNAVAILABLE','Secure local identifiers are unavailable.');return {id:conversationId(id),createdAt:conversationInstant(Object.hasOwn(options,'now')?options.now:new Date().toISOString())};
}
function conversationCommon(record,seen,earliest=null){
  conversationId(record.id);if(seen.has(record.id))conversationFail('DUPLICATE_CONVERSATION_ID','Every conversation record needs a distinct identifier.');seen.add(record.id);
  conversationInstant(record.createdAt);if(earliest&&record.createdAt<earliest)conversationFail('INVALID_CONVERSATION_TIMESTAMP','A conversation record cannot precede its existing history.');
}
function conversationFacts(input){
  try{
    conversationObject(input,FACT_KEYS,[]);
    for(const key of Object.keys(input)){
      if(key==='lines'){
        for(const line of conversationArray(input.lines,100)){
          conversationObject(line,['id','code','amountCents','units']);
          for(const value of Object.values(line))if(value!==null&&!['string','number','boolean'].includes(typeof value)||typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))throw new Error();
        }
      }else{const value=input[key];if(value!==null&&!['string','number','boolean'].includes(typeof value)||typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))throw new Error();}
    }
    return validateFacts(input);
  }catch{conversationFail('INVALID_CONVERSATION_FACTS','Use only the approved structured facts for this conversation snapshot.');}
}
function conversationReviewedPayload(input){try{return validateConversationRequest(input);}catch{conversationFail('CONVERSATION_REVIEW_REQUIRED','Review the minimized question and context again before recording this turn.');}}
function conversationIdentifiers(input,max){
  const ids=new Set();return conversationArray(input,max).map(id=>{if(typeof id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(id)||ids.has(id))conversationFail('INVALID_CONVERSATION_SOURCE','Use distinct supported knowledge or source identifiers.');ids.add(id);return id;});
}
function conversationCheckReceipts(receipts){
  const ids=new Set();for(const receipt of conversationArray(receipts,CONVERSATION_LIMITS.sourceReceipt)){
    conversationObject(receipt,['id','reviewedAt','expiresAt']);conversationIdentifiers([receipt.id],1);
    if(ids.has(receipt.id))conversationFail('INVALID_CONVERSATION_SOURCE','Source receipts must have distinct identifiers.');ids.add(receipt.id);
    conversationInstant(receipt.reviewedAt);conversationInstant(receipt.expiresAt);
    if(receipt.expiresAt<=receipt.reviewedAt)conversationFail('INVALID_CONVERSATION_SOURCE','Source receipt expiry must follow its review timestamp.');
  }return ids;
}
function conversationCheckConsent(consent,facts){
  if(consent===null)return;
  conversationObject(consent,['policyVersion','approvedFields','processor','accepted','conversationReviewed']);
  if(typeof consent.policyVersion!=='string'||!/^[A-Za-z0-9._-]{1,120}$/.test(consent.policyVersion)||consent.processor!=='openai'||consent.accepted!==true||consent.conversationReviewed!==true)conversationFail('INVALID_CONVERSATION_CONSENT','Record the exact approved processor notice and conversation review receipt.');
  const fields=conversationArray(consent.approvedFields,FACT_KEYS.length);
  if(fields.some(field=>typeof field!=='string'||!FACT_KEYS.includes(field))||new Set(fields).size!==fields.length||JSON.stringify([...fields].sort())!==JSON.stringify(Object.keys(facts).sort()))conversationFail('INVALID_CONVERSATION_CONSENT','The consent receipt must identify exactly the approved fact fields.');
}
const conversationEventFields=['kind','jobId','answer','answerKind','sourceIds','followUpQuestions','nextSteps','limitations','sourceReceipt','errorCode'];
const conversationTurnFields=['question','history','historyTurnIds','knowledgeIds','facts','replyToId','consent'];
const conversationEventDefaults=()=>({jobId:null,answer:null,answerKind:null,sourceIds:[],followUpQuestions:[],nextSteps:[],limitations:[],sourceReceipt:[],errorCode:null});
const conversationNotice='Reviewed question and case facts, with source receipts. AI can be wrong; verify applicability before acting. A conversation does not submit a claim, contact anyone, establish entitlement or change your case facts. Privacy pattern checks do not certify de-identification.';
function conversationCheckEvent(event,turn){
  if(!['job','completed','failed','canceled'].includes(event.kind))conversationFail('INVALID_CONVERSATION_EVENT','Choose a supported conversation event.');
  if(event.kind==='job'){
    if(typeof event.jobId!=='string'||!/^job_[a-f0-9]{32}$/.test(event.jobId))conversationFail('INVALID_CONVERSATION_JOB','Use the returned processing job identifier.');
    if(turn.consent===null)conversationFail('INVALID_CONVERSATION_CONSENT','A cloud job requires the original approved consent receipt.');
  }else if(event.jobId!==null)conversationFail('INVALID_CONVERSATION_EVENT','Only a job event may bind a processing job.');
  if(event.kind==='failed'){
    if(typeof event.errorCode!=='string'||!/^[A-Z][A-Z0-9_]{0,79}$/.test(event.errorCode))conversationFail('INVALID_CONVERSATION_ERROR','Use a supported machine error code without provider text.');
  }else if(event.errorCode!==null)conversationFail('INVALID_CONVERSATION_EVENT','Only a failed event may record an error code.');
  if(event.kind==='completed'){
    conversationText(event.answer,CONVERSATION_LIMITS.answer);if(!['cloud','library'].includes(event.answerKind))conversationFail('INVALID_CONVERSATION_EVENT','Identify a cloud answer or an honestly labelled local library result.');
    if(event.answerKind==='cloud'&&turn.consent===null)conversationFail('INVALID_CONVERSATION_CONSENT','A cloud answer requires the original approved consent receipt.');
    const receiptIds=conversationCheckReceipts(event.sourceReceipt),sourceIds=conversationIdentifiers(event.sourceIds,CONVERSATION_LIMITS.sourceIds);
    if(sourceIds.some(id=>!receiptIds.has(id))||(event.answerKind==='cloud'&&(!receiptIds.size||!sourceIds.length)))conversationFail('INVALID_CONVERSATION_SOURCE','Answer citations must belong to the recorded grounding sources.');
    for(const question of conversationArray(event.followUpQuestions,CONVERSATION_LIMITS.followUpQuestions))conversationText(question,500);
    for(const step of conversationArray(event.nextSteps,CONVERSATION_LIMITS.nextSteps)){
      conversationObject(step,['title','steps','sourceIds']);conversationText(step.title,200);
      const steps=conversationArray(step.steps,6);if(!steps.length)conversationFail('INVALID_CONVERSATION_EVENT','A suggested next step must contain its instructions.');for(const text of steps)conversationText(text,1000);
      if(conversationIdentifiers(step.sourceIds,CONVERSATION_LIMITS.sourceIds).some(id=>!sourceIds.includes(id)))conversationFail('INVALID_CONVERSATION_SOURCE','Next-step citations must also appear in the answer citations.');
    }
    for(const limitation of conversationArray(event.limitations,CONVERSATION_LIMITS.limitations))conversationText(limitation,1000);
  }else{
    if(event.answer!==null||event.answerKind!==null)conversationFail('INVALID_CONVERSATION_EVENT','Only completion events can contain an answer.');
    for(const field of ['sourceIds','followUpQuestions','nextSteps','limitations','sourceReceipt'])if(conversationArray(event[field],0).length)conversationFail('INVALID_CONVERSATION_EVENT','Only completion events can contain answer data.');
  }
}
function createConversation(){return {version:CONVERSATION_VERSION,turns:[]};}
function validateConversation(input){
  if(input===undefined)return createConversation();conversationObject(input,['version','turns']);if(input.version!==CONVERSATION_VERSION)conversationFail('CONVERSATION_VERSION_UNSUPPORTED','This conversation version needs a supported migration.');
  const seen=new Set(),earlierTurns=new Map();let previousTurnAt=null;
  for(const turn of conversationArray(input.turns,CONVERSATION_LIMITS.turns)){
    conversationObject(turn,['id','createdAt',...conversationTurnFields,'events']);conversationCommon(turn,seen,previousTurnAt);previousTurnAt=turn.createdAt;
    conversationReviewedPayload({question:turn.question,history:turn.history,knowledgeIds:turn.knowledgeIds});const facts=conversationFacts(turn.facts);conversationCheckConsent(turn.consent,facts);
    if(turn.replyToId!==null){conversationId(turn.replyToId);if(!earlierTurns.has(turn.replyToId))conversationFail('INVALID_CONVERSATION_REPLY','Choose an earlier turn from this conversation as the follow-up reference.');}
    conversationArray(turn.historyTurnIds,4);
    if(turn.historyTurnIds.length!==turn.history.length||new Set(turn.historyTurnIds).size!==turn.historyTurnIds.length)conversationFail('INVALID_CONVERSATION_HISTORY','Every reviewed context pair needs its distinct originating turn.');
    for(const id of turn.historyTurnIds){
      conversationId(id);const origin=earlierTurns.get(id),answer=origin?.events.find(event=>event.kind==='completed');
      if(!origin||answer?.answerKind!=='cloud'||conversationFactsChanged(origin.facts,facts))conversationFail('INVALID_CONVERSATION_HISTORY','Context must come from earlier completed cloud turns with the same approved facts.');
    }
    let previousAt=turn.createdAt,hasJob=false,terminal=false;
    for(const event of conversationArray(turn.events,CONVERSATION_LIMITS.events)){
      conversationObject(event,['id','createdAt',...conversationEventFields]);conversationCommon(event,seen,previousAt);previousAt=event.createdAt;
      if(terminal)conversationFail('CONVERSATION_TURN_FINISHED','This turn is finished. A new request needs a new reviewed turn.');
      conversationCheckEvent(event,turn);
      if(event.kind==='job'){if(hasJob)conversationFail('CONVERSATION_JOB_ALREADY_BOUND','This turn already has a processing job.');hasJob=true;}
      else terminal=true;
    }
    earlierTurns.set(turn.id,turn);
  }
  let encoded;try{encoded=JSON.stringify(input);}catch{conversationFail('INVALID_CONVERSATION_DATA','Use plain serializable conversation records.');}
  if(encoded.length>CONVERSATION_LIMITS.serializedCharacters)conversationFail('CONVERSATION_LIMIT','This conversation exceeds the local record size limit.');return JSON.parse(encoded);
}
function conversationTurn(state,id){conversationId(id);const turn=state.turns.find(item=>item.id===id);if(!turn)conversationFail('CONVERSATION_TURN_NOT_FOUND','This turn is not in the selected case conversation.');return turn;}
function addConversationTurn(input,fields,options={}){
  conversationObject(fields,conversationTurnFields,['question','history','knowledgeIds','facts']);const state=validateConversation(input);
  const payload=conversationReviewedPayload({question:fields.question,history:fields.history,knowledgeIds:fields.knowledgeIds});const facts=conversationFacts(fields.facts);
  state.turns.push({...conversationStamp(options),...payload,historyTurnIds:Object.hasOwn(fields,'historyTurnIds')?fields.historyTurnIds:[],facts,replyToId:Object.hasOwn(fields,'replyToId')?fields.replyToId:null,consent:Object.hasOwn(fields,'consent')?fields.consent:null,events:[]});return validateConversation(state);
}
function appendConversationEvent(input,turnId,fields,options={}){
  conversationObject(fields,conversationEventFields,['kind']);const state=validateConversation(input),turn=conversationTurn(state,turnId);
  turn.events.push({...conversationStamp(options),...conversationEventDefaults(),...fields});return validateConversation(state);
}
function conversationFactsChanged(snapshot,current){return JSON.stringify(conversationFacts(snapshot))!==JSON.stringify(conversationFacts(current));}
function conversationSourcesCurrent(receipts,options={}){
  conversationObject(options,['now'],[]);const now=Object.hasOwn(options,'now')?options.now:new Date();
  conversationCheckReceipts(receipts);if(!receipts.length)return false;
  let time;try{time=new Date(now).getTime();}catch{return false;}if(!Number.isFinite(time))return false;
  return receipts.every(receipt=>{const source=getSource(receipt.id,{now:new Date(time)});return source?.current===true&&source.reviewedAt===receipt.reviewedAt&&source.expiresAt===receipt.expiresAt;});
}
function conversationContextEligible(state,turn,facts,now,checked=new Set()){
  if(facts===null||conversationFactsChanged(turn.facts,facts))return false;
  if(checked.has(turn.id))return true;checked.add(turn.id);
  return turn.historyTurnIds.every(id=>{
    const origin=state.turns.find(item=>item.id===id),answer=origin?.events.find(event=>event.kind==='completed');
    return answer?.answerKind==='cloud'&&!conversationFactsChanged(origin.facts,facts)&&conversationSourcesCurrent(answer.sourceReceipt,{now})&&conversationContextEligible(state,origin,facts,now,checked);
  });
}
function conversationTurnContextCurrent(input,turnId,options={}){
  conversationObject(options,['facts','now'],['facts']);const state=validateConversation(input),turn=conversationTurn(state,turnId),facts=conversationFacts(options.facts),now=Object.hasOwn(options,'now')?options.now:new Date();
  return !turn.events.some(event=>event.kind!=='job')&&conversationContextEligible(state,turn,facts,now);
}
function summarizeConversation(input,options={}){
  conversationObject(options,['facts','now'],[]);const state=validateConversation(input),currentFacts=Object.hasOwn(options,'facts')?conversationFacts(options.facts):null,now=Object.hasOwn(options,'now')?options.now:new Date();
  const turns=state.turns.map(turn=>{
    const job=turn.events.find(event=>event.kind==='job'),terminal=turn.events.find(event=>event.kind!=='job');
    const status=terminal?.kind??'pending',completed=status==='completed'?terminal:null;
    const factsChanged=currentFacts===null?null:conversationFactsChanged(turn.facts,currentFacts);
    const sourcesCurrent=completed?conversationSourcesCurrent(completed.sourceReceipt,{now}):false;
    const contextCurrent=conversationContextEligible(state,turn,currentFacts,now);
    const answerAvailable=Boolean(completed&&factsChanged===false&&sourcesCurrent&&contextCurrent);
    let canUseAsContext=answerAvailable&&completed.answerKind==='cloud';
    if(canUseAsContext)try{validateConversationRequest({question:turn.question,history:[{question:turn.question,answer:completed.answer}],knowledgeIds:[]});}catch{canUseAsContext=false;}
    const limitations=answerAvailable?[...completed.limitations]:completed?[factsChanged===null?'Select the current approved facts before reusing this historical answer.':factsChanged?'The approved facts have changed. This historical answer is withheld from current guidance and context.':'One or more answer or original-context source receipts are stale, changed or unavailable. This historical answer is withheld from current guidance and context.']:[];
    if(answerAvailable&&!canUseAsContext)limitations.push(completed.answerKind==='library'?'This is a local library response. Cloud conversation context currently uses completed cloud turns only.':'This answer needs another text privacy review before it can be included in outbound conversation context.');
    return {id:turn.id,createdAt:turn.createdAt,replyToId:turn.replyToId,question:turn.question,status,jobId:job?.jobId??null,terminalEventId:terminal?.id??null,errorCode:terminal?.errorCode??null,
      answerKind:completed?.answerKind??null,sourceIds:completed?.sourceIds??[],sourceReceipt:completed?.sourceReceipt??[],factsChanged,sourcesCurrent,contextCurrent,answerAvailable,canUseAsContext,
      answer:answerAvailable?completed.answer:null,followUpQuestions:answerAvailable?completed.followUpQuestions:[],nextSteps:answerAvailable?completed.nextSteps:[],limitations};
  });return {version:CONVERSATION_VERSION,turns,notice:conversationNotice};
}

// task-catalog.js: 6432dbd4326c27eb779ea86425b658e356766fd254913039ad6081586ad3830d

class TaskCatalogError extends Error {
  constructor(message, path = '') { super(message); this.name = 'TaskCatalogError'; this.code = 'INVALID_TASK_INTAKE'; this.path = path; }
}

const TASK_INTAKE_LIMITS = Object.freeze({ text: 240, textarea: 2000, select: 240, number: 30, date: 10, file: 240, totalCharacters: 16000 });

function taskCatalogClone(value) { return JSON.parse(JSON.stringify(value)); }
function taskCatalogFreeze(value) {
  if (value && typeof value === 'object') { for (const child of Object.values(value)) taskCatalogFreeze(child); Object.freeze(value); }
  return value;
}
function taskCatalogObject(value, keys, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TaskCatalogError('Expected a plain object.', path);
  if (Object.keys(value).some(key => !keys.includes(key))) throw new TaskCatalogError('Unknown field.', path);
}
function taskCatalogDate(value, path) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) throw new TaskCatalogError('Use an ISO timestamp.', path);
  const normalized = new Date(value).toISOString();
  if (normalized.slice(0, 19) !== value.slice(0, 19)) throw new TaskCatalogError('Invalid timestamp.', path);
  return normalized;
}

/** Freshness is for general public guidance, never a finding about this user's bill. */
function getSelfAdvocacyTask(id, { now = new Date() } = {}) {
  const task = selfAdvocacyTasks.find(item => item.id === id);
  if (!task) return null;
  const receipts = task.sourceIds.map(sourceId => getSource(sourceId, { now }));
  const current = receipts.length > 0 && receipts.every(source => source?.current === true);
  const result = taskCatalogClone(task);
  return { ...result, current, sources: receipts.filter(Boolean),
    prepare: current ? result.prepare : [], evidence: current ? result.evidence : [],
    conversationStarter: current ? result.conversationStarter : `Help me identify the information I need for this task: ${result.title}. The public guidance needs source review; do not assume a policy or legal right.`,
    limitations: current ? result.limitations : ['The public guidance needs source review. Your private preparation remains available.', ...result.limitations] };
}

/** Optional local-only snapshot. Missing answers and false checkboxes remain distinct. */
function validateTaskIntake(input) {
  taskCatalogObject(input, ['version', 'taskId', 'values', 'completedAt'], 'taskIntake');
  if (input.version !== 1) throw new TaskCatalogError('Unsupported task preparation version.', 'version');
  const task = selfAdvocacyTasks.find(item => item.id === input.taskId);
  if (!task) throw new TaskCatalogError('Unknown task.', 'taskId');
  taskCatalogObject(input.values, task.intakeFields.map(field => field.id), 'values');
  let size = 0;
  const values = {};
  for (const [id, value] of Object.entries(input.values)) {
    const field = task.intakeFields.find(item => item.id === id);
    if (field.type === 'checkbox') {
      if (typeof value !== 'boolean') throw new TaskCatalogError('Record true, false, or leave the answer absent.', `values.${id}`);
    } else {
      if (typeof value !== 'string' || value.length > TASK_INTAKE_LIMITS[field.type] || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/u.test(value)) throw new TaskCatalogError('Invalid or oversized local answer.', `values.${id}`);
      if (field.type !== 'textarea' && /[\r\n\t]/.test(value)) throw new TaskCatalogError('Use a single-line answer.', `values.${id}`);
      if (value && field.type === 'select' && !field.options?.includes(value)) throw new TaskCatalogError('Choose a listed option or leave the answer blank.', `values.${id}`);
      if (value && field.type === 'number' && !/^(?:0|[1-9]\d{0,11})(?:\.\d{1,4})?$/.test(value)) throw new TaskCatalogError('Use a nonnegative decimal, without currency symbols or an exponent.', `values.${id}`);
      if (value && field.type === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value + 'T00:00:00.000Z')) || new Date(value + 'T00:00:00.000Z').toISOString().slice(0, 10) !== value)) throw new TaskCatalogError('Use a real calendar date or leave it unknown.', `values.${id}`);
      size += value.length;
    }
    values[id] = value;
  }
  if (size > TASK_INTAKE_LIMITS.totalCharacters) throw new TaskCatalogError('Local preparation is too large.', 'values');
  if (!Object.hasOwn(input, 'completedAt')) throw new TaskCatalogError('A preparation timestamp or null is required.', 'completedAt');
  const completedAt = input.completedAt === null ? null : taskCatalogDate(input.completedAt, 'completedAt');
  return { version: 1, taskId: task.id, values, completedAt };
}

function createTaskIntake(taskId, values = {}, { now = new Date() } = {}) {
  const date = new Date(now);
  if (!Number.isFinite(date.getTime())) throw new TaskCatalogError('Invalid preparation time.', 'now');
  return validateTaskIntake({ version: 1, taskId, values, completedAt: date.toISOString() });
}

/** Task intents and intake fields restored from the original GoldRock repository.
 * Prompts, outcome statistics, unsupported legal claims, and false professional personas are not reused.
 * Every answer is local preparation; source coverage is deliberately narrower than task breadth. */
const TASK_CATEGORIES = Object.freeze([
  {
    "id": "advanced-financial",
    "title": "Debt and financial questions"
  },
  {
    "id": "appeal-system",
    "title": "Appeal stages"
  },
  {
    "id": "automation",
    "title": "Ongoing bill organization"
  },
  {
    "id": "beginner",
    "title": "Start here"
  },
  {
    "id": "coding-intelligence",
    "title": "Coding questions"
  },
  {
    "id": "core",
    "title": "Bill Advocate essentials"
  },
  {
    "id": "coverage-expansion",
    "title": "Coverage options"
  },
  {
    "id": "denial-reversal",
    "title": "Denial evidence"
  },
  {
    "id": "emergency",
    "title": "Emergency bills"
  },
  {
    "id": "facility",
    "title": "Hospital stay"
  },
  {
    "id": "financial",
    "title": "Payment and assistance"
  },
  {
    "id": "hardship-mastery",
    "title": "Financial assistance"
  },
  {
    "id": "hospital-insider",
    "title": "Hospital follow-through"
  },
  {
    "id": "insider",
    "title": "Billing and plan review"
  },
  {
    "id": "insurance",
    "title": "Coverage and claims"
  },
  {
    "id": "insurance-mastery",
    "title": "Plan-specific questions"
  },
  {
    "id": "legal-pro",
    "title": "Complaints and legal questions"
  },
  {
    "id": "provider",
    "title": "Provider charges"
  },
  {
    "id": "specialty",
    "title": "Specialty bills"
  }
]);
const selfAdvocacyTasks = Object.freeze([
  {
    "id": "upload-medical-bill",
    "title": "Review a medical bill",
    "category": "core",
    "purpose": "Separate the statement, claim explanation, and supporting records before deciding what to question.",
    "intakeFields": [
      {
        "id": "billFile",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": true,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "accountNumber",
        "label": "Account Number",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": false,
        "description": "Date of service or admission",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the biller and service group; compare only matching documents",
      "Locate the current EOB and record the displayed balance separately from total patient responsibility",
      "List unclear lines for the billing office to explain"
    ],
    "evidence": [
      "Current bill",
      "Matching EOB",
      "Earlier statements and receipts"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review a medical bill. Separate the statement, claim explanation, and supporting records before deciding what to question. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 41,
      "endLine": 148,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "find-overcharges",
    "title": "Check unexpected charges",
    "category": "core",
    "purpose": "Build a specific charge question with evidence rather than assume a high price is an error.",
    "intakeFields": [
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Enter total amount owed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "Hospital",
          "Emergency Room",
          "Surgical Center",
          "Urgent Care",
          "Clinic",
          "Laboratory",
          "Imaging Center",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceType",
        "label": "Type of Service",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Surgery",
          "Diagnostic Tests",
          "Imaging",
          "Laboratory",
          "Consultation",
          "Procedure",
          "Admission",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billDetails",
        "label": "Bill Details",
        "type": "textarea",
        "required": false,
        "placeholder": "Paste line items, codes, or specific charges you question",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the exact charge, units, code, and service date",
      "Compare the billed description with your records of the service",
      "Ask for the calculation and correction review in writing"
    ],
    "evidence": [
      "Itemized statement",
      "Service records",
      "EOB adjustments"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Check unexpected charges. Build a specific charge question with evidence rather than assume a high price is an error. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 148,
      "endLine": 250,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "get-itemized-bill",
    "title": "Request an itemized bill",
    "category": "core",
    "purpose": "Prepare a request for the detail needed to review a summary statement.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital/Provider",
        "type": "text",
        "required": true,
        "placeholder": "Full facility name",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "accountNumber",
        "label": "Account Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": true,
        "description": "Date of service or admission",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "patientAddress",
        "label": "Patient Address",
        "type": "textarea",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      }
    ],
    "prepare": [
      "Identify which biller issued the summary",
      "Ask for service dates, descriptions, codes, units, and payment adjustments",
      "Ask how to obtain the detailed statement and record the response"
    ],
    "evidence": [
      "Summary statement",
      "Biller contact from a trusted source",
      "Request and response record"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Request an itemized bill. Prepare a request for the detail needed to review a summary statement. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 250,
      "endLine": 387,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "getting-started-bill-review",
    "title": "Start with a new bill",
    "category": "beginner",
    "purpose": "Choose an understandable first step from the document and insurance situation.",
    "intakeFields": [
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "What is the total amount you owe?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "visitType",
        "label": "Type of Visit",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Room",
          "Hospital Stay",
          "Surgery",
          "Doctor Visit",
          "Diagnostic Test",
          "Laboratory",
          "X-ray/Imaging",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hadInsurance",
        "label": "Did you have insurance?",
        "type": "select",
        "required": true,
        "options": [
          "Yes - Insurance covered some",
          "Yes - Insurance denied",
          "No - No insurance",
          "Not sure"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "mainConcern",
        "label": "What concerns you most?",
        "type": "select",
        "required": true,
        "options": [
          "Bill seems too high",
          "Charged for things I didn't receive",
          "Insurance should have covered more",
          "Want to understand the charges",
          "Need help negotiating payment"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Determine whether this is a bill, estimate, denial, or EOB",
      "Identify which person, biller, and service the document covers",
      "Write one question about the amount or claim before contacting billing"
    ],
    "evidence": [
      "Document type",
      "Coverage used",
      "Main concern"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Start with a new bill. Choose an understandable first step from the document and insurance situation. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 387,
      "endLine": 443,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "simple-itemized-request",
    "title": "Make a simple bill request",
    "category": "beginner",
    "purpose": "Ask the billing office for a readable breakdown without needing technical codes first.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital or Provider",
        "type": "text",
        "required": true,
        "placeholder": "Where did you receive care?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "visitDate",
        "label": "Date of Visit",
        "type": "date",
        "required": true,
        "description": "When did you receive care?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "emailPreference",
        "label": "Preferred Response Method",
        "type": "select",
        "required": true,
        "options": [
          "Email (fastest)",
          "Mail (traditional)",
          "Either email or mail"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Locate the billing office on an authentic statement",
      "Request the itemized version and preferred response method",
      "Keep a local note of when and how the request was made"
    ],
    "evidence": [
      "Summary bill",
      "Service reference",
      "Contact log"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Make a simple bill request. Ask the billing office for a readable breakdown without needing technical codes first. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 443,
      "endLine": 499,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "basic-overcharge-detector",
    "title": "Spot charges to check",
    "category": "beginner",
    "purpose": "Turn a remembered service mismatch into a question for the provider.",
    "intakeFields": [
      {
        "id": "billType",
        "label": "What type of bill?",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Room visit",
          "Hospital stay (1-2 days)",
          "Hospital stay (3+ days)",
          "Outpatient surgery",
          "Diagnostic tests only",
          "Doctor consultation",
          "Multiple visits/treatments"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "stayLength",
        "label": "If hospitalized, how long?",
        "type": "select",
        "required": false,
        "options": [
          "Same day",
          "1 night",
          "2-3 nights",
          "4-7 nights",
          "Over 1 week",
          "Not applicable"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "mainServices",
        "label": "Main services received",
        "type": "textarea",
        "required": false,
        "placeholder": "List the main treatments, tests, or procedures (e.g., blood work, X-ray, IV fluids, surgery type)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "suspiciousCharges",
        "label": "Charges that seem wrong",
        "type": "textarea",
        "required": false,
        "placeholder": "Any specific charges that surprised you or seem too high?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Compare dates and quantities with your own records",
      "Distinguish a duplicate statement from duplicate services",
      "Ask what each unclear charge represents before calling it incorrect"
    ],
    "evidence": [
      "Itemized lines",
      "Visit or stay dates",
      "Earlier bills"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Spot charges to check. Turn a remembered service mismatch into a question for the provider. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 499,
      "endLine": 555,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "quick-dispute-letter",
    "title": "Prepare a billing correction request",
    "category": "beginner",
    "purpose": "Describe a specific suspected error and the change you are asking the biller to investigate.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital Name",
        "type": "text",
        "required": true,
        "placeholder": "Full name of hospital or clinic",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "errorType",
        "label": "Type of Error Found",
        "type": "select",
        "required": true,
        "options": [
          "Charged for services not received",
          "Duplicate/double charges",
          "Wrong dates or quantities",
          "Overcharged for basic items",
          "Insurance should have covered this",
          "Billed wrong person/account",
          "Other billing mistake"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "specificError",
        "label": "Describe the Specific Error",
        "type": "textarea",
        "required": true,
        "placeholder": "Explain exactly what's wrong (e.g., \"Charged $200 for 5 aspirin pills\" or \"Billed for room service I never ordered\")",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "requestedAction",
        "label": "What do you want?",
        "type": "select",
        "required": true,
        "options": [
          "Remove the incorrect charges",
          "Reduce overcharged items to fair price",
          "Apply my insurance coverage",
          "Correct the billing error",
          "Provide explanation for charges"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "State the disputed line and reason without inventing wrongdoing",
      "List supporting documents and the requested correction or explanation",
      "Keep the response and any revised statement as separate evidence"
    ],
    "evidence": [
      "Disputed line",
      "Supporting record",
      "Requested outcome"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a billing correction request. Describe a specific suspected error and the change you are asking the biller to investigate. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 555,
      "endLine": 616,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "medical-codes-guide",
    "title": "Ask about billing codes",
    "category": "beginner",
    "purpose": "Prepare code and modifier questions for qualified billing staff.",
    "intakeFields": [
      {
        "id": "cptCodes",
        "label": "CPT Codes (Procedure Codes)",
        "type": "textarea",
        "required": false,
        "placeholder": "Enter any 5-digit codes from your bill (e.g., 99213, 71020, 85025)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "icdCodes",
        "label": "ICD Codes (Diagnosis Codes)",
        "type": "textarea",
        "required": false,
        "placeholder": "Enter diagnosis codes if shown (e.g., Z00.00, M25.50)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "actualServices",
        "label": "What Services Did You Actually Receive?",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe what was actually done (e.g., doctor examined my knee, took blood, got chest X-ray)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "questionableServices",
        "label": "Any Services You Don't Remember?",
        "type": "textarea",
        "required": false,
        "placeholder": "Any procedures or tests listed that you don't remember having?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Copy codes exactly as printed and distinguish procedure from diagnosis codes",
      "Ask how the billed code relates to the documented service",
      "Ask whether units, modifiers, or separate components explain repeated entries"
    ],
    "evidence": [
      "Printed codes and modifiers",
      "Itemized descriptions",
      "Service record references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Ask about billing codes. Prepare code and modifier questions for qualified billing staff. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 616,
      "endLine": 683,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "simple-payment-negotiation",
    "title": "Ask about payment options",
    "category": "beginner",
    "purpose": "Compare assistance and repayment terms before agreeing to a monthly amount.",
    "intakeFields": [
      {
        "id": "billAmount",
        "label": "Total Amount Owed",
        "type": "number",
        "required": true,
        "placeholder": "What is your total bill amount?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "monthlyBudget",
        "label": "What Can You Afford Monthly?",
        "type": "number",
        "required": true,
        "placeholder": "Realistic monthly payment amount",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "financialSituation",
        "label": "Financial Situation",
        "type": "select",
        "required": true,
        "options": [
          "Limited income/fixed budget",
          "Temporary financial hardship",
          "Unemployed/job loss",
          "Student/low income",
          "Medical bills from multiple providers",
          "Other financial challenges"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hasBeenContacted",
        "label": "Has the hospital contacted you?",
        "type": "select",
        "required": true,
        "options": [
          "No contact yet",
          "Received bills in mail",
          "Got payment notices",
          "Been called about payment",
          "Sent to collections"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask about assistance and correction review first",
      "Request written interest, fees, term, and missed-payment conditions",
      "Use an affordable budget and confirm what happens while a request is reviewed"
    ],
    "evidence": [
      "Current balance",
      "Budget you choose to record",
      "Written payment terms"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Ask about payment options. Compare assistance and repayment terms before agreeing to a monthly amount. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 683,
      "endLine": 774,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-medical-debt",
      "cfpb-medical-financing"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "afford"
  },
  {
    "id": "appeal-dispute",
    "title": "Choose a dispute or appeal route",
    "category": "core",
    "purpose": "Separate provider billing corrections from a health-plan coverage appeal.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital Name",
        "type": "text",
        "required": true,
        "placeholder": "Full facility name",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount being disputed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "disputeType",
        "label": "Dispute Type",
        "type": "select",
        "required": true,
        "options": [
          "Billing Errors",
          "Overcharges",
          "Services Not Received",
          "Duplicate Charges",
          "Insurance Coverage Issues",
          "Quality of Care",
          "Financial Hardship"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "specificIssues",
        "label": "Specific Issues",
        "type": "textarea",
        "required": true,
        "placeholder": "Detail the specific charges or errors being disputed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "supportingEvidence",
        "label": "Supporting Evidence",
        "type": "textarea",
        "required": false,
        "placeholder": "Insurance EOB, medical records, previous communications",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify who made the decision and what notice explains it",
      "Ask which correction or formal appeal channel applies",
      "Record the actual notice deadline independently of phone discussions"
    ],
    "evidence": [
      "Bill or denial",
      "Decision reason",
      "Supporting correspondence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Choose a dispute or appeal route. Separate provider billing corrections from a health-plan coverage appeal. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 774,
      "endLine": 866,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "emergency-room-dispute",
    "title": "Review an emergency-room bill",
    "category": "emergency",
    "purpose": "Separate emergency facility and clinician charges and identify what needs explanation.",
    "intakeFields": [
      {
        "id": "erVisitDate",
        "label": "ER Visit Date",
        "type": "date",
        "required": true,
        "description": "Date of emergency room visit",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "chiefComplaint",
        "label": "Reason for Visit",
        "type": "textarea",
        "required": true,
        "placeholder": "What brought you to the ER?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentReceived",
        "label": "Treatment Received",
        "type": "textarea",
        "required": true,
        "placeholder": "Tests, procedures, medications given",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "erLevel",
        "label": "ER Level Billed",
        "type": "select",
        "required": false,
        "options": [
          "Level 1 (99281)",
          "Level 2 (99282)",
          "Level 3 (99283)",
          "Level 4 (99284)",
          "Level 5 (99285)",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityFee",
        "label": "Facility Fee Amount",
        "type": "number",
        "required": false,
        "placeholder": "Emergency room facility fee",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "waitTime",
        "label": "Wait Time",
        "type": "text",
        "required": false,
        "placeholder": "How long did you wait to be seen?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify facility and professional bills separately",
      "Ask which documented factors support the billed service level",
      "Check coverage and network facts before asking about surprise-billing protections"
    ],
    "evidence": [
      "ER itemized bill",
      "EOB",
      "Service and network references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review an emergency-room bill. Separate emergency facility and clinician charges and identify what needs explanation. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 866,
      "endLine": 924,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "surgery-bill-analysis",
    "title": "Review surgery charges",
    "category": "specialty",
    "purpose": "Organize surgical, anesthesia, device, and facility questions by biller.",
    "intakeFields": [
      {
        "id": "surgeryType",
        "label": "Surgery Type",
        "type": "text",
        "required": true,
        "placeholder": "Name of surgical procedure",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "surgeryDate",
        "label": "Surgery Date",
        "type": "date",
        "required": true,
        "description": "Date of surgical procedure",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "surgeon",
        "label": "Surgeon Name",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "anesthesiaTime",
        "label": "Anesthesia Time",
        "type": "text",
        "required": false,
        "placeholder": "Duration in minutes",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "surgeryDuration",
        "label": "Surgery Duration",
        "type": "text",
        "required": false,
        "placeholder": "Total time in OR",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "implants",
        "label": "Implants/Devices",
        "type": "textarea",
        "required": false,
        "placeholder": "Any medical devices or implants used",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "complications",
        "label": "Complications",
        "type": "textarea",
        "required": false,
        "placeholder": "Any complications or extended procedures",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Compare the itemized bill with operative and anesthesia record references",
      "Ask how reported time, units, implants, and separate clinicians were billed",
      "Preserve revised bills and EOBs before comparing responsibility"
    ],
    "evidence": [
      "Surgical bill",
      "Operative and anesthesia record references",
      "Device details"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review surgery charges. Organize surgical, anesthesia, device, and facility questions by biller. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 924,
      "endLine": 989,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "diagnostic-overcharges",
    "title": "Review diagnostic-test charges",
    "category": "specialty",
    "purpose": "Check whether test, component, contrast, or repeat-service details explain the bill.",
    "intakeFields": [
      {
        "id": "testType",
        "label": "Type of Tests",
        "type": "select",
        "required": true,
        "options": [
          "Laboratory Tests",
          "X-rays",
          "CT Scans",
          "MRI",
          "Ultrasound",
          "Nuclear Medicine",
          "PET Scans",
          "Multiple Test Types"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "testCodes",
        "label": "CPT/Test Codes",
        "type": "textarea",
        "required": false,
        "placeholder": "List any CPT codes or test names from your bill",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "orderingProvider",
        "label": "Ordering Provider",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "testFacility",
        "label": "Testing Facility",
        "type": "text",
        "required": true,
        "placeholder": "Where tests were performed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgentStat",
        "label": "Urgent/STAT Tests",
        "type": "checkbox",
        "required": false,
        "description": "Were tests marked as urgent or STAT?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "contrastUsed",
        "label": "Contrast Material Used",
        "type": "checkbox",
        "required": false,
        "description": "Was contrast or dye used?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "List the test codes and separately billed components",
      "Ask how contrast, urgency, and reference-lab services affected charges",
      "Compare the EOB and request clarification of any repeated test"
    ],
    "evidence": [
      "Test orders or record references",
      "Itemized codes",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review diagnostic-test charges. Check whether test, component, contrast, or repeat-service details explain the bill. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 989,
      "endLine": 1048,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "insurance-appeal-mastery",
    "title": "Prepare an insurance appeal",
    "category": "insurance",
    "purpose": "Build an appeal around the actual denial reason and plan procedure.",
    "intakeFields": [
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "policyNumber",
        "label": "Policy Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "claimNumber",
        "label": "Claim Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "denialReason",
        "label": "Denial Reason",
        "type": "select",
        "required": true,
        "options": [
          "Not Medically Necessary",
          "Experimental/Investigational",
          "Out of Network",
          "Pre-authorization Required",
          "Duplicate Services",
          "Billing Errors",
          "Policy Exclusion",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDescription",
        "label": "Service/Treatment",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe the denied service or treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalNecessity",
        "label": "Medical Necessity",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was this treatment medically necessary?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSupport",
        "label": "Physician Documentation",
        "type": "textarea",
        "required": false,
        "placeholder": "Supporting documentation from healthcare providers",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the denial, applicable plan provision, and relevant claim records",
      "Ask the treating team for evidence responsive to the stated criterion",
      "Confirm the formal filing route and deadline on the notice"
    ],
    "evidence": [
      "Denial notice",
      "Plan provision and claim file",
      "Clinician support"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare an insurance appeal. Build an appeal around the actual denial reason and plan procedure. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1048,
      "endLine": 1117,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "financial-hardship-application",
    "title": "Prepare a financial-assistance request",
    "category": "financial",
    "purpose": "Match your circumstances to the hospital's current assistance policy.",
    "intakeFields": [
      {
        "id": "householdSize",
        "label": "Household Size",
        "type": "number",
        "required": true,
        "placeholder": "Number of people in household",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "annualIncome",
        "label": "Annual Income",
        "type": "number",
        "required": true,
        "placeholder": "Gross annual household income",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "employmentStatus",
        "label": "Employment Status",
        "type": "select",
        "required": true,
        "options": [
          "Employed",
          "Unemployed",
          "Disabled",
          "Retired",
          "Student",
          "Self-Employed",
          "Part-Time"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "monthlyExpenses",
        "label": "Monthly Expenses",
        "type": "number",
        "required": true,
        "placeholder": "Total monthly living expenses",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalExpenses",
        "label": "Medical Expenses",
        "type": "number",
        "required": false,
        "placeholder": "Monthly medical costs",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "hardshipReason",
        "label": "Hardship Circumstances",
        "type": "textarea",
        "required": true,
        "placeholder": "Explain your financial hardship situation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insurance",
        "label": "Insurance Status",
        "type": "select",
        "required": true,
        "options": [
          "No Insurance",
          "Medicaid",
          "Medicare",
          "Private Insurance",
          "Underinsured"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the policy, application, and covered-provider list",
      "Check required household and income evidence without assuming a universal threshold",
      "Request a receipt and the process for missing documents or review"
    ],
    "evidence": [
      "Current assistance policy",
      "Requested financial evidence",
      "Application receipt"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a financial-assistance request. Match your circumstances to the hospital's current assistance policy. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1117,
      "endLine": 1212,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "irs-financial-assistance",
      "irs-fap-provider-list"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "afford"
  },
  {
    "id": "medicare-medicaid-review",
    "title": "Review a public-program bill",
    "category": "insurance",
    "purpose": "Identify the particular Medicare or Medicaid route before questioning patient responsibility.",
    "intakeFields": [
      {
        "id": "programType",
        "label": "Program Type",
        "type": "select",
        "required": true,
        "options": [
          "Medicare Part A",
          "Medicare Part B",
          "Medicare Advantage",
          "Medicaid",
          "Medicare/Medicaid Dual",
          "Medicare Supplement"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "beneficiaryId",
        "label": "Beneficiary ID",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "serviceType",
        "label": "Service Type",
        "type": "select",
        "required": true,
        "options": [
          "Inpatient Hospital",
          "Outpatient Services",
          "Physician Services",
          "DME/Supplies",
          "Home Health",
          "Skilled Nursing",
          "Dialysis",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "eobReceived",
        "label": "EOB/MSN Received",
        "type": "checkbox",
        "required": false,
        "description": "Did you receive an Explanation of Benefits or Medicare Summary Notice?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "providerBilled",
        "label": "Provider Billed Amount",
        "type": "number",
        "required": false,
        "placeholder": "Amount provider billed Medicare/Medicaid",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "patientResponsibility",
        "label": "Patient Responsibility",
        "type": "number",
        "required": false,
        "placeholder": "Amount you owe after insurance",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Distinguish Original Medicare, Medicare Advantage, drug coverage, and Medicaid",
      "Match the notice to the service and program",
      "Ask the program or plan about the stated responsibility and applicable review process"
    ],
    "evidence": [
      "Program-specific notice",
      "Bill",
      "Coverage and service dates"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review a public-program bill. Identify the particular Medicare or Medicaid route before questioning patient responsibility. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1212,
      "endLine": 1308,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "medicare-appeals",
      "medicaid-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "pharmacy-drug-overcharges",
    "title": "Review medication charges",
    "category": "specialty",
    "purpose": "Separate medication, administration, dispensing, and coverage questions.",
    "intakeFields": [
      {
        "id": "medicationList",
        "label": "Medications Billed",
        "type": "textarea",
        "required": true,
        "placeholder": "List all medications and doses from your bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "pharmacyType",
        "label": "Pharmacy Type",
        "type": "select",
        "required": true,
        "options": [
          "Hospital Pharmacy",
          "Retail Pharmacy",
          "Specialty Pharmacy",
          "Compounding Pharmacy",
          "Mail Order",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "dispensingFees",
        "label": "Dispensing Fees",
        "type": "number",
        "required": false,
        "placeholder": "Total dispensing or handling fees",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "administrationFees",
        "label": "Administration Fees",
        "type": "number",
        "required": false,
        "placeholder": "IV or injection administration fees",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "brandVsGeneric",
        "label": "Brand vs Generic",
        "type": "select",
        "required": false,
        "options": [
          "All Brand Name",
          "All Generic",
          "Mixed Brand/Generic",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "insuranceCoverage",
        "label": "Insurance Coverage",
        "type": "textarea",
        "required": false,
        "placeholder": "What did insurance cover for medications?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Confirm the drug, units, and each separately billed fee",
      "Ask which benefit and pharmacy network processed the claim",
      "Ask the prescriber or program about legitimate assistance options without changing treatment"
    ],
    "evidence": [
      "Pharmacy or infusion bill",
      "Benefit explanation",
      "Drug and unit reference"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review medication charges. Separate medication, administration, dispensing, and coverage questions. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1308,
      "endLine": 1376,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "physical-therapy-review",
    "title": "Review therapy sessions and units",
    "category": "specialty",
    "purpose": "Compare billed therapy dates and units with session records.",
    "intakeFields": [
      {
        "id": "therapyType",
        "label": "Therapy Type",
        "type": "select",
        "required": true,
        "options": [
          "Physical Therapy",
          "Occupational Therapy",
          "Speech Therapy",
          "Multiple Therapies"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "sessionCount",
        "label": "Number of Sessions",
        "type": "number",
        "required": true,
        "placeholder": "Total therapy sessions billed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentDates",
        "label": "Treatment Period",
        "type": "text",
        "required": true,
        "placeholder": "Start and end dates of therapy",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "therapyGoals",
        "label": "Therapy Goals",
        "type": "textarea",
        "required": false,
        "placeholder": "What were the goals of therapy?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "groupVsIndividual",
        "label": "Session Type",
        "type": "select",
        "required": false,
        "options": [
          "Individual Sessions",
          "Group Sessions",
          "Mixed Individual/Group",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "List sessions and the units billed on each date",
      "Ask how group, individual, and timed services were recorded",
      "Separate a billing correction from a visit-limit or coverage appeal"
    ],
    "evidence": [
      "Session record references",
      "Itemized units",
      "Plan denial or EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review therapy sessions and units. Compare billed therapy dates and units with session records. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1376,
      "endLine": 1439,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "radiology-billing-challenge",
    "title": "Review imaging bills",
    "category": "specialty",
    "purpose": "Check technical and professional components before treating separate imaging bills as duplicates.",
    "intakeFields": [
      {
        "id": "imagingType",
        "label": "Imaging Type",
        "type": "select",
        "required": true,
        "options": [
          "X-ray",
          "CT Scan",
          "MRI",
          "Ultrasound",
          "Nuclear Medicine",
          "PET/CT",
          "Mammography",
          "Multiple Studies"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "studyReason",
        "label": "Reason for Study",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was the imaging ordered?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "contrastUsed",
        "label": "Contrast Used",
        "type": "checkbox",
        "required": false,
        "description": "Was contrast or dye used?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "multipleViews",
        "label": "Multiple Views/Series",
        "type": "checkbox",
        "required": false,
        "description": "Were multiple views or series performed?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "readingPhysician",
        "label": "Reading Physician",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "facilityLocation",
        "label": "Imaging Facility",
        "type": "select",
        "required": true,
        "options": [
          "Hospital Radiology",
          "Independent Imaging Center",
          "Physician Office",
          "Mobile Unit",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the facility and interpreting clinician bills",
      "Ask about contrast, views, repeats, and component modifiers",
      "Match both bills to the claim explanation and network facts"
    ],
    "evidence": [
      "Imaging bill",
      "Reading bill if separate",
      "EOB and code details"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review imaging bills. Check technical and professional components before treating separate imaging bills as duplicates. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1439,
      "endLine": 1510,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "laboratory-disputes",
    "title": "Review laboratory charges",
    "category": "specialty",
    "purpose": "Ask whether panels, individual tests, and outside laboratories explain each charge.",
    "intakeFields": [
      {
        "id": "labTests",
        "label": "Laboratory Tests",
        "type": "textarea",
        "required": true,
        "placeholder": "List all lab tests from your bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "testCodes",
        "label": "CPT Codes",
        "type": "textarea",
        "required": false,
        "placeholder": "List any CPT codes from your bill",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "collectionFees",
        "label": "Collection Fees",
        "type": "number",
        "required": false,
        "placeholder": "Blood draw or specimen collection fees",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "urgentStat",
        "label": "STAT/Urgent Tests",
        "type": "checkbox",
        "required": false,
        "description": "Were any tests marked as STAT or urgent?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "panelTests",
        "label": "Test Panels",
        "type": "checkbox",
        "required": false,
        "description": "Were comprehensive panels or profiles ordered?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "referralLab",
        "label": "Reference Laboratory",
        "type": "checkbox",
        "required": false,
        "description": "Were tests sent to an outside reference lab?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Match tests and collection dates to the order or service record",
      "Ask which panel and individual charges overlap and why",
      "Confirm whether a reference laboratory billed separately"
    ],
    "evidence": [
      "Lab order reference",
      "Itemized test codes",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review laboratory charges. Ask whether panels, individual tests, and outside laboratories explain each charge. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1510,
      "endLine": 1581,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "room-rate-challenges",
    "title": "Review hospital-stay charges",
    "category": "facility",
    "purpose": "Distinguish documented admission status, room dates, and extra fees.",
    "intakeFields": [
      {
        "id": "roomType",
        "label": "Room Type",
        "type": "select",
        "required": true,
        "options": [
          "Private Room",
          "Semi-Private",
          "ICU",
          "CCU",
          "Step-Down",
          "Emergency Department",
          "Observation",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "lengthOfStay",
        "label": "Length of Stay",
        "type": "number",
        "required": true,
        "placeholder": "Number of days/hours",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "admissionType",
        "label": "Admission Type",
        "type": "select",
        "required": true,
        "options": [
          "Inpatient",
          "Observation",
          "Outpatient",
          "Emergency",
          "Same-Day Surgery",
          "Unknown"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "roomPreference",
        "label": "Room Preference",
        "type": "select",
        "required": false,
        "options": [
          "No Preference",
          "Requested Private",
          "Medically Necessary Private",
          "Assigned Private",
          "Other"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityFees",
        "label": "Additional Facility Fees",
        "type": "textarea",
        "required": false,
        "placeholder": "List any additional facility or accommodation charges",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Request the recorded inpatient or observation status and relevant notice",
      "Compare billed days and room category with records",
      "Ask how the status affected coverage instead of assuming it can be negotiated"
    ],
    "evidence": [
      "Admission or observation notice",
      "Room-day charges",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review hospital-stay charges. Distinguish documented admission status, room dates, and extra fees. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1581,
      "endLine": 1650,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "ambulance-negotiations",
    "title": "Review ambulance charges",
    "category": "emergency",
    "purpose": "Check transport facts and distinguish ground from air-ambulance protections.",
    "intakeFields": [
      {
        "id": "ambulanceType",
        "label": "Ambulance Type",
        "type": "select",
        "required": true,
        "options": [
          "Ground Ambulance",
          "Air Ambulance",
          "Helicopter",
          "Fixed Wing Aircraft",
          "Wheelchair Van"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "transportReason",
        "label": "Transport Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was ambulance transport needed?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "mileage",
        "label": "Transport Mileage",
        "type": "number",
        "required": false,
        "placeholder": "Miles transported",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "emergencyVsNon",
        "label": "Emergency Status",
        "type": "select",
        "required": true,
        "options": [
          "Emergency - 911 Call",
          "Emergency - Hospital Transfer",
          "Non-Emergency - Scheduled",
          "Non-Emergency - Discharge",
          "Unknown"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "AdvancedLifeSupport",
        "label": "Life Support Level",
        "type": "select",
        "required": false,
        "options": [
          "BLS - Basic Life Support",
          "ALS1 - Advanced Life Support",
          "ALS2 - Advanced Life Support",
          "SCT - Specialty Care Transport",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "multiplePatients",
        "label": "Multiple Patients",
        "type": "checkbox",
        "required": false,
        "description": "Were multiple patients transported?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Verify billed mileage, transport type, and documented service level",
      "Identify coverage and the actual reason for nonpayment",
      "Ask about assistance and applicable billing protections without assuming ground transport is federally protected"
    ],
    "evidence": [
      "Transport bill",
      "Trip or service record reference",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review ambulance charges. Check transport facts and distinguish ground from air-ambulance protections. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1650,
      "endLine": 1722,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "specialist-consultation-review",
    "title": "Review a specialist bill",
    "category": "provider",
    "purpose": "Ask how consultation, procedures, and facility charges were separated.",
    "intakeFields": [
      {
        "id": "specialistType",
        "label": "Specialist Type",
        "type": "select",
        "required": true,
        "options": [
          "Cardiology",
          "Neurology",
          "Oncology",
          "Orthopedics",
          "Gastroenterology",
          "Pulmonology",
          "Endocrinology",
          "Other Specialty"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "consultationType",
        "label": "Consultation Type",
        "type": "select",
        "required": true,
        "options": [
          "Initial Consultation",
          "Follow-up Visit",
          "Second Opinion",
          "Pre-operative Consultation",
          "Emergency Consultation",
          "Telemedicine"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "visitDuration",
        "label": "Visit Duration",
        "type": "text",
        "required": false,
        "placeholder": "How long was the appointment?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "proceduresPerformed",
        "label": "Procedures Performed",
        "type": "textarea",
        "required": false,
        "placeholder": "Any procedures or tests done during visit",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "referralReason",
        "label": "Referral Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Why were you referred to this specialist?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentPlan",
        "label": "Treatment Plan",
        "type": "textarea",
        "required": false,
        "placeholder": "What treatment plan was recommended?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Compare the visit and procedures with the itemized statement",
      "Ask what supports the billed level without relying only on visit duration",
      "Check the EOB and any separate facility bill"
    ],
    "evidence": [
      "Visit record reference",
      "Itemized bill",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review a specialist bill. Ask how consultation, procedures, and facility charges were separated. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1722,
      "endLine": 1794,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "medical-device-billing",
    "title": "Review medical-device charges",
    "category": "specialty",
    "purpose": "Clarify what was supplied and which device terms apply.",
    "intakeFields": [
      {
        "id": "deviceType",
        "label": "Device Type",
        "type": "select",
        "required": true,
        "options": [
          "Cardiac Implant",
          "Orthopedic Implant",
          "Surgical Mesh",
          "Stent",
          "Prosthetic",
          "DME Equipment",
          "Other Device"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deviceName",
        "label": "Device Name/Model",
        "type": "text",
        "required": false,
        "placeholder": "Specific device name or model number",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "implantDate",
        "label": "Implant/Service Date",
        "type": "date",
        "required": true,
        "description": "Date device was implanted or provided",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deviceCost",
        "label": "Device Cost",
        "type": "number",
        "required": false,
        "placeholder": "Amount charged for the device",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "surgicalFees",
        "label": "Associated Surgical Fees",
        "type": "number",
        "required": false,
        "placeholder": "Surgery fees related to device placement",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "warrantyInfo",
        "label": "Warranty Information",
        "type": "textarea",
        "required": false,
        "placeholder": "Any warranty or replacement information",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Verify the device model, quantity, and separate supply charges",
      "Ask for rental, purchase, warranty, or replacement terms when relevant",
      "Separate a pricing question from medical-necessity or coverage review"
    ],
    "evidence": [
      "Device invoice",
      "Written equipment terms",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review medical-device charges. Clarify what was supplied and which device terms apply. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1794,
      "endLine": 1865,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "workers-comp-medical",
    "title": "Organize work-injury billing questions",
    "category": "insurance",
    "purpose": "Prepare records for the applicable work-injury administrator without deciding liability.",
    "intakeFields": [
      {
        "id": "injuryDate",
        "label": "Date of Injury",
        "type": "date",
        "required": true,
        "description": "Date of work-related injury",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "injuryType",
        "label": "Type of Injury",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe the work-related injury",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimNumber",
        "label": "Claim Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "insuranceCarrier",
        "label": "Insurance Carrier",
        "type": "text",
        "required": true,
        "placeholder": "Workers comp insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Treatment",
          "Surgery",
          "Physical Therapy",
          "Diagnostic Tests",
          "Medications",
          "Multiple Treatments"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "returnToWork",
        "label": "Return to Work Status",
        "type": "select",
        "required": false,
        "options": [
          "Full Duty",
          "Light Duty",
          "Temporary Disability",
          "Permanent Disability",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the state process, carrier, claim status, and disputed bill",
      "Ask who should receive the bill while responsibility is being reviewed",
      "Keep claim and court notices for qualified case-specific advice"
    ],
    "evidence": [
      "Work-injury claim notice",
      "Bill",
      "Administrator correspondence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize work-injury billing questions. Prepare records for the applicable work-injury administrator without deciding liability. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1865,
      "endLine": 1939,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "auto-insurance-medical",
    "title": "Organize accident-related bills",
    "category": "insurance",
    "purpose": "Track accident-related claims and payer questions without assuming payment order.",
    "intakeFields": [
      {
        "id": "accidentDate",
        "label": "Accident Date",
        "type": "date",
        "required": true,
        "description": "Date of motor vehicle accident",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceCompany",
        "label": "Auto Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Auto insurance carrier name",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimNumber",
        "label": "Claim Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "injuryDescription",
        "label": "Injuries Sustained",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe injuries from the accident",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentFacilities",
        "label": "Treatment Facilities",
        "type": "textarea",
        "required": true,
        "placeholder": "List hospitals, clinics, or providers",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "pipCoverage",
        "label": "PIP Coverage Amount",
        "type": "number",
        "required": false,
        "placeholder": "Personal injury protection limit",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "faultStatus",
        "label": "Fault Status",
        "type": "select",
        "required": false,
        "options": [
          "At-fault",
          "Not at-fault",
          "Partial fault",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify potentially involved health and auto coverage",
      "Ask each payer about coordination, forms, and its actual filing instructions",
      "Keep lien or legal notices separate from ordinary billing correspondence"
    ],
    "evidence": [
      "Coverage documents",
      "Claim correspondence",
      "Medical bills and payment records"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize accident-related bills. Track accident-related claims and payer questions without assuming payment order. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1939,
      "endLine": 2016,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "veterans-affairs-billing",
    "title": "Organize VA billing questions",
    "category": "insurance",
    "purpose": "Identify the VA or community-care route that produced the bill.",
    "intakeFields": [
      {
        "id": "vaEligibility",
        "label": "VA Eligibility Status",
        "type": "select",
        "required": true,
        "options": [
          "Service-Connected",
          "Non-Service Connected",
          "Priority Group 1-8",
          "Unknown Eligibility"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceConnection",
        "label": "Service-Connected Condition",
        "type": "textarea",
        "required": false,
        "placeholder": "Describe any service-connected conditions",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Routine Care",
          "Specialty Care",
          "Mental Health",
          "Rehabilitation",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "vaFacility",
        "label": "VA Facility Used",
        "type": "checkbox",
        "required": false,
        "description": "Was care received at a VA facility?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "nonVaProvider",
        "label": "Non-VA Provider",
        "type": "text",
        "required": false,
        "placeholder": "Name of non-VA healthcare provider",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "priorAuthorization",
        "label": "Prior Authorization",
        "type": "checkbox",
        "required": false,
        "description": "Was prior authorization obtained from VA?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record whether care was at VA or a non-VA facility",
      "Find authorization and any payment or denial notice",
      "Ask the responsible program which review process and deadline applies"
    ],
    "evidence": [
      "VA or community-care notice",
      "Authorization reference",
      "Bill"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize VA billing questions. Identify the VA or community-care route that produced the bill. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2016,
      "endLine": 2092,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "medicare-appeals",
      "medicaid-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "dental-oral-surgery",
    "title": "Review dental and oral-surgery bills",
    "category": "specialty",
    "purpose": "Clarify which parts of care were submitted to dental or medical coverage.",
    "intakeFields": [
      {
        "id": "procedureType",
        "label": "Dental Procedure",
        "type": "select",
        "required": true,
        "options": [
          "Oral Surgery",
          "Orthodontics",
          "Periodontics",
          "Endodontics",
          "Prosthodontics",
          "General Dentistry",
          "Multiple Procedures"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "dentalCodes",
        "label": "Dental Codes",
        "type": "textarea",
        "required": false,
        "placeholder": "List any ADA/CDT codes from your bill",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "medicalNecessity",
        "label": "Medical Necessity",
        "type": "select",
        "required": false,
        "options": [
          "Medically Necessary",
          "Cosmetic",
          "Preventive",
          "Emergency",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "hospitalSetting",
        "label": "Hospital Setting",
        "type": "checkbox",
        "required": false,
        "description": "Was procedure done in hospital setting?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "anesthesiaUsed",
        "label": "Anesthesia Used",
        "type": "select",
        "required": false,
        "options": [
          "Local",
          "IV Sedation",
          "General Anesthesia",
          "None",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "dentalInsurance",
        "label": "Dental Insurance",
        "type": "select",
        "required": false,
        "options": [
          "Dental Plan Only",
          "Medical Insurance",
          "Both Dental and Medical",
          "No Insurance"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Separate dental procedure, anesthesia, and facility charges",
      "Ask which plan processed each part and the stated reason for denial",
      "Ask the treating team for documentation if a coverage review needs it"
    ],
    "evidence": [
      "Dental and medical EOBs",
      "Procedure bill",
      "Denial or authorization reference"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review dental and oral-surgery bills. Clarify which parts of care were submitted to dental or medical coverage. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2092,
      "endLine": 2165,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "mental-health-billing",
    "title": "Review mental-health bills",
    "category": "specialty",
    "purpose": "Separate charge accuracy, benefit limits, and denial review.",
    "intakeFields": [
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Inpatient Psychiatric",
          "Outpatient Therapy",
          "Intensive Outpatient",
          "Substance Abuse Treatment",
          "Crisis Intervention",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerType",
        "label": "Provider Type",
        "type": "select",
        "required": true,
        "options": [
          "Psychiatrist",
          "Psychologist",
          "Licensed Therapist",
          "Social Worker",
          "Substance Abuse Counselor",
          "Multiple Providers"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "sessionCount",
        "label": "Number of Sessions",
        "type": "number",
        "required": false,
        "placeholder": "Total therapy sessions billed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentLength",
        "label": "Treatment Duration",
        "type": "text",
        "required": false,
        "placeholder": "Length of treatment period",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "priorAuthorization",
        "label": "Prior Authorization",
        "type": "checkbox",
        "required": false,
        "description": "Was prior authorization required?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "parityIssues",
        "label": "Parity Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any mental health parity or coverage issues?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Match billed sessions and care setting to service records",
      "Ask for the coverage provision and rationale behind a limit or denial",
      "Ask which appeal or parity-question route applies to this plan"
    ],
    "evidence": [
      "Session bill",
      "Denial and plan provision",
      "Clinician documentation reference"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review mental-health bills. Separate charge accuracy, benefit limits, and denial review. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2165,
      "endLine": 2244,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "appeal"
  },
  {
    "id": "hospital-billing-insider-tactics",
    "title": "Plan a hospital billing escalation",
    "category": "insider",
    "purpose": "Build a factual escalation trail when the first contact does not resolve a question.",
    "intakeFields": [
      {
        "id": "hospitalType",
        "label": "Hospital Type",
        "type": "select",
        "required": true,
        "options": [
          "Major Academic Medical Center",
          "Regional Hospital System",
          "Nonprofit Hospital",
          "For-Profit Hospital Chain",
          "Critical Access Hospital",
          "Specialty Hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount owed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billingDepartmentContact",
        "label": "Billing Contact Info",
        "type": "textarea",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "previousNegotiations",
        "label": "Previous Negotiations",
        "type": "textarea",
        "required": false,
        "placeholder": "Any previous attempts to negotiate or dispute",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "urgencyLevel",
        "label": "Urgency Level",
        "type": "select",
        "required": true,
        "options": [
          "Immediate payment demanded",
          "Collections threatened",
          "Already in collections",
          "Normal billing cycle",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Summarize the exact unresolved issue and prior responses",
      "Ask for the appropriate supervisor, financial counselor, or patient-relations route",
      "Request written confirmation of any correction, assistance review, or payment terms"
    ],
    "evidence": [
      "Contact log",
      "Unresolved charge or policy question",
      "Written responses"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Plan a hospital billing escalation. Build a factual escalation trail when the first contact does not resolve a question. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2244,
      "endLine": 2319,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "insurance-weakness-exploiter",
    "title": "Understand an insurer's review process",
    "category": "insider",
    "purpose": "Identify the actual review procedure instead of guessing internal incentives.",
    "intakeFields": [
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialCode",
        "label": "Denial Code",
        "type": "text",
        "required": false,
        "placeholder": "Specific denial reason code",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "claimAmount",
        "label": "Claim Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total claim amount denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceType",
        "label": "Service Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Surgery",
          "Hospital Stay",
          "Specialty Treatment",
          "Mental Health",
          "Rehabilitation",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "policyDetails",
        "label": "Policy Information",
        "type": "textarea",
        "required": true,
        "placeholder": "Policy number, plan type, and relevant coverage details",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "appealHistory",
        "label": "Appeal History",
        "type": "textarea",
        "required": false,
        "placeholder": "Previous appeals or communications with insurance",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask for the exact denial reason and controlling plan provision",
      "Request relevant records and the official appeal route",
      "Record the response and notice deadline separately from informal discussions"
    ],
    "evidence": [
      "Denial code and notice",
      "Plan documents",
      "Contact log"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Understand an insurer's review process. Identify the actual review procedure instead of guessing internal incentives. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2319,
      "endLine": 2397,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "medical-coding-arbitrage",
    "title": "Prepare a coding review",
    "category": "insider",
    "purpose": "Turn code comparisons into questions for the billing or coding team.",
    "intakeFields": [
      {
        "id": "procedureCodes",
        "label": "Procedure Codes (CPT)",
        "type": "textarea",
        "required": true,
        "placeholder": "List all CPT codes from your bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "diagnosisCodes",
        "label": "Diagnosis Codes (ICD-10)",
        "type": "textarea",
        "required": false,
        "placeholder": "List all ICD-10 diagnosis codes",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "Hospital Inpatient",
          "Hospital Outpatient",
          "Ambulatory Surgery Center",
          "Emergency Department",
          "Physician Office",
          "Multiple Facilities"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "procedureDetails",
        "label": "Actual Procedures",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe exactly what procedures were actually performed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "codeRelatedCharges",
        "label": "Code-Related Charges",
        "type": "number",
        "required": true,
        "placeholder": "Total charges related to procedure codes",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record exact codes, modifiers, dates, and units",
      "Ask whether a global service or separate component explains the charges",
      "Request review against the documented service rather than suggest unsupported recoding"
    ],
    "evidence": [
      "Itemized codes",
      "Service record references",
      "EOB adjustments"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a coding review. Turn code comparisons into questions for the billing or coding team. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2397,
      "endLine": 2472,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "provider-network-leverage",
    "title": "Question a network-status mismatch",
    "category": "insider",
    "purpose": "Gather the evidence behind conflicting network representations.",
    "intakeFields": [
      {
        "id": "networkStatus",
        "label": "Network Status",
        "type": "select",
        "required": true,
        "options": [
          "Listed as In-Network",
          "Listed as Out-of-Network",
          "Emergency Care",
          "Unknown Network Status",
          "Provider Claims In-Network",
          "Insurance Claims Out-of-Network"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerName",
        "label": "Provider/Hospital Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "insurancePlan",
        "label": "Insurance Plan",
        "type": "text",
        "required": true,
        "placeholder": "Insurance company and plan type",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": true,
        "description": "Date of service",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "networkVerification",
        "label": "Network Verification",
        "type": "textarea",
        "required": false,
        "placeholder": "Any verification of network status you received",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "balanceBilled",
        "label": "Balance Billed Amount",
        "type": "number",
        "required": true,
        "placeholder": "Amount you owe after insurance",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record the plan, service date, facility, and clinician separately",
      "Preserve directory or verification references and what was communicated",
      "Ask the plan to explain network processing and the applicable correction or appeal route"
    ],
    "evidence": [
      "Network verification reference",
      "EOB",
      "Provider bill"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Question a network-status mismatch. Gather the evidence behind conflicting network representations. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2472,
      "endLine": 2550,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-cms-directory",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "hidden-revenue-stream-detector",
    "title": "Find assistance options to investigate",
    "category": "advanced-financial",
    "purpose": "Build a program-specific assistance checklist without inventing eligibility.",
    "intakeFields": [
      {
        "id": "totalMedicalDebt",
        "label": "Total Medical Debt",
        "type": "number",
        "required": true,
        "placeholder": "All medical bills combined",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "householdIncome",
        "label": "Annual Household Income",
        "type": "number",
        "required": true,
        "placeholder": "Gross annual household income",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "householdSize",
        "label": "Household Size",
        "type": "number",
        "required": true,
        "placeholder": "Number of people in household",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalConditions",
        "label": "Medical Conditions",
        "type": "textarea",
        "required": true,
        "placeholder": "List all ongoing medical conditions and treatments",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "currentProviders",
        "label": "Healthcare Providers",
        "type": "textarea",
        "required": true,
        "placeholder": "List all hospitals, doctors, and providers involved",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medications",
        "label": "Current Medications",
        "type": "textarea",
        "required": false,
        "placeholder": "List expensive medications you take regularly",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Start with hospital assistance and separately billing providers",
      "Ask about medication or disease-specific programs relevant to the bill",
      "Verify the current program, benefit restrictions, and documentation before applying"
    ],
    "evidence": [
      "Program policies",
      "Current billers",
      "Eligibility evidence requested by each program"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Find assistance options to investigate. Build a program-specific assistance checklist without inventing eligibility. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2550,
      "endLine": 2629,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "irs-financial-assistance",
      "irs-fap-provider-list"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "afford"
  },
  {
    "id": "bankruptcy-protection-strategist",
    "title": "Prepare for debt and legal advice",
    "category": "advanced-financial",
    "purpose": "Organize medical debt and questions for a qualified counselor or attorney.",
    "intakeFields": [
      {
        "id": "totalMedicalDebt",
        "label": "Total Medical Debt",
        "type": "number",
        "required": true,
        "placeholder": "All medical debt combined",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "otherDebt",
        "label": "Other Debt",
        "type": "number",
        "required": true,
        "placeholder": "Credit cards, loans, other debt",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "monthlyIncome",
        "label": "Monthly Income",
        "type": "number",
        "required": true,
        "placeholder": "Total monthly household income",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "assets",
        "label": "Major Assets",
        "type": "textarea",
        "required": true,
        "placeholder": "Home, vehicles, savings, investments",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "ongoingMedicalCosts",
        "label": "Ongoing Medical Costs",
        "type": "number",
        "required": false,
        "placeholder": "Monthly medical expenses",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "bankruptcyConcerns",
        "label": "Bankruptcy Concerns",
        "type": "textarea",
        "required": false,
        "placeholder": "What concerns you about bankruptcy?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Separate disputed bills from confirmed balances and legal notices",
      "List assistance and correction requests already attempted",
      "Seek case-specific advice before debt, asset, or bankruptcy decisions"
    ],
    "evidence": [
      "Debt inventory",
      "Court or collection notices",
      "Income and asset notes kept locally"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for debt and legal advice. Organize medical debt and questions for a qualified counselor or attorney. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2629,
      "endLine": 2707,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "tax-deduction-maximizer",
    "title": "Organize medical-expense tax questions",
    "category": "advanced-financial",
    "purpose": "Prepare a record list for tax guidance without calculating an entitlement.",
    "intakeFields": [
      {
        "id": "annualMedicalExpenses",
        "label": "Annual Medical Expenses",
        "type": "number",
        "required": true,
        "placeholder": "Total medical expenses for tax year",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "adjustedGrossIncome",
        "label": "Adjusted Gross Income",
        "type": "number",
        "required": true,
        "placeholder": "AGI from tax return",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalTravelExpenses",
        "label": "Medical Travel Expenses",
        "type": "number",
        "required": false,
        "placeholder": "Travel costs for medical care",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "homeModifications",
        "label": "Medical Home Modifications",
        "type": "number",
        "required": false,
        "placeholder": "Home modifications for medical needs",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "hsaFsaContributions",
        "label": "HSA/FSA Contributions",
        "type": "number",
        "required": false,
        "placeholder": "Current HSA/FSA contributions",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "alternativeTreatments",
        "label": "Alternative Treatments",
        "type": "textarea",
        "required": false,
        "placeholder": "Alternative or complementary medical treatments",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Separate amounts paid, reimbursed, and paid from tax-advantaged accounts",
      "Keep receipts and the year of each transaction",
      "Ask a qualified tax resource which expenses and limits apply"
    ],
    "evidence": [
      "Payment receipts",
      "Reimbursement records",
      "HSA or FSA statements"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize medical-expense tax questions. Prepare a record list for tax guidance without calculating an entitlement. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2707,
      "endLine": 2785,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "debt-statute-limitations-advisor",
    "title": "Review questions about older debt",
    "category": "advanced-financial",
    "purpose": "Prepare the dates and jurisdiction needed for qualified older-debt advice.",
    "intakeFields": [
      {
        "id": "debtOriginDate",
        "label": "Original Debt Date",
        "type": "date",
        "required": true,
        "description": "Date of original medical service or bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "lastPaymentDate",
        "label": "Last Payment Date",
        "type": "date",
        "required": false,
        "description": "Date of last payment made on debt",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "debtAmount",
        "label": "Debt Amount",
        "type": "number",
        "required": true,
        "placeholder": "Current amount of medical debt",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "collectionHistory",
        "label": "Collection History",
        "type": "textarea",
        "required": false,
        "placeholder": "History of collection attempts and communications",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "patientState",
        "label": "State of Residence",
        "type": "text",
        "required": true,
        "placeholder": "State where you live",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "originalProvider",
        "label": "Original Provider",
        "type": "text",
        "required": true,
        "placeholder": "Original healthcare provider",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Keep the original debt, last-payment, and collection notices separate",
      "Ask a qualified legal resource about the applicable period and effect of a payment or acknowledgment",
      "Address any lawsuit using its actual court instructions"
    ],
    "evidence": [
      "Debt and payment dates",
      "Collection or court notice",
      "Jurisdiction information"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review questions about older debt. Prepare the dates and jurisdiction needed for qualified older-debt advice. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2785,
      "endLine": 2863,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-old-debt",
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "prior-authorization-reversal-expert",
    "title": "Prepare a prior-authorization review",
    "category": "insurance-mastery",
    "purpose": "Ask the plan and treating team how to address the authorization decision.",
    "intakeFields": [
      {
        "id": "deniedTreatment",
        "label": "Denied Treatment",
        "type": "textarea",
        "required": true,
        "placeholder": "Specific treatment, procedure, or medication denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialReason",
        "label": "Denial Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Specific reason given for denial",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalCondition",
        "label": "Medical Condition",
        "type": "textarea",
        "required": true,
        "placeholder": "Underlying medical condition requiring treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSupport",
        "label": "Physician Documentation",
        "type": "textarea",
        "required": true,
        "placeholder": "Doctor support and medical necessity documentation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgency",
        "label": "Urgency Level",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening emergency",
          "Urgent medical need",
          "Progressive condition",
          "Quality of life issue",
          "Routine/elective"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "previousAppeals",
        "label": "Previous Appeals",
        "type": "textarea",
        "required": false,
        "placeholder": "Any previous appeal attempts and results",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the denial reason and authorization criterion",
      "Ask the clinician what documentation or urgent review is appropriate",
      "Confirm whether peer discussion and a formal appeal are separate processes"
    ],
    "evidence": [
      "Authorization request",
      "Denial",
      "Clinician support"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a prior-authorization review. Ask the plan and treating team how to address the authorization decision. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2863,
      "endLine": 2940,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-preauthorization",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "out-of-network-reimbursement-maximizer",
    "title": "Prepare an out-of-network claim question",
    "category": "insurance-mastery",
    "purpose": "Clarify benefits, billed amounts, and possible member reimbursement.",
    "intakeFields": [
      {
        "id": "careType",
        "label": "Type of Care",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Specialty Care",
          "Surgery",
          "Hospital Stay",
          "Diagnostic Tests",
          "Mental Health",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerName",
        "label": "Out-of-Network Provider",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "oonBillAmount",
        "label": "Out-of-Network Bill",
        "type": "number",
        "required": true,
        "placeholder": "Total out-of-network charges",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insurancePayment",
        "label": "Insurance Payment",
        "type": "number",
        "required": false,
        "placeholder": "Amount insurance paid",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "networkSearch",
        "label": "In-Network Search",
        "type": "textarea",
        "required": false,
        "placeholder": "Did you search for in-network providers? What were the results?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "medicalNecessity",
        "label": "Medical Necessity",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was this specific out-of-network provider medically necessary?",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask which claim form and proof of payment the plan requires",
      "Distinguish insurer payment to a provider from reimbursement received by you",
      "Check network exceptions and balance-billing questions using actual plan facts"
    ],
    "evidence": [
      "Plan claim instructions",
      "Itemized bill",
      "Payment receipt and EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare an out-of-network claim question. Clarify benefits, billed amounts, and possible member reimbursement. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2940,
      "endLine": 3017,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-cms-directory",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "claims-denial-psychology-decoder",
    "title": "Decode a denial's stated reason",
    "category": "insurance-mastery",
    "purpose": "Focus on the written reason and evidence instead of guessing an adjuster's motives.",
    "intakeFields": [
      {
        "id": "denialLetter",
        "label": "Denial Letter Details",
        "type": "textarea",
        "required": true,
        "placeholder": "Copy the exact denial letter or explanation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "adjusterInfo",
        "label": "Adjuster Information",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimAmount",
        "label": "Claim Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount of denied claim",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgencyFactors",
        "label": "Urgency Factors",
        "type": "textarea",
        "required": false,
        "placeholder": "Any time-sensitive or urgent factors",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "previousCommunications",
        "label": "Previous Communications",
        "type": "textarea",
        "required": false,
        "placeholder": "Previous calls, letters, or appeals with insurance",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Copy the reason and code from the decision",
      "Ask whether the issue is missing information, claim processing, or coverage",
      "Ask what evidence and formal route address that specific reason"
    ],
    "evidence": [
      "Denial notice",
      "Claim records",
      "Prior correspondence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Decode a denial's stated reason. Focus on the written reason and evidence instead of guessing an adjuster's motives. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3017,
      "endLine": 3094,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "insurance-policy-loophole-finder",
    "title": "Read the relevant plan provision",
    "category": "insurance-mastery",
    "purpose": "Locate the document and version that explain a coverage question.",
    "intakeFields": [
      {
        "id": "policyDocuments",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": false,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "deniedClaim",
        "label": "Denied Claim",
        "type": "textarea",
        "required": true,
        "placeholder": "Details of denied claim or coverage issue",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "policyLanguage",
        "label": "Relevant Policy Language",
        "type": "textarea",
        "required": false,
        "placeholder": "Copy any relevant policy language or exclusions",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Specialty Treatment",
          "Mental Health",
          "Preventive Care",
          "Diagnostic Tests",
          "Surgery",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "coverageQuestion",
        "label": "Coverage Question",
        "type": "textarea",
        "required": true,
        "placeholder": "What specific coverage question or dispute do you have?",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the plan document effective on the service date",
      "Read the cited exclusion, definition, and exception together",
      "Ask the administrator to explain conflicting provisions and the review process"
    ],
    "evidence": [
      "Plan document reference",
      "Denial provision",
      "Service-date evidence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Read the relevant plan provision. Locate the document and version that explain a coverage question. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3094,
      "endLine": 3169,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "hipaa-violation-bill-challenger",
    "title": "Separate privacy and billing concerns",
    "category": "legal-pro",
    "purpose": "Record a privacy concern without assuming it cancels a medical debt.",
    "intakeFields": [
      {
        "id": "privacyExperiences",
        "label": "Privacy Experiences",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe any privacy or information sharing concerns",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billingSources",
        "label": "Billing Sources",
        "type": "textarea",
        "required": true,
        "placeholder": "List all providers, billing companies, and collection agencies involved",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "informationSharing",
        "label": "Information Sharing",
        "type": "textarea",
        "required": false,
        "placeholder": "Any sharing of your medical billing information you observed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "collectionActivities",
        "label": "Collection Activities",
        "type": "textarea",
        "required": false,
        "placeholder": "Any collection agency activities or communications",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "digitalSystems",
        "label": "Digital Systems Used",
        "type": "textarea",
        "required": false,
        "placeholder": "Patient portals, billing systems, or online tools used",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Describe the specific disclosure or access concern using only necessary detail",
      "Ask for the organization's privacy contact and complaint process",
      "Track the billing question separately and seek appropriate advice about the privacy issue"
    ],
    "evidence": [
      "Privacy correspondence",
      "Observed event record",
      "Separate billing notice"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Separate privacy and billing concerns. Record a privacy concern without assuming it cancels a medical debt. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3169,
      "endLine": 3244,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "medical-malpractice-bill-leverage",
    "title": "Separate care-quality and billing concerns",
    "category": "legal-pro",
    "purpose": "Prepare a factual care-quality concern while keeping billing review distinct.",
    "intakeFields": [
      {
        "id": "medicalComplications",
        "label": "Medical Complications",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe any complications, errors, or unexpected outcomes",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "careQualityConcerns",
        "label": "Care Quality Concerns",
        "type": "textarea",
        "required": true,
        "placeholder": "Any concerns about quality of care received",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "informedConsent",
        "label": "Informed Consent Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any issues with informed consent or explanation of risks",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "providerCommunication",
        "label": "Provider Communication",
        "type": "textarea",
        "required": false,
        "placeholder": "Communication issues or conflicts with providers",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "outcomeExpectations",
        "label": "Outcome vs Expectations",
        "type": "textarea",
        "required": false,
        "placeholder": "How did actual outcomes differ from what was expected?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record what happened and references to the relevant care records",
      "Ask for the provider's patient-relations or complaint process",
      "Seek qualified clinical or legal advice instead of treating a poor outcome as proof of liability"
    ],
    "evidence": [
      "Care record references",
      "Complaint correspondence",
      "Separate bill"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Separate care-quality and billing concerns. Prepare a factual care-quality concern while keeping billing review distinct. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3244,
      "endLine": 3319,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "collections-agency-destroyer",
    "title": "Respond to a collector",
    "category": "legal-pro",
    "purpose": "Prepare a documented response after verifying the collector and the debt.",
    "intakeFields": [
      {
        "id": "collectionAgencies",
        "label": "Collection Agencies",
        "type": "textarea",
        "required": true,
        "placeholder": "List all collection agencies and debt collectors involved",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "collectionCommunications",
        "label": "Collection Communications",
        "type": "textarea",
        "required": true,
        "placeholder": "Letters, calls, and communications from collectors",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "debtValidationRequests",
        "label": "Debt Validation Requests",
        "type": "textarea",
        "required": false,
        "placeholder": "Any debt validation requests you have made",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "fdcpaViolations",
        "label": "Suspected collection issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any inappropriate collection practices you experienced",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "creditReportingIssues",
        "label": "Credit Reporting Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Issues with debt appearing on credit reports",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Review the validation notice and identify disputed facts",
      "Use the applicable dispute instructions and keep delivery evidence",
      "Track court notices separately and do not assume a dispute erases the debt"
    ],
    "evidence": [
      "Validation notice",
      "Bill and payment history",
      "Contact and delivery records"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Respond to a collector. Prepare a documented response after verifying the collector and the debt. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3319,
      "endLine": 3394,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-collection-contact",
      "cfpb-debt-validation"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "credit-report-medical-debt-remover",
    "title": "Check medical-debt credit reporting",
    "category": "legal-pro",
    "purpose": "Compare a reported account with the underlying debt and current reporting rules.",
    "intakeFields": [
      {
        "id": "creditReportDebts",
        "label": "Credit Report Medical Debts",
        "type": "textarea",
        "required": true,
        "placeholder": "List all medical debt appearing on credit reports",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "creditBureaus",
        "label": "Credit Bureaus Reporting",
        "type": "textarea",
        "required": true,
        "placeholder": "Which credit bureaus show the medical debt",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "debtAges",
        "label": "Debt Ages",
        "type": "textarea",
        "required": false,
        "placeholder": "How old are the medical debts on your credit",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "disputeHistory",
        "label": "Dispute History",
        "type": "textarea",
        "required": false,
        "placeholder": "Any previous credit disputes you have filed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "accuracyIssues",
        "label": "Accuracy Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any inaccuracies in how the debt is reported",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the relevant credit report and identify the disputed entry",
      "Check identity, balance, payment status, and dates against records",
      "Use the bureau or furnisher dispute process with evidence"
    ],
    "evidence": [
      "Credit-report entry",
      "Payment or settlement evidence",
      "Prior dispute response"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Check medical-debt credit reporting. Compare a reported account with the underlying debt and current reporting rules. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3394,
      "endLine": 3470,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "bureau-medical-reporting",
      "cfpb-medical-reporting-status"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "recurring-bill-audit-system",
    "title": "Review recurring treatment bills",
    "category": "automation",
    "purpose": "Build a repeatable comparison of sessions, claims, and payments.",
    "intakeFields": [
      {
        "id": "ongoingTreatment",
        "label": "Ongoing Treatment",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe your ongoing medical treatment and conditions",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "recurringProviders",
        "label": "Recurring Providers",
        "type": "textarea",
        "required": true,
        "placeholder": "List all providers you see regularly",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billingFrequency",
        "label": "Billing Frequency",
        "type": "select",
        "required": true,
        "options": [
          "Weekly",
          "Bi-weekly",
          "Monthly",
          "Quarterly",
          "Varies"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "assistancePrograms",
        "label": "Current Assistance Programs",
        "type": "textarea",
        "required": false,
        "placeholder": "Any current charity care or assistance programs",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "insuranceAuthorizations",
        "label": "Insurance Authorizations",
        "type": "textarea",
        "required": false,
        "placeholder": "Any ongoing prior authorizations or approvals",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Keep each biller and service period distinct",
      "Compare new statements with earlier versions and matching EOBs",
      "Track authorization or benefit-limit changes without assuming each repeat charge is wrong"
    ],
    "evidence": [
      "Recurring statements",
      "EOB versions",
      "Session and payment records"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review recurring treatment bills. Build a repeatable comparison of sessions, claims, and payments. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3470,
      "endLine": 3545,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "multi-bill-portfolio-manager",
    "title": "Organize multiple family bills",
    "category": "automation",
    "purpose": "Keep people, billers, and services separate while choosing next steps.",
    "intakeFields": [
      {
        "id": "familyMembers",
        "label": "Family Members",
        "type": "textarea",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "allProviders",
        "label": "All Healthcare Providers",
        "type": "textarea",
        "required": true,
        "placeholder": "List all hospitals, doctors, and providers for entire family",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "totalFamilyDebt",
        "label": "Total Family Medical Debt",
        "type": "number",
        "required": true,
        "placeholder": "Combined medical debt for entire family",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insurancePolicies",
        "label": "Insurance Policies",
        "type": "textarea",
        "required": true,
        "placeholder": "All insurance policies covering family members",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "priorityConcerns",
        "label": "Priority Concerns",
        "type": "textarea",
        "required": false,
        "placeholder": "Most urgent bills or family members needing immediate attention",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Create a separate scope for each person and biller",
      "Record which notice, payment, and coverage belongs to each scope",
      "Prioritize actual response notices and unresolved questions rather than combine balances automatically"
    ],
    "evidence": [
      "Separate bill groups",
      "Coverage references",
      "Contact and payment history"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize multiple family bills. Keep people, billers, and services separate while choosing next steps. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3545,
      "endLine": 3620,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "proactive-insurance-change-optimizer",
    "title": "Prepare for a plan comparison",
    "category": "automation",
    "purpose": "Compare coverage documents and expected needs without predicting eligibility or savings.",
    "intakeFields": [
      {
        "id": "currentInsurance",
        "label": "Current Insurance",
        "type": "textarea",
        "required": true,
        "placeholder": "Current insurance plan details and coverage",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "upcomingMedicalNeeds",
        "label": "Upcoming Medical Needs",
        "type": "textarea",
        "required": true,
        "placeholder": "Planned surgeries, treatments, or ongoing medical needs",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "availablePlans",
        "label": "Available Plan Options",
        "type": "textarea",
        "required": false,
        "placeholder": "Insurance plan options available to you",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "enrollmentDeadlines",
        "label": "Enrollment Deadlines",
        "type": "text",
        "required": false,
        "placeholder": "Open enrollment or special enrollment deadlines",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "costConcerns",
        "label": "Cost Concerns",
        "type": "textarea",
        "required": false,
        "placeholder": "Specific cost concerns or financial constraints",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Use the official current plan materials for each option",
      "Compare network, benefit limits, total costs, and needed services",
      "Verify enrollment dates and effective dates with the plan or enrollment authority"
    ],
    "evidence": [
      "Plan summaries",
      "Provider and medication needs kept locally",
      "Enrollment notices"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for a plan comparison. Compare coverage documents and expected needs without predicting eligibility or savings. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3620,
      "endLine": 3696,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-dol-claim-file"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "advanced-appeal-generator",
    "title": "Build the next appeal stage",
    "category": "appeal-system",
    "purpose": "Prepare a stage-specific packet from the decision already received.",
    "intakeFields": [
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "select",
        "required": true,
        "options": [
          "Anthem/Blue Cross Blue Shield",
          "UnitedHealthcare",
          "Aetna",
          "Cigna",
          "Humana",
          "Kaiser Permanente",
          "Medicaid",
          "Medicare Advantage",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialReason",
        "label": "Reason for Denial",
        "type": "select",
        "required": true,
        "options": [
          "Not medically necessary",
          "Experimental/investigational",
          "Prior authorization required",
          "Out-of-network provider",
          "Pre-existing condition",
          "Coverage exclusion",
          "Documentation insufficient",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Denied Treatment/Service",
        "type": "text",
        "required": true,
        "placeholder": "Surgery, medication, therapy, device, etc.",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimAmount",
        "label": "Claim Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total dollar amount of denied claim",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalCondition",
        "label": "Medical Condition",
        "type": "text",
        "required": true,
        "placeholder": "Primary diagnosis or condition being treated",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "priorAppeals",
        "label": "Previous Appeal Attempts",
        "type": "select",
        "required": true,
        "options": [
          "None - this is the first appeal",
          "Internal appeal denied",
          "External review denied",
          "Multiple appeals denied"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the current internal or external review stage",
      "Match evidence to the reason given in the latest denial",
      "Confirm the notice's filing channel, deadline, and urgent-review instructions"
    ],
    "evidence": [
      "Latest denial",
      "Earlier appeal and response",
      "Supporting evidence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Build the next appeal stage. Prepare a stage-specific packet from the decision already received. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3696,
      "endLine": 3775,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "company-specific-appeal-intel",
    "title": "Find your plan's appeal instructions",
    "category": "appeal-system",
    "purpose": "Locate official instructions for the particular product and administrator.",
    "intakeFields": [
      {
        "id": "targetInsurer",
        "label": "Insurance company",
        "type": "select",
        "required": true,
        "options": [
          "Anthem/Blue Cross Blue Shield",
          "UnitedHealthcare",
          "Aetna",
          "Cigna",
          "Humana",
          "Kaiser Permanente",
          "Molina Healthcare",
          "Centene Corporation",
          "WellCare",
          "Medicaid MCO",
          "Medicare Advantage Plan",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialType",
        "label": "Type of Denial",
        "type": "select",
        "required": true,
        "options": [
          "Medical necessity",
          "Prior authorization",
          "Experimental treatment",
          "Out-of-network",
          "Coverage exclusion",
          "Documentation",
          "Pharmacy benefit",
          "Mental health",
          "Emergency care"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "appealLevel",
        "label": "Current Appeal Level",
        "type": "select",
        "required": true,
        "options": [
          "Preparing first internal appeal",
          "Internal appeal was denied",
          "Preparing external review",
          "External review denied",
          "Considering state complaint"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimComplexity",
        "label": "Claim Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Simple/routine claim",
          "Moderate complexity",
          "High complexity/rare condition",
          "Experimental/cutting-edge treatment"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the product and plan funding rather than rely on the insurer brand alone",
      "Ask for the current procedure applicable to this denial",
      "Verify the address or portal and preserve submission evidence"
    ],
    "evidence": [
      "Plan-specific instructions",
      "Denial notice",
      "Prior appeal history"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Find your plan's appeal instructions. Locate official instructions for the particular product and administrator. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3775,
      "endLine": 3848,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "appeal"
  },
  {
    "id": "medical-necessity-builder",
    "title": "Prepare a clinician evidence request",
    "category": "denial-reversal",
    "purpose": "Ask the treating team for documentation that addresses the denial criterion.",
    "intakeFields": [
      {
        "id": "medicalCondition",
        "label": "Primary Medical Condition",
        "type": "text",
        "required": true,
        "placeholder": "Primary diagnosis (include ICD-10 if known)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deniedTreatment",
        "label": "Denied Treatment/Service",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment, medication, or service denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentUrgency",
        "label": "Treatment Urgency",
        "type": "select",
        "required": true,
        "options": [
          "Emergency/life-threatening",
          "Urgent (within 30 days)",
          "Semi-urgent (within 90 days)",
          "Elective but necessary"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "alternativesTried",
        "label": "Alternative Treatments Tried",
        "type": "textarea",
        "required": true,
        "placeholder": "List all treatments attempted and why they failed or were insufficient",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "patientSymptoms",
        "label": "Current Symptoms/Impact",
        "type": "textarea",
        "required": true,
        "placeholder": "How the condition affects daily life, work, and functioning",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSpecialty",
        "label": "Prescribing Physician Specialty",
        "type": "select",
        "required": true,
        "options": [
          "Primary Care",
          "Cardiology",
          "Oncology",
          "Neurology",
          "Orthopedics",
          "Surgery",
          "Psychiatry",
          "Endocrinology",
          "Other Specialty"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalRecords",
        "label": "Supporting Medical Records",
        "type": "textarea",
        "required": false,
        "placeholder": "Any test results, imaging reports, or medical documentation you have",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the criterion and the records the reviewer considered",
      "Ask the clinician to explain relevant history, alternatives, and the requested service",
      "Keep urgent-review decisions with the clinician and plan"
    ],
    "evidence": [
      "Denial criterion",
      "Relevant record references",
      "Clinician statement"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a clinician evidence request. Ask the treating team for documentation that addresses the denial criterion. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3848,
      "endLine": 3932,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "peer-to-peer-prep",
    "title": "Prepare for a clinician peer discussion",
    "category": "denial-reversal",
    "purpose": "Help the treating office organize a peer discussion without assuming it replaces an appeal.",
    "intakeFields": [
      {
        "id": "deniedService",
        "label": "Denied Service/Treatment",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment, medication, or procedure denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "yourDoctorSpecialty",
        "label": "Your Doctor's Specialty",
        "type": "select",
        "required": true,
        "options": [
          "Primary Care/Family Medicine",
          "Internal Medicine",
          "Cardiology",
          "Oncology",
          "Neurology",
          "Orthopedic Surgery",
          "General Surgery",
          "Psychiatry",
          "Endocrinology",
          "Pulmonology",
          "Gastroenterology",
          "Dermatology",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalDirectorInfo",
        "label": "Insurance Medical Director Info",
        "type": "text",
        "required": false,
        "placeholder": "Name or specialty of insurance medical director (if known)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "denialJustification",
        "label": "Insurance Denial Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Exact reason given by insurance for the denial",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "clinicalEvidence",
        "label": "Available Clinical Evidence",
        "type": "textarea",
        "required": true,
        "placeholder": "Test results, imaging, labs, symptoms, and medical history supporting the need",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "callTimeline",
        "label": "Peer-to-Peer Call Timeline",
        "type": "select",
        "required": true,
        "options": [
          "Call scheduled within 24 hours",
          "Call scheduled within 1 week",
          "Call scheduled within 2 weeks",
          "No call scheduled yet"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Confirm who can request and participate in the discussion",
      "Give the treating team the denial reason and relevant records",
      "Ask whether a formal appeal must be filed separately and preserve its deadline"
    ],
    "evidence": [
      "Peer-discussion instructions",
      "Denial",
      "Clinician evidence references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for a clinician peer discussion. Help the treating office organize a peer discussion without assuming it replaces an appeal. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3932,
      "endLine": 4010,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-preauthorization",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "iro-master",
    "title": "Prepare for external review",
    "category": "denial-reversal",
    "purpose": "Identify whether the denial has an available independent review route.",
    "intakeFields": [
      {
        "id": "patientState",
        "label": "Patient State",
        "type": "select",
        "required": true,
        "options": [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deniedTreatment",
        "label": "Denied Treatment/Service",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment or service denied by insurance",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentSpecialty",
        "label": "Medical Specialty Area",
        "type": "select",
        "required": true,
        "options": [
          "Cardiology",
          "Oncology",
          "Neurology",
          "Orthopedics",
          "Surgery",
          "Mental Health",
          "Pharmacy/Medications",
          "Transplant",
          "Rare Disease",
          "Emergency Medicine",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "internalAppealResult",
        "label": "Internal Appeal Result",
        "type": "textarea",
        "required": true,
        "placeholder": "Summary of internal appeal denial and insurance company reasoning",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "clinicalComplexity",
        "label": "Clinical Case Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Standard case with clear guidelines",
          "Complex case requiring specialist review",
          "Rare condition with limited guidance",
          "Cutting-edge/experimental treatment",
          "Multi-system or comorbid conditions"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgencyLevel",
        "label": "Medical Urgency",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening emergency",
          "Urgent - significant health risk",
          "Semi-urgent - affects quality of life",
          "Non-urgent but medically necessary"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Read the final denial and confirm plan type and jurisdiction",
      "Ask about eligibility, exhaustion, and urgent-review conditions",
      "Prepare the required packet and proof of submission using the actual notice"
    ],
    "evidence": [
      "Final denial",
      "Internal appeal history",
      "Plan-specific external-review instructions"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for external review. Identify whether the denial has an available independent review route. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4010,
      "endLine": 4089,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-external-review",
      "insurance-wa-jurisdiction"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "state-commissioner-complaint",
    "title": "Prepare a regulator inquiry",
    "category": "denial-reversal",
    "purpose": "Find the right oversight route and document a specific unresolved problem.",
    "intakeFields": [
      {
        "id": "patientState",
        "label": "Your State",
        "type": "select",
        "required": true,
        "options": [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Full legal name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "violationType",
        "label": "Issue to review",
        "type": "select",
        "required": true,
        "options": [
          "Coverage denial to review",
          "Concern about claim handling",
          "Failure to investigate properly",
          "Unreasonable delay in processing",
          "Concern about payment timing",
          "Discriminatory coverage practices",
          "Failure to provide required notices",
          "Other issue to review"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "appealHistory",
        "label": "Appeal History",
        "type": "textarea",
        "required": true,
        "placeholder": "Complete timeline of internal appeals, external reviews, and all communication with insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "financialHarm",
        "label": "Financial Impact",
        "type": "number",
        "required": true,
        "placeholder": "Total financial harm from denial (medical costs, lost income, additional expenses)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "complianceViolations",
        "label": "Specific concerns to review",
        "type": "textarea",
        "required": true,
        "placeholder": "List specific ways the insurance company violated state regulations or your policy terms",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Confirm plan funding and the authority responsible for this product",
      "Describe the decision, attempted resolution, and requested help factually",
      "Preserve formal appeal deadlines while seeking regulator help"
    ],
    "evidence": [
      "Plan type evidence",
      "Notice and contact chronology",
      "Supporting documents"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a regulator inquiry. Find the right oversight route and document a specific unresolved problem. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4089,
      "endLine": 4171,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-cms-government"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "prior-auth-bypass",
    "title": "Explore prior-authorization options",
    "category": "coverage-expansion",
    "purpose": "Ask about legitimate urgent review, exceptions, and missing-information routes.",
    "intakeFields": [
      {
        "id": "treatmentRequiringPA",
        "label": "Treatment Requiring Prior Auth",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment, medication, or procedure requiring PA",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalUrgency",
        "label": "Medical Urgency Level",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening emergency",
          "Urgent - risk of serious deterioration",
          "Semi-urgent - significant symptom progression",
          "Routine but medically necessary",
          "Preventive/maintenance therapy"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentHistory",
        "label": "Previous Treatment History",
        "type": "textarea",
        "required": true,
        "placeholder": "Previous treatments for this condition, including any that were effective",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "paTimelineIssue",
        "label": "PA Timeline Issues",
        "type": "select",
        "required": true,
        "options": [
          "PA requested but no response within required timeframe",
          "PA denied and appeal timeline would delay necessary care",
          "PA required but treating provider not in network",
          "PA process would delay emergency/urgent treatment",
          "No current authorization issue; asking about the process"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerSpecialty",
        "label": "Treating Provider Type",
        "type": "select",
        "required": true,
        "options": [
          "Primary Care Physician",
          "Emergency Room",
          "Specialist (in-network)",
          "Specialist (out-of-network)",
          "Hospital/Inpatient",
          "Surgery Center",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceType",
        "label": "Insurance Type",
        "type": "select",
        "required": true,
        "options": [
          "Commercial/Private Insurance",
          "Medicare Advantage",
          "Medicaid/Medicare",
          "State Health Plan",
          "Federal Employee Plan",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the actual authorization requirement and current request status",
      "Ask the treating clinician whether an urgent pathway is appropriate",
      "Get written instructions for any exception and continue tracking formal appeal requirements"
    ],
    "evidence": [
      "Authorization policy",
      "Request and response",
      "Clinician urgency evidence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Explore prior-authorization options. Ask about legitimate urgent review, exceptions, and missing-information routes. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4171,
      "endLine": 4251,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-preauthorization",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "experimental-treatment-coverage",
    "title": "Review an experimental-treatment denial",
    "category": "coverage-expansion",
    "purpose": "Prepare a plan-specific evidence request for the treating team.",
    "intakeFields": [
      {
        "id": "medicalCondition",
        "label": "Medical Condition/Diagnosis",
        "type": "text",
        "required": true,
        "placeholder": "Specific diagnosis requiring experimental treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "experimentalTreatment",
        "label": "Experimental Treatment",
        "type": "text",
        "required": true,
        "placeholder": "Specific experimental treatment, drug, device, or procedure",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentStatus",
        "label": "Treatment Development Status",
        "type": "select",
        "required": true,
        "options": [
          "FDA clinical trial phase I/II",
          "FDA clinical trial phase III",
          "FDA breakthrough designation",
          "FDA fast track designation",
          "Compassionate use program",
          "Off-label use of approved treatment",
          "International treatment not US-approved",
          "Investigational device or procedure"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "standardTreatmentHistory",
        "label": "Standard Treatment History",
        "type": "textarea",
        "required": true,
        "placeholder": "All standard treatments tried and why they failed or are no longer effective",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "clinicalEvidence",
        "label": "Available Clinical Evidence",
        "type": "textarea",
        "required": true,
        "placeholder": "Clinical trial data, research studies, case reports supporting the experimental treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentUrgency",
        "label": "Treatment Timeline",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening - need immediate access",
          "Progressive condition - need within 30 days",
          "Condition worsening - need within 90 days",
          "Preventive - elective timing"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSupport",
        "label": "Physician Advocacy",
        "type": "select",
        "required": true,
        "options": [
          "Treating physician strongly supports",
          "Specialist recommends treatment",
          "Multiple physicians support",
          "Physician neutral/uncertain",
          "Limited physician support"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Get the policy definition and stated reason for the experimental classification",
      "Ask the clinician which evidence and coverage criteria address that reason",
      "Separate regulatory treatment access from insurance payment and confirm the appeal route"
    ],
    "evidence": [
      "Coverage policy",
      "Denial",
      "Clinician and study references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review an experimental-treatment denial. Prepare a plan-specific evidence request for the treating team. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4251,
      "endLine": 4333,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "appeal"
  },
  {
    "id": "out-of-network-exception",
    "title": "Request a network exception review",
    "category": "coverage-expansion",
    "purpose": "Document access barriers and ask whether the plan offers an exception.",
    "intakeFields": [
      {
        "id": "neededSpecialty",
        "label": "Required Medical Specialty",
        "type": "text",
        "required": true,
        "placeholder": "Specific medical specialty or type of provider needed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "oonProviderName",
        "label": "Out-of-Network Provider",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "networkLimitations",
        "label": "In-Network Provider Limitations",
        "type": "select",
        "required": true,
        "options": [
          "No in-network providers with required specialty",
          "In-network providers have long wait times (over 30 days)",
          "Geographic barriers - nearest in-network provider too far",
          "In-network providers lack required expertise/credentials",
          "Continuity of care - established relationship with OON provider",
          "Medical complexity requires specific provider expertise"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Type of Treatment/Service",
        "type": "select",
        "required": true,
        "options": [
          "Surgery requiring specialized expertise",
          "Rare disease treatment",
          "Complex diagnostic evaluation",
          "Specialized therapy/rehabilitation",
          "Second opinion consultation",
          "Ongoing specialized care management",
          "Emergency/urgent specialist care"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "geographicBarriers",
        "label": "Geographic Access Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Distance to nearest in-network provider and travel barriers (if applicable)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "medicalComplexity",
        "label": "Medical Complexity/Urgency",
        "type": "textarea",
        "required": true,
        "placeholder": "Why this specific provider is medically necessary and in-network providers are inadequate",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "priorRelationship",
        "label": "Prior Provider Relationship",
        "type": "select",
        "required": true,
        "options": [
          "Long-term established patient relationship",
          "Provider familiar with complex medical history",
          "Previous successful treatment by this provider",
          "Referred by current treating physician",
          "No prior relationship"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Keep records of in-network searches and responses",
      "Ask what evidence the plan requires for an exception or continuity request",
      "Obtain written approval and its payment terms before assuming out-of-network care is covered"
    ],
    "evidence": [
      "Network search record",
      "Plan exception instructions",
      "Clinician support"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Request a network exception review. Document access barriers and ask whether the plan offers an exception. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4333,
      "endLine": 4416,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-cms-directory",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "retroactive-coverage-activator",
    "title": "Investigate a coverage-date problem",
    "category": "coverage-expansion",
    "purpose": "Separate enrollment correction from a request for retroactive coverage.",
    "intakeFields": [
      {
        "id": "retroactiveTimeframe",
        "label": "Retroactive Coverage Period",
        "type": "select",
        "required": true,
        "options": [
          "Last 30 days",
          "31-90 days ago",
          "91-180 days ago",
          "6 months to 1 year ago",
          "More than 1 year ago"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "coverageGapReason",
        "label": "Why Coverage Wasn't Active",
        "type": "select",
        "required": true,
        "options": [
          "Insurance company processing error",
          "Employer enrollment mistake",
          "Incorrect effective date calculation",
          "Missed qualifying event enrollment",
          "Eligibility determination error",
          "Premium payment processing issue",
          "Administrative system error",
          "Other coverage gap reason"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalExpenses",
        "label": "Medical Expenses During Gap",
        "type": "number",
        "required": true,
        "placeholder": "Total medical expenses incurred during coverage gap period",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceType",
        "label": "Type of Insurance",
        "type": "select",
        "required": true,
        "options": [
          "Employer-sponsored health plan",
          "Individual/family plan from exchange",
          "Medicaid",
          "Medicare",
          "Medicare Advantage",
          "Short-term medical",
          "COBRA continuation",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "enrollmentIssues",
        "label": "Enrollment Issues",
        "type": "textarea",
        "required": true,
        "placeholder": "Detailed description of what went wrong with enrollment or coverage activation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "supportingDocumentation",
        "label": "Available Documentation",
        "type": "textarea",
        "required": false,
        "placeholder": "Any paperwork, emails, or records that support your case for retroactive coverage",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Collect enrollment, premium, and effective-date notices",
      "Ask the responsible plan or program to explain the gap and available correction process",
      "Keep service dates and appeal or enrollment notices distinct"
    ],
    "evidence": [
      "Enrollment records",
      "Premium evidence",
      "Coverage and denial notices"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Investigate a coverage-date problem. Separate enrollment correction from a request for retroactive coverage. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4416,
      "endLine": 4498,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-dol-claim-file"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "charge-master-decoder",
    "title": "Compare hospital price information",
    "category": "hospital-insider",
    "purpose": "Use public price information as a question source rather than a guaranteed patient price.",
    "intakeFields": [
      {
        "id": "billFile",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": true,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "hospitalSystem",
        "label": "Hospital System",
        "type": "text",
        "required": true,
        "placeholder": "Name of hospital or health system",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceType",
        "label": "Primary Service Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Room",
          "Inpatient Surgery",
          "Outpatient Surgery",
          "Diagnostic Testing",
          "Laboratory Services",
          "Imaging/Radiology",
          "Specialist Consultation",
          "Cardiac Procedures",
          "Cancer Treatment",
          "Maternity Care"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount of hospital bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "For-profit hospital",
          "Non-profit hospital",
          "Academic medical center",
          "Specialty hospital",
          "Critical access hospital",
          "Government hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "suspiciousCharges",
        "label": "Most Suspicious Charges",
        "type": "textarea",
        "required": false,
        "placeholder": "Line items that seem extremely high or questionable",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Match the service, setting, and billing entity before comparing",
      "Distinguish gross, cash, negotiated, and patient-responsibility amounts",
      "Ask the hospital how the relevant published information relates to this bill"
    ],
    "evidence": [
      "Published price reference",
      "Itemized bill",
      "Plan estimate or EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Compare hospital price information. Use public price information as a question source rather than a guaranteed patient price. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4498,
      "endLine": 4578,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-hospital-price-consumers",
      "cms-price-faq"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "revenue-cycle-exploiter",
    "title": "Plan the next billing follow-up",
    "category": "hospital-insider",
    "purpose": "Track a bill's actual status and follow up on unresolved requests.",
    "intakeFields": [
      {
        "id": "hospitalName",
        "label": "Hospital/Health System",
        "type": "text",
        "required": true,
        "placeholder": "Full name of hospital or health system",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount owed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "accountAge",
        "label": "Bill Age",
        "type": "select",
        "required": true,
        "options": [
          "0-30 days old",
          "31-60 days old",
          "61-90 days old",
          "91-120 days old",
          "Over 120 days old"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "collectionStatus",
        "label": "Collection Status",
        "type": "select",
        "required": true,
        "options": [
          "Not yet in collections",
          "Internal collections",
          "External collection agency",
          "Legal action threatened",
          "Lawsuit filed"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hospitalType",
        "label": "Hospital Ownership",
        "type": "select",
        "required": true,
        "options": [
          "Large for-profit chain (HCA, Tenet, etc.)",
          "Non-profit health system",
          "Academic medical center",
          "Community hospital",
          "Specialty hospital",
          "Government/public hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "paymentHistory",
        "label": "Payment History",
        "type": "select",
        "required": true,
        "options": [
          "No payments made",
          "Partial payments made",
          "Payment plan established",
          "Payment plan defaulted",
          "Settlement offer rejected"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billComplexity",
        "label": "Bill Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Single service/procedure",
          "Multiple services same day",
          "Multi-day admission",
          "Emergency + admission",
          "Multiple departments involved",
          "Insurance complications"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask who currently owns or services the account",
      "Record the status of correction, assistance, and payment discussions",
      "Ask for any hold or agreement in writing without assuming a standard collection timeline"
    ],
    "evidence": [
      "Current account notice",
      "Contact log",
      "Written agreements"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Plan the next billing follow-up. Track a bill's actual status and follow up on unresolved requests. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4578,
      "endLine": 4661,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-collection-contact",
      "cfpb-debt-validation"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "physician-champion-recruiter",
    "title": "Ask the treating team for support",
    "category": "hospital-insider",
    "purpose": "Request factual documentation or referral help from the treating office.",
    "intakeFields": [
      {
        "id": "treatingPhysicians",
        "label": "Treating Physicians",
        "type": "textarea",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalAffiliation",
        "label": "Physician-Hospital Relationship",
        "type": "select",
        "required": true,
        "options": [
          "Hospital employed physicians",
          "Independent physicians with privileges",
          "Mix of employed and independent",
          "Unknown physician employment status"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "careComplications",
        "label": "Care Complications/Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any complications, delays, errors, or quality issues during your care",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentOutcome",
        "label": "Treatment Outcome",
        "type": "select",
        "required": true,
        "options": [
          "Excellent outcome, fully satisfied",
          "Good outcome with minor concerns",
          "Mixed outcome with complications",
          "Poor outcome, significant problems",
          "Ongoing treatment, outcome unknown"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physiciansaweness",
        "label": "Physician Awareness of Bill",
        "type": "select",
        "required": true,
        "options": [
          "Physicians aware of high bill amount",
          "Physicians probably not aware of charges",
          "Some physicians aware, others not",
          "Unknown if physicians know about bill"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "alternativeTreatments",
        "label": "Alternative Treatments",
        "type": "textarea",
        "required": false,
        "placeholder": "Were there less expensive treatment options that could have been effective?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "relationshipQuality",
        "label": "Patient-Physician Relationship",
        "type": "select",
        "required": true,
        "options": [
          "Excellent relationship, very supportive",
          "Good relationship, generally positive",
          "Professional but distant",
          "Some concerns or issues",
          "Poor relationship or conflicts"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the exact billing or coverage question the office can address",
      "Ask for relevant documentation or the appropriate billing contact",
      "Keep clinical recommendations separate from any promised bill reduction"
    ],
    "evidence": [
      "Decision or bill question",
      "Treating-office response",
      "Record references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Ask the treating team for support. Request factual documentation or referral help from the treating office. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4661,
      "endLine": 4744,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "hospital-board-pressure",
    "title": "Prepare a formal hospital escalation",
    "category": "hospital-insider",
    "purpose": "Use the hospital's published complaint and assistance process for an unresolved issue.",
    "intakeFields": [
      {
        "id": "hospitalSystem",
        "label": "Hospital System",
        "type": "text",
        "required": true,
        "placeholder": "Full name of hospital or health system",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hospitalOwnership",
        "label": "Hospital Ownership Type",
        "type": "select",
        "required": true,
        "options": [
          "Non-profit hospital",
          "For-profit hospital chain",
          "Academic medical center",
          "Government/public hospital",
          "Religious/faith-based hospital",
          "Community hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount for executive escalation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "incomeLevel",
        "label": "Patient Income Level",
        "type": "select",
        "required": true,
        "options": [
          "Below federal poverty level",
          "100-200% of poverty level",
          "200-400% of poverty level",
          "Middle income (400-600% poverty)",
          "Upper middle income",
          "High income"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "communityStanding",
        "label": "Community context (optional)",
        "type": "select",
        "required": true,
        "options": [
          "Prefer not to record",
          "Local resident",
          "Other relevant context"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "mediaValue",
        "label": "Privacy preference",
        "type": "select",
        "required": true,
        "options": [
          "Keep details private",
          "Ask before sharing any details",
          "Not decided"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "qualityConcerns",
        "label": "Quality of Care Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any care quality issues, errors, or complications that strengthen your case",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "executiveConnections",
        "label": "Known escalation contact (optional)",
        "type": "textarea",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      }
    ],
    "prepare": [
      "Summarize the request, evidence, and responses already received",
      "Find the appropriate patient-relations or formal grievance contact",
      "State a concrete requested resolution and keep private details limited"
    ],
    "evidence": [
      "Escalation chronology",
      "Policy or bill reference",
      "Written responses"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a formal hospital escalation. Use the hospital's published complaint and assistance process for an unresolved issue. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4744,
      "endLine": 4830,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "upcoding-detector",
    "title": "Question a billed service level",
    "category": "coding-intelligence",
    "purpose": "Ask whether documentation supports a code without declaring upcoding from price or memory alone.",
    "intakeFields": [
      {
        "id": "billFile",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": false,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "cptCodes",
        "label": "CPT Procedure Codes",
        "type": "textarea",
        "required": true,
        "placeholder": "List all CPT codes from your bill (e.g., 99285, 36415, 85025)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "icdCodes",
        "label": "ICD-10 Diagnosis Codes",
        "type": "textarea",
        "required": true,
        "placeholder": "List all ICD-10 diagnosis codes from your bill (e.g., R50.9, K59.00)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDescription",
        "label": "Services Received",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe the actual medical services, procedures, and treatments you received",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalRecords",
        "label": "Medical Record Details",
        "type": "textarea",
        "required": false,
        "placeholder": "Any details from medical records about complexity, time spent, procedures performed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Department",
          "Inpatient Hospital",
          "Outpatient Surgery Center",
          "Physician Office",
          "Urgent Care",
          "Specialty Clinic",
          "Diagnostic Center"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "complexity",
        "label": "Perceived Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Very simple visit/procedure",
          "Routine complexity",
          "Moderately complex",
          "High complexity",
          "Extremely complex/critical"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record the exact code, modifier, and units",
      "Ask the coding team which documented factors support the billed level",
      "Request a written review and compare any corrected bill and EOB"
    ],
    "evidence": [
      "Itemized codes",
      "Relevant record references",
      "Review response"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Question a billed service level. Ask whether documentation supports a code without declaring upcoding from price or memory alone. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4830,
      "endLine": 4913,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "bundling-error-detector",
    "title": "Question separate procedure charges",
    "category": "coding-intelligence",
    "purpose": "Ask whether separate line items are appropriate for the service and payer.",
    "intakeFields": [
      {
        "id": "procedureCodes",
        "label": "All Procedure Codes (CPT)",
        "type": "textarea",
        "required": true,
        "placeholder": "List all CPT procedure codes from your bill, including surgeries, diagnostics, lab tests",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": true,
        "description": "Date when procedures were performed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "procedureType",
        "label": "Primary Procedure Type",
        "type": "select",
        "required": true,
        "options": [
          "Surgery (inpatient)",
          "Surgery (outpatient)",
          "Diagnostic procedures",
          "Laboratory testing",
          "Imaging/radiology",
          "Emergency procedures",
          "Cardiovascular procedures",
          "Endoscopic procedures"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "surgeonInvolved",
        "label": "Surgeon/Physician Details",
        "type": "textarea",
        "required": false,
        "placeholder": "Names of surgeons, assistants, and other physicians involved",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "anesthesiaServices",
        "label": "Anesthesia Services",
        "type": "select",
        "required": true,
        "options": [
          "General anesthesia",
          "Regional/spinal anesthesia",
          "Local anesthesia only",
          "Conscious sedation",
          "No anesthesia",
          "Multiple anesthesia types"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billedSeparately",
        "label": "Suspiciously Separate Charges",
        "type": "textarea",
        "required": false,
        "placeholder": "Services that seem related but were billed as separate line items",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "List the suspected overlap with dates and modifiers",
      "Ask whether a separate component, repeat service, or applicable coding rule explains it",
      "Request qualified review before treating the charges as an error"
    ],
    "evidence": [
      "All relevant line items",
      "Procedure record references",
      "EOB adjustments"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Question separate procedure charges. Ask whether separate line items are appropriate for the service and payer. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4913,
      "endLine": 4995,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "charity-care-optimizer",
    "title": "Review financial-assistance eligibility questions",
    "category": "hardship-mastery",
    "purpose": "Prepare an accurate policy-specific application and follow-up.",
    "intakeFields": [
      {
        "id": "hospitalName",
        "label": "Hospital Name",
        "type": "text",
        "required": true,
        "placeholder": "Name of hospital with charity care program",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "grossIncome",
        "label": "Annual Gross Income",
        "type": "number",
        "required": true,
        "placeholder": "Total household income before taxes",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "householdSize",
        "label": "Household Size",
        "type": "number",
        "required": true,
        "placeholder": "Number of people in your household",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "incomeType",
        "label": "Income Sources",
        "type": "select",
        "required": true,
        "options": [
          "Regular employment salary",
          "Variable/seasonal income",
          "Self-employment/business",
          "Retirement/social security",
          "Disability benefits",
          "Mixed income sources",
          "Unemployed/no income"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalExpenses",
        "label": "Annual Medical Expenses",
        "type": "number",
        "required": false,
        "placeholder": "Annual out-of-pocket medical expenses",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "assets",
        "label": "Asset Situation",
        "type": "select",
        "required": true,
        "options": [
          "Minimal assets (under $10K)",
          "Moderate assets ($10K-$50K)",
          "Significant assets ($50K-$200K)",
          "Substantial assets (over $200K)",
          "Homeowner with equity",
          "Retirement accounts only"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "financialHardships",
        "label": "Financial Hardships",
        "type": "textarea",
        "required": false,
        "placeholder": "Recent job loss, medical emergencies, family situations affecting finances",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "priorApplications",
        "label": "Prior Charity Care Applications",
        "type": "select",
        "required": true,
        "options": [
          "Never applied",
          "Applied and approved",
          "Applied and denied",
          "Applied with partial approval",
          "Application pending"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Read the current policy's household, income, asset, and care definitions",
      "Ask how variable income or changed circumstances are documented",
      "Track missing-document requests, partial decisions, and any available review"
    ],
    "evidence": [
      "Current policy and application",
      "Requested financial records",
      "Decision and receipt"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review financial-assistance eligibility questions. Prepare an accurate policy-specific application and follow-up. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4995,
      "endLine": 5079,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "irs-financial-assistance",
      "irs-fap-provider-list"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "afford"
  }
]);

for (const taskCatalogRecord of selfAdvocacyTasks) taskCatalogFreeze(taskCatalogRecord);
for (const taskCatalogCategory of TASK_CATEGORIES) taskCatalogFreeze(taskCatalogCategory);

function goldrockAnalyze(json, now) { return JSON.stringify(analyzeFacts(JSON.parse(json), { now: new Date(now) })); }
function goldrockTaskCatalog(now) { return JSON.stringify({categories: TASK_CATEGORIES, tasks: selfAdvocacyTasks.map(task => getSelfAdvocacyTask(task.id, {now: new Date(now)}))}); }
function goldrockTaskItem(id, now) { return JSON.stringify(getSelfAdvocacyTask(id, {now: new Date(now)})); }
function goldrockTaskIntake(action, argsJson) { const operations = {createTaskIntake, validateTaskIntake}; if (!Object.hasOwn(operations, action)) throw new Error("Unsupported task preparation operation."); return JSON.stringify(operations[action](...JSON.parse(argsJson))); }
function goldrockSources() { return JSON.stringify(sources); }
function goldrockPlaybooks(now) { return JSON.stringify(listPublicPlaybooks({ now: new Date(now) })); }
function goldrockCountermeasures(now) { return JSON.stringify(listCountermeasures({ now: new Date(now) })); }
function goldrockRecommendations(json, now) { return JSON.stringify(recommendCountermeasures(JSON.parse(json), { now: new Date(now) })); }
function goldrockKnowledge(query, factsJson, now) { return JSON.stringify(searchKnowledge(query, { ...(factsJson ? { facts: JSON.parse(factsJson) } : {}), limit: 100, now: new Date(now) })); }
function goldrockKnowledgeItem(id, now) { return JSON.stringify(getKnowledge(id, { now: new Date(now) })); }
function goldrockWorkbook(action, argsJson) { const operations = {createWorkbook, validateWorkbook, addProcess, updateProcess, removeProcess, addEvidence, updateEvidence, removeEvidence, addCriterion, updateCriterion, removeCriterion, addDeadline, updateDeadline, removeDeadline, addCommunication, updateCommunication, removeCommunication, addHold, updateHold, removeHold, summarizeWorkbook}; if (!Object.hasOwn(operations, action)) throw new Error("Unsupported workbook operation."); return JSON.stringify(operations[action](...JSON.parse(argsJson))); }
function goldrockReconciliation(action, argsJson) { const operations = {createReconciliation, validateReconciliation, addReconciliationGroup, addReconciliationDocument, selectReconciliationDocuments, addReconciliationPayment, voidReconciliationPayment, summarizeReconciliation}; if (!Object.hasOwn(operations, action)) throw new Error("Unsupported reconciliation operation."); return JSON.stringify(operations[action](...JSON.parse(argsJson))); }
function goldrockReconciliationIntake(factsJson) { return JSON.stringify(proposeReconciliationIntake(JSON.parse(factsJson))); }
function goldrockMoneyRecovery(action, argsJson) { const operations = {createMoneyRecovery, validateMoneyRecovery, addRecoveryRequest, addRecoveryEvent, voidRecoveryEvent, summarizeMoneyRecovery}; if (!Object.hasOwn(operations, action)) throw new Error("Unsupported money recovery operation."); return JSON.stringify(operations[action](...JSON.parse(argsJson))); }
function goldrockConversationCandidate(text) { return JSON.stringify(prepareConversationCandidate(text)); }
function goldrockConversationRequest(json) { return JSON.stringify(validateConversationRequest(JSON.parse(json))); }
function goldrockConversation(action, argsJson) { const operations = {createConversation, validateConversation, addConversationTurn, appendConversationEvent, summarizeConversation, conversationFactsChanged, conversationSourcesCurrent, conversationTurnContextCurrent}; if (!Object.hasOwn(operations, action)) throw new Error("Unsupported conversation operation."); return JSON.stringify(operations[action](...JSON.parse(argsJson))); }
function goldrockMoneyRecoveryGuide(kind, now) { return JSON.stringify(getMoneyRecoveryGuide(kind, { now: new Date(now) })); }
