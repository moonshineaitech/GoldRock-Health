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
  FileEdit,
  Plus,
  MessageCircle,
  Camera,
  Info,
  BarChart3,
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
  Star,
  Stethoscope,
  Network,
  Radar,
  HeartHandshake,
  Database,
  Pill,
  Siren,
  XCircle,
  ArrowRight,
  Search
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import type { MedicalBill } from "@shared/schema";
import { BILL_AI_WORKFLOWS, type BillWorkflow, type WorkflowField } from "@shared/bill-ai-workflows";
import { 
  DisputeLetterGenerator, 
  ErrorDetectionChecklist, 
  BillingRightsAdvisor, 
  ClaimAppealGenerator,
  AdvancedAppealGenerator,
  MedicalNecessityBuilder
} from "@/components/bill-ai-features";
import { SuperiorAnalysisTools } from "@/components/superior-analysis-tools";
import { IndustryInsiderStrategies } from "@/components/industry-insider-strategies";
import { BillAnalysisLoader } from "@/components/BillAnalysisLoader";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";
import { MedicalCodeAnalyzer } from "@/components/medical-code-analyzer";
import { EnhancedProgressTracker } from "@/components/enhanced-progress-tracker";
import { AdvancedErrorDetector } from "@/components/advanced-error-detector";
import { ProfessionalWorkflowSuite } from "@/components/professional-workflow-suite";
import { PremiumAutomationEngine } from "@/components/premium-automation-engine";
import { PremiumTemplatesLibrary } from "@/components/premium-templates-library";
import { HospitalBillsIntelligenceDatabase } from "@/components/hospital-bills-intelligence-database";
import { InsuranceClaimsDatabase } from "@/components/insurance-claims-database";
import { InsuranceDenialsIntelligence } from "@/components/insurance-denials-intelligence";
import { EmergencyCareBillingDatabase } from "@/components/emergency-care-billing-database";
import { SpecialtyCareIntelligence } from "@/components/specialty-care-intelligence";
import { PharmaceuticalDeviceDatabase } from "@/components/pharmaceutical-device-database";
import { Link } from "wouter";
import { OptionalIntakePopup } from "@/components/OptionalIntakePopup";
import { RunAnotherWorkflow } from "@/components/RunAnotherWorkflow";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// Helper to send messages in human-like chunks with small delays
const sendChunkedMessages = (
  messages: string[],
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>,
  baseDelay: number = 400
) => {
  messages.forEach((content, index) => {
    setTimeout(() => {
      const msg: AIMessage = {
        id: `${Date.now()}_chunk_${index}`,
        role: "assistant",
        content,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, msg]);
    }, index * baseDelay);
  });
};

