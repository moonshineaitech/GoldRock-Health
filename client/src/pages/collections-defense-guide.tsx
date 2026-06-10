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
import { CollectionsDefenseChatbot } from "@/components/collections-defense-chatbot";

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
  },
  {
    title: "Medical debt under $500 no longer affects credit scores",
    secret: "As of 2023, the three major credit bureaus (Equifax, Experian, TransUnion) removed medical collections under $500 from credit reports entirely.",
    actionable: "If your medical debt is under $500 in collections, it should NOT appear on your credit report. Dispute it if it does."
  },
  {
    title: "Hospitals must screen for charity care BEFORE collections",
    secret: "Under ACA regulations and most state laws, non-profit hospitals must screen patients for financial assistance eligibility before sending accounts to collections.",
    actionable: "Ask if you were screened for charity care before your account was sent to collections. If not, this is a violation that can be used as leverage."
  },
  {
    title: "The first offer is never the best offer",
    secret: "Collection agencies are trained to start high and negotiate down. Their first offer - even if it seems like a 'discount' - is usually still far above what they'll accept.",
    actionable: "Always counter-offer at least 2-3 times. If they offer 50% off, counter at 20%. Expect to settle somewhere in between."
  },
  {
    title: "Month-end and quarter-end are best times to negotiate",
    secret: "Collection agencies have quotas. At month-end and quarter-end, they're more desperate to close accounts and will accept lower offers.",
    actionable: "Time your final negotiation for the last week of the month. Agents are more motivated to close deals to meet their numbers."
  },
  {
    title: "Medical debt less than 1 year old shouldn't be on credit reports",
    secret: "Credit bureaus now wait 1 year before adding medical debt to credit reports. If it's been less than a year, it shouldn't be there yet.",
    actionable: "Check the date of service. If the debt is less than 1 year old and appears on your credit report, dispute it immediately."
  },
  {
    title: "Charity care applications can recall debt from collections",
    secret: "When you apply for hospital charity care, many hospitals will recall the debt from collections while your application is reviewed. Some will write off the debt entirely.",
    actionable: "Apply for charity care even if your debt is already in collections. The hospital may recall it and dismiss the balance."
  }
];

