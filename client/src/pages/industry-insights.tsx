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
  Info
} from "lucide-react";

const insiderSecrets = [
  {
    id: "billing-psychology",
    title: "Hospital Billing Department Psychology",
    icon: Brain,
    color: "purple",
    category: "Department Operations",
    description: "Understanding how billing staff think and operate to your advantage",
    insights: [
      {
        title: "Performance Metrics Drive Behavior",
        detail: "Billing staff are measured on collection rates, not patient satisfaction. They have quotas to meet and bonuses tied to recoveries.",
        actionable: "Use this knowledge - emphasize your willingness to pay (just not the full amount) to make them want to work with you."
      },
      {
        title: "Authority Levels Matter",
        detail: "Front-line staff can only discount 10-15%. Patient Financial Counselors can go up to 30%. Managers can authorize 50-70% reductions.",
        actionable: "Always ask to be escalated: 'I'd like to speak with someone who has authority to resolve this matter today.'"
      },
      {
        title: "End-of-Month Pressure",
        detail: "Billing departments have monthly collection targets. Last week of each month, they're more flexible on negotiations.",
        actionable: "Time your calls for the 25th-31st of each month when they need to hit their numbers."
      },
      {
        title: "Documentation Requirements",
        detail: "Any discount over $500 requires supervisor approval and documentation. Staff hate paperwork and will often find easier solutions.",
        actionable: "When asking for large reductions, also suggest smaller amounts to give them an 'easy win' option."
      }
    ]
  },
  {
    id: "seasonal-patterns",
    title: "Hospital Revenue Cycle Timing",
    icon: Calendar,
    color: "blue", 
    category: "Strategic Timing",
    description: "When hospitals need money most and are willing to negotiate",
    insights: [
      {
        title: "Fiscal Year-End Desperation",
        detail: "Most hospitals end fiscal year in December or March. They need to show revenue before year-end reporting.",
        actionable: "November-December and February-March are ideal times for aggressive negotiations. They'll take 40-60% just to close the books."
      },
      {
        title: "Summer Slowdown",
        detail: "June-August see reduced procedure volume. Hospitals are cash-flow conscious and more willing to collect something vs. nothing.",
        actionable: "Summer months are perfect for payment plan negotiations and charity care applications."
      },
      {
        title: "Insurance Deductible Cycles", 
        detail: "January-March: patients haven't met deductibles yet. October-December: patients have hit out-of-pocket maximums.",
        actionable: "Early year = focus on insurance appeals. Late year = negotiate knowing insurance won't help anymore."
      },
      {
        title: "Holiday Collection Pause",
        detail: "Mid-November through early January, most aggressive collection activities pause due to 'holiday courtesy policies.'",
        actionable: "Use November-December to prepare your documentation and strategy without pressure from collections."
      }
    ]
  },
  {
    id: "regulatory-leverage",
    title: "Regulatory Requirements Hospitals Must Follow",
    icon: Shield,
    color: "green",
    category: "Legal Compliance",
    description: "Federal and state laws that work in your favor",
    insights: [
      {
        title: "Charity Care Mandates",
        detail: "Nonprofit hospitals (60% of all hospitals) must provide charity care to maintain tax-exempt status. They're required to have financial assistance policies.",
        actionable: "Always ask: 'What is your charity care policy?' Even if you don't qualify, it opens negotiation channels."
      },
      {
        title: "Price Transparency Rules",
        detail: "Since 2021, hospitals must publish their chargemaster rates online. Most patients don't know this exists.",
        actionable: "Look up their published rates online before calling. Use the data to challenge excessive charges."
      },
      {
        title: "Reasonable Payment Plan Requirements",
        detail: "Most states require hospitals to accept 'reasonable' payment plans. Courts have defined this as low as $25/month for large debts.",
        actionable: "Offer very low monthly payments ($25-$50). They legally cannot refuse if you demonstrate financial need."
      },
      {
        title: "Collection Agency Restrictions",
        detail: "Hospitals cannot report to credit bureaus or send to collections for 120 days after first bill. Many violate this rule.",
        actionable: "If they threaten collections within 120 days, remind them of FDCPA violations. They'll often settle immediately."
      }
    ]
  },
  {
    id: "insurance-tactics",
    title: "Insurance Company Denial Strategies",
    icon: FileX,
    color: "red",
    category: "Insurance Psychology", 
    description: "Why insurance companies deny claims and how to counter their tactics",
    insights: [
      {
        title: "Deny First, Pay Later Philosophy",
        detail: "Insurance companies automatically deny 10-15% of all claims hoping patients won't appeal. Only 3% of denials are ever appealed.",
        actionable: "Always appeal every denial. Use the phrase: 'I'm formally requesting a peer-to-peer review with a physician in the same specialty.'"
      },
      {
        title: "Prior Authorization Games",
        detail: "Insurance requires prior auth for expensive procedures, then claims they never received it or it wasn't specific enough.",
        actionable: "Always get prior auth confirmation numbers in writing. When they deny, reference the specific confirmation number."
      },
      {
        title: "Medical Necessity Challenges",
        detail: "Insurance physicians (who often haven't practiced in years) override treating physician decisions to save money.",
        actionable: "Request the specific medical criteria they used for denial. Often they can't produce it or it's outdated."
      },
      {
        title: "Network Status Tricks",
        detail: "Insurance will claim providers were 'out of network' even when their own directory showed them as in-network.",
        actionable: "Take screenshots of provider directory entries showing in-network status before treatment. Use as evidence in appeals."
      }
    ]
  }
];

