import type {
  EnrollmentAnswerMap,
  EnrollmentProgram,
  ValidationIssue
} from "./enrollment-workflow";

export type HandoffMethod = "official-portal" | "phone" | "in-person" | "mail";
export type HandoffGateStatus = "complete" | "required" | "not-applicable";

export interface PortalDestination {
  id: string;
  name: string;
  owner: string;
  description: string;
  url: string;
  phone?: string;
  programs: EnrollmentProgram[];
  method: HandoffMethod;
  governmentOperated: boolean;
  warning?: string;
}

export interface HandoffField {
  key: string;
  label: string;
  value: string;
  sourceQuestionId: string;
  destinationSection: string;
  sensitive: boolean;
  requiresApplicantVerification: boolean;
  notes?: string;
}

export interface HandoffGate {
  id: string;
  label: string;
  description: string;
  status: HandoffGateStatus;
  blocking: boolean;
}

export interface EnrollmentTimelineStep {
  id: string;
  order: number;
  title: string;
  description: string;
  owner: "applicant" | "trusted-helper" | "goldrock";
  dueLabel: string;
  completed: boolean;
}

export interface DocumentChecklistItem {
  id: string;
  title: string;
  reason: string;
  required: boolean;
  sensitive: boolean;
  status: "needed" | "ready" | "not-applicable";
  collectionRule: string;
}

export interface HandoffPlan {
  version: "2026.1";
  program: EnrollmentProgram;
  generatedAt: string;
  destination: PortalDestination;
  alternateDestinations: PortalDestination[];
  fields: HandoffField[];
  gates: HandoffGate[];
  documents: DocumentChecklistItem[];
  timeline: EnrollmentTimelineStep[];
  issues: ValidationIssue[];
  canLaunchPortal: boolean;
  canRepresentAsSubmitted: false;
  disclaimer: string;
}

export const PORTAL_DESTINATIONS: PortalDestination[] = [
  {
    id: "ssa-medicare",
    name: "Social Security Medicare application",
    owner: "U.S. Social Security Administration",
    description: "Official application pathway for Medicare Part A and Part B enrollment.",
    url: "https://www.ssa.gov/medicare/sign-up",
    phone: "1-800-772-1213",
    programs: ["medicare"],
    method: "official-portal",
    governmentOperated: true,
    warning: "Medicare Advantage, Part D, and Medigap enrollment use different pathways."
  },
  {
    id: "medicare-plan-compare",
    name: "Medicare Plan Compare",
    owner: "Centers for Medicare & Medicaid Services",
    description: "Official Medicare pathway for comparing and enrolling in Medicare Advantage and Part D plans.",
    url: "https://www.medicare.gov/plan-compare/",
    phone: "1-800-MEDICARE",
    programs: ["medicare-advantage", "part-d"],
    method: "official-portal",
    governmentOperated: true,
    warning: "Network, formulary, pharmacy, total annual cost, and effective date should be verified before enrollment."
  },
  {
    id: "medigap-policy-search",
    name: "Medigap policy search",
    owner: "Centers for Medicare & Medicaid Services",
    description: "Official starting point for researching Medicare supplement policies available by location.",
    url: "https://www.medicare.gov/medigap-supplemental-insurance-plans/",
    phone: "1-800-MEDICARE",
    programs: ["medigap"],
    method: "official-portal",
    governmentOperated: true,
    warning: "Enrollment is completed with the selected insurer, and medical underwriting rules may vary by timing and state."
  },
  {
    id: "healthcare-gov",
    name: "Health Insurance Marketplace",
    owner: "U.S. Centers for Medicare & Medicaid Services",
    description: "Official federal Marketplace application for eligible states.",
    url: "https://www.healthcare.gov/",
    phone: "1-800-318-2596",
    programs: ["marketplace", "unsure"],
    method: "official-portal",
    governmentOperated: true,
    warning: "Some states operate their own Marketplace and may redirect the applicant."
  },
  {
    id: "medicaid-state-directory",
    name: "State Medicaid agency directory",
    owner: "Medicaid.gov",
    description: "Official directory for the applicant’s state Medicaid agency and application pathway.",
    url: "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip",
    programs: ["medicaid", "unsure"],
    method: "official-portal",
    governmentOperated: true,
    warning: "Eligibility, required documents, and application systems vary by state."
  },
  {
    id: "ship-counseling",
    name: "State Health Insurance Assistance Program",
    owner: "SHIP national network",
    description: "Free, unbiased Medicare counseling and local enrollment assistance.",
    url: "https://www.shiphelp.org/",
    programs: ["medicare", "medicare-advantage", "part-d", "medigap", "unsure"],
    method: "phone",
    governmentOperated: false,
    warning: "SHIP provides counseling; it is not itself the final enrollment destination."
  }
];

