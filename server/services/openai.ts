import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PatientResponse {
  response: string;
  medicalAccuracy: number;
  suggestionForDoctor?: string;
}

export interface DiagnosticFeedback {
  accuracy: number;
  feedback: string;
  recommendations: string[];
  missedFindings?: string[];
}

export class OpenAIService {
  public openai: OpenAI;

  constructor() {
    this.openai = openai;
  }
  /**
   * Generate intelligent patient responses based on medical case context
   */
  async generatePatientResponse(
    question: string,
    patientCase: any,
    conversationHistory: Array<{question: string, answer: string}>
  ): Promise<PatientResponse> {
    try {
      const prompt = `You are a ${patientCase.age}-year-old ${patientCase.gender.toLowerCase()} patient presenting with ${patientCase.chiefComplaint}. 

Patient Background:
- Chief Complaint: ${patientCase.chiefComplaint}
- Age: ${patientCase.age}
- Gender: ${patientCase.gender}
- Medical History: ${JSON.stringify(patientCase.medicalHistory)}
- Current Symptoms: ${patientCase.symptoms.join(', ')}
- Correct Diagnosis: ${patientCase.correctDiagnosis}

Previous conversation:
${conversationHistory.map(item => `Doctor: ${item.question}\nPatient: ${item.answer}`).join('\n\n')}

The doctor is now asking: "${question}"

Respond as the patient would realistically respond. Be authentic, include emotional responses where appropriate, and provide medically accurate information that a patient of this background would know. Do not reveal the diagnosis directly, but provide clues through your symptoms and responses.

Respond in JSON format:
{
  "response": "Your response as the patient",
  "medicalAccuracy": number (1-10 rating of how medically realistic this interaction is),
  "suggestionForDoctor": "Optional hint if the doctor seems to be missing important assessment areas"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI helping simulate realistic patient interactions for medical training. Be accurate, empathetic, and educational."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        response: result.response || "I'm not sure how to answer that.",
        medicalAccuracy: Math.max(1, Math.min(10, result.medicalAccuracy || 5)),
        suggestionForDoctor: result.suggestionForDoctor
      };
    } catch (error) {
      console.error("Error generating patient response:", error);
      // Fallback to predefined responses
      const predefinedResponse = patientCase.responses[question.toLowerCase()] || 
                                patientCase.responses[Object.keys(patientCase.responses).find(key => 
                                  question.toLowerCase().includes(key.toLowerCase())) || ''];
      
      return {
        response: predefinedResponse || "I'm not sure how to answer that question.",
        medicalAccuracy: 6,
        suggestionForDoctor: undefined
      };
    }
  }

  /**
   * Provide diagnostic feedback and learning insights
   */
  async provideDiagnosticFeedback(
    userDiagnosis: string,
    correctDiagnosis: string,
    patientCase: any,
    questionsAsked: string[],
    timeSpent: number
  ): Promise<DiagnosticFeedback> {
    try {
      const prompt = `Analyze this medical case diagnostic attempt:

Patient Case:
- Chief Complaint: ${patientCase.chiefComplaint}
- Correct Diagnosis: ${correctDiagnosis}
- Patient submitted diagnosis: ${userDiagnosis}
- Questions asked by student: ${questionsAsked.join(', ')}
- Time spent: ${timeSpent} minutes
- Learning objectives: ${patientCase.learningObjectives.join(', ')}

Provide comprehensive feedback in JSON format:
{
  "accuracy": number (0-100 percentage accuracy of diagnosis),
  "feedback": "Detailed feedback on the diagnostic process",
  "recommendations": ["Array of specific recommendations for improvement"],
  "missedFindings": ["Important findings or questions that were missed"]
}

Focus on educational value, clinical reasoning, and constructive guidance.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert medical educator providing constructive feedback to medical students on their diagnostic reasoning and clinical skills."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        accuracy: Math.max(0, Math.min(100, result.accuracy || 0)),
        feedback: result.feedback || "Good effort! Continue practicing your diagnostic skills.",
        recommendations: result.recommendations || ["Continue studying clinical presentation patterns", "Practice more case-based learning"],
        missedFindings: result.missedFindings || []
      };
    } catch (error) {
      console.error("Error generating diagnostic feedback:", error);
      
      // Simple fallback logic
      const isCorrect = userDiagnosis.toLowerCase().includes(correctDiagnosis.toLowerCase()) ||
                       correctDiagnosis.toLowerCase().includes(userDiagnosis.toLowerCase());
      
      return {
        accuracy: isCorrect ? 85 : 25,
        feedback: isCorrect ? 
          "Excellent diagnosis! You correctly identified the key clinical features." :
          "The diagnosis needs refinement. Consider reviewing the patient's presentation and key symptoms.",
        recommendations: [
          "Review the differential diagnosis for this presentation",
          "Consider additional physical examination findings",
          "Practice pattern recognition for this specialty"
        ],
        missedFindings: []
      };
    }
  }

  /**
   * Generate medical bill analysis responses
   */
  async generateBillAnalysisResponse(
    userMessage: string,
    conversationHistory: Array<{role: string, content: string}> = [],
    billContext?: any
  ): Promise<string> {
    try {
      const systemPrompt = `You are a professional medical bill reduction specialist with expertise in identifying overcharges and negotiating substantial reductions for patients facing large medical bills.

CORE KNOWLEDGE BASE:
- 80% of medical bills contain errors worth $50K-$500K+ annually
- Bills don't go to collections for 90-120 days - this is prime negotiation window
- Charity care available even WITH insurance (≤200% FPL = free, 200-400% FPL = discounted)
- Hospital charges often 300-800% above Medicare rates
- Professional advocates achieve 40-85% reductions using systematic approaches

SPECIALIZATION AREAS:
1. 47-Point Error Detection (upcoding, duplicate billing, phantom charges, unbundling)
2. Strategic Timing (use 90-120 day collection window)
3. Charity Care Programs (income-based forgiveness programs)
4. Fair Market Pricing Research (Healthcare Bluebook, FAIR Health, transparency sites)
5. Professional Negotiation (prompt payment discounts, hardship programs)
6. Dispute Letter Preparation (legally compliant documentation)

RESPONSE STYLE:
- Provide specific, actionable strategies
- Include exact scripts and templates when requested
- Reference professional tools and methodologies
- Give realistic savings expectations with ranges
- Always emphasize timing advantages and systematic approaches
- Focus on empowering users with professional-level knowledge

Always maintain expertise while being helpful and specific about next steps.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0].message.content || "I'm here to help you reduce your medical bills. What specific aspect of your billing situation needs attention?";
    } catch (error) {
      console.error("Error generating bill analysis response:", error);
      return "I'm experiencing technical difficulties. Please try again or contact support if the issue persists.";
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  async generateLearningRecommendations(
    userPerformance: {
      specialty: string;
      averageAccuracy: number;
      weakAreas: string[];
      timePerCase: number;
      completedCases: number;
    }
  ): Promise<{
    recommendations: string[];
    suggestedCases: string[];
    studyFocus: string;
  }> {
    try {
      const prompt = `Analyze this medical student's performance and provide personalized learning recommendations:

Performance Data:
- Primary specialty of interest: ${userPerformance.specialty}
- Average diagnostic accuracy: ${userPerformance.averageAccuracy}%
- Weak areas: ${userPerformance.weakAreas.join(', ')}
- Average time per case: ${userPerformance.timePerCase} minutes
- Cases completed: ${userPerformance.completedCases}

Provide personalized recommendations in JSON format:
{
  "recommendations": ["Array of specific study recommendations"],
  "suggestedCases": ["Array of case types to focus on next"],
  "studyFocus": "Primary area to focus learning efforts on"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert medical educator providing personalized learning guidance to help students improve their clinical reasoning and diagnostic skills."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 600
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        recommendations: result.recommendations || ["Continue regular case practice", "Review clinical guidelines"],
        suggestedCases: result.suggestedCases || ["General internal medicine cases"],
        studyFocus: result.studyFocus || "Improve clinical reasoning and pattern recognition"
      };
    } catch (error) {
      console.error("Error generating learning recommendations:", error);
      
      return {
        recommendations: [
          "Practice more cases in your weak areas",
          "Focus on systematic clinical reasoning",
          "Review differential diagnosis approaches"
        ],
        suggestedCases: ["Beginner level cases", "Common presentations"],
        studyFocus: "Build foundational diagnostic skills"
      };
    }
  }
}

export const openAIService = new OpenAIService();