const overchargePatterns = [
  {
    title: "Emergency Room Facility Fee Inflation",
    description: "Hospitals charge different 'levels' of emergency room visits (Level 1-5). They often upcode to higher levels than justified.",
    redFlags: [
      "Level 4-5 charges for minor conditions",
      "Same visit coded differently than similar past visits", 
      "No documentation of vital sign abnormalities for high-level codes"
    ],
    avgOvercharge: "$2,800-$4,500",
    howToChallenge: "Request medical records showing vital signs, acuity level documentation, and compare with CMS guidelines for ER coding."
  },
  {
    title: "Operating Room Time Manipulation",
    description: "Surgical facilities charge by 15-minute increments. They often round up aggressively or charge for prep time you weren't in the OR.",
    redFlags: [
      "OR time that doesn't match anesthesia records",
      "Charges for time before you were actually in the OR",
      "Multiple 'room' charges for same procedure"
    ],
    avgOvercharge: "$1,200-$3,800",
    howToChallenge: "Request detailed anesthesia records showing actual start/stop times. Challenge any discrepancies in time documentation."
  },
  {
    title: "Implant and Supply Markups",
    description: "Hospitals mark up medical devices 200-400% above cost. They also charge for opened supplies never used on patient.",
    redFlags: [
      "Device charges much higher than online prices",
      "Multiple devices for simple procedures",
      "Supply charges for items not documented in medical record"
    ],
    avgOvercharge: "$5,000-$15,000",
    howToChallenge: "Ask for itemized list of all implants and supplies used. Compare costs with Medicare allowable amounts and manufacturer wholesale prices."
  },
  {
    title: "Pharmacy Dispensing Fees",
    description: "Hospital pharmacies charge separate 'dispensing fees' for each medication, even over-the-counter items they stock.",
    redFlags: [
      "Separate dispensing fees for each pill",
      "$50+ charges for basic medications like Tylenol",
      "Pharmacy fees when you brought your own medications"
    ],
    avgOvercharge: "$800-$2,200",
    howToChallenge: "Question why simple medications require separate pharmacy fees. Request breakdown of actual pharmacy services provided."
  }
];

