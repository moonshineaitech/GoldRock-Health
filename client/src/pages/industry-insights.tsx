import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "wouter";
import { 
  Eye, 
  Shield, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle, 
  Crown,
  Lock,
  ArrowRight,
  Clock,
  DollarSign,
  Target,
  Users,
  Building2,
  FileX,
  Zap,
  Brain,
  Timer,
  Phone,
  MessageCircle,
  Award,
  Lightbulb,
  Info,
  Calculator,
  BarChart3,
  MapPin,
  Scale,
  FileText,
  TrendingDown,
  Percent,
  Receipt,
  Building,
  Gavel,
  HandCoins,
  UserCheck,
  Heart,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileEdit,
  Banknote,
  LineChart,
  Code,
  Search,
  CreditCard,
  PhoneCall,
  ClipboardList,
  HelpCircle,
  Star,
  BadgeCheck,
  Briefcase,
  Database,
  PieChart,
  Activity,
  Clipboard,
  FileBarChart,
  BookOpen,
  TrendingDownIcon,
  AlertTriangle,
  Crosshair,
  FileCheck,
  ShieldCheck,
  Handshake
} from "lucide-react";

// 1. Revenue Cycle 101 - How hospitals generate revenue
const revenueCycleData = {
  title: "Hospital Revenue Cycle 101",
  description: "Understanding how hospitals generate revenue from patient care and where leverage points exist",
  icon: Building2,
  sections: [
    {
      title: "The 7-Stage Revenue Cycle Process",
      icon: Activity,
      content: [
        {
          stage: "1. Pre-Registration",
          description: "Patient scheduling and insurance verification",
          insiderTip: "This is where 30% of billing errors originate. Hospitals often skip thorough verification to avoid delays.",
          leverage: "Always confirm insurance coverage independently before service. Use verification failures to dispute charges later."
        },
        {
          stage: "2. Registration & Patient Access",
          description: "Collecting demographic, insurance, and financial information",
          insiderTip: "Registration staff are trained to maximize co-pay collection and identify self-pay patients for immediate payment.",
          leverage: "Never provide unnecessary financial information. Ask what's 'required by law' vs. 'hospital policy.'"
        },
        {
          stage: "3. Charge Capture",
          description: "Recording all services, procedures, and supplies used",
          insiderTip: "Charge capture is where 'phantom billing' occurs - charging for services not provided or supplies not used.",
          leverage: "Request itemized bills within 24 hours. Challenge charges for services not documented in medical records."
        },
        {
          stage: "4. Medical Coding",
          description: "Translating services into billing codes (CPT, ICD-10)",
          insiderTip: "Coders are incentivized to 'upcode' - billing higher complexity levels to increase revenue.",
          leverage: "Request coding documentation. Challenge codes that don't match the complexity of care received."
        },
        {
          stage: "5. Claims Submission",
          description: "Sending bills to insurance companies for payment",
          insiderTip: "Hospitals intentionally submit claims with errors to delay insurance payment while pressuring patients to pay.",
          leverage: "Monitor insurance claim status independently. Use delays to argue patient responsibility reduction."
        },
        {
          stage: "6. Payment Processing",
          description: "Handling insurance payments and patient billing",
          insiderTip: "Payment posting errors are common and often favor the hospital. Overpayments are rarely refunded automatically.",
          leverage: "Track all payments yourself. Demand detailed payment reconciliation statements."
        },
        {
          stage: "7. Collections",
          description: "Following up on unpaid balances",
          insiderTip: "Collections departments have the most negotiation authority but are measured on speed, not amount collected.",
          leverage: "Engage with collections early - they often have authority to settle for 30-50% of balance."
        }
      ]
    },
    {
      title: "Revenue Pressure Points & Timing",
      icon: Target,
      insights: [
        {
          title: "End-of-Fiscal-Year Desperation",
          detail: "Most hospitals operate on fiscal years ending December 31st or March 31st. In the final quarter, they need to show revenue recognition to meet budget projections for board reporting.",
          actionable: "Time major negotiations for October-December or January-March. Hospitals will accept 40-60% settlements to close revenue gaps."
        },
        {
          title: "Monthly Collection Quotas",
          detail: "Revenue cycle staff have monthly collection targets. The last week of each month, they have authority to make deals to hit quotas.",
          actionable: "Schedule payment negotiations for the 25th-31st of any month when staff are most motivated to close deals."
        },
        {
          title: "Charity Care Budget Allocation",
          detail: "Nonprofit hospitals must spend a minimum amount on charity care annually to maintain tax-exempt status. They often have unspent budgets.",
          actionable: "Apply for charity care in Q4 when hospitals need to hit their annual charity care spending requirements."
        },
        {
          title: "Bad Debt Write-Off Thresholds",
          detail: "Hospitals have accounting thresholds (often $500-1000) below which they automatically write off debts rather than pursue collections.",
          actionable: "For smaller bills, simply request a 'financial hardship write-off' - many will approve without documentation."
        }
      ]
    }
  ]
};

