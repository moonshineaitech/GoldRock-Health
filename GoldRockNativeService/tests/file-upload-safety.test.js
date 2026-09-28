import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { readJson } from '../server/security.js';

function request(contentType, body, headers = {}) {
  const stream = Readable.from([Buffer.from(body)]);
  stream.headers = { 'content-type': contentType, ...headers };
  return stream;
}

test('original document upload formats are rejected at the JSON boundary', async () => {
  for (const contentType of ['multipart/form-data; boundary=example', 'application/pdf', 'image/png', 'application/octet-stream']) {
    await assert.rejects(readJson(request(contentType, '%PDF-1.7')), { status: 415, code: 'JSON_REQUIRED' });
  }
});

test('declared and streamed body limits both reject oversized payloads', async () => {
  await assert.rejects(readJson(request('application/json', '{}', { 'content-length': '9999' }), 128), { status: 413, code: 'REQUEST_TOO_LARGE' });
  await assert.rejects(readJson(request('application/json', JSON.stringify({ text: 'x'.repeat(129) })), 128), { status: 413, code: 'REQUEST_TOO_LARGE' });
});

test('the boundary accepts only a structured JSON object', async () => {
  assert.deepEqual(await readJson(request('application/json', '{"facts":{"documentType":"bill"}}')), { facts: { documentType: 'bill' } });
  await assert.rejects(readJson(request('application/json', '[1,2,3]')), { status: 400, code: 'INVALID_JSON' });
  await assert.rejects(readJson(request('application/json', '{broken')), { status: 400, code: 'INVALID_JSON' });
});
