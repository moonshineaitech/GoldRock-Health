import { MobileLayout } from "@/components/mobile-layout";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <MobileLayout title="Privacy Policy" showBottomNav={false}>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/">
            <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <Card className="p-6 lg:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Who We Are</h2>
            <p className="mb-4">
              GoldRock AI is operated by Eldest AI LLC, a Colorado limited liability company ("we," "our," or "us"). 
              We provide an AI-powered platform that helps consumers analyze their medical bills and develop strategies 
              for reducing healthcare costs.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> Email address, name, and authentication details</li>
              <li><strong>Medical Bills:</strong> Bill images, text, and related healthcare documents you choose to upload</li>
              <li><strong>Chat Messages:</strong> Conversations with our AI system about your bills and healthcare costs</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store card information)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Information We Collect Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Usage Data:</strong> How you interact with our platform, features used, and session information</li>
              <li><strong>Device Information:</strong> Browser type, device type, IP address, and operating system</li>
              <li><strong>Analytics:</strong> Aggregated usage statistics to improve our service</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>AI Analysis:</strong> Process your medical bills to identify potential overcharges and reduction strategies</li>
              <li><strong>Personalized Advice:</strong> Provide customized bill analysis and negotiation recommendations</li>
              <li><strong>Service Delivery:</strong> Operate and maintain your account and our platform</li>
              <li><strong>Communication:</strong> Send service updates, support responses, and important notifications</li>
              <li><strong>Improvement:</strong> Analyze usage patterns to enhance our AI models and user experience</li>
              <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Third-Party Service Providers</h3>
            <p className="mb-4">We share information with trusted service providers who help us operate our platform:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>OpenAI:</strong> AI analysis of your medical bills and chat conversations</li>
              <li><strong>ElevenLabs:</strong> Text-to-speech services for voice outputs</li>
              <li><strong>Stripe:</strong> Payment processing (financial information only)</li>
              <li><strong>Hosting Providers:</strong> Secure cloud infrastructure for our platform</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Legal Requirements</h3>
            <p className="mb-4">
              We may disclose information when required by law, to protect our rights, prevent fraud, 
              or ensure user safety.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Business Transfers</h3>
            <p className="mb-4">
              If we're involved in a merger, acquisition, or sale, your information may be transferred 
              as part of that transaction.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption in transit using HTTPS/TLS</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
            </ul>
            <p className="mb-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee 
              absolute security of your information.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your information for as long as necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Medical Bills & Analysis:</strong> 90 days by default, or until you request deletion</li>
              <li><strong>Chat Messages:</strong> 90 days by default, or until you request deletion</li>
              <li><strong>Usage Analytics:</strong> Aggregated data retained for service improvement</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-Out:</strong> Decline certain data processing activities</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, contact us at <strong>privacy@goldrockhealth.com</strong>
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. State Privacy Rights</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Colorado Privacy Act</h3>
            <p className="mb-4">
              Colorado residents have specific rights under the Colorado Privacy Act, including the 
              right to opt out of the sale of personal data and targeted advertising.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">California Privacy Rights</h3>
            <p className="mb-4">
              California residents have additional rights under CCPA/CPRA, including the right to 
              know what personal information is collected and how it's used.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Other State Rights</h3>
            <p className="mb-4">
              We comply with applicable state privacy laws in Washington, Nevada, and other jurisdictions 
              where we operate.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for users under 18. We do not knowingly collect personal 
              information from children under 18. If you believe we have collected such information, 
              please contact us immediately.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. International Users</h2>
            <p className="mb-4">
              Our services are primarily intended for users in the United States. If you access our 
              service from outside the US, you consent to the transfer and processing of your 
              information in the United States.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy periodically. We will notify you of material changes 
              by email or through our platform. Your continued use of our service after changes 
              indicates acceptance of the updated policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Eldest AI LLC dba GoldRock AI</strong></p>
              <p className="mb-2">Email: <strong>privacy@goldrockhealth.com</strong></p>
              <p className="mb-2">Support: <strong>support@goldrockhealth.com</strong></p>
              <p>Address: Colorado, United States</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
              <p className="text-sm text-blue-800">
                This service uses generative AI to analyze your medical bills. For medical advice, 
                please consult your healthcare provider. We are not a healthcare provider and do 
                not provide medical advice.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}