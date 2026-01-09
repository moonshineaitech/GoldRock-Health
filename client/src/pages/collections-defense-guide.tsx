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
                              : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              'featured' in scenario && scenario.featured ? 'text-white' : 'text-blue-600 dark:text-blue-400'
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
                                <Lock className="h-4 w-4 text-purple-500" />
                                Insider Knowledge ({scenario.insiderKnowledge.length} insights)
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
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
                                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                                  <Calendar className="h-5 w-5" />
                                  {(scenario.timeline as any).title}
                                </h4>
                                <div className="space-y-3">
                                  {(scenario.timeline as any).checkpoints?.map((checkpoint: any, i: number) => (
                                    <div key={i} className={`rounded-lg p-4 border ${
                                      checkpoint.status === 'critical' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' :
                                      checkpoint.status === 'important' ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700' :
                                      checkpoint.status === 'strategic' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' :
                                      'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                                    }`}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className={`h-4 w-4 ${
                                          checkpoint.status === 'critical' ? 'text-red-600' :
                                          checkpoint.status === 'important' ? 'text-amber-600' :
                                          checkpoint.status === 'strategic' ? 'text-blue-600' :
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
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-700">
                                <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
                                  <MessageSquare className="h-5 w-5" />
                                  Negotiation Playbooks & Scripts
                                </h4>
                                <div className="space-y-4">
                                  {Object.entries(scenario.negotiationPlaybooks as Record<string, any>).map(([key, playbook]: [string, any]) => (
                                    <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                                      <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{playbook.title}</h5>
                                      {playbook.approach && (
                                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 italic">{playbook.approach}</p>
                                      )}
                                      {playbook.script && (
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
                                          <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">SCRIPT:</p>
                                          <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">"{playbook.script}"</p>
                                        </div>
                                      )}
                                      {playbook.initialScript && (
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700 mb-2">
                                          <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">INITIAL SCRIPT:</p>
                                          <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">"{playbook.initialScript}"</p>
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
                              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-700">
                                <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                                  <Scale className="h-5 w-5" />
                                  Legal Protections & Rights
                                </h4>
                                <div className="space-y-4">
                                  <div>
                                    <h5 className="font-semibold text-purple-700 dark:text-purple-400 text-sm mb-2">Federal Laws:</h5>
                                    <div className="space-y-2">
                                      {(scenario.legalProtections as any).federal?.map((law: any, i: number) => (
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
                                      {(scenario.legalProtections as any).stateExamples?.map((state: any, i: number) => (
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

                            {/* Letter Templates - for featured scenarios */}
                            {'templates' in scenario && scenario.templates && (
                              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 border border-teal-200 dark:border-teal-700">
                                <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-4 flex items-center gap-2">
                                  <FileText className="h-5 w-5" />
                                  Ready-to-Use Letter Templates
                                </h4>
                                <div className="space-y-4">
                                  {Object.entries(scenario.templates as Record<string, any>).map(([key, template]: [string, any]) => (
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

                            {/* COBRA Analysis - for insurance kickoff scenario */}
                            {'cobraAnalysis' in scenario && scenario.cobraAnalysis && (
                              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-5 border border-cyan-200 dark:border-cyan-700">
                                <h4 className="font-bold text-cyan-800 dark:text-cyan-300 mb-4 flex items-center gap-2">
                                  <Shield className="h-5 w-5" />
                                  {(scenario.cobraAnalysis as any).title}
                                </h4>
                                <ul className="space-y-2 mb-4">
                                  {(scenario.cobraAnalysis as any).keyFacts?.map((fact: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 dark:text-gray-300 text-sm">{fact}</span>
                                    </li>
                                  ))}
                                </ul>
                                {(scenario.cobraAnalysis as any).calculation && (
                                  <div className="bg-cyan-100 dark:bg-cyan-900/40 rounded-lg p-4 border border-cyan-200 dark:border-cyan-700 mb-4">
                                    <h5 className="font-bold text-cyan-800 dark:text-cyan-300 text-sm mb-2">Cost-Benefit Example:</h5>
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
                                    <h5 className="font-semibold text-cyan-700 dark:text-cyan-400 text-sm">COBRA Scripts:</h5>
                                    {(scenario.cobraAnalysis as any).scripts.employerCall && (
                                      <div className="bg-cyan-100 dark:bg-cyan-900/40 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700" data-testid="script-cobra-employer">
                                        <p className="text-xs font-medium text-cyan-800 dark:text-cyan-300 mb-1">EMPLOYER CALL SCRIPT:</p>
                                        <p className="text-sm text-cyan-900 dark:text-cyan-200 italic">"{(scenario.cobraAnalysis as any).scripts.employerCall}"</p>
                                      </div>
                                    )}
                                    {(scenario.cobraAnalysis as any).scripts.insuranceCall && (
                                      <div className="bg-cyan-100 dark:bg-cyan-900/40 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700" data-testid="script-cobra-insurance">
                                        <p className="text-xs font-medium text-cyan-800 dark:text-cyan-300 mb-1">INSURANCE CALL SCRIPT:</p>
                                        <p className="text-sm text-cyan-900 dark:text-cyan-200 italic">"{(scenario.cobraAnalysis as any).scripts.insuranceCall}"</p>
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
                              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 border border-violet-200 dark:border-violet-700">
                                <h4 className="font-bold text-violet-800 dark:text-violet-300 mb-4 flex items-center gap-2">
                                  <DollarSign className="h-5 w-5" />
                                  Charity Care Eligibility Estimator
                                </h4>
                                {(scenario.calculators as any).charityCareLikelihood && (
                                  <div className="space-y-4">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {(scenario.calculators as any).charityCareLikelihood.description}
                                    </p>
                                    <div className="bg-violet-100 dark:bg-violet-900/40 rounded-lg p-4 border border-violet-200 dark:border-violet-700">
                                      <h5 className="font-bold text-violet-800 dark:text-violet-300 text-sm mb-3">2024 Federal Poverty Level (FPL) Guidelines:</h5>
                                      <div className="grid gap-2 text-sm">
                                        {Object.entries((scenario.calculators as any).charityCareLikelihood.fplThresholds2024 || {}).map(([size, amount]) => (
                                          <div key={size} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-2">
                                            <span className="text-gray-600 dark:text-gray-400">Family of {size}:</span>
                                            <div className="text-right">
                                              <span className="font-bold text-gray-900 dark:text-white">${(amount as number).toLocaleString()}</span>
                                              <span className="text-xs text-violet-600 dark:text-violet-400 block">
                                                200% = ${((amount as number) * 2).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <p className="text-xs text-violet-700 dark:text-violet-400 mt-3">
                                        <strong>Rule of thumb:</strong> If your income is below 200% FPL, you likely qualify for 100% charity care. 
                                        Between 200-400% FPL, expect 50-75% discount.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

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
