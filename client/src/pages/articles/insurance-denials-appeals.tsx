import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Shield, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Phone,
  Scale,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const denialReasons = [
  {
    reason: "Not Medically Necessary",
    description: "Insurance claims the treatment wasn't needed",
    appealStrategy: "Get a letter from your doctor explaining medical necessity with supporting documentation"
  },
  {
    reason: "Out of Network",
    description: "Provider not in your insurance network",
    appealStrategy: "If emergency care, cite No Surprises Act. Otherwise, request network exception or gap exception"
  },
  {
    reason: "Prior Authorization Not Obtained",
    description: "Service required advance approval that wasn't secured",
    appealStrategy: "Request retroactive authorization or show it was an emergency that couldn't wait"
  },
  {
    reason: "Service Not Covered",
    description: "Treatment excluded from your plan",
    appealStrategy: "Review policy carefully - sometimes it IS covered. Request external review if denied"
  },
  {
    reason: "Coding Error",
    description: "Wrong procedure or diagnosis codes submitted",
    appealStrategy: "Request provider resubmit with correct codes - this is usually easily fixed"
  },
  {
    reason: "Duplicate Claim",
    description: "Insurance believes this was already paid",
    appealStrategy: "Provide documentation showing these are separate services/dates"
  }
];

export default function InsuranceDenialsAppeals() {
  return (
    <>
      <SEOHead
        title="Fighting Insurance Denials: Complete Appeals Guide | GoldRock Health"
        description="Insurance companies deny 1 in 5 claims. Learn the appeal process that successfully overturns 50%+ of denials with our step-by-step guide."
        keywords={["insurance denial appeal", "claim denied", "health insurance appeal", "medical claim rejection", "overturn insurance denial"]}
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/articles">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </button>
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mb-12">
              <Badge className="bg-secondary text-emerald-700 dark:text-emerald-400 border border-border mb-4">
                Insurance
              </Badge>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                Fighting Insurance Denials: Your Complete Appeals Guide
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Insurance companies deny approximately 20% of claims, but most patients never appeal. 
                Those who do appeal win more than half the time. Learn how to fight back.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>12 min read</span>
                <span>•</span>
                <span>Last updated January 2026</span>
              </div>
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <Card className="luxury-card mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-2">Key Statistics</h3>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <strong>18-20%</strong> of in-network claims are denied</li>
                        <li>• Only <strong>0.1%</strong> of denied claims are appealed</li>
                        <li>• <strong>45-60%</strong> of appeals are successful</li>
                        <li>• You have the legal right to at least 2 levels of internal appeal</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                Common Denial Reasons & How to Fight Them
              </h2>

              <div className="space-y-6 mb-12">
                {denialReasons.map((denial) => (
                  <Card key={denial.reason} className="luxury-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">{denial.reason}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">{denial.description}</p>
                      <div className="bg-muted rounded-lg p-4 border-l-4 border-emerald-600">
                        <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                          <strong>Appeal Strategy:</strong> {denial.appealStrategy}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                The Appeals Process: Step by Step
              </h2>

              <div className="space-y-6 mb-8">
                <Card className="luxury-card">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">1</span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Understand the Denial</h3>
                        <p className="text-muted-foreground mb-3">
                          Read the Explanation of Benefits (EOB) carefully. Call the insurance company 
                          to get the specific reason code and explanation. Document the call including 
                          date, time, and representative name.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Do this within 1 week of receiving denial</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">2</span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Gather Evidence</h3>
                        <p className="text-muted-foreground mb-3">
                          Collect all relevant documentation: medical records, doctor's notes, 
                          test results, treatment history, and any prior authorizations. 
                          Get a letter of medical necessity from your treating physician.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span>The more documentation, the better</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">3</span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">File Internal Appeal (Level 1)</h3>
                        <p className="text-muted-foreground mb-3">
                          Submit a formal written appeal to your insurance company. Include your 
                          denial letter, all supporting documentation, and a clear explanation of 
                          why the denial was wrong. Send via certified mail.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Must be filed within 180 days of denial (check your plan)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">4</span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Internal Appeal (Level 2)</h3>
                        <p className="text-muted-foreground mb-3">
                          If Level 1 is denied, you're entitled to a second internal appeal. 
                          This is reviewed by different people than the first appeal. 
                          Add any new evidence or arguments.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>Request a phone meeting with the medical reviewer</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">5</span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">External Review</h3>
                        <p className="text-muted-foreground mb-3">
                          After exhausting internal appeals, you can request an external review 
                          by an independent third party. This is free and the decision is binding 
                          on the insurance company.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Scale className="w-4 h-4" />
                          <span>External reviewers overturn denials 40-50% of the time</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                Appeal Letter Template
              </h2>

              <Card className="luxury-card mb-8">
                <CardContent className="py-6">
                  <pre className="text-muted-foreground text-sm whitespace-pre-wrap font-mono">
{`[Your Name]
[Your Address]
[Date]

[Insurance Company Name]
[Claims Appeal Department]
[Address]

Re: Appeal of Claim Denial
Member ID: [Your ID]
Claim Number: [Claim #]
Date of Service: [Date]

Dear Appeals Review Committee,

I am writing to formally appeal the denial of my claim for [procedure/service] 
performed on [date] by [provider name].

The denial stated: [quote the reason from your EOB]

I am appealing this decision because [explain why the denial is wrong]:

1. [First reason with supporting evidence]
2. [Second reason with supporting evidence]
3. [Third reason with supporting evidence]

Enclosed please find the following supporting documentation:
- Letter of Medical Necessity from [Doctor's Name]
- Relevant medical records
- [Other documents]

Based on this evidence, I respectfully request that you reverse the denial 
and process this claim for payment. Please respond within 30 days as required 
by [state law/your plan terms].

Sincerely,
[Your signature]
[Your printed name]
[Phone number]
[Email]`}
                  </pre>
                </CardContent>
              </Card>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                Tips for a Successful Appeal
              </h2>

              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Act quickly:</strong> Note all deadlines and don't miss them</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Be specific:</strong> Address the exact reason for denial</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Get your doctor involved:</strong> A letter from your physician is powerful</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Document everything:</strong> Keep copies and send certified mail</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Stay persistent:</strong> Many claims are approved on second or third appeal</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Know your rights:</strong> Contact your state insurance commissioner if needed</span>
                </li>
              </ul>
            </div>

            <Card className="luxury-card mt-12">
              <CardContent className="py-8 text-center">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Need Help Fighting a Denial?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our platform provides tools to analyze your denial, generate appeal letters, 
                  and understand your rights. Let us help you fight back.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/insurance-denials">
                    <button className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-all flex items-center gap-2" data-testid="button-denial-help">
                      <Shield className="w-5 h-5" />
                      Get Denial Help
                    </button>
                  </Link>
                  <Link href="/dispute-arsenal">
                    <button className="px-6 py-3 bg-card border border-border hover:bg-secondary text-foreground font-semibold rounded-lg transition-all" data-testid="button-templates">
                      View Appeal Templates
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.article>
        </div>
      </div>
    </>
  );
}
