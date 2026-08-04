/**
 * Shared, deterministic enrollment workflow.
 *
 * This module intentionally performs the first validation pass without an AI
 * provider. It gives the UI immediate, explainable feedback and ensures that a
 * model can never be the only control between a misunderstood answer and an
 * enrollment packet.
 */

export type EnrollmentProgram =
  | "medicare"
  | "medicare-advantage"
  | "part-d"
  | "medigap"
  | "medicaid"
  | "marketplace"
  | "unsure";

export type AnswerSource = "voice" | "text" | "demo";
export type ValidationSeverity = "blocking" | "warning" | "info";
export type EnrollmentSectionId =
  | "goals"
  | "identity"
  | "coverage"
  | "household"
  | "care"
  | "consent";

export interface EnrollmentAnswer {
  questionId: string;
  rawValue: string;
  normalizedValue: string;
  source: AnswerSource;
  confidence?: number;
  confirmed: boolean;
  confirmedAt?: string;
  updatedAt: string;
}

export interface EnrollmentQuestion {
  id: string;
  section: EnrollmentSectionId;
  title: string;
  prompt: string;
  rationale: string;
  example: string;
  required: boolean;
  private?: boolean;
  input: "text" | "date" | "currency" | "number" | "choice" | "multiline";
  choices?: ReadonlyArray<{ value: string; label: string; description?: string }>;
  validate: (value: string, answers: EnrollmentAnswerMap) => ValidationIssue[];
}

export interface EnrollmentSection {
  id: EnrollmentSectionId;
  eyebrow: string;
  title: string;
  description: string;
}

export interface ValidationIssue {
  id: string;
  questionId?: string;
  severity: ValidationSeverity;
  title: string;
  message: string;
  resolution: string;
}

export interface ConversationAudit {
  score: number;
  ready: boolean;
  confirmedCount: number;
  totalRequired: number;
  issues: ValidationIssue[];
  summary: string;
}

export type EnrollmentAnswerMap = Record<string, EnrollmentAnswer>;

export const ENROLLMENT_SECTIONS: EnrollmentSection[] = [
  {
    id: "goals",
    eyebrow: "Your goal",
    title: "Start with what is changing",
    description: "We identify the coverage path and any deadline before collecting details."
  },
  {
    id: "identity",
    eyebrow: "About you",
    title: "Confirm basic eligibility facts",
    description: "Only the minimum information needed for screening is used in the conversation."
  },
  {
    id: "coverage",
    eyebrow: "Current coverage",
    title: "Avoid gaps and late-enrollment surprises",
    description: "Current coverage and timing affect the safest next step."
  },
  {
    id: "household",
    eyebrow: "Household",
    title: "Screen for financial help",
    description: "Household and estimated income can reveal assistance pathways."
  },
  {
    id: "care",
    eyebrow: "Care preferences",
    title: "Capture what coverage must protect",
    description: "Doctors, prescriptions, accessibility, and support needs belong in the handoff."
  },
  {
    id: "consent",
    eyebrow: "Review",
    title: "Set the submission boundary",
    description: "The applicant reviews, attests, and controls final submission."
  }
];

const required = (questionId: string, value: string): ValidationIssue[] =>
  value.trim()
    ? []
    : [{
        id: `${questionId}-required`,
        questionId,
        severity: "blocking",
        title: "Answer required",
        message: "We still need an answer to this question.",
        resolution: "Answer the question or choose an available ‘not sure’ option."
      }];

const confused = (questionId: string, value: string): ValidationIssue[] =>
  /^(?:huh|what|i don't understand|no idea|whatever|maybe|help me)$/i.test(value.trim())
    ? [{
        id: `${questionId}-unclear`,
        questionId,
        severity: "warning",
        title: "This answer may not address the question",
        message: "The response sounds uncertain or unrelated, so Goldie should explain the question another way.",
        resolution: "Ask for clarification and read the revised answer back."
      }]
    : [];

const validDate = (value: string): boolean => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && new Date(timestamp) < new Date();
};

