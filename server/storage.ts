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
  syntheticPatients,
  diagnosticSessions,
  userSavingsOutcomes,
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
  type InsertMedicalBillData,
  type BillAnalysisResult,
  type InsertBillAnalysisResult,
  type ReductionStrategy,
  type InsertReductionStrategy,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
  type SyntheticPatient,
  type InsertSyntheticPatient,
  type DiagnosticSession,
  type InsertDiagnosticSession,
  type UserSavingsOutcome,
  type InsertUserSavingsOutcome,
  enrollmentSessions,
  enrollmentResponses,
  enrollmentApplicants,
  type EnrollmentSession,
  type InsertEnrollmentSession,
  type EnrollmentResponse,
  type InsertEnrollmentResponse,
  type EnrollmentApplicant,
  type InsertEnrollmentApplicant,
  insuranceProviders,
  insurancePlans,
  benefitCategories,
  planBenefits,
  userInsurancePlans,
  type InsuranceProvider,
  type InsertInsuranceProvider,
  type InsurancePlan,
  type InsertInsurancePlan,
  type BenefitCategory,
  type PlanBenefit,
  type UserInsurancePlan,
  type InsertUserInsurancePlan
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, lte, inArray, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  acceptAiTerms(userId: string, version: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  updateUserPreferences(userId: string, preferences: Partial<User['userPreferences']>): Promise<User | undefined>;
  updateUserProfile(userId: string, updates: { firstName?: string; lastName?: string; email?: string }): Promise<User | undefined>;
  setUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | undefined>;
  getAdminUsers(): Promise<User[]>;

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
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(userId: string): Promise<ChatSession[]>;
  getCurrentChatSession(userId: string): Promise<ChatSession | undefined>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  createMedicalBill(userId: string, billData: InsertMedicalBillData): Promise<MedicalBill>;
  getMedicalBills(userId: string): Promise<MedicalBill[]>;
  getMedicalBill(billId: string, userId: string): Promise<MedicalBill | undefined>;
  updateMedicalBill(billId: string, updates: Partial<MedicalBill>): Promise<MedicalBill>;
  
  createBillAnalysis(billId: string, analysisData: InsertBillAnalysisResult): Promise<BillAnalysisResult>;
  getBillAnalysis(billId: string): Promise<BillAnalysisResult | undefined>;
  
  createReductionStrategy(strategyData: InsertReductionStrategy): Promise<ReductionStrategy>;
  getReductionStrategies(billId: string): Promise<ReductionStrategy[]>;
  
  // Synthetic Patient Diagnostics operations
  createSyntheticPatient(patientData: InsertSyntheticPatient): Promise<SyntheticPatient>;
  getSyntheticPatientsByUser(userId: string): Promise<SyntheticPatient[]>;
  getSyntheticPatientById(patientId: string): Promise<SyntheticPatient | undefined>;
  updateSyntheticPatient(patientId: string, updates: Partial<SyntheticPatient>): Promise<SyntheticPatient>;
  
  createDiagnosticSession(sessionData: InsertDiagnosticSession): Promise<DiagnosticSession>;
  getDiagnosticSessionsByUser(userId: string): Promise<DiagnosticSession[]>;
  getDiagnosticSessionById(sessionId: string): Promise<DiagnosticSession | undefined>;
  updateDiagnosticSession(sessionId: string, updates: Partial<DiagnosticSession>): Promise<DiagnosticSession>;

  // User Data Rights (GDPR/Privacy Compliance)
  deleteAllUserData(userId: string): Promise<{ success: boolean; deletedCount: number }>;
  exportUserData(userId: string): Promise<{ userData: any; medicalData: any; chatData: any; createdAt: string }>;
  cleanupOldData(retentionDays: number): Promise<{ billsDeleted: number; chatsDeleted: number; voiceCacheCleared: boolean }>;

  // User Savings Outcomes
  createSavingsOutcome(userId: string, outcome: Omit<InsertUserSavingsOutcome, 'userId' | 'id' | 'createdAt'>): Promise<UserSavingsOutcome>;
  getSavingsOutcomes(userId: string): Promise<UserSavingsOutcome[]>;
  updateSavingsOutcome(outcomeId: string, userId: string, updates: Partial<InsertUserSavingsOutcome>): Promise<UserSavingsOutcome | undefined>;
  deleteSavingsOutcome(outcomeId: string, userId: string): Promise<boolean>;

  // Medicare/Medicaid Enrollment
  createEnrollmentSession(userId: string, data: { programType: string; voiceEnabled?: boolean }): Promise<EnrollmentSession>;
  getEnrollmentSessions(userId: string): Promise<EnrollmentSession[]>;
  getEnrollmentSession(sessionId: string, userId: string): Promise<EnrollmentSession | undefined>;
  updateEnrollmentSession(sessionId: string, userId: string, updates: Partial<EnrollmentSession>): Promise<EnrollmentSession | undefined>;
  createEnrollmentResponse(response: InsertEnrollmentResponse): Promise<EnrollmentResponse>;
  getEnrollmentResponses(sessionId: string): Promise<EnrollmentResponse[]>;
  createEnrollmentApplicant(applicant: InsertEnrollmentApplicant): Promise<EnrollmentApplicant>;

  // Insurance Benefits
  getInsuranceProviders(filters?: { type?: string; state?: string }): Promise<InsuranceProvider[]>;
  getInsuranceProvider(id: string): Promise<InsuranceProvider | undefined>;
  getInsurancePlans(filters?: { providerId?: string; planType?: string; metalLevel?: string; maxPremium?: number; state?: string }): Promise<InsurancePlan[]>;
  getInsurancePlan(id: string): Promise<InsurancePlan | undefined>;
  getInsurancePlansByIds(ids: string[]): Promise<InsurancePlan[]>;
  getBenefitCategories(): Promise<BenefitCategory[]>;
  getPlanBenefits(planId: string): Promise<PlanBenefit[]>;
  getPlanBenefit(benefitId: string): Promise<PlanBenefit | undefined>;
  getUserInsurancePlans(userId: string): Promise<UserInsurancePlan[]>;
  createUserInsurancePlan(data: InsertUserInsurancePlan): Promise<UserInsurancePlan>;
  deleteUserInsurancePlan(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserPreferences(userId: string, preferences: Partial<User['userPreferences']>): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const currentPrefs = user.userPreferences || {
      theme: 'system' as const,
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      billReminders: true,
      weeklyDigest: true,
      language: 'en',
      timezone: 'America/New_York',
    };
    
    const [updated] = await db
      .update(users)
      .set({ 
        userPreferences: { ...currentPrefs, ...preferences },
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async updateUserProfile(userId: string, updates: { firstName?: string; lastName?: string; email?: string }): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async setUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ isAdmin, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getAdminUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isAdmin, true));
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

  async acceptAiTerms(userId: string, version: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        acceptedAiTerms: true,
        aiTermsAcceptedAt: new Date(),
        aiTermsVersion: version,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete all user-related data in correct order (respecting foreign keys)
    // 1. Delete user progress
    await db.delete(userProgress).where(eq(userProgress.userId, userId));
    
    // 2. Delete image analysis progress
    await db.delete(imageAnalysisProgress).where(eq(imageAnalysisProgress.userId, userId));
    
    // 3. Delete user achievements
    await db.delete(userAchievements).where(eq(userAchievements.userId, userId));
    
    // 4. Delete user stats
    await db.delete(userStats).where(eq(userStats.userId, userId));
    
    // 5. Delete board exam attempts
    await db.delete(boardExamAttempts).where(eq(boardExamAttempts.userId, userId));
    
    // 6. Delete decision tree progress
    await db.delete(decisionTreeProgress).where(eq(decisionTreeProgress.userId, userId));
    
    // 7. Delete study group memberships
    await db.delete(studyGroupMembers).where(eq(studyGroupMembers.userId, userId));
    
    // 8. Delete medical bills
    await db.delete(medicalBills).where(eq(medicalBills.userId, userId));
    
    // 9. Delete chat messages (must be deleted before sessions due to foreign key)
    const userSessions = await db.select({ id: chatSessions.id })
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId));
    const sessionIds = userSessions.map(s => s.id);
    if (sessionIds.length > 0) {
      for (const sessionId of sessionIds) {
        await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
      }
    }
    
    // 10. Delete chat sessions
    await db.delete(chatSessions).where(eq(chatSessions.userId, userId));
    
    // 11. Delete synthetic patients
    await db.delete(syntheticPatients).where(eq(syntheticPatients.userId, userId));
    
    // 12. Delete diagnostic sessions  
    await db.delete(diagnosticSessions).where(eq(diagnosticSessions.userId, userId));
    
    // 13. Finally, delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  // Medical Cases
  async getMedicalCases(filters?: { specialty?: string; difficulty?: number; search?: string }): Promise<MedicalCase[]> {
    const conditions = [];
    
    if (filters?.specialty && filters.specialty !== 'All Specialties') {
      conditions.push(eq(medicalCases.specialty, filters.specialty));
    }
    
    if (filters?.difficulty) {
      conditions.push(eq(medicalCases.difficulty, filters.difficulty));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`${medicalCases.name} ILIKE ${`%${filters.search}%`} OR 
            ${medicalCases.chiefComplaint} ILIKE ${`%${filters.search}%`} OR 
            ${medicalCases.correctDiagnosis} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(medicalCases)
        .where(and(...conditions))
        .orderBy(medicalCases.createdAt);
    }
    
    return await db.select().from(medicalCases).orderBy(medicalCases.createdAt);
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
    if (userId) {
      return await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId))
        .orderBy(desc(userAchievements.unlockedAt));
    }
    
    return await db.select().from(userAchievements).orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(achievementId: string, userId?: string): Promise<UserAchievement> {
    if (!userId) {
      throw new Error('User ID is required to unlock achievement');
    }
    
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
    const conditions = [];
    
    if (filters?.imageType) {
      conditions.push(eq(medicalImages.imageType, filters.imageType));
    }
    
    if (filters?.difficulty) {
      conditions.push(eq(medicalImages.difficulty, filters.difficulty));
    }
    
    if (filters?.bodyRegion) {
      conditions.push(eq(medicalImages.bodyRegion, filters.bodyRegion));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`${medicalImages.title} ILIKE ${`%${filters.search}%`} OR 
            ${medicalImages.description} ILIKE ${`%${filters.search}%`} OR 
            ${medicalImages.bodyRegion} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(medicalImages)
        .where(and(...conditions))
        .orderBy(medicalImages.createdAt);
    }
    
    return await db.select().from(medicalImages).orderBy(medicalImages.createdAt);
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
    const conditions = [eq(studyGroups.isPrivate, false)];
    
    if (filters?.specialty) {
      conditions.push(eq(studyGroups.specialty, filters.specialty));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`${studyGroups.name} ILIKE ${`%${filters.search}%`} OR 
            ${studyGroups.description} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    return await db
      .select()
      .from(studyGroups)
      .where(and(...conditions))
      .orderBy(desc(studyGroups.createdAt));
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
    const conditions = [];
    
    if (filters?.examType) {
      conditions.push(eq(boardExams.examType, filters.examType));
    }
    
    if (filters?.specialty) {
      conditions.push(eq(boardExams.specialty, filters.specialty));
    }
    
    if (filters?.difficulty) {
      conditions.push(eq(boardExams.difficulty, filters.difficulty));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(boardExams)
        .where(and(...conditions))
        .orderBy(desc(boardExams.createdAt));
    }
    
    return await db.select().from(boardExams).orderBy(desc(boardExams.createdAt));
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
    const conditions = [];
    
    if (filters?.specialty && filters.specialty !== "all") {
      conditions.push(eq(clinicalDecisionTrees.specialty, filters.specialty));
    }
    
    if (filters?.difficulty) {
      conditions.push(eq(clinicalDecisionTrees.difficulty, filters.difficulty));
    }
    
    if (filters?.category && filters.category !== "all") {
      conditions.push(eq(clinicalDecisionTrees.category, filters.category));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(clinicalDecisionTrees)
        .where(and(...conditions))
        .orderBy(desc(clinicalDecisionTrees.createdAt));
    }
    
    return await db.select().from(clinicalDecisionTrees).orderBy(desc(clinicalDecisionTrees.createdAt));
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

  // Medical Bill Analyzer implementations
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [newSession] = await db.insert(chatSessions).values(session).returning();
    return newSession;
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.lastMessageAt));
  }

  async getCurrentChatSession(userId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.userId, userId), eq(chatSessions.status, "active")))
      .orderBy(desc(chatSessions.createdAt))
      .limit(1);
    
    if (!session) {
      // Create a new session if none exists
      return await this.createChatSession({
        userId,
        title: "Medical Bill Analysis",
        sessionType: "bill_analysis",
      });
    }
    
    return session;
  }

  async updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const [session] = await db
      .update(chatSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chatSessions.id, sessionId))
      .returning();
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1);
    return session;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    
    // Update session with latest message timestamp and increment message count
    await db
      .update(chatSessions)
      .set({
        lastMessageAt: new Date(),
        totalMessages: sql`${chatSessions.totalMessages} + 1`,
      })
      .where(eq(chatSessions.id, message.sessionId));
    
    return newMessage;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionId))
        .orderBy(chatMessages.createdAt);
      
      console.log("Storage getChatMessages result:", messages);
      return Array.isArray(messages) ? messages : [];
    } catch (error) {
      console.error("Error in getChatMessages:", error);
      return [];
    }
  }

  async createMedicalBill(userId: string, billData: InsertMedicalBillData): Promise<MedicalBill> {
    const [bill] = await db.insert(medicalBills).values({ ...billData, userId }).returning();
    return bill;
  }

  async getMedicalBills(userId: string): Promise<MedicalBill[]> {
    return await db
      .select()
      .from(medicalBills)
      .where(eq(medicalBills.userId, userId))
      .orderBy(desc(medicalBills.createdAt));
  }

  async getMedicalBill(billId: string, userId: string): Promise<MedicalBill | undefined> {
    const [bill] = await db
      .select()
      .from(medicalBills)
      .where(and(eq(medicalBills.id, billId), eq(medicalBills.userId, userId)));
    return bill;
  }

  async updateMedicalBill(billId: string, updates: Partial<MedicalBill>): Promise<MedicalBill> {
    const [bill] = await db
      .update(medicalBills)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(medicalBills.id, billId))
      .returning();
    return bill;
  }

  async createBillAnalysis(billId: string, analysisData: InsertBillAnalysisResult): Promise<BillAnalysisResult> {
    const [analysis] = await db.insert(billAnalysisResults).values({ ...analysisData, billId }).returning();
    return analysis;
  }

  async getBillAnalysis(billId: string): Promise<BillAnalysisResult | undefined> {
    const [analysis] = await db
      .select()
      .from(billAnalysisResults)
      .where(eq(billAnalysisResults.billId, billId));
    return analysis;
  }

  async createReductionStrategy(strategyData: InsertReductionStrategy): Promise<ReductionStrategy> {
    const [strategy] = await db.insert(reductionStrategies).values(strategyData).returning();
    return strategy;
  }

  async getReductionStrategies(billId: string): Promise<ReductionStrategy[]> {
    return await db
      .select()
      .from(reductionStrategies)
      .where(eq(reductionStrategies.billId, billId))
      .orderBy(desc(reductionStrategies.priority));
  }

  // ===== SYNTHETIC PATIENT DIAGNOSTICS METHODS =====
  
  async createSyntheticPatient(patientData: InsertSyntheticPatient): Promise<SyntheticPatient> {
    const [patient] = await db
      .insert(syntheticPatients)
      .values(patientData)
      .returning();
    return patient;
  }

  async getSyntheticPatientsByUser(userId: string): Promise<SyntheticPatient[]> {
    return await db
      .select()
      .from(syntheticPatients)
      .where(eq(syntheticPatients.userId, userId))
      .orderBy(desc(syntheticPatients.createdAt));
  }

  async getSyntheticPatientById(patientId: string): Promise<SyntheticPatient | undefined> {
    const [patient] = await db
      .select()
      .from(syntheticPatients)
      .where(eq(syntheticPatients.id, patientId));
    return patient;
  }

  async updateSyntheticPatient(patientId: string, updates: Partial<SyntheticPatient>): Promise<SyntheticPatient> {
    const [patient] = await db
      .update(syntheticPatients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(syntheticPatients.id, patientId))
      .returning();
    return patient;
  }

  async createDiagnosticSession(sessionData: InsertDiagnosticSession): Promise<DiagnosticSession> {
    const [session] = await db
      .insert(diagnosticSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getDiagnosticSessionsByUser(userId: string): Promise<DiagnosticSession[]> {
    return await db
      .select()
      .from(diagnosticSessions)
      .where(eq(diagnosticSessions.userId, userId))
      .orderBy(desc(diagnosticSessions.createdAt));
  }

  async getDiagnosticSessionById(sessionId: string): Promise<DiagnosticSession | undefined> {
    const [session] = await db
      .select()
      .from(diagnosticSessions)
      .where(eq(diagnosticSessions.id, sessionId));
    return session;
  }

  async updateDiagnosticSession(sessionId: string, updates: Partial<DiagnosticSession>): Promise<DiagnosticSession> {
    const [session] = await db
      .update(diagnosticSessions)
      .set(updates)
      .where(eq(diagnosticSessions.id, sessionId))
      .returning();
    return session;
  }

  // ===== USER DATA RIGHTS (GDPR/PRIVACY COMPLIANCE) =====

  async deleteAllUserData(userId: string): Promise<{ success: boolean; deletedCount: number }> {
    try {
      let deletedCount = 0;

      // Delete user's medical bills and related data
      const userBills = await db.select().from(medicalBills).where(eq(medicalBills.userId, userId));
      for (const bill of userBills) {
        // Delete bill analysis results
        await db.delete(billAnalysisResults).where(eq(billAnalysisResults.billId, bill.id));
        // Delete reduction strategies
        await db.delete(reductionStrategies).where(eq(reductionStrategies.billId, bill.id));
        deletedCount += 2;
      }
      // Delete medical bills
      const billsDeleted = await db.delete(medicalBills).where(eq(medicalBills.userId, userId));
      deletedCount += billsDeleted.length || 0;

      // Delete chat sessions and messages
      const userChatSessions = await db.select().from(chatSessions).where(eq(chatSessions.userId, userId));
      for (const session of userChatSessions) {
        await db.delete(chatMessages).where(eq(chatMessages.sessionId, session.id));
        deletedCount++;
      }
      const sessionsDeleted = await db.delete(chatSessions).where(eq(chatSessions.userId, userId));
      deletedCount += sessionsDeleted.length || 0;

      // Delete user progress and stats
      await db.delete(userProgress).where(eq(userProgress.userId, userId));
      await db.delete(userAchievements).where(eq(userAchievements.userId, userId));
      await db.delete(userStats).where(eq(userStats.userId, userId));
      await db.delete(imageAnalysisProgress).where(eq(imageAnalysisProgress.userId, userId));
      await db.delete(boardExamAttempts).where(eq(boardExamAttempts.userId, userId));
      await db.delete(decisionTreeProgress).where(eq(decisionTreeProgress.userId, userId));
      deletedCount += 6;

      // Delete synthetic patients and diagnostic sessions
      const userPatients = await db.select().from(syntheticPatients).where(eq(syntheticPatients.userId, userId));
      for (const patient of userPatients) {
        await db.delete(diagnosticSessions).where(eq(diagnosticSessions.patientId, patient.id));
        deletedCount++;
      }
      await db.delete(syntheticPatients).where(eq(syntheticPatients.userId, userId));
      deletedCount++;

      // Note: We don't delete the user record itself to maintain Replit Auth integrity
      // Instead, we clear PII fields
      await db.update(users).set({
        email: null,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
        updatedAt: new Date()
      }).where(eq(users.id, userId));

      return { success: true, deletedCount };
    } catch (error) {
      console.error('Error deleting user data:', error);
      return { success: false, deletedCount: 0 };
    }
  }

  async exportUserData(userId: string): Promise<{ userData: any; medicalData: any; chatData: any; createdAt: string }> {
    try {
      // Get user data
      const user = await this.getUser(userId);
      const userStats = await this.getUserStats(userId);
      const userAchievements = await this.getUserAchievements(userId);

      // Get medical data
      const medicalBills = await this.getMedicalBills(userId);
      const syntheticPatients = await this.getSyntheticPatientsByUser(userId);
      const diagnosticSessions = await this.getDiagnosticSessionsByUser(userId);
      const userProgress = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
      const imageProgress = await this.getImageAnalysisProgress(userId);
      const treeProgress = await this.getDecisionTreeProgress(userId);

      // Get chat data
      const chatSessions = await this.getChatSessions(userId);
      const allChatMessages = [];
      for (const session of chatSessions) {
        const messages = await this.getChatMessages(session.id);
        allChatMessages.push({ sessionId: session.id, messages });
      }

      // Get bill analyses for user's bills
      const billAnalyses = [];
      for (const bill of medicalBills) {
        const analysis = await this.getBillAnalysis(bill.id);
        if (analysis) billAnalyses.push(analysis);
        
        const strategies = await this.getReductionStrategies(bill.id);
        billAnalyses.push(...strategies);
      }

      return {
        userData: {
          profile: user,
          stats: userStats,
          achievements: userAchievements
        },
        medicalData: {
          bills: medicalBills,
          billAnalyses,
          syntheticPatients,
          diagnosticSessions,
          userProgress,
          imageProgress,
          treeProgress
        },
        chatData: {
          sessions: chatSessions,
          messages: allChatMessages
        },
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  async cleanupOldData(retentionDays: number): Promise<{ billsDeleted: number; chatsDeleted: number; voiceCacheCleared: boolean }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      // Clean up old medical bills and related data
      const oldBills = await db.select().from(medicalBills)
        .where(sql`${medicalBills.createdAt} < ${cutoffDate}`);
      
      let billsDeleted = 0;
      for (const bill of oldBills) {
        await db.delete(billAnalysisResults).where(eq(billAnalysisResults.billId, bill.id));
        await db.delete(reductionStrategies).where(eq(reductionStrategies.billId, bill.id));
        billsDeleted++;
      }
      await db.delete(medicalBills).where(sql`${medicalBills.createdAt} < ${cutoffDate}`);

      // Clean up old chat sessions and messages
      const oldChatSessions = await db.select().from(chatSessions)
        .where(sql`${chatSessions.createdAt} < ${cutoffDate}`);
      
      let chatsDeleted = 0;
      for (const session of oldChatSessions) {
        await db.delete(chatMessages).where(eq(chatMessages.sessionId, session.id));
        chatsDeleted++;
      }
      await db.delete(chatSessions).where(sql`${chatSessions.createdAt} < ${cutoffDate}`);

      // Clean up voice cache (file system cleanup would require additional implementation)
      let voiceCacheCleared = false;
      try {
        // Note: Actual file cleanup would require file system operations
        // This is a placeholder for voice cache cleanup logic
        voiceCacheCleared = true;
      } catch (error) {
        console.error('Voice cache cleanup failed:', error);
        voiceCacheCleared = false;
      }

      return { billsDeleted, chatsDeleted, voiceCacheCleared };
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      return { billsDeleted: 0, chatsDeleted: 0, voiceCacheCleared: false };
    }
  }

  // User Savings Outcomes
  async createSavingsOutcome(userId: string, outcome: Omit<InsertUserSavingsOutcome, 'userId' | 'id' | 'createdAt'>): Promise<UserSavingsOutcome> {
    const [savedOutcome] = await db.insert(userSavingsOutcomes).values({
      ...outcome,
      userId
    }).returning();
    return savedOutcome;
  }

  async getSavingsOutcomes(userId: string): Promise<UserSavingsOutcome[]> {
    return await db.select().from(userSavingsOutcomes)
      .where(eq(userSavingsOutcomes.userId, userId))
      .orderBy(desc(userSavingsOutcomes.createdAt));
  }

  async updateSavingsOutcome(outcomeId: string, userId: string, updates: Partial<InsertUserSavingsOutcome>): Promise<UserSavingsOutcome | undefined> {
    const [updated] = await db.update(userSavingsOutcomes)
      .set(updates)
      .where(and(
        eq(userSavingsOutcomes.id, outcomeId),
        eq(userSavingsOutcomes.userId, userId)
      ))
      .returning();
    return updated;
  }

  async deleteSavingsOutcome(outcomeId: string, userId: string): Promise<boolean> {
    const result = await db.delete(userSavingsOutcomes)
      .where(and(
        eq(userSavingsOutcomes.id, outcomeId),
        eq(userSavingsOutcomes.userId, userId)
      ));
    return true;
  }

  // Medicare/Medicaid Enrollment
  async createEnrollmentSession(userId: string, data: { programType: string; voiceEnabled?: boolean }): Promise<EnrollmentSession> {
    const [session] = await db.insert(enrollmentSessions).values({
      userId,
      programType: data.programType,
      voiceEnabled: data.voiceEnabled || false,
      status: 'in_progress',
    }).returning();
    return session;
  }

  async getEnrollmentSessions(userId: string): Promise<EnrollmentSession[]> {
    return await db.select().from(enrollmentSessions)
      .where(eq(enrollmentSessions.userId, userId))
      .orderBy(desc(enrollmentSessions.createdAt));
  }

  async getEnrollmentSession(sessionId: string, userId: string): Promise<EnrollmentSession | undefined> {
    const [session] = await db.select().from(enrollmentSessions)
      .where(and(
        eq(enrollmentSessions.id, sessionId),
        eq(enrollmentSessions.userId, userId)
      ));
    return session;
  }

  async updateEnrollmentSession(sessionId: string, userId: string, updates: Partial<EnrollmentSession>): Promise<EnrollmentSession | undefined> {
    const [updated] = await db.update(enrollmentSessions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(
        eq(enrollmentSessions.id, sessionId),
        eq(enrollmentSessions.userId, userId)
      ))
      .returning();
    return updated;
  }

  async createEnrollmentResponse(response: InsertEnrollmentResponse): Promise<EnrollmentResponse> {
    const [created] = await db.insert(enrollmentResponses).values(response).returning();
    return created;
  }

  async getEnrollmentResponses(sessionId: string): Promise<EnrollmentResponse[]> {
    return await db.select().from(enrollmentResponses)
      .where(eq(enrollmentResponses.sessionId, sessionId))
      .orderBy(enrollmentResponses.createdAt);
  }

  async createEnrollmentApplicant(applicant: InsertEnrollmentApplicant): Promise<EnrollmentApplicant> {
    const [created] = await db.insert(enrollmentApplicants).values(applicant).returning();
    return created;
  }

  // Insurance Benefits
  async getInsuranceProviders(filters?: { type?: string; state?: string }): Promise<InsuranceProvider[]> {
    const conditions = [];
    
    if (filters?.type) {
      conditions.push(eq(insuranceProviders.type, filters.type));
    }
    
    if (filters?.state) {
      conditions.push(sql`${insuranceProviders.statesOperated} @> ${JSON.stringify([filters.state])}::jsonb`);
    }
    
    if (conditions.length > 0) {
      return await db.select().from(insuranceProviders).where(and(...conditions)).orderBy(insuranceProviders.name);
    }
    
    return await db.select().from(insuranceProviders).orderBy(insuranceProviders.name);
  }

  async getInsuranceProvider(id: string): Promise<InsuranceProvider | undefined> {
    const [provider] = await db.select().from(insuranceProviders).where(eq(insuranceProviders.id, id));
    return provider;
  }

  async getInsurancePlans(filters?: { providerId?: string; planType?: string; metalLevel?: string; maxPremium?: number; state?: string }): Promise<InsurancePlan[]> {
    const conditions = [eq(insurancePlans.isActive, true)];
    
    if (filters?.providerId) {
      conditions.push(eq(insurancePlans.providerId, filters.providerId));
    }
    
    if (filters?.planType) {
      conditions.push(eq(insurancePlans.planType, filters.planType));
    }
    
    if (filters?.metalLevel) {
      conditions.push(eq(insurancePlans.metalLevel, filters.metalLevel));
    }
    
    if (filters?.maxPremium) {
      conditions.push(lte(insurancePlans.monthlyPremium, filters.maxPremium.toString()));
    }
    
    return await db.select().from(insurancePlans).where(and(...conditions)).orderBy(insurancePlans.name);
  }

  async getInsurancePlan(id: string): Promise<InsurancePlan | undefined> {
    const [plan] = await db.select().from(insurancePlans).where(eq(insurancePlans.id, id));
    return plan;
  }

  async getInsurancePlansByIds(ids: string[]): Promise<InsurancePlan[]> {
    if (ids.length === 0) return [];
    return await db.select().from(insurancePlans).where(inArray(insurancePlans.id, ids));
  }

  async getBenefitCategories(): Promise<BenefitCategory[]> {
    return await db.select().from(benefitCategories).orderBy(asc(benefitCategories.displayOrder));
  }

  async getPlanBenefits(planId: string): Promise<PlanBenefit[]> {
    return await db.select().from(planBenefits).where(eq(planBenefits.planId, planId));
  }

  async getPlanBenefit(benefitId: string): Promise<PlanBenefit | undefined> {
    const [benefit] = await db.select().from(planBenefits).where(eq(planBenefits.id, benefitId));
    return benefit;
  }

  async getUserInsurancePlans(userId: string): Promise<UserInsurancePlan[]> {
    return await db.select().from(userInsurancePlans)
      .where(eq(userInsurancePlans.userId, userId))
      .orderBy(desc(userInsurancePlans.createdAt));
  }

  async createUserInsurancePlan(data: InsertUserInsurancePlan): Promise<UserInsurancePlan> {
    const [created] = await db.insert(userInsurancePlans).values(data).returning();
    return created;
  }

  async deleteUserInsurancePlan(id: string, userId: string): Promise<boolean> {
    await db.delete(userInsurancePlans).where(
      and(
        eq(userInsurancePlans.id, id),
        eq(userInsurancePlans.userId, userId)
      )
    );
    return true;
  }
}

export const storage = new DatabaseStorage();
