import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, Lock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface PremiumPaywallOverlayProps {
  title: string;
  description: string;
  featureName: string;
  savingsPotential?: string;
}

export function PremiumPaywallOverlay({ 
  title, 
  description, 
  featureName,
  savingsPotential 
}: PremiumPaywallOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-orange-200 flex flex-col items-center justify-center p-6 z-10"
    >
      <div className="text-center space-y-4">
        {/* Premium Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Crown className="h-8 w-8 text-white" />
        </div>
        
        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Savings Potential */}
        {savingsPotential && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="text-emerald-700 font-semibold text-sm">
              💰 Example outcomes: {savingsPotential}
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              Results vary by individual case
            </div>
          </div>
        )}
        
        {/* Feature Badge */}
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
          <Lock className="h-3 w-3" />
          <span>Premium Feature</span>
        </div>
        
        {/* Upgrade Button */}
        <Link href="/premium">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            data-testid={`upgrade-${featureName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        
        {/* Help Text */}
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Get instant access to professional bill negotiation tools and identify potential billing errors
        </p>
      </div>
    </motion.div>
  );
}