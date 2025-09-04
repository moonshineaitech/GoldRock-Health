import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { AICaseGenerator } from "@/components/ai-case-generator";
import { Brain, Sparkles, Zap, BookOpen, Users, Clock, ArrowRight, Star } from "lucide-react";

export default function AIGenerator() {
  const [recentCases, setRecentCases] = useState([
    {
      id: "ai-1",
      title: "Acute Chest Pain Case",
      specialty: "Cardiology",
      difficulty: "Clinical",
      createdAt: "2 hours ago",
      status: "completed"
    },
    {
      id: "ai-2", 
      title: "Neurological Symptoms",
      specialty: "Neurology",
      difficulty: "Expert",
      createdAt: "1 day ago",
      status: "in-progress"
    },
    {
      id: "ai-3",
      title: "Pediatric Fever Case",
      specialty: "Pediatrics", 
      difficulty: "Foundation",
      createdAt: "3 days ago",
      status: "completed"
    }
  ]);

  const handleCaseGenerated = (caseId: string) => {
    // Add to recent cases
    const newCase = {
      id: caseId,
      title: "New AI Generated Case",
      specialty: "Generated",
      difficulty: "Varies",
      createdAt: "Just now",
      status: "ready"
    };
    setRecentCases(prev => [newCase, ...prev.slice(0, 4)]);
  };

  return (
    <MobileLayout title="AI Case Generator" showBottomNav={true}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/25"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
        >
          <Brain className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          AI Case Generator
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Create unlimited medical cases with AI. Generate realistic patient scenarios tailored to your learning needs.
        </motion.p>
      </motion.div>

      {/* Main Generator Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <MobileCard className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Generate New Case</h3>
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-purple-700 mb-4">
              AI will create a unique medical case with realistic patient history, symptoms, and diagnostic challenges.
            </p>
            <AICaseGenerator onCaseGenerated={handleCaseGenerated} />
          </div>
        </MobileCard>
      </motion.div>

      {/* AI Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Capabilities</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: Users, title: "Diverse Cases", desc: "All age groups & demographics", color: "blue", delay: 1.2 },
            { icon: Zap, title: "Instant Creation", desc: "Generated in seconds", color: "orange", delay: 1.3 },
            { icon: BookOpen, title: "All Specialties", desc: "19+ medical fields", color: "green", delay: 1.4 },
            { icon: Star, title: "High Quality", desc: "Clinically accurate", color: "purple", delay: 1.5 }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: feature.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <MobileCard className="h-full text-center">
                  <motion.div 
                    className={`w-10 h-10 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-3`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className={`h-5 w-5 text-${feature.color}-600`} />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
                </MobileCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent AI Generated Cases */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Cases</h2>
        <div className="space-y-3">
          {recentCases.map((case_, index) => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
            >
              <MobileCard className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        case_.status === 'completed' ? 'bg-green-500' :
                        case_.status === 'in-progress' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <h3 className="font-medium text-gray-900 text-sm">{case_.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {case_.specialty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {case_.createdAt}
                      </span>
                    </div>
                  </div>
                  <MobileButton size="sm" variant="secondary">
                    <ArrowRight className="h-3 w-3" />
                  </MobileButton>
                </div>
              </MobileCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="mt-6"
      >
        <MobileCard className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              AI-generated cases are perfect for practicing diagnostic reasoning. Each case is unique and designed to challenge your clinical thinking skills.
            </p>
          </div>
        </MobileCard>
      </motion.div>
    </MobileLayout>
  );
}