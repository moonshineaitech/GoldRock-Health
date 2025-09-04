import { MobileButton } from "@/components/mobile-layout";
import { Apple, Mail, ArrowRight, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
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
          
          <motion.p 
            className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Master medical diagnosis with AI-powered patient simulations
          </motion.p>
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

        {/* Features Preview */}
        <motion.div 
          className="mt-12 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "🔬", title: "60+ Cases", desc: "Medical scenarios" },
              { icon: "🤖", title: "AI-Powered", desc: "Smart simulations" },
              { icon: "🏆", title: "Progress", desc: "Track growth" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 1.2 + index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        className="px-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <p className="text-center text-sm text-gray-500 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.{" "}
          <br />
          <span className="text-indigo-600 font-medium">Start your medical training journey today.</span>
        </p>
      </motion.div>
    </div>
  );
}