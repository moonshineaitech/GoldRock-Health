import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, DollarSign, FileText, ArrowRight, CheckCircle, Zap, Eye, AlertTriangle } from "lucide-react";
import { MobileButton, MobileCard } from "@/components/mobile-layout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface BlitzDemoProps {
  variant?: "landing" | "auth-landing";
}

export function BlitzDemo({ variant = "landing" }: BlitzDemoProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Sample demo results showing the value proposition
  const demoResults = {
    totalBilled: 12450,
    potentialSavings: 8700,
    overcharges: [
      { item: "Routine Blood Work", billed: 1200, fair: 250, savings: 950 },
      { item: "X-Ray Imaging", billed: 2400, fair: 400, savings: 2000 },
      { item: "Emergency Room Fee", billed: 4500, fair: 1200, savings: 3300 },
      { item: "Medical Supplies", billed: 850, fair: 120, savings: 730 },
      { item: "Consultation Fee", billed: 1500, fair: 780, savings: 720 }
    ],
    nextSteps: [
      "Dispute letter generated with legal citations",
      "Itemized billing code analysis completed",
      "Hospital billing department contact info verified",
      "90-day response timeline tracked automatically"
    ]
  };

  const handleTryDemo = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic timing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsAnalyzing(false);
    setShowResults(true);
    
    toast({
      title: "Demo Analysis Complete! 🎉",
      description: "See how GoldRock AI identifies overcharges and potential savings",
      duration: 5000
    });
  };

  const handleUseSample = async () => {
    toast({
      title: "Loading Sample Bill",
      description: "Using example emergency room visit...",
      duration: 2000
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    handleTryDemo();
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Results Header */}
        <MobileCard className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-200">
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                Example Analysis Complete!
              </h3>
              <p className="text-gray-600 font-medium">
                Based on similar emergency room visits
              </p>
            </div>

            {/* Savings Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl"
            >
              <p className="text-white/90 text-sm font-bold mb-1">Example Potential Savings</p>
              <p className="text-5xl font-black text-white mb-1">
                ${demoResults.potentialSavings.toLocaleString()}
              </p>
              <p className="text-white/80 text-xs font-medium">
                From ${demoResults.totalBilled.toLocaleString()} total billed
              </p>
            </motion.div>
          </div>
        </MobileCard>

        {/* Overcharges Identified */}
        <MobileCard>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Example Overcharges Identified
          </h4>
          <div className="space-y-2">
            {demoResults.overcharges.slice(0, 3).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="flex items-start justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.item}</p>
                  <p className="text-xs text-gray-600">Fair price: ${item.fair}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold text-sm">-${item.savings}</p>
                  <p className="text-xs text-gray-500">overcharge</p>
                </div>
              </motion.div>
            ))}
            <p className="text-xs text-gray-500 text-center pt-2">
              +{demoResults.overcharges.length - 3} more overcharges identified
            </p>
          </div>
        </MobileCard>

        {/* Next Steps */}
        <MobileCard className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
            <Zap className="h-5 w-5 text-blue-500 mr-2" />
            What Happens Next (Full Version)
          </h4>
          <div className="space-y-2">
            {demoResults.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start space-x-2"
              >
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>
        </MobileCard>

        {/* Strong CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Link href="/auth-landing">
            <MobileButton
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white shadow-2xl shadow-emerald-500/40"
              size="lg"
              data-testid="button-signup-demo"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Get Full Analysis - Sign Up Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </MobileButton>
          </Link>
          
          <p className="text-xs text-gray-600 text-center">
            🎁 Platform currently free • No credit card required • Example results shown
          </p>
          
          <button
            onClick={() => setShowResults(false)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
            data-testid="button-try-another"
          >
            Try Another Demo
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <MobileCard className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-2 border-purple-200">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
        >
          <Eye className="h-8 w-8 text-white" />
        </motion.div>

        <div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            See It In Action
          </h3>
          <p className="text-gray-700 font-medium text-sm">
            Try our AI bill analyzer with a sample emergency room bill - no sign up required
          </p>
        </div>

        <AnimatePresence>
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"
              />
              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-semibold text-gray-700"
                >
                  Analyzing billing codes...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm font-semibold text-gray-700"
                >
                  Comparing to fair market rates...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-sm font-semibold text-gray-700"
                >
                  Identifying overcharges...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <MobileButton
                onClick={handleUseSample}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl"
                size="lg"
                data-testid="button-demo-sample"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Try Sample Bill Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </MobileButton>
              
              <p className="text-xs text-gray-500">
                Uses example emergency room visit showing ${demoResults.potentialSavings.toLocaleString()} potential savings
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileCard>
  );
}
