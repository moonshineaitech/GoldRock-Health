import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  FileText, 
  TrendingDown, 
  Shield, 
  DollarSign, 
  Building2, 
  Stethoscope,
  AlertTriangle,
  Scale,
  Heart,
  Brain,
  Search,
  ArrowRight,
  Clock,
  Users,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/seo-head";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  icon: typeof FileText;
  featured?: boolean;
}

const articles: Article[] = [
  {
    slug: "medical-bill-errors-guide",
    title: "The Complete Guide to Finding Errors on Your Medical Bill",
    description: "Learn the 12 most common billing errors that cost Americans billions annually and how to identify them on your own bills.",
    category: "Bill Analysis",
    readTime: "8 min",
    icon: FileText,
    featured: true
  },
  {
    slug: "hospital-price-transparency",
    title: "Hospital Price Transparency: Your Right to Know What You'll Pay",
    description: "Federal law now requires hospitals to publish prices. Learn how to use this data to save thousands on procedures.",
    category: "Healthcare Costs",
    readTime: "6 min",
    icon: Building2,
    featured: true
  },
  {
    slug: "negotiate-medical-bills",
    title: "How to Negotiate Medical Bills: A Step-by-Step Guide",
    description: "Proven negotiation strategies that help patients reduce their medical bills by 30-70% on average.",
    category: "Negotiation",
    readTime: "10 min",
    icon: TrendingDown,
    featured: true
  },
  {
    slug: "insurance-denials-appeals",
    title: "Fighting Insurance Denials: Your Complete Appeals Guide",
    description: "Insurance companies deny 1 in 5 claims. Learn the appeal process that overturns 50%+ of denials.",
    category: "Insurance",
    readTime: "12 min",
    icon: Shield
  },
  {
    slug: "fair-health-prices",
    title: "Understanding Fair Health Prices: Benchmark Your Medical Costs",
    description: "How to compare your bills against regional averages and identify when you're being overcharged.",
    category: "Healthcare Costs",
    readTime: "7 min",
    icon: DollarSign
  },
  {
    slug: "surprise-billing-protection",
    title: "No Surprises Act: How to Protect Yourself from Surprise Medical Bills",
    description: "The 2022 law that protects you from surprise bills. Learn your rights and how to dispute illegal charges.",
    category: "Patient Rights",
    readTime: "8 min",
    icon: AlertTriangle
  },
  {
    slug: "medical-debt-relief-options",
    title: "Medical Debt Relief: Options You Didn't Know Existed",
    description: "From charity care to payment plans to debt forgiveness programs, explore every option for medical debt relief.",
    category: "Financial Assistance",
    readTime: "11 min",
    icon: Heart
  },
  {
    slug: "understanding-eob-statements",
    title: "How to Read Your Explanation of Benefits (EOB) Statement",
    description: "Decode the confusing insurance paperwork and understand exactly what you owe versus what insurance covered.",
    category: "Insurance",
    readTime: "6 min",
    icon: BookOpen
  },
  {
    slug: "cpt-icd-codes-explained",
    title: "CPT and ICD Codes: The Hidden Language of Medical Billing",
    description: "Understanding billing codes helps you spot upcoding, unbundling, and other billing fraud on your bills.",
    category: "Bill Analysis",
    readTime: "9 min",
    icon: Brain
  },
  {
    slug: "patient-rights-billing",
    title: "Your Patient Rights When It Comes to Medical Billing",
    description: "Federal and state laws protect patients from billing abuses. Know your rights and how to exercise them.",
    category: "Patient Rights",
    readTime: "7 min",
    icon: Scale
  },
  {
    slug: "hospital-financial-assistance",
    title: "Hospital Charity Care: Free and Reduced-Cost Care Programs",
    description: "Most hospitals offer financial assistance but don't advertise it. Learn how to find and apply for these programs.",
    category: "Financial Assistance",
    readTime: "8 min",
    icon: Building2
  },
  {
    slug: "ai-medical-bill-analysis",
    title: "How AI is Revolutionizing Medical Bill Analysis",
    description: "Artificial intelligence can now detect billing errors, calculate fair prices, and generate negotiation strategies in seconds.",
    category: "Technology",
    readTime: "5 min",
    icon: Stethoscope
  }
];

const categories = ["All", "Bill Analysis", "Healthcare Costs", "Negotiation", "Insurance", "Patient Rights", "Financial Assistance", "Technology"];

export default function ArticlesIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(a => a.featured);

  return (
    <>
      <SEOHead
        title="Medical Bill Savings Articles & Guides | GoldRock Health"
        description="Expert guides on reducing medical bills, fighting insurance denials, negotiating healthcare costs, and understanding your patient rights. Free resources to help you save money."
        keywords={["medical bill help", "reduce medical bills", "hospital bill negotiation", "insurance denial appeals", "patient rights", "healthcare costs"]}
      />

      <div className="min-h-screen bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Knowledge Center
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              Medical Bill Savings Guides
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert articles and step-by-step guides to help you understand, negotiate, and reduce your medical bills.
            </p>
          </motion.div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                data-testid="input-search-articles"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-cyan-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                  data-testid={`button-category-${category.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {selectedCategory === "All" && searchQuery === "" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredArticles.map((article, index) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}>
                    <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {article.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="text-cyan-400 flex items-center gap-1 text-sm font-medium">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory === "All" ? "All Articles" : selectedCategory}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <Card className="bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          {article.category}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-white">{article.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-cyan-400 flex items-center gap-1 text-sm">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Analyze Your Medical Bills?
                </h3>
                <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                  Our AI-powered platform can identify billing errors, calculate fair prices, 
                  and generate negotiation strategies in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bill-grader">
                    <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all" data-testid="button-grade-bill">
                      Grade Your Bill Free
                    </button>
                  </Link>
                  <Link href="/conditions">
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all" data-testid="button-browse-conditions">
                      Browse Medical Conditions
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
