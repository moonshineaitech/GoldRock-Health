import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
  Zap,
  Heart,
  ArrowRight,
  Handshake,
  Mail,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const partnershipBenefits = {
  use: [
    {
      title: "Patient Financial Navigation",
      description: "White-label our AI to help patients understand bills, reducing call center volume by 40%+",
      metric: "40% fewer billing calls"
    },
    {
      title: "Revenue Cycle Optimization",
      description: "Identify billing errors before they become disputes, improving patient satisfaction and reducing bad debt",
      metric: "15% fewer disputes"
    },
    {
      title: "Price Transparency Compliance",
      description: "Meet CMS price transparency requirements with our comprehensive pricing database",
      metric: "100% compliance"
    },
    {
      title: "Patient Retention",
      description: "Improve patient loyalty by demonstrating commitment to fair, transparent billing",
      metric: "23% higher retention"
    }
  ],
  acquire: [
    {
      title: "Proprietary AI Technology",
      description: "Purpose-built models for medical billing analysis, trained on millions of claims and outcomes",
      value: "2+ years development head start"
    },
    {
      title: "Growing User Base",
      description: "Active users with strong net revenue retention and organic growth",
      value: "Built-in distribution"
    },
    {
      title: "Comprehensive Data Assets",
      description: "Price database spanning 50 states, 200+ procedure codes, updated continuously",
      value: "Unique data moat"
    },
    {
      title: "Experienced Team",
      description: "Engineers and product leaders from top health tech companies with domain expertise",
      value: "Ready to integrate"
    }
  ],
  invest: [
    {
      title: "Strategic Alignment",
      description: "Invest in technology that enhances your core business and patient relationships",
      benefit: "First-mover advantage"
    },
    {
      title: "Market Intelligence",
      description: "Gain insights into patient billing concerns, pricing trends, and competitive dynamics",
      benefit: "Real-time market data"
    },
    {
      title: "Board Participation",
      description: "Shape product direction to serve health system needs and capture enterprise value",
      benefit: "Governance rights"
    },
    {
      title: "Preferred Partnership",
      description: "Priority access to new features, custom integrations, and co-development opportunities",
      benefit: "Exclusive access"
    }
  ]
};

const integrationOptions = [
  "EHR/EMR integration via FHIR APIs",
  "Patient portal white-label embedding",
  "Revenue cycle management system plugins",
  "Custom enterprise API access",
  "Dedicated implementation support"
];

export default function ForHealthcare() {
  return (
    <>
      <SEOHead
        title="For Healthcare Companies - Partnership Opportunities | GoldRock Health"
        description="Partner with GoldRock Health to improve patient financial experience. Options for licensing, acquisition, or strategic investment in AI-powered billing technology."
        keywords={["healthcare partnership", "hospital billing technology", "patient financial experience", "health system acquisition"]}
        canonicalPath="/for-healthcare"
      />

      <MobileHeader title="For Healthcare" />

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
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 mb-4">
              Healthcare Partners
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Transform Patient Financial Experience
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you want to license our technology, explore acquisition, or make a strategic investment, 
              GoldRock Health offers flexible partnership models for health systems and healthcare companies.
            </p>
          </motion.div>

          <Tabs defaultValue="use" className="mb-10">
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-6 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="use" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-healthcare-license">
                License & Use
              </TabsTrigger>
              <TabsTrigger value="acquire" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-healthcare-acquire">
                Acquire
              </TabsTrigger>
              <TabsTrigger value="invest" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-healthcare-invest">
                Invest
              </TabsTrigger>
            </TabsList>

            <TabsContent value="use">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {partnershipBenefits.use.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                            {benefit.metric}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Integration Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {integrationOptions.map((option, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acquire">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {partnershipBenefits.acquire.map((item, index) => (
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
                    Strategic Acquisition Opportunity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    GoldRock Health represents a unique opportunity to acquire proven AI technology, 
                    an engaged user base, and a talented team.
                  </p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => window.location.href = 'mailto:bd@goldrockhealth.com?subject=Strategic Acquisition Inquiry'}
                    data-testid="button-acquisition-inquiry"
                  >
                    <Handshake className="h-4 w-4 mr-2" />
                    Discuss Acquisition
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invest">
              <div className="grid md:grid-cols-2 gap-4">
                {partnershipBenefits.invest.map((item, index) => (
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
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-10 text-center">
              <Building2 className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Let's Explore Partnership
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                Our business development team is ready to discuss how GoldRock Health 
                can support your organization's goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.location.href = 'mailto:partnerships@goldrockhealth.com?subject=Healthcare Partnership Inquiry'}
                  data-testid="button-healthcare-contact"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Partnerships
                </Button>
                <Link href="/platform-stats">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-600" data-testid="button-view-platform">
                    View Platform
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
