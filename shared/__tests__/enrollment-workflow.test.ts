import assert from "node:assert/strict";
import test from "node:test";
import {
  answersForAI,
  auditConversation,
  buildEnrollmentPacket,
  createAnswer,
  ENROLLMENT_QUESTIONS,
  type EnrollmentAnswerMap
} from "../enrollment-workflow";

const completeValues: Record<string, string> = {
  coverage_goal: "medicare",
  life_event: "I am turning 65 and retiring this fall.",
  deadline: "Employer coverage ends September 30, 2026.",
  date_of_birth: "1961-01-14",
  state: "Colorado",
  zip_code: "80202",
  current_coverage: "Employer PPO coverage until September 30, 2026.",
  medicare_status: "none",
  employer_coverage: "Coverage is through my active employment until retirement.",
  household_size: "2",
  annual_income: "42000",
  preferred_doctors: "Dr. Chen",
  prescriptions: "Eliquis 5 mg",
  accessibility: "Large print",
  submission_consent: "yes"
};

function completeAnswers(): EnrollmentAnswerMap {
  return Object.fromEntries(
    ENROLLMENT_QUESTIONS.map((question) => {
      const answer = createAnswer(question, completeValues[question.id], "text", 1);
      return [
        question.id,
        {
          ...answer,
          confirmed: true,
          confirmedAt: "2026-08-03T12:00:00.000Z"
        }
      ];
    })
  );
}

test("a complete, confirmed conversation is ready for applicant review", () => {
  const audit = auditConversation(completeAnswers());
  assert.equal(audit.ready, true);
  assert.equal(audit.score, 100);
  assert.equal(audit.issues.length, 0);
});

test("missing required answers block packet preparation", () => {
  const answers = completeAnswers();
  delete answers.state;

  const audit = auditConversation(answers);
  assert.equal(audit.ready, false);
  assert.ok(audit.issues.some((issue) => issue.id === "state-required"));
});

test("an answer must be explicitly confirmed", () => {
  const answers = completeAnswers();
  answers.annual_income.confirmed = false;

  const audit = auditConversation(answers);
  assert.equal(audit.ready, false);
  assert.ok(audit.issues.some((issue) => issue.id === "annual_income-unconfirmed"));
});

test("invalid ZIP codes are rejected deterministically", () => {
  const answers = completeAnswers();
  answers.zip_code.normalizedValue = "80";

  const audit = auditConversation(answers);
  assert.equal(audit.ready, false);
  assert.ok(audit.issues.some((issue) => issue.id === "zip_code-format"));
});

test("household size outside a reasonable range is rejected", () => {
  const answers = completeAnswers();
  answers.household_size.normalizedValue = "0";

  const audit = auditConversation(answers);
  assert.equal(audit.ready, false);
  assert.ok(audit.issues.some((issue) => issue.id === "household_size-range"));
});

test("conflicting current coverage answers produce a blocking issue", () => {
  const answers = completeAnswers();
  answers.current_coverage.normalizedValue = "None, I am uninsured";
  answers.employer_coverage.normalizedValue = "My active employer plan covers me";

  const audit = auditConversation(answers);
  assert.equal(audit.ready, false);
  assert.ok(audit.issues.some((issue) => issue.id === "coverage-contradiction"));
});

test("a Medicare Advantage goal warns when Parts A and B are not recorded", () => {
  const answers = completeAnswers();
  answers.coverage_goal.normalizedValue = "medicare-advantage";
  answers.medicare_status.normalizedValue = "part-a";

  const audit = auditConversation(answers);
  assert.equal(audit.ready, true);
  assert.ok(audit.issues.some((issue) => issue.id === "advantage-prerequisite"));
});

test("sensitive fields are removed from AI context", () => {
  const context = answersForAI(completeAnswers());

  assert.equal(context.date_of_birth, undefined);
  assert.equal(context.zip_code, undefined);
  assert.equal(context.annual_income, undefined);
  assert.equal(context.prescriptions, undefined);
  assert.equal(context.coverage_goal, "medicare");
  assert.equal(context.current_coverage.includes("Employer"), true);
});

test("packet includes every section and remains unsubmitted", () => {
  const packet = buildEnrollmentPacket(completeAnswers());

  assert.equal(packet.status, "ready-for-applicant-review");
  assert.equal(packet.attestation.required, true);
  assert.equal(packet.attestation.completed, false);
  assert.equal(packet.submission.submitted, false);
  assert.equal(packet.sections.length, 6);
  assert.equal(
    packet.sections.flatMap((section) => section.fields).length,
    ENROLLMENT_QUESTIONS.length
  );
});

test("packet exposes sensitive-field labels for downstream local handling", () => {
  const packet = buildEnrollmentPacket(completeAnswers());
  const fields = packet.sections.flatMap((section) => section.fields);

  assert.equal(fields.find((field) => field.id === "date_of_birth")?.sensitive, true);
  assert.equal(fields.find((field) => field.id === "zip_code")?.sensitive, true);
  assert.equal(fields.find((field) => field.id === "state")?.sensitive, false);
});
