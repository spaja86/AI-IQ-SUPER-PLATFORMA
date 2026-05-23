// SpajaUltraOmegaCore -∞Ω+∞ — ANALIZA SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven izvor istine za celokupnu analizu ekosistema:
//   - Ekosistem KPI
//   - Infrastruktura
//   - Finansije
//   - Bezbednost
//   - Operativa & readiness
//   - Autofinish progres
//   - Protokoli & compliance
//   - Preporuke

import { getStatistike } from './statistika';
import { runDiagnostics } from './auto-repair';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { getAutofinishPetljaSummary, getAutofinishHealthSummary } from './autofinish-petlja';
import { autentifikacijaSistem } from './autentifikacija';
import { spajaPricingLogin } from './spaja-pricing-login';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PROTOKOLA,
  KOMPANIJA,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type AnalizaOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';

export interface AnalizaDomen {
  naziv: string;
  ocena: AnalizaOcena;
  score: number; // 0-100
  detalji: Record<string, unknown>;
}

export interface AnalizaSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;

  // Ukupni pregled
  ukupanScore: number;
  konacnaOcena: AnalizaOcena;
  procenatSpremnosti: number;

  // Domeni
  domeni: {
    ekosistem: AnalizaDomen;
    infrastruktura: AnalizaDomen;
    finansije: AnalizaDomen;
    bezbednost: AnalizaDomen;
    operativa: AnalizaDomen;
    autofinish: AnalizaDomen;
    protokoli: AnalizaDomen;
  };

  // Akcione preporuke
  preporuke: string[];

  timestamp: string;
}

// ─── Pomocne funkcije ─────────────────────────────────────────────────────────

function scoreToOcena(score: number): AnalizaOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

// ─── Agregacija ───────────────────────────────────────────────────────────────

/**
 * Gradi kompletnu analizu celokupnog ekosistema.
 * Koristi se i u /api/analiza-svega i u sekvence stranici.
 */
