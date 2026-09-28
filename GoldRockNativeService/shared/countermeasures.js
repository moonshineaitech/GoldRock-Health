import { billingRoutes } from './billing-routes.js';
import { insuranceRoutes } from './insurance-routes.js';
import { priceRoutes } from './price-routes.js';
import { scenarioPlaybooks } from './scenario-playbooks.js';
import { getSource, SOURCE_REVIEWED_AT, SOURCE_EXPIRES_AT } from './sources.js';
import { validateFacts } from './validation.js';

export const COUNTERMEASURE_RESPONSES = Object.freeze(['prepare','no_reply','more_info','denied']);
export const COUNTERMEASURE_CATEGORIES = Object.freeze(['bill','coverage','assistance','collections','before-care']);
const routeCatalog = [...billingRoutes,...insuranceRoutes,...priceRoutes,...scenarioPlaybooks];
const copyRoute = route => JSON.parse(JSON.stringify(route));
const emptyMove = move => ({title:move.title,steps:[],draft:''});

/** The selection and any edited drafts stay local. No clinical inference or network call. */
export function getCountermeasure(id, { now = new Date() } = {}) {
  const raw = routeCatalog.find(route => route.id === id);
  if (!raw) return null;
  const route = copyRoute(raw);
  const time = new Date(now).getTime();
  const current = Number.isFinite(time) && time >= Date.parse(SOURCE_REVIEWED_AT) && time < Date.parse(SOURCE_EXPIRES_AT) && route.sourceIds.length > 0 && route.sourceIds.every(sourceId => getSource(sourceId,{now})?.current);
  if (!current) {
    route.firstMove = emptyMove(route.firstMove);
    route.responses = Object.fromEntries(Object.entries(route.responses).map(([key,move]) => [key,emptyMove(move)]));
    route.verify = [];
    if (route.evidence) route.evidence = [];
    if (route.counterQuestions) route.counterQuestions = [];
    route.watchouts = ['This route needs a fresh source review. Open the official sources before preparing a request.'];
  }
  return {...route,reviewedAt:SOURCE_REVIEWED_AT,expiresAt:SOURCE_EXPIRES_AT,current};
}

export function listCountermeasures(options) {
  return routeCatalog.map(route => getCountermeasure(route.id,options));
}

export function getCountermeasureMove(id, response='prepare', options) {
  if (!COUNTERMEASURE_RESPONSES.includes(response)) return null;
  const route = getCountermeasure(id,options);
  if (!route) return null;
  const move = response === 'prepare' ? route.firstMove : route.responses[response];
  return {...move,routeId:id,response,sourceIds:[...route.sourceIds],current:route.current,reviewedAt:route.reviewedAt,expiresAt:route.expiresAt,applicability:route.appliesWhen};
}

/** Suggestions explain their limited matching signal; they never assert a problem exists. */
export function recommendCountermeasures(input, options) {
  const facts = validateFacts(input);
  const labels = {bill:'provider bill',eob:'insurance explanation',denial:'denial notice',estimate:'estimate',understand:'understand the document',check:'check the bill',afford:'find an affordable path',appeal:'challenge a decision',plan:'plan before care'};
  return listCountermeasures(options).flatMap(route => {
    const triggers = route.triggers;
    // Collection contact cannot be inferred from having a bill or a high balance.
    if (!route.current || route.recommendationMode === 'manual-only' || route.category === 'collections' || !triggers.coverage.includes(facts.coverage)) return [];
    const documentMatch = triggers.documentTypes.includes(facts.documentType);
    const goalMatch = triggers.goals.includes(facts.goal);
    if (!documentMatch || !goalMatch) return [];
    if (triggers.anyOf?.length && !triggers.anyOf.some(clause => Object.entries(clause).every(([field,value]) => facts[field] === value))) return [];
    return [{...route,matchReasons:[`You selected a ${labels[facts.documentType] || facts.documentType} and want to ${labels[facts.goal] || facts.goal}.`, 'Confirm the checks in this route; this suggestion does not establish eligibility, a billing error or a payment hold.']}];
  });
}
