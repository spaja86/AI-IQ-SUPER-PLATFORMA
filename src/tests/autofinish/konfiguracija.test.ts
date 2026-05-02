// Autofinish #1118 — Unit testovi KonfiguracijaWidget (getAutofinishKonfiguracija)
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/konfiguracija.test.ts

import { getAutofinishKonfiguracija } from '../../lib/autofinish-petlja';
import type { AutofinishKonfiguracijaParametar } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// ─── Enumi za validaciju ──────────────────────────────────────────────────────

const VALID_STATUS    = ['validiran', 'nevazeci', 'upozorenje', 'nedostaje'] as const;
const VALID_OKRUZENJE = ['production', 'staging', 'development', 'sve'] as const;
const VALID_IZVOR     = ['env', 'secrets', 'config-file', 'baza', 'default'] as const;
const VALID_KATEGORIJA = ['sistem', 'db', 'api', 'auth', 'cache', 'monitoring', 'sigurnost'] as const;

// ─── Logička provjera ─────────────────────────────────────────────────────────

function computeCounts(parametri: AutofinishKonfiguracijaParametar[]) {
  return {
    validiranih: parametri.filter((p) => p.status === 'validiran').length,
    nevazecih:   parametri.filter((p) => p.status === 'nevazeci').length,
    upozorenja:  parametri.filter((p) => p.status === 'upozorenje').length,
    nedostaje:   parametri.filter((p) => p.status === 'nedostaje').length,
  };
}

async function runTests(): Promise<void> {
  console.log('\n⚙️  Unit testovi KonfiguracijaWidget — Test Suite (#1118)\n');

  const result = getAutofinishKonfiguracija();
  const { parametri } = result;

  // ── 1. Osnovna schema ─────────────────────────────────────────────────────
  console.log('📦 Osnovna Schema (#1118)');

  await test('verzija === APP_VERSION', () => {
    assertEqual(result.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(result.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO string', () => {
    assert(!isNaN(Date.parse(result.timestamp)), `timestamp ISO: ${result.timestamp}`);
  });

  await test('ukupnoParametara === parametri.length', () => {
    assertEqual(result.ukupnoParametara, parametri.length, 'ukupnoParametara');
  });

  await test('parametri niz nije prazan', () => {
    assert(Array.isArray(parametri) && parametri.length > 0, 'parametri nije prazan');
  });

  // ── 2. Zbir statusa = ukupnoParametara ───────────────────────────────────
  console.log('\n📦 Konzistentnost Statusa (#1118)');

  const counts = computeCounts(parametri);

  await test('validiranih konzistentno s result.validiranih', () => {
    assertEqual(counts.validiranih, result.validiranih, 'validiranih');
  });

  await test('nevazecih konzistentno s result.nevazecih', () => {
    assertEqual(counts.nevazecih, result.nevazecih, 'nevazecih');
  });

  await test('upozorenja konzistentno s result.upozorenja', () => {
    assertEqual(counts.upozorenja, result.upozorenja, 'upozorenja');
  });

  await test('nedostaje konzistentno s result.nedostaje', () => {
    assertEqual(counts.nedostaje, result.nedostaje, 'nedostaje');
  });

  await test('validiranih + nevazecih + upozorenja + nedostaje === ukupnoParametara', () => {
    const suma = result.validiranih + result.nevazecih + result.upozorenja + result.nedostaje;
    assertEqual(suma, result.ukupnoParametara, 'suma=ukupnoParametara');
  });

  // ── 3. Zdravlje opseg ─────────────────────────────────────────────────────
  console.log('\n📦 Zdravlje Opseg (#1118)');

  await test('zdravlje je broj', () => {
    assert(typeof result.zdravlje === 'number', 'zdravlje je broj');
  });

  await test('zdravlje je u opsegu 0–100', () => {
    assert(result.zdravlje >= 0 && result.zdravlje <= 100, `zdravlje 0–100: ${result.zdravlje}`);
  });

  await test('zdravlje konzistentno s validiranih/ukupno', () => {
    const ocekivano = Math.round((result.validiranih / result.ukupnoParametara) * 100);
    assertEqual(result.zdravlje, ocekivano, 'zdravlje izracun');
  });

  // ── 4. Enum validacija parametara ─────────────────────────────────────────
  console.log('\n📦 Enum Validacija (#1118)');

  await test('svi status su validni enum', () => {
    for (const p of parametri) {
      assert(
        (VALID_STATUS as readonly string[]).includes(p.status),
        `status "${p.status}" za "${p.id}"`,
      );
    }
  });

  await test('svi okruzenje su validni enum', () => {
    for (const p of parametri) {
      assert(
        (VALID_OKRUZENJE as readonly string[]).includes(p.okruzenje),
        `okruzenje "${p.okruzenje}" za "${p.id}"`,
      );
    }
  });

  await test('svi izvor su validni enum', () => {
    for (const p of parametri) {
      assert(
        (VALID_IZVOR as readonly string[]).includes(p.izvor),
        `izvor "${p.izvor}" za "${p.id}"`,
      );
    }
  });

  await test('sve kategorije su validne enum', () => {
    for (const p of parametri) {
      assert(
        (VALID_KATEGORIJA as readonly string[]).includes(p.kategorija),
        `kategorija "${p.kategorija}" za "${p.id}"`,
      );
    }
  });

  // ── 5. Maskiranje osjetljivih parametara ─────────────────────────────────
  console.log('\n📦 Maskiranje Osjetljivih Parametara (#1118)');

  await test('osjetljivi parametri imaju maskiranu vrijednost', () => {
    const osjetljivi = parametri.filter((p) => p.osjetljivo);
    for (const p of osjetljivi) {
      assert(
        p.vrijednost === '***masked***' || p.vrijednost === '',
        `osjetljivi "${p.id}" mora biti maskiran, dobijeno: "${p.vrijednost}"`,
      );
    }
  });

  await test('postoji barem jedan osjetljivi parametar', () => {
    const osjetljivi = parametri.filter((p) => p.osjetljivo);
    assert(osjetljivi.length > 0, 'barem jedan osjetljivi parametar');
  });

  // ── 6. Ostala polja ───────────────────────────────────────────────────────
  console.log('\n📦 Ostala Polja (#1118)');

  await test('sva ime su ne-prazni stringovi', () => {
    for (const p of parametri) {
      assert(typeof p.ime === 'string' && p.ime.length > 0, `ime "${p.id}" ne prazan`);
    }
  });

  await test('svi opis su ne-prazni stringovi', () => {
    for (const p of parametri) {
      assert(typeof p.opis === 'string' && p.opis.length > 0, `opis "${p.id}" ne prazan`);
    }
  });

  await test('svi zadnjaPromjena su validni ISO datumi', () => {
    for (const p of parametri) {
      assert(!isNaN(Date.parse(p.zadnjaPromjena)), `zadnjaPromjena ISO za "${p.id}"`);
    }
  });

  await test('svi ID-ovi su jedinstveni', () => {
    const ids = parametri.map((p) => p.id);
    const unique = new Set(ids);
    assertEqual(unique.size, ids.length, 'jedinstveni ID-ovi');
  });

  await test('validiranih >= 0 i nevazecih >= 0', () => {
    assert(result.validiranih >= 0, 'validiranih >= 0');
    assert(result.nevazecih >= 0, 'nevazecih >= 0');
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
