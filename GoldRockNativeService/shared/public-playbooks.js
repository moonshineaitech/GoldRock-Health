import { getSource, SOURCE_REVIEWED_AT, SOURCE_EXPIRES_AT } from './sources.js';

const playbook = value => Object.freeze({ ...value, reviewedAt: SOURCE_REVIEWED_AT, expiresAt: SOURCE_EXPIRES_AT });
/** Public education: no patient data, automatic submission, payment or individualized legal conclusion. */
export const publicPlaybooks = Object.freeze([
  playbook({
    id: 'collections', title: 'A collector contacted me',
    summary: 'Verify the notice, preserve your response options, and keep court deadlines separate.',
    applicability: 'For a debt-collection contact. Original-provider bills, court papers, credit reporting and debt-collector notices have different processes. State rules may add protections.',
    steps: [
      'Verify the collector and creditor using trusted contact information before sharing financial details.',
      'Find the validation notice and its dispute end date. Ask for the creditor, itemized amount and information linking the debt to you.',
      'If you dispute the debt, respond in writing through the verified channel promptly. A qualifying written dispute within the notice’s 30-day period can require the collector to pause collection of the disputed amount until verification; this is not debt cancellation.',
      'Keep the notice, a copy of what you sent and proof of delivery locally. The app does not submit this request.',
      'If you have court papers, a judgment or questions about old debt, contact legal aid or a qualified attorney promptly. A collector dispute does not replace a court response.',
    ],
    draft: 'I am requesting information about the debt identified in your notice. Please identify the current and original creditor, provide an itemized calculation of the amount, and explain the records connecting this debt to me. [If accurate, describe the amount or part you dispute and the reason.] Please respond through [my chosen contact method].',
    sourceIds: ['cfpb-collection-contact', 'cfpb-debt-validation', 'cfpb-debt-legal-process'],
    limitations: ['Confirm the applicable notice and deadline; GoldRock does not calculate them from a generic collection call.', 'Do not add a denial of owing the debt unless it reflects your facts.'],
  }),
  playbook({
    id: 'payment-plans', title: 'Compare payment options',
    summary: 'Check assistance first, then compare the full cost and terms of each option.',
    applicability: 'For a confirmed provider balance. An EOB alone is not a payment request. Financing terms and assistance rules are provider-specific.',
    steps: [
      'Check the bill, insurance processing and hospital assistance before committing to a payment product.',
      'Ask the provider for an interest-free direct payment plan and whether assistance or a discount can still apply.',
      'For each offer, record the creditor, financed amount, total cost, interest rate, term, fees and what happens after a missed payment.',
      'Distinguish deferred interest from true zero interest. Ask whether interest can be charged back to the purchase date and whether minimum payments clear the balance before a promotional period ends.',
      'Request the agreement in writing and check that the installment fits your budget. Confirm whether the original provider balance will be paid and which obligations remain.',
    ],
    draft: 'Please provide your financial-assistance options and any interest-free direct payment plan. For each financing alternative, show the total repayment amount, interest and fees, promotional end date, required payment to clear the balance in time, and consequences of late payment. I would like to review the written terms before agreeing.',
    sourceIds: ['cfpb-medical-financing', 'cfpb-medical-debt', 'irs-financial-assistance', 'cms-eob'],
    limitations: ['A small monthly installment does not establish an affordable total cost.', 'No loan, payment, discount or collection hold is arranged by this playbook.'],
  }),
  playbook({
    id: 'failed-request', title: 'My first request did not work',
    summary: 'Separate a missing response, an incomplete application and a final decision before escalating.',
    applicability: 'For an unanswered or declined billing, assistance or insurance request. The next reviewer depends on the actual decision and plan or hospital policy.',
    steps: [
      'Check whether the recipient received the request. Save a reference number, receipt and the response locally.',
      'Ask whether the request is incomplete or denied, and request the specific missing item or written reason.',
      'For insurance, follow the actual denial’s next-level appeal instructions and ask whether external review or an urgent process applies. Medicare and Medicaid use their own routes.',
      'For hospital assistance, ask for the applicable policy, reconsideration route and explanation of covered or excluded billers.',
      'If unresolved, use the appropriate official consumer-assistance or complaint route. Preserve any separate appeal, payment or court deadline; an escalation is not an automatic extension.',
    ],
    draft: 'I previously requested [describe the request] and have [receipt/reference]. Please confirm its status and provide the written decision or identify exactly what is missing. If the request was denied, please explain the reason, relevant policy, next review channel and deadline. Please also confirm whether any payment or collection hold exists and when it ends.',
    sourceIds: ['healthcare-appeals', 'healthcare-external-review', 'irs-financial-assistance', 'medicare-appeals', 'medicaid-appeals', 'cms-medical-bill-rights'],
    limitations: ['An external review is not available for every billing disagreement.', 'A hospital discount request is distinct from an insurance coverage appeal.'],
  }),
  playbook({
    id: 'before-care', title: 'Plan before scheduled care',
    summary: 'Clarify who may bill, coverage requirements and written estimates.',
    applicability: 'For scheduled care when there is time to compare options. Do not delay urgent or medically necessary treatment for price research.',
    steps: [
      'Ask the provider which services, facility, clinicians, labs and other billers are expected.',
      'If using insurance, verify network status for the exact plan, coverage, referral and authorization requirements directly with the plan.',
      'Ask for a written estimate with included services, expected separate bills, assumptions and what could change the cost.',
      'If not using insurance, ask about the applicable good faith estimate process and get estimates from relevant separate providers.',
      'Keep the estimates and plan confirmations locally. Compare the later bill and EOB to the same services and provider.',
    ],
    draft: 'Please identify the services and separate providers expected for my scheduled care and give me a written estimate showing what is included and what could change. I will confirm network status, coverage and authorization with my plan. If I am not using insurance, please explain the good faith estimate process and which other providers I should ask for estimates.',
    sourceIds: ['cms-price-transparency', 'healthcare-preauthorization', 'cms-gfe-dispute'],
    limitations: ['Prior authorization does not guarantee full payment.', 'An estimate is not a final balance or an automatic entitlement to a particular price.'],
  }),
]);

export function getPlaybook(id, { now = new Date() } = {}) {
  const item = publicPlaybooks.find(value => value.id === id);
  if (!item) return null;
  const current = item.sourceIds.every(sourceId => getSource(sourceId, { now })?.current);
  return { ...item, current, steps: current ? [...item.steps] : [], draft: current ? item.draft : '', limitations: [...item.limitations, ...(current ? [] : ['This playbook needs a fresh source review before use. Open the official sources for current information.'])] };
}
export function listPublicPlaybooks(options) { return publicPlaybooks.map(item => getPlaybook(item.id, options)); }
