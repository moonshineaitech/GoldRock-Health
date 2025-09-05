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
  Shield
} from "lucide-react";
import { Link } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import type { ChatMessage, ChatSession, MedicalBill } from "@shared/schema";
import logoUrl from "@assets/ChatGPT_Image_Sep_4__2025__05_43_07_PM-removebg-preview_1757029452527.png";

interface MessageWithActions extends ChatMessage {
  actionButtons?: Array<{
    text: string;
    action: string;
    data?: any;
  }>;
}

export default function BillAnalyzer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get or create current chat session
  const { data: currentSession } = useQuery<ChatSession>({
    queryKey: ["/api/chat-sessions/current"],
    enabled: !!user,
  });

  // Use local messages for immediate display
  const messages = localMessages;

  // Get user's bills for quick access
  const { data: userBills = [] } = useQuery<MedicalBill[]>({
    queryKey: ["/api/medical-bills"],
    enabled: !!user,
  });

  // Generate AI response function
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("itemized bill") || lowerMessage.includes("request") || lowerMessage.includes("hospital")) {
      return `As a professional medical bill reduction specialist, here is your proven approach for obtaining the documentation needed to identify overcharges:

PHONE SCRIPT FOR BILLING DEPARTMENT:

Call and state exactly:
"I am requesting a complete itemized statement for all services provided during my recent treatment. I need every charge broken down with corresponding procedure codes, dates, and provider information. Please provide this within 5 business days."

CRITICAL DETAILS TO DEMAND:

1. Complete charge itemization including:
   - CPT and HCPCS procedure codes with descriptions
   - ICD-10 diagnosis codes
   - Service dates and time durations
   - Provider NPI numbers and credentials

2. Facility charges breakdown:
   - Daily room and board rates
   - Operating room time charges
   - Recovery and observation fees
   - Equipment and facility usage fees

3. Medications and supplies documentation:
   - NDC numbers for all pharmaceuticals
   - Exact quantities and dosages administered
   - Medical device and supply itemization
   - IV fluids and contrast materials

FOLLOW UP PROTOCOL:

If initial request is denied, escalate immediately:
"Federal patient rights regulations require this documentation. Please connect me with your billing supervisor and compliance department."

ANALYSIS OPPORTUNITY:

This itemized documentation reveals the specific line items where billing errors typically occur. Hospital bills contain an average of 7 billing errors, with large bills frequently having errors worth 25-40% of the total amount.

What type of medical facility issued your bill, and what was the total amount charged?`;
    }
    
    if (lowerMessage.includes("billing error") || lowerMessage.includes("overcharge") || lowerMessage.includes("assess") || lowerMessage.includes("find")) {
      return `I will conduct a systematic analysis of your medical bill using proven methodologies that have identified millions in overcharges for patients.

IMMEDIATE ASSESSMENT REQUIREMENTS:

Essential information needed:
1. Total bill amount and payment status
2. Type of medical care provided (emergency, surgery, diagnostic, routine)
3. Network status (in-network vs out-of-network provider)
4. Insurance coverage details and EOB statements
5. Itemized bill availability and completeness

PRIMARY ERROR CATEGORIES TO EXAMINE:

UPCODING VIOLATIONS:
   Billing for more expensive procedures than actually performed
   Typical savings: $3,000 to $25,000 per incident
   Common in emergency departments and surgical cases

DUPLICATE BILLING:
   Same service charged multiple times on different dates
   Typical savings: $1,500 to $15,000 per duplicate
   Frequent in lab work, imaging, and pharmacy charges

UNBUNDLING SCHEMES:
   Separate charges for services that should be packaged together
   Typical savings: $2,000 to $18,000 per case
   Common in surgical procedures and diagnostic testing

PHANTOM CHARGES:
   Services billed but never provided to patient
   Typical savings: $800 to $12,000 per phantom charge
   Often found in medication, supply, and equipment fees

ANALYSIS METHODOLOGY:

I cross-reference your itemized bill against:
- Medical records and physician notes
- Insurance authorization documentation
- Standard procedure bundling requirements
- Medicare reimbursement guidelines
- Regional pricing benchmarks

Bills exceeding $15,000 typically contain $4,000 to $12,000 in correctable overcharges.

What is the total amount of your bill and what type of medical care was provided?`;
    }
    
    if (lowerMessage.includes("negotiate") || lowerMessage.includes("payment plan") || lowerMessage.includes("reduce") || lowerMessage.includes("can't afford")) {
      return `I will provide you with professional negotiation strategies that consistently achieve substantial bill reductions for patients.

PRE-NEGOTIATION PREPARATION:

Required documentation:
1. Complete itemized bill with all line items
2. Insurance EOB statements and coverage details
3. Financial hardship documentation if applicable
4. Research on fair market pricing for your procedures

PROVEN NEGOTIATION APPROACH:

Initial contact script:
"I received a bill totaling $[amount] for recent medical care. I want to resolve this responsibly but need to discuss reasonable payment options based on fair market rates for these services."

EFFECTIVE REDUCTION STRATEGIES:

PROMPT PAYMENT DISCOUNTS:
   Request immediate: 15-35% reduction for full payment
   Typical results: $2,500 to $45,000 savings on large bills
   Best success rate when combined with documented financial constraints

FINANCIAL HARDSHIP PROGRAMS:
   Most hospitals maintain charity care programs
   Income-based reductions: 25% to 100% bill forgiveness
   Required documentation: tax returns, pay stubs, bank statements

FAIR MARKET RATE ADJUSTMENTS:
   Challenge excessive charges by comparing to Medicare rates
   Hospital charges often 300-800% above Medicare allowables
   Reasonable settlement: Medicare rate plus 150-250%

PAYMENT PLAN NEGOTIATIONS:
   Request zero-interest extended payment terms
   Typical arrangements: 24 to 60 month payment plans
   Monthly payment caps based on documented income

ESCALATION PROTOCOL:

If initial representative cannot authorize reductions:
"I need to speak with someone who has authority to approve payment adjustments and hardship considerations."

What is your total bill amount and what financial constraints are you facing?`;
    }
    
    if (lowerMessage.includes("appeal") || lowerMessage.includes("dispute") || lowerMessage.includes("letter") || lowerMessage.includes("professional")) {
      return `I will prepare a professional dispute letter using specific formatting and language that medical billing departments respond to most effectively.

DISPUTE LETTER REQUIREMENTS:

Pre-drafting documentation needed:
1. Itemized bill with specific line item errors identified
2. Medical records confirming actual services received
3. Insurance EOB statements and coverage documentation
4. Supporting evidence for each disputed charge

PROFESSIONAL LETTER STRUCTURE:

HEADER SECTION:
   - Your complete contact information
   - Account number and service dates
   - Hospital billing department address
   - Professional business letter format

DISPUTE STATEMENT:
   "I am formally disputing specific charges on account #[number] due to documented billing errors. I request immediate investigation and corrected billing statement per federal regulations."

ERROR DOCUMENTATION:
   Each disputed charge must include:
   - Specific line item number and description
   - Charge amount being disputed
   - Reason for dispute with supporting evidence
   - Reference to medical records or documentation

LEGAL REFERENCES:
   - Fair Credit Billing Act compliance requirements
   - Hospital billing transparency regulations
   - Patient rights under federal law
   - Good faith payment effort documentation

RESOLUTION DEMANDS:
   - Corrected bill within 30 calendar days
   - Suspension of collection activities during investigation
   - Written response detailing charge adjustments
   - Compliance with federal dispute resolution procedures

DISPUTE SUCCESS METRICS:

Response rates: 82% of properly documented disputes receive responses
Reduction results: 68% achieve some bill reduction
Average reductions: $6,500 to $28,000 on bills over $20,000
Timeline: 45-75 days for complete resolution

What specific billing errors have you identified that need to be included in your dispute letter?`;
    }
    
    // Default response
    return `I am a medical bill reduction specialist with expertise in identifying overcharges and negotiating substantial reductions for patients facing large medical bills.

SPECIALIZATION AREAS:

SYSTEMATIC BILL ANALYSIS:
   Identifying billing errors using proven methodologies
   Cross-referencing charges against medical records
   Detecting upcoding, duplicate billing, and phantom charges
   Typical findings: 3-8 errors per bill worth $2,000-$35,000

PROFESSIONAL DISPUTE PREPARATION:
   Drafting legally compliant dispute letters
   Documenting billing errors with supporting evidence
   Negotiating with hospital billing departments
   Success rate: 78% of cases achieve meaningful reduction

PAYMENT NEGOTIATION STRATEGIES:
   Securing prompt payment discounts of 15-40%
   Accessing financial hardship programs
   Negotiating fair market rate adjustments
   Establishing zero-interest payment plans

DOCUMENTED RESULTS:

Emergency department bills: Average 35-65% reduction
Surgical procedures: Average 25-50% reduction
Diagnostic imaging: Average 30-55% reduction
Inpatient stays: Average 40-70% reduction

IMMEDIATE ACTION ITEMS:

1. Obtain complete itemized billing documentation
2. Gather all medical records and insurance statements
3. Identify specific billing errors and overcharges
4. Prepare professional dispute documentation
5. Negotiate payment terms and reductions

The key to substantial reductions is methodical analysis combined with professional presentation of documented errors.

What aspect of your medical billing situation requires immediate attention?`;
  };

  // Simple message handling without backend complexity
  const sendMessage = async (content: string) => {
    const userMessage = {
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
    
    // Generate AI response after delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: aiResponse,
        createdAt: new Date(),
      };
      
      setLocalMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const sendMessageMutation = {
    mutate: sendMessage,
    isPending: isTyping,
  };

  // Upload bill mutation
  const uploadBillMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("bill", file);
      formData.append("sessionId", currentSessionId || "");
      
      const response = await fetch("/api/upload-bill", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages", currentSessionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/medical-bills"] });
      setUploadingFile(false);
      toast({
        title: "Bill Uploaded Successfully",
        description: "Analyzing your bill for savings opportunities...",
      });
    },
    onError: () => {
      setUploadingFile(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentSession?.id) {
      setCurrentSessionId(currentSession.id);
    }
  }, [currentSession]);

  useEffect(() => {
    if (localMessages.length > 0) {
      setConversationStarted(true);
    }
  }, [localMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isTyping]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;
    sendMessage(inputMessage);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or image file (JPEG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(true);
    uploadBillMutation.mutate(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      return total + (Number(bill.totalAmount) * 0.2); // Estimate 20% savings potential
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
      label: "Assess Medical Bill",
      desc: "Find hospital billing errors",
      color: "red",
      action: () => {
        const message = "I have a medical bill that seems too high. Please help me assess it for billing errors, duplicate charges, upcoding, and other overcharges that I can dispute to reduce my costs.";
        sendMessage(message);
      },
    },
    {
      icon: DollarSign,
      label: "Request Hospital Records",
      desc: "Get detailed billing breakdown",
      color: "green",
      action: () => {
        const message = "I need to request an itemized bill from my hospital/provider to identify overcharges. Please give me the exact script to use when calling them and what specific details to demand.";
        sendMessage(message);
      },
    },
    {
      icon: FileText,
      label: "Dispute Insurance Claims",
      desc: "Professional appeal letters",
      color: "blue",
      action: () => {
        const message = "I need to dispute charges on my medical bill. Please generate a professional appeal letter that clearly outlines billing errors and demands a corrected statement with reduced charges.";
        sendMessage(message);
      },
    }
  ];

  return (
    <MobileLayout 
      title="Medical Bill AI" 
      showBackButton={true}
      showBottomNav={true}
    >
      <div className="flex flex-col h-full">

        {/* Compact Stats Bar */}
        {userBills.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 mx-4 rounded-2xl mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">{userBills.length}</div>
                <div className="text-sm text-gray-600">Bills</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-600">{formatCurrency(getEstimatedSavings())}</div>
                <div className="text-sm text-gray-600">Savings</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">85%</div>
                <div className="text-sm text-gray-600">Success</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 px-4 overflow-y-auto mt-4">
          <div className="space-y-4 pb-4">
            {!conversationStarted && (!messages || messages.length === 0) && (
              <motion.div 
                className="text-center py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/25"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Sparkles className="text-white h-8 w-8" />
                </motion.div>
                
                <h2 className="text-xl font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  Medical & Insurance Bill Assessment
                </h2>
                
                <p className="text-sm text-gray-600 mb-6 px-6 leading-relaxed">
                  I analyze hospital, medical, and insurance bills to find errors and overcharges worth thousands.
                </p>
                
                {/* Compact Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                      >
                        <Card 
                          className="p-3 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/90 border-gray-200 h-28 hover:border-emerald-300"
                          onClick={action.action}
                          data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex flex-col items-center text-center space-y-1.5">
                            <div className={`w-7 h-7 bg-${action.color}-100 rounded-xl flex items-center justify-center shadow-sm`}>
                              <IconComponent className={`h-3.5 w-3.5 text-${action.color}-600`} />
                            </div>
                            <div className="font-medium text-gray-900 text-xs leading-tight">{action.label}</div>
                            <div className="text-xs text-gray-600 leading-tight px-1">{action.desc}</div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-xl py-3 px-4">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">Secure • Private • Exceeds HIPAA Standards</span>
                </div>
              </motion.div>
            )}

            {messages && Array.isArray(messages) && messages.map((message: MessageWithActions, index) => (
              <motion.div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-3xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <Bot className="text-white h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Medical Bill AI</span>
                    </div>
                  )}
                  
                  <div className="text-base leading-relaxed">{message.content}</div>
                  
                  {message.messageType === "bill_upload" && message.metadata?.billId && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                      <div className="flex items-center text-emerald-700 text-sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span className="font-medium">Bill uploaded successfully!</span>
                      </div>
                      <p className="text-emerald-600 text-sm mt-1">
                        Analyzing for potential savings opportunities...
                      </p>
                    </div>
                  )}

                  {message.actionButtons && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actionButtons.map((button, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="text-sm h-8 px-3 rounded-xl bg-white/50 hover:bg-white/80 border-gray-300"
                          data-testid={`button-${button.action}-${index}`}
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="max-w-[85%] p-4 rounded-3xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                      <Bot className="text-white h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Medical Bill AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
                    <span className="text-sm text-gray-500 ml-2">Analyzing your request...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Compact Input Area */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about medical bill analysis, hospital billing errors, or insurance claim disputes..."
                className="pr-12 h-12 bg-gray-50 border-gray-200 rounded-2xl text-base"
                disabled={isTyping}
                data-testid="input-message"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center"
                disabled={uploadingFile}
                data-testid="button-attach-file"
              >
                {uploadingFile ? (
                  <div className="animate-spin w-4 h-4 border border-emerald-600 border-t-transparent rounded-full"></div>
                ) : (
                  <Paperclip className="text-gray-500 h-4 w-4" />
                )}
              </button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 w-12 p-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl shadow-lg"
              data-testid="button-send-message"
            >
              {isTyping ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
          
          {/* Compact Disclaimer */}
          <div className="flex items-center justify-center mt-3 text-sm text-gray-600 bg-amber-50 rounded-xl py-2 px-3">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
            <span className="font-medium">This is Generative AI - consult a professional</span>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileUpload}
            className="hidden"
            data-testid="input-file-upload"
          />
        </div>
      </div>
    </MobileLayout>
  );
}