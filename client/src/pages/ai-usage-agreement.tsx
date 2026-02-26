import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Brain, Lock, AlertTriangle, FileText, Mail, Database, Server, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";

const agreementSchema = z.object({
  acceptAiTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the AI usage terms to continue"
  }),
  acknowledgeDataSharing: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge data sharing practices to continue"
  }),
  acknowledgeHealthData: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge how your health billing data is handled"
  }),
});

type AgreementForm = z.infer<typeof agreementSchema>;

const AI_TERMS_VERSION = "2.0.0";

export default function AiUsageAgreement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<AgreementForm>({
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      acceptAiTerms: false,
      acknowledgeDataSharing: false,
      acknowledgeHealthData: false,
    },
  });

  const acceptTermsMutation = useMutation({
    mutationFn: () => apiRequest(`/api/accept-ai-terms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version: AI_TERMS_VERSION }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Agreement Accepted",
        description: "Thank you. You can now access all GoldRock AI features.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record your agreement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AgreementForm) => {
    if (data.acceptAiTerms && data.acknowledgeDataSharing && data.acknowledgeHealthData) {
      acceptTermsMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Welcome to GoldRock AI. Please review these terms before getting started — they cover how we handle your medical billing data.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-full text-xs text-indigo-700 dark:text-indigo-300 font-medium">
            Version {AI_TERMS_VERSION} · Updated for 2026 iOS App Store Health Data Guidelines
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-indigo-600" />
              Service Agreement
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: January 2026 · Version {AI_TERMS_VERSION}
            </p>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96 pr-4" data-testid="agreement-content">
              <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">

                {/* Service Overview */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    <Brain className="h-5 w-5" />
                    What We Do
                  </h3>
                  <p className="mb-4">
                    GoldRock AI is a healthcare cost reduction platform that uses AI to help you save money on medical bills.
                    You share bill details, we analyze them, and help you find ways to reduce costs through dispute letters,
                    negotiation guidance, and billing error detection.
                  </p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>AI-powered bill analysis and error detection</li>
                    <li>Itemized bill request letter generation</li>
                    <li>Chat support for questions about your bills</li>
                    <li>Personalized savings recommendations and dispute tools</li>
                    <li>Secure document storage in your private Document Vault</li>
                  </ul>
                </section>

                <Separator />

                {/* Healthcare Billing Data */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-emerald-700 dark:text-emerald-400">
                    <Shield className="h-5 w-5" />
                    Healthcare Billing Data
                  </h3>

                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-4">
                    <p className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">Sensitive data, handled carefully</p>
                    <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                      Medical billing records and insurance documents are classified as sensitive health-related financial data.
                      We process this information only to help you reduce your bill. We never use it to make decisions about your health,
                      and we never sell or share it with advertisers or marketers.
                    </p>
                  </div>

                  <p className="mb-3">When you use GoldRock AI features involving your billing data:</p>
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>Your data is used <strong>only</strong> to provide bill analysis and cost-reduction guidance</li>
                    <li>It is never used to make coverage decisions or health assessments</li>
                    <li>It is not sold, rented, or traded to any third party</li>
                    <li>Enterprise customers can request a Business Associate Agreement (BAA) by contacting CONTACT@GOLDROCK.ai</li>
                  </ul>
                </section>

                <Separator />

                {/* Data & Privacy */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    <FileText className="h-5 w-5" />
                    Your Data & Privacy
                  </h3>

                  <p className="mb-3">
                    <strong>What we collect:</strong> Your account info, uploaded bill images and documents, bill details you enter,
                    chat messages, and basic usage data.
                  </p>

                  <p className="mb-3">
                    <strong>How long we keep it:</strong> Bill analyses, uploaded documents, and chat messages are automatically
                    deleted after 30 days. Your account data remains until you delete your account.
                    You can delete specific data or all your health data at any time from your{" "}
                    <Link href="/data-security" className="text-indigo-600 hover:underline">Data Security settings</Link>.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 space-y-2">
                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Security standards</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• AES-256 encryption for all data stored at rest</li>
                      <li>• TLS 1.3 encryption for all data in transit</li>
                      <li>• Data stored exclusively on US-based servers</li>
                      <li>• Private access controls — only you can view your files</li>
                    </ul>
                  </div>
                </section>

                <Separator />

                {/* AI Processing */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    <Database className="h-5 w-5" />
                    AI Processing Disclosure
                  </h3>

                  <p className="mb-3">
                    To analyze your bills, your data is processed by third-party AI providers under strict data protection agreements:
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">OpenAI</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Processes bill text and images for analysis. Operates under a Data Processing Agreement
                        that prohibits using your data for model training. Data is deleted from their systems after processing.
                      </p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">Google (Gemini)</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Used for certain AI features as a fallback provider. Same contractual data protection
                        requirements apply — no training on your data, deletion after processing.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Neither provider has access to your account identity. Bill content is sent without personally identifiable
                    account information where technically possible.
                  </p>
                </section>

                <Separator />

                {/* Legal disclaimers */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    <AlertTriangle className="h-5 w-5" />
                    Important Disclaimers
                  </h3>

                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">Not Medical Advice</p>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      GoldRock AI helps with bill analysis and cost reduction, not medical advice or clinical decisions.
                      Always consult qualified healthcare professionals for any medical questions.
                    </p>
                  </div>

                  <p className="mb-3">
                    <strong>Accuracy:</strong> AI analysis is designed to identify common billing issues but is not infallible.
                    Always verify significant findings before taking action.
                  </p>

                  <p className="mb-3">
                    <strong>Service Availability:</strong> We aim for high availability but cannot guarantee 100% uptime.
                  </p>

                  <p className="mb-3">
                    <strong>Governing Law:</strong> These terms are governed by US law.
                  </p>
                </section>

                <Separator />

                {/* Your Rights */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    <Lock className="h-5 w-5" />
                    Your Rights
                  </h3>

                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>Request a copy of all your stored data</li>
                    <li>Delete your health data at any time</li>
                    <li>Delete your account and all associated data</li>
                    <li>Export your data in standard formats</li>
                    <li>Withdraw consent by deleting your account</li>
                  </ul>

                  <p className="mb-3">
                    Manage your data from your{" "}
                    <Link href="/data-security" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
                      Data Security settings <ExternalLink className="w-3 h-3" />
                    </Link>{" "}
                    or contact us at CONTACT@GOLDROCK.ai.
                  </p>
                </section>

                <Separator />

                {/* Updates */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    <FileText className="h-5 w-5" />
                    Updates to These Terms
                  </h3>

                  <p className="mb-3">
                    When we make significant changes to these terms — particularly around data handling — we will notify you
                    through the platform and ask you to re-accept. Continued use after notification constitutes acceptance.
                  </p>
                </section>

                <Separator />

                <section className="text-xs text-gray-500 dark:text-gray-500">
                  <p>Questions? Contact us at <span className="text-gray-600 dark:text-gray-400">CONTACT@GOLDROCK.ai</span></p>
                </section>
              </div>
            </ScrollArea>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptAiTerms"
                    checked={form.watch("acceptAiTerms")}
                    onCheckedChange={(checked) => form.setValue("acceptAiTerms", checked === true)}
                    data-testid="checkbox-accept-terms"
                  />
                  <label htmlFor="acceptAiTerms" className="text-sm font-medium leading-6 cursor-pointer">
                    I have read and agree to the GoldRock AI Terms of Service, including the limitations of AI-generated analysis
                    and that this platform does not provide medical advice.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acknowledgeDataSharing"
                    checked={form.watch("acknowledgeDataSharing")}
                    onCheckedChange={(checked) => form.setValue("acknowledgeDataSharing", checked === true)}
                    data-testid="checkbox-acknowledge-sharing"
                  />
                  <label htmlFor="acknowledgeDataSharing" className="text-sm font-medium leading-6 cursor-pointer">
                    I understand my bill content will be processed by OpenAI and Google (Gemini) under data protection
                    agreements that prohibit training on my data, and that this data is deleted after processing.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acknowledgeHealthData"
                    checked={form.watch("acknowledgeHealthData")}
                    onCheckedChange={(checked) => form.setValue("acknowledgeHealthData", checked === true)}
                    data-testid="checkbox-acknowledge-health"
                  />
                  <label htmlFor="acknowledgeHealthData" className="text-sm font-medium leading-6 cursor-pointer">
                    I understand that medical billing information I provide is sensitive and will only be used to
                    help reduce my bill — never for health assessments, credit decisions, or marketing.
                  </label>
                </div>
              </div>

              {Object.keys(form.formState.errors).length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Please check all three boxes above to continue.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  disabled={acceptTermsMutation.isPending}
                  data-testid="button-accept-agreement"
                >
                  {acceptTermsMutation.isPending ? "Processing..." : "Accept and Continue"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/api/logout")}
                  data-testid="button-decline-logout"
                >
                  Decline & Logout
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400 space-x-3">
          <a href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="/terms-of-service" className="text-indigo-600 hover:underline">Terms of Service</a>
          <span>·</span>
          <Link href="/data-security" className="text-indigo-600 hover:underline">Data Security</Link>
        </div>
      </div>
    </div>
  );
}
