import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileButton, MobileCard } from "@/components/mobile-layout";
import { 
  Stethoscope, 
  ArrowRight, 
  ArrowLeft,
  Brain, 
  Zap, 
  Trophy, 
  Crown, 
  Star,
  Check,
  X,
  Sparkles,
  Volume2,
  Play,
  Users,
  BarChart3
} from "lucide-react";
import { useLocation } from "wouter";

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  isPremiumFeature?: boolean;
  premiumHint?: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "welcome",
    title: "Welcome to MedTrainer AI",
    description: "Your personal medical training companion powered by advanced AI",
    icon: Stethoscope,
    content: (
      <div className="text-center py-8">
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
        >
          <Stethoscope className="h-12 w-12 text-white" />
        </motion.div>
        <motion.p 
          className="text-lg text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Train with realistic patient cases, improve your diagnostic skills, and track your progress
        </motion.p>
        <motion.div 
          className="flex items-center justify-center space-x-6 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-600 mr-2" />
            <span>60+ Medical Cases</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-600 mr-2" />
            <span>19 Specialties</span>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: "training",
    title: "Interactive Patient Cases",
    description: "Practice with realistic medical scenarios across multiple specialties",
    icon: Users,
    content: (
      <div className="space-y-6">
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sarah Chen, 34</h3>
              <p className="text-sm text-gray-600">Emergency Medicine Case</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            "I've been experiencing chest pain and shortness of breath for the past 2 hours..."
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-600 font-medium">Difficulty: Intermediate</span>
            <Play className="h-4 w-4 text-blue-600" />
          </div>
        </motion.div>
        <motion.p 
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Ask questions, order tests, and make diagnoses just like in real practice
        </motion.p>
      </div>
    )
  },
  {
    id: "ai-generator",
    title: "AI Case Generator",
    description: "Create unlimited custom medical scenarios with advanced AI",
    icon: Brain,
    isPremiumFeature: true,
    premiumHint: "Premium feature - Generate unlimited cases",
    content: (
      <div className="space-y-6">
        <motion.div 
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="absolute top-2 right-2">
            <Crown className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Custom Case Generator</h3>
              <p className="text-sm text-gray-600">AI-Powered</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            "Generate a complex cardiothoracic surgery case with post-operative complications..."
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-600 font-medium">Premium: Unlimited</span>
            <Sparkles className="h-4 w-4 text-orange-600" />
          </div>
        </motion.div>
        <motion.p 
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Free users get 5 AI-generated cases per month
        </motion.p>
      </div>
    )
  },
  {
    id: "voice",
    title: "Voice Interactions",
    description: "Talk with AI patients using natural speech",
    icon: Volume2,
    isPremiumFeature: true,
    premiumHint: "Premium gets priority voice synthesis",
    content: (
      <div className="space-y-6">
        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <motion.div 
              className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Volume2 className="h-6 w-6 text-purple-600" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900">Voice Patient</h3>
              <p className="text-sm text-gray-600">Natural Conversation</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "Doctor, the pain started suddenly while I was exercising..."
            </p>
            <div className="flex items-center justify-center">
              <motion.div 
                className="w-20 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <span className="text-white text-xs font-medium">Speaking...</span>
              </motion.div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-600 font-medium">Premium: High-quality voices</span>
            <Crown className="h-4 w-4 text-purple-600" />
          </div>
        </motion.div>
        <motion.p 
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Experience realistic patient conversations with advanced voice AI
        </motion.p>
      </div>
    )
  },
  {
    id: "achievements",
    title: "Track Your Progress",
    description: "Earn achievements and monitor your learning journey",
    icon: Trophy,
    content: (
      <div className="space-y-6">
        <motion.div 
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Trophy, label: "Cases Solved", value: "12", color: "text-yellow-600 bg-yellow-100" },
              { icon: Star, label: "Average Score", value: "87%", color: "text-blue-600 bg-blue-100" },
              { icon: BarChart3, label: "Streak", value: "5 days", color: "text-green-600 bg-green-100" }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.p 
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Unlock achievements and compete with medical students worldwide
        </motion.p>
      </div>
    )
  }
];

interface PremiumPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

function PremiumPopup({ isOpen, onClose, onSubscribe }: PremiumPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/25"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <Crown className="h-8 w-8 text-white" />
              </motion.div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Go Premium?</h2>
              <p className="text-gray-600 mb-6">
                Unlock unlimited AI cases, priority voice synthesis, and advanced analytics
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$19.99<span className="text-sm font-normal text-gray-600">/month</span></div>
                    <div className="text-xs text-green-600 font-medium mt-1">7-Day Free Trial</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "Unlimited AI Cases",
                    "Premium Voices", 
                    "Advanced Analytics",
                    "Priority Support"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <MobileButton 
                  onClick={onSubscribe}
                  className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg"
                  size="lg"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-2" />
                </MobileButton>
                
                <button 
                  onClick={onClose}
                  className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Walkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [, setLocation] = useLocation();

  const currentStepData = walkthroughSteps[currentStep];
  const isLastStep = currentStep === walkthroughSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      setShowPremiumPopup(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('walkthroughCompleted', 'true');
    setLocation('/');
  };

  const handleComplete = () => {
    localStorage.setItem('walkthroughCompleted', 'true');
    setShowPremiumPopup(false);
    setLocation('/');
  };

  const handleSubscribe = () => {
    localStorage.setItem('walkthroughCompleted', 'true');
    setShowPremiumPopup(false);
    setLocation('/premium');
  };

  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">MedTrainer AI</h1>
            <p className="text-xs text-gray-600">Getting Started</p>
          </div>
        </div>
        <button 
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            Step {currentStep + 1} of {walkthroughSteps.length}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(((currentStep + 1) / walkthroughSteps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / walkthroughSteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Step Header */}
            <div className="text-center">
              <motion.div 
                className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl ${
                  currentStepData.isPremiumFeature 
                    ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-orange-500/25' 
                    : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 shadow-indigo-500/25'
                }`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <IconComponent className="h-8 w-8 text-white" />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {currentStepData.title}
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {currentStepData.description}
              </motion.p>
              
              {currentStepData.premiumHint && (
                <motion.div 
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Crown className="h-3 w-3 mr-1" />
                  {currentStepData.premiumHint}
                </motion.div>
              )}
            </div>

            {/* Step Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {currentStepData.content}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-between space-x-4">
          <MobileButton
            variant="secondary"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={isFirstStep ? "opacity-50" : ""}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </MobileButton>
          
          <div className="flex space-x-1">
            {walkthroughSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-indigo-600' : 
                  index < currentStep ? 'bg-indigo-300' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <MobileButton
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLastStep ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </MobileButton>
        </div>
      </div>

      {/* Premium Popup */}
      <PremiumPopup 
        isOpen={showPremiumPopup}
        onClose={handleComplete}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
}