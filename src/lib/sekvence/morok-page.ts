import type { Sekvenca } from '@/lib/types';
import { buildMorok } from '@/lib/morok';
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

export function getMorokSekvence(): Sekvenca[] {
  const m = buildMorok();

  return [
    {
      id: 'morok-hero',
      tip: 'hero',
      naslov: '🟣 MOROK — MODULARNA ORKESTRACIJA RITMOVA I OPERATIVNOG KAPACITETA',
      podnaslov: `${KOMPANIJA} — Ukupan Score: ${m.ukupanScore}% • Velocity: ${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity} • ${momentumIkona(m.trendMomentum)} ${m.trendMomentum.toUpperCase()}`,
      ikona: '🟣',
      redosled: 1,
      podaci: {
        opis: `Cross-domain operativno-ritmički kapacitetni engine kroz 6 domena: MOBILNA MREŽA + OPERATIVNA SPREMNOST + PROCESUIRANJE + EKSTREMNO + ORKESTRACIJA + SPAJAPRO. Contract: ${m.meta.contractVersion}, model: ${m.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: MOROK', href: '/api/morok' },
          { tekst: 'EKSTRENDEND', href: '/ekstrendend', stil: 'sekundarno' },
          { tekst: 'Procesuiranje 3', href: '/procesuiranje-3', stil: 'sekundarno' },
          { tekst: 'Mobilna Mreža', href: '/mobilna-mreza', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'morok-kpi',
      tip: 'statistika',
      naslov: '📊 MOROK KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: m.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          {
            naziv: 'Momentum',
            vrednost: `${momentumIkona(m.trendMomentum)} ${m.trendMomentum.toUpperCase()}`,
            ikona: '🟣',
          },
          {
            naziv: 'Ukupna Velocity',
            vrednost: `${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity}`,
            ikona: '⚡',
          },
          { naziv: 'Domeni', vrednost: Object.keys(m.domeni).length, ikona: '🧩' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snimci', vrednost: m.trendSnapshotCount, ikona: '📷' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          {
            naziv: 'Prosečan confidence',
            vrednost: (() => {
              const domenValues = Object.values(m.domeni);
              return `${Math.round(domenValues.reduce((sum, d) => sum + d.confidence, 0) / domenValues.length)}%`;
            })(),
            ikona: '🎛️',
          },
        ],
      },
    },
    {
      id: 'morok-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 6 domena — velocity, momentum i SLA pragovi',
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
      id: 'morok-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres MOROK',
      redosled: 4,
      podaci: {
        procenat: m.ukupanScore,
        oznaka: `${m.konacnaOcena.replace(/_/g, ' ')} • Velocity ${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity} • ${m.trendMomentum.toUpperCase()} ritam`,
      },
    },
    {
      id: 'morok-preporuke',
      tip: 'lista',
      naslov: '📌 Ritmička analiza kapaciteta i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...(m.kriticniDomeni.length > 0
            ? m.kriticniDomeni.map((naziv) => `⚠️ ${naziv}`)
            : ['✅ Nema kritičnih domena ispod SLA praga.']),
          ...m.preporuke.map((p) => `📌 ${p}`),
        ],
      },
    },
    {
      id: 'morok-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 10)',
      redosled: 6,
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
      id: 'morok-cta',
      tip: 'cta',
      naslov: '🟣 Kanonski MOROK endpoint',
      redosled: 99,
      podaci: {
        opis: `Koristite /api/morok kao V1 operativno-ritmički source-of-truth za svih 6 domena. ${KOMPANIJA} — Modularna Orkestracija Ritmova i Operativnog Kapaciteta.`,
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: m.trendMomentum, ikona: momentumIkona(m.trendMomentum) },
          { naziv: 'Velocity', vrednost: `${m.ukupnaVelocity >= 0 ? '+' : ''}${m.ukupnaVelocity}`, ikona: '⚡' },
          { naziv: 'Degradacija', vrednost: m.meta.degraded ? 'DA' : 'NE', ikona: m.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/morok' },
          { tekst: 'EKSTRENDEND', href: '/api/ekstrendend', stil: 'sekundarno' },
          { tekst: 'Procesuiranje 3', href: '/api/procesuiranje-3', stil: 'sekundarno' },
          { tekst: 'Mobilna Mreža', href: '/api/mobilna-mreza', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
