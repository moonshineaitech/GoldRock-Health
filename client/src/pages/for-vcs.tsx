import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Building2,
  Target,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Rocket,
  Mail,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const fundingDetails = {
  round: "Series A",
  target: "$15M",
  use: [
    "Scale AI infrastructure and model training",
    "Expand B2B enterprise sales team",
    "Strategic partnerships with health systems",
    "Regulatory compliance and certifications"
  ],
  timeline: "Q2 2026"
};

const investmentThesis = [
  {
    title: "Massive Market Opportunity",
    description: "$140B in patient out-of-pocket costs, with only 0.1% of denied claims appealed. We're democratizing access to billing expertise.",
    metric: "$140B SAM"
  },
  {
    title: "Strong Unit Economics",
    description: "LTV:CAC ratio of 8:1 with payback period under 3 months. Negative churn through expansion revenue.",
    metric: "8:1 LTV:CAC"
  },
  {
    title: "AI-First Moat",
    description: "Proprietary models trained on millions of billing codes, negotiation outcomes, and price benchmarks. Data flywheel accelerates with scale.",
    metric: "200M+ data points"
  },
  {
    title: "Multi-Rail Revenue",
    description: "B2C subscriptions, B2B API licensing, affiliate partnerships, and white-label solutions create diversified, recurring revenue.",
    metric: "4 revenue streams"
  }
];

const comparables = [
  { company: "Devoted Health", valuation: "$12.6B", category: "Medicare Tech" },
  { company: "Clover Health", valuation: "$3.2B", category: "Health Insurance AI" },
  { company: "Collective Health", valuation: "$1.1B", category: "Benefits Platform" },
  { company: "Ribbon Health", valuation: "$225M", category: "Healthcare Data" }
];

export default function ForVCs() {
  return (
    <>
      <SEOHead
        title="For Venture Capitalists - Investment Opportunity | GoldRock Health"
        description="Series A investment opportunity in AI-powered healthcare cost reduction. GoldRock Health is transforming the $4.5T healthcare market."
        keywords={["healthcare VC investment", "healthtech Series A", "medical AI startup investment"]}
        canonicalPath="/for-vcs"
      />

      <MobileHeader title="For VCs" />

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
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-4">
              Series A Opportunity
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Invest in Healthcare Transparency
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              GoldRock Health is building the infrastructure layer for healthcare cost intelligence. 
              AI that saves patients billions while creating massive enterprise value.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-base px-4 py-2">
                {fundingDetails.round}: {fundingDetails.target}
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-base px-4 py-2">
                Target Close: {fundingDetails.timeline}
              </Badge>
            </div>
          </motion.div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Investment Thesis
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {investmentThesis.map((thesis, index) => (
              <motion.div
                key={thesis.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{thesis.title}</h3>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs">
                        {thesis.metric}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{thesis.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Use of Funds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {fundingDetails.use.map((use, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      {use}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Target Raise</div>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">{fundingDetails.target}</div>
                  <div className="text-sm text-gray-500 mt-1">Pre-money: $50M-$60M</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Comparable Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {comparables.map((comp) => (
                    <div key={comp.company} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <div className="text-gray-900 dark:text-white font-medium text-sm">{comp.company}</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{comp.valuation}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comp.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-10 text-center">
              <Briefcase className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Schedule a Partner Meeting
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                Request our full data room including financial model, cap table, 
                customer cohort analysis, and product roadmap.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => window.location.href = 'mailto:founders@goldrockhealth.com?subject=VC Partner Meeting Request'}
                  data-testid="button-schedule-meeting"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = 'mailto:investors@goldrockhealth.com?subject=Data Room Access Request'}
                  data-testid="button-request-data-room"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Data Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
