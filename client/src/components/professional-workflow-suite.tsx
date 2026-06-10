import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
import { 
  FileText, 
  Phone,
  Send,
  Calendar,
  Scale,
  Shield,
  Target,
  Award,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  ArrowRight,
  Zap
} from "lucide-react";

interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: 'dispute' | 'negotiation' | 'appeal' | 'legal' | 'financial';
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  successRate: number;
  savingsPotential: string;
  icon: React.ComponentType<{ className?: string }>;
  requirements: string[];
  steps: string[];
}

interface ProfessionalWorkflowSuiteProps {
  billAmount?: string;
  provider?: string;
  cptCodes?: string[];
  icdCodes?: string[];
  analysisResults?: any;
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}

export function ProfessionalWorkflowSuite({ 
  billAmount, 
  provider, 
  cptCodes = [], 
  icdCodes = [],
  analysisResults,
  onSendMessage,
  isVisible 
}: ProfessionalWorkflowSuiteProps) {
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [workflowData, setWorkflowData] = useState<Record<string, any>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'comprehensive-dispute',
      title: 'Comprehensive Bill Dispute',
      description: 'Multi-faceted dispute strategy targeting all billing errors and violations',
      category: 'dispute',
      complexity: 'expert',
      estimatedTime: '45 min',
      successRate: 94,
      savingsPotential: '$5,000-$75,000',
      icon: FileText,
      requirements: ['Itemized bill', 'Medical records access', 'Insurance documentation'],
      steps: [
        'Bill forensic analysis and error documentation',
        'Regulatory violation identification',
        'Evidence package compilation',
        'Multi-level dispute letter generation',
        'Escalation strategy development'
      ]
    },
    {
      id: 'executive-negotiation',
      title: 'Executive-Level Negotiation',
      description: 'Strategic approach targeting C-suite decision makers',
      category: 'negotiation',
      complexity: 'advanced',
      estimatedTime: '30 min',
      successRate: 87,
      savingsPotential: '$3,000-$50,000',
      icon: Briefcase,
      requirements: ['Hospital hierarchy research', 'Financial hardship documentation'],
      steps: [
        'Executive contact identification',
        'Strategic positioning development',
        'Authority-based negotiation script',
        'Follow-up protocol establishment'
      ]
    },
    {
      id: 'insurance-appeal-mastery',
      title: 'Insurance Appeal Mastery',
      description: 'Professional-grade insurance denial reversal strategy',
      category: 'appeal',
      complexity: 'advanced',
      estimatedTime: '40 min',
      successRate: 78,
      savingsPotential: '$2,000-$100,000',
      icon: Shield,
      requirements: ['Denial letter', 'Medical necessity documentation', 'Policy details'],
      steps: [
        'Denial reason analysis',
        'Medical necessity argument development',
        'Policy citation compilation',
        'Appeal package assembly',
        'External review preparation'
      ]
    },
    {
      id: 'regulatory-complaint',
      title: 'Regulatory Complaint Filing',
      description: 'Federal and state regulatory action strategy',
      category: 'legal',
      complexity: 'expert',
      estimatedTime: '60 min',
      successRate: 82,
      savingsPotential: '$10,000-$200,000',
      icon: Scale,
      requirements: ['Evidence of violations', 'Documented communications'],
      steps: [
        'Violation categorization and documentation',
        'Regulatory authority identification',
        'Formal complaint preparation',
        'Supporting evidence compilation',
        'Follow-up and escalation strategy'
      ]
    },
    {
      id: 'financial-hardship-advocacy',
      title: 'Financial Hardship Advocacy',
      description: 'Comprehensive financial assistance program navigation',
      category: 'financial',
      complexity: 'intermediate',
      estimatedTime: '25 min',
      successRate: 91,
      savingsPotential: '$1,000-$25,000',
      icon: TrendingUp,
      requirements: ['Income documentation', 'Asset information'],
      steps: [
        'Financial profile assessment',
        'Program eligibility analysis',
        'Application optimization',
        'Approval probability maximization'
      ]
    },
    {
      id: 'rapid-response-dispute',
      title: 'Rapid Response Dispute',
      description: 'Fast-track dispute for urgent billing situations',
      category: 'dispute',
      complexity: 'basic',
      estimatedTime: '15 min',
      successRate: 73,
      savingsPotential: '$500-$15,000',
      icon: Zap,
      requirements: ['Basic bill information'],
      steps: [
        'Immediate error identification',
        'Quick dispute letter generation',
        'Priority escalation setup'
      ]
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'text-muted-foreground bg-secondary';
      case 'intermediate': return 'text-muted-foreground bg-secondary';
      case 'advanced': return 'text-foreground bg-secondary';
      case 'expert': return 'text-gold bg-secondary';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dispute': return FileText;
      case 'negotiation': return Phone;
      case 'appeal': return Shield;
      case 'legal': return Scale;
      case 'financial': return TrendingUp;
      default: return FileText;
    }
  };

  const generateWorkflowPrompt = async (workflow: WorkflowTemplate) => {
    setIsGenerating(true);
    
    const prompt = `I need you to execute a comprehensive "${workflow.title}" strategy that leverages ${workflow.successRate}% success rate methodologies used by professional medical billing advocates who charge $2,000-$5,000 for this level of service. This workflow has helped patients save ${workflow.savingsPotential} through systematic application of proven advocacy techniques.

WORKFLOW CONTEXT:
• Bill Amount: ${billAmount || 'To be determined'}
• Healthcare Provider: ${provider || 'To be specified'}
• Medical Codes: ${cptCodes.length} CPT codes, ${icdCodes.length} ICD codes identified
• Complexity Level: ${workflow.complexity.toUpperCase()}
• Estimated Completion: ${workflow.estimatedTime}

STRATEGIC WORKFLOW EXECUTION:
${workflow.steps.map((step, index) => `
PHASE ${index + 1}: ${step.toUpperCase()}
I need you to provide comprehensive guidance for this critical phase, including specific actions, required documentation, deadlines, and success metrics. Reference industry best practices and regulatory requirements that maximize effectiveness.`).join('')}

REQUIRED DELIVERABLES:
${workflow.requirements.map(req => `• ${req}`).join('\n')}

PROFESSIONAL METHODOLOGY:
This ${workflow.category} strategy must incorporate:

1. **STRATEGIC POSITIONING**: Position this case using language and approach that compels immediate attention from hospital decision-makers. Reference specific patient rights, regulatory requirements, and industry standards that create legal accountability.

2. **EVIDENCE-BASED APPROACH**: Build systematic documentation that proves billing violations, overcharges, or coverage violations. Include specific citations, industry benchmarks, and regulatory guidelines that support our position.

3. **ESCALATION FRAMEWORK**: Create structured escalation pathway that progressively increases pressure for resolution while maintaining professional relationships and protecting legal rights throughout the process.

4. **COMMUNICATION PROTOCOLS**: Develop specific scripts, letter templates, and documentation requirements for each interaction. Include timing strategies that leverage hospital billing cycles and decision-making processes.

5. **REGULATORY COMPLIANCE**: Ensure all strategies comply with federal and state regulations while leveraging patient protection laws that create advantageous negotiating positions.

SPECIALIZED REQUIREMENTS FOR ${workflow.category.toUpperCase()} STRATEGY:
${workflow.category === 'dispute' ? `
- Bill forensic analysis with line-by-line error identification
- Regulatory violation documentation with specific citations
- Multiple-level dispute letter generation targeting different authority levels
- Evidence preservation and legal protection protocols
- Timeline management for maximum leverage` : ''}

${workflow.category === 'negotiation' ? `
- Psychological profiling of hospital billing departments and decision makers
- Authority mapping to identify personnel with bill reduction capabilities
- Strategic timing optimization based on hospital financial cycles
- Hardship positioning that triggers institutional policies and procedures
- Settlement framework development with minimum acceptable terms` : ''}

${workflow.category === 'appeal' ? `
- Medical necessity argument development with clinical evidence
- Insurance policy analysis and coverage requirement verification
- Denial reason deconstruction and counterargument formulation
- External review preparation and physician expert engagement
- Success probability optimization through strategic appeal timing` : ''}

${workflow.category === 'legal' ? `
- Federal and state regulatory violation identification and documentation
- Formal complaint preparation for multiple regulatory agencies
- Legal protection strategy throughout complaint process
- Evidence preservation and attorney consultation preparation
- Regulatory response management and escalation protocols` : ''}

${workflow.category === 'financial' ? `
- Comprehensive financial profile assessment and documentation
- Hospital charity care and financial assistance program analysis
- Application optimization for maximum approval probability
- Alternative funding source identification and application coordination
- Long-term financial protection strategy development` : ''}

SUCCESS METRICS AND TARGETS:
Based on the ${workflow.successRate}% success rate for this methodology, provide specific benchmarks and target outcomes. Include timeline expectations, communication milestones, and decision points that indicate progress toward successful resolution.

Please execute this comprehensive ${workflow.title} strategy with the systematic approach that has generated ${workflow.savingsPotential} in savings for patients facing similar billing challenges. Provide actionable guidance that transforms this proven methodology into specific steps I can implement immediately.`;

    onSendMessage(prompt);
    setIsGenerating(false);
  };

  const startWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setActiveStep(0);
    setWorkflowData({});
  };

  const completeWorkflow = () => {
    if (selectedWorkflow) {
      generateWorkflowPrompt(selectedWorkflow);
      setSelectedWorkflow(null);
      setActiveStep(0);
      setWorkflowData({});
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card relative overflow-hidden"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Professional Workflow Suite"
          description="Access expert-level bill advocacy workflows with 90%+ success rates used by professional billing advocates."
          featureName="Workflow Suite"
          savingsPotential="$25,000-$200,000"
        />
      )}

      {/* Enhanced Header */}
      <div className="flex items-center space-x-4 mb-8">
        <motion.div 
          className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Award className="h-8 w-8 text-white relative z-10" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold text-foreground mb-1">
            Professional Workflow Suite
          </h3>
          <div className="flex items-center space-x-3 text-sm">
            <Badge variant="outline" className="bg-secondary text-gold border-border">
              Expert-level strategies
            </Badge>
            <span className="text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              90%+ success rates
            </span>
          </div>
        </div>
      </div>

      {selectedWorkflow ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-serif font-bold text-foreground">{selectedWorkflow.title}</h4>
              <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
            </div>
            <Button variant="ghost" onClick={() => setSelectedWorkflow(null)}>
              ← Back
            </Button>
          </div>

          <div className="space-y-4">
            {/* Enhanced Statistics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="luxury-card p-4 text-center relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-gold">
                    {selectedWorkflow.successRate}%
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Success Rate</div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="luxury-card p-4 text-center relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-foreground">
                    {selectedWorkflow.savingsPotential}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Savings Range</div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="luxury-card p-4 text-center relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-foreground">
                    {selectedWorkflow.estimatedTime}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Est. Time</div>
                </div>
              </motion.div>
            </div>

            <div>
              <h5 className="font-medium text-foreground mb-2">Workflow Steps:</h5>
              <div className="space-y-2">
                {selectedWorkflow.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      index <= activeStep ? 'bg-secondary' : 'bg-muted'
                    }`}
                  >
                    {index < activeStep ? (
                      <CheckCircle2 className="h-5 w-5 text-gold" />
                    ) : index === activeStep ? (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                    <span className={`text-sm ${
                      index <= activeStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={completeWorkflow}
                disabled={isGenerating}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary"
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Execute Complete Workflow
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="dispute">Dispute</TabsTrigger>
            <TabsTrigger value="negotiation">Negotiate</TabsTrigger>
            <TabsTrigger value="appeal">Appeal</TabsTrigger>
          </TabsList>

          {['all', 'dispute', 'negotiation', 'appeal'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {workflowTemplates
                  .filter(workflow => tab === 'all' || workflow.category === tab)
                  .map((workflow, index) => {
                    const IconComponent = workflow.icon;
                    return (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="luxury-card p-5 cursor-pointer relative overflow-hidden group"
                        onClick={() => startWorkflow(workflow)}
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div 
                            className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <IconComponent className="h-6 w-6 text-muted-foreground relative z-10" />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{workflow.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getComplexityColor(workflow.complexity)}`}>
                                  {workflow.complexity}
                                </Badge>
                                <span className="text-sm font-medium text-gold">
                                  {workflow.successRate}%
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {workflow.estimatedTime}
                                </span>
                                <span className="flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {workflow.savingsPotential}
                                </span>
                              </div>
                              <span className="text-xs text-gold">
                                Click to start →
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </motion.div>
  );
}