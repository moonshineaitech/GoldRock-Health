import { MobileButton } from "@/components/mobile-layout";
import { Apple, Mail, ArrowRight, Shield, DollarSign, Users, CheckCircle, Star, Award, Zap, Heart, TrendingDown, Target, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function AuthLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        
        {/* App Logo & Branding */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Gold</span><span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Rock</span> <span className="text-gray-900">Health</span>
          </motion.h1>
          
          <motion.div 
            className="max-w-lg mx-auto space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              We Fight and Reduce<br />Medical Bills for You
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              Your personal AI fighter automatically battles unfair medical charges, finds hidden overcharges, and reduces your bills by <span className="font-bold text-emerald-600">$2,000 - $35,000+</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Quick Value Props */}
        <motion.div 
          className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { icon: Shield, text: "We fight hospitals", color: "from-blue-500 to-indigo-600" },
            { icon: DollarSign, text: "You save thousands", color: "from-emerald-500 to-teal-600" },
            { icon: Zap, text: "Works instantly", color: "from-amber-500 to-orange-600" },
            { icon: Heart, text: "100% for you", color: "from-rose-500 to-pink-600" }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 1.0 + index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-2 mx-auto`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-900 text-center">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Authentication Options */}
        <motion.div 
          className="space-y-4 max-w-sm mx-auto w-full mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="text-center mb-4">
            <p className="text-base font-bold text-gray-900">Start Fighting Your Bills Now</p>
            <p className="text-sm text-gray-600">Choose how to sign in</p>
          </div>

          {/* Apple Login */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block" data-testid="button-login-apple">
              <div className="bg-black text-white rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Apple className="h-5 w-5" />
                <span className="font-semibold text-lg">Continue with Apple</span>
              </div>
            </a>
          </motion.div>

          {/* Google Login */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block" data-testid="button-login-google">
              <div className="bg-white border-2 border-gray-200 text-gray-800 rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="font-semibold text-lg">Continue with Google</span>
              </div>
            </a>
          </motion.div>

          {/* Email Login */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block" data-testid="button-login-email">
              <div className="bg-gray-100 text-gray-800 rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Mail className="h-5 w-5" />
                <span className="font-semibold text-lg">Continue with Email</span>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* How We Fight For You */}
        <motion.div 
          className="mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">
              How We Fight For You
            </h3>
            <p className="text-sm text-gray-600">Your AI fighter works 24/7 to protect your wallet</p>
          </div>

          <div className="space-y-4">
            {[
              { 
                icon: FileText, 
                title: "1. Scan Your Bill", 
                desc: "Upload your medical bill. Our AI instantly analyzes every charge, looking for errors and overcharges.",
                color: "from-blue-500 to-indigo-600"
              },
              { 
                icon: AlertTriangle, 
                title: "2. We Find Problems", 
                desc: "AI detects duplicate charges, billing errors, and inflated prices that hospitals hope you miss.",
                color: "from-red-500 to-orange-600"
              },
              { 
                icon: MessageSquare, 
                title: "3. We Fight Back", 
                desc: "Get professional dispute letters that legally force hospitals to respond and reduce your bill.",
                color: "from-emerald-500 to-teal-600"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-lg"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 2.0 + index * 0.15, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real Results */}
        <motion.div 
          className="mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-emerald-900 mb-2">
                Real People, Real Savings
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div data-testid="stat-average-savings">
                  <div className="text-3xl font-black text-emerald-700">$8,500</div>
                  <div className="text-xs text-emerald-600 font-semibold">Average Savings</div>
                </div>
                <div data-testid="stat-bills-reduced">
                  <div className="text-3xl font-black text-blue-700">2,847</div>
                  <div className="text-xs text-blue-600 font-semibold">Bills Reduced</div>
                </div>
                <div data-testid="stat-success-rate">
                  <div className="text-3xl font-black text-purple-700">95%</div>
                  <div className="text-xs text-purple-600 font-semibold">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-sm text-gray-700 ml-2 font-medium">Trusted by thousands</span>
            </div>
          </div>
        </motion.div>

        {/* Why Medical Bills Are Unfair */}
        <motion.div 
          className="mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200/50 shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-black text-red-900 mb-3">
                Why You Need This
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-bold">87% of medical bills contain errors</span> - hospitals make mistakes all the time
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-bold">Hospitals charge 3-10x more</span> than actual costs - they rely on you not fighting back
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-bold">Most people pay without questioning</span> - but you don't have to
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <motion.div 
        className="px-6 pb-8 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.6 }}
      >
        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mb-6 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-gray-700">Your Data Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">100% Free to Start</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-700">AI-Powered</span>
          </div>
        </div>

        {/* Legal & Links */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-indigo-600 font-medium underline hover:text-indigo-700">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-indigo-600 font-medium underline hover:text-indigo-700">Privacy Policy</Link>
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>© 2025 GoldRock Health</span>
            <span>•</span>
            <span>We Fight For You</span>
          </div>

          <div className="pt-2">
            <p className="text-sm text-emerald-700 font-bold">
              Ready to stop overpaying? Sign in now.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
