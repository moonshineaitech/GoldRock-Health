import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Crown, Star, Zap, Lock, Check, ArrowRight, Sparkles, LogIn, Brain, Target, BarChart3, Users } from "lucide-react";
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
    icon: Zap,
    title: "Unlimited AI Cases",
    description: "Generate endless custom medical scenarios with advanced AI",
    highlight: "No limits"
  },
  {
    icon: Brain,
    title: "Advanced Specialties",
    description: "Access to rare diseases and complex subspecialty cases",
    highlight: "All 19 specialties"
  },
  {
    icon: Crown,
    title: "Premium Voice Synthesis",
    description: "High-quality, realistic patient voice interactions",
    highlight: "Ultra-realistic"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "In-depth performance insights and learning paths",
    highlight: "Detailed reports"
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description: "AI-powered recommendations based on your progress",
    highlight: "Smart tracking"
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Collaborate with peers and join expert-led sessions",
    highlight: "Team learning"
  }
];

const subscriptionPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 19.99,
    period: "month",
    savings: null,
    popular: false,
    features: [
      "Unlimited AI-generated cases",
      "All 19 medical specialties",
      "Premium voice synthesis", 
      "Advanced analytics dashboard",
      "Priority customer support",
      "Mobile + web access"
    ]
  },
  {
    id: "annual",
    name: "Annual",
    price: 179.99,
    period: "year",
    savings: "Save 25%",
    popular: true,
    features: [
      "Everything in Monthly plan",
      "2 months free ($40 value)",
      "Exclusive specialty content",
      "Early access to new features",
      "Advanced study group features",
      "Personal learning coach"
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
          Premium Features Await
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Sign in to access premium medical training features and advanced AI-powered simulations
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await createSubscription.mutateAsync({ planType: planId });
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setSelectedPlan(planId);
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

  if (clientSecret && selectedPlan) {
    return (
      <MobileLayout title="Complete Payment" showBottomNav={true}>
        <div className="space-y-4">
          <div className="text-center py-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Complete Your Subscription</h2>
            <p className="text-gray-600 text-sm">Secure payment powered by Stripe</p>
          </div>
          <MobileCard>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscriptionForm planType={selectedPlan} />
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
          Unlock Premium Features
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Advanced AI training with unlimited access to all medical specialties
        </motion.p>
      </motion.div>

      {/* Premium Features Grid */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          What You Get with Premium
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              >
                <MobileCard className="h-full bg-gradient-to-br from-orange-50/50 to-amber-50/50 border-orange-200">
                  <div className="text-center p-1">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">{feature.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">{feature.description}</p>
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg">
                      {feature.highlight}
                    </span>
                  </div>
                </MobileCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Side-by-Side Plan Comparison */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          Choose Your Plan
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                </div>
              )}
              
              <MobileCard className={`h-full ${plan.popular ? "border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 ring-2 ring-orange-300 shadow-lg" : "border-gray-200"}`}>
                <div className="p-1 space-y-3">
                  {/* Plan Header */}
                  <div className="text-center pt-2">
                    <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 text-sm ml-1">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="text-green-600 font-medium text-sm mt-1">{plan.savings}</div>
                    )}
                  </div>

                  {/* Plan Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <div className="pt-2">
                    <MobileButton 
                      className={`w-full ${plan.popular ? "bg-orange-600 hover:bg-orange-700 shadow-lg" : "bg-gray-800 hover:bg-gray-900"}`}
                      size="sm"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={createSubscription.isPending}
                      data-testid={`subscribe-${plan.id}`}
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      {createSubscription.isPending ? "Processing..." : "Subscribe Now"}
                    </MobileButton>
                  </div>
                </div>
              </MobileCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security & Trust */}
      <motion.div
        className="text-center py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        <MobileCard className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="py-2">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span>Instant Access</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Powered by Stripe • HIPAA Compliant • 256-bit SSL Encryption
            </p>
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
          Enjoy unlimited access to all advanced features
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
          Your Premium Features
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
          <Link href="/ai-generator">
            <MobileButton className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
              <Zap className="h-5 w-5 mr-2" />
              Generate Custom Case
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/training">
            <MobileButton variant="secondary" className="w-full" size="lg">
              <Star className="h-5 w-5 mr-2" />
              Browse Premium Cases
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