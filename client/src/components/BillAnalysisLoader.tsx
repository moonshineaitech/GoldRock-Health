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
    description: "Reading your medical bill pages with AI vision",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    duration: 3000
  },
  {
    icon: Search,
    title: "Detecting Billing Errors",
    description: "Searching for duplicate charges and upcoding violations",
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    duration: 4000
  },
  {
    icon: Calculator,
    title: "Calculating Overcharges",
    description: "Comparing charges against Medicare rates and market pricing",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    duration: 3500
  },
  {
    icon: DollarSign,
    title: "Finding Savings Opportunities",
    description: "Identifying charity care and negotiation leverage points",
    color: "text-green-500",
    bgColor: "bg-green-100",
    duration: 4000
  },
  {
    icon: AlertTriangle,
    title: "Analyzing Compliance Issues",
    description: "Checking for billing transparency and regulatory violations",
    color: "text-red-500",
    bgColor: "bg-red-100",
    duration: 3000
  },
  {
    icon: Brain,
    title: "Generating Expert Analysis",
    description: "Creating comprehensive dispute strategies and action plans",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
    duration: 4500
  }
];

const savingsFacts = [
  "80% of medical bills contain billing errors worth $2,000-$35,000+",
  "Average patient saves $8,500 when disputing billing errors",
  "Hospital markup on services averages 417% above cost",
  "Most hospitals offer charity care for bills over $1,000",
  "Bundled services are often incorrectly unbundled for higher charges",
  "Emergency room charges can vary 1,000% between hospitals",
  "Many patients qualify for 50-90% bill reductions they don't know about"
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
      className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Header */}
        <motion.div 
          className="mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Bill Analysis</h1>
          <p className="text-gray-600 text-sm">
            Analyzing {fileCount} page{fileCount > 1 ? 's' : ''} of your medical bill
          </p>
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
              className={`w-16 h-16 ${currentStageData.bgColor} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity }
              }}
            >
              <IconComponent className={`h-8 w-8 ${currentStageData.color}`} />
            </motion.div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStageData.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentStageData.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Stage {currentStage + 1} of {analysisStages.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Rotating Facts */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 mr-2" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Did You Know?
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFact}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-gray-700 leading-relaxed"
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
              className={`absolute w-8 h-8 text-emerald-300/20`}
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
          className="text-xs text-gray-500 mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Hang tight! We're finding every way to save you money...
        </motion.p>
      </div>
    </motion.div>
  );
}