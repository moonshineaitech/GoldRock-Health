import { getSource } from './sources.js';

export class TaskCatalogError extends Error {
  constructor(message, path = '') { super(message); this.name = 'TaskCatalogError'; this.code = 'INVALID_TASK_INTAKE'; this.path = path; }
}

export const TASK_INTAKE_LIMITS = Object.freeze({ text: 240, textarea: 2000, select: 240, number: 30, date: 10, file: 240, totalCharacters: 16000 });

function taskCatalogClone(value) { return JSON.parse(JSON.stringify(value)); }
function taskCatalogFreeze(value) {
  if (value && typeof value === 'object') { for (const child of Object.values(value)) taskCatalogFreeze(child); Object.freeze(value); }
  return value;
}
function taskCatalogObject(value, keys, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TaskCatalogError('Expected a plain object.', path);
  if (Object.keys(value).some(key => !keys.includes(key))) throw new TaskCatalogError('Unknown field.', path);
}
function taskCatalogDate(value, path) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) throw new TaskCatalogError('Use an ISO timestamp.', path);
  const normalized = new Date(value).toISOString();
  if (normalized.slice(0, 19) !== value.slice(0, 19)) throw new TaskCatalogError('Invalid timestamp.', path);
  return normalized;
}

/** Freshness is for general public guidance, never a finding about this user's bill. */
export function getSelfAdvocacyTask(id, { now = new Date() } = {}) {
  const task = selfAdvocacyTasks.find(item => item.id === id);
  if (!task) return null;
  const receipts = task.sourceIds.map(sourceId => getSource(sourceId, { now }));
  const current = receipts.length > 0 && receipts.every(source => source?.current === true);
  const result = taskCatalogClone(task);
  return { ...result, current, sources: receipts.filter(Boolean),
    prepare: current ? result.prepare : [], evidence: current ? result.evidence : [],
    conversationStarter: current ? result.conversationStarter : `Help me identify the information I need for this task: ${result.title}. The public guidance needs source review; do not assume a policy or legal right.`,
    limitations: current ? result.limitations : ['The public guidance needs source review. Your private preparation remains available.', ...result.limitations] };
}

/** Optional local-only snapshot. Missing answers and false checkboxes remain distinct. */
export function validateTaskIntake(input) {
  taskCatalogObject(input, ['version', 'taskId', 'values', 'completedAt'], 'taskIntake');
  if (input.version !== 1) throw new TaskCatalogError('Unsupported task preparation version.', 'version');
  const task = selfAdvocacyTasks.find(item => item.id === input.taskId);
  if (!task) throw new TaskCatalogError('Unknown task.', 'taskId');
  taskCatalogObject(input.values, task.intakeFields.map(field => field.id), 'values');
  let size = 0;
  const values = {};
  for (const [id, value] of Object.entries(input.values)) {
    const field = task.intakeFields.find(item => item.id === id);
    if (field.type === 'checkbox') {
      if (typeof value !== 'boolean') throw new TaskCatalogError('Record true, false, or leave the answer absent.', `values.${id}`);
    } else {
      if (typeof value !== 'string' || value.length > TASK_INTAKE_LIMITS[field.type] || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/u.test(value)) throw new TaskCatalogError('Invalid or oversized local answer.', `values.${id}`);
      if (field.type !== 'textarea' && /[\r\n\t]/.test(value)) throw new TaskCatalogError('Use a single-line answer.', `values.${id}`);
      if (value && field.type === 'select' && !field.options?.includes(value)) throw new TaskCatalogError('Choose a listed option or leave the answer blank.', `values.${id}`);
      if (value && field.type === 'number' && !/^(?:0|[1-9]\d{0,11})(?:\.\d{1,4})?$/.test(value)) throw new TaskCatalogError('Use a nonnegative decimal, without currency symbols or an exponent.', `values.${id}`);
      if (value && field.type === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value + 'T00:00:00.000Z')) || new Date(value + 'T00:00:00.000Z').toISOString().slice(0, 10) !== value)) throw new TaskCatalogError('Use a real calendar date or leave it unknown.', `values.${id}`);
      size += value.length;
    }
    values[id] = value;
  }
  if (size > TASK_INTAKE_LIMITS.totalCharacters) throw new TaskCatalogError('Local preparation is too large.', 'values');
  if (!Object.hasOwn(input, 'completedAt')) throw new TaskCatalogError('A preparation timestamp or null is required.', 'completedAt');
  const completedAt = input.completedAt === null ? null : taskCatalogDate(input.completedAt, 'completedAt');
  return { version: 1, taskId: task.id, values, completedAt };
}

export function createTaskIntake(taskId, values = {}, { now = new Date() } = {}) {
  const date = new Date(now);
  if (!Number.isFinite(date.getTime())) throw new TaskCatalogError('Invalid preparation time.', 'now');
  return validateTaskIntake({ version: 1, taskId, values, completedAt: date.toISOString() });
}

/** Task intents and intake fields restored from the original GoldRock repository.
 * Prompts, outcome statistics, unsupported legal claims, and false professional personas are not reused.
 * Every answer is local preparation; source coverage is deliberately narrower than task breadth. */
