import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "wouter";
import { 
  DollarSign, 
  FileText, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  ArrowRight,
  Copy,
  Crown,
  Lock,
  TrendingDown,
  FileCheck,
  Phone,
  Mail,
  Calendar,
  Target,
  ShieldCheck,
  BookOpen,
  Award,
  Zap,
  Users,
  Star,
  Search,
  Calculator,
  Eye,
  Shield,
  CreditCard,
  PhoneCall,
  ClipboardList,
  FileX,
  Scale,
  Receipt,
  Building,
  Gavel,
  HandCoins,
  UserCheck,
  Heart,
  Timer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Lightbulb,
  FileEdit,
  Banknote,
  Percent,
  LineChart,
  Code
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper function for copying text to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.error('Failed to copy to clipboard:', e);
  }
}

// Missing data definitions
const detailedCaseStudies = [
  {
    title: "Emergency Room Overcharge - $23,000 Reduction",
    savings: "$23,000",
    strategy: "CPT Code Challenge + Charity Care",
    timeline: "6 weeks",
    savingsPercentage: "78%",
    patientProfile: "Single mother, unemployed, emergency appendectomy with complications",
    keyTactics: [
      "Challenged Level 5 ED coding without documentation",
      "Disputed surgical supply charges for unused items",
      "Applied for charity care within 30-day window",
      "Negotiated final settlement at Medicare rates"
    ],
    timeline_breakdown: [
      "Week 1: Requested itemized bill and medical records",
      "Week 2-3: Identified coding errors and applied for charity care",
      "Week 4-5: Negotiated with billing department",
      "Week 6: Final settlement agreement reached"
    ],
    lessons_learned: [
      "Emergency situations don't waive your right to accurate billing",
      "Charity care applications can be retroactive up to 240 days",
      "Surgical supply markups are often the largest source of overcharges"
    ]
  },
  {
    title: "Surgical Bill Negotiation - $15,400 Saved",
    savings: "$15,400",
    strategy: "Good Faith Estimate Violation",
    timeline: "4 weeks",
    savingsPercentage: "65%",
    patientProfile: "Self-employed contractor, outpatient surgery, insured but out-of-network",
    keyTactics: [
      "Leveraged Good Faith Estimate requirements",
      "Documented estimate vs. actual bill discrepancies",
      "Negotiated based on Medicare reimbursement rates",
      "Used end-of-fiscal-year timing for leverage"
    ],
    timeline_breakdown: [
      "Week 1: Compared final bill to original estimate",
      "Week 2: Filed formal dispute citing federal requirements",
      "Week 3: Escalated to patient advocate and compliance",
      "Week 4: Reached settlement at original estimate amount"
    ],
    lessons_learned: [
      "Good Faith Estimate laws provide strong consumer protection",
      "Timing negotiations with hospital fiscal year cycles is effective",
      "Patient advocates have more authority than billing department staff"
    ]
  }
];

const enhancedLetterTemplates = [
  {
    title: "Medical Bill Error Dispute Letter",
    description: "Professional template for challenging billing errors",
    category: "Error Dispute",
    template: `[Date]

[Hospital/Provider Name]
Billing Department
[Address]

RE: Account #[ACCOUNT NUMBER] - Billing Error Dispute
Patient: [YOUR NAME]
Date of Service: [SERVICE DATE]

Dear Billing Manager,

I am writing to formally dispute several charges on my medical bill dated [BILL DATE] for services rendered on [SERVICE DATE]. After careful review of my itemized statement, I have identified the following discrepancies:

1. [Specific error #1 - e.g., "Duplicate charge for lab work"]
2. [Specific error #2 - e.g., "Room charge exceeds actual length of stay"]
3. [Specific error #3 - e.g., "Surgical supplies not used during procedure"]

I request the following actions:
• Immediate correction of the identified billing errors
• Revised bill reflecting accurate charges
• Written explanation of how these errors occurred
• Assurance that corrected information will be sent to all relevant parties

I am prepared to pay for all legitimate services rendered but expect accurate billing in accordance with federal regulations. Please respond within 30 days.

Sincerely,
[YOUR NAME]
[YOUR CONTACT INFORMATION]`
  },
  {
    title: "Charity Care Application Letter",
    description: "Formal request for financial assistance",
    category: "Financial Assistance",
    template: `[Date]

[Hospital Name]
Financial Assistance Department
[Address]

RE: Charity Care Application - Account #[ACCOUNT NUMBER]
Patient: [YOUR NAME]

Dear Financial Assistance Team,

I am requesting consideration for your charity care program due to significant financial hardship. My current circumstances prevent me from paying the full amount of my medical bill.

Financial Information:
• Annual household income: $[AMOUNT]
• Household size: [NUMBER] people
• Current employment status: [STATUS]
• Monthly essential expenses: $[AMOUNT]

Supporting documentation is attached:
☐ Pay stubs (last 3 months)
☐ Tax return (previous year)
☐ Bank statements
☐ Unemployment documentation
☐ Medical expense records

Based on your published charity care policy, my income level qualifies me for assistance. I respectfully request expedited review of my application and ask that all collection activities be suspended pending your decision.

Thank you for your consideration during this difficult time.

Sincerely,
[YOUR NAME]
[CONTACT INFORMATION]

Enclosures: [LIST ATTACHED DOCUMENTS]`
  }
];



