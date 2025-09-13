import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
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
  GraduationCap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

// Bill Reduction Specialties (replacing medical specialties)
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
  { value: "", label: "All Levels" },
  { value: "1", label: "Beginner" },
  { value: "2", label: "Advanced" },
  { value: "3", label: "Expert" }
];

// Real case studies from bill-best-practices
const realCaseStudies = [
  {
    id: "emergency-room-case",
    title: "Emergency Room Overcharge",
    originalBill: "$29,500",
    finalAmount: "$6,500", 
    savings: "$23,000",
    savingsPercentage: "78%",
    timeline: "6 weeks",
    strategy: "CPT Code Challenge + Charity Care",
    patient: "Single mother, unemployed",
    condition: "Emergency appendectomy with complications",
    keyTactics: [
      "Challenged Level 5 ED coding without documentation",
      "Disputed surgical supply charges for unused items", 
      "Applied for charity care within 30-day window",
      "Negotiated final settlement at Medicare rates"
    ],
    difficulty: 2,
    category: "Emergency Room Bills"
  },
  {
    id: "surgical-procedure-case", 
    title: "Surgical Procedure Bill",
    originalBill: "$23,700",
    finalAmount: "$8,300",
    savings: "$15,400", 
    savingsPercentage: "65%",
    timeline: "4 weeks",
    strategy: "Good Faith Estimate Violation",
    patient: "Self-employed contractor",
    condition: "Outpatient surgery, out-of-network",
    keyTactics: [
      "Leveraged Good Faith Estimate requirements",
      "Documented estimate vs. actual bill discrepancies", 
      "Negotiated based on Medicare reimbursement rates",
      "Used end-of-fiscal-year timing for leverage"
    ],
    difficulty: 1,
    category: "Surgical Procedures"
  },
  {
    id: "hospital-stay-case",
    title: "Multi-Day Hospital Stay",
    originalBill: "$45,200", 
    finalAmount: "$18,800",
    savings: "$26,400",
    savingsPercentage: "58%",
    timeline: "8 weeks",
    strategy: "Itemized Analysis + Payment Plan",
    patient: "Retired teacher, Medicare + supplement",
    condition: "Cardiac procedure with complications",
    keyTactics: [
      "Found room charge errors totaling $4,200",
      "Disputed phantom operating room time charges",
      "Negotiated charity care for non-covered services", 
      "Structured 0% payment plan for remaining balance"
    ],
    difficulty: 3,
    category: "Hospital Stays"
  }
];

