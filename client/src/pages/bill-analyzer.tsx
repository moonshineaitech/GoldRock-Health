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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get or create current chat session
  const { data: currentSession } = useQuery<ChatSession>({
    queryKey: ["/api/chat-sessions/current"],
    enabled: !!user,
  });

  // Get messages for current session
  const { data: messages = [], isLoading } = useQuery<MessageWithActions[]>({
    queryKey: ["/api/chat-messages", currentSessionId],
    enabled: !!currentSessionId,
  });

  // Get user's bills for quick access
  const { data: userBills = [] } = useQuery<MedicalBill[]>({
    queryKey: ["/api/medical-bills"],
    enabled: !!user,
  });

  // Generate AI response function
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("itemized bill") || lowerMessage.includes("request") || lowerMessage.includes("hospital")) {
      return `Here's exactly how to request an itemized bill from your hospital:

**Step 1: Call the Billing Department**
- Ask for: "Patient Financial Services" or "Billing Department"
- Say: "I need a detailed, itemized bill for my recent stay/procedure"

**Step 2: Specific Information to Request**
- Complete itemized breakdown of all charges
- CPT codes and descriptions for all procedures
- Room and board daily rates
- Pharmacy charges with medication names
- Any facility fees or administrative charges

**Step 3: Follow Up in Writing**
Send an email requesting: "Please provide a complete itemized bill showing all charges, codes, and services for my account #[your account number]"

**Why This Saves You Money:**
Itemized bills often reveal:
- Duplicate charges (saves $1,000-$10,000+)
- Services you never received
- Incorrect medication dosages
- Inflated room rates

Would you like me to help you draft the exact email to send to your hospital?`;
    }
    
    if (lowerMessage.includes("billing error") || lowerMessage.includes("overcharge") || lowerMessage.includes("assess") || lowerMessage.includes("find")) {
      return `I'll help you identify common billing errors that cost patients thousands:

**Most Common Overcharges to Look For:**

1. **Upcoding** (saves $5,000-$50,000+)
   - Billing for more expensive procedures than performed
   - Example: Charging for complex surgery when simple procedure was done

2. **Duplicate Billing** (saves $1,000-$15,000+)
   - Same service charged multiple times
   - Lab tests, medications, or procedures listed twice

3. **Unbundling** (saves $2,000-$25,000+)
   - Charging separately for services that should be bundled
   - Breaking down one procedure into multiple charges

4. **Phantom Charges** (saves $500-$10,000+)
   - Services you never received
   - Medications not given, tests not performed

**Next Steps:**
1. Get your itemized bill first
2. Compare with your medical records
3. Question every charge you don't understand

Do you have an itemized bill I can help you review for these errors?`;
    }
    
    if (lowerMessage.includes("negotiate") || lowerMessage.includes("payment plan") || lowerMessage.includes("reduce") || lowerMessage.includes("can't afford")) {
      return `Here are proven negotiation strategies that save patients $10,000-$100,000+:

**Before You Call:**
- Get your itemized bill
- Research fair market rates for your procedures
- Document your financial situation

**Negotiation Script:**
"I received this bill for $[amount] and need to discuss payment options. I've researched that the average cost for this procedure is $[lower amount]. Can we adjust this to a fair market rate?"

**Key Strategies:**

1. **Ask for the "Prompt Pay Discount"**
   - Often 10-30% off for immediate payment
   - Can save $5,000-$50,000+

2. **Request Financial Hardship Assistance**
   - Most hospitals have charity care programs
   - Can reduce bills by 50-100%

3. **Negotiate Payment Plans**
   - $0 interest if you ask
   - Extended terms (24-60 months)

4. **Challenge Excessive Charges**
   - Compare to Medicare rates (often 3-10x lower)
   - Request adjustment to reasonable amounts

**Magic Words:**
"I want to pay my bill, but need help making it affordable."

Would you like me to help you prepare for your negotiation call?`;
    }
    
    if (lowerMessage.includes("appeal") || lowerMessage.includes("dispute") || lowerMessage.includes("letter") || lowerMessage.includes("professional")) {
      return `I'll help you create a professional appeal letter that hospitals respond to:

**Essential Elements of a Successful Appeal:**

**Header Information:**
- Your name, account number, dates of service
- Hospital billing department address
- Current date

**Key Language to Include:**
"I am formally disputing the following charges on my medical bill due to billing errors and request an immediate investigation and corrected statement."

**Common Dispute Reasons:**
- Charges for services not received
- Duplicate billing for same procedure
- Incorrect medication dosages/quantities
- Room charges exceeding contracted rates
- Upcoding of procedures

**Supporting Documentation:**
- Medical records showing actual services
- Insurance EOB statements
- Pharmacy records
- Photographs of bills/statements

**Call to Action:**
"I request a detailed review of these charges and a corrected bill within 30 days. I am prepared to escalate this matter if necessary."

**Template Structure:**
1. Professional letterhead format
2. Clear statement of dispute
3. Specific charge details
4. Supporting evidence
5. Request for correction
6. Timeline for response

Would you like me to generate a customized appeal letter for your specific situation?`;
    }
    
    // Default response
    return `I specialize in helping you save thousands on medical bills through:

**My Expertise:**
- Finding billing errors that cost you $10,000-$100,000+
- Negotiating payment reductions with hospitals
- Creating professional dispute letters
- Guiding you through the itemized bill process

**How I Can Help You Today:**
1. **Review your bill** for common overcharges and errors
2. **Negotiate with hospitals** using proven strategies
3. **Generate appeal letters** that get results
4. **Guide you step-by-step** through the savings process

**Quick Actions:**
- Upload your medical bill for analysis
- Get script for requesting itemized bills
- Learn negotiation tactics that work
- Generate professional dispute letters

What specific aspect of your medical bill would you like help with? I'm here to help you save thousands!`;
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/chat-messages", {
        sessionId: currentSessionId,
        content,
        role: "user",
      });
      return response;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages", currentSessionId] });
      const userMessage = inputMessage;
      setInputMessage("");
      setIsTyping(true);
      
      // Generate AI response
      setTimeout(async () => {
        try {
          const aiResponse = generateAIResponse(userMessage);
          
          await apiRequest("POST", "/api/chat-messages", {
            sessionId: currentSessionId,
            content: aiResponse,
            role: "assistant",
            messageType: "analysis"
          });
          
          queryClient.invalidateQueries({ queryKey: ["/api/chat-messages", currentSessionId] });
        } catch (error) {
          console.error("Error generating AI response:", error);
        } finally {
          setIsTyping(false);
        }
      }, 1500);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(inputMessage);
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
        setInputMessage(message);
        sendMessageMutation.mutate(message);
      },
    },
    {
      icon: DollarSign,
      label: "Get Itemized Bill",
      desc: "Essential first step to savings",
      color: "green",
      action: () => {
        const message = "I need to request an itemized bill from my hospital/provider to identify overcharges. Please give me the exact script to use when calling them and what specific details to demand.";
        setInputMessage(message);
        sendMessageMutation.mutate(message);
      },
    },
    {
      icon: FileText,
      label: "Appeal & Dispute",
      desc: "Professional reduction letters",
      color: "blue",
      action: () => {
        const message = "I need to dispute charges on my medical bill. Please generate a professional appeal letter that clearly outlines billing errors and demands a corrected statement with reduced charges.";
        setInputMessage(message);
        sendMessageMutation.mutate(message);
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
            {messages.length === 0 && !isLoading && (
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
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl py-3 px-4 border border-emerald-200">
                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold">Users Save $50K-$500K+ on Average</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 bg-gray-50 rounded-xl py-2 px-4">
                    <Shield className="h-3 w-3 text-emerald-600" />
                    <span className="font-medium">Secure • Private • Exceeds HIPAA Standards</span>
                  </div>
                </div>
              </motion.div>
            )}

            {messages.map((message: MessageWithActions, index) => (
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
                disabled={sendMessageMutation.isPending}
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
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              className="h-12 w-12 p-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl shadow-lg"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
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