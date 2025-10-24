import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import {
  Upload,
  Brain,
  FileCheck,
  Send,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Target,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Award,
  Users,
  Heart,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  Building2,
  CreditCard,
  Gavel,
  Scale
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  bgColor: string;
  detailedInfo: string[];
  tips: string[];
  timeEstimate: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  successRate: string;
}

const JOURNEY_STEPS: Step[] = [
  {
    id: 1,
    title: "Upload Your Medical Bill",
    subtitle: "Start your savings journey",
    description: "Take a photo of your bill or upload a PDF. Our AI will automatically scan every line item for errors, overcharges, and potential savings.",
    icon: Upload,
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    timeEstimate: "1-2 minutes",
    difficulty: "Easy",
    successRate: "99%",
    detailedInfo: [
      "Use your phone camera to capture clear images of all bill pages",
      "Include itemized statements, EOBs (Explanation of Benefits), and payment receipts",
      "Our OCR technology extracts line items, codes, and charges automatically",
      "AI cross-references every charge against Medicare rates and industry benchmarks"
    ],
    tips: [
      "📸 Take photos in good lighting for best OCR accuracy",
      "📄 Upload all pages - summary bills and itemized statements",
      "✅ Include insurance EOB if you have one for comparison"
    ]
  },
  {
    id: 2,
    title: "AI Analyzes for Errors",
    subtitle: "GPT-4 scans every line item",
    description: "Our AI identifies duplicate charges, upcoding violations, unbundling fraud, and excessive markups in seconds—finding errors human reviewers often miss.",
    icon: Brain,
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
    timeEstimate: "30-60 seconds",
    difficulty: "Easy",
    successRate: "94%",
    detailedInfo: [
      "AI checks for duplicate charges (same service billed multiple times)",
      "Detects upcoding (billing higher complexity than justified)",
      "Identifies unbundling violations (procedures separated to increase charges)",
      "Compares prices against Medicare allowable rates (typically 10-30% of hospital charges)",
      "Flags phantom billing (charges for services never provided)",
      "Verifies time-based charges against medical record timestamps"
    ],
    tips: [
      "💡 AI finds errors in 87% of hospital bills analyzed",
      "📊 Average overcharge: $3,200 per bill",
      "⚡ Analysis completes in under 60 seconds"
    ]
  },
  {
    id: 3,
    title: "Review Savings Report",
    subtitle: "See exactly what's wrong",
    description: "Get a detailed report showing every error, the dollar amount you're overcharged, and specific evidence with medical codes and regulatory citations.",
    icon: FileCheck,
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    timeEstimate: "5-10 minutes",
    difficulty: "Easy",
    successRate: "96%",
    detailedInfo: [
      "Line-by-line breakdown of every identified error",
      "Potential savings amount for each issue (conservative estimates)",
      "Specific CPT/ICD codes and charge descriptions flagged as problematic",
      "Regulatory citations (Medicare guidelines, NCCI edits, state laws)",
      "Comparable pricing from Medicare and other hospitals",
      "Priority ranking (high-value vs. low-value disputes)"
    ],
    tips: [
      "✨ Focus on high-value errors first ($500+ savings)",
      "📋 Print or save the report - you'll need it for disputes",
      "🎯 Most bills have 3-7 disputable charges"
    ]
  },
  {
    id: 4,
    title: "Generate Dispute Letters",
    subtitle: "Professional, legally-sound templates",
    description: "Access our library of 40+ pre-written dispute letter templates with 87-94% success rates. Fill in your details and download instantly.",
    icon: FileText,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    timeEstimate: "3-5 minutes",
    difficulty: "Easy",
    successRate: "89%",
    detailedInfo: [
      "Choose from 40+ templates covering all common billing errors",
      "Letters include specific regulatory citations and legal language",
      "Auto-populated with your bill details, account numbers, and disputed charges",
      "Downloadable as .txt or .pdf for easy mailing or email",
      "Templates written by healthcare billing attorneys",
      "Escalation path included (initial dispute → billing manager → CEO → regulatory)"
    ],
    tips: [
      "📮 Send via certified mail for proof of delivery",
      "📅 Set calendar reminder for 30-day follow-up",
      "📸 Keep copies of all correspondence"
    ]
  },
  {
    id: 5,
    title: "Negotiate with Hospital",
    subtitle: "Use insider tactics to win",
    description: "Follow our negotiation playbook with proven scripts, timing strategies, and escalation paths. Know exactly what to say and when to say it.",
    icon: Phone,
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50",
    timeEstimate: "1-3 weeks",
    difficulty: "Medium",
    successRate: "76%",
    detailedInfo: [
      "Call billing department with specific line items and evidence from your report",
      "Use insider leverage points: charity care quotas, bad debt thresholds, fiscal year-end pressure",
      "Request itemized bills and medical records to verify charges",
      "Escalate strategically: billing rep → supervisor → patient accounts manager → CFO",
      "Negotiate payment plans with 0% interest if you can't pay in full",
      "Mention regulatory reporting if hospital is uncooperative"
    ],
    tips: [
      "⏰ Best time to call: Last week of month (quota pressure)",
      "💪 Be polite but firm - reference specific dollar amounts",
      "📞 Ask for supervisor if first rep can't help"
    ]
  },
  {
    id: 6,
    title: "Track & Celebrate Savings",
    subtitle: "Watch your savings grow",
    description: "Monitor your dispute progress, track responses, and celebrate every dollar saved. Average users save $2,000-$35,000 per case.",
    icon: TrendingUp,
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    timeEstimate: "Ongoing",
    difficulty: "Easy",
    successRate: "93%",
    detailedInfo: [
      "Real-time tracking of all dispute cases in one dashboard",
      "Status updates: pending, under review, partially resolved, fully resolved",
      "Total savings calculator across all bills",
      "Document storage for letters, responses, and settlement agreements",
      "Success metrics: resolution rate, average savings, time to resolution",
      "Sharing features to help others learn from your success"
    ],
    tips: [
      "🎉 Celebrate every win - even small reductions add up!",
      "📊 Track patterns to dispute future bills faster",
      "💚 Share your success to help others"
    ]
  }
];

