import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  TrendingDown, 
  DollarSign, 
  FileText,
  CheckCircle,
  Quote,
  Users,
  Building2,
  Heart,
  Stethoscope,
  Baby
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const caseStudies = [
  {
    id: "emergency-room-sarah",
    title: "Emergency Room Visit",
    subtitle: "$12,400 to $3,200",
    originalBill: 12400,
    finalBill: 3200,
    savings: 9200,
    savingsPercent: 74,
    patientName: "Sarah M.",
    location: "Austin, TX",
    category: "Emergency",
    icon: Heart,
    iconColor: "text-red-400",
    bgColor: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
    situation: "Sarah visited the ER with severe abdominal pain. After tests, she was diagnosed with appendicitis and referred to a surgeon. The ER bill alone was $12,400.",
    actions: [
      "Requested itemized bill - found duplicate charges for blood work",
      "Identified upcoding on evaluation and management (E&M) codes",
      "Applied for hospital's charity care program (non-profit hospital)",
      "Negotiated remaining balance citing fair market prices"
    ],
    result: "The hospital corrected $2,100 in billing errors, approved 60% charity care discount, and accepted a lump sum payment for the remaining balance.",
    quote: "I was terrified of this bill destroying my savings. GoldRock helped me understand my options and I saved over $9,000."
  },
  {
    id: "mri-scan-michael",
    title: "MRI Scan",
    subtitle: "$4,500 to $890",
    originalBill: 4500,
    finalBill: 890,
    savings: 3610,
    savingsPercent: 80,
    patientName: "Michael R.",
    location: "Phoenix, AZ",
    category: "Imaging",
    icon: Stethoscope,
    iconColor: "text-blue-400",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    situation: "Michael needed a knee MRI before surgery. His hospital quoted $4,500 but his high-deductible plan meant he'd pay the full amount.",
    actions: [
      "Used our price comparison tool to find independent imaging centers",
      "Requested cash-pay pricing from multiple facilities",
      "Negotiated with original hospital using competitor prices",
      "Scheduled at an independent imaging center with same quality"
    ],
    result: "Instead of paying $4,500 at the hospital, Michael got the same MRI at an independent center for $890 - an 80% savings.",
    quote: "I had no idea the same exact MRI could cost so different amounts. The platform saved me over $3,600 just by showing me my options."
  },
  {
    id: "surgery-jennifer",
    title: "Orthopedic Surgery",
    subtitle: "$45,000 to $18,500",
    originalBill: 45000,
    finalBill: 18500,
    savings: 26500,
    savingsPercent: 59,
    patientName: "Jennifer L.",
    location: "Denver, CO",
    category: "Surgery",
    icon: Building2,
    iconColor: "text-purple-400",
    bgColor: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/30",
    situation: "Jennifer had knee replacement surgery at a for-profit hospital. Even after insurance, she faced a $45,000 bill that exceeded her out-of-pocket maximum.",
    actions: [
      "Verified insurance applied correct in-network rates",
      "Discovered facility charged out-of-network rates despite in-network surgeon",
      "Filed No Surprises Act complaint with federal government",
      "Negotiated directly with hospital billing department"
    ],
    result: "The hospital was forced to apply in-network rates per the No Surprises Act, reducing the bill by over $20,000. Additional negotiation reduced it further.",
    quote: "The hospital was breaking the law and I didn't even know it. GoldRock's analysis caught something that would have cost me $26,000."
  },
  {
    id: "childbirth-david",
    title: "Childbirth & Hospital Stay",
    subtitle: "$28,000 to $8,400",
    originalBill: 28000,
    finalBill: 8400,
    savings: 19600,
    savingsPercent: 70,
    patientName: "David & Maria T.",
    location: "Atlanta, GA",
    category: "Maternity",
    icon: Baby,
    iconColor: "text-pink-400",
    bgColor: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    situation: "David and Maria had their first child. Despite having insurance, the combined bills from the hospital, OB/GYN, anesthesiologist, and pediatrician totaled $28,000.",
    actions: [
      "Reviewed all bills for duplicate charges across providers",
      "Found unbundled charges that should have been included in delivery fee",
      "Identified out-of-network anesthesiologist (not their choice)",
      "Applied for hospital's financial assistance as a growing family"
    ],
    result: "Billing corrections saved $6,000. The hospital waived the out-of-network anesthesia charges under surprise billing rules. Financial assistance covered 50% of remaining balance.",
    quote: "We were starting our family with crushing debt. Now we can focus on our baby instead of worrying about bills."
  }
];

const totalSavings = caseStudies.reduce((sum, cs) => sum + cs.savings, 0);

export default function CaseStudies() {
  return (
    <>
      <SEOHead
        title="Real Patient Success Stories - Medical Bill Savings | GoldRock Health"
        description="See real examples of patients who saved thousands on medical bills. Case studies showing how AI analysis and negotiation reduced emergency room, surgery, and imaging costs."
        keywords={["medical bill success stories", "hospital bill reduction examples", "patient savings case studies"]}
        canonicalPath="/case-studies"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
              Real Results
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Patient <span className="text-green-400">Success Stories</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Real patients who used our platform to reduce their medical bills. 
              Names changed for privacy, but the savings are real.
            </p>

            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">
                  ${totalSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Combined Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">
                  {caseStudies.length}
                </div>
                <div className="text-sm text-gray-400">Case Studies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">
                  {Math.round(caseStudies.reduce((sum, cs) => sum + cs.savingsPercent, 0) / caseStudies.length)}%
                </div>
                <div className="text-sm text-gray-400">Avg. Reduction</div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${study.bgColor} ${study.borderColor}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center`}>
                          <study.icon className={`h-6 w-6 ${study.iconColor}`} />
                        </div>
                        <div>
                          <Badge className="bg-white/10 text-gray-300 border-white/20 mb-1">
                            {study.category}
                          </Badge>
                          <CardTitle className="text-white text-xl">{study.title}</CardTitle>
                          <div className="text-gray-400">{study.patientName} • {study.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-400">
                          ${study.savings.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {study.savingsPercent}% savings
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4 bg-white/5 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Original Bill</div>
                        <div className="text-xl font-bold text-red-400">
                          ${study.originalBill.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center flex items-center justify-center">
                        <TrendingDown className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Final Bill</div>
                        <div className="text-xl font-bold text-green-400">
                          ${study.finalBill.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">The Situation</h4>
                      <p className="text-gray-300 text-sm">{study.situation}</p>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Actions Taken</h4>
                      <ul className="space-y-2">
                        {study.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">The Result</h4>
                      <p className="text-gray-300 text-sm">{study.result}</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-cyan-500">
                      <Quote className="h-5 w-5 text-cyan-400 mb-2" />
                      <p className="text-gray-300 italic text-sm">"{study.quote}"</p>
                      <div className="text-cyan-400 text-sm mt-2">— {study.patientName}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 mt-12 max-w-4xl mx-auto">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Start Your Savings Story
              </h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Join thousands of patients who have reduced their medical bills. 
                Get your free bill analysis today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/bill-grader">
                  <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all flex items-center gap-2" data-testid="button-grade-bill">
                    <FileText className="h-5 w-5" />
                    Grade My Bill
                  </button>
                </Link>
                <Link href="/platform-stats">
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all" data-testid="button-view-stats">
                    View Platform Stats
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
