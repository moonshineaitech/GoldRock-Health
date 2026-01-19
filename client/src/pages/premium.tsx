import { MobileLayout, MobileButton } from "@/components/mobile-layout";
import { Crown, Check, ArrowRight, LogIn, Brain, DollarSign, FileText, Stethoscope, MessageCircle, Clock, Code, UserCheck, ShieldCheck, Sparkles, Lock, Award, BarChart3, Zap, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Capacitor } from "@capacitor/core";
import { Link } from "wouter";

let stripePromise: Promise<Stripe | null> | null = null;

async function getStripePromise(): Promise<Stripe | null> {
  if (stripePromise) return stripePromise;
  
  try {
    const response = await fetch('/api/stripe/publishable-key');
    const data = await response.json();
    if (data.publishableKey) {
      stripePromise = loadStripe(data.publishableKey);
      return stripePromise;
    }
  } catch (error) {
    console.error('Failed to fetch Stripe publishable key:', error);
  }
  
  if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    return stripePromise;
  }
  
  return null;
}

const premiumFeatures = [
  { icon: DollarSign, title: "AI Bill Analysis", description: "Identify billing errors and overcharges automatically" },
  { icon: MessageCircle, title: "Negotiation Scripts", description: "Proven tactics that get results with billing departments" },
  { icon: Clock, title: "Strategic Timing", description: "Know exactly when to dispute for maximum success" },
  { icon: Code, title: "Code Mastery", description: "Understand CPT codes and common overcharge patterns" },
  { icon: UserCheck, title: "Personal Coach", description: "1-on-1 guidance for complex billing cases" },
  { icon: FileText, title: "Dispute Templates", description: "50+ professional letter templates" },
  { icon: Brain, title: "Medical Training", description: "AI-powered cases across all specialties" },
  { icon: BarChart3, title: "Progress Analytics", description: "Track savings and learning over time" },
];

const allSubscriptionPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 25,
    period: "month",
    savings: null,
    popular: false,
    features: [
      "AI Bill Analysis",
      "Negotiation coaching & scripts",
      "Strategic timing guide",
      "Billing code detection",
      "50+ dispute templates",
      "Bill monitoring alerts"
    ]
  },
  {
    id: "annual",
    name: "Annual",
    price: 249,
    period: "year",
    savings: "Save 17%",
    popular: true,
    features: [
      "Everything in Monthly",
      "Personal reduction coach",
      "Insider billing tactics",
      "Case escalation strategies",
      "Insurance negotiation playbook",
      "Unlimited medical training"
    ]
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 747,
    period: "one-time",
    savings: "Best Value",
    popular: false,
    features: [
      "Everything in Annual",
      "Lifetime access forever",
      "Priority support",
      "All future updates",
      "Exclusive member benefits",
      "Price locked in"
    ]
  }
];

const getAvailablePlans = () => {
  const isIOS = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
  return isIOS ? allSubscriptionPlans.filter(p => p.id !== 'lifetime') : allSubscriptionPlans;
};

