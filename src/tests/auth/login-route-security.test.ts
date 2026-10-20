import assert from 'node:assert/strict';
import { beforeEach, afterEach, test, type TestContext } from 'node:test';
import { createHmac } from 'node:crypto';
import { NextRequest } from 'next/server';
import { POST } from '../../app/api/auth/login/route';
import { POST as legacyPOST } from '../../app/api/login/route';
import { middleware } from '../../../middleware';
import { ΩAuthProvider, storeTOTPSecret } from '../../lib/auth/omega-auth';
import { getGlobalVault } from '../../lib/auth/omega-identity';
import { ΩCryptoEngine } from '../../lib/auth/omega-crypto';
import { getLoginClientIP } from '../../lib/auth/login-protection';
import { ΩAuditLogger } from '../../middleware/omega-audit';

const envNames = ['OMEGA_LOGIN_TRUSTED_PROXY_HOPS', 'KV_REST_API_URL', 'KV_REST_API_TOKEN',
  'VERCEL_KV_REST_API_URL', 'VERCEL_KV_REST_API_TOKEN'] as const;
let savedEnv: Record<string, string | undefined>;
beforeEach(() => {
  savedEnv = Object.fromEntries(envNames.map((key) => [key, process.env[key]]));
  for (const key of envNames) delete process.env[key];
});
afterEach(() => {
  for (const key of envNames) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

const routes = [
  { path: '/api/auth/login', post: POST, errorKey: 'error' },
  { path: '/api/login', post: legacyPOST, errorKey: 'greska' },
];
let sequence = 0;
function email() { return `login-parity-${++sequence}@example.test`; }
function request(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}
function watchTokens(t: TestContext) {
  const access = t.mock.method(ΩAuthProvider, 'issueToken');
  const refresh = t.mock.method(ΩAuthProvider, 'issueRefreshToken');
  return () => {
    assert.equal(access.mock.callCount(), 0, 'must not issue access tokens');
    assert.equal(refresh.mock.callCount(), 0, 'must not issue refresh tokens');
  };
}
async function rejected(response: Response, status: number, errorKey: string) {
  assert.equal(response.status, status);
  const body = await response.json();
  assert.equal(typeof body[errorKey], 'string');
  for (const field of ['token', 'refreshToken', 'identity', 'sesija']) assert.equal(body[field], undefined);
  assert.equal(response.headers.get('set-cookie'), null);
}
async function account(mfa = false) {
  const credentials = { email: email(), password: 'Regression-only-password!42' };
  const registered = await ΩAuthProvider.register(credentials);
  assert.ok(registered);
  const secret = ΩCryptoEngine.generateTOTPSecret();
  if (mfa) {
    getGlobalVault().storeIdentity({ ...registered.identity, mfaEnabled: true });
    storeTOTPSecret(registered.identity.id, secret);
  }
  return { ...credentials, secret, id: registered.identity.id };
}
function totp(secret: string) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30_000)));
  const digest = createHmac('sha1', Buffer.from(secret, 'base64')).update(counter).digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

