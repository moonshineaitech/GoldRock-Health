import { MobileLayout } from "@/components/mobile-layout";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <MobileLayout title="Terms of Service" showBottomNav={false}>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/">
            <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        <Card className="p-6 lg:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and 
              Eldest AI LLC, a Colorado limited liability company, doing business as GoldRock AI 
              ("we," "our," or "us"), regarding your use of our AI-powered medical bill analysis platform.
            </p>
            <p className="mb-4">
              By accessing or using our service, you agree to be bound by these Terms and our Privacy Policy. 
              If you disagree with any part of these Terms, you may not access the service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="mb-4">
              GoldRock AI provides an AI-powered platform that helps consumers:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Analyze medical bills for potential overcharges and errors</li>
              <li>Generate strategies for reducing healthcare costs</li>
              <li>Create dispute letters and negotiation templates</li>
              <li>Access industry insights and billing practices information</li>
              <li>Interact with AI chatbots for personalized bill analysis advice</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years old to use our service. By using our service, you represent 
              and warrant that you meet this age requirement and have the legal capacity to enter into 
              this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Account Registration</h2>
            <p className="mb-4">
              To access certain features, you must create an account by providing accurate and complete 
              information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and up-to-date information</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Subscription and Payment</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Subscription Plans</h3>
            <p className="mb-4">
              We offer monthly ($20/month) and annual ($189/year) subscription plans with access to 
              premium features and workflows.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Terms</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Payment is processed through Stripe, our secure payment processor</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You may cancel at any time through your account settings</li>
              <li>No refunds for partial subscription periods</li>
              <li>We may change pricing with 30 days' notice</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Permitted Uses</h3>
            <p className="mb-4">You may use our service for legitimate personal use to analyze your own medical bills.</p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Prohibited Uses</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Uploading medical bills that do not belong to you without proper authorization</li>
              <li>Using the service for illegal activities or fraud</li>
              <li>Attempting to reverse engineer, hack, or compromise our systems</li>
              <li>Sharing your account credentials with others</li>
              <li>Using automated tools to access our service without permission</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Harassing other users or our staff</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Content and Data</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Your Content</h3>
            <p className="mb-4">
              You retain ownership of all medical bills, documents, and information you upload ("Your Content"). 
              By using our service, you grant us a limited, non-exclusive license to process Your Content 
              to provide our services.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Our Content</h3>
            <p className="mb-4">
              Our AI-generated analysis, templates, and strategies remain our intellectual property. 
              You may use these outputs for your personal use but may not redistribute or commercialize them.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
            <p className="mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which explains how we 
              collect, use, and protect your information. By using our service, you consent to our 
              data practices as described in the Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">Not Medical or Legal Advice</h3>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>IMPORTANT:</strong> Our service provides general information and AI-generated analysis 
                only. We do not provide medical, legal, or financial advice. Always consult with qualified 
                professionals for medical advice or legal guidance regarding your healthcare bills.
              </p>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">AI Limitations</h3>
            <p className="mb-4">
              Our AI analysis is for informational purposes only. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-generated content may contain errors or inaccuracies</li>
              <li>Results may vary and are not guaranteed</li>
              <li>We do not guarantee specific savings or outcomes</li>
              <li>Always verify AI-generated information independently</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Service Availability</h3>
            <p className="mb-4">
              We provide our service "as is" without warranties. We do not guarantee continuous, 
              uninterrupted access to our service and may experience downtime for maintenance or upgrades.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ELDEST AI LLC SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT 
              LIMITATION LOSS OF PROFITS, DATA, USE, OR GOODWILL.
            </p>
            <p className="mb-4">
              OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL 
              NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless Eldest AI LLC from any claims, damages, or 
              expenses arising from your use of our service, violation of these Terms, or infringement 
              of any third-party rights.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Mobile App Specific Terms</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mb-3">iOS App Store</h3>
            <p className="mb-4">
              If you download our app from Apple's App Store, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>These Terms are between you and Eldest AI LLC, not Apple</li>
              <li>Apple has no obligation to provide maintenance or support for the app</li>
              <li>Apple is not responsible for addressing any claims relating to the app</li>
              <li>Apple and its subsidiaries are third-party beneficiaries of these Terms</li>
              <li>You will comply with all applicable third-party terms when using the app</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-3">In-App Purchases</h3>
            <p className="mb-4">
              Subscriptions purchased through the iOS app are processed by Apple:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Payment will be charged to your Apple ID account at confirmation of purchase</li>
              <li>Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period</li>
              <li>Your account will be charged for renewal within 24 hours prior to the end of the current period</li>
              <li>You can manage subscriptions and turn off auto-renewal in your Apple ID Account Settings</li>
              <li>Cancellation of the current active subscription is not allowed during the subscription period</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Device Permissions</h3>
            <p className="mb-4">
              Our iOS app may request the following device permissions:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Camera:</strong> To capture photos of medical bills</li>
              <li><strong>Photo Library:</strong> To select and upload existing bill images</li>
              <li><strong>Notifications:</strong> To alert you of bill analysis completion and updates</li>
              <li><strong>Face ID/Touch ID:</strong> For secure app authentication (optional)</li>
            </ul>
            <p className="mb-4">
              You can manage these permissions at any time through iOS Settings. Denying certain permissions 
              may limit app functionality.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Account Deletion</h3>
            <p className="mb-4">
              Per Apple's App Store requirements, you can delete your account and all associated data 
              directly within the app:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Navigate to Settings → Account Deletion within the app</li>
              <li>Follow the confirmation process to permanently delete your account</li>
              <li>Deletion completes within 5 minutes and is irreversible</li>
              <li>All personal data, medical bills, and chat history will be permanently deleted</li>
              <li>Active subscriptions will be cancelled (refunds subject to Apple's policies)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Termination</h2>
            <p className="mb-4">
              Either party may terminate this agreement at any time. We may suspend or terminate your 
              account if you violate these Terms. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your access to the service will cease</li>
              <li>You may request deletion of your data</li>
              <li>Surviving provisions (disclaimers, limitations, indemnification) remain in effect</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="mb-4">
              We may modify these Terms at any time by posting updated Terms on our website. Material 
              changes will be notified via email or through our service. Continued use after changes 
              indicates acceptance of the updated Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Governing Law and Disputes</h2>
            <p className="mb-4">
              These Terms are governed by Colorado state law. Any disputes will be resolved through 
              binding arbitration in Colorado, except for claims that may be brought in small claims court.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">16. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms is found unenforceable, the remaining provisions will 
              continue in full force and effect.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">17. Contact Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Eldest AI LLC dba GoldRock AI</strong></p>
              <p className="mb-2">Email: <strong>support@goldrockhealth.com</strong></p>
              <p className="mb-2">Legal: <strong>legal@goldrockhealth.com</strong></p>
              <p>Address: Colorado, United States</p>
            </div>

            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Legal Disclaimer</h3>
              <p className="text-sm text-red-800">
                This platform is not a law firm, medical practice, or financial advisory service. 
                The information provided is for educational purposes only and does not constitute 
                professional advice. Always consult qualified professionals for specific guidance 
                regarding your medical bills and healthcare decisions.
              </p>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>© 2025 Eldest AI LLC dba GoldRock AI. All rights reserved.</p>
            </div>
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}