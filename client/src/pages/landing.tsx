import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { DonationButton } from "@/components/donation-button";
import { BlitzDemo } from "@/components/blitz-demo";
import { DemoChat } from "@/components/demo-chat";
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
  Stethoscope,
  Home,
  Dna,
  Phone,
  Gamepad2,
  Download,
  Database,
  ExternalLink
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

const PreLoginBottomNav = () => {
  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/api/login", color: "#3B82F6", gradient: "from-blue-500 to-indigo-600", bgGradient: "from-blue-50 to-indigo-50" },
    { id: "billai", label: "Bill AI", icon: FileText, href: "/api/login?redirect=/bill-ai", color: "#8B5CF6", gradient: "from-purple-500 to-violet-600", bgGradient: "from-purple-50 to-violet-50" },
    { id: "learn", label: "Learn", icon: Brain, href: "/api/login?redirect=/patient-diagnostics", color: "#14B8A6", gradient: "from-teal-500 to-emerald-600", bgGradient: "from-teal-50 to-emerald-50" },
    { id: "tools", label: "Tools", icon: Stethoscope, href: "/api/login?redirect=/clinical-command-center", color: "#6366F1", gradient: "from-indigo-500 to-purple-600", bgGradient: "from-indigo-50 to-purple-50" },
    { id: "lunafold", label: "LunaFold", icon: Dna, href: "/api/login?redirect=/lunafold", color: "#06B6D4", gradient: "from-cyan-500 to-blue-600", bgGradient: "from-cyan-50 to-blue-50" },
    { id: "premium", label: "Premium", icon: Crown, href: "/api/login?redirect=/premium", color: "#F59E0B", gradient: "from-amber-500 to-orange-600", bgGradient: "from-amber-50 to-orange-50", special: true },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border-t border-white/20"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.08)'
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around px-1 py-2 gap-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.a
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-2xl transition-all duration-300 overflow-hidden group`}
              style={{
                background: `linear-gradient(135deg, ${item.bgGradient.includes('blue') ? 'rgba(239,246,255,0.9)' : item.bgGradient.includes('purple') ? 'rgba(245,243,255,0.9)' : item.bgGradient.includes('teal') ? 'rgba(240,253,250,0.9)' : item.bgGradient.includes('indigo') ? 'rgba(238,242,255,0.9)' : item.bgGradient.includes('cyan') ? 'rgba(236,254,255,0.9)' : 'rgba(255,251,235,0.9)'}, ${item.bgGradient.includes('blue') ? 'rgba(224,231,255,0.8)' : item.bgGradient.includes('purple') ? 'rgba(237,233,254,0.8)' : item.bgGradient.includes('teal') ? 'rgba(204,251,241,0.8)' : item.bgGradient.includes('indigo') ? 'rgba(224,231,255,0.8)' : item.bgGradient.includes('cyan') ? 'rgba(207,250,254,0.8)' : 'rgba(254,243,199,0.8)'})`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05, y: -2 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              data-testid={`prelogin-nav-${item.id}`}
            >
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`
                }}
              />
              <motion.div className="relative z-10">
                <motion.div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 shadow-lg`}
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                    boxShadow: `0 4px 12px ${item.color}40`
                  }}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                </motion.div>
                
                {item.special && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full p-1 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                  </motion.div>
                )}
              </motion.div>
              <span 
                className="text-xs font-bold leading-none truncate relative z-10"
                style={{ color: item.color }}
              >
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </div>
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
    <MobileLayout title="GoldRock Health" showBottomNav={true}>
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
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
        
        {/* Pre-login Demo Chat - Try before you sign up */}
        <DemoChat />
        
        {/* Premium Health Logo - Larger with Gold Accent */}
        <motion.div 
          className="relative mx-auto mb-6"
          style={{ width: 'fit-content' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 12 }}
        >
          <motion.div
            className="absolute -inset-8 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(16, 185, 129, 0.2) 40%, transparent 70%)",
              filter: "blur(30px)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
            style={{ 
              background: "linear-gradient(135deg, #0d9488 0%, #10b981 30%, #059669 70%, #047857 100%)",
              boxShadow: "0 20px 50px -12px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255,255,255,0.3) inset, 0 0 60px rgba(245, 158, 11, 0.2)"
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(245, 158, 11, 0.1) 100%)",
              }}
            />
            <motion.div
              className="absolute -inset-1 opacity-50"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(245, 158, 11, 0.4), transparent, rgba(16, 185, 129, 0.4), transparent)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex items-center justify-center w-12 h-12">
              <Shield className="text-white/25 h-12 w-12 absolute" style={{ top: '-2px', left: '0px' }} strokeWidth={1} />
              <Heart className="text-white h-8 w-8 drop-shadow-lg relative z-10" style={{ marginTop: '-1px' }} strokeWidth={2.5} fill="rgba(255,255,255,0.25)" />
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Emotional Headline */}
          <h1 className="text-[2rem] sm:text-4xl font-black mb-4 leading-[1.1] tracking-tight">
            <span className="text-gray-800">The Healthcare System</span>
            <br />
            <span className="text-gray-800">Wasn't Built for You.</span>
            <br />
            <motion.span 
              className="inline-block mt-1"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #10b981 30%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              We Are.
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-lg text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Hospitals have teams protecting their revenue.
            <br />
            <span className="text-emerald-600 font-semibold">Now you have one protecting yours.</span>
          </motion.p>

          {/* Large Feature Pillars with Real Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 gap-3 max-w-md mx-auto mb-6"
          >
            {[
              { 
                icon: Search, 
                title: "Find Hidden Overcharges", 
                desc: "AI scans every line of your bill for errors, duplicates, and inflated prices",
                gradient: "from-emerald-500 to-teal-600",
                glow: "rgba(16, 185, 129, 0.3)"
              },
              { 
                icon: Shield, 
                title: "Know Your Patient Rights", 
                desc: "Legal protections and dispute strategies hospitals hope you never learn",
                gradient: "from-blue-500 to-indigo-600",
                glow: "rgba(59, 130, 246, 0.3)"
              },
              { 
                icon: MessageCircle, 
                title: "Get Expert Guidance", 
                desc: "Step-by-step negotiation coaching with ready-to-use scripts and letters",
                gradient: "from-purple-500 to-violet-600",
                glow: "rgba(139, 92, 246, 0.3)"
              },
              { 
                icon: Brain, 
                title: "Understand Your Health", 
                desc: "AI explains labs, symptoms, drug interactions, and insurance benefits",
                gradient: "from-amber-500 to-orange-600",
                glow: "rgba(245, 158, 11, 0.3)"
              },
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                className="relative group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${item.glow}, transparent)`,
                    filter: "blur(12px)",
                  }}
                />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-base mb-0.5">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-snug">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trust Indicators - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-6 mb-5"
        >
          {[
            { icon: Lock, label: "HIPAA Aligned", color: "text-emerald-600" },
            { icon: ShieldCheck, label: "256-bit Encrypted", color: "text-blue-600" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <badge.icon className={`h-4 w-4 ${badge.color}`} />
              <span className="text-xs font-semibold text-gray-700">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs - Emotionally Driven */}
        <motion.div 
          className="space-y-3 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link href="/bill-ai">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <MobileButton className="relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-700 text-lg py-4 shadow-xl font-bold">
                <Upload className="h-5 w-5 mr-2" />
                <span>Upload Your Bill & Take Control</span>
              </MobileButton>
            </motion.div>
          </Link>

          <Link href="/get-started">
            <motion.div 
              whileHover={{ scale: 1.01, y: -2 }} 
              whileTap={{ scale: 0.99 }}
              className="relative group"
            >
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity"
              />
              <MobileButton 
                variant="secondary" 
                className="relative w-full border-2 border-gray-200 hover:border-blue-300 text-gray-800 shadow-lg bg-white/90 backdrop-blur-xl py-3.5 font-semibold"
              >
                <Play className="h-5 w-5 mr-2 text-blue-600" />
                New Here? Start the Guided Tour
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-gray-500 mt-5 font-medium"
        >
          Free to start • No credit card required
        </motion.p>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 py-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 50%, rgba(240,253,244,0.5) 100%)",
        }}
        data-testid="section-how-it-works"
      >
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full font-bold text-sm mb-4 border border-amber-200/50 shadow-sm"
            >
              <Zap className="h-4 w-4" />
              Simple & Powerful
            </motion.span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              How It Works
            </h2>
            <p className="text-gray-600 font-medium">
              Three steps to take back control
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { 
                step: "1", 
                title: "Upload Your Bill", 
                desc: "Snap a photo or upload a PDF. Our AI reads every charge.",
                icon: Upload,
                color: "from-emerald-500 to-teal-600"
              },
              { 
                step: "2", 
                title: "AI Analyzes Everything", 
                desc: "We find errors, overcharges, and opportunities to save.",
                icon: Brain,
                color: "from-blue-500 to-indigo-600"
              },
              { 
                step: "3", 
                title: "Take Action with Confidence", 
                desc: "Get scripts, letters, and strategies to reduce what you owe.",
                icon: Target,
                color: "from-purple-500 to-violet-600"
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Step {item.step}</span>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Links Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 py-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(240,253,244,0.6) 0%, rgba(236,253,245,0.8) 50%, rgba(240,249,255,0.6) 100%)",
        }}
        data-testid="section-quick-links"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <motion.span 
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-xs mb-3 border border-emerald-200/50 shadow-sm"
            >
              <Zap className="h-3.5 w-3.5" />
              Quick Access
            </motion.span>
            <h2 className="text-2xl font-black mb-2">
              <span className="text-gray-900">Explore All </span>
              <span 
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Features
              </span>
            </h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              AI tools for medical bills, diagnostics, and more
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Home, label: "Dashboard", href: "/", description: "Your command center", gradient: "from-blue-500 to-indigo-600" },
              { icon: Brain, label: "Bill AI", href: "/bill-ai", description: "Find overcharges", gradient: "from-emerald-500 to-teal-600" },
              { icon: Shield, label: "Rights Hub", href: "/rights-hub", description: "Know your rights", gradient: "from-blue-500 to-cyan-600", featured: true },
              { icon: Heart, label: "Emergency Help", href: "/emergency-help", description: "Crisis assistance", gradient: "from-red-500 to-pink-600" },
              { icon: Search, label: "Quick Analyzer", href: "/quick-analyzer", description: "Fast bill scan", gradient: "from-purple-500 to-violet-600" },
              { icon: Phone, label: "Provider Contacts", href: "/provider-contacts", description: "Hospital database", gradient: "from-orange-500 to-amber-600" },
              { icon: Crown, label: "Premium", href: "/premium", description: "Upgrade account", gradient: "from-amber-500 to-yellow-500" },
              { icon: Gamepad2, label: "Pixel Doctor", href: "/pixel-game", description: "Fun diagnostics", gradient: "from-pink-500 to-rose-600", special: true },
              { icon: TrendingDown, label: "Reduction Guide", href: "/bill-reduction-guide", description: "Expert strategies", gradient: "from-teal-500 to-green-600" },
              { icon: Download, label: "Get Bills", href: "/portal-access-guide", description: "Portal access", gradient: "from-slate-500 to-gray-600" },
              { icon: Database, label: "Resources Hub", href: "/resources-hub", description: "Guides & templates", gradient: "from-indigo-500 to-purple-600" },
              { icon: Stethoscope, label: "Diagnostics", href: "/patient-diagnostics", description: "AI training", gradient: "from-cyan-500 to-blue-600" },
              { icon: Dna, label: "LunaFold", href: "/lunafold", description: "Protein analysis", gradient: "from-violet-500 to-purple-600" },
              { icon: Shield, label: "Collections Defense", href: "/collections-defense-guide", description: "Fight debt collectors", gradient: "from-red-500 to-rose-600", featured: true },
              { icon: Receipt, label: "Bill Playbook", href: "/hospital-bill-playbook", description: "Reduce bills now", gradient: "from-emerald-500 to-green-600", featured: true },
              { icon: Target, label: "Industry Secrets", href: "/industry-insights", description: "Insider tactics", gradient: "from-rose-500 to-red-600" },
              { icon: FileText, label: "Templates", href: "/templates", description: "Dispute letters", gradient: "from-green-500 to-emerald-600" },
              { icon: Trophy, label: "Achievements", href: "/achievements", description: "Your progress", gradient: "from-yellow-500 to-orange-600" },
            ].map((item, index) => (
              <Link key={item.label} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                  data-testid={`quicklink-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${item.gradient.includes('emerald') ? 'rgba(16,185,129,0.2)' : item.gradient.includes('purple') ? 'rgba(139,92,246,0.2)' : item.gradient.includes('blue') ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)'}, transparent)`,
                      filter: "blur(8px)",
                    }}
                  />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                    <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-emerald-600 transition-colors">{item.label}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    {(item.featured || item.special) && (
                      <motion.div
                        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${item.special ? 'bg-pink-500' : 'bg-emerald-500'}`}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 py-8 relative overflow-hidden"
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
        className="px-4 py-8 relative overflow-hidden"
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

      {/* Collections Defense Guide Featured Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(254, 226, 226, 0.8) 0%, rgba(254, 215, 170, 0.7) 50%, rgba(254, 249, 195, 0.8) 100%)",
        }}
        data-testid="section-collections-defense"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-5 py-2.5 rounded-full font-bold text-sm mb-4 shadow-lg border border-red-200/50"
              whileHover={{ scale: 1.05 }}
            >
              <AlertTriangle className="h-4 w-4" />
              Bill in Collections?
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Fight Back Against Debt Collectors
            </h2>
            <p className="text-lg text-gray-700 font-medium max-w-xl mx-auto">
              Our comprehensive Collections Defense Guide gives you insider knowledge and proven strategies to reduce or eliminate medical debt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: Shield, label: "Know Your Rights", desc: "FDCPA protections debt collectors don't want you to know" },
              { icon: FileText, label: "Ready-to-Use Templates", desc: "Debt validation and pay-for-delete letters" },
              { icon: DollarSign, label: "Negotiation Scripts", desc: "Exact words to use when speaking with collectors" },
              { icon: Target, label: "34+ Specific Scenarios", desc: "From childbirth to cancer treatment, we've got you covered" }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-red-100 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
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
            className="text-center"
          >
            <Link href="/collections-defense-guide">
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }} 
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <MobileButton className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold shadow-xl px-8">
                  <Shield className="h-5 w-5 mr-2" />
                  Access Collections Defense Guide
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
        className="px-4 py-8 relative overflow-hidden"
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
        className="px-4 py-8 relative overflow-hidden"
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
        className="px-4 py-8 bg-white"
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

        <div className="mt-12 pt-8 border-t border-gray-200 pb-24">
          <div className="mb-6">
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">Partnerships</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-4">
              <Link href="/for-vcs">
                <a className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium" data-testid="footer-link-vcs-mobile">
                  For VCs
                </a>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/investors">
                <a className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium" data-testid="footer-link-investors-mobile">
                  For Investors
                </a>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/for-healthcare">
                <a className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium" data-testid="footer-link-healthcare-mobile">
                  Healthcare
                </a>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/for-insurance">
                <a className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium" data-testid="footer-link-insurance-mobile">
                  Insurance
                </a>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-4">
            <Link href="/about">
              <a className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold" data-testid="footer-link-about-mobile">
                About GoldRock Health
              </a>
            </Link>
            <span className="text-gray-300">•</span>
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
              href="mailto:CONTACT@GOLDROCK.ai" 
              className="text-gray-500 hover:text-emerald-600 transition-colors font-medium"
              data-testid="footer-link-email-mobile"
            >
              Contact
            </a>
          </div>
          
          <p className="text-center text-xs text-gray-400 mb-2">
            Educational use only. Not for clinical diagnosis or treatment decisions.
          </p>
          <p className="text-center text-xs text-gray-400 pb-24">
            © {new Date().getFullYear()} GoldRock Health by Eldest AI LLC. All rights reserved. • Colorado, USA
          </p>
        </div>
      </motion.div>

    </MobileLayout>
  );
}