const numericValue = (value: string): number | null => {
  const cleaned = value.replace(/[$,\s]/g, "");
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

export const ENROLLMENT_QUESTIONS: EnrollmentQuestion[] = [
  {
    id: "coverage_goal",
    section: "goals",
    title: "Coverage goal",
    prompt: "What would you like help enrolling in?",
    rationale: "This determines which application path and follow-up questions apply.",
    example: "I am turning 65 and need help with Medicare.",
    required: true,
    input: "choice",
    choices: [
      { value: "medicare", label: "Original Medicare", description: "Parts A and B" },
      { value: "medicare-advantage", label: "Medicare Advantage", description: "Private Part C plans" },
      { value: "part-d", label: "Prescription coverage", description: "Medicare Part D" },
      { value: "medigap", label: "Medigap", description: "Medicare supplement coverage" },
      { value: "medicaid", label: "Medicaid", description: "Income or category-based coverage" },
      { value: "marketplace", label: "Marketplace", description: "ACA individual coverage" },
      { value: "unsure", label: "I’m not sure", description: "Goldie will help narrow it down" }
    ],
    validate: (value) => [...required("coverage_goal", value), ...confused("coverage_goal", value)]
  },
  {
    id: "life_event",
    section: "goals",
    title: "Reason for enrolling",
    prompt: "What is changing that makes you need coverage now?",
    rationale: "Turning 65, retiring, moving, or losing coverage can create different enrollment windows.",
    example: "I retire on September 30 and my employer coverage ends.",
    required: true,
    input: "multiline",
    validate: (value) => [...required("life_event", value), ...confused("life_event", value)]
  },
  {
    id: "deadline",
    section: "goals",
    title: "Known deadline",
    prompt: "Is there a coverage end date, retirement date, or other deadline?",
    rationale: "A concrete date helps create the action timeline and reduce the risk of a gap.",
    example: "My employer coverage ends September 30.",
    required: true,
    input: "text",
    validate: (value) => [...required("deadline", value), ...confused("deadline", value)]
  },
  {
    id: "date_of_birth",
    section: "identity",
    title: "Date of birth",
    prompt: "What is your date of birth? Please include the year.",
    rationale: "Age is central to Medicare eligibility and enrollment timing.",
    example: "January 14, 1961",
    required: true,
    private: true,
    input: "date",
    validate: (value) => {
      const issues = required("date_of_birth", value);
      if (value && !validDate(value)) issues.push({
        id: "date_of_birth-invalid",
        questionId: "date_of_birth",
        severity: "blocking",
        title: "Date needs confirmation",
        message: "That does not look like a complete date of birth in the past.",
        resolution: "Enter or say the month, day, and four-digit year."
      });
      return issues;
    }
  },
  {
    id: "state",
    section: "identity",
    title: "State of residence",
    prompt: "Which state do you live in?",
    rationale: "Medicaid rules, Marketplace pathways, and available plans vary by state.",
    example: "Colorado",
    required: true,
    input: "text",
    validate: (value) => [...required("state", value), ...confused("state", value)]
  },
  {
    id: "zip_code",
    section: "identity",
    title: "ZIP code",
    prompt: "What is your five-digit ZIP code?",
    rationale: "Plan service areas and local enrollment resources use ZIP code.",
    example: "80202",
    required: true,
    private: true,
    input: "text",
    validate: (value) => {
      const issues = required("zip_code", value);
      if (value && !/^\d{5}(?:-\d{4})?$/.test(value.trim())) issues.push({
        id: "zip_code-format",
        questionId: "zip_code",
        severity: "blocking",
        title: "ZIP code needs five digits",
        message: "We could not recognize a valid ZIP code.",
        resolution: "Enter the five-digit ZIP code, for example 80202."
      });
      return issues;
    }
  },
  {
    id: "current_coverage",
    section: "coverage",
    title: "Coverage today",
    prompt: "What health coverage do you have today?",
    rationale: "Active employer, retiree, COBRA, Marketplace, Medicaid, or Medicare coverage changes the path.",
    example: "Employer insurance through September 30.",
    required: true,
    input: "multiline",
    validate: (value) => [...required("current_coverage", value), ...confused("current_coverage", value)]
  },
  {
    id: "medicare_status",
    section: "coverage",
    title: "Medicare status",
    prompt: "Are you already enrolled in any part of Medicare?",
    rationale: "Existing Part A or Part B enrollment affects Advantage, Part D, and Medigap options.",
    example: "I have Part A but have not enrolled in Part B.",
    required: true,
    input: "choice",
    choices: [
      { value: "none", label: "No Medicare yet" },
      { value: "part-a", label: "Part A only" },
      { value: "parts-a-b", label: "Parts A and B" },
      { value: "advantage", label: "Medicare Advantage" },
      { value: "unsure", label: "I’m not sure" }
    ],
    validate: (value) => required("medicare_status", value)
  },
  {
    id: "employer_coverage",
    section: "coverage",
    title: "Employer coverage details",
    prompt: "Is your current coverage connected to active employment, and whose job provides it?",
    rationale: "Active employment coverage can affect Part B special enrollment rights and timing.",
    example: "It is through my job; I am the employee and retire in September.",
    required: true,
    input: "multiline",
    validate: (value) => [...required("employer_coverage", value), ...confused("employer_coverage", value)]
  },
  {
    id: "household_size",
    section: "household",
    title: "Tax household size",
    prompt: "How many people are in your tax household?",
    rationale: "Household size is used when screening for Medicaid and Marketplace financial help.",
    example: "Two people",
    required: true,
    input: "number",
    validate: (value) => {
      const issues = required("household_size", value);
      const count = numericValue(value);
      if (value && (count === null || count < 1 || count > 20)) issues.push({
        id: "household_size-range",
        questionId: "household_size",
        severity: "blocking",
        title: "Household size needs confirmation",
        message: "The household size should normally be between 1 and 20.",
        resolution: "Confirm the number of people included in the applicant’s tax household."
      });
      return issues;
    }
  },
  {
    id: "annual_income",
    section: "household",
    title: "Estimated annual income",
    prompt: "About what do you expect your household income to be this year?",
    rationale: "An estimate supports assistance screening; the official application will require applicant verification.",
    example: "About $42,000 for the year.",
    required: true,
    private: true,
    input: "currency",
    validate: (value) => {
      const issues = required("annual_income", value);
      const income = numericValue(value);
      if (value && (income === null || income < 0 || income > 10_000_000)) issues.push({
        id: "annual_income-range",
        questionId: "annual_income",
        severity: "blocking",
        title: "Income estimate needs confirmation",
        message: "We could not interpret a reasonable annual household income.",
        resolution: "Provide an annual estimate or range before taxes."
      });
      return issues;
    }
  },
  {
    id: "preferred_doctors",
    section: "care",
    title: "Doctors and facilities",
    prompt: "Are there doctors, hospitals, or pharmacies you want to keep?",
    rationale: "Provider preferences belong in plan comparison, not just the eligibility form.",
    example: "I want to keep Dr. Chen and St. Joseph Hospital.",
    required: false,
    input: "multiline",
    validate: (value) => confused("preferred_doctors", value)
  },
  {
    id: "prescriptions",
    section: "care",
    title: "Prescription priorities",
    prompt: "Which prescriptions are most important to check for coverage?",
    rationale: "Formularies and pharmacy networks can materially affect annual cost.",
    example: "Eliquis 5 mg twice daily and metformin.",
    required: false,
    private: true,
    input: "multiline",
    validate: (value) => confused("prescriptions", value)
  },
  {
    id: "accessibility",
    section: "care",
    title: "Accessibility and support",
    prompt: "Would any accessibility support make enrollment easier?",
    rationale: "The handoff can request large print, interpreter help, a trusted helper, or extra time.",
    example: "Please use large print and include my daughter in the review.",
    required: false,
    input: "multiline",
    validate: (value) => confused("accessibility", value)
  },
  {
    id: "submission_consent",
    section: "consent",
    title: "Applicant-controlled submission",
    prompt: "Do you understand that GoldRock prepares the packet, but you review, attest, and control final submission?",
    rationale: "No enrollment should be signed or submitted silently on an applicant’s behalf.",
    example: "Yes, I understand and want to review before submission.",
    required: true,
    input: "choice",
    choices: [
      { value: "yes", label: "Yes, I understand" },
      { value: "helper", label: "I need a trusted helper present" },
      { value: "explain", label: "Please explain this again" }
    ],
    validate: (value) => {
      const issues = required("submission_consent", value);
      if (value === "explain") issues.push({
        id: "submission_consent-explain",
        questionId: "submission_consent",
        severity: "blocking",
        title: "Submission boundary is not yet understood",
        message: "The applicant asked for another explanation before consenting.",
        resolution: "Explain the review and attestation boundary, then ask again."
      });
      return issues;
    }
  }
];

export const SENSITIVE_QUESTION_IDS = new Set(
  ENROLLMENT_QUESTIONS.filter((question) => question.private).map((question) => question.id)
);

export function normalizeAnswer(question: EnrollmentQuestion, rawValue: string): string {
  const value = rawValue.trim().replace(/\s+/g, " ");
  if (question.input === "currency") {
    const amount = numericValue(value);
    return amount === null ? value : new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  }
  if (question.input === "number") {
    const amount = numericValue(value);
    return amount === null ? value : String(Math.round(amount));
  }
  return value;
}

export function createAnswer(
  question: EnrollmentQuestion,
  rawValue: string,
  source: AnswerSource,
  confidence?: number
): EnrollmentAnswer {
  return {
    questionId: question.id,
    rawValue,
    normalizedValue: normalizeAnswer(question, rawValue),
    source,
    confidence,
    confirmed: false,
    updatedAt: new Date().toISOString()
  };
}

export function validateQuestion(
  question: EnrollmentQuestion,
  value: string,
  answers: EnrollmentAnswerMap
): ValidationIssue[] {
  return question.validate(value, answers);
}

function crossAnswerIssues(answers: EnrollmentAnswerMap): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const goal = answers.coverage_goal?.normalizedValue;
  const status = answers.medicare_status?.normalizedValue;
  const event = answers.life_event?.normalizedValue || "";
  const coverage = answers.current_coverage?.normalizedValue || "";
  const dob = answers.date_of_birth?.normalizedValue;

  if (goal === "medicare-advantage" && !["parts-a-b", "advantage"].includes(status)) {
    issues.push({
      id: "advantage-prerequisite",
      questionId: "medicare_status",
      severity: "warning",
      title: "Confirm Medicare Parts A and B timing",
      message: "Medicare Advantage generally requires both Part A and Part B.",
      resolution: "Confirm current enrollment and effective dates before comparing Advantage plans."
    });
  }

  if (goal === "part-d" && status === "none") {
    issues.push({
      id: "part-d-prerequisite",
      questionId: "medicare_status",
      severity: "warning",
      title: "Confirm Medicare eligibility first",
      message: "Part D enrollment generally depends on Medicare eligibility and enrollment status.",
      resolution: "Verify Part A or Part B effective dates before the Part D handoff."
    });
  }

  if (/retir|losing|ends|terminate/i.test(event) && !/date|\d|january|february|march|april|may|june|july|august|september|october|november|december/i.test(answers.deadline?.normalizedValue || "")) {
    issues.push({
      id: "missing-coverage-end-date",
      questionId: "deadline",
      severity: "warning",
      title: "Coverage change needs a specific date",
      message: "The conversation mentions coverage ending but does not contain a clear date.",
      resolution: "Confirm the last day of current coverage and the desired effective date."
    });
  }

  if (
    /none|uninsured/i.test(coverage) &&
    /employer|active (?:work|job)|through (?:my|a|the) job|cobra|marketplace|medicare|medicaid/i.test(
      answers.employer_coverage?.normalizedValue || ""
    )
  ) {
    issues.push({
      id: "coverage-contradiction",
      questionId: "current_coverage",
      severity: "blocking",
      title: "Current coverage answers conflict",
      message: "One answer says there is no coverage while another describes active coverage.",
      resolution: "Ask which coverage is active today and when it ends."
    });
  }

  if (dob && validDate(dob)) {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    if (goal?.startsWith("medicare") && age < 64 && !/disab|esrd|als/i.test(event)) {
      issues.push({
        id: "medicare-age-context",
        questionId: "date_of_birth",
        severity: "warning",
        title: "Medicare eligibility basis needs clarification",
        message: "The recorded age appears under 65 and no disability-based eligibility was mentioned.",
        resolution: "Ask whether eligibility is based on disability, ESRD, ALS, or an upcoming 65th birthday."
      });
    }
  }

  return issues;
}

