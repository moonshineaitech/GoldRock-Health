import { openAIService } from "./openai";

export interface DifferentialDiagnosis {
  diagnosis: string;
  probability: number;
  supportingFindings: string[];
  opposingFindings: string[];
  nextSteps: string[];
}

export interface ClinicalReasoning {
  chiefComplaint: string;
  keyFindings: string[];
  redFlags: string[];
  differentialDiagnoses: DifferentialDiagnosis[];
  recommendedWorkup: string[];
  clinicalPearls: string[];
}

export interface PhysicalExamFinding {
  system: string;
  finding: string;
  significance: string;
  technique: string;
}

export class DiagnosticEngine {
  /**
   * Generate differential diagnosis based on patient presentation
   */
  async generateDifferentialDiagnosis(
    chiefComplaint: string,
    symptoms: string[],
    physicalExam: any,
    medicalHistory: any
  ): Promise<DifferentialDiagnosis[]> {
    if (!process.env.OPENAI_API_KEY && !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
      return this.getFallbackDifferentials(chiefComplaint, symptoms);
    }

    try {
      const prompt = `Generate a comprehensive differential diagnosis for this patient presentation:

Chief Complaint: ${chiefComplaint}
Symptoms: ${symptoms.join(', ')}
Physical Exam: ${JSON.stringify(physicalExam)}
Medical History: ${JSON.stringify(medicalHistory)}

Provide 4-6 differential diagnoses ranked by probability. For each diagnosis, include:
- Supporting findings from the case
- Opposing findings that make it less likely
- Next diagnostic steps to confirm or rule out

Respond in JSON format:
{
  "differentials": [
    {
      "diagnosis": "Most likely diagnosis",
      "probability": 85,
      "supportingFindings": ["symptom matches pattern", "physical exam finding consistent"],
      "opposingFindings": ["age doesn't fit typical pattern"],
      "nextSteps": ["specific test", "specialist referral"]
    }
  ]
}`;

      const response = await openAIService.openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: "You are an expert clinician generating differential diagnoses for medical education. Be thorough, accurate, and educational."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.differentials || [];
    } catch (error) {
      console.error("Error generating differential diagnosis:", error);
      return this.getFallbackDifferentials(chiefComplaint, symptoms);
    }
  }

