import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Crown, Star, Zap, Lock, Check, ArrowRight, Sparkles, LogIn, Brain, Target, BarChart3, Users, DollarSign, FileText, AlertTriangle, TrendingDown, Stethoscope, MessageCircle, Clock, Search, UserCheck, Phone, Calendar, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const premiumFeatures = [
  {
    icon: DollarSign,
    title: "Medical Bill AI Analysis",
    description: "AI identifies $2,000-$35,000+ in billing overcharges using proven detection algorithms",
    highlight: "Save thousands",
    category: "billing",
    href: "/bill-ai"
  },
  {
    icon: MessageCircle,
    title: "Expert Negotiation Coaching",
    description: "Learn hospital-specific tactics and proven scripts that get results",
    highlight: "Insider knowledge",
    category: "billing",
    href: "/bill-best-practices"
  },
  {
    icon: Clock,
    title: "Strategic Timing Guide",
    description: "Know exactly when to dispute, negotiate, and escalate for maximum success",
    highlight: "Perfect timing",
    category: "billing",
    href: "/industry-insights"
  },
  {
    icon: Code,
    title: "Billing Code Mastery",
    description: "Understand CPT codes, modifiers, and common overcharge patterns hospitals use",
    highlight: "Decode the system",
    category: "billing",
    href: "/industry-insights"
  },
  {
    icon: UserCheck,
    title: "Personal Bill Reduction Coach",
    description: "1-on-1 guidance for complex cases with billing department veterans",
    highlight: "Expert support",
    category: "billing",
    href: "/bill-best-practices"
  },
  {
    icon: FileText,
    title: "Professional Dispute Arsenal",
    description: "Access 50+ proven letter templates that hospitals legally must respond to",
    highlight: "95% success rate",
    category: "billing",
    href: "/bill-best-practices"
  },
  {
    icon: Brain,
    title: "Unlimited Medical Training",
    description: "Master medicine with AI-generated cases across all 19 specialties",
    highlight: "Endless learning",
    category: "training",
    href: "/training"
  },
  {
    icon: BarChart3,
    title: "Savings & Progress Analytics",
    description: "Track your bill reductions and medical knowledge growth over time",
    highlight: "Dual insights",
    category: "both",
    href: "/progress"
  }
];

const subscriptionPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 20,
    period: "month",
    savings: null,
    popular: false,
    features: [
      "AI Bill Analysis (Avg. $8,500 saved per user)",
      "Expert negotiation coaching & proven scripts", 
      "Strategic timing guide for maximum success",
      "Billing code mastery & overcharge detection",
      "50+ professional dispute letter templates",
      "Real-time bill monitoring & fraud alerts"
    ]
  },
  {
    id: "annual",
    name: "Annual",
    price: 189,
    period: "year",
    savings: "Save 21% (~2.6 months free)",
    popular: true,
    features: [
      "Everything in Monthly plan",
      "Personal bill reduction coach (1-on-1 sessions)",
      "Hospital billing department insider tactics",
      "Complex case escalation strategies",
      "Insurance company negotiation playbook",
      "Unlimited medical training (all specialties)"
    ]
  }
];

