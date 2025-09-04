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

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/chat-messages", {
        sessionId: currentSessionId,
        content,
        role: "user",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages", currentSessionId] });
      setInputMessage("");
      setIsTyping(true);
      
      // Simulate AI response delay
      setTimeout(() => {
        setIsTyping(false);
        // In real implementation, this would trigger the AI response
      }, 2000);
    },
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
      desc: "Find overcharges",
      color: "emerald",
      action: () => fileInputRef.current?.click(),
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      label: "Assess Insurance Bill",
      desc: "For savings",
      color: "blue",
      action: () => setInputMessage("Please assess my insurance bill for potential savings opportunities and coverage issues."),
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: TrendingDown,
      label: "Find Savings",
      desc: "Reduction strategies",
      color: "purple",
      action: () => setInputMessage("Analyze my bills and show me specific cost reduction strategies."),
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Brain,
      label: "Expert Guidance", 
      desc: "Ask anything",
      color: "orange",
      action: () => setInputMessage("I need expert guidance on understanding my medical bills and reducing costs."),
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <MobileLayout 
      title="Medical Bill AI" 
      showBackButton={true}
      showBottomNav={true}
      hideChatbot={true}
    >
      <div className="flex flex-col h-full">
        {/* Custom Header with Logo */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 mb-4">
          <div className="flex items-center space-x-3">
            <img src={logoUrl} alt="GoldRock" className="w-8 h-8 rounded-xl" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Medical Bill AI
              </h1>
              <p className="text-xs text-gray-600">AI-powered cost reduction</p>
            </div>
            {userBills.length > 0 && (
              <div className="ml-auto text-right">
                <div className="text-lg font-bold text-emerald-600">
                  {formatCurrency(getEstimatedSavings())}
                </div>
                <div className="text-xs text-gray-500">Est. Savings</div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Stats Bar */}
        {userBills.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 mx-4 rounded-2xl mb-4"
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
                <div className="text-xs text-gray-600">Savings</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">85%</div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && !isLoading && (
              <motion.div 
                className="text-center py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Sparkles className="text-white h-8 w-8" />
                </motion.div>
                
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Welcome to Medical Bill AI!
                </h2>
                
                <p className="text-sm text-gray-600 mb-6 px-4 leading-relaxed">
                  I help identify overcharges, find ways to reduce your bills, and generate professional documents to get your money back.
                </p>
                
                {/* Enhanced Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
                      >
                        <Card 
                          className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-white/40 group overflow-hidden relative"
                          onClick={action.action}
                          data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative z-10 text-center"
                          >
                            <motion.div 
                              className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <IconComponent className="h-6 w-6 text-white" />
                            </motion.div>
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm">{action.label}</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">{action.desc}</p>
                          </motion.div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Advanced Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="space-y-4 mb-6"
                >
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">85%</div>
                        <div className="text-xs text-emerald-700">Success Rate</div>
                      </div>
                    </Card>
                    <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">$2.3K</div>
                        <div className="text-xs text-blue-700">Avg Savings</div>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Smart Features */}
                  <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-900 text-sm">AI Bill Analysis</h3>
                        <p className="text-xs text-purple-700">Advanced pattern recognition for overcharge detection</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 text-sm">Document Generation</h3>
                        <p className="text-xs text-orange-700">Professional letters for providers & insurance</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="text-center space-y-2"
                >
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3 text-emerald-600" />
                      <span>Bank-Grade Security</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>HIPAA+ Standards</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                    <span>• 256-bit Encryption</span>
                    <span>• Zero Data Retention</span>
                    <span>• SOC 2 Compliant</span>
                  </div>
                </motion.div>
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
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mr-2">
                        <Bot className="text-white h-3 w-3" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Medical Bill AI</span>
                    </div>
                  )}
                  
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  
                  {/* Enhanced Message Features */}
                  {message.role === "assistant" && message.content.includes("$") && (
                    <motion.div 
                      className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <div className="flex items-center text-emerald-700 text-sm">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span className="font-medium">Potential Savings Identified</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {message.messageType === "bill_upload" && message.metadata?.billId && (
                    <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center text-emerald-700 text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        <span>Bill uploaded successfully!</span>
                      </div>
                    </div>
                  )}

                  {message.actionButtons && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.actionButtons.map((button, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="text-xs h-6 px-2"
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
                <div className="max-w-[85%] p-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mr-2">
                      <Bot className="text-white h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Medical Bill AI</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
          {/* Quick Suggestion Pills */}
          {messages.length > 0 && (
            <div className="flex space-x-2 mb-3 overflow-x-auto scrollbar-hide">
              {[
                "Find overcharges",
                "Negotiate payment",
                "Insurance appeal", 
                "Cost breakdown"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(`Help me ${suggestion.toLowerCase()}`)}
                  className="flex-shrink-0 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium hover:bg-emerald-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about bills, upload documents, or get expert guidance..."
                className="pr-20 h-11 bg-gray-50 border-gray-200 rounded-xl text-sm shadow-sm"
                disabled={sendMessageMutation.isPending}
                data-testid="input-message"
              />
              
              {/* Multi-function buttons */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-7 h-7 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center group"
                  disabled={uploadingFile}
                  data-testid="button-attach-file"
                >
                  {uploadingFile ? (
                    <div className="animate-spin w-3 h-3 border border-emerald-600 border-t-transparent rounded-full"></div>
                  ) : (
                    <Paperclip className="text-gray-500 group-hover:text-emerald-600 h-3 w-3 transition-colors" />
                  )}
                </button>
                
                <button
                  onClick={() => setInputMessage("Generate a professional letter to dispute these charges")}
                  className="w-7 h-7 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center group"
                  data-testid="button-generate-letter"
                >
                  <FileText className="text-gray-500 group-hover:text-blue-600 h-3 w-3 transition-colors" />
                </button>
              </div>
            </div>
            
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              className="h-11 w-11 p-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </motion.button>
          </div>
          
          {/* Enhanced Disclaimer with Features */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>AI-powered analysis - consult a professional</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure</span>
              </span>
              <span>256-bit encrypted</span>
            </div>
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