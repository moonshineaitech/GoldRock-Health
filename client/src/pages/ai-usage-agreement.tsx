import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Brain, Lock, AlertTriangle, FileText, Mail } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const agreementSchema = z.object({
  acceptAiTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the AI usage terms to continue"
  }),
  acknowledgeDataSharing: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge data sharing practices to continue"
  }),
});

type AgreementForm = z.infer<typeof agreementSchema>;

const AI_TERMS_VERSION = "1.0.0";

export default function AiUsageAgreement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<AgreementForm>({
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      acceptAiTerms: false,
      acknowledgeDataSharing: false,
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
        description: "Thank you for accepting our AI usage terms. You can now access all features of GoldRock Health.",
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
    if (data.acceptAiTerms && data.acknowledgeDataSharing) {
      acceptTermsMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
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
          <p className="text-gray-600 max-w-2xl mx-auto">
            Welcome to GoldRock Health! Please review our terms of service before getting started.
            Most users just scroll through and click "Accept" - this is pretty standard stuff.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-indigo-600" />
              Service Agreement
            </CardTitle>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()} | Version {AI_TERMS_VERSION}
            </p>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96 pr-4" data-testid="agreement-content">
              <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                
                {/* Service Overview */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <Brain className="h-5 w-5" />
                    What We Do
                  </h3>
                  
                  <p className="mb-4">
                    GoldRock Health is a healthcare cost reduction platform that uses AI to help you save money on medical bills. 
                    Pretty simple stuff - you upload your bills, we analyze them, and help you find ways to reduce costs.
                  </p>
                  
                  <p className="mb-4">
                    Our service includes:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>AI-powered bill analysis and error detection</li>
                    <li>Chat support for questions about your bills</li>
                    <li>Personalized savings recommendations</li>
                    <li>Document processing and text extraction</li>
                  </ul>
                </section>

                <Separator />

                {/* How We Handle Your Data */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <FileText className="h-5 w-5" />
                    Your Data & Privacy
                  </h3>
                  
                  <p className="mb-4">
                    <strong>What we collect:</strong> Your account info, uploaded bill images, chat messages, and basic usage data. Standard stuff.
                  </p>
                  
                  <p className="mb-4">
                    <strong>How long we keep it:</strong> We automatically delete your bill data and chat messages after 30 days. Account data stays until you delete your account.
                  </p>

                  <p className="mb-4">
                    <strong>AI Processing:</strong> We use OpenAI and similar services to analyze your bills and provide responses. Your data is sent to these services securely and they're contractually prohibited from using it for their own purposes.
                  </p>
                  
                  <p className="mb-4">
                    <strong>Security:</strong> Everything is encrypted and secure. We follow industry best practices.
                  </p>
                </section>

                <Separator />

                {/* Important Disclaimers */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <AlertTriangle className="h-5 w-5" />
                    The Important Legal Stuff
                  </h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="font-medium text-blue-800 mb-2">Not Medical Advice</p>
                    <p className="text-blue-700 text-sm">
                      We help with bill analysis, not medical advice. Always consult healthcare professionals for medical decisions.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <p className="font-medium text-gray-800 mb-2">HIPAA Status</p>
                    <p className="text-gray-700 text-sm">
                      We're not a HIPAA-covered entity. Don't upload sensitive medical records or personal health info.
                    </p>
                  </div>

                  <p className="mb-4">
                    <strong>Accuracy:</strong> AI isn't perfect. While we work hard to provide accurate analysis, 
                    always verify important information independently.
                  </p>

                  <p className="mb-4">
                    <strong>Service Availability:</strong> We try to keep everything running smoothly, but can't 
                    guarantee 100% uptime. Technology happens.
                  </p>
                </section>

                <Separator />

                {/* Your Rights */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <Shield className="h-5 w-5" />
                    Your Rights
                  </h3>
                  
                  <p className="mb-4">Standard data rights apply:</p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>Request a copy of your data</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Export your data if you want to leave</li>
                  </ul>

                  <p className="mb-4">
                    Just email us at privacy@goldrockhealth.com if you need anything.
                  </p>
                </section>

                <Separator />

                {/* Liability */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <Shield className="h-5 w-5" />
                    Liability & Limitations
                  </h3>
                  
                  <p className="mb-4">
                    Standard tech company liability limitations apply. We provide the service "as is" and can't 
                    be held responsible for any damages from using our service. Use common sense.
                  </p>

                  <p className="mb-4">
                    We're based in the US and US laws apply to this agreement.
                  </p>
                </section>

                <Separator />

                {/* Changes to Terms */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <FileText className="h-5 w-5" />
                    Updates & Changes
                  </h3>
                  
                  <p className="mb-4">
                    We might update these terms occasionally. If we make significant changes, we'll let you know 
                    through the platform. Continued use means you accept the new terms.
                  </p>

                  <p className="mb-4">
                    That's pretty much it! Thanks for using GoldRock Health.
                  </p>
                </section>

                <Separator />

                {/* Contact Information - Minimized */}
                <section className="text-xs">
                  <p className="text-gray-500 mb-2">
                    Questions about this agreement? Contact: <span className="text-gray-600">privacy@goldrockhealth.com</span>
                  </p>
                </section>
              </div>
            </ScrollArea>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="acceptAiTerms"
                    checked={form.watch("acceptAiTerms")}
                    onCheckedChange={(checked) => form.setValue("acceptAiTerms", checked === true)}
                    data-testid="checkbox-accept-terms"
                  />
                  <label htmlFor="acceptAiTerms" className="text-sm font-medium leading-6">
                    I have read, understood, and agree to the AI Usage Terms and acknowledge that:
                    <ul className="mt-2 ml-4 text-xs text-gray-600 space-y-1">
                      <li>• My messages and uploads may be processed by AI services</li>
                      <li>• Data may be shared with third-party AI providers under contract</li>
                      <li>• I understand the limitations of AI-generated content</li>
                      <li>• This platform does not provide medical advice</li>
                    </ul>
                  </label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="acknowledgeDataSharing"
                    checked={form.watch("acknowledgeDataSharing")}
                    onCheckedChange={(checked) => form.setValue("acknowledgeDataSharing", checked === true)}
                    data-testid="checkbox-acknowledge-sharing"
                  />
                  <label htmlFor="acknowledgeDataSharing" className="text-sm font-medium leading-6">
                    I specifically acknowledge and consent to data sharing with AI service providers 
                    (OpenAI, Anthropic, Google AI, etc.) for the purpose of providing enhanced platform features, 
                    subject to contractual data protection requirements.
                  </label>
                </div>
              </div>

              {(form.formState.errors.acceptAiTerms || form.formState.errors.acknowledgeDataSharing) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 font-medium">
                    Please review and check both boxes above to continue.
                  </p>
                  {form.formState.errors.acceptAiTerms && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.acceptAiTerms.message}</p>
                  )}
                  {form.formState.errors.acknowledgeDataSharing && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.acknowledgeDataSharing.message}</p>
                  )}
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

        <div className="text-center mt-6 text-xs text-gray-500">
          By continuing, you acknowledge that you have read our{" "}
          <a href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</a> and{" "}
          <a href="/terms-of-service" className="text-indigo-600 hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}