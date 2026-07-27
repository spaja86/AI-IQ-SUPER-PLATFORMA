import type { Sekvenca } from '@/lib/types';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';
import { buildAuto } from '@/lib/auto';

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

export function getAutoSekvence(): Sekvenca[] {
  const a = buildAuto();
  const domenValues = Object.values(a.domeni);
  const domenSummary = domenValues.reduce((summary, domen) => ({
    count: summary.count + 1,
    confidence: summary.confidence + domen.confidence,
  }), { count: 0, confidence: 0 });
  const averageConfidence = domenSummary.count > 0
    ? `${Math.round(domenSummary.confidence / domenSummary.count)}%`
    : '0%';

  return [
    {
      id: 'auto-hero',
      tip: 'hero',
      naslov: '🤖 AUTO — AUTONOMNA UPRAVLJAČKA TRANSFORMATIVNA ORKESTRACIJA',
      podnaslov: `${KOMPANIJA} — Ukupan Score: ${a.ukupanScore}% • Velocity: ${formatVelocity(a.ukupnaVelocity)} • ${momentumIkona(a.trendMomentum)} ${a.trendMomentum.toUpperCase()}`,
      ikona: '🤖',
      redosled: 1,
      podaci: {
        opis: `Cross-domain engine kroz 6 domena autonomnih operativnih procesa: AUTONOMIJA + UPRAVLJANJE + TRANSFORMACIJA + ORKESTRACIJA + OPTIMIZACIJA + AUTOMATIZACIJA. Contract: ${a.meta.contractVersion}, model: ${a.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: AUTO', href: '/api/auto' },
          { tekst: 'SNUPI', href: '/snupi', stil: 'sekundarno' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MOROK', href: '/morok', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'auto-kpi',
      tip: 'statistika',
      naslov: '📊 AUTO KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${a.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: a.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(a.trendMomentum)} ${a.trendMomentum.toUpperCase()}`, ikona: '🤖' },
          { naziv: 'Ukupna Velocity', vrednost: formatVelocity(a.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Domeni', vrednost: Object.keys(a.domeni).length, ikona: '🧩' },
          { naziv: 'Kritični domeni', vrednost: a.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snimci', vrednost: a.trendSnapshotCount, ikona: '📷' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Prosečan confidence', vrednost: averageConfidence, ikona: '🎛️' },
        ],
      },
    },
    {
      id: 'auto-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 6 AUTO domena — velocity, momentum i SLA pragovi',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA prag', 'Confidence', 'Težina', 'Source of Truth'],
        redovi: Object.values(a.domeni).map((domen) => [
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
      id: 'auto-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres AUTO',
      redosled: 4,
      podaci: {
        progres: a.ukupanScore,
        poruka: `${a.konacnaOcena.replace(/_/g, ' ')} • Velocity ${formatVelocity(a.ukupnaVelocity)} • ${a.trendMomentum.toUpperCase()} autonomija`,
      },
    },
    {
      id: 'auto-sla',
      tip: 'lista',
      naslov: '📌 SLA status i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...Object.values(a.domeni).map((domen) => (
            domen.score >= domen.slaThreshold
              ? `✅ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
              : `⚠️ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
          )),
          ...a.preporuke.map((preporuka) => `📌 ${preporuka}`),
        ],
      },
    },
    {
      id: 'auto-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 10)',
      redosled: 6,
      podaci: {
        zaglavlje: ['#', 'Score', 'Velocity', 'Timestamp'],
        redovi: a.history.length > 0
          ? a.history.map((entry, i) => [
              String(i + 1),
              `${entry.score}%`,
              formatVelocity(entry.velocity),
              entry.timestamp,
            ])
          : [['—', '—', '—', 'Nema prethodnih snimaka']],
      },
    },
    {
      id: 'auto-cta',
      tip: 'cta',
      naslov: '🤖 Kanonski AUTO endpoint',
      redosled: 7,
      podaci: {
        opis: `Koristite /api/auto kao V1 autonomni source-of-truth za svih 6 AUTO domena. ${KOMPANIJA} — Autonomna Upravljačka Transformativna Orkestracija.`,
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${a.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: a.trendMomentum, ikona: momentumIkona(a.trendMomentum) },
          { naziv: 'Velocity', vrednost: formatVelocity(a.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Degradacija', vrednost: a.meta.degraded ? 'DA' : 'NE', ikona: a.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: a.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/auto' },
          { tekst: 'SNUPI', href: '/snupi', stil: 'sekundarno' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MOROK', href: '/morok', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
