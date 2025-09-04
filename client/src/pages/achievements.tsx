import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { AchievementBadge, AchievementUnlockAnimation } from "@/components/achievement-badge";
import { 
  medicalSpecialtyAchievements,
  achievementCategories,
  getAchievementsByCategory,
  getEarnedAchievements,
  getTotalPoints,
  getAchievementProgress
} from "@/data/medical-achievements";
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
  CheckCircle,
  Filter,
  Crown
} from "lucide-react";

export default function Achievements() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch user progress summary including achievements
  const { data: userProgressSummary, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/user-progress-summary"],
    retry: false,
  });

  // Fetch user achievements
  const { data: userAchievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/user-achievements"],
    retry: false,
  });

  // Unlock achievement mutation
  const unlockAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      return await apiRequest("POST", `/api/achievements/${achievementId}/unlock`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress-summary"] });
    },
  });

  // Merge server data with local achievement definitions
  const mergedAchievements = medicalSpecialtyAchievements.map(localAchievement => {
    const serverAchievement = userAchievements.find((ua: any) => 
      ua.achievement?.title === localAchievement.title || 
      ua.achievementId === localAchievement.id
    );
    
    return {
      ...localAchievement,
      earned: !!serverAchievement,
      unlockedAt: serverAchievement?.unlockedAt,
      isNew: serverAchievement?.isNew || false
    };
  });

  const userStats = userProgressSummary ? {
    casesCompleted: userProgressSummary.stats.casesCompleted,
    accuracy: userProgressSummary.stats.accuracy,
    streak: userProgressSummary.stats.currentStreak || 4, // Mock streak for now
    timeSpent: formatTimeSpent(userProgressSummary.stats.timeSpent),
    rank: getRankFromStats(userProgressSummary.stats),
    totalPoints: userProgressSummary.stats.totalPoints
  } : {
    casesCompleted: 0,
    accuracy: 0,
    streak: 0,
    timeSpent: "0h 0m",
    rank: "Medical Student",
    totalPoints: 0
  };

  const achievementProgress = {
    earned: mergedAchievements.filter(a => a.earned).length,
    total: mergedAchievements.length,
    percentage: Math.round((mergedAchievements.filter(a => a.earned).length / mergedAchievements.length) * 100)
  };
  
  const filteredAchievements = selectedCategory === 'all' 
    ? mergedAchievements 
    : mergedAchievements.filter(achievement => {
        const categoryMap: Record<string, string> = {
          "getting-started": "Getting Started",
          "specialization": "Specialization", 
          "performance": "Performance",
          "ai-mastery": "AI Mastery",
          "community": "Community",
          "milestones": "Milestones"
        };
        return achievement.category === categoryMap[selectedCategory];
      });

  function formatTimeSpent(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  function getRankFromStats(stats: any): string {
    const { casesCompleted, accuracy, totalPoints } = stats;
    
    if (casesCompleted >= 100 && accuracy >= 90 && totalPoints >= 2000) {
      return "Expert Physician";
    } else if (casesCompleted >= 50 && accuracy >= 85 && totalPoints >= 1000) {
      return "Senior Resident";
    } else if (casesCompleted >= 20 && accuracy >= 80 && totalPoints >= 500) {
      return "Junior Resident";
    } else if (casesCompleted >= 5 && totalPoints >= 100) {
      return "Clinical Level";
    } else {
      return "Medical Student";
    }
  }

  const recentActivity = userProgressSummary?.recentActivity?.map((activity: any, index: number) => {
    const isAchievement = userProgressSummary.recentAchievements?.some((ach: any) => 
      ach.achievement?.title === activity.case
    );
    
    return {
      action: activity.completed ? "Completed" : "Started",
      case: activity.diagnosis || `Case ${activity.caseId}`,
      points: activity.score || 0,
      time: getTimeAgo(activity.createdAt || activity.completedAt),
      isAchievement
    };
  }) || [
    { action: "Completed", case: "Acute MI Case", points: 85, time: "2 hours ago" },
    { action: "Earned", case: "Emergency Medicine Specialist", points: 350, time: "1 day ago", isAchievement: true },
    { action: "Generated", case: "AI Pneumonia Case", points: 50, time: "2 days ago" },
    { action: "Earned", case: "Cardiology Novice", points: 100, time: "3 days ago", isAchievement: true },
    { action: "Completed", case: "Pediatric Fever", points: 75, time: "3 days ago" }
  ];

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const handleAchievementClick = (achievement: any) => {
    if (achievement.earned && !achievement.isNew) {
      // Show achievement details or do nothing for already seen achievements
      return;
    }
    
    if (achievement.isNew) {
      setNewlyUnlockedAchievement(achievement);
      setShowUnlockAnimation(true);
    }
  };

  if (progressLoading || achievementsLoading) {
    return (
      <MobileLayout title="Progress & Achievements" showBottomNav={true}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </MobileLayout>
    );
  }

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
            <div className="mt-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600">
                <Crown className="w-4 h-4" />
                <span>{achievementProgress.earned}/{achievementProgress.total} Achievements ({achievementProgress.percentage}%)</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2 mt-1">
                <motion.div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${achievementProgress.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Achievement Badges</h3>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {achievementCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence mode="wait">
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <AchievementBadge
                    achievement={achievement}
                    size="sm"
                    onClick={() => handleAchievementClick(achievement)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No achievements found in this category.
            </div>
          )}
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
              <MobileCard className={`p-4 ${activity.isAchievement ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {activity.isAchievement && (
                      <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">
                        <span className="font-medium">{activity.action}</span> {activity.case}
                        {activity.isAchievement && <span className="text-yellow-600 ml-1">🏆</span>}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${activity.isAchievement ? 'text-yellow-600' : 'text-indigo-600'}`}>
                      +{activity.points}
                    </span>
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

      {/* Achievement Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && newlyUnlockedAchievement && (
          <AchievementUnlockAnimation
            achievement={newlyUnlockedAchievement}
            isVisible={showUnlockAnimation}
            onClose={() => {
              setShowUnlockAnimation(false);
              setNewlyUnlockedAchievement(null);
            }}
          />
        )}
      </AnimatePresence>
    </MobileLayout>
  );
}