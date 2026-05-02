// Autofinish #1114 — Unit testovi PodsistemiZdravljeWidget
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishPodsistemiZdravlje } from '../../lib/autofinish-petlja';
import type { AutofinishPodsistemZdravlje } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// ─── Simulacija PodsistemiZdravljeWidget logike ────────────────────────────────

function computeSummary(podsistemi: AutofinishPodsistemZdravlje[]) {
  const okCount      = podsistemi.filter((p) => p.status === 'ok').length;
  const warningCount = podsistemi.filter((p) => p.status === 'warning').length;
  const errorCount   = podsistemi.filter((p) => p.status === 'error' || p.status === 'critical').length;
  const avgZdravlje  = podsistemi.length > 0
    ? Math.round(podsistemi.reduce((s, p) => s + p.zdravlje, 0) / podsistemi.length)
    : 0;
  return { okCount, warningCount, errorCount, avgZdravlje };
}

function filterByStatus(
  podsistemi: AutofinishPodsistemZdravlje[],
  filter: AutofinishPodsistemZdravlje['status'] | 'svi',
) {
  return filter === 'svi' ? podsistemi : podsistemi.filter((p) => p.status === filter);
}

function healthBarWidth(zdravlje: number) {
  return Math.min(100, Math.max(0, zdravlje));
}

async function runTests(): Promise<void> {
  console.log('\n🏥 Unit testovi PodsistemiZdravljeWidget — Test Suite (#1114)\n');

  const result = getAutofinishPodsistemiZdravlje();
  const { podsistemi } = result;

  await test('verzija === APP_VERSION', () => {
    assertEqual(result.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(result.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO string', () => {
    assert(!isNaN(Date.parse(result.timestamp)), `timestamp ISO: ${result.timestamp}`);
  });

  await test('ukupnoPodsistema === podsistemi.length', () => {
    assertEqual(result.ukupnoPodsistema, podsistemi.length, 'ukupnoPodsistema=podsistemi.length');
  });

  // ─── Summary Widget logika ──────────────────────────────────────────────────

  const summary = computeSummary(podsistemi);

  await test('okCount + warningCount + errorCount = ukupnoPodsistema (ok+warning+error covers all)', () => {
    const zbir = summary.okCount + summary.warningCount + summary.errorCount;
    assertEqual(zbir, podsistemi.length, `okCount=${summary.okCount}+warningCount=${summary.warningCount}+errorCount=${summary.errorCount}=${zbir} != ${podsistemi.length}`);
  });

  await test('avgZdravlje je u opsegu 0–100', () => {
    assert(summary.avgZdravlje >= 0 && summary.avgZdravlje <= 100, `avgZdravlje=${summary.avgZdravlje}`);
  });

  await test('okCount >= 0', () => {
    assert(summary.okCount >= 0, `okCount: ${summary.okCount}`);
  });

  await test('warningCount >= 0', () => {
    assert(summary.warningCount >= 0, `warningCount: ${summary.warningCount}`);
  });

  await test('errorCount >= 0', () => {
    assert(summary.errorCount >= 0, `errorCount: ${summary.errorCount}`);
  });

  // ─── Filter logika ──────────────────────────────────────────────────────────

  await test('filterByStatus(ok) vraća samo ok podsisteme', () => {
    const filtered = filterByStatus(podsistemi, 'ok');
    for (const p of filtered) {
      assertEqual(p.status, 'ok', `filter ok: ${p.naziv} ima status ${p.status}`);
    }
  });

  await test('filterByStatus(svi) vraća sve podsisteme', () => {
    const filtered = filterByStatus(podsistemi, 'svi');
    assertEqual(filtered.length, podsistemi.length, 'filterByStatus svi');
  });

  await test('filterByStatus(ok).length === okCount', () => {
    const filtered = filterByStatus(podsistemi, 'ok');
    assertEqual(filtered.length, summary.okCount, `filterByStatus ok: ${filtered.length} != ${summary.okCount}`);
  });

  await test('filterByStatus(warning).length === warningCount', () => {
    const filtered = filterByStatus(podsistemi, 'warning');
    assertEqual(filtered.length, summary.warningCount, `filterByStatus warning: ${filtered.length} != ${summary.warningCount}`);
  });

  // ─── Health bar logika ──────────────────────────────────────────────────────

  await test('healthBarWidth je 0–100 za sve podsisteme', () => {
    for (const p of podsistemi) {
      const w = healthBarWidth(p.zdravlje);
      assert(w >= 0 && w <= 100, `healthBarWidth=${w} za ${p.naziv}`);
    }
  });

  await test('healthBarWidth za zdravlje=100 je 100', () => {
    assertEqual(healthBarWidth(100), 100, 'healthBarWidth 100');
  });

  await test('healthBarWidth za zdravlje=0 je 0', () => {
    assertEqual(healthBarWidth(0), 0, 'healthBarWidth 0');
  });

  await test('healthBarWidth za zdravlje=50 je 50', () => {
    assertEqual(healthBarWidth(50), 50, 'healthBarWidth 50');
  });

  // ─── Konzistentnost statusa ─────────────────────────────────────────────────

  await test('Svaki podsistem sa statusom ok ima gresaka === 0 i upozorenja === 0', () => {
    for (const p of podsistemi.filter((x) => x.status === 'ok')) {
      assert(p.gresaka === 0, `ok ali gresaka=${p.gresaka} za ${p.naziv}`);
      assert(p.upozorenja === 0, `ok ali upozorenja=${p.upozorenja} za ${p.naziv}`);
    }
  });

  await test('Svaki podsistem sa statusom error ima gresaka > 0', () => {
    for (const p of podsistemi.filter((x) => x.status === 'error')) {
      assert(p.gresaka > 0, `error ali gresaka=0 za ${p.naziv}`);
    }
  });

  await test('uspesnih <= ukupnoProvera za sve podsisteme', () => {
    for (const p of podsistemi) {
      assert(p.uspesnih <= p.ukupnoProvera, `uspesnih=${p.uspesnih} > ukupnoProvera=${p.ukupnoProvera} za ${p.naziv}`);
    }
  });

  await test('upozorenja <= ukupnoProvera za sve podsisteme', () => {
    for (const p of podsistemi) {
      assert(p.upozorenja <= p.ukupnoProvera, `upozorenja=${p.upozorenja} > ukupnoProvera=${p.ukupnoProvera} za ${p.naziv}`);
    }
  });

  await test('gresaka <= ukupnoProvera za sve podsisteme', () => {
    for (const p of podsistemi) {
      assert(p.gresaka <= p.ukupnoProvera, `gresaka=${p.gresaka} > ukupnoProvera=${p.ukupnoProvera} za ${p.naziv}`);
    }
  });

  await test('Podsistemi imaju jedinstvene nazive', () => {
    const nazivi = podsistemi.map((p) => p.naziv);
    const uniqueNazivi = new Set(nazivi);
    assertEqual(uniqueNazivi.size, nazivi.length, `Duplirani nazivi`);
  });

  console.log(`\n🏥 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
