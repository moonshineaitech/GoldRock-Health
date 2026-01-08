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
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const insiderSecrets = [
  {
    title: "Collections agencies buy debt for pennies",
    secret: "Medical debt is typically sold to collection agencies for 4-7 cents on the dollar. This means a $10,000 bill was purchased for $400-$700. They have MASSIVE room to negotiate.",
    actionable: "Never pay full price to a collections agency. Start your offer at 20% of the original bill and negotiate from there."
  },
  {
    title: "The 'Pay for Delete' strategy works",
    secret: "Collection agencies can remove the negative mark from your credit report in exchange for payment. They won't offer this - you have to ask.",
    actionable: "Always request 'pay for delete' in writing BEFORE making any payment. Get their agreement in writing before sending money."
  },
  {
    title: "Statute of limitations varies by state",
    secret: "Medical debt has a statute of limitations (3-6 years in most states). After this period, they cannot sue you for the debt, though they may still try to collect.",
    actionable: "Research your state's statute of limitations. Never make a payment on old debt without understanding the implications - a payment can reset the clock."
  },
  {
    title: "HIPAA violations are leverage",
    secret: "Collection agencies often violate HIPAA by discussing medical details with unauthorized parties. This is a federal violation with serious penalties.",
    actionable: "Document any instance where a collector discusses your medical condition or treatment. This can be used to negotiate debt dismissal."
  },
  {
    title: "Validation letters are your secret weapon",
    secret: "Under the FDCPA, you have 30 days to request debt validation. Many collection agencies cannot provide proper documentation and must stop collection.",
    actionable: "ALWAYS send a debt validation letter within 30 days of first contact. Demand itemized bills, proof of assignment, and license to collect in your state."
  },
  {
    title: "Hospital billing departments have settlement authority",
    secret: "Hospital billing managers typically have authority to settle debts for 40-60% without supervisor approval. Financial counselors can often go lower.",
    actionable: "Ask to speak with a billing supervisor or financial counselor, not a regular collections representative. They have more power to negotiate."
  }
];

