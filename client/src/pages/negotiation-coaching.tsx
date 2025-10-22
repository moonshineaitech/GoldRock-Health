import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { PremiumPaywallOverlay } from "@/components/premium-paywall-overlay";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Phone, 
  FileText, 
  Target, 
  Crown,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Building2,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  Award,
  Brain,
  Timer,
  Zap,
  Heart,
  Lightbulb,
  Eye,
  Calculator,
  FileCheck,
  PhoneCall,
  Mail,
  ClipboardList,
  HandCoins,
  UserCheck,
  Receipt,
  Scale,
  Gavel,
  Percent,
  LineChart,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Play,
  RotateCcw,
  Download,
  Send,
  Volume2,
  Headphones,
  Mic,
  VideoIcon,
  FileEdit,
  Search,
  Filter,
  BookOpen,
  Map,
  Compass,
  Briefcase,
  Database,
  Activity,
  BarChart3,
  TrendingDown,
  ExternalLink,
  Lock,
  Unlock,
  Plus,
  Minus,
  Settings,
  RefreshCw,
  Upload,
  Camera,
  Paperclip,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Link } from "wouter";

// Helper function for copying text to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy to clipboard:', e);
    return false;
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

// Negotiation scenarios data
const negotiationScenarios = [
  {
    id: "emergency-room",
    title: "Emergency Room Bills",
    icon: AlertTriangle,
    description: "High-stakes ER billing negotiations",
    averageSavings: "$15,000",
    successRate: "87%",
    difficulty: "Advanced",
    gradient: "from-red-500 to-orange-500",
    scenarios: ["Out-of-network emergency", "Level 5 coding disputes", "Facility vs. physician billing"],
    keyTactics: ["Emergency exception clauses", "Good Samaritan law arguments", "Medical necessity challenges"]
  },
  {
    id: "surgical-bills",
    title: "Surgery & Procedures",
    icon: FileCheck,
    description: "Complex surgical billing disputes",
    averageSavings: "$25,000",
    successRate: "92%", 
    difficulty: "Expert",
    gradient: "from-blue-500 to-purple-500",
    scenarios: ["OR time overcharges", "Surgical supply markups", "Anesthesia billing errors"],
    keyTactics: ["CPT bundling violations", "Time documentation disputes", "Supply utilization audits"]
  },
  {
    id: "hospital-stays",
    title: "Hospital Admissions",
    icon: Building2,
    description: "Multi-day hospital bill negotiations",
    averageSavings: "$12,000",
    successRate: "89%",
    difficulty: "Intermediate",
    gradient: "from-emerald-500 to-teal-500",
    scenarios: ["Room rate negotiations", "Daily charges audit", "Discharge timing disputes"],
    keyTactics: ["Medicare rate comparisons", "Length of stay justification", "Service bundling challenges"]
  },
  {
    id: "insurance-appeals",
    title: "Insurance Claim Appeals",
    icon: Shield,
    description: "Fighting insurance denials",
    averageSavings: "$8,500",
    successRate: "76%",
    difficulty: "Intermediate", 
    gradient: "from-cyan-500 to-blue-500",
    scenarios: ["Prior authorization denials", "Medical necessity appeals", "Out-of-network disputes"],
    keyTactics: ["Medical literature citations", "Peer review requests", "External review processes"]
  },
  {
    id: "charity-care",
    title: "Financial Assistance",
    icon: Heart,
    description: "Charity care and payment plans",
    averageSavings: "$18,000",
    successRate: "94%",
    difficulty: "Beginner",
    gradient: "from-pink-500 to-rose-500",
    scenarios: ["Charity care applications", "Payment plan negotiations", "Financial hardship documentation"],
    keyTactics: ["Income documentation strategy", "Hardship narrative crafting", "Policy compliance requirements"]
  },
  {
    id: "provider-disputes",
    title: "Provider Billing Errors",
    icon: Receipt,
    description: "Direct provider negotiations",
    averageSavings: "$6,800",
    successRate: "91%",
    difficulty: "Beginner",
    gradient: "from-amber-500 to-yellow-500",
    scenarios: ["Duplicate billing", "Service date errors", "Coding mismatches"],
    keyTactics: ["Documentation comparison", "Medical record correlation", "Billing timeline analysis"]
  }
];

