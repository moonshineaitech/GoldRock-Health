import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { PremiumPaywallOverlay } from "@/components/premium-paywall-overlay";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  MessageCircle,
  Phone,
  Target,
  Crown,
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign,
  Building2,
  Shield,
  TrendingUp,
  AlertTriangle,
  Heart,
  Brain,
  Zap,
  Lightbulb,
  Send,
  RotateCcw,
  Trophy,
  FileCheck,
  Loader2,
  ChevronRight,
  User,
  Headphones,
  ThumbsUp,
  ThumbsDown,
  Info,
  Sparkles,
  X
} from "lucide-react";
import { Link } from "wouter";

interface ConversationMessage {
  role: 'user' | 'billing_rep';
  content: string;
  tactics_used?: string[];
  effectiveness?: string;
  coaching_tip?: string;
  current_offer?: number;
  potential_reduction?: number;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  averageSavings: string;
  keyTactics: string[];
  defaultBillAmount: number;
  icon: string;
}

const iconMap: Record<string, any> = {
  AlertTriangle,
  FileCheck,
  Building2,
  Shield,
  Heart,
  Phone
};

const difficultyColors: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-amber-100 text-amber-700',
  'Advanced': 'bg-red-100 text-red-700',
  'Expert': 'bg-purple-100 text-purple-700'
};

const effectivenessColors: Record<string, { bg: string; text: string; icon: any }> = {
  'poor': { bg: 'bg-red-100', text: 'text-red-700', icon: ThumbsDown },
  'fair': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Lightbulb },
  'good': { bg: 'bg-green-100', text: 'text-green-700', icon: ThumbsUp },
  'excellent': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Trophy }
};

