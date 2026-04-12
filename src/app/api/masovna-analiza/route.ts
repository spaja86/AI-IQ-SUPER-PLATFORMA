import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { APP_VERSION, KOMPANIJA, OMEGA_AI_PERSONA_UKUPNO, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_PAGES, TOTAL_IGRICA, AUTOFINISH_COUNT } from '@/lib/constants';
import { autentifikacijaSistem } from '@/lib/autentifikacija';
import { spajaPricingLogin } from '@/lib/spaja-pricing-login';

/**
 * GET /api/masovna-analiza — Masovna analiza celokupne Digitalne Industrije
 *
 * Vraca kompletnu analizu svih sistema, platformi, proizvoda, servisa
 * za procenu spremnosti industrije za pustanje u opticaj.
 */
export async function GET() {
  const stats = getStatistike();
  const dijagnostika = runDiagnostics();

  // Analiza spremnosti po kategorijama
  const platformeSpremnost = stats.aktivnihPlatformi > 0 ? (stats.aktivnihPlatformi / stats.ukupnoPlatformi) * 100 : 0;
  const zdravljeSistema = dijagnostika.zdravlje;
  const progresEkosistema = stats.ukupniProgres;

  // Finansijska analiza
  const finansijskaAnaliza = {
    pricingPlanovi: spajaPricingLogin.planovi.length,
    mesecniPrihodPotencijal: spajaPricingLogin.planovi.reduce(
      (sum, p) => sum + p.cenaMesecno,
      0,
    ),
    godisnjaPrihodPotencijal: spajaPricingLogin.planovi.reduce(
      (sum, p) => sum + p.cenaGodisnje,
      0,
    ),
    loginMetode: spajaPricingLogin.loginMetode.length,
    status: spajaPricingLogin.status,
  };

  // Bezbedonosna analiza
  const bezbedonosnaAnaliza = {
    autentifikacija: autentifikacijaSistem.status,
    dozvole: autentifikacijaSistem.dozvole.length,
    mogucnosti: autentifikacijaSistem.mogucnosti.length,
    dvofaktorDostupan: true,
    oauthProvajderi: autentifikacijaSistem.konfiguracija.oauthProvajderi.length,
    jwtAutentifikacija: true,
    rbacNivoa: 5,
  };

  // Ocena spremnosti
  const ocene = {
    platforme: platformeSpremnost >= 80 ? 'SPREMNO' : platformeSpremnost >= 50 ? 'DELIMICNO' : 'NIJE SPREMNO',
    zdravlje: zdravljeSistema >= 90 ? 'ODLICNO' : zdravljeSistema >= 70 ? 'DOBRO' : 'POTREBNO POBOLJSANJE',
    progres: progresEkosistema >= 80 ? 'SPREMNO' : progresEkosistema >= 50 ? 'DELIMICNO' : 'NIJE SPREMNO',
    bezbednost: bezbedonosnaAnaliza.autentifikacija === 'aktivan' ? 'SPREMNO' : 'NIJE SPREMNO',
    finansije: finansijskaAnaliza.pricingPlanovi >= 3 ? 'SPREMNO' : 'NIJE SPREMNO',
    login: finansijskaAnaliza.loginMetode >= 2 ? 'SPREMNO' : 'NIJE SPREMNO',
    infrastruktura: stats.ukupnoProksiSignala > 0 && stats.ukupnoMobilnihCentrala > 0 ? 'SPREMNO' : 'NIJE SPREMNO',
  };

  const ukupnoSpremnih = Object.values(ocene).filter((o) => o === 'SPREMNO' || o === 'ODLICNO').length;
  const ukupnoOcena = Object.keys(ocene).length;
  const procenatSpremnosti = Math.round((ukupnoSpremnih / ukupnoOcena) * 100);

  const konacnaOcena =
    procenatSpremnosti >= 80
      ? 'INDUSTRIJA SPREMNA ZA OPTICAJ'
      : procenatSpremnosti >= 50
        ? 'INDUSTRIJA DELIMICNO SPREMNA — potrebna poboljsanja'
        : 'INDUSTRIJA NIJE SPREMNA — kriticna poboljsanja potrebna';

  return NextResponse.json({
    sistem: 'Masovna Analiza — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,

    // Ukupna ocena
    konacnaOcena,
    procenatSpremnosti,
    ocene,

    // Statistike ekosistema
    ekosistem: {
      platforme: stats.ukupnoPlatformi,
      aktivnePlatforme: stats.aktivnihPlatformi,
      platformeSpremnost: `${Math.round(platformeSpremnost)}%`,
      itProizvodi: stats.ukupnoProizvoda,
      omegaAiPersona: OMEGA_AI_PERSONA_UKUPNO.toLocaleString(),
      spajaProVerzija: stats.spajaProVerzija,
      promptovi: stats.ukupnoPromptova,
      igrice: TOTAL_IGRICA,
      dimenzije: stats.ukupnoDimenzija,
      kompanije: stats.ukupnoKompanija,
      organizacije: stats.ukupnoOrganizacija,
    },

    // Infrastruktura
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      stranica: TOTAL_PAGES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      proksiSignala: stats.ukupnoProksiSignala,
      proksiCvorova: stats.ukupnoProksiCvorova,
      mobilnihCentrala: stats.ukupnoMobilnihCentrala,
      mobilnihServisa: stats.ukupnoMobilnihServisa,
    },

    // Zdravlje sistema
    zdravlje: {
      procenat: `${zdravljeSistema}%`,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
      progresEkosistema: `${progresEkosistema}%`,
    },

    // Finansijska analiza
    finansije: finansijskaAnaliza,

    // Bezbedonosna analiza
    bezbednost: bezbedonosnaAnaliza,

    // Backend infrastruktura
    backend: {
      bazaKolekcija: stats.bazaKolekcija,
      bazaDokumenata: stats.bazaDokumenata,
      bazaStatus: stats.bazaStatus,
      mejlSablona: stats.mejlSablona,
      mejlDomena: stats.mejlDomena,
      platniProizvoda: stats.platniProizvoda,
      realtimeKanala: stats.realtimeKanala,
      tvKanala: stats.tvKanala,
      monitoringStreamova: stats.monitoringLiveStreamova,
      blogClanaka: stats.blogClanaka,
      testSuita: stats.testSuita,
      testPokrivenost: `${stats.testPokrivenost}%`,
    },

    // Preporuke za opticaj
    preporuke: [
      'Aktivirati Stripe integraciju za prijem uplata',
      'Konfigurisati produkcione OAuth kljuceve (Google, GitHub)',
      'Postaviti produkcioni JWT secret u environment varijable',
      'Aktivirati email verifikaciju za nove korisnike',
      'Konfigurisati monitoring i alerting za produkciju',
      'Testirati sve pricing planove end-to-end',
      'Pripremiti marketing materijale za lansiranje',
      'Konfigurisati analytics za pracenje konverzija',
    ],

    timestamp: new Date().toISOString(),
  });
}
