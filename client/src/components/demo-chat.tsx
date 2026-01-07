import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Sparkles, ArrowRight, Loader2, Lock, ChevronDown, ChevronUp } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SuggestedWorkflow {
  path: string;
  label: string;
}

const placeholderPrompts = [
  "I have a $5,000 hospital bill...",
  "Was I overcharged for my ER visit?",
  "How do I dispute this charge?",
  "Can I negotiate my bill down?",
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
    }, 3500);
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
            content: "You've used all 5 free messages! Sign up free to continue and unlock full bill analysis.",
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
    if (isLoading || requiresSignup) return;
    
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);
    setSuggestedWorkflow(null);

    fetch("/api/demo-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: messages,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error && data.remaining === 0) {
          setRequiresSignup(true);
          setRemaining(0);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "You've used all 5 free messages! Sign up free to continue." },
          ]);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
          setRemaining(data.remaining ?? remaining);
          if (data.suggestedWorkflow) setSuggestedWorkflow(data.suggestedWorkflow);
          if (data.requiresSignup) setRequiresSignup(true);
        }
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection error." }]);
      })
      .finally(() => setIsLoading(false));
  };

  const quickPrompts = [
    { text: "Scan my bill for errors", icon: "🔍" },
    { text: "Reduce my bill amount", icon: "💰" },
    { text: "Dispute unfair charges", icon: "⚖️" },
  ];

  const morePrompts = [
    { text: "Appeal a denied claim", icon: "📋" },
    { text: "Understand my EOB", icon: "📄" },
    { text: "Find financial assistance", icon: "🏥" },
  ];

  // Format message content with paragraph breaks
  const formatMessage = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => (
      <span key={i} className={i > 0 ? "block mt-2" : ""}>
        {paragraph}
      </span>
    ));
  };

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
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow">
              <MessageCircle className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-sm">Ask GoldRock AI</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Free
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-gray-500">
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
                    className="flex flex-col items-center gap-1 text-center text-[11px] p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-gray-700"
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
                className="w-full flex items-center justify-center gap-1 text-[10px] text-gray-500 hover:text-emerald-600 py-1 transition-colors"
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
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {morePrompts.map((prompt, i) => (
                        <motion.button
                          key={i}
                          onClick={() => handleQuickPrompt(prompt.text)}
                          className="flex flex-col items-center gap-1 text-center text-[11px] p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-gray-700"
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
            <div 
              ref={messagesContainerRef}
              className="overflow-y-auto space-y-3"
              style={{ maxHeight: messages.length > 2 ? '300px' : 'none' }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] px-3.5 py-3 rounded-2xl text-[13px] leading-[1.5] ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formatMessage(msg.content)}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-100 px-3.5 py-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                    <span className="text-[13px] text-gray-600">Analyzing...</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Suggested Workflow - Routes to login with redirect */}
        {suggestedWorkflow && !requiresSignup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 pb-2">
            <a href={`/api/login?redirect=${encodeURIComponent(suggestedWorkflow.path)}`}>
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-shadow">
                <Sparkles className="h-3 w-3" />
                Try: {suggestedWorkflow.label}
                <ArrowRight className="h-3 w-3" />
              </button>
            </a>
          </motion.div>
        )}

        {/* Sign Up Prompt */}
        {requiresSignup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 pb-3">
            <a href="/api/login">
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-md">
                <Sparkles className="h-3 w-3" />
                Sign Up Free to Continue
                <ArrowRight className="h-3 w-3" />
              </button>
            </a>
          </motion.div>
        )}

        {/* Input - Better text visibility and centering */}
        <form onSubmit={handleSubmit} className="px-3 pb-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || requiresSignup}
                placeholder=""
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                style={{ lineHeight: '1' }}
                data-testid="demo-chat-input"
              />
              {!input && (
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none font-normal"
                >
                  {placeholderPrompts[placeholderIndex]}
                </motion.span>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || requiresSignup}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 shadow"
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
