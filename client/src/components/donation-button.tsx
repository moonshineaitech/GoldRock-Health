import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, DollarSign, X } from "lucide-react";
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
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
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
              className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">Make a Donation</h4>
                <button onClick={() => setShowOptions(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleDonation(100)}
                    disabled={isProcessing}
                    variant="outline"
                    className="hover:bg-pink-50 hover:border-pink-300"
                    data-testid="button-donate-1"
                  >
                    $1
                  </Button>
                  <Button
                    onClick={() => handleDonation(500)}
                    disabled={isProcessing}
                    variant="outline"
                    className="hover:bg-pink-50 hover:border-pink-300"
                    data-testid="button-donate-5"
                  >
                    $5
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    data-testid="button-donate-custom"
                  >
                    Donate
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Your support helps us keep the platform running
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - full card
  return (
    <motion.div
      className={`bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border-2 border-pink-200 rounded-2xl p-6 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
          Support Our Mission
        </h3>
      </div>
      
      <p className="text-gray-700 text-center mb-6">
        Help us keep GoldRock AI free and accessible to everyone fighting medical bills
      </p>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleDonation(100)}
            disabled={isProcessing}
            className="bg-white border-2 border-pink-300 text-pink-700 hover:bg-pink-50 font-bold"
            size="lg"
            data-testid="button-donate-1"
          >
            Donate $1
          </Button>
          <Button
            onClick={() => handleDonation(500)}
            disabled={isProcessing}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold"
            size="lg"
            data-testid="button-donate-5"
          >
            Donate $5
          </Button>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-pink-200 focus:border-pink-400"
              min="1"
              step="1"
              data-testid="input-custom-donation"
            />
          </div>
          <Button
            onClick={handleCustomDonation}
            disabled={isProcessing || !customAmount}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold px-8"
            size="lg"
            data-testid="button-donate-custom"
          >
            {isProcessing ? "Processing..." : "Donate"}
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mt-4 text-center">
        🔒 Secure payment via Stripe • Tax-deductible • Cancel anytime
      </p>
    </motion.div>
  );
}
