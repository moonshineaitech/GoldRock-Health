import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  ArrowLeft, 
  CheckCircle,
  Phone,
  FileText,
  DollarSign,
  TrendingDown,
  Clock,
  Target,
  Users,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const negotiationStrategies = [
  {
    title: "Request an Itemized Bill First",
    description: "Before negotiating, always request a fully itemized bill. This reveals every charge and makes it easier to identify errors or overcharges that give you leverage.",
    tip: "Ask for the bill with CPT codes and descriptions, not just summary totals."
  },
  {
    title: "Research Fair Prices",
    description: "Use resources like FAIR Health, Healthcare Bluebook, or Medicare rates to determine what your procedure should cost. Armed with data, you can make a compelling case.",
    tip: "Print out the fair price data to reference during your negotiation call."
  },
  {
    title: "Ask for the Cash Pay Rate",
    description: "Hospitals often offer significant discounts to patients who pay cash. These rates can be substantially lower than billed charges and are often available even if you have insurance.",
    tip: "The cash rate may be lower than your after-insurance cost if you have a high deductible."
  },
  {
    title: "Request Financial Hardship Assistance",
    description: "Most hospitals have charity care programs for patients who can't afford their bills. Income qualifications vary but can cover partial or full bill forgiveness.",
    tip: "Ask for the hospital's Financial Assistance Policy - they're required to have one."
  },
  {
    title: "Negotiate a Payment Plan",
    description: "If you can't pay in full, negotiate a payment plan with 0% interest. Many hospitals will spread payments over 12-36 months without charging interest.",
    tip: "Get the payment plan agreement in writing before making any payments."
  },
  {
    title: "Offer a Lump Sum Settlement",
    description: "Hospitals prefer guaranteed payment now over uncertain payments later. Offering to pay a lump sum (even 50% of the bill) often results in the remaining balance being forgiven.",
    tip: "This works best if the bill is older or already in collections."
  }
];

const scriptExamples = [
  {
    scenario: "Opening the Negotiation",
    script: "Hi, I'm calling about a bill I received for [procedure]. I'd like to discuss the charges because I've researched fair prices for this procedure in my area, and I believe there may be room to adjust the total."
  },
  {
    scenario: "Requesting Cash Discount",
    script: "I understand you offer cash pay discounts. What would my total be if I paid the full amount today? I'm prepared to settle this account if we can agree on a reasonable amount."
  },
  {
    scenario: "Citing Fair Market Prices",
    script: "According to FAIR Health data, the typical cost for this procedure in my area is [amount]. My bill shows [higher amount]. Can you help me understand this difference, or can we adjust the bill to reflect the regional average?"
  },
  {
    scenario: "Requesting Financial Assistance",
    script: "I'm experiencing financial hardship and am unable to pay this bill in full. Can you tell me about your hospital's financial assistance program? I'd like to apply for charity care or a hardship discount."
  }
];

