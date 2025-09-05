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

  // Track conversation history for AI context
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [hasShownInitialStrategies, setHasShownInitialStrategies] = useState(false);

  // Generate AI response function with real OpenAI integration  
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // First message gets comprehensive initial strategies, then switch to AI
      if (!hasShownInitialStrategies) {
        setHasShownInitialStrategies(true);
        
        // Return comprehensive initial strategy guide
        return `I am a medical bill reduction specialist with expertise in identifying overcharges and negotiating substantial reductions for patients facing large medical bills.

🎯 KEY INSIGHT: 80% of medical bills contain errors worth $50K-$500K+ in total overcharges annually.

CORE SPECIALIZATION AREAS:

📊 SYSTEMATIC BILL ANALYSIS (Professional 47-Point Error Detection):
   • Identifying billing errors using proven methodologies
   • Cross-referencing charges against medical records  
   • Detecting upcoding, duplicate billing, phantom charges, and unbundling schemes
   • Professional advocates find 3-8 errors per bill worth $2,000-$35,000

⚖️ STRATEGIC TIMING ADVANTAGE:
   • DON'T PAY IMMEDIATELY - Use your 90-120 day collection window
   • This delay period is your biggest negotiation advantage
   • Research, prepare, and negotiate from strength

💰 CHARITY CARE & FINANCIAL ASSISTANCE:
   • FREE CARE: ≤200% Federal Poverty Level
   • DISCOUNTED CARE: 200-400% Federal Poverty Level
   • HARDSHIP PROGRAMS: Bills >20% of annual income
   • Available even WITH insurance coverage

🔍 FAIR MARKET PRICING RESEARCH:
   • Healthcare Bluebook for fair price estimates
   • FAIR Health Consumer for geographic pricing data
   • Hospital Price Transparency websites (legally required)
   • Challenge charges 300-800% above Medicare rates

IMMEDIATE ACTION WORKFLOW:

1. STOP - Don't pay anything immediately
2. Request complete itemized bill with CPT/ICD codes
3. Apply 47-point error detection checklist
4. Research fair market pricing using transparency tools
5. Apply for charity care programs (if eligible)
6. Negotiate using documented errors and pricing research
7. Get all agreements in writing before payment

The key to substantial reductions is methodical analysis, strategic timing, and professional presentation of documented errors combined with fair market pricing leverage.

What aspect of your medical billing situation requires immediate attention?`;
      }

      // For subsequent messages, use OpenAI API
      const response = await fetch('/api/bill-analysis-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.response }
      ]);

      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm experiencing technical difficulties with the AI service. Please try rephrasing your question or contact support if the issue persists.";
  };

  // Simple message handling with OpenAI integration
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
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(content);
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
        <div className="flex-1 overflow-hidden">
          {!conversationStarted ? (
            <div className="h-full flex flex-col">
              {/* Initial Chat Interface */}
              <div className="px-4 py-6">
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Medical Bill AI Assessor</h2>
                  <p className="text-sm text-gray-600">
                    Professional bill reduction specialist with proven strategies to identify $50K-$500K+ in overcharges
                  </p>
                </motion.div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    const colorClasses = {
                      emerald: "from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
                      red: "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
                      green: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                      blue: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    };

                    return (
                      <motion.button
                        key={index}
                        className={`bg-gradient-to-br ${colorClasses[action.color as keyof typeof colorClasses]} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-left`}
                        onClick={action.action}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <IconComponent className="h-6 w-6 mb-3" />
                        <h3 className="font-bold text-sm mb-1">{action.label}</h3>
                        <p className="text-xs opacity-90">{action.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Active Chat Interface */
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user" 
                        ? "bg-emerald-600 text-white ml-4" 
                        : "bg-gray-100 text-gray-900 mr-4"
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-2">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 mr-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors disabled:opacity-50"
              data-testid="upload-bill-button"
            >
              {uploadingFile ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Paperclip className="h-5 w-5" />
                </motion.div>
              ) : (
                <Paperclip className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about bill analysis, error detection, negotiation strategies..."
                className="pr-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                disabled={isTyping}
                data-testid="message-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-600"
                data-testid="send-message-button"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
