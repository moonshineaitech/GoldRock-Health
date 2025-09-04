import { 
  medicalCases, 
  userProgress, 
  achievements, 
  userAchievements,
  userStats,
  platformStats,
  users,
  medicalImages,
  imageAnalysisProgress,
  studyGroups,
  studyGroupMembers,
  boardExams,
  boardExamAttempts,
  clinicalDecisionTrees,
  decisionTreeProgress,
  medicalBills,
  billAnalysisResults,
  reductionStrategies,
  chatSessions,
  chatMessages,
  type MedicalCase, 
  type InsertMedicalCase,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type UserStats,
  type InsertUserStats,
  type PlatformStats,
  type User,
  type UpsertUser,
  type MedicalImage,
  type InsertMedicalImage,
  type ImageAnalysisProgress,
  type InsertImageAnalysisProgress,
  type StudyGroup,
  type InsertStudyGroup,
  type StudyGroupMember,
  type InsertStudyGroupMember,
  type BoardExam,
  type InsertBoardExam,
  type BoardExamAttempt,
  type InsertBoardExamAttempt,
  type ClinicalDecisionTree,
  type InsertClinicalDecisionTree,
  type DecisionTreeProgress,
  type InsertDecisionTreeProgress,
  type MedicalBill,
  type InsertMedicalBill,
  type BillAnalysisResult,
  type InsertBillAnalysisResult,
  type ReductionStrategy,
  type InsertReductionStrategy,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage
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

  // Medical Images
  getMedicalImages(filters?: { imageType?: string; difficulty?: number; bodyRegion?: string; search?: string }): Promise<MedicalImage[]>;
  getMedicalImage(id: string): Promise<MedicalImage | undefined>;
  createMedicalImage(image: InsertMedicalImage): Promise<MedicalImage>;

  // Image Analysis Progress
  getImageAnalysisProgress(userId: string): Promise<ImageAnalysisProgress[]>;
  createImageAnalysisProgress(progress: InsertImageAnalysisProgress): Promise<ImageAnalysisProgress>;

  // Study Groups
  getStudyGroups(filters?: { specialty?: string; search?: string }): Promise<StudyGroup[]>;
  getStudyGroup(id: string): Promise<StudyGroup | undefined>;
  createStudyGroup(group: InsertStudyGroup): Promise<StudyGroup>;
  addStudyGroupMember(member: InsertStudyGroupMember): Promise<StudyGroupMember>;

  // Board Exams
  getBoardExams(filters?: { examType?: string; specialty?: string; difficulty?: number }): Promise<BoardExam[]>;
  getBoardExam(id: string): Promise<BoardExam | undefined>;
  createBoardExam(exam: InsertBoardExam): Promise<BoardExam>;
  createBoardExamAttempt(attempt: InsertBoardExamAttempt): Promise<BoardExamAttempt>;

  // Clinical Decision Trees
  getClinicalDecisionTrees(filters?: { specialty?: string; difficulty?: number; category?: string }): Promise<ClinicalDecisionTree[]>;
  getClinicalDecisionTree(id: string): Promise<ClinicalDecisionTree | undefined>;
  createClinicalDecisionTree(tree: InsertClinicalDecisionTree): Promise<ClinicalDecisionTree>;
  getDecisionTreeProgress(userId: string): Promise<DecisionTreeProgress[]>;
  createDecisionTreeProgress(progress: InsertDecisionTreeProgress): Promise<DecisionTreeProgress>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId?: string): Promise<UserAchievement[]>;
  unlockAchievement(achievementId: string, userId?: string): Promise<UserAchievement>;
  updateAchievementProgress(userId: string, achievementId: string, progress: number): Promise<UserAchievement>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;
  
  // User Statistics
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats>;
  initializeUserStats(userId: string): Promise<UserStats>;

  // Platform Statistics
  getPlatformStats(): Promise<PlatformStats | undefined>;
  updatePlatformStats(): Promise<PlatformStats>;
  
  // Medical Bill Analyzer operations
  createChatSession(userId: string, billId?: string): Promise<ChatSession>;
  getChatSessions(userId: string): Promise<ChatSession[]>;
  getCurrentChatSession(userId: string): Promise<ChatSession | undefined>;
  updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession>;
  
  createChatMessage(sessionId: string, role: string, content: string, messageType?: string, metadata?: any): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  createMedicalBill(userId: string, billData: InsertMedicalBill): Promise<MedicalBill>;
  getMedicalBills(userId: string): Promise<MedicalBill[]>;
  getMedicalBill(billId: string, userId: string): Promise<MedicalBill | undefined>;
  updateMedicalBill(billId: string, updates: Partial<MedicalBill>): Promise<MedicalBill>;
  
  createBillAnalysis(billId: string, analysisData: InsertBillAnalysisResult): Promise<BillAnalysisResult>;
  getBillAnalysis(billId: string): Promise<BillAnalysisResult | undefined>;
  
  createReductionStrategy(strategyData: InsertReductionStrategy): Promise<ReductionStrategy>;
  getReductionStrategies(billId: string): Promise<ReductionStrategy[]>;
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
      .values({ 
        achievementId, 
        userId,
        isUnlocked: true,
        unlockedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [userAchievements.userId, userAchievements.achievementId],
        set: {
          isUnlocked: true,
          unlockedAt: new Date()
        }
      })
      .returning();
    return achievement;
  }

  async updateAchievementProgress(userId: string, achievementId: string, progress: number): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values({ 
        userId,
        achievementId,
        progress
      })
      .onConflictDoUpdate({
        target: [userAchievements.userId, userAchievements.achievementId],
        set: {
          progress
        }
      })
      .returning();
    return achievement;
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    // This would contain logic to check user stats against achievement criteria
    // and unlock achievements automatically. For now, return empty array
    return [];
  }

  // User Statistics
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats> {
    const [stats] = await db
      .insert(userStats)
      .values({ 
        userId,
        ...updates
      })
      .onConflictDoUpdate({
        target: userStats.userId,
        set: {
          ...updates,
          updatedAt: new Date()
        }
      })
      .returning();
    return stats;
  }

  async initializeUserStats(userId: string): Promise<UserStats> {
    const [stats] = await db
      .insert(userStats)
      .values({ 
        userId,
        totalCasesCompleted: 0,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageAccuracy: "0.00",
        averageSpeed: 0,
        specialtyStats: {},
        achievements: { total: 0, byRarity: {}, byCategory: {} }
      })
      .onConflictDoNothing()
      .returning();
    return stats;
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

  // Medical Images
  async getMedicalImages(filters?: { imageType?: string; difficulty?: number; bodyRegion?: string; search?: string }): Promise<MedicalImage[]> {
    let query = db.select().from(medicalImages);
    
    if (filters?.imageType) {
      query = query.where(eq(medicalImages.imageType, filters.imageType));
    }
    
    if (filters?.difficulty) {
      query = query.where(eq(medicalImages.difficulty, filters.difficulty));
    }
    
    if (filters?.bodyRegion) {
      query = query.where(eq(medicalImages.bodyRegion, filters.bodyRegion));
    }
    
    if (filters?.search) {
      query = query.where(
        sql`${medicalImages.title} ILIKE ${`%${filters.search}%`} OR 
            ${medicalImages.description} ILIKE ${`%${filters.search}%`} OR 
            ${medicalImages.bodyRegion} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    return await query.orderBy(medicalImages.createdAt);
  }

  async getMedicalImage(id: string): Promise<MedicalImage | undefined> {
    const [image] = await db.select().from(medicalImages).where(eq(medicalImages.id, id));
    return image;
  }

  async createMedicalImage(image: InsertMedicalImage): Promise<MedicalImage> {
    const [newImage] = await db.insert(medicalImages).values(image).returning();
    return newImage;
  }

  // Image Analysis Progress
  async getImageAnalysisProgress(userId: string): Promise<ImageAnalysisProgress[]> {
    return await db
      .select()
      .from(imageAnalysisProgress)
      .where(eq(imageAnalysisProgress.userId, userId))
      .orderBy(desc(imageAnalysisProgress.createdAt));
  }

  async createImageAnalysisProgress(progress: InsertImageAnalysisProgress): Promise<ImageAnalysisProgress> {
    const [newProgress] = await db.insert(imageAnalysisProgress).values(progress).returning();
    return newProgress;
  }

  // Study Groups
  async getStudyGroups(filters?: { specialty?: string; search?: string }): Promise<StudyGroup[]> {
    let query = db.select().from(studyGroups).where(eq(studyGroups.isPrivate, false));
    
    if (filters?.specialty) {
      query = query.where(eq(studyGroups.specialty, filters.specialty));
    }
    
    if (filters?.search) {
      query = query.where(
        sql`${studyGroups.name} ILIKE ${`%${filters.search}%`} OR 
            ${studyGroups.description} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    return await query.orderBy(desc(studyGroups.createdAt));
  }

  async getStudyGroup(id: string): Promise<StudyGroup | undefined> {
    const [group] = await db.select().from(studyGroups).where(eq(studyGroups.id, id));
    return group;
  }

  async createStudyGroup(group: InsertStudyGroup): Promise<StudyGroup> {
    const [newGroup] = await db.insert(studyGroups).values(group).returning();
    return newGroup;
  }

  async addStudyGroupMember(member: InsertStudyGroupMember): Promise<StudyGroupMember> {
    const [newMember] = await db.insert(studyGroupMembers).values(member).returning();
    
    // Update member count
    await db
      .update(studyGroups)
      .set({ currentMembers: sql`${studyGroups.currentMembers} + 1` })
      .where(eq(studyGroups.id, member.groupId));
    
    return newMember;
  }

  // Board Exams
  async getBoardExams(filters?: { examType?: string; specialty?: string; difficulty?: number }): Promise<BoardExam[]> {
    let query = db.select().from(boardExams);
    
    if (filters?.examType) {
      query = query.where(eq(boardExams.examType, filters.examType));
    }
    
    if (filters?.specialty) {
      query = query.where(eq(boardExams.specialty, filters.specialty));
    }
    
    if (filters?.difficulty) {
      query = query.where(eq(boardExams.difficulty, filters.difficulty));
    }
    
    return await query.orderBy(desc(boardExams.createdAt));
  }

  async getBoardExam(id: string): Promise<BoardExam | undefined> {
    const [exam] = await db.select().from(boardExams).where(eq(boardExams.id, id));
    return exam;
  }

  async createBoardExam(exam: InsertBoardExam): Promise<BoardExam> {
    const [newExam] = await db.insert(boardExams).values(exam).returning();
    return newExam;
  }

  async createBoardExamAttempt(attempt: InsertBoardExamAttempt): Promise<BoardExamAttempt> {
    const [newAttempt] = await db.insert(boardExamAttempts).values(attempt).returning();
    return newAttempt;
  }

  // Clinical Decision Trees
  async getClinicalDecisionTrees(filters?: { specialty?: string; difficulty?: number; category?: string }): Promise<ClinicalDecisionTree[]> {
    let query = db.select().from(clinicalDecisionTrees);
    
    if (filters?.specialty && filters.specialty !== "all") {
      query = query.where(eq(clinicalDecisionTrees.specialty, filters.specialty));
    }
    
    if (filters?.difficulty) {
      query = query.where(eq(clinicalDecisionTrees.difficulty, filters.difficulty));
    }
    
    if (filters?.category && filters.category !== "all") {
      query = query.where(eq(clinicalDecisionTrees.category, filters.category));
    }
    
    return await query.orderBy(desc(clinicalDecisionTrees.createdAt));
  }

  async getClinicalDecisionTree(id: string): Promise<ClinicalDecisionTree | undefined> {
    const [tree] = await db.select().from(clinicalDecisionTrees).where(eq(clinicalDecisionTrees.id, id));
    return tree;
  }

  async createClinicalDecisionTree(tree: InsertClinicalDecisionTree): Promise<ClinicalDecisionTree> {
    const [newTree] = await db.insert(clinicalDecisionTrees).values(tree).returning();
    return newTree;
  }

  async getDecisionTreeProgress(userId: string): Promise<DecisionTreeProgress[]> {
    return await db
      .select()
      .from(decisionTreeProgress)
      .where(eq(decisionTreeProgress.userId, userId))
      .orderBy(desc(decisionTreeProgress.createdAt));
  }

  async createDecisionTreeProgress(progress: InsertDecisionTreeProgress): Promise<DecisionTreeProgress> {
    const [newProgress] = await db.insert(decisionTreeProgress).values(progress).returning();
    return newProgress;
  }
}

export const storage = new DatabaseStorage();
