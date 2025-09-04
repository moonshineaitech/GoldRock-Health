import { 
  Heart, 
  Brain, 
  Bone,
  Eye,
  Baby,
  Stethoscope,
  Pill,
  Scissors,
  Activity,
  Shield,
  Zap,
  Target,
  Clock,
  Star,
  Trophy,
  Award,
  Crown,
  Users,
  BookOpen,
  Microscope,
  Siren,
  Thermometer,
  Bandage,
  FlaskConical
} from "lucide-react";

export interface MedicalAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  points: number;
  category: "Getting Started" | "Specialization" | "Performance" | "AI Mastery" | "Community" | "Milestones";
  progress?: number;
  maxProgress?: number;
  specialty?: string;
  criteria: {
    type: "casesCompleted" | "accuracy" | "speed" | "specialty" | "streak" | "voice" | "ai" | "community";
    target: number;
    specialty?: string;
    timeLimit?: number; // in minutes
    accuracyThreshold?: number; // percentage
  };
  unlockedAt?: string;
  isNew?: boolean;
}

export const medicalSpecialtyAchievements: MedicalAchievement[] = [
  // Getting Started
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first medical case",
    icon: BookOpen,
    earned: true,
    rarity: "Common",
    points: 50,
    category: "Getting Started",
    criteria: { type: "casesCompleted", target: 1 },
    unlockedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "junior-resident",
    title: "Junior Resident",
    description: "Complete 5 medical cases",
    icon: Stethoscope,
    earned: true,
    rarity: "Common",
    points: 100,
    category: "Getting Started",
    criteria: { type: "casesCompleted", target: 5 },
    unlockedAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "medical-student",
    title: "Medical Student",
    description: "Complete 10 medical cases",
    icon: BookOpen,
    earned: false,
    rarity: "Common",
    points: 150,
    category: "Getting Started",
    progress: 7,
    maxProgress: 10,
    criteria: { type: "casesCompleted", target: 10 }
  },

  // Specialty Achievements
  {
    id: "cardiology-novice",
    title: "Cardiology Novice",
    description: "Complete 5 cardiology cases",
    icon: Heart,
    earned: true,
    rarity: "Common",
    points: 100,
    category: "Specialization",
    specialty: "Cardiology",
    criteria: { type: "specialty", target: 5, specialty: "Cardiology" },
    unlockedAt: "2024-01-18T09:15:00Z"
  },
  {
    id: "cardiology-specialist",
    title: "Cardiology Specialist",
    description: "Complete 20 cardiology cases with 85%+ accuracy",
    icon: Heart,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "Specialization",
    specialty: "Cardiology",
    progress: 12,
    maxProgress: 20,
    criteria: { type: "specialty", target: 20, specialty: "Cardiology", accuracyThreshold: 85 }
  },
  {
    id: "cardiology-master",
    title: "Cardiology Master",
    description: "Complete 50 cardiology cases with 90%+ accuracy",
    icon: Heart,
    earned: false,
    rarity: "Epic",
    points: 750,
    category: "Specialization",
    specialty: "Cardiology",
    criteria: { type: "specialty", target: 50, specialty: "Cardiology", accuracyThreshold: 90 }
  },
  {
    id: "neurology-specialist",
    title: "Neurology Specialist",
    description: "Complete 20 neurology cases with 85%+ accuracy",
    icon: Brain,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "Specialization",
    specialty: "Neurology",
    progress: 3,
    maxProgress: 20,
    criteria: { type: "specialty", target: 20, specialty: "Neurology", accuracyThreshold: 85 }
  },
  {
    id: "orthopedics-specialist",
    title: "Orthopedics Specialist",
    description: "Complete 20 orthopedic cases with 85%+ accuracy",
    icon: Bone,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "Specialization",
    specialty: "Orthopedics",
    criteria: { type: "specialty", target: 20, specialty: "Orthopedics", accuracyThreshold: 85 }
  },
  {
    id: "ophthalmology-specialist",
    title: "Ophthalmology Specialist",
    description: "Complete 15 ophthalmology cases with 85%+ accuracy",
    icon: Eye,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "Specialization",
    specialty: "Ophthalmology",
    criteria: { type: "specialty", target: 15, specialty: "Ophthalmology", accuracyThreshold: 85 }
  },
  {
    id: "pediatrics-specialist",
    title: "Pediatrics Specialist",
    description: "Complete 20 pediatric cases with 85%+ accuracy",
    icon: Baby,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "Specialization",
    specialty: "Pediatrics",
    criteria: { type: "specialty", target: 20, specialty: "Pediatrics", accuracyThreshold: 85 }
  },
  {
    id: "emergency-specialist",
    title: "Emergency Medicine Specialist",
    description: "Complete 25 emergency cases with 80%+ accuracy",
    icon: Siren,
    earned: true,
    rarity: "Rare",
    points: 350,
    category: "Specialization",
    specialty: "Emergency Medicine",
    criteria: { type: "specialty", target: 25, specialty: "Emergency Medicine", accuracyThreshold: 80 },
    unlockedAt: "2024-01-20T16:45:00Z"
  },

  // Performance Achievements
  {
    id: "accuracy-rookie",
    title: "Accuracy Rookie",
    description: "Achieve 80% accuracy in 5 consecutive cases",
    icon: Target,
    earned: true,
    rarity: "Common",
    points: 150,
    category: "Performance",
    criteria: { type: "accuracy", target: 5, accuracyThreshold: 80 },
    unlockedAt: "2024-01-17T11:30:00Z"
  },
  {
    id: "accuracy-master",
    title: "Accuracy Master",
    description: "Achieve 90% accuracy in 10 consecutive cases",
    icon: Target,
    earned: false,
    rarity: "Rare",
    points: 250,
    category: "Performance",
    progress: 6,
    maxProgress: 10,
    criteria: { type: "accuracy", target: 10, accuracyThreshold: 90 }
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Achieve 95% accuracy in 15 consecutive cases",
    icon: Star,
    earned: false,
    rarity: "Epic",
    points: 500,
    category: "Performance",
    criteria: { type: "accuracy", target: 15, accuracyThreshold: 95 }
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete 5 cases in under 10 minutes each",
    icon: Zap,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "Performance",
    progress: 2,
    maxProgress: 5,
    criteria: { type: "speed", target: 5, timeLimit: 10 }
  },
  {
    id: "lightning-fast",
    title: "Lightning Fast",
    description: "Complete 3 cases in under 5 minutes each",
    icon: Activity,
    earned: false,
    rarity: "Epic",
    points: 600,
    category: "Performance",
    criteria: { type: "speed", target: 3, timeLimit: 5 }
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 7-day learning streak",
    icon: Trophy,
    earned: false,
    rarity: "Rare",
    points: 200,
    category: "Performance",
    progress: 4,
    maxProgress: 7,
    criteria: { type: "streak", target: 7 }
  },

  // AI Mastery
  {
    id: "ai-curious",
    title: "AI Curious",
    description: "Generate your first AI case",
    icon: Brain,
    earned: false,
    rarity: "Common",
    points: 100,
    category: "AI Mastery",
    criteria: { type: "ai", target: 1 }
  },
  {
    id: "ai-pioneer",
    title: "AI Pioneer",
    description: "Generate and complete 5 AI cases",
    icon: Brain,
    earned: false,
    rarity: "Rare",
    points: 300,
    category: "AI Mastery",
    progress: 2,
    maxProgress: 5,
    criteria: { type: "ai", target: 5 }
  },
  {
    id: "ai-master",
    title: "AI Master",
    description: "Generate and complete 25 AI cases",
    icon: FlaskConical,
    earned: false,
    rarity: "Epic",
    points: 750,
    category: "AI Mastery",
    criteria: { type: "ai", target: 25 }
  },

  // Community
  {
    id: "voice-explorer",
    title: "Voice Explorer",
    description: "Complete 5 cases using voice interactions",
    icon: Stethoscope,
    earned: false,
    rarity: "Common",
    points: 150,
    category: "Community",
    progress: 3,
    maxProgress: 5,
    criteria: { type: "voice", target: 5 }
  },
  {
    id: "voice-master",
    title: "Voice Master",
    description: "Complete 25 cases using voice interactions",
    icon: Microscope,
    earned: false,
    rarity: "Rare",
    points: 400,
    category: "Community",
    criteria: { type: "voice", target: 25 }
  },
  {
    id: "social-learner",
    title: "Social Learner",
    description: "Share 3 cases with colleagues",
    icon: Users,
    earned: false,
    rarity: "Common",
    points: 75,
    category: "Community",
    criteria: { type: "community", target: 3 }
  },

  // Milestone Achievements
  {
    id: "centurion",
    title: "Centurion",
    description: "Complete 100 medical cases",
    icon: Trophy,
    earned: false,
    rarity: "Epic",
    points: 1000,
    category: "Milestones",
    progress: 47,
    maxProgress: 100,
    criteria: { type: "casesCompleted", target: 100 }
  },
  {
    id: "grand-master",
    title: "Grand Master",
    description: "Complete 500 medical cases",
    icon: Crown,
    earned: false,
    rarity: "Legendary",
    points: 5000,
    category: "Milestones",
    criteria: { type: "casesCompleted", target: 500 }
  },
  {
    id: "polymath",
    title: "Medical Polymath",
    description: "Complete cases in all 10 specialties",
    icon: Award,
    earned: false,
    rarity: "Epic",
    points: 800,
    category: "Milestones",
    progress: 5,
    maxProgress: 10,
    criteria: { type: "specialty", target: 10 }
  },
  {
    id: "legend",
    title: "Medical Legend",
    description: "Achieve 95%+ accuracy across 200 cases",
    icon: Crown,
    earned: false,
    rarity: "Legendary",
    points: 2500,
    category: "Milestones",
    criteria: { type: "accuracy", target: 200, accuracyThreshold: 95 }
  }
];

