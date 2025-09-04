import { type PhysicalExamFindings, type DiagnosticTest } from "@shared/schema";

export class ClinicalContentGenerator {
  
  // Generate comprehensive physical exam findings based on case diagnosis and symptoms
  generatePhysicalExam(
    diagnosis: string,
    symptoms: string[],
    age: number,
    gender: string,
    specialty: string
  ): PhysicalExamFindings {
    const isAbnormal = this.shouldHaveAbnormalFindings(diagnosis, symptoms);
    
    return {
      vitals: this.generateVitals(diagnosis, symptoms, age),
      general: this.generateGeneralExam(diagnosis, symptoms, age),
      cardiovascular: this.generateCardiovascularExam(diagnosis, symptoms, specialty),
      pulmonary: this.generatePulmonaryExam(diagnosis, symptoms, specialty),
      abdominal: this.generateAbdominalExam(diagnosis, symptoms, specialty),
      neurological: this.generateNeurologicalExam(diagnosis, symptoms, specialty),
      musculoskeletal: this.generateMusculoskeletalExam(diagnosis, symptoms, specialty),
      skin: this.generateSkinExam(diagnosis, symptoms, age, gender),
      heent: this.generateHeentExam(diagnosis, symptoms, specialty)
    };
  }

  // Generate available diagnostic tests based on case
  generateDiagnosticTests(
    diagnosis: string,
    symptoms: string[],
    specialty: string,
    age: number,
    gender: string
  ): DiagnosticTest {
    return {
      laboratory: this.generateLabTests(diagnosis, symptoms, specialty, age, gender),
      imaging: this.generateImagingTests(diagnosis, symptoms, specialty, age),
      procedures: this.generateProcedureTests(diagnosis, symptoms, specialty, age)
    };
  }

  private shouldHaveAbnormalFindings(diagnosis: string, symptoms: string[]): boolean {
    const abnormalConditions = [
      'myocardial infarction', 'heart failure', 'pneumonia', 'copd',
      'stroke', 'seizure', 'appendicitis', 'cholecystitis', 'pancreatitis'
    ];
    return abnormalConditions.some(condition => 
      diagnosis.toLowerCase().includes(condition)
    );
  }

  private generateVitals(diagnosis: string, symptoms: string[], age: number) {
    const diagnosisLower = diagnosis.toLowerCase();
    let bp = "120/80";
    let hr = "75";
    let rr = "16";
    let temp = "98.6°F";
    let o2Sat = "98%";

    // Adjust based on diagnosis
    if (diagnosisLower.includes('hypertension') || diagnosisLower.includes('heart')) {
      bp = age > 65 ? "160/95" : "150/90";
      hr = diagnosisLower.includes('tachycardia') ? "105" : "88";
    }
    
    if (diagnosisLower.includes('pneumonia') || diagnosisLower.includes('asthma')) {
      rr = "22";
      o2Sat = "92%";
      temp = "101.2°F";
    }
    
    if (diagnosisLower.includes('sepsis') || diagnosisLower.includes('infection')) {
      hr = "110";
      temp = "102.5°F";
      bp = "90/60";
    }

    return { bloodPressure: bp, heartRate: hr, respiratoryRate: rr, temperature: temp, oxygenSaturation: o2Sat };
  }

  private generateGeneralExam(diagnosis: string, symptoms: string[], age: number) {
    const diagnosisLower = diagnosis.toLowerCase();
    let appearance = "Well-appearing";
    let distress = "No acute distress";
    let mobility = "Ambulatory";

    if (diagnosisLower.includes('pain') || symptoms.includes('pain')) {
      appearance = "Appears uncomfortable";
      distress = "Mild to moderate distress";
    }

    if (diagnosisLower.includes('heart attack') || diagnosisLower.includes('stemi')) {
      appearance = "Diaphoretic, anxious";
      distress = "Moderate to severe distress";
    }

    if (age > 75) {
      mobility = "Ambulates with assistance";
    }

    return { appearance, distress, mobility };
  }