// 2. Chargemaster & Price Markups
const chargemasterData = {
  title: "Chargemaster & Price Markup Secrets",
  description: "Understanding hospital price lists and the massive markup strategies hospitals use",
  icon: Calculator,
  sections: [
    {
      title: "Chargemaster Fundamentals",
      icon: FileBarChart,
      content: [
        {
          concept: "What is a Chargemaster?",
          explanation: "A comprehensive list of every billable service, procedure, supply, and medication with assigned prices. Most hospitals have 15,000+ line items.",
          insiderTip: "Chargemaster prices are typically 3-10x the actual cost. They're designed as 'list prices' with the expectation of negotiated discounts."
        },
        {
          concept: "Price Setting Strategy",
          explanation: "Hospitals set prices by analyzing competitor rates, insurance reimbursements, and desired profit margins.",
          insiderTip: "Many hospitals simply copy competitors' prices and add 10-20%. There's no scientific methodology behind most pricing."
        },
        {
          concept: "Annual Price Updates",
          explanation: "Most hospitals update chargemaster prices annually, typically increasing 3-8% across all services.",
          insiderTip: "Price increases often target services with less insurance oversight - outpatient procedures, emergency services, and supplies."
        }
      ]
    },
    {
      title: "Common Markup Patterns",
      icon: TrendingUp,
      markups: [
        {
          category: "Medications",
          typicalMarkup: "200-500%",
          example: "$5 Tylenol tablet charged at $25-30",
          challenge: "Ask for generic alternatives and question 'pharmacy dispensing fees'"
        },
        {
          category: "Medical Supplies",
          typicalMarkup: "300-800%",
          example: "$2 surgical gloves charged at $15-20",
          challenge: "Request itemized supply list and compare with wholesale medical supply prices online"
        },
        {
          category: "Diagnostic Tests",
          typicalMarkup: "400-600%",
          example: "$100 X-ray charged at $500-800",
          challenge: "Use Medicare fee schedules as comparison - hospitals must accept Medicare rates for Medicare patients"
        },
        {
          category: "Operating Room Time",
          typicalMarkup: "500-1000%",
          example: "$200/hour actual cost charged at $2,000-3,000/hour",
          challenge: "Request exact OR start/stop times from anesthesia records to verify billing accuracy"
        },
        {
          category: "Emergency Room Facility Fees",
          typicalMarkup: "1000-2000%",
          example: "$50 overhead cost charged as $500-1,500 facility fee",
          challenge: "Challenge the acuity level designation - most ER visits don't justify Level 4-5 facility fees"
        }
      ]
    },
    {
      title: "Price Transparency Loopholes",
      icon: Eye,
      loopholes: [
        {
          title: "Meaningless Machine-Readable Files",
          description: "Hospitals post required price files in formats designed to be unusable by patients",
          exploit: "Demand human-readable pricing for your specific services. Many hospitals will negotiate rather than provide transparent pricing."
        },
        {
          title: "Insurance-Specific Pricing",
          description: "Published prices often don't reflect negotiated insurance rates",
          exploit: "Use published rates as starting points for self-pay negotiations - argue for 'best available rate.'"
        },
        {
          title: "Bundled vs. Unbundled Pricing",
          description: "Hospitals can present prices as either bundled packages or itemized services",
          exploit: "Request both versions and choose whichever is more advantageous for your situation."
        }
      ]
    }
  ]
};

// 3. Common Overcharge Schemes - Expanded
const overchargeSchemes = {
  title: "Common Overcharge Schemes",
  description: "Insider knowledge of how hospitals systematically inflate bills and how to detect these patterns",
  icon: AlertTriangle,
  schemes: [
    {
      title: "Phantom Billing",
      description: "Charging for services never provided or supplies never used",
      icon: FileX,
      methods: [
        "Billing for physician visits that never occurred",
        "Charging for surgical supplies opened but not used",
        "Adding 'administrative fees' for services already included",
        "Billing for lab tests ordered but not performed"
      ],
      detection: [
        "Compare bill line items with medical record timestamps",
        "Verify physician signatures match actual visit dates",
        "Check if supply charges align with procedure complexity",
        "Request surgical case notes to verify supply usage"
      ],
      avgOvercharge: "$1,500-8,000",
      challenge: "Request detailed medical records and compare every charge with documented care. Phantom billing is Medicare fraud when intentional."
    },
    {
      title: "Upcoding Schemes",
      description: "Billing for higher complexity services than actually provided",
      icon: TrendingUp,
      methods: [
        "Emergency room Level 5 coding for minor conditions",
        "Inpatient admission coding for observation stays",
        "Complex surgical coding for routine procedures",
        "Critical care coding for standard monitoring"
      ],
      detection: [
        "Review medical records for vital sign instability",
        "Check length of stay against billing codes",
        "Verify medication complexity matches billing level",
        "Compare with similar past procedures"
      ],
      avgOvercharge: "$2,000-12,000",
      challenge: "Request coding criteria documentation and compare with CMS guidelines. Challenge any code that doesn't match documented medical necessity."
    },
    {
      title: "Unbundling Fraud",
      description: "Separating bundled procedures into individual charges to increase revenue",
      icon: Zap,
      methods: [
        "Billing surgery and anesthesia separately when bundled",
        "Charging for each lab test instead of panel pricing",
        "Separating imaging interpretation from imaging procedure",
        "Individual medication charges instead of IV bundle pricing"
      ],
      detection: [
        "Look for multiple charges on same date/time",
        "Verify if procedure codes should be bundled under CMS rules",
        "Check for modifier usage that may indicate unbundling",
        "Compare with Medicare fee schedules for bundled services"
      ],
      avgOvercharge: "$1,000-5,000",
      challenge: "Reference Medicare's Correct Coding Initiative (CCI) edits to identify improperly unbundled services."
    },
    {
      title: "Time-Based Billing Manipulation",
      description: "Inflating time-based charges through creative documentation",
      icon: Clock,
      methods: [
        "OR time starting when patient enters building vs. actual surgery",
        "Recovery room charges for time in different units",
        "Physician consultation time inflated beyond actual interaction",
        "Therapy time rounded up to next billing increment"
      ],
      detection: [
        "Request anesthesia start/stop times as verification",
        "Compare nursing notes with billed timeframes",
        "Check physician signature timestamps against billed time",
        "Verify patient location logs against facility charges"
      ],
      avgOvercharge: "$800-4,000",
      challenge: "Demand timestamped documentation for all time-based charges. Anesthesia records are the gold standard for surgical time verification."
    }
  ]
};

