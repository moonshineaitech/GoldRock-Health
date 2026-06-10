import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, ExternalLink, Shield, FileText } from "lucide-react";
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
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60"
        data-testid="medical-disclaimer-overlay"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-card rounded-2xl shadow-2xl max-w-sm w-full border border-border overflow-hidden"
        >
          <div className="relative z-10 p-6">
            <div className="flex flex-col items-center text-center mb-5">
              <motion.div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="h-7 w-7 text-white relative z-10" strokeWidth={2.5} />
              </motion.div>
              <h2 className="text-lg font-black font-serif text-foreground mb-1">Before You Start</h2>
              <p className="text-sm text-muted-foreground font-medium">Please review and accept our terms</p>
            </div>

            <div className="bg-secondary rounded-xl p-4 mb-4 border border-border">
              <p className="text-sm text-foreground leading-relaxed text-center font-medium">
                This app is for <strong>educational purposes</strong> and <strong>bill analysis only</strong>. 
                Not medical advice. Always consult healthcare professionals.
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <Link href="/privacy-policy">
                <motion.button
                  className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors border border-border"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsVisible(false)}
                  data-testid="link-privacy-policy-popup"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </motion.button>
              </Link>
              
              <Link href="/terms-of-service">
                <motion.button
                  className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors border border-border"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsVisible(false)}
                  data-testid="link-terms-of-service-popup"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Terms of Service</span>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </motion.button>
              </Link>

              <Link href="/important-disclaimer">
                <motion.button
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gold hover:text-gold py-2 rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVisible(false)}
                  data-testid="view-full-disclaimer-link"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full Medical Disclaimer
                </motion.button>
              </Link>
            </div>

            <p className="text-sm text-foreground font-semibold text-center mb-4">
              By clicking "I Agree", you accept our Terms of Service and Privacy Policy
            </p>

            <MobileButton
              className="w-full bg-primary text-primary-foreground shadow-sm"
              onClick={handleAccept}
              data-testid="accept-medical-disclaimer"
            >
              <Check className="h-5 w-5 mr-2" />
              I Agree
            </MobileButton>

            <p className="text-xs text-muted-foreground text-center mt-3">
              © 2026 Eldest AI LLC dba GoldRock AI
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
