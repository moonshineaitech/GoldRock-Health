import { useState } from "react";
import { PatientPanel } from "./patient-panel";
import { ChatInterface } from "./chat-interface";
import { DifferentialDiagnosisPanel } from "./differential-diagnosis";
import { PhysicalExamSimulator } from "./physical-exam-simulator";
import { ClinicalReasoningPanel } from "./clinical-reasoning-panel";
import { Button } from "@/components/ui/button";
import { Brain, Stethoscope, Lightbulb } from "lucide-react";
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

  const handleQuestionAsked = (question: string) => {
    setQuestionsAsked(prev => prev + 1);
    setQuestionsList(prev => [...prev, question]);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Interactive Training Interface</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience our multi-modal learning environment with voice interactions, 
            real-time feedback, and comprehensive patient data.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <PatientPanel 
              medicalCase={medicalCase} 
              questionsAsked={questionsAsked}
              timeElapsed={timeElapsed}
            />
            <ChatInterface 
              medicalCase={medicalCase}
              onQuestionAsked={handleQuestionAsked}
              onTimeUpdate={setTimeElapsed}
            />
          </div>
          
          {/* Advanced Learning Tools */}
          <div className="border-t border-slate-200 p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Advanced Learning Tools</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowDifferentials(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Brain className="h-4 w-4" />
                Differential Diagnosis
              </Button>
              <Button
                onClick={() => setShowPhysicalExam(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Stethoscope className="h-4 w-4" />
                Physical Exam Simulator
              </Button>
              <Button
                onClick={() => setShowClinicalReasoning(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Clinical Reasoning
              </Button>
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
}
