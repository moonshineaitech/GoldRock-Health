import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Lock
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import type { MedicalBill } from "@shared/schema";
import { 
  DisputeLetterGenerator, 
  ErrorDetectionChecklist, 
  BillingRightsAdvisor, 
  ClaimAppealGenerator 
} from "@/components/bill-ai-features";
import { BillAnalysisLoader } from "@/components/BillAnalysisLoader";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { DemoStatsPanel } from "@/components/DemoStatsPanel";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";

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

export default function BillAI() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(true);
  const [localMessages, setLocalMessages] = useState<AIMessage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [showAssessmentPanel, setShowAssessmentPanel] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [savingsAnalysisStage, setSavingsAnalysisStage] = useState<'scanning' | 'analyzing' | 'calculating' | 'complete'>('scanning');
  const [showDemoStats, setShowDemoStats] = useState(true);
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  
  // Intake State Management
  const [intakeState, setIntakeState] = useState<IntakeState>({});
  const [assessmentIssues, setAssessmentIssues] = useState<AssessmentIssue[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark mode and auto-seed conversation
  useEffect(() => {
    const savedTheme = localStorage.getItem('billai-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'true' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }

    // Auto-seed assistant greeting message
    const initialMessage: AIMessage = {
      id: 'initial-greeting',
      role: 'assistant',
      content: `👋 **Hello! I'm your Medical Bill Assessment Expert.**

I specialize in finding billing errors, overcharges, and reduction opportunities in medical bills. I help patients save thousands by identifying:

• **Billing errors** (duplicate charges, incorrect codes, unbundling)
• **Price negotiations** using Medicare rates and market data  
• **Insurance appeals** and prior authorization issues
• **Financial assistance** programs and charity care options

**To get started with your bill analysis, I need these details:**

📋 **Total bill amount** - What's the total you're being charged?
🏥 **Provider/Hospital name** - Which facility treated you?
📅 **Service dates** - When did you receive care?
🔢 **Medical codes** - Any CPT, HCPCS, or ICD-10 codes on your bill?
🏥 **Insurance status** - Do you have insurance? Did they process this?
📄 **Itemized bill** - Do you have a detailed breakdown of charges?

**What's your medical bill situation?** Start by telling me the total amount and which hospital/provider it's from.`,
      createdAt: new Date(),
    };

    setLocalMessages([initialMessage]);
  }, []);

  // Calculate intake progress
  const getIntakeProgress = (): { completed: number; total: number; nextRequired: NextRequiredField } => {
    const fields = ['amount', 'provider', 'dates', 'insurance', 'codes'] as const;
    const completed = fields.filter(field => intakeState[field]).length;
    
    // Find next required field
    const nextRequired = fields.find(field => !intakeState[field]) || 
                        (!intakeState.itemizedBill ? 'itemized' : 'complete');
    
    return { completed, total: 6, nextRequired }; // 5 fields + itemized bill
  };

  // Check if basic intake is complete (amount, provider, dates)
  const isBasicIntakeComplete = () => {
    return intakeState.amount && intakeState.provider && intakeState.dates;
  };

  // Enhanced information extraction parsers with improved accuracy
  const extractBillInformation = (content: string): Partial<IntakeState> => {
    const updates: Partial<IntakeState> = {};
    const contentLower = content.toLowerCase();
    const lines = content.split('\n').map(line => line.trim());
    
    // Enhanced dollar amount extraction - prioritize common bill terms
    if (!intakeState.amount && content && content.includes('$')) {
      const priorityAmountPatterns = [
        // High priority - explicit bill amount terms
        /(?:total\s+(?:amount\s+)?due|patient\s+balance|amount\s+due|grand\s+total|total\s+charges?|balance\s+due)\s*[:;]?\s*\$?\s?([\d,]+\.?\d{0,2})/gi,
        /\$\s?([\d,]+\.?\d{0,2})\s*(?:total|due|balance|owed|charged)/gi,
        // Medium priority - general amounts over $50 (likely not copays)
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
          }).filter(a => !isNaN(a) && a > 50); // Filter out small amounts like copays
          
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
        // Look for proper names followed by medical terms
        /([A-Z][a-zA-Z\s&]{2,50}(?:Hospital|Medical Center|Health System|Clinic|Healthcare|Regional Medical|General Hospital|Memorial Hospital|University Hospital|Children's Hospital))/gi,
        // Look for medical facility patterns in headers/addresses
        /(?:bill\s+from|provider|facility|hospital)\s*[:;]?\s*([A-Z][a-zA-Z\s&]{5,60})/gi,
        // Look for common medical entity patterns
        /([A-Z][a-zA-Z\s]{2,30}(?:MD|LLC|PC|INC|Corp|Corporation))\s+(?:medical|health|clinic)/gi,
        // Extract from line patterns (first few lines often contain provider info)
        /^([A-Z][a-zA-Z\s&]{10,50})$/gm
      ];
      
      for (const pattern of providerPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          for (const match of matches) {
            let provider = pattern.source.includes('(') ? match.replace(pattern, '$1') : match;
            provider = provider.trim().replace(/[":;]/g, '').trim();
            
            // Validate provider name quality
            if (provider.length >= 8 && provider.length <= 80 && 
                /[A-Z]/.test(provider) && // Contains capital letters
                !/^\d+$/.test(provider) && // Not just numbers
                !/(date|time|total|amount|charge|service|phone|address|bill)/i.test(provider)) {
              updates.provider = provider;
              break;
            }
          }
          if (updates.provider) break;
        }
      }
    }
    
    // Enhanced service date extraction with validation
    if (!intakeState.dates) {
      const datePatterns = [
        // Explicit service date patterns
        /(?:service\s+date|date\s+of\s+service|treatment\s+date|visit\s+date|procedure\s+date|admission\s+date)\s*[:;]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
        /(?:from|on)\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(?:to|through)/gi,
        // Date ranges
        /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s*(?:[-–—]|to)\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/gi,
        // Standalone dates (avoiding bill dates)
        /(?<!bill\s+date|statement\s+date|invoice\s+date)[\s:](\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
        // Month name formats
        /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(\d{1,2}),?\s+(\d{2,4})/gi
      ];
      
      for (const pattern of datePatterns) {
        const matches = content.match(pattern);
        if (matches) {
          let bestDate = matches[0];
          if (pattern.source.includes('(')) {
            // Extract capture group
            const match = pattern.exec(content);
            if (match) {
              bestDate = match[1] || match[0];
            }
          }
          if (bestDate && typeof bestDate === 'string') {
            updates.dates = bestDate.trim();
            break;
          }
        }
      }
    }
    
    // Enhanced insurance information extraction
    if (!intakeState.insurance) {
      const insurancePatterns = [
        // Specific insurance companies
        /(blue cross blue shield|blue cross|blue shield|aetna|cigna|anthem|united healthcare|unitedhealth|kaiser|medicare|medicaid|tricare|humana)[^\n.]{0,50}/gi,
        // Insurance terms with context
        /(primary insurance|secondary insurance|insurance carrier|plan name|member id|policy number|group number)[:\s]*([^\n.]{5,50})/gi,
        // Insurance payment references
        /(insurance payment|insurance adjustment|eob|explanation of benefits|copay|deductible|coinsurance)[:\s]*([^\n.]{0,30})/gi,
        // Network status
        /(out of network|in network|non-participating provider|participating provider)/gi
      ];
      
      for (const pattern of insurancePatterns) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
          const bestMatch = matches[0].trim();
          if (bestMatch.length > 5) {
            updates.insurance = bestMatch;
            break;
          }
        }
      }
    }
    
    // Enhanced medical code extraction with validation
    const medicalCodePatterns = {
      // CPT Codes (5 digits, sometimes with modifiers)
      cpt: /\b(\d{5}(?:-\w{2})?)\b/g,
      // HCPCS Codes (letter followed by 4 digits)
      hcpcs: /\b([A-V]\d{4})\b/g,
      // ICD-10 Diagnosis Codes (letter, 2 digits, optional decimal and more)
      icd10: /\b([A-Z]\d{2}(?:\.\w{1,4})?)\b/g,
      // Revenue Codes (3-4 digits, often 0xxx format)
      revenue: /\b(0\d{3}|\d{4})\b(?=.*(?:revenue|room|board|pharmacy|lab|radiology))/gi
    };
    
    // Extract CPT codes
    const cptMatches = Array.from(content.matchAll(medicalCodePatterns.cpt) || []);
    const newCptCodes = cptMatches
      .map(match => match[1])
      .filter(code => code && !((intakeState.cptCodes || []).includes(code)))
      .slice(0, 20); // Limit to prevent overwhelming
    
    // Extract HCPCS codes
    const hcpcsMatches = Array.from(content.matchAll(medicalCodePatterns.hcpcs) || []);
    const newHcpcsCodes = hcpcsMatches
      .map(match => match[1])
      .filter(code => code && !((intakeState.hcpcsCodes || []).includes(code)))
      .slice(0, 10);
    
    // Extract ICD codes
    const icdMatches = Array.from(content.matchAll(medicalCodePatterns.icd10) || []);
    const newIcdCodes = icdMatches
      .map(match => match[1])
      .filter(code => code && !((intakeState.icdCodes || []).includes(code)))
      .slice(0, 15);
    
    // Update codes if found
    if (newCptCodes.length > 0 || newHcpcsCodes.length > 0 || newIcdCodes.length > 0) {
      const allNewCodes = [...newCptCodes, ...newHcpcsCodes, ...newIcdCodes];
      updates.cptCodes = [...(intakeState.cptCodes || []), ...newCptCodes];
      updates.hcpcsCodes = [...(intakeState.hcpcsCodes || []), ...newHcpcsCodes];
      updates.icdCodes = [...(intakeState.icdCodes || []), ...newIcdCodes];
      
      if (!intakeState.codes && allNewCodes.length > 0) {
        updates.codes = `${allNewCodes.length} medical codes identified`;
      } else if (intakeState.codes && allNewCodes.length > 0) {
        const existingCount = (intakeState.codes.match(/\d+/) || ['0'])[0];
        const totalCodes = parseInt(existingCount) + allNewCodes.length;
        updates.codes = `${totalCodes} medical codes identified`;
      }
    }
    
    // Enhanced itemized bill detection
    if (!intakeState.itemizedBill) {
      const itemizedIndicators = [
        'itemized', 'detailed charges', 'line by line', 'breakdown', 'charge description',
        'service description', 'cpt code', 'procedure code', 'revenue code', 'charge master'
      ];
      
      const itemizedScore = itemizedIndicators.reduce((score, indicator) => {
        return score + (contentLower.includes(indicator) ? 1 : 0);
      }, 0);
      
      // Also check for structured data patterns
      const hasStructuredData = /^\d+\s+[A-Z\d]{3,10}\s+[\w\s]+\$[\d,]+/m.test(content) ||
                               content.includes('CPT') || content.includes('HCPCS') ||
                               /\$[\d,]+\.\d{2}\s*$/m.test(content);
      
      if (itemizedScore >= 2 || hasStructuredData) {
        updates.itemizedBill = true;
      }
    }
    
    // Quality scoring for extraction confidence
    if (Object.keys(updates).length > 0) {
      updates.lastUpdated = new Date();
      
      // Add extraction quality indicators
      const extractionQuality = {
        hasExplicitAmounts: updates.amount && content.toLowerCase().includes('total'),
        hasProviderName: updates.provider && updates.provider.length > 10,
        hasServiceDate: updates.dates && !content.toLowerCase().includes('bill date'),
        hasInsuranceDetails: updates.insurance && updates.insurance.length > 10,
        hasMedicalCodes: (updates.cptCodes?.length || 0) > 0,
        hasItemizedData: updates.itemizedBill
      };
      
      // Store quality metadata for later use
      (updates as any).extractionQuality = extractionQuality;
    }
    
    return updates;
  };
  
  // Update intake state from message analysis
  const updateIntakeFromMessage = (content: string) => {
    const updates = extractBillInformation(content);
    if (Object.keys(updates).length > 0) {
      setIntakeState(prev => ({ ...prev, ...updates }));
    }
  };

  // Get current information status for AI context
  const getInformationStatus = () => {
    const progress = getIntakeProgress();
    const missingFields: Array<{key: string, label: string, instruction: string}> = [];
    const providedFields: string[] = [];
    
    // Check each critical field
    const criticalFields = [
      { key: 'amount', label: 'Total Bill Amount', instruction: 'Look for the total amount due at the bottom of your bill' },
      { key: 'provider', label: 'Provider/Hospital Name', instruction: 'Check the letterhead or billing address on your bill' },
      { key: 'dates', label: 'Service Dates', instruction: 'Find the dates when care was provided (different from bill date)' },
      { key: 'insurance', label: 'Insurance Details', instruction: 'Look for insurance payments, EOB references, or coverage information' },
      { key: 'codes', label: 'Medical Codes', instruction: 'Find CPT, HCPCS, or ICD-10 codes in the itemized section' },
      { key: 'itemizedBill', label: 'Itemized Breakdown', instruction: 'Get the detailed line-by-line charges with procedure codes' }
    ];
    
    criticalFields.forEach(field => {
      if (intakeState[field.key as keyof IntakeState]) {
        providedFields.push(field.label);
      } else {
        missingFields.push(field);
      }
    });
    
    // Priority order for missing information
    const priorityMissing = missingFields.sort((a, b) => {
      const priority = ['amount', 'provider', 'dates', 'codes', 'insurance', 'itemizedBill'];
      return priority.indexOf(a.key) - priority.indexOf(b.key);
    });
    
    const summary = `Progress: ${progress.completed}/${progress.total} complete\n` +
      `✓ Provided: ${providedFields.length > 0 ? providedFields.join(', ') : 'None yet'}\n` +
      `⚠ Still Need: ${missingFields.length > 0 ? missingFields.map(f => f.label).join(', ') : 'Assessment complete!'}`;
    
    const missingGuidance = priorityMissing.length > 0 
      ? `PRIORITY MISSING INFORMATION:\n${priorityMissing.slice(0, 3).map(field => 
          `• ${field.label}: ${field.instruction}`
        ).join('\n')}`
      : 'All critical information collected - ready for comprehensive analysis!';
    
    return {
      summary,
      missingGuidance,
      priorityMissing: priorityMissing.slice(0, 3),
      isComplete: missingFields.length === 0,
      nextCritical: priorityMissing[0]?.key
    };
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('billai-dark-mode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Compact iOS-Style Bill Summary Card Component
  const BillSummaryCard = () => {
    const progress = getIntakeProgress();
    const hasAnyData = Object.values(intakeState).some(value => value);
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Don't show card until conversation starts or data is collected
    if (!conversationStarted && !hasAnyData) return null;
    
    const informationFields = [
      {
        key: 'amount',
        label: 'Amount',
        icon: DollarSign,
        value: intakeState.amount,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50/80 dark:bg-emerald-900/20'
      },
      {
        key: 'provider',
        label: 'Provider',
        icon: Building2,
        value: intakeState.provider,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50/80 dark:bg-blue-900/20'
      },
      {
        key: 'dates',
        label: 'Date',
        icon: Calendar,
        value: intakeState.dates,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50/80 dark:bg-purple-900/20'
      },
      {
        key: 'insurance',
        label: 'Insurance',
        icon: Shield,
        value: intakeState.insurance,
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50/80 dark:bg-indigo-900/20'
      },
      {
        key: 'codes',
        label: 'Codes',
        icon: FileText,
        value: intakeState.codes,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50/80 dark:bg-orange-900/20'
      },
      {
        key: 'itemizedBill',
        label: 'Itemized',
        icon: ClipboardList,
        value: intakeState.itemizedBill ? 'Available' : undefined,
        color: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-50/80 dark:bg-teal-900/20'
      }
    ];
    
    const completedFields = informationFields.filter(field => field.value);
    const progressPercentage = (completedFields.length / informationFields.length) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20 overflow-hidden">
          {/* Compact Header */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Bill Summary</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {completedFields.length}/{informationFields.length} complete
                    </span>
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 p-0 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                data-testid="expand-bill-summary"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </Button>
            </div>
          </div>
          
          {/* Expandable Content */}
          <AnimatePresence>
            {(isExpanded || !hasAnyData) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  {hasAnyData ? (
                    <div className="grid grid-cols-3 gap-2">
                      {informationFields.map((field) => {
                        const Icon = field.icon;
                        const isCompleted = !!field.value;
                        
                        return (
                          <motion.div
                            key={field.key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`p-2.5 rounded-xl border transition-all duration-300 ${
                              isCompleted 
                                ? `${field.bgColor} border-transparent shadow-sm` 
                                : 'bg-gray-50/80 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50'
                            }`}
                            data-testid={`field-${field.key}`}
                          >
                            <div className="flex items-center space-x-1.5 mb-1">
                              <Icon className={`h-3 w-3 ${
                                isCompleted ? field.color : 'text-gray-400 dark:text-gray-500'
                              }`} />
                              <span className={`text-xs font-medium leading-none ${
                                isCompleted ? field.color : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                {field.label}
                              </span>
                              {isCompleted && (
                                <CheckCircle className={`h-2.5 w-2.5 ${field.color}`} />
                              )}
                            </div>
                            <p className={`text-xs leading-tight ${
                              isCompleted 
                                ? 'text-gray-900 dark:text-gray-100 font-medium' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {field.value ? (field.value.length > 20 ? `${field.value.substring(0, 20)}...` : field.value) : 'Not set'}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No bill info yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Chat with me to start tracking
                      </p>
                    </div>
                  )}
                  
                  {/* Completion Status */}
                  {progress.nextRequired === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 pt-3 border-t border-gray-100/50 dark:border-gray-700/50 text-center"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          Ready for analysis!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Compact Summary Bar when collapsed */}
          {!isExpanded && hasAnyData && (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex space-x-4">
                  {completedFields.slice(0, 3).map((field, index) => (
                    <div key={field.key} className="flex items-center space-x-1">
                      <field.icon className={`h-3 w-3 ${field.color}`} />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {field.value && field.value.length > 15 ? `${field.value.substring(0, 15)}...` : field.value}
                      </span>
                    </div>
                  ))}
                </div>
                {completedFields.length > 3 && (
                  <span className="text-gray-500 dark:text-gray-400">+{completedFields.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Enhanced CTA Footer component with contextual quick replies
  const CTAFooter = () => {
    const progress = getIntakeProgress();
    
    // Generate contextual quick replies based on current intake state and priority
    const getContextualQuickReplies = () => {
      const replies = [];
      
      // Always include "What info do you need?" as requested
      replies.push({
        label: 'What info do you need?',
        action: () => setInputMessage('What specific information do you need from me?'),
        priority: 1
      });
      
      // Priority-based contextual replies
      if (!intakeState.amount) {
        replies.push({
          label: '💰 Add Bill Amount',
          action: () => setInputMessage('The total amount on my bill is $'),
          priority: 1
        });
      } else if (!intakeState.codes && !intakeState.itemizedBill) {
        replies.push({
          label: '🔍 I need help finding codes',
          action: () => setInputMessage('I need help finding the medical codes on my bill'),
          priority: 1
        });
        replies.push({
          label: '📋 Upload itemized bill',
          action: () => fileInputRef.current?.click(),
          priority: 2
        });
      } else if (!intakeState.provider) {
        replies.push({
          label: '🏥 Add Provider Name',
          action: () => setInputMessage('The medical provider/hospital name is '),
          priority: 1
        });
      } else if (!intakeState.dates) {
        replies.push({
          label: '📅 Add Service Date',
          action: () => setInputMessage('The date of service was '),
          priority: 1
        });
      } else if (!intakeState.insurance) {
        replies.push({
          label: '🛡️ Add Insurance Info',
          action: () => setInputMessage('My insurance situation is '),
          priority: 1
        });
      }
      
      // Secondary options for completed intake
      if (progress.nextRequired === 'complete') {
        replies.length = 0; // Clear previous replies
        replies.push(
          {
            label: '🔍 Find billing errors',
            action: () => setInputMessage('Please analyze my bill for billing errors and overcharges'),
            priority: 1
          },
          {
            label: '💸 Calculate savings',
            action: () => setInputMessage('What potential savings can you find in my bill?'),
            priority: 1
          },
          {
            label: '📝 Help with negotiation',
            action: () => setInputMessage('Help me negotiate this bill and create a payment plan'),
            priority: 2
          }
        );
      }
      
      // Always include upload option if not complete
      if (progress.nextRequired !== 'complete') {
        replies.push({
          label: '📎 Upload Images',
          action: () => fileInputRef.current?.click(),
          priority: 2
        });
      }
      
      // Sort by priority and take top 3
      return replies
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 3);
    };

    const quickReplies = getContextualQuickReplies();

    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-gray-50/80 via-white/50 to-gray-100/80 dark:from-gray-800/60 dark:via-gray-700/40 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 dark:border-gray-600/30 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <MessageCircle className="h-2.5 w-2.5 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 tracking-tight">
            {progress.nextRequired === 'complete' ? 
              'Ready for analysis - choose your focus:' : 
              'Quick actions to help me help you:'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={reply.action}
              className="text-sm h-10 px-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-emerald-50/90 dark:hover:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300/70 dark:hover:border-emerald-600/70 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 font-medium"
              data-testid={`contextual-quick-reply-${index}`}
            >
              {reply.label}
            </Button>
          ))}
        </div>
        
        {/* iOS-Style Progress indicator for incomplete intake */}
        {progress.nextRequired !== 'complete' && (
          <div className="mt-4 pt-3 border-t border-gray-200/40 dark:border-gray-600/40">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Progress: {progress.completed}/{progress.total} complete
              </span>
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get user's bills for quick access
  const { data: userBills = [] } = useQuery<MedicalBill[]>({
    queryKey: ["/api/medical-bills"],
    enabled: !!user,
  });

  // Focus on input when conversation loads
  useEffect(() => {
    // Auto-focus on input after component mounts
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 500);
  }, []);

  // Generate contextual next-step guidance based on current intake state
  const appendNextStepGuidance = (originalResponse: string): string => {
    const progress = getIntakeProgress();
    
    // Don't append guidance to initial greeting message
    if (originalResponse.includes("Hello! I'm your Medical Bill Assessment Expert")) {
      return originalResponse;
    }
    
    // Determine missing information and priority
    const missingFields = [];
    if (!intakeState.amount) missingFields.push("total bill amount");
    if (!intakeState.provider) missingFields.push("provider/hospital name");
    if (!intakeState.dates) missingFields.push("service dates");
    if (!intakeState.codes) missingFields.push("medical codes (CPT/HCPCS/ICD)");
    if (!intakeState.insurance) missingFields.push("insurance information");
    if (!intakeState.itemizedBill) missingFields.push("itemized bill");
    
    // If we have complete information, focus on analysis
    if (progress.nextRequired === 'complete') {
      return `${originalResponse}

---

🎯 **NEXT STEPS - Ready for Deep Analysis:**

Your bill information is complete! I can now provide:
• **Comprehensive error detection** analysis
• **Specific savings opportunities** with dollar amounts  
• **Negotiation strategies** using Medicare pricing data
• **Appeal letter templates** if insurance denied coverage

**What would you like me to focus on next?**`;
    }

    // Generate contextual guidance based on what's missing
    let guidanceText = `

---

📋 **NEXT STEPS - Help Me Help You Save Money:**

`;

    // Priority guidance based on most important missing field
    if (!intakeState.amount) {
      guidanceText += `💰 **Most Important:** I need your **total bill amount** to calculate potential savings.
• Look for "Total Amount Due" or "Balance Due" on your statement
• Include the full amount before any insurance payments

`;
    } else if (!intakeState.codes && !intakeState.itemizedBill) {
      guidanceText += `🔍 **Critical for Savings:** I need your **medical codes** to find billing errors.
• Request an itemized bill showing CPT codes (5-digit numbers like 99213)
• Look for HCPCS codes (letter + 4 digits like J1234) 
• These codes are where most billing errors hide!

`;
    } else if (!intakeState.provider) {
      guidanceText += `🏥 **Need Provider Info:** Which hospital/medical facility treated you?
• Look at the top of your bill for the provider name
• This helps me check their pricing against market rates

`;
    } else if (!intakeState.dates) {
      guidanceText += `📅 **Need Service Dates:** When did you receive treatment?
• Look for "Date of Service" or "DOS" on your bill
• This is different from when the bill was sent

`;
    }

    // Add secondary missing items
    const remainingMissing = missingFields.slice(0, 2);
    if (remainingMissing.length > 0) {
      guidanceText += `**Also helpful:** ${remainingMissing.join(", ")}

`;
    }

    guidanceText += `💡 **Quick Options:**
• Upload bill images using the 📎 button
• Ask: "What specific information do you need from me?"
• Say: "I have my itemized bill" if you have detailed charges`;

    return `${originalResponse}${guidanceText}`;
  };

  // Enhanced sendMessage with intake state management
  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    
    // Add user message immediately
    setLocalMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setConversationStarted(true);
    
    // Update intake state from user message
    updateIntakeFromMessage(content);
    
    try {
      // Enhanced context for professional bill analysis
      const intakeContext = Object.keys(intakeState).length > 0 ? `

CURRENT INTAKE STATE:
${Object.entries(intakeState).map(([key, value]) => `${key}: ${value}`).join('\\n')}` : '';
      
      // Calculate what information we have vs what's missing
      const informationStatus = getInformationStatus();
      
      const enhancedPrompt = `[EXPERT MEDICAL BILL ASSESSMENT SPECIALIST - STRUCTURED INFORMATION EXTRACTION]

User Message: ${content.trim()}
${intakeContext}

**CURRENT ASSESSMENT STATUS:**
${informationStatus.summary}

**YOUR EXPERT ROLE:**
You are a senior medical billing advocate with 20+ years of experience saving patients millions in overcharges. You conduct forensic-level bill analysis and guide patients through comprehensive assessment like a professional consultant.

**CRITICAL ASSESSMENT FRAMEWORK:**

1. **INFORMATION EXTRACTION PRIORITY:**
   - Actively scan the user's message for specific bill details
   - Extract and confirm: amounts, dates, provider names, codes, insurance details
   - Cross-reference with assessment status to identify gaps
   - Flag any billing red flags or error indicators mentioned

2. **STRUCTURED RESPONSE FORMAT:**
   - Start: "Based on your message, I've identified [specific details found]"
   - Acknowledge: What information you now have vs. what's still needed
   - Educate: Brief explanation of why missing information is critical
   - Guide: Specific instructions on where to find missing details on their bill
   - Ask: Targeted follow-up questions for the most critical missing pieces

3. **EXPERT BILL ANALYSIS APPROACH:**
   - Reference specific bill sections: "Look for the 'Itemized Charges' or 'Service Details' section"
   - Mention common error types: "I need the CPT codes to check for unbundling schemes"
   - Use professional terminology: "procedure codes", "charge master", "revenue codes"
   - Reference regulatory requirements: "Hospital price transparency laws require..."

4. **MISSING INFORMATION GUIDANCE:**
   ${informationStatus.missingGuidance}

5. **PROFESSIONAL POSITIONING:**
   - Position yourself as their billing expert: "As your billing advocate..."
   - Reference industry knowledge: "In my experience, 80% of bills contain errors worth $2,000+"
   - Demonstrate expertise: "Based on the [provider/amount/procedure] you mentioned..."
   - Show urgency: "Time is critical - bills typically go to collections in 90-120 days"

**RESPONSE REQUIREMENTS:**
- Extract and confirm any new bill information from their message
- Explicitly state what we now have vs. what we still need
- Provide specific guidance on finding the most critical missing pieces
- Ask targeted questions to advance the assessment
- Reference potential savings opportunities based on information provided
- Use expert medical billing terminology and demonstrate industry knowledge

**CRITICAL:** Your response should advance the bill assessment process. Don't just provide general advice - actively extract information, identify gaps, and guide them toward comprehensive bill analysis like a professional billing consultant would.`;
      
      const response = await apiRequest("POST", "/api/medical-chat", {
        message: enhancedPrompt
      });

      const data = await response.json();

      // Get the raw AI response
      const rawResponse = data.response || "I'm here to help analyze your medical bill and find ways to reduce costs. Please tell me about your bill - the amount, provider, dates, and any medical codes you can see.";
      
      // Append contextual next-step guidance to the response
      const enhancedResponse = appendNextStepGuidance(rawResponse);

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: enhancedResponse,
        createdAt: new Date(),
      };

      setLocalMessages(prev => [...prev, assistantMessage]);
      
      // Also parse AI message for any information extraction
      updateIntakeFromMessage(assistantMessage.content);
      
      // Update assessment panel and savings calculator after AI response
      setTimeout(() => {
        if (!showAssessmentPanel && conversationStarted) {
          setShowAssessmentPanel(true);
        }
        // Show savings calculator if we have bill amount
        if (intakeState.amount && !showSavingsCalculator) {
          setShowSavingsCalculator(true);
          // Simulate analysis stages
          setTimeout(() => setSavingsAnalysisStage('analyzing'), 500);
          setTimeout(() => setSavingsAnalysisStage('calculating'), 1500);
          setTimeout(() => setSavingsAnalysisStage('complete'), 3000);
        }
        // Show premium showcase after some interaction
        if (localMessages.length >= 3 && !isSubscribed && !showPremiumShowcase) {
          setTimeout(() => setShowPremiumShowcase(true), 2000);
        }
      }, 1000);
      
      setIsTyping(false);
    } catch (error: any) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        createdAt: new Date(),
      };
      
      setLocalMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Multiple file upload mutation for Bill AI
  // Generate enhanced post-upload analysis with actionable next steps
  const generatePostUploadAnalysis = (uploadAnalysis: string | null, fileCount: number): string => {
    // Extract information from the uploaded analysis
    const preUploadState = { ...intakeState };
    if (uploadAnalysis) {
      const extractedInfo = extractBillInformation(uploadAnalysis);
      // Simulate what the state would be after processing the upload
      Object.assign(preUploadState, extractedInfo);
    }
    
    // Calculate what's still missing after upload
    const missingInfo: string[] = [];
    const foundInfo: string[] = [];
    
    // Check critical information
    if (!preUploadState.amount) {
      missingInfo.push("**Total Bill Amount** - Look for the grand total at the bottom of your bill");
    } else {
      foundInfo.push(`Amount: ${preUploadState.amount}`);
    }
    
    if (!preUploadState.provider) {
      missingInfo.push("**Provider/Hospital Name** - Check the letterhead or billing address");
    } else {
      foundInfo.push(`Provider: ${preUploadState.provider}`);
    }
    
    if (!preUploadState.dates) {
      missingInfo.push("**Service Dates** - Find 'Date of Service' (not the bill date)");
    } else {
      foundInfo.push(`Service Date: ${preUploadState.dates}`);
    }
    
    if (!preUploadState.codes && !preUploadState.cptCodes?.length) {
      missingInfo.push("**Medical Procedure Codes (CPT)** - Look in the itemized charges section");
    } else if (preUploadState.codes || preUploadState.cptCodes?.length) {
      const codeCount = preUploadState.cptCodes?.length || 0;
      foundInfo.push(`Medical Codes: ${codeCount} codes identified`);
    }
    
    if (!preUploadState.insurance) {
      missingInfo.push("**Insurance Information** - Any insurance payments, EOBs, or coverage details");
    } else {
      foundInfo.push(`Insurance: ${preUploadState.insurance}`);
    }
    
    // Generate professional analysis response
    let analysisContent = `🔍 **BILL UPLOAD ANALYSIS COMPLETE** - ${fileCount} image${fileCount > 1 ? 's' : ''} processed\n\n`;
    
    // Show what was successfully extracted
    if (foundInfo.length > 0) {
      analysisContent += `✅ **INFORMATION SUCCESSFULLY EXTRACTED:**\n${foundInfo.map(info => `• ${info}`).join('\n')}\n\n`;
    }
    
    // Include original analysis if available
    if (uploadAnalysis && uploadAnalysis.trim()) {
      analysisContent += `📋 **BILL CONTENT DETECTED:**\n${uploadAnalysis}\n\n`;
    }
    
    // Show what's still needed with specific guidance
    if (missingInfo.length > 0) {
      analysisContent += `⚠️ **CRITICAL INFORMATION STILL NEEDED FOR COMPREHENSIVE ANALYSIS:**\n\n`;
      
      missingInfo.forEach((info, index) => {
        analysisContent += `${index + 1}. ${info}\n`;
      });
      
      analysisContent += `\n🔍 **WHERE TO FIND THIS INFORMATION:**\n`;
      analysisContent += `• Check the **top section** of your bill for provider/hospital name\n`;
      analysisContent += `• Look for **"Date of Service"** or **"Service Period"** (not the bill date)\n`;
      analysisContent += `• Find the **"Itemized Charges"** or **"Service Details"** section for procedure codes\n`;
      analysisContent += `• Look for **"Total Amount Due"** or **"Patient Balance"** at the bottom\n`;
      analysisContent += `• Check for **insurance payments** or **"EOB"** (Explanation of Benefits) references\n\n`;
      
      analysisContent += `💡 **WHY THIS MATTERS:**\n`;
      analysisContent += `With complete information, I can identify:\n`;
      analysisContent += `• **Billing errors** and duplicate charges (saves avg. $2,400)\n`;
      analysisContent += `• **Overpriced procedures** using Medicare benchmarks\n`;
      analysisContent += `• **Insurance appeal opportunities** and prior authorization issues\n`;
      analysisContent += `• **Negotiation strategies** and payment plan options\n\n`;
      
      const nextPriority = missingInfo[0].includes('Amount') ? 'total bill amount' :
                          missingInfo[0].includes('Provider') ? 'hospital/provider name' :
                          missingInfo[0].includes('Date') ? 'service date' :
                          missingInfo[0].includes('Codes') ? 'procedure codes' : 'insurance details';
      
      analysisContent += `🎯 **NEXT STEP:** Please provide your **${nextPriority}** so I can begin identifying savings opportunities.`;
    } else {
      // All information complete
      analysisContent += `🎉 **COMPLETE INFORMATION COLLECTED!**\n\n`;
      analysisContent += `I now have all the details needed for comprehensive bill analysis. Let me identify:\n`;
      analysisContent += `• Billing errors and overcharges\n`;
      analysisContent += `• Price negotiation opportunities\n`;
      analysisContent += `• Insurance appeal strategies\n`;
      analysisContent += `• Financial assistance options\n\n`;
      analysisContent += `**Ready to analyze your bill for maximum savings opportunities!**`;
    }
    
    return analysisContent;
  };

  const uploadBillMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      
      // Add all files to FormData
      files.forEach((file) => {
        formData.append("bills", file);
      });
      formData.append("sessionId", "bill-ai-session");
      
      const response = await fetch("/api/upload-bills", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      setUploadingFiles(false);
      setUploadProgress({current: 0, total: 0});
      
      if (data.success) {
        // Add user's file upload message first
        const uploadMessage = {
          id: Date.now().toString(),
          role: "user" as const,
          content: `📎 Uploaded ${data.fileCount || 1} medical bill image${data.fileCount > 1 ? 's' : ''} for analysis`,
          createdAt: new Date(),
        };
        
        // Generate enhanced analysis with actionable next steps
        const enhancedAnalysis = generatePostUploadAnalysis(data.analysis, data.fileCount || 1);
        
        const analysisMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: enhancedAnalysis,
          createdAt: new Date(),
        };
        
        setLocalMessages(prev => [...prev, uploadMessage, analysisMessage]);
        setConversationStarted(true);
        
        // Parse both upload and analysis messages for information extraction
        updateIntakeFromMessage(uploadMessage.content);
        if (data.analysis) {
          updateIntakeFromMessage(data.analysis);
        }
        // Also extract from enhanced analysis
        updateIntakeFromMessage(enhancedAnalysis);
        
        // Show success toast with actionable next step
        const nextStepHint = Object.keys(intakeState).length < 3 ? 
          " Please provide missing details to continue." : 
          " Analysis in progress...";
        
        toast({
          title: `${data.fileCount || 1} Bill Image${data.fileCount > 1 ? 's' : ''} Analyzed`,
          description: (data.message || "Bill images processed successfully.") + nextStepHint,
        });
        
        // Refetch bills to update the list
        queryClient.invalidateQueries({ queryKey: ["/api/medical-bills"] });
      } else {
        toast({
          title: "Upload Failed",
          description: data.message || "Failed to upload bill images. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setUploadingFiles(false);
      setUploadProgress({current: 0, total: 0});
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || "Failed to upload bill images. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Validate file count (max 5)
    if (files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Please upload up to 5 images maximum. Select your most important bill pages.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate each file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Images Only",
          description: "Please upload image files only (JPG, PNG, WebP). Take photos or screenshots of your medical bills.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB max per file)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `File "${file.name}" is too large. Please ensure each image is smaller than 10MB.`,
          variant: "destructive",
        });
        return;
      }
    }

    setUploadingFiles(true);
    setUploadProgress({current: 0, total: files.length});
    
    // Convert FileList to Array
    const fileArray = Array.from(files);
    
    // Show processing time warning for multiple files
    if (files.length > 1) {
      toast({
        title: `Uploading ${files.length} Images`,
        description: `Processing ${files.length} bill images may take 1-2 minutes for comprehensive analysis. Please wait...`,
      });
    }
    
    uploadBillMutation.mutate(fileArray);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isTyping]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;
    sendMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Removed - Tools now integrated in main header sheet

  // Assessment Panel Component
  const AssessmentPanel = () => {
    const progress = getIntakeProgress();
    
    if (!conversationStarted) return null;
    
    return (
      <Sheet open={showAssessmentPanel} onOpenChange={setShowAssessmentPanel}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3"
            data-testid="assessment-panel-trigger"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Assessment
            {progress.completed > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {progress.completed}/{progress.total}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[60vh]">
          <SheetHeader>
            <SheetTitle>Bill Assessment</SheetTitle>
            <SheetDescription>
              Intake progress and detected issues
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Intake Progress</span>
                <span>{progress.completed}/{progress.total}</span>
              </div>
              <Progress value={(progress.completed / progress.total) * 100} className="h-2" />
            </div>
            {assessmentIssues.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Detected Issues</h4>
                <div className="space-y-2">
                  {assessmentIssues.map((issue) => (
                    <div key={issue.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{issue.title}</span>
                        {issue.savingsPotential && (
                          <Badge variant="secondary">{issue.savingsPotential}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <MobileLayout 
      title="Bill Assessment" 
      showBackButton={true}
      showBottomNav={true}
    >
      <div className="flex flex-col h-full relative">
        {/* Loading Animation Overlay */}
        <BillAnalysisLoader 
          fileCount={uploadProgress.total} 
          isVisible={uploadingFiles && uploadProgress.total > 0} 
        />

        {/* iOS-Style Clean Header */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/30 px-4 py-3 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-base tracking-tight">Bill AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Medical Bill Expert</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button onClick={toggleDarkMode} variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-xl">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Sheet open={showToolsDrawer} onOpenChange={setShowToolsDrawer}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-9 h-9 p-0 rounded-xl"
                    data-testid="tools-menu-button"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl border-t-0">
                  <SheetHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <SheetTitle className="text-lg font-semibold flex items-center space-x-2">
                          <span>Advanced Tools</span>
                          {!isSubscribed && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </SheetTitle>
                        <SheetDescription>
                          {isSubscribed 
                            ? "Professional bill analysis and negotiation tools" 
                            : "Professional tools to save $2,000-$50,000+ on medical bills"
                          }
                        </SheetDescription>
                      </div>
                      {!isSubscribed && (
                        <div className="text-right">
                          <div className="text-xs text-emerald-600 font-semibold">
                            Average savings: $8,500
                          </div>
                          <div className="text-xs text-gray-500">
                            Unlock all features
                          </div>
                        </div>
                      )}
                    </div>
                  </SheetHeader>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <DisputeLetterGenerator onSendMessage={sendMessage} />
                      <ErrorDetectionChecklist onSendMessage={sendMessage} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <BillingRightsAdvisor onSendMessage={sendMessage} />
                      <ClaimAppealGenerator onSendMessage={sendMessage} />
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Assessment Progress</span>
                        <span>{getIntakeProgress().completed}/{getIntakeProgress().total}</span>
                      </div>
                      <Progress value={(getIntakeProgress().completed / getIntakeProgress().total) * 100} className="h-2" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Fixed/Pinned Bill Summary Card */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-700/30">
          <div className="p-3">
            <BillSummaryCard />
          </div>
        </div>

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

        {/* Demo Stats Panel */}
        {showDemoStats && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-700/30">
            <div className="p-3">
              <DemoStatsPanel isVisible={showDemoStats} />
            </div>
          </div>
        )}

        {/* Premium Feature Showcase */}
        {showPremiumShowcase && !isSubscribed && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-700/30">
            <div className="p-3">
              <PremiumFeatureShowcase 
                isSubscribed={isSubscribed}
                onUpgrade={() => {
                  // Navigate to premium page or trigger upgrade flow
                  window.open('/premium', '_blank');
                }}
                savingsAmount={intakeState.amount?.replace(/[$,]/g, '') ? 
                  Math.round(parseFloat(intakeState.amount.replace(/[$,]/g, '')) * 0.15).toLocaleString() : 
                  '12,400'
                }
              />
            </div>
          </div>
        )}

        {/* Chat Messages Area - iOS Style */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/30" style={{ padding: '1rem 1rem 0 1rem' }}>
          <div className="space-y-4 pb-4">
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
              <div className={`max-w-[80%] ${
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
                
                {/* CTA Footer for AI responses */}
                {message.role === "assistant" && <CTAFooter />}
                
                <div className={`text-xs mt-3 flex items-center justify-end ${
                  message.role === "user" 
                    ? "text-emerald-100/80" 
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  <span>{message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.role === "user" && (
                    <div className="ml-1.5 w-4 h-4 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-100/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
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
                onClick={handleSendMessage}
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
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          data-testid="file-input"
        />
      </div>
    </MobileLayout>
  );
}