import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { PremiumPaywallOverlay } from "@/components/premium-paywall-overlay";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Timer,
  Zap,
  Crown,
  Lock,
  ArrowRight,
  Bell,
  BarChart3,
  DollarSign,
  Building2,
  FileText,
  Phone,
  Mail,
  Calculator,
  LineChart,
  PieChart,
  Eye,
  Shield,
  Award,
  Sparkles,
  Brain,
  Users,
  TrendingDown,
  Activity,
  Gauge,
  Radar,
  CircleDot,
  Plus,
  Download,
  Share,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Hourglass,
  RefreshCw,
  Maximize2,
  Star,
  BookOpen,
  Lightbulb,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Bookmark
} from "lucide-react";
import { Link } from "wouter";

// Animation variants for 2025 luxury design
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Premium floating elements
function FloatingTimingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient morphing background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
            'linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)',
            'linear-gradient(225deg, #10b981, #3b82f6, #8b5cf6)',
            'linear-gradient(315deg, #3b82f6, #10b981, #06b6d4)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating clock elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-400/15"
          style={{
            left: `${15 + (i * 11)}%`,
            top: `${10 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {i % 3 === 0 && <Clock className="w-6 h-6" />}
          {i % 3 === 1 && <Timer className="w-5 h-5" />}
          {i % 3 === 2 && <CalendarIcon className="w-7 h-7" />}
        </motion.div>
      ))}
    </div>
  );
}

// Enhanced timing insights data
const timingInsights = {
  hospitalFiscalYears: [
    {
      name: "Q4 (October-December)",
      successRate: 89,
      description: "Budget surplus period - hospitals most willing to negotiate",
      strategy: "Ideal for large reductions and charity care approvals",
      color: "bg-emerald-500",
      savings: "$15,000+ average"
    },
    {
      name: "Q1 (January-March)", 
      successRate: 76,
      description: "New budget implementation - moderate flexibility",
      strategy: "Good for payment plans and structured settlements",
      color: "bg-blue-500",
      savings: "$8,500+ average"
    },
    {
      name: "Q2 (April-June)",
      successRate: 68,
      description: "Mid-year adjustments - limited negotiation window",
      strategy: "Focus on billing errors and documentation issues", 
      color: "bg-yellow-500",
      savings: "$6,200+ average"
    },
    {
      name: "Q3 (July-September)",
      successRate: 52,
      description: "Budget constraints - most difficult period",
      strategy: "Minimum payments and emergency hardship only",
      color: "bg-red-500",
      savings: "$3,800+ average"
    }
  ],
  
  insuranceDeadlines: [
    {
      type: "Internal Appeal",
      timeframe: "180 days from denial",
      priority: "High" as "High" | "Critical" | "Emergency" | "Medium",
      successRate: 73,
      description: "First level appeal to insurance company"
    },
    {
      type: "External Review",
      timeframe: "60 days from internal denial", 
      priority: "Critical" as "High" | "Critical" | "Emergency" | "Medium",
      successRate: 85,
      description: "Independent medical review process"
    },
    {
      type: "Prior Authorization",
      timeframe: "72 hours for urgent care",
      priority: "Emergency" as "High" | "Critical" | "Emergency" | "Medium",
      successRate: 67,
      description: "Pre-approval for medical services"
    },
    {
      type: "Charity Care Application",
      timeframe: "240 days from service",
      priority: "Medium" as "High" | "Critical" | "Emergency" | "Medium",
      successRate: 82,
      description: "Financial assistance program enrollment"
    }
  ],

  seasonalPatterns: [
    {
      season: "January",
      factor: "New Year Resolution - Health Focus",
      advantage: "High patient advocacy activity",
      recommendation: "Start comprehensive bill reviews"
    },
    {
      season: "March",
      factor: "Tax Season - Financial Awareness", 
      advantage: "Increased deduction awareness",
      recommendation: "Medical expense documentation push"
    },
    {
      season: "November",
      factor: "Holiday Charity Mindset",
      advantage: "Increased charity care approvals",
      recommendation: "Submit hardship applications"
    },
    {
      season: "December",
      factor: "Year-End Budget Clearing",
      advantage: "Hospital budget surplus utilization",
      recommendation: "Major settlement negotiations"
    }
  ]
};

// Strategic timing calculator
function TimingOptimizer({ billData, onOptimization }: {
  billData: any;
  onOptimization: (strategy: any) => void;
}) {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [serviceDate, setServiceDate] = useState<Date | undefined>(new Date());
  const [billType, setBillType] = useState("");
  const [hasInsurance, setHasInsurance] = useState("yes");
  const [urgencyLevel, setUrgencyLevel] = useState("routine");

  const calculateOptimalTiming = () => {
    const now = new Date();
    const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
    const currentMonth = now.getMonth();
    
    let strategy = {
      optimalAction: "",
      timeframe: "",
      successProbability: 0,
      expectedSavings: "",
      reasoning: "",
      nextSteps: [] as string[],
      urgencyScore: 0
    };

    // Hospital fiscal year analysis
    if (currentQuarter === 4) {
      strategy.optimalAction = "Immediate negotiation";
      strategy.successProbability = 89;
      strategy.expectedSavings = "$12,000-$25,000";
      strategy.reasoning = "Q4 budget surplus - hospitals most flexible";
    } else if (currentQuarter === 1) {
      strategy.optimalAction = "Payment plan negotiation";
      strategy.successProbability = 76; 
      strategy.expectedSavings = "$6,000-$15,000";
      strategy.reasoning = "New budget period - moderate flexibility";
    } else {
      strategy.optimalAction = "Error-focused dispute";
      strategy.successProbability = 65;
      strategy.expectedSavings = "$3,000-$8,000";
      strategy.reasoning = "Limited negotiation window - focus on technical errors";
    }

    // Seasonal adjustments
    if (currentMonth === 11) { // December
      strategy.successProbability += 15;
      strategy.reasoning += " + Holiday charity mindset bonus";
    }

    if (currentMonth === 2) { // March
      strategy.urgencyScore += 20;
      strategy.reasoning += " + Tax season documentation urgency";
    }

    strategy.timeframe = urgencyLevel === "emergency" ? "24-48 hours" : "7-14 days";
    strategy.nextSteps = [
      "Gather all required documentation",
      "Identify optimal contact timing",
      "Prepare negotiation strategy",
      "Schedule follow-up milestones"
    ];

    onOptimization(strategy);
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-6 border border-blue-200/50 shadow-xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Optimal Timing Calculator</h3>
          <p className="text-gray-600">AI-powered timing optimization for maximum success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Healthcare Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="bg-white/80 border-blue-200">
                <SelectValue placeholder="Select provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Hospital System</SelectItem>
                <SelectItem value="clinic">Medical Clinic</SelectItem>
                <SelectItem value="specialist">Specialist Practice</SelectItem>
                <SelectItem value="emergency">Emergency Room</SelectItem>
                <SelectItem value="surgery">Surgical Center</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Bill Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="Enter bill amount"
              className="bg-white/80 border-blue-200"
              data-testid="input-bill-amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Bill Type</Label>
            <Select value={billType} onValueChange={setBillType}>
              <SelectTrigger className="bg-white/80 border-blue-200">
                <SelectValue placeholder="Select bill type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency Services</SelectItem>
                <SelectItem value="surgery">Surgical Procedures</SelectItem>
                <SelectItem value="diagnostic">Diagnostic Testing</SelectItem>
                <SelectItem value="routine">Routine Care</SelectItem>
                <SelectItem value="specialist">Specialist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
              <SelectTrigger className="bg-white/80 border-blue-200">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency (Collections active)</SelectItem>
                <SelectItem value="urgent">Urgent (60+ days overdue)</SelectItem>
                <SelectItem value="routine">Routine (Standard timeline)</SelectItem>
                <SelectItem value="planned">Planned (Future service)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateOptimalTiming} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
          data-testid="button-calculate-timing"
        >
          <Zap className="h-5 w-5 mr-2" />
          Calculate Optimal Timing Strategy
        </Button>
      </div>
    </motion.div>
  );
}

// Interactive calendar component
function TimingCalendar({ deadlines, onDateSelect }: {
  deadlines: any[];
  onDateSelect: (date: Date) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  const getDateEvents = (date: Date) => {
    // Mock implementation - in real app would check against actual deadlines
    const dayOfMonth = date.getDate();
    if (dayOfMonth % 7 === 0) return "deadline";
    if (dayOfMonth % 5 === 0) return "opportunity";
    return null;
  };

  return (
    <motion.div
      variants={itemVariants} 
      className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200/50 shadow-xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
              Strategic Calendar
            </h3>
            <p className="text-gray-600 mt-1">Track deadlines and optimal timing windows</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="text-xs"
              data-testid="button-calendar-view"
            >
              <Grid className="h-4 w-4 mr-1" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="text-xs"
              data-testid="button-timeline-view"
            >
              <List className="h-4 w-4 mr-1" />
              Timeline
            </Button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-inner">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-xl"
              data-testid="calendar-component"
            />
            
            {/* Calendar Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical Deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Important Dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Optimal Windows</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {deadlines.map((deadline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      deadline.priority === "Critical" ? "bg-red-500" :
                      deadline.priority === "High" ? "bg-yellow-500" : "bg-green-500"
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{deadline.type}</p>
                      <p className="text-sm text-gray-600">{deadline.timeframe}</p>
                    </div>
                  </div>
                  <Badge variant={deadline.priority === "Critical" ? "destructive" : "secondary"}>
                    {deadline.priority}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Success rate analyzer
function SuccessRateAnalyzer() {
  const [analysisType, setAnalysisType] = useState("timing");
  const [selectedMetric, setSelectedMetric] = useState("success-rate");

  const analysisData = {
    timing: [
      { period: "Q4 (Oct-Dec)", rate: 89, trend: "up", details: "Best quarter for negotiations" },
      { period: "Q1 (Jan-Mar)", rate: 76, trend: "stable", details: "Solid negotiation period" },
      { period: "Q2 (Apr-Jun)", rate: 68, trend: "down", details: "Moderate success rates" },
      { period: "Q3 (Jul-Sep)", rate: 52, trend: "down", details: "Most challenging period" }
    ],
    provider: [
      { type: "Non-profit Hospitals", rate: 84, trend: "up", details: "High charity care availability" },
      { type: "For-profit Hospitals", rate: 67, trend: "stable", details: "Standard negotiation rates" },
      { type: "Clinics", rate: 73, trend: "up", details: "Flexible payment options" },
      { type: "Specialty Centers", rate: 59, trend: "down", details: "Limited negotiation flexibility" }
    ]
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-3xl p-6 border border-emerald-200/50 shadow-xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Success Rate Analysis</h3>
          <p className="text-gray-600">Data-driven insights for optimal outcomes</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant={analysisType === "timing" ? "default" : "outline"}
            size="sm"
            onClick={() => setAnalysisType("timing")}
            data-testid="button-timing-analysis"
          >
            <Clock className="h-4 w-4 mr-1" />
            By Timing
          </Button>
          <Button
            variant={analysisType === "provider" ? "default" : "outline"}
            size="sm"
            onClick={() => setAnalysisType("provider")}
            data-testid="button-provider-analysis"
          >
            <Building2 className="h-4 w-4 mr-1" />
            By Provider
          </Button>
        </div>

        <div className="space-y-4">
          {analysisData[analysisType as keyof typeof analysisData].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">{'period' in item ? item.period : item.type}</h4>
                  <motion.div
                    animate={item.trend === "up" ? { rotate: [0, 10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {item.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {item.trend === "stable" && <Activity className="h-4 w-4 text-blue-600" />}
                  </motion.div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{item.rate}%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>
              
              <Progress value={item.rate} className="mb-2" />
              <p className="text-sm text-gray-600">{item.details}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Strategic recommendations panel
function StrategyRecommendations({ optimizationResult }: { optimizationResult: any }) {
  if (!optimizationResult) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-3xl p-6 border border-gray-200"
      >
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Run timing optimization to see personalized recommendations</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-6 border border-amber-200/50 shadow-xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Strategic Recommendations</h3>
          <p className="text-gray-600">Personalized action plan for optimal results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Optimal Action</h4>
            </div>
            <p className="text-gray-700 font-medium">{optimizationResult.optimalAction}</p>
            <p className="text-sm text-gray-600 mt-2">{optimizationResult.reasoning}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Timer className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Timeframe</h4>
            </div>
            <p className="text-gray-700 font-medium">{optimizationResult.timeframe}</p>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{optimizationResult.successProbability}% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Expected Savings</h4>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{optimizationResult.expectedSavings}</p>
            <Progress value={optimizationResult.successProbability} className="mt-2" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Urgency Score</h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={optimizationResult.urgencyScore || 50} className="h-2" />
              </div>
              <span className="text-sm font-medium text-gray-700">{optimizationResult.urgencyScore || 50}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Next Steps
          </h4>
          <div className="space-y-2">
            {optimizationResult.nextSteps?.map((step: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-semibold text-amber-700">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TimingGuide() {
  const { isAuthenticated } = useAuth();
  const { isSubscribed, isLoading } = useSubscription();
  const { toast } = useToast();
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [selectedInsight, setSelectedInsight] = useState("fiscal");
  const [activeTab, setActiveTab] = useState("optimizer");
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Show premium paywall for non-subscribers
  if (!isLoading && !isSubscribed) {
    return (
      <MobileLayout title="Strategic Timing Guide" showBackButton>
        <div className="min-h-screen relative">
          <PremiumPaywallOverlay
            title="Strategic Timing Guide"
            description="Advanced timing optimization tools for medical bill disputes and negotiations. Maximize your success rates through strategic timing intelligence."
            featureName="Strategic Timing Guide"
            savingsPotential="$8,500+"
          />
        </div>
      </MobileLayout>
    );
  }

  const handleOptimization = (result: any) => {
    setOptimizationResult(result);
    toast({
      title: "Timing Analysis Complete",
      description: `Optimal strategy identified with ${result.successProbability}% success rate`,
    });
  };

  const handleDateSelect = (date: Date) => {
    // Handle calendar date selection
    console.log("Selected date:", date);
  };

  return (
    <MobileLayout title="Strategic Timing Guide" showBackButton>
      <motion.div 
        ref={ref}
        className="min-h-screen relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Premium floating background */}
        <FloatingTimingElements />

        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-8 px-4 relative z-10"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            variants={pulseVariants}
            animate="animate"
          >
            <Clock className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight tracking-tight">
            <motion.span
              className="inline-block"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              data-testid="text-timing-title"
            >
              Strategic Timing Guide
            </motion.span>
          </h1>
          
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
            Master the art of timing in medical bill negotiations. AI-powered insights to maximize your success rates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">89% Q4 Success Rate</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700">Premium Intelligence</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-gray-700">Instant Analysis</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants} className="relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-1">
              <TabsTrigger 
                value="optimizer" 
                className="rounded-xl text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                data-testid="tab-optimizer"
              >
                <Calculator className="h-4 w-4 mr-1" />
                Optimizer
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="rounded-xl text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                data-testid="tab-calendar"
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Calendar
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="rounded-xl text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                data-testid="tab-analysis"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="strategy" 
                className="rounded-xl text-xs data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                data-testid="tab-strategy"
              >
                <Target className="h-4 w-4 mr-1" />
                Strategy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="optimizer" className="space-y-6">
              <TimingOptimizer 
                billData={{}}
                onOptimization={handleOptimization}
              />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <TimingCalendar
                deadlines={timingInsights.insuranceDeadlines}
                onDateSelect={handleDateSelect}
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <SuccessRateAnalyzer />
            </TabsContent>

            <TabsContent value="strategy" className="space-y-6">
              <StrategyRecommendations optimizationResult={optimizationResult} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Timing Insights Grid */}
        <motion.div variants={itemVariants} className="mt-8 space-y-6 relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6" data-testid="text-insights-title">
            Timing Intelligence Dashboard
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hospital Fiscal Year Insights */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-6 border border-blue-200/50 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-600" />
                Hospital Fiscal Quarters
              </h3>
              <div className="space-y-4">
                {timingInsights.hospitalFiscalYears.map((quarter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{quarter.name}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{quarter.successRate}%</div>
                        <div className="text-xs text-gray-500">Success Rate</div>
                      </div>
                    </div>
                    <Progress value={quarter.successRate} className="mb-2" />
                    <p className="text-sm text-gray-600 mb-1">{quarter.description}</p>
                    <p className="text-xs text-emerald-700 font-medium">{quarter.savings}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Seasonal Patterns */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-6 border border-emerald-200/50 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Activity className="h-6 w-6 text-emerald-600" />
                Seasonal Patterns
              </h3>
              <div className="space-y-4">
                {timingInsights.seasonalPatterns.map((pattern, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{pattern.season}</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{pattern.factor}</p>
                    <p className="text-xs text-emerald-700 font-medium">{pattern.recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Action Center */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-6 border border-amber-200/50 shadow-xl relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Timing Tools</h3>
            <p className="text-gray-600">Advanced features for timing optimization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/bill-best-practices">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm cursor-pointer"
                data-testid="link-negotiation-templates"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-6 w-6 text-amber-600" />
                  <h4 className="font-semibold text-gray-900">Negotiation Templates</h4>
                </div>
                <p className="text-sm text-gray-600">Timing-optimized letter templates</p>
              </motion.div>
            </Link>

            <Link href="/industry-insights">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm cursor-pointer"
                data-testid="link-provider-intelligence"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Radar className="h-6 w-6 text-amber-600" />
                  <h4 className="font-semibold text-gray-900">Provider Intelligence</h4>
                </div>
                <p className="text-sm text-gray-600">Hospital-specific timing data</p>
              </motion.div>
            </Link>

            <Link href="/negotiation-coaching">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm cursor-pointer"
                data-testid="link-expert-coaching"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-amber-600" />
                  <h4 className="font-semibold text-gray-900">Expert Coaching</h4>
                </div>
                <p className="text-sm text-gray-600">1-on-1 timing strategy sessions</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}