import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Brain, 
  Send, 
  Paperclip, 
  Bot,
  AlertTriangle,
  Shield,
  Loader2,
  Plus,
  MessageCircle,
  Camera,
  Info,
  BarChart3,
  Moon,
  Sun,
  CheckCircle,
  Circle,
  DollarSign,
  Building2,
  Calendar,
  FileText,
  ClipboardList,
  Crown,
  Lock,
  Copy,
  Download,
  Share,
  ChevronDown,
  Zap,
  Target,
  Sparkles,
  Settings,
  List,
  Filter,
  Activity,
  Clock
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import type { MedicalBill } from "@shared/schema";
import { BILL_AI_WORKFLOWS, type BillWorkflow, type WorkflowField } from "@shared/bill-ai-workflows";
import { 
  DisputeLetterGenerator, 
  ErrorDetectionChecklist, 
  BillingRightsAdvisor, 
  ClaimAppealGenerator 
} from "@/components/bill-ai-features";
import { BillAnalysisLoader } from "@/components/BillAnalysisLoader";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";
import { MedicalCodeAnalyzer } from "@/components/medical-code-analyzer";
import { EnhancedProgressTracker } from "@/components/enhanced-progress-tracker";
import { AdvancedErrorDetector } from "@/components/advanced-error-detector";
import { ProfessionalWorkflowSuite } from "@/components/professional-workflow-suite";
import { Link } from "wouter";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface IntakeState {
  amount?: string;
  provider?: string;
  dates?: string;
  insurance?: string;
  codes?: string;
  itemizedBill?: boolean;
  cptCodes?: string[];
  hcpcsCodes?: string[];
  icdCodes?: string[];
  lastUpdated?: Date;
}

interface AssessmentIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  savingsPotential?: string;
}

type NextRequiredField = 'amount' | 'provider' | 'dates' | 'insurance' | 'codes' | 'itemized' | 'complete';

