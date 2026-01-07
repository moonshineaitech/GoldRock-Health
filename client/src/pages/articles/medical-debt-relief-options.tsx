import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Heart, 
  ArrowLeft, 
  CheckCircle,
  DollarSign,
  Building2,
  FileText,
  Phone,
  Scale,
  TrendingDown,
  AlertTriangle,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const reliefOptions = [
  {
    title: "Hospital Charity Care Programs",
    description: "Most hospitals, especially nonprofits, are required to offer financial assistance to patients who can't afford their bills.",
    eligibility: "Typically for households earning up to 200-400% of the Federal Poverty Level",
    savings: "50-100% of bill",
    howToApply: "Contact the hospital's financial counseling or billing department and request the Financial Assistance Application"
  },
  {
    title: "Payment Plan Negotiation",
    description: "Hospitals and providers often offer interest-free payment plans spread over 12-36 months.",
    eligibility: "Anyone who requests it",
    savings: "Makes bills manageable; sometimes leads to forgiveness of remaining balance",
    howToApply: "Call billing department and request a payment plan. Get terms in writing before paying"
  },
  {
    title: "Lump Sum Settlement",
    description: "Offer to pay a reduced amount upfront in exchange for full settlement of the debt.",
    eligibility: "Best for older debts or debts in collections",
    savings: "40-70% off original bill",
    howToApply: "Make an offer in writing. Start at 40% and negotiate up. Get settlement agreement in writing"
  },
  {
    title: "Medical Bill Advocacy Services",
    description: "Professional advocates negotiate on your behalf, typically taking a percentage of savings.",
    eligibility: "Anyone with a significant bill (usually $1,000+)",
    savings: "Average 40% reduction (minus advocate fee of 25-35% of savings)",
    howToApply: "Research reputable advocates. Get fee structure in writing before engaging"
  },
  {
    title: "State Financial Assistance Programs",
    description: "Many states have programs that help residents with medical bills, separate from Medicaid.",
    eligibility: "Varies by state; usually income-based",
    savings: "Varies widely by program",
    howToApply: "Contact your state's health department or search '[your state] medical bill assistance'"
  },
  {
    title: "Nonprofit and Disease-Specific Assistance",
    description: "Organizations like Patient Advocate Foundation, HealthWell Foundation, and disease-specific nonprofits offer bill assistance.",
    eligibility: "Often diagnosis-specific (cancer, diabetes, etc.)",
    savings: "Can cover full cost of specific treatments",
    howToApply: "Search for assistance programs related to your specific condition"
  },
  {
    title: "Medical Credit Cards (with caution)",
    description: "Cards like CareCredit offer 0% APR promotional periods for medical expenses.",
    eligibility: "Credit approval required",
    savings: "No interest if paid within promotional period (usually 6-24 months)",
    howToApply: "Apply online or through provider's office. WARNING: Interest rates are very high after promo period"
  },
  {
    title: "Bankruptcy as Last Resort",
    description: "Medical debt is dischargeable in bankruptcy. Chapter 7 can eliminate debt; Chapter 13 sets up a payment plan.",
    eligibility: "Based on income and assets",
    savings: "Potentially 100% of medical debt",
    howToApply: "Consult with a bankruptcy attorney. Many offer free consultations"
  }
];

