import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { 
  DollarSign, ArrowRight, Brain, Target, Trophy, Sparkles, Receipt, Shield, Lock,
  Stethoscope, Heart, Activity, Pill, BarChart3, Zap, Star, ChevronRight, Play,
  FileText, MessageCircle, Award, TrendingUp, Clock, CheckCircle, Rocket, Upload,
  Search, Users, Settings, Crown, Bell, Calendar, Layers, Gift, Flame, BookOpen,
  Gem, CircleDot, Wand2, MousePointer
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

const GlowOrb = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-[80px] pointer-events-none`}
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.15, 0.3, 0.15],
      x: [0, 25, 0],
      y: [0, -20, 0],
    }}
    transition={{ duration: 10, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const FloatingIcon = ({ icon: Icon, x, y, delay, color }: { icon: any; x: string; y: string; delay: number; color: string }) => (
  <motion.div
    className={`absolute ${color} opacity-20 pointer-events-none`}
    style={{ left: x, top: y }}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 10, -10, 0],
      opacity: [0.1, 0.25, 0.1],
    }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <Icon className="h-8 w-8" />
  </motion.div>
);

const QuickActionCard = ({ icon: Icon, title, description, href, gradient, badge, delay = 0 }: {
  icon: any; title: string; description: string; href: string; gradient: string; badge?: string; delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`relative bg-gradient-to-br ${gradient} rounded-[1.75rem] p-5 text-white shadow-xl overflow-hidden cursor-pointer h-full border border-white/10`}
        data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: isHovered ? "200%" : "-100%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
        
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-black/20 rounded-full blur-2xl" />
        
        {badge && (
          <motion.span
            className="absolute top-3 right-3 bg-white/25 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {badge}
          </motion.span>
        )}
        
        <motion.div
          className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-white/10"
          animate={isHovered ? { rotate: [0, -8, 8, 0], scale: 1.05 } : {}}
          transition={{ duration: 0.4 }}
        >
          <Icon className="h-7 w-7 text-white drop-shadow-md" strokeWidth={2} />
        </motion.div>
        
        <h3 className="relative z-10 text-lg font-black mb-1 tracking-tight">{title}</h3>
        <p className="relative z-10 text-white/80 text-sm font-medium">{description}</p>
        
        <motion.div 
          className="relative z-10 flex items-center gap-1.5 mt-3 text-white/70 text-sm font-bold"
          animate={isHovered ? { x: 5 } : { x: 0 }}
        >
          <span>Open</span>
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </Link>
  );
};

const FeatureRow = ({ icon: Icon, title, description, href, color, delay = 0 }: {
  icon: any; title: string; description: string; href: string; color: string; delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, type: "spring" }}
        whileHover={{ x: 6, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="flex items-center gap-4 p-4 bg-white/80 dark:bg-white backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 cursor-pointer group"
        data-testid={`row-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <motion.div 
          className={`w-13 h-13 ${color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
          style={{ width: 52, height: 52 }}
          animate={isHovered ? { rotate: [0, -5, 5, 0], scale: 1.05 } : {}}
          transition={{ duration: 0.3 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 truncate">{description}</p>
        </div>
        <motion.div animate={isHovered ? { x: 3 } : { x: 0 }}>
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
        </motion.div>
      </motion.div>
    </Link>
  );
};

const StatCard = ({ value, label, icon: Icon, color, delay = 0 }: {
  value: string; label: string; icon: any; color: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 text-center relative overflow-hidden"
    data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <div className={`absolute inset-0 ${color} opacity-5`} />
    <motion.div 
      className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md`}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="h-5 w-5 text-white" />
    </motion.div>
    <div className="text-2xl font-black text-gray-900">{value}</div>
    <div className="text-xs text-gray-500 font-semibold">{label}</div>
  </motion.div>
);

const HealthToolCard = ({ icon: Icon, title, description, href, gradient, delay = 0 }: {
  icon: any; title: string; description: string; href: string; gradient: string; delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring" }}
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 border cursor-pointer relative overflow-hidden`}
        data-testid={`tool-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        />
        <motion.div animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}>
          <Icon className={`h-7 w-7 mb-2 ${gradient.includes('blue') ? 'text-blue-600' : gradient.includes('purple') ? 'text-purple-600' : gradient.includes('emerald') ? 'text-emerald-600' : 'text-rose-600'}`} />
        </motion.div>
        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </motion.div>
    </Link>
  );
};

