import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

export const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['.env.local', '.env']) {
  const file = path.join(APP_ROOT, name);
  if (fs.existsSync(file)) process.loadEnvFile(file);
}

export function makeConfig(overrides = {}) {
  const environment = process.env.GOLDROCK_ENV || 'development';
  const port = Number(process.env.GOLDROCK_PORT || 4390);
  const config = {
    root: APP_ROOT, environment, port,
    host: process.env.GOLDROCK_HOST || '127.0.0.1',
    origin: process.env.GOLDROCK_ORIGIN || `http://127.0.0.1:${port}`,
    dataDir: process.env.GOLDROCK_DATA_DIR || path.join(APP_ROOT, '.data'),
    dataKey: process.env.GOLDROCK_DATA_KEY || '',
    apiKey: process.env.OPENAI_API_KEY || '', model: process.env.OPENAI_MODEL || '',
    enableCloud: process.env.GOLDROCK_ENABLE_CLOUD === '1',
    retentionNotice: process.env.GOLDROCK_PROVIDER_RETENTION_NOTICE || 'Provider retention has not been configured or verified. Cloud guidance is unavailable.',
    policyVersion: '2026-09-27-v2',
    jobTtlSeconds: Math.max(60, Math.min(3600, Number(process.env.GOLDROCK_JOB_TTL_SECONDS) || 900)),
    sessionSeconds: 86400, ...overrides
  };
  if (!['development', 'test', 'production'].includes(config.environment)) throw new Error('Invalid environment.');
  const origin = new URL(config.origin);
  if (config.environment === 'production' && origin.protocol !== 'https:') throw new Error('Production requires an HTTPS origin.');
  if(config.environment==='development' && process.env.GOLDROCK_ALLOW_REMOTE_DEVELOPMENT!=='1' && (!['127.0.0.1','localhost','::1'].includes(config.host) || !['127.0.0.1','localhost','[::1]'].includes(origin.hostname))) throw new Error('Development sponsorship is restricted to loopback. Remote development requires an explicit GOLDROCK_ALLOW_REMOTE_DEVELOPMENT=1 opt-in.');
  fs.mkdirSync(config.dataDir, { recursive: true, mode: 0o700 });
  if (!config.dataKey) {
    if (config.environment === 'production') throw new Error('Production requires an independently managed data encryption key.');
    const keyFile = path.join(config.dataDir, 'development-key');
    if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, randomBytes(32).toString('hex'), { mode: 0o600, flag: 'wx' });
    config.dataKey = fs.readFileSync(keyFile, 'utf8').trim();
  }
  if (!/^[a-f0-9]{64}$/i.test(config.dataKey)) throw new Error('Data encryption key must be 32 bytes encoded as hex.');
  return config;
}

export function publicConfig(config) {
  const configured = Boolean(config.apiKey && config.model);
  return {
    environment: config.environment, schemaVersion: 1,
    cloud: {
      configured, enabled: configured && config.enableCloud, provider: 'openai', model: config.model || null,
      reason: !configured ? 'Cloud guidance needs a configured API key and model. Local checks remain available.' : !config.enableCloud ? 'Cloud processing has not been enabled for this environment.' : null
    },
    privacy: { jobTtlSeconds: config.jobTtlSeconds, originalUpload: false, policyVersion: config.policyVersion, providerRetention: config.retentionNotice },
    auth: { password: true, recoveryCode: true, passwordChange: true, passkeys: false, apple: false, emailDelivery: false },
    commercial: { priceCents: 800, currency: 'USD', basis: 'eligible_employee_month', paymentsLive: false }
  };
}
