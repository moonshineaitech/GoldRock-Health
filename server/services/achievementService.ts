import { db } from "../db";
import { storage } from "../storage";
import { 
  achievements, 
  userAchievements, 
  userStats,
  userProgress,
  medicalCases,
  type Achievement,
  type UserAchievement,
  type UserStats,
  type UserProgress,
  type MedicalCase
} from "@shared/schema";
import { eq, and, sql, count, avg } from "drizzle-orm";

interface AchievementCriteria {
  type: "casesCompleted" | "accuracy" | "specialty" | "streak" | "speed" | "milestone";
  target: number;
  specialty?: string;
  accuracyThreshold?: number;
  timeThreshold?: number;
  consecutiveDays?: number;
}

interface UnlockedAchievement {
  achievement: Achievement;
  userAchievement: UserAchievement;
  isNewlyUnlocked: boolean;
}

export class AchievementService {
  /**
   * Check and unlock achievements based on user progress
   */
  static async checkAndUnlockAchievements(userId: string): Promise<UnlockedAchievement[]> {
    try {
      // Get all achievements that exist
      const allAchievements = await storage.getAchievements();
      
      // Get user's current achievements
      const userAchievements = await storage.getUserAchievements(userId);
      const unlockedAchievementIds = new Set(
        userAchievements.filter(ua => ua.isUnlocked).map(ua => ua.achievementId)
      );

      // Get or initialize user stats
      let userStats = await storage.getUserStats(userId);
      if (!userStats) {
        userStats = await storage.initializeUserStats(userId);
      }

      const newlyUnlocked: UnlockedAchievement[] = [];

      // Check each achievement
      for (const achievement of allAchievements) {
        if (unlockedAchievementIds.has(achievement.id)) {
          continue; // Already unlocked
        }

        const progress = await this.calculateProgress(userId, achievement.criteria);
        
        // Update progress
        await storage.updateAchievementProgress(userId, achievement.id, progress.current);

        // Check if achievement should be unlocked
        if (progress.current >= progress.target) {
          const userAchievement = await storage.unlockAchievement(achievement.id, userId);
          newlyUnlocked.push({
            achievement,
            userAchievement,
            isNewlyUnlocked: true
          });
        }
      }

      // Update user stats with new achievements
      if (newlyUnlocked.length > 0) {
        await this.updateUserStatsWithNewAchievements(userId, newlyUnlocked);
      }

      return newlyUnlocked;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return [];
    }
  }

  /**
   * Calculate progress towards an achievement
   */
  static async calculateProgress(userId: string, criteria: AchievementCriteria): Promise<{ current: number; target: number }> {
    const target = criteria.target;

    switch (criteria.type) {
      case "casesCompleted":
        return await this.calculateCasesCompletedProgress(userId, target);
      
      case "accuracy":
        return await this.calculateAccuracyProgress(userId, target, criteria.accuracyThreshold);
      
      case "specialty":
        return await this.calculateSpecialtyProgress(userId, target, criteria.specialty, criteria.accuracyThreshold);
      
      case "streak":
        return await this.calculateStreakProgress(userId, target);
      
      case "speed":
        return await this.calculateSpeedProgress(userId, target, criteria.timeThreshold);
      
      case "milestone":
        return await this.calculateMilestoneProgress(userId, target);
      
      default:
        return { current: 0, target };
    }
  }

