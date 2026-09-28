// Time-sensitive and program-specific primary research; never infer eligibility from a bill alone.
export const exceptionSources = [
  { id: 'cms-ferp-2026-reopening', title: 'HHS external-review reopening and temporary deadline extension', url: 'https://www.cms.gov/files/document/hhs-administered-ferp-deadline-extension-07-31-26.pdf', publisher: 'CMS', applicability: 'Specified HHS-administered FERP participants, original deadlines July 1–August 3, 2026; excludes prior final HHS FERP decisions.', summary: 'A narrow reopening provision extends qualifying external-review requests to October 2, 2026. This is not a general extension of insurance appeals.', effectiveFrom: '2026-07-31', expiresAt: '2026-10-03T12:00:00.000Z' },
  { id: 'medicare-qmb-billing', title: 'Medicare Savings Programs and QMB billing protections', url: 'https://www.medicare.gov/basics/costs/help/medicare-savings-programs', publisher: 'Medicare.gov', applicability: 'Confirmed QMB participation and Medicare-covered services/items; not all Medicare beneficiaries or all charges.', summary: 'QMB beneficiaries have specific protection from Medicare cost-sharing bills. State eligibility and covered service status must be confirmed.' }
];

export const exceptionConcepts = [
  {
    id: 'ferp-temporary-reopening', category: 'coverage', title: 'A narrow 2026 external-review extension',
    question: 'Did the HHS external-review interruption affect my filing deadline?',
    summary: 'A temporary HHS rule may preserve an external-review opportunity through October 2, 2026 for a specifically defined group. An old appeal deadline alone does not establish eligibility.',
    mechanism: 'The HHS-administered process reopened July 31, 2026. The extension is tied to that process and the original external-review deadline; it does not extend every insurer or state appeal.',
    actions: ['Confirm that the notice directs your plan to HHS-administered FERP, and check the official reopening notice with the reviewer.', 'Compare the original external-review deadline with July 1–August 3, 2026, inclusive.', 'If the route and timing fit, confirm submission requirements and the October 2 cutoff directly; keep filing and receipt evidence.'],
    verify: ['The plan or issuer elected HHS-administered FERP.', 'The notice’s state/territory and route qualify, or this is an electing self-insured non-federal governmental plan.', 'No final HHS FERP decision has already been issued for this case.'],
    avoid: ['Do not treat this as a new internal-appeal period or a universal late-filing exception.', 'An eligible request filed before July 1 that still awaits a decision does not need to be refiled solely because of reopening.'],
    evidence: ['Final denial and route instructions', 'Original external-review deadline and plan election confirmation', 'Any earlier filing receipt and decision'],
    completion: ['Reviewer-confirmed acceptance and a retained receipt; filing alone is not a favorable review decision.'],
    sourceIds: ['cms-ferp-2026-reopening'], coverage: ['private','unknown'], documentTypes: ['denial','bill','unknown'], goals: ['appeal','understand','check'],
    tags: ['FERP','HHS','MAXIMUS','reopening','external review','extension','late deadline','October 2026'], kind: 'procedure',
    expiresAt: '2026-10-03T12:00:00.000Z', validThroughDate: '2026-10-02',
    handoffRefs: [{artifact:'bill-advocacy-playbook',lines:[188,259]}]
  },
  {
    id: 'qmb-medicare-cost-sharing', category: 'coverage', title: 'Check QMB before paying Medicare cost sharing',
    question: 'I have QMB and received a Medicare deductible or coinsurance bill. What should I check?',
    summary: 'For a confirmed QMB beneficiary, Medicare providers cannot charge the beneficiary Medicare-covered deductibles, coinsurance or copayments. A small applicable Medicaid copayment is different.',
    mechanism: 'QMB is a specific Medicare Savings Program. Other savings programs do not necessarily carry the same cost-sharing protection, and Medicare enrollment alone does not prove QMB status.',
    actions: ['Confirm QMB enrollment for the relevant period with your state or coverage records.', 'Ask the biller to review the Medicare-covered service and QMB status together.', 'Show the appropriate coverage evidence directly to the biller and request a corrected account statement.'],
    verify: ['QMB, not merely SLMB, QI or unspecified Medicaid coverage', 'Coverage for the service period', 'The charge is Medicare-covered cost sharing, not an unrelated noncovered service or applicable Medicaid copayment'],
    avoid: ['Do not infer QMB eligibility from income or age.', 'Do not use a general Medicare benefit explanation as proof that this particular service is covered.'],
    evidence: ['QMB/Medicaid evidence or Medicare Summary Notice showing QMB', 'Provider bill', 'Claim statement identifying covered service and cost sharing'],
    completion: ['Corrected bill or written account explanation reflecting the confirmed coverage.'],
    sourceIds: ['medicare-qmb-billing'], coverage: ['medicare'], documentTypes: ['bill','eob','denial','unknown'], goals: ['check','understand','afford','appeal'],
    tags: ['QMB','Medicare Savings Program','deductible','coinsurance','copayment','dual eligible'], kind: 'plan-specific',
    handoffRefs: [{artifact:'original-handoff',lines:[1634,1694]}]
  }
];

const ferpStates = ['AL','FL','GA','WI','TX','AS','GU','MP','VI'];
/** Local questionnaire only. No exact dates or plan details are added to cloud facts. */
export function checkFerpExtension(input = {}, { today } = {}) {
  const result = (status, message, missing = []) => ({ status, message, missing, sourceIds: ['cms-ferp-2026-reopening'], deadline: status === 'potential_match' ? '2026-10-02' : null });
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10) === value;
  if (!validDate(today)) return result('needs_confirmation', 'Confirm today’s local date before checking a temporary rule.', ['today']);
  if (today > '2026-10-02') return result('expired', 'The published temporary filing window has ended. Ask the reviewer about your actual case and any other applicable route.');
  if (today < '2026-07-31') return result('not_current', 'This reopening provision was not yet in effect on the selected date.');
  if (input.priorFinalDecision === true) return result('excluded', 'The notice excludes cases with a prior final HHS FERP decision.');
  if (input.electedHhsFerp === false) return result('excluded', 'This extension applies to the HHS-administered process, not every external-review route.');
  const missing = [];
  if (input.electedHhsFerp !== true) missing.push('electedHhsFerp');
  if (input.priorFinalDecision !== false) missing.push('priorFinalDecision');
  if (!validDate(input.originalDeadline)) missing.push('originalDeadline');
  if (input.selfInsuredNonFederalGovernmental !== true && !ferpStates.includes(input.state)) {
    if (input.selfInsuredNonFederalGovernmental === false && typeof input.state === 'string' && /^[A-Z]{2}$/.test(input.state) && input.state !== 'XX') return result('outside_listed_scope', 'The supplied route does not match the state/territory branch in this notice. Confirm the applicable review process directly.');
    missing.push('qualifyingPlanAndJurisdiction');
  }
  if (missing.length) return result('needs_confirmation', 'Confirm the route, original deadline and prior-decision status before relying on the extension.', missing);
  if (input.originalDeadline < '2026-07-01' || input.originalDeadline > '2026-08-03') return result('outside_window', 'The supplied original external-review deadline is outside the notice’s July 1–August 3 window.');
  return result('potential_match', 'These answers match the notice’s basic gates. Confirm acceptance, the October 2 cutoff and filing instructions with the HHS FERP reviewer. This is not an eligibility decision.');
}
