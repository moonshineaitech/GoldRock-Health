import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Calendar,
  Users,
  Award,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Share2,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Star,
  Zap,
  Eye,
  FileText,
  Calculator,
  MapPin,
  Phone,
  Building2,
  Percent,
  Flame,
  TrendingUp as Growth,
  ShieldCheck,
  Bookmark,
  PlayCircle,
  Sparkles
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  RadialBarChart,
  RadialBar,
  Legend,
  ComposedChart
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Mock analytics data - In real app, this would come from API
const mockAnalyticsData = {
  totalSavings: 43650,
  totalBills: 23,
  successRate: 87.2,
  averageSaving: 1898,
  averageTimeToResolution: 18.5,
  streak: 12,
  currentGoal: 50000,
  goalProgress: 87.3,
  
  // Savings over time
  savingsTimeline: [
    { month: "Jan", savings: 2400, bills: 2, successRate: 85 },
    { month: "Feb", savings: 4100, bills: 3, successRate: 89 },
    { month: "Mar", savings: 7800, bills: 4, successRate: 92 },
    { month: "Apr", savings: 12300, bills: 5, successRate: 88 },
    { month: "May", savings: 18650, bills: 4, successRate: 86 },
    { month: "Jun", savings: 25400, bills: 5, successRate: 90 },
    { month: "Jul", savings: 32100, bills: 6, successRate: 89 },
    { month: "Aug", savings: 38900, bills: 4, successRate: 91 },
    { month: "Sep", savings: 43650, bills: 3, successRate: 87 }
  ],
  
  // Strategy effectiveness
  strategies: [
    { name: "AI Bill Analysis", used: 18, success: 16, avgSaving: 2340, color: "#10B981" },
    { name: "Negotiation Scripts", used: 15, success: 13, avgSaving: 1950, color: "#3B82F6" },
    { name: "Dispute Letters", used: 12, success: 11, avgSaving: 1740, color: "#8B5CF6" },
    { name: "Insurance Appeals", used: 8, success: 7, avgSaving: 3200, color: "#F59E0B" },
    { name: "Timing Strategy", used: 23, success: 20, avgSaving: 1680, color: "#EF4444" }
  ],
  
  // Provider difficulty scores
  providers: [
    { name: "General Hospital", bills: 5, success: 4, difficulty: 6.2, avgSaving: 2100 },
    { name: "Metro Medical Center", bills: 4, success: 4, difficulty: 4.8, avgSaving: 2890 },
    { name: "Regional Healthcare", bills: 3, success: 2, difficulty: 8.1, avgSaving: 1200 },
    { name: "City Emergency Room", bills: 6, success: 5, difficulty: 5.9, avgSaving: 2450 },
    { name: "Specialty Clinic", bills: 5, success: 5, difficulty: 3.2, avgSaving: 1850 }
  ],
  
  // Bill categories
  billCategories: [
    { category: "Emergency Room", amount: 18500, percentage: 42.4, bills: 8 },
    { category: "Surgery", amount: 12300, percentage: 28.2, bills: 4 },
    { category: "Diagnostic Tests", amount: 6850, percentage: 15.7, bills: 7 },
    { category: "Specialist Visits", amount: 4200, percentage: 9.6, bills: 3 },
    { category: "Pharmacy", amount: 1800, percentage: 4.1, bills: 1 }
  ],
  
  // Monthly performance
  monthlyPerformance: [
    { month: "Jan", savingsGoal: 5000, actualSavings: 2400, billsProcessed: 2, timeSpent: 8 },
    { month: "Feb", savingsGoal: 5000, actualSavings: 4100, billsProcessed: 3, timeSpent: 12 },
    { month: "Mar", savingsGoal: 6000, actualSavings: 7800, billsProcessed: 4, timeSpent: 16 },
    { month: "Apr", savingsGoal: 6000, actualSavings: 5200, billsProcessed: 5, timeSpent: 20 },
    { month: "May", savingsGoal: 7000, actualSavings: 6350, billsProcessed: 4, timeSpent: 14 },
    { month: "Jun", savingsGoal: 7000, actualSavings: 6750, billsProcessed: 5, timeSpent: 18 },
    { month: "Jul", savingsGoal: 8000, actualSavings: 6700, billsProcessed: 6, timeSpent: 22 },
    { month: "Aug", savingsGoal: 8000, actualSavings: 6800, billsProcessed: 4, timeSpent: 16 },
    { month: "Sep", savingsGoal: 8000, actualSavings: 4750, billsProcessed: 3, timeSpent: 12 }
  ]
};

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'];

