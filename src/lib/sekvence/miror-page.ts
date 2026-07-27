import type { Sekvenca } from '@/lib/types';
import { buildMiror } from '@/lib/miror';
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

export function getMirorSekvence(): Sekvenca[] {
  const m = buildMiror();
  const domenValues = Object.values(m.domeni);
  const domenSummary = domenValues.reduce((acc, domen) => ({
    count: acc.count + 1,
    confidence: acc.confidence + domen.confidence,
  }), { count: 0, confidence: 0 });
  const averageConfidence = domenSummary.count > 0
    ? `${Math.round(domenSummary.confidence / domenSummary.count)}%`
    : '0%';

  return [
    {
      id: 'miror-hero',
      tip: 'hero',
      naslov: '🪞 MIROR — MODULARNA INTELIGENTNA REFLEKSIJA OPERATIVNIH RITMOVA',
      podnaslov: `${KOMPANIJA} — Ukupan Score: ${m.ukupanScore}% • Velocity: ${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity} • ${momentumIkona(m.trendMomentum)} ${m.trendMomentum.toUpperCase()}`,
      ikona: '🪞',
      redosled: 1,
      podaci: {
        opis: `Cross-domain refleksioni engine kroz 6 domena: REZONANCIJA + SINTETIZACIJA + DISTRIBUCIJA + BAR KOD + OBSERVATORIJA + VEKTORIZACIJA. Contract: ${m.meta.contractVersion}, model: ${m.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: MIROR', href: '/api/miror' },
          { tekst: 'EKSTRENDEND', href: '/ekstrendend', stil: 'sekundarno' },
          { tekst: 'MOROK', href: '/morok', stil: 'sekundarno' },
          { tekst: 'EKTOND', href: '/ektond', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'miror-kpi',
      tip: 'statistika',
      naslov: '📊 MIROR KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: m.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(m.trendMomentum)} ${m.trendMomentum.toUpperCase()}`, ikona: '🪞' },
          { naziv: 'Ukupna Velocity', vrednost: `${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity}`, ikona: '⚡' },
          { naziv: 'Domeni', vrednost: Object.keys(m.domeni).length, ikona: '🧩' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snimci', vrednost: m.trendSnapshotCount, ikona: '📷' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Prosečan confidence', vrednost: averageConfidence, ikona: '🎛️' },
        ],
      },
    },
    {
      id: 'miror-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 6 MIROR domena — velocity, momentum i SLA pragovi',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA prag', 'Confidence', 'Težina', 'Source of Truth'],
        redovi: Object.values(m.domeni).map((domen) => [
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
      id: 'miror-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres MIROR',
      redosled: 4,
      podaci: {
        procenat: m.ukupanScore,
        oznaka: `${m.konacnaOcena.replace(/_/g, ' ')} • Velocity ${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity} • ${m.trendMomentum.toUpperCase()} refleksija`,
      },
    },
    {
      id: 'miror-sla',
      tip: 'lista',
      naslov: '📌 SLA status i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...Object.values(m.domeni).map((domen) => (
            domen.score >= domen.slaThreshold
              ? `✅ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
              : `⚠️ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
          )),
          ...m.preporuke.map((preporuka) => `📌 ${preporuka}`),
        ],
      },
    },
    {
      id: 'miror-baner',
      tip: 'baner',
      naslov: '🪞 Refleksija trenda i momentuma',
      redosled: 6,
      podaci: {
        bedz: `${momentumIkona(m.trendMomentum)} ${m.trendMomentum.toUpperCase()}`,
        opis: `MIROR reflektuje stanje operativnih ritmova kroz velocity ${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity}. Kritični domeni: ${m.kriticniDomeni.length > 0 ? m.kriticniDomeni.join(', ') : 'nema'}.`,
        dugme: { tekst: 'Otvori MIROR API', href: '/api/miror' },
      },
    },
    {
      id: 'miror-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 10)',
      redosled: 7,
      podaci: {
        zaglavlje: ['#', 'Score', 'Velocity', 'Timestamp'],
        redovi: m.history.length > 0
          ? m.history.map((entry, i) => [
              String(i + 1),
              `${entry.score}%`,
              `${entry.velocity >= 0 ? '+' : ''}${entry.velocity}`,
              entry.timestamp,
            ])
          : [['—', '—', '—', 'Nema prethodnih snimaka']],
      },
    },
    {
      id: 'miror-cta',
      tip: 'cta',
      naslov: '🪞 Kanonski MIROR endpoint',
      redosled: 99,
      podaci: {
        opis: `Koristite /api/miror kao V1 refleksioni source-of-truth za svih 6 MIROR domena. ${KOMPANIJA} — Modularna Inteligentna Refleksija Operativnih Ritmova.`,
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: m.trendMomentum, ikona: momentumIkona(m.trendMomentum) },
          { naziv: 'Velocity', vrednost: `${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity}`, ikona: '⚡' },
          { naziv: 'Degradacija', vrednost: m.meta.degraded ? 'DA' : 'NE', ikona: m.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/miror' },
          { tekst: 'Rezonancija', href: '/api/rezonancija', stil: 'sekundarno' },
          { tekst: 'Sintetizacija', href: '/api/sintetizacija', stil: 'sekundarno' },
          { tekst: 'Vektorizacija', href: '/api/vektorizacija', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