export default function NegotiateMedicalBills() {
  return (
    <>
      <SEOHead
        title="How to Negotiate Medical Bills: Step-by-Step Guide | GoldRock Health"
        description="Learn proven negotiation strategies that help patients reduce medical bills. Includes word-for-word scripts, tactics, and real examples."
        keywords={["negotiate medical bills", "reduce hospital bill", "medical bill negotiation", "healthcare bill discount", "hospital payment negotiation"]}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mb-12">
              <Badge className="bg-secondary text-gold border-border mb-4">
                Negotiation
              </Badge>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                How to Negotiate Medical Bills: A Step-by-Step Guide
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Most patients don't realize medical bills are negotiable. With the right approach, 
                you can often significantly reduce what you owe. This guide provides proven strategies and 
                word-for-word scripts you can use today.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>10 min read</span>
                <span>•</span>
                <span>Last updated January 2026</span>
              </div>
            </header>

            <div className="max-w-none">
              <Card className="luxury-card mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <Target className="w-8 h-8 text-gold flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Key Statistics</h3>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <strong>93%</strong> of patients who negotiate their bills successfully reduce them</li>
                        <li>• Average reduction: <strong>37%</strong> of the original bill</li>
                        <li>• Most negotiations take <strong>under 30 minutes</strong></li>
                        <li>• <strong>Only 12%</strong> of patients ever try to negotiate</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                Before You Negotiate: Preparation Steps
              </h2>

              <div className="space-y-4 mb-8">
                <Card className="luxury-card">
                  <CardContent className="py-4 flex items-start gap-4">
                    <Clock className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Wait for the Final Bill</h4>
                      <p className="text-muted-foreground text-sm">
                        Don't negotiate based on estimates. Wait until you receive the final bill after 
                        insurance has processed the claim. This may take 4-8 weeks.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="py-4 flex items-start gap-4">
                    <FileText className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Gather Your Documents</h4>
                      <p className="text-muted-foreground text-sm">
                        Have ready: your itemized bill, Explanation of Benefits (EOB), insurance policy details, 
                        and any price comparison research you've done.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardContent className="py-4 flex items-start gap-4">
                    <DollarSign className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Know Your Target</h4>
                      <p className="text-muted-foreground text-sm">
                        Decide what you can realistically afford and what you'd consider a successful outcome. 
                        Aim for 30-50% reduction as a starting point.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                6 Proven Negotiation Strategies
              </h2>

              <div className="space-y-6 mb-12">
                {negotiationStrategies.map((strategy, index) => (
                  <Card key={strategy.title} className="luxury-card">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-3">
                        <span className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-gold font-bold text-sm">
                          {index + 1}
                        </span>
                        {strategy.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">{strategy.description}</p>
                      <div className="bg-secondary rounded-lg p-4 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-gold flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-gold">Pro Tip:</strong> {strategy.tip}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                Word-for-Word Negotiation Scripts
              </h2>

              <div className="space-y-6 mb-12">
                {scriptExamples.map((example) => (
                  <Card key={example.scenario} className="luxury-card">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        {example.scenario}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-secondary rounded-lg p-4 border-l-4 border-gold">
                        <p className="text-muted-foreground italic">"{example.script}"</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                Who to Contact
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      Billing Department
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    Start here for most negotiations. They can offer payment plans, cash discounts, 
                    and often have authority to reduce bills by 20-30%.
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      Patient Advocate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    If billing won't help, ask for the patient advocate or ombudsman. 
                    They're specifically there to help patients navigate billing issues.
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      Financial Assistance Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    For charity care or hardship programs, contact the financial assistance or 
                    financial counseling office directly.
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-muted-foreground" />
                      Supervisor or Manager
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    If the first representative can't help, politely ask to speak with a supervisor. 
                    They often have more authority to approve larger discounts.
                  </CardContent>
                </Card>
              </div>

              <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-6">
                What If Negotiation Fails?
              </h2>

              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>File a complaint with your state insurance commissioner if the bill involves insurance issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Contact your state's Attorney General consumer protection division</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Consider hiring a medical billing advocate (they typically take 25-35% of savings)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>If the bill goes to collections, you can still negotiate—often for 40-60% off</span>
                </li>
              </ul>
            </div>

            <Card className="luxury-card mt-12">
              <CardContent className="py-8 text-center">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Get AI-Powered Negotiation Strategies
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our Bill Grader analyzes your specific bill and generates personalized negotiation 
                  strategies based on the errors found and fair market prices for your procedures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bill-grader">
                    <button className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-all flex items-center gap-2" data-testid="button-get-strategies">
                      <TrendingDown className="w-5 h-5" />
                      Get Negotiation Strategies
                    </button>
                  </Link>
                  <Link href="/dispute-arsenal">
                    <button className="px-6 py-3 border border-border bg-card hover:bg-secondary text-foreground font-semibold rounded-lg transition-all" data-testid="button-dispute-tools">
                      View Dispute Templates
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