const collectionsScenarios = [
  {
    id: "childbirth-collections",
    title: "Childbirth Bill Sent to Collections",
    icon: Baby,
    situation: "You had a baby and received a bill for $15,000-$50,000+. Despite making good-faith payment attempts or disputing charges, the hospital sent the bill to collections.",
    insiderKnowledge: [
      "Hospitals are REQUIRED to screen you for charity care before sending to collections under most state laws and the Affordable Care Act",
      "Many states have 'surprise billing' protections specifically for maternity care",
      "Itemized bills for childbirth frequently contain duplicate charges, unbundled services, and phantom charges",
      "NICU charges are the most commonly inflated - demand documentation for every day of NICU care"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Request Itemized Bill from Hospital (Not Collections)",
        details: "Contact the hospital's billing department directly. Request a fully itemized bill with CPT codes, not a summary. Under federal law, they must provide this within 30 days.",
        script: "I'm calling regarding account [number]. I need a complete itemized bill with all CPT codes, HCPCS codes, and individual charges. Please send this to me within 30 days as required by federal regulations."
      },
      {
        step: 2,
        title: "Send Debt Validation Letter to Collections Agency",
        details: "Within 30 days of first contact, send a certified letter demanding validation. This legally stops collection activity until they provide proof.",
        script: "Under the Fair Debt Collection Practices Act, I am requesting validation of this debt. Please provide: 1) The original creditor name and address, 2) The amount owed with itemization, 3) Proof this debt is mine, 4) Your license to collect in [state]. Do not contact me again until this validation is complete."
      },
      {
        step: 3,
        title: "Audit the Itemized Bill for Errors",
        details: "Childbirth bills commonly contain: duplicate charges for same service, unbundled charges (charging separately for things that should be bundled), charges for services not rendered, inflated supply costs.",
        redFlags: ["'Mucus extraction' charges for normal suctioning", "Separate charges for epidural placement AND medication", "Nursery charges while baby was in room", "Lactation consultant charges you never saw", "Multiple 'skin-to-skin' charges"]
      },
      {
        step: 4,
        title: "File Hospital Charity Care Application",
        details: "Even with the debt in collections, you can still apply for charity care. Hospitals must consider these applications and often will recall debt from collections.",
        requirement: "Request the charity care application in writing. Hospitals must provide this under ACA regulations."
      },
      {
        step: 5,
        title: "Negotiate with Collections - Start at 20%",
        details: "Collections agencies typically pay 4-7 cents on the dollar for medical debt. Offer 20% of the original bill as a starting point.",
        script: "I'm prepared to settle this account today for [20% of bill]. I'll need this agreement in writing, including confirmation that you'll report this to credit bureaus as 'paid in full' and provide a deletion letter within 30 days of payment."
      },
      {
        step: 6,
        title: "Get Everything in Writing Before Payment",
        details: "NEVER pay based on a phone promise. Get the settlement agreement, pay-for-delete commitment, and payment terms in writing before sending any money."
      }
    ],
    expectedOutcome: "40-70% reduction in total bill, removal from credit report, no further collection activity"
  },
  {
    id: "childbirth-insurance-kickoff",
    title: "Childbirth Bill After Being Kicked Off Insurance",
    icon: Heart,
    situation: "You were pregnant and insured, but your insurance was terminated (often due to employer error, administrative mistake, or failure to pay premium during leave). Now you have a massive uninsured childbirth bill in collections.",
    insiderKnowledge: [
      "Pregnancy is a 'qualifying life event' that triggers special enrollment rights - your coverage should have been extended",
      "COBRA continuation coverage is RETROACTIVE - you can elect it up to 60 days after termination",
      "If terminated due to employer error, the employer may be liable for the entire medical bill",
      "Many states have specific protections for pregnant women losing coverage",
      "Hospitals cannot charge uninsured patients more than they'd accept from insurance companies (No Surprises Act)"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Determine WHY Coverage Was Terminated",
        details: "Contact your former insurance company and employer HR. Get documentation of the termination reason. Common wrongful terminations include: employer failed to remit premiums, administrative error, FMLA/leave confusion.",
        script: "I need documentation showing the exact reason and date my coverage was terminated, and who initiated the termination. Please provide this in writing within 10 business days."
      },
      {
        step: 2,
        title: "Explore COBRA Retroactive Election",
        details: "You have 60 days from coverage termination to elect COBRA, and coverage is RETROACTIVE to the termination date. Yes, you'll owe back premiums, but it's often far less than the medical bills.",
        calculation: "If monthly premium is $600 and you have $40,000 in bills, paying 3-6 months of COBRA ($1,800-$3,600) to get coverage is a massive savings."
      },
      {
        step: 3,
        title: "File Complaint with State Insurance Commissioner",
        details: "If termination was wrongful, file a formal complaint. State insurance departments have enforcement power and can order reinstatement of coverage.",
        includeInComplaint: ["Timeline of events", "All correspondence", "Documentation of payment history", "Evidence of wrongful termination"]
      },
      {
        step: 4,
        title: "Request Hospital Self-Pay Discount",
        details: "Under the No Surprises Act, hospitals must offer uninsured patients the same rates they'd accept from insurance companies - often 40-60% less than 'chargemaster' rates.",
        script: "I'm an uninsured patient and I'm requesting the self-pay/uninsured discount as required under the No Surprises Act. I also need to know what rate you would accept from a major insurance company for these same services."
      },
      {
        step: 5,
        title: "Apply for Retroactive Medicaid",
        details: "Many states allow Medicaid applications that cover bills from the past 3 months. If you were income-eligible during pregnancy, you may qualify for retroactive coverage.",
        pregnancyNote: "Pregnant women often qualify for Medicaid at higher income thresholds (up to 200%+ of federal poverty level in many states)."
      },
      {
        step: 6,
        title: "Pursue Employer Liability if Applicable",
        details: "If your employer failed to properly maintain coverage or made administrative errors, they may be legally liable for resulting medical bills. Document everything and consult an employment attorney.",
        warningSign: "If HR tells you 'we forgot to send your premiums' or 'there was a paperwork error,' this is strong evidence of employer liability."
      },
      {
        step: 7,
        title: "Negotiate Aggressively with Collections",
        details: "Armed with evidence of wrongful termination or pending appeals, you have leverage. Collections agencies know these cases are complicated.",
        script: "This debt is currently under dispute due to wrongful insurance termination. I have filed a complaint with the state insurance commissioner and am pursuing COBRA retroactive election. I'm willing to settle for [15-25%] to resolve this matter, but I will not pay the full amount while my appeals are pending."
      }
    ],
    expectedOutcome: "Potential full coverage restoration, 50-80% reduction, or debt dismissal depending on circumstances"
  },
  {
    id: "emergency-room-collections",
    title: "Emergency Room Bill in Collections",
    icon: Stethoscope,
    situation: "You went to the ER for an emergency and received a bill for thousands of dollars. You didn't have insurance or your insurance denied coverage. Now the bill is in collections.",
    insiderKnowledge: [
      "EMTALA requires ERs to treat you regardless of ability to pay - they cannot refuse treatment or demand payment upfront",
      "ER bills are the MOST inflated in healthcare - markups of 400-1000% are common",
      "Facility fees (the charge for using the ER space) are often more than the actual medical care",
      "Out-of-network ER physicians are now protected under the No Surprises Act",
      "ERs frequently use 'observation status' instead of 'admission' to maximize billing - this affects your coverage"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Request Complete Medical Records and Itemized Bill",
        details: "You need both the itemized bill AND your medical records to verify charges match services actually received.",
        whatToLookFor: ["Length of stay documentation", "All procedures performed", "Medications administered", "Specialist consultations"]
      },
      {
        step: 2,
        title: "Verify Your Status Was Correct",
        details: "'Observation' status vs 'Inpatient admission' dramatically affects your coverage and out-of-pocket costs. If you were in the ER overnight, you may have been wrongly classified.",
        challenge: "Request a status review if you believe you should have been admitted as inpatient. This can change insurance coverage retroactively."
      },
      {
        step: 3,
        title: "Apply No Surprises Act Protections",
        details: "If you received care from out-of-network providers at an in-network facility, or had emergency care, the No Surprises Act limits what you can be charged.",
        script: "I'm invoking my rights under the No Surprises Act. Please provide a good faith estimate and adjust my bill to reflect the in-network rate for these emergency services."
      },
      {
        step: 4,
        title: "Compare Prices to Fair Market Value",
        details: "Use CMS Fair Health Consumer or Healthcare Bluebook to find what procedures should cost. ER charges are often 5-10x fair market value.",
        leverage: "When negotiating, cite specific fair market prices: 'A CT scan has a fair market value of $500-$800. You charged $4,500. I'm requesting an adjustment to fair market rates.'"
      },
      {
        step: 5,
        title: "Request Financial Hardship Consideration",
        details: "Most hospitals have financial assistance programs. Even with the debt in collections, hospitals often recall debts when patients apply for assistance.",
        income_thresholds: "Many hospitals offer 100% charity care for income up to 200% FPL, and sliding scale up to 400% FPL."
      },
      {
        step: 6,
        title: "Negotiate with Collections - ER Debts Have High Margins",
        details: "Because ER bills are so inflated, collections agencies know these debts are disputed more often. They're often willing to settle for 15-25% of the inflated bill.",
        script: "The original bill of [amount] reflects significant overcharging beyond fair market rates. I've documented fair market prices for these services at [lower amount]. I'm prepared to pay [20-30%] of the original bill to settle this account in full today."
      }
    ],
    expectedOutcome: "50-75% reduction through fair market value adjustment and settlement negotiation"
  },
  {
    id: "surgery-collections",
    title: "Surgical Procedure Bill in Collections",
    icon: Building2,
    situation: "You had a scheduled or emergency surgery. Despite having insurance, you received massive bills for out-of-network anesthesiologists, assistant surgeons, or pathologists. Your insurance only covered part, and now the balance is in collections.",
    insiderKnowledge: [
      "Surprise billing from out-of-network providers during in-network surgeries is now ILLEGAL under the No Surprises Act",
      "Anesthesiologists and assistant surgeons often bill separately - and bill outrageously",
      "Many 'assistant surgeon' charges are for services that weren't medically necessary",
      "Operating room time charges are often padded - always verify against actual surgery duration",
      "Implants and supplies have markups of 200-500% - demand itemization"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Obtain Complete Surgical Records",
        details: "Request operative notes, anesthesia records, and time logs. These show exactly how long surgery took and who was present.",
        critical: "Operating room time should match the anesthesia start/stop times. If you're charged for 4 hours but surgery was 2 hours, dispute it."
      },
      {
        step: 2,
        title: "Invoke No Surprises Act for Out-of-Network Providers",
        details: "If you had surgery at an in-network facility but received bills from out-of-network anesthesiologists, pathologists, or assistant surgeons, you're protected.",
        script: "Under the No Surprises Act, I cannot be balance billed for out-of-network services provided at an in-network facility. Please adjust this bill to reflect my in-network cost-sharing amount only."
      },
      {
        step: 3,
        title: "Challenge 'Assistant Surgeon' Necessity",
        details: "Many surgeries don't require an assistant surgeon, or a PA/NP can serve this role at lower cost. If you were charged for an assistant, verify it was medically necessary.",
        question: "Was an assistant surgeon medically necessary for this procedure? Please provide documentation supporting this medical necessity."
      },
      {
        step: 4,
        title: "Audit Implant and Supply Charges",
        details: "Hospitals mark up implants 200-500%. If you had any hardware placed (screws, plates, mesh), research the manufacturer's price.",
        example: "A knee replacement implant that costs the hospital $3,000-$5,000 is often billed at $15,000-$25,000."
      },
      {
        step: 5,
        title: "File Insurance Appeal for Denied Services",
        details: "If your insurance denied any portion, file a formal appeal. Include medical necessity documentation from your surgeon.",
        appealTip: "Request a peer-to-peer review where your surgeon speaks directly with the insurance company's medical director."
      },
      {
        step: 6,
        title: "Negotiate with Multiple Parties",
        details: "Surgical bills often come from multiple providers (hospital, surgeon, anesthesiologist, pathologist). You may need to negotiate separately with each.",
        strategy: "Prioritize negotiating with the largest bill first. Once settled, use that success as leverage with smaller providers."
      }
    ],
    expectedOutcome: "30-60% reduction through No Surprises Act protections, itemization disputes, and negotiation"
  },
  {
    id: "mental-health-collections",
    title: "Mental Health/Substance Abuse Bill in Collections",
    icon: Users,
    situation: "You or a family member received mental health treatment or substance abuse rehabilitation. Insurance denied coverage claiming it wasn't 'medically necessary' or exceeded 'reasonable' treatment limits. Now the bill is in collections.",
    insiderKnowledge: [
      "Mental Health Parity Act REQUIRES insurance to cover mental health the same as physical health - denials often violate this law",
      "Residential treatment facilities often bill at extreme rates - $1,000-$2,000+ per day",
      "Insurance companies routinely deny mental health claims that should be covered - they count on you not appealing",
      "Out-of-network mental health providers can often be covered if no in-network providers are available",
      "Substance abuse treatment has additional protections under the ACA"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Get the Denial in Writing",
        details: "Request the specific reason for denial in writing. Insurance companies must provide this, including the criteria they used to make the decision.",
        keyDocument: "Ask for the 'Clinical Criteria' or 'Medical Policy' they used to deny coverage. This reveals exactly what you need to prove in an appeal."
      },
      {
        step: 2,
        title: "File Mental Health Parity Violation Complaint",
        details: "If your insurance applies stricter standards to mental health than physical health, this violates federal law.",
        examples: ["Requiring prior authorization for mental health but not physical health", "Limiting days of inpatient mental health treatment differently than medical/surgical", "Using different 'medical necessity' criteria"]
      },
      {
        step: 3,
        title: "Appeal with Clinical Documentation",
        details: "Get detailed clinical notes from your treatment provider explaining why treatment was medically necessary. Include: diagnosis severity, failed outpatient treatments, risk assessment.",
        script: "I'm formally appealing the denial of coverage for [treatment type]. Attached is clinical documentation from [provider] demonstrating medical necessity according to [ASAM criteria/APA guidelines]."
      },
      {
        step: 4,
        title: "Request External Review",
        details: "After internal appeal denial, you have the right to an independent external review. An outside medical expert reviews your case.",
        success_rate: "External reviews overturn approximately 40-60% of mental health denials."
      },
      {
        step: 5,
        title: "Apply for Treatment Facility Financial Assistance",
        details: "Many residential treatment facilities, especially non-profits, have significant financial assistance programs.",
        approach: "Contact the facility's billing department directly and explain your situation. Many will settle for 50% or less rather than pursue collections."
      },
      {
        step: 6,
        title: "Explore State-Specific Protections",
        details: "Many states have additional mental health coverage requirements beyond federal law. Research your state's specific protections.",
        resources: "Contact your state insurance commissioner and state mental health advocacy organizations."
      }
    ],
    expectedOutcome: "Insurance appeal success (40-60% of appeals succeed) or 50-70% reduction through facility negotiation"
  },
  {
    id: "ambulance-collections",
    title: "Ambulance/Air Ambulance Bill in Collections",
    icon: AlertCircle,
    situation: "You needed emergency transport and received a bill for $1,000-$50,000+ (ground ambulance can be $1,000-$5,000; air ambulance $20,000-$100,000+). Insurance denied coverage or only paid a fraction. Now the bill is in collections.",
    insiderKnowledge: [
      "Ground ambulance is NOT covered by the No Surprises Act - but many states have passed their own protections",
      "Air ambulance IS covered by the No Surprises Act for most insurance types",
      "Ambulance companies bill 'by the mile' - verify the distance is accurate",
      "Many ambulance charges include 'ALS' (Advanced Life Support) when only 'BLS' (Basic Life Support) was provided",
      "Municipal ambulance services often have better financial assistance than private companies"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Service Level Was Appropriate",
        details: "ALS (Advanced Life Support) costs significantly more than BLS (Basic Life Support). You should only be billed for ALS if you needed advanced interventions.",
        BLS_criteria: "Transport only, basic monitoring, oxygen, first aid",
        ALS_criteria: "IV medications, cardiac monitoring, intubation, advanced interventions"
      },
      {
        step: 2,
        title: "Check Mileage Accuracy",
        details: "Ambulance services bill per mile. Calculate the actual distance from pickup to hospital and compare to the billed mileage.",
        tool: "Use Google Maps to measure the exact distance. If billed mileage is significantly higher, dispute it."
      },
      {
        step: 3,
        title: "Apply State-Specific Protections",
        details: "Many states have passed ambulance balance billing protections. Research your state's laws.",
        states_with_protections: "California, Colorado, Florida, New York, Texas, and others have specific ambulance billing protections."
      },
      {
        step: 4,
        title: "Request Municipal Rate If Applicable",
        details: "If the ambulance was operated by your city or county, you may be entitled to reduced rates for residents.",
        script: "I'm a resident of [city/county]. Please apply the resident rate to my ambulance bill."
      },
      {
        step: 5,
        title: "Apply for Financial Hardship",
        details: "Both private and municipal ambulance services often have financial hardship programs. These can reduce or eliminate the bill.",
        documentation: "Provide proof of income, hardship letter, and any relevant circumstances (job loss, disability, etc.)"
      },
      {
        step: 6,
        title: "For Air Ambulance - Invoke No Surprises Act",
        details: "Air ambulance is covered by the No Surprises Act for most insurance types. You can only be billed your in-network cost-sharing amount.",
        script: "Under the No Surprises Act, I'm requesting that this air ambulance bill be adjusted to my in-network cost-sharing amount. Please provide documentation of the qualifying payment amount."
      }
    ],
    expectedOutcome: "30-50% reduction for ground ambulance; potential full coverage for air ambulance under No Surprises Act"
  }
];

