import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2,
  Stethoscope,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Shield,
  Zap,
  Heart,
  BarChart3,
  ArrowRight,
  Handshake,
  Target,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      description: "12,000+ active users with 142% net revenue retention and strong organic growth",
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

const successStories = [
  {
    org: "Regional Health System",
    type: "6 hospitals, 2,400 beds",
    result: "43% reduction in billing-related patient complaints",
    quote: "GoldRock's AI helped us identify and correct billing issues proactively."
  },
  {
    org: "Specialty Practice Group",
    type: "Multi-state orthopedic group",
    result: "28% improvement in patient payment collection",
    quote: "Patients pay faster when they understand and trust their bills."
  }
];

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

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
              Healthcare Partners
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transform <span className="text-cyan-400">Patient Financial Experience</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you want to license our technology, explore acquisition, or make a strategic investment, 
              GoldRock Health offers flexible partnership models for health systems and healthcare companies.
            </p>
          </motion.div>

          <Tabs defaultValue="use" className="mb-12">
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-8 bg-white/5">
              <TabsTrigger value="use" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400" data-testid="tab-healthcare-license">
                License & Use
              </TabsTrigger>
              <TabsTrigger value="acquire" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400" data-testid="tab-healthcare-acquire">
                Acquire
              </TabsTrigger>
              <TabsTrigger value="invest" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400" data-testid="tab-healthcare-invest">
                Invest
              </TabsTrigger>
            </TabsList>

            <TabsContent value="use">
              <div className="grid md:grid-cols-2 gap-6">
                {partnershipBenefits.use.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-cyan-500/10 border-cyan-500/30 h-full">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {benefit.metric}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <Card className="bg-white/5 border-white/10 mt-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    Integration Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {integrationOptions.map((option, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 rounded-lg p-3">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acquire">
              <div className="grid md:grid-cols-2 gap-6">
                {partnershipBenefits.acquire.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-purple-500/10 border-purple-500/30 h-full">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {item.value}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 mt-8">
                <CardContent className="py-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Strategic Acquisition Opportunity
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    GoldRock Health represents a unique opportunity to acquire proven AI technology, 
                    an engaged user base, and a talented team. We're open to discussions with strategic acquirers 
                    who can accelerate our mission to make healthcare costs transparent.
                  </p>
                  <Button 
                    className="bg-purple-500 hover:bg-purple-600 text-white"
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
              <div className="grid md:grid-cols-2 gap-6">
                {partnershipBenefits.invest.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-green-500/10 border-green-500/30 h-full">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {item.benefit}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-400" />
            Partner Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {successStories.map((story, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{story.org}</h3>
                      <div className="text-sm text-gray-500">{story.type}</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {story.result}
                    </Badge>
                  </div>
                  <p className="text-gray-400 italic text-sm">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border-green-500/30">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Let's Explore Partnership
              </h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Our business development team is ready to discuss how GoldRock Health 
                can support your organization's goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold"
                  onClick={() => window.location.href = 'mailto:partnerships@goldrockhealth.com?subject=Healthcare Partnership Inquiry'}
                  data-testid="button-healthcare-contact"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Partnerships
                </Button>
                <Link href="/platform-stats">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" data-testid="button-view-platform">
                    View Platform Metrics
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
