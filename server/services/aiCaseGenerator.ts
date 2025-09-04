import OpenAI from "openai";
import { clinicalContentGenerator } from "./clinicalContentGenerator";
import type { InsertMedicalCase } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface CaseGenerationRequest {
  specialty: string;
  difficulty: number; // 1-3
  patientAgeRange?: string; // "18-30", "31-65", "65+"
  patientGender?: string; // "Male", "Female", "Any"
  focusArea?: string; // specific medical condition or symptom focus
  learningObjectives?: string[]; // specific learning goals
}

export interface GeneratedCaseData {
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  symptoms: string[];
  medicalHistory: Record<string, any>;
  correctDiagnosis: string;
  correctTreatment: string;
  learningObjectives: string[];
  estimatedDuration: number;
  responses: Record<string, string>;
}

export class AICaseGenerator {
  
  async generateMedicalCase(request: CaseGenerationRequest): Promise<InsertMedicalCase> {
    try {
      // Generate the core case data using GPT-4
      const caseData = await this.generateCaseWithGPT4(request);
      
      // Generate comprehensive clinical content using our clinical generator
      const physicalExam = clinicalContentGenerator.generatePhysicalExam(
        caseData.correctDiagnosis,
        caseData.symptoms,
        caseData.age,
        caseData.gender,
        request.specialty
      );

      const diagnosticTests = clinicalContentGenerator.generateDiagnosticTests(
        caseData.correctDiagnosis,
        caseData.symptoms,
        request.specialty,
        caseData.age,
        caseData.gender
      );

      // Combine all data into complete medical case
      const completeCase: InsertMedicalCase = {
        ...caseData,
        specialty: request.specialty,
        difficulty: request.difficulty,
        physicalExam,
        diagnosticTests: {
          available: diagnosticTests,
          ordered: [],
          completed: []
        },
        rating: "0.00"
      };

      return completeCase;
    } catch (error) {
      console.error('Error generating AI case:', error);
      throw new Error('Failed to generate AI-powered medical case');
    }
  }

  private async generateCaseWithGPT4(request: CaseGenerationRequest): Promise<GeneratedCaseData> {
    const ageRange = this.parseAgeRange(request.patientAgeRange || "18-85");
    const gender = request.patientGender === "Any" ? (Math.random() > 0.5 ? "Male" : "Female") : (request.patientGender || "Any");
    
    const prompt = this.buildCaseGenerationPrompt(request, ageRange, gender);

    const response = await openai.chat.completions.create({
      model: "gpt-4", // the newest OpenAI model is "gpt-4" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert medical educator creating realistic clinical cases for medical training. Generate cases that are clinically accurate, educationally valuable, and appropriate for the specified difficulty level."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // Encourage creativity while maintaining medical accuracy
      max_tokens: 2000
    });

    const generatedContent = response.choices[0].message.content;
    if (!generatedContent) {
      throw new Error('No content generated from GPT-4');
    }

    try {
      const caseData = JSON.parse(generatedContent) as GeneratedCaseData;
      
      // Validate and clean the generated data
      return this.validateAndCleanCaseData(caseData, ageRange, gender);
    } catch (parseError) {
      console.error('Error parsing GPT-4 response:', parseError);
      throw new Error('Invalid response format from AI case generator');
    }
  }

