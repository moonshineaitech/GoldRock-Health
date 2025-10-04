import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  TrendingDown,
  CheckCircle,
  FileText,
  Search,
  Phone,
  Mail,
  Handshake,
  Heart,
  AlertTriangle,
  Building,
  Target,
  BookOpen,
  Award,
  Lightbulb,
  Users,
  ChevronRight
} from "lucide-react";
import { caseStudies } from "@/data/case-studies";

const iconMap: { [key: string]: any } = {
  FileText,
  Search,
  Mail,
  Phone,
  Handshake,
  CheckCircle,
  Heart,
  AlertTriangle,
  TrendingUp: TrendingDown,
  Building,
  DollarSign
};

export default function CaseDetail() {
  const [, params] = useRoute("/cases/:id");
  const caseId = params?.id;
  
  const caseStudy = caseStudies.find(c => c.id === caseId);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  if (!caseStudy) {
    return (
      <MobileLayout title="Case Not Found" showBottomNav={true}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Case study not found</h2>
          <Link href="/training">
            <MobileButton>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cases
            </MobileButton>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={caseStudy.title} showBackButton={true} showBottomNav={true}>
      {/* Hero Section with Savings */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MobileCard className="backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-500/10" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  caseStudy.difficulty === 1 ? 'bg-green-100 text-green-800' :
                  caseStudy.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {caseStudy.difficulty === 1 ? 'Beginner Friendly' :
                   caseStudy.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                </span>
                <h1 className="text-2xl font-black text-gray-900 mt-3 mb-2">{caseStudy.title}</h1>
                <p className="text-gray-600 text-sm font-medium">{caseStudy.category}</p>
              </div>
              
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DollarSign className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-red-700 mb-1">{caseStudy.originalBill}</div>
                <div className="text-xs text-gray-600 font-medium">Original Bill</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-emerald-700 mb-1">{caseStudy.savings}</div>
                <div className="text-xs text-gray-600 font-medium">Savings</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-blue-700 mb-1">{caseStudy.savingsPercentage}</div>
                <div className="text-xs text-gray-600 font-medium">Reduced</div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">{caseStudy.timeline}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">{caseStudy.strategy}</span>
              </div>
            </div>
          </div>
        </MobileCard>
      </motion.div>

      {/* Patient Story */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          The Full Story
        </h2>
        
        <div className="space-y-4">
          <MobileCard>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              The Situation
            </h3>
            <p className="text-gray-700 leading-relaxed">{caseStudy.fullStory.situation}</p>
          </MobileCard>

          <MobileCard>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
              The Challenge
            </h3>
            <p className="text-gray-700 leading-relaxed">{caseStudy.fullStory.challenge}</p>
          </MobileCard>

          <MobileCard>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2 text-emerald-600" />
              The Approach
            </h3>
            <ul className="space-y-2">
              {caseStudy.fullStory.approach.map((step, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </MobileCard>

          <MobileCard className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <h3 className="font-bold text-emerald-900 mb-2 flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-emerald-700" />
              The Outcome
            </h3>
            <p className="text-emerald-900 leading-relaxed font-medium">{caseStudy.fullStory.outcome}</p>
          </MobileCard>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Week-by-Week Timeline
        </h2>
        
        <div className="space-y-4">
          {caseStudy.detailedTimeline.map((item, index) => {
            const Icon = iconMap[item.icon] || FileText;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <MobileCard className="backdrop-blur-xl border border-white/40">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{item.week}</h4>
                      <p className="text-sm text-gray-700 mb-2">{item.action}</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <p className="text-sm text-blue-900 font-medium flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                          {item.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </MobileCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tactics Breakdown */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-emerald-600" />
          Tactics Breakdown
        </h2>
        
        <div className="space-y-4">
          {caseStudy.tacticsBreakdown.map((tactic, index) => (
            <MobileCard key={index} className="backdrop-blur-xl border border-white/40">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-gray-900 flex-1">{tactic.tactic}</h4>
                <div className="text-right ml-4">
                  <div className="text-lg font-black text-emerald-700">{tactic.savingsImpact}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    tactic.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    tactic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tactic.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{tactic.description}</p>
            </MobileCard>
          ))}
        </div>
      </motion.div>

      {/* Lessons Learned */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
          Key Lessons Learned
        </h2>
        
        <MobileCard className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <ul className="space-y-3">
            {caseStudy.lessonsLearned.map((lesson, index) => (
              <li key={index} className="flex items-start">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-900 font-medium leading-relaxed">{lesson}</span>
              </li>
            ))}
          </ul>
        </MobileCard>
      </motion.div>

      {/* Applicable To */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          This Strategy Works For
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {caseStudy.applicableTo.map((item, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-100 text-purple-900 rounded-xl text-sm font-medium border border-purple-200"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Action CTAs */}
      <motion.div
        className="space-y-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Link href="/bill-ai">
          <MobileButton className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
            <FileText className="h-5 w-5 mr-2" />
            Analyze My Bill With AI
            <ChevronRight className="h-4 w-4 ml-2" />
          </MobileButton>
        </Link>

        <Link href="/training">
          <MobileButton variant="secondary" className="w-full border-2 border-gray-200 hover:border-gray-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse More Cases
          </MobileButton>
        </Link>
      </motion.div>
    </MobileLayout>
  );
}

function Trophy({ className }: { className?: string }) {
  return <Award className={className} />;
}
