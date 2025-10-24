import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, Phone, Scale, FileText, Check } from "lucide-react";

export default function ImportantDisclaimer() {
  return (
    <MobileLayout title="Important Disclaimer" showBottomNav={false}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
            <AlertTriangle className="h-8 w-8 text-white relative z-10" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Important Disclaimer</h1>
          <p className="text-gray-600 font-medium">Please read this important information carefully</p>
        </motion.div>

        {/* Educational Purpose Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 text-lg">Educational Purpose Only</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                GoldRock AI provides <strong>educational information</strong> and <strong>medical bill analysis services only</strong>. 
                This application does <strong>NOT</strong> provide medical diagnosis, treatment, or professional medical advice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Always Consult Healthcare Professionals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 text-lg">Always Consult Healthcare Professionals</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                <strong>Always consult</strong> a licensed physician, healthcare provider, or qualified medical professional 
                before making any healthcare decisions or taking any action based on information from this application. 
                Your health and safety are paramount.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Situations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/95 border border-red-300/50 rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Phone className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 text-lg">Emergency Situations</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium mb-3">
                <strong className="text-red-700">In case of emergency, call 911 immediately.</strong>
              </p>
              <p className="text-gray-700 leading-relaxed font-medium">
                Do <strong>not</strong> rely on this application for emergency medical assistance or urgent health matters. 
                This is a bill analysis tool, not an emergency response service.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bill Analysis Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 text-lg">Bill Analysis Disclaimer</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed font-medium">
                  Our AI-powered bill analysis is designed to help identify potential billing errors, 
                  overcharges, and savings opportunities. <strong>Results are informational only</strong> and should 
                  be verified with healthcare providers and billing departments.
                </p>
                <p className="text-gray-700 leading-relaxed font-medium">
                  <strong>We do not guarantee</strong> specific savings, outcomes, or results. Every medical bill 
                  is unique, and actual savings vary significantly based on individual circumstances, insurance coverage, 
                  provider policies, and negotiation success.
                </p>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Users report average savings of <strong>$2,000-$35,000+</strong>, but your results may differ. 
                  These figures represent user-reported outcomes and are not guarantees of future performance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legal Templates Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Scale className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 text-lg">Legal Templates & Letters</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                Templates and dispute letters provided are for <strong>educational and informational purposes</strong>. 
                They are <strong>not legal advice</strong>. For legal guidance specific to your situation, consult with 
                a qualified attorney licensed in your jurisdiction.
              </p>
            </div>
          </div>
        </motion.div>

        {/* No Professional Relationship */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-5"
        >
          <h3 className="font-bold text-gray-900 mb-2">No Professional Relationship</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Use of this application does not create a physician-patient relationship, attorney-client relationship, 
            or any other professional relationship. We are a technology platform providing educational tools and analysis services.
          </p>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-5"
        >
          <h3 className="font-bold text-gray-900 mb-2">Limitation of Liability</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            To the fullest extent permitted by law, GoldRock Health (Eldest AI LLC dba GoldRock AI) shall not be 
            liable for any direct, indirect, incidental, special, or consequential damages resulting from the use 
            or inability to use this service, including but not limited to damages for loss of profits, data, or other intangibles.
          </p>
        </motion.div>

        {/* Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-300 rounded-2xl p-5"
        >
          <p className="text-sm text-gray-700 leading-relaxed text-center font-medium">
            By using GoldRock AI, you acknowledge that you have read, understood, and agree to this disclaimer. 
            If you do not agree with any part of this disclaimer, please do not use this application.
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center text-xs text-gray-500 pb-8"
        >
          <p>Last Updated: October 24, 2025</p>
          <p className="mt-1">© 2025 GoldRock Health (Eldest AI LLC dba GoldRock AI)</p>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
