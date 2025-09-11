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
              AI Usage Agreement
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Before accessing GoldRock Health, please review and accept our AI usage terms and data practices.
            This is a one-time requirement for new users.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-indigo-600" />
              Artificial Intelligence Usage Disclosure
            </CardTitle>
            <p className="text-sm text-gray-500">
              Effective Date: {new Date().toLocaleDateString()} | Version {AI_TERMS_VERSION}
            </p>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96 pr-4" data-testid="agreement-content">
              <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                
                {/* AI Usage Notice */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <Brain className="h-5 w-5" />
                    AI-Powered Services Notice
                  </h3>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Important Notice</p>
                        <p className="text-amber-700">
                          GoldRock Health utilizes artificial intelligence and machine learning technologies to enhance your experience. 
                          Your messages, uploads, and interactions may be processed by third-party AI service providers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    <strong>GoldRock Health</strong> ("Company," "we," "us," or "our") operates as a healthcare technology platform 
                    that integrates artificial intelligence services to provide enhanced user experiences. By using our services, 
                    you acknowledge and consent to the AI-powered features described herein.
                  </p>
                  
                  <p className="mb-4">
                    Our platform uses AI technologies including but not limited to:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>Natural language processing for message analysis and response generation</li>
                    <li>Document analysis and content extraction from uploaded files</li>
                    <li>Intelligent recommendations and personalized content delivery</li>
                    <li>Automated content moderation and safety filtering</li>
                    <li>Data analytics and pattern recognition for service improvement</li>
                  </ul>
                </section>

                <Separator />

                {/* Data Collection and Processing */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <FileText className="h-5 w-5" />
                    Data Collection and AI Processing
                  </h3>
                  
                  <p className="mb-4">
                    <strong>Information We Collect for AI Processing:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong>Messages and Communications:</strong> Text-based interactions, queries, and responses you provide</li>
                    <li><strong>File Uploads:</strong> Documents, images, and other files you submit for analysis</li>
                    <li><strong>Usage Patterns:</strong> How you interact with AI features and system responses</li>
                    <li><strong>Technical Data:</strong> Device information, IP addresses, and session data for service delivery</li>
                    <li><strong>Preferences:</strong> Settings and customizations you apply to AI features</li>
                  </ul>

                  <p className="mb-4">
                    <strong>Third-Party AI Service Providers:</strong>
                  </p>
                  <p className="mb-4">
                    We partner with leading AI service providers including but not limited to OpenAI, Anthropic, and Google AI. 
                    Your data may be transmitted to and processed by these services according to their respective privacy policies 
                    and terms of service. We implement contractual safeguards requiring these providers to:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>Process data only for the purposes of providing our services</li>
                    <li>Implement appropriate security measures</li>
                    <li>Not retain your data beyond the necessary processing period</li>
                    <li>Not use your data for their own model training without explicit consent</li>
                  </ul>
                </section>

                <Separator />

                {/* Privacy and Security */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <Lock className="h-5 w-5" />
                    Privacy and Security Measures
                  </h3>
                  
                  <p className="mb-4">
                    <strong>Data Protection:</strong> We implement industry-standard security measures including:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>End-to-end encryption for data in transit</li>
                    <li>Secure data storage with encryption at rest</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Data anonymization and pseudonymization where feasible</li>
                  </ul>

                  <p className="mb-4">
                    <strong>Data Retention:</strong> We retain your data only as long as necessary to provide our services 
                    or as required by law. You may request deletion of your data at any time, subject to legal obligations.
                  </p>

                  <p className="mb-4">
                    <strong>HIPAA Disclaimer:</strong> GoldRock Health is not a HIPAA-covered entity. While we implement 
                    strong privacy and security measures, our services are not designed to handle protected health information (PHI) 
                    under HIPAA standards. Please do not submit personal medical records or other PHI through our platform.
                  </p>
                </section>

                <Separator />

                {/* User Rights and Choices */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <Shield className="h-5 w-5" />
                    Your Rights and Choices
                  </h3>
                  
                  <p className="mb-4">You have the following rights regarding your data and AI processing:</p>
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong>Access:</strong> Request information about data we collect and how it's processed</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                    <li><strong>Opt-Out:</strong> Disable certain AI features that require data sharing</li>
                    <li><strong>Objection:</strong> Object to specific processing activities</li>
                  </ul>

                  <p className="mb-4">
                    <strong>Opt-Out Options:</strong> While AI processing is integral to our core services, 
                    you may limit certain AI features through your account settings. Note that opting out of 
                    essential AI processing may limit platform functionality.
                  </p>
                </section>

                <Separator />

                {/* Limitations and Disclaimers */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <AlertTriangle className="h-5 w-5" />
                    Important Limitations and Disclaimers
                  </h3>
                  
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <p className="font-medium text-red-800 mb-2">AI Limitations:</p>
                    <ul className="text-red-700 space-y-1 text-sm">
                      <li>• AI responses are generated and may contain inaccuracies</li>
                      <li>• Do not rely on AI outputs for critical decisions without verification</li>
                      <li>• AI cannot replace professional medical, legal, or financial advice</li>
                      <li>• System availability and performance may vary</li>
                    </ul>
                  </div>

                  <p className="mb-4">
                    <strong>No Medical Advice:</strong> GoldRock Health provides educational and informational 
                    content only. Our AI-powered features do not constitute medical advice, diagnosis, or treatment. 
                    Always consult qualified healthcare professionals for medical concerns.
                  </p>

                  <p className="mb-4">
                    <strong>Liability Limitations:</strong> To the fullest extent permitted by law, GoldRock Health 
                    disclaims all warranties and limits liability for AI-generated content, service interruptions, 
                    or data processing errors.
                  </p>
                </section>

                <Separator />

                {/* Compliance and Legal */}
                <section>
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-3 text-indigo-700">
                    <FileText className="h-5 w-5" />
                    Legal Compliance and Governing Law
                  </h3>
                  
                  <p className="mb-4">
                    <strong>Jurisdictional Compliance:</strong> This agreement is governed by the laws of the United States. 
                    We comply with applicable federal and state privacy laws, including but not limited to state privacy statutes 
                    where applicable.
                  </p>

                  <p className="mb-4">
                    <strong>Updates to Terms:</strong> We may update these AI usage terms periodically. 
                    Significant changes will be communicated through platform notifications. Continued use 
                    constitutes acceptance of updated terms.
                  </p>

                  <p className="mb-4">
                    <strong>Data Transfers:</strong> Your data may be processed in servers located in the United States 
                    and other countries where our service providers operate, subject to appropriate safeguards.
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