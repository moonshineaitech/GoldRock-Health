import { useState } from "react";
import { PatientPanel } from "./patient-panel";
import { ChatInterface } from "./chat-interface";
import { DifferentialDiagnosisPanel } from "./differential-diagnosis";
import { PhysicalExamSimulator } from "./physical-exam-simulator";
import { ClinicalReasoningPanel } from "./clinical-reasoning-panel";
import { Button } from "@/components/ui/button";
import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { Brain, Stethoscope, Lightbulb, User, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    >
      {/* Case Info Header */}
      <MobileCard className="p-4 mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-indigo-900">{medicalCase.name}</h2>
          <p className="text-indigo-600 text-sm">{medicalCase.specialty} Case</p>
        </div>
      </MobileCard>

      {/* iOS-Style Segmented Control with Animation */}
      <MobileCard className="p-2 mb-4">
        <div className="relative flex bg-gray-100 rounded-2xl p-1">
          {/* Animated Background */}
          <motion.div
            className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm"
            initial={false}
            animate={{
              left: activePanel === 'chat' ? '4px' : '50%',
              right: activePanel === 'chat' ? '50%' : '4px',
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.8
            }}
          />
          
          <button
            onClick={() => setActivePanel('chat')}
            className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
              activePanel === 'chat'
                ? 'text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="tab-chat"
          >
            <motion.div
              animate={{ scale: activePanel === 'chat' ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <MessageCircle className="h-5 w-5" />
            </motion.div>
            <span>Interview</span>
          </button>
          
          <button
            onClick={() => setActivePanel('patient')}
            className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
              activePanel === 'patient'
                ? 'text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="tab-patient"
          >
            <motion.div
              animate={{ scale: activePanel === 'patient' ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <User className="h-5 w-5" />
            </motion.div>
            <span>Patient Info</span>
          </button>
        </div>
      </MobileCard>
      
      {/* Panel Content with Smooth Transitions */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activePanel === 'patient' ? (
            <motion.div
              key="patient"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              <PatientPanel 
                medicalCase={medicalCase} 
                questionsAsked={questionsAsked}
                timeElapsed={timeElapsed}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              <ChatInterface 
                medicalCase={medicalCase}
                onQuestionAsked={() => handleQuestionAsked("")}
                onTimeUpdate={setTimeElapsed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Advanced Learning Tools - Only show on Chat panel with Animation */}
      <AnimatePresence>
        {activePanel === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: 0.1
            }}
          >
            <MobileCard className="p-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Learning Tools</h3>
              <div className="grid grid-cols-1 gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    onClick={() => setShowDifferentials(true)}
                    className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 py-3 hover:scale-105 transition-transform duration-200"
                    data-testid="button-differential-diagnosis"
                  >
                    <Brain className="h-4 w-4" />
                    Differential Diagnosis
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    onClick={() => setShowPhysicalExam(true)}
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full py-3 hover:scale-105 transition-transform duration-200"
                    data-testid="button-physical-exam-simulator"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Physical Exam Simulator
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    onClick={() => setShowClinicalReasoning(true)}
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full py-3 hover:scale-105 transition-transform duration-200"
                    data-testid="button-clinical-reasoning"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Clinical Reasoning
                  </Button>
                </motion.div>
              </div>
            </MobileCard>
          </motion.div>
        )}
      </AnimatePresence>

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
