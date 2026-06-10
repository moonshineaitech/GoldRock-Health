import { motion } from "framer-motion";
import { 
  Heart,
  Building2,
  Shield,
  FileText,
  Activity,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Brain,
  Stethoscope,
  Calculator
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const platformCapabilities = {
  conditionsCovered: 53,
  hospitalPartnerships: 127,
  statesCovered: 50,
  cptIcdCodes: "200+"
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI analyzes your medical bills for errors, overcharges, and savings opportunities"
  },
  {
    icon: Calculator,
    title: "Cost Comparison",
    description: "Compare your charges against fair market rates and Medicare pricing"
  },
  {
    icon: Stethoscope,
    title: "Medical Code Review",
    description: "Identify incorrect billing codes, duplicate charges, and unbundled services"
  },
  {
    icon: Shield,
    title: "Patient Rights Protection",
    description: "Know your rights under federal and state healthcare laws"
  }
];

export default function PlatformStats() {
  return (
    <>
      <SEOHead
        title="Platform Capabilities | GoldRock Health"
        description="Learn about GoldRock Health's AI-powered medical bill analysis platform capabilities, coverage, and features."
        keywords={["medical bill analysis", "healthcare platform", "bill reduction tools"]}
        canonicalPath="/platform-stats"
      />

      <MobileHeader title="Platform" />

      <div className="min-h-screen bg-background pb-24">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-gold rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Platform Capabilities
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              What We Offer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform helps you understand and reduce your medical bills with powerful analysis tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-border mb-10">
              <CardHeader>
                <CardTitle className="text-foreground font-serif flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gold" />
                  Platform Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {platformCapabilities.conditionsCovered}
                    </div>
                    <div className="text-sm text-muted-foreground">Medical Conditions</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {platformCapabilities.hospitalPartnerships}
                    </div>
                    <div className="text-sm text-muted-foreground">Hospital Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {platformCapabilities.statesCovered}
                    </div>
                    <div className="text-sm text-muted-foreground">States Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {platformCapabilities.cptIcdCodes}
                    </div>
                    <div className="text-sm text-muted-foreground">CPT/ICD Codes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-foreground mb-4 font-serif">
                  Ready to Analyze Your Bill?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                  Upload your medical bill and let our AI find potential savings and errors.
                </p>
                <Link href="/bill-grader">
                  <Button 
                    className="bg-primary text-primary-foreground"
                    data-testid="button-cta-analyze"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Analyze My Bill
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