export function auditConversation(answers: EnrollmentAnswerMap): ConversationAudit {
  const requiredQuestions = ENROLLMENT_QUESTIONS.filter((question) => question.required);
  const confirmedCount = requiredQuestions.filter((question) => answers[question.id]?.confirmed).length;
  const issues = ENROLLMENT_QUESTIONS.flatMap((question) => {
    const answer = answers[question.id];
    if (!answer && !question.required) return [];
    const validation = validateQuestion(question, answer?.normalizedValue || "", answers);
    if (answer && question.required && !answer.confirmed) {
      validation.push({
        id: `${question.id}-unconfirmed`,
        questionId: question.id,
        severity: "blocking",
        title: "Answer not confirmed",
        message: "The applicant has not confirmed Goldie’s readback.",
        resolution: "Read the answer back and ask the applicant to confirm or correct it."
      });
    }
    return validation;
  }).concat(crossAnswerIssues(answers));

  const blocking = issues.filter((issue) => issue.severity === "blocking").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const completeness = requiredQuestions.length
    ? confirmedCount / requiredQuestions.length
    : 0;
  const score = Math.max(0, Math.round(completeness * 100 - blocking * 12 - warnings * 4));

  return {
    score,
    ready: blocking === 0 && confirmedCount === requiredQuestions.length,
    confirmedCount,
    totalRequired: requiredQuestions.length,
    issues,
    summary: blocking
      ? `${blocking} blocking item${blocking === 1 ? "" : "s"} must be resolved before export.`
      : warnings
        ? `Required answers are complete, with ${warnings} item${warnings === 1 ? "" : "s"} to double-check.`
        : "Every required answer is confirmed and the deterministic consistency check passed."
  };
}

