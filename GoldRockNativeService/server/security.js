import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, createCipheriv, createDecipheriv } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);

export class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
export const id = prefix => `${prefix}_${randomBytes(16).toString('hex')}`;
export const token = () => randomBytes(32).toString('base64url');
export const digest = value => createHash('sha256').update(value).digest('hex');
// Facts can have low entropy. Key and scope the idempotency fingerprint so a
// database-only copy cannot compare identical facts between personal accounts.
export const requestFingerprint = (value,hexKey,actor) => createHmac('sha256',Buffer.from(hexKey,'hex')).update(actor).update('\0').update(value).digest('hex');
export function equal(a, b) { const aa = Buffer.from(String(a)), bb = Buffer.from(String(b)); return aa.length === bb.length && timingSafeEqual(aa, bb); }

export function exactKeys(value, allowed, required = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !allowed.includes(key)) || required.some(key => !Object.hasOwn(value, key))) {
    throw new HttpError(422, 'INVALID_FIELDS', 'The request contains missing or unsupported fields.');
  }
}
export function plainText(value, min, max) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max || /[\u0000-\u001f\u007f<>]/.test(value)) throw new HttpError(422, 'INVALID_VALUE', 'Check the field length and characters.');
  return value.trim();
}
export function integer(value, min, max) {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new HttpError(422, 'INVALID_NUMBER', 'Enter a whole number within the supported range.');
  return value;
}
export function emailAddress(value) {
  const email = plainText(value, 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(422, 'INVALID_EMAIL', 'Enter a valid email address.');
  return email;
}
export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new HttpError(422, 'PASSWORD_LENGTH', 'Use a password from 12 to 128 characters.');
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$32768$${salt}$${key.toString('hex')}`;
}
export async function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [, cost, salt, expected] = (encoded || 'scrypt$32768$00000000000000000000000000000000$' + '0'.repeat(64)).split('$');
  const actual = await scrypt(password, salt, 32, { N: Number(cost), r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return equal(actual.toString('hex'), expected);
}

export function seal(value, hexKey, context) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', Buffer.from(hexKey, 'hex'), iv);
  cipher.setAAD(Buffer.from(context));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64');
}
export function unseal(value, hexKey, context) {
  const bytes = Buffer.from(value, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(hexKey, 'hex'), bytes.subarray(0, 12));
  decipher.setAAD(Buffer.from(context)); decipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString('utf8'));
}

export function rateLimiter() {
  const buckets = new Map();
  return (key, limit, interval = 60000) => {
    const now = Date.now();
    if (buckets.size > 10000) for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
    const entry = buckets.get(key);
    if (!entry || entry.reset <= now) { buckets.set(key, { count: 1, reset: now + interval }); return; }
    if (++entry.count > limit) throw new HttpError(429, 'RATE_LIMITED', 'Too many attempts. Wait a minute, then try again.');
  };
}

export async function readJson(req, max = 32768) {
  if (!/^application\/json(?:\s*;.*)?$/i.test(req.headers['content-type'] || '')) throw new HttpError(415, 'JSON_REQUIRED', 'Only structured JSON is accepted. File uploads are not supported.');
  if (Number(req.headers['content-length']) > max) throw new HttpError(413, 'REQUEST_TOO_LARGE', 'The request is too large. Original documents cannot be uploaded.');
  let length = 0; const chunks = [];
  for await (const chunk of req) { length += chunk.length; if (length > max) throw new HttpError(413, 'REQUEST_TOO_LARGE', 'The request is too large.'); chunks.push(chunk); }
  try { const body = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (!body || typeof body !== 'object' || Array.isArray(body)) throw 0; return body; }
  catch { throw new HttpError(400, 'INVALID_JSON', 'The request could not be read.'); }
}
