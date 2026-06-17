---
name: PII anonymizer & AI scrubbing
description: How bill/PHI text is stripped before third-party AI calls, the rehydration contract, and the known raw-image leak that is intentionally deferred.
---

# PII reduction before third-party AI (OpenAI/Google)

Framing: the product is NOT a HIPAA covered entity — this is **PII minimization**, not
compliance. Do not add "HIPAA compliant" claims.

## Rehydration contract (the rule that bites)
`anonymizeBillText(text, knownValues?)` returns `{ anonymized, mappings }`.
`rehydrateResponse(aiOutput, mappings)` restores the AI's output for display.

- Every generic placeholder MUST be **uniquely numbered** (`[EMAIL_1]`, `[PHONE_2]`,
  `[NAME_3]`, `[SSN_n]`, `[DOB_n]`, `[ADDRESS_n]`, `[MEMBER_ID_n]`, `[ACCOUNT_n]`) via a
  single shared counter. **Why:** reusing one label (the old `[EMAIL_REDACTED]`) makes
  multiple values in one prompt rehydrate last-wins — wrong email/name restored.
- `rehydrateResponse` replaces **longest placeholder key first** to avoid `[X_1]`
  clobbering `[X_10]`.
- Known-value (signed-in user's own profile name/email via `knownValuesFromProfile`)
  redactions are **ONE-WAY**: they redact but are NOT added to `mappings`. **Why:** we
  already have the user's name from their profile, and full/first/last name share one
  `[PATIENT_NAME]` placeholder so mapping them would rehydrate last-wins. **How to apply:**
  if you ever rehydrate a path that uses knownValues, restore the user's name from the
  profile, not from the text mapping.
- Known-value match is `\b`-anchored word-boundary + `escapeRegExp`, and skips values
  <3 chars. **Why:** substring match corrupts unrelated words ("Ann" in "Annual").

## Where scrubbing is wired (all of routes.ts)
Letter gen (itemized request), bill-ai-chat, public pre-collections-chat, demo-chat,
medical-chat, health-insights-chat, denial-appeals letter, single/multi bill upload
text analysis, bill-summarizer. Pattern: anonymize input → call AI → rehydrate output.
denial-appeals anonymizes two fields in ONE call via a random per-request separator
token, then splits (avoids cross-field counter collisions; random token so a user can't
type the delimiter).

## KNOWN DEFERRED LEAK (raw bill images)
`/api/upload-bill` & `/api/upload-bills` send the **raw base64 bill image** to
`aiProvider.generateWithImage()` BEFORE any anonymization (the OCR step itself needs the
image). The anonymizer only protects extracted/typed text, never the image — so names,
addresses, account/member IDs, DOBs in the image still reach OpenAI/Google. Fixing this
requires local OCR (e.g. tesseract) or image pre-redaction instead of AI vision — a real
architecture change, NOT a quick patch. Surfaced to the user as a decision; do not
silently rebuild it. Storage hardening (encrypt vs discard raw `medicalBills.originalText`
plaintext) is a separate deferred item the user has not chosen.
