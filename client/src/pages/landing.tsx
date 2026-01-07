import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { DonationButton } from "@/components/donation-button";
import { BlitzDemo } from "@/components/blitz-demo";
import { Link } from "wouter";
import { 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Crown, 
  Zap, 
  CheckCircle, 
  TrendingDown,
  Users,
  Star,
  Brain,
  Target,
  Clock,
  MessageCircle,
  ShieldCheck,
  Receipt,
  Search,
  Calculator,
  Award,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  Heart,
  Timer,
  Code,
  UserCheck,
  Building,
  Eye,
  BarChart3,
  Trophy,
  Lock,
  FileCheck,
  Shield,
  Upload,
  Send,
  TrendingUp,
  Play,
  Check,
  X,
  BadgeCheck,
  Stethoscope
} from "lucide-react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }: { delay?: number; duration?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 100%)`,
      boxShadow: `0 0 ${size * 2}px rgba(16, 185, 129, 0.4), 0 0 ${size * 4}px rgba(6, 182, 212, 0.2)`,
    }}
    initial={{ 
      x: `${Math.random() * 100}%`, 
      y: '110%',
      opacity: 0,
      scale: 0 
    }}
    animate={{ 
      y: '-10%',
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      x: `${Math.random() * 100}%`
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const GlowingOrb = ({ className, color1, color2, size = 300, blur = 80 }: { className?: string; color1: string; color2: string; size?: number; blur?: number }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color1} 0%, ${color2} 50%, transparent 70%)`,
      filter: `blur(${blur}px)`,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const GlassmorphicCard = ({ children, className = "", glowColor = "emerald" }: { children: React.ReactNode; className?: string; glowColor?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const glowColors: Record<string, string> = {
    emerald: "rgba(16, 185, 129, 0.15)",
    purple: "rgba(139, 92, 246, 0.15)",
    blue: "rgba(59, 130, 246, 0.15)",
    amber: "rgba(245, 158, 11, 0.15)",
    pink: "rgba(236, 72, 153, 0.15)",
  };
  
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${glowColors[glowColor]}, transparent 40%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-2xl" />
      <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/90 via-white/70 to-white/50" />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/50" />
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
        }}
        animate={{ opacity: isHovered ? 0.8 : 0.4 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const PremiumButton = ({ children, className = "", variant = "primary" }: { children: React.ReactNode; className?: string; variant?: "primary" | "secondary" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className={`absolute -inset-1 rounded-2xl blur-xl transition-opacity ${
          variant === "primary" 
            ? "bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" 
            : "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
        }`}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
      />
      <MobileButton className={`relative ${className}`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        {children}
      </MobileButton>
    </motion.div>
  );
};

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [pricingTab, setPricingTab] = useState<'monthly' | 'annual' | 'lifetime'>('monthly');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  
  return (
    <MobileLayout title="GoldRock AI" showBottomNav={true}>
      <motion.div 
        className="text-center py-16 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
                               radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 45%)`,
            }}
          />
          
          <GlowingOrb 
            className="-top-32 -left-32" 
            color1="rgba(16, 185, 129, 0.25)" 
            color2="rgba(6, 182, 212, 0.1)" 
            size={400}
            blur={100}
          />
          <GlowingOrb 
            className="-bottom-32 -right-32" 
            color1="rgba(245, 158, 11, 0.2)" 
            color2="rgba(239, 68, 68, 0.08)" 
            size={350}
            blur={90}
          />
          <GlowingOrb 
            className="top-1/3 left-1/2 -translate-x-1/2" 
            color1="rgba(139, 92, 246, 0.15)" 
            color2="rgba(59, 130, 246, 0.05)" 
            size={300}
            blur={80}
          />
          
          {[...Array(12)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.5} duration={15 + Math.random() * 10} size={3 + Math.random() * 4} />
          ))}
          
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <motion.div 
          className="relative mx-auto mb-8"
          style={{ width: 'fit-content' }}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
        >
          <motion.div
            className="absolute -inset-4 rounded-[2.5rem] opacity-60"
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(245, 158, 11, 0.3), rgba(139, 92, 246, 0.3))",
              filter: "blur(20px)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <motion.div 
            className="relative w-28 h-28 rounded-[2.25rem] flex items-center justify-center shadow-2xl"
            style={{ 
              background: "linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #10b981 75%, #059669 100%)",
              isolation: 'isolate',
              boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset"
            }}
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 rounded-[2.25rem] opacity-50"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
              }}
            />
            <DollarSign className="text-white h-14 w-14 drop-shadow-lg" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-[1.08] tracking-tight">
            <span className="text-gray-900 drop-shadow-sm">Your Complete</span>
            <br />
            <motion.span 
              className="inline-block relative"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #10b981 50%, #059669 75%, #0d9488 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{ 
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              Health AI Platform
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #10b981)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mb-5"
          >
            {[
              { icon: DollarSign, label: "Bill Savings", colors: "from-emerald-100 to-teal-100", border: "border-emerald-300", text: "text-emerald-700", iconColor: "text-emerald-600" },
              { icon: Brain, label: "AI Diagnostics", colors: "from-purple-100 to-indigo-100", border: "border-purple-300", text: "text-purple-700", iconColor: "text-purple-600" },
              { icon: Stethoscope, label: "Medical Training", colors: "from-pink-100 to-rose-100", border: "border-pink-300", text: "text-pink-700", iconColor: "text-pink-600" },
              { icon: Trophy, label: "Gamified Learning", colors: "from-amber-100 to-orange-100", border: "border-amber-300", text: "text-amber-700", iconColor: "text-amber-600" },
            ].map((item, i) => (
              <motion.span 
                key={item.label}
                className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${item.colors} border ${item.border} rounded-full px-3.5 py-2 shadow-lg backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <item.icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                <span className={`text-sm font-bold ${item.text}`}>{item.label}</span>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="text-lg text-gray-700 mb-6 max-w-lg mx-auto leading-relaxed font-semibold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          Fight medical bills, master diagnostic skills, and access AI-powered health insights all in one platform
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-8 flex-wrap"
        >
          {[
            { icon: Shield, label: "Private & Secure", color: "text-blue-600" },
            { icon: Lock, label: "Enterprise Security", color: "text-emerald-600" },
          ].map((badge, i) => (
            <motion.div 
              key={badge.label}
              className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/60 shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              style={{
                boxShadow: "0 4px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset"
              }}
            >
              <badge.icon className={`h-4 w-4 ${badge.color}`} />
              <span className="text-sm font-bold text-gray-800">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="space-y-4 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <Link href="/bill-ai">
            <PremiumButton 
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-5 shadow-2xl"
              variant="primary"
            >
              <Receipt className="h-6 w-6 mr-2" />
              <span>Start Free Analysis</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </PremiumButton>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-gray-500 mt-4 font-medium"
        >
          No credit card required. Free to start
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(249,250,251,0.9) 0%, rgba(255,255,255,1) 50%, rgba(249,250,251,0.9) 100%)",
        }}
        data-testid="section-platform-overview"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-5 py-2.5 rounded-full font-bold text-sm mb-5 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              Complete Health AI Platform
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              More Than Just Bill Analysis
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Four powerful pillars to transform your healthcare experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { 
                icon: DollarSign, 
                title: "Financial Defense Suite", 
                desc: "AI bill analysis, dispute templates, and negotiation strategies",
                tags: ["Bill AI", "Templates", "Disputes"],
                gradient: "from-emerald-500 via-teal-500 to-cyan-500",
                glow: "rgba(16, 185, 129, 0.3)"
              },
              { 
                icon: Brain, 
                title: "Clinical Intelligence", 
                desc: "Health insights, medical knowledge, and second opinions",
                tags: ["Health AI", "Insights", "Resources"],
                gradient: "from-blue-500 via-indigo-500 to-purple-500",
                glow: "rgba(59, 130, 246, 0.3)"
              },
              { 
                icon: Target, 
                title: "Diagnostic Mastery", 
                desc: "Interactive training with AI patients and full diagnosis mode",
                tags: ["AI Patients", "Training", "Scoring"],
                gradient: "from-purple-500 via-violet-500 to-fuchsia-500",
                glow: "rgba(139, 92, 246, 0.3)"
              },
              { 
                icon: Trophy, 
                title: "Gamified Learning", 
                desc: "Pixel Doctor game, achievements, and skill progression",
                tags: ["Pixel Doctor", "Achievements", "XP System"],
                gradient: "from-pink-500 via-rose-500 to-red-500",
                glow: "rgba(236, 72, 153, 0.3)"
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.glow}, transparent)`,
                    filter: "blur(20px)",
                  }}
                />
                <div 
                  className={`relative bg-gradient-to-br ${pillar.gradient} rounded-3xl p-6 text-white shadow-2xl overflow-hidden`}
                  style={{
                    boxShadow: `0 25px 50px -12px ${pillar.glow}`
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    }}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <pillar.icon className="h-7 w-7 text-white drop-shadow-md" />
                    </motion.div>
                    <h3 className="text-xl font-black mb-2 drop-shadow-sm">{pillar.title}</h3>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">{pillar.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.tags.map(tag => (
                        <span key={tag} className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <Link href="/patient-diagnostics">
              <motion.div whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}>
                <MobileButton className="bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-bold shadow-xl hover:shadow-2xl transition-all">
                  <Brain className="h-5 w-5 mr-2" />
                  Try AI Diagnostics
                  <ArrowRight className="h-4 w-4 ml-2" />
                </MobileButton>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(204, 251, 241, 0.8) 50%, rgba(207, 250, 254, 0.9) 100%)",
        }}
        data-testid="section-how-we-help"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 2} duration={18} size={2 + Math.random() * 3} />
          ))}
        </div>
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-black text-gray-900 mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Easily lower your medical bills
          </motion.h2>
          
          <motion.p
            className="text-lg text-gray-700 mb-10 font-medium"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            AI analyzes your bills, finds savings opportunities, and provides expert negotiation strategies
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { label: "Billing errors", desc: "Catch duplicate charges and incorrect coding" },
              { label: "Early-pay discounts", desc: "Negotiate upfront payment reductions" },
              { label: "Insurance denials", desc: "Get professional appeal templates" },
              { label: "Income-based discounts", desc: "Qualify for financial assistance programs" }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                data-testid={`card-benefit-${benefit.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <GlassmorphicCard className="rounded-2xl" glowColor="emerald">
                  <div className="flex items-start gap-4 p-5">
                    <motion.div 
                      className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 10 }}
                    >
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    </motion.div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 text-base mb-1">{benefit.label}</h3>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          <Link href="/bill-ai">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <PremiumButton 
                className="mx-auto max-w-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-2xl"
                variant="primary"
              >
                Find Savings
                <ArrowRight className="h-4 w-4 ml-2" />
              </PremiumButton>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(239, 246, 255, 0.7) 0%, rgba(238, 242, 255, 0.7) 50%, rgba(250, 245, 255, 0.7) 100%)",
        }}
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Bill Reduction Toolkit
          </motion.h2>
          <motion.div 
            className="h-1.5 w-28 rounded-full mx-auto mb-4"
            style={{
              background: "linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <p className="text-gray-600 font-medium">
            Everything you need to fight medical bills
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto" data-testid="section-quick-actions">
          {[
            { icon: Zap, label: "Quick Analyzer", path: "/quick-analyzer", gradient: "from-blue-600 to-indigo-600", bg: "from-blue-50 to-indigo-50" },
            { icon: Brain, label: "AI Diagnostics", path: "/patient-diagnostics", gradient: "from-purple-600 to-indigo-600", bg: "from-purple-50 to-indigo-50", badge: "Train" },
            { icon: Stethoscope, label: "Pixel Doctor", path: "/pixel-game", gradient: "from-pink-600 to-rose-600", bg: "from-pink-50 to-rose-50", badge: "Game" },
            { icon: FileText, label: "Templates", path: "/templates", gradient: "from-emerald-600 to-teal-600", bg: "from-emerald-50 to-teal-50" },
            { icon: Target, label: "Guides", path: "/resources-hub", gradient: "from-cyan-600 to-sky-600", bg: "from-cyan-50 to-sky-50" },
            { icon: Shield, label: "Denials Intel", path: "/insurance-denials", gradient: "from-red-600 to-pink-600", bg: "from-red-50 to-pink-50" }
          ].map((item, index) => (
            <Link key={item.label} href={item.path}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                />
                <GlassmorphicCard className="rounded-2xl h-full">
                  <div className="relative p-5 text-center">
                    <div className="relative">
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        style={{
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)"
                        }}
                      >
                        <item.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </motion.div>
                      {(item as any).badge && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-lg">
                          {(item as any).badge}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-3xl border border-amber-200/50 max-w-2xl mx-auto relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.9) 100%)",
            boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.15)"
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 font-black text-amber-800 mb-4 text-lg">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              Most Popular
            </h3>

            {[
              { icon: Receipt, label: "Bill-AI Full Analysis", path: "/bill-ai", desc: "Comprehensive bill review with AI" },
              { icon: MessageCircle, label: "Reduction Coach", path: "/reduction-coach", desc: "1-on-1 expert guidance" },
              { icon: Calculator, label: "Savings Calculator", path: "/quick-analyzer", desc: "Estimate your potential savings" },
            ].map((item, index) => (
              <Link key={item.label} href={item.path}>
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all mb-2 group"
                  whileHover={{ x: 4 }}
                  data-testid={`link-popular-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240, 253, 244, 0.8) 50%, rgba(236, 253, 245, 0.9) 100%)",
        }}
        data-testid="section-testimonials"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm mb-4 shadow-lg border border-emerald-200/50"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="h-4 w-4" />
              Verified Success Stories
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-700 font-semibold">
              Join thousands who've saved money on medical bills
            </p>
          </motion.div>

          <div className="grid gap-5">
            {[
              {
                quote: "Someone really took over the situation and navigated it hassle free for me. I couldn't be happier",
                name: "Luke",
                location: "NY",
                rating: 5
              },
              {
                quote: "I got reimbursed on the things that was initially rejected. Extremely helpful!",
                name: "Yuko",
                location: "MA",
                rating: 5
              },
              {
                quote: "So helpful! Saved me money and hours on the phone. Absolutely fantastic resource.",
                name: "Melissa",
                location: "NY",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                data-testid={`card-testimonial-${testimonial.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <GlassmorphicCard className="rounded-3xl" glowColor="emerald">
                  <div className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          <Star className="h-5 w-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-gray-700 mb-5 leading-relaxed font-medium text-lg">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="font-black text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600 font-medium">{testimonial.location}</p>
                      </div>
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ rotate: 10 }}
                      >
                        <ThumbsUp className="h-5 w-5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <motion.div 
              className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-xl px-8 py-5 rounded-2xl border border-emerald-200/50 shadow-2xl"
              whileHover={{ scale: 1.03 }}
              style={{
                boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <Star className="h-8 w-8 text-amber-400 fill-amber-400" />
                <span className="text-3xl font-black text-gray-900">4.9</span>
              </div>
              <div className="text-left">
                <p className="text-base font-black text-gray-900">Rated Excellent</p>
                <p className="text-sm text-gray-600 font-medium">Based on 1,000+ reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(255,255,255,1) 50%, rgba(204, 251, 241, 0.8) 100%)",
        }}
        data-testid="section-expert-credentials"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-black text-gray-900 mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powered by AI & Medical Billing Experts
          </motion.h2>
          
          <motion.p
            className="text-lg text-gray-700 mb-10 font-medium max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Our platform combines <strong className="text-emerald-700">cutting-edge AI technology</strong> with proven medical billing strategies to help you save thousands
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Brain, label: "AI-Powered Analysis", desc: "GPT-4 medical bill scanner", gradient: "from-purple-600 to-indigo-600", glow: "rgba(139, 92, 246, 0.2)" },
              { icon: Award, label: "Expert Strategies", desc: "Marshall Allen's tactics", gradient: "from-emerald-600 to-teal-600", glow: "rgba(16, 185, 129, 0.2)" },
              { icon: ShieldCheck, label: "Legal Templates", desc: "87-94% success rates", gradient: "from-blue-600 to-cyan-600", glow: "rgba(59, 130, 246, 0.2)" }
            ].map((credential, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -6 }}
                data-testid={`card-credential-${credential.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <GlassmorphicCard className="rounded-3xl h-full">
                  <div className="p-6 text-center">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${credential.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      style={{ boxShadow: `0 15px 30px -5px ${credential.glow}` }}
                    >
                      <credential.icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <h3 className="font-black text-gray-900 mb-2 text-lg">{credential.label}</h3>
                    <p className="text-sm text-gray-600 font-medium">{credential.desc}</p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Shield, label: "HIPAA-Aligned", color: "text-blue-600", border: "border-blue-200", bg: "from-blue-50 to-indigo-50" },
              { icon: Lock, label: "Bank-Level Encryption", color: "text-emerald-600", border: "border-emerald-200", bg: "from-emerald-50 to-teal-50" },
              { icon: Eye, label: "You Own Your Data", color: "text-purple-600", border: "border-purple-200", bg: "from-purple-50 to-indigo-50" }
            ].map((badge, i) => (
              <motion.div 
                key={badge.label}
                className={`flex items-center gap-2 bg-gradient-to-r ${badge.bg} backdrop-blur-sm px-5 py-3 rounded-full border ${badge.border} shadow-lg`}
                whileHover={{ scale: 1.05, y: -2 }}
                data-testid={`badge-${badge.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <badge.icon className={`h-5 w-5 ${badge.color}`} />
                <span className="text-sm font-bold text-gray-800">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 bg-white"
        data-testid="section-faq"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-gray-700 font-medium text-lg"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Everything you need to know about GoldRock Health
            </motion.p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does GoldRock Health work?",
                answer: "Upload your medical bill and our AI analyzes it for billing errors, overcharges, and negotiation opportunities. You'll receive a detailed analysis, legal dispute templates, and expert negotiation strategies to reduce your bill by 40-90%."
              },
              {
                question: "How much can I save on my medical bills?",
                answer: "Users typically report savings between $2,000-$35,000+ depending on their bill size. Our AI identifies billing errors, coding mistakes, and negotiation opportunities that most people miss."
              },
              {
                question: "Is my health information private and secure?",
                answer: "Yes. We align with HIPAA standards and use bank-level encryption to protect your data. You own your data completely and can delete it at any time. We never share or sell your information."
              },
              {
                question: "Do I need insurance to use GoldRock Health?",
                answer: "No! GoldRock Health works for everyone - with or without insurance. We help reduce bills from hospitals, urgent care, labs, and more. Our strategies work for both insured and uninsured patients."
              },
              {
                question: "What's included in the Premium plan?",
                answer: "Premium includes unlimited bill analyses, AI error detection, legal dispute letter templates with citations, industry insider tactics, expert negotiation coaching, and Medicare rate comparisons. Most users save 10-100x the subscription cost on a single bill."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes! Cancel your Premium subscription anytime with no penalties. We also offer a full refund within 30 days if you're not satisfied with the platform."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                data-testid={`card-faq-${index + 1}`}
              >
                <GlassmorphicCard className="rounded-2xl">
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 mb-3 flex items-start gap-3 text-lg">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className="flex-shrink-0"
                      >
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </motion.div>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed pl-9 font-medium">{faq.answer}</p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-10"
      >
        <motion.div 
          className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255, 251, 235, 0.98) 0%, rgba(254, 243, 199, 0.95) 50%, rgba(254, 215, 170, 0.9) 100%)",
            boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)"
          }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%)",
            }}
          />
          
          <div className="relative z-10 text-center">
            <motion.div
              className="relative inline-block mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute -inset-3 rounded-2xl opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(239, 68, 68, 0.3))",
                  filter: "blur(15px)",
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Crown className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>

            <h3 className="text-3xl font-black mb-3"
              style={{
                background: "linear-gradient(135deg, #b45309 0%, #c2410c 50%, #b91c1c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Premium Access
            </h3>
            
            <p className="text-gray-700 font-semibold mb-6 leading-relaxed max-w-md mx-auto">
              Full AI analysis, dispute templates, expert coaching & insider tactics
            </p>

            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white/70 backdrop-blur-sm rounded-xl p-1.5 border border-amber-200 shadow-lg">
                {[
                  { id: 'monthly' as const, label: 'Monthly' },
                  { id: 'annual' as const, label: 'Annual' },
                  { id: 'lifetime' as const, label: 'Lifetime' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setPricingTab(tab.id)}
                    className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      pricingTab === tab.id
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: pricingTab !== tab.id ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`button-pricing-tab-${tab.id}`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-200 shadow-xl max-w-xs mx-auto"
              layout
            >
              <motion.div 
                className="flex items-baseline justify-center gap-2 mb-3"
                key={pricingTab}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-5xl font-black text-gray-900">
                  {pricingTab === 'monthly' && '$25'}
                  {pricingTab === 'annual' && '$249'}
                  {pricingTab === 'lifetime' && '$747'}
                </span>
                <span className="text-gray-600 font-semibold">
                  {pricingTab === 'monthly' && '/month'}
                  {pricingTab === 'annual' && '/year'}
                  {pricingTab === 'lifetime' && 'one-time'}
                </span>
              </motion.div>
              {pricingTab === 'annual' && (
                <motion.div 
                  className="text-sm text-emerald-700 font-bold flex items-center justify-center gap-1 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BadgeCheck className="h-4 w-4" />
                  Save $51 per year vs monthly
                </motion.div>
              )}
              {pricingTab === 'lifetime' && (
                <motion.div 
                  className="text-sm text-emerald-700 font-bold flex items-center justify-center gap-1 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BadgeCheck className="h-4 w-4" />
                  Unlimited access forever • Best value
                </motion.div>
              )}
              <div className="text-xs text-gray-600 font-medium">
                Professional medical bill reduction
              </div>
            </motion.div>

            <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
              {[
                "Unlimited bill analyses",
                "AI error detection scanner",
                "Legal dispute letter templates",
                "Industry insider tactics",
                "Expert negotiation coaching",
                "Medicare rate comparisons"
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700 font-semibold">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/premium">
              <PremiumButton 
                className="w-full max-w-sm mx-auto bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-lg py-5 shadow-2xl"
                variant="secondary"
              >
                <Crown className="h-6 w-6 mr-2" />
                <span>Upgrade to Premium</span>
                <Sparkles className="h-5 w-5 ml-2" />
              </PremiumButton>
            </Link>

            <p className="text-xs text-gray-600 mt-4 font-medium">
              Cancel anytime • Full refund within 30 days
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="px-4 mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <DonationButton variant="default" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-12 pb-16"
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Fight Your Bills?
          </motion.h2>
          <p className="text-gray-600 font-semibold max-w-sm mx-auto">
            Professional AI analysis & expert strategies
          </p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
          <Link href="/bill-ai">
            <PremiumButton 
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-5 shadow-2xl"
              variant="primary"
            >
              <Zap className="h-6 w-6 mr-2" />
              <span>Start Free Bill Analysis</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </PremiumButton>
          </Link>

          <Link href="/premium">
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <MobileButton variant="secondary" className="w-full border-2 border-emerald-300 hover:border-emerald-400 text-emerald-700 hover:text-emerald-800 shadow-xl">
                <Crown className="h-5 w-5 mr-2" />
                View Premium Plans
                <ChevronRight className="h-4 w-4 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-gray-500 mt-8 font-medium"
        >
          🔒 Private & Secure • ⚡ AI-Powered • ⚖️ Legal Templates
        </motion.p>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-4">
            <Link href="/privacy-policy">
              <a className="text-gray-500 hover:text-emerald-600 transition-colors font-medium" data-testid="footer-link-privacy-mobile">
                Privacy Policy
              </a>
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/terms-of-service">
              <a className="text-gray-500 hover:text-emerald-600 transition-colors font-medium" data-testid="footer-link-terms-mobile">
                Terms of Service
              </a>
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/support">
              <a className="text-gray-500 hover:text-emerald-600 transition-colors font-medium" data-testid="footer-link-support-mobile">
                Support
              </a>
            </Link>
            <span className="text-gray-300">•</span>
            <a 
              href="mailto:contact@goldrock.ai" 
              className="text-gray-500 hover:text-emerald-600 transition-colors font-medium"
              data-testid="footer-link-email-mobile"
            >
              Contact
            </a>
          </div>
          
          <p className="text-center text-xs text-gray-400 mb-2">
            Educational use only. Not for clinical diagnosis or treatment decisions.
          </p>
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Eldest AI LLC dba GoldRock AI. All rights reserved. • Colorado, USA
          </p>
        </div>
      </motion.div>
    </MobileLayout>
  );
}
