import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Circle, 
  Clock,
  ArrowRight,
  FileText,
  Search,
  Brain,
  Target,
  Send,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Shield,
  Award,
  Zap,
  Sparkles,
  ChevronRight,
  PlayCircle,
  User,
  Building2,
  DollarSign
} from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  substeps?: WorkflowSubstep[];
  estimatedTime?: string;
  value?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  helpText?: string;
  actionRequired?: boolean;
}

interface WorkflowSubstep {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  description?: string;
}

interface EnhancedProgressTrackerProps {
  intakeState: {
    amount?: string;
    provider?: string;
    dates?: string;
    insurance?: string;
    codes?: string;
    itemizedBill?: boolean;
    cptCodes?: string[];
    hcpcsCodes?: string[];
    icdCodes?: string[];
  };
  analysisComplete: boolean;
  onSendMessage: (message: string) => void;
  onNextStep: (stepId: string) => void;
}

export function EnhancedProgressTracker({ 
  intakeState, 
  analysisComplete, 
  onSendMessage, 
  onNextStep 
}: EnhancedProgressTrackerProps) {
  const [currentWorkflow, setCurrentWorkflow] = useState<'intake' | 'analysis' | 'action'>('intake');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [sessionStartTime] = useState(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Update time elapsed every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000));
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Determine workflow progress based on intake state
  const getIntakeSteps = (): WorkflowStep[] => {
    return [
      {
        id: 'bill-amount',
        title: 'Bill Amount',
        description: 'Total amount owed on your medical bill',
        icon: DollarSign,
        status: intakeState.amount ? 'completed' : 'pending',
        value: intakeState.amount,
        priority: 'critical',
        estimatedTime: '1 min',
        helpText: 'Look for "Total Amount Due" or "Patient Balance" on your bill',
        actionRequired: !intakeState.amount
      },
      {
        id: 'provider-info',
        title: 'Provider Information',
        description: 'Hospital or healthcare provider name',
        icon: Building2,
        status: intakeState.provider ? 'completed' : 'pending',
        value: intakeState.provider,
        priority: 'critical',
        estimatedTime: '1 min',
        helpText: 'Check the letterhead or billing address on your statement',
        actionRequired: !intakeState.provider
      },
      {
        id: 'service-dates',
        title: 'Service Dates',
        description: 'When you received medical care',
        icon: Calendar,
        status: intakeState.dates ? 'completed' : 'pending',
        value: intakeState.dates,
        priority: 'critical',
        estimatedTime: '1 min',
        helpText: 'Find "Date of Service" (different from bill date)',
        actionRequired: !intakeState.dates
      },
      {
        id: 'insurance-details',
        title: 'Insurance Information',
        description: 'Insurance coverage and payment details',
        icon: Shield,
        status: intakeState.insurance ? 'completed' : 'pending',
        value: intakeState.insurance,
        priority: 'high',
        estimatedTime: '2 min',
        helpText: 'Look for insurance payments, EOB references, or plan information',
        actionRequired: !intakeState.insurance
      },
      {
        id: 'medical-codes',
        title: 'Medical Codes',
        description: 'CPT, ICD-10, and other procedure codes',
        icon: FileText,
        status: intakeState.codes ? 'completed' : 'pending',
        value: intakeState.codes,
        priority: 'high',
        estimatedTime: '3 min',
        helpText: 'Find the itemized section with 5-digit procedure codes',
        actionRequired: !intakeState.codes,
        substeps: [
          {
            id: 'cpt-codes',
            title: 'CPT Procedure Codes',
            status: (intakeState.cptCodes?.length || 0) > 0 ? 'completed' : 'pending',
            description: `${intakeState.cptCodes?.length || 0} codes found`
          },
          {
            id: 'icd-codes',
            title: 'ICD-10 Diagnosis Codes',
            status: (intakeState.icdCodes?.length || 0) > 0 ? 'completed' : 'pending',
            description: `${intakeState.icdCodes?.length || 0} codes found`
          }
        ]
      },
      {
        id: 'itemized-bill',
        title: 'Itemized Details',
        description: 'Line-by-line breakdown of all charges',
        icon: ClipboardList,
        status: intakeState.itemizedBill ? 'completed' : 'pending',
        priority: 'medium',
        estimatedTime: '5 min',
        helpText: 'Upload pages showing detailed charge descriptions and codes',
        actionRequired: !intakeState.itemizedBill
      }
    ];
  };

  const getAnalysisSteps = (): WorkflowStep[] => {
    const hasBasicInfo = intakeState.amount && intakeState.provider && intakeState.dates;
    const hasCodes = (intakeState.cptCodes?.length || 0) > 0;
    
    return [
      {
        id: 'error-detection',
        title: 'Billing Error Detection',
        description: 'Scanning for duplicate charges and overcharges',
        icon: Search,
        status: hasBasicInfo ? 'completed' : 'pending',
        priority: 'critical',
        estimatedTime: '2 min',
        substeps: [
          { id: 'duplicate-check', title: 'Duplicate Charge Detection', status: hasBasicInfo ? 'completed' : 'pending' },
          { id: 'overcharge-analysis', title: 'Overcharge Analysis', status: hasBasicInfo ? 'completed' : 'pending' },
          { id: 'unbundling-check', title: 'Unbundling Violation Check', status: hasCodes ? 'completed' : 'pending' }
        ]
      },
      {
        id: 'code-analysis',
        title: 'Medical Code Analysis',
        description: 'Deep analysis of CPT and ICD-10 codes',
        icon: Brain,
        status: hasCodes ? 'completed' : 'pending',
        priority: 'high',
        estimatedTime: '3 min',
        substeps: [
          { id: 'cpt-validation', title: 'CPT Code Validation', status: hasCodes ? 'completed' : 'pending' },
          { id: 'medicare-comparison', title: 'Medicare Rate Comparison', status: hasCodes ? 'completed' : 'pending' },
          { id: 'compliance-check', title: 'Compliance Verification', status: hasCodes ? 'completed' : 'pending' }
        ]
      },
      {
        id: 'savings-calculation',
        title: 'Savings Calculation',
        description: 'Calculating potential bill reductions',
        icon: TrendingUp,
        status: analysisComplete ? 'completed' : (hasBasicInfo ? 'in-progress' : 'pending'),
        priority: 'high',
        estimatedTime: '2 min'
      },
      {
        id: 'strategy-generation',
        title: 'Strategy Development',
        description: 'Creating personalized action plan',
        icon: Target,
        status: analysisComplete ? 'completed' : 'pending',
        priority: 'medium',
        estimatedTime: '1 min'
      }
    ];
  };

  const getActionSteps = (): WorkflowStep[] => {
    return [
      {
        id: 'dispute-letter',
        title: 'Generate Dispute Letter',
        description: 'Professional dispute documentation',
        icon: FileText,
        status: 'pending',
        priority: 'critical',
        estimatedTime: '5 min',
        actionRequired: true
      },
      {
        id: 'negotiation-script',
        title: 'Negotiation Script',
        description: 'Phone conversation preparation',
        icon: Phone,
        status: 'pending',
        priority: 'high',
        estimatedTime: '3 min',
        actionRequired: true
      },
      {
        id: 'submission-strategy',
        title: 'Submission Strategy',
        description: 'Timeline and follow-up plan',
        icon: Send,
        status: 'pending',
        priority: 'medium',
        estimatedTime: '2 min',
        actionRequired: true
      }
    ];
  };

  const getCurrentSteps = () => {
    switch (currentWorkflow) {
      case 'intake': return getIntakeSteps();
      case 'analysis': return getAnalysisSteps();
      case 'action': return getActionSteps();
      default: return [];
    }
  };

  const getWorkflowProgress = () => {
    const steps = getCurrentSteps();
    const completed = steps.filter(step => step.status === 'completed').length;
    return { completed, total: steps.length, percentage: Math.round((completed / steps.length) * 100) };
  };

  const getOverallProgress = () => {
    const intakeSteps = getIntakeSteps();
    const analysisSteps = getAnalysisSteps();
    const actionSteps = getActionSteps();
    
    const intakeCompleted = intakeSteps.filter(s => s.status === 'completed').length;
    const analysisCompleted = analysisSteps.filter(s => s.status === 'completed').length;
    const actionCompleted = actionSteps.filter(s => s.status === 'completed').length;
    
    const totalSteps = intakeSteps.length + analysisSteps.length + actionSteps.length;
    const totalCompleted = intakeCompleted + analysisCompleted + actionCompleted;
    
    return {
      completed: totalCompleted,
      total: totalSteps,
      percentage: Math.round((totalCompleted / totalSteps) * 100)
    };
  };

  const getNextActionableStep = () => {
    const allSteps = [...getIntakeSteps(), ...getAnalysisSteps(), ...getActionSteps()];
    return allSteps.find(step => step.actionRequired && step.status === 'pending');
  };

  const handleStepAction = (step: WorkflowStep) => {
    if (step.actionRequired) {
      const prompts: Record<string, string> = {
        'bill-amount': "I need help identifying the total amount on my medical bill. Can you guide me through finding the correct total amount due? Please explain where to look on a typical medical bill and what terms to search for.",
        'provider-info': "I need help identifying the healthcare provider name on my medical bill. Can you help me locate the hospital or medical facility name? Please explain where this information typically appears on medical bills.",
        'service-dates': "I need help finding the service dates on my medical bill. Can you explain the difference between the bill date and service date, and help me locate when I actually received medical care?",
        'insurance-details': "I need help understanding the insurance information on my medical bill. Can you guide me through finding insurance payments, EOB details, or coverage information that affects my bill?",
        'medical-codes': "I need help identifying medical codes on my bill. Can you explain what CPT codes, ICD-10 codes, and other medical billing codes look like and where to find them on itemized bills?",
        'itemized-bill': "I need help obtaining or interpreting the itemized breakdown of my medical bill. Can you explain what an itemized bill should contain and how to request one if I don't have it?",
        'dispute-letter': "I'm ready to generate a professional dispute letter for my medical bill. Based on the analysis we've completed, please create a comprehensive dispute letter that addresses the billing errors and overcharges we've identified.",
        'negotiation-script': "I need a personalized negotiation script for calling the hospital billing department. Please create a step-by-step script based on my specific bill analysis that will help me negotiate the best possible reduction.",
        'submission-strategy': "I need a strategic plan for submitting my dispute and following up with the hospital. Please create a timeline and strategy for maximizing my chances of successful bill reduction."
      };

      if (prompts[step.id]) {
        onSendMessage(prompts[step.id]);
      }
      onNextStep(step.id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'pending': return <Circle className="h-5 w-5 text-gray-400" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const currentProgress = getWorkflowProgress();
  const overallProgress = getOverallProgress();
  const nextStep = getNextActionableStep();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bill Analysis Progress</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {overallProgress.completed}/{overallProgress.total} steps completed • {timeElapsed} min elapsed
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{overallProgress.percentage}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
        </div>
      </div>

      <Progress value={overallProgress.percentage} className="h-3 mb-6" />

      <Tabs value={currentWorkflow} onValueChange={(value) => setCurrentWorkflow(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intake" className="text-xs">
            Information
            <Badge variant="secondary" className="ml-1 text-xs">
              {getIntakeSteps().filter(s => s.status === 'completed').length}/{getIntakeSteps().length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">
            Analysis
            <Badge variant="secondary" className="ml-1 text-xs">
              {getAnalysisSteps().filter(s => s.status === 'completed').length}/{getAnalysisSteps().length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="action" className="text-xs">
            Action
            <Badge variant="secondary" className="ml-1 text-xs">
              {getActionSteps().filter(s => s.status === 'completed').length}/{getActionSteps().length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {['intake', 'analysis', 'action'].map((workflow) => (
            <TabsContent key={workflow} value={workflow} className="space-y-3">
              {getCurrentSteps().map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    step.status === 'completed' 
                      ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20' 
                      : step.actionRequired 
                        ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20' 
                        : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
                  }`}
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(step.status)}
                    <step.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                          {step.value && (
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                              ✓ {step.value}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getPriorityColor(step.priority)}`}>
                            {step.priority}
                          </Badge>
                          {step.estimatedTime && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {step.estimatedTime}
                            </div>
                          )}
                          <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedStep === step.id ? 'transform rotate-90' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        {step.helpText && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            💡 {step.helpText}
                          </div>
                        )}

                        {step.substeps && (
                          <div className="space-y-2 mb-3">
                            {step.substeps.map((substep) => (
                              <div key={substep.id} className="flex items-center space-x-2 text-sm">
                                {substep.status === 'completed' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-gray-900 dark:text-white">{substep.title}</span>
                                {substep.description && (
                                  <span className="text-gray-500 dark:text-gray-400">- {substep.description}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {step.actionRequired && step.status === 'pending' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStepAction(step);
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                            size="sm"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start This Step
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {nextStep && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Next Step:</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">{nextStep.title}</p>
            </div>
            <Button
              onClick={() => handleStepAction(nextStep)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}