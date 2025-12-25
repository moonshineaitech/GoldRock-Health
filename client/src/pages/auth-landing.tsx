import { LandingNavigation } from "@/components/landing-navigation";
import { 
  DollarSign, Zap, Brain, FileText, Upload, Target, Shield, Code, Scale, Clock, 
  AlertTriangle, Eye, Phone, Database, Book, Receipt, Building, HandCoins, 
  Gavel, Lock, Network, Crosshair, Calculator, MessageCircle, Crown, Sparkles,
  ArrowRight, Play, FileCheck, TrendingDown, Award, BadgeCheck, ChevronRight,
  FileX, CreditCard, Wrench, Puzzle, Heart, Search, Users, Settings, BarChart3,
  Pill, Stethoscope, Activity, Microscope, Baby, Car, Home as HomeIcon, Trophy,
  Star, CheckCircle, ArrowDown, Rocket, Globe, Layers, Cpu, Wand2
} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";

const FloatingParticle = ({ delay, duration, x, y, size }: { delay: number; duration: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.8, 0.4, 0.8, 0],
      scale: [0, 1, 1.2, 1, 0],
      y: [0, -100, -200],
      x: [0, Math.random() * 50 - 25],
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity, 
      repeatDelay: Math.random() * 3,
      ease: "easeInOut" 
    }}
  />
);

const GlowOrb = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-3xl opacity-30`}
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.2, 0.4, 0.2],
      x: [0, 30, 0],
      y: [0, -20, 0],
    }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const AnimatedCounter = ({ end, suffix = "", prefix = "", duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
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
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [hasAnimated, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const FeatureCard3D = ({ icon: Icon, title, description, gradient, delay, href }: {
  icon: any; title: string; description: string; gradient: string; delay: number; href: string;
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 20);
    setRotateY(x * 20);
  };

  const handleClick = () => {
    window.location.href = href;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      onClick={handleClick}
      className="block cursor-pointer"
      style={{ perspective: "1000px" }}
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <motion.div
        className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white shadow-2xl overflow-hidden h-full`}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileHover={{ scale: 1.02, boxShadow: "0 50px 100px -20px rgba(0,0,0,0.4)" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
          whileHover={{ opacity: 1, x: ["-100%", "200%"] }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
        
        <motion.div
          className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 shadow-lg"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-8 w-8 text-white" strokeWidth={2} />
        </motion.div>
        
        <h3 className="relative z-10 text-2xl font-black mb-3">{title}</h3>
        <p className="relative z-10 text-white/90 text-base leading-relaxed mb-4">{description}</p>
        
        <motion.div 
          className="relative z-10 flex items-center gap-2 text-white/80 font-bold"
          whileHover={{ x: 5 }}
        >
          <span>Get Started</span>
          <ArrowRight className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2 }}
  >
    <span className="text-sm font-medium text-gray-500">Scroll to explore</span>
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <ArrowDown className="h-5 w-5 text-gray-400" />
    </motion.div>
  </motion.div>
);

