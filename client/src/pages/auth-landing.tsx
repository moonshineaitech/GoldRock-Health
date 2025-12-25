import { LandingNavigation } from "@/components/landing-navigation";
import { 
  DollarSign, Zap, Brain, FileText, Upload, Target, Shield, Code, Scale, Clock, 
  AlertTriangle, Eye, Phone, Database, Book, Receipt, Building, HandCoins, 
  Gavel, Lock, Network, Crosshair, Calculator, MessageCircle, Crown, Sparkles,
  ArrowRight, Play, FileCheck, TrendingDown, Award, BadgeCheck, ChevronRight,
  FileX, CreditCard, Wrench, Puzzle, Heart, Search, Users, Settings, BarChart3,
  Pill, Stethoscope, Activity, Microscope, Baby, Car, Home as HomeIcon, Trophy,
  Star, CheckCircle, ArrowDown, Rocket, Globe, Layers, Cpu, Wand2, Zap as Lightning,
  MousePointer, Gem, CircleDot
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";

const FloatingParticle = ({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
    }}
    animate={{
      y: [0, -150, -300],
      x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40],
      opacity: [0, 1, 0.5, 0],
      scale: [0, 1, 1.5, 0],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const MorphingGradient = () => (
  <motion.div
    className="absolute inset-0 opacity-40"
    animate={{
      background: [
        "radial-gradient(ellipse at 0% 0%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(168,85,247,0.3) 0%, transparent 50%)",
        "radial-gradient(ellipse at 100% 0%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(245,158,11,0.3) 0%, transparent 50%)",
        "radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.3) 0%, transparent 50%)",
        "radial-gradient(ellipse at 0% 0%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(168,85,247,0.3) 0%, transparent 50%)",
      ],
    }}
    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
  />
);

const GlowingOrb = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-[100px]`}
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      scale: [1, 1.4, 1],
      opacity: [0.3, 0.6, 0.3],
      x: [0, 40, 0],
      y: [0, -30, 0],
    }}
    transition={{ duration: 10, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [started, text]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
};

const AnimatedCounter = ({ end, suffix = "", prefix = "", duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasAnimated) setHasAnimated(true); },
      { threshold: 0.5 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let animationId: number;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) animationId = requestAnimationFrame(animate);
      else setCount(end);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [hasAnimated, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const MagneticButton = ({ children, href, className, testId }: { children: React.ReactNode; href: string; className?: string; testId?: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-testid={testId}
    >
      {children}
    </motion.a>
  );
};

const FeatureCard3D = ({ icon: Icon, title, description, gradient, delay, href }: {
  icon: any; title: string; description: string; gradient: string; delay: number; href: string;
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 15);
    setRotateY(x * 15);
  };

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); setIsHovered(false); }}
      className="block group focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-[2rem]"
      style={{ perspective: "1200px" }}
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <motion.div
        className={`relative bg-gradient-to-br ${gradient} rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden h-full border border-white/10`}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: isHovered ? "200%" : "-100%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />

        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-black/20 rounded-full blur-3xl" />
        
        <motion.div
          className="relative z-10 w-18 h-18 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/20"
          animate={isHovered ? { rotate: [0, -5, 5, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: 72, height: 72 }}
        >
          <Icon className="h-9 w-9 text-white drop-shadow-lg" strokeWidth={1.5} />
        </motion.div>
        
        <h3 className="relative z-10 text-2xl font-black mb-3 tracking-tight">{title}</h3>
        <p className="relative z-10 text-white/85 text-base leading-relaxed mb-5">{description}</p>
        
        <motion.div 
          className="relative z-10 flex items-center gap-2 text-white font-bold"
          animate={isHovered ? { x: 8 } : { x: 0 }}
        >
          <span>Get Started</span>
          <motion.div animate={isHovered ? { x: [0, 5, 0] } : {}} transition={{ duration: 0.6, repeat: Infinity }}>
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.a>
  );
};

const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2.5 }}
  >
    <motion.span 
      className="text-sm font-medium text-white/60"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Scroll to discover
    </motion.span>
    <motion.div
      className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
      animate={{ borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.3)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        className="w-1.5 h-3 bg-white/60 rounded-full"
        animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  </motion.div>
);

export default function AuthLanding() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    delay: i * 0.4,
    size: 3 + Math.random() * 6,
    x: Math.random() * 100,
    y: 70 + Math.random() * 30,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      <LandingNavigation />
      
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        <MorphingGradient />
        
        <GlowingOrb color="bg-emerald-500" size={700} x="-15%" y="10%" delay={0} />
        <GlowingOrb color="bg-purple-600" size={600} x="75%" y="5%" delay={2} />
        <GlowingOrb color="bg-blue-500" size={500} x="50%" y="65%" delay={4} />
        <GlowingOrb color="bg-amber-500" size={400} x="15%" y="75%" delay={1} />

        {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <motion.div 
          className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-24"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
            className="relative mx-auto mb-10"
          >
            <motion.div
              className="absolute inset-[-20px] bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 rounded-[3rem] blur-3xl opacity-50"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity } }}
            />
            <motion.div
              className="relative w-32 h-32 bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto border-2 border-white/20"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 border-2 border-dashed border-white/30 rounded-[1.5rem]"
              />
              <DollarSign className="w-16 h-16 text-white drop-shadow-2xl" strokeWidth={2} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {[
              { icon: DollarSign, label: "Save $35K+", color: "from-emerald-500/30 to-emerald-500/10 border-emerald-400/40 text-emerald-300" },
              { icon: Brain, label: "AI Diagnostics", color: "from-purple-500/30 to-purple-500/10 border-purple-400/40 text-purple-300" },
              { icon: Stethoscope, label: "Health Tools", color: "from-blue-500/30 to-blue-500/10 border-blue-400/40 text-blue-300" },
              { icon: Trophy, label: "Gamified", color: "from-amber-500/30 to-amber-500/10 border-amber-400/40 text-amber-300" },
            ].map((pill, i) => (
              <motion.span
                key={pill.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${pill.color} border rounded-full px-5 py-2.5 backdrop-blur-xl shadow-lg`}
              >
                <pill.icon className="h-4 w-4" />
                <span className="text-sm font-bold">{pill.label}</span>
              </motion.span>
            ))}
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="text-white">Your Complete</span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% auto" }}
            >
              <TypewriterText text="Health AI Platform" delay={1.2} />
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Reduce medical bills by <motion.span className="text-emerald-400 font-bold" animate={{ textShadow: ["0 0 20px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.5)", "0 0 20px rgba(16,185,129,0)"] }} transition={{ duration: 2, repeat: Infinity }}>$2,000-$35,000+</motion.span>, master diagnostics with AI, and access professional health tools
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <MagneticButton
              href="/api/login"
              className="group relative px-12 py-6 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-white font-black text-lg rounded-2xl shadow-2xl shadow-emerald-500/40 overflow-hidden flex items-center gap-3"
              testId="button-get-started-hero"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <Rocket className="h-6 w-6 relative z-10" />
              <span className="relative z-10">Start Free Analysis</span>
              <ArrowRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <motion.a
              href="#features"
              className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-explore-features"
            >
              <Layers className="h-5 w-5" />
              <span>Explore Features</span>
            </motion.a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 text-gray-400 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            {[
              { icon: CheckCircle, text: "No credit card", color: "text-emerald-500" },
              { icon: Shield, text: "HIPAA Compliant", color: "text-blue-500" },
              { icon: Lock, text: "256-bit encryption", color: "text-purple-500" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      <section className="py-28 relative" data-testid="section-stats">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              { value: 35000, prefix: "$", suffix: "+", label: "Average Savings", color: "from-emerald-500 to-teal-500", icon: DollarSign },
              { value: 500, suffix: "+", label: "AI Patients", color: "from-purple-500 to-violet-500", icon: Users },
              { value: 19, suffix: "", label: "Specialties", color: "from-blue-500 to-indigo-500", icon: Award },
              { value: 98, suffix: "%", label: "Success Rate", color: "from-amber-500 to-orange-500", icon: TrendingDown },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring" }}
                whileHover={{ y: -8 }}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500`} />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/25 transition-all duration-300">
                  <motion.div
                    className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-400 font-semibold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-28 relative" data-testid="section-platform-overview">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 text-purple-300 px-6 py-3 rounded-full font-bold text-sm mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Gem className="h-4 w-4" />
              Complete Health AI Platform
            </motion.span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Four Pillars of
              <motion.span
                className="bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent ml-4"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% auto" }}
              >
                Excellence
              </motion.span>
            </h2>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
              Everything you need to reduce medical bills and master healthcare
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <FeatureCard3D
              icon={DollarSign}
              title="Financial Defense Suite"
              description="AI-powered bill analysis finds errors, overcharges, and savings. Get dispute templates, negotiation scripts, and coaching."
              gradient="from-emerald-600 via-emerald-500 to-teal-500"
              delay={0.1}
              href="/api/login?redirect=/bill-ai"
            />
            <FeatureCard3D
              icon={Brain}
              title="Clinical Intelligence Hub"
              description="Access health reference tools, lab analyzers, medication databases, and symptom libraries for education."
              gradient="from-blue-600 via-blue-500 to-indigo-500"
              delay={0.2}
              href="/api/login?redirect=/clinical-command-center"
            />
            <FeatureCard3D
              icon={Target}
              title="Diagnostic Mastery"
              description="Train with 500+ AI patient cases across 19 specialties. Practice history-taking and differential diagnosis."
              gradient="from-purple-600 via-purple-500 to-violet-500"
              delay={0.3}
              href="/api/login?redirect=/patient-diagnostics"
            />
            <FeatureCard3D
              icon={Trophy}
              title="Gamified Learning"
              description="Earn XP, unlock achievements, compete on leaderboards, and play Pixel Doctor for engaging experiences."
              gradient="from-amber-600 via-amber-500 to-orange-500"
              delay={0.4}
              href="/api/login?redirect=/game"
            />
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden" data-testid="section-how-it-works">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-emerald-500/5" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              How It <span className="text-emerald-400">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to start saving
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: 1, icon: Upload, title: "Upload Your Bill", desc: "Take a photo or enter bill details. AI processes it instantly" },
              { step: 2, icon: Cpu, title: "AI Analysis", desc: "Find billing errors, overcharges, and savings automatically" },
              { step: 3, icon: Wand2, title: "Get Results", desc: "Receive templates, scripts, and step-by-step guidance" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, type: "spring" }}
                data-testid={`step-${item.step}`}
              >
                <motion.div 
                  className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-emerald-500/40 transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/40 border-4 border-[#0a0a0f]">
                    {item.step}
                  </div>
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:from-emerald-500/30 group-hover:to-emerald-500/10 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <item.icon className="h-10 w-10 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                </motion.div>
                {i < 2 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-10 w-10 text-emerald-500/50" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative" data-testid="section-cta">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.15)_0%,transparent_60%)]" />
        
        <motion.div
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 px-6 py-3 rounded-full font-bold text-sm mb-10"
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(245,158,11,0)", "0 0 30px rgba(245,158,11,0.3)", "0 0 20px rgba(245,158,11,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5" />
            Start Your Journey Today
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8">
            Ready to{" "}
            <motion.span
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% auto" }}
            >
              Transform
            </motion.span>
            {" "}Your Healthcare?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands who've saved on medical bills and gained health knowledge
          </p>

          <MagneticButton
            href="/api/login"
            className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-emerald-500/40"
            testId="button-get-started-cta"
          >
            <Rocket className="h-8 w-8" />
            <span>Get Started Free</span>
            <ArrowRight className="h-8 w-8" />
          </MagneticButton>

          <p className="text-gray-500 mt-8 text-sm font-medium">
            Free to start • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </section>

      <footer className="py-16 border-t border-white/10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">GoldRock Health</span>
            </motion.div>
            
            <div className="flex items-center gap-8 text-gray-400 text-sm font-medium">
              <a href="/privacy-policy" className="hover:text-white transition-colors" data-testid="link-privacy">Privacy</a>
              <a href="/terms-of-service" className="hover:text-white transition-colors" data-testid="link-terms">Terms</a>
              <a href="/support" className="hover:text-white transition-colors" data-testid="link-support">Support</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2025 GoldRock Health. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
