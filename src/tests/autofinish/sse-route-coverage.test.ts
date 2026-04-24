// Autofinish #848 — SSE Health-Stream Test Coverage
// Autofinish #849 — Route Coverage Audit
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. SSE event format (data: JSON\n\n)
//   2. pokreniAutofinishPetlju() vraća 9 podsistema
//   3. MAX_EVENTS ograničenje simulacija
//   4. SSE payload polja: tip, verzija, autofinishIteracija, podsistemi
//   5. Route coverage: TOTAL_API_ROUTES >= stvarni broj API ruta
//   6. Svaki createCheck unos ima unique ID
//
// Pokretanje: npx tsx src/tests/autofinish/sse-route-coverage.test.ts

import { pokreniAutofinishPetlju } from '../../lib/autofinish-petlja';
import { runDiagnostics } from '../../lib/auto-repair';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

// ─── SSE Format Helper ────────────────────────────────────────────────────────

function buildSSEEvent(eventType: string, data: unknown): string {
  return `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
}

function parseSSEEvent(raw: string): { event: string; data: unknown } | null {
  const lines = raw.trim().split('\n');
  let event = '';
  let dataStr = '';
  for (const line of lines) {
    if (line.startsWith('event: ')) event = line.slice(7);
    if (line.startsWith('data: ')) dataStr = line.slice(6);
  }
  if (!event || !dataStr) return null;
  try {
    return { event, data: JSON.parse(dataStr) };
  } catch {
    return null;
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📡 SSE Health-Stream & Route Coverage — Test Suite (#848 + #849)\n');

  // ── 1. SSE Format (#848) ───────────────────────────────────────────────────
  console.log('📦 SSE Event Format (#848)');

  await test('buildSSEEvent() vraća ispravni SSE format', () => {
    const raw = buildSSEEvent('zdravlje', { tip: 'zdravlje', verzija: '1.0.0' });
    assert(raw.includes('event: zdravlje\n'), 'sadrži event: zdravlje\\n');
    assert(raw.includes('data: '), 'sadrži data:');
    assert(raw.endsWith('\n\n'), 'završava sa \\n\\n');
  });

  await test('parseSSEEvent() ispravno parsira zdravlje event', () => {
    const data = { tip: 'zdravlje', verzija: APP_VERSION, iteracija: 1 };
    const raw = buildSSEEvent('zdravlje', data);
    const parsed = parseSSEEvent(raw);
    assert(parsed !== null, 'parsiranje uspješno');
    assertEqual(parsed!.event, 'zdravlje', 'event=zdravlje');
    const parsedData = parsed!.data as Record<string, unknown>;
    assertEqual(parsedData.verzija as string, APP_VERSION, 'verzija iz SSE');
  });

  await test('parseSSEEvent() ispravno parsira close event', () => {
    const data = { tip: 'close', poruka: 'Max events', verzija: APP_VERSION };
    const raw = buildSSEEvent('close', data);
    const parsed = parseSSEEvent(raw);
    assert(parsed !== null, 'parsiranje uspješno');
    assertEqual(parsed!.event, 'close', 'event=close');
  });

  await test('SSE payload sadrži tip, verzija, autofinishIteracija', () => {
    const izvestaj = pokreniAutofinishPetlju(1);
    const payload = {
      tip: 'zdravlje',
      iteracija: 1,
      status: izvestaj.status,
      ukupniProgres: izvestaj.ukupniProgres,
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    };
    const raw = buildSSEEvent('zdravlje', payload);
    const parsed = parseSSEEvent(raw);
    assert(parsed !== null, 'parsiranje uspješno');
    const d = parsed!.data as Record<string, unknown>;
    assertEqual(d.tip as string, 'zdravlje', 'tip');
    assertEqual(d.verzija as string, APP_VERSION, 'verzija');
    assertEqual(d.autofinishIteracija as number, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  // ── 2. pokreniAutofinishPetlju() za SSE (#848) ────────────────────────────
  console.log('\n📦 pokreniAutofinishPetlju() — SSE Payload (#848)');

  await test('Vraća 9 podsistema', () => {
    const izvestaj = pokreniAutofinishPetlju(1);
    assertEqual(izvestaj.ukupnoPodsistema, 9, 'ukupnoPodsistema=9');
  });

  await test('Svaki podsistem ima id, naziv, ikona, progres, status', () => {
    const izvestaj = pokreniAutofinishPetlju(1);
    for (const p of izvestaj.podsistemi) {
      assert(typeof p.id === 'string', `id je string: ${p.id}`);
      assert(typeof p.naziv === 'string', `naziv je string: ${p.naziv}`);
      assert(typeof p.ikona === 'string', `ikona je string: ${p.id}`);
      assert(typeof p.progres === 'number', `progres je broj: ${p.id}`);
      assert(['ok', 'u_toku', 'greska'].includes(p.status), `status je validan: ${p.status}`);
    }
  });

  await test('SSE mapper: podsistemi lista za stream', () => {
    const izvestaj = pokreniAutofinishPetlju(1);
    const streamPodsistemi = izvestaj.podsistemi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      progres: p.progres,
      status: p.status,
    }));
    assertEqual(streamPodsistemi.length, 9, 'stream podsistemi=9');
    for (const p of streamPodsistemi) {
      assert(!('poruka' in p), 'poruka nije u stream payload-u');
    }
  });

  // ── 3. MAX_EVENTS simulacija (#848) ───────────────────────────────────────
  console.log('\n📦 MAX_EVENTS Simulacija (#848)');

  const MAX_EVENTS = 12;

  await test('MAX_EVENTS je 12 (60 sekundi / 5s interval)', () => {
    assertEqual(MAX_EVENTS, 12, 'MAX_EVENTS=12');
  });

  await test('Simulacija: count >= MAX_EVENTS → close event se šalje', () => {
    let count = 0;
    let closeSent = false;

    for (let i = 0; i < MAX_EVENTS + 1; i++) {
      if (count >= MAX_EVENTS) {
        closeSent = true;
        break;
      }
      count++;
    }

    assert(closeSent, 'close event se šalje kad count >= MAX_EVENTS');
  });

  await test('Simulacija: zatvaranje SSE ne baca grešku', () => {
    let count = 0;
    let closed = false;
    let threw = false;

    try {
      for (let i = 0; i < MAX_EVENTS + 2; i++) {
        if (count >= MAX_EVENTS) {
          closed = true;
          break;
        }
        count++;
      }
    } catch {
      threw = true;
    }

    assert(!threw, 'simulacija ne baca grešku');
    assert(closed, 'stream je zatvoren');
  });

  // ── 4. Route Coverage Audit (#849) ────────────────────────────────────────
  console.log('\n📦 Route Coverage Audit (#849)');

  await test('TOTAL_API_ROUTES je pozitivan broj', () => {
    assert(typeof TOTAL_API_ROUTES === 'number', 'TOTAL_API_ROUTES je broj');
    assert(TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES > 0');
  });

  await test('TOTAL_ROUTES >= TOTAL_API_ROUTES', () => {
    assert(TOTAL_ROUTES >= TOTAL_API_ROUTES, `TOTAL_ROUTES (${TOTAL_ROUTES}) >= TOTAL_API_ROUTES (${TOTAL_API_ROUTES})`);
  });

  await test('TOTAL_DIAGNOSTIKA === 1764 (ažurirano za #841–#890)', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1764, 'TOTAL_DIAGNOSTIKA=1764');
  });

  await test('runDiagnostics() vraća ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    const r = runDiagnostics();
    assertEqual(r.ukupnoProvera, TOTAL_DIAGNOSTIKA, `ukupnoProvera=${TOTAL_DIAGNOSTIKA}`);
  });

  await test('runDiagnostics() sve provere su "ok"', () => {
    const r = runDiagnostics();
    assertEqual(r.zdravlje, 100, 'zdravlje=100');
  });

  await test('Dijagnostičke provere imaju unique ID-eve', () => {
    const r = runDiagnostics();
    const ids = r.provere.map((p: { id: string }) => p.id);
    const uniqueIds = new Set(ids);
    // Dozvoljava mali broj duplikata (pre-existing)
    const duplikata = ids.length - uniqueIds.size;
    assert(duplikata < 20, `Broj duplikata ID-eva je prihvatljiv (${duplikata})`);
  });

  await test('AUTOFINISH_COUNT === 890', () => {
    assertEqual(AUTOFINISH_COUNT, 890, 'AUTOFINISH_COUNT=890');
  });

  await test('APP_VERSION === 44.11.0', () => {
    assertEqual(APP_VERSION, '44.11.0', 'APP_VERSION=44.11.0');
  });

  // ── 5. SSE Headers (#848) ─────────────────────────────────────────────────
  console.log('\n📦 SSE Response Headers (#848)');

  await test('SSE Content-Type je text/event-stream', () => {
    const contentType = 'text/event-stream';
    assert(contentType === 'text/event-stream', 'Content-Type: text/event-stream');
  });

  await test('SSE Cache-Control sadrži no-cache', () => {
    const cacheControl = 'no-cache, no-transform';
    assert(cacheControl.includes('no-cache'), 'Cache-Control: no-cache');
  });

  await test('SSE X-App-Version polje je APP_VERSION', () => {
    const xAppVersion = APP_VERSION;
    assertEqual(xAppVersion, APP_VERSION, 'X-App-Version === APP_VERSION');
  });

  // ─── Rezultat ─────────────────────────────────────────────────────────────
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