// Interactive coaching system data
const coachingModules = {
  "emergency-room": {
    title: "Emergency Room Bill Mastery",
    phases: [
      {
        title: "Initial Assessment",
        duration: "5-10 minutes",
        steps: [
          "Gather all ER documentation and bills",
          "Identify emergency vs. non-emergency services",
          "Review insurance coverage and exclusions",
          "Calculate baseline negotiation targets"
        ]
      },
      {
        title: "Strategic Preparation",
        duration: "15-20 minutes", 
        steps: [
          "Research hospital's charity care policy",
          "Document emergency circumstances",
          "Prepare alternative payment scenarios",
          "Identify coding and billing vulnerabilities"
        ]
      },
      {
        title: "Negotiation Execution",
        duration: "30-45 minutes",
        steps: [
          "Make initial contact with patient advocate",
          "Present emergency circumstances clearly",
          "Challenge specific line items systematically",
          "Negotiate final settlement terms"
        ]
      }
    ],
    scripts: {
      opening: "Hi, I'm calling regarding my emergency room bill dated [DATE] for account #[ACCOUNT]. I need to speak with someone who has authority to adjust billing for emergency circumstances.",
      objections: [
        {
          objection: "We don't typically adjust emergency room bills",
          response: "I understand that's your standard policy, but emergency situations fall under different regulations. Can you transfer me to your patient advocate or someone familiar with emergency billing exceptions?"
        },
        {
          objection: "You received the services, so payment is required",
          response: "I absolutely want to pay for legitimate services received. However, I've identified several billing discrepancies that need to be reviewed before payment. Can we go through the itemized charges together?"
        }
      ]
    }
  },
  "surgical-bills": {
    title: "Surgical Bill Negotiation Expert",
    phases: [
      {
        title: "Pre-Negotiation Analysis",
        duration: "20-30 minutes",
        steps: [
          "Obtain complete operative reports",
          "Cross-reference CPT codes with actual procedures",
          "Identify surgical supply overcharges",
          "Calculate Medicare benchmark rates"
        ]
      },
      {
        title: "Documentation Review",
        duration: "25-35 minutes",
        steps: [
          "Verify OR time against anesthesia records",
          "Audit surgical supply usage claims",
          "Check for bundling violations",
          "Prepare cost comparison analysis"
        ]
      },
      {
        title: "Professional Negotiation",
        duration: "45-60 minutes",
        steps: [
          "Contact surgical billing manager directly",
          "Present detailed billing analysis",
          "Propose evidence-based adjustments",
          "Finalize written settlement agreement"
        ]
      }
    ],
    scripts: {
      opening: "I'm calling to discuss my surgical bill dated [DATE]. I've completed a detailed analysis and identified significant discrepancies that need immediate attention. Can you connect me with your surgical billing manager?",
      objections: [
        {
          objection: "All surgical charges are standard rates",
          response: "I appreciate that these may be your standard charges, but several items don't align with the actual procedure performed. I have the operative report here, and I'd like to review specific discrepancies with you."
        },
        {
          objection: "Surgical supplies are charged based on what's opened, not used",
          response: "I understand that policy, but charging for unopened supplies that weren't medically necessary violates Medicare guidelines. Can we review which supplies were actually documented as used during my procedure?"
        }
      ]
    }
  }
};