export default function Training() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Categories");
  const [difficulty, setDifficulty] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Filter case studies based on search criteria
  const filteredCases = realCaseStudies.filter(caseStudy => {
    const matchesSearch = search === "" || 
      caseStudy.title.toLowerCase().includes(search.toLowerCase()) ||
      caseStudy.strategy.toLowerCase().includes(search.toLowerCase()) ||
      caseStudy.condition.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecialty = specialty === "All Categories" || caseStudy.category === specialty;
    
    const matchesDifficulty = difficulty === "" || caseStudy.difficulty === parseInt(difficulty);
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

  return (
    <MobileLayout title="Cases" showBottomNav={true}>
      {/* Hero Section - Bill Reduction Mastery */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-28 h-28 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Premium App Icon */}
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/25 relative overflow-hidden"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            stiffness: 180,
            damping: 12
          }}
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-[1.75rem] backdrop-blur-sm" />
          <GraduationCap className="text-white text-2xl relative z-10" />
          
          {/* Premium Sparkle Effects */}
          <motion.div 
            className="absolute -top-2 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
            animate={{ 
              y: [-6, 6, -6],
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full shadow-lg"
            animate={{ 
              y: [4, -4, 4],
              scale: [0.9, 1.2, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
        
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h1 className="text-3xl font-black mb-3 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 bg-clip-text text-transparent">Master</span>{" "}
            <span className="text-gray-900">Bill Reduction</span>
          </h1>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6 leading-tight">
            With AI-Powered Training
          </h2>
        </motion.div>
        
        {/* Value Proposition */}
        <motion.p 
          className="text-base text-gray-700 mb-6 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Learn from real case studies where patients saved $15K-$35K using professional bill reduction strategies and AI analysis techniques.
        </motion.p>
        
        {/* Average Training Impact */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 mb-6 max-w-sm mx-auto shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-lg">Training Success: 87%</span>
            </div>
            <p className="text-sm text-emerald-600 font-semibold">Users reduce bills by $8,500+ after training</p>
          </div>
        </motion.div>
        
        {/* Primary CTAs */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6, type: "spring", stiffness: 120 }}
        >
          <Link href="/bill-ai">
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              data-testid="button-start-training"
            >
              <MobileButton className="w-full max-w-xs mx-auto shadow-2xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-4">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Training Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
          
          <Link href="/premium">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              data-testid="button-premium-access"
            >
              <MobileButton variant="secondary" className="w-full max-w-xs mx-auto shadow-lg border-2 border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800">
                <Crown className="h-4 w-4 mr-2" />
                Get Premium Access
                <ChevronRight className="h-3 w-3 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
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
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Real Training Case Studies
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Learn from actual success stories with step-by-step breakdowns
          </p>
        </motion.div>
      </motion.div>

      {/* AI Training Features */}
      <motion.div 
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            AI-Powered Training Modules
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Professional bill reduction expertise with AI-guided learning
          </p>
        </motion.div>
        
        <div className="space-y-3">
          {[
            { 
              icon: Brain, 
              title: "AI Bill Analysis Training", 
              desc: "Learn to spot $2,000-$35,000+ in overcharges using AI detection algorithms", 
              highlight: "Master AI tools",
              color: "purple", 
              delay: 1.7,
              href: "/bill-ai"
            },
            { 
              icon: Search, 
              title: "Error Detection Mastery", 
              desc: "Professional training on billing code errors, duplicate charges, and phantom procedures", 
              highlight: "95% success rate",
              color: "red", 
              delay: 1.8,
              href: "/bill-best-practices"
            },
            { 
              icon: MessageCircle, 
              title: "Negotiation Coaching", 
              desc: "Advanced scripts and timing strategies that professional advocates use", 
              highlight: "Expert coaching",
              color: "emerald", 
              delay: 1.9,
              href: "/premium"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: feature.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 180
                }}
                data-testid={`training-feature-${feature.title.toLowerCase().replace(/ /g, '-')}`}
              >
                <Link href={feature.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl cursor-pointer overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="flex items-center space-x-4 relative z-10">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${
                            feature.color === 'purple' ? 'from-purple-500 to-indigo-600' :
                            feature.color === 'red' ? 'from-red-500 to-orange-600' :
                            feature.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ scale: 1.15, rotate: 8 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                          <IconComponent className="h-7 w-7 text-white relative z-10" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{feature.title}</h3>
                            <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                              {feature.highlight}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                        <motion.div
                          className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm"
                          whileHover={{ x: 4, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4 text-gray-600" />
                        </motion.div>
                      </div>
                    </MobileCard>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Search and Filter Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.1 }}
        className="mt-8"
      >
        <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30 rounded-3xl" />
          <div className="relative z-10 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search case studies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/80 backdrop-blur-sm"
                data-testid="input-search-cases"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm" data-testid="select-bill-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {billReductionSpecialties.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm" data-testid="select-difficulty-level">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseLevels.map(level => (
                    <SelectItem key={level.value || "all"} value={level.value || "all"}>{level.label}</SelectItem>
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
            transition={{ delay: 2.2 + index * 0.1, duration: 0.4 }}
          >
            <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden group" data-testid={`case-study-${caseStudy.id}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <DollarSign className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{caseStudy.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">{caseStudy.strategy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-700">{caseStudy.savings}</div>
                    <div className="text-xs text-emerald-600 font-semibold">{caseStudy.savingsPercentage} saved</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Original Bill:</span>
                      <div className="font-bold text-red-700">{caseStudy.originalBill}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Final Amount:</span>
                      <div className="font-bold text-emerald-700">{caseStudy.finalAmount}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    <span className="font-bold">{caseStudy.patient}:</span> {caseStudy.condition}
                  </p>
                  <div className="text-xs text-gray-600">
                    <strong>Key Tactics:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {caseStudy.keyTactics.slice(0, 2).map((tactic, i) => (
                        <li key={i}>{tactic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                      {caseStudy.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      caseStudy.difficulty === 1 ? 'bg-green-100 text-green-800' :
                      caseStudy.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {caseStudy.difficulty === 1 ? 'Beginner' :
                       caseStudy.difficulty === 2 ? 'Advanced' : 'Expert'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{caseStudy.timeline}</span>
                  </div>
                </div>
                
                <Link href="/bill-best-practices">
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    data-testid={`button-study-case-${caseStudy.id}`}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Study This Case
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </MobileButton>
                </Link>
              </div>
            </MobileCard>
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
          <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl text-center py-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30 rounded-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No case studies found</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Try adjusting your search criteria or browse different categories
              </p>
              <MobileButton 
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setSpecialty("All Categories");
                  setDifficulty("");
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

      {/* Premium Training Access */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="mt-8 mb-6"
      >
        <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(217, 119, 6, 0.08) 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/30" />
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Crown className="h-6 w-6 text-amber-600" />
              </motion.div>
              <span className="font-black text-amber-700 text-lg">Premium Training Access</span>
            </div>
            <p className="text-sm text-amber-700 font-semibold mb-4">
              Get access to advanced case studies, 1-on-1 coaching, and professional templates
            </p>
            
            <Link href="/premium">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <MobileButton className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white font-bold shadow-xl shadow-amber-500/30">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
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