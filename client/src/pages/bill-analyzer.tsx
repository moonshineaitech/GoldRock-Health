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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/70 border-b border-white/30 px-6 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-file-medical text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Medical Bill Analyzer
                </h1>
                <p className="text-gray-600 text-sm">AI-powered bill review and cost reduction</p>
              </div>
            </div>
            
            {userBills.length > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(getEstimatedSavings())}
                </div>
                <div className="text-sm text-gray-600">Potential Savings</div>
              </div>
            )}
          </div>
        </header>

        {/* Quick Stats */}
        {userBills.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-white/50 to-blue-50/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/70 backdrop-blur-sm border-white/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-file-invoice-dollar text-blue-600"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{userBills.length}</div>
                    <div className="text-sm text-gray-600">Bills Uploaded</div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-white/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-piggy-bank text-green-600"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(getEstimatedSavings())}
                    </div>
                    <div className="text-sm text-gray-600">Est. Savings</div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-white/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-chart-line text-purple-600"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">85%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 mb-6">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <i className="fas fa-robot text-white text-3xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to your Medical Bill Analyzer!
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    I'm here to help you identify overcharges, find ways to reduce your medical bills, 
                    and generate professional documents to get your money back. Let's start by uploading 
                    a bill or asking me a question!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 text-base shadow-lg"
                      data-testid="button-upload-bill"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      Upload Medical Bill
                    </Button>
                    
                    <Button
                      onClick={() => setInputMessage("What should I look for on my medical bills?")}
                      variant="outline"
                      className="h-14 text-base border-2 hover:bg-blue-50"
                      data-testid="button-ask-question"
                    >
                      <i className="fas fa-question-circle mr-2"></i>
                      Ask a Question
                    </Button>
                  </div>
                </div>
              )}

              {messages.map((message: MessageWithActions) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-2xl shadow-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-12"
                        : "bg-white/80 backdrop-blur-sm border border-white/30 mr-12"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                          <i className="fas fa-robot text-white text-sm"></i>
                        </div>
                        <span className="font-semibold text-gray-900">Medical Bill Analyzer</span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.messageType === "bill_upload" && message.metadata?.billId && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center text-blue-700">
                          <i className="fas fa-file-medical mr-2"></i>
                          <span className="font-medium">Bill uploaded successfully!</span>
                        </div>
                        <p className="text-blue-600 text-sm mt-1">
                          I'm analyzing your bill for potential savings opportunities...
                        </p>
                      </div>
                    )}

                    {message.actionButtons && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {message.actionButtons.map((button, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="bg-white/50 hover:bg-white/80"
                            data-testid={`button-${button.action}-${index}`}
                          >
                            {button.text}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-4 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm border border-white/30 mr-12">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                        <i className="fas fa-robot text-white text-sm"></i>
                      </div>
                      <span className="font-semibold text-gray-900">Medical Bill Analyzer</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/70 backdrop-blur-xl border-t border-white/30 px-6 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your medical bills, upload a bill, or request help reducing costs..."
                    className="pr-12 h-12 bg-white/90 border-white/50 rounded-2xl shadow-sm"
                    disabled={sendMessageMutation.isPending}
                    data-testid="input-message"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 hover:bg-blue-100"
                    disabled={uploadingFile}
                    data-testid="button-attach-file"
                  >
                    {uploadingFile ? (
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <i className="fas fa-paperclip text-gray-500"></i>
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-2xl"
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </Button>
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
      </div>
    </div>
  );
}