export function buildAnalizaSvega(): AnalizaSvega {
  const stats = getStatistike();
  const dijagnostika = runDiagnostics();
  const operativa = getOperativnaSpremnost();
  const autofinishSummary = getAutofinishPetljaSummary();
  const autofinishZdravlje = getAutofinishHealthSummary();

  // ── 1. Ekosistem ────────────────────────────────────────────────────────────
  const platformePokrivenost = stats.ukupnoPlatformi > 0
    ? Math.round((stats.aktivnihPlatformi / stats.ukupnoPlatformi) * 100)
    : 0;
  const ekosistemScore = Math.min(
    100,
    Math.round(
      (platformePokrivenost * 0.3) +
      (Math.min(stats.ukupnoPromptova, 30) / 30 * 100 * 0.2) +
      (Math.min(stats.ukupnoIgrica, 97) / 97 * 100 * 0.2) +
      (Math.min(stats.spajaProVerzija, 10) / 10 * 100 * 0.15) +
      (Math.min(stats.ukupnoOmegaPersona, 21) / 21 * 100 * 0.15),
    ),
  );

  const ekosistem: AnalizaDomen = {
    naziv: 'Ekosistem',
    ocena: scoreToOcena(ekosistemScore),
    score: ekosistemScore,
    detalji: {
      platforme: stats.ukupnoPlatformi,
      aktivnePlatforme: stats.aktivnihPlatformi,
      platformePokrivenost: `${platformePokrivenost}%`,
      promptovi: stats.ukupnoPromptova,
      igrice: stats.ukupnoIgrica,
      spajaProVerzija: stats.spajaProVerzija,
      omegaPersona: stats.ukupnoOmegaPersona,
      kompanije: stats.ukupnoKompanija,
      organizacije: stats.ukupnoOrganizacija,
    },
  };

  // ── 2. Infrastruktura ───────────────────────────────────────────────────────
  const infraScore = Math.min(
    100,
    Math.round(
      (dijagnostika.zdravlje * 0.4) +
      (Math.min(TOTAL_API_ROUTES, 1000) / 1000 * 100 * 0.3) +
      (stats.ukupnoMobilnihCentrala > 0 ? 100 : 0) * 0.15 +
      (stats.ukupnoProksiSignala > 0 ? 100 : 0) * 0.15,
    ),
  );

  const infrastruktura: AnalizaDomen = {
    naziv: 'Infrastruktura',
    ocena: scoreToOcena(infraScore),
    score: infraScore,
    detalji: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      stranica: TOTAL_PAGES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      zdravlje: `${dijagnostika.zdravlje}%`,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
      proksiSignala: stats.ukupnoProksiSignala,
      proksiCvorova: stats.ukupnoProksiCvorova,
      mobilnihCentrala: stats.ukupnoMobilnihCentrala,
      mobilnihServisa: stats.ukupnoMobilnihServisa,
      bazaStatus: stats.bazaStatus,
      bazaKolekcija: stats.bazaKolekcija,
      realtimeKanala: stats.realtimeKanala,
    },
  };

  // ── 3. Finansije ────────────────────────────────────────────────────────────
  const mesecniPrihod = spajaPricingLogin.planovi.reduce((s, p) => s + p.cenaMesecno, 0);
  const finansijeScore = Math.min(
    100,
    Math.round(
      (spajaPricingLogin.planovi.length >= 3 ? 100 : spajaPricingLogin.planovi.length / 3 * 100) * 0.4 +
      (spajaPricingLogin.loginMetode.length >= 2 ? 100 : 50) * 0.3 +
      (stats.platniProizvoda >= 3 ? 100 : stats.platniProizvoda / 3 * 100) * 0.3,
    ),
  );

  const finansije: AnalizaDomen = {
    naziv: 'Finansije',
    ocena: scoreToOcena(finansijeScore),
    score: finansijeScore,
    detalji: {
      pricingPlanovi: spajaPricingLogin.planovi.length,
      loginMetode: spajaPricingLogin.loginMetode.length,
      platniProizvoda: stats.platniProizvoda,
      mesecniPrihodPotencijal: mesecniPrihod,
      godisnjaPrihodPotencijal: spajaPricingLogin.planovi.reduce((s, p) => s + p.cenaGodisnje, 0),
      pricingStatus: spajaPricingLogin.status,
      platniStatus: stats.platniStatus,
    },
  };

  // ── 4. Bezbednost ───────────────────────────────────────────────────────────
  const bezbednostScore = Math.min(
    100,
    Math.round(
      (autentifikacijaSistem.status === 'aktivan' ? 100 : 0) * 0.4 +
      (autentifikacijaSistem.dozvole.length >= 5 ? 100 : autentifikacijaSistem.dozvole.length / 5 * 100) * 0.3 +
      (autentifikacijaSistem.konfiguracija.oauthProvajderi.length >= 2 ? 100 : 50) * 0.3,
    ),
  );

  const bezbednost: AnalizaDomen = {
    naziv: 'Bezbednost',
    ocena: scoreToOcena(bezbednostScore),
    score: bezbednostScore,
    detalji: {
      autentifikacijaStatus: autentifikacijaSistem.status,
      dozvole: autentifikacijaSistem.dozvole.length,
      mogucnosti: autentifikacijaSistem.mogucnosti.length,
      oauthProvajderi: autentifikacijaSistem.konfiguracija.oauthProvajderi.length,
      jwtAutentifikacija: true,
      dvofaktorDostupan: true,
      rbacNivoa: 5,
    },
  };

  // ── 5. Operativa & Readiness ────────────────────────────────────────────────
  const operativaScore = Math.min(100, Math.round(operativa.spremnost.ukupanScore));
  const acceptanceCriteria = operativa.spremnost.acceptanceCriteria;
  const acceptanceCriteriaIspunjeni =
    (acceptanceCriteria?.statusApi?.runtimeReady ?? false) &&
    (acceptanceCriteria?.statusApi?.opsReady ?? false);

  const operativa_domen: AnalizaDomen = {
    naziv: 'Operativa',
    ocena: scoreToOcena(operativaScore),
    score: operativaScore,
    detalji: {
      status: operativa.spremnost.status,
      ukupanScore: operativa.spremnost.ukupanScore,
      modelStanja: operativa.spremnost.modelStanja,
      acceptanceCriteria: acceptanceCriteriaIspunjeni,
      mailSpreman: operativa.spremnost.mail?.status,
      vercelSpreman: operativa.spremnost.vercel?.status,
      githubSpreman: operativa.spremnost.github?.status,
      enterpriseSpreman: operativa.spremnost.enterprise?.vercel,
      missingEnv: operativa.spremnost.missingEnv?.length ?? 0,
    },
  };

  // ── 6. Autofinish ────────────────────────────────────────────────────────────
  const autofinishProgressPct = Math.min(100, Math.round((AUTOFINISH_COUNT / 1500) * 100));
  const autofinishScore = Math.min(
    100,
    Math.round(
      (autofinishZdravlje.zdravlje * 0.5) +
      (autofinishProgressPct * 0.3) +
      (autofinishSummary.status === 'aktivan' ? 100 : 0) * 0.2,
    ),
  );

  const autofinish: AnalizaDomen = {
    naziv: 'Autofinish',
    ocena: scoreToOcena(autofinishScore),
    score: autofinishScore,
    detalji: {
      iteracija: AUTOFINISH_COUNT,
      status: autofinishSummary.status,
      zdravlje: `${autofinishZdravlje.zdravlje}%`,
      ukupnoProvera: autofinishZdravlje.ukupnoProvera,
      uspesnih: autofinishZdravlje.uspesnih,
      progresKa1500: `${autofinishProgressPct}%`,
    },
  };

  // ── 7. Protokoli & Compliance ───────────────────────────────────────────────
  const protokoliScore = Math.min(
    100,
    Math.round(
      (TOTAL_PROTOKOLA >= 10 ? 100 : TOTAL_PROTOKOLA / 10 * 100) * 0.6 +
      (operativa.spremnost.acceptanceCriteria ? 100 : 0) * 0.4,
    ),
  );

  const protokoli: AnalizaDomen = {
    naziv: 'Protokoli',
    ocena: scoreToOcena(protokoliScore),
    score: protokoliScore,
    detalji: {
      ukupnoProtokola: TOTAL_PROTOKOLA,
      acceptanceCriteria: operativa.spremnost.acceptanceCriteria,
      complianceStatus: 'aktivan',
    },
  };

  // ── Ukupni score ─────────────────────────────────────────────────────────────
  const domeni = { ekosistem, infrastruktura, finansije, bezbednost, operativa: operativa_domen, autofinish, protokoli };
  const domenScores = Object.values(domeni).map((d) => d.score);
  const ukupanScore = Math.round(domenScores.reduce((a, b) => a + b, 0) / domenScores.length);
  const procenatSpremnosti = ukupanScore;

  const konacnaOcena: AnalizaOcena = scoreToOcena(ukupanScore);

  // ── Preporuke ─────────────────────────────────────────────────────────────────
  const preporuke: string[] = [];
  if (finansijeScore < 90) preporuke.push('Aktivirati Stripe integraciju za prijem uplata');
  if (bezbednostScore < 90) preporuke.push('Konfigurisati produkcione OAuth ključeve (Google, GitHub)');
  if ((operativa.spremnost.missingEnv?.length ?? 0) > 0) preporuke.push(`Postaviti ${operativa.spremnost.missingEnv?.length ?? 0} nedostajućih env varijabli`);
  if (ekosistemScore < 90) preporuke.push('Aktivirati sve platforme u ekosistemu');
  if (infraScore < 90) preporuke.push('Optimizovati zdravlje dijagnostičkog sistema');
  preporuke.push('Konfigurisati monitoring i alerting za produkciju');
  preporuke.push('Testirati sve pricing planove end-to-end');
  if (autofinishScore < 90) preporuke.push('Nastaviti autofinish iteracije do punog pokrića');

  return {
    sistem: 'ANALIZA SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    konacnaOcena,
    procenatSpremnosti,
    domeni,
    preporuke,
    timestamp: new Date().toISOString(),
  };
}
