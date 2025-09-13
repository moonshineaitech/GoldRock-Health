import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Heart, 
  Phone, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Shield,
  DollarSign,
  FileText,
  Users,
  Building2,
  Scale,
  MapPin,
  Copy,
  ExternalLink,
  Info,
  Lightbulb,
  Timer,
  Calendar,
  Clipboard,
  HandHeart,
  LifeBuoy,
  UserCheck,
  HeartHandshake,
  PhoneCall,
  Mail,
  MessageCircle,
  Navigation,
  Zap,
  Star,
  Target,
  Download,
  BookOpen,
  AlertCircle,
  CreditCard,
  Home,
  UserPlus,
  FileX,
  HelpCircle,
  Activity,
  TrendingUp,
  Award,
  Briefcase,
  Brain,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  PlayCircle,
  StopCircle,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Helper function for copying text to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.error('Failed to copy to clipboard:', e);
  }
}

// Resource interfaces
interface Contact {
  name: string;
  phone: string;
  description: string;
  available: string;
  website?: string;
}

interface Script {
  scenario: string;
  script: string;
}

interface Resource {
  title: string;
  description: string;
  actions?: string[];
  contacts?: (Contact | string)[];
  scripts?: Script[];
  rights?: string[];
  timeframe?: string;
}

interface ResourceCategory {
  title: string;
  icon: any;
  description: string;
  urgency: 'immediate' | 'urgent' | 'planning';
  resources: Resource[];
}

// Crisis Assessment Types
interface CrisisAssessment {
  financialSituation: string;
  urgencyLevel: 'immediate' | 'urgent' | 'planning';
  billAmount: string;
  timeframe: string;
  collections: string;
  income: string;
  dependents: string;
  location: string;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  priority: 'critical' | 'high' | 'medium';
  completed: boolean;
  resources: string[];
}

