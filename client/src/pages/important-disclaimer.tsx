import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, Phone, Scale, FileText, Check } from "lucide-react";

export default function ImportantDisclaimer() {
  return (
    <MobileLayout title="Important Disclaimer" showBottomNav={false}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="h-8 w-8 text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-2xl font-bold font-serif text-foreground mb-2">Important Disclaimer</h1>
          <p className="text-muted-foreground font-medium">Please read this important information carefully</p>
        </motion.div>

        {/* Educational Purpose Only */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="luxury-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-foreground text-lg">Educational Purpose Only</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              GoldRock AI provides <strong className="text-foreground">educational information</strong> and <strong className="text-foreground">medical bill analysis services only</strong>. 
              This application does <strong className="text-foreground">NOT</strong> provide medical diagnosis, treatment, or professional medical advice.
            </p>
          </div>
        </motion.div>

        {/* Always Consult Healthcare Professionals */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="luxury-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Check className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-foreground text-lg">Always Consult Healthcare Professionals</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              <strong className="text-foreground">Always consult</strong> a licensed physician, healthcare provider, or qualified medical professional 
              before making any healthcare decisions or taking any action based on information from this application. 
              Your health and safety are paramount.
            </p>
          </div>
        </motion.div>

        {/* Emergency Situations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-card border border-destructive rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Phone className="h-5 w-5 text-destructive" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-foreground text-lg">Emergency Situations</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium mb-3">
              <strong className="text-destructive">In case of emergency, call 911 immediately.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Do <strong className="text-foreground">not</strong> rely on this application for emergency medical assistance or urgent health matters. 
              This is a bill analysis tool, not an emergency response service.
            </p>
          </div>
        </motion.div>

        {/* Bill Analysis Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="luxury-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-foreground text-lg">Bill Analysis Disclaimer</h3>
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed font-medium">
                Our AI-powered bill analysis is designed to help identify potential billing errors, 
                overcharges, and savings opportunities. <strong className="text-foreground">Results are informational only</strong> and should 
                be verified with healthcare providers and billing departments.
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                <strong className="text-foreground">We do not guarantee</strong> specific savings, outcomes, or results. Every medical bill 
                is unique, and actual savings vary significantly based on individual circumstances, insurance coverage, 
                provider policies, and negotiation success.
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Many users report meaningful savings, but your results will vary based on your specific situation. 
                Past outcomes are not guarantees of future performance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Legal Templates Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="luxury-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Scale className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-foreground text-lg">Legal Templates & Letters</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Templates and dispute letters provided are for <strong className="text-foreground">educational and informational purposes</strong>. 
              They are <strong className="text-foreground">not legal advice</strong>. For legal guidance specific to your situation, consult with 
              a qualified attorney licensed in your jurisdiction.
            </p>
          </div>
        </motion.div>

        {/* No Professional Relationship */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-secondary border border-border rounded-2xl p-5"
        >
          <h3 className="font-bold text-foreground mb-2">No Professional Relationship</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use of this application does not create a physician-patient relationship, attorney-client relationship, 
            or any other professional relationship. We are a technology platform providing educational tools and analysis services.
          </p>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-secondary border border-border rounded-2xl p-5"
        >
          <h3 className="font-bold text-foreground mb-2">Limitation of Liability</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the fullest extent permitted by law, GoldRock Health (Eldest AI LLC dba GoldRock AI) shall not be 
            liable for any direct, indirect, incidental, special, or consequential damages resulting from the use 
            or inability to use this service, including but not limited to damages for loss of profits, data, or other intangibles.
          </p>
        </motion.div>

        {/* Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card border border-gold rounded-2xl p-5 shadow-sm"
        >
          <p className="text-sm text-muted-foreground leading-relaxed text-center font-medium">
            By using GoldRock AI, you acknowledge that you have read, understood, and agree to this disclaimer. 
            If you do not agree with any part of this disclaimer, please do not use this application.
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-xs text-muted-foreground pb-8"
        >
          <p>Last Updated: October 24, 2025</p>
          <p className="mt-1">© 2025 GoldRock Health (Eldest AI LLC dba GoldRock AI)</p>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
