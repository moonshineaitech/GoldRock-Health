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
    description: "Proven negotiation strategies that help patients significantly reduce their medical bills.",
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

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <Badge className="bg-secondary text-gold border-border mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Knowledge Center
            </Badge>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Medical Bill Savings Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert articles and step-by-step guides to help you understand, negotiate, and reduce your medical bills.
            </p>
          </motion.div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border text-foreground"
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
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredArticles.map((article, index) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`}>
                    <Card className="luxury-card hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-gold border-border">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-foreground text-lg">{article.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {article.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="text-gold flex items-center gap-1 text-sm font-medium">
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {selectedCategory === "All" ? "All Articles" : selectedCategory}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <Card className="bg-card border border-border shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-muted-foreground border-border">
                          {article.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-foreground">{article.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-gold flex items-center gap-1 text-sm">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Card className="luxury-card">
              <CardContent className="py-12">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Ready to Analyze Your Medical Bills?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Our AI-powered platform can identify billing errors, calculate fair prices, 
                  and generate negotiation strategies in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bill-grader">
                    <button className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-all" data-testid="button-grade-bill">
                      Grade Your Bill Free
                    </button>
                  </Link>
                  <Link href="/conditions">
                    <button className="px-6 py-3 bg-secondary hover:bg-muted text-foreground font-semibold rounded-lg transition-all" data-testid="button-browse-conditions">
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
