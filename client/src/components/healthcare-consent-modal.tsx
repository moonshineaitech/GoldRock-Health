import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Clock, Trash2, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const CONSENT_KEY = "grh_healthcare_consent_v1";

const CONSENT_ITEMS = [
  {
    icon: Lock,
    color: "text-gold",
    bg: "bg-secondary",
    title: "Encrypted and private",
    desc: "Your bill details are encrypted before storage. Only you can access your files.",
  },
  {
    icon: Shield,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    title: "AI processes your bill — nothing else",
    desc: "OpenAI and Google analyze your bill to find savings. They are contractually prohibited from using your data for training.",
  },
  {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-secondary",
    title: "Auto-deleted after 30 days",
    desc: "Bill analyses and chat messages are automatically removed after 30 days.",
  },
  {
    icon: Trash2,
    color: "text-rose-600",
    bg: "bg-secondary",
    title: "Delete anytime",
    desc: "You can delete all your health data at any time from your Data Security settings.",
  },
];

export function useHealthcareConsent() {
  const [hasConsented, setHasConsented] = useState(() => {
    try {
      return localStorage.getItem(CONSENT_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [showModal, setShowModal] = useState(false);

  const giveConsent = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "true");
    } catch {}
    setHasConsented(true);
    setShowModal(false);
  };

  const requestConsent = () => {
    if (!hasConsented) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  return { hasConsented, showModal, setShowModal, giveConsent, requestConsent };
}

interface HealthcareConsentModalProps {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export function HealthcareConsentModal({ open, onAccept, onClose }: HealthcareConsentModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md mx-auto rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        <div
          className="p-6 text-white"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-serif font-semibold">Before you share your bill details</h2>
          </div>
          <p className="text-white/80 text-sm">
            Here's exactly what happens to your data — no fine print.
          </p>
        </div>

        <div className="p-5 space-y-3 bg-card">
          {CONSENT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`flex gap-3 p-3 rounded-xl ${item.bg}`}>
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${item.color}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}

          <div className="pt-2 space-y-2">
            <Button
              className="w-full text-white rounded-xl h-11 hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              onClick={onAccept}
            >
              Got it, continue
            </Button>
            <div className="text-center">
              <Link
                href="/data-security"
                className="text-xs text-gold hover:underline inline-flex items-center gap-1"
                onClick={onClose}
              >
                <ExternalLink className="w-3 h-3" />
                View full Data Security details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
