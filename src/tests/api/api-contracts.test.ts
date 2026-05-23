// SpajaUltraOmegaCore -∞Ω+∞ — API Contract Testovi
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. Standardizovani API response format (src/lib/api/response.ts)
//   2. Rate limiter logiku (src/lib/rate-limit.ts)
//   3. Billing konfiguracija i plan konzistentnost
//   4. Evolution engine kontrakt
//
// Pokretanje: npx tsx src/tests/api/api-contracts.test.ts

// ─── Importi ──────────────────────────────────────────────────────────────────

import type { ApiError, ApiSuccess, ApiErrorCode } from '../../lib/api/response';
import fs from 'node:fs';
import path from 'node:path';
import { checkRateLimitGlobal, rateLimitKey, isKVConfigured } from '../../lib/rate-limit';
import { PLANOVI, getPlanById, getPlanByPriceId, UNLIMITED_CHAT } from '../../lib/stripe/config';
import {
  kreirajEvolucijskiCiklus,
  kreirajISnimiCiklus,
  getEvolucijskaIstorija,
  getEvolucijskaIstorijaAsync,
} from '../../lib/evolucija/engine';
import { APP_VERSION } from '../../lib/constants';
import { getEnterpriseZahtevi, getOperativnaSpremnost } from '../../lib/kompanija-spaja-operativa';
import { validateCronAuth } from '../../lib/cron-auth';
import { getKastlerSignalReadinessSummary, getKastlerTVSignalRequestPackage } from '../../lib/kastler-tv-signal-request';
import {
  buildKomunikacioniSablon,
  canTransition,
  createB2BProcurementCase,
  getB2BProcurementChecklist,
  getB2BProcurementCaseById,
  patchB2BProcurementCase,
} from '../../lib/b2b-procurement-workflow';

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

