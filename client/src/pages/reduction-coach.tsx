import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { PremiumPaywallOverlay } from "@/components/premium-paywall-overlay";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { 
  UserCheck, 
  Brain, 
  Target, 
  Clock, 
  DollarSign, 
  FileText, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Lightbulb, 
  Award, 
  Star, 
  Timer, 
  Calculator, 
  MessageSquare, 
  ClipboardCheck, 
  Calendar, 
  Shield, 
  Zap, 
  Crown, 
  ChevronRight, 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  Heart, 
  Users, 
  Sparkles,
  ArrowRight,
  Progress,
  BookOpen,
  Headphones,
  Video,
  Lock,
  Unlock,
  CheckSquare,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Minus,
  Plus,
  Edit3,
  Save,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Animation variants for sophisticated motion design
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0, rotateX: -15 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      duration: 0.8,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Enhanced Coach Avatar Component
function CoachAvatar({ size = "w-16 h-16", isActive = false }: { size?: string; isActive?: boolean }) {
  return (
    <motion.div
      className={`${size} relative mx-auto`}
      whileHover={{ scale: 1.1 }}
      animate={isActive ? "animate" : "initial"}
      variants={pulseVariants}
    >
      <motion.div
        className="relative w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden"
        whileHover={{
          boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.4)",
        }}
      >
        <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
        <UserCheck className="text-white text-2xl relative z-10" />
        
        {/* Orbital rings when active */}
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 border-2 border-emerald-400/40 rounded-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border border-teal-400/30 rounded-xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </motion.div>
      
      {/* Status indicator */}
      <motion.div
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          isActive ? 'bg-green-500' : 'bg-gray-400'
        }`}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Personalized Assessment System Component
function PersonalizedAssessment({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({
    // Basic Information
    billAmount: '',
    hospitalName: '',
    treatmentType: '',
    insuranceType: '',
    
    // Financial Situation
    income: '',
    financialHardship: 'none',
    paymentHistory: 'excellent',
    creditScore: '',
    
    // Medical Necessity
    emergencyTreatment: false,
    priorAuthorization: 'unknown',
    networkStatus: 'unknown',
    secondOpinion: false,
    
    // Strategy Preferences
    riskTolerance: [50],
    timeAvailable: 'moderate',
    communicationStyle: 'direct',
    primaryGoal: 'reduction',
    
    // Complexity Factors
    multipleBills: false,
    previousDisputes: false,
    legalConcerns: false,
    urgency: 'moderate'
  });

  const assessmentSteps = [
    {
      title: "Bill Information",
      icon: FileText,
      description: "Tell us about your medical bill",
      fields: ['billAmount', 'hospitalName', 'treatmentType', 'insuranceType']
    },
    {
      title: "Financial Situation", 
      icon: DollarSign,
      description: "Help us understand your financial position",
      fields: ['income', 'financialHardship', 'paymentHistory', 'creditScore']
    },
    {
      title: "Medical Necessity",
      icon: Shield,
      description: "Evaluate the medical necessity factors",
      fields: ['emergencyTreatment', 'priorAuthorization', 'networkStatus', 'secondOpinion']
    },
    {
      title: "Strategy Preferences",
      icon: Target,
      description: "Customize your negotiation approach",
      fields: ['riskTolerance', 'timeAvailable', 'communicationStyle', 'primaryGoal']
    },
    {
      title: "Complexity Assessment",
      icon: Brain,
      description: "Identify any complicating factors",
      fields: ['multipleBills', 'previousDisputes', 'legalConcerns', 'urgency']
    }
  ];

  const updateData = (field: string, value: any) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(assessmentData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = assessmentSteps[currentStep];
  const progress = ((currentStep + 1) / assessmentSteps.length) * 100;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <CoachAvatar size="w-12 h-12" isActive={true} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Personal Assessment</h2>
            <p className="text-sm text-gray-600">Step {currentStep + 1} of {assessmentSteps.length}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <ProgressBar value={progress} className="h-2" />
          <p className="text-xs text-gray-500">{Math.round(progress)}% Complete</p>
        </div>
      </motion.div>

      {/* Step Navigation */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center"
      >
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {assessmentSteps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                index === currentStep
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : index < currentStep
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-50 text-gray-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <step.icon className="h-3 w-3" />
              <span className="whitespace-nowrap">{step.title}</span>
              {index < currentStep && <CheckCircle2 className="h-3 w-3 text-green-500" />}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MobileCard>
            <div className="space-y-6">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <currentStepData.icon className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{currentStepData.title}</h3>
                <p className="text-sm text-gray-600">{currentStepData.description}</p>
              </div>

              {/* Step-specific form fields */}
              <div className="space-y-4">
                {currentStep === 0 && (
                  <>
                    <div>
                      <Label htmlFor="billAmount">Total Bill Amount *</Label>
                      <Input
                        id="billAmount"
                        type="number"
                        placeholder="Enter amount (e.g., 25000)"
                        value={assessmentData.billAmount}
                        onChange={(e) => updateData('billAmount', e.target.value)}
                        data-testid="input-bill-amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hospitalName">Hospital/Provider Name *</Label>
                      <Input
                        id="hospitalName"
                        placeholder="Enter hospital or provider name"
                        value={assessmentData.hospitalName}
                        onChange={(e) => updateData('hospitalName', e.target.value)}
                        data-testid="input-hospital-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="treatmentType">Type of Treatment *</Label>
                      <Select value={assessmentData.treatmentType} onValueChange={(value) => updateData('treatmentType', value)}>
                        <SelectTrigger data-testid="select-treatment-type">
                          <SelectValue placeholder="Select treatment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency Room Visit</SelectItem>
                          <SelectItem value="surgery">Surgery/Procedure</SelectItem>
                          <SelectItem value="inpatient">Inpatient Stay</SelectItem>
                          <SelectItem value="outpatient">Outpatient Procedure</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                          <SelectItem value="specialist">Specialist Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="insuranceType">Insurance Type *</Label>
                      <Select value={assessmentData.insuranceType} onValueChange={(value) => updateData('insuranceType', value)}>
                        <SelectTrigger data-testid="select-insurance-type">
                          <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commercial">Commercial Insurance</SelectItem>
                          <SelectItem value="medicare">Medicare</SelectItem>
                          <SelectItem value="medicaid">Medicaid</SelectItem>
                          <SelectItem value="uninsured">Uninsured/Self-Pay</SelectItem>
                          <SelectItem value="workers-comp">Workers' Compensation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <div>
                      <Label htmlFor="income">Annual Household Income</Label>
                      <Select value={assessmentData.income} onValueChange={(value) => updateData('income', value)}>
                        <SelectTrigger data-testid="select-income">
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-25k">Under $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                          <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                          <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                          <SelectItem value="over-150k">Over $150,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Financial Hardship Level</Label>
                      <RadioGroup value={assessmentData.financialHardship} onValueChange={(value) => updateData('financialHardship', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="hardship-none" />
                          <Label htmlFor="hardship-none">No hardship</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mild" id="hardship-mild" />
                          <Label htmlFor="hardship-mild">Mild difficulty paying</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="severe" id="hardship-severe" />
                          <Label htmlFor="hardship-severe">Severe financial hardship</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label>Payment History</Label>
                      <Select value={assessmentData.paymentHistory} onValueChange={(value) => updateData('paymentHistory', value)}>
                        <SelectTrigger data-testid="select-payment-history">
                          <SelectValue placeholder="Select payment history" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Always pay bills on time</SelectItem>
                          <SelectItem value="good">Usually pay bills on time</SelectItem>
                          <SelectItem value="fair">Sometimes late on payments</SelectItem>
                          <SelectItem value="poor">Often struggle with payments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emergency"
                        checked={assessmentData.emergencyTreatment}
                        onCheckedChange={(checked) => updateData('emergencyTreatment', checked)}
                        data-testid="checkbox-emergency"
                      />
                      <Label htmlFor="emergency">This was emergency treatment</Label>
                    </div>
                    <div>
                      <Label>Prior Authorization Status</Label>
                      <Select value={assessmentData.priorAuthorization} onValueChange={(value) => updateData('priorAuthorization', value)}>
                        <SelectTrigger data-testid="select-prior-auth">
                          <SelectValue placeholder="Select authorization status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="obtained">Prior authorization obtained</SelectItem>
                          <SelectItem value="denied">Prior authorization denied</SelectItem>
                          <SelectItem value="not-required">Not required for this treatment</SelectItem>
                          <SelectItem value="unknown">Unknown/Unclear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Provider Network Status</Label>
                      <Select value={assessmentData.networkStatus} onValueChange={(value) => updateData('networkStatus', value)}>
                        <SelectTrigger data-testid="select-network-status">
                          <SelectValue placeholder="Select network status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-network">In-network provider</SelectItem>
                          <SelectItem value="out-network">Out-of-network provider</SelectItem>
                          <SelectItem value="emergency">Emergency (network rules may not apply)</SelectItem>
                          <SelectItem value="unknown">Unknown network status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="second-opinion"
                        checked={assessmentData.secondOpinion}
                        onCheckedChange={(checked) => updateData('secondOpinion', checked)}
                        data-testid="checkbox-second-opinion"
                      />
                      <Label htmlFor="second-opinion">Treatment was recommended by multiple doctors</Label>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div>
                      <Label>Risk Tolerance (How aggressive should we be?)</Label>
                      <div className="px-3 py-4">
                        <Slider
                          value={assessmentData.riskTolerance}
                          onValueChange={(value) => updateData('riskTolerance', value)}
                          max={100}
                          step={10}
                          className="w-full"
                          data-testid="slider-risk-tolerance"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Conservative</span>
                          <span>Balanced</span>
                          <span>Aggressive</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Time Available for Negotiations</Label>
                      <Select value={assessmentData.timeAvailable} onValueChange={(value) => updateData('timeAvailable', value)}>
                        <SelectTrigger data-testid="select-time-available">
                          <SelectValue placeholder="Select time availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal (quick resolution preferred)</SelectItem>
                          <SelectItem value="moderate">Moderate (willing to invest some time)</SelectItem>
                          <SelectItem value="extensive">Extensive (willing to fight long-term)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Communication Style Preference</Label>
                      <Select value={assessmentData.communicationStyle} onValueChange={(value) => updateData('communicationStyle', value)}>
                        <SelectTrigger data-testid="select-communication-style">
                          <SelectValue placeholder="Select communication style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diplomatic">Diplomatic and collaborative</SelectItem>
                          <SelectItem value="direct">Direct and business-like</SelectItem>
                          <SelectItem value="assertive">Assertive and demanding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Primary Goal</Label>
                      <Select value={assessmentData.primaryGoal} onValueChange={(value) => updateData('primaryGoal', value)}>
                        <SelectTrigger data-testid="select-primary-goal">
                          <SelectValue placeholder="Select primary goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reduction">Maximum bill reduction</SelectItem>
                          <SelectItem value="payment-plan">Affordable payment plan</SelectItem>
                          <SelectItem value="charity-care">Charity care qualification</SelectItem>
                          <SelectItem value="insurance-coverage">Insurance coverage resolution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="multiple-bills"
                        checked={assessmentData.multipleBills}
                        onCheckedChange={(checked) => updateData('multipleBills', checked)}
                        data-testid="checkbox-multiple-bills"
                      />
                      <Label htmlFor="multiple-bills">I have multiple related bills</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="previous-disputes"
                        checked={assessmentData.previousDisputes}
                        onCheckedChange={(checked) => updateData('previousDisputes', checked)}
                        data-testid="checkbox-previous-disputes"
                      />
                      <Label htmlFor="previous-disputes">I've previously disputed bills with this provider</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="legal-concerns"
                        checked={assessmentData.legalConcerns}
                        onCheckedChange={(checked) => updateData('legalConcerns', checked)}
                        data-testid="checkbox-legal-concerns"
                      />
                      <Label htmlFor="legal-concerns">There are potential legal concerns</Label>
                    </div>
                    <div>
                      <Label>Urgency Level</Label>
                      <Select value={assessmentData.urgency} onValueChange={(value) => updateData('urgency', value)}>
                        <SelectTrigger data-testid="select-urgency">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (no immediate pressure)</SelectItem>
                          <SelectItem value="moderate">Moderate (some time pressure)</SelectItem>
                          <SelectItem value="high">High (urgent resolution needed)</SelectItem>
                          <SelectItem value="critical">Critical (collections/legal action)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  data-testid="button-previous"
                >
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  data-testid="button-next"
                >
                  {currentStep === assessmentSteps.length - 1 ? 'Complete Assessment' : 'Next Step'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </MobileCard>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Interactive Coaching Dashboard
function InteractiveCoaching({ assessmentData }: { assessmentData: any }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [coachingProgress, setCoachingProgress] = useState(0);
  const { toast } = useToast();

  const coachingSteps = [
    {
      id: 'analysis',
      title: 'Bill Analysis Review',
      icon: FileText,
      description: 'Review your personalized bill analysis and strategy',
      estimatedTime: '10 minutes',
      priority: 'high',
      actions: ['Review findings', 'Understand strategy', 'Ask questions']
    },
    {
      id: 'strategy',
      title: 'Negotiation Strategy',
      icon: Target,
      description: 'Learn your customized negotiation approach',
      estimatedTime: '15 minutes',
      priority: 'high',
      actions: ['Review tactics', 'Practice scripts', 'Set expectations']
    },
    {
      id: 'preparation',
      title: 'Document Preparation',
      icon: ClipboardCheck,
      description: 'Gather and organize required documentation',
      estimatedTime: '20 minutes',
      priority: 'medium',
      actions: ['Collect documents', 'Organize files', 'Create templates']
    },
    {
      id: 'contact',
      title: 'First Contact',
      icon: Phone,
      description: 'Make your first strategic contact with the billing department',
      estimatedTime: '30 minutes',
      priority: 'high',
      actions: ['Schedule call', 'Use script', 'Document response']
    },
    {
      id: 'follow-up',
      title: 'Follow-up & Escalation',
      icon: TrendingUp,
      description: 'Execute follow-up strategy and escalate if needed',
      estimatedTime: '25 minutes',
      priority: 'medium',
      actions: ['Send follow-up', 'Track responses', 'Plan escalation']
    },
    {
      id: 'resolution',
      title: 'Final Resolution',
      icon: Award,
      description: 'Finalize your negotiation and celebrate success',
      estimatedTime: '15 minutes',
      priority: 'low',
      actions: ['Confirm agreement', 'Get documentation', 'Celebrate wins']
    }
  ];

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      setCoachingProgress(((completedSteps.length + 1) / coachingSteps.length) * 100);
      toast({
        title: "Step Completed! 🎉",
        description: `Great job completing "${coachingSteps[stepIndex].title}"`,
      });
    }
  };

  const currentStep = coachingSteps[activeStep];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Coaching Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <CoachAvatar size="w-14 h-14" isActive={true} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Personal Coach</h2>
            <p className="text-sm text-gray-600">Personalized guidance for your case</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <ProgressBar value={coachingProgress} className="h-3" />
          <p className="text-sm text-gray-600">
            {completedSteps.length} of {coachingSteps.length} steps completed ({Math.round(coachingProgress)}%)
          </p>
        </div>
      </motion.div>

      {/* Steps Overview */}
      <motion.div variants={itemVariants}>
        <MobileCard>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Coaching Plan</h3>
          <div className="space-y-3">
            {coachingSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  activeStep === index
                    ? 'border-emerald-300 bg-emerald-50'
                    : completedSteps.includes(index)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setActiveStep(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`step-${step.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      completedSteps.includes(index)
                        ? 'bg-green-500'
                        : activeStep === index
                        ? 'bg-emerald-500'
                        : 'bg-gray-400'
                    }`}>
                      {completedSteps.includes(index) ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        <step.icon className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Timer className="h-3 w-3 mr-1" />
                          {step.estimatedTime}
                        </span>
                        <Badge variant={step.priority === 'high' ? 'destructive' : step.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                          {step.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {activeStep === index && (
                    <ChevronRight className="h-5 w-5 text-emerald-600" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </MobileCard>
      </motion.div>

      {/* Active Step Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MobileCard>
            <div className="space-y-6">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <currentStep.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentStep.title}</h3>
                <p className="text-gray-600">{currentStep.description}</p>
              </div>

              {/* Step-specific content */}
              <div className="space-y-4">
                {activeStep === 0 && (
                  <BillAnalysisReview assessmentData={assessmentData} />
                )}
                {activeStep === 1 && (
                  <NegotiationStrategy assessmentData={assessmentData} />
                )}
                {activeStep === 2 && (
                  <DocumentPreparation assessmentData={assessmentData} />
                )}
                {activeStep === 3 && (
                  <FirstContact assessmentData={assessmentData} />
                )}
                {activeStep === 4 && (
                  <FollowUpStrategy assessmentData={assessmentData} />
                )}
                {activeStep === 5 && (
                  <FinalResolution assessmentData={assessmentData} />
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentStep.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    data-testid={`action-${action.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {action}
                  </Button>
                ))}
              </div>

              {/* Complete Step Button */}
              <Button
                onClick={() => markStepComplete(activeStep)}
                disabled={completedSteps.includes(activeStep)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                data-testid="button-complete-step"
              >
                {completedSteps.includes(activeStep) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Step Completed
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mark Step Complete
                  </>
                )}
              </Button>
            </div>
          </MobileCard>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Bill Analysis Review Component
