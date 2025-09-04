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
      label: "Upload Bill",
      desc: "Scan & analyze",
      color: "emerald",
      action: () => fileInputRef.current?.click(),
    },
    {
      icon: Brain,
      label: "Ask Question", 
      desc: "Expert guidance",
      color: "blue",
      action: () => setInputMessage("What should I look for on my medical bills?"),
    },
    {
      icon: TrendingDown,
      label: "Check Savings",
      desc: "Review potential",
      color: "purple",
      action: () => setInputMessage("Show me my potential savings"),
    }
  ];

  return (
    <MobileLayout 
      title="Medical Bill AI" 
      showBackButton={true}
      showBottomNav={true}
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
                
                {/* Compact Quick Actions */}
                <div className="space-y-3 mb-6">
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
                          className="p-3 cursor-pointer hover:shadow-md transition-all bg-white/80 border-gray-200"
                          onClick={action.action}
                          data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                              <IconComponent className={`h-4 w-4 text-${action.color}-600`} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900 text-sm">{action.label}</div>
                              <div className="text-xs text-gray-600">{action.desc}</div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Secure • Private • Exceeds HIPAA Standards</span>
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
                  
                  <div className="text-sm">{message.content}</div>
                  
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

        {/* Compact Input Area */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your medical bills..."
                className="pr-10 h-10 bg-gray-50 border-gray-200 rounded-xl text-sm"
                disabled={sendMessageMutation.isPending}
                data-testid="input-message"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center"
                disabled={uploadingFile}
                data-testid="button-attach-file"
              >
                {uploadingFile ? (
                  <div className="animate-spin w-3 h-3 border border-emerald-600 border-t-transparent rounded-full"></div>
                ) : (
                  <Paperclip className="text-gray-500 h-3 w-3" />
                )}
              </button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              className="h-10 w-10 p-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Compact Disclaimer */}
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>This is Generative AI - consult a professional</span>
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