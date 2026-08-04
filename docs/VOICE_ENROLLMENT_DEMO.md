# Voice enrollment concierge

## Replit configuration

Set these Secrets in the Replit deployment:

- `OPENAI_API_KEY` — server-side only. It is exchanged for a short-lived Realtime client secret.
- `OPENAI_REALTIME_MODEL` — optional; defaults to `gpt-realtime`.

The browser never receives the permanent API key. A signed-in user requests a short-lived
credential from `/api/enrollment/realtime-token`, then establishes a WebRTC connection directly
to OpenAI. If Realtime is unavailable, the same workflow continues with browser speech recognition
or typed input.

## What is implemented

- A 15-question, sectioned intake covering the enrollment goal, life event,
  deadline, basic eligibility facts, current coverage, employer coverage,
  household screening, care preferences, accessibility, and submission consent.
- Browser speech recognition, typed input, and OpenAI Realtime speech-to-speech
  all feed the same state machine.
- Every captured answer is normalized, read back, and explicitly confirmed.
- Required-field, date, ZIP, household-size, income, relevance, prerequisite,
  deadline, and cross-answer contradiction checks run deterministically without AI.
- High-risk fields are removed from any optional AI context by the shared workflow layer.
- The final artifact is a versioned, structured, applicant-controlled handoff packet;
  it is never represented as proof of enrollment.
- Draft answers are saved locally so a confused, tired, or interrupted applicant can
  resume without repeating the entire conversation.
- Sensitive questions automatically pause all streamed voice modes and switch to typed
  local capture. This prevents dates of birth, ZIP codes, income, and prescriptions from
  being sent through either OpenAI Realtime or browser speech-recognition services.
- The Portal Handoff Center routes the applicant to the appropriate official starting
  point, maps confirmed answers to destination sections, prepares a local document
  checklist, enforces safety gates, and provides a receipt-oriented submission timeline.

## 90-second presentation

1. Open `/enrollment` and explain the privacy boundary shown above the hero.
2. Select **Load presentation demo** to populate a realistic, clearly labeled sample conversation.
3. Show the 100-point whole-conversation audit, six review sections, and per-answer editing.
4. Change current coverage to “none” while leaving employer coverage active to demonstrate
   the blocking contradiction check, then restore the sample answer.
5. Return to the start, choose **Start guided conversation**, and demonstrate **Answer by voice**.
6. When the Replit Secret is present and the presenter is signed in, choose **Live AI conversation**
   for OpenAI Realtime speech-to-speech. The permanent key remains on the server.
7. Continue to a protected field and show that live voice disconnects automatically.
8. Prepare the packet and demonstrate the five-tab Portal Handoff Center: official
   destination, mapped fields, local documents, submission timeline, and safety gates.

## Verification

```bash
npm run test:enrollment
npm run check
npm run build
```

The enrollment tests cover completion, missing answers, confirmation, ZIP and household
validation, coverage contradictions, Medicare prerequisites, AI-context redaction, and
handoff packet invariants.

## Safety and submission boundary

The conversational phase intentionally excludes SSNs, Medicare IDs, bank details, passwords,
signatures, and full document numbers. The experience prepares a reviewable enrollment handoff;
it does not silently attest, sign, choose a plan, or submit to a government portal for the user.
Production portal integrations should use an authorized API or an applicant-controlled handoff,
retain a confirmation receipt, and require explicit consent immediately before submission.
