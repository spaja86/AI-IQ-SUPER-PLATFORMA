import type { Sekvenca } from '@/lib/types';
import { buildEktond } from '@/lib/ektond';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';

function momentumIkona(momentum: 'bullish' | 'bearish' | 'neutral'): string {
  if (momentum === 'bullish') return '🟢';
  if (momentum === 'bearish') return '🔴';
  return '🟡';
}

function trendIkona(direction: 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable'): string {
  if (direction === 'accelerating') return '🚀';
  if (direction === 'rising') return '📈';
  if (direction === 'decelerating') return '🔻';
  if (direction === 'falling') return '📉';
  return '➡️';
}

export async function getEktondSekvence(): Promise<Sekvenca[]> {
  const e = await buildEktond();

  return [
    {
      id: 'ektond-hero',
      tip: 'hero',
      naslov: '🔵 EKTOND — EKSTREMNI KONDENZATOR TOKOVA NADZORA DIGITALNOG',
      podnaslov: `${KOMPANIJA} — Ukupan Score: ${e.ukupanScore}% • Velocity: ${e.ukupnaVelocity >= 0 ? '+' : ''}${e.ukupnaVelocity} • ${momentumIkona(e.trendMomentum)} ${e.trendMomentum.toUpperCase()}`,
      ikona: '🔵',
      redosled: 1,
      podaci: {
        opis: `Cross-domain kondenzacija platformskih tokova kroz 6 domena: ANALIZA + POTENCIJAL + WORLD BANK + CALL CENTAR + PROKSI + GEJMING. Contract: ${e.meta.contractVersion}, model: ${e.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: EKTOND', href: '/api/ektond' },
          { tekst: 'EKSTRENDEND', href: '/ekstrendend', stil: 'sekundarno' },
          { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
          { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'ektond-kpi',
      tip: 'statistika',
      naslov: '📊 EKTOND KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${e.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: e.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          {
            naziv: 'Momentum',
            vrednost: `${momentumIkona(e.trendMomentum)} ${e.trendMomentum.toUpperCase()}`,
            ikona: '🔵',
          },
          {
            naziv: 'Ukupna Velocity',
            vrednost: `${e.ukupnaVelocity >= 0 ? '+' : ''}${e.ukupnaVelocity}`,
            ikona: '⚡',
          },
          { naziv: 'Domeni', vrednost: Object.keys(e.domeni).length, ikona: '🧩' },
          { naziv: 'Kritični domeni', vrednost: e.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snimci', vrednost: e.trendSnapshotCount, ikona: '📷' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          {
            naziv: 'Prosečan confidence',
            vrednost: (() => {
              const domenValues = Object.values(e.domeni);
              if (domenValues.length === 0) return '0%';
              return `${Math.round(domenValues.reduce((sum, d) => sum + d.confidence, 0) / domenValues.length)}%`;
            })(),
            ikona: '🎛️',
          },
        ],
      },
    },
    {
      id: 'ektond-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 6 domena — velocity, momentum i SLA pragovi',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA prag', 'Confidence', 'Težina', 'Source of Truth'],
        redovi: Object.values(e.domeni).map((domen) => [
          domen.naziv,
          `${domen.score}%`,
          `${domen.velocity >= 0 ? '+' : ''}${domen.velocity}`,
          `${trendIkona(domen.trendDirection)} ${domen.trendDirection}`,
          `${momentumIkona(domen.momentum)} ${domen.momentum}`,
          `${domen.slaThreshold}%`,
          `${domen.confidence}%`,
          `${Math.round(domen.tezina * 100)}%`,
          domen.sourceOfTruth,
        ]),
      },
    },
    {
      id: 'ektond-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres EKTOND',
      redosled: 4,
      podaci: {
        procenat: e.ukupanScore,
        oznaka: `${e.konacnaOcena.replace(/_/g, ' ')} • Velocity ${e.ukupnaVelocity >= 0 ? '+' : ''}${e.ukupnaVelocity} • ${e.trendMomentum.toUpperCase()} momentum`,
      },
    },
    {
      id: 'ektond-preporuke',
      tip: 'lista',
      naslov: '📌 Kondenzacija tokova i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...(e.kriticniDomeni.length > 0
            ? e.kriticniDomeni.map((naziv) => `⚠️ ${naziv}`)
            : ['✅ Nema kritičnih domena ispod SLA praga.']),
          ...e.preporuke.map((p) => `📌 ${p}`),
        ],
      },
    },
    {
      id: 'ektond-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 10)',
      redosled: 6,
      podaci: {
        zaglavlje: ['#', 'Score', 'Velocity', 'Timestamp'],
        redovi: e.history.length > 0
          ? e.history.map((entry, i) => [
              String(i + 1),
              `${entry.score}%`,
              `${entry.velocity >= 0 ? '+' : ''}${entry.velocity}`,
              entry.timestamp,
            ])
          : [['—', '—', '—', 'Nema prethodnih snimaka']],
      },
    },
    {
      id: 'ektond-cta',
      tip: 'cta',
      naslov: '🔵 Kanonski EKTOND endpoint',
      redosled: 99,
      podaci: {
        opis: `Koristite /api/ektond kao V1 kondenzacioni source-of-truth za svih 6 domena. ${KOMPANIJA} — Ekstremni Kondenzator Tokova Nadzora Digitalnog.`,
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${e.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: e.trendMomentum, ikona: momentumIkona(e.trendMomentum) },
          { naziv: 'Velocity', vrednost: `${e.ukupnaVelocity >= 0 ? '+' : ''}${e.ukupnaVelocity}`, ikona: '⚡' },
          { naziv: 'Degradacija', vrednost: e.meta.degraded ? 'DA' : 'NE', ikona: e.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: e.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/ektond' },
          { tekst: 'EKSTRENDEND', href: '/api/ekstrendend', stil: 'sekundarno' },
          { tekst: 'Analiza Svega', href: '/api/analiza-svega', stil: 'sekundarno' },
          { tekst: 'AI IQ World Bank', href: '/api/ai-iq-world-bank', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
