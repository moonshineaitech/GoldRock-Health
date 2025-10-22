import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield, X, Check } from "lucide-react";
import { MobileButton } from "./mobile-layout";

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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Important Medical Notice</h2>
                  <p className="text-sm text-gray-600">Please read carefully</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <h3 className="font-bold text-yellow-900 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Educational Purpose Only
                </h3>
                <p className="text-sm text-yellow-800">
                  GoldRock AI provides educational information and medical bill analysis services only. 
                  This app does NOT provide medical diagnosis, treatment, or professional medical advice.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">Always Consult Healthcare Professionals</h3>
                <p className="text-sm text-blue-800">
                  Always consult a licensed physician, healthcare provider, or qualified medical professional 
                  before making any healthcare decisions or taking any action based on information from this app.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <h3 className="font-bold text-red-900 mb-2">Emergency Situations</h3>
                <p className="text-sm text-red-800">
                  <strong>In case of emergency, call 911 immediately.</strong> Do not rely on this app 
                  for emergency medical assistance or urgent health matters.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Bill Analysis Disclaimer</h3>
                <p className="text-sm text-gray-700">
                  Our AI-powered bill analysis is designed to help identify potential billing errors and 
                  overcharges. Results are informational only and should be verified with healthcare providers 
                  and billing departments. We do not guarantee specific savings or outcomes.
                </p>
              </div>
            </div>

            <MobileButton
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              onClick={handleAccept}
              data-testid="accept-medical-disclaimer"
            >
              <Check className="h-5 w-5 mr-2" />
              I Understand & Accept
            </MobileButton>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you acknowledge that you have read and understood this medical disclaimer.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