// 4. Payer Policies & Denial Tactics
const payerTactics = {
  title: "Insurance Payer Denial Tactics",
  description: "Inside knowledge of how insurance companies systematically deny claims and delay payments",
  icon: Shield,
  sections: [
    {
      title: "Standard Denial Strategies",
      icon: FileX,
      strategies: [
        {
          tactic: "Automatic Initial Denials",
          description: "Insurance companies automatically deny 10-15% of all claims, knowing only 3% will be appealed",
          counterStrategy: "Always appeal every denial within the specified timeframe. Use the phrase 'I formally request a peer-to-peer review with a physician in the same specialty.'"
        },
        {
          tactic: "Prior Authorization Games",
          description: "Requiring prior auth then claiming it was never received or insufficient",
          counterStrategy: "Always obtain written confirmation of prior authorization with reference numbers. Screenshot online portals showing approval status."
        },
        {
          tactic: "Medical Necessity Challenges",
          description: "Insurance physicians override treating physicians based on cost rather than clinical need",
          counterStrategy: "Request the specific clinical criteria used for denial. Often they can't produce current, applicable guidelines."
        },
        {
          tactic: "Network Status Manipulation",
          description: "Claiming providers were out-of-network despite their directories showing in-network",
          counterStrategy: "Take screenshots of provider directories showing in-network status before treatment. Use as evidence in appeals."
        }
      ]
    },
    {
      title: "Claims Processing Delays",
      icon: Timer,
      tactics: [
        {
          method: "Claim Processing 'Glitches'",
          purpose: "Creating delays to pressure patients to pay providers directly",
          response: "Track claim status independently through insurance portal. Document all delays and use as leverage for hospital payment plan negotiations."
        },
        {
          method: "Additional Documentation Requests",
          purpose: "Delaying payment while requesting increasingly specific documentation",
          response: "Provide requested information but set firm deadlines: 'I'm providing this within X days and expect claim resolution within Y days of your receipt.'"
        },
        {
          method: "Claim Downgrades",
          purpose: "Approving claims but at lower reimbursement levels to reduce payouts",
          response: "Challenge downgrades with specific documentation showing medical necessity for original level of care."
        }
      ]
    },
    {
      title: "Appeals Process Navigation",
      icon: AlertCircle,
      levels: [
        {
          level: "Level 1: Internal Review",
          timeline: "30-60 days",
          tips: "Submit comprehensive appeal with medical records, physician letters, and clinical guidelines supporting necessity.",
          successRate: "15-25%"
        },
        {
          level: "Level 2: Independent Review",
          timeline: "45-90 days", 
          tips: "Request external review by independent medical experts. Include patient impact statements and quality of life considerations.",
          successRate: "40-60%"
        },
        {
          level: "Level 3: State Insurance Commission",
          timeline: "90-180 days",
          tips: "File complaints with state regulators for pattern denials or bad faith practices. Many insurers settle rather than face regulatory scrutiny.",
          successRate: "60-80%"
        }
      ]
    }
  ]
};

// 5. No Surprises Act & Price Transparency
const regulatoryFramework = {
  title: "No Surprises Act & Price Transparency Laws",
  description: "Recent federal regulations that create new patient protections and how to leverage them",
  icon: Gavel,
  sections: [
    {
      title: "No Surprises Act Protections (2022)",
      icon: ShieldCheck,
      protections: [
        {
          protection: "Emergency Services",
          detail: "Out-of-network emergency care must be billed at in-network rates",
          leverage: "Challenge any emergency room balance billing. The facility must accept insurance payment as full payment except for in-network copays/deductibles."
        },
        {
          protection: "Good Faith Estimates",
          detail: "Providers must provide cost estimates for scheduled services",
          leverage: "If final bill exceeds estimate by $400+, you can dispute through federal process. Many hospitals settle rather than go through dispute resolution."
        },
        {
          protection: "Provider Network Adequacy",
          detail: "Out-of-network providers at in-network facilities can't balance bill",
          leverage: "If you receive surprise bills from anesthesiologists, pathologists, or radiologists at in-network facilities, these are likely violations."
        }
      ]
    },
    {
      title: "Price Transparency Requirements",
      icon: Eye,
      requirements: [
        {
          rule: "Machine-Readable Price Files",
          detail: "Hospitals must publish all standard charges online",
          usage: "Download these files to compare your charges against published rates. Use discrepancies to negotiate."
        },
        {
          rule: "Consumer-Friendly Displays",
          detail: "Hospitals must provide easy-to-use price tools for common services",
          usage: "Use these tools to get price quotes before service and lock in rates through written estimates."
        },
        {
          rule: "Insurance Negotiated Rates",
          detail: "Hospitals must disclose negotiated rates with different insurance plans",
          usage: "If you're self-pay, demand the lowest negotiated rate available as your starting point for negotiations."
        }
      ]
    },
    {
      title: "Independent Dispute Resolution",
      icon: Gavel,
      process: [
        {
          step: "1. Initiate Patient-Provider Dispute Resolution",
          detail: "For Good Faith Estimate violations exceeding $400",
          timeline: "Must initiate within 120 days of receiving bill"
        },
        {
          step: "2. 30-Day Open Negotiation Period",
          detail: "Patient and provider attempt direct resolution",
          strategy: "Use this period for maximum leverage - most providers settle to avoid formal process"
        },
        {
          step: "3. Independent Dispute Resolution Entity",
          detail: "Third-party arbitration if negotiation fails",
          outcome: "Arbitrator determines final amount based on Good Faith Estimate and actual services"
        }
      ]
    }
  ]
};