  private buildCaseGenerationPrompt(request: CaseGenerationRequest, ageRange: { min: number, max: number }, gender: string): string {
    const difficultyDescriptions = {
      1: "Foundation level - common conditions, straightforward presentations, clear symptoms",
      2: "Clinical level - moderate complexity, some atypical features, requires clinical reasoning", 
      3: "Expert level - complex cases, rare conditions, multiple comorbidities, challenging diagnosis"
    };

    return `Generate a realistic medical case for ${request.specialty} training with the following requirements:

**Case Requirements:**
- Specialty: ${request.specialty}
- Difficulty: Level ${request.difficulty} (${difficultyDescriptions[request.difficulty as keyof typeof difficultyDescriptions]})
- Patient Age Range: ${ageRange.min}-${ageRange.max} years
- Patient Gender: ${gender}
${request.focusArea ? `- Focus Area: ${request.focusArea}` : ''}
${request.learningObjectives?.length ? `- Learning Objectives: ${request.learningObjectives.join(', ')}` : ''}

**Response Format (JSON):**
{
  "name": "First Last (realistic name)",
  "age": number (within specified range),
  "gender": "${gender === "Any" ? "Male or Female" : gender}",
  "chiefComplaint": "Patient's main complaint in first person (I have...)",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "medicalHistory": {
    "condition1": "year or description",
    "condition2": "year or description"
  },
  "correctDiagnosis": "Specific medical diagnosis",
  "correctTreatment": "Appropriate treatment plan",
  "learningObjectives": ["objective1", "objective2", "objective3"],
  "estimatedDuration": number (minutes for case completion),
  "responses": {
    "symptom question": "Patient response in first person",
    "onset question": "Patient response about when symptoms started",
    "severity question": "Patient response about pain/symptom severity",
    "associated symptoms": "Patient response about related symptoms",
    "medical history": "Patient response about past medical issues"
  }
}

**Guidelines:**
1. Create medically accurate and realistic cases
2. Ensure symptoms align with the diagnosis
3. Include appropriate medical history for the condition
4. Patient responses should sound natural and conversational
5. Difficulty should match the complexity level requested
6. Include 4-6 realistic patient responses for common questions
7. Estimated duration: Level 1 (15-25 min), Level 2 (20-35 min), Level 3 (30-45 min)`;
  }

  private parseAgeRange(ageRange: string): { min: number, max: number } {
    if (ageRange === "18-30") return { min: 18, max: 30 };
    if (ageRange === "31-65") return { min: 31, max: 65 };
    if (ageRange === "65+") return { min: 65, max: 85 };
    return { min: 18, max: 85 }; // Default range
  }

  private validateAndCleanCaseData(data: GeneratedCaseData, ageRange: { min: number, max: number }, gender: string): GeneratedCaseData {
    // Ensure age is within range
    if (data.age < ageRange.min || data.age > ageRange.max) {
      data.age = Math.floor(Math.random() * (ageRange.max - ageRange.min + 1)) + ageRange.min;
    }

    // Ensure gender matches request
    if (gender !== "Any") {
      data.gender = gender;
    }

    // Validate required fields
    if (!data.name || !data.chiefComplaint || !data.correctDiagnosis) {
      throw new Error('Missing required fields in generated case data');
    }

    // Ensure arrays exist
    data.symptoms = data.symptoms || [];
    data.learningObjectives = data.learningObjectives || [];
    
    // Ensure objects exist
    data.medicalHistory = data.medicalHistory || {};
    data.responses = data.responses || {};

    // Set reasonable defaults
    data.estimatedDuration = data.estimatedDuration || 20;

    return data;
  }

  async generateMultipleCases(request: CaseGenerationRequest, count: number = 3): Promise<InsertMedicalCase[]> {
    const cases: InsertMedicalCase[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const medicalCase = await this.generateMedicalCase(request);
        cases.push(medicalCase);
        
        // Add small delay to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating case ${i + 1}:`, error);
        // Continue with other cases even if one fails
      }
    }

    return cases;
  }

  getAvailableSpecialties(): string[] {
    return [
      "Cardiology",
      "Neurology", 
      "Pulmonology",
      "Gastroenterology",
      "Endocrinology",
      "Nephrology",
      "Rheumatology",
      "Hematology",
      "Infectious Disease",
      "Emergency Medicine",
      "Internal Medicine",
      "Pediatrics",
      "Geriatrics",
      "Psychiatry",
      "Dermatology",
      "Orthopedics",
      "Oncology",
      "Radiology",
      "Pathology"
    ];
  }

  getDifficultyLevels(): Array<{ level: number, name: string, description: string }> {
    return [
      {
        level: 1,
        name: "Foundation",
        description: "Common conditions with straightforward presentations"
      },
      {
        level: 2,
        name: "Clinical", 
        description: "Moderate complexity requiring clinical reasoning"
      },
      {
        level: 3,
        name: "Expert",
        description: "Complex cases with rare conditions or multiple comorbidities"
      }
    ];
  }
}

export const aiCaseGenerator = new AICaseGenerator();