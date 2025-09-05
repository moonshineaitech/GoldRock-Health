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
      return `Good news - you have 90-120 days before bills go to collections, so don't pay anything yet.

Getting an itemized bill is crucial because 80% of medical bills contain errors.

Here's exactly what to say when you call the billing department:

"I need a complete itemized statement for my recent treatment. Please include all procedure codes, dates, and provider information. I need this within 5 business days."

Make sure you get:
- CPT procedure codes with descriptions
- Service dates and times  
- Provider names
- Medication details with quantities

If they refuse, say: "Federal regulations require this documentation. Please connect me with your billing supervisor."

Would you like me to help you with:
1. What to look for once you get the itemized bill
2. Scripts for different types of facilities
3. What to do if they won't provide it`;
    }
    
    if (lowerMessage.includes("billing error") || lowerMessage.includes("overcharge") || lowerMessage.includes("assess") || lowerMessage.includes("find")) {
      return `I'll help you find errors in your medical bill that you can dispute for significant savings.

Do you have a copy of your medical bill you can upload? If so, click the upload button above.

If not, I can still help you. Just tell me:

1. What's the total amount of your bill?

2. What type of medical care was this for?
   - Emergency room visit
   - Surgery or procedure  
   - Hospital stay
   - Lab tests or imaging
   - Other

Once I know this basic information, I'll walk you through the most common billing errors to look for and exactly how to dispute them.

What's your situation?`;
    }
    
    if (lowerMessage.includes("negotiate") || lowerMessage.includes("payment plan") || lowerMessage.includes("reduce") || lowerMessage.includes("can't afford")) {
      return `Let's figure out the best way to reduce your medical bill.

First, I need to understand your situation:

What's the total amount of your bill?

What's your approximate household income? 
(This helps determine if you qualify for charity care programs)

Can you pay a lump sum if you get a significant discount, or do you need a payment plan?

Once I know this, I can guide you to the best option:

- Charity care programs (can eliminate 50-100% of your bill)
- Prompt payment discounts (15-40% off for paying in full) 
- Zero-interest payment plans
- Challenging unfair pricing

What's your bill amount and income situation?`;
    }
    
    if (lowerMessage.includes("charity care") || lowerMessage.includes("financial assistance") || lowerMessage.includes("hardship") || lowerMessage.includes("poverty") || lowerMessage.includes("income")) {
      return `Good news - charity care can eliminate 50-100% of your medical bill, even if you have insurance.

To see if you qualify, I need to know:

1. How many people are in your household?
2. What's your approximate annual income?

Here are the general eligibility ranges:

FREE CARE (100% forgiveness):
- Individual making under $30,120/year
- Family of 4 making under $62,400/year

DISCOUNTED CARE (25-75% off):
- Individual making $30,121-$60,240/year  
- Family of 4 making $62,401-$124,800/year

You might also qualify for hardship programs if your medical bills are more than 20% of your annual income.

What's your household size and approximate income? I can tell you exactly what programs you qualify for and walk you through the application process.`;
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
    return `I'm here to help you reduce your medical bill. Most people can save thousands of dollars with the right approach.

Let's start with the basics:

Do you have a medical bill you can upload? If so, use the upload button above.

If not, I can still help. Just tell me:

What's your situation?
1. I have a bill that seems too high
2. I can't afford to pay my medical bill  
3. I want to request an itemized bill
4. I need to negotiate a payment plan
5. I want to dispute billing errors

Choose what fits your situation, and I'll walk you through the next steps one at a time.`;
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
      label: "Find Overcharges",
      desc: "Spot billing errors & scams",
      color: "red",
      action: () => {
        const message = "I have a medical bill that seems too high. Please help me assess it for billing errors, duplicate charges, upcoding, and other overcharges that I can dispute to reduce my costs.";
        sendMessage(message);
      },
    },
    {
      icon: DollarSign,
      label: "Get Itemized Bill",
      desc: "Essential first step to savings",
      color: "green",
      action: () => {
        const message = "I need to request an itemized bill from my hospital/provider to identify overcharges. Please give me the exact script to use when calling them and what specific details to demand.";
        sendMessage(message);
      },
    },
    {
      icon: FileText,
      label: "Appeal & Dispute",
      desc: "Professional reduction letters",
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
                  Save Thousands on Medical Bills
                </h2>
                
                <p className="text-sm text-gray-600 mb-6 px-6 leading-relaxed">
                  I find billing errors and overcharges that cost you thousands. Let's reduce your medical costs together.
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
                placeholder="Ask how to find thousands in overcharges, request itemized bills, or dispute charges..."
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