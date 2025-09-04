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
} from "@/components/ui/dialog";
import {
  GitBranch,
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Brain,
  Timer,
  Target,
  TrendingUp,
  Filter,
  BookOpen,
  Stethoscope,
  Activity,
  Heart,
  Zap
} from "lucide-react";
import type { ClinicalDecisionTree, DecisionTreeProgress } from "@shared/schema";

interface TreeFilters {
  specialty: string;
  difficulty: string;
  category: string;
}

interface TreeState {
  currentNodeId: string;
  path: string[];
  decisions: Record<string, string>;
  startTime: Date | null;
  isActive: boolean;
  completed: boolean;
}

export default function ClinicalDecisionTreesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TreeFilters>({
    specialty: "all",
    difficulty: "all",
    category: "all"
  });
  const [selectedTree, setSelectedTree] = useState<ClinicalDecisionTree | null>(null);
  const [showTreeDialog, setShowTreeDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [treeState, setTreeState] = useState<TreeState>({
    currentNodeId: "",
    path: [],
    decisions: {},
    startTime: null,
    isActive: false,
    completed: false
  });

  // Fetch clinical decision trees
  const { data: trees = [], isLoading: treesLoading } = useQuery({
    queryKey: ["/api/clinical-decision-trees", filters.specialty, filters.difficulty, filters.category, searchTerm],
    enabled: !!user
  });

  // Fetch user's tree progress
  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/decision-tree-progress", user?.id],
    enabled: !!user
  });

  // Submit tree progress mutation
  const submitProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      return await apiRequest("POST", "/api/decision-tree-progress", progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decision-tree-progress"] });
      setShowTreeDialog(false);
      setSelectedTree(null);
      resetTreeState();
    }
  });

  const resetTreeState = () => {
    setTreeState({
      currentNodeId: "",
      path: [],
      decisions: {},
      startTime: null,
      isActive: false,
      completed: false
    });
  };

  const startTree = (tree: ClinicalDecisionTree) => {
    setSelectedTree(tree);
    setTreeState({
      currentNodeId: tree.rootNodeId,
      path: [tree.rootNodeId],
      decisions: {},
      startTime: new Date(),
      isActive: true,
      completed: false
    });
    setShowTreeDialog(true);
  };

  const makeDecision = (nodeId: string, decision: string, nextNodeId: string) => {
    setTreeState(prev => ({
      ...prev,
      currentNodeId: nextNodeId,
      path: [...prev.path, nextNodeId],
      decisions: { ...prev.decisions, [nodeId]: decision }
    }));
    
    // Check if this is a terminal node (outcome)
    const currentNode = selectedTree?.nodes.find(n => n.id === nextNodeId);
    if (currentNode?.type === 'outcome') {
      completeTree(nextNodeId);
    }
  };

  const goBack = () => {
    if (treeState.path.length > 1) {
      const newPath = treeState.path.slice(0, -1);
      const previousNodeId = newPath[newPath.length - 1];
      
      setTreeState(prev => ({
        ...prev,
        currentNodeId: previousNodeId,
        path: newPath
      }));
    }
  };

  const completeTree = (outcomeNodeId: string) => {
    if (!selectedTree || !treeState.startTime) return;

    const timeSpent = Math.floor((Date.now() - treeState.startTime.getTime()) / 1000);
    const outcomeNode = selectedTree.nodes.find(n => n.id === outcomeNodeId);
    const isCorrectPath = outcomeNode?.isOptimal || false;
    
    // Calculate score based on path efficiency and correctness
    const optimalPathLength = selectedTree.optimalPathLength || treeState.path.length;
    const pathEfficiency = Math.max(0, (optimalPathLength / treeState.path.length) * 100);
    const correctnessScore = isCorrectPath ? 100 : 50;
    const timeBonus = timeSpent < 300 ? 10 : 0; // Bonus for completing under 5 minutes
    
    const finalScore = Math.round((pathEfficiency * 0.4 + correctnessScore * 0.5 + timeBonus * 0.1));
    
    const progressData = {
      treeId: selectedTree.id,
      pathTaken: treeState.path,
      decisions: treeState.decisions,
      finalOutcome: outcomeNodeId,
      timeSpent,
      score: finalScore,
      isOptimalPath: isCorrectPath,
      completed: true
    };

    setTreeState(prev => ({ ...prev, completed: true }));
    submitProgressMutation.mutate(progressData);
  };

  const getCurrentNode = () => {
    if (!selectedTree) return null;
    return selectedTree.nodes.find(n => n.id === treeState.currentNodeId);
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      'Emergency Medicine': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Cardiology': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Neurology': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Internal Medicine': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Pediatrics': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Surgery': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[specialty] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getDifficultyIcon = (difficulty: number) => {
    switch (difficulty) {
      case 1: return <Target className="w-4 h-4 text-green-600" />;
      case 2: return <Activity className="w-4 h-4 text-yellow-600" />;
      case 3: return <Zap className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUserTreeProgress = (treeId: string) => {
    const attempts = userProgress.filter((progress: DecisionTreeProgress) => progress.treeId === treeId);
    if (attempts.length === 0) return null;
    
    const bestScore = Math.max(...attempts.map((a: DecisionTreeProgress) => a.score || 0));
    const totalAttempts = attempts.length;
    const lastAttempt = attempts[attempts.length - 1];
    
    return { bestScore, totalAttempts, lastAttempt };
  };

  const filteredTrees = trees.filter((tree: ClinicalDecisionTree) => {
    const matchesSearch = tree.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tree.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filters.specialty === "all" || tree.specialty === filters.specialty;
    const matchesDifficulty = filters.difficulty === "all" || tree.difficulty.toString() === filters.difficulty;
    const matchesCategory = filters.category === "all" || tree.category === filters.category;
    
    return matchesSearch && matchesSpecialty && matchesDifficulty && matchesCategory;
  });

  const specialties = [
    'Emergency Medicine', 'Cardiology', 'Neurology', 'Internal Medicine',
    'Pediatrics', 'Surgery', 'Psychiatry', 'Radiology', 'Anesthesiology'
  ];

  const categories = [
    'Diagnosis', 'Treatment', 'Triage', 'Emergency Protocols', 'Differential Diagnosis'
  ];

  return (
    <MobileLayout 
      title="Decision Trees" 
      subtitle="Interactive Algorithms"
      data-testid="clinical-decision-trees-page"
    >
      {/* Quick Stats */}
      <MobileCard className="p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-semibold text-blue-600 text-lg">{userProgress.length}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div>
            <div className="font-semibold text-green-600 text-lg">
              {userProgress.length > 0 
                ? Math.round(userProgress.reduce((sum: number, p: DecisionTreeProgress) => sum + (p.score || 0), 0) / userProgress.length)
                : 0}%
            </div>
            <div className="text-gray-600 text-sm">Avg Score</div>
          </div>
          <div>
            <div className="font-semibold text-purple-600 text-lg">
              {userProgress.filter((p: DecisionTreeProgress) => p.isOptimalPath).length}
            </div>
            <div className="text-gray-600 text-sm">Optimal Paths</div>
          </div>
        </div>
      </MobileCard>
      
      {/* Filters */}
      <MobileCard className="p-4 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium">Filter Decision Trees</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search trees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-trees"
              />
            </div>
            
            <div>
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
            
            <div>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </MobileCard>

        {/* Decision Trees Grid */}
        {treesLoading ? (
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
              {filteredTrees.map((tree: ClinicalDecisionTree, index) => {
                const progress = getUserTreeProgress(tree.id);
                
                return (
                  <motion.div
                    key={tree.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    data-testid={`tree-card-${tree.id}`}
                  >
                    <MobileCard className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{tree.title}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getSpecialtyColor(tree.specialty)}>
                              {tree.specialty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {tree.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {getDifficultyIcon(tree.difficulty)}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {tree.description}
                      </p>

                      {/* Tree Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <GitBranch className="w-3 h-3" />
                            <span className="font-medium">{tree.estimatedTime}m</span>
                          </div>
                          <div className="text-gray-500">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Brain className="w-3 h-3" />
                            <span className="font-medium">{tree.nodes?.length || 0}</span>
                          </div>
                          <div className="text-gray-500">Decision Points</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span className="font-medium">{tree.optimalPathLength || 'N/A'}</span>
                          </div>
                          <div className="text-gray-500">Optimal Path</div>
                        </div>
                      </div>

                      {/* User Progress */}
                      {progress && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>Best Score: <span className="font-semibold text-blue-600">{progress.bestScore}%</span></span>
                            <span className="text-gray-600">{progress.totalAttempts} attempts</span>
                          </div>
                          <Progress 
                            value={progress.bestScore} 
                            className="mt-2 h-2"
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {tree.tags && tree.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tree.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {tree.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tree.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startTree(tree)}
                          className="flex-1"
                          data-testid={`button-start-tree-${tree.id}`}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Algorithm
                        </Button>
                        <Button variant="outline" size="sm">
                          <BookOpen className="w-4 h-4" />
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
        {filteredTrees.length === 0 && !treesLoading && (
          <MobileCard className="p-8 text-center">
            <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No decision trees found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more clinical algorithms
            </p>
          </MobileCard>
        )}

      {/* Decision Tree Modal */}
      <Dialog open={showTreeDialog} onOpenChange={setShowTreeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTree?.title}</span>
              {treeState.isActive && !treeState.completed && (
                <Badge variant="secondary">
                  Step {treeState.path.length} of {selectedTree?.optimalPathLength || '?'}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTree && treeState.isActive && (
            <div className="flex flex-col h-[70vh]">
              {/* Progress Bar */}
              <div className="mb-4">
                <Progress 
                  value={selectedTree.optimalPathLength 
                    ? (treeState.path.length / selectedTree.optimalPathLength) * 100 
                    : 0}
                  className="h-2"
                />
              </div>

              {/* Current Node */}
              <div className="flex-1 overflow-y-auto">
                {(() => {
                  const currentNode = getCurrentNode();
                  if (!currentNode) return null;

                  return (
                    <div className="space-y-6">
                      {/* Node Content */}
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          {currentNode.type === 'decision' && <Brain className="w-6 h-6 text-blue-600 mt-1" />}
                          {currentNode.type === 'outcome' && <Target className="w-6 h-6 text-green-600 mt-1" />}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{currentNode.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300">{currentNode.content}</p>
                            
                            {currentNode.additionalInfo && (
                              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                                <p className="text-sm">{currentNode.additionalInfo}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Decision Options */}
                      {currentNode.type === 'decision' && currentNode.options && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Choose your next step:</h4>
                          {currentNode.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full text-left p-4 h-auto justify-start"
                              onClick={() => makeDecision(currentNode.id, option.text, option.nextNodeId)}
                              data-testid={`button-option-${index}`}
                            >
                              <div className="flex items-center space-x-3">
                                <ArrowRight className="w-4 h-4 text-blue-600" />
                                <span>{option.text}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Outcome Display */}
                      {currentNode.type === 'outcome' && (
                        <div className={`p-4 rounded-lg border-l-4 ${
                          currentNode.isOptimal 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-400' 
                            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-400'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            {currentNode.isOptimal ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                            )}
                            <span className="font-semibold">
                              {currentNode.isOptimal ? 'Optimal Outcome' : 'Alternative Outcome'}
                            </span>
                          </div>
                          
                          {currentNode.explanation && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {currentNode.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={treeState.path.length <= 1 || treeState.completed}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowTreeDialog(false)}>
                    Exit Algorithm
                  </Button>
                  
                  {treeState.completed && (
                    <Button onClick={() => setShowTreeDialog(false)} data-testid="button-finish-tree">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Results
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