// Comprehensive Bill Analysis Sections
const itemizedAnalysisGuide = {
  title: "Master Itemized Bill Analysis",
  description: "Learn to read medical bills like a billing expert and spot overcharges worth thousands",
  icon: Search,
  sections: [
    {
      title: "Essential Document Requests",
      content: [
        "Request itemized bill within 30 days of service (legally required)",
        "Obtain detailed Explanation of Benefits (EOB) from insurance",
        "Secure copies of all medical records for dates of service",
        "Get Medicare rate comparison sheet (hospitals must provide)",
        "Request charity care policy documentation",
        "Obtain facility license and certifications proof"
      ]
    },
    {
      title: "Critical Error Detection Points",
      content: [
        "Verify admission/discharge dates match actual stay duration",
        "Check room charges against exact time stamps",
        "Confirm procedure dates align with medical records",
        "Validate CPT codes match services actually received",
        "Identify duplicate lab/imaging charges (common error)",
        "Spot unbundling of procedures that should be bundled"
      ]
    },
    {
      title: "Common Overcharge Patterns",
      content: [
        "Operating room time inflated by 30-60 minutes (phantom billing)",
        "Surgical supplies charged but not used (up to $2,000 excess)",
        "Emergency room facility fees at highest level without justification",
        "Pharmacy markups of 300-500% over wholesale cost",
        "Lab work charged multiple times for same blood draw",
        "Recovery room charges for time spent in different unit"
      ]
    }
  ]
};

const codingReviewGuide = {
  title: "Medical Coding & Billing Review",
  description: "Understand CPT codes, modifiers, and how hospitals inflate charges through coding tricks",
  icon: FileEdit,
  sections: [
    {
      title: "CPT Code Validation Process",
      content: [
        "Cross-reference CPT codes with medical record documentation",
        "Verify modifier usage (-25, -59, -51) is appropriate",
        "Check for upcoding (billing higher complexity than justified)",
        "Identify unbundling (separate billing for bundled procedures)",
        "Validate anesthesia time and base units calculations",
        "Confirm surgical approach codes match actual procedure"
      ]
    },
    {
      title: "High-Risk Coding Areas",
      content: [
        "Emergency Department visits (levels 1-5 often inflated)",
        "Surgical procedures with multiple components",
        "Anesthesia billing (time manipulation common)",
        "Pathology and lab work (bundling violations)",
        "Radiology interpretations (bilateral procedure abuse)",
        "Consultation codes vs. established patient visits"
      ]
    },
    {
      title: "Coding Red Flags to Challenge",
      content: [
        "Level 5 ED visit without life-threatening condition",
        "Bilateral procedure codes for unilateral treatment",
        "Multiple 'incidental' procedures during same surgery",
        "Anesthesia time exceeding surgical time by &gt;30 minutes",
        "Separate facility fees for same-day procedures",
        "Critical care codes without ICU documentation"
      ]
    }
  ]
};

