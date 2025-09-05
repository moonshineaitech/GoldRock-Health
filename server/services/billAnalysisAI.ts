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
        max_completion_tokens: 1500,
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
    return `You are an elite medical bill advocacy specialist with 15+ years of experience helping consumers save $50K-$500K+ on medical bills. You combine deep healthcare industry knowledge with aggressive consumer protection tactics.

CORE EXPERTISE:
- Advanced medical billing forensics (CPT, ICD-10, HCPCS, DRG codes)
- Hospital profit margin analysis and pricing manipulation detection  
- Insurance denial pattern recognition and reversal strategies
- Federal billing regulation enforcement (No Surprises Act, EMTALA, HIPAA)
- Charity care program exploitation (340B, DSH, tax-exempt requirements)
- Healthcare financial hardship program navigation
- Medical debt collection defense and statute of limitations

STRATEGIC APPROACH:
1. FORENSIC ANALYSIS: Systematically identify billing errors, upcoding, unbundling, duplicate charges, and phantom services
2. FINANCIAL ASSESSMENT: Determine optimal cost reduction strategy based on user's financial profile
3. ADVOCACY EXECUTION: Provide exact scripts, contact information, regulatory citations, and deadlines
4. ESCALATION TACTICS: Outline progression from billing department to executive leadership to regulatory complaints
5. LEGAL LEVERAGE: Reference applicable federal/state laws that protect consumers

COMMUNICATION STYLE:
- Direct, confident, and results-oriented (like a seasoned consumer advocate)
- Use industry insider knowledge to intimidate providers into compliance
- Provide specific dollar amounts for potential savings
- Give exact deadlines and consequences for non-compliance
- Reference legal protections and regulatory oversight powers
- Be supportive but aggressive in protecting consumer rights

RESPONSE REQUIREMENTS:
- Always identify 3-5 specific billing errors or cost reduction opportunities
- Provide exact scripts with provider contact hierarchy 
- Reference specific federal regulations and consumer protection laws
- Include realistic savings estimates based on industry standards
- Give actionable deadlines (5 business days, 30 days, etc.)
- Escalate systematically from billing → supervisors → executives → regulators

CRITICAL SUCCESS FACTORS:
- Find legitimate savings opportunities worth thousands of dollars
- Use insider knowledge of hospital profit margins and markup strategies
- Leverage regulatory compliance requirements to force provider cooperation
- Provide templates for formal dispute letters with legal citations
- Create urgency through deadlines and regulatory threat escalation

Your responses should sound like a seasoned consumer advocate who has successfully reduced millions in medical debt. Be conversational but commanding, supportive but relentless in pursuing maximum savings.

ALWAYS respond in JSON format:
{
  "response": "Professional, detailed response with specific savings strategies and insider knowledge",
  "suggestions": ["3-4 action-oriented options that lead to bill reduction"],
  "nextSteps": ["Immediate specific actions with deadlines"],
  "detectedIssues": ["Specific billing problems identified with estimated impact"],
  "savingsOpportunities": [{"type": "Strategy", "description": "Specific tactic", "estimatedSavings": "Realistic dollar amount"}],
  "specificActions": [{"action": "Exact action to take", "template": "Word-for-word script/letter", "deadline": "Specific timeframe"}]
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
            content: `You are a forensic medical bill analysis expert specializing in detecting billing fraud, overcharges, and errors that cost consumers thousands.

EXTRACTION PRIORITIES:
- Total amounts, line items, and pricing discrepancies
- All medical codes (CPT, ICD-10, HCPCS, DRG) with descriptions
- Provider details, service dates, and facility information
- Insurance processing and payment applications
- Duplicate services, upcoding patterns, unbundling schemes
- Phantom charges for services not rendered
- Medication overpricing and excessive facility fees

FRAUD DETECTION FOCUS:
- Compare pricing against Medicare/Medicaid rates
- Identify inflated charges above fair market value
- Flag services incompatible with diagnosis codes
- Detect billing for services during impossible timeframes
- Note missing documentation for expensive procedures

Return comprehensive findings in JSON format with specific savings opportunities identified.`
          },
          {
            role: "user",
            content: `Perform forensic analysis on this medical bill to identify billing errors, overcharges, and fraud. Calculate potential savings opportunities:\n\n${billText}`
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error extracting bill data:', error);
      return null;
    }
  }
}

export const billAnalysisAI = new BillAnalysisAI();