function answer(answers: EnrollmentAnswerMap, id: string): string {
  return answers[id]?.normalizedValue || "";
}

function inferProgram(answers: EnrollmentAnswerMap): EnrollmentProgram {
  const raw = answer(answers, "coverage_goal") as EnrollmentProgram;
  const allowed: EnrollmentProgram[] = [
    "medicare",
    "medicare-advantage",
    "part-d",
    "medigap",
    "medicaid",
    "marketplace",
    "unsure"
  ];
  return allowed.includes(raw) ? raw : "unsure";
}

export function destinationsForProgram(program: EnrollmentProgram): PortalDestination[] {
  const exact = PORTAL_DESTINATIONS.filter((destination) =>
    destination.programs.includes(program)
  );
  if (exact.length) return exact;
  return PORTAL_DESTINATIONS.filter((destination) =>
    destination.programs.includes("unsure")
  );
}

export function mapAnswersToHandoffFields(
  answers: EnrollmentAnswerMap
): HandoffField[] {
  const mappings: Array<Omit<HandoffField, "value">> = [
    {
      key: "coverage_program",
      label: "Requested coverage pathway",
      sourceQuestionId: "coverage_goal",
      destinationSection: "Coverage request",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "qualifying_event",
      label: "Enrollment reason or qualifying event",
      sourceQuestionId: "life_event",
      destinationSection: "Enrollment timing",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "coverage_deadline",
      label: "Coverage end date or deadline",
      sourceQuestionId: "deadline",
      destinationSection: "Enrollment timing",
      sensitive: false,
      requiresApplicantVerification: true,
      notes: "Verify against employer or carrier documentation."
    },
    {
      key: "date_of_birth",
      label: "Date of birth",
      sourceQuestionId: "date_of_birth",
      destinationSection: "Applicant identity",
      sensitive: true,
      requiresApplicantVerification: true,
      notes: "Transfer only in the applicant-controlled portal session."
    },
    {
      key: "state",
      label: "State of residence",
      sourceQuestionId: "state",
      destinationSection: "Applicant address",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "zip_code",
      label: "ZIP code",
      sourceQuestionId: "zip_code",
      destinationSection: "Applicant address",
      sensitive: true,
      requiresApplicantVerification: true,
      notes: "Used for service area and local program routing."
    },
    {
      key: "current_coverage",
      label: "Current health coverage",
      sourceQuestionId: "current_coverage",
      destinationSection: "Existing coverage",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "medicare_status",
      label: "Current Medicare enrollment",
      sourceQuestionId: "medicare_status",
      destinationSection: "Existing coverage",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "employer_coverage",
      label: "Employer coverage relationship",
      sourceQuestionId: "employer_coverage",
      destinationSection: "Existing coverage",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "household_size",
      label: "Tax household size",
      sourceQuestionId: "household_size",
      destinationSection: "Household",
      sensitive: false,
      requiresApplicantVerification: true
    },
    {
      key: "annual_income",
      label: "Estimated annual household income",
      sourceQuestionId: "annual_income",
      destinationSection: "Household income",
      sensitive: true,
      requiresApplicantVerification: true,
      notes: "Official application rules determine which income sources count."
    },
    {
      key: "provider_preferences",
      label: "Preferred doctors and facilities",
      sourceQuestionId: "preferred_doctors",
      destinationSection: "Plan comparison notes",
      sensitive: false,
      requiresApplicantVerification: true,
      notes: "Verify network participation directly with both plan and provider."
    },
    {
      key: "prescription_preferences",
      label: "Prescription priorities",
      sourceQuestionId: "prescriptions",
      destinationSection: "Plan comparison notes",
      sensitive: true,
      requiresApplicantVerification: true,
      notes: "Verify formulary, tier, restrictions, dosage, and preferred pharmacy."
    },
    {
      key: "accessibility_preferences",
      label: "Accessibility or helper request",
      sourceQuestionId: "accessibility",
      destinationSection: "Communication preferences",
      sensitive: false,
      requiresApplicantVerification: false
    }
  ];

  return mappings
    .map((mapping) => ({
      ...mapping,
      value: answer(answers, mapping.sourceQuestionId)
    }))
    .filter((field) => field.value && field.value !== "Skipped by applicant");
}

