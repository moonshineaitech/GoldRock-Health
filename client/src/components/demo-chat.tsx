import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Sparkles, ArrowRight, Loader2, Lock, Heart } from "lucide-react";
import { Link } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SuggestedWorkflow {
  path: string;
  label: string;
}

export function DemoChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(5);
  const [suggestedWorkflow, setSuggestedWorkflow] = useState<SuggestedWorkflow | null>(null);
  const [requiresSignup, setRequiresSignup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || requiresSignup) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setSuggestedWorkflow(null);

    try {
      const response = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setRequiresSignup(true);
        setRemaining(0);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "You've used all 5 free messages! Sign up for free to continue chatting and unlock all our powerful tools.",
          },
        ]);
      } else if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        setRemaining(data.remaining);
        if (data.suggestedWorkflow) {
          setSuggestedWorkflow(data.suggestedWorkflow);
        }
        if (data.requiresSignup) {
          setRequiresSignup(true);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I'm having trouble responding right now. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      handleSubmit();
    }, 50);
  };

  const quickPrompts = [
    { text: "Analyze my medical bill for errors", icon: "📋" },
    { text: "What rights do I have to dispute charges?", icon: "⚖️" },
    { text: "Help me negotiate a lower bill", icon: "💰" },
    { text: "Explain my insurance benefits", icon: "🏥" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto my-8"
      data-testid="demo-chat-container"
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 rounded-3xl blur-xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">Ask GoldRock AI</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    Free Demo
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3 w-3" />
                  <span>Private & Secure</span>
                  <span className="text-emerald-600 font-medium">• {remaining} free messages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="min-h-[180px] max-h-[280px] overflow-y-auto p-5 bg-gradient-to-b from-gray-50/30 to-white">
            {messages.length === 0 ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-emerald-500" />
                  <p className="text-gray-700 font-medium">How can I help you today?</p>
                </div>
                
                {/* Quick Action Prompts - Always Visible */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="flex items-center gap-3 text-left text-sm px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-md transition-all text-gray-700 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid={`quick-prompt-${i}`}
                    >
                      <span className="text-lg">{prompt.icon}</span>
                      <span className="flex-1 font-medium">{prompt.text}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-800 shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Suggested Workflow */}
          {suggestedWorkflow && !requiresSignup && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 py-3 bg-emerald-50 border-t border-emerald-100"
            >
              <Link href={suggestedWorkflow.path}>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md">
                  <Sparkles className="h-4 w-4" />
                  Try: {suggestedWorkflow.label}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </motion.div>
          )}

          {/* Sign Up Prompt */}
          {requiresSignup && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200"
            >
              <p className="text-sm text-amber-800 mb-3 font-medium text-center">
                Ready to unlock unlimited access?
              </p>
              <a href="/api/login">
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                  <Sparkles className="h-4 w-4" />
                  Sign Up Free — Continue Chatting
                  <ArrowRight className="h-4 w-4" />
                </button>
              </a>
            </motion.div>
          )}

          {/* Input Area - Always Visible */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={requiresSignup ? "Sign up to continue..." : "Ask about bills, rights, insurance, health..."}
                disabled={isLoading || requiresSignup}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                data-testid="demo-chat-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || requiresSignup}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                data-testid="demo-chat-send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