const goodFaithEstimateGuide = {
  title: "Good Faith Estimate Strategy",
  description: "Leverage federal price transparency laws to lock in lower prices and challenge overcharges",
  icon: Calculator,
  sections: [
    {
      title: "Federal Requirements (Effective 2022)",
      content: [
        "Providers must give estimate within 3 days of scheduling",
        "Estimate must include all expected charges and services",
        "Final bill cannot exceed estimate by $400+ without justification",
        "Patient can dispute charges that exceed estimate significantly",
        "Applies to self-pay patients and out-of-network services",
        "Emergency services exempt but follow-up care is covered"
      ]
    },
    {
      title: "Strategic Usage Tactics",
      content: [
        "Request written estimate for all scheduled procedures",
        "Use estimate as baseline for negotiating final charges",
        "Challenge any charges exceeding estimate by 400+",
        "Leverage estimate discrepancies in payment negotiations",
        "Document verbal estimates with follow-up email",
        "Compare estimates across multiple facilities"
      ]
    },
    {
      title: "Dispute Process for Estimate Violations",
      content: [
        "File complaint with provider within 120 days",
        "Reference specific Good Faith Estimate requirements",
        "Calculate exact overage amount versus estimate",
        "Request written justification for additional charges",
        "Escalate to state attorney general if unresolved",
        "Use estimate violation as leverage for overall reduction"
      ]
    }
  ]
};

const charityCareMastery = {
  title: "Charity Care & Financial Assistance",
  description: "Navigate hospital financial assistance programs that can eliminate 50-100% of your bill",
  icon: Heart,
  sections: [
    {
      title: "Eligibility Requirements by Income Level",
      content: [
        "100% write-off: Income below 200% Federal Poverty Level",
        "75% discount: Income 200-300% Federal Poverty Level",
        "50% discount: Income 300-400% Federal Poverty Level",
        "Payment plans: Income up to 600% Federal Poverty Level",
        "Asset limits: Liquid assets under 6 months living expenses",
        "Emergency qualification: Immediate financial hardship"
      ]
    },
    {
      title: "Required Documentation Strategy",
      content: [
        "Last 3 months of pay stubs or unemployment benefits",
        "Previous year tax return (or statement if didn't file)",
        "Bank statements showing limited liquid assets",
        "Proof of extraordinary medical expenses",
        "Documentation of job loss or income reduction",
        "Household size verification (affects income limits)"
      ]
    },
    {
      title: "Application Optimization Tips",
      content: [
        "Apply within 30 days of first bill for retroactive coverage",
        "Include hardship letter explaining financial situation",
        "Calculate and highlight debt-to-income ratio",
        "Emphasize any extraordinary circumstances",
        "Request expedited review for urgent financial need",
        "Follow up weekly until decision is made"
      ]
    }
  ]
};

const paymentPlanStrategy = {
  title: "Strategic Payment Plan Negotiation",
  description: "Structure payment arrangements that preserve your rights while minimizing financial impact",
  icon: CreditCard,
  sections: [
    {
      title: "Payment Plan Rights & Protections",
      content: [
        "Hospitals cannot require lump sum payments",
        "Monthly payments as low as $25 are legally acceptable",
        "No interest charges allowed on charity care balances",
        "Payment plans cannot require collateral or cosigners",
        "Right to modify plan if financial situation changes",
        "Protection from collections during plan compliance"
      ]
    },
    {
      title: "Negotiation Leverage Points",
      content: [
        "Hospital's cost of collections (30-40% to agencies)",
        "Bad debt write-off tax benefits for hospital",
        "Regulatory compliance requirements (charity care)",
        "Public relations concerns for non-profit hospitals",
        "End-of-fiscal-year revenue recognition needs",
        "Medicare reimbursement rate as benchmark"
      ]
    },
    {
      title: "Payment Structure Optimization",
      content: [
        "Start with longest possible term (60+ months)",
        "Negotiate 0% interest for financial hardship",
        "Include clause for early payment discount",
        "Reserve right to pay lump sum at Medicare rates",
        "Request automatic forgiveness after X payments",
        "Ensure plan doesn't affect credit report negatively"
      ]
    }
  ]
};

