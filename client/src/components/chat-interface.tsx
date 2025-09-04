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
  List
} from "lucide-react";
import { DiagnosisModal } from "./diagnosis-modal";
import { TestOrderingModal } from "./test-ordering-modal";
import { ComprehensivePhysicalExamModal } from "./comprehensive-physical-exam-modal";
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [startTime] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTestOrdering, setShowTestOrdering] = useState(false);
  const [showPhysicalExam, setShowPhysicalExam] = useState(false);
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

  const handleQuickQuestion = (question: string) => {
    setCurrentQuestion(question);
    askQuestionMutation.mutate(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const playAudio = (audioUrl: string) => {
    // In a real implementation, this would play the audio file
    toast({
      title: "Audio",
      description: "Playing patient response...",
    });
  };

  const quickQuestions = [
    "Can you describe the pain in more detail?",
    "When did the symptoms first start?",
    "What makes it better or worse?",
    "Have you experienced this before?",
    "Are you taking any medications?",
    "Do you have any allergies?",
    "Any family history of similar problems?",
    "Rate your pain from 1 to 10"
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="text-white h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Patient Interview</h3>
              <p className="text-indigo-100 text-sm">{medicalCase.name} • {medicalCase.specialty} Case</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 w-2 h-2 rounded-full"></span>
            <span className="text-indigo-100 text-sm">Patient Ready</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 space-y-4 bg-gradient-to-b from-white to-slate-50 overflow-y-auto max-h-96">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">Start the interview by asking your first question</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'doctor' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
            {message.type === 'system' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 max-w-md text-center">
                <p className="text-emerald-700 text-sm font-medium whitespace-pre-line">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className={`rounded-2xl px-4 py-3 max-w-xs ${
                message.type === 'doctor' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 rounded-tl-sm shadow-sm'
              }`}>
                <p className={`text-sm ${message.type === 'doctor' ? 'text-white' : 'text-slate-700'}`}>
                  {message.content}
                </p>
                <div className={`flex items-center justify-between mt-2 ${message.type === 'doctor' ? 'justify-end' : 'justify-between'}`}>
                  {message.type === 'doctor' && message.inputMethod && (
                    <div className="flex items-center space-x-1">
                      {message.inputMethod === 'voice' ? (
                        <Mic className="text-indigo-200 h-3 w-3" />
                      ) : (
                        <List className="text-indigo-200 h-3 w-3" />
                      )}
                      <span className="text-indigo-200 text-xs capitalize">{message.inputMethod}</span>
                    </div>
                  )}
                  {message.type === 'patient' && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Volume2 className="text-slate-400 h-3 w-3" />
                        <span className="text-slate-400 text-xs">ElevenLabs AI</span>
                      </div>
                      {message.audioUrl && (
                        <button 
                          onClick={() => playAudio(message.audioUrl!)}
                          className="text-indigo-600 hover:text-indigo-700 text-xs"
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
      </div>

      {/* Input Controls */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-t border-slate-200">
        {/* Quick Actions */}
        <div className="mb-3">
          <div className="flex space-x-2 mb-3">
            <Button 
              variant="outline" 
              className="flex-1 bg-white border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-colors text-left justify-start"
              onClick={() => handleQuickQuestion("Tell me more about your symptoms")}
              data-testid="button-quick-questions"
            >
              <List className="text-slate-400 mr-2 h-4 w-4" />
              Quick Questions
            </Button>
            <Button 
              variant="outline"
              className="flex-1 bg-white border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-colors text-left justify-start"
              onClick={() => setShowPhysicalExam(true)}
              data-testid="button-physical-exam"
            >
              <Stethoscope className="text-slate-400 mr-2 h-4 w-4" />
              Physical Exam
            </Button>
            <Button 
              variant="outline"
              className="flex-1 bg-white border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-colors text-left justify-start"
              onClick={() => setShowTestOrdering(true)}
              data-testid="button-order-tests"
            >
              <TestTubeDiagonal className="text-slate-400 mr-2 h-4 w-4" />
              Order Tests
            </Button>
          </div>
        </div>

        {/* Quick Questions Dropdown */}
        {messages.length < 5 && (
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.slice(0, 4).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start text-xs p-2 h-auto"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Main Input */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Input 
              placeholder="Type your question or select from dropdown..."
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              disabled={askQuestionMutation.isPending}
            />
            <Button 
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              onClick={handleSendMessage}
              disabled={!currentQuestion.trim() || askQuestionMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isSupported && (
            <Button 
              className={`px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              }`}
              onClick={handleVoiceToggle}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span className="font-medium">{isListening ? 'Stop' : 'Voice'}</span>
            </Button>
          )}
          
          <DiagnosisModal 
            onSubmit={(diagnosis, confidence) => {
              submitDiagnosisMutation.mutate({ diagnosis, confidence });
            }}
            isLoading={submitDiagnosisMutation.isPending}
          />
        </div>

        {/* Voice Recording Indicator */}
        {isListening && (
          <div className="mt-3 flex items-center justify-center space-x-3 bg-emerald-50 border border-emerald-200 rounded-xl py-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-700 font-medium">Recording... Speak your question</span>
            <Button 
              size="icon"
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700"
              onClick={stopListening}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Loading State */}
        {askQuestionMutation.isPending && (
          <div className="mt-3 flex items-center justify-center space-x-3 bg-indigo-50 border border-indigo-200 rounded-xl py-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-indigo-700 font-medium">Processing question...</span>
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
      </div>
    </div>
  );
}
