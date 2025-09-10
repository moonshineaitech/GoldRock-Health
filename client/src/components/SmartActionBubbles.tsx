import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Phone, 
  Calculator, 
  Send, 
  Shield, 
  CheckCircle2, 
  DollarSign,
  AlertTriangle,
  Calendar,
  Download,
  Printer,
  Mail,
  Users,
  Scale,
  Clock,
  Target,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Crown,
  Eye,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  bgColor: string;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
}

interface SmartActionBubblesProps {
  context: 'dispute-letter' | 'negotiation-script' | 'error-detection' | 'billing-rights' | 'claim-appeal' | 'general';
  aiResponse: string;
  onSendMessage: (message: string) => void;
  onGenerateDocument?: (type: string) => void;
}

export function SmartActionBubbles({ context, aiResponse, onSendMessage, onGenerateDocument }: SmartActionBubblesProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const getContextualActions = (): SmartAction[] => {
    const baseActions: Record<string, SmartAction[]> = {
      'dispute-letter': [
        {
          id: 'send-dispute',
          label: 'Send to Hospital',
          icon: Send,
          description: 'Email or mail your dispute letter',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("I've prepared a comprehensive medical bill dispute letter and need expert guidance on the most effective submission strategy to ensure maximum impact and prompt response from the hospital billing department. I need detailed advice on multiple aspects of this critical communication: First, help me determine the optimal submission method between certified mail with return receipt, email to specific departments, fax with delivery confirmation, or hand delivery with documented receipt. Each method has different legal protections and response timeline implications that I need to understand. Second, identify the specific hospital personnel who should receive this dispute letter for fastest resolution. This includes not just the billing department, but potentially the Patient Financial Services Director, Chief Financial Officer, Patient Advocate, or Compliance Department depending on the nature of my dispute. Third, provide guidance on timing strategy - what days of the week and times of month are most effective for hospital dispute submissions, considering billing cycle schedules and staff availability patterns. Fourth, advise on documentation requirements to protect my legal rights during this dispute process, including what proof of delivery I need, how to document the hospital's receipt of my dispute, and what follow-up communications I should prepare. Fifth, help me understand the hospital's likely internal processes once they receive my dispute letter, including typical response timeframes, escalation procedures if they don't respond promptly, and what constitutes an adequate response versus a dismissive non-response. Sixth, provide specific language for a cover note or email that should accompany the dispute letter to ensure it gets routed to decision-makers rather than being buried in routine correspondence. Finally, create a follow-up strategy that maximizes pressure for resolution while maintaining professional communication standards and legal protections throughout the dispute process.")
        },
        {
          id: 'track-timeline',
          label: 'Set Follow-up Timeline',
          icon: Calendar,
          description: 'Create 30-60-90 day follow-up schedule',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'high',
          action: () => onSendMessage("I need you to create a comprehensive, strategic follow-up timeline for my medical bill dispute that maximizes pressure for resolution while protecting my legal rights and maintaining documentation for potential escalation. This timeline should account for hospital billing department procedures, federal billing dispute regulations, and optimal psychological timing for follow-up communications. Begin by establishing the baseline timeline expectations based on federal regulations that require hospitals to acknowledge billing disputes within specific timeframes and provide substantive responses within designated periods. Many patients don't realize that hospitals are legally required to investigate billing disputes promptly and provide written responses explaining their findings. Create a detailed day-by-day schedule starting from my dispute letter submission date. Include immediate actions for the first week, such as confirming receipt and requesting acknowledgment if I haven't received confirmation. Outline specific follow-up actions for the 10-day, 20-day, and 30-day marks, including escalation procedures if I receive no response or an inadequate response. Detail what constitutes an adequate response versus a dismissive non-response, helping me evaluate whether the hospital is taking my dispute seriously or trying to delay resolution. Provide specific scripts for each follow-up communication, including phone calls to billing departments, emails to supervisors, and formal letters to escalate the dispute. Include guidance on when to involve patient advocates, state regulatory agencies, and consumer protection bureaus if the hospital fails to respond appropriately. Address psychological tactics hospitals might use to discourage follow-up, such as requests for unnecessary documentation, transfers between departments, or claims that my dispute is being reviewed when no actual investigation is occurring. Provide strategies to counter these delay tactics and maintain momentum toward resolution. Include specific language for documenting each interaction, creating a paper trail that strengthens my position for potential regulatory complaints or legal action. Finally, establish clear criteria for when to escalate beyond the hospital's internal dispute process, including threshold dates for involving external oversight agencies and procedures for filing complaints with appropriate regulatory bodies.")
        },
        {
          id: 'legal-backup',
          label: 'Legal Protection',
          icon: Shield,
          description: 'Understand your legal rights',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'medium',
          action: () => onSendMessage("I need comprehensive legal guidance about my patient rights and legal protections during medical bill disputes, as well as clear understanding of what actions hospitals can and cannot legally take during this process. This information is critical for protecting myself from potential violations of my rights and ensuring I leverage all available legal protections. First, detail my specific legal rights under federal laws such as the Fair Debt Collection Practices Act, Fair Credit Billing Act, and any relevant healthcare billing regulations. Explain how these laws apply specifically to medical debt and hospital billing practices, including what constitutes illegal collection practices and what remedies are available if hospitals violate these protections. Second, outline my state-specific patient rights regarding medical billing, including balance billing protections, transparency requirements, charity care entitlements, and dispute resolution procedures. Many states have enacted strong patient protection laws that hospitals must follow, and I need to understand exactly what rights I can invoke in my situation. Third, explain what the hospital can legally do during a billing dispute, including their collection activities, credit reporting rights, legal action timelines, and communication procedures. Help me understand the legitimate actions they're allowed to take so I can distinguish between proper procedures and potential rights violations. Fourth, detail what hospitals cannot legally do during disputes, including prohibited collection practices, illegal billing tactics, credit reporting violations, and harassment behaviors. I need to recognize when a hospital or collection agency crosses legal boundaries so I can document violations and take appropriate action. Fifth, provide guidance on documenting potential rights violations, including what evidence to gather, how to preserve communications, and what records to maintain for potential legal action or regulatory complaints. Sixth, explain my legal remedies if the hospital violates my rights, including complaint procedures with regulatory agencies, legal action options, and potential damages I might recover for violations. Finally, provide specific language I can use to invoke my legal rights in communications with hospitals, including phrases that trigger legal protections and create accountability for hospital compliance with billing regulations.")
        },
        {
          id: 'evidence-package',
          label: 'Build Evidence Package',
          icon: FileText,
          description: 'Gather supporting documentation',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("I need your expertise to create a comprehensive, legally-sound evidence package that will strengthen my medical bill dispute and maximize my chances of successful resolution. This evidence package should be structured like those used by professional billing advocates and attorneys to compel hospital compliance and demonstrate the validity of my dispute claims. First, help me identify and organize primary evidence documents including all versions of my medical bills, itemized statements, insurance explanations of benefits, payment records, and any previous correspondence with the hospital or insurance company. Explain how to properly authenticate each document and create copies that maintain legal validity for dispute purposes. Second, guide me through gathering medical records that support my dispute, including physician notes, procedure documentation, diagnostic reports, and treatment timelines. Explain how to request these records from healthcare providers and what specific sections are most relevant for billing dispute purposes. Many billing errors become obvious when medical records don't match billed services. Third, help me collect comparative pricing evidence to demonstrate overcharges, including Medicare allowable amounts, regional pricing benchmarks, and insurance contract rates for similar services. Provide strategies for obtaining this pricing data and presenting it effectively in dispute documentation. Fourth, assist in documenting procedural violations and regulatory non-compliance by the hospital, including billing transparency failures, charity care denial errors, and collection practice violations. Help me identify what constitutes evidence of hospital policy violations and how to document these systematically. Fifth, guide me through creating a chronological dispute timeline that documents all communications, payment attempts, insurance processing, and dispute-related activities. This timeline becomes crucial evidence if the dispute escalates to regulatory agencies or legal proceedings. Sixth, help me gather witness statements or expert opinions if relevant, including documentation from medical professionals about treatment necessity, billing advocates about standard practices, or attorneys about legal violations. Finally, show me how to organize this evidence package professionally with proper indexing, cross-referencing, and presentation that demonstrates the strength of my case and compels serious consideration from hospital decision-makers.")
        }
      ],
      
      'negotiation-script': [
        {
          id: 'practice-call',
          label: 'Practice Session',
          icon: Phone,
          description: 'Rehearse your negotiation approach',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 hover:bg-indigo-200',
          priority: 'high',
          action: () => onSendMessage("I need comprehensive practice and preparation for my upcoming hospital billing negotiation call, including realistic role-play scenarios that prepare me for various responses and situations I might encounter. This practice session should simulate the actual psychological dynamics and procedural challenges of negotiating with hospital billing departments. First, help me rehearse the opening of the call where I establish credibility and set the right tone for productive negotiation. Many calls fail in the first 30 seconds when patients sound desperate or uninformed rather than knowledgeable and prepared for business discussion. Practice with me how to introduce myself professionally, reference my account properly, and position the call as a payment arrangement discussion rather than a plea for help. Second, role-play various billing representative responses I might encounter, from cooperative staff who want to help to resistant representatives who try to avoid making concessions. Help me practice responses to common deflection tactics like 'this is what your insurance approved,' 'the bill is accurate as charged,' 'we can only offer a payment plan,' and 'you need to contact your insurance company.' Third, simulate scenarios where I need to escalate to supervisors or managers, practicing the language and approach that gets me transferred to decision-makers with authority to approve significant bill reductions. Many patients accept the first representative's limitations without realizing that higher-level staff often have much more flexibility. Fourth, practice presenting my financial hardship documentation and negotiation points in ways that trigger the hospital's charity care and financial assistance protocols. Help me rehearse how to reference specific hospital policies, Medicare rate comparisons, and regulatory requirements that strengthen my negotiating position. Fifth, role-play different negotiation outcomes from partial success requiring follow-up to full resolution, helping me practice how to secure written confirmation of agreements and avoid verbal commitments that might not be honored. Finally, practice handling pressure tactics hospitals might use, including time-limited offers, threats of collection action, or attempts to pressure me into payment plans that aren't in my best interest.")
        },
        {
          id: 'escalation-plan',
          label: 'Escalation Strategy',
          icon: Target,
          description: 'Plan for supervisor escalation',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'high',
          action: () => onSendMessage("I need a comprehensive escalation strategy that systematically moves me up the hospital's decision-making hierarchy to reach personnel with authority to approve significant bill reductions when initial representatives cannot or will not help. Most patients give up after speaking with the first billing clerk, not realizing that hospitals have multiple levels of staff with dramatically different authority levels and negotiation flexibility. First, map out the typical hospital billing department hierarchy so I understand the chain of command from entry-level clerks to senior financial officers. Help me identify the specific titles and roles I should target, including Patient Financial Services Representatives, Senior Patient Accounts Specialists, Patient Financial Services Supervisors, Revenue Cycle Managers, Patient Financial Services Directors, and Chief Financial Officers. Each level has different authority limits for write-offs and payment reductions. Second, provide specific language and justifications for requesting escalation at each level when the current representative cannot meet my needs. Include phrases that trigger supervisor involvement and demonstrate that I understand hospital procedures, such as requesting 'manager override authority' or citing specific policy exceptions that require supervisor approval. Third, detail the psychological tactics that work most effectively with each management level, from emphasizing payment capability with mid-level supervisors to discussing regulatory compliance and charity care obligations with senior managers. Help me understand what motivates decision-makers at each level and how to frame my request appropriately. Fourth, create scripts for overcoming common escalation resistance, including responses to 'my supervisor will tell you the same thing,' 'this is our final offer,' or 'I have the same authority as my manager.' Provide specific language that compels escalation and demonstrates my knowledge of hospital billing procedures. Fifth, establish timeline expectations for each escalation level and backup procedures if I encounter unresponsive or obstructive staff members. Include strategies for documenting failed escalation attempts and using this documentation to strengthen complaints to higher authorities. Finally, provide guidance on when to bypass internal escalation entirely and contact external authorities like patient advocates, state regulatory agencies, or hospital board members who can pressure billing departments to cooperate with reasonable requests.")
        },
        {
          id: 'reference-data',
          label: 'Get Market Rates',
          icon: Calculator,
          description: 'Find pricing benchmarks',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 hover:bg-emerald-200',
          priority: 'medium',
          action: () => onSendMessage("Help me find market rate data and pricing benchmarks for my specific procedures to strengthen my negotiation position.")
        },
        {
          id: 'timing-strategy',
          label: 'Best Call Times',
          icon: Clock,
          description: 'Optimize timing for success',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 hover:bg-yellow-200',
          priority: 'low',
          action: () => onSendMessage("When is the best time to call billing departments for negotiations? What days and times are most effective?")
        },
        {
          id: 'financial-hardship',
          label: 'Financial Hardship Programs',
          icon: Users,
          description: 'AI-powered assistance programs',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 hover:bg-indigo-200',
          priority: 'high',
          action: () => onSendMessage("Generate a comprehensive guide to financial hardship programs, charity care, and assistance options I may qualify for. Include specific application strategies and qualification requirements.")
        }
      ],
      
      'error-detection': [
        {
          id: 'generate-dispute',
          label: 'Generate Dispute Letter',
          icon: FileText,
          description: 'Create formal dispute documentation',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("I need you to generate a comprehensive, professionally-crafted medical bill dispute letter that incorporates the specific billing errors I've identified and follows proven legal and procedural strategies that compel hospital billing departments to take serious corrective action. This dispute letter must be structured to achieve maximum impact while protecting my legal rights and establishing proper documentation for potential escalation. Begin with proper business letter formatting that immediately establishes professional credibility, including my complete contact information, the hospital's billing department address with attention to specific decision-makers like the Patient Financial Services Director, and clear subject line referencing my account number and formal billing dispute notification. The opening paragraph should immediately establish the legal foundation by referencing my rights under relevant federal and state billing regulations, including the Fair Credit Billing Act provisions for healthcare disputes, state hospital billing transparency requirements, and the hospital's own published billing error correction policies. This creates immediate accountability and demonstrates my knowledge of legal protections. Structure the main body to systematically address each identified billing error using specific medical billing terminology and regulatory references. For duplicate charges, reference exact dates, procedure codes, and amounts while demanding chronological service logs that prove services were actually provided multiple times. For unbundling violations, cite specific CMS bundling regulations and Medicare billing guidelines that require certain procedures to be billed as comprehensive packages rather than separate line items. For upcoding issues, demand medical records documentation that supports the higher-level procedure codes billed and reference Medicare coding guidelines that establish appropriate code selection criteria. Include a detailed demand section that specifies exactly what corrective actions I require, including itemized documentation for all disputed charges, copies of medical records supporting billed procedures, written explanation of charge calculation methodologies, and timeline for investigation completion. Reference potential regulatory violations and mention that failure to investigate billing errors appropriately could result in complaints to relevant oversight agencies including the state health department, Centers for Medicare and Medicaid Services, and Consumer Financial Protection Bureau. Conclude with professional but firm language that emphasizes my knowledge of billing regulations and patient rights, preserves all legal remedies for non-compliance, and establishes clear expectations for written response and resolution within specified timeframes.")
        },
        {
          id: 'calculate-savings',
          label: 'Calculate Total Savings',
          icon: DollarSign,
          description: 'Estimate financial impact',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'high',
          action: () => onSendMessage("I need a comprehensive financial analysis that calculates the total potential savings from all identified billing errors while providing realistic ranges for different dispute outcome scenarios, from conservative success to maximum possible recovery. This analysis should be structured like a professional billing audit report that demonstrates the significant financial impact of these errors and justifies aggressive dispute efforts. First, provide detailed savings calculations for each identified error type using industry data and typical hospital markup patterns. For duplicate charges, calculate savings based on the actual dollar amounts of repeated line items, noting that duplicate charges often represent 100% recoverable overcharges since the services were only provided once. For unbundling violations, reference Medicare bundling rules to show the price difference between separately billed procedures versus the appropriate bundled rate, often representing $2,000 to $15,000 in overcharges for surgical procedures. For upcoding violations, compare the charges for the higher-level codes billed against the appropriate lower-level codes based on medical documentation, typically representing 20-50% overcharges on affected procedures. Second, create three scenario projections for dispute outcomes: conservative estimates assuming 30-50% success rates on error corrections, moderate estimates with 60-80% success rates, and aggressive estimates assuming 90-95% success rates with professional advocacy techniques. Include rationale for each scenario based on error strength, documentation quality, and hospital cooperation likelihood. Third, factor in additional savings opportunities beyond the specific errors identified, including charity care eligibility assessments, payment plan interest savings, collection cost avoidance, and credit score protection benefits. Many patients overlook these secondary financial benefits that can add thousands to total savings. Fourth, provide timeline estimates for recovering these savings based on hospital response patterns and dispute complexity, helping me understand cash flow implications and when to expect resolution. Fifth, compare total potential savings against the cost of professional billing advocate services, demonstrating the value of pursuing these disputes personally versus hiring professional assistance. Finally, prioritize errors by recovery likelihood and savings potential, creating an action plan that maximizes my return on dispute efforts while minimizing time investment for lower-value claims.")
        },
        {
          id: 'priority-errors',
          label: 'Prioritize by Impact',
          icon: Zap,
          description: 'Focus on highest-value errors first',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("Rank these billing errors by potential savings and ease of dispute. Which ones should I focus on first for maximum impact?")
        },
        {
          id: 'contact-script',
          label: 'Phone Call Script',
          icon: Phone,
          description: 'Get negotiation talking points',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("Create a phone script for calling the billing department about these specific errors. What exactly should I say?")
        },
        {
          id: 'regulatory-complaint',
          label: 'File Regulatory Complaint',
          icon: AlertTriangle,
          description: 'AI-guided complaint strategy',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'medium',
          action: () => onSendMessage("Generate a comprehensive strategy for filing regulatory complaints about these billing errors. Which agencies should I contact and what documentation do I need?")
        }
      ],
      
      'billing-rights': [
        {
          id: 'file-complaint',
          label: 'File Official Complaint',
          icon: Scale,
          description: 'Report violations to authorities',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'high',
          action: () => onSendMessage("Help me file an official complaint with the appropriate regulatory agencies about these billing rights violations.")
        },
        {
          id: 'document-violations',
          label: 'Document Everything',
          icon: FileText,
          description: 'Create violation evidence file',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Help me systematically document all billing rights violations for legal protection and complaint filing.")
        },
        {
          id: 'know-deadlines',
          label: 'Important Deadlines',
          icon: AlertTriangle,
          description: 'Don\'t miss critical dates',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("What are the critical deadlines I need to know about for billing disputes, appeals, and legal actions?")
        },
        {
          id: 'get-advocate',
          label: 'Find Patient Advocate',
          icon: Users,
          description: 'Get professional help',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'medium',
          action: () => onSendMessage("Help me find a qualified patient billing advocate or attorney who specializes in medical billing disputes.")
        },
        {
          id: 'credit-protection',
          label: 'Credit Protection Strategy',
          icon: Shield,
          description: 'AI-powered credit safeguards',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-100 hover:bg-cyan-200',
          priority: 'high',
          action: () => onSendMessage("Generate a comprehensive strategy to protect my credit from medical debt. What steps can I take to prevent this from affecting my credit score, and what are my rights?")
        }
      ],
      
      'claim-appeal': [
        {
          id: 'submit-appeal',
          label: 'Submit to Insurance',
          icon: Send,
          description: 'File formal insurance appeal',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Help me submit this appeal to my insurance company. What's the exact process and what supporting documents do I need?")
        },
        {
          id: 'external-review',
          label: 'Request External Review',
          icon: BookOpen,
          description: 'Independent medical review',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'high',
          action: () => onSendMessage("If my insurance denies this appeal, how do I request an external independent review? What are my options?")
        },
        {
          id: 'medical-records',
          label: 'Gather Medical Records',
          icon: FileText,
          description: 'Collect supporting evidence',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 hover:bg-emerald-200',
          priority: 'medium',
          action: () => onSendMessage("What specific medical records and documentation do I need to gather to support this insurance appeal?")
        },
        {
          id: 'appeal-timeline',
          label: 'Track Appeal Process',
          icon: Calendar,
          description: 'Monitor deadlines and responses',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("Create a timeline for tracking my insurance appeal process. What are the key milestones and deadlines?")
        },
        {
          id: 'medical-necessity',
          label: 'Medical Necessity Documentation',
          icon: BookOpen,
          description: 'AI clinical justification help',
          color: 'text-teal-600',
          bgColor: 'bg-teal-100 hover:bg-teal-200',
          priority: 'medium',
          action: () => onSendMessage("Help me build a medical necessity argument for my insurance appeal. What clinical documentation and medical justifications should I include to strengthen my case?")
        }
      ],
      
      'general': [
        {
          id: 'generate-dispute',
          label: 'Generate Dispute Letter',
          icon: FileText,
          description: 'Create formal dispute documentation',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'high',
          action: () => onSendMessage("Based on this analysis, generate a comprehensive dispute letter I can send to the hospital billing department.")
        },
        {
          id: 'negotiation-help',
          label: 'Get Negotiation Script',
          icon: Phone,
          description: 'Phone call talking points',
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200',
          priority: 'high',
          action: () => onSendMessage("Create a phone negotiation script for calling the billing department about these issues. What exactly should I say?")
        },
        {
          id: 'savings-calculation',
          label: 'Calculate Potential Savings',
          icon: DollarSign,
          description: 'Estimate financial impact',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 hover:bg-emerald-200',
          priority: 'medium',
          action: () => onSendMessage("Calculate the total potential savings from this analysis. What's the maximum amount I could save?")
        },
        {
          id: 'next-steps',
          label: 'What Should I Do Next?',
          icon: Target,
          description: 'Step-by-step action plan',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("I need a comprehensive, prioritized action plan that provides specific step-by-step guidance for reducing my medical bill using proven strategies that maximize savings while minimizing time investment and complexity. This action plan should be structured like professional billing advocate guidance that systematically addresses multiple reduction opportunities while building toward increasingly aggressive tactics if initial approaches don't succeed. First, establish immediate priority actions I should take within the next 48 hours to protect my rights and begin the reduction process, including documenting my current bill status, gathering essential documentation, and initiating any time-sensitive dispute procedures. Help me understand which actions have legal deadlines that cannot be missed and which represent optimal timing opportunities. Second, create a systematic approach for the first week that focuses on low-effort, high-impact strategies such as requesting itemized bills, identifying obvious billing errors, researching hospital charity care policies, and preparing initial communication with billing departments. These foundational steps often yield significant savings with minimal resistance from hospitals. Third, develop intermediate strategies for weeks 2-4 that involve more detailed analysis and formal dispute procedures, including comparative pricing research, medical record review, insurance verification, and formal error documentation. Provide specific timelines for each step and criteria for determining when to escalate to more aggressive approaches. Fourth, outline advanced strategies for month 2 and beyond if initial efforts don't achieve satisfactory results, including regulatory complaints, legal consultation, patient advocate involvement, and public pressure tactics. Help me understand progression criteria for escalating to each level and what outcomes justify more intensive efforts. Fifth, provide specific templates and scripts for each phase of the action plan, including initial hospital contacts, follow-up communications, escalation language, and documentation requirements. Each step should include exact language that maximizes success probability and protects my legal rights. Finally, establish success metrics and decision points throughout the process that help me evaluate progress and determine when I've achieved optimal results versus when additional effort is warranted. Include financial thresholds, time investments, and stress factors that should influence my decision to continue pursuing reductions versus accepting current offers.")
        },
        {
          id: 'advanced-strategies',
          label: 'Advanced Strategies',
          icon: Zap,
          description: 'AI-generated advanced tactics',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          priority: 'medium',
          action: () => onSendMessage("I've exhausted standard bill reduction approaches and need access to advanced, insider strategies and lesser-known tactics that professional billing advocates and healthcare attorneys use to achieve dramatic bill reductions that most patients never discover. These should be sophisticated techniques that leverage healthcare industry knowledge, regulatory loopholes, and institutional vulnerabilities that hospitals don't expect patients to understand or exploit. First, provide advanced negotiation psychology tactics that exploit hospital billing department decision-making patterns, including anchoring strategies where I establish extremely low initial offers to reset their reference points, scarcity tactics that create urgency for settlement acceptance, and authority positioning that makes me appear more knowledgeable than typical patients. Include specific language patterns that trigger compliance responses from billing personnel. Second, reveal insider knowledge about hospital financial operations that I can leverage, including end-of-fiscal-year write-off quotas that make hospitals more generous with bill reductions, charity care budget utilization patterns that affect approval likelihood, and revenue cycle management pressures that create negotiation opportunities. Help me understand timing strategies that align my requests with hospital financial incentives. Third, detail regulatory leverage tactics that use hospital compliance requirements as negotiation pressure, including charity care obligations for nonprofit hospitals, price transparency violations, Medicare billing standard compliance, and patient rights enforcement. Provide specific language that references regulatory violations and creates urgency for hospitals to resolve disputes favorably rather than risk regulatory scrutiny. Fourth, explain advanced documentation strategies that build legal pressure for favorable resolution, including creating paper trails that demonstrate hospital billing pattern violations, documenting potential fraud indicators, and building evidence packages that hospitals prefer to resolve quietly rather than defend publicly. Fifth, reveal industry relationship leverage opportunities, including using hospital board connections, medical staff relationships, insurance company pressure tactics, and media attention strategies that create institutional pressure for bill reduction. Finally, provide creative solution approaches that most patients never consider, including medical debt forgiveness programs, tax implications of debt forgiveness, bankruptcy alternatives, and even patient advocate services that work on contingency fees. Include unconventional strategies like negotiating future service discounts, establishing formal complaint documentation for pattern violations, and leveraging hospital reputation management concerns to achieve settlements.")
        },
        {
          id: 'legal-escalation',
          label: 'Expert Legal Strategy',
          icon: Scale,
          description: 'AI legal guidance & options',
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200',
          priority: 'medium',
          action: () => onSendMessage("I need a comprehensive legal escalation strategy that systematically utilizes all available regulatory, legal, and advocacy resources when standard hospital negotiations fail to achieve reasonable bill reduction. This strategy should escalate methodically through increasing levels of authority and pressure while maintaining legal protections and building toward potential litigation if necessary. First, map out the complete regulatory complaint ecosystem including federal agencies like the Centers for Medicare and Medicaid Services for billing compliance violations, the Consumer Financial Protection Bureau for debt collection practices, and the Department of Health and Human Services for patient rights violations. Include state-level agencies such as health departments for hospital licensing issues, insurance commissioners for balance billing violations, and attorney general offices for consumer protection. Provide specific complaint procedures, required documentation, and typical response timelines for each agency. Second, detail patient advocate engagement strategies including hospital-employed patient advocates who have internal authority to resolve billing disputes, independent patient advocates who work on contingency or hourly fees, and nonprofit advocacy organizations that provide free assistance for qualifying cases. Explain how to evaluate advocate credentials, understand fee structures, and maintain control over my case while leveraging their expertise and relationships. Third, outline legal action progression from demand letters that establish legal foundation through small claims court procedures for smaller disputes to potential civil litigation for larger cases involving hospital billing fraud or systematic overcharging. Include criteria for determining when legal action becomes cost-effective and how to document cases for maximum legal impact. Fourth, provide specific legal theories and causes of action that apply to medical billing disputes, including contract violations, consumer protection law violations, billing fraud claims, and federal/state regulatory non-compliance. Help me understand which legal theories apply to my specific situation and how to build evidence that supports each potential claim. Fifth, detail protective legal strategies that safeguard my assets and credit during escalation, including debt validation procedures, credit reporting dispute processes, collection harassment documentation, and bankruptcy alternatives if the situation becomes unmanageable. Finally, create a systematic documentation and evidence preservation protocol that supports all escalation efforts while maintaining legal privilege and protecting my interests throughout the process.")
        },
        {
          id: 'professional-audit',
          label: 'Professional Bill Audit',
          icon: Eye,
          description: 'Expert-level comprehensive review',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 hover:bg-indigo-200',
          priority: 'medium',
          action: () => onSendMessage("I need you to conduct a comprehensive forensic audit of my medical bill using advanced professional techniques that mirror the systematic approaches used by experienced billing advocates, healthcare attorneys, and medical bill auditing specialists who routinely identify complex billing schemes and regulatory violations that escape typical patient reviews. This audit should employ sophisticated analytical methods that examine not just obvious errors but subtle patterns and institutional practices that generate excessive charges. Begin with advanced charge validation analysis that goes beyond basic error checking to examine charge relationships, timing patterns, and procedural logic that reveals sophisticated billing schemes. Analyze whether procedure codes align logically with medical diagnoses, whether timing sequences make medical sense, whether facility fees correspond to actual resource utilization, and whether supply charges reflect realistic usage patterns. Look for evidence of systematic overbilling strategies like routine room charge inflation, excessive pharmacy markups, or equipment charges for unused devices. Conduct detailed comparative pricing analysis using multiple benchmarks including Medicare allowable amounts, commercial insurance typical rates, regional pricing databases, and hospital-specific historical patterns. Identify outlier charges that exceed reasonable benchmarks by significant margins, particularly focusing on emergency services, surgical procedures, diagnostic imaging, and pharmaceutical charges where hospitals typically embed highest markups. Examine regulatory compliance violations including Medicare billing standard adherence, charity care policy compliance, price transparency requirement violations, and patient notification failures. Look for evidence that the hospital failed to follow federal or state billing regulations, didn't properly disclose charity care options, or violated balance billing protections. Analyze billing pattern indicators of potential fraud including phantom charges for services never provided, duplicate billing across different date ranges, upcoding patterns that consistently bill higher-level services than documentation supports, and unbundling schemes that separate procedures requiring combined billing. Investigate institutional billing practices including chargemaster pricing strategies, revenue cycle management protocols, and collection procedures that may violate patient rights or regulatory requirements. Look for evidence of systematic overcharging, discriminatory pricing practices, or collection actions that exceed legal authority. Finally, provide detailed documentation of all identified violations with specific regulatory citations, estimated financial impact, and recommended dispute strategies that leverage the most compelling evidence for maximum bill reduction potential.")
        },
        {
          id: 'insider-tactics',
          label: 'Hospital Insider Tactics',
          icon: Briefcase,
          description: 'Industry secrets and loopholes',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("What are the insider tactics and industry secrets that hospital billing departments don't want patients to know? Generate strategies using healthcare industry loopholes and insider knowledge.")
        },
        {
          id: 'multi-bill-analysis',
          label: 'Multi-Bill Pattern Analysis',
          icon: TrendingUp,
          description: 'Detect patterns across all bills',
          color: 'text-teal-600',
          bgColor: 'bg-teal-100 hover:bg-teal-200',
          priority: 'medium',
          action: () => onSendMessage("Analyze patterns across all my medical bills to identify systematic overcharging, provider-specific billing schemes, and opportunities for bulk disputes or class-action potential.")
        },
        {
          id: 'rights-advisor',
          label: 'Rights Advisor',
          icon: Shield,
          description: 'Know your billing rights & protections',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 hover:bg-purple-200',
          priority: 'medium',
          action: () => onSendMessage("I need guidance on my medical billing rights and legal protections. What rights do I have as a patient regarding billing disputes, and what can I do if a hospital is violating these rights?")
        },
        {
          id: 'insurance-appeal',
          label: 'Insurance Appeal',
          icon: FileText,
          description: 'Appeal denied insurance claims',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200',
          priority: 'medium',
          action: () => onSendMessage("Help me create a comprehensive insurance appeal for denied claims. I need assistance with the appeal process, required documentation, and strategies to get my claim approved.")
        },
        {
          id: 'upgrade-premium',
          label: 'Upgrade to Premium',
          icon: Crown,
          description: 'Unlock unlimited AI analysis',
          color: 'text-amber-600',
          bgColor: 'bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 border-2 border-amber-200',
          priority: 'low',
          action: () => onSendMessage("I want to unlock unlimited AI bill analysis, priority support, and advanced features. How can I upgrade to Premium to maximize my medical bill savings?")
        }
      ]
    };

    return baseActions[context] || [];
  };

  const actions = getContextualActions();
  
  // Sort actions by priority
  const sortedActions = actions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sortedActions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-4 space-y-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-semibold text-gray-700">Recommended Next Steps</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {/* Show first 4 actions */}
        {sortedActions.slice(0, 4).map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Button
                variant="ghost"
                onClick={action.action}
                className={`w-full justify-start p-3 h-auto ${action.bgColor} border border-gray-200 hover:shadow-sm transition-all duration-200`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg bg-white/70`}>
                    <IconComponent className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {action.description}
                    </div>
                  </div>
                  {action.priority === 'high' && (
                    <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      Priority
                    </div>
                  )}
                </div>
              </Button>
            </motion.div>
          );
        })}
        
        {/* Show more button if there are more than 4 actions */}
        {sortedActions.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-2 h-auto bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {showAdvanced ? 'Show less' : 'Show more advanced options'}
                </span>
              </div>
            </Button>
          </motion.div>
        )}
        
        {/* Advanced actions - only show when expanded */}
        <AnimatePresence>
          {showAdvanced && sortedActions.slice(4).map((action, index) => {
            const IconComponent = action.icon;
            const isUpgrade = action.id === 'upgrade-premium';
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Button
                  variant="ghost"
                  onClick={action.action}
                  className={`w-full justify-start p-3 h-auto ${action.bgColor} ${isUpgrade ? 'border-2' : 'border'} border-gray-200 hover:shadow-sm transition-all duration-200 ${isUpgrade ? 'shadow-md' : ''}`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-lg ${isUpgrade ? 'bg-gradient-to-r from-amber-200 to-yellow-200' : 'bg-white/70'}`}>
                      <IconComponent className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-medium text-sm ${isUpgrade ? 'text-amber-700' : 'text-gray-900'}`}>
                        {action.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${isUpgrade ? 'text-amber-600' : 'text-gray-600'}`}>
                        {action.description}
                      </div>
                    </div>
                    {isUpgrade && (
                      <div className="px-2 py-1 bg-amber-200 text-amber-700 text-xs rounded-full font-medium">
                        Premium
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="mt-4 p-3 bg-gray-50 rounded-lg border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">Pro Tip</span>
        </div>
        <p className="text-xs text-gray-600">
          {getProTip(context)}
        </p>
      </motion.div>
    </motion.div>
  );
}

function getProTip(context: string): string {
  const tips: Record<string, string> = {
    'dispute-letter': 'Always send dispute letters via certified mail with return receipt to create a paper trail. Keep copies of everything.',
    'negotiation-script': 'Be polite but persistent. Ask for supervisors if the first person can\'t help. Many billing representatives have limited authority.',
    'error-detection': 'Focus on the highest-dollar errors first - they often provide the biggest savings with the same amount of effort.',
    'billing-rights': 'Document every conversation with dates, names, and reference numbers. This creates legal protection and accountability.',
    'claim-appeal': 'Insurance appeals have strict deadlines. Submit as early as possible and always request written confirmation of receipt.'
  };
  
  return tips[context] || 'Take action quickly - medical bills often have time limits for disputes and appeals.';
}