import { MobileButton } from "@/components/mobile-layout";
import { Apple, Mail, ArrowRight, Shield, DollarSign, Users, CheckCircle, Star, Award, Zap, Heart, TrendingDown, Target, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function AuthLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${i % 3 === 0 ? '3' : i % 2 === 0 ? '2' : '1'} h-${i % 3 === 0 ? '3' : i % 2 === 0 ? '2' : '1'} bg-gradient-to-r ${
              i % 4 === 0 ? 'from-blue-400/40 to-indigo-400/40' :
              i % 4 === 1 ? 'from-emerald-400/40 to-teal-400/40' :
              i % 4 === 2 ? 'from-amber-400/40 to-orange-400/40' :
              'from-purple-400/40 to-pink-400/40'
            } rounded-full blur-sm`}
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, (i % 2 === 0 ? 50 : -50), 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 10 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12">
        
        {/* App Logo & Branding */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="relative w-24 h-24 mx-auto mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            
            {/* Main icon */}
            <div className="relative w-full h-full bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/50">
              <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-sm"></div>
              <Shield className="h-12 w-12 text-white relative z-10" />
              
              {/* Sparkle effects */}
              <motion.div 
                className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full shadow-lg"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-1 -left-2 w-2.5 h-2.5 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full shadow-lg"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">Gold</span><span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">Rock</span> <span className="text-gray-900">Health</span>
          </motion.h1>
          
          <motion.div 
            className="max-w-lg mx-auto space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <h2 className="relative text-2xl font-black text-gray-900 leading-tight px-4 py-2">
                We Fight and Reduce<br />Medical Bills for You
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed font-medium px-2">
              Your personal AI fighter automatically battles unfair medical charges, finds hidden overcharges, and reduces your bills by <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">$2,000 - $35,000+</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Quick Value Props - Enhanced */}
        <motion.div 
          className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { icon: Shield, text: "We fight hospitals", color: "from-blue-500 to-indigo-600", glow: "shadow-blue-500/30" },
            { icon: DollarSign, text: "You save thousands", color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/30" },
            { icon: Zap, text: "Works instantly", color: "from-amber-500 to-orange-600", glow: "shadow-amber-500/30" },
            { icon: Heart, text: "100% for you", color: "from-rose-500 to-pink-600", glow: "shadow-rose-500/30" }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: 1.0 + index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-xl">
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg ${item.glow} group-hover:shadow-2xl transition-shadow`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 text-center leading-tight">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Authentication Options - Enhanced */}
        <motion.div 
          className="space-y-4 max-w-sm mx-auto w-full mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <p className="text-lg font-black text-gray-900 mb-1">Start Fighting Your Bills Now</p>
            <p className="text-sm text-gray-600 font-medium">Choose how to sign in</p>
          </div>

          {/* Apple Login - Enhanced */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block group" data-testid="button-login-apple">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-black text-white rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-2xl border border-gray-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Apple className="h-6 w-6 relative z-10" />
                  <span className="font-semibold text-lg relative z-10">Continue with Apple</span>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Google Login - Enhanced */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block group" data-testid="button-login-google">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white border-2 border-gray-200 text-gray-800 rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-xl hover:border-gray-300 transition-all overflow-hidden group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="w-6 h-6 relative z-10">
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-lg relative z-10">Continue with Google</span>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Email Login - Enhanced */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block group" data-testid="button-login-email">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-400/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Mail className="h-6 w-6 relative z-10" />
                  <span className="font-semibold text-lg relative z-10">Continue with Email</span>
                </div>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* How We Fight For You - Enhanced */}
        <motion.div 
          className="mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9, duration: 0.5 }}
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                How We Fight For You
              </h3>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-3"></div>
              <p className="text-sm text-gray-600 font-medium">Your AI fighter works 24/7 to protect your wallet</p>
            </motion.div>
          </div>

          <div className="space-y-5">
            {[
              { 
                icon: FileText, 
                title: "1. Scan Your Bill", 
                desc: "Upload your medical bill. Our AI instantly analyzes every charge, looking for errors and overcharges.",
                color: "from-blue-500 to-indigo-600",
                bgGlow: "from-blue-500/10 to-indigo-500/10"
              },
              { 
                icon: AlertTriangle, 
                title: "2. We Find Problems", 
                desc: "AI detects duplicate charges, billing errors, and inflated prices that hospitals hope you miss.",
                color: "from-red-500 to-orange-600",
                bgGlow: "from-red-500/10 to-orange-500/10"
              },
              { 
                icon: MessageSquare, 
                title: "3. We Fight Back", 
                desc: "Get professional dispute letters that legally force hospitals to respond and reduce your bill.",
                color: "from-emerald-500 to-teal-600",
                bgGlow: "from-emerald-500/10 to-teal-500/10"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className="relative group"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 2.0 + index * 0.15, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150
                }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl group-hover:shadow-2xl transition-all">
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-lg mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real Results - Enhanced */}
        <motion.div 
          className="mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <div className="relative group">
            {/* Animated glow */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-green-500/30 rounded-3xl blur-2xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            
            <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-3xl p-8 border-2 border-emerald-200/50 shadow-2xl">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] rounded-3xl"></div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-emerald-900 mb-4">
                  Real People, Real Savings
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <motion.div 
                    data-testid="stat-average-savings"
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">$8,500</div>
                      <div className="text-xs text-emerald-700 font-bold">Average Savings</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    data-testid="stat-bills-reduced"
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">2,847</div>
                      <div className="text-xs text-blue-700 font-bold">Bills Reduced</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    data-testid="stat-success-rate"
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">95%</div>
                      <div className="text-xs text-purple-700 font-bold">Success Rate</div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.7 + i * 0.1 }}
                  >
                    <Star className="h-5 w-5 text-yellow-500 fill-current drop-shadow-lg" />
                  </motion.div>
                ))}
                <span className="text-sm text-gray-700 ml-2 font-bold">Trusted by thousands</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Medical Bills Are Unfair - Enhanced */}
        <motion.div 
          className="mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <div className="relative group">
            {/* Pulsing glow */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            
            <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-red-200/50 shadow-2xl">
              <div className="text-center">
                <h3 className="text-xl font-black text-red-900 mb-6">
                  Why You Need This
                </h3>
                <div className="space-y-4 text-left">
                  {[
                    { text: "87% of medical bills contain errors", subtext: "hospitals make mistakes all the time" },
                    { text: "Hospitals charge 3-10x more", subtext: "than actual costs - they rely on you not fighting back" },
                    { text: "Most people pay without questioning", subtext: "but you don't have to" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 group hover:bg-white/80 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <CheckCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">
                        <span className="font-black text-gray-900">{item.text}</span> - {item.subtext}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <motion.div 
        className="relative z-10 px-6 pb-10 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.6 }}
      >
        {/* Trust Indicators - Enhanced */}
        <div className="flex items-center justify-center space-x-6 mb-8 flex-wrap gap-3">
          {[
            { icon: Shield, text: "Your Data Protected", color: "emerald" },
            { icon: CheckCircle, text: "100% Free to Start", color: "blue" },
            { icon: Award, text: "AI-Powered", color: "purple" }
          ].map((item, index) => (
            <motion.div 
              key={item.text}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <item.icon className={`h-5 w-5 text-${item.color}-600`} />
              <span className="text-sm font-bold text-gray-700">{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Legal & Links */}
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-indigo-600 font-bold underline hover:text-indigo-700 transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-indigo-600 font-bold underline hover:text-indigo-700 transition-colors">Privacy Policy</Link>
          </p>
          
          <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 font-medium">
            <span>© 2025 GoldRock Health</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>We Fight For You</span>
          </div>

          <motion.div 
            className="pt-3"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="text-base font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Ready to stop overpaying? Sign in now.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
