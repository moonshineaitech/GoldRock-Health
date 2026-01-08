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
