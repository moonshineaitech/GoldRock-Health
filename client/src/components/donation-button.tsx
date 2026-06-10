import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, DollarSign, X, Sparkles, Users, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DonationButtonProps {
  variant?: "default" | "compact";
  className?: string;
}

export function DonationButton({ variant = "default", className = "" }: DonationButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDonation = async (amount: number) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/create-donation-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create donation session');
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: "Unable to process donation. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleCustomDonation = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount of at least $1",
        variant: "destructive"
      });
      return;
    }
    handleDonation(Math.round(amount * 100)); // Convert to cents
  };

  if (variant === "compact") {
    return (
      <div className={className}>
        <Button
          onClick={() => setShowOptions(!showOptions)}
          className="bg-primary text-primary-foreground shadow-sm"
          size="sm"
          data-testid="button-donate"
        >
          <Heart className="h-4 w-4 mr-2" />
          Support Us
        </Button>
        
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-50 mt-2 bg-popover rounded-xl shadow-lg border border-border p-4 min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-foreground">Make a Donation</h4>
                <button onClick={() => setShowOptions(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleDonation(100)}
                    disabled={isProcessing}
                    variant="outline"
                    className="hover:bg-secondary"
                    data-testid="button-donate-1"
                  >
                    $1
                  </Button>
                  <Button
                    onClick={() => handleDonation(500)}
                    disabled={isProcessing}
                    variant="outline"
                    className="hover:bg-secondary"
                    data-testid="button-donate-5"
                  >
                    $5
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Custom"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-9"
                      min="1"
                      step="1"
                      data-testid="input-custom-donation"
                    />
                  </div>
                  <Button
                    onClick={handleCustomDonation}
                    disabled={isProcessing || !customAmount}
                    className="bg-primary text-primary-foreground"
                    data-testid="button-donate-custom"
                  >
                    Donate
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Your support helps us keep the platform running
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - Atelier editorial design
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-sm"
              style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Heart className="h-10 w-10 text-white fill-white" strokeWidth={2} />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3 leading-tight">
              Support Our Mission
            </h3>
            <p className="text-muted-foreground text-base md:text-lg font-medium max-w-md mx-auto leading-relaxed">
              Help us keep GoldRock AI free for families fighting unfair medical bills
            </p>
          </div>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Users, label: "Users Helped", value: "12K+" },
              { icon: TrendingUp, label: "Bills Reduced", value: "$45M+" },
              { icon: Shield, label: "Success Rate", value: "91%" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center bg-secondary rounded-2xl p-4 border border-border"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
              >
                <stat.icon className="h-6 w-6 text-muted-foreground mx-auto mb-2" strokeWidth={2} />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Donation Options */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <Button
                  onClick={() => handleDonation(500)}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full font-bold h-14 text-lg"
                  data-testid="button-donate-5"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Donate $5
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <Button
                  onClick={() => handleDonation(1000)}
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground font-bold h-14 text-lg shadow-sm"
                  data-testid="button-donate-10"
                >
                  <Heart className="h-5 w-5 mr-2 fill-current" />
                  Donate $10
                </Button>
              </motion.div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative flex-1">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-11 h-14 text-lg bg-background border border-border font-semibold"
                  min="1"
                  step="1"
                  data-testid="input-custom-donation"
                />
              </div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <Button
                  onClick={handleCustomDonation}
                  disabled={isProcessing || !customAmount}
                  className="bg-primary text-primary-foreground font-bold h-14 px-8 text-lg shadow-sm"
                  data-testid="button-donate-custom"
                >
                  {isProcessing ? "Processing..." : "Donate"}
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Trust Badge */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-3 text-muted-foreground text-sm font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Shield className="h-4 w-4" />
            <span>Secure payment via Stripe</span>
            <span className="text-muted-foreground">•</span>
            <span>Tax-deductible</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
