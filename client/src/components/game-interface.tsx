import { useState } from "react";
import { PatientPanel } from "./patient-panel";
import { ChatInterface } from "./chat-interface";
import { DifferentialDiagnosisPanel } from "./differential-diagnosis";
import { PhysicalExamSimulator } from "./physical-exam-simulator";
import { ClinicalReasoningPanel } from "./clinical-reasoning-panel";
import { Button } from "@/components/ui/button";
import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { Brain, Stethoscope, Lightbulb, User, MessageCircle } from "lucide-react";
import type { MedicalCase } from "@shared/schema";

interface GameInterfaceProps {
  medicalCase: MedicalCase;
}

export function GameInterface({ medicalCase }: GameInterfaceProps) {
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionsList, setQuestionsList] = useState<string[]>([]);
  const [showDifferentials, setShowDifferentials] = useState(false);
  const [showPhysicalExam, setShowPhysicalExam] = useState(false);
  const [showClinicalReasoning, setShowClinicalReasoning] = useState(false);
  const [activePanel, setActivePanel] = useState<'patient' | 'chat'>('chat');

  const handleQuestionAsked = (question: string) => {
    setQuestionsAsked(prev => prev + 1);
    setQuestionsList(prev => [...prev, question]);
  };

  return (
    <MobileLayout 
      title="Patient Interview"
      subtitle={`${medicalCase.name} • ${medicalCase.specialty} Case`}
    >
      {/* iOS-Style Segmented Control */}
      <MobileCard className="p-2 mb-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActivePanel('chat')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activePanel === 'chat'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="tab-chat"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Interview</span>
          </button>
          <button
            onClick={() => setActivePanel('patient')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activePanel === 'patient'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="tab-patient"
          >
            <User className="h-5 w-5" />
            <span>Patient Info</span>
          </button>
        </div>
      </MobileCard>
      
      {/* Panel Content */}
      {activePanel === 'patient' ? (
        <PatientPanel 
          medicalCase={medicalCase} 
          questionsAsked={questionsAsked}
          timeElapsed={timeElapsed}
        />
      ) : (
        <ChatInterface 
          medicalCase={medicalCase}
          onQuestionAsked={handleQuestionAsked}
          onTimeUpdate={setTimeElapsed}
        />
      )}
      
      {/* Advanced Learning Tools - Only show on Chat panel */}
      {activePanel === 'chat' && (
        <MobileCard className="p-4 mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Learning Tools</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => setShowDifferentials(true)}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 py-3"
              data-testid="button-differential-diagnosis"
            >
              <Brain className="h-4 w-4" />
              Differential Diagnosis
            </Button>
            <Button
              onClick={() => setShowPhysicalExam(true)}
              variant="outline"
              className="flex items-center justify-center gap-2 w-full py-3"
              data-testid="button-physical-exam-simulator"
            >
              <Stethoscope className="h-4 w-4" />
              Physical Exam Simulator
            </Button>
            <Button
              onClick={() => setShowClinicalReasoning(true)}
              variant="outline"
              className="flex items-center justify-center gap-2 w-full py-3"
              data-testid="button-clinical-reasoning"
            >
              <Lightbulb className="h-4 w-4" />
              Clinical Reasoning
            </Button>
          </div>
        </MobileCard>
      )}

      {/* Advanced Learning Panels */}
      <DifferentialDiagnosisPanel
        caseId={medicalCase.id}
        isVisible={showDifferentials}
        onClose={() => setShowDifferentials(false)}
      />
      <PhysicalExamSimulator
        caseId={medicalCase.id}
        isVisible={showPhysicalExam}
        onClose={() => setShowPhysicalExam(false)}
      />
      <ClinicalReasoningPanel
        caseId={medicalCase.id}
        questionsAsked={questionsList}
        isVisible={showClinicalReasoning}
        onClose={() => setShowClinicalReasoning(false)}
      />
    </MobileLayout>
  );
}
