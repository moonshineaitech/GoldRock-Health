import { PublicLayout } from "@/components/public-layout";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <PublicLayout title="Terms of Service">
      <Card className="p-6 lg:p-8">
        <div className="prose prose-gray max-w-none">
          <div className="text-sm text-gray-600 mb-6">
            <strong>Updated:</strong> January 7, 2026
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 mb-8">
            <h3 className="font-bold text-blue-900 mb-3 text-lg">Quick Summary</h3>
            <p className="text-sm text-blue-800 mb-3">
              We've summarized some points below for your convenience. By using our Services, you're agreeing to ALL the Terms that follow this summary, not just these highlights.
            </p>
            <ul className="text-sm text-blue-800 space-y-2">
              <li><strong>What GoldRock AI Is:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• AI-powered medical bill analysis and reduction platform</li>
                  <li>• Diagnostic training and medical education tools</li>
                  <li>• Protein structure visualization (LunaFold)</li>
                  <li>• Medicare/Medicaid enrollment assistance</li>
                </ul>
              </li>
              <li><strong>What GoldRock AI Is NOT:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• NOT for medical emergencies — call 911</li>
                  <li>• NOT a substitute for professional medical advice</li>
                  <li>• NOT a law firm or legal advice provider</li>
                  <li>• NOT insurance or financial advice</li>
                </ul>
              </li>
              <li><strong>Your Rights & Responsibilities:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• By using GoldRock AI, you agree to arbitration instead of court for disputes</li>
                  <li>• We're a US-based service; international users assume responsibility for local law compliance</li>
                  <li>• Premium subscriptions can be cancelled anytime with 30-day refund policy</li>
                </ul>
              </li>
              <li><strong>Privacy & Data:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• We align with HIPAA standards and take your privacy seriously</li>
                  <li>• We don't sell your personal data</li>
                  <li>• You can request data deletion at any time</li>
                </ul>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
          
          <p className="mb-4">
            Welcome to the Terms of Service (these "<strong>Terms</strong>") for the website, www.goldrockhealth.com (the "<strong>Website</strong>"), 
            and the related mobile applications (the "<strong>App</strong>") operated on behalf of Eldest AI LLC, a Colorado limited liability company, 
            doing business as GoldRock AI ("<strong>Company</strong>", "<strong>we</strong>" or "<strong>us</strong>"). The Website and any content, 
            tools, features and functionality offered on or through our Website, text message and the App are collectively referred to as the "<strong>Services</strong>".
          </p>

          <p className="mb-4">
            These Terms govern your access to and use of the Services. Please read these Terms carefully, as they include important information about 
            your legal rights. By accessing and/or using the Services, you are agreeing to these Terms. If you do not understand or agree to these Terms, 
            please do not use the Services.
          </p>

          <p className="mb-4">
            For purposes of these Terms, "<strong>you</strong>" and "<strong>your</strong>" means you as the user of the Services. If you use the Services 
            on behalf of a company or other entity then "you" includes you and that entity, and you represent and warrant that (a) you are an authorized 
            representative of the entity with the authority to bind the entity to these Terms, and (b) you agree to these Terms on the entity's behalf.
          </p>

          <div className="bg-red-50 p-5 rounded-xl border border-red-200 mb-6">
            <p className="text-sm text-red-800 font-semibold">
              <strong>IMPORTANT:</strong> Section 13 contains an arbitration clause and class action waiver. By agreeing to these Terms, you agree 
              (a) to resolve all disputes (with limited exception) related to the Company's Services and/or products through binding individual arbitration, 
              which means that you waive any right to have those disputes decided by a judge or jury, and (b) to waive your right to participate in class actions, 
              class arbitrations, or representative actions. You have the right to opt out of arbitration as explained in Section 13.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Who May Use the Services</h2>
          <p className="mb-4">
            You must be 18 years of age or older and reside in the United States or any of its territories to use the Services. By using the Services, 
            you represent and warrant that you meet these requirements. The Services are not intended for medical emergencies, pediatric emergencies, 
            or serious health concerns requiring immediate attention. For any medical emergency, call 911 immediately.
          </p>
          <p className="mb-4">
            Our diagnostic training and medical education features are designed for educational purposes only and should not be used as a substitute for 
            professional medical training, licensing, or clinical decision-making. Medical students and healthcare professionals should always follow 
            their institution's guidelines and professional standards.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Accounts and Subscriptions</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Creating and Safeguarding your Account</h3>
          <p className="mb-4">
            To use certain of the Services, you need to create an account or link another account, such as your Apple, Facebook, Google, or Replit account 
            ("<strong>Account</strong>"). You agree to provide us with accurate, complete and updated information for your Account. You can access, edit and 
            update your Account through the Website, App, or via email to <strong>support@goldrockhealth.com</strong>. You are solely responsible for any 
            activity on your Account and for maintaining the confidentiality and security of your Account credentials. You should never share or disclose 
            your Account credentials to any third party. You agree to notify us immediately of any unauthorized access to your Account. We reserve the right 
            to disable your Account at any time if we believe you have violated these Terms.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Subscription Payment</h3>
          <p className="mb-4">
            If you buy or subscribe to any of our paid Services, you agree to pay us the applicable fees and taxes in U.S. Dollars. Failure to pay these 
            fees and taxes will result in the termination of your access to the paid Services. You agree that (a) if you purchase a recurring subscription 
            to any of the Services, we may store and continue billing your payment method (e.g. credit card) to avoid interruption of such Services, and 
            (b) we may calculate taxes payable by you based on the billing information you provide us at the time of purchase. All payments are processed 
            securely through our payment processors (Stripe for web, Apple for iOS in-app purchases).
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">2.3 Subscription Plans and Pricing</h3>
          <p className="mb-4">We offer the following subscription plans:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Monthly Premium:</strong> $25/month with automatic monthly renewal</li>
            <li><strong>Annual Premium:</strong> $249/year with automatic annual renewal (save $51 vs monthly)</li>
            <li><strong>Lifetime Access:</strong> $747 one-time payment for permanent access</li>
          </ul>
          <p className="mb-4">
            Subscription pricing is subject to change with 30 days' prior notice. Existing subscribers will be grandfathered at their current rate 
            until the end of their current billing period.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">2.4 Subscription Renewals and Cancellations</h3>
          <p className="mb-4">
            You agree that if you purchase a subscription, your subscription will automatically renew at the subscription period frequency referenced 
            on your subscription page (monthly or annually) and at the then-current rates, and your payment method will automatically be charged at the 
            start of each new subscription period for the fees and taxes applicable to that period. To avoid future subscription charges, you must cancel 
            your subscription no later than the day before the subscription renewal date. You can cancel your subscription through your Account settings, 
            the App Store (for iOS in-app purchases), or by emailing <strong>support@goldrockhealth.com</strong>.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">2.5 Refund Policy</h3>
          <p className="mb-4">
            We offer a 30-day money-back guarantee for new Premium subscribers who are not satisfied with the service. After the initial 30 days, payments 
            for any subscriptions are nonrefundable and there are no credits for partially used periods. Following any cancellation, you will continue to 
            have access to the paid Services through the end of the subscription period for which payment has already been made.
          </p>
          <p className="mb-4">
            For iOS in-app purchases, refunds are subject to Apple's refund policies and must be requested through Apple directly.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Description of Services</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Medical Bill Analysis</h3>
          <p className="mb-4">
            GoldRock AI provides AI-powered analysis of medical bills to help identify potential billing errors, overcharges, and opportunities for 
            cost reduction. Our Services include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>AI-powered bill scanning and error detection</li>
            <li>Identification of duplicate charges, upcoding, and unbundling</li>
            <li>Dispute letter templates and negotiation strategies</li>
            <li>Medicare rate comparisons and financial assistance guidance</li>
            <li>Expert coaching and 1-on-1 reduction assistance</li>
            <li>Industry insights and best practices</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 Medical Education and Training</h3>
          <p className="mb-4">
            Our platform includes educational features for healthcare knowledge and diagnostic skill development:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>AI-powered patient simulations for diagnostic training</li>
            <li>Clinical decision trees and medical reference materials</li>
            <li>Gamified learning through Pixel Doctor and achievement systems</li>
            <li>Board exam preparation resources</li>
            <li>Drug interaction databases and symptom checkers</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">3.3 LunaFold Protein Visualization</h3>
          <p className="mb-4">
            LunaFold provides access to protein structure data and visualization tools using AlphaFold database structures. This service is provided 
            for educational and research purposes only and is not intended for clinical diagnosis or treatment decisions.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">3.4 Medicare/Medicaid Enrollment Assistance</h3>
          <p className="mb-4">
            We provide AI-assisted guidance for Medicare and Medicaid enrollment processes. This is informational assistance only and does not 
            constitute enrollment services, insurance advice, or representation before government agencies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. AI-Generated Content</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Nature of AI Output</h3>
          <p className="mb-4">
            The Services utilize generative artificial intelligence technology to produce content, analysis, and recommendations ("<strong>Output</strong>"). 
            While we strive to provide accurate and helpful information, you acknowledge and agree that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>AI-generated Output may contain errors, inaccuracies, or outdated information</li>
            <li>Output is provided for informational and educational purposes only</li>
            <li>Output does not constitute professional medical, legal, financial, or tax advice</li>
            <li>Results may vary and specific outcomes are not guaranteed</li>
            <li>You should verify all AI-generated information independently</li>
            <li>You are responsible for your own decisions based on the Output</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 AI Usage Agreement</h3>
          <p className="mb-4">
            Before accessing AI-powered features, you must acknowledge and accept our AI Usage Agreement, which explains the limitations of AI-generated 
            content and your responsibilities when using AI features. Access to AI features may be restricted until you accept the AI Usage Agreement.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">4.3 No Medical Professional Relationship</h3>
          <p className="mb-4">
            Use of our Services does not create a doctor-patient, attorney-client, or other professional relationship between you and the Company. 
            The Output does not constitute medical opinion, advice, diagnosis, or treatment. Always consult with qualified healthcare professionals 
            for medical decisions.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Privacy and Data</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Privacy Policy</h3>
          <p className="mb-4">
            Our Privacy Policy describes how we handle the information you provide to us when you use the Services. For an explanation of our privacy 
            practices, please visit our Privacy Policy at{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              https://www.goldrockhealth.com/privacy-policy
            </Link>.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Medical Bill Data</h3>
          <p className="mb-4">
            When you upload medical bills or health-related documents, we process this information solely to provide our Services. We align with HIPAA 
            standards for the handling of health information and implement industry-standard security measures. Your uploaded documents are retained 
            for 30 days by default, or until you request deletion.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">5.3 AI Training Disclosure</h3>
          <p className="mb-4">
            We do not use your personal medical bills or health information to train our AI models. Our AI training is based on publicly available 
            medical billing data, coding references, and expert-curated content.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Rights We Grant You</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">6.1 Right to Use Services</h3>
          <p className="mb-4">
            We hereby permit you to use the Services for your personal non-commercial use only, provided that you comply with these Terms in connection 
            with all such use. If any software, content or other materials owned or controlled by us are distributed to you as part of your use of the 
            Services, we hereby grant you a personal, non-assignable, non-sublicensable, non-transferrable, and non-exclusive right and license to 
            access and display such software, content and materials provided to you as part of the Services, in each case for the sole purpose of 
            enabling you to use the Services as permitted by these Terms, provided that your license in any content linked to or associated with any 
            NFTs is solely as set forth by the applicable seller or creator of such NFT.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">6.2 Restrictions On Your Use of the Services</h3>
          <p className="mb-4">
            You may not do any of the following in connection with your use of the Services, unless applicable laws or regulations prohibit these 
            restrictions or you have our written permission to do so:
          </p>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>Download, modify, copy, distribute, transmit, display, perform, reproduce, duplicate, publish, license, create derivative works from, 
            or offer for sale any information contained on, or obtained from or through, the Services, except for temporary files that are automatically 
            cached by your web browser for display purposes, or as otherwise expressly permitted in these Terms;</li>
            <li>Duplicate, decompile, reverse engineer, disassemble or decode the Services (including any underlying idea or algorithm), or attempt to do any of the same;</li>
            <li>Use, reproduce or remove any copyright, trademark, service mark, trade name, slogan, logo, image, or other proprietary notation displayed on or through the Services;</li>
            <li>Use cheats, automation software (bots), hacks, modifications (mods) or any other unauthorized third-party software designed to modify the Services;</li>
            <li>Exploit the Services for any commercial purpose, including without limitation communicating or facilitating any commercial advertisement or 
            solicitation or exploiting the Services to develop products, models or services that compete with the Services;</li>
            <li>Use any part of the Services, including any Output, as input for any machine learning or artificial intelligence technology that is not 
            provided to you by us, or otherwise use any part of the Services, including any Output, as part of a dataset that may be used for training, 
            fine-tuning, developing, testing or improving any machine learning or artificial intelligence technology;</li>
            <li>Access or use the Services in any manner that could disable, overburden, damage, disrupt or impair the Services or interfere with any other 
            party's access to or use of the Services or use any device, software or routine that causes the same;</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage or disrupt the Services, accounts registered to other users, or the computer 
            systems or networks connected to the Services;</li>
            <li>Circumvent, remove, alter, deactivate, degrade or thwart any technological measure or content protections of the Services;</li>
            <li>Use any robot, spider, crawler, scraper, or other automated means or interface to access the Services or to extract or export data collected through the Services;</li>
            <li>Upload or submit to the Services (A) content that infringes any intellectual property or other proprietary rights, (B) content that violates 
            any person's rights of privacy or publicity, (C) content that is defamatory, obscene, pornographic, vulgar, offensive, or violent, (D) confidential 
            information of any third party, or (E) medical bills or health information belonging to other persons without their express authorization;</li>
            <li>Use the Services for any illegal purpose, or in violation of any local, state, national, or international law;</li>
            <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
            <li>Use the Services to engage in, promote, encourage, or condone fraud, insurance fraud, healthcare fraud, or any other illegal activity.</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Ownership and Content</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">7.1 Your Content</h3>
          <p className="mb-4">
            You retain ownership of all medical bills, documents, and information you upload to our Services ("<strong>Your Content</strong>"). By uploading 
            Your Content, you grant us a limited, non-exclusive license to process Your Content solely to provide our Services to you. This license ends 
            when you delete Your Content or your Account.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">7.2 Company Content</h3>
          <p className="mb-4">
            All content, software, features, functionality, and materials made available through the Services, including but not limited to AI-generated 
            Output, dispute letter templates, educational content, protein visualization tools, and gamification elements, are owned by or licensed to 
            Eldest AI LLC and are protected by intellectual property laws. You may use such materials solely for your personal, non-commercial use as 
            permitted by these Terms.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">7.3 Trademarks</h3>
          <p className="mb-4">
            "GoldRock AI," "GoldRock Health," "LunaFold," "Pixel Doctor," and related logos and marks are trademarks of Eldest AI LLC. You may not use 
            our trademarks without prior written permission.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Third-Party Services and Content</h2>
          <p className="mb-4">
            The Services may contain links to third-party websites, services, or content. We are not responsible for third-party content, products, or 
            services. Third-party services used in our platform include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>OpenAI:</strong> AI language model services for bill analysis and chat features</li>
            <li><strong>Anthropic:</strong> AI language model services for enhanced analysis</li>
            <li><strong>AlphaFold Database:</strong> Protein structure data for LunaFold</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Apple:</strong> iOS app distribution and in-app purchases</li>
            <li><strong>RevenueCat:</strong> Subscription management for mobile apps</li>
          </ul>
          <p className="mb-4">
            Your use of third-party services is subject to their respective terms of service and privacy policies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Mobile Application Terms</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">9.1 iOS App Store Terms</h3>
          <p className="mb-4">
            If you download our App from Apple's App Store, you acknowledge and agree that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>These Terms are between you and Eldest AI LLC, not Apple Inc.</li>
            <li>Apple has no obligation to provide maintenance or support for the App</li>
            <li>Apple is not responsible for addressing any claims relating to the App</li>
            <li>Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them</li>
            <li>You will comply with all applicable third-party terms when using the App</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">9.2 In-App Purchases</h3>
          <p className="mb-4">
            Subscriptions purchased through the iOS App are processed by Apple:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Payment will be charged to your Apple ID account at confirmation of purchase</li>
            <li>Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period</li>
            <li>Your account will be charged for renewal within 24 hours prior to the end of the current period</li>
            <li>You can manage subscriptions and turn off auto-renewal in your Apple ID Account Settings</li>
            <li>Any unused portion of a free trial period will be forfeited when you purchase a subscription</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">9.3 Device Permissions</h3>
          <p className="mb-4">
            Our App may request the following device permissions:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Camera:</strong> To capture photos of medical bills for analysis</li>
            <li><strong>Photo Library:</strong> To select and upload existing bill images</li>
            <li><strong>Push Notifications:</strong> To alert you of analysis completion and updates</li>
            <li><strong>Biometric Authentication:</strong> For secure app access (optional)</li>
            <li><strong>Network Access:</strong> To connect to our services</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">9.4 Account Deletion</h3>
          <p className="mb-4">
            Per Apple's App Store requirements, you can delete your account and all associated data directly within the App through Settings → Account Deletion. 
            Deletion is completed within 5 minutes and is irreversible. All personal data, medical bills, chat history, and achievements will be permanently deleted.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Disclaimers</h2>
          
          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 mb-4">
            <h3 className="font-bold text-yellow-900 mb-3">IMPORTANT DISCLAIMERS</h3>
            <p className="text-sm text-yellow-800 mb-3">
              <strong>NOT MEDICAL ADVICE:</strong> The Services are for informational and educational purposes only. Nothing provided by the Services 
              constitutes medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions regarding 
              medical conditions. Never disregard professional medical advice or delay seeking it because of information from our Services.
            </p>
            <p className="text-sm text-yellow-800 mb-3">
              <strong>NOT LEGAL ADVICE:</strong> The dispute templates, negotiation strategies, and legal information provided are for informational 
              purposes only and do not constitute legal advice. We are not a law firm and do not provide legal representation. Consult with a qualified 
              attorney for legal matters.
            </p>
            <p className="text-sm text-yellow-800 mb-3">
              <strong>NOT FINANCIAL ADVICE:</strong> Information about medical bill costs, payment plans, and financial assistance is general information 
              only and does not constitute financial advice. Consult with qualified financial advisors for financial decisions.
            </p>
            <p className="text-sm text-yellow-800">
              <strong>NO GUARANTEES:</strong> We do not guarantee specific savings, outcomes, or results from using our Services. Actual results depend 
              on many factors outside our control.
            </p>
          </div>

          <p className="mb-4 uppercase text-sm">
            THE SERVICES AND ANY OUTPUT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, 
            BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. YOUR USE OF 
            THE SERVICES IS AT YOUR SOLE RISK.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
          <p className="mb-4 uppercase text-sm">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ELDEST AI LLC, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, OR 
            LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION 
            DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY 
            TO USE, THE SERVICES.
          </p>
          <p className="mb-4 uppercase text-sm">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ELDEST AI LLC ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY (A) ERRORS, MISTAKES, 
            OR INACCURACIES IN ANY OUTPUT OR CONTENT; (B) PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR USE OF THE SERVICES; (C) UNAUTHORIZED 
            ACCESS TO OUR SERVERS OR PERSONAL INFORMATION; (D) INTERRUPTION OR CESSATION OF THE SERVICES; (E) BUGS, VIRUSES, OR OTHER HARMFUL CODE 
            TRANSMITTED THROUGH THE SERVICES; OR (F) ANY CONTENT POSTED, TRANSMITTED, OR MADE AVAILABLE THROUGH THE SERVICES.
          </p>
          <p className="mb-4 uppercase text-sm">
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICES EXCEED THE GREATER OF (A) THE AMOUNTS 
            YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
          <p className="mb-4">
            You agree to defend, indemnify, and hold harmless Eldest AI LLC, its affiliates, and their respective directors, officers, employees, 
            and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorneys' fees) 
            arising from: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any third-party right, including any 
            intellectual property, privacy, or publicity right; (d) your Content; or (e) any dispute between you and a third party, including any 
            healthcare provider, insurance company, or collection agency.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Dispute Resolution and Arbitration</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">13.1 Informal Resolution</h3>
          <p className="mb-4">
            Before initiating any formal dispute resolution, you agree to contact us at <strong>legal@goldrockhealth.com</strong> and attempt to 
            resolve any dispute informally for at least 30 days.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.2 Binding Arbitration</h3>
          <p className="mb-4">
            Any dispute, claim, or controversy arising out of or relating to these Terms or the Services that cannot be resolved informally shall 
            be resolved by binding arbitration administered by the American Arbitration Association ("AAA") in accordance with its Consumer Arbitration 
            Rules. The arbitration shall be conducted in Denver, Colorado, or at another mutually agreed location, or via telephone or video conference 
            if appropriate.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.3 Class Action Waiver</h3>
          <p className="mb-4">
            YOU AND ELDEST AI LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF 
            OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION. Unless both you and we agree otherwise, the arbitrator may not consolidate 
            more than one person's claims and may not otherwise preside over any form of a representative or class proceeding.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.4 Opt-Out</h3>
          <p className="mb-4">
            You may opt out of the arbitration agreement by sending written notice to <strong>legal@goldrockhealth.com</strong> within 30 days of 
            first accepting these Terms. Your notice must include your name, mailing address, and a clear statement that you wish to opt out of the 
            arbitration agreement.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.5 Exceptions</h3>
          <p className="mb-4">
            Notwithstanding the above, either party may bring individual claims in small claims court if eligible, and either party may seek 
            injunctive or other equitable relief in any court of competent jurisdiction to prevent infringement of intellectual property rights.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
          <p className="mb-4">
            These Terms and any dispute arising from them shall be governed by the laws of the State of Colorado, without regard to its conflict 
            of laws principles. For any disputes not subject to arbitration, you agree to submit to the exclusive jurisdiction of the state and 
            federal courts located in Denver, Colorado.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your Account and access to the Services immediately, without prior notice or liability, for any reason, 
            including if you breach these Terms. Upon termination:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your right to use the Services will immediately cease</li>
            <li>You may request deletion of your personal data</li>
            <li>All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, 
            warranty disclaimers, indemnity, and limitations of liability</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">16. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our 
            Website, through the App, or by email. Your continued use of the Services after any changes constitutes your acceptance of the new Terms. 
            If you do not agree to the updated Terms, you must stop using the Services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">17. General Provisions</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">17.1 Entire Agreement</h3>
          <p className="mb-4">
            These Terms, together with the Privacy Policy and any other agreements incorporated by reference, constitute the entire agreement 
            between you and Eldest AI LLC regarding the Services.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">17.2 Severability</h3>
          <p className="mb-4">
            If any provision of these Terms is held to be unenforceable, that provision shall be modified to reflect the parties' intention or 
            eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">17.3 Waiver</h3>
          <p className="mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of that right or provision.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">17.4 Assignment</h3>
          <p className="mb-4">
            You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms 
            without restriction.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">17.5 Force Majeure</h3>
          <p className="mb-4">
            We shall not be liable for any failure or delay in performing our obligations where such failure or delay results from circumstances 
            beyond our reasonable control.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">18. Contact Information</h2>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
            <p className="mb-2"><strong>Eldest AI LLC dba GoldRock AI</strong></p>
            <p className="mb-2">State of Incorporation: Colorado, United States</p>
            <p className="mb-2">General Support: <strong>support@goldrockhealth.com</strong></p>
            <p className="mb-2">Legal Inquiries: <strong>legal@goldrockhealth.com</strong></p>
            <p className="mb-2">Privacy Matters: <strong>privacy@goldrockhealth.com</strong></p>
          </div>

          <div className="mt-8 p-5 bg-red-50 rounded-xl border border-red-200">
            <h3 className="font-bold text-red-900 mb-3">Final Acknowledgment</h3>
            <p className="text-sm text-red-800">
              BY USING THE SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. 
              IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE SERVICES.
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2026 Eldest AI LLC dba GoldRock AI. All rights reserved.</p>
          </div>
        </div>
      </Card>
    </PublicLayout>
  );
}