  /**
   * Calculate cases completed progress
   */
  private static async calculateCasesCompletedProgress(userId: string, target: number): Promise<{ current: number; target: number }> {
    const [result] = await db
      .select({ count: count() })
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.completed, true)
      ));

    return {
      current: result.count,
      target
    };
  }

  /**
   * Calculate accuracy-based progress
   */
  private static async calculateAccuracyProgress(userId: string, target: number, accuracyThreshold: number = 85): Promise<{ current: number; target: number }> {
    const [result] = await db
      .select({ count: count() })
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.completed, true),
        sql`CAST(${userProgress.accuracy} AS DECIMAL) >= ${accuracyThreshold}`
      ));

    return {
      current: result.count,
      target
    };
  }

  /**
   * Calculate specialty-specific progress
   */
  private static async calculateSpecialtyProgress(
    userId: string, 
    target: number, 
    specialty?: string, 
    accuracyThreshold?: number
  ): Promise<{ current: number; target: number }> {
    if (!specialty) {
      return { current: 0, target };
    }

    let query = db
      .select({ count: count() })
      .from(userProgress)
      .innerJoin(medicalCases, eq(userProgress.caseId, medicalCases.id))
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.completed, true),
        eq(medicalCases.specialty, specialty)
      ));

    if (accuracyThreshold) {
      query = query.where(sql`CAST(${userProgress.accuracy} AS DECIMAL) >= ${accuracyThreshold}`);
    }

    const [result] = await query;

    return {
      current: result.count,
      target
    };
  }

  /**
   * Calculate streak progress
   */
  private static async calculateStreakProgress(userId: string, target: number): Promise<{ current: number; target: number }> {
    const userStats = await storage.getUserStats(userId);
    return {
      current: userStats?.currentStreak || 0,
      target
    };
  }

  /**
   * Calculate speed-based progress
   */
  private static async calculateSpeedProgress(userId: string, target: number, timeThreshold: number = 900): Promise<{ current: number; target: number }> {
    const [result] = await db
      .select({ count: count() })
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.completed, true),
        sql`${userProgress.timeElapsed} <= ${timeThreshold}`
      ));

    return {
      current: result.count,
      target
    };
  }

  /**
   * Calculate milestone progress
   */
  private static async calculateMilestoneProgress(userId: string, target: number): Promise<{ current: number; target: number }> {
    // Milestone achievements are typically based on overall statistics
    const [result] = await db
      .select({ count: count() })
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.completed, true)
      ));

    return {
      current: result.count,
      target
    };
  }

  /**
   * Update user stats when new achievements are unlocked
   */
  private static async updateUserStatsWithNewAchievements(userId: string, newAchievements: UnlockedAchievement[]): Promise<void> {
    const userStats = await storage.getUserStats(userId);
    if (!userStats) return;

    const pointsGained = newAchievements.reduce((sum, { achievement }) => sum + achievement.points, 0);
    
    // Update achievement counts by rarity and category
    const achievementUpdates = {
      total: userStats.achievements.total + newAchievements.length,
      byRarity: { ...userStats.achievements.byRarity },
      byCategory: { ...userStats.achievements.byCategory }
    };

    newAchievements.forEach(({ achievement }) => {
      achievementUpdates.byRarity[achievement.rarity] = (achievementUpdates.byRarity[achievement.rarity] || 0) + 1;
      achievementUpdates.byCategory[achievement.category] = (achievementUpdates.byCategory[achievement.category] || 0) + 1;
    });

    await storage.updateUserStats(userId, {
      totalPoints: userStats.totalPoints + pointsGained,
      achievements: achievementUpdates
    });
  }

  /**
   * Update user stats after completing a case
   */
  static async updateStatsAfterCaseCompletion(userId: string, caseId: string, accuracy: number, timeElapsed: number): Promise<void> {
    try {
      // Get case details for specialty tracking
      const medicalCase = await storage.getMedicalCase(caseId);
      if (!medicalCase) return;

      let userStats = await storage.getUserStats(userId);
      if (!userStats) {
        userStats = await storage.initializeUserStats(userId);
      }

      // Update specialty stats
      const specialtyStats = { ...userStats.specialtyStats };
      if (!specialtyStats[medicalCase.specialty]) {
        specialtyStats[medicalCase.specialty] = {
          casesCompleted: 0,
          averageAccuracy: 0,
          averageSpeed: 0,
          lastCompletedAt: new Date().toISOString()
        };
      }

      const specialty = specialtyStats[medicalCase.specialty];
      const newCasesCompleted = specialty.casesCompleted + 1;
      const newAverageAccuracy = ((specialty.averageAccuracy * specialty.casesCompleted) + accuracy) / newCasesCompleted;
      const newAverageSpeed = ((specialty.averageSpeed * specialty.casesCompleted) + timeElapsed) / newCasesCompleted;

      specialtyStats[medicalCase.specialty] = {
        casesCompleted: newCasesCompleted,
        averageAccuracy: newAverageAccuracy,
        averageSpeed: newAverageSpeed,
        lastCompletedAt: new Date().toISOString()
      };

      // Update overall stats
      const newTotalCases = userStats.totalCasesCompleted + 1;
      const newAverageAccuracy = ((parseFloat(userStats.averageAccuracy.toString()) * userStats.totalCasesCompleted) + accuracy) / newTotalCases;
      const newAverageSpeed = ((userStats.averageSpeed * userStats.totalCasesCompleted) + timeElapsed) / newTotalCases;

      // Update streak logic
      const today = new Date().toDateString();
      const lastActivity = userStats.lastActivityDate ? new Date(userStats.lastActivityDate).toDateString() : null;
      let newStreak = userStats.currentStreak;

      if (lastActivity === today) {
        // Same day, maintain streak
        newStreak = userStats.currentStreak;
      } else if (lastActivity === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
        // Previous day, extend streak
        newStreak = userStats.currentStreak + 1;
      } else {
        // Gap in days, reset streak
        newStreak = 1;
      }

      await storage.updateUserStats(userId, {
        totalCasesCompleted: newTotalCases,
        averageAccuracy: newAverageAccuracy.toString(),
        averageSpeed: Math.round(newAverageSpeed),
        currentStreak: newStreak,
        longestStreak: Math.max(userStats.longestStreak, newStreak),
        lastActivityDate: new Date(),
        specialtyStats
      });

    } catch (error) {
      console.error("Error updating stats after case completion:", error);
    }
  }
}