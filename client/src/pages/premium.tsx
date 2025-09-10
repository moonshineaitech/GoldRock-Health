import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Crown, Star, Zap, Lock, Check, ArrowRight, Sparkles, LogIn, Brain, Target, BarChart3, Users, DollarSign, FileText, AlertTriangle, TrendingDown, Stethoscope } from "lucide-react";
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
    description: "AI identifies $10K-$500K+ in billing overcharges and errors",
    highlight: "Save thousands",
    category: "billing"
  },
  {
    icon: FileText,
    title: "Professional Dispute Letters",
    description: "Get proven templates that hospitals and insurers respond to",
    highlight: "95% success rate",
    category: "billing"
  },
  {
    icon: AlertTriangle,
    title: "Real-Time Bill Monitoring",
    description: "Instant alerts for suspicious charges and billing patterns",
    highlight: "Live protection",
    category: "billing"
  },
  {
    icon: Zap,
    title: "Unlimited AI Cases",
    description: "Generate endless custom medical scenarios with advanced AI",
    highlight: "No limits",
    category: "training"
  },
  {
    icon: Brain,
    title: "Advanced Specialties",
    description: "Access to rare diseases and complex subspecialty cases",
    highlight: "All 19 specialties",
    category: "training"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track both learning progress and billing savings",
    highlight: "Dual insights",
    category: "both"
  }
];

const subscriptionPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 39.99,
    period: "month",
    savings: null,
    popular: false,
    features: [
      "Medical Bill AI Analysis (Save $10K-$500K+)",
      "Professional dispute letter templates",
      "Unlimited AI-generated medical cases",
      "All 19 medical specialties access",
      "Real-time bill monitoring & alerts",
      "Priority customer support"
    ]
  },
  {
    id: "annual",
    name: "Annual",
    price: 399.99,
    period: "year",
    savings: "Save 17% + 2 Free Months",
    popular: true,
    features: [
      "Everything in Monthly plan",
      "Advanced billing pattern recognition",
      "Exclusive medical specialty content",
      "Personal learning & savings coach",
      "Early access to new AI features",
      "Dedicated account manager"
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
          Save Thousands + Learn Medicine
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Sign in to access Medical Bill AI analysis and advanced medical training features
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

function SubscriptionForm({ planType }: { planType: string }) {
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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/premium",
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Premium!",
          description: "Your subscription is now active. Enjoy unlimited access!",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error", 
        description: "An unexpected error occurred. Please try again.",
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
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");
  const [purchasePlan, setPurchasePlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await createSubscription.mutateAsync({ planType: planId });
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setPurchasePlan(planId);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (clientSecret && purchasePlan) {
    return (
      <MobileLayout title="Complete Payment" showBottomNav={true}>
        <div className="space-y-4">
          <div className="text-center py-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Complete Your Subscription</h2>
            <p className="text-gray-600 text-sm">Secure payment powered by Stripe</p>
          </div>
          <MobileCard>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscriptionForm planType={purchasePlan} />
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
          Save Thousands + Master Medicine
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          AI that finds massive bill overcharges + unlimited access to medical training
        </motion.p>
      </motion.div>

      {/* Premium Features Grid */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          What You Get with Premium
        </h2>
        
        {/* Condensed Premium Features - Clickable */}
        <motion.div 
          className="space-y-4 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={() => document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {/* Value Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-emerald-700">Average User Saves $127,000</span>
            </div>
            <p className="text-sm text-emerald-600">Subscription pays for itself with first bill analysis</p>
          </div>
          
          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MobileCard className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <DollarSign className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Bill AI Analysis</h4>
                <p className="text-xs text-gray-700">Find $10K-$500K+ overcharges</p>
              </div>
            </MobileCard>
            
            <MobileCard className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <Brain className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Medical Training</h4>
                <p className="text-xs text-gray-700">Unlimited AI cases & scenarios</p>
              </div>
            </MobileCard>
            
            <MobileCard className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Dispute Letters</h4>
                <p className="text-xs text-gray-700">Professional templates</p>
              </div>
            </MobileCard>
            
            <MobileCard className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border-teal-200 hover:shadow-lg transition-shadow">
              <div className="text-center p-2">
                <BarChart3 className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">Analytics</h4>
                <p className="text-xs text-gray-700">Track savings & progress</p>
              </div>
            </MobileCard>
          </div>
          
          <div className="text-center py-2">
            <p className="text-sm text-gray-600">👆 Tap to choose your plan</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Single Plan Box with Toggle */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        id="purchase-section"
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Choose Your Plan
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Medical Bill AI + Training. Cancel anytime.
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
                  Save 17%
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
          Enjoy unlimited bill analysis and medical training features
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
                <Link href="/ai-generator">
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