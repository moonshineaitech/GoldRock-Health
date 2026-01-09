import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Scale,
  Heart,
  Baby,
  Stethoscope,
  Building2,
  AlertCircle,
  Lightbulb,
  Target,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Ban,
  Calendar,
  Users,
  Briefcase,
  Lock,
  Gavel,
  TrendingDown,
  XCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Receipt,
  HeartPulse,
  Bone,
  Brain,
  Activity,
  Pill,
  Scissors,
  Ambulance,
  BedDouble,
  Syringe,
  Scan,
  ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaybookChatbot } from "@/components/playbook-chatbot";

const insiderSecrets = [
  {
    title: "Hospital bills are negotiable BEFORE they escalate",
    secret: "Hospitals expect negotiation. The initial bill is the 'sticker price' - almost no one pays full price. Billing departments have authority to reduce bills by 25-60% if you simply ask.",
    actionable: "Never pay the first bill. Call billing within 30 days and say: 'I cannot afford this amount. What financial assistance programs do you have?'"
  },
  {
    title: "The 'prompt pay discount' is hidden but real",
    secret: "Most hospitals offer 10-30% discounts for paying within 30 days. They rarely advertise this. Some hospitals offer up to 50% for upfront cash payment.",
    actionable: "Before making any payment, ask: 'What is your prompt pay or cash pay discount?' Get the answer in writing before paying."
  },
  {
    title: "Itemized bills reveal massive overcharges",
    secret: "60-80% of hospital bills contain errors. Without an itemized bill, you can't find them. Hospitals know this and often provide summary bills hoping you won't request details.",
    actionable: "ALWAYS request an itemized bill with CPT/HCPCS codes. Compare each line item to fair market rates using Healthcare Bluebook."
  },
  {
    title: "Charity care exists at almost every hospital",
    secret: "Non-profit hospitals (60% of US hospitals) are LEGALLY REQUIRED to provide charity care. Many for-profit hospitals do too. Income limits often go up to 400% of federal poverty level.",
    actionable: "Ask for a 'financial assistance application' or 'charity care application' regardless of your income. The worst they can say is no."
  },
  {
    title: "Payment plans have hidden flexibility",
    secret: "Hospitals often offer 0% interest payment plans for 12-36 months. But they start with short plans. You can negotiate longer terms and lower monthly payments.",
    actionable: "If offered a 12-month plan, counter with: 'I can only afford $X per month. Can we extend this to 24 or 36 months at 0% interest?'"
  },
  {
    title: "Your insurance EOB is your weapon",
    secret: "The Explanation of Benefits shows what your insurance actually paid and what they consider 'reasonable and customary.' If the hospital charges more, you have leverage.",
    actionable: "Compare hospital charges to EOB 'allowed amounts.' Any charge above this is potentially negotiable or even improper balance billing."
  },
  {
    title: "Billing departments have quotas too",
    secret: "Hospital billing staff are measured on collection rates. They'd rather settle for less than send accounts to collections where recovery drops to 4-7 cents on the dollar.",
    actionable: "Use their incentives: 'I can pay $X today to resolve this, or this may end up unresolved. What can we work out?'"
  },
  {
    title: "The '30-day rule' protects you",
    secret: "Most hospitals have internal policies requiring 30-60 days notice before sending to collections. Some states mandate even longer. This gives you negotiation time.",
    actionable: "When you receive a bill, ask: 'How long before this goes to collections?' and 'What happens if I'm actively disputing charges?'"
  },
  {
    title: "Medical billing codes are often wrong",
    secret: "Studies show 30-40% of bills have incorrect CPT codes. 'Upcoding' (billing for more expensive procedures) and 'unbundling' (separating bundled services) are rampant.",
    actionable: "Google every CPT code on your bill. If the description doesn't match what you received, dispute it as a coding error."
  },
  {
    title: "Patient advocates work for you",
    secret: "Most hospitals have patient advocates or patient financial counselors whose job is to help you. They can access discounts and programs that billing staff won't mention.",
    actionable: "Ask to speak with a 'patient advocate,' 'patient financial counselor,' or 'financial services coordinator.' They have more authority than regular billing reps."
  },
  {
    title: "Surprise billing protections are broader than you think",
    secret: "The No Surprises Act protects you from balance billing for ALL emergency services and many in-network hospital situations - even for out-of-network providers.",
    actionable: "If any provider was out-of-network, ask: 'Does the No Surprises Act apply to this charge?' File a dispute if they say no but you believe it should."
  },
  {
    title: "Hospitals fear bad reviews and complaints",
    secret: "Hospital administrators track complaints, especially those that might go public or to regulators. A well-documented complaint to the CEO often gets fast resolution.",
    actionable: "If billing is unresponsive, write to the hospital CEO and patient experience officer. Cc the state attorney general. Problems often resolve within days."
  }
];