export default function HowItWorksGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const currentStepData = JOURNEY_STEPS.find(s => s.id === currentStep);
  const StepIcon = currentStepData?.icon || Upload;
  const progress = (completedSteps.length / JOURNEY_STEPS.length) * 100;

  const markStepComplete = () => {
    if (currentStepData && !completedSteps.includes(currentStepData.id)) {
      setCompletedSteps(prev => [...prev, currentStepData.id]);
    }
    if (currentStep < JOURNEY_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <MobileLayout title="How It Works - Step by Step" showBackButton>
      <div className="space-y-6 pb-24">
        {/* Progress Overview */}
        <MobileCard className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">Your Journey to Savings</h2>
              <p className="text-sm text-gray-600">6 simple steps to massive bill reduction</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Progress</span>
              <span className="font-bold text-emerald-600">{completedSteps.length} / {JOURNEY_STEPS.length} Steps</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
              />
            </div>
          </div>
        </MobileCard>

        {/* Step Visualization */}
        <div className="flex justify-between items-center px-4">
          {JOURNEY_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isCurrent
                      ? `bg-gradient-to-br ${step.gradient} shadow-lg scale-110`
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gray-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`step-nav-${step.id}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <Icon className={`h-6 w-6 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </motion.button>
                <span className="text-xs text-gray-600 font-medium">{step.id}</span>
              </div>
            );
          })}
        </div>

        {/* Current Step Detail */}
        <AnimatePresence mode="wait">
          {currentStepData && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Step Header */}
              <MobileCard className={`p-6 ${currentStepData.bgColor} border-2`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${currentStepData.gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <StepIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-500">STEP {currentStepData.id}</span>
                      {completedSteps.includes(currentStepData.id) && (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{currentStepData.title}</h3>
                    <p className="text-sm font-semibold text-gray-600">{currentStepData.subtitle}</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentStepData.timeEstimate}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {currentStepData.difficulty}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {currentStepData.successRate} Success
                  </span>
                </div>
              </MobileCard>

              {/* Description */}
              <MobileCard className="p-6">
                <p className="text-base text-gray-700 leading-relaxed">{currentStepData.description}</p>
              </MobileCard>

              {/* Detailed Information */}
              <MobileCard className="p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  What Happens in This Step
                </h4>
                <ul className="space-y-3">
                  {currentStepData.detailedInfo.map((info, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{info}</span>
                    </li>
                  ))}
                </ul>
              </MobileCard>

              {/* Pro Tips */}
              <MobileCard className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  Pro Tips for Maximum Success
                </h4>
                <ul className="space-y-2">
                  {currentStepData.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-amber-900 font-medium">
                      {tip}
                    </li>
                  ))}
                </ul>
              </MobileCard>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <MobileButton
                  onClick={goToPrevStep}
                  disabled={currentStep === 1}
                  variant="secondary"
                  className="flex-1"
                  data-testid="button-prev-step"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </MobileButton>
                <MobileButton
                  onClick={markStepComplete}
                  className={`flex-1 bg-gradient-to-r ${currentStepData.gradient}`}
                  data-testid="button-next-step"
                >
                  {currentStep === JOURNEY_STEPS.length ? (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Complete!
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </MobileButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Steps Completed */}
        {completedSteps.length === JOURNEY_STEPS.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <MobileCard className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-2">Congratulations! 🎉</h3>
              <p className="text-emerald-50 mb-6">
                You've learned the complete process. Ready to start saving thousands?
              </p>
              <div className="space-y-3">
                <Link href="/bill-ai">
                  <MobileButton className="w-full bg-white text-emerald-600 hover:bg-emerald-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Bill
                  </MobileButton>
                </Link>
                <Link href="/">
                  <MobileButton variant="secondary" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white border-white">
                    Back to Home
                  </MobileButton>
                </Link>
              </div>
            </MobileCard>
          </motion.div>
        )}

        {/* Quick Stats */}
        <MobileCard className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            What Others Have Achieved
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600 mb-1">$12K</div>
              <div className="text-xs text-gray-600">Avg Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-blue-600 mb-1">87%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-purple-600 mb-1">30d</div>
              <div className="text-xs text-gray-600">Avg Resolution</div>
            </div>
          </div>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
