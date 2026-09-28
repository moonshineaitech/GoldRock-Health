/** Original consumer-request templates. Reviewed primary sources; no eligibility or deadline inference. */
export const billingSources = [
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

export const billingRoutes = [
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
