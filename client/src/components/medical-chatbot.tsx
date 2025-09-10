import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Stethoscope, 
  DollarSign,
  User,
  Bot,
  Mic,
  MicOff
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export function MedicalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Speech recognition
  const recognition = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const quickQuestions = [
    {
      icon: Stethoscope,
      text: "What are the symptoms of pneumonia?",
      category: "medical"
    },
    {
      icon: DollarSign,
      text: "How do I appeal a denied insurance claim?",
      category: "insurance"
    },
    {
      icon: Stethoscope,
      text: "When should I see a cardiologist?",
      category: "medical"
    },
    {
      icon: DollarSign,
      text: "What's covered under preventive care?",
      category: "insurance"
    }
  ];

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const sendMessage = async (messageText: string = inputText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/medical-chat", {
        message: messageText.trim()
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInputText("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed right-4 z-40 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center"
        style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="medical-chatbot-button"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </motion.div>
        
        {/* Pulse indicator when not open */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 bg-emerald-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Chat Window */}
            <motion.div
              className="fixed bottom-24 right-4 left-4 z-40 max-w-sm ml-auto"
              style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Bill Reduction Expert</h3>
                        <p className="text-emerald-100 text-xs">Ask about health & insurance</p>
                      </div>
                    </div>
                    <button
                      onClick={resetChat}
                      className="text-white/80 hover:text-white text-xs px-2 py-1 rounded-lg bg-white/10"
                      data-testid="reset-chat"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center py-6">
                      <Stethoscope className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">How can I help?</h4>
                      <p className="text-sm text-gray-600 mb-4">Ask me about medical conditions, symptoms, or insurance questions.</p>
                      
                      {/* Quick Questions */}
                      <div className="space-y-2">
                        {quickQuestions.map((question, index) => {
                          const IconComponent = question.icon;
                          return (
                            <motion.button
                              key={index}
                              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center space-x-3 text-left transition-colors"
                              onClick={() => sendMessage(question.text)}
                              whileTap={{ scale: 0.98 }}
                              data-testid={`quick-question-${index}`}
                            >
                              <IconComponent className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{question.text}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isBot ? 'bg-emerald-100' : 'bg-blue-100'
                        }`}>
                          {message.isBot ? (
                            <Bot className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <User className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                        <div className={`px-3 py-2 rounded-2xl ${
                          message.isBot 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-emerald-600" />
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-2xl">
                          <div className="flex items-center space-x-1">
                            <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                            <span className="text-sm text-gray-500">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about symptoms, treatments, or insurance..."
                        className="w-full px-4 py-2 pr-10 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                        disabled={isLoading}
                        data-testid="chat-input"
                      />
                      
                      {/* Voice Input Button */}
                      {recognition.current && (
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                            isListening ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-emerald-600'
                          }`}
                          data-testid="voice-input"
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    
                    <motion.button
                      onClick={() => sendMessage()}
                      disabled={!inputText.trim() || isLoading}
                      className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
                      whileTap={{ scale: 0.9 }}
                      data-testid="send-message"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 text-white" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* AI Disclaimer */}
                  <p className="text-xs text-gray-400 text-center leading-tight opacity-75">
                    AI-generated. Consult your doctor.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}