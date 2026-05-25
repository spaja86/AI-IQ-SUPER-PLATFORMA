import type { Sekvenca } from '@/lib/types';
import { buildAnalizaSvega, type AnalizaPreporuka, type AnalizaTrendDirection } from '@/lib/analiza-svega';
import { KOMPANIJA, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_PAGES } from '@/lib/constants';
import { getCachedAnalizaSvega, setCachedAnalizaSvega } from '@/lib/analiza-svega-store';

const domenNazivi: Record<string, string> = {
  ekosistem: '🌐 Ekosistem',
  infrastruktura: '🏗️ Infrastruktura',
  finansije: '💰 Finansije',
  bezbednost: '🔒 Bezbednost',
  operativa: '⚙️ Operativa',
  autofinish: '♻️ Autofinish',
  protokoli: '📋 Protokoli',
};

function trendIkona(direction: AnalizaTrendDirection): string {
  switch (direction) {
    case 'up':
      return '🟢';
    case 'down':
      return '🔴';
    default:
      return '🟡';
  }
}

function preporukaIkona(klasa: AnalizaPreporuka['klasa'], prioritet: AnalizaPreporuka['prioritet']): string {
  if (klasa === 'blocking') return '🚨';
  if (prioritet === 'visok') return '⚠️';
  return 'ℹ️';
}

function formatPreviousScore(score: number | null): string {
  return score === null ? 'N/A' : `${score}%`;
}

function formatTrendTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('sr-RS', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export async function getAnalizaSvegaSekvence(): Promise<Sekvenca[]> {
  const cached = await getCachedAnalizaSvega();
  const analiza = cached ?? await buildAnalizaSvega();
  if (!cached) {
    await setCachedAnalizaSvega(analiza);
  }

  return [
  {
    id: 'analiza-svega-hero',
    tip: 'hero',
    naslov: '🔭 ANALIZA SVEGA — Digitalna Industrija',
    podnaslov: `Celokupna analiza ekosistema ${KOMPANIJA} — score ${analiza.ukupanScore}%`,
    ikona: '🔭',
    redosled: 1,
    podaci: {
      opis: `Jedinstven pregled svih domena: ekosistem, infrastruktura, finansije, bezbednost, operativa, autofinish i protokoli. Ukupna ocena: ${analiza.konacnaOcena} (${analiza.ukupanScore}%). Contract: ${analiza.meta.contractVersion}, model: ${analiza.meta.modelVersion}.`,
      dugmad: [
        { tekst: 'API: Analiza Svega', href: '/api/analiza-svega' },
        { tekst: 'Masovna Analiza', href: '/api/masovna-analiza', stil: 'sekundarno' },
        { tekst: 'Status Platforme', href: '/api/status', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'analiza-svega-kpi',
    tip: 'statistika',
    naslov: '📊 Ukupni KPI',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupan Score', vrednost: `${analiza.ukupanScore}%`, ikona: '🎯' },
        { naziv: 'Konačna Ocena', vrednost: analiza.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
        { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
        { naziv: 'Stranica', vrednost: TOTAL_PAGES, ikona: '📄' },
        { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
        { naziv: 'Trend', vrednost: `${analiza.trend.deltaScore >= 0 ? '+' : ''}${analiza.trend.deltaScore}% (${analiza.trend.direction})`, ikona: '📈' },
        { naziv: 'Kritični domeni', vrednost: analiza.kriticniDomeni.length, ikona: '🚨' },
        { naziv: 'Contract', vrednost: analiza.meta.contractVersion, ikona: '🧾' },
      ],
    },
  },
  {
    id: 'analiza-svega-domeni',
    tip: 'tabela',
    naslov: '📋 Score po domenima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Domen', 'Score', 'Ocena', 'Confidence', 'Freshness', 'Izvori'],
      redovi: Object.entries(analiza.domeni).map(([kljuc, domen]) => [
        domenNazivi[kljuc] ?? domen.naziv,
        `${domen.score}%`,
        domen.ocena.replace(/_/g, ' '),
        `${domen.confidence}%`,
        domen.freshness,
        domen.izvori.join(', '),
      ]),
    },
  },
  {
    id: 'analiza-svega-ekosistem',
    tip: 'kartice',
    naslov: '🌐 Ekosistem',
    redosled: 4,
    podaci: {
      kartice: [
        {
          naslov: `Platforme: ${analiza.domeni.ekosistem.detalji.aktivnePlatforme}/${analiza.domeni.ekosistem.detalji.platforme}`,
          opis: `Aktivnost: ${analiza.domeni.ekosistem.detalji.platformePokrivenost}`,
          ikona: '🧩',
          oznake: ['platforme'],
        },
        {
          naslov: `Promptovi: ${analiza.domeni.ekosistem.detalji.promptovi}`,
          opis: 'SpajaPro Prompt Engine',
          ikona: '💬',
          oznake: ['prompt'],
        },
        {
          naslov: `Igrice: ${analiza.domeni.ekosistem.detalji.igrice}`,
          opis: 'Kompletna gejming industrija',
          ikona: '🎮',
          oznake: ['igrice'],
        },
        {
          naslov: `OMEGA AI: ${analiza.domeni.ekosistem.detalji.omegaPersona} persona`,
          opis: `SpajaPro v${analiza.domeni.ekosistem.detalji.spajaProVerzija} verzija`,
          ikona: '🧠',
          oznake: ['omega-ai'],
        },
        {
          naslov: `Kompanije: ${analiza.domeni.ekosistem.detalji.kompanije}`,
          opis: `Organizacije: ${analiza.domeni.ekosistem.detalji.organizacije}`,
          ikona: '🏢',
          oznake: ['entiteti'],
        },
        {
          naslov: `Score: ${analiza.domeni.ekosistem.score}%`,
          opis: analiza.domeni.ekosistem.ocena.replace(/_/g, ' '),
          ikona: '📈',
          oznake: [analiza.domeni.ekosistem.ocena],
        },
      ],
    },
  },
  {
    id: 'analiza-svega-infra-bezbednost',
    tip: 'kartice',
    naslov: '🏗️ Infrastruktura & 🔒 Bezbednost',
    redosled: 5,
    podaci: {
      kartice: [
        {
          naslov: `API Rute: ${analiza.domeni.infrastruktura.detalji.apiRuta}`,
          opis: `Zdravlje: ${analiza.domeni.infrastruktura.detalji.zdravlje}`,
          ikona: '🔌',
          oznake: ['infra'],
        },
        {
          naslov: `Dijagnostika: ${analiza.domeni.infrastruktura.detalji.ukupnoProvera}`,
          opis: `Uspešnih: ${analiza.domeni.infrastruktura.detalji.uspesnih}`,
          ikona: '🔍',
          oznake: ['dijagnostika'],
        },
        {
          naslov: `Proksi signala: ${analiza.domeni.infrastruktura.detalji.proksiSignala}`,
          opis: `Mobilnih centrala: ${analiza.domeni.infrastruktura.detalji.mobilnihCentrala}`,
          ikona: '📡',
          oznake: ['proksi'],
        },
        {
          naslov: `Autentifikacija: ${analiza.domeni.bezbednost.detalji.autentifikacijaStatus}`,
          opis: `Dozvole: ${analiza.domeni.bezbednost.detalji.dozvole}, OAuth: ${analiza.domeni.bezbednost.detalji.oauthProvajderi}`,
          ikona: '🔑',
          oznake: ['auth'],
        },
        {
          naslov: `RBAC: ${analiza.domeni.bezbednost.detalji.rbacNivoa} nivoa`,
          opis: 'JWT + 2FA dostupno',
          ikona: '🛡️',
          oznake: ['rbac'],
        },
        {
          naslov: `Bezbednost: ${analiza.domeni.bezbednost.score}%`,
          opis: analiza.domeni.bezbednost.ocena.replace(/_/g, ' '),
          ikona: '🔒',
          oznake: [analiza.domeni.bezbednost.ocena],
        },
      ],
    },
  },
  {
    id: 'analiza-svega-finansije-operativa',
    tip: 'kartice',
    naslov: '💰 Finansije & ⚙️ Operativa',
    redosled: 6,
    podaci: {
      kartice: [
        {
          naslov: `Pricing planovi: ${analiza.domeni.finansije.detalji.pricingPlanovi}`,
          opis: `Platni proizvodi: ${analiza.domeni.finansije.detalji.platniProizvoda}`,
          ikona: '💳',
          oznake: ['pricing'],
        },
        {
          naslov: `Login metode: ${analiza.domeni.finansije.detalji.loginMetode}`,
          opis: `Status: ${analiza.domeni.finansije.detalji.pricingStatus}`,
          ikona: '🔐',
          oznake: ['login'],
        },
        {
          naslov: `Finansije: ${analiza.domeni.finansije.score}%`,
          opis: analiza.domeni.finansije.ocena.replace(/_/g, ' '),
          ikona: '📊',
          oznake: [analiza.domeni.finansije.ocena],
        },
        {
          naslov: `Operativa: ${analiza.domeni.operativa.score}%`,
          opis: `Status: ${analiza.domeni.operativa.detalji.status}`,
          ikona: '⚙️',
          oznake: ['operativa'],
        },
        {
          naslov: `Vercel: ${analiza.domeni.operativa.detalji.vercelSpreman ?? 'N/A'}`,
          opis: `GitHub: ${analiza.domeni.operativa.detalji.githubSpreman ?? 'N/A'}`,
          ikona: '🚀',
          oznake: ['deploy'],
        },
        {
          naslov: `Missing env: ${analiza.domeni.operativa.detalji.missingEnv}`,
          opis: analiza.domeni.operativa.ocena.replace(/_/g, ' '),
          ikona: analiza.domeni.operativa.detalji.missingEnv === 0 ? '✅' : '⚠️',
          oznake: ['env'],
        },
      ],
    },
  },
  {
    id: 'analiza-svega-autofinish-protokoli',
    tip: 'kartice',
    naslov: '♻️ Autofinish & 📋 Protokoli',
    redosled: 7,
    podaci: {
      kartice: [
        {
          naslov: `Iteracija: #${analiza.domeni.autofinish.detalji.iteracija}`,
          opis: `Status: ${analiza.domeni.autofinish.detalji.status}`,
          ikona: '♻️',
          oznake: ['autofinish'],
        },
        {
          naslov: `Zdravlje: ${analiza.domeni.autofinish.detalji.zdravlje}`,
          opis: `Uspešnih provera: ${analiza.domeni.autofinish.detalji.uspesnih}`,
          ikona: '🩺',
          oznake: ['zdravlje'],
        },
        {
          naslov: `Progres ka 1500: ${analiza.domeni.autofinish.detalji.progresKa1500}`,
          opis: analiza.domeni.autofinish.ocena.replace(/_/g, ' '),
          ikona: '📈',
          oznake: [analiza.domeni.autofinish.ocena],
        },
        {
          naslov: `Protokola: ${analiza.domeni.protokoli.detalji.ukupnoProtokola}`,
          opis: `Compliance: ${analiza.domeni.protokoli.detalji.complianceStatus}`,
          ikona: '📋',
          oznake: ['protokoli'],
        },
        {
          naslov: `Protokoli: ${analiza.domeni.protokoli.score}%`,
          opis: analiza.domeni.protokoli.ocena.replace(/_/g, ' '),
          ikona: '✅',
          oznake: [analiza.domeni.protokoli.ocena],
        },
        {
          naslov: `Acceptance Criteria: ${analiza.domeni.protokoli.detalji.acceptanceCriteria ? 'ispunjeni' : 'u pripremi'}`,
          opis: 'Operativna usklađenost',
          ikona: '🎯',
          oznake: ['compliance'],
        },
      ],
    },
  },
  {
    id: 'analiza-svega-preporuke',
    tip: 'lista',
    naslov: '📌 Akcione Preporuke',
    redosled: 8,
    podaci: {
      stavke: analiza.preporukeDetaljno.map((preporuka) => ({
        ikona: preporukaIkona(preporuka.klasa, preporuka.prioritet),
        naslov: preporuka.poruka,
        opis: `${preporuka.klasa.toUpperCase()} • prioritet ${preporuka.prioritet} • domeni: ${preporuka.domeni.join(', ')}`,
      })),
    },
  },
  {
    id: 'analiza-svega-trend-kriticni',
    tip: 'kartice',
    naslov: '📈 Trend & Kritični Domeni',
    redosled: 9,
    podaci: {
      kartice: [
        {
          naslov: `Trend: ${analiza.trend.direction}`,
          opis: `Promena skora: ${analiza.trend.deltaScore >= 0 ? '+' : ''}${analiza.trend.deltaScore}%`,
          ikona: trendIkona(analiza.trend.direction),
          oznake: ['trend'],
        },
        {
          naslov: `Prethodni score: ${formatPreviousScore(analiza.trend.previousScore)}`,
          opis: `Trenutni score: ${analiza.trend.currentScore}% • pouzdanost trenda: ${analiza.trend.reliable ? 'visoka' : 'ograničena'}`,
          ikona: '🧮',
          oznake: ['history'],
        },
        {
          naslov: `Kritični domeni: ${analiza.kriticniDomeni.length}`,
          opis: analiza.kriticniDomeni.length > 0 ? analiza.kriticniDomeni.join(', ') : 'Nema kritičnih domena',
          ikona: '🚨',
          oznake: ['critical'],
        },
        {
          naslov: `Degradacija izvora: ${analiza.meta.degraded ? 'DA' : 'NE'}`,
          opis: analiza.meta.degradedSources.length > 0 ? analiza.meta.degradedSources.join(', ') : 'Svi izvori aktivni',
          ikona: analiza.meta.degraded ? '⚠️' : '✅',
          oznake: ['source-health'],
        },
      ],
    },
  },
  {
    id: 'analiza-svega-trend-historija',
    tip: 'tabela',
    naslov: '🗂️ Istorija trenda (30 snimaka)',
    redosled: 10,
    podaci: {
      zaglavlje: ['Timestamp', 'Ukupan score'],
      redovi: analiza.trendHistorija
        .slice()
        .reverse()
        .map((snapshot) => [formatTrendTimestamp(snapshot.timestamp), `${snapshot.ukupanScore}%`]),
    },
  },
  {
    id: 'analiza-svega-cta',
    tip: 'cta',
    naslov: '🔭 Analiza Svega — Pokretanje',
    redosled: 11,
    podaci: {
      opis: `Celokupna analiza Digitalne Industrije. Ukupan score: ${analiza.ukupanScore}% — ${analiza.konacnaOcena.replace(/_/g, ' ')}. Koristite /api/analiza-svega za programatski pristup svim domenima.`,
      dugmad: [
        { tekst: 'Pokreni API analizu', href: '/api/analiza-svega' },
        { tekst: 'Status sistema', href: '/api/status', stil: 'sekundarno' },
        { tekst: 'Masovna analiza', href: '/api/masovna-analiza', stil: 'sekundarno' },
      ],
    },
  },
  ];
}
