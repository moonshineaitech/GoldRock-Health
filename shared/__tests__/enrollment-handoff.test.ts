import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDocumentChecklist,
  buildEnrollmentTimeline,
  buildHandoffGates,
  buildHandoffPlan,
  destinationsForProgram,
  mapAnswersToHandoffFields
} from "../enrollment-handoff";
import {
  auditConversation,
  createAnswer,
  ENROLLMENT_QUESTIONS,
  type EnrollmentAnswerMap
} from "../enrollment-workflow";

const values: Record<string, string> = {
  coverage_goal: "medicare",
  life_event: "I retire in September and my work coverage ends.",
  deadline: "September 30, 2026",
  date_of_birth: "1961-01-14",
  state: "Colorado",
  zip_code: "80202",
  current_coverage: "Employer PPO through September 30, 2026",
  medicare_status: "none",
  employer_coverage: "My own active employment coverage",
  household_size: "2",
  annual_income: "42000",
  preferred_doctors: "Dr. Chen at St. Joseph Hospital",
  prescriptions: "Eliquis 5 mg twice daily",
  accessibility: "Large print and my daughter present",
  submission_consent: "yes"
};

function answers(): EnrollmentAnswerMap {
  return Object.fromEntries(
    ENROLLMENT_QUESTIONS.map((question) => {
      const item = createAnswer(question, values[question.id], "text", 1);
      return [
        question.id,
        {
          ...item,
          confirmed: true,
          confirmedAt: "2026-08-03T12:00:00.000Z"
        }
      ];
    })
  );
}

test("Medicare uses the official Social Security pathway", () => {
  const destinations = destinationsForProgram("medicare");
  assert.equal(destinations[0].id, "ssa-medicare");
  assert.equal(destinations[0].governmentOperated, true);
  assert.ok(destinations.some((destination) => destination.id === "ship-counseling"));
});

test("Medicare Advantage uses official Plan Compare", () => {
  const destination = destinationsForProgram("medicare-advantage")[0];
  assert.equal(destination.id, "medicare-plan-compare");
  assert.match(destination.url, /^https:\/\/www\.medicare\.gov\//);
});

test("handoff field map retains source traceability", () => {
  const fields = mapAnswersToHandoffFields(answers());
  const birthDate = fields.find((field) => field.key === "date_of_birth");
  const income = fields.find((field) => field.key === "annual_income");

  assert.equal(birthDate?.sourceQuestionId, "date_of_birth");
  assert.equal(birthDate?.sensitive, true);
  assert.equal(income?.sensitive, true);
  assert.equal(fields.every((field) => field.requiresApplicantVerification !== undefined), true);
});

test("empty optional fields are omitted from portal transfer", () => {
  const intake = answers();
  intake.preferred_doctors.normalizedValue = "Skipped by applicant";
  intake.prescriptions.normalizedValue = "";

  const keys = mapAnswersToHandoffFields(intake).map((field) => field.key);
  assert.equal(keys.includes("provider_preferences"), false);
  assert.equal(keys.includes("prescription_preferences"), false);
});

test("retirement produces an employer verification document", () => {
  const documents = buildDocumentChecklist(answers(), "medicare");
  const verification = documents.find((document) => document.id === "employer-verification");

  assert.equal(verification?.required, true);
  assert.equal(verification?.status, "needed");
  assert.equal(verification?.sensitive, true);
});

test("Marketplace produces income and status document requirements", () => {
  const documents = buildDocumentChecklist(answers(), "marketplace");
  assert.equal(documents.find((document) => document.id === "income-proof")?.required, true);
  assert.equal(documents.find((document) => document.id === "citizenship-status")?.required, true);
});

test("handoff gates require applicant submission consent", () => {
  const intake = answers();
  intake.submission_consent.normalizedValue = "explain";
  const issues = auditConversation(intake).issues;
  const gates = buildHandoffGates(intake, issues);

  assert.equal(gates.find((gate) => gate.id === "submission-boundary")?.status, "required");
  assert.equal(gates.find((gate) => gate.id === "submission-boundary")?.blocking, true);
});

test("timeline ends with saving an official receipt", () => {
  const destination = destinationsForProgram("medicare")[0];
  const timeline = buildEnrollmentTimeline(destination);

  assert.equal(timeline.length, 7);
  assert.equal(timeline[0].id, "review-audit");
  assert.equal(timeline[timeline.length - 1].id, "save-receipt");
  assert.equal(timeline.find((step) => step.id === "attest-submit")?.owner, "applicant");
});

test("complete intake can launch but can never claim submission", () => {
  const intake = answers();
  const audit = auditConversation(intake);
  const plan = buildHandoffPlan(intake, audit.issues);

  assert.equal(audit.ready, true);
  assert.equal(plan.canLaunchPortal, true);
  assert.equal(plan.canRepresentAsSubmitted, false);
  assert.equal(plan.fields.length > 10, true);
  assert.equal(plan.documents.length, 8);
  assert.equal(plan.timeline.length, 7);
});

test("blocking conversation issue prevents portal launch", () => {
  const intake = answers();
  intake.current_coverage.normalizedValue = "None, uninsured";
  intake.employer_coverage.normalizedValue = "My active employer covers me";
  const audit = auditConversation(intake);
  const plan = buildHandoffPlan(intake, audit.issues);

  assert.equal(audit.ready, false);
  assert.equal(plan.canLaunchPortal, false);
  assert.equal(plan.canRepresentAsSubmitted, false);
});
