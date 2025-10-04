export interface CaseStudy {
  id: string;
  title: string;
  originalBill: string;
  finalAmount: string;
  savings: string;
  savingsPercentage: string;
  timeline: string;
  strategy: string;
  patient: string;
  condition: string;
  keyTactics: string[];
  difficulty: number;
  category: string;
  
  fullStory: {
    situation: string;
    challenge: string;
    approach: string[];
    outcome: string;
  };
  
  detailedTimeline: Array<{
    week: string;
    action: string;
    result: string;
    icon: string;
  }>;
  
  tacticsBreakdown: Array<{
    tactic: string;
    description: string;
    savingsImpact: string;
    difficulty: string;
  }>;
  
  lessonsLearned: string[];
  applicableTo: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "emergency-room-overcharge",
    title: "Emergency Room Overcharge",
    originalBill: "$29,500",
    finalAmount: "$6,500",
    savings: "$23,000",
    savingsPercentage: "78%",
    timeline: "6 weeks",
    strategy: "CPT Code Challenge + Charity Care",
    patient: "Single mother, unemployed",
    condition: "Emergency appendectomy with complications",
    keyTactics: [
      "Challenged Level 5 ED coding without documentation",
      "Disputed surgical supply charges for unused items",
      "Applied for charity care within 30-day window",
      "Negotiated final settlement at Medicare rates"
    ],
    difficulty: 2,
    category: "Emergency Room Bills",
    
    fullStory: {
      situation: "Maria, a single mother of two, rushed to the ER with severe abdominal pain at 2 AM. She was diagnosed with acute appendicitis requiring emergency surgery. Without insurance and recently laid off, she received a bill for $29,500 two weeks later.",
      challenge: "The bill included charges for the highest level of emergency care (Level 5), expensive surgical supplies, and room charges that seemed inflated. With no income and two children to support, Maria couldn't afford even a fraction of this amount.",
      approach: [
        "Requested itemized bill and medical records immediately",
        "Identified Level 5 ED code used without proper documentation",
        "Found duplicate charges for surgical supplies totaling $3,200",
        "Discovered unused equipment charges of $1,800",
        "Applied for hospital charity care program within 30 days",
        "Presented financial hardship documentation",
        "Negotiated remaining balance at Medicare rates (68% discount)",
        "Arranged $50/month payment plan for final amount"
      ],
      outcome: "After 6 weeks of documentation, disputes, and negotiation, Maria's bill was reduced from $29,500 to $6,500. The hospital's charity care program covered $18,000, and the remaining $5,000 was negotiated down to $6,500 at Medicare rates. She now pays $50/month with no interest."
    },
    
    detailedTimeline: [
      {
        week: "Week 1",
        action: "Received bill and requested itemized statement and medical records",
        result: "Hospital sent 47-page itemized bill revealing specific charge codes",
        icon: "FileText"
      },
      {
        week: "Week 2",
        action: "Analyzed charges and identified billing errors and overcharges",
        result: "Found $5,000 in duplicate/incorrect charges, Level 5 ED without documentation",
        icon: "Search"
      },
      {
        week: "Week 3",
        action: "Submitted formal dispute letter and charity care application",
        result: "Hospital billing department acknowledged receipt and began review",
        icon: "Mail"
      },
      {
        week: "Week 4",
        action: "Follow-up call to billing department and financial assistance office",
        result: "Charity care approved for $18,000 reduction based on zero income",
        icon: "Phone"
      },
      {
        week: "Week 5",
        action: "Negotiated remaining balance citing Medicare rates and billing errors",
        result: "Hospital agreed to Medicare rates (68% of billed charges)",
        icon: "Handshake"
      },
      {
        week: "Week 6",
        action: "Finalized payment plan and received revised bill statement",
        result: "Final bill: $6,500 with $50/month payment plan, 0% interest",
        icon: "CheckCircle"
      }
    ],
    
    tacticsBreakdown: [
      {
        tactic: "Level 5 ED Code Challenge",
        description: "Emergency rooms often bill for the highest level of care (Level 5) which requires specific documentation of life-threatening conditions. Maria's case didn't meet these criteria.",
        savingsImpact: "$2,400",
        difficulty: "Medium"
      },
      {
        tactic: "Duplicate Charge Dispute",
        description: "Found surgical supplies billed twice and OR time counted incorrectly. Hospitals make these errors frequently.",
        savingsImpact: "$3,200",
        difficulty: "Easy"
      },
      {
        tactic: "Charity Care Application",
        description: "Most hospitals have charity care programs but don't advertise them. Applied within 30-day window with income documentation.",
        savingsImpact: "$18,000",
        difficulty: "Easy"
      },
      {
        tactic: "Medicare Rate Negotiation",
        description: "Negotiated remaining balance to Medicare rates (typically 32% of billed charges for ER services).",
        savingsImpact: "$5,900",
        difficulty: "Hard"
      }
    ],
    
    lessonsLearned: [
      "Always request itemized bills within 30 days",
      "Level 5 ED codes require specific documentation - challenge them",
      "Apply for charity care immediately if unemployed",
      "Duplicate charges are common in emergency situations",
      "Medicare rates are the baseline for negotiation",
      "Hospitals would rather get some payment than send to collections"
    ],
    
    applicableTo: [
      "Emergency room visits",
      "Uninsured patients",
      "Unemployed or low-income individuals",
      "Surgical procedures",
      "Hospital stays with complications"
    ]
  },
  
  {
    id: "surgical-procedure-gfe-violation",
    title: "Surgical Procedure - GFE Violation",
    originalBill: "$23,700",
    finalAmount: "$8,300",
    savings: "$15,400",
    savingsPercentage: "65%",
    timeline: "4 weeks",
    strategy: "Good Faith Estimate Violation",
    patient: "Self-employed contractor",
    condition: "Outpatient surgery, out-of-network",
    keyTactics: [
      "Leveraged Good Faith Estimate requirements",
      "Documented estimate vs. actual bill discrepancies",
      "Negotiated based on Medicare reimbursement rates",
      "Used end-of-fiscal-year timing for leverage"
    ],
    difficulty: 1,
    category: "Surgical Procedures",
    
    fullStory: {
      situation: "James, a self-employed contractor, needed outpatient knee surgery. He requested a cost estimate beforehand and was quoted $10,000. The actual bill arrived at $23,700 - more than double the estimate.",
      challenge: "The hospital claimed 'complications' and 'additional procedures' but James's medical records showed a routine surgery. As a self-employed individual, he had a high-deductible plan and was responsible for the full amount out-of-network.",
      approach: [
        "Retrieved original cost estimate email from hospital",
        "Compared estimate line-by-line with actual bill",
        "Identified $13,700 in charges not mentioned in estimate",
        "Researched Good Faith Estimate federal law (effective 2022)",
        "Sent formal dispute citing No Surprises Act violations",
        "Hospital offered 30% reduction, countered with Medicare rates",
        "Negotiated during fiscal year-end when hospitals need to close books",
        "Final agreement at $8,300 (35% of billed charges)"
      ],
      outcome: "The Good Faith Estimate law requires providers to give accurate estimates within $400 of actual charges. James's bill exceeded this by $13,700. After presenting evidence and citing federal law, the hospital reduced his bill by 65% to avoid potential penalties."
    },
    
    detailedTimeline: [
      {
        week: "Week 1",
        action: "Received bill and retrieved original cost estimate documentation",
        result: "Found 137% discrepancy between estimate ($10,000) and bill ($23,700)",
        icon: "AlertTriangle"
      },
      {
        week: "Week 2",
        action: "Sent formal dispute letter citing No Surprises Act and GFE violations",
        result: "Hospital responded with 'under review' and offered 15% reduction",
        icon: "Mail"
      },
      {
        week: "Week 3",
        action: "Escalated to patient advocate and cited Medicare rates ($7,200 for procedure)",
        result: "Hospital offered 30% reduction to $16,590, rejected and countered with $8,000",
        icon: "TrendingUp"
      },
      {
        week: "Week 4",
        action: "Final negotiation during fiscal year-end, settled at $8,300",
        result: "65% reduction achieved, payment plan of $350/month for 24 months",
        icon: "Handshake"
      }
    ],
    
    tacticsBreakdown: [
      {
        tactic: "Good Faith Estimate Violation",
        description: "Federal law requires estimates within $400 of actual charges. This bill exceeded by $13,700, giving strong legal leverage.",
        savingsImpact: "$10,000",
        difficulty: "Easy"
      },
      {
        tactic: "Medicare Rate Comparison",
        description: "Medicare would have paid $7,200 for this procedure. Used this as baseline for negotiation.",
        savingsImpact: "$3,400",
        difficulty: "Medium"
      },
      {
        tactic: "Fiscal Year-End Timing",
        description: "Negotiated in June when hospitals need to close books. They're more willing to settle and write off debt.",
        savingsImpact: "$2,000",
        difficulty: "Medium"
      }
    ],
    
    lessonsLearned: [
      "Always get cost estimates in writing before procedures",
      "Good Faith Estimate law protects against surprise bills",
      "Estimates must be within $400 of actual charges",
      "Medicare rates are typically 35% of billed charges",
      "Fiscal year-end (June) is best time to negotiate",
      "Hospitals will negotiate to avoid collections and write-offs"
    ],
    
    applicableTo: [
      "Outpatient surgeries",
      "Self-pay patients",
      "Out-of-network procedures",
      "High-deductible health plans",
      "Any bill exceeding written estimates"
    ]
  },
  
  {
    id: "hospital-stay-itemized-analysis",
    title: "Multi-Day Hospital Stay",
    originalBill: "$45,200",
    finalAmount: "$18,800",
    savings: "$26,400",
    savingsPercentage: "58%",
    timeline: "8 weeks",
    strategy: "Itemized Analysis + Payment Plan",
    patient: "Retired teacher, Medicare + supplement",
    condition: "Cardiac procedure with complications",
    keyTactics: [
      "Found room charge errors totaling $4,200",
      "Disputed phantom operating room time charges",
      "Negotiated charity care for non-covered services",
      "Structured 0% payment plan for remaining balance"
    ],
    difficulty: 3,
    category: "Hospital Stays",
    
    fullStory: {
      situation: "Dorothy, a 68-year-old retired teacher, underwent a cardiac catheterization that led to a 5-day hospital stay. Her Medicare and supplement insurance covered most costs, but she received a bill for $45,200 for 'non-covered services' and 'excess charges.'",
      challenge: "The bill was complex with hundreds of line items. Medicare had paid their portion, but the hospital was billing Dorothy for charges they claimed exceeded Medicare's approved amounts, plus services they said weren't covered.",
      approach: [
        "Requested full itemized bill (127 pages)",
        "Compared every charge against Medicare's Explanation of Benefits",
        "Found $4,200 in room charges for days she wasn't admitted",
        "Identified $6,800 in 'phantom' OR time charges",
        "Discovered $8,200 in charges Medicare already paid",
        "Contacted Medicare to confirm payment amounts",
        "Filed formal dispute with hospital billing compliance",
        "Negotiated charity care for legitimate non-covered services",
        "Structured $50/month payment plan for final balance"
      ],
      outcome: "After 8 weeks of line-by-line analysis and multiple rounds of disputes, Dorothy's bill was reduced from $45,200 to $18,800. $15,400 in errors were removed, and $11,000 was covered through the hospital's charity care program for Medicare patients."
    },
    
    detailedTimeline: [
      {
        week: "Week 1-2",
        action: "Requested and received 127-page itemized bill and all EOBs from Medicare",
        result: "Identified clear discrepancies between hospital charges and Medicare payments",
        icon: "FileText"
      },
      {
        week: "Week 3",
        action: "Line-by-line analysis revealed $4,200 in room charges for non-admission dates",
        result: "Also found $6,800 in phantom OR time charges (billed 8 hours, surgery was 2 hours)",
        icon: "Search"
      },
      {
        week: "Week 4",
        action: "Contacted Medicare to verify payments and confirm hospital's billing errors",
        result: "Medicare confirmed $8,200 already paid by them was being double-billed",
        icon: "Phone"
      },
      {
        week: "Week 5",
        action: "Submitted 14-page dispute letter with Medicare EOBs and charge analysis",
        result: "Hospital acknowledged $19,000 in billing errors and reversed charges",
        icon: "Mail"
      },
      {
        week: "Week 6-7",
        action: "Applied for charity care for remaining non-covered services",
        result: "Charity care approved $11,000 reduction based on Medicare coverage limits",
        icon: "Heart"
      },
      {
        week: "Week 8",
        action: "Negotiated payment plan for final $18,800 balance",
        result: "0% interest, $50/month for remaining balance, total reduction of 58%",
        icon: "Handshake"
      }
    ],
    
    tacticsBreakdown: [
      {
        tactic: "Room Charge Audit",
        description: "Cross-referenced admission/discharge dates with daily room charges. Found billing for 3 extra days not stayed.",
        savingsImpact: "$4,200",
        difficulty: "Easy"
      },
      {
        tactic: "OR Time Verification",
        description: "Compared surgical report (2-hour procedure) with billed OR time (8 hours). Phantom charges removed.",
        savingsImpact: "$6,800",
        difficulty: "Medium"
      },
      {
        tactic: "Medicare EOB Cross-Reference",
        description: "Found charges Medicare had already paid being billed again to patient. Common billing error.",
        savingsImpact: "$8,200",
        difficulty: "Medium"
      },
      {
        tactic: "Medicare Charity Care",
        description: "Hospitals have special charity care programs for Medicare patients with coverage gaps.",
        savingsImpact: "$11,000",
        difficulty: "Easy"
      }
    ],
    
    lessonsLearned: [
      "Always request itemized bills for hospital stays",
      "Cross-reference every charge with insurance EOBs",
      "Room charges are frequently wrong - verify dates",
      "OR time charges are easy to inflate - check surgical reports",
      "Medicare patients have special charity care options",
      "Hospitals make errors with Medicare billing constantly",
      "Payment plans with 0% interest are always negotiable"
    ],
    
    applicableTo: [
      "Hospital stays over 2 days",
      "Medicare patients",
      "Cardiac procedures",
      "Any surgery requiring OR time",
      "Patients with insurance coverage gaps"
    ]
  },
  
  {
    id: "imaging-upcoding-radiology",
    title: "Imaging & Lab Upcoding",
    originalBill: "$8,900",
    finalAmount: "$2,100",
    savings: "$6,800",
    savingsPercentage: "76%",
    timeline: "3 weeks",
    strategy: "CPT Code Downgrading",
    patient: "Insured office worker",
    condition: "Routine MRI and blood work",
    keyTactics: [
      "Challenged 'with contrast' coding for standard MRI",
      "Disputed comprehensive metabolic panel vs. basic ordered",
      "Used insurance EOB to prove coding errors",
      "Threatened appeal to insurance company"
    ],
    difficulty: 1,
    category: "Imaging & Labs",
    
    fullStory: {
      situation: "Kevin had routine blood work and an MRI ordered by his doctor. His insurance covered most of it, but he received a surprise bill for $8,900 for 'additional tests and enhanced imaging' that weren't covered.",
      challenge: "The hospital had billed for 'MRI with contrast' and a 'comprehensive metabolic panel' but Kevin's doctor only ordered a standard MRI and basic blood work. The upcoded charges weren't covered by insurance.",
      approach: [
        "Compared actual orders from doctor with billed CPT codes",
        "Found MRI billed as 'with contrast' (72148) instead of 'without' (72146)",
        "Lab work billed as comprehensive (80053) instead of basic (80048)",
        "Contacted insurance company to confirm these upgrades weren't pre-authorized",
        "Sent dispute letter with doctor's original orders attached",
        "Hospital corrected coding within 2 weeks",
        "Insurance covered newly coded charges, reducing patient responsibility by 76%"
      ],
      outcome: "The hospital admitted to coding errors and resubmitted claims with correct CPT codes. Insurance covered the corrected charges, reducing Kevin's bill from $8,900 to $2,100 (his deductible portion)."
    },
    
    detailedTimeline: [
      {
        week: "Week 1",
        action: "Received $8,900 bill and compared to insurance EOB and doctor's orders",
        result: "Found CPT code discrepancies: MRI and lab work both upcoded",
        icon: "AlertTriangle"
      },
      {
        week: "Week 2",
        action: "Called insurance to verify codes weren't pre-authorized, sent dispute to hospital",
        result: "Insurance confirmed upcoding, hospital agreed to review and correct",
        icon: "Phone"
      },
      {
        week: "Week 3",
        action: "Hospital resubmitted corrected claims to insurance",
        result: "Insurance processed correctly, patient bill reduced to $2,100",
        icon: "CheckCircle"
      }
    ],
    
    tacticsBreakdown: [
      {
        tactic: "MRI Code Verification",
        description: "MRI 'with contrast' costs 3x more than 'without.' Doctor's order clearly stated 'without contrast' but hospital billed higher code.",
        savingsImpact: "$4,200",
        difficulty: "Easy"
      },
      {
        tactic: "Lab Panel Downgrade",
        description: "Comprehensive metabolic panel (80053) costs double the basic panel (80048) that was actually ordered.",
        savingsImpact: "$2,600",
        difficulty: "Easy"
      }
    ],
    
    lessonsLearned: [
      "Always compare doctor's orders with billed CPT codes",
      "Upcoding is extremely common in imaging and labs",
      "Insurance companies will help you dispute upcoding",
      "Contrast MRIs cost 3x more - verify it was actually used",
      "Lab panel codes are easy to upgrade fraudulently",
      "Hospitals often fix coding errors quickly to avoid audits"
    ],
    
    applicableTo: [
      "Imaging services (MRI, CT, X-ray)",
      "Laboratory work",
      "Insured patients with high deductibles",
      "Routine diagnostic procedures",
      "Any service billed through insurance"
    ]
  },
  
  {
    id: "ambulance-surprise-bill",
    title: "Ambulance Surprise Bill",
    originalBill: "$4,200",
    finalAmount: "$850",
    savings: "$3,350",
    savingsPercentage: "80%",
    timeline: "2 weeks",
    strategy: "Air Ambulance Balance Billing Ban",
    patient: "Emergency patient, in-network hospital",
    condition: "Emergency transport to ER",
    keyTactics: [
      "Invoked No Surprises Act for emergency transport",
      "Hospital was in-network, ambulance can't balance bill",
      "Negotiated to in-network rates",
      "Cited state balance billing protections"
    ],
    difficulty: 1,
    category: "Ambulance Services",
    
    fullStory: {
      situation: "Lisa had a medical emergency and was transported by ambulance to an in-network hospital. She received a $4,200 bill from the ambulance company claiming they were out-of-network.",
      challenge: "The ambulance company was trying to 'balance bill' her for the difference between their charges and what insurance paid. This is illegal under the No Surprises Act for emergency services.",
      approach: [
        "Verified hospital was in-network for her insurance",
        "Researched No Surprises Act protections (effective 2022)",
        "Sent letter citing federal balance billing ban for emergency services",
        "Contacted insurance company to file complaint",
        "Ambulance company immediately reduced bill to in-network rates",
        "Final bill: $850 (her in-network copay)"
      ],
      outcome: "Under federal law, patients can't be balance billed for emergency ambulance transport to in-network facilities. The ambulance company withdrew their $4,200 claim and accepted the $850 insurance payment plus copay."
    },
    
    detailedTimeline: [
      {
        week: "Week 1",
        action: "Received $4,200 ambulance bill, researched No Surprises Act protections",
        result: "Confirmed emergency transport is protected from balance billing",
        icon: "AlertTriangle"
      },
      {
        week: "Week 2",
        action: "Sent letter to ambulance company and notified insurance of violation",
        result: "Ambulance company withdrew bill and accepted in-network rate of $850",
        icon: "CheckCircle"
      }
    ],
    
    tacticsBreakdown: [
      {
        tactic: "No Surprises Act Protection",
        description: "Federal law bans balance billing for emergency ambulance transport. Ambulance must accept in-network rates.",
        savingsImpact: "$3,350",
        difficulty: "Easy"
      }
    ],
    
    lessonsLearned: [
      "Emergency ambulance transport cannot be balance billed",
      "No Surprises Act protects patients from out-of-network emergency charges",
      "Always verify hospital is in-network before disputing",
      "Ambulance companies often try illegal balance billing",
      "Insurance companies will advocate for you in these cases",
      "These disputes are resolved quickly when law is cited"
    ],
    
    applicableTo: [
      "Emergency ambulance transport",
      "Out-of-network ambulance companies",
      "Emergency room visits",
      "Any emergency medical transport",
      "Insured patients receiving emergency care"
    ]
  },
  
  {
    id: "physician-fee-negotiation",
    title: "Physician Fee Reduction",
    originalBill: "$12,400",
    finalAmount: "$3,100",
    savings: "$9,300",
    savingsPercentage: "75%",
    timeline: "5 weeks",
    strategy: "Self-Pay Discount + Prompt Payment",
    patient: "Uninsured patient",
    condition: "Surgical consultation and follow-ups",
    keyTactics: [
      "Requested self-pay discount (hospitals charge insurance 3-4x more)",
      "Offered lump sum payment for immediate discount",
      "Negotiated based on Medicare physician fee schedule",
      "Eliminated facility fees by using office visits"
    ],
    difficulty: 2,
    category: "Physician Fees",
    
    fullStory: {
      situation: "Tom needed consultation with a surgeon for a potential procedure. Without insurance, he received bills totaling $12,400 for the surgeon's fees, facility fees, and follow-up appointments.",
      challenge: "The billed rates were 4x higher than Medicare rates because hospitals inflate charges for insurance companies. As a self-pay patient, Tom was being charged these inflated 'rack rates.'",
      approach: [
        "Researched Medicare physician fee schedule for his procedure codes",
        "Found Medicare would pay $2,800 for the same services",
        "Called surgeon's billing office to negotiate self-pay rates",
        "Offered to pay $3,500 cash if reduced immediately",
        "Eliminated $4,200 in facility fees by requesting office-only visits",
        "Negotiated remaining physician fees to $3,100 total",
        "Paid immediately for additional 10% discount"
      ],
      outcome: "By leveraging self-pay status, Medicare rate comparisons, and prompt payment, Tom reduced his physician bills by 75%. Self-pay patients often get better rates than insurance companies when they negotiate."
    },
    
    detailedTimeline: [
      {
        week: "Week 1",
        action: "Received $12,400 in physician and facility bills",
        result: "Researched Medicare fee schedules showing $2,800 benchmark",
        icon: "FileText"
      },
      {
        week: "Week 2",
        action: "Called surgeon's office to request self-pay discount",
        result: "Office offered standard 20% discount, Tom countered with Medicare rates",
        icon: "Phone"
      },
      {
        week: "Week 3",
        action: "Requested future visits be office-only to eliminate facility fees",
        result: "Eliminated $4,200 in unnecessary facility charges",
        icon: "Building"
      },
      {
        week: "Week 4",
        action: "Negotiated physician fees to $3,500, offered lump sum payment",
        result: "Office accepted $3,100 for immediate payment (additional 10% off)",
        icon: "DollarSign"
      },
      {
        week: "Week 5",
        action: "Paid $3,100 cash and received zero balance statement",
        result: "Total savings of $9,300 (75% reduction)",
        icon: "CheckCircle"
      }
    ],
    
    tacticsBreakdown: [
      {
        tactic: "Self-Pay Leverage",
        description: "Uninsured patients can negotiate better rates than insurance companies. Hospitals charge insurance 3-4x more than cash rates.",
        savingsImpact: "$4,000",
        difficulty: "Medium"
      },
      {
        tactic: "Facility Fee Elimination",
        description: "Requested office-only visits instead of hospital-based appointments. Facility fees add $800-$1,500 per visit.",
        savingsImpact: "$4,200",
        difficulty: "Easy"
      },
      {
        tactic: "Prompt Payment Discount",
        description: "Offered immediate lump sum payment for additional discount. Providers prefer cash now vs. payment plans.",
        savingsImpact: "$1,100",
        difficulty: "Easy"
      }
    ],
    
    lessonsLearned: [
      "Self-pay patients can negotiate better rates than insurance",
      "Medicare fee schedules are public and show fair rates",
      "Facility fees add thousands - request office visits only",
      "Lump sum payment gets immediate discounts",
      "Physicians' offices will negotiate to avoid billing costs",
      "Always ask for self-pay discount before agreeing to payment"
    ],
    
    applicableTo: [
      "Uninsured patients",
      "High-deductible plans not yet met",
      "Physician consultations",
      "Surgical procedures",
      "Follow-up appointments",
      "Any outpatient medical services"
    ]
  }
];
