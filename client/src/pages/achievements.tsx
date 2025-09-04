import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Brain,
  Award,
  Zap,
  Heart,
  Users,
  CheckCircle
} from "lucide-react";

export default function Achievements() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const userStats = {
    casesCompleted: 47,
    accuracy: 89,
    streak: 12,
    timeSpent: "34h 22m",
    rank: "Clinical Level",
    totalPoints: 2847
  };

  const achievements = [
    {
      id: "first-case",
      title: "First Diagnosis",
      description: "Complete your first medical case",
      icon: BookOpen,
      earned: true,
      rarity: "Common",
      points: 50,
      category: "Getting Started"
    },
    {
      id: "accuracy-master",
      title: "Accuracy Master",
      description: "Achieve 90% accuracy in 10 consecutive cases",
      icon: Target,
      earned: true,
      rarity: "Rare",
      points: 200,
      category: "Performance"
    },
    {
      id: "ai-pioneer", 
      title: "AI Pioneer",
      description: "Generate and complete 5 AI cases",
      icon: Brain,
      earned: false,
      rarity: "Epic",
      points: 300,
      category: "AI Mastery",
      progress: 3
    },
    {
      id: "specialist",
      title: "Cardiology Specialist",
      description: "Complete 20 cardiology cases",
      icon: Heart,
      earned: true,
      rarity: "Rare",
      points: 250,
      category: "Specialization"
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Complete a case in under 5 minutes",
      icon: Zap,
      earned: false,
      rarity: "Legendary",
      points: 500,
      category: "Performance"
    },
    {
      id: "social-learner",
      title: "Social Learner",
      description: "Share 3 cases with colleagues",
      icon: Users,
      earned: false,
      rarity: "Common",
      points: 75,
      category: "Community"
    }
  ];

  const recentActivity = [
    { action: "Completed", case: "Acute MI Case", points: 85, time: "2 hours ago" },
    { action: "Earned", case: "Accuracy Master Badge", points: 200, time: "1 day ago" },
    { action: "Generated", case: "AI Pneumonia Case", points: 50, time: "2 days ago" },
    { action: "Completed", case: "Pediatric Fever", points: 75, time: "3 days ago" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-700";
      case "Rare": return "bg-blue-100 text-blue-700";
      case "Epic": return "bg-purple-100 text-purple-700";
      case "Legendary": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <MobileLayout title="Progress & Achievements" showBottomNav={true}>
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MobileCard className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="text-center mb-4">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-500/25"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              <Trophy className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-lg font-bold text-indigo-900 mb-1">{userStats.rank}</h2>
            <p className="text-sm text-indigo-700">{userStats.totalPoints} Total Points</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Cases Completed", value: userStats.casesCompleted, icon: CheckCircle },
              { label: "Accuracy Rate", value: `${userStats.accuracy}%`, icon: Target },
              { label: "Current Streak", value: `${userStats.streak} days`, icon: TrendingUp },
              { label: "Time Spent", value: userStats.timeSpent, icon: Clock }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                >
                  <IconComponent className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-indigo-900">{stat.value}</div>
                  <div className="text-xs text-indigo-700">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </MobileCard>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "achievements", label: "Badges" },
            { id: "activity", label: "Activity" }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setSelectedTab(tab.id)}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      {selectedTab === "achievements" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Achievement Badges</h3>
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <MobileCard className={`${achievement.earned ? 'border-green-200 bg-green-50' : 'opacity-75'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-indigo-600 font-medium">+{achievement.points} pts</span>
                        {achievement.earned ? (
                          <span className="text-xs text-green-600 font-medium">✓ Earned</span>
                        ) : achievement.progress ? (
                          <span className="text-xs text-gray-500">{achievement.progress}/5</span>
                        ) : (
                          <span className="text-xs text-gray-400">Locked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </MobileCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {selectedTab === "activity" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <MobileCard className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">
                      <span className="font-medium">{activity.action}</span> {activity.case}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-indigo-600">+{activity.points}</span>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </MobileCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Progress Chart Placeholder */}
          <MobileCard>
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-indigo-700">Progress Chart</p>
              </div>
            </div>
          </MobileCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <MobileButton className="h-20" variant="secondary">
              <div className="text-center">
                <Star className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm">View All Badges</span>
              </div>
            </MobileButton>
            <MobileButton className="h-20" variant="secondary">
              <div className="text-center">
                <Award className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm">Leaderboard</span>
              </div>
            </MobileButton>
          </div>
        </motion.div>
      )}
    </MobileLayout>
  );
}