import { MobileLayout } from "@/components/mobile-layout";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Crown, 
  DollarSign, 
  FileText, 
  Shield, 
  Clock, 
  AlertTriangle,
  MessageCircle,
  Brain,
  Sparkles,
  Target,
  Phone,
  Upload,
  Search,
  Calculator,
  FileCheck,
  Users,
  Heart,
  Zap,
  Lock,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Scale,
  Gavel,
  Building,
  Receipt,
  TrendingDown,
  Award,
  Star,
  Home,
  Play
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

interface JourneyStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  content: React.ReactNode;
}

function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Medical debt keeps you up at night. <span className="font-semibold text-gold">We help you sleep again.</span>
        </p>
      </div>

      <div className="bg-secondary rounded-2xl p-5 border border-border">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-gold" />
          Why GoldRock Health?
        </h3>
        <ul className="space-y-2.5">
          {[
            "Average users save $2,400+ on medical bills",
            "AI finds billing errors humans miss",
            "Insider knowledge from billing industry veterans",
            "Step-by-step guidance for ANY situation"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-secondary rounded-2xl p-4 border border-border">
        <p className="text-sm text-muted-foreground font-medium">
          This guide will walk you through exactly what to do based on YOUR situation. No confusion, no guesswork.
        </p>
      </div>
    </div>
  );
}