  private generateCardiovascularExam(diagnosis: string, symptoms: string[], specialty: string) {
    const diagnosisLower = diagnosis.toLowerCase();
    
    let heartSounds = "S1 S2 present, regular rate and rhythm";
    let murmurs = "No murmurs appreciated";
    let pulses = "2+ pulses in all extremities";
    let edema = "No peripheral edema";
    let jugularVeinDistension = "JVD not appreciated";

    if (specialty === "Cardiology" || diagnosisLower.includes('heart')) {
      if (diagnosisLower.includes('failure')) {
        heartSounds = "S1 S2 present, S3 gallop appreciated";
        edema = "2+ pitting edema bilateral lower extremities";
        jugularVeinDistension = "JVD to 8 cm";
      }
      
      if (diagnosisLower.includes('valve') || diagnosisLower.includes('stenosis')) {
        murmurs = "3/6 systolic murmur heard best at apex";
      }
      
      if (diagnosisLower.includes('infarction') || diagnosisLower.includes('angina')) {
        heartSounds = "S1 S2 present, no S3/S4";
      }
    }

    return { heartSounds, murmurs, pulses, edema, jugularVeinDistension };
  }

  private generatePulmonaryExam(diagnosis: string, symptoms: string[], specialty: string) {
    let inspection = "Chest wall symmetric, no use of accessory muscles";
    let palpation = "No tenderness, tactile fremitus equal bilaterally";
    let percussion = "Resonant throughout";
    let auscultation = "Clear breath sounds bilaterally";

    const diagnosisLower = diagnosis.toLowerCase();

    if (specialty === "Pulmonology" || diagnosisLower.includes('lung') || diagnosisLower.includes('pneumonia')) {
      if (diagnosisLower.includes('pneumonia')) {
        palpation = "Increased tactile fremitus right lower lobe";
        percussion = "Dullness right lower lobe";
        auscultation = "Crackles right lower lobe, diminished breath sounds";
      }
      
      if (diagnosisLower.includes('asthma') || diagnosisLower.includes('copd')) {
        inspection = "Use of accessory muscles, prolonged expiratory phase";
        auscultation = "Expiratory wheeze bilaterally, decreased air movement";
      }
      
      if (diagnosisLower.includes('effusion')) {
        percussion = "Stony dullness right base";
        auscultation = "Absent breath sounds right base";
      }
    }

    return { inspection, palpation, percussion, auscultation };
  }

  private generateAbdominalExam(diagnosis: string, symptoms: string[], specialty: string) {
    let inspection = "Soft, non-distended";
    let palpation = "Non-tender, no masses";
    let percussion = "Tympanic throughout";
    let auscultation = "Normal bowel sounds";
    let organomegaly = "No hepatosplenomegaly";

    const diagnosisLower = diagnosis.toLowerCase();

    if (specialty === "Gastroenterology" || diagnosisLower.includes('abdom') || diagnosisLower.includes('appendix')) {
      if (diagnosisLower.includes('appendicitis')) {
        palpation = "RLQ tenderness, positive McBurney's point, guarding";
        inspection = "Guarding, patient prefers to lie still";
      }
      
      if (diagnosisLower.includes('cholecystitis') || diagnosisLower.includes('gallbladder')) {
        palpation = "RUQ tenderness, positive Murphy's sign";
      }
      
      if (diagnosisLower.includes('hepatitis') || diagnosisLower.includes('liver')) {
        organomegaly = "Hepatomegaly 2 cm below costal margin";
        palpation = "RUQ tenderness";
      }
      
      if (diagnosisLower.includes('bowel obstruction')) {
        inspection = "Distended";
        auscultation = "High-pitched bowel sounds";
      }
    }

    return { inspection, palpation, percussion, auscultation, organomegaly };
  }

  private generateNeurologicalExam(diagnosis: string, symptoms: string[], specialty: string) {
    let mentalStatus = "Alert and oriented x 3";
    let cranialNerves = "CN II-XII grossly intact";
    let motor = "5/5 strength all extremities";
    let sensory = "Intact to light touch and vibration";
    let reflexes = "2+ DTRs throughout";
    let coordination = "Finger-to-nose and heel-to-shin intact";

    const diagnosisLower = diagnosis.toLowerCase();

    if (specialty === "Neurology" || diagnosisLower.includes('neuro') || diagnosisLower.includes('stroke')) {
      if (diagnosisLower.includes('stroke') || diagnosisLower.includes('cva')) {
        motor = "4/5 left upper and lower extremity weakness";
        reflexes = "Hyperreflexia left side, upgoing Babinski left";
        sensory = "Decreased sensation left side";
      }
      
      if (diagnosisLower.includes('seizure') || diagnosisLower.includes('epilepsy')) {
        mentalStatus = "Post-ictal confusion, oriented x 2";
      }
      
      if (diagnosisLower.includes('migraine') || diagnosisLower.includes('headache')) {
        cranialNerves = "Photophobia present, otherwise CN II-XII intact";
        mentalStatus = "Alert but uncomfortable due to pain";
      }
      
      if (diagnosisLower.includes('parkinson')) {
        motor = "Rigidity and bradykinesia present";
        coordination = "Resting tremor, impaired fine motor control";
      }
    }

    return { mentalStatus, cranialNerves, motor, sensory, reflexes, coordination };
  }

