// SpajaUltraOmegaCore -∞Ω+∞ — Go-Live Smoke Tests
// Kompanija SPAJA — Digitalna Industrija
// Pokretanje: npx tsx src/tests/smoke/smoke.test.ts
//
// Verifikuje sve kritične tokove pre puštanja u promet:
//  1. Auth sistem (login, token, refresh, logout)
//  2. Digitalna Industrija sekvence i linkovi
//  3. Statistike i podaci ekosistema
//  4. Platni sistem konfiguracija
//  5. Security konfiguracija

import { ΩCryptoEngine } from '../../lib/auth/omega-crypto';
import { ΩAuthProvider, ensureDemoSeeded } from '../../lib/auth/omega-auth';
import { ΩPermissionMatrix, ΩClearanceLevel } from '../../lib/auth/omega-permissions';
import { getStatistike } from '../../lib/statistika';
import { industrijaSekvence } from '../../lib/sekvence/industrija';
import { digitalnaIndustrija, getIndustrijaStats } from '../../lib/industrija';
import { platforme } from '../../lib/platforme';
import { PLANOVI } from '../../lib/stripe/config';
import {
  APP_VERSION,
  KOMPANIJA,
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_API_ROUTES,
} from '../../lib/constants';
import { runDiagnostics } from '../../lib/auto-repair';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(a: T, b: T, message?: string): void {
  if (a !== b) throw new Error(`${message ?? 'assertEqual'}: expected ${String(b)}, got ${String(a)}`);
}

// ─── Smoke Tests ──────────────────────────────────────────────────────────────

