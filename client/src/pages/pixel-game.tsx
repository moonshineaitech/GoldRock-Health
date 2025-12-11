import { useState, useEffect } from "react";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { motion, AnimatePresence } from "framer-motion";
import { useMedicalCases } from "@/hooks/use-medical-cases";
import { ChatInterface } from "@/components/chat-interface";
import { DifferentialDiagnosisPanel } from "@/components/differential-diagnosis";
import { PhysicalExamSimulator } from "@/components/physical-exam-simulator";
import { ClinicalReasoningPanel } from "@/components/clinical-reasoning-panel";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Heart, 
  Zap, 
  Target, 
  Trophy, 
  Star, 
  Timer, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X, 
  MessageCircle,
  User,
  Brain,
  Stethoscope,
  Lightbulb,
  TestTube,
  Activity,
  Award,
  Plus,
  Minus,
  Play,
  Pause
} from "lucide-react";
import type { MedicalCase } from "@shared/schema";

interface GameState {
  currentCase: MedicalCase | null;
  score: number;
  lives: number;
  level: number;
  timeLeft: number;
  totalGameTime: number;
  gameStatus: 'menu' | 'playing' | 'gameOver' | 'victory' | 'paused';
  selectedSymptoms: string[];
  guessedDiagnosis: string;
  questionsAsked: string[];
  orderedTests: string[];
  completedExams: string[];
  streakCount: number;
  multiplier: number;
  totalPoints: number;
  achievements: string[];
}

interface DiagnosticTest {
  name: string;
  category: string;
  result: string;
  cost: number;
}

