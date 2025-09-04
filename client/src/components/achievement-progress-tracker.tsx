import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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
  Crown,
  Medal
} from "lucide-react";
import { MobileCard } from "./mobile-layout";
import { cn } from "@/lib/utils";

interface UserStats {
  totalCasesCompleted: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  specialtyStats: Record<string, {
    casesCompleted: number;
    averageAccuracy: number;
    averageSpeed: number;
  }>;
  achievements: {
    total: number;
    byRarity: Record<string, number>;
    byCategory: Record<string, number>;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  specialty?: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  points: number;
  progress?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  criteria: {
    type: "casesCompleted" | "accuracy" | "specialty" | "streak" | "speed" | "milestone";
    target: number;
    specialty?: string;
    accuracyThreshold?: number;
  };
}

const rarityConfig = {
  Common: { 
    color: "from-gray-100 to-gray-200", 
    border: "border-gray-300", 
    text: "text-gray-700",
    glow: "shadow-gray-500/20"
  },
  Uncommon: { 
    color: "from-green-100 to-green-200", 
    border: "border-green-300", 
    text: "text-green-700",
    glow: "shadow-green-500/25"
  },
  Rare: { 
    color: "from-blue-100 to-blue-200", 
    border: "border-blue-300", 
    text: "text-blue-700",
    glow: "shadow-blue-500/30"
  },
  Epic: { 
    color: "from-purple-100 to-purple-200", 
    border: "border-purple-300", 
    text: "text-purple-700",
    glow: "shadow-purple-500/40"
  },
  Legendary: { 
    color: "from-yellow-100 via-amber-100 to-orange-200", 
    border: "border-yellow-400", 
    text: "text-yellow-800",
    glow: "shadow-yellow-500/50"
  }
};

const categoryIcons: Record<string, any> = {
  "Getting Started": BookOpen,
  "Specialization": Brain,
  "Performance": Trophy,
  "Consistency": Target,
  "Speed": Clock,
  "Milestones": Crown,
  "Collaboration": Users,
  "Excellence": Star
};

export function AchievementProgressTracker() {
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats"],
    retry: false,
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/user-achievements"],
    retry: false,
  });

  if (statsLoading || achievementsLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <MobileCard key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200/50 rounded-2xl"></div>
          </MobileCard>
        ))}
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const totalAchievements = achievements.length;
  const progressPercentage = totalAchievements > 0 ? (unlockedAchievements.length / totalAchievements) * 100 : 0;

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <MobileCard className="bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border-cyan-200/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Achievement Progress</h3>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">
                {unlockedAchievements.length}/{totalAchievements}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{userStats?.totalPoints || 0}</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{userStats?.currentStreak || 0}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{userStats?.totalCasesCompleted || 0}</div>
              <div className="text-xs text-gray-600">Cases Done</div>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Achievement Categories */}
      {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
        const IconComponent = categoryIcons[category] || Award;
        const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length;
        const categoryProgress = (unlockedInCategory / categoryAchievements.length) * 100;

        return (
          <MobileCard key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                  <IconComponent className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{category}</h4>
                  <p className="text-sm text-gray-600">{unlockedInCategory}/{categoryAchievements.length} unlocked</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{Math.round(categoryProgress)}%</div>
              </div>
            </div>

            {/* Category Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${categoryProgress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>

            {/* Achievement Cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </MobileCard>
        );
      })}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarity = rarityConfig[achievement.rarity];
  const progress = achievement.progress || 0;
  const target = achievement.criteria.target;
  const progressPercentage = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  return (
    <motion.div
      className={cn(
        "relative p-3 rounded-2xl border-2 transition-all duration-300",
        "bg-gradient-to-br",
        rarity.color,
        rarity.border,
        rarity.glow,
        achievement.isUnlocked ? "shadow-lg" : "opacity-60 grayscale",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`achievement-${achievement.id}`}
    >
      {/* Legendary Glow Effect */}
      {achievement.rarity === "Legendary" && achievement.isUnlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
          animate={{ x: [-100, 100] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
      )}

      <div className="relative space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h5 className={cn("font-semibold text-sm leading-tight", rarity.text)}>
              {achievement.title}
            </h5>
            <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
          </div>
          {achievement.isUnlocked && (
            <CheckCircle className="h-4 w-4 text-green-600 ml-2 flex-shrink-0" />
          )}
        </div>

        {/* Progress Bar (if not unlocked) */}
        {!achievement.isUnlocked && target > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{progress}/{target}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", rarity.color, rarity.text)}>
              {achievement.rarity}
            </span>
            {achievement.specialty && (
              <span className="px-2 py-1 bg-white/60 rounded-lg text-xs text-gray-600">
                {achievement.specialty}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-600" />
            <span className="text-xs font-medium text-gray-700">{achievement.points}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}