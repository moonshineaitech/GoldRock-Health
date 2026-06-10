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
    bg: "bg-secondary", 
    border: "border-border", 
    text: "text-muted-foreground"
  },
  Uncommon: { 
    bg: "bg-card", 
    border: "border-border", 
    text: "text-foreground"
  },
  Rare: { 
    bg: "bg-card", 
    border: "border-border", 
    text: "text-foreground"
  },
  Epic: { 
    bg: "bg-card", 
    border: "border-border", 
    text: "text-foreground"
  },
  Legendary: { 
    bg: "bg-card", 
    border: "border-gold", 
    text: "text-gold"
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
            <div className="h-20 bg-muted rounded-2xl"></div>
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
      <MobileCard className="bg-card border border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold font-serif text-foreground">Achievement Progress</h3>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-muted-foreground">
                {unlockedAchievements.length}/{totalAchievements}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <motion.div
                className="bg-gold h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{userStats?.totalPoints || 0}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{userStats?.currentStreak || 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{userStats?.totalCasesCompleted || 0}</div>
              <div className="text-xs text-muted-foreground">Cases Done</div>
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
                <div className="p-2 bg-secondary rounded-xl">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{category}</h4>
                  <p className="text-sm text-muted-foreground">{unlockedInCategory}/{categoryAchievements.length} unlocked</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{Math.round(categoryProgress)}%</div>
              </div>
            </div>

            {/* Category Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                className="bg-gold h-2 rounded-full"
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
        "relative p-3 rounded-2xl border transition-all duration-300",
        rarity.bg,
        rarity.border,
        achievement.isUnlocked ? "shadow-sm" : "opacity-60 grayscale",
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`achievement-${achievement.id}`}
    >
      <div className="relative space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h5 className={cn("font-semibold text-sm leading-tight", rarity.text)}>
              {achievement.title}
            </h5>
            <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
          </div>
          {achievement.isUnlocked && (
            <CheckCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400 ml-2 flex-shrink-0" />
          )}
        </div>

        {/* Progress Bar (if not unlocked) */}
        {!achievement.isUnlocked && target > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}/{target}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <motion.div
                className="bg-gold h-1.5 rounded-full"
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
            <span className={cn("px-2 py-1 rounded-lg text-xs font-medium border bg-secondary", rarity.border, rarity.text)}>
              {achievement.rarity}
            </span>
            {achievement.specialty && (
              <span className="px-2 py-1 bg-secondary rounded-lg text-xs text-muted-foreground">
                {achievement.specialty}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-gold" />
            <span className="text-xs font-medium text-foreground">{achievement.points}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}