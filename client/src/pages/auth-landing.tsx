import { MobileButton } from "@/components/mobile-layout";
import { DonationButton } from "@/components/donation-button";
import { BlitzDemo } from "@/components/blitz-demo";
import { Apple, Mail, LogIn, Menu, Shield, DollarSign, Zap, Heart, CheckCircle, Star, Crown, Sparkles, ArrowRight, Trophy, Lock, BadgeCheck, TrendingDown, Clock, ThumbsUp, AlertTriangle, FileText, MessageCircle, Upload, Brain, Send, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";

export default function AuthLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 🎨 ANIMATED BACKGROUND - Premium iOS Style */}
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

      {/* Header with Sign In */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/20 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.h1 
            className="text-lg font-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Gold</span>
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Rock</span>
            <span className="text-gray-900"> Health</span>
          </motion.h1>

          <motion.a
            href="/api/login"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="button-header-signin"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </motion.a>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-24 pb-24 max-w-4xl mx-auto">
        
        {/* 🔥 ELITE HERO SECTION */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Premium App Icon */}
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
              <div className="absolute inset-0 bg-white/20 rounded-[2rem] backdrop-blur-sm" />
              <DollarSign className="text-white text-3xl relative z-10 drop-shadow-lg" strokeWidth={3} />
              
              {/* Sparkles */}
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

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="text-4xl font-black mb-3 leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Cut Medical Bills
              </span>
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
              <span className="text-sm font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent">
                Users Report: $2,000-$35,000+ Savings
              </span>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-base text-gray-700 mb-6 max-w-lg mx-auto leading-relaxed font-semibold"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            AI scans your medical bills for errors, generates legal dispute letters, and reveals insider hospital negotiation tactics
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
        </motion.div>

        {/* 🎯 SIGN IN SECTION - MOVED ABOVE FEATURE PANELS */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Get Started with Your Bill Analysis
              </h2>
              <p className="text-gray-600 font-medium">
                Sign in to access AI-powered bill analysis
              </p>
            </div>

            <div className="space-y-3">
              {[
                { href: "/api/login", icon: Apple, text: "Continue with Apple", bg: "bg-black", textColor: "text-white", testId: "button-login-apple" },
                { href: "/api/login", icon: null, text: "Continue with Google", bg: "bg-white border-2 border-gray-200", textColor: "text-gray-800", testId: "button-login-google", isGoogle: true },
                { href: "/api/login", icon: Mail, text: "Continue with Email", bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200", textColor: "text-gray-800", testId: "button-login-email" }
              ].map((btn, index) => (
                <motion.a
                  key={btn.text}
                  href={btn.href}
                  className={`block group ${btn.bg} ${btn.textColor} rounded-2xl px-6 py-4 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all font-bold relative overflow-hidden`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={btn.testId}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {btn.isGoogle ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : btn.icon && <btn.icon className="h-5 w-5 relative z-10" />}
                  <span className="relative z-10">{btn.text}</span>
                </motion.a>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Free to start • No credit card required
            </p>
          </div>
        </motion.div>

        {/* 💎 4 FEATURE PANELS - Now BELOW login buttons */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {[
              { icon: Shield, text: "Identify billing errors", color: "from-blue-500 to-indigo-600" },
              { icon: DollarSign, text: "Find potential savings", color: "from-emerald-500 to-teal-600" },
              { icon: Zap, text: "Fast AI analysis", color: "from-amber-500 to-orange-600" },
              { icon: Heart, text: "Secure & private", color: "from-rose-500 to-pink-600" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + index * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`} />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/50 shadow-xl h-full">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                    <item.icon className="h-6 w-6 text-white relative z-10" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-black text-gray-900 text-center leading-tight">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🎬 INTERACTIVE DEMO */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              Try Real AI Analysis
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 font-medium max-w-md mx-auto">
              See how AI finds $8,700 in savings on a sample bill
            </p>
          </div>
          <BlitzDemo />
        </motion.div>

        {/* ⭐ SUCCESS STORIES */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
              Real Success Stories
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full mx-auto" />
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { 
                name: "Sarah M.",
                type: "Emergency Room",
                original: "$29,500",
                saved: "$23,000",
                percent: "78%",
                quote: "AI found overcharges I never would've spotted. Charity care approved!",
              },
              { 
                name: "Michael T.",
                type: "Surgery",
                original: "$23,600",
                saved: "$15,400",
                percent: "65%",
                quote: "No Surprises Act violation - got bill reduced to in-network rates.",
              },
            ].map((story, index) => (
              <div
                key={story.name}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/50 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{story.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{story.type}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 font-semibold mb-1">Original</div>
                      <div className="text-2xl font-black text-red-600 line-through">{story.original}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-600 font-semibold mb-1">Saved</div>
                      <div className="text-2xl font-black text-emerald-600">{story.saved}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <TrendingDown className="h-3 w-3" />
                      {story.percent} reduction
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ThumbsUp className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 italic leading-relaxed font-medium">
                    "{story.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-amber-200/50 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-amber-600" />
                <h3 className="text-lg font-black text-gray-900">Platform Statistics</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-700 mb-1">87-94%</div>
                  <div className="text-xs text-gray-600 font-semibold">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-700 mb-1">$8.5K+</div>
                  <div className="text-xs text-gray-600 font-semibold">Avg Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-700 mb-1">4-6wk</div>
                  <div className="text-xs text-gray-600 font-semibold">Avg Time</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 💝 DONATION */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          <DonationButton variant="default" />
        </motion.div>

        {/* 🚀 FINAL CTA */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            Ready to Save Thousands?
          </h2>
          <p className="text-gray-600 font-semibold mb-6 max-w-md mx-auto">
            Join users saving $2,000-$35,000+ on medical bills
          </p>

          <motion.a
            href="/api/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all relative overflow-hidden group"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            data-testid="button-final-cta"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Start Free Bill Analysis</span>
            <ArrowRight className="h-5 w-5 relative z-10" />
          </motion.a>

          <p className="text-sm text-gray-500 mt-4 font-medium">
            🔒 HIPAA Compliant • 🏦 Bank-Level Security • ⚖️ Legal Templates
          </p>
        </motion.div>

        {/* Disclaimers */}
        <motion.div
          className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <p className="text-xs text-gray-600 leading-relaxed space-y-1">
            <span className="block font-bold text-gray-700">*Important Disclaimers:</span>
            <span className="block">• Savings figures represent illustrative examples. Individual results vary.</span>
            <span className="block">• GoldRock AI is educational. Not medical/legal/financial advice.</span>
            <span className="block">• Studies suggest medical bills frequently contain errors.</span>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-xs text-gray-600">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-indigo-600 font-bold underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-indigo-600 font-bold underline">Privacy Policy</Link>
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 font-medium">
            <span>© 2025 GoldRock AI</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>We Help You Save</span>
          </div>
        </div>
      </div>
    </div>
  );
}
