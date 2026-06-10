import { LandingNavigation } from "@/components/landing-navigation";
import { DemoChat } from "@/components/demo-chat";
import { 
  DollarSign, Zap, Brain, FileText, Upload, Target, Shield, Code, Scale, Clock, 
  AlertTriangle, Eye, Phone, Database, Book, BookOpen, Receipt, Building, HandCoins, 
  Gavel, Lock, Network, Crosshair, Calculator, MessageCircle, Crown, Sparkles,
  ArrowRight, Play, FileCheck, TrendingDown, Award, BadgeCheck, ChevronRight,
  FileX, CreditCard, Wrench, Puzzle, Heart, Search, Users, Settings, BarChart3,
  Pill, Stethoscope, Activity, Microscope, Baby, Car, Home as HomeIcon, Trophy,
  Check, Dna
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";

const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }: { delay?: number; duration?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, rgba(193, 154, 75, 0.4) 0%, rgba(193, 154, 75, 0.12) 50%, transparent 100%)`,
      boxShadow: `0 0 ${size * 2}px rgba(193, 154, 75, 0.25)`,
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

const GlowingOrb = ({ className, color1, color2, size = 400, blur = 100 }: { className?: string; color1: string; color2: string; size?: number; blur?: number }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color1} 0%, ${color2} 50%, transparent 70%)`,
      filter: `blur(${blur}px)`,
    }}
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.25, 0.4, 0.25],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const GlassmorphicCard = ({ children, className = "", glowColor = "emerald" }: { children: React.ReactNode; className?: string; glowColor?: string }) => {
  return (
    <motion.div
      className={`luxury-card relative overflow-hidden ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const DemoLoginForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="text-center mt-3 mb-2">
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          data-testid="demo-login-toggle"
        >
          App Store Reviewer? Sign in here
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="max-w-xs mx-auto mt-3 mb-2"
    >
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
        <p className="text-xs text-gray-500 text-center font-medium">Demo Account Login</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </motion.div>
  );
};

const PremiumFeatureCard = ({ icon: Icon, title, description, color, delay = 0 }: {
  icon: any;
  title: string;
  description: string;
  color: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="relative group h-full"
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="luxury-card rounded-3xl p-7 h-full">
        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-5">
          <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{title}</h3>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default function AuthLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [pricingTab, setPricingTab] = useState<'monthly' | 'annual' | 'lifetime'>('monthly');
  const containerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('goldrock_welcome_dismissed');
    }
    return true;
  });

  const handleDismissPopup = (learnMore: boolean) => {
    localStorage.setItem('goldrock_welcome_dismissed', 'true');
    setShowWelcomePopup(false);
    if (learnMore) {
      navigate('/about');
    }
  };

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {showWelcomePopup && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => handleDismissPopup(false)}
          />
          <motion.div 
            className="relative bg-card border border-border rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 font-serif">Welcome to GoldRock Health</h2>
            <p className="text-muted-foreground mb-6">
              An AI-powered platform that helps you understand, challenge, and reduce your medical bills. 
              Save money with insider knowledge and expert strategies.
            </p>
            <div className="space-y-3">
              <motion.button
                className="w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDismissPopup(true)}
              >
                <BookOpen className="inline h-5 w-5 mr-2" />
                Learn More About GoldRock Health
              </motion.button>
              <motion.button
                className="w-full py-3 px-6 border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDismissPopup(false)}
              >
                Enter Site
                <ArrowRight className="inline h-5 w-5 ml-2" />
              </motion.button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              You can always find "About GoldRock Health" in the footer.
            </p>
          </motion.div>
        </motion.div>
      )}
      <LandingNavigation />
      
      <section className="relative overflow-hidden pt-[5.5rem] pb-12">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--background), var(--card))",
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-0 -left-32" 
            color1="rgba(193, 154, 75, 0.12)" 
            color2="rgba(193, 154, 75, 0.05)" 
            size={500}
            blur={120}
          />
          <GlowingOrb 
            className="-bottom-32 -right-32" 
            color1="rgba(193, 154, 75, 0.08)" 
            color2="rgba(193, 154, 75, 0.03)" 
            size={450}
            blur={100}
          />
          <GlowingOrb 
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
            color1="rgba(193, 154, 75, 0.06)" 
            color2="rgba(193, 154, 75, 0.02)" 
            size={400}
            blur={90}
          />
          
          {[...Array(15)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.2} duration={18 + Math.random() * 8} size={3 + Math.random() * 4} />
          ))}
          
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Top Header - Your Healthcare Bill Protector */}
          <motion.p
            className="text-xs sm:text-sm font-semibold text-gold tracking-[0.2em] uppercase mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Healthcare Bill Protector & Advocate
          </motion.p>

          {/* Balanced Healthcare Logo - Shield with Heart Center */}
          <motion.div 
            className="relative mx-auto mb-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 15 }}
          >
            <motion.div
              className="absolute -inset-6 rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle, rgba(193, 154, 75, 0.35), transparent 70%)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="relative w-20 h-20 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              {/* Shield base */}
              <Shield 
                className="absolute text-gold h-20 w-20" 
                strokeWidth={1.5} 
                fill="url(#shieldGradient)"
              />
              {/* Heart centered in shield */}
              <Heart 
                className="relative text-white h-8 w-8 drop-shadow-lg z-10 mt-1" 
                strokeWidth={2} 
                fill="rgba(255,255,255,0.9)"
              />
              {/* SVG gradient definition */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d8b25e" />
                    <stop offset="50%" stopColor="#bf9a4b" />
                    <stop offset="100%" stopColor="#946b22" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </motion.div>

          {/* Emotional Headline - Combined Best of Both */}
          <motion.h1 
            className="text-[1.75rem] sm:text-4xl md:text-5xl font-black mb-3 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-foreground">The Healthcare System</span>
            <br />
            <span className="text-foreground">Wasn't Built for You.</span>
            <br />
            <motion.span 
              className="inline-block mt-1 luxury-text-gradient"
            >
              We Are.
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-sm sm:text-base text-muted-foreground mb-5 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Hospitals have teams protecting their revenue.
            <br />
            <span className="text-gold font-semibold">Now you have one protecting yours.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="/api/login"
              className="group relative w-full sm:w-auto px-6 py-3.5 text-white font-bold text-sm rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))",
                boxShadow: "0 12px 24px -8px rgba(148, 107, 34, 0.35)"
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-get-started-hero"
            >
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <div className="relative z-10 flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Upload Your Bill & Take Control
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.a>
            
            <motion.a
              href="/api/login?redirect=/patient-diagnostics"
              className="w-full sm:w-auto px-6 py-3.5 bg-card border border-border text-foreground font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01, y: -1 }}
              data-testid="button-explore-features"
            >
              <Brain className="h-4 w-4 text-muted-foreground" />
              Explore AI Health Tools
            </motion.a>
          </motion.div>

          <DemoLoginForm />

          {/* Core Capabilities Grid - After CTAs */}
          <motion.div
            className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: DollarSign, label: "Bill Reduction", desc: "Find overcharges", color: "emerald" },
              { icon: Brain, label: "AI Diagnostics", desc: "Clinical support", color: "blue" },
              { icon: Scale, label: "Rights Protection", desc: "Know your rights", color: "purple" },
              { icon: Stethoscope, label: "Medical Training", desc: "1000+ cases", color: "amber" },
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                className="bg-card rounded-xl p-3 border border-border shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-secondary">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-xs mb-0.5">{item.label}</h3>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            {[
              { icon: Lock, label: "HIPAA Aligned" },
              { icon: Shield, label: "256-bit Encrypted" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1 text-muted-foreground">
                <badge.icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Try AI Chat - Below features and trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-4"
          >
            <DemoChat />
          </motion.div>

          <motion.p
            className="text-[10px] text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Free to start • No credit card required
          </motion.p>
        </div>
      </section>

      <section className="py-12 relative overflow-hidden" id="features" data-testid="section-platform-overview">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--background), var(--card))",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(193, 154, 75, 0.05) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-secondary text-muted-foreground px-5 py-3 rounded-full font-bold text-sm mb-6 border border-border"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4 text-gold" />
              Complete Health AI Platform
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 font-serif">
              More Than Just Bill Analysis
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Four powerful pillars to transform your healthcare experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: DollarSign, 
                title: "Financial Defense", 
                desc: "AI bill analysis, dispute templates, and negotiation strategies to save $2K-$35K+",
                tags: ["Bill AI", "Templates", "Disputes"],
                gradient: "secondary",
                glow: "rgba(16, 185, 129, 0.25)"
              },
              { 
                icon: Brain, 
                title: "Clinical Intelligence", 
                desc: "Health insights, medical knowledge engines, and AI-powered second opinions",
                tags: ["Health AI", "Insights", "Resources"],
                gradient: "secondary",
                glow: "rgba(59, 130, 246, 0.25)"
              },
              { 
                icon: Target, 
                title: "Diagnostic Mastery", 
                desc: "Interactive training with AI patients, step-by-step workups, and full diagnosis mode",
                tags: ["AI Patients", "Training", "Scoring"],
                gradient: "secondary",
                glow: "rgba(139, 92, 246, 0.25)"
              },
              { 
                icon: Trophy, 
                title: "Gamified Learning", 
                desc: "Pixel Doctor game, achievements, XP progression, and skill building",
                tags: ["Pixel Doctor", "Achievements", "XP System"],
                gradient: "secondary",
                glow: "rgba(236, 72, 153, 0.25)"
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -2 }}
                className="relative group"
              >
                <div className="luxury-card rounded-3xl p-7 overflow-hidden h-full">
                  <div className="relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-5"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <pillar.icon className="h-8 w-8 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{pillar.title}</h3>
                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed font-medium">{pillar.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.tags.map(tag => (
                        <span key={tag} className="bg-secondary text-muted-foreground text-xs px-3 py-1.5 rounded-full font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section - Explore All Features */}
      <section 
        className="py-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--background), var(--card))",
        }}
        data-testid="section-quick-access"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(193, 154, 75, 0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(193, 154, 75, 0.04) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-secondary text-muted-foreground px-5 py-2.5 rounded-full font-bold text-sm mb-5 border border-border shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-4 w-4 text-gold" />
              Quick Access
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-serif">
              <span className="text-foreground">Explore All </span>
              <span className="luxury-text-gradient">
                Features
              </span>
            </h2>
            <p className="text-muted-foreground font-medium max-w-lg mx-auto">
              Sign in to unlock powerful AI tools for medical bill analysis, diagnostics, and more
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: HomeIcon, label: "Dashboard", href: "/api/login", description: "Your command center", gradient: "secondary" },
              { icon: Brain, label: "Bill AI", href: "/api/login?redirect=/bill-ai", description: "Find overcharges", gradient: "secondary" },
              { icon: Shield, label: "Rights Hub", href: "/api/login?redirect=/rights-hub", description: "Know your rights", gradient: "secondary", featured: true },
              { icon: Heart, label: "Emergency Help", href: "/api/login?redirect=/emergency-help", description: "Crisis assistance", gradient: "secondary" },
              { icon: Search, label: "Quick Analyzer", href: "/api/login?redirect=/quick-analyzer", description: "Fast bill scan", gradient: "secondary" },
              { icon: Phone, label: "Provider Contacts", href: "/api/login?redirect=/provider-contacts", description: "Hospital database", gradient: "secondary" },
              { icon: Crown, label: "Premium", href: "/api/login?redirect=/premium", description: "Upgrade account", gradient: "secondary" },
              { icon: Puzzle, label: "Pixel Doctor", href: "/api/login?redirect=/pixel-game", description: "Fun diagnostics", gradient: "secondary", special: true },
              { icon: TrendingDown, label: "Reduction Guide", href: "/api/login?redirect=/bill-reduction-guide", description: "Expert strategies", gradient: "secondary" },
              { icon: CreditCard, label: "Get Bills", href: "/api/login?redirect=/portal-access-guide", description: "Portal access", gradient: "secondary" },
              { icon: Database, label: "Resources Hub", href: "/api/login?redirect=/resources-hub", description: "Guides & templates", gradient: "secondary" },
              { icon: Stethoscope, label: "Diagnostics", href: "/api/login?redirect=/patient-diagnostics", description: "AI training", gradient: "secondary" },
              { icon: Dna, label: "LunaFold", href: "/api/login?redirect=/lunafold", description: "Protein analysis", gradient: "secondary" },
              { icon: Shield, label: "Collections Defense", href: "/collections-defense-guide", description: "Fight debt collectors", gradient: "secondary", featured: true },
              { icon: Receipt, label: "Bill Playbook", href: "/hospital-bill-playbook", description: "Reduce bills now", gradient: "secondary", featured: true },
              { icon: Target, label: "Industry Secrets", href: "/api/login?redirect=/industry-insights", description: "Insider tactics", gradient: "secondary" },
              { icon: FileText, label: "Templates", href: "/api/login?redirect=/templates", description: "Dispute letters", gradient: "secondary" },
              { icon: Trophy, label: "Progress", href: "/api/login?redirect=/progress", description: "Your progress", gradient: "secondary" },
            ].map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
                data-testid={`quicklink-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1 group-hover:text-gold transition-colors">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  {(item.featured || item.special) && (
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <motion.a
              href="/api/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-signin-quicklinks"
            >
              <ArrowRight className="h-5 w-5" />
              Sign In to Access All Features
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative overflow-hidden" data-testid="section-how-it-works">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--background), var(--card))",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 2} duration={20} size={2 + Math.random() * 3} />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 bg-secondary text-muted-foreground px-5 py-3 rounded-full font-bold text-sm mb-6 border border-border"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-4 w-4 text-gold" />
                Simple 3-Step Process
              </motion.span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 font-serif">
              How GoldRock Health Works
            </h2>
            <p className="text-xl text-muted-foreground font-semibold max-w-2xl mx-auto">
              Professional medical bill analysis in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Upload,
                title: "Upload Your Bill",
                description: "Photo or PDF of your medical bill from any provider",
                gradient: "secondary",
                glow: "rgba(59, 130, 246, 0.2)"
              },
              {
                step: "2",
                icon: Brain,
                title: "AI Analyzes Everything",
                description: "Detects billing errors, overcharges, and negotiation opportunities",
                gradient: "secondary",
                glow: "rgba(139, 92, 246, 0.2)"
              },
              {
                step: "3",
                icon: FileCheck,
                title: "Get Professional Help",
                description: "Dispute letters, negotiation scripts, and expert coaching",
                gradient: "secondary",
                glow: "rgba(16, 185, 129, 0.2)"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -2 }}
                className="relative group"
                data-testid={`card-step-${step.step}`}
              >
                <GlassmorphicCard className="rounded-3xl h-full">
                  <div className="relative p-8">
                    <div className="absolute top-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <span className="text-2xl font-black text-primary-foreground">{step.step}</span>
                    </div>

                    <motion.div 
                      className="w-18 h-18 bg-secondary rounded-2xl flex items-center justify-center mb-6"
                      style={{ width: 72, height: 72 }}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <step.icon className="h-9 w-9 text-muted-foreground" strokeWidth={2.5} />
                    </motion.div>

                    <h3 className="text-2xl font-black text-foreground mb-4 font-serif">{step.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background relative overflow-hidden" id="features" data-testid="section-core-features">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-0 right-0" 
            color1="rgba(193, 154, 75, 0.06)" 
            color2="rgba(193, 154, 75, 0.02)" 
            size={400}
            blur={100}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 font-serif">
              Complete Medical Bill Arsenal
            </h2>
            <p className="text-xl text-muted-foreground font-semibold max-w-3xl mx-auto">
              Everything you need to fight medical bills and save thousands
            </p>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-foreground mb-10 font-serif"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              AI Analysis & Detection
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-6">
              <PremiumFeatureCard
                icon={Brain}
                title="Bill-AI Deep Analysis"
                description="Comprehensive AI analysis with error detection, legal citations, and regulatory violations"
                color="secondary"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Zap}
                title="Quick Analyzer"
                description="Instant 5-minute bill scan for fast overcharge detection and immediate insights"
                color="secondary"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Calculator}
                title="Error Detection Engine"
                description="Advanced algorithms detect duplicate charges, upcoding, unbundling fraud, and timing discrepancies"
                color="secondary"
                delay={0.2}
              />
            </div>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-foreground mb-10 font-serif"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Expert Negotiation & Coaching
            </motion.h3>
            <div className="grid md:grid-cols-4 gap-6">
              <PremiumFeatureCard
                icon={MessageCircle}
                title="1-on-1 Reduction Coach"
                description="Personal expert guidance for complex cases and high-value bills"
                color="secondary"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Target}
                title="Negotiation Coaching"
                description="Proven scripts, timing strategies, and escalation tactics"
                color="secondary"
                delay={0.05}
              />
              <PremiumFeatureCard
                icon={Clock}
                title="Timing Optimizer"
                description="Best times to negotiate based on revenue cycle pressure points"
                color="secondary"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Phone}
                title="Provider Contact Database"
                description="Direct billing department contacts for every major hospital system"
                color="secondary"
                delay={0.15}
              />
            </div>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-foreground mb-10 font-serif"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Dispute Arsenal & Legal Tools
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-6">
              <PremiumFeatureCard
                icon={FileText}
                title="50+ Dispute Templates"
                description="Professional legal letters with regulatory citations and case law references"
                color="secondary"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Shield}
                title="Insurance Denials Intelligence"
                description="Denial codes, reversal strategies, and appeal letter generators"
                color="secondary"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Scale}
                title="Rights Hub"
                description="Know your patient rights under No Surprises Act, EMTALA, and state laws"
                color="secondary"
                delay={0.2}
              />
            </div>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-foreground mb-10 font-serif"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Industry Intelligence & Guides
            </motion.h3>
            <div className="grid md:grid-cols-4 gap-6">
              <PremiumFeatureCard
                icon={Building}
                title="Industry Insights"
                description="Hospital billing vulnerabilities and revenue cycle weak points"
                color="secondary"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Database}
                title="Best Practices"
                description="Field-tested negotiation scripts from successful bill reductions"
                color="secondary"
                delay={0.05}
              />
              <PremiumFeatureCard
                icon={Book}
                title="Complete Guides"
                description="Comprehensive step-by-step resources for every situation"
                color="secondary"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Activity}
                title="Analytics Dashboard"
                description="Track your progress and monitor potential savings across all bills"
                color="secondary"
                delay={0.15}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 relative overflow-hidden" data-testid="section-pricing">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--background), var(--card))",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-1/4 -left-20" 
            color1="rgba(193, 154, 75, 0.12)" 
            color2="rgba(193, 154, 75, 0.04)" 
            size={400}
            blur={100}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              className="relative inline-block mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute -inset-4 rounded-3xl opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(193, 154, 75, 0.25), transparent)",
                  filter: "blur(20px)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div 
                className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
              >
                <Crown className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black mb-6 font-serif luxury-text-gradient">
              Premium Access
            </h2>
            
            <p className="text-xl text-muted-foreground font-semibold mb-10 leading-relaxed max-w-2xl mx-auto">
              Full AI analysis, dispute templates, expert coaching & insider tactics
            </p>

            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-card rounded-2xl p-2 border border-border shadow-sm">
                {[
                  { id: 'monthly' as const, label: 'Monthly' },
                  { id: 'annual' as const, label: 'Annual' },
                  { id: 'lifetime' as const, label: 'Lifetime' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setPricingTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      pricingTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
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

            <GlassmorphicCard className="rounded-3xl max-w-md mx-auto mb-10" glowColor="amber">
              <div className="p-8">
                <motion.div 
                  className="flex items-baseline justify-center gap-2 mb-4"
                  key={pricingTab}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-6xl font-black text-foreground">
                    {pricingTab === 'monthly' && '$25'}
                    {pricingTab === 'annual' && '$249'}
                    {pricingTab === 'lifetime' && '$747'}
                  </span>
                  <span className="text-xl text-muted-foreground font-semibold">
                    {pricingTab === 'monthly' && '/month'}
                    {pricingTab === 'annual' && '/year'}
                    {pricingTab === 'lifetime' && 'one-time'}
                  </span>
                </motion.div>
                {pricingTab === 'annual' && (
                  <motion.div 
                    className="text-base text-emerald-700 font-bold flex items-center justify-center gap-2 mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BadgeCheck className="h-5 w-5" />
                    Save $51 per year vs monthly
                  </motion.div>
                )}
                {pricingTab === 'lifetime' && (
                  <motion.div 
                    className="text-base text-emerald-700 font-bold flex items-center justify-center gap-2 mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BadgeCheck className="h-5 w-5" />
                    Unlimited access forever • Best value
                  </motion.div>
                )}
                <p className="text-sm text-muted-foreground font-medium">
                  Professional medical bill reduction
                </p>
              </div>
            </GlassmorphicCard>

            <div className="grid md:grid-cols-2 gap-4 mb-10 text-left max-w-lg mx-auto">
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
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
                  >
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-base text-muted-foreground font-semibold">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/premium">
              <motion.div
                className="inline-flex items-center gap-3 px-12 py-6 text-white font-black text-lg rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))"
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-upgrade-premium-main"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
                <Crown className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Upgrade to Premium</span>
                <Sparkles className="h-5 w-5 relative z-10" />
              </motion.div>
            </Link>

            <p className="text-sm text-muted-foreground mt-6 font-medium">
              Cancel anytime • Full refund within 30 days
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card relative overflow-hidden" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-foreground mb-5 font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground font-medium"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Everything you need to know about GoldRock Health
            </motion.p>
          </div>

          <div className="space-y-5">
            {[
              {
                q: "How does GoldRock Health work?",
                a: "Upload your medical bill and our AI analyzes it for billing errors, overcharges, and negotiation opportunities. You'll receive a detailed analysis, legal dispute templates, and expert negotiation strategies tailored to your situation."
              },
              {
                q: "How much can I save on my medical bills?",
                a: "Savings vary based on your bill size and situation. Our AI identifies billing errors, coding mistakes, and negotiation opportunities that most people miss, helping you pay only what you truly owe."
              },
              {
                q: "Is my health information private and secure?",
                a: "Yes. We align with HIPAA standards and use bank-level encryption to protect your data. You own your data completely and can delete it at any time. We never share or sell your information."
              },
              {
                q: "Do I need insurance to use GoldRock Health?",
                a: "No! GoldRock Health works for everyone - with or without insurance. We help reduce bills from hospitals, urgent care, labs, and more."
              },
              {
                q: "What types of bills can you analyze?",
                a: "Hospital bills, emergency room bills, surgery bills, lab bills, imaging bills, specialist bills, ambulance bills, and more. Any itemized medical bill can be analyzed."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your Premium subscription anytime with no penalties. We also offer a full refund within 30 days if you're not satisfied."
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
                  <div className="p-7">
                    <h3 className="font-black text-foreground mb-4 flex items-start gap-4 text-lg font-serif">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-sm"
                      >
                        <Check className="h-4 w-4 text-muted-foreground" strokeWidth={3} />
                      </motion.div>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-12 font-medium">{faq.a}</p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--background), var(--card))",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.5} duration={16} size={2 + Math.random() * 3} />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-black mb-6 font-serif luxury-text-gradient"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Fight Your Bills?
          </motion.h2>
          <p className="text-xl text-muted-foreground font-semibold max-w-xl mx-auto mb-10">
            Professional AI analysis & expert strategies to help you save thousands
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/bill-ai">
              <motion.div
                className="inline-flex items-center gap-3 px-12 py-6 text-white font-black text-lg rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))"
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-start-analysis-final"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
                <Zap className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Start Free Bill Analysis</span>
                <ArrowRight className="h-6 w-6 relative z-10" />
              </motion.div>
            </Link>

            <Link href="/premium">
              <motion.div
                className="inline-flex items-center gap-2 px-10 py-6 bg-card border border-border text-foreground font-black text-lg rounded-2xl shadow-sm cursor-pointer"
                whileHover={{ scale: 1.03, y: -2 }}
                data-testid="button-view-premium-final"
              >
                <Crown className="h-5 w-5 text-gold" />
                View Premium Plans
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </Link>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-base text-muted-foreground mt-10 font-medium"
          >
            🔒 Private & Secure • ⚡ AI-Powered • ⚖️ Legal Templates
          </motion.p>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
                >
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">GoldRock Health</span>
              </div>
              <p className="text-sm text-gray-400">AI-powered healthcare advocacy platform helping patients save on medical bills.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/about" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-about">
                  About GoldRock Health
                </Link>
                <Link href="/platform-stats" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-stats">
                  Platform Stats
                </Link>
                <Link href="/case-studies" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-case-studies">
                  Case Studies
                </Link>
                <Link href="/articles" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-articles">
                  Resources
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Partnerships</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/for-vcs" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-vcs">
                  For VCs
                </Link>
                <Link href="/investors" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-investors">
                  For Investors
                </Link>
                <Link href="/for-healthcare" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-healthcare">
                  For Healthcare Companies
                </Link>
                <Link href="/for-insurance" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-insurance">
                  For Insurance Companies
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-privacy-landing">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-terms-landing">
                  Terms of Service
                </Link>
                <Link href="/support" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-support-landing">
                  Support
                </Link>
                <a 
                  href="mailto:CONTACT@GOLDROCK.ai" 
                  className="text-gray-400 hover:text-gold transition-colors"
                  data-testid="footer-link-email-landing"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-800 text-center text-xs text-gray-500 pb-24">
            <p className="mb-1">Educational use only. Not for clinical diagnosis or treatment decisions. Not medical, legal, or financial advice.</p>
            <p>&copy; {new Date().getFullYear()} GoldRock Health by Eldest AI LLC. All rights reserved. • Colorado, USA</p>
          </div>
        </div>
      </footer>

      {/* Pre-Login Bottom Navigation Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: 'var(--card)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.08)'
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-around px-1 py-2 gap-1">
          {[
            { id: "home", label: "Home", icon: HomeIcon, href: "/api/login", color: "#3B82F6", bgGradient: "blue" },
            { id: "billai", label: "Bill AI", icon: FileText, href: "/api/login?redirect=/bill-ai", color: "#8B5CF6", bgGradient: "purple" },
            { id: "learn", label: "Learn", icon: Brain, href: "/api/login?redirect=/patient-diagnostics", color: "#14B8A6", bgGradient: "teal" },
            { id: "tools", label: "Tools", icon: Stethoscope, href: "/api/login?redirect=/clinical-command-center", color: "#6366F1", bgGradient: "indigo" },
            { id: "lunafold", label: "LunaFold", icon: Dna, href: "/api/login?redirect=/lunafold", color: "#06B6D4", bgGradient: "cyan" },
            { id: "premium", label: "Premium", icon: Crown, href: "/api/login?redirect=/premium", color: "#F59E0B", bgGradient: "amber", special: true },
          ].map((item, index) => {
            const Icon = item.icon;
            const bgColors: Record<string, string> = {
              blue: 'rgba(239,246,255,0.9), rgba(224,231,255,0.8)',
              purple: 'rgba(245,243,255,0.9), rgba(237,233,254,0.8)',
              teal: 'rgba(240,253,250,0.9), rgba(204,251,241,0.8)',
              indigo: 'rgba(238,242,255,0.9), rgba(224,231,255,0.8)',
              cyan: 'rgba(236,254,255,0.9), rgba(207,250,254,0.8)',
              amber: 'rgba(255,251,235,0.9), rgba(254,243,199,0.8)',
            };
            return (
              <motion.a
                key={item.id}
                href={item.href}
                className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-2xl transition-all duration-300 overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${bgColors[item.bgGradient]})`,
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
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 shadow-lg"
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
                      className="absolute -top-1 -right-1 text-white rounded-full p-1 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
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
    </div>
  );
}
