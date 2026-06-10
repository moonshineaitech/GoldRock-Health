import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Calculator, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  Brain,
  Shield,
  TrendingUp
} from 'lucide-react';

interface BillAnalysisLoaderProps {
  fileCount: number;
  isVisible: boolean;
}

const analysisStages = [
  {
    icon: FileText,
    title: "Scanning Documents",
    description: "Reading your medical bill pages with AI vision technology",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 2800,
    details: "Processing OCR and extracting text from images"
  },
  {
    icon: Search,
    title: "Error Detection Analysis",
    description: "AI scanning for duplicate charges, upcoding, and unbundling violations",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 3500,
    details: "Checking 47 common billing error patterns"
  },
  {
    icon: Calculator,
    title: "Price Benchmarking",
    description: "Comparing your charges against Medicare rates and fair market pricing",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 3200,
    details: "Analyzing pricing vs. 15,000+ hospital databases"
  },
  {
    icon: Shield,
    title: "Insurance Verification",
    description: "Checking coverage requirements and prior authorization issues",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 2900,
    details: "Cross-referencing insurance policies and benefits"
  },
  {
    icon: DollarSign,
    title: "Savings Calculation",
    description: "Identifying negotiation opportunities and financial assistance programs",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 3800,
    details: "Calculating your potential savings opportunities"
  },
  {
    icon: AlertTriangle,
    title: "Compliance Audit",
    description: "Checking billing transparency laws and regulatory violations",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 2600,
    details: "Verifying adherence to federal billing requirements"
  },
  {
    icon: CheckCircle2,
    title: "Strategy Generation",
    description: "AI creating personalized dispute letters and negotiation scripts",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 4200,
    details: "Generating custom action plan for maximum savings"
  },
  {
    icon: Brain,
    title: "Expert Analysis Complete",
    description: "Comprehensive bill assessment with actionable recommendations",
    color: "text-gold",
    bgColor: "bg-secondary",
    duration: 2000,
    details: "Ready to save you thousands on medical bills"
  }
];

const savingsFacts = [
  "Medical billing errors are common — always review your itemized bill carefully",
  "Many patients find overcharges when they compare bills to Medicare fair pricing",
  "Hospitals often have significant markup on services above actual cost",
  "Most hospitals offer charity care discounts for qualifying patients",
  "Bundled services are sometimes improperly unbundled, leading to higher charges",
  "Emergency room charges can vary widely between hospitals for identical care",
  "Many patients qualify for financial assistance programs they don't know about",
  "Medicare rates are publicly available and useful for comparing what you're charged",
  "Proper documentation strengthens any bill dispute significantly",
  "AI analysis can help identify billing errors that are easy to overlook",
  "Patients who negotiate their bills often see meaningful reductions",
  "Out-of-network bills can often be reduced to in-network rates with advocacy"
];

export function BillAnalysisLoader({ fileCount, isVisible }: BillAnalysisLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let stageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    let factTimer: NodeJS.Timeout;

    const startStage = (stageIndex: number) => {
      if (stageIndex >= analysisStages.length) {
        // Loop back to beginning if we've gone through all stages
        setCurrentStage(0);
        setProgress(0);
        startStage(0);
        return;
      }

      const stage = analysisStages[stageIndex];
      const progressIncrement = 100 / (stage.duration / 50);

      // Progress animation
      let currentProgress = 0;
      progressTimer = setInterval(() => {
        currentProgress += progressIncrement;
        setProgress(Math.min(currentProgress, 100));
      }, 50);

      // Move to next stage
      stageTimer = setTimeout(() => {
        setCurrentStage(stageIndex + 1);
        setProgress(0);
        clearInterval(progressTimer);
        startStage(stageIndex + 1);
      }, stage.duration);
    };

    // Rotate facts every 3 seconds
    factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % savingsFacts.length);
    }, 3000);

    startStage(0);

    return () => {
      clearTimeout(stageTimer);
      clearInterval(progressTimer);
      clearInterval(factTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStageData = analysisStages[currentStage] || analysisStages[0];
  const IconComponent = currentStageData.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Header */}
        <motion.div 
          className="mb-10"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div 
            className="w-24 h-24 medical-gradient rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-sm relative overflow-hidden"
            animate={{ 
              rotate: [0, 360],
              boxShadow: [
                "0 20px 40px rgba(176, 141, 87, 0.18)",
                "0 25px 50px rgba(176, 141, 87, 0.26)",
                "0 20px 40px rgba(176, 141, 87, 0.18)"
              ]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Brain className="h-12 w-12 text-white relative z-10" />
          </motion.div>
          <h1 className="text-3xl font-bold luxury-text-gradient mb-3">
            AI Bill Analysis
          </h1>
          <motion.p 
            className="text-foreground text-base font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Analyzing {fileCount} page{fileCount > 1 ? 's' : ''} of your medical bill
          </motion.p>
        </motion.div>

        {/* Current Stage Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <motion.div 
              className={`w-24 h-24 ${currentStageData.bgColor} rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-sm relative overflow-hidden`}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 8px 25px rgba(0,0,0,0.12)",
                  "0 15px 35px rgba(0,0,0,0.18)",
                  "0 8px 25px rgba(0,0,0,0.12)"
                ]
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.5, repeat: Infinity },
                boxShadow: { duration: 2.5, repeat: Infinity }
              }}
            >
              <IconComponent className={`h-12 w-12 ${currentStageData.color} relative z-10`} />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {currentStageData.title}
            </h2>
            <p className="text-foreground text-base leading-relaxed mb-3 font-medium">
              {currentStageData.description}
            </p>
            <motion.p 
              className="text-sm text-muted-foreground italic"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStageData.details}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Stage {currentStage + 1} of {analysisStages.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-gold h-2 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Rotating Facts */}
        <motion.div 
          className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-4 w-4 text-gold mr-2" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              Did You Know?
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFact}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-foreground leading-relaxed"
            >
              {savingsFacts[currentFact]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Floating Icons Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[DollarSign, Shield, CheckCircle2, Zap].map((Icon, index) => (
            <motion.div
              key={index}
              className={`absolute w-8 h-8 text-amber-300/25`}
              style={{
                left: `${20 + (index * 20)}%`,
                top: `${30 + (index * 15)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Text */}
        <motion.p 
          className="text-xs text-muted-foreground mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Hang tight! We're finding every way to save you money...
        </motion.p>
      </div>
    </motion.div>
  );
}