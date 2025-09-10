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
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const letterTemplates = [
  {
    title: "Billing Error Dispute Letter",
    description: "Professional template for disputing incorrect charges",
    template: `Dear Billing Department,

I am writing to formally dispute charges on my account #[ACCOUNT_NUMBER] for services received on [DATE].

After careful review of my itemized bill, I have identified the following discrepancies:

1. [SPECIFIC ERROR - e.g., "Room charge for 3 days when I was only admitted for 2 days"]
2. [SPECIFIC ERROR - e.g., "CPT code 12345 for procedure I did not receive"]
3. [SPECIFIC ERROR - e.g., "Duplicate charge for same surgical supplies"]

I request immediate correction of these errors. According to the Fair Credit Billing Act, you have 30 days to investigate and respond to this dispute.

Please send me:
- Updated itemized bill reflecting corrections
- Written explanation of any charges you believe are accurate
- Removal of these disputed amounts from any collection activities

I am committed to paying all legitimate charges promptly upon resolution.

Sincerely,
[YOUR NAME]
Account #: [ACCOUNT_NUMBER]
Date of Service: [DATE]`
  },
  {
    title: "Financial Hardship Request",
    description: "Template for requesting charity care or financial assistance",
    template: `Dear Patient Financial Services,

I am writing to request financial assistance for my medical bill (Account #[ACCOUNT_NUMBER]) in the amount of $[AMOUNT].

Due to [BRIEF EXPLANATION - unemployment, reduced income, medical expenses], I am unable to pay this amount in full. My current financial situation includes:

- Monthly Income: $[AMOUNT]
- Monthly Expenses: $[AMOUNT] 
- Dependents: [NUMBER]
- Other medical debt: $[AMOUNT]

I have attached documentation including:
- Recent pay stubs or unemployment benefits
- Tax return from previous year
- Bank statements showing current financial status

I respectfully request consideration for:
- Charity care write-off
- Significant discount based on financial need
- Extended payment plan with reduced monthly payments

I am committed to resolving this debt within my financial means and appreciate your assistance.

Thank you for your consideration.

Sincerely,
[YOUR NAME]
[CONTACT INFORMATION]`
  },
  {
    title: "Payment Plan Request",
    description: "Template for negotiating manageable payment terms",
    template: `Dear Billing Department,

I am writing regarding my medical bill for $[AMOUNT] (Account #[ACCOUNT_NUMBER]).

While I acknowledge this debt and intend to pay in full, I request a payment plan that fits my current financial situation. Based on my budget analysis, I can afford $[MONTHLY_AMOUNT] per month.

This payment plan would resolve the full balance in [NUMBER] months. I believe this arrangement benefits both parties by:
- Ensuring consistent monthly payments
- Avoiding collection costs and fees
- Maintaining positive patient relationship

I request this arrangement include:
- No additional fees or interest charges
- Written confirmation of payment terms
- Removal from any collection activities during compliance
- Positive reporting to credit bureaus upon completion

Please send written confirmation of this payment arrangement. I am ready to begin payments immediately upon agreement.

Sincerely,
[YOUR NAME]
Phone: [PHONE]
Email: [EMAIL]`
  }
];