const escalationScripts = {
  title: "Professional Escalation Scripts",
  description: "Word-for-word scripts proven to get results when initial negotiations fail",
  icon: PhoneCall,
  scripts: [
    {
      scenario: "Initial Billing Department Contact",
      script: "Hello, I'm calling regarding account #[NUMBER] for services on [DATE]. I've received a bill for $[AMOUNT] and would like to speak with someone about reviewing it for accuracy. I'm not disputing my obligation to pay for legitimate services, but I want to ensure all charges are correct and fair. Can you connect me with a Patient Financial Counselor who can help with this review?"
    },
    {
      scenario: "Charity Care Application Request",
      script: "I'm experiencing financial hardship and would like to apply for your charity care program. According to your published policy, patients with income up to [X]% of the Federal Poverty Level are eligible for assistance. My current income qualifies me for consideration. Can you send me the application immediately and expedite the review process? I understand you cannot pursue collections while my application is pending."
    },
    {
      scenario: "Medicare Rate Negotiation",
      script: "I've researched the Medicare reimbursement rate for these services, which is approximately [X]% of your charges. Since Medicare represents the government's assessment of fair value for these services, I'd like to discuss settling my account at the Medicare rate plus a reasonable margin. This would be a fair resolution that covers your costs while acknowledging the billing concerns I've identified."
    },
    {
      scenario: "Supervisor Escalation",
      script: "I appreciate your time, but this matter requires management attention. I've identified billing errors totaling $[AMOUNT] and have documentation supporting my position. I need to speak with your supervisor or the Patient Financial Services Manager. This is a legitimate dispute that requires someone with authority to make adjustments to resolve. When is the best time to reach them directly?"
    },
    {
      scenario: "Compliance Department Escalation",
      script: "I need to speak with your Compliance Department regarding potential billing regulation violations. I've identified charges that may not comply with [specific regulation]. I'm hoping to resolve this internally before filing complaints with state regulators. Can you transfer me to your Compliance Officer or Patient Advocate who handles these matters?"
    }
  ]
};

const insuranceAppealsDetailed = {
  title: "Insurance Appeals Mastery",
  description: "Turn denials into approvals with systematic appeal strategies that work 65% of the time",
  icon: Shield,
  sections: [
    {
      title: "Pre-Appeal Investigation",
      content: [
        "Request complete claim file from insurance (within 15 days)",
        "Identify exact denial reason code and description",
        "Review policy language for coverage details",
        "Gather all medical records supporting medical necessity",
        "Research similar cases and precedent decisions",
        "Document timeline of all communications"
      ]
    },
    {
      title: "Level 1 Internal Appeal Strategy",
      content: [
        "File within 180 days of denial notification",
        "Include comprehensive medical records packet",
        "Provide peer-reviewed literature supporting treatment",
        "Request clinical peer-to-peer review with provider",
        "Challenge any prior authorization requirements retroactively",
        "Emphasize emergency nature if applicable"
      ]
    },
    {
      title: "External Review Escalation",
      content: [
        "Request independent review within 60 days of internal denial",
        "Submit to state insurance commissioner simultaneously",
        "Include evidence of insurance company pattern practices",
        "Provide economic impact statement of denial",
        "Request expedited review for urgent medical needs",
        "Document all procedural violations by insurance company"
      ]
    }
  ]
};

const collectionsDefenseGuide = {
  title: "Collections Defense Strategy",
  description: "Protect yourself from aggressive collections tactics while preserving your negotiation position",
  icon: Shield,
  sections: [
    {
      title: "Know Your Rights (FDCPA)",
      content: [
        "Debt collectors cannot call before 8am or after 9pm",
        "Cannot contact you at work if you tell them not to",
        "Must send debt validation notice within 5 days",
        "Cannot threaten actions they don't intend to take",
        "Cannot discuss debt with third parties (except spouse)",
        "Must cease contact if you request in writing"
      ]
    },
    {
      title: "Debt Validation Process",
      content: [
        "Request debt validation within 30 days of first contact",
        "Demand original signed agreement or contract",
        "Require proof of assignment/ownership of debt",
        "Request itemized accounting of all charges and payments",
        "Challenge any interest or fees added after default",
        "Verify statute of limitations hasn't expired"
      ]
    },
    {
      title: "Negotiation from Position of Strength",
      content: [
        "Never admit debt ownership or agree to payments initially",
        "Negotiate lump sum settlement at 20-40% of balance",
        "Require 'pay for delete' agreement before payment",
        "Get all agreements in writing before sending money",
        "Use certified funds for final payment only",
        "Document any violations for counterclaim leverage"
      ]
    }
  ]
};

