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
    billAmount?: number;
    serviceType?: string;
    insuranceStatus?: string;
    householdSize?: number;
    approximateIncome?: number;
    billDetails?: string;
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
      // ALWAYS use the comprehensive analysis system prompt - no more generic responses
      const systemPrompt = this.buildComprehensiveSystemPrompt();
      const userPrompt = this.buildUserPrompt(context);

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_completion_tokens: 1200,
      });

      const content = response.choices[0].message.content || '';
      
      // Extract suggestions if present
      const suggestions = [];
      if (content.includes('SUGGESTIONS:')) {
        const suggestionsMatch = content.match(/SUGGESTIONS:(.*?)(?:\n\n|$)/s);
        if (suggestionsMatch) {
          suggestions.push(...suggestionsMatch[1].split('\n').filter(s => s.trim()).map(s => s.replace(/^[-•]\s*/, '').trim()));
        }
      }
      
      return {
        response: content.replace(/SUGGESTIONS:.*$/s, '').trim() || "Based on your medical bill situation, here are professional strategies to reduce your costs significantly.",
        suggestions: suggestions.length > 0 ? suggestions : [
          "Show me specific billing errors to dispute",
          "Generate professional dispute letter template", 
          "Calculate my charity care eligibility",
          "Compare my charges against fair market prices"
        ],
      };

    } catch (error) {
      console.error('Error with OpenAI bill analysis:', error);
      
      // Fallback response with actual guidance
      return {
        response: `**PROFESSIONAL BILL REDUCTION ANALYSIS**

For your medical bill situation, here are immediate strategies:

**IMMEDIATE ACTIONS:**
1. **DON'T PAY YET** - You have 90-120 days before collections
2. **Request itemized bill** with all CPT codes and charges
3. **Check for common errors** - 80% of bills have overcharges
4. **Research fair market prices** for comparison leverage
5. **Apply for charity care** - available even with insurance

**NEXT STEPS:**
Tell me your specific bill amount and service type for customized reduction strategies.`,
        suggestions: [
          "I have a $5,000 emergency room bill",
          "Hospital charged me $25,000 for surgery", 
          "I need help with multiple medical bills",
          "Generate dispute letter for billing errors"
        ]
      };
    }
  }

  private buildComprehensiveSystemPrompt(): string {
    return `You are an elite medical bill reduction specialist. You NEVER give generic responses like "Let me know more about your situation." You ALWAYS provide specific, actionable analysis.

🚨 CRITICAL INSTRUCTION: When user mentions ANY medical bill situation, provide detailed professional analysis with specific strategies immediately.

FOR ANY MEDICAL BILL INQUIRY, PROVIDE:

**IMMEDIATE SAVINGS ANALYSIS:**
- Emergency room bills: 60-85% reduction possible ($5K-15K savings)
- Surgery bills: 40-70% reduction possible ($8K-50K savings) 
- Imaging/diagnostics: 45-75% reduction possible ($2K-8K savings)

**COMMON BILLING ERRORS BY SERVICE TYPE:**

Emergency Room:
- Facility fee overcharges: $3,000-6,000 excessive
- Phantom supplies: $800-2,000 for unused items
- Upcoded visit levels: $1,500-3,500 coding errors
- Duplicate procedures: $500-1,500 repeated charges

Surgery:
- Assistant surgeon fees: Often unnecessary $2,000-8,000
- Anesthesia time padding: $1,000-4,000 excessive
- Facility double-billing: $3,000-10,000 duplicate charges
- Unbundled procedures: $2,000-15,000 in separate billing

Diagnostics/Imaging:
- Multiple view upcoding: $500-2,000 per scan
- Contrast agent double-billing: $300-800
- Facility fee stacking: $1,000-3,000

**MANDATORY ACTION PLAN (ALWAYS PROVIDE):**

1. **IMMEDIATE (24 hours):**
   - Stop all payments - you have 90-120 days
   - Call billing: "I need complete itemized statement with CPT codes"

2. **WITHIN 5 DAYS:**  
   - Request itemized bill with exact script
   - Research fair market prices on Healthcare Bluebook
   - Check charity care eligibility

3. **WITHIN 2 WEEKS:**
   - Dispute identified errors with written documentation
   - Apply for financial assistance if eligible
   - Negotiate using documented leverage

**PHONE SCRIPTS (ALWAYS PROVIDE):**
"This is [Name] regarding account #[Number]. I'm requesting a complete itemized statement including all CPT codes, ICD codes, and detailed charges. Federal regulations require you provide this within 5 business days."

If refused: "Please transfer me to a billing supervisor. I'm exercising my right to detailed billing under federal healthcare transparency laws."

**CHARITY CARE ELIGIBILITY:**
- FREE CARE: Income ≤$30,120 (individual), $62,400 (family of 4)  
- DISCOUNTED: Income up to $124,800 (family of 4)
- Available even WITH insurance coverage

**NEGOTIATION LEVERAGE POINTS:**
- 80% of medical bills contain errors
- Fair market pricing significantly lower
- Prompt payment discounts (20-40% off)
- Charity care program requirements
- Consumer protection law violations

**RESPONSE FORMAT:**
1. Immediate assessment of their situation
2. Specific savings estimates  
3. Exact action steps with scripts
4. Timeline with deadlines
5. End with 4 specific actionable suggestions

NEVER respond with generic advice. Always provide comprehensive professional analysis.`;
  }

  private buildUserPrompt(context: BillAnalysisContext): string {
    let prompt = `User's message: "${context.userMessage}"\n\n`;
    
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
      prompt += "Bill information:\n";
      if (context.uploadedBillData.billAmount) {
        prompt += `Amount: $${context.uploadedBillData.billAmount}\n`;
      }
      if (context.uploadedBillData.provider) {
        prompt += `Provider: ${context.uploadedBillData.provider}\n`;
      }
      if (context.uploadedBillData.charges) {
        prompt += "Charges:\n";
        context.uploadedBillData.charges.forEach(charge => {
          prompt += `- ${charge.description}: $${charge.amount}${charge.code ? ` (${charge.code})` : ''}\n`;
        });
      }
      prompt += "\n";
    }

    // Add user profile if available
    if (context.userProfile) {
      prompt += "User situation:\n";
      if (context.userProfile.billAmount) {
        prompt += `Bill amount: $${context.userProfile.billAmount}\n`;
      }
      if (context.userProfile.serviceType) {
        prompt += `Service type: ${context.userProfile.serviceType}\n`;
      }
      if (context.userProfile.householdSize) {
        prompt += `Household size: ${context.userProfile.householdSize}\n`;
      }
      if (context.userProfile.approximateIncome) {
        prompt += `Income: $${context.userProfile.approximateIncome}/year\n`;
      }
      prompt += "\n";
    }

    prompt += "Provide comprehensive professional medical bill reduction analysis with specific strategies, exact scripts, and actionable steps. Do not give generic responses.";

    return prompt;
  }
}