// Hospital-specific negotiation tactics database
const hospitalTactics = {
  "large-systems": {
    name: "Large Hospital Systems",
    characteristics: [
      "Standardized billing processes",
      "Limited front-line negotiation authority", 
      "Corporate escalation procedures",
      "Charity care programs well-established"
    ],
    strengths: ["Resources for payment plans", "Established appeal processes"],
    weaknesses: ["Bureaucratic delays", "Inflexible initial positions"],
    tactics: [
      "Request escalation to patient advocate immediately",
      "Reference specific corporate charity care policies",
      "Use Medicare rate comparisons for leverage",
      "Emphasize potential bad debt write-off costs"
    ]
  },
  "independent-hospitals": {
    name: "Independent Hospitals",
    characteristics: [
      "More flexible billing policies",
      "Direct access to decision makers",
      "Local community relationships",
      "Financial pressure awareness"
    ],
    strengths: ["Personal relationships matter", "Faster decision making"],
    weaknesses: ["Inconsistent policies", "Limited resources"],
    tactics: [
      "Build rapport with billing manager",
      "Emphasize local community ties",
      "Propose win-win settlement scenarios",
      "Reference competitive hospital rates"
    ]
  }
};

// Real-time objection handlers
const objectionHandlers = [
  {
    category: "Payment Required",
    objection: "You received the services, so you must pay",
    responses: [
      {
        level: "Professional",
        response: "I absolutely agree that payment is due for legitimate services. However, I've identified billing errors that need correction first. Can we review the itemized charges together?"
      },
      {
        level: "Assertive", 
        response: "I'm committed to paying for services actually received at fair market rates. The current bill contains overcharges that violate Medicare billing guidelines. I need these corrected before payment."
      },
      {
        level: "Legal",
        response: "I understand your position, but billing inaccuracies constitute fraudulent charges under federal healthcare regulations. I'm willing to pay legitimate charges once the bill is corrected."
      }
    ]
  },
  {
    category: "No Negotiation Policy",
    objection: "We don't negotiate medical bills",
    responses: [
      {
        level: "Professional",
        response: "I appreciate that you have standard policies. However, I'm not asking for a discount - I'm requesting correction of billing errors and application of your published charity care policy."
      },
      {
        level: "Assertive",
        response: "Every hospital negotiates bills when presented with documentation of billing errors or financial hardship. Can you transfer me to someone with authority to review billing adjustments?"
      },
      {
        level: "Legal",
        response: "Under federal regulations, you're required to have charity care policies and billing error correction procedures. I need to speak with your patient advocate about implementing these required processes."
      }
    ]
  }
];

// Success tracking system
const successMetrics = {
  averageReduction: 67,
  totalSaved: 127489,
  successfulNegotiations: 89,
  timeToResolution: 12,
  userSatisfaction: 4.8
};