export const achievementCategories = [
  {
    id: "all",
    name: "All Achievements",
    icon: Trophy,
    color: "text-gray-600"
  },
  {
    id: "getting-started",
    name: "Getting Started",
    icon: BookOpen,
    color: "text-green-600"
  },
  {
    id: "specialization",
    name: "Medical Specialties",
    icon: Heart,
    color: "text-red-600"
  },
  {
    id: "performance",
    name: "Performance",
    icon: Target,
    color: "text-blue-600"
  },
  {
    id: "ai-mastery",
    name: "AI Mastery",
    icon: Brain,
    color: "text-purple-600"
  },
  {
    id: "community",
    name: "Community",
    icon: Users,
    color: "text-indigo-600"
  },
  {
    id: "milestones",
    name: "Milestones",
    icon: Crown,
    color: "text-yellow-600"
  }
];

export function getAchievementsByCategory(category: string) {
  if (category === "all") return medicalSpecialtyAchievements;
  
  const categoryMap: Record<string, string> = {
    "getting-started": "Getting Started",
    "specialization": "Specialization", 
    "performance": "Performance",
    "ai-mastery": "AI Mastery",
    "community": "Community",
    "milestones": "Milestones"
  };
  
  return medicalSpecialtyAchievements.filter(
    achievement => achievement.category === categoryMap[category]
  );
}

export function getEarnedAchievements() {
  return medicalSpecialtyAchievements.filter(achievement => achievement.earned);
}

export function getProgressAchievements() {
  return medicalSpecialtyAchievements.filter(
    achievement => !achievement.earned && achievement.progress
  );
}

export function getLockedAchievements() {
  return medicalSpecialtyAchievements.filter(
    achievement => !achievement.earned && !achievement.progress
  );
}

export function getTotalPoints() {
  return getEarnedAchievements().reduce((total, achievement) => total + achievement.points, 0);
}

export function getAchievementProgress() {
  const total = medicalSpecialtyAchievements.length;
  const earned = getEarnedAchievements().length;
  return { earned, total, percentage: Math.round((earned / total) * 100) };
}