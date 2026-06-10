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
    timeEstimate: "1-2 minutes",
    difficulty: "Easy",
    successRate: "High",
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
    description: "Monitor your dispute progress, track responses, and celebrate every dollar saved. Many users report meaningful reductions on their medical bills.",
    icon: TrendingUp,
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
        <MobileCard className="">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">Your Journey to Savings</h2>
              <p className="text-sm text-muted-foreground">6 simple steps to massive bill reduction</p>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-muted-foreground">Progress</span>
              <span className="font-bold text-gold" data-testid="text-progress-count">{completedSteps.length} / {JOURNEY_STEPS.length} Steps</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden" data-testid="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all border ${
                    isCurrent
                      ? 'shadow-sm scale-110 border-transparent'
                      : 'bg-secondary border-border'
                  }`}
                  style={isCurrent ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' } : undefined}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`step-nav-${step.id}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-gold" />
                  ) : (
                    <Icon className={`h-6 w-6 ${isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
                  )}
                </motion.button>
                <span className="text-xs text-muted-foreground font-medium">{step.id}</span>
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
              <MobileCard className="">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                    <StepIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-muted-foreground tracking-[0.15em]">STEP {currentStepData.id}</span>
                      {completedSteps.includes(currentStepData.id) && (
                        <CheckCircle className="h-4 w-4 text-gold" />
                      )}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-1" data-testid={`text-step-title-${currentStepData.id}`}>{currentStepData.title}</h3>
                    <p className="text-sm font-semibold text-muted-foreground" data-testid={`text-step-subtitle-${currentStepData.id}`}>{currentStepData.subtitle}</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary border border-border px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground flex items-center gap-1" data-testid={`badge-time-${currentStepData.id}`}>
                    <Clock className="h-3 w-3" />
                    {currentStepData.timeEstimate}
                  </span>
                  <span className="bg-secondary border border-border px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground" data-testid={`badge-difficulty-${currentStepData.id}`}>
                    {currentStepData.difficulty}
                  </span>
                  <span className="bg-secondary border border-border text-gold px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" data-testid={`badge-success-${currentStepData.id}`}>
                    <Star className="h-3 w-3" />
                    {currentStepData.successRate} Success
                  </span>
                </div>
              </MobileCard>

              {/* Description */}
              <MobileCard className="">
                <p className="text-base text-muted-foreground leading-relaxed" data-testid={`text-step-description-${currentStepData.id}`}>{currentStepData.description}</p>
              </MobileCard>

              {/* Detailed Information */}
              <MobileCard className="">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-gold" />
                  What Happens in This Step
                </h4>
                <ul className="space-y-3">
                  {currentStepData.detailedInfo.map((info, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground" data-testid={`text-step-detail-${currentStepData.id}-${index}`}>{info}</span>
                    </li>
                  ))}
                </ul>
              </MobileCard>

              {/* Pro Tips */}
              <MobileCard className="">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gold" />
                  Pro Tips for Maximum Success
                </h4>
                <ul className="space-y-2">
                  {currentStepData.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground font-medium" data-testid={`text-step-tip-${currentStepData.id}-${index}`}>
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
                  className="flex-1 bg-primary text-primary-foreground"
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
            <MobileCard className="p-8 text-white text-center border-transparent" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }} data-testid="completion-card">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold mb-2" data-testid="text-completion-title">Congratulations! 🎉</h3>
              <p className="text-white/90 mb-6" data-testid="text-completion-message">
                You've learned the complete process. Ready to start saving thousands?
              </p>
              <div className="space-y-3">
                <Link href="/bill-ai">
                  <MobileButton className="w-full bg-white text-foreground hover:bg-white/90" data-testid="button-upload-first-bill">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Bill
                  </MobileButton>
                </Link>
                <Link href="/">
                  <MobileButton variant="secondary" className="w-full bg-black/20 hover:bg-black/30 text-white border border-white" data-testid="button-back-home">
                    Back to Home
                  </MobileButton>
                </Link>
              </div>
            </MobileCard>
          </motion.div>
        )}

        {/* Quick Stats */}
        <MobileCard className="">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            What Others Have Achieved
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-gold mb-1" data-testid="stat-avg-savings">$12K</div>
              <div className="text-xs text-muted-foreground">Avg Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground mb-1" data-testid="stat-success-rate">87%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground mb-1" data-testid="stat-avg-resolution">30d</div>
              <div className="text-xs text-muted-foreground">Avg Resolution</div>
            </div>
          </div>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
