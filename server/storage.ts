import { 
  medicalCases, 
  userProgress, 
  achievements, 
  userAchievements,
  platformStats,
  users,
  type MedicalCase, 
  type InsertMedicalCase,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type PlatformStats,
  type User,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Medical Cases
  getMedicalCases(filters?: { specialty?: string; difficulty?: number; search?: string }): Promise<MedicalCase[]>;
  getMedicalCase(id: string): Promise<MedicalCase | undefined>;
  createMedicalCase(medicalCase: InsertMedicalCase): Promise<MedicalCase>;
  updateMedicalCase(id: string, updates: Partial<InsertMedicalCase>): Promise<MedicalCase | undefined>;

  // User Progress
  getUserProgress(caseId: string, userId?: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined>;
  getLatestProgress(caseId: string, userId?: string): Promise<UserProgress | undefined>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId?: string): Promise<UserAchievement[]>;
  unlockAchievement(achievementId: string, userId?: string): Promise<UserAchievement>;

  // Platform Statistics
  getPlatformStats(): Promise<PlatformStats | undefined>;
  updatePlatformStats(): Promise<PlatformStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Medical Cases
  async getMedicalCases(filters?: { specialty?: string; difficulty?: number; search?: string }): Promise<MedicalCase[]> {
    let query = db.select().from(medicalCases);
    
    if (filters?.specialty && filters.specialty !== 'All Specialties') {
      query = query.where(eq(medicalCases.specialty, filters.specialty));
    }
    
    if (filters?.difficulty) {
      query = query.where(eq(medicalCases.difficulty, filters.difficulty));
    }
    
    if (filters?.search) {
      query = query.where(
        sql`${medicalCases.name} ILIKE ${`%${filters.search}%`} OR 
            ${medicalCases.chiefComplaint} ILIKE ${`%${filters.search}%`} OR 
            ${medicalCases.correctDiagnosis} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    return await query.orderBy(medicalCases.createdAt);
  }

  async getMedicalCase(id: string): Promise<MedicalCase | undefined> {
    const [medicalCase] = await db.select().from(medicalCases).where(eq(medicalCases.id, id));
    return medicalCase;
  }

  async createMedicalCase(medicalCase: InsertMedicalCase): Promise<MedicalCase> {
    const [newCase] = await db.insert(medicalCases).values(medicalCase).returning();
    return newCase;
  }

  async updateMedicalCase(id: string, updates: Partial<InsertMedicalCase>): Promise<MedicalCase | undefined> {
    const [updated] = await db
      .update(medicalCases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(medicalCases.id, id))
      .returning();
    return updated;
  }

  // User Progress
  async getUserProgress(caseId: string, userId?: string): Promise<UserProgress[]> {
    const conditions = [eq(userProgress.caseId, caseId)];
    if (userId) {
      conditions.push(eq(userProgress.userId, userId));
    }
    
    return await db
      .select()
      .from(userProgress)
      .where(and(...conditions))
      .orderBy(desc(userProgress.createdAt));
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }

  async updateUserProgress(id: string, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined> {
    const [updated] = await db
      .update(userProgress)
      .set(updates)
      .where(eq(userProgress.id, id))
      .returning();
    return updated;
  }

  async getLatestProgress(caseId: string, userId?: string): Promise<UserProgress | undefined> {
    const conditions = [eq(userProgress.caseId, caseId)];
    if (userId) {
      conditions.push(eq(userProgress.userId, userId));
    }
    
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(...conditions))
      .orderBy(desc(userProgress.createdAt))
      .limit(1);
    return progress;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.createdAt);
  }

  async getUserAchievements(userId?: string): Promise<UserAchievement[]> {
    let query = db.select().from(userAchievements);
    
    if (userId) {
      query = query.where(eq(userAchievements.userId, userId));
    }
    
    return await query.orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(achievementId: string, userId?: string): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values({ achievementId, userId })
      .returning();
    return achievement;
  }

  // Platform Statistics
  async getPlatformStats(): Promise<PlatformStats | undefined> {
    const [stats] = await db.select().from(platformStats).limit(1);
    return stats;
  }

  async updatePlatformStats(): Promise<PlatformStats> {
    const [totalCasesResult] = await db.select({ count: count() }).from(medicalCases);
    const [totalProgressResult] = await db.select({ count: count() }).from(userProgress);
    
    const stats = {
      totalCases: totalCasesResult.count,
      activeStudents: Math.floor(totalProgressResult.count * 0.3), // Simulate active students
      totalHours: Math.floor(totalProgressResult.count * 0.2), // Simulate training hours
      avgAccuracy: "94.2", // Professional average
      updatedAt: new Date(),
    };

    const [existingStats] = await db.select().from(platformStats).limit(1);
    
    if (existingStats) {
      const [updated] = await db
        .update(platformStats)
        .set(stats)
        .where(eq(platformStats.id, existingStats.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(platformStats).values(stats).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
