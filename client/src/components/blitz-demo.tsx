import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Sparkles, 
  DollarSign, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Eye, 
  AlertTriangle, 
  Brain
} from "lucide-react";
import { MobileButton, MobileCard } from "@/components/mobile-layout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface BlitzDemoProps {
  variant?: "landing" | "auth-landing";
}

export function BlitzDemo({ variant = "landing" }: BlitzDemoProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0=initial, 1=upload, 2=analyzing, 3=templates, 4=results
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Sample demo results
  const demoResults = {
    totalBilled: 12450,
    potentialSavings: 8700,
    overcharges: [
      { item: "Routine Blood Work", billed: 1200, fair: 250, savings: 950 },
      { item: "X-Ray Imaging", billed: 2400, fair: 400, savings: 2000 },
      { item: "Emergency Room Fee", billed: 4500, fair: 1200, savings: 3300 }
    ],
    industrySecrets: [
      "🔍 Insurance companies rely on you NOT checking itemized bills - always request them",
      "💡 Hospitals mark up items 300-400% knowing most won't dispute",
      "⚡ Mentioning 'balance billing' laws often triggers immediate reductions",
      "📋 Medical billing errors occur in 80% of hospital bills - this is industry standard"
    ]
  };
  
  const processSteps = [
    { 
      title: "1. Upload Bill", 
      desc: "You upload your medical bill photo or PDF", 
      icon: Upload,
      detail: "Our system accepts photos, PDFs, and scanned documents"
    },
    { 
      title: "2. AI Analysis", 
      desc: "AI scans for billing errors and overcharges using GPT-4o Vision", 
      icon: Brain,
      detail: "Analyzes CPT codes, duplicates, upcoding, and fair market rates"
    },
    { 
      title: "3. Generate Templates", 
      desc: "We create dispute letters with legal citations", 
      icon: FileText,
      detail: "Professional templates citing HIPAA, No Surprises Act, and state laws"
    },
    { 
      title: "4. Industry Secrets", 
      desc: "Get insider negotiation tactics hospitals don't want you to know", 
      icon: Sparkles,
      detail: "Expert strategies used by medical billing advocates"
    }
  ];

  const handleTryDemo = async () => {
    // Step through the process
    setCurrentStep(1);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setCurrentStep(2);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCurrentStep(3);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setCurrentStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowResults(true);
    
    toast({
      title: "Demo Complete! 🎉",
      description: "See how GoldRock AI identifies overcharges and savings",
      duration: 5000
    });
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
              className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto shadow-lg"
            >
              <CheckCircle className="h-7 w-7 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1">
                Example Analysis Complete!
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Based on similar emergency room visits
              </p>
            </div>

            {/* Savings Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-xl p-5 shadow-lg"
            >
              <p className="text-white/90 text-xs font-bold mb-1">Example Potential Savings</p>
              <p className="text-4xl font-black text-white mb-1">
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
          <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
            Example Overcharges Identified
          </h4>
          <div className="space-y-2">
            {demoResults.overcharges.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="flex items-start justify-between p-2.5 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-xs">{item.item}</p>
                  <p className="text-[10px] text-gray-600">Fair price: ${item.fair}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold text-xs">-${item.savings}</p>
                  <p className="text-[10px] text-gray-500">overcharge</p>
                </div>
              </motion.div>
            ))}
          </div>
        </MobileCard>

        {/* Industry Secrets */}
        <MobileCard className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            Industry Secrets Revealed
          </h4>
          <div className="space-y-2">
            {demoResults.industrySecrets.map((secret, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg"
              >
                <p className="text-xs text-gray-700 leading-relaxed">{secret}</p>
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
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white shadow-xl shadow-emerald-500/30 text-sm py-2.5"
              data-testid="button-signup-demo"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get Full Analysis - Sign Up Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <p className="text-[10px] text-gray-600 text-center">
            🎁 Platform currently free • No credit card required • Example results shown
          </p>
          
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentStep(0);
            }}
            className="w-full text-xs text-gray-500 hover:text-gray-700 font-medium"
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
      <div className="space-y-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg mb-3"
          >
            <Eye className="h-7 w-7 text-white" />
          </motion.div>

          <h3 className="text-xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            See How It Works
          </h3>
          <p className="text-gray-700 font-medium text-xs">
            Watch the step-by-step process with sample emergency room bill
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-2">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-400' 
                    : isCompleted
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
                    : 'bg-white/60 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                      : isCompleted
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className={`h-5 w-5 ${isActive || isCompleted ? 'text-white' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xs mb-0.5">{step.title}</p>
                    <p className="text-[11px] text-gray-600 leading-tight">{step.desc}</p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[10px] text-purple-600 font-medium mt-1"
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </div>
                  {isActive && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full flex-shrink-0"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Demo Button */}
        <AnimatePresence mode="wait">
          {currentStep === 0 ? (
            <motion.div
              key="demo-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MobileButton
                onClick={handleTryDemo}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg text-sm py-2.5"
                data-testid="button-demo-sample"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Watch Demo Process
                <ArrowRight className="h-4 w-4 ml-2" />
              </MobileButton>
              <p className="text-[10px] text-gray-500 text-center mt-2">
                See example $8,700 savings identified step-by-step
              </p>
            </motion.div>
          ) : currentStep < 5 ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2"
            >
              <p className="text-xs font-semibold text-purple-600">
                Processing step {currentStep} of 4...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MobileCard>
  );
}
