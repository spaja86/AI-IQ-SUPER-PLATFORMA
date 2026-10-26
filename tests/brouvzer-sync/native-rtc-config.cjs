'use strict';
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { isIP } = require('node:net');

class ConfigError extends Error {
  constructor(code) { super(code); this.code = code; }
}
const fail = code => { throw new ConfigError(code); };
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function keys(value, allowed) {
  if (!object(value) || Object.keys(value).some(key => !allowed.includes(key))) fail('invalid-config');
}
function choice(value, allowed, fallback) {
  if (value === undefined) return fallback;
  if (!allowed.includes(value)) fail('invalid-config');
  return value;
}
function validateUrl(url) {
  if (typeof url !== 'string' || url.length > 512) fail('invalid-ice-url');
  const match = /^(stun|stuns|turn|turns):([^/?#@\s]+)(\?transport=(udp|tcp))?$/.exec(url);
  if (!match || (match[1].startsWith('stun') && match[3])) fail('invalid-ice-url');
  const authority = /^(\[[0-9a-fA-F:]+\]|[a-zA-Z0-9.-]+)(?::([0-9]{1,5}))?$/.exec(match[2]);
  if (!authority) fail('invalid-ice-url');
  const host = authority[1];
  if (host.startsWith('[') ? isIP(host.slice(1, -1)) !== 6 :
    !host.split('.').every(label => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label))) fail('invalid-ice-url');
  if (authority[2] && (+authority[2] < 1 || +authority[2] > 65535)) fail('invalid-ice-url');
  return match[1];
}

// URLs and credentials exist only in the private config/in-memory RTCConfiguration.
// Approval is bound to the exact file bytes; an ambient flag cannot approve edits.
function parseConfig(text, env = {}) {
  if (Buffer.byteLength(text) > 16384) fail('config-too-large');
  let input;
  try { input = JSON.parse(text); } catch { fail('invalid-json'); }
  keys(input, ['version', 'iceServers', 'iceTransportPolicy', 'browserProfile', 'pageOrigin', 'headless', 'scenario', 'timeouts']);
  if (input.version !== undefined && input.version !== 1) fail('invalid-config');
  const servers = input.iceServers === undefined ? [] : input.iceServers;
  if (!Array.isArray(servers) || servers.length > 4) fail('invalid-config');
  if (servers.length && env.BROUVZER_RTC_APPROVED_CONFIG_SHA256 !== createHash('sha256').update(text).digest('hex')) fail('ice-config-not-approved');
  const schemes = new Set();
  const iceServers = servers.map(server => {
    keys(server, ['urls', 'usernameEnv', 'credentialEnv']);
    const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
    if (!urls.length || urls.length > 4) fail('invalid-config');
    const kinds = urls.map(validateUrl); kinds.forEach(kind => schemes.add(kind));
    const result = { urls };
    if (kinds.some(kind => kind.startsWith('turn'))) {
      for (const [key, reference] of [['username', server.usernameEnv], ['credential', server.credentialEnv]]) {
        if (typeof reference !== 'string' || !/^BROUVZER_RTC_SECRET_[A-Z0-9_]{1,64}$/.test(reference)) fail('invalid-secret-reference');
        const value = env[reference];
        if (typeof value !== 'string' || !value.length || value.length > 2048 || /[\r\n\0]/.test(value)) fail('missing-test-credential');
        result[key] = value;
      }
    } else if (server.usernameEnv !== undefined || server.credentialEnv !== undefined) fail('invalid-secret-reference');
    return result;
  });
  const timeouts = { browserMs: 30000, operationMs: 6000, gatherMs: 6000, connectMs: 6000, transferMs: 2000, closeMs: 2000 };
  if (input.timeouts !== undefined) {
    keys(input.timeouts, Object.keys(timeouts));
    for (const [key, value] of Object.entries(input.timeouts)) {
      if (!Number.isInteger(value) || value < 100 || value > 30000) fail('invalid-timeout');
      timeouts[key] = value;
    }
  }
  const iceTransportPolicy = choice(input.iceTransportPolicy, ['all', 'relay'], 'all');
  const browserProfile = choice(input.browserProfile, ['default', 'loopback-test'], 'default');
  const pageOrigin = choice(input.pageOrigin, ['blank', 'loopback'], 'blank');
  const headless = choice(input.headless, [true, false], true);
  const scenario = choice(input.scenario, ['normal', 'withhold-answer'], 'normal');
  return {
    rtc: { iceServers, iceTransportPolicy }, timeouts, browserProfile, pageOrigin, headless, scenario,
    // Deliberately do not include paths, approval digest, URLs or secret env names.
    publicConfig: { iceServerCount: servers.length, schemes: [...schemes].sort(), iceTransportPolicy,
      externalIceApproved: servers.length > 0, browserProfile, pageOrigin, headless, scenario, timeouts }
  };
}
function loadConfig(env = process.env) {
  if (!env.BROUVZER_RTC_CONFIG) return parseConfig('{}', env);
  let text;
  try { text = readFileSync(env.BROUVZER_RTC_CONFIG, 'utf8'); } catch { fail('config-unreadable'); }
  return parseConfig(text, env);
}
function launchOptions(config, alternateArgs = []) {
  let args = alternateArgs.filter(arg => arg !== '--single-process');
  if (config.browserProfile === 'loopback-test') {
    const index = args.findIndex(arg => arg.startsWith('--disable-features='));
    if (index < 0) args.push('--disable-features=WebRtcHideLocalIpsWithMdns');
    else args[index] += ',WebRtcHideLocalIpsWithMdns';
    args.push('--allow-loopback-in-peer-connection');
  }
  return { headless: config.headless, args, timeout: config.timeouts.browserMs };
}
module.exports = { ConfigError, parseConfig, loadConfig, launchOptions };
