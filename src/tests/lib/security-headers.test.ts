import {
  applySecurityHeaders,
  createSecurityHeaders,
  generateNonce,
  getCSPReportOnly,
  getSecurityHeaders,
} from '../../lib/security-headers';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🛡️ Security Headers Test Suite\n');

  await test('generateNonce vraća validan base64 nonce očekivane dužine', () => {
    const nonce = generateNonce();
    assertEqual(nonce.length, 24, 'nonce length');
    assert(/^[A-Za-z0-9+/]+={0,2}$/.test(nonce), 'nonce mora biti validan base64');
  });

  await test('generateNonce generiše različite vrednosti', () => {
    const n1 = generateNonce();
    const n2 = generateNonce();
    assert(n1 !== n2, 'nonce vrednosti moraju biti različite');
  });

  await test('getSecurityHeaders u ne-produkciji uključuje nonce i dev CSP direktive', () => {
    const result = getSecurityHeaders({ isProduction: false });
    assert(typeof result.nonce === 'string' && result.nonce.length > 0, 'nonce mora postojati');

    const csp = result.headers['Content-Security-Policy'];
    assert(typeof csp === 'string', 'CSP mora biti string');
    assert(csp.includes("script-src 'self'"), 'CSP mora sadržati script-src');
    assert(csp.includes("'unsafe-eval'"), 'dev CSP mora sadržati unsafe-eval');
    assert(csp.includes("'unsafe-inline'"), 'dev CSP mora sadržati unsafe-inline');
    assert(csp.includes(`'nonce-${result.nonce}'`), 'CSP mora sadržati nonce');

    assertEqual(result.headers['X-Frame-Options'], 'DENY', 'X-Frame-Options');
    assertEqual(result.headers['X-Content-Type-Options'], 'nosniff', 'X-Content-Type-Options');
    assertEqual(result.headers['Referrer-Policy'], 'strict-origin-when-cross-origin', 'Referrer-Policy');
    assert(!('Strict-Transport-Security' in result.headers), 'HSTS ne treba u non-prod modu');
  });

  await test('getSecurityHeaders bez nonce-a ne vraća nonce i CSP ga ne sadrži', () => {
    const result = getSecurityHeaders({ withNonce: false, isProduction: false });
    assert(result.nonce === undefined, 'nonce ne sme postojati');
    const csp = result.headers['Content-Security-Policy'];
    assert(!csp.includes('nonce-'), 'CSP ne sme sadržati nonce');
  });

  await test('getSecurityHeaders u produkciji uključuje HSTS i strict-dynamic CSP', () => {
    const result = getSecurityHeaders({ isProduction: true, withNonce: false });
    const csp = result.headers['Content-Security-Policy'];

    assert(csp.includes("'strict-dynamic'"), 'prod CSP mora sadržati strict-dynamic');
    assert(!csp.includes("'unsafe-eval'"), 'prod CSP ne sme sadržati unsafe-eval');
    assert(!csp.includes("'unsafe-inline' 'unsafe-eval'"), 'prod CSP ne sme imati dev script kombinaciju');

    assertEqual(
      result.headers['Strict-Transport-Security'],
      'max-age=63072000; includeSubDomains; preload',
      'HSTS',
    );
  });

  await test('getSecurityHeaders podržava custom frameAncestors i connectSrc', () => {
    const result = getSecurityHeaders({
      isProduction: false,
      withNonce: false,
      frameAncestors: ['https://partner1.example', 'https://partner2.example'],
      connectSrc: ['https://custom.example'],
    });

    const csp = result.headers['Content-Security-Policy'];
    assert(csp.includes('frame-ancestors https://partner1.example https://partner2.example'), 'custom frame-ancestors');
    assert(csp.includes('connect-src'), 'mora imati connect-src');
    assert(csp.includes('https://api.stripe.com'), 'mora zadržati stripe connect-src');
    assert(csp.includes('https://api.openai.com'), 'mora zadržati openai connect-src');
    assert(csp.includes('https://custom.example'), 'mora uključiti custom connect-src');
  });

  await test('applySecurityHeaders radi za Record target i vraća nonce', () => {
    const target: Record<string, string> = { Existing: 'value' };
    const nonce = applySecurityHeaders(target, { isProduction: false });

    assert(typeof nonce === 'string' && nonce.length > 0, 'nonce mora biti vraćen');
    assertEqual(target.Existing, 'value', 'postojeći header mora ostati');
    assert(typeof target['Content-Security-Policy'] === 'string', 'CSP mora biti postavljen');
  });

  await test('applySecurityHeaders radi za Headers target', () => {
    const headers = new Headers();
    const nonce = applySecurityHeaders(headers, { withNonce: false, isProduction: false });

    assertEqual(nonce, undefined, 'nonce treba biti undefined kada withNonce=false');
    assertEqual(headers.get('X-Frame-Options'), 'DENY', 'X-Frame-Options');
    assert(typeof headers.get('Content-Security-Policy') === 'string', 'CSP mora biti postavljen');
  });

  await test('createSecurityHeaders vraća Headers objekat sa očekivanim vrednostima', () => {
    const result = createSecurityHeaders({ withNonce: false, isProduction: true });
    assert(result.headers instanceof Headers, 'rezultat mora sadržati Headers instancu');
    assertEqual(result.nonce, undefined, 'nonce ne treba da postoji');
    assertEqual(
      result.headers.get('Strict-Transport-Security'),
      'max-age=63072000; includeSubDomains; preload',
      'HSTS',
    );
  });

  await test('getCSPReportOnly dodaje report-uri i poštuje withNonce opciju', () => {
    const withNonce = getCSPReportOnly('https://report.example/csp', { isProduction: false });
    assert(withNonce.includes('report-uri https://report.example/csp'), 'mora sadržati report-uri');
    assert(withNonce.includes('nonce-'), 'podrazumevano mora sadržati nonce');

    const withoutNonce = getCSPReportOnly('https://report.example/csp', {
      isProduction: false,
      withNonce: false,
    });
    assert(withoutNonce.includes('report-uri https://report.example/csp'), 'report-uri mora ostati');
    assert(!withoutNonce.includes('nonce-'), 'ne sme sadržati nonce kada withNonce=false');
  });

  console.log(`\n🧪 Security Headers: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