const insuranceKickoffDefense = [
  {
    title: "Wrongful Termination Due to Employer Error",
    description: "Your employer failed to remit premiums, made a paperwork error, or incorrectly reported your status",
    steps: [
      "Request written documentation of termination reason from both employer and insurance",
      "Gather pay stubs showing premium deductions were taken",
      "File complaint with state insurance commissioner",
      "File complaint with Department of Labor if ERISA plan",
      "Demand reinstatement with retroactive coverage",
      "Document all medical bills incurred during wrongful termination",
      "Consult employment attorney about employer liability"
    ],
    remedies: ["Reinstatement of coverage", "Retroactive coverage for all bills", "Employer liability for uncovered costs", "Potential damages for wrongful termination"]
  },
  {
    title: "Non-Payment of Premium During Medical Leave/FMLA",
    description: "Your coverage was terminated while you were on FMLA, disability leave, or recovering from illness",
    steps: [
      "Verify FMLA protections were properly applied",
      "Check if employer continued premium deductions during leave",
      "Confirm employer provided proper COBRA notice",
      "Document the timeline of leave, termination, and notice received",
      "File DOL complaint if FMLA violations occurred",
      "Elect COBRA retroactively if within 60-day window",
      "Apply for continuation of coverage under state law if applicable"
    ],
    remedies: ["FMLA violation remedies including reinstatement", "Retroactive COBRA coverage", "State continuation coverage", "Employer liability for improper termination"]
  },
  {
    title: "Retroactive Rescission of Coverage",
    description: "Insurance company cancelled your policy retroactively, claiming you made misstatements on your application",
    steps: [
      "Request specific documentation of the alleged misstatement",
      "Review your original application for accuracy",
      "Determine if the alleged misstatement was material (would have affected coverage decision)",
      "Check if insurer followed proper rescission procedures (30-day notice, etc.)",
      "File complaint with state insurance commissioner",
      "Appeal the rescission through insurance internal process",
      "Request external review of rescission decision"
    ],
    remedies: ["Rescission reversal if procedures weren't followed", "Continued coverage if misstatement wasn't material", "State insurance commissioner enforcement action"]
  },
  {
    title: "Loss of Dependent Coverage",
    description: "You were dropped from a parent's or spouse's plan unexpectedly",
    steps: [
      "Verify the reason for loss of coverage (age, divorce, employment change)",
      "Confirm you received proper notice (30-60 days depending on circumstance)",
      "Check if this qualifies as a 'qualifying life event' for special enrollment",
      "Apply for marketplace coverage within 60-day special enrollment period",
      "Explore COBRA continuation rights",
      "If divorce-related, ensure coverage terms in divorce decree are enforced"
    ],
    remedies: ["Special enrollment in new plan", "COBRA continuation coverage", "Enforcement of divorce decree coverage requirements"]
  },
  {
    title: "Premium Increase Made Coverage Unaffordable",
    description: "Your premiums increased dramatically, forcing you to drop coverage",
    steps: [
      "Document the premium increase and your inability to pay",
      "Apply for marketplace coverage with premium tax credits",
      "Check eligibility for Medicaid (many states have expanded eligibility)",
      "Explore state-specific programs for the underinsured",
      "If employed, request employer explore alternative plans",
      "Document any gap in coverage for future applications"
    ],
    remedies: ["Subsidized marketplace coverage", "Medicaid enrollment", "CHIP coverage for children", "State-specific assistance programs"]
  },
  {
    title: "Plan Discontinuation or Insurer Exit",
    description: "Your insurance plan was discontinued or your insurer left your market",
    steps: [
      "You must receive at least 90 days notice of plan discontinuation",
      "You have guaranteed issue rights to purchase comparable coverage",
      "Review options for similar plans from same insurer or competitors",
      "Check if this triggers special enrollment period for marketplace",
      "Compare coverage options before automatic enrollment",
      "Document any coverage gaps created by transition"
    ],
    remedies: ["Guaranteed issue rights to comparable coverage", "Special enrollment period for new coverage", "Continuation of care requirements for ongoing treatment"]
  }
];

