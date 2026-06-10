import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { useVoice } from "@/hooks/use-voice";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  Stethoscope,
  TestTubeDiagonal,
  List,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { DiagnosisModal } from "./diagnosis-modal";
import { TestOrderingModal } from "./test-ordering-modal";
import { ComprehensivePhysicalExamModal } from "./comprehensive-physical-exam-modal";
import { MobileCard } from "@/components/mobile-layout";
import { motion, AnimatePresence } from "framer-motion";
import type { MedicalCase } from "@shared/schema";

interface ChatInterfaceProps {
  medicalCase: MedicalCase;
  onQuestionAsked: () => void;
  onTimeUpdate: (seconds: number) => void;
}

interface ChatMessage {
  type: "doctor" | "patient" | "system";
  content: string;
  timestamp: string;
  audioUrl?: string;
  inputMethod?: "voice" | "text" | "dropdown";
}

export function ChatInterface({ medicalCase, onQuestionAsked, onTimeUpdate }: ChatInterfaceProps) {
  // Safety check for medicalCase
  if (!medicalCase) {
    return (
      <MobileCard className="p-4 text-center">
        <p className="text-muted-foreground">Loading medical case...</p>
      </MobileCard>
    );
  }
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [startTime] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTestOrdering, setShowTestOrdering] = useState(false);
  const [showPhysicalExam, setShowPhysicalExam] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const { toast } = useToast();
  
  const { 
    isListening, 
    isSupported, 
    startListening, 
    stopListening, 
    transcript,
    resetTranscript 
  } = useVoice();

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      onTimeUpdate(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onTimeUpdate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      setCurrentQuestion(transcript);
    }
  }, [transcript]);

  const askQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest(`/api/cases/${medicalCase.id}/ask`, {
        method: 'POST',
        body: JSON.stringify({ question }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add doctor's question
      setMessages(prev => [...prev, {
        type: "doctor",
        content: data.question,
        timestamp: new Date().toISOString(),
        inputMethod: isListening ? "voice" : "text"
      }]);

      // Add patient's response
      setMessages(prev => [...prev, {
        type: "patient",
        content: data.response,
        timestamp: new Date().toISOString(),
        audioUrl: data.audioUrl
      }]);

      onQuestionAsked();
      setCurrentQuestion("");
      resetTranscript();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process question. Please try again.",
        variant: "destructive",
      });
    }
  });

  const submitDiagnosisMutation = useMutation({
    mutationFn: async (diagnosis: { diagnosis: string; confidence: number }) => {
      const response = await apiRequest(`/api/cases/${medicalCase.id}/diagnose`, {
        method: 'POST',
        body: JSON.stringify({
          ...diagnosis,
          questionsAsked: messages.filter(m => m.type === "doctor").map(m => m.content),
          timeElapsed: Math.floor((Date.now() - startTime) / 1000)
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        type: "system",
        content: `Diagnosis Result: ${data.correct ? 'Correct!' : 'Incorrect'}\n\nCorrect Diagnosis: ${data.correctDiagnosis}\n\nFeedback: ${data.feedback}\n\nScore: ${data.score}/100`,
        timestamp: new Date().toISOString()
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!currentQuestion.trim()) return;
    askQuestionMutation.mutate(currentQuestion);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setCurrentQuestion(question);
    setShowQuickQuestions(false);
    askQuestionMutation.mutate(question);
  };

  const quickQuestions = [
    "Can you describe the pain in more detail?",
    "When did the symptoms first start?",
    "What makes it better or worse?",
    "Have you experienced this before?",
    "Are you taking any medications?",
    "Do you have any allergies?"
  ];

  const playAudio = (audioUrl: string) => {
    // In a real implementation, this would play the audio file
    toast({
      title: "Audio",
      description: "Playing patient response...",
    });
  };


  return (
    <div className="w-full flex flex-col mb-4">
      {/* Chat Header */}
      <MobileCard className="bg-card border border-border p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
            >
              <Stethoscope className="text-white h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-foreground">Patient Interview</h3>
              <p className="text-muted-foreground text-sm">{medicalCase.name} • {medicalCase.specialty} Case</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-600 w-2 h-2 rounded-full"></span>
            <span className="text-muted-foreground text-sm">Patient Ready</span>
          </div>
        </div>
      </MobileCard>

      {/* Chat Messages */}
      <MobileCard 
        className="flex-1 p-6 space-y-6 bg-card overflow-y-auto min-h-[350px] max-h-[450px] mb-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground text-lg font-medium">Ready to begin the interview</p>
            <p className="text-muted-foreground text-sm mt-2">Ask your first question to start the patient interaction</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'doctor' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
            {message.type === 'system' ? (
              <div className="bg-secondary border border-border rounded-xl px-4 py-3 max-w-md text-center">
                <p className="text-foreground text-sm font-medium whitespace-pre-line">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className={`rounded-3xl px-5 py-4 max-w-[85%] shadow-sm ${
                message.type === 'doctor' 
                  ? 'bg-primary text-primary-foreground rounded-br-lg ml-8'
                  : 'bg-card border border-border text-foreground rounded-bl-lg mr-8'
              }`}>
                <p className={`text-base leading-relaxed ${message.type === 'doctor' ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {message.content}
                </p>
                <div className={`flex items-center justify-between mt-3 ${message.type === 'doctor' ? 'justify-end' : 'justify-between'}`}>
                  {message.type === 'doctor' && message.inputMethod && (
                    <div className="flex items-center space-x-1 opacity-80">
                      {message.inputMethod === 'voice' ? (
                        <Mic className="text-primary-foreground h-3 w-3" />
                      ) : (
                        <List className="text-primary-foreground h-3 w-3" />
                      )}
                      <span className="text-primary-foreground text-xs capitalize">{message.inputMethod}</span>
                    </div>
                  )}
                  {message.type === 'patient' && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Volume2 className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-xs">ElevenLabs AI</span>
                      </div>
                      {message.audioUrl && (
                        <button 
                          onClick={() => playAudio(message.audioUrl!)}
                          className="text-gold hover:opacity-80 text-xs"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MobileCard>

      {/* Input Controls */}
      <MobileCard className="p-6">
        {/* Examination Actions with iOS Animations */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                className="w-full bg-card border border-border text-foreground hover:bg-secondary py-4 rounded-2xl font-medium shadow-sm transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => setShowPhysicalExam(true)}
                data-testid="button-physical-exam"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Stethoscope className="h-5 w-5" />
                </motion.div>
                <span>Physical Exam</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                className="w-full text-white py-4 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                onClick={() => setShowTestOrdering(true)}
                data-testid="button-order-tests"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <TestTubeDiagonal className="h-5 w-5" />
                </motion.div>
                <span>Order Tests</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Quick Questions Dropdown with iOS Animation */}
        <div className="mb-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-all duration-200 hover:scale-105"
              data-testid="button-quick-questions-toggle"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: showQuickQuestions ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <List className="h-5 w-5 text-gold" />
                </motion.div>
                <span className="font-medium text-foreground">Quick Questions</span>
              </div>
              <motion.div
                animate={{ rotate: showQuickQuestions ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </Button>
          </motion.div>
          
          <AnimatePresence>
            {showQuickQuestions && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8
                }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2 bg-secondary rounded-2xl p-4 border border-border">
                  {quickQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                    >
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleQuickQuestion(question)}
                          className="w-full text-left justify-start py-3 px-4 rounded-xl hover:bg-card hover:shadow-sm transition-all duration-200 text-foreground font-normal border border-transparent hover:border-border"
                          data-testid={`quick-question-${index}`}
                        >
                          {question}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Input with Enhanced Animation */}
        <div className="space-y-4">
          <motion.div
            className="relative"
            whileFocus="focused"
            variants={{
              focused: { scale: 1.02 },
              unfocused: { scale: 1 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Input 
              placeholder="Ask your question here..."
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pr-14 py-5 text-base rounded-2xl border border-border bg-secondary focus:bg-card focus:border-gold focus:ring-0 focus:shadow-sm transition-all duration-300"
              disabled={askQuestionMutation.isPending}
            />
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl shadow-sm transition-all duration-200"
                onClick={handleSendMessage}
                disabled={!currentQuestion.trim() || askQuestionMutation.isPending}
              >
                <motion.div
                  animate={askQuestionMutation.isPending ? { rotate: 360 } : { rotate: 0 }}
                  transition={askQuestionMutation.isPending ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <Send className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
          
          <div className="flex space-x-3">
            {isSupported && (
              <motion.div
                className="flex-1"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button 
                  className={`w-full py-4 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isListening 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-card border border-border text-foreground hover:bg-secondary'
                  }`}
                  onClick={handleVoiceToggle}
                  data-testid="button-voice"
                >
                  <motion.div
                    animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={isListening ? { duration: 1, repeat: Infinity } : {}}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </motion.div>
                  <span className="font-medium">{isListening ? 'Stop Recording' : 'Voice Input'}</span>
                </Button>
              </motion.div>
            )}
            
            <motion.div
              className="flex-1"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => {/* TODO: Add diagnosis modal */}}
                data-testid="button-diagnose"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Send className="h-5 w-5" />
                </motion.div>
                <span className="font-medium">Submit Diagnosis</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Voice Recording Indicator */}
        {isListening && (
          <div className="mt-4 flex items-center justify-center space-x-3 bg-secondary border border-border rounded-2xl py-4 px-6">
            <div className="w-4 h-4 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-foreground font-medium text-base">🎤 Recording... Speak your question</span>
          </div>
        )}

        {/* Loading State */}
        {askQuestionMutation.isPending && (
          <div className="mt-4 flex items-center justify-center space-x-3 bg-secondary border border-border rounded-2xl py-4 px-6">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold"></div>
            <span className="text-foreground font-medium text-base">✨ Processing your question...</span>
          </div>
        )}

        {/* Comprehensive Modals */}
        <TestOrderingModal
          caseId={medicalCase.id}
          isVisible={showTestOrdering}
          onClose={() => setShowTestOrdering(false)}
        />
        <ComprehensivePhysicalExamModal
          caseId={medicalCase.id}
          isVisible={showPhysicalExam}
          onClose={() => setShowPhysicalExam(false)}
        />
      </MobileCard>
    </div>
  );
}