// Professional coaching component
function ProfessionalCoaching({ scenario }: { scenario: string }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showScript, setShowScript] = useState(false);
  const { toast } = useToast();

  const module = coachingModules[scenario as keyof typeof coachingModules];
  
  if (!module) return null;

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      toast({
        title: "Step Completed!",
        description: "Great progress on your negotiation preparation.",
      });
    }
  };

  const copyScript = async (script: string) => {
    const success = await copyToClipboard(script);
    if (success) {
      toast({
        title: "Script Copied!",
        description: "Paste this into your notes for the call.",
      });
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress Indicator */}
      <MobileCard className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-900" data-testid="text-coaching-title">
            {module.title}
          </h3>
          <div className="text-sm text-purple-600 font-medium">
            Phase {currentPhase + 1} of {module.phases.length}
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          {module.phases.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                index <= currentPhase ? 'bg-purple-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-900 mb-1">
            {Math.round(((currentPhase + 1) / module.phases.length) * 100)}%
          </div>
          <div className="text-sm text-purple-600">Coaching Progress</div>
        </div>
      </MobileCard>

      {/* Current Phase */}
      <MobileCard>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900" data-testid={`text-phase-title-${currentPhase}`}>
              {module.phases[currentPhase].title}
            </h4>
            <p className="text-sm text-gray-600">
              Duration: {module.phases[currentPhase].duration}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {module.phases[currentPhase].steps.map((step, index) => {
            const stepId = currentPhase * 100 + index;
            const isCompleted = completedSteps.includes(stepId);
            
            return (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  isCompleted 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStepComplete(stepId)}
                data-testid={`step-${currentPhase}-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    )}
                  </div>
                  <p className={`flex-1 ${isCompleted ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>
                    {step}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Phase Navigation */}
        <div className="flex space-x-3 mt-6">
          <MobileButton
            variant="secondary"
            onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
            disabled={currentPhase === 0}
            className="flex-1"
            data-testid="button-previous-phase"
          >
            Previous Phase
          </MobileButton>
          <MobileButton
            onClick={() => setCurrentPhase(Math.min(module.phases.length - 1, currentPhase + 1))}
            disabled={currentPhase === module.phases.length - 1}
            className="flex-1"
            data-testid="button-next-phase"
          >
            Next Phase
          </MobileButton>
        </div>
      </MobileCard>

      {/* Negotiation Scripts */}
      <MobileCard>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Professional Scripts</h4>
          <MobileButton
            variant="ghost"
            size="sm"
            onClick={() => setShowScript(!showScript)}
            data-testid="button-toggle-scripts"
          >
            {showScript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </MobileButton>
        </div>

        <AnimatePresence>
          {showScript && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {/* Opening Script */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-blue-900">Opening Script</h5>
                  <MobileButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyScript(module.scripts.opening)}
                    data-testid="button-copy-opening-script"
                  >
                    <Copy className="h-4 w-4" />
                  </MobileButton>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {module.scripts.opening}
                </p>
              </div>

              {/* Objection Handlers */}
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900">Common Objections & Responses</h5>
                {module.scripts.objections.map((item, index) => (
                  <div key={index} className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="mb-2">
                      <span className="font-medium text-amber-900">Objection:</span>
                      <p className="text-amber-700 text-sm italic">"{item.objection}"</p>
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-amber-900">Response:</span>
                        <p className="text-amber-700 text-sm">"{item.response}"</p>
                      </div>
                      <MobileButton
                        variant="ghost"
                        size="sm"
                        onClick={() => copyScript(item.response)}
                        data-testid={`button-copy-objection-${index}`}
                      >
                        <Copy className="h-4 w-4" />
                      </MobileButton>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobileCard>
    </motion.div>
  );
}

// Scenario selector component
function ScenarioSelector({ 
  selectedScenario, 
  onScenarioSelect 
}: { 
  selectedScenario: string; 
  onScenarioSelect: (scenario: string) => void; 
}) {
  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-scenario-selector-title">
          Choose Your Negotiation Scenario
        </h2>
        <p className="text-gray-600">
          Select the type of medical bill you need help negotiating
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {negotiationScenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenario === scenario.id;
          
          return (
            <motion.div
              key={scenario.id}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <MobileCard
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onScenarioSelect(scenario.id)}
                data-testid={`scenario-card-${scenario.id}`}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${scenario.gradient} opacity-10 rounded-bl-3xl`} />
                
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${scenario.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{scenario.title}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scenario.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        scenario.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {scenario.difficulty}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{scenario.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                        <span className="text-gray-700">Avg: {scenario.averageSavings}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{scenario.successRate} success</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </MobileCard>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Success tracker component
function SuccessTracker() {
  return (
    <MobileCard className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2" data-testid="text-success-tracker-title">
          Your Success Metrics
        </h3>
        <p className="text-emerald-700 text-sm">
          Track your negotiation progress and savings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white/50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-900 mb-1" data-testid="text-total-saved">
            ${successMetrics.totalSaved.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600">Total Saved</div>
        </div>
        
        <div className="text-center p-4 bg-white/50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-900 mb-1" data-testid="text-success-rate">
            {successMetrics.averageReduction}%
          </div>
          <div className="text-xs text-emerald-600">Avg Reduction</div>
        </div>
        
        <div className="text-center p-4 bg-white/50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-900 mb-1" data-testid="text-successful-negotiations">
            {successMetrics.successfulNegotiations}
          </div>
          <div className="text-xs text-emerald-600">Successful Negotiations</div>
        </div>
        
        <div className="text-center p-4 bg-white/50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-900 mb-1" data-testid="text-avg-resolution-time">
            {successMetrics.timeToResolution} days
          </div>
          <div className="text-xs text-emerald-600">Avg Resolution</div>
        </div>
      </div>
    </MobileCard>
  );
}

// Main negotiation coaching page
export default function NegotiationCoaching() {
  const { user } = useAuth();
  const { isSubscribed, isLoading } = useSubscription();
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"scenarios" | "coaching" | "templates" | "success">("scenarios");

  // Show premium paywall if not subscribed
  if (!isSubscribed && !isLoading) {
    return (
      <MobileLayout title="Expert Negotiation Coaching">
        <div className="relative">
          <PremiumPaywallOverlay
            title="Expert Negotiation Coaching"
            description="Interactive coaching system with proven scripts, objection handlers, and step-by-step guidance for medical bill negotiations. Example outcomes show potential savings up to $15,000+ per bill."
            featureName="Negotiation Coaching"
            savingsPotential="$15,000+"
          />
          
          {/* Preview content behind overlay */}
          <div className="opacity-30 pointer-events-none">
            <ScenarioSelector selectedScenario="" onScenarioSelect={() => {}} />
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (isLoading) {
    return (
      <MobileLayout title="Expert Negotiation Coaching">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coaching dashboard...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Expert Negotiation Coaching">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Premium Badge */}
        <motion.div variants={itemVariants}>
          <MobileCard className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6" />
              <div>
                <h2 className="font-bold" data-testid="text-premium-badge">Expert Negotiation Coaching</h2>
                <p className="text-amber-100 text-sm">Professional-grade bill negotiation system</p>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants}>
          <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-white/40">
            {[
              { id: "scenarios", label: "Scenarios", icon: Target },
              { id: "coaching", label: "Coaching", icon: Brain },
              { id: "templates", label: "Templates", icon: FileText },
              { id: "success", label: "Success", icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-white shadow-lg text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "scenarios" && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScenarioSelector 
                selectedScenario={selectedScenario}
                onScenarioSelect={setSelectedScenario}
              />
            </motion.div>
          )}

          {activeTab === "coaching" && (
            <motion.div
              key="coaching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedScenario ? (
                <ProfessionalCoaching scenario={selectedScenario} />
              ) : (
                <MobileCard className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Select a Scenario First</h3>
                  <p className="text-gray-600 mb-4">Choose a negotiation scenario to access personalized coaching</p>
                  <MobileButton onClick={() => setActiveTab("scenarios")} data-testid="button-select-scenario">
                    Choose Scenario
                  </MobileButton>
                </MobileCard>
              )}
            </motion.div>
          )}

          {activeTab === "templates" && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MobileCard className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Professional Templates</h3>
                <p className="text-gray-600 mb-4">Access proven email and letter templates for follow-ups</p>
                <p className="text-sm text-gray-500">Coming in next update</p>
              </MobileCard>
            </motion.div>
          )}

          {activeTab === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessTracker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <MobileCard>
            <h3 className="font-bold text-gray-900 mb-4" data-testid="text-quick-actions">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <MobileButton
                variant="secondary"
                className="flex items-center space-x-2"
                data-testid="button-emergency-help"
              >
                <Phone className="h-4 w-4" />
                <span>Emergency Help</span>
              </MobileButton>
              <MobileButton
                variant="secondary"
                className="flex items-center space-x-2"
                data-testid="button-bill-upload"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Bill</span>
              </MobileButton>
            </div>
          </MobileCard>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}