// Crisis Assessment Component
function CrisisAssessmentTool() {
  const [step, setStep] = useState(0);
  const [assessment, setAssessment] = useState<Partial<CrisisAssessment>>({});
  const [actionPlan, setActionPlan] = useState<ActionItem[]>([]);
  const [urgencyLevel, setUrgencyLevel] = useState<'immediate' | 'urgent' | 'planning' | null>(null);
  const { toast } = useToast();

  const questions = [
    {
      id: 'financialSituation',
      question: 'What best describes your current financial situation?',
      type: 'select',
      options: [
        { value: 'unable-to-pay', label: 'Unable to pay any medical bills' },
        { value: 'struggling', label: 'Struggling to make minimum payments' },
        { value: 'manageable', label: 'Can make some payments but need help' },
        { value: 'planning', label: 'Planning ahead for upcoming bills' }
      ]
    },
    {
      id: 'billAmount',
      question: 'What is the total amount of your medical debt?',
      type: 'select',
      options: [
        { value: 'under-1000', label: 'Under $1,000' },
        { value: '1000-5000', label: '$1,000 - $5,000' },
        { value: '5000-25000', label: '$5,000 - $25,000' },
        { value: '25000-100000', label: '$25,000 - $100,000' },
        { value: 'over-100000', label: 'Over $100,000' }
      ]
    },
    {
      id: 'timeframe',
      question: 'How soon do you need to take action?',
      type: 'select',
      options: [
        { value: 'today', label: 'Today - I have immediate deadlines' },
        { value: 'this-week', label: 'This week - Urgent situation' },
        { value: 'this-month', label: 'This month - Need to act soon' },
        { value: 'planning', label: 'Planning ahead - No immediate deadline' }
      ]
    },
    {
      id: 'collections',
      question: 'Are you currently dealing with debt collectors?',
      type: 'select',
      options: [
        { value: 'yes-active', label: 'Yes, actively being contacted' },
        { value: 'yes-threats', label: 'Yes, receiving legal threats' },
        { value: 'recently', label: 'Recently contacted' },
        { value: 'no', label: 'No collection activity yet' }
      ]
    },
    {
      id: 'income',
      question: 'What is your household monthly income?',
      type: 'select',
      options: [
        { value: 'no-income', label: 'No income/Unemployed' },
        { value: 'under-2000', label: 'Under $2,000' },
        { value: '2000-4000', label: '$2,000 - $4,000' },
        { value: '4000-6000', label: '$4,000 - $6,000' },
        { value: 'over-6000', label: 'Over $6,000' }
      ]
    },
    {
      id: 'dependents',
      question: 'How many people depend on your income?',
      type: 'select',
      options: [
        { value: '1', label: 'Just myself' },
        { value: '2', label: '2 people (spouse/partner)' },
        { value: '3-4', label: '3-4 people (small family)' },
        { value: '5+', label: '5+ people (large family)' }
      ]
    },
    {
      id: 'location',
      question: 'What state are you located in?',
      type: 'input',
      placeholder: 'Enter your state (for local resources)'
    }
  ];

  const calculateUrgency = (assessment: Partial<CrisisAssessment>) => {
    let urgencyScore = 0;
    
    if (assessment.financialSituation === 'unable-to-pay') urgencyScore += 3;
    if (assessment.timeframe === 'today') urgencyScore += 3;
    if (assessment.collections === 'yes-threats') urgencyScore += 3;
    if (assessment.income === 'no-income') urgencyScore += 2;
    
    if (urgencyScore >= 6) return 'immediate';
    if (urgencyScore >= 3) return 'urgent';
    return 'planning';
  };

  const generateActionPlan = (assessment: Partial<CrisisAssessment>, urgency: 'immediate' | 'urgent' | 'planning') => {
    const actions: ActionItem[] = [];

    if (urgency === 'immediate') {
      actions.push(
        {
          id: '1',
          title: 'Contact Hospital Financial Assistance TODAY',
          description: 'Call the hospital billing department immediately to request charity care application and payment freeze',
          timeframe: 'Within 2 hours',
          priority: 'critical',
          completed: false,
          resources: ['Hospital billing phone number', 'Charity care application']
        },
        {
          id: '2',
          title: 'Document All Collection Communications',
          description: 'Save all voicemails, letters, and emails from debt collectors. Know your rights under FDCPA.',
          timeframe: 'Immediately',
          priority: 'critical',
          completed: false,
          resources: ['Consumer Financial Protection Bureau', 'FDCPA rights guide']
        },
        {
          id: '3',
          title: 'Apply for Emergency Financial Assistance',
          description: 'Contact local emergency assistance programs and non-profits for immediate bill payment help',
          timeframe: 'Today',
          priority: 'critical',
          completed: false,
          resources: ['United Way', 'Salvation Army', 'Local churches']
        }
      );
    }

    if (urgency === 'urgent') {
      actions.push(
        {
          id: '4',
          title: 'Gather Financial Documentation',
          description: 'Collect pay stubs, tax returns, bank statements for charity care and assistance applications',
          timeframe: 'Within 48 hours',
          priority: 'high',
          completed: false,
          resources: ['Document checklist', 'Financial hardship letter template']
        },
        {
          id: '5',
          title: 'Research State-Specific Programs',
          description: 'Look up state Medicaid expansion, emergency assistance, and medical debt protection laws',
          timeframe: 'This week',
          priority: 'high',
          completed: false,
          resources: ['State government websites', 'Legal aid organizations']
        }
      );
    }

    if (assessment.income && ['no-income', 'under-2000'].includes(assessment.income)) {
      actions.push({
        id: '6',
        title: 'Apply for Government Benefits',
        description: 'Apply for Medicaid, SNAP, and other government assistance programs that can help with medical costs',
        timeframe: 'Within 1 week',
        priority: 'high',
        completed: false,
        resources: ['Benefits.gov', 'Local social services office']
      });
    }

    return actions;
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate urgency and generate action plan
      const urgency = calculateUrgency(assessment);
      setUrgencyLevel(urgency);
      const plan = generateActionPlan(assessment, urgency);
      setActionPlan(plan);
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const updateAssessment = (field: string, value: string) => {
    setAssessment(prev => ({ ...prev, [field]: value }));
  };

  const toggleActionComplete = (actionId: string) => {
    setActionPlan(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      )
    );
  };

  if (step < questions.length) {
    const currentQuestion = questions[step];
    
    return (
      <MobileCard className="p-6" data-testid="crisis-assessment-card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800" data-testid="text-assessment-title">
              Crisis Assessment
            </h3>
            <Badge variant="outline" data-testid="badge-step-counter">
              {step + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={(step / questions.length) * 100} className="h-2" data-testid="progress-assessment" />
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800" data-testid="text-question">
            {currentQuestion.question}
          </h4>

          {currentQuestion.type === 'select' && (
            <Select 
              value={assessment[currentQuestion.id as keyof CrisisAssessment] || ''} 
              onValueChange={(value) => updateAssessment(currentQuestion.id, value)}
            >
              <SelectTrigger data-testid={`select-${currentQuestion.id}`}>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentQuestion.type === 'input' && (
            <Input
              placeholder={currentQuestion.placeholder}
              value={assessment[currentQuestion.id as keyof CrisisAssessment] || ''}
              onChange={(e) => updateAssessment(currentQuestion.id, e.target.value)}
              data-testid={`input-${currentQuestion.id}`}
            />
          )}

          <div className="flex justify-between">
            <MobileButton
              variant="ghost"
              onClick={handlePrevious}
              disabled={step === 0}
              data-testid="button-previous"
            >
              Previous
            </MobileButton>
            <MobileButton
              onClick={handleNext}
              disabled={!assessment[currentQuestion.id as keyof CrisisAssessment]}
              data-testid="button-next"
            >
              {step === questions.length - 1 ? 'Get Action Plan' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </MobileButton>
          </div>
        </div>
      </MobileCard>
    );
  }

  // Show results and action plan
  return (
    <div className="space-y-6">
      <MobileCard className="p-6" data-testid="crisis-results-card">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            urgencyLevel === 'immediate' ? 'bg-red-100' :
            urgencyLevel === 'urgent' ? 'bg-orange-100' : 'bg-green-100'
          }`}>
            {urgencyLevel === 'immediate' && <AlertTriangle className="w-8 h-8 text-red-600" />}
            {urgencyLevel === 'urgent' && <Clock className="w-8 h-8 text-orange-600" />}
            {urgencyLevel === 'planning' && <Target className="w-8 h-8 text-green-600" />}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2" data-testid="text-urgency-level">
            {urgencyLevel === 'immediate' && 'Immediate Crisis - Act Today'}
            {urgencyLevel === 'urgent' && 'Urgent Situation - Act This Week'}
            {urgencyLevel === 'planning' && 'Planning Mode - Proactive Steps'}
          </h3>
          <p className="text-gray-600" data-testid="text-urgency-description">
            {urgencyLevel === 'immediate' && 'You need to take immediate action to protect yourself from collections and secure financial assistance.'}
            {urgencyLevel === 'urgent' && 'You should act quickly to prevent your situation from becoming a crisis.'}
            {urgencyLevel === 'planning' && 'You have time to carefully plan and explore all your options.'}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800" data-testid="text-action-plan-title">
            Your Personalized Action Plan
          </h4>
          
          {actionPlan.map((action, index) => (
            <div key={action.id} className="border rounded-lg p-4 space-y-3" data-testid={`action-item-${action.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={action.completed}
                    onCheckedChange={() => toggleActionComplete(action.id)}
                    data-testid={`checkbox-action-${action.id}`}
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800" data-testid={`text-action-title-${action.id}`}>
                      {action.title}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1" data-testid={`text-action-description-${action.id}`}>
                      {action.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge 
                        variant={action.priority === 'critical' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                        data-testid={`badge-priority-${action.id}`}
                      >
                        {action.priority.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500" data-testid={`text-timeframe-${action.id}`}>
                        {action.timeframe}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {action.resources.length > 0 && (
                <div className="ml-6">
                  <p className="text-xs font-medium text-gray-600 mb-1">Resources:</p>
                  <div className="flex flex-wrap gap-1">
                    {action.resources.map((resource, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs" data-testid={`badge-resource-${action.id}-${idx}`}>
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <MobileButton
            onClick={() => {
              setStep(0);
              setAssessment({});
              setActionPlan([]);
              setUrgencyLevel(null);
            }}
            variant="ghost"
            data-testid="button-restart-assessment"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart Assessment
          </MobileButton>
        </div>
      </MobileCard>
    </div>
  );
}

// Emergency Resources Data
const emergencyResources = {
  charity_care: {
    title: 'Hospital Charity Care',
    icon: Building2,
    description: 'Immediate financial assistance from hospitals',
    urgency: 'immediate',
    resources: [
      {
        title: 'How to Apply for Charity Care',
        description: 'Step-by-step process to get hospital bills reduced or eliminated',
        actions: [
          'Call hospital billing department immediately',
          'Request charity care application and payment freeze',
          'Gather financial documents (pay stubs, tax returns)',
          'Submit application within 30 days of first bill',
          'Follow up weekly until approved'
        ],
        contacts: [
          'Hospital Patient Financial Services',
          'Hospital Patient Advocate',
          'Hospital Social Worker'
        ]
      },
      {
        title: 'Emergency Application Process',
        description: 'For immediate financial crises requiring urgent help',
        actions: [
          'Explain your emergency situation when calling',
          'Request expedited review (24-48 hours)',
          'Ask for immediate collections freeze',
          'Submit verbal application if needed',
          'Email documents for faster processing'
        ],
        timeframe: 'Same day application possible'
      }
    ]
  },
  
  financial_assistance: {
    title: 'Emergency Financial Assistance',
    icon: HandHeart,
    description: 'Non-profit and government emergency aid programs',
    urgency: 'immediate',
    resources: [
      {
        title: 'National Emergency Assistance Programs',
        description: 'Organizations that help with medical bills nationwide',
        contacts: [
          {
            name: 'United Way',
            phone: '2-1-1',
            description: 'Call 211 for local emergency assistance programs',
            available: '24/7'
          },
          {
            name: 'Salvation Army',
            phone: '1-800-SAL-ARMY',
            description: 'Emergency financial assistance for medical bills',
            available: 'Business hours'
          },
          {
            name: 'Catholic Charities',
            phone: 'Find local chapter',
            description: 'Financial assistance regardless of religion',
            available: 'Varies by location'
          },
          {
            name: 'HealthWell Foundation',
            phone: '1-800-675-8416',
            description: 'Medical bill assistance for chronic conditions',
            available: 'Business hours'
          }
        ]
      },
      {
        title: 'Government Emergency Programs',
        description: 'Federal and state programs for medical emergencies',
        contacts: [
          {
            name: 'Emergency Medicaid',
            phone: 'Call state Medicaid office',
            description: 'Retroactive coverage for emergency medical care',
            available: 'Business hours'
          },
          {
            name: 'Low Income Home Energy Assistance Program (LIHEAP)',
            phone: '1-866-674-6327',
            description: 'Can free up money for medical bills',
            available: 'Business hours'
          },
          {
            name: 'Temporary Assistance for Needy Families (TANF)',
            phone: 'Call local social services',
            description: 'Emergency cash assistance',
            available: 'Business hours'
          }
        ]
      }
    ]
  },

  government_aid: {
    title: 'Government Aid Programs',
    icon: Shield,
    description: 'Federal and state assistance programs',
    urgency: 'urgent',
    resources: [
      {
        title: 'Medicaid Application',
        description: 'Health insurance for low-income individuals and families',
        actions: [
          'Apply online at Healthcare.gov or state Medicaid website',
          'Gather required documents (income proof, ID, residence)',
          'Request expedited processing for emergency situations',
          'Ask about retroactive coverage (up to 3 months)',
          'Contact navigator for application help'
        ],
        contacts: [
          {
            name: 'Healthcare.gov',
            phone: '1-800-318-2596',
            description: 'Federal marketplace and Medicaid applications',
            available: '24/7'
          }
        ]
      },
      {
        title: 'Social Security Disability',
        description: 'For those unable to work due to medical conditions',
        actions: [
          'Apply online at ssa.gov or call Social Security',
          'Gather medical records and work history',
          'Consider hiring a disability attorney',
          'Apply for expedited processing if dire need',
          'Ask about emergency advance payments'
        ],
        contacts: [
          {
            name: 'Social Security Administration',
            phone: '1-800-772-1213',
            description: 'Disability benefits application',
            available: 'Mon-Fri 8am-7pm'
          }
        ]
      }
    ]
  },

  nonprofit_assistance: {
    title: 'Non-Profit Medical Debt Help',
    icon: Heart,
    description: 'Organizations specializing in medical debt relief',
    urgency: 'urgent',
    resources: [
      {
        title: 'National Medical Debt Organizations',
        description: 'Specialized non-profits for medical debt assistance',
        contacts: [
          {
            name: 'RIP Medical Debt',
            phone: 'Online application only',
            website: 'ripmedicaldebt.org',
            description: 'Purchases and forgives medical debt',
            available: 'Online applications'
          },
          {
            name: 'Patient Advocate Foundation',
            phone: '1-800-532-5274',
            description: 'Medical bill negotiation and financial assistance',
            available: 'Mon-Fri 9am-6pm EST'
          },
          {
            name: 'NeedyMeds',
            phone: '1-800-503-6897',
            description: 'Medication assistance and bill help resources',
            available: 'Mon-Fri 9am-5pm EST'
          },
          {
            name: 'CancerCare Financial Assistance',
            phone: '1-800-813-4673',
            description: 'Financial assistance for cancer-related bills',
            available: 'Mon-Fri 9am-5pm EST'
          }
        ]
      }
    ]
  },

  payment_plans: {
    title: 'Payment Plan Negotiation',
    icon: CreditCard,
    description: 'Negotiate affordable payment arrangements',
    urgency: 'urgent',
    resources: [
      {
        title: 'Emergency Payment Plan Scripts',
        description: 'What to say when calling billing departments',
        scripts: [
          {
            scenario: 'Emergency Financial Hardship',
            script: "I'm experiencing severe financial hardship and cannot pay this medical bill. I need to apply for charity care and request a payment freeze while my application is processed. Can you help me with this immediately?"
          },
          {
            scenario: 'Collections Prevention',
            script: "I want to pay this bill but need a payment plan I can afford. My monthly income is $[amount] and I can only afford $[amount] per month. Can we set up a plan that prevents collections?"
          },
          {
            scenario: 'Charity Care Request',
            script: "I need to apply for financial assistance due to hardship. Can you send me the charity care application and put a hold on collections while I apply? I understand this is required by law for non-profit hospitals."
          }
        ]
      },
      {
        title: 'Your Rights in Payment Negotiations',
        description: 'Know your legal protections',
        rights: [
          'Hospitals cannot require large lump sum payments',
          'You can negotiate payment plans as low as $25/month',
          'Non-profit hospitals must offer charity care',
          'You have 120 days to apply for financial assistance',
          'Collections must stop while charity care is pending'
        ]
      }
    ]
  },

  legal_aid: {
    title: 'Legal Aid & Bankruptcy',
    icon: Scale,
    description: 'Legal protection and bankruptcy resources',
    urgency: 'planning',
    resources: [
      {
        title: 'Free Legal Aid',
        description: 'Organizations providing free legal help',
        contacts: [
          {
            name: 'Legal Aid Society',
            phone: 'Find local chapter',
            description: 'Free legal services for low-income individuals',
            available: 'Varies by location'
          },
          {
            name: 'National Association of Consumer Advocates',
            phone: '1-202-452-1989',
            description: 'Referrals to consumer protection attorneys',
            available: 'Business hours'
          },
          {
            name: 'Consumer Financial Protection Bureau',
            phone: '1-855-411-2372',
            description: 'File complaints against debt collectors',
            available: 'Mon-Fri 8am-8pm EST'
          }
        ]
      },
      {
        title: 'Bankruptcy Information',
        description: 'Understanding bankruptcy as medical debt relief',
        actions: [
          'Consult with a bankruptcy attorney (many offer free consultations)',
          'Understand Chapter 7 vs Chapter 13 bankruptcy',
          'Know that medical debt can be discharged',
          'Consider alternatives before filing',
          'Understand the impact on credit'
        ],
        contacts: [
          {
            name: 'National Association of Consumer Bankruptcy Attorneys',
            phone: '1-800-499-9040',
            description: 'Find qualified bankruptcy attorneys',
            available: 'Business hours'
          }
        ]
      }
    ]
  }
};

// Emergency Resources Component
function EmergencyResources() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    await copyToClipboard(text);
    setCopiedText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6" data-testid="text-emergency-resources-title">
        Emergency Resources
      </h2>
      
      {Object.entries(emergencyResources).map(([key, category]) => (
        <MobileCard key={key} className="p-4" data-testid={`card-category-${key}`}>
          <button
            onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
            className="w-full flex items-center justify-between text-left"
            data-testid={`button-toggle-${key}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                category.urgency === 'immediate' ? 'bg-red-100' :
                category.urgency === 'urgent' ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
                <category.icon className={`w-5 h-5 ${
                  category.urgency === 'immediate' ? 'text-red-600' :
                  category.urgency === 'urgent' ? 'text-orange-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800" data-testid={`text-category-title-${key}`}>
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600" data-testid={`text-category-description-${key}`}>
                  {category.description}
                </p>
              </div>
            </div>
            {expandedCategory === key ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <AnimatePresence>
            {expandedCategory === key && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-4"
                data-testid={`content-category-${key}`}
              >
                {category.resources.map((resource: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-gray-200 pl-4 space-y-3" data-testid={`resource-${key}-${idx}`}>
                    <h4 className="font-semibold text-gray-800" data-testid={`text-resource-title-${key}-${idx}`}>
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600" data-testid={`text-resource-description-${key}-${idx}`}>
                      {resource.description}
                    </p>

                    {/* Actions */}
                    {resource.actions && resource.actions.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Action Steps:</h5>
                        <ul className="space-y-1">
                          {resource.actions.map((action: string, actionIdx: number) => (
                            <li key={actionIdx} className="text-sm text-gray-600 flex items-start" data-testid={`text-action-${key}-${idx}-${actionIdx}`}>
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contacts */}
                    {resource.contacts && resource.contacts.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Emergency Contacts:</h5>
                        <div className="space-y-2">
                          {resource.contacts.map((contact: Contact | string, contactIdx: number) => (
                            <div key={contactIdx} className="bg-gray-50 rounded-lg p-3" data-testid={`contact-${key}-${idx}-${contactIdx}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h6 className="font-medium text-gray-800" data-testid={`text-contact-name-${key}-${idx}-${contactIdx}`}>
                                    {typeof contact === 'object' ? contact.name : contact}
                                  </h6>
                                  {typeof contact === 'object' && contact.phone && (
                                    <p className="text-sm text-gray-600" data-testid={`text-contact-phone-${key}-${idx}-${contactIdx}`}>
                                      📞 {contact.phone}
                                    </p>
                                  )}
                                  {typeof contact === 'object' && contact.description && (
                                    <p className="text-xs text-gray-500" data-testid={`text-contact-description-${key}-${idx}-${contactIdx}`}>
                                      {contact.description}
                                    </p>
                                  )}
                                  {typeof contact === 'object' && contact.available && (
                                    <p className="text-xs text-gray-500" data-testid={`text-contact-available-${key}-${idx}-${contactIdx}`}>
                                      Available: {contact.available}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  {typeof contact === 'object' && contact.phone && contact.phone !== 'Find local chapter' && contact.phone !== 'Online application only' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleCall(contact.phone)}
                                      className="bg-green-600 hover:bg-green-700"
                                      data-testid={`button-call-${key}-${idx}-${contactIdx}`}
                                    >
                                      <Phone className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(
                                      typeof contact === 'object' ? `${contact.name}: ${contact.phone || 'Contact info'} - ${contact.description}` : contact,
                                      'Contact info'
                                    )}
                                    data-testid={`button-copy-${key}-${idx}-${contactIdx}`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scripts */}
                    {resource.scripts && resource.scripts.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Call Scripts:</h5>
                        <div className="space-y-3">
                          {resource.scripts.map((script: Script, scriptIdx: number) => (
                            <div key={scriptIdx} className="bg-blue-50 rounded-lg p-3" data-testid={`script-${key}-${idx}-${scriptIdx}`}>
                              <h6 className="font-medium text-blue-800 mb-2" data-testid={`text-script-scenario-${key}-${idx}-${scriptIdx}`}>
                                {script.scenario}:
                              </h6>
                              <p className="text-sm text-blue-700 italic" data-testid={`text-script-content-${key}-${idx}-${scriptIdx}`}>
                                "{script.script}"
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => handleCopy(script.script, 'Script')}
                                data-testid={`button-copy-script-${key}-${idx}-${scriptIdx}`}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy Script
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rights */}
                    {resource.rights && resource.rights.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Your Rights:</h5>
                        <ul className="space-y-1">
                          {resource.rights.map((right: string, rightIdx: number) => (
                            <li key={rightIdx} className="text-sm text-gray-600 flex items-start" data-testid={`text-right-${key}-${idx}-${rightIdx}`}>
                              <Shield className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              {right}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resource.timeframe && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800" data-testid={`text-timeframe-${key}-${idx}`}>
                            {resource.timeframe}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </MobileCard>
      ))}
    </div>
  );
}

// Support Network Component
function SupportNetwork() {
  const [zipCode, setZipCode] = useState('');
  const [localResources, setLocalResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const supportTypes = [
    {
      title: 'Mental Health Crisis Support',
      icon: Heart,
      resources: [
        {
          name: 'National Suicide Prevention Lifeline',
          phone: '988',
          description: 'Free, confidential crisis support 24/7',
          available: '24/7'
        },
        {
          name: 'Crisis Text Line',
          phone: 'Text HOME to 741741',
          description: 'Free crisis support via text message',
          available: '24/7'
        },
        {
          name: 'NAMI Helpline',
          phone: '1-800-950-6264',
          description: 'Mental health information and support',
          available: 'Mon-Fri 10am-8pm EST'
        }
      ]
    },
    {
      title: 'Financial Counseling',
      icon: DollarSign,
      resources: [
        {
          name: 'National Foundation for Credit Counseling',
          phone: '1-800-388-2227',
          description: 'Free and low-cost credit counseling',
          available: 'Business hours'
        },
        {
          name: 'Financial Planning Association',
          phone: 'Find local planner',
          description: 'Pro bono financial planning services',
          available: 'Varies'
        }
      ]
    },
    {
      title: 'Patient Navigation Services',
      icon: Navigation,
      resources: [
        {
          name: 'Patient Navigator Institute',
          phone: 'Contact through website',
          description: 'Connects patients with navigation services',
          available: 'Online resources'
        },
        {
          name: 'Hospital Patient Advocates',
          phone: 'Call your hospital',
          description: 'In-house advocacy and assistance',
          available: 'Business hours'
        }
      ]
    }
  ];

  const findLocalResources = async () => {
    if (!zipCode || zipCode.length !== 5) {
      toast({
        title: "Invalid ZIP code",
        description: "Please enter a valid 5-digit ZIP code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call for local resources
    setTimeout(() => {
      const mockResources = [
        {
          name: 'Local United Way Chapter',
          type: 'Emergency Assistance',
          phone: '(555) 123-4567',
          address: '123 Main St, Your City',
          services: ['Emergency financial assistance', 'Utility help', 'Medical bill assistance']
        },
        {
          name: 'Community Health Center',
          type: 'Healthcare',
          phone: '(555) 234-5678',
          address: '456 Oak Ave, Your City',
          services: ['Sliding scale fees', 'Charity care', 'Patient advocacy']
        },
        {
          name: 'Local Legal Aid Society',
          type: 'Legal Services',
          phone: '(555) 345-6789',
          address: '789 Pine St, Your City',
          services: ['Medical debt advice', 'Bankruptcy counseling', 'Consumer protection']
        }
      ];
      
      setLocalResources(mockResources);
      setLoading(false);
      toast({
        title: "Local resources found",
        description: `Found ${mockResources.length} resources in your area`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800" data-testid="text-support-network-title">
        Support Network
      </h2>

      {/* Local Resource Finder */}
      <MobileCard className="p-6" data-testid="card-local-resources">
        <h3 className="text-lg font-semibold text-gray-800 mb-4" data-testid="text-local-finder-title">
          Find Local Resources
        </h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
              data-testid="input-zip-code"
            />
            <MobileButton
              onClick={findLocalResources}
              disabled={loading}
              data-testid="button-find-resources"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </MobileButton>
          </div>

          {localResources.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700" data-testid="text-local-results-title">
                Local Resources in {zipCode}:
              </h4>
              {localResources.map((resource, idx) => (
                <div key={idx} className="border rounded-lg p-3" data-testid={`local-resource-${idx}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-800" data-testid={`text-local-name-${idx}`}>
                      {resource.name}
                    </h5>
                    <Badge variant="outline" data-testid={`badge-local-type-${idx}`}>
                      {resource.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2" data-testid={`text-local-phone-${idx}`}>
                    📞 {resource.phone}
                  </p>
                  <p className="text-sm text-gray-600 mb-2" data-testid={`text-local-address-${idx}`}>
                    📍 {resource.address}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {resource.services.map((service: string, serviceIdx: number) => (
                      <Badge key={serviceIdx} variant="secondary" className="text-xs" data-testid={`badge-local-service-${idx}-${serviceIdx}`}>
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MobileCard>

      {/* National Support Resources */}
      <div className="space-y-4">
        {supportTypes.map((type, typeIdx) => (
          <MobileCard key={typeIdx} className="p-4" data-testid={`card-support-type-${typeIdx}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <type.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800" data-testid={`text-support-title-${typeIdx}`}>
                {type.title}
              </h3>
            </div>
            
            <div className="space-y-3">
              {type.resources.map((resource, resourceIdx) => (
                <div key={resourceIdx} className="bg-gray-50 rounded-lg p-3" data-testid={`support-resource-${typeIdx}-${resourceIdx}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800" data-testid={`text-support-name-${typeIdx}-${resourceIdx}`}>
                        {resource.name}
                      </h4>
                      <p className="text-sm text-gray-600" data-testid={`text-support-phone-${typeIdx}-${resourceIdx}`}>
                        📞 {resource.phone}
                      </p>
                      <p className="text-xs text-gray-500" data-testid={`text-support-description-${typeIdx}-${resourceIdx}`}>
                        {resource.description}
                      </p>
                      <p className="text-xs text-gray-500" data-testid={`text-support-available-${typeIdx}-${resourceIdx}`}>
                        Available: {resource.available}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {resource.phone !== 'Find local planner' && resource.phone !== 'Contact through website' && (
                        <Button
                          size="sm"
                          onClick={() => window.location.href = `tel:${resource.phone}`}
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`button-call-support-${typeIdx}-${resourceIdx}`}
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`${resource.name}: ${resource.phone} - ${resource.description}`)}
                        data-testid={`button-copy-support-${typeIdx}-${resourceIdx}`}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MobileCard>
        ))}
      </div>
    </div>
  );
}

// Educational Content Component
function EducationalContent() {
  const [activeSection, setActiveSection] = useState('rights');

  const educationalSections = {
    rights: {
      title: 'Emergency Rights & Protections',
      icon: Shield,
      content: [
        {
          title: 'Your Immediate Rights',
          description: 'Critical protections you have right now',
          points: [
            'Right to request charity care at any non-profit hospital',
            'Right to an itemized bill within 30 days',
            'Right to dispute billing errors',
            'Protection from collections during charity care review',
            'Right to payment plans you can afford',
            'Protection from medical debt wage garnishment in many states'
          ]
        },
        {
          title: 'Collection Protection Laws',
          description: 'What debt collectors cannot do',
          points: [
            'Cannot call before 8am or after 9pm',
            'Cannot use abusive, profane, or threatening language',
            'Cannot discuss your debt with others',
            'Cannot misrepresent the amount owed',
            'Cannot threaten arrest or legal action they cannot take',
            'Must stop calling if you request it in writing'
          ]
        },
        {
          title: 'Hospital-Specific Protections',
          description: 'Special rules for hospital billing',
          points: [
            'Non-profit hospitals must have charity care policies',
            'Must provide financial assistance application',
            'Cannot pursue collections for 120 days after applying',
            'Cannot report to credit bureaus during review',
            'Must accept reasonable payment plans',
            'Cannot require collateral for payment plans'
          ]
        }
      ]
    },
    collections: {
      title: 'Preventing Collections',
      icon: AlertTriangle,
      content: [
        {
          title: 'Immediate Steps to Prevent Collections',
          description: 'Actions to take within 24-48 hours',
          points: [
            'Contact the billing department immediately',
            'Request charity care application',
            'Ask for payment freeze while applying',
            'Document all communications',
            'Send written request for payment plan',
            'Keep copies of all correspondence'
          ]
        },
        {
          title: 'If Collections Have Started',
          description: 'How to respond to collection attempts',
          points: [
            'Request debt validation in writing within 30 days',
            'Ask for proof the debt is yours',
            'Request original creditor information',
            'Dispute any inaccurate information',
            'Know that you can still apply for charity care',
            'Consider negotiating a settlement'
          ]
        },
        {
          title: 'Communication Strategies',
          description: 'How to communicate effectively',
          points: [
            'Always communicate in writing when possible',
            'Keep detailed records of all phone calls',
            'Never admit fault or agree to payment you cannot afford',
            'Ask for supervisor if needed',
            'Request all agreements in writing',
            'Know you can request to be contacted by mail only'
          ]
        }
      ]
    },
    credit: {
      title: 'Credit Protection Strategies',
      icon: CreditCard,
      content: [
        {
          title: 'Protecting Your Credit Score',
          description: 'How to minimize credit damage',
          points: [
            'Medical debt under $500 no longer reported to credit bureaus',
            'Paid medical debt removed from credit reports',
            'One-year waiting period before reporting new medical debt',
            'You can dispute inaccurate medical debt entries',
            'Charity care approval removes debt from credit reports',
            'Payment plans prevent collection reporting in many cases'
          ]
        },
        {
          title: 'Credit Monitoring During Crisis',
          description: 'Keep track of your credit during medical debt crisis',
          points: [
            'Check credit reports monthly during crisis',
            'Dispute any inaccurate medical debt entries',
            'Document charity care applications and approvals',
            'Keep records of payment plan agreements',
            'Monitor for identity theft during stressful times',
            'Consider credit monitoring services'
          ]
        }
      ]
    },
    recovery: {
      title: 'Long-term Recovery Planning',
      icon: TrendingUp,
      content: [
        {
          title: 'Financial Recovery Steps',
          description: 'Building back financial stability',
          points: [
            'Create emergency fund for future medical expenses',
            'Review and update health insurance coverage',
            'Establish relationship with patient advocate',
            'Learn about health savings accounts (HSAs)',
            'Build network of financial and legal resources',
            'Develop written plan for future medical expenses'
          ]
        },
        {
          title: 'Preventing Future Crises',
          description: 'Strategies to avoid future medical debt crises',
          points: [
            'Always ask for cost estimates before procedures',
            'Verify insurance coverage before treatment',
            'Keep detailed records of all medical communications',
            'Build emergency fund for medical expenses',
            'Know your insurance benefits and limitations',
            'Establish care at hospitals with strong charity care programs'
          ]
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800" data-testid="text-educational-title">
        Emergency Education
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(educationalSections).map(([key, section]) => (
          <Button
            key={key}
            variant={activeSection === key ? "default" : "outline"}
            onClick={() => setActiveSection(key)}
            className="flex items-center space-x-2"
            data-testid={`button-section-${key}`}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.title}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {educationalSections[activeSection as keyof typeof educationalSections].content.map((item, idx) => (
          <MobileCard key={idx} className="p-6" data-testid={`card-education-${activeSection}-${idx}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid={`text-education-title-${activeSection}-${idx}`}>
              {item.title}
            </h3>
            <p className="text-gray-600 mb-4" data-testid={`text-education-description-${activeSection}-${idx}`}>
              {item.description}
            </p>
            <ul className="space-y-2">
              {item.points.map((point, pointIdx) => (
                <li key={pointIdx} className="flex items-start text-sm text-gray-600" data-testid={`text-education-point-${activeSection}-${idx}-${pointIdx}`}>
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </MobileCard>
        ))}
      </div>
    </div>
  );
}

// Main Emergency Help Page Component
export default function EmergencyHelp() {
  const [activeTab, setActiveTab] = useState('assessment');
  const { isAuthenticated } = useAuth();

  return (
    <MobileLayout title="Emergency Financial Help" showBackButton={true} data-testid="layout-emergency-help">
      <div className="space-y-6">
        {/* Crisis Alert Banner */}
        <MobileCard className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200" data-testid="card-crisis-banner">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-800" data-testid="text-crisis-title">
                Emergency Medical Debt Crisis Help
              </h1>
              <p className="text-red-700" data-testid="text-crisis-subtitle">
                Immediate resources for financial emergencies
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h2 className="font-semibold text-red-800 mb-2" data-testid="text-crisis-help-title">
              🚨 Need Immediate Help?
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <a 
                href="tel:211" 
                className="flex items-center justify-center bg-red-600 text-white rounded-lg py-3 px-4 font-semibold"
                data-testid="button-call-211"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call 2-1-1 for Emergency Assistance
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="tel:988" 
                  className="flex items-center justify-center bg-gray-600 text-white rounded-lg py-2 px-3 text-sm font-semibold"
                  data-testid="button-call-988"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Crisis: 988
                </a>
                <a 
                  href="sms:741741" 
                  className="flex items-center justify-center bg-blue-600 text-white rounded-lg py-2 px-3 text-sm font-semibold"
                  data-testid="button-text-crisis"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Text: 741741
                </a>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-testid="tabs-emergency-help">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessment" data-testid="tab-assessment">Assessment</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
            <TabsTrigger value="support" data-testid="tab-support">Support</TabsTrigger>
            <TabsTrigger value="education" data-testid="tab-education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="mt-6" data-testid="content-assessment">
            <CrisisAssessmentTool />
          </TabsContent>

          <TabsContent value="resources" className="mt-6" data-testid="content-resources">
            <EmergencyResources />
          </TabsContent>

          <TabsContent value="support" className="mt-6" data-testid="content-support">
            <SupportNetwork />
          </TabsContent>

          <TabsContent value="education" className="mt-6" data-testid="content-education">
            <EducationalContent />
          </TabsContent>
        </Tabs>

        {/* Emergency Action Summary */}
        <MobileCard className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200" data-testid="card-action-summary">
          <h2 className="text-lg font-bold text-blue-800 mb-4" data-testid="text-summary-title">
            🎯 Quick Action Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2" data-testid="summary-item-1">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-700">
                <strong>Step 1:</strong> Take the crisis assessment to get your personalized action plan
              </span>
            </div>
            <div className="flex items-center space-x-2" data-testid="summary-item-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-700">
                <strong>Step 2:</strong> Contact emergency resources immediately if in crisis
              </span>
            </div>
            <div className="flex items-center space-x-2" data-testid="summary-item-3">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-700">
                <strong>Step 3:</strong> Apply for hospital charity care and financial assistance
              </span>
            </div>
            <div className="flex items-center space-x-2" data-testid="summary-item-4">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-700">
                <strong>Step 4:</strong> Build your support network and learn your rights
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-600 text-center" data-testid="text-remember-message">
              Remember: You have rights and options. Medical debt is often negotiable or forgivable. Don't face this alone.
            </p>
          </div>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}