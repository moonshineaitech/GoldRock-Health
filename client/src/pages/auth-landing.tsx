import { LandingNavigation } from "@/components/landing-navigation";
import { 
  DollarSign, Zap, Brain, FileText, Upload, Target, Shield, Code, Scale, Clock, 
  AlertTriangle, Eye, Phone, Database, Book, Receipt, Building, HandCoins, 
  Gavel, Lock, Network, Crosshair, Calculator, MessageCircle, Crown, Sparkles,
  ArrowRight, Play, FileCheck, TrendingDown, Award, BadgeCheck, ChevronRight,
  FileX, CreditCard, Wrench, Puzzle, Heart, Search, Users, Settings, BarChart3,
  Pill, Stethoscope, Activity, Microscope, Baby, Car, Home as HomeIcon, Trophy,
  Check, Dna, Download, ExternalLink, Gamepad2
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useState, useRef } from "react";

const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }: { delay?: number; duration?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 100%)`,
      boxShadow: `0 0 ${size * 2}px rgba(16, 185, 129, 0.3)`,
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
  const [isHovered, setIsHovered] = useState(false);
  
  const glowColors: Record<string, string> = {
    emerald: "rgba(16, 185, 129, 0.12)",
    purple: "rgba(139, 92, 246, 0.12)",
    blue: "rgba(59, 130, 246, 0.12)",
    amber: "rgba(245, 158, 11, 0.12)",
    pink: "rgba(236, 72, 153, 0.12)",
  };
  
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${glowColors[glowColor]}, transparent 40%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-2xl" />
      <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/95 via-white/80 to-white/60" />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 shadow-xl" />
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)",
        }}
        animate={{ opacity: isHovered ? 0.9 : 0.5 }}
      />
      <div className="relative z-10">{children}</div>
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.05, y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${color.includes('emerald') ? 'rgba(16,185,129,0.3)' : color.includes('purple') ? 'rgba(139,92,246,0.3)' : color.includes('blue') ? 'rgba(59,130,246,0.3)' : color.includes('orange') ? 'rgba(249,115,22,0.3)' : 'rgba(236,72,153,0.3)'}, transparent)`,
          filter: "blur(20px)",
        }}
      />
      <div className={`relative bg-gradient-to-br ${color} rounded-3xl p-7 shadow-2xl overflow-hidden`}>
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        />

        <motion.div
          animate={{ opacity: isHovered ? [0.4, 0.7, 0.4] : 0 }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          className="absolute inset-0 bg-white dark:bg-slate-900/15 blur-2xl pointer-events-none"
        />

        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10">
          <motion.div
            animate={{ 
              scale: isHovered ? [1, 1.15, 1] : 1,
              rotate: isHovered ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-white dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 shadow-xl"
          >
            <Icon className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={2.5} />
          </motion.div>
          <h3 className="text-xl font-black text-white mb-3 drop-shadow-md">{title}</h3>
          <p className="text-white/90 font-medium text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function AuthLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [pricingTab, setPricingTab] = useState<'monthly' | 'annual' | 'lifetime'>('monthly');
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900" ref={containerRef}>
      <LandingNavigation />
      
      <section className="relative overflow-hidden pt-36 pb-24">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 30%, rgba(240,253,244,0.5) 70%, rgba(236,253,245,0.8) 100%)",
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-0 -left-32" 
            color1="rgba(16, 185, 129, 0.2)" 
            color2="rgba(6, 182, 212, 0.08)" 
            size={500}
            blur={120}
          />
          <GlowingOrb 
            className="-bottom-32 -right-32" 
            color1="rgba(139, 92, 246, 0.15)" 
            color2="rgba(59, 130, 246, 0.06)" 
            size={450}
            blur={100}
          />
          <GlowingOrb 
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
            color1="rgba(245, 158, 11, 0.1)" 
            color2="rgba(236, 72, 153, 0.04)" 
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
          <motion.div 
            className="relative mx-auto mb-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 150, damping: 15 }}
          >
            <motion.div
              className="absolute -inset-6 rounded-[3rem] opacity-50"
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(245, 158, 11, 0.25), rgba(139, 92, 246, 0.25))",
                filter: "blur(25px)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="relative w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto"
              style={{ 
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 30%, #10b981 70%, #059669 100%)",
                boxShadow: "0 30px 60px -15px rgba(16, 185, 129, 0.35), 0 0 0 1px rgba(255,255,255,0.15) inset"
              }}
              whileHover={{ scale: 1.08, rotate: 5 }}
            >
              <motion.div
                className="absolute inset-0 rounded-[2.5rem] opacity-60"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)",
                }}
              />
              <DollarSign className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.05]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-gray-900 dark:text-white drop-shadow-sm">Your Complete</span>
            <br />
            <motion.span 
              className="inline-block relative"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 20%, #10b981 50%, #059669 70%, #0d9488 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Health AI Command Center
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #10b981)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.span>
          </motion.h1>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: DollarSign, label: "Bill Analysis", colors: "from-emerald-100 to-teal-100", border: "border-emerald-300", text: "text-emerald-700", iconColor: "text-emerald-600" },
              { icon: Brain, label: "AI Diagnostics", colors: "from-purple-100 to-indigo-100", border: "border-purple-300", text: "text-purple-700", iconColor: "text-purple-600" },
              { icon: Stethoscope, label: "Medical Training", colors: "from-pink-100 to-rose-100", border: "border-pink-300", text: "text-pink-700", iconColor: "text-pink-600" },
              { icon: Trophy, label: "Gamified Learning", colors: "from-amber-100 to-orange-100", border: "border-amber-300", text: "text-amber-700", iconColor: "text-amber-600" },
            ].map((item, i) => (
              <motion.span 
                key={item.label}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${item.colors} border ${item.border} rounded-full px-4 py-2.5 shadow-lg backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                <span className={`text-sm font-bold ${item.text}`}>{item.label}</span>
              </motion.span>
            ))}
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Reduce medical bills, master diagnostic skills, train with AI patients, and access expert health insights all in one powerful platform
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.a
              href="/api/login"
              className="group relative px-12 py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-black text-lg rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset"
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-get-started-hero"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity"
              />
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              <div className="relative z-10 flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                Start Free Analysis
                <ArrowRight className="h-6 w-6" />
              </div>
            </motion.a>
            
            <motion.a
              href="#features"
              className="px-12 py-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl border-2 border-gray-200 text-gray-900 dark:text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:border-gray-300 transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              data-testid="button-explore-features"
            >
              Explore All Features
            </motion.a>
          </motion.div>

          <motion.p
            className="text-sm text-gray-600 dark:text-gray-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Free to start. Professional tools. No credit card required
          </motion.p>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" id="features" data-testid="section-platform-overview">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(249,250,251,1) 0%, rgba(255,255,255,1) 50%, rgba(249,250,251,1) 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-5 py-3 rounded-full font-bold text-sm mb-6 shadow-xl border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              Complete Health AI Platform
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
              More Than Just Bill Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto">
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
                gradient: "from-emerald-500 via-teal-500 to-cyan-500",
                glow: "rgba(16, 185, 129, 0.25)"
              },
              { 
                icon: Brain, 
                title: "Clinical Intelligence", 
                desc: "Health insights, medical knowledge engines, and AI-powered second opinions",
                tags: ["Health AI", "Insights", "Resources"],
                gradient: "from-blue-500 via-indigo-500 to-purple-500",
                glow: "rgba(59, 130, 246, 0.25)"
              },
              { 
                icon: Target, 
                title: "Diagnostic Mastery", 
                desc: "Interactive training with AI patients, step-by-step workups, and full diagnosis mode",
                tags: ["AI Patients", "Training", "Scoring"],
                gradient: "from-purple-500 via-violet-500 to-fuchsia-500",
                glow: "rgba(139, 92, 246, 0.25)"
              },
              { 
                icon: Trophy, 
                title: "Gamified Learning", 
                desc: "Pixel Doctor game, achievements, XP progression, and skill building",
                tags: ["Pixel Doctor", "Achievements", "XP System"],
                gradient: "from-pink-500 via-rose-500 to-red-500",
                glow: "rgba(236, 72, 153, 0.25)"
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.04, y: -10 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.glow}, transparent)`,
                    filter: "blur(25px)",
                  }}
                />
                <div 
                  className={`relative bg-gradient-to-br ${pillar.gradient} rounded-3xl p-7 text-white shadow-2xl overflow-hidden h-full`}
                  style={{
                    boxShadow: `0 30px 60px -15px ${pillar.glow}`
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
                    }}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-white dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 shadow-xl"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <pillar.icon className="h-8 w-8 text-white drop-shadow-md" />
                    </motion.div>
                    <h3 className="text-xl font-black mb-3 drop-shadow-sm">{pillar.title}</h3>
                    <p className="text-white/90 text-sm mb-5 leading-relaxed font-medium">{pillar.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.tags.map(tag => (
                        <span key={tag} className="bg-white dark:bg-slate-900/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
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

      {/* Quick Access - Explore All Features */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.97) 100%)",
        }}
        data-testid="section-quick-access"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
          {[...Array(8)].map((_, i) => (
            <FloatingParticle key={`qa-${i}`} delay={i * 2} duration={20} size={2 + Math.random() * 2} />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 px-5 py-2.5 rounded-full font-bold text-sm mb-5 border border-emerald-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-4 w-4" />
              Quick Access
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-white">Explore All </span>
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
            <p className="text-gray-400 font-medium max-w-lg mx-auto">
              Sign in to unlock powerful AI tools for medical bill analysis, diagnostics, and more
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: HomeIcon, label: "Dashboard", href: "/api/login", description: "Your command center", gradient: "from-blue-500 to-indigo-600" },
              { icon: Brain, label: "Bill AI", href: "/api/login?redirect=/bill-ai", description: "Find overcharges", gradient: "from-emerald-500 to-teal-600" },
              { icon: Shield, label: "Rights Hub", href: "/api/login?redirect=/rights-hub", description: "Know your rights", gradient: "from-blue-500 to-cyan-600", featured: true },
              { icon: Heart, label: "Emergency Help", href: "/api/login?redirect=/emergency-help", description: "Crisis assistance", gradient: "from-red-500 to-pink-600" },
              { icon: Search, label: "Quick Analyzer", href: "/api/login?redirect=/quick-analyzer", description: "Fast bill scan", gradient: "from-purple-500 to-violet-600" },
              { icon: Phone, label: "Provider Contacts", href: "/api/login?redirect=/provider-contacts", description: "Hospital database", gradient: "from-orange-500 to-amber-600" },
              { icon: Crown, label: "Premium", href: "/api/login?redirect=/premium", description: "Upgrade account", gradient: "from-amber-500 to-yellow-500" },
              { icon: Gamepad2, label: "Pixel Doctor", href: "/api/login?redirect=/pixel-game", description: "Fun diagnostics", gradient: "from-pink-500 to-rose-600", special: true },
              { icon: TrendingDown, label: "Reduction Guide", href: "/api/login?redirect=/bill-reduction-guide", description: "Expert strategies", gradient: "from-teal-500 to-green-600" },
              { icon: Download, label: "Get Bills", href: "/api/login?redirect=/portal-access-guide", description: "Portal access", gradient: "from-slate-500 to-gray-600" },
              { icon: Database, label: "Resources Hub", href: "/api/login?redirect=/resources-hub", description: "Guides & templates", gradient: "from-indigo-500 to-purple-600" },
              { icon: Stethoscope, label: "Diagnostics", href: "/api/login?redirect=/patient-diagnostics", description: "AI training", gradient: "from-cyan-500 to-blue-600" },
              { icon: Dna, label: "LunaFold", href: "/api/login?redirect=/lunafold", description: "Protein analysis", gradient: "from-violet-500 to-purple-600" },
              { icon: Target, label: "Industry Secrets", href: "/api/login?redirect=/industry-insights", description: "Insider tactics", gradient: "from-rose-500 to-red-600" },
              { icon: FileText, label: "Templates", href: "/api/login?redirect=/templates", description: "Dispute letters", gradient: "from-green-500 to-emerald-600" },
              { icon: Trophy, label: "Achievements", href: "/api/login?redirect=/achievements", description: "Your progress", gradient: "from-yellow-500 to-orange-600" },
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
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur-lg transition-opacity duration-300" 
                  style={{ background: `linear-gradient(135deg, ${item.gradient.includes('emerald') ? '#10b981' : item.gradient.includes('purple') ? '#8b5cf6' : item.gradient.includes('blue') ? '#3b82f6' : '#f59e0b'}, transparent)` }}
                />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 h-full">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-emerald-300 transition-colors">{item.label}</h3>
                  <p className="text-xs text-gray-400">{item.description}</p>
                  {(item.featured || item.special) && (
                    <motion.div
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full ${item.special ? 'bg-pink-500' : 'bg-emerald-500'}`}
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/30 transition-all"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-signin-quickaccess"
            >
              <ExternalLink className="h-5 w-5" />
              Sign In to Access All Features
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" data-testid="section-how-it-works">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(239,246,255,0.8) 0%, rgba(255,255,255,1) 50%, rgba(240,253,244,0.6) 100%)",
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-3 rounded-full font-bold text-sm mb-6 shadow-xl border border-emerald-200/50"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-4 w-4" />
                Simple 3-Step Process
              </motion.span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
              How GoldRock Health Works
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold max-w-2xl mx-auto">
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
                gradient: "from-blue-600 to-indigo-600",
                glow: "rgba(59, 130, 246, 0.2)"
              },
              {
                step: "2",
                icon: Brain,
                title: "AI Analyzes Everything",
                description: "Detects billing errors, overcharges, and negotiation opportunities",
                gradient: "from-purple-600 to-pink-600",
                glow: "rgba(139, 92, 246, 0.2)"
              },
              {
                step: "3",
                icon: FileCheck,
                title: "Get Professional Help",
                description: "Dispute letters, negotiation scripts, and expert coaching",
                gradient: "from-emerald-600 to-teal-600",
                glow: "rgba(16, 185, 129, 0.2)"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -12 }}
                className="relative group"
                data-testid={`card-step-${step.step}`}
              >
                <motion.div
                  className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${step.glow}, transparent)`,
                    filter: "blur(25px)",
                  }}
                />
                <GlassmorphicCard className="rounded-3xl h-full">
                  <div className="relative p-8">
                    <div className="absolute top-6 right-6 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-2xl font-black text-white">{step.step}</span>
                    </div>

                    <motion.div 
                      className={`w-18 h-18 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}
                      style={{ width: 72, height: 72, boxShadow: `0 15px 30px -5px ${step.glow}` }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <step.icon className="h-9 w-9 text-white" strokeWidth={2.5} />
                    </motion.div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{step.title}</h3>
                    <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{step.description}</p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden" id="features" data-testid="section-core-features">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-0 right-0" 
            color1="rgba(139, 92, 246, 0.08)" 
            color2="rgba(59, 130, 246, 0.03)" 
            size={400}
            blur={100}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
              Complete Medical Bill Arsenal
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold max-w-3xl mx-auto">
              Everything you need to fight medical bills and save thousands
            </p>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-10"
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
                color="from-purple-600 via-indigo-600 to-blue-600"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Zap}
                title="Quick Analyzer"
                description="Instant 5-minute bill scan for fast overcharge detection and immediate insights"
                color="from-cyan-600 via-teal-600 to-emerald-600"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Calculator}
                title="Error Detection Engine"
                description="Advanced algorithms detect duplicate charges, upcoding, unbundling fraud, and timing discrepancies"
                color="from-orange-600 via-amber-600 to-yellow-600"
                delay={0.2}
              />
            </div>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-10"
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
                color="from-emerald-600 to-teal-600"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Target}
                title="Negotiation Coaching"
                description="Proven scripts, timing strategies, and escalation tactics"
                color="from-blue-600 to-cyan-600"
                delay={0.05}
              />
              <PremiumFeatureCard
                icon={Clock}
                title="Timing Optimizer"
                description="Best times to negotiate based on revenue cycle pressure points"
                color="from-indigo-600 to-purple-600"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Phone}
                title="Provider Contact Database"
                description="Direct billing department contacts for every major hospital system"
                color="from-pink-600 to-rose-600"
                delay={0.15}
              />
            </div>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-10"
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
                color="from-blue-600 to-indigo-600"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Shield}
                title="Insurance Denials Intelligence"
                description="Denial codes, reversal strategies, and appeal letter generators"
                color="from-purple-600 to-pink-600"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Scale}
                title="Rights Hub"
                description="Know your patient rights under No Surprises Act, EMTALA, and state laws"
                color="from-emerald-600 to-teal-600"
                delay={0.2}
              />
            </div>
          </div>

          <div className="mb-16">
            <motion.h3 
              className="text-2xl font-black text-gray-900 dark:text-white mb-10"
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
                color="from-orange-600 to-amber-600"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Database}
                title="Best Practices"
                description="Field-tested negotiation scripts from successful bill reductions"
                color="from-teal-600 to-cyan-600"
                delay={0.05}
              />
              <PremiumFeatureCard
                icon={Book}
                title="Complete Guides"
                description="Comprehensive step-by-step resources for every situation"
                color="from-violet-600 to-purple-600"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Activity}
                title="Analytics Dashboard"
                description="Track your progress and monitor potential savings across all bills"
                color="from-rose-600 to-pink-600"
                delay={0.15}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden" data-testid="section-pricing">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.9) 50%, rgba(254,215,170,0.85) 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-1/4 -left-20" 
            color1="rgba(245, 158, 11, 0.2)" 
            color2="rgba(249, 115, 22, 0.08)" 
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
                  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(239, 68, 68, 0.3))",
                  filter: "blur(20px)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Crown className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black mb-6"
              style={{
                background: "linear-gradient(135deg, #b45309 0%, #c2410c 50%, #b91c1c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Premium Access
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold mb-10 leading-relaxed max-w-2xl mx-auto">
              Full AI analysis, dispute templates, expert coaching & insider tactics
            </p>

            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 border border-amber-200/50 shadow-xl">
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
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl'
                        : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:text-white'
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
                  <span className="text-6xl font-black text-gray-900 dark:text-white">
                    {pricingTab === 'monthly' && '$25'}
                    {pricingTab === 'annual' && '$249'}
                    {pricingTab === 'lifetime' && '$747'}
                  </span>
                  <span className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
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
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
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
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-base text-gray-700 dark:text-gray-200 font-semibold">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/premium">
              <motion.a
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black text-lg rounded-2xl relative overflow-hidden group"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.4)"
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-upgrade-premium-main"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
                <Crown className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Upgrade to Premium</span>
                <Sparkles className="h-5 w-5 relative z-10" />
              </motion.a>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-6 font-medium">
              Cancel anytime • Full refund within 30 days
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700 dark:text-gray-200 font-medium"
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
                a: "Upload your medical bill and our AI analyzes it for billing errors, overcharges, and negotiation opportunities. You'll receive a detailed analysis, legal dispute templates, and expert negotiation strategies to reduce your bill by 40-90%."
              },
              {
                q: "How much can I save on my medical bills?",
                a: "Users typically report savings between $2,000-$35,000+ depending on their bill size. Our AI identifies billing errors, coding mistakes, and negotiation opportunities that most people miss."
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
                    <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-start gap-4 text-lg">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      </motion.div>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed pl-12 font-medium">{faq.a}</p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(236, 253, 245, 0.9) 0%, rgba(204, 251, 241, 0.8) 50%, rgba(207, 250, 254, 0.9) 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.5} duration={16} size={2 + Math.random() * 3} />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-black mb-6"
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
          <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold max-w-xl mx-auto mb-10">
            Professional AI analysis & expert strategies to help you save thousands
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/bill-ai">
              <motion.a
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-black text-lg rounded-2xl relative overflow-hidden group"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4)"
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-start-analysis-final"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
                <Zap className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Start Free Bill Analysis</span>
                <ArrowRight className="h-6 w-6 relative z-10" />
              </motion.a>
            </Link>

            <Link href="/premium">
              <motion.a
                className="inline-flex items-center gap-2 px-10 py-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-300 text-emerald-700 font-black text-lg rounded-2xl shadow-xl"
                whileHover={{ scale: 1.03, y: -2 }}
                data-testid="button-view-premium-final"
              >
                <Crown className="h-5 w-5" />
                View Premium Plans
                <ChevronRight className="h-5 w-5" />
              </motion.a>
            </Link>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-base text-gray-600 dark:text-gray-300 mt-10 font-medium"
          >
            🔒 Private & Secure • ⚡ AI-Powered • ⚖️ Legal Templates
          </motion.p>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">GoldRock Health</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/privacy-policy">
                <a className="text-gray-400 hover:text-emerald-400 transition-colors" data-testid="footer-link-privacy-landing">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms-of-service">
                <a className="text-gray-400 hover:text-emerald-400 transition-colors" data-testid="footer-link-terms-landing">
                  Terms of Service
                </a>
              </Link>
              <Link href="/support">
                <a className="text-gray-400 hover:text-emerald-400 transition-colors" data-testid="footer-link-support-landing">
                  Support
                </a>
              </Link>
              <a 
                href="mailto:contact@goldrock.ai" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                data-testid="footer-link-email-landing"
              >
                Contact
              </a>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
            <p className="mb-1">Educational use only. Not for clinical diagnosis or treatment decisions. Not medical, legal, or financial advice.</p>
            <p>&copy; {new Date().getFullYear()} Eldest AI LLC dba GoldRock AI. All rights reserved. • Colorado, USA</p>
          </div>
        </div>
      </footer>

      {/* Pre-Login Bottom Navigation Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100/95 backdrop-blur-xl border-t border-gray-200/50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { id: "home", label: "Home", icon: HomeIcon, href: "/api/login", color: "#3B82F6" },
            { id: "billai", label: "Bill AI", icon: FileText, href: "/api/login?redirect=/bill-ai", color: "#8B5CF6" },
            { id: "diagnostics", label: "Diagnose", icon: Brain, href: "/api/login?redirect=/patient-diagnostics", color: "#14B8A6" },
            { id: "clinical", label: "Clinical", icon: Stethoscope, href: "/api/login?redirect=/clinical-command-center", color: "#6366F1" },
            { id: "lunafold", label: "LunaFold", icon: Dna, href: "/api/login?redirect=/lunafold", color: "#06B6D4" },
            { id: "premium", label: "Premium", icon: Crown, href: "/api/login?redirect=/premium", color: "#F59E0B", special: true },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-0 flex-1 p-2 rounded-3xl transition-all duration-300 bg-white dark:bg-slate-900/80"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                data-testid={`prelogin-nav-${item.id}`}
              >
                <motion.div className="relative">
                  <Icon 
                    className="h-6 w-6 mb-1"
                    style={{ color: item.color }}
                  />
                  {item.special && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                    >
                      <Sparkles className="h-3 w-3" />
                    </motion.div>
                  )}
                </motion.div>
                <span className="text-sm font-medium leading-none truncate" style={{ color: '#374151' }}>
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
