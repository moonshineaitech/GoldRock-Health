import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Sparkles, ArrowRight, Loader2, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SuggestedWorkflow {
  path: string;
  label: string;
}

const placeholderPrompts = [
  "How can I lower my medical bill?",
  "Was I overcharged for my ER visit?",
  "What rights do I have to dispute charges?",
  "Explain my insurance deductible...",
  "Help me negotiate with the hospital...",
];

export function DemoChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(5);
  const [suggestedWorkflow, setSuggestedWorkflow] = useState<SuggestedWorkflow | null>(null);
  const [requiresSignup, setRequiresSignup] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
            content: "You've used all 5 free messages! Sign up free to continue.",
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
          { role: "assistant", content: "Something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => handleSubmit(), 50);
  };

  const quickPrompts = [
    { text: "Find errors in my bill", icon: "🔍" },
    { text: "Know my patient rights", icon: "⚖️" },
    { text: "Negotiate a lower bill", icon: "💰" },
  ];

  const morePrompts = [
    { text: "Explain my insurance benefits", icon: "🏥" },
    { text: "Help with a denied claim", icon: "📋" },
    { text: "Understand medical codes", icon: "🔢" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-md mx-auto mb-6"
      data-testid="demo-chat-container"
    >
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-lg overflow-hidden">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-sm">Ask GoldRock AI</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Free
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <Lock className="h-2.5 w-2.5" />
                <span>Private</span>
                <span className="text-emerald-600 font-medium">• {remaining} left</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages or Quick Actions */}
        <div className="p-3">
          {messages.length === 0 ? (
            <div>
              {/* Quick Action Buttons - Compact Grid */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {quickPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="flex flex-col items-center gap-1 text-center text-xs p-2.5 bg-gray-50 border border-gray-150 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-gray-700"
                    whileTap={{ scale: 0.95 }}
                    data-testid={`quick-prompt-${i}`}
                  >
                    <span className="text-base">{prompt.icon}</span>
                    <span className="font-medium leading-tight">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>

              {/* More Options Dropdown */}
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="w-full flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-emerald-600 py-1.5 transition-colors"
              >
                <span>More options</span>
                {showMoreOptions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              <AnimatePresence>
                {showMoreOptions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {morePrompts.map((prompt, i) => (
                        <motion.button
                          key={i}
                          onClick={() => handleQuickPrompt(prompt.text)}
                          className="flex flex-col items-center gap-1 text-center text-xs p-2.5 bg-gray-50 border border-gray-150 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-gray-700"
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-base">{prompt.icon}</span>
                          <span className="font-medium leading-tight">{prompt.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="max-h-[150px] overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
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
                  <div className="bg-gray-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                    <span className="text-xs text-gray-600">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Suggested Workflow */}
        {suggestedWorkflow && !requiresSignup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 pb-2">
            <Link href={suggestedWorkflow.path}>
              <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-semibold">
                <Sparkles className="h-3 w-3" />
                Try: {suggestedWorkflow.label}
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </motion.div>
        )}

        {/* Sign Up Prompt */}
        {requiresSignup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 pb-3">
            <a href="/api/login">
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-bold">
                <Sparkles className="h-3 w-3" />
                Sign Up Free to Continue
                <ArrowRight className="h-3 w-3" />
              </button>
            </a>
          </motion.div>
        )}

        {/* Input - Always Visible with Rotating Placeholder */}
        <form onSubmit={handleSubmit} className="px-3 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || requiresSignup}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 placeholder:text-gray-400"
                data-testid="demo-chat-input"
              />
              {!input && (
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none"
                >
                  {placeholderPrompts[placeholderIndex]}
                </motion.span>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || requiresSignup}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 shadow"
              data-testid="demo-chat-send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
