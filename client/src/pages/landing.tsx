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
  BadgeCheck
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  
  return (
    <MobileLayout title="GoldRock AI" showBottomNav={true}>
      {/* 🔥 ELITE HERO SECTION - Premium iOS Design */}
      <motion.div 
        className="text-center py-12 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, -25, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-400/15 via-indigo-400/15 to-blue-400/15 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </div>
        
        {/* Premium App Icon with Micro-Interactions */}
        <motion.div 
          className="relative mx-auto mb-6"
          style={{ width: 'fit-content' }}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.2,
            type: "spring",
            stiffness: 120,
            damping: 10
          }}
        >
          {/* Animated Ring */}
          <motion.div
            className="absolute inset-0 -m-3 rounded-[2.5rem]"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.4), rgba(251,146,60,0.4), rgba(16,185,129,0.4))',
              filter: 'blur(8px)',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div 
            className="relative w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 rounded-[2.25rem] flex items-center justify-center shadow-2xl shadow-amber-500/30 overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glass Layer */}
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] backdrop-blur-sm" />
            
            {/* Icon */}
            <DollarSign className="text-white text-3xl relative z-10 drop-shadow-lg" strokeWidth={3} />
            
            {/* Sparkle Effects */}
            <motion.div 
              className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg"
              animate={{ 
                y: [-8, 8, -8],
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-1 -left-2 w-2.5 h-2.5 bg-gradient-to-r from-emerald-300 to-cyan-400 rounded-full shadow-lg"
              animate={{ 
                y: [6, -6, 6],
                scale: [0.8, 1.3, 0.8],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </motion.div>
        
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-[1.1] tracking-tight">
            <motion.span 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent inline-block"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Cut Medical Bills
            </motion.span>
            <br />
            <span className="text-gray-900">by 40-90%</span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 rounded-full px-5 py-2.5 mb-4 shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-base font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent">
              Users Report Avg Savings: $2,000-$35,000+
            </span>
          </motion.div>
        </motion.div>
        
        {/* Value Proposition - Clear & Compelling */}
        <motion.p 
          className="text-lg text-gray-700 mb-6 max-w-md mx-auto leading-relaxed font-semibold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          AI scans your medical bills for errors, generates legal dispute letters, and reveals insider hospital negotiation tactics
        </motion.p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-6 flex-wrap"
        >
          <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-md">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-md">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-gray-800">Bank-Level Security</span>
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div 
          className="space-y-3 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <Link href="/bill-ai">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              data-testid="button-analyze-bill-hero"
            >
              <MobileButton className="w-full shadow-2xl shadow-emerald-500/40 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Receipt className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">Start Free Analysis</span>
                <ArrowRight className="h-5 w-5 ml-2 relative z-10" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-xs text-gray-500 mt-3"
        >
          No credit card required • Free to analyze
        </motion.p>
      </motion.div>

      {/* 💎 FEATURED RESOURCES - DoNotPay Style */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-8 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50"
      >
        <div className="text-center mb-6">
          <motion.h2 
            className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Bill Reduction Toolkit
          </motion.h2>
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full mx-auto mb-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <p className="text-gray-600 font-medium">
            Everything you need to fight medical bills
          </p>
        </div>

        {/* Quick Actions - Enhanced Glassmorphism */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-w-3xl mx-auto">
          {[
            { icon: Zap, label: "Quick Analyzer", path: "/quick-analyzer", color: "from-blue-600 to-indigo-600", bgColor: "from-blue-50 to-indigo-50" },
            { icon: FileText, label: "Templates", path: "/templates", color: "from-emerald-600 to-teal-600", bgColor: "from-emerald-50 to-teal-50" },
            { icon: Target, label: "Guides", path: "/resources-hub", color: "from-cyan-600 to-sky-600", bgColor: "from-cyan-50 to-sky-50" },
            { icon: Brain, label: "Industry Secrets", path: "/industry-insights", color: "from-amber-600 to-orange-600", bgColor: "from-amber-50 to-orange-50" },
            { icon: Shield, label: "Denials Intel", path: "/insurance-denials", color: "from-red-600 to-pink-600", bgColor: "from-red-50 to-pink-50" },
            { icon: Award, label: "Case Studies", path: "/bill-best-practices", color: "from-indigo-600 to-purple-600", bgColor: "from-indigo-50 to-purple-50" }
          ].map((item, index) => (
            <Link key={item.label} href={item.path}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 350,
                  damping: 25
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`relative overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/40 rounded-2xl p-4 text-center h-full shadow-xl hover:shadow-2xl transition-all duration-300 group`}>
                  {/* Glassmorphic overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-40 pointer-events-none`} />
                  
                  {/* Inset ring */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm leading-tight">{item.label}</h3>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Popular Resources */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Most Popular
          </h3>

          {[
            { title: "Complete Bill Reduction Guide", desc: "Step-by-step guide to reducing bills 40-90%", path: "/bill-reduction-guide", icon: Target, savings: "$2K-$35K+", color: "from-emerald-600 to-teal-600" },
            { title: "Industry Insider Secrets", desc: "Hospital revenue cycles, markup schemes, tactics", path: "/industry-insights", icon: Brain, savings: "$5K-$15K", color: "from-amber-600 to-orange-600" },
            { title: "Premium Dispute Templates", desc: "Professional letters with legal citations", path: "/templates", icon: FileText, badge: "Premium", color: "from-purple-600 to-indigo-600" }
          ].map((resource, index) => (
            <Link key={resource.title} href={resource.path}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: 0.1 + index * 0.08, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 350,
                  damping: 25
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block"
              >
                <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl border border-white/40 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white/20 to-transparent pointer-events-none" />
                  
                  {/* Inset ring */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-emerald-100/30 pointer-events-none" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <resource.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-sm mb-0.5">{resource.title}</h4>
                      <p className="text-xs text-gray-600">{resource.desc}</p>
                      {resource.savings && (
                        <span className="inline-block text-xs font-black text-emerald-700 mt-1">
                          💰 Potential: {resource.savings}
                        </span>
                      )}
                      {resource.badge && (
                        <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold mt-1">
                          {resource.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

          <Link href="/resources-hub">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MobileButton className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg mt-2" data-testid="button-all-resources">
                <ArrowRight className="h-4 w-4 mr-2" />
                View All Resources & Guides
                <ChevronRight className="h-4 w-4 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* 🎯 HOW IT WORKS - Visual Step Flow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-8"
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <p className="text-gray-600 font-medium max-w-sm mx-auto">
            4 simple steps to massive bill savings
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 hidden md:block" />
          
          {[
            { 
              step: 1, 
              icon: Upload, 
              title: "Upload Your Bill", 
              desc: "Take photo or upload PDF of medical bill",
              color: "from-indigo-500 to-purple-600",
              delay: 0.1
            },
            { 
              step: 2, 
              icon: Brain, 
              title: "AI Scans for Errors", 
              desc: "GPT-4o Vision analyzes every line item for overcharges",
              color: "from-purple-500 to-pink-600",
              delay: 0.2
            },
            { 
              step: 3, 
              icon: FileCheck, 
              title: "Get Dispute Letters", 
              desc: "Legal templates with citations (87-94% success rates)",
              color: "from-pink-500 to-rose-600",
              delay: 0.3
            },
            { 
              step: 4, 
              icon: Send, 
              title: "Negotiate & Win", 
              desc: "Use insider tactics to negotiate with hospitals",
              color: "from-rose-500 to-red-600",
              delay: 0.4
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.5 }}
              >
                <MobileCard className="backdrop-blur-xl border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    {/* Step Number Badge */}
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                      <Icon className="h-8 w-8 text-white relative z-10" strokeWidth={2.5} />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-black text-gray-900">{step.step}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-700 leading-snug font-medium">{step.desc}</p>
                    </div>
                  </div>
                </MobileCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 💎 FEATURES SHOWCASE - What You Get */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-8"
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h2>
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full mx-auto mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <p className="text-gray-600 font-medium max-w-sm mx-auto">
            Everything you need to fight overcharges
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-4">
          {[
            { 
              icon: Brain, 
              title: "AI Bill Scanner", 
              desc: "GPT-4o Vision analysis", 
              color: "from-purple-500 to-indigo-600",
              delay: 0.1
            },
            { 
              icon: FileText, 
              title: "Dispute Templates", 
              desc: "Legal-grade letters", 
              color: "from-emerald-500 to-teal-600",
              delay: 0.15
            },
            { 
              icon: Target, 
              title: "Insider Tactics", 
              desc: "Hospital secrets", 
              color: "from-orange-500 to-red-600",
              delay: 0.2
            },
            { 
              icon: MessageCircle, 
              title: "Expert Coaching", 
              desc: "1-on-1 guidance", 
              color: "from-blue-500 to-cyan-600",
              delay: 0.25
            },
            { 
              icon: Calculator, 
              title: "Price Database", 
              desc: "Fair rate lookup", 
              color: "from-pink-500 to-rose-600",
              delay: 0.3
            },
            { 
              icon: Clock, 
              title: "Timing Strategy", 
              desc: "Perfect negotiation timing", 
              color: "from-amber-500 to-orange-600",
              delay: 0.35
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: feature.delay, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 350,
                  damping: 25
                }}
                data-testid={`feature-${index}`}
              >
                <Link href="/premium">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="h-36 backdrop-blur-xl bg-white/90 border border-white/40 rounded-2xl shadow-lg cursor-pointer overflow-hidden group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      {/* Inset ring */}
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                      
                      <div className="flex flex-col items-center justify-center h-full space-y-2 relative z-10 text-center px-3">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                          <Icon className="h-6 w-6 text-white relative z-10" strokeWidth={2.5} />
                        </motion.div>
                        <div>
                          <h3 className="font-black text-gray-900 text-sm leading-tight mb-0.5">{feature.title}</h3>
                          <p className="text-xs text-gray-600 font-medium">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Highlight Cards */}
        <div className="space-y-3 max-w-md mx-auto">
          {[
            { 
              icon: Search, 
              title: "95% Error Detection Rate", 
              desc: "AI scans for duplicate charges, upcoding, phantom billing, and 14+ other error types",
              stat: "14+ error types",
              color: "red",
              delay: 0.4
            },
            { 
              icon: FileCheck, 
              title: "Legal Dispute Templates", 
              desc: "87-94% success rates with federal citations (No Surprises Act, EMTALA, FDCPA)",
              stat: "87-94% success",
              color: "emerald",
              delay: 0.45
            },
            { 
              icon: ShieldCheck, 
              title: "Industry Insider Secrets", 
              desc: "End-of-month quotas, Q4 charity care timing, auto write-off thresholds revealed",
              stat: "Exclusive intel",
              color: "purple",
              delay: 0.5
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: feature.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 350,
                  damping: 25
                }}
              >
                <Link href="/bill-ai">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-4 shadow-xl cursor-pointer overflow-hidden group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        feature.color === 'red' ? 'from-red-500/10 to-orange-500/10' :
                        feature.color === 'emerald' ? 'from-emerald-500/10 to-teal-500/10' :
                        'from-purple-500/10 to-indigo-500/10'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Inset ring */}
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${
                            feature.color === 'red' ? 'from-red-500 to-orange-600' :
                            feature.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                            'from-purple-500 to-indigo-600'
                          } rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden flex-shrink-0`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                          <Icon className="h-7 w-7 text-white relative z-10" strokeWidth={2.5} />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-black text-gray-900 text-base leading-tight">{feature.title}</h3>
                            <span className={`px-2 py-0.5 bg-gradient-to-r ${
                              feature.color === 'red' ? 'from-red-100 to-orange-100 text-red-700 border-red-200' :
                              feature.color === 'emerald' ? 'from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200' :
                              'from-purple-100 to-indigo-100 text-purple-700 border-purple-200'
                            } text-xs font-bold rounded-full border whitespace-nowrap`}>
                              {feature.stat}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-snug font-medium">{feature.desc}</p>
                        </div>

                        <motion.div
                          className="flex-shrink-0"
                          whileHover={{ x: 4 }}
                        >
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 💰 PRICING CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-8"
      >
        <MobileCard className="backdrop-blur-xl border-2 border-amber-300 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-red-50/90" />
          
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <Crown className="h-8 w-8 text-white" strokeWidth={3} />
            </motion.div>

            <h3 className="text-2xl font-black bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent mb-2">
              Premium Access
            </h3>
            
            <p className="text-gray-700 font-semibold mb-4 leading-relaxed">
              Full AI analysis, dispute templates, expert coaching & insider tactics
            </p>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-200">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl font-black text-gray-900">$29.99</span>
                <span className="text-gray-600 font-semibold">/month</span>
              </div>
              <div className="text-sm text-emerald-700 font-bold flex items-center justify-center gap-1">
                <BadgeCheck className="h-4 w-4" />
                Save $2,000-$35,000+ on bills
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2 mb-6 text-left max-w-xs mx-auto">
              {[
                "Unlimited bill analyses",
                "AI error detection scanner",
                "Legal dispute letter templates",
                "Industry insider tactics",
                "Expert negotiation coaching",
                "Medicare rate comparisons"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/premium">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                data-testid="button-upgrade-premium-main"
              >
                <MobileButton className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 shadow-2xl shadow-amber-500/40 text-lg py-5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Crown className="h-6 w-6 mr-2 relative z-10" />
                  <span className="relative z-10">Upgrade to Premium</span>
                  <Sparkles className="h-5 w-5 ml-2 relative z-10" />
                </MobileButton>
              </motion.div>
            </Link>

            <p className="text-xs text-gray-600 mt-3 font-medium">
              Cancel anytime • Full refund within 30 days
            </p>
          </div>
        </MobileCard>
      </motion.div>

      {/* 💝 DONATION SECTION */}
      <motion.div 
        className="px-4 mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <DonationButton variant="default" />
      </motion.div>

      {/* 🚀 FINAL CTA - Multiple Entry Points */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 py-8 pb-12"
      >
        <div className="text-center mb-6">
          <motion.h2 
            className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Save Thousands?
          </motion.h2>
          <p className="text-gray-600 font-semibold max-w-sm mx-auto">
            Join users saving $2,000-$35,000+ on medical bills
          </p>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <Link href="/bill-ai">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              data-testid="button-start-analysis-final"
            >
              <MobileButton className="w-full shadow-2xl shadow-emerald-500/40 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Zap className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">Start Free Bill Analysis</span>
                <ArrowRight className="h-5 w-5 ml-2 relative z-10" />
              </MobileButton>
            </motion.div>
          </Link>

          <Link href="/premium">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              data-testid="button-view-premium-final"
            >
              <MobileButton variant="secondary" className="w-full border-2 border-emerald-300 hover:border-emerald-400 text-emerald-700 hover:text-emerald-800 shadow-lg">
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
          className="text-center text-sm text-gray-500 mt-6 font-medium"
        >
          🔒 HIPAA Compliant • 🏦 Bank-Level Security • ⚖️ Legal Templates
        </motion.p>
      </motion.div>
    </MobileLayout>
  );
}
