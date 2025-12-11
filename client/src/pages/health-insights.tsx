import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { MobileLayout } from "@/components/mobile-layout";
import { 
  Send, 
  Brain, 
  Heart, 
  Pill, 
  Stethoscope,
  AlertTriangle,
  MessageCircle,
  Loader2,
  Sparkles,
  Shield,
  ChevronRight,
  Info
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sessionTypes = [
  {
    id: "symptom_check",
    title: "Symptom Checker",
    description: "Describe what you're experiencing",
    icon: Stethoscope,
    color: "from-blue-500 to-cyan-500",
    emoji: "🩺"
  },
  {
    id: "second_opinion",
    title: "Second Opinion",
    description: "Get another perspective on a diagnosis",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    emoji: "🧠"
  },
  {
    id: "medication_review",
    title: "Medication Review",
    description: "Questions about your medications",
    icon: Pill,
    color: "from-emerald-500 to-teal-500",
    emoji: "💊"
  },
  {
    id: "wellness_tips",
    title: "Wellness Insights",
    description: "General health and lifestyle tips",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    emoji: "❤️"
  }
];

export default function HealthInsights() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChunkedMessages = (chunks: string[]) => {
    chunks.forEach((content, index) => {
      setTimeout(() => {
        const msg: Message = {
          id: `${Date.now()}_chunk_${index}`,
          role: "assistant",
          content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
      }, index * 400);
    });
  };

  const startSession = (type: string) => {
    setSelectedType(type);
    const session = sessionTypes.find(s => s.id === type);
    
    const welcomeChunks = [
      `${session?.emoji} Let's talk about your ${session?.title.toLowerCase()}.`,
      "I'm here to help you understand your health better and give you useful information to discuss with your doctor.",
      "Tell me what's on your mind, and I'll do my best to help. What would you like to know?"
    ];
    
    sendChunkedMessages(welcomeChunks);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await apiRequest('/api/health-insights-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage.trim(),
          sessionType: selectedType,
          conversationHistory: messages.slice(-10)
        })
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now().toString() + "_ai",
        role: "assistant",
        content: data.response || "I'm here to help. Could you tell me more about what you're experiencing?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Health insights error:', error);
      const errorChunks = [
        "Hmm, I'm having trouble connecting right now.",
        "Please try again in a moment. I'm here to help!"
      ];
      sendChunkedMessages(errorChunks);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!disclaimerAccepted) {
    return (
      <MobileLayout title="Health Insights">
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Important Disclaimer
              </h2>
              
              <div className="text-left text-sm text-gray-600 space-y-3 mb-6">
                <p>
                  <strong>This is for educational purposes only.</strong> The information provided is not medical advice and should not replace consultation with a qualified healthcare professional.
                </p>
                <p>
                  🚨 <strong>For emergencies:</strong> Call 911 or go to your nearest emergency room immediately.
                </p>
                <p>
                  The AI assistant can help you understand health topics and prepare questions for your doctor, but cannot diagnose conditions or prescribe treatments.
                </p>
              </div>

              <Button
                onClick={() => setDisclaimerAccepted(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl h-12"
                data-testid="accept-disclaimer-button"
              >
                I Understand, Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </MobileLayout>
    );
  }

  if (!selectedType) {
    return (
      <MobileLayout title="Health Insights">
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="p-4 lg:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Health Insights AI</h1>
              <p className="text-gray-500 mt-2">
                Get helpful health information and second opinions
              </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto">
              {sessionTypes.map((type, idx) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all border-0 shadow-md"
                    onClick={() => startSession(type.id)}
                    data-testid={`session-type-${type.id}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-md`}>
                        <span className="text-2xl">{type.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{type.title}</h3>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Powered by AI</p>
                  <p className="text-blue-600 mt-1">
                    Our AI provides educational health information to help you have better conversations with your healthcare providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Health Insights">
      <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedType(null);
                setMessages([]);
              }}
              className="text-gray-500"
            >
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sessionTypes.find(s => s.id === selectedType)?.color} flex items-center justify-center`}>
                <span className="text-lg">{sessionTypes.find(s => s.id === selectedType)?.emoji}</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {sessionTypes.find(s => s.id === selectedType)?.title}
                </h2>
                <p className="text-xs text-gray-500">AI Health Assistant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md"
                      : "bg-white shadow-md text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white shadow-md rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you're experiencing..."
              className="flex-1 rounded-xl border-2 focus:border-purple-500"
              data-testid="health-chat-input"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              data-testid="health-chat-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            For educational purposes only. Not medical advice.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