for (const [index, credentials] of [
  { oauthProvider: 'github', oauthCode: 'unverified-code' },
  { oauthProvider: 'google', oauthCode: 'unverified-code' },
  { password: '', oauthCode: 'unverified-code' },
  { password: '   ', oauthCode: 'unverified-code' },
  { password: 12345678, oauthCode: 'unverified-code' },
].entries()) {
  test(`password login rejects unverified OAuth input ${index + 1}`, async () => {
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${index + 1}` },
      body: JSON.stringify({ email: 'security-regression@example.test', ...credentials }),
    });
    const response = await POST(request);
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(typeof body.error, 'string');
    assert.equal(body.token, undefined);
    assert.equal(body.identity, undefined);
    assert.equal(response.headers.get('set-cookie'), null);
  });
}

for (const route of routes) {
  test(`${route.path}: five failures block the sixth before provider/token issuance`, async (t) => {
    const user = await account();
    const noTokens = watchTokens(t);
    const login = t.mock.method(ΩAuthProvider, 'login');
    for (let i = 0; i < 6; i++) {
      const req = request(route.path, { email: user.email, password: 'Wrong-password!42' }, {
        'x-forwarded-for': `192.0.2.${i + 20}`, 'x-real-ip': `198.51.100.${i + 20}`,
        authorization: 'Bearer unverified',
      });
      assert.equal((await middleware(req)).status, 200, 'general limiter does not replace login protection');
      await rejected(await route.post(req), i < 5 ? 401 : 429, route.errorKey);
    }
    assert.equal(login.mock.callCount(), 5);
    noTokens();
  });

  test(`${route.path}: successful login resets failures and retains response/cookie contract`, async () => {
    const user = await account();
    for (let cycle = 0; cycle < 2; cycle++) {
      for (let i = 0; i < 4; i++) {
        await rejected(await route.post(request(route.path, { email: user.email, password: 'Wrong-password!42' })), 401, route.errorKey);
      }
      const response = await route.post(request(route.path, user));
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.identity.id, user.id);
      assert.equal(body.token.type, 'ACCESS');
      assert.ok(body.pretplata);
      assert.ok(body.pristup);
      assert.ok(body.industrijaPristup);
      assert.ok(body.gamingPristup);
      assert.equal((await ΩAuthProvider.verifyIdentity(body.token.value))?.id, user.id);
      const cookie = response.headers.get('set-cookie')!;
      assert.match(cookie, /omega-refresh=/);
      assert.match(cookie, /HttpOnly/i);
      assert.match(cookie, /SameSite=Strict/i);
      assert.match(cookie, /Path=\/api\/auth/);
      assert.match(cookie, /Max-Age=2592000/);
      if (route.path === '/api/login') {
        assert.equal(body.uspesno, true);
        assert.equal(body.sesija.token, body.token.value);
        assert.equal(body.sesija.email, user.email);
        assert.equal(body.digitalniKompjuter.aktiviran, true);
      }
    }
  });

  test(`${route.path}: missing/invalid MFA counts as failure, valid MFA cannot bypass a block`, async (t) => {
    const user = await account(true);
    const noTokens = watchTokens(t);
    for (let i = 0; i < 5; i++) {
      await rejected(await route.post(request(route.path, {
        ...user, totpCode: i % 2 ? 'invalid-totp' : undefined,
      })), 401, route.errorKey);
    }
    const login = t.mock.method(ΩAuthProvider, 'login');
    await rejected(await route.post(request(route.path, { ...user, totpCode: totp(user.secret) })), 429, route.errorKey);
    assert.equal(login.mock.callCount(), 0);
    noTokens();
  });

  test(`${route.path}: correct password and real TOTP authenticate`, async () => {
    const user = await account(true);
    const response = await route.post(request(route.path, { ...user, totpCode: totp(user.secret) }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).identity.id, user.id);
  });

  test(`${route.path}: wrong password plus valid TOTP and OAuth code never issues tokens`, async (t) => {
    const user = await account(true);
    const noTokens = watchTokens(t);
    await rejected(await route.post(request(route.path, {
      ...user, password: 'Wrong-password!42', totpCode: totp(user.secret), oauthCode: 'unverified',
    })), 401, route.errorKey);
    noTokens();
  });

  test(`${route.path}: invalid JSON, null, wrong credential types and MFA types return 400`, async (t) => {
    const noTokens = watchTokens(t);
    for (const body of [null, [], {}, { email: 123, password: 'Long-enough!42' },
      { email: email(), password: 12345678 }, { email: email(), password: '        ' },
      { email: email(), password: 'Long-enough!42', totpCode: 123456 },
      { email: email(), oauthCode: 'unverified-code' }]) {
      await rejected(await route.post(request(route.path, body)), 400, route.errorKey);
    }
    await rejected(await route.post(new NextRequest(`http://localhost${route.path}`, {
      method: 'POST', body: '{',
    })), 400, route.errorKey);
    noTokens();
  });
}