  private generateMusculoskeletalExam(diagnosis: string, symptoms: string[], specialty: string) {
    let inspection = "No deformities or swelling";
    let palpation = "No tenderness";
    let rangeOfMotion = "Full ROM all joints";
    let strength = "5/5 strength all muscle groups";

    const diagnosisLower = diagnosis.toLowerCase();

    if (specialty === "Orthopedics" || diagnosisLower.includes('fracture') || diagnosisLower.includes('arthritis')) {
      if (diagnosisLower.includes('fracture')) {
        inspection = "Swelling and deformity noted";
        palpation = "Point tenderness over fracture site";
        rangeOfMotion = "Limited due to pain and swelling";
      }
      
      if (diagnosisLower.includes('arthritis')) {
        inspection = "Joint swelling and erythema";
        palpation = "Warmth and tenderness over affected joints";
        rangeOfMotion = "Decreased ROM due to stiffness";
      }
    }

    return { inspection, palpation, rangeOfMotion, strength };
  }

  private generateSkinExam(diagnosis: string, symptoms: string[], age: number, gender: string) {
    let color = "Normal pigmentation";
    let texture = "Smooth and supple";
    let lesions = "No concerning lesions";
    let rashes = "No rashes";

    const diagnosisLower = diagnosis.toLowerCase();

    if (diagnosisLower.includes('cellulitis') || diagnosisLower.includes('infection')) {
      color = "Erythema and warmth over affected area";
      texture = "Swollen and tender";
    }
    
    if (diagnosisLower.includes('rash') || diagnosisLower.includes('dermatitis')) {
      rashes = "Erythematous, pruritic rash in distribution pattern";
    }
    
    if (age > 65) {
      texture = "Thin skin with decreased elasticity";
    }

    return { color, texture, lesions, rashes };
  }

  private generateHeentExam(diagnosis: string, symptoms: string[], specialty: string) {
    let head = "Normocephalic, atraumatic";
    let eyes = "PERRLA, EOMI, no conjunctival injection";
    let ears = "TMs clear bilaterally";
    let nose = "No nasal discharge or congestion";
    let throat = "Oropharynx clear, no erythema";

    const diagnosisLower = diagnosis.toLowerCase();

    if (diagnosisLower.includes('sinus') || diagnosisLower.includes('rhinitis')) {
      nose = "Mucosal swelling and clear discharge";
    }
    
    if (diagnosisLower.includes('conjunctivitis')) {
      eyes = "Conjunctival injection and discharge";
    }
    
    if (diagnosisLower.includes('pharyngitis') || diagnosisLower.includes('strep')) {
      throat = "Erythematous oropharynx with exudate";
    }

    return { head, eyes, ears, nose, throat };
  }

