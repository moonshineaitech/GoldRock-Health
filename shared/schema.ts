import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  timestamp, 
  jsonb, 
  decimal,
  boolean,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("inactive"), // inactive, active, canceled, past_due
  subscriptionPlan: varchar("subscription_plan"), // monthly, annual
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Medical Cases Table
export const medicalCases = pgTable("medical_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  specialty: varchar("specialty", { length: 50 }).notNull(),
  difficulty: integer("difficulty").notNull(), // 1-3 (Foundation, Clinical, Expert)
  chiefComplaint: text("chief_complaint").notNull(),
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  medicalHistory: jsonb("medical_history").$type<Record<string, any>>().default({}),
  physicalExam: jsonb("physical_exam").$type<{
    vitals: {
      bloodPressure: string;
      heartRate: string;
      respiratoryRate: string;
      temperature: string;
      oxygenSaturation?: string;
    };
    general: {
      appearance: string;
      distress: string;
      mobility: string;
    };
    cardiovascular: {
      heartSounds: string;
      murmurs: string;
      pulses: string;
      edema: string;
      jugularVeinDistension: string;
    };
    pulmonary: {
      inspection: string;
      palpation: string;
      percussion: string;
      auscultation: string;
    };
    abdominal: {
      inspection: string;
      palpation: string;
      percussion: string;
      auscultation: string;
      organomegaly: string;
    };
    neurological: {
      mentalStatus: string;
      cranialNerves: string;
      motor: string;
      sensory: string;
      reflexes: string;
      coordination: string;
    };
    musculoskeletal: {
      inspection: string;
      palpation: string;
      rangeOfMotion: string;
      strength: string;
    };
    skin: {
      color: string;
      texture: string;
      lesions: string;
      rashes: string;
    };
    heent: {
      head: string;
      eyes: string;
      ears: string;
      nose: string;
      throat: string;
    };
  }>(),
  diagnosticTests: jsonb("diagnostic_tests").$type<{
    available: {
      laboratory: {
        name: string;
        category: string;
        indication: string;
        normalRange: string;
        result: string;
        abnormal: boolean;
        interpretation: string;
      }[];
      imaging: {
        name: string;
        type: string;
        indication: string;
        findings: string;
        impression: string;
        abnormal: boolean;
      }[];
      procedures: {
        name: string;
        type: string;
        indication: string;
        findings: string;
        complications: string;
        abnormal: boolean;
      }[];
    };
    ordered: string[];
    completed: string[];
  }>(),
  labResults: jsonb("lab_results").$type<Record<string, any>>().default({}),
  responses: jsonb("responses").$type<Record<string, string>>().default({}),
  correctDiagnosis: text("correct_diagnosis").notNull(),
  correctTreatment: text("correct_treatment"),
  learningObjectives: jsonb("learning_objectives").$type<string[]>().default([]),
  estimatedDuration: integer("estimated_duration").notNull(), // minutes
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Progress Table
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  caseId: varchar("case_id").notNull().references(() => medicalCases.id),
  questionsAsked: integer("questions_asked").default(0),
  timeElapsed: integer("time_elapsed").default(0), // seconds
  diagnosis: text("diagnosis"),
  confidence: integer("confidence"), // 1-5
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Achievements Table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  criteria: jsonb("criteria").$type<Record<string, any>>().default({}),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievements Table
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Platform Statistics Table
export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalCases: integer("total_cases").default(0),
  activeStudents: integer("active_students").default(0),
  totalHours: integer("total_hours").default(0),
  avgAccuracy: decimal("avg_accuracy", { precision: 5, scale: 2 }).default("0.00"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(userAchievements),
}));

export const medicalCasesRelations = relations(medicalCases, ({ many }) => ({
  progress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  case: one(medicalCases, {
    fields: [userProgress.caseId],
    references: [medicalCases.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// Insert Schemas
export const insertMedicalCaseSchema = createInsertSchema(medicalCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
// Physical Exam Types
export interface PhysicalExamFindings {
  vitals: {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    temperature: string;
    oxygenSaturation?: string;
  };
  general: {
    appearance: string;
    distress: string;
    mobility: string;
  };
  cardiovascular: {
    heartSounds: string;
    murmurs: string;
    pulses: string;
    edema: string;
    jugularVeinDistension: string;
  };
  pulmonary: {
    inspection: string;
    palpation: string;
    percussion: string;
    auscultation: string;
  };
  abdominal: {
    inspection: string;
    palpation: string;
    percussion: string;
    auscultation: string;
    organomegaly: string;
  };
  neurological: {
    mentalStatus: string;
    cranialNerves: string;
    motor: string;
    sensory: string;
    reflexes: string;
    coordination: string;
  };
  musculoskeletal: {
    inspection: string;
    palpation: string;
    rangeOfMotion: string;
    strength: string;
  };
  skin: {
    color: string;
    texture: string;
    lesions: string;
    rashes: string;
  };
  heent: {
    head: string;
    eyes: string;
    ears: string;
    nose: string;
    throat: string;
  };
}

// Diagnostic Test Types
export interface DiagnosticTest {
  laboratory: {
    name: string;
    category: string;
    indication: string;
    normalRange: string;
    result: string;
    abnormal: boolean;
    interpretation: string;
  }[];
  imaging: {
    name: string;
    type: string;
    indication: string;
    findings: string;
    impression: string;
    abnormal: boolean;
  }[];
  procedures: {
    name: string;
    type: string;
    indication: string;
    findings: string;
    complications: string;
    abnormal: boolean;
  }[];
}

export type MedicalCase = typeof medicalCases.$inferSelect;
export type InsertMedicalCase = z.infer<typeof insertMedicalCaseSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type PlatformStats = typeof platformStats.$inferSelect;