function assertDefined<T>(value: T | null | undefined, label?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${label ?? 'assertDefined'}: value is ${String(value)}`);
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {

  // ── 1. API Response Format ─────────────────────────────────────────────────
  console.log('\n📋 API Response Format');

  await test('ApiError interfejs ima sva obavezna polja', () => {
    const sample: ApiError = {
      error: 'Test greška',
      code: 'BAD_REQUEST',
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    };
    assert(typeof sample.error === 'string', 'error mora biti string');
    assert(typeof sample.code === 'string', 'code mora biti string');
    assert(typeof sample.verzija === 'string', 'verzija mora biti string');
    assert(typeof sample.timestamp === 'string', 'timestamp mora biti string');
    assert(sample.timestamp.includes('T'), 'timestamp mora biti ISO format');
  });

  await test('ApiSuccess interfejs ima sva obavezna polja', () => {
    const sample: ApiSuccess<{ token: string }> = {
      data: { token: 'abc123' },
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    };
    assertDefined(sample.data, 'data');
    assert(typeof sample.data.token === 'string', 'data.token mora biti string');
    assertEqual(sample.verzija, APP_VERSION, 'verzija');
  });

  await test('Svi error kodovi su validni stringovi', () => {
    const kodovi: ApiErrorCode[] = [
      'BAD_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'CONFLICT',
      'UNPROCESSABLE_ENTITY', 'TOO_MANY_REQUESTS', 'INTERNAL_SERVER_ERROR',
      'SERVICE_UNAVAILABLE', 'CONFIGURATION_ERROR',
      'AUTH_INVALID_CREDENTIALS', 'AUTH_BRUTE_FORCE_BLOCKED',
      'AUTH_TOKEN_EXPIRED', 'AUTH_TOKEN_INVALID', 'AUTH_MFA_REQUIRED',
      'BILLING_PLAN_NOT_FOUND', 'BILLING_FREE_PLAN', 'BILLING_STRIPE_NOT_CONFIGURED',
      'BILLING_CHECKOUT_FAILED', 'CRON_UNAUTHORIZED',
    ];
    for (const kod of kodovi) {
      assert(typeof kod === 'string' && kod.length > 0, `Error kod '${kod}' mora biti neprazan string`);
      assert(!kod.includes(' '), `Error kod '${kod}' ne sme sadržati razmake`);
    }
    assert(kodovi.length >= 20, `Mora biti definisano najmanje 20 kodova, ima ${kodovi.length}`);
  });

  await test('APP_VERSION je definisana i nije prazna', () => {
    assert(typeof APP_VERSION === 'string', 'APP_VERSION mora biti string');
    assert(APP_VERSION.length > 0, 'APP_VERSION ne sme biti prazna');
    assert(APP_VERSION.includes('.'), 'APP_VERSION mora imati tačku (semver format)');
  });

  // ── 2. Rate Limiter ────────────────────────────────────────────────────────
  console.log('\n🚦 Rate Limiter');

  await test('checkRateLimitGlobal dozvoljava zahteve ispod limita', async () => {
    const key = `test-rl-${Date.now()}`;
    const result = await checkRateLimitGlobal(key, 10, 60);
    assert(result === true, 'prvi zahtev mora biti dozvoljen');
  });

  await test('checkRateLimitGlobal blokira zahteve iznad limita', async () => {
    const key = `test-rl-block-${Date.now()}`;
    const limit = 3;
    for (let i = 0; i < limit; i++) {
      await checkRateLimitGlobal(key, limit, 60);
    }
    const blocked = await checkRateLimitGlobal(key, limit, 60);
    assert(blocked === false, `${limit + 1}. zahtev mora biti blokiran`);
  });

  await test('rateLimitKey generiše konzistentan ključ', () => {
    const key1 = rateLimitKey('1.2.3.4', '/api/auth/login');
    const key2 = rateLimitKey('1.2.3.4', '/api/auth/login');
    assertEqual(key1, key2, 'isti ulaz mora dati isti ključ');
  });

  await test('rateLimitKey je različit za različite IP adrese', () => {
    const key1 = rateLimitKey('1.2.3.4', '/api/auth/login');
    const key2 = rateLimitKey('5.6.7.8', '/api/auth/login');
    assert(key1 !== key2, 'različite IP adrese moraju imati različite ključeve');
  });

  await test('rateLimitKey format je ispravan', () => {
    const key = rateLimitKey('1.2.3.4', '/api/auth/login');
    assert(key.startsWith('rl:'), 'ključ mora početi sa rl:');
    assert(key.includes('1.2.3.4'), 'ključ mora sadržati IP adresu');
  });

  await test('isKVConfigured vraća boolean', () => {
    const result = isKVConfigured();
    assert(typeof result === 'boolean', 'isKVConfigured mora vratiti boolean');
    assert(result === false, 'u test okruženju KV nije konfigurisan');
  });

  // ── 2b. Enterprise request paketi ──────────────────────────────────────────
  console.log('\n🏢 Enterprise request paketi');

  await test('Vercel, GitHub i OpenAI enterprise paketi su definisani', () => {
    const paketi = getEnterpriseZahtevi();
    assertEqual(paketi.length, 3, 'moraju postojati 3 enterprise paketa');
    assert(paketi.some((paket) => paket.id === 'vercel'), 'mora postojati Vercel paket');
    assert(paketi.some((paket) => paket.id === 'github'), 'mora postojati GitHub paket');
    assert(paketi.some((paket) => paket.id === 'openai'), 'mora postojati OpenAI paket');
  });

  await test('Enterprise paketi koriste kompanijske mejlove i zvanične kanale', () => {
    const paketi = getEnterpriseZahtevi();
    const expectedKanali = {
      vercel: 'https://vercel.com/contact/sales',
      github: 'https://github.com/enterprise/contact',
      openai: 'https://openai.com/contact-sales',
    } as const;

    for (const paket of paketi) {
      assert(paket.posiljalac.endsWith('@spaja.rs'), `${paket.id} mora koristiti kompanijski @spaja.rs mejl`);
      assert(paket.replyTo.endsWith('@spaja.rs'), `${paket.id} replyTo mora koristiti kompanijski @spaja.rs mejl`);
      assert(paket.kanalPodnosenja.url.startsWith('https://'), `${paket.id} kanal mora biti https URL`);
      assertEqual(
        paket.kanalPodnosenja.url,
        expectedKanali[paket.id],
        `${paket.id} kanal mora koristiti zvanični URL`,
      );
      assert(paket.kanalPodnosenja.zahtevaKompanijskiMejl, `${paket.id} kanal mora zahtevati kompanijski mejl`);
      assert(paket.naslov.length > 20, `${paket.id} naslov mora biti smislen`);
      assert(paket.telo.includes('Kompanija SPAJA'), `${paket.id} telo mora pomenuti kompaniju`);
      assert(
        paket.telo.includes('Ako dokumenta ne možemo razmeniti digitalno'),
        `${paket.id} telo mora sadržati fallback za kontakt/posetu radi potpisivanja ugovora`,
      );
    }
  });

  await test('OpenAI paket sadrži owner nalog i partnerske opcije', () => {
    const paketi = getEnterpriseZahtevi();
    const openai = paketi.find((paket) => paket.id === 'openai');
    assertDefined(openai, 'openai paket');
    assert(openai.telo.includes('spajicn@yahoo.com'), 'telo mora pomenuti primarni owner nalog');
    assert(openai.telo.includes('SpajaPro'), 'telo mora pomenuti SpajaPro');
    assert(openai.trazeniPlanovi.some((p) => p.includes('Enterprise')), 'mora tražiti Enterprise plan');
    assert(openai.cc.includes('spajicn@yahoo.com'), 'primarni owner mora biti u CC');
    assert(new URL(openai.kanalPodnosenja.url).hostname === 'openai.com', 'kanal mora biti tačno openai.com domen');
  });

  await test('GitHub paket naglašava partnerstvo, agente i licence', () => {
    const paketi = getEnterpriseZahtevi();
    const github = paketi.find((paket) => paket.id === 'github');
    assertDefined(github, 'github paket');
    assert(github.sazetak.includes('licence'), 'github sažetak mora pomenuti licence');
    assert(github.telo.includes('poslovnog partnera'), 'github telo mora pomenuti poslovno partnerstvo');
    assert(github.telo.includes('GitHub agente'), 'github telo mora pomenuti GitHub agente');
    assert(github.telo.includes('kupovinu licenci'), 'github telo mora pomenuti kupovinu licenci');
    assert(github.trazeneOpcije.includes('GitHub agent enablement'), 'github opcije moraju pokriti agente');
  });

  await test('Kastler TV signal paket ima validan operativni sadržaj', () => {
    const paket = getKastlerTVSignalRequestPackage();
    assertEqual(paket.id, 'kastler-tv-signal-request', 'paket.id');
    assertEqual(paket.partner.id, 'kastler', 'partner.id');
    assert(paket.trazeniKanali.length >= 1, 'mora imati bar jedan trazeni kanal');
    assert(paket.audit.dispatchKanal.includes('@'), 'dispatch kanal mora biti email');
    assert(
      ['u_pripremi', 'spremno_za_slanje', 'poslato'].includes(paket.statusRikvesta),
      'status rikvesta mora biti validan',
    );
  });

  await test('Operativna spremnost uključuje Kastler TV readiness', () => {
    const operativa = getOperativnaSpremnost();
    const kastler = getKastlerSignalReadinessSummary();
    assertDefined(operativa.spremnost.kastlerTv, 'operativa.spremnost.kastlerTv');
    assertEqual(
      operativa.spremnost.kastlerTv.signalLifecycle,
      kastler.signalLifecycle,
      'kastler lifecycle u operativi',
    );
    assert(Array.isArray(operativa.spremnost.missingKastlerEnv), 'missingKastlerEnv mora biti niz');
    assertDefined(operativa.kastlerTvPaket, 'operativa.kastlerTvPaket');
  });

  await test('Operativna spremnost ima runtime/ops/enterprise modove', () => {
    const operativa = getOperativnaSpremnost();
    assertDefined(operativa.spremnost.modelStanja, 'modelStanja');
    const mode = operativa.spremnost.modelStanja;
    assert(['runtime-ready', 'runtime-incomplete'].includes(mode.runtime), 'runtime mode mora biti validan');
    assert(['ops-ready', 'ops-incomplete'].includes(mode.ops), 'ops mode mora biti validan');
    assert(['enterprise-in-progress', 'enterprise-ready'].includes(mode.enterprise), 'enterprise mode mora biti validan');
    assertDefined(operativa.spremnost.acceptanceCriteria.statusApi, 'statusApi acceptance');
    assertDefined(operativa.spremnost.acceptanceCriteria.healthApi, 'healthApi acceptance');
    assert(Array.isArray(operativa.spremnost.missingVercelEnv), 'missingVercelEnv mora biti niz');
  });

  await test('Cron auth helper podržava Bearer i x-cron-secret', () => {
    const secret = 'cron-test-secret';
    const bearerReq = new Request('https://example.com/api/cron/zdravlje', {
      headers: { authorization: `Bearer ${secret}` },
    });
    const headerReq = new Request('https://example.com/api/cron/zdravlje', {
      headers: { 'x-cron-secret': secret },
    });
    const invalidReq = new Request('https://example.com/api/cron/zdravlje', {
      headers: { authorization: 'Bearer wrong' },
    });

    assert(validateCronAuth(bearerReq, secret).authorized, 'Bearer header mora biti prihvaćen');
    assert(validateCronAuth(headerReq, secret).authorized, 'x-cron-secret header mora biti prihvaćen');
    assert(!validateCronAuth(invalidReq, secret).authorized, 'neispravan secret mora biti odbijen');
    assert(!validateCronAuth(headerReq, '').authorized, 'prazan CRON_SECRET mora odbiti zahtev');
  });

  await test('vercel.json cron konfiguracija je usklađena sa očekivanim endpointima', () => {
    const root = path.join(__dirname, '..', '..', '..');
    const raw = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');
    const parsed = JSON.parse(raw) as { crons?: Array<{ path: string; schedule: string }> };
    const crons = parsed.crons ?? [];
    assert(crons.some((c) => c.path === '/api/cron/zdravlje'), 'vercel.json mora imati /api/cron/zdravlje cron');
    assert(crons.some((c) => c.path === '/api/cron/evolucija'), 'vercel.json mora imati /api/cron/evolucija cron');
  });

  // ── 2c. Internal B2B procurement workflow ───────────────────────────────────
  console.log('\n🏎️ Internal B2B procurement workflow');

  const procurementCase = await createB2BProcurementCase({
    partner: {
      naziv: 'Test Partner Srbija',
      tip: 'ovlasceni_diler',
      trziste: 'Srbija',
      kanalKontakta: 'sales@spaja.rs',
    },
    vozilo: {
      marka: 'Lamborghini',
      model: 'Urus',
      oprema: 'FULL OPREMA',
      trziste: 'Srbija',
      budzet: 500000,
      valuta: 'EUR',
      prioritet: 'kritican',
      rok: null,
    },
    paymentSource: 'AI IQ World Bank',
    deliveryAddress: 'Danila Kiša 18, Smederevo 11300',
    deliveryContact: 'interni-vlasnik-kontakt',
    privateOwnerName: 'Test Vlasnik',
    privatePhone: '+381600000000',
  });

  await test('B2B slučaj kreiran sa početnim statusom upit', () => {
    assertEqual(procurementCase.status, 'upit', 'početni status mora biti upit');
    assert(procurementCase.sifra.startsWith('B2B-'), 'sifra mora imati B2B prefiks');
    assert(procurementCase.dokumentacija.length >= 5, 'mora sadržati obaveznu dokumentaciju');
    assert(procurementCase.odobrenja.length >= 3, 'mora sadržati approval chain');
    assertEqual(procurementCase.gamePlanovi.length, 2, 'mora sadržati tačno 2 gejm plana');
    assertEqual(procurementCase.payment.izvorSredstava, 'AI IQ World Bank', 'payment source mora biti zaključan');
    assertEqual(procurementCase.workflowProfil.id, 'gigatron-usce', 'workflow profil mora biti gigatron-usce');
  });

  await test('Privatni podaci su redigovani kada includeSensitive nije uključen', async () => {
    const redacted = await getB2BProcurementCaseById(procurementCase.id, { includeSensitive: false });
    assertDefined(redacted, 'redacted case');
    assertEqual(redacted.privatniKontakt.privatniTelefon, 'INTERNAL_ONLY', 'telefon mora biti sakriven');
    assertEqual(redacted.delivery.adresaIsporuke, 'INTERNAL_ONLY', 'adresa mora biti sakrivena');
  });

  await test('Tranzicija u odobrenje je blokirana bez izbora najboljeg plana', async () => {
    const tempCase = await createB2BProcurementCase({
      partner: {
        naziv: 'Temp Gigatron Partner',
        tip: 'ovlasceni_diler',
        trziste: 'Srbija',
        kanalKontakta: 'sales@spaja.rs',
      },
      vozilo: {
        marka: 'Lamborghini',
        model: 'Urus',
        oprema: 'FULL OPREMA',
        trziste: 'Srbija',
        budzet: 0,
        valuta: 'EUR',
        prioritet: 'kritican',
        rok: null,
      },
      deliveryAddress: 'Danila Kiša 18, Smederevo 11300',
      deliveryContact: 'interni-vlasnik-kontakt',
      privateOwnerName: 'Temp Vlasnik',
      privatePhone: '+381600000001',
    });
    const blocked = await patchB2BProcurementCase({
      caseId: tempCase.id,
      action: { type: 'status_transition', payload: { status: 'ponuda' } },
    });
    assert(!blocked.error, `upit->ponuda mora biti dozvoljeno: ${blocked.error ?? ''}`);
    const blockedPregovori = await patchB2BProcurementCase({
      caseId: tempCase.id,
      action: { type: 'status_transition', payload: { status: 'pregovori' } },
    });
    assert(!blockedPregovori.error, `ponuda->pregovori mora biti dozvoljeno: ${blockedPregovori.error ?? ''}`);
    const blockedOdobrenje = await patchB2BProcurementCase({
      caseId: tempCase.id,
      action: { type: 'status_transition', payload: { status: 'odobrenje' } },
    });
    assertDefined(blockedOdobrenje.error, 'odobrenje mora biti blokirano bez gejm-plan odluke');
  });

  await test('Status ne može direktno u placanje bez checklist uslova', async () => {
    const blocked = await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'status_transition', payload: { status: 'placanje' } },
    });
    assertDefined(blocked.error, 'transition error');
  });

  await test('Checklist i status tranzicije rade kroz ceo lifecycle', async () => {
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: {
        type: 'document_update',
        payload: { kljuc: 'pravno-lice', status: 'verifikovano', verifikovao: 'legal@spaja.rs' },
      },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: {
        type: 'document_update',
        payload: { kljuc: 'dokumentacija-kupca', status: 'verifikovano', verifikovao: 'legal@spaja.rs' },
      },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: {
        type: 'document_update',
        payload: { kljuc: 'dokumentacija-prodavca', status: 'verifikovano', verifikovao: 'legal@spaja.rs' },
      },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'document_update', payload: { kljuc: 'faktura-predracun', status: 'primljeno' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'document_update', payload: { kljuc: 'potvrda-logistike', status: 'primljeno' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'approval_update', payload: { kljuc: 'vlasnicko-odobrenje', status: 'approved', odobrio: 'vlasnik' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'approval_update', payload: { kljuc: 'billing-approval', status: 'approved', odobrio: 'billing@spaja.rs' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'approval_update', payload: { kljuc: 'operativa-approval', status: 'approved', odobrio: 'tech@spaja.rs' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: {
        type: 'game_plan_set',
        payload: {
          planovi: [
            {
              id: 'gigatron-plan-1',
              naziv: 'GIGATRON Ušće Gejm Plan 1 (Enterprise)',
              cena: 12000,
              valuta: 'EUR',
              fullOpremaStavke: ['FULL OPREMA', 'GPU', 'Periferije'],
              statusAnalize: 'predlog',
            },
            {
              id: 'gigatron-plan-2',
              naziv: 'GIGATRON Ušće Gejm Plan 2 (Enterprise)',
              cena: 12500,
              valuta: 'EUR',
              fullOpremaStavke: ['FULL OPREMA', 'Dodatna garancija'],
              statusAnalize: 'predlog',
            },
          ],
        },
      },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: {
        type: 'best_plan_select',
        payload: {
          planId: 'gigatron-plan-1',
          razlog: 'Najbolji odnos enterprise uslova i full-oprema paketa.',
        },
      },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'full_oprema_confirm', payload: { potvrdjeno: true } },
    });

    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'status_transition', payload: { status: 'ponuda' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'status_transition', payload: { status: 'pregovori' } },
    });
    await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'status_transition', payload: { status: 'odobrenje' } },
    });
    const allowed = await patchB2BProcurementCase({
      caseId: procurementCase.id,
      action: { type: 'status_transition', payload: { status: 'placanje' } },
    });
    assert(!allowed.error, `status_transition mora biti dozvoljen: ${allowed.error ?? ''}`);
    const checklist = await getB2BProcurementChecklist(procurementCase.id);
    assert(checklist.readyForPayment, 'checklista mora biti spremna za uplatu');
    assertEqual(checklist.missing.length, 0, 'ne sme biti missing stavki');
  });

  await test('Sabloni komunikacije uključuju full opremu i finansiranje', () => {
    const template = buildKomunikacioniSablon('zahtev_full_oprema', procurementCase);
    assert(template.naslov.includes('FULL OPREMA') || template.telo.includes('full opremu'), 'template mora pomenuti full opremu');
    assert(template.telo.includes('AI IQ World Bank'), 'template mora pomenuti izvor finansiranja');
  });

  await test('Gigatron šabloni pokrivaju ponudu, gejm planove, plaćanje i dostavu', () => {
    const ponuda = buildKomunikacioniSablon('gigatron_inicijalna_ponuda', procurementCase);
    const gejmPlanovi = buildKomunikacioniSablon('gigatron_dva_gejm_plana', procurementCase);
    const uplata = buildKomunikacioniSablon('gigatron_potvrda_uplate_aiiq', procurementCase);
    const dostava = buildKomunikacioniSablon('gigatron_zahtev_dostava', procurementCase);
    assert(ponuda.naslov.includes('GIGATRON'), 'ponuda šablon mora sadržati GIGATRON');
    assert(gejmPlanovi.telo.includes('dva enterprise gejm plana') || gejmPlanovi.telo.includes('2 gejm plana'), 'gejm plan šablon mora tražiti 2 plana');
    assert(uplata.telo.includes('AI IQ World Bank'), 'uplata šablon mora imati AI IQ World Bank');
    assert(dostava.naslov.includes('dostavu'), 'dostava šablon mora tražiti dostavu');
  });

  await test('canTransition validira nedozvoljene skokove', () => {
    const direct = canTransition(procurementCase, 'isporuka');
    assert(!direct.ok, 'skok upit -> isporuka ne sme biti dozvoljen');
  });

  // ── 3. Billing — Stripe Planovi ───────────────────────────────────────────
  console.log('\n💳 Billing — Stripe Planovi');

  await test('Svi planovi imaju obavezna polja', () => {
    assert(PLANOVI.length > 0, 'mora biti definisan bar 1 plan');
    for (const plan of PLANOVI) {
      assertDefined(plan.id, `plan.id za ${plan.naziv}`);
      assertDefined(plan.naziv, `plan.naziv za ${plan.id}`);
      assert(typeof plan.cenaEur === 'number', `plan.cenaEur mora biti broj (${plan.id})`);
      assert(plan.cenaEur >= 0, `plan.cenaEur mora biti >= 0 (${plan.id})`);
      assert(Array.isArray(plan.funkcije), `plan.funkcije mora biti array (${plan.id})`);
      assert(plan.funkcije.length > 0, `plan.funkcije ne sme biti prazan array (${plan.id})`);
    }
  });

  await test('Planovi su sortirani po ceni (rastuće)', () => {
    for (let i = 1; i < PLANOVI.length; i++) {
      assert(
        PLANOVI[i].cenaEur >= PLANOVI[i - 1].cenaEur,
        `Plan ${PLANOVI[i].naziv} (${PLANOVI[i].cenaEur}€) mora biti skuplji od ${PLANOVI[i - 1].naziv}`,
      );
    }
  });

  await test('Starter plan je besplatan', () => {
    const starter = PLANOVI.find((p) => p.id === 'starter');
    assertDefined(starter, 'starter plan');
    assertEqual(starter.cenaEur, 0, 'starter cena mora biti 0');
    assertEqual(starter.stripePriceId, '', 'starter nema Stripe Price ID');
  });

  await test('Plaćeni planovi imaju chat limit > starter ili UNLIMITED', () => {
    const starter = PLANOVI.find((p) => p.id === 'starter');
    assertDefined(starter, 'starter plan');
    const plateniPlanovi = PLANOVI.filter((p) => p.cenaEur > 0);
    assert(plateniPlanovi.length > 0, 'mora biti bar 1 plaćeni plan');
    for (const plan of plateniPlanovi) {
      assert(
        plan.chatLimit > starter.chatLimit || plan.chatLimit === UNLIMITED_CHAT,
        `Plan ${plan.naziv} mora imati viši chat limit od starter-a ili biti UNLIMITED`,
      );
    }
  });

  await test('getPlanById vraća ispravan plan', () => {
    const plan = getPlanById('starter');
    assertDefined(plan, 'starter plan');
    assertEqual(plan.id, 'starter', 'id');
  });

  await test('getPlanById vraća undefined za nepostojeći plan', () => {
    const plan = getPlanById('nepostojeci-plan-xyz');
    assert(plan === undefined, 'nepostojeći plan mora vraćati undefined');
  });

  await test('getPlanByPriceId ne baca grešku za prazan priceId', () => {
    const plan = getPlanByPriceId('');
    assert(plan === undefined || typeof plan === 'object', 'ne sme baciti grešku');
  });

  // ── 4. Evolution Engine ───────────────────────────────────────────────────
  console.log('\n🧬 Evolution Engine');

  await test('kreirajEvolucijskiCiklus vraća validan ciklus', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    assertDefined(ciklus.id, 'ciklus.id');
    assertDefined(ciklus.pocetak, 'ciklus.pocetak');
    assertDefined(ciklus.dijagnostika, 'ciklus.dijagnostika');
    assertDefined(ciklus.akcije, 'ciklus.akcije');
    assert(Array.isArray(ciklus.akcije), 'akcije mora biti array');
    assertEqual(ciklus.status, 'zavrsen', 'status mora biti zavrsen');
  });

  await test('dijagnostika ima validno zdravlje (0-100)', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    const { zdravlje } = ciklus.dijagnostika;
    assert(typeof zdravlje === 'number', 'zdravlje mora biti broj');
    assert(zdravlje >= 0 && zdravlje <= 100, `zdravlje mora biti između 0 i 100, ima ${zdravlje}`);
  });

  await test('preporuke imaju obavezna polja', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    const { preporuke } = ciklus.dijagnostika;
    assert(Array.isArray(preporuke), 'preporuke mora biti array');
    assert(preporuke.length > 0, 'mora biti definisana bar 1 preporuka');
    for (const p of preporuke) {
      assertDefined(p.id, `preporuka.id`);
      assertDefined(p.naslov, `preporuka.naslov (${p.id})`);
      assertDefined(p.tip, `preporuka.tip (${p.id})`);
      assertDefined(p.prioritet, `preporuka.prioritet (${p.id})`);
      assertDefined(p.githubIssueNaslov, `githubIssueNaslov (${p.id})`);
      assertDefined(p.githubIssueTelo, `githubIssueTelo (${p.id})`);
      assert(
        ['popravka', 'optimizacija', 'nadogradnja', 'nova-funkcija', 'bezbednost'].includes(p.tip),
        `tip '${p.tip}' mora biti validan (${p.id})`,
      );
      assert(
        ['kritican', 'visok', 'srednji', 'nizak'].includes(p.prioritet),
        `prioritet '${p.prioritet}' mora biti validan (${p.id})`,
      );
    }
  });

  await test('akcije odgovaraju preporukama', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    for (const akcija of ciklus.akcije) {
      assertDefined(akcija.id, 'akcija.id');
      assertDefined(akcija.preporukaId, 'akcija.preporukaId');
      assertDefined(akcija.tip, 'akcija.tip');
      assertDefined(akcija.status, 'akcija.status');
      const preporuka = ciklus.dijagnostika.preporuke.find((p) => p.id === akcija.preporukaId);
      assertDefined(preporuka, `preporuka za akciju ${akcija.id}`);
    }
  });

  await test('getEvolucijskaIstorija vraća validnu istoriju', () => {
    const istorija = getEvolucijskaIstorija();
    assertDefined(istorija, 'istorija');
    assert(Array.isArray(istorija.ciklusi), 'ciklusi mora biti array');
    assert(istorija.ukupnoCiklusa >= 0, 'ukupnoCiklusa mora biti >= 0');
    assert(istorija.uspesnihCiklusa >= 0, 'uspesnihCiklusa mora biti >= 0');
    assert(
      istorija.uspesnihCiklusa <= istorija.ukupnoCiklusa,
      'uspesnihCiklusa ne sme biti > ukupnoCiklusa',
    );
  });

  await test('kreirajISnimiCiklus vraća validan ciklus (async, bez Supabase)', async () => {
    // U test okruženju Supabase nije konfigurisan — treba da vrati ciklus bez greške
    const ciklus = await kreirajISnimiCiklus();
    assertDefined(ciklus.id, 'ciklus.id');
    assertDefined(ciklus.pocetak, 'ciklus.pocetak');
    assertEqual(ciklus.status, 'zavrsen', 'status mora biti zavrsen');
    assert(ciklus.dijagnostika.zdravlje >= 0 && ciklus.dijagnostika.zdravlje <= 100, 'zdravlje 0-100');
  });

  await test('getEvolucijskaIstorijaAsync fallback na stub bez Supabase', async () => {
    // U test okruženju Supabase nije konfigurisan — mora da koristi sinhroni fallback
    const istorija = await getEvolucijskaIstorijaAsync();
    assertDefined(istorija, 'istorija');
    assert(Array.isArray(istorija.ciklusi), 'ciklusi mora biti array');
    assert(istorija.ukupnoCiklusa >= 1, 'mora biti bar 1 ciklus (stub fallback)');
    assertDefined(istorija.poslednjiCiklus, 'poslednjiCiklus');
  });

  // ── 5. Konzistentnost ID-jeva ─────────────────────────────────────────────
  console.log('\n🔑 Konzistentnost ID-jeva');

  await test('Evolucioni ciklusi imaju ispravan ID format', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    assert(ciklus.id.startsWith('ciklus-'), `ID mora početi sa 'ciklus-': ${ciklus.id}`);
  });

  await test('Plan ID-jevi su konzistentni (bez razmaka, lowercase)', () => {
    for (const plan of PLANOVI) {
      assert(!plan.id.includes(' '), `plan.id '${plan.id}' ne sme sadržati razmake`);
      assertEqual(plan.id, plan.id.toLowerCase(), `plan.id '${plan.id}' mora biti lowercase`);
    }
  });

  // ── Rezultati ─────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('─'.repeat(50));

  if (failures.length > 0) {
    console.log('\nNeuspešni testovi:');
    for (const f of failures) {
      console.log(`  - ${f}`);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err: unknown) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