const collectionsScenarios = [
  {
    id: "childbirth-collections",
    title: "Childbirth Bill Sent to Collections",
    icon: Baby,
    featured: true,
    situation: "You had a baby and received a bill for $15,000-$50,000+. Despite making good-faith payment attempts or disputing charges, the hospital sent the bill to collections.",
    insiderKnowledge: [
      "Hospitals are REQUIRED to screen you for charity care before sending to collections under most state laws and the Affordable Care Act",
      "Many states have 'surprise billing' protections specifically for maternity care",
      "Itemized bills for childbirth frequently contain duplicate charges, unbundled services, and phantom charges",
      "NICU charges are the most commonly inflated - hospitals mark up NICU by 300-500%. Demand documentation for every single day",
      "The average vaginal delivery has 15-25 line items; C-sections have 30-50. If your bill has significantly more, you're being overcharged",
      "Hospitals routinely charge $40-80 for 'skin-to-skin contact' - holding your own baby. This is a known scandal you can dispute",
      "Lactation consultant charges average $150-400 per visit. Many hospitals charge for visits that never happened",
      "Nursery charges while baby was 'rooming in' with you are fraudulent - challenge every nursery charge",
      "Epidural 'placement' and 'medication' are often billed separately when they should be bundled - this is unbundling fraud",
      "If you had a C-section, verify the surgical team billing. Many hospitals charge for 2-3 assistant surgeons when only 1 was present",
      "Collection agencies know childbirth debts are emotional and parents often pay quickly - they count on this. Don't fall for pressure tactics"
    ],
    billForensics: {
      title: "Common Childbirth Billing Errors & Fraud",
      redFlags: [
        { code: "59899", description: "'Mucus extraction' - This is standard newborn care included in delivery, not a separate billable service", amount: "$200-800" },
        { code: "99283-99285", description: "Multiple ER evaluation codes - You can only be evaluated once per visit", amount: "$500-1,500" },
        { code: "36415/36416", description: "Venipuncture charges for each blood draw - Should be bundled with lab work", amount: "$50-200 each" },
        { code: "99477", description: "NICU initial day - Verify baby was actually in NICU, not just 'observation'", amount: "$2,000-8,000" },
        { code: "S9443", description: "Lactation consultant - Verify visit occurred and duration matches bill", amount: "$150-400" },
        { code: "99238", description: "Discharge day management - Often billed even for same-day discharge", amount: "$200-500" },
        { code: "99460/99463", description: "Newborn care - Should not be billed if baby was in NICU under separate billing", amount: "$300-800" }
      ],
      unbundlingSchemes: [
        "Epidural placement billed separately from epidural medication administration",
        "Fetal monitoring billed separately from labor management",
        "IV placement billed separately from IV fluids",
        "Surgical tray billed separately from C-section procedure",
        "Recovery room billed separately from delivery room"
      ],
      phantomCharges: [
        "Circumcision for baby girls (yes, this happens)",
        "Nursery care during 'rooming in'",
        "Multiple pediatrician visits when only one occurred",
        "Hearing test that was 'referred' (failed) but billed as complete",
        "Postpartum depression screening never administered"
      ]
    },
    negotiationPlaybooks: {
      withHospital: {
        title: "Hospital Billing Department Script",
        approach: "Call the hospital billing department directly - NOT the collections agency. Hospitals can recall debts from collections.",
        script: "I'm calling about account [NUMBER] for maternity services on [DATE]. I've reviewed my itemized bill and found several billing errors I need to discuss. First, I was never screened for charity care before this was sent to collections, which violates ACA requirements. Second, I've identified [NUMBER] specific overcharges totaling approximately $[AMOUNT]. I'd like to speak with a billing supervisor or patient advocate who has authority to review these issues and potentially recall this account from collections.",
        followUp: "If they resist, say: 'I understand. I'll be filing a complaint with the state attorney general's healthcare division and the hospital's compliance officer. I also plan to dispute this with credit bureaus citing billing errors. Is there someone else I should speak with first?'"
      },
      withCollections: {
        title: "Collections Agency Negotiation Script",
        approach: "Never acknowledge the debt is valid. Always dispute first, then negotiate from a position of strength.",
        initialScript: "I'm calling regarding a letter I received about an alleged debt from [HOSPITAL]. Before we discuss anything, I need to inform you that I am disputing this debt. I've sent a formal validation request dated [DATE] and I'm recording this call for my records. Can you confirm you've received my validation request?",
        settlementScript: "I've reviewed the documentation and found significant billing errors in the original account. Given these disputes and the age of this debt, I'm prepared to settle this matter for [15-25% of balance]. This would be a one-time payment in exchange for a signed agreement to delete this account from all credit reporting and provide a zero-balance letter. Is that something you can authorize today?",
        escalationScript: "I understand you may not have authority for that amount. Who is your supervisor or manager who handles settlements? I'm also prepared to file complaints with the CFPB and state attorney general if we can't reach a reasonable resolution today."
      },
      withInsurance: {
        title: "Insurance Appeal Script (For Denied Claims)",
        approach: "Many childbirth claims are initially denied but can be overturned on appeal.",
        script: "I'm calling to file an urgent appeal for claim [NUMBER] dated [DATE] for maternity services. The denial reason of [REASON] is incorrect because [EXPLANATION]. Under [STATE] law and the Affordable Care Act, maternity care is an essential health benefit that must be covered. I'm requesting an expedited internal appeal and want to be transferred to a clinical reviewer who can evaluate the medical necessity documentation I'm providing."
      }
    },
    legalProtections: {
      federal: [
        { law: "No Surprises Act (2022)", protection: "Out-of-network providers at in-network facilities cannot balance bill you for emergency or maternity care", enforcement: "File complaint at cms.gov/nosurprises" },
        { law: "EMTALA", protection: "Hospitals cannot refuse to treat you during active labor regardless of ability to pay", enforcement: "File complaint with CMS regional office" },
        { law: "Affordable Care Act §501(r)", protection: "Non-profit hospitals must have charity care policies, screen patients for eligibility, and cannot use extraordinary collection actions without first making reasonable efforts to determine eligibility", enforcement: "File complaint with IRS and state attorney general" },
        { law: "Fair Debt Collection Practices Act", protection: "Collectors cannot harass, make false statements, or use unfair practices. Must validate debt within 30 days of request", enforcement: "Sue in small claims or federal court, file complaint with CFPB" },
        { law: "Fair Credit Reporting Act", protection: "Medical debts under $500 cannot appear on credit reports. All medical debts must wait 1 year before reporting", enforcement: "Dispute with credit bureaus, sue for willful violations" }
      ],
      stateExamples: [
        { state: "California", protection: "Hospitals must provide charity care to patients at 400% FPL. Cannot charge uninsured more than government payers. Must wait 150 days before collections." },
        { state: "New York", protection: "Surprise bill protections for all maternity care. Hospitals must offer payment plans of up to 36 months with no interest." },
        { state: "Texas", protection: "Balance billing banned for maternity services at in-network facilities. Hospitals must provide itemized bills within 10 days." },
        { state: "Illinois", protection: "Hospital Uninsured Patient Discount Act requires discounts of 25-100% based on income. Hospitals cannot report to credit bureaus for 6 months." },
        { state: "New Jersey", protection: "Out-of-network billing banned for all hospital-based services including maternity. Hospitals must screen for charity care." }
      ]
    },
    timeline: {
      title: "30/60/90 Day Action Plan",
      checkpoints: [
        { day: "Day 1-7", actions: ["Send debt validation letter via certified mail", "Request itemized bill from hospital", "Do NOT acknowledge debt on any phone calls", "Start documenting all communications"], status: "critical" },
        { day: "Day 8-30", actions: ["Wait for validation response (legally required within 30 days)", "Review itemized bill for errors", "Research hospital's charity care policy", "Calculate fair market value of services using Healthcare Bluebook"], status: "important" },
        { day: "Day 31-60", actions: ["If no validation received, send follow-up demanding they cease collection", "Submit charity care application", "File dispute with credit bureaus if debt is reported", "Begin negotiation with hospital billing department"], status: "strategic" },
        { day: "Day 61-90", actions: ["Escalate to hospital patient advocate if needed", "File complaints with state attorney general if violations found", "Make settlement offer to collections (15-25% of balance)", "Consider consulting consumer rights attorney if debt is large"], status: "resolution" }
      ]
    },
    templates: {
      debtValidation: {
        title: "Childbirth Debt Validation Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Collections Agency Name]
[Agency Address]
[City, State ZIP]

RE: Dispute and Validation Request - Account #[ACCOUNT NUMBER]

To Whom It May Concern:

I am writing in response to your [letter/call] dated [DATE] regarding an alleged debt of $[AMOUNT] from [HOSPITAL NAME] for maternity services.

Under the Fair Debt Collection Practices Act (15 U.S.C. § 1692g), I am formally disputing this debt and requesting validation. Please provide:

1. Complete itemized billing statement with all CPT/HCPCS codes
2. Proof that you are licensed to collect debts in [STATE]
3. Documentation showing the chain of assignment from original creditor
4. Copy of any signed agreement or contract creating this obligation
5. Proof that the statute of limitations has not expired on this debt
6. Verification that the original creditor complied with ACA 501(r) charity care screening requirements

Under the FDCPA, you must cease all collection activity until this validation is complete. Any continued collection attempts without providing this validation will be considered harassment and a violation of federal law.

Additionally, I am disputing any reporting of this debt to credit bureaus. Under the Fair Credit Reporting Act, you must notify the credit bureaus that this debt is disputed.

All future communications regarding this matter must be in writing only. Do not contact me by telephone.

Sincerely,
[Your Signature]
[Your Printed Name]`
      },
      charityCareLetter: {
        title: "Charity Care Application Request",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Financial Services
[Hospital Address]
[City, State ZIP]

RE: Charity Care/Financial Assistance Application Request - Account #[ACCOUNT NUMBER]

Dear Patient Financial Services:

I am writing to formally request a charity care/financial assistance application for my account dated [SERVICE DATE] totaling $[AMOUNT] for maternity services.

Under the Affordable Care Act Section 501(r) and [STATE] law, your hospital is required to:
1. Have a written financial assistance policy
2. Widely publicize the availability of financial assistance
3. Make reasonable efforts to determine eligibility before initiating collection actions
4. Provide the application upon request

I was not informed of charity care options before my account was sent to collections, which may constitute a violation of federal requirements.

My current household income is approximately $[AMOUNT] annually with [NUMBER] dependents. Based on your published financial assistance policy, I believe I may qualify for [full/partial] charity care.

Please send me:
1. Your current financial assistance application
2. List of required documentation
3. Written copy of your financial assistance policy
4. Deadline for application submission

I also request that you recall this account from collections while my application is under review, as required by most state laws and ACA regulations.

Please respond within 10 business days. Thank you for your attention to this matter.

Sincerely,
[Your Signature]
[Your Printed Name]`
      }
    },
    calculators: {
      charityCareLikelihood: {
        title: "Charity Care Eligibility Estimator",
        description: "Most hospitals provide 100% charity care at 200% FPL, partial assistance up to 400% FPL",
        fplThresholds2024: {
          "1": 15060,
          "2": 20440,
          "3": 25820,
          "4": 31200,
          "5": 36580,
          "6": 41960
        }
      }
    },
    inCollectionsDefense: {
      title: "Your Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          priority: "IMMEDIATE",
          action: "Send Debt Validation Letter",
          why: "You have 30 days from first contact. This LEGALLY freezes collection activity until they validate.",
          script: "Send certified mail: 'Under the FDCPA 15 U.S.C. § 1692g, I dispute this debt and demand validation. Provide: 1) Itemized bill with CPT codes, 2) Proof of assignment from [Hospital], 3) Your license to collect in [State]. Cease all contact until validated.'"
        },
        {
          priority: "CRITICAL",
          action: "Do NOT Acknowledge the Debt on Phone Calls",
          why: "Verbal acknowledgment can restart statute of limitations and weaken your negotiating position.",
          script: "If they call, say ONLY: 'I am disputing this debt. Please communicate in writing only. I do not acknowledge this debt.' Then hang up."
        },
        {
          priority: "URGENT",
          action: "Request Recall to Hospital",
          why: "Hospitals CAN and DO recall debts from collections - especially for charity care applications.",
          script: "Call hospital billing: 'My childbirth account [number] was sent to [collection agency]. I'm applying for charity care and request you recall this account while my application is reviewed. Under ACA 501(r), you must consider charity care before collection.'"
        }
      ],
      collectorTactics: {
        title: "Debt Collector Tricks to Watch For",
        tricks: [
          { 
            tactic: "Pressure to pay 'something now'", 
            reality: "Any payment restarts the statute of limitations in many states. NEVER pay without written agreement.",
            response: "I will not make any payment until I receive a written settlement agreement with pay-for-delete terms."
          },
          { 
            tactic: "'This is your last chance before we sue'", 
            reality: "Lawsuits are expensive. Most collectors never sue. This is usually a bluff.",
            response: "If you're threatening legal action, please provide that in writing so I can forward it to my attorney."
          },
          { 
            tactic: "Offering a 'discount' of 50%", 
            reality: "They paid 4-7 cents on the dollar. A 50% discount is still a 600% profit for them.",
            response: "Given the age and disputed nature of this account, I'm prepared to offer [15-25%] as a full settlement."
          },
          { 
            tactic: "Calling at odd hours or calling family", 
            reality: "Both are FDCPA violations - they can only call 8am-9pm and cannot discuss your debt with others.",
            response: "Document the violation. Say: 'This call is a violation of the FDCPA. I'm documenting this for my formal complaint.'"
          },
          { 
            tactic: "'We can't do pay-for-delete'", 
            reality: "They absolutely can. They just don't want to. Push back or escalate to supervisor.",
            response: "I know pay-for-delete is possible. If you can't authorize it, please transfer me to someone who can."
          }
        ]
      },
      negotiationLeverage: {
        title: "Your Leverage Points for Childbirth Debt",
        points: [
          {
            leverage: "Billing Errors Are Almost Guaranteed",
            power: "HIGH",
            explanation: "Childbirth bills have the highest error rate in healthcare. Document every error and use them to dispute the total amount."
          },
          {
            leverage: "Charity Care Was Not Offered",
            power: "HIGH",
            explanation: "If you weren't screened for financial assistance before collections, this is an ACA violation. Threaten complaints to IRS and state AG."
          },
          {
            leverage: "Collector Paid Pennies for Your Debt",
            power: "MEDIUM",
            explanation: "They bought your $30,000 debt for $1,200-$2,100. Even a $5,000 payment is 300%+ profit. Use this knowledge."
          },
          {
            leverage: "Time is on Your Side",
            power: "MEDIUM",
            explanation: "Statute of limitations (3-6 years) means they have limited time to sue. After SOL, they cannot legally collect via court."
          },
          {
            leverage: "Credit Reporting Rules Changed",
            power: "HIGH",
            explanation: "Medical debt under $500 cannot be reported. All medical debt waits 1 year. Paid medical debt must be removed."
          }
        ]
      },
      settlementRoadmap: {
        title: "Step-by-Step Settlement Process",
        steps: [
          {
            step: 1,
            action: "Calculate Your Opening Offer",
            formula: "Start at 15-20% of the original bill. For a $30,000 childbirth bill, offer $4,500-$6,000 initially.",
            rationale: "They paid $1,200-$2,100 for it. Your offer gives them 300-400% profit."
          },
          {
            step: 2,
            action: "Make Initial Contact in Writing",
            template: "I'm willing to settle account [#] for $[AMOUNT] as payment in full. This offer is contingent on: 1) Written agreement before payment, 2) Deletion from all credit bureaus within 30 days, 3) Zero-balance letter provided upon payment. This offer expires in 15 days."
          },
          {
            step: 3,
            action: "Expect Counter-Offer at 40-50%",
            response: "Their counter is still too high. Counter at 25-30%. Say: 'Given the documented billing errors and my financial situation, the highest I can go is [25-30%].'"
          },
          {
            step: 4,
            action: "Hold Firm - Timing Matters",
            tip: "Call on the last day of the month or quarter. Collectors have quotas and are more flexible when trying to close accounts."
          },
          {
            step: 5,
            action: "Get WRITTEN Agreement BEFORE Payment",
            warning: "NEVER pay based on verbal promise. Require written agreement signed by collector specifying: exact amount, that payment is 'full settlement', credit bureau deletion, timeline."
          },
          {
            step: 6,
            action: "Pay with Traceable Method",
            method: "Use cashier's check or money order. NEVER give them access to your bank account. Keep all records for 7 years."
          }
        ]
      }
    },
    successStories: [
      {
        title: "Sarah's $47,000 C-Section Bill",
        outcome: "Reduced to $4,200 (91% reduction)",
        strategy: "Found 23 billing errors, qualified for 75% charity care, negotiated remaining balance",
        timeline: "67 days from first letter to resolution"
      },
      {
        title: "Mike & Jennifer's NICU Bill",
        outcome: "$89,000 reduced to $0",
        strategy: "Insurance appeal won after 2nd review, hospital had failed to submit proper documentation",
        timeline: "4 months, but worth the persistence"
      }
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
    expectedOutcome: "40-70% reduction in total bill, removal from credit report, no further collection activity",
    escalationPath: [
      { level: 1, entity: "Hospital Billing Department", action: "Request itemized bill, dispute errors, apply for charity care" },
      { level: 2, entity: "Hospital Patient Advocate", action: "Escalate billing disputes, request supervisor review" },
      { level: 3, entity: "Hospital Compliance Officer", action: "Report ACA 501(r) violations, charity care failures" },
      { level: 4, entity: "State Attorney General", action: "File consumer complaint for billing fraud or collection violations" },
      { level: 5, entity: "Consumer Rights Attorney", action: "Consider lawsuit for FDCPA violations, class action potential" }
    ]
  },
  {
    id: "childbirth-insurance-kickoff",
    title: "Childbirth Bill After Being Kicked Off Insurance",
    icon: Heart,
    featured: true,
    situation: "You were pregnant and insured, but your insurance was terminated (often due to employer error, administrative mistake, or failure to pay premium during leave). Now you have a massive uninsured childbirth bill in collections.",
    insiderKnowledge: [
      "Pregnancy is a 'qualifying life event' that triggers special enrollment rights - your coverage should have been extended",
      "COBRA continuation coverage is RETROACTIVE - you can elect it up to 60 days after termination and it covers claims from day 1",
      "If terminated due to employer error, the employer may be liable for the ENTIRE medical bill - this is a huge leverage point",
      "Many states have specific protections for pregnant women losing coverage - some prohibit termination during pregnancy entirely",
      "Hospitals cannot charge uninsured patients more than they'd accept from insurance companies (No Surprises Act)",
      "FMLA protections mean your job-based insurance should continue during approved leave - termination during FMLA is often illegal",
      "Some employers self-insure - meaning THEY are the insurance company and directly liable for coverage errors",
      "State Medicaid programs have 'presumptive eligibility' for pregnant women - you may get immediate temporary coverage",
      "The 60-day COBRA election window is strictly enforced - but COVID-era extensions may still apply in some cases",
      "If your employer has 20+ employees, COBRA is mandatory - smaller employers may have state 'mini-COBRA' options",
      "Insurance companies must provide written notice of termination - failure to do so may invalidate the termination",
      "Pregnancy discrimination in insurance termination is illegal under the Pregnancy Discrimination Act"
    ],
    terminationAnalysis: {
      title: "Why Was Your Coverage Terminated?",
      commonReasons: [
        { 
          reason: "Employer failed to remit premiums", 
          liability: "EMPLOYER liable for all medical bills",
          action: "Document the payment failure and consult employment attorney",
          winRate: "Very high - clear employer negligence"
        },
        { 
          reason: "Administrative/paperwork error", 
          liability: "EMPLOYER liable",
          action: "Get written admission of error from HR, file DOL complaint",
          winRate: "High - employer must maintain accurate records"
        },
        { 
          reason: "FMLA leave confusion", 
          liability: "EMPLOYER liable - FMLA requires coverage continuation",
          action: "File DOL complaint for FMLA violation, contact employment attorney",
          winRate: "Very high - FMLA violations have statutory damages"
        },
        { 
          reason: "Missed premium during maternity leave", 
          liability: "Depends - did employer notify you properly?",
          action: "Request proof of premium notices, check state grace period laws",
          winRate: "Medium - depends on documentation"
        },
        { 
          reason: "Job termination while pregnant", 
          liability: "Possible pregnancy discrimination",
          action: "File EEOC complaint, consult employment attorney immediately",
          winRate: "Medium-High - pregnancy discrimination is illegal"
        },
        { 
          reason: "Spouse lost job/coverage", 
          liability: "Qualifying life event should have triggered enrollment",
          action: "Apply for special enrollment period, file with state insurance commissioner",
          winRate: "High - QLE rights are well-established"
        }
      ]
    },
    cobraAnalysis: {
      title: "COBRA: Your Retroactive Coverage Lifeline",
      keyFacts: [
        "You have 60 days from termination OR 60 days from notice (whichever is later) to elect COBRA",
        "Once elected, coverage is RETROACTIVE to the termination date - all claims during the gap are covered",
        "Yes, you must pay back premiums, but compare: $2,000-4,000 in premiums vs $40,000+ in medical bills",
        "Employer MUST notify you of COBRA rights within 14 days of qualifying event",
        "If employer failed to notify you, your election deadline may be extended",
        "COBRA premiums are typically 102% of the full premium (employer + employee share + 2% admin fee)"
      ],
      calculation: {
        title: "COBRA Cost-Benefit Calculator",
        example: {
          monthlyPremium: 650,
          monthsNeeded: 4,
          totalCOBRACost: 2600,
          medicalBillsAvoided: 45000,
          netSavings: 42400
        }
      },
      scripts: {
        employerCall: "I need to discuss my COBRA rights. My coverage was terminated on [DATE] and I'm within the 60-day election window. I need the COBRA election forms immediately. Can you also confirm the date you sent the required COBRA notification? I need this in writing.",
        insuranceCall: "I'm calling to elect COBRA coverage retroactive to [TERMINATION DATE]. I understand I'll owe back premiums of approximately $[AMOUNT]. Please process this election and confirm that all claims from [TERMINATION DATE] to present will be covered once premiums are paid."
      }
    },
    medicaidPath: {
      title: "Retroactive Medicaid for Pregnancy",
      keyFacts: [
        "Pregnant women qualify for Medicaid at higher income levels (138-200% FPL in most states, up to 300%+ in some)",
        "Most states allow 3 months of retroactive Medicaid coverage",
        "Presumptive eligibility means you can get temporary coverage while your full application is processed",
        "Medicaid during pregnancy often includes 60 days postpartum coverage",
        "If you qualified for Medicaid at ANY point during pregnancy, apply immediately"
      ],
      incomeThresholds2024: {
        "138%FPL_family4": 41400,
        "200%FPL_family4": 60000,
        "300%FPL_family4": 90000
      },
      applicationScript: "I'm applying for Medicaid and requesting presumptive eligibility for pregnancy. I also need to apply for 3 months of retroactive coverage for [MONTHS]. I gave birth on [DATE] and had no insurance coverage at that time. My current income is approximately $[AMOUNT] annually."
    },
    employerLiability: {
      title: "When Your Employer Owes You",
      warningSignsOfLiability: [
        "HR says 'there was a paperwork error' or 'we forgot to process your coverage'",
        "You were on FMLA-approved leave when coverage was terminated",
        "You weren't given proper notice before termination",
        "The employer continued deducting premiums from your paycheck but didn't remit them",
        "You requested coverage during a qualifying life event but it wasn't processed",
        "Your coverage was terminated but coworkers in similar situations kept theirs"
      ],
      documentationNeeded: [
        "All pay stubs showing premium deductions",
        "Written correspondence with HR about coverage",
        "COBRA notification (or lack thereof)",
        "FMLA approval documentation",
        "Emails/texts discussing coverage status",
        "Witness statements from coworkers if applicable"
      ],
      legalRemedies: [
        { remedy: "ERISA violation claim", potential: "Full medical bills + attorney fees + statutory penalties" },
        { remedy: "FMLA violation claim", potential: "Double damages + attorney fees + reinstatement rights" },
        { remedy: "Breach of contract claim", potential: "Full medical bills + consequential damages" },
        { remedy: "State insurance law violations", potential: "Varies by state - some have treble damages" }
      ],
      consultationScript: "I'm consulting you regarding my employer's failure to maintain my health insurance coverage during pregnancy. I have documentation showing [SPECIFIC ISSUES]. I believe this may constitute violations of ERISA and/or FMLA. I have medical bills of approximately $[AMOUNT] that resulted from this coverage lapse."
    },
    negotiationPlaybooks: {
      withHospital: {
        title: "Hospital Negotiation - Coverage Dispute Leverage",
        approach: "Emphasize that coverage is under dispute and payment is contingent on resolution",
        script: "I'm calling about account [NUMBER] for maternity services on [DATE]. My insurance coverage termination is currently under dispute with [EMPLOYER/INSURANCE/STATE AGENCY]. I'm also exploring COBRA retroactive election. Given these pending matters, I'm requesting that you: 1) Put a hold on collections activity, 2) Provide your uninsured/self-pay discount rate, and 3) Work with me on a payment plan contingent on the outcome of my appeals."
      },
      withCollections: {
        title: "Collections - Active Dispute Strategy",
        approach: "Assert the debt is under active dispute and collection must pause",
        script: "I'm calling regarding the alleged debt from [HOSPITAL]. This debt is currently under active dispute because my insurance coverage was wrongfully terminated. I have filed complaints with [STATE INSURANCE COMMISSIONER/DOL/EEOC] and am pursuing COBRA retroactive election. Under the FDCPA, you are required to note this account as disputed. I'm sending you a written dispute notice today. Any attempt to collect while this matter is under dispute may constitute a violation of federal law."
      },
      withInsurance: {
        title: "Insurance Reinstatement Appeal",
        approach: "Demand reinstatement and retroactive coverage",
        script: "I'm calling to appeal the termination of my coverage effective [DATE]. This termination was improper because [REASON - e.g., I was on FMLA leave, employer failed to notify me, I had a qualifying life event]. Under [applicable law], my coverage should be reinstated retroactively. I'm also filing a formal complaint with the state insurance commissioner. Please provide me with your internal appeals process and timeline."
      }
    },
    legalProtections: {
      federal: [
        { law: "ERISA §502(a)", protection: "Allows employees to sue for benefits wrongfully denied, including health coverage", enforcement: "Federal court lawsuit, attorney fees recoverable" },
        { law: "COBRA (26 USC 4980B)", protection: "Requires employers to offer continuation coverage for 18-36 months after qualifying event", enforcement: "DOL complaint, private lawsuit, $110/day penalty for late notices" },
        { law: "FMLA (29 USC 2614)", protection: "Requires employers to maintain health coverage during approved leave", enforcement: "DOL complaint, private lawsuit, double damages" },
        { law: "Pregnancy Discrimination Act", protection: "Prohibits discrimination in employment (including benefits) based on pregnancy", enforcement: "EEOC complaint, private lawsuit" },
        { law: "No Surprises Act", protection: "Uninsured patients cannot be charged more than insurance-negotiated rates", enforcement: "CMS complaint, state insurance commissioner" },
        { law: "ACA Marketplace Special Enrollment", protection: "60-day window to enroll in ACA coverage after losing employer coverage", enforcement: "Healthcare.gov or state marketplace" }
      ],
      stateExamples: [
        { state: "California", protection: "Cal-COBRA extends to employers with 2-19 employees. State law requires 60-day premium grace period." },
        { state: "New York", protection: "Mini-COBRA for small employers. Pregnant women cannot be denied Medicaid for immigration status." },
        { state: "Massachusetts", protection: "State has its own individual mandate - gap coverage may be available through Health Connector." },
        { state: "New Jersey", protection: "Continuation coverage for up to 18 months for small employers. Strong pregnancy protections." }
      ]
    },
    timeline: {
      title: "Critical Deadlines & Action Plan",
      checkpoints: [
        { day: "IMMEDIATELY", actions: ["Check your COBRA election deadline (60 days from termination or notice)", "Request written documentation of termination reason", "Do NOT let COBRA deadline pass while investigating"], status: "critical" },
        { day: "Day 1-14", actions: ["File for COBRA if within deadline - even if you're still investigating", "Apply for Medicaid with retroactive coverage request", "Contact employer HR for termination documentation", "Send debt validation letter to any collectors"], status: "critical" },
        { day: "Day 15-30", actions: ["File complaint with state insurance commissioner if wrongful termination", "File DOL complaint if FMLA violation suspected", "Get itemized hospital bill", "Consult with employment attorney if employer liability indicated"], status: "important" },
        { day: "Day 31-60", actions: ["Follow up on all pending complaints and appeals", "Apply for hospital charity care", "Dispute any credit bureau reporting", "Negotiate payment plan with hospital contingent on appeals"], status: "strategic" },
        { day: "Day 61-90", actions: ["Evaluate COBRA vs Medicaid coverage outcomes", "Make settlement offers to collections if coverage not restored", "Consider formal legal action if employer liability is clear"], status: "resolution" }
      ]
    },
    templates: {
      cobraElectionLetter: {
        title: "COBRA Election Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Employer HR Department]
[Employer Address]
[City, State ZIP]

RE: COBRA Election and Retroactive Coverage Request

Dear COBRA Administrator:

I am writing to formally elect COBRA continuation coverage, effective retroactively to [COVERAGE TERMINATION DATE].

Employee Name: [YOUR NAME]
Employee ID: [IF KNOWN]
Coverage Termination Date: [DATE]
Dependents to be covered: [LIST NAMES]

I understand that I am responsible for paying the applicable premiums for the period from [TERMINATION DATE] to present. Please provide:

1. Confirmation of COBRA election
2. Total premium amount due for retroactive period
3. Monthly premium going forward
4. Payment instructions and deadlines
5. Confirmation that all claims from [TERMINATION DATE] forward will be processed once premiums are paid

Please process this election immediately. I expect written confirmation within 7 business days.

NOTE: If this election is not processed within the legally required timeframe, I will file a complaint with the Department of Labor.

Sincerely,
[Your Signature]
[Your Printed Name]
[Phone Number]
[Email]`
      },
      employerLiabilityLetter: {
        title: "Employer Liability Demand Letter",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED

[Employer Name]
[Attention: CEO/General Counsel/HR Director]
[Employer Address]
[City, State ZIP]

RE: Demand for Payment - Improper Insurance Termination

Dear [NAME]:

I am writing regarding the improper termination of my health insurance coverage, which resulted in substantial uninsured medical expenses.

FACTS:
- I was employed by [COMPANY] from [DATE] to [DATE]
- My health insurance coverage was terminated on [DATE]
- The termination was improper because [SPECIFIC REASON]
- As a result, I incurred medical bills totaling $[AMOUNT]

LEGAL BASIS:
This improper termination constitutes a violation of [ERISA/FMLA/STATE LAW] and has caused me significant financial harm.

DEMAND:
I demand that [COMPANY] reimburse me for all medical expenses incurred as a result of this improper termination, totaling $[AMOUNT], within 30 days of this letter.

If I do not receive satisfactory resolution within 30 days, I will pursue all available legal remedies, including filing complaints with the Department of Labor and [STATE AGENCY], and initiating legal action.

I am prepared to discuss a reasonable resolution to this matter. Please have your representative contact me at [PHONE/EMAIL] to discuss.

Sincerely,
[Your Signature]
[Your Printed Name]

cc: [Your Attorney, if any]
    Department of Labor [optional]`
      }
    },
    inCollectionsDefense: {
      title: "Your Childbirth Bill is in Collections After Insurance Termination - What to Do NOW",
      urgentActions: [
        {
          priority: "CHECK FIRST",
          action: "Verify COBRA Deadline Status",
          why: "You have 60 days from termination OR notice (whichever is later). If still within window, ELECT COBRA IMMEDIATELY.",
          script: "Even if unsure, elect COBRA now. Say: 'I'm electing COBRA retroactive to [termination date]. Please send confirmation and premium amount. I need this processed immediately.'"
        },
        {
          priority: "IMMEDIATE",
          action: "Demand Collector Stop Activity While Dispute Active",
          why: "Active coverage disputes and pending appeals mean they should pause collection.",
          script: "This debt is under active dispute. I am pursuing insurance reinstatement/COBRA election/employer liability claim. Under the FDCPA, you must note this as disputed. I'm sending written notice today. Continue collection at your legal risk."
        },
        {
          priority: "CRITICAL",
          action: "Apply for Retroactive Medicaid",
          why: "Pregnant women qualify at higher income levels. 3 months retroactive coverage possible.",
          script: "Call state Medicaid: 'I'm applying for retroactive Medicaid. I was pregnant and uninsured when I gave birth on [date]. I request presumptive eligibility and 3-month retroactive coverage.'"
        }
      ],
      collectorTactics: {
        title: "Special Tactics Collectors Use for Insurance-Related Debts",
        tricks: [
          { 
            tactic: "'Your insurance issues aren't our problem'", 
            reality: "Wrong. Active disputes MUST be noted. You have rights under FDCPA.",
            response: "This debt is formally disputed due to wrongful insurance termination. Please note this dispute. Any credit reporting without noting the dispute violates the FCRA."
          },
          { 
            tactic: "'The deadline for COBRA/appeals has passed'", 
            reality: "Collectors often don't know insurance law. Verify deadlines yourself.",
            response: "I've verified my deadlines with the insurance company directly. Please put your claim in writing so I can review with my attorney."
          },
          { 
            tactic: "'Your employer won't pay - it's your responsibility'", 
            reality: "Employer liability is a separate legal matter. Don't let collectors discourage you.",
            response: "I'm pursuing employer liability through proper legal channels. This is not your concern. The debt remains disputed."
          }
        ]
      },
      multiPartyStrategy: {
        title: "Negotiating When Multiple Parties Are Involved",
        parties: [
          {
            party: "Hospital/Provider",
            leverage: "Request charity care even if in collections. Hospitals can recall debt and apply assistance retroactively.",
            script: "I'm applying for charity care. Please recall this account from [collector] while my application is reviewed. I understand this is required under ACA 501(r)."
          },
          {
            party: "Former Employer",
            leverage: "If coverage terminated due to employer error, they may pay the bill to avoid lawsuit.",
            script: "My health insurance was terminated due to [employer's error]. I have $[amount] in medical bills as a result. I'm requesting you make me whole. Otherwise, I will pursue legal action for ERISA/FMLA violations."
          },
          {
            party: "Insurance Company",
            leverage: "If termination was improper or not properly notified, demand retroactive reinstatement.",
            script: "My coverage was terminated without proper notification as required by law. I'm filing a formal grievance and requesting retroactive reinstatement to [date]. I'm also filing a complaint with the state insurance commissioner."
          },
          {
            party: "Collections Agency",
            leverage: "With pending disputes, you have significant leverage to settle for pennies.",
            script: "This account is under active dispute with pending insurance reinstatement and employer liability claims. Given the uncertainty, I'm prepared to settle for [10-20%] while preserving my rights to pursue other parties."
          }
        ]
      },
      settlementWhileDisputing: {
        title: "How to Settle Collections While Pursuing Other Remedies",
        strategy: "You can negotiate with collections while also pursuing COBRA, Medicaid, or employer liability. If you get coverage restored, you get a refund or credit. If not, you've limited your loss.",
        steps: [
          {
            step: 1,
            action: "Get Settlement IN WRITING with Refund Clause",
            template: "Any settlement I pay is contingent on the following: If retroactive insurance coverage is obtained, [collector] agrees to refund payments to the extent covered by insurance."
          },
          {
            step: 2,
            action: "Negotiate Lower Amount Due to Pending Disputes",
            script: "Given the complexity of this case - pending COBRA election, employer liability claim, and Medicaid application - I'm offering [15-20%] to settle while I pursue these remedies. This protects both of us."
          },
          {
            step: 3,
            action: "Document Everything for Potential Reimbursement",
            tip: "If you later get coverage restored or win employer liability claim, you can seek reimbursement for what you paid. Keep all receipts."
          }
        ]
      }
    },
    successStories: [
      {
        title: "Amanda's COBRA Victory",
        outcome: "$62,000 in bills fully covered by insurance",
        strategy: "Elected COBRA 58 days after termination, paid $3,200 in back premiums, all claims processed retroactively",
        timeline: "6 weeks from COBRA election to claim resolution"
      },
      {
        title: "The Rodriguez Family FMLA Case",
        outcome: "Employer paid $78,000 in medical bills + $15,000 settlement",
        strategy: "Documented FMLA violation, filed DOL complaint, employer settled to avoid lawsuit",
        timeline: "4 months, but worth every day"
      },
      {
        title: "Jessica's Medicaid Retroactive Coverage",
        outcome: "$41,000 covered by Medicaid retroactively",
        strategy: "Applied for presumptive eligibility, qualified based on pregnancy income threshold, 3 months retroactive",
        timeline: "8 weeks from application to full coverage confirmation"
      }
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
    expectedOutcome: "Potential full coverage restoration, 50-80% reduction, or debt dismissal depending on circumstances",
    escalationPath: [
      { level: 1, entity: "Employer HR Department", action: "Request documentation, explore COBRA, identify liability" },
      { level: 2, entity: "State Insurance Commissioner", action: "File complaint for wrongful termination, request investigation" },
      { level: 3, entity: "Department of Labor", action: "File complaint for ERISA/FMLA violations" },
      { level: 4, entity: "EEOC", action: "File complaint if pregnancy discrimination suspected" },
      { level: 5, entity: "Employment Attorney", action: "Evaluate lawsuit for damages, negotiate settlement" }
    ]
  },
  {
    id: "childbirth-back-on-insurance",
    title: "Childbirth Bill in Collections - Now Back on Insurance",
    icon: Baby,
    featured: true,
    situation: "You had a baby while uninsured or during a coverage gap. The hospital bill went to collections. Now you're back on insurance (through new job, ACA marketplace, Medicaid, or spouse's plan) - but the collector is still hounding you for the old bill.",
    insiderKnowledge: [
      "Your NEW insurance CANNOT pay old bills from before your coverage started - but there are workarounds",
      "If you obtained Medicaid, check if you qualify for RETROACTIVE coverage (up to 3 months back)",
      "Some employers offer day-one coverage with no waiting period - if birth was close to start date, it might be covered",
      "Special Enrollment Periods allow 60-day retroactive coverage in some circumstances",
      "Hospitals can apply charity care RETROACTIVELY even after the bill went to collections",
      "If you're now on Medicaid, some states have 'estate recovery' protections that limit what can be collected",
      "The fact that you're now insured shows financial instability - use this as leverage for charity care",
      "Collectors know people with new insurance are 'trying to get back on their feet' - they may settle lower",
      "If your new coverage is through the same employer who dropped you, explore employer liability",
      "ACA marketplace plans have income-based subsidies - if you qualified for subsidies, you might qualify for hospital charity care too"
    ],
    coverageAnalysis: {
      title: "Can Your Current Insurance Help?",
      scenarios: [
        {
          scenario: "You Got Medicaid After Birth",
          canHelp: true,
          explanation: "Medicaid can cover medical bills retroactively for 3 months before your application. If your birth was within that window, apply immediately.",
          action: "Contact Medicaid and request retroactive coverage for your delivery date. Even if denied, this creates documentation for charity care."
        },
        {
          scenario: "You Got New Job with Insurance",
          canHelp: "Maybe",
          explanation: "Standard plans only cover services AFTER effective date. BUT: If effective date is close to birth, if employer has day-one coverage, or if there was a coverage dispute, there may be options.",
          action: "Request your plan documents. Check the 'effective date' and any 'prior coverage' provisions. Ask HR about retroactive coverage options."
        },
        {
          scenario: "You Got ACA Marketplace Plan",
          canHelp: "Limited",
          explanation: "ACA plans generally don't cover pre-enrollment services. However, if you had a Special Enrollment Period within 60 days of losing coverage, you may have retroactive rights.",
          action: "Review your enrollment. If it was a Special Enrollment triggered by job loss, the coverage may be effective from the date you lost prior coverage."
        },
        {
          scenario: "You Got on Spouse's Plan (Qualifying Life Event)",
          canHelp: "Maybe",
          explanation: "Joining spouse's plan after birth or marriage is a Qualifying Life Event with potential for backdated coverage.",
          action: "Contact the spouse's HR and insurance. Ask if coverage can be backdated to the Qualifying Life Event date."
        }
      ]
    },
    charityCarePath: {
      title: "Charity Care is Your Best Option (Even Now)",
      keyPoint: "Being previously uninsured and now getting back on your feet is EXACTLY the situation charity care programs are designed for.",
      steps: [
        {
          step: 1,
          action: "Document Your Coverage Gap",
          details: "Gather proof of your uninsured period (job loss letter, insurance termination notice, etc.). This supports your hardship claim."
        },
        {
          step: 2,
          action: "Apply for Hospital Charity Care",
          details: "Contact the hospital's billing department (NOT collections). Request charity care application. Most hospitals must provide 100% charity care at 200% FPL.",
          script: "I'm calling about account [number] which is now with [collector]. I was uninsured during my childbirth due to [reason]. I'm now back on insurance and trying to get back on my feet. I'd like to apply for retroactive charity care/financial assistance."
        },
        {
          step: 3,
          action: "Request Debt Recall from Collections",
          details: "When you apply for charity care, request that the hospital recall the debt from the collector while your application is reviewed.",
          script: "I understand my account is with [collector]. Under ACA 501(r), I'm requesting you recall this account while my charity care application is reviewed. The hospital must screen for financial assistance before pursuing extraordinary collection actions."
        },
        {
          step: 4,
          action: "Include All Relevant Documentation",
          details: "Provide: proof of prior uninsured status, current income, proof of new coverage (shows you're stabilizing), any unemployment/hardship letters."
        }
      ]
    },
    negotiationPlaybooks: {
      withHospital: {
        title: "Hospital Negotiation - Returning Patient Leverage",
        approach: "Hospitals want patients with new insurance to return for future care. Use this as leverage.",
        script: "I'm calling about account [number] for childbirth services. I was uninsured at that time due to [reason]. I'm now insured through [new plan] and am establishing myself as a patient at [hospital/different hospital]. I'd like to resolve this old account. I'm applying for charity care and asking for the debt to be recalled from collections for review."
      },
      withCollections: {
        title: "Collections Negotiation - Financial Turnaround Story",
        approach: "Frame yourself as someone who hit hard times and is rebuilding. Collectors understand this and may settle lower.",
        initialScript: "I'm calling about account [number]. This debt is from when I was uninsured during a difficult period. I'm now back on insurance and trying to rebuild my finances. I can't pay the full amount, but I want to resolve this. What can you accept as a settlement?",
        settlementScript: "I'm prepared to settle this account for [15-25% of balance]. I can pay this amount today if we can agree on pay-for-delete terms. I'll need the agreement in writing before payment.",
        hardballScript: "I've also applied for hospital charity care, which could eliminate this debt entirely. I'm offering you [amount] as an alternative to getting nothing if the charity care is approved. This is a one-time offer."
      }
    },
    legalProtections: {
      federal: [
        { law: "ACA Section 501(r)", protection: "Hospitals must screen for charity care eligibility before sending to collections. If they didn't, this is a violation.", enforcement: "File complaint with IRS and state attorney general" },
        { law: "Fair Debt Collection Practices Act", protection: "Collectors cannot harass, lie, or use unfair practices. You can dispute the debt and demand validation.", enforcement: "CFPB complaint, potential FDCPA lawsuit" },
        { law: "Fair Credit Reporting Act", protection: "Medical debt under $500 not reportable. All medical debt waits 1 year. Paid medical debt removed.", enforcement: "Credit bureau disputes" }
      ]
    },
    timeline: {
      title: "Action Plan: You're Back on Insurance",
      checkpoints: [
        { day: "Day 1-7", actions: ["Check if current insurance has any retroactive coverage options", "Apply for Medicaid retroactive coverage if income-eligible", "Send debt validation letter to collector", "Request itemized bill from hospital"], status: "critical" },
        { day: "Day 8-21", actions: ["Apply for hospital charity care", "Request hospital recall debt from collections", "Gather all documentation of your coverage gap", "Research your state's medical debt protections"], status: "important" },
        { day: "Day 22-45", actions: ["Follow up on charity care application", "If denied, appeal with additional documentation", "Begin settlement negotiations with collector if needed", "Dispute any credit bureau reporting"], status: "strategic" },
        { day: "Day 46-90", actions: ["Finalize charity care or settlement", "Get all agreements in writing", "Verify credit bureau deletion if agreed", "Document resolution for your records"], status: "resolution" }
      ]
    },
    templates: {
      charityCareLetter: {
        title: "Charity Care Application Letter - Previously Uninsured",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Hospital Name]
Patient Financial Services
[Hospital Address]
[City, State ZIP]

RE: Charity Care/Financial Assistance Application - Account #[ACCOUNT NUMBER]

Dear Patient Financial Services:

I am writing to request consideration for your charity care/financial assistance program for my account dated [SERVICE DATE] for maternity services.

CIRCUMSTANCES:
- At the time of my childbirth, I was uninsured due to [job loss/coverage termination/unable to afford coverage/gap between coverage]
- My account has been sent to [COLLECTION AGENCY], but I understand you can recall it for charity care review
- I have since obtained health insurance through [NEW SOURCE] and am working to rebuild my financial stability

FINANCIAL INFORMATION:
- Household size: [NUMBER]
- Current annual income: $[AMOUNT]
- I believe this qualifies me for [full/partial] charity care under your published policy

REQUEST:
1. Please send your financial assistance application and list of required documents
2. Please recall my account from [COLLECTION AGENCY] while my application is under review
3. Please consider retroactive charity care for this delivery

Under the Affordable Care Act Section 501(r), hospitals must make reasonable efforts to determine financial assistance eligibility before pursuing collection actions.

Thank you for your consideration. I can be reached at [PHONE] or [EMAIL].

Sincerely,
[Your Signature]
[Your Printed Name]`
      },
      settlementLetter: {
        title: "Settlement Offer Letter - Previously Uninsured Parent",
        content: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Collection Agency Name]
[Agency Address]
[City, State ZIP]

RE: Settlement Offer - Account #[ACCOUNT NUMBER]

To Whom It May Concern:

I am writing regarding the above-referenced account for approximately $[AMOUNT] originating from [HOSPITAL NAME] for maternity services.

BACKGROUND:
This debt arose during a period when I was uninsured. Since then, I have obtained health insurance and am working to resolve outstanding debts from that difficult period.

OFFER:
I am prepared to settle this account for $[15-25% of balance] as payment in full, contingent on the following terms:

1. Payment is accepted as FULL SETTLEMENT of all amounts owed
2. [AGENCY] agrees to DELETE (not update) this account from all credit bureaus within 30 days of payment
3. [AGENCY] provides a zero-balance letter upon payment
4. All terms are provided IN WRITING before payment is made

I have also applied for charity care with [HOSPITAL], which may result in the debt being dismissed entirely. This settlement offer represents an alternative that provides you guaranteed payment.

This offer expires on [DATE - 15 days from letter date]. If I do not receive written acceptance by that date, I will pursue the charity care process exclusively.

Sincerely,
[Your Printed Name]
[Do NOT sign - keep for your records until you receive written acceptance]`
      }
    },
    successStories: [
      {
        title: "Maria's Charity Care Victory",
        outcome: "$38,000 hospital bill reduced to $0",
        strategy: "Applied for charity care 6 months after birth while in collections. Hospital recalled debt, approved 100% charity care based on income at time of delivery.",
        timeline: "45 days from application to debt dismissal"
      },
      {
        title: "The Thompsons' Medicaid Retroactive Coverage",
        outcome: "$52,000 covered by retroactive Medicaid",
        strategy: "Applied for Medicaid after getting new job with insurance. Qualified for retroactive coverage back to delivery month based on low income during unemployment.",
        timeline: "3 months from application to coverage confirmation"
      },
      {
        title: "David's Strategic Settlement",
        outcome: "Settled $27,000 debt for $4,050 (15%)",
        strategy: "Used pending charity care application as leverage. Collector accepted low settlement rather than risk getting nothing.",
        timeline: "21 days from initial offer to settlement"
      }
    ],
    inCollectionsDefense: {
      title: "You're Back on Insurance But Collectors Won't Stop - What to Do",
      urgentActions: [
        {
          priority: "FIRST",
          action: "Check for Retroactive Coverage Options",
          why: "Medicaid and some other plans can cover bills from BEFORE you enrolled.",
          script: "Call your insurance: 'I enrolled on [date]. Are there any retroactive coverage provisions? I had medical bills from [delivery date] I'm hoping might be covered.'"
        },
        {
          priority: "IMMEDIATE",
          action: "Apply for Hospital Charity Care NOW",
          why: "Even with the bill in collections, hospitals can recall it and apply charity care. Your past uninsured status qualifies you.",
          script: "Call hospital billing: 'I have an account in collections for childbirth. I was uninsured then but have insurance now. I want to apply for retroactive charity care. Please recall my account from collections.'"
        },
        {
          priority: "CRITICAL",
          action: "Send Debt Validation to Collector",
          why: "Buying time while pursuing charity care. This freezes collection legally.",
          script: "Certified mail: 'I dispute this debt and request validation under the FDCPA. I am also pursuing charity care with [hospital]. Cease contact until debt is validated.'"
        }
      ],
      leveragePoints: [
        {
          leverage: "You're Rebuilding - Hospitals Want Your Future Business",
          explanation: "Now that you have insurance, hospitals want you as a patient. Use this as leverage for charity care.",
          script: "I'm now insured and looking for a hospital system for my family's care. I'd like to resolve this old account and establish care here. Can we discuss charity care?"
        },
        {
          leverage: "Charity Care Pending = Collector Gets Nothing",
          explanation: "If charity care is approved, the hospital writes off the debt and the collector gets nothing. Use this as leverage.",
          script: "I have a pending charity care application with [hospital]. If approved, you get nothing. I'm offering [15-20%] as an alternative settlement. This is your chance to collect something."
        },
        {
          leverage: "Your Hardship Period is Documented",
          explanation: "Job loss, coverage termination, pregnancy - these all support charity care eligibility.",
          script: "I can document the circumstances that led to my uninsured status at delivery. This supports my charity care application and demonstrates why I cannot pay the full amount."
        }
      ]
    },
    expectedOutcome: "High probability of 70-100% reduction through charity care, or 75-85% reduction through settlement with pending charity care as leverage",
    escalationPath: [
      { level: 1, entity: "Hospital Patient Financial Services", action: "Apply for charity care, request debt recall from collections" },
      { level: 2, entity: "Hospital Patient Advocate", action: "Escalate if charity care denied, appeal decision" },
      { level: 3, entity: "Hospital Compliance Officer", action: "Report failure to screen for charity care before collections" },
      { level: 4, entity: "State Attorney General", action: "File complaint for charity care violations" },
      { level: 5, entity: "Consumer Rights Attorney", action: "Potential FDCPA claims against collector, charity care enforcement" }
    ]
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
    inCollectionsDefense: {
      title: "Your ER Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "DON'T PAY - Send Debt Validation Letter First",
          timeline: "Within 30 days of first contact",
          why: "ER bills have the highest error rates. You have rights to demand proof the debt is valid and the amount is correct."
        },
        {
          action: "Request Original Hospital Records",
          timeline: "Immediately",
          why: "Compare what you're being billed for against what actually happened. ER bills are notorious for phantom charges."
        },
        {
          action: "Apply for Hospital Charity Care",
          timeline: "Within 60 days",
          why: "Most hospitals will recall debt from collections to evaluate charity care. ER visits qualify for emergency charity care at most non-profit hospitals."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll emphasize 'emergency care debt' sounds urgent",
          truth: "ER debt is actually MORE negotiable because it's the most disputed type of medical debt",
          response: "I'm disputing this debt due to significant billing errors. I've sent a validation request."
        },
        {
          tactic: "They'll claim EMTALA means you 'agreed to pay'",
          truth: "EMTALA protects YOUR rights to care - it doesn't obligate you to pay inflated rates",
          response: "EMTALA requires care regardless of payment ability. That doesn't validate inflated billing."
        },
        {
          tactic: "They'll pressure you by citing ER 'life-saving' nature",
          truth: "Many ER visits are not life-threatening, and even those that are can be negotiated",
          response: "I appreciate the care I received. That doesn't mean I'll pay fraudulent charges."
        }
      ],
      leveragePoints: [
        {
          leverage: "ER Bills Have Highest Markup Rates",
          explanation: "ERs mark up 400-1000%. A $5,000 bill may represent $500-$1,000 in actual costs.",
          script: "The fair market value for these services is approximately [20-30%] of what you're claiming. I'm prepared to settle at fair market rates."
        },
        {
          leverage: "No Surprises Act Violations",
          explanation: "If any providers were out-of-network, you may have grounds to void the debt entirely.",
          script: "This bill includes charges from out-of-network providers at an emergency facility, violating the No Surprises Act. This debt may not be legally collectible."
        },
        {
          leverage: "Observation vs. Admission Status Errors",
          explanation: "If you were wrongly classified as 'observation,' your insurance appeal could void a large portion.",
          script: "I'm disputing my status classification. A retroactive status change could eliminate this balance."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Send Debt Validation Letter", timing: "Within 30 days of first contact", successMetric: "Collector must stop all collection activity until they respond" },
        { step: 2, action: "Request Itemized Bill from Hospital", timing: "Simultaneously with validation", successMetric: "Compare charges against fair market rates" },
        { step: 3, action: "Apply for Hospital Charity Care", timing: "Within 7 days", successMetric: "Hospital may recall debt from collections" },
        { step: 4, action: "File No Surprises Act Dispute if Applicable", timing: "Within 30 days of receiving bill", successMetric: "Out-of-network charges adjusted to in-network rates" },
        { step: 5, action: "Negotiate Settlement at 15-25%", timing: "After validation received", successMetric: "Written pay-for-delete agreement before any payment" }
      ]
    },
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
    inCollectionsDefense: {
      title: "Your Surgical Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "DON'T PAY - Request Complete Surgical Records First",
          timeline: "Within 30 days of first contact",
          why: "Surgical bills often have multiple billing errors - wrong OR times, phantom assistant surgeons, and inflated implant charges."
        },
        {
          action: "Identify ALL Separate Bills and Providers",
          timeline: "Within 7 days",
          why: "Surgery generates multiple bills (hospital, surgeon, anesthesiologist, pathologist). Know exactly who's billing you before paying anyone."
        },
        {
          action: "Check No Surprises Act Applicability",
          timeline: "Immediately",
          why: "If any provider was out-of-network at an in-network facility, you may not owe this debt at all."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll combine multiple providers' debts to pressure you",
          truth: "Each provider's debt is separate. You can negotiate and dispute independently.",
          response: "I need separate validation for each provider's charges. Please send itemized documentation for each."
        },
        {
          tactic: "They'll claim surgical care is 'non-negotiable'",
          truth: "Surgical bills have the highest markups in healthcare - 300-500% on implants and supplies",
          response: "The fair market value for these services is well documented. I'm disputing the inflated charges."
        },
        {
          tactic: "They'll threaten to report to credit bureaus immediately",
          truth: "Medical debt cannot be reported to credit bureaus until 365 days after the first bill",
          response: "Under current FCRA regulations, this debt cannot be reported for one year. Please confirm you understand."
        }
      ],
      leveragePoints: [
        {
          leverage: "No Surprises Act Violations Are Common in Surgery",
          explanation: "Out-of-network anesthesiologists, pathologists, and assistant surgeons are illegal to balance bill.",
          script: "I've identified out-of-network providers in this surgical bill. Under the No Surprises Act, I cannot be balance billed. This debt may be void."
        },
        {
          leverage: "Operating Room Time Padding",
          explanation: "Compare billed OR time against anesthesia records. Discrepancies = billing fraud.",
          script: "The operative notes show surgery lasted 2 hours but I was billed for 4 hours of OR time. This is a billing error I'm disputing."
        },
        {
          leverage: "Implant Markup Abuse",
          explanation: "Hospitals mark up implants 200-500%. Research manufacturer pricing for leverage.",
          script: "The implant in question has a manufacturer price of $X. You billed $Y - a markup of Z%. I'm requesting adjustment to reasonable rates."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Send Debt Validation for Each Provider", timing: "Within 30 days", successMetric: "Separate validation for hospital, surgeon, anesthesiologist" },
        { step: 2, action: "Request Complete Operative Records", timing: "Within 7 days", successMetric: "Compare OR times, personnel, and supplies to charges" },
        { step: 3, action: "File No Surprises Act Dispute if Applicable", timing: "Within 30 days", successMetric: "Out-of-network charges voided or adjusted" },
        { step: 4, action: "Challenge Each Billing Error in Writing", timing: "After records received", successMetric: "Documented errors for negotiation leverage" },
        { step: 5, action: "Negotiate with Largest Balance First", timing: "After disputes filed", successMetric: "25-40% settlement with pay-for-delete" }
      ]
    },
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
    inCollectionsDefense: {
      title: "Your Mental Health Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "DON'T PAY - File Insurance Appeal First",
          timeline: "Within 30-60 days of denial",
          why: "Mental health denials are overturned 40-60% on appeal. Don't pay until you've exhausted appeals."
        },
        {
          action: "File Mental Health Parity Complaint",
          timeline: "Within 30 days",
          why: "Many denials violate the Mental Health Parity Act. This gives you leverage with both insurance and collectors."
        },
        {
          action: "Request Treatment Facility Financial Assistance",
          timeline: "Immediately",
          why: "Most residential facilities have charity care programs. They may recall debt from collections."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll use stigma by mentioning 'mental health' or 'substance abuse' treatment",
          truth: "Collectors may NOT disclose the nature of your debt to third parties - this violates FDCPA and HIPAA",
          response: "Please confirm you understand you cannot disclose the nature of this debt to any third party. Any violation will result in legal action."
        },
        {
          tactic: "They'll claim mental health treatment was 'elective' or 'not necessary'",
          truth: "Mental health treatment is medically necessary when prescribed by a doctor - it's not elective",
          response: "This treatment was prescribed by a licensed medical professional as medically necessary. I'm disputing any characterization otherwise."
        },
        {
          tactic: "They'll pressure you by implying the debt reflects ongoing mental health issues",
          truth: "Past medical debt has no bearing on current mental health status",
          response: "This debt relates to past treatment. Please confine communication to the debt itself without commentary."
        }
      ],
      leveragePoints: [
        {
          leverage: "Mental Health Parity Act Violations",
          explanation: "If insurance denied for reasons they wouldn't apply to physical health, the denial may be illegal.",
          script: "I've documented that this denial applies different standards than my plan uses for physical health claims. This is a federal parity violation."
        },
        {
          leverage: "Network Adequacy Arguments",
          explanation: "If no in-network providers were available, out-of-network care should be covered at in-network rates.",
          script: "There were no in-network providers accepting patients within 30 miles. This out-of-network care should be covered as in-network."
        },
        {
          leverage: "Residential Facility Charity Programs",
          explanation: "Most non-profit treatment facilities have substantial financial assistance - often 50-100% for qualifying patients.",
          script: "I'm applying for financial assistance. Please recall this account from collections while my application is reviewed."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "File Internal Insurance Appeal", timing: "Within 30-60 days of denial", successMetric: "Include clinical documentation of medical necessity" },
        { step: 2, action: "File External Review Request", timing: "If internal appeal denied", successMetric: "Independent medical expert reviews case" },
        { step: 3, action: "Apply for Facility Financial Assistance", timing: "Simultaneously with appeals", successMetric: "May recall debt from collections" },
        { step: 4, action: "File Parity Act Complaint if Applicable", timing: "After denial analysis", successMetric: "State or federal investigation initiated" },
        { step: 5, action: "Negotiate with Collector Using Pending Appeals", timing: "If appeals ongoing", successMetric: "20-35% settlement with pay-for-delete" }
      ]
    },
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
    inCollectionsDefense: {
      title: "Your Ambulance Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify ALS vs BLS Classification Immediately",
          timeline: "Within 7 days",
          why: "Ambulance services often bill ALS (Advanced Life Support) rates when only BLS (Basic Life Support) was provided - this can be a $1,000-$3,000 overcharge."
        },
        {
          action: "Check Mileage Accuracy Against Actual Route",
          timeline: "Within 7 days",
          why: "Ambulances bill per mile. Use Google Maps to verify the distance - padding mileage is a common billing error."
        },
        {
          action: "Invoke No Surprises Act for Air Ambulance",
          timeline: "Immediately if applicable",
          why: "Air ambulance is covered under the No Surprises Act - you can only be billed your in-network cost-sharing amount, potentially eliminating $20,000+ in charges."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim emergency transport is 'non-negotiable'",
          truth: "Ambulance billing has some of the highest error rates and markups in healthcare",
          response: "I'm disputing the service level classification and mileage charges. Please validate these specific items."
        },
        {
          tactic: "They'll emphasize 'life-saving' nature of the transport",
          truth: "Many ambulance transports are not life-threatening emergencies, and billing must still be accurate",
          response: "The nature of the transport doesn't justify incorrect billing. I need validation of ALS medical necessity."
        },
        {
          tactic: "They'll claim No Surprises Act doesn't apply",
          truth: "For air ambulance and many insurance types, federal protections do apply",
          response: "I've verified my insurance type. The No Surprises Act protections apply to this air ambulance bill."
        }
      ],
      leveragePoints: [
        {
          leverage: "ALS vs BLS Documentation",
          explanation: "ALS requires specific interventions (IV, cardiac monitoring, etc.). If these weren't performed, you shouldn't pay ALS rates.",
          script: "The run report shows only BLS-level care was provided. I'm requesting adjustment from ALS to BLS billing, a reduction of approximately $[difference]."
        },
        {
          leverage: "Municipal vs Private Rates",
          explanation: "Municipal ambulances often have resident rates 30-50% lower than private services.",
          script: "As a [city/county] resident, I'm requesting the municipal resident rate be applied to this transport."
        },
        {
          leverage: "State Balance Billing Protections",
          explanation: "Many states have passed ground ambulance balance billing protections. Research your state's laws.",
          script: "Under [State] law, balance billing for ambulance services is restricted. Please adjust this bill to comply with state requirements."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Request Run Report from Ambulance Service", timing: "Within 7 days", successMetric: "Document actual services provided and route taken" },
        { step: 2, action: "Verify Mileage and Service Level", timing: "Within 14 days", successMetric: "Identify any billing errors or overcharges" },
        { step: 3, action: "File No Surprises Act Dispute (Air Ambulance)", timing: "Within 30 days", successMetric: "Bill adjusted to in-network cost-sharing" },
        { step: 4, action: "Apply for Financial Hardship Program", timing: "Within 30 days", successMetric: "Reduction or waiver based on income" },
        { step: 5, action: "Negotiate Settlement at 25-40%", timing: "After documentation gathered", successMetric: "Written pay-for-delete agreement before payment" }
      ]
    },
    expectedOutcome: "30-50% reduction for ground ambulance; potential full coverage for air ambulance under No Surprises Act"
  },
  {
    id: "cancer-treatment-collections",
    title: "Cancer Treatment Bills in Collections",
    icon: Heart,
    situation: "You or a family member underwent cancer treatment including chemotherapy, radiation, surgery, or immunotherapy. Despite insurance, you received massive bills for 'non-covered' treatments, out-of-network oncologists, or experimental therapies. Now bills totaling $50,000-$500,000+ are in collections.",
    insiderKnowledge: [
      "Cancer drugs are marked up 400-600% by hospitals - the same drug at an outpatient infusion center costs a fraction",
      "Many cancer drugs have manufacturer patient assistance programs that cover copays or even full cost",
      "Insurance denials for 'experimental' cancer treatments are often overturned on appeal with oncologist documentation",
      "Hospitals often have special oncology financial assistance programs separate from general charity care",
      "Clinical trials often provide treatment at no cost - and you may have been eligible but not informed"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Request Complete Treatment Records and Itemized Bills",
        details: "Get every bill broken down by CPT code and NDC (drug) codes. Cancer treatment often involves dozens of separate charges that need individual review.",
        script: "I need a complete itemized statement for all cancer treatment including: all drug administrations with NDC codes, all facility fees, all physician charges, and all lab/imaging charges."
      },
      {
        step: 2,
        title: "Check Drug Manufacturer Assistance Programs",
        details: "Most major cancer drug manufacturers have patient assistance programs. Some will pay retroactively for drugs you've already received.",
        programs: "Contact the drug manufacturer directly. Programs like Pfizer RxPathways, Merck Patient Assistance, and Bristol-Myers Squibb Patient Assistance can cover thousands in drug costs."
      },
      {
        step: 3,
        title: "Appeal Any 'Experimental' or 'Not Medically Necessary' Denials",
        details: "Insurance companies frequently deny newer cancer treatments. Your oncologist can provide documentation showing the treatment is standard of care.",
        script: "I am appealing the denial of [treatment]. This treatment is FDA-approved and is standard of care according to NCCN guidelines for [cancer type]. I am requesting a peer-to-peer review with an oncologist."
      },
      {
        step: 4,
        title: "Apply for Oncology-Specific Financial Assistance",
        details: "Many hospitals have separate financial assistance for cancer patients. Additionally, organizations like CancerCare, Patient Advocate Foundation, and HealthWell Foundation provide grants.",
        resources: "Contact hospital oncology social worker, CancerCare (cancercare.org), Patient Advocate Foundation (patientadvocate.org), HealthWell Foundation."
      },
      {
        step: 5,
        title: "Challenge Drug Markup and Facility Fees",
        details: "Hospital cancer centers charge 3-5x more than outpatient infusion centers for the same drugs. Demand price justification.",
        leverage: "Compare your charges to Medicare reimbursement rates for the same drugs/services. Medicare rates are public and can be used as fair market value evidence."
      },
      {
        step: 6,
        title: "Negotiate with Collections Using Hardship and Complexity",
        details: "Cancer debt is complex and collections agencies know these cases often involve ongoing appeals. Use this as leverage.",
        script: "This account involves complex insurance appeals for cancer treatment that are still ongoing. I have applied for manufacturer assistance programs and hospital charity care. I'm prepared to settle for [20-30%] while these processes continue."
      }
    ],
    inCollectionsDefense: {
      title: "Your Cancer Treatment Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Apply for Manufacturer Patient Assistance Programs Immediately",
          timeline: "Within 7 days",
          why: "Most major cancer drug manufacturers have programs that can pay for drugs retroactively - potentially covering thousands in costs even after billing."
        },
        {
          action: "Request Oncology-Specific Financial Assistance from Hospital",
          timeline: "Within 14 days",
          why: "Cancer centers often have special financial assistance programs separate from general charity care, with higher income limits and more generous coverage."
        },
        {
          action: "Appeal Any 'Experimental' or 'Not Medically Necessary' Denials",
          timeline: "Within 30-60 days of denial",
          why: "Insurance denials for cancer treatments are overturned 40-60% of the time on appeal with proper oncologist documentation."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll use emotional pressure about 'life-saving' treatment",
          truth: "Collectors know cancer patients are emotionally vulnerable and may pay quickly without negotiating",
          response: "I appreciate the care I received. That doesn't change that I have rights to dispute billing and apply for assistance."
        },
        {
          tactic: "They'll claim drug costs are 'fixed' and non-negotiable",
          truth: "Hospital drug markups are 400-600% - there's massive room for negotiation",
          response: "I've researched the actual cost of these medications. The markup is significant and I'm requesting fair pricing."
        },
        {
          tactic: "They'll pressure immediate payment to 'resolve' the matter",
          truth: "Assistance programs and appeals take time - don't be rushed into paying before exhausting options",
          response: "I have pending manufacturer assistance applications and insurance appeals. I will not make payment until these are resolved."
        }
      ],
      leveragePoints: [
        {
          leverage: "Drug Manufacturer Assistance Programs",
          explanation: "Companies like Pfizer, Merck, Bristol-Myers Squibb have programs covering copays or full drug costs.",
          script: "I'm applying for [Manufacturer] Patient Assistance Program. Please pause collection while this application is reviewed."
        },
        {
          leverage: "NCCN Guidelines for Medical Necessity",
          explanation: "If treatment follows National Comprehensive Cancer Network guidelines, it's standard of care, not experimental.",
          script: "This treatment follows NCCN guidelines for [cancer type] and is standard of care. The denial citing 'experimental' status is incorrect."
        },
        {
          leverage: "Hospital Drug Markup Abuse",
          explanation: "The same cancer drugs cost 3-5x more at hospital infusion centers than outpatient centers.",
          script: "Medicare reimburses $[amount] for this drug. You charged $[higher amount]. I'm requesting adjustment to fair market rates."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Contact Drug Manufacturers for Assistance", timing: "Within 7 days", successMetric: "Applications submitted for all eligible drugs" },
        { step: 2, action: "Apply for Hospital Oncology Financial Assistance", timing: "Within 14 days", successMetric: "Application under review, debt potentially recalled from collections" },
        { step: 3, action: "File Insurance Appeals with Oncologist Support", timing: "Within 30 days of denial", successMetric: "Peer-to-peer review scheduled" },
        { step: 4, action: "Contact CancerCare and Patient Advocate Foundation", timing: "Within 21 days", successMetric: "Grant applications submitted" },
        { step: 5, action: "Negotiate Remaining Balance at 20-35%", timing: "After assistance determined", successMetric: "Written settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "40-70% reduction through assistance programs, appeals, and negotiation. Some drug costs may be eliminated entirely."
  },
  {
    id: "car-accident-collections",
    title: "Car Accident Medical Bills in Collections",
    icon: AlertTriangle,
    situation: "You were in a car accident and received emergency medical treatment. Now you're getting bills from multiple providers - the ER, ambulance, specialists, and imaging centers. You're confused about whether auto insurance, health insurance, or the other driver's insurance should pay. Bills are going to collections.",
    insiderKnowledge: [
      "Auto insurance medical payments (MedPay) or Personal Injury Protection (PIP) should pay FIRST before health insurance",
      "If another driver was at fault, their liability insurance should ultimately cover your bills - but this can take months/years",
      "Hospitals often file liens against accident settlements - but these liens can be negotiated down significantly",
      "Health insurance may pay but has 'subrogation rights' to be repaid from any settlement",
      "You should NEVER give recorded statements or sign medical authorizations for the other driver's insurance without attorney advice"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Identify All Available Insurance Coverage",
        details: "Determine what coverage applies: your auto MedPay/PIP, your health insurance, the at-fault driver's liability, and any underinsured motorist coverage.",
        priority: "Payment priority is typically: 1) Your MedPay/PIP, 2) Your health insurance, 3) At-fault driver's liability, 4) Your underinsured motorist."
      },
      {
        step: 2,
        title: "File Claims with Your Auto Insurance First",
        details: "MedPay and PIP are 'no-fault' - they pay regardless of who caused the accident. File these claims immediately.",
        script: "I was in an accident on [date] and need to file a claim under my Medical Payments/PIP coverage. Please send claim forms and explain my coverage limits."
      },
      {
        step: 3,
        title: "Inform Medical Providers of Accident Context",
        details: "Tell all providers this is an accident case. Many will agree to defer billing while insurance and liability claims are processed.",
        script: "This injury is from a car accident. I'm filing auto insurance claims and there is a liability claim pending. I request that you defer collection activity until insurance claims are resolved."
      },
      {
        step: 4,
        title: "Consider Consulting a Personal Injury Attorney",
        details: "If another driver was at fault, an attorney can often negotiate medical liens down 30-50% and ensure all bills are covered by settlement.",
        feeStructure: "Most personal injury attorneys work on contingency (25-40% of settlement) and don't charge upfront."
      },
      {
        step: 5,
        title: "Negotiate Hospital Liens if Applicable",
        details: "Hospitals can place liens against accident settlements. These liens are negotiable - often for 50% or less of the original amount.",
        script: "I understand the hospital has placed a lien on my accident settlement. I'm requesting negotiation of this lien amount, as the settlement amount is limited and must cover attorney fees and other providers."
      },
      {
        step: 6,
        title: "If Bills Go to Collections, Assert Pending Claims",
        details: "Collections agencies should not aggressively collect while insurance/legal claims are pending. Document all pending claims.",
        script: "This debt relates to a car accident with pending insurance claims and/or litigation. Collection activity is premature while these claims are being resolved. Please provide your contact information for my insurance company/attorney."
      }
    ],
    inCollectionsDefense: {
      title: "Your Car Accident Medical Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Identify All Available Insurance Coverage Immediately",
          timeline: "Within 7 days",
          why: "MedPay/PIP from your auto policy pays first, health insurance second, at-fault party's liability third. Collections should wait for insurance resolution."
        },
        {
          action: "Inform Collector This is an Accident Case",
          timeline: "Immediately",
          why: "Car accident medical bills have different payment sources and timelines. Aggressive collection is premature while claims are pending."
        },
        {
          action: "Consider Consulting a Personal Injury Attorney",
          timeline: "Within 14 days",
          why: "Attorneys can often negotiate hospital liens down 30-50% and ensure all bills are properly covered by settlement."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim you're personally responsible regardless of fault",
          truth: "While you initially receive the bill, multiple insurance sources typically cover accident injuries",
          response: "This is a car accident case with pending insurance claims. I'm not personally responsible until insurance claims are resolved."
        },
        {
          tactic: "They'll pressure immediate payment while claims are pending",
          truth: "Insurance claims and settlements take months - collectors should not be collecting during this process",
          response: "I have active MedPay/PIP and liability claims. Collection is premature. Here is my attorney's contact information."
        },
        {
          tactic: "They'll threaten credit damage if you don't pay now",
          truth: "Medical debt can't be reported for 1 year, and disputed debt should be noted as such",
          response: "This debt is disputed pending insurance resolution. Any credit reporting must note the dispute status."
        }
      ],
      leveragePoints: [
        {
          leverage: "Pending Insurance Claims",
          explanation: "MedPay, PIP, health insurance, and liability claims create multiple payment sources.",
          script: "I have filed claims with [auto insurance] MedPay and [health insurance]. Additionally, a liability claim is pending against the at-fault driver."
        },
        {
          leverage: "Hospital Lien Negotiation",
          explanation: "Hospitals place liens on accident settlements but these are highly negotiable - often 50% or less.",
          script: "The settlement amount is limited. I'm requesting reduction of the hospital lien to [50%] to allow fair distribution among all providers."
        },
        {
          leverage: "Subrogation Complexity",
          explanation: "Health insurers have subrogation rights, adding complexity that favors patient negotiation.",
          script: "Multiple insurers have subrogation interests in this case. Settlement requires coordination that aggressive collection undermines."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "File All Available Insurance Claims", timing: "Within 7 days", successMetric: "MedPay/PIP and health insurance claims submitted" },
        { step: 2, action: "Notify Providers of Accident Status", timing: "Within 14 days", successMetric: "Billing departments aware, collection deferred" },
        { step: 3, action: "Consult Personal Injury Attorney if Applicable", timing: "Within 30 days", successMetric: "Attorney letter sent to collectors" },
        { step: 4, action: "Negotiate Hospital Liens if Settlement Pending", timing: "Before settlement finalized", successMetric: "Liens reduced 30-50%" },
        { step: 5, action: "Resolve Remaining Balances After Insurance", timing: "After all claims paid", successMetric: "Final settlement with all providers" }
      ]
    },
    expectedOutcome: "Bills covered by auto insurance MedPay/PIP first, remaining bills covered by at-fault party's insurance or negotiated settlement. Hospital liens reduced 30-50%."
  },
  {
    id: "diagnostic-imaging-collections",
    title: "MRI/CT Scan/Lab Work Bills in Collections",
    icon: Target,
    situation: "You had an MRI, CT scan, or extensive lab work ordered by your doctor. Despite having insurance, you received a bill for $2,000-$10,000+ that your insurance barely covered or denied entirely. Now it's in collections.",
    insiderKnowledge: [
      "Hospital-based imaging costs 3-10x more than independent imaging centers for the EXACT same scan",
      "Many imaging bills include a 'facility fee' and 'professional fee' billed separately - you may be double-paying",
      "Insurance often denies imaging as 'not medically necessary' when prior authorization wasn't obtained - but this is often the provider's fault, not yours",
      "Lab work pricing varies wildly - the same blood panel can cost $50 or $5,000 depending on where it's done",
      "Direct-pay imaging centers offer cash prices 70-80% less than hospital rates"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Prior Authorization Was Obtained",
        details: "Many imaging studies require prior authorization. If the provider failed to obtain it, the bill may be THEIR responsibility, not yours.",
        script: "Was prior authorization obtained for this imaging study? If not, I should not be responsible for charges resulting from the provider's failure to follow required authorization procedures."
      },
      {
        step: 2,
        title: "Compare Your Charges to Fair Market Rates",
        details: "Use Healthcare Bluebook or FAIR Health Consumer to see what these tests should cost. Hospital rates are often 5-10x fair market.",
        example: "An MRI that costs $500-$800 at an independent center may be billed at $3,000-$5,000 at a hospital."
      },
      {
        step: 3,
        title: "Check for Duplicate Billing",
        details: "Imaging often generates both a 'technical' fee (for the equipment) and a 'professional' fee (for the radiologist reading). Make sure you're not being billed twice.",
        redFlags: ["Two separate bills for the same date of service", "Both 'facility' and 'professional' components on one bill", "Charges for 'interpretation' when your doctor already reviewed results"]
      },
      {
        step: 4,
        title: "Appeal Insurance Denial if Applicable",
        details: "If your insurance denied coverage, appeal with documentation from your ordering physician explaining medical necessity.",
        script: "I'm appealing the denial of coverage for [imaging study]. This test was medically necessary to diagnose [condition]. I'm attaching a letter of medical necessity from my physician."
      },
      {
        step: 5,
        title: "Request Self-Pay Rate Adjustment",
        details: "If you're paying out of pocket, demand the self-pay rate. This is often 40-60% of the billed amount.",
        script: "I'm requesting adjustment to your self-pay/uninsured rate. Additionally, please provide the rate you would accept from Medicare for this same service."
      },
      {
        step: 6,
        title: "Negotiate with Collections Using Price Comparison",
        details: "Armed with fair market pricing data, negotiate aggressively. Imaging is one of the most over-priced services in healthcare.",
        script: "The fair market rate for this [MRI/CT/lab work] is [amount from Healthcare Bluebook]. The original charge of [billed amount] reflects a [X]% markup. I'm prepared to pay [fair market rate] to settle this account."
      }
    ],
    inCollectionsDefense: {
      title: "Your Imaging/Lab Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Compare Charges to Fair Market Rates",
          timeline: "Within 7 days",
          why: "Hospital imaging costs 3-10x more than independent centers. Use Healthcare Bluebook to document fair pricing for your specific tests."
        },
        {
          action: "Verify Prior Authorization Was Obtained",
          timeline: "Within 14 days",
          why: "If the provider failed to get required prior authorization, they - not you - may be responsible for the denied charges."
        },
        {
          action: "Check for Duplicate Technical/Professional Fees",
          timeline: "Within 7 days",
          why: "Imaging generates separate 'technical' and 'professional' fees - verify you're not being billed twice for the same service."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim imaging prices are 'standard'",
          truth: "Hospital imaging has the largest markup variance in healthcare - prices vary 1000% for identical services",
          response: "I've documented fair market rates for this imaging. Your charges are [X]% above market rate."
        },
        {
          tactic: "They'll say insurance denial is 'your problem'",
          truth: "If prior authorization wasn't obtained, the provider may bear responsibility",
          response: "Please confirm prior authorization was obtained. If not, I dispute my responsibility for this denial."
        },
        {
          tactic: "They'll refuse to negotiate on 'specialized' services",
          truth: "MRIs and CT scans are commodity services with well-established fair market pricing",
          response: "This is a standard [MRI/CT]. Fair market pricing is well-documented and I'm requesting adjustment."
        }
      ],
      leveragePoints: [
        {
          leverage: "Fair Market Value Documentation",
          explanation: "Healthcare Bluebook and FAIR Health provide reference pricing that's often 70-80% below hospital rates.",
          script: "Healthcare Bluebook shows fair price for this [scan] is $[amount]. You charged $[higher amount]. I'm requesting adjustment to fair market rates."
        },
        {
          leverage: "Prior Authorization Failure",
          explanation: "Providers must obtain prior auth when required. Failure shifts liability to them.",
          script: "I've confirmed prior authorization was not obtained as required by my insurance. The provider bears responsibility for this oversight."
        },
        {
          leverage: "Independent Imaging Center Comparison",
          explanation: "Quote the same scan from an independent center to prove hospital overcharging.",
          script: "[Independent center] offers this identical MRI for $[lower price]. Your charge of $[higher price] is [X] times higher for the same service."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Fair Market Pricing", timing: "Within 7 days", successMetric: "Healthcare Bluebook/FAIR Health documentation gathered" },
        { step: 2, action: "Verify Prior Authorization Status", timing: "Within 14 days", successMetric: "Determine if provider failed authorization requirements" },
        { step: 3, action: "Request Self-Pay Rate from Provider", timing: "Within 14 days", successMetric: "Document uninsured/self-pay rate for comparison" },
        { step: 4, action: "Appeal Insurance Denial with Medical Necessity", timing: "If applicable", successMetric: "Coverage reinstated or denial upheld with documentation" },
        { step: 5, action: "Negotiate Settlement at Fair Market Rate", timing: "After research complete", successMetric: "50-70% reduction with pay-for-delete agreement" }
      ]
    },
    expectedOutcome: "50-70% reduction by demonstrating overpricing compared to fair market rates"
  },
  {
    id: "physical-therapy-collections",
    title: "Physical Therapy/Rehabilitation Bills in Collections",
    icon: Users,
    situation: "You underwent physical therapy or rehabilitation after an injury or surgery. Your insurance limited the number of visits or denied coverage, leaving you with bills for $3,000-$20,000+. Now these bills are in collections.",
    insiderKnowledge: [
      "Insurance visit limits are often arbitrary and can be appealed with documentation of medical necessity",
      "PT practices often bill for modalities (heat, ice, electrical stim) that should be included in the session fee",
      "Many PT practices charge hospital-level rates despite being outpatient - these can be challenged",
      "If PT was ordered after surgery, it may be considered part of 'global surgical care' and shouldn't be billed separately",
      "Insurance companies frequently limit PT visits more than medically appropriate - appeals often succeed"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Review Your Insurance Benefits for PT Limits",
        details: "Understand what your plan actually covers. Many plans have annual visit limits, but these can often be exceeded with proper documentation.",
        script: "I need to understand my physical therapy benefits including: annual visit limit, whether visits can be extended with medical necessity documentation, and what the appeal process is for additional visits."
      },
      {
        step: 2,
        title: "Check for Unbundling of Modalities",
        details: "PT practices sometimes bill separately for heat, ice, ultrasound, or electrical stimulation that should be included in the evaluation/treatment codes.",
        redFlags: ["Separate charges for 'therapeutic exercise' AND 'neuromuscular re-education' in same session", "Charges for 'modalities' like hot/cold packs", "Multiple 15-minute units billed when session was shorter"]
      },
      {
        step: 3,
        title: "Appeal Visit Limit Denials",
        details: "If insurance stopped covering after a certain number of visits, your PT and physician can document why additional visits are medically necessary.",
        script: "I'm appealing the denial of PT visits beyond [number]. My physician and physical therapist have documented that continued therapy is medically necessary for [condition/recovery]. I'm requesting an extension of my visit limit."
      },
      {
        step: 4,
        title: "Check if PT Falls Under Global Surgical Period",
        details: "If you had surgery, some post-operative PT may be included in the surgeon's 'global' fee and shouldn't be billed separately.",
        question: "Was this physical therapy ordered as part of post-surgical care? If so, please clarify whether these services fall within the global surgical period."
      },
      {
        step: 5,
        title: "Negotiate Self-Pay Rates for Uncovered Sessions",
        details: "For visits that exceed your insurance limit, negotiate a cash rate. Many PT practices will offer 30-50% discounts for cash payment.",
        script: "For sessions beyond my insurance limit, I'm requesting your self-pay cash rate. I'd like to set up a payment arrangement at a reduced rate since I'm paying out of pocket."
      },
      {
        step: 6,
        title: "Negotiate Collections Based on Documentation Gaps",
        details: "PT billing often has documentation issues. Collections agencies may not have complete records to validate the debt.",
        script: "I'm requesting validation of this debt including: complete visit records, documentation of each service billed, proof of medical necessity for each visit, and evidence that my insurance was properly billed and benefits exhausted."
      }
    ],
    inCollectionsDefense: {
      title: "Your Physical Therapy Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Audit for Unbundled Modality Charges",
          timeline: "Within 7 days",
          why: "PT practices often bill separately for heat, ice, electrical stim, and ultrasound that should be included in the session fee."
        },
        {
          action: "Appeal Insurance Visit Limits with Medical Necessity",
          timeline: "Within 30 days of denial",
          why: "Insurance visit limits are often arbitrary. Appeals with physician documentation frequently succeed in getting additional visits covered."
        },
        {
          action: "Check if PT is Part of Post-Surgical Global Care",
          timeline: "Within 14 days",
          why: "If PT was ordered after surgery, it may be part of the 'global surgical package' and shouldn't be billed separately."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim PT is 'elective' or 'optional'",
          truth: "PT is medically necessary for recovery from many conditions and surgeries",
          response: "Physical therapy was prescribed by my physician as medically necessary treatment. It's not optional."
        },
        {
          tactic: "They'll say insurance visit limits are 'your responsibility'",
          truth: "Visit limits are often appealable, and providers should manage treatment within coverage",
          response: "I'm appealing the visit limits. The provider should have informed me when coverage was exhausted."
        },
        {
          tactic: "They'll refuse to itemize 'bundled' services",
          truth: "You have the right to an itemized bill showing all charges",
          response: "Please provide an itemized bill with CPT codes for each modality and service charged."
        }
      ],
      leveragePoints: [
        {
          leverage: "Modality Unbundling Disputes",
          explanation: "Heat, ice, electrical stim during a PT session should be included in the visit fee, not billed separately.",
          script: "I'm disputing separate charges for modalities that should be bundled with the PT session. Please adjust billing to reflect standard bundling practices."
        },
        {
          leverage: "Post-Surgical Global Period",
          explanation: "PT within 90 days of surgery may be included in the surgeon's global fee.",
          script: "This physical therapy was ordered following surgery on [date]. Please verify this is not included in the surgical global period."
        },
        {
          leverage: "Self-Pay Rate Availability",
          explanation: "PT practices often have significant self-pay discounts - sometimes 40-60% off billed rates.",
          script: "I'm requesting your self-pay rate for these services. What discount can you offer for payment in full?"
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Request Itemized Bill with CPT Codes", timing: "Within 7 days", successMetric: "Identify unbundled modality charges" },
        { step: 2, action: "File Insurance Appeal for Visit Limits", timing: "Within 30 days", successMetric: "Additional visits approved or medical necessity documented" },
        { step: 3, action: "Check Post-Surgical Global Period", timing: "If applicable", successMetric: "Verify PT not double-billed" },
        { step: 4, action: "Request Self-Pay Rate from Provider", timing: "Within 14 days", successMetric: "Obtain discounted self-pay pricing" },
        { step: 5, action: "Negotiate Settlement at 40-60%", timing: "After documentation complete", successMetric: "Written pay-for-delete agreement" }
      ]
    },
    expectedOutcome: "30-50% reduction through appeal of visit limits, self-pay rate negotiation, and billing audit"
  },
  {
    id: "prescription-drug-collections",
    title: "Prescription Drug/Pharmacy Bills in Collections",
    icon: Briefcase,
    situation: "You received expensive specialty medications (biologics, cancer drugs, HIV medications, etc.) and your insurance either didn't cover them or required massive copays. Now pharmacy bills for $5,000-$50,000+ are in collections.",
    insiderKnowledge: [
      "Nearly every expensive drug has a manufacturer copay assistance or patient assistance program - most patients don't know to apply",
      "Specialty pharmacies have huge markups compared to manufacturer pricing - always compare options",
      "Many 'specialty tier' drugs can be obtained through manufacturer patient assistance for free or reduced cost",
      "Copay accumulator programs used by insurers are being banned in many states - check your state's laws",
      "Prior authorization denials for medications are frequently overturned on appeal with physician documentation"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Check Manufacturer Patient Assistance Programs",
        details: "Almost every expensive drug manufacturer offers assistance. Some provide drugs free; others cover copays. These programs can often be applied retroactively.",
        resources: "Visit manufacturer websites or use needymeds.org to find programs. Programs include: Pfizer RxPathways, Johnson & Johnson Patient Assistance, AbbVie myAbbVie Assist."
      },
      {
        step: 2,
        title: "Review Insurance Formulary and Appeal if Needed",
        details: "If your insurance denied or limited coverage, verify the drug's formulary tier and appeal if a less expensive alternative isn't medically appropriate.",
        script: "I'm appealing the denial/restriction of [medication]. My physician has documented that this specific medication is required because [reason - failed other treatments, specific condition, etc.]. I'm requesting a formulary exception."
      },
      {
        step: 3,
        title: "Explore Alternative Pharmacies and Pricing",
        details: "Specialty pharmacy pricing varies dramatically. Compare prices at different pharmacies and consider manufacturer direct programs.",
        tip: "GoodRx, RxAssist, and Mark Cuban's Cost Plus Drugs can show dramatically lower prices for many medications."
      },
      {
        step: 4,
        title: "Check for Copay Accumulator Programs",
        details: "Some insurers don't count manufacturer copay assistance toward your deductible. Many states have banned this practice.",
        states_banned: "States banning copay accumulators include: Arizona, Illinois, Kentucky, Louisiana, Oklahoma, Tennessee, Virginia, and West Virginia."
      },
      {
        step: 5,
        title: "Apply for Foundation Assistance",
        details: "Organizations like PAN Foundation, HealthWell Foundation, and Patient Advocate Foundation provide grants for medication costs.",
        application: "Apply at panfoundation.org, healthwellfoundation.org, or patientadvocate.org. Grants can cover thousands in copays."
      },
      {
        step: 6,
        title: "Negotiate with Collections",
        details: "Pharmacy collections are often handled by the specialty pharmacy's internal collections or third parties. They have significant room to negotiate.",
        script: "I'm prepared to settle this pharmacy debt for [30-40%]. I was not informed of available manufacturer assistance programs at the time these medications were dispensed. I have since applied for patient assistance and am requesting a reduced settlement."
      }
    ],
    inCollectionsDefense: {
      title: "Your Prescription Drug Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Apply for Manufacturer Patient Assistance Immediately",
          timeline: "Within 7 days",
          why: "Most major drug manufacturers have patient assistance programs that can provide medications free or cover costs retroactively."
        },
        {
          action: "Check for Copay Assistance Programs",
          timeline: "Within 7 days",
          why: "Organizations like PAN Foundation, HealthWell Foundation, and Patient Access Network offer grants for medication costs."
        },
        {
          action: "Verify Pricing Against GoodRx and Other Discounters",
          timeline: "Immediately",
          why: "The same medication can cost 90% less with discount programs - use this as negotiation leverage."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim drug prices are 'non-negotiable'",
          truth: "Drug markups vary wildly and manufacturer assistance can eliminate costs entirely",
          response: "I'm pursuing manufacturer patient assistance. These programs can provide medications at no cost."
        },
        {
          tactic: "They'll pressure quick payment before assistance kicks in",
          truth: "Many assistance programs pay retroactively - don't be rushed",
          response: "My patient assistance application is pending. I will not pay until that process is complete."
        },
        {
          tactic: "They'll claim you 'already received' the medication",
          truth: "Receiving medication doesn't mean the price was fair or that assistance isn't available",
          response: "I'm disputing the pricing, not the service. Manufacturer assistance may cover this cost retroactively."
        }
      ],
      leveragePoints: [
        {
          leverage: "Manufacturer Patient Assistance Programs",
          explanation: "Companies like Pfizer, Lilly, Merck, and others have programs for uninsured/underinsured patients.",
          script: "I'm applying for [Manufacturer] Patient Assistance Program. This program may cover the full cost of this medication."
        },
        {
          leverage: "GoodRx/Discount Card Pricing",
          explanation: "If the same medication is available for 80% less through discount programs, you shouldn't pay full price.",
          script: "This medication is available for $[GoodRx price] through discount programs. Your charge of $[higher price] is [X]% higher."
        },
        {
          leverage: "Foundation Grant Programs",
          explanation: "PAN Foundation, HealthWell, and others offer grants specifically for medication costs.",
          script: "I've applied for grant assistance through [Foundation]. Please pause collection while my application is reviewed."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Manufacturer Assistance Programs", timing: "Within 3 days", successMetric: "Identify all applicable programs" },
        { step: 2, action: "Apply for All Eligible Assistance", timing: "Within 7 days", successMetric: "Applications submitted" },
        { step: 3, action: "Compare Pricing to Discount Programs", timing: "Within 7 days", successMetric: "Document fair market pricing" },
        { step: 4, action: "Apply for Foundation Grants if Eligible", timing: "Within 14 days", successMetric: "Grant applications submitted" },
        { step: 5, action: "Negotiate Based on Assistance Pending", timing: "After applications submitted", successMetric: "Settlement or full coverage through assistance" }
      ]
    },
    expectedOutcome: "Retroactive manufacturer assistance may cover entire cost; otherwise 40-60% reduction through negotiation"
  },
  {
    id: "urgent-care-collections",
    title: "Urgent Care Bill in Collections (Was It Really Urgent Care?)",
    icon: Building2,
    situation: "You went to what you thought was a regular urgent care but received a bill for thousands of dollars - far more than typical urgent care pricing. Often this happens because the 'urgent care' was actually hospital-affiliated and billed at ER rates.",
    insiderKnowledge: [
      "Many hospital 'urgent cares' are technically emergency departments and bill at ER rates - this is often deceptive",
      "Freestanding ERs (often in strip malls) look like urgent cares but charge 5-10x more",
      "If a facility is designated as an ER, they add a 'facility fee' that can be hundreds or thousands of dollars",
      "True independent urgent cares typically charge $100-$300; hospital-affiliated can charge $1,000-$3,000+ for the same services",
      "Some states require freestanding ERs to clearly disclose their status and pricing - check your state"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Determine the Facility Type",
        details: "Find out if the facility is a true urgent care, hospital-affiliated urgent care, or freestanding ER. This affects your rights and appeal options.",
        script: "I need to understand the licensing status of this facility. Is this facility licensed as an urgent care center or as a freestanding emergency room/department?"
      },
      {
        step: 2,
        title: "Check for Required Disclosures",
        details: "Some states require ERs and freestanding ERs to clearly disclose their status and that higher charges may apply. If they failed to disclose, you may have grounds to dispute.",
        states_with_disclosure: "Texas, Colorado, Ohio, and other states have specific disclosure requirements for freestanding ERs."
      },
      {
        step: 3,
        title: "Compare Charges to True Urgent Care Pricing",
        details: "Research what typical urgent cares charge for similar services. Use this as leverage to argue the charges are unreasonable.",
        benchmark: "Typical urgent care visit: $100-$300. Typical freestanding ER for same complaint: $1,000-$3,000+."
      },
      {
        step: 4,
        title: "Challenge Facility Fees",
        details: "Hospital-affiliated facilities often add massive 'facility fees' for using their space. Challenge whether these fees were disclosed and appropriate.",
        script: "I was not informed that this facility charges hospital-level facility fees. I request removal or reduction of facility fees as I would have sought care elsewhere had I known."
      },
      {
        step: 5,
        title: "File Complaints if Deceptively Marketed",
        details: "If the facility marketed itself as an urgent care but charged ER prices, file complaints with your state attorney general and health department.",
        complaint: "Document signage, marketing materials, and any verbal representations made about the facility's nature and pricing."
      },
      {
        step: 6,
        title: "Negotiate Based on Reasonable Charges",
        details: "Argue that regardless of facility type, you should only pay what a reasonable urgent care would charge for the same services.",
        script: "I went to this facility believing it was a standard urgent care. The services I received [describe visit] would cost $[150-300] at a typical urgent care. I'm prepared to pay that amount, not the inflated charges being claimed."
      }
    ],
    inCollectionsDefense: {
      title: "Your Urgent Care Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify You Weren't Billed as Emergency Room",
          timeline: "Within 7 days",
          why: "Many 'urgent care' centers are actually hospital-affiliated and bill ER-level facility fees. This can be 3-5x higher than true urgent care."
        },
        {
          action: "Check for Hidden Facility Fees",
          timeline: "Within 7 days",
          why: "Hospital-based urgent cares charge separate 'facility fees' in addition to physician charges - often without disclosure."
        },
        {
          action: "Compare to Actual Urgent Care Pricing",
          timeline: "Within 14 days",
          why: "True urgent care visits cost $100-$300. If you're being billed $1,000+, you were likely charged hospital rates."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim the facility was 'clearly identified'",
          truth: "Many patients don't realize urgent cares are hospital-affiliated until they receive the bill",
          response: "The facility presented as an urgent care center. I was not informed of hospital-level billing before treatment."
        },
        {
          tactic: "They'll say facility fees are 'standard'",
          truth: "True urgent care centers don't charge facility fees - only hospital-affiliated ones do",
          response: "Standalone urgent cares don't charge facility fees. This charge reflects hospital affiliation that wasn't disclosed."
        },
        {
          tactic: "They'll claim you consented to charges",
          truth: "Financial consent under medical stress is often not truly informed consent",
          response: "I sought routine urgent care and was not informed I'd be billed at hospital rates."
        }
      ],
      leveragePoints: [
        {
          leverage: "Facility Fee Disclosure Failure",
          explanation: "Many states require disclosure of facility fees before treatment. Check your state's requirements.",
          script: "I was not informed of hospital facility fees before treatment as required by [state law/transparency requirements]."
        },
        {
          leverage: "True Urgent Care Pricing Comparison",
          explanation: "Compare your bill to standalone urgent care pricing to demonstrate overcharging.",
          script: "Standalone urgent care visits cost $100-$300. Your bill of $[amount] reflects undisclosed hospital-level billing."
        },
        {
          leverage: "No Surprises Act Good Faith Estimate",
          explanation: "You may have been entitled to a Good Faith Estimate. If not provided, this is a violation.",
          script: "I was not provided a Good Faith Estimate as required by the No Surprises Act before receiving non-emergency care."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify Facility Type and Affiliation", timing: "Within 7 days", successMetric: "Determine if hospital-based urgent care" },
        { step: 2, action: "Identify Facility Fee Charges", timing: "Within 7 days", successMetric: "Separate physician vs facility fees" },
        { step: 3, action: "Check State Disclosure Requirements", timing: "Within 14 days", successMetric: "Document any disclosure violations" },
        { step: 4, action: "Compare to True Urgent Care Pricing", timing: "Within 14 days", successMetric: "Document fair market rates" },
        { step: 5, action: "Negotiate to Urgent Care-Level Rates", timing: "After research complete", successMetric: "50-75% reduction with pay-for-delete" }
      ]
    },
    expectedOutcome: "50-75% reduction by challenging facility fee deception and negotiating to true urgent care rates"
  },
  {
    id: "out-of-network-collections",
    title: "Out-of-Network Bill at In-Network Facility",
    icon: AlertCircle,
    situation: "You carefully chose an in-network hospital or surgery center, but received surprise bills from out-of-network providers (anesthesiologists, radiologists, pathologists, assistant surgeons) who treated you there. Now these bills are in collections.",
    insiderKnowledge: [
      "The No Surprises Act (effective 2022) makes most of these surprise bills ILLEGAL - you cannot be balance billed",
      "You can ONLY be charged your in-network cost-sharing amount for out-of-network providers at in-network facilities",
      "Many providers and collection agencies are STILL sending balance bills hoping patients don't know the law",
      "If you received care before 2022, state laws may still protect you - check your state's surprise billing law",
      "The provider dispute is between the provider and your insurance - YOU should not be in the middle"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Invoke Your No Surprises Act Rights",
        details: "Send a written notice to the provider/collections agency citing the No Surprises Act. This bill is likely illegal.",
        script: "Under the No Surprises Act (Public Law 116-260), I cannot be balance billed for out-of-network services provided at an in-network facility without my prior consent. I am requesting immediate adjustment of this bill to my in-network cost-sharing amount only."
      },
      {
        step: 2,
        title: "Verify You Didn't Sign a Waiver",
        details: "Providers can only balance bill if you signed a consent waiver at least 72 hours before non-emergency care. Emergency care cannot be waived.",
        important: "Even if you signed something at check-in, it likely doesn't qualify as valid consent under the Act's requirements."
      },
      {
        step: 3,
        title: "Contact Your Insurance Company",
        details: "Inform your insurer of the improper balance bill. They should process the claim as in-network and notify the provider of proper payment.",
        script: "I'm receiving a balance bill from [provider] for services at in-network [facility]. This appears to violate the No Surprises Act. Please reprocess this claim as in-network and notify the provider."
      },
      {
        step: 4,
        title: "File a Complaint with HHS",
        details: "The Department of Health and Human Services enforces the No Surprises Act. File a complaint if the provider doesn't comply.",
        where: "File at cms.gov/nosurprises or call 1-800-985-3059"
      },
      {
        step: 5,
        title: "Document Everything for Collections Response",
        details: "If the bill is already in collections, send the collection agency copies of your No Surprises Act dispute and any insurance communications.",
        script: "This debt is disputed under the No Surprises Act. The provider is prohibited from balance billing me for out-of-network services at an in-network facility. I am attaching my dispute correspondence and request you cease collection activity."
      },
      {
        step: 6,
        title: "Consult an Attorney if Needed",
        details: "If providers or collections agencies persist despite the law, an attorney can send a demand letter and potentially pursue damages.",
        damages: "Violations of the No Surprises Act may entitle you to actual damages, attorney fees, and other relief."
      }
    ],
    inCollectionsDefense: {
      title: "Your Out-of-Network Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Invoke No Surprises Act Protections Immediately",
          timeline: "Within 7 days",
          why: "If you received out-of-network care at an in-network facility, or emergency care, you're protected from balance billing under federal law."
        },
        {
          action: "Verify Network Status at Time of Service",
          timeline: "Within 7 days",
          why: "Providers sometimes incorrectly bill as out-of-network when they were actually in-network, or when network changed."
        },
        {
          action: "Check if Network Adequacy Rules Apply",
          timeline: "Within 14 days",
          why: "If no in-network providers were available, insurance may be required to cover out-of-network care at in-network rates."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim you 'chose' out-of-network care",
          truth: "Many out-of-network situations are involuntary - especially in emergencies or at hospitals",
          response: "I had no choice of providers. This was [emergency/at in-network facility]. The No Surprises Act applies."
        },
        {
          tactic: "They'll say balance billing is 'legal'",
          truth: "The No Surprises Act banned most balance billing for emergency and hospital-based care",
          response: "Balance billing is prohibited under the No Surprises Act for this type of care."
        },
        {
          tactic: "They'll pressure payment before you dispute",
          truth: "You have 30 days to initiate a dispute under the No Surprises Act",
          response: "I'm formally disputing this balance bill under the No Surprises Act. Please cease collection until resolved."
        }
      ],
      leveragePoints: [
        {
          leverage: "No Surprises Act Protection",
          explanation: "Federal law protects patients from balance billing for most emergency and hospital-based out-of-network care.",
          script: "Under the No Surprises Act, I can only be charged my in-network cost-sharing amount. Please adjust this bill accordingly."
        },
        {
          leverage: "Network Adequacy Arguments",
          explanation: "If no in-network providers were available, insurers must treat out-of-network care as in-network.",
          script: "There were no in-network providers accepting new patients within [miles]. This care should be covered at in-network rates."
        },
        {
          leverage: "Independent Dispute Resolution",
          explanation: "The No Surprises Act provides a formal dispute process if providers don't comply.",
          script: "I will pursue Independent Dispute Resolution if this bill is not adjusted to my in-network cost-sharing amount."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify No Surprises Act Applicability", timing: "Within 7 days", successMetric: "Confirm protection applies to your situation" },
        { step: 2, action: "File Formal No Surprises Act Dispute", timing: "Within 30 days", successMetric: "Dispute on record with provider and insurer" },
        { step: 3, action: "Request In-Network Rate from Insurance", timing: "Within 14 days", successMetric: "Determine what you should owe" },
        { step: 4, action: "Initiate IDR Process if Needed", timing: "If dispute not resolved", successMetric: "Independent arbiter reviews case" },
        { step: 5, action: "Pay Only In-Network Cost-Sharing", timing: "After dispute resolved", successMetric: "Balance billing eliminated" }
      ]
    },
    expectedOutcome: "Bill reduced to in-network cost-sharing only. Balance billing eliminated if No Surprises Act applies."
  },
  {
    id: "deceased-family-member-collections",
    title: "Medical Bills for Deceased Family Member",
    icon: Heart,
    situation: "A family member passed away, and now debt collectors are contacting you about their medical bills. They may be telling you that you're responsible for the debt. Collections calls are happening during a time of grief.",
    insiderKnowledge: [
      "In most cases, family members are NOT personally responsible for a deceased person's medical debt",
      "Collectors CANNOT legally collect from relatives unless they co-signed, are a surviving spouse in certain states, or are the estate executor",
      "Community property states (9 states) may hold surviving spouses responsible for debts incurred during marriage",
      "Collectors use aggressive tactics on grieving families hoping they don't know their rights",
      "Debts must be paid from the ESTATE, not from relatives' personal funds"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Understand Who is Actually Responsible",
        details: "Generally, only the estate is responsible. You're personally responsible only if: you co-signed, you're a spouse in a community property state, or you're the executor and pay from estate funds improperly.",
        communityPropertyStates: "Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin"
      },
      {
        step: 2,
        title: "Do Not Admit Responsibility or Make Payments",
        details: "Making any payment, even a small one, may create liability where none existed. Do not agree to be responsible or make 'goodwill' payments.",
        warning: "Collectors may pressure you by saying 'just make a small payment to show good faith.' This is a trap."
      },
      {
        step: 3,
        title: "Provide Only Necessary Information",
        details: "You only need to confirm the death and, if applicable, provide estate executor contact information. You don't need to discuss finances or payment.",
        script: "[Name] passed away on [date]. I am not personally responsible for this debt. If you are making a claim against the estate, please submit it to [probate court/executor address]."
      },
      {
        step: 4,
        title: "Know Your Right to Limit Contact",
        details: "Under the FDCPA, you can demand collectors stop contacting you. If they continue, they're violating federal law.",
        script: "I am demanding that you cease all communication with me regarding this debt. Under the FDCPA, I have the right to request no further contact. This is my formal request."
      },
      {
        step: 5,
        title: "If You're the Executor, Handle Properly",
        details: "If you're handling the estate, debts are paid from estate assets in order of priority. Medical debt typically has lower priority than secured debts and funeral expenses.",
        priority: "Typical priority: 1) Secured debts, 2) Funeral/estate admin costs, 3) Federal debts, 4) Medical/unsecured debts"
      },
      {
        step: 6,
        title: "File Complaints for Harassment",
        details: "If collectors continue improper contact or make false claims about your responsibility, file CFPB and state attorney general complaints.",
        document: "Keep records of all calls, including: date, time, caller name/company, claims made, and any threatening or harassing language."
      }
    ],
    inCollectionsDefense: {
      title: "Deceased Family Member's Medical Bill is in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Do NOT Acknowledge Personal Responsibility",
          timeline: "Immediately",
          why: "You are generally NOT personally liable for a deceased person's medical debt. Any payment or acknowledgment may create liability where none existed."
        },
        {
          action: "Demand Written Documentation of Your Alleged Obligation",
          timeline: "Within 7 days",
          why: "Collectors must prove YOU are legally responsible - not just that the deceased owed the debt."
        },
        {
          action: "Request Cease Contact If You're Not the Executor",
          timeline: "Immediately",
          why: "Under the FDCPA, you can demand collectors stop contacting you if you have no legal obligation."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim 'family is responsible' for medical bills",
          truth: "Generally false - only the estate, co-signers, or spouses in community property states are responsible",
          response: "I am not personally responsible for this debt. Provide documentation proving I have a legal obligation."
        },
        {
          tactic: "They'll pressure during grief to get quick payment",
          truth: "Collectors exploit grief to get payments before families know their rights",
          response: "I'm grieving and will not discuss this now. Put your claim in writing to the estate executor."
        },
        {
          tactic: "They'll claim you'll 'inherit the debt'",
          truth: "Debt is not inherited in the US - debts are paid from the estate only",
          response: "Debts are not inherited. This debt must be claimed against the estate through proper legal channels."
        }
      ],
      leveragePoints: [
        {
          leverage: "No Personal Guarantee Documentation",
          explanation: "Unless you co-signed or are a spouse in a community property state, you have no personal liability.",
          script: "Please provide documentation showing I personally guaranteed this debt or have legal responsibility. Without such documentation, I am not liable."
        },
        {
          leverage: "Improper Collection from Non-Debtors",
          explanation: "Collecting from someone who doesn't owe the debt is an FDCPA violation.",
          script: "Attempting to collect a debt from someone who is not liable is a violation of the FDCPA. Cease contact or face a complaint."
        },
        {
          leverage: "Estate Probate Process",
          explanation: "Medical debts must be claimed through estate probate, not directly from family.",
          script: "Submit your claim to the estate through proper probate channels. The executor's contact is [info]. Do not contact me again."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify Your Relationship to the Debt", timing: "Within 3 days", successMetric: "Determine if you have any legal responsibility" },
        { step: 2, action: "Demand Collector Prove Your Liability", timing: "Within 7 days", successMetric: "Collector must provide documentation" },
        { step: 3, action: "Request Cease Contact if Not Liable", timing: "If not responsible", successMetric: "Written cease and desist sent" },
        { step: 4, action: "Direct Claims to Estate/Executor", timing: "If estate exists", successMetric: "Proper probate process followed" },
        { step: 5, action: "File FDCPA Complaint if Harassment Continues", timing: "If collector persists", successMetric: "CFPB complaint filed" }
      ]
    },
    expectedOutcome: "Confirmation of non-responsibility for family members. Estate debts handled properly through probate process."
  },
  {
    id: "nursing-home-collections",
    title: "Nursing Home/Long-Term Care Bills in Collections",
    icon: Building2,
    situation: "You or a family member received nursing home or long-term care services. Medicare/Medicaid didn't cover as expected, private pay rates were astronomical, or there are disputes about level of care. Now bills for $10,000-$100,000+ are in collections.",
    insiderKnowledge: [
      "Nursing homes often illegally require family members to personally guarantee payment - this may be void under federal law",
      "Medicare covers only 100 days of skilled nursing after a hospital stay - many patients and families aren't told this",
      "Medicaid 'spend-down' rules are complex and nursing homes often fail to help families navigate them properly",
      "Private pay rates are often 30-50% higher than what Medicaid pays for the same care",
      "Many nursing home contracts include illegal clauses that can be challenged"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Review the Admission Agreement Carefully",
        details: "Check if you were required to personally guarantee payment. Under federal law (42 CFR 483.15), nursing homes CANNOT require third-party guarantees as a condition of admission for Medicaid/Medicare residents.",
        illegal: "If the facility required a family member to guarantee payment as a condition of admission, that clause may be void."
      },
      {
        step: 2,
        title: "Verify Medicare Coverage Was Properly Applied",
        details: "Medicare covers 20 days fully and days 21-100 with copay for skilled nursing. Confirm your family member received proper skilled care and Medicare was billed correctly.",
        script: "Please provide documentation of: qualifying hospital stay, skilled nursing certifications, Medicare claims submitted, and explanation of any coverage denials."
      },
      {
        step: 3,
        title: "Check Medicaid Eligibility and Application",
        details: "If the resident became Medicaid-eligible during their stay, the nursing home should have helped with the application. Medicaid can cover care retroactively.",
        retroactive: "Medicaid coverage can be retroactive up to 3 months before the application date."
      },
      {
        step: 4,
        title: "Challenge Private Pay Rate Differential",
        details: "If you're being charged private pay rates but the resident was Medicaid-eligible, dispute the rate differential.",
        script: "During [time period], the resident was Medicaid-eligible. I am requesting adjustment of charges to the Medicaid rate for that period, plus a refund of any overpayment."
      },
      {
        step: 5,
        title: "Report Illegal Personal Guarantee Requirements",
        details: "If you were illegally required to guarantee payment, file complaints with the state long-term care ombudsman and state attorney general.",
        contact: "Find your state ombudsman at ltcombudsman.org"
      },
      {
        step: 6,
        title: "Negotiate Based on Medicaid Rate",
        details: "If negotiating with collections, use the Medicaid rate as your benchmark for fair pricing.",
        script: "The Medicaid reimbursement rate for this level of care is approximately $[amount] per day. The private pay rate of $[higher amount] represents an unreasonable markup. I'm prepared to settle based on a rate closer to the Medicaid rate."
      }
    ],
    inCollectionsDefense: {
      title: "Your Nursing Home Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Challenge Any Personal Guarantee You Were Required to Sign",
          timeline: "Within 14 days",
          why: "Under federal law (42 CFR 483.15), nursing homes CANNOT require third-party guarantees for Medicare/Medicaid residents. Many 'guarantees' are void."
        },
        {
          action: "Apply for Retroactive Medicaid If Applicable",
          timeline: "Within 30 days",
          why: "Medicaid can cover nursing home care retroactively up to 3 months before application date."
        },
        {
          action: "Challenge Private Pay vs Medicaid Rate Differential",
          timeline: "Within 14 days",
          why: "If the resident was Medicaid-eligible, you shouldn't be charged inflated private pay rates."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim you 'signed a guarantee'",
          truth: "Third-party guarantees are often illegal for Medicare/Medicaid residents",
          response: "This guarantee may be void under 42 CFR 483.15. I'm challenging its enforceability."
        },
        {
          tactic: "They'll claim private pay rates are 'what's owed'",
          truth: "Medicaid rates are 30-50% lower - if resident was eligible, that's the fair rate",
          response: "The resident was Medicaid-eligible during this period. The Medicaid rate should apply."
        },
        {
          tactic: "They'll threaten collection against family members",
          truth: "Only guarantors, spouses, or estate executors have potential liability",
          response: "I am not personally responsible unless I signed a valid guarantee. Prove my liability."
        }
      ],
      leveragePoints: [
        {
          leverage: "Illegal Third-Party Guarantee",
          explanation: "Federal law prohibits nursing homes from requiring third parties to guarantee payment for Medicare/Medicaid residents.",
          script: "The guarantee I signed was a condition of admission for a Medicaid-eligible resident. This violates 42 CFR 483.15 and may be void."
        },
        {
          leverage: "Medicaid Rate Benchmark",
          explanation: "Use the Medicaid rate as fair market value for negotiation - private pay rates are 30-50% higher.",
          script: "Medicaid pays $[rate] per day for this level of care. Your charge of $[higher rate] is excessive. I'll settle at the Medicaid rate."
        },
        {
          leverage: "Long-Term Care Ombudsman",
          explanation: "State ombudsmen investigate nursing home billing and contract issues.",
          script: "I'm filing a complaint with the state long-term care ombudsman regarding illegal guarantee requirements and billing practices."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Review Admission Agreement for Guarantee Clause", timing: "Within 7 days", successMetric: "Identify if guarantee was illegally required" },
        { step: 2, action: "Check Medicaid Eligibility During Stay", timing: "Within 14 days", successMetric: "Determine if Medicaid rate should apply" },
        { step: 3, action: "File Complaint with State Ombudsman if Violations Found", timing: "Within 30 days", successMetric: "Investigation initiated" },
        { step: 4, action: "Challenge Private Pay Rate Differential", timing: "Within 14 days", successMetric: "Request adjustment to Medicaid rates" },
        { step: 5, action: "Negotiate Settlement at Medicaid Rates", timing: "After research complete", successMetric: "30-50% reduction with pay-for-delete" }
      ]
    },
    expectedOutcome: "30-50% reduction by challenging illegal guarantees and excessive private pay rates. Possible Medicaid retroactive coverage."
  },
  {
    id: "durable-medical-equipment-collections",
    title: "Medical Equipment (CPAP, Wheelchair, Prosthetics) Bills in Collections",
    icon: Briefcase,
    situation: "You received durable medical equipment like a CPAP machine, wheelchair, prosthetic limb, or hospital bed. Insurance covered less than expected, or you were charged retail prices that were shockingly high. Now bills for $2,000-$20,000+ are in collections.",
    insiderKnowledge: [
      "DME is one of the most overpriced categories in healthcare - markups of 300-500% are standard",
      "Many DME suppliers bill for 'rental' when purchase would be cheaper, or vice versa",
      "The same CPAP machine that costs $600 retail is often billed at $2,000-$4,000 to insurance",
      "Medicare/Medicaid rates for DME are public and can be used to negotiate fair pricing",
      "DME suppliers often fail to obtain proper prior authorization, making them responsible for denials"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Compare Billed Price to Retail",
        details: "Research the retail price of your equipment on Amazon, manufacturer websites, or DME comparison sites. The billed price is often 3-5x higher.",
        example: "A CPAP machine that retails for $600-$800 may be billed at $2,500-$4,000. A standard wheelchair that costs $150-$300 may be billed at $1,000+."
      },
      {
        step: 2,
        title: "Verify Prior Authorization Was Obtained",
        details: "Most DME requires prior authorization. If the supplier failed to obtain it, they bear responsibility for any denial - not you.",
        script: "Was prior authorization obtained before this equipment was provided? If not, I should not be responsible for charges resulting from the supplier's failure to follow authorization requirements."
      },
      {
        step: 3,
        title: "Check Rent vs. Purchase Terms",
        details: "DME is often rented monthly, but after a 'cap rental' period (usually 13 months for Medicare), you should own the equipment. Verify you're not still being charged rent after ownership.",
        question: "Has this equipment met the cap rental period? Please provide documentation of total rental payments and confirm whether I now own the equipment."
      },
      {
        step: 4,
        title: "Request Medicare/Medicaid Rate Comparison",
        details: "Ask what the supplier would accept from Medicare/Medicaid for the same equipment. This is often 50-70% less than what they're charging you.",
        script: "I'm requesting the Medicare allowable rate for this equipment. I believe the billed charges exceed reasonable market rates and am requesting adjustment to a fair price."
      },
      {
        step: 5,
        title: "Appeal Insurance Denials with Medical Necessity",
        details: "If insurance denied coverage, appeal with documentation from your physician explaining why the specific equipment is medically necessary.",
        script: "I'm appealing the denial of [equipment]. My physician has documented that this equipment is medically necessary for [condition]. I'm attaching the certificate of medical necessity and requesting coverage."
      },
      {
        step: 6,
        title: "Negotiate with Collections Using Fair Market Evidence",
        details: "Present retail pricing and Medicare rates as evidence of fair market value. Offer to pay a reasonable amount based on these benchmarks.",
        script: "The retail price for this [equipment] is approximately $[retail price]. The Medicare allowable amount is approximately $[Medicare rate]. The billed amount of $[bill amount] is [X]% higher. I'm prepared to settle for $[fair price]."
      }
    ],
    inCollectionsDefense: {
      title: "Your DME/Medical Equipment Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Compare Billed Price to Retail and Medicare Rates",
          timeline: "Within 7 days",
          why: "DME has markups of 300-500%. The same CPAP or wheelchair costs a fraction at retail compared to what was billed."
        },
        {
          action: "Verify Prior Authorization Was Obtained",
          timeline: "Within 14 days",
          why: "If the supplier failed to get required prior authorization, they - not you - may be responsible for the insurance denial."
        },
        {
          action: "Check Rent vs Purchase Status",
          timeline: "Within 7 days",
          why: "After 13 months of rental (Medicare cap), you own the equipment. Verify you're not being charged rent after ownership."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim equipment prices are 'standard medical rates'",
          truth: "DME is one of the most overpriced categories - markups of 300-500% are common",
          response: "I've researched retail pricing. This equipment sells for $[retail] - you billed $[much higher]."
        },
        {
          tactic: "They'll say insurance denial is 'your problem'",
          truth: "Prior authorization failures are the supplier's responsibility",
          response: "The supplier failed to obtain prior authorization. They bear responsibility for this denial."
        },
        {
          tactic: "They'll claim you're still 'renting' the equipment",
          truth: "After the cap rental period, ownership transfers to you",
          response: "I've exceeded the cap rental period and now own this equipment. Cease charging rent."
        }
      ],
      leveragePoints: [
        {
          leverage: "Retail Pricing Comparison",
          explanation: "The same equipment is available for 60-80% less at retail - use this as fair market value.",
          script: "This [CPAP/wheelchair/etc.] retails for $[price] on Amazon/manufacturer site. Your charge of $[higher price] is [X]% above fair market."
        },
        {
          leverage: "Medicare Allowable Rate",
          explanation: "Medicare rates are public and represent reasonable pricing. Use as negotiation benchmark.",
          script: "Medicare allows $[amount] for this equipment. I'm requesting adjustment to the Medicare rate."
        },
        {
          leverage: "Prior Authorization Failure Liability",
          explanation: "Suppliers must obtain prior auth. Their failure shifts liability to them.",
          script: "Prior authorization was not obtained as required. The supplier is responsible for this oversight, not me."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Retail and Medicare Pricing", timing: "Within 7 days", successMetric: "Document fair market value" },
        { step: 2, action: "Verify Prior Authorization Status", timing: "Within 14 days", successMetric: "Determine if supplier failed requirements" },
        { step: 3, action: "Check Cap Rental/Ownership Status", timing: "Within 7 days", successMetric: "Verify ownership if applicable" },
        { step: 4, action: "Appeal Insurance Denial with Medical Necessity", timing: "If applicable", successMetric: "Coverage reinstated" },
        { step: 5, action: "Negotiate at Fair Market Value", timing: "After research complete", successMetric: "50-70% reduction with pay-for-delete" }
      ]
    },
    expectedOutcome: "50-70% reduction by demonstrating overpricing compared to retail and Medicare rates"
  },
  {
    id: "pediatric-nicu-collections",
    title: "NICU/Pediatric Hospital Stay Bills in Collections",
    icon: Baby,
    situation: "Your newborn spent time in the NICU or your child had an extended hospital stay. Despite having insurance, you received bills for $50,000-$500,000+ for 'non-covered' services, out-of-network providers, or amounts exceeding your out-of-pocket maximum. Now these bills are in collections.",
    insiderKnowledge: [
      "NICU bills are among the most error-prone in healthcare - duplicate charges and inflated daily rates are common",
      "Many NICU charges are 'bundled' into the daily rate but get billed separately anyway",
      "Out-of-pocket maximums apply to NICU care - once you hit yours, insurance should cover 100%",
      "Many states have separate CHIP programs or Medicaid expansions specifically for sick newborns",
      "Children's hospitals often have more robust charity care programs than general hospitals"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Out-of-Pocket Maximum Was Applied Correctly",
        details: "If you've hit your out-of-pocket maximum, the remaining charges should be covered 100% by insurance. Verify this was calculated correctly.",
        script: "Please provide documentation showing total out-of-pocket payments and confirmation that my out-of-pocket maximum has been met. Any charges after that date should be covered 100%."
      },
      {
        step: 2,
        title: "Audit Daily NICU Charges for Bundling Errors",
        details: "NICU daily rates should include routine nursing care, monitoring, and supplies. Check for separate charges that should be bundled.",
        redFlags: ["Separate charges for 'nursing care' in addition to daily rate", "Individual charges for routine monitoring", "Supply charges for items included in daily care", "Multiple physician charges for same-day routine checks"]
      },
      {
        step: 3,
        title: "Check Your Child's Independent Insurance Options",
        details: "Your newborn may qualify for their own Medicaid or CHIP coverage, which can be retroactive to birth.",
        retroactive: "Apply for Medicaid/CHIP within 60-90 days of birth. Coverage can be retroactive to the date of birth, covering NICU costs."
      },
      {
        step: 4,
        title: "Apply for Hospital Charity Care/Financial Assistance",
        details: "Children's hospitals and NICU programs often have special financial assistance. Apply even if you think you don't qualify - eligibility thresholds can be generous.",
        income_levels: "Many children's hospitals offer charity care up to 400% of federal poverty level or have income-based sliding scales."
      },
      {
        step: 5,
        title: "Request Case Manager or Social Worker Help",
        details: "Hospital social workers and case managers can help navigate billing issues and find assistance programs you may not know about.",
        contact: "Ask for the hospital's financial counselor or patient advocate. They can review your bills and identify errors or assistance opportunities."
      },
      {
        step: 6,
        title: "Negotiate NICU Collections Aggressively",
        details: "NICU bills are well-known for errors and overcharging. Collections agencies know these debts are frequently disputed.",
        script: "This NICU debt includes significant billing errors and charges that should be covered under my out-of-pocket maximum. I have documented [number] specific errors. I'm prepared to settle for [20-30%] of the remaining balance after corrections."
      }
    ],
    inCollectionsDefense: {
      title: "Your NICU/Pediatric Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify Your Out-of-Pocket Maximum Was Applied Correctly",
          timeline: "Within 7 days",
          why: "After hitting your OOP max, insurance should cover 100%. Many NICU bills incorrectly charge amounts that should be covered."
        },
        {
          action: "Apply for Your Child's Own Medicaid/CHIP Coverage",
          timeline: "Within 14 days",
          why: "Your newborn may qualify for Medicaid/CHIP retroactive to birth, potentially covering the entire NICU stay."
        },
        {
          action: "Apply for Children's Hospital Charity Care",
          timeline: "Within 30 days",
          why: "Children's hospitals often have very generous charity care programs with income limits up to 400% FPL."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll use emotional pressure about your child's care",
          truth: "Collectors know parents are emotionally vulnerable and may pay quickly",
          response: "I love my child. That doesn't mean I'll pay inflated, error-filled bills without review."
        },
        {
          tactic: "They'll claim NICU charges are 'fixed hospital rates'",
          truth: "NICU billing has the highest error rates in healthcare",
          response: "I've identified [number] billing errors including unbundled charges and services after we hit our OOP max."
        },
        {
          tactic: "They'll pressure payment before assistance is determined",
          truth: "Charity care and Medicaid applications take time - don't be rushed",
          response: "I have pending Medicaid and charity care applications. I will not pay until those are resolved."
        }
      ],
      leveragePoints: [
        {
          leverage: "Out-of-Pocket Maximum Enforcement",
          explanation: "After hitting your OOP max, you owe nothing more for covered services that year.",
          script: "We hit our out-of-pocket maximum on [date]. All charges after that date should be covered 100% by insurance."
        },
        {
          leverage: "Retroactive Medicaid/CHIP for Newborn",
          explanation: "Children can get Medicaid retroactive to birth, covering NICU costs.",
          script: "I'm applying for retroactive Medicaid for my child. Coverage can be effective from date of birth."
        },
        {
          leverage: "NICU Billing Error Patterns",
          explanation: "Unbundled charges, duplicate fees, and charges for services included in daily rate are common.",
          script: "I've documented [specific errors] that represent overbilling. These must be corrected before any payment discussion."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify OOP Maximum Calculation", timing: "Within 7 days", successMetric: "Identify charges that should be covered 100%" },
        { step: 2, action: "Apply for Child's Medicaid/CHIP", timing: "Within 14 days", successMetric: "Retroactive coverage application submitted" },
        { step: 3, action: "Audit Bill for Bundling Errors", timing: "Within 14 days", successMetric: "Document all billing errors" },
        { step: 4, action: "Apply for Children's Hospital Charity Care", timing: "Within 30 days", successMetric: "Application under review" },
        { step: 5, action: "Negotiate Remaining Balance at 20-35%", timing: "After applications resolved", successMetric: "Written settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "40-70% reduction through billing audits, out-of-pocket maximum corrections, and hospital charity care"
  },
  {
    id: "covid-medical-collections",
    title: "COVID-19 Treatment Bills in Collections",
    icon: Shield,
    situation: "You were hospitalized with COVID-19 or received COVID-related treatment. Despite federal programs intended to cover these costs, you received massive bills. Insurance denied coverage, HRSA wouldn't reimburse, or you fell through the cracks. Now bills are in collections.",
    insiderKnowledge: [
      "The HRSA Uninsured Program covered COVID treatment for uninsured patients through 2024 - check if you qualified",
      "Many insurance plans waived cost-sharing for COVID treatment during the pandemic - verify your plan's terms",
      "Hospitals received billions in federal CARES Act funding specifically to cover uncompensated COVID care",
      "Many COVID hospitalizations were incorrectly coded, leading to coverage denials that can be appealed",
      "Provider Relief Fund payments to hospitals were intended to offset uncompensated care costs"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Diagnosis Coding is Correct",
        details: "COVID hospitalizations should be coded with specific COVID diagnosis codes. Incorrect coding can lead to coverage denials.",
        codes: "Primary diagnosis should include U07.1 (COVID-19). If this code is missing, request a coding review and rebilling."
      },
      {
        step: 2,
        title: "Check Insurance Cost-Sharing Waivers",
        details: "Many insurers waived deductibles, copays, and coinsurance for COVID treatment during certain periods. Verify your plan's specific terms.",
        script: "Please confirm your plan's COVID-19 cost-sharing waiver policy and the dates it was effective. If my treatment fell within that period, please reprocess my claims with waived cost-sharing."
      },
      {
        step: 3,
        title: "Apply for HRSA Uninsured Coverage (If Applicable)",
        details: "If you were uninsured when treated, HRSA may still reimburse the provider for your care, even after the fact.",
        eligibility: "HRSA covered testing, treatment, and vaccination for uninsured individuals. Check eligibility at hrsa.gov."
      },
      {
        step: 4,
        title: "Document Hospital's CARES Act Funding",
        details: "Hospitals received Provider Relief Fund payments specifically to cover uncompensated COVID care. Use this as leverage.",
        script: "This hospital received [amount] in Provider Relief Fund payments under the CARES Act. These funds were intended to cover uncompensated COVID care. I'm requesting charity care consideration given this federal funding."
      },
      {
        step: 5,
        title: "Apply for COVID-Specific Financial Assistance",
        details: "Many hospitals created special COVID financial assistance programs. Apply even if the programs have officially ended - exceptions are often made.",
        request: "I'm requesting financial assistance for COVID-19 treatment costs. I understand the hospital received federal relief funding and am requesting consideration for charity care."
      },
      {
        step: 6,
        title: "Negotiate Based on Federal Funding Context",
        details: "When negotiating with collections, emphasize that hospitals were heavily subsidized for COVID care and should not be seeking full reimbursement from patients.",
        script: "This debt is for COVID-19 treatment. The hospital received significant federal CARES Act funding to cover uncompensated COVID care. Pursuing full payment from patients while accepting federal relief raises ethical and legal questions. I'm prepared to settle for [15-25%]."
      }
    ],
    inCollectionsDefense: {
      title: "Your COVID-19 Treatment Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify COVID Diagnosis Coding is Correct (U07.1)",
          timeline: "Within 7 days",
          why: "Missing COVID codes often cause coverage denials. Correct coding may result in coverage under insurance waivers."
        },
        {
          action: "Document Hospital's CARES Act/Provider Relief Funding",
          timeline: "Within 14 days",
          why: "Hospitals received billions specifically to cover uncompensated COVID care - use this as major leverage."
        },
        {
          action: "Check Insurance Cost-Sharing Waiver Policies",
          timeline: "Within 7 days",
          why: "Many insurers waived deductibles/copays for COVID treatment during specific periods."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim COVID treatment is 'just like any other' hospitalization",
          truth: "COVID had unique federal funding and insurance waivers that change the equation",
          response: "COVID treatment has special federal funding context. The hospital received Provider Relief Funds for this exact situation."
        },
        {
          tactic: "They'll ignore the federal funding hospitals received",
          truth: "Hospitals were heavily subsidized for COVID care and shouldn't also collect full payment from patients",
          response: "This hospital received $[amount] in CARES Act funding to cover uncompensated COVID care."
        },
        {
          tactic: "They'll claim HRSA programs are closed",
          truth: "Even closed programs may still apply to treatment received during eligible periods",
          response: "My treatment occurred during the HRSA coverage period. The provider should have submitted to HRSA."
        }
      ],
      leveragePoints: [
        {
          leverage: "Provider Relief Fund Documentation",
          explanation: "Hospitals received billions in federal COVID relief. This is public information you can research.",
          script: "Your hospital received $[amount] in Provider Relief Funds under the CARES Act. Seeking full payment while accepting federal relief is improper."
        },
        {
          leverage: "Insurance Cost-Sharing Waiver",
          explanation: "Many insurers waived cost-sharing for COVID treatment. Check your plan's specific terms.",
          script: "My insurer waived cost-sharing for COVID treatment through [date]. Please reprocess this claim with waived cost-sharing."
        },
        {
          leverage: "Incorrect Diagnosis Coding",
          explanation: "COVID claims need proper U07.1 coding. Incorrect coding causes preventable denials.",
          script: "This hospitalization should be coded with U07.1 as the primary diagnosis. Please request coding review and resubmit to insurance."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify COVID Diagnosis Coding", timing: "Within 7 days", successMetric: "Confirm U07.1 code present" },
        { step: 2, action: "Research Hospital's Provider Relief Funding", timing: "Within 14 days", successMetric: "Document federal funding received" },
        { step: 3, action: "Check Insurance COVID Waiver Policies", timing: "Within 7 days", successMetric: "Identify applicable waivers" },
        { step: 4, action: "Apply for Hospital COVID Financial Assistance", timing: "Within 30 days", successMetric: "Application under review" },
        { step: 5, action: "Negotiate at 15-25% Citing Federal Funding", timing: "After research complete", successMetric: "Major reduction or write-off" }
      ]
    },
    expectedOutcome: "50-80% reduction or full write-off given federal funding context and special COVID financial assistance programs"
  },
  {
    id: "workers-comp-collections",
    title: "Work Injury Bills in Collections (Workers' Comp Dispute)",
    icon: Briefcase,
    situation: "You were injured at work and sought medical treatment. Your employer's workers' compensation insurer denied the claim or disputed treatment. Now medical providers are sending bills to you personally, and some have gone to collections.",
    insiderKnowledge: [
      "If an injury happened at work, workers' comp - NOT you personally - is responsible for the bills",
      "Providers can NOT bill you personally for work injuries while a workers' comp claim is pending",
      "Employers and their insurers often deny legitimate claims hoping workers won't fight back",
      "You have the right to choose your own doctor in many states after initial treatment",
      "Denied workers' comp claims have a high success rate on appeal - many initial denials are overturned"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Document That This Was a Work Injury",
        details: "Gather evidence that the injury occurred at work: incident reports, witness statements, photos, timeline of injury and symptoms.",
        critical: "If you reported the injury to your employer and they filed a workers' comp claim, you should have a claim number. Get this documentation."
      },
      {
        step: 2,
        title: "Inform Medical Providers of Workers' Comp Status",
        details: "Tell all providers this is a workers' comp case. They should bill the workers' comp insurer, not you.",
        script: "This injury occurred at work on [date]. The workers' compensation claim number is [number] with [insurance company]. Please bill workers' compensation directly. I am not personally responsible for work injury medical costs."
      },
      {
        step: 3,
        title: "Appeal the Workers' Comp Denial",
        details: "If your claim was denied, you have the right to appeal. Many states have workers' compensation boards that handle disputes.",
        steps: "File an appeal with your state workers' compensation board. You may be entitled to a hearing before an administrative law judge."
      },
      {
        step: 4,
        title: "Consider a Workers' Comp Attorney",
        details: "Workers' comp attorneys typically work on contingency and specialize in fighting denials. They can also handle medical provider issues.",
        fees: "Workers' comp attorney fees are typically 15-25% of recovered benefits and are often regulated by the state."
      },
      {
        step: 5,
        title: "Respond to Collections with Workers' Comp Documentation",
        details: "If bills go to collections, provide documentation that this is a workers' comp case. You are not personally liable.",
        script: "This medical debt is for a work injury covered by workers' compensation. The claim is currently [pending/under appeal]. I am not personally responsible for these charges. Please direct billing to [workers' comp insurer] at [contact info]."
      },
      {
        step: 6,
        title: "File Complaint if Providers Improperly Pursue You",
        details: "Providers billing you personally for workers' comp cases may be violating state law. File complaints with your state workers' comp board and insurance commissioner.",
        document: "Keep records of all improper billing and collection attempts for potential legal action."
      }
    ],
    inCollectionsDefense: {
      title: "Your Work Injury Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Document This is a Workers' Comp Case",
          timeline: "Immediately",
          why: "You are NOT personally responsible for work injury medical bills. Workers' comp insurance covers these costs."
        },
        {
          action: "Redirect Collectors to Workers' Comp Insurer",
          timeline: "Within 7 days",
          why: "Providers should be billing the workers' comp insurer, not you personally."
        },
        {
          action: "Appeal Workers' Comp Denial if Applicable",
          timeline: "Per state deadlines",
          why: "Most denied workers' comp claims can be appealed, and many denials are overturned."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim you're personally responsible for the bills",
          truth: "Work injuries are covered by workers' comp, not personal responsibility",
          response: "This is a work injury covered by workers' compensation. I am not personally responsible."
        },
        {
          tactic: "They'll claim the workers' comp denial makes you liable",
          truth: "Denials can be appealed - and should be directed to the workers' comp system, not you",
          response: "I'm appealing the workers' comp denial. Continue pursuing the claim through proper channels."
        },
        {
          tactic: "They'll threaten credit damage",
          truth: "You can dispute improper collection on work injury bills",
          response: "Collecting from me personally for a workers' comp case is improper. I'm disputing this with credit bureaus."
        }
      ],
      leveragePoints: [
        {
          leverage: "Workers' Comp Exclusive Remedy",
          explanation: "Work injuries are the responsibility of the workers' comp system, not the employee personally.",
          script: "This injury occurred at work on [date]. Workers' compensation claim [number] is [pending/under appeal]. Direct all billing to the workers' comp insurer."
        },
        {
          leverage: "Improper Personal Billing",
          explanation: "Billing employees personally for work injuries may violate state workers' comp laws.",
          script: "Billing me personally for a workers' comp case may violate [state] workers' compensation law. I'm filing a complaint."
        },
        {
          leverage: "High Appeal Success Rate",
          explanation: "Most workers' comp denials can be successfully appealed with proper documentation.",
          script: "I'm appealing this denial through the workers' compensation board. Many initial denials are overturned on appeal."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Document Work Injury and Claim Status", timing: "Within 3 days", successMetric: "Gather claim number, employer info, insurer details" },
        { step: 2, action: "Redirect Collectors to Workers' Comp Insurer", timing: "Within 7 days", successMetric: "Provide insurer contact info" },
        { step: 3, action: "Appeal Workers' Comp Denial if Needed", timing: "Per state deadlines", successMetric: "Appeal filed with documentation" },
        { step: 4, action: "Consider Workers' Comp Attorney", timing: "If denial persists", successMetric: "Attorney representation secured" },
        { step: 5, action: "File Complaints for Improper Personal Billing", timing: "If collection continues", successMetric: "Complaints with workers' comp board and AG" }
      ]
    },
    expectedOutcome: "Complete dismissal of personal responsibility if workers' comp coverage applies. Workers' comp insurer pays all medical bills."
  },
  {
    id: "job-loss-collections",
    title: "Medical Bills After Job Loss (Lost Insurance)",
    icon: TrendingDown,
    situation: "You lost your job and with it, your health insurance. During the coverage gap, you incurred medical bills you couldn't pay. Now those bills - plus ongoing costs for chronic conditions - are in collections.",
    insiderKnowledge: [
      "COBRA coverage can be elected retroactively within 60 days of job loss - even after you've incurred bills",
      "Job loss is a 'qualifying life event' for immediate marketplace enrollment with potential subsidies",
      "Many states expanded Medicaid under the ACA - job loss may make you eligible",
      "Hospitals cannot deny emergency care due to inability to pay - but they can send to collections after",
      "Job loss may qualify you for maximum charity care consideration under hospital policies"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Evaluate COBRA Retroactive Election",
        details: "If you're within 60 days of losing coverage, you can still elect COBRA and coverage is retroactive. This may cover bills you've already incurred.",
        calculation: "Compare COBRA premiums to outstanding medical bills. If bills exceed premiums, COBRA retroactive election may save money."
      },
      {
        step: 2,
        title: "Apply for Marketplace Coverage Immediately",
        details: "Job loss qualifies you for a Special Enrollment Period. Apply at healthcare.gov within 60 days of losing coverage.",
        subsidies: "Based on your current (lower) income, you may qualify for significant premium tax credits and cost-sharing reductions."
      },
      {
        step: 3,
        title: "Check Medicaid Eligibility",
        details: "With job loss, your income may now qualify you for Medicaid. In expansion states, adults with income up to 138% FPL qualify.",
        retroactive: "Medicaid can cover bills from up to 3 months before your application date."
      },
      {
        step: 4,
        title: "Apply for Hospital Charity Care",
        details: "Job loss and income reduction typically qualify you for hospital charity care. Apply with documentation of your changed financial situation.",
        documentation: "Provide: termination letter, unemployment benefits documentation, bank statements showing reduced income, household expenses."
      },
      {
        step: 5,
        title: "Set Up Hardship Payment Plans",
        details: "If you can't qualify for charity care, request interest-free hardship payment plans based on your ability to pay.",
        script: "I recently lost my job and am experiencing financial hardship. I'm requesting an interest-free payment plan based on my current income. I can afford $[amount] per month while seeking employment."
      },
      {
        step: 6,
        title: "Negotiate Collections with Hardship Evidence",
        details: "Collections agencies know that recently unemployed individuals have little ability to pay. Use your documentation to negotiate significant reductions.",
        script: "I lost my job on [date] and am currently unemployed. I've applied for Medicaid and hospital charity care. While those applications are pending, I'm prepared to settle this debt for [20-30%] given my financial hardship."
      }
    ],
    inCollectionsDefense: {
      title: "Your Post-Job-Loss Medical Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Evaluate COBRA Retroactive Election",
          timeline: "Within 60 days of job loss",
          why: "COBRA coverage is retroactive - if you're within 60 days, electing now can cover bills you've already incurred."
        },
        {
          action: "Apply for Medicaid with Retroactive Coverage",
          timeline: "Immediately",
          why: "Medicaid can cover bills from up to 3 months before your application date."
        },
        {
          action: "Apply for Hospital Charity Care Citing Job Loss",
          timeline: "Within 30 days",
          why: "Job loss and reduced income typically qualify you for maximum charity care consideration."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll pressure payment knowing you're financially stressed",
          truth: "Job loss actually gives you more leverage for assistance and negotiation",
          response: "I recently lost my job and am pursuing charity care and Medicaid. I cannot pay until these are resolved."
        },
        {
          tactic: "They'll claim you 'should have had COBRA'",
          truth: "COBRA can still be elected retroactively within 60 days",
          response: "I'm evaluating COBRA retroactive election. If I elect, these bills will be covered."
        },
        {
          tactic: "They'll ignore your financial hardship",
          truth: "Hardship strengthens your position for charity care and settlement",
          response: "I'm experiencing documented financial hardship. I have pending assistance applications."
        }
      ],
      leveragePoints: [
        {
          leverage: "COBRA Retroactive Coverage",
          explanation: "COBRA can be elected up to 60 days after job loss and covers bills from day one of the gap.",
          script: "I may elect COBRA retroactively, which would cover these bills. I'm evaluating whether COBRA premiums are less than the bills."
        },
        {
          leverage: "Medicaid Retroactive Coverage",
          explanation: "Medicaid covers bills from up to 3 months before your application date.",
          script: "I've applied for Medicaid. With my current income, I may qualify for retroactive coverage of these bills."
        },
        {
          leverage: "Maximum Charity Care Eligibility",
          explanation: "Job loss and reduced income typically qualify you for 100% charity care.",
          script: "I lost my job on [date] and my income has dropped significantly. I believe I qualify for full charity care."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Calculate COBRA vs Bills Comparison", timing: "Within 7 days", successMetric: "Determine if COBRA is cost-effective" },
        { step: 2, action: "Apply for Medicaid", timing: "Immediately", successMetric: "Application submitted with income documentation" },
        { step: 3, action: "Apply for Hospital Charity Care", timing: "Within 14 days", successMetric: "Application with job loss documentation" },
        { step: 4, action: "Request Hardship Payment Plan if Needed", timing: "If not fully covered", successMetric: "Interest-free plan based on income" },
        { step: 5, action: "Negotiate Settlement at 20-35%", timing: "If no coverage available", successMetric: "Settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "Retroactive coverage through COBRA or Medicaid. Charity care for remaining bills. 50-70% reduction if negotiating with collections."
  },
  {
    id: "dental-collections",
    title: "Major Dental Work Bills in Collections",
    icon: Stethoscope,
    situation: "You had major dental work - implants, crowns, root canals, or oral surgery. Your dental insurance covered little or nothing, or you had no dental coverage. Now bills for $5,000-$30,000+ are in collections.",
    insiderKnowledge: [
      "Dental insurance has notoriously low annual maximums ($1,000-$2,000) that haven't increased in decades",
      "Dental implants are often considered 'cosmetic' despite being the best medical solution",
      "Dental school clinics offer the same procedures at 50-70% less than private practices",
      "Many dental procedures done in hospitals trigger medical insurance coverage, not just dental",
      "CareCredit and other dental financing carry high interest rates - negotiate before using them"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Review What Was Covered vs. What Was Denied",
        details: "Get the explanation of benefits from your dental insurance. Understand exactly why certain procedures weren't covered.",
        common_exclusions: "Dental insurance often excludes: implants, cosmetic work, procedures started before coverage began, frequency limitations (e.g., one cleaning per 6 months)"
      },
      {
        step: 2,
        title: "Appeal Medical Necessity Denials",
        details: "If dental work was medically necessary (not cosmetic), appeal with documentation from your dentist explaining the medical need.",
        script: "I'm appealing the denial of [procedure]. This was not cosmetic - it was medically necessary to [prevent infection/restore function/address pathology]. I'm attaching clinical documentation."
      },
      {
        step: 3,
        title: "Check if Medical Insurance Applies",
        details: "Dental procedures done in hospitals or related to accidents/medical conditions may be covered by medical insurance, not dental.",
        examples: "Oral surgery for impacted teeth, treatment of jaw fractures, extraction due to infection, dental work before heart surgery - often covered by medical."
      },
      {
        step: 4,
        title: "Negotiate Direct Payment Discounts",
        details: "Dental practices often offer 10-20% discounts for upfront payment or payment in full. Ask before care and before paying collections.",
        script: "I'm unable to pay the full amount but would like to settle this account. What discount can you offer for payment in full today?"
      },
      {
        step: 5,
        title: "Explore Dental Financing Carefully",
        details: "CareCredit and similar programs offer promotional 0% interest periods. If you can pay within the promotional period, this can help - but interest rates are high if you can't.",
        warning: "CareCredit charges 26.99% APR after promotional period. Only use if you can definitely pay off within 0% period."
      },
      {
        step: 6,
        title: "Negotiate with Collections",
        details: "Dental debt in collections can often be settled for 30-50% of the original amount.",
        script: "I'm prepared to settle this dental debt for [30-40%] of the original amount. Dental insurance covered only $[amount] of my $[total] in dental work. I've already paid $[paid amount] out of pocket."
      }
    ],
    inCollectionsDefense: {
      title: "Your Dental Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify What Was Covered vs Denied by Insurance",
          timeline: "Within 7 days",
          why: "Dental insurance has low annual maximums ($1,000-$2,000) and many exclusions. Understand exactly what wasn't covered and why."
        },
        {
          action: "Check if Medical Insurance Applies",
          timeline: "Within 14 days",
          why: "Some dental procedures (oral surgery, trauma, infections) may be covered by medical insurance, not just dental."
        },
        {
          action: "Request Cash/Self-Pay Discount",
          timeline: "Within 7 days",
          why: "Dental practices typically offer 10-20% discounts for upfront cash payment."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim dental work is 'elective' and non-negotiable",
          truth: "Much dental work is medically necessary, and all bills are negotiable",
          response: "This dental work was medically necessary, not cosmetic. I'm disputing the charges."
        },
        {
          tactic: "They'll say insurance denial is final",
          truth: "Many dental denials can be appealed, especially for medical necessity",
          response: "I'm appealing the insurance denial with documentation of medical necessity."
        },
        {
          tactic: "They'll refuse to itemize 'treatment packages'",
          truth: "You have the right to itemization of all services",
          response: "Please provide an itemized bill with procedure codes for each service."
        }
      ],
      leveragePoints: [
        {
          leverage: "UCR Rate Comparison",
          explanation: "Usual, Customary, and Reasonable (UCR) rates show what dentists typically charge. Your bill may exceed UCR.",
          script: "The UCR rate for this procedure is approximately $[amount]. Your charge of $[higher amount] exceeds reasonable rates."
        },
        {
          leverage: "Medical Insurance Coverage",
          explanation: "Oral surgery, jaw procedures, and dental trauma may be covered by medical insurance.",
          script: "This procedure may qualify for medical insurance coverage. I'm filing a claim with my medical insurer."
        },
        {
          leverage: "Dental School/Clinic Pricing",
          explanation: "Dental schools offer the same procedures at 50-70% less - use as fair market reference.",
          script: "This procedure costs $[lower price] at [dental school]. Your charge of $[higher price] significantly exceeds that benchmark."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Review Insurance EOB for Denial Reasons", timing: "Within 7 days", successMetric: "Understand exactly what wasn't covered" },
        { step: 2, action: "Check Medical Insurance Applicability", timing: "Within 14 days", successMetric: "Determine if medical coverage applies" },
        { step: 3, action: "Appeal Dental Insurance Denial", timing: "If applicable", successMetric: "Medical necessity documentation submitted" },
        { step: 4, action: "Request Cash Discount from Original Provider", timing: "Before negotiating with collector", successMetric: "10-20% immediate reduction" },
        { step: 5, action: "Negotiate with Collector at 30-50%", timing: "After appeals exhausted", successMetric: "Settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "30-50% reduction through negotiation. Possible additional coverage if medical insurance applies."
  },
  {
    id: "telemedicine-billing-collections",
    title: "Telemedicine/Virtual Visit Billing Errors",
    icon: Phone,
    situation: "You had a video or phone visit with a doctor and received an unexpectedly high bill - sometimes higher than an in-person visit. Your insurance didn't cover it as expected, or you were billed for services you didn't receive. Now the bill is in collections.",
    insiderKnowledge: [
      "Many telemedicine visits are billed at the same rate as in-person visits despite lower overhead",
      "Some providers add 'facility fees' to telemedicine visits even though there's no facility",
      "Insurance coverage for telemedicine varies widely - some plans cover it fully, others barely at all",
      "Many telemedicine companies use out-of-network billing practices that result in surprise bills",
      "The actual time spent on a telemedicine visit often doesn't match what's billed - a 5-minute call billed as 30 minutes"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Visit Duration and Services",
        details: "Check the billing codes against the actual length and content of your visit. Many telemedicine visits are over-coded.",
        script: "I'm requesting documentation of the visit duration and services provided. The billing code used suggests a [X]-minute visit, but my actual visit was approximately [Y] minutes."
      },
      {
        step: 2,
        title: "Challenge Any Facility Fees",
        details: "Telemedicine visits should NOT include facility fees - there's no facility involved. If charged, dispute it.",
        script: "I'm disputing the facility fee on this telemedicine visit. This was a virtual visit conducted from my home - no facility was used. Please remove this charge."
      },
      {
        step: 3,
        title: "Check Network Status of Telemedicine Provider",
        details: "Many people don't realize their telemedicine provider is out-of-network. Verify network status and apply No Surprises Act if applicable.",
        question: "Was this telemedicine provider in-network for my plan? If out-of-network services were provided without my knowledge, No Surprises Act protections may apply."
      },
      {
        step: 4,
        title: "Appeal Insurance Denial",
        details: "If insurance denied coverage, appeal with documentation that telemedicine is clinically appropriate for your condition.",
        script: "I'm appealing the denial of coverage for this telemedicine visit. Virtual care was clinically appropriate for [condition] and should be covered the same as an in-person visit under mental health parity / standard benefit rules."
      },
      {
        step: 5,
        title: "Compare to Fair Market Rates",
        details: "Many telemedicine visits should cost $50-$150. If you're charged $300+, this may be excessive.",
        benchmark: "Direct-pay telemedicine services typically charge $50-$150 per visit. Being charged $300+ for a basic video visit is excessive."
      },
      {
        step: 6,
        title: "Negotiate Based on Actual Service Value",
        details: "Telemedicine has lower overhead than in-person visits. Use this as leverage when negotiating.",
        script: "This telemedicine visit had none of the overhead costs of an in-person visit. The charge of $[amount] is excessive for a virtual consultation. I'm prepared to pay a fair rate of $[100-150] to settle this account."
      }
    ],
    inCollectionsDefense: {
      title: "Your Telemedicine Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Challenge Over-Coding for Video Visits",
          timeline: "Within 7 days",
          why: "Telemedicine visits are often coded at higher levels than in-person visits for the same service - which should cost less."
        },
        {
          action: "Verify Facility Fees Weren't Charged",
          timeline: "Within 7 days",
          why: "Telemedicine should NOT have facility fees - you weren't at a facility. Yet some providers add them."
        },
        {
          action: "Check Your Insurance Telemedicine Coverage",
          timeline: "Within 14 days",
          why: "Most insurers now cover telemedicine at parity with in-person visits. Denials may be appealable."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim telemedicine billing is 'the same as' in-person",
          truth: "Telemedicine should cost less - no facility overhead, shorter visits, lower provider costs",
          response: "Telemedicine has lower overhead than in-person care. This billing exceeds reasonable rates."
        },
        {
          tactic: "They'll claim facility fees are 'standard'",
          truth: "No facility was used - facility fees are inappropriate for telemedicine",
          response: "There was no facility involved in this telemedicine visit. Facility fees are not applicable."
        },
        {
          tactic: "They'll pressure quick payment for 'simple' bills",
          truth: "Simple visits are especially prone to over-coding",
          response: "I'm reviewing the coding level. A simple video visit shouldn't be billed at complex visit rates."
        }
      ],
      leveragePoints: [
        {
          leverage: "No Facility Fee for Telemedicine",
          explanation: "You weren't at any facility - facility fees have no basis for telemedicine visits.",
          script: "This was a telemedicine visit conducted from my home. There is no basis for a facility fee. Remove this charge."
        },
        {
          leverage: "Lower Overhead = Lower Pricing",
          explanation: "Telemedicine saves providers money on facilities, staff, and overhead. Pricing should reflect this.",
          script: "Telemedicine visits have lower overhead than in-person care. I'm requesting pricing that reflects the actual service delivery cost."
        },
        {
          leverage: "Coding Level Review",
          explanation: "Many telemedicine visits are over-coded. Request justification for the billing level.",
          script: "Please provide documentation justifying the coding level for this telemedicine visit. The complexity of a video call should match billing."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Request Itemized Bill with CPT Codes", timing: "Within 7 days", successMetric: "Identify facility fees and visit coding" },
        { step: 2, action: "Dispute Any Facility Fees", timing: "Within 7 days", successMetric: "Facility fees removed" },
        { step: 3, action: "Challenge Over-Coding", timing: "Within 14 days", successMetric: "Billing level justified or reduced" },
        { step: 4, action: "Compare to Fair Market Telemedicine Pricing", timing: "Within 14 days", successMetric: "Document reasonable rates ($50-$150)" },
        { step: 5, action: "Negotiate Settlement at 30-50%", timing: "After disputes filed", successMetric: "Written settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "40-60% reduction by challenging over-coding, facility fees, and excessive pricing"
  },
  {
    id: "preventive-care-billing-collections",
    title: "Preventive Care Billed as Diagnostic (Annual Physical, Screenings)",
    icon: CheckCircle,
    situation: "You went in for a routine annual physical or preventive screening that should be covered 100% under the ACA. Instead, you received a bill for hundreds or thousands of dollars because it was billed as 'diagnostic' rather than 'preventive.' Now it's in collections.",
    insiderKnowledge: [
      "The ACA requires insurance to cover preventive care at 100% with no cost-sharing - but providers often code visits wrong",
      "If you mention ANY symptom during a preventive visit, providers often recode the entire visit as diagnostic",
      "The same colonoscopy can be billed as preventive (free) or diagnostic ($3,000+) based on coding",
      "Providers have financial incentive to code as diagnostic because reimbursement is often higher",
      "You have the right to request that preventive services be billed with preventive codes"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Review the Billing Codes Used",
        details: "Get the itemized bill with CPT codes. Compare them to the list of ACA-mandated preventive services.",
        preventiveCodes: "Preventive visits typically use codes like 99381-99397. Diagnostic visits use 99201-99215. The same visit can be coded either way."
      },
      {
        step: 2,
        title: "Request Recoding to Preventive",
        details: "Contact the provider's billing department and request that the visit be recoded as preventive if that was the primary purpose.",
        script: "I scheduled this visit as my annual preventive physical. The ACA requires preventive care to be covered at 100%. Please recode this visit with the appropriate preventive care codes and resubmit to my insurance."
      },
      {
        step: 3,
        title: "Appeal to Insurance for Preventive Coverage",
        details: "If the provider won't recode, appeal to your insurance explaining this was a preventive visit.",
        script: "I'm appealing the cost-sharing on this visit. I scheduled and received a routine preventive [physical/screening]. Under ACA requirements, this should be covered at 100% with no cost-sharing."
      },
      {
        step: 4,
        title: "Challenge 'Incidental Findings' Charges",
        details: "If the provider found something during a preventive visit, the initial preventive screening should still be covered - only follow-up care is diagnostic.",
        example: "A colonoscopy that finds and removes a polyp should still be covered as preventive - the polyp removal is part of the screening."
      },
      {
        step: 5,
        title: "File Complaint if ACA Rights Violated",
        details: "If your insurance is improperly denying preventive care coverage, file a complaint with your state insurance commissioner and HHS.",
        resources: "File at cms.gov or contact your state insurance department."
      },
      {
        step: 6,
        title: "Negotiate with Collections Citing Billing Error",
        details: "If the debt is in collections, document the billing error and use it as leverage.",
        script: "This debt results from a billing error. The visit was scheduled as preventive care, which is covered at 100% under the ACA. I am disputing this debt and have filed a complaint regarding improper billing."
      }
    ],
    inCollectionsDefense: {
      title: "Your Preventive Care Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify Coding - This May Be a Billing Error",
          timeline: "Within 7 days",
          why: "ACA-compliant plans must cover preventive care at 100% with no cost-sharing. If you're being billed, it's likely coded wrong."
        },
        {
          action: "Request Recoding to Preventive Care Codes",
          timeline: "Within 14 days",
          why: "Changing from diagnostic to preventive codes often eliminates the bill entirely."
        },
        {
          action: "File Insurance Appeal for Preventive Care Coverage",
          timeline: "Within 30 days",
          why: "If services are truly preventive, insurance must cover them at 100% under the ACA."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim the services weren't 'preventive'",
          truth: "Services like colonoscopies and mammograms ARE preventive even if conditions are found",
          response: "This was a routine preventive screening. Under the ACA, my plan must cover this at 100%."
        },
        {
          tactic: "They'll say diagnostic coding is 'accurate'",
          truth: "Providers often code preventive visits as diagnostic, triggering cost-sharing that shouldn't apply",
          response: "This visit was for preventive screening. I'm requesting recoding with appropriate preventive care codes."
        },
        {
          tactic: "They'll claim you're responsible for the cost-sharing",
          truth: "True preventive care has no cost-sharing under the ACA",
          response: "ACA-compliant plans cover preventive care at 100% with no deductible or copay. This bill shouldn't exist."
        }
      ],
      leveragePoints: [
        {
          leverage: "ACA Preventive Care Mandate",
          explanation: "The ACA requires coverage of USPSTF-recommended preventive services at 100%.",
          script: "Under the ACA, my insurance plan must cover this preventive service at 100% with no cost-sharing. This bill should not exist."
        },
        {
          leverage: "Coding Change Request",
          explanation: "Changing from diagnostic to preventive codes often eliminates patient responsibility.",
          script: "Please recode this visit using preventive care codes. This was a routine screening, not a diagnostic procedure."
        },
        {
          leverage: "Department of Labor/HHS Complaint",
          explanation: "Insurers who deny preventive care coverage may violate federal law.",
          script: "If my insurance plan is not covering this preventive service at 100%, they may be violating the ACA. I will file a complaint."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Request Bill with Diagnosis and Procedure Codes", timing: "Within 7 days", successMetric: "Identify coding used" },
        { step: 2, action: "Determine if Service is ACA-Covered Preventive", timing: "Within 7 days", successMetric: "Verify USPSTF recommendation status" },
        { step: 3, action: "Request Provider Recode as Preventive", timing: "Within 14 days", successMetric: "Preventive codes submitted" },
        { step: 4, action: "Appeal Insurance Denial", timing: "Within 30 days", successMetric: "Appeal citing ACA requirements" },
        { step: 5, action: "File Federal Complaint if Still Denied", timing: "After appeal exhausted", successMetric: "DOL/HHS complaint filed" }
      ]
    },
    expectedOutcome: "Potential full dismissal if recoded as preventive. Otherwise, significant reduction based on billing error dispute."
  },
  {
    id: "genetic-testing-collections",
    title: "Genetic Testing Bills in Collections",
    icon: Target,
    situation: "You had genetic testing done - maybe for cancer risk, prenatal screening, or ancestry-related health markers. The test was presented as covered, but you received a bill for $1,000-$10,000+. Now it's in collections.",
    insiderKnowledge: [
      "Genetic testing companies often use predatory billing practices - quoting 'insurance will cover' then sending huge bills",
      "Many genetic tests are sold directly by labs who pressure doctors to order them, then bill patients excessively",
      "The same genetic test can cost $100 at one lab and $10,000 at another",
      "Patient assistance programs exist for most major genetic tests but are rarely disclosed",
      "Many genetic tests ordered are not actually clinically necessary and can be challenged"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify the Test Was Medically Necessary",
        details: "Review why the test was ordered. If it wasn't clinically indicated (e.g., ordered for marketing purposes), challenge it.",
        question: "Was this genetic test clinically necessary based on my personal or family history? What clinical guidelines support ordering this test for me?"
      },
      {
        step: 2,
        title: "Check for Pre-Test Cost Disclosure",
        details: "Labs are supposed to provide cost estimates before testing. If you weren't informed of the cost, this is a violation.",
        script: "I was not provided a cost estimate before this genetic test was performed. Please provide documentation of any cost disclosure I signed. Without informed consent about costs, I dispute this charge."
      },
      {
        step: 3,
        title: "Compare to Market Rates",
        details: "Many genetic tests are available for $100-$500 that labs bill at $5,000+. Research fair market pricing.",
        example: "BRCA testing that labs bill at $5,000+ is available for $250-$500 through various services. Use this as evidence of overcharging."
      },
      {
        step: 4,
        title: "Contact the Lab's Patient Assistance Program",
        details: "Most major genetic testing labs have patient assistance programs that reduce or eliminate costs for those who qualify.",
        programs: "Myriad, Invitae, Ambry, and other major labs all have financial assistance. Apply even after receiving a bill."
      },
      {
        step: 5,
        title: "Appeal Insurance Denial",
        details: "If insurance denied the test, appeal with documentation from your doctor explaining medical necessity and genetic risk factors.",
        script: "I'm appealing the denial of [genetic test]. Based on my [family history/personal risk factors], this test was medically necessary according to [NCCN/ACOG/clinical guidelines]."
      },
      {
        step: 6,
        title: "Negotiate Aggressively - Genetic Test Pricing is Arbitrary",
        details: "Genetic testing pricing is notoriously inflated. Labs routinely accept 10-20% of billed charges.",
        script: "The billed amount of $[amount] far exceeds the fair market value of this test. Comparable testing is available for $[250-500]. I'm prepared to pay $[fair market rate] to settle this account."
      }
    ],
    inCollectionsDefense: {
      title: "Your Genetic Testing Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Apply for Lab/Manufacturer Patient Assistance",
          timeline: "Within 14 days",
          why: "Most genetic testing companies have financial assistance programs that can cover 80-100% of costs retroactively."
        },
        {
          action: "Compare Billed Price to Fair Market Value",
          timeline: "Within 7 days",
          why: "Genetic tests billed at $5,000-$20,000 often have 'fair market' prices of $250-$500 through direct-pay options."
        },
        {
          action: "Verify Test Was Medically Necessary and Ordered Correctly",
          timeline: "Within 14 days",
          why: "Insurance often denies genetic tests ordered without proper medical necessity documentation."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim the billed price is 'standard'",
          truth: "Genetic testing has massive pricing variation - direct-pay is often 90% less",
          response: "This test is available for $[direct price] through [company's own program]. Your billed price of $[higher] is excessive."
        },
        {
          tactic: "They'll say you 'agreed' to the testing",
          truth: "Most patients don't know the true cost or that assistance programs exist",
          response: "I was not informed of available patient assistance programs or the actual cost alternatives."
        },
        {
          tactic: "They'll pressure payment before exploring assistance",
          truth: "Patient assistance programs exist and often pay retroactively",
          response: "I'm applying for [company]'s patient assistance program. Do not expect payment until that's resolved."
        }
      ],
      leveragePoints: [
        {
          leverage: "Manufacturer Patient Assistance Programs",
          explanation: "Companies like Myriad, Invitae, and others offer 80-100% assistance based on income.",
          script: "I'm applying for [company]'s financial assistance program. Please pause collection while this is reviewed."
        },
        {
          leverage: "Direct-Pay Pricing Comparison",
          explanation: "The same test often costs 90% less through the company's direct-pay option.",
          script: "[Company] offers this test for $[direct price] to self-pay patients. Your charge of $[much higher] is unreasonable."
        },
        {
          leverage: "Informed Consent Questions",
          explanation: "Patients should be informed of costs and alternatives before expensive genetic testing.",
          script: "I was not properly informed of the cost, alternatives, or available assistance programs before testing."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Lab's Patient Assistance Program", timing: "Within 7 days", successMetric: "Identify assistance eligibility" },
        { step: 2, action: "Apply for Financial Assistance", timing: "Within 14 days", successMetric: "Application submitted" },
        { step: 3, action: "Research Direct-Pay Pricing for Same Test", timing: "Within 7 days", successMetric: "Document fair market pricing" },
        { step: 4, action: "Appeal Insurance Denial with Medical Necessity", timing: "If applicable", successMetric: "Coverage appeal submitted" },
        { step: 5, action: "Negotiate at 10-25% of Billed Price", timing: "After assistance determined", successMetric: "Settlement reflecting fair market value" }
      ]
    },
    expectedOutcome: "60-80% reduction through patient assistance programs and fair market value negotiation"
  },
  {
    id: "fertility-ivf-collections",
    title: "Fertility Treatment/IVF Bills in Collections",
    icon: Heart,
    situation: "You underwent fertility treatment including IUI, IVF, egg freezing, or related procedures. Your insurance covered little or nothing, or only partial cycles. Now you have bills for $15,000-$50,000+ in collections.",
    insiderKnowledge: [
      "Only 19 states mandate some form of fertility coverage - and mandates vary widely in what's covered",
      "Many fertility clinics inflate pricing because they know desperate patients will pay",
      "Medication costs for IVF can be reduced 50-80% through international pharmacies and manufacturer programs",
      "Some fertility clinics offer shared-risk or refund programs that weren't disclosed to you",
      "If fertility treatment was needed due to a medical condition (PCOS, endometriosis), it may be covered as treatment for that condition"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Check Your State's Fertility Mandate",
        details: "19 states require some fertility coverage. Verify what your state mandates and whether your plan complies.",
        mandateStates: "States with IVF mandates include: Arkansas, California, Connecticut, Delaware, Hawaii, Illinois, Louisiana, Maryland, Massachusetts, Montana, New Hampshire, New Jersey, New York, Ohio, Rhode Island, Texas, Utah, West Virginia."
      },
      {
        step: 2,
        title: "Frame Treatment as Medical Condition Management",
        details: "If infertility is caused by a diagnosed condition (PCOS, endometriosis, blocked tubes), treatment may be covered as medical treatment.",
        script: "I'm requesting coverage for this fertility treatment as treatment for my diagnosed medical condition of [PCOS/endometriosis/etc.]. The procedure was necessary to address this medical issue."
      },
      {
        step: 3,
        title: "Explore Medication Cost Reduction",
        details: "Fertility medications are extremely expensive but can be obtained at 50-80% less through legitimate international pharmacies or manufacturer programs.",
        resources: "IVFMeds, Freedom Fertility, and compassionate use programs from Merck, Ferring, and other manufacturers can dramatically reduce costs."
      },
      {
        step: 4,
        title: "Ask About Shared-Risk or Refund Programs",
        details: "Many clinics offer programs where you pay a flat fee for multiple cycles with a refund if unsuccessful. If this wasn't offered, ask about it.",
        question: "Do you offer shared-risk or refund programs for IVF patients? If so, why wasn't this option presented to me initially?"
      },
      {
        step: 5,
        title: "Apply for Fertility Grants",
        details: "Numerous organizations provide grants for fertility treatment. Some can be applied retroactively.",
        organizations: "Baby Quest Foundation, The Cade Foundation, Gift of Parenthood, and state-specific programs offer fertility grants."
      },
      {
        step: 6,
        title: "Negotiate Extended Payment Plans",
        details: "Fertility clinics understand patients often can't pay upfront. Negotiate interest-free payment plans or settlement discounts.",
        script: "I'm facing financial hardship after fertility treatment. I'm requesting either an interest-free payment plan over [24-36] months, or a settlement discount of [30-40%] for payment in full."
      }
    ],
    inCollectionsDefense: {
      title: "Your Fertility/IVF Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Check State Fertility Coverage Mandate",
          timeline: "Within 14 days",
          why: "Some states require insurance to cover fertility treatment. If yours does, insurance may owe for these services."
        },
        {
          action: "Apply for Fertility Grant Programs",
          timeline: "Within 30 days",
          why: "Organizations like Baby Quest, The Cade Foundation, and others offer grants specifically for fertility treatment costs."
        },
        {
          action: "Verify Bundled Pricing Wasn't Exceeded",
          timeline: "Within 7 days",
          why: "Many fertility clinics offer 'package' pricing - check if you're being charged beyond your quoted package."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim fertility treatment is 'elective' and non-negotiable",
          truth: "Infertility is a medical condition - and many states mandate insurance coverage",
          response: "Infertility is a diagnosed medical condition. [My state mandates coverage / I'm exploring grant options]."
        },
        {
          tactic: "They'll pressure payment knowing emotional investment is high",
          truth: "Your emotional investment doesn't change your negotiating rights",
          response: "I'm committed to resolving this fairly. That means reviewing all billing and assistance options first."
        },
        {
          tactic: "They'll claim you 'agreed' to the full cost",
          truth: "Package pricing should be honored, and assistance programs exist",
          response: "I was quoted a package price. Please explain why these charges exceed that agreement."
        }
      ],
      leveragePoints: [
        {
          leverage: "State Mandate Coverage",
          explanation: "16+ states have some form of fertility coverage mandate. Check if yours applies.",
          script: "[State] requires insurance coverage for fertility treatment. I'm filing a claim with my insurer for this mandated benefit."
        },
        {
          leverage: "Fertility Grant Programs",
          explanation: "Multiple organizations offer grants of $2,000-$10,000+ for fertility treatment.",
          script: "I'm applying for fertility grants through [organization]. Please pause collection while my applications are reviewed."
        },
        {
          leverage: "Medical Necessity Documentation",
          explanation: "Framing infertility as a medical condition may unlock insurance coverage.",
          script: "Infertility is a diagnosed medical condition, not an elective choice. I'm appealing for coverage of medically necessary treatment."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Check State Fertility Mandate", timing: "Within 7 days", successMetric: "Determine if insurance coverage required" },
        { step: 2, action: "Apply for Fertility Grants", timing: "Within 30 days", successMetric: "Grant applications submitted" },
        { step: 3, action: "Review Package Pricing Agreement", timing: "Within 7 days", successMetric: "Verify charges match quoted package" },
        { step: 4, action: "Appeal Insurance Denial", timing: "If mandate applies", successMetric: "Medical necessity appeal filed" },
        { step: 5, action: "Negotiate Remaining Balance at 30-50%", timing: "After grants/appeals resolved", successMetric: "Settlement with payment plan" }
      ]
    },
    expectedOutcome: "30-50% reduction through negotiation and grants. Potential insurance coverage if medical condition angle applies."
  },
  {
    id: "bariatric-surgery-collections",
    title: "Weight Loss/Bariatric Surgery Bills in Collections",
    icon: Scale,
    situation: "You underwent bariatric surgery (gastric bypass, sleeve, lap-band) expecting insurance to cover it. Coverage was denied as 'not medically necessary' or 'cosmetic,' or your plan excluded it entirely. Now bills for $20,000-$50,000+ are in collections.",
    insiderKnowledge: [
      "Bariatric surgery is medically necessary for many patients and should not be considered 'cosmetic'",
      "Insurance denials for bariatric surgery are frequently overturned on appeal with proper documentation",
      "Many employers self-insure and can add bariatric coverage if requested",
      "Surgical tourism (Mexico, Costa Rica) offers the same procedures for 70-80% less - but if you already had surgery, this doesn't help",
      "Complications from bariatric surgery should be covered even if the original surgery wasn't"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Document Medical Necessity",
        details: "Gather documentation of: BMI history, comorbidities (diabetes, sleep apnea, hypertension), failed diet/exercise attempts, and psychological clearance.",
        evidence: "Insurance typically requires BMI >40, or BMI >35 with comorbidities, plus documented failed weight loss attempts."
      },
      {
        step: 2,
        title: "Appeal Denial as Medically Necessary",
        details: "Most bariatric surgery denials can be appealed. Include documentation from your surgeon and primary care physician.",
        script: "I'm appealing the denial of bariatric surgery coverage. This surgery was medically necessary based on my BMI of [X], comorbid conditions including [diabetes/sleep apnea/hypertension], and documented failed attempts at medical weight management."
      },
      {
        step: 3,
        title: "Request External Review",
        details: "After internal appeal denial, request an external review by an independent physician. External reviews often overturn bariatric denials.",
        success_rate: "External reviews for bariatric surgery denials have approximately 50-60% success rates when properly documented."
      },
      {
        step: 4,
        title: "Check for Employer Plan Exceptions",
        details: "If your employer self-insures, they can make exceptions to coverage exclusions. Ask HR about a case-by-case exception.",
        script: "I understand our plan excludes bariatric surgery, but I'm requesting a case-by-case exception due to my medical circumstances. This surgery will reduce long-term healthcare costs for [diabetes/other conditions]."
      },
      {
        step: 5,
        title: "Apply for Hospital Financial Assistance",
        details: "Bariatric programs often have their own financial assistance. Apply directly through the surgical program.",
        contact: "Contact the bariatric surgery program coordinator or patient financial services for program-specific assistance."
      },
      {
        step: 6,
        title: "Negotiate Based on Insurance-Rate Comparison",
        details: "Hospitals accept far less from insurance than they charge uninsured patients. Demand the insurance rate.",
        script: "I'm requesting the rate you would accept from a major insurance company for this procedure. Under the No Surprises Act, I'm entitled to an uninsured discount. I should not pay more than what insurance would pay."
      }
    ],
    inCollectionsDefense: {
      title: "Your Bariatric Surgery Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Appeal Insurance Denial with Medical Necessity",
          timeline: "Within 30 days",
          why: "Bariatric surgery appeals have a 50-60% success rate when documented as medically necessary for obesity-related conditions."
        },
        {
          action: "Document Comorbidities and Treatment History",
          timeline: "Within 14 days",
          why: "Evidence of failed weight loss attempts, obesity-related conditions (diabetes, sleep apnea), and BMI history strengthens appeals."
        },
        {
          action: "Request Hospital Financial Assistance",
          timeline: "Within 30 days",
          why: "Major surgery qualifies for charity care consideration. Many patients don't apply thinking they won't qualify."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim bariatric surgery is 'elective' or 'cosmetic'",
          truth: "Bariatric surgery is medically necessary treatment for severe obesity and related conditions",
          response: "Bariatric surgery was medically necessary for my obesity-related conditions. This is not cosmetic."
        },
        {
          tactic: "They'll say the insurance denial is 'final'",
          truth: "Bariatric appeals have high success rates when properly documented",
          response: "I'm appealing with documentation of medical necessity and comorbid conditions."
        },
        {
          tactic: "They'll pressure payment for 'agreed' costs",
          truth: "You may have been entitled to coverage that was wrongly denied",
          response: "I'm pursuing an appeal. If coverage is approved, insurance will pay this - not me."
        }
      ],
      leveragePoints: [
        {
          leverage: "Medical Necessity Documentation",
          explanation: "Obesity is a disease; bariatric surgery treats it and prevents serious complications.",
          script: "My physician documented this surgery as medically necessary to treat [conditions]. This is not elective."
        },
        {
          leverage: "NIH Coverage Criteria",
          explanation: "NIH guidelines support bariatric surgery for BMI 40+ or BMI 35+ with comorbidities.",
          script: "I meet NIH criteria for bariatric surgery with BMI of [X] and comorbidities including [list]."
        },
        {
          leverage: "State Insurance Appeals Rights",
          explanation: "Most states have external review processes for denied surgeries.",
          script: "I'm requesting external review of this denial through [state department of insurance]."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Gather Medical Documentation", timing: "Within 14 days", successMetric: "Complete history of obesity treatment and comorbidities" },
        { step: 2, action: "File Formal Insurance Appeal", timing: "Within 30 days", successMetric: "Comprehensive appeal with supporting documents" },
        { step: 3, action: "Apply for Hospital Financial Assistance", timing: "Within 30 days", successMetric: "Charity care application submitted" },
        { step: 4, action: "Request External Review if Denied Again", timing: "After internal appeal exhausted", successMetric: "State external review initiated" },
        { step: 5, action: "Negotiate at Insurance Rates if Appeal Fails", timing: "After appeals exhausted", successMetric: "40-60% reduction settlement" }
      ]
    },
    expectedOutcome: "Appeal success in 50-60% of cases. Otherwise, 40-60% reduction through negotiation to insurance rates."
  },
  {
    id: "cosmetic-vs-reconstructive-collections",
    title: "Cosmetic vs. Reconstructive Surgery Dispute",
    icon: Building2,
    situation: "You had surgery that insurance denied as 'cosmetic' but you believe was medically necessary or reconstructive. Examples include: breast reconstruction, rhinoplasty for breathing, skin removal after weight loss, or eyelid surgery for vision. Now the bill is in collections.",
    insiderKnowledge: [
      "The Women's Health and Cancer Rights Act REQUIRES insurers to cover breast reconstruction after mastectomy",
      "Rhinoplasty for documented breathing problems (deviated septum) is medical, not cosmetic",
      "Skin removal after major weight loss can be covered if causing medical problems (rashes, infections)",
      "Blepharoplasty (eyelid surgery) is covered when eyelids obstruct vision - documented by visual field testing",
      "Insurance companies routinely deny legitimate reconstructive surgery claims hoping patients won't appeal"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Document the Medical Necessity",
        details: "Gather evidence that the surgery was for medical reasons, not purely cosmetic enhancement.",
        examples: "Breathing tests for rhinoplasty, visual field tests for blepharoplasty, photos of skin conditions for panniculectomy, mastectomy records for breast reconstruction."
      },
      {
        step: 2,
        title: "Cite Applicable Federal Laws",
        details: "Certain reconstructive surgeries have federal protections. The Women's Health and Cancer Rights Act requires breast reconstruction coverage.",
        script: "Under the Women's Health and Cancer Rights Act, my insurance is required to cover breast reconstruction following mastectomy. This denial violates federal law."
      },
      {
        step: 3,
        title: "Get Supporting Documentation from Physicians",
        details: "Have your surgeon and primary care physician document the medical necessity and functional impairment.",
        documentation: "Include: diagnosis codes, functional impairment measurements, photos before/after, letters of medical necessity."
      },
      {
        step: 4,
        title: "Appeal with Medical Evidence",
        details: "Appeal the cosmetic determination with comprehensive medical documentation.",
        script: "I'm appealing the determination that this surgery was cosmetic. The attached documentation shows this was medically necessary reconstructive surgery for [condition/functional impairment]."
      },
      {
        step: 5,
        title: "Request Peer-to-Peer Review",
        details: "Request that your surgeon speak directly with the insurance company's medical director.",
        process: "Your surgeon can often call the insurance medical director to explain why the procedure was reconstructive, not cosmetic."
      },
      {
        step: 6,
        title: "File Complaint for Federal Violations",
        details: "If federal law requires coverage (breast reconstruction), file complaints with HHS and state insurance commissioner.",
        complaint: "Document the denial and your appeal, then file with the HHS Office of Civil Rights and your state insurance department."
      }
    ],
    inCollectionsDefense: {
      title: "Your Reconstructive Surgery Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Invoke Federal Protections for Covered Procedures",
          timeline: "Within 7 days",
          why: "The Women's Health and Cancer Rights Act requires coverage for post-mastectomy reconstruction. Other procedures have state protections."
        },
        {
          action: "Gather Medical Necessity Documentation",
          timeline: "Within 14 days",
          why: "Document functional impairment (breathing issues, visual obstruction, pain) to prove this wasn't cosmetic."
        },
        {
          action: "Request Peer-to-Peer Review with Surgeon",
          timeline: "Within 30 days",
          why: "Having your surgeon speak directly to the insurance medical director often overturns 'cosmetic' determinations."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim the procedure was 'cosmetic'",
          truth: "Many procedures labeled cosmetic are actually reconstructive for functional issues",
          response: "This was reconstructive surgery for [functional impairment]. I have documentation of medical necessity."
        },
        {
          tactic: "They'll say insurance denial is correct",
          truth: "Cosmetic vs reconstructive appeals have high success rates with proper documentation",
          response: "I'm appealing with medical documentation. Many 'cosmetic' denials are overturned on appeal."
        },
        {
          tactic: "They'll claim federal protections don't apply",
          truth: "WHCRA breast reconstruction protections are federally mandated",
          response: "The Women's Health and Cancer Rights Act requires coverage. Denial violates federal law."
        }
      ],
      leveragePoints: [
        {
          leverage: "Women's Health and Cancer Rights Act",
          explanation: "Federal law requires coverage for post-mastectomy breast reconstruction.",
          script: "Under WHCRA, my insurance must cover breast reconstruction following mastectomy. This denial violates federal law."
        },
        {
          leverage: "Functional Impairment Documentation",
          explanation: "Breathing tests, visual field tests, and pain documentation prove medical necessity.",
          script: "I have documentation of functional impairment including [tests/measurements]. This surgery was medically necessary."
        },
        {
          leverage: "State Insurance Department Complaint",
          explanation: "States enforce reconstruction coverage requirements. Complaints are effective.",
          script: "I'm filing a complaint with the [state] insurance department for improper denial of reconstructive surgery."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Identify Applicable Federal/State Protections", timing: "Within 7 days", successMetric: "Determine if WHCRA or state law applies" },
        { step: 2, action: "Gather Functional Impairment Documentation", timing: "Within 14 days", successMetric: "Medical tests and physician letters collected" },
        { step: 3, action: "File Formal Appeal with Medical Evidence", timing: "Within 30 days", successMetric: "Comprehensive appeal submitted" },
        { step: 4, action: "Request Peer-to-Peer Review", timing: "During appeal", successMetric: "Surgeon speaks with insurance medical director" },
        { step: 5, action: "File Complaints if Still Denied", timing: "After appeal exhausted", successMetric: "HHS and state complaints filed" }
      ]
    },
    expectedOutcome: "Coverage for federally-protected procedures. 50%+ success rate on appeals for other reconstructive surgeries."
  },
  {
    id: "home-health-care-collections",
    title: "Home Health Care Bills in Collections",
    icon: Heart,
    situation: "You or a family member received home health care (nursing visits, physical therapy at home, medical equipment). Medicare/insurance covered less than expected, or coverage was denied. Now bills for $5,000-$50,000+ are in collections.",
    insiderKnowledge: [
      "Medicare covers home health 100% with no copay if you meet 'homebound' and 'skilled care' requirements",
      "Insurance companies frequently deny home health claims improperly - appeal rates are high",
      "Home health agencies often fail to document properly, causing denials that aren't your fault",
      "Many 'custodial care' services denied by insurance may actually qualify as skilled care with proper documentation",
      "If you're being charged for home health that Medicare should cover, the agency may be improperly billing"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Medicare/Insurance Coverage Requirements",
        details: "For Medicare: you must be homebound, need skilled nursing or therapy, and have a doctor's order. Verify these were documented.",
        requirements: "Homebound means leaving home requires considerable effort. Skilled care means care that requires licensed professionals, not just assistance with daily activities."
      },
      {
        step: 2,
        title: "Review Documentation for Errors",
        details: "Home health agencies often lose claims due to documentation failures. Request copies of all clinical documentation.",
        common_errors: "Missing physician orders, inadequate homebound documentation, failure to document skilled care need, late filing with insurance."
      },
      {
        step: 3,
        title: "Appeal Insurance Denials",
        details: "Home health denials are frequently overturned on appeal when proper documentation is provided.",
        script: "I'm appealing the denial of home health coverage. The attached documentation shows I met all requirements: [homebound status/skilled care need/physician order]. Please reconsider this claim."
      },
      {
        step: 4,
        title: "Check for Improper Patient Billing",
        details: "Medicare-participating home health agencies cannot bill patients for covered services. If they're billing you for Medicare-covered care, this is improper.",
        rule: "If you have Medicare and the agency participates in Medicare, they cannot bill you for covered home health services except for any applicable deductible for DME."
      },
      {
        step: 5,
        title: "Request ABN (Advance Beneficiary Notice) Review",
        details: "If the agency knew Medicare wouldn't cover a service, they were required to give you an ABN before providing it. Without an ABN, they may not be able to bill you.",
        script: "Did I receive and sign an Advance Beneficiary Notice before these services were provided? If not, you may not be able to hold me responsible for Medicare non-covered services."
      },
      {
        step: 6,
        title: "Negotiate Based on Documentation Failures",
        details: "If denials were caused by agency documentation failures, use this as leverage.",
        script: "These claims were denied due to documentation issues on the agency's part, not my eligibility. I should not be responsible for the agency's failure to properly document and bill. I'm requesting a significant reduction or dismissal of this balance."
      }
    ],
    inCollectionsDefense: {
      title: "Your Home Health Care Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify ABN (Advance Beneficiary Notice) Was Provided",
          timeline: "Within 7 days",
          why: "If the agency knew Medicare wouldn't cover services but didn't give you an ABN, they can't bill you."
        },
        {
          action: "Check for Agency Documentation Failures",
          timeline: "Within 14 days",
          why: "Many home health denials are caused by agency documentation errors - not your eligibility. The agency should bear responsibility."
        },
        {
          action: "Verify Medicare Home Health Coverage Requirements",
          timeline: "Within 7 days",
          why: "Medicare covers home health 100% with no copay if you're homebound and need skilled care. Verify requirements were met."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim services 'weren't covered'",
          truth: "Many denials are due to agency documentation failures, not actual ineligibility",
          response: "I believe I met coverage requirements. The denial was due to agency documentation errors."
        },
        {
          tactic: "They'll say you're responsible for non-covered care",
          truth: "Without a proper ABN, Medicare-participating agencies can't bill patients for denied services",
          response: "I was not given an Advance Beneficiary Notice. The agency cannot hold me responsible."
        },
        {
          tactic: "They'll claim custodial care isn't covered",
          truth: "Many 'custodial' services actually qualify as skilled care with proper documentation",
          response: "These services required skilled nursing/therapy. The documentation should reflect skilled care needs."
        }
      ],
      leveragePoints: [
        {
          leverage: "Missing ABN Protection",
          explanation: "No ABN = no patient liability for Medicare non-covered home health services.",
          script: "I did not receive an Advance Beneficiary Notice. Under Medicare rules, you cannot bill me for services denied without a valid ABN."
        },
        {
          leverage: "Agency Documentation Liability",
          explanation: "If claims were denied due to agency errors, they should absorb the cost.",
          script: "The denial was caused by your agency's documentation failures. I should not be responsible for your billing errors."
        },
        {
          leverage: "Medicare Appeal Rights",
          explanation: "Home health denials can be appealed through Medicare's appeals process.",
          script: "I'm appealing this denial through Medicare. I met the homebound and skilled care requirements."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Request Copy of ABN If Any", timing: "Within 7 days", successMetric: "Verify ABN was properly provided and signed" },
        { step: 2, action: "Review Medicare Coverage Requirements", timing: "Within 7 days", successMetric: "Confirm homebound and skilled care status" },
        { step: 3, action: "Request Clinical Documentation", timing: "Within 14 days", successMetric: "Identify any agency documentation failures" },
        { step: 4, action: "Appeal Medicare Denial if Eligible", timing: "Within 120 days of denial", successMetric: "Appeal filed with supporting documentation" },
        { step: 5, action: "Negotiate Based on Agency Errors", timing: "If ABN missing or documentation failed", successMetric: "50-100% reduction or dismissal" }
      ]
    },
    expectedOutcome: "50-70% reduction or full dismissal if documentation failures or improper billing occurred"
  },
  {
    id: "dialysis-collections",
    title: "Dialysis Treatment Bills in Collections",
    icon: Heart,
    situation: "You require dialysis for kidney disease. Despite having Medicare (ESRD entitles you to Medicare), insurance, or Medicaid, you're receiving bills for dialysis sessions, medications, or related care. Now bills are in collections.",
    insiderKnowledge: [
      "End-Stage Renal Disease (ESRD) entitles you to Medicare regardless of age - after a waiting period",
      "Large dialysis companies (DaVita, Fresenius) have been sued for predatory billing practices",
      "Medicare's 30-month coordination period creates confusion about which insurance pays first",
      "Dialysis facilities often bill for services that should be included in the bundled payment",
      "Patient assistance programs from dialysis companies and drug manufacturers can cover copays"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Your Medicare ESRD Entitlement",
        details: "If you have ESRD and are on dialysis, you're entitled to Medicare. Verify your Medicare enrollment date and coordination period.",
        coordination: "During the first 30 months, your employer group health plan pays first, then Medicare. After 30 months, Medicare pays first."
      },
      {
        step: 2,
        title: "Check Bundled Payment Compliance",
        details: "Medicare pays dialysis facilities a bundled rate that should include most services. You shouldn't be separately billed for bundled items.",
        bundled: "The ESRD bundle includes: dialysis treatment, drugs and biologicals, laboratory tests, training, and supplies used during treatment."
      },
      {
        step: 3,
        title: "Apply for Dialysis Facility Financial Assistance",
        details: "DaVita, Fresenius, and other major dialysis providers have financial assistance programs for copays and non-covered services.",
        script: "I'm requesting financial assistance for my dialysis-related costs. Please provide information about your patient assistance program and help me apply."
      },
      {
        step: 4,
        title: "Apply for Drug Manufacturer Assistance",
        details: "Many drugs used in dialysis (Epogen, Aranesp) have manufacturer assistance programs for copays.",
        programs: "Amgen (Epogen, Aranesp), AstraZeneca, and other manufacturers offer copay cards and patient assistance."
      },
      {
        step: 5,
        title: "Verify Correct Insurance Coordination",
        details: "Billing errors often occur when insurance coordination is wrong. Make sure the correct insurer was billed as primary.",
        script: "Please verify that claims were coordinated correctly between my [employer insurance/Medicare/Medicaid]. I believe billing errors may have occurred due to incorrect primary/secondary determination."
      },
      {
        step: 6,
        title: "Report Potential Fraud",
        details: "If you believe the dialysis facility is engaging in improper billing, report it. Dialysis fraud is a significant issue that regulators take seriously.",
        reporting: "Report to CMS, your state attorney general, or the OIG hotline at 1-800-HHS-TIPS."
      }
    ],
    inCollectionsDefense: {
      title: "Your Dialysis Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify Medicare ESRD Entitlement and Coordination",
          timeline: "Within 7 days",
          why: "ESRD entitles you to Medicare. Billing errors often occur when insurance coordination is wrong during the 30-month period."
        },
        {
          action: "Check for Unbundled Services",
          timeline: "Within 14 days",
          why: "Medicare pays dialysis facilities a bundled rate. You shouldn't be billed separately for services included in the bundle."
        },
        {
          action: "Apply for Dialysis Company Financial Assistance",
          timeline: "Within 30 days",
          why: "DaVita, Fresenius, and other dialysis companies have patient assistance for copays and non-covered services."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim you owe copays/coinsurance",
          truth: "Patient assistance programs often cover copays entirely",
          response: "I'm applying for the dialysis company's patient assistance program. Please pause collection."
        },
        {
          tactic: "They'll say insurance coordination is 'your problem'",
          truth: "Coordination errors are often provider billing mistakes",
          response: "These billing errors appear to be coordination mistakes. Please verify claims were billed to the correct primary insurer."
        },
        {
          tactic: "They'll bill separately for bundled items",
          truth: "Medicare's ESRD bundle includes most dialysis-related services",
          response: "These services should be included in the ESRD bundled payment. Separate billing is improper."
        }
      ],
      leveragePoints: [
        {
          leverage: "ESRD Bundle Payment Rules",
          explanation: "Medicare pays a bundled rate for dialysis. Facilities can't separately bill for bundled items.",
          script: "This service is included in the Medicare ESRD bundled payment. You cannot separately bill me for bundled services."
        },
        {
          leverage: "Insurance Coordination Errors",
          explanation: "The 30-month coordination period creates billing confusion. Errors should be corrected by the facility.",
          script: "Please verify correct primary/secondary insurance coordination. I believe claims were billed incorrectly."
        },
        {
          leverage: "Dialysis Company Patient Assistance",
          explanation: "Major dialysis companies have assistance programs that cover most copay obligations.",
          script: "I'm applying for [DaVita/Fresenius] patient assistance. These programs typically cover patient copays."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify Medicare ESRD Enrollment Status", timing: "Within 7 days", successMetric: "Confirm enrollment and coordination period" },
        { step: 2, action: "Audit Bill for Unbundled Services", timing: "Within 14 days", successMetric: "Identify any improperly separated charges" },
        { step: 3, action: "Apply for Dialysis Company Assistance", timing: "Within 30 days", successMetric: "Patient assistance application submitted" },
        { step: 4, action: "Apply for Drug Manufacturer Assistance", timing: "Within 30 days", successMetric: "Copay assistance for medications" },
        { step: 5, action: "Report Any Billing Fraud", timing: "If improper billing found", successMetric: "OIG or CMS complaint filed" }
      ]
    },
    expectedOutcome: "Correction of billing errors and coordination issues. Financial assistance programs to cover remaining copays."
  },
  {
    id: "vision-lasik-collections",
    title: "Vision Care/LASIK/Cataract Surgery Bills in Collections",
    icon: Target,
    situation: "You had eye surgery (LASIK, cataract surgery, glaucoma treatment) or significant vision care. Your insurance denied coverage or covered less than expected. Now bills for $3,000-$15,000+ are in collections.",
    insiderKnowledge: [
      "LASIK is almost never covered by insurance as it's considered elective - but complications should be covered",
      "Cataract surgery IS typically covered by Medicare and most insurance when medically necessary",
      "Premium lens implants during cataract surgery may not be covered, but basic lenses should be",
      "Many vision care expenses can be paid with HSA/FSA funds, reducing your tax burden",
      "LASIK pricing is extremely competitive - many providers offer significant discounts"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Distinguish Elective vs. Medical Procedures",
        details: "LASIK for convenience is elective. Cataract surgery, glaucoma treatment, and surgery for eye diseases are medical.",
        covered: "Medical insurance typically covers: cataract surgery, glaucoma procedures, macular degeneration treatment, diabetic eye disease treatment."
      },
      {
        step: 2,
        title: "Challenge Cataract Surgery Denials",
        details: "If cataract surgery was denied as 'not medically necessary,' appeal with documentation of visual impairment.",
        script: "I'm appealing the denial of cataract surgery coverage. My visual acuity was [X], significantly impacting my daily functioning. This surgery was medically necessary, not elective."
      },
      {
        step: 3,
        title: "Verify Correct Lens Coding",
        details: "Standard lenses are covered; premium lenses (multifocal, toric) often aren't. Verify which lenses were implanted and how they were billed.",
        question: "What type of lens was implanted and how was it billed? If a premium lens was used, was I informed of the out-of-pocket cost difference before surgery?"
      },
      {
        step: 4,
        title: "Use HSA/FSA for Remaining Balance",
        details: "Vision surgery expenses are HSA/FSA eligible, effectively reducing your cost by your tax rate.",
        tip: "If you have an HSA or FSA, use it for vision expenses. You'll save 20-40% depending on your tax bracket."
      },
      {
        step: 5,
        title: "Negotiate LASIK Pricing",
        details: "LASIK is a competitive market. If you were overcharged, negotiate using competitor pricing.",
        market: "LASIK typically costs $2,000-$4,000 per eye. If you were charged $5,000+, this may be negotiable using competitor quotes."
      },
      {
        step: 6,
        title: "Set Up Interest-Free Payment Plan",
        details: "Many eye surgery practices offer interest-free financing. Request a payment plan if you can't pay in full.",
        script: "I'm requesting an interest-free payment plan for this balance. I can afford $[amount] per month. Please provide your financing options."
      }
    ],
    inCollectionsDefense: {
      title: "Your Vision/LASIK Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Check if Medical Insurance Applies",
          timeline: "Within 7 days",
          why: "Vision procedures for medical conditions (keratoconus, cataracts, diabetic eye disease) may be covered by medical - not vision - insurance."
        },
        {
          action: "Review Financing Agreement Terms",
          timeline: "Within 7 days",
          why: "Many LASIK procedures come with 0% financing. Check if interest or fees were added improperly."
        },
        {
          action: "Verify Quoted Price Matches Bill",
          timeline: "Within 14 days",
          why: "LASIK providers often quote 'per eye' pricing or add unexpected enhancement fees. Confirm original quote."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim vision procedures are 'elective' and non-negotiable",
          truth: "Many vision procedures are medically necessary, and all bills are negotiable",
          response: "This procedure was medically necessary for [condition]. I'm exploring medical insurance coverage."
        },
        {
          tactic: "They'll enforce strict financing terms",
          truth: "Financing disputes can be challenged if terms weren't clear",
          response: "The financing terms weren't clearly disclosed. I'm disputing the interest charges."
        },
        {
          tactic: "They'll claim you agreed to the full price",
          truth: "Pricing discrepancies between quote and bill should be resolved",
          response: "My original quote was $[amount]. Please explain why the bill is $[higher amount]."
        }
      ],
      leveragePoints: [
        {
          leverage: "Medical vs Vision Insurance",
          explanation: "Medical conditions like keratoconus, cataracts, and injury may be covered by medical insurance.",
          script: "This procedure was for a medical condition. I'm filing a claim with my medical insurance, not vision insurance."
        },
        {
          leverage: "Pricing Quote Verification",
          explanation: "Compare your original quote to the final bill. Unexplained increases should be challenged.",
          script: "My original quote was $[quote]. The bill of $[higher] includes charges I didn't agree to."
        },
        {
          leverage: "Self-Pay Market Rate Comparison",
          explanation: "LASIK pricing is highly competitive. Use market rates as negotiation leverage.",
          script: "Competitors offer this procedure for $[lower price]. I'm requesting a price match or discount."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Check Medical Insurance Applicability", timing: "Within 7 days", successMetric: "Determine if medical coverage applies" },
        { step: 2, action: "Review Original Quote and Financing Terms", timing: "Within 7 days", successMetric: "Document any discrepancies" },
        { step: 3, action: "File Medical Insurance Claim if Applicable", timing: "Within 30 days", successMetric: "Claim submitted with medical necessity documentation" },
        { step: 4, action: "Dispute Any Pricing Discrepancies", timing: "Within 14 days", successMetric: "Written dispute filed" },
        { step: 5, action: "Negotiate Based on Market Rates", timing: "After disputes resolved", successMetric: "20-40% reduction or price match" }
      ]
    },
    expectedOutcome: "Coverage for medically necessary procedures. 20-40% reduction for elective procedures through negotiation."
  },
  {
    id: "sleep-study-collections",
    title: "Sleep Study/Sleep Apnea Treatment Bills in Collections",
    icon: Clock,
    situation: "You had a sleep study to diagnose sleep apnea and/or received CPAP equipment. Your insurance denied coverage or paid less than expected. Now bills for $2,000-$10,000+ are in collections.",
    insiderKnowledge: [
      "Sleep studies are notoriously expensive in hospital settings ($5,000+) but home sleep tests cost $200-$500",
      "Insurance often denies CPAP equipment without 'compliance' proof - you must use it for a certain number of hours",
      "Many CPAP suppliers charge 5-10x the retail price of equipment",
      "Home sleep testing is now preferred by most insurers over in-lab studies for uncomplicated cases",
      "CPAP 'rental' programs often cost more than purchasing equipment outright"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Medical Necessity Was Documented",
        details: "Sleep studies require symptoms like daytime sleepiness, witnessed apneas, or other clinical indicators. Verify these were documented.",
        script: "Was the sleep study ordered based on documented symptoms and clinical indicators? Please provide the referral documentation showing medical necessity."
      },
      {
        step: 2,
        title: "Compare In-Lab vs. Home Study Pricing",
        details: "If you had an in-lab study, compare what a home study would have cost. Use this as evidence of overcharging.",
        comparison: "In-lab sleep study: $3,000-$6,000. Home sleep test: $200-$500. If the home test was appropriate, question why you were charged for in-lab."
      },
      {
        step: 3,
        title: "Challenge CPAP Equipment Pricing",
        details: "CPAP machines cost $500-$800 retail but are often billed at $2,000-$4,000. Challenge excessive pricing.",
        script: "The retail price of this CPAP machine is approximately $[600-800]. I'm requesting adjustment to a fair price, not the inflated amount billed."
      },
      {
        step: 4,
        title: "Verify Rental vs. Purchase Terms",
        details: "If renting CPAP equipment, after approximately 13 months of rental you should own it. Verify you're not still being charged rent.",
        question: "Has this equipment reached the rental cap period? Please confirm whether I now own the equipment and stop any further rental charges."
      },
      {
        step: 5,
        title: "Appeal CPAP Coverage Denials",
        details: "If CPAP was denied for non-compliance, provide documentation of your usage and any barriers to compliance.",
        script: "I'm appealing the denial of CPAP coverage. I have been compliant with treatment [or: I experienced barriers to compliance due to X]. Please provide an opportunity to demonstrate compliance."
      },
      {
        step: 6,
        title: "Negotiate Based on Fair Market Value",
        details: "Sleep medicine billing is notoriously inflated. Negotiate using fair market pricing.",
        script: "The fair market value for this sleep study is approximately $[500-1,500]. The billed amount of $[amount] is excessive. I'm prepared to pay fair market value to settle this account."
      }
    ],
    inCollectionsDefense: {
      title: "Your Sleep Study Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Compare In-Lab vs Home Study Pricing",
          timeline: "Within 7 days",
          why: "In-lab sleep studies cost $2,000-$5,000, but home studies cost $150-$500 and are often equally diagnostic. If you weren't offered a home option, challenge the billing."
        },
        {
          action: "Check for Facility Fee Overcharging",
          timeline: "Within 7 days",
          why: "Hospital-based sleep labs charge facility fees that independent labs don't. These can triple the cost."
        },
        {
          action: "Verify Insurance Prior Authorization",
          timeline: "Within 14 days",
          why: "Sleep studies often require prior authorization. If the facility failed to obtain it, they may bear responsibility for the denial."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim in-lab studies are 'medically necessary'",
          truth: "For most patients, home sleep tests are equally effective and much cheaper",
          response: "I should have been offered a home sleep test option. The in-lab study was unnecessarily expensive."
        },
        {
          tactic: "They'll say facility fees are 'standard'",
          truth: "Independent sleep labs don't charge facility fees - only hospital-based ones do",
          response: "Independent labs don't charge these facility fees. Your pricing is excessive for a sleep study."
        },
        {
          tactic: "They'll claim the full price is non-negotiable",
          truth: "Sleep study pricing has huge variation and is very negotiable",
          response: "Home sleep tests cost $150-$500. Your charge of $[much higher] is excessive."
        }
      ],
      leveragePoints: [
        {
          leverage: "Home Study Alternative",
          explanation: "For most patients, home sleep tests are diagnostic and cost 80-90% less.",
          script: "I should have been offered a home sleep test at $150-$500 instead of an in-lab study at $[higher amount]."
        },
        {
          leverage: "Excessive Facility Fees",
          explanation: "Hospital-based sleep labs charge facility fees that dramatically increase costs.",
          script: "Independent sleep labs don't charge these facility fees. I'm disputing the facility fee portion."
        },
        {
          leverage: "Prior Authorization Failure",
          explanation: "If prior auth wasn't obtained, the facility may be responsible for the denial.",
          script: "Prior authorization was not obtained. The facility should be responsible for this coverage denial."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Home Sleep Test Pricing", timing: "Within 7 days", successMetric: "Document fair market rates ($150-$500)" },
        { step: 2, action: "Identify Facility Fee Charges", timing: "Within 7 days", successMetric: "Separate technical vs professional fees" },
        { step: 3, action: "Verify Prior Authorization Status", timing: "Within 14 days", successMetric: "Determine if facility failed requirements" },
        { step: 4, action: "Appeal Insurance Denial with Home Study Alternative", timing: "Within 30 days", successMetric: "Appeal citing less expensive alternative" },
        { step: 5, action: "Negotiate at Home Study Rates", timing: "After research complete", successMetric: "50-70% reduction" }
      ]
    },
    expectedOutcome: "50-70% reduction by challenging excessive pricing and demonstrating fair market rates"
  },
  {
    id: "chronic-condition-collections",
    title: "Chronic Condition Management Bills in Collections",
    icon: Heart,
    situation: "You have a chronic condition (diabetes, hypertension, asthma, rheumatoid arthritis, etc.) requiring ongoing medications, monitoring, and specialist visits. Insurance has denied or limited coverage, leaving you with accumulated bills. Now they're in collections.",
    insiderKnowledge: [
      "Chronic condition medications often have manufacturer copay cards and patient assistance programs",
      "Insurance 'step therapy' or 'prior authorization' requirements are often overturned on appeal",
      "Many chronic condition patients qualify for Medicare disability before age 65",
      "State pharmaceutical assistance programs exist in many states for chronic conditions",
      "Routine chronic disease monitoring should be covered as preventive care under ACA"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Apply for All Available Medication Assistance",
        details: "Most expensive chronic condition medications have manufacturer assistance. Apply for every program available.",
        programs: "Check manufacturer websites, NeedyMeds.org, RxAssist.org, and PatientAdvocate.org for available programs."
      },
      {
        step: 2,
        title: "Appeal Prior Authorization and Step Therapy Denials",
        details: "If insurance requires you to try cheaper medications first, document why they don't work for you.",
        script: "I'm appealing the requirement to try [alternative medication]. I have previously failed [or have contraindications to] this medication because [reason]. My physician recommends [prescribed medication] as medically necessary."
      },
      {
        step: 3,
        title: "Request Preventive Care Coding",
        details: "Routine chronic disease monitoring (A1C tests, kidney function tests) may be covered as preventive care.",
        examples: "Diabetes: A1C, foot exams, eye exams. Hypertension: blood pressure monitoring. These should often be covered at 100%."
      },
      {
        step: 4,
        title: "Explore State Pharmaceutical Assistance",
        details: "Many states have programs to help with medication costs for chronic conditions. Eligibility varies by state.",
        resources: "Search '[your state] pharmaceutical assistance program' or contact your state health department."
      },
      {
        step: 5,
        title: "Check Medicare Disability Eligibility",
        details: "If your chronic condition prevents you from working, you may qualify for Medicare disability benefits before age 65.",
        conditions: "Conditions like ESRD, certain cancers, and disabling arthritis may qualify for Medicare regardless of age."
      },
      {
        step: 6,
        title: "Negotiate Accumulated Bills as a Package",
        details: "If you have multiple chronic condition bills in collections, negotiate them together for a larger discount.",
        script: "I have multiple bills from ongoing chronic condition management totaling $[total]. I'm prepared to settle all accounts for [25-35%] of the total as a comprehensive resolution."
      }
    ],
    inCollectionsDefense: {
      title: "Your Chronic Condition Treatment Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Apply for All Applicable Patient Assistance Programs",
          timeline: "Within 14 days",
          why: "Chronic conditions have many assistance programs - disease-specific foundations, manufacturer programs, and copay cards."
        },
        {
          action: "Verify Out-of-Pocket Maximum Was Applied",
          timeline: "Within 7 days",
          why: "With chronic conditions, you often hit your OOP max. Verify nothing was charged after you should have hit it."
        },
        {
          action: "Negotiate Bulk/Multi-Bill Discounts",
          timeline: "Within 30 days",
          why: "If you have multiple bills from the same provider system, negotiate a bulk settlement across all of them."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim ongoing treatment is 'your responsibility'",
          truth: "Chronic conditions have the most assistance programs available",
          response: "I'm applying for disease-specific patient assistance programs. Many chronic conditions have robust support."
        },
        {
          tactic: "They'll pressure quick payment knowing you have ongoing needs",
          truth: "Your ongoing care relationship actually gives you leverage",
          response: "I need ongoing care from this provider. They have incentive to work with me on billing."
        },
        {
          tactic: "They'll ignore your OOP maximum claims",
          truth: "The OOP max is legally binding - verify and enforce it",
          response: "I hit my out-of-pocket maximum on [date]. All charges after that should be covered 100%."
        }
      ],
      leveragePoints: [
        {
          leverage: "Disease-Specific Foundations",
          explanation: "Organizations like the National MS Society, Crohn's Foundation, and others offer financial assistance.",
          script: "I'm applying for assistance through [disease-specific foundation]. Please pause collection while this is reviewed."
        },
        {
          leverage: "Manufacturer Patient Assistance",
          explanation: "Drug manufacturers have programs for chronic condition medications.",
          script: "I'm applying for [manufacturer] patient assistance. This may cover medication costs retroactively."
        },
        {
          leverage: "Bulk Settlement Negotiation",
          explanation: "Multiple bills from the same system can be settled together at a discount.",
          script: "I have multiple bills totaling $[amount]. I'd like to negotiate a single settlement across all accounts."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Disease-Specific Assistance Programs", timing: "Within 7 days", successMetric: "Identify all applicable foundations" },
        { step: 2, action: "Apply for All Assistance Programs", timing: "Within 14 days", successMetric: "Applications submitted" },
        { step: 3, action: "Verify Out-of-Pocket Maximum Calculation", timing: "Within 7 days", successMetric: "Confirm charges after OOP max" },
        { step: 4, action: "Consolidate All Outstanding Bills", timing: "Within 14 days", successMetric: "Full inventory of balances" },
        { step: 5, action: "Negotiate Bulk Settlement at 35-50%", timing: "After assistance determined", successMetric: "Single settlement agreement" }
      ]
    },
    expectedOutcome: "40-60% reduction through assistance programs and bulk negotiation. Medication costs potentially eliminated."
  },
  {
    id: "hospice-end-of-life-collections",
    title: "Hospice/End-of-Life Care Bills in Collections",
    icon: Heart,
    situation: "Your family member received hospice or end-of-life care, and now the family is receiving bills despite hospice supposedly covering everything. Or the patient died and bills are coming to family members. These bills are going to collections.",
    insiderKnowledge: [
      "Medicare hospice benefit covers virtually all end-of-life care costs - there should be minimal out-of-pocket",
      "Family members are generally NOT responsible for a deceased person's medical debt (with limited exceptions)",
      "Hospice agencies sometimes bill improperly for services that should be included in the daily rate",
      "If the patient was on hospice, curative treatment isn't covered - but all comfort care should be",
      "Collections agencies frequently and illegally try to collect from family members who don't owe the debt"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify What Medicare Hospice Covers",
        details: "Medicare hospice covers: nursing care, drugs for pain/symptom control, medical equipment, hospice aide services, and short-term respite care.",
        notCovered: "Medicare hospice does NOT cover: treatment to cure the terminal illness, care from providers not set up through hospice, room and board at home."
      },
      {
        step: 2,
        title: "Confirm Family Is Not Personally Liable",
        details: "Unless you co-signed, are a surviving spouse in a community property state, or are the estate executor, you're likely not responsible.",
        script: "I am not personally responsible for this debt. I did not co-sign or guarantee payment. Please remove my name from this account immediately."
      },
      {
        step: 3,
        title: "Review Hospice Billing for Errors",
        details: "Hospice agencies sometimes bill separately for services included in their daily rate. Review for duplicate or improper charges.",
        included: "The hospice daily rate should include: all nursing visits, medications related to terminal diagnosis, medical equipment, and supplies."
      },
      {
        step: 4,
        title: "Check for Improper 'Curative' Charges",
        details: "Once someone elects hospice, curative treatment isn't covered - but they shouldn't have received or been billed for curative care either.",
        question: "Were any services provided that were curative rather than palliative? If the patient was on hospice, curative services should not have been offered or billed."
      },
      {
        step: 5,
        title: "Request Estate Claim Process Information",
        details: "If the debt is legitimate, it should be paid from the estate, not from family members personally.",
        script: "This debt, if valid, is an obligation of the estate of [deceased name]. Please submit your claim through the proper probate process. Family members are not personally liable."
      },
      {
        step: 6,
        title: "Report Aggressive Collection on Deceased's Debt",
        details: "If collectors are harassing family members for a deceased person's debt, this may violate the FDCPA.",
        report: "File complaints with the CFPB and state attorney general if collectors are improperly pursuing family members."
      }
    ],
    inCollectionsDefense: {
      title: "Hospice/End-of-Life Care Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Verify Medicare/Medicaid Hospice Benefit Was Applied",
          timeline: "Within 7 days",
          why: "Medicare covers hospice at 100% for terminal illness. If there are bills, something may be billed incorrectly."
        },
        {
          action: "Determine Family Member Liability",
          timeline: "Within 7 days",
          why: "Family members are generally NOT responsible for a deceased person's medical debts unless they signed a guarantee."
        },
        {
          action: "Check for Services That Should Be Included in Hospice",
          timeline: "Within 14 days",
          why: "Once in hospice, most care related to the terminal illness should be covered - separate bills may be improper."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll pressure grieving family members to pay",
          truth: "Family members are generally NOT personally liable for these debts",
          response: "I am not personally responsible for this debt. Debts must be paid from the estate."
        },
        {
          tactic: "They'll claim services weren't covered by hospice",
          truth: "Once in hospice, most terminal illness care should be covered",
          response: "These services should be covered under the hospice benefit. This is improper billing."
        },
        {
          tactic: "They'll claim you 'signed' financial responsibility",
          truth: "Signing as a 'responsible party' for a patient doesn't make you personally liable for their debts",
          response: "Signing paperwork as a responsible party doesn't create personal liability. Prove I personally guaranteed this debt."
        }
      ],
      leveragePoints: [
        {
          leverage: "Medicare Hospice Benefit",
          explanation: "Medicare covers hospice at 100% with no copays for the terminal illness.",
          script: "These services should be covered under Medicare hospice at 100%. Please verify proper billing."
        },
        {
          leverage: "No Personal Liability for Family",
          explanation: "Unless you signed a personal guarantee, you're not responsible for a deceased person's debts.",
          script: "I am not personally liable for this debt. Please provide documentation of any personal guarantee I signed."
        },
        {
          leverage: "Included in Hospice Benefit",
          explanation: "Once hospice election is made, most care for the terminal condition is included.",
          script: "These services relate to the terminal diagnosis and should be covered under the hospice benefit."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Verify Your Relationship to the Debt", timing: "Within 3 days", successMetric: "Confirm no personal guarantee exists" },
        { step: 2, action: "Check Medicare Hospice Coverage", timing: "Within 7 days", successMetric: "Verify hospice election was in effect" },
        { step: 3, action: "Identify Services That Should Be Covered", timing: "Within 14 days", successMetric: "Document improper billing" },
        { step: 4, action: "Redirect Collectors to Estate", timing: "If no personal liability", successMetric: "Claims directed to probate" },
        { step: 5, action: "File Complaints for Improper Collection", timing: "If harassment continues", successMetric: "CFPB and state AG complaints" }
      ]
    },
    expectedOutcome: "Dismissal of personal liability for family members. Resolution of estate debts through proper probate process."
  },
  {
    id: "psychiatric-hospital-collections",
    title: "Psychiatric Hospitalization Bills in Collections",
    icon: Users,
    situation: "You or a family member was hospitalized for psychiatric care (suicidal ideation, psychotic episode, severe depression, etc.). Despite having insurance, coverage was denied or limited, leaving bills of $10,000-$100,000+ now in collections.",
    insiderKnowledge: [
      "The Mental Health Parity Act requires equal coverage for mental health and physical health - many denials violate this",
      "Psychiatric hospitals often charge $1,500-$3,000+ per day with minimal actual treatment",
      "Insurance companies routinely deny psychiatric admissions as 'not medically necessary' when they clearly were",
      "Length of stay denials are common - insurance says '3 days' was enough when doctors ordered 10",
      "Psychiatric facility financial assistance is often generous due to the vulnerable patient population"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Document the Emergency Nature of Admission",
        details: "Gather documentation showing why admission was necessary: suicidality assessment, risk factors, police/ambulance involvement.",
        script: "This psychiatric admission was medically necessary due to [imminent risk of harm to self/others/acute psychotic symptoms]. Please review the admission assessment documenting this emergency."
      },
      {
        step: 2,
        title: "Challenge Length-of-Stay Denials",
        details: "If insurance approved initial days but denied continued stay, appeal with daily clinical documentation.",
        script: "I'm appealing the denial of days [X-Y] of this psychiatric hospitalization. Clinical documentation shows I continued to meet [inpatient/acute care] criteria due to [ongoing symptoms/safety concerns]."
      },
      {
        step: 3,
        title: "Invoke Mental Health Parity Law",
        details: "If similar physical health admissions would be covered, psychiatric admissions must be covered equally.",
        script: "Under the Mental Health Parity and Addiction Equity Act, coverage criteria for psychiatric hospitalization cannot be more restrictive than for medical hospitalization. Please explain how this denial complies with parity requirements."
      },
      {
        step: 4,
        title: "Audit Daily Charges",
        details: "Psychiatric hospital daily rates often include minimal actual treatment. Review what services were actually provided.",
        redFlags: ["Same 'therapy' charge every day regardless of actual therapy", "Minimal actual psychiatrist time", "Group therapy counted as individual therapy", "Charges for services not documented in medical record"]
      },
      {
        step: 5,
        title: "Apply for Facility Financial Assistance",
        details: "Psychiatric facilities often have generous financial assistance programs. Apply even if you think you don't qualify.",
        script: "I'm requesting financial assistance for this psychiatric hospitalization. I experienced a mental health crisis and am facing significant financial burden from this necessary care."
      },
      {
        step: 6,
        title: "Negotiate Based on Actual Services Received",
        details: "If daily rates were high but actual treatment was minimal, use this as leverage.",
        script: "The daily rate of $[amount] should reflect comprehensive psychiatric treatment. Reviewing my medical records, I received [limited actual services]. I'm requesting adjustment to reflect the actual care provided."
      }
    ],
    inCollectionsDefense: {
      title: "Your Psychiatric Hospital Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Invoke Mental Health Parity Law",
          timeline: "Within 7 days",
          why: "The Mental Health Parity Act requires equal coverage for mental health and physical health. Discriminatory denials can be appealed."
        },
        {
          action: "Apply for Hospital Financial Assistance",
          timeline: "Within 30 days",
          why: "Psychiatric hospitals, like all hospitals, must offer charity care. Mental health crises often accompany financial hardship."
        },
        {
          action: "Challenge Involuntary Hold Billing",
          timeline: "Within 14 days",
          why: "If you were held involuntarily, you may have additional legal protections regarding billing responsibility."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim mental health stays aren't covered",
          truth: "Mental health must be covered at parity with physical health under federal law",
          response: "The Mental Health Parity Act requires equal coverage. This denial discriminates against mental health."
        },
        {
          tactic: "They'll use stigma to pressure payment",
          truth: "Mental health is healthcare - it deserves the same billing protections",
          response: "This is a medical bill like any other. I have the same rights to dispute and negotiate."
        },
        {
          tactic: "They'll claim you 'consented' to treatment",
          truth: "Consent during a mental health crisis has unique legal considerations",
          response: "I was in a mental health crisis and may not have had capacity to consent to financial terms."
        }
      ],
      leveragePoints: [
        {
          leverage: "Mental Health Parity Act",
          explanation: "Federal law requires equal coverage for mental health and physical health conditions.",
          script: "This denial violates the Mental Health Parity Act. Mental health treatment must be covered at parity with physical health."
        },
        {
          leverage: "Capacity at Time of Admission",
          explanation: "Financial consent during a mental health crisis may not be valid.",
          script: "I was experiencing a mental health crisis at admission. I question the validity of any financial agreements signed."
        },
        {
          leverage: "Nonprofit Hospital Charity Care",
          explanation: "Psychiatric hospitals must offer charity care like any hospital.",
          script: "I'm applying for financial assistance. Mental health crises often accompany financial difficulties."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Review Insurance Denial for Parity Violations", timing: "Within 7 days", successMetric: "Identify any discriminatory treatment" },
        { step: 2, action: "File Mental Health Parity Appeal", timing: "Within 30 days", successMetric: "Parity-based appeal submitted" },
        { step: 3, action: "Apply for Hospital Charity Care", timing: "Within 30 days", successMetric: "Financial assistance application submitted" },
        { step: 4, action: "Challenge Capacity/Consent Issues", timing: "If applicable", successMetric: "Legal review of consent validity" },
        { step: 5, action: "Negotiate at 35-50% if Appeals Fail", timing: "After appeals exhausted", successMetric: "Settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "40-70% reduction through parity appeals, financial assistance, and service-level negotiation"
  },
  {
    id: "allergy-testing-collections",
    title: "Allergy Testing/Immunotherapy Bills in Collections",
    icon: Stethoscope,
    situation: "You had allergy testing (skin tests or blood panels) and/or started immunotherapy (allergy shots). Your insurance denied coverage or you received unexpectedly high bills. Now $2,000-$15,000+ is in collections.",
    insiderKnowledge: [
      "Allergy blood panels can cost $30 each at some labs or $300 each at others - for the same test",
      "Some allergists test for 50+ allergens when 10-15 would be clinically appropriate",
      "Allergy skin testing should cost $150-$500 total, not $2,000+",
      "Immunotherapy (allergy shots) is often cheaper through primary care than allergist offices",
      "Many expensive allergy tests are 'medically unnecessary' and can be challenged"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Verify Testing Was Clinically Appropriate",
        details: "Review how many allergens were tested. If 50+ allergens were tested when your symptoms suggested only certain categories, challenge the excess.",
        question: "Based on my symptoms, how many allergens was it clinically appropriate to test? I'd like to understand why [X] different allergens were tested."
      },
      {
        step: 2,
        title: "Compare Blood Panel Pricing",
        details: "Allergy blood tests (specific IgE) vary wildly in price. Get pricing from other labs for comparison.",
        benchmark: "Individual allergen IgE tests should cost $10-$40 each. If you're charged $200+ per allergen, this is excessive."
      },
      {
        step: 3,
        title: "Challenge Medical Necessity for Extensive Panels",
        details: "Comprehensive allergy panels are often ordered for convenience, not medical necessity. Challenge if inappropriate.",
        script: "I'm disputing the medical necessity of testing [X] allergens when my symptoms were consistent with [specific category]. Please provide documentation supporting the clinical need for this extensive testing."
      },
      {
        step: 4,
        title: "Appeal Insurance Denials for Immunotherapy",
        details: "If allergy shots were denied, appeal with documentation of severity and failed medication management.",
        script: "I'm appealing the denial of immunotherapy coverage. I have documented allergic rhinitis/asthma affecting my quality of life, and have failed treatment with [antihistamines/nasal steroids/etc.]."
      },
      {
        step: 5,
        title: "Explore Alternative Immunotherapy Settings",
        details: "Going forward, allergy shots can often be administered at primary care offices for significantly less cost.",
        savings: "Allergist office visits for shots: $30-$50 each. Primary care office: $15-$25 each or included in other visits."
      },
      {
        step: 6,
        title: "Negotiate Based on Fair Market Lab Rates",
        details: "Use lab pricing comparisons to negotiate down excessive blood test charges.",
        script: "These allergy blood tests are available for $[lower price] at [reference lab]. I'm requesting adjustment to fair market pricing rather than the inflated charges billed."
      }
    ],
    inCollectionsDefense: {
      title: "Your Allergy Testing Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Challenge Excessive Testing Panel Size",
          timeline: "Within 7 days",
          why: "Some providers run 100+ allergen panels when 20-40 targeted tests would suffice. Excessive testing is disputable."
        },
        {
          action: "Compare to Fair Market Testing Rates",
          timeline: "Within 7 days",
          why: "The same allergy panel can cost $50-$100 at a lab or $500-$2,000 at a doctor's office. Use fair market rates."
        },
        {
          action: "Verify Medical Necessity Documentation",
          timeline: "Within 14 days",
          why: "Insurance denies allergy testing without proper medical necessity. If denied, check documentation."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim all tests were 'necessary'",
          truth: "Large panels often include unnecessary tests - 20-40 targeted tests are typically sufficient",
          response: "This testing panel included [number] allergens. Targeted testing of 20-40 allergens is typically sufficient."
        },
        {
          tactic: "They'll claim in-office pricing is 'standard'",
          truth: "The same tests cost 80-90% less at independent labs",
          response: "These tests are available for $[lower price] at [lab]. Your charge of $[higher] is excessive."
        },
        {
          tactic: "They'll say you 'agreed' to testing",
          truth: "You likely weren't informed of the cost or alternatives",
          response: "I was not informed of the cost or that equivalent testing was available at lower-cost labs."
        }
      ],
      leveragePoints: [
        {
          leverage: "Excessive Panel Size",
          explanation: "Testing 100+ allergens when 20-40 would suffice is over-testing.",
          script: "This panel tested [X] allergens. Medical literature supports targeted testing of 20-40 allergens as sufficient."
        },
        {
          leverage: "Lab Pricing Comparison",
          explanation: "Independent labs charge 80-90% less for the same tests.",
          script: "This allergy panel costs $[lower price] at [lab]. Your charge of $[higher] is [X]% higher than fair market."
        },
        {
          leverage: "Informed Consent for Costs",
          explanation: "Expensive discretionary testing requires cost disclosure.",
          script: "I was not informed that this elective testing would cost $[amount] or that cheaper alternatives existed."
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Research Independent Lab Pricing", timing: "Within 7 days", successMetric: "Document fair market rates" },
        { step: 2, action: "Review Number of Allergens Tested", timing: "Within 7 days", successMetric: "Identify potential over-testing" },
        { step: 3, action: "Appeal Insurance Denial with Medical Necessity", timing: "If applicable", successMetric: "Appeal submitted" },
        { step: 4, action: "Dispute Pricing as Excessive", timing: "Within 14 days", successMetric: "Written dispute with fair market evidence" },
        { step: 5, action: "Negotiate at Lab Pricing Rates", timing: "After research complete", successMetric: "40-60% reduction" }
      ]
    },
    expectedOutcome: "40-60% reduction by challenging excessive testing and using fair market pricing comparisons"
  },
  {
    id: "chiropractic-collections",
    title: "Chiropractic/Alternative Medicine Bills in Collections",
    icon: Users,
    situation: "You received chiropractic care, acupuncture, or other alternative treatments. Insurance covered less than expected or didn't cover at all. Now bills for $2,000-$10,000+ are in collections.",
    insiderKnowledge: [
      "Chiropractic care has strict insurance limits - usually 12-30 visits per year maximum",
      "Many chiropractors use 'wellness' or 'maintenance' billing codes that insurance won't cover",
      "Insurance often covers chiropractic only for specific diagnoses, not general 'wellness'",
      "Acupuncture coverage varies widely - some plans cover it, many don't",
      "Upfront treatment packages sold by chiropractors are often not covered by insurance at all"
    ],
    stepByStep: [
      {
        step: 1,
        title: "Review Your Insurance Chiropractic Benefits",
        details: "Understand what your plan actually covers: number of visits, specific diagnoses, network requirements.",
        common_limits: "Many plans limit chiropractic to 12-30 visits per year, require specific diagnoses like back pain, and may require referral from primary care."
      },
      {
        step: 2,
        title: "Verify Correct Diagnosis Coding",
        details: "Chiropractic is often covered for 'acute musculoskeletal conditions' but not for 'wellness' or 'maintenance.' Check how visits were coded.",
        script: "Please provide the diagnosis codes used for these visits. Were any visits billed as 'wellness' or 'maintenance' rather than treatment for a specific condition?"
      },
      {
        step: 3,
        title: "Challenge 'Treatment Package' Billing",
        details: "If you purchased a prepaid package of treatments, understand that insurance may not cover these or may cover them differently.",
        question: "I paid upfront for a treatment package. Can these visits be rebilled individually to insurance with appropriate diagnosis codes?"
      },
      {
        step: 4,
        title: "Appeal Denials for Specific Conditions",
        details: "If you have a specific injury or condition, appeal denials with documentation of medical necessity.",
        script: "I'm appealing the denial of chiropractic coverage. I have [specific diagnosis] causing [specific functional impairment]. Conservative chiropractic treatment is medically appropriate before more invasive interventions."
      },
      {
        step: 5,
        title: "Check HSA/FSA Eligibility",
        details: "Chiropractic and many alternative treatments are HSA/FSA eligible, reducing your effective cost.",
        tip: "If you have an HSA or FSA, use it for these expenses. You'll save your marginal tax rate (20-40% for most people)."
      },
      {
        step: 6,
        title: "Negotiate Package Refunds or Reductions",
        details: "If you purchased a package that wasn't covered as represented, negotiate a partial refund or reduction.",
        script: "I was led to believe insurance would cover more of this treatment package than it did. I'm requesting either a partial refund or a reduced balance reflecting what I can reasonably pay."
      }
    ],
    inCollectionsDefense: {
      title: "Your Chiropractic Bill is ALREADY in Collections - What to Do NOW",
      urgentActions: [
        {
          action: "Review Treatment Plan for Over-Treatment",
          timeline: "Within 7 days",
          why: "Some chiropractors prescribe excessive visit frequencies. Evidence-based care typically shows improvement within 6-12 visits."
        },
        {
          action: "Appeal Insurance Visit Limits",
          timeline: "Within 30 days",
          why: "Insurance visit limits can be appealed with documentation of continued medical necessity."
        },
        {
          action: "Check for Upcoding and Unnecessary Services",
          timeline: "Within 14 days",
          why: "X-rays, supplements, and modalities like ultrasound/e-stim are often unnecessary add-ons."
        }
      ],
      collectorTactics: [
        {
          tactic: "They'll claim all treatments were 'medically necessary'",
          truth: "Evidence-based chiropractic typically resolves issues within 6-12 visits",
          response: "Evidence-based guidelines suggest [X] visits for my condition. I was treated for [much more] visits."
        },
        {
          tactic: "They'll say insurance limits are 'your problem'",
          truth: "Providers should manage treatment within coverage and inform you when limits are reached",
          response: "I wasn't informed when I exceeded my coverage. The practice should have managed treatment appropriately."
        },
        {
          tactic: "They'll claim X-rays and add-ons were 'required'",
          truth: "Many chiropractic add-ons are not medically necessary",
          response: "These X-rays/supplements/modalities were not medically necessary. I'm disputing these charges."
        }
      ],
      leveragePoints: [
        {
          leverage: "Evidence-Based Treatment Guidelines",
          explanation: "Research shows most conditions improve within 6-12 chiropractic visits.",
          script: "Evidence-based guidelines recommend [X] visits for my condition. Treatment beyond that lacks medical support."
        },
        {
          leverage: "Unnecessary Add-On Services",
          explanation: "X-rays, supplements, and modalities are often unnecessary profit centers.",
          script: "I'm disputing charges for [X-rays/supplements/modalities] that were not medically necessary for my condition."
        },
        {
          leverage: "Self-Pay Rate Availability",
          explanation: "Chiropractors typically offer significant self-pay discounts.",
          script: "I'm requesting your self-pay rate. What discount is available for payment in full?"
        }
      ],
      settlementRoadmap: [
        { step: 1, action: "Review Treatment History for Over-Treatment", timing: "Within 7 days", successMetric: "Document visits vs evidence-based guidelines" },
        { step: 2, action: "Identify Unnecessary Add-On Charges", timing: "Within 7 days", successMetric: "X-rays, supplements, modalities identified" },
        { step: 3, action: "Appeal Insurance Visit Limits", timing: "Within 30 days", successMetric: "Medical necessity appeal filed" },
        { step: 4, action: "Request Self-Pay Rate", timing: "Within 14 days", successMetric: "Cash discount pricing obtained" },
        { step: 5, action: "Negotiate at 30-50%", timing: "After documentation complete", successMetric: "Settlement with pay-for-delete" }
      ]
    },
    expectedOutcome: "30-50% reduction through negotiation and appropriate coding adjustments"
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
  },
  {
    title: "Coverage Terminated During Active Treatment",
    description: "Your insurance was terminated while you were in the middle of cancer treatment, pregnancy, or other ongoing medical care",
    steps: [
      "Document your treatment timeline and the coverage termination date",
      "Check if your state has 'continuity of care' protections",
      "Many states require insurers to continue covering ongoing treatment for 60-90 days after termination",
      "Request in-network rates for completion of active treatment",
      "File complaint with state insurance commissioner if continuity rights violated",
      "Apply for marketplace coverage or Medicaid immediately",
      "Request that providers wait to bill until new coverage is obtained"
    ],
    remedies: ["Continuation of treatment at in-network rates", "State-mandated continuity of care protections", "Retroactive Medicaid coverage for eligible patients"]
  },
  {
    title: "Wrongful Denial Based on Pre-Existing Condition",
    description: "Your claim was denied based on a pre-existing condition despite the ACA making this illegal",
    steps: [
      "The ACA prohibits denials based on pre-existing conditions for all ACA-compliant plans",
      "Request the specific reason for denial in writing",
      "File an internal appeal citing ACA protections",
      "If internal appeal fails, request an external review",
      "File complaint with HHS Office of Civil Rights",
      "Document all denials and appeal them systematically",
      "Consider consulting a healthcare attorney if violations continue"
    ],
    remedies: ["ACA violation remedies", "Coverage reinstatement", "Retroactive coverage for denied claims", "Potential civil penalties against insurer"]
  },
  {
    title: "Marketplace Coverage Terminated for Non-Payment",
    description: "Your ACA marketplace plan was terminated because you missed premium payments",
    steps: [
      "Marketplace plans have a 90-day grace period for subsidy recipients (30 days for others)",
      "During the first 30 days of grace period, claims should still be paid",
      "Contact the marketplace immediately if you missed payments due to hardship",
      "Document any circumstances that prevented payment (job loss, illness, etc.)",
      "Apply for reinstatement or new coverage during the next enrollment period",
      "If you qualified for subsidies you didn't receive, you may be entitled to retroactive credits",
      "Check if missed payments can be made up to reinstate coverage"
    ],
    remedies: ["Reinstatement during grace period", "Retroactive subsidy adjustments", "Special enrollment period for qualifying events"]
  },
  {
    title: "Short-Term Plan Gaps and Limitations",
    description: "You purchased a short-term health plan that didn't cover what you expected, or the plan expired leaving you uninsured",
    steps: [
      "Short-term plans often exclude pre-existing conditions and many services",
      "Review your policy carefully to understand what was actually covered",
      "If the plan misrepresented coverage, file complaint with state insurance commissioner",
      "Apply for ACA marketplace coverage during open enrollment or special enrollment period",
      "Document any misleading marketing or sales tactics",
      "Explore whether services denied by short-term plan could be appealed",
      "Check if your state has additional regulations on short-term plans"
    ],
    remedies: ["Complaint against misleading marketing", "ACA marketplace enrollment", "State-specific short-term plan protections"]
  },
  {
    title: "Medicaid Unwinding / Redetermination Issues",
    description: "You were terminated from Medicaid during the post-pandemic 'unwinding' due to paperwork issues, not actual ineligibility",
    steps: [
      "Many Medicaid terminations during unwinding were due to procedural issues, not ineligibility",
      "Check if you received all required notices and had opportunity to respond",
      "You have the right to appeal the termination - deadlines vary by state",
      "Request a fair hearing to challenge the termination",
      "While appeal is pending, you may be entitled to continuing coverage",
      "Apply for marketplace coverage with potential subsidies if Medicaid appeal fails",
      "Contact your state Medicaid office or a healthcare navigator for help"
    ],
    remedies: ["Reinstatement of Medicaid coverage", "Continuing coverage during appeal", "Marketplace coverage with subsidies if ineligible for Medicaid"]
  },
  {
    title: "Student Health Plan Termination",
    description: "You were dropped from your university's student health plan unexpectedly (graduation, reduced enrollment, etc.)",
    steps: [
      "Verify the specific reason for termination (graduation, enrollment status, age)",
      "Check if you're eligible to continue coverage through COBRA-like provisions",
      "Students up to age 26 can join a parent's plan regardless of student status",
      "Apply for marketplace coverage within 60 days of losing student coverage",
      "Some universities offer 'bridge' coverage for recent graduates",
      "Check if you qualify for Medicaid based on current income",
      "Document the termination date for special enrollment purposes"
    ],
    remedies: ["Parent's plan coverage up to age 26", "Special enrollment in marketplace", "Medicaid enrollment", "University bridge coverage programs"]
  },
  {
    title: "Military/VA Healthcare Eligibility Changes",
    description: "Your TRICARE or VA healthcare coverage was terminated or changed due to status changes",
    steps: [
      "Verify the specific reason for eligibility change",
      "Transitioning service members are entitled to continued coverage during transition",
      "Check eligibility for TRICARE Transitional Health Coverage",
      "Veterans may be eligible for VA healthcare even if previously denied",
      "Document your service dates and discharge status carefully",
      "Contact your base/installation or VA healthcare enrollment office",
      "Loss of military coverage is a qualifying event for marketplace enrollment"
    ],
    remedies: ["TRICARE Transitional Health Coverage", "VA healthcare enrollment", "Marketplace special enrollment", "COBRA-like coverage for certain military families"]
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
              <Shield className="h-6 w-6 text-muted-foreground" />
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
                        className={`w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          'featured' in scenario && scenario.featured ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20' : ''
                        }`}
                        onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                        data-testid={`scenario-${scenario.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            'featured' in scenario && scenario.featured 
                              ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                              : 'bg-secondary'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              'featured' in scenario && scenario.featured ? 'text-white' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{scenario.title}</h3>
                              {'featured' in scenario && scenario.featured && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-0.5">
                                  Enhanced
                                </Badge>
                              )}
                            </div>
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
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Insider Knowledge ({scenario.insiderKnowledge.length} insights)
                              </h4>
                              <ul className="space-y-2">
                                {scenario.insiderKnowledge.map((knowledge, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">{knowledge}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Bill Forensics - for featured scenarios */}
                            {'billForensics' in scenario && scenario.billForensics && (
                              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-700">
                                <h4 className="font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                                  <AlertCircle className="h-5 w-5" />
                                  {(scenario.billForensics as any).title}
                                </h4>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h5 className="font-semibold text-red-700 dark:text-red-400 text-sm mb-2">CPT Codes to Dispute:</h5>
                                    <div className="grid gap-2">
                                      {(scenario.billForensics as any).redFlags?.map((flag: any, i: number) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-100 dark:border-red-800">
                                          <div className="flex items-center justify-between mb-1">
                                            <code className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-0.5 rounded font-mono">{flag.code}</code>
                                            <span className="text-xs font-bold text-red-600 dark:text-red-400">{flag.amount}</span>
                                          </div>
                                          <p className="text-sm text-gray-700 dark:text-gray-300">{flag.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-semibold text-red-700 dark:text-red-400 text-sm mb-2">Unbundling Schemes:</h5>
                                    <ul className="space-y-1">
                                      {(scenario.billForensics as any).unbundlingSchemes?.map((scheme: string, i: number) => (
                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                          {scheme}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <h5 className="font-semibold text-red-700 dark:text-red-400 text-sm mb-2">Phantom Charges:</h5>
                                    <ul className="space-y-1">
                                      {(scenario.billForensics as any).phantomCharges?.map((charge: string, i: number) => (
                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                          <Ban className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                          {charge}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Timeline - for featured scenarios */}
                            {'timeline' in scenario && scenario.timeline && (
                              <div className="bg-secondary rounded-xl p-5 border border-border">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                  <Calendar className="h-5 w-5" />
                                  {(scenario.timeline as any).title}
                                </h4>
                                <div className="space-y-3">
                                  {(scenario.timeline as any).checkpoints?.map((checkpoint: any, i: number) => (
                                    <div key={i} className={`rounded-lg p-4 border ${
                                      checkpoint.status === 'critical' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' :
                                      checkpoint.status === 'important' ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700' :
                                      checkpoint.status === 'strategic' ? 'bg-card border-border' :
                                      'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                                    }`}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className={`h-4 w-4 ${
                                          checkpoint.status === 'critical' ? 'text-red-600' :
                                          checkpoint.status === 'important' ? 'text-amber-600' :
                                          checkpoint.status === 'strategic' ? 'text-muted-foreground' :
                                          'text-green-600'
                                        }`} />
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">{checkpoint.day}</span>
                                        {checkpoint.status === 'critical' && (
                                          <Badge className="bg-red-500 text-white text-xs">CRITICAL</Badge>
                                        )}
                                      </div>
                                      <ul className="space-y-1">
                                        {checkpoint.actions.map((action: string, j: number) => (
                                          <li key={j} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-gray-500 flex-shrink-0 mt-1" />
                                            {action}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Success Stories - for featured scenarios */}
                            {'successStories' in scenario && scenario.successStories && (
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-700">
                                <h4 className="font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                                  <TrendingDown className="h-5 w-5" />
                                  Real Success Stories
                                </h4>
                                <div className="grid gap-3">
                                  {(scenario.successStories as any[]).map((story: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
                                      <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{story.title}</h5>
                                      <p className="text-green-600 dark:text-green-400 font-semibold text-sm mb-2">{story.outcome}</p>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1"><strong>Strategy:</strong> {story.strategy}</p>
                                      <p className="text-gray-500 dark:text-gray-500 text-xs"><strong>Timeline:</strong> {story.timeline}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Escalation Path - for featured scenarios */}
                            {'escalationPath' in scenario && scenario.escalationPath && (
                              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-700">
                                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
                                  <Gavel className="h-5 w-5" />
                                  Escalation Ladder
                                </h4>
                                <div className="space-y-2">
                                  {(scenario.escalationPath as any[]).map((level: any, i: number) => (
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

                            {/* Negotiation Playbooks - for featured scenarios */}
                            {'negotiationPlaybooks' in scenario && scenario.negotiationPlaybooks && (
                              <div className="bg-secondary rounded-xl p-5 border border-border">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                  <MessageSquare className="h-5 w-5" />
                                  Negotiation Playbooks & Scripts
                                </h4>
                                <div className="space-y-4">
                                  {Object.entries(scenario.negotiationPlaybooks as Record<string, any>).map(([key, playbook]: [string, any]) => (
                                    <div key={key} className="bg-card rounded-lg p-4 border border-border">
                                      <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{playbook.title}</h5>
                                      {playbook.approach && (
                                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 italic">{playbook.approach}</p>
                                      )}
                                      {playbook.script && (
                                        <div className="bg-secondary rounded-lg p-3 border border-border">
                                          <p className="text-xs font-medium text-muted-foreground mb-1">SCRIPT:</p>
                                          <p className="text-sm text-foreground italic">"{playbook.script}"</p>
                                        </div>
                                      )}
                                      {playbook.initialScript && (
                                        <div className="bg-secondary rounded-lg p-3 border border-border mb-2">
                                          <p className="text-xs font-medium text-muted-foreground mb-1">INITIAL SCRIPT:</p>
                                          <p className="text-sm text-foreground italic">"{playbook.initialScript}"</p>
                                        </div>
                                      )}
                                      {playbook.settlementScript && (
                                        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-700 mb-2">
                                          <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">SETTLEMENT SCRIPT:</p>
                                          <p className="text-sm text-green-900 dark:text-green-200 italic">"{playbook.settlementScript}"</p>
                                        </div>
                                      )}
                                      {playbook.escalationScript && (
                                        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-700 mb-2">
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

                            {/* Legal Protections - for featured scenarios */}
                            {'legalProtections' in scenario && scenario.legalProtections && (
                              <div className="bg-secondary rounded-xl p-5 border border-border">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                  <Scale className="h-5 w-5" />
                                  Legal Protections & Rights
                                </h4>
                                <div className="space-y-4">
                                  <div>
                                    <h5 className="font-semibold text-foreground text-sm mb-2">Federal Laws:</h5>
                                    <div className="space-y-2">
                                      {(scenario.legalProtections as any).federal?.map((law: any, i: number) => (
                                        <div key={i} className="bg-card rounded-lg p-3 border border-border">
                                          <p className="font-bold text-gray-900 dark:text-white text-sm">{law.law}</p>
                                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{law.protection}</p>
                                          <p className="text-muted-foreground text-xs mt-1"><strong>Enforce:</strong> {law.enforcement}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-foreground text-sm mb-2">State Examples:</h5>
                                    <div className="grid gap-2">
                                      {(scenario.legalProtections as any).stateExamples?.map((state: any, i: number) => (
                                        <div key={i} className="bg-card rounded-lg p-3 border border-border">
                                          <p className="font-bold text-gray-900 dark:text-white text-sm">{state.state}</p>
                                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{state.protection}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Letter Templates - for featured scenarios */}
                            {'templates' in scenario && scenario.templates && (
                              <div className="bg-secondary rounded-xl p-5 border border-border">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                  <FileText className="h-5 w-5" />
                                  Ready-to-Use Letter Templates
                                </h4>
                                <div className="space-y-4">
                                  {Object.entries(scenario.templates as Record<string, any>).map(([key, template]: [string, any]) => (
                                    <div key={key} className="bg-card rounded-lg border border-border overflow-hidden">
                                      <div className="bg-secondary px-4 py-2 border-b border-border">
                                        <h5 className="font-bold text-foreground text-sm">{template.title}</h5>
                                      </div>
                                      <div className="p-4">
                                        <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                                          {template.content}
                                        </pre>
                                        <Button 
                                          size="sm"
                                          className="w-full mt-3 bg-primary text-primary-foreground hover:opacity-90"
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

                            {/* COBRA Analysis - for insurance kickoff scenario */}
                            {'cobraAnalysis' in scenario && scenario.cobraAnalysis && (
                              <div className="bg-secondary rounded-xl p-5 border border-border">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                  <Shield className="h-5 w-5" />
                                  {(scenario.cobraAnalysis as any).title}
                                </h4>
                                <ul className="space-y-2 mb-4">
                                  {(scenario.cobraAnalysis as any).keyFacts?.map((fact: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 dark:text-gray-300 text-sm">{fact}</span>
                                    </li>
                                  ))}
                                </ul>
                                {(scenario.cobraAnalysis as any).calculation && (
                                  <div className="bg-card rounded-lg p-4 border border-border mb-4">
                                    <h5 className="font-bold text-foreground text-sm mb-2">Cost-Benefit Example:</h5>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="text-gray-600 dark:text-gray-400">Monthly Premium:</div>
                                      <div className="font-bold text-gray-900 dark:text-white">${(scenario.cobraAnalysis as any).calculation.example.monthlyPremium}</div>
                                      <div className="text-gray-600 dark:text-gray-400">Months Needed:</div>
                                      <div className="font-bold text-gray-900 dark:text-white">{(scenario.cobraAnalysis as any).calculation.example.monthsNeeded}</div>
                                      <div className="text-gray-600 dark:text-gray-400">Total COBRA Cost:</div>
                                      <div className="font-bold text-red-600">${(scenario.cobraAnalysis as any).calculation.example.totalCOBRACost.toLocaleString()}</div>
                                      <div className="text-gray-600 dark:text-gray-400">Medical Bills Avoided:</div>
                                      <div className="font-bold text-green-600">${(scenario.cobraAnalysis as any).calculation.example.medicalBillsAvoided.toLocaleString()}</div>
                                      <div className="text-gray-600 dark:text-gray-400 font-semibold">NET SAVINGS:</div>
                                      <div className="font-bold text-green-600 text-lg">${(scenario.cobraAnalysis as any).calculation.example.netSavings.toLocaleString()}</div>
                                    </div>
                                  </div>
                                )}
                                {(scenario.cobraAnalysis as any).scripts && (
                                  <div className="space-y-3">
                                    <h5 className="font-semibold text-foreground text-sm">COBRA Scripts:</h5>
                                    {(scenario.cobraAnalysis as any).scripts.employerCall && (
                                      <div className="bg-card rounded-lg p-3 border border-border" data-testid="script-cobra-employer">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">EMPLOYER CALL SCRIPT:</p>
                                        <p className="text-sm text-foreground italic">"{(scenario.cobraAnalysis as any).scripts.employerCall}"</p>
                                      </div>
                                    )}
                                    {(scenario.cobraAnalysis as any).scripts.insuranceCall && (
                                      <div className="bg-card rounded-lg p-3 border border-border" data-testid="script-cobra-insurance">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">INSURANCE CALL SCRIPT:</p>
                                        <p className="text-sm text-foreground italic">"{(scenario.cobraAnalysis as any).scripts.insuranceCall}"</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Termination Analysis - for insurance kickoff scenario */}
                            {'terminationAnalysis' in scenario && scenario.terminationAnalysis && (
                              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-5 border border-rose-200 dark:border-rose-700">
                                <h4 className="font-bold text-rose-800 dark:text-rose-300 mb-4 flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5" />
                                  {(scenario.terminationAnalysis as any).title}
                                </h4>
                                <div className="space-y-3">
                                  {(scenario.terminationAnalysis as any).commonReasons?.map((reason: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-rose-100 dark:border-rose-800">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{reason.reason}</p>
                                        <Badge className={`text-xs ${
                                          reason.winRate.includes('Very high') ? 'bg-green-500' :
                                          reason.winRate.includes('High') ? 'bg-emerald-500' :
                                          'bg-amber-500'
                                        } text-white`}>{reason.winRate}</Badge>
                                      </div>
                                      <p className="text-rose-600 dark:text-rose-400 text-xs mb-1"><strong>Liability:</strong> {reason.liability}</p>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs"><strong>Action:</strong> {reason.action}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Medicaid Path - for insurance kickoff scenario */}
                            {'medicaidPath' in scenario && scenario.medicaidPath && (
                              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-700">
                                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
                                  <Heart className="h-5 w-5" />
                                  {(scenario.medicaidPath as any).title}
                                </h4>
                                <ul className="space-y-2 mb-4">
                                  {(scenario.medicaidPath as any).keyFacts?.map((fact: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 dark:text-gray-300 text-sm">{fact}</span>
                                    </li>
                                  ))}
                                </ul>
                                {(scenario.medicaidPath as any).incomeThresholds2024 && (
                                  <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700 mb-4">
                                    <h5 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-2">2024 Income Thresholds (Family of 4):</h5>
                                    <div className="grid gap-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">138% FPL:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">${(scenario.medicaidPath as any).incomeThresholds2024["138%FPL_family4"]?.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">200% FPL:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">${(scenario.medicaidPath as any).incomeThresholds2024["200%FPL_family4"]?.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">300% FPL:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">${(scenario.medicaidPath as any).incomeThresholds2024["300%FPL_family4"]?.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {(scenario.medicaidPath as any).applicationScript && (
                                  <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700">
                                    <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-1">APPLICATION SCRIPT:</p>
                                    <p className="text-sm text-emerald-900 dark:text-emerald-200 italic">"{(scenario.medicaidPath as any).applicationScript}"</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Employer Liability - for insurance kickoff scenario */}
                            {'employerLiability' in scenario && scenario.employerLiability && (
                              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border border-orange-200 dark:border-orange-700">
                                <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-4 flex items-center gap-2">
                                  <Briefcase className="h-5 w-5" />
                                  {(scenario.employerLiability as any).title}
                                </h4>
                                <div className="space-y-4">
                                  <div>
                                    <h5 className="font-semibold text-orange-700 dark:text-orange-400 text-sm mb-2">Warning Signs of Employer Liability:</h5>
                                    <ul className="space-y-1">
                                      {(scenario.employerLiability as any).warningSignsOfLiability?.map((sign: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                          <span className="text-gray-700 dark:text-gray-300 text-sm">{sign}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-orange-700 dark:text-orange-400 text-sm mb-2">Documentation Needed:</h5>
                                    <ul className="space-y-1">
                                      {(scenario.employerLiability as any).documentationNeeded?.map((doc: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <FileText className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                          <span className="text-gray-700 dark:text-gray-300 text-sm">{doc}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-orange-700 dark:text-orange-400 text-sm mb-2">Legal Remedies:</h5>
                                    <div className="grid gap-2">
                                      {(scenario.employerLiability as any).legalRemedies?.map((remedy: any, i: number) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-100 dark:border-orange-800">
                                          <p className="font-bold text-gray-900 dark:text-white text-sm">{remedy.remedy}</p>
                                          <p className="text-green-600 dark:text-green-400 text-xs">{remedy.potential}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {(scenario.employerLiability as any).consultationScript && (
                                    <div className="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3 border border-orange-200 dark:border-orange-700 mt-4" data-testid="script-attorney-consultation">
                                      <p className="text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">ATTORNEY CONSULTATION SCRIPT:</p>
                                      <p className="text-sm text-orange-900 dark:text-orange-200 italic">"{(scenario.employerLiability as any).consultationScript}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Calculators - Charity Care Estimator */}
                            {'calculators' in scenario && scenario.calculators && (
                              <div className="bg-secondary rounded-xl p-5 border border-border">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                  <DollarSign className="h-5 w-5" />
                                  Charity Care Eligibility Estimator
                                </h4>
                                {(scenario.calculators as any).charityCareLikelihood && (
                                  <div className="space-y-4">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {(scenario.calculators as any).charityCareLikelihood.description}
                                    </p>
                                    <div className="bg-card rounded-lg p-4 border border-border">
                                      <h5 className="font-bold text-foreground text-sm mb-3">2024 Federal Poverty Level (FPL) Guidelines:</h5>
                                      <div className="grid gap-2 text-sm">
                                        {Object.entries((scenario.calculators as any).charityCareLikelihood.fplThresholds2024 || {}).map(([size, amount]) => (
                                          <div key={size} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-2">
                                            <span className="text-gray-600 dark:text-gray-400">Family of {size}:</span>
                                            <div className="text-right">
                                              <span className="font-bold text-gray-900 dark:text-white">${(amount as number).toLocaleString()}</span>
                                              <span className="text-xs text-muted-foreground block">
                                                200% = ${((amount as number) * 2).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-3">
                                        <strong>Rule of thumb:</strong> If your income is below 200% FPL, you likely qualify for 100% charity care. 
                                        Between 200-400% FPL, expect 50-75% discount.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Step by Step */}
                            {scenario.stepByStep && (
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
                                          <div className="bg-secondary rounded-lg p-3 border border-border">
                                            <p className="text-xs font-medium text-muted-foreground mb-1">SCRIPT TO USE:</p>
                                            <p className="text-sm text-foreground italic">"{step.script}"</p>
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
                            )}

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
                              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
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
              <FileText className="h-6 w-6 text-muted-foreground" />
              Ready-to-Use Letter Templates
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
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
                    className="w-full mt-4 bg-primary text-primary-foreground hover:opacity-90"
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
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  Key Contacts for Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">CFPB (Consumer Financial Protection Bureau)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">File complaints against debt collectors</p>
                    <p className="text-foreground text-sm font-medium">consumerfinance.gov/complaint</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">State Insurance Commissioner</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">File complaints about insurance issues</p>
                    <p className="text-foreground text-sm font-medium">Find at naic.org</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">State Attorney General</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Consumer protection complaints</p>
                    <p className="text-foreground text-sm font-medium">Find at naag.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* AI Collections Defense Assistant */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              AI Collections Defense Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get personalized guidance for your specific collections situation. Our AI assistant can help you write letters, 
              understand your rights, and develop a strategy to defend against debt collectors.
            </p>
            <CollectionsDefenseChatbot />
          </section>

          {/* Related Resources */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/bill-reduction-guide">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gold transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Bill Reduction Guide</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">General strategies for reducing bills</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/rights-hub">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gold transition-colors cursor-pointer">
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
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gold transition-colors cursor-pointer">
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
