import type { InsertClinicalDecisionTree } from "@shared/schema";

export const sampleClinicalDecisionTrees: InsertClinicalDecisionTree[] = [
  {
    title: "Chest Pain Emergency Protocol",
    description: "Systematic approach to evaluating acute chest pain in the emergency department. Critical for ruling out life-threatening conditions.",
    specialty: "Emergency Medicine",
    category: "Emergency Protocols",
    difficulty: 2,
    estimatedTime: 8,
    rootNodeId: "chest-pain-start",
    optimalPathLength: 5,
    nodes: [
      {
        id: "chest-pain-start",
        type: "decision",
        title: "Patient presents with chest pain",
        content: "A 55-year-old male presents to the ED with acute onset chest pain that started 30 minutes ago. He appears diaphoretic and anxious. Vital signs: BP 150/90, HR 98, RR 20, O2 sat 96% on room air.",
        options: [
          { text: "Immediately order ECG and chest X-ray", nextNodeId: "ecg-first" },
          { text: "Take detailed history first", nextNodeId: "history-first" },
          { text: "Start IV and give nitroglycerin", nextNodeId: "nitro-first" },
          { text: "Order cardiac enzymes", nextNodeId: "enzymes-first" }
        ]
      },
      {
        id: "ecg-first",
        type: "decision",
        title: "ECG shows ST elevation in leads II, III, aVF",
        content: "The 12-lead ECG reveals ST elevation in the inferior leads (II, III, aVF). The patient continues to have chest pain rated 8/10.",
        additionalInfo: "ST elevation MI requires immediate intervention",
        options: [
          { text: "Activate cath lab for primary PCI", nextNodeId: "stemi-protocol" },
          { text: "Give thrombolytics", nextNodeId: "thrombolytics" },
          { text: "Continue with standard workup", nextNodeId: "continue-workup" }
        ]
      },
      {
        id: "stemi-protocol",
        type: "outcome",
        title: "Optimal Management - Primary PCI",
        content: "Excellent decision! You correctly identified STEMI and activated the cath lab. Primary PCI within 90 minutes is the gold standard for STEMI treatment.",
        explanation: "Door-to-balloon time <90 minutes significantly improves outcomes in STEMI patients. Your rapid recognition and appropriate activation of the cath lab follows evidence-based guidelines.",
        isOptimal: true
      },
      {
        id: "history-first",
        type: "decision",
        title: "History reveals crushing substernal pain",
        content: "The patient describes crushing substernal chest pain radiating to the left arm, associated with nausea and diaphoresis. Pain started suddenly while at rest. No recent trauma or cough.",
        options: [
          { text: "Now order ECG immediately", nextNodeId: "delayed-ecg" },
          { text: "Continue with physical exam", nextNodeId: "physical-exam" }
        ]
      },
      {
        id: "delayed-ecg",
        type: "decision",
        title: "ECG shows ST elevation (delayed)",
        content: "The ECG shows the same ST elevation pattern, but valuable time has been lost. The patient's pain persists and he's becoming more diaphoretic.",
        options: [
          { text: "Activate cath lab for primary PCI", nextNodeId: "delayed-pci" },
          { text: "Give thrombolytics", nextNodeId: "thrombolytics" }
        ]
      },
      {
        id: "delayed-pci",
        type: "outcome",
        title: "Suboptimal - Delayed Recognition",
        content: "You eventually reached the correct diagnosis and treatment, but the delay in obtaining the ECG may have compromised outcomes.",
        explanation: "While PCI was the right choice, the initial delay in ECG acquisition is concerning. In chest pain evaluation, ECG should be obtained within 10 minutes of arrival.",
        isOptimal: false
      },
      {
        id: "nitro-first",
        type: "outcome",
        title: "Dangerous - Medication Before Diagnosis",
        content: "Giving nitroglycerin before obtaining an ECG is dangerous. The patient could have inferior MI with RV involvement, where nitro could cause severe hypotension.",
        explanation: "Always obtain ECG before giving nitrates in chest pain. Nitrates are contraindicated in inferior MI with RV involvement and severe aortic stenosis.",
        isOptimal: false
      },
      {
        id: "thrombolytics",
        type: "outcome",
        title: "Acceptable Alternative",
        content: "Thrombolytic therapy is appropriate when primary PCI is not available within 120 minutes. However, PCI is preferred when available.",
        explanation: "Thrombolytics are indicated for STEMI when PCI cannot be performed within recommended time frames. Consider patient factors and contraindications.",
        isOptimal: false
      },
      {
        id: "enzymes-first",
        type: "outcome",
        title: "Suboptimal - Enzymes Before ECG",
        content: "Ordering cardiac enzymes before obtaining an ECG delays the single most time-sensitive test in chest pain evaluation. Troponin can be normal in the first hours of an evolving STEMI.",
        explanation: "An ECG should be obtained and interpreted within 10 minutes of arrival for any patient with chest pain. Cardiac biomarkers complement, but never replace, the initial ECG.",
        isOptimal: false
      },
      {
        id: "continue-workup",
        type: "outcome",
        title: "Dangerous - Delaying Reperfusion",
        content: "Continuing a standard workup after identifying ST elevation wastes critical time. This patient has a STEMI and needs immediate reperfusion.",
        explanation: "Once STEMI is identified, the priority shifts entirely to reperfusion (primary PCI or thrombolytics). Additional testing should not delay activation of the cath lab.",
        isOptimal: false
      },
      {
        id: "physical-exam",
        type: "decision",
        title: "Focused cardiovascular exam completed",
        content: "Exam reveals diaphoresis, an S4 gallop, and clear lungs. There are no murmurs or signs of aortic dissection. The patient still has not had an ECG and pain persists at 8/10.",
        additionalInfo: "Time from arrival is now approaching 15 minutes without an ECG",
        options: [
          { text: "Obtain 12-lead ECG immediately", nextNodeId: "delayed-ecg" },
          { text: "Give nitroglycerin for ongoing pain", nextNodeId: "nitro-first" }
        ]
      }
    ],
    tags: ["chest pain", "STEMI", "emergency", "cardiology", "ECG"],
    learningObjectives: [
      "Rapid recognition of STEMI",
      "Appropriate use of emergency cardiac protocols",
      "Understanding time-sensitive interventions",
      "ECG interpretation in acute settings"
    ]
  },
  {
    title: "Pediatric Fever Management",
    description: "Evidence-based approach to evaluating fever in children aged 0-36 months. Critical for identifying serious bacterial infections.",
    specialty: "Pediatrics",
    category: "Diagnosis",
    difficulty: 2,
    estimatedTime: 6,
    rootNodeId: "fever-start",
    optimalPathLength: 4,
    nodes: [
      {
        id: "fever-start",
        type: "decision",
        title: "2-month-old infant with fever",
        content: "A 2-month-old infant presents with fever of 38.5°C (101.3°F) for 6 hours. The infant appears fussy but is feeding. No obvious source of infection on initial examination.",
        options: [
          { text: "Full sepsis workup (blood, urine, CSF)", nextNodeId: "full-workup" },
          { text: "Blood and urine cultures only", nextNodeId: "partial-workup" },
          { text: "Observe and discharge with follow-up", nextNodeId: "discharge" },
          { text: "Give acetaminophen and reassess", nextNodeId: "symptomatic" }
        ]
      },
      {
        id: "full-workup",
        type: "decision",
        title: "Sepsis workup results pending",
        content: "You've obtained blood culture, urine culture via catheterization, and lumbar puncture. CBC shows mild leukocytosis (WBC 15,000). Urinalysis is normal. CSF appears clear.",
        options: [
          { text: "Admit and start empiric antibiotics", nextNodeId: "admit-antibiotics" },
          { text: "Discharge home with close follow-up", nextNodeId: "discharge-followup" }
        ]
      },
      {
        id: "admit-antibiotics",
        type: "outcome",
        title: "Optimal Management",
        content: "Excellent decision! Febrile infants <3 months require full sepsis evaluation and empiric antibiotic therapy pending culture results.",
        explanation: "Infants <3 months are at high risk for serious bacterial infections due to immature immune systems. Current guidelines recommend full workup and hospitalization with empiric antibiotics.",
        isOptimal: true
      },
      {
        id: "partial-workup",
        type: "outcome",
        title: "Incomplete Evaluation",
        content: "While blood and urine cultures are important, lumbar puncture is also indicated in febrile infants <3 months to rule out meningitis.",
        explanation: "The Rochester criteria emphasize that infants <60 days need full evaluation including CSF analysis. Missing meningitis could be life-threatening.",
        isOptimal: false
      },
      {
        id: "discharge",
        type: "outcome",
        title: "Dangerous - Inadequate Workup",
        content: "Discharging a febrile 2-month-old without any workup is dangerous. This age group has a significant risk of serious bacterial infection.",
        explanation: "Fever in infants <3 months requires thorough evaluation. The risk of serious bacterial infection is approximately 10-15% in this age group.",
        isOptimal: false
      },
      {
        id: "symptomatic",
        type: "outcome",
        title: "Dangerous - Treating Fever Without Evaluation",
        content: "Giving acetaminophen and simply reassessing is unsafe in a 2-month-old. Response of the fever to antipyretics does not distinguish a serious bacterial infection from a benign viral illness.",
        explanation: "Antipyretic response should never be used to risk-stratify febrile young infants. Infants under 3 months require a structured sepsis evaluation regardless of how well they appear after acetaminophen.",
        isOptimal: false
      },
      {
        id: "discharge-followup",
        type: "outcome",
        title: "Suboptimal - Premature Discharge",
        content: "Although cultures were obtained, discharging a febrile infant under 3 months before cultures finalize and without empiric antibiotics risks missing an evolving serious bacterial infection.",
        explanation: "Current guidance favors admission with empiric antibiotics for febrile infants 28-60 days old while cultures incubate. Discharge may be considered only in carefully selected low-risk older infants with reliable follow-up.",
        isOptimal: false
      }
    ],
    tags: ["pediatrics", "fever", "sepsis", "infant", "emergency"],
    learningObjectives: [
      "Recognize high-risk age groups for serious bacterial infection",
      "Apply age-appropriate fever evaluation protocols",
      "Understand when empiric antibiotics are indicated",
      "Use evidence-based guidelines for pediatric fever"
    ]
  },
  {
    title: "Stroke Assessment and Treatment",
    description: "Rapid neurological assessment and treatment decisions for acute stroke patients. Time-critical interventions save brain tissue.",
    specialty: "Neurology",
    category: "Emergency Protocols",
    difficulty: 3,
    estimatedTime: 10,
    rootNodeId: "stroke-start",
    optimalPathLength: 6,
    nodes: [
      {
        id: "stroke-start",
        type: "decision",
        title: "Acute onset neurological symptoms",
        content: "A 68-year-old woman presents with sudden onset left-sided weakness and speech difficulties that started 90 minutes ago. NIHSS score is 12. No history of recent surgery or bleeding.",
        options: [
          { text: "Immediate CT head without contrast", nextNodeId: "ct-head" },
          { text: "MRI brain with DWI", nextNodeId: "mri-brain" },
          { text: "Start heparin anticoagulation", nextNodeId: "heparin" },
          { text: "Detailed neurological examination first", nextNodeId: "neuro-exam" }
        ]
      },
      {
        id: "ct-head",
        type: "decision",
        title: "CT head shows no hemorrhage",
        content: "Non-contrast CT head shows no acute hemorrhage or large vessel occlusion. Early ischemic changes are not clearly visible. Patient remains symptomatic with NIHSS 12.",
        additionalInfo: "Time from symptom onset: 2 hours",
        options: [
          { text: "Administer IV tPA", nextNodeId: "tpa-decision" },
          { text: "Order CT angiography", nextNodeId: "ct-angio" },
          { text: "Admit for observation", nextNodeId: "observation" },
          { text: "Transfer to stroke center", nextNodeId: "transfer" }
        ]
      },
      {
        id: "tpa-decision",
        type: "decision",
        title: "Eligibility for thrombolysis",
        content: "Patient meets criteria for IV tPA: symptom onset <4.5 hours, no contraindications identified, NIHSS >4. Blood pressure is 170/95 mmHg.",
        options: [
          { text: "Give IV tPA immediately", nextNodeId: "tpa-given" },
          { text: "Lower blood pressure first", nextNodeId: "bp-control" },
          { text: "Get more imaging first", nextNodeId: "more-imaging" }
        ]
      },
      {
        id: "tpa-given",
        type: "outcome",
        title: "Optimal - Early Thrombolysis",
        content: "Excellent decision! You administered tPA within the therapeutic window, maximizing the chance of neurological recovery.",
        explanation: "Early thrombolysis (within 4.5 hours) significantly improves outcomes in acute ischemic stroke. Time is brain - every minute counts.",
        isOptimal: true
      },
      {
        id: "ct-angio",
        type: "decision",
        title: "CTA shows M1 occlusion",
        content: "CT angiography reveals left M1 segment occlusion. This is a large vessel occlusion that may benefit from mechanical thrombectomy.",
        options: [
          { text: "tPA plus mechanical thrombectomy", nextNodeId: "dual-therapy" },
          { text: "Mechanical thrombectomy only", nextNodeId: "thrombectomy-only" }
        ]
      },
      {
        id: "dual-therapy",
        type: "outcome",
        title: "Optimal - Combined Therapy",
        content: "Perfect approach! For large vessel occlusions, IV tPA followed by mechanical thrombectomy provides the best outcomes.",
        explanation: "Current guidelines recommend IV tPA (if eligible) followed by mechanical thrombectomy for large vessel occlusions within 6-24 hours depending on imaging.",
        isOptimal: true
      },
      {
        id: "bp-control",
        type: "outcome",
        title: "Suboptimal - Delayed Treatment",
        content: "While BP management is important, delaying tPA for mild hypertension may worsen outcomes. BP <185/110 is acceptable for tPA.",
        explanation: "Blood pressure should be <185/110 for tPA administration, but 170/95 doesn't require treatment delay. Time to treatment is critical.",
        isOptimal: false
      },
      {
        id: "mri-brain",
        type: "outcome",
        title: "Suboptimal - Delaying with MRI",
        content: "MRI with DWI is highly sensitive for early ischemia, but it is slower and less available than non-contrast CT. In a patient within the thrombolytic window, the delay can cost salvageable brain tissue.",
        explanation: "Non-contrast CT is the recommended first imaging study in acute stroke because it rapidly excludes hemorrhage, allowing timely thrombolysis decisions. MRI is reserved for select diagnostic uncertainty.",
        isOptimal: false
      },
      {
        id: "heparin",
        type: "outcome",
        title: "Dangerous - Anticoagulation Before Imaging",
        content: "Starting heparin before excluding hemorrhage with imaging could be catastrophic if this is a hemorrhagic stroke.",
        explanation: "Anticoagulation is contraindicated before imaging in acute stroke and is not part of standard reperfusion therapy. Always exclude hemorrhage first.",
        isOptimal: false
      },
      {
        id: "neuro-exam",
        type: "decision",
        title: "Detailed neurological exam completed",
        content: "Your exam confirms left hemiparesis, left facial droop, and expressive aphasia consistent with an NIHSS of 12. Valuable minutes have passed and the patient still needs imaging.",
        additionalInfo: "A detailed exam is useful but should not delay imaging in suspected acute stroke",
        options: [
          { text: "Obtain non-contrast CT head now", nextNodeId: "ct-head" },
          { text: "Proceed directly to MRI", nextNodeId: "mri-brain" }
        ]
      },
      {
        id: "observation",
        type: "outcome",
        title: "Dangerous - Missed Treatment Window",
        content: "Admitting for observation forgoes reperfusion therapy in a patient who is within the thrombolytic window with a disabling deficit.",
        explanation: "Eligible patients should receive IV thrombolysis without delay. Observation alone abandons a time-critical opportunity to restore perfusion.",
        isOptimal: false
      },
      {
        id: "transfer",
        type: "outcome",
        title: "Acceptable - Transfer for Higher Level of Care",
        content: "Transferring to a comprehensive stroke center is reasonable when thrombectomy capability is unavailable, but thrombolysis should be given before or during transfer if the patient is eligible ('drip and ship').",
        explanation: "When a large vessel occlusion is suspected and local thrombectomy is unavailable, rapid transfer is appropriate—ideally after initiating IV tPA in eligible patients to avoid losing the treatment window.",
        isOptimal: false
      },
      {
        id: "more-imaging",
        type: "outcome",
        title: "Suboptimal - Unnecessary Delay",
        content: "Obtaining additional imaging when the patient already meets tPA criteria delays definitive treatment without adding actionable information.",
        explanation: "Once hemorrhage is excluded and eligibility criteria are met, additional imaging should not delay thrombolysis. Time is brain.",
        isOptimal: false
      },
      {
        id: "thrombectomy-only",
        type: "outcome",
        title: "Acceptable - Thrombectomy Without tPA",
        content: "Mechanical thrombectomy alone is appropriate when the patient is ineligible for IV tPA (e.g., outside the window or with contraindications) but has a large vessel occlusion.",
        explanation: "For eligible patients, IV tPA followed by thrombectomy yields the best outcomes, but thrombectomy alone is the right choice when thrombolysis is contraindicated.",
        isOptimal: false
      }
    ],
    tags: ["stroke", "neurology", "tPA", "thrombectomy", "emergency"],
    learningObjectives: [
      "Rapid stroke assessment and triage",
      "Thrombolysis eligibility criteria",
      "Large vessel occlusion recognition",
      "Time-sensitive stroke interventions"
    ]
  },
  {
    title: "Sepsis Recognition and Management",
    description: "Early identification and management of sepsis using evidence-based protocols. Rapid intervention improves survival.",
    specialty: "Internal Medicine",
    category: "Emergency Protocols",
    difficulty: 3,
    estimatedTime: 12,
    rootNodeId: "sepsis-start",
    optimalPathLength: 7,
    nodes: [
      {
        id: "sepsis-start",
        type: "decision",
        title: "Patient with possible infection",
        content: "A 72-year-old diabetic man presents with confusion, hypotension (BP 85/50), tachycardia (HR 115), and fever (39.2°C). Family reports 2 days of increasing lethargy.",
        options: [
          { text: "Calculate qSOFA score", nextNodeId: "qsofa" },
          { text: "Order blood cultures immediately", nextNodeId: "cultures" },
          { text: "Start IV fluids", nextNodeId: "fluids" },
          { text: "Comprehensive history and exam", nextNodeId: "history" }
        ]
      },
      {
        id: "qsofa",
        type: "decision",
        title: "qSOFA score is 3",
        content: "qSOFA criteria: Altered mentation (1), SBP ≤100 (1), RR ≥22 (1). Score of ≥2 suggests sepsis. This patient has a score of 3.",
        additionalInfo: "High qSOFA score indicates poor prognosis",
        options: [
          { text: "Implement sepsis bundle immediately", nextNodeId: "sepsis-bundle" },
          { text: "Get additional labs first", nextNodeId: "more-labs" },
          { text: "Consult ICU", nextNodeId: "icu-consult" }
        ]
      },
      {
        id: "sepsis-bundle",
        type: "decision",
        title: "Sepsis-3 hour bundle initiated",
        content: "You've started: 1) Blood cultures, 2) Lactate level, 3) 30mL/kg IV crystalloids, 4) Empiric antibiotics. Lactate is 4.2 mmol/L (elevated).",
        options: [
          { text: "Continue with vasopressors", nextNodeId: "vasopressors" },
          { text: "Give more fluids first", nextNodeId: "more-fluids" },
          { text: "Repeat lactate in 2 hours", nextNodeId: "repeat-lactate" }
        ]
      },
      {
        id: "vasopressors",
        type: "decision",
        title: "Norepinephrine started",
        content: "Despite 30mL/kg fluid resuscitation, BP remains 80/45. Norepinephrine drip started with goal MAP >65 mmHg. Patient shows signs of improvement.",
        options: [
          { text: "Target MAP 65-70 mmHg", nextNodeId: "optimal-map" },
          { text: "Target MAP >80 mmHg", nextNodeId: "high-map" },
          { text: "Add dobutamine", nextNodeId: "dobutamine" }
        ]
      },
      {
        id: "optimal-map",
        type: "outcome",
        title: "Optimal Sepsis Management",
        content: "Excellent sepsis management! You followed evidence-based protocols with timely recognition, appropriate bundles, and goal-directed therapy.",
        explanation: "Surviving Sepsis Campaign guidelines emphasize early recognition, timely antibiotics, adequate fluid resuscitation, and appropriate vasopressor use with MAP target of 65 mmHg.",
        isOptimal: true
      },
      {
        id: "cultures",
        type: "decision",
        title: "Blood cultures obtained",
        content: "Blood cultures drawn from two separate sites. What's your next priority in this unstable patient?",
        options: [
          { text: "Start empiric antibiotics", nextNodeId: "antibiotics" },
          { text: "Fluid resuscitation", nextNodeId: "fluids-after-cultures" }
        ]
      },
      {
        id: "antibiotics",
        type: "outcome",
        title: "Good Decision - Early Antibiotics",
        content: "Starting empiric antibiotics within 1 hour of sepsis recognition is crucial. This was a good priority, but don't forget fluid resuscitation.",
        explanation: "Each hour delay in appropriate antibiotic therapy increases mortality by approximately 7.6%. Early antibiotics are a key component of sepsis management.",
        isOptimal: false
      },
      {
        id: "fluids",
        type: "decision",
        title: "IV fluid resuscitation started",
        content: "You begin 30 mL/kg of balanced crystalloid for the hypotensive patient. While fluids are essential, you have not yet obtained cultures or started antibiotics.",
        additionalInfo: "Cultures should ideally be drawn before antibiotics when this does not delay therapy",
        options: [
          { text: "Draw cultures and start empiric antibiotics", nextNodeId: "sepsis-bundle" },
          { text: "Reassess after fluids before any antibiotics", nextNodeId: "more-fluids" }
        ]
      },
      {
        id: "history",
        type: "outcome",
        title: "Suboptimal - Delaying Resuscitation",
        content: "A comprehensive history and exam are valuable, but in a hypotensive, confused, febrile patient they should not delay sepsis recognition and the time-critical bundle.",
        explanation: "In suspected septic shock, assessment and resuscitation must proceed in parallel. Spending excessive time on history before cultures, fluids, and antibiotics increases mortality.",
        isOptimal: false
      },
      {
        id: "more-labs",
        type: "outcome",
        title: "Suboptimal - Over-testing Before Treatment",
        content: "Waiting for additional labs before initiating the sepsis bundle delays antibiotics and fluids, both of which improve survival when started early.",
        explanation: "A high qSOFA with shock warrants immediate bundle implementation. Additional labs can be sent concurrently but must not delay antibiotics or resuscitation.",
        isOptimal: false
      },
      {
        id: "icu-consult",
        type: "decision",
        title: "ICU team consulted",
        content: "The ICU team is contacted for this patient in septic shock. While awaiting bedside evaluation, the patient remains hypotensive and needs immediate intervention.",
        options: [
          { text: "Begin the sepsis bundle now while awaiting ICU", nextNodeId: "sepsis-bundle" },
          { text: "Wait for ICU before acting", nextNodeId: "more-labs" }
        ]
      },
      {
        id: "more-fluids",
        type: "decision",
        title: "Additional fluids given; persistent hypotension",
        content: "After repeated boluses the patient has received more than adequate volume but remains hypotensive with a MAP of 55 mmHg and a lactate that has not cleared.",
        additionalInfo: "Fluid-refractory hypotension defines the need for vasopressors",
        options: [
          { text: "Start norepinephrine", nextNodeId: "vasopressors" },
          { text: "Continue giving more fluids", nextNodeId: "repeat-lactate" }
        ]
      },
      {
        id: "repeat-lactate",
        type: "outcome",
        title: "Suboptimal - Delayed Vasopressors",
        content: "Repeating the lactate without addressing fluid-refractory hypotension delays the vasopressor support needed to restore perfusion.",
        explanation: "Lactate trends are useful for monitoring resuscitation, but persistent hypotension after adequate fluids requires vasopressors rather than continued observation.",
        isOptimal: false
      },
      {
        id: "high-map",
        type: "outcome",
        title: "Suboptimal - Excessive MAP Target",
        content: "Targeting a MAP above 80 mmHg with escalating vasopressors offers no proven benefit and increases the risk of arrhythmias and ischemia.",
        explanation: "The Surviving Sepsis Campaign recommends an initial MAP target of 65 mmHg. Higher targets have not improved outcomes and may cause harm in most patients.",
        isOptimal: false
      },
      {
        id: "dobutamine",
        type: "outcome",
        title: "Context-Dependent - Inotrope Use",
        content: "Adding dobutamine is appropriate only when there is evidence of persistent hypoperfusion despite adequate fluids and vasopressors, such as sepsis-induced myocardial dysfunction.",
        explanation: "Dobutamine is reserved for septic patients with myocardial dysfunction or ongoing hypoperfusion after an adequate MAP is achieved. It is not a routine first step in vasopressor titration.",
        isOptimal: false
      },
      {
        id: "fluids-after-cultures",
        type: "outcome",
        title: "Good Decision - Cultures Then Resuscitation",
        content: "After drawing cultures you prioritize fluid resuscitation, which is appropriate, but remember that empiric antibiotics must follow promptly within the first hour.",
        explanation: "Early fluids and antibiotics are both core elements of the sepsis bundle. Cultures before antibiotics are ideal, but antibiotics should not be delayed beyond one hour.",
        isOptimal: false
      }
    ],
    tags: ["sepsis", "infection", "shock", "antibiotics", "qSOFA"],
    learningObjectives: [
      "Early sepsis recognition using qSOFA",
      "Implementation of sepsis bundles",
      "Appropriate fluid resuscitation",
      "Vasopressor therapy goals"
    ]
  }
];

export class ClinicalDecisionTreeService {
  static async initializeTrees() {
    try {
      const { storage } = await import("../storage");
      
      // Check if trees already exist
      const existingTrees = await storage.getClinicalDecisionTrees();
      if (existingTrees.length > 0) {
        console.log(`Found ${existingTrees.length} existing clinical decision trees`);
        return;
      }

      // Create sample trees
      console.log('Initializing sample clinical decision trees...');
      for (const treeData of sampleClinicalDecisionTrees) {
        await storage.createClinicalDecisionTree(treeData);
      }
      
      console.log(`Initialized ${sampleClinicalDecisionTrees.length} sample clinical decision trees`);
    } catch (error) {
      console.error('Error initializing clinical decision trees:', error);
    }
  }
}