const timingStrategies = [
  {
    period: "January - March",
    hospitalMindset: "New fiscal budgets, deductible reset pressure",
    patientAdvantage: "Insurance appeals most effective",
    strategies: [
      "Focus on insurance company appeals while deductibles reset",
      "Hospitals less aggressive on collections (post-holiday courtesy)",
      "Good time to apply for charity care programs (new year funding)",
      "Use Medicare rates as comparison benchmark"
    ]
  },
  {
    period: "April - June", 
    hospitalMindset: "Mid-year budget assessments, Q1 revenue analysis",
    patientAdvantage: "Moderate negotiation leverage",
    strategies: [
      "Standard negotiation tactics work well",
      "Payment plan requests usually approved",
      "Good time for financial hardship applications",
      "Hospital staff less stressed, more helpful"
    ]
  },
  {
    period: "July - September",
    hospitalMindset: "Summer procedure slowdown, cash flow concerns",
    patientAdvantage: "Strong position for payment plans",
    strategies: [
      "Emphasize immediate payment capability for discounts",
      "Charity care applications processed faster",
      "Staff have more time for detailed negotiations",
      "Perfect time for low monthly payment plans"
    ]
  },
  {
    period: "October - December",
    hospitalMindset: "Year-end revenue push, budget reconciliation pressure",
    patientAdvantage: "Maximum negotiation leverage",
    strategies: [
      "Most aggressive discount requests (up to 70%)",
      "Immediate payment offers get best response",
      "End-of-year tax considerations benefit patients",
      "Staff have authority to close deals quickly"
    ]
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
          Secret knowledge from billing department veterans and industry insiders
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <MobileCard className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 mb-6">
            <div className="text-center">
              <Lock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Premium Content</h3>
              <p className="text-sm text-purple-700 mb-4 leading-relaxed">
                Exclusive insider knowledge that hospitals don't want you to know
              </p>
              <div className="space-y-2 text-left text-sm text-purple-800">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Hospital billing psychology and pressure points</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Seasonal timing strategies for maximum leverage</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Common overcharge patterns and detection methods</span>
                </div>
              </div>
            </div>
          </MobileCard>

          <Link href="/premium">
            <MobileButton size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
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

export default function IndustryInsights() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

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
            Industry Insider Insights
          </motion.h1>
          
          <motion.p 
            className="text-base text-gray-600 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Secret knowledge from 20+ year billing department veterans
          </motion.p>
        </motion.div>

        {/* Insider Knowledge */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Behind-the-Scenes Intelligence
          </h2>
          
          {insiderSecrets.map((secret, index) => {
            const IconComponent = secret.icon;
            const isExpanded = expandedInsight === secret.id;
            
            return (
              <motion.div
                key={secret.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard className={`bg-gradient-to-r from-${secret.color}-50/80 to-${secret.color}-100/80 border-${secret.color}-200 hover:shadow-lg transition-all`}>
                  <div 
                    className="cursor-pointer"
                    onClick={() => setExpandedInsight(isExpanded ? null : secret.id)}
                    data-testid={`insight-${secret.id}`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`w-10 h-10 bg-${secret.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`h-5 w-5 text-${secret.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-sm">{secret.title}</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${secret.color}-200 text-${secret.color}-800`}>
                            {secret.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{secret.description}</p>
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
                        {secret.insights.map((insight, insightIndex) => (
                          <div key={insightIndex} className="bg-white/50 rounded-lg p-3 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                              <Lightbulb className={`h-4 w-4 text-${secret.color}-600 mr-2`} />
                              {insight.title}
                            </h4>
                            <p className="text-xs text-gray-700 mb-2 leading-relaxed">{insight.detail}</p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                              <div className="flex items-start space-x-2">
                                <Target className="h-3 w-3 text-emerald-600 mt-1 flex-shrink-0" />
                                <div>
                                  <span className="text-xs font-medium text-emerald-800">Action: </span>
                                  <span className="text-xs text-emerald-700">{insight.actionable}</span>
                                </div>
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
          })}
        </motion.div>

        {/* Overcharge Patterns */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Common Overcharge Patterns
          </h2>
          
          {overchargePatterns.map((pattern, index) => {
            const isExpanded = expandedPattern === pattern.title;
            
            return (
              <motion.div
                key={pattern.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard className="bg-gradient-to-r from-orange-50/80 to-red-50/80 border-orange-200">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setExpandedPattern(isExpanded ? null : pattern.title)}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-sm">{pattern.title}</h3>
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-200 text-red-800">
                            {pattern.avgOvercharge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{pattern.description}</p>
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
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
                            Red Flags to Look For:
                          </h4>
                          <div className="space-y-1">
                            {pattern.redFlags.map((flag, flagIndex) => (
                              <div key={flagIndex} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-xs text-gray-700">{flag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center">
                            <Zap className="h-4 w-4 text-blue-600 mr-2" />
                            How to Challenge:
                          </h4>
                          <p className="text-xs text-blue-800 leading-relaxed">{pattern.howToChallenge}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </MobileCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Seasonal Timing Strategies */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Strategic Timing Calendar
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {timingStrategies.map((timing, index) => (
              <motion.div
                key={timing.period}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border-teal-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-teal-600" />
                      <h3 className="font-bold text-gray-900 text-sm">{timing.period}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-white/50 rounded-lg p-2">
                        <div className="flex items-start space-x-2 mb-1">
                          <Building2 className="h-3 w-3 text-gray-600 mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-gray-800">Hospital Mindset: </span>
                            <span className="text-xs text-gray-700">{timing.hospitalMindset}</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Users className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-green-800">Your Advantage: </span>
                            <span className="text-xs text-green-700">{timing.patientAdvantage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs mb-2">Recommended Strategies:</h4>
                      <div className="space-y-1">
                        {timing.strategies.map((strategy, strategyIndex) => (
                          <div key={strategyIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-3 w-3 text-teal-600 mt-1 flex-shrink-0" />
                            <span className="text-xs text-gray-700">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MobileCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Takeaways */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <MobileCard className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-900 text-sm">Master These Principles</h3>
              </div>
              
              <div className="space-y-2 text-xs text-emerald-800">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Hospital staff work on commission-like metrics - use this to motivate cooperation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Timing is everything - fiscal pressures create negotiation windows</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Regulatory compliance gives you legal leverage - hospitals fear violations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Insurance denials are often profit-driven - systematic appeals work</span>
                </div>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Apply This Knowledge
          </h2>
          
          <Link href="/bill-ai">
            <MobileButton className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" size="lg">
              <Eye className="h-5 w-5 mr-2" />
              Analyze Your Bill Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/bill-best-practices">
            <MobileButton className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700" size="lg">
              <Target className="h-5 w-5 mr-2" />
              Best Practices Guide
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </motion.div>

      </div>
    </MobileLayout>
  );
}