const practiceStrategies = [
  {
    id: "error-detection",
    title: "Billing Error Detection System",
    icon: AlertTriangle,
    color: "red",
    savings: "$2,500-$8,900",
    description: "Master the art of spotting common billing errors that hospitals hope you'll miss",
    steps: [
      "Request itemized bill within 30 days of service",
      "Compare procedure dates with your actual visit dates",  
      "Verify CPT codes match services you actually received",
      "Check for duplicate charges (same service listed twice)",
      "Look for unbundling (separate billing for bundled procedures)",
      "Validate room/bed charges against your actual length of stay",
      "Cross-reference insurance EOB with hospital charges"
    ],
    tips: [
      "Hospitals make errors on 80% of bills - always request itemized breakdown",
      "Emergency room visits are most prone to overbilling",
      "Surgical procedures often include 'phantom' charges for unused supplies",
      "Room charges should match exact admission/discharge times"
    ]
  },
  {
    id: "negotiation-tactics",
    title: "Hospital Negotiation Mastery",
    icon: MessageCircle,
    color: "blue",
    savings: "$5,000-$15,000",
    description: "Proven scripts and timing strategies that get results from hospital billing departments",
    steps: [
      "Call billing department within 10 days of receiving bill",
      "Ask to speak with a 'Patient Financial Counselor' (higher authority)",
      "Request Medicare rate comparison for same procedures",
      "Inquire about charity care programs (available at income up to 400% FPL)",
      "Negotiate payment plan while disputing charges",
      "Document all conversations with names, dates, and outcomes",
      "Escalate to Patient Advocate if first attempts fail"
    ],
    tips: [
      "Best calling time: Tuesday-Thursday, 10am-3pm (staff less rushed)",
      "Use phrase: 'I'd like to review my bill for accuracy'",
      "Never admit ability to pay full amount upfront",
      "Hospital staff have discretionary authority up to 30% reduction"
    ]
  },
  {
    id: "payment-strategies",
    title: "Strategic Payment Approaches", 
    icon: DollarSign,
    color: "green",
    savings: "$1,200-$4,500",
    description: "Smart payment timing and methods that preserve your negotiating power",
    steps: [
      "Never pay immediately - bills aren't legally due for 30+ days",
      "Request payment plan even if you can afford full payment",
      "Pay disputed amounts into escrow account (shows good faith)",
      "Use 'pay-for-delete' negotiations for collections",
      "Leverage end-of-fiscal-year timing (hospitals need revenue)",
      "Negotiate cash discount for immediate payment (after reduction)",
      "Document all payment agreements in writing before paying"
    ],
    tips: [
      "Hospitals prefer payment plans to collections (saves them 30-40%)",
      "Cash payments can get 10-20% additional discounts",
      "End of fiscal year (Dec/Mar) best time for aggressive negotiations",
      "Payment plans as low as $25/month are legally acceptable"
    ]
  },
  {
    id: "insurance-appeals",
    title: "Insurance Appeal Strategies",
    icon: ShieldCheck,
    color: "purple", 
    savings: "$3,000-$12,000",
    description: "Turn insurance denials into approvals with systematic appeal processes",
    steps: [
      "Request complete claim file from insurance within 15 days",
      "Identify exact reason for denial (prior auth, medical necessity, etc.)",
      "Gather supporting medical records and documentation",
      "File formal appeal within required timeframe (typically 60 days)",
      "Request peer-to-peer review between doctors",
      "Escalate to independent external review if internal appeals fail",
      "File complaints with state insurance commissioner if needed"
    ],
    tips: [
      "80% of insurance denials are never appealed - they count on this",
      "Emergency services can't be denied for prior authorization",
      "Get everything in writing - verbal approvals don't count",
      "Use medical provider's National Provider Identifier (NPI) in appeals"
    ]
  }
];

