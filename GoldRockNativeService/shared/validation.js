/** Public analysis boundary. Unknown fields are rejected rather than silently discarded. */
export const FACT_ENUMS = Object.freeze({
  documentType: ['bill', 'eob', 'denial', 'estimate', 'unknown'],
  goal: ['understand', 'check', 'afford', 'appeal', 'plan'],
  coverage: ['private', 'medicare', 'medicaid', 'uninsured', 'self_pay', 'unknown'],
  careSetting: ['emergency', 'in_network_facility', 'out_of_network_facility', 'air_ambulance', 'ground_ambulance', 'other', 'unknown'],
  claimStatus: ['pending', 'processed', 'denied', 'unknown'],
  denialReason: ['administrative', 'coverage', 'medical_necessity', 'unknown'],
});
export const MONEY_FIELDS = Object.freeze(['billedCents', 'adjustmentCents', 'insurancePaidCents', 'paidCents', 'balanceCents', 'estimateCents', 'eobResponsibilityCents']);
export const FACT_KEYS = Object.freeze([...Object.keys(FACT_ENUMS), 'state', ...MONEY_FIELDS, 'hasItemization', 'hasEstimate', 'daysSinceInitialBill', 'daysSinceDenialReceived', 'lines']);
const STATES = new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI'.split(' '));
export class DomainError extends Error {
  constructor(details) { super('Review the approved facts. One or more fields are invalid.'); this.name = 'DomainError'; this.code = 'INVALID_FACTS'; this.details = details; }
}
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
// Medical codes are not a channel for names, diagnoses in prose, or document text.
// CPT I, CPT II/III, HCPCS and dotted/undotted ICD-10 forms; syntax does not establish coding validity.
export function isMedicalCode(code) { return typeof code === 'string' && /^(?:[0-9]{4,5}|[0-9]{4}[FTU]|[A-Z][0-9]{4}|[A-Z][0-9][0-9A-Z](?:\.[0-9A-Z]{1,3}|[0-9A-Z]{1,4}))$/.test(code); }
export function validateFacts(input) {
  if (!plain(input)) throw new DomainError([{ field: 'facts', reason: 'Expected a JSON object.' }]);
  const issues = [], output = {};
  const issue = (field, reason) => issues.push({ field, reason });
  // Never echo unknown field names: a malicious property name can itself contain PHI.
  if (Object.keys(input).some(key => !FACT_KEYS.includes(key))) issue('facts', 'Unapproved fields are not accepted.');
  for (const field of ['documentType', 'goal', 'coverage']) if (!Object.hasOwn(input, field)) issue(field, 'Choose an option, including unknown when available.');
  for (const [field, choices] of Object.entries(FACT_ENUMS)) if (Object.hasOwn(input, field)) {
    if (!choices.includes(input[field])) issue(field, 'Choose one of the supported options.'); else output[field] = input[field];
  }
  if (Object.hasOwn(input, 'state')) { if (input.state !== 'unknown' && !STATES.has(input.state)) issue('state', 'Use a supported two-letter state/territory code or unknown.'); else output.state = input.state; }
  for (const field of [...MONEY_FIELDS, 'daysSinceInitialBill', 'daysSinceDenialReceived']) if (Object.hasOwn(input, field)) {
    const value = input[field], max = MONEY_FIELDS.includes(field) ? 1_000_000_000 : 36_500;
    if (value !== null && (!Number.isSafeInteger(value) || value < 0 || value > max)) issue(field, 'Use a nonnegative whole number within the supported range, or null.'); else output[field] = value;
  }
  for (const field of ['hasItemization', 'hasEstimate']) if (Object.hasOwn(input, field)) { if (typeof input[field] !== 'boolean') issue(field, 'Use true or false.'); else output[field] = input[field]; }
  if (Object.hasOwn(input, 'lines')) {
    if (!Array.isArray(input.lines) || input.lines.length > 100) issue('lines', 'Use at most 100 line items.');
    else {
      const ids = new Set();
      output.lines = input.lines.map((line, index) => {
        const field = `lines[${index}]`;
        if (!plain(line)) { issue(field, 'Expected a line item object.'); return {}; }
        if (Object.keys(line).some(key => !['id', 'code', 'amountCents', 'units'].includes(key))) issue(field, 'Unapproved line fields are not accepted.');
        if (typeof line.id !== 'string' || !/^line-[1-9][0-9]{0,3}$/.test(line.id) || ids.has(line.id)) issue(`${field}.id`, 'Use a unique generated line identifier.');
        ids.add(line.id);
        if (line.code !== null && !isMedicalCode(line.code)) issue(`${field}.code`, 'Use a supported medical code or null.');
        if (!Number.isSafeInteger(line.amountCents) || line.amountCents < 0 || line.amountCents > 1_000_000_000) issue(`${field}.amountCents`, 'Use nonnegative whole USD cents.');
        if (!Number.isSafeInteger(line.units) || line.units < 1 || line.units > 10000) issue(`${field}.units`, 'Use whole units from 1 to 10000.');
        return { id: line.id, code: line.code, amountCents: line.amountCents, units: line.units };
      });
    }
  }
  if (issues.length) throw new DomainError(issues);
  return output;
}
