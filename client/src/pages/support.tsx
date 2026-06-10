import { PublicLayout } from "@/components/public-layout";
import { Card } from "@/components/ui/card";
import { Mail, Clock, MessageCircle, FileText } from "lucide-react";

export default function Support() {
  return (
    <PublicLayout title="Support">
      <Card className="p-6 lg:p-8">
        <div className="prose prose-gray max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Contact Support</h1>
            <p className="text-muted-foreground">
              Need help with GoldRock AI? We're here to assist you with any questions or issues.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="flex items-start gap-4 p-4 bg-secondary border border-border rounded-lg">
              <Mail className="h-6 w-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Email Support</h3>
                <p className="text-foreground mb-2">
                  <a 
                    href="mailto:contact@goldrock.ai" 
                    className="text-gold hover:text-gold font-medium"
                    data-testid="link-support-email"
                  >
                    contact@goldrock.ai
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Our primary support channel for all inquiries
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary border border-border rounded-lg">
              <Clock className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Response Time</h3>
                <p className="text-foreground font-medium mb-2">
                  Within 24 hours
                </p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday, 9 AM - 5 PM MT
                </p>
              </div>
            </div>
          </div>

          {/* Support Topics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold font-serif text-foreground mb-4">What We Can Help With</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Account & Billing Questions</p>
                  <p className="text-sm text-muted-foreground">Subscription management, payment issues, account settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Medical Bill Analysis</p>
                  <p className="text-sm text-muted-foreground">Help with bill uploads, AI analysis results, dispute letters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Technical Support</p>
                  <p className="text-sm text-muted-foreground">App issues, login problems, feature assistance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Privacy & Security</p>
                  <p className="text-sm text-muted-foreground">Data protection, account deletion, privacy concerns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold font-serif text-foreground mb-4">Additional Resources</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="/privacy-policy" 
                  className="text-gold hover:text-gold"
                  data-testid="link-privacy-policy"
                >
                  Privacy Policy
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="/terms-of-service" 
                  className="text-gold hover:text-gold"
                  data-testid="link-terms"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="mt-8 p-4 bg-secondary border border-border rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-2">Business Information</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Company:</strong> Eldest AI LLC dba GoldRock AI<br />
              <strong>Location:</strong> Colorado, United States<br />
              <strong>Email:</strong> <a href="mailto:contact@goldrock.ai" className="text-gold hover:text-gold">contact@goldrock.ai</a>
            </p>
          </div>
        </div>
      </Card>
    </PublicLayout>
  );
}
