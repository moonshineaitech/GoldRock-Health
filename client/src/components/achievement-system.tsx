import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Medal, Clock, Mic, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AchievementSystem() {
  const { data: achievements } = useQuery({
    queryKey: ["/api/user-achievements"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Mock analytics data for display
  const analytics = {
    accuracy: 87,
    speed: 72,
    completion: 43,
    total: 67
  };

  const recentAchievements = [
    {
      title: "Cardiology Expert",
      description: "Completed 10 cardiology cases with 90%+ accuracy",
      icon: Medal,
      date: "2 days ago",
      gradient: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      iconGradient: "from-amber-400 to-orange-500"
    },
    {
      title: "Speed Demon", 
      description: "Diagnosed 5 cases in under 15 minutes each",
      icon: Clock,
      date: "1 week ago",
      gradient: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      iconGradient: "from-emerald-400 to-teal-500"
    },
    {
      title: "Voice Master",
      description: "Completed 25 cases using voice interactions",
      icon: Mic,
      date: "2 weeks ago", 
      gradient: "from-purple-50 to-indigo-50",
      border: "border-purple-200",
      iconGradient: "from-purple-400 to-indigo-500"
    }
  ];

  return (
    <section id="progress" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Track Your Progress</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Monitor your diagnostic skills development with comprehensive analytics and achievement tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Target className="text-indigo-600 mr-3 h-5 w-5" />
              Learning Analytics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Overall Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${analytics.accuracy}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <span className="font-semibold text-slate-900">{analytics.accuracy}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Speed Improvement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${analytics.speed}%` }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                    />
                  </div>
                  <span className="font-semibold text-slate-900">+{analytics.speed}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Case Completion</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(analytics.completion / analytics.total) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                    />
                  </div>
                  <span className="font-semibold text-slate-900">{analytics.completion}/{analytics.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Specialty Strengths</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700 text-sm font-medium">Cardiology</span>
                    <span className="text-emerald-800 font-bold">94%</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-700 text-sm font-medium">Neurology</span>
                    <span className="text-indigo-800 font-bold">89%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievement Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Trophy className="text-amber-500 mr-3 h-5 w-5" />
              Recent Achievements
            </h3>
            
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-gradient-to-r ${achievement.gradient} rounded-2xl p-4 border ${achievement.border} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${achievement.iconGradient} rounded-xl flex items-center justify-center`}>
                    <achievement.icon className="text-white h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{achievement.title}</h4>
                    <p className="text-slate-600 text-sm">{achievement.description}</p>
                  </div>
                  <span className="text-slate-500 text-sm font-medium">{achievement.date}</span>
                </div>
              </motion.div>
            ))}

            <div className="text-center pt-4">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                View All Achievements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
