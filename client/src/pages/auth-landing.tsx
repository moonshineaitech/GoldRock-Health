import { LandingNavigation } from "@/components/landing-navigation";
import { Apple, Mail, Sparkles, Shield, DollarSign, Zap, Brain, Heart, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function AuthLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-20">
      <LandingNavigation />
      
      {/* Premium iOS Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-32 pb-16 max-w-md mx-auto">
        
        {/* Elite iOS App Icon */}
        <motion.div 
          className="relative mx-auto mb-8"
          style={{ width: 'fit-content' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          {/* Animated glow ring */}
          <motion.div
            className="absolute inset-0 -m-4 rounded-[3rem]"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,146,60,0.3), rgba(16,185,129,0.3))',
              filter: 'blur(20px)',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div 
            className="relative w-28 h-28 bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-500 rounded-[2.75rem] flex items-center justify-center shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
            <DollarSign className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" strokeWidth={2.5} />
            
            {/* Sparkle accents */}
            <motion.div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-emerald-300 to-cyan-400 rounded-full"
              animate={{ 
                scale: [0.8, 1.4, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.div>
        </motion.div>

        {/* Premium Headline */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <h1 className="text-5xl font-black mb-4 leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Reduce
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Medical Bills
            </span>
          </h1>
          
          {/* Savings badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-xl shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-900">
              Save 40-90% on Average
            </span>
          </motion.div>
          
          <motion.p 
            className="text-base text-gray-600 mt-6 leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            AI-powered analysis finds errors and overcharges. Get professional dispute letters instantly.
          </motion.p>
        </motion.div>

        {/* Premium Login Buttons */}
        <motion.div 
          className="space-y-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {[
            { href: "/api/login", icon: Apple, text: "Continue with Apple", bg: "bg-black", textColor: "text-white", testId: "button-login-apple" },
            { href: "/api/login", icon: null, text: "Continue with Google", bg: "bg-white border border-gray-300", textColor: "text-gray-900", testId: "button-login-google", isGoogle: true },
            { href: "/api/login", icon: Mail, text: "Continue with Email", bg: "bg-gray-50 border border-gray-300", textColor: "text-gray-900", testId: "button-login-email" }
          ].map((btn, index) => (
            <motion.a
              key={btn.text}
              href={btn.href}
              className={`block group ${btn.bg} ${btn.textColor} rounded-[1.125rem] px-6 py-3.5 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all font-semibold relative overflow-hidden`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              data-testid={btn.testId}
            >
              {btn.isGoogle ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              ) : btn.icon && <btn.icon className="h-5 w-5" strokeWidth={2} />}
              <span>{btn.text}</span>
            </motion.a>
          ))}
          
          <p className="text-xs text-gray-500 text-center pt-2 font-medium">
            Free to start • No credit card required
          </p>
        </motion.div>

        {/* Elite Feature Cards */}
        <motion.div 
          className="space-y-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          {[
            { icon: Brain, title: "AI Bill Analysis", desc: "Finds errors instantly", gradient: "from-blue-500 to-indigo-600" },
            { icon: Shield, title: "Expert Dispute Letters", desc: "Professional templates", gradient: "from-purple-500 to-pink-600" },
            { icon: Zap, title: "Negotiation Strategy", desc: "Proven tactics", gradient: "from-emerald-500 to-teal-600" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-[1rem] flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <feature.icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600 font-medium">{feature.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" strokeWidth={2} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gray-50/80 backdrop-blur-sm border border-gray-200/50">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">Secure</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">Private</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-gray-700 font-semibold underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-gray-700 font-semibold underline">Privacy Policy</Link>
          </p>
          
          <p className="text-xs text-gray-400 font-medium">
            © 2025 GoldRock Health
          </p>
        </motion.div>
      </div>
    </div>
  );
}
