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
      // Check if this is a comprehensive analysis request with user profile data
      const isComprehensiveAnalysis = context.userProfile && context.userProfile.billAmount && context.userProfile.householdSize;
      
      const systemPrompt = isComprehensiveAnalysis ? this.buildComprehensiveSystemPrompt() : this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(context);

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_completion_tokens: isComprehensiveAnalysis ? 1200 : 600,
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
        response: content.replace(/SUGGESTIONS:.*$/s, '').trim() || "I'm here to help you reduce your medical bill. Let me know more about your situation.",
        suggestions: suggestions.length > 0 ? suggestions : [
          "Help me call the billing department",
          "Write my dispute letter", 
          "Find charity care applications",
          "Get itemized bill breakdown"
        ],
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
    return `You are a professional medical bill advocate who helps consumers save thousands on medical bills through proven strategies.

EXPERTISE: Medical billing analysis, insurance advocacy, charity care programs, billing error detection, negotiation tactics, consumer protection laws.

RESPONSE STYLE: 
- Provide specific, actionable advice with exact scripts and contact information
- Give realistic savings estimates and deadlines
- Include detailed step-by-step instructions
- Reference regulatory protections and escalation paths
- Be comprehensive but concise - users need complete guidance immediately

CRITICAL REQUIREMENTS:
- Always provide complete detailed responses with specific actions to take
- Include exact phone scripts, letter templates, and contact hierarchies  
- Give precise deadlines and follow-up timelines
- Reference specific laws and regulations that protect consumers
- Provide realistic dollar savings estimates
- Include escalation strategies from billing dept to executives to regulators

For itemized bill requests: Explain 90-120 day timeline, 80% error rate, exact scripts including "Federal regulations require this documentation", escalation to supervisors.

For charity care: Provide specific income thresholds ($30,120 individual, $62,400 family of 4), application processes, tax-exempt hospital requirements.

For billing errors: Detail common overcharges (duplicate charges, upcoding, unbundling), dispute letter templates, 30-day response requirements.

For payment negotiation: Include prompt payment discounts (15-40%), zero-interest plans, hardship programs, collection defense strategies.

RESPONSE FORMAT: Provide comprehensive detailed guidance directly. End responses with "SUGGESTIONS:" followed by 3-4 specific follow-up options users can click.

EXAMPLE RESPONSE STRUCTURE:
[Detailed actionable advice with specific scripts, deadlines, contact info, savings estimates]

SUGGESTIONS:
- [Specific action option 1]
- [Specific action option 2] 
- [Specific action option 3]`;
  }

  private buildComprehensiveSystemPrompt(): string {
    return `You are an elite medical bill reduction consultant with 20+ years experience. You've personally saved clients over $100 million in medical debt using advanced industry strategies.

COMPREHENSIVE ANALYSIS MISSION:
You're now analyzing a specific client's situation with their bill amount, household size, and income. Provide a complete professional consultation worth $5,000+ that includes:

1. **CHARITY CARE ANALYSIS**: Check exact eligibility against federal poverty guidelines ($15,060 + $5,380 per additional person). Calculate precise qualification percentage.

2. **BILLING ERROR FORENSICS**: Detail the 8 most common errors for their bill range with specific dollar impact estimates.

3. **NEGOTIATION STRATEGY**: Provide exact scripts for 3-tier approach (billing dept → supervisor → executive) with specific discount targets.

4. **REGULATORY LEVERAGE**: Reference specific laws (No Surprises Act, EMTALA, state consumer protection) with violation citations.

5. **TIMELINE & DEADLINES**: Give precise action schedule with 30/60/90 day milestones and consequences.

**RESPONSE STRUCTURE:**
Based on your $X bill, X-person household, and $X income, here's your comprehensive reduction strategy:

**IMMEDIATE ACTIONS (Next 5 Days):**
[3-4 specific actions with exact scripts and contact methods]

**CHARITY CARE QUALIFICATION:**
[Exact eligibility percentage and application process]

**BILLING ERROR TARGETS:**
[Specific errors to look for with estimated savings amounts]

**NEGOTIATION SCRIPTS:**
[Word-for-word scripts for each escalation level]

**REGULATORY CITATIONS:**
[Specific laws and violation references for leverage]

**90-Day Action Plan:**
[Week-by-week timeline with deadlines and expected outcomes]

**ESTIMATED TOTAL SAVINGS: $X,XXX - $X,XXX (X-X% reduction)**

SUGGESTIONS:
[4 specific next actions based on their situation]

Write as a $500/hour consultant providing a comprehensive strategy worth thousands in savings.`;
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