// 6. Price Benchmarks & Market Analysis
const priceBenchmarks = {
  title: "Price Benchmarks & Market Analysis",
  description: "Understanding fair pricing and regional variations to negotiate from position of knowledge",
  icon: BarChart3,
  sections: [
    {
      title: "National Pricing Benchmarks",
      icon: MapPin,
      benchmarks: [
        {
          service: "Emergency Room Visit (Level 4)",
          medicareRate: "$850-1,200",
          averageCharged: "$3,500-8,000",
          fairNegotiation: "$1,200-1,800",
          notes: "Most ER visits don't meet Level 4 criteria. Challenge the acuity level first."
        },
        {
          service: "Routine Appendectomy",
          medicareRate: "$8,500-12,000",
          averageCharged: "$25,000-45,000",
          fairNegotiation: "$12,000-18,000",
          notes: "Significant regional variation. Rural hospitals often charge more due to lower volume."
        },
        {
          service: "Chest X-Ray",
          medicareRate: "$85-120",
          averageCharged: "$300-800",
          fairNegotiation: "$120-200",
          notes: "One of the most marked-up services. Digital X-rays cost hospitals about $25 to produce."
        },
        {
          service: "Basic Blood Panel (CBC)",
          medicareRate: "$45-75",
          averageCharged: "$200-500",
          fairNegotiation: "$75-125",
          notes: "Lab markups are extreme. Independent labs charge $35-50 for same tests."
        }
      ]
    },
    {
      title: "Regional Cost Variations",
      icon: TrendingDownIcon,
      regions: [
        {
          region: "Northeast (NY, NJ, CT, MA)",
          costIndex: "140-180% of national average",
          factors: ["High labor costs", "Market consolidation", "Certificate of Need laws"],
          strategy: "Emphasize cost-of-living challenges and compare with national averages"
        },
        {
          region: "Southeast (FL, GA, NC, SC)",
          costIndex: "90-110% of national average", 
          factors: ["Competitive markets", "Lower labor costs", "Tourism-driven pricing"],
          strategy: "Use Medicare rates as baseline since many facilities serve Medicare populations"
        },
        {
          region: "Midwest (OH, MI, IN, IL)",
          costIndex: "85-105% of national average",
          factors: ["Manufacturing economy", "Rural hospital struggles", "Insurance competition"],
          strategy: "Leverage rural hospital financial pressures and manufacturing job market realities"
        },
        {
          region: "West Coast (CA, WA, OR)",
          costIndex: "130-170% of national average",
          factors: ["High real estate costs", "Tech industry coverage", "Strict regulations"],
          strategy: "Reference tech industry standard benefits and cost-effectiveness arguments"
        }
      ]
    },
    {
      title: "Market Competition Analysis",
      icon: Users,
      factors: [
        {
          factor: "Hospital Market Concentration",
          impact: "Higher concentration = higher prices",
          leverage: "In concentrated markets, emphasize financial hardship. In competitive markets, threaten to use competitors."
        },
        {
          factor: "Insurance Market Share",
          impact: "Dominant insurers get better rates",
          leverage: "If your insurer has low market share, argue for rates comparable to dominant insurers in the area."
        },
        {
          factor: "Academic Medical Centers",
          impact: "Teaching hospitals typically charge premium rates",
          leverage: "Challenge 'teaching fees' and resident supervision charges if not explicitly disclosed upfront."
        }
      ]
    }
  ]
};

