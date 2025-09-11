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

// User Statistics Table for Achievement Tracking
export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalCasesCompleted: integer("total_cases_completed").default(0),
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0), // consecutive days
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  averageAccuracy: decimal("average_accuracy", { precision: 5, scale: 2 }).default("0.00"),
  averageSpeed: integer("average_speed").default(0), // average seconds per case
  specialtyStats: jsonb("specialty_stats").$type<Record<string, {
    casesCompleted: number;
    averageAccuracy: number;
    averageSpeed: number;
    lastCompletedAt: string;
  }>>().default({}),
  achievements: jsonb("achievements").$type<{
    total: number;
    byRarity: Record<string, number>;
    byCategory: Record<string, number>;
  }>().default({ total: 0, byRarity: {}, byCategory: {} }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

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
  category: varchar("category", { length: 50 }).notNull(), // Getting Started, Specialization, Performance, Consistency, etc.
  specialty: varchar("specialty", { length: 50 }), // Cardiology, Neurology, etc.
  rarity: varchar("rarity", { length: 20 }).default("Common"), // Common, Uncommon, Rare, Epic, Legendary
  criteria: jsonb("criteria").$type<{
    type: "casesCompleted" | "accuracy" | "specialty" | "streak" | "speed" | "milestone";
    target: number;
    specialty?: string;
    accuracyThreshold?: number;
    timeThreshold?: number; // seconds
    consecutiveDays?: number;
  }>(),
  points: integer("points").default(0),
  isHidden: boolean("is_hidden").default(false), // Hidden until prerequisites met
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]), // Achievement IDs required first
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievements Table
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  progress: integer("progress").default(0), // Current progress towards achievement
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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

// Medical Images Table for Radiology Training
export const medicalImages = pgTable("medical_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").references(() => medicalCases.id),
  imageType: varchar("image_type", { length: 20 }).notNull(), // xray, ct, mri, ultrasound
  bodyRegion: varchar("body_region", { length: 50 }).notNull(), // chest, abdomen, head, etc.
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  title: text("title").notNull(),
  description: text("description"),
  modality: varchar("modality", { length: 20 }).notNull(), // CT, MRI, X-ray, etc.
  difficulty: integer("difficulty").notNull(), // 1-3
  keyFindings: jsonb("key_findings").$type<{
    finding: string;
    x: number;
    y: number;
    width: number;
    height: number;
    explanation: string;
    severity: "normal" | "mild" | "moderate" | "severe";
  }[]>().default([]),
  distractors: jsonb("distractors").$type<{
    finding: string;
    x: number;
    y: number;
    width: number;
    height: number;
    explanation: string;
  }[]>().default([]),
  correctDiagnosis: text("correct_diagnosis").notNull(),
  learningObjectives: jsonb("learning_objectives").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Image Analysis Progress Table