export default function Landing() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Welcome");
  const [currentTip, setCurrentTip] = useState(0);
  const [mounted, setMounted] = useState(false);

  const tips = [
    { text: "Upload a medical bill to find potential savings", icon: Receipt },
    { text: "Try the AI patient simulations for training", icon: Target },
    { text: "Check your health metrics in the Clinical Hub", icon: Heart },
    { text: "Explore dispute templates to fight charges", icon: FileText },
  ];

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'there';

  if (!mounted) return null;

  return (
    <MobileLayout title="GoldRock Health" showBottomNav={true}>
      <div className="relative overflow-hidden min-h-screen">
        <GlowOrb color="bg-emerald-400" size={250} x="-5%" y="5%" delay={0} />
        <GlowOrb color="bg-purple-400" size={200} x="85%" y="15%" delay={2} />
        <GlowOrb color="bg-amber-400" size={180} x="70%" y="55%" delay={4} />
        <GlowOrb color="bg-blue-400" size={150} x="10%" y="75%" delay={3} />

        <FloatingIcon icon={DollarSign} x="90%" y="8%" delay={0} color="text-emerald-500" />
        <FloatingIcon icon={Brain} x="5%" y="25%" delay={1} color="text-purple-500" />
        <FloatingIcon icon={Heart} x="92%" y="45%" delay={2} color="text-rose-500" />
        <FloatingIcon icon={Trophy} x="8%" y="65%" delay={3} color="text-amber-500" />

        <div className="relative z-10 space-y-7 pb-10">
          <motion.div 
            className="pt-6 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-testid="section-hero"
          >
            <div className="flex items-start justify-between mb-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <motion.p 
                  className="text-gray-500 font-medium text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {greeting}
                </motion.p>
                <motion.h1 
                  className="text-3xl font-black text-gray-900 flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {firstName}!
                  <motion.span
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 0.5, delay: 1, repeat: 2 }}
                  >
                    👋
                  </motion.span>
                </motion.h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              >
                <Link href="/settings">
                  <motion.div 
                    className="relative w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer border-2 border-white/50"
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="button-profile"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Profile" className="w-14 h-14 rounded-2xl" />
                    ) : (
                      <DollarSign className="h-7 w-7 text-white drop-shadow-md" />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[1.75rem] p-6 overflow-hidden border border-white/10 shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              data-testid="card-tips"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.2),transparent_50%)]" />
              
              <div className="relative z-10">
                <motion.div 
                  className="flex items-center gap-2 mb-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </motion.div>
                  <span className="text-amber-400 font-bold text-sm tracking-wide">PRO TIP</span>
                </motion.div>
                
                <div className="h-16 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTip}
                      className="absolute inset-0 flex items-start gap-3"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const TipIcon = tips[currentTip].icon;
                          return <TipIcon className="h-5 w-5 text-white/80" />;
                        })()}
                      </div>
                      <p className="text-white font-semibold text-lg leading-relaxed flex-1">
                        {tips[currentTip].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex gap-2 mt-4">
                  {tips.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentTip ? 'w-8 bg-gradient-to-r from-emerald-400 to-teal-400' : 'w-2 bg-white/30'
                      }`}
                      layoutId={`tip-indicator-${i}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            data-testid="section-quick-actions"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Actions
              </h2>
              <Link href="/resources-hub">
                <motion.span 
                  className="text-sm font-bold text-emerald-600 flex items-center gap-1 cursor-pointer"
                  whileHover={{ x: 3 }}
                  data-testid="link-see-all"
                >
                  See All <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                icon={Receipt}
                title="Analyze Bill"
                description="AI-powered analysis"
                href="/bill-ai"
                gradient="from-emerald-500 via-emerald-400 to-teal-500"
                badge="AI"
                delay={0.9}
              />
              <QuickActionCard
                icon={Target}
                title="AI Patients"
                description="Diagnostic training"
                href="/patient-diagnostics"
                gradient="from-purple-500 via-purple-400 to-violet-500"
                delay={1}
              />
              <QuickActionCard
                icon={Stethoscope}
                title="Health Hub"
                description="Clinical tools"
                href="/clinical-command-center"
                gradient="from-blue-500 via-blue-400 to-indigo-500"
                delay={1.1}
              />
              <QuickActionCard
                icon={Trophy}
                title="Pixel Doctor"
                description="Medical game"
                href="/game"
                gradient="from-amber-500 via-amber-400 to-orange-500"
                badge="Play"
                delay={1.2}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="grid grid-cols-3 gap-3"
            data-testid="section-stats"
          >
            <StatCard value="$35K+" label="Avg Savings" icon={DollarSign} color="bg-gradient-to-br from-emerald-500 to-teal-500" delay={1.3} />
            <StatCard value="500+" label="AI Patients" icon={Users} color="bg-gradient-to-br from-purple-500 to-violet-500" delay={1.4} />
            <StatCard value="19" label="Specialties" icon={Award} color="bg-gradient-to-br from-amber-500 to-orange-500" delay={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            data-testid="section-financial-tools"
          >
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <motion.div 
                className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </motion.div>
              <h2 className="text-xl font-black text-gray-900">Financial Defense</h2>
            </div>

            <div className="space-y-3">
              <FeatureRow
                icon={Receipt}
                title="Bill Analyzer"
                description="Find errors and savings opportunities"
                href="/bill-ai"
                color="bg-gradient-to-br from-emerald-500 to-teal-500"
                delay={1.6}
              />
              <FeatureRow
                icon={FileText}
                title="Dispute Arsenal"
                description="Templates and negotiation scripts"
                href="/dispute-arsenal"
                color="bg-gradient-to-br from-blue-500 to-indigo-500"
                delay={1.7}
              />
              <FeatureRow
                icon={MessageCircle}
                title="Coaching Center"
                description="Expert negotiation strategies"
                href="/negotiation-coaching"
                color="bg-gradient-to-br from-purple-500 to-violet-500"
                delay={1.8}
              />
              <FeatureRow
                icon={TrendingUp}
                title="Analytics"
                description="Track your savings progress"
                href="/analytics-dashboard"
                color="bg-gradient-to-br from-amber-500 to-orange-500"
                delay={1.9}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            data-testid="section-clinical-tools"
          >
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <motion.div 
                className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Stethoscope className="h-5 w-5 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-black text-gray-900">Health Tools</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <HealthToolCard
                icon={Activity}
                title="Lab Reference"
                description="Look up values"
                href="/lab-analyzer"
                gradient="from-blue-50 to-indigo-50 border-blue-200"
                delay={2.1}
              />
              <HealthToolCard
                icon={Pill}
                title="Medications"
                description="Drug database"
                href="/drug-interactions"
                gradient="from-purple-50 to-violet-50 border-purple-200"
                delay={2.2}
              />
              <HealthToolCard
                icon={Brain}
                title="Symptoms"
                description="Browse library"
                href="/symptom-checker"
                gradient="from-emerald-50 to-teal-50 border-emerald-200"
                delay={2.3}
              />
              <HealthToolCard
                icon={Heart}
                title="Health Log"
                description="Track metrics"
                href="/health-metrics"
                gradient="from-rose-50 to-pink-50 border-rose-200"
                delay={2.4}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            data-testid="section-training"
          >
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <motion.div 
                className="w-9 h-9 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center shadow-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Target className="h-5 w-5 text-purple-600" />
              </motion.div>
              <h2 className="text-xl font-black text-gray-900">Medical Training</h2>
            </div>

            <Link href="/patient-diagnostics">
              <motion.div
                className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-[1.75rem] p-7 text-white overflow-hidden cursor-pointer border border-white/10 shadow-2xl"
                whileHover={{ scale: 1.01, y: -3 }}
                whileTap={{ scale: 0.99 }}
                data-testid="card-ai-training"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_50%)]" />
                <motion.div
                  className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 12, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-8 -left-8 w-28 h-28 bg-purple-400/20 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <motion.span 
                        className="bg-white/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20"
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        500+ Cases
                      </motion.span>
                      <span className="bg-amber-500/90 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        19 Specialties
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-2 tracking-tight">AI Patient Simulations</h3>
                    <p className="text-white/85 text-sm mb-5 leading-relaxed">
                      Practice history-taking, physical exams, and differential diagnosis with realistic AI patients
                    </p>
                    <motion.div 
                      className="flex items-center gap-2 text-white font-bold"
                      whileHover={{ x: 5 }}
                    >
                      <Play className="h-5 w-5" />
                      <span>Start Training</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="w-18 h-18 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl ml-4"
                    style={{ width: 72, height: 72 }}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <Target className="h-9 w-9 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {user?.subscriptionStatus !== 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7 }}
              data-testid="section-premium"
            >
              <Link href="/premium">
                <motion.div
                  className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-[1.75rem] p-6 text-white overflow-hidden cursor-pointer border border-white/20 shadow-2xl"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  data-testid="card-premium"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-2xl" />

                  <div className="relative z-10 flex items-center gap-5">
                    <motion.div 
                      className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Crown className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-1">Upgrade to Premium</h3>
                      <p className="text-white/85 text-sm font-medium">Unlock all features and maximize savings</p>
                    </div>
                    <ArrowRight className="h-7 w-7" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.9 }}
            className="pt-2 pb-4"
          >
            <MobileCard className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
              <div className="flex items-start gap-3">
                <motion.div 
                  className="w-9 h-9 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Shield className="h-5 w-5 text-amber-600" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Educational Purpose Only</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    This platform provides health education and bill analysis. Always consult healthcare professionals for medical decisions.
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
