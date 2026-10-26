// Independent native WebRTC probe; same entrypoint, no SPAJA application imports.
'use strict';
const { loadConfig, launchOptions, ConfigError } = require('./native-rtc-config.cjs');
const { probe } = require('./native-rtc-probe.cjs');
const { createServer } = require('node:http');

async function bounded(fn, ms) {
  let timer;
  try { return await Promise.race([Promise.resolve().then(fn), new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('harness-timeout')), ms);
  })]); } finally { clearTimeout(timer); }
}
async function main() {
  let browser, context, originServer, report, stage = 'configuration', exitCode = 1;
  try {
    // Playwright protocol debug can print evaluate arguments containing credentials.
    // Fail before loading Playwright; never echo caller-controlled values.
    if (process.env.DEBUG || (process.env.PWDEBUG && process.env.PWDEBUG !== '0')) throw new ConfigError('debug-logging-disabled');
    const config = loadConfig();
    report = { schemaVersion: 1, nativeOnly: true, configuration: config.publicConfig };
    stage = 'browser-launch';
    const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
    const alternate = process.env.CHROMIUM_MODULE ? require(process.env.CHROMIUM_MODULE) : null;
    const options = launchOptions(config, alternate?.args || []);
    const executablePath = process.env.CHROMIUM_EXECUTABLE || (alternate ? await bounded(() => alternate.executablePath(), 15000) : undefined);
    if (executablePath) options.executablePath = executablePath;
    browser = await chromium.launch(options);
    const version = browser.version();
    report.browserVersion = /^\d+(?:\.\d+){1,3}$/.test(version) ? version : 'unreported';
    report.browserSource = alternate ? 'alternate-module' : (executablePath ? 'explicit-executable' : 'playwright-managed');
    stage = 'browser-context';
    context = await bounded(() => browser.newContext(), config.timeouts.browserMs);
    stage = 'browser-page';
    const page = await bounded(() => context.newPage(), config.timeouts.browserMs);
    if (config.pageOrigin === 'loopback') {
      stage = 'loopback-origin';
      originServer = createServer((request, response) => {
        response.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'" });
        response.end('<!doctype html><title>Native synthetic RTC probe</title>');
      });
      await bounded(() => new Promise((resolve, reject) => {
        originServer.once('error', reject); originServer.listen(0, '127.0.0.1', resolve);
      }), config.timeouts.browserMs);
      await page.goto(`http://127.0.0.1:${originServer.address().port}`, { timeout: config.timeouts.browserMs });
    }
    // Both page origins contain no SPAJA code, signaling, storage or real user data.
    stage = 'native-probe';
    const t = config.timeouts;
    const budget = 8 * t.operationMs + 2 * t.gatherMs + t.connectMs + t.transferMs + 2 * t.closeMs + 5000;
    const result = await bounded(() => page.evaluate(probe, {
      rtc: config.rtc, timeouts: config.timeouts, scenario: config.scenario
    }), budget);
    report = { ...report, ...result };
    exitCode = result.outcome === 'native-transfer-verified' && result.channelOpen && result.transferVerified &&
      result.channelCloseHandshake && result.cleanup.verified ? 0 : 2;
  } catch (error) {
    report = { ...report, nativeOnly: true, outcome: 'harness-error', stage,
      errorCode: error instanceof ConfigError ? error.code : 'runtime-failed-or-timed-out',
      timedOut: error?.message === 'harness-timeout' || error?.name === 'TimeoutError' };
    exitCode = 1;
  } finally {
    let contextClosed = !context, browserClosed = !browser, originServerClosed = !originServer;
    try { if (context) { await bounded(() => context.close(), 5000); contextClosed = true; } } catch { /* no raw message */ }
    try { if (browser) { await bounded(() => browser.close(), 5000); browserClosed = true; } } catch { /* no raw message */ }
    try { if (originServer) {
      originServer.closeAllConnections();
      await bounded(() => new Promise((resolve, reject) => originServer.close(error => error ? reject(error) : resolve())), 5000);
      originServerClosed = true;
    } } catch { /* no raw message */ }
    report.harnessCleanup = { contextClosed, browserClosed, originServerClosed };
    if (!contextClosed || !browserClosed || !originServerClosed) exitCode = 1;
  }
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = exitCode;
}
if (require.main === module) main().catch(() => {
  console.error(JSON.stringify({ outcome: 'harness-error', errorCode: 'unhandled-harness-failure' }));
  process.exitCode = 1;
});
module.exports = { main };