  private generateLabTests(diagnosis: string, symptoms: string[], specialty: string, age: number, gender: string) {
    const tests = [];
    const diagnosisLower = diagnosis.toLowerCase();

    // Basic Metabolic Panel - Universal
    tests.push({
      name: "Basic Metabolic Panel",
      category: "Chemistry",
      indication: "Baseline electrolytes and kidney function",
      normalRange: "Sodium 136-145 mEq/L, Potassium 3.5-5.0 mEq/L, Chloride 98-107 mEq/L, BUN 7-20 mg/dL, Creatinine 0.6-1.2 mg/dL",
      result: this.generateLabResult("BMP", diagnosisLower),
      abnormal: this.isLabAbnormal("BMP", diagnosisLower),
      interpretation: this.getLabInterpretation("BMP", diagnosisLower)
    });

    // Complete Blood Count - Universal
    tests.push({
      name: "Complete Blood Count",
      category: "Hematology",
      indication: "Evaluate for infection, anemia, bleeding",
      normalRange: "WBC 4.5-11.0 K/μL, Hgb 12-16 g/dL, Hct 36-46%, Platelets 150-400 K/μL",
      result: this.generateLabResult("CBC", diagnosisLower),
      abnormal: this.isLabAbnormal("CBC", diagnosisLower),
      interpretation: this.getLabInterpretation("CBC", diagnosisLower)
    });

    // Cardiology-specific tests
    if (specialty === "Cardiology" || diagnosisLower.includes('heart') || diagnosisLower.includes('cardiac')) {
      tests.push({
        name: "Troponin I",
        category: "Cardiac Markers",
        indication: "Evaluate for myocardial injury",
        normalRange: "< 0.04 ng/mL",
        result: diagnosisLower.includes('infarction') ? "2.5 ng/mL" : "< 0.04 ng/mL",
        abnormal: diagnosisLower.includes('infarction'),
        interpretation: diagnosisLower.includes('infarction') ? "Elevated - consistent with myocardial injury" : "Normal - no evidence of myocardial injury"
      });

      tests.push({
        name: "BNP",
        category: "Cardiac Markers",
        indication: "Evaluate for heart failure",
        normalRange: "< 100 pg/mL",
        result: diagnosisLower.includes('failure') ? "450 pg/mL" : "65 pg/mL",
        abnormal: diagnosisLower.includes('failure'),
        interpretation: diagnosisLower.includes('failure') ? "Elevated - consistent with heart failure" : "Normal - heart failure unlikely"
      });

      tests.push({
        name: "Lipid Panel",
        category: "Chemistry",
        indication: "Cardiovascular risk assessment",
        normalRange: "Total cholesterol < 200 mg/dL, LDL < 100 mg/dL, HDL > 40 mg/dL",
        result: "Total 240 mg/dL, LDL 160 mg/dL, HDL 35 mg/dL, TG 180 mg/dL",
        abnormal: true,
        interpretation: "Elevated total cholesterol and LDL, low HDL - increased cardiovascular risk"
      });
    }

    // Add more specialty-specific tests
    if (diagnosisLower.includes('diabetes') || age > 45) {
      tests.push({
        name: "Hemoglobin A1c",
        category: "Chemistry",
        indication: "Diabetes screening/monitoring",
        normalRange: "< 5.7%",
        result: diagnosisLower.includes('diabetes') ? "8.5%" : "5.2%",
        abnormal: diagnosisLower.includes('diabetes'),
        interpretation: diagnosisLower.includes('diabetes') ? "Elevated - poor glycemic control" : "Normal - no diabetes"
      });
    }

    return tests.slice(0, 8); // Limit to 8 most relevant tests
  }

  private generateImagingTests(diagnosis: string, symptoms: string[], specialty: string, age: number) {
    const tests = [];
    const diagnosisLower = diagnosis.toLowerCase();

    // Chest X-ray - Common
    if (diagnosisLower.includes('chest') || diagnosisLower.includes('heart') || diagnosisLower.includes('lung')) {
      tests.push({
        name: "Chest X-ray",
        type: "Plain Radiograph",
        indication: "Evaluate chest pain, shortness of breath",
        findings: this.generateImagingFindings("chest-xray", diagnosisLower),
        impression: this.generateImagingImpression("chest-xray", diagnosisLower),
        abnormal: this.isImagingAbnormal("chest-xray", diagnosisLower)
      });
    }

    // CT Head - Neurological conditions
    if (specialty === "Neurology" || diagnosisLower.includes('head') || diagnosisLower.includes('stroke')) {
      tests.push({
        name: "CT Head without contrast",
        type: "Computed Tomography",
        indication: "Evaluate headache, neurological symptoms",
        findings: this.generateImagingFindings("ct-head", diagnosisLower),
        impression: this.generateImagingImpression("ct-head", diagnosisLower),
        abnormal: this.isImagingAbnormal("ct-head", diagnosisLower)
      });
    }

    // ECG - Cardiac conditions
    if (specialty === "Cardiology" || diagnosisLower.includes('heart') || diagnosisLower.includes('chest pain')) {
      tests.push({
        name: "12-lead Electrocardiogram",
        type: "Electrocardiogram",
        indication: "Evaluate chest pain, arrhythmia",
        findings: this.generateImagingFindings("ecg", diagnosisLower),
        impression: this.generateImagingImpression("ecg", diagnosisLower),
        abnormal: this.isImagingAbnormal("ecg", diagnosisLower)
      });
    }

    return tests;
  }

  private generateProcedureTests(diagnosis: string, symptoms: string[], specialty: string, age: number) {
    const tests = [];
    const diagnosisLower = diagnosis.toLowerCase();

    if (specialty === "Cardiology" && diagnosisLower.includes('heart')) {
      tests.push({
        name: "Echocardiogram",
        type: "Cardiac Procedure",
        indication: "Evaluate cardiac structure and function",
        findings: this.generateProcedureFindings("echo", diagnosisLower),
        complications: "None",
        abnormal: this.isProcedureAbnormal("echo", diagnosisLower)
      });
    }

    return tests;
  }