export default function AuthLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.5,
    duration: 5 + Math.random() * 5,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <LandingNavigation />
      
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" data-testid="section-hero">
        <GlowOrb color="bg-emerald-500" size={600} x="-10%" y="20%" delay={0} />
        <GlowOrb color="bg-purple-500" size={500} x="70%" y="10%" delay={2} />
        <GlowOrb color="bg-blue-500" size={400} x="50%" y="60%" delay={4} />
        <GlowOrb color="bg-amber-500" size={350} x="20%" y="70%" delay={1} />

        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <motion.div 
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="relative mx-auto mb-8"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 rounded-[2.5rem] blur-2xl opacity-60"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative w-28 h-28 bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto border border-white/20">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-dashed border-white/30 rounded-[2rem]"
              />
              <DollarSign className="w-14 h-14 text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
          >
            {[
              { icon: DollarSign, label: "Bill Savings", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400" },
              { icon: Brain, label: "AI Diagnostics", color: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400" },
              { icon: Stethoscope, label: "Health Tools", color: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400" },
              { icon: Trophy, label: "Gamified", color: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400" },
            ].map((pill, i) => (
              <motion.span
                key={pill.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${pill.color} border rounded-full px-4 py-2 backdrop-blur-sm`}
              >
                <pill.icon className="h-4 w-4" />
                <span className="text-sm font-bold">{pill.label}</span>
              </motion.span>
            ))}
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-white">Your Complete</span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% auto" }}
            >
              Health AI Platform
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Reduce medical bills by <span className="text-emerald-400 font-bold">$2,000-$35,000+</span>, master diagnostics with AI patients, and access professional health tools
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.a
              href="/api/login"
              className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-2xl shadow-2xl shadow-emerald-500/30 overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-get-started-hero"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 flex items-center gap-3">
                <Rocket className="h-6 w-6" />
                <span>Start Free Analysis</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            <motion.a
              href="#features"
              className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-explore-features"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span>Explore Features</span>
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Bank-level security</span>
            </div>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      <section className="py-24 relative" data-testid="section-stats">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { value: 35000, prefix: "$", suffix: "+", label: "Average Savings", color: "from-emerald-500 to-teal-500" },
              { value: 500, suffix: "+", label: "AI Patients", color: "from-purple-500 to-violet-500" },
              { value: 19, suffix: "", label: "Specialties", color: "from-blue-500 to-indigo-500" },
              { value: 98, suffix: "%", label: "Success Rate", color: "from-amber-500 to-orange-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center hover:border-white/20 transition-colors">
                  <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 relative" data-testid="section-platform-overview">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-5 py-2 rounded-full font-bold text-sm mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              Complete Health AI Platform
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Four Pillars of
              <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent"> Excellence</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
              Everything you need to reduce medical bills and master healthcare
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard3D
              icon={DollarSign}
              title="Financial Defense Suite"
              description="AI-powered bill analysis finds errors, overcharges, and savings opportunities. Get dispute templates, negotiation scripts, and coaching to reduce bills by $2K-$35K+"
              gradient="from-emerald-600 via-emerald-500 to-teal-500"
              delay={0.1}
              href="/api/login?redirect=/bill-ai"
            />
            <FeatureCard3D
              icon={Brain}
              title="Clinical Intelligence Hub"
              description="Access health reference tools, lab analyzers, medication databases, and symptom libraries for educational purposes"
              gradient="from-blue-600 via-blue-500 to-indigo-500"
              delay={0.2}
              href="/api/login?redirect=/clinical-command-center"
            />
            <FeatureCard3D
              icon={Target}
              title="Diagnostic Mastery"
              description="Train with 500+ AI patient cases across 19 specialties. Practice history-taking, physical exams, and differential diagnosis"
              gradient="from-purple-600 via-purple-500 to-violet-500"
              delay={0.3}
              href="/api/login?redirect=/patient-diagnostics"
            />
            <FeatureCard3D
              icon={Trophy}
              title="Gamified Learning"
              description="Earn XP, unlock achievements, compete on leaderboards, and play Pixel Doctor for an engaging learning experience"
              gradient="from-amber-600 via-amber-500 to-orange-500"
              delay={0.4}
              href="/api/login?redirect=/game"
            />
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" data-testid="section-how-it-works">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              How It <span className="text-emerald-400">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to start saving on medical bills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: Upload, title: "Upload Your Bill", desc: "Take a photo or enter bill details. Our AI processes it in seconds" },
              { step: 2, icon: Cpu, title: "AI Analysis", desc: "Find billing errors, overcharges, and savings opportunities automatically" },
              { step: 3, icon: Wand2, title: "Get Results", desc: "Receive dispute templates, negotiation scripts, and step-by-step guidance" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors group">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30">
                    {item.step}
                  </div>
                  <motion.div
                    className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:bg-emerald-500/20 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <item.icon className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-emerald-500/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative" data-testid="section-clinical-tools">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-2 rounded-full font-bold text-sm mb-6">
              <Stethoscope className="h-4 w-4" />
              Clinical Intelligence Hub
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Health Reference <span className="text-blue-400">Tools</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Educational resources to understand your health better
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Activity, title: "Lab Reference", desc: "Look up lab values", gradient: "from-blue-600 to-indigo-600", href: "/api/login?redirect=/lab-analyzer" },
              { icon: Pill, title: "Medication Info", desc: "Drug database", gradient: "from-purple-600 to-violet-600", href: "/api/login?redirect=/drug-interactions" },
              { icon: Brain, title: "Symptom Library", desc: "Browse symptoms", gradient: "from-emerald-600 to-teal-600", href: "/api/login?redirect=/symptom-checker" },
              { icon: Heart, title: "Health Journal", desc: "Track metrics", gradient: "from-rose-600 to-pink-600", href: "/api/login?redirect=/health-metrics" },
            ].map((tool, i) => (
              <motion.a
                key={tool.title}
                href={tool.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative bg-gradient-to-br ${tool.gradient} rounded-3xl p-6 text-white shadow-2xl overflow-hidden group cursor-pointer`}
                data-testid={`card-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div
                  className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <tool.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-black mb-2">{tool.title}</h3>
                <p className="text-white/80 text-sm">{tool.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-white/70 text-sm font-semibold group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative" data-testid="section-cta">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent" />
        
        <motion.div
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-5 py-2 rounded-full font-bold text-sm mb-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4" />
            Start Saving Today
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Transform</span> Your Healthcare?
          </h2>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands who've saved on medical bills and gained health knowledge
          </p>

          <motion.a
            href="/api/login"
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-emerald-500/30"
            whileHover={{ scale: 1.05, boxShadow: "0 30px 60px -15px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            data-testid="button-get-started-cta"
          >
            <Rocket className="h-7 w-7" />
            <span>Get Started Free</span>
            <ArrowRight className="h-7 w-7" />
          </motion.a>

          <p className="text-gray-500 mt-6 text-sm">
            Free to start. No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </section>

      <footer className="py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">GoldRock Health</span>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms-of-service" className="hover:text-white transition-colors">Terms</a>
              <a href="/support" className="hover:text-white transition-colors">Support</a>
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