function AssessmentStep() {
  const situations = [
    {
      icon: AlertTriangle,
      title: "Bill Already in Collections",
      description: "Debt collectors calling, credit affected",
      link: "/collections-defense-guide",
      color: "red",
      urgent: true
    },
    {
      icon: Clock,
      title: "Recent Hospital Bill (30-60 days)",
      description: "New bill you want to reduce BEFORE collections",
      link: "/hospital-bill-playbook",
      color: "amber",
      urgent: false
    },
    {
      icon: FileText,
      title: "I Have a Bill to Analyze",
      description: "Upload your bill and get AI insights",
      link: "/bill-ai",
      color: "purple",
      urgent: false
    },
    {
      icon: HelpCircle,
      title: "Just Exploring Options",
      description: "Learn strategies before you need them",
      link: "/bill-reduction-guide",
      color: "blue",
      urgent: false
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center mb-4">
        Select what best describes your situation:
      </p>
      
      {situations.map((situation, i) => {
        const Icon = situation.icon;
        
        return (
          <Link key={i} href={situation.link}>
            <motion.div
              className="luxury-card rounded-xl p-4 cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{situation.title}</h3>
                    {situation.urgent && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{situation.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

function ToolsStep() {
  const tools = [
    {
      icon: Brain,
      title: "AI Bill Analyzer",
      description: "Upload your bill and get instant analysis of errors, overcharges, and negotiation strategies",
      link: "/bill-ai",
      color: "purple",
      premium: false
    },
    {
      icon: FileText,
      title: "Bill Summarizer",
      description: "Turn confusing medical jargon into plain English you can understand",
      link: "/bill-summarizer",
      color: "blue",
      premium: false
    },
    {
      icon: MessageCircle,
      title: "Negotiation Simulator",
      description: "Practice negotiating with AI before the real call - build confidence",
      link: "/negotiation-simulator",
      color: "emerald",
      premium: true
    },
    {
      icon: Calculator,
      title: "Bill Grader",
      description: "Get a score on how reasonable your bill is compared to fair pricing",
      link: "/bill-grader",
      color: "amber",
      premium: false
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center mb-4">
        Powerful AI tools at your fingertips:
      </p>
      
      <div className="grid gap-3">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          
          return (
            <Link key={i} href={tool.link}>
              <motion.div
                className="bg-card rounded-xl p-4 border border-border shadow-sm cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{tool.title}</h3>
                      {tool.premium && (
                        <Crown className="w-4 h-4 text-gold" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function GuidesStep() {
  const guides = [
    {
      icon: Gavel,
      title: "Collections Defense Guide",
      description: "34+ scenarios for fighting back against debt collectors",
      link: "/collections-defense-guide",
      scenarios: "34 scenarios"
    },
    {
      icon: Building,
      title: "Hospital Bill Playbook",
      description: "Step-by-step tactics to reduce bills BEFORE collections",
      link: "/hospital-bill-playbook",
      scenarios: "Complete guide"
    },
    {
      icon: Scale,
      title: "Your Rights Hub",
      description: "Know your legal protections and how to use them",
      link: "/rights-hub",
      scenarios: "Federal & State"
    },
    {
      icon: FileCheck,
      title: "Dispute Templates",
      description: "50+ ready-to-use letters for any situation",
      link: "/dispute-arsenal",
      scenarios: "50+ templates"
    },
    {
      icon: Target,
      title: "Timing Strategy Guide",
      description: "When to act for maximum leverage and success",
      link: "/timing-guide",
      scenarios: "Expert timing"
    },
    {
      icon: Phone,
      title: "Negotiation Coaching",
      description: "Scripts and tactics for phone negotiations",
      link: "/negotiation-coaching",
      scenarios: "Word-for-word"
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center mb-4">
        Comprehensive guides for every situation:
      </p>
      
      <div className="grid gap-2.5">
        {guides.map((guide, i) => {
          const Icon = guide.icon;
          
          return (
            <Link key={i} href={guide.link}>
              <motion.div
                className="bg-white rounded-xl p-3.5 border border-border shadow-sm cursor-pointer"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
                    <p className="text-xs text-muted-foreground">{guide.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-full">
                    {guide.scenarios}
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ResourcesStep() {
  const resources = [
    {
      icon: Receipt,
      title: "Industry Insights",
      description: "Insider knowledge from billing industry veterans",
      link: "/industry-insights"
    },
    {
      icon: TrendingDown,
      title: "Reduction Coach",
      description: "Personal guidance for your specific case",
      link: "/reduction-coach"
    },
    {
      icon: Search,
      title: "Code Mastery",
      description: "Understand medical billing codes",
      link: "/code-mastery"
    },
    {
      icon: BookOpen,
      title: "Resources Hub",
      description: "Complete library of tools and information",
      link: "/resources-hub"
    },
    {
      icon: Users,
      title: "Medicare/Medicaid Enrollment",
      description: "Check eligibility and get help enrolling",
      link: "/enrollment"
    },
    {
      icon: Shield,
      title: "Insurance Benefits Explainer",
      description: "Understand what your insurance actually covers",
      link: "/insurance-benefits"
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center mb-4">
        Additional resources to help you succeed:
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {resources.map((resource, i) => {
          const Icon = resource.icon;
          
          return (
            <Link key={i} href={resource.link}>
              <motion.div
                className="bg-secondary rounded-xl p-3 border border-border h-full cursor-pointer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="w-6 h-6 text-muted-foreground mb-2" />
                <h3 className="font-semibold text-foreground text-sm leading-tight">{resource.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function PremiumStep() {
  const { isSubscribed } = useSubscription();
  
  if (isSubscribed) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">You're a Premium Member!</h3>
          <p className="text-muted-foreground">You have full access to all features and tools.</p>
        </div>
        
        <div className="bg-secondary rounded-2xl p-5 border border-border">
          <h4 className="font-bold text-foreground mb-3">Your Premium Benefits:</h4>
          <ul className="space-y-2">
            {[
              "AI Bill Analysis with unlimited scans",
              "All 34+ collections defense scenarios",
              "Complete hospital bill playbook",
              "50+ dispute letter templates",
              "Negotiation simulator & coaching",
              "Priority support"
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-gold" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        <Link href="/">
          <motion.button
            className="w-full py-4 text-white font-bold rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Reducing Your Bills
            <ArrowRight className="inline w-5 h-5 ml-2" />
          </motion.button>
        </Link>
      </div>
    );
  }

  const features = [
    "AI Bill Analysis",
    "All 34+ Defense Scenarios",
    "Negotiation Simulator",
    "50+ Letter Templates",
    "Personal Coaching"
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
          <Crown className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">Unlock Full Access</h3>
        <p className="text-muted-foreground text-sm">Get everything you need to fight medical debt</p>
      </div>

      <div className="bg-secondary rounded-2xl p-4 border border-border">
        <div className="flex items-baseline justify-center gap-1 mb-3">
          <span className="text-3xl font-black text-foreground">$25</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="w-4 h-4 text-gold" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
        <p className="text-sm text-emerald-800 text-center font-medium">
          Average users save $2,400+ - that's 96x your investment
        </p>
      </div>

      <Link href="/premium">
        <motion.button
          className="w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Crown className="w-5 h-5" />
          Upgrade to Premium
        </motion.button>
      </Link>

      <p className="text-xs text-muted-foreground text-center">
        Cancel anytime. 30-day money-back guarantee.
      </p>
    </div>
  );
}

function CompletionStep() {
  const quickActions = [
    { icon: Brain, label: "Analyze a Bill", link: "/bill-ai", color: "purple" },
    { icon: Gavel, label: "Collections Defense", link: "/collections-defense-guide", color: "red" },
    { icon: Building, label: "Hospital Playbook", link: "/hospital-bill-playbook", color: "amber" },
    { icon: Home, label: "Dashboard", link: "/", color: "blue" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-foreground mb-2">You're Ready!</h3>
        <p className="text-muted-foreground">You now know the entire GoldRock Health platform.</p>
      </div>

      <div className="bg-secondary rounded-2xl p-5 border border-border">
        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-gold" />
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} href={action.link}>
                <motion.div
                  className="bg-card border border-border rounded-xl p-3 text-center text-foreground cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Questions? Contact us at</p>
        <a href="mailto:CONTACT@GOLDROCK.ai" className="text-gold font-medium">
          CONTACT@GOLDROCK.ai
        </a>
      </div>
    </div>
  );
}

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const { user } = useAuth();

  const steps: JourneyStep[] = [
    {
      id: "welcome",
      title: "Welcome to GoldRock Health",
      subtitle: "Your AI-powered medical bill advocate",
      icon: Heart,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <WelcomeStep />
    },
    {
      id: "assessment",
      title: "What's Your Situation?",
      subtitle: "We'll guide you to the right tools",
      icon: Target,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <AssessmentStep />
    },
    {
      id: "tools",
      title: "AI-Powered Tools",
      subtitle: "Technology that works for you",
      icon: Brain,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <ToolsStep />
    },
    {
      id: "guides",
      title: "Expert Guides",
      subtitle: "Step-by-step strategies for any situation",
      icon: BookOpen,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <GuidesStep />
    },
    {
      id: "resources",
      title: "Additional Resources",
      subtitle: "Everything else you might need",
      icon: Sparkles,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <ResourcesStep />
    },
    {
      id: "premium",
      title: "Premium Membership",
      subtitle: "Unlock the full power of GoldRock",
      icon: Crown,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <PremiumStep />
    },
    {
      id: "complete",
      title: "You're All Set!",
      subtitle: "Start your bill reduction journey",
      icon: Award,
      color: "text-foreground",
      bgColor: "bg-secondary",
      content: <CompletionStep />
    }
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const goToStep = (stepIndex: number) => {
    setDirection(stepIndex > currentStep ? 1 : -1);
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <MobileLayout title="Get Started" showBottomNav={false}>
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6 pb-32">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((step, i) => (
              <motion.button
                key={step.id}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStep 
                    ? "bg-gold scale-125" 
                    : i < currentStep 
                      ? "bg-muted-foreground" 
                      : "bg-secondary"
                }`}
                onClick={() => goToStep(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Step Header */}
          <motion.div 
            className="text-center mb-6"
            key={`header-${currentStep}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <StepIcon className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-serif font-black text-foreground mb-1">
              {currentStepData.title}
            </h1>
            <p className="text-muted-foreground">{currentStepData.subtitle}</p>
          </motion.div>

          {/* Step Content */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="max-w-lg mx-auto flex gap-3">
              {currentStep > 0 && (
                <motion.button
                  onClick={prevStep}
                  className="flex-1 py-3.5 bg-secondary text-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <motion.button
                  onClick={nextStep}
                  className="flex-1 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <Link href="/" className="flex-1">
                  <motion.button
                    className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5" />
                    Start Using GoldRock
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
