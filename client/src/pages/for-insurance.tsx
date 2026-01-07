import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Zap,
  BarChart3,
  ArrowRight,
  Handshake,
  Target,
  Mail,
  Building2,
  FileText,
  AlertTriangle,
  Lightbulb,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  ],
  shelve: [
    {
      title: "Competitive Threat Neutralization",
      description: "Acquire technology that could empower patients to challenge insurance decisions at scale",
      consideration: "Risk mitigation"
    },
    {
      title: "Regulatory Arbitrage",
      description: "Control tools before regulators mandate patient access to similar capabilities",
      consideration: "Compliance positioning"
    },
    {
      title: "IP Control",
      description: "Own patents and proprietary methods for medical bill analysis and dispute assistance",
      consideration: "Defensive IP"
    },
    {
      title: "Market Shaping",
      description: "Influence the trajectory of healthcare transparency technology on your terms",
      consideration: "Strategic control"
    }
  ]
};

const riskAssessment = [
  {
    risk: "Patient Empowerment",
    description: "AI tools enable patients to identify billing errors and challenge inappropriate charges",
    mitigation: "Partner early to shape how technology is deployed"
  },
  {
    risk: "Regulatory Tailwinds",
    description: "Price transparency mandates and consumer protection laws favor patient advocacy tools",
    mitigation: "Be seen as supporting transparency, not opposing it"
  },
  {
    risk: "Employer Demand",
    description: "Self-insured employers increasingly seeking tools to reduce healthcare costs",
    mitigation: "Offer as value-add benefit rather than competitor"
  }
];

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

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">
              Insurance Partners
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shape the Future of <span className="text-cyan-400">Healthcare Transparency</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Healthcare transparency is inevitable. The question is whether you'll lead it or react to it. 
              GoldRock Health offers multiple paths to engage with this transformation.
            </p>
          </motion.div>

          <Tabs defaultValue="use" className="mb-12">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-white/5">
              <TabsTrigger value="use" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                License
              </TabsTrigger>
              <TabsTrigger value="invest" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Invest
              </TabsTrigger>
              <TabsTrigger value="acquire" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                Acquire
              </TabsTrigger>
              <TabsTrigger value="shelve" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
                Control
              </TabsTrigger>
            </TabsList>

            <TabsContent value="use">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {valuePropositions.use.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-cyan-500/10 border-cyan-500/30 h-full">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {item.metric}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Benefits for Insurers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {insurerBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300 text-sm bg-white/5 rounded-lg p-3">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invest">
              <div className="grid md:grid-cols-2 gap-6">
                {valuePropositions.invest.map((item, index) => (
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

            <TabsContent value="acquire">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {valuePropositions.acquire.map((item, index) => (
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
            </TabsContent>

            <TabsContent value="shelve">
              <Card className="bg-amber-500/10 border-amber-500/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-400" />
                    Strategic Control Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    We understand that some insurers may view patient empowerment technology as a competitive threat. 
                    We're pragmatic about the realities of the healthcare industry and open to discussions about 
                    strategic control arrangements.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {valuePropositions.shelve.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                            {item.consideration}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    Market Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskAssessment.map((risk, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">{risk.risk}</h4>
                          <p className="text-gray-400 text-sm mt-1">{risk.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Lightbulb className="h-4 w-4 text-cyan-400" />
                            <span className="text-cyan-400 text-sm">{risk.mitigation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Confidential Discussion
              </h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                We understand the sensitive nature of these conversations. 
                Our team is prepared for confidential discussions under NDA with appropriate stakeholders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  onClick={() => window.location.href = 'mailto:insurance@goldrockhealth.com?subject=Confidential Insurance Partnership Inquiry'}
                  data-testid="button-insurance-contact"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Confidential Meeting
                </Button>
                <Link href="/for-vcs">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" data-testid="button-view-investment">
                    View Investment Terms
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