const debtValidationTemplate = `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Collection Agency Name]
[Collection Agency Address]
[City, State ZIP]

RE: Debt Validation Request
Account Number: [Account Number if known]
Original Creditor: [Hospital/Provider Name if known]
Alleged Amount: [Amount Claimed]

To Whom It May Concern:

I am writing in response to your [letter/call] dated [date] regarding the above-referenced account. I am requesting validation of this debt pursuant to the Fair Debt Collection Practices Act, 15 U.S.C. § 1692g.

Please provide the following:

1. The name and address of the original creditor
2. The amount of the debt, including a breakdown of:
   - Principal amount
   - Interest (and the rate)
   - Fees (and justification for each)
3. A copy of the original signed agreement or contract
4. Verification that you are licensed to collect debts in [Your State]
5. Proof that the statute of limitations has not expired
6. A complete chain of title showing all owners of this debt
7. An itemized statement of all charges from the original creditor
8. Documentation that you have the legal right to collect this debt

Until you provide this validation, you must cease all collection activity on this account. Any continued collection activity without providing this validation will be a violation of the FDCPA.

Additionally, this letter serves as notice that I dispute this debt in its entirety. Please update your records accordingly and notify any credit reporting agencies to which you have reported this debt.

Please respond to this request in writing only. Do not contact me by telephone.

Sincerely,
[Your Signature]
[Your Printed Name]

SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED`;