test('both routes share normalized account failures despite header/endpoint rotation', async (t) => {
  const address = email();
  const noTokens = watchTokens(t);
  for (let i = 0; i < 6; i++) {
    const route = routes[i % 2];
    await rejected(await route.post(request(route.path, {
      email: i % 2 ? ` ${address.toUpperCase()} ` : address, password: 'Wrong-password!42',
    }, { 'x-forwarded-for': `203.0.113.${i + 1}` })), i < 5 ? 401 : 429, route.errorKey);
  }
  noTokens();
});

test('unknown IP does not put unrelated accounts in a shared lockout bucket', async () => {
  const address = email();
  for (let i = 0; i < 5; i++) await legacyPOST(request('/api/login', { email: address, password: 'Wrong-password!42' }));
  const user = await account();
  assert.equal((await POST(request('/api/auth/login', user))).status, 200);
});

test('legacy lozinka alias and normalized email still authenticate, including MFA', async () => {
  const user = await account(true);
  const response = await legacyPOST(request('/api/login', {
    email: ` ${user.email.toUpperCase()} `, lozinka: user.password, totpCode: totp(user.secret),
  }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.sesija.email, user.email);
  assert.equal(body.sesija.token, body.token.value);
});

test('fifteenth-minute expiry permits a new five-attempt cycle', async (t) => {
  let now = Date.now();
  t.mock.method(Date, 'now', () => now);
  const address = email();
  const req = () => request('/api/login', { email: address, password: 'Wrong-password!42' });
  for (let i = 0; i < 5; i++) await rejected(await legacyPOST(req()), 401, 'greska');
  now += 15 * 60_000 - 1;
  await rejected(await legacyPOST(req()), 429, 'greska');
  now += 1;
  for (let i = 0; i < 5; i++) await rejected(await legacyPOST(req()), 401, 'greska');
  await rejected(await legacyPOST(req()), 429, 'greska');
});

test('configured proxy: use the trusted suffix, never a forged leftmost address', async (t) => {
  process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = '2';
  const noTokens = watchTokens(t);
  for (let i = 0; i < 6; i++) {
    const route = routes[i % 2];
    await rejected(await route.post(request(route.path, { email: email(), password: 'Wrong-password!42' }, {
      'x-forwarded-for': `198.51.100.${i}, 203.0.113.90, 192.0.2.1`,
    })), i < 5 ? 401 : 429, route.errorKey);
  }
  noTokens();
});

test('untrusted, absent, malformed and incomplete proxy headers never become a trusted IP', () => {
  const headers = new Headers({ 'x-forwarded-for': '203.0.113.92', 'x-real-ip': '203.0.113.93' });
  assert.equal(getLoginClientIP(headers), null);
  for (const configuration of ['', '0', '-1', 'true', '1.5', '01', '17', 'Infinity']) {
    process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = configuration;
    assert.equal(getLoginClientIP(headers), null);
  }
  process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = '1';
  for (const value of ['', 'garbage', '999.1.1.1', '203.0.113.1:123', '[2001:db8::1]',
    '2001:db8::1%eth0', '192.0.2.1, ', 'a'.repeat(2049), Array(33).fill('192.0.2.1').join(',')]) {
    assert.equal(getLoginClientIP(new Headers({ 'x-forwarded-for': value, 'x-real-ip': '203.0.113.93' })), null);
  }
  assert.equal(getLoginClientIP(new Headers({ 'x-real-ip': '203.0.113.93' })), null);
  process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = '2';
  assert.equal(getLoginClientIP(headers), null, 'shorter-than-configured chain is untrusted');
});

test('trusted IPv6 and IPv4-mapped spellings are canonicalized', () => {
  process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = '1';
  for (const [input, expected] of [
    ['2001:0DB8:0000:0000:0000:0000:0000:0001', '2001:db8::1'],
    ['2001:db8::1', '2001:db8::1'], ['::FFFF:203.0.113.95', '203.0.113.95'],
    ['::ffff:cb00:715f', '203.0.113.95'], ['203.0.113.95', '203.0.113.95'],
  ]) assert.equal(getLoginClientIP(new Headers({ 'x-forwarded-for': input })), expected);
});

test('valid proxy configuration with malformed headers still blocks account/header rotation', async (t) => {
  process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = '2';
  const address = email();
  const noTokens = watchTokens(t);
  const forwarded = ['', 'garbage', '999.1.1.1', '192.0.2.1', 'garbage, 192.0.2.1', ''];
  for (let i = 0; i < forwarded.length; i++) {
    const route = routes[i % 2];
    await rejected(await route.post(request(route.path, { email: address, password: 'Wrong-password!42' }, {
      'x-forwarded-for': forwarded[i], 'x-real-ip': `203.0.113.${i}`,
    })), i < 5 ? 401 : 429, route.errorKey);
  }
  noTokens();
});

test('trusted IP changes cannot reset the account counter', async () => {
  process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS = '1';
  const address = email();
  for (let i = 0; i < 6; i++) {
    const route = routes[i % 2];
    await rejected(await route.post(request(route.path, { email: address, password: 'Wrong-password!42' }, {
      'x-forwarded-for': `198.51.100.${i + 150}`,
    })), i < 5 ? 401 : 429, route.errorKey);
  }
});

test('audit records failures and blocks for both routes without trusting supplied IPs', async () => {
  for (const route of routes) {
    const address = email();
    const before = new Set(ΩAuditLogger.getRecentEvents(10_000).map((event) => event.id));
    for (let i = 0; i < 6; i++) await route.post(request(route.path, { email: address, password: 'Wrong-password!42' }, {
      'x-forwarded-for': '203.0.113.99', 'user-agent': 'login-regression-test',
    }));
    const events = ΩAuditLogger.getRecentEvents(10_000).filter((event) => !before.has(event.id));
    assert.equal(events.filter((event) => event.action === 'LOGIN_FAILED').length, 5);
    assert.equal(events.filter((event) => event.action === 'LOGIN_BLOCKED_BRUTE_FORCE').length, 1);
    for (const event of events) {
      assert.equal(event.resource, route.path);
      assert.equal(event.ip, 'unknown');
      assert.equal(event.outcome, 'DENIED');
      assert.equal(JSON.stringify(event).includes('Wrong-password!42'), false);
    }
  }
});

test('middleware in-memory limiter has actual 200/1000 thresholds and accepts an unverified Bearer prefix', async () => {
  for (const [ip, authorization, limit] of [
    ['192.0.2.220', '', 200], ['192.0.2.221', 'Bearer unverified', 1000],
  ] as const) {
    for (let i = 0; i < limit; i++) {
      assert.equal((await middleware(request('/api/login', {}, { 'x-forwarded-for': ip, authorization }))).status, 200);
    }
    const response = await middleware(request('/api/login', {}, { 'x-forwarded-for': ip, authorization }));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '60');
  }
});

test('middleware configured KV branch also counts requests, not failed authentication', async (t) => {
  process.env.KV_REST_API_URL = 'https://kv.example.test';
  process.env.KV_REST_API_TOKEN = 'test-only';
  const counts = new Map<string, number>();
  t.mock.method(globalThis, 'fetch', async (url: string | URL | Request) => {
    const key = String(url);
    if (key.includes('/expire/')) return Response.json({ result: 1 });
    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);
    return Response.json({ result: count });
  });
  for (let i = 0; i < 201; i++) {
    assert.equal((await middleware(request('/api/login', {}, { 'x-forwarded-for': '192.0.2.222' }))).status, i < 200 ? 200 : 429);
  }
});
