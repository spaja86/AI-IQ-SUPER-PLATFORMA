import type { Sekvenca } from '@/lib/types';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';
import { buildSnupi } from '@/lib/snupi';

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

export function getSnupiSekvence(): Sekvenca[] {
  const s = buildSnupi();
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
      id: 'snupi-hero',
      tip: 'hero',
      naslov: '🔗 SNUPI — SISTEMSKA NAPREDNA UNIFIKACIJA PROCESNIH INTELIGENTNIH TOKOVA',
      podnaslov: `${KOMPANIJA} — Ukupan Score: ${s.ukupanScore}% • Velocity: ${formatVelocity(s.ukupnaVelocity)} • ${momentumIkona(s.trendMomentum)} ${s.trendMomentum.toUpperCase()}`,
      ikona: '🔗',
      redosled: 1,
      podaci: {
        opis: `Cross-domain unifikacioni engine kroz 6 domena: SINHRONIZACIJA + NORMALIZACIJA + UNIFIKACIJA + PROCESUIRANJE + INTEGRACIJA + INOVACIJA. Contract: ${s.meta.contractVersion}, model: ${s.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: SNUPI', href: '/api/snupi' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MIROR', href: '/miror', stil: 'sekundarno' },
          { tekst: 'MOROK', href: '/morok', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'snupi-kpi',
      tip: 'statistika',
      naslov: '📊 SNUPI KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${s.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: s.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(s.trendMomentum)} ${s.trendMomentum.toUpperCase()}`, ikona: '🔗' },
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
      id: 'snupi-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 6 SNUPI domena — velocity, momentum i SLA pragovi',
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
      id: 'snupi-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres SNUPI',
      redosled: 4,
      podaci: {
        procenat: s.ukupanScore,
        oznaka: `${s.konacnaOcena.replace(/_/g, ' ')} • Velocity ${formatVelocity(s.ukupnaVelocity)} • ${s.trendMomentum.toUpperCase()} unifikacija`,
      },
    },
    {
      id: 'snupi-sla',
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
      id: 'snupi-history',
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
      id: 'snupi-cta',
      tip: 'cta',
      naslov: '🔗 Kanonski SNUPI endpoint',
      redosled: 7,
      podaci: {
        opis: `Koristite /api/snupi kao V1 unifikacioni source-of-truth za svih 6 SNUPI domena. ${KOMPANIJA} — Sistemska Napredna Unifikacija Procesnih Inteligentnih tokova.`,
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${s.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: s.trendMomentum, ikona: momentumIkona(s.trendMomentum) },
          { naziv: 'Velocity', vrednost: formatVelocity(s.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Degradacija', vrednost: s.meta.degraded ? 'DA' : 'NE', ikona: s.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: s.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/snupi' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MIROR', href: '/miror', stil: 'sekundarno' },
          { tekst: 'MOROK', href: '/morok', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
