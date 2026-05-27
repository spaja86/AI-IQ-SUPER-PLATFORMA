// Autofinish #1384 — Licencni Program Saradnja Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/licencni-program-saradnja-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/licencni-program-saradnja/route';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
  console.log('\n🏁 Licencni Program Saradnja — Route Coverage Test Suite (#1384)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/licencni-program-saradnja/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/eksterni-partneri-licencni-program.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Lib fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('Ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('buildLicencniProgramSaradnje'), 'Nedostaje buildLicencniProgramSaradnje');
    assert(src.includes('getLicencniProgramKPI'), 'Nedostaje getLicencniProgramKPI');
    assert(src.includes('getGoNoGoPoVendoru'), 'Nedostaje getGoNoGoPoVendoru');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
  });

  await test('Lib fajl sadrži sve faze implementacionog plana', () => {
    const src = fs.readFileSync(libPath, 'utf8');
    // Faza A
    assert(src.includes('LicencniProgramStavka'), 'Faza A: Nedostaje LicencniProgramStavka');
    assert(src.includes('LicencniProgramStatus'), 'Faza A: Nedostaje LicencniProgramStatus');
    // Faza B
    assert(src.includes('EksterniPartner'), 'Faza B: Nedostaje EksterniPartner');
    assert(src.includes('eksterna_banka'), 'Faza B: Nedostaje tip eksterna_banka');
    assert(src.includes('eksterna_kompanija'), 'Faza B: Nedostaje tip eksterna_kompanija');
    // Faza C
    assert(src.includes('EnterpriseProsirenjeStatus'), 'Faza C: Nedostaje EnterpriseProsirenjeStatus');
    assert(src.includes('finansijskaSpremnost'), 'Faza C: Nedostaje finansijskaSpremnost');
    assert(src.includes('partnerSpremnost'), 'Faza C: Nedostaje partnerSpremnost');
    // Faza D
    assert(src.includes('LicencniChecklistGate'), 'Faza D: Nedostaje LicencniChecklistGate');
    assert(src.includes('readyForPayment'), 'Faza D: Nedostaje readyForPayment');
    // Faza E
    assert(src.includes('EnterpriseKPI'), 'Faza E: Nedostaje EnterpriseKPI');
    assert(src.includes('goNoGo'), 'Faza E: Nedostaje goNoGo');
    // Faza F
    assert(src.includes('AuditTrailStavka'), 'Faza F: Nedostaje AuditTrailStavka');
    assert(src.includes('buildAuditTrail'), 'Faza F: Nedostaje buildAuditTrail');
    // Faza G
    assert(src.includes('LicencniProgramSaradnjeSummary'), 'Faza G: Nedostaje Summary');
    assert(src.includes('procenatAktivnihLicenci'), 'Faza G: Nedostaje KPI metriks');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1387, 'AUTOFINISH_COUNT baseline');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    }) as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');

    const data = body['data'] as Record<string, unknown>;
    assertEqual(data['status'] as string, 'aktivan', 'data.status');
    assert(typeof data['summary'] === 'object' && data['summary'] !== null, 'data.summary');
    assert(typeof data['kpi'] === 'object' && data['kpi'] !== null, 'data.kpi');
    assert(Array.isArray(data['stavke']), 'data.stavke niz');
    assert(Array.isArray(data['eksterniPartneri']), 'data.eksterniPartneri niz');
    assert(Array.isArray(data['prosirenjeStatusi']), 'data.prosirenjeStatusi niz');
    assert(Array.isArray(data['paymentPipelines']), 'data.paymentPipelines niz');
    assert(Array.isArray(data['audit']), 'data.audit niz');
  });

  await test('GET summary sadrži sve ključne metrike', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.0.2' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const summary = data['summary'] as Record<string, unknown>;

    assert(typeof summary['ukupnoLicenci'] === 'number', 'summary.ukupnoLicenci');
    assert((summary['ukupnoLicenci'] as number) > 0, 'summary.ukupnoLicenci > 0');
    assert(typeof summary['obaveznihLicenci'] === 'number', 'summary.obaveznihLicenci');
    assert(typeof summary['ukupniBudzetRSD'] === 'number', 'summary.ukupniBudzetRSD');
    assert((summary['ukupniBudzetRSD'] as number) > 0, 'summary.ukupniBudzetRSD > 0');
    assert(typeof summary['poVendoru'] === 'object', 'summary.poVendoru');
    assert(typeof summary['poStatusu'] === 'object', 'summary.poStatusu');

    const poVendoru = summary['poVendoru'] as Record<string, unknown>;
    assert(typeof poVendoru['vercel'] === 'object', 'summary.poVendoru.vercel');
    assert(typeof poVendoru['github'] === 'object', 'summary.poVendoru.github');
    assert(typeof poVendoru['openai'] === 'object', 'summary.poVendoru.openai');

    const eksterniPartneri = summary['eksterniPartneri'] as Record<string, unknown>;
    assert(typeof eksterniPartneri['banke'] === 'number', 'summary.eksterniPartneri.banke');
    assert((eksterniPartneri['banke'] as number) >= 2, 'Minimum 2 externe banke');
    assert(typeof eksterniPartneri['kompanije'] === 'number', 'summary.eksterniPartneri.kompanije');
  });

  await test('GET KPI sadrži enterprise signale', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.0.3' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const kpi = (body['data'] as Record<string, unknown>)['kpi'] as Record<string, unknown>;

    assert(typeof kpi['procenatAktivnihLicenci'] === 'number', 'kpi.procenatAktivnihLicenci');
    assert(typeof kpi['procenatSpremniZaUplatu'] === 'number', 'kpi.procenatSpremniZaUplatu');
    assert(typeof kpi['brojOtvorenihBlokatora'] === 'number', 'kpi.brojOtvorenihBlokatora');
    assert(typeof kpi['ukupnoLicenci'] === 'number', 'kpi.ukupnoLicenci');
    assert((kpi['ukupnoLicenci'] as number) > 0, 'kpi.ukupnoLicenci > 0');
    assert(typeof kpi['centralniPayer'] === 'string', 'kpi.centralniPayer');
    assert(
      (kpi['centralniPayer'] as string).includes('AI IQ World Bank'),
      'centralniPayer mora sadržati AI IQ World Bank',
    );
  });

  await test('GET prosirenjeStatusi ima go/no-go po vendoru', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.0.4' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const statusi = (body['data'] as Record<string, unknown>)[
      'prosirenjeStatusi'
    ] as Array<Record<string, unknown>>;

    assertEqual(statusi.length, 3, 'prosirenjeStatusi.length (vercel, github, openai)');
    for (const s of statusi) {
      assert(typeof s['vendor'] === 'string', 'prosirenjeStatus.vendor');
      assert(['go', 'no-go', 'uslovni-go'].includes(s['goNoGo'] as string), 'valid goNoGo vrednost');
      assert(typeof s['finansijskaSpremnost'] === 'boolean', 'finansijskaSpremnost boolean');
      assert(typeof s['partnerSpremnost'] === 'boolean', 'partnerSpremnost boolean');
      assert(Array.isArray(s['blokatori']), 'blokatori niz');
    }
  });

  await test('GET paymentPipelines ima checklist gates', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.0.5' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const pipelines = (body['data'] as Record<string, unknown>)[
      'paymentPipelines'
    ] as Array<Record<string, unknown>>;

    assert(pipelines.length > 0, 'paymentPipelines nije prazno');
    for (const p of pipelines) {
      assert(typeof p['vendor'] === 'string', 'pipeline.vendor');
      assert(typeof p['stavkaId'] === 'string', 'pipeline.stavkaId');
      assert(Array.isArray(p['gates']), 'pipeline.gates niz');
      assert((p['gates'] as unknown[]).length === 4, 'Svaki pipeline ima 4 gates');
      assert(typeof p['readyForPayment'] === 'boolean', 'pipeline.readyForPayment boolean');
      assert(Array.isArray(p['missing']), 'pipeline.missing niz');
    }
  });

  await test('GET audit trag je prisutan', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.0.6' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const audit = (body['data'] as Record<string, unknown>)['audit'] as Array<Record<string, unknown>>;

    assert(audit.length >= 2, 'Minimum 2 audit stavke (program scope + partner registry)');
    for (const a of audit) {
      assert(typeof a['id'] === 'string', 'audit.id string');
      assert(typeof a['akcija'] === 'string', 'audit.akcija string');
      assert(['uspesno', 'upozorenje', 'greska'].includes(a['status'] as string), 'valid audit status');
      assert(typeof a['timestamp'] === 'string', 'audit.timestamp string');
    }
  });

  await test('GET ?view=kpi vraća parcijalni KPI pogled', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja?view=kpi', {
      headers: { 'x-forwarded-for': '127.0.0.7' },
    }) as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assert(typeof data['kpi'] === 'object' && data['kpi'] !== null, 'data.kpi objekat');
    assert(
      !('stavke' in data),
      'view=kpi ne sme da sadrži stavke (optimizovani pogled)',
    );
  });

  await test('GET ?view=gonogo vraća parcijalni go/no-go pogled', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja?view=gonogo', {
      headers: { 'x-forwarded-for': '127.0.0.8' },
    }) as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assert(Array.isArray(data['goNoGo']), 'data.goNoGo niz');
    assert((data['goNoGo'] as unknown[]).length === 3, 'goNoGo ima 3 vendora');
  });

  await test('GET ?view=banke vraća parcijalni banke pogled', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja?view=banke', {
      headers: { 'x-forwarded-for': '127.0.0.9' },
    }) as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assert(Array.isArray(data['banke']), 'data.banke niz');
    assert((data['banke'] as unknown[]).length >= 2, 'Minimum 2 externe banke');
  });

  await test('Stavke program uključuju sve tri vendore', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.1.0' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const stavke = (body['data'] as Record<string, unknown>)['stavke'] as Array<Record<string, unknown>>;

    const vendori = new Set(stavke.map((s) => s['vendor']));
    assert(vendori.has('vercel'), 'Postoji vercel stavka');
    assert(vendori.has('github'), 'Postoji github stavka');
    assert(vendori.has('openai'), 'Postoji openai stavka');

    const obavezne = stavke.filter((s) => s['obaveznost'] === 'obavezna');
    assert(obavezne.length >= 3, 'Minimum 3 obavezne licence (jedna po vendoru)');
  });

  await test('Eksterni partneri uključuju banke i kompanije', async () => {
    const req = new Request('http://localhost/api/licencni-program-saradnja', {
      headers: { 'x-forwarded-for': '127.0.1.1' },
    }) as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as Record<string, unknown>;
    const partneri = (body['data'] as Record<string, unknown>)[
      'eksterniPartneri'
    ] as Array<Record<string, unknown>>;

    const banke = partneri.filter((p) => p['tip'] === 'eksterna_banka');
    const kompanije = partneri.filter((p) => p['tip'] === 'eksterna_kompanija');

    assert(banke.length >= 2, 'Minimum 2 externe banke');
    assert(kompanije.length >= 1, 'Minimum 1 eksterna kompanija');

    for (const p of partneri) {
      assert(typeof p['id'] === 'string', 'partner.id string');
      assert(typeof p['naziv'] === 'string', 'partner.naziv string');
      assert(['payer', 'reseller', 'integrator', 'compliance_partner'].includes(p['uloga'] as string), 'valid uloga');
      assert(Array.isArray(p['uplatniKanali']), 'partner.uplatniKanali niz');
      assert(Array.isArray(p['obavezniDokumenti']), 'partner.obavezniDokumenti niz');
    }
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