function BillAnalysisReview({ assessmentData }: { assessmentData: any }) {
  const billAmount = parseFloat(assessmentData.billAmount) || 0;
  const potentialSavings = Math.round(billAmount * 0.35); // 35% average reduction
  const riskLevel = assessmentData.riskTolerance?.[0] > 70 ? 'High' : assessmentData.riskTolerance?.[0] > 40 ? 'Medium' : 'Low';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-center">
            <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-600 font-medium">Original Bill</p>
            <p className="text-lg font-bold text-blue-900">${billAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">Potential Savings</p>
            <p className="text-lg font-bold text-green-900">${potentialSavings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-3">Your Case Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Treatment Type:</span>
            <span className="font-medium">{assessmentData.treatmentType || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span>Insurance:</span>
            <span className="font-medium">{assessmentData.insuranceType || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span>Risk Tolerance:</span>
            <Badge variant={riskLevel === 'High' ? 'destructive' : riskLevel === 'Medium' ? 'default' : 'secondary'}>
              {riskLevel}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Success Probability:</span>
            <span className="font-medium text-green-600">85%</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-amber-900 mb-1">Coach Recommendation</h5>
            <p className="text-sm text-amber-800">
              Based on your assessment, we recommend a {riskLevel.toLowerCase()}-risk approach focusing on 
              {assessmentData.primaryGoal === 'reduction' ? ' maximum bill reduction' : 
               assessmentData.primaryGoal === 'payment-plan' ? ' affordable payment arrangements' :
               assessmentData.primaryGoal === 'charity-care' ? ' charity care qualification' :
               ' insurance coverage resolution'}. Your case has strong potential for significant savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Negotiation Strategy Component
function NegotiationStrategy({ assessmentData }: { assessmentData: any }) {
  const [selectedTactic, setSelectedTactic] = useState('opening');

  const tactics = {
    opening: {
      title: 'Opening Approach',
      description: 'How to start your first conversation',
      script: `"Hi, I'm calling about my recent bill #[BILL_NUMBER] for $${assessmentData.billAmount}. I received this bill and I'm having some concerns about the charges. I'd like to discuss this with someone who can help me understand and potentially adjust these charges. Can you help me with that?"`
    },
    hardship: {
      title: 'Financial Hardship',
      description: 'Emphasizing financial constraints',
      script: `"I want to pay this bill, but the amount is causing significant financial hardship for my family. Given my current income of [INCOME_RANGE], this represents a substantial burden. What options do you have available for patients in my situation?"`
    },
    quality: {
      title: 'Quality of Care Issues',
      description: 'Questioning charges based on care quality',
      script: `"I have concerns about some of the charges on this bill. I'd like to review what services were actually provided and ensure that I'm only being charged for care that was necessary and properly delivered."`
    },
    insurance: {
      title: 'Insurance Coverage',
      description: 'Addressing insurance-related issues',
      script: `"I'm confused about why my insurance didn't cover more of this bill. This was ${assessmentData.emergencyTreatment ? 'emergency' : 'scheduled'} treatment, and I believe there may be coverage issues that need to be addressed."`
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-emerald-50 p-4 rounded-xl">
        <Target className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
        <h4 className="font-bold text-emerald-900 mb-1">Your Personalized Strategy</h4>
        <p className="text-sm text-emerald-700">
          {assessmentData.communicationStyle === 'diplomatic' ? 'Collaborative and relationship-focused approach' :
           assessmentData.communicationStyle === 'direct' ? 'Direct and business-focused approach' :
           'Assertive and results-driven approach'}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Negotiation Tactics</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(tactics).map(([key, tactic]) => (
            <Button
              key={key}
              variant={selectedTactic === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTactic(key)}
              className="text-left h-auto p-3"
              data-testid={`tactic-${key}`}
            >
              <div>
                <p className="font-medium text-xs">{tactic.title}</p>
                <p className="text-xs opacity-70">{tactic.description}</p>
              </div>
            </Button>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h5 className="font-medium text-gray-900 mb-2">
            Script: {tactics[selectedTactic as keyof typeof tactics].title}
          </h5>
          <p className="text-sm text-gray-700 italic leading-relaxed">
            {tactics[selectedTactic as keyof typeof tactics].script}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Key Talking Points</h4>
        <div className="space-y-2">
          {[
            'Emphasize your willingness to pay',
            'Request itemized bill breakdown',
            'Ask about charity care programs',
            'Mention financial hardship if applicable',
            'Request supervisor if needed'
          ].map((point, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-gray-700">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Document Preparation Component
function DocumentPreparation({ assessmentData }: { assessmentData: any }) {
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);

  const requiredDocs = [
    { id: 'bill', name: 'Original medical bill', required: true },
    { id: 'insurance', name: 'Insurance EOB (Explanation of Benefits)', required: true },
    { id: 'records', name: 'Medical records from visit', required: false },
    { id: 'income', name: 'Income documentation', required: assessmentData.financialHardship !== 'none' },
    { id: 'correspondence', name: 'Previous correspondence with hospital', required: false },
    { id: 'payment', name: 'Payment history records', required: false }
  ];

  const toggleDoc = (docId: string) => {
    setCheckedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-blue-50 p-4 rounded-xl">
        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <h4 className="font-bold text-blue-900 mb-1">Document Checklist</h4>
        <p className="text-sm text-blue-700">
          Gather these documents to strengthen your negotiation
        </p>
      </div>

      <div className="space-y-3">
        {requiredDocs.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-xl border-2 ${
              checkedDocs.includes(doc.id)
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={checkedDocs.includes(doc.id)}
                  onCheckedChange={() => toggleDoc(doc.id)}
                  data-testid={`doc-${doc.id}`}
                />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={doc.required ? "destructive" : "secondary"} className="text-xs">
                      {doc.required ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                </div>
              </div>
              {checkedDocs.includes(doc.id) && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-amber-900 mb-1">Pro Tip</h5>
            <p className="text-sm text-amber-800">
              Having all documents ready before your first call shows professionalism and increases your credibility with billing staff.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full" data-testid="button-download-checklist">
          <Download className="h-4 w-4 mr-2" />
          Download Checklist
        </Button>
        <Button variant="outline" className="w-full" data-testid="button-upload-docs">
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>
      </div>
    </div>
  );
}

// First Contact Component
function FirstContact({ assessmentData }: { assessmentData: any }) {
  const [callCompleted, setCallCompleted] = useState(false);
  const [callOutcome, setCallOutcome] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center bg-green-50 p-4 rounded-xl">
        <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <h4 className="font-bold text-green-900 mb-1">First Contact Strategy</h4>
        <p className="text-sm text-green-700">
          Make your first strategic contact with confidence
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h5 className="font-medium text-gray-900 mb-2">Call Preparation</h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Have your bill number ready: {assessmentData.hospitalName || '[BILL_NUMBER]'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Call during business hours (9 AM - 5 PM)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Have a pen and paper ready for notes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Stay calm and professional throughout</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <h5 className="font-medium text-blue-900 mb-2">What to Say</h5>
          <p className="text-sm text-blue-800 italic leading-relaxed">
            "Hello, I'm calling about my medical bill from {assessmentData.hospitalName}. 
            The bill amount is ${assessmentData.billAmount} and I'm hoping to discuss my options 
            for resolving this. I'm committed to paying but need to understand the charges and 
            explore what assistance might be available."
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl">
          <h5 className="font-medium text-amber-900 mb-2">Questions to Ask</h5>
          <div className="space-y-1 text-sm text-amber-800">
            <p>• Can you provide an itemized breakdown of charges?</p>
            <p>• Are there any charity care or financial assistance programs?</p>
            <p>• What payment plan options are available?</p>
            <p>• Is there a discount for immediate payment?</p>
            <p>• Who can I speak with about billing errors or adjustments?</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          onClick={() => setCallCompleted(true)}
          data-testid="button-start-call"
        >
          <Phone className="h-4 w-4 mr-2" />
          {callCompleted ? 'Call Completed' : 'Start Call Now'}
        </Button>

        {callCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div>
              <Label htmlFor="call-outcome">Call Outcome</Label>
              <Textarea
                id="call-outcome"
                placeholder="Document what happened during your call, any offers made, and next steps..."
                value={callOutcome}
                onChange={(e) => setCallOutcome(e.target.value)}
                data-testid="textarea-call-outcome"
              />
            </div>
            <Button variant="outline" className="w-full" data-testid="button-save-outcome">
              <Save className="h-4 w-4 mr-2" />
              Save Call Notes
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Follow-up Strategy Component
function FollowUpStrategy({ assessmentData }: { assessmentData: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center bg-purple-50 p-4 rounded-xl">
        <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
        <h4 className="font-bold text-purple-900 mb-1">Follow-up & Escalation</h4>
        <p className="text-sm text-purple-700">
          Strategic follow-up to maximize your success
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h5 className="font-medium text-gray-900 mb-3">Follow-up Timeline</h5>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium text-sm">3-5 Days After First Call</p>
                <p className="text-xs text-gray-600">Send follow-up email with written request</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium text-sm">1 Week Later</p>
                <p className="text-xs text-gray-600">Second phone call to check status</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium text-sm">2 Weeks Total</p>
                <p className="text-xs text-gray-600">Escalate to supervisor if no progress</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <h5 className="font-medium text-red-900 mb-2">Escalation Triggers</h5>
          <div className="space-y-1 text-sm text-red-800">
            <p>• No response after 1 week</p>
            <p>• Unreasonable offers or refusal to negotiate</p>
            <p>• Billing department claims no authority</p>
            <p>• Threats of collection action</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full" data-testid="button-schedule-followup">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Follow-up
        </Button>
        <Button variant="outline" className="w-full" data-testid="button-email-template">
          <Mail className="h-4 w-4 mr-2" />
          Email Template
        </Button>
      </div>
    </div>
  );
}

// Final Resolution Component
function FinalResolution({ assessmentData }: { assessmentData: any }) {
  const [resolved, setResolved] = useState(false);
  const [finalAmount, setFinalAmount] = useState('');
  const originalAmount = parseFloat(assessmentData.billAmount) || 0;
  const savings = originalAmount - parseFloat(finalAmount || '0');
  const savingsPercentage = originalAmount > 0 ? ((savings / originalAmount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center bg-yellow-50 p-4 rounded-xl">
        <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
        <h4 className="font-bold text-yellow-900 mb-1">Final Resolution</h4>
        <p className="text-sm text-yellow-700">
          Document your success and celebrate your achievement
        </p>
      </div>

      {!resolved ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h5 className="font-medium text-gray-900 mb-3">Resolution Checklist</h5>
            <div className="space-y-2">
              {[
                'Get agreement in writing',
                'Confirm payment terms',
                'Request confirmation letter',
                'Save all documentation',
                'Schedule payment if applicable'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="final-amount">Final Agreed Amount</Label>
            <Input
              id="final-amount"
              type="number"
              placeholder="Enter final bill amount"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
              data-testid="input-final-amount"
            />
          </div>

          <Button
            onClick={() => setResolved(true)}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            data-testid="button-mark-resolved"
          >
            <Award className="h-4 w-4 mr-2" />
            Mark as Resolved
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center"
            >
              <Award className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">Congratulations! 🎉</h3>
            <p className="text-green-700 mb-4">You successfully negotiated your medical bill!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">Original Bill</p>
                <p className="text-lg font-bold text-gray-900">${originalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">Final Amount</p>
                <p className="text-lg font-bold text-green-900">${parseFloat(finalAmount || '0').toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl">
              <p className="text-sm opacity-90">Total Savings</p>
              <p className="text-2xl font-bold">${savings.toLocaleString()}</p>
              <p className="text-sm opacity-90">({savingsPercentage.toFixed(1)}% reduction)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" data-testid="button-download-summary">
              <Download className="h-4 w-4 mr-2" />
              Download Summary
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-share-success">
              <Sparkles className="h-4 w-4 mr-2" />
              Share Success
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Progress Tracking Component
function ProgressTracking() {
  const mockProgress = {
    currentCase: 'Hospital ABC - $25,000',
    completedSteps: 3,
    totalSteps: 6,
    estimatedSavings: 8750,
    timeInvested: '2 hours 30 minutes',
    successRate: 85,
    nextAction: 'Follow-up call scheduled for tomorrow'
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <CoachAvatar size="w-14 h-14" isActive={true} />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
          <p className="text-sm text-gray-600">Track your coaching journey and success</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MobileCard>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Current Case Status</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Active Case</span>
                <Badge className="bg-blue-600">In Progress</Badge>
              </div>
              <p className="font-bold text-blue-900">{mockProgress.currentCase}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-gray-50 p-3 rounded-xl">
                <ProgressBar value={(mockProgress.completedSteps / mockProgress.totalSteps) * 100} className="h-2 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {mockProgress.completedSteps}/{mockProgress.totalSteps} Steps
                </p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center bg-green-50 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-900">${mockProgress.estimatedSavings.toLocaleString()}</p>
                <p className="text-xs text-green-600">Est. Savings</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Next Action</p>
                  <p className="text-sm text-amber-800">{mockProgress.nextAction}</p>
                </div>
              </div>
            </div>
          </div>
        </MobileCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MobileCard>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Coaching Analytics</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Timer className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">{mockProgress.timeInvested}</p>
              <p className="text-xs text-gray-600">Time Invested</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Target className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">{mockProgress.successRate}%</p>
              <p className="text-xs text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">Expert</p>
              <p className="text-xs text-gray-600">Coach Level</p>
            </div>
          </div>
        </MobileCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MobileCard>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col" data-testid="button-schedule-session">
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Schedule Session</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col" data-testid="button-review-progress">
              <BarChart3 className="h-5 w-5 mb-1" />
              <span className="text-xs">Review Progress</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col" data-testid="button-update-case">
              <Edit3 className="h-5 w-5 mb-1" />
              <span className="text-xs">Update Case</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col" data-testid="button-coach-support">
              <MessageSquare className="h-5 w-5 mb-1" />
              <span className="text-xs">Coach Support</span>
            </Button>
          </div>
        </MobileCard>
      </motion.div>
    </motion.div>
  );
}

// Resources Library Component
function ResourcesLibrary() {
  const resources = [
    {
      category: 'Phone Scripts',
      icon: Phone,
      items: [
        'Initial Contact Script',
        'Hardship Appeal Script',
        'Supervisor Escalation Script',
        'Payment Plan Negotiation'
      ]
    },
    {
      category: 'Email Templates',
      icon: Mail,
      items: [
        'Formal Bill Dispute Letter',
        'Financial Hardship Request',
        'Follow-up Communication',
        'Agreement Confirmation'
      ]
    },
    {
      category: 'Checklists',
      icon: ClipboardCheck,
      items: [
        'Document Preparation Checklist',
        'Pre-Call Preparation',
        'Negotiation Milestones',
        'Resolution Verification'
      ]
    },
    {
      category: 'Expert Guides',
      icon: BookOpen,
      items: [
        'Understanding Medical Bills',
        'Insurance Coverage Rules',
        'Charity Care Qualification',
        'Legal Rights & Protections'
      ]
    }
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <BookOpen className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Resource Library</h2>
          <p className="text-sm text-gray-600">Professional tools and templates for your success</p>
        </div>
      </motion.div>

      {resources.map((resource, categoryIndex) => (
        <motion.div key={resource.category} variants={itemVariants}>
          <MobileCard>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                  <resource.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{resource.category}</h3>
              </div>
              
              <div className="space-y-2">
                {resource.items.map((item, itemIndex) => (
                  <motion.div
                    key={item}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`resource-${resource.category.toLowerCase().replace(/\s+/g, '-')}-${itemIndex}`}
                  >
                    <span className="text-sm font-medium text-gray-900">{item}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </MobileCard>
        </motion.div>
      ))}

      <motion.div variants={itemVariants}>
        <MobileCard className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Expert Support Available</h3>
              <p className="text-sm text-emerald-700 mb-4">
                Need personalized help? Connect with our bill reduction experts for 1-on-1 guidance.
              </p>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" data-testid="button-expert-support">
                <UserCheck className="h-4 w-4 mr-2" />
                Contact Expert Coach
              </Button>
            </div>
          </div>
        </MobileCard>
      </motion.div>
    </motion.div>
  );
}

// Main Personal Bill Reduction Coach Component
export default function ReductionCoach() {
  const { isAuthenticated } = useAuth();
  const { isSubscribed, isLoading } = useSubscription();
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState(null);
  const [activeTab, setActiveTab] = useState('assessment');

  // Handle assessment completion
  const handleAssessmentComplete = (data: any) => {
    setAssessmentData(data);
    setActiveTab('coaching');
  };

  if (isLoading) {
    return (
      <MobileLayout title="Personal Coach" showBottomNav={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!isAuthenticated || !isSubscribed) {
    return (
      <MobileLayout title="Personal Coach" showBottomNav={true}>
        <div className="relative min-h-[600px]">
          <PremiumPaywallOverlay
            title="Personal Bill Reduction Coach"
            description="Get 1-on-1 personalized guidance from billing experts. Example outcomes show potential savings. This premium coaching system provides step-by-step guidance customized to your specific case."
            featureName="Personal Coaching"
            savingsPotential="$8,500+ example outcomes"
          />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Personal Coach" showBottomNav={true}>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div
          className="text-center py-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-2xl border border-emerald-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CoachAvatar size="w-16 h-16" isActive={true} />
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Personal Bill Reduction Coach</h1>
          <p className="text-emerald-700 font-medium mb-1">Expert 1-on-1 Guidance</p>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Personalized coaching system that provides step-by-step guidance for your specific case
          </p>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger 
              value="assessment" 
              className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              data-testid="tab-assessment"
            >
              Assessment
            </TabsTrigger>
            <TabsTrigger 
              value="coaching" 
              className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              disabled={!assessmentData}
              data-testid="tab-coaching"
            >
              Coaching
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              data-testid="tab-progress"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              data-testid="tab-resources"
            >
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="mt-6">
            {!assessmentData ? (
              <PersonalizedAssessment onComplete={handleAssessmentComplete} />
            ) : (
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Assessment Complete!</h3>
                <p className="text-gray-600">Your personalized coaching plan has been created.</p>
                <Button
                  onClick={() => setActiveTab('coaching')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  data-testid="button-start-coaching"
                >
                  Start Coaching Session
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="coaching" className="mt-6">
            {assessmentData ? (
              <InteractiveCoaching assessmentData={assessmentData} />
            ) : (
              <div className="text-center py-12">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Assessment First</h3>
                <p className="text-gray-600 mb-4">Complete your personalized assessment to unlock your coaching plan.</p>
                <Button 
                  onClick={() => setActiveTab('assessment')}
                  variant="outline"
                  data-testid="button-go-to-assessment"
                >
                  Go to Assessment
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTracking />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <ResourcesLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}