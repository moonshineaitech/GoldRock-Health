import { parseMoneyToCents } from './money.js';
import { validateFacts, isMedicalCode } from './validation.js';

/** Local-only assist, not a de-identification certification or a document export. */
export function detectSensitiveFlags(rawText) {
  if (typeof rawText !== 'string') throw new TypeError('Document text must be a string.');
  const checks = [
    ['email', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, 'Email address pattern'],
    ['phone', /(?:\+1[ .-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[ .-]?\d{3}[ .-]?\d{4}\b/, 'Phone number pattern'],
    ['ssn', /\b\d{3}[- ]\d{2}[- ]\d{4}\b/, 'Social Security number pattern'],
    ['date', /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/, 'Exact date pattern'],
    ['identity_label', /\b(?:patient\s+name|patient\s*:|guarantor|date\s+of\s+birth|DOB|member\s*(?:ID|number|#)|account\s*(?:number|no\.?|#|:)|medical\s+record|MRN|claim\s*(?:number|no\.?|#))\b/i, 'Name or account label'],
    ['address', /\b\d{1,6}\s+[\w .'-]{2,60}\s(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|court|ct|way)\b/i, 'Street address pattern'],
    ['url', /\bhttps?:\/\/\S+/i, 'URL or portal link'],
    ['long_identifier', /\b\d{8,}\b/, 'Long numeric identifier'],
  ];
  return checks.filter(([, pattern]) => pattern.test(rawText)).map(([id, , label]) => ({ id, label }));
}

export function extractLocalFacts(rawText) {
  if (typeof rawText !== 'string') throw new TypeError('Document text must be a string.');
  if (rawText.length > 500_000) throw new RangeError('Use a shorter document section or enter the facts manually.');
  const warnings = ['Local extraction is a suggestion. Review every field against the original before using or sending it.', 'Identifier checks can miss names and indirect identifiers. Only approved structured fields are returned; the document is not made anonymous.'];
  const text = rawText.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
  const types = [];
  if (/\bexplanation of benefits\b|\bthis is not a bill\b/i.test(text)) types.push('eob');
  if (/\b(?:notice of denial|adverse benefit determination|denial notice|coverage denied|claim denied)\b/i.test(text)) types.push('denial');
  if (/\b(?:good faith estimate|estimated cost|estimate of charges)\b/i.test(text)) types.push('estimate');
  if (/\b(?:amount due|balance due|patient statement|pay this amount|billing statement)\b/i.test(text)) types.push('bill');
  const distinct = [...new Set(types)];
  const documentType = distinct.length === 1 ? distinct[0] : 'unknown';
  if (distinct.length > 1) warnings.push('The text contains more than one document type. Separate the documents and confirm their types.');
  const facts = { documentType, goal: documentType === 'denial' ? 'appeal' : documentType === 'estimate' ? 'plan' : 'understand', coverage: 'unknown' };
  // Deliberately avoid guessing coverage from logos, plan names, Medicare mentions, or money totals.
  const labels = {
    billedCents: ['total charges', 'charges billed', 'amount billed'],
    adjustmentCents: ['total adjustments', 'contractual adjustment', 'insurance adjustment'],
    insurancePaidCents: ['insurance paid', 'insurance payments', 'plan paid'],
    paidCents: ['patient paid', 'patient payments', 'your payments'],
    balanceCents: ['balance due', 'amount due', 'patient balance'],
    estimateCents: ['estimated total', 'total estimate', 'estimated cost'],
    eobResponsibilityCents: ['patient responsibility', 'you may owe'],
  };
  for (const [field, names] of Object.entries(labels)) {
    // Count every labelled value, including unreadable/negative values. A second
    // malformed amount must not make the first plausible amount appear unique.
    const pattern = new RegExp(`^\\s*(?:${names.join('|')})\\b[ \\t]*[:=]?[ \\t]*(.*)$`, 'i');
    const matches = text.split('\n').map(line => line.match(pattern)).filter(Boolean);
    if (matches.length > 1) { warnings.push(`Multiple values found for ${field}; choose the correct statement locally.`); continue; }
    if (matches.length === 1) try {
      const value = matches[0][1].trim();
      // Keep separators intact; OCR digit spacing can change the actual number.
      const amount = parseMoneyToCents(value);
      if (amount === null) throw new Error('Missing labelled amount.');
      facts[field] = amount;
    } catch { warnings.push(`An amount for ${field} could not be read safely. Enter it manually.`); }
  }
  const statuses = [...text.matchAll(/^[ \t]*claim status[ \t]*:[ \t]*([^\n]+)$/gim)].map(match => match[1].trim().toLowerCase()).map(value => value === 'paid' ? 'processed' : value);
  const distinctStatuses = [...new Set(statuses)];
  if (distinctStatuses.length === 1 && ['pending','processed','denied'].includes(distinctStatuses[0])) facts.claimStatus = distinctStatuses[0];
  else if (statuses.length) warnings.push('Claim status is conflicting or unreadable. Confirm it from the matching claim before choosing a status.');
  // Only explicit minimal rows are parsed. Full clinical prose/table inference belongs in reviewed local tooling.
  const rows = [...text.matchAll(/^\s*(?:CPT|HCPCS|Code)\s*[:#]?\s*([A-Z0-9.]{4,7})\s+(?:units?\s*[:=]?\s*(\d{1,4})\s+)?(?:amount\s*[:=]?\s*)?\$([0-9][0-9,]*(?:\.[0-9]{1,2})?)\s*$/gim)];
  const lines = [];
  for (const match of rows.slice(0, 100)) {
    const code = match[1].toUpperCase(), units = Number(match[2] ?? 1);
    if (!isMedicalCode(code) || units < 1) continue;
    try { lines.push({ id: `line-${lines.length + 1}`, code, amountCents: parseMoneyToCents(match[3]), units }); } catch { warnings.push('A line amount needs manual review.'); }
  }
  if (lines.length) { facts.lines = lines; facts.hasItemization = true; }
  if (rows.length > 100) warnings.push('More than 100 line rows were found. Split this document for review.');
  return { facts: validateFacts(facts), sensitiveFlags: detectSensitiveFlags(text), warnings, requiresReview: true };
}