// Enhanced Animation Variants
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
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Animated Counter Component
function AnimatedCounter({ target, duration = 2000, prefix = "", suffix = "" }: { 
  target: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationId: number;

      const animate = (currentTime: number) => {
        if (startTime === undefined) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * target));

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Enhanced Metric Card Component
function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  trend, 
  subtitle, 
  gradient,
  delay = 0 
}: {
  icon: any;
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  gradient: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="relative group"
    >
      <motion.div
        className={`h-full bg-gradient-to-br ${gradient} rounded-3xl p-6 border border-white/20 backdrop-blur-sm relative overflow-hidden`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Icon className="text-white h-7 w-7" />
            </motion.div>
            {change && (
              <motion.div
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium
                  ${trend === 'up' ? 'bg-emerald-500/20 text-emerald-100' : 
                    trend === 'down' ? 'bg-red-500/20 text-red-100' : 
                    'bg-gray-500/20 text-gray-100'}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.3 }}
              >
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                <span>{change}</span>
              </motion.div>
            )}
          </div>

          <motion.h3
            className="text-white/90 text-sm font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            {title}
          </motion.h3>

          <motion.div
            className="text-3xl font-bold text-white mb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.5 }}
          >
            {typeof value === 'number' ? (
              <AnimatedCounter target={value} prefix="$" />
            ) : (
              value
            )}
          </motion.div>

          {subtitle && (
            <motion.p
              className="text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Chart Components
function SavingsTimelineChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={mockAnalyticsData.savingsTimeline}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis yAxisId="left" stroke="#64748b" />
          <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }} 
          />
          <Area
            type="monotone"
            dataKey="savings"
            fill="url(#savingsGradient)"
            stroke="#10B981"
            strokeWidth={3}
            yAxisId="left"
          />
          <Line
            type="monotone"
            dataKey="successRate"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            yAxisId="right"
          />
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function StrategyEffectivenessChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={mockAnalyticsData.strategies} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis type="number" stroke="#64748b" />
          <YAxis dataKey="name" type="category" stroke="#64748b" width={120} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px' 
            }} 
          />
          <Bar 
            dataKey="avgSaving" 
            fill="#3B82F6"
            radius={[0, 8, 8, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function BillCategoriesChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={mockAnalyticsData.billCategories}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="amount"
            startAngle={90}
            endAngle={-270}
          >
            {mockAnalyticsData.billCategories.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px' 
            }} 
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Achievement Component
function AchievementBadge({ title, description, icon: Icon, unlocked, progress }: {
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`relative p-4 rounded-2xl border ${
        unlocked 
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
      }`}
    >
      {unlocked && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
        >
          <CheckCircle2 className="h-4 w-4 text-white" />
        </motion.div>
      )}
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        unlocked 
          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
          : 'bg-gray-300 text-gray-500'
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <h4 className={`font-semibold mb-1 ${unlocked ? 'text-amber-800' : 'text-gray-600'}`}>
        {title}
      </h4>
      <p className={`text-sm ${unlocked ? 'text-amber-600' : 'text-gray-500'}`}>
        {description}
      </p>
      
      {!unlocked && progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Main Dashboard Component
export default function AnalyticsDashboard() {
  const { isSubscribed } = useSubscription();
  const [timeframe, setTimeframe] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");

  // Premium gate - show paywall for non-subscribers
  if (!isSubscribed) {
    return (
      <MobileLayout title="Analytics Dashboard">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics Dashboard</h1>
            <p className="text-gray-600 mb-6">Track your bill reduction success with comprehensive analytics, progress insights, and professional reporting tools.</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Premium Analytics</h3>
                <p className="text-amber-700 text-sm">Unlock comprehensive insights</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                "Total savings tracking & trends over time",
                "Success rate analytics by strategy type", 
                "Provider-specific negotiation insights",
                "Bill complexity vs. success correlation",
                "Downloadable progress & tax reports",
                "Achievement system with milestone tracking",
                "Comparative benchmarking against averages",
                "ROI calculations & seasonal trend analysis"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold"
              data-testid="premium-analytics-paywall"
            >
              Unlock Advanced Analytics
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const achievements = [
    { 
      title: "First Victory", 
      description: "Successfully negotiated your first bill", 
      icon: Trophy, 
      unlocked: true 
    },
    { 
      title: "Savings Streak", 
      description: "12 consecutive successful negotiations", 
      icon: Flame, 
      unlocked: true 
    },
    { 
      title: "Big Win", 
      description: "Single bill reduction over $5,000", 
      icon: Star, 
      unlocked: true 
    },
    { 
      title: "Master Negotiator", 
      description: "Achieve 90%+ success rate", 
      icon: Award, 
      unlocked: false, 
      progress: 72 
    },
    { 
      title: "Savings Champion", 
      description: "Save over $50,000 total", 
      icon: Zap, 
      unlocked: false, 
      progress: 87 
    }
  ];

  return (
    <MobileLayout title="Analytics Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-6">
            <motion.div
              className="flex items-center justify-between mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold mb-2" data-testid="text-dashboard-title">
                  Analytics Dashboard
                </h1>
                <p className="text-indigo-100">
                  Comprehensive bill reduction analytics & insights
                </p>
              </motion.div>
              
              <motion.div 
                className="flex space-x-3"
                variants={itemVariants}
              >
                <Button 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
                  data-testid="button-export-report"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
                  data-testid="button-share-dashboard"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </motion.div>
            </motion.div>

            {/* Key Metrics Row */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <MetricCard
                icon={DollarSign}
                title="Total Savings"
                value={mockAnalyticsData.totalSavings}
                change="+23.5%"
                trend="up"
                subtitle="This year"
                gradient="from-emerald-500 to-teal-600"
                delay={0.1}
              />
              <MetricCard
                icon={Target}
                title="Success Rate"
                value={`${mockAnalyticsData.successRate}%`}
                change="+5.2%"
                trend="up"
                subtitle="Last 30 days"
                gradient="from-blue-500 to-indigo-600"
                delay={0.2}
              />
              <MetricCard
                icon={FileText}
                title="Bills Processed"
                value={mockAnalyticsData.totalBills}
                subtitle="Total count"
                gradient="from-purple-500 to-pink-600"
                delay={0.3}
              />
              <MetricCard
                icon={Clock}
                title="Avg Resolution"
                value={`${mockAnalyticsData.averageTimeToResolution} days`}
                change="-3.2 days"
                trend="up"
                subtitle="Time to success"
                gradient="from-amber-500 to-orange-600"
                delay={0.4}
              />
            </motion.div>

            {/* Progress toward goal */}
            <motion.div
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Annual Savings Goal</h3>
                  <p className="text-white/70 text-sm">
                    ${mockAnalyticsData.totalSavings.toLocaleString()} of ${mockAnalyticsData.currentGoal.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{mockAnalyticsData.goalProgress}%</div>
                  <div className="flex items-center text-emerald-200 text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    On track
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${mockAnalyticsData.goalProgress}%` }}
                  transition={{ duration: 2, delay: 1 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 3,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6">
          {/* Filters & Controls */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" data-testid="button-refresh-data">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </motion.div>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-1 bg-white/60 backdrop-blur-sm p-1 rounded-2xl">
              <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-trends">
                Trends
              </TabsTrigger>
              <TabsTrigger value="strategies" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-strategies">
                Strategies
              </TabsTrigger>
              <TabsTrigger value="providers" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-providers">
                Providers
              </TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-achievements">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-reports">
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                className="grid gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Savings Timeline Chart */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <LineChart className="h-5 w-5 text-emerald-600" />
                        <span>Savings Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <SavingsTimelineChart />
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Bill Categories */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        <span>Bill Categories</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="grid lg:grid-cols-2 gap-6 items-center">
                        <BillCategoriesChart />
                        <div className="space-y-3">
                          {mockAnalyticsData.billCategories.map((category, index) => (
                            <motion.div
                              key={category.category}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                              variants={itemVariants}
                              transition={{ delay: 0.1 * index }}
                            >
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: COLORS[index] }}
                                />
                                <span className="font-medium">{category.category}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">
                                  ${category.amount.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category.bills} bills
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Coaching Progress - NEW */}
                <MobileCard className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-200">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-emerald-600" />
                        <span>Premium 1:1 Coaching Progress</span>
                        <Badge className="ml-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                          Active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="space-y-4">
                        {/* Active Coaching Session */}
                        <div className="bg-white p-4 rounded-xl border-2 border-emerald-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900" data-testid="text-coaching-case-name">Current Case: Hospital ABC</h4>
                              <p className="text-sm text-gray-600" data-testid="text-coaching-bill-amount">Bill Amount: $25,000</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald-600" data-testid="text-coaching-estimated-savings">$8,750</div>
                              <p className="text-xs text-emerald-700">Est. Savings</p>
                            </div>
                          </div>

                          {/* Journey Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-medium text-gray-700" data-testid="text-coaching-step-count">Step 3 of 6</span>
                              <span className="text-emerald-600 font-medium" data-testid="text-coaching-completion-percent">50% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3" data-testid="progress-coaching-journey">
                              <motion.div
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "50%" }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                              />
                            </div>
                          </div>

                          {/* Coaching Steps */}
                          <div className="space-y-2 mb-4">
                            {[
                              { step: "Personalized Assessment", status: "completed", icon: CheckCircle2 },
                              { step: "Bill Analysis Review", status: "completed", icon: CheckCircle2 },
                              { step: "Negotiation Strategy", status: "in-progress", icon: Target },
                              { step: "Document Preparation", status: "pending", icon: FileText },
                              { step: "Execution & Coaching Call", status: "pending", icon: Phone },
                              { step: "Follow-up & Escalation", status: "pending", icon: TrendingUp }
                            ].map((item, index) => (
                              <div 
                                key={item.step}
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                                  item.status === 'completed' ? 'bg-green-50 border border-green-200' :
                                  item.status === 'in-progress' ? 'bg-blue-50 border-2 border-blue-400' :
                                  'bg-gray-50'
                                }`}
                                data-testid={`step-coaching-${item.step.toLowerCase().replace(/\s+/g, '-')}-${item.status}`}
                              >
                                <item.icon className={`h-4 w-4 ${
                                  item.status === 'completed' ? 'text-green-600' :
                                  item.status === 'in-progress' ? 'text-blue-600' :
                                  'text-gray-400'
                                }`} />
                                <span className={`text-sm flex-1 ${
                                  item.status === 'completed' ? 'text-green-900 font-medium' :
                                  item.status === 'in-progress' ? 'text-blue-900 font-bold' :
                                  'text-gray-600'
                                }`}>
                                  {item.step}
                                </span>
                                {item.status === 'in-progress' && (
                                  <Badge className="bg-blue-500 text-white" data-testid="badge-current-step">Current</Badge>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Coaching Stats */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-xl">
                              <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                              <div className="text-sm font-bold text-gray-900" data-testid="text-coaching-time-invested">2.5 hrs</div>
                              <div className="text-xs text-gray-600">Time Invested</div>
                            </div>
                            <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-xl">
                              <Target className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                              <div className="text-sm font-bold text-gray-900" data-testid="text-coaching-success-rate">85%</div>
                              <div className="text-xs text-gray-600">Success Rate</div>
                            </div>
                            <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-xl">
                              <Star className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                              <div className="text-sm font-bold text-gray-900" data-testid="text-coaching-level">Expert</div>
                              <div className="text-xs text-gray-600">Coach Level</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                              data-testid="button-resume-coaching"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Resume Coaching
                            </Button>
                            <Button 
                              variant="outline"
                              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                              data-testid="button-view-templates"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Templates
                            </Button>
                          </div>
                        </div>

                        {/* Coaching Impact Summary */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl text-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Trophy className="h-5 w-5" />
                              <h4 className="font-bold">Coaching Impact</h4>
                            </div>
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-2xl font-bold" data-testid="text-coaching-total-savings">$43,650</div>
                              <div className="text-emerald-100 text-sm">Total Savings with Coaching</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold" data-testid="text-coaching-bills-negotiated">23 Bills</div>
                              <div className="text-emerald-100 text-sm">Successfully Negotiated</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Recent Activity */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      {[
                        { action: "Negotiated emergency room bill", amount: "$2,340", status: "success", time: "2 hours ago" },
                        { action: "Submitted insurance appeal", amount: "$1,850", status: "pending", time: "1 day ago" },
                        { action: "Successfully disputed diagnostic charges", amount: "$890", status: "success", time: "3 days ago" },
                        { action: "Used AI analysis for surgery bill", amount: "$4,200", status: "success", time: "1 week ago" }
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100"
                          variants={itemVariants}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {activity.action}
                            </div>
                            <div className="text-sm text-gray-500">
                              {activity.time}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600">
                              {activity.amount}
                            </div>
                            <Badge 
                              variant={activity.status === 'success' ? 'default' : 'secondary'}
                              className={activity.status === 'success' ? 
                                'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 
                                'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </MobileCard>
              </motion.div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <motion.div 
                className="grid gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Monthly Performance */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        <span>Monthly Performance vs Goals</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={mockAnalyticsData.monthlyPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis dataKey="month" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              border: '1px solid #e2e8f0', 
                              borderRadius: '12px' 
                            }} 
                          />
                          <Legend />
                          <Bar 
                            dataKey="savingsGoal" 
                            fill="#e2e8f0" 
                            name="Savings Goal"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="actualSavings" 
                            fill="#10B981" 
                            name="Actual Savings"
                            radius={[4, 4, 0, 0]}
                          />
                          <Line
                            type="monotone"
                            dataKey="billsProcessed"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Bills Processed"
                            dot={{ fill: '#3B82F6' }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Seasonal Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  <MobileCard className="p-6">
                    <motion.div variants={itemVariants}>
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Seasonal Trends</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">Q1 Peak Season</h4>
                          <p className="text-blue-700 text-sm">
                            Higher success rates in Jan-Mar due to insurance deductible resets
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-blue-600 text-sm">Success Rate</span>
                            <span className="font-bold text-blue-900">94.2%</span>
                          </div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <h4 className="font-semibold text-amber-900 mb-2">Summer Challenges</h4>
                          <p className="text-amber-700 text-sm">
                            Reduced effectiveness during summer months
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-amber-600 text-sm">Success Rate</span>
                            <span className="font-bold text-amber-900">78.5%</span>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  </MobileCard>

                  <MobileCard className="p-6">
                    <motion.div variants={itemVariants}>
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Improvement Trend</h4>
                            <p className="text-gray-600 text-sm">Success rate improved 15% over last 6 months</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Optimal Timing</h4>
                            <p className="text-gray-600 text-sm">Best results achieved within 14-21 days of bill receipt</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                            <Zap className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Strategy Evolution</h4>
                            <p className="text-gray-600 text-sm">AI analysis increased average savings by 28%</p>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  </MobileCard>
                </div>
              </motion.div>
            </TabsContent>

            {/* Strategies Tab */}
            <TabsContent value="strategies" className="space-y-6">
              <motion.div 
                className="grid gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Strategy Effectiveness Chart */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span>Strategy Effectiveness</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <StrategyEffectivenessChart />
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Strategy Details */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle>Detailed Strategy Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      {mockAnalyticsData.strategies.map((strategy, index) => (
                        <motion.div
                          key={strategy.name}
                          className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100"
                          variants={itemVariants}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                              {Math.round((strategy.success / strategy.used) * 100)}% Success
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Times Used</div>
                              <div className="font-bold text-gray-900">{strategy.used}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Successes</div>
                              <div className="font-bold text-emerald-600">{strategy.success}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Avg Saving</div>
                              <div className="font-bold text-blue-600">${strategy.avgSaving}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Success Rate</span>
                              <span>{Math.round((strategy.success / strategy.used) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="h-2 rounded-full"
                                style={{ backgroundColor: strategy.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(strategy.success / strategy.used) * 100}%` }}
                                transition={{ duration: 1.5, delay: 0.2 + index * 0.1 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Strategy Recommendations */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-emerald-600" />
                        <span>Optimization Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-emerald-900 mb-2">Focus on AI Analysis</h4>
                            <p className="text-emerald-700 text-sm">
                              Your highest success strategy. Consider using AI analysis for all bills over $1,000.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Improve Timing Strategy</h4>
                            <p className="text-blue-700 text-sm">
                              While frequently used, timing strategy has room for improvement. Review optimal timing guides.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                            <Zap className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-2">Leverage Insurance Appeals</h4>
                            <p className="text-amber-700 text-sm">
                              Highest average savings but underutilized. Consider insurance appeals for complex cases.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>
              </motion.div>
            </TabsContent>

            {/* Providers Tab */}
            <TabsContent value="providers" className="space-y-6">
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span>Provider Performance Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      {mockAnalyticsData.providers.map((provider, index) => (
                        <motion.div
                          key={provider.name}
                          className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100"
                          variants={itemVariants}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={provider.difficulty < 5 ? 'default' : provider.difficulty < 7 ? 'secondary' : 'destructive'}
                                className={
                                  provider.difficulty < 5 ? 'bg-emerald-100 text-emerald-800' :
                                  provider.difficulty < 7 ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }
                              >
                                Difficulty: {provider.difficulty}/10
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Bills Processed</div>
                              <div className="font-bold text-gray-900">{provider.bills}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Success Rate</div>
                              <div className="font-bold text-emerald-600">
                                {Math.round((provider.success / provider.bills) * 100)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Avg Savings</div>
                              <div className="font-bold text-blue-600">${provider.avgSaving}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Total Saved</div>
                              <div className="font-bold text-purple-600">
                                ${(provider.avgSaving * provider.success).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Negotiation Success</span>
                              <span>{Math.round((provider.success / provider.bills) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  provider.difficulty < 5 ? 'bg-emerald-500' :
                                  provider.difficulty < 7 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(provider.success / provider.bills) * 100}%` }}
                                transition={{ duration: 1.5, delay: 0.2 + index * 0.1 }}
                              />
                            </div>
                          </div>

                          {/* Provider-specific tips */}
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h5 className="text-xs font-semibold text-blue-900 mb-1">Optimization Tip</h5>
                            <p className="text-xs text-blue-700">
                              {provider.difficulty < 5 ? 
                                "This provider is typically cooperative. Use standard negotiation approach." :
                                provider.difficulty < 7 ? 
                                "Moderate difficulty. Consider using formal dispute letters." :
                                "High difficulty provider. Leverage insurance appeals and escalation strategies."
                              }
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Provider Insights */}
                <div className="grid md:grid-cols-2 gap-6">
                  <MobileCard className="p-6">
                    <motion.div variants={itemVariants}>
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Best Performing Providers</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-3">
                        {mockAnalyticsData.providers
                          .sort((a, b) => (b.success / b.bills) - (a.success / a.bills))
                          .slice(0, 3)
                          .map((provider, index) => (
                            <div key={provider.name} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                              <div>
                                <div className="font-medium text-emerald-900">{provider.name}</div>
                                <div className="text-sm text-emerald-600">
                                  {Math.round((provider.success / provider.bills) * 100)}% success rate
                                </div>
                              </div>
                              <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                            </div>
                        ))}
                      </CardContent>
                    </motion.div>
                  </MobileCard>

                  <MobileCard className="p-6">
                    <motion.div variants={itemVariants}>
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Challenge Providers</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-3">
                        {mockAnalyticsData.providers
                          .sort((a, b) => b.difficulty - a.difficulty)
                          .slice(0, 3)
                          .map((provider, index) => (
                            <div key={provider.name} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                              <div>
                                <div className="font-medium text-red-900">{provider.name}</div>
                                <div className="text-sm text-red-600">
                                  Difficulty: {provider.difficulty}/10
                                </div>
                              </div>
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                        ))}
                      </CardContent>
                    </motion.div>
                  </MobileCard>
                </div>
              </motion.div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Achievement Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter target={12} />
                    </div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Flame className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter target={mockAnalyticsData.streak} />
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,340</div>
                    <div className="text-sm text-gray-600">XP Points</div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Growth className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Level 8</div>
                    <div className="text-sm text-gray-600">Negotiator</div>
                  </motion.div>
                </div>

                {/* Achievement Grid */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        <span>Your Achievements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.title}
                            variants={itemVariants}
                            transition={{ delay: 0.1 * index }}
                          >
                            <AchievementBadge {...achievement} />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Progress Tracking */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle>Next Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-emerald-900">Savings Champion</h4>
                          <span className="text-sm text-emerald-600">87% Complete</span>
                        </div>
                        <p className="text-emerald-700 text-sm mb-3">Reach $50,000 in total savings</p>
                        <div className="w-full bg-emerald-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "87%" }}
                            transition={{ duration: 2, delay: 0.5 }}
                          />
                        </div>
                        <div className="text-xs text-emerald-600 mt-1">
                          $6,350 remaining to unlock
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-purple-900">Master Negotiator</h4>
                          <span className="text-sm text-purple-600">72% Complete</span>
                        </div>
                        <p className="text-purple-700 text-sm mb-3">Achieve 90%+ success rate</p>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "72%" }}
                            transition={{ duration: 2, delay: 0.7 }}
                          />
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          Need 3+ successful negotiations
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>
              </motion.div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Report Generation */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Generate Reports</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            title: "Tax Documentation",
                            description: "Download official savings report for tax purposes",
                            icon: Calculator,
                            color: "emerald"
                          },
                          {
                            title: "Annual Summary",
                            description: "Comprehensive year-end performance report",
                            icon: FileText,
                            color: "blue"
                          },
                          {
                            title: "Provider Analysis",
                            description: "Detailed analysis by healthcare provider",
                            icon: Building2,
                            color: "purple"
                          },
                          {
                            title: "Strategy Breakdown",
                            description: "Success rates and recommendations by strategy",
                            icon: Target,
                            color: "amber"
                          },
                          {
                            title: "Progress Certification",
                            description: "Official certificate of your achievements",
                            icon: Award,
                            color: "rose"
                          },
                          {
                            title: "Savings Timeline",
                            description: "Month-by-month savings progression",
                            icon: TrendingUp,
                            color: "teal"
                          }
                        ].map((report, index) => (
                          <motion.div
                            key={report.title}
                            className={`p-4 bg-gradient-to-br from-${report.color}-50 to-${report.color}-100 rounded-xl border border-${report.color}-200 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                            variants={itemVariants}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            data-testid={`report-${report.title.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div className={`w-12 h-12 bg-gradient-to-br from-${report.color}-400 to-${report.color}-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                              <report.icon className="h-6 w-6 text-white" />
                            </div>
                            <h4 className={`font-semibold text-${report.color}-900 mb-2`}>
                              {report.title}
                            </h4>
                            <p className={`text-${report.color}-700 text-sm`}>
                              {report.description}
                            </p>
                            <Button 
                              size="sm" 
                              className={`mt-3 w-full bg-${report.color}-500 hover:bg-${report.color}-600 text-white`}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>

                {/* Quick Stats for Sharing */}
                <MobileCard className="p-6">
                  <motion.div variants={itemVariants}>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center space-x-2">
                        <Share2 className="h-5 w-5 text-green-600" />
                        <span>Share Your Success</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">
                            ${mockAnalyticsData.totalSavings.toLocaleString()}
                          </div>
                          <div className="text-emerald-100 mb-4">
                            Total Savings This Year
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold">{mockAnalyticsData.totalBills}</div>
                              <div className="text-emerald-200 text-sm">Bills Processed</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{mockAnalyticsData.successRate}%</div>
                              <div className="text-emerald-200 text-sm">Success Rate</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{mockAnalyticsData.streak}</div>
                              <div className="text-emerald-200 text-sm">Day Streak</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          data-testid="button-share-social"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share on Social
                        </Button>
                        <Button 
                          variant="outline"
                          data-testid="button-copy-stats"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Copy Stats
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                </MobileCard>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
}