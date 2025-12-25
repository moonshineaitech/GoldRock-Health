import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { 
  DollarSign, ArrowRight, Brain, Target, Trophy, Sparkles, Receipt, Shield, Lock,
  Stethoscope, Heart, Activity, Pill, BarChart3, Zap, Star, ChevronRight, Play,
  FileText, MessageCircle, Award, TrendingUp, Clock, CheckCircle, Rocket, Upload,
  Search, Users, Settings, Crown, Bell, Calendar, Layers, Gift, Flame, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const GlowOrb = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-3xl pointer-events-none`}
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.15, 0.25, 0.15],
      x: [0, 20, 0],
      y: [0, -15, 0],
    }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const QuickActionCard = ({ icon: Icon, title, description, href, gradient, badge }: {
  icon: any; title: string; description: string; href: string; gradient: string; badge?: string;
}) => (
  <Link href={href}>
    <motion.div
      className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-5 text-white shadow-xl overflow-hidden cursor-pointer h-full`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0"
        whileHover={{ opacity: 1, x: ["-100%", "200%"] }}
        transition={{ duration: 0.8 }}
      />
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      
      {badge && (
        <motion.span
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {badge}
        </motion.span>
      )}
      
      <motion.div
        className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3"
        whileHover={{ rotate: [0, -10, 10, 0] }}
      >
        <Icon className="h-6 w-6 text-white" strokeWidth={2} />
      </motion.div>
      
      <h3 className="relative z-10 text-lg font-black mb-1">{title}</h3>
      <p className="relative z-10 text-white/80 text-sm">{description}</p>
      
      <div className="relative z-10 flex items-center gap-1 mt-3 text-white/70 text-sm font-semibold">
        <span>Open</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </motion.div>
  </Link>
);

