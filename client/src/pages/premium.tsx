import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Crown, Star, Zap, Lock, Check, ArrowRight, Sparkles, LogIn, Brain, Target, BarChart3, Users, DollarSign, FileText, AlertTriangle, TrendingDown, Stethoscope, MessageCircle, Clock, Search, UserCheck, Phone, Calendar, Code, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from "react";
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
      {/* Hero Section with Enhanced Design */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-28 h-28 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Premium App Icon */}
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/25 relative overflow-hidden"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            stiffness: 180,
            damping: 12
          }}
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-[1.75rem] backdrop-blur-sm" />
          <Crown className="text-white text-2xl relative z-10" />
          
          {/* Premium Sparkle Effects */}
          <motion.div 
            className="absolute -top-2 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
            animate={{ 
              y: [-6, 6, -6],
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full shadow-lg"
            animate={{ 
              y: [4, -4, 4],
              scale: [0.9, 1.2, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
        
        {/* Enhanced Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h1 className="text-3xl font-black mb-3 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Premium</span>{" "}
            <span className="text-gray-900">Bill Reduction</span>
          </h1>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
            Save $2,000 - $35,000+ Per Bill
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-6 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Sign in to access professional bill negotiation strategies, insider knowledge, and AI-powered medical training.
        </motion.p>
        
        {/* Massive Savings Highlight */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 mb-6 max-w-sm mx-auto shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-lg">Average User Saves $8,500</span>
            </div>
            <p className="text-sm text-emerald-600 font-semibold">Expert strategies + AI technology</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <a href="/api/login">
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton className="w-full max-w-xs mx-auto shadow-2xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-4">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In to Save Thousands
                <ArrowRight className="h-4 w-4 ml-2" />
              </MobileButton>
            </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-br from-white/60 via-white/40 to-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          <PaymentElement />
        </div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <MobileButton 
            type="submit" 
            className="w-full shadow-2xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700" 
            size="lg"
            disabled={!stripe || !elements || isProcessing}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Processing...
              </>
            ) : (
              <>
                <Crown className="h-5 w-5 mr-2" />
                Start Saving with {planType}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </MobileButton>
        </motion.div>
      </form>
    </motion.div>
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
        {/* Enhanced Payment Hero */}
        <motion.div 
          className="text-center py-8 px-4 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-28 h-28 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/25 relative overflow-hidden"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-[1.25rem] backdrop-blur-sm" />
            <Crown className="text-white text-xl relative z-10" />
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Complete Your Premium Access
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 text-sm mb-6 font-medium"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Secure payment powered by Stripe • Start saving thousands today
          </motion.p>
          
          {/* Premium Value Reminder */}
          <motion.div 
            className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-4 mb-6 max-w-sm mx-auto shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-emerald-700 text-sm">Average User Saves $8,500</span>
              </div>
              <p className="text-xs text-emerald-600 font-medium">Your subscription pays for itself instantly</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="px-4 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <MobileCard className="backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
            <div className="relative z-10 p-4">
              <Elements stripe={stripePromise} options={{ clientSecret: setupData.clientSecret }}>
                <SubscriptionForm 
                  planType={setupData.planType} 
                  setupIntentId={setupData.setupIntentId}
                />
              </Elements>
            </div>
          </MobileCard>
        </motion.div>
      </MobileLayout>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-28 h-28 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Premium App Icon */}
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/25 relative overflow-hidden"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            stiffness: 180,
            damping: 12
          }}
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-[1.75rem] backdrop-blur-sm" />
          <Crown className="text-white text-2xl relative z-10" />
          
          {/* Premium Sparkle Effects */}
          <motion.div 
            className="absolute -top-2 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
            animate={{ 
              y: [-6, 6, -6],
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full shadow-lg"
            animate={{ 
              y: [4, -4, 4],
              scale: [0.9, 1.2, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
        
        {/* Enhanced Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h1 className="text-3xl font-black mb-3 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Premium</span>{" "}
            <span className="text-gray-900">Bill Reduction</span>
          </h1>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
            Save $2,000 - $35,000+ Per Bill
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-6 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Professional bill negotiation strategies, insider knowledge from billing veterans, and AI-powered medical training.
        </motion.p>
        
        {/* Massive Savings Highlight */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 mb-8 max-w-sm mx-auto shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-lg">Average User Saves $8,500</span>
            </div>
            <p className="text-sm text-emerald-600 font-semibold">Subscription pays for itself instantly</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Stories Section */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Real Success Stories
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Actual premium members who saved massive amounts
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {[
            { 
              title: "Emergency Surgery Bill", 
              savings: "$23,000", 
              strategy: "AI detected overcharges + charity care application", 
              time: "6 weeks",
              percentage: "78% reduction",
              color: "emerald", 
              delay: 1.4,
              icon: AlertTriangle,
              testimonial: "The premium database revealed billing violations my lawyer missed!"
            },
            { 
              title: "Cancer Treatment", 
              savings: "$89,500", 
              strategy: "Insurance denial reversal + expert coaching", 
              time: "8 weeks",
              percentage: "85% reduction",
              color: "blue", 
              delay: 1.5,
              icon: FileText,
              testimonial: "Premium coaching helped me navigate the complex appeal process."
            },
            { 
              title: "Cardiac Procedure", 
              savings: "$34,800", 
              strategy: "Good faith estimate violation + negotiations", 
              time: "5 weeks",
              percentage: "72% reduction",
              color: "purple", 
              delay: 1.6,
              icon: DollarSign,
              testimonial: "The insider tactics from premium saved my family from bankruptcy."
            }
          ].map((story, index) => {
            const IconComponent = story.icon;
            return (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: story.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150
                }}
                data-testid={`success-story-${story.title.toLowerCase().replace(/ /g, '-')}`}
              >
                <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br ${
                            story.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                            story.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                            story.color === 'purple' ? 'from-purple-500 to-indigo-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{story.title}</h3>
                          <p className="text-sm text-gray-600 font-medium">{story.strategy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-700">{story.savings}</div>
                        <div className="text-xs text-emerald-600 font-semibold">{story.percentage}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-sm text-gray-700 italic">"{story.testimonial}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{story.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Crown className="h-4 w-4" />
                        <span className="font-semibold">Premium Member</span>
                      </div>
                    </div>
                  </div>
                </MobileCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Enhanced Pricing Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.6 }}
        id="plans"
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Choose Your Premium Plan
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Professional bill reduction + Medical training • Cancel anytime
          </p>
        </motion.div>
        
        {/* Value Proposition Banner */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.9, duration: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingDown className="h-5 w-5 text-emerald-600" />
            <span className="font-black text-emerald-700 text-lg">ROI: 4,250% Average Return</span>
          </div>
          <p className="text-sm text-emerald-600 font-semibold">Your subscription pays for itself with first bill analysis</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          <MobileCard className="backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-green-50/80" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20" />
            <div className="relative z-10 p-6 space-y-6">
            {/* Enhanced Plan Toggle */}
            <div className="bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-sm rounded-2xl p-1.5 flex shadow-lg border border-white/50">
              <motion.button 
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                  selectedPlan === 'monthly' 
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
                onClick={() => setSelectedPlan('monthly')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedPlan === 'monthly' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-green-400/20 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span className="relative z-10">Monthly</span>
              </motion.button>
              <motion.button 
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                  selectedPlan === 'annual' 
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
                onClick={() => setSelectedPlan('annual')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedPlan === 'annual' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-green-400/20 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span className="relative z-10">Annual</span>
                <motion.span 
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Save 21%
                </motion.span>
              </motion.button>
            </div>
            
            {/* Selected Plan Details */}
            {selectedPlan && (() => {
              const plan = subscriptionPlans.find(p => p.id === selectedPlan);
              if (!plan) return null;
              
              return (
                <motion.div 
                  className="text-center space-y-6"
                  key={selectedPlan}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Enhanced Pricing Display */}
                  <div className="relative">
                    <div className="flex items-baseline justify-center mb-3">
                      <span className="text-4xl font-black bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 bg-clip-text text-transparent">${plan.price}</span>
                      <span className="text-gray-600 ml-2 text-lg font-medium">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <motion.div 
                        className="inline-flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-full px-3 py-1 mb-4"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-3 w-3 text-orange-600" />
                        <span className="text-orange-700 font-bold text-sm">{plan.savings}</span>
                      </motion.div>
                    )}
                    {/* ROI Indicator */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center space-x-1 bg-emerald-100 border border-emerald-200 rounded-full px-3 py-1">
                        <TrendingDown className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold text-xs">Pays for itself in first analysis</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Features List */}
                  <div className="space-y-3 text-left bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        </motion.div>
                        <span className="text-sm text-gray-800 font-medium leading-relaxed">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Enhanced CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileButton 
                      className="w-full shadow-2xl shadow-emerald-500/40 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 border-2 border-emerald-200"
                      size="lg"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={createSubscription.isPending}
                      data-testid={`subscribe-${plan.id}`}
                    >
                      {createSubscription.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Crown className="h-5 w-5 mr-2" />
                          Start Saving Thousands
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </MobileButton>
                  </motion.div>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Cancel Anytime</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>95% Success Rate</span>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
            </div>
          </MobileCard>
        </motion.div>
      </motion.div>

      {/* Enhanced Premium Features Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Professional Features Included
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Everything you need to reduce medical bills by thousands
          </p>
        </motion.div>
        
        {/* Enhanced Value Banner */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5 text-center shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingDown className="h-6 w-6 text-emerald-600" />
            </motion.div>
            <span className="font-black text-emerald-700 text-xl">$8,500+ Average Savings</span>
          </div>
          <p className="text-sm text-emerald-600 font-semibold">ROI: 4,250% • Pays for itself instantly</p>
        </motion.div>

        {/* Premium Intelligence Databases */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-indigo-50/80" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20" />
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Search className="h-6 w-6 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-blue-800 mb-1">6 Intelligence Databases</h3>
                  <span className="inline-flex items-center space-x-1 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    <span>Professional Grade</span>
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-700 mb-6 font-medium leading-relaxed">
                🎯 Comprehensive billing intelligence with insider knowledge, proven strategies, and massive savings potential from industry veterans.
              </p>
            
              {/* Enhanced Intelligence Databases Grid */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: Search,
                    title: "Hospital Bills Intelligence", 
                    savings: "$50K+ Avg",
                    desc: "500+ hospital insider secrets, billing vulnerabilities, and department-specific tactics",
                    color: "blue",
                    delay: 2.9
                  },
                  {
                    icon: Zap,
                    title: "Insurance Claims Intelligence", 
                    savings: "$35K+ Avg",
                    desc: "Company-specific tactics, claim processing secrets, and counter-strategies",
                    color: "indigo",
                    delay: 3.0
                  },
                  {
                    icon: Target,
                    title: "Denial Reversal Intelligence", 
                    savings: "$75K+ Avg",
                    desc: "92% success rate reversal strategies and appeal templates",
                    color: "red",
                    delay: 3.1
                  }
                ].map((db, index) => {
                  const IconComponent = db.icon;
                  return (
                    <motion.div 
                      key={db.title}
                      className="bg-gradient-to-r from-white/90 via-white/70 to-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: db.delay, duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${
                            db.color === 'blue' ? 'from-blue-500 to-blue-600' :
                            db.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                            db.color === 'red' ? 'from-red-500 to-red-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 8 }}
                        >
                          <IconComponent className="h-7 w-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 text-base">{db.title}</h4>
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                              {db.savings}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium leading-relaxed">{db.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </MobileCard>
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
          
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: MessageCircle,
                title: "Expert Negotiation Scripts",
                desc: "Hospital-specific tactics from billing veterans", 
                color: "emerald",
                delay: 3.2
              },
              {
                icon: Code,
                title: "Billing Code Mastery",
                desc: "Decode hidden overcharge patterns",
                color: "indigo", 
                delay: 3.25
              },
              {
                icon: UserCheck,
                title: "Personal Bill Coach",
                desc: "1-on-1 guidance from industry insiders",
                color: "orange",
                delay: 3.3
              },
              {
                icon: Clock,
                title: "Strategic Timing Guide", 
                desc: "Perfect timing for disputes & escalations",
                color: "teal",
                delay: 3.35
              }
            ].map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: tool.delay, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl h-36 cursor-pointer overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex flex-col items-center justify-center h-full space-y-3 relative z-10 p-3 text-center">
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br ${
                          tool.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                          tool.color === 'indigo' ? 'from-indigo-500 to-purple-600' :
                          tool.color === 'orange' ? 'from-orange-500 to-red-600' :
                          tool.color === 'teal' ? 'from-teal-500 to-cyan-600' :
                          'from-gray-500 to-gray-600'
                        } rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{tool.title}</h4>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">{tool.desc}</p>
                      </div>
                    </div>
                  </MobileCard>
                </motion.div>
              );
            })}
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
  
  // Scroll to top when component mounts or handle hash navigation
  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'plans') {
        // Small delay to allow content to render
        setTimeout(() => {
          const element = document.getElementById('plans');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    handleNavigation();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

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