// Ultra-Bold 2025 Modern Suggestion Chip Component
const SmartSuggestionChip = ({ icon: Icon, label, onClick, variant = "default" }: {
  icon: any;
  label: string;
  onClick: () => void;
  variant?: "default" | "premium" | "action";
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const variants = {
    default: {
      bg: "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600",
      text: "text-white",
      icon: "text-white",
      shadow: "shadow-2xl shadow-emerald-500/50",
      glow: "hover:shadow-emerald-500/70"
    },
    premium: {
      bg: "bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500",
      text: "text-white",
      icon: "text-white",
      shadow: "shadow-2xl shadow-purple-500/50",
      glow: "hover:shadow-purple-500/70"
    },
    action: {
      bg: "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500",
      text: "text-white",
      icon: "text-white",
      shadow: "shadow-2xl shadow-teal-500/50",
      glow: "hover:shadow-teal-500/70"
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -6 }}
      whileTap={{ scale: 0.88 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={`relative flex items-center gap-3 px-6 py-3.5 rounded-full overflow-hidden ${currentVariant.bg} ${currentVariant.shadow} ${currentVariant.glow} transition-all duration-300`}
      data-testid={`chip-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Shimmer effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
      />
      
      {/* Pulsing glow */}
      <motion.div
        animate={{ opacity: isHovered ? [0.5, 0.8, 0.5] : 0 }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        className="absolute inset-0 bg-white/20 blur-xl pointer-events-none"
      />
      
      {/* Icon with pulse */}
      <motion.div
        animate={{ 
          scale: isHovered ? [1, 1.2, 1] : 1,
          rotate: isHovered ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10"
      >
        <Icon className={`h-5 w-5 flex-shrink-0 ${currentVariant.icon} drop-shadow-lg`} />
      </motion.div>
      
      <span className={`text-base font-black whitespace-nowrap relative z-10 ${currentVariant.text} drop-shadow-md tracking-wide`}>
        {label}
      </span>
      
      {/* Particle effect on hover */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 40],
                y: [0, (Math.random() - 0.5) * 40]
              }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="absolute w-1.5 h-1.5 bg-white rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
};

// Floating Help Sidebar Component
const FloatingHelpSidebar = ({ workflow, isVisible, onClose }: {
  workflow: BillWorkflow | null;
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-24 bottom-24 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-40 hidden lg:flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {workflow?.icon && <workflow.icon className="h-6 w-6 text-emerald-600" />}
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quick Guide</h3>
              <p className="text-xs text-gray-600">{workflow?.title || "General Tips"}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-xl hover:bg-emerald-100"
          >
            <XCircle className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        <Badge className="bg-emerald-600 text-white text-xs">
          <Target className="h-3 w-3 mr-1" />
          {workflow?.savingsPotential || "$2K-$35K Savings"}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Best Practices */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Best Practices
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Upload clear, full-page bill images for best results</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Provide exact amounts and dates from your bill</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Mention specific charges that seem excessive</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Request itemized bill if you haven't received one</span>
            </li>
          </ul>
        </div>

        {/* Example Questions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            Example Questions
          </h4>
          <div className="space-y-2">
            <div className="bg-emerald-50 rounded-xl p-3 text-sm text-gray-700">
              "My ER bill shows a Level 5 charge for $2,800. Is this correct for a minor injury?"
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-sm text-gray-700">
              "I see duplicate charges for the same medication on different dates. Can you help?"
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-sm text-gray-700">
              "How do I request an itemized bill from the hospital billing department?"
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Success Stories
          </h4>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-800 mb-1">$34,000 → $11,900</p>
              <p className="text-xs text-gray-700">Surgery bill reduced 65% through error detection</p>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-3 border border-teal-200">
              <p className="text-xs font-semibold text-teal-800 mb-1">$12,500 → $0</p>
              <p className="text-xs text-gray-700">ER bill eliminated via charity care qualification</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
              <p className="text-xs font-semibold text-purple-800 mb-1">$8,200 → $2,400</p>
              <p className="text-xs text-gray-700">Duplicate charges removed, 71% savings</p>
            </div>
          </div>
        </div>

        {/* Strategic Timing */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            Strategic Timing
          </h4>
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 text-sm text-gray-700 space-y-2">
            <p><strong>Best:</strong> Days 30-60 after bill (peak pressure)</p>
            <p><strong>Great:</strong> Last week of month (quotas)</p>
            <p><strong>Excellent:</strong> Q4 Oct-Dec (fiscal year-end)</p>
            <p className="text-xs text-orange-700 mt-2">💡 Hospitals have internal collection targets</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animated Progress Visualization Component
const SavingsProgressVisualization = ({ intakeState, estimatedSavings }: {
  intakeState: IntakeState;
  estimatedSavings: number;
}) => {
  const completionPercentage = Object.keys(intakeState).length * 16.67; // 6 fields = 100%
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl p-4 border border-emerald-200 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Target className="h-5 w-5 text-emerald-600" />
          </motion.div>
          <span className="text-sm font-semibold text-gray-900">Savings Analysis Progress</span>
        </div>
        <Badge className="bg-emerald-600 text-white">
          {Math.round(completionPercentage)}%
        </Badge>
      </div>
      
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Estimated potential:</span>
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg font-bold text-emerald-600"
        >
          ${estimatedSavings.toLocaleString()}+
        </motion.span>
      </div>
    </motion.div>
  );
};

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

// iOS-Style Workflow Selection Panel Component
const WorkflowSelectionPanel = ({ onWorkflowSelect, onStartChat }: {
  onWorkflowSelect: (workflow: BillWorkflow) => void;
  onStartChat: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'spotlight' | 'browse' | 'insurance' | 'financial' | 'legal'>('spotlight');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Database visibility states
  const [showHospitalBillsDatabase, setShowHospitalBillsDatabase] = useState(false);
  const [showInsuranceClaimsDatabase, setShowInsuranceClaimsDatabase] = useState(false);
  const [showInsuranceDenialsIntelligence, setShowInsuranceDenialsIntelligence] = useState(false);
  const [showEmergencyCareBillingDatabase, setShowEmergencyCareBillingDatabase] = useState(false);
  const [showSpecialtyCareIntelligence, setShowSpecialtyCareIntelligence] = useState(false);
  const [showPharmaceuticalDeviceDatabase, setShowPharmaceuticalDeviceDatabase] = useState(false);
  
  // Organize workflows by category
  const coreWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'core');
  const beginnerWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'beginner');
  const specialtyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'specialty');
  const insuranceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance');
  const emergencyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'emergency');
  const financialWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial');
  const legalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'legal');
  const appealSystemWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'appeal-system');
  const denialReversalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'denial-reversal');
  const coverageExpansionWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'coverage-expansion');
  const insuranceIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance-intelligence');
  const automatedToolsWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'automated-tools');
  const hospitalInsiderWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'hospital-insider');
  const codingIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'coding-intelligence');
  const hardshipMasteryWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'hardship-mastery');
  const reportingSuiteWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'reporting-suite');
  const financialModelingWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial-modeling');
  const dataIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'data-intelligence');

  // Featured workflows for hero carousel (top 3 most impactful)
  const featuredWorkflows = [
    BILL_AI_WORKFLOWS.find(w => w.id === 'upload-medical-bill'),
    BILL_AI_WORKFLOWS.find(w => w.id === 'find-overcharges'),
    BILL_AI_WORKFLOWS.find(w => w.id === 'get-itemized-bill')
  ].filter(Boolean) as BillWorkflow[];

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter workflows based on search query
  const filterWorkflows = (workflows: BillWorkflow[]) => {
    if (!searchQuery.trim()) return workflows;
    
    const query = searchQuery.toLowerCase();
    return workflows.filter(workflow => 
      workflow.title.toLowerCase().includes(query) ||
      workflow.subtitle.toLowerCase().includes(query) ||
      workflow.description.toLowerCase().includes(query) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  // Apply search filter to all workflow categories
  const filteredCoreWorkflows = filterWorkflows(coreWorkflows);
  const filteredSpecialtyWorkflows = filterWorkflows(specialtyWorkflows);
  const filteredFinancialWorkflows = filterWorkflows(financialWorkflows);
  const filteredLegalWorkflows = filterWorkflows(legalWorkflows);
  const filteredInsuranceWorkflows = filterWorkflows(insuranceWorkflows);

  return (
    <div className="space-y-4">
      {/* Compact iOS Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Bill AI</h1>
            <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Private & Secure
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Save $2K-$35K+ on medical bills with AI-powered analysis
        </p>
      </div>

      {/* iOS-Style Segmented Control */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-white via-white to-transparent pb-2">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-full p-1 flex gap-1">
          {[
            { id: 'spotlight', label: '⭐️ Spotlight', icon: Sparkles },
            { id: 'browse', label: '📚 Browse', icon: List },
            { id: 'insurance', label: '🛡️ Insurance', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Spotlight */}
      {activeTab === 'spotlight' && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Hero Carousel - Swipeable Featured Workflows */}
            <div className="relative">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 px-1">Featured Tools</h3>
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
                {featuredWorkflows.map((workflow, idx) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 300 }}
                    className="flex-shrink-0 w-[85%] snap-center"
                  >
                    <button
                      onClick={() => onWorkflowSelect(workflow)}
                      className="w-full h-40 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 p-4 flex flex-col justify-between relative overflow-hidden shadow-lg active:scale-95 transition-transform"
                      data-testid={`hero-workflow-${workflow.id}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                      <div className="flex justify-between items-start relative z-10">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                          {workflow.successRate} Success
                        </Badge>
                        <workflow.icon className="h-8 w-8 text-white/90" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-lg font-bold text-white mb-1">{workflow.title}</h4>
                        <p className="text-sm text-emerald-50 mb-2">{workflow.subtitle}</p>
                        <div className="flex items-center justify-between text-xs text-white/90">
                          <span>💰 {workflow.savingsPotential}</span>
                          <span>⏱️ {workflow.estimatedTime}</span>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 px-1">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={onStartChat}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all active:scale-95"
                  data-testid="quick-action-chat"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Chat</span>
                </button>
                <button
                  onClick={() => onWorkflowSelect(coreWorkflows[0])}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all active:scale-95"
                  data-testid="quick-action-upload"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Upload</span>
                </button>
                <button
                  onClick={() => onWorkflowSelect(coreWorkflows[1])}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all active:scale-95"
                  data-testid="quick-action-analyze"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Analyze</span>
                </button>
              </div>
            </div>

            {/* Getting Started Section */}
            {beginnerWorkflows.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 px-1">Getting Started</h3>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-3 mb-3">
                  <p className="text-xs text-yellow-800">🎓 New user? These tools help you learn step-by-step</p>
                </div>
                <div className="space-y-2">
                  {beginnerWorkflows.slice(0, 3).map((workflow) => (
                    <motion.button
                      key={workflow.id}
                      onClick={() => onWorkflowSelect(workflow)}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
                      data-testid={`beginner-workflow-${workflow.id}`}
                    >
                      <div className={`w-10 h-10 rounded-full ${workflow.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <workflow.icon className={`h-5 w-5 ${workflow.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-gray-900">{workflow.title}</div>
                        <div className="text-xs text-gray-600">{workflow.subtitle}</div>
                      </div>
                      <Badge className="text-xs bg-gray-100 text-gray-700">{workflow.successRate}</Badge>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Tab Content - Browse (All Workflows Organized) */}
      {activeTab === 'browse' && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                data-testid="workflow-search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Results Message */}
            {searchQuery && (
              <div className="text-sm text-gray-600 px-1">
                Found {filteredCoreWorkflows.length + filteredSpecialtyWorkflows.length + filteredFinancialWorkflows.length + filteredLegalWorkflows.length + filteredInsuranceWorkflows.length} workflows matching "{searchQuery}"
              </div>
            )}

            {/* No Results Message */}
            {searchQuery && filteredCoreWorkflows.length === 0 && filteredSpecialtyWorkflows.length === 0 && filteredFinancialWorkflows.length === 0 && filteredLegalWorkflows.length === 0 && filteredInsuranceWorkflows.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <div className="text-gray-600 font-medium mb-1">No workflows found</div>
                <div className="text-sm text-gray-500">Try a different search term</div>
              </div>
            )}

            {/* Collapsible Categories with Progressive Disclosure */}
            <div className="space-y-2">
              {/* Core Workflows */}
              {filteredCoreWorkflows.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory('core')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    data-testid="category-core"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Essential Tools</div>
                        <div className="text-xs text-gray-600">{filteredCoreWorkflows.length} workflows</div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedCategories.includes('core') ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCategories.includes('core') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100"
                    >
                      {filteredCoreWorkflows.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => onWorkflowSelect(workflow)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-emerald-50/50 transition-colors border-b border-gray-100 last:border-0"
                          data-testid={`browse-workflow-${workflow.id}`}
                        >
                          <div className={`w-8 h-8 rounded-full ${workflow.bgColor} flex items-center justify-center`}>
                            <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{workflow.title}</div>
                            <div className="text-xs text-gray-600">{workflow.savingsPotential}</div>
                          </div>
                          <Badge className="text-xs">{workflow.successRate}</Badge>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Specialty Analysis */}
              {filteredSpecialtyWorkflows.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory('specialty')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Specialty Analysis</div>
                        <div className="text-xs text-gray-600">{filteredSpecialtyWorkflows.length} workflows</div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedCategories.includes('specialty') ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCategories.includes('specialty') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-100"
                    >
                      {filteredSpecialtyWorkflows.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => onWorkflowSelect(workflow)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-emerald-50/50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className={`w-8 h-8 rounded-full ${workflow.bgColor} flex items-center justify-center`}>
                            <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{workflow.title}</div>
                            <div className="text-xs text-gray-600">{workflow.savingsPotential}</div>
                          </div>
                          {workflow.isPremium && <Crown className="h-4 w-4 text-purple-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Financial Assistance */}
              {filteredFinancialWorkflows.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory('financial')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Financial Assistance</div>
                        <div className="text-xs text-gray-600">{filteredFinancialWorkflows.length} workflows</div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedCategories.includes('financial') ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCategories.includes('financial') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-100"
                    >
                      {filteredFinancialWorkflows.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => onWorkflowSelect(workflow)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-green-50/50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className={`w-8 h-8 rounded-full ${workflow.bgColor} flex items-center justify-center`}>
                            <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{workflow.title}</div>
                            <div className="text-xs text-gray-600">{workflow.savingsPotential}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Legal & Disputes */}
              {filteredLegalWorkflows.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory('legal')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Legal & Disputes</div>
                        <div className="text-xs text-gray-600">{filteredLegalWorkflows.length} workflows</div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedCategories.includes('legal') ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCategories.includes('legal') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-100"
                    >
                      {filteredLegalWorkflows.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => onWorkflowSelect(workflow)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-purple-50/50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className={`w-8 h-8 rounded-full ${workflow.bgColor} flex items-center justify-center`}>
                            <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{workflow.title}</div>
                            <div className="text-xs text-gray-600">{workflow.savingsPotential}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Tab Content - Insurance */}
      {activeTab === 'insurance' && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Insurance-Specific Workflows */}
            <div className="space-y-2">
              {/* Insurance Appeals */}
              {filteredInsuranceWorkflows.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory('insurance')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Insurance Appeals</div>
                        <div className="text-xs text-gray-600">{filteredInsuranceWorkflows.length} workflows</div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedCategories.includes('insurance') ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCategories.includes('insurance') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-100"
                    >
                      {filteredInsuranceWorkflows.map((workflow) => (
                        <button
                          key={workflow.id}
                          onClick={() => onWorkflowSelect(workflow)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-indigo-50/50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className={`w-8 h-8 rounded-full ${workflow.bgColor} flex items-center justify-center`}>
                            <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{workflow.title}</div>
                            <div className="text-xs text-gray-600">{workflow.savingsPotential}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// Enhanced Workflow Card Component with interactions
// Enhanced Workflow Card Component with interactions
const WorkflowCard = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleClick = () => {
    if (workflow.isPremium && !isSubscribed) {
      setShowPreview(true);
      return;
    }
    onClick();
  };
  
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Button
          onClick={handleClick}
          variant="outline"
          className={`!bg-white h-auto min-h-[5rem] lg:min-h-[8rem] xl:min-h-[10rem] 2xl:min-h-[12rem] p-4 lg:p-8 xl:p-10 2xl:p-12 flex-col space-y-2 lg:space-y-4 xl:space-y-6 text-left justify-start rounded-2xl lg:rounded-3xl border-gray-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden ${
            isHovered ? 'border-emerald-300 bg-emerald-50/50' : ''
          }`}
          data-testid={`workflow-${workflow.id}`}
        >
          <workflow.icon className={`h-5 w-5 lg:h-8 lg:w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12 ${workflow.color} ${isHovered ? 'scale-110' : ''} transition-transform`} />
          <div className="text-center w-full flex-1 space-y-1 lg:space-y-2">
            <div className="flex items-start justify-center gap-2">
              <div className="text-xs lg:text-base xl:text-lg 2xl:text-xl font-semibold text-gray-900 leading-normal whitespace-normal break-words text-center">{workflow.title}</div>
              {workflow.isPremium && !isSubscribed && (
                <Crown className="h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              )}
            </div>
            <div className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-600 leading-normal whitespace-normal break-words">{workflow.subtitle}</div>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-emerald-600 font-medium"
              >
                {workflow.savingsPotential}
              </motion.div>
            )}
          </div>
        </Button>
      </motion.div>
      
      {/* Premium Preview Modal */}
      {showPreview && workflow.isPremium && !isSubscribed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-emerald-100/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 ${workflow.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                <workflow.icon className={`h-8 w-8 ${workflow.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{workflow.title}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">Premium Feature</span>
                </div>
                <p className="text-xs text-orange-700 mb-3">Unlock advanced analysis with {workflow.savingsPotential} potential savings</p>
                <Link href="/premium#plans">
                  <Button size="sm" className="w-full bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-800" onClick={() => setShowPreview(false)}>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                Maybe Later
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
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
    <div className="space-y-2 lg:space-y-6 xl:space-y-8">
      <h4 className={`text-sm lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-900 flex items-center gap-2 lg:gap-4`}>
        <Icon className={`h-4 w-4 lg:h-6 lg:w-6 xl:h-7 xl:w-7 ${iconColor}`} />
        {title}
      </h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 lg:gap-6 xl:gap-8">
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

// Enhanced Workflow List Item Component
const WorkflowListItem = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  
  const handleClick = () => {
    if (workflow.isPremium && !isSubscribed) {
      setShowQuickPreview(true);
      return;
    }
    onClick();
  };
  
  return (
    <>
      <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleClick}
          variant="ghost"
          className="w-full h-auto p-4 lg:p-6 xl:p-8 justify-start text-left hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl lg:rounded-3xl transition-all duration-200 border border-transparent hover:border-emerald-200/50"
          data-testid={`workflow-list-${workflow.id}`}
        >
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 w-full">
            <motion.div 
              className={`w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center ${workflow.bgColor} shadow-sm flex-shrink-0`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <workflow.icon className={`h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 ${workflow.color}`} />
            </motion.div>
            <div className="flex-1 min-w-0 pr-3">
              <div className="space-y-1 mb-2 lg:mb-3">
                <div className="flex items-center justify-between gap-3 lg:gap-4">
                  <div className="text-sm lg:text-base xl:text-lg font-medium text-gray-900 leading-normal flex-1 min-w-0 pr-2 whitespace-normal break-words">
                    {workflow.title}
                    {workflow.isPremium && !isSubscribed && (
                      <Crown className="h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-orange-500 inline-block ml-2 flex-shrink-0" />
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs lg:text-sm px-2 py-0.5 lg:px-2.5 lg:py-1 font-semibold flex-shrink-0">
                    {workflow.successRate}
                  </Badge>
                </div>
              </div>
              <div className="text-xs lg:text-sm xl:text-base text-gray-500 mb-2 lg:mb-3 leading-normal whitespace-normal break-words">{workflow.subtitle}</div>
              <div className="flex items-center gap-4 lg:gap-6 text-xs lg:text-sm xl:text-base flex-wrap">
                <div className="text-emerald-600 font-medium whitespace-nowrap">{workflow.savingsPotential}</div>
                <div className="text-gray-400 whitespace-nowrap">{workflow.estimatedTime}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-gray-400 rotate-[-90deg] transition-transform group-hover:rotate-[-45deg]" />
          </div>
        </Button>
      </motion.div>
      
      {/* Quick Premium Preview */}
      {showQuickPreview && workflow.isPremium && !isSubscribed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-emerald-100/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickPreview(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 ${workflow.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                <workflow.icon className={`h-8 w-8 ${workflow.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{workflow.title}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">Premium Feature</span>
                </div>
                <p className="text-xs text-orange-700 mb-3">Unlock advanced analysis with {workflow.savingsPotential} potential savings</p>
                <Link href="/premium#plans">
                  <Button size="sm" className="w-full bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-800" onClick={() => setShowQuickPreview(false)}>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowQuickPreview(false)}>
                Maybe Later
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [showAssessmentPanel, setShowAssessmentPanel] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [savingsAnalysisStage, setSavingsAnalysisStage] = useState<'scanning' | 'analyzing' | 'calculating' | 'complete'>('scanning');
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  const [showMedicalCodeAnalyzer, setShowMedicalCodeAnalyzer] = useState(false);
  const [showEnhancedTracker, setShowEnhancedTracker] = useState(false);
  const [showAdvancedErrorDetector, setShowAdvancedErrorDetector] = useState(false);
  const [showProfessionalWorkflows, setShowProfessionalWorkflows] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showOptionalIntakePopup, setShowOptionalIntakePopup] = useState(false);
  
  // New UI Enhancement States
  const [showHelpSidebar, setShowHelpSidebar] = useState(true);
  const [estimatedSavings, setEstimatedSavings] = useState(12000);
  
  // Premium Insight Database States
  const [showHospitalBillsDatabase, setShowHospitalBillsDatabase] = useState(false);
  const [showInsuranceClaimsDatabase, setShowInsuranceClaimsDatabase] = useState(false);
  const [showInsuranceDenialsIntelligence, setShowInsuranceDenialsIntelligence] = useState(false);
  const [showEmergencyCareBillingDatabase, setShowEmergencyCareBillingDatabase] = useState(false);
  const [showSpecialtyCareIntelligence, setShowSpecialtyCareIntelligence] = useState(false);
  const [showPharmaceuticalDeviceDatabase, setShowPharmaceuticalDeviceDatabase] = useState(false);
  
  // Premium Tools Modal States (moved from prominent display to optional modals)
  const [showPremiumAutomationModal, setShowPremiumAutomationModal] = useState(false);
  const [showPremiumTemplatesModal, setShowPremiumTemplatesModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  
  // Comprehensive Workflow State Management
  const [selectedWorkflow, setSelectedWorkflow] = useState<BillWorkflow | null>(null);
  const [workflowIntakeData, setWorkflowIntakeData] = useState<Record<string, any>>({});
  const [showWorkflowSelection, setShowWorkflowSelection] = useState(true);
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  const [showFloatingQuickActions, setShowFloatingQuickActions] = useState(false);
  const [workflowFilter, setWorkflowFilter] = useState<string>('all');
  
  // Intake State Management
  const [intakeState, setIntakeState] = useState<IntakeState>({});
  const [assessmentIssues, setAssessmentIssues] = useState<AssessmentIssue[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize workflow-specific conversation
  const initializeWorkflowConversation = (workflow: BillWorkflow, preserveContext: boolean = false) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowSelection(false);
    setConversationStarted(true);
    
    // Create workflow-specific AI message using conversation starter
    const workflowMessage: AIMessage = {
      id: Date.now().toString() + "_workflow_start",
      role: "assistant",
      content: preserveContext 
        ? `SWITCHING TO: ${workflow.title.toUpperCase()}\n\n${workflow.conversationStarter}`
        : workflow.conversationStarter,
      createdAt: new Date()
    };
    
    // Either replace messages (fresh start) or append to existing conversation
    if (preserveContext) {
      setLocalMessages(prev => [...prev, workflowMessage]);
    } else {
      setLocalMessages([workflowMessage]);
    }
    
    // Store the workflow context for future AI interactions
    setWorkflowIntakeData({
      workflowId: workflow.id,
      systemPrompt: workflow.systemPrompt,
      userPromptTemplate: workflow.userPromptTemplate
    });
  };

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
      const response = await apiRequest('/api/bill-ai-chat', {
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
        content: responseData.response || responseData.message || 'I\'m analyzing your request. Please provide more details about your medical bill.',
        createdAt: new Date()
      };
      
      setLocalMessages(prev => [...prev, aiMessage]);
      
    } catch (error: any) {
      console.error('Chat API error:', error);
      
      // Check if it's a 401 authentication error
      if (error.message?.includes('401')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use the AI chat feature.",
          variant: "destructive",
        });
        // Redirect to login after a brief delay
        setTimeout(() => {
          window.location.href = '/api/login';
        }, 2000);
        return;
      }
      
      // Check if it's a 402 subscription error  
      if (error.message?.includes('402')) {
        toast({
          title: "Premium Subscription Required",
          description: "AI chat is a premium feature. Please upgrade your subscription to continue.",
          variant: "destructive",
        });
        // Send premium upgrade messages in conversational chunks
        const premiumChunks = [
          "🔒 This is a Premium feature",
          "AI-powered bill analysis can save you $1,000 to $100,000+ on medical bills.",
          "With Premium you get:\n\n1. Unlimited AI chat sessions\n2. Advanced error detection\n3. Dispute letter generation\n4. Insurance appeal templates\n5. 24/7 expert advice",
          "Want me to help with general billing info in the meantime?"
        ];
        sendChunkedMessages(premiumChunks, setLocalMessages, 400);
        return;
      }
      
      // Generic error for other cases
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please check your internet connection and try again.",
        variant: "destructive",
      });
      
      // Send error messages in friendly chunks
      const errorChunks = [
        "Hmm, having trouble connecting right now 😕",
        "Could be network issues, maintenance, or high traffic.",
        "Try again in a moment. If it keeps happening, refresh the page.",
        "I'm still here to help when you're ready!"
      ];
      sendChunkedMessages(errorChunks, setLocalMessages, 350);
    } finally {
      setIsTyping(false);
    }
  };

  // Update intake state from message analysis (disabled automatic UI triggers)
  const updateIntakeFromMessage = (content: string) => {
    const updates = extractBillInformation(content);
    if (Object.keys(updates).length > 0) {
      setIntakeState(prev => {
        const newState = { ...prev, ...updates };
        
        // Keep state updates but disable automatic UI component triggers
        // This allows conversational AI to flow naturally without automatic popups
        
        return newState;
      });
    }
  };

  // Handle optional intake popup submission
  const handleOptionalIntakeSubmit = (data: any, submissionType: 'chat' | 'analysis') => {
    // Update intake state with provided data
    setIntakeState(prev => ({
      ...prev,
      amount: data.billAmount || prev.amount,
      provider: data.providerHospital || prev.provider,
      dates: data.serviceDates || prev.dates,
      insurance: data.insuranceInfo || prev.insurance,
      codes: data.medicalCodes || prev.codes
    }));

    // If user wants to run analysis immediately, send a comprehensive analysis request
    if (submissionType === 'analysis') {
      const analysisMessage = `I've provided the following information about my medical bill:

${data.billAmount ? `• Bill Amount: ${data.billAmount}` : ''}
${data.providerHospital ? `• Provider/Hospital: ${data.providerHospital}` : ''}
${data.serviceDates ? `• Service Dates: ${data.serviceDates}` : ''}
${data.insuranceInfo ? `• Insurance Information: ${data.insuranceInfo}` : ''}
${data.medicalCodes ? `• Medical Codes: ${data.medicalCodes}` : ''}
${data.additionalDetails ? `• Additional Details: ${data.additionalDetails}` : ''}

Please provide a comprehensive medical bill analysis with specific savings opportunities, error detection, and actionable next steps. Focus on identifying billing errors, overcharges, and compliance issues.`;

      setTimeout(() => {
        sendMessage(analysisMessage);
      }, 500);
    }

    setShowOptionalIntakePopup(false);
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle file upload - Updated for medical bill analysis
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate file count (max 5 images)
    if (fileArray.length > 5) {
      toast({
        title: "Too many files",
        description: "Please select up to 5 medical bill images at a time.",
        variant: "destructive",
      });
      return;
    }

    // Validate file types (images only)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, PNG, or WebP image files.",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Each image must be under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFiles(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    try {
      const formData = new FormData();
      
      // Append all files to FormData for bulk upload
      fileArray.forEach((file) => {
        formData.append('bills', file);
      });

      // Use the correct multiple upload endpoint
      const response = await fetch('/api/upload-bills', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let browser set it with boundary for FormData
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const responseData = await response.json();
      
      // Update progress to show completion
      setUploadProgress({ current: fileArray.length, total: fileArray.length });
      
      // Process the uploaded files response
      if (responseData.success && responseData.extractedText) {
        // Update intake with extracted information
        updateIntakeFromMessage(responseData.extractedText);
        
        // Create a comprehensive message about the uploaded bills
        const extractedMessage: AIMessage = {
          id: Date.now().toString() + "_upload",
          role: "user",
          content: `Uploaded ${fileArray.length} medical bill image${fileArray.length > 1 ? 's' : ''}: ${fileArray.map(f => f.name).join(', ')}\n\nEXTRACTED CONTENT:\n${responseData.extractedText}\n\nAI ANALYSIS:\n${responseData.analysis || 'Ready for detailed analysis.'}`,
          createdAt: new Date()
        };
        
        setLocalMessages(prev => [...prev, extractedMessage]);
        
        // Start conversation if not already started
        setConversationStarted(true);
        
        // Auto-trigger comprehensive analysis
        setTimeout(() => {
          sendMessage(`I've uploaded ${fileArray.length} medical bill image${fileArray.length > 1 ? 's' : ''} with the following extracted information:\n\n${responseData.extractedText}\n\nPlease provide a comprehensive analysis with specific savings opportunities, error detection, and actionable next steps.`);
        }, 1000);
      }
      
      toast({
        title: "✅ Bills uploaded successfully!",
        description: `${fileArray.length} medical bill${fileArray.length > 1 ? 's' : ''} processed with AI text extraction. ${responseData.message || 'Ready for analysis.'}`,
      });
      
      // Clear file selection
      setSelectedFiles([]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try uploading your medical bill images again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFileUpload(files);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Add files to selection for preview
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray].slice(0, 5)); // Max 5 files
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <MobileLayout title="Bill AI" showBottomNav={true}>
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
        
        {/* Enhanced Header with Navigation */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/30">
          <div className="flex items-center justify-between p-4 lg:px-8 lg:py-6">
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
              <div className="text-lg lg:text-2xl font-semibold text-gray-900">
                {selectedWorkflow ? selectedWorkflow.title : "Bill AI"}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/blitz-demo">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 rounded-xl text-orange-600 hover:bg-orange-50"
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
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-4 lg:px-8 lg:py-6">
              <WorkflowSelectionPanel 
                onWorkflowSelect={(workflow) => {
                  initializeWorkflowConversation(workflow);
                }}
                onStartChat={() => {
                  setShowWorkflowSelection(false);
                  setConversationStarted(true);
                  
                  // Send welcome messages in human-like chunks
                  const welcomeChunks = [
                    "Hey! 👋 I'm your medical bill advocate.",
                    "I've helped patients save over $50 million finding billing errors and overcharges.",
                    "Here's how I can help:\n\n1. Upload bill images for instant analysis\n2. Share your bill amount and provider\n3. Tell me about charges that seem off\n4. Ask about any codes you don't understand",
                    "📸 Pro tip: uploading photos gives me the most accurate data. I can analyze up to 5 at once!",
                    "What would you like to do first?"
                  ];
                  
                  sendChunkedMessages(welcomeChunks, setLocalMessages, 500);
                }}
              />
            </div>
          </div>
        )}


        {/* Savings Calculator Panel */}
        {showSavingsCalculator && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
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
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
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

        {/* REMOVED: Premium sections moved to modals for cleaner interface */}

        {/* Premium Insight Databases */}
        {showHospitalBillsDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <HospitalBillsIntelligenceDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showInsuranceClaimsDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <InsuranceClaimsDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showInsuranceDenialsIntelligence && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <InsuranceDenialsIntelligence onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showEmergencyCareBillingDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <EmergencyCareBillingDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showSpecialtyCareIntelligence && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <SpecialtyCareIntelligence onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showPharmaceuticalDeviceDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <PharmaceuticalDeviceDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {/* Ultra-Premium iOS Chat Interface */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-emerald-50/30 via-teal-50/20 to-white px-4 pt-6 lg:px-8 lg:py-8 relative">
          {/* Animated Premium Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.08),rgba(255,255,255,0))] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.06),rgba(255,255,255,0))] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent" />
          
          <div className="space-y-4 lg:space-y-6 pb-4 lg:pb-8 lg:max-w-4xl lg:mx-auto relative z-10">
            
            {/* Savings Progress Visualization */}
            {conversationStarted && intakeState.amount && (
              <SavingsProgressVisualization
                intakeState={intakeState}
                estimatedSavings={estimatedSavings}
              />
            )}
            
            {/* iOS-Style Welcome Hero Card */}
            {localMessages.length === 0 && !conversationStarted && showWorkflowSelection && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="mx-auto max-w-2xl"
              >
                <div className="relative bg-white/70 backdrop-blur-2xl border border-emerald-200/50 rounded-[32px] p-8 lg:p-12 shadow-2xl shadow-emerald-500/10 overflow-hidden">
                  {/* Glassmorphic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-green-50/60 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 text-center space-y-6">
                    {/* Animated Icon */}
                    <motion.div 
                      className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-[24px] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30"
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Brain className="h-10 w-10 lg:h-14 lg:w-14 text-white" strokeWidth={2} />
                    </motion.div>
                    
                    {/* Heading */}
                    <div>
                      <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
                        Ready to Save on Your<br />Medical Bills?
                      </h3>
                      <p className="text-base lg:text-xl text-gray-700 mb-6 lg:mb-8 max-w-lg mx-auto leading-relaxed">
                        Our AI has helped patients save over <span className="font-bold text-emerald-600">$50M</span> in billing errors
                      </p>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-xl mx-auto">
                      <motion.div 
                        className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Target className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">94%</div>
                        <div className="text-xs text-gray-600">Success</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white/90 backdrop-blur-sm border border-teal-200/50 rounded-2xl p-4 shadow-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <DollarSign className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold text-teal-600 mb-1">$12K</div>
                        <div className="text-xs text-gray-600">Avg Save</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white/90 backdrop-blur-sm border border-green-200/50 rounded-2xl p-4 shadow-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-lg lg:text-xl font-bold text-green-600 mb-1">Secure</div>
                        <div className="text-xs text-gray-600">Private</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Premium Upload Prompt */}
            {localMessages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="flex justify-center pb-4"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="h-11 px-6 rounded-[20px] bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-xl border border-emerald-200/60 text-emerald-700 hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 font-semibold"
                    data-testid="quick-upload-button"
                  >
                    <Camera className="h-5 w-5 mr-2.5" strokeWidth={2.5} />
                    Upload Bill Images
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Ultra-Premium iOS Chat Messages */}
            {localMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 25, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.06, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 350,
                  damping: 25
                }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-3 lg:mb-4`}
              >
                <motion.div 
                  className={`max-w-[85%] lg:max-w-[75%] group relative ${
                    message.role === "user" 
                      ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-[26px] rounded-br-lg shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40" 
                      : "bg-white/95 backdrop-blur-2xl border border-emerald-100/50 rounded-[26px] rounded-bl-lg shadow-xl shadow-gray-900/8 hover:shadow-2xl hover:shadow-gray-900/12"
                  } px-5 lg:px-6 py-4 lg:py-5 relative overflow-hidden transition-shadow duration-300`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {/* Ultra-Refined Glass Effect Layer */}
                  <div className={`absolute inset-0 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-white/20 via-white/5 to-transparent"
                      : "bg-gradient-to-br from-emerald-50/60 via-white/40 to-transparent"
                  } pointer-events-none`} />
                  
                  {/* Subtle Border Glow */}
                  <div className={`absolute inset-0 rounded-[26px] ${
                    message.role === "user" 
                      ? "rounded-br-lg ring-1 ring-inset ring-white/20" 
                      : "rounded-bl-lg ring-1 ring-inset ring-emerald-100/30"
                  } pointer-events-none`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-xl flex items-center justify-center shadow-md">
                        <Bot className="h-4 w-4 text-emerald-700" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-emerald-700 tracking-tight">Bill Expert</span>
                    </div>
                  )}
                  <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                    message.role === "user" 
                      ? "text-white font-semibold" 
                      : "text-gray-900"
                  }`}>
                    {message.content}
                  </p>
                  
                  {/* Customize Response Button (for AI responses) */}
                  {message.role === "assistant" && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={() => {
                          const customizeMessage = `Help me customize that response. I'd like to modify or improve the previous analysis/advice you just provided. Please ask me what specific aspects I'd like to change or enhance.`;
                          sendMessage(customizeMessage);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 text-xs"
                        data-testid="customize-response-button"
                      >
                        <Settings className="h-3 w-3 mr-1.5" />
                        Help me customize that
                      </Button>
                    </div>
                  )}
                  
                  {/* Run Another Workflow Button (for all AI responses) */}
                  {message.role === "assistant" && (
                    <div className="mt-4 pt-3 border-t border-gray-100/50">
                      <div className="flex justify-center">
                        <RunAnotherWorkflow
                          onWorkflowSelect={(workflow) => {
                            initializeWorkflowConversation(workflow, true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Premium Tools Button (only for AI responses and subscribed users) */}
                  {message.role === "assistant" && isSubscribed && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowPremiumAutomationModal(true)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 text-xs"
                          data-testid="premium-automation-button"
                        >
                          <Zap className="h-3 w-3 mr-1.5" />
                          Automation
                        </Button>
                        <Button
                          onClick={() => setShowPremiumTemplatesModal(true)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 text-xs"
                          data-testid="premium-templates-button"
                        >
                          <FileText className="h-3 w-3 mr-1.5" />
                          Templates
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-3 flex items-center justify-between ${
                    message.role === "user" 
                      ? "text-emerald-100/80" 
                      : "text-gray-500"
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
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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
              </motion.div>
            ))}

            {/* Elite Premium Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white/90 backdrop-blur-2xl border border-emerald-100/40 text-gray-900 rounded-[28px] rounded-bl-md shadow-2xl shadow-gray-900/10 px-6 py-5 max-w-[85%] relative overflow-hidden">
                  {/* Glass effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white/50 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-teal-400 to-green-400 rounded-xl flex items-center justify-center shadow-lg"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Bot className="h-5 w-5 text-white" strokeWidth={2.5} />
                      </motion.div>
                      <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Bill Expert
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1.5">
                        <motion.div
                          className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg"
                          animate={{ y: [-3, 3, -3], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-gradient-to-r from-teal-500 to-green-500 rounded-full shadow-lg"
                          animate={{ y: [-3, 3, -3], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"
                          animate={{ y: [-3, 3, -3], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Analyzing medical bill...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Ultra-Modern iOS Input Composer */}
        <div className="sticky bottom-0 bg-gradient-to-b from-transparent via-white/80 to-white/95 backdrop-blur-2xl border-t border-emerald-100/30 p-4 lg:p-6 safe-area-inset-bottom">
          {/* Premium Pro Tip Card */}
          {localMessages.length === 0 && !conversationStarted && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mb-4"
            >
              <div className="relative bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-green-50/70 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-4 lg:p-5 shadow-lg shadow-emerald-500/10 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl animate-pulse delay-700" />
                
                <div className="relative z-10 flex items-center gap-3 lg:gap-4">
                  {/* Animated Bulb Icon */}
                  <motion.div 
                    className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-6 w-6 lg:h-7 lg:w-7 text-white" strokeWidth={2.5} />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs lg:text-sm font-bold text-emerald-700 tracking-tight">Pro Tip</span>
                      <div className="h-1 w-1 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-600">Upload for instant analysis</span>
                    </div>
                    <p className="text-sm lg:text-base text-gray-700 font-medium leading-snug">
                      Upload bill images for instant AI analysis
                    </p>
                  </div>
                  
                  {/* Enhanced Quick Capture Button */}
                  <Button
                    onClick={() => setShowOptionalIntakePopup(true)}
                    size="sm"
                    className="h-12 lg:h-14 px-5 lg:px-6 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700 text-white shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/50 border-0 font-semibold text-sm lg:text-base transition-all duration-300 flex-shrink-0"
                    data-testid="quick-capture-button"
                  >
                    <Camera className="h-4 w-4 lg:h-5 lg:w-5 mr-2" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Quick Info Capture</span>
                    <span className="sm:hidden">Capture</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Smart Suggestion Chips */}
          {conversationStarted && localMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-wrap gap-2 justify-center"
            >
              {!intakeState.amount && (
                <SmartSuggestionChip
                  icon={DollarSign}
                  label="Share bill amount"
                  variant="action"
                  onClick={() => {
                    sendMessage("I need help with my medical bill. Let me provide the details.");
                    setShowOptionalIntakePopup(true);
                  }}
                />
              )}
              {intakeState.amount && !intakeState.provider && (
                <SmartSuggestionChip
                  icon={Building2}
                  label="Add hospital name"
                  variant="action"
                  onClick={() => sendMessage("The bill is from [hospital name]. Can you help analyze it?")}
                />
              )}
              {intakeState.amount && intakeState.provider && (
                <SmartSuggestionChip
                  icon={AlertTriangle}
                  label="Find errors"
                  variant="default"
                  onClick={() => sendMessage("Please analyze my bill for common errors, overcharges, and potential savings opportunities.")}
                />
              )}
              {localMessages.length > 2 && (
                <SmartSuggestionChip
                  icon={FileText}
                  label="Request itemized bill"
                  variant="default"
                  onClick={() => {
                    const itemizedWorkflow = BILL_AI_WORKFLOWS.find(w => w.id === 'get-itemized-bill');
                    if (itemizedWorkflow) {
                      initializeWorkflowConversation(itemizedWorkflow);
                    }
                  }}
                />
              )}
              {!isSubscribed && (
                <SmartSuggestionChip
                  icon={Crown}
                  label="Unlock Premium Tools"
                  variant="premium"
                  onClick={() => window.location.href = '/premium'}
                />
              )}
              <SmartSuggestionChip
                icon={Info}
                label="Show tips"
                variant="default"
                onClick={() => setShowTipsModal(true)}
              />
            </motion.div>
          )}

          {/* Enhanced iOS Input Bar */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Upload Button - iOS Style */}
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 lg:w-14 lg:h-14 p-0 rounded-[18px] bg-white/90 backdrop-blur-sm hover:bg-gray-50 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200"
                data-testid="attach-file-button"
                disabled={uploadingFiles}
              >
                <Paperclip className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" strokeWidth={2} />
              </Button>
            </motion.div>
            
            {/* Quick Capture Button - Emerald */}
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOptionalIntakePopup(true)}
                className="w-12 h-12 lg:w-14 lg:h-14 p-0 rounded-[18px] bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-200"
                data-testid="quick-info-button"
                title="Quick Info Capture"
              >
                <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-600" strokeWidth={2.5} />
              </Button>
            </motion.div>
            
            {/* Premium Message Input Container */}
            <div className="flex-1 relative">
              <div className="relative bg-white/90 backdrop-blur-xl border border-emerald-200/50 rounded-[24px] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Glassmorphic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 via-transparent to-teal-50/30 pointer-events-none" />
                
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell me about your bill..."
                  className="relative z-10 h-12 lg:h-14 pr-14 lg:pr-16 pl-5 lg:pl-6 rounded-[24px] border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-gray-500 text-gray-900 text-base lg:text-lg font-medium"
                  disabled={isTyping}
                  data-testid="message-input"
                />
                
                {/* iOS-Style Send Button */}
                <motion.div
                  className="absolute right-1.5 lg:right-2 top-1.5 lg:top-2"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    size="sm"
                    className="w-9 h-9 lg:w-10 lg:h-10 p-0 rounded-[16px] bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700 shadow-lg hover:shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 border-0 transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
                    data-testid="send-message-button"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin text-white" strokeWidth={2.5} />
                    ) : (
                      <Send className="h-4 w-4 lg:h-5 lg:w-5 text-white" strokeWidth={2.5} />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 text-center">
            This is generative AI. For medical advice, please consult your healthcare provider.
          </p>
        </div>

        {/* Drag and Drop Area */}
        {dragActive && (
          <div 
            className="fixed inset-0 bg-emerald-100/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-dashed border-emerald-300"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Drop Medical Bills Here</h3>
                  <p className="text-sm text-gray-600">Drop up to 5 medical bill images for instant AI analysis</p>
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs text-emerald-800 text-center">
                      <strong>Data Processing Notice:</strong> Your uploaded images will be processed by AI systems (including OpenAI) for analysis. Data is retained for 30 days maximum.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <span>JPG</span>
                  <Circle className="h-1 w-1 fill-gray-400" />
                  <span>PNG</span>
                  <Circle className="h-1 w-1 fill-gray-400" />
                  <span>WebP</span>
                  <Circle className="h-1 w-1 fill-gray-400" />
                  <span>Max 10MB each</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Upload Progress Overlay */}
        {uploadingFiles && (
          <div className="fixed inset-0 bg-emerald-100/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8 text-emerald-700 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Medical Bills</h3>
                  <p className="text-sm text-gray-600">AI is extracting text and analyzing your bills...</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-200 to-teal-300 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {uploadProgress.total > 0 ? `${uploadProgress.current} of ${uploadProgress.total} files processed` : 'Starting upload...'}
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          data-testid="file-input"
        />

        {/* Premium Automation Engine Modal */}
        <Sheet open={showPremiumAutomationModal} onOpenChange={setShowPremiumAutomationModal}>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Premium Automation Engine
              </SheetTitle>
              <SheetDescription>
                Automate your medical bill analysis and dispute processes with AI-powered workflows.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <PremiumAutomationEngine onSendMessage={sendMessage} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Premium Templates Library Modal */}
        <Sheet open={showPremiumTemplatesModal} onOpenChange={setShowPremiumTemplatesModal}>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Premium Templates Library
              </SheetTitle>
              <SheetDescription>
                Access professional-grade dispute letter templates and automated document generation.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <PremiumTemplatesLibrary onSendMessage={sendMessage} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Optional Intake Popup */}
        <OptionalIntakePopup
          isOpen={showOptionalIntakePopup}
          onClose={() => setShowOptionalIntakePopup(false)}
          onSubmit={handleOptionalIntakeSubmit}
          onFileUpload={handleFileUpload}
        />

        {/* Floating Help Sidebar */}
        <FloatingHelpSidebar
          workflow={selectedWorkflow}
          isVisible={showHelpSidebar && conversationStarted}
          onClose={() => setShowHelpSidebar(false)}
        />

        {/* Ultra-Modern 2025 Tips Modal */}
        <AnimatePresence>
          {showTipsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTipsModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
              data-testid="tips-modal-overlay"
            >
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/50 backdrop-blur-3xl rounded-[32px] shadow-2xl border border-white/60"
                data-testid="tips-modal-content"
              >
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      animate={{
                        x: [Math.random() * 400, Math.random() * 400],
                        y: [Math.random() * 400, Math.random() * 400],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Header */}
                <div className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-3xl mb-4 shadow-lg"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="text-4xl font-black text-white mb-2 leading-tight">
                        Pro Tips
                      </h2>
                      <p className="text-emerald-100 text-lg font-medium">
                        Expert strategies to maximize your savings
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowTipsModal(false)}
                      className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-colors"
                      data-testid="button-close-tips"
                    >
                      <XCircle className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-6">
                    {/* Contextual Tip */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Request Itemized Bills First
                          </h3>
                          <p className="text-gray-700 text-base leading-relaxed">
                            Always request an itemized bill before negotiating. Hospitals charge{" "}
                            <strong className="text-amber-700">200-500% markups</strong> on medications and{" "}
                            <strong className="text-amber-700">300-800% on supplies</strong>. An itemized bill reveals these overcharges.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick Action Tips */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Quick Actions
                      </h3>
                      
                      {[
                        {
                          icon: FileText,
                          title: "Use the 'Request Itemized Bill' button",
                          description: "Automatically generates a professional, legally-compliant request letter",
                          color: "from-emerald-500 to-teal-600"
                        },
                        {
                          icon: CheckCircle,
                          title: "Check for duplicate charges",
                          description: "Look for repeated line items with identical dates and amounts",
                          color: "from-teal-500 to-green-600"
                        },
                        {
                          icon: AlertTriangle,
                          title: "Question 'miscellaneous' fees",
                          description: "These vague charges often hide billing errors and can be disputed",
                          color: "from-purple-500 to-pink-600"
                        },
                        {
                          icon: DollarSign,
                          title: "Negotiate before paying",
                          description: "Hospitals often accept 30-50% less, especially for uninsured patients",
                          color: "from-emerald-500 to-green-600"
                        }
                      ].map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 8 }}
                          className="bg-white/80 backdrop-blur-xl border-2 border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                              <tip.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                {tip.title}
                              </h4>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {tip.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-6 shadow-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2">
                            Ready to Save?
                          </h3>
                          <p className="text-emerald-100 font-medium">
                            Use the buttons below to get started
                          </p>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ArrowRight className="w-10 h-10 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Green Chatbot Quick Actions Button */}
        <>
          <motion.button
            className="fixed right-4 z-40 w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-2xl flex items-center justify-center"
            style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFloatingQuickActions(!showFloatingQuickActions)}
            data-testid="bill-ai-quick-actions-button"
          >
            <motion.div
              animate={{ rotate: showFloatingQuickActions ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showFloatingQuickActions && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFloatingQuickActions(false)}
                />
                
                {/* Quick Actions Menu */}
                <motion.div
                  className="fixed bottom-36 right-4 z-40 space-y-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {[
                    {
                      icon: Upload,
                      title: "Upload Bill",
                      desc: "Scan bill images",
                      onClick: () => {
                        fileInputRef.current?.click();
                        setShowFloatingQuickActions(false);
                      },
                      gradient: "from-emerald-500 to-teal-600"
                    },
                    {
                      icon: FileText,
                      title: "Request Itemized",
                      desc: "Generate request letter",
                      onClick: () => {
                        const workflow = BILL_AI_WORKFLOWS.find(w => w.id === 'get-itemized-bill');
                        if (workflow) initializeWorkflowConversation(workflow);
                        setShowFloatingQuickActions(false);
                      },
                      gradient: "from-teal-500 to-green-600"
                    },
                    {
                      icon: Shield,
                      title: "Find Errors",
                      desc: "Detect overcharges",
                      onClick: () => {
                        sendMessage("Please analyze my bill for common errors, overcharges, and potential savings opportunities.");
                        setShowFloatingQuickActions(false);
                      },
                      gradient: "from-green-500 to-emerald-600"
                    },
                    {
                      icon: Crown,
                      title: "Premium Tools",
                      desc: "Advanced features",
                      onClick: () => {
                        window.location.href = '/premium';
                      },
                      gradient: "from-purple-500 to-pink-600"
                    }
                  ].map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.button
                          onClick={action.onClick}
                          className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/30 flex items-center space-x-3 min-w-56"
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.02 }}
                          data-testid={`quick-action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-sm text-gray-900">{action.title}</div>
                            <div className="text-xs text-gray-600">{action.desc}</div>
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      </div>
    </MobileLayout>
  );
}