export function answersForAI(answers: EnrollmentAnswerMap): Record<string, string> {
  return Object.fromEntries(
    Object.entries(answers)
      .filter(([questionId]) => !SENSITIVE_QUESTION_IDS.has(questionId))
      .map(([questionId, answer]) => [questionId, answer.normalizedValue])
  );
}

export function buildEnrollmentPacket(answers: EnrollmentAnswerMap) {
  const audit = auditConversation(answers);
  const sections = ENROLLMENT_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    fields: ENROLLMENT_QUESTIONS
      .filter((question) => question.section === section.id)
      .map((question) => ({
        id: question.id,
        label: question.title,
        value: answers[question.id]?.normalizedValue || "Not provided",
        confirmed: Boolean(answers[question.id]?.confirmed),
        sensitive: Boolean(question.private)
      }))
  }));

  return {
    packetVersion: "2026.1",
    generatedAt: new Date().toISOString(),
    status: audit.ready ? "ready-for-applicant-review" : "needs-attention",
    audit,
    sections,
    attestation: {
      required: true,
      completed: false,
      statement: "I reviewed these answers and authorize their use in the enrollment handoff I choose."
    },
    submission: {
      mode: "applicant-controlled-handoff",
      submitted: false,
      destination: null,
      confirmationNumber: null
    }
  };
}
