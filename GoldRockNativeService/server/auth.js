import { HttpError, digest, token, equal, verifyPassword } from './security.js';

export function createSession(db, config, userId) {
  const accessToken = token(), csrfToken = token(), now = Date.now();
  db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(now);
  db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(digest(accessToken), userId, csrfToken, now, now + config.sessionSeconds * 1000);
  return { accessToken, csrfToken };
}
export function setSessionCookie(res, config, value) {
  res.setHeader('Set-Cookie', `goldrock_session=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${value ? config.sessionSeconds : 0}${config.environment === 'production' ? '; Secure' : ''}`);
}
export function getSession(req, db) {
  const bearer = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1];
  const cookie = req.headers.cookie?.match(/(?:^|;\s*)goldrock_session=([A-Za-z0-9_-]{43})(?:;|$)/)?.[1];
  const value = bearer || cookie;
  if (!value) return null;
  const session = db.prepare(`SELECT s.*,u.email,u.display_name FROM sessions s JOIN users u ON u.id=s.user_id WHERE token_hash=? AND expires_at>?`).get(digest(value), Date.now());
  return session ? { ...session, bearer: Boolean(bearer) } : null;
}
export function requireSession(req, db, mutation = false) {
  const session = getSession(req, db);
  if (!session) throw new HttpError(401, 'SIGN_IN_REQUIRED', 'Sign in to continue. Your local case is still on this device.');
  if (mutation && !session.bearer && !equal(req.headers['x-csrf-token'] || '', session.csrf)) throw new HttpError(403, 'REQUEST_VERIFICATION_FAILED', 'Refresh your session and try again.');
  return session;
}
export function sessionView(db, session, accessToken = null) {
  if (!session) return { user: null, benefits: [], organizations: [] };
  const benefits = db.prepare(`SELECT b.id,b.organization_id AS organizationId,o.name,b.status,b.ends_at AS endsAt FROM benefits b JOIN organizations o ON o.id=b.organization_id WHERE b.user_id=?`).all(session.user_id);
  const organizations = db.prepare(`SELECT o.id,o.name,r.role FROM organization_roles r JOIN organizations o ON o.id=r.organization_id WHERE r.user_id=?`).all(session.user_id);
  return { user: { id: session.user_id, email: session.email, displayName: session.display_name }, csrfToken: session.csrf, benefits, organizations, ...(accessToken ? { accessToken } : {}) };
}
export function requireOrganization(db, actorId, organizationId) {
  const result = db.prepare(`SELECT o.*,r.role FROM organizations o JOIN organization_roles r ON r.organization_id=o.id WHERE o.id=? AND r.user_id=?`).get(organizationId, actorId);
  if (!result) throw new HttpError(404, 'NOT_FOUND', 'The organization was not found.');
  return result;
}
export function isActiveContract(status, environment = 'production') {
  return status === 'active' || (status === 'active_development' && ['development','test'].includes(environment));
}
export function hasBenefit(db, actorId, environment = 'production') {
  const developmentAllowed = ['development','test'].includes(environment) ? 1 : 0;
  return Boolean(db.prepare(`SELECT b.id FROM benefits b JOIN organizations o ON o.id=b.organization_id WHERE b.user_id=? AND b.status='active' AND (b.ends_at IS NULL OR b.ends_at>?) AND (o.status='active' OR (?=1 AND o.status='active_development')) LIMIT 1`).get(actorId, Date.now(), developmentAllowed));
}
export async function confirmPassword(db, actorId, password) {
  const user = db.prepare('SELECT password_hash FROM users WHERE id=?').get(actorId);
  if (!user || !await verifyPassword(password, user.password_hash)) throw new HttpError(403, 'PASSWORD_INCORRECT', 'Confirm your current password.');
}