  /**
   * Provide clinical reasoning pathway
   */
  async generateClinicalReasoning(
    patientCase: any,
    questionsAsked: string[]
  ): Promise<ClinicalReasoning> {
    if (!process.env.OPENAI_API_KEY) {
      return this.getFallbackReasoning(patientCase);
    }

    try {
      const prompt = `Provide a clinical reasoning analysis for this case:

Patient: ${patientCase.age}-year-old ${patientCase.gender}
Chief Complaint: ${patientCase.chiefComplaint}
Symptoms: ${patientCase.symptoms.join(', ')}
Medical History: ${JSON.stringify(patientCase.medicalHistory)}
Physical Exam: ${JSON.stringify(patientCase.physicalExam)}
Questions Asked: ${questionsAsked.join(', ')}
Correct Diagnosis: ${patientCase.correctDiagnosis}

Provide structured clinical reasoning including:
- Key findings that led to diagnosis
- Red flags that required immediate attention
- Clinical pearls for this condition
- Systematic workup approach

Respond in JSON format:
{
  "keyFindings": ["finding 1", "finding 2"],
  "redFlags": ["red flag 1", "red flag 2"],
  "clinicalPearls": ["pearl 1", "pearl 2"],
  "recommendedWorkup": ["test 1", "test 2"],
  "reasoningPath": "Step-by-step diagnostic reasoning"
}`;

      const response = await openAIService.openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: "You are an expert medical educator providing clinical reasoning guidance for medical students."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        chiefComplaint: patientCase.chiefComplaint,
        keyFindings: result.keyFindings || [],
        redFlags: result.redFlags || [],
        differentialDiagnoses: [], // Would be populated separately
        recommendedWorkup: result.recommendedWorkup || [],
        clinicalPearls: result.clinicalPearls || []
      };
    } catch (error) {
      console.error("Error generating clinical reasoning:", error);
      return this.getFallbackReasoning(patientCase);
    }
  }

  /**
   * Simulate physical examination findings
   */
  async simulatePhysicalExam(
    system: string,
    patientCase: any
  ): Promise<PhysicalExamFinding[]> {
    const examFindings: { [key: string]: PhysicalExamFinding[] } = {
      cardiovascular: [
        {
          system: "Cardiovascular",
          finding: "S1 S2 present, no murmurs",
          significance: "Normal heart sounds rule out valvular disease",
          technique: "Listen with stethoscope at 4 cardiac areas"
        },
        {
          system: "Cardiovascular",
          finding: "Regular rhythm",
          significance: "Rules out arrhythmias",
          technique: "Palpate pulse and listen to heart"
        }
      ],
      pulmonary: [
        {
          system: "Pulmonary",
          finding: "Clear breath sounds bilaterally",
          significance: "No evidence of pneumonia or effusion",
          technique: "Auscultate all lung fields systematically"
        },
        {
          system: "Pulmonary",
          finding: "No wheezes or crackles",
          significance: "Rules out bronchospasm and fluid overload",
          technique: "Listen during deep inspiration and expiration"
        }
      ],
      neurological: [
        {
          system: "Neurological",
          finding: "Alert and oriented x3",
          significance: "Normal mental status",
          technique: "Assess orientation to person, place, time"
        },
        {
          system: "Neurological",
          finding: "Cranial nerves II-XII intact",
          significance: "No focal neurological deficits",
          technique: "Systematic cranial nerve examination"
        }
      ],
      abdominal: [
        {
          system: "Abdominal",
          finding: "Soft, non-tender",
          significance: "No signs of acute abdomen",
          technique: "Light and deep palpation in all 4 quadrants"
        },
        {
          system: "Abdominal",
          finding: "Normal bowel sounds",
          significance: "Normal intestinal function",
          technique: "Auscultate all 4 quadrants for 30 seconds each"
        }
      ]
    };

    return examFindings[system.toLowerCase()] || [
      {
        system: system,
        finding: "Normal examination",
        significance: "No abnormal findings detected",
        technique: "Systematic examination of the system"
      }
    ];
  }

  /**
   * Generate case-specific learning objectives
   */
  async generateLearningObjectives(
    patientCase: any,
    userPerformance: {
      questionsAsked: string[];
      timeElapsed: number;
      accuracy: number;
    }
  ): Promise<string[]> {
    const baseObjectives = patientCase.learningObjectives || [];
    
    // Add personalized objectives based on performance
    const personalizedObjectives: string[] = [];
    
    if (userPerformance.accuracy < 70) {
      personalizedObjectives.push("Review key diagnostic criteria for this condition");
      personalizedObjectives.push("Practice systematic history taking");
    }
    
    if (userPerformance.questionsAsked.length < 5) {
      personalizedObjectives.push("Develop more comprehensive interview skills");
    }
    
    if (userPerformance.timeElapsed > 30) {
      personalizedObjectives.push("Practice efficient diagnostic reasoning");
    }

    // Specialty-specific objectives
    const specialtyObjectives: { [key: string]: string[] } = {
      "Cardiology": [
        "Master cardiac auscultation techniques",
        "Understand ECG interpretation",
        "Recognize signs of heart failure"
      ],
      "Neurology": [
        "Perform systematic neurological examination",
        "Understand stroke assessment protocols",
        "Recognize neurological emergencies"
      ],
      "Emergency Medicine": [
        "Prioritize life-threatening conditions",
        "Practice rapid assessment skills",
        "Understand triage principles"
      ]
    };

    const additionalObjectives = specialtyObjectives[patientCase.specialty] || [];
    
    return [...baseObjectives, ...personalizedObjectives, ...additionalObjectives.slice(0, 2)];
  }

  private getFallbackDifferentials(chiefComplaint: string, symptoms: string[]): DifferentialDiagnosis[] {
    // Simple fallback logic based on common presentations
    const commonDifferentials: { [key: string]: DifferentialDiagnosis[] } = {
      "chest pain": [
        {
          diagnosis: "Coronary Artery Disease",
          probability: 60,
          supportingFindings: ["chest pain", "risk factors"],
          opposingFindings: ["young age"],
          nextSteps: ["ECG", "troponins", "stress test"]
        },
        {
          diagnosis: "Gastroesophageal Reflux",
          probability: 30,
          supportingFindings: ["burning pain", "food relation"],
          opposingFindings: ["exertional symptoms"],
          nextSteps: ["PPI trial", "endoscopy"]
        }
      ]
    };

    // Find matching differentials based on chief complaint
    for (const [key, differentials] of Object.entries(commonDifferentials)) {
      if (chiefComplaint.toLowerCase().includes(key)) {
        return differentials;
      }
    }

    return [
      {
        diagnosis: "Further evaluation needed",
        probability: 50,
        supportingFindings: symptoms,
        opposingFindings: [],
        nextSteps: ["Complete history", "physical examination", "basic labs"]
      }
    ];
  }

  private getFallbackReasoning(patientCase: any): ClinicalReasoning {
    return {
      chiefComplaint: patientCase.chiefComplaint,
      keyFindings: patientCase.symptoms.slice(0, 3),
      redFlags: ["Requires immediate evaluation"],
      differentialDiagnoses: [],
      recommendedWorkup: ["Complete blood count", "Basic metabolic panel", "Imaging as indicated"],
      clinicalPearls: ["Always consider red flag symptoms", "Systematic approach is key"]
    };
  }
}

export const diagnosticEngine = new DiagnosticEngine();