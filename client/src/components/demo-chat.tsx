import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Sparkles, ArrowRight, X, Loader2, Lock } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
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

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

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
            content: "You've used all 5 free messages! Sign up for free to continue chatting and access all our powerful tools.",
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

  const quickPrompts = [
    "How can you help me with my medical bill?",
    "What are my patient rights?",
    "How do I know if I was overcharged?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mb-8"
      data-testid="demo-chat-container"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div
              onClick={() => setIsExpanded(true)}
              className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl p-4 cursor-pointer hover:shadow-2xl transition-all duration-300 group"
              data-testid="demo-chat-collapsed"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Ask GoldRock AI</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      Free Demo
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Ask about medical bills, patient rights, or health questions...</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-emerald-600 transition-colors">
                  <Sparkles className="h-4 w-4" />
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            className="relative"
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">GoldRock AI Assistant</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="h-3 w-3" />
                      <span>Private & Secure</span>
                      <span className="text-emerald-600 font-medium">• {remaining} free messages left</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="demo-chat-close"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4 text-sm">Hi! I'm here to help with medical bills, insurance, and health questions.</p>
                    <div className="space-y-2">
                      {quickPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(prompt);
                            setTimeout(() => handleSubmit(), 100);
                          }}
                          className="block w-full text-left text-sm px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-gray-700"
                          data-testid={`quick-prompt-${i}`}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {suggestedWorkflow && !requiresSignup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-2 bg-emerald-50 border-t border-emerald-100"
                >
                  <Link href={suggestedWorkflow.path}>
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md">
                      <Sparkles className="h-4 w-4" />
                      Try: {suggestedWorkflow.label}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </motion.div>
              )}

              {requiresSignup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200"
                >
                  <p className="text-sm text-amber-800 mb-2 font-medium text-center">
                    Ready to unlock unlimited access?
                  </p>
                  <a href="/api/login">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                      <Sparkles className="h-4 w-4" />
                      Sign Up Free — Continue Chatting
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </a>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={requiresSignup ? "Sign up to continue..." : "Ask about bills, rights, insurance..."}
                    disabled={isLoading || requiresSignup}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="demo-chat-input"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || requiresSignup}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    data-testid="demo-chat-send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