export const TASK_CATEGORIES = Object.freeze([
  {
    "id": "advanced-financial",
    "title": "Debt and financial questions"
  },
  {
    "id": "appeal-system",
    "title": "Appeal stages"
  },
  {
    "id": "automation",
    "title": "Ongoing bill organization"
  },
  {
    "id": "beginner",
    "title": "Start here"
  },
  {
    "id": "coding-intelligence",
    "title": "Coding questions"
  },
  {
    "id": "core",
    "title": "Bill Advocate essentials"
  },
  {
    "id": "coverage-expansion",
    "title": "Coverage options"
  },
  {
    "id": "denial-reversal",
    "title": "Denial evidence"
  },
  {
    "id": "emergency",
    "title": "Emergency bills"
  },
  {
    "id": "facility",
    "title": "Hospital stay"
  },
  {
    "id": "financial",
    "title": "Payment and assistance"
  },
  {
    "id": "hardship-mastery",
    "title": "Financial assistance"
  },
  {
    "id": "hospital-insider",
    "title": "Hospital follow-through"
  },
  {
    "id": "insider",
    "title": "Billing and plan review"
  },
  {
    "id": "insurance",
    "title": "Coverage and claims"
  },
  {
    "id": "insurance-mastery",
    "title": "Plan-specific questions"
  },
  {
    "id": "legal-pro",
    "title": "Complaints and legal questions"
  },
  {
    "id": "provider",
    "title": "Provider charges"
  },
  {
    "id": "specialty",
    "title": "Specialty bills"
  }
]);
export const selfAdvocacyTasks = Object.freeze([
  {
    "id": "upload-medical-bill",
    "title": "Review a medical bill",
    "category": "core",
    "purpose": "Separate the statement, claim explanation, and supporting records before deciding what to question.",
    "intakeFields": [
      {
        "id": "billFile",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": true,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "accountNumber",
        "label": "Account Number",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": false,
        "description": "Date of service or admission",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the biller and service group; compare only matching documents",
      "Locate the current EOB and record the displayed balance separately from total patient responsibility",
      "List unclear lines for the billing office to explain"
    ],
    "evidence": [
      "Current bill",
      "Matching EOB",
      "Earlier statements and receipts"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review a medical bill. Separate the statement, claim explanation, and supporting records before deciding what to question. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 41,
      "endLine": 148,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "find-overcharges",
    "title": "Check unexpected charges",
    "category": "core",
    "purpose": "Build a specific charge question with evidence rather than assume a high price is an error.",
    "intakeFields": [
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Enter total amount owed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "Hospital",
          "Emergency Room",
          "Surgical Center",
          "Urgent Care",
          "Clinic",
          "Laboratory",
          "Imaging Center",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceType",
        "label": "Type of Service",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Surgery",
          "Diagnostic Tests",
          "Imaging",
          "Laboratory",
          "Consultation",
          "Procedure",
          "Admission",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billDetails",
        "label": "Bill Details",
        "type": "textarea",
        "required": false,
        "placeholder": "Paste line items, codes, or specific charges you question",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the exact charge, units, code, and service date",
      "Compare the billed description with your records of the service",
      "Ask for the calculation and correction review in writing"
    ],
    "evidence": [
      "Itemized statement",
      "Service records",
      "EOB adjustments"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Check unexpected charges. Build a specific charge question with evidence rather than assume a high price is an error. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 148,
      "endLine": 250,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "get-itemized-bill",
    "title": "Request an itemized bill",
    "category": "core",
    "purpose": "Prepare a request for the detail needed to review a summary statement.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital/Provider",
        "type": "text",
        "required": true,
        "placeholder": "Full facility name",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "accountNumber",
        "label": "Account Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": true,
        "description": "Date of service or admission",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "patientAddress",
        "label": "Patient Address",
        "type": "textarea",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      }
    ],
    "prepare": [
      "Identify which biller issued the summary",
      "Ask for service dates, descriptions, codes, units, and payment adjustments",
      "Ask how to obtain the detailed statement and record the response"
    ],
    "evidence": [
      "Summary statement",
      "Biller contact from a trusted source",
      "Request and response record"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Request an itemized bill. Prepare a request for the detail needed to review a summary statement. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 250,
      "endLine": 387,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "getting-started-bill-review",
    "title": "Start with a new bill",
    "category": "beginner",
    "purpose": "Choose an understandable first step from the document and insurance situation.",
    "intakeFields": [
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "What is the total amount you owe?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "visitType",
        "label": "Type of Visit",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Room",
          "Hospital Stay",
          "Surgery",
          "Doctor Visit",
          "Diagnostic Test",
          "Laboratory",
          "X-ray/Imaging",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hadInsurance",
        "label": "Did you have insurance?",
        "type": "select",
        "required": true,
        "options": [
          "Yes - Insurance covered some",
          "Yes - Insurance denied",
          "No - No insurance",
          "Not sure"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "mainConcern",
        "label": "What concerns you most?",
        "type": "select",
        "required": true,
        "options": [
          "Bill seems too high",
          "Charged for things I didn't receive",
          "Insurance should have covered more",
          "Want to understand the charges",
          "Need help negotiating payment"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Determine whether this is a bill, estimate, denial, or EOB",
      "Identify which person, biller, and service the document covers",
      "Write one question about the amount or claim before contacting billing"
    ],
    "evidence": [
      "Document type",
      "Coverage used",
      "Main concern"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Start with a new bill. Choose an understandable first step from the document and insurance situation. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 387,
      "endLine": 443,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "simple-itemized-request",
    "title": "Make a simple bill request",
    "category": "beginner",
    "purpose": "Ask the billing office for a readable breakdown without needing technical codes first.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital or Provider",
        "type": "text",
        "required": true,
        "placeholder": "Where did you receive care?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "visitDate",
        "label": "Date of Visit",
        "type": "date",
        "required": true,
        "description": "When did you receive care?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "emailPreference",
        "label": "Preferred Response Method",
        "type": "select",
        "required": true,
        "options": [
          "Email (fastest)",
          "Mail (traditional)",
          "Either email or mail"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Locate the billing office on an authentic statement",
      "Request the itemized version and preferred response method",
      "Keep a local note of when and how the request was made"
    ],
    "evidence": [
      "Summary bill",
      "Service reference",
      "Contact log"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Make a simple bill request. Ask the billing office for a readable breakdown without needing technical codes first. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 443,
      "endLine": 499,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "basic-overcharge-detector",
    "title": "Spot charges to check",
    "category": "beginner",
    "purpose": "Turn a remembered service mismatch into a question for the provider.",
    "intakeFields": [
      {
        "id": "billType",
        "label": "What type of bill?",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Room visit",
          "Hospital stay (1-2 days)",
          "Hospital stay (3+ days)",
          "Outpatient surgery",
          "Diagnostic tests only",
          "Doctor consultation",
          "Multiple visits/treatments"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "stayLength",
        "label": "If hospitalized, how long?",
        "type": "select",
        "required": false,
        "options": [
          "Same day",
          "1 night",
          "2-3 nights",
          "4-7 nights",
          "Over 1 week",
          "Not applicable"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "mainServices",
        "label": "Main services received",
        "type": "textarea",
        "required": false,
        "placeholder": "List the main treatments, tests, or procedures (e.g., blood work, X-ray, IV fluids, surgery type)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "suspiciousCharges",
        "label": "Charges that seem wrong",
        "type": "textarea",
        "required": false,
        "placeholder": "Any specific charges that surprised you or seem too high?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Compare dates and quantities with your own records",
      "Distinguish a duplicate statement from duplicate services",
      "Ask what each unclear charge represents before calling it incorrect"
    ],
    "evidence": [
      "Itemized lines",
      "Visit or stay dates",
      "Earlier bills"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Spot charges to check. Turn a remembered service mismatch into a question for the provider. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 499,
      "endLine": 555,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "quick-dispute-letter",
    "title": "Prepare a billing correction request",
    "category": "beginner",
    "purpose": "Describe a specific suspected error and the change you are asking the biller to investigate.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital Name",
        "type": "text",
        "required": true,
        "placeholder": "Full name of hospital or clinic",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "errorType",
        "label": "Type of Error Found",
        "type": "select",
        "required": true,
        "options": [
          "Charged for services not received",
          "Duplicate/double charges",
          "Wrong dates or quantities",
          "Overcharged for basic items",
          "Insurance should have covered this",
          "Billed wrong person/account",
          "Other billing mistake"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "specificError",
        "label": "Describe the Specific Error",
        "type": "textarea",
        "required": true,
        "placeholder": "Explain exactly what's wrong (e.g., \"Charged $200 for 5 aspirin pills\" or \"Billed for room service I never ordered\")",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "requestedAction",
        "label": "What do you want?",
        "type": "select",
        "required": true,
        "options": [
          "Remove the incorrect charges",
          "Reduce overcharged items to fair price",
          "Apply my insurance coverage",
          "Correct the billing error",
          "Provide explanation for charges"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "State the disputed line and reason without inventing wrongdoing",
      "List supporting documents and the requested correction or explanation",
      "Keep the response and any revised statement as separate evidence"
    ],
    "evidence": [
      "Disputed line",
      "Supporting record",
      "Requested outcome"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a billing correction request. Describe a specific suspected error and the change you are asking the biller to investigate. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 555,
      "endLine": 616,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "medical-codes-guide",
    "title": "Ask about billing codes",
    "category": "beginner",
    "purpose": "Prepare code and modifier questions for qualified billing staff.",
    "intakeFields": [
      {
        "id": "cptCodes",
        "label": "CPT Codes (Procedure Codes)",
        "type": "textarea",
        "required": false,
        "placeholder": "Enter any 5-digit codes from your bill (e.g., 99213, 71020, 85025)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "icdCodes",
        "label": "ICD Codes (Diagnosis Codes)",
        "type": "textarea",
        "required": false,
        "placeholder": "Enter diagnosis codes if shown (e.g., Z00.00, M25.50)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "actualServices",
        "label": "What Services Did You Actually Receive?",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe what was actually done (e.g., doctor examined my knee, took blood, got chest X-ray)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "questionableServices",
        "label": "Any Services You Don't Remember?",
        "type": "textarea",
        "required": false,
        "placeholder": "Any procedures or tests listed that you don't remember having?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Copy codes exactly as printed and distinguish procedure from diagnosis codes",
      "Ask how the billed code relates to the documented service",
      "Ask whether units, modifiers, or separate components explain repeated entries"
    ],
    "evidence": [
      "Printed codes and modifiers",
      "Itemized descriptions",
      "Service record references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Ask about billing codes. Prepare code and modifier questions for qualified billing staff. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 616,
      "endLine": 683,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "simple-payment-negotiation",
    "title": "Ask about payment options",
    "category": "beginner",
    "purpose": "Compare assistance and repayment terms before agreeing to a monthly amount.",
    "intakeFields": [
      {
        "id": "billAmount",
        "label": "Total Amount Owed",
        "type": "number",
        "required": true,
        "placeholder": "What is your total bill amount?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "monthlyBudget",
        "label": "What Can You Afford Monthly?",
        "type": "number",
        "required": true,
        "placeholder": "Realistic monthly payment amount",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "financialSituation",
        "label": "Financial Situation",
        "type": "select",
        "required": true,
        "options": [
          "Limited income/fixed budget",
          "Temporary financial hardship",
          "Unemployed/job loss",
          "Student/low income",
          "Medical bills from multiple providers",
          "Other financial challenges"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hasBeenContacted",
        "label": "Has the hospital contacted you?",
        "type": "select",
        "required": true,
        "options": [
          "No contact yet",
          "Received bills in mail",
          "Got payment notices",
          "Been called about payment",
          "Sent to collections"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask about assistance and correction review first",
      "Request written interest, fees, term, and missed-payment conditions",
      "Use an affordable budget and confirm what happens while a request is reviewed"
    ],
    "evidence": [
      "Current balance",
      "Budget you choose to record",
      "Written payment terms"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Ask about payment options. Compare assistance and repayment terms before agreeing to a monthly amount. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 683,
      "endLine": 774,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-medical-debt",
      "cfpb-medical-financing"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "afford"
  },
  {
    "id": "appeal-dispute",
    "title": "Choose a dispute or appeal route",
    "category": "core",
    "purpose": "Separate provider billing corrections from a health-plan coverage appeal.",
    "intakeFields": [
      {
        "id": "patientName",
        "label": "Patient Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalName",
        "label": "Hospital Name",
        "type": "text",
        "required": true,
        "placeholder": "Full facility name",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount being disputed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "disputeType",
        "label": "Dispute Type",
        "type": "select",
        "required": true,
        "options": [
          "Billing Errors",
          "Overcharges",
          "Services Not Received",
          "Duplicate Charges",
          "Insurance Coverage Issues",
          "Quality of Care",
          "Financial Hardship"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "specificIssues",
        "label": "Specific Issues",
        "type": "textarea",
        "required": true,
        "placeholder": "Detail the specific charges or errors being disputed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "supportingEvidence",
        "label": "Supporting Evidence",
        "type": "textarea",
        "required": false,
        "placeholder": "Insurance EOB, medical records, previous communications",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify who made the decision and what notice explains it",
      "Ask which correction or formal appeal channel applies",
      "Record the actual notice deadline independently of phone discussions"
    ],
    "evidence": [
      "Bill or denial",
      "Decision reason",
      "Supporting correspondence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Choose a dispute or appeal route. Separate provider billing corrections from a health-plan coverage appeal. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 774,
      "endLine": 866,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "emergency-room-dispute",
    "title": "Review an emergency-room bill",
    "category": "emergency",
    "purpose": "Separate emergency facility and clinician charges and identify what needs explanation.",
    "intakeFields": [
      {
        "id": "erVisitDate",
        "label": "ER Visit Date",
        "type": "date",
        "required": true,
        "description": "Date of emergency room visit",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "chiefComplaint",
        "label": "Reason for Visit",
        "type": "textarea",
        "required": true,
        "placeholder": "What brought you to the ER?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentReceived",
        "label": "Treatment Received",
        "type": "textarea",
        "required": true,
        "placeholder": "Tests, procedures, medications given",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "erLevel",
        "label": "ER Level Billed",
        "type": "select",
        "required": false,
        "options": [
          "Level 1 (99281)",
          "Level 2 (99282)",
          "Level 3 (99283)",
          "Level 4 (99284)",
          "Level 5 (99285)",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityFee",
        "label": "Facility Fee Amount",
        "type": "number",
        "required": false,
        "placeholder": "Emergency room facility fee",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "waitTime",
        "label": "Wait Time",
        "type": "text",
        "required": false,
        "placeholder": "How long did you wait to be seen?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify facility and professional bills separately",
      "Ask which documented factors support the billed service level",
      "Check coverage and network facts before asking about surprise-billing protections"
    ],
    "evidence": [
      "ER itemized bill",
      "EOB",
      "Service and network references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review an emergency-room bill. Separate emergency facility and clinician charges and identify what needs explanation. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 866,
      "endLine": 924,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "surgery-bill-analysis",
    "title": "Review surgery charges",
    "category": "specialty",
    "purpose": "Organize surgical, anesthesia, device, and facility questions by biller.",
    "intakeFields": [
      {
        "id": "surgeryType",
        "label": "Surgery Type",
        "type": "text",
        "required": true,
        "placeholder": "Name of surgical procedure",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "surgeryDate",
        "label": "Surgery Date",
        "type": "date",
        "required": true,
        "description": "Date of surgical procedure",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "surgeon",
        "label": "Surgeon Name",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "anesthesiaTime",
        "label": "Anesthesia Time",
        "type": "text",
        "required": false,
        "placeholder": "Duration in minutes",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "surgeryDuration",
        "label": "Surgery Duration",
        "type": "text",
        "required": false,
        "placeholder": "Total time in OR",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "implants",
        "label": "Implants/Devices",
        "type": "textarea",
        "required": false,
        "placeholder": "Any medical devices or implants used",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "complications",
        "label": "Complications",
        "type": "textarea",
        "required": false,
        "placeholder": "Any complications or extended procedures",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Compare the itemized bill with operative and anesthesia record references",
      "Ask how reported time, units, implants, and separate clinicians were billed",
      "Preserve revised bills and EOBs before comparing responsibility"
    ],
    "evidence": [
      "Surgical bill",
      "Operative and anesthesia record references",
      "Device details"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review surgery charges. Organize surgical, anesthesia, device, and facility questions by biller. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 924,
      "endLine": 989,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "diagnostic-overcharges",
    "title": "Review diagnostic-test charges",
    "category": "specialty",
    "purpose": "Check whether test, component, contrast, or repeat-service details explain the bill.",
    "intakeFields": [
      {
        "id": "testType",
        "label": "Type of Tests",
        "type": "select",
        "required": true,
        "options": [
          "Laboratory Tests",
          "X-rays",
          "CT Scans",
          "MRI",
          "Ultrasound",
          "Nuclear Medicine",
          "PET Scans",
          "Multiple Test Types"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "testCodes",
        "label": "CPT/Test Codes",
        "type": "textarea",
        "required": false,
        "placeholder": "List any CPT codes or test names from your bill",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "orderingProvider",
        "label": "Ordering Provider",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "testFacility",
        "label": "Testing Facility",
        "type": "text",
        "required": true,
        "placeholder": "Where tests were performed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgentStat",
        "label": "Urgent/STAT Tests",
        "type": "checkbox",
        "required": false,
        "description": "Were tests marked as urgent or STAT?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "contrastUsed",
        "label": "Contrast Material Used",
        "type": "checkbox",
        "required": false,
        "description": "Was contrast or dye used?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "List the test codes and separately billed components",
      "Ask how contrast, urgency, and reference-lab services affected charges",
      "Compare the EOB and request clarification of any repeated test"
    ],
    "evidence": [
      "Test orders or record references",
      "Itemized codes",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review diagnostic-test charges. Check whether test, component, contrast, or repeat-service details explain the bill. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 989,
      "endLine": 1048,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "insurance-appeal-mastery",
    "title": "Prepare an insurance appeal",
    "category": "insurance",
    "purpose": "Build an appeal around the actual denial reason and plan procedure.",
    "intakeFields": [
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "policyNumber",
        "label": "Policy Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "claimNumber",
        "label": "Claim Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "denialReason",
        "label": "Denial Reason",
        "type": "select",
        "required": true,
        "options": [
          "Not Medically Necessary",
          "Experimental/Investigational",
          "Out of Network",
          "Pre-authorization Required",
          "Duplicate Services",
          "Billing Errors",
          "Policy Exclusion",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDescription",
        "label": "Service/Treatment",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe the denied service or treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalNecessity",
        "label": "Medical Necessity",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was this treatment medically necessary?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSupport",
        "label": "Physician Documentation",
        "type": "textarea",
        "required": false,
        "placeholder": "Supporting documentation from healthcare providers",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the denial, applicable plan provision, and relevant claim records",
      "Ask the treating team for evidence responsive to the stated criterion",
      "Confirm the formal filing route and deadline on the notice"
    ],
    "evidence": [
      "Denial notice",
      "Plan provision and claim file",
      "Clinician support"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare an insurance appeal. Build an appeal around the actual denial reason and plan procedure. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1048,
      "endLine": 1117,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "financial-hardship-application",
    "title": "Prepare a financial-assistance request",
    "category": "financial",
    "purpose": "Match your circumstances to the hospital's current assistance policy.",
    "intakeFields": [
      {
        "id": "householdSize",
        "label": "Household Size",
        "type": "number",
        "required": true,
        "placeholder": "Number of people in household",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "annualIncome",
        "label": "Annual Income",
        "type": "number",
        "required": true,
        "placeholder": "Gross annual household income",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "employmentStatus",
        "label": "Employment Status",
        "type": "select",
        "required": true,
        "options": [
          "Employed",
          "Unemployed",
          "Disabled",
          "Retired",
          "Student",
          "Self-Employed",
          "Part-Time"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "monthlyExpenses",
        "label": "Monthly Expenses",
        "type": "number",
        "required": true,
        "placeholder": "Total monthly living expenses",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalExpenses",
        "label": "Medical Expenses",
        "type": "number",
        "required": false,
        "placeholder": "Monthly medical costs",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "hardshipReason",
        "label": "Hardship Circumstances",
        "type": "textarea",
        "required": true,
        "placeholder": "Explain your financial hardship situation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insurance",
        "label": "Insurance Status",
        "type": "select",
        "required": true,
        "options": [
          "No Insurance",
          "Medicaid",
          "Medicare",
          "Private Insurance",
          "Underinsured"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the policy, application, and covered-provider list",
      "Check required household and income evidence without assuming a universal threshold",
      "Request a receipt and the process for missing documents or review"
    ],
    "evidence": [
      "Current assistance policy",
      "Requested financial evidence",
      "Application receipt"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a financial-assistance request. Match your circumstances to the hospital's current assistance policy. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1117,
      "endLine": 1212,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "irs-financial-assistance",
      "irs-fap-provider-list"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "afford"
  },
  {
    "id": "medicare-medicaid-review",
    "title": "Review a public-program bill",
    "category": "insurance",
    "purpose": "Identify the particular Medicare or Medicaid route before questioning patient responsibility.",
    "intakeFields": [
      {
        "id": "programType",
        "label": "Program Type",
        "type": "select",
        "required": true,
        "options": [
          "Medicare Part A",
          "Medicare Part B",
          "Medicare Advantage",
          "Medicaid",
          "Medicare/Medicaid Dual",
          "Medicare Supplement"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "beneficiaryId",
        "label": "Beneficiary ID",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "serviceType",
        "label": "Service Type",
        "type": "select",
        "required": true,
        "options": [
          "Inpatient Hospital",
          "Outpatient Services",
          "Physician Services",
          "DME/Supplies",
          "Home Health",
          "Skilled Nursing",
          "Dialysis",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "eobReceived",
        "label": "EOB/MSN Received",
        "type": "checkbox",
        "required": false,
        "description": "Did you receive an Explanation of Benefits or Medicare Summary Notice?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "providerBilled",
        "label": "Provider Billed Amount",
        "type": "number",
        "required": false,
        "placeholder": "Amount provider billed Medicare/Medicaid",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "patientResponsibility",
        "label": "Patient Responsibility",
        "type": "number",
        "required": false,
        "placeholder": "Amount you owe after insurance",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Distinguish Original Medicare, Medicare Advantage, drug coverage, and Medicaid",
      "Match the notice to the service and program",
      "Ask the program or plan about the stated responsibility and applicable review process"
    ],
    "evidence": [
      "Program-specific notice",
      "Bill",
      "Coverage and service dates"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review a public-program bill. Identify the particular Medicare or Medicaid route before questioning patient responsibility. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1212,
      "endLine": 1308,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "medicare-appeals",
      "medicaid-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "pharmacy-drug-overcharges",
    "title": "Review medication charges",
    "category": "specialty",
    "purpose": "Separate medication, administration, dispensing, and coverage questions.",
    "intakeFields": [
      {
        "id": "medicationList",
        "label": "Medications Billed",
        "type": "textarea",
        "required": true,
        "placeholder": "List all medications and doses from your bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "pharmacyType",
        "label": "Pharmacy Type",
        "type": "select",
        "required": true,
        "options": [
          "Hospital Pharmacy",
          "Retail Pharmacy",
          "Specialty Pharmacy",
          "Compounding Pharmacy",
          "Mail Order",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "dispensingFees",
        "label": "Dispensing Fees",
        "type": "number",
        "required": false,
        "placeholder": "Total dispensing or handling fees",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "administrationFees",
        "label": "Administration Fees",
        "type": "number",
        "required": false,
        "placeholder": "IV or injection administration fees",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "brandVsGeneric",
        "label": "Brand vs Generic",
        "type": "select",
        "required": false,
        "options": [
          "All Brand Name",
          "All Generic",
          "Mixed Brand/Generic",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "insuranceCoverage",
        "label": "Insurance Coverage",
        "type": "textarea",
        "required": false,
        "placeholder": "What did insurance cover for medications?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Confirm the drug, units, and each separately billed fee",
      "Ask which benefit and pharmacy network processed the claim",
      "Ask the prescriber or program about legitimate assistance options without changing treatment"
    ],
    "evidence": [
      "Pharmacy or infusion bill",
      "Benefit explanation",
      "Drug and unit reference"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review medication charges. Separate medication, administration, dispensing, and coverage questions. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1308,
      "endLine": 1376,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "physical-therapy-review",
    "title": "Review therapy sessions and units",
    "category": "specialty",
    "purpose": "Compare billed therapy dates and units with session records.",
    "intakeFields": [
      {
        "id": "therapyType",
        "label": "Therapy Type",
        "type": "select",
        "required": true,
        "options": [
          "Physical Therapy",
          "Occupational Therapy",
          "Speech Therapy",
          "Multiple Therapies"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "sessionCount",
        "label": "Number of Sessions",
        "type": "number",
        "required": true,
        "placeholder": "Total therapy sessions billed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentDates",
        "label": "Treatment Period",
        "type": "text",
        "required": true,
        "placeholder": "Start and end dates of therapy",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "therapyGoals",
        "label": "Therapy Goals",
        "type": "textarea",
        "required": false,
        "placeholder": "What were the goals of therapy?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "groupVsIndividual",
        "label": "Session Type",
        "type": "select",
        "required": false,
        "options": [
          "Individual Sessions",
          "Group Sessions",
          "Mixed Individual/Group",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "List sessions and the units billed on each date",
      "Ask how group, individual, and timed services were recorded",
      "Separate a billing correction from a visit-limit or coverage appeal"
    ],
    "evidence": [
      "Session record references",
      "Itemized units",
      "Plan denial or EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review therapy sessions and units. Compare billed therapy dates and units with session records. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1376,
      "endLine": 1439,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "radiology-billing-challenge",
    "title": "Review imaging bills",
    "category": "specialty",
    "purpose": "Check technical and professional components before treating separate imaging bills as duplicates.",
    "intakeFields": [
      {
        "id": "imagingType",
        "label": "Imaging Type",
        "type": "select",
        "required": true,
        "options": [
          "X-ray",
          "CT Scan",
          "MRI",
          "Ultrasound",
          "Nuclear Medicine",
          "PET/CT",
          "Mammography",
          "Multiple Studies"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "studyReason",
        "label": "Reason for Study",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was the imaging ordered?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "contrastUsed",
        "label": "Contrast Used",
        "type": "checkbox",
        "required": false,
        "description": "Was contrast or dye used?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "multipleViews",
        "label": "Multiple Views/Series",
        "type": "checkbox",
        "required": false,
        "description": "Were multiple views or series performed?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "readingPhysician",
        "label": "Reading Physician",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "facilityLocation",
        "label": "Imaging Facility",
        "type": "select",
        "required": true,
        "options": [
          "Hospital Radiology",
          "Independent Imaging Center",
          "Physician Office",
          "Mobile Unit",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the facility and interpreting clinician bills",
      "Ask about contrast, views, repeats, and component modifiers",
      "Match both bills to the claim explanation and network facts"
    ],
    "evidence": [
      "Imaging bill",
      "Reading bill if separate",
      "EOB and code details"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review imaging bills. Check technical and professional components before treating separate imaging bills as duplicates. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1439,
      "endLine": 1510,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "laboratory-disputes",
    "title": "Review laboratory charges",
    "category": "specialty",
    "purpose": "Ask whether panels, individual tests, and outside laboratories explain each charge.",
    "intakeFields": [
      {
        "id": "labTests",
        "label": "Laboratory Tests",
        "type": "textarea",
        "required": true,
        "placeholder": "List all lab tests from your bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "testCodes",
        "label": "CPT Codes",
        "type": "textarea",
        "required": false,
        "placeholder": "List any CPT codes from your bill",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "collectionFees",
        "label": "Collection Fees",
        "type": "number",
        "required": false,
        "placeholder": "Blood draw or specimen collection fees",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "urgentStat",
        "label": "STAT/Urgent Tests",
        "type": "checkbox",
        "required": false,
        "description": "Were any tests marked as STAT or urgent?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "panelTests",
        "label": "Test Panels",
        "type": "checkbox",
        "required": false,
        "description": "Were comprehensive panels or profiles ordered?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "referralLab",
        "label": "Reference Laboratory",
        "type": "checkbox",
        "required": false,
        "description": "Were tests sent to an outside reference lab?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Match tests and collection dates to the order or service record",
      "Ask which panel and individual charges overlap and why",
      "Confirm whether a reference laboratory billed separately"
    ],
    "evidence": [
      "Lab order reference",
      "Itemized test codes",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review laboratory charges. Ask whether panels, individual tests, and outside laboratories explain each charge. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1510,
      "endLine": 1581,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "room-rate-challenges",
    "title": "Review hospital-stay charges",
    "category": "facility",
    "purpose": "Distinguish documented admission status, room dates, and extra fees.",
    "intakeFields": [
      {
        "id": "roomType",
        "label": "Room Type",
        "type": "select",
        "required": true,
        "options": [
          "Private Room",
          "Semi-Private",
          "ICU",
          "CCU",
          "Step-Down",
          "Emergency Department",
          "Observation",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "lengthOfStay",
        "label": "Length of Stay",
        "type": "number",
        "required": true,
        "placeholder": "Number of days/hours",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "admissionType",
        "label": "Admission Type",
        "type": "select",
        "required": true,
        "options": [
          "Inpatient",
          "Observation",
          "Outpatient",
          "Emergency",
          "Same-Day Surgery",
          "Unknown"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "roomPreference",
        "label": "Room Preference",
        "type": "select",
        "required": false,
        "options": [
          "No Preference",
          "Requested Private",
          "Medically Necessary Private",
          "Assigned Private",
          "Other"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityFees",
        "label": "Additional Facility Fees",
        "type": "textarea",
        "required": false,
        "placeholder": "List any additional facility or accommodation charges",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Request the recorded inpatient or observation status and relevant notice",
      "Compare billed days and room category with records",
      "Ask how the status affected coverage instead of assuming it can be negotiated"
    ],
    "evidence": [
      "Admission or observation notice",
      "Room-day charges",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review hospital-stay charges. Distinguish documented admission status, room dates, and extra fees. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1581,
      "endLine": 1650,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "ambulance-negotiations",
    "title": "Review ambulance charges",
    "category": "emergency",
    "purpose": "Check transport facts and distinguish ground from air-ambulance protections.",
    "intakeFields": [
      {
        "id": "ambulanceType",
        "label": "Ambulance Type",
        "type": "select",
        "required": true,
        "options": [
          "Ground Ambulance",
          "Air Ambulance",
          "Helicopter",
          "Fixed Wing Aircraft",
          "Wheelchair Van"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "transportReason",
        "label": "Transport Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was ambulance transport needed?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "mileage",
        "label": "Transport Mileage",
        "type": "number",
        "required": false,
        "placeholder": "Miles transported",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "emergencyVsNon",
        "label": "Emergency Status",
        "type": "select",
        "required": true,
        "options": [
          "Emergency - 911 Call",
          "Emergency - Hospital Transfer",
          "Non-Emergency - Scheduled",
          "Non-Emergency - Discharge",
          "Unknown"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "AdvancedLifeSupport",
        "label": "Life Support Level",
        "type": "select",
        "required": false,
        "options": [
          "BLS - Basic Life Support",
          "ALS1 - Advanced Life Support",
          "ALS2 - Advanced Life Support",
          "SCT - Specialty Care Transport",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "multiplePatients",
        "label": "Multiple Patients",
        "type": "checkbox",
        "required": false,
        "description": "Were multiple patients transported?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Verify billed mileage, transport type, and documented service level",
      "Identify coverage and the actual reason for nonpayment",
      "Ask about assistance and applicable billing protections without assuming ground transport is federally protected"
    ],
    "evidence": [
      "Transport bill",
      "Trip or service record reference",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review ambulance charges. Check transport facts and distinguish ground from air-ambulance protections. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1650,
      "endLine": 1722,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "specialist-consultation-review",
    "title": "Review a specialist bill",
    "category": "provider",
    "purpose": "Ask how consultation, procedures, and facility charges were separated.",
    "intakeFields": [
      {
        "id": "specialistType",
        "label": "Specialist Type",
        "type": "select",
        "required": true,
        "options": [
          "Cardiology",
          "Neurology",
          "Oncology",
          "Orthopedics",
          "Gastroenterology",
          "Pulmonology",
          "Endocrinology",
          "Other Specialty"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "consultationType",
        "label": "Consultation Type",
        "type": "select",
        "required": true,
        "options": [
          "Initial Consultation",
          "Follow-up Visit",
          "Second Opinion",
          "Pre-operative Consultation",
          "Emergency Consultation",
          "Telemedicine"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "visitDuration",
        "label": "Visit Duration",
        "type": "text",
        "required": false,
        "placeholder": "How long was the appointment?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "proceduresPerformed",
        "label": "Procedures Performed",
        "type": "textarea",
        "required": false,
        "placeholder": "Any procedures or tests done during visit",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "referralReason",
        "label": "Referral Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Why were you referred to this specialist?",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentPlan",
        "label": "Treatment Plan",
        "type": "textarea",
        "required": false,
        "placeholder": "What treatment plan was recommended?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Compare the visit and procedures with the itemized statement",
      "Ask what supports the billed level without relying only on visit duration",
      "Check the EOB and any separate facility bill"
    ],
    "evidence": [
      "Visit record reference",
      "Itemized bill",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review a specialist bill. Ask how consultation, procedures, and facility charges were separated. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1722,
      "endLine": 1794,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "medical-device-billing",
    "title": "Review medical-device charges",
    "category": "specialty",
    "purpose": "Clarify what was supplied and which device terms apply.",
    "intakeFields": [
      {
        "id": "deviceType",
        "label": "Device Type",
        "type": "select",
        "required": true,
        "options": [
          "Cardiac Implant",
          "Orthopedic Implant",
          "Surgical Mesh",
          "Stent",
          "Prosthetic",
          "DME Equipment",
          "Other Device"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deviceName",
        "label": "Device Name/Model",
        "type": "text",
        "required": false,
        "placeholder": "Specific device name or model number",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "implantDate",
        "label": "Implant/Service Date",
        "type": "date",
        "required": true,
        "description": "Date device was implanted or provided",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deviceCost",
        "label": "Device Cost",
        "type": "number",
        "required": false,
        "placeholder": "Amount charged for the device",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "surgicalFees",
        "label": "Associated Surgical Fees",
        "type": "number",
        "required": false,
        "placeholder": "Surgery fees related to device placement",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "warrantyInfo",
        "label": "Warranty Information",
        "type": "textarea",
        "required": false,
        "placeholder": "Any warranty or replacement information",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Verify the device model, quantity, and separate supply charges",
      "Ask for rental, purchase, warranty, or replacement terms when relevant",
      "Separate a pricing question from medical-necessity or coverage review"
    ],
    "evidence": [
      "Device invoice",
      "Written equipment terms",
      "EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review medical-device charges. Clarify what was supplied and which device terms apply. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1794,
      "endLine": 1865,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "workers-comp-medical",
    "title": "Organize work-injury billing questions",
    "category": "insurance",
    "purpose": "Prepare records for the applicable work-injury administrator without deciding liability.",
    "intakeFields": [
      {
        "id": "injuryDate",
        "label": "Date of Injury",
        "type": "date",
        "required": true,
        "description": "Date of work-related injury",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "injuryType",
        "label": "Type of Injury",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe the work-related injury",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimNumber",
        "label": "Claim Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "insuranceCarrier",
        "label": "Insurance Carrier",
        "type": "text",
        "required": true,
        "placeholder": "Workers comp insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Treatment",
          "Surgery",
          "Physical Therapy",
          "Diagnostic Tests",
          "Medications",
          "Multiple Treatments"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "returnToWork",
        "label": "Return to Work Status",
        "type": "select",
        "required": false,
        "options": [
          "Full Duty",
          "Light Duty",
          "Temporary Disability",
          "Permanent Disability",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the state process, carrier, claim status, and disputed bill",
      "Ask who should receive the bill while responsibility is being reviewed",
      "Keep claim and court notices for qualified case-specific advice"
    ],
    "evidence": [
      "Work-injury claim notice",
      "Bill",
      "Administrator correspondence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize work-injury billing questions. Prepare records for the applicable work-injury administrator without deciding liability. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1865,
      "endLine": 1939,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "auto-insurance-medical",
    "title": "Organize accident-related bills",
    "category": "insurance",
    "purpose": "Track accident-related claims and payer questions without assuming payment order.",
    "intakeFields": [
      {
        "id": "accidentDate",
        "label": "Accident Date",
        "type": "date",
        "required": true,
        "description": "Date of motor vehicle accident",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceCompany",
        "label": "Auto Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Auto insurance carrier name",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimNumber",
        "label": "Claim Number",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "injuryDescription",
        "label": "Injuries Sustained",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe injuries from the accident",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentFacilities",
        "label": "Treatment Facilities",
        "type": "textarea",
        "required": true,
        "placeholder": "List hospitals, clinics, or providers",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "pipCoverage",
        "label": "PIP Coverage Amount",
        "type": "number",
        "required": false,
        "placeholder": "Personal injury protection limit",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "faultStatus",
        "label": "Fault Status",
        "type": "select",
        "required": false,
        "options": [
          "At-fault",
          "Not at-fault",
          "Partial fault",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify potentially involved health and auto coverage",
      "Ask each payer about coordination, forms, and its actual filing instructions",
      "Keep lien or legal notices separate from ordinary billing correspondence"
    ],
    "evidence": [
      "Coverage documents",
      "Claim correspondence",
      "Medical bills and payment records"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize accident-related bills. Track accident-related claims and payer questions without assuming payment order. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 1939,
      "endLine": 2016,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "veterans-affairs-billing",
    "title": "Organize VA billing questions",
    "category": "insurance",
    "purpose": "Identify the VA or community-care route that produced the bill.",
    "intakeFields": [
      {
        "id": "vaEligibility",
        "label": "VA Eligibility Status",
        "type": "select",
        "required": true,
        "options": [
          "Service-Connected",
          "Non-Service Connected",
          "Priority Group 1-8",
          "Unknown Eligibility"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceConnection",
        "label": "Service-Connected Condition",
        "type": "textarea",
        "required": false,
        "placeholder": "Describe any service-connected conditions",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Routine Care",
          "Specialty Care",
          "Mental Health",
          "Rehabilitation",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "vaFacility",
        "label": "VA Facility Used",
        "type": "checkbox",
        "required": false,
        "description": "Was care received at a VA facility?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "nonVaProvider",
        "label": "Non-VA Provider",
        "type": "text",
        "required": false,
        "placeholder": "Name of non-VA healthcare provider",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "priorAuthorization",
        "label": "Prior Authorization",
        "type": "checkbox",
        "required": false,
        "description": "Was prior authorization obtained from VA?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record whether care was at VA or a non-VA facility",
      "Find authorization and any payment or denial notice",
      "Ask the responsible program which review process and deadline applies"
    ],
    "evidence": [
      "VA or community-care notice",
      "Authorization reference",
      "Bill"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize VA billing questions. Identify the VA or community-care route that produced the bill. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2016,
      "endLine": 2092,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "medicare-appeals",
      "medicaid-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "dental-oral-surgery",
    "title": "Review dental and oral-surgery bills",
    "category": "specialty",
    "purpose": "Clarify which parts of care were submitted to dental or medical coverage.",
    "intakeFields": [
      {
        "id": "procedureType",
        "label": "Dental Procedure",
        "type": "select",
        "required": true,
        "options": [
          "Oral Surgery",
          "Orthodontics",
          "Periodontics",
          "Endodontics",
          "Prosthodontics",
          "General Dentistry",
          "Multiple Procedures"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "dentalCodes",
        "label": "Dental Codes",
        "type": "textarea",
        "required": false,
        "placeholder": "List any ADA/CDT codes from your bill",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "medicalNecessity",
        "label": "Medical Necessity",
        "type": "select",
        "required": false,
        "options": [
          "Medically Necessary",
          "Cosmetic",
          "Preventive",
          "Emergency",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "hospitalSetting",
        "label": "Hospital Setting",
        "type": "checkbox",
        "required": false,
        "description": "Was procedure done in hospital setting?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "anesthesiaUsed",
        "label": "Anesthesia Used",
        "type": "select",
        "required": false,
        "options": [
          "Local",
          "IV Sedation",
          "General Anesthesia",
          "None",
          "Unknown"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "dentalInsurance",
        "label": "Dental Insurance",
        "type": "select",
        "required": false,
        "options": [
          "Dental Plan Only",
          "Medical Insurance",
          "Both Dental and Medical",
          "No Insurance"
        ],
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Separate dental procedure, anesthesia, and facility charges",
      "Ask which plan processed each part and the stated reason for denial",
      "Ask the treating team for documentation if a coverage review needs it"
    ],
    "evidence": [
      "Dental and medical EOBs",
      "Procedure bill",
      "Denial or authorization reference"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review dental and oral-surgery bills. Clarify which parts of care were submitted to dental or medical coverage. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2092,
      "endLine": 2165,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "mental-health-billing",
    "title": "Review mental-health bills",
    "category": "specialty",
    "purpose": "Separate charge accuracy, benefit limits, and denial review.",
    "intakeFields": [
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Inpatient Psychiatric",
          "Outpatient Therapy",
          "Intensive Outpatient",
          "Substance Abuse Treatment",
          "Crisis Intervention",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerType",
        "label": "Provider Type",
        "type": "select",
        "required": true,
        "options": [
          "Psychiatrist",
          "Psychologist",
          "Licensed Therapist",
          "Social Worker",
          "Substance Abuse Counselor",
          "Multiple Providers"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "sessionCount",
        "label": "Number of Sessions",
        "type": "number",
        "required": false,
        "placeholder": "Total therapy sessions billed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentLength",
        "label": "Treatment Duration",
        "type": "text",
        "required": false,
        "placeholder": "Length of treatment period",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "priorAuthorization",
        "label": "Prior Authorization",
        "type": "checkbox",
        "required": false,
        "description": "Was prior authorization required?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "parityIssues",
        "label": "Parity Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any mental health parity or coverage issues?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Match billed sessions and care setting to service records",
      "Ask for the coverage provision and rationale behind a limit or denial",
      "Ask which appeal or parity-question route applies to this plan"
    ],
    "evidence": [
      "Session bill",
      "Denial and plan provision",
      "Clinician documentation reference"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review mental-health bills. Separate charge accuracy, benefit limits, and denial review. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2165,
      "endLine": 2244,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "appeal"
  },
  {
    "id": "hospital-billing-insider-tactics",
    "title": "Plan a hospital billing escalation",
    "category": "insider",
    "purpose": "Build a factual escalation trail when the first contact does not resolve a question.",
    "intakeFields": [
      {
        "id": "hospitalType",
        "label": "Hospital Type",
        "type": "select",
        "required": true,
        "options": [
          "Major Academic Medical Center",
          "Regional Hospital System",
          "Nonprofit Hospital",
          "For-Profit Hospital Chain",
          "Critical Access Hospital",
          "Specialty Hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount owed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billingDepartmentContact",
        "label": "Billing Contact Info",
        "type": "textarea",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "previousNegotiations",
        "label": "Previous Negotiations",
        "type": "textarea",
        "required": false,
        "placeholder": "Any previous attempts to negotiate or dispute",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "urgencyLevel",
        "label": "Urgency Level",
        "type": "select",
        "required": true,
        "options": [
          "Immediate payment demanded",
          "Collections threatened",
          "Already in collections",
          "Normal billing cycle",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Summarize the exact unresolved issue and prior responses",
      "Ask for the appropriate supervisor, financial counselor, or patient-relations route",
      "Request written confirmation of any correction, assistance review, or payment terms"
    ],
    "evidence": [
      "Contact log",
      "Unresolved charge or policy question",
      "Written responses"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Plan a hospital billing escalation. Build a factual escalation trail when the first contact does not resolve a question. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2244,
      "endLine": 2319,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "insurance-weakness-exploiter",
    "title": "Understand an insurer's review process",
    "category": "insider",
    "purpose": "Identify the actual review procedure instead of guessing internal incentives.",
    "intakeFields": [
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialCode",
        "label": "Denial Code",
        "type": "text",
        "required": false,
        "placeholder": "Specific denial reason code",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "claimAmount",
        "label": "Claim Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total claim amount denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceType",
        "label": "Service Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Surgery",
          "Hospital Stay",
          "Specialty Treatment",
          "Mental Health",
          "Rehabilitation",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "policyDetails",
        "label": "Policy Information",
        "type": "textarea",
        "required": true,
        "placeholder": "Policy number, plan type, and relevant coverage details",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "appealHistory",
        "label": "Appeal History",
        "type": "textarea",
        "required": false,
        "placeholder": "Previous appeals or communications with insurance",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask for the exact denial reason and controlling plan provision",
      "Request relevant records and the official appeal route",
      "Record the response and notice deadline separately from informal discussions"
    ],
    "evidence": [
      "Denial code and notice",
      "Plan documents",
      "Contact log"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Understand an insurer's review process. Identify the actual review procedure instead of guessing internal incentives. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2319,
      "endLine": 2397,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "medical-coding-arbitrage",
    "title": "Prepare a coding review",
    "category": "insider",
    "purpose": "Turn code comparisons into questions for the billing or coding team.",
    "intakeFields": [
      {
        "id": "procedureCodes",
        "label": "Procedure Codes (CPT)",
        "type": "textarea",
        "required": true,
        "placeholder": "List all CPT codes from your bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "diagnosisCodes",
        "label": "Diagnosis Codes (ICD-10)",
        "type": "textarea",
        "required": false,
        "placeholder": "List all ICD-10 diagnosis codes",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "Hospital Inpatient",
          "Hospital Outpatient",
          "Ambulatory Surgery Center",
          "Emergency Department",
          "Physician Office",
          "Multiple Facilities"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "procedureDetails",
        "label": "Actual Procedures",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe exactly what procedures were actually performed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "codeRelatedCharges",
        "label": "Code-Related Charges",
        "type": "number",
        "required": true,
        "placeholder": "Total charges related to procedure codes",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record exact codes, modifiers, dates, and units",
      "Ask whether a global service or separate component explains the charges",
      "Request review against the documented service rather than suggest unsupported recoding"
    ],
    "evidence": [
      "Itemized codes",
      "Service record references",
      "EOB adjustments"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a coding review. Turn code comparisons into questions for the billing or coding team. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2397,
      "endLine": 2472,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "provider-network-leverage",
    "title": "Question a network-status mismatch",
    "category": "insider",
    "purpose": "Gather the evidence behind conflicting network representations.",
    "intakeFields": [
      {
        "id": "networkStatus",
        "label": "Network Status",
        "type": "select",
        "required": true,
        "options": [
          "Listed as In-Network",
          "Listed as Out-of-Network",
          "Emergency Care",
          "Unknown Network Status",
          "Provider Claims In-Network",
          "Insurance Claims Out-of-Network"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerName",
        "label": "Provider/Hospital Name",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "insurancePlan",
        "label": "Insurance Plan",
        "type": "text",
        "required": true,
        "placeholder": "Insurance company and plan type",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": true,
        "description": "Date of service",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "networkVerification",
        "label": "Network Verification",
        "type": "textarea",
        "required": false,
        "placeholder": "Any verification of network status you received",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "balanceBilled",
        "label": "Balance Billed Amount",
        "type": "number",
        "required": true,
        "placeholder": "Amount you owe after insurance",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record the plan, service date, facility, and clinician separately",
      "Preserve directory or verification references and what was communicated",
      "Ask the plan to explain network processing and the applicable correction or appeal route"
    ],
    "evidence": [
      "Network verification reference",
      "EOB",
      "Provider bill"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Question a network-status mismatch. Gather the evidence behind conflicting network representations. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2472,
      "endLine": 2550,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-cms-directory",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "hidden-revenue-stream-detector",
    "title": "Find assistance options to investigate",
    "category": "advanced-financial",
    "purpose": "Build a program-specific assistance checklist without inventing eligibility.",
    "intakeFields": [
      {
        "id": "totalMedicalDebt",
        "label": "Total Medical Debt",
        "type": "number",
        "required": true,
        "placeholder": "All medical bills combined",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "householdIncome",
        "label": "Annual Household Income",
        "type": "number",
        "required": true,
        "placeholder": "Gross annual household income",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "householdSize",
        "label": "Household Size",
        "type": "number",
        "required": true,
        "placeholder": "Number of people in household",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalConditions",
        "label": "Medical Conditions",
        "type": "textarea",
        "required": true,
        "placeholder": "List all ongoing medical conditions and treatments",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "currentProviders",
        "label": "Healthcare Providers",
        "type": "textarea",
        "required": true,
        "placeholder": "List all hospitals, doctors, and providers involved",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medications",
        "label": "Current Medications",
        "type": "textarea",
        "required": false,
        "placeholder": "List expensive medications you take regularly",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Start with hospital assistance and separately billing providers",
      "Ask about medication or disease-specific programs relevant to the bill",
      "Verify the current program, benefit restrictions, and documentation before applying"
    ],
    "evidence": [
      "Program policies",
      "Current billers",
      "Eligibility evidence requested by each program"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Find assistance options to investigate. Build a program-specific assistance checklist without inventing eligibility. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2550,
      "endLine": 2629,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "irs-financial-assistance",
      "irs-fap-provider-list"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "afford"
  },
  {
    "id": "bankruptcy-protection-strategist",
    "title": "Prepare for debt and legal advice",
    "category": "advanced-financial",
    "purpose": "Organize medical debt and questions for a qualified counselor or attorney.",
    "intakeFields": [
      {
        "id": "totalMedicalDebt",
        "label": "Total Medical Debt",
        "type": "number",
        "required": true,
        "placeholder": "All medical debt combined",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "otherDebt",
        "label": "Other Debt",
        "type": "number",
        "required": true,
        "placeholder": "Credit cards, loans, other debt",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "monthlyIncome",
        "label": "Monthly Income",
        "type": "number",
        "required": true,
        "placeholder": "Total monthly household income",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "assets",
        "label": "Major Assets",
        "type": "textarea",
        "required": true,
        "placeholder": "Home, vehicles, savings, investments",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "ongoingMedicalCosts",
        "label": "Ongoing Medical Costs",
        "type": "number",
        "required": false,
        "placeholder": "Monthly medical expenses",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "bankruptcyConcerns",
        "label": "Bankruptcy Concerns",
        "type": "textarea",
        "required": false,
        "placeholder": "What concerns you about bankruptcy?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Separate disputed bills from confirmed balances and legal notices",
      "List assistance and correction requests already attempted",
      "Seek case-specific advice before debt, asset, or bankruptcy decisions"
    ],
    "evidence": [
      "Debt inventory",
      "Court or collection notices",
      "Income and asset notes kept locally"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for debt and legal advice. Organize medical debt and questions for a qualified counselor or attorney. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2629,
      "endLine": 2707,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "tax-deduction-maximizer",
    "title": "Organize medical-expense tax questions",
    "category": "advanced-financial",
    "purpose": "Prepare a record list for tax guidance without calculating an entitlement.",
    "intakeFields": [
      {
        "id": "annualMedicalExpenses",
        "label": "Annual Medical Expenses",
        "type": "number",
        "required": true,
        "placeholder": "Total medical expenses for tax year",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "adjustedGrossIncome",
        "label": "Adjusted Gross Income",
        "type": "number",
        "required": true,
        "placeholder": "AGI from tax return",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalTravelExpenses",
        "label": "Medical Travel Expenses",
        "type": "number",
        "required": false,
        "placeholder": "Travel costs for medical care",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "homeModifications",
        "label": "Medical Home Modifications",
        "type": "number",
        "required": false,
        "placeholder": "Home modifications for medical needs",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "hsaFsaContributions",
        "label": "HSA/FSA Contributions",
        "type": "number",
        "required": false,
        "placeholder": "Current HSA/FSA contributions",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "alternativeTreatments",
        "label": "Alternative Treatments",
        "type": "textarea",
        "required": false,
        "placeholder": "Alternative or complementary medical treatments",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Separate amounts paid, reimbursed, and paid from tax-advantaged accounts",
      "Keep receipts and the year of each transaction",
      "Ask a qualified tax resource which expenses and limits apply"
    ],
    "evidence": [
      "Payment receipts",
      "Reimbursement records",
      "HSA or FSA statements"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize medical-expense tax questions. Prepare a record list for tax guidance without calculating an entitlement. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2707,
      "endLine": 2785,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "debt-statute-limitations-advisor",
    "title": "Review questions about older debt",
    "category": "advanced-financial",
    "purpose": "Prepare the dates and jurisdiction needed for qualified older-debt advice.",
    "intakeFields": [
      {
        "id": "debtOriginDate",
        "label": "Original Debt Date",
        "type": "date",
        "required": true,
        "description": "Date of original medical service or bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "lastPaymentDate",
        "label": "Last Payment Date",
        "type": "date",
        "required": false,
        "description": "Date of last payment made on debt",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "debtAmount",
        "label": "Debt Amount",
        "type": "number",
        "required": true,
        "placeholder": "Current amount of medical debt",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "collectionHistory",
        "label": "Collection History",
        "type": "textarea",
        "required": false,
        "placeholder": "History of collection attempts and communications",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "patientState",
        "label": "State of Residence",
        "type": "text",
        "required": true,
        "placeholder": "State where you live",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "originalProvider",
        "label": "Original Provider",
        "type": "text",
        "required": true,
        "placeholder": "Original healthcare provider",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Keep the original debt, last-payment, and collection notices separate",
      "Ask a qualified legal resource about the applicable period and effect of a payment or acknowledgment",
      "Address any lawsuit using its actual court instructions"
    ],
    "evidence": [
      "Debt and payment dates",
      "Collection or court notice",
      "Jurisdiction information"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review questions about older debt. Prepare the dates and jurisdiction needed for qualified older-debt advice. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2785,
      "endLine": 2863,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-old-debt",
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "prior-authorization-reversal-expert",
    "title": "Prepare a prior-authorization review",
    "category": "insurance-mastery",
    "purpose": "Ask the plan and treating team how to address the authorization decision.",
    "intakeFields": [
      {
        "id": "deniedTreatment",
        "label": "Denied Treatment",
        "type": "textarea",
        "required": true,
        "placeholder": "Specific treatment, procedure, or medication denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialReason",
        "label": "Denial Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Specific reason given for denial",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalCondition",
        "label": "Medical Condition",
        "type": "textarea",
        "required": true,
        "placeholder": "Underlying medical condition requiring treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSupport",
        "label": "Physician Documentation",
        "type": "textarea",
        "required": true,
        "placeholder": "Doctor support and medical necessity documentation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgency",
        "label": "Urgency Level",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening emergency",
          "Urgent medical need",
          "Progressive condition",
          "Quality of life issue",
          "Routine/elective"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "previousAppeals",
        "label": "Previous Appeals",
        "type": "textarea",
        "required": false,
        "placeholder": "Any previous appeal attempts and results",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the denial reason and authorization criterion",
      "Ask the clinician what documentation or urgent review is appropriate",
      "Confirm whether peer discussion and a formal appeal are separate processes"
    ],
    "evidence": [
      "Authorization request",
      "Denial",
      "Clinician support"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a prior-authorization review. Ask the plan and treating team how to address the authorization decision. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2863,
      "endLine": 2940,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-preauthorization",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "out-of-network-reimbursement-maximizer",
    "title": "Prepare an out-of-network claim question",
    "category": "insurance-mastery",
    "purpose": "Clarify benefits, billed amounts, and possible member reimbursement.",
    "intakeFields": [
      {
        "id": "careType",
        "label": "Type of Care",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Specialty Care",
          "Surgery",
          "Hospital Stay",
          "Diagnostic Tests",
          "Mental Health",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerName",
        "label": "Out-of-Network Provider",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "oonBillAmount",
        "label": "Out-of-Network Bill",
        "type": "number",
        "required": true,
        "placeholder": "Total out-of-network charges",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insurancePayment",
        "label": "Insurance Payment",
        "type": "number",
        "required": false,
        "placeholder": "Amount insurance paid",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "networkSearch",
        "label": "In-Network Search",
        "type": "textarea",
        "required": false,
        "placeholder": "Did you search for in-network providers? What were the results?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "medicalNecessity",
        "label": "Medical Necessity",
        "type": "textarea",
        "required": true,
        "placeholder": "Why was this specific out-of-network provider medically necessary?",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask which claim form and proof of payment the plan requires",
      "Distinguish insurer payment to a provider from reimbursement received by you",
      "Check network exceptions and balance-billing questions using actual plan facts"
    ],
    "evidence": [
      "Plan claim instructions",
      "Itemized bill",
      "Payment receipt and EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare an out-of-network claim question. Clarify benefits, billed amounts, and possible member reimbursement. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 2940,
      "endLine": 3017,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-cms-directory",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "claims-denial-psychology-decoder",
    "title": "Decode a denial's stated reason",
    "category": "insurance-mastery",
    "purpose": "Focus on the written reason and evidence instead of guessing an adjuster's motives.",
    "intakeFields": [
      {
        "id": "denialLetter",
        "label": "Denial Letter Details",
        "type": "textarea",
        "required": true,
        "placeholder": "Copy the exact denial letter or explanation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "adjusterInfo",
        "label": "Adjuster Information",
        "type": "text",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimAmount",
        "label": "Claim Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount of denied claim",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgencyFactors",
        "label": "Urgency Factors",
        "type": "textarea",
        "required": false,
        "placeholder": "Any time-sensitive or urgent factors",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "previousCommunications",
        "label": "Previous Communications",
        "type": "textarea",
        "required": false,
        "placeholder": "Previous calls, letters, or appeals with insurance",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Copy the reason and code from the decision",
      "Ask whether the issue is missing information, claim processing, or coverage",
      "Ask what evidence and formal route address that specific reason"
    ],
    "evidence": [
      "Denial notice",
      "Claim records",
      "Prior correspondence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Decode a denial's stated reason. Focus on the written reason and evidence instead of guessing an adjuster's motives. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3017,
      "endLine": 3094,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "insurance-policy-loophole-finder",
    "title": "Read the relevant plan provision",
    "category": "insurance-mastery",
    "purpose": "Locate the document and version that explain a coverage question.",
    "intakeFields": [
      {
        "id": "policyDocuments",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": false,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "deniedClaim",
        "label": "Denied Claim",
        "type": "textarea",
        "required": true,
        "placeholder": "Details of denied claim or coverage issue",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "policyLanguage",
        "label": "Relevant Policy Language",
        "type": "textarea",
        "required": false,
        "placeholder": "Copy any relevant policy language or exclusions",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Treatment Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Care",
          "Specialty Treatment",
          "Mental Health",
          "Preventive Care",
          "Diagnostic Tests",
          "Surgery",
          "Multiple Services"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "coverageQuestion",
        "label": "Coverage Question",
        "type": "textarea",
        "required": true,
        "placeholder": "What specific coverage question or dispute do you have?",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the plan document effective on the service date",
      "Read the cited exclusion, definition, and exception together",
      "Ask the administrator to explain conflicting provisions and the review process"
    ],
    "evidence": [
      "Plan document reference",
      "Denial provision",
      "Service-date evidence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Read the relevant plan provision. Locate the document and version that explain a coverage question. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3094,
      "endLine": 3169,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "understand"
  },
  {
    "id": "hipaa-violation-bill-challenger",
    "title": "Separate privacy and billing concerns",
    "category": "legal-pro",
    "purpose": "Record a privacy concern without assuming it cancels a medical debt.",
    "intakeFields": [
      {
        "id": "privacyExperiences",
        "label": "Privacy Experiences",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe any privacy or information sharing concerns",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billingSources",
        "label": "Billing Sources",
        "type": "textarea",
        "required": true,
        "placeholder": "List all providers, billing companies, and collection agencies involved",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "informationSharing",
        "label": "Information Sharing",
        "type": "textarea",
        "required": false,
        "placeholder": "Any sharing of your medical billing information you observed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "collectionActivities",
        "label": "Collection Activities",
        "type": "textarea",
        "required": false,
        "placeholder": "Any collection agency activities or communications",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "digitalSystems",
        "label": "Digital Systems Used",
        "type": "textarea",
        "required": false,
        "placeholder": "Patient portals, billing systems, or online tools used",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Describe the specific disclosure or access concern using only necessary detail",
      "Ask for the organization's privacy contact and complaint process",
      "Track the billing question separately and seek appropriate advice about the privacy issue"
    ],
    "evidence": [
      "Privacy correspondence",
      "Observed event record",
      "Separate billing notice"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Separate privacy and billing concerns. Record a privacy concern without assuming it cancels a medical debt. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3169,
      "endLine": 3244,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "medical-malpractice-bill-leverage",
    "title": "Separate care-quality and billing concerns",
    "category": "legal-pro",
    "purpose": "Prepare a factual care-quality concern while keeping billing review distinct.",
    "intakeFields": [
      {
        "id": "medicalComplications",
        "label": "Medical Complications",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe any complications, errors, or unexpected outcomes",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "careQualityConcerns",
        "label": "Care Quality Concerns",
        "type": "textarea",
        "required": true,
        "placeholder": "Any concerns about quality of care received",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "informedConsent",
        "label": "Informed Consent Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any issues with informed consent or explanation of risks",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "providerCommunication",
        "label": "Provider Communication",
        "type": "textarea",
        "required": false,
        "placeholder": "Communication issues or conflicts with providers",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "outcomeExpectations",
        "label": "Outcome vs Expectations",
        "type": "textarea",
        "required": false,
        "placeholder": "How did actual outcomes differ from what was expected?",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record what happened and references to the relevant care records",
      "Ask for the provider's patient-relations or complaint process",
      "Seek qualified clinical or legal advice instead of treating a poor outcome as proof of liability"
    ],
    "evidence": [
      "Care record references",
      "Complaint correspondence",
      "Separate bill"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "This task organizes questions; it does not calculate a legal deadline, tax benefit, or debt-release right."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Separate care-quality and billing concerns. Prepare a factual care-quality concern while keeping billing review distinct. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3244,
      "endLine": 3319,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-debt-legal-process"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "collections-agency-destroyer",
    "title": "Respond to a collector",
    "category": "legal-pro",
    "purpose": "Prepare a documented response after verifying the collector and the debt.",
    "intakeFields": [
      {
        "id": "collectionAgencies",
        "label": "Collection Agencies",
        "type": "textarea",
        "required": true,
        "placeholder": "List all collection agencies and debt collectors involved",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "collectionCommunications",
        "label": "Collection Communications",
        "type": "textarea",
        "required": true,
        "placeholder": "Letters, calls, and communications from collectors",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "debtValidationRequests",
        "label": "Debt Validation Requests",
        "type": "textarea",
        "required": false,
        "placeholder": "Any debt validation requests you have made",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "fdcpaViolations",
        "label": "Suspected collection issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any inappropriate collection practices you experienced",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "creditReportingIssues",
        "label": "Credit Reporting Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Issues with debt appearing on credit reports",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Review the validation notice and identify disputed facts",
      "Use the applicable dispute instructions and keep delivery evidence",
      "Track court notices separately and do not assume a dispute erases the debt"
    ],
    "evidence": [
      "Validation notice",
      "Bill and payment history",
      "Contact and delivery records"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Respond to a collector. Prepare a documented response after verifying the collector and the debt. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3319,
      "endLine": 3394,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-collection-contact",
      "cfpb-debt-validation"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "credit-report-medical-debt-remover",
    "title": "Check medical-debt credit reporting",
    "category": "legal-pro",
    "purpose": "Compare a reported account with the underlying debt and current reporting rules.",
    "intakeFields": [
      {
        "id": "creditReportDebts",
        "label": "Credit Report Medical Debts",
        "type": "textarea",
        "required": true,
        "placeholder": "List all medical debt appearing on credit reports",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "creditBureaus",
        "label": "Credit Bureaus Reporting",
        "type": "textarea",
        "required": true,
        "placeholder": "Which credit bureaus show the medical debt",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "debtAges",
        "label": "Debt Ages",
        "type": "textarea",
        "required": false,
        "placeholder": "How old are the medical debts on your credit",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "disputeHistory",
        "label": "Dispute History",
        "type": "textarea",
        "required": false,
        "placeholder": "Any previous credit disputes you have filed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "accuracyIssues",
        "label": "Accuracy Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any inaccuracies in how the debt is reported",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the relevant credit report and identify the disputed entry",
      "Check identity, balance, payment status, and dates against records",
      "Use the bureau or furnisher dispute process with evidence"
    ],
    "evidence": [
      "Credit-report entry",
      "Payment or settlement evidence",
      "Prior dispute response"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Check medical-debt credit reporting. Compare a reported account with the underlying debt and current reporting rules. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3394,
      "endLine": 3470,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "bureau-medical-reporting",
      "cfpb-medical-reporting-status"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "recurring-bill-audit-system",
    "title": "Review recurring treatment bills",
    "category": "automation",
    "purpose": "Build a repeatable comparison of sessions, claims, and payments.",
    "intakeFields": [
      {
        "id": "ongoingTreatment",
        "label": "Ongoing Treatment",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe your ongoing medical treatment and conditions",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "recurringProviders",
        "label": "Recurring Providers",
        "type": "textarea",
        "required": true,
        "placeholder": "List all providers you see regularly",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billingFrequency",
        "label": "Billing Frequency",
        "type": "select",
        "required": true,
        "options": [
          "Weekly",
          "Bi-weekly",
          "Monthly",
          "Quarterly",
          "Varies"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "assistancePrograms",
        "label": "Current Assistance Programs",
        "type": "textarea",
        "required": false,
        "placeholder": "Any current charity care or assistance programs",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "insuranceAuthorizations",
        "label": "Insurance Authorizations",
        "type": "textarea",
        "required": false,
        "placeholder": "Any ongoing prior authorizations or approvals",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Keep each biller and service period distinct",
      "Compare new statements with earlier versions and matching EOBs",
      "Track authorization or benefit-limit changes without assuming each repeat charge is wrong"
    ],
    "evidence": [
      "Recurring statements",
      "EOB versions",
      "Session and payment records"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review recurring treatment bills. Build a repeatable comparison of sessions, claims, and payments. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3470,
      "endLine": 3545,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "multi-bill-portfolio-manager",
    "title": "Organize multiple family bills",
    "category": "automation",
    "purpose": "Keep people, billers, and services separate while choosing next steps.",
    "intakeFields": [
      {
        "id": "familyMembers",
        "label": "Family Members",
        "type": "textarea",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "allProviders",
        "label": "All Healthcare Providers",
        "type": "textarea",
        "required": true,
        "placeholder": "List all hospitals, doctors, and providers for entire family",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "totalFamilyDebt",
        "label": "Total Family Medical Debt",
        "type": "number",
        "required": true,
        "placeholder": "Combined medical debt for entire family",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insurancePolicies",
        "label": "Insurance Policies",
        "type": "textarea",
        "required": true,
        "placeholder": "All insurance policies covering family members",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "priorityConcerns",
        "label": "Priority Concerns",
        "type": "textarea",
        "required": false,
        "placeholder": "Most urgent bills or family members needing immediate attention",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Create a separate scope for each person and biller",
      "Record which notice, payment, and coverage belongs to each scope",
      "Prioritize actual response notices and unresolved questions rather than combine balances automatically"
    ],
    "evidence": [
      "Separate bill groups",
      "Coverage references",
      "Contact and payment history"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Organize multiple family bills. Keep people, billers, and services separate while choosing next steps. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3545,
      "endLine": 3620,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "proactive-insurance-change-optimizer",
    "title": "Prepare for a plan comparison",
    "category": "automation",
    "purpose": "Compare coverage documents and expected needs without predicting eligibility or savings.",
    "intakeFields": [
      {
        "id": "currentInsurance",
        "label": "Current Insurance",
        "type": "textarea",
        "required": true,
        "placeholder": "Current insurance plan details and coverage",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "upcomingMedicalNeeds",
        "label": "Upcoming Medical Needs",
        "type": "textarea",
        "required": true,
        "placeholder": "Planned surgeries, treatments, or ongoing medical needs",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "availablePlans",
        "label": "Available Plan Options",
        "type": "textarea",
        "required": false,
        "placeholder": "Insurance plan options available to you",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "enrollmentDeadlines",
        "label": "Enrollment Deadlines",
        "type": "text",
        "required": false,
        "placeholder": "Open enrollment or special enrollment deadlines",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "costConcerns",
        "label": "Cost Concerns",
        "type": "textarea",
        "required": false,
        "placeholder": "Specific cost concerns or financial constraints",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Use the official current plan materials for each option",
      "Compare network, benefit limits, total costs, and needed services",
      "Verify enrollment dates and effective dates with the plan or enrollment authority"
    ],
    "evidence": [
      "Plan summaries",
      "Provider and medication needs kept locally",
      "Enrollment notices"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for a plan comparison. Compare coverage documents and expected needs without predicting eligibility or savings. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3620,
      "endLine": 3696,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-dol-claim-file"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "advanced-appeal-generator",
    "title": "Build the next appeal stage",
    "category": "appeal-system",
    "purpose": "Prepare a stage-specific packet from the decision already received.",
    "intakeFields": [
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "select",
        "required": true,
        "options": [
          "Anthem/Blue Cross Blue Shield",
          "UnitedHealthcare",
          "Aetna",
          "Cigna",
          "Humana",
          "Kaiser Permanente",
          "Medicaid",
          "Medicare Advantage",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialReason",
        "label": "Reason for Denial",
        "type": "select",
        "required": true,
        "options": [
          "Not medically necessary",
          "Experimental/investigational",
          "Prior authorization required",
          "Out-of-network provider",
          "Pre-existing condition",
          "Coverage exclusion",
          "Documentation insufficient",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Denied Treatment/Service",
        "type": "text",
        "required": true,
        "placeholder": "Surgery, medication, therapy, device, etc.",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimAmount",
        "label": "Claim Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total dollar amount of denied claim",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalCondition",
        "label": "Medical Condition",
        "type": "text",
        "required": true,
        "placeholder": "Primary diagnosis or condition being treated",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "priorAppeals",
        "label": "Previous Appeal Attempts",
        "type": "select",
        "required": true,
        "options": [
          "None - this is the first appeal",
          "Internal appeal denied",
          "External review denied",
          "Multiple appeals denied"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the current internal or external review stage",
      "Match evidence to the reason given in the latest denial",
      "Confirm the notice's filing channel, deadline, and urgent-review instructions"
    ],
    "evidence": [
      "Latest denial",
      "Earlier appeal and response",
      "Supporting evidence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Build the next appeal stage. Prepare a stage-specific packet from the decision already received. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3696,
      "endLine": 3775,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "company-specific-appeal-intel",
    "title": "Find your plan's appeal instructions",
    "category": "appeal-system",
    "purpose": "Locate official instructions for the particular product and administrator.",
    "intakeFields": [
      {
        "id": "targetInsurer",
        "label": "Insurance company",
        "type": "select",
        "required": true,
        "options": [
          "Anthem/Blue Cross Blue Shield",
          "UnitedHealthcare",
          "Aetna",
          "Cigna",
          "Humana",
          "Kaiser Permanente",
          "Molina Healthcare",
          "Centene Corporation",
          "WellCare",
          "Medicaid MCO",
          "Medicare Advantage Plan",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "denialType",
        "label": "Type of Denial",
        "type": "select",
        "required": true,
        "options": [
          "Medical necessity",
          "Prior authorization",
          "Experimental treatment",
          "Out-of-network",
          "Coverage exclusion",
          "Documentation",
          "Pharmacy benefit",
          "Mental health",
          "Emergency care"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "appealLevel",
        "label": "Current Appeal Level",
        "type": "select",
        "required": true,
        "options": [
          "Preparing first internal appeal",
          "Internal appeal was denied",
          "Preparing external review",
          "External review denied",
          "Considering state complaint"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "claimComplexity",
        "label": "Claim Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Simple/routine claim",
          "Moderate complexity",
          "High complexity/rare condition",
          "Experimental/cutting-edge treatment"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the product and plan funding rather than rely on the insurer brand alone",
      "Ask for the current procedure applicable to this denial",
      "Verify the address or portal and preserve submission evidence"
    ],
    "evidence": [
      "Plan-specific instructions",
      "Denial notice",
      "Prior appeal history"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Find your plan's appeal instructions. Locate official instructions for the particular product and administrator. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3775,
      "endLine": 3848,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "appeal"
  },
  {
    "id": "medical-necessity-builder",
    "title": "Prepare a clinician evidence request",
    "category": "denial-reversal",
    "purpose": "Ask the treating team for documentation that addresses the denial criterion.",
    "intakeFields": [
      {
        "id": "medicalCondition",
        "label": "Primary Medical Condition",
        "type": "text",
        "required": true,
        "placeholder": "Primary diagnosis (include ICD-10 if known)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deniedTreatment",
        "label": "Denied Treatment/Service",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment, medication, or service denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentUrgency",
        "label": "Treatment Urgency",
        "type": "select",
        "required": true,
        "options": [
          "Emergency/life-threatening",
          "Urgent (within 30 days)",
          "Semi-urgent (within 90 days)",
          "Elective but necessary"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "alternativesTried",
        "label": "Alternative Treatments Tried",
        "type": "textarea",
        "required": true,
        "placeholder": "List all treatments attempted and why they failed or were insufficient",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "patientSymptoms",
        "label": "Current Symptoms/Impact",
        "type": "textarea",
        "required": true,
        "placeholder": "How the condition affects daily life, work, and functioning",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSpecialty",
        "label": "Prescribing Physician Specialty",
        "type": "select",
        "required": true,
        "options": [
          "Primary Care",
          "Cardiology",
          "Oncology",
          "Neurology",
          "Orthopedics",
          "Surgery",
          "Psychiatry",
          "Endocrinology",
          "Other Specialty"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalRecords",
        "label": "Supporting Medical Records",
        "type": "textarea",
        "required": false,
        "placeholder": "Any test results, imaging reports, or medical documentation you have",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Obtain the criterion and the records the reviewer considered",
      "Ask the clinician to explain relevant history, alternatives, and the requested service",
      "Keep urgent-review decisions with the clinician and plan"
    ],
    "evidence": [
      "Denial criterion",
      "Relevant record references",
      "Clinician statement"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a clinician evidence request. Ask the treating team for documentation that addresses the denial criterion. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3848,
      "endLine": 3932,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "peer-to-peer-prep",
    "title": "Prepare for a clinician peer discussion",
    "category": "denial-reversal",
    "purpose": "Help the treating office organize a peer discussion without assuming it replaces an appeal.",
    "intakeFields": [
      {
        "id": "deniedService",
        "label": "Denied Service/Treatment",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment, medication, or procedure denied",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "yourDoctorSpecialty",
        "label": "Your Doctor's Specialty",
        "type": "select",
        "required": true,
        "options": [
          "Primary Care/Family Medicine",
          "Internal Medicine",
          "Cardiology",
          "Oncology",
          "Neurology",
          "Orthopedic Surgery",
          "General Surgery",
          "Psychiatry",
          "Endocrinology",
          "Pulmonology",
          "Gastroenterology",
          "Dermatology",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalDirectorInfo",
        "label": "Insurance Medical Director Info",
        "type": "text",
        "required": false,
        "placeholder": "Name or specialty of insurance medical director (if known)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "denialJustification",
        "label": "Insurance Denial Reason",
        "type": "textarea",
        "required": true,
        "placeholder": "Exact reason given by insurance for the denial",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "clinicalEvidence",
        "label": "Available Clinical Evidence",
        "type": "textarea",
        "required": true,
        "placeholder": "Test results, imaging, labs, symptoms, and medical history supporting the need",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "callTimeline",
        "label": "Peer-to-Peer Call Timeline",
        "type": "select",
        "required": true,
        "options": [
          "Call scheduled within 24 hours",
          "Call scheduled within 1 week",
          "Call scheduled within 2 weeks",
          "No call scheduled yet"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Confirm who can request and participate in the discussion",
      "Give the treating team the denial reason and relevant records",
      "Ask whether a formal appeal must be filed separately and preserve its deadline"
    ],
    "evidence": [
      "Peer-discussion instructions",
      "Denial",
      "Clinician evidence references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for a clinician peer discussion. Help the treating office organize a peer discussion without assuming it replaces an appeal. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 3932,
      "endLine": 4010,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-preauthorization",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "iro-master",
    "title": "Prepare for external review",
    "category": "denial-reversal",
    "purpose": "Identify whether the denial has an available independent review route.",
    "intakeFields": [
      {
        "id": "patientState",
        "label": "Patient State",
        "type": "select",
        "required": true,
        "options": [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "deniedTreatment",
        "label": "Denied Treatment/Service",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment or service denied by insurance",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentSpecialty",
        "label": "Medical Specialty Area",
        "type": "select",
        "required": true,
        "options": [
          "Cardiology",
          "Oncology",
          "Neurology",
          "Orthopedics",
          "Surgery",
          "Mental Health",
          "Pharmacy/Medications",
          "Transplant",
          "Rare Disease",
          "Emergency Medicine",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "internalAppealResult",
        "label": "Internal Appeal Result",
        "type": "textarea",
        "required": true,
        "placeholder": "Summary of internal appeal denial and insurance company reasoning",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "clinicalComplexity",
        "label": "Clinical Case Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Standard case with clear guidelines",
          "Complex case requiring specialist review",
          "Rare condition with limited guidance",
          "Cutting-edge/experimental treatment",
          "Multi-system or comorbid conditions"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "urgencyLevel",
        "label": "Medical Urgency",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening emergency",
          "Urgent - significant health risk",
          "Semi-urgent - affects quality of life",
          "Non-urgent but medically necessary"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Read the final denial and confirm plan type and jurisdiction",
      "Ask about eligibility, exhaustion, and urgent-review conditions",
      "Prepare the required packet and proof of submission using the actual notice"
    ],
    "evidence": [
      "Final denial",
      "Internal appeal history",
      "Plan-specific external-review instructions"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare for external review. Identify whether the denial has an available independent review route. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4010,
      "endLine": 4089,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-external-review",
      "insurance-wa-jurisdiction"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "state-commissioner-complaint",
    "title": "Prepare a regulator inquiry",
    "category": "denial-reversal",
    "purpose": "Find the right oversight route and document a specific unresolved problem.",
    "intakeFields": [
      {
        "id": "patientState",
        "label": "Your State",
        "type": "select",
        "required": true,
        "options": [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceCompany",
        "label": "Insurance Company",
        "type": "text",
        "required": true,
        "placeholder": "Full legal name of insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "violationType",
        "label": "Issue to review",
        "type": "select",
        "required": true,
        "options": [
          "Coverage denial to review",
          "Concern about claim handling",
          "Failure to investigate properly",
          "Unreasonable delay in processing",
          "Concern about payment timing",
          "Discriminatory coverage practices",
          "Failure to provide required notices",
          "Other issue to review"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "appealHistory",
        "label": "Appeal History",
        "type": "textarea",
        "required": true,
        "placeholder": "Complete timeline of internal appeals, external reviews, and all communication with insurance company",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "financialHarm",
        "label": "Financial Impact",
        "type": "number",
        "required": true,
        "placeholder": "Total financial harm from denial (medical costs, lost income, additional expenses)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "complianceViolations",
        "label": "Specific concerns to review",
        "type": "textarea",
        "required": true,
        "placeholder": "List specific ways the insurance company violated state regulations or your policy terms",
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Confirm plan funding and the authority responsible for this product",
      "Describe the decision, attempted resolution, and requested help factually",
      "Preserve formal appeal deadlines while seeking regulator help"
    ],
    "evidence": [
      "Plan type evidence",
      "Notice and contact chronology",
      "Supporting documents"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a regulator inquiry. Find the right oversight route and document a specific unresolved problem. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4089,
      "endLine": 4171,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-cms-government"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "prior-auth-bypass",
    "title": "Explore prior-authorization options",
    "category": "coverage-expansion",
    "purpose": "Ask about legitimate urgent review, exceptions, and missing-information routes.",
    "intakeFields": [
      {
        "id": "treatmentRequiringPA",
        "label": "Treatment Requiring Prior Auth",
        "type": "text",
        "required": true,
        "placeholder": "Specific treatment, medication, or procedure requiring PA",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalUrgency",
        "label": "Medical Urgency Level",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening emergency",
          "Urgent - risk of serious deterioration",
          "Semi-urgent - significant symptom progression",
          "Routine but medically necessary",
          "Preventive/maintenance therapy"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentHistory",
        "label": "Previous Treatment History",
        "type": "textarea",
        "required": true,
        "placeholder": "Previous treatments for this condition, including any that were effective",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "paTimelineIssue",
        "label": "PA Timeline Issues",
        "type": "select",
        "required": true,
        "options": [
          "PA requested but no response within required timeframe",
          "PA denied and appeal timeline would delay necessary care",
          "PA required but treating provider not in network",
          "PA process would delay emergency/urgent treatment",
          "No current authorization issue; asking about the process"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "providerSpecialty",
        "label": "Treating Provider Type",
        "type": "select",
        "required": true,
        "options": [
          "Primary Care Physician",
          "Emergency Room",
          "Specialist (in-network)",
          "Specialist (out-of-network)",
          "Hospital/Inpatient",
          "Surgery Center",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceType",
        "label": "Insurance Type",
        "type": "select",
        "required": true,
        "options": [
          "Commercial/Private Insurance",
          "Medicare Advantage",
          "Medicaid/Medicare",
          "State Health Plan",
          "Federal Employee Plan",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the actual authorization requirement and current request status",
      "Ask the treating clinician whether an urgent pathway is appropriate",
      "Get written instructions for any exception and continue tracking formal appeal requirements"
    ],
    "evidence": [
      "Authorization policy",
      "Request and response",
      "Clinician urgency evidence"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Explore prior-authorization options. Ask about legitimate urgent review, exceptions, and missing-information routes. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4171,
      "endLine": 4251,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "healthcare-preauthorization",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "appeal"
  },
  {
    "id": "experimental-treatment-coverage",
    "title": "Review an experimental-treatment denial",
    "category": "coverage-expansion",
    "purpose": "Prepare a plan-specific evidence request for the treating team.",
    "intakeFields": [
      {
        "id": "medicalCondition",
        "label": "Medical Condition/Diagnosis",
        "type": "text",
        "required": true,
        "placeholder": "Specific diagnosis requiring experimental treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "experimentalTreatment",
        "label": "Experimental Treatment",
        "type": "text",
        "required": true,
        "placeholder": "Specific experimental treatment, drug, device, or procedure",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentStatus",
        "label": "Treatment Development Status",
        "type": "select",
        "required": true,
        "options": [
          "FDA clinical trial phase I/II",
          "FDA clinical trial phase III",
          "FDA breakthrough designation",
          "FDA fast track designation",
          "Compassionate use program",
          "Off-label use of approved treatment",
          "International treatment not US-approved",
          "Investigational device or procedure"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "standardTreatmentHistory",
        "label": "Standard Treatment History",
        "type": "textarea",
        "required": true,
        "placeholder": "All standard treatments tried and why they failed or are no longer effective",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "clinicalEvidence",
        "label": "Available Clinical Evidence",
        "type": "textarea",
        "required": true,
        "placeholder": "Clinical trial data, research studies, case reports supporting the experimental treatment",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentUrgency",
        "label": "Treatment Timeline",
        "type": "select",
        "required": true,
        "options": [
          "Life-threatening - need immediate access",
          "Progressive condition - need within 30 days",
          "Condition worsening - need within 90 days",
          "Preventive - elective timing"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physicianSupport",
        "label": "Physician Advocacy",
        "type": "select",
        "required": true,
        "options": [
          "Treating physician strongly supports",
          "Specialist recommends treatment",
          "Multiple physicians support",
          "Physician neutral/uncertain",
          "Limited physician support"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Get the policy definition and stated reason for the experimental classification",
      "Ask the clinician which evidence and coverage criteria address that reason",
      "Separate regulatory treatment access from insurance payment and confirm the appeal route"
    ],
    "evidence": [
      "Coverage policy",
      "Denial",
      "Clinician and study references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review an experimental-treatment denial. Prepare a plan-specific evidence request for the treating team. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4251,
      "endLine": 4333,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "appeal"
  },
  {
    "id": "out-of-network-exception",
    "title": "Request a network exception review",
    "category": "coverage-expansion",
    "purpose": "Document access barriers and ask whether the plan offers an exception.",
    "intakeFields": [
      {
        "id": "neededSpecialty",
        "label": "Required Medical Specialty",
        "type": "text",
        "required": true,
        "placeholder": "Specific medical specialty or type of provider needed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "oonProviderName",
        "label": "Out-of-Network Provider",
        "type": "text",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "networkLimitations",
        "label": "In-Network Provider Limitations",
        "type": "select",
        "required": true,
        "options": [
          "No in-network providers with required specialty",
          "In-network providers have long wait times (over 30 days)",
          "Geographic barriers - nearest in-network provider too far",
          "In-network providers lack required expertise/credentials",
          "Continuity of care - established relationship with OON provider",
          "Medical complexity requires specific provider expertise"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "treatmentType",
        "label": "Type of Treatment/Service",
        "type": "select",
        "required": true,
        "options": [
          "Surgery requiring specialized expertise",
          "Rare disease treatment",
          "Complex diagnostic evaluation",
          "Specialized therapy/rehabilitation",
          "Second opinion consultation",
          "Ongoing specialized care management",
          "Emergency/urgent specialist care"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "geographicBarriers",
        "label": "Geographic Access Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Distance to nearest in-network provider and travel barriers (if applicable)",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "medicalComplexity",
        "label": "Medical Complexity/Urgency",
        "type": "textarea",
        "required": true,
        "placeholder": "Why this specific provider is medically necessary and in-network providers are inadequate",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "priorRelationship",
        "label": "Prior Provider Relationship",
        "type": "select",
        "required": true,
        "options": [
          "Long-term established patient relationship",
          "Provider familiar with complex medical history",
          "Previous successful treatment by this provider",
          "Referred by current treating physician",
          "No prior relationship"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Keep records of in-network searches and responses",
      "Ask what evidence the plan requires for an exception or continuity request",
      "Obtain written approval and its payment terms before assuming out-of-network care is covered"
    ],
    "evidence": [
      "Network search record",
      "Plan exception instructions",
      "Clinician support"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Request a network exception review. Document access barriers and ask whether the plan offers an exception. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4333,
      "endLine": 4416,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-cms-directory",
      "cms-no-surprises"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "retroactive-coverage-activator",
    "title": "Investigate a coverage-date problem",
    "category": "coverage-expansion",
    "purpose": "Separate enrollment correction from a request for retroactive coverage.",
    "intakeFields": [
      {
        "id": "retroactiveTimeframe",
        "label": "Retroactive Coverage Period",
        "type": "select",
        "required": true,
        "options": [
          "Last 30 days",
          "31-90 days ago",
          "91-180 days ago",
          "6 months to 1 year ago",
          "More than 1 year ago"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "coverageGapReason",
        "label": "Why Coverage Wasn't Active",
        "type": "select",
        "required": true,
        "options": [
          "Insurance company processing error",
          "Employer enrollment mistake",
          "Incorrect effective date calculation",
          "Missed qualifying event enrollment",
          "Eligibility determination error",
          "Premium payment processing issue",
          "Administrative system error",
          "Other coverage gap reason"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalExpenses",
        "label": "Medical Expenses During Gap",
        "type": "number",
        "required": true,
        "placeholder": "Total medical expenses incurred during coverage gap period",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "insuranceType",
        "label": "Type of Insurance",
        "type": "select",
        "required": true,
        "options": [
          "Employer-sponsored health plan",
          "Individual/family plan from exchange",
          "Medicaid",
          "Medicare",
          "Medicare Advantage",
          "Short-term medical",
          "COBRA continuation",
          "Other"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "enrollmentIssues",
        "label": "Enrollment Issues",
        "type": "textarea",
        "required": true,
        "placeholder": "Detailed description of what went wrong with enrollment or coverage activation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "supportingDocumentation",
        "label": "Available Documentation",
        "type": "textarea",
        "required": false,
        "placeholder": "Any paperwork, emails, or records that support your case for retroactive coverage",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Collect enrollment, premium, and effective-date notices",
      "Ask the responsible plan or program to explain the gap and available correction process",
      "Keep service dates and appeal or enrollment notices distinct"
    ],
    "evidence": [
      "Enrollment records",
      "Premium evidence",
      "Coverage and denial notices"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Investigate a coverage-date problem. Separate enrollment correction from a request for retroactive coverage. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4416,
      "endLine": 4498,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-wa-jurisdiction",
      "insurance-dol-claim-file"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "plan"
  },
  {
    "id": "charge-master-decoder",
    "title": "Compare hospital price information",
    "category": "hospital-insider",
    "purpose": "Use public price information as a question source rather than a guaranteed patient price.",
    "intakeFields": [
      {
        "id": "billFile",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": true,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "hospitalSystem",
        "label": "Hospital System",
        "type": "text",
        "required": true,
        "placeholder": "Name of hospital or health system",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceType",
        "label": "Primary Service Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Room",
          "Inpatient Surgery",
          "Outpatient Surgery",
          "Diagnostic Testing",
          "Laboratory Services",
          "Imaging/Radiology",
          "Specialist Consultation",
          "Cardiac Procedures",
          "Cancer Treatment",
          "Maternity Care"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount of hospital bill",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "For-profit hospital",
          "Non-profit hospital",
          "Academic medical center",
          "Specialty hospital",
          "Critical access hospital",
          "Government hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "suspiciousCharges",
        "label": "Most Suspicious Charges",
        "type": "textarea",
        "required": false,
        "placeholder": "Line items that seem extremely high or questionable",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Match the service, setting, and billing entity before comparing",
      "Distinguish gross, cash, negotiated, and patient-responsibility amounts",
      "Ask the hospital how the relevant published information relates to this bill"
    ],
    "evidence": [
      "Published price reference",
      "Itemized bill",
      "Plan estimate or EOB"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Compare hospital price information. Use public price information as a question source rather than a guaranteed patient price. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4498,
      "endLine": 4578,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-hospital-price-consumers",
      "cms-price-faq"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "check"
  },
  {
    "id": "revenue-cycle-exploiter",
    "title": "Plan the next billing follow-up",
    "category": "hospital-insider",
    "purpose": "Track a bill's actual status and follow up on unresolved requests.",
    "intakeFields": [
      {
        "id": "hospitalName",
        "label": "Hospital/Health System",
        "type": "text",
        "required": true,
        "placeholder": "Full name of hospital or health system",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount owed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "accountAge",
        "label": "Bill Age",
        "type": "select",
        "required": true,
        "options": [
          "0-30 days old",
          "31-60 days old",
          "61-90 days old",
          "91-120 days old",
          "Over 120 days old"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "collectionStatus",
        "label": "Collection Status",
        "type": "select",
        "required": true,
        "options": [
          "Not yet in collections",
          "Internal collections",
          "External collection agency",
          "Legal action threatened",
          "Lawsuit filed"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hospitalType",
        "label": "Hospital Ownership",
        "type": "select",
        "required": true,
        "options": [
          "Large for-profit chain (HCA, Tenet, etc.)",
          "Non-profit health system",
          "Academic medical center",
          "Community hospital",
          "Specialty hospital",
          "Government/public hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "paymentHistory",
        "label": "Payment History",
        "type": "select",
        "required": true,
        "options": [
          "No payments made",
          "Partial payments made",
          "Payment plan established",
          "Payment plan defaulted",
          "Settlement offer rejected"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billComplexity",
        "label": "Bill Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Single service/procedure",
          "Multiple services same day",
          "Multi-day admission",
          "Emergency + admission",
          "Multiple departments involved",
          "Insurance complications"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Ask who currently owns or services the account",
      "Record the status of correction, assistance, and payment discussions",
      "Ask for any hold or agreement in writing without assuming a standard collection timeline"
    ],
    "evidence": [
      "Current account notice",
      "Contact log",
      "Written agreements"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Plan the next billing follow-up. Track a bill's actual status and follow up on unresolved requests. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4578,
      "endLine": 4661,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cfpb-collection-contact",
      "cfpb-debt-validation"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "physician-champion-recruiter",
    "title": "Ask the treating team for support",
    "category": "hospital-insider",
    "purpose": "Request factual documentation or referral help from the treating office.",
    "intakeFields": [
      {
        "id": "treatingPhysicians",
        "label": "Treating Physicians",
        "type": "textarea",
        "required": false,
        "originalRequired": true,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      },
      {
        "id": "hospitalAffiliation",
        "label": "Physician-Hospital Relationship",
        "type": "select",
        "required": true,
        "options": [
          "Hospital employed physicians",
          "Independent physicians with privileges",
          "Mix of employed and independent",
          "Unknown physician employment status"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "careComplications",
        "label": "Care Complications/Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any complications, delays, errors, or quality issues during your care",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "treatmentOutcome",
        "label": "Treatment Outcome",
        "type": "select",
        "required": true,
        "options": [
          "Excellent outcome, fully satisfied",
          "Good outcome with minor concerns",
          "Mixed outcome with complications",
          "Poor outcome, significant problems",
          "Ongoing treatment, outcome unknown"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "physiciansaweness",
        "label": "Physician Awareness of Bill",
        "type": "select",
        "required": true,
        "options": [
          "Physicians aware of high bill amount",
          "Physicians probably not aware of charges",
          "Some physicians aware, others not",
          "Unknown if physicians know about bill"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "alternativeTreatments",
        "label": "Alternative Treatments",
        "type": "textarea",
        "required": false,
        "placeholder": "Were there less expensive treatment options that could have been effective?",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "relationshipQuality",
        "label": "Patient-Physician Relationship",
        "type": "select",
        "required": true,
        "options": [
          "Excellent relationship, very supportive",
          "Good relationship, generally positive",
          "Professional but distant",
          "Some concerns or issues",
          "Poor relationship or conflicts"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Identify the exact billing or coverage question the office can address",
      "Ask for relevant documentation or the appropriate billing contact",
      "Keep clinical recommendations separate from any promised bill reduction"
    ],
    "evidence": [
      "Decision or bill question",
      "Treating-office response",
      "Record references"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Ask the treating team for support. Request factual documentation or referral help from the treating office. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4661,
      "endLine": 4744,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "insurance-dol-claim-file",
      "healthcare-appeals"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "hospital-board-pressure",
    "title": "Prepare a formal hospital escalation",
    "category": "hospital-insider",
    "purpose": "Use the hospital's published complaint and assistance process for an unresolved issue.",
    "intakeFields": [
      {
        "id": "hospitalSystem",
        "label": "Hospital System",
        "type": "text",
        "required": true,
        "placeholder": "Full name of hospital or health system",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "hospitalOwnership",
        "label": "Hospital Ownership Type",
        "type": "select",
        "required": true,
        "options": [
          "Non-profit hospital",
          "For-profit hospital chain",
          "Academic medical center",
          "Government/public hospital",
          "Religious/faith-based hospital",
          "Community hospital"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billAmount",
        "label": "Total Bill Amount",
        "type": "number",
        "required": true,
        "placeholder": "Total amount for executive escalation",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "incomeLevel",
        "label": "Patient Income Level",
        "type": "select",
        "required": true,
        "options": [
          "Below federal poverty level",
          "100-200% of poverty level",
          "200-400% of poverty level",
          "Middle income (400-600% poverty)",
          "Upper middle income",
          "High income"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "communityStanding",
        "label": "Community context (optional)",
        "type": "select",
        "required": true,
        "options": [
          "Prefer not to record",
          "Local resident",
          "Other relevant context"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "mediaValue",
        "label": "Privacy preference",
        "type": "select",
        "required": true,
        "options": [
          "Keep details private",
          "Ask before sharing any details",
          "Not decided"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "qualityConcerns",
        "label": "Quality of Care Issues",
        "type": "textarea",
        "required": false,
        "placeholder": "Any care quality issues, errors, or complications that strengthen your case",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "executiveConnections",
        "label": "Known escalation contact (optional)",
        "type": "textarea",
        "required": false,
        "originalRequired": false,
        "privacy": "local-only",
        "description": "Optional private reference. Omit names and identifiers when they are not needed."
      }
    ],
    "prepare": [
      "Summarize the request, evidence, and responses already received",
      "Find the appropriate patient-relations or formal grievance contact",
      "State a concrete requested resolution and keep private details limited"
    ],
    "evidence": [
      "Escalation chronology",
      "Policy or bill reference",
      "Written responses"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Prepare a formal hospital escalation. Use the hospital's published complaint and assistance process for an unresolved issue. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4744,
      "endLine": 4830,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "insurance-cms-eob"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "plan"
  },
  {
    "id": "upcoding-detector",
    "title": "Question a billed service level",
    "category": "coding-intelligence",
    "purpose": "Ask whether documentation supports a code without declaring upcoding from price or memory alone.",
    "intakeFields": [
      {
        "id": "billFile",
        "label": "Local evidence reference",
        "type": "file",
        "required": false,
        "description": "Record where you keep this document. No file is uploaded or stored by this questionnaire.",
        "originalRequired": false,
        "privacy": "local-only",
        "inputMode": "reference"
      },
      {
        "id": "cptCodes",
        "label": "CPT Procedure Codes",
        "type": "textarea",
        "required": true,
        "placeholder": "List all CPT codes from your bill (e.g., 99285, 36415, 85025)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "icdCodes",
        "label": "ICD-10 Diagnosis Codes",
        "type": "textarea",
        "required": true,
        "placeholder": "List all ICD-10 diagnosis codes from your bill (e.g., R50.9, K59.00)",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDescription",
        "label": "Services Received",
        "type": "textarea",
        "required": true,
        "placeholder": "Describe the actual medical services, procedures, and treatments you received",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalRecords",
        "label": "Medical Record Details",
        "type": "textarea",
        "required": false,
        "placeholder": "Any details from medical records about complexity, time spent, procedures performed",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "facilityType",
        "label": "Facility Type",
        "type": "select",
        "required": true,
        "options": [
          "Emergency Department",
          "Inpatient Hospital",
          "Outpatient Surgery Center",
          "Physician Office",
          "Urgent Care",
          "Specialty Clinic",
          "Diagnostic Center"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "complexity",
        "label": "Perceived Complexity",
        "type": "select",
        "required": true,
        "options": [
          "Very simple visit/procedure",
          "Routine complexity",
          "Moderately complex",
          "High complexity",
          "Extremely complex/critical"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Record the exact code, modifier, and units",
      "Ask the coding team which documented factors support the billed level",
      "Request a written review and compare any corrected bill and EOB"
    ],
    "evidence": [
      "Itemized codes",
      "Relevant record references",
      "Review response"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Question a billed service level. Ask whether documentation supports a code without declaring upcoding from price or memory alone. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4830,
      "endLine": 4913,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "bundling-error-detector",
    "title": "Question separate procedure charges",
    "category": "coding-intelligence",
    "purpose": "Ask whether separate line items are appropriate for the service and payer.",
    "intakeFields": [
      {
        "id": "procedureCodes",
        "label": "All Procedure Codes (CPT)",
        "type": "textarea",
        "required": true,
        "placeholder": "List all CPT procedure codes from your bill, including surgeries, diagnostics, lab tests",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "serviceDate",
        "label": "Service Date",
        "type": "date",
        "required": true,
        "description": "Date when procedures were performed",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "procedureType",
        "label": "Primary Procedure Type",
        "type": "select",
        "required": true,
        "options": [
          "Surgery (inpatient)",
          "Surgery (outpatient)",
          "Diagnostic procedures",
          "Laboratory testing",
          "Imaging/radiology",
          "Emergency procedures",
          "Cardiovascular procedures",
          "Endoscopic procedures"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "surgeonInvolved",
        "label": "Surgeon/Physician Details",
        "type": "textarea",
        "required": false,
        "placeholder": "Names of surgeons, assistants, and other physicians involved",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "anesthesiaServices",
        "label": "Anesthesia Services",
        "type": "select",
        "required": true,
        "options": [
          "General anesthesia",
          "Regional/spinal anesthesia",
          "Local anesthesia only",
          "Conscious sedation",
          "No anesthesia",
          "Multiple anesthesia types"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "billedSeparately",
        "label": "Suspiciously Separate Charges",
        "type": "textarea",
        "required": false,
        "placeholder": "Services that seem related but were billed as separate line items",
        "originalRequired": false,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "List the suspected overlap with dates and modifiers",
      "Ask whether a separate component, repeat service, or applicable coding rule explains it",
      "Request qualified review before treating the charges as an error"
    ],
    "evidence": [
      "All relevant line items",
      "Procedure record references",
      "EOB adjustments"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them.",
      "Sources support general preparation only. Specialized coding, clinical, program, tax, privacy, or jurisdiction-specific conclusions need additional review.",
      "Repeated codes, high prices, a short visit, or separate bills do not by themselves prove an error or misconduct."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Question separate procedure charges. Ask whether separate line items are appropriate for the service and payer. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4913,
      "endLine": 4995,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "cms-read-medical-bill",
      "knowledge-cms-repeat-services"
    ],
    "reviewStatus": "needs_source_review",
    "sourceCoverage": "general-process-only",
    "summaryGoal": "check"
  },
  {
    "id": "charity-care-optimizer",
    "title": "Review financial-assistance eligibility questions",
    "category": "hardship-mastery",
    "purpose": "Prepare an accurate policy-specific application and follow-up.",
    "intakeFields": [
      {
        "id": "hospitalName",
        "label": "Hospital Name",
        "type": "text",
        "required": true,
        "placeholder": "Name of hospital with charity care program",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "grossIncome",
        "label": "Annual Gross Income",
        "type": "number",
        "required": true,
        "placeholder": "Total household income before taxes",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "householdSize",
        "label": "Household Size",
        "type": "number",
        "required": true,
        "placeholder": "Number of people in your household",
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "incomeType",
        "label": "Income Sources",
        "type": "select",
        "required": true,
        "options": [
          "Regular employment salary",
          "Variable/seasonal income",
          "Self-employment/business",
          "Retirement/social security",
          "Disability benefits",
          "Mixed income sources",
          "Unemployed/no income"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "medicalExpenses",
        "label": "Annual Medical Expenses",
        "type": "number",
        "required": false,
        "placeholder": "Annual out-of-pocket medical expenses",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "assets",
        "label": "Asset Situation",
        "type": "select",
        "required": true,
        "options": [
          "Minimal assets (under $10K)",
          "Moderate assets ($10K-$50K)",
          "Significant assets ($50K-$200K)",
          "Substantial assets (over $200K)",
          "Homeowner with equity",
          "Retirement accounts only"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      },
      {
        "id": "financialHardships",
        "label": "Financial Hardships",
        "type": "textarea",
        "required": false,
        "placeholder": "Recent job loss, medical emergencies, family situations affecting finances",
        "originalRequired": false,
        "privacy": "local-only"
      },
      {
        "id": "priorApplications",
        "label": "Prior Charity Care Applications",
        "type": "select",
        "required": true,
        "options": [
          "Never applied",
          "Applied and approved",
          "Applied and denied",
          "Applied with partial approval",
          "Application pending"
        ],
        "originalRequired": true,
        "privacy": "local-only"
      }
    ],
    "prepare": [
      "Read the current policy's household, income, asset, and care definitions",
      "Ask how variable income or changed circumstances are documented",
      "Track missing-document requests, partial decisions, and any available review"
    ],
    "evidence": [
      "Current policy and application",
      "Requested financial records",
      "Decision and receipt"
    ],
    "limitations": [
      "Your answers stay in this local preparation. They are not automatically added to AI requests, submitted, or used to decide eligibility.",
      "Verify the current plan, provider policy, and actual notice deadlines; a request or phone call does not automatically pause them."
    ],
    "conversationStarter": "Help me prepare the next step for this task: Review financial-assistance eligibility questions. Prepare an accurate policy-specific application and follow-up. Ask me for only the minimum non-identifying facts needed, and distinguish missing evidence from conclusions.",
    "original": {
      "path": "shared/bill-ai-workflows.ts",
      "startLine": 4995,
      "endLine": 5079,
      "commit": "bcbcc45cb0da571b9c81189fa8801e7bf85581da"
    },
    "sourceIds": [
      "irs-financial-assistance",
      "irs-fap-provider-list"
    ],
    "reviewStatus": "reviewed",
    "sourceCoverage": "stated-process",
    "summaryGoal": "afford"
  }
]);

for (const taskCatalogRecord of selfAdvocacyTasks) taskCatalogFreeze(taskCatalogRecord);
for (const taskCatalogCategory of TASK_CATEGORIES) taskCatalogFreeze(taskCatalogCategory);