// Workflow Selection Panel Component
const WorkflowSelectionPanel = ({ onWorkflowSelect, onStartChat }: {
  onWorkflowSelect: (workflow: BillWorkflow) => void;
  onStartChat: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  
  const coreWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'core');
  const specialtyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'specialty');
  const insuranceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance');
  const emergencyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'emergency');
  const financialWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial');
  const legalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'legal');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Medical Bill AI</h1>
            <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Exceeds HIPAA Standards
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Professional-grade bill analysis and advocacy. Save $1K-$100K+ with AI-powered dispute templates.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-emerald-600" />
            <span className="text-gray-600 dark:text-gray-400">94% Success Rate</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-emerald-600" />
            <span className="text-gray-600 dark:text-gray-400">$50M+ Saved</span>
          </div>
        </div>
      </div>

      {/* Core Workflows */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          Essential Workflows
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {coreWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onClick={() => onWorkflowSelect(workflow)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onStartChat}
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1 rounded-2xl border-gray-200 dark:border-gray-700"
          data-testid="start-chat-button"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Start Chat</span>
        </Button>
        <Link href="/blitz-demo" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-12 flex-col space-y-1 rounded-2xl border-orange-200 dark:border-orange-700 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            data-testid="blitz-demo-button"
          >
            <Zap className="h-4 w-4" />
            <span className="text-xs">Blitz Demo</span>
          </Button>
        </Link>
        <Button
          onClick={() => setShowAllWorkflows(true)}
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1 rounded-2xl border-gray-200 dark:border-gray-700"
          data-testid="view-all-workflows"
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs">All Tools</span>
        </Button>
      </div>

      {/* Premium Preview Section */}
      {!isSubscribed && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-orange-600" />
              <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">Premium Success Stories</h4>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-orange-700 dark:text-orange-300">
                <strong>Sarah M. saved $47,000</strong> on her surgery bill using our Advanced Error Detection
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-300">
                <strong>Mike D. saved $23,000</strong> with our Professional Dispute Letter Generator
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-300">
                <strong>Lisa K. saved $8,500</strong> using our Insurance Appeal Master workflows
              </div>
            </div>
            <Link href="/premium" className="mt-2 block">
              <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                <Crown className="h-3 w-3 mr-1" />
                See How Premium Users Save More
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Beginner-Friendly Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-600" />
          Perfect for Beginners
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BILL_AI_WORKFLOWS.filter(w => w.category === 'beginner').slice(0, 4).map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onClick={() => onWorkflowSelect(workflow)}
            />
          ))}
        </div>
        <Button
          onClick={() => setShowAllWorkflows(true)}
          variant="ghost"
          size="sm"
          className="w-full text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          data-testid="view-all-beginner-workflows"
        >
          View All {BILL_AI_WORKFLOWS.filter(w => w.category === 'beginner').length} Beginner-Friendly Tools
        </Button>
      </div>

      {/* Comprehensive Workflow Categories */}
      <div className="space-y-4">
        {/* Specialty Analysis */}
        {specialtyWorkflows.length > 0 && (
          <WorkflowCategory
            title="Specialty Analysis"
            icon={AlertTriangle}
            iconColor="text-blue-600"
            workflows={specialtyWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Insurance Appeals */}
        {insuranceWorkflows.length > 0 && (
          <WorkflowCategory
            title="Insurance Appeals"
            icon={Shield}
            iconColor="text-indigo-600"
            workflows={insuranceWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Financial Assistance */}
        {financialWorkflows.length > 0 && (
          <WorkflowCategory
            title="Financial Assistance"
            icon={DollarSign}
            iconColor="text-green-600"
            workflows={financialWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Legal & Disputes */}
        {legalWorkflows.length > 0 && (
          <WorkflowCategory
            title="Legal & Disputes"
            icon={FileText}
            iconColor="text-purple-600"
            workflows={legalWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Emergency Bills */}
        {emergencyWorkflows.length > 0 && (
          <WorkflowCategory
            title="Emergency Bills"
            icon={AlertTriangle}
            iconColor="text-red-600"
            workflows={emergencyWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}
      </div>

      {/* View All Workflows Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={() => setShowAllWorkflows(true)}
          variant="outline"
          className="w-full h-12 rounded-2xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
          data-testid="view-all-workflows-full"
        >
          <List className="h-4 w-4 mr-2" />
          View All {BILL_AI_WORKFLOWS.length} Workflows
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Workflow Card Component
const WorkflowCard = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 relative overflow-hidden`}
      data-testid={`workflow-${workflow.id}`}
    >
      {workflow.isPremium && !isSubscribed && (
        <div className="absolute top-1 right-1">
          <Crown className="h-3 w-3 text-orange-500" />
        </div>
      )}
      <workflow.icon className={`h-5 w-5 ${workflow.color}`} />
      <div className="text-center w-full">
        <div className="text-xs font-semibold text-gray-900 dark:text-white">{workflow.title}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{workflow.subtitle}</div>
      </div>
    </Button>
  );
};

// Workflow Category Component
const WorkflowCategory = ({ title, icon: Icon, iconColor, workflows, onWorkflowSelect, maxVisible = 3 }: {
  title: string;
  icon: any;
  iconColor: string;
  workflows: BillWorkflow[];
  onWorkflowSelect: (workflow: BillWorkflow) => void;
  maxVisible?: number;
}) => {
  return (
    <div className="space-y-2">
      <h4 className={`text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {workflows.slice(0, maxVisible).map((workflow) => (
          <WorkflowListItem
            key={workflow.id}
            workflow={workflow}
            onClick={() => onWorkflowSelect(workflow)}
          />
        ))}
      </div>
    </div>
  );
};

// Workflow List Item Component  
const WorkflowListItem = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="w-full h-auto p-3 justify-start text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl"
      data-testid={`workflow-list-${workflow.id}`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${workflow.bgColor}`}>
          <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{workflow.title}</div>
            {workflow.isPremium && !isSubscribed && (
              <Crown className="h-3 w-3 text-orange-500" />
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{workflow.subtitle}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400">{workflow.savingsPotential}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
      </div>
    </Button>
  );
};

export default function BillAI() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<AIMessage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [showAssessmentPanel, setShowAssessmentPanel] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [savingsAnalysisStage, setSavingsAnalysisStage] = useState<'scanning' | 'analyzing' | 'calculating' | 'complete'>('scanning');
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  const [showMedicalCodeAnalyzer, setShowMedicalCodeAnalyzer] = useState(false);
  const [showEnhancedTracker, setShowEnhancedTracker] = useState(true);
  const [showAdvancedErrorDetector, setShowAdvancedErrorDetector] = useState(false);
  const [showProfessionalWorkflows, setShowProfessionalWorkflows] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Comprehensive Workflow State Management
  const [selectedWorkflow, setSelectedWorkflow] = useState<BillWorkflow | null>(null);
  const [workflowIntakeData, setWorkflowIntakeData] = useState<Record<string, any>>({});
  const [showWorkflowSelection, setShowWorkflowSelection] = useState(true);
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  const [workflowFilter, setWorkflowFilter] = useState<string>('all');
  
  // Intake State Management
  const [intakeState, setIntakeState] = useState<IntakeState>({});
  const [assessmentIssues, setAssessmentIssues] = useState<AssessmentIssue[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('billai-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'true' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate intake progress
  const getIntakeProgress = (): { completed: number; total: number; nextRequired: NextRequiredField } => {
    const fields = ['amount', 'provider', 'dates', 'insurance', 'codes'] as const;
    const completed = fields.filter(field => intakeState[field]).length;
    
    const nextRequired = fields.find(field => !intakeState[field]) || 
                        (!intakeState.itemizedBill ? 'itemized' : 'complete');
    
    return { completed, total: 6, nextRequired };
  };

  // Check if basic intake is complete
  const isBasicIntakeComplete = () => {
    return intakeState.amount && intakeState.provider && intakeState.dates;
  };

  // Enhanced information extraction parsers
  const extractBillInformation = (content: string): Partial<IntakeState> => {
    const updates: Partial<IntakeState> = {};
    const contentLower = content.toLowerCase();
    
    // Enhanced dollar amount extraction
    if (!intakeState.amount && content && content.includes('$')) {
      const priorityAmountPatterns = [
        /(?:total\s+(?:amount\s+)?due|patient\s+balance|amount\s+due|grand\s+total|total\s+charges?|balance\s+due)\s*[:;]?\s*\$?\s?([\d,]+\.?\d{0,2})/gi,
        /\$\s?([\d,]+\.?\d{0,2})\s*(?:total|due|balance|owed|charged)/gi,
        /\$\s?([\d,]+\.?\d{0,2})/g,
      ];
      
      for (const pattern of priorityAmountPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          const amounts = matches.map(m => {
            const numMatch = m.match(/([\d,]+\.?\d{0,2})/);
            if (numMatch) {
              const cleanAmount = numMatch[1].replace(/,/g, '');
              return parseFloat(cleanAmount);
            }
            return 0;
          }).filter(a => !isNaN(a) && a > 50);
          
          if (amounts.length > 0) {
            const targetAmount = amounts.length === 1 ? amounts[0] : Math.max(...amounts);
            updates.amount = `$${targetAmount.toLocaleString()}`;
            break;
          }
        }
      }
    }

    // Enhanced provider/hospital name extraction
    if (!intakeState.provider) {
      const providerPatterns = [
        /([A-Z][a-zA-Z\s&]{2,50}(?:Hospital|Medical Center|Health System|Clinic|Healthcare|Regional Medical|General Hospital|Memorial Hospital|University Hospital|Children's Hospital))/gi,
        /(?:bill\s+from|provider|facility|hospital)\s*[:;]?\s*([A-Z][a-zA-Z\s&]{5,60})/gi,
        /([A-Z][a-zA-Z\s]{2,30}(?:MD|LLC|PC|INC|Corp|Corporation))\s+(?:medical|health|clinic)/gi,
      ];
      
      for (const pattern of providerPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          for (const match of matches) {
            let provider = pattern.source.includes('(') ? match.replace(pattern, '$1') : match;
            provider = provider.trim().replace(/[":;]/g, '').trim();
            
            if (provider.length >= 8 && provider.length <= 80 && 
                /[A-Z]/.test(provider) && 
                !/^\d+$/.test(provider) && 
                !/(date|time|total|amount|charge|service|phone|address|bill)/i.test(provider)) {
              updates.provider = provider;
              break;
            }
          }
          if (updates.provider) break;
        }
      }
    }

    return updates;
  };

  // Send message function with workflow integration
  const sendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend && !selectedWorkflow) return;

    // Clear input if using typed message
    if (!message) setInputMessage("");
    
    setIsTyping(true);
    
    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      createdAt: new Date()
    };
    
    setLocalMessages(prev => [...prev, userMessage]);
    setConversationStarted(true);

    // Extract information from the message
    updateIntakeFromMessage(messageToSend);

    try {
      // Construct AI prompt based on selected workflow
      let aiPrompt = messageToSend;
      
      if (selectedWorkflow) {
        // Use workflow-specific system prompt and user template
        const workflowTemplate = selectedWorkflow.userPromptTemplate;
        const contextualPrompt = `${selectedWorkflow.systemPrompt}\\n\\n${workflowTemplate.replace(/\\{(\\w+)\\}/g, (match, key) => {
          return workflowIntakeData[key] || intakeState[key as keyof IntakeState] || match;
        })}\\n\\nUser Request: ${messageToSend}`;
        
        aiPrompt = contextualPrompt;
      }

      // Make API call  
      const response = await apiRequest('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: aiPrompt,
          workflowId: selectedWorkflow?.id,
          intakeData: { ...intakeState, ...workflowIntakeData }
        })
      });

      const responseData = await response.json();

      // Add AI response
      const aiMessage: AIMessage = {
        id: Date.now().toString() + "_ai",
        role: "assistant", 
        content: responseData.message || 'I\'m analyzing your request. Please provide more details about your medical bill.',
        createdAt: new Date()
      };
      
      setLocalMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Update intake state from message analysis
  const updateIntakeFromMessage = (content: string) => {
    const updates = extractBillInformation(content);
    if (Object.keys(updates).length > 0) {
      setIntakeState(prev => {
        const newState = { ...prev, ...updates };
        
        // Auto-trigger components based on available data
        if ((updates.cptCodes?.length || 0) > 0 || (updates.icdCodes?.length || 0) > 0) {
          setTimeout(() => setShowMedicalCodeAnalyzer(true), 1000);
        }
        
        if (updates.amount && newState.provider && newState.dates) {
          setTimeout(() => setShowAdvancedErrorDetector(true), 1500);
        }
        
        if (newState.amount && newState.provider && newState.dates && 
            ((newState.cptCodes?.length || 0) > 0 || (newState.icdCodes?.length || 0) > 0)) {
          setTimeout(() => {
            setAnalysisComplete(true);
            setShowProfessionalWorkflows(true);
          }, 2000);
        }
        
        return newState;
      });
    }
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length });
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const responseData = await response.json();
        
        // Process the uploaded file response
        if (responseData.extractedText) {
          updateIntakeFromMessage(responseData.extractedText);
          
          // Send extracted text as a message
          const extractedMessage: AIMessage = {
            id: Date.now().toString() + "_upload",
            role: "user",
            content: `Uploaded file: ${file.name}\n\nExtracted content:\n${responseData.extractedText}`,
            createdAt: new Date()
          };
          
          setLocalMessages(prev => [...prev, extractedMessage]);
          
          // Trigger AI analysis
          sendMessage(`Please analyze this uploaded medical bill: ${responseData.extractedText}`);
        }
      }
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) processed and analyzed.`,
      });
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try uploading your files again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <MobileLayout title="Bill AI" showBottomNav={true}>
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        
        {/* Enhanced Header with Navigation */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWorkflowSelection(!showWorkflowSelection)}
                className="w-9 h-9 p-0 rounded-xl"
                data-testid="workflow-menu-button"
              >
                <List className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedWorkflow ? selectedWorkflow.title : "Bill AI"}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/blitz-demo">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 rounded-xl text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  data-testid="header-blitz-demo"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToolsDrawer(true)}
                className="w-9 h-9 p-0 rounded-xl"
                data-testid="tools-menu-button"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Selection Panel */}
        {showWorkflowSelection && !selectedWorkflow && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-700/30">
            <div className="p-4">
              <WorkflowSelectionPanel 
                onWorkflowSelect={(workflow) => {
                  setSelectedWorkflow(workflow);
                  setShowWorkflowSelection(false);
                  
                  // Auto-start conversation with workflow if no intake needed
                  if (workflow.intakeFields.length === 0) {
                    sendMessage(`I want to use the ${workflow.title} workflow: ${workflow.description}`);
                  } else {
                    // Show intake form or start guided conversation
                    const guideMessage = `I'm ready to help you with ${workflow.title}. ${workflow.description}\\n\\nTo provide the best assistance, I'll need some information about your bill. You can upload your bill or tell me about it.`;
                    const aiMessage: AIMessage = {
                      id: Date.now().toString() + "_guide",
                      role: "assistant", 
                      content: guideMessage,
                      createdAt: new Date()
                    };
                    setLocalMessages(prev => [...prev, aiMessage]);
                    setConversationStarted(true);
                  }
                }}
                onStartChat={() => {
                  setShowWorkflowSelection(false);
                  setConversationStarted(true);
                  
                  const welcomeMessage: AIMessage = {
                    id: Date.now().toString() + "_welcome",
                    role: "assistant",
                    content: "Hello! I'm your Medical Bill AI assistant. I can help you save thousands on medical bills through professional analysis, dispute templates, and negotiation strategies. How can I help you today?",
                    createdAt: new Date()
                  };
                  setLocalMessages([welcomeMessage]);
                }}
              />
            </div>
          </div>
        )}

        {/* Savings Calculator Panel */}
        {showSavingsCalculator && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-700/30">
            <div className="p-3">
              <SavingsCalculator 
                billAmount={intakeState.amount}
                provider={intakeState.provider}
                isVisible={showSavingsCalculator}
                analysisStage={savingsAnalysisStage}
              />
            </div>
          </div>
        )}

        {/* Enhanced Progress Tracker */}
        {showEnhancedTracker && conversationStarted && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-700/30">
            <div className="p-3">
              <EnhancedProgressTracker 
                intakeState={intakeState}
                analysisComplete={analysisComplete}
                onSendMessage={sendMessage}
                onNextStep={(stepId: string) => {
                  if (stepId === 'medical-codes' && (intakeState.cptCodes?.length || 0) > 0) {
                    setShowMedicalCodeAnalyzer(true);
                  }
                  if (stepId === 'error-detection' && intakeState.amount) {
                    setShowAdvancedErrorDetector(true);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Chat Messages Area - iOS Style */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/30" style={{ padding: '1rem 1rem 0 1rem' }}>
          <div className="space-y-4 pb-4">
            
            {/* Welcome State */}
            {localMessages.length === 0 && !conversationStarted && showWorkflowSelection && (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Select a workflow above or start a conversation
                </div>
              </div>
            )}

            {/* iOS-Style Upload Suggestion */}
            {localMessages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center pb-4"
              >
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700 shadow-sm"
                  data-testid="quick-upload-button"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Bill Images
                </Button>
              </motion.div>
            )}

            {/* iOS-Style Chat Messages */}
            {localMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div className={`max-w-[80%] group ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-3xl rounded-br-lg shadow-lg shadow-emerald-500/25 dark:shadow-emerald-600/20" 
                    : "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 rounded-3xl rounded-bl-lg shadow-lg shadow-gray-200/30 dark:shadow-gray-900/30"
                } px-5 py-4 relative`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">Medical Bill Expert</span>
                    </div>
                  )}
                  <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                    message.role === "user" 
                      ? "text-white font-medium" 
                      : "text-gray-900 dark:text-gray-100"
                  }`}>
                    {message.content}
                  </p>
                  
                  <div className={`text-xs mt-3 flex items-center justify-between ${
                    message.role === "user" 
                      ? "text-emerald-100/80" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                        toast({ title: "Copied to clipboard" });
                      }}
                      variant="ghost"
                      size="sm"
                      className={`w-7 h-7 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        message.role === "user"
                          ? "text-emerald-100/60 hover:text-emerald-100 hover:bg-emerald-400/20"
                          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                      data-testid={`copy-message-${message.id}`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex items-center">
                      <span>{message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.role === "user" && (
                        <div className="ml-1.5 w-4 h-4 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-emerald-100/60" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* iOS-Style Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 rounded-3xl rounded-bl-lg shadow-lg shadow-gray-200/30 dark:shadow-gray-900/30 px-5 py-4 max-w-[80%]">
                  <div className="flex items-center space-x-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">Medical Bill Expert</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing your bill details...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* iOS-Style Input Composer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/30 dark:border-gray-700/30 p-4 safe-area-inset-bottom">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 p-0 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border-0"
              data-testid="attach-file-button"
            >
              <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your bill..."
                className="h-11 pr-12 rounded-2xl border-gray-200/50 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/80 focus:border-emerald-500/50 dark:focus:border-emerald-400/50 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base"
                disabled={isTyping}
                data-testid="message-input"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="absolute right-1.5 top-1.5 w-8 h-8 p-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm"
                data-testid="send-message-button"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          data-testid="file-input"
        />

        {/* All Workflows Sheet */}
        <Sheet open={showAllWorkflows} onOpenChange={setShowAllWorkflows}>
          <SheetContent side="bottom" className="h-[90vh] bg-white dark:bg-gray-900">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-emerald-600" />
                All Medical Bill AI Workflows
              </SheetTitle>
              <SheetDescription className="text-gray-600 dark:text-gray-400">
                Comprehensive medical bill analysis and dispute tools. {BILL_AI_WORKFLOWS.length} total workflows available.
              </SheetDescription>
              
              {/* Quick Stats for All Workflows */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">
                    {BILL_AI_WORKFLOWS.filter(w => !w.isPremium).length}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">Free Tools</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {BILL_AI_WORKFLOWS.filter(w => w.isPremium).length}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Premium Tools</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {BILL_AI_WORKFLOWS.filter(w => w.category === 'beginner').length}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Beginner-Friendly</div>
                </div>
              </div>
            </SheetHeader>

            {/* Filter Options */}
            <div className="flex items-center gap-2 mb-4">
              <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="core">Essential Tools</SelectItem>
                  <SelectItem value="beginner">Beginner-Friendly</SelectItem>
                  <SelectItem value="specialty">Specialty Analysis</SelectItem>
                  <SelectItem value="insurance">Insurance Appeals</SelectItem>
                  <SelectItem value="financial">Financial Assistance</SelectItem>
                  <SelectItem value="legal">Legal & Disputes</SelectItem>
                  <SelectItem value="emergency">Emergency Bills</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Filter className="h-3 w-3" />
                {BILL_AI_WORKFLOWS.filter(w => workflowFilter === 'all' || w.category === workflowFilter).length} workflows
              </div>
            </div>

            {/* All Workflows Grid */}
            <div className="overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 pb-6">
                {BILL_AI_WORKFLOWS
                  .filter(workflow => workflowFilter === 'all' || workflow.category === workflowFilter)
                  .map((workflow) => (
                    <WorkflowDetailCard
                      key={workflow.id}
                      workflow={workflow}
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setShowAllWorkflows(false);
                        setShowWorkflowSelection(false);
                        
                        // Auto-start conversation with workflow
                        if (workflow.intakeFields.length === 0) {
                          sendMessage(`I want to use the ${workflow.title} workflow: ${workflow.description}`);
                        } else {
                          const guideMessage = `I'm ready to help you with ${workflow.title}. ${workflow.description}\n\nTo provide the best assistance, I'll need some information about your bill. You can upload your bill or tell me about it.`;
                          const aiMessage: AIMessage = {
                            id: Date.now().toString() + "_guide",
                            role: "assistant", 
                            content: guideMessage,
                            createdAt: new Date()
                          };
                          setLocalMessages(prev => [...prev, aiMessage]);
                          setConversationStarted(true);
                        }
                      }}
                    />
                  ))
                }
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </MobileLayout>
  );
}

// Workflow Detail Card Component for All Workflows view
const WorkflowDetailCard = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700"
      onClick={onClick}
      data-testid={`workflow-detail-${workflow.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${workflow.bgColor} flex-shrink-0`}>
            <workflow.icon className={`h-6 w-6 ${workflow.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{workflow.title}</h3>
              {workflow.isPremium && !isSubscribed && (
                <Crown className="h-4 w-4 text-orange-500" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{workflow.subtitle}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mb-3">{workflow.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{workflow.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">{workflow.savingsPotential}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-600">{workflow.successRate}</span>
                </div>
              </div>
              
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {workflow.category}
              </Badge>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {workflow.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="text-xs px-1.5 py-0 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};