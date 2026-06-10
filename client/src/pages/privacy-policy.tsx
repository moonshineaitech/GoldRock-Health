import { PublicLayout } from "@/components/public-layout";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <PublicLayout title="Privacy Policy">
      <Card className="p-6 lg:p-8">
        <div className="prose prose-gray max-w-none">
          <div className="text-sm text-muted-foreground mb-6">
            <strong>Effective Date:</strong> March 1, 2026<br />
            <strong>Last Updated:</strong> March 1, 2026
          </div>

          <div className="bg-secondary p-5 rounded-xl border border-border mb-8">
            <h3 className="font-bold text-foreground mb-3 text-lg">Privacy at a Glance</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><strong>We align with HIPAA standards</strong> for handling health-related information</li>
              <li><strong>We don't sell your personal data</strong> to third parties</li>
              <li><strong>We don't train our AI on your personal medical bills</strong> — our training uses public and expert-curated data</li>
              <li><strong>You can delete your account and data</strong> at any time through Settings</li>
              <li><strong>Data encryption</strong> in transit and at rest protects your information</li>
              <li><strong>Contact us at CONTACT@GOLDROCK.ai</strong> for privacy inquiries</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">Privacy Policy</h2>

          <p className="mb-4">
            This Privacy Policy describes how Eldest AI LLC, a Colorado limited liability company, doing business as GoldRock AI 
            ("<strong>Company</strong>", "<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>") collects, uses, shares, and protects 
            information about users of our website at www.goldrockhealth.com (the "<strong>Website</strong>") and our mobile applications (the "<strong>App</strong>"), 
            collectively referred to as the "<strong>Services</strong>".
          </p>

          <p className="mb-4">
            By using our Services, you agree to the collection, use, and sharing of your information as described in this Privacy Policy. If you do not 
            agree with our policies and practices, do not use our Services.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">1. Information We Collect</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">1.1 Information You Provide Directly</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account Information:</strong> When you create an account, we collect your email address, name, and authentication credentials. 
            You may also authenticate using third-party services (Apple or Google), in which case we receive basic profile information from those services.</li>
            <li><strong>Medical Bills and Health Documents:</strong> When you upload medical bills for analysis, we collect the images or documents you provide, 
            which may contain health-related information, billing codes, provider information, and personal identifiers.</li>
            <li><strong>Chat and Interaction Data:</strong> We collect messages and interactions you have with our AI systems, including questions you ask 
            and information you provide during bill analysis, diagnostic training, or other features.</li>
            <li><strong>Payment Information:</strong> When you subscribe to Premium services, payment information is processed securely by our payment 
            processors (Stripe, Apple). We do not directly store your full credit card numbers.</li>
            <li><strong>Support Communications:</strong> When you contact us for support, we collect the information you provide in your communications.</li>
            <li><strong>User Preferences:</strong> Settings, preferences, and feature usage patterns you establish within the Services.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">1.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, browser type, and mobile network information.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on pages, clickstream data, and navigation patterns.</li>
            <li><strong>Log Data:</strong> IP address, access times, referring URLs, and system activity logs.</li>
            <li><strong>Location Information:</strong> General geographic location based on IP address (we do not collect precise GPS location).</li>
            <li><strong>Analytics Data:</strong> Aggregated information about how our Services are used to improve functionality and user experience.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">1.3 Information from Third Parties</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Authentication Providers:</strong> If you sign in using Apple or Google, we receive basic profile information they provide.</li>
            <li><strong>Payment Processors:</strong> Confirmation of payment status and subscription information from Stripe and Apple.</li>
            <li><strong>Analytics Partners:</strong> Aggregated usage data from analytics services.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">2. How We Use Your Information</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">2.1 Primary Uses</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Providing Services:</strong> To operate the Services, including analyzing your medical bills, providing AI-generated insights, 
            facilitating diagnostic training, and delivering educational content.</li>
            <li><strong>Account Management:</strong> To create and manage your account, process subscriptions, and authenticate your access.</li>
            <li><strong>Personalization:</strong> To customize your experience, remember your preferences, and provide relevant recommendations.</li>
            <li><strong>Communication:</strong> To send service-related messages, respond to support requests, and provide updates about the Services.</li>
            <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">2.2 Analytics and Improvement</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our Services, including AI model accuracy and user experience.</li>
            <li><strong>Research:</strong> To conduct research and development for new features and services.</li>
            <li><strong>Aggregated Insights:</strong> To generate aggregated, de-identified statistics about platform usage.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">2.3 Legal and Compliance</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Legal Obligations:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests.</li>
            <li><strong>Rights Protection:</strong> To enforce our Terms of Service and protect our rights, privacy, safety, or property.</li>
            <li><strong>Fraud Prevention:</strong> To detect and prevent fraud, abuse, or other harmful activities.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">3. How We Share Your Information</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">3.1 Service Providers</h3>
          <p className="mb-4">
            We share information with trusted service providers who assist us in operating our Services:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>AI Service Providers:</strong> OpenAI and Google (Gemini) receive your queries and uploaded content to generate AI responses. 
            These providers operate under Data Processing Agreements (DPAs) that prohibit them from using your data for model training. 
            Your data is deleted from their systems after processing.</li>
            <li><strong>Cloud Hosting:</strong> Our infrastructure is hosted on secure cloud platforms that store and process your data.</li>
            <li><strong>Payment Processors:</strong> Stripe and Apple process payment information for subscription services.</li>
            <li><strong>Analytics Providers:</strong> We use analytics services to understand how our Services are used.</li>
            <li><strong>Email Services:</strong> Third-party providers help deliver transactional emails and notifications.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">3.2 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose your information if required to do so by law or in response to valid legal requests, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Court orders, subpoenas, or other legal processes</li>
            <li>Requests from law enforcement or government agencies</li>
            <li>Situations involving potential threats to safety</li>
            <li>Protection of our legal rights or defense against claims</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">3.3 Business Transfers</h3>
          <p className="mb-4">
            If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of assets, your information may be transferred 
            as part of that transaction. We will notify you of any change in ownership or use of your information.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">3.4 With Your Consent</h3>
          <p className="mb-4">
            We may share your information for other purposes with your explicit consent.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">3.5 What We Don't Do</h3>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-4">
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <li>✓ We do NOT sell your personal information to third parties</li>
              <li>✓ We do NOT share your medical bills with advertisers</li>
              <li>✓ We do NOT use your personal medical bills to train our AI models</li>
              <li>✓ We do NOT share your data for cross-app advertising tracking</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">4. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Encryption:</strong> Data is encrypted in transit using TLS/HTTPS and at rest using AES-256 encryption.</li>
            <li><strong>Access Controls:</strong> Strict access controls limit who can access your data within our organization.</li>
            <li><strong>Authentication:</strong> Secure authentication mechanisms, including support for biometric authentication on mobile devices.</li>
            <li><strong>Monitoring:</strong> Continuous monitoring for security threats and unauthorized access attempts.</li>
            <li><strong>Secure Infrastructure:</strong> Our services are hosted on secure, SOC 2 compliant infrastructure.</li>
            <li><strong>Employee Training:</strong> Regular security training for our team members.</li>
          </ul>
          <p className="mb-4">
            While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. 
            We cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">5. Data Retention</h2>
          <p className="mb-4">
            We retain your information for as long as necessary to provide our Services and fulfill the purposes described in this Privacy Policy:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account Data:</strong> Retained until you delete your account.</li>
            <li><strong>Medical Bills and Documents:</strong> Retained for 30 days by default, then automatically deleted. You can delete them sooner through Settings.</li>
            <li><strong>Chat History:</strong> Retained for 30 days by default, or until you request deletion.</li>
            <li><strong>Usage Analytics:</strong> Aggregated and de-identified data may be retained indefinitely for service improvement.</li>
            <li><strong>Payment Records:</strong> Retained as required by financial and tax regulations (typically 7 years).</li>
            <li><strong>Legal Compliance:</strong> Data may be retained longer if required by law or to resolve disputes.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">6. Your Rights and Choices</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">6.1 Access and Portability</h3>
          <p className="mb-4">
            You have the right to access and receive a copy of your personal information. You can export your data through your account settings 
            or by contacting us at <strong>CONTACT@GOLDROCK.ai</strong>.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">6.2 Correction</h3>
          <p className="mb-4">
            You can update or correct your account information through your account settings. For other corrections, contact us.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">6.3 Deletion</h3>
          <p className="mb-4">
            You can delete your account and all associated data through Settings → Account Deletion in the App or Website. Account deletion 
            is completed within 5 minutes and is irreversible. All personal data, medical bills, chat history, and achievements will be permanently deleted.
          </p>
          <p className="mb-4">
            You can also delete only your health data (bill analyses, documents, and chat history) without deleting your account. 
            Visit your <a href="/data-security" className="text-gold hover:underline font-medium">Data Security settings</a> to 
            manage, export, or delete your data at any time.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">6.4 Communication Preferences</h3>
          <p className="mb-4">
            You can manage email preferences in your account settings. You can disable push notifications through your device settings.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">6.5 Opt-Out Rights</h3>
          <p className="mb-4">
            You may opt out of certain data practices by contacting us. Note that opting out of some data processing may limit your ability 
            to use certain features.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">7. State-Specific Privacy Rights</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">7.1 Colorado Privacy Act (CPA)</h3>
          <p className="mb-4">
            As a Colorado company, we comply with the Colorado Privacy Act. Colorado residents have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access their personal data</li>
            <li>Correct inaccuracies in their personal data</li>
            <li>Delete their personal data</li>
            <li>Obtain a portable copy of their data</li>
            <li>Opt out of the sale of personal data (we do not sell personal data)</li>
            <li>Opt out of targeted advertising based on personal data</li>
            <li>Opt out of profiling in furtherance of automated decisions</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, contact us at <strong>CONTACT@GOLDROCK.ai</strong>. You may designate an authorized agent to make 
            requests on your behalf. We may require verification of your identity before processing requests.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">7.2 California Consumer Privacy Act (CCPA/CPRA)</h3>
          <p className="mb-4">
            California residents have additional rights under the CCPA and CPRA:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Right to Know:</strong> What personal information we collect, use, disclose, and sell</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information we have collected</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of personal information (we do not sell personal information)</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
            <li><strong>Right to Correct:</strong> Correct inaccurate personal information</li>
            <li><strong>Right to Limit Use:</strong> Limit use and disclosure of sensitive personal information</li>
          </ul>
          <p className="mb-4">
            <strong>Categories of Personal Information Collected:</strong> Identifiers, commercial information, internet activity, health information 
            (medical bills you upload), and inferences drawn from the above.
          </p>
          <p className="mb-4">
            <strong>Do Not Track:</strong> Our Services do not currently respond to "Do Not Track" signals.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">7.3 Virginia Consumer Data Protection Act (VCDPA)</h3>
          <p className="mb-4">
            Virginia residents have similar rights including access, correction, deletion, data portability, and opt-out rights for targeted 
            advertising and sale of personal data.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">7.4 Other State Laws</h3>
          <p className="mb-4">
            We comply with applicable state privacy laws including those in Connecticut, Utah, Nevada, and other jurisdictions. If you are a 
            resident of a state with specific privacy rights, contact us to learn more about exercising those rights.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">8. Health Information</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">8.1 HIPAA Alignment</h3>
          <p className="mb-4">
            While GoldRock AI is not a covered entity under HIPAA (we are not a healthcare provider, health plan, or healthcare clearinghouse), 
            we voluntarily align with HIPAA standards for the handling of health-related information. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Implementing administrative, physical, and technical safeguards</li>
            <li>Limiting access to health information on a need-to-know basis</li>
            <li>Training employees on privacy and security practices</li>
            <li>Using encryption for health information in transit and at rest</li>
            <li>Maintaining audit logs of access to health information</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">8.2 Medical Bill Data</h3>
          <p className="mb-4">
            Medical bills you upload may contain protected health information (PHI) including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Patient names and identifiers</li>
            <li>Dates of service</li>
            <li>Medical procedure codes and diagnoses</li>
            <li>Healthcare provider information</li>
            <li>Insurance information</li>
          </ul>
          <p className="mb-4">
            We process this information solely to provide our bill analysis services and handle it with the utmost care. 
            Before any bill data is submitted, you will be asked to review and consent to our healthcare data processing practices 
            through an in-app consent screen. Bill data is automatically deleted after 30 days. You can manage or delete your 
            health data at any time from <a href="/data-security" className="text-gold hover:underline font-medium">Data Security settings</a>.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">9. Children's Privacy</h2>
          <p className="mb-4">
            Our Services are not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. 
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us at 
            <strong> CONTACT@GOLDROCK.ai</strong> and we will delete such information.
          </p>
          <p className="mb-4">
            In compliance with the Children's Online Privacy Protection Act (COPPA), we will never knowingly collect personal information from 
            children under 13.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">10. Mobile Application Privacy</h2>
          
          <h3 className="text-lg font-medium text-foreground mb-3">10.1 iOS App Privacy</h3>
          <p className="mb-4">
            Our iOS application is subject to Apple's App Store privacy requirements. App privacy information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Data Types Collected:</strong> Contact info (email), health (medical bills you upload), identifiers (user ID), usage data, diagnostics</li>
            <li><strong>Data Linked to You:</strong> Email, name, medical bills, chat messages, subscription status, usage data</li>
            <li><strong>Data Not Linked to You:</strong> Aggregated analytics, crash diagnostics, performance data</li>
            <li><strong>Tracking:</strong> We do not use data for cross-app or cross-website tracking for advertising purposes</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">10.2 Device Permissions</h3>
          <p className="mb-4">
            Our iOS app may request the following permissions:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Camera:</strong> To capture photos of medical bills. Photos are processed on our servers and handled according to this Privacy Policy.</li>
            <li><strong>Photo Library:</strong> To select existing bill images. We only access photos you specifically select.</li>
            <li><strong>Push Notifications:</strong> To notify you of bill analysis completion and important updates. You can disable this in iOS Settings.</li>
            <li><strong>Face ID/Touch ID:</strong> For secure authentication. Biometric data is processed entirely on your device by iOS; we never access or store your biometric data.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">10.3 In-App Purchases and Subscriptions (iOS)</h3>
          <p className="mb-4">
            When you subscribe to Premium through our iOS app:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Payment Processing:</strong> All in-app purchases are processed by Apple through StoreKit. We never receive or store your Apple Pay, credit card, or payment method details.</li>
            <li><strong>Subscription Management:</strong> Subscriptions are managed through your Apple ID account. You can view, change, or cancel subscriptions in your device's Settings → [Your Name] → Subscriptions.</li>
            <li><strong>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period. Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period.</li>
            <li><strong>Subscription Verification:</strong> We use RevenueCat to verify your subscription status. RevenueCat receives your anonymized subscriber ID and subscription status from Apple — not your payment details.</li>
            <li><strong>Price Changes:</strong> If subscription prices change, you will be notified by Apple before any price increase takes effect.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">10.4 Document Vault and File Storage</h3>
          <p className="mb-4">
            Our Document Vault feature allows you to securely upload and store medical documents including bills, Explanation of Benefits (EOBs), insurance letters, and receipts:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Storage:</strong> Documents are stored in encrypted cloud object storage with authenticated-only access. Each user's documents are isolated and only accessible to that user.</li>
            <li><strong>Encryption:</strong> All files are encrypted at rest (AES-256) and in transit (TLS 1.3). Upload and download use time-limited presigned URLs that expire after use.</li>
            <li><strong>Access Control:</strong> Documents are stored with private access control policies. No documents are publicly accessible. Only authenticated requests from your account can access your files.</li>
            <li><strong>AI Processing:</strong> When you request AI analysis of a document, the document content is sent to our AI provider (OpenAI) for processing. OpenAI's data usage policy applies — they do not use API inputs to train their models.</li>
            <li><strong>Retention:</strong> Documents remain in your vault until you manually delete them or delete your account. We do not automatically delete vault documents.</li>
            <li><strong>Camera Uploads:</strong> When you use the camera to photograph a document, the photo is uploaded directly to your vault. It is not stored elsewhere on our servers.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mb-3">10.5 Apple App Tracking Transparency</h3>
          <p className="mb-4">
            GoldRock Health does not track you across other companies' apps or websites. We do not participate in advertising networks 
            or share your data for cross-app tracking purposes. Therefore, we do not display Apple's App Tracking Transparency prompt, 
            as there is no tracking to consent to.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">10.6 Account Deletion from App</h3>
          <p className="mb-4">
            Per Apple's App Store requirements, you can delete your account and all associated data directly within the app:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Navigate to Settings → Account Deletion within the app</li>
            <li>Confirm your decision to delete your account</li>
            <li>Deletion completes within 5 minutes</li>
            <li>All personal data, medical bills, chat history, achievements, and preferences are permanently deleted</li>
            <li>This action is irreversible</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">11. International Users</h2>
          <p className="mb-4">
            Our Services are primarily intended for users in the United States. If you access our Services from outside the United States, 
            please be aware that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your information will be transferred to and processed in the United States</li>
            <li>U.S. data protection laws may differ from those in your country</li>
            <li>By using our Services, you consent to the transfer and processing of your information in the United States</li>
            <li>You are responsible for compliance with local laws regarding your use of our Services</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">12. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Maintain your session and authentication status</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze usage patterns and improve our Services</li>
            <li>Provide security features</li>
          </ul>
          <p className="mb-4">
            You can control cookies through your browser settings. Disabling cookies may affect the functionality of our Services.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">13. Third-Party Links</h2>
          <p className="mb-4">
            Our Services may contain links to third-party websites or services. We are not responsible for the privacy practices of these 
            third parties. We encourage you to review their privacy policies before providing them with any information.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">14. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of material changes by:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Posting the updated Privacy Policy on our Website</li>
            <li>Updating the "Last Updated" date at the top of this Policy</li>
            <li>Sending email notification for significant changes</li>
            <li>Displaying in-app notifications</li>
          </ul>
          <p className="mb-4">
            Your continued use of the Services after changes to this Privacy Policy constitutes your acceptance of the updated Policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">15. Contact Us</h2>
          <div className="bg-secondary p-5 rounded-xl border border-border mb-6">
            <p className="mb-2 text-foreground"><strong>Eldest AI LLC dba GoldRock AI</strong></p>
            <p className="mb-2 text-muted-foreground">State of Incorporation: Colorado, United States</p>
            <p className="mb-2 text-muted-foreground">Privacy Inquiries: <strong>CONTACT@GOLDROCK.ai</strong></p>
            <p className="mb-2 text-muted-foreground">General Support: <strong>CONTACT@GOLDROCK.ai</strong></p>
            <p className="mb-2 text-muted-foreground">Data Protection Requests: <strong>CONTACT@GOLDROCK.ai</strong></p>
          </div>

          <p className="mb-4">
            We will respond to privacy-related inquiries within 45 days. For requests requiring identity verification, the response time 
            may be extended as needed to verify your identity.
          </p>

          <div className="mt-8 p-5 bg-secondary rounded-xl border border-border">
            <h3 className="font-bold text-foreground mb-3">Important Notice</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This service uses generative AI to analyze your medical bills and provide educational content. The AI-generated output is for 
              informational purposes only and does not constitute medical, legal, or financial advice.
            </p>
            <p className="text-sm text-muted-foreground">
              We are not a healthcare provider, law firm, or financial advisor. Always consult qualified professionals for advice specific 
              to your situation.
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>© 2026 Eldest AI LLC dba GoldRock AI. All rights reserved.</p>
          </div>
        </div>
      </Card>
    </PublicLayout>
  );
}