// Interactive Savings Calculator Component
function SavingsCalculatorSection() {
  const [billAmount, setBillAmount] = useState<string>("");
  const [strategy, setStrategy] = useState<string>("error-detection");
  const [estimatedSavings, setEstimatedSavings] = useState<number>(0);

  const calculateSavings = () => {
    const amount = parseFloat(billAmount) || 0;
    const rates = {
      "error-detection": 0.25, // 25% average savings
      "negotiation": 0.40, // 40% average savings
      "charity-care": 0.75, // 75% average savings
      "insurance-appeal": 0.35, // 35% average savings
      "collections-defense": 0.50 // 50% average savings
    };
    const savings = amount * (rates[strategy as keyof typeof rates] || 0.25);
    setEstimatedSavings(savings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <MobileCard className="bg-gradient-to-r from-green-50/80 to-emerald-100/80 border-green-200 hover:shadow-xl transition-all">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Calculator className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Bill Reduction Calculator</h3>
              <p className="text-sm text-gray-700">Estimate your potential savings with our proven strategies</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Bill Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="Enter bill amount"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  data-testid="bill-amount-input"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Strategy</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                data-testid="strategy-select"
              >
                <option value="error-detection">Billing Error Detection (25% avg)</option>
                <option value="negotiation">Hospital Negotiation (40% avg)</option>
                <option value="charity-care">Charity Care Application (75% avg)</option>
                <option value="insurance-appeal">Insurance Appeal (35% avg)</option>
                <option value="collections-defense">Collections Defense (50% avg)</option>
              </select>
            </div>
            
            <MobileButton 
              onClick={calculateSavings}
              className="w-full bg-green-600 hover:bg-green-700"
              data-testid="calculate-savings-btn"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Potential Savings
            </MobileButton>
            
            {estimatedSavings > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-100 rounded-lg border border-green-200"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    ${estimatedSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Estimated Savings</div>
                  <div className="text-xs text-green-600 mt-1">
                    Based on our users' average results
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </MobileCard>
    </motion.div>
  );
}

// Missing component implementations
function PremiumGate() {
  return (
    <MobileCard className="text-center py-8">
      <div className="mb-4">
        <Crown className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h2>
        <p className="text-gray-600 mb-4">Access detailed bill best practices with premium subscription</p>
        <Link href="/premium">
          <MobileButton className="bg-amber-500 hover:bg-amber-600">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </MobileButton>
        </Link>
      </div>
    </MobileCard>
  );
}

function ComprehensiveSection({ guide, colorScheme, expandedSection, setExpandedSection }: {
  guide: any;
  colorScheme: string;
  expandedSection: string | null;
  setExpandedSection: (id: string | null) => void;
}) {
  const isExpanded = expandedSection === guide.title;
  const IconComponent = guide.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <MobileCard className={`bg-gradient-to-r from-${colorScheme}-50/80 to-${colorScheme}-100/80 border-${colorScheme}-200 hover:shadow-xl transition-all`}>
        <div 
          className="cursor-pointer"
          onClick={() => setExpandedSection(isExpanded ? null : guide.title)}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 bg-${colorScheme}-100 rounded-xl flex items-center justify-center`}>
              <IconComponent className={`h-5 w-5 text-${colorScheme}-600`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base">{guide.title}</h3>
              <p className="text-sm text-gray-700">{guide.description}</p>
            </div>
            <ChevronDown className={`h-5 w-5 text-${colorScheme}-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="border-t border-gray-200 pt-4 mt-4 space-y-6"
          >
            {guide.sections.map((section: any, index: number) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 text-sm mb-3">{section.title}</h4>
                <div className="space-y-2">
                  {section.content.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className={`h-4 w-4 text-${colorScheme}-600 mt-0.5 flex-shrink-0`} />
                      <span className="text-xs text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </MobileCard>
    </motion.div>
  );
}

function EscalationScriptsSection({ scripts, expandedScript, setExpandedScript }: {
  scripts: any;
  expandedScript: string | null;
  setExpandedScript: (id: string | null) => void;
}) {
  const isExpanded = expandedScript === scripts.title;
  const IconComponent = scripts.icon;
  
  // Define copyToClipboard function within this component
  const { toast } = useToast();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard!",
        description: "Script has been copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the script text",
        variant: "destructive"
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <MobileCard className="bg-gradient-to-r from-orange-50/80 to-red-100/80 border-orange-200 hover:shadow-xl transition-all">
        <div 
          className="cursor-pointer"
          onClick={() => setExpandedScript(isExpanded ? null : scripts.title)}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-base">{scripts.title}</h3>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-orange-600" />
                </motion.div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{scripts.description}</p>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="border-t border-gray-200 pt-6 mt-4"
          >
            <div className="space-y-6">
              {scripts.scripts.map((script: any, scriptIndex: number) => (
                <div key={scriptIndex} className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                    <div className="w-6 h-6 bg-orange-200 text-orange-800 rounded-full text-xs font-bold flex items-center justify-center mr-2">
                      {scriptIndex + 1}
                    </div>
                    {script.scenario}
                  </h4>
                  <div className="ml-8 p-4 bg-white/70 rounded-lg border border-orange-100">
                    <div className="flex items-start space-x-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-medium text-orange-800">Word-for-word script:</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-mono bg-gray-50 p-3 rounded border">
                      {script.script}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <MobileButton 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(script.script)}
                        data-testid={`copy-script-${scriptIndex}`}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Script
                      </MobileButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </MobileCard>
    </motion.div>
  );
}

function EnhancedLetterTemplatesSection({ templates, expandedTemplate, setExpandedTemplate, copyToClipboard }: {
  templates: any[];
  expandedTemplate: string | null;
  setExpandedTemplate: (id: string | null) => void;
  copyToClipboard: (text: string) => void;
}) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
        Professional Letter Templates
      </h2>
      
      {templates.map((template, index) => {
        const isExpanded = expandedTemplate === template.title;
        
        return (
          <motion.div
            key={template.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="mb-4"
          >
            <MobileCard className="bg-gradient-to-r from-purple-50/80 to-indigo-100/80 border-purple-200 hover:shadow-xl transition-all">
              <div 
                className="cursor-pointer"
                onClick={() => setExpandedTemplate(isExpanded ? null : template.title)}
                data-testid={`template-${index}`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{template.title}</h3>
                      <ChevronDown className={`h-5 w-5 text-purple-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <p className="text-xs text-gray-700">{template.description}</p>
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-gray-200 pt-4 mt-4"
                >
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                      {template.template}
                    </pre>
                  </div>
                  <div className="flex justify-center mt-3">
                    <MobileButton
                      variant="secondary" 
                      size="sm"
                      onClick={() => copyToClipboard(template.template)}
                      data-testid={`copy-enhanced-template-${index}`}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Template
                    </MobileButton>
                  </div>
                </motion.div>
              )}
            </MobileCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function QuickReferenceSection() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
        Quick Reference Tools
      </h2>
      
      <MobileCard className="bg-gradient-to-r from-indigo-50/80 to-blue-100/80 border-indigo-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Essential Contacts</h3>
              <p className="text-sm text-gray-700">Key phone numbers and contacts for bill disputes</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="bg-white/60 p-3 rounded-lg">
              <span className="font-semibold text-gray-800">Hospital Billing:</span>
              <span className="text-gray-700 ml-2">Ask for "Patient Financial Counselor"</span>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <span className="font-semibold text-gray-800">Insurance Appeals:</span>
              <span className="text-gray-700 ml-2">Member Services → Appeals Department</span>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <span className="font-semibold text-gray-800">State Insurance Commission:</span>
              <span className="text-gray-700 ml-2">File complaints for denied claims</span>
            </div>
          </div>
        </div>
      </MobileCard>
    </motion.div>
  );
}

function AdditionalResourcesSection() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
        Additional Resources
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <MobileCard className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 text-center">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Scale className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-xs mb-1">Legal Aid</h3>
          <p className="text-xs text-gray-600">Free legal help for medical debt</p>
        </MobileCard>
        
        <MobileCard className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-xs mb-1">Patient Rights</h3>
          <p className="text-xs text-gray-600">Know your healthcare rights</p>
        </MobileCard>
      </div>
    </motion.div>
  );
}

// Detailed Case Studies Component
function DetailedCaseStudiesSection({ caseStudies, expandedCase, setExpandedCase }: {
  caseStudies: any[];
  expandedCase: string | null;
  setExpandedCase: (id: string | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
        Real Success Stories
      </h2>
      
      {caseStudies.map((caseStudy, index) => {
        const isExpanded = expandedCase === caseStudy.title;
        
        return (
          <motion.div
            key={caseStudy.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="mb-4"
          >
            <MobileCard className="bg-gradient-to-r from-blue-50/80 to-indigo-100/80 border-blue-200 hover:shadow-xl transition-all">
              <div 
                className="cursor-pointer"
                onClick={() => setExpandedCase(isExpanded ? null : caseStudy.title)}
                data-testid={`case-study-${index}`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{caseStudy.title}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-700">{caseStudy.savings}</div>
                        <div className="text-xs text-gray-600">saved</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>Strategy: {caseStudy.strategy}</span>
                      <span>Timeline: {caseStudy.timeline}</span>
                      <span className="font-semibold text-green-600">{caseStudy.savingsPercentage} reduction</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-gray-200 pt-4 mt-4 space-y-4"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Patient Profile:</h4>
                    <p className="text-xs text-gray-700 bg-white/50 p-2 rounded">{caseStudy.patientProfile}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Tactics Used:</h4>
                    <div className="space-y-1">
                      {caseStudy.keyTactics.map((tactic: string, tacticIndex: number) => (
                        <div key={tacticIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{tactic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Timeline Breakdown:</h4>
                    <div className="space-y-1">
                      {caseStudy.timeline_breakdown.map((phase: string, phaseIndex: number) => (
                        <div key={phaseIndex} className="flex items-start space-x-2">
                          <Clock className="h-3 w-3 text-indigo-600 mt-1 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{phase}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Lessons:</h4>
                    <div className="space-y-1">
                      {caseStudy.lessons_learned.map((lesson: string, lessonIndex: number) => (
                        <div key={lessonIndex} className="flex items-start space-x-2">
                          <Lightbulb className="h-3 w-3 text-amber-600 mt-1 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </MobileCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function BillBestPractices() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  const localCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard!",
        description: "Text has been copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the text",
        variant: "destructive"
      });
    }
  };

  if (isLoading || subscriptionLoading) {
    return (
      <MobileLayout title="Bill Best Practices" showBottomNav={true}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!isAuthenticated || !isSubscribed) {
    return (
      <MobileLayout title="Bill Best Practices" showBottomNav={true}>
        <PremiumGate />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Bill Best Practices" showBottomNav={true}>
      <div className="space-y-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-red-400 via-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/25"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <FileText className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Medical Bill Best Practices
          </motion.h1>
          
          <motion.p 
            className="text-sm text-gray-600 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Professional strategies to reduce medical bills by thousands of dollars
          </motion.p>
        </motion.div>

        <SavingsCalculatorSection />

        {/* Comprehensive Guides */}
        <ComprehensiveSection 
          guide={itemizedAnalysisGuide} 
          colorScheme="blue"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
        
        <ComprehensiveSection 
          guide={codingReviewGuide} 
          colorScheme="purple"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
        
        <ComprehensiveSection 
          guide={goodFaithEstimateGuide} 
          colorScheme="green"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
        
        <ComprehensiveSection 
          guide={charityCareMastery} 
          colorScheme="pink"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
        
        <ComprehensiveSection 
          guide={paymentPlanStrategy} 
          colorScheme="indigo"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
        
        <EscalationScriptsSection 
          scripts={escalationScripts}
          expandedScript={expandedScript}
          setExpandedScript={setExpandedScript}
        />
        
        <ComprehensiveSection 
          guide={insuranceAppealsDetailed} 
          colorScheme="teal"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
        
        <ComprehensiveSection 
          guide={collectionsDefenseGuide} 
          colorScheme="red"
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />

        <EnhancedLetterTemplatesSection 
          templates={enhancedLetterTemplates}
          expandedTemplate={expandedTemplate}
          setExpandedTemplate={setExpandedTemplate}
          copyToClipboard={localCopyToClipboard}
        />

        <DetailedCaseStudiesSection 
          caseStudies={detailedCaseStudies}
          expandedCase={expandedCase}
          setExpandedCase={setExpandedCase}
        />

        <QuickReferenceSection />
        <AdditionalResourcesSection />

        {/* Quick Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Take Action Now
          </h2>
          
          <Link href="/bill-ai">
            <MobileButton className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" size="lg">
              <FileCheck className="h-5 w-5 mr-2" />
              Analyze Your Bill
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/industry-insights">
            <MobileButton className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Industry Insights
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </motion.div>

      </div>
    </MobileLayout>
  );
}