// 7. State-Level Regulations
const stateRegulations = {
  title: "State-Level Patient Protection Laws",
  description: "Understanding varying state protections and how to leverage them for maximum benefit",
  icon: Scale,
  sections: [
    {
      title: "Strong Patient Protection States",
      icon: ShieldCheck,
      states: [
        {
          state: "California",
          protections: [
            "Hospitals must provide charity care to patients under 350% of federal poverty level",
            "Uninsured patients cannot be charged more than Medicare rates",
            "Medical debt cannot be reported to credit bureaus for 12 months",
            "Hospitals must offer payment plans of at least 24 months"
          ],
          keyLaw: "California Hospital Fair Pricing Act",
          leverage: "Reference specific income thresholds and Medicare rate requirements. California law is among the strongest nationally."
        },
        {
          state: "New York", 
          protections: [
            "Financial assistance for patients up to 300% of poverty level",
            "Sliding scale discounts up to 500% of poverty level",
            "Prohibition on aggressive collection tactics",
            "Required financial assistance screening before collections"
          ],
          keyLaw: "New York Hospital Financial Assistance Law",
          leverage: "Demand financial assistance screening and sliding scale evaluation even if you think you don't qualify."
        },
        {
          state: "Illinois",
          protections: [
            "Charity care for uninsured patients under 200% of poverty level",
            "Payment plans cannot require more than 4% of family income",
            "Hospitals cannot garnish wages for medical debt under $2,500",
            "Required community benefit spending"
          ],
          keyLaw: "Illinois Hospital Uninsured Patient Discount Act",
          leverage: "Use the 4% of income rule to establish affordable payment plans. Challenge any garnishment threats for smaller debts."
        }
      ]
    },
    {
      title: "Moderate Protection States",
      icon: AlertCircle,
      states: [
        {
          state: "Texas",
          protections: [
            "Hospitals must have charity care policies",
            "Uninsured patients eligible for discounts",
            "Payment plan requirements for financial hardship",
            "Prohibition on liens against primary residences under $5,000"
          ],
          gaps: ["No specific income thresholds", "Limited enforcement mechanisms"],
          strategy: "Focus on federal requirements and nonprofit tax obligations since state law is weaker."
        },
        {
          state: "Florida",
          protections: [
            "Charity care requirements for nonprofit hospitals",
            "Financial hardship policies required",
            "Payment plan availability",
            "Price transparency requirements"
          ],
          gaps: ["Weak enforcement", "No specific discount percentages"],
          strategy: "Leverage IRS nonprofit requirements and price transparency laws for negotiation."
        }
      ]
    },
    {
      title: "Limited Protection States",
      icon: AlertCircle,
      strategies: [
        "Focus on federal protections (No Surprises Act, nonprofit requirements)",
        "Leverage IRS charitable care obligations for nonprofit hospitals",
        "Use Medicare rates as pricing benchmarks",
        "Reference neighboring state laws as 'industry standards'",
        "Emphasize potential regulatory changes and public relations concerns"
      ]
    }
  ]
};

// 8. Industry Insider Tips
const insiderTips = {
  title: "Industry Insider Professional Tips",
  description: "Professional knowledge from 20+ year billing department veterans and revenue cycle experts",
  icon: Briefcase,
  sections: [
    {
      title: "Billing Department Psychology",
      icon: Brain,
      tips: [
        {
          insight: "Collection Staff Performance Metrics",
          detail: "Collectors are measured on dollars collected per hour, call resolution rates, and monthly quotas. They get bonuses for exceeding targets but penalties for falling short.",
          application: "Schedule calls near month-end when they need to hit quotas. Emphasize your ability to pay something immediately to make them want to work with you rather than pass to legal."
        },
        {
          insight: "Authority Level Identification",
          detail: "Phone representatives have different discount authorities: Customer Service (0-10%), Patient Financial Advocates (15-30%), Supervisors (40-60%), Directors (70%+).",
          application: "Always ask: 'What is your authority level for settling this account?' If it's not sufficient, immediately request escalation to someone who can 'resolve this matter today.'"
        },
        {
          insight: "Documentation Burden Thresholds",
          detail: "Discounts over $500 require supervisor approval and documentation. Staff often suggest smaller amounts to avoid paperwork, even if larger discounts are possible.",
          application: "When requesting large discounts, also suggest a smaller 'easy approval' amount as backup. This gives staff a way to show progress on your account."
        }
      ]
    },
    {
      title: "Strategic Timing Tactics",
      icon: Clock,
      tactics: [
        {
          timing: "End of Fiscal Quarter",
          rationale: "Hospitals need to show revenue recognition for quarterly board reports",
          strategy: "March, June, September, and December are ideal for aggressive negotiations. Hospitals will accept 40-70% settlements to close books."
        },
        {
          timing: "Monday Mornings vs Friday Afternoons",
          rationale: "Staff mood and workload affect negotiation willingness",
          strategy: "Avoid Monday mornings (high stress) and Friday afternoons (eager to finish week). Tuesday-Thursday 10am-2pm is optimal for complex negotiations."
        },
        {
          timing: "Holiday Periods",
          rationale: "Many hospitals have 'holiday courtesy' policies that pause aggressive collection",
          strategy: "Use mid-November through early January to prepare documentation and strategy without collection pressure."
        }
      ]
    },
    {
      title: "Documentation & Evidence Collection",
      icon: FileCheck,
      strategies: [
        {
          document: "Medical Records Request",
          purpose: "Verify that all charges correspond to documented care",
          technique: "Request within 30 days while memories are fresh. Ask for complete records including nursing notes, not just physician summaries."
        },
        {
          document: "Insurance Explanation of Benefits (EOB)",
          purpose: "Track insurance payments and identify claim processing errors",
          technique: "Request EOBs for all related claims. Compare dates, amounts, and denial reasons with hospital billing."
        },
        {
          document: "Written Communications Log",
          purpose: "Create evidence trail for negotiations and agreements",
          technique: "Follow up all phone calls with emails summarizing agreements. Start with: 'Per our conversation today, my understanding is...'"
        }
      ]
    },
    {
      title: "Negotiation Psychology & Language",
      icon: MessageCircle,
      techniques: [
        {
          approach: "Collaborative vs. Adversarial",
          wrong: "This bill is ridiculous and I'm not paying it!",
          right: "I want to resolve this responsibly. What options are available for someone in my financial situation?",
          why: "Billing staff deal with angry patients all day. Collaborative approach makes them want to help you."
        },
        {
          approach: "Specific Authority Requests",
          wrong: "Can you give me a discount?",
          right: "I'd like to speak with someone who has authority to settle this account today.",
          why: "Shows you understand the system and gets you to decision-makers faster."
        },
        {
          approach: "Immediate Payment Leverage",
          wrong: "I can't afford this.",
          right: "I can pay X amount today if we can settle this account in full.",
          why: "Immediate payment is powerful leverage. Hospitals prefer cash today over payment plans."
        }
      ]
    },
    {
      title: "Advanced Settlement Strategies",
      icon: Handshake,
      strategies: [
        {
          strategy: "Multiple Settlement Offers",
          technique: "Present 3 options: low immediate payment, medium 30-day payment, higher 6-month plan",
          psychology: "Gives staff options to choose from rather than just accept/reject one offer"
        },
        {
          strategy: "Charity Care + Settlement Hybrid",
          technique: "Apply for charity care but offer immediate settlement during review period",
          advantage: "Creates urgency while showing financial need documentation"
        },
        {
          strategy: "Professional Third-Party Reference",
          technique: "Mention consulting with medical billing advocate or attorney (even if you haven't)",
          impact: "Elevates your perceived sophistication and gets better offers"
        }
      ]
    }
  ]
};

