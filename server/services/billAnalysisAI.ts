import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BillAnalysisContext {
  userMessage: string;
  conversationHistory: Array<{role: string, content: string}>;
  uploadedBillData?: {
    billAmount?: number;
    charges?: Array<{
      description: string;
      amount: number;
      code?: string;
    }>;
    provider?: string;
    serviceDate?: string;
  };
  userProfile?: {
    householdSize?: number;
    approximateIncome?: number;
    paymentCapability?: 'lump_sum' | 'payment_plan' | 'limited_funds';
  };
}

export interface BillAnalysisResponse {
  response: string;
  suggestions: string[];
  nextSteps?: string[];
  detectedIssues?: string[];
  savingsOpportunities?: Array<{
    type: string;
    description: string;
    estimatedSavings: string;
  }>;
  specificActions?: Array<{
    action: string;
    template?: string;
    deadline?: string;
  }>;
}

export class BillAnalysisAI {
  
  async analyzeBillAndProvideAdvice(context: BillAnalysisContext): Promise<BillAnalysisResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(context);

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        response: result.response || "I'm here to help you reduce your medical bill. Let me know more about your situation.",
        suggestions: result.suggestions || [],
        nextSteps: result.nextSteps || [],
        detectedIssues: result.detectedIssues || [],
        savingsOpportunities: result.savingsOpportunities || [],
        specificActions: result.specificActions || [],
      };

    } catch (error) {
      console.error('Error with OpenAI bill analysis:', error);
      
      // Fallback response
      return {
        response: "I'm experiencing a technical issue, but I can still help you reduce your medical bill. What specific challenge are you facing with your bill?",
        suggestions: [
          "I can't afford my medical bill",
          "I think there are errors on my bill", 
          "I want to negotiate a lower payment",
          "Help me understand charity care options"
        ]
      };
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert medical bill advocacy AI that helps consumers reduce medical bills by finding errors, overcharges, and negotiation opportunities. You have deep knowledge of:

- Medical billing codes (CPT, ICD-10, HCPCS)
- Hospital pricing strategies and markup patterns
- Insurance coverage gaps and denial patterns
- Charity care eligibility requirements (federal poverty guidelines)
- Negotiation tactics for different healthcare providers
- Legal consumer protections under federal billing regulations

Your role is to:
1. Analyze the user's specific situation and provide personalized advice
2. Identify concrete billing errors, overcharges, and savings opportunities
3. Provide actionable next steps with specific scripts, phone numbers, and deadlines
4. Consider the user's financial situation to recommend the best strategy
5. Be conversational and supportive - users are already stressed about medical bills

Key principles:
- Always provide specific, actionable advice rather than generic information
- Consider the user's previous messages and context throughout the conversation
- Find real savings opportunities based on their actual situation
- Give clear next steps they can take immediately
- Be encouraging but realistic about outcomes

Response format: Always respond in JSON with these fields:
{
  "response": "Conversational response addressing their specific question/situation",
  "suggestions": ["3-4 clickable options for follow-up questions"],
  "nextSteps": ["Specific actions they should take"],
  "detectedIssues": ["If bill data provided, list potential problems found"],
  "savingsOpportunities": [{"type": "Program/Strategy", "description": "What to do", "estimatedSavings": "$X-$Y or X%"}],
  "specificActions": [{"action": "Call/Write/Apply", "template": "Exact script/letter", "deadline": "When to do it"}]
}`;
  }

  private buildUserPrompt(context: BillAnalysisContext): string {
    let prompt = `User's current message: "${context.userMessage}"\n\n`;
    
    // Add conversation history for context
    if (context.conversationHistory.length > 0) {
      prompt += "Previous conversation:\n";
      context.conversationHistory.slice(-4).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
      prompt += "\n";
    }

    // Add bill data if available
    if (context.uploadedBillData) {
      prompt += "Uploaded bill information:\n";
      if (context.uploadedBillData.billAmount) {
        prompt += `Total amount: $${context.uploadedBillData.billAmount}\n`;
      }
      if (context.uploadedBillData.provider) {
        prompt += `Provider: ${context.uploadedBillData.provider}\n`;
      }
      if (context.uploadedBillData.charges && context.uploadedBillData.charges.length > 0) {
        prompt += "Charges breakdown:\n";
        context.uploadedBillData.charges.forEach(charge => {
          prompt += `- ${charge.description}: $${charge.amount}${charge.code ? ` (${charge.code})` : ''}\n`;
        });
      }
      prompt += "\n";
    }

    // Add user profile if available
    if (context.userProfile) {
      prompt += "User's financial situation:\n";
      if (context.userProfile.householdSize) {
        prompt += `Household size: ${context.userProfile.householdSize}\n`;
      }
      if (context.userProfile.approximateIncome) {
        prompt += `Approximate income: $${context.userProfile.approximateIncome}/year\n`;
      }
      if (context.userProfile.paymentCapability) {
        prompt += `Payment preference: ${context.userProfile.paymentCapability}\n`;
      }
      prompt += "\n";
    }

    prompt += `Based on this context, provide personalized advice for reducing their medical bill. Focus on their specific situation and give actionable steps they can take immediately. If you detect any billing issues or have access to bill data, analyze it for errors and overcharges.`;

    return prompt;
  }

  async extractBillData(billText: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5", 
        messages: [
          {
            role: "system",
            content: `You are a medical bill data extraction expert. Extract key information from medical bills and identify potential billing errors or overcharges. 

Look for:
- Total amount and individual charges
- Medical procedure codes (CPT, ICD-10, HCPCS)
- Provider information and service dates
- Duplicate charges or unusual pricing
- Services that seem excessive or inappropriate
- Charges without proper codes or descriptions

Return your findings in JSON format.`
          },
          {
            role: "user",
            content: `Extract data from this medical bill and identify any potential issues:\n\n${billText}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error extracting bill data:', error);
      return null;
    }
  }
}

export const billAnalysisAI = new BillAnalysisAI();