  // Helper methods for generating specific lab results
  private generateLabResult(testType: string, diagnosis: string): string {
    switch (testType) {
      case "BMP":
        if (diagnosis.includes('kidney')) {
          return "Sodium 142 mEq/L, Potassium 3.8 mEq/L, Chloride 104 mEq/L, BUN 35 mg/dL, Creatinine 2.1 mg/dL";
        }
        return "Sodium 140 mEq/L, Potassium 4.2 mEq/L, Chloride 102 mEq/L, BUN 15 mg/dL, Creatinine 0.9 mg/dL";
      
      case "CBC":
        if (diagnosis.includes('infection')) {
          return "WBC 14.5 K/μL, Hgb 13.2 g/dL, Hct 39%, Platelets 320 K/μL";
        }
        return "WBC 7.2 K/μL, Hgb 14.1 g/dL, Hct 42%, Platelets 250 K/μL";
      
      default:
        return "Within normal limits";
    }
  }

  private isLabAbnormal(testType: string, diagnosis: string): boolean {
    if (testType === "BMP" && diagnosis.includes('kidney')) return true;
    if (testType === "CBC" && diagnosis.includes('infection')) return true;
    return false;
  }

  private getLabInterpretation(testType: string, diagnosis: string): string {
    if (testType === "BMP") {
      if (diagnosis.includes('kidney')) {
        return "Elevated BUN and creatinine consistent with kidney dysfunction";
      }
      return "Normal electrolytes and kidney function";
    }
    if (testType === "CBC") {
      if (diagnosis.includes('infection')) {
        return "Leukocytosis consistent with bacterial infection";
      }
      return "Normal blood counts";
    }
    return "Normal values";
  }

  private generateImagingFindings(imagingType: string, diagnosis: string): string {
    switch (imagingType) {
      case "chest-xray":
        if (diagnosis.includes('pneumonia')) {
          return "Right lower lobe consolidation with air bronchograms";
        }
        if (diagnosis.includes('heart failure')) {
          return "Cardiomegaly with pulmonary vascular congestion";
        }
        return "Clear lung fields, normal cardiac silhouette";
      
      case "ct-head":
        if (diagnosis.includes('stroke')) {
          return "Left middle cerebral artery territory infarct";
        }
        return "No acute intracranial abnormality";
      
      case "ecg":
        if (diagnosis.includes('stemi')) {
          return "ST elevation in leads II, III, aVF consistent with inferior STEMI";
        }
        if (diagnosis.includes('angina')) {
          return "ST depression in lateral leads during chest pain";
        }
        return "Normal sinus rhythm, normal intervals";
      
      default:
        return "No acute findings";
    }
  }

  private generateImagingImpression(imagingType: string, diagnosis: string): string {
    switch (imagingType) {
      case "chest-xray":
        if (diagnosis.includes('pneumonia')) {
          return "Right lower lobe pneumonia";
        }
        if (diagnosis.includes('heart failure')) {
          return "Congestive heart failure";
        }
        return "Normal chest radiograph";
      
      case "ct-head":
        if (diagnosis.includes('stroke')) {
          return "Acute left MCA stroke";
        }
        return "Normal CT head";
      
      case "ecg":
        if (diagnosis.includes('stemi')) {
          return "Inferior ST-elevation myocardial infarction";
        }
        if (diagnosis.includes('angina')) {
          return "Ischemic changes, rule out ACS";
        }
        return "Normal electrocardiogram";
      
      default:
        return "Normal study";
    }
  }

  private isImagingAbnormal(imagingType: string, diagnosis: string): boolean {
    const abnormalConditions = ['pneumonia', 'heart failure', 'stroke', 'stemi', 'angina'];
    return abnormalConditions.some(condition => diagnosis.includes(condition));
  }

  private generateProcedureFindings(procedureType: string, diagnosis: string): string {
    if (procedureType === "echo") {
      if (diagnosis.includes('failure')) {
        return "Left ventricular ejection fraction 35%, global hypokinesis";
      }
      return "Normal left ventricular size and function, EF 60%";
    }
    return "Normal procedure";
  }

  private isProcedureAbnormal(procedureType: string, diagnosis: string): boolean {
    if (procedureType === "echo" && diagnosis.includes('failure')) return true;
    return false;
  }
}

export const clinicalContentGenerator = new ClinicalContentGenerator();