export default function PixelGame() {
  const { data: cases, isLoading } = useMedicalCases();
  const [activePanel, setActivePanel] = useState<'patient' | 'chat' | 'exam' | 'reasoning' | 'diagnosis'>('patient');
  const [showDifferentials, setShowDifferentials] = useState(false);
  const [showPhysicalExam, setShowPhysicalExam] = useState(false);
  const [showClinicalReasoning, setShowClinicalReasoning] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    currentCase: null,
    score: 0,
    lives: 3,
    level: 1,
    timeLeft: 120, // Increased time for complex diagnosis
    totalGameTime: 0,
    gameStatus: 'menu',
    selectedSymptoms: [],
    guessedDiagnosis: '',
    questionsAsked: [],
    orderedTests: [],
    completedExams: [],
    streakCount: 0,
    multiplier: 1,
    totalPoints: 0,
    achievements: []
  });

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0 && !isTimerPaused) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ 
          ...prev, 
          timeLeft: prev.timeLeft - 1,
          totalGameTime: prev.totalGameTime + 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.gameStatus === 'playing') {
      handleTimeUp();
    }
  }, [gameState.timeLeft, gameState.gameStatus, isTimerPaused]);

  const startGame = () => {
    if (!cases || cases.length === 0) return;
    
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    setGameState({
      currentCase: randomCase,
      score: 0,
      lives: 3,
      level: 1,
      timeLeft: 120,
      totalGameTime: 0,
      gameStatus: 'playing',
      selectedSymptoms: [],
      guessedDiagnosis: '',
      questionsAsked: [],
      orderedTests: [],
      completedExams: [],
      streakCount: 0,
      multiplier: 1,
      totalPoints: 0,
      achievements: []
    });
    setActivePanel('patient');
  };

  const handleTimeUp = () => {
    // Only lose life when time runs out (not wrong diagnosis)
    setGameState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      gameStatus: prev.lives <= 1 ? 'gameOver' : 'playing',
      timeLeft: 120, // Reset timer for next attempt
      streakCount: 0, // Reset streak on timeout
      multiplier: 1
    }));
    
    if (gameState.lives > 1) {
      // Get new case for next attempt
      if (cases && cases.length > 0) {
        const nextCase = cases[Math.floor(Math.random() * cases.length)];
        setGameState(prev => ({ ...prev, currentCase: nextCase }));
      }
    }
  };

  const handleQuestionAsked = (question: string) => {
    setGameState(prev => ({
      ...prev,
      questionsAsked: [...prev.questionsAsked, question]
    }));
  };

  const orderDiagnosticTest = (testName: string) => {
    setGameState(prev => ({
      ...prev,
      orderedTests: [...prev.orderedTests, testName],
      score: prev.score + 5 // Points for ordering appropriate tests
    }));
  };

  const completePhysicalExam = (examSystem: string) => {
    setGameState(prev => ({
      ...prev,
      completedExams: [...prev.completedExams, examSystem],
      score: prev.score + 10 // Points for thorough examination
    }));
  };

  // AI-powered diagnosis matching instead of exact text matching
  const checkDiagnosisWithAI = async (userDiagnosis: string, correctDiagnosis: string): Promise<boolean> => {
    try {
      const response = await apiRequest('/api/cases/check-diagnosis', {
        method: 'POST',
        body: JSON.stringify({
          userDiagnosis,
          correctDiagnosis,
          symptoms: gameState.currentCase?.symptoms || [],
          questionsAsked: gameState.questionsAsked,
          orderedTests: gameState.orderedTests
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      return result.isCorrect || false;
    } catch (error) {
      console.error('Error checking diagnosis:', error);
      // Fallback to simple text matching
      return userDiagnosis.toLowerCase().includes(correctDiagnosis.toLowerCase());
    }
  };

  const submitDiagnosis = async () => {
    if (!gameState.currentCase || !gameState.guessedDiagnosis.trim()) return;

    setIsTimerPaused(true);
    const isCorrect = await checkDiagnosisWithAI(
      gameState.guessedDiagnosis, 
      gameState.currentCase.correctDiagnosis
    );
    setIsTimerPaused(false);

    if (isCorrect) {
      // Correct diagnosis - calculate bonus points
      const timeBonus = Math.max(0, gameState.timeLeft * 2);
      const thoroughnessBonus = (gameState.questionsAsked.length * 5) + 
                               (gameState.orderedTests.length * 10) + 
                               (gameState.completedExams.length * 15);
      const streakBonus = gameState.streakCount * 50;
      const totalPoints = (100 + timeBonus + thoroughnessBonus + streakBonus) * gameState.multiplier;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + totalPoints,
        totalPoints: prev.totalPoints + totalPoints,
        level: prev.level + 1,
        timeLeft: Math.min(120, prev.timeLeft + 30), // Bonus time for correct answer
        selectedSymptoms: [],
        guessedDiagnosis: '',
        questionsAsked: [],
        orderedTests: [],
        completedExams: [],
        streakCount: prev.streakCount + 1,
        multiplier: Math.min(5, prev.multiplier + 0.5) // Increase multiplier
      }));
      
      // Check for achievements
      checkAchievements(gameState.streakCount + 1, totalPoints);
      
      // Load next case
      if (cases && cases.length > 0) {
        const nextCase = cases[Math.floor(Math.random() * cases.length)];
        setGameState(prev => ({ ...prev, currentCase: nextCase }));
      }
    } else {
      // Wrong diagnosis - penalty: subtract 5 seconds (not lose life)
      setGameState(prev => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 5),
        streakCount: 0, // Reset streak
        multiplier: 1, // Reset multiplier
        guessedDiagnosis: '' // Clear input for retry
      }));
    }
  };

  const checkAchievements = (streak: number, points: number) => {
    const newAchievements: string[] = [];
    
    if (streak >= 3 && !gameState.achievements.includes('Triple Threat')) {
      newAchievements.push('Triple Threat');
    }
    if (streak >= 5 && !gameState.achievements.includes('Diagnostic Master')) {
      newAchievements.push('Diagnostic Master');
    }
    if (points >= 500 && !gameState.achievements.includes('Point Collector')) {
      newAchievements.push('Point Collector');
    }
    if (gameState.orderedTests.length >= 3 && !gameState.achievements.includes('Thorough Investigator')) {
      newAchievements.push('Thorough Investigator');
    }
    
    if (newAchievements.length > 0) {
      setGameState(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentCase: null,
      score: 0,
      lives: 3,
      level: 1,
      timeLeft: 120,
      totalGameTime: 0,
      gameStatus: 'menu',
      selectedSymptoms: [],
      guessedDiagnosis: '',
      questionsAsked: [],
      orderedTests: [],
      completedExams: [],
      streakCount: 0,
      multiplier: 1,
      totalPoints: 0,
      achievements: []
    });
    setActivePanel('patient');
  };

  if (isLoading) {
    return (
      <MobileLayout title="Pixel Doctor Game" showBottomNav={true}>
        <div 
          className="flex items-center justify-center"
          style={{ 
            marginTop: '80px', // Move content down to avoid header overlap
            minHeight: 'calc(100vh - 160px)' 
          }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Pixel Doctor Game" showBottomNav={true}>
      <div 
        className="space-y-4 pb-4" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          margin: '-1rem',
          padding: '1rem',
          paddingTop: '80px', // Move body down to prevent header overlap
          borderRadius: '0'
        }}
      >
        
        {/* Game Menu */}
        {gameState.gameStatus === 'menu' && (
          <motion.div
            className="space-y-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pixelated Game Logo */}
            <motion.div
              className="mx-auto w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{
                imageRendering: 'pixelated',
                background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8, #ff6b6b)'
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Heart className="h-16 w-16 text-white drop-shadow-lg" />
            </motion.div>

            <div>
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg"
                style={{ 
                  fontFamily: 'monospace',
                  textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
                }}>
                PIXEL DOCTOR
              </h1>
              <p className="text-white/90 text-lg font-semibold"
                style={{ fontFamily: 'monospace' }}>
                Full Medical Simulation in Retro Style!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-red-500 rounded-2xl mx-auto mb-2 flex items-center justify-center"
                  style={{ imageRendering: 'pixelated' }}>
                  <Heart className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold">3 LIVES</p>
              </div>
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl mx-auto mb-2 flex items-center justify-center"
                  style={{ imageRendering: 'pixelated' }}>
                  <Timer className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold">2 MINUTES</p>
              </div>
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-yellow-500 rounded-2xl mx-auto mb-2 flex items-center justify-center"
                  style={{ imageRendering: 'pixelated' }}>
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold">AI POWERED</p>
              </div>
            </div>

            {/* Game Features Preview */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: MessageCircle, label: "AI Patient Chat", color: "blue" },
                { icon: Stethoscope, label: "Physical Exams", color: "green" },
                { icon: TestTube, label: "Diagnostic Tests", color: "purple" },
                { icon: Brain, label: "Clinical Reasoning", color: "indigo" }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.label}
                    className={`bg-${feature.color}-500/20 border border-${feature.color}-400 rounded-xl p-3 text-white`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <IconComponent className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs font-bold">{feature.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <MobileButton
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl py-4 shadow-2xl"
              style={{ 
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
              }}
              data-testid="start-game"
            >
              START GAME
            </MobileButton>

            {/* Link to Training Hub */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <Link href="/patient-diagnostics">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-300" />
                    <span className="text-white font-bold text-sm">Want Serious Training?</span>
                  </div>
                  <p className="text-white/70 text-xs">
                    Try our AI Diagnostics Training Hub for step-by-step case studies with scoring and feedback.
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Game Playing */}
        {gameState.gameStatus === 'playing' && gameState.currentCase && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Enhanced Game HUD */}
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>SCORE</div>
                <div className="text-yellow-400 font-black text-sm" style={{ fontFamily: 'monospace' }}>
                  {gameState.score}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>LEVEL</div>
                <div className="text-blue-400 font-black text-sm" style={{ fontFamily: 'monospace' }}>
                  {gameState.level}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>LIVES</div>
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: gameState.lives }).map((_, i) => (
                    <Heart key={i} className="h-3 w-3 text-red-500 fill-current" />
                  ))}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>TIME</div>
                <div className={`font-black text-sm ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`} 
                  style={{ fontFamily: 'monospace' }}>
                  {gameState.timeLeft}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>STREAK</div>
                <div className="text-orange-400 font-black text-sm" style={{ fontFamily: 'monospace' }}>
                  {gameState.streakCount}
                </div>
              </div>
            </div>

            {/* Multiplier and Achievement Indicators */}
            {(gameState.multiplier > 1 || gameState.achievements.length > 0) && (
              <div className="flex justify-center space-x-2">
                {gameState.multiplier > 1 && (
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-black"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {gameState.multiplier}x MULTIPLIER
                  </motion.div>
                )}
                {gameState.achievements.length > 0 && (
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-black">
                    <Award className="h-3 w-3 inline mr-1" />
                    {gameState.achievements.length} ACHIEVEMENTS
                  </div>
                )}
              </div>
            )}

            {/* Panel Navigation */}
            <div className="grid grid-cols-5 gap-1 bg-black/30 rounded-2xl p-2">
              {[
                { id: 'patient', icon: User, label: 'Patient' },
                { id: 'chat', icon: MessageCircle, label: 'Chat' },
                { id: 'exam', icon: Stethoscope, label: 'Exam' },
                { id: 'reasoning', icon: Brain, label: 'Reason' },
                { id: 'diagnosis', icon: Target, label: 'Diagnose' }
              ].map((panel) => {
                const IconComponent = panel.icon;
                return (
                  <button
                    key={panel.id}
                    onClick={() => setActivePanel(panel.id as any)}
                    className={`py-2 px-1 rounded-xl transition-all text-xs font-bold ${
                      activePanel === panel.id
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white/80 hover:bg-white/20'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    <IconComponent className="h-4 w-4 mx-auto mb-1" />
                    <div>{panel.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Panel Content */}
            <AnimatePresence mode="wait">
              {activePanel === 'patient' && (
                <motion.div
                  key="patient"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <MobileCard className="bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300">
                    <div className="text-center">
                      <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'monospace' }}>
                        PATIENT: {gameState.currentCase.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white/60 rounded-lg p-2">
                          <span className="font-bold">AGE:</span> {gameState.currentCase.age}
                        </div>
                        <div className="bg-white/60 rounded-lg p-2">
                          <span className="font-bold">GENDER:</span> {gameState.currentCase.gender}
                        </div>
                      </div>
                      <div className="mt-3 bg-white/80 rounded-lg p-3">
                        <p className="font-bold text-sm mb-1">CHIEF COMPLAINT:</p>
                        <p className="text-gray-800">{gameState.currentCase.chiefComplaint}</p>
                      </div>
                      <div className="mt-3 bg-white/80 rounded-lg p-3">
                        <p className="font-bold text-sm mb-2">AVAILABLE SYMPTOMS:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {(gameState.currentCase.symptoms || []).slice(0, 6).map((symptom, index) => (
                            <div key={index} className="text-xs bg-blue-100 rounded p-1">
                              {symptom}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </MobileCard>
                </motion.div>
              )}

              {activePanel === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-96">
                    <ChatInterface 
                      medicalCase={gameState.currentCase}
                      onQuestionAsked={() => handleQuestionAsked("question")}
                      onTimeUpdate={() => {}}
                    />
                  </div>
                </motion.div>
              )}

              {activePanel === 'exam' && (
                <motion.div
                  key="exam"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <MobileCard>
                    <div className="space-y-3">
                      <h4 className="font-bold text-center">Physical Examination Systems</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Cardiovascular', icon: Heart, color: 'red' },
                          { name: 'Pulmonary', icon: Activity, color: 'blue' },
                          { name: 'Neurological', icon: Brain, color: 'purple' },
                          { name: 'Abdominal', icon: Target, color: 'green' }
                        ].map((system) => {
                          const IconComponent = system.icon;
                          const isCompleted = gameState.completedExams.includes(system.name.toLowerCase());
                          return (
                            <button
                              key={system.name}
                              onClick={() => {
                                completePhysicalExam(system.name.toLowerCase());
                                setShowPhysicalExam(true);
                              }}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                isCompleted 
                                  ? `bg-${system.color}-100 border-${system.color}-500 text-${system.color}-700`
                                  : `bg-gray-50 border-gray-300 hover:border-${system.color}-400`
                              }`}
                            >
                              <IconComponent className="h-6 w-6 mx-auto mb-1" />
                              <div className="text-xs font-bold">{system.name}</div>
                              {isCompleted && <Check className="h-4 w-4 mx-auto mt-1" />}
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-bold text-sm mb-2">Order Diagnostic Tests:</h5>
                        <div className="space-y-2">
                          {['Blood Work', 'Chest X-ray', 'ECG', 'Urinalysis'].map((test, index) => {
                            const isOrdered = gameState.orderedTests.includes(test);
                            return (
                              <button
                                key={test}
                                onClick={() => orderDiagnosticTest(test)}
                                disabled={isOrdered}
                                className={`w-full p-2 rounded-lg text-sm font-bold transition-all ${
                                  isOrdered
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                                }`}
                              >
                                <TestTube className="h-4 w-4 inline mr-2" />
                                {test}
                                {isOrdered && <Check className="h-4 w-4 inline ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </MobileCard>
                </motion.div>
              )}

              {activePanel === 'reasoning' && (
                <motion.div
                  key="reasoning"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <MobileCard>
                    <div className="space-y-3">
                      <div className="text-center">
                        <h4 className="font-bold mb-3">Clinical Analysis</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setShowDifferentials(true)}
                            className="p-3 bg-purple-100 rounded-lg border border-purple-300"
                          >
                            <Brain className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                            <div className="text-xs font-bold">Differential Dx</div>
                          </button>
                          <button
                            onClick={() => setShowClinicalReasoning(true)}
                            className="p-3 bg-indigo-100 rounded-lg border border-indigo-300"
                          >
                            <Lightbulb className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
                            <div className="text-xs font-bold">Clinical Reasoning</div>
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="font-bold text-sm mb-2">Your Progress:</h5>
                        <div className="space-y-1 text-xs">
                          <div>Questions Asked: {gameState.questionsAsked.length}</div>
                          <div>Tests Ordered: {gameState.orderedTests.length}</div>
                          <div>Exams Completed: {gameState.completedExams.length}</div>
                          <div>Current Streak: {gameState.streakCount}</div>
                        </div>
                      </div>
                    </div>
                  </MobileCard>
                </motion.div>
              )}

              {activePanel === 'diagnosis' && (
                <motion.div
                  key="diagnosis"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <MobileCard className="bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300">
                    <h4 className="font-black text-gray-900 mb-3 text-center" style={{ fontFamily: 'monospace' }}>
                      SUBMIT DIAGNOSIS
                    </h4>
                    <input
                      type="text"
                      value={gameState.guessedDiagnosis}
                      onChange={(e) => setGameState(prev => ({ ...prev, guessedDiagnosis: e.target.value }))}
                      placeholder="Enter your diagnosis..."
                      className="w-full p-3 border-2 border-gray-300 rounded-lg font-bold text-center mb-3"
                      style={{ fontFamily: 'monospace' }}
                      data-testid="diagnosis-input"
                    />
                    
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <h5 className="font-bold text-sm mb-2">AI-Powered Matching</h5>
                      <p className="text-xs text-gray-600">
                        Our AI will check if your diagnosis is medically equivalent to the correct answer, 
                        not just exact text matching.
                      </p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3 mb-3">
                      <h5 className="font-bold text-sm mb-2">Penalty System</h5>
                      <p className="text-xs text-gray-600">
                        Wrong diagnosis = -5 seconds (no life lost). You only lose a life if time runs out!
                      </p>
                    </div>
                    
                    <MobileButton
                      onClick={submitDiagnosis}
                      disabled={!gameState.guessedDiagnosis.trim()}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black"
                      style={{ fontFamily: 'monospace' }}
                      data-testid="submit-diagnosis"
                    >
                      SUBMIT DIAGNOSIS
                    </MobileButton>
                  </MobileCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pause Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="bg-black/50 text-white px-4 py-2 rounded-lg font-bold"
                style={{ fontFamily: 'monospace' }}
              >
                {isTimerPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isTimerPaused ? ' RESUME' : ' PAUSE'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Game Over */}
        {gameState.gameStatus === 'gameOver' && (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-red-500 rounded-3xl mx-auto flex items-center justify-center">
              <X className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'monospace' }}>
                GAME OVER
              </h2>
              <div className="space-y-1 text-white/90" style={{ fontFamily: 'monospace' }}>
                <p>Final Score: {gameState.score}</p>
                <p>Level Reached: {gameState.level}</p>
                <p>Total Points: {gameState.totalPoints}</p>
                <p>Highest Streak: {gameState.streakCount}</p>
                <p>Achievements: {gameState.achievements.length}</p>
              </div>
            </div>
            <div className="space-y-3">
              <MobileButton
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black"
                style={{ fontFamily: 'monospace' }}
                data-testid="play-again"
              >
                PLAY AGAIN
              </MobileButton>
              <MobileButton
                onClick={resetGame}
                variant="secondary"
                className="w-full font-black"
                style={{ fontFamily: 'monospace' }}
                data-testid="main-menu"
              >
                MAIN MENU
              </MobileButton>
            </div>
          </motion.div>
        )}
      </div>

      {/* Medical Feature Modals */}
      <DifferentialDiagnosisPanel
        caseId={gameState.currentCase?.id || ''}
        isVisible={showDifferentials}
        onClose={() => setShowDifferentials(false)}
      />

      <PhysicalExamSimulator
        caseId={gameState.currentCase?.id || ''}
        isVisible={showPhysicalExam}
        onClose={() => setShowPhysicalExam(false)}
      />

      <ClinicalReasoningPanel
        caseId={gameState.currentCase?.id || ''}
        questionsAsked={gameState.questionsAsked}
        isVisible={showClinicalReasoning}
        onClose={() => setShowClinicalReasoning(false)}
      />
    </MobileLayout>
  );
}