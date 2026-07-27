import type { Sekvenca } from '@/lib/types';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';
import { buildIndukcija } from '@/lib/indukcija';

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

function formatVelocity(velocity: number): string {
  return `${velocity >= 0 ? '+' : ''}${velocity}`;
}

export function getIndukcijaSekvence(): Sekvenca[] {
  const s = buildIndukcija();
  const domenValues = Object.values(s.domeni);
  const domenSummary = domenValues.reduce((summary, domen) => ({
    count: summary.count + 1,
    confidence: summary.confidence + domen.confidence,
  }), { count: 0, confidence: 0 });
  const averageConfidence = domenSummary.count > 0
    ? `${Math.round(domenSummary.confidence / domenSummary.count)}%`
    : '0%';

  return [
    {
      id: 'indukcija-hero',
      tip: 'hero',
      naslov: '⚡ INDUKCIJA — INTELIGENTNI NAPREDNI DETEKTOR UNIFICIRANIH KOHERENTNIH CIKLUSA I JEZGRA AUTOMATIZACIJE',
      podnaslov: `${KOMPANIJA} — Ukupan Score: ${s.ukupanScore}% • Velocity: ${formatVelocity(s.ukupnaVelocity)} • ${momentumIkona(s.trendMomentum)} ${s.trendMomentum.toUpperCase()}`,
      ikona: '⚡',
      redosled: 1,
      podaci: {
        opis: `Cross-domain indukcioni engine kroz 6 domena: INDUKCIJA + KOHERENCIJA + AMPLIFIKACIJA + REZONANCIJA + POLARIZACIJA + KONVERGENCIJA. Contract: ${s.meta.contractVersion}, model: ${s.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: INDUKCIJA', href: '/api/indukcija' },
          { tekst: 'SNUPI', href: '/snupi', stil: 'sekundarno' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MIROR', href: '/miror', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'indukcija-kpi',
      tip: 'statistika',
      naslov: '📊 INDUKCIJA KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${s.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: s.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(s.trendMomentum)} ${s.trendMomentum.toUpperCase()}`, ikona: '⚡' },
          { naziv: 'Ukupna Velocity', vrednost: formatVelocity(s.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Domeni', vrednost: Object.keys(s.domeni).length, ikona: '🧩' },
          { naziv: 'Kritični domeni', vrednost: s.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snimci', vrednost: s.trendSnapshotCount, ikona: '📷' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Prosečan confidence', vrednost: averageConfidence, ikona: '🎛️' },
        ],
      },
    },
    {
      id: 'indukcija-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 6 INDUKCIJA domena — velocity, momentum i SLA pragovi',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA prag', 'Confidence', 'Težina', 'Source of Truth'],
        redovi: Object.values(s.domeni).map((domen) => [
          domen.naziv,
          `${domen.score}%`,
          formatVelocity(domen.velocity),
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
      id: 'indukcija-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres INDUKCIJA',
      redosled: 4,
      podaci: {
        procenat: s.ukupanScore,
        oznaka: `${s.konacnaOcena.replace(/_/g, ' ')} • Velocity ${formatVelocity(s.ukupnaVelocity)} • ${s.trendMomentum.toUpperCase()} operativni ritam`,
      },
    },
    {
      id: 'indukcija-sla',
      tip: 'lista',
      naslov: '📌 SLA status i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...Object.values(s.domeni).map((domen) => (
            domen.score >= domen.slaThreshold
              ? `✅ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
              : `⚠️ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
          )),
          ...s.preporuke.map((preporuka) => `📌 ${preporuka}`),
        ],
      },
    },
    {
      id: 'indukcija-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 10)',
      redosled: 6,
      podaci: {
        zaglavlje: ['#', 'Score', 'Velocity', 'Timestamp'],
        redovi: s.history.length > 0
          ? s.history.map((entry, i) => [
              String(i + 1),
              `${entry.score}%`,
              formatVelocity(entry.velocity),
              entry.timestamp,
            ])
          : [['—', '—', '—', 'Nema prethodnih snimaka']],
      },
    },
    {
      id: 'indukcija-cta',
      tip: 'cta',
      naslov: '⚡ Kanonski INDUKCIJA endpoint',
      redosled: 7,
      podaci: {
        opis: `Koristite /api/indukcija kao V1 indukcioni source-of-truth za svih 6 domena. ${KOMPANIJA} — Inteligentni Napredni Detektor Unificiranih Koherentnih Ciklusa i Jezgra Automatizacije.`,
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${s.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: s.trendMomentum, ikona: momentumIkona(s.trendMomentum) },
          { naziv: 'Velocity', vrednost: formatVelocity(s.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Degradacija', vrednost: s.meta.degraded ? 'DA' : 'NE', ikona: s.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: s.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/indukcija' },
          { tekst: 'SNUPI', href: '/snupi', stil: 'sekundarno' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MIROR', href: '/miror', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
