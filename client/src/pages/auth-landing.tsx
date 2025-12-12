import { LandingNavigation } from "@/components/landing-navigation";
import { 
  DollarSign, Zap, Brain, FileText, Upload, Target, Shield, Code, Scale, Clock, 
  AlertTriangle, Eye, Phone, Database, Book, Receipt, Building, HandCoins, 
  Gavel, Lock, Network, Crosshair, Calculator, MessageCircle, Crown, Sparkles,
  ArrowRight, Play, FileCheck, TrendingDown, Award, BadgeCheck, ChevronRight,
  FileX, CreditCard, Wrench, Puzzle, Heart, Search, Users, Settings, BarChart3,
  Pill, Stethoscope, Activity, Microscope, Baby, Car, Home as HomeIcon, Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";

// Premium Animated Feature Card matching bill-ai page design
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`relative bg-gradient-to-br ${color} rounded-3xl p-6 shadow-2xl overflow-hidden`}>
        {/* Shimmer effect */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        />

        {/* Pulsing glow */}
        <motion.div
          animate={{ opacity: isHovered ? [0.5, 0.8, 0.5] : 0 }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          className="absolute inset-0 bg-white/20 blur-xl pointer-events-none"
        />

        <div className="relative z-10">
          <motion.div
            animate={{ 
              scale: isHovered ? [1, 1.2, 1] : 1,
              rotate: isHovered ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          >
            <Icon className="h-7 w-7 text-white drop-shadow-lg" strokeWidth={2.5} />
          </motion.div>
          <h3 className="text-xl font-black text-white mb-2 drop-shadow-md">{title}</h3>
          <p className="text-white/90 font-medium text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function AuthLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [pricingTab, setPricingTab] = useState<'monthly' | 'annual' | 'lifetime'>('monthly');

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation />
      
      {/* HERO SECTION - Ultra-premium with gradients */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-32 pb-20">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* App Icon */}
          <motion.div 
            className="relative mx-auto mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <div className="w-28 h-28 bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-500 rounded-[2.75rem] flex items-center justify-center shadow-2xl mx-auto" style={{ isolation: 'isolate' }}>
              <DollarSign className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-6 leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-900">Your Complete</span>
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 bg-clip-text text-transparent">
              Health AI Command Center
            </span>
          </motion.h1>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Bill Analysis</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-4 py-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">AI Diagnostics</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-pink-100 border border-pink-300 rounded-full px-4 py-2">
              <Stethoscope className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-bold text-pink-700">Medical Training</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-full px-4 py-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">Gamified Learning</span>
            </span>
          </motion.div>

          {/* Subheadline */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-semibold leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Reduce medical bills, master diagnostic skills, train with AI patients, and access expert health insights all in one powerful platform
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="/api/login"
              className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-emerald-500/50 overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-get-started-hero"
            >
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <div className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Start Free Analysis
                <ArrowRight className="h-6 w-6" />
              </div>
            </motion.a>
            
            <a
              href="#features"
              className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-900 font-black text-lg rounded-2xl shadow-lg hover:shadow-xl hover:border-gray-400 transition-all"
              data-testid="button-explore-features"
            >
              Explore All Features
            </a>
          </motion.div>

          <motion.p
            className="text-sm text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Free to start. Professional tools. No credit card required
          </motion.p>
        </div>
      </section>

      {/* PLATFORM OVERVIEW - Four Pillars */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50" id="features" data-testid="section-platform-overview">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm mb-4">
              <Sparkles className="h-4 w-4" />
              Complete Health AI Platform
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              More Than Just Bill Analysis
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Four powerful pillars to transform your healthcare experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Financial Defense */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-2xl"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Financial Defense</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">AI bill analysis, dispute templates, and negotiation strategies to save $2K-$35K+</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Bill AI</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Templates</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Disputes</span>
              </div>
            </motion.div>

            {/* Pillar 2: Clinical Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Clinical Intelligence</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">Health insights, medical knowledge engines, and AI-powered second opinions</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Health AI</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Insights</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Resources</span>
              </div>
            </motion.div>

            {/* Pillar 3: Diagnostic Mastery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-6 text-white shadow-2xl"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Diagnostic Mastery</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">Interactive training with AI patients, step-by-step workups, and full diagnosis mode</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">AI Patients</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Training</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Scoring</span>
              </div>
            </motion.div>

            {/* Pillar 4: Gamified Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-2xl"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Gamified Learning</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">Pixel Doctor game, achievements, XP progression, and skill building</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Pixel Doctor</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Achievements</span>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">XP System</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLINICAL COMMAND CENTER - Health Tools Showcase */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50" data-testid="section-clinical-command">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm mb-4">
              <Stethoscope className="h-4 w-4" />
              Clinical Command Center
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Understand Your Health Better
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              AI-powered tools to help you make sense of lab results, medications, symptoms, and vital signs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.a
              href="/api/login?redirect=/lab-analyzer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl block"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Lab Results Analyzer</h3>
              <p className="text-white/90 text-sm leading-relaxed">AI interprets your bloodwork and explains what your test results mean in plain language</p>
            </motion.a>

            <motion.a
              href="/api/login?redirect=/drug-interactions"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-6 text-white shadow-2xl block"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Pill className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Drug Interaction Checker</h3>
              <p className="text-white/90 text-sm leading-relaxed">Check if your medications are safe to take together using trusted drug databases</p>
            </motion.a>

            <motion.a
              href="/api/login?redirect=/symptom-checker"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-2xl block"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Symptom Checker</h3>
              <p className="text-white/90 text-sm leading-relaxed">Describe your symptoms and get AI-powered triage guidance and next steps</p>
            </motion.a>

            <motion.a
              href="/api/login?redirect=/health-metrics"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-2xl block"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Health Metrics Tracker</h3>
              <p className="text-white/90 text-sm leading-relaxed">Track blood pressure, heart rate, weight, and temperature with trend charts</p>
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <motion.a
              href="/api/login?redirect=/clinical-command-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              data-testid="button-clinical-hub"
            >
              <Stethoscope className="h-5 w-5" />
              Explore Clinical Hub
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* 3-STEP PROCESS - Glassmorphism cards */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white" data-testid="section-how-it-works">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm mb-4"
            >
              <Zap className="h-4 w-4" />
              Simple 3-Step Process
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How GoldRock Health Works
            </h2>
            <p className="text-xl text-gray-700 font-semibold max-w-2xl mx-auto">
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
                color: "from-blue-600 to-indigo-600"
              },
              {
                step: "2",
                icon: Brain,
                title: "AI Analyzes Everything",
                description: "Detects billing errors, overcharges, and negotiation opportunities",
                color: "from-purple-600 to-pink-600"
              },
              {
                step: "3",
                icon: FileCheck,
                title: "Get Professional Help",
                description: "Dispute letters, negotiation scripts, and expert coaching",
                color: "from-emerald-600 to-teal-600"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
                data-testid={`card-step-${step.step}`}
              >
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden">
                  {/* Step number badge */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-black text-white">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 font-medium leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES - Ultra-premium cards */}
      <section className="py-20 bg-white" id="features" data-testid="section-core-features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Complete Medical Bill Arsenal
            </h2>
            <p className="text-xl text-gray-700 font-semibold max-w-3xl mx-auto">
              Everything you need to fight medical bills and save thousands
            </p>
          </div>

          {/* Core Analysis Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-gray-900 mb-8">AI Analysis & Detection</h3>
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

          {/* Negotiation & Coaching */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Expert Negotiation & Coaching</h3>
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

          {/* Dispute & Legal Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Dispute Arsenal & Legal Tools</h3>
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

          {/* Knowledge & Intelligence */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Industry Intelligence & Guides</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <PremiumFeatureCard
                icon={Building}
                title="Industry Insights"
                description="Hospital billing vulnerabilities and revenue cycle weak points"
                color="from-orange-600 to-amber-600"
                delay={0}
              />
              <PremiumFeatureCard
                icon={Code}
                title="Medical Code Mastery"
                description="Decode CPT, ICD-10, and HCPCS billing codes instantly"
                color="from-cyan-600 to-blue-600"
                delay={0.05}
              />
              <PremiumFeatureCard
                icon={Receipt}
                title="Bill Reduction Guide"
                description="Step-by-step strategies from billing experts and advocates"
                color="from-purple-600 to-indigo-600"
                delay={0.1}
              />
              <PremiumFeatureCard
                icon={Eye}
                title="Portal Access Guide"
                description="Get bills before they arrive in mail from insurance portals"
                color="from-emerald-600 to-green-600"
                delay={0.15}
              />
            </div>
          </div>

          {/* Premium Advanced Tools */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl -mx-6 -my-6 p-6" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Crown className="h-8 w-8 text-amber-600" />
                <h3 className="text-2xl font-black text-gray-900">Premium Advanced Arsenal</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <PremiumFeatureCard
                  icon={Crosshair}
                  title="Hospital Insider Tactics"
                  description="Revenue cycle pressure points, authorization levels, and settlement leverage"
                  color="from-amber-600 to-orange-600"
                  delay={0}
                />
                <PremiumFeatureCard
                  icon={Gavel}
                  title="Legal Escalation Tools"
                  description="Board pressure tactics, regulatory complaints, and legal leverage strategies"
                  color="from-red-600 to-pink-600"
                  delay={0.1}
                />
                <PremiumFeatureCard
                  icon={HandCoins}
                  title="Charity Care Optimizer"
                  description="Maximize financial assistance and income-based discount programs"
                  color="from-green-600 to-emerald-600"
                  delay={0.2}
                />
                <PremiumFeatureCard
                  icon={Lock}
                  title="Policy Loophole Finder"
                  description="Exploit coverage gaps and insurance policy weaknesses"
                  color="from-indigo-600 to-purple-600"
                  delay={0}
                />
                <PremiumFeatureCard
                  icon={Network}
                  title="Revenue Cycle Exploiter"
                  description="Attack billing vulnerabilities at each of 7 revenue cycle stages"
                  color="from-blue-600 to-cyan-600"
                  delay={0.1}
                />
                <PremiumFeatureCard
                  icon={Puzzle}
                  title="50+ Specialized Workflows"
                  description="Targeted strategies for emergency, surgery, specialty care, and more"
                  color="from-pink-600 to-rose-600"
                  delay={0.2}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FEATURES LIST */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50" data-testid="section-all-features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Complete Platform Features
            </h2>
            <p className="text-xl text-gray-700 font-semibold">
              Over 50 specialized workflows and tools for every billing scenario
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Column 1: Core Features */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-600" />
                Core Features
              </h3>
              <ul className="space-y-3">
                {[
                  "AI Bill Analysis",
                  "Quick Bill Analyzer",
                  "Error Detection Engine",
                  "Analytics Dashboard",
                  "Resources Hub",
                  "Savings Calculator",
                  "Progress Tracker"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Intelligence & Strategy */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                Intelligence & Strategy
              </h3>
              <ul className="space-y-3">
                {[
                  "Industry Insights",
                  "Hospital Billing Intel",
                  "Insurance Denials Database",
                  "Medical Code Decoder",
                  "Negotiation Coaching",
                  "Timing Optimizer",
                  "Provider Contact Database"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal & Advocacy */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Legal & Advocacy
              </h3>
              <ul className="space-y-3">
                {[
                  "50+ Dispute Templates",
                  "Rights Hub (No Surprises Act)",
                  "Appeal Letter Generators",
                  "Claim Denial Reversals",
                  "Emergency Financial Help",
                  "Charity Care Applications",
                  "Board Complaint Templates"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-12">
            {/* Column 4: Guides & Education */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Book className="h-6 w-6 text-amber-600" />
                Guides & Education
              </h3>
              <ul className="space-y-3">
                {[
                  "Bill Reduction Guide",
                  "Portal Access Guide",
                  "Best Practices Library",
                  "How It Works Guide",
                  "Templates Library",
                  "Case Studies & Examples"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Specialized Workflows */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Crown className="h-6 w-6 text-purple-600" />
                Premium Workflows (50+)
              </h3>
              <ul className="space-y-3">
                {[
                  "Emergency Room Bill Analysis",
                  "Surgery & Anesthesia Review",
                  "Lab & Imaging Disputes",
                  "Pharmacy & Medication Audits",
                  "Maternity & Childbirth Claims",
                  "Specialty Care (Cardiology, Oncology, etc.)",
                  "Insurance Policy Exploitation"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-700 font-semibold">
              Everything you need to know about GoldRock Health
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does GoldRock Health work?",
                a: "Upload your medical bill and our AI analyzes it for billing errors, overcharges, and negotiation opportunities. You'll receive detailed analysis, legal dispute templates, and expert negotiation strategies to reduce your bill."
              },
              {
                q: "What types of bills can you analyze?",
                a: "We analyze all medical bills including hospital bills, emergency room visits, surgery and anesthesia, lab and imaging, pharmacy charges, specialist visits, and more. Our AI works with bills from any healthcare provider in any state."
              },
              {
                q: "Do I need insurance to use GoldRock Health?",
                a: "No! GoldRock Health works for everyone - with or without insurance. We help reduce bills from hospitals, urgent care, labs, and more. Our strategies work for both insured and uninsured patients."
              },
              {
                q: "What's included in Premium?",
                a: "Premium includes unlimited bill analyses, AI error detection, 50+ legal dispute letter templates, industry insider tactics, expert negotiation coaching, hospital billing intelligence, and specialized workflows for every type of medical bill."
              },
              {
                q: "How do the dispute templates work?",
                a: "Our professional dispute letter templates include specific regulatory citations, legal references, and proven language that hospitals respect. Simply fill in your bill details and send directly to the billing department."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your Premium subscription anytime with no penalties or fees."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                data-testid={`card-faq-${index + 1}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between group"
                  data-testid={`button-faq-toggle-${index + 1}`}
                >
                  <h3 className="font-black text-gray-900 pr-4 group-hover:text-emerald-600 transition-colors">{faq.q}</h3>
                  <ChevronRight className={`h-5 w-5 text-gray-500 transition-all ${activeFaq === index ? 'rotate-90 text-emerald-600' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" data-testid="section-pricing">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h3 className="text-4xl md:text-5xl font-black mb-4">
                Premium Access
              </h3>
              
              <p className="text-xl text-white/90 font-semibold mb-8 max-w-2xl mx-auto">
                Full AI analysis, 50+ dispute templates, expert coaching & insider tactics
              </p>

              {/* Pricing Tab Selector */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-2xl p-1.5 border border-white/30">
                  {[
                    { id: 'monthly' as const, label: 'Monthly' },
                    { id: 'annual' as const, label: 'Annual' },
                    { id: 'lifetime' as const, label: 'Lifetime' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPricingTab(tab.id)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        pricingTab === tab.id
                          ? 'bg-white text-indigo-700 shadow-lg'
                          : 'text-white/80 hover:text-white'
                      }`}
                      data-testid={`button-pricing-tab-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Display */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/30">
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-6xl font-black">
                    {pricingTab === 'monthly' && '$25'}
                    {pricingTab === 'annual' && '$249'}
                    {pricingTab === 'lifetime' && '$747'}
                  </span>
                  <span className="text-2xl font-bold">
                    {pricingTab === 'monthly' && '/month'}
                    {pricingTab === 'annual' && '/year'}
                    {pricingTab === 'lifetime' && 'one-time'}
                  </span>
                </div>
                {pricingTab === 'annual' && (
                  <p className="text-emerald-200 font-bold mb-2">
                    Save $51 per year vs monthly
                  </p>
                )}
                {pricingTab === 'lifetime' && (
                  <p className="text-emerald-200 font-bold mb-2">
                    Unlimited access forever • Best value
                  </p>
                )}
                <p className="text-white/90 font-bold">
                  Professional medical bill reduction platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  "Unlimited bill analyses",
                  "AI error detection scanner",
                  "50+ legal dispute templates",
                  "Industry insider tactics",
                  "Expert negotiation coaching",
                  "Hospital billing intelligence"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.a
                href="/api/login"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-700 font-black text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-upgrade-premium"
              >
                <Crown className="h-6 w-6" />
                Upgrade to Premium
                <Sparkles className="h-6 w-6" />
              </motion.a>

              <p className="text-white/80 mt-6 font-medium">
                Cancel anytime • No long-term commitment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white" data-testid="section-final-cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Ready to Fight Back?
          </h2>
          <p className="text-2xl text-gray-700 font-bold mb-10 max-w-2xl mx-auto">
            Start analyzing your medical bills today with professional AI-powered tools
          </p>

          <motion.a
            href="/api/login"
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-2xl rounded-2xl shadow-2xl shadow-emerald-500/50 hover:shadow-3xl transition-all"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            data-testid="button-start-analysis-final"
          >
            <Zap className="h-8 w-8" />
            Start Free Bill Analysis
            <ArrowRight className="h-8 w-8" />
          </motion.a>

          <p className="text-gray-600 mt-8 font-semibold text-lg">
            Free to start • Professional tools • Expert strategies
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <span className="font-black text-xl">GoldRock Health</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered medical bill reduction platform helping patients fight overcharges and billing errors.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition" data-testid="link-footer-features">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition" data-testid="link-footer-how-it-works">How It Works</a></li>
                <li><a href="/api/login?redirect=/premium" className="hover:text-white transition" data-testid="link-footer-pricing">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/support" className="hover:text-white transition" data-testid="link-footer-support">Support</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition" data-testid="link-footer-privacy">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition" data-testid="link-footer-terms">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/important-disclaimer" className="hover:text-white transition" data-testid="link-footer-disclaimer">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 GoldRock Health (Eldest AI LLC dba GoldRock AI). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component
function CheckCircle({ className, strokeWidth }: { className: string; strokeWidth?: number }) {
  return (
    <svg className={className} fill="none" strokeWidth={strokeWidth || 2} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
