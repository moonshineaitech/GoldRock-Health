import { db } from "./db";
import { users, medicalBills, billAnalysisResults, reductionStrategies } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Demo Account Seeding for App Store Reviewers
 * Creates appreviewer@goldrock.com with Premium access and sample bills
 */

const DEMO_EMAIL = "appreviewer@goldrock.com";
const DEMO_PASSWORD = "AppReview2025!"; // For documentation only - Replit Auth manages passwords

export async function seedDemoAccount() {
  console.log("🌱 Seeding demo account for App Store review...");

  try {
    // 1. Check if demo user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, DEMO_EMAIL))
      .limit(1);

    let demoUser;
    
    if (existingUser.length > 0) {
      console.log("✅ Demo user already exists, updating subscription status...");
      demoUser = existingUser[0];
      
      // Update to Premium (active, no expiration)
      await db
        .update(users)
        .set({
          subscriptionStatus: "active",
          subscriptionPlan: "annual",
          subscriptionEndsAt: null, // Never expires for demo
          acceptedAiTerms: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, demoUser.id));
      
      console.log("✅ Updated demo user to Premium (annual, no expiration)");
    } else {
      console.log("Creating new demo user...");
      // Create new demo user with Premium subscription
      const newUsers = await db
        .insert(users)
        .values({
          email: DEMO_EMAIL,
          firstName: "App",
          lastName: "Reviewer",
          subscriptionStatus: "active",
          subscriptionPlan: "annual",
          subscriptionEndsAt: null, // Never expires for demo
          acceptedAiTerms: true,
          aiTermsAcceptedAt: new Date(),
          aiTermsVersion: "1.0",
        })
        .returning();
      
      demoUser = newUsers[0];
      console.log("✅ Created demo user with Premium access");
    }

    // 2. Check if sample bills already exist
    const existingBills = await db
      .select()
      .from(medicalBills)
      .where(eq(medicalBills.userId, demoUser.id));

    if (existingBills.length >= 3) {
      console.log(`✅ Demo account already has ${existingBills.length} sample bills`);
      return;
    }

    // 3. Create 3 anonymized sample medical bills
    const sampleBills = [
      {
        userId: demoUser.id,
        title: "Emergency Room Visit - Chest Pain",
        providerName: "City General Hospital",
        providerAddress: "123 Medical Center Dr, San Francisco, CA 94102",
        serviceDate: new Date("2024-09-15"),
        billDate: new Date("2024-09-20"),
        dueDate: new Date("2024-10-20"),
        totalAmount: "18750.00",
        insurancePaid: "12500.00",
        patientResponsibility: "6250.00",
        originalText: "CITY GENERAL HOSPITAL\n123 Medical Center Dr, San Francisco, CA 94102\n\nPatient: John Smith\nDate of Service: 09/15/2024\n\nEmergency Department Visit - Level 4 (99284): $1,500.00\nEKG 12-Lead (93000): $450.00\nTroponin Blood Test (84484): $850.00\nChest X-Ray 2 Views (71046): $950.00\nCT Scan Chest w/Contrast (71260): $4,500.00\nEmergency Department Facility Fee: $8,000.00\nPhysician Consult - Cardiology (99244): $2,500.00\n\nTotal Charges: $18,750.00\nInsurance Paid: $12,500.00\nPatient Responsibility: $6,250.00",
        extractedData: {
          patientInfo: {
            name: "John Smith",
            policyNumber: "ABC123456789",
            memberId: "XYZ987654321",
          },
          insuranceInfo: {
            company: "Blue Cross Blue Shield",
            groupNumber: "GRP001234",
          },
          diagnosticCodes: [
            { code: "I20.0", description: "Unstable angina", type: "ICD-10" as const },
            { code: "R07.9", description: "Chest pain, unspecified", type: "ICD-10" as const },
            { code: "99284", description: "Emergency Department Visit - Level 4", type: "CPT" as const },
            { code: "93000", description: "EKG 12-Lead", type: "CPT" as const },
          ],
          lineItems: [
            { description: "Emergency Department Visit - Level 4", code: "99284", quantity: 1, unitPrice: 1500, total: 1500, dateOfService: "2024-09-15" },
            { description: "EKG 12-Lead", code: "93000", quantity: 1, unitPrice: 450, total: 450, dateOfService: "2024-09-15" },
            { description: "Troponin Blood Test", code: "84484", quantity: 1, unitPrice: 850, total: 850, dateOfService: "2024-09-15" },
            { description: "Chest X-Ray 2 Views", code: "71046", quantity: 1, unitPrice: 950, total: 950, dateOfService: "2024-09-15" },
            { description: "CT Scan Chest w/Contrast", code: "71260", quantity: 1, unitPrice: 4500, total: 4500, dateOfService: "2024-09-15" },
            { description: "Emergency Department Facility Fee", quantity: 1, unitPrice: 8000, total: 8000, dateOfService: "2024-09-15" },
            { description: "Physician Consult - Cardiology", code: "99244", quantity: 1, unitPrice: 2500, total: 2500, dateOfService: "2024-09-15" },
          ],
        },
        status: "analyzed",
        analysisStatus: "completed",
      },
      {
        userId: demoUser.id,
        title: "Outpatient Surgery - Knee Arthroscopy",
        providerName: "Orthopedic Surgery Center",
        providerAddress: "456 Surgery Blvd, Los Angeles, CA 90001",
        serviceDate: new Date("2024-08-20"),
        billDate: new Date("2024-08-25"),
        dueDate: new Date("2024-09-25"),
        totalAmount: "24500.00",
        insurancePaid: "19600.00",
        patientResponsibility: "4900.00",
        originalText: "ORTHOPEDIC SURGERY CENTER\n456 Surgery Blvd, Los Angeles, CA 90001\n\nPatient: Jane Doe\nDate of Service: 08/20/2024\n\nArthroscopy Knee Surgical (29881): $6,500.00\nAnesthesia - Knee Surgery (01382): $2,500.00\nOperating Room Fee (2 hours): $8,000.00\nRecovery Room Fee: $2,500.00\nSurgical Supplies & Equipment: $3,500.00\nPost-Op Physical Therapy Eval (97161): $450.00\nX-Ray Knee 3 Views (73562): $550.00\nDuplicate Charge - X-Ray Knee (73562): $500.00\n\nTotal Charges: $24,500.00\nInsurance Paid: $19,600.00\nPatient Responsibility: $4,900.00",
        extractedData: {
          patientInfo: {
            name: "Jane Doe",
            policyNumber: "DEF456789012",
            memberId: "UVW123456789",
          },
          insuranceInfo: {
            company: "Aetna",
            groupNumber: "GRP567890",
          },
          diagnosticCodes: [
            { code: "M23.9", description: "Internal derangement of knee", type: "ICD-10" as const },
            { code: "29881", description: "Arthroscopy Knee Surgical", type: "CPT" as const },
            { code: "73562", description: "X-Ray Knee 3 Views", type: "CPT" as const },
          ],
          lineItems: [
            { description: "Arthroscopy Knee Surgical", code: "29881", quantity: 1, unitPrice: 6500, total: 6500, dateOfService: "2024-08-20" },
            { description: "Anesthesia - Knee Surgery", code: "01382", quantity: 1, unitPrice: 2500, total: 2500, dateOfService: "2024-08-20" },
            { description: "Operating Room Fee (2 hours)", quantity: 2, unitPrice: 4000, total: 8000, dateOfService: "2024-08-20" },
            { description: "Recovery Room Fee", quantity: 1, unitPrice: 2500, total: 2500, dateOfService: "2024-08-20" },
            { description: "Surgical Supplies & Equipment", quantity: 1, unitPrice: 3500, total: 3500, dateOfService: "2024-08-20" },
            { description: "Post-Op Physical Therapy Eval", code: "97161", quantity: 1, unitPrice: 450, total: 450, dateOfService: "2024-08-20" },
            { description: "X-Ray Knee 3 Views", code: "73562", quantity: 1, unitPrice: 550, total: 550, dateOfService: "2024-08-20" },
            { description: "Duplicate Charge - X-Ray Knee", code: "73562", quantity: 1, unitPrice: 500, total: 500, dateOfService: "2024-08-20" },
          ],
        },
        status: "analyzed",
        analysisStatus: "completed",
      },
      {
        userId: demoUser.id,
        title: "Hospital Stay - Pneumonia Treatment",
        providerName: "Metro Medical Center",
        providerAddress: "789 Hospital Way, Chicago, IL 60601",
        serviceDate: new Date("2024-07-10"),
        billDate: new Date("2024-07-18"),
        dueDate: new Date("2024-08-18"),
        totalAmount: "42300.00",
        insurancePaid: "33840.00",
        patientResponsibility: "8460.00",
        originalText: "METRO MEDICAL CENTER\n789 Hospital Way, Chicago, IL 60601\n\nPatient: Robert Johnson\nDate of Service: 07/10/2024 - 07/14/2024 (4 days)\n\nInpatient Hospital Room & Board (4 days): $12,000.00\nPhysician Daily Visits (99233) x 4: $2,000.00\nChest X-Ray (71046) x 2: $1,200.00\nCT Chest w/ Contrast (71260): $5,500.00\nBlood Culture (87040) x 3: $1,800.00\nComplete Blood Count (85025) x 4: $800.00\nIV Antibiotics - Ceftriaxone (J0696) x 8: $4,500.00\nRespiratory Therapy (94640) x 8: $3,200.00\nPharmacy Charges: $6,500.00\nLaboratory Services: $2,800.00\nEmergency Room (Initial - 99285): $2,000.00\n\nTotal Charges: $42,300.00\nInsurance Paid: $33,840.00\nPatient Responsibility: $8,460.00",
        extractedData: {
          patientInfo: {
            name: "Robert Johnson",
            policyNumber: "GHI789012345",
            memberId: "RST456789012",
          },
          insuranceInfo: {
            company: "UnitedHealthcare",
            groupNumber: "GRP789012",
          },
          diagnosticCodes: [
            { code: "J18.9", description: "Pneumonia, unspecified organism", type: "ICD-10" as const },
            { code: "R05.9", description: "Cough, unspecified", type: "ICD-10" as const },
            { code: "99233", description: "Subsequent hospital care", type: "CPT" as const },
            { code: "71046", description: "Chest X-Ray", type: "CPT" as const },
          ],
          lineItems: [
            { description: "Inpatient Hospital Room & Board", quantity: 4, unitPrice: 3000, total: 12000, dateOfService: "2024-07-10" },
            { description: "Physician Daily Visits", code: "99233", quantity: 4, unitPrice: 500, total: 2000, dateOfService: "2024-07-10" },
            { description: "Chest X-Ray", code: "71046", quantity: 2, unitPrice: 600, total: 1200, dateOfService: "2024-07-10" },
            { description: "CT Chest w/ Contrast", code: "71260", quantity: 1, unitPrice: 5500, total: 5500, dateOfService: "2024-07-11" },
            { description: "Blood Culture", code: "87040", quantity: 3, unitPrice: 600, total: 1800, dateOfService: "2024-07-10" },
            { description: "Complete Blood Count", code: "85025", quantity: 4, unitPrice: 200, total: 800, dateOfService: "2024-07-10" },
            { description: "IV Antibiotics - Ceftriaxone", code: "J0696", quantity: 8, unitPrice: 562.50, total: 4500, dateOfService: "2024-07-10" },
            { description: "Respiratory Therapy", code: "94640", quantity: 8, unitPrice: 400, total: 3200, dateOfService: "2024-07-10" },
            { description: "Pharmacy Charges", quantity: 1, unitPrice: 6500, total: 6500, dateOfService: "2024-07-10" },
            { description: "Laboratory Services", quantity: 1, unitPrice: 2800, total: 2800, dateOfService: "2024-07-10" },
            { description: "Emergency Room (Initial)", code: "99285", quantity: 1, unitPrice: 2000, total: 2000, dateOfService: "2024-07-10" },
          ],
        },
        status: "analyzed",
        analysisStatus: "completed",
      },
    ];

    console.log("📝 Creating 3 sample medical bills...");
    const createdBills = await db.insert(medicalBills).values(sampleBills).returning();
    console.log(`✅ Created ${createdBills.length} sample bills`);

    // 4. Create analysis results for each bill
    console.log("🔍 Generating AI analysis results...");
    
    const analysisResults = [
      {
        billId: createdBills[0].id,
        overallScore: 68,
        potentialSavings: "3250.00",
        confidenceLevel: 92,
        analysisDetails: {
          codeAccuracy: {
            score: 75,
            issues: [
              {
                code: "99284",
                issue: "Emergency visit level 4 may be upcoded - symptoms suggest level 3 is appropriate",
                severity: "medium" as const,
                potentialSaving: 500,
              },
              {
                code: "FACILITY",
                issue: "Emergency facility fee of $8,000 exceeds regional average by 180%",
                severity: "high" as const,
                potentialSaving: 2750,
              },
            ],
          },
          pricingAnalysis: {
            marketComparison: {
              percentile: 92,
              averagePrice: 12500,
              yourPrice: 18750,
            },
            overcharges: [
              {
                item: "Emergency Department Facility Fee",
                chargedAmount: 8000,
                fairPrice: 5250,
                overchargeAmount: 2750,
                explanation: "Facility fee is 180% above regional average",
              },
            ],
          },
          insuranceCoverage: {
            properlyProcessed: true,
            issues: [],
          },
          duplicateCharges: [],
          unbundlingIssues: [],
        },
        redFlags: [
          {
            type: "pricing" as const,
            description: "Emergency facility fee 180% above regional average",
            severity: "high" as const,
            evidence: "Charged $8,000 vs regional average $2,857 (CMS data)",
            recommendedAction: "Request itemized justification and negotiate based on Medicare rates",
            potentialSaving: 2750,
          },
          {
            type: "coding" as const,
            description: "Possible upcoding of emergency visit level",
            severity: "medium" as const,
            evidence: "Level 4 visit (99284) billed, but medical necessity suggests level 3 (99283)",
            recommendedAction: "Request medical records to verify visit complexity",
            potentialSaving: 500,
          },
        ],
      },
      {
        billId: createdBills[1].id,
        overallScore: 62,
        potentialSavings: "4850.00",
        confidenceLevel: 88,
        analysisDetails: {
          codeAccuracy: {
            score: 70,
            issues: [
              {
                code: "73562",
                issue: "Duplicate X-Ray charge detected - same code billed twice on same date",
                severity: "high" as const,
                potentialSaving: 500,
              },
              {
                code: "OR-FEE",
                issue: "Operating room fee exceeds Medicare allowable by 250%",
                severity: "high" as const,
                potentialSaving: 3500,
              },
            ],
          },
          pricingAnalysis: {
            marketComparison: {
              percentile: 88,
              averagePrice: 16800,
              yourPrice: 24500,
            },
            overcharges: [
              {
                item: "Operating Room Fee",
                chargedAmount: 8000,
                fairPrice: 4500,
                overchargeAmount: 3500,
                explanation: "Operating room fee exceeds Medicare allowable by 250%",
              },
              {
                item: "Surgical Supplies",
                chargedAmount: 3500,
                fairPrice: 2650,
                overchargeAmount: 850,
                explanation: "Surgical supplies markup above industry standard",
              },
            ],
          },
          insuranceCoverage: {
            properlyProcessed: true,
            issues: [],
          },
          duplicateCharges: [
            {
              description: "X-Ray Knee (73562) charged twice",
              amount: 500,
              dates: ["2024-08-20"],
            },
          ],
          unbundlingIssues: [],
        },
        redFlags: [
          {
            type: "duplicate" as const,
            description: "Duplicate X-Ray charge on same date",
            severity: "critical" as const,
            evidence: "Code 73562 appears twice: $550 and $500 on 08/20/2024",
            recommendedAction: "Demand immediate removal of duplicate charge",
            potentialSaving: 500,
          },
          {
            type: "pricing" as const,
            description: "Operating room fee 250% above Medicare allowable",
            severity: "high" as const,
            evidence: "Charged $8,000 vs Medicare allowable $2,286 (CPT 29881 facility fee)",
            recommendedAction: "Negotiate to Medicare +50% rate (~$3,400)",
            potentialSaving: 3500,
          },
        ],
      },
      {
        billId: createdBills[2].id,
        overallScore: 71,
        potentialSavings: "5800.00",
        confidenceLevel: 90,
        analysisDetails: {
          codeAccuracy: {
            score: 78,
            issues: [
              {
                code: "ROOM",
                issue: "Daily room charges 220% above regional average for semi-private",
                severity: "high" as const,
                potentialSaving: 4200,
              },
              {
                code: "PHARMACY",
                issue: "Pharmacy charges lack itemization - potential markup",
                severity: "medium" as const,
                potentialSaving: 1600,
              },
            ],
          },
          pricingAnalysis: {
            marketComparison: {
              percentile: 90,
              averagePrice: 28500,
              yourPrice: 42300,
            },
            overcharges: [
              {
                item: "Hospital Room & Board (4 days)",
                chargedAmount: 12000,
                fairPrice: 7800,
                overchargeAmount: 4200,
                explanation: "Daily room rate 220% above regional average for semi-private",
              },
              {
                item: "Pharmacy Charges",
                chargedAmount: 6500,
                fairPrice: 4900,
                overchargeAmount: 1600,
                explanation: "Pharmacy charges lack itemization with potential markup",
              },
            ],
          },
          insuranceCoverage: {
            properlyProcessed: true,
            issues: [],
          },
          duplicateCharges: [],
          unbundlingIssues: [],
        },
        redFlags: [
          {
            type: "pricing" as const,
            description: "Daily room rate 220% above regional average",
            severity: "high" as const,
            evidence: "Charged $3,000/day vs regional average $1,365/day (semi-private)",
            recommendedAction: "Request room classification verification and negotiate to fair market rate",
            potentialSaving: 4200,
          },
          {
            type: "pricing" as const,
            description: "Pharmacy charges lack itemization",
            severity: "medium" as const,
            evidence: "Lump sum $6,500 pharmacy charge without medication breakdown",
            recommendedAction: "Demand itemized pharmacy bill with NDC codes and unit prices",
            potentialSaving: 1600,
          },
        ],
      },
    ];

    const createdAnalyses = await db.insert(billAnalysisResults).values(analysisResults).returning();
    console.log(`✅ Created ${createdAnalyses.length} analysis results`);

    // 5. Create reduction strategies for each bill
    console.log("💡 Generating reduction strategies...");
    
    const strategies = [
      {
        billId: createdBills[0].id,
        analysisId: createdAnalyses[0].id,
        strategyType: "negotiate_pricing",
        priority: 9,
        potentialSaving: "2750.00",
        successProbability: 78,
        difficultyLevel: "medium",
        estimatedTimeRequired: 45,
        title: "Negotiate Emergency Facility Fee",
        description: "The $8,000 emergency facility fee is 180% above regional average. Hospitals often negotiate this down.",
        actionSteps: [
          {
            stepNumber: 1,
            action: "Request itemized breakdown",
            details: "Contact billing department and request detailed breakdown of the $8,000 facility fee",
            expectedOutcome: "Receive itemized list showing components of facility charge",
            timeframe: "3-5 business days",
          },
          {
            stepNumber: 2,
            action: "Compare to Medicare rates",
            details: "Look up Medicare allowable rate for ER facility fee in your region (typically ~$2,857)",
            expectedOutcome: "Establish fair market benchmark for negotiation",
            timeframe: "1 day",
          },
          {
            stepNumber: 3,
            action: "Submit payment offer",
            details: "Offer to pay 150% of Medicare rate (~$4,286) as full settlement",
            expectedOutcome: "Hospital agrees to reduced amount or counter-offers",
            timeframe: "1-2 weeks",
          },
        ],
        requiredDocuments: ["Itemized bill", "Medicare fee schedule", "Payment offer letter"],
        legalBasis: "Price transparency laws require hospitals to provide reasonable and customary rates. Emergency facility fees are often excessive and negotiable.",
      },
      {
        billId: createdBills[1].id,
        analysisId: createdAnalyses[1].id,
        strategyType: "dispute_errors",
        priority: 10,
        potentialSaving: "500.00",
        successProbability: 95,
        difficultyLevel: "easy",
        estimatedTimeRequired: 20,
        title: "Dispute Duplicate X-Ray Charge",
        description: "Code 73562 (X-Ray Knee) was billed twice on the same date - clear billing error that must be corrected.",
        actionSteps: [
          {
            stepNumber: 1,
            action: "Notify billing department",
            details: "Send written notice identifying the duplicate charge: X-Ray code 73562 appears twice on 08/20/2024 ($550 and $500)",
            expectedOutcome: "Billing department acknowledges error and initiates correction",
            timeframe: "2-3 business days",
          },
          {
            stepNumber: 2,
            action: "Demand correction",
            details: "Reference FCRA regulations requiring correction within 14 days of notification",
            expectedOutcome: "Receive confirmation of charge removal",
            timeframe: "7-14 days",
          },
        ],
        requiredDocuments: ["Billing dispute letter", "Copy of bill showing duplicates"],
        legalBasis: "Fair Credit Reporting Act (FCRA) and Fair Debt Collection Practices Act (FDCPA) require accurate billing. Duplicate charges constitute billing fraud.",
      },
      {
        billId: createdBills[2].id,
        analysisId: createdAnalyses[2].id,
        strategyType: "negotiate_pricing",
        priority: 8,
        potentialSaving: "4200.00",
        successProbability: 72,
        difficultyLevel: "medium",
        estimatedTimeRequired: 60,
        title: "Challenge Room & Board Overpricing",
        description: "Daily room rate is 220% above regional average. Verify room classification and negotiate to fair market rate.",
        actionSteps: [
          {
            stepNumber: 1,
            action: "Verify room classification",
            details: "Request documentation confirming whether room was semi-private or private",
            expectedOutcome: "Receive room assignment records",
            timeframe: "3-5 business days",
          },
          {
            stepNumber: 2,
            action: "Gather pricing data",
            details: "Obtain regional pricing data from FAIR Health database showing average semi-private room rate ($1,365/day)",
            expectedOutcome: "Have documented proof of fair market rates",
            timeframe: "1-2 days",
          },
          {
            stepNumber: 3,
            action: "Submit negotiation offer",
            details: "Propose payment of 150% of regional average ($2,050/day vs $3,000/day charged)",
            expectedOutcome: "Hospital agrees to reduced rate or provides justification",
            timeframe: "2-4 weeks",
          },
        ],
        requiredDocuments: ["Room classification docs", "Regional pricing comparison", "Financial hardship letter"],
        legalBasis: "Hospital Pricing Transparency Rule requires hospitals to provide accurate, reasonable pricing. Room rates must be commercially reasonable.",
      },
    ];

    const createdStrategies = await db.insert(reductionStrategies).values(strategies).returning();
    console.log(`✅ Created ${createdStrategies.length} reduction strategies`);

    console.log("\n🎉 Demo account seeding complete!");
    console.log(`\n📧 Demo Login: ${DEMO_EMAIL}`);
    console.log(`🔑 Password: [CONFIGURED] (managed by Replit Auth)`);
    console.log(`💎 Subscription: Premium (Annual, Never Expires)`);
    console.log(`📊 Sample Bills: ${createdBills.length}`);
    console.log(`📈 Total Potential Savings: $${
      analysisResults.reduce((sum, a) => sum + parseFloat(a.potentialSavings), 0).toLocaleString()
    }`);
    console.log("\n✅ App Store reviewers can now test all features with pre-loaded data!\n");

  } catch (error) {
    console.error("❌ Error seeding demo account:", error);
    throw error;
  }
}
