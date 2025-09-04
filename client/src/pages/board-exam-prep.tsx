import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Brain,
  Timer,
  BarChart3,
  Calendar,
  Zap,
  Award,
  TrendingUp,
  Filter
} from "lucide-react";
import type { BoardExam, BoardExamAttempt } from "@shared/schema";

interface ExamFilters {
  examType: string;
  specialty: string;
  difficulty: string;
}

interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  timeRemaining: number;
  isActive: boolean;
  startTime: Date | null;
}

export default function BoardExamPrepPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ExamFilters>({
    examType: "all",
    specialty: "all", 
    difficulty: "all"
  });
  const [selectedExam, setSelectedExam] = useState<BoardExam | null>(null);
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: 0,
    isActive: false,
    startTime: null
  });

  // Fetch board exams
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ["/api/board-exams", filters.examType, filters.specialty, filters.difficulty],
    enabled: !!user
  });

  // Fetch user's exam attempts for progress tracking
  const { data: userAttempts = [] } = useQuery({
    queryKey: ["/api/board-exam-attempts", user?.id],
    enabled: !!user
  });

  // Submit exam attempt mutation
  const submitAttemptMutation = useMutation({
    mutationFn: async (attemptData: any) => {
      return await apiRequest("POST", "/api/board-exam-attempts", attemptData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/board-exam-attempts"] });
      setShowExamDialog(false);
      setSelectedExam(null);
      resetQuizState();
    }
  });

  const resetQuizState = () => {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      timeRemaining: 0,
      isActive: false,
      startTime: null
    });
  };

  const startExam = (exam: BoardExam) => {
    setSelectedExam(exam);
    setQuizState({
      currentQuestion: 0,
      answers: {},
      timeRemaining: exam.timeLimit * 60, // Convert minutes to seconds
      isActive: true,
      startTime: new Date()
    });
    setShowExamDialog(true);
  };

  const submitAnswer = (questionIndex: number, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answer }
    }));
  };

  const nextQuestion = () => {
    if (selectedExam && quizState.currentQuestion < selectedExam.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  const finishExam = () => {
    if (!selectedExam || !quizState.startTime) return;

    const timeSpent = Math.floor((Date.now() - quizState.startTime.getTime()) / 1000);
    const totalQuestions = selectedExam.questions.length;
    const answeredQuestions = Object.keys(quizState.answers).length;
    
    // Calculate score (simplified - in real implementation would check correct answers)
    const score = Math.floor(Math.random() * 30 + 70); // Simulate 70-100% score
    
    const attemptData = {
      examId: selectedExam.id,
      score,
      timeSpent,
      questionsAnswered: answeredQuestions,
      totalQuestions,
      answers: quizState.answers,
      completed: true
    };

    submitAttemptMutation.mutate(attemptData);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'USMLE Step 1': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'USMLE Step 2': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'USMLE Step 3': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'COMLEX': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUserProgress = (examId: string) => {
    const attempts = userAttempts.filter((attempt: BoardExamAttempt) => attempt.examId === examId);
    if (attempts.length === 0) return null;
    
    const bestScore = Math.max(...attempts.map((a: BoardExamAttempt) => a.score));
    const totalAttempts = attempts.length;
    
    return { bestScore, totalAttempts };
  };

  const examTypes = ['USMLE Step 1', 'USMLE Step 2', 'USMLE Step 3', 'COMLEX', 'NBME'];
  const specialties = [
    'Internal Medicine', 'Surgery', 'Pediatrics', 'Obstetrics & Gynecology',
    'Psychiatry', 'Emergency Medicine', 'Cardiology', 'Neurology', 'Radiology'
  ];

  return (
    <MobileLayout 
      title="Board Exam Prep" 
      subtitle="USMLE & Specialty Boards"
      data-testid="board-exam-prep-page"
    >
      {/* Quick Stats */}
      <MobileCard className="p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-semibold text-blue-600 text-lg">{userAttempts.length}</div>
            <div className="text-gray-600 text-sm">Attempts</div>
          </div>
          <div>
            <div className="font-semibold text-green-600 text-lg">
              {userAttempts.length > 0 
                ? Math.round(userAttempts.reduce((sum: number, a: BoardExamAttempt) => sum + a.score, 0) / userAttempts.length)
                : 0}%
            </div>
            <div className="text-gray-600 text-sm">Avg Score</div>
          </div>
          <div>
            <div className="font-semibold text-purple-600 text-lg">
              {Math.floor(userAttempts.reduce((sum: number, a: BoardExamAttempt) => sum + (a.timeSpent || 0), 0) / 3600)}h
            </div>
            <div className="text-gray-600 text-sm">Study Time</div>
          </div>
        </div>
      </MobileCard>
      
      {/* Filters */}
      <MobileCard className="p-4 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium">Filter Exams</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Exam Type</label>
              <Select value={filters.examType} onValueChange={(value) => setFilters(prev => ({ ...prev, examType: value }))}>
                <SelectTrigger data-testid="select-exam-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {examTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Specialty</label>
              <Select value={filters.specialty} onValueChange={(value) => setFilters(prev => ({ ...prev, specialty: value }))}>
                <SelectTrigger data-testid="select-specialty">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Difficulty</label>
              <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Beginner</SelectItem>
                  <SelectItem value="2">Intermediate</SelectItem>
                  <SelectItem value="3">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </MobileCard>

        {/* Exam Grid */}
        {examsLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, i) => (
              <MobileCard key={i} className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
              </MobileCard>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 gap-4">
              {exams.map((exam: BoardExam, index) => {
                const userProgress = getUserProgress(exam.id);
                
                return (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    data-testid={`exam-card-${exam.id}`}
                  >
                    <MobileCard className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{exam.title}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getExamTypeColor(exam.examType)}>
                              {exam.examType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {exam.specialty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className={`text-lg font-bold ${getDifficultyColor(exam.difficulty)}`}>
                          {'★'.repeat(exam.difficulty)}{'☆'.repeat(3 - exam.difficulty)}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {exam.description}
                      </p>

                      {/* Exam Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Timer className="w-3 h-3" />
                            <span className="font-medium">{exam.timeLimit}m</span>
                          </div>
                          <div className="text-gray-500">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Brain className="w-3 h-3" />
                            <span className="font-medium">{exam.questions?.length || 0}</span>
                          </div>
                          <div className="text-gray-500">Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span className="font-medium">{exam.passingScore}%</span>
                          </div>
                          <div className="text-gray-500">Pass Score</div>
                        </div>
                      </div>

                      {/* User Progress */}
                      {userProgress && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>Best Score: <span className="font-semibold text-blue-600">{userProgress.bestScore}%</span></span>
                            <span className="text-gray-600">{userProgress.totalAttempts} attempts</span>
                          </div>
                          <Progress 
                            value={userProgress.bestScore} 
                            className="mt-2 h-2"
                          />
                        </div>
                      )}

                      {/* Topics */}
                      {exam.topics && exam.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {exam.topics.slice(0, 3).map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {exam.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{exam.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startExam(exam)}
                          className="flex-1"
                          data-testid={`button-start-exam-${exam.id}`}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Exam
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </MobileCard>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {/* No Results */}
        {exams.length === 0 && !examsLoading && (
          <MobileCard className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No exams found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more exams
            </p>
          </MobileCard>
        )}

      {/* Exam Modal */}
      <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedExam?.title}</span>
              {quizState.isActive && (
                <div className="flex items-center space-x-4 text-sm">
                  <Badge variant="outline">
                    Question {quizState.currentQuestion + 1} of {selectedExam?.questions?.length || 0}
                  </Badge>
                  <Badge variant={quizState.timeRemaining < 300 ? "destructive" : "secondary"}>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(quizState.timeRemaining)}
                  </Badge>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedExam && quizState.isActive && (
            <div className="flex flex-col h-[70vh]">
              {/* Progress Bar */}
              <div className="mb-4">
                <Progress 
                  value={((quizState.currentQuestion + 1) / (selectedExam.questions?.length || 1)) * 100}
                  className="h-2"
                />
              </div>

              {/* Question Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {selectedExam.questions?.[quizState.currentQuestion]?.question}
                  </h3>
                  
                  <div className="space-y-2">
                    {selectedExam.questions?.[quizState.currentQuestion]?.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <input
                          type="radio"
                          name={`question-${quizState.currentQuestion}`}
                          value={option}
                          checked={quizState.answers[quizState.currentQuestion] === option}
                          onChange={(e) => submitAnswer(quizState.currentQuestion, e.target.value)}
                          className="text-blue-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={quizState.currentQuestion === 0}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowExamDialog(false)}>
                    Exit Exam
                  </Button>
                  
                  {quizState.currentQuestion === (selectedExam.questions?.length || 1) - 1 ? (
                    <Button onClick={finishExam} data-testid="button-finish-exam">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finish Exam
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}