const caseStudies = [
  {
    title: "Emergency Room Overbilling",
    originalBill: "$28,450",
    finalAmount: "$8,200",
    savings: "$20,250",
    strategy: "Error detection + Medicare rate negotiation",
    details: "Patient found duplicate lab charges, incorrect facility fee level, and unbundled procedures. Used Medicare rates as benchmark for negotiation.",
    timeline: "45 days"
  },
  {
    title: "Surgical Procedure Dispute",
    originalBill: "$45,600", 
    finalAmount: "$12,800",
    savings: "$32,800",
    strategy: "Insurance appeal + financial hardship",
    details: "Insurance initially denied coverage. Successful appeal combined with 70% financial hardship discount based on income documentation.",
    timeline: "90 days"
  },
  {
    title: "Outpatient Facility Fee Challenge", 
    originalBill: "$15,900",
    finalAmount: "$4,200",
    savings: "$11,700", 
    strategy: "Billing error identification + negotiation",
    details: "Hospital incorrectly charged inpatient facility fee for outpatient procedure. Negotiated remaining balance using charity care program.",
    timeline: "30 days"
  }
];

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
          className="w-16 h-16 bg-gradient-to-br from-red-400 via-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Crown className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Medical Bill Best Practices
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Advanced strategies and insider tactics to reduce your medical bills by thousands
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <MobileCard className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 mb-6">
            <div className="text-center">
              <Lock className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-red-900 mb-2">Premium Content</h3>
              <p className="text-sm text-red-700 mb-4 leading-relaxed">
                Access proven strategies that have saved users an average of $8,500 per medical bill
              </p>
              <div className="space-y-2 text-left text-sm text-red-800">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-red-600" />
                  <span>Professional dispute letter templates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-red-600" />
                  <span>Hospital negotiation scripts that work</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-red-600" />
                  <span>Real case studies with $20k+ savings</span>
                </div>
              </div>
            </div>
          </MobileCard>

          <Link href="/premium">
            <MobileButton size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Premium
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function BillBestPractices() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const copyTemplate = async (template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      toast({
        title: "Template Copied!",
        description: "Letter template copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the template text",
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
            <TrendingDown className="h-8 w-8 text-white" />
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
            className="text-base text-gray-600 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Proven strategies from billing experts that have saved patients over $2.3 million
          </motion.p>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <MobileCard className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-emerald-800">Proven Results</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-emerald-900">$8,500</div>
                  <div className="text-xs text-emerald-700">Average Savings</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-900">89%</div>
                  <div className="text-xs text-emerald-700">Success Rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-900">45 days</div>
                  <div className="text-xs text-emerald-700">Avg. Resolution</div>
                </div>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        {/* Strategic Approaches */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Advanced Reduction Strategies
          </h2>
          
          {practiceStrategies.map((strategy, index) => {
            const IconComponent = strategy.icon;
            const isExpanded = expandedStrategy === strategy.id;
            
            return (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard className={`bg-gradient-to-r from-${strategy.color}-50/80 to-${strategy.color}-100/80 border-${strategy.color}-200 hover:shadow-lg transition-all`}>
                  <div 
                    className="cursor-pointer"
                    onClick={() => setExpandedStrategy(isExpanded ? null : strategy.id)}
                    data-testid={`strategy-${strategy.id}`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`w-10 h-10 bg-${strategy.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`h-5 w-5 text-${strategy.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-sm">{strategy.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${strategy.color}-200 text-${strategy.color}-800`}>
                            {strategy.savings}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{strategy.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-4 mt-4"
                    >
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Step-by-Step Process:</h4>
                          <div className="space-y-2">
                            {strategy.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start space-x-2">
                                <span className={`w-5 h-5 bg-${strategy.color}-200 text-${strategy.color}-800 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 flex-shrink-0`}>
                                  {stepIndex + 1}
                                </span>
                                <span className="text-xs text-gray-700">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Insider Tips:</h4>
                          <div className="space-y-1">
                            {strategy.tips.map((tip, tipIndex) => (
                              <div key={tipIndex} className="flex items-start space-x-2">
                                <Star className={`h-3 w-3 text-${strategy.color}-600 mt-1 flex-shrink-0`} />
                                <span className="text-xs text-gray-700">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </MobileCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Letter Templates */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Professional Letter Templates
          </h2>
          
          {letterTemplates.map((template, index) => {
            const isExpanded = expandedTemplate === template.title;
            
            return (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-200">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setExpandedTemplate(isExpanded ? null : template.title)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{template.title}</h3>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">{template.description}</p>
                  </div>
                  
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-4 mt-4"
                    >
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                          {template.template}
                        </pre>
                      </div>
                      <div className="flex justify-center mt-3">
                        <MobileButton
                          variant="secondary" 
                          size="sm"
                          onClick={() => copyTemplate(template.template)}
                          data-testid={`copy-template-${index}`}
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

        {/* Case Studies */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Real Success Stories
          </h2>
          
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
            >
              <MobileCard className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-gray-900 text-sm">{study.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-gray-600">Original</div>
                      <div className="font-bold text-red-600">{study.originalBill}</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-gray-600">Final</div>
                      <div className="font-bold text-green-600">{study.finalAmount}</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-gray-600">Saved</div>
                      <div className="font-bold text-emerald-600">{study.savings}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-800">Strategy: </span>
                      <span className="text-xs text-gray-700">{study.strategy}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-800">Timeline: </span>
                      <span className="text-xs text-gray-700">{study.timeline}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-800">Details: </span>
                      <span className="text-xs text-gray-700">{study.details}</span>
                    </div>
                  </div>
                </div>
              </MobileCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
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