function PremiumGate() {
  return (
    <div className="space-y-6">
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Eye className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Industry Insider Insights
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Professional knowledge from revenue cycle veterans and billing department insiders
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <MobileCard className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 mb-6">
            <div className="text-center">
              <Lock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Premium Industry Intelligence</h3>
              <p className="text-sm text-purple-700 mb-4 leading-relaxed">
                Comprehensive insider knowledge from 20+ year industry veterans
              </p>
              <div className="space-y-2 text-left text-sm text-purple-800">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Hospital revenue cycle operations and pressure points</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Chargemaster pricing strategies and markup schemes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Insurance denial tactics and counter-strategies</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Federal regulations and state-level protections</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Professional negotiation techniques and timing</span>
                </div>
              </div>
            </div>
          </MobileCard>

          <Link href="/premium" data-testid="link-upgrade-premium">
            <MobileButton size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" data-testid="button-upgrade-premium">
              <Crown className="h-5 w-5 mr-2" />
              Unlock Industry Secrets
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function IndustryInsights() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (isLoading || subscriptionLoading) {
    return (
      <MobileLayout title="Industry Insights" showBottomNav={true}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!isAuthenticated || !isSubscribed) {
    return (
      <MobileLayout title="Industry Insights" showBottomNav={true}>
        <PremiumGate />
      </MobileLayout>
    );
  }

  const sections = [
    revenueCycleData,
    chargemasterData, 
    overchargeSchemes,
    payerTactics,
    regulatoryFramework,
    priceBenchmarks,
    stateRegulations,
    insiderTips
  ];

  return (
    <MobileLayout title="Industry Insights" showBottomNav={true}>
      <div className="space-y-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/25"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Eye className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Industry Insider Intelligence
          </motion.h1>
          
          <motion.p 
            className="text-base text-gray-600 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Professional knowledge from revenue cycle veterans and industry experts
          </motion.p>
        </motion.div>

        {/* Main Content Sections */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSection === section.title;
            
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard 
                  className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setExpandedSection(isExpanded ? null : section.title)}
                  data-testid={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-6 mt-6"
                    >
                      {/* Revenue Cycle Content */}
                      {section.title === "Hospital Revenue Cycle 101" && (
                        <div className="space-y-6">
                          {revenueCycleData.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>
                                
                                {subsection.content && subsection.content.map((item, itemIndex) => (
                                  <div key={itemIndex} className="bg-white/60 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2">{item.stage || item.title}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{item.description || item.detail}</p>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                                      <div className="flex items-start space-x-2">
                                        <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-amber-800">Insider Tip: </span>
                                          <span className="text-sm text-amber-700">{item.insiderTip}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Your Leverage: </span>
                                          <span className="text-sm text-emerald-700">{item.leverage || item.actionable}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.insights && subsection.insights.map((insight, insightIndex) => (
                                  <div key={insightIndex} className="bg-white/60 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{insight.detail}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Action: </span>
                                          <span className="text-sm text-emerald-700">{insight.actionable}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Chargemaster Content */}
                      {section.title === "Chargemaster & Price Markup Secrets" && (
                        <div className="space-y-6">
                          {chargemasterData.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>

                                {subsection.content && subsection.content.map((item, itemIndex) => (
                                  <div key={itemIndex} className="bg-white/60 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2">{item.concept}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{item.explanation}</p>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-amber-800">Insider Knowledge: </span>
                                          <span className="text-sm text-amber-700">{item.insiderTip}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.markups && (
                                  <div className="grid gap-4">
                                    {subsection.markups.map((markup, markupIndex) => (
                                      <div key={markupIndex} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                          <h4 className="font-semibold text-gray-900">{markup.category}</h4>
                                          <span className="text-sm font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                                            {markup.typicalMarkup}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2"><strong>Example:</strong> {markup.example}</p>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                          <div className="flex items-start space-x-2">
                                            <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <span className="text-sm font-medium text-emerald-800">Challenge Strategy: </span>
                                              <span className="text-sm text-emerald-700">{markup.challenge}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {subsection.loopholes && (
                                  <div className="grid gap-4">
                                    {subsection.loopholes.map((loophole, loopholeIndex) => (
                                      <div key={loopholeIndex} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{loophole.title}</h4>
                                        <p className="text-sm text-gray-700 mb-3">{loophole.description}</p>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                          <div className="flex items-start space-x-2">
                                            <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <span className="text-sm font-medium text-emerald-800">Exploit: </span>
                                              <span className="text-sm text-emerald-700">{loophole.exploit}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Overcharge Schemes Content */}
                      {section.title === "Common Overcharge Schemes" && (
                        <div className="space-y-6">
                          {overchargeSchemes.schemes.map((scheme, schemeIndex) => {
                            const SchemeIconComponent = scheme.icon;
                            return (
                              <div key={schemeIndex} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3 mb-4">
                                  <SchemeIconComponent className="h-6 w-6 text-red-600 mt-1" />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="text-lg font-semibold text-gray-900">{scheme.title}</h3>
                                      <span className="text-sm font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                                        {scheme.avgOvercharge}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4">{scheme.description}</p>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 flex items-center">
                                      <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                                      Common Methods
                                    </h4>
                                    <ul className="space-y-2">
                                      {scheme.methods.map((method, methodIndex) => (
                                        <li key={methodIndex} className="text-sm text-gray-700 flex items-start">
                                          <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                          {method}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 flex items-center">
                                      <Search className="h-4 w-4 text-blue-600 mr-2" />
                                      Detection Tips
                                    </h4>
                                    <ul className="space-y-2">
                                      {scheme.detection.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="text-sm text-gray-700 flex items-start">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4">
                                  <div className="flex items-start space-x-2">
                                    <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="text-sm font-medium text-emerald-800">Challenge Strategy: </span>
                                      <span className="text-sm text-emerald-700">{scheme.challenge}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Payer Tactics Content */}
                      {section.title === "Insurance Payer Denial Tactics" && (
                        <div className="space-y-6">
                          {payerTactics.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>

                                {subsection.strategies && subsection.strategies.map((strategy, strategyIndex) => (
                                  <div key={strategyIndex} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{strategy.tactic}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{strategy.description}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Counter-Strategy: </span>
                                          <span className="text-sm text-emerald-700">{strategy.counterStrategy}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.tactics && subsection.tactics.map((tactic, tacticIndex) => (
                                  <div key={tacticIndex} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{tactic.method}</h4>
                                    <p className="text-sm text-gray-700 mb-3"><strong>Purpose:</strong> {tactic.purpose}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Response: </span>
                                          <span className="text-sm text-emerald-700">{tactic.response}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.levels && (
                                  <div className="grid gap-4">
                                    {subsection.levels.map((level, levelIndex) => (
                                      <div key={levelIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                          <h4 className="font-semibold text-gray-900">{level.level}</h4>
                                          <div className="text-right">
                                            <div className="text-sm text-blue-700 font-medium">Success Rate: {level.successRate}</div>
                                            <div className="text-xs text-blue-600">{level.timeline}</div>
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-700">{level.tips}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Regulatory Framework Content */}
                      {section.title === "No Surprises Act & Price Transparency Laws" && (
                        <div className="space-y-6">
                          {regulatoryFramework.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>

                                {subsection.protections && subsection.protections.map((protection, protectionIndex) => (
                                  <div key={protectionIndex} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{protection.protection}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{protection.detail}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Leverage: </span>
                                          <span className="text-sm text-emerald-700">{protection.leverage}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.requirements && subsection.requirements.map((requirement, requirementIndex) => (
                                  <div key={requirementIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{requirement.rule}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{requirement.detail}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Usage: </span>
                                          <span className="text-sm text-emerald-700">{requirement.usage}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.process && (
                                  <div className="space-y-3">
                                    {subsection.process.map((step, stepIndex) => (
                                      <div key={stepIndex} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{step.step}</h4>
                                        <p className="text-sm text-gray-700 mb-2">{step.detail}</p>
                                        {step.timeline && <p className="text-xs text-purple-600 mb-2"><strong>Timeline:</strong> {step.timeline}</p>}
                                        {step.strategy && (
                                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                                            <span className="text-sm font-medium text-amber-800">Strategy: </span>
                                            <span className="text-sm text-amber-700">{step.strategy}</span>
                                          </div>
                                        )}
                                        {step.outcome && (
                                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                            <span className="text-sm font-medium text-emerald-800">Outcome: </span>
                                            <span className="text-sm text-emerald-700">{step.outcome}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Price Benchmarks Content */}
                      {section.title === "Price Benchmarks & Market Analysis" && (
                        <div className="space-y-6">
                          {priceBenchmarks.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>

                                {subsection.benchmarks && (
                                  <div className="grid gap-4">
                                    {subsection.benchmarks.map((benchmark, benchmarkIndex) => (
                                      <div key={benchmarkIndex} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">{benchmark.service}</h4>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                          <div className="text-center p-2 bg-green-100 rounded">
                                            <div className="font-medium text-green-800">Medicare</div>
                                            <div className="text-green-600">{benchmark.medicareRate}</div>
                                          </div>
                                          <div className="text-center p-2 bg-red-100 rounded">
                                            <div className="font-medium text-red-800">Typical Charge</div>
                                            <div className="text-red-600">{benchmark.averageCharged}</div>
                                          </div>
                                          <div className="text-center p-2 bg-blue-100 rounded">
                                            <div className="font-medium text-blue-800">Fair Target</div>
                                            <div className="text-blue-600">{benchmark.fairNegotiation}</div>
                                          </div>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                          <div className="flex items-start space-x-2">
                                            <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-amber-700">{benchmark.notes}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {subsection.regions && (
                                  <div className="grid gap-4">
                                    {subsection.regions.map((region, regionIndex) => (
                                      <div key={regionIndex} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                          <h4 className="font-semibold text-gray-900">{region.region}</h4>
                                          <span className="text-sm font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                                            {region.costIndex}
                                          </span>
                                        </div>
                                        <div className="mb-3">
                                          <span className="text-sm font-medium text-gray-800">Key Factors: </span>
                                          <span className="text-sm text-gray-600">{region.factors.join(', ')}</span>
                                        </div>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                          <div className="flex items-start space-x-2">
                                            <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <span className="text-sm font-medium text-emerald-800">Strategy: </span>
                                              <span className="text-sm text-emerald-700">{region.strategy}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {subsection.factors && (
                                  <div className="space-y-3">
                                    {subsection.factors.map((factor, factorIndex) => (
                                      <div key={factorIndex} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{factor.factor}</h4>
                                        <p className="text-sm text-gray-700 mb-3"><strong>Impact:</strong> {factor.impact}</p>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                          <div className="flex items-start space-x-2">
                                            <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <span className="text-sm font-medium text-emerald-800">Leverage: </span>
                                              <span className="text-sm text-emerald-700">{factor.leverage}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* State Regulations Content */}
                      {section.title === "State-Level Patient Protection Laws" && (
                        <div className="space-y-6">
                          {stateRegulations.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>

                                {subsection.states && subsection.states.map((state, stateIndex) => (
                                  <div key={stateIndex} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <h4 className="font-semibold text-gray-900">{state.state}</h4>
                                      {state.keyLaw && (
                                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                                          {state.keyLaw}
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <span className="text-sm font-medium text-gray-800">Protections:</span>
                                        <ul className="mt-2 space-y-1">
                                          {state.protections.map((protection, protectionIndex) => (
                                            <li key={protectionIndex} className="text-sm text-gray-700 flex items-start">
                                              <CheckCircle className="h-3 w-3 text-green-600 mt-1 mr-2 flex-shrink-0" />
                                              {protection}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      {state.gaps && (
                                        <div>
                                          <span className="text-sm font-medium text-orange-800">Limitations:</span>
                                          <ul className="mt-2 space-y-1">
                                            {state.gaps.map((gap, gapIndex) => (
                                              <li key={gapIndex} className="text-sm text-orange-700 flex items-start">
                                                <AlertTriangle className="h-3 w-3 text-orange-600 mt-1 mr-2 flex-shrink-0" />
                                                {gap}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                        <div className="flex items-start space-x-2">
                                          <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <span className="text-sm font-medium text-emerald-800">Strategy: </span>
                                            <span className="text-sm text-emerald-700">{state.leverage || state.strategy}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.strategies && (
                                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Limited Protection State Strategies:</h4>
                                    <ul className="space-y-2">
                                      {subsection.strategies.map((strategy, strategyIndex) => (
                                        <li key={strategyIndex} className="text-sm text-gray-700 flex items-start">
                                          <Target className="h-3 w-3 text-orange-600 mt-1 mr-2 flex-shrink-0" />
                                          {strategy}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Industry Insider Tips Content */}
                      {section.title === "Industry Insider Professional Tips" && (
                        <div className="space-y-6">
                          {insiderTips.sections.map((subsection, subIndex) => {
                            const SubIconComponent = subsection.icon;
                            return (
                              <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <SubIconComponent className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                                </div>

                                {subsection.tips && subsection.tips.map((tip, tipIndex) => (
                                  <div key={tipIndex} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{tip.insight}</h4>
                                    <p className="text-sm text-gray-700 mb-3">{tip.detail}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Lightbulb className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Application: </span>
                                          <span className="text-sm text-emerald-700">{tip.application}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.tactics && subsection.tactics.map((tactic, tacticIndex) => (
                                  <div key={tacticIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{tactic.timing}</h4>
                                    <p className="text-sm text-gray-700 mb-3"><strong>Rationale:</strong> {tactic.rationale}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Strategy: </span>
                                          <span className="text-sm text-emerald-700">{tactic.strategy}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.strategies && subsection.strategies.map((strategy, strategyIndex) => (
                                  <div key={strategyIndex} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{strategy.document}</h4>
                                    <p className="text-sm text-gray-700 mb-3"><strong>Purpose:</strong> {strategy.purpose}</p>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                      <div className="flex items-start space-x-2">
                                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-emerald-800">Technique: </span>
                                          <span className="text-sm text-emerald-700">{strategy.technique}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {subsection.techniques && subsection.techniques.map((technique, techniqueIndex) => (
                                  <div key={techniqueIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">{technique.approach}</h4>
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                                        <div className="text-sm font-medium text-red-800 mb-1">❌ Wrong Approach:</div>
                                        <div className="text-sm text-red-700">"{technique.wrong}"</div>
                                      </div>
                                      <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                                        <div className="text-sm font-medium text-green-800 mb-1">✅ Right Approach:</div>
                                        <div className="text-sm text-green-700">"{technique.right}"</div>
                                      </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                      <div className="flex items-start space-x-2">
                                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <span className="text-sm font-medium text-blue-800">Why it works: </span>
                                          <span className="text-sm text-blue-700">{technique.why}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </MobileCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call-to-Action Footer */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Apply This Knowledge?</h3>
          <p className="text-sm text-gray-600 mb-4">Use our Bill AI tools to analyze your medical bills with this insider intelligence</p>
          <Link href="/bill-ai" data-testid="link-bill-ai">
            <MobileButton data-testid="button-analyze-bills">
              <Zap className="h-4 w-4 mr-2" />
              Analyze My Bills
            </MobileButton>
          </Link>
        </motion.div>
      </div>
    </MobileLayout>
  );
}