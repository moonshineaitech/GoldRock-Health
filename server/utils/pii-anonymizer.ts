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

export function anonymizeBillText(billText: string): { anonymized: string; mappings: Record<string, string> } {
  let anonymized = billText;
  const mappings: Record<string, string> = {};
  let counter = 1;

  anonymized = anonymized.replace(SSN_PATTERN, (match) => {
    const key = `[SSN_${counter++}]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(DOB_PATTERN, (match) => {
    const key = `[DOB_REDACTED]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(EMAIL_PATTERN, (match) => {
    const key = `[EMAIL_REDACTED]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(PHONE_PATTERN, (match) => {
    if (/^\d{5}$/.test(match.replace(/\D/g, '')) && /^\d{5}$/.test(match.trim())) return match;
    const key = `[PHONE_REDACTED]`;
    mappings[key] = match;
    return key;
  });

  for (const pattern of NAME_PATTERNS) {
    anonymized = anonymized.replace(pattern, (fullMatch, name) => {
      if (name) {
        const key = `[PATIENT_NAME]`;
        mappings[key] = name;
        return fullMatch.replace(name, key);
      }
      const key = `[NAME_REDACTED]`;
      mappings[key] = fullMatch;
      return key;
    });
  }

  anonymized = anonymized.replace(ADDRESS_PATTERN, (match) => {
    const key = `[ADDRESS_REDACTED]`;
    mappings[key] = match;
    return key;
  });

  anonymized = anonymized.replace(MEMBER_ID_PATTERN, (fullMatch, id) => {
    if (id) {
      const key = `[MEMBER_ID_REDACTED]`;
      mappings[key] = id;
      return fullMatch.replace(id, key);
    }
    return fullMatch;
  });

  anonymized = anonymized.replace(ACCOUNT_PATTERN, (fullMatch, id) => {
    if (id) {
      const key = `[ACCOUNT_REDACTED]`;
      mappings[key] = id;
      return fullMatch.replace(id, key);
    }
    return fullMatch;
  });

  return { anonymized, mappings };
}

export function rehydrateResponse(response: string, mappings: Record<string, string>): string {
  let rehydrated = response;
  for (const [placeholder, original] of Object.entries(mappings)) {
    rehydrated = rehydrated.replaceAll(placeholder, original);
  }
  return rehydrated;
}