const FeatureRow = ({ icon: Icon, title, description, href, color }: {
  icon: any; title: string; description: string; href: string; color: string;
}) => (
  <Link href={href}>
    <motion.div
      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
      whileHover={{ x: 4, backgroundColor: "rgb(249, 250, 251)" }}
      whileTap={{ scale: 0.99 }}
      data-testid={`row-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
    </motion.div>
  </Link>
);

const StatCard = ({ value, label, icon: Icon, color }: {
  value: string; label: string; icon: any; color: string;
}) => (
  <motion.div
    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -2 }}
  >
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="text-2xl font-black text-gray-900">{value}</div>
    <div className="text-xs text-gray-500 font-medium">{label}</div>
  </motion.div>
);

export default function Landing() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Welcome");
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "Upload a medical bill to find potential savings",
    "Try the AI patient simulations for diagnostic training",
    "Check your health metrics in the Clinical Hub",
    "Explore dispute templates to fight unfair charges"
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <MobileLayout title="GoldRock Health" showBottomNav={true}>
      <div className="relative overflow-hidden">
        <GlowOrb color="bg-emerald-400" size={300} x="-10%" y="5%" delay={0} />
        <GlowOrb color="bg-purple-400" size={250} x="80%" y="15%" delay={2} />
        <GlowOrb color="bg-amber-400" size={200} x="60%" y="60%" delay={4} />

        <div className="relative z-10 space-y-6 pb-8">
          <motion.div 
            className="pt-6 px-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="section-hero"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <motion.p 
                  className="text-gray-500 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {greeting}
                </motion.p>
                <motion.h1 
                  className="text-3xl font-black text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {firstName}! 👋
                </motion.h1>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Link href="/settings">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-2xl" />
                    ) : (
                      <DollarSign className="h-6 w-6 text-white" />
                    )}
                  </div>
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-5 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.15),transparent_50%)]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </motion.div>
                  <span className="text-amber-400 font-bold text-sm">Quick Tip</span>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    className="text-white font-medium text-lg leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tips[currentTip]}
                  </motion.p>
                </AnimatePresence>

                <div className="flex gap-1.5 mt-4">
                  {tips.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentTip ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            data-testid="section-quick-actions"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black text-gray-900">Quick Actions</h2>
              <Link href="/resources-hub">
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 cursor-pointer">
                  See All <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                icon={Receipt}
                title="Analyze Bill"
                description="AI-powered analysis"
                href="/bill-ai"
                gradient="from-emerald-500 to-teal-500"
                badge="AI"
              />
              <QuickActionCard
                icon={Target}
                title="AI Patients"
                description="Diagnostic training"
                href="/patient-diagnostics"
                gradient="from-purple-500 to-violet-500"
              />
              <QuickActionCard
                icon={Stethoscope}
                title="Health Hub"
                description="Clinical tools"
                href="/clinical-command-center"
                gradient="from-blue-500 to-indigo-500"
              />
              <QuickActionCard
                icon={Trophy}
                title="Pixel Doctor"
                description="Medical game"
                href="/game"
                gradient="from-amber-500 to-orange-500"
                badge="Play"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-3"
            data-testid="section-stats"
          >
            <StatCard value="$35K+" label="Avg Savings" icon={DollarSign} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
            <StatCard value="500+" label="AI Patients" icon={Users} color="bg-gradient-to-br from-purple-500 to-violet-500" />
            <StatCard value="19" label="Specialties" icon={Award} color="bg-gradient-to-br from-amber-500 to-orange-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            data-testid="section-financial-tools"
          >
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Financial Defense</h2>
            </div>

            <div className="space-y-3">
              <FeatureRow
                icon={Receipt}
                title="Bill Analyzer"
                description="Find errors and savings opportunities"
                href="/bill-ai"
                color="bg-gradient-to-br from-emerald-500 to-teal-500"
              />
              <FeatureRow
                icon={FileText}
                title="Dispute Arsenal"
                description="Templates and negotiation scripts"
                href="/dispute-arsenal"
                color="bg-gradient-to-br from-blue-500 to-indigo-500"
              />
              <FeatureRow
                icon={MessageCircle}
                title="Coaching Center"
                description="Expert negotiation strategies"
                href="/negotiation-coaching"
                color="bg-gradient-to-br from-purple-500 to-violet-500"
              />
              <FeatureRow
                icon={TrendingUp}
                title="Analytics"
                description="Track your savings progress"
                href="/analytics-dashboard"
                color="bg-gradient-to-br from-amber-500 to-orange-500"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            data-testid="section-clinical-tools"
          >
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Health Tools</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/lab-analyzer">
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Activity className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-gray-900">Lab Reference</h4>
                  <p className="text-xs text-gray-500">Look up values</p>
                </motion.div>
              </Link>
              <Link href="/drug-interactions">
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Pill className="h-6 w-6 text-purple-600 mb-2" />
                  <h4 className="font-bold text-gray-900">Medications</h4>
                  <p className="text-xs text-gray-500">Drug database</p>
                </motion.div>
              </Link>
              <Link href="/symptom-checker">
                <motion.div
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Brain className="h-6 w-6 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-gray-900">Symptoms</h4>
                  <p className="text-xs text-gray-500">Browse library</p>
                </motion.div>
              </Link>
              <Link href="/health-metrics">
                <motion.div
                  className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart className="h-6 w-6 text-rose-600 mb-2" />
                  <h4 className="font-bold text-gray-900">Health Log</h4>
                  <p className="text-xs text-gray-500">Track metrics</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            data-testid="section-training"
          >
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Medical Training</h2>
            </div>

            <Link href="/patient-diagnostics">
              <motion.div
                className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-3xl p-6 text-white overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                <motion.div
                  className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        500+ Cases
                      </span>
                      <span className="bg-amber-500/80 px-3 py-1 rounded-full text-xs font-bold">
                        19 Specialties
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-2">AI Patient Simulations</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Practice history-taking, physical exams, and differential diagnosis with realistic AI patients
                    </p>
                    <div className="flex items-center gap-2 text-white/90 font-bold">
                      <Play className="h-5 w-5" />
                      <span>Start Training</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            data-testid="section-premium"
          >
            {user?.subscriptionStatus !== 'active' && (
              <Link href="/premium">
                <motion.div
                  className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />

                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Crown className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-1">Upgrade to Premium</h3>
                      <p className="text-white/80 text-sm">Unlock all features and maximize your savings</p>
                    </div>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </motion.div>
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-4 pb-2"
          >
            <MobileCard className="bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-900">Educational Purpose Only</p>
                  <p className="text-xs text-amber-700 mt-1">
                    This platform provides health education and bill analysis tools. Always consult healthcare professionals for medical decisions.
                  </p>
                </div>
              </div>
            </MobileCard>
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
}
