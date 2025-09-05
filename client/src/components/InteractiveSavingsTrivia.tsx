import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb,
  Calculator,
  PiggyBank,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface InteractiveSavingsTriviaProps {
  isVisible: boolean;
  progress: number; // 0-100
  currentStage: string;
  fileCount?: number;
}

const triviaQuestions = [
  {
    id: 1,
    icon: DollarSign,
    question: "What percentage of medical bills contain billing errors?",
    options: ["20%", "50%", "80%", "95%"],
    correctAnswer: 2,
    explanation: "Studies show 80% of medical bills contain errors, ranging from $2,000-$35,000+ in overcharges!",
    savingsTip: "Always request an itemized bill - it's your legal right and the first step to finding errors.",
    color: "text-green-500",
    bgColor: "bg-green-100"
  },
  {
    id: 2,
    icon: TrendingUp,
    question: "What's the average hospital markup on medical services?",
    options: ["150%", "250%", "350%", "417%"],
    correctAnswer: 3,
    explanation: "Hospital markups average 417% above actual cost - that's why negotiation is so powerful!",
    savingsTip: "Use Medicare rates as a baseline for negotiations - hospitals often accept 200-300% of Medicare rates.",
    color: "text-orange-500",
    bgColor: "bg-orange-100"
  },
  {
    id: 3,
    icon: PiggyBank,
    question: "How much can the average patient save by disputing billing errors?",
    options: ["$1,200", "$3,500", "$8,500", "$15,000"],
    correctAnswer: 2,
    explanation: "The average patient saves $8,500 when successfully disputing documented billing errors!",
    savingsTip: "Document everything - keep records of all communications with billing departments for maximum leverage.",
    color: "text-purple-500",
    bgColor: "bg-purple-100"
  },
  {
    id: 4,
    icon: Target,
    question: "What income threshold typically qualifies for hospital charity care?",
    options: ["100% FPL", "200% FPL", "400% FPL", "600% FPL"],
    correctAnswer: 2,
    explanation: "Many hospitals offer charity care for incomes up to 400% of Federal Poverty Level - that's ~$120K for a family of 4!",
    savingsTip: "Even with insurance, you may qualify for charity care if your medical bills exceed 5-10% of annual income.",
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  },
  {
    id: 5,
    icon: AlertCircle,
    question: "What's the #1 most common billing error found in hospital bills?",
    options: ["Duplicate charges", "Upcoding", "Phantom charges", "Unbundling"],
    correctAnswer: 0,
    explanation: "Duplicate charges are the most common error - the same service billed multiple times, often on different dates.",
    savingsTip: "Cross-reference all charges with your medical records and look for identical CPT codes on different dates.",
    color: "text-red-500",
    bgColor: "bg-red-100"
  },
  {
    id: 6,
    icon: Calculator,
    question: "How much time do you have to dispute medical bills after receiving them?",
    options: ["30 days", "90 days", "180 days", "1 year"],
    correctAnswer: 2,
    explanation: "Most states give you 180 days to dispute medical bills, but acting faster gives you more leverage!",
    savingsTip: "Start disputing within 30 days for maximum impact - billing departments are more responsive to quick challenges.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100"
  },
  {
    id: 7,
    icon: Award,
    question: "What discount can you typically negotiate for paying a lump sum?",
    options: ["10-20%", "30-50%", "60-80%", "90%+"],
    correctAnswer: 1,
    explanation: "Most hospitals will accept 30-50% discounts for immediate lump sum payments - cash is king!",
    savingsTip: "Always negotiate before setting up payment plans - lump sum discounts disappear once you're on payments.",
    color: "text-teal-500",
    bgColor: "bg-teal-100"
  }
];

export function InteractiveSavingsTrivia({ isVisible, progress, currentStage, fileCount = 1 }: InteractiveSavingsTriviaProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Rotate questions based on progress
  useEffect(() => {
    if (!isVisible) return;
    
    const questionIndex = Math.floor((progress / 100) * triviaQuestions.length);
    const actualIndex = Math.min(questionIndex, triviaQuestions.length - 1);
    
    // Only change question if we haven't answered this one yet
    if (!answeredQuestions.includes(actualIndex)) {
      setCurrentQuestion(actualIndex);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [progress, answeredQuestions, isVisible]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const question = triviaQuestions[currentQuestion];
    
    if (answerIndex === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestion]);
    setShowExplanation(true);
  };

  if (!isVisible) return null;

  const question = triviaQuestions[currentQuestion];
  const IconComponent = question.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Medical Savings Quiz</h1>
          <p className="text-sm text-gray-600">
            Learn while we analyze your {fileCount} page{fileCount > 1 ? 's' : ''}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-emerald-600">
            <Award className="h-3 w-3" />
            <span>Score: {score}/{answeredQuestions.length}</span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{currentStage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full flex items-center justify-end pr-1"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            >
              {progress > 10 && (
                <Zap className="h-2 w-2 text-white animate-pulse" />
              )}
            </motion.div>
          </div>
        </div>

        {/* Question Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${question.bgColor} rounded-xl flex items-center justify-center`}>
              <IconComponent className={`h-5 w-5 ${question.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {question.question}
              </h3>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2 mb-4">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-3 text-left rounded-xl border-2 transition-all duration-200 text-sm font-medium";
              
              if (selectedAnswer === null) {
                buttonClass += " border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700";
              } else if (index === question.correctAnswer) {
                buttonClass += " border-green-400 bg-green-50 text-green-700";
              } else if (selectedAnswer === index && index !== question.correctAnswer) {
                buttonClass += " border-red-400 bg-red-50 text-red-700";
              } else {
                buttonClass += " border-gray-200 bg-gray-50 text-gray-500";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer !== null && (
                      <div>
                        {index === question.correctAnswer ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : selectedAnswer === index ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800 text-xs leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-800 text-xs font-medium mb-1">💡 Pro Tip:</p>
                      <p className="text-emerald-700 text-xs leading-relaxed">
                        {question.savingsTip}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom encouragement */}
        <motion.p 
          className="text-center text-xs text-gray-500 mt-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Keep learning while we find every dollar you can save! 💰
        </motion.p>
      </div>
    </motion.div>
  );
}