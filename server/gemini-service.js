'use strict';

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

class GeminiHttpError extends Error {
  constructor(status, message, retryAfterMs) {
    super(message);
    this.name = 'GeminiHttpError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

class GeminiTimeoutError extends Error {
  constructor(timeoutMs) {
    super(`Gemini request timed out after ${timeoutMs}ms.`);
    this.name = 'GeminiTimeoutError';
    this.code = 'ETIMEDOUT';
  }
}

function positiveInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function readConfig(env = process.env) {
  return {
    apiKey: env.GEMINI_API_KEY || '',
    model: env.GEMINI_MODEL || 'gemini-3.8-flash',
    fallbackModel: env.GEMINI_FALLBACK_MODEL || 'gemini-3.6-flash',
    maxRetries: positiveInteger(env.GEMINI_MAX_RETRIES, 5, 0, 10),
    initialDelayMs: positiveInteger(env.GEMINI_INITIAL_DELAY, 2000, 1, 120000),
    timeoutMs: positiveInteger(env.GEMINI_TIMEOUT, 60000, 1000, 300000)
  };
}

function retryAfterMs(headers) {
  const value = headers?.get?.('retry-after');
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason || new Error('Aborted'));
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(signal.reason || new Error('Aborted'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function formatLog(model, attempt, totalAttempts, status, retryMs, elapsedMs) {
  return [
    '[Gemini]',
    `Model.............: ${model}`,
    `Attempt...........: ${attempt}/${totalAttempts}`,
    `HTTP Status.......: ${status}`,
    `Retry in..........: ${retryMs}${typeof retryMs === 'number' ? ' ms' : ''}`,
    `Elapsed...........: ${(elapsedMs / 1000).toFixed(1)} s`
  ].join('\n');
}

class GeminiService {
  constructor(options = {}) {
    this.config = options.config || readConfig(options.env);
    this.fetch = options.fetch || globalThis.fetch;
    this.sleep = options.sleep || delay;
    this.random = options.random || Math.random;
    this.logger = options.logger || console;
    if (typeof this.fetch !== 'function') throw new Error('Node.js fetch is required for GeminiService.');
  }

  async request(model, prompt, generationConfig) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const modelConfig = { ...generationConfig };
    if (modelConfig.thinkingConfig === undefined) {
      if (/^gemini-3\./i.test(model)) modelConfig.thinkingConfig = { thinkingLevel: 'low' };
      else if (/^gemini-2\.5-flash$/i.test(model)) modelConfig.thinkingConfig = { thinkingBudget: 0 };
    }
    try {
      const response = await this.fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(this.config.apiKey)}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: modelConfig })
        }
      );
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        if (response.ok) throw new Error('Gemini returned a successful response with invalid JSON.', { cause: parseError });
        result = { error: { message: 'Gemini returned an error response with an unreadable body.' } };
      }
      if (!response.ok) {
        throw new GeminiHttpError(response.status, result.error?.message || `Gemini API returned HTTP ${response.status}.`, retryAfterMs(response.headers));
      }
      return result;
    } catch (error) {
      if (controller.signal.aborted || error?.name === 'AbortError') throw new GeminiTimeoutError(this.config.timeoutMs);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async generateContent(prompt, generationConfig = {}) {
    if (!this.config.apiKey) throw new Error('GEMINI_API_KEY is not configured.');
    const models = [this.config.model];
    if (this.config.fallbackModel && this.config.fallbackModel !== this.config.model) models.push(this.config.fallbackModel);
    let lastError;
    let totalAttemptsMade = 0;
    const startedAt = Date.now();

    for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
      const model = models[modelIndex];
      const isFallback = modelIndex > 0;
      const attempts = this.config.maxRetries + 1;
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        totalAttemptsMade += 1;
        const requestStartedAt = Date.now();
        try {
          const result = await this.request(model, prompt, generationConfig);
          this.logger.info([
            '[Gemini]',
            `Model.............: ${model}`,
            `Attempts..........: ${totalAttemptsMade}`,
            `Elapsed...........: ${((Date.now() - startedAt) / 1000).toFixed(1)} s`,
            `Fallback..........: ${isFallback ? 'YES' : 'NO'}`
          ].join('\n'));
          return { result, model, attempts: totalAttemptsMade, fallback: isFallback };
        } catch (error) {
          lastError = error;
          const retryable = error instanceof GeminiTimeoutError || (error instanceof GeminiHttpError && RETRYABLE_STATUS_CODES.has(error.status));
          if (!retryable) throw error;
          if (attempt >= attempts) {
            this.logger.error(formatLog(model, attempt, attempts, error instanceof GeminiHttpError ? error.status : 'TIMEOUT', '0 ms (model exhausted)', Date.now() - requestStartedAt));
            break;
          }
          const exponentialMs = this.config.initialDelayMs * (2 ** (attempt - 1));
          const jitterMs = Math.floor(exponentialMs * (0.1 + this.random() * 0.2));
          const retryMs = error instanceof GeminiHttpError && error.retryAfterMs !== undefined ? error.retryAfterMs : exponentialMs + jitterMs;
          this.logger.warn(formatLog(model, attempt, attempts, error instanceof GeminiHttpError ? error.status : 'TIMEOUT', retryMs, Date.now() - requestStartedAt));
          await this.sleep(retryMs);
        }
      }
      if (modelIndex < models.length - 1) {
        this.logger.warn(`[Gemini] ${model} exhausted ${attempts} attempts; switching to fallback model ${models[modelIndex + 1]}.`);
      }
    }

    this.logger.error(`[Gemini] Generation failed after ${totalAttemptsMade} requests in ${((Date.now() - startedAt) / 1000).toFixed(1)} s. Last HTTP status: ${lastError?.status || lastError?.code || 'unknown'}. ${lastError?.message || 'unknown error'}`);
    throw lastError || new Error('Gemini generation failed.');
  }
}

module.exports = { GeminiService, GeminiHttpError, GeminiTimeoutError, readConfig, RETRYABLE_STATUS_CODES };
