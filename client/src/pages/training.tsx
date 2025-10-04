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
  { value: "", label: "All Levels" },
  { value: "1", label: "Beginner" },
  { value: "2", label: "Intermediate" },
  { value: "3", label: "Advanced" }
];

export default function Training() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Categories");
  const [difficulty, setDifficulty] = useState("");

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
    
    const matchesDifficulty = difficulty === "" || caseStudy.difficulty === parseInt(difficulty);
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

  return (
    <MobileLayout title="Cases" showBottomNav={true}>
      {/* Hero Section */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-28 h-28 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
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
          <BookCheck className="text-white text-2xl relative z-10" />
          
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
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h1 className="text-3xl font-black mb-3 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 bg-clip-text text-transparent">Real Cases</span>{" "}
            <span className="text-gray-900">Real Savings</span>
          </h1>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6 leading-tight">
            Learn From People Who Won
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-6 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          See exactly how real people reduced their medical bills by $2,000-$35,000+ using simple strategies you can copy.
        </motion.p>
        
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 mb-6 max-w-sm mx-auto shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-lg">$67,450 Total Saved</span>
            </div>
            <p className="text-sm text-emerald-600 font-semibold">Across {caseStudies.length} documented victories</p>
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
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Browse Success Stories
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
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
              <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow" data-testid={`case-study-${caseStudy.id}`}>
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
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
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
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{caseStudy.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-emerald-700 font-bold group-hover:translate-x-2 transition-transform">
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

      {/* Action CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="mt-8 mb-6"
      >
        <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(20, 184, 166, 0.08) 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/30" />
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileText className="h-6 w-6 text-emerald-600" />
              </motion.div>
              <span className="font-black text-emerald-700 text-lg">Ready to Save?</span>
            </div>
            <p className="text-sm text-emerald-700 font-semibold mb-4">
              Use the same strategies these people used to reduce your own medical bills
            </p>
            
            <Link href="/bill-ai">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <MobileButton className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white font-bold shadow-xl shadow-emerald-500/30">
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