const payForDeleteTemplate = `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Collection Agency Name]
[Collection Agency Address]
[City, State ZIP]

RE: Pay for Delete Offer
Account Number: [Account Number]
Original Creditor: [Hospital/Provider Name]
Alleged Amount: [Amount Claimed]

To Whom It May Concern:

I am writing to offer a settlement on the above-referenced account. I am prepared to pay [OFFER AMOUNT - typically 20-40% of alleged debt] as full and final settlement of this account.

This offer is contingent upon the following conditions:

1. Upon receipt of payment, you will:
   a. Consider this account paid in full and settled
   b. Delete all references to this account from all credit reporting agencies (Equifax, Experian, TransUnion) within 30 days
   c. Provide me with written confirmation of deletion

2. You will not sell, transfer, or assign any remaining balance to another entity

3. This payment is made without admission of liability for the alleged debt

If you agree to these terms, please sign below and return a copy to me. Upon receipt of the signed agreement, I will submit payment via [cashier's check/money order].

This offer is valid for 30 days from the date of this letter.

AGREED AND ACCEPTED:

Collection Agency Representative: _____________________
Print Name: _____________________
Title: _____________________
Date: _____________________

Sincerely,
[Your Signature]
[Your Printed Name]

SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED`;

export default function CollectionsDefenseGuide() {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  return (
    <>
      <SEOHead
        title="Medical Debt Collections Defense Guide - Insider Strategies | GoldRock Health"
        description="Comprehensive guide to fighting medical debt in collections. Insider knowledge on negotiating hospital bills, defending against wrongful insurance termination, and protecting your rights."
        keywords={["medical debt collections", "hospital bill negotiation", "debt validation", "medical bill reduction", "insurance termination defense", "collections negotiation"]}
        canonicalPath="/collections-defense-guide"
      />

      <MobileHeader title="Collections Defense" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 mb-4">
              Industry Insider Knowledge
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Medical Debt Collections Defense
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The secrets hospitals, insurance companies, and collection agencies don't want you to know. 
              Actionable strategies to reduce or eliminate medical debt in collections.
            </p>
          </motion.div>

          {/* Insider Secrets Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-amber-600" />
              Industry Secrets They Don't Want You to Know
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insiderSecrets.map((secret, index) => (
                <motion.div
                  key={secret.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700 h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{secret.title}</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{secret.secret}</p>
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          <strong>Action:</strong> {secret.actionable}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Collections Scenarios Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Specific Collections Scenarios & Step-by-Step Defense
            </h2>
            
            <div className="space-y-4">
              {collectionsScenarios.map((scenario, index) => {
                const IconComponent = scenario.icon;
                const isExpanded = expandedScenario === scenario.id;
                
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden">
                      <button
                        className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                        data-testid={`scenario-${scenario.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{scenario.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{scenario.situation}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-5 space-y-6">
                            {/* Situation */}
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                The Situation
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300">{scenario.situation}</p>
                            </div>

                            {/* Insider Knowledge */}
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Lock className="h-4 w-4 text-purple-500" />
                                Insider Knowledge
                              </h4>
                              <ul className="space-y-2">
                                {scenario.insiderKnowledge.map((knowledge, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">{knowledge}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Step by Step */}
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Target className="h-4 w-4 text-green-500" />
                                Step-by-Step Defense Strategy
                              </h4>
                              <div className="space-y-4">
                                {scenario.stepByStep.map((step, i) => (
                                  <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                        {step.step}
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h5>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{step.details}</p>
                                        
                                        {step.script && (
                                          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                                            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">SCRIPT TO USE:</p>
                                            <p className="text-sm text-blue-900 dark:text-blue-200 italic">"{step.script}"</p>
                                          </div>
                                        )}
                                        
                                        {'redFlags' in step && step.redFlags && (
                                          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-700 mt-2">
                                            <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">RED FLAGS TO LOOK FOR:</p>
                                            <ul className="space-y-1">
                                              {(step.redFlags as string[]).map((flag: string, j: number) => (
                                                <li key={j} className="text-sm text-red-900 dark:text-red-200 flex items-start gap-1">
                                                  <XCircle className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                                                  {flag}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {'calculation' in step && step.calculation && (
                                          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-700 mt-2">
                                            <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">CALCULATION:</p>
                                            <p className="text-sm text-green-900 dark:text-green-200">{step.calculation as string}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Expected Outcome */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                              <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" />
                                Expected Outcome
                              </h4>
                              <p className="text-green-900 dark:text-green-200">{scenario.expectedOutcome}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Insurance Termination Defense */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Gavel className="h-6 w-6 text-red-600" />
              Fighting Wrongful Insurance Termination
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Being wrongfully kicked off your insurance can lead to devastating medical bills. Here's how to fight back and potentially get retroactive coverage for bills you've already incurred.
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              {insuranceKickoffDefense.map((defense, index) => (
                <AccordionItem 
                  key={index} 
                  value={`defense-${index}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Scale className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{defense.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{defense.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">Steps to Take</h4>
                        <ol className="space-y-2">
                          {defense.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Potential Remedies</h4>
                        <ul className="space-y-1">
                          {defense.remedies.map((remedy, i) => (
                            <li key={i} className="flex items-start gap-2 text-green-900 dark:text-green-200 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              {remedy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Letter Templates */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Ready-to-Use Letter Templates
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Debt Validation Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Send this within 30 days of first contact from a collections agency. This legally requires them to stop collection activity until they validate the debt.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {debtValidationTemplate}
                    </pre>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigator.clipboard.writeText(debtValidationTemplate)}
                    data-testid="button-copy-validation"
                  >
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Pay for Delete Settlement Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Use this to offer a settlement in exchange for deletion from your credit report. Start with 20-40% of the alleged debt.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {payForDeleteTemplate}
                    </pre>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => navigator.clipboard.writeText(payForDeleteTemplate)}
                    data-testid="button-copy-pay-delete"
                  >
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Critical Timeline */}
          <section className="mb-12">
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  Critical Deadlines to Know
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">30 Days</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Time to send debt validation letter after first contact from collector</p>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">60 Days</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">COBRA election deadline (retroactive to termination date)</p>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">90 Days</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Retroactive Medicaid coverage window in many states</p>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">3-6 Years</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Statute of limitations on medical debt (varies by state)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Key Contacts */}
          <section className="mb-12">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Key Contacts for Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">CFPB (Consumer Financial Protection Bureau)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">File complaints against debt collectors</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">consumerfinance.gov/complaint</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">State Insurance Commissioner</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">File complaints about insurance issues</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Find at naic.org</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">State Attorney General</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Consumer protection complaints</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Find at naag.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Related Resources */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/bill-reduction-guide">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Bill Reduction Guide</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">General strategies for reducing bills</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/rights-hub">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Patient Rights Hub</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Know your healthcare rights</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/emergency-help">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-3">
                    <Heart className="h-8 w-8 text-red-600" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Emergency Financial Help</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Crisis assistance resources</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
