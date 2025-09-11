import { MobileButton } from "@/components/mobile-layout";
import { Apple, Mail, ArrowRight, Stethoscope, Shield, Brain, DollarSign, Users, CheckCircle, Star, Trophy, TrendingUp, Clock, Target, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
          className="text-center mb-12"
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
            <Stethoscope className="h-10 w-10 text-white" />
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
            <p className="text-xl font-semibold text-gray-800 leading-tight">
              AI Medical Bill Advocate & Error Detection
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Professional-grade AI finds hidden billing errors and overcharges worth <span className="font-bold text-emerald-600">substantial amounts</span>. Your personal advocate for medical bill protection and potential savings.
            </p>
          </motion.div>
        </motion.div>

        {/* Authentication Options */}
        <motion.div 
          className="space-y-4 max-w-sm mx-auto w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Continue with Replit (styled as main option) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block">
              <div className="bg-black text-white rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
                <span className="font-semibold text-lg">Continue with Account</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </a>
          </motion.div>

          {/* Apple Style Button (routes to same auth) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block">
              <div className="bg-black text-white rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Apple className="h-5 w-5" />
                <span className="font-semibold text-lg">Continue with Apple</span>
              </div>
            </a>
          </motion.div>

          {/* Google Style Button (routes to same auth) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block">
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

          {/* Email Option (routes to same auth) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/api/login" className="block">
              <div className="bg-gray-100 text-gray-800 rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Mail className="h-5 w-5" />
                <span className="font-semibold text-lg">Continue with Email</span>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* Comprehensive Benefits Section */}
        <motion.div 
          className="mt-16 max-w-2xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {/* AI Bill Analysis Features */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              AI-Powered Bill Intelligence
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, title: "Instant Analysis", desc: "Seconds, not hours", gradient: "from-indigo-500 to-purple-600" },
                { icon: Target, title: "Error Detection", desc: "Professional Analysis", gradient: "from-emerald-500 to-teal-600" },
                { icon: Shield, title: "Industry Secrets", desc: "Best practices shared", gradient: "from-amber-500 to-orange-600" },
                { icon: Trophy, title: "Advanced Technology", desc: "AI-Powered Platform", gradient: "from-rose-500 to-pink-600" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 1.2 + index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Consumer Advocacy Features */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Consumer Advocacy & Savings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: DollarSign, title: "Potential Savings", desc: "Analysis per bill", gradient: "from-emerald-500 to-green-600" },
                { icon: CheckCircle, title: "Comprehensive Review", desc: "Thorough bill analysis", gradient: "from-blue-500 to-cyan-600" },
                { icon: Mail, title: "Appeal Letters", desc: "Professional drafts", gradient: "from-purple-500 to-indigo-600" },
                { icon: Users, title: "Industry Intel", desc: "Insider strategies", gradient: "from-amber-500 to-yellow-600" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 1.6 + index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social Proof & Stats */}
          <motion.div 
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, duration: 0.6 }}
          >
            <div className="text-center mb-4">
              <h4 className="font-bold text-indigo-900 text-base mb-2">Trusted by Healthcare Consumers</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-indigo-700">Most</div>
                  <div className="text-xs text-indigo-600">Bills Have Issues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700">AI</div>
                  <div className="text-xs text-emerald-600">Advanced Technology</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">Pro</div>
                  <div className="text-xs text-purple-600">Professional Grade</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-sm text-gray-700 ml-2 font-medium">Professional Grade Platform</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <motion.div 
        className="px-6 pb-8 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-gray-700">Exceeds Privacy Standards</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Medical Grade</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-700">AI-Powered</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6 border border-indigo-200/50">
          <div className="text-center">
            <h4 className="font-bold text-indigo-900 text-sm mb-2">
              💰 Stop Overpaying for Healthcare Today
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Join thousands protecting themselves from medical bill overcharges with AI-powered error detection. 
              <span className="font-semibold">Start your financial protection - completely free.</span>
            </p>
          </div>
        </div>

        {/* Legal & Links */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-indigo-600 font-medium underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="text-indigo-600 font-medium underline cursor-pointer">Privacy Policy</span>
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>© 2025 GoldRock Health</span>
            <span>•</span>
            <span>AI Bill Analysis</span>
            <span>•</span>
            <span>Consumer Advocacy</span>
          </div>

          <div className="pt-2">
            <p className="text-xs text-emerald-600 font-semibold">
              💎 Ready to uncover hidden overcharges worth thousands in your medical bills?
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}