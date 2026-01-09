import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User,
  Loader2,
  Shield,
  AlertTriangle,
  DollarSign,
  FileText,
  Phone,
  Scale,
  Heart,
  Lightbulb,
  CreditCard,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    icon: Heart,
    title: "Childbirth Bill in Collections",
    prompt: "My hospital bill for childbirth is in collections. It's $30,000+. What are my options? Can I apply for charity care even now? How do I negotiate this down?",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: AlertTriangle,
    title: "Lost Insurance - Baby Bill",
    prompt: "I lost my insurance during pregnancy and now have a massive childbirth bill in collections. Can I get retroactive COBRA or Medicaid? What should I do?",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: Shield,
    title: "Back on Insurance Now",
    prompt: "I was uninsured when I had my baby but now I have insurance again. The old bill is in collections. Can my new insurance help? What about charity care?",
    color: "from-teal-500 to-emerald-600"
  },
  {
    icon: FileText,
    title: "Debt Validation Letter",
    prompt: "Write me a debt validation letter template for my childbirth bill that's in collections. I want to request proof they can legally collect this debt.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: DollarSign,
    title: "Negotiate Settlement",
    prompt: "How do I negotiate a settlement on medical debt in collections? What percentage should I offer and how do I get pay-for-delete in writing?",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: Scale,
    title: "Collector Tactics",
    prompt: "A debt collector keeps calling about my medical bill and threatening to sue. What should I say? What are my rights? How do I stop the harassment?",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Lightbulb,
    title: "Charity Care Application",
    prompt: "How do I apply for hospital charity care for a bill that's already in collections? Can they recall the debt? What documentation do I need?",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: CreditCard,
    title: "Credit Report Impact",
    prompt: "Medical debt is on my credit report. I heard the rules changed - does medical debt under $500 still show? How do I get pay-for-delete?",
    color: "from-violet-500 to-purple-600"
  }
];

export function CollectionsDefenseChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = `You are an expert medical debt and collections defense advisor for GoldRock Health. You have deep knowledge of consumer protection laws, medical billing, and debt collection practices.

FORMATTING RULES (CRITICAL - Follow these exactly):
1. Use clear section headers with ## for main sections
2. Use numbered lists (1. 2. 3.) for steps and action items
3. Use bullet points (•) for lists of information
4. Use **bold** for key terms, important warnings, and critical information
5. Keep paragraphs short (2-3 sentences max)
6. Add line breaks between sections for readability
7. When providing scripts or templates, put them in a clearly labeled section

CONTENT GUIDELINES:
• Be specific and actionable - give exact steps to take
• Include word-for-word scripts when the user needs to talk to collectors
• Cite specific laws (FDCPA, FCRA, No Surprises Act) when relevant
• Mention specific timeframes (30 days for validation, etc.)
• Always remind users this is educational information, not legal advice

RESPONSE STRUCTURE for most questions:
1. Quick answer (1-2 sentences)
2. Detailed steps or explanation
3. Sample script or template if applicable
4. Important warnings or tips
5. Next steps

Contact: CONTACT@GOLDROCK.ai`;

      const response = await apiRequest("POST", "/api/ai/chat", {
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: messageText }
        ],
        context: "collections-defense"
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.message || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again. If you need immediate help, contact us at CONTACT@GOLDROCK.ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  const formatMessage = (content: string) => {
    let formatted = content
      // Headers
      .replace(/^## (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2 first:mt-0">$1</h3>')
      .replace(/^### (.+)$/gm, '<h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-1">$1</h4>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Numbered lists
      .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 mb-1.5"><span class="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center">$1</span><span>$2</span></div>')
      // Bullet points
      .replace(/^[•\-]\s+(.+)$/gm, '<div class="flex gap-2 mb-1 pl-1"><span class="text-red-500 mt-1">•</span><span>$1</span></div>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br/>');
    
    return `<div class="prose-content">${formatted}</div>`;
  };

  return (
    <div className="w-full" data-testid="collections-defense-chatbot">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Collections Defense AI</h3>
                <p className="text-white/80 text-sm">Expert guidance for your situation</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetChat}
                className="text-white/80 hover:text-white hover:bg-white/20"
                data-testid="reset-chat"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                New Chat
              </Button>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Quick Prompts - Only show when no messages */}
          {messages.length === 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Tap a topic or type your question below:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-700 hover:shadow-lg transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`quick-prompt-${index}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 bg-gradient-to-br ${prompt.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <prompt.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {prompt.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <ScrollArea className="h-[350px] mb-4 -mx-1 px-1">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white ml-auto"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
                        }`}
                      >
                        {message.role === "user" ? (
                          <p className="text-sm">{message.content}</p>
                        ) : (
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                          />
                        )}
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-1.5 ml-1">
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                            data-testid={`copy-message-${message.id}`}
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-red-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-orange-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-amber-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Analyzing your situation...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your situation... (amount, age of debt, what they said, etc.)"
              className="min-h-[80px] pr-24 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl resize-none text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              data-testid="collections-chat-input"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-3 right-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-lg h-9 px-4 shadow-lg"
              data-testid="collections-chat-submit"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
            Educational information only, not legal advice. Contact CONTACT@GOLDROCK.ai for help.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
