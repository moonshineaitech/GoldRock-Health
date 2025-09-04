import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { GameInterface } from "@/components/game-interface";
import { useMedicalCase, useMedicalCases } from "@/hooks/use-medical-cases";
import { Zap, Play, Clock, Target, BookOpen, ArrowRight, Shuffle } from "lucide-react";

export default function Game() {
  const { id } = useParams<{ id: string }>();
  
  // If no ID provided, show practice mode selection
  if (!id) {
    return <PracticeMode />;
  }

  const { data: medicalCase, isLoading, error } = useMedicalCase(id);

  if (isLoading) {
    return (
      <MobileLayout title="Loading Case" showBottomNav={false}>
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div 
            className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 mt-4">Loading medical case...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error || !medicalCase) {
    return (
      <MobileLayout title="Case Not Found" showBottomNav={true}>
        <MobileCard className="text-center border-red-200 bg-red-50 mt-20">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <h3 className="font-semibold text-red-900 mb-2">Case Not Found</h3>
          <p className="text-red-700 mb-4">The medical case you're looking for doesn't exist or failed to load.</p>
          <Link href="/training">
            <MobileButton>
              Return to Training
            </MobileButton>
          </Link>
        </MobileCard>
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50">
      <GameInterface medicalCase={medicalCase} />
    </div>
  );
}

function PracticeMode() {
  const { data: cases, isLoading } = useMedicalCases({});

  const quickPracticeOptions = [
    {
      title: "Quick Diagnosis",
      description: "5-minute rapid fire cases",
      icon: Zap,
      color: "orange",
      difficulty: "Foundation",
      duration: "5 min"
    },
    {
      title: "Timed Challenge", 
      description: "Beat the clock diagnostic",
      icon: Clock,
      color: "blue",
      difficulty: "Clinical",
      duration: "10 min"
    },
    {
      title: "Accuracy Test",
      description: "Precision diagnostic training",
      icon: Target,
      color: "green", 
      difficulty: "Expert",
      duration: "15 min"
    },
    {
      title: "Random Case",
      description: "Surprise medical scenario",
      icon: Shuffle,
      color: "purple",
      difficulty: "Mixed",
      duration: "Variable"
    }
  ];

  return (
    <MobileLayout title="Quick Practice" showBottomNav={true}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/25"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Quick Practice
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Jump into rapid diagnostic training with timed challenges and focused practice scenarios.
        </motion.p>
      </motion.div>

      {/* Practice Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="space-y-4 mb-6"
      >
        {quickPracticeOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
            >
              <MobileCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${option.color}-100 rounded-2xl flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 text-${option.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Level: {option.difficulty}</span>
                      <span>•</span>
                      <span>Duration: {option.duration}</span>
                    </div>
                  </div>
                  <MobileButton size="sm">
                    <Play className="h-4 w-4" />
                  </MobileButton>
                </div>
              </MobileCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Cases */}
      {!isLoading && cases && cases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Continue Recent Cases</h2>
          <div className="space-y-3">
            {cases.slice(0, 3).map((case_, index) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
              >
                <MobileCard className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{case_.name}</h4>
                        <p className="text-xs text-gray-500">{case_.specialty}</p>
                      </div>
                    </div>
                    <Link href={`/game/${case_.id}`}>
                      <MobileButton size="sm" variant="secondary">
                        <ArrowRight className="h-3 w-3" />
                      </MobileButton>
                    </Link>
                  </div>
                </MobileCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </MobileLayout>
  );
}
