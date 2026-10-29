// Test tooling only. No application, ICE configuration or user data is imported.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export class HarnessError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function timeoutFromEnv(env = process.env) {
  const value = env.BROUVZER_BROWSER_STEP_TIMEOUT_MS;
  if (value === undefined) return 30000;
  if (!/^[0-9]+$/.test(value) || +value < 1000 || +value > 60000) throw new HarnessError('invalid-step-timeout');
  return +value;
}
export async function bounded(fn, ms) {
  let timer;
  try {
    return await Promise.race([Promise.resolve().then(fn), new Promise((_, reject) => {
      timer = setTimeout(() => reject(new HarnessError('stage-timeout')), ms);
    })]);
  } finally { clearTimeout(timer); }
}
export function failureCode(error) {
  if (error instanceof HarnessError) return error.code;
  if (error?.name === 'TimeoutError') return 'stage-timeout';
  if (error?.code === 'ERR_ASSERTION') return 'assertion-failed';
  return 'runtime-error';
}

export class BrowserHarness {
  constructor(suite, env = process.env) {
    this.env = env; this.timeout = timeoutFromEnv(env); this.resources = [];
    this.report = { suite, outcome: 'not-started', phase: 'setup', completed: [],
      pageErrors: 0, cleanup: [], rtcTransfer: 'not-confirmed', externalIceUsed: false };
  }
  async step(phase, fn) {
    // Labels are code constants; reject text which could be a URL, payload or path.
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(phase)) throw new HarnessError('invalid-stage-label');
    this.report.phase = phase;
    if (this.env.BROUVZER_BROWSER_PROGRESS === '1') process.stderr.write(JSON.stringify({ phase }) + '\n');
    return bounded(fn, this.timeout);
  }
  passed(name) { this.report.completed.push(name); }
  track(kind, dispose) {
    if (!['browser', 'context', 'server', 'profile'].includes(kind)) throw new HarnessError('invalid-resource-kind');
    const resource = { kind, closed: false, dispose }; this.resources.push(resource);
    return async () => { await bounded(dispose, this.timeout); resource.closed = true; };
  }
  observe(page) {
    page.setDefaultTimeout(this.timeout);
    page.setDefaultNavigationTimeout(this.timeout);
    page.on('pageerror', () => { this.report.pageErrors++; });
  }
  async cleanup() {
    for (const resource of [...this.resources].reverse()) {
      if (!resource.closed) {
        if (this.env.BROUVZER_BROWSER_PROGRESS === '1') process.stderr.write(JSON.stringify({ phase: 'cleanup-' + resource.kind }) + '\n');
        try { await bounded(resource.dispose, this.timeout); resource.closed = true; }
        catch (error) { resource.errorCode = failureCode(error); }
      }
    }
    this.report.cleanup = this.resources.map(({ kind, closed, errorCode }) => ({ kind, closed, ...(errorCode ? { errorCode } : {}) }));
    return this.resources.every(resource => resource.closed);
  }
  async tooling({ rtc = false } = {}) {
    if (this.env.DEBUG || (this.env.PWDEBUG && this.env.PWDEBUG !== '0')) throw new HarnessError('debug-logging-disabled');
    return this.step('load-tooling', async () => {
      const { chromium } = require(this.env.PLAYWRIGHT_MODULE || 'playwright');
      const alternate = this.env.CHROMIUM_MODULE ? require(this.env.CHROMIUM_MODULE) : null;
      const args = (alternate?.args || []).filter(arg => arg !== '--single-process');
      // Preserve the existing application RTC runner's test profile. No ICE servers added.
      if (rtc && alternate) {
        const index = args.findIndex(arg => arg.startsWith('--disable-features='));
        if (index < 0) args.push('--disable-features=WebRtcHideLocalIpsWithMdns');
        else args[index] += ',WebRtcHideLocalIpsWithMdns';
        args.push('--allow-loopback-in-peer-connection');
      }
      const executablePath = this.env.CHROMIUM_EXECUTABLE || (alternate ? await alternate.executablePath() : undefined);
      return { chromium, options: { headless: true, timeout: this.timeout, args, ...(executablePath ? { executablePath } : {}) } };
    });
  }
}

export async function runSuite(suite, expected, fn) {
  let harness, code = 1;
  try {
    harness = new BrowserHarness(suite);
    await fn(harness);
    if (harness.report.completed.length !== expected || harness.report.pageErrors !== 0) throw new HarnessError('incomplete-or-page-errors');
    harness.report.outcome = 'passed'; code = 0;
  } catch (error) {
    if (!harness) {
      console.log(JSON.stringify({ suite, outcome: 'failed', phase: 'setup', errorCode: failureCode(error) }));
      process.exitCode = 1; return;
    }
    harness.report.outcome = 'failed'; harness.report.errorCode = failureCode(error);
  } finally {
    if (harness) {
      const cleaned = await harness.cleanup();
      if (!cleaned) {
        if (harness.report.outcome === 'passed') {
          harness.report.phase = 'cleanup-' + harness.report.cleanup.find(resource => !resource.closed).kind;
          harness.report.errorCode = 'cleanup-failed';
        }
        harness.report.outcome = 'failed'; harness.report.cleanupFailed = true; code = 1;
      }
      console.log(JSON.stringify({ ...harness.report, expected, passed: harness.report.completed.length, notCompleted: expected - harness.report.completed.length }, null, 2));
      process.exitCode = code;
    }
  }
}
