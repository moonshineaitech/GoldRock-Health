import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  Loader2,
  ChevronDown,
  Shield,
  AlertTriangle,
  DollarSign,
  FileText,
  Phone,
  Scale,
  Heart,
  Lightbulb,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    icon: AlertTriangle,
    title: "Collections Just Called Me",
    prompt: "A debt collector just called me about a medical bill I didn't know I had. What should I do right now? What should I say and NOT say? Give me specific steps.",
    category: "Urgent"
  },
  {
    icon: FileText,
    title: "Write a Debt Validation Letter",
    prompt: "Help me write a debt validation letter. The debt is for $[AMOUNT] from [HOSPITAL/PROVIDER] for a [PROCEDURE/VISIT] on [DATE]. I want to challenge this debt and request full documentation.",
    category: "Templates"
  },
  {
    icon: DollarSign,
    title: "Negotiate a Settlement",
    prompt: "I have a medical debt of $[AMOUNT] in collections. I can realistically pay $[AMOUNT]. How do I negotiate a settlement? What percentage should I offer? How do I get them to delete it from my credit report?",
    category: "Negotiation"
  },
  {
    icon: Scale,
    title: "They're Threatening to Sue",
    prompt: "A debt collector is threatening to sue me for a medical bill of $[AMOUNT]. Is this threat real? What are my options? What defenses do I have?",
    category: "Legal"
  },
  {
    icon: Shield,
    title: "Check Statute of Limitations",
    prompt: "How do I know if my medical debt is past the statute of limitations? The debt is from [YEAR] and I live in [STATE]. What happens if the debt is too old?",
    category: "Legal"
  },
  {
    icon: Phone,
    title: "They Called My Family",
    prompt: "A debt collector called my [PARENT/SPOUSE/CHILD] about MY medical debt. Is this legal? What can I do about it? How do I make them stop?",
    category: "Violations"
  },
  {
    icon: Heart,
    title: "Hospital Charity Care Appeal",
    prompt: "I have a hospital bill in collections but I think I should qualify for charity care. Can I still apply? How do I get the debt recalled from collections?",
    category: "Assistance"
  },
  {
    icon: Lightbulb,
    title: "Pay-for-Delete Strategy",
    prompt: "Explain the pay-for-delete strategy step by step. How do I get a collection agency to agree to remove the debt from my credit report in exchange for payment? What should I put in writing?",
    category: "Credit"
  },
  {
    icon: DollarSign,
    title: "Medical Debt on Credit Report",
    prompt: "I just checked my credit report and there's a medical collection I didn't know about. How do I dispute it? What are the new rules about medical debt on credit reports?",
    category: "Credit"
  },
  {
    icon: FileText,
    title: "Write Insurance Appeal",
    prompt: "My insurance denied coverage for [PROCEDURE] and now I have a huge bill going to collections. Help me write an appeal letter citing medical necessity and relevant laws.",
    category: "Insurance"
  },
  {
    icon: AlertTriangle,
    title: "ER Surprise Bill Defense",
    prompt: "I went to the ER and got a surprise bill from an out-of-network doctor I never chose. The bill is now in collections. What protections do I have under the No Surprises Act?",
    category: "Bills"
  },
  {
    icon: Scale,
    title: "FDCPA Violation Check",
    prompt: "I think the debt collector violated my rights. They [DESCRIBE WHAT HAPPENED]. Is this a violation of the Fair Debt Collection Practices Act? What can I do about it?",
    category: "Violations"
  }
];

export function CollectionsDefenseChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setShowPrompts(false);
    setIsLoading(true);

    try {
      const systemPrompt = `You are an expert medical debt and collections defense advisor for GoldRock Health. You have deep knowledge of:
- Fair Debt Collection Practices Act (FDCPA) and consumer rights
- Medical billing errors, overcharges, and how to identify them
- Debt validation procedures and requirements
- Statute of limitations on medical debt by state
- Hospital charity care programs and eligibility
- Insurance appeals and the No Surprises Act
- Credit reporting rules for medical debt
- Negotiation strategies for settling medical debt
- Pay-for-delete agreements and credit repair

Your responses should be:
1. Specific and actionable - give exact steps to take
2. Include actual scripts and letter templates when relevant
3. Cite specific laws and regulations when applicable
4. Empowering - help users understand their rights
5. Practical - focus on what actually works

Always remind users that this is educational information and not legal advice. For complex legal matters, recommend consulting with a consumer rights attorney.

Format your responses clearly with:
- Numbered steps when giving instructions
- Bold text for important points using **bold**
- Specific dollar amounts, percentages, and timelines when relevant

Contact email for GoldRock Health: CONTACT@GOLDROCK.ai`;

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
        content: "I'm sorry, I encountered an error. Please try again. If you need immediate help with collections defense, contact us at CONTACT@GOLDROCK.ai",
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
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="w-full" data-testid="collections-defense-chatbot">
      <Card className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-900/30 dark:via-orange-900/30 dark:to-amber-900/30 border-red-200 dark:border-red-700 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Collections Defense AI Assistant</span>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                Get personalized guidance for your specific situation
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {showPrompts && messages.length === 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Choose a situation or ask your own question:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`quick-prompt-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-red-200 group-hover:to-orange-200 transition-colors">
                        <prompt.icon className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-xs mb-1 bg-gray-100 dark:bg-gray-700">
                          {prompt.category}
                        </Badge>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {prompt.title}
                        </h4>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <ScrollArea className="h-[400px] mb-4 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div 
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                      <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        <span className="text-sm text-gray-500">Analyzing your situation...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your collections situation... Include details like the amount, how old the debt is, what the collector has said, etc."
              className="min-h-[100px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              data-testid="collections-chat-input"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press Enter to send • Shift+Enter for new line
              </p>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                data-testid="collections-chat-submit"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get Advice
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Disclaimer:</strong> This AI provides educational information about medical debt and collections defense. 
              It is not legal advice. For complex legal matters or if you're being sued, consult with a consumer rights attorney. 
              Contact us at CONTACT@GOLDROCK.ai for more help.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