export const imageAnalysisProgress = pgTable("image_analysis_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  imageId: varchar("image_id").notNull().references(() => medicalImages.id),
  timeElapsed: integer("time_elapsed").default(0), // seconds
  findingsIdentified: jsonb("findings_identified").$type<{
    x: number;
    y: number;
    width: number;
    height: number;
    userDescription: string;
    confidence: number; // 1-5
  }[]>().default([]),
  diagnosis: text("diagnosis"),
  confidence: integer("confidence"), // 1-5
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  feedback: text("feedback"),
  hintsUsed: integer("hints_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Study Groups Table
export const studyGroups = pgTable("study_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  institutionName: varchar("institution_name"),
  maxMembers: integer("max_members").default(20),
  currentMembers: integer("current_members").default(1),
  isPrivate: boolean("is_private").default(false),
  inviteCode: varchar("invite_code", { length: 10 }),
  specialty: varchar("specialty", { length: 50 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  settings: jsonb("settings").$type<{
    allowCaseSharing: boolean;
    allowVideoChat: boolean;
    competitiveMode: boolean;
    weeklyChallenges: boolean;
  }>().default({
    allowCaseSharing: true,
    allowVideoChat: false,
    competitiveMode: false,
    weeklyChallenges: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Study Group Members Table
export const studyGroupMembers = pgTable("study_group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull().references(() => studyGroups.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 20 }).default("member"), // admin, moderator, member
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

// Group Challenges Table
export const groupChallenges = pgTable("group_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull().references(() => studyGroups.id),
  title: text("title").notNull(),
  description: text("description"),
  challengeType: varchar("challenge_type", { length: 30 }).notNull(), // case_competition, speed_diagnosis, accuracy_challenge
  caseIds: jsonb("case_ids").$type<string[]>().default([]),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxParticipants: integer("max_participants"),
  prizes: jsonb("prizes").$type<{
    place: number;
    title: string;
    points: number;
    badge?: string;
  }[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentorship Program Table
export const mentorships = pgTable("mentorships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id").notNull().references(() => users.id),
  menteeId: varchar("mentee_id").notNull().references(() => users.id),
  specialty: varchar("specialty", { length: 50 }),
  status: varchar("status", { length: 20 }).default("active"), // active, paused, completed
  mentorProfile: jsonb("mentor_profile").$type<{
    yearsExperience: number;
    currentPosition: string;
    institution: string;
    specializations: string[];
    bio: string;
    hourlyRate?: number;
    availability: string[];
  }>(),
  sessionFrequency: varchar("session_frequency", { length: 20 }), // weekly, biweekly, monthly
  totalSessions: integer("total_sessions").default(0),
  lastSessionAt: timestamp("last_session_at"),
  notes: text("notes"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

// Mentorship Sessions Table
export const mentorshipSessions = pgTable("mentorship_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorshipId: varchar("mentorship_id").notNull().references(() => mentorships.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  sessionType: varchar("session_type", { length: 30 }).default("case_review"), // case_review, career_guidance, skill_building
  caseIds: jsonb("case_ids").$type<string[]>().default([]),
  meetingLink: text("meeting_link"),
  status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, completed, cancelled, no_show
  mentorNotes: text("mentor_notes"),
  menteeNotes: text("mentee_notes"),
  rating: integer("rating"), // 1-5, filled by mentee
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Board Exam Preparation Table
export const boardExams = pgTable("board_exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examType: varchar("exam_type", { length: 30 }).notNull(), // usmle_step1, usmle_step2, usmle_step3, specialty_boards
  specialty: varchar("specialty", { length: 50 }), // internal_medicine, surgery, etc.
  title: text("title").notNull(),
  description: text("description"),
  totalQuestions: integer("total_questions").notNull(),
  timeLimit: integer("time_limit").notNull(), // minutes
  passingScore: integer("passing_score").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-3
  questionIds: jsonb("question_ids").$type<string[]>().default([]),
  topics: jsonb("topics").$type<string[]>().default([]),
  isOfficial: boolean("is_official").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Board Exam Questions Table
export const boardExamQuestions = pgTable("board_exam_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").references(() => boardExams.id),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 20 }).default("multiple_choice"), // multiple_choice, case_based, image_based
  imageUrl: text("image_url"),
  options: jsonb("options").$type<{
    letter: string;
    text: string;
    isCorrect: boolean;
  }[]>().default([]),
  correctAnswer: varchar("correct_answer", { length: 5 }).notNull(),
  explanation: text("explanation").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-3
  topic: varchar("topic", { length: 100 }).notNull(),
  subtopic: varchar("subtopic", { length: 100 }),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  references: jsonb("references").$type<string[]>().default([]),
  timeToAnswer: integer("time_to_answer").default(90), // seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Board Exam Attempts Table
export const boardExamAttempts = pgTable("board_exam_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  examId: varchar("exam_id").notNull().references(() => boardExams.id),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  timeElapsed: integer("time_elapsed").default(0), // seconds
  questionsAnswered: integer("questions_answered").default(0),
  correctAnswers: integer("correct_answers").default(0),
  score: integer("score").default(0),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).default("0.00"),
  passed: boolean("passed").default(false),
  answers: jsonb("answers").$type<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[]>().default([]),
  weakAreas: jsonb("weak_areas").$type<string[]>().default([]),
  status: varchar("status", { length: 20 }).default("in_progress"), // in_progress, completed, abandoned
});

// Lab Values & Diagnostics Table
export const labValues = pgTable("lab_values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").references(() => medicalCases.id),
  testName: text("test_name").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // chemistry, hematology, microbiology, etc.
  normalRange: text("normal_range").notNull(),
  units: varchar("units", { length: 20 }),
  patientValue: text("patient_value").notNull(),
  isAbnormal: boolean("is_abnormal").notNull(),
  criticalValue: boolean("critical_value").default(false),
  trendingData: jsonb("trending_data").$type<{
    date: string;
    value: string;
    normal: boolean;
  }[]>().default([]),
  clinicalSignificance: text("clinical_significance"),
  interpretation: text("interpretation").notNull(),
  followUpRecommendations: jsonb("follow_up_recommendations").$type<string[]>().default([]),
  costInfo: jsonb("cost_info").$type<{
    cost: number;
    frequency: string;
    alternatives: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clinical Decision Trees/Algorithms Table
export const clinicalAlgorithms = pgTable("clinical_algorithms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  specialty: varchar("specialty", { length: 50 }).notNull(),
  condition: text("condition").notNull(),
  description: text("description"),
  algorithmSteps: jsonb("algorithm_steps").$type<{
    id: string;
    step: string;
    condition: string;
    action: string;
    nextSteps: string[];
    isDecisionPoint: boolean;
    evidenceLevel: "A" | "B" | "C" | "D";
    references: string[];
  }[]>().default([]),
  flowchartData: jsonb("flowchart_data").$type<{
    nodes: Array<{
      id: string;
      type: "start" | "decision" | "action" | "end";
      position: { x: number; y: number };
      data: { label: string; condition?: string };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      label?: string;
    }>;
  }>(),
  difficulty: integer("difficulty").notNull(), // 1-3
  estimatedTime: integer("estimated_time").default(15), // minutes
  tags: jsonb("tags").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinical Decision Trees Table (Interactive Branching Algorithms)
export const clinicalDecisionTrees = pgTable("clinical_decision_trees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  specialty: varchar("specialty", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // diagnosis, treatment, triage, etc.
  difficulty: integer("difficulty").notNull(), // 1-3
  estimatedTime: integer("estimated_time").default(10), // minutes
  rootNodeId: varchar("root_node_id").notNull(),
  optimalPathLength: integer("optimal_path_length"),
  nodes: jsonb("nodes").$type<Array<{
    id: string;
    type: "decision" | "outcome";
    title: string;
    content: string;
    additionalInfo?: string;
    options?: Array<{
      text: string;
      nextNodeId: string;
    }>;
    explanation?: string;
    isOptimal?: boolean;
  }>>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  learningObjectives: jsonb("learning_objectives").$type<string[]>().default([]),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Synthetic Patient Profiles Table - AI-generated anonymous patient profiles
export const syntheticPatients = pgTable("synthetic_patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  generationType: varchar("generation_type", { length: 20 }).notNull(), // "ai_generated" | "custom_created"
  profileName: text("profile_name").notNull(),
  
  // Demographics
  age: integer("age").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  ethnicity: varchar("ethnicity", { length: 50 }),
  occupation: text("occupation"),
  maritalStatus: varchar("marital_status", { length: 20 }),
  
  // Chief Complaint & Presentation
  chiefComplaint: text("chief_complaint").notNull(),
  presentingSymptoms: jsonb("presenting_symptoms").$type<{
    symptom: string;
    severity: number; // 1-10 scale
    duration: string;
    onset: string; // acute, gradual, sudden
    quality: string;
    location?: string;
    aggravatingFactors: string[];
    relievingFactors: string[];
  }[]>().default([]),
  
  // Comprehensive Medical History
  medicalHistory: jsonb("medical_history").$type<{
    pastMedicalHistory: string[];
    surgicalHistory: {
      procedure: string;
      date: string;
      complications?: string;
    }[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
      indication: string;
      adherence: "excellent" | "good" | "fair" | "poor";
    }[];
    allergies: {
      allergen: string;
      reaction: string;
      severity: "mild" | "moderate" | "severe";
    }[];
    familyHistory: {
      condition: string;
      relationship: string;
      ageOfOnset?: number;
    }[];
    socialHistory: {
      smoking: { status: string; packsPerDay?: number; yearsSmoked?: number };
      alcohol: { status: string; drinksPerWeek?: number };
      drugs: { status: string; substances?: string[] };
      exercise: string;
      diet: string;
      occupation: string;
      travelHistory: string[];
    };
    reviewOfSystems: Record<string, {
      system: string;
      symptoms: string[];
      negative: string[];
    }>;
  }>(),
  
  // Physical Examination
  physicalExam: jsonb("physical_exam").$type<{
    vitals: {
      bloodPressure: string;
      heartRate: string;
      respiratoryRate: string;
      temperature: string;
      oxygenSaturation?: string;
      height: string;
      weight: string;
      bmi: string;
    };
    general: {
      appearance: string;
      distress: string;
      mobility: string;
      mood: string;
      speech: string;
    };
    systems: {
      cardiovascular: Record<string, string>;
      pulmonary: Record<string, string>;
      abdominal: Record<string, string>;
      neurological: Record<string, string>;
      musculoskeletal: Record<string, string>;
      skin: Record<string, string>;
      heent: Record<string, string>;
      psychiatric: Record<string, string>;
    };
  }>(),
  
  // AI-Generated Complexity Data
  riskFactors: jsonb("risk_factors").$type<{
    factor: string;
    severity: "low" | "moderate" | "high";
    impact: string;
  }[]>().default([]),
  
  comorbidities: jsonb("comorbidities").$type<{
    condition: string;
    severity: "mild" | "moderate" | "severe";
    controlled: boolean;
    medications: string[];
  }[]>().default([]),
  
  // Metadata
  complexity: integer("complexity").default(1), // 1-5 scale
  specialty: varchar("specialty", { length: 50 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  isAnonymized: boolean("is_anonymized").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Diagnostic Sessions Table - AI analysis sessions for synthetic patients
export const diagnosticSessions = pgTable("diagnostic_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  patientId: varchar("patient_id").notNull().references(() => syntheticPatients.id),
  sessionName: text("session_name").notNull(),
  
  // Session Configuration
  analysisType: varchar("analysis_type", { length: 30 }).notNull(), // differential_diagnosis, treatment_planning, risk_assessment, prognosis
  focusAreas: jsonb("focus_areas").$type<string[]>().default([]), // cardiology, neurology, emergency_medicine, etc.
  
  // AI Analysis Results
  diagnosticAnalysis: jsonb("diagnostic_analysis").$type<{
    differentialDiagnoses: {
      diagnosis: string;
      probability: number; // 0-100%
      supportingEvidence: string[];
      contraEvidence: string[];
      requiredTests: string[];
      urgency: "low" | "moderate" | "high" | "critical";
    }[];
    recommendedTests: {
      testName: string;
      category: "laboratory" | "imaging" | "procedure" | "consultation";
      priority: "stat" | "urgent" | "routine";
      rationale: string;
      expectedFindings: string;
      cost: string;
    }[];
    riskAssessment: {
      overallRisk: "low" | "moderate" | "high" | "critical";
      specificRisks: {
        risk: string;
        probability: number;
        mitigation: string;
      }[];
      redFlags: string[];
    };
    treatmentRecommendations: {
      intervention: string;
      type: "immediate" | "short_term" | "long_term";
      evidenceLevel: "A" | "B" | "C" | "D";
      contraindications: string[];
      monitoringRequired: string[];
    }[];
    prognosis: {
      shortTerm: string; // days to weeks
      mediumTerm: string; // weeks to months  
      longTerm: string; // months to years
      factorsAffectingOutcome: string[];
    };
  }>(),
  
  // Educational Insights
  learningPoints: jsonb("learning_points").$type<{
    keyInsights: string[];
    clinicalPearls: string[];
    commonMistakes: string[];
    literatureReferences: string[];
  }>(),
  
  // Session Metrics
  timeElapsed: integer("time_elapsed").default(0), // seconds
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  completed: boolean("completed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Medical Bills Table - Core bill information uploaded by users
export const medicalBills = pgTable("medical_bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(), // User-friendly name for the bill
  providerName: text("provider_name"), // Hospital/clinic name
  providerAddress: text("provider_address"),
  serviceDate: timestamp("service_date"),
  billDate: timestamp("bill_date"),
  dueDate: timestamp("due_date"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  insurancePaid: decimal("insurance_paid", { precision: 10, scale: 2 }).default("0.00"),
  patientResponsibility: decimal("patient_responsibility", { precision: 10, scale: 2 }).notNull(),
  originalText: text("original_text"), // Raw OCR text from uploaded bill
  extractedData: jsonb("extracted_data").$type<{
    patientInfo: {
      name: string;
      dateOfBirth?: string;
      policyNumber?: string;
      memberId?: string;
    };
    insuranceInfo: {
      company: string;
      groupNumber?: string;
      planType?: string;
    };
    diagnosticCodes: Array<{
      code: string;
      description: string;
      type: "ICD-10" | "ICD-9" | "CPT" | "HCPCS";
    }>;
    lineItems: Array<{
      description: string;
      code?: string;
      quantity: number;
      unitPrice: number;
      total: number;
      dateOfService?: string;
    }>;
  }>(),
  status: varchar("status", { length: 20 }).default("uploaded"), // uploaded, analyzing, analyzed, disputed, resolved
  analysisStatus: varchar("analysis_status", { length: 20 }).default("pending"), // pending, in_progress, completed, failed
  fileUrl: text("file_url"), // URL to uploaded bill image/PDF
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bill Analysis Results - AI analysis findings
export const billAnalysisResults = pgTable("bill_analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billId: varchar("bill_id").notNull().references(() => medicalBills.id),
  overallScore: integer("overall_score").notNull(), // 1-100 billing accuracy score
  potentialSavings: decimal("potential_savings", { precision: 10, scale: 2 }).default("0.00"),
  confidenceLevel: integer("confidence_level").notNull(), // 1-100 AI confidence
  analysisDetails: jsonb("analysis_details").$type<{
    codeAccuracy: {
      score: number;
      issues: Array<{
        code: string;
        issue: string;
        severity: "low" | "medium" | "high";
        potentialSaving: number;
      }>;
    };
    pricingAnalysis: {
      marketComparison: {
        percentile: number;
        averagePrice: number;
        yourPrice: number;
      };
      overcharges: Array<{
        item: string;
        chargedAmount: number;
        fairPrice: number;
        overchargeAmount: number;
        explanation: string;
      }>;
    };
    insuranceCoverage: {
      properlyProcessed: boolean;
      issues: Array<{
        description: string;
        recommendedAction: string;
        potentialRecovery: number;
      }>;
    };
    duplicateCharges: Array<{
      description: string;
      amount: number;
      dates: string[];
    }>;
    unbundlingIssues: Array<{
      description: string;
      codes: string[];
      overchargeAmount: number;
    }>;
  }>(),
  redFlags: jsonb("red_flags").$type<Array<{
    type: "pricing" | "coding" | "duplicate" | "unbundling" | "insurance" | "timing";
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    evidence: string;
    recommendedAction: string;
    potentialSaving: number;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reduction Strategies - Specific tactics to reduce bills
export const reductionStrategies = pgTable("reduction_strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billId: varchar("bill_id").notNull().references(() => medicalBills.id),
  analysisId: varchar("analysis_id").notNull().references(() => billAnalysisResults.id),
  strategyType: varchar("strategy_type", { length: 30 }).notNull(), // dispute_charge, negotiate_payment, insurance_appeal, charity_care, coding_error, price_transparency
  priority: integer("priority").notNull(), // 1-10 (10 being highest priority)
  potentialSaving: decimal("potential_saving", { precision: 10, scale: 2 }).notNull(),
  successProbability: integer("success_probability").notNull(), // 1-100%
  difficultyLevel: varchar("difficulty_level", { length: 20 }).default("medium"), // easy, medium, hard
  estimatedTimeRequired: integer("estimated_time_required").default(30), // minutes
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionSteps: jsonb("action_steps").$type<Array<{
    stepNumber: number;
    action: string;
    details: string;
    expectedOutcome: string;
    timeframe: string;
  }>>().default([]),
  requiredDocuments: jsonb("required_documents").$type<string[]>().default([]),
  contactInfo: jsonb("contact_info").$type<{
    department: string;
    phone?: string;
    email?: string;
    address?: string;
    bestTimeToCall?: string;
    referenceNumbers?: string[];
  }>(),
  scriptTemplates: jsonb("script_templates").$type<{
    phoneScript: string;
    emailTemplate: string;
    letterTemplate: string;
  }>(),
  legalBasis: text("legal_basis"), // Legal reasoning for the dispute
  status: varchar("status", { length: 20 }).default("recommended"), // recommended, in_progress, completed, failed
  implementedAt: timestamp("implemented_at"),
  resultAmount: decimal("result_amount", { precision: 10, scale: 2 }), // Actual amount saved
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated Documents - Letters and forms created for users
export const generatedDocuments = pgTable("generated_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billId: varchar("bill_id").notNull().references(() => medicalBills.id),
  strategyId: varchar("strategy_id").references(() => reductionStrategies.id),
  documentType: varchar("document_type", { length: 30 }).notNull(), // appeal_letter, dispute_letter, payment_plan_request, charity_care_application, insurance_complaint, state_complaint
  recipientType: varchar("recipient_type", { length: 20 }).notNull(), // provider, insurance, state_agency, attorney_general
  title: text("title").notNull(),
  content: text("content").notNull(), // Generated document content
  formattedContent: text("formatted_content"), // HTML formatted version
  recipientInfo: jsonb("recipient_info").$type<{
    name: string;
    title?: string;
    department?: string;
    address: string;
    phone?: string;
    email?: string;
    faxNumber?: string;
  }>(),
  documentMetadata: jsonb("document_metadata").$type<{
    letterhead: boolean;
    signature: boolean;
    attachments: string[];
    deliveryMethod: "mail" | "email" | "fax" | "portal";
    urgency: "normal" | "urgent";
    followUpRequired: boolean;
    followUpDate?: string;
  }>(),
  legalReferences: jsonb("legal_references").$type<Array<{
    law: string;
    section: string;
    description: string;
    relevance: string;
  }>>().default([]),
  status: varchar("status", { length: 20 }).default("draft"), // draft, finalized, sent, delivered, responded
  generatedAt: timestamp("generated_at").defaultNow(),
  sentAt: timestamp("sent_at"),
  responseReceived: timestamp("response_received"),
  outcome: text("outcome"),
});

// Medical Codes Database - CPT, ICD-10, HCPCS codes with pricing data
export const medicalCodes = pgTable("medical_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull(),
  codeType: varchar("code_type", { length: 10 }).notNull(), // CPT, ICD-10, HCPCS, DRG
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }),
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }),
  priceRange: jsonb("price_range").$type<{
    low: number;
    high: number;
    median: number;
    source: string;
    lastUpdated: string;
  }>(),
  regionalPricing: jsonb("regional_pricing").$type<Record<string, {
    averagePrice: number;
    sampleSize: number;
    lastUpdated: string;
  }>>().default({}),
  bundlingRules: jsonb("bundling_rules").$type<{
    cannotBeBilledWith: string[];
    mustBeBilledWith: string[];
    modifiers: Array<{
      code: string;
      description: string;
      priceAdjustment: number;
    }>;
  }>(),
  commonIssues: jsonb("common_issues").$type<Array<{
    issue: string;
    description: string;
    solution: string;
  }>>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat Sessions - Conversation history with the AI assistant
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  billId: varchar("bill_id").references(() => medicalBills.id), // Optional - if chat is about specific bill
  title: text("title"), // User-defined or auto-generated session name
  sessionType: varchar("session_type", { length: 20 }).default("general"), // general, bill_analysis, strategy_discussion, document_review
  status: varchar("status", { length: 20 }).default("active"), // active, archived, deleted
  totalMessages: integer("total_messages").default(0),
  estimatedSavings: decimal("estimated_savings", { precision: 10, scale: 2 }).default("0.00"), // Running total of potential savings discussed
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat Messages - Individual messages in conversations
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => chatSessions.id),
  role: varchar("role", { length: 10 }).notNull(), // user, assistant, system
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 20 }).default("text"), // text, bill_upload, analysis_result, strategy_recommendation, document_preview
  metadata: jsonb("metadata").$type<{
    billId?: string;
    analysisId?: string;
    strategyId?: string;
    documentId?: string;
    attachments?: Array<{
      type: string;
      url: string;
      name: string;
    }>;
    actionButtons?: Array<{
      text: string;
      action: string;
      data?: any;
    }>;
  }>(),
  tokens: integer("tokens"), // For tracking API usage
  processingTime: integer("processing_time"), // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Decision Tree Progress Table
export const decisionTreeProgress = pgTable("decision_tree_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  treeId: varchar("tree_id").notNull().references(() => clinicalDecisionTrees.id),
  pathTaken: jsonb("path_taken").$type<string[]>().default([]),
  decisions: jsonb("decisions").$type<Record<string, string>>().default({}),
  finalOutcome: varchar("final_outcome"),
  timeSpent: integer("time_spent").default(0), // seconds
  score: integer("score"),
  isOptimalPath: boolean("is_optimal_path").default(false),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Emergency Medicine Scenarios Table
export const emergencyScenarios = pgTable("emergency_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  scenarioType: varchar("scenario_type", { length: 30 }).notNull(), // trauma, cardiac_arrest, respiratory_failure, etc.
  acuityLevel: integer("acuity_level").notNull(), // 1-5 (1 = critical, 5 = non-urgent)
  description: text("description").notNull(),
  initialPresentation: jsonb("initial_presentation").$type<{
    chiefComplaint: string;
    vitals: {
      bloodPressure: string;
      heartRate: number;
      respiratoryRate: number;
      temperature: number;
      oxygenSaturation: number;
      painScore: number;
    };
    appearance: string;
    consciousness: string;
  }>(),
  timeConstraints: jsonb("time_constraints").$type<{
    totalTime: number; // minutes
    criticalDecisionPoints: Array<{
      timepoint: number;
      decision: string;
      consequences: string;
    }>;
  }>(),
  vitalsProgression: jsonb("vitals_progression").$type<Array<{
    timepoint: number; // minutes
    vitals: {
      bloodPressure: string;
      heartRate: number;
      respiratoryRate: number;
      temperature: number;
      oxygenSaturation: number;
    };
    interventionDependent: boolean;
  }>>(),
  availableInterventions: jsonb("available_interventions").$type<Array<{
    category: string;
    interventions: Array<{
      name: string;
      timeRequired: number;
      contraindications: string[];
      effectiveness: number; // 1-5
    }>;
  }>>(),
  correctDiagnosis: text("correct_diagnosis").notNull(),
  optimalTreatment: jsonb("optimal_treatment").$type<Array<{
    intervention: string;
    timing: number; // minutes from start
    priority: number; // 1-5
    rationale: string;
  }>>(),
  learningObjectives: jsonb("learning_objectives").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  difficulty: integer("difficulty").notNull(), // 1-3
  estimatedDuration: integer("estimated_duration").default(30), // minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency Scenario Progress Table
export const emergencyScenarioProgress = pgTable("emergency_scenario_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  scenarioId: varchar("scenario_id").notNull().references(() => emergencyScenarios.id),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  timeElapsed: integer("time_elapsed").default(0), // seconds
  interventionsTaken: jsonb("interventions_taken").$type<Array<{
    intervention: string;
    timepoint: number; // seconds from start
    effectiveness: number;
    wasOptimal: boolean;
  }>>().default([]),
  diagnosis: text("diagnosis"),
  diagnosticAccuracy: decimal("diagnostic_accuracy", { precision: 5, scale: 2 }),
  treatmentScore: integer("treatment_score").default(0),
  overallScore: integer("overall_score").default(0),
  patientOutcome: varchar("patient_outcome", { length: 20 }), // excellent, good, fair, poor, critical
  feedback: text("feedback"),
  completed: boolean("completed").default(false),
});

// Offline Content Packs Table
export const offlineContentPacks = pgTable("offline_content_packs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  packType: varchar("pack_type", { length: 30 }).notNull(), // specialty, difficulty, exam_prep
  specialty: varchar("specialty", { length: 50 }),
  difficulty: integer("difficulty"),
  caseIds: jsonb("case_ids").$type<string[]>().default([]),
  imageIds: jsonb("image_ids").$type<string[]>().default([]),
  size: integer("size").notNull(), // MB
  version: varchar("version", { length: 10 }).default("1.0"),
  isPremium: boolean("is_premium").default(false),
  downloadCount: integer("download_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Offline Downloads Table
export const userOfflineDownloads = pgTable("user_offline_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  packId: varchar("pack_id").notNull().references(() => offlineContentPacks.id),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  lastSyncedAt: timestamp("last_synced_at"),
  isActive: boolean("is_active").default(true),
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

export const medicalImagesRelations = relations(medicalImages, ({ one, many }) => ({
  case: one(medicalCases, {
    fields: [medicalImages.caseId],
    references: [medicalCases.id],
  }),
  progress: many(imageAnalysisProgress),
}));

export const imageAnalysisProgressRelations = relations(imageAnalysisProgress, ({ one }) => ({
  user: one(users, {
    fields: [imageAnalysisProgress.userId],
    references: [users.id],
  }),
  image: one(medicalImages, {
    fields: [imageAnalysisProgress.imageId],
    references: [medicalImages.id],
  }),
}));

export const studyGroupsRelations = relations(studyGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [studyGroups.creatorId],
    references: [users.id],
  }),
  members: many(studyGroupMembers),
  challenges: many(groupChallenges),
}));

export const studyGroupMembersRelations = relations(studyGroupMembers, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupMembers.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupMembers.userId],
    references: [users.id],
  }),
}));

export const mentorshipsRelations = relations(mentorships, ({ one, many }) => ({
  mentor: one(users, {
    fields: [mentorships.mentorId],
    references: [users.id],
  }),
  mentee: one(users, {
    fields: [mentorships.menteeId],
    references: [users.id],
  }),
  sessions: many(mentorshipSessions),
}));

export const boardExamsRelations = relations(boardExams, ({ one, many }) => ({
  creator: one(users, {
    fields: [boardExams.createdBy],
    references: [users.id],
  }),
  questions: many(boardExamQuestions),
  attempts: many(boardExamAttempts),
}));

export const emergencyScenariosRelations = relations(emergencyScenarios, ({ many }) => ({
  progress: many(emergencyScenarioProgress),
}));

export const offlineContentPacksRelations = relations(offlineContentPacks, ({ many }) => ({
  downloads: many(userOfflineDownloads),
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

// Export types for new tables
export type MedicalImage = typeof medicalImages.$inferSelect;
export type InsertMedicalImage = typeof medicalImages.$inferInsert;
export type ImageAnalysisProgress = typeof imageAnalysisProgress.$inferSelect;
export type InsertImageAnalysisProgress = typeof imageAnalysisProgress.$inferInsert;
export type StudyGroup = typeof studyGroups.$inferSelect;
export type InsertStudyGroup = typeof studyGroups.$inferInsert;
export type StudyGroupMember = typeof studyGroupMembers.$inferSelect;
export type InsertStudyGroupMember = typeof studyGroupMembers.$inferInsert;
export type GroupChallenge = typeof groupChallenges.$inferSelect;
export type InsertGroupChallenge = typeof groupChallenges.$inferInsert;
export type Mentorship = typeof mentorships.$inferSelect;
export type InsertMentorship = typeof mentorships.$inferInsert;
export type MentorshipSession = typeof mentorshipSessions.$inferSelect;
export type InsertMentorshipSession = typeof mentorshipSessions.$inferInsert;
export type BoardExam = typeof boardExams.$inferSelect;
export type InsertBoardExam = typeof boardExams.$inferInsert;
export type BoardExamQuestion = typeof boardExamQuestions.$inferSelect;
export type InsertBoardExamQuestion = typeof boardExamQuestions.$inferInsert;
export type BoardExamAttempt = typeof boardExamAttempts.$inferSelect;
export type InsertBoardExamAttempt = typeof boardExamAttempts.$inferInsert;
export type LabValue = typeof labValues.$inferSelect;
export type InsertLabValue = typeof labValues.$inferInsert;
export type ClinicalAlgorithm = typeof clinicalAlgorithms.$inferSelect;
export type InsertClinicalAlgorithm = typeof clinicalAlgorithms.$inferInsert;
export type ClinicalDecisionTree = typeof clinicalDecisionTrees.$inferSelect;
export type InsertClinicalDecisionTree = typeof clinicalDecisionTrees.$inferInsert;
export type DecisionTreeProgress = typeof decisionTreeProgress.$inferSelect;
export type InsertDecisionTreeProgress = typeof decisionTreeProgress.$inferInsert;

// Synthetic Patient Diagnostics Types
export type SyntheticPatient = typeof syntheticPatients.$inferSelect;
export type InsertSyntheticPatient = typeof syntheticPatients.$inferInsert;
export type DiagnosticSession = typeof diagnosticSessions.$inferSelect;  
export type InsertDiagnosticSession = typeof diagnosticSessions.$inferInsert;
export type EmergencyScenario = typeof emergencyScenarios.$inferSelect;
export type InsertEmergencyScenario = typeof emergencyScenarios.$inferInsert;
export type EmergencyScenarioProgress = typeof emergencyScenarioProgress.$inferSelect;
export type InsertEmergencyScenarioProgress = typeof emergencyScenarioProgress.$inferInsert;
export type OfflineContentPack = typeof offlineContentPacks.$inferSelect;
export type InsertOfflineContentPack = typeof offlineContentPacks.$inferInsert;
export type UserOfflineDownload = typeof userOfflineDownloads.$inferSelect;
export type InsertUserOfflineDownload = typeof userOfflineDownloads.$inferInsert;

// Insert schemas for new tables
export const insertMedicalImageSchema = createInsertSchema(medicalImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertImageAnalysisProgressSchema = createInsertSchema(imageAnalysisProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertStudyGroupSchema = createInsertSchema(studyGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudyGroupMemberSchema = createInsertSchema(studyGroupMembers).omit({
  id: true,
  joinedAt: true,
  lastActiveAt: true,
});

export const insertGroupChallengeSchema = createInsertSchema(groupChallenges).omit({
  id: true,
  createdAt: true,
});

export const insertMentorshipSchema = createInsertSchema(mentorships).omit({
  id: true,
  startedAt: true,
  endedAt: true,
});

export const insertMentorshipSessionSchema = createInsertSchema(mentorshipSessions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertBoardExamSchema = createInsertSchema(boardExams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBoardExamQuestionSchema = createInsertSchema(boardExamQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertBoardExamAttemptSchema = createInsertSchema(boardExamAttempts).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertLabValueSchema = createInsertSchema(labValues).omit({
  id: true,
  createdAt: true,
});

export const insertClinicalAlgorithmSchema = createInsertSchema(clinicalAlgorithms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyScenarioSchema = createInsertSchema(emergencyScenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyScenarioProgressSchema = createInsertSchema(emergencyScenarioProgress).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertOfflineContentPackSchema = createInsertSchema(offlineContentPacks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserOfflineDownloadSchema = createInsertSchema(userOfflineDownloads).omit({
  id: true,
  downloadedAt: true,
  lastSyncedAt: true,
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

// Medical Bill Analyzer Type exports
export type MedicalBill = typeof medicalBills.$inferSelect;
export type InsertMedicalBill = typeof medicalBills.$inferInsert;
export type InsertMedicalBillData = Omit<InsertMedicalBill, 'userId'>;
export type BillAnalysisResult = typeof billAnalysisResults.$inferSelect;
export type InsertBillAnalysisResult = typeof billAnalysisResults.$inferInsert;
export type ReductionStrategy = typeof reductionStrategies.$inferSelect;
export type InsertReductionStrategy = typeof reductionStrategies.$inferInsert;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = typeof generatedDocuments.$inferInsert;
export type MedicalCode = typeof medicalCodes.$inferSelect;
export type InsertMedicalCode = typeof medicalCodes.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Synthetic Patient Diagnostics Insert Schemas
export const insertSyntheticPatientSchema = createInsertSchema(syntheticPatients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiagnosticSessionSchema = createInsertSchema(diagnosticSessions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});
