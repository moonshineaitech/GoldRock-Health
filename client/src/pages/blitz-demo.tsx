import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Brain, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  Zap,
  Star,
  Trophy,
  Crown,
  ArrowRight,
  Target,
  Shield,
  Clock,
  Sparkles,
  BarChart3,
  FileText,
  Calculator,
  Award,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { DemoStatsPanel } from "@/components/DemoStatsPanel";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";
import { MobileLayout } from "@/components/mobile-layout";

interface DemoStage {
  id: 'input' | 'analyzing' | 'results';
  title: string;
  description: string;
}

interface QuickAnalysisResult {
  errorCount: number;
  overchargeAmount: string;
  negotiationPotential: string;
  totalSavings: string;
  confidence: number;
}

const demoStages: DemoStage[] = [
  {
    id: 'input',
    title: 'Quick Bill Input',
    description: 'Enter basic bill information for instant analysis'
  },
  {
    id: 'analyzing', 
    title: 'AI Analysis in Progress',
    description: 'Our AI is scanning for errors and overcharges'
  },
  {
    id: 'results',
    title: 'Savings Identified!',
    description: 'Your personalized bill analysis is complete'
  }
];

const analysisSteps = [
  { text: "Scanning for duplicate charges...", duration: 2000, icon: RefreshCcw },
  { text: "Checking medical codes for errors...", duration: 1500, icon: FileText },
  { text: "Comparing against market rates...", duration: 2000, icon: BarChart3 },
  { text: "Calculating negotiation opportunities...", duration: 1500, icon: Target },
  { text: "Generating savings strategy...", duration: 1000, icon: Brain }
];

