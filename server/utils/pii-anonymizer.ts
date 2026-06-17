const NAME_PATTERNS = [
  /(?:Patient|Name|Pt|Patient Name|PATIENT)[\s:]*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
  /(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g,
];

const SSN_PATTERN = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g;
const PHONE_PATTERN = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const DOB_PATTERN = /(?:DOB|Date of Birth|Birth Date|D\.O\.B\.?)[\s:]*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/gi;
const ADDRESS_PATTERN = /\d{1,5}\s+[A-Z][a-zA-Z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Rd|Road|Way|Ct|Court|Pl|Place|Cir|Circle)\.?(?:\s*,?\s*(?:Apt|Suite|Unit|#)\s*\d+[A-Za-z]?)?/gi;
const MEMBER_ID_PATTERN = /(?:Member\s*(?:ID|Number|#)|Policy\s*(?:Number|#)|Subscriber\s*(?:ID|#)|Group\s*(?:Number|#)|ID\s*Number)[\s:]*([A-Za-z0-9\-]+)/gi;
const ACCOUNT_PATTERN = /(?:Account\s*(?:Number|#|No\.?)|Acct\s*(?:#|No\.?))[\s:]*([A-Za-z0-9\-]+)/gi;

export interface KnownPiiValue {
  value: string;
  placeholder: string;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build a list of exact-match PII values from a user's profile so we can redact
 * the signed-in person's own name/email wherever it appears in OCR'd bill text.
 * This is far more reliable than pattern-guessing because we know the real value.
 */
export function knownValuesFromProfile(profile: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
} | null | undefined): KnownPiiValue[] {
  if (!profile) return [];
  const values: KnownPiiValue[] = [];
  const first = profile.firstName?.trim();
  const last = profile.lastName?.trim();
  if (first && last) values.push({ value: `${first} ${last}`, placeholder: '[PATIENT_NAME]' });
  if (first) values.push({ value: first, placeholder: '[PATIENT_NAME]' });
  if (last) values.push({ value: last, placeholder: '[PATIENT_NAME]' });
  const email = profile.email?.trim();
  if (email) values.push({ value: email, placeholder: '[EMAIL_REDACTED]' });
  return values;
}

export function anonymizeBillText(
  billText: string,
  knownValues?: KnownPiiValue[]
): { anonymized: string; mappings: Record<string, string> } {
  let anonymized = billText;
  const mappings: Record<string, string> = {};
  let counter = 1;

  // Most reliable pass first: redact exact known values (e.g. the signed-in
  // user's own name/email) wherever they appear, before generic patterns run.
  if (knownValues) {
    for (const { value, placeholder } of knownValues) {
      const trimmed = value?.trim();
      if (!trimmed || trimmed.length < 3) continue;
      // Word-boundary anchored so a short name (e.g. "Ann") can't corrupt an
      // unrelated word (e.g. "Annual"). These are ONE-WAY redactions of the
      // signed-in user's own profile data and are intentionally NOT written to
      // `mappings`: callers never need to restore them from the text (the value
      // is already known from the profile), and because full/first/last name
      // share a single placeholder, mapping them would rehydrate last-wins.
      const re = new RegExp(`\\b${escapeRegExp(trimmed)}\\b`, 'gi');
      anonymized = anonymized.replace(re, placeholder);
    }
  }

  // Every placeholder is uniquely numbered so rehydration can never restore the
  // wrong value when a prompt contains more than one email/phone/name/etc.
  anonymized = anonymized.replace(SSN_PATTERN, (match) => {
    const key = `[SSN_${counter++}]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(DOB_PATTERN, (match) => {
    const key = `[DOB_${counter++}]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(EMAIL_PATTERN, (match) => {
    const key = `[EMAIL_${counter++}]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(PHONE_PATTERN, (match) => {
    if (/^\d{5}$/.test(match.replace(/\D/g, '')) && /^\d{5}$/.test(match.trim())) return match;
    const key = `[PHONE_${counter++}]`;
    mappings[key] = match;
    return key;
  });

  for (const pattern of NAME_PATTERNS) {
    anonymized = anonymized.replace(pattern, (fullMatch, name) => {
      const key = `[NAME_${counter++}]`;
      if (name) {
        mappings[key] = name;
        return fullMatch.replace(name, key);
      }
      mappings[key] = fullMatch;
      return key;
    });
  }

  anonymized = anonymized.replace(ADDRESS_PATTERN, (match) => {
    const key = `[ADDRESS_${counter++}]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(MEMBER_ID_PATTERN, (fullMatch, id) => {
    if (id) {
      const key = `[MEMBER_ID_${counter++}]`;
      mappings[key] = id;
      return fullMatch.replace(id, key);
    }
    return fullMatch;
  });

  anonymized = anonymized.replace(ACCOUNT_PATTERN, (fullMatch, id) => {
    if (id) {
      const key = `[ACCOUNT_${counter++}]`;
      mappings[key] = id;
      return fullMatch.replace(id, key);
    }
    return fullMatch;
  });

  return { anonymized, mappings };
}

export function rehydrateResponse(response: string, mappings: Record<string, string>): string {
  let rehydrated = response;
  // Replace longest placeholders first so e.g. [EMAIL_1] never partially clobbers
  // [EMAIL_10] before the latter is restored.
  const placeholders = Object.keys(mappings).sort((a, b) => b.length - a.length);
  for (const placeholder of placeholders) {
    rehydrated = rehydrated.replaceAll(placeholder, mappings[placeholder]);
  }
  return rehydrated;
}
