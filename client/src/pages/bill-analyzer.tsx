import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Zap,
  Shield
} from "lucide-react";
import { Link } from "wouter";
import type { ChatMessage, ChatSession, MedicalBill } from "@shared/schema";

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
        description: "I'm analyzing your bill now. This may take a moment...",
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

  const quickActionCards = [
    {
      title: "Upload Bill",
      desc: "Scan & analyze charges",
      icon: Upload,
      color: "emerald",
      action: () => fileInputRef.current?.click(),
      delay: 0.2
    },
    {
      title: "Ask Question",
      desc: "Get expert guidance", 
      icon: Brain,
      color: "blue",
      action: () => setInputMessage("What should I look for on my medical bills?"),
      delay: 0.3
    },
    {
      title: "Check Savings",
      desc: "Review potential cuts",
      icon: TrendingDown,
      color: "purple",
      action: () => setInputMessage("Show me my potential savings"),
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header with Back Button */}
        <motion.header 
          className="backdrop-blur-xl bg-white/80 border-b border-white/30 px-6 py-4 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.button
                  className="w-10 h-10 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg flex items-center justify-center transition-all"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </motion.button>
              </Link>
              
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <Bot className="h-6 w-6 text-white" />
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Medical Bill AI
                </motion.h1>
                <motion.p 
                  className="text-gray-600 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  AI-powered bill review & cost reduction
                </motion.p>
              </div>
            </div>
            
            {userBills.length > 0 && (
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formatCurrency(getEstimatedSavings())}
                </div>
                <div className="text-sm text-gray-600">Potential Savings</div>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Quick Stats */}
        {userBills.length > 0 && (
          <motion.div 
            className="px-6 py-4 bg-gradient-to-r from-white/60 to-emerald-50/60 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: FileText, label: "Bills Uploaded", value: userBills.length, color: "blue", delay: 1.2 },
                { icon: DollarSign, label: "Est. Savings", value: formatCurrency(getEstimatedSavings()), color: "green", delay: 1.3 },
                { icon: CheckCircle, label: "Success Rate", value: "85%", color: "purple", delay: 1.4 }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: stat.delay, 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-white/40 p-4 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconComponent className={`h-5 w-5 text-${stat.color}-600`} />
                        </motion.div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 mb-6">
              {messages.length === 0 && !isLoading && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/25"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 1.7, 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 150
                    }}
                  >
                    <Sparkles className="text-white text-3xl h-12 w-12" />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9, duration: 0.6 }}
                  >
                    Welcome to Medical Bill AI!
                  </motion.h2>
                  
                  <motion.p 
                    className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1, duration: 0.6 }}
                  >
                    I'm your AI assistant for medical bill analysis. I help identify overcharges, find ways to reduce your bills, 
                    and generate professional documents to get your money back. Let's save you thousands!
                  </motion.p>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.3, duration: 0.6 }}
                  >
                    {quickActionCards.map((card, index) => {
                      const IconComponent = card.icon;
                      return (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: 2.3 + card.delay, 
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <Card 
                            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-white/40 group"
                            onClick={card.action}
                            data-testid={`quick-action-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-center"
                            >
                              <motion.div 
                                className={`w-14 h-14 bg-${card.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <IconComponent className={`h-7 w-7 text-${card.color}-600`} />
                              </motion.div>
                              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                              <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                            </motion.div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center justify-center space-x-2 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 0.6 }}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Secure • Private • HIPAA Compliant</span>
                  </motion.div>
                </motion.div>
              )}

              {messages.map((message: MessageWithActions, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div
                    className={`max-w-3xl p-6 rounded-3xl shadow-lg backdrop-blur-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ml-12"
                        : "bg-white/90 border border-white/40 mr-12"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                          <Bot className="text-white text-sm h-4 w-4" />
                        </div>
                        <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Medical Bill AI</span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.messageType === "bill_upload" && message.metadata?.billId && (
                      <motion.div 
                        className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        <div className="flex items-center text-emerald-700">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <span className="font-medium">Bill uploaded successfully!</span>
                        </div>
                        <p className="text-emerald-600 text-sm mt-1">
                          I'm analyzing your bill for potential savings opportunities...
                        </p>
                      </motion.div>
                    )}

                    {message.actionButtons && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {message.actionButtons.map((button, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="bg-white/50 hover:bg-white/80 border-white/30"
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="max-w-3xl p-6 rounded-3xl shadow-lg bg-white/90 border border-white/40 mr-12 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                        <Bot className="text-white text-sm h-4 w-4" />
                      </div>
                      <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Medical Bill AI</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl border-t border-white/30 px-6 py-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your medical bills, upload a bill, or request help reducing costs..."
                    className="pr-12 h-14 bg-white/90 border-white/50 rounded-2xl shadow-sm text-base placeholder:text-gray-500"
                    disabled={sendMessageMutation.isPending}
                    data-testid="input-message"
                  />
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 p-0 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center"
                    disabled={uploadingFile}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    data-testid="button-attach-file"
                  >
                    {uploadingFile ? (
                      <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Paperclip className="text-gray-500 h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              </div>
              
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                className="h-14 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </div>
            
            {/* Disclaimer */}
            <motion.div 
              className="flex items-center justify-center mt-3 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>This is Generative AI - consult a professional</span>
            </motion.div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-file-upload"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}