export default function BlitzDemo() {
  const { isSubscribed, createSubscription } = useSubscription();
  const { toast } = useToast();
  
  // Demo state
  const [currentStage, setCurrentStage] = useState<'input' | 'analyzing' | 'results'>('input');
  const [billAmount, setBillAmount] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<QuickAnalysisResult | null>(null);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);

  // Pre-fill demo data option
  const fillDemoData = () => {
    setBillAmount('$47,850');
    setHospitalName('Metro General Hospital');
    toast({
      title: "Demo Data Loaded",
      description: "Sample emergency surgery bill loaded for demonstration",
    });
  };

  // Start analysis simulation
  const startAnalysis = () => {
    if (!billAmount || !hospitalName) {
      toast({
        title: "Missing Information",
        description: "Please enter bill amount and hospital name to continue",
        variant: "destructive",
      });
      return;
    }

    setCurrentStage('analyzing');
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);

    // Simulate progressive analysis steps
    let totalTime = 0;
    let currentProgress = 0;

    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentAnalysisStep(index);
        
        // Update progress smoothly
        const progressIncrement = 100 / analysisSteps.length;
        const targetProgress = (index + 1) * progressIncrement;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
          }
          setAnalysisProgress(currentProgress);
        }, 50);

        // On final step, generate results
        if (index === analysisSteps.length - 1) {
          setTimeout(() => {
            generateResults();
          }, step.duration);
        }
      }, totalTime);
      
      totalTime += step.duration;
    });
  };

  // Generate realistic demo results
  const generateResults = () => {
    const amount = parseFloat(billAmount.replace(/[$,]/g, '')) || 47850;
    
    const results: QuickAnalysisResult = {
      errorCount: Math.floor(Math.random() * 8) + 12, // 12-20 errors
      overchargeAmount: `$${Math.round(amount * (0.15 + Math.random() * 0.25)).toLocaleString()}`, // 15-40% overcharge
      negotiationPotential: `$${Math.round(amount * (0.35 + Math.random() * 0.30)).toLocaleString()}`, // 35-65% negotiation
      totalSavings: `$${Math.round(amount * (0.45 + Math.random() * 0.35)).toLocaleString()}`, // 45-80% total savings
      confidence: 85 + Math.floor(Math.random() * 12) // 85-96% confidence
    };

    setAnalysisResults(results);
    setCurrentStage('results');
    
    // Show premium upgrade after a moment
    setTimeout(() => {
      if (!isSubscribed) {
        setShowPremiumUpgrade(true);
      }
    }, 3000);
  };

  const handleUpgrade = () => {
    createSubscription.mutate({ planType: 'monthly' });
  };

  const resetDemo = () => {
    setCurrentStage('input');
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    setAnalysisResults(null);
    setShowPremiumUpgrade(false);
    setBillAmount('');
    setHospitalName('');
  };

  return (
    <MobileLayout title="AI Bill Analysis Demo">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Bill AI</h1>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  BLITZ DEMO
                </Badge>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              See how AI finds thousands in hidden savings in under 60 seconds
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              {demoStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStage === stage.id 
                      ? 'bg-blue-600 text-white' 
                      : index < demoStages.findIndex(s => s.id === currentStage)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < demoStages.findIndex(s => s.id === currentStage) ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < demoStages.length - 1 && (
                    <div className={`w-12 h-1 mx-2 ${
                      index < demoStages.findIndex(s => s.id === currentStage) 
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {demoStages.find(s => s.id === currentStage)?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {demoStages.find(s => s.id === currentStage)?.description}
              </p>
            </div>
          </Card>

          {/* Stage Content */}
          <AnimatePresence mode="wait">
            {currentStage === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Total Bill Amount *
                      </label>
                      <Input
                        data-testid="input-bill-amount"
                        placeholder="e.g., $47,850"
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Hospital/Provider Name *
                      </label>
                      <Input
                        data-testid="input-hospital-name"
                        placeholder="e.g., Metro General Hospital"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        data-testid="button-start-analysis"
                        onClick={startAnalysis}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Start AI Analysis
                      </Button>
                      <Button
                        data-testid="button-demo-data"
                        variant="outline"
                        onClick={fillDemoData}
                        className="px-6"
                      >
                        Demo Data
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Live Demo Stats */}
                <DemoStatsPanel isVisible={true} />
              </motion.div>
            )}

            {currentStage === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <Card className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <Brain className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI Analysis in Progress
                  </h3>
                  
                  <div className="space-y-4">
                    <Progress value={analysisProgress} className="w-full" />
                    <div className="text-sm text-gray-600">
                      {analysisProgress.toFixed(0)}% Complete
                    </div>
                    
                    {analysisSteps[currentAnalysisStep] && (
                      <motion.div
                        key={currentAnalysisStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        {(() => {
                          const StepIcon = analysisSteps[currentAnalysisStep].icon;
                          return <StepIcon className="h-4 w-4 text-blue-600" />;
                        })()}
                        <span className="text-sm font-medium text-gray-700">
                          {analysisSteps[currentAnalysisStep].text}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </Card>

                {/* Quick stats during analysis */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Errors Found', value: '15+', icon: AlertTriangle, color: 'text-red-600' },
                    { label: 'Overcharges', value: '$12K+', icon: DollarSign, color: 'text-orange-600' },
                    { label: 'Savings Found', value: '$35K+', icon: TrendingUp, color: 'text-green-600' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card className="p-3 text-center">
                        <stat.icon className={`h-6 w-6 mx-auto mb-1 ${stat.color}`} />
                        <div className="font-bold text-lg">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStage === 'results' && analysisResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                      <Trophy className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {analysisResults.totalSavings} in Savings Found!
                    </h3>
                    <p className="text-green-700">
                      Our AI identified {analysisResults.errorCount} billing errors with {analysisResults.confidence}% confidence
                    </p>
                  </div>
                </Card>

                {/* Detailed Results */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      label: 'Billing Errors', 
                      value: `${analysisResults.errorCount} found`, 
                      icon: FileText, 
                      color: 'text-red-600',
                      bgColor: 'bg-red-100'
                    },
                    { 
                      label: 'Overcharge Amount', 
                      value: analysisResults.overchargeAmount, 
                      icon: AlertTriangle, 
                      color: 'text-orange-600',
                      bgColor: 'bg-orange-100'
                    },
                    { 
                      label: 'Negotiation Potential', 
                      value: analysisResults.negotiationPotential, 
                      icon: Target, 
                      color: 'text-blue-600',
                      bgColor: 'bg-blue-100'
                    },
                    { 
                      label: 'Confidence Score', 
                      value: `${analysisResults.confidence}%`, 
                      icon: Shield, 
                      color: 'text-green-600',
                      bgColor: 'bg-green-100'
                    }
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">{metric.label}</div>
                            <div className="font-bold text-lg">{metric.value}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Savings Calculator Integration */}
                <SavingsCalculator 
                  billAmount={billAmount}
                  provider={hospitalName}
                  isVisible={true}
                  analysisStage="complete"
                />

                {/* Premium Upgrade CTA */}
                <AnimatePresence>
                  {showPremiumUpgrade && !isSubscribed && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                    >
                      <PremiumFeatureShowcase
                        isSubscribed={isSubscribed}
                        onUpgrade={handleUpgrade}
                        savingsAmount={analysisResults.totalSavings.replace('$', '').replace(',', '')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    data-testid="button-try-another"
                    onClick={resetDemo}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Try Another Bill
                  </Button>
                  {!isSubscribed && (
                    <Button
                      data-testid="button-get-premium"
                      onClick={handleUpgrade}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Get Premium Access
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>✨ This is a demonstration of our AI medical bill analysis capabilities</p>
            <p>Results are simulated for demo purposes. Real analysis provides actual savings.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}