// Pre-login Premium Page
function LoginPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="pt-8 pb-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Logo */}
          <motion.div 
            className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1 
            className="text-3xl font-black text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            GoldRock Premium
          </motion.h1>

          <motion.p 
            className="text-gray-600 mb-6 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Professional medical bill reduction tools and AI-powered clinical training in one platform.
          </motion.p>

          <motion.a
            href="/api/login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            data-testid="button-sign-in"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Get Started
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Everything You Get</h2>
          <div className="grid grid-cols-2 gap-3">
            {premiumFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-10 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Simple Pricing</h2>
          <div className="space-y-3">
            {getAvailablePlans().map((plan) => (
              <div
                key={plan.id}
                className={`relative p-4 rounded-xl border-2 ${
                  plan.popular 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    {plan.savings && (
                      <span className="text-xs text-emerald-600 font-semibold">{plan.savings}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.period === 'one-time' ? 'once' : plan.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.a
            href="/api/login"
            className="block mt-6 w-full text-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In to Subscribe
          </motion.a>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6">
          {[
            { icon: Lock, label: "Secure Payments" },
            { icon: ShieldCheck, label: "Cancel Anytime" },
            { icon: Sparkles, label: "Instant Access" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-gray-500">
              <item.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Stripe Payment Form - Uses PaymentIntent for subscription payment
function SubscriptionForm({ planType }: { planType: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Confirm the payment using the PaymentIntent
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { 
          return_url: window.location.origin + "/premium?success=true" 
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({ title: "Payment Failed", description: error.message, variant: "destructive" });
        return;
      }

      // Payment confirmed - verify subscription status with backend
      if (paymentIntent) {
        if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
          // Call verify-subscription to update user's subscription status
          const verifyResponse = await apiRequest("POST", "/api/verify-subscription", {});
          const verifyResult = await verifyResponse.json();
          
          if (verifyResult.status === 'active') {
            toast({ title: "Welcome to Premium!", description: "Your subscription is now active." });
            setTimeout(() => window.location.reload(), 1500);
          } else if (verifyResult.status === 'requires_action' && verifyResult.clientSecret) {
            // Handle 3DS or additional authentication required
            const { error: actionError } = await stripe.confirmPayment({
              clientSecret: verifyResult.clientSecret,
              confirmParams: { return_url: window.location.origin + "/premium?success=true" },
            });
            if (actionError) {
              toast({ title: "Authentication Failed", description: actionError.message, variant: "destructive" });
            }
          } else if (verifyResult.status === 'processing') {
            toast({ title: "Processing", description: "Your payment is being processed. You'll have access shortly." });
            setTimeout(() => window.location.reload(), 3000);
          } else {
            toast({ title: "Payment Received", description: "Activating your subscription..." });
            setTimeout(() => window.location.reload(), 2000);
          }
        } else if (paymentIntent.status === 'requires_action') {
          // This shouldn't happen with redirect: 'if_required', but handle it anyway
          toast({ title: "Additional Verification Required", description: "Please complete the verification." });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An error occurred.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <PaymentElement options={{ layout: { type: 'tabs', defaultCollapsed: false } }} />
      </div>
      <MobileButton
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-4"
        disabled={!stripe || !elements || isProcessing}
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Complete Secure Payment
          </span>
        )}
      </MobileButton>
      <p className="text-xs text-center text-gray-500">
        Secured by Stripe. Cancel anytime.
      </p>
    </form>
  );
}

// Plan Selection Card
function PlanCard({ plan, isSelected, onSelect, isCurrentPlan }: {
  plan: typeof allSubscriptionPlans[0];
  isSelected: boolean;
  onSelect: () => void;
  isCurrentPlan: boolean;
}) {
  return (
    <motion.button
      onClick={onSelect}
      disabled={isCurrentPlan}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isCurrentPlan
          ? 'border-emerald-500 bg-emerald-50 cursor-default'
          : isSelected
          ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      whileHover={!isCurrentPlan ? { scale: 1.01 } : {}}
      whileTap={!isCurrentPlan ? { scale: 0.99 } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{plan.name}</h3>
            {plan.popular && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                Popular
              </span>
            )}
            {isCurrentPlan && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                Current
              </span>
            )}
          </div>
          {plan.savings && <p className="text-xs text-emerald-600 font-semibold mt-0.5">{plan.savings}</p>}
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-gray-900">${plan.price}</span>
          <span className="text-gray-500 text-sm">/{plan.period === 'one-time' ? 'once' : plan.period}</span>
        </div>
      </div>
      
      {isSelected && !isCurrentPlan && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-slate-200"
        >
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.button>
  );
}

interface SubscriptionData {
  status?: string;
  planType?: string;
  isSubscribed?: boolean;
}

// Post-login Premium Page
function AuthenticatedPremium() {
  const { subscription, isLoading } = useSubscription();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<Promise<Stripe | null> | null>(null);
  const [stripeError, setStripeError] = useState<boolean>(false);

  useEffect(() => {
    getStripePromise().then((stripe) => {
      if (stripe) {
        setStripeInstance(Promise.resolve(stripe));
      } else {
        setStripeError(true);
      }
    }).catch(() => {
      setStripeError(true);
    });
  }, []);

  const plans = getAvailablePlans();
  const sub = subscription as SubscriptionData | undefined;
  const isPremium = sub?.status === 'active' || sub?.status === 'trialing';

  const handlePlanSelect = async (planId: string) => {
    if (isPremium) return;
    setSelectedPlan(planId);
    setIsCreatingIntent(true);
    
    try {
      const response = await apiRequest("POST", "/api/create-subscription", { planType: planId });
      const result = await response.json();
      
      // For lifetime plan, redirect to Stripe Checkout
      if (result.sessionUrl) {
        window.location.href = result.sessionUrl;
        return;
      }
      
      // For subscription plans, set up payment form
      setClientSecret(result.clientSecret);
    } catch (error) {
      toast({ title: "Error", description: "Failed to initialize payment. Please try again.", variant: "destructive" });
    } finally {
      setIsCreatingIntent(false);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout title="Premium" showBottomNav={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  // Already Premium - Show Dashboard
  if (isPremium) {
    return (
      <MobileLayout title="Premium" showBottomNav={true}>
        <div className="p-4 space-y-6">
          {/* Status Card */}
          <motion.div
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Premium Active</h2>
                <p className="text-emerald-100 text-sm">Full access to all features</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4" />
              {sub?.planType === 'lifetime' ? 'Lifetime Access' : 
               sub?.planType === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </div>
          </motion.div>

          {/* Quick Access */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Premium Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: DollarSign, label: "Bill Analysis", href: "/bill-ai", color: "emerald" },
                { icon: Brain, label: "AI Training", href: "/patient-diagnostics", color: "blue" },
                { icon: FileText, label: "Templates", href: "/dispute-arsenal", color: "purple" },
                { icon: BarChart3, label: "Analytics", href: "/analytics-dashboard", color: "amber" },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-10 h-10 rounded-lg mb-2 flex items-center justify-center ${
                      item.color === 'emerald' ? 'bg-emerald-100' :
                      item.color === 'blue' ? 'bg-blue-100' :
                      item.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        item.color === 'emerald' ? 'text-emerald-600' :
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Features List */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">All Your Benefits</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              {premiumFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Not Premium - Show Upgrade Options
  return (
    <MobileLayout title="Premium" showBottomNav={true}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Upgrade to Premium</h1>
          <p className="text-gray-600 text-sm max-w-xs mx-auto">
            Unlock professional bill reduction tools and unlimited AI training.
          </p>
        </motion.div>

        {/* Plan Selection */}
        <div className="space-y-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => handlePlanSelect(plan.id)}
              isCurrentPlan={false}
            />
          ))}
        </div>

        {/* Payment Form */}
        {clientSecret && !isCreatingIntent && stripeInstance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Elements stripe={stripeInstance} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <SubscriptionForm planType={selectedPlan} />
            </Elements>
          </motion.div>
        )}

        {stripeError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-700 text-sm font-medium">
              Payment system temporarily unavailable. Please try again later or contact CONTACT@GOLDROCK.ai for assistance.
            </p>
          </div>
        )}

        {isCreatingIntent && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 pt-4">
          {[
            { icon: Lock, label: "Secure" },
            { icon: ShieldCheck, label: "Cancel Anytime" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-gray-400">
              <item.icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="pt-6">
          <h3 className="font-bold text-gray-900 mb-3 text-center">What's Included</h3>
          <div className="grid grid-cols-2 gap-2">
            {premiumFeatures.slice(0, 4).map((feature) => (
              <div key={feature.title} className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                <feature.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

// Main Export
export default function Premium() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MobileLayout title="Premium" showBottomNav={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MobileLayout title="Premium" showBottomNav={false}>
        <LoginPrompt />
      </MobileLayout>
    );
  }

  return <AuthenticatedPremium />;
}
