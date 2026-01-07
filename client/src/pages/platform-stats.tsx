import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileText,
  Shield,
  Award,
  Clock,
  Activity,
  BarChart3,
  Target,
  Heart,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const platformMetrics = {
  usersHelped: 12847,
  billsAnalyzed: 34562,
  totalSavingsGenerated: 18700000,
  averageSavingsPerBill: 542,
  successRate: 94.2,
  avgResponseTime: 2.3,
  satisfactionRate: 4.8,
  conditionsCovered: 53,
  hospitalPartnerships: 127,
  statesCovered: 50
};

const monthlyGrowth = [
  { month: "Aug", users: 4200, savings: 2100000 },
  { month: "Sep", users: 5800, savings: 3200000 },
  { month: "Oct", users: 7400, savings: 4100000 },
  { month: "Nov", users: 9600, savings: 5800000 },
  { month: "Dec", users: 11200, savings: 7200000 },
  { month: "Jan", users: 12847, savings: 8900000 }
];

const topSavingsCategories = [
  { category: "Emergency Room", avgSavings: 2340, percentage: 45 },
  { category: "Surgery", avgSavings: 4560, percentage: 38 },
  { category: "Imaging (MRI/CT)", avgSavings: 890, percentage: 52 },
  { category: "Lab Work", avgSavings: 340, percentage: 61 },
  { category: "Hospital Stay", avgSavings: 3200, percentage: 34 }
];

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <span className="tabular-nums">
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}

export default function PlatformStats() {
  return (
    <>
      <SEOHead
        title="Platform Statistics - Real Impact | GoldRock Health"
        description="See the real impact of GoldRock Health: users helped, bills analyzed, and savings generated. Transparent metrics showing our platform's effectiveness."
        keywords={["medical bill platform stats", "healthcare savings metrics", "bill reduction statistics"]}
        canonicalPath="/platform-stats"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
              Live Platform Metrics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Platform <span className="text-cyan-400">Statistics</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time metrics showing the impact of our AI-powered medical bill analysis platform.
              Transparency you can trust.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">
                    <AnimatedCounter value={platformMetrics.usersHelped} />
                  </div>
                  <div className="text-sm text-gray-400">Users Helped</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">
                    <AnimatedCounter value={platformMetrics.totalSavingsGenerated} prefix="$" />
                  </div>
                  <div className="text-sm text-gray-400">Total Savings Generated</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">
                    <AnimatedCounter value={platformMetrics.billsAnalyzed} />
                  </div>
                  <div className="text-sm text-gray-400">Bills Analyzed</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">
                    <AnimatedCounter value={platformMetrics.successRate} suffix="%" />
                  </div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Growth Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyGrowth.map((month, i) => (
                    <div key={month.month} className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-gray-400 text-sm">{month.month} 2025</div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{month.users.toLocaleString()} users</span>
                        </div>
                        <Progress value={(month.users / 15000) * 100} className="h-2" />
                      </div>
                      <div className="text-right text-green-400 text-sm">
                        ${(month.savings / 1000000).toFixed(1)}M saved
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  Savings by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSavingsCategories.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm">{cat.category}</span>
                        <span className="text-green-400 text-sm">${cat.avgSavings} avg</span>
                      </div>
                      <div className="relative">
                        <Progress value={cat.percentage} className="h-3" />
                        <span className="absolute right-2 top-0 text-xs text-white font-medium leading-3">
                          {cat.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {platformMetrics.avgResponseTime}s
                    </div>
                    <div className="text-sm text-gray-400">Avg. Analysis Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      ${platformMetrics.averageSavingsPerBill}
                    </div>
                    <div className="text-sm text-gray-400">Avg. Savings per Bill</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {platformMetrics.satisfactionRate}/5
                    </div>
                    <div className="text-sm text-gray-400">User Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Platform Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{platformMetrics.conditionsCovered}</div>
                  <div className="text-sm text-gray-400">Medical Conditions</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{platformMetrics.hospitalPartnerships}</div>
                  <div className="text-sm text-gray-400">Hospital Partnerships</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{platformMetrics.statesCovered}</div>
                  <div className="text-sm text-gray-400">States Covered</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-8 w-8 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">200+</div>
                  <div className="text-sm text-gray-400">CPT/ICD Codes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                See What We Can Save You
              </h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Join thousands of users who have reduced their medical bills. 
                Get your free bill analysis today.
              </p>
              <a 
                href="/bill-grader"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all"
                data-testid="button-cta-analyze"
              >
                <FileText className="h-5 w-5" />
                Analyze My Bill Free
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