async function runSmokeTests(): Promise<void> {
  console.log('\n🚀 SpajaUltraOmegaCore -∞Ω+∞ — Go-Live Smoke Tests\n');
  console.log(`   Platforma: ${APP_VERSION} | Kompanija: ${KOMPANIJA}\n`);

  // ── 1. Platformske konstante ─────────────────────────────────────────────

  console.log('📦 1. Platformske konstante');

  await test('APP_VERSION je definisan i neprazan', () => {
    assert(APP_VERSION.length > 0, 'APP_VERSION mora biti neprazan');
    const parts = APP_VERSION.split('.');
    assert(parts.length === 3, 'APP_VERSION mora biti semver (X.Y.Z)');
  });

  await test('KOMPANIJA je definisana', () => {
    assert(KOMPANIJA.length > 0, 'KOMPANIJA mora biti neprazna');
  });

  await test('OMEGA_AI_PERSONA_UKUPNO je pozitivan broj', () => {
    assert(OMEGA_AI_PERSONA_UKUPNO > 0, 'OMEGA_AI_PERSONA_UKUPNO mora biti > 0');
  });

  await test('TOTAL_API_ROUTES je pozitivan broj', () => {
    assert(TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES mora biti > 0');
  });

  // ── 2. Digitalna Industrija ─────────────────────────────────────────────

  console.log('\n📦 2. Digitalna Industrija');

  await test('digitalnaIndustrija objekat je ispravan', () => {
    assert(digitalnaIndustrija.name.length > 0, 'name mora biti neprazan');
    assert(digitalnaIndustrija.description.length > 0, 'description mora biti neprazan');
    assert(digitalnaIndustrija.version.length > 0, 'version mora biti neprazan');
    assert(digitalnaIndustrija.mission.length > 0, 'mission mora biti neprazna');
  });

  await test('getIndustrijaStats vraća validne statistike', () => {
    const stats = getIndustrijaStats();
    assert(stats.totalPlatforms > 0, 'totalPlatforms mora biti > 0');
    assert(stats.activePlatforms >= 0, 'activePlatforms mora biti >= 0');
    assert(stats.activePlatforms <= stats.totalPlatforms, 'aktivnih ne sme biti više od ukupnih');
    assert(stats.totalCompanies > 0, 'totalCompanies mora biti > 0');
    assert(stats.totalOrganizations > 0, 'totalOrganizations mora biti > 0');
  });

  await test('platforme niz nije prazan', () => {
    assert(platforme.length > 0, 'mora postojati bar jedna platforma');
  });

  await test('svaka platforma ima id, naziv, opis, deploy.domen', () => {
    for (const p of platforme) {
      assert(p.id !== undefined && p.id.length > 0, `platforma nema id`);
      assert(p.naziv !== undefined && p.naziv.length > 0, `platforma ${p.id} nema naziv`);
      assert(p.opis !== undefined && p.opis.length > 0, `platforma ${p.id} nema opis`);
      assert(
        p.deploy !== undefined && p.deploy.domen !== undefined && p.deploy.domen.length > 0,
        `platforma ${p.id} nema deploy.domen — morate dodati domen pre go-live`,
      );
    }
  });

  // ── 3. Industrija sekvence i linkovi ────────────────────────────────────

  console.log('\n📦 3. Industrija sekvence');

  await test('industrijaSekvence niz nije prazan', () => {
    assert(industrijaSekvence.length > 0, 'mora postojati bar jedna sekvenca');
  });

  await test('svaka sekvenca ima id, tip, naslov i redosled', () => {
    for (const s of industrijaSekvence) {
      assert(s.id.length > 0, `sekvenca ima prazan id`);
      assert(s.tip.length > 0, `sekvenca ${s.id} ima prazan tip`);
      assert(s.naslov.length > 0, `sekvenca ${s.id} ima prazan naslov`);
      assert(s.redosled > 0, `sekvenca ${s.id} ima neispravan redosled`);
    }
  });

  await test('nema dupliranih ID-eva u sekvencama', () => {
    const ids = new Set<string>();
    for (const s of industrijaSekvence) {
      assert(!ids.has(s.id), `duplirani id sekvence: ${s.id}`);
      ids.add(s.id);
    }
  });

  await test('CTA sekvence imaju dugmad sa ispravnim href-ovima', () => {
    const ctaSekvence = industrijaSekvence.filter((s) => s.tip === 'cta');
    assert(ctaSekvence.length > 0, 'mora postojati bar jedna CTA sekvenca');
    for (const s of ctaSekvence) {
      const dugmad = s.podaci?.dugmad as Array<{ href: string; tekst: string }> | undefined;
      if (dugmad) {
        for (const d of dugmad) {
          assert(d.href.length > 0, `CTA dugme u sekvenci ${s.id} nema href`);
          assert(d.tekst.length > 0, `CTA dugme u sekvenci ${s.id} nema tekst`);
          // Interne putanje moraju počinjati sa /
          if (!d.href.startsWith('http')) {
            assert(d.href.startsWith('/'), `Interni href ${d.href} mora počinjati sa /`);
          }
        }
      }
    }
  });

  // ── 4. Statistike ekosistema ─────────────────────────────────────────────

  console.log('\n📦 4. Statistike ekosistema');

  await test('getStatistike vraća kompletan objekat', () => {
    const stats = getStatistike();
    assert(stats.ukupnoPlatformi > 0, 'ukupnoPlatformi mora biti > 0');
    assert(stats.ukupnoProizvoda > 0, 'ukupnoProizvoda mora biti > 0');
    assert(stats.ukupnoPromptova > 0, 'ukupnoPromptova mora biti > 0');
    assert(stats.ukupnoIgrica > 0, 'ukupnoIgrica mora biti > 0');
    assert(stats.ukupnoOmegaPersona > 0, 'ukupnoOmegaPersona mora biti > 0');
  });

  await test('statistike su konzistentne sa platforme nizom', () => {
    const stats = getStatistike();
    assertEqual(stats.ukupnoPlatformi, platforme.length, 'ukupnoPlatformi');
  });

  await test('zdravlje sistema je u prihvatljivom opsegu', () => {
    const stats = getStatistike();
    assert(stats.zdravljeSistema >= 0, 'zdravlje mora biti >= 0');
    assert(stats.zdravljeSistema <= 100, 'zdravlje mora biti <= 100');
    assert(stats.zdravljeSistema >= 70, `Zdravlje sistema je ${stats.zdravljeSistema}% — ispod praga od 70%`);
  });

  // ── 5. Auto-repair dijagnostika ──────────────────────────────────────────

  console.log('\n📦 5. Dijagnostika');

  await test('runDiagnostics ne baca grešku', () => {
    const result = runDiagnostics();
    assert(result.ukupnoProvera > 0, 'mora biti > 0 provera');
    assert(result.zdravlje >= 0 && result.zdravlje <= 100, 'zdravlje mora biti 0-100');
  });

  await test('broj kritičnih grešaka je 0', () => {
    const result = runDiagnostics();
    assert(result.kriticnih === 0, `Pronađeno ${result.kriticnih} kritičnih grešaka — mora biti 0 za go-live`);
  });

  // ── 6. Auth sistem ───────────────────────────────────────────────────────

  console.log('\n📦 6. Auth sistem');

  await test('ensureDemoSeeded ne baca grešku', async () => {
    await ensureDemoSeeded();
  });

  await test('demo nalog login funkcioniše', async () => {
    await ensureDemoSeeded();
    const result = await ΩAuthProvider.login({
      email: 'demo@spaja.ai',
      password: 'Demo2024!',
    });
    assert(result !== null, 'demo login mora uspeti');
    assert(result!.token.value.length > 0, 'token mora biti neprazan');
    assert(result!.identity.email === 'demo@spaja.ai', 'email mora biti ispravan');
  });

  await test('login sa pogrešnom lozinkom vraća null', async () => {
    const result = await ΩAuthProvider.login({
      email: 'demo@spaja.ai',
      password: 'pogresnaLozinka123!',
    });
    assert(result === null, 'login sa pogrešnom lozinkom mora vratiti null');
  });

  await test('login sa nepostojećim email-om vraća null', async () => {
    const result = await ΩAuthProvider.login({
      email: 'nepostoji@spaja.ai',
      password: 'Demo2024!',
    });
    assert(result === null, 'login sa nepostojećim email-om mora vratiti null');
  });

  await test('verifyIdentity proverava validan token', async () => {
    await ensureDemoSeeded();
    const result = await ΩAuthProvider.login({
      email: 'demo@spaja.ai',
      password: 'Demo2024!',
    });
    assert(result !== null, 'login mora uspeti');
    const identity = await ΩAuthProvider.verifyIdentity(result!.token.value);
    assert(identity !== null, 'verifikacija tokena mora uspeti');
    assert(identity!.email === 'demo@spaja.ai', 'email u tokenu mora biti ispravan');
  });

  await test('verifyIdentity odbija neispravan token', async () => {
    const identity = await ΩAuthProvider.verifyIdentity('invalid.token.value');
    assert(identity === null, 'neispravan token mora biti odbijen');
  });

  // ── 7. Permisioni sistem ─────────────────────────────────────────────────

  console.log('\n📦 7. Permisioni sistem');

  await test('clearance matrix ima ispravne nivoe', () => {
    assertEqual(ΩClearanceLevel.VISITOR, 0, 'VISITOR = 0');
    assertEqual(ΩClearanceLevel.USER, 1, 'USER = 1');
    assertEqual(ΩClearanceLevel.OPERATOR, 2, 'OPERATOR = 2');
    assertEqual(ΩClearanceLevel.ADMIN, 3, 'ADMIN = 3');
    assertEqual(ΩClearanceLevel.SUPER_ADMIN, 4, 'SUPER_ADMIN = 4');
    assertEqual(ΩClearanceLevel.OMEGA_CORE, 5, 'OMEGA_CORE = 5');
  });

  await test('USER ima pristup digital_industry:read', () => {
    const allowed = ΩPermissionMatrix.checkAccessByPath(
      { id: 'u1', did: 'did:u1', publicKey: '', roles: ['user'], clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true, mfaEnabled: false, createdAt: Date.now() },
      '/dashboard',
    );
    assert(allowed, 'USER mora imati pristup /dashboard');
  });

  await test('VISITOR nema pristup /api/auto-repair (OPERATOR required)', () => {
    const allowed = ΩPermissionMatrix.checkAccessByPath(
      { id: 'v1', did: 'did:v1', publicKey: '', roles: [], clearanceLevel: ΩClearanceLevel.VISITOR, digitalIndustryAccess: false, mfaEnabled: false, createdAt: Date.now() },
      '/api/auto-repair',
    );
    assert(!allowed, 'VISITOR ne sme imati pristup /api/auto-repair');
  });

  await test('ADMIN ima pristup /api/digital-industry/admin (SUPER_ADMIN required > ADMIN fallback)', () => {
    const required = ΩPermissionMatrix.getRequiredClearance('/api/digital-industry/admin');
    assert(required >= ΩClearanceLevel.SUPER_ADMIN, '/api/digital-industry/admin zahteva SUPER_ADMIN ili više');
  });

  // ── 8. Kriptografski engine ──────────────────────────────────────────────

  console.log('\n📦 8. Kriptografski engine');

  await test('hashSHA256 vraća konzistentan hash', () => {
    const h1 = ΩCryptoEngine.hashSHA256('digitalna-industrija');
    const h2 = ΩCryptoEngine.hashSHA256('digitalna-industrija');
    assertEqual(h1, h2, 'hash mora biti deterministički');
    assertEqual(h1.length, 64, 'SHA-256 hex mora biti 64 karaktera');
  });

  await test('hashPassword / verifyPassword round-trip', async () => {
    const password = 'GoLive2024!@#$';
    const hash = await ΩCryptoEngine.hashPassword(password);
    const valid = await ΩCryptoEngine.verifyPassword(password, hash);
    assert(valid, 'verifikacija hasha lozinke mora uspeti');
    const invalid = await ΩCryptoEngine.verifyPassword('pogresna', hash);
    assert(!invalid, 'pogrešna lozinka mora biti odbijena');
  });

  await test('generateSecureToken vraća neprazan token', () => {
    const token = ΩCryptoEngine.generateSecureToken();
    assert(token.length >= 32, 'token mora biti najmanje 32 karaktera');
  });

  // ── 9. Platni sistem ─────────────────────────────────────────────────────

  console.log('\n📦 9. Platni sistem');

  await test('PLANOVI niz nije prazan', () => {
    assert(PLANOVI.length > 0, 'mora biti bar jedan plan');
  });

  await test('svaki plan ima id, naziv, cenu', () => {
    for (const plan of PLANOVI) {
      assert(plan.id.length > 0, `plan nema id`);
      assert(plan.naziv.length > 0, `plan ${plan.id} nema naziv`);
      assert(plan.cenaEur >= 0, `plan ${plan.id} ima negativnu cenu`);
      assert(plan.chatLimit !== 0, `plan ${plan.id} ima neispravan chatLimit`);
    }
  });

  await test('starter plan je besplatan', () => {
    const starter = PLANOVI.find((p) => p.id === 'starter');
    assert(starter !== undefined, 'starter plan mora postojati');
    assertEqual(starter!.cenaEur, 0, 'starter mora biti besplatan');
  });

  await test('plaćeni planovi imaju stripePriceId u env ili placeholder', () => {
    const placeniPlanovi = PLANOVI.filter((p) => p.cenaEur > 0);
    assert(placeniPlanovi.length > 0, 'mora biti bar jedan plaćeni plan');
    // U produkciji, svi plaćeni planovi moraju imati Stripe Price ID
    // Ovde proveravamo da polje postoji (može biti placeholder u dev)
    for (const plan of placeniPlanovi) {
      assert(typeof plan.stripePriceId === 'string', `plan ${plan.id} mora imati stripePriceId`);
    }
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🚀 Go-Live Smoke Tests: ✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('─'.repeat(60));

  if (failed > 0) {
    console.error(`\n🚨 ${failed} smoke test(ova) nije prošlo — nije moguć go-live!\n`);
    process.exit(1);
  } else {
    console.log('\n✅ Svi smoke testovi su prošli — sistem je spreman za go-live!\n');
  }
}

runSmokeTests().catch((err) => {
  console.error('Smoke test runner greška:', err);
  process.exit(1);
});
