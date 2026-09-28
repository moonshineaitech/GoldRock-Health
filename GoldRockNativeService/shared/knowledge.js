import { knowledgeConcepts } from './knowledge-concepts.js';
import { exceptionConcepts } from './knowledge-exceptions.js';
import { scenarioKnowledgeConcepts } from './scenario-playbooks.js';
import { countermeasureConcepts } from './knowledge-countermeasures.js';
import { getSource, SOURCE_REVIEWED_AT, SOURCE_EXPIRES_AT } from './sources.js';
import { validateFacts } from './validation.js';

const knowledgeCopy = value => JSON.parse(JSON.stringify(value));
const knowledgeTokens = value => String(value ?? '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) || [];
const knowledgeStopWords = new Set('a an and are as at be can do does for from how i in is it me my of on or the this to was what when why with you your'.split(' '));
const knowledgeQueryTokens = value => [...new Set(knowledgeTokens(value).filter(token => !knowledgeStopWords.has(token)))];
const knowledgeReviewNotice = 'This answer needs a fresh source review. Open the official sources and verify the current process before acting.';
const knowledgeCatalog = [...knowledgeConcepts, ...exceptionConcepts, ...scenarioKnowledgeConcepts, ...countermeasureConcepts];

/** Reviewed public knowledge. Queries and case matching are entirely device-local. */
export function getKnowledge(id, { now = new Date() } = {}) {
  const raw = knowledgeCatalog.find(record => record.id === id);
  if (!raw) return null;
  const record = knowledgeCopy(raw);
  const reviewedAt = record.reviewedAt || SOURCE_REVIEWED_AT;
  const sourceRecords = record.sourceIds.map(sourceId => getSource(sourceId, { now })).filter(Boolean);
  const expirations = [record.expiresAt || SOURCE_EXPIRES_AT, ...sourceRecords.map(source => source.expiresAt)];
  const expiresAt = new Date(Math.min(...expirations.map(value => Date.parse(value)))).toISOString();
  const time = new Date(now).getTime();
  const localDate = new Date(now);
  const localDay = `${localDate.getFullYear()}-${String(localDate.getMonth()+1).padStart(2,'0')}-${String(localDate.getDate()).padStart(2,'0')}`;
  const current = Number.isFinite(time) && time >= Date.parse(reviewedAt) && time < Date.parse(expiresAt) && (!record.validThroughDate || localDay <= record.validThroughDate)
    && record.sourceIds.length > 0 && sourceRecords.length === record.sourceIds.length && sourceRecords.every(source => source.current);
  if (!current) {
    record.summary = knowledgeReviewNotice;
    record.mechanism = '';
    for (const field of ['actions', 'verify', 'avoid', 'evidence', 'completion']) record[field] = [];
    if (record.counterQuestions) record.counterQuestions = [];
    if (record.responseBranches) record.responseBranches = {};
  }
  return { ...record, reviewedAt, expiresAt, current };
}

export function listKnowledge(options) { return knowledgeCatalog.map(record => getKnowledge(record.id, options)); }
export function getKnowledgeCategories() { return [...new Set(knowledgeCatalog.map(record => record.category))]; }

function knowledgeMatchesScope(record, facts) {
  if (!facts) return true;
  // Unknown is a separate allowed value, never a guess that someone has private coverage.
  return record.coverage.includes(facts.coverage)
    && record.documentTypes.includes(facts.documentType)
    && record.goals.includes(facts.goal);
}

/** Lexical retrieval, not an AI answer or a determination that a protection applies. */
export function searchKnowledge(query = '', { facts, category, limit = 12, now = new Date() } = {}) {
  const checkedFacts = facts ? validateFacts(facts) : null;
  const tokens = knowledgeQueryTokens(String(query).slice(0, 400));
  const maxResults = Number.isSafeInteger(limit) ? Math.max(0, Math.min(256, limit)) : 12;
  return listKnowledge({ now }).flatMap(record => {
    if (category && category !== 'all' && record.category !== category) return [];
    if (!knowledgeMatchesScope(record, checkedFacts)) return [];
    const primary = new Set(knowledgeTokens([record.title, record.question, ...record.tags].join(' ')));
    const secondary = new Set(knowledgeTokens([record.summary, record.mechanism, ...record.actions, ...record.verify].join(' ')));
    const matched = tokens.filter(token => primary.has(token) || secondary.has(token));
    if (tokens.length && matched.length === 0) return [];
    const score = matched.reduce((sum, token) => sum + (primary.has(token) ? 6 : 1), 0) + (matched.length === tokens.length && tokens.length ? 4 : 0);
    const matchReasons = [];
    // Do not echo query text: it may contain identifiers. Only curated explanations leave this function.
    if (tokens.length) matchReasons.push('Matches terms in this reviewed answer.');
    if (checkedFacts) matchReasons.push('Within the document, goal and coverage categories you selected. Confirm the answer’s checks; this is not an eligibility decision.');
    return [{ ...record, score, matchReasons }];
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, maxResults);
}

/**
 * Supplemental model context is restricted to the already-approved canonical source set.
 * No query, local workbook, raw document or new identifier is accepted by this boundary.
 */
export function retrieveKnowledgeForGuidance(facts, base, { now = new Date(), limit = 6 } = {}) {
  const allowedSources = new Set(Array.isArray(base?.sourceIds) ? base.sourceIds : []);
  const query = [facts.documentType, facts.goal, facts.claimStatus, facts.denialReason,
    ...(base?.findings || []).map(item => item.title), ...(base?.actions || []).map(item => item.title)].filter(Boolean).join(' ');
  return searchKnowledge(query, { facts, limit: 100, now }).filter(record => record.current && !record.manualOnly && record.sourceIds.every(id => allowedSources.has(id)))
    .slice(0, Math.max(0, Math.min(10, Number.isSafeInteger(limit) ? limit : 6)))
    .map(({ id, title, question, summary, mechanism, actions, verify, avoid, evidence, completion, sourceIds, reviewedAt, expiresAt }) =>
      ({ id, title, question, summary, mechanism, actions, verify, avoid, evidence, completion, sourceIds, reviewedAt, expiresAt }));
}
