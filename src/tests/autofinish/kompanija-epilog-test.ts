// Autofinish — kompanija-epilog lib + epilog konzistentnost test
// Kompanija SPAJA — Digitalna Industrija

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  KOMPANIJA_FORMALNA_ADRESA,
  KOMPANIJA_FORMALNI_NAZIV,
  OWNER_EMAIL,
  OWNER_GITHUB,
  OWNER_IME,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';
import {
  EPILOG_VERZIJA,
  epilogAuditTrail,
  getEpilogForOutbound,
  getEpilogRezime,
  getKompanijaEpilog,
} from '../../lib/kompanija-epilog';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🏁 kompanija-epilog — Lib + Konzistentnost Test Suite\n');

  await test('EPILOG_VERZIJA je definisana i semver format', () => {
    assert(typeof EPILOG_VERZIJA === 'string' && EPILOG_VERZIJA.length > 0, 'EPILOG_VERZIJA nije string');
    assert(/^\d+\.\d+\.\d+$/.test(EPILOG_VERZIJA), `EPILOG_VERZIJA nije semver: ${EPILOG_VERZIJA}`);
  });

  await test('getKompanijaEpilog vraća validnu strukturu', () => {
    const e = getKompanijaEpilog();
    assert(typeof e.epilogVerzija === 'string', 'epilogVerzija');
    assert(typeof e.appVerzija === 'string', 'appVerzija');
    assert(typeof e.identitet === 'object', 'identitet');
    assert(typeof e.platforma === 'object', 'platforma');
    assert(typeof e.misijaVizija === 'object', 'misijaVizija');
    assert(typeof e.omegaRoadmap === 'object', 'omegaRoadmap');
    assert(typeof e.complianceSpremnost === 'object', 'complianceSpremnost');
    assert(typeof e.kontakti === 'object', 'kontakti');
    assert(Array.isArray(e.auditTrail) && e.auditTrail.length > 0, 'auditTrail');
    assert(typeof e.generisanoAt === 'string', 'generisanoAt');
  });

  await test('Epilog identitet konzistentan sa konstantama', () => {
    const e = getKompanijaEpilog();
    assertEqual(e.identitet.vlasnik, OWNER_IME, 'vlasnik');
    assertEqual(e.identitet.email, OWNER_EMAIL, 'email');
    assertEqual(e.identitet.github, OWNER_GITHUB, 'github');
    assertEqual(e.identitet.formalniNaziv, KOMPANIJA_FORMALNI_NAZIV, 'formalniNaziv');
    assertEqual(e.identitet.adresa, KOMPANIJA_FORMALNA_ADRESA, 'adresa');
    assertEqual(e.identitet.kompanija, KOMPANIJA, 'kompanija');
  });

  await test('Epilog platforma verzija konzistentna sa APP_VERSION', () => {
    const e = getKompanijaEpilog();
    assertEqual(e.appVerzija, APP_VERSION, 'appVerzija');
    assertEqual(e.platforma.verzija, APP_VERSION, 'platforma.verzija');
  });

  await test('Epilog platforma rute konzistentne sa konstantama', () => {
    const e = getKompanijaEpilog();
    assertEqual(e.platforma.ukupnoRuta, TOTAL_ROUTES, 'ukupnoRuta');
    assertEqual(e.platforma.ukupnoApiRuta, TOTAL_API_ROUTES, 'ukupnoApiRuta');
  });

  await test('Epilog compliance status je spreman', () => {
    const e = getKompanijaEpilog();
    assert(e.complianceSpremnost.gdpr === true, 'gdpr');
    assert(e.complianceSpremnost.auditTrag === true, 'auditTrag');
    assert(e.complianceSpremnost.enterpriseGovernance === true, 'enterpriseGovernance');
    assert(e.complianceSpremnost.status === 'spreman', `complianceStatus: ${e.complianceSpremnost.status}`);
  });

  await test('Epilog misija i vizija nisu prazni', () => {
    const e = getKompanijaEpilog();
    assert(e.misijaVizija.misija.length > 20, 'misija prekratka');
    assert(e.misijaVizija.vizija.length > 20, 'vizija prekratka');
    assert(Array.isArray(e.misijaVizija.vrednosti) && e.misijaVizija.vrednosti.length > 0, 'vrednosti');
  });

  await test('Epilog OMEGA roadmap sadrži sledeće korake', () => {
    const e = getKompanijaEpilog();
    assert(typeof e.omegaRoadmap.trenutnaFaza === 'string', 'trenutnaFaza');
    assert(Array.isArray(e.omegaRoadmap.sledeceKoraci) && e.omegaRoadmap.sledeceKoraci.length > 0, 'sledeceKoraci');
    assert(Array.isArray(e.omegaRoadmap.kapaciteti) && e.omegaRoadmap.kapaciteti.length > 0, 'kapaciteti');
  });

  await test('Epilog kontakti su definisani', () => {
    const e = getKompanijaEpilog();
    assert(e.kontakti.sales.includes('@'), 'sales kontakt');
    assert(e.kontakti.security.includes('@'), 'security kontakt');
    assert(e.kontakti.tech.includes('@'), 'tech kontakt');
  });

  await test('epilogAuditTrail sadrži bar jedan unos v1.0.0', () => {
    assert(epilogAuditTrail.length > 0, 'auditTrail prazan');
    const v1 = epilogAuditTrail.find((a) => a.verzija === '1.0.0');
    assert(v1 !== undefined, 'Nema v1.0.0 unosa u audit trail');
    assert(typeof v1.izmena === 'string' && v1.izmena.length > 0, 'izmena prazna');
    assert(typeof v1.autor === 'string' && v1.autor.length > 0, 'autor prazan');
    assert(/^\d{4}-\d{2}-\d{2}$/.test(v1.datum), `datum format: ${v1.datum}`);
  });

  await test('getEpilogForOutbound openai sadrži identitet i OpenAI sekciju', () => {
    const tekst = getEpilogForOutbound('openai');
    assert(tekst.includes(OWNER_IME), 'Nema OWNER_IME');
    assert(tekst.includes(OWNER_EMAIL), 'Nema OWNER_EMAIL');
    assert(tekst.includes('KONTEKST ZA OPENAI'), 'Nema OpenAI sekciju');
    assert(tekst.includes('COMPLIANCE'), 'Nema compliance sekciju');
  });

  await test('getEpilogForOutbound github sadrži GitHub sekciju', () => {
    const tekst = getEpilogForOutbound('github');
    assert(tekst.includes(OWNER_GITHUB), 'Nema OWNER_GITHUB');
    assert(tekst.includes('GITHUB GOVERNANCE'), 'Nema GitHub sekciju');
  });

  await test('getEpilogForOutbound generic ne sadrži provider-specifiče sekcije', () => {
    const tekst = getEpilogForOutbound('generic');
    assert(tekst.includes(OWNER_IME), 'Nema OWNER_IME');
    assert(!tekst.includes('KONTEKST ZA OPENAI'), 'Generic ne bi smeo da ima OpenAI sekciju');
  });

  await test('getEpilogRezime vraća kratku formu', () => {
    const r = getEpilogRezime();
    assert(typeof r.verzija === 'string', 'verzija');
    assert(typeof r.kompanija === 'string', 'kompanija');
    assert(typeof r.vlasnik === 'string', 'vlasnik');
    assertEqual(r.platformaVerzija, APP_VERSION, 'platformaVerzija');
    assertEqual(r.complianceStatus, 'spreman', 'complianceStatus');
    assert(r.misijaKratko.length > 0, 'misijaKratko prazno');
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
