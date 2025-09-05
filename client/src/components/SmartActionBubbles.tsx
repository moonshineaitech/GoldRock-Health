import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Phone, 
  Calculator, 
  Send, 
  Shield, 
  CheckCircle2, 
  DollarSign,
  AlertTriangle,
  Calendar,
  Download,
  Printer,
  Mail,
  Users,
  Scale,
  Clock,
  Target,
  Zap,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  bgColor: string;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
}

interface SmartActionBubblesProps {
  context: 'dispute-letter' | 'negotiation-script' | 'error-detection' | 'billing-rights' | 'claim-appeal' | 'general';
  aiResponse: string;
  onSendMessage: (message: string) => void;
  onGenerateDocument?: (type: string) => void;
}

export function SmartActionBubbles({ context, aiResponse, onSendMessage, onGenerateDocument }: SmartActionBubblesProps) {
  
  const getContextualActions = (): SmartAction[] => {
    const baseActions: Record<string, SmartAction[]> = {
      'dispute-letter': [
        {
          id: 'send-dispute',
          label: 'Send to Hospital',
          icon: Send,
          description: 'Email or mail your dispute letter',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Help me send this dispute letter to the hospital billing department. What's the best way to submit it for maximum impact?")
        },
        {
          id: 'track-timeline',
          label: 'Set Follow-up Timeline',
          icon: Calendar,
          description: 'Create 30-60-90 day follow-up schedule',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'high',
          action: () => onSendMessage("Create a follow-up timeline for my dispute letter. When should I expect responses and what are my next steps if they don't respond?")
        },
        {
          id: 'legal-backup',
          label: 'Legal Protection',
          icon: Shield,
          description: 'Understand your legal rights',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'medium',
          action: () => onSendMessage("What are my legal protections and rights when disputing medical bills? What can the hospital legally do or not do during this process?")
        },
        {
          id: 'evidence-package',
          label: 'Build Evidence Package',
          icon: FileText,
          description: 'Gather supporting documentation',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("Help me create a comprehensive evidence package to support my dispute. What additional documents should I gather?")
        }
      ],
      
      'negotiation-script': [
        {
          id: 'practice-call',
          label: 'Practice Session',
          icon: Phone,
          description: 'Rehearse your negotiation approach',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 hover:bg-indigo-200',
          priority: 'high',
          action: () => onSendMessage("Let's practice this negotiation call. Can you role-play as the billing department and help me rehearse my approach?")
        },
        {
          id: 'escalation-plan',
          label: 'Escalation Strategy',
          icon: Target,
          description: 'Plan for supervisor escalation',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'high',
          action: () => onSendMessage("Create an escalation strategy. If the first person can't help, how do I get to supervisors and decision-makers who can approve reductions?")
        },
        {
          id: 'reference-data',
          label: 'Get Market Rates',
          icon: Calculator,
          description: 'Find pricing benchmarks',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 hover:bg-emerald-200',
          priority: 'medium',
          action: () => onSendMessage("Help me find market rate data and pricing benchmarks for my specific procedures to strengthen my negotiation position.")
        },
        {
          id: 'timing-strategy',
          label: 'Best Call Times',
          icon: Clock,
          description: 'Optimize timing for success',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 hover:bg-yellow-200',
          priority: 'low',
          action: () => onSendMessage("When is the best time to call billing departments for negotiations? What days and times are most effective?")
        },
        {
          id: 'financial-hardship',
          label: 'Financial Hardship Programs',
          icon: Users,
          description: 'AI-powered assistance programs',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 hover:bg-indigo-200',
          priority: 'high',
          action: () => onSendMessage("Generate a comprehensive guide to financial hardship programs, charity care, and assistance options I may qualify for. Include specific application strategies and qualification requirements.")
        }
      ],
      
      'error-detection': [
        {
          id: 'generate-dispute',
          label: 'Generate Dispute Letter',
          icon: FileText,
          description: 'Create formal dispute documentation',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Based on these billing errors, generate a comprehensive dispute letter I can send to the hospital billing department.")
        },
        {
          id: 'calculate-savings',
          label: 'Calculate Total Savings',
          icon: DollarSign,
          description: 'Estimate financial impact',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'high',
          action: () => onSendMessage("Calculate the total potential savings from all these identified billing errors. What's the maximum amount I could save?")
        },
        {
          id: 'priority-errors',
          label: 'Prioritize by Impact',
          icon: Zap,
          description: 'Focus on highest-value errors first',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("Rank these billing errors by potential savings and ease of dispute. Which ones should I focus on first for maximum impact?")
        },
        {
          id: 'contact-script',
          label: 'Phone Call Script',
          icon: Phone,
          description: 'Get negotiation talking points',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("Create a phone script for calling the billing department about these specific errors. What exactly should I say?")
        },
        {
          id: 'regulatory-complaint',
          label: 'File Regulatory Complaint',
          icon: AlertTriangle,
          description: 'AI-guided complaint strategy',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'medium',
          action: () => onSendMessage("Generate a comprehensive strategy for filing regulatory complaints about these billing errors. Which agencies should I contact and what documentation do I need?")
        }
      ],
      
      'billing-rights': [
        {
          id: 'file-complaint',
          label: 'File Official Complaint',
          icon: Scale,
          description: 'Report violations to authorities',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'high',
          action: () => onSendMessage("Help me file an official complaint with the appropriate regulatory agencies about these billing rights violations.")
        },
        {
          id: 'document-violations',
          label: 'Document Everything',
          icon: FileText,
          description: 'Create violation evidence file',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Help me systematically document all billing rights violations for legal protection and complaint filing.")
        },
        {
          id: 'know-deadlines',
          label: 'Important Deadlines',
          icon: AlertTriangle,
          description: 'Don\'t miss critical dates',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("What are the critical deadlines I need to know about for billing disputes, appeals, and legal actions?")
        },
        {
          id: 'get-advocate',
          label: 'Find Patient Advocate',
          icon: Users,
          description: 'Get professional help',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'medium',
          action: () => onSendMessage("Help me find a qualified patient billing advocate or attorney who specializes in medical billing disputes.")
        },
        {
          id: 'credit-protection',
          label: 'Credit Protection Strategy',
          icon: Shield,
          description: 'AI-powered credit safeguards',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-100 hover:bg-cyan-200',
          priority: 'high',
          action: () => onSendMessage("Generate a comprehensive strategy to protect my credit from medical debt. What steps can I take to prevent this from affecting my credit score, and what are my rights?")
        }
      ],
      
      'claim-appeal': [
        {
          id: 'submit-appeal',
          label: 'Submit to Insurance',
          icon: Send,
          description: 'File formal insurance appeal',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Help me submit this appeal to my insurance company. What's the exact process and what supporting documents do I need?")
        },
        {
          id: 'external-review',
          label: 'Request External Review',
          icon: BookOpen,
          description: 'Independent medical review',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'high',
          action: () => onSendMessage("If my insurance denies this appeal, how do I request an external independent review? What are my options?")
        },
        {
          id: 'medical-records',
          label: 'Gather Medical Records',
          icon: FileText,
          description: 'Collect supporting evidence',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 hover:bg-emerald-200',
          priority: 'medium',
          action: () => onSendMessage("What specific medical records and documentation do I need to gather to support this insurance appeal?")
        },
        {
          id: 'appeal-timeline',
          label: 'Track Appeal Process',
          icon: Calendar,
          description: 'Monitor deadlines and responses',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("Create a timeline for tracking my insurance appeal process. What are the key milestones and deadlines?")
        },
        {
          id: 'medical-necessity',
          label: 'Medical Necessity Documentation',
          icon: BookOpen,
          description: 'AI clinical justification help',
          color: 'text-teal-600',
          bgColor: 'bg-teal-100 hover:bg-teal-200',
          priority: 'medium',
          action: () => onSendMessage("Help me build a medical necessity argument for my insurance appeal. What clinical documentation and medical justifications should I include to strengthen my case?")
        }
      ],
      
      'general': [
        {
          id: 'generate-dispute',
          label: 'Generate Dispute Letter',
          icon: FileText,
          description: 'Create formal dispute documentation',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Based on this analysis, generate a comprehensive dispute letter I can send to the hospital billing department.")
        },
        {
          id: 'negotiation-help',
          label: 'Get Negotiation Script',
          icon: Phone,
          description: 'Phone call talking points',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'high',
          action: () => onSendMessage("Create a phone negotiation script for calling the billing department about these issues. What exactly should I say?")
        },
        {
          id: 'savings-calculation',
          label: 'Calculate Potential Savings',
          icon: DollarSign,
          description: 'Estimate financial impact',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 hover:bg-emerald-200',
          priority: 'medium',
          action: () => onSendMessage("Calculate the total potential savings from this analysis. What's the maximum amount I could save?")
        },
        {
          id: 'next-steps',
          label: 'What Should I Do Next?',
          icon: Target,
          description: 'Step-by-step action plan',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("Give me a step-by-step action plan. What are my next steps to reduce this medical bill?")
        },
        {
          id: 'advanced-strategies',
          label: 'Advanced Strategies',
          icon: Zap,
          description: 'AI-generated advanced tactics',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("I've tried the basic approaches. What are some advanced, lesser-known strategies and tactics I can use to reduce this medical bill? Generate creative AI-powered solutions.")
        },
        {
          id: 'legal-escalation',
          label: 'Legal Escalation Path',
          icon: Scale,
          description: 'AI legal guidance & options',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'medium',
          action: () => onSendMessage("If standard negotiations fail, what are my legal escalation options? Generate a comprehensive legal strategy including regulatory complaints, patient advocates, and legal protections I can invoke.")
        }
      ]
    };

    return baseActions[context] || [];
  };

  const actions = getContextualActions();
  
  // Sort actions by priority
  const sortedActions = actions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sortedActions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-4 space-y-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-semibold text-gray-700">Recommended Next Steps</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {sortedActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Button
                variant="ghost"
                onClick={action.action}
                className={`w-full justify-start p-3 h-auto ${action.bgColor} border border-gray-200 hover:shadow-sm transition-all duration-200`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg bg-white/70`}>
                    <IconComponent className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {action.description}
                    </div>
                  </div>
                  {action.priority === 'high' && (
                    <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      Priority
                    </div>
                  )}
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        className="mt-4 p-3 bg-gray-50 rounded-lg border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">Pro Tip</span>
        </div>
        <p className="text-xs text-gray-600">
          {getProTip(context)}
        </p>
      </motion.div>
    </motion.div>
  );
}

function getProTip(context: string): string {
  const tips: Record<string, string> = {
    'dispute-letter': 'Always send dispute letters via certified mail with return receipt to create a paper trail. Keep copies of everything.',
    'negotiation-script': 'Be polite but persistent. Ask for supervisors if the first person can\'t help. Many billing representatives have limited authority.',
    'error-detection': 'Focus on the highest-dollar errors first - they often provide the biggest savings with the same amount of effort.',
    'billing-rights': 'Document every conversation with dates, names, and reference numbers. This creates legal protection and accountability.',
    'claim-appeal': 'Insurance appeals have strict deadlines. Submit as early as possible and always request written confirmation of receipt.'
  };
  
  return tips[context] || 'Take action quickly - medical bills often have time limits for disputes and appeals.';
}