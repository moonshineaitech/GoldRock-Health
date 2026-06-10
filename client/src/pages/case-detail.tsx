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
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Case study not found</h2>
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
        <MobileCard className="luxury-card overflow-hidden relative">
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
                <h1 className="font-serif text-2xl font-bold text-foreground mt-3 mb-2">{caseStudy.title}</h1>
                <p className="text-muted-foreground text-sm font-medium">{caseStudy.category}</p>
              </div>
              
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                whileHover={{ y: -2 }}
              >
                <DollarSign className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{caseStudy.originalBill}</div>
                <div className="text-xs text-muted-foreground font-medium">Original Bill</div>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-gold mb-1">{caseStudy.savings}</div>
                <div className="text-xs text-muted-foreground font-medium">Savings</div>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{caseStudy.savingsPercentage}</div>
                <div className="text-xs text-muted-foreground font-medium">Reduced</div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-secondary rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gold" />
                <span className="text-sm font-bold text-foreground">{caseStudy.timeline}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-gold" />
                <span className="text-sm font-bold text-foreground">{caseStudy.strategy}</span>
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
        <h2 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-gold" />
          The Full Story
        </h2>
        
        <div className="space-y-4">
          <MobileCard>
            <h3 className="font-bold text-foreground mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              The Situation
            </h3>
            <p className="text-foreground leading-relaxed">{caseStudy.fullStory.situation}</p>
          </MobileCard>

          <MobileCard>
            <h3 className="font-bold text-foreground mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
              The Challenge
            </h3>
            <p className="text-foreground leading-relaxed">{caseStudy.fullStory.challenge}</p>
          </MobileCard>

          <MobileCard>
            <h3 className="font-bold text-foreground mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2 text-gold" />
              The Approach
            </h3>
            <ul className="space-y-2">
              {caseStudy.fullStory.approach.map((step, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </MobileCard>

          <MobileCard className="luxury-card">
            <h3 className="font-bold text-foreground mb-2 flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-gold" />
              The Outcome
            </h3>
            <p className="text-foreground leading-relaxed font-medium">{caseStudy.fullStory.outcome}</p>
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
        <h2 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gold" />
          Week-by-Week Timeline
        </h2>
        
        <div className="space-y-4">
          {caseStudy.detailedTimeline.map((item, index) => {
            const Icon = iconMap[item.icon] || FileText;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <MobileCard className="luxury-card">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{item.week}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.action}</p>
                      <div className="bg-secondary border border-border rounded-lg p-2">
                        <p className="text-sm text-foreground font-medium flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-gold flex-shrink-0 mt-0.5" />
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
        <h2 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-gold" />
          Tactics Breakdown
        </h2>
        
        <div className="space-y-4">
          {caseStudy.tacticsBreakdown.map((tactic, index) => (
            <MobileCard key={index} className="luxury-card">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-foreground flex-1">{tactic.tactic}</h4>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-gold">{tactic.savingsImpact}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    tactic.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    tactic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tactic.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{tactic.description}</p>
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
        <h2 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-gold" />
          Key Lessons Learned
        </h2>
        
        <MobileCard className="luxury-card">
          <ul className="space-y-3">
            {caseStudy.lessonsLearned.map((lesson, index) => (
              <li key={index} className="flex items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-foreground font-medium leading-relaxed">{lesson}</span>
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
        <h2 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-gold" />
          This Strategy Works For
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {caseStudy.applicableTo.map((item, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium border border-border"
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
          <MobileButton className="w-full bg-primary text-primary-foreground shadow-sm">
            <FileText className="h-5 w-5 mr-2" />
            Analyze My Bill With AI
            <ChevronRight className="h-4 w-4 ml-2" />
          </MobileButton>
        </Link>

        <Link href="/training">
          <MobileButton variant="secondary" className="w-full border border-border hover:border-gold">
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
