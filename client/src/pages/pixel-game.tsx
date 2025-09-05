import { useState, useEffect } from "react";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { motion, AnimatePresence } from "framer-motion";
import { useMedicalCases } from "@/hooks/use-medical-cases";
import { Heart, Zap, Target, Trophy, Star, Timer, ArrowRight, RotateCcw, Check, X } from "lucide-react";
import type { MedicalCase } from "@shared/schema";

interface GameState {
  currentCase: MedicalCase | null;
  score: number;
  lives: number;
  level: number;
  timeLeft: number;
  gameStatus: 'menu' | 'playing' | 'gameOver' | 'victory';
  selectedSymptoms: string[];
  guessedDiagnosis: string;
}

export default function PixelGame() {
  const { data: cases, isLoading } = useMedicalCases();
  const [gameState, setGameState] = useState<GameState>({
    currentCase: null,
    score: 0,
    lives: 3,
    level: 1,
    timeLeft: 60,
    gameStatus: 'menu',
    selectedSymptoms: [],
    guessedDiagnosis: ''
  });

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.gameStatus === 'playing') {
      handleTimeUp();
    }
  }, [gameState.timeLeft, gameState.gameStatus]);

  const startGame = () => {
    if (!cases || cases.length === 0) return;
    
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    setGameState({
      currentCase: randomCase,
      score: 0,
      lives: 3,
      level: 1,
      timeLeft: 60,
      gameStatus: 'playing',
      selectedSymptoms: [],
      guessedDiagnosis: ''
    });
  };

  const handleTimeUp = () => {
    setGameState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      gameStatus: prev.lives <= 1 ? 'gameOver' : 'playing',
      timeLeft: 60
    }));
  };

  const handleSymptomClick = (symptom: string) => {
    setGameState(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptom)
        ? prev.selectedSymptoms.filter(s => s !== symptom)
        : [...prev.selectedSymptoms, symptom]
    }));
  };

  const submitDiagnosis = () => {
    if (!gameState.currentCase) return;

    const isCorrect = gameState.guessedDiagnosis.toLowerCase().includes(
      gameState.currentCase.correctDiagnosis.toLowerCase()
    );

    if (isCorrect) {
      // Correct diagnosis
      const points = gameState.timeLeft * 10 + gameState.selectedSymptoms.length * 5;
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        level: prev.level + 1,
        timeLeft: 60,
        selectedSymptoms: [],
        guessedDiagnosis: ''
      }));
      
      // Load next case
      if (cases && cases.length > 0) {
        const nextCase = cases[Math.floor(Math.random() * cases.length)];
        setGameState(prev => ({ ...prev, currentCase: nextCase }));
      }
    } else {
      // Wrong diagnosis
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        gameStatus: prev.lives <= 1 ? 'gameOver' : 'playing',
        timeLeft: 60,
        selectedSymptoms: [],
        guessedDiagnosis: ''
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentCase: null,
      score: 0,
      lives: 3,
      level: 1,
      timeLeft: 60,
      gameStatus: 'menu',
      selectedSymptoms: [],
      guessedDiagnosis: ''
    });
  };

  if (isLoading) {
    return (
      <MobileLayout title="Pixel Doctor Game" showBottomNav={true}>
        <div className="flex items-center justify-center h-64">
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
      <div className="space-y-4 pb-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        margin: '-1rem',
        padding: '1rem',
        borderRadius: '0'
      }}>
        
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
                Diagnose patients in retro style!
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
                <p className="text-sm font-bold">60 SECONDS</p>
              </div>
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-yellow-500 rounded-2xl mx-auto mb-2 flex items-center justify-center"
                  style={{ imageRendering: 'pixelated' }}>
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold">HIGH SCORE</p>
              </div>
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
          </motion.div>
        )}

        {/* Game Playing */}
        {gameState.gameStatus === 'playing' && gameState.currentCase && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Game HUD */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'monospace' }}>SCORE</div>
                <div className="text-yellow-400 font-black text-lg" style={{ fontFamily: 'monospace' }}>
                  {gameState.score}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'monospace' }}>LEVEL</div>
                <div className="text-blue-400 font-black text-lg" style={{ fontFamily: 'monospace' }}>
                  {gameState.level}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'monospace' }}>LIVES</div>
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: gameState.lives }).map((_, i) => (
                    <Heart key={i} className="h-4 w-4 text-red-500 fill-current" />
                  ))}
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-2 text-center">
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'monospace' }}>TIME</div>
                <div className={`font-black text-lg ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`} 
                  style={{ fontFamily: 'monospace' }}>
                  {gameState.timeLeft}
                </div>
              </div>
            </div>

            {/* Patient Info */}
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
              </div>
            </MobileCard>

            {/* Symptoms Selection */}
            <MobileCard className="bg-gradient-to-br from-green-100 to-teal-100 border-2 border-green-300">
              <h4 className="font-black text-gray-900 mb-3 text-center" style={{ fontFamily: 'monospace' }}>
                SELECT SYMPTOMS
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {(gameState.currentCase.symptoms || []).slice(0, 6).map((symptom, index) => (
                  <motion.button
                    key={index}
                    className={`p-2 rounded-lg text-sm font-bold transition-all ${
                      gameState.selectedSymptoms.includes(symptom)
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-white/80 text-gray-800 hover:bg-white'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                    onClick={() => handleSymptomClick(symptom)}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`symptom-${index}`}
                  >
                    {symptom}
                    {gameState.selectedSymptoms.includes(symptom) && (
                      <Check className="h-4 w-4 inline ml-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            </MobileCard>

            {/* Diagnosis Input */}
            <MobileCard className="bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300">
              <h4 className="font-black text-gray-900 mb-3 text-center" style={{ fontFamily: 'monospace' }}>
                ENTER DIAGNOSIS
              </h4>
              <input
                type="text"
                value={gameState.guessedDiagnosis}
                onChange={(e) => setGameState(prev => ({ ...prev, guessedDiagnosis: e.target.value }))}
                placeholder="Type your diagnosis..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg font-bold text-center"
                style={{ fontFamily: 'monospace' }}
                data-testid="diagnosis-input"
              />
              <MobileButton
                onClick={submitDiagnosis}
                disabled={!gameState.guessedDiagnosis.trim()}
                className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black"
                style={{ fontFamily: 'monospace' }}
                data-testid="submit-diagnosis"
              >
                SUBMIT DIAGNOSIS
              </MobileButton>
            </MobileCard>
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
              <p className="text-white/90 text-lg" style={{ fontFamily: 'monospace' }}>
                Final Score: {gameState.score}
              </p>
              <p className="text-white/90 text-lg" style={{ fontFamily: 'monospace' }}>
                Level Reached: {gameState.level}
              </p>
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
    </MobileLayout>
  );
}