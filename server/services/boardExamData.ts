import type { InsertBoardExam } from "@shared/schema";

export const sampleBoardExams: InsertBoardExam[] = [
  {
    title: "USMLE Step 1 - Cardiovascular System",
    description: "Comprehensive exam covering cardiovascular anatomy, physiology, pathology, and pharmacology. Essential for medical licensure.",
    examType: "USMLE Step 1",
    specialty: "Cardiology",
    difficulty: 2,
    timeLimit: 120,
    totalQuestions: 10,
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
      },
      {
        question: "A 70-year-old man has a harsh crescendo-decrescendo systolic murmur best heard at the right second intercostal space, radiating to the carotids. He reports exertional syncope. Which valvular abnormality is most likely?",
        options: [
          "Mitral regurgitation",
          "Aortic stenosis",
          "Mitral stenosis",
          "Aortic regurgitation"
        ],
        correctAnswer: "Aortic stenosis",
        explanation: "A crescendo-decrescendo systolic ejection murmur at the right upper sternal border radiating to the carotids, with the classic triad of angina, syncope, and heart failure, is characteristic of aortic stenosis.",
        category: "Valvular Disease",
        difficulty: 2
      },
      {
        question: "Which class of medication has been shown to reduce mortality in patients with heart failure with reduced ejection fraction (HFrEF)?",
        options: [
          "Loop diuretics",
          "Beta-blockers",
          "Calcium channel blockers",
          "Digoxin"
        ],
        correctAnswer: "Beta-blockers",
        explanation: "Beta-blockers (carvedilol, metoprolol succinate, bisoprolol) reduce mortality in HFrEF. Diuretics improve symptoms but not mortality, and digoxin reduces hospitalizations without a mortality benefit.",
        category: "Pharmacology",
        difficulty: 2
      },
      {
        question: "An irregularly irregular pulse with no discernible P waves on ECG is most consistent with which arrhythmia?",
        options: [
          "Atrial flutter",
          "Atrial fibrillation",
          "Ventricular tachycardia",
          "First-degree AV block"
        ],
        correctAnswer: "Atrial fibrillation",
        explanation: "Atrial fibrillation produces an irregularly irregular rhythm with absent P waves and a fibrillating baseline. It increases the risk of thromboembolic stroke, warranting anticoagulation assessment.",
        category: "Arrhythmias",
        difficulty: 1
      },
      {
        question: "Digoxin exerts its positive inotropic effect by inhibiting which membrane transporter?",
        options: [
          "Voltage-gated sodium channel",
          "Na+/K+-ATPase",
          "L-type calcium channel",
          "Sodium-glucose cotransporter"
        ],
        correctAnswer: "Na+/K+-ATPase",
        explanation: "Digoxin inhibits the Na+/K+-ATPase, raising intracellular sodium. This reduces calcium extrusion via the Na+/Ca2+ exchanger, increasing intracellular calcium and contractility.",
        category: "Pharmacology",
        difficulty: 2
      },
      {
        question: "A 16-year-old is found to have upper extremity hypertension with diminished, delayed femoral pulses. Which congenital lesion is most likely?",
        options: [
          "Coarctation of the aorta",
          "Atrial septal defect",
          "Tetralogy of Fallot",
          "Patent ductus arteriosus"
        ],
        correctAnswer: "Coarctation of the aorta",
        explanation: "Coarctation of the aorta classically causes upper extremity hypertension with weak, delayed lower extremity pulses (radio-femoral delay) and may show rib notching on chest X-ray.",
        category: "Congenital Heart Disease",
        difficulty: 2
      },
      {
        question: "On cardiac auscultation, an S3 gallop in a 60-year-old with dyspnea most strongly suggests which condition?",
        options: [
          "Constrictive pericarditis",
          "Volume overload and systolic heart failure",
          "Aortic stenosis",
          "Atrial myxoma"
        ],
        correctAnswer: "Volume overload and systolic heart failure",
        explanation: "An S3 is produced by rapid ventricular filling against a dilated, volume-overloaded ventricle and is a sensitive sign of systolic heart failure in adults.",
        category: "Physiology",
        difficulty: 2
      },
      {
        question: "An ECG shows progressive PR-interval prolongation until a QRS complex is dropped. Which conduction abnormality does this represent?",
        options: [
          "Mobitz type I (Wenckebach) AV block",
          "Mobitz type II AV block",
          "Third-degree (complete) AV block",
          "First-degree AV block"
        ],
        correctAnswer: "Mobitz type I (Wenckebach) AV block",
        explanation: "Progressive PR prolongation culminating in a dropped beat defines Mobitz type I (Wenckebach) second-degree AV block, usually due to AV nodal disease and generally benign.",
        category: "ECG Interpretation",
        difficulty: 2
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
    totalQuestions: 10,
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
      },
      {
        question: "A 24-year-old develops urticaria, wheezing, and hypotension minutes after eating peanuts. What is the most appropriate first-line treatment?",
        options: [
          "Intravenous diphenhydramine",
          "Intramuscular epinephrine",
          "Oral prednisone",
          "Nebulized albuterol"
        ],
        correctAnswer: "Intramuscular epinephrine",
        explanation: "Intramuscular epinephrine into the anterolateral thigh is the first-line treatment for anaphylaxis. Antihistamines and steroids are adjuncts and do not address airway or hemodynamic collapse.",
        category: "Emergency Medicine",
        difficulty: 1
      },
      {
        question: "A trauma patient has absent breath sounds on the right, tracheal deviation to the left, and hypotension. What is the immediate next step?",
        options: [
          "Chest X-ray",
          "Needle decompression of the right chest",
          "Endotracheal intubation",
          "CT chest"
        ],
        correctAnswer: "Needle decompression of the right chest",
        explanation: "These findings indicate tension pneumothorax, a clinical diagnosis requiring immediate needle decompression followed by chest tube placement—do not delay for imaging.",
        category: "Trauma",
        difficulty: 2
      },
      {
        question: "A patient presents 8 hours after a large acetaminophen (paracetamol) overdose. Which antidote should be administered?",
        options: [
          "Naloxone",
          "N-acetylcysteine",
          "Flumazenil",
          "Fomepizole"
        ],
        correctAnswer: "N-acetylcysteine",
        explanation: "N-acetylcysteine replenishes glutathione and is the antidote for acetaminophen toxicity. It is most effective within 8-10 hours but provides benefit even later in the course.",
        category: "Toxicology",
        difficulty: 2
      },
      {
        question: "An unresponsive patient has pinpoint pupils, a respiratory rate of 6, and depressed mental status. What is the most appropriate immediate treatment?",
        options: [
          "Naloxone",
          "Activated charcoal",
          "Dextrose",
          "Flumazenil"
        ],
        correctAnswer: "Naloxone",
        explanation: "Miosis, respiratory depression, and CNS depression are the classic opioid toxidrome. Naloxone, an opioid antagonist, rapidly reverses respiratory depression.",
        category: "Toxicology",
        difficulty: 1
      },
      {
        question: "A patient with new-onset seizures has a serum potassium of 7.2 mEq/L with peaked T waves on ECG. What should be given first?",
        options: [
          "Intravenous insulin and glucose",
          "Intravenous calcium gluconate",
          "Sodium polystyrene sulfonate",
          "Albuterol nebulizer"
        ],
        correctAnswer: "Intravenous calcium gluconate",
        explanation: "When hyperkalemia causes ECG changes, IV calcium is given first to stabilize the cardiac membrane. Insulin/glucose and albuterol then shift potassium intracellularly.",
        category: "Emergency Medicine",
        difficulty: 2
      },
      {
        question: "A patient in status epilepticus has been seizing for 6 minutes. What is the first-line pharmacologic therapy?",
        options: [
          "Intravenous phenytoin",
          "Intravenous lorazepam",
          "Intravenous levetiracetam",
          "Intravenous valproate"
        ],
        correctAnswer: "Intravenous lorazepam",
        explanation: "Benzodiazepines such as lorazepam are first-line for status epilepticus. Antiepileptics like phenytoin or levetiracetam are second-line loading agents.",
        category: "Neurological Emergencies",
        difficulty: 2
      },
      {
        question: "A 19-year-old with type 1 diabetes presents with vomiting, glucose 480 mg/dL, pH 7.10, and ketonuria. What is the most important initial intervention?",
        options: [
          "Intravenous regular insulin bolus",
          "Aggressive isotonic IV fluid resuscitation",
          "Intravenous sodium bicarbonate",
          "Oral potassium replacement"
        ],
        correctAnswer: "Aggressive isotonic IV fluid resuscitation",
        explanation: "Volume depletion is profound in DKA, so isotonic fluids are the first priority. Insulin and potassium repletion follow, with potassium given before insulin if it is low.",
        category: "Endocrine Emergencies",
        difficulty: 2
      },
      {
        question: "A 50-year-old presents with hypotension, fever, and a suspected urinary source of infection. After obtaining cultures, which intervention most improves survival when given early?",
        options: [
          "Broad-spectrum antibiotics",
          "Vasopressors before fluids",
          "Corticosteroids",
          "Blood transfusion"
        ],
        correctAnswer: "Broad-spectrum antibiotics",
        explanation: "In sepsis, early broad-spectrum antibiotics (ideally within the first hour) along with fluid resuscitation are the interventions most strongly associated with reduced mortality.",
        category: "Emergency Medicine",
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
    totalQuestions: 10,
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
      },
      {
        question: "A 58-year-old man with no prior cardiovascular disease has an LDL of 165 mg/dL and a 10-year ASCVD risk of 12%. What is the most appropriate therapy?",
        options: [
          "No pharmacologic therapy needed",
          "Moderate- to high-intensity statin",
          "Fibrate therapy",
          "Niacin"
        ],
        correctAnswer: "Moderate- to high-intensity statin",
        explanation: "A 10-year ASCVD risk of 7.5% or greater with elevated LDL warrants statin therapy for primary prevention, in addition to lifestyle modification.",
        category: "Cardiology",
        difficulty: 2
      },
      {
        question: "A 68-year-old with new atrial fibrillation has hypertension and diabetes (CHA2DS2-VASc score of 3). What is the best long-term stroke-prevention strategy?",
        options: [
          "Aspirin alone",
          "Oral anticoagulation",
          "No therapy",
          "Clopidogrel alone"
        ],
        correctAnswer: "Oral anticoagulation",
        explanation: "A CHA2DS2-VASc score of 2 or more in men indicates significant stroke risk, and oral anticoagulation (a DOAC or warfarin) is recommended over antiplatelet therapy.",
        category: "Cardiology",
        difficulty: 2
      },
      {
        question: "A 45-year-old woman has fatigue, weight gain, cold intolerance, and a TSH of 12 mIU/L with low free T4. What is the appropriate treatment?",
        options: [
          "Methimazole",
          "Levothyroxine",
          "Propranolol",
          "Radioactive iodine"
        ],
        correctAnswer: "Levothyroxine",
        explanation: "Elevated TSH with low free T4 indicates primary hypothyroidism, treated with levothyroxine replacement. Methimazole and radioactive iodine treat hyperthyroidism.",
        category: "Endocrinology",
        difficulty: 1
      },
      {
        question: "A 52-year-old reports burning retrosternal discomfort after meals and when lying down, without alarm features. What is the most appropriate initial therapy?",
        options: [
          "Proton pump inhibitor trial",
          "Upper endoscopy",
          "Surgical fundoplication",
          "Empiric antibiotics"
        ],
        correctAnswer: "Proton pump inhibitor trial",
        explanation: "Typical GERD without alarm symptoms is managed empirically with lifestyle changes and a proton pump inhibitor trial before considering endoscopy.",
        category: "Gastroenterology",
        difficulty: 1
      },
      {
        question: "A previously healthy 40-year-old with no comorbidities has community-acquired pneumonia and will be treated as an outpatient. Which empiric regimen is appropriate?",
        options: [
          "Amoxicillin or doxycycline",
          "Vancomycin",
          "Ceftriaxone plus azithromycin IV",
          "Meropenem"
        ],
        correctAnswer: "Amoxicillin or doxycycline",
        explanation: "For healthy outpatients without comorbidities, guidelines recommend amoxicillin, doxycycline, or a macrolide. Broader IV regimens are reserved for inpatients or those with comorbidities.",
        category: "Pulmonology",
        difficulty: 2
      },
      {
        question: "A 67-year-old postmenopausal woman has a DEXA T-score of -2.8 at the hip. What is the first-line pharmacologic treatment?",
        options: [
          "Calcium supplementation alone",
          "Oral bisphosphonate",
          "Estrogen replacement",
          "Calcitonin"
        ],
        correctAnswer: "Oral bisphosphonate",
        explanation: "A T-score of -2.5 or lower defines osteoporosis. Bisphosphonates (e.g., alendronate) are first-line therapy, along with adequate calcium and vitamin D.",
        category: "Endocrinology",
        difficulty: 2
      },
      {
        question: "At what age should average-risk adults begin screening for colorectal cancer according to current U.S. guidelines?",
        options: [
          "40 years",
          "45 years",
          "50 years",
          "55 years"
        ],
        correctAnswer: "45 years",
        explanation: "Current USPSTF and American Cancer Society guidelines recommend beginning average-risk colorectal cancer screening at age 45, using colonoscopy or stool-based testing.",
        category: "Preventive Medicine",
        difficulty: 1
      },
      {
        question: "A 60-year-old with type 2 diabetes has an HbA1c of 8.5% on metformin and established atherosclerotic cardiovascular disease. Which add-on agent provides additional cardiovascular benefit?",
        options: [
          "Sulfonylurea",
          "GLP-1 receptor agonist",
          "Basal insulin",
          "Thiazolidinedione"
        ],
        correctAnswer: "GLP-1 receptor agonist",
        explanation: "In patients with type 2 diabetes and established ASCVD, GLP-1 receptor agonists (and SGLT2 inhibitors) provide cardiovascular benefit beyond glucose lowering.",
        category: "Endocrinology",
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
    totalQuestions: 10,
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
      },
      {
        question: "Which osteopathic technique uses passive positioning to shorten a muscle and relieve a tender point, typically held for about 90 seconds?",
        options: [
          "Muscle energy",
          "Counterstrain",
          "High-velocity low-amplitude",
          "Soft tissue"
        ],
        correctAnswer: "Counterstrain",
        explanation: "Counterstrain (strain-counterstrain) passively positions the patient to shorten the dysfunctional muscle while monitoring a tender point held for approximately 90 seconds.",
        category: "OMT",
        difficulty: 2
      },
      {
        question: "Chapman's reflex points are most associated with dysfunction in which system?",
        options: [
          "Lymphatic congestion and visceral dysfunction",
          "Arterial supply",
          "Peripheral motor nerves",
          "Cranial sutures"
        ],
        correctAnswer: "Lymphatic congestion and visceral dysfunction",
        explanation: "Chapman's points are palpable, tender ganglioform contractions reflecting visceral dysfunction via the lymphatic and autonomic nervous systems, useful for diagnosis and treatment.",
        category: "Osteopathic Principles",
        difficulty: 2
      },
      {
        question: "The sympathetic nervous system originates from which spinal cord levels?",
        options: [
          "C1-C7",
          "T1-L2",
          "S2-S4",
          "L3-L5"
        ],
        correctAnswer: "T1-L2",
        explanation: "Sympathetic (thoracolumbar) preganglionic fibers arise from T1-L2. The parasympathetic system is craniosacral, with sacral outflow from S2-S4.",
        category: "Osteopathic Principles",
        difficulty: 1
      },
      {
        question: "Which rotator cuff muscle is most commonly injured and is tested by the empty-can (Jobe) maneuver?",
        options: [
          "Subscapularis",
          "Supraspinatus",
          "Infraspinatus",
          "Teres minor"
        ],
        correctAnswer: "Supraspinatus",
        explanation: "The supraspinatus is the most commonly torn rotator cuff muscle and is assessed with the empty-can (Jobe) test, which provokes pain or weakness when injured.",
        category: "Orthopedics",
        difficulty: 1
      },
      {
        question: "A patient with nocturnal hand numbness and a positive Phalen's test has compression of which nerve?",
        options: [
          "Ulnar nerve",
          "Median nerve",
          "Radial nerve",
          "Axillary nerve"
        ],
        correctAnswer: "Median nerve",
        explanation: "Carpal tunnel syndrome results from median nerve compression at the wrist, producing numbness in the thumb, index, middle, and radial half of the ring finger with a positive Phalen's/Tinel's sign.",
        category: "Orthopedics",
        difficulty: 1
      },
      {
        question: "Viscerosomatic reflexes occur because visceral and somatic afferents converge at which location?",
        options: [
          "The dorsal horn of the spinal cord",
          "The neuromuscular junction",
          "The cerebellum",
          "The sympathetic chain ganglia only"
        ],
        correctAnswer: "The dorsal horn of the spinal cord",
        explanation: "Visceral and somatic afferent fibers converge in the dorsal horn at the same spinal segment, so visceral dysfunction can produce palpable somatic changes (viscerosomatic reflex).",
        category: "Osteopathic Principles",
        difficulty: 2
      },
      {
        question: "When applying muscle energy technique, how does the patient engage against the physician's counterforce?",
        options: [
          "An isotonic contraction toward the restrictive barrier",
          "An isometric contraction away from the restrictive barrier",
          "A maximal eccentric contraction",
          "Complete relaxation throughout"
        ],
        correctAnswer: "An isometric contraction away from the restrictive barrier",
        explanation: "In muscle energy, the patient performs a gentle isometric contraction away from the restrictive barrier against the physician's counterforce; the barrier is re-engaged after post-isometric relaxation.",
        category: "OMT",
        difficulty: 2
      },
      {
        question: "A high-velocity, low-amplitude (HVLA) thrust is contraindicated in which situation?",
        options: [
          "Acute somatic dysfunction in a healthy adult",
          "Vertebral metastatic disease or severe osteoporosis",
          "Mild thoracic restriction",
          "Chronic muscular tension"
        ],
        correctAnswer: "Vertebral metastatic disease or severe osteoporosis",
        explanation: "HVLA is contraindicated where bony integrity is compromised—such as metastatic disease, severe osteoporosis, fracture, or joint instability—due to the risk of injury.",
        category: "OMT",
        difficulty: 2
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
    totalQuestions: 10,
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
      },
      {
        question: "A 32-year-old with low mood, anhedonia, insomnia, and poor concentration for 6 weeks is diagnosed with major depressive disorder. What is the recommended first-line pharmacotherapy?",
        options: [
          "Tricyclic antidepressant",
          "Selective serotonin reuptake inhibitor",
          "Monoamine oxidase inhibitor",
          "Antipsychotic monotherapy"
        ],
        correctAnswer: "Selective serotonin reuptake inhibitor",
        explanation: "SSRIs are first-line for major depressive disorder due to their efficacy and favorable side-effect profile compared with TCAs and MAOIs.",
        category: "Mood Disorders",
        difficulty: 1
      },
      {
        question: "A patient on lithium presents with coarse tremor, ataxia, confusion, and vomiting. What is the most likely cause?",
        options: [
          "Serotonin syndrome",
          "Lithium toxicity",
          "Neuroleptic malignant syndrome",
          "Anticholinergic delirium"
        ],
        correctAnswer: "Lithium toxicity",
        explanation: "Lithium has a narrow therapeutic index; toxicity causes coarse tremor, ataxia, confusion, and GI symptoms. Dehydration, NSAIDs, and thiazides can precipitate it.",
        category: "Psychopharmacology",
        difficulty: 2
      },
      {
        question: "A patient started on an SSRI who also takes tramadol develops agitation, hyperreflexia, clonus, diaphoresis, and hyperthermia. What is the diagnosis?",
        options: [
          "Neuroleptic malignant syndrome",
          "Serotonin syndrome",
          "Malignant hyperthermia",
          "Anticholinergic toxicity"
        ],
        correctAnswer: "Serotonin syndrome",
        explanation: "Serotonin syndrome presents with autonomic instability, neuromuscular hyperactivity (clonus, hyperreflexia), and altered mental status, often from combining serotonergic agents.",
        category: "Psychopharmacology",
        difficulty: 2
      },
      {
        question: "A 22-year-old has a 1-week episode of decreased need for sleep, grandiosity, pressured speech, and risky spending requiring hospitalization. What is the most likely diagnosis?",
        options: [
          "Major depressive disorder",
          "Bipolar I disorder",
          "Cyclothymic disorder",
          "Generalized anxiety disorder"
        ],
        correctAnswer: "Bipolar I disorder",
        explanation: "A distinct manic episode lasting at least 1 week (or requiring hospitalization) with elevated mood and increased goal-directed activity defines bipolar I disorder.",
        category: "Mood Disorders",
        difficulty: 2
      },
      {
        question: "A patient on a high-potency antipsychotic develops high fever, lead-pipe rigidity, autonomic instability, and elevated creatine kinase. What is the diagnosis?",
        options: [
          "Serotonin syndrome",
          "Neuroleptic malignant syndrome",
          "Tardive dyskinesia",
          "Acute dystonia"
        ],
        correctAnswer: "Neuroleptic malignant syndrome",
        explanation: "NMS is a life-threatening reaction to dopamine antagonists characterized by hyperthermia, lead-pipe rigidity, autonomic instability, and markedly elevated CK; treatment includes stopping the agent and supportive care.",
        category: "Psychopharmacology",
        difficulty: 2
      },
      {
        question: "A combat veteran has 4 months of nightmares, flashbacks, hypervigilance, and avoidance of reminders of a traumatic event. What is the most likely diagnosis?",
        options: [
          "Acute stress disorder",
          "Post-traumatic stress disorder",
          "Adjustment disorder",
          "Generalized anxiety disorder"
        ],
        correctAnswer: "Post-traumatic stress disorder",
        explanation: "Re-experiencing, avoidance, hyperarousal, and negative mood persisting beyond one month after a traumatic event indicate PTSD; symptoms under one month suggest acute stress disorder.",
        category: "Anxiety Disorders",
        difficulty: 2
      },
      {
        question: "A patient on long-term antipsychotic therapy develops involuntary lip-smacking and choreoathetoid tongue movements. What is the most likely diagnosis?",
        options: [
          "Acute dystonia",
          "Tardive dyskinesia",
          "Akathisia",
          "Drug-induced parkinsonism"
        ],
        correctAnswer: "Tardive dyskinesia",
        explanation: "Tardive dyskinesia is a late-onset extrapyramidal effect of chronic dopamine-receptor blockade, causing repetitive involuntary orofacial movements; it may be irreversible.",
        category: "Psychopharmacology",
        difficulty: 2
      },
      {
        question: "A 35-year-old reports 8 months of excessive, difficult-to-control worry across multiple domains with restlessness, fatigue, and muscle tension. What is the first-line long-term treatment?",
        options: [
          "Long-term benzodiazepine",
          "SSRI or SNRI",
          "Beta-blocker monotherapy",
          "Antipsychotic"
        ],
        correctAnswer: "SSRI or SNRI",
        explanation: "Generalized anxiety disorder is treated long-term with SSRIs or SNRIs plus cognitive behavioral therapy; benzodiazepines are avoided for chronic use due to dependence risk.",
        category: "Anxiety Disorders",
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
    totalQuestions: 10,
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
      },
      {
        question: "A 4-year-old has 6 days of high fever, bilateral nonexudative conjunctivitis, a strawberry tongue, cervical lymphadenopathy, and desquamation of the fingertips. What treatment prevents the major cardiac complication?",
        options: [
          "Oral amoxicillin",
          "Intravenous immunoglobulin and aspirin",
          "Supportive care only",
          "Oral corticosteroids alone"
        ],
        correctAnswer: "Intravenous immunoglobulin and aspirin",
        explanation: "These features are classic for Kawasaki disease. IVIG plus aspirin reduces the risk of coronary artery aneurysms, the major complication.",
        category: "Cardiology",
        difficulty: 2
      },
      {
        question: "A 9-month-old has episodic inconsolable crying with the legs drawn up and 'currant jelly' stools. What is the most likely diagnosis?",
        options: [
          "Pyloric stenosis",
          "Intussusception",
          "Hirschsprung disease",
          "Malrotation with volvulus"
        ],
        correctAnswer: "Intussusception",
        explanation: "Intussusception classically presents in infants with intermittent colicky pain, a sausage-shaped abdominal mass, and currant-jelly stools; air or contrast enema is both diagnostic and therapeutic.",
        category: "Gastroenterology",
        difficulty: 2
      },
      {
        question: "A 4-week-old firstborn male has projectile nonbilious vomiting and a palpable 'olive' in the epigastrium. What metabolic abnormality is expected?",
        options: [
          "Hyperkalemic metabolic acidosis",
          "Hypochloremic, hypokalemic metabolic alkalosis",
          "Anion-gap metabolic acidosis",
          "Respiratory alkalosis"
        ],
        correctAnswer: "Hypochloremic, hypokalemic metabolic alkalosis",
        explanation: "Hypertrophic pyloric stenosis causes loss of gastric HCl from vomiting, producing a hypochloremic, hypokalemic metabolic alkalosis. Ultrasound confirms the diagnosis.",
        category: "Gastroenterology",
        difficulty: 2
      },
      {
        question: "An 18-month-old has a brief generalized tonic-clonic seizure during a viral illness with a fever of 39.5°C and returns to baseline afterward. What is the most appropriate management?",
        options: [
          "Reassurance, fever control, and treat the underlying illness",
          "Start long-term antiepileptic therapy",
          "Obtain an emergent CT head",
          "Perform a lumbar puncture in all cases"
        ],
        correctAnswer: "Reassurance, fever control, and treat the underlying illness",
        explanation: "A simple febrile seizure in a well-appearing child 6 months to 5 years requires reassurance and treatment of the underlying febrile illness; chronic antiepileptics and routine imaging are not indicated.",
        category: "Neurology",
        difficulty: 2
      },
      {
        question: "A 6-month-old has wheezing, tachypnea, and nasal congestion in winter, and testing identifies respiratory syncytial virus. What is the mainstay of treatment?",
        options: [
          "Supportive care with hydration and oxygen as needed",
          "Oral amoxicillin",
          "Systemic corticosteroids",
          "Ribavirin for all patients"
        ],
        correctAnswer: "Supportive care with hydration and oxygen as needed",
        explanation: "RSV bronchiolitis is managed supportively with hydration and supplemental oxygen as needed; bronchodilators, steroids, and antibiotics are not routinely beneficial.",
        category: "Respiratory",
        difficulty: 1
      },
      {
        question: "A 3-year-old has ear pain, fever, and a bulging, erythematous tympanic membrane with impaired mobility. What is the first-line antibiotic for acute otitis media?",
        options: [
          "Azithromycin",
          "High-dose amoxicillin",
          "Ciprofloxacin",
          "Trimethoprim-sulfamethoxazole"
        ],
        correctAnswer: "High-dose amoxicillin",
        explanation: "High-dose amoxicillin is first-line for acute otitis media in children without penicillin allergy or recent beta-lactam exposure; amoxicillin-clavulanate is used for treatment failure.",
        category: "Infectious Disease",
        difficulty: 1
      },
      {
        question: "At a routine visit, a healthy infant can sit without support, transfer objects hand to hand, and babble. Which age does this developmental profile best match?",
        options: [
          "2 months",
          "6 months",
          "12 months",
          "18 months"
        ],
        correctAnswer: "6 months",
        explanation: "Sitting without support, transferring objects between hands, and babbling are typical 6-month milestones, useful for screening developmental progress.",
        category: "Development",
        difficulty: 1
      },
      {
        question: "Which vaccine is given as a series at 2, 4, and 6 months and protects against diphtheria, tetanus, and pertussis?",
        options: [
          "MMR",
          "DTaP",
          "Varicella",
          "Hepatitis A"
        ],
        correctAnswer: "DTaP",
        explanation: "The DTaP series (2, 4, and 6 months with later boosters) protects against diphtheria, tetanus, and pertussis. MMR and varicella are first given around 12-15 months.",
        category: "Immunizations",
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