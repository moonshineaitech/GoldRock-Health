import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { SEOHead, SEOContent, SEO_KEYWORDS } from "@/components/seo-head";
import { 
  DollarSign,
  AlertTriangle,
  FileText,
  ArrowRight,
  Crown,
  Brain,
  Target,
  Clock,
  CheckCircle,
  TrendingDown,
  Search,
  Calculator,
  Eye,
  Star,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  Trophy,
  Receipt,
  MessageCircle,
  ShieldCheck,
  Building,
  Gavel,
  HandCoins,
  UserCheck,
  Heart,
  Timer,
  FileEdit,
  Banknote,
  Percent,
  LineChart,
  Code,
  Phone,
  Mail,
  Scale,
  Users,
  Zap,
  Filter,
  BookCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { caseStudies } from "@/data/case-studies";

// Bill Reduction Specialties
const billReductionSpecialties = [
  "All Categories",
  "Emergency Room Bills",
  "Surgical Procedures", 
  "Hospital Stays",
  "Imaging & Labs",
  "Outpatient Services",
  "Ambulance Services",
  "Physician Fees",
  "Pharmacy Charges",
  "Equipment & Supplies"
];

const expertiseLevels = [
  { value: "all", label: "All Levels" },
  { value: "1", label: "Beginner" },
  { value: "2", label: "Intermediate" },
  { value: "3", label: "Advanced" }
];

export default function Training() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Categories");
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Filter case studies based on search criteria
  const filteredCases = caseStudies.filter(caseStudy => {
    const matchesSearch = search === "" || 
      caseStudy.title.toLowerCase().includes(search.toLowerCase()) ||
      caseStudy.strategy.toLowerCase().includes(search.toLowerCase()) ||
      caseStudy.condition.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecialty = specialty === "All Categories" || caseStudy.category === specialty;
    
    const matchesDifficulty = difficulty === "all" || caseStudy.difficulty === parseInt(difficulty);
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

  return (
    <MobileLayout title="Cases" showBottomNav={true}>
      <SEOHead 
        title="Medical Bill Case Studies - Real Savings Examples"
        description="Learn from real medical bill reduction success stories. See how patients saved $5,000-$50,000+ on hospital bills, emergency room charges, and surgical procedures."
        keywords={[...SEO_KEYWORDS.billAnalysis.slice(0, 10), 'medical bill success stories', 'hospital bill reduction examples', 'bill negotiation case studies']}
        canonicalPath="/training"
      />
      <SEOContent content={[
        "Real medical bill reduction case studies with documented savings",
        "Hospital bill negotiation success stories saving $10,000 to $50,000",
        "Emergency room bill reduction examples and strategies that worked",
        "Surgical procedure billing errors found and corrected",
        "Ambulance bill dispute success cases with sample letters",
        "Charity care program applications that resulted in 100% forgiveness",
        "Insurance claim appeal success stories with denial overturns",
        "Medical debt relief real examples from actual patients",
        "Step-by-step bill reduction strategies with proven results"
      ]} />
      {/* Hero Section */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div 
          className="w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
        >
          <BookCheck className="text-white text-2xl relative z-10" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-serif text-3xl font-bold mb-3 leading-tight tracking-tight text-foreground">
            Real Cases, Real Savings
          </h1>
          <h2 className="font-serif text-xl font-semibold text-gold mb-6 leading-tight">
            Learn From People Who Won
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Learn how real people reduced their medical bills using simple strategies you can apply to your own situation.
        </motion.p>
        
        <motion.div 
          className="luxury-card rounded-2xl p-5 mb-6 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-gold" />
              <span className="font-bold text-foreground text-lg">$67,450 Total Saved</span>
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Across {caseStudies.length} documented victories</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Real Success Stories Section */}
      <motion.div 
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Browse Success Stories
          </h2>
          <div className="h-1 w-20 bg-gold rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto font-medium">
            Each case shows the full story, tactics used, and exact steps taken
          </p>
        </motion.div>
      </motion.div>

      {/* Search and Filter Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        className="mt-8"
      >
        <MobileCard className="luxury-card mb-6">
          <div className="relative z-10 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search case studies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-border focus:border-gold rounded-xl bg-card"
                data-testid="input-search-cases"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="rounded-xl border-border bg-card" data-testid="select-bill-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {billReductionSpecialties.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="rounded-xl border-border bg-card" data-testid="select-difficulty-level">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseLevels.map(level => (
                    <SelectItem key={level.value || "all"} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </MobileCard>
      </motion.div>

      {/* Case Studies List */}
      <div className="space-y-4">
        {filteredCases.map((caseStudy, index) => (
          <motion.div
            key={caseStudy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 + index * 0.1, duration: 0.4 }}
          >
            <Link href={`/cases/${caseStudy.id}`}>
              <MobileCard className="luxury-card overflow-hidden group cursor-pointer hover:shadow-md transition-shadow" data-testid={`case-study-${caseStudy.id}`}>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                        whileHover={{ y: -2 }}
                      >
                        <DollarSign className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-foreground text-base">{caseStudy.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{caseStudy.strategy}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold">{caseStudy.savings}</div>
                      <div className="text-xs text-muted-foreground font-semibold">{caseStudy.savingsPercentage} saved</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground font-medium">Original Bill:</span>
                        <div className="font-bold text-foreground">{caseStudy.originalBill}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Final Amount:</span>
                        <div className="font-bold text-emerald-700">{caseStudy.finalAmount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-foreground font-medium mb-2">
                      <span className="font-bold">{caseStudy.patient}:</span> {caseStudy.condition}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Key Tactics Used:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {caseStudy.keyTactics.slice(0, 2).map((tactic, i) => (
                          <li key={i}>{tactic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-secondary text-muted-foreground rounded-lg text-xs font-medium">
                        {caseStudy.category}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        caseStudy.difficulty === 1 ? 'bg-green-100 text-green-800' :
                        caseStudy.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {caseStudy.difficulty === 1 ? 'Beginner' :
                         caseStudy.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{caseStudy.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-gold font-bold group-hover:translate-x-2 transition-transform">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Full Case Study
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </MobileCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No Results State */}
      {filteredCases.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <MobileCard className="luxury-card text-center py-8">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No case studies found</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Try adjusting your search criteria or browse different categories
              </p>
              <MobileButton 
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setSpecialty("All Categories");
                  setDifficulty("all");
                }}
                data-testid="button-clear-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </MobileButton>
            </div>
          </MobileCard>
        </motion.div>
      )}

      {/* Action CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="mt-8 mb-6"
      >
        <MobileCard className="luxury-card overflow-hidden relative">
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-6 w-6 text-gold" />
              <span className="font-serif font-bold text-foreground text-lg">Ready to Save?</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-4">
              Use the same strategies these people used to reduce your own medical bills
            </p>
            
            <Link href="/bill-ai">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <MobileButton className="bg-primary text-primary-foreground font-bold shadow-sm">
                  <Receipt className="h-4 w-4 mr-2" />
                  Analyze My Bill Now
                  <Sparkles className="h-4 w-4 ml-2" />
                </MobileButton>
              </motion.div>
            </Link>
          </div>
        </MobileCard>
      </motion.div>
    </MobileLayout>
  );
}