function LoginPrompt() {
  return (
    <div className="space-y-6">
      <motion.div 
        className="text-center py-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/25"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
        >
          <Crown className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Master Bill Reduction + Medicine
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Sign in to access expert bill negotiation strategies and advanced medical training
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <a href="/api/login">
            <MobileButton size="lg" className="bg-orange-600 hover:bg-orange-700">
              <LogIn className="h-5 w-5 mr-2" />
              Sign In to Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SubscriptionForm({ planType, setupIntentId }: { planType: string; setupIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Confirm the SetupIntent to collect payment method
      const { error: setupError } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/premium",
        },
        redirect: 'if_required', // Don't redirect if not necessary
      });

      if (setupError) {
        toast({
          title: "Payment Setup Failed",
          description: setupError.message,
          variant: "destructive",
        });
        return;
      }

      // Step 2: Call our backend to confirm the subscription
      const confirmResponse = await apiRequest("POST", "/api/confirm-subscription", {
        setupIntentId: setupIntentId,
      });

      const confirmResult = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(confirmResult.message || 'Failed to confirm subscription');
      }

      // Handle different response statuses
      if (confirmResult.status === 'requires_action' && confirmResult.clientSecret) {
        // Handle 3D Secure or other payment confirmations
        const { error: paymentError } = await stripe.confirmPayment({
          clientSecret: confirmResult.clientSecret,
          confirmParams: {
            return_url: window.location.origin + "/premium",
          },
        });

        if (paymentError) {
          toast({
            title: "Payment Confirmation Failed",
            description: paymentError.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Success!
      toast({
        title: "Welcome to Premium!",
        description: "Your subscription is now active. Enjoy unlimited access!",
      });

      // Refresh the page to show premium content
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Subscription confirmation error:', error);
      toast({
        title: "Subscription Error", 
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <MobileButton 
        type="submit" 
        className="w-full bg-orange-600 hover:bg-orange-700" 
        size="lg"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? "Processing..." : `Subscribe to ${planType}`}
      </MobileButton>
    </form>
  );
}

function PremiumMarketing() {
  const { createSubscription } = useSubscription();
  const { toast } = useToast();
  const [setupData, setSetupData] = useState<{
    clientSecret: string;
    setupIntentId: string;
    planType: string;
  } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");

  const handleSubscribe = async (planId: string) => {
    try {
      console.log(`Starting subscription for plan: ${planId}`);
      const data = await createSubscription.mutateAsync({ planType: planId });
      console.log('Subscription setup response:', data);
      
      if (data.clientSecret && data.setupIntentId) {
        setSetupData({
          clientSecret: data.clientSecret,
          setupIntentId: data.setupIntentId,
          planType: data.planType || planId,
        });
      } else {
        console.error('Invalid response format:', data);
        toast({
          title: "Error",
          description: "Invalid response from server. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: `Failed to start subscription process: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  if (setupData) {
    return (
      <MobileLayout title="Complete Payment" showBottomNav={true}>
        <div className="space-y-4">
          <div className="text-center py-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Complete Your Subscription</h2>
            <p className="text-gray-600 text-sm">Secure payment powered by Stripe</p>
          </div>
          <MobileCard>
            <Elements stripe={stripePromise} options={{ clientSecret: setupData.clientSecret }}>
              <SubscriptionForm 
                planType={setupData.planType} 
                setupIntentId={setupData.setupIntentId}
              />
            </Elements>
          </MobileCard>
        </div>
      </MobileLayout>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div 
        className="text-center py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Crown className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Master Bill Negotiation + Medicine
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Expert strategies to slash medical bills + insider knowledge from billing veterans
        </motion.p>
      </motion.div>

      {/* Single Plan Box with Toggle */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        id="purchase-section"
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Choose Your Plan
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Expert bill reduction strategies + Medical training. Cancel anytime.
        </p>
        
        <MobileCard className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 ring-2 ring-emerald-300 shadow-xl">
          <div className="p-4 space-y-4">
            {/* Plan Toggle */}
            <div className="bg-white/70 rounded-2xl p-1 flex">
              <button 
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  selectedPlan === 'monthly' 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all relative ${
                  selectedPlan === 'annual' 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setSelectedPlan('annual')}
              >
                Annual
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 21%
                </span>
              </button>
            </div>
            
            {/* Selected Plan Details */}
            {selectedPlan && (() => {
              const plan = subscriptionPlans.find(p => p.id === selectedPlan);
              if (!plan) return null;
              
              return (
                <div className="text-center space-y-4">
                  <div>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-1">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="text-emerald-600 font-semibold text-sm">{plan.savings}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-left">
                    {plan.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                    size="lg"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={createSubscription.isPending}
                    data-testid={`subscribe-${plan.id}`}
                  >
                    <DollarSign className="h-5 w-5 mr-2" />
                    {createSubscription.isPending ? "Processing..." : "Start Saving Money"}
                  </MobileButton>
                </div>
              );
            })()}
          </div>
        </MobileCard>
      </motion.div>

      {/* Enhanced Premium Features Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          What You Get with Premium
        </h2>
        
        {/* Value Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <TrendingDown className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-emerald-700">Average User Saves $8,500+</span>
          </div>
          <p className="text-sm text-emerald-600">Subscription pays for itself with first bill analysis</p>
        </div>

        {/* Premium Intelligence Databases */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-800">6 Exclusive Intelligence Databases</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Professional Grade
              </span>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              🎯 Comprehensive billing intelligence with insider knowledge, proven strategies, and massive savings potential.
            </p>
            
            {/* Intelligence Databases Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Hospital Bills Intelligence</h4>
                      <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $50K+ Avg
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">500+ hospital insider secrets, billing vulnerabilities, and department-specific tactics</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl p-3 border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Insurance Claims Intelligence</h4>
                      <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $35K+ Avg
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Company-specific tactics, claim processing secrets, and counter-strategies</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl p-3 border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Denial Reversal Intelligence</h4>
                      <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $75K+ Avg
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">92% success rate reversal strategies and appeal templates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Stories Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-800">Real Success Stories</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/70 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Sarah M. - Emergency Surgery</div>
                    <div className="text-xs text-green-600 font-medium">Saved $127,000 using Hospital Intelligence</div>
                  </div>
                </div>
                <p className="text-xs text-gray-700">"The emergency care database revealed billing violations that my lawyer missed. Got 78% reduction!"</p>
              </div>

              <div className="bg-white/70 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Michael R. - Cancer Treatment</div>
                    <div className="text-xs text-blue-600 font-medium">Saved $89,500 with Insurance Denial Reversal</div>
                  </div>
                </div>
                <p className="text-xs text-gray-700">"The reversal templates worked like magic. Insurance approved everything within 2 weeks."</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Key Features Grid */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            Professional-Grade Tools
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <MobileCard className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <MessageCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Expert Negotiation Scripts</h4>
                <p className="text-xs text-gray-700">Hospital-specific tactics from billing veterans</p>
              </div>
            </MobileCard>
            
            <MobileCard className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <Code className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Billing Code Mastery</h4>
                <p className="text-xs text-gray-700">Decode hidden overcharge patterns</p>
              </div>
            </MobileCard>
            
            <MobileCard className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <UserCheck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Personal Bill Coach</h4>
                <p className="text-xs text-gray-700">1-on-1 guidance from industry insiders</p>
              </div>
            </MobileCard>
            
            <MobileCard className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border-teal-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <Clock className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Strategic Timing Guide</h4>
                <p className="text-xs text-gray-700">Perfect timing for disputes & escalations</p>
              </div>
            </MobileCard>
          </div>
        </motion.div>

        {/* Urgency & Value Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border border-orange-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-bold text-orange-800">Limited Time: Industry Insider Access</span>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              🔥 Get the same tools that billing lawyers charge $500/hour for. Save thousands on your first bill.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-orange-700">
              <div>✅ 500+ Hospital Insider Secrets</div>
              <div>✅ 100+ Professional Workflows</div>
              <div>✅ Insurance Company Tactics</div>
              <div>✅ Emergency Care Protections</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}

function PremiumDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        className="text-center py-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/25"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
        >
          <Crown className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Welcome, Premium Member!
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Access expert bill negotiation strategies and unlimited medical training
        </motion.p>
      </motion.div>

      {/* Premium Features */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
          Your Premium Benefits
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                <Link href={feature.href}>
                  <MobileCard className="h-full hover:bg-orange-50 transition-colors cursor-pointer border-orange-200">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </MobileCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
          Quick Actions
        </h2>
        
        <div className="space-y-3">
          <Link href="/bill-ai">
            <MobileButton className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg" size="lg">
              <DollarSign className="h-5 w-5 mr-2" />
              Analyze Medical Bills
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/bill-best-practices">
            <MobileButton className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg" size="lg">
              <Target className="h-5 w-5 mr-2" />
              Bill Best Practices
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/industry-insights">
            <MobileButton className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg" size="lg">
              <Search className="h-5 w-5 mr-2" />
              Industry Insights
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/training">
            <MobileButton className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg" size="lg">
              <Stethoscope className="h-5 w-5 mr-2" />
              Medical Training
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </div>
      </motion.div>

      {/* Subscription Status */}
      <motion.div
        className="text-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <MobileCard className="bg-green-50 border-green-200">
          <div className="flex items-center justify-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Active Premium Subscription</span>
          </div>
          <p className="text-xs text-green-600 mt-1">Next billing: January 15, 2025</p>
        </MobileCard>
      </motion.div>
    </div>
  );
}

export default function Premium() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();

  if (isLoading || subscriptionLoading) {
    return (
      <MobileLayout title="Premium" showBottomNav={true}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MobileLayout title="Premium" showBottomNav={true}>
        <LoginPrompt />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Premium" showBottomNav={true}>
      {isSubscribed ? <PremiumDashboard /> : <PremiumMarketing />}
    </MobileLayout>
  );
}