import { MobileLayout } from "@/components/mobile-layout";
import { AchievementProgressTracker } from "@/components/achievement-progress-tracker";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Target, Star, Award, Medal, Crown } from "lucide-react";
import type { UserStats } from "@shared/schema";

export default function Progress() {
  const { data: userStats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats"],
    retry: false,
  });

  const overallStats = [
    {
      icon: Trophy,
      label: "Cases Completed",
      value: userStats?.totalCasesCompleted || 0,
    },
    {
      icon: Target,
      label: "Avg Accuracy",
      value: `${userStats?.averageAccuracy || 0}%`,
    },
    {
      icon: Star,
      label: "Total Points",
      value: userStats?.totalPoints || 0,
    },
    {
      icon: Award,
      label: "Achievements",
      value: userStats?.achievements?.total || 0,
    }
  ];

  const specialtyProgress = [
    { 
      name: "Cardiology", 
      completed: userStats?.specialtyStats?.Cardiology?.casesCompleted || 0, 
      total: 15, 
      accuracy: userStats?.specialtyStats?.Cardiology?.averageAccuracy || 0 
    },
    { 
      name: "Neurology", 
      completed: userStats?.specialtyStats?.Neurology?.casesCompleted || 0, 
      total: 12, 
      accuracy: userStats?.specialtyStats?.Neurology?.averageAccuracy || 0 
    },
    { 
      name: "Emergency Medicine", 
      completed: userStats?.specialtyStats?.["Emergency Medicine"]?.casesCompleted || 0, 
      total: 18, 
      accuracy: userStats?.specialtyStats?.["Emergency Medicine"]?.averageAccuracy || 0 
    },
    { 
      name: "Pediatrics", 
      completed: userStats?.specialtyStats?.Pediatrics?.casesCompleted || 0, 
      total: 10, 
      accuracy: userStats?.specialtyStats?.Pediatrics?.averageAccuracy || 0 
    }
  ];

  return (
    <MobileLayout title="Progress Tracking" showBackButton={true} showBottomNav={true}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <motion.div 
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <Trophy className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold font-serif text-foreground mb-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Your Progress
        </motion.h1>
        
        <motion.p 
          className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Track your learning journey, unlock achievements, and see your diagnostic skills improve over time.
        </motion.p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-lg font-semibold font-serif text-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          {overallStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.0 + index * 0.1, 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="luxury-card rounded-2xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Specialty Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-lg font-semibold font-serif text-foreground mb-4">Specialty Progress</h2>
        <div className="space-y-3">
          {specialtyProgress.map((specialty, index) => (
            <motion.div
              key={specialty.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{specialty.name}</h3>
                    <p className="text-sm text-muted-foreground">{specialty.completed}/{specialty.total} cases</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{specialty.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">accuracy</div>
                </div>
              </div>
              
              <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                  className="bg-gold h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(specialty.completed / specialty.total) * 100}%` }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievement Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold font-serif text-foreground mb-4">Achievements & Badges</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border animate-pulse">
                <div className="h-16 bg-secondary rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <AchievementProgressTracker />
        )}
      </motion.div>
    </MobileLayout>
  );
}