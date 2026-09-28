import { validateFacts } from './validation.js';
import { formatMoney } from './money.js';
import { getSource } from './sources.js';

/** Deterministic guidance. No network, model call, original text, or inferred savings. */
export function analyzeFacts(input, { now = new Date() } = {}) {
  const facts = validateFacts(input), date = new Date(now);
  if (!Number.isFinite(date.getTime())) throw new TypeError('A valid analysis date is required.');
  const result = { version: 1, engine: 'rules', generatedAt: date.toISOString(), summary: '', findings: [], actions: [], questions: [], sourceIds: [], limitations: [
    'Calculated checks and researched guidance. These are questions to verify, not a finding of billing error or savings.',
    'The entered facts do not establish hospital-policy eligibility, plan terms, a filing deadline, or a payment hold.',
    'Drafts are editable and are not sent by GoldRock. Personal references can be added locally before you share.',
  ] };
  const stale = new Set();
  const current = ids => ids.every(id => { if (!getSource(id, { now: date })?.current) { stale.add(id); return false; } return true; });
  const finding = (id, title, detail, severity, evidenceIds = [], sourceIds = [], amountCents) => {
    if (!current(sourceIds)) return;
    result.findings.push({ id, title, detail, severity, ...(amountCents === undefined ? {} : { amountCents }), evidenceIds, sourceIds });
  };
  const action = (id, title, reason, steps, draft, sourceIds = [], priority = 2) => { if (current(sourceIds)) result.actions.push({ id, title, reason, steps, draft, sourceIds, priority }); };
  const question = text => { if (!result.questions.includes(text)) result.questions.push(text); };
  const known = key => Number.isSafeInteger(facts[key]);
  const insured = ['private', 'medicare', 'medicaid'].includes(facts.coverage);
  const selfPay = ['self_pay', 'uninsured'].includes(facts.coverage);
  const isBill = facts.documentType === 'bill';
  const denial = facts.documentType === 'denial' || facts.claimStatus === 'denied' || facts.goal === 'appeal';
  const planned = facts.documentType === 'estimate' || facts.goal === 'plan';
  if (facts.documentType === 'unknown') {
    question('Does the document request payment, explain insurance processing, deny coverage, or estimate future care?');
    action('identify-document', 'Identify the document first', 'The next step changes depending on who sent it and what it asks you to do.', ['Check the sender and document heading locally.', 'Choose bill, EOB, denial, or estimate and run the checks again.'], 'Please explain whether this document is a bill requesting payment, an insurance explanation, a denial, or an estimate.', ['cms-eob'], 1);
  }
  if (facts.coverage === 'unknown') question('Did you use private insurance, Medicare, Medicaid, or no insurance for this care?');
  if (!facts.state || facts.state === 'unknown') question('Which state was the care provided in? Local protections may differ.');

  if (facts.documentType === 'eob') {
    finding('eob-not-bill', 'This EOB is not a payment request', 'It explains insurance processing. Match it with the provider’s bill for the same care before deciding what is due.', 'info', ['documentType'], ['cms-eob']);
    action('match-eob', 'Match the EOB to the provider statement', 'A billed charge and patient responsibility describe different amounts.', ['Keep the EOB for comparison.', 'Check the claim status and whether a provider statement exists.', 'If amounts differ, confirm the documents describe the same services and processing stage.'], 'Please confirm whether this EOB and the provider statement refer to the same claim. Has processing finished, and what explains any difference in patient responsibility?', ['cms-eob'], 1);
  }
  if (facts.claimStatus === 'pending') {
    finding('claim-pending', 'Insurance processing is still pending', 'An unfinished claim can change the final patient balance. Confirm the status with the plan and provider.', 'question', ['claimStatus'], ['cms-eob']);
    action('confirm-processing', 'Confirm processing and ask about the due date', 'Pending insurance is not confirmation that the provider has paused billing.', ['Ask the plan what information is missing and who must supply it.', 'Ask the provider to confirm the due date and whether a hold is available.', 'Record a hold only after receiving its scope and end date.'], 'The claim appears to be pending. What is needed to finish processing? While that is resolved, can you confirm the current due date and whether you will place a billing hold in writing?', ['cms-eob'], 1);
  }

  if (isBill) {
    if (['billedCents', 'adjustmentCents', 'insurancePaidCents', 'paidCents', 'balanceCents'].every(known)) {
      const expected = facts.billedCents - facts.adjustmentCents - facts.insurancePaidCents - facts.paidCents;
      const difference = facts.balanceCents - expected;
      const evidence = ['billedCents', 'adjustmentCents', 'insurancePaidCents', 'paidCents', 'balanceCents'];
      if (difference !== 0) {
        finding('balance-mismatch', 'The entered amounts do not reconcile', `Charges minus adjustments, insurer payments and your payments equal ${formatMoney(expected)}. The entered balance is ${formatMoney(facts.balanceCents)}: a ${formatMoney(Math.abs(difference))} difference to explain, not confirmed savings.`, 'question', evidence, [], Math.abs(difference));
        action('reconcile-balance', 'Ask for a reconciled statement', 'The arithmetic differs; a missing adjustment, credit, or document version could explain it.', ['Check that all five amounts cover the same statement period.', 'Request a ledger of charges, adjustments and payments.', 'Compare the revised statement before marking the issue resolved.'], `My entered figures calculate to ${formatMoney(expected)}, while the statement balance is ${formatMoney(facts.balanceCents)}. Please provide an account ledger explaining the difference and confirm which payments and adjustments are included.`, ['cfpb-medical-debt'], 1);
      } else finding('balance-reconciles', 'The entered balance adds up', 'The arithmetic reconciles. This does not establish that the charges, coverage, or coding are correct.', 'info', evidence);
    } else question('Do you have the total charges, adjustments, insurer payments, your payments, and current balance from the same statement? Missing amounts are not treated as zero.');

    if (insured && known('balanceCents') && known('eobResponsibilityCents') && facts.balanceCents !== facts.eobResponsibilityCents) {
      finding('eob-mismatch', 'The statement and EOB show different amounts', `The entered statement balance is ${formatMoney(facts.balanceCents)} and the EOB responsibility is ${formatMoney(facts.eobResponsibilityCents)}. Check matching services, later payments and claim versions before treating the difference as an error.`, 'question', ['balanceCents', 'eobResponsibilityCents'], ['cms-eob'], Math.abs(facts.balanceCents - facts.eobResponsibilityCents));
      action('reconcile-eob', 'Compare the bill with the latest EOB', 'The documents may cover different services or processing stages.', ['Confirm the same care and billing entity using details kept locally.', 'Check whether a corrected EOB or a credited payment is missing.', 'Ask the plan and provider for a written explanation.'], 'The provider balance and EOB responsibility differ. Please confirm that they concern the same services, show any later payments or reprocessing, and explain the remaining responsibility.', ['cms-eob'], 1);
    }
    if (facts.hasItemization !== true || !facts.lines?.length) action('request-itemization', 'Get an itemized statement', 'A total alone does not explain the charges.', ['Ask for services, codes, units, charges and the payment ledger.', 'Keep the itemization on your device.', 'Review any repeated lines and unfamiliar services with the billing office.'], 'Please send an itemized statement with codes, units, charges, adjustments, insurer payments, my payments, and the current balance. Please confirm whether every insurance claim has finished processing.', ['cfpb-medical-debt'], 2);
  }
  const groups = new Map();
  for (const line of facts.lines ?? []) if (line.code) {
    const key = `${line.code}:${line.amountCents}:${line.units}`;
    groups.set(key, [...(groups.get(key) ?? []), line]);
  }
  let repeatedIndex = 0;
  for (const group of groups.values()) if (group.length > 1) {
    const ids = group.map(line => line.id), first = group[0];
    finding(`repeated-lines-${++repeatedIndex}`, 'Similar line items need an explanation', `${group.length} lines share code ${first.code}, amount ${formatMoney(first.amountCents)}, and ${first.units} unit(s). Separate visits, modifiers, or different billers can make repetition legitimate.`, 'question', ids, ['cfpb-medical-debt']);
  }
  if (repeatedIndex) action('explain-lines', 'Ask how the repeated lines differ', 'A matching code and amount is a question, not proof of duplicate billing.', ['Compare service dates, modifiers and billers locally.', 'Ask which service each line represents.', 'If the provider confirms an error, request a corrected balance in writing.'], 'Some itemized lines have the same code, amount and units. Could you explain the separate service represented by each line and check that none was entered twice? Please send a corrected statement if you find an error.', ['cfpb-medical-debt'], 2);

  if (denial && insured) {
    const source = facts.coverage === 'medicare' ? 'medicare-appeals' : facts.coverage === 'medicaid' ? 'medicaid-appeals' : 'healthcare-appeals';
    const label = facts.coverage === 'medicare' ? 'Medicare coverage and appeal level' : facts.coverage === 'medicaid' ? 'state Medicaid or managed-care process' : 'plan’s appeal process';
    finding('denial-route', 'Start with the reason and the actual notice', `Your ${label} determines where and when to request review. A generic countdown would not establish your deadline.`, 'important', ['documentType', 'coverage', ...(facts.claimStatus ? ['claimStatus'] : [])], [source]);
    question('What deadline, submission method, and review level are stated in the actual denial notice? Keep exact dates and claim identifiers local.');
    if (!facts.denialReason || facts.denialReason === 'unknown') question('Does the notice describe missing information, a coverage exclusion, or a medical-necessity decision?');
    action('prepare-appeal', 'Prepare a response to the stated denial', `Use the ${label}; preserve proof of receipt.`, ['Read the reason and request the records or criteria behind it.', 'Confirm the required form, recipient and deadline directly from the notice or plan.', facts.denialReason === 'medical_necessity' ? 'Ask the treating clinician for supporting clinical rationale; do not invent medical facts.' : 'Gather the actual records that answer the stated reason.', 'Edit the draft, submit through the verified channel, then record receipt.'], 'I request review of the decision identified in my attached notice. Please provide the plan provision and records relied on, confirm the filing deadline and submission method, and consider my attached supporting information. My reason for requesting review is [add verified facts addressing the denial]. Please confirm receipt and issue a written decision.', [source], 1);
    if (facts.denialReason === 'administrative') action('correct-claim', 'Ask whether a corrected claim is needed', 'A missing or incorrect administrative field may require the provider to resubmit.', ['Ask which specific field or document is missing.', 'Confirm who will make the correction and when.', 'Keep the appeal deadline active unless the plan confirms a change.'], 'Please identify the missing or incorrect claim information and who needs to correct it. Will you reprocess the claim when it is supplied? Please also confirm whether my appeal deadline remains unchanged.', [source], 1);
    if (facts.coverage === 'private') action('external-review', 'Check the next review route if the denial stands', 'Independent review is available for eligible decisions through the applicable process.', ['Read the final denial’s external-review instructions.', 'Confirm whether the decision qualifies and whether internal review is exhausted or an exception applies.', 'If care is urgent, ask the clinician and plan about expedited review now.'], 'If this denial is upheld, please identify the applicable external-review process, eligibility requirements, deadline, and documents. If urgent review is available, please explain how my clinician and I request it.', ['healthcare-external-review'], 3);
  }
  if (denial && !insured) {
    question('Is this actually an insurance denial, or a provider declining a discount? Confirm coverage before using an insurance appeal draft.');
    action('confirm-denial-route', 'Confirm who made the decision', 'Insurance appeals and provider discount requests have different routes.', ['Read who issued the decision and what it declined.', 'Confirm whether insurance was used for this care.', 'Ask the sender which review process and deadline apply.'], 'Please explain what decision this notice makes, who can review it, and the applicable review process and deadline.', ['cms-medical-bill-rights'], 1);
  }

  if (facts.coverage === 'private' && ['emergency', 'in_network_facility', 'air_ambulance'].includes(facts.careSetting)) {
    finding('surprise-bill-check', 'Check unexpected out-of-network responsibility', 'This care setting can involve federal surprise-billing protections. Coverage, care date, network facts, provider role and any notice or consent still need verification.', 'question', ['coverage', 'careSetting'], ['cms-no-surprises']);
    action('surprise-bill-review', 'Ask the plan to review billing protections', 'A high deductible alone does not show a violation.', ['Confirm the facility and provider network status for the exact plan.', 'Request any notice-and-consent document relied on.', 'Compare the corrected EOB or explanation and use CMS help if unresolved.'], 'Please review whether federal or state surprise-billing protections apply to this charge. Explain the network processing and patient responsibility, and provide any notice or consent used in the decision.', ['cms-no-surprises'], 1);
  }
  if (facts.careSetting === 'ground_ambulance') {
    finding('ground-ambulance', 'Ground ambulance needs a separate check', 'Federal No Surprises Act protections generally exclude ground ambulance. Ask about applicable state protections and the plan’s terms.', 'info', ['careSetting'], ['cms-no-surprises']);
  }
  if (selfPay && isBill) {
    if (facts.hasEstimate === true && known('estimateCents') && known('billedCents')) {
      const excess = facts.billedCents - facts.estimateCents;
      finding('estimate-comparison', 'Compare the charge with your estimate', `The billed charge is ${formatMoney(Math.abs(excess))} ${excess >= 0 ? 'above' : 'below'} the entered estimate. This comparison must be for the same provider and scope.`, 'info', ['billedCents', 'estimateCents'], [], Math.abs(excess));
      if (excess >= 40000 && (!known('daysSinceInitialBill') || facts.daysSinceInitialBill <= 120)) {
        finding('ppdr-check', 'A federal estimate-dispute route is worth checking', 'The entered difference meets the $400 threshold. Eligibility is not established: confirm self-pay notice, qualifying care and estimate timing, matching provider/scope, and the initial-bill date.', 'important', ['coverage', 'hasEstimate', 'estimateCents', 'billedCents', ...(known('daysSinceInitialBill') ? ['daysSinceInitialBill'] : [])], ['cms-gfe-dispute']);
        action('ppdr-verify', 'Verify every estimate-dispute requirement', 'CMS uses a 120-calendar-day initial-bill window; verify promptly with the official process.', ['Confirm you did not use insurance and told the provider before care.', 'Confirm care was on or after January 1, 2022 and the advance-estimate timing qualifies.', 'Match this provider’s estimate and bill and verify the initial-bill date.', 'Review current CMS requirements and fee before deciding whether to file.'], `The billed charge of ${formatMoney(facts.billedCents)} is ${formatMoney(excess)} above the estimate of ${formatMoney(facts.estimateCents)}. Please explain the difference. I am checking the applicable patient-provider dispute process and would like a written response.`, ['cms-gfe-dispute'], 1);
        question('Do the estimate and bill cover the same provider and services, and were the required estimate and self-pay notices provided before qualifying care?');
        if (!known('daysSinceInitialBill')) question('How many calendar days have passed since the initial bill date? Check the official filing rule promptly.');
      } else if (excess >= 40000 && facts.daysSinceInitialBill > 120) {
        finding('ppdr-window', 'The entered bill age exceeds the standard dispute window', 'The entered age is beyond the standard CMS 120-calendar-day window. Verify the dates and ask CMS which other assistance or complaint routes fit.', 'important', ['daysSinceInitialBill'], ['cms-gfe-dispute']);
      }
    } else {
      question('Did you receive a written good faith estimate for this provider before the care?');
      action('missing-estimate', 'Ask about the missing estimate', 'Without an estimate, this comparison cannot establish an estimate-dispute case.', ['Ask the provider for any written estimate it supplied.', 'Use the official CMS information and complaint route if an estimate should have been provided.', 'Continue reviewing financial assistance and billing accuracy.'], 'Please send any good faith estimate provided before my care, or explain whether one was required and why it was not supplied.', ['cms-gfe-dispute'], 2);
    }
  }

  if (facts.goal === 'afford' || (isBill && known('balanceCents') && facts.balanceCents > 0)) {
    action('financial-assistance', 'Check financial assistance before financing', 'A hospital’s actual policy determines eligibility and which bills it covers.', ['Find the official policy, plain-language summary and application for the exact hospital.', 'Check the covered-provider list; separately billed clinicians may be excluded.', 'Ask about insured eligibility, required documents, deadlines and reconsideration.', 'Apply directly through the verified recipient and retain receipt.'], 'Please send your financial-assistance policy, application, plain-language summary and covered-provider list. Can I be screened given my insurance and household situation? Please explain required documents, deadlines, hardship options and reconsideration.', ['irs-financial-assistance'], facts.goal === 'afford' ? 1 : 2);
    if (isBill) action('payment-options', 'Request written payment options', 'Compare assistance and affordable terms before committing to financing.', ['Ask about interest-free plans and any direct-pay discount after checking assistance.', 'Request total cost, interest, fees, missed-payment terms and credit effects.', 'Confirm the balance and any billing hold in writing before relying on it.'], 'After reviewing assistance, what affordable payment options are available? Please give me the total repayment cost, interest, fees, and missed-payment terms in writing. Can you confirm whether any billing or collection hold applies, and its end date?', ['cfpb-medical-debt'], 3);
  }
  if (planned) {
    action('plan-care', 'Get an estimate with the right scope', 'Separate billers and plan rules can change the eventual cost.', ['Ask which facility, clinicians, labs and other services may bill separately.', insured ? 'Verify network status, coverage, referral and authorization with the exact plan.' : 'Ask the provider for a written good faith estimate and expected separate billers.', 'Keep written estimates and confirmations locally and compare the eventual bill.'], 'Please provide a written estimate identifying included services, expected separate billers and what could change the cost. Please confirm the coverage and authorization questions I should check with my plan, or the good faith estimate process if I am not using insurance.', ['cms-price-transparency', 'healthcare-preauthorization'], 1);
    finding('estimate-not-final', 'An estimate is a planning tool', 'Final responsibility can change with services and plan processing. Prior authorization does not guarantee full payment.', 'info', ['documentType', 'goal'], ['healthcare-preauthorization']);
  }
  if (stale.size) {
    result.limitations.push('Some policy sources need a fresh review. Related recommendations were withheld; verify the official sources before choosing a route.');
    finding('source-review-needed', 'Policy guidance needs a fresh source review', 'Arithmetic remains available. Review current official guidance before relying on a legal or policy route.', 'important');
  }
  result.actions.sort((a, b) => a.priority - b.priority);
  result.sourceIds = [...new Set([...result.findings, ...result.actions].flatMap(item => item.sourceIds))];
  result.summary = facts.documentType === 'eob' ? 'Understand what the plan processed, then match it to a provider statement.' : denial ? 'Use the actual denial to confirm the route, evidence and next step.' : planned ? 'Clarify scope, coverage and written estimates before planned care.' : result.findings.some(item => item.severity === 'question') ? 'There are specific questions worth checking before deciding what to do next.' : 'Start with the facts, then choose the most useful next step.';
  return result;
}
export const generateGuidance = analyzeFacts;
