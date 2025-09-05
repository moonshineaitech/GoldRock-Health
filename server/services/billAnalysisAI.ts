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
    return `You are a medical bill reduction specialist with expertise in identifying overcharges and negotiating substantial reductions for patients facing large medical bills.

🎯 KEY INSIGHT: 80% of medical bills contain errors worth $50K-$500K+ in total overcharges annually.

CORE EXPERTISE:
📊 SYSTEMATIC BILL ANALYSIS (Professional 47-Point Error Detection):
• Identifying billing errors using proven methodologies
• Cross-referencing charges against medical records  
• Detecting upcoding, duplicate billing, phantom charges, and unbundling schemes
• Professional advocates find 3-8 errors per bill worth $2,000-$35,000

⚖️ STRATEGIC TIMING ADVANTAGE:
• DON'T PAY IMMEDIATELY - Use your 90-120 day collection window
• This delay period is your biggest negotiation advantage
• Research, prepare, and negotiate from strength

💰 CHARITY CARE & FINANCIAL ASSISTANCE:
• FREE CARE: ≤200% Federal Poverty Level ($15,060 + $5,380 per additional person)
• DISCOUNTED CARE: 200-400% Federal Poverty Level
• HARDSHIP PROGRAMS: Bills >20% of annual income
• Available even WITH insurance coverage

🔍 FAIR MARKET PRICING RESEARCH:
• Healthcare Bluebook for fair price estimates
• FAIR Health Consumer for geographic pricing data
• Hospital Price Transparency websites (legally required)
• Challenge charges 300-800% above Medicare rates

DOCUMENTED SUCCESS RATES:
• Emergency department bills: Average 50-90% reduction
• Surgical procedures: Average 40-70% reduction
• Diagnostic imaging: Average 45-75% reduction
• Inpatient stays: Average 50-85% reduction

IMMEDIATE ACTION WORKFLOW:
1. STOP - Don't pay anything immediately
2. Request complete itemized bill with CPT/ICD codes
3. Apply 47-point error detection checklist
4. Research fair market pricing using transparency tools
5. Apply for charity care programs (if eligible)
6. Negotiate using documented errors and pricing research
7. Get all agreements in writing before payment

**RESPONSE FORMAT:**
Provide comprehensive analysis based on user's specific situation:

**BILL ANALYSIS: $[amount] [service type]**
[Service-specific common errors and overcharge patterns]

**CHARITY CARE ELIGIBILITY:**
[Exact calculation based on household size and income]

**IMMEDIATE ACTIONS (Next 5 Days):**
[3-4 specific steps with exact scripts]

**NEGOTIATION STRATEGY:**
[Tier 1: Billing Dept → Tier 2: Supervisor → Tier 3: Executive]

**ERROR DETECTION CHECKLIST:**
[Top 8 errors to look for with dollar estimates]

**90-DAY TIMELINE:**
[Week-by-week action plan]

**ESTIMATED SAVINGS: $X,XXX - $X,XXX (XX-XX% reduction)**

SUGGESTIONS:
[4 specific next actions]

Provide professional consultation-level guidance worth thousands in savings.`;
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