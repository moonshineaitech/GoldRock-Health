import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield,
  CheckCircle,
  ArrowRight,
  Mail,
  ArrowLeft,
  Users,
  TrendingDown,
  Handshake
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const valuePropositions = {
  use: [
    {
      title: "Member Cost Navigation",
      description: "White-label AI tools help members understand EOBs, find in-network providers, and optimize their benefits usage",
      metric: "35% fewer member calls"
    },
    {
      title: "Claims Accuracy",
      description: "Identify overbilling and coding errors before they become costly disputes or legal issues",
      metric: "22% fewer appeals"
    },
    {
      title: "Provider Network Optimization",
      description: "Real-time pricing data helps negotiate better rates and identify outlier providers",
      metric: "12% cost reduction"
    },
    {
      title: "Member Satisfaction",
      description: "Transparent billing tools improve member experience and reduce churn to competitors",
      metric: "+18 NPS points"
    }
  ],
  acquire: [
    {
      title: "Defensive Acquisition",
      description: "Control technology that could disrupt traditional insurance models before competitors do",
      value: "Strategic protection"
    },
    {
      title: "Data & Intelligence",
      description: "Access proprietary pricing benchmarks, billing patterns, and consumer behavior data",
      value: "Unique market insights"
    },
    {
      title: "Technology Stack",
      description: "Production-ready AI models for billing analysis, price comparison, and member communication",
      value: "Immediate deployment"
    },
    {
      title: "Talent Acquisition",
      description: "Experienced team with healthcare AI, consumer product, and insurance domain expertise",
      value: "Ready to integrate"
    }
  ],
  invest: [
    {
      title: "Ecosystem Alignment",
      description: "Invest in tools that make the insurance experience better for your members",
      benefit: "Member value creation"
    },
    {
      title: "Competitive Intelligence",
      description: "Gain visibility into how patients interact with medical bills and insurance claims",
      benefit: "Market insights"
    },
    {
      title: "Product Co-Development",
      description: "Influence roadmap to build features that serve your specific member needs",
      benefit: "Custom solutions"
    },
    {
      title: "Distribution Partnership",
      description: "Offer GoldRock as a member benefit, creating new value proposition for employers",
      benefit: "Differentiation"
    }
  ]
};

const insurerBenefits = [
  "Reduced claims disputes and appeals processing costs",
  "Improved member satisfaction scores and retention",
  "Better provider network negotiation leverage",
  "Proactive fraud and abuse detection",
  "Compliance with transparency regulations",
  "Enhanced employer client value proposition"
];

export default function ForInsurance() {
  return (
    <>
      <SEOHead
        title="For Insurance Companies - Partnership Opportunities | GoldRock Health"
        description="Explore partnership options with GoldRock Health. License our AI for member services, explore strategic acquisition, or invest in healthcare transparency technology."
        keywords={["insurance partnership", "health insurance technology", "claims management AI", "member experience"]}
        canonicalPath="/for-insurance"
      />

      <MobileHeader title="For Insurance" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300" data-testid="button-back">
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
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-4">
              Insurance Partners
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shape the Future of Healthcare Transparency
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Healthcare transparency is inevitable. The question is whether you'll lead it or react to it. 
              GoldRock Health offers multiple paths to engage with this transformation.
            </p>
          </motion.div>

          <Tabs defaultValue="use" className="mb-10">
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-6 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="use" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-insurance-license">
                License
              </TabsTrigger>
              <TabsTrigger value="invest" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-insurance-invest">
                Invest
              </TabsTrigger>
              <TabsTrigger value="acquire" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-insurance-acquire">
                Acquire
              </TabsTrigger>
            </TabsList>

            <TabsContent value="use">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {valuePropositions.use.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                            {item.metric}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Benefits for Insurers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {insurerBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invest">
              <div className="grid md:grid-cols-2 gap-4">
                {valuePropositions.invest.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                            {item.benefit}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="acquire">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {valuePropositions.acquire.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs">
                            {item.value}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                <CardContent className="py-8 text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    Strategic Acquisition
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Control technology that shapes healthcare transparency on your terms.
                  </p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => window.location.href = 'mailto:bd@goldrockhealth.com?subject=Insurance Acquisition Inquiry'}
                    data-testid="button-acquisition-inquiry"
                  >
                    <Handshake className="h-4 w-4 mr-2" />
                    Discuss Acquisition
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-10 text-center">
              <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Confidential Discussion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                We understand the sensitive nature of these conversations. 
                Our team is prepared for confidential discussions under NDA.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = 'mailto:insurance@goldrockhealth.com?subject=Confidential Insurance Partnership Inquiry'}
                  data-testid="button-insurance-contact"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Confidential Meeting
                </Button>
                <Link href="/for-vcs">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-600" data-testid="button-view-investment">
                    View Investment Terms
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
