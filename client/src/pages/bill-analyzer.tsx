import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  FileText, 
  Send, 
  ArrowLeft, 
  Upload,
  MessageSquare,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  createdAt: Date;
}

export default function BillAnalyzerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [userProfile, setUserProfile] = useState<{
    billAmount?: number;
    serviceType?: string;
    insuranceStatus?: string;
    householdSize?: number;
    approximateIncome?: number;
    billDetails?: string;
    paymentCapability?: 'lump_sum' | 'payment_plan' | 'limited_funds';
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get or create current chat session
  const { data: currentSession } = useQuery({
    queryKey: ["/api/chat-sessions/current"],
    enabled: !!user,
  });

  // Get user's medical bills for context
  const { data: userBills = [] } = useQuery({
    queryKey: ["/api/medical-bills"],
    enabled: !!user,
  });

  // Simple AI chatbot for medical bill analysis
  const getResponse = async (userMessage: string): Promise<{ content: string; suggestions?: string[] }> => {
    // Immediately call AI for any input - no staged questions
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
          requestType: "COMPREHENSIVE_ANALYSIS"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.response,
        suggestions: data.suggestions || [
          "Help me find specific billing errors",
          "Generate a dispute letter template",
          "Check charity care eligibility", 
          "Compare my charges to fair prices"
        ]
      };
    } catch (error) {
      console.error('Error with AI analysis:', error);
      return {
        content: "I'm having a technical issue. Tell me about your medical bill and I'll help you reduce it using professional strategies.",
        suggestions: [
          "I have a $5,000 emergency room bill",
          "Hospital charged me $20,000 for surgery", 
          "I can't afford my medical bills",
          "I think I'm being overcharged"
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
    
    setLocalMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: "user", content }]);
    setInputMessage("");
    setIsTyping(true);
    setConversationStarted(true);
    
    // Get response (immediately calls AI)
    try {
      const response = await getResponse(content);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: response.content,
        suggestions: response.suggestions,
        createdAt: new Date(),
      };
      
      setLocalMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, { role: "assistant", content: response.content }]);
      
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: "I'm experiencing a technical issue. Could you tell me about your medical bill situation?",
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

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const formatMessageContent = (content: string) => {
    // Convert markdown-style formatting to JSX
    return content
      .split('\n')
      .map((line, index) => {
        // Handle bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = line.split(boldRegex);
        const formattedLine = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        );

        if (line.startsWith('**') && line.endsWith('**')) {
          return <div key={index} className="font-semibold text-lg mb-2">{formattedLine}</div>;
        } else if (line.startsWith('• ') || line.startsWith('- ')) {
          return <div key={index} className="ml-4 mb-1">• {line.substring(2)}</div>;
        } else if (line.startsWith('#')) {
          return <div key={index} className="font-bold text-xl mb-2">{line.substring(1).trim()}</div>;
        } else if (line.trim() === '') {
          return <div key={index} className="mb-2"></div>;
        } else {
          return <div key={index} className="mb-1">{formattedLine}</div>;
        }
      });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-2">Medical Bill AI</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please log in to access the medical bill analysis tool
            </p>
            <Link href="/login">
              <Button className="w-full">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Bill AI</h1>
              <p className="text-gray-600 dark:text-gray-300">Professional bill reduction analysis</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="h-[700px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Medical Bill Reduction Specialist</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {!conversationStarted ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">Medical Bill Reduction Specialist</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    I help patients identify overcharges and negotiate substantial reductions on medical bills using professional strategies.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {[
                      "I have a medical bill that seems too high",
                      "Emergency room charged me $12,500", 
                      "Hospital bill for $25,000 surgery",
                      "I can't afford my medical bills"
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left justify-start h-auto p-3 whitespace-normal"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {localMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-gray-800 border shadow-sm"
                        }`}
                      >
                        <div className="text-sm">
                          {message.role === "user" ? message.content : formatMessageContent(message.content)}
                        </div>
                        
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-left justify-start text-xs h-auto p-2 w-full whitespace-normal bg-gray-50 dark:bg-gray-700"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Analyzing your bill...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tell me about your medical bill situation..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (inputMessage.trim() && !isTyping) {
                          sendMessage(inputMessage.trim());
                        }
                      }
                    }}
                    disabled={isTyping}
                  />
                </div>
                <Button
                  onClick={() => {
                    if (inputMessage.trim() && !isTyping) {
                      sendMessage(inputMessage.trim());
                    }
                  }}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}