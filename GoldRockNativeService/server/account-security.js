import { HttpError, digest, emailAddress, equal, exactKeys, hashPassword, token, verifyPassword } from './security.js';
import { transaction } from './store.js';

const RECOVERY_LIFETIME_MS = 365 * 86400000;
const recoveryFailure = () => new HttpError(401, 'RECOVERY_FAILED', 'The account and recovery code could not be verified. Check your saved code or sign in with your password.');
const passwordFailure = () => new HttpError(403, 'PASSWORD_INCORRECT', 'Confirm your current password. If it changed, sign in again.');
const recoveryHash = (userId, code) => digest(`goldrock:account-recovery:v1\0${userId}\0${code}`);

function currentTime(now) {
  const value = now();
  if (!Number.isSafeInteger(value) || value < 0 || value > Number.MAX_SAFE_INTEGER - RECOVERY_LIFETIME_MS) throw new Error('Invalid account security clock.');
  return value;
}

async function verifiedPasswordSnapshot(db, userId, password) {
  const user = db.prepare('SELECT id,password_hash FROM users WHERE id=?').get(userId);
  // Use the normal dummy-password path for a missing account. Never accept a
  // password verified against an earlier hash after a concurrent reset commits.
  const valid = await verifyPassword(password, user?.password_hash);
  if (!user || !valid) throw passwordFailure();
  return user;
}

function requireUnchangedPassword(db, snapshot) {
  const current = db.prepare('SELECT password_hash FROM users WHERE id=?').get(snapshot.id);
  if (!current || !equal(current.password_hash, snapshot.password_hash)) throw passwordFailure();
}

export async function createRecoveryCode(db, userId, body, { now = () => Date.now() } = {}) {
  exactKeys(body, ['password'], ['password']);
  const user = await verifiedPasswordSnapshot(db, userId, body.password);
  return transaction(db, () => {
    requireUnchangedPassword(db, user);
    const createdAt = currentTime(now), expiresAt = createdAt + RECOVERY_LIFETIME_MS;
    const recoveryCode = token(); // 32 random bytes, shown only in this response.
    db.prepare(`INSERT INTO account_recovery_codes(user_id,code_hash,created_at,expires_at) VALUES(?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET code_hash=excluded.code_hash,created_at=excluded.created_at,expires_at=excluded.expires_at`)
      .run(userId, recoveryHash(userId, recoveryCode), createdAt, expiresAt);
    return { recoveryCode, expiresAt: new Date(expiresAt).toISOString() };
  });
}

export async function revokeRecoveryCode(db, userId, body) {
  exactKeys(body, ['password'], ['password']);
  const user = await verifiedPasswordSnapshot(db, userId, body.password);
  return transaction(db, () => {
    requireUnchangedPassword(db, user);
    db.prepare('DELETE FROM account_recovery_codes WHERE user_id=?').run(userId);
    return { revoked: true };
  });
}

export async function recoverAccount(db, body, { now = () => Date.now() } = {}) {
  exactKeys(body, ['email','recoveryCode','newPassword'], ['email','recoveryCode','newPassword']);
  let email;
  try { email = emailAddress(body.email); } catch { throw recoveryFailure(); }
  const code = typeof body.recoveryCode === 'string' ? body.recoveryCode.trim() : '';
  if (!/^[A-Za-z0-9_-]{43}$/.test(code)) throw recoveryFailure();
  // Hash before the account lookup for the same expensive path on well-formed
  // successful and unsuccessful attempts. The HTTP layer must also rate-limit.
  const newHash = await hashPassword(body.newPassword);
  return transaction(db, () => {
    const nowMs = currentTime(now); // Recheck expiry after asynchronous scrypt.
    const user = db.prepare(`SELECT u.id,r.code_hash,r.expires_at FROM users u
      LEFT JOIN account_recovery_codes r ON r.user_id=u.id WHERE u.email=?`).get(email);
    const codeMatches = equal(recoveryHash(user?.id || 'unavailable', code), user?.code_hash || '0'.repeat(64));
    if (!user || !codeMatches || user.expires_at <= nowMs || !Number.isSafeInteger(user.expires_at)) throw recoveryFailure();
    const consumed = db.prepare('DELETE FROM account_recovery_codes WHERE user_id=? AND code_hash=? AND expires_at>?')
      .run(user.id, user.code_hash, nowMs);
    if (consumed.changes !== 1) throw recoveryFailure();
    const changed = db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(newHash, user.id);
    if (changed.changes !== 1) throw recoveryFailure();
    db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
    return { userId: user.id };
  });
}

export async function changeAccountPassword(db, userId, body) {
  exactKeys(body, ['currentPassword','newPassword'], ['currentPassword','newPassword']);
  const user = await verifiedPasswordSnapshot(db, userId, body.currentPassword);
  const newHash = await hashPassword(body.newPassword);
  return transaction(db, () => {
    requireUnchangedPassword(db, user);
    const changed = db.prepare('UPDATE users SET password_hash=? WHERE id=? AND password_hash=?').run(newHash, userId, user.password_hash);
    if (changed.changes !== 1) throw passwordFailure();
    db.prepare('DELETE FROM sessions WHERE user_id=?').run(userId);
    // A known old recovery code must not reset a newly changed password.
    db.prepare('DELETE FROM account_recovery_codes WHERE user_id=?').run(userId);
    return { userId };
  });
}
