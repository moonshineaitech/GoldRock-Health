import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  DollarSign,
  FileText,
  Calculator,
  Search,
  Shield,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const commonErrors = [
  {
    name: "Duplicate Charges",
    description: "The same service or medication listed multiple times on your bill.",
    example: "Charged twice for the same blood test performed once.",
    frequency: "Occurs in ~10% of hospital bills",
    savings: "$50 - $500"
  },
  {
    name: "Upcoding",
    description: "Being charged for a more expensive procedure or service than what was provided.",
    example: "Billed for a complex office visit (99215) when you had a simple consultation (99213).",
    frequency: "Found in ~15% of bills",
    savings: "$100 - $2,000"
  },
  {
    name: "Unbundling",
    description: "Separating procedures that should be billed together at a lower bundled rate.",
    example: "Lab panel tests billed individually instead of as a comprehensive panel.",
    frequency: "Common in lab and surgical bills",
    savings: "$200 - $1,500"
  },
  {
    name: "Balance Billing",
    description: "Being billed for the difference between what the provider charges and what insurance pays (often illegal).",
    example: "Out-of-network anesthesiologist billing you $3,000 after emergency surgery.",
    frequency: "Illegal in many cases under No Surprises Act",
    savings: "$500 - $10,000+"
  },
  {
    name: "Incorrect Patient Information",
    description: "Wrong insurance information, date of birth, or other data causing claim denials.",
    example: "Insurance claim denied because your birth date was entered incorrectly.",
    frequency: "Causes ~5% of claim denials",
    savings: "Full claim amount"
  },
  {
    name: "Services Not Rendered",
    description: "Being charged for services, tests, or supplies you never received.",
    example: "Billed for physical therapy sessions you didn't attend.",
    frequency: "Found in ~3-5% of bills",
    savings: "Varies widely"
  },
  {
    name: "Incorrect Quantity",
    description: "Being charged for more units of medication or supplies than you received.",
    example: "Billed for 10 doses of medication when you only received 5.",
    frequency: "Common with medication charges",
    savings: "$20 - $500"
  },
  {
    name: "Operating Room Time Errors",
    description: "Being charged for more time in the OR than your surgery actually took.",
    example: "Billed for 3 hours of OR time when surgery took 90 minutes.",
    frequency: "Common in surgical bills",
    savings: "$500 - $5,000"
  },
  {
    name: "Inflated Supply Charges",
    description: "Hospital charging extreme markups on basic supplies.",
    example: "Being charged $50 for a single aspirin or $500 for a neck brace.",
    frequency: "Very common",
    savings: "$100 - $2,000"
  },
  {
    name: "Wrong Procedure Codes",
    description: "Incorrect CPT codes that don't match the service you received.",
    example: "Billed for a surgical procedure when you had a diagnostic test.",
    frequency: "Occurs in ~5% of bills",
    savings: "$200 - $5,000"
  },
  {
    name: "Missing Modifiers",
    description: "Absence of billing modifiers that would reduce the charge or clarify the service.",
    example: "Missing modifier indicating the procedure was performed on the left side only.",
    frequency: "Common coding oversight",
    savings: "$50 - $500"
  },
  {
    name: "Admission Status Errors",
    description: "Being classified as inpatient when you should be observation status, or vice versa.",
    example: "Classified as inpatient overnight when you were observation status.",
    frequency: "Can affect Medicare coverage significantly",
    savings: "$1,000 - $10,000+"
  }
];

export default function MedicalBillErrorsGuide() {
  return (
    <>
      <SEOHead
        title="12 Common Medical Bill Errors That Cost You Money | GoldRock Health"
        description="Learn to identify the 12 most common billing errors that cost Americans billions annually. Includes real examples and how much each error typically costs patients."
        keywords={["medical bill errors", "hospital billing mistakes", "healthcare billing fraud", "duplicate charges", "upcoding", "unbundling"]}
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/articles">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors" data-testid="button-back-articles">
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
              <Badge className="bg-secondary text-gold border border-border mb-4">
                Bill Analysis
              </Badge>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                The Complete Guide to Finding Errors on Your Medical Bill
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Medical billing errors are extremely common in hospital bills, costing Americans 
                billions of dollars annually. Learn to identify the 12 most common mistakes 
                and how to dispute them.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>8 min read</span>
                <span>•</span>
                <span>Last updated January 2026</span>
              </div>
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <Card className="luxury-card mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-destructive mb-2">The Problem is Massive</h3>
                      <p className="text-muted-foreground">
                        Medical billing errors are one of the most common issues patients face. 
                        These errors result in significant overcharges across the United States. 
                        Most patients never check their bills, meaning they pay for errors without knowing it.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                The 12 Most Common Medical Billing Errors
              </h2>

              <div className="space-y-6">
                {commonErrors.map((error, index) => (
                  <Card key={error.name} className="luxury-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground flex items-center gap-3">
                          <span className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-foreground font-bold text-sm">
                            {index + 1}
                          </span>
                          {error.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-border">
                          Potential Savings: {error.savings}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{error.description}</p>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-gold">Example:</strong> {error.example}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{error.frequency}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                How to Spot These Errors on Your Bill
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      Request an Itemized Bill
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Always request a fully itemized bill showing every charge. 
                    Summary bills hide errors. You have the legal right to an itemized statement.
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Search className="w-5 h-5 text-muted-foreground" />
                      Compare Against Your Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Keep notes during your hospital stay. Compare your bill against 
                    what you actually received. Check dates, times, and quantities.
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-muted-foreground" />
                      Look Up Fair Prices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Use resources like FAIR Health or Medicare's price lookup 
                    to compare your charges against regional averages.
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      Understand Your Insurance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Review your EOB (Explanation of Benefits) carefully. 
                    Make sure insurance applied all your benefits correctly.
                  </CardContent>
                </Card>
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                What to Do When You Find an Error
              </h2>

              <ol className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">1</span>
                  <div>
                    <strong className="text-foreground">Document Everything</strong>
                    <p className="text-muted-foreground">Keep copies of all bills, EOBs, and correspondence. Note dates and names of everyone you speak with.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">2</span>
                  <div>
                    <strong className="text-foreground">Contact the Billing Department</strong>
                    <p className="text-muted-foreground">Call the hospital or provider's billing department. Explain the error clearly and request a correction.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">3</span>
                  <div>
                    <strong className="text-foreground">Follow Up in Writing</strong>
                    <p className="text-muted-foreground">Send a formal dispute letter via certified mail. This creates a paper trail and shows you're serious.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">4</span>
                  <div>
                    <strong className="text-foreground">Escalate if Necessary</strong>
                    <p className="text-muted-foreground">If the provider won't correct the error, file complaints with your state insurance commissioner and the hospital's patient advocate.</p>
                  </div>
                </li>
              </ol>
            </div>

            <Card className="luxury-card mt-12">
              <CardContent className="py-8 text-center">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Let AI Find Errors For You
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our AI-powered Bill Grader analyzes your medical bills in seconds, 
                  identifying potential errors, overcharges, and savings opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bill-grader">
                    <button className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-all flex items-center gap-2" data-testid="button-try-bill-grader">
                      <TrendingDown className="w-5 h-5" />
                      Try Bill Grader Free
                    </button>
                  </Link>
                  <Link href="/conditions">
                    <button className="px-6 py-3 bg-card border border-border hover:bg-secondary text-foreground font-semibold rounded-lg transition-all" data-testid="button-fair-prices">
                      Look Up Fair Prices
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
