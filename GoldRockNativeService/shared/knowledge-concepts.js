/** Reviewed public consumer knowledge,2026-09-27. Original questions and evidence checklists; no member data or outbound actions. */
export const knowledgeSources = [
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

export const knowledgeConcepts = [
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
