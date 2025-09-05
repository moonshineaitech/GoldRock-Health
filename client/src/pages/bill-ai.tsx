import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  DollarSign, 
  Brain, 
  Send, 
  Paperclip, 
  Bot,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Shield,
  Loader2,
  FileEdit,
  Copy,
  Check,
  Download,
  Phone,
  ChevronDown,
  ChevronUp,
  Building2,
  CreditCard,
  Calculator,
  Users,
  Clock,
  FileSearch,
  HelpCircle,
  Scale
} from "lucide-react";
import { Link } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import type { ChatMessage, ChatSession, MedicalBill } from "@shared/schema";
import logoUrl from "@assets/ChatGPT_Image_Sep_4__2025__05_43_07_PM-removebg-preview_1757029452527.png";
import { 
  DisputeLetterGenerator, 
  NegotiationScriptGenerator, 
  ErrorDetectionChecklist, 
  BillingRightsAdvisor, 
  ClaimAppealGenerator 
} from "@/components/bill-ai-features";
import { BillAnalysisLoader } from "@/components/BillAnalysisLoader";
import { SmartActionBubbles } from "@/components/SmartActionBubbles";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export default function BillAI() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<AIMessage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showMorePrompts, setShowMorePrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user's bills for quick access
  const { data: userBills = [] } = useQuery<MedicalBill[]>({
    queryKey: ["/api/medical-bills"],
    enabled: !!user,
  });

  // Send message function using the working medical chat API
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
    
    // Send to the working medical chat API
    try {
      const response = await apiRequest("POST", "/api/medical-chat", {
        message: content.trim()
      });

      const data = await response.json();

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm here to help with medical bill questions. Please ask me about billing errors, negotiation strategies, or cost reduction techniques.",
        createdAt: new Date(),
      };

      setLocalMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    } catch (error: any) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
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
  const uploadBillMutation = useMutation({
    mutationFn: async (files: File[]) => {
      console.log('Mutation called with files:', files.length);
      const formData = new FormData();
      
      // Add all files to FormData
      files.forEach((file, index) => {
        console.log(`Adding file ${index + 1}:`, file.name, file.type, file.size);
        formData.append("bills", file);
      });
      formData.append("sessionId", "bill-ai-session");
      
      console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => 
        [key, value instanceof File ? `${value.name} (${value.type})` : value]
      ));
      
      const response = await fetch("/api/upload-bills", {
        method: "POST",
        body: formData,
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
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
        
        // Add AI analysis as a message in the chat if available
        const analysisMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: data.analysis ? 
            `🔍 **COMPREHENSIVE BILL ANALYSIS COMPLETE**\n\n${data.analysis}` :
            `✅ **BILL IMAGES UPLOADED SUCCESSFULLY**\n\nYour medical bill images have been uploaded and saved. Use the features above to analyze them for billing errors and savings opportunities.`,
          createdAt: new Date(),
        };
        
        setLocalMessages(prev => [...prev, uploadMessage, analysisMessage]);
        setConversationStarted(true);
        
        // Show success toast
        toast({
          title: `${data.fileCount || 1} Bill Image${data.fileCount > 1 ? 's' : ''} Uploaded`,
          description: data.message || "Your bill images have been uploaded and analyzed.",
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
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
    
    console.log('Files selected:', files.length, Array.from(files).map(f => f.name));
    
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

    console.log('Starting upload with files:', files.length);
    setUploadingFiles(true);
    setUploadProgress({current: 0, total: files.length});
    
    // Convert FileList to Array to prevent it from becoming stale
    const fileArray = Array.from(files);
    console.log('Converted to array:', fileArray.length, fileArray.map(f => f.name));
    
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getEstimatedSavings = () => {
    return userBills.reduce((total: number, bill: MedicalBill) => {
      return total + (Number(bill.totalAmount) * 0.3); // Estimate 30% savings potential
    }, 0);
  };

  const quickActions = [
    {
      icon: Upload,
      label: "Upload Medical Bill",
      desc: "Find $1K-$100K+ in savings",
      color: "emerald",
      action: () => fileInputRef.current?.click(),
    },
    {
      icon: AlertTriangle,
      label: "Find Billing Errors",
      desc: "Detect common overcharges",
      color: "red",
      action: () => setActiveFeature('error-detection'),
    },
    {
      icon: DollarSign,
      label: "Get Itemized Bill",
      desc: "Essential first step to savings",
      color: "green",
      action: () => sendMessage("Help me request an itemized bill from my hospital. What should I ask for and how do I get the most detailed breakdown of charges?"),
    },
    {
      icon: FileText,
      label: "Dispute Letter & Templates",
      desc: "Professional appeal templates",
      color: "blue",
      action: () => setActiveFeature('dispute-letter'),
    }
  ];

  return (
    <MobileLayout 
      title="Medical Bill AI" 
      showBackButton={true}
      showBottomNav={true}
    >
      <div className="flex flex-col h-full">
        {/* Loading Animation Overlay */}
        <BillAnalysisLoader 
          fileCount={uploadProgress.total} 
          isVisible={uploadingFiles && uploadProgress.total > 0} 
        />

        {/* Compact Stats Bar */}
        {userBills.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 mx-3 rounded-2xl mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{userBills.length}</div>
                <div className="text-xs text-gray-600">Bills</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(getEstimatedSavings())}</div>
                <div className="text-xs text-gray-600">Potential</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">AI</div>
                <div className="text-xs text-gray-600">Powered</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feature Components */}
        {activeFeature && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setActiveFeature(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </div>
            
            {activeFeature === 'dispute-letter' && <DisputeLetterGenerator onSendMessage={sendMessage} />}
            {activeFeature === 'negotiation-script' && <NegotiationScriptGenerator onSendMessage={sendMessage} />}
            {activeFeature === 'error-detection' && <ErrorDetectionChecklist onSendMessage={sendMessage} />}
            {activeFeature === 'billing-rights' && <BillingRightsAdvisor onSendMessage={sendMessage} />}
            {activeFeature === 'claim-appeal' && <ClaimAppealGenerator onSendMessage={sendMessage} />}
          </div>
        )}

        {/* Chat Messages Area */}
        {!activeFeature && (
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Feature Access Buttons */}
            {conversationStarted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-4"
              >
                <p className="text-sm font-medium text-gray-700 mb-3">🛠️ Advanced Tools:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveFeature('billing-rights')}
                    className="text-xs h-8"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Rights Advisor
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveFeature('claim-appeal')}
                    className="text-xs h-8"
                  >
                    <FileEdit className="h-3 w-3 mr-1" />
                    Insurance Appeal
                  </Button>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence>
            {!conversationStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-4"
              >
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="h-6 w-6 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Save Thousands on Medical Bills
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed px-4">
                  I find billing errors and overcharges that cost you thousands. Let's reduce your medical costs together.
                </p>
                
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2 px-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <Card 
                          className="p-3 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-200"
                          onClick={action.action}
                          data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="text-center">
                            <div className={`w-10 h-10 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-xs mb-1 leading-tight">{action.label}</h4>
                            <p className="text-xs text-gray-600 leading-tight">{action.desc}</p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Compact Negotiation Strategy Box */}
                <motion.div 
                  className="mt-3 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Card 
                    className="p-2 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50"
                    onClick={() => setActiveFeature('negotiation-script')}
                    data-testid="negotiation-strategy-card"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-xs">Negotiation Strategy</h4>
                        <p className="text-xs text-gray-600">Expert reduction tactics</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                {/* Show More Button */}
                <motion.div 
                  className="mt-3 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowMorePrompts(!showMorePrompts)}
                    className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-2xl h-8"
                    data-testid="show-more-prompts"
                  >
                    <span className="text-xs font-medium">Show More Expert Prompts</span>
                    {showMorePrompts ? (
                      <ChevronUp className="h-3 w-3 ml-2" />
                    ) : (
                      <ChevronDown className="h-3 w-3 ml-2" />
                    )}
                  </Button>
                </motion.div>

                {/* Advanced Prompts Dropdown */}
                <AnimatePresence>
                  {showMorePrompts && (
                    <motion.div 
                      className="mt-2 px-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        {/* Insurance & Coverage */}
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => sendMessage("Guide me through accessing my insurance portal step-by-step. I need to download my Explanation of Benefits (EOB), check my coverage details, and find my claims history. What specific steps should I take for major insurers like Blue Cross, Aetna, UnitedHealth, or Kaiser?")}
                            className="text-left p-3 h-auto rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-xs"
                            data-testid="insurance-portal-guide"
                          >
                            <div className="flex items-start gap-2">
                              <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Insurance Portal Navigation</div>
                                <div className="text-gray-600 mt-1">Step-by-step guide to access EOBs, claims, coverage details</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("My insurance denied my claim. Walk me through the complete appeals process: What documents do I need? What are the deadlines? How do I write a compelling appeal letter? What medical records should I request? Give me the exact timeline and strategy for a successful insurance appeal.")}
                            className="text-left p-3 h-auto rounded-xl border border-red-200 hover:border-red-300 hover:bg-red-50 text-xs"
                            data-testid="insurance-appeal-process"
                          >
                            <div className="flex items-start gap-2">
                              <Scale className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Insurance Appeal Mastery</div>
                                <div className="text-gray-600 mt-1">Complete appeals process, deadlines, documents, strategies</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("Analyze my out-of-network charges. How do I calculate what insurance should have paid based on usual and customary rates? What's the difference between balance billing and legitimate charges? Give me specific negotiation tactics for out-of-network provider bills and how to use Medicare rates as leverage.")}
                            className="text-left p-3 h-auto rounded-xl border border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-xs"
                            data-testid="out-of-network-analysis"
                          >
                            <div className="flex items-start gap-2">
                              <Calculator className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Out-of-Network Bill Analysis</div>
                                <div className="text-gray-600 mt-1">Calculate fair rates, balance billing protection, negotiation tactics</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("Create a comprehensive payment negotiation strategy. What's the best timing to call? Which departments should I contact first? How do I leverage financial hardship programs, charity care, and prompt-pay discounts? Give me specific scripts for negotiating with billing departments, including psychological tactics that work.")}
                            className="text-left p-3 h-auto rounded-xl border border-green-200 hover:border-green-300 hover:bg-green-50 text-xs"
                            data-testid="payment-negotiation-strategy"
                          >
                            <div className="flex items-start gap-2">
                              <CreditCard className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Advanced Payment Negotiation</div>
                                <div className="text-gray-600 mt-1">Scripts, timing, hardship programs, charity care applications</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("Help me understand medical coding errors that inflate bills. What are the most common upcoding scenarios? How do I identify when procedures are unbundled illegally? What CPT and DRG codes should I question? Give me a checklist to audit my medical bills for coding fraud and overcharges.")}
                            className="text-left p-3 h-auto rounded-xl border border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-xs"
                            data-testid="medical-coding-audit"
                          >
                            <div className="flex items-start gap-2">
                              <FileSearch className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Medical Coding Fraud Detection</div>
                                <div className="text-gray-600 mt-1">Identify upcoding, unbundling, CPT errors, audit checklist</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("I need help with hospital financial assistance. What documents do I need for charity care applications? How do I calculate my income properly? What are hospitals legally required to offer? Give me state-by-state differences in charity care laws and specific application strategies for major hospital systems.")}
                            className="text-left p-3 h-auto rounded-xl border border-teal-200 hover:border-teal-300 hover:bg-teal-50 text-xs"
                            data-testid="charity-care-application"
                          >
                            <div className="flex items-start gap-2">
                              <Users className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Charity Care & Financial Aid</div>
                                <div className="text-gray-600 mt-1">Application process, required documents, legal requirements</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("Create a timeline-based action plan for my medical debt. What should I do in the first 24 hours, first week, first month? When do bills typically go to collections? How do I prioritize multiple medical bills? Give me a strategic roadmap with specific deadlines and actions to maximize my savings.")}
                            className="text-left p-3 h-auto rounded-xl border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-xs"
                            data-testid="medical-debt-timeline"
                          >
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Medical Debt Action Timeline</div>
                                <div className="text-gray-600 mt-1">24-hour to 6-month strategic roadmap, deadlines, priorities</div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => sendMessage("Help me understand my rights under medical billing laws. What protections do I have against surprise billing? How does the No Surprises Act affect my situation? What are my rights for emergency care billing? Give me state and federal law summaries that protect patients from unfair medical billing practices.")}
                            className="text-left p-3 h-auto rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs"
                            data-testid="patient-rights-laws"
                          >
                            <div className="flex items-start gap-2">
                              <HelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-900">Patient Rights & Legal Protection</div>
                                <div className="text-gray-600 mt-1">No Surprises Act, state laws, emergency care protections</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Security Notice */}
                <motion.div 
                  className="mt-4 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <span>Secure • Private • Exceeds HIPAA Standards</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Chat Messages */}
            {localMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-md" 
                    : "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-sm"
                } p-4`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-emerald-600">AI Expert</span>
                    </div>
                  )}
                  <p className={`text-sm whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-gray-900"}`}>
                    {message.content}
                  </p>
                  
                  {/* Smart Action Bubbles for AI responses */}
                  {message.role === "assistant" && (
                    <SmartActionBubbles
                      context={(activeFeature as 'dispute-letter' | 'negotiation-script' | 'error-detection' | 'billing-rights' | 'claim-appeal') || 'general'}
                      aiResponse={message.content}
                      onSendMessage={sendMessage}
                    />
                  )}
                  
                  <div className={`text-xs mt-2 ${message.role === "user" ? "text-emerald-100" : "text-gray-500"}`}>
                    {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-sm p-4 max-w-[85%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-emerald-600">AI Expert</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-gray-600">Analyzing your question...</span>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping || uploadingFiles}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl w-10 h-10 p-0 border border-gray-300"
              data-testid="button-attach"
            >
              {uploadingFiles ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {uploadProgress.total > 0 && (
                    <span className="text-xs">{uploadProgress.current}/{uploadProgress.total}</span>
                  )}
                </div>
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask how to find thousands in overcharges..."
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="pr-12 rounded-2xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-10 text-sm"
                data-testid="input-message"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl w-10 h-10 p-0 shadow-lg"
              data-testid="button-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            data-testid="file-input"
          />
          
          {/* AI Disclaimer */}
          <div className="mt-1 px-1">
            <p className="text-xs text-gray-500 text-center">
              ⚠️ This is Generative AI - consult a professional
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}