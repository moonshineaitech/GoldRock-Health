import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Lock, Server, Clock, Trash2, Download, ExternalLink,
  CheckCircle2, AlertTriangle, Database, Eye, FileText, Mail,
  Fingerprint, Globe
} from "lucide-react";
import { Link } from "wouter";
import { biometricService } from "@/lib/biometric-service";

export default function DataSecurity() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(
    biometricService.isEnrolled()
  );

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/user/export-data");
      return await res.json();
    },
    onSuccess: (data: any) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "goldrock-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Data exported", description: "Your data has been downloaded as a JSON file." });
    },
    onError: () => toast({ title: "Export failed", description: "Please try again.", variant: "destructive" }),
  });

  const deleteDataMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/user/delete-data"),
    onSuccess: () => {
      setConfirmDelete(false);
      toast({ title: "Health data deleted", description: "All your bill analyses, documents, and chat history have been removed." });
    },
    onError: () => toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" }),
  });

  const handleBiometricToggle = async () => {
    if (biometricEnabled) {
      biometricService.disableBiometrics();
      setBiometricEnabled(false);
      toast({ title: "Biometric lock disabled" });
    } else {
      const available = await biometricService.isAvailable();
      if (!available) {
        toast({ title: "Not available", description: "Your device does not support biometric authentication.", variant: "destructive" });
        return;
      }
      const enrolled = await biometricService.enrollBiometrics(user?.id?.toString() || "user");
      if (enrolled) {
        setBiometricEnabled(true);
        toast({ title: "Biometric lock enabled", description: "Face ID / Touch ID will now protect your account." });
      }
    }
  };

  const PROTECTION_CARDS = [
    {
      icon: Lock,
      color: "text-gold",
      bg: "bg-card",
      border: "border-border",
      title: "Encryption",
      items: ["AES-256 encryption at rest", "TLS 1.3 in transit", "Zero-knowledge file storage"],
    },
    {
      icon: Eye,
      color: "text-gold",
      bg: "bg-card",
      border: "border-border",
      title: "Access Control",
      items: ["Only you can access your files", "Private ACL on all uploads", "Session-based authentication"],
    },
    {
      icon: Server,
      color: "text-gold",
      bg: "bg-card",
      border: "border-border",
      title: "Data Residency",
      items: ["US-only servers", "No international data transfers", "HIPAA-aligned infrastructure"],
    },
  ];

  const AI_PROVIDERS = [
    {
      name: "OpenAI",
      purpose: "Bill analysis and dispute letter generation",
      protections: "Data Processing Agreement in place · No training on your data · Deleted after processing",
    },
    {
      name: "Google (Gemini)",
      purpose: "Eligibility checks and benefit explanations",
      protections: "Data Processing Agreement in place · No training on your data · Deleted after processing",
    },
  ];

  return (
    <MobileLayout title="Data Security" showBackButton>
      <div className="p-4 space-y-5 max-w-3xl mx-auto pb-10">

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="rounded-2xl p-5 text-white"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-7 h-7" />
              <h1 className="text-xl font-serif font-semibold">Your Data Security</h1>
            </div>
            <p className="text-white/80 text-sm">
              Understand exactly how your medical billing information is protected, processed, and controlled.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0 text-xs">HIPAA-Aligned</Badge>
              <Badge className="bg-white/20 text-white border-0 text-xs">AES-256 Encrypted</Badge>
            </div>
          </div>
        </motion.div>

        {/* Protection Standards */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold" /> How Your Data Is Protected
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {PROTECTION_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className={`border ${card.border}`}>
                  <CardContent className={`p-4 ${card.bg} h-full`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                      <p className="font-semibold text-sm text-foreground">{card.title}</p>
                    </div>
                    <ul className="space-y-1">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" /> Data Retention
          </h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Bill analyses &amp; chat history</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatically deleted 30 days after creation. You do not need to do anything.
                  </p>
                </div>
                <Badge className="ml-auto bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0 text-xs flex-shrink-0">30 days</Badge>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Uploaded documents</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kept until you delete them from your Document Vault or delete your account.
                  </p>
                </div>
                <Badge className="ml-auto bg-background text-muted-foreground border border-border text-xs flex-shrink-0">You control</Badge>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Account data</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kept until you delete your account. Includes name, email, and subscription status.
                  </p>
                </div>
                <Badge className="ml-auto bg-background text-muted-foreground border border-border text-xs flex-shrink-0">Account lifetime</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AI Processing */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold" /> AI Processing Disclosure
          </h2>
          <div className="space-y-3">
            {AI_PROVIDERS.map((provider) => (
              <Card key={provider.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground">{provider.name}</p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-0 text-xs">DPA in place</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Used for: {provider.purpose}</p>
                  <p className="text-xs text-muted-foreground">{provider.protections}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* HIPAA */}
        <section>
          <Card className="border-border bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gold" />
                <p className="font-semibold text-sm text-foreground">HIPAA-Aligned Practices</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                GoldRock Health follows HIPAA-aligned data handling practices for medical billing information.
                Enterprise and insurance customers can request a Business Associate Agreement (BAA).
              </p>
              <a
                href="mailto:CONTACT@GOLDROCK.ai"
                className="text-xs text-gold hover:underline inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" /> Request a BAA — CONTACT@GOLDROCK.ai
              </a>
            </CardContent>
          </Card>
        </section>

        {/* App Security */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-gold" /> App Security
          </h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Biometric Lock</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Require Face ID or Touch ID to open the app
                    </p>
                  </div>
                </div>
                <Button
                  variant={biometricEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleBiometricToggle}
                  className=""
                >
                  {biometricEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Your Controls */}
        {isAuthenticated && (
          <section>
            <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-gold" /> Your Controls
            </h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Export your data</p>
                    <p className="text-xs text-muted-foreground">Download all your data as a JSON file</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportMutation.mutate()}
                    disabled={exportMutation.isPending}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Delete health data</p>
                    <p className="text-xs text-muted-foreground">Remove all bill analyses, documents, and chat history</p>
                  </div>
                  {confirmDelete ? (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDataMutation.mutate()}
                        disabled={deleteDataMutation.isPending}
                      >
                        {deleteDataMutation.isPending ? "Deleting..." : "Confirm"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-900 dark:hover:bg-rose-950"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Delete account</p>
                    <p className="text-xs text-muted-foreground">Permanently remove your account and all data</p>
                  </div>
                  <Link href="/settings">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {!isAuthenticated && (
          <Card className="border-border bg-secondary">
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sign in to manage your personal data and security settings.</p>
              <Button className="mt-3" onClick={() => window.location.href = "/api/login"}>Sign In</Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-xs text-muted-foreground pt-2 space-x-3">
          <a href="/privacy-policy" className="hover:text-gold">Privacy Policy</a>
          <span>·</span>
          <a href="mailto:CONTACT@GOLDROCK.ai" className="hover:text-gold">CONTACT@GOLDROCK.ai</a>
        </div>
      </div>
    </MobileLayout>
  );
}
