import type { InsertBoardExam } from "@shared/schema";

export const sampleBoardExams: InsertBoardExam[] = [
  {
    title: "USMLE Step 1 - Cardiovascular System",
    description: "Comprehensive exam covering cardiovascular anatomy, physiology, pathology, and pharmacology. Essential for medical licensure.",
    examType: "USMLE Step 1",
    specialty: "Cardiology",
    difficulty: 2,
    timeLimit: 120,
    totalQuestions: 3,
    passingScore: 70,
    questions: [
      {
        question: "A 65-year-old man presents with chest pain radiating to his left arm. ECG shows ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?",
        options: [
          "Left anterior descending artery",
          "Right coronary artery", 
          "Left circumflex artery",
          "Left main coronary artery"
        ],
        correctAnswer: "Right coronary artery",
        explanation: "ST elevation in leads II, III, and aVF indicates an inferior wall MI, which is typically caused by RCA occlusion.",
        category: "Cardiology",
        difficulty: 2
      },
      {
        question: "Which medication is contraindicated in a patient with severe aortic stenosis and heart failure?",
        options: [
          "ACE inhibitor",
          "Beta-blocker",
          "Calcium channel blocker",
          "Diuretic"
        ],
        correctAnswer: "Calcium channel blocker",
        explanation: "Calcium channel blockers can reduce contractility and worsen heart failure in severe aortic stenosis.",
        category: "Pharmacology",
        difficulty: 3
      },
      {
        question: "What is the normal ejection fraction range for the left ventricle?",
        options: [
          "35-45%",
          "50-70%",
          "75-85%",
          "85-95%"
        ],
        correctAnswer: "50-70%",
        explanation: "Normal left ventricular ejection fraction ranges from 50-70%. Values below 40% indicate heart failure.",
        category: "Physiology",
        difficulty: 1
      }
    ],
    topics: ["cardiac cycle", "ECG interpretation", "heart failure", "coronary artery disease", "valvular disease"],
    learningObjectives: [
      "Interpret ECG findings in acute coronary syndromes",
      "Understand cardiovascular pharmacology",
      "Recognize signs and symptoms of heart failure",
      "Apply knowledge of cardiac anatomy and physiology"
    ]
  },
  {
    title: "USMLE Step 2 CK - Emergency Medicine",
    description: "Clinical emergency medicine scenarios testing diagnostic and management skills. Focus on acute presentations and critical decision-making.",
    examType: "USMLE Step 2",
    specialty: "Emergency Medicine",
    difficulty: 3,
    timeLimit: 90,
    totalQuestions: 2,
    passingScore: 75,
    questions: [
      {
        question: "A 28-year-old woman presents to the emergency department with sudden onset severe headache, photophobia, and neck stiffness. What is the most appropriate next step?",
        options: [
          "CT head without contrast",
          "Lumbar puncture",
          "MRI brain",
          "Blood cultures"
        ],
        correctAnswer: "CT head without contrast",
        explanation: "CT head should be done first to rule out hemorrhage before lumbar puncture in suspected meningitis with signs of increased ICP.",
        category: "Emergency Medicine",
        difficulty: 2
      },
      {
        question: "A patient presents with crushing chest pain, diaphoresis, and nausea. Initial ECG is normal. What is the next best step?",
        options: [
          "Discharge home with follow-up",
          "Serial ECGs and cardiac enzymes",
          "Stress testing",
          "CT angiography"
        ],
        correctAnswer: "Serial ECGs and cardiac enzymes",
        explanation: "Normal initial ECG doesn't rule out MI. Serial monitoring is essential for high-risk presentations.",
        category: "Cardiology",
        difficulty: 2
      }
    ],
    topics: ["trauma management", "cardiac emergencies", "neurological emergencies", "toxicology", "shock"],
    learningObjectives: [
      "Manage emergency presentations",
      "Prioritize diagnostic testing",
      "Recognize life-threatening conditions",
      "Apply emergency protocols"
    ]
  },
  {
    title: "USMLE Step 3 - Internal Medicine",
    description: "Advanced clinical scenarios testing patient management and treatment planning. Simulates real-world medical practice.",
    examType: "USMLE Step 3",
    specialty: "Internal Medicine",
    difficulty: 3,
    timeLimit: 180,
    totalQuestions: 2,
    passingScore: 80,
    questions: [
      {
        question: "A 55-year-old diabetic patient with hypertension and proteinuria presents for routine follow-up. Current medications include metformin and amlodipine. Blood pressure is 145/90 mmHg. What is the best next medication to add?",
        options: [
          "Hydrochlorothiazide",
          "ACE inhibitor",
          "Beta-blocker",
          "Calcium channel blocker"
        ],
        correctAnswer: "ACE inhibitor",
        explanation: "ACE inhibitors are first-line for diabetic patients with proteinuria due to renoprotective effects.",
        category: "Nephrology",
        difficulty: 2
      },
      {
        question: "A patient with COPD presents with increased dyspnea and purulent sputum. Which antibiotic regimen is most appropriate for outpatient treatment?",
        options: [
          "Amoxicillin",
          "Azithromycin",
          "Amoxicillin-clavulanate",
          "Ceftriaxone"
        ],
        correctAnswer: "Amoxicillin-clavulanate",
        explanation: "Amoxicillin-clavulanate covers common COPD exacerbation pathogens including beta-lactamase producers.",
        category: "Pulmonology",
        difficulty: 2
      }
    ],
    topics: ["chronic disease management", "preventive care", "geriatrics", "ambulatory medicine"],
    learningObjectives: [
      "Manage chronic medical conditions",
      "Develop long-term treatment plans",
      "Coordinate care across specialties",
      "Apply evidence-based medicine"
    ]
  },
  {
    title: "COMLEX Level 1 - Musculoskeletal System",
    description: "Osteopathic medical exam focusing on musculoskeletal anatomy, biomechanics, and osteopathic manipulative treatment principles.",
    examType: "COMLEX",
    specialty: "Orthopedics",
    difficulty: 2,
    timeLimit: 100,
    totalQuestions: 2,
    passingScore: 70,
    questions: [
      {
        question: "Which osteopathic technique is most appropriate for treating a patient with restricted cervical sidebending?",
        options: [
          "High-velocity low-amplitude thrust",
          "Muscle energy technique",
          "Counterstrain",
          "Myofascial release"
        ],
        correctAnswer: "Muscle energy technique",
        explanation: "Muscle energy technique is effective for treating somatic dysfunctions with restricted range of motion.",
        category: "OMT",
        difficulty: 2
      },
      {
        question: "A patient has a positive Patrick's test. This suggests pathology in which structure?",
        options: [
          "Lumbar spine",
          "Hip joint",
          "Sacroiliac joint",
          "Knee joint"
        ],
        correctAnswer: "Hip joint",
        explanation: "Patrick's test (FABER test) evaluates hip pathology and sacroiliac joint dysfunction.",
        category: "Orthopedics",
        difficulty: 1
      }
    ],
    topics: ["osteopathic principles", "somatic dysfunction", "OMT techniques", "biomechanics"],
    learningObjectives: [
      "Apply osteopathic principles",
      "Diagnose somatic dysfunctions",
      "Select appropriate OMT techniques",
      "Understand musculoskeletal biomechanics"
    ]
  },
  {
    title: "Psychiatry Board Exam - Adult Disorders",
    description: "Comprehensive psychiatry board exam covering mood disorders, psychotic disorders, anxiety disorders, and psychopharmacology.",
    examType: "Specialty Board",
    specialty: "Psychiatry",
    difficulty: 3,
    timeLimit: 150,
    totalQuestions: 2,
    passingScore: 75,
    questions: [
      {
        question: "A 25-year-old patient presents with auditory hallucinations, delusions of persecution, and social withdrawal for 8 months. What is the most likely diagnosis?",
        options: [
          "Brief psychotic disorder",
          "Schizophreniform disorder",
          "Schizophrenia",
          "Delusional disorder"
        ],
        correctAnswer: "Schizophreniform disorder",
        explanation: "Symptoms consistent with schizophrenia for >1 month but <6 months qualify as schizophreniform disorder.",
        category: "Psychotic Disorders",
        difficulty: 2
      },
      {
        question: "Which medication requires regular monitoring of white blood cell count?",
        options: [
          "Risperidone",
          "Olanzapine",
          "Clozapine",
          "Quetiapine"
        ],
        correctAnswer: "Clozapine",
        explanation: "Clozapine can cause agranulocytosis, requiring regular CBC monitoring throughout treatment.",
        category: "Psychopharmacology",
        difficulty: 2
      }
    ],
    topics: ["mood disorders", "psychotic disorders", "anxiety disorders", "personality disorders", "psychopharmacology"],
    learningObjectives: [
      "Diagnose psychiatric disorders using DSM-5",
      "Select appropriate psychopharmacological treatments",
      "Understand medication side effects and monitoring",
      "Apply psychotherapeutic principles"
    ]
  },
  {
    title: "Pediatrics Board Review - Growth & Development",
    description: "Pediatric board exam focusing on normal growth and development, developmental milestones, and common pediatric conditions.",
    examType: "Specialty Board",
    specialty: "Pediatrics",
    difficulty: 2,
    timeLimit: 120,
    totalQuestions: 2,
    passingScore: 70,
    questions: [
      {
        question: "At what age should a child typically be able to walk independently?",
        options: [
          "9-10 months",
          "12-15 months", 
          "18-24 months",
          "24-30 months"
        ],
        correctAnswer: "12-15 months",
        explanation: "Independent walking typically occurs between 12-15 months. Concern if not walking by 18 months.",
        category: "Development",
        difficulty: 1
      },
      {
        question: "A 2-year-old presents with barking cough, stridor, and fever. What is the most likely diagnosis?",
        options: [
          "Bronchiolitis",
          "Croup",
          "Epiglottitis",
          "Pneumonia"
        ],
        correctAnswer: "Croup",
        explanation: "Croup typically presents with barking cough, inspiratory stridor, and low-grade fever in young children.",
        category: "Respiratory",
        difficulty: 1
      }
    ],
    topics: ["developmental milestones", "growth charts", "immunizations", "common pediatric illnesses"],
    learningObjectives: [
      "Assess normal growth and development",
      "Recognize developmental delays",
      "Manage common pediatric conditions",
      "Apply age-appropriate treatments"
    ]
  }
];

export class BoardExamService {
  static async initializeExams() {
    try {
      const { storage } = await import("../storage");
      
      // Check if exams already exist
      const existingExams = await storage.getBoardExams();
      if (existingExams.length > 0) {
        console.log(`Found ${existingExams.length} existing board exams`);
        return;
      }

      // Create sample exams
      console.log('Initializing sample board exams...');
      for (const examData of sampleBoardExams) {
        await storage.createBoardExam(examData);
      }
      
      console.log(`Initialized ${sampleBoardExams.length} sample board exams`);
    } catch (error) {
      console.error('Error initializing board exams:', error);
    }
  }
}