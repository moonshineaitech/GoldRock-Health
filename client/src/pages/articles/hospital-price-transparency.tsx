import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle,
  ExternalLink,
  Search,
  TrendingDown,
  DollarSign,
  Scale,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

export default function HospitalPriceTransparency() {
  return (
    <>
      <SEOHead
        title="Hospital Price Transparency: Your Right to Know Healthcare Costs | GoldRock Health"
        description="Federal law requires hospitals to publish prices. Learn how to use hospital price transparency data to save thousands on medical procedures and compare costs."
        keywords={["hospital price transparency", "healthcare costs", "medical procedure prices", "CMS price transparency rule", "hospital chargemaster"]}
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
                Healthcare Costs
              </Badge>
              <h1 className="text-4xl font-bold font-serif text-foreground mb-4">
                Hospital Price Transparency: Your Right to Know What You'll Pay
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Since January 2021, federal law requires hospitals to publish their prices. 
                This guide shows you how to use this data to compare costs and save thousands on medical care.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>6 min read</span>
                <span>•</span>
                <span>Last updated January 2026</span>
              </div>
            </header>

            <div className="max-w-none">
              <Card className="luxury-card mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <Scale className="w-8 h-8 text-gold flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">The Law is On Your Side</h3>
                      <p className="text-muted-foreground">
                        The CMS Hospital Price Transparency Rule requires all hospitals operating in the U.S. to provide 
                        clear, accessible pricing information for at least 300 shoppable services. Hospitals that don't 
                        comply face penalties of up to $2 million per year.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold font-serif text-foreground mt-12 mb-6">
                What Hospitals Must Disclose
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gold" />
                      Machine-Readable File
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    A comprehensive file containing all standard charges for all items and services, 
                    including gross charges, discounted cash prices, payer-specific negotiated rates, 
                    and de-identified minimum and maximum negotiated charges.
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gold" />
                      Consumer-Friendly Display
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    An online tool allowing patients to get personalized estimates for at least 
                    300 shoppable services. Must include typical associated services bundled together.
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-2xl font-bold font-serif text-foreground mt-12 mb-6">
                How to Find Hospital Prices
              </h2>

              <ol className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">1</span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Visit the Hospital's Website</h3>
                    <p className="text-muted-foreground">
                      Look for links like "Price Transparency," "Patient Billing," "Pricing," or "Financial Information." 
                      By law, this information must be accessible from the homepage within 3 clicks.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">2</span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Use the Price Estimator Tool</h3>
                    <p className="text-muted-foreground">
                      Enter your insurance information and the procedure you need. The tool should provide 
                      an estimate of your out-of-pocket costs, including any associated services.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">3</span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Download the Machine-Readable File</h3>
                    <p className="text-muted-foreground">
                      For detailed analysis, download the comprehensive pricing file (usually CSV or JSON format). 
                      This contains negotiated rates with each insurance company.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">4</span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Compare Multiple Hospitals</h3>
                    <p className="text-muted-foreground">
                      Prices can vary by 300-500% for the same procedure at different hospitals in the same city. 
                      Always compare at least 3 facilities before scheduling elective procedures.
                    </p>
                  </div>
                </li>
              </ol>

              <Card className="bg-card border border-border mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Important Limitations</h3>
                      <ul className="text-muted-foreground space-y-2">
                        <li>• Estimates are not guarantees - final bills may differ based on actual services provided</li>
                        <li>• Some hospitals still don't comply fully with the law</li>
                        <li>• Physician fees may be separate from hospital facility fees</li>
                        <li>• Emergency services are excluded from price shopping requirements</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold font-serif text-foreground mt-12 mb-6">
                Real Savings Examples
              </h2>

              <div className="space-y-4 mb-8">
                <Card className="bg-card border border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-foreground font-semibold">MRI (Brain, without contrast)</h4>
                        <p className="text-muted-foreground text-sm">Los Angeles Metro Area</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Price Range:</p>
                        <p className="text-foreground font-bold">$400 - $3,500</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-foreground font-semibold">Knee Replacement Surgery</h4>
                        <p className="text-muted-foreground text-sm">National Average</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Price Range:</p>
                        <p className="text-foreground font-bold">$17,000 - $85,000</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-foreground font-semibold">Colonoscopy</h4>
                        <p className="text-muted-foreground text-sm">New York Metro Area</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Price Range:</p>
                        <p className="text-foreground font-bold">$1,200 - $7,500</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-2xl font-bold font-serif text-foreground mt-12 mb-6">
                Resources for Price Comparison
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">FAIR Health Consumer</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Free tool showing typical costs for medical procedures in your area based on insurance claims data.
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Healthcare Bluebook</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Grades healthcare prices as "fair" based on regional averages. Helps identify overpriced providers.
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Medicare.gov Price Lookup</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Official Medicare payment rates for procedures. A good baseline for negotiation.
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">GoldRock Health</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    AI-powered analysis comparing your bills against fair market prices with specific savings recommendations.
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="luxury-card mt-12">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold font-serif text-foreground mb-4">
                  Compare Your Bill Against Fair Prices
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our AI analyzes your medical bill against regional price data and identifies 
                  where you're being overcharged. Get a detailed savings report in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bill-grader">
                    <button className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-all flex items-center gap-2" data-testid="button-analyze-bill">
                      <TrendingDown className="w-5 h-5" />
                      Analyze Your Bill
                    </button>
                  </Link>
                  <Link href="/conditions">
                    <button className="px-6 py-3 border border-border bg-card hover:bg-secondary text-foreground font-semibold rounded-lg transition-all" data-testid="button-lookup-prices">
                      Look Up Procedure Prices
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