export default function NegotiationSimulator() {
  const { user, isLoading: authLoading } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [originalBill, setOriginalBill] = useState<number>(8500);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [totalSaved, setTotalSaved] = useState<number>(0);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [showTactics, setShowTactics] = useState(true);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentOfferRef = useRef<number>(0);
  const conversationRef = useRef<ConversationMessage[]>([]);
  
  // Keep refs in sync with state
  useEffect(() => {
    currentOfferRef.current = currentOffer;
  }, [currentOffer]);
  
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);
  
  const { data: scenarios, isLoading: scenariosLoading } = useQuery<Scenario[]>({
    queryKey: ['/api/negotiation-scenarios']
  });
  
  const simulatorMutation = useMutation({
    mutationFn: async (data: { scenario: string; billAmount: number; message: string; conversationHistory: ConversationMessage[] }) => {
      const response = await apiRequest('/api/negotiation-simulator', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: (data: any) => {
      const newMessage: ConversationMessage = {
        role: 'billing_rep',
        content: data.response,
        tactics_used: data.tactics_used,
        effectiveness: data.effectiveness,
        coaching_tip: data.coaching_tip,
        current_offer: data.current_offer,
        potential_reduction: data.potential_reduction
      };
      
      setConversation(prev => [...prev, newMessage]);
      setCurrentOffer(data.current_offer);
      // Calculate cumulative savings from original bill (backend returns originalBill - current_offer)
      setTotalSaved(data.originalBill - data.current_offer);
      
      const scoreMap: Record<string, number> = { 'poor': 25, 'fair': 50, 'good': 75, 'excellent': 100 };
      const newScore = scoreMap[data.effectiveness] || 50;
      
      // Update score using functional update with proper running average
      setScoreCount(prevCount => {
        const newCount = prevCount + 1;
        // Also update the overall score using the new count
        setOverallScore(prevScore => {
          if (prevCount === 0) {
            return newScore;
          }
          return Math.round((prevScore * prevCount + newScore) / newCount);
        });
        return newCount;
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const startSimulation = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setOriginalBill(scenario.defaultBillAmount);
    setCurrentOffer(scenario.defaultBillAmount);
    setConversation([]);
    setTotalSaved(0);
    setOverallScore(0);
    setScoreCount(0);
    setIsSimulationActive(true);
    
    const openingMessage: ConversationMessage = {
      role: 'billing_rep',
      content: getOpeningMessage(scenario)
    };
    setConversation([openingMessage]);
  };
  
  const getOpeningMessage = (scenario: Scenario): string => {
    const openings: Record<string, string> = {
      'emergency-room': `Hello, this is the Patient Financial Services department at Memorial General Hospital. I'm calling regarding your outstanding balance of $${scenario.defaultBillAmount.toLocaleString()} for your recent emergency room visit. How can I assist you today?`,
      'surgical-bills': `Good afternoon, I'm reaching out from the Surgical Center billing office. You have a balance of $${scenario.defaultBillAmount.toLocaleString()} for your recent procedure. Are you calling to make a payment today?`,
      'hospital-stays': `Thank you for calling County Medical Center billing department. I see you have an outstanding balance of $${scenario.defaultBillAmount.toLocaleString()} from your hospital admission. How may I help you?`,
      'insurance-appeals': `This is the insurance appeals department. I'm reviewing your claim that was denied. The amount in dispute is $${scenario.defaultBillAmount.toLocaleString()}. What information are you providing for your appeal?`,
      'charity-care': `Welcome to the Financial Assistance office. I understand you'd like to discuss your bill of $${scenario.defaultBillAmount.toLocaleString()}. We have several programs that may help. How can I assist you?`,
      'collections': `This is National Medical Collections. We're calling regarding a medical debt of $${scenario.defaultBillAmount.toLocaleString()} that has been assigned to our agency. Are you prepared to resolve this matter today?`
    };
    return openings[scenario.id] || `Hello, you have an outstanding medical bill of $${scenario.defaultBillAmount.toLocaleString()}. How can I help you?`;
  };
  
  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedScenario || simulatorMutation.isPending) return;
    
    const userMessage: ConversationMessage = {
      role: 'user',
      content: inputMessage.trim()
    };
    
    // Capture current state via refs to avoid stale closure issues
    const latestConversation = [...conversationRef.current, userMessage];
    
    setConversation(prev => [...prev, userMessage]);
    
    // Always pass the original bill amount (not the current offer) so backend calculates cumulative savings
    simulatorMutation.mutate({
      scenario: selectedScenario.id,
      billAmount: originalBill,
      message: inputMessage.trim(),
      conversationHistory: latestConversation.map(m => ({
        role: m.role,
        content: m.content
      }))
    });
    
    setInputMessage('');
  };
  
  const resetSimulation = () => {
    setSelectedScenario(null);
    setConversation([]);
    setCurrentOffer(0);
    setTotalSaved(0);
    setOverallScore(0);
    setScoreCount(0);
    setIsSimulationActive(false);
  };
  
  if (authLoading) {
    return (
      <MobileLayout title="Loading..." showBackButton>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
      </MobileLayout>
    );
  }
  
  if (!user) {
    return (
      <MobileLayout title="Negotiation Simulator" showBackButton>
        <div className="text-center py-12">
          <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-600" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Makes Perfect</h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Sign in to access the interactive negotiation simulator and practice your skills before facing real billing departments.
          </p>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
              Sign In to Start Training
            </Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Negotiation Simulator" showBackButton>
      {!isSubscribed && (
        <PremiumPaywallOverlay 
          title="Premium Feature" 
          description="Practice with our AI-powered negotiation simulator to build confidence before tackling real billing departments."
          featureName="Negotiation Simulator"
          savingsPotential="$5,000+"
        />
      )}
      
      <div className="space-y-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mb-4">
            <Brain className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">Interactive Training Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Debt Negotiation Simulator
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Practice negotiating with AI-powered billing representatives before you tackle your real bills. Get real-time coaching on your tactics.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSimulationActive ? (
            <motion.div
              key="scenario-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Choose Your Scenario</h2>
                <Badge variant="outline" className="text-cyan-600 border-cyan-200">
                  6 Scenarios
                </Badge>
              </div>
              
              {scenariosLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {scenarios?.map((scenario) => {
                    const IconComponent = iconMap[scenario.icon] || Target;
                    return (
                      <motion.div
                        key={scenario.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <MobileCard
                          className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-cyan-200"
                          onClick={() => startSimulation(scenario)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl">
                              <IconComponent className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900">{scenario.title}</h3>
                                <Badge className={difficultyColors[scenario.difficulty] || 'bg-slate-100 text-slate-700'}>
                                  {scenario.difficulty}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{scenario.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-4 h-4" />
                                  <span className="font-medium">{scenario.averageSavings} savings</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                  <Target className="w-4 h-4" />
                                  <span>${scenario.defaultBillAmount.toLocaleString()} bill</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-1">
                                {scenario.keyTactics.slice(0, 2).map((tactic, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                                    {tactic}
                                  </Badge>
                                ))}
                                {scenario.keyTactics.length > 2 && (
                                  <Badge variant="outline" className="text-xs bg-slate-50">
                                    +{scenario.keyTactics.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 mt-2" />
                          </div>
                        </MobileCard>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="simulation-active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSimulation}
                    className="text-slate-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Exit
                  </Button>
                  <Badge className="bg-cyan-100 text-cyan-700">
                    {selectedScenario?.title}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTactics(!showTactics)}
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  {showTactics ? 'Hide' : 'Show'} Tips
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MobileCard className="text-center py-3">
                  <div className="text-xs text-slate-500 mb-1">Current Bill</div>
                  <div className="text-lg font-bold text-slate-900">
                    ${currentOffer.toLocaleString()}
                  </div>
                </MobileCard>
                <MobileCard className="text-center py-3 bg-green-50 border-green-100">
                  <div className="text-xs text-green-600 mb-1">You Saved</div>
                  <div className="text-lg font-bold text-green-700">
                    ${totalSaved.toLocaleString()}
                  </div>
                </MobileCard>
                <MobileCard className="text-center py-3">
                  <div className="text-xs text-slate-500 mb-1">Score</div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-lg font-bold text-slate-900">{overallScore || '--'}</span>
                  </div>
                </MobileCard>
              </div>

              {showTactics && selectedScenario && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <MobileCard className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-2">Recommended Tactics</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          {selectedScenario.keyTactics.map((tactic, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3" />
                              {tactic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </MobileCard>
                </motion.div>
              )}

              <MobileCard className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {conversation.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            msg.role === 'user' 
                              ? 'bg-cyan-100' 
                              : 'bg-slate-100'
                          }`}>
                            {msg.role === 'user' 
                              ? <User className="w-3 h-3 text-cyan-600" />
                              : <Headphones className="w-3 h-3 text-slate-600" />
                            }
                          </div>
                          <span className="text-xs text-slate-500">
                            {msg.role === 'user' ? 'You' : 'Billing Rep'}
                          </span>
                        </div>
                        
                        <div className={`rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        
                        {msg.role === 'billing_rep' && msg.effectiveness && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const eff = effectivenessColors[msg.effectiveness];
                                const EffIcon = eff?.icon || Star;
                                return (
                                  <Badge className={`${eff?.bg} ${eff?.text}`}>
                                    <EffIcon className="w-3 h-3 mr-1" />
                                    {msg.effectiveness.charAt(0).toUpperCase() + msg.effectiveness.slice(1)}
                                  </Badge>
                                );
                              })()}
                              {msg.potential_reduction && msg.potential_reduction > 0 && (
                                <Badge className="bg-green-100 text-green-700">
                                  <DollarSign className="w-3 h-3" />
                                  -{msg.potential_reduction.toLocaleString()} saved
                                </Badge>
                              )}
                            </div>
                            
                            {msg.coaching_tip && (
                              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                                <p className="text-xs text-blue-700">{msg.coaching_tip}</p>
                              </div>
                            )}
                            
                            {msg.tactics_used && msg.tactics_used.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {msg.tactics_used.map((tactic, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tactic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {simulatorMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Billing rep is responding...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your negotiation response..."
                    className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || simulatorMutation.isPending}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </MobileCard>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetSimulation}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Different Scenario
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedScenario) startSimulation(selectedScenario);
                  }}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart This Scenario
                </Button>
              </div>

              <MobileCard className="bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-slate-500" />
                  <p className="text-sm text-slate-600">
                    This is a training simulation. The AI billing rep responds realistically to help you practice. 
                    Use the tactics shown above to negotiate effectively.
                  </p>
                </div>
              </MobileCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}
