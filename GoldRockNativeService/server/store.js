import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

export function openStore(config) {
  const db = new DatabaseSync(path.join(config.dataDir, 'goldrock.sqlite'));
  db.exec(`
    PRAGMA foreign_keys=ON;
    PRAGMA journal_mode=WAL;
    PRAGMA secure_delete=ON;
    PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS schema_version(version INTEGER PRIMARY KEY);
    INSERT OR IGNORE INTO schema_version VALUES(1);
    CREATE TABLE IF NOT EXISTS users(
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions(
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      csrf TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS account_recovery_codes(
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      code_hash TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
    );
    INSERT OR IGNORE INTO schema_version VALUES(2);
    CREATE TABLE IF NOT EXISTS organizations(
      id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
      eligible_count INTEGER NOT NULL CHECK(eligible_count BETWEEN 1 AND 1000000),
      price_cents INTEGER NOT NULL DEFAULT 800, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS organization_roles(
      organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('owner','admin')), PRIMARY KEY(organization_id,user_id)
    );
    CREATE TABLE IF NOT EXISTS invites(
      id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE, expires_at INTEGER NOT NULL,
      max_uses INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0, revoked INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS benefits(
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'active', ends_at INTEGER,
      UNIQUE(user_id,organization_id)
    );
    CREATE TABLE IF NOT EXISTS jobs(
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      operation_id TEXT NOT NULL, request_hash TEXT NOT NULL, status TEXT NOT NULL,
      payload TEXT, result TEXT, error_code TEXT, created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
      deleted_at INTEGER, UNIQUE(user_id,operation_id)
    );
    CREATE INDEX IF NOT EXISTS job_work ON jobs(status,expires_at);
    CREATE TABLE IF NOT EXISTS audit_events(
      id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id TEXT, organization_id TEXT,
      event TEXT NOT NULL, created_at INTEGER NOT NULL
    );
  `);
  return db;
}
export function transaction(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = fn(); db.exec('COMMIT'); return result; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}
export function audit(db, actorId, event, organizationId = null) {
  db.prepare('INSERT INTO audit_events(actor_id,organization_id,event,created_at) VALUES(?,?,?,?)').run(actorId, organizationId, event, Date.now());
}

// Call after the scrubbing transaction commits. A successful checkpoint removes
// old frames from the live WAL; it makes no claim about backups or disk erasure.
// SQLite's synchronous API cannot impose an I/O deadline, so this bounds lock
// waiting to zero. The caller retains a dirty flag and retries incomplete work.
export function flushContentRemnants(db) {
  let previousTimeout;
  let result = { complete: false, busy: false };
  try {
    previousTimeout = db.prepare('PRAGMA busy_timeout').get()?.timeout;
    if (!Number.isInteger(previousTimeout) || previousTimeout < 0 || previousTimeout > 2147483647) return result;
    db.exec('PRAGMA busy_timeout=0');
    const checkpoint = db.prepare('PRAGMA main.wal_checkpoint(TRUNCATE)').get();
    result = {
      complete: checkpoint?.busy === 0 && (checkpoint.log === 0 || checkpoint.log === -1),
      busy: checkpoint?.busy === 1
    };
  } catch (error) {
    // SQLITE_BUSY (5) or SQLITE_LOCKED (6), including extended result codes.
    // Do not return/log SQL messages or database content through this helper.
    const primaryCode = Number.isInteger(error?.errcode) ? error.errcode & 255 : null;
    result = { complete: false, busy: primaryCode === 5 || primaryCode === 6 };
  } finally {
    if (Number.isInteger(previousTimeout) && previousTimeout >= 0 && previousTimeout <= 2147483647) {
      try { db.exec(`PRAGMA busy_timeout=${previousTimeout}`); }
      catch { result = { complete: false, busy: result.busy }; }
    }
  }
  return result;
}
