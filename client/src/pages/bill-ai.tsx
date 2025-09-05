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
  FileEdit
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
  const [uploadingFile, setUploadingFile] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
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

  // File upload mutation for Bill AI
  const uploadBillMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("bill", file);
      formData.append("sessionId", "bill-ai-session");
      
      const response = await fetch("/api/upload-bill", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setUploadingFile(false);
      
      if (data.success) {
        // Add user's file upload message first
        const uploadMessage = {
          id: Date.now().toString(),
          role: "user" as const,
          content: `📎 Uploaded medical bill for analysis`,
          createdAt: new Date(),
        };
        
        // Add AI analysis as a message in the chat if available
        const analysisMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: data.analysis ? 
            `🔍 **BILL ANALYSIS COMPLETE**\n\n${data.analysis}` :
            `✅ **BILL UPLOADED SUCCESSFULLY**\n\nYour medical bill has been uploaded and saved. Use the features above to analyze it for billing errors and savings opportunities.`,
          createdAt: new Date(),
        };
        
        setLocalMessages(prev => [...prev, uploadMessage, analysisMessage]);
        setConversationStarted(true);
        
        // Show success toast
        toast({
          title: "Bill Uploaded Successfully",
          description: data.message || "Your bill has been uploaded and is ready for analysis.",
        });
        
        // Refetch bills to update the list
        queryClient.invalidateQueries({ queryKey: ["/api/medical-bills"] });
      } else {
        // This should not happen anymore, but keeping as fallback
        toast({
          title: "Upload Failed",
          description: data.message || "Failed to upload bill. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setUploadingFile(false);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || "Failed to upload bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type - only PDF and images allowed
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only PDF or image files (JPEG, PNG, WebP).",
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
      desc: "AI analysis for overcharges",
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
      label: "Negotiation Strategy",
      desc: "Expert reduction tactics",
      color: "green",
      action: () => setActiveFeature('negotiation-script'),
    },
    {
      icon: FileText,
      label: "Dispute Letter",
      desc: "Professional appeals",
      color: "blue",
      action: () => setActiveFeature('dispute-letter'),
    }
  ];

  return (
    <MobileLayout 
      title="Medical Bill AI Expert" 
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
                <div className="text-sm text-gray-600">Potential</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">AI</div>
                <div className="text-sm text-gray-600">Powered</div>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className="text-center py-8"
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
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
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  AI Medical Bill Expert
                </h3>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed px-4">
                  Get expert advice on reducing medical bills, finding overcharges, and negotiating with hospitals. Powered by advanced AI.
                </p>
                
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3 px-4">
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
                          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-200"
                          onClick={action.action}
                          data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="text-center">
                            <div className={`w-12 h-12 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{action.label}</h4>
                            <p className="text-xs text-gray-600">{action.desc}</p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
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
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping || uploadingFile}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl w-12 h-12 p-0 border border-gray-300"
              data-testid="button-attach"
            >
              {uploadingFile ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Paperclip className="h-5 w-5" />
              )}
            </Button>
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about medical bills, overcharges, negotiations..."
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="pr-12 rounded-2xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                data-testid="input-message"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl w-12 h-12 p-0 shadow-lg"
              data-testid="button-send"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
            data-testid="file-input"
          />
        </div>
      </div>
    </MobileLayout>
  );
}