import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, ExternalLink } from "lucide-react";
import { MobileButton } from "./mobile-layout";
import { Link } from "wouter";

export function MedicalDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenMedicalDisclaimer');
    if (!hasSeenDisclaimer) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hasSeenMedicalDisclaimer', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        data-testid="medical-disclaimer-overlay"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl max-w-sm w-full border border-white/40 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
          
          <div className="relative z-10 p-6">
            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center mb-5">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                <AlertTriangle className="h-7 w-7 text-white relative z-10" strokeWidth={2.5} />
              </motion.div>
              <h2 className="text-lg font-black text-gray-900 mb-1">Before You Start</h2>
              <p className="text-sm text-gray-600 font-medium">Quick agreement required</p>
            </div>

            {/* Simple Summary */}
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-200/50">
              <p className="text-sm text-gray-700 leading-relaxed text-center font-medium">
                This app is for <strong>educational purposes</strong> and <strong>bill analysis only</strong>. 
                Not medical advice. Always consult healthcare professionals.
              </p>
            </div>

            {/* View Full Terms Link */}
            <Link href="/important-disclaimer">
              <motion.button
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 py-2 rounded-lg hover:bg-emerald-50 transition-colors mb-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsVisible(false)}
                data-testid="view-full-disclaimer-link"
              >
                <ExternalLink className="h-4 w-4" />
                View Full Disclaimer & Terms
              </motion.button>
            </Link>

            {/* Agreement Question */}
            <p className="text-sm text-gray-700 font-semibold text-center mb-4">
              Do you agree to these terms?
            </p>

            {/* Accept Button */}
            <MobileButton
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
              onClick={handleAccept}
              data-testid="accept-medical-disclaimer"
            >
              <Check className="h-5 w-5 mr-2" />
              I Agree
            </MobileButton>

            <p className="text-xs text-gray-500 text-center mt-3">
              By continuing, you accept our terms
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
