import { MobileLayout, MobileButton } from "@/components/mobile-layout";
import { Crown, Check, ArrowRight, LogIn, Brain, DollarSign, FileText, Stethoscope, MessageCircle, Clock, Code, UserCheck, ShieldCheck, Sparkles, Lock, Award, BarChart3, Zap, Heart, Shield, RefreshCw, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Capacitor } from "@capacitor/core";
import { revenueCatService } from "@/lib/revenuecat-service";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-8 pb-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Logo */}
          <motion.div 
            className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1 
            className="text-3xl font-serif font-semibold text-foreground mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            GoldRock Premium
          </motion.h1>

          <motion.p 
            className="text-muted-foreground mb-6 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Professional medical bill reduction tools and AI-powered clinical training in one platform.
          </motion.p>

          <motion.a
            href="/api/login"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            data-testid="button-sign-in"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Get Started
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-10 px-4 bg-card">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-serif font-semibold text-center text-foreground mb-6">Everything You Get</h2>
          <div className="grid grid-cols-2 gap-3">
            {premiumFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="luxury-card p-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-10 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-serif font-semibold text-center text-foreground mb-6">Simple Pricing</h2>
          <div className="space-y-3">
            {getAvailablePlans().map((plan) => (
              <div
                key={plan.id}
                className={`relative p-4 rounded-xl border-2 bg-card ${
                  plan.popular ? '' : 'border-border'
                }`}
                style={plan.popular ? { borderColor: 'var(--gold)' } : undefined}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-2.5 left-4 px-2 py-0.5 text-white text-xs font-bold rounded-full"
                    style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                  >
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                    {plan.savings && (
                      <span className="text-xs text-gold font-semibold">{plan.savings}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.period === 'one-time' ? 'once' : plan.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.a
            href="/api/login"
            className="block mt-6 w-full text-center px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In to Subscribe
          </motion.a>

          <p className="text-[10px] leading-relaxed text-muted-foreground text-center mt-4">
            Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. 
            Your account will be charged for renewal within 24 hours prior to the end of the current period. 
            You can manage and cancel your subscriptions by going to your Account Settings on the App Store after purchase.
            {' '}
            <Link href="/privacy-policy" className="underline text-foreground">Privacy Policy</Link>
            {' · '}
            <Link href="/terms-of-service" className="underline text-foreground">Terms of Service</Link>
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 px-4 bg-card">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6">
          {[
            { icon: Lock, label: "Secure Payments" },
            { icon: ShieldCheck, label: "Cancel Anytime" },
            { icon: Sparkles, label: "Instant Access" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-muted-foreground">
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
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
        <PaymentElement options={{ layout: { type: 'tabs', defaultCollapsed: false } }} />
      </div>
      <MobileButton
        type="submit"
        className="w-full py-4"
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
      <p className="text-xs text-center text-muted-foreground">
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
      className={`w-full text-left p-4 rounded-xl border-2 transition-all bg-card ${
        isCurrentPlan
          ? 'cursor-default'
          : isSelected
          ? 'shadow-md'
          : 'border-border hover:shadow-md'
      }`}
      style={isCurrentPlan || isSelected ? { borderColor: 'var(--gold)' } : undefined}
      whileHover={!isCurrentPlan ? { y: -2 } : {}}
      whileTap={!isCurrentPlan ? { scale: 0.99 } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground">{plan.name}</h3>
            {plan.popular && (
              <span
                className="px-2 py-0.5 text-white text-xs font-bold rounded-full"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              >
                Popular
              </span>
            )}
            {isCurrentPlan && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                Current
              </span>
            )}
          </div>
          {plan.savings && <p className="text-xs text-gold font-semibold mt-0.5">{plan.savings}</p>}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-foreground">${plan.price}</span>
          <span className="text-muted-foreground text-sm">/{plan.period === 'one-time' ? 'once' : plan.period}</span>
        </div>
      </div>
      
      {isSelected && !isCurrentPlan && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-border"
        >
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.button>
  );
}

function RestorePurchasesButton() {
  const { toast } = useToast();
  const [isRestoring, setIsRestoring] = useState(false);
  const isIOS = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      if (isIOS && revenueCatService.isAvailable()) {
        await revenueCatService.restorePurchases();
        toast({ title: "Purchases Restored", description: "Your previous purchases have been restored successfully." });
        setTimeout(() => window.location.reload(), 1500);
      } else if (isIOS) {
        toast({ title: "Not Available", description: "Purchase restoration requires an active App Store connection. Please try again.", variant: "destructive" });
      } else {
        const response = await apiRequest("POST", "/api/verify-subscription", {});
        const result = await response.json();
        if (result.status === 'active') {
          toast({ title: "Subscription Found", description: "Your subscription has been verified and restored." });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast({ title: "No Active Subscription", description: "No previous subscription was found for this account." });
        }
      }
    } catch (error: any) {
      toast({ title: "Restore Failed", description: error?.message || "Unable to restore purchases. Please try again or contact CONTACT@GOLDROCK.ai for help.", variant: "destructive" });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="text-center pt-2">
      <button
        onClick={handleRestore}
        disabled={isRestoring}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
        {isRestoring ? 'Restoring...' : 'Restore Purchases'}
      </button>
    </div>
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
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
            className="rounded-2xl p-6 text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold">Premium Active</h2>
                <p className="text-white/80 text-sm">Full access to all features</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Check className="w-4 h-4" />
              {sub?.planType === 'lifetime' ? 'Lifetime Access' : 
               sub?.planType === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </div>
          </motion.div>

          {/* Quick Access */}
          <div>
            <h3 className="font-bold text-foreground mb-3">Premium Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: DollarSign, label: "Bill Analysis", href: "/bill-ai" },
                { icon: Brain, label: "AI Training", href: "/patient-diagnostics" },
                { icon: FileText, label: "Templates", href: "/dispute-arsenal" },
                { icon: BarChart3, label: "Analytics", href: "/analytics-dashboard" },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    className="luxury-card p-4 hover:shadow-md transition-shadow"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center bg-secondary">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Features List */}
          <div>
            <h3 className="font-bold text-foreground mb-3">All Your Benefits</h3>
            <div className="bg-secondary rounded-xl p-4 space-y-3">
              {premiumFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shadow-sm flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
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
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          >
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Upgrade to Premium</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
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

        {/* For teams / employers cross-link */}
        <Link href="/for-employers" className="block rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow" data-testid="link-for-employers">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Buying for your team?</p>
              <p className="text-xs text-muted-foreground">GoldRock for Teams — per-seat plans for employers</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </Link>

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
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-center">
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">
              Payment system temporarily unavailable. Please try again later or contact CONTACT@GOLDROCK.ai for assistance.
            </p>
          </div>
        )}

        {isCreatingIntent && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 pt-4">
          {[
            { icon: Lock, label: "Secure" },
            { icon: ShieldCheck, label: "Cancel Anytime" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-muted-foreground">
              <item.icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Restore Purchases Button */}
        <RestorePurchasesButton />

        {/* Apple Required Subscription Disclosure */}
        <div className="pt-2 px-2">
          <p className="text-[10px] leading-relaxed text-muted-foreground text-center">
            {Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? (
              <>
                Payment will be charged to your Apple ID account at confirmation of purchase. 
                Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. 
                Your account will be charged for renewal within 24 hours prior to the end of the current period. 
                You can manage and cancel your subscriptions by going to your Account Settings on the App Store after purchase.
              </>
            ) : (
              <>
                Subscriptions automatically renew unless cancelled before the end of the current billing period.
                You can manage or cancel your subscription at any time from your account settings.
              </>
            )}
            {' '}
            <Link href="/privacy-policy" className="underline text-foreground">Privacy Policy</Link>
            {' · '}
            <Link href="/terms-of-service" className="underline text-foreground">Terms of Service</Link>
          </p>
        </div>

        {/* Features Preview */}
        <div className="pt-6">
          <h3 className="font-bold text-foreground mb-3 text-center">What's Included</h3>
          <div className="grid grid-cols-2 gap-2">
            {premiumFeatures.slice(0, 4).map((feature) => (
              <div key={feature.title} className="bg-secondary rounded-xl p-3 flex items-center gap-2">
                <feature.icon className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">{feature.title}</span>
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
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
