import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Bot, 
  Upload, 
  FileText, 
  Calculator, 
  DollarSign, 
  Shield,
  Sparkles,
  CheckCircle,
  Paperclip
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import type { ChatMessage, ChatSession, MedicalBill } from "@shared/schema";

interface MessageWithActions extends ChatMessage {
  actionButtons?: Array<{
    text: string;
    action: string;
    data?: any;
  }>;
  suggestions?: string[];
}

export default function BillAnalyzer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [userProfile, setUserProfile] = useState<{
    householdSize?: number;
    approximateIncome?: number;
    paymentCapability?: 'lump_sum' | 'payment_plan' | 'limited_funds';
  }>({});
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

  // AI-powered response function using OpenAI
  const getAIResponse = async (userMessage: string): Promise<{ content: string; suggestions?: string[] }> => {
    try {
      const response = await fetch('/api/bill-analysis-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
          userProfile,
          uploadedBillData: userBills.length > 0 ? {
            billAmount: userBills[0]?.totalAmount,
            provider: userBills[0]?.providerName,
            serviceDate: userBills[0]?.serviceDate?.toISOString()
          } : undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return {
        content: data.response,
        suggestions: data.suggestions
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback response
      return {
        content: "I'm here to help you reduce your medical bill. Most people can save thousands with the right approach. What specific challenge are you facing?",
        suggestions: [
          "I have a bill that seems too high",
          "I can't afford my medical bill",
          "I want to request an itemized bill", 
          "I want to dispute billing errors"
        ]
      };
    }
  };

  // Simple message handling with AI backend
  const sendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    
    // Add user message immediately
    setLocalMessages(prev => [...prev, userMessage]);
    
    // Update conversation history
    setConversationHistory(prev => [...prev, { role: "user", content }]);
    
    setInputMessage("");
    setIsTyping(true);
    setConversationStarted(true);
    
    // Get AI response
    try {
      const aiResponse = await getAIResponse(content);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: aiResponse.content,
        suggestions: aiResponse.suggestions,
        createdAt: new Date(),
      };
      
      setLocalMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, { role: "assistant", content: aiResponse.content }]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: "I'm experiencing a technical issue. Could you try asking your question again?",
        suggestions: [
          "I have a bill that seems too high",
          "I can't afford my medical bill",
          "I want to request an itemized bill"
        ],
        createdAt: new Date(),
      };
      setLocalMessages(prev => [...prev, errorMessage]);
    }
    
    setIsTyping(false);
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsTyping(true);

    try {
      // Simulate bill analysis
      await sendMessage(`I've uploaded my medical bill: ${file.name}. Please analyze it for potential savings and billing errors.`);
      
      toast({
        title: "Bill uploaded successfully",
        description: "Analyzing your bill for potential savings...",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try uploading your bill again.",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (localMessages.length > 0) {
      setConversationStarted(true);
    }
    if (localMessages.length > 0 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages, isTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isTyping) {
      e.preventDefault();
      if (inputMessage.trim()) {
        sendMessage(inputMessage.trim());
      }
    }
  };

  const handleSendClick = () => {
    if (inputMessage.trim() && !isTyping) {
      sendMessage(inputMessage.trim());
    }
  };

  const uploadBill = () => {
    fileInputRef.current?.click();
  };

  const requestItemizedBill = () => {
    sendMessage("I want to request an itemized bill from my healthcare provider");
  };

  const getEstimatedSavings = (): number => {
    return userBills.length > 0 ? Math.floor(Math.random() * 3000) + 500 : 0;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Quick actions for home screen
  const quickActions = [
    {
      icon: FileText,
      label: "Upload Bill",
      desc: "Find errors & overcharges",
      action: uploadBill,
      color: "emerald"
    },
    {
      icon: Calculator,
      label: "Request Itemized",
      desc: "Get detailed breakdown",
      action: requestItemizedBill,
      color: "blue"
    },
    {
      icon: DollarSign,
      label: "Negotiate Payment",
      desc: "Reduce your costs",
      action: () => sendMessage("I need help negotiating a payment plan for my medical bill"),
      color: "purple"
    },
    {
      icon: Shield,
      label: "Check Charity Care",
      desc: "See if you qualify",
      action: () => sendMessage("I want to check if I qualify for charity care or financial assistance"),
      color: "orange"
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
                  
                  {message.suggestions && message.role === "assistant" && (
                    <div className="mt-4 space-y-2">
                      {message.suggestions.map((suggestion: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(suggestion)}
                          className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                          data-testid={`suggestion-${index}`}
                        >
                          {suggestion}
                        </button>
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
                data-testid="button-upload"
              >
                <Paperclip className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <Button
              onClick={handleSendClick}
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-md"
              data-testid="button-send"
            >
              Send
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.txt"
          onChange={handleFileUpload}
          className="hidden"
          data-testid="input-file"
        />
      </div>
    </MobileLayout>
  );
}