export function buildDocumentChecklist(
  answers: EnrollmentAnswerMap,
  program: EnrollmentProgram
): DocumentChecklistItem[] {
  const event = answer(answers, "life_event");
  const employerCoverage = answer(answers, "employer_coverage");
  const hasEmployerTransition = /employ|retir|job|work/i.test(`${event} ${employerCoverage}`);
  const needsIncome = ["medicaid", "marketplace", "unsure"].includes(program);
  const hasMedicare = answer(answers, "medicare_status") !== "none";

  return [
    {
      id: "identity",
      title: "Government-issued identity document",
      reason: "The official destination may require identity verification.",
      required: true,
      sensitive: true,
      status: "needed",
      collectionRule: "Do not upload into the AI conversation. Present only to the authorized portal or agency."
    },
    {
      id: "citizenship-status",
      title: "Citizenship or eligible immigration status document",
      reason: "Some enrollment pathways require proof of status.",
      required: ["medicaid", "marketplace"].includes(program),
      sensitive: true,
      status: ["medicaid", "marketplace"].includes(program) ? "needed" : "not-applicable",
      collectionRule: "Keep local until the applicant is inside the official destination."
    },
    {
      id: "coverage-proof",
      title: "Current insurance card or coverage letter",
      reason: "Confirms existing coverage and identifiers without relying on memory.",
      required: true,
      sensitive: true,
      status: "needed",
      collectionRule: "Extract only the minimum fields locally; never send full card images to a general AI endpoint."
    },
    {
      id: "employer-verification",
      title: "Employer coverage verification",
      reason: "May support timing and special-enrollment review when active employment coverage ends.",
      required: hasEmployerTransition,
      sensitive: true,
      status: hasEmployerTransition ? "needed" : "not-applicable",
      collectionRule: "Verify coverage end date and employment relationship against the source document."
    },
    {
      id: "income-proof",
      title: "Income estimate support",
      reason: "Marketplace savings and Medicaid screening may require income documentation.",
      required: needsIncome,
      sensitive: true,
      status: needsIncome ? "needed" : "not-applicable",
      collectionRule: "Use only in the official application workflow; do not include account numbers."
    },
    {
      id: "medicare-card",
      title: "Medicare card",
      reason: "Confirms existing Medicare effective dates and identifier.",
      required: hasMedicare,
      sensitive: true,
      status: hasMedicare ? "needed" : "not-applicable",
      collectionRule: "Never speak or transmit the Medicare Beneficiary Identifier to the AI voice session."
    },
    {
      id: "prescription-list",
      title: "Current prescription list",
      reason: "Supports formulary and annual-cost comparison.",
      required: Boolean(answer(answers, "prescriptions")),
      sensitive: true,
      status: answer(answers, "prescriptions") ? "ready" : "not-applicable",
      collectionRule: "Confirm drug name, dosage, frequency, quantity, and pharmacy with the applicant."
    },
    {
      id: "provider-list",
      title: "Preferred provider list",
      reason: "Supports network verification before any plan selection.",
      required: Boolean(answer(answers, "preferred_doctors")),
      sensitive: false,
      status: answer(answers, "preferred_doctors") ? "ready" : "not-applicable",
      collectionRule: "Verify provider location and plan participation rather than assuming from name alone."
    }
  ];
}

export function buildHandoffGates(
  answers: EnrollmentAnswerMap,
  issues: ValidationIssue[]
): HandoffGate[] {
  const confirmed = Object.values(answers).every((item) => item.confirmed);
  const consent = answer(answers, "submission_consent") === "yes";
  const blockingIssues = issues.some((issue) => issue.severity === "blocking");

  return [
    {
      id: "conversation-audit",
      label: "Conversation validation complete",
      description: "Required answers and cross-answer assumptions have no blocking issues.",
      status: blockingIssues ? "required" : "complete",
      blocking: true
    },
    {
      id: "readback-confirmation",
      label: "Applicant confirmed every captured answer",
      description: "Goldie read important details back and corrections were saved.",
      status: confirmed ? "complete" : "required",
      blocking: true
    },
    {
      id: "submission-boundary",
      label: "Applicant understands the submission boundary",
      description: "GoldRock prepares the handoff; the applicant controls attestation and submission.",
      status: consent ? "complete" : "required",
      blocking: true
    },
    {
      id: "source-document-check",
      label: "Source documents compared",
      description: "Dates, coverage, identity, and income should be verified against original documents.",
      status: "required",
      blocking: false
    },
    {
      id: "destination-review",
      label: "Official destination verified",
      description: "The applicant should confirm the domain and agency before entering protected identifiers.",
      status: "required",
      blocking: false
    },
    {
      id: "final-attestation",
      label: "Final application attestation",
      description: "This must occur in the official destination after the applicant reviews transferred fields.",
      status: "required",
      blocking: true
    }
  ];
}

export function buildEnrollmentTimeline(
  destination: PortalDestination
): EnrollmentTimelineStep[] {
  return [
    {
      id: "review-audit",
      order: 1,
      title: "Resolve conversation flags",
      description: "Correct any incomplete, irrelevant, or contradictory answers.",
      owner: "applicant",
      dueLabel: "Before handoff",
      completed: true
    },
    {
      id: "gather-documents",
      order: 2,
      title: "Gather source documents",
      description: "Keep sensitive documents local until the official portal requests them.",
      owner: "applicant",
      dueLabel: "Before portal session",
      completed: false
    },
    {
      id: "trusted-review",
      order: 3,
      title: "Invite a trusted reviewer if desired",
      description: "A family member, authorized representative, or counselor can join the review.",
      owner: "trusted-helper",
      dueLabel: "Optional",
      completed: false
    },
    {
      id: "launch-official-destination",
      order: 4,
      title: `Open ${destination.name}`,
      description: "Confirm the domain and transfer only the fields the destination requires.",
      owner: "applicant",
      dueLabel: "Applicant-controlled session",
      completed: false
    },
    {
      id: "field-verification",
      order: 5,
      title: "Verify transferred fields",
      description: "Compare each field with the GoldRock handoff and original documents.",
      owner: "applicant",
      dueLabel: "Before attestation",
      completed: false
    },
    {
      id: "attest-submit",
      order: 6,
      title: "Attest and submit",
      description: "The applicant or legally authorized representative completes final attestation.",
      owner: "applicant",
      dueLabel: "Inside official destination",
      completed: false
    },
    {
      id: "save-receipt",
      order: 7,
      title: "Save the official receipt",
      description: "Record confirmation number, submission time, destination, and next expected response.",
      owner: "applicant",
      dueLabel: "Immediately after submission",
      completed: false
    }
  ];
}

export function buildHandoffPlan(
  answers: EnrollmentAnswerMap,
  issues: ValidationIssue[] = []
): HandoffPlan {
  const program = inferProgram(answers);
  const destinations = destinationsForProgram(program);
  const destination = destinations[0];
  const gates = buildHandoffGates(answers, issues);
  const hasBlockingGate = gates.some(
    (gate) => gate.blocking && gate.status !== "complete" && gate.id !== "final-attestation"
  );

  return {
    version: "2026.1",
    program,
    generatedAt: new Date().toISOString(),
    destination,
    alternateDestinations: destinations.slice(1),
    fields: mapAnswersToHandoffFields(answers),
    gates,
    documents: buildDocumentChecklist(answers, program),
    timeline: buildEnrollmentTimeline(destination),
    issues,
    canLaunchPortal: !hasBlockingGate,
    canRepresentAsSubmitted: false,
    disclaimer:
      "GoldRock Health is not Medicare, Social Security, Medicaid, a Marketplace, an insurer, or a broker. This plan organizes applicant-provided information and does not prove eligibility, enrollment, coverage, or submission."
  };
}