const preCollectionsScenarios = [
  {
    id: "childbirth-hospital-bill",
    title: "Hospital Childbirth Bill Just Received",
    icon: Baby,
    featured: true,
    situation: "You just received your hospital bill after having a baby - ranging from $5,000 to $50,000+. The bill is overwhelming and seems full of charges you don't understand or didn't expect.",
    insiderKnowledge: [
      "The AVERAGE hospital childbirth bill has 15-25 billing errors - you likely have multiple overcharges",
      "Hospitals routinely charge $40-80 for 'skin-to-skin contact' after delivery - holding your own baby. This is a known scandal and almost always disputable",
      "NICU charges are the #1 most inflated hospital charges - marked up 300-500% over cost. Challenge EVERY day of NICU if applicable",
      "If your baby 'roomed in' with you but you were charged for nursery care, that's potentially fraudulent billing",
      "Lactation consultant charges ($150-400) often appear for visits that never happened or lasted 5 minutes instead of the billed hour",
      "C-section bills frequently charge for 2-3 'assistant surgeons' when only the OB/GYN was present - challenge these",
      "Epidural charges are often 'unbundled' - charged separately for placement, medication, and monitoring when they should be bundled",
      "The 'facility fee' and 'delivery room' charges are often duplicates of each other - watch for this",
      "Many hospitals charge 'observation' rates for the first hours, then switch to 'inpatient' - this double-billing is disputable",
      "If you were induced, verify you're not being charged for both 'induction' AND 'labor management' as these are often bundled",
      "Newborn hearing tests and metabolic screens are often mandated by state law to be provided free - verify before paying",
      "The 72-hour Coombs test and bilirubin checks are standard newborn care often billed as 'diagnostic procedures' at premium rates"
    ],
    billForensics: {
      title: "Common Childbirth Billing Errors to Challenge NOW",
      redFlags: [
        { code: "59400/59510", description: "Global OB package - Should include all routine prenatal AND delivery care. Separate prenatal charges are double-billing", amount: "$3,000-8,000" },
        { code: "59899", description: "'Mucus extraction' - Standard newborn care included in delivery, NOT separately billable", amount: "$200-800" },
        { code: "99477", description: "NICU initial day - Verify baby was actually IN the NICU, not just observed in regular nursery", amount: "$2,000-8,000 per day" },
        { code: "99238/99239", description: "Discharge management - Often billed even for routine same-day discharge. Challenge if stay was uncomplicated", amount: "$200-600" },
        { code: "S9443", description: "Lactation consultant - Verify visit actually occurred AND that duration matches billing", amount: "$150-400" },
        { code: "82947", description: "Glucose testing - Often billed multiple times for routine blood sugar monitoring", amount: "$50-150 each" },
        { code: "59025", description: "Fetal non-stress test - Often billed separately when it should be part of labor monitoring", amount: "$200-600" },
        { code: "62311/62319", description: "Epidural codes - Watch for unbundling of catheter, medication, and monitoring", amount: "$1,500-4,000 total" }
      ],
      unbundlingSchemes: [
        "Epidural placement, catheter insertion, and medication administration billed as 3 separate charges",
        "Labor room AND delivery room charged separately when most hospitals use L&D suites",
        "Fetal monitoring billed separately from labor management",
        "IV access billed separately from IV fluids and medications",
        "Post-delivery recovery billed as separate 'recovery room' charge",
        "Newborn assessment billed separately from pediatrician exam",
        "Surgical tray and supplies billed separately from C-section procedure"
      ],
      phantomCharges: [
        "Circumcision charged but baby is a girl (more common than you'd think)",
        "Nursery care charges during exclusive 'rooming in'",
        "Multiple pediatrician visits when only the required discharge exam occurred",
        "Hearing test billed as 'complete' when it was actually 'referred' for follow-up",
        "Postpartum depression screening billed but never administered",
        "Newborn photos billed as 'medical documentation'",
        "Lactation classes never attended but still charged"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "First Call to Hospital Billing (Within 7 Days)",
        approach: "Your first call should establish that you're informed and will negotiate. Don't pay anything on this call.",
        script: "Hello, I'm calling about my account for services on [DATE]. I've received the initial bill but I need some clarification before I can address this. First, can you send me a complete itemized bill with all CPT codes? Second, I'd like information about your financial assistance programs and any prompt-pay discounts you offer. Can you also tell me who I should speak with about billing questions - do you have a patient advocate or financial counselor?",
        followUp: "If they push for payment: 'I understand you'd like to resolve this, but I need to review the itemized charges first. How long do I have before any collection action? Can you note my account that I'm actively working on this?'"
      },
      disputeCall: {
        title: "Dispute Call After Reviewing Itemized Bill",
        approach: "Armed with your itemized bill, call to formally dispute specific charges.",
        script: "I've reviewed my itemized bill and found several charges I need to dispute. First, [CHARGE 1] for $[AMOUNT] - this appears to be [REASON]. Second, [CHARGE 2] for $[AMOUNT] - according to my records, this [DIDN'T HAPPEN/IS DUPLICATE/IS UNBUNDLED]. I'm also requesting a billing audit because the total charges significantly exceed fair market rates according to Healthcare Bluebook. Can you connect me with someone who has authority to review these disputes?",
        escalationScript: "If they won't adjust: 'I understand you may need supervisor approval. I'd like to formally dispute these charges in writing and have them reviewed. If we can't resolve this, I'll be filing a complaint with [STATE] Attorney General's healthcare division and requesting an investigation.'"
      },
      financialAssistance: {
        title: "Financial Assistance/Charity Care Application",
        approach: "Apply for financial assistance regardless of income. Many programs cover up to 400% FPL.",
        script: "I'd like to apply for financial assistance. Can you send me the application? Also, what income limits qualify for partial or full assistance? While my application is pending, can you put a hold on any collection activity on my account? And if I qualify, does the assistance apply retroactively to this bill?",
        followUp: "After applying: 'I submitted my financial assistance application on [DATE]. Can you confirm it was received and tell me the expected processing time? My account should be on hold during this review.'"
      },
      settlementOffer: {
        title: "Settlement Negotiation Script",
        approach: "Once disputes are addressed, negotiate a lump-sum settlement or payment plan.",
        script: "I've reviewed the adjusted balance of $[AMOUNT]. I'm prepared to resolve this account today with a payment of $[30-50% OF BALANCE]. This would be a one-time payment in full settlement. I believe this is fair because [CITE YOUR REASONS: fair market rates, financial hardship, remaining disputed charges]. Can you accept this to close the account?",
        escalationScript: "If they refuse: 'I understand. What is the best settlement amount you CAN authorize? If we can't reach an agreement, I'll need to request a formal payment plan at the minimum monthly amount, which will extend this account for years. A settlement today benefits both of us.'"
      }
    },
    legalProtections: {
      federal: [
        { law: "No Surprises Act (2022)", protection: "Protects you from balance billing by out-of-network providers at in-network hospitals for maternity services", enforcement: "File complaint at cms.gov/nosurprises or call 1-800-985-3059" },
        { law: "Affordable Care Act §501(r)", protection: "Non-profit hospitals must have charity care policies, notify you of assistance availability, and cannot bill more than amounts generally billed to insured patients", enforcement: "File complaint with IRS Form 13909 and state attorney general" },
        { law: "HIPAA", protection: "Your billing information is protected health information. Unauthorized disclosure to family members or employers is a federal violation", enforcement: "File complaint at hhs.gov/ocr" },
        { law: "Fair Credit Billing Act", protection: "You have the right to dispute billing errors within 60 days and the hospital must investigate", enforcement: "Send written dispute to hospital billing address" },
        { law: "Hospital Price Transparency Rule (2021)", protection: "Hospitals must publish prices for 300 'shoppable services' including childbirth, and cannot charge more than published prices", enforcement: "File complaint with CMS at hospitalpricetransparency@cms.hhs.gov" }
      ],
      stateExamples: [
        { state: "California", protection: "SB 1276: Uninsured patients cannot be charged more than government payers. 150-day collections moratorium. Income up to 400% FPL qualifies for charity care at non-profit hospitals." },
        { state: "New York", protection: "Surprise Bill Law: Strongest in nation for maternity. Hospitals must offer interest-free payment plans up to 36 months. Emergency Medicaid retroactive coverage for childbirth." },
        { state: "New Jersey", protection: "Out-of-network bill protection for all hospital services. All hospital-based physicians treated as in-network if hospital is in-network. 30-day dispute period." },
        { state: "Texas", protection: "Balance billing banned for ER and maternity at in-network facilities. Itemized bill required within 10 days of request. Patient bill of rights must be provided." },
        { state: "Colorado", protection: "Hospital Discounted Care Program: Up to 250% FPL = free care, 250-400% FPL = discounted care. Hospitals must screen patients before collections." },
        { state: "Illinois", protection: "Hospital Uninsured Patient Discount Act: Mandatory 25-100% discounts based on income. 6-month credit reporting delay for medical debt." }
      ]
    },
    timeline: {
      title: "Pre-Collections Action Timeline",
      checkpoints: [
        { day: "Day 1-3", actions: ["Open bill but DON'T pay immediately", "Call insurance to verify what was paid vs. patient responsibility", "Request complete itemized bill with CPT codes", "Ask about financial assistance programs"], status: "critical" },
        { day: "Day 4-14", actions: ["Review itemized bill line by line", "Compare charges to Healthcare Bluebook fair market rates", "Identify potential errors, duplicates, and overcharges", "Gather any relevant medical records"], status: "important" },
        { day: "Day 15-30", actions: ["Submit formal dispute letter for identified errors", "Apply for financial assistance/charity care", "Request prompt pay discount quote", "Document all communications"], status: "strategic" },
        { day: "Day 31-60", actions: ["Follow up on dispute resolution", "Follow up on financial assistance application", "Begin settlement negotiations if disputes resolved", "Set up payment plan if needed"], status: "resolution" },
        { day: "Before Collections", actions: ["Confirm account status and any pending actions", "Get any settlement or payment plan in writing", "Make first payment if agreement reached", "Keep all documentation for records"], status: "protection" }
      ]
    },
    templates: {
      itemizedBillRequest: {
        title: "Itemized Bill Request Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Billing Department
[Hospital Address]
[City, State ZIP]

RE: Itemized Bill Request - Account #[ACCOUNT NUMBER]
Date of Service: [DATE]
Patient: [YOUR NAME]

To Whom It May Concern:

I am writing to formally request a complete itemized bill for services provided on [DATE]. Under HIPAA regulations and [STATE] healthcare transparency laws, I am entitled to receive a detailed statement of all charges.

Please provide:

1. Complete itemized statement with ALL charges
2. CPT/HCPCS procedure codes for each line item
3. ICD-10 diagnosis codes used for billing
4. Number of units for each service
5. Charge amount per unit
6. Date each service was provided
7. Name of each provider who rendered services

Please send this within 10 business days as required by law. I am actively reviewing my account and need this information to proceed.

Additionally, please send me:
- Your financial assistance/charity care application
- Information about prompt pay discounts
- Your hospital's patient billing rights policy

Please confirm receipt of this request and provide an estimated delivery date.

Sincerely,
[Your Signature]
[Your Name]
[Phone Number]
[Email]`
      },
      disputeLetter: {
        title: "Billing Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Billing Department
[Hospital Address]
[City, State ZIP]

RE: Formal Billing Dispute - Account #[ACCOUNT NUMBER]
Date of Service: [DATE]
Original Billed Amount: $[AMOUNT]

SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED

To Whom It May Concern:

I am formally disputing the following charges on my account:

DISPUTED CHARGES:
1. [CPT CODE] - [DESCRIPTION] - $[AMOUNT]
   Reason: [SPECIFIC REASON - e.g., "This service was not provided," "This is a duplicate charge," "This should be bundled with [OTHER CODE]"]

2. [CPT CODE] - [DESCRIPTION] - $[AMOUNT]
   Reason: [SPECIFIC REASON]

3. [CPT CODE] - [DESCRIPTION] - $[AMOUNT]
   Reason: [SPECIFIC REASON]

Total Disputed Amount: $[TOTAL]

I am requesting:
1. A complete audit of my account by your billing compliance department
2. Removal or adjustment of the disputed charges
3. A corrected bill reflecting accurate charges
4. Written explanation of any charges you maintain are correct

Under the Fair Credit Billing Act and [STATE] consumer protection laws, I am entitled to a response within 30 days. While this dispute is pending, I expect no collection activity on my account.

I remain willing to pay legitimate charges once this dispute is resolved. If we cannot reach a resolution, I am prepared to file complaints with:
- [STATE] Attorney General's Office
- [STATE] Department of Health
- Centers for Medicare & Medicaid Services
- The hospital's compliance officer and board of directors

Please respond in writing within 30 days.

Sincerely,
[Your Signature]
[Your Name]
[Phone Number]
[Email]

Enclosures:
- Copy of itemized bill with disputed items highlighted
- [Any supporting documentation]`
      },
      financialAssistanceLetter: {
        title: "Financial Assistance Cover Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Financial Assistance Department
[Hospital Address]
[City, State ZIP]

RE: Financial Assistance Application - Account #[ACCOUNT NUMBER]
Date of Service: [DATE]
Current Balance: $[AMOUNT]

To Whom It May Concern:

I am submitting this application for financial assistance for medical services provided on [DATE]. I am requesting [FULL CHARITY CARE WRITE-OFF / PARTIAL DISCOUNT / PAYMENT PLAN ASSISTANCE] based on my current financial situation.

Current Circumstances:
- Household size: [NUMBER]
- Annual household income: $[AMOUNT]
- This represents approximately [X]% of the Federal Poverty Level
- [BRIEFLY DESCRIBE ANY HARDSHIP: job loss, medical issues, family situation, etc.]

I am providing the following documentation:
[ ] Completed financial assistance application
[ ] Proof of income (pay stubs, tax return, unemployment letter)
[ ] Proof of household size
[ ] Bank statements
[ ] [Other relevant documents]

I understand this hospital is [A NON-PROFIT ORGANIZATION REQUIRED BY LAW TO PROVIDE CHARITY CARE / committed to helping patients with financial hardship]. I am requesting that my application be processed promptly and that my account be placed on administrative hold during review.

If I qualify for partial assistance, I am willing to discuss a reasonable payment plan for any remaining balance. Please contact me at [PHONE] or [EMAIL] if you need additional information.

Thank you for your consideration.

Sincerely,
[Your Signature]
[Your Name]
[Phone Number]
[Email]

Enclosures: [List all enclosed documents]`
      }
    },
    calculators: {
      charityCareLikelihood: {
        description: "Use these 2024 Federal Poverty Level guidelines to estimate your charity care eligibility:",
        fplThresholds2024: {
          "1": 15060,
          "2": 20440,
          "3": 25820,
          "4": 31200,
          "5": 36580,
          "6": 41960
        }
      },
      negotiationTargets: {
        description: "Typical negotiation outcomes for childbirth bills:",
        targets: [
          { scenario: "Cash pay / Uninsured", discount: "40-60% off", typical: "Pay 40-60% of bill" },
          { scenario: "Charity care eligible", discount: "50-100% off", typical: "Pay 0-50% of bill" },
          { scenario: "Insurance + high deductible", discount: "10-30% off", typical: "Pay 70-90% of responsibility" },
          { scenario: "Identified billing errors", discount: "Errors removed + 10-20%", typical: "Pay corrected amount minus negotiated discount" }
        ]
      }
    },
    successStories: [
      { 
        title: "Reduced $28,000 Childbirth Bill to $4,200",
        outcome: "New mother identified $8,000 in billing errors (NICU charges for baby never in NICU, duplicate facility fees). After disputing errors and applying for financial assistance at 280% FPL, remaining balance was discounted 70%.",
        keyTactics: "Requested itemized bill, compared to fair market rates, disputed errors in writing, applied for financial assistance while disputes pending"
      },
      {
        title: "C-Section Bill Cut from $42,000 to $12,000",
        outcome: "Patient caught unbundled surgical charges ($6,000), phantom assistant surgeon fees ($4,500), and inflated recovery room charges. After escalation to patient advocate, hospital agreed to charge Medicare rates plus 15%.",
        keyTactics: "Requested surgical operative report, verified personnel present, demanded Medicare-rate pricing for uninsured"
      },
      {
        title: "Insurance-Covered Birth: $8,500 Patient Responsibility to $0",
        outcome: "Out-of-network anesthesiologist charged $4,500 above insurance payment. Using No Surprises Act, patient successfully disputed balance billing. Remaining charges were charity care eligible.",
        keyTactics: "Filed No Surprises Act complaint, requested insurance reconsideration, applied for charity care for remaining balance"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Billing Representative", action: "Initial contact - request itemized bill, ask about discounts" },
      { level: 2, entity: "Billing Supervisor / Patient Financial Counselor", action: "Dispute specific charges, request charity care application" },
      { level: 3, entity: "Patient Advocate / Patient Experience Officer", action: "Escalate unresolved disputes, request account audit" },
      { level: 4, entity: "Hospital Compliance Officer / CFO", action: "Report potential billing fraud, request executive review" },
      { level: 5, entity: "State Attorney General / CMS", action: "File formal complaints if violations found" }
    ]
  },
  {
    id: "er-hospital-bill",
    title: "Emergency Room Bill Just Received",
    icon: Ambulance,
    featured: true,
    situation: "You visited the ER for an emergency and just received a shocking bill - potentially $2,000 to $20,000+ for what may have been a few hours of care. Many charges seem excessive or confusing.",
    insiderKnowledge: [
      "ER 'facility fees' are the most inflated charges in healthcare - often $1,000-3,000 just for walking in the door before any treatment",
      "ERs use 5 'severity levels' (99281-99285) for billing. Higher levels = more expensive. Many hospitals systematically upcode to higher levels",
      "If you were stable and could have gone to urgent care, you were likely overtriaged. The ER billed emergency rates for non-emergency care",
      "The 'observation' vs 'admission' distinction matters hugely - observation often costs MORE than inpatient admission and isn't covered the same by insurance",
      "Separately billing for each supply item (IV tubing, bandages, gauze) is called 'exploding' and can add hundreds in unnecessary charges",
      "ER doctors are often CONTRACTORS, not employees. Their bill will come separately and may be out-of-network even at in-network hospitals",
      "CT scans in ERs are often billed at 3-5x what the same scan costs at an imaging center. You can challenge excessive radiology charges",
      "Blood tests ordered 'stat' in the ER are often billed at double the regular lab rate - verify stat billing was actually necessary",
      "If you waited hours to be seen, you were triaged as 'non-emergent' - use this to argue against high-acuity billing codes",
      "Many ER visits result in bills from 3-5 different providers: facility, ER physician, radiologist, lab, specialists. Review each separately",
      "The No Surprises Act specifically protects you from balance billing for ALL emergency services, regardless of network status"
    ],
    billForensics: {
      title: "ER Billing Red Flags to Challenge",
      redFlags: [
        { code: "99285", description: "Highest severity ER code - Should only be for life-threatening emergencies requiring complex decision making", amount: "$800-2,500" },
        { code: "99284", description: "High severity ER code - Often used for visits that should be 99283 (moderate)", amount: "$500-1,500" },
        { code: "G0378", description: "Observation per hour - Watch for excessive hours billed vs. actual time in observation", amount: "$150-400/hour" },
        { code: "99217", description: "Observation discharge - Often billed on top of hourly observation charges", amount: "$200-500" },
        { code: "70450-70498", description: "CT scan codes - Compare to imaging center rates (often 50-75% less)", amount: "$800-3,000" },
        { code: "96374/96375", description: "IV push charges - Often billed multiple times for same medication", amount: "$100-300 each" },
        { code: "36410/36415", description: "Venipuncture - Blood draw should not be billed separately if lab work was done", amount: "$50-200" },
        { code: "12001-12007", description: "Laceration repair - Verify length and complexity match actual injury", amount: "$200-1,000" }
      ],
      unbundlingSchemes: [
        "IV start, IV tubing, IV fluids, and IV medication all billed separately",
        "Facility fee PLUS separate ER evaluation code",
        "Trauma activation fee for non-trauma visits",
        "Nursing assessment billed separately from facility fee",
        "Cardiac monitoring billed per hour on top of other charges",
        "Separate charges for reading AND interpreting the same test"
      ],
      phantomCharges: [
        "Specialist consultation that never happened (patient never saw specialist)",
        "Multiple ER physician charges when only one doctor provided care",
        "Extended observation hours when patient was in waiting room",
        "Medical supplies never used (splints, casts for uninjured limbs)",
        "Medications listed as administered but patient refused or left before receiving"
      ]
    },
    negotiationPlaybooks: {
      emergencyReduction: {
        title: "ER Bill Reduction Strategy",
        approach: "Challenge the severity level and facility fees - the two biggest components of ER bills.",
        script: "I'm calling about my ER visit on [DATE]. I've reviewed the itemized bill and have concerns. First, the bill shows [SEVERITY LEVEL] but my visit was for [DESCRIBE ACTUAL CONDITION]. Second, the facility fee of $[AMOUNT] seems excessive for [LENGTH OF VISIT]. Can I speak with someone about adjusting these charges to reflect the actual care provided?",
        escalationScript: "If they won't adjust: 'I'll need to dispute this in writing and request my medical records to verify the severity level was appropriate. I'm also planning to compare your charges to CMS fee schedules and file a complaint if there's significant variance.'"
      },
      noSurprisesAct: {
        title: "No Surprises Act Enforcement",
        approach: "If ANY ER provider was out-of-network, you're protected by federal law.",
        script: "I received a bill for $[AMOUNT] from [PROVIDER] for my ER visit on [DATE]. Since this was emergency care and [PROVIDER] was out-of-network, this bill is subject to the No Surprises Act. I should only be responsible for my in-network cost-sharing amount. Please rebill this at the qualifying payment amount or direct me to your No Surprises Act dispute process.",
        followUp: "If they claim it doesn't apply: 'The No Surprises Act applies to ALL emergency services regardless of network status. I'm filing a complaint with CMS at cms.gov/nosurprises and disputing this with my insurance carrier.'"
      },
      facilityFeeDispute: {
        title: "Facility Fee Challenge",
        approach: "ER facility fees are often the biggest target for reduction.",
        script: "I'm reviewing the facility fee of $[AMOUNT] on my bill. This fee seems disproportionate to the care received - I was at the facility for [TIME] and received [BRIEF DESCRIPTION]. What is the basis for this facility fee? Can you provide documentation of what this charge covers and how it was calculated?",
        escalationScript: "Most patients can't afford fees of this magnitude. I'm requesting a financial hardship review and asking that this fee be reduced to a reasonable level in line with CMS reimbursement rates."
      }
    },
    legalProtections: {
      federal: [
        { law: "EMTALA", protection: "Hospitals must provide emergency screening and stabilizing treatment regardless of ability to pay. Cannot condition treatment on payment.", enforcement: "File complaint with CMS regional office" },
        { law: "No Surprises Act", protection: "You cannot be balance billed by ANY out-of-network provider for emergency services. Only responsible for in-network cost sharing.", enforcement: "File complaint at cms.gov/nosurprises" },
        { law: "Hospital Price Transparency Rule", protection: "Hospitals must publish standard charges for ER services online in machine-readable format", enforcement: "Report non-compliance to hospitalpricetransparency@cms.hhs.gov" },
        { law: "ACA Emergency Services", protection: "Insurance must cover emergency services without prior authorization and cannot impose higher cost-sharing for out-of-network emergency care", enforcement: "File complaint with state insurance commissioner" }
      ],
      stateExamples: [
        { state: "California", protection: "Knox-Keene Act: Balance billing banned for all emergency services. Hospitals must provide charity care screening. Cannot require deposits before emergency treatment." },
        { state: "New York", protection: "Surprise Bill Law covers all emergency room services. Independent dispute resolution for out-of-network charges. Hospitals must accept insurance payment as full." },
        { state: "Florida", protection: "ER facilities must provide good faith estimate before treatment when possible. No balance billing for HMO members at in-network hospitals." },
        { state: "Texas", protection: "Out-of-network balance billing banned in ERs. Mediation available for bills over $500." }
      ]
    },
    timeline: {
      title: "ER Bill Response Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Review bill for obvious errors or unfamiliar charges", "Call insurance to confirm what they paid vs. your responsibility", "Check if any provider was out-of-network (triggers No Surprises Act)", "Request itemized bill with CPT codes"], status: "critical" },
        { day: "Day 6-15", actions: ["Compare charges to fair market rates", "Identify severity level (99281-99285) and verify appropriateness", "Request medical records if disputing severity or services", "Document everything"], status: "important" },
        { day: "Day 16-30", actions: ["Submit written disputes for billing errors", "File No Surprises Act complaint if applicable", "Apply for financial assistance", "Request prompt-pay discount quote"], status: "strategic" },
        { day: "Day 31-60", actions: ["Follow up on disputes and applications", "Negotiate settlement or payment plan", "Get any agreement in writing", "Make first payment if agreement reached"], status: "resolution" }
      ]
    },
    templates: {
      erDisputeLetter: {
        title: "ER Bill Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Billing Department
[Hospital Address]
[City, State ZIP]

RE: Formal Dispute - ER Services Account #[ACCOUNT NUMBER]
Date of Service: [DATE]
Billed Amount: $[AMOUNT]

SENT VIA CERTIFIED MAIL

To Whom It May Concern:

I am formally disputing charges from my emergency room visit on [DATE]. After reviewing my itemized bill and medical records, I have identified the following issues:

1. SEVERITY LEVEL DISPUTE
The bill reflects [99284/99285] billing code, indicating high/highest severity. However, my visit was for [DESCRIBE CONDITION], I waited [X HOURS] to be seen (indicating triage assessment of non-emergent), and the treatment provided was [DESCRIBE BASIC TREATMENT]. This coding does not reflect the actual complexity of my visit.

2. SPECIFIC CHARGE DISPUTES
[List specific charges you're disputing with reasons]

3. REQUEST FOR ADJUSTMENT
Based on the above, I am requesting:
- Downgrade of severity level to [APPROPRIATE LEVEL]
- Removal/adjustment of disputed charges totaling $[AMOUNT]
- Financial assistance application
- Prompt-pay discount information

Please respond in writing within 30 days. No collection activity should occur while this dispute is pending.

Sincerely,
[Your Signature]
[Your Name]`
      },
      noSurprisesDispute: {
        title: "No Surprises Act Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Provider/Hospital Name]
Billing Department
[Address]
[City, State ZIP]

RE: No Surprises Act Dispute - Account #[ACCOUNT NUMBER]
Date of Emergency Service: [DATE]

To Whom It May Concern:

I received a bill for $[AMOUNT] for emergency services provided on [DATE]. I am disputing this bill under the No Surprises Act (Public Law 116-260, Division BB).

Under this federal law, I am protected from balance billing for emergency services. Specifically:
- This was an emergency service as defined under the law
- [PROVIDER NAME] was out-of-network
- I can only be held responsible for my in-network cost-sharing amount

My in-network deductible/coinsurance responsibility is $[AMOUNT]. Any amount above this is prohibited balance billing.

I am requesting:
1. Immediate adjustment of this bill to my in-network cost-sharing amount
2. Written confirmation that no balance will be billed to me
3. If you dispute this, initiation of the federal independent dispute resolution process

If this is not resolved within 30 days, I will:
- File a complaint with CMS at cms.gov/nosurprises
- Report this violation to my state attorney general
- Contact my insurance company to file a complaint on my behalf

Sincerely,
[Your Signature]
[Your Name]`
      }
    },
    successStories: [
      {
        title: "ER Bill Reduced from $12,000 to $2,400",
        outcome: "Patient challenged 99285 (highest severity) code for a sprained ankle. After providing medical records showing routine treatment, hospital agreed to 99283 billing and removed facility fees. Financial assistance covered remainder.",
        keyTactics: "Requested medical records, compared ER documentation to CMS billing guidelines, escalated to patient advocate"
      },
      {
        title: "Balance Bill Eliminated Using No Surprises Act",
        outcome: "ER physician billed $3,500 above insurance payment. Patient filed No Surprises Act complaint within 30 days. Bill was withdrawn entirely.",
        keyTactics: "Identified out-of-network status immediately, filed federal complaint, copied state attorney general"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Billing Department", action: "Request itemized bill, identify errors" },
      { level: 2, entity: "Patient Financial Counselor", action: "Dispute charges, apply for assistance" },
      { level: 3, entity: "Patient Advocate / Compliance Officer", action: "Escalate coding disputes, request audit" },
      { level: 4, entity: "CMS No Surprises Hotline (1-800-985-3059)", action: "Report balance billing violations" },
      { level: 5, entity: "State Attorney General / Insurance Commissioner", action: "File formal complaints" }
    ]
  },
  {
    id: "surgery-hospital-bill",
    title: "Surgery/Procedure Bill Just Received",
    icon: Scissors,
    situation: "You had a planned or semi-planned surgery and the bill is much higher than expected - potentially $10,000 to $100,000+. The charges are confusing and may include many providers you don't remember seeing.",
    insiderKnowledge: [
      "Surgical bills should come with an 'operative report' that details exactly what was done - request this to verify charges",
      "Assistant surgeon fees are the #1 phantom charge in surgery - verify an assistant was actually present",
      "Anesthesia is often billed in 15-minute increments - verify the billed time matches your actual surgery duration",
      "Operating room time is typically $50-150 per minute - challenge excessive OR charges",
      "Many 'implants' and 'surgical supplies' are marked up 300-1000% over cost",
      "Pre-op and post-op care are often 'bundled' into the surgical fee but billed separately anyway",
      "If your surgery was outpatient but you were charged inpatient rates, this is a significant overcharge"
    ]
  },
  {
    id: "imaging-hospital-bill",
    title: "CT/MRI/X-Ray Imaging Bill",
    icon: Scan,
    situation: "You had diagnostic imaging (CT scan, MRI, X-ray, ultrasound) at a hospital and received a surprisingly high bill for what seemed like a quick procedure.",
    insiderKnowledge: [
      "Hospital imaging costs 2-5x more than freestanding imaging centers for the SAME test",
      "Hospitals often charge separate 'technical' and 'professional' fees - one for equipment, one for reading",
      "Contrast dye for CT/MRI is often billed at extreme markups - $50 in cost billed as $500+",
      "Multiple 'views' may be billed separately when they should be bundled",
      "If imaging was done 'stat' or 'emergency,' you may be charged premium rates",
      "Radiologist reading fees are often out-of-network even at in-network hospitals"
    ]
  },
  {
    id: "hospitalization-bill",
    title: "Hospital Stay/Admission Bill",
    icon: BedDouble,
    situation: "You were hospitalized for one or more nights and received a bill for $20,000 to $200,000+ that seems impossibly high for your length of stay.",
    insiderKnowledge: [
      "Daily room rates can vary from $2,000-$15,000 depending on unit - verify you were in the correct unit",
      "ICU/CCU rates are 3-5x regular room rates - verify you actually needed intensive care",
      "Every specialist who 'rounded' on you may bill separately - verify you actually saw each one",
      "Hospital pharmacies mark up medications 200-500% - compare to retail pharmacy prices",
      "Physical therapy, occupational therapy, and other services often appear for visits that didn't happen",
      "Observation vs. inpatient status significantly affects both billing and insurance coverage"
    ]
  },
  {
    id: "lab-work-bill",
    title: "Laboratory/Blood Work Bill",
    icon: Syringe,
    situation: "You had blood work or other lab tests and received a bill for hundreds or thousands of dollars for what you thought were routine tests.",
    insiderKnowledge: [
      "Hospital labs charge 5-10x more than independent labs like Quest or LabCorp",
      "A 'comprehensive metabolic panel' should be ONE charge, not 14 separate test charges",
      "Many labs bill for the same test multiple times using different codes",
      "If your doctor ordered labs, they may have been sent to an out-of-network lab without your knowledge",
      "Genetic testing can cost $100-$10,000 depending on whether it's medically necessary"
    ]
  },
  {
    id: "anesthesia-bill",
    title: "Anesthesia Bill (Separate from Surgery)",
    icon: Pill,
    situation: "You received a separate bill from an anesthesiologist or anesthesia group that's surprisingly high, often from a provider you never met before surgery.",
    insiderKnowledge: [
      "Anesthesia is billed in 'units' - time units plus base units plus modifier units",
      "Each 15 minutes typically equals one time unit - verify the billed time matches reality",
      "Anesthesiologists are frequently out-of-network, even at in-network facilities",
      "CRNA (nurse anesthetist) rates should be lower than MD anesthesiologist rates",
      "No Surprises Act protects you from balance billing for anesthesia services"
    ]
  },
  {
    id: "specialist-bill",
    title: "Specialist Consultation Bill",
    icon: Stethoscope,
    situation: "You were referred to or saw a specialist and received a bill that seems high for the time spent or services provided.",
    insiderKnowledge: [
      "Consultation codes (99241-99245) are higher than regular office visit codes",
      "Many specialists bill 'facility fees' on top of professional fees at hospital-owned practices",
      "In-office procedures may be billed separately from the visit itself",
      "New patient visits are billed higher than established patient visits"
    ]
  },
  {
    id: "physical-therapy-bill",
    title: "Physical/Occupational Therapy Bill",
    icon: Activity,
    situation: "You've been receiving therapy and the bills are adding up quickly, sometimes $200-500 per session.",
    insiderKnowledge: [
      "Hospital-based PT costs 2-3x more than independent PT clinics",
      "Each 'modality' (heat, ice, electrical stim, ultrasound) may be billed separately",
      "15-minute billing increments may be rounded up significantly",
      "Many insurance plans have strict visit limits - verify coverage before continuing"
    ]
  },
  {
    id: "mental-health-bill",
    title: "Mental Health/Therapy Bill",
    icon: Brain,
    situation: "You're receiving mental health treatment and facing high out-of-pocket costs despite having insurance.",
    insiderKnowledge: [
      "Mental Health Parity Act requires equal coverage for mental and physical health",
      "Many therapists are out-of-network - ask about 'out-of-network benefits'",
      "Session length billing varies - 45 vs 60 minutes are different CPT codes",
      "Telehealth may be billed differently (sometimes lower) than in-person"
    ]
  },
  {
    id: "ambulance-bill",
    title: "Ambulance/EMS Bill",
    icon: Ambulance,
    situation: "You received an ambulance bill for $1,000-$5,000+ for what may have been a short transport.",
    insiderKnowledge: [
      "Ambulance services are often NOT covered by the No Surprises Act (ground ambulances are exempt)",
      "BLS (Basic Life Support) should cost less than ALS (Advanced Life Support) - verify level billed",
      "Mileage charges are separate from base rate - verify distance is accurate",
      "If ambulance wasn't medically necessary (you could have safely used other transport), you can dispute",
      "Some municipalities have ambulance membership programs for $50-100/year"
    ]
  },
  {
    id: "dental-hospital-bill",
    title: "Dental Surgery/Hospital-Based Dental Bill",
    icon: Activity,
    situation: "You had dental work done in a hospital setting (wisdom teeth, oral surgery) and received a surprisingly high facility bill.",
    insiderKnowledge: [
      "Hospital facility fees for dental procedures can be 5-10x the procedure cost itself",
      "General anesthesia for dental is often not covered by dental insurance OR medical insurance",
      "Office-based dental surgery is typically 50-75% less than hospital-based",
      "Many dental surgeries billed as 'complex' are actually routine"
    ]
  },
  {
    id: "durable-equipment-bill",
    title: "Medical Equipment (CPAP, Wheelchair, etc.)",
    icon: ClipboardList,
    situation: "You received medical equipment and are being billed monthly amounts that seem excessive.",
    insiderKnowledge: [
      "DME (Durable Medical Equipment) is often rented when buying outright is cheaper",
      "CPAP machines and supplies are commonly overpriced through insurance",
      "You can often buy the same equipment online for a fraction of the billed price",
      "Medicare rates for DME are publicly available for comparison"
    ]
  },
  {
    id: "medication-bill",
    title: "Hospital Pharmacy/Medication Bill",
    icon: Pill,
    situation: "You were charged hundreds or thousands for medications during a hospital stay or ER visit.",
    insiderKnowledge: [
      "Hospital pharmacies mark up common medications 200-1000% over retail",
      "A $10 antibiotic can be billed as $200+ in a hospital setting",
      "IV medications are billed higher than oral versions of the same drug",
      "Ask for your own prescriptions to be brought from home if hospitalized"
    ]
  },
  {
    id: "preventive-care-bill",
    title: "Preventive Care Billed Incorrectly",
    icon: Heart,
    situation: "You received a bill for a checkup, screening, or preventive service that should have been covered at 100% by insurance.",
    insiderKnowledge: [
      "ACA requires 100% coverage for preventive services but only when billed correctly",
      "If a 'problem' is discussed during a preventive visit, the visit can be recoded as diagnostic",
      "Some labs ordered during preventive visits may not be classified as preventive",
      "Verify the correct preventive care codes were used before paying"
    ]
  }
];

export default function PreCollectionsGuide() {
  const [expandedSecrets, setExpandedSecrets] = useState<Set<number>>(new Set());
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleSecret = (index: number) => {
    const newExpanded = new Set(expandedSecrets);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSecrets(newExpanded);
  };

  const selectedScenarioData = preCollectionsScenarios.find(s => s.id === selectedScenario);

  return (
    <>
      <SEOHead 
        title="Hospital Bill Playbook - Reduce Your Medical Bills | GoldRock Health"
        description="Insider strategies, negotiation scripts, and step-by-step guides to reduce hospital bills by 40-70%. Act now before your bill goes to collections."
        keywords={["hospital bill negotiation", "reduce medical bill", "prevent collections", "medical bill help", "hospital billing errors"]}
        canonicalPath="/hospital-bill-playbook"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <MobileHeader title="Hospital Bill Playbook" />
        
        <main className="container mx-auto px-4 py-8 pb-24 md:pb-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header with back button */}
            <div className="mb-8">
              <Link href="/">
                <Button variant="ghost" className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Receipt className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Pre-Collections Bill Defense Guide
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Act NOW before your bill goes to collections. Reduce hospital bills by 40-70% with insider strategies.
                  </p>
                </div>
              </div>
            </div>

            {/* Urgency Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-8 text-white"
            >
              <div className="flex items-start gap-4">
                <Clock className="h-8 w-8 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Why Act NOW Matters</h2>
                  <p className="text-amber-100 mb-4">
                    Once a bill goes to collections, your leverage drops dramatically. Collectors buy debt for pennies on the dollar but want you to pay full price.
                    <strong className="text-white"> Acting in the first 30-60 days gives you maximum negotiating power.</strong>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">40-70%</p>
                      <p className="text-sm text-amber-100">Typical Reduction Possible</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">30 Days</p>
                      <p className="text-sm text-amber-100">Best Window to Act</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">60-80%</p>
                      <p className="text-sm text-amber-100">Bills Have Errors</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Chatbot Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Button
                onClick={() => setShowChatbot(!showChatbot)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-6 text-lg"
              >
                <MessageSquare className="h-6 w-6 mr-3" />
                {showChatbot ? "Hide AI Bill Negotiation Assistant" : "Get AI Help with Your Specific Bill"}
                {showChatbot ? <ChevronUp className="h-5 w-5 ml-2" /> : <ChevronDown className="h-5 w-5 ml-2" />}
              </Button>
              
              {showChatbot && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <PlaybookChatbot />
                </motion.div>
              )}
            </motion.div>

            {/* Insider Secrets Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">12 Insider Secrets Hospitals Don't Want You to Know</h2>
              </div>

              <div className="grid gap-4">
                {insiderSecrets.map((secret, index) => (
                  <Card 
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => toggleSecret(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-500 text-white text-xs">Secret #{index + 1}</Badge>
                            <h3 className="font-bold text-gray-900 dark:text-white">{secret.title}</h3>
                          </div>
                          {expandedSecrets.has(index) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3"
                            >
                              <p className="text-gray-700 dark:text-gray-300 mb-3">{secret.secret}</p>
                              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-700">
                                <p className="text-sm text-green-800 dark:text-green-300">
                                  <strong>ACTION:</strong> {secret.actionable}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        {expandedSecrets.has(index) ? (
                          <ChevronUp className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Scenarios Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Bill Type for Specific Guidance</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {preCollectionsScenarios.map((scenario) => {
                  const IconComponent = scenario.icon;
                  const isFeatured = 'featured' in scenario && scenario.featured;
                  return (
                    <Card
                      key={scenario.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedScenario === scenario.id 
                          ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                          : isFeatured
                            ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-700'
                            : 'bg-white dark:bg-gray-800'
                      }`}
                      onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            isFeatured 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                              : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${isFeatured ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{scenario.title}</h3>
                              {isFeatured && (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs flex-shrink-0">Enhanced</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{scenario.situation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Scenario Details */}
              {selectedScenarioData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700">
                    <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-lg">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const IconComponent = selectedScenarioData.icon;
                          return <IconComponent className="h-8 w-8" />;
                        })()}
                        <div>
                          <CardTitle className="text-xl">{selectedScenarioData.title}</CardTitle>
                          {'featured' in selectedScenarioData && selectedScenarioData.featured && (
                            <Badge className="bg-white/20 text-white mt-1">Comprehensive Enhanced Guide</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Situation */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
                          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Your Situation
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">{selectedScenarioData.situation}</p>
                        </div>

                        {/* Insider Knowledge */}
                        {selectedScenarioData.insiderKnowledge && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-700">
                            <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                              <Lightbulb className="h-5 w-5" />
                              Insider Knowledge ({selectedScenarioData.insiderKnowledge.length} Key Facts)
                            </h4>
                            <ul className="space-y-3">
                              {selectedScenarioData.insiderKnowledge.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                                    {i + 1}
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">{item}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Bill Forensics - for featured scenarios */}
                        {'billForensics' in selectedScenarioData && selectedScenarioData.billForensics && (
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-700">
                            <h4 className="font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              {(selectedScenarioData.billForensics as any).title}
                            </h4>
                            
                            {/* CPT Code Red Flags */}
                            <div className="mb-4">
                              <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-sm">CPT Codes to Challenge:</h5>
                              <div className="space-y-2">
                                {(selectedScenarioData.billForensics as any).redFlags?.map((flag: any, i: number) => (
                                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-100 dark:border-red-800">
                                    <div className="flex items-center justify-between mb-1">
                                      <Badge variant="destructive" className="font-mono">{flag.code}</Badge>
                                      <span className="text-red-600 dark:text-red-400 font-bold text-sm">{flag.amount}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">{flag.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Unbundling Schemes */}
                            <div className="mb-4">
                              <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-sm">Common Unbundling Schemes:</h5>
                              <ul className="space-y-1">
                                {(selectedScenarioData.billForensics as any).unbundlingSchemes?.map((scheme: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">{scheme}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Phantom Charges */}
                            <div>
                              <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-sm">Phantom Charges to Watch For:</h5>
                              <ul className="space-y-1">
                                {(selectedScenarioData.billForensics as any).phantomCharges?.map((charge: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <Ban className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">{charge}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Timeline */}
                        {'timeline' in selectedScenarioData && selectedScenarioData.timeline && (
                          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-5 border border-cyan-200 dark:border-cyan-700">
                            <h4 className="font-bold text-cyan-800 dark:text-cyan-300 mb-4 flex items-center gap-2">
                              <Clock className="h-5 w-5" />
                              {(selectedScenarioData.timeline as any).title}
                            </h4>
                            <div className="space-y-4">
                              {(selectedScenarioData.timeline as any).checkpoints?.map((checkpoint: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={`text-xs ${
                                      checkpoint.status === 'critical' ? 'bg-red-500' :
                                      checkpoint.status === 'important' ? 'bg-amber-500' :
                                      checkpoint.status === 'strategic' ? 'bg-blue-500' :
                                      checkpoint.status === 'resolution' ? 'bg-green-500' :
                                      'bg-purple-500'
                                    } text-white`}>{checkpoint.status.toUpperCase()}</Badge>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{checkpoint.day}</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {checkpoint.actions.map((action: string, j: number) => (
                                      <li key={j} className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">{action}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Escalation Path */}
                        {'escalationPath' in selectedScenarioData && selectedScenarioData.escalationPath && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-700">
                            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
                              <Gavel className="h-5 w-5" />
                              Escalation Ladder
                            </h4>
                            <div className="space-y-2">
                              {(selectedScenarioData.escalationPath as any[]).map((level: any, i: number) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                    {level.level}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{level.entity}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">{level.action}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Negotiation Playbooks */}
                        {'negotiationPlaybooks' in selectedScenarioData && selectedScenarioData.negotiationPlaybooks && (
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-700">
                            <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Negotiation Playbooks & Scripts
                            </h4>
                            <div className="space-y-4">
                              {Object.entries(selectedScenarioData.negotiationPlaybooks as Record<string, any>).map(([key, playbook]: [string, any]) => (
                                <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                                  <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{playbook.title}</h5>
                                  {playbook.approach && (
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 italic">{playbook.approach}</p>
                                  )}
                                  {playbook.script && (
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700 mb-2">
                                      <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">SCRIPT:</p>
                                      <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">"{playbook.script}"</p>
                                    </div>
                                  )}
                                  {playbook.escalationScript && (
                                    <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-700 mb-2" data-testid="script-escalation">
                                      <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">ESCALATION SCRIPT:</p>
                                      <p className="text-sm text-red-900 dark:text-red-200 italic">"{playbook.escalationScript}"</p>
                                    </div>
                                  )}
                                  {playbook.followUp && (
                                    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 border border-amber-200 dark:border-amber-700 mt-2">
                                      <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">IF THEY RESIST:</p>
                                      <p className="text-sm text-amber-900 dark:text-amber-200 italic">"{playbook.followUp}"</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Legal Protections */}
                        {'legalProtections' in selectedScenarioData && selectedScenarioData.legalProtections && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-700">
                            <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                              <Scale className="h-5 w-5" />
                              Legal Protections & Rights
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-semibold text-purple-700 dark:text-purple-400 text-sm mb-2">Federal Laws:</h5>
                                <div className="space-y-2">
                                  {(selectedScenarioData.legalProtections as any).federal?.map((law: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
                                      <p className="font-bold text-gray-900 dark:text-white text-sm">{law.law}</p>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{law.protection}</p>
                                      <p className="text-purple-600 dark:text-purple-400 text-xs mt-1"><strong>Enforce:</strong> {law.enforcement}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-purple-700 dark:text-purple-400 text-sm mb-2">State Examples:</h5>
                                <div className="grid gap-2">
                                  {(selectedScenarioData.legalProtections as any).stateExamples?.map((state: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
                                      <p className="font-bold text-gray-900 dark:text-white text-sm">{state.state}</p>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{state.protection}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Letter Templates */}
                        {'templates' in selectedScenarioData && selectedScenarioData.templates && (
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 border border-teal-200 dark:border-teal-700">
                            <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-4 flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Ready-to-Use Letter Templates
                            </h4>
                            <div className="space-y-4">
                              {Object.entries(selectedScenarioData.templates as Record<string, any>).map(([key, template]: [string, any]) => (
                                <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-teal-100 dark:border-teal-800 overflow-hidden">
                                  <div className="bg-teal-100 dark:bg-teal-900/50 px-4 py-2 border-b border-teal-200 dark:border-teal-700">
                                    <h5 className="font-bold text-teal-800 dark:text-teal-300 text-sm">{template.title}</h5>
                                  </div>
                                  <div className="p-4">
                                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                                      {template.content}
                                    </pre>
                                    <Button 
                                      size="sm"
                                      className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white"
                                      onClick={() => navigator.clipboard.writeText(template.content)}
                                      data-testid={`copy-template-${key}`}
                                    >
                                      Copy Template
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Calculators */}
                        {'calculators' in selectedScenarioData && selectedScenarioData.calculators && (
                          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 border border-violet-200 dark:border-violet-700">
                            <h4 className="font-bold text-violet-800 dark:text-violet-300 mb-4 flex items-center gap-2">
                              <DollarSign className="h-5 w-5" />
                              Financial Calculators
                            </h4>
                            
                            {(selectedScenarioData.calculators as any).charityCareLikelihood && (
                              <div className="mb-4">
                                <h5 className="font-semibold text-violet-700 dark:text-violet-400 text-sm mb-2">Charity Care Eligibility (2024 FPL):</h5>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                  {(selectedScenarioData.calculators as any).charityCareLikelihood.description}
                                </p>
                                <div className="grid gap-2">
                                  {Object.entries((selectedScenarioData.calculators as any).charityCareLikelihood.fplThresholds2024 || {}).map(([size, amount]) => (
                                    <div key={size} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-2">
                                      <span className="text-gray-600 dark:text-gray-400 text-sm">Family of {size}:</span>
                                      <div className="text-right">
                                        <span className="font-bold text-gray-900 dark:text-white">${(amount as number).toLocaleString()}</span>
                                        <span className="text-xs text-violet-600 dark:text-violet-400 block">
                                          200% = ${((amount as number) * 2).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {(selectedScenarioData.calculators as any).negotiationTargets && (
                              <div>
                                <h5 className="font-semibold text-violet-700 dark:text-violet-400 text-sm mb-2">Negotiation Targets:</h5>
                                <div className="grid gap-2">
                                  {(selectedScenarioData.calculators as any).negotiationTargets.targets.map((target: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-violet-100 dark:border-violet-800">
                                      <span className="text-gray-700 dark:text-gray-300 text-sm">{target.scenario}</span>
                                      <div className="text-right">
                                        <Badge className="bg-green-500 text-white">{target.discount}</Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Success Stories */}
                        {'successStories' in selectedScenarioData && selectedScenarioData.successStories && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-700">
                            <h4 className="font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              Success Stories
                            </h4>
                            <div className="space-y-4">
                              {(selectedScenarioData.successStories as any[]).map((story: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
                                  <h5 className="font-bold text-green-700 dark:text-green-400 text-sm mb-2">{story.title}</h5>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{story.outcome}</p>
                                  <p className="text-green-600 dark:text-green-400 text-xs"><strong>Key Tactics:</strong> {story.keyTactics}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-8"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Need personalized help with your specific bill?
              </p>
              <a 
                href="mailto:CONTACT@GOLDROCK.ai"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <Mail className="h-5 w-5" />
                CONTACT@GOLDROCK.ai
              </a>
            </motion.div>
          </motion.div>
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}
