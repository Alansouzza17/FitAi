'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { GeminiService, GeminiHttpError, GeminiTimeoutError } = require('./gemini-service');

function response(status, body = {}, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: key => headers[key.toLowerCase()] || null },
    json: async () => body
  };
}

function makeService(fetch, overrides = {}) {
  const delays = [];
  const logs = [];
  const service = new GeminiService({
    config: {
      apiKey: 'test-key', model: 'gemini-primary', fallbackModel: 'gemini-fallback',
      maxRetries: 2, initialDelayMs: 2000, timeoutMs: 1000, ...overrides
    },
    fetch,
    sleep: async milliseconds => { delays.push(milliseconds); },
    random: () => 0,
    logger: { info: message => logs.push(message), warn: message => logs.push(message), error: message => logs.push(message) }
  });
  return { service, delays, logs };
}

test('returns successful Gemini response and logs model usage', async () => {
  const { service, logs } = makeService(async () => response(200, { candidates: [] }));
  const output = await service.generateContent('prompt');
  assert.equal(output.model, 'gemini-primary');
  assert.equal(output.fallback, false);
  assert.match(logs.at(-1), /Fallback..........: NO/);
});

test('recovers from 503 with exponential backoff', async () => {
  let calls = 0;
  const { service, delays } = makeService(async () => (++calls === 1 ? response(503, { error: { message: 'busy' } }) : response(200, { ok: true })), { maxRetries: 1 });
  await service.generateContent('prompt');
  assert.equal(calls, 2);
  assert.deepEqual(delays, [2200]);
});

test('throws after persistent 503 retries primary and fallback', async () => {
  let calls = 0;
  const { service } = makeService(async () => { calls += 1; return response(503, { error: { message: 'busy' } }); }, { maxRetries: 1 });
  await assert.rejects(service.generateContent('prompt'), error => error instanceof GeminiHttpError && error.status === 503);
  assert.equal(calls, 4);
});

test('uses fallback model after primary retries are exhausted', async () => {
  const models = [];
  const { service, logs } = makeService(async url => {
    models.push(decodeURIComponent(url.match(/models\/([^:]+)/)[1]));
    return models.at(-1) === 'gemini-primary' ? response(503) : response(200, { ok: true });
  }, { maxRetries: 1 });
  const output = await service.generateContent('prompt');
  assert.equal(output.model, 'gemini-fallback');
  assert.equal(output.fallback, true);
  assert.match(logs.at(-1), /Fallback..........: YES/);
  assert.deepEqual(models, ['gemini-primary', 'gemini-primary', 'gemini-fallback']);
});

test('retries timed out calls and releases timeout timers', async () => {
  let calls = 0;
  const { service } = makeService((_url, options) => new Promise((resolve, reject) => {
    calls += 1;
    const timer = setTimeout(() => resolve(response(200, { ok: true })), 20);
    options.signal.addEventListener('abort', () => {
      clearTimeout(timer);
      const error = new Error('aborted');
      error.name = 'AbortError';
      reject(error);
    }, { once: true });
  }), { timeoutMs: 5, maxRetries: 1, fallbackModel: '' });
  await assert.rejects(service.generateContent('prompt'), GeminiTimeoutError);
  assert.equal(calls, 2);
});

test('retries 429 and honors Retry-After', async () => {
  let calls = 0;
  const { service, delays } = makeService(async () => (++calls === 1 ? response(429, {}, { 'retry-after': '3' }) : response(200)), { maxRetries: 1 });
  await service.generateContent('prompt');
  assert.deepEqual(delays, [3000]);
});

test('retries 500 server errors', async () => {
  let calls = 0;
  const { service } = makeService(async () => (++calls === 1 ? response(500) : response(200)), { maxRetries: 1 });
  await service.generateContent('prompt');
  assert.equal(calls, 2);
});

for (const status of [502, 504]) {
  test(`retries ${status} gateway errors`, async () => {
    let calls = 0;
    const { service } = makeService(async () => (++calls === 1 ? response(status) : response(200)), { maxRetries: 1 });
    await service.generateContent('prompt');
    assert.equal(calls, 2);
  });
}