export default function MedicalDebtReliefOptions() {
  return (
    <>
      <SEOHead
        title="Medical Debt Relief: Options You Didn't Know Existed | GoldRock Health"
        description="Explore every option for medical debt relief including charity care, payment plans, debt forgiveness, and assistance programs. Learn how to reduce or eliminate medical debt."
        keywords={["medical debt relief", "hospital charity care", "medical bill forgiveness", "healthcare debt help", "medical payment assistance"]}
      />

      <div className="min-h-screen bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/articles">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </button>
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <header className="mb-12">
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-4">
                Financial Assistance
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-4">
                Medical Debt Relief: Options You Didn't Know Existed
              </h1>
              <p className="text-xl text-gray-400 mb-6">
                Medical debt affects 1 in 3 Americans, but there are more options for relief than 
                most people realize. From charity care to negotiated settlements, this guide covers 
                every avenue for reducing or eliminating medical debt.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>11 min read</span>
                <span>•</span>
                <span>Last updated January 2026</span>
              </div>
            </header>

            <div className="prose prose-invert max-w-none">
              <Card className="bg-blue-500/10 border-blue-500/30 mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">You Have Options</h3>
                      <p className="text-gray-300">
                        <strong>$140 billion</strong> in medical debt burdens American households. But hospitals 
                        provide <strong>$42 billion</strong> in charity care annually—most of it goes unclaimed 
                        because patients don't know to ask. This guide will help you get help.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">
                8 Medical Debt Relief Options
              </h2>

              <div className="space-y-6 mb-12">
                {reliefOptions.map((option, index) => (
                  <Card key={option.title} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <span className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 font-bold text-sm">
                          {index + 1}
                        </span>
                        {option.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">{option.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-3">
                          <p className="text-xs text-gray-500 uppercase mb-1">Eligibility</p>
                          <p className="text-sm text-gray-300">{option.eligibility}</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                          <p className="text-xs text-gray-500 uppercase mb-1">Potential Savings</p>
                          <p className="text-sm text-green-400">{option.savings}</p>
                        </div>
                      </div>
                      
                      <div className="bg-cyan-500/10 rounded-lg p-4 border-l-4 border-cyan-500">
                        <p className="text-sm text-cyan-300">
                          <strong>How to Apply:</strong> {option.howToApply}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">
                Important: Protect Yourself from Collections
              </h2>

              <Card className="bg-yellow-500/10 border-yellow-500/30 mb-8">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-400 mb-2">New Protections for Medical Debt</h3>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Medical debt under $500 can no longer appear on credit reports</li>
                        <li>• Paid medical debt must be removed from credit reports</li>
                        <li>• 1-year waiting period before medical debt can be reported</li>
                        <li>• Many states have additional protections—check your state laws</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">
                Steps to Take Right Now
              </h2>

              <ol className="space-y-4 text-gray-300 mb-8">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</span>
                  <div>
                    <strong className="text-white">Request an itemized bill</strong>
                    <p className="text-gray-400">Before paying anything, get a detailed breakdown. Errors are common.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</span>
                  <div>
                    <strong className="text-white">Apply for financial assistance first</strong>
                    <p className="text-gray-400">Contact the billing department and ask about charity care. Do this before negotiating.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</span>
                  <div>
                    <strong className="text-white">Don't ignore the bill</strong>
                    <p className="text-gray-400">Communicate with providers. They're more willing to work with responsive patients.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</span>
                  <div>
                    <strong className="text-white">Get everything in writing</strong>
                    <p className="text-gray-400">Any agreement—payment plan, settlement, forgiveness—should be documented.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">5</span>
                  <div>
                    <strong className="text-white">Know your rights</strong>
                    <p className="text-gray-400">Collectors have strict rules. Learn your rights under the FDCPA.</p>
                  </div>
                </li>
              </ol>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">
                Resources for Help
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Patient Advocate Foundation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 text-sm">
                    Free case management and financial assistance programs for patients with chronic, life-threatening, or debilitating diseases.
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-cyan-400" />
                      HealthWell Foundation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 text-sm">
                    Provides financial assistance for copays, premiums, and other healthcare costs for specific conditions.
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Scale className="w-5 h-5 text-cyan-400" />
                      RIP Medical Debt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 text-sm">
                    Nonprofit that buys and forgives medical debt. You can't apply directly, but they've eliminated billions in debt.
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-cyan-400" />
                      NeedyMeds
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 text-sm">
                    Database of assistance programs for medications, medical supplies, and healthcare costs.
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-500/30 mt-12">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Get Help With Your Medical Bills
                </h3>
                <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                  Our platform can help you understand your bills, find errors, and identify 
                  savings opportunities. Start with a free bill analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bill-grader">
                    <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2" data-testid="button-analyze">
                      <TrendingDown className="w-5 h-5" />
                      Analyze My Bill
                    </button>
                  </Link>
                  <Link href="/emergency-help">
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all" data-testid="button-emergency">
                      Emergency Bill Help
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
