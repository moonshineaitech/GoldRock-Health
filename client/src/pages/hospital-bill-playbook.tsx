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
    secret: "Medical billing errors are very common. Without an itemized bill, you can't find them. Hospitals know this and often provide summary bills hoping you won't request details.",
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
  },
  {
    title: "The 'Medicare rate' is your negotiation anchor",
    secret: "Medicare pays hospitals about 40-60% of what they charge private patients. Hospitals accept this and still profit. Asking to pay 'Medicare rates plus 20%' is a reasonable request.",
    actionable: "Say: 'I've researched the Medicare reimbursement for these services. I'm willing to pay 120% of Medicare rates, which is still profitable for you.'"
  },
  {
    title: "Facility fees can often be removed entirely",
    secret: "Hospitals charge 'facility fees' of $500-$3,000+ for simply walking in the door. These fees often aren't disclosed upfront and may violate price transparency laws.",
    actionable: "Ask: 'Was I informed of this facility fee before services? Can you show me the signed acknowledgment?' If they can't, dispute the fee entirely."
  },
  {
    title: "Observation vs. inpatient status is negotiable",
    secret: "If you were on 'observation status' instead of admitted as an inpatient, your bills may be 2-3x higher and Medicare won't cover skilled nursing after. You can request a status change review.",
    actionable: "Ask: 'Can you review whether my stay should have been classified as inpatient? I'm requesting a formal Condition Code 44 review.'"
  },
  {
    title: "Insurance denials are meant to be appealed",
    secret: "Insurance companies deny 10-20% of claims knowing most people won't appeal. But 40-50% of appeals are successful. Denials are a negotiation tactic, not a final answer.",
    actionable: "ALWAYS appeal every denial. Request a peer-to-peer review where your doctor speaks directly to the insurance company's medical reviewer."
  },
  {
    title: "Hospital chargemasters are public",
    secret: "Since 2021, hospitals must publish their chargemaster prices online. You can compare what they charged you versus their published prices and what they accept from insurance.",
    actionable: "Search '[Hospital Name] price transparency' or 'machine readable file.' Compare your bill to listed prices and insurer negotiated rates."
  },
  {
    title: "Multiple bills mean multiple negotiation opportunities",
    secret: "You'll receive separate bills from the hospital, surgeon, anesthesiologist, radiologist, pathologist, and more. Each can be negotiated independently.",
    actionable: "Negotiate each bill separately. You may get 50% off the hospital bill and 30% off the surgeon's bill - cumulative savings add up fast."
  },
  {
    title: "Operating room time is often inflated",
    secret: "Operating rooms are billed at $50-200 per MINUTE. Hospitals routinely round up or include pre-op and post-op time that shouldn't count as OR time.",
    actionable: "Request the OR log showing exact in/out times. Compare to billed time. If there's a discrepancy, dispute the overage."
  },
  {
    title: "The surgical supply markup scandal",
    secret: "Hospitals mark up surgical supplies 300-1000%. A $10 surgical stapler becomes $500. A $50 implant becomes $5,000. These markups are rarely justified.",
    actionable: "Request an itemized list of all supplies. Google each item to find actual costs. Challenge any markup over 200% as unreasonable."
  },
  {
    title: "Self-pay rates are often lower than insurance rates",
    secret: "Paradoxically, paying cash as a 'self-pay' patient can be cheaper than using insurance if you have a high deductible. Hospitals often offer significant self-pay discounts.",
    actionable: "Before using insurance, ask: 'What is your self-pay cash price?' Compare to your out-of-pocket after deductible. Choose the lower option."
  },
  {
    title: "Hospital compliance officers fear audits",
    secret: "Mentioning 'billing compliance,' 'False Claims Act,' or 'OIG' (Office of Inspector General) signals you know about healthcare fraud laws. This often triggers internal review.",
    actionable: "In your dispute letter, write: 'I'm concerned these billing practices may trigger compliance issues. I'm requesting a billing compliance review before escalating.'"
  },
  {
    title: "Medical credit cards are traps",
    secret: "CareCredit and similar 'medical credit cards' have 26-29% interest rates if you miss the promotional period. Hospitals push them because they get paid immediately.",
    actionable: "NEVER accept a medical credit card. Instead, negotiate a 0% payment plan directly with the hospital. They're required to offer interest-free options."
  },
  {
    title: "Your state has a medical billing hotline",
    secret: "Most states have a consumer assistance program for health insurance and medical billing issues. These offices can intervene on your behalf and have regulatory power.",
    actionable: "Search '[Your State] health insurance consumer assistance program.' File a complaint and request intervention. This often resolves issues within weeks."
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
    featured: true,
    situation: "You had a planned or semi-planned surgery and the bill is much higher than expected - potentially $10,000 to $100,000+. The charges are confusing and may include many providers you don't remember seeing.",
    insiderKnowledge: [
      "Surgical bills should come with an 'operative report' that details exactly what was done - request this to verify every charge",
      "Assistant surgeon fees are the #1 phantom charge in surgery - 30% of bills include assistants who weren't present",
      "Anesthesia is billed in 15-minute increments and hospitals routinely round up by 30-60 minutes - verify against OR log",
      "Operating room time is typically $50-200 per minute - hospitals add pre-op and post-op time that shouldn't count",
      "Surgical 'implants' and supplies are marked up 300-1000% - a $20 mesh costs you $2,000, a $100 screw costs $5,000",
      "Pre-op and post-op care are 'globally bundled' into surgical fees but billed separately anyway - this is double billing",
      "If your surgery was outpatient but you were charged inpatient rates, you're paying 2-4x what you should",
      "The surgical 'tray' or 'pack' charge is a catch-all for supplies - often $1,000-5,000 for items worth $100-500",
      "Multiple surgeons may appear on your bill even if only one operated - 'co-surgeon' and 'assistant surgeon' codes are commonly abused",
      "Recovery room charges should be 1-2 hours for most surgeries - challenge anything over 3 hours unless medically justified",
      "Surgical pathology fees (tissue examination) are often charged even when no tissue was sent for analysis",
      "Hospital-employed surgeons still generate separate 'professional fees' - you'll get at least 2 bills for every surgery"
    ],
    billForensics: {
      title: "Common Surgical Billing Errors to Challenge NOW",
      redFlags: [
        { code: "80061/82985", description: "Assistant surgeon - Verify an assistant was actually present AND necessary. Many simple surgeries don't require assistants", amount: "$2,000-8,000" },
        { code: "00100-01999", description: "Anesthesia base units + time - Compare billed time to actual OR log. Dispute any time over actual procedure + 15 min", amount: "$1,500-10,000" },
        { code: "99356/99357", description: "Prolonged surgical services - Often billed when surgery ran slightly longer, even if not unusually complex", amount: "$500-1,500" },
        { code: "C1713-C2699", description: "Implant codes - Request itemized list and compare to manufacturer prices. Challenge markups over 200%", amount: "$2,000-50,000" },
        { code: "99213-99215", description: "Pre-op evaluation - Often billed separately when it should be included in surgical global period", amount: "$150-400" },
        { code: "88305/88307", description: "Surgical pathology - Verify tissue was actually sent for analysis. Common phantom charge", amount: "$300-1,500" },
        { code: "49083/49084", description: "Drain placement - Sometimes billed when no drain was placed or was routine part of procedure", amount: "$500-2,000" },
        { code: "99024", description: "Post-op visits - All follow-up for 90 days is included in surgical fee. Separate billing is fraud", amount: "$150-500 each" }
      ],
      unbundlingSchemes: [
        "Surgical prep, draping, and positioning billed separately from operating room fee",
        "Anesthesia monitoring, medication administration, and recovery billed as 3 charges",
        "Surgical instruments, sutures, and 'surgical pack' all billed individually",
        "Pre-operative evaluation billed separately when it's included in global surgical fee",
        "Wound closure and dressing changes billed separately from the procedure",
        "IV access and medication administration billed separately from anesthesia",
        "Pathology 'handling' fee billed separately from pathology analysis",
        "Post-operative admission billed when surgery was supposed to be outpatient"
      ],
      phantomCharges: [
        "Second surgeon or 'surgical assistant' who wasn't in the OR",
        "Implants or devices that weren't actually used in your procedure",
        "Recovery room hours that exceed your actual recovery time",
        "Physical therapy 'evaluation' you don't remember receiving",
        "Medications administered after you were discharged",
        "Supplies charged to your account but used for other patients",
        "Post-operative visits within 90 days that should be free",
        "Labs drawn 'pre-op' that were never actually performed"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "First Call to Hospital Billing (Within 7 Days)",
        approach: "Establish yourself as informed and prepared to negotiate. Gather information before paying anything.",
        script: "Hello, I'm calling about my surgery account for [DATE]. I've received bills totaling $[AMOUNT] and need several things before I can address this. First, I need the complete itemized bill with all CPT codes for the hospital facility, surgeon, anesthesiologist, and any other providers. Second, I need a copy of the operative report showing exactly what procedures were performed. Third, I'd like information about your financial assistance programs. Can you also tell me who I should speak with about billing questions?",
        followUp: "If they push for payment: 'I need to review the operative report against the charges first. There appear to be discrepancies I need to understand before making any payment commitment.'"
      },
      operativeReportReview: {
        title: "Reviewing the Operative Report Against Charges",
        approach: "The operative report is your truth document. Every charge should match what's documented in that report.",
        script: "I've compared my operative report to my itemized bill and found discrepancies. The operative report shows the procedure took [X] minutes, but I'm being billed for [Y] minutes of OR time. The report doesn't mention an assistant surgeon, but there's a charge for one. The report lists [specific items], but I'm being charged for [different items]. Can you explain these discrepancies?",
        escalationScript: "If they can't explain: 'I need to speak with your billing compliance department. These charges don't match the medical documentation, which is a serious concern I need addressed before paying.'"
      },
      anesthesiaDispute: {
        title: "Challenging Anesthesia Time and Charges",
        approach: "Anesthesia billing is based on time and complexity. Both are often inflated.",
        script: "I'm reviewing my anesthesia charges and have concerns. According to the OR log, my procedure took [X] minutes from incision to close. I'm being billed for [Y] minutes of anesthesia time. Also, the base unit assignment seems high for what was a [routine/straightforward] procedure. Can you explain how the time and complexity were determined?",
        followUp: "Request the anesthesia record showing exact start and stop times. Compare to surgical record. Any discrepancy is disputable."
      },
      settlementOffer: {
        title: "Settlement Negotiation After Disputes",
        approach: "Once errors are addressed, negotiate a lump-sum settlement.",
        script: "After reviewing the corrected charges, the balance is $[AMOUNT]. I'm prepared to settle this account today for $[40-50% of balance]. I've researched Medicare reimbursement rates for these procedures, which total $[AMOUNT]. My offer of $[YOUR OFFER] represents [X]% above Medicare rates, which is a fair market value. Can we close this account with a one-time payment?",
        escalationScript: "If they refuse: 'I understand. Please note that if we can't reach an agreement, I'll need to request a formal review by your billing compliance office and potentially file a complaint with the state medical board regarding the documentation discrepancies we've discussed.'"
      }
    },
    legalProtections: {
      federal: [
        { law: "No Surprises Act (2022)", protection: "Protects you from balance billing by out-of-network surgeons, anesthesiologists, and other specialists at in-network facilities", enforcement: "File complaint at cms.gov/nosurprises or call 1-800-985-3059" },
        { law: "Hospital Price Transparency Rule", protection: "Hospitals must publish negotiated rates and self-pay prices for surgical procedures. Cannot charge more than published prices", enforcement: "File complaint at hospitalpricetransparency@cms.hhs.gov" },
        { law: "False Claims Act", protection: "Billing for services not rendered, upcoding, and unbundling can constitute healthcare fraud", enforcement: "Report concerns to OIG hotline 1-800-HHS-TIPS" },
        { law: "Good Faith Estimate (Uninsured)", protection: "If uninsured or self-paying, you have the right to a Good Faith Estimate before surgery. Actual charges exceeding estimate by $400+ are disputable", enforcement: "Initiate patient-provider dispute resolution process" }
      ],
      stateExamples: [
        { state: "California", protection: "Hospitals must provide itemized bills within 10 days. Cannot charge uninsured more than insured rates. Strong charity care requirements." },
        { state: "New York", protection: "Surprise Bill Law covers all surgical services by out-of-network providers at in-network facilities. Patient held harmless." },
        { state: "Texas", protection: "Out-of-network surgical providers cannot balance bill for amounts over in-network cost sharing. Mediation available." },
        { state: "Florida", protection: "Must provide written financial estimate for non-emergency surgeries. Hospital liens limited to actual charges, not inflated rates." },
        { state: "Colorado", protection: "Hospital Discounted Care Program applies to surgical bills. Billing disputes can be reported to Division of Insurance." },
        { state: "New Jersey", protection: "All hospital-based physicians treated as in-network if the hospital is in-network. No balance billing for surgical teams." }
      ]
    },
    timeline: {
      title: "Post-Surgery Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Open all bills but DON'T pay anything yet", "Request operative report from surgeon's office", "Request OR log showing exact procedure times", "Request itemized bills with CPT codes from ALL providers"], status: "critical" },
        { day: "Day 8-21", actions: ["Compare operative report to all charges line by line", "Identify any assistant surgeon, extended time, or implant charges to verify", "Research Medicare rates for your procedure codes", "Document all discrepancies found"], status: "important" },
        { day: "Day 22-45", actions: ["Submit written disputes for specific billing errors", "Apply for financial assistance programs", "Request prompt pay discount quotes from each provider", "File No Surprises Act complaint if any provider was out-of-network"], status: "strategic" },
        { day: "Day 46-60", actions: ["Follow up on all disputes and applications", "Begin settlement negotiations with corrected balances", "Set up 0% interest payment plans if needed", "Get all agreements in writing before paying"], status: "resolution" }
      ]
    },
    templates: {
      operativeReportRequest: {
        title: "Operative Report Request Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Surgeon Name/Practice]
[Address]
[City, State ZIP]

RE: Medical Records Request - Operative Report
Patient: [YOUR NAME]
Date of Surgery: [DATE]
Procedure: [PROCEDURE NAME]

To Whom It May Concern:

I am requesting a copy of my complete operative report for the surgical procedure performed on [DATE]. Under HIPAA, I am entitled to receive this documentation within 30 days.

Please provide:
1. Complete operative report/surgical note
2. Anesthesia record with start/stop times
3. Recovery room/PACU notes
4. List of all implants, devices, or supplies used

I need this documentation to review my billing statements for accuracy. Please send to the address above or email to [EMAIL].

Sincerely,
[Your Signature]
[Your Name]
[Phone Number]`
      },
      surgicalBillingDispute: {
        title: "Surgical Bill Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Billing Department
[Hospital Address]
[City, State ZIP]

RE: Formal Billing Dispute - Surgery Account #[ACCOUNT NUMBER]
Date of Surgery: [DATE]
Billed Amount: $[AMOUNT]

SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED

To Whom It May Concern:

After reviewing my operative report against my itemized bill, I am formally disputing the following charges:

1. ASSISTANT SURGEON CHARGES - $[AMOUNT]
   My operative report does not document an assistant surgeon. Please provide documentation showing an assistant was present and medically necessary, or remove this charge.

2. OPERATING ROOM TIME - $[AMOUNT]
   The operative report shows the procedure lasted [X] minutes. I am being billed for [Y] minutes of OR time. Please adjust to reflect actual documented time.

3. [SPECIFIC CHARGE] - $[AMOUNT]
   [REASON FOR DISPUTE]

Total Disputed Amount: $[TOTAL]

I am requesting:
1. Billing compliance review of these charges
2. Adjustment of charges to match operative documentation
3. Corrected itemized bill
4. Written response within 30 days

If these charges cannot be justified against the medical documentation, they must be removed. I remain willing to pay legitimate, documented charges.

Sincerely,
[Your Signature]
[Your Name]
[Phone Number]

Enclosures:
- Copy of operative report
- Highlighted itemized bill showing disputed charges`
      }
    },
    calculators: {
      charityCareLikelihood: {
        description: "2024 Federal Poverty Level guidelines for charity care eligibility:",
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
        description: "Typical negotiation outcomes for surgical bills:",
        targets: [
          { scenario: "Cash pay / Uninsured", discount: "40-65% off", typical: "Pay 35-60% of billed charges" },
          { scenario: "Documentation discrepancies found", discount: "Errors removed + 15-25%", typical: "Pay corrected amount minus negotiated discount" },
          { scenario: "High deductible insurance", discount: "15-35% off patient responsibility", typical: "Pay 65-85% of your portion" },
          { scenario: "Medicare rate comparison", discount: "Pay 100-150% of Medicare", typical: "Often 50-70% off chargemaster rates" }
        ]
      }
    },
    successStories: [
      { 
        title: "Knee Surgery Bill Reduced from $67,000 to $18,500",
        outcome: "Patient requested operative report and found: no assistant surgeon despite $6,500 charge, OR time billed 45 min over actual, phantom implant charges. After dispute and financial assistance, final payment was 72% off.",
        keyTactics: "Operative report comparison, OR log review, implant verification, escalation to compliance officer"
      },
      {
        title: "Gallbladder Surgery Cut from $42,000 to $11,200",
        outcome: "Outpatient procedure was billed at inpatient rates. Patient caught coding error and insisted on correction. Combined with self-pay discount, saved over $30,000.",
        keyTactics: "Verified outpatient status, challenged inpatient billing codes, negotiated Medicare-plus rates"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Patient Billing", action: "Request itemized bill, identify discrepancies" },
      { level: 2, entity: "Surgeon's Billing Office", action: "Request operative report, compare to charges" },
      { level: 3, entity: "Patient Financial Counselor", action: "Dispute specific charges, apply for assistance" },
      { level: 4, entity: "Billing Compliance Officer", action: "Escalate documentation mismatches, request audit" },
      { level: 5, entity: "Hospital CEO / CFO", action: "Written complaint with documentation evidence" },
      { level: 6, entity: "State Medical Board / Attorney General", action: "File formal complaint for billing irregularities" }
    ]
  },
  {
    id: "imaging-hospital-bill",
    title: "CT/MRI/X-Ray Imaging Bill",
    icon: Scan,
    featured: true,
    situation: "You had diagnostic imaging (CT scan, MRI, X-ray, ultrasound) at a hospital and received a surprisingly high bill for what seemed like a quick procedure.",
    insiderKnowledge: [
      "Hospital imaging costs 2-5x more than freestanding imaging centers for the EXACT same test on the EXACT same machine",
      "Hospitals charge separate 'technical' (facility/equipment) and 'professional' (radiologist reading) fees - often to different entities",
      "Contrast dye for CT/MRI is billed at 500-1000% markup - $30 of contrast becomes $500-1,000 on your bill",
      "Multiple 'views' or 'sequences' may be billed separately when they should be bundled into one CPT code",
      "If imaging was done 'stat' or 'emergency,' you may be charged 50-100% premium rates - challenge if it wasn't truly urgent",
      "The radiologist reading your scan is often out-of-network even at in-network hospitals - No Surprises Act applies",
      "3D reconstruction, 'CAD' (computer-aided detection), and other add-ons are often billed separately and may not have been necessary",
      "If you had the same area imaged multiple times (e.g., with and without contrast), each is billed separately - verify all were medically necessary",
      "Guidance charges (CT-guided, ultrasound-guided) for biopsies or procedures are often billed at inflated rates",
      "If imaging was ordered but then repeated because of 'motion artifact' or 'technical issues,' you should not pay for both"
    ],
    billForensics: {
      title: "Common Imaging Billing Errors to Challenge",
      redFlags: [
        { code: "70553", description: "MRI Brain with/without contrast - Charged separately for with and without when one comprehensive code should apply", amount: "$2,000-6,000" },
        { code: "74177/74178", description: "CT Abdomen/Pelvis - Separate charges for abdomen AND pelvis when combined code 74177 applies", amount: "$1,500-4,000" },
        { code: "A9576-A9585", description: "Contrast/radiopharmaceuticals - Extreme markup on contrast dye. Compare to Medicare allowable", amount: "$200-1,500" },
        { code: "76377", description: "3D rendering/reconstruction - Often unnecessary add-on for routine imaging", amount: "$200-800" },
        { code: "76497/76498", description: "Unlisted CT/MRI codes - 'Unlisted' codes allow unlimited pricing. Request justification", amount: "$500-5,000" },
        { code: "76942", description: "Ultrasound guidance - May be billed separately when included in procedure code", amount: "$300-800" },
        { code: "71271", description: "Low-dose CT lung screening - Different code than diagnostic CT. Verify correct code used", amount: "$200-1,000" }
      ],
      unbundlingSchemes: [
        "Technical and professional components billed as two full charges instead of TC/26 modifiers",
        "With and without contrast billed as two separate exams instead of combined code",
        "Each sequence of MRI billed separately instead of comprehensive code",
        "Left and right side imaging billed as two complete exams",
        "3D reconstruction billed separately when included in primary imaging code",
        "Contrast injection billed separately from contrast material cost",
        "IV access for contrast billed separately from imaging procedure"
      ],
      phantomCharges: [
        "Multiple imaging studies billed when only one was performed",
        "Contrast dye charged but imaging was done without contrast",
        "Radiologist reading fee for images read by AI or not formally reported",
        "Stat/emergency fee when imaging was scheduled or non-urgent",
        "CD/film charges when images were only provided electronically",
        "Second read or 'wet read' not requested or delivered"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "First Call About Imaging Bill",
        approach: "Imaging bills are highly negotiable because hospitals know their prices are inflated compared to independent centers.",
        script: "I'm calling about an imaging bill for a [CT/MRI/X-ray] performed on [DATE]. The charge of $[AMOUNT] seems very high. Before I can address this, I need the itemized bill showing the technical and professional components separately, with CPT codes. I also need to understand why a hospital facility was used when freestanding imaging centers charge 70% less for the same test.",
        followUp: "If they say it's the standard rate: 'I've researched imaging prices and your charge is [X]% above the Medicare rate and [Y]% above average market rates. I need to speak with someone about adjusting this to a reasonable amount.'"
      },
      radiologistDispute: {
        title: "Out-of-Network Radiologist Challenge",
        approach: "Radiologists are frequently out-of-network. The No Surprises Act protects you.",
        script: "I received a separate bill from [RADIOLOGY GROUP] for $[AMOUNT] for reading my imaging study. This radiologist was out-of-network, but I had no choice in who read my scan. Under the No Surprises Act, I should only be responsible for in-network cost sharing. Please rebill this at the appropriate rate or direct me to the dispute process.",
        escalationScript: "If they refuse: 'The No Surprises Act specifically covers diagnostic imaging performed at in-network facilities. I'm filing a complaint with CMS and will only pay my in-network cost sharing amount.'"
      },
      priceComparisonStrategy: {
        title: "Price Comparison Negotiation",
        approach: "Use the hospital's own price transparency data against inflated charges.",
        script: "I've reviewed your hospital's published price transparency file. The negotiated rate for this imaging study with [MAJOR INSURER] is $[LOWER AMOUNT]. I'm being charged $[HIGHER AMOUNT] as a self-pay/patient responsibility. I'm requesting that my bill be adjusted to match the rates you've agreed are fair with insurance companies.",
        followUp: "If they claim different rates apply: 'Under the Hospital Price Transparency Rule, you cannot charge self-pay patients more than insured patients. I'm requesting the lowest rate offered to any payer.'"
      }
    },
    legalProtections: {
      federal: [
        { law: "No Surprises Act", protection: "Protects you from balance billing by out-of-network radiologists when imaging is performed at in-network facilities", enforcement: "File complaint at cms.gov/nosurprises" },
        { law: "Hospital Price Transparency Rule", protection: "Hospitals must publish their negotiated rates and self-pay prices for imaging services publicly online", enforcement: "Report non-compliance to hospitalpricetransparency@cms.hhs.gov" },
        { law: "ACA Preventive Services", protection: "Certain screening imaging (mammograms, some CT scans) must be covered at 100% with no cost sharing when coded correctly", enforcement: "Appeal to insurance with correct preventive coding" }
      ],
      stateExamples: [
        { state: "California", protection: "Uninsured patients cannot be charged more than the lowest price paid by any government payer. Strong price transparency requirements." },
        { state: "New York", protection: "Surprise bill protections cover all ancillary services including radiology. Patients held harmless for out-of-network radiologist fees." },
        { state: "Texas", protection: "Balance billing banned for imaging at in-network facilities. Mediation available for disputes over $500." },
        { state: "Colorado", protection: "All hospitals must provide cost estimates before scheduled imaging. Actual charges within $400 of estimate required." }
      ]
    },
    timeline: {
      title: "Imaging Bill Response Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Identify what imaging was performed and verify it was completed", "Check if radiologist was in-network or out-of-network", "Request itemized bill with technical and professional fee breakdown", "Compare to Medicare rates and market rates"], status: "critical" },
        { day: "Day 6-20", actions: ["Research hospital's price transparency file for negotiated rates", "Identify any unbundling or phantom charges", "Prepare price comparison documentation", "File No Surprises complaint if radiologist was out-of-network"], status: "important" },
        { day: "Day 21-40", actions: ["Submit formal dispute for overcharges", "Request price match to insurance-negotiated rates", "Apply for financial assistance", "Negotiate cash pay discount"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on disputes", "Negotiate final settlement amount", "Get payment agreement in writing", "Make payment once resolved"], status: "resolution" }
      ]
    },
    templates: {
      imagingDisputeLetter: {
        title: "Imaging Bill Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital/Imaging Center]
Patient Billing Department
[Address]
[City, State ZIP]

RE: Imaging Bill Dispute - Account #[ACCOUNT NUMBER]
Date of Service: [DATE]
Procedure: [CT/MRI/X-ray of ___]
Billed Amount: $[AMOUNT]

To Whom It May Concern:

I am disputing the charges for imaging services performed on [DATE]. My concerns are:

1. PRICE DISPARITY
Your published price transparency data shows negotiated rates of $[LOWER AMOUNT] for this procedure with major insurers. I am being charged $[HIGHER AMOUNT], which is [X]% more than your negotiated rates.

2. SPECIFIC CHARGE DISPUTES
[List specific issues - unbundling, phantom charges, contrast markup, etc.]

3. REQUEST
I am requesting that my bill be adjusted to:
- Match your lowest negotiated rate for this procedure
- Remove any disputed charges identified above
- Apply any available prompt-pay or self-pay discount

Under the Hospital Price Transparency Rule, you must offer self-pay patients rates no higher than those offered to insured patients. Please respond within 30 days.

Sincerely,
[Your Signature]
[Your Name]`
      }
    },
    successStories: [
      {
        title: "MRI Bill Reduced from $8,400 to $1,800",
        outcome: "Patient discovered hospital's price transparency file showed $1,600 negotiated rate with Blue Cross. After demanding price match and applying for financial assistance, bill was reduced 78%.",
        keyTactics: "Price transparency research, negotiated rate comparison, persistence through multiple escalations"
      },
      {
        title: "CT Scan Bill Eliminated Under No Surprises Act",
        outcome: "Radiologist billed $2,100 above insurance payment. Patient filed No Surprises complaint within 30 days. Entire balance billing amount was withdrawn.",
        keyTactics: "Identified out-of-network status, filed federal complaint, documented all communication"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Billing Department", action: "Request itemized bill, challenge pricing" },
      { level: 2, entity: "Radiology Billing (if separate)", action: "Dispute out-of-network charges" },
      { level: 3, entity: "Patient Financial Counselor", action: "Request price match and financial assistance" },
      { level: 4, entity: "CMS No Surprises Hotline", action: "Report out-of-network balance billing" },
      { level: 5, entity: "State Attorney General", action: "File price transparency violation complaint" }
    ]
  },
  {
    id: "hospitalization-bill",
    title: "Hospital Stay/Admission Bill",
    icon: BedDouble,
    featured: true,
    situation: "You were hospitalized for one or more nights and received a bill for $20,000 to $200,000+ that seems impossibly high for your length of stay.",
    insiderKnowledge: [
      "Daily room rates vary from $2,000-$15,000+ depending on unit - verify you were in the correct unit level throughout your stay",
      "ICU/CCU rates are 3-5x regular room rates - challenge ICU charges if you were stable and didn't need intensive monitoring",
      "Every specialist who 'rounded' on you bills separately - you may have 5-15 doctors billing for one stay, many you never saw",
      "Hospital pharmacies mark up medications 300-1000% - a $5 aspirin becomes $100, a $10 antibiotic becomes $500",
      "Physical therapy, occupational therapy, and speech therapy often appear for visits that lasted 5 minutes or never happened",
      "Observation vs. inpatient status determines insurance coverage AND can triple your out-of-pocket costs - this is often wrong",
      "Each time a nurse gives you a pill, checks your vitals, or changes your IV is NOT separately billable - but hospitals try",
      "'Hospital fees' or 'daily service charges' are vague catch-all charges that can be $1,000-5,000/day on top of room rate",
      "If you were transferred between units (ICU to step-down to regular room), verify dates match your actual movements",
      "Consultation fees are only billable for NEW physician consultations, not follow-up rounds by the same doctor",
      "If you brought your own medications from home, you should NOT be charged for hospital-dispensed versions",
      "Night-time medication doses are sometimes charged at premium 'emergency' rates"
    ],
    billForensics: {
      title: "Common Hospitalization Billing Errors to Challenge",
      redFlags: [
        { code: "99223/99233", description: "Initial/subsequent hospital care - Highest complexity level billed for routine cases. Verify documentation supports complexity", amount: "$500-1,500/day" },
        { code: "99291/99292", description: "Critical care - Billed per hour for ICU. Verify you actually received critical care intervention, not just monitoring", amount: "$500-1,000/hour" },
        { code: "99251-99255", description: "Consultation codes - Each specialist consultation. Verify you actually SAW each consulting physician", amount: "$200-800 each" },
        { code: "G0378/G0379", description: "Observation services - Often billed incorrectly. May have been inpatient or should have been billed differently", amount: "$300-2,000/hour" },
        { code: "97110-97542", description: "Physical/occupational therapy - Verify duration matches billing. Each 15-min increment is separately billed", amount: "$100-300 per unit" },
        { code: "J0120-J9999", description: "Medications (J-codes) - Compare to GoodRx/retail prices. Challenge markups over 300%", amount: "$50-10,000 per med" },
        { code: "99024", description: "Post-discharge care - Follow-up related to hospitalization should be included, not billed separately", amount: "$150-400 each" }
      ],
      unbundlingSchemes: [
        "Room rate, nursing care, and 'hospital services' billed as three separate daily charges",
        "Each medication administration billed separately from the medication cost",
        "Vital signs, monitoring, and 'nursing assessment' billed in addition to room rate",
        "IV fluids, IV access, and IV medication administration as three separate charges",
        "Oxygen therapy billed separately from room rate even for routine low-flow supplementation",
        "Admission and discharge 'processing' fees billed on top of physician admission/discharge charges",
        "Each day of stay billed at the initial high rate instead of decreasing for subsequent days"
      ],
      phantomCharges: [
        "Specialist consultations for doctors you never met or spoke with",
        "Physical therapy or respiratory therapy visits that didn't occur",
        "Medications you didn't receive or refused to take",
        "Supplies charged to your room that were used for other patients",
        "ICU-level charges for days you were in regular room",
        "Private room charges when you were in shared room",
        "Tests ordered but cancelled before being performed",
        "Equipment rental (wheelchair, crutches) you never used"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "First Call After Receiving Hospital Bill",
        approach: "Hospital stays generate complex bills from multiple sources. Your first goal is getting complete information.",
        script: "I'm calling about my recent hospitalization from [DATE] to [DATE]. I've received bills totaling $[AMOUNT] and need complete documentation before I can address this. I need: 1) A complete itemized bill with all charges and CPT codes, 2) A list of all physicians who billed during my stay, 3) My medical record showing daily progress notes, and 4) Information about your financial assistance programs. When can I expect these documents?",
        followUp: "If they push for payment: 'With multiple providers and complex charges, I need to review everything for accuracy first. What is your typical timeline before accounts go to collections?'"
      },
      observationStatusChallenge: {
        title: "Challenging Observation Status",
        approach: "If you were on 'observation' instead of 'inpatient' status, your costs may be 2-3x higher and you lose certain benefits.",
        script: "I'm reviewing my hospital stay and see I was classified as 'observation' status. I believe my condition warranted inpatient admission because [EXPLAIN: severity, length of stay, treatments received]. I'm requesting a formal review of this status determination. Under CMS guidelines, patients can request Condition Code 44 review if they believe observation status was incorrect.",
        escalationScript: "If they won't review: 'I have the right to a formal Medicare/Medicaid review of this status determination. Please provide me with the Self-Administered Status Determination form and escalate this to your utilization review department.'"
      },
      specialistDispute: {
        title: "Disputing Multiple Specialist Bills",
        approach: "Challenge consultations from doctors you never meaningfully interacted with.",
        script: "I've received bills from [NUMBER] different specialists during my [X]-day stay. I need to verify each consultation. Specifically, I don't recall meeting with [SPECIALIST NAME] and have no record of their consultation in my discharge paperwork. Can you provide documentation showing when each consultant physically examined me and what specific questions prompted their consultation?",
        followUp: "If they can't document the consultation: 'Without documentation of a face-to-face consultation and clear medical necessity, these charges should be removed as they represent billing for services not rendered.'"
      },
      medicationDispute: {
        title: "Challenging Medication Markups",
        approach: "Hospital medication prices are notoriously inflated. Use comparison pricing to negotiate.",
        script: "I'm reviewing the medication charges on my itemized bill. I'm seeing charges like $[AMOUNT] for [MEDICATION] which has a retail price of $[LOWER AMOUNT] at local pharmacies. Hospital markup of [X]% over retail is unreasonable. I'm requesting that medication charges be adjusted to no more than 200% of retail/GoodRx pricing.",
        escalationScript: "If they refuse: 'These medication prices are significantly above fair market value. If we can't resolve this, I'll file a complaint with the state attorney general regarding predatory pricing and seek a billing compliance review.'"
      }
    },
    legalProtections: {
      federal: [
        { law: "Medicare Observation Notice (MOON)", protection: "Hospitals must give written notice within 36 hours if you're on observation status. Failure to notify may be grounds for appeal", enforcement: "File Medicare complaint if notice wasn't provided" },
        { law: "EMTALA", protection: "Cannot be discharged until medically stable. Premature discharge leading to readmission may indicate the hospital cut corners", enforcement: "File complaint with CMS regional office" },
        { law: "No Surprises Act", protection: "Protects from balance billing by out-of-network specialists who treated you during in-network hospital stay", enforcement: "File complaint at cms.gov/nosurprises" },
        { law: "Hospital Price Transparency Rule", protection: "Hospitals must publish room rates, daily charges, and ancillary service prices", enforcement: "Compare bill to published prices, report violations" }
      ],
      stateExamples: [
        { state: "California", protection: "Emergency stabilization must occur before ability-to-pay discussion. Strong charity care requirements. Bill disputes can delay collections indefinitely." },
        { state: "New York", protection: "Interest-free payment plans required up to 36 months. Hospitals cannot report to credit bureaus during active disputes." },
        { state: "Texas", protection: "Itemized bills required within 10 days. Cannot charge more than fair market value for emergency admissions." },
        { state: "Illinois", protection: "Hospital Uninsured Patient Discount Act requires 25-100% discounts based on income for all hospital charges." },
        { state: "Maryland", protection: "All-payer rate setting means hospitals charge same rates to all patients. Unique price protection." }
      ]
    },
    timeline: {
      title: "Post-Hospitalization Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request medical records and discharge summary", "Identify all providers who may bill separately", "Request itemized bills from hospital AND each specialist", "Note your observation vs. inpatient status from paperwork"], status: "critical" },
        { day: "Day 8-21", actions: ["Cross-reference medical records with all charges", "Identify any consultants you don't remember seeing", "Compare medication charges to retail/GoodRx prices", "Research hospital's price transparency file for rate comparisons"], status: "important" },
        { day: "Day 22-45", actions: ["Submit written disputes for unsupported charges", "Challenge observation status if applicable", "Apply for financial assistance at hospital", "File No Surprises complaints for out-of-network specialist bills"], status: "strategic" },
        { day: "Day 46-60", actions: ["Follow up on all disputes and applications", "Negotiate settlement amounts with corrected bills", "Request 0% interest payment plan if needed", "Get all agreements in writing"], status: "resolution" }
      ]
    },
    templates: {
      hospitalizationDisputeLetter: {
        title: "Hospital Stay Billing Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Billing Department
[Hospital Address]
[City, State ZIP]

RE: Billing Dispute - Hospitalization Account #[ACCOUNT NUMBER]
Dates of Service: [ADMISSION DATE] to [DISCHARGE DATE]
Billed Amount: $[AMOUNT]

SENT VIA CERTIFIED MAIL

To Whom It May Concern:

After reviewing my medical records against my itemized hospital bill, I am disputing the following charges:

1. SPECIALIST CONSULTATIONS
I am being billed for consultations by [NUMBER] specialists totaling $[AMOUNT]. My medical records do not document meaningful face-to-face encounters with [SPECIFIC DOCTORS]. Please provide consultation notes proving services were rendered or remove these charges.

2. ROOM/UNIT LEVEL
My records show I was transferred to a regular room on [DATE], but I am being billed at [ICU/STEP-DOWN] rates through [LATER DATE]. Please correct room charges to match my actual unit assignments.

3. MEDICATION CHARGES
The following medications are billed at excessive markups:
- [MEDICATION]: Billed $[X], retail price $[Y] = [Z]% markup
- [MEDICATION]: Billed $[X], retail price $[Y] = [Z]% markup

I am requesting these charges be reduced to reasonable market rates.

Total Disputed Amount: $[TOTAL]

Please respond in writing within 30 days. My account should not be referred to collections while this dispute is pending.

Sincerely,
[Your Signature]
[Your Name]`
      }
    },
    successStories: [
      {
        title: "5-Day Hospital Stay Reduced from $89,000 to $28,500",
        outcome: "Patient identified: 3 days billed at ICU rates when only 1 was spent in ICU, 6 specialist consultations for doctors never seen, and medication markups averaging 800%. After formal disputes and financial assistance, saved 68%.",
        keyTactics: "Medical record comparison, unit transfer verification, consultant documentation requests, medication price research"
      },
      {
        title: "Observation Status Reversed, Saving $12,000",
        outcome: "Patient challenged 48-hour observation status that should have been inpatient admission. After Condition Code 44 review, status was changed retroactively, Medicare coverage improved, and patient responsibility dropped from $15,000 to $3,000.",
        keyTactics: "Status determination challenge, formal Medicare review request, persistence through multiple appeals"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Patient Billing", action: "Request complete itemized bills, identify discrepancies" },
      { level: 2, entity: "Patient Financial Counselor", action: "Dispute charges, apply for financial assistance" },
      { level: 3, entity: "Each Specialist's Billing Office", action: "Dispute individual physician charges" },
      { level: 4, entity: "Utilization Review Department", action: "Challenge observation status, request status review" },
      { level: 5, entity: "Hospital Compliance Officer", action: "Report billing irregularities, request formal audit" },
      { level: 6, entity: "State Health Department / CMS", action: "File formal complaints for billing violations" }
    ]
  },
  {
    id: "lab-work-bill",
    title: "Laboratory/Blood Work Bill",
    icon: Syringe,
    featured: true,
    situation: "You had blood work or other lab tests and received a bill for hundreds or thousands of dollars for what you thought were routine tests.",
    insiderKnowledge: [
      "Hospital labs charge 5-10x more than independent labs like Quest or LabCorp for IDENTICAL tests",
      "A 'comprehensive metabolic panel' should be ONE charge (~$15-50), not 14 separate test charges ($300-700)",
      "Labs frequently bill for the same test multiple times using different codes (unbundling)",
      "Your doctor may send labs to an out-of-network lab without your knowledge - No Surprises Act applies",
      "Genetic testing ranges from $100-$10,000+ depending on medical necessity and insurance coverage",
      "The 'collection fee' (drawing blood) is often billed separately at $25-200 and is sometimes duplicate billed",
      "Panels (CBC, CMP, Lipid) are BUNDLES - charging for individual components is fraud if the panel code was used",
      "Labs run at hospitals have both 'technical' (performing) and 'professional' (interpretation) fees - double check for duplication",
      "If labs were repeated due to 'hemolysis' (blood sample destroyed) or other lab errors, you should NOT pay for both",
      "Reference lab charges occur when hospital sends your sample to another lab - you may be billed by BOTH",
      "Pathology interpretation fees can be billed for routine labs that don't actually require physician review"
    ],
    billForensics: {
      title: "Common Laboratory Billing Errors to Challenge",
      redFlags: [
        { code: "80053", description: "Comprehensive Metabolic Panel - Should be ONE charge for 14 tests. If individual tests also appear (82565, 82947, etc.), it's unbundling", amount: "$100-500" },
        { code: "85025/85027", description: "Complete Blood Count (CBC) - Includes all component tests. Separate charges for WBC, RBC, platelets are unbundling", amount: "$50-200" },
        { code: "80061", description: "Lipid Panel - Total cholesterol, HDL, triglycerides bundled. Separate component billing is improper", amount: "$75-300" },
        { code: "36415", description: "Venipuncture (blood draw) - Standard collection fee. Challenge if billed multiple times or at hospital markup", amount: "$25-200" },
        { code: "99000", description: "Handling/conveyance fee - Often added on top of collection. May be duplicate charge", amount: "$15-75" },
        { code: "88305", description: "Pathology interpretation - Often billed for routine labs that don't require physician review", amount: "$100-500" },
        { code: "81479", description: "Unlisted molecular pathology - Genetic tests using 'unlisted' codes can be priced arbitrarily high", amount: "$500-10,000" }
      ],
      unbundlingSchemes: [
        "Comprehensive Metabolic Panel billed PLUS individual component tests (glucose, sodium, potassium)",
        "CBC billed PLUS individual component tests (WBC, RBC, hemoglobin, hematocrit)",
        "Lipid panel billed PLUS total cholesterol, HDL, LDL, triglycerides separately",
        "Blood collection fee billed multiple times for single blood draw",
        "Both the hospital lab AND the reference lab billing for same test",
        "Pathology/interpretation fee for routine chemistry panels that don't require interpretation",
        "Duplicate billing for tests run on same specimen"
      ],
      phantomCharges: [
        "Tests ordered but never actually performed",
        "Repeat tests due to lab errors charged to patient",
        "Pathology interpretation for automated tests",
        "Collection fees when blood was drawn for other purposes (IV start)",
        "Stat/rush fees when no rush was requested or needed",
        "Multiple collection fees for single blood draw session",
        "Reference lab fees passed through at markup"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "First Call About Lab Bill",
        approach: "Lab bills are among the most error-prone. Start by verifying what was actually ordered and performed.",
        script: "I'm calling about a laboratory bill for $[AMOUNT] for tests on [DATE]. This amount seems very high for routine blood work. I need an itemized bill showing each test with its CPT code. I also need to verify which tests my doctor actually ordered versus what was billed. Can you send me a copy of the order along with the itemized bill?",
        followUp: "If they say the charges are standard: 'Your prices are [X] times higher than Quest/LabCorp for identical tests. I'd like to discuss a price adjustment to bring these charges in line with market rates.'"
      },
      unbundlingDispute: {
        title: "Challenging Panel Unbundling",
        approach: "Panels are meant to be billed as single codes. Component billing is improper.",
        script: "I'm reviewing my lab bill and see charges for both a [Comprehensive Metabolic Panel / CBC / Lipid Panel] AND separate charges for [INDIVIDUAL TESTS]. According to CMS billing guidelines, these component tests are included in the panel code and cannot be billed separately. This appears to be unbundling, which is a billing compliance issue. Please remove the duplicate component charges.",
        escalationScript: "If they won't remove: 'Unbundling lab tests is a documented form of billing fraud. I'm requesting a compliance review and will file a complaint with the OIG if these improper charges are not removed.'"
      },
      priceComparisonNegotiation: {
        title: "Negotiating Based on Market Rates",
        approach: "Lab pricing varies wildly. Use competitor pricing to negotiate.",
        script: "I've researched pricing for these lab tests. Quest Diagnostics charges $[AMOUNT] for the same panel, and LabCorp charges $[AMOUNT]. Your charge of $[HOSPITAL AMOUNT] is [X]% higher than market rates. I'm willing to pay a reasonable amount in line with market pricing. Can we agree on $[PROPOSED AMOUNT] to resolve this account?",
        followUp: "If they claim hospital labs cost more: 'The tests and equipment are identical. The only difference is location. Medicare pays the same amount regardless of where labs are performed. I'm requesting you match Medicare or market rates.'"
      }
    },
    legalProtections: {
      federal: [
        { law: "Clinical Laboratory Fee Schedule", protection: "Medicare sets maximum prices for lab tests. These rates reflect fair market value and can be used as negotiation benchmarks", enforcement: "Reference CMS Clinical Lab Fee Schedule in disputes" },
        { law: "No Surprises Act", protection: "If labs were sent to an out-of-network laboratory, you're protected from balance billing", enforcement: "File complaint at cms.gov/nosurprises" },
        { law: "ACA Preventive Care", protection: "Many screening labs (cholesterol, glucose, etc.) should be covered at 100% when properly coded as preventive", enforcement: "Appeal to insurance with correct preventive codes" },
        { law: "False Claims Act", protection: "Unbundling laboratory tests to increase charges is a form of healthcare fraud", enforcement: "Report to OIG hotline if unbundling is confirmed" }
      ],
      stateExamples: [
        { state: "California", protection: "Hospital lab charges capped at rates paid by government payers for uninsured patients." },
        { state: "New York", protection: "Labs must provide cost estimates before drawing blood for non-emergency testing." },
        { state: "Texas", protection: "Balance billing banned for lab services provided during in-network hospital stays." },
        { state: "Colorado", protection: "Hospital price transparency includes laboratory pricing. Compare before disputing." }
      ]
    },
    timeline: {
      title: "Lab Bill Response Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized bill with CPT codes for each test", "Request copy of original lab order from your doctor", "Compare billed tests to ordered tests", "Check if lab was in-network or out-of-network"], status: "critical" },
        { day: "Day 6-15", actions: ["Compare prices to Quest/LabCorp/Medicare rates", "Identify any unbundling (panels + components)", "Verify tests weren't duplicated or repeated", "Research No Surprises Act applicability"], status: "important" },
        { day: "Day 16-30", actions: ["Submit written dispute for identified errors", "Request price adjustment to market rates", "Apply for financial assistance if hospital", "File No Surprises complaint if out-of-network"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on disputes", "Negotiate final settlement", "Get agreement in writing", "Pay only after resolution"], status: "resolution" }
      ]
    },
    templates: {
      labDisputeLetter: {
        title: "Laboratory Bill Dispute Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Laboratory/Hospital Name]
Billing Department
[Address]
[City, State ZIP]

RE: Laboratory Bill Dispute - Account #[ACCOUNT NUMBER]
Date of Service: [DATE]
Billed Amount: $[AMOUNT]

To Whom It May Concern:

I am disputing the laboratory charges for tests performed on [DATE]. After reviewing my itemized bill, I have identified the following issues:

1. UNBUNDLING
I am being charged for both [PANEL NAME] (CPT [CODE]) AND individual component tests that are included in this panel:
- [COMPONENT TEST] - $[AMOUNT]
- [COMPONENT TEST] - $[AMOUNT]
According to CMS guidelines, these components cannot be billed separately when the panel is performed. Please remove these duplicate charges.

2. PRICE DISPARITY
Your charges are significantly above market rates:
- Your charge: $[AMOUNT] for [TEST]
- Quest/LabCorp price: $[AMOUNT] for same test
- Medicare allowable: $[AMOUNT]
I am requesting an adjustment to reasonable market rates.

3. [ANY OTHER SPECIFIC DISPUTES]

Total Amount in Dispute: $[TOTAL]

Please respond within 30 days with an explanation or adjustment. My account should not be sent to collections while this dispute is pending.

Sincerely,
[Your Signature]
[Your Name]`
      }
    },
    successStories: [
      {
        title: "Lab Bill Reduced from $2,800 to $380",
        outcome: "Patient identified unbundling: Comprehensive Metabolic Panel was billed at $400 PLUS 14 individual component tests at $150 each. After filing unbundling complaint, only the single panel charge remained at market rate.",
        keyTactics: "CPT code analysis, CMS billing guideline reference, compliance escalation"
      },
      {
        title: "Out-of-Network Lab Bill Eliminated",
        outcome: "Hospital sent routine blood work to out-of-network reference lab that billed $1,900. Patient filed No Surprises Act complaint within 30 days. Entire balance was written off.",
        keyTactics: "Network status verification, No Surprises Act dispute, documentation of patient choice violation"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Laboratory Billing Department", action: "Request itemized bill, verify tests ordered" },
      { level: 2, entity: "Hospital Patient Billing", action: "Dispute unbundling and pricing" },
      { level: 3, entity: "Patient Financial Counselor", action: "Request price adjustment, financial assistance" },
      { level: 4, entity: "Billing Compliance Office", action: "Report suspected unbundling fraud" },
      { level: 5, entity: "OIG / State AG", action: "File formal fraud complaint if unbundling confirmed" }
    ]
  },
  {
    id: "anesthesia-bill",
    title: "Anesthesia Bill (Separate from Surgery)",
    icon: Pill,
    featured: true,
    situation: "You received a separate bill from an anesthesiologist or anesthesia group that's surprisingly high, often from a provider you never met before surgery.",
    insiderKnowledge: [
      "Anesthesia is billed in 'units' - time units plus base units plus modifier units - verify each",
      "Each 15 minutes typically equals one time unit - compare billed time to surgical notes",
      "Anesthesiologists are frequently out-of-network, even at in-network facilities - No Surprises Act applies",
      "CRNA (nurse anesthetist) rates should be lower than MD anesthesiologist rates - check who provided care",
      "Base units are procedure-specific and standardized by ASA - look up the correct base units",
      "Physical status modifiers (P1-P6) add units - P1 is healthy, P4+ adds significant units",
      "Difficult intubation modifiers can add units - verify this was documented if billed",
      "Post-anesthesia care unit (PACU) time may be billed separately from OR time",
      "Nerve blocks and regional anesthesia are billed separately from general anesthesia",
      "The conversion factor (dollar per unit) varies wildly - compare to Medicare rates"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "00100-01999", description: "Anesthesia procedure codes (by body area)" },
        { code: "99100", description: "Anesthesia for patient of extreme age (under 1 or over 70)" },
        { code: "99116", description: "Anesthesia complicated by total body hypothermia" },
        { code: "99140", description: "Anesthesia complicated by emergency conditions" },
        { code: "01996", description: "Daily hospital management of epidural/subarachnoid infusion" }
      ],
      redFlags: [
        "Time units exceeding surgical time by more than 15-30 minutes",
        "Base units higher than ASA Relative Value Guide specifies",
        "Physical status modifier (P3+) without corresponding medical documentation",
        "Emergency modifier (99140) when surgery was scheduled electively",
        "Multiple providers billing simultaneously"
      ],
      unbundlingSchemes: [
        "Billing intubation separately when included in base anesthesia",
        "Billing arterial line placement when bundled with the anesthesia",
        "Separate charges for anesthesia machine, monitors, or supplies",
        "Billing pre-op evaluation as separate from anesthesia service"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Time Unit Verification Call",
        approach: "Anesthesia time is the easiest billing component to dispute with documentation.",
        script: "I'm reviewing my anesthesia bill and need to verify the time units billed. I've compared the billed anesthesia time of [X] hours to my surgical notes which show procedure duration of [Y]. Can you explain the [Z] minute discrepancy? I'd like documentation of anesthesia start and end times.",
        followUp: "If they can't document actual start/end times, request time unit reduction to match surgical record."
      },
      disputeCall: {
        title: "No Surprises Act Protection",
        approach: "Out-of-network anesthesiologists at in-network facilities are protected under federal law.",
        script: "I received care at an in-network facility but this anesthesiologist was out-of-network. Under the No Surprises Act, I'm protected from balance billing for anesthesia services provided at an in-network facility. I should only owe my in-network cost-sharing amount. Please reprocess this bill to comply with federal law.",
        escalationScript: "If they refuse to adjust: 'I will be filing a complaint with the CMS No Surprises Help Desk and my state insurance commissioner. Please provide your compliance officer's contact information.'"
      },
      financialAssistance: {
        title: "CRNA vs. MD Rate Challenge",
        approach: "Nurse anesthetists provide most anesthesia care and should be billed at lower rates.",
        script: "I need clarification on the provider type who administered my anesthesia. My records indicate a CRNA (Certified Registered Nurse Anesthetist) provided my care, but I'm being billed at physician rates. CRNA services are typically reimbursed at 85% of physician rates. Please adjust accordingly.",
        followUp: "Request supervision documentation if billed as MD-supervised CRNA to verify the level of physician involvement."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After disputes are addressed, negotiate a reduced lump-sum payment.",
        script: "I've reviewed the adjusted balance of $[AMOUNT]. Given the time unit corrections and rate adjustments we discussed, I'm prepared to settle this account today with a payment of $[30-50% OF BALANCE]. This would be a one-time payment in full settlement.",
        escalationScript: "If they refuse: 'I understand. I'll need to continue my dispute and file formal complaints. Please provide confirmation of our discussion today.'"
      }
    },
    legalProtections: {
      federal: [
        "No Surprises Act (2022): Protects against balance billing for anesthesia at in-network facilities",
        "Medicare Anesthesia Rules: If Medicare patient, strict time documentation required",
        "ASA Relative Value Guide: Industry standard for base units - can challenge if exceeded"
      ],
      stateExamples: [
        { state: "California", protection: "AB 72: Strong surprise billing protection. Anesthesiologists at in-network facilities must accept in-network rates." },
        { state: "New York", protection: "Surprise Bill Law: Patient held harmless for emergency anesthesia. Independent dispute resolution available." },
        { state: "Texas", protection: "SB 1264: Comprehensive surprise bill protection. Anesthesia specifically included in protected services." }
      ]
    },
    timeline: {
      title: "Anesthesia Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request anesthesia record and OR notes", "Identify anesthesia provider type (MD, CRNA, AA)", "Verify network status at time of service", "Request itemized bill with time units breakdown"], status: "critical" },
        { day: "Day 8-20", actions: ["Compare billed time to surgical notes", "Verify base units against ASA guide", "Check for inappropriate modifiers", "Identify any bundling violations"], status: "important" },
        { day: "Day 21-40", actions: ["Submit written dispute with documentation", "File No Surprises Act complaint if applicable", "Request price reduction negotiation", "Apply for financial assistance"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on dispute resolution", "Request supervisor review if initial denial", "Negotiate payment plan if needed", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Anesthesia Bill Cut from $8,500 to $2,100",
        outcome: "Patient discovered out-of-network anesthesiologist billed for 6 hours when surgery was 3.5 hours. Filed No Surprises Act complaint and time unit dispute. Bill reduced to in-network rate for corrected time.",
        keyTactics: "Surgical record comparison, No Surprises Act complaint, time unit verification"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Anesthesia Group Billing", action: "Request time documentation, dispute units" },
      { level: 2, entity: "Hospital Patient Advocate", action: "Report out-of-network surprise billing" },
      { level: 3, entity: "Insurance Appeals", action: "Request payment based on in-network rate" },
      { level: 4, entity: "CMS No Surprises Help Desk", action: "File federal complaint" },
      { level: 5, entity: "State Insurance Commissioner", action: "File formal surprise billing complaint" }
    ]
  },
  {
    id: "specialist-bill",
    title: "Specialist Consultation Bill",
    icon: Stethoscope,
    featured: true,
    situation: "You were referred to or saw a specialist and received a bill that seems high for the time spent or services provided.",
    insiderKnowledge: [
      "Consultation codes (99241-99245) pay higher than regular office visit codes - verify appropriate use",
      "Many specialists bill 'facility fees' on top of professional fees at hospital-owned practices",
      "In-office procedures may be billed separately from the visit itself - check for bundling",
      "New patient visits are billed higher than established patient visits",
      "E/M code level (1-5) should match the complexity of your visit - upcoding is common",
      "Hospital-based specialist practices can charge 40-50% more than independent practices",
      "Some specialists add 'modifier 25' to bill a visit AND procedure - often inappropriate",
      "Telehealth specialist visits should typically cost less than in-person",
      "Pre-visit questionnaires may be used to justify higher-level coding",
      "Second opinions are often covered differently - check before scheduling"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "99201-99215", description: "Office/outpatient visits (new and established)" },
        { code: "99241-99245", description: "Office consultations" },
        { code: "G0463", description: "Hospital outpatient clinic visit (facility fee)" },
        { code: "99354-99357", description: "Prolonged services (adds significant cost)" }
      ],
      redFlags: [
        "Level 4 or 5 E/M code for a brief visit (less than 20 minutes)",
        "Facility fee (G0463) when seen at doctor's private office",
        "Consultation code when it's actually a referral/new patient visit",
        "Prolonged service add-on for standard length appointment",
        "Modifier 25 with minor procedure - often inappropriate"
      ],
      unbundlingSchemes: [
        "Separate bill for 'medical decision making' in addition to E/M",
        "Billing EKG interpretation separately when included in visit",
        "Separate charge for reviewing outside records",
        "Billing telephone follow-up in addition to office visit"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "E/M Level Challenge",
        approach: "Visit level is the most common source of overcharging at specialist offices.",
        script: "I'm questioning the evaluation and management level billed for my visit. I was billed a level [X] visit but my appointment lasted only [Y] minutes with straightforward issues discussed. According to CMS E/M guidelines, this should be a level [Z]. Can you provide documentation justifying this coding level?",
        followUp: "Request audit of documentation by certified coder if they can't explain."
      },
      disputeCall: {
        title: "Facility Fee Challenge",
        approach: "Hospital-based practices must disclose facility fees in advance under many state laws.",
        script: "I noticed a facility fee on my bill that I wasn't informed about in advance. I received a $[X] facility fee even though I was seen in what appeared to be a normal doctor's office. I was not informed this was a hospital-based practice with additional facility fees. Please waive this fee as I would have chosen an independent practice if informed.",
        escalationScript: "If they refuse: 'I'm filing a complaint with hospital administration about lack of price transparency and will report this to my state insurance commissioner.'"
      },
      financialAssistance: {
        title: "Price Transparency Request",
        approach: "Use price transparency laws to negotiate fair market rates.",
        script: "Under the Hospital Price Transparency Rule, I'm entitled to see your prices. Can you provide a good faith estimate and show me how your charges compare to the Medicare rate for these services? I'm prepared to pay a fair market rate.",
        followUp: "Reference competitors' published prices if available to support your negotiation."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After addressing disputes, negotiate a lump-sum settlement.",
        script: "I've reviewed the adjusted charges after our discussion about the E/M level and facility fee. I'm prepared to settle this account today with a payment of $[30-50% OF BALANCE] as a one-time payment in full settlement.",
        escalationScript: "If they refuse: 'I understand. I'll continue pursuing my options including formal complaints and will request the minimum monthly payment plan.'"
      }
    },
    legalProtections: {
      federal: [
        "Hospital Price Transparency Rule: Hospitals must publish prices for shoppable services",
        "Good Faith Estimate: Uninsured patients entitled to written estimate before service",
        "No Surprises Act: Protects against balance billing for out-of-network specialists at in-network facilities"
      ],
      stateExamples: [
        { state: "California", protection: "Patients must be informed in writing when physician's office is hospital-based with additional fees." },
        { state: "Florida", protection: "Healthcare Price Transparency Law requires facilities to post prices for common services." },
        { state: "Colorado", protection: "Out-of-network surprise billing protection includes specialist consultations at in-network facilities." }
      ]
    },
    timeline: {
      title: "Specialist Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized bill with CPT codes", "Verify specialist's network status", "Check if facility fee was disclosed in advance", "Compare billed codes to visit documentation"], status: "critical" },
        { day: "Day 6-15", actions: ["Research Medicare rates for services billed", "Check for duplicate or bundled charges", "Verify E/M level matches visit complexity", "Document actual visit duration and content"], status: "important" },
        { day: "Day 16-30", actions: ["Submit formal dispute for overcharges", "Request good faith estimate comparison", "Negotiate cash pay discount", "Apply for financial assistance if eligible"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on dispute resolution", "Escalate to practice manager if needed", "Negotiate payment plan", "Keep all documentation"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Specialist Bill Reduced from $1,200 to $380",
        outcome: "Patient challenged level 5 E/M code for 15-minute visit with one complaint. After requesting documentation review, practice acknowledged overcoding and adjusted to appropriate level 3. Additional $400 facility fee waived after patient proved no advance disclosure.",
        keyTactics: "E/M level challenge, facility fee disclosure complaint, Medicare rate comparison"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Specialist's Billing Department", action: "Request itemized bill, challenge coding" },
      { level: 2, entity: "Practice Manager", action: "Escalate pricing concerns, request adjustment" },
      { level: 3, entity: "Hospital Patient Relations", action: "Complain about undisclosed facility fees" },
      { level: 4, entity: "State Medical Board", action: "Report egregious upcoding practices" },
      { level: 5, entity: "Insurance Company", action: "Report suspected fraud for investigation" }
    ]
  },
  {
    id: "physical-therapy-bill",
    title: "Physical/Occupational Therapy Bill",
    icon: Activity,
    featured: true,
    situation: "You've been receiving therapy and the bills are adding up quickly, sometimes $200-500 per session.",
    insiderKnowledge: [
      "Hospital-based PT costs 2-3x more than independent PT clinics - always compare",
      "Each 'modality' (heat, ice, electrical stim, ultrasound) may be billed separately",
      "15-minute billing increments may be rounded up significantly - verify actual treatment time",
      "Many insurance plans have strict visit limits (20-60 per year) - verify coverage before continuing",
      "Supervised exercises vs. one-on-one time are billed differently - check ratio",
      "Group therapy rates should be lower than individual - verify you weren't billed for individual",
      "Home exercise program instruction shouldn't be billed every visit",
      "Evaluation codes (97161-97163) are high - should only be billed at start and reassessment",
      "Some modalities (like ultrasound) have questionable clinical evidence - may not be necessary",
      "Direct access in many states means you don't need physician referral - saves a visit"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "97110", description: "Therapeutic exercises (per 15 min)" },
        { code: "97140", description: "Manual therapy (per 15 min)" },
        { code: "97530", description: "Therapeutic activities (per 15 min)" },
        { code: "97161-97163", description: "PT evaluation (low/moderate/high complexity)" },
        { code: "97035", description: "Ultrasound therapy" },
        { code: "97014", description: "Electrical stimulation (unattended)" }
      ],
      redFlags: [
        "More than 4-6 units (60-90 min) per session when actual treatment was shorter",
        "Evaluation code (97161-97163) billed multiple times in treatment course",
        "Modalities like ultrasound billed every session without clear benefit",
        "97150 (group therapy) billed at individual rates",
        "Billing for modalities when therapist was treating other patients"
      ],
      unbundlingSchemes: [
        "Billing therapeutic exercises AND activities for same treatment",
        "Separate charges for hot pack and exercise when done simultaneously",
        "Billing evaluation codes for routine progress updates",
        "Separate charge for 'exercise instruction' vs. therapeutic exercise"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Unit Count Verification",
        approach: "PT billing is based on 15-minute units. Verify actual treatment time matches billed time.",
        script: "I need to verify the units billed for my therapy sessions. My bills show [X] units (15-minute increments) per session, but my appointments are only [Y] minutes long including check-in and warm-up. Can you provide minute-by-minute treatment logs showing [X x 15] = [total] minutes of skilled PT services?",
        followUp: "Request the daily treatment notes which must document time for each CPT code."
      },
      disputeCall: {
        title: "Hospital vs. Independent Rate Challenge",
        approach: "Hospital-based PT costs 2-3x more than independent clinics. Use this as leverage.",
        script: "I'd like to understand why PT at this location costs so much more than other clinics. I'm being charged $[X] per session when independent PT clinics charge $[Y] for the same services. Can you match the going rate for outpatient PT in this area? I may need to transfer my care to a more affordable provider.",
        escalationScript: "If they won't adjust: 'Please process my transfer of care to [independent clinic name]. I'll need my records sent within 10 business days.'"
      },
      financialAssistance: {
        title: "Medical Necessity Challenge",
        approach: "Some PT modalities have limited clinical evidence and add significant cost.",
        script: "I want to understand which treatments are essential versus optional. I notice I'm being charged for ultrasound/electrical stim every session. The clinical evidence for these modalities is limited. Can we focus on only the evidence-based treatments to reduce my costs?",
        followUp: "Request written justification for each modality used to support your care."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "Negotiate a lump-sum settlement for accumulated PT bills.",
        script: "I have accumulated PT bills totaling $[AMOUNT]. I'm prepared to settle this balance today with a payment of $[30-50% OF BALANCE]. This would resolve all outstanding PT charges.",
        escalationScript: "If they refuse: 'I understand. Please set up a payment plan at the minimum monthly amount while I explore other options.'"
      }
    },
    legalProtections: {
      federal: [
        "Medicare 8-Minute Rule: Specific rules on how PT time is rounded - applies to all payers similarly",
        "Therapy Cap Exception Process: If hit insurance limit, can request exception for medical necessity",
        "Direct Access Laws: Many states allow PT without physician referral"
      ],
      stateExamples: [
        { state: "California", protection: "Physical therapists must disclose fees before treatment begins. Price transparency required." },
        { state: "Texas", protection: "Direct access to PT without physician referral. Consumer protection against unexpected bills." },
        { state: "New York", protection: "Surprise billing protection includes outpatient PT at hospital-based facilities." }
      ]
    },
    timeline: {
      title: "PT Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized bill for all sessions", "Verify insurance benefits and remaining visits", "Check if facility is hospital-based vs. independent", "Calculate units vs. actual appointment times"], status: "critical" },
        { day: "Day 6-15", actions: ["Compare charges to independent PT rates", "Review treatment notes for time documentation", "Identify unnecessary or duplicate modalities", "Calculate total out-of-pocket vs. expected"], status: "important" },
        { day: "Day 16-30", actions: ["Submit dispute for time/unit discrepancies", "Request modality justification", "Negotiate cash pay rate for remaining sessions", "Consider transfer to independent clinic"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on dispute resolution", "Finalize payment plan if needed", "Document all communications", "Report excessive billing if pattern found"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "PT Bills Cut from $4,800 to $1,600 (12 sessions)",
        outcome: "Patient documented that 45-minute sessions were being billed as 6 units (90 minutes). After challenging with session duration records and threatening transfer to independent clinic, facility agreed to correct billing and match competitive rates.",
        keyTactics: "Unit count verification, appointment duration tracking, competitor rate comparison"
      }
    ],
    escalationPath: [
      { level: 1, entity: "PT Clinic Billing", action: "Request itemized bills, dispute unit counts" },
      { level: 2, entity: "Clinic Director/Manager", action: "Negotiate rates, discuss transfer of care" },
      { level: 3, entity: "Hospital Patient Billing", action: "Challenge facility fees if hospital-based" },
      { level: 4, entity: "State PT Board", action: "Report billing fraud if documented pattern" },
      { level: 5, entity: "Insurance Fraud Hotline", action: "Report suspected fraudulent billing" }
    ]
  },
  {
    id: "mental-health-bill",
    title: "Mental Health/Therapy Bill",
    icon: Brain,
    featured: true,
    situation: "You're receiving mental health treatment and facing high out-of-pocket costs despite having insurance.",
    insiderKnowledge: [
      "Mental Health Parity Act requires equal coverage for mental and physical health - violations are common",
      "Many therapists are out-of-network - ask about 'out-of-network benefits' before starting",
      "Session length billing varies - 45 vs 60 minutes are different CPT codes (90834 vs 90837)",
      "Telehealth may be billed differently (sometimes lower) than in-person",
      "Insurance often covers only certain diagnoses - verify yours is covered",
      "Sliding scale fees are common in mental health - always ask",
      "Community mental health centers offer significantly lower rates",
      "Psychology Today and Open Path Collective list affordable therapists",
      "Employee Assistance Programs (EAP) often provide 3-6 free sessions",
      "Some therapists will negotiate a 'single case agreement' with your insurance"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "90791", description: "Psychiatric diagnostic evaluation" },
        { code: "90834", description: "Psychotherapy, 45 minutes" },
        { code: "90837", description: "Psychotherapy, 60 minutes" },
        { code: "90847", description: "Family psychotherapy with patient present" },
        { code: "90839", description: "Psychotherapy for crisis (first 60 min)" },
        { code: "90785", description: "Interactive complexity add-on" }
      ],
      redFlags: [
        "90837 (60-min) billed for shorter sessions",
        "Interactive complexity add-on (90785) added without documented reason",
        "Crisis codes (90839) for routine therapy sessions",
        "Psychiatric evaluation (90791) billed multiple times",
        "Facility fees for outpatient therapy in non-hospital setting"
      ],
      unbundlingSchemes: [
        "Billing evaluation AND therapy on same initial visit when should be one code",
        "Separate charges for 'treatment planning' in addition to therapy",
        "Billing family therapy separately when family was briefly included in individual session",
        "Add-on codes for normal therapeutic interventions"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Mental Health Parity Challenge",
        approach: "Federal law requires equal treatment of mental and physical health benefits.",
        script: "I believe my mental health benefits are not at parity with my medical benefits. Under the Mental Health Parity and Addiction Equity Act, my copay/coinsurance for mental health cannot be higher than for medical visits. My therapy copay is $[X] but my specialist copay is only $[Y]. Please explain how this complies with federal parity law.",
        followUp: "Document the disparity in writing and prepare to file a parity complaint."
      },
      disputeCall: {
        title: "Out-of-Network Benefits Request",
        approach: "Out-of-network mental health benefits can provide significant reimbursement.",
        script: "I need to understand my out-of-network mental health benefits. My in-network therapist has a 6-month wait, which creates access issues. What percentage do you reimburse for out-of-network therapy after I meet my deductible? I'd like to file for out-of-network reimbursement for urgent mental health needs.",
        escalationScript: "If denied: 'The wait time for in-network providers creates an access issue. I'm requesting a network adequacy exception under my plan's appeal process.'"
      },
      financialAssistance: {
        title: "Sliding Scale Request",
        approach: "Many therapists offer income-based sliding scale fees. Always ask.",
        script: "I'm having difficulty affording my therapy sessions. I value our work together but my current financial situation makes the full fee difficult. Would you consider a sliding scale fee based on my income? I'm committed to continuing treatment if we can find an affordable rate.",
        followUp: "If they can't reduce fees, ask for referral to community mental health center or Open Path Collective."
      },
      settlementOffer: {
        title: "Insurance Parity Complaint",
        approach: "File formal complaints if parity violations are documented.",
        script: "I've documented parity violations in my mental health coverage and am prepared to file complaints with the state insurance commissioner and Department of Labor. I'd prefer to resolve this directly. Will you adjust my copays to match my medical benefits and provide retroactive refunds?",
        escalationScript: "If they refuse: 'I will be filing formal complaints. Please note my account that this dispute is ongoing.'"
      }
    },
    legalProtections: {
      federal: [
        "Mental Health Parity and Addiction Equity Act: Requires equal treatment of mental and physical health benefits",
        "ACA Essential Health Benefits: Mental health is required coverage in marketplace plans",
        "HIPAA: Extra protections for mental health records and billing privacy"
      ],
      stateExamples: [
        { state: "California", protection: "SB 855 extends parity to all state-regulated plans. Medically necessary mental health treatment cannot be denied." },
        { state: "New York", protection: "Timothy's Law requires comprehensive mental health coverage. Strong parity enforcement." },
        { state: "Illinois", protection: "Mental Health Parity Compliance Act with strict enforcement mechanisms." }
      ]
    },
    timeline: {
      title: "Mental Health Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized statement with CPT codes", "Verify insurance mental health benefits", "Check if therapist is in-network or out-of-network", "Review session lengths vs. codes billed"], status: "critical" },
        { day: "Day 6-15", actions: ["Compare mental health benefits to medical benefits (parity check)", "Calculate out-of-network reimbursement rate", "Ask therapist about sliding scale options", "Research community mental health alternatives"], status: "important" },
        { day: "Day 16-30", actions: ["File parity complaint if disparities found", "Submit out-of-network claims for reimbursement", "Negotiate sliding scale with current therapist", "Apply for EAP benefits if available"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on insurance claims/complaints", "Finalize fee arrangement with therapist", "Set up payment plan if needed", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Therapy Costs Cut 60% Through Parity Complaint",
        outcome: "Patient discovered mental health copay was $75 while specialist copay was only $40. Filed mental health parity complaint with state insurance commissioner. Insurer was required to adjust mental health copays to match medical, resulting in refund of $840.",
        keyTactics: "Parity analysis, state insurance complaint, retroactive refund request"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Therapist's Billing Office", action: "Request sliding scale, verify coding" },
      { level: 2, entity: "Insurance Mental Health Department", action: "Appeal denials, request parity review" },
      { level: 3, entity: "Insurance Grievance Department", action: "File formal grievance for parity violations" },
      { level: 4, entity: "State Insurance Commissioner", action: "File parity complaint" },
      { level: 5, entity: "Department of Labor (employer plans)", action: "File MHPAEA violation complaint" }
    ]
  },
  {
    id: "ambulance-bill",
    title: "Ambulance/EMS Bill",
    icon: Ambulance,
    featured: true,
    situation: "You received an ambulance bill for $1,000-$5,000+ for what may have been a short transport.",
    insiderKnowledge: [
      "Ground ambulance services are EXEMPT from the No Surprises Act - limited federal protection",
      "BLS (Basic Life Support) should cost less than ALS (Advanced Life Support) - verify level billed",
      "Mileage charges are separate from base rate - verify distance is accurate",
      "If ambulance wasn't medically necessary (you could have safely used other transport), you can dispute",
      "Some municipalities have ambulance membership programs for $50-100/year that cap costs",
      "Many areas have multiple ambulance services - the one that responds may not be in your network",
      "Wait time can be billed - if they waited for hospital bed, you might see extra charges",
      "Supplies like oxygen, IV starts, and medications are often billed separately",
      "Air ambulance has separate federal protections (No Surprises Act DOES apply to air)",
      "Medicare rates for ambulance are publicly available - use as negotiation benchmark"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "A0429", description: "Ambulance BLS emergency" },
        { code: "A0427", description: "Ambulance ALS Level 1 emergency" },
        { code: "A0433", description: "Ambulance ALS Level 2 (advanced interventions)" },
        { code: "A0425", description: "Mileage (per loaded mile)" },
        { code: "A0422", description: "Ambulance oxygen and supplies" },
        { code: "A0398", description: "Ambulance response - treatment, no transport" }
      ],
      redFlags: [
        "ALS billed when only BLS interventions were provided (vital signs, basic first aid)",
        "ALS2 billed without advanced interventions (intubation, cardiac monitoring, IV drugs)",
        "Mileage that exceeds reasonable route to hospital",
        "Wait time charges for brief loading times",
        "Supplies billed when not documented as used"
      ],
      unbundlingSchemes: [
        "Separate billing for oxygen when included in base rate",
        "Separate charge for 'emergency response' on top of transport",
        "Billing both ALS and BLS codes for same transport",
        "Separate facility fee for ambulance dispatch"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Service Level Dispute",
        approach: "ALS vs. BLS billing is the most common ambulance overcharge - verify against the run report.",
        script: "I'm disputing the level of service billed for my ambulance transport. I was billed for ALS (Advanced Life Support) but the run report shows only basic interventions: vital signs, oxygen assessment, and transport. No IV, cardiac monitoring, or advanced medications were provided. This should be BLS billing.",
        followUp: "Request the complete Patient Care Report (PCR) to verify interventions performed."
      },
      disputeCall: {
        title: "Mileage and Route Verification",
        approach: "Mileage charges are often inflated. Compare billed miles to actual route.",
        script: "I need to verify the mileage charges on my ambulance bill. I'm being billed for [X] loaded miles, but Google Maps shows the hospital is only [Y] miles from the pickup location. Can you explain the route taken and provide documentation of actual mileage?",
        escalationScript: "If they can't document the route: 'I'm requesting the GPS log from the transport. Please adjust the mileage charges to reflect the actual distance traveled.'"
      },
      financialAssistance: {
        title: "Financial Hardship Appeal",
        approach: "Many ambulance services, especially municipal ones, have hardship programs.",
        script: "I'm unable to pay this ambulance bill and need assistance options. This unexpected ambulance bill of $[X] represents significant financial hardship. Do you offer any discounts for financial hardship, payment plans, or write-off programs for patients unable to pay?",
        followUp: "Ask specifically about municipal ambulance membership or subscription programs that may apply retroactively."
      },
      settlementOffer: {
        title: "Medical Necessity Challenge",
        approach: "If transport wasn't medically necessary, you may not owe for it.",
        script: "I need to understand why ambulance transport was deemed medically necessary. I was transported by ambulance, but I could have safely traveled by [car/taxi/other means]. The ambulance was called by [third party/I wasn't given a choice]. Can you provide documentation of medical necessity for this transport?",
        escalationScript: "If they can't document medical necessity: 'Without documentation of medical necessity, I'm disputing the entire charge. Please provide written justification or adjust the bill accordingly.'"
      }
    },
    legalProtections: {
      federal: [
        "No Surprises Act - AIR Ambulance: Air ambulance IS covered - you cannot be balance billed",
        "Medicare Rates: Publicly available benchmark for ambulance pricing",
        "EMTALA: If ambulance was called due to ER transfer requirement, may be hospital's responsibility"
      ],
      stateExamples: [
        { state: "California", protection: "AB 651: Prohibits ground ambulance balance billing for insured patients. Significant protections." },
        { state: "Colorado", protection: "Ground ambulance surprise billing protection. Out-of-network billing restricted." },
        { state: "New York", protection: "Surprise billing law includes some ground ambulance protections. IDR process available." },
        { state: "Most States", protection: "Limited or no protection for ground ambulance - federal law specifically exempted ground ambulance." }
      ]
    },
    timeline: {
      title: "Ambulance Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request itemized bill with codes", "Request Patient Care Report (PCR)", "Verify your state's ambulance billing protections", "Check if ambulance service is government or private"], status: "critical" },
        { day: "Day 8-20", actions: ["Compare billed service level to PCR interventions", "Verify mileage against actual route", "Research Medicare rates for comparison", "Identify any bundling/unbundling issues"], status: "important" },
        { day: "Day 21-40", actions: ["Submit written dispute for overcharges", "Apply for financial hardship program", "Check for municipal ambulance membership programs", "Negotiate cash settlement"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on dispute/hardship application", "Negotiate payment plan if needed", "Consider state AG complaint if bad actor", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Ambulance Bill Reduced from $4,200 to $800",
        outcome: "Patient billed for ALS2 transport when PCR showed only vital signs taken during 8-mile transport. After obtaining run report and disputing service level, bill was corrected to BLS rate. Additional mileage overcharge of 15 miles was also corrected.",
        keyTactics: "PCR documentation review, service level challenge, mileage verification, Medicare rate benchmark"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Ambulance Billing Department", action: "Request PCR, dispute service level/mileage" },
      { level: 2, entity: "Ambulance Service Management", action: "Request financial hardship review" },
      { level: 3, entity: "Municipal Government (if public)", action: "Request ombudsman intervention" },
      { level: 4, entity: "State Insurance Commissioner", action: "File complaint (if state has protections)" },
      { level: 5, entity: "State Attorney General", action: "Report deceptive billing practices" }
    ]
  },
  {
    id: "dental-hospital-bill",
    title: "Dental Surgery/Hospital-Based Dental Bill",
    icon: Activity,
    featured: true,
    situation: "You had dental work done in a hospital setting (wisdom teeth, oral surgery) and received a surprisingly high facility bill.",
    insiderKnowledge: [
      "Hospital facility fees for dental procedures can be 5-10x the procedure cost itself",
      "General anesthesia for dental is often not covered by dental insurance OR medical insurance - gap in coverage",
      "Office-based dental surgery is typically 50-75% less than hospital-based",
      "Many dental surgeries billed as 'complex' are actually routine and should be office-based",
      "Oral surgeons can perform most procedures in-office with IV sedation at much lower cost",
      "Hospital may bill dental procedure under medical codes to increase reimbursement",
      "Anesthesiologist is often billed separately and may be out-of-network",
      "Operating room time is billed by the minute - efficient surgery reduces cost",
      "Pre-authorization doesn't guarantee payment - only confirms coverage intent",
      "Dental discount plans (not insurance) may cover hospital dental at better rates than PPOs"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "D7210", description: "Extraction - surgical (impacted tooth)" },
        { code: "D7240", description: "Extraction - impacted tooth (completely bony)" },
        { code: "D9223", description: "Deep sedation/general anesthesia (first 15 min)" },
        { code: "41899", description: "Unlisted oral surgery procedure (watch for abuse)" },
        { code: "Revenue Code 0360", description: "Operating room services (facility fee)" }
      ],
      redFlags: [
        "Facility fees exceeding the surgical fees by 3x or more",
        "General anesthesia for procedures that could be done with local or IV sedation",
        "Extended OR time that doesn't match procedure complexity",
        "'Unlisted procedure' codes when standard codes exist",
        "Separate anesthesiologist bill equal to or higher than surgical fee"
      ],
      unbundlingSchemes: [
        "Billing surgical extraction AND simple extraction for same tooth",
        "Separate charges for bone removal when included in impaction code",
        "Billing both dental and medical codes for same procedure",
        "Separate 'recovery room' charges when included in anesthesia"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Medical Necessity for Hospital Setting",
        approach: "Hospital dental costs 3-5x more than office-based. Challenge if not medically necessary.",
        script: "I need to understand why this procedure required a hospital setting. My wisdom teeth extraction was performed in the hospital at a cost of $[X] when the same procedure is done in oral surgery offices for $[Y]. Can you document the specific medical necessity that required a hospital operating room rather than an outpatient oral surgery center?",
        followUp: "If no documented medical necessity, dispute the facility charges entirely."
      },
      disputeCall: {
        title: "Anesthesia Level Challenge",
        approach: "General anesthesia costs much more than IV sedation. Verify it was medically required.",
        script: "I'm questioning whether general anesthesia was necessary. I was billed $[X] for general anesthesia when IV conscious sedation (commonly used for dental surgery) would cost far less. Was general anesthesia medically necessary, or was it chosen for convenience? I'd like documentation of why this level was required.",
        escalationScript: "If they can't document necessity: 'I'm disputing the difference between general anesthesia and IV sedation rates. Please adjust accordingly.'"
      },
      financialAssistance: {
        title: "Dual Coverage Coordination",
        approach: "When you have both dental and medical insurance, coordinate benefits correctly.",
        script: "I have both dental and medical insurance and am being caught in the middle. My dental insurance says this is medical, and my medical insurance says it's dental. The procedure was medically necessary oral surgery. Under coordination of benefits rules, one of these plans should be primary. Can you help me file with both plans correctly?",
        followUp: "File appeal with both plans simultaneously, citing medical necessity documentation."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After addressing disputes, negotiate a lump-sum settlement.",
        script: "I've reviewed my adjusted balance after our discussions about facility fees and anesthesia charges. I'm prepared to settle all outstanding dental surgery bills today with a payment of $[30-50% OF BALANCE] as final settlement.",
        escalationScript: "If they refuse: 'I'll continue pursuing my formal disputes. Please set up minimum monthly payments while this is resolved.'"
      }
    },
    legalProtections: {
      federal: [
        "No Surprises Act: Protects against out-of-network anesthesiologist billing at in-network facility",
        "ERISA (employer plans): Appeal rights for coverage denials",
        "ACA Pediatric Dental: Children's dental is essential health benefit in marketplace plans"
      ],
      stateExamples: [
        { state: "California", protection: "Dental anesthesia for children and special needs patients often mandated coverage." },
        { state: "Texas", protection: "SB 1264 surprise billing protection includes hospital-based dental services." },
        { state: "Florida", protection: "Limited dental coverage requirements but facility fee disclosure required." }
      ]
    },
    timeline: {
      title: "Dental Hospital Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Separate hospital bill from surgeon bill from anesthesia bill", "Request itemized statement from each billing entity", "Check coverage under both dental AND medical insurance", "Verify anesthesiologist network status"], status: "critical" },
        { day: "Day 8-20", actions: ["Compare hospital charges to oral surgery office rates", "Challenge medical necessity for hospital setting", "Verify anesthesia level was appropriate", "Identify any unbundling or duplicate charges"], status: "important" },
        { day: "Day 21-40", actions: ["File claims with both dental and medical insurance", "Submit medical necessity appeal if denied", "Negotiate facility fee reduction directly", "Apply for hospital financial assistance"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on all insurance claims/appeals", "Finalize settlement with hospital", "Set up payment plan if needed", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Wisdom Teeth Bill Cut from $12,000 to $3,200",
        outcome: "Patient billed $8,000 hospital facility fee plus $2,500 anesthesia plus $1,500 oral surgery for 4 wisdom teeth. After demonstrating same procedure done in oral surgery offices for $2,800, patient negotiated facility fee down 70%. Filed No Surprises Act complaint for out-of-network anesthesiologist.",
        keyTactics: "Office-based rate comparison, facility fee negotiation, No Surprises Act complaint for anesthesia"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Billing", action: "Request itemized bill, challenge facility fees" },
      { level: 2, entity: "Oral Surgeon's Office", action: "Request medical necessity documentation" },
      { level: 3, entity: "Both Insurance Companies", action: "File with medical and dental, appeal denials" },
      { level: 4, entity: "Hospital Financial Assistance", action: "Apply for charity care/payment plan" },
      { level: 5, entity: "State Insurance Commissioner", action: "File complaint for coverage denial" }
    ]
  },
  {
    id: "durable-equipment-bill",
    title: "Medical Equipment (CPAP, Wheelchair, etc.)",
    icon: ClipboardList,
    featured: true,
    situation: "You received medical equipment and are being billed monthly amounts that seem excessive or equipment that costs more than retail.",
    insiderKnowledge: [
      "DME (Durable Medical Equipment) is often rented when buying outright is cheaper",
      "CPAP machines and supplies are commonly overpriced through insurance - check online prices",
      "After rental payments exceed purchase price, you should own the equipment - verify this",
      "Medicare rates for DME are publicly available for comparison (CMS DME fee schedule)",
      "You can often buy the same equipment online for 40-70% less than billed amounts",
      "DME suppliers have high profit margins - 50%+ discounts are often available",
      "Competitive Bidding Program sets Medicare rates in many areas - use as benchmark",
      "Supplies (CPAP masks, wheelchair cushions) are major profit center - compare prices",
      "Many items billed as 'DME' should be covered as prosthetics or orthotics (different coverage)",
      "If equipment doesn't work or fit properly, you may not owe for it"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "E0601", description: "CPAP device" },
        { code: "E0470", description: "BiPAP without backup rate" },
        { code: "A7030", description: "CPAP full face mask" },
        { code: "A7031", description: "CPAP nasal mask" },
        { code: "E1390", description: "Oxygen concentrator" },
        { code: "K0823", description: "Power wheelchair, Group 2" }
      ],
      redFlags: [
        "Monthly rental exceeding 10% of purchase price (rent-to-own should cap at 13 months)",
        "CPAP machine billed at $2,000+ when retail is under $800",
        "Supplies auto-shipped and billed without patient request",
        "Equipment billed before delivery or patient training",
        "Billing continues after patient stopped using equipment"
      ],
      unbundlingSchemes: [
        "Separate billing for humidifier when bundled with CPAP",
        "Charging for 'setup' when included in equipment rental",
        "Billing training/instruction separately from equipment",
        "Separate charges for carrying case and power cord"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Rent vs. Buy Analysis",
        approach: "Calculate whether renting costs more than buying. After 13 months, you should own the equipment.",
        script: "I want to compare rental costs to purchasing outright. You're billing $[X] per month to rent this equipment. I can purchase the identical item online for $[Y] total. After [Z] months of rental, I'll have paid more than the purchase price. Will you sell me this equipment now for the equivalent of [A] months rental?",
        followUp: "Many DME suppliers will sell at Medicare rate if you push. Get it in writing."
      },
      disputeCall: {
        title: "Medicare Rate Benchmark",
        approach: "Medicare rates are public and serve as fair market value benchmark.",
        script: "I'd like to understand how your pricing compares to Medicare rates. The Medicare Competitive Bidding rate for this [equipment] is $[X]. You're charging my insurance $[Y], which is [Z]% higher. Can you explain this pricing disparity and consider matching the Medicare rate?",
        escalationScript: "If they won't match: 'I'll be purchasing my own equipment at fair market value. Please confirm when my rental agreement can be terminated.'"
      },
      financialAssistance: {
        title: "Auto-Ship Cancellation",
        approach: "Auto-shipped supplies you didn't request are disputable. Cancel in writing.",
        script: "I need to cancel automatic supply shipments and dispute past charges. I've been receiving automatic shipments of supplies I didn't order or need. I want to cancel all auto-shipments immediately and dispute the last [X] months of charges for supplies I didn't request. Please confirm cancellation in writing.",
        followUp: "Many DME auto-ship practices violate consumer protection laws. File FTC complaint if they don't comply."
      },
      settlementOffer: {
        title: "Equipment Ownership Transfer",
        approach: "After rental cap period, you own the equipment. Verify and stop payments.",
        script: "I've been renting this equipment for [X] months. Under the capped rental rules, I should own this equipment after 13 months of rental. Please confirm transfer of ownership and stop all future rental charges.",
        escalationScript: "If they dispute: 'I'll be filing a complaint with Medicare (if applicable) and my state attorney general for continuing to bill rental after ownership should have transferred.'"
      }
    },
    legalProtections: {
      federal: [
        "Medicare DME Competitive Bidding: Sets benchmark pricing in many areas",
        "Capped Rental Rules: Patient must own after 13 months of rental for many items",
        "Prior Authorization: Many DME items require PA - not valid if not obtained"
      ],
      stateExamples: [
        { state: "California", protection: "DME suppliers must provide written cost estimates before providing equipment." },
        { state: "New York", protection: "Surprise billing protections apply to DME provided by out-of-network suppliers." },
        { state: "Texas", protection: "DME providers must disclose if they're in-network before providing equipment." }
      ]
    },
    timeline: {
      title: "DME Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request itemized bill with HCPCS codes", "Look up Medicare rates for items billed", "Check online retail prices for comparison", "Review rental vs. purchase terms in agreement"], status: "critical" },
        { day: "Day 8-20", actions: ["Calculate total rental cost vs. purchase price", "Identify any auto-shipped items you didn't request", "Verify equipment was received and working", "Check if rental period should have ended"], status: "important" },
        { day: "Day 21-40", actions: ["Submit written request to purchase at fair value", "Cancel unwanted auto-ship subscriptions in writing", "Dispute charges for unwanted/unreceived supplies", "Negotiate cash purchase price"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on purchase/discount requests", "Confirm auto-ship cancellation", "Return any unused/unwanted supplies for credit", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "CPAP Costs Cut from $3,600/year to $650",
        outcome: "Patient was being billed $200/month for CPAP rental plus $100/month for auto-shipped supplies. After 18 months, had paid $5,400. Discovered equipment ownership should have transferred at 13 months ($2,600). Purchased replacement CPAP online for $650 and supplies from Amazon at 70% savings.",
        keyTactics: "Rent-to-own cap enforcement, online price comparison, auto-ship cancellation"
      }
    ],
    escalationPath: [
      { level: 1, entity: "DME Supplier Billing", action: "Request itemized bill, dispute pricing" },
      { level: 2, entity: "DME Company Management", action: "Negotiate purchase or discount" },
      { level: 3, entity: "Insurance DME Department", action: "Report excessive billing, request audit" },
      { level: 4, entity: "Medicare (if applicable)", action: "Report DME fraud to OIG" },
      { level: 5, entity: "State Attorney General", action: "Report deceptive consumer practices" }
    ]
  },
  {
    id: "medication-bill",
    title: "Hospital Pharmacy/Medication Bill",
    icon: Pill,
    featured: true,
    situation: "You were charged hundreds or thousands for medications during a hospital stay or ER visit.",
    insiderKnowledge: [
      "Hospital pharmacies mark up common medications 200-1000% over retail",
      "A $10 antibiotic can be billed as $200+ in a hospital setting",
      "IV medications are billed higher than oral versions of the same drug - oral is often equally effective",
      "Ask for your own prescriptions to be brought from home if hospitalized (must be approved)",
      "Unit dose packaging is much more expensive than dispensing from bulk",
      "Generic and brand medications may be billed the same at hospital markup",
      "340B hospitals buy drugs at huge discounts but may bill full price",
      "Chemotherapy and specialty drugs have extreme hospital markups",
      "Medication administration fees are often billed separately from the drug itself",
      "Take-home prescriptions from hospital pharmacy are typically overpriced"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "J-codes", description: "Injectable drugs (J0000-J9999)" },
        { code: "96374", description: "IV push administration" },
        { code: "96365", description: "IV infusion (first hour)" },
        { code: "Revenue Code 0250", description: "Pharmacy - general" },
        { code: "Revenue Code 0636", description: "Drugs requiring specific identification" }
      ],
      redFlags: [
        "Single dose of common medication billed at $100+",
        "IV Tylenol ($100+) when oral Tylenol ($0.10) would work",
        "Brand medication billed when generic was available",
        "Multiple doses billed when medication was discontinued early",
        "Take-home medications at hospital prices instead of pharmacy prices"
      ],
      unbundlingSchemes: [
        "Billing drug AND administration fee when administration is bundled into room rate",
        "Separate charges for IV bag, tubing, and fluid in addition to medication",
        "Billing pharmacy dispensing fee separately from drug charge",
        "Separate 'preparation' charge for compounded IV medications"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Market Price Comparison",
        approach: "Compare hospital drug prices to retail pharmacy prices. Markups of 200-1000% are common.",
        script: "I'm disputing medication charges that far exceed retail prices. I'm being charged $[X] for [medication] which costs $[Y] at retail pharmacies. This represents a [Z]% markup. I'd like these charges adjusted to a reasonable amount that reflects actual medication costs plus a fair dispensing fee.",
        followUp: "GoodRx prices are excellent benchmarks - print them out to support your case."
      },
      disputeCall: {
        title: "340B Hospital Challenge",
        approach: "340B hospitals get 30-50% discounts on drugs but often charge full price.",
        script: "I understand this hospital participates in the 340B drug pricing program. As a [non-profit/federally qualified] hospital, you receive medications at 340B discount pricing - up to 50% off. However, you're billing me at full price. How is this consistent with your charitable mission? I request pricing that reflects your actual drug costs.",
        escalationScript: "If they refuse: 'I'll be filing a complaint with HRSA about 340B program violations and contacting local media about your pricing practices.'"
      },
      financialAssistance: {
        title: "Therapeutic Substitution Request",
        approach: "IV medications cost much more than oral equivalents. Challenge if oral was possible.",
        script: "I'm questioning whether expensive IV medications were necessary. I see charges for IV [medication] at $[X] when oral [same drug] costs $[Y] and is equally effective for my condition. Was there a documented medical reason I couldn't take oral medications? I'd like this charge adjusted.",
        followUp: "Request clinical justification for IV route when oral was an option."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After challenging specific drug prices, negotiate overall pharmacy charges.",
        script: "I've reviewed the adjusted pharmacy charges after our discussions. I'm prepared to settle all outstanding medication bills with a payment of $[30-50% OF BALANCE] as final settlement.",
        escalationScript: "If they refuse: 'I'll continue pursuing formal complaints about 340B and pricing practices. Please set up minimum monthly payments.'"
      }
    },
    legalProtections: {
      federal: [
        "340B Program Requirements: Hospitals must use savings to benefit uninsured/underinsured",
        "Hospital Price Transparency: Drug pricing should be included in disclosed prices",
        "Medicare Drug Pricing: ASP+6% is Medicare's payment methodology - use as benchmark"
      ],
      stateExamples: [
        { state: "California", protection: "AB 1809: Hospitals must report 340B savings usage. Charity care obligations." },
        { state: "New York", protection: "Hospital charity care requirements include medication assistance." },
        { state: "Maryland", protection: "Rate-setting commission regulates hospital drug pricing." }
      ]
    },
    timeline: {
      title: "Medication Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request itemized pharmacy charges with drug names", "Look up retail/GoodRx prices for each medication", "Identify if hospital is 340B participant", "Check for medications you didn't receive or that were discontinued"], status: "critical" },
        { day: "Day 8-20", actions: ["Calculate markup percentages for each drug", "Identify IV medications that could have been oral", "Check for duplicate or excessive quantities billed", "Research hospital's charity care obligations"], status: "important" },
        { day: "Day 21-40", actions: ["Submit written dispute with price comparisons", "Request 340B pricing consideration if applicable", "Apply for medication assistance programs", "Negotiate overall bill reduction"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on disputes and assistance applications", "Finalize negotiated amount", "Set up payment plan if needed", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Medication Charges Cut from $4,800 to $620",
        outcome: "Patient hospitalized for 3 days was billed $4,800 in pharmacy charges. Analysis revealed $1,200 for IV Tylenol (could have been oral), $800 for medications given after discharge order, and 400% markups on common drugs. After disputing with retail price evidence and 340B challenge, charges reduced 87%.",
        keyTactics: "Retail price comparison, IV vs. oral challenge, 340B participation leverage, discontinued med dispute"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Billing", action: "Request itemized pharmacy charges, dispute pricing" },
      { level: 2, entity: "Hospital Pharmacy Director", action: "Challenge clinical appropriateness of expensive drugs" },
      { level: 3, entity: "Patient Financial Services", action: "Request charity care, negotiate settlement" },
      { level: 4, entity: "Hospital Administration", action: "Cite 340B obligations, charitable mission" },
      { level: 5, entity: "HRSA (for 340B issues)", action: "Report potential 340B program violations" }
    ]
  },
  {
    id: "preventive-care-bill",
    title: "Preventive Care Billed Incorrectly",
    icon: Heart,
    featured: true,
    situation: "You received a bill for a checkup, screening, or preventive service that should have been covered at 100% by insurance.",
    insiderKnowledge: [
      "ACA requires 100% coverage for preventive services but only when billed correctly",
      "If a 'problem' is discussed during a preventive visit, the visit can be recoded as diagnostic",
      "Some labs ordered during preventive visits may not be classified as preventive",
      "The same service can be 'preventive' or 'diagnostic' based solely on the diagnosis code used",
      "Colonoscopies become diagnostic (with copay) if polyps are removed - some states ban this",
      "Annual wellness visits and annual physicals are NOT the same thing - different coverage",
      "Preventive mammograms become diagnostic if you have symptoms or history",
      "HPV tests, STI screening, and many women's preventive services should be 100% covered",
      "Provider may default to diagnostic coding because it pays better",
      "You can request preventive coding be used if clinically appropriate"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "99381-99397", description: "Preventive visit codes (by age)" },
        { code: "G0438/G0439", description: "Medicare Annual Wellness Visits" },
        { code: "99201-99215", description: "Office visits (diagnostic - NOT preventive)" },
        { code: "Z00.00", description: "Diagnosis code: Encounter for general exam WITHOUT abnormal findings" },
        { code: "Z00.01", description: "Diagnosis code: Encounter for general exam WITH abnormal findings" }
      ],
      redFlags: [
        "Preventive visit coded with 99201-99215 (E/M office visit) instead of preventive codes",
        "Z00.01 (exam WITH abnormal findings) when nothing abnormal was found",
        "Labs billed separately with diagnostic codes instead of screening codes",
        "Colonoscopy reclassified as diagnostic due to polyp removal",
        "Mammogram coded as diagnostic when it was routine screening"
      ],
      unbundlingSchemes: [
        "Billing preventive visit AND separate E/M code for same appointment",
        "Billing 'extended' visit for routine questions during preventive care",
        "Separate charges for counseling that's included in preventive visit",
        "Billing lab handling fee separately when bundled with preventive panel"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Coding Correction Request",
        approach: "Preventive visits coded as diagnostic is the most common cause of unexpected bills.",
        script: "My preventive care visit was coded incorrectly as a diagnostic visit. I scheduled and received a routine annual physical/[specific preventive service]. However, it was billed with diagnostic codes instead of preventive codes. The ACA requires preventive services to be covered at 100% with no cost-sharing. Please resubmit with appropriate preventive care codes.",
        followUp: "Provide the correct preventive CPT codes and request resubmission."
      },
      disputeCall: {
        title: "Colonoscopy Polyp Removal Fight",
        approach: "Many states now prohibit reclassifying screening colonoscopies when polyps are found.",
        script: "I'm disputing cost-sharing for my colonoscopy due to polyp removal. My screening colonoscopy was reclassified as 'diagnostic' because polyps were removed, resulting in a $[X] bill. The purpose of screening is to find and remove polyps. This recoding defeats the purpose of preventive care coverage. [If in covered state: My state prohibits this practice.]",
        escalationScript: "If they refuse: 'I'm filing a complaint with the state insurance commissioner. Many insurers have changed this practice after formal complaints.'"
      },
      financialAssistance: {
        title: "Lab Coding Correction",
        approach: "Screening labs should use Z-codes (preventive) not diagnostic codes.",
        script: "Labs from my preventive visit should be covered as screening, not diagnostic. The labs ordered during my annual preventive visit are being billed as diagnostic tests. These are standard screening labs for a patient of my age and risk profile. Please resubmit with screening diagnosis codes (Z-codes) so they're covered as preventive care.",
        followUp: "Request the lab order to verify what the physician actually ordered."
      },
      settlementOffer: {
        title: "Insurance Appeal for Preventive Coverage",
        approach: "Cite ACA requirements when appealing preventive care denials.",
        script: "I'm appealing the cost-sharing applied to my preventive care services. Under ACA Section 2713, these services must be covered at 100% with no cost-sharing. I've provided documentation that these were preventive, not diagnostic services. Please reprocess this claim correctly.",
        escalationScript: "If denied: 'I'll be filing formal complaints with the state insurance commissioner and CMS for violation of ACA essential health benefit requirements.'"
      }
    },
    legalProtections: {
      federal: [
        "ACA Section 2713: Preventive services must be covered at 100% with no cost-sharing",
        "USPSTF A and B Recommendations: These services MUST be covered as preventive",
        "HRSA Women's Preventive Services: Comprehensive women's health coverage required"
      ],
      stateExamples: [
        { state: "California", protection: "AB 2342: Colonoscopy remains preventive even if polyps are removed." },
        { state: "New York", protection: "Insurance Law 4303: Comprehensive preventive care coverage requirements." },
        { state: "Colorado", protection: "Colonoscopy cost-sharing prohibited regardless of findings. Strong preventive care laws." },
        { state: "Illinois", protection: "Mammography and colonoscopy protected from diagnostic recoding." }
      ]
    },
    timeline: {
      title: "Preventive Care Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized bill with CPT and diagnosis codes", "Compare codes used to correct preventive codes", "Check insurance EOB for how claim was processed", "Verify what services were ordered vs. billed"], status: "critical" },
        { day: "Day 6-15", actions: ["Research correct preventive codes for your services", "Check if your state has enhanced preventive protections", "Document the preventive nature of your visit", "Identify any inappropriate diagnostic coding"], status: "important" },
        { day: "Day 16-30", actions: ["Contact provider billing and request recoding", "File insurance appeal if claim was denied/cost-shared", "Cite ACA preventive care requirements", "Request supervisor review if initial refusal"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on recoding request/appeal", "File complaint with state insurance commissioner if needed", "Escalate to CMS if marketplace plan", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Annual Physical Bill Reversed - $485 to $0",
        outcome: "Patient billed $485 for 'annual physical' because provider coded it as diagnostic office visit (99215) with diagnosis of 'fatigue' when patient briefly mentioned tiredness. After requesting recoding to preventive exam (99396) with Z00.00 (routine exam), bill was rebilled and covered at 100%.",
        keyTactics: "Preventive code identification, diagnosis code correction, ACA citation, provider recoding request"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Provider Billing Office", action: "Request recoding with correct preventive codes" },
      { level: 2, entity: "Insurance Member Services", action: "Appeal claim processing, cite ACA requirements" },
      { level: 3, entity: "Insurance Grievance Department", action: "File formal grievance for preventive care denial" },
      { level: 4, entity: "State Insurance Commissioner", action: "File complaint about ACA preventive care violation" },
      { level: 5, entity: "CMS (Marketplace plans)", action: "File complaint for essential health benefit violation" }
    ]
  },
  {
    id: "urgent-care-bill",
    title: "Urgent Care Bill",
    icon: Clock,
    featured: true,
    situation: "You visited an urgent care center for non-emergency treatment and received a bill that seems high for the level of care provided.",
    insiderKnowledge: [
      "Hospital-owned urgent cares can charge 2-3x more than independent urgent cares",
      "Facility fees may be charged on top of professional fees at hospital-affiliated locations",
      "Some 'urgent cares' are actually free-standing ERs that bill ER rates - check before you go",
      "Level of service coding (99281-99285) should match the complexity of your visit",
      "X-rays and labs at urgent care are often marked up significantly - compare to stand-alone facilities",
      "Many insurance plans have different copays for urgent care vs. ER vs. primary care",
      "If you have a primary care doctor, follow-up visits should be there, not urgent care",
      "Urgent care should NOT be billing ER codes unless they're actually an ER",
      "Virtual urgent care visits are typically much cheaper than in-person",
      "Retail clinics (CVS, Walgreens) are often 50% cheaper than urgent care for simple issues"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "99201-99215", description: "Office/outpatient visits (appropriate for most urgent care)" },
        { code: "99281-99285", description: "ER visit codes (should NOT be used by urgent care)" },
        { code: "G0463", description: "Hospital outpatient clinic visit (facility fee)" },
        { code: "99051", description: "Evening/weekend service (after-hours add-on)" }
      ],
      redFlags: [
        "ER codes (99281-99285) used by urgent care facility",
        "Facility fee (G0463) when it appeared to be a regular urgent care",
        "Level 4-5 office visit for simple complaints (cold, sprain, minor cut)",
        "After-hours fee when the urgent care's normal hours include your visit time",
        "High-cost labs for simple diagnoses (strep, flu, UTI)"
      ],
      unbundlingSchemes: [
        "Separate charge for 'medical screening' on top of office visit",
        "Billing wound care supplies separately when included in procedure",
        "Separate interpretation fee for in-house X-rays",
        "Billing 'triage' as separate service from visit"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "ER vs. Urgent Care Coding",
        approach: "Some facilities bill ER rates but market as urgent care. This is a major red flag.",
        script: "I visited an urgent care, not an emergency room. I'm being billed with ER codes (9928X) but I was treated at [facility name] which is marketed as an urgent care. Urgent care visits should use office visit codes (9920X-9921X) which are significantly lower. Please correct the coding or explain why ER codes are appropriate for a non-emergency.",
        followUp: "Some free-standing ERs market as urgent cares - this may be deceptive practice reportable to state AG."
      },
      disputeCall: {
        title: "Level of Service Challenge",
        approach: "Visit level should match the complexity and time of your encounter.",
        script: "The visit level doesn't match the care I received. I came in for [simple complaint like sore throat/sprained ankle]. I was seen for [X] minutes and received [basic treatment]. Being billed a level [4 or 5] seems inconsistent with this straightforward visit. Can you provide documentation supporting this coding level?",
        escalationScript: "If they can't justify: 'Please adjust the visit level to match the actual complexity. I'll request clinical notes to verify if needed.'"
      },
      financialAssistance: {
        title: "Facility Fee Dispute",
        approach: "Hospital-affiliated urgent cares often add surprise facility fees.",
        script: "I wasn't informed this urgent care charges hospital facility fees. I chose this urgent care expecting standard urgent care pricing. I wasn't informed that it's hospital-affiliated with additional facility fees. This should have been disclosed before treatment. Please waive the facility fee of $[X].",
        followUp: "Lack of price transparency disclosure may violate state consumer protection laws."
      },
      settlementOffer: {
        title: "Comparable Rate Negotiation",
        approach: "Compare to what independent urgent cares charge for the same service.",
        script: "Independent urgent cares in this area charge $[X] for similar services. I'm being charged $[Y] which is [Z]% higher. I'm willing to pay $[comparable rate] which is the fair market rate for urgent care services in this area.",
        escalationScript: "If they refuse: 'I'll be filing complaints about deceptive pricing and marketing. Please set up minimum monthly payments while this is resolved.'"
      }
    },
    legalProtections: {
      federal: [
        "Good Faith Estimate: Uninsured patients entitled to cost estimate before service",
        "Price Transparency: Hospital-owned facilities must disclose their hospital affiliation",
        "No Surprises Act: Protects against surprise bills from out-of-network urgent cares at in-network rates"
      ],
      stateExamples: [
        { state: "Texas", protection: "HB 2041: Free-standing ERs must clearly disclose they're not urgent cares. Signage requirements." },
        { state: "Colorado", protection: "Consumer protection against deceptive marketing of ERs as urgent cares." },
        { state: "California", protection: "Hospital-owned urgent cares must disclose facility fees before service." }
      ]
    },
    timeline: {
      title: "Urgent Care Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized bill with CPT codes", "Verify if facility is hospital-owned or independent", "Check if ER codes were used inappropriately", "Compare to your insurance urgent care vs. ER benefits"], status: "critical" },
        { day: "Day 6-15", actions: ["Research whether facility is actually an ER marketed as urgent care", "Check for facility fees that weren't disclosed", "Verify level of service matches your visit", "Compare pricing to other local urgent cares"], status: "important" },
        { day: "Day 16-30", actions: ["Submit coding correction request if ER codes used", "Dispute undisclosed facility fees", "Negotiate based on comparable urgent care rates", "Apply for financial assistance if available"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on disputes/corrections", "File complaint with state AG if deceptive marketing found", "Finalize payment arrangement", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Urgent Care Bill Cut from $1,850 to $290",
        outcome: "Patient treated for flu symptoms at 'urgent care' was billed ER level 4 ($1,200) plus facility fee ($500) plus labs ($150). Investigation revealed facility was free-standing ER marketed as urgent care. After complaint to state AG and insurer, bill was reduced to standard urgent care rates.",
        keyTactics: "ER vs. urgent care distinction, deceptive marketing complaint, facility fee dispute"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Urgent Care Billing", action: "Request itemized bill, challenge coding level" },
      { level: 2, entity: "Urgent Care Manager", action: "Dispute facility fees, request adjustment" },
      { level: 3, entity: "Insurance Company", action: "Request reprocessing as urgent care, not ER" },
      { level: 4, entity: "State Attorney General", action: "Report deceptive marketing (ER as urgent care)" },
      { level: 5, entity: "State Licensing Board", action: "Report facility operating outside its license type" }
    ]
  },
  {
    id: "telehealth-bill",
    title: "Telehealth/Virtual Visit Bill",
    icon: Phone,
    featured: true,
    situation: "You had a virtual doctor visit and were billed unexpectedly high amounts or charged for services you didn't expect.",
    insiderKnowledge: [
      "Telehealth visits should generally cost less than in-person visits - overhead is lower",
      "Some providers bill telehealth at full in-person rates despite lower costs",
      "Facility fees should NEVER be charged for a telehealth visit you took from home",
      "Your insurance may have different cost-sharing for telehealth vs. in-person",
      "Telehealth-only providers (Teladoc, MDLive, etc.) are often cheaper than hospital telehealth",
      "Mental health telehealth has the same parity requirements as in-person therapy",
      "Telehealth prescriptions may be limited - some providers bill for incomplete visits",
      "Audio-only visits (phone calls) should be billed lower than video visits",
      "Check if your employer offers free telehealth as a benefit",
      "Some 'free' telehealth services have hidden costs for prescriptions or follow-ups"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "99441-99443", description: "Telephone E/M services (by time)" },
        { code: "99421-99423", description: "Online digital E/M (by time)" },
        { code: "Modifier 95", description: "Synchronous telemedicine service" },
        { code: "G2012", description: "Virtual check-in (5-10 min)" },
        { code: "Place of Service 02", description: "Telehealth (should not have facility fee)" }
      ],
      redFlags: [
        "Facility fee charged for visit you took from home",
        "Level 4-5 visit code for brief telehealth encounter",
        "Billed as in-person visit without telehealth modifier",
        "Audio-only visit billed at video visit rates",
        "Virtual check-in billed as full E/M visit"
      ],
      unbundlingSchemes: [
        "Billing 'technology fee' separately from telehealth visit",
        "Separate charge for prescription sent electronically",
        "Billing follow-up message as separate encounter",
        "Charging for 'chart preparation' in addition to visit"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Facility Fee Challenge",
        approach: "Facility fees on telehealth visits from your home are inappropriate.",
        script: "I'm disputing the facility fee on my telehealth visit. I had a telehealth visit from my home, but I'm being charged a $[X] facility fee. Facility fees cover the cost of maintaining a physical treatment space - which wasn't used. Please remove this inappropriate charge.",
        followUp: "CMS has clarified facility fees shouldn't apply when patient is at home."
      },
      disputeCall: {
        title: "Audio vs. Video Rate",
        approach: "Audio-only visits should be billed at lower rates than video visits.",
        script: "I had a phone call, not a video visit, and should be billed accordingly. My provider visit was audio-only (telephone), but I'm being billed at the higher video visit rate. Audio-only visits have specific, lower-paying CPT codes (99441-99443). Please correct this billing.",
        escalationScript: "If they dispute: 'Please provide documentation showing video was used during this encounter. I have no record of video being used.'"
      },
      financialAssistance: {
        title: "Telehealth Cost Comparison",
        approach: "Compare to direct-to-consumer telehealth services which are typically cheaper.",
        script: "This telehealth visit costs more than it should for virtual care. I'm being charged $[X] for a telehealth visit when services like Teladoc/MDLive charge $[Y] for similar care. Given the reduced overhead of virtual visits, can you adjust this charge to a competitive rate?",
        followUp: "Many direct-to-consumer telehealth services publish their prices - use as benchmark."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After addressing specific issues, negotiate a fair telehealth rate.",
        script: "I've reviewed the telehealth charges after our discussions about facility fees and visit type. I'm prepared to pay $[fair market rate] for this telehealth encounter, which reflects appropriate pricing for virtual care.",
        escalationScript: "If they refuse: 'I'll be filing complaints about inappropriate telehealth billing practices. Please set up minimum payments.'"
      }
    },
    legalProtections: {
      federal: [
        "CMS Telehealth Guidelines: Facility fees generally not appropriate when patient is at home",
        "Mental Health Parity: Telehealth mental health has same coverage requirements as in-person",
        "HIPAA: Telehealth platforms must be HIPAA-compliant - non-compliant visit may be voidable"
      ],
      stateExamples: [
        { state: "California", protection: "AB 744: Telehealth parity law - must be covered like in-person services." },
        { state: "New York", protection: "Telehealth parity with in-person care. Audio-only visits covered." },
        { state: "Texas", protection: "Telemedicine parity law. Coverage cannot be less than in-person." }
      ]
    },
    timeline: {
      title: "Telehealth Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-5", actions: ["Request itemized bill with CPT codes and modifiers", "Verify if telehealth modifier (95) was used", "Check for inappropriate facility fee", "Compare to your insurance telehealth benefits"], status: "critical" },
        { day: "Day 6-15", actions: ["Verify audio vs. video coding is correct", "Check visit level matches time spent", "Research comparable telehealth service prices", "Review your employer's telehealth benefits"], status: "important" },
        { day: "Day 16-30", actions: ["Dispute facility fees if charged", "Request coding correction if wrong visit type", "Negotiate based on telehealth market rates", "File insurance appeal if coverage denied"], status: "strategic" },
        { day: "Day 31-45", actions: ["Follow up on disputes", "Consider switching to lower-cost telehealth option", "Finalize payment arrangement", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Telehealth Bill Cut from $425 to $89",
        outcome: "Patient billed $425 for 15-minute telehealth visit including $180 facility fee and level 4 E/M code. After disputing facility fee (patient was at home) and challenging visit level (brief routine concern), bill was corrected to appropriate telehealth code at fair rate.",
        keyTactics: "Facility fee removal, visit level challenge, telehealth modifier verification"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Provider Billing", action: "Dispute facility fee, verify telehealth coding" },
      { level: 2, entity: "Practice Manager", action: "Negotiate fair telehealth rate" },
      { level: 3, entity: "Insurance Appeals", action: "Challenge coverage denial, cite parity laws" },
      { level: 4, entity: "State Insurance Commissioner", action: "File complaint about telehealth coverage violations" },
      { level: 5, entity: "FTC", action: "Report deceptive pricing practices" }
    ]
  },
  {
    id: "cancer-treatment-bill",
    title: "Cancer Treatment/Oncology Bill",
    icon: Activity,
    featured: true,
    situation: "You or a loved one is facing cancer treatment bills that are overwhelming, including chemotherapy, radiation, and related care.",
    insiderKnowledge: [
      "Cancer drug markups are extreme - hospitals may mark up 200-600% above acquisition cost",
      "The SAME chemotherapy drug can cost 50% less at an outpatient infusion center vs. hospital",
      "Many pharmaceutical companies have patient assistance programs covering 100% of drug costs",
      "340B hospitals buy cancer drugs at huge discounts but often bill full price",
      "Biosimilar cancer drugs can be 30-50% cheaper than brand-name biologics - ask if available",
      "Some oncologists have financial incentives to prescribe more expensive drugs",
      "Clinical trials often provide treatment at no cost with excellent care quality",
      "Cancer navigators and social workers can help access financial assistance programs",
      "Copay assistance foundations can cover thousands in out-of-pocket costs",
      "Many cancer centers have charity care that covers treatment even for middle-income patients"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "96413", description: "Chemotherapy IV infusion (first hour)" },
        { code: "96415", description: "Chemotherapy IV infusion (additional hour)" },
        { code: "77385-77387", description: "Radiation treatment delivery (IMRT)" },
        { code: "J9XXX", description: "Chemotherapy drug codes" },
        { code: "G0463", description: "Hospital outpatient clinic visit (facility fee)" }
      ],
      redFlags: [
        "Drug charges exceeding Medicare ASP+6% by significant margin",
        "Facility fee for each chemotherapy visit on top of drug/administration costs",
        "Brand-name drug billed when less expensive biosimilar exists",
        "Administration time billed that exceeds actual infusion duration",
        "Drug wastage billed at full dose when partial vial was used"
      ],
      unbundlingSchemes: [
        "Billing pre-medications (anti-nausea, steroids) at extreme markups",
        "Separate IV hydration charges when bundled with chemotherapy",
        "Billing port access separately from chemotherapy administration",
        "Separate 'pharmacy preparation' fees for compounded drugs"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Site of Service Optimization",
        approach: "Hospital infusion centers cost 50% more than independent centers. Explore options.",
        script: "I'd like to explore lower-cost options for my infusion treatments. I understand that receiving chemotherapy at a hospital outpatient center costs significantly more than at a physician-office or freestanding infusion center. Can my treatment be safely provided at a lower-cost site? This could save me and my insurance thousands per treatment.",
        followUp: "Request referral to independent oncology practice if available and appropriate."
      },
      disputeCall: {
        title: "Drug Cost Reduction",
        approach: "Cancer drugs have extreme markups. Explore biosimilars and assistance programs.",
        script: "I need help affording my cancer medications. My [drug name] costs $[X] per treatment which is devastating financially. Can you check if: (1) there's a biosimilar available, (2) the pharmaceutical company has a patient assistance program, (3) there are copay assistance foundations that cover this drug?",
        escalationScript: "If they don't help: 'Please connect me with your patient navigator or financial counselor. Patient Access Network Foundation and HealthWell Foundation may help.'"
      },
      financialAssistance: {
        title: "340B Hospital Leverage",
        approach: "340B hospitals get 30-50% discounts on cancer drugs but often bill full price.",
        script: "I understand this hospital participates in the 340B drug discount program. As a 340B hospital, you purchase cancer drugs at substantial discounts - often 30-50% off. Yet patients are billed at full price. Given your charitable mission and 340B program requirements to benefit underserved patients, I'm requesting drug pricing that reflects your actual costs.",
        followUp: "340B hospitals have legal obligations to use savings to benefit patients."
      },
      settlementOffer: {
        title: "Financial Catastrophe Assistance",
        approach: "Cancer centers have extensive financial assistance programs. Access all available resources.",
        script: "Cancer treatment is causing financial devastation for my family. My total cancer treatment costs exceed my annual income. I've already depleted savings and face potential bankruptcy. I need comprehensive financial assistance including charity care for facility costs, drug manufacturer assistance, and foundation support. Can your financial counselor or patient navigator help me access all available resources?",
        escalationScript: "If minimal help offered: 'I understand there are multiple assistance programs. Please have your patient navigator or social worker contact me to ensure I'm accessing all available resources.'"
      }
    },
    legalProtections: {
      federal: [
        "340B Program: Non-profit hospitals must use drug savings to benefit patients",
        "Clinical Trial Access: Insurance must cover routine costs of care during trials",
        "No Surprises Act: Protects against surprise bills from hospital-based oncology specialists"
      ],
      stateExamples: [
        { state: "California", protection: "SB 532: Hospital charity care requirements. 340B accountability laws." },
        { state: "New York", protection: "Cancer clinical trial coverage mandate. Strong charity care requirements." },
        { state: "Illinois", protection: "Hospital financial assistance requirements include cancer patients up to 600% FPL at some hospitals." }
      ]
    },
    timeline: {
      title: "Cancer Treatment Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Meet with cancer center financial counselor/navigator", "Request complete itemized bills for all treatments", "Apply for hospital financial assistance immediately", "Research manufacturer patient assistance programs"], status: "critical" },
        { day: "Day 8-21", actions: ["Complete manufacturer drug assistance applications", "Apply to copay assistance foundations", "Compare costs at alternative treatment sites", "Check if 340B hospital and leverage accordingly"], status: "important" },
        { day: "Day 22-45", actions: ["Follow up on all assistance applications", "Dispute any billing errors identified", "Negotiate facility fee reductions", "Set up 0% interest payment plans"], status: "strategic" },
        { day: "Ongoing", actions: ["Maintain documentation of all communications", "Reapply for assistance programs as needed", "Monitor bills for continued errors", "Stay current on payment plans"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Cancer Treatment Bills Reduced from $180,000 to $8,400",
        outcome: "Breast cancer patient facing $180,000 in treatment costs accessed comprehensive assistance: 340B hospital charity care covered 60% of facility costs, manufacturer assistance program covered $40,000 in drug costs, copay foundation covered remaining drug copays. Switched some infusions to lower-cost community oncology practice.",
        keyTactics: "Financial navigator assistance, manufacturer patient assistance, 340B leverage, site-of-service optimization"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Cancer Center Financial Counselor", action: "Access all assistance programs, dispute errors" },
      { level: 2, entity: "Pharmaceutical Manufacturer", action: "Apply for drug patient assistance programs" },
      { level: 3, entity: "Copay Assistance Foundations", action: "HealthWell, PAN, CancerCare, disease-specific foundations" },
      { level: 4, entity: "Hospital Administration", action: "Escalate charity care denial, cite 340B obligations" },
      { level: 5, entity: "State Attorney General", action: "Report 340B program violations if non-profit not providing charity care" }
    ]
  },
  {
    id: "cardiac-care-bill",
    title: "Cardiac Care/Heart Procedure Bill",
    icon: HeartPulse,
    featured: true,
    situation: "You had a heart-related procedure (cardiac cath, stent, bypass, pacemaker) and are facing significant bills.",
    insiderKnowledge: [
      "Cardiac devices (stents, pacemakers, defibrillators) have extreme markups - 300-500% is common",
      "The SAME cardiac procedure can cost 50% less at an ambulatory surgery center vs. hospital",
      "Cardiac catheterization often leads to immediate stent placement - get second opinion if possible",
      "Generic drug-eluting stents are now available at much lower cost than brand-name",
      "Multiple stents placed in one procedure should have lower per-stent pricing",
      "Cardiac rehab is often underutilized - very valuable and usually covered",
      "Observation vs. inpatient status dramatically affects your coverage and costs",
      "Some cardiac procedures have 'bundled payment' rates - verify appropriate billing",
      "Post-procedure cardiac drugs can be expensive - manufacturer assistance often available",
      "Second opinions for cardiac surgery are encouraged and covered by most insurance"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "93458/93459", description: "Cardiac catheterization with imaging" },
        { code: "92928", description: "Percutaneous coronary stent (single vessel)" },
        { code: "33533-33536", description: "Coronary artery bypass grafting (CABG)" },
        { code: "33207-33249", description: "Pacemaker/defibrillator insertion" },
        { code: "C1874-C1899", description: "Cardiac device codes (stents, leads)" }
      ],
      redFlags: [
        "Device charges (stents, pacemakers) exceeding typical costs by 2x+",
        "Multiple diagnostic caths billed when one would suffice",
        "Stent procedure billed when drug therapy might have been appropriate first",
        "Observation status for what should have been inpatient admission",
        "Separate facility fees for catheterization and intervention on same day"
      ],
      unbundlingSchemes: [
        "Billing diagnostic cath separately when done with intervention",
        "Separate charges for guide wires and catheters bundled with procedures",
        "Billing multiple imaging studies when one served multiple purposes",
        "Separate cardiovascular lab fee from procedure fee"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Device Cost Challenge",
        approach: "Cardiac devices have 300-500% markups. Compare to Medicare device pricing.",
        script: "The charges for my cardiac device seem excessive. I'm being charged $[X] for my [stent/pacemaker/defibrillator]. The Medicare payment for this device is $[Y], which suggests a significant markup. Given that device costs are a major portion of my bill, can you reduce this charge to a more reasonable amount?",
        followUp: "Device manufacturer pricing is publicly available through CMS data."
      },
      disputeCall: {
        title: "Observation vs. Inpatient",
        approach: "Observation status can dramatically increase your costs. Challenge if inappropriate.",
        script: "I believe my admission status should have been inpatient, not observation. I was hospitalized for [cardiac emergency/procedure] for [X] days but was classified as 'observation' status, leaving me with much higher out-of-pocket costs. Given the severity of my condition and length of stay, can you review whether this should have been an inpatient admission?",
        escalationScript: "If they refuse to change: 'I'm requesting a formal review of my admission status. Medicare has specific criteria and I believe I meet them.'"
      },
      financialAssistance: {
        title: "Bundled Payment Inquiry",
        approach: "Cardiac procedures often have bundled payments covering procedure, device, and follow-up.",
        script: "I want to understand the bundled payment for my cardiac procedure. Cardiac procedures often have bundled payment rates that include the procedure, device, and 90-day follow-up care. Can you show me how my bill aligns with bundled payment methodology? I should not be separately billed for services included in the bundle.",
        followUp: "Many insurers and Medicare use bundled payments for cardiac care."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After addressing specific issues, negotiate overall cardiac care costs.",
        script: "I've reviewed the adjusted balance after our discussions about device pricing and admission status. I'm prepared to settle all cardiac care bills with a payment of $[30-50% OF BALANCE] as final settlement.",
        escalationScript: "If they refuse: 'I'll continue pursuing formal disputes and apply for financial assistance. Please set up minimum monthly payments.'"
      }
    },
    legalProtections: {
      federal: [
        "Medicare Bundled Payments: Many cardiac procedures have bundled rates covering 90 days",
        "Device Price Transparency: Hospital must disclose device pricing under transparency rules",
        "No Surprises Act: Protects against out-of-network surgeon or anesthesiologist balance billing"
      ],
      stateExamples: [
        { state: "California", protection: "Hospital charity care requirements apply to cardiac patients. Price transparency mandated." },
        { state: "Texas", protection: "Surprise billing protection for cardiac procedures at in-network facilities." },
        { state: "Maryland", protection: "All-payer rate regulation means consistent pricing across all patients." }
      ]
    },
    timeline: {
      title: "Cardiac Care Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request itemized bill with device and procedure codes", "Verify admission status (inpatient vs. observation)", "Check network status of all physicians involved", "Request estimated total costs from all billing entities"], status: "critical" },
        { day: "Day 8-21", actions: ["Research Medicare/fair market pricing for devices and procedures", "Verify bundled payment compliance", "Challenge observation status if inappropriate", "Identify any surprise out-of-network bills"], status: "important" },
        { day: "Day 22-45", actions: ["Submit written disputes for overcharges", "Apply for hospital financial assistance", "Negotiate device pricing reduction", "File No Surprises Act complaints if applicable"], status: "strategic" },
        { day: "Day 46-60", actions: ["Follow up on disputes and assistance", "Finalize payment arrangements", "Ensure cardiac rehab is covered", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Cardiac Stent Bill Reduced from $85,000 to $22,000",
        outcome: "Patient received two stents during emergency cardiac cath. Device charges were $35,000 for two stents (Medicare pays ~$3,000 each). After challenging device pricing and applying for hospital charity care (income at 350% FPL), device charges were reduced 80% and remaining facility fees discounted 50%.",
        keyTactics: "Device cost benchmarking, Medicare rate comparison, charity care application, payment plan"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Hospital Billing", action: "Request itemized bill, challenge device/procedure costs" },
      { level: 2, entity: "Patient Financial Services", action: "Apply for charity care, negotiate pricing" },
      { level: 3, entity: "Insurance Appeals", action: "Appeal observation status, surprise bill disputes" },
      { level: 4, entity: "Hospital Administration", action: "Escalate charity care denial, cite 340B/non-profit status" },
      { level: 5, entity: "State AG/Insurance Commissioner", action: "Report price gouging, surprise billing violations" }
    ]
  },
  {
    id: "dialysis-bill",
    title: "Dialysis/Kidney Care Bill",
    icon: Activity,
    featured: true,
    situation: "You or a loved one requires ongoing dialysis treatment and is facing mounting bills despite having insurance.",
    insiderKnowledge: [
      "Dialysis has extreme pricing disparities - Medicare pays ~$250/session while uninsured may be billed $800-1,500+",
      "The two major dialysis chains (DaVita, Fresenius) control 70% of the market and set pricing",
      "Home dialysis (peritoneal or home hemodialysis) is often cheaper and provides better quality of life",
      "Medicare covers dialysis for ESRD patients regardless of age after 3-month waiting period",
      "Private insurance is typically primary for 30 months before Medicare becomes primary",
      "Dialysis facilities have significant financial incentive programs with pharmaceutical companies",
      "Many dialysis-related drugs have patient assistance programs",
      "Charity care and financial assistance are available at most dialysis centers",
      "Transportation to dialysis is often covered by Medicaid or through facility programs",
      "Some hospitals use dialysis as profit center with extreme markups for inpatient dialysis"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "90935", description: "Hemodialysis, one evaluation" },
        { code: "90937", description: "Hemodialysis, repeated evaluation" },
        { code: "90945/90947", description: "Peritoneal dialysis" },
        { code: "J0881-J0882", description: "Darbepoetin (Aranesp)" },
        { code: "J0885", description: "Epoetin alfa (Epogen/Procrit)" }
      ],
      redFlags: [
        "Per-session charges far exceeding Medicare rate (~$250-300)",
        "Drug charges (EPO, Aranesp) at extreme markups above ASP",
        "Charges for supplies that should be bundled in treatment fee",
        "Missing credits for manufacturer rebates on drugs",
        "Facility fee charged for home dialysis supplies/training"
      ],
      unbundlingSchemes: [
        "Billing dialysis supplies (tubing, solutions) separately when bundled",
        "Separate charges for routine lab monitoring included in dialysis rate",
        "Billing vascular access care separately from dialysis session",
        "Separate 'facility fee' for training visits for home dialysis"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Medicare Rate Benchmark",
        approach: "Medicare pays ~$250-300/session. Use this as your negotiation baseline.",
        script: "I want to understand why dialysis costs me so much more than Medicare rates. Medicare pays approximately $[X] per dialysis session, but I'm being charged $[Y] - a [Z]% markup. While I understand private insurance may pay differently, this disparity is extreme. Can you work with me on pricing closer to what Medicare recognizes as fair value?",
        followUp: "Use Medicare dialysis rates as non-negotiable benchmark for negotiations."
      },
      disputeCall: {
        title: "Home Dialysis Cost Reduction",
        approach: "Home dialysis is often cheaper and provides better quality of life.",
        script: "I'd like to explore home dialysis to reduce my costs and improve flexibility. I understand home peritoneal dialysis or home hemodialysis can reduce overall costs while improving quality of life. Is home dialysis appropriate for my situation? What would the cost difference be compared to in-center treatment?",
        escalationScript: "If they discourage home dialysis: 'I'd like a referral to discuss home dialysis options. Many patients have better outcomes with home treatment.'"
      },
      financialAssistance: {
        title: "Drug Cost Assistance",
        approach: "EPO drugs have significant patient assistance programs. Always apply.",
        script: "I need help affording the drugs associated with my dialysis treatment. The EPO/Aranesp for my anemia management costs $[X] per month out of pocket. Do you have information on manufacturer patient assistance programs? Can you help me apply for drug cost assistance?",
        followUp: "EPO drugs have significant patient assistance programs - facilities should help access."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "Negotiate overall dialysis costs based on Medicare benchmarks.",
        script: "I've reviewed my accumulated dialysis bills totaling $[AMOUNT]. Based on Medicare rates and my financial situation, I'm prepared to settle this balance with a payment of $[30-50% OF BALANCE] as final settlement.",
        escalationScript: "If they refuse: 'I'll continue pursuing formal complaints about pricing and apply for additional assistance programs. Please set up minimum monthly payments.'"
      }
    },
    legalProtections: {
      federal: [
        "Medicare ESRD Entitlement: Medicare covers dialysis for ESRD after 3-month waiting period regardless of age",
        "Medicare Secondary Payer: 30-month coordination period with private insurance",
        "ESRD Treatment Choices Model: New payment model incentivizing home dialysis and transplant"
      ],
      stateExamples: [
        { state: "California", protection: "AB 290: Dialysis clinic staffing requirements and cost transparency." },
        { state: "Ohio", protection: "Medicaid covers dialysis with patient transport assistance." },
        { state: "Most States", protection: "Medicaid covers dialysis with varying patient cost-sharing based on income." }
      ]
    },
    timeline: {
      title: "Dialysis Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request itemized bills for treatment and drugs", "Verify Medicare enrollment if eligible", "Check insurance coordination of benefits", "Ask about facility financial assistance programs"], status: "critical" },
        { day: "Day 8-21", actions: ["Compare charges to Medicare dialysis rates", "Apply for drug manufacturer assistance", "Research home dialysis options", "Apply for Medicaid if income-eligible"], status: "important" },
        { day: "Day 22-45", actions: ["Submit written pricing disputes", "Apply for facility charity care", "Negotiate drug costs based on Medicare ASP", "Explore transplant evaluation if appropriate"], status: "strategic" },
        { day: "Ongoing", actions: ["Monitor bills for ongoing accuracy", "Reapply for assistance programs annually", "Track insurance coordination period", "Stay current on payment plans"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Dialysis Costs Reduced from $4,200/month to $850/month",
        outcome: "Patient on in-center hemodialysis was paying $4,200/month out-of-pocket (high deductible plan). Transitioned to home peritoneal dialysis reducing treatment costs 40%. Drug manufacturer assistance covered EPO costs. Medicare became primary after coordination period further reducing costs.",
        keyTactics: "Home dialysis transition, Medicare coordination, drug manufacturer assistance, facility financial aid"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Dialysis Center Billing", action: "Request itemized bills, dispute excessive charges" },
      { level: 2, entity: "Center Social Worker", action: "Access financial assistance, drug programs" },
      { level: 3, entity: "Regional/Corporate Office", action: "Escalate pricing concerns for DaVita/Fresenius" },
      { level: 4, entity: "Medicare/Medicaid", action: "Ensure proper enrollment and coordination" },
      { level: 5, entity: "State AG/Health Department", action: "Report predatory pricing practices" }
    ]
  },
  {
    id: "home-health-bill",
    title: "Home Health Care Bill",
    icon: BedDouble,
    featured: true,
    situation: "You received home health services (nursing, therapy, aide) and are facing unexpected bills or coverage denials.",
    insiderKnowledge: [
      "Medicare home health has NO copay or deductible for covered services - you shouldn't owe anything",
      "Home health must be 'skilled' to be covered - custodial care alone (bathing, dressing) isn't covered",
      "The home health agency must be Medicare-certified for Medicare to pay",
      "Private duty nursing is different from home health nursing - different coverage rules",
      "If you were hospitalized first, transitional home health may be covered at 100%",
      "Physical, occupational, and speech therapy at home should have same coverage as outpatient",
      "Some agencies bill patients improperly for covered Medicare services",
      "Medical equipment and supplies used during home health visits should be included",
      "24-hour care is rarely covered - most insurance covers intermittent visits only",
      "Long-term care insurance may cover what Medicare and health insurance don't"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "G0299", description: "Skilled nursing home health visit (Medicare)" },
        { code: "G0300", description: "Skilled nursing per diem (Medicare)" },
        { code: "G0151", description: "PT home health visit" },
        { code: "G0152", description: "OT home health visit" },
        { code: "Revenue Code 0551", description: "Skilled nursing visit" }
      ],
      redFlags: [
        "Patient bill for services that Medicare should cover at 100%",
        "Private pay rate charged when Medicare-covered services were provided",
        "Custodial care billed at skilled care rates",
        "Supplies billed separately when included in home health benefit",
        "Visit charges for phone calls or administrative tasks"
      ],
      unbundlingSchemes: [
        "Billing wound care supplies separately when included in nursing visit",
        "Separate charges for travel time in addition to visit time",
        "Billing aide services at nursing rates",
        "Separate 'care coordination' fees for covered services"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Medicare Coverage Verification",
        approach: "Medicare home health has NO copay. Any patient bill may be improper.",
        script: "I believe Medicare should cover these home health services. I'm receiving bills for home health nursing and therapy that I believe should be covered by Medicare. I'm homebound, I need skilled services, and the agency is Medicare-certified. Can you verify that claims were submitted correctly to Medicare?",
        followUp: "Medicare home health has no copay - any patient billing for covered services is improper."
      },
      disputeCall: {
        title: "Skilled vs. Custodial Clarification",
        approach: "Only skilled services are covered. Verify what was actually provided.",
        script: "I need to understand which services are considered skilled versus custodial. I'm being billed for services that seem to be custodial care (bathing, dressing assistance). However, my skilled nursing visits include wound care and medication management. Can you clarify which services should be covered as skilled care?",
        escalationScript: "If they insist services were custodial: 'Please provide documentation showing the level of care provided. Skilled care includes teaching, assessment, and complex treatments.'"
      },
      financialAssistance: {
        title: "Post-Hospitalization Coverage",
        approach: "Home health after hospitalization should be covered at 100% with no copay.",
        script: "I received home health after a hospital stay and shouldn't have copays. Following my hospitalization, I received skilled home health services. Under Medicare, home health after hospitalization should be covered at 100% with no copay. Why am I receiving a patient bill for these services?",
        followUp: "Medicare home health has no cost-sharing for beneficiaries - push back firmly."
      },
      settlementOffer: {
        title: "Billing Fraud Report",
        approach: "If being billed for Medicare-covered services, this may constitute fraud.",
        script: "I've confirmed that these home health services should be covered by Medicare at 100%. Billing patients for covered Medicare services is improper. Please remove these charges immediately or I will file a complaint with Medicare and the OIG.",
        escalationScript: "If they refuse: 'I'm filing a complaint with the Medicare Administrative Contractor and the OIG Fraud Hotline. This billing practice appears to violate Medicare rules.'"
      }
    },
    legalProtections: {
      federal: [
        "Medicare Home Health Benefit: No copay, no deductible for covered home health services",
        "Home Health Value-Based Purchasing: Quality incentives for home health agencies",
        "Patient-Driven Groupings Model: New Medicare payment model for home health (2020+)"
      ],
      stateExamples: [
        { state: "California", protection: "Medi-Cal covers additional home care for eligible patients beyond Medicare." },
        { state: "New York", protection: "Extensive Medicaid personal care and home health coverage." },
        { state: "Most States", protection: "Medicaid waiver programs may cover long-term home care not covered by Medicare." }
      ]
    },
    timeline: {
      title: "Home Health Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Request itemized bill with service dates and codes", "Verify home health agency is Medicare-certified", "Check Medicare Summary Notice for coverage determination", "Identify if services are skilled vs. custodial"], status: "critical" },
        { day: "Day 8-21", actions: ["Compare billed services to what was actually provided", "Verify no improper patient billing for Medicare-covered services", "Check if supplies were included or billed separately", "Review agency's Medicare certification status"], status: "important" },
        { day: "Day 22-40", actions: ["Submit written dispute for improper billing", "File Medicare complaint if agency billed patient for covered services", "Apply for Medicaid if additional custodial care needed", "Explore long-term care insurance coverage"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on disputes and complaints", "Finalize any payment arrangements", "Document all communications", "Report billing fraud to OIG if confirmed"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Home Health Bills of $6,400 Eliminated",
        outcome: "Patient was billed $6,400 for 8 weeks of home health nursing and PT after hip replacement. Investigation revealed agency was Medicare-certified and services were skilled care. Claims had been denied due to coding error. After correction and resubmission, Medicare paid 100% and patient owed nothing.",
        keyTactics: "Medicare coverage verification, skilled care documentation, claim correction request"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Home Health Agency Billing", action: "Request itemized bill, verify Medicare submission" },
      { level: 2, entity: "Medicare Administrative Contractor", action: "Verify coverage determination, request claim review" },
      { level: 3, entity: "Medicare Ombudsman", action: "File complaint about improper patient billing" },
      { level: 4, entity: "State Health Department", action: "Report agency licensure concerns" },
      { level: 5, entity: "OIG Fraud Hotline", action: "Report Medicare fraud if agency billing patients for covered services" }
    ]
  },
  {
    id: "pathology-bill",
    title: "Pathology/Biopsy Bill",
    icon: Scan,
    featured: true,
    situation: "You had a biopsy or tissue sample taken and received separate, unexpectedly high bills from the pathology laboratory.",
    insiderKnowledge: [
      "Pathology services often involve multiple bills - hospital/surgeon for collection AND pathologist for interpretation",
      "Pathology can be sent to out-of-network labs without your knowledge - surprise billing applies",
      "The same pathology interpretation can cost 5-10x more at hospital-based labs vs. independent labs",
      "Multiple 'levels' of interpretation may be billed when only one was needed",
      "Technical vs. professional component billing can result in duplicate charges",
      "Special stains and molecular testing add significant costs - verify medical necessity",
      "Second opinions on pathology are covered by most insurance and sometimes identify overtreatment",
      "Some biopsies trigger 'reflex' testing that adds costs without explicit patient consent",
      "Academic medical center pathologists may bill differently than community labs",
      "Frozen section (intraoperative) billing is separate from permanent section"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "88305", description: "Surgical pathology, gross and microscopic (Level IV)" },
        { code: "88307", description: "Surgical pathology, gross and microscopic (Level V)" },
        { code: "88342", description: "Immunohistochemistry (special stains)" },
        { code: "88360/88361", description: "Morphometric analysis (tumor quantification)" },
        { code: "Modifier 26", description: "Professional component only" },
        { code: "Modifier TC", description: "Technical component only" }
      ],
      redFlags: [
        "Multiple high-level pathology codes for single specimen",
        "Both technical and professional components billed by same entity (should be global)",
        "Numerous immunohistochemistry codes when standard H&E was sufficient",
        "Out-of-network pathology lab when hospital/surgery center was in-network",
        "Consultation code (88321-88325) when no second opinion was requested"
      ],
      unbundlingSchemes: [
        "Billing multiple pathology levels for a single specimen type",
        "Separate charges for 'gross examination' when bundled with microscopic",
        "Billing both global AND component codes for same service",
        "Separate 'specimen handling' fees when included in pathology code"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Surprise Pathology Billing",
        approach: "No Surprises Act protects you from out-of-network pathology at in-network facilities.",
        script: "I received care at an in-network facility but the pathologist was out-of-network. My procedure was at [in-network facility] but the pathology was read by an out-of-network lab, resulting in a $[X] balance bill. Under the No Surprises Act, I'm protected from balance billing for ancillary services at in-network facilities. Please adjust my responsibility to in-network cost-sharing.",
        followUp: "File No Surprises Act complaint if they refuse to adjust."
      },
      disputeCall: {
        title: "Excessive Stain/Testing Challenge",
        approach: "Multiple immunohistochemistry stains add significant cost. Verify necessity.",
        script: "I'm questioning the medical necessity of all the tests performed. I see [X] immunohistochemistry stains were performed at $[Y] each for a total of $[Z]. Can you explain the clinical necessity of each stain? Was this level of testing required for diagnosis, or was it reflexive/research-related?",
        escalationScript: "If they can't justify each test: 'Please provide written documentation from the pathologist explaining why each test was medically necessary. I'll dispute any tests that lack justification.'"
      },
      financialAssistance: {
        title: "Duplicate Component Billing",
        approach: "Technical and professional components should be billed globally or by separate entities.",
        script: "I may have been billed twice for the same pathology service. I received bills from both the hospital lab and a pathologist for what appears to be the same pathology interpretation. Can you clarify whether these are separate services or if this represents duplicate billing for technical and professional components?",
        followUp: "Technical and professional should either be billed globally or by separate entities."
      },
      settlementOffer: {
        title: "Fair Market Price Negotiation",
        approach: "Compare to Medicare Clinical Lab Fee Schedule for fair pricing.",
        script: "I've reviewed the pathology charges and compared them to the Medicare Clinical Lab Fee Schedule. The fair market value for these services is $[X], but I'm being charged $[Y]. I'm willing to pay $[fair amount] which reflects appropriate pricing for pathology services.",
        escalationScript: "If they refuse: 'I'll continue pursuing formal complaints including No Surprises Act violations. Please set up minimum payments while this is resolved.'"
      }
    },
    legalProtections: {
      federal: [
        "No Surprises Act: Pathology at in-network facility is protected from balance billing",
        "Medicare Clinical Lab Fee Schedule: Benchmark pricing for pathology services",
        "CLIA Requirements: Labs must meet quality standards - can dispute non-compliant lab charges"
      ],
      stateExamples: [
        { state: "California", protection: "AB 72: Strong protection against out-of-network pathology billing at in-network facilities." },
        { state: "New York", protection: "Surprise bill law includes pathology services. Independent dispute resolution available." },
        { state: "Texas", protection: "SB 1264: Comprehensive surprise billing protection includes ancillary services like pathology." }
      ]
    },
    timeline: {
      title: "Pathology Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Identify all billing entities (hospital, lab, pathologist)", "Request itemized bills with CPT codes from each", "Verify network status of pathology lab", "Check for duplicate technical/professional billing"], status: "critical" },
        { day: "Day 8-21", actions: ["Compare pathology charges to Medicare Clinical Lab Fee Schedule", "Review for excessive or medically unnecessary testing", "Identify any unbundling issues", "Check if special stains were clinically indicated"], status: "important" },
        { day: "Day 22-40", actions: ["File No Surprises Act complaint if out-of-network", "Submit written dispute for excessive charges", "Request pathologist documentation for each test", "Negotiate based on fair market pricing"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on disputes and complaints", "Finalize any payment arrangements", "Document all communications", "Report suspected fraud if billing issues confirmed"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Pathology Bill Reduced from $3,200 to $480",
        outcome: "Patient had breast biopsy at in-network surgery center but pathology was sent to out-of-network lab. Filed No Surprises Act complaint for the $2,400 balance bill. Additionally, challenged 8 immunohistochemistry stains when only 3 were clinically indicated. Final bill adjusted to in-network rate for necessary services only.",
        keyTactics: "No Surprises Act complaint, immunohistochemistry necessity challenge, Medicare fee schedule comparison"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Pathology Lab Billing", action: "Request itemized bill, dispute excessive testing" },
      { level: 2, entity: "Referring Physician", action: "Request clarification on tests ordered" },
      { level: 3, entity: "Insurance Company", action: "Appeal out-of-network charges, file No Surprises complaint" },
      { level: 4, entity: "CMS No Surprises Help Desk", action: "File federal surprise billing complaint" },
      { level: 5, entity: "State Clinical Lab Licensing Board", action: "Report billing fraud or quality concerns" }
    ]
  },
  {
    id: "outpatient-surgery-bill",
    title: "Outpatient/Ambulatory Surgery Center Bill",
    icon: Scissors,
    featured: true,
    situation: "You had surgery at an ambulatory surgery center (ASC) or hospital outpatient department and received multiple confusing bills.",
    insiderKnowledge: [
      "The SAME surgery costs 40-60% less at an ASC than at a hospital outpatient department",
      "Hospital outpatient departments (HOPDs) charge facility fees that ASCs cannot charge",
      "You'll receive separate bills from facility, surgeon, anesthesiologist - plan for 3+ bills",
      "Surgeon's 'global period' includes some follow-up visits for 10-90 days - shouldn't be billed separately",
      "ASC rates are capped by Medicare - use as negotiation benchmark",
      "Some surgeries done at hospitals could have been done at lower-cost ASCs",
      "Pre-op testing should be recent enough to use - repeat testing may be unnecessary billing",
      "Recovery room time is included in facility fee - should not be billed separately",
      "Surgical supplies (implants, mesh, hardware) have extreme markups at hospitals",
      "Second opinions before elective surgery are covered and can prevent unnecessary procedures"
    ],
    billForensics: {
      commonCptCodes: [
        { code: "Surgery CPT (10000-69999)", description: "Surgical procedure codes by body system" },
        { code: "Revenue Code 0360", description: "Operating room services" },
        { code: "Revenue Code 0490", description: "Ambulatory surgery" },
        { code: "G0463", description: "Hospital outpatient clinic visit (facility fee - HOPD only)" },
        { code: "Modifier 50", description: "Bilateral procedure" }
      ],
      redFlags: [
        "Hospital facility fees for outpatient surgery that could be done at ASC",
        "Surgeon billing follow-up visits within global period (10-90 days post-op)",
        "Separate recovery room charges when included in facility fee",
        "Implant/device charges far exceeding fair market or Medicare rates",
        "Pre-op testing duplicated when recent results were available"
      ],
      unbundlingSchemes: [
        "Billing surgical tray/supplies separately when bundled with procedure",
        "Separate charges for surgical dressings included in procedure",
        "Billing wound closure separately when included in primary surgery code",
        "Separate 'surgical observation' charges included in facility fee"
      ]
    },
    negotiationPlaybooks: {
      initialCall: {
        title: "Site of Service Pricing",
        approach: "Hospital outpatient surgery costs 40-60% more than ASCs. Use ASC rates as benchmark.",
        script: "I'd like to understand why my surgery cost so much more than at an ASC. My outpatient surgery at this hospital facility cost $[X]. The same procedure at an ambulatory surgery center costs $[Y]. I wasn't informed this hospital outpatient department would cost significantly more. Can you match competitive ASC pricing?",
        followUp: "Use CMS ASC payment rates as benchmark - typically 40-60% of HOPD rates."
      },
      disputeCall: {
        title: "Global Period Billing Dispute",
        approach: "Post-op visits within the global period should be included in surgical fee.",
        script: "I'm being billed for follow-up visits that should be included in surgical global. My surgery was performed on [date] and I'm being billed for follow-up visits on [dates]. Under Medicare's global surgery rules (which most insurers follow), routine post-op visits within [X] days are included in the surgical fee. Please remove these charges.",
        escalationScript: "If they refuse: 'Check CMS global surgery days for procedure code [XXXXX]. These post-op visits fall within the global period and should be removed.'"
      },
      financialAssistance: {
        title: "Implant/Device Cost Challenge",
        approach: "Surgical implants have extreme markups. Compare to fair market or Medicare pricing.",
        script: "The charges for surgical implants seem excessive. I'm being charged $[X] for [implant/hardware] when fair market pricing is $[Y]. This represents a [Z]% markup. Can you provide documentation of your acquisition cost and explain this pricing? I'd like this adjusted to a reasonable amount.",
        followUp: "Many device manufacturers publish suggested pricing - use as benchmark."
      },
      settlementOffer: {
        title: "Settlement Negotiation",
        approach: "After addressing specific issues, negotiate overall surgery costs.",
        script: "I've reviewed the adjusted balance after our discussions about site of service, global period billing, and implant costs. I'm prepared to settle all surgery-related bills with a payment of $[30-50% OF BALANCE] as final settlement.",
        escalationScript: "If they refuse: 'I'll continue pursuing formal disputes and apply for financial assistance. Please set up minimum monthly payments.'"
      }
    },
    legalProtections: {
      federal: [
        "No Surprises Act: Protects against balance billing from out-of-network surgeons/anesthesiologists at in-network facilities",
        "Good Faith Estimate: Uninsured patients entitled to pre-surgery cost estimate",
        "Medicare ASC Payment: Benchmark for fair pricing of outpatient surgical procedures"
      ],
      stateExamples: [
        { state: "California", protection: "AB 72: Out-of-network ancillary providers at in-network facility must accept in-network rates." },
        { state: "New York", protection: "Surprise bill law with strong protection for outpatient surgery. IDR available." },
        { state: "Texas", protection: "SB 1264: Comprehensive surprise billing protection for outpatient surgical services." }
      ]
    },
    timeline: {
      title: "Outpatient Surgery Bill Action Timeline",
      checkpoints: [
        { day: "Day 1-7", actions: ["Collect all bills (facility, surgeon, anesthesia, others)", "Request itemized statement from each billing entity", "Verify network status of all providers", "Identify the global period for your surgery"], status: "critical" },
        { day: "Day 8-21", actions: ["Compare facility charges to ASC benchmark rates", "Check for follow-up visits incorrectly billed within global period", "Verify implant/device pricing against fair market", "Identify any unbundling or duplicate charges"], status: "important" },
        { day: "Day 22-40", actions: ["Submit written disputes for overcharges", "File No Surprises Act complaints for out-of-network balance bills", "Negotiate facility fees based on ASC rates", "Apply for financial assistance if needed"], status: "strategic" },
        { day: "Day 41-60", actions: ["Follow up on disputes", "Finalize payment arrangements", "Ensure global period visits aren't future-billed", "Document all communications"], status: "resolution" }
      ]
    },
    successStories: [
      {
        title: "Outpatient Knee Surgery Bill Cut from $42,000 to $18,500",
        outcome: "Patient had arthroscopic knee surgery at hospital outpatient department. Challenged $8,000 in implant charges (Medicare pays ~$2,500), identified $3,500 in post-op visits billed within 90-day global period, and negotiated facility fee based on ASC rates. Total reduction of 56%.",
        keyTactics: "ASC rate comparison, global period enforcement, implant pricing challenge, No Surprises Act for anesthesia"
      }
    ],
    escalationPath: [
      { level: 1, entity: "Facility Billing", action: "Request itemized bill, dispute facility fees" },
      { level: 2, entity: "Surgeon's Billing", action: "Dispute post-op billing within global period" },
      { level: 3, entity: "Insurance Company", action: "Appeal, request out-of-network protection" },
      { level: 4, entity: "CMS No Surprises Help Desk", action: "File surprise billing complaint" },
      { level: 5, entity: "State AG/Insurance Commissioner", action: "Report pricing practices, surprise billing violations" }
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
                    Hospital Bill Playbook
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Act NOW before your bill goes to collections. Reduce hospital bills by 40-70% with insider strategies and step-by-step guides.
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

            {/* Mobile Quick Actions - Fast access on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="md:hidden mb-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Quick Actions - Start Here
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 text-xs border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    onClick={() => setShowChatbot(true)}
                  >
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    <span>AI Help</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 text-xs border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => document.getElementById('insider-secrets')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    <span>Secrets</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 text-xs border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => document.getElementById('bill-scenarios')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Receipt className="h-5 w-5 text-blue-600" />
                    <span>My Bill Type</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    onClick={() => document.getElementById('first-steps')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <FileText className="h-5 w-5 text-amber-600" />
                    <span>First Steps</span>
                  </Button>
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

            {/* First Steps Section */}
            <motion.div
              id="first-steps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-10"
            >
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                    <Target className="h-6 w-6" />
                    Your First 3 Steps (Do These TODAY)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Request Itemized Bill</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Call billing and say: "I need an itemized bill with CPT codes for all charges." This reveals errors.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Ask About Financial Assistance</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Say: "Do you have a financial assistance or charity care application?" Apply even if you think you won't qualify.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Ask About Discounts</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Say: "What is your prompt-pay or cash-pay discount if I pay today/this month?" Get it in writing before paying.</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      IMPORTANT: Never pay anything until you've received and reviewed the itemized bill. Partial payments can waive your dispute rights.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Insider Secrets Section */}
            <motion.div
              id="insider-secrets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{insiderSecrets.length} Insider Secrets Hospitals Don't Want You to Know</h2>
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
              id="bill-scenarios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Bill Type for Specific Guidance</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tap any bill type for step-by-step scripts, templates, and insider tactics</p>
                </div>
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

        {/* Sticky Mobile Action Banner */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-gradient-to-r from-emerald-600 to-green-700 text-white py-3 px-4 shadow-lg z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Ready to reduce your bill?</span>
            </div>
            <Button 
              size="sm"
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold"
              onClick={() => setShowChatbot(true)}
            >
              Get AI Help
            </Button>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    </>
  );
}
