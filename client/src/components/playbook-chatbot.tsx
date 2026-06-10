import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Receipt,
  Lightbulb,
  FileText,
  Scale,
  DollarSign,
  AlertTriangle,
  Copy,
  Check
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  {
    icon: Receipt,
    text: "How do I request an itemized bill?",
    category: "First Steps"
  },
  {
    icon: AlertTriangle,
    text: "What billing errors should I look for on my hospital bill?",
    category: "Bill Review"
  },
  {
    icon: DollarSign,
    text: "How can I negotiate my hospital bill down?",
    category: "Negotiation"
  },
  {
    icon: FileText,
    text: "How do I apply for charity care or financial assistance?",
    category: "Financial Help"
  },
  {
    icon: Scale,
    text: "What are my legal rights when disputing a hospital bill?",
    category: "Legal Rights"
  },
  {
    icon: Lightbulb,
    text: "How do I prevent my bill from going to collections?",
    category: "Prevention"
  }
];

function formatMessageContent(content: string): JSX.Element {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  
  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-foreground mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-md font-semibold text-foreground mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, '');
      const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <div key={index} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
            {line.match(/^(\d+)\./)?.[1]}
          </span>
          <span 
            className="text-foreground"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        </div>
      );
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      const text = line.replace(/^[-•]\s/, '');
      const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <div key={index} className="flex items-start gap-2 ml-4 my-1">
          <span className="text-gold mt-1">•</span>
          <span 
            className="text-foreground"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        </div>
      );
    } else if (line.includes('**')) {
      const formattedText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <p 
          key={index} 
          className="text-foreground my-1"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    } else if (line.trim() === '') {
      elements.push(<div key={index} className="h-2" />);
    } else {
      elements.push(
        <p key={index} className="text-foreground my-1">
          {line}
        </p>
      );
    }
  });
  
  return <div className="space-y-1">{elements}</div>;
}

export function PlaybookChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Hospital Bill Defense Assistant. I can help you understand your hospital bill, find errors, negotiate reductions, and prevent your bill from going to collections.\n\n**What I can help with:**\n\n1. **Bill Analysis** - Identify overcharges and billing errors\n2. **Negotiation Scripts** - Word-for-word scripts to reduce your bill\n3. **Financial Assistance** - Find charity care and payment options\n4. **Legal Rights** - Understand your protections\n5. **Prevention Strategies** - Keep your bill out of collections\n\nTell me about your situation or select a topic below to get started!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/pre-collections-chat", {
        message: text,
        conversationHistory: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again or contact CONTACT@GOLDROCK.ai for assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="bg-card border-b border-border rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-serif text-foreground">
          <Bot className="h-6 w-6 text-gold" />
          Pre-Collections Bill Defense AI
          <Badge className="bg-secondary text-muted-foreground ml-2">Live Help</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary"
                style={message.role === "user" ? undefined : { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`max-w-[80%] rounded-lg p-3 relative group ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}>
                {message.role === "assistant" ? (
                  <>
                    {formatMessageContent(message.content)}
                    <button
                      onClick={() => copyMessage(message.content, index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-sm text-muted-foreground">Analyzing your situation...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => {
                const IconComponent = question.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question.text)}
                    className="flex items-start gap-2 p-2 text-left text-xs bg-card hover:bg-secondary rounded-lg transition-colors border border-border"
                    disabled={isLoading}
                  >
                    <div className="p-1 bg-secondary rounded flex-shrink-0">
                      <IconComponent className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-foreground line-clamp-2">{question.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your bill situation or ask a question..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground px-4"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            For complex cases, email <a href="mailto:CONTACT@GOLDROCK.ai" className="text-gold hover:underline">CONTACT@GOLDROCK.ai</a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
