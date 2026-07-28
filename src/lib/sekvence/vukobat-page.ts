import type { Sekvenca } from '@/lib/types';
import { AUTOFINISH_COUNT, KOMPANIJA } from '@/lib/constants';
import { buildVukobat } from '@/lib/vukobat';

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

export function getVukobatSekvence(): Sekvenca[] {
  const v = buildVukobat();

  return [
    {
      id: 'vukobat-hero',
      tip: 'hero',
      naslov: '🛡️ VUKOBAT',
      podnaslov: `${KOMPANIJA} — Score ${v.ukupanScore}% • Velocity ${formatVelocity(v.ukupnaVelocity)} • ${momentumIkona(v.trendMomentum)} ${v.trendMomentum.toUpperCase()}`,
      ikona: '🛡️',
      redosled: 1,
      podaci: {
        opis: `${v.sistem}. Engine prati 6 domena komandne usklađenosti, budnosti i automatizacije. Contract ${v.meta.contractVersion}, model ${v.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: VUKOBAT', href: '/api/vukobat' },
          { tekst: 'AUTO', href: '/auto', stil: 'sekundarno' },
          { tekst: 'SILJA', href: '/silja', stil: 'sekundarno' },
          { tekst: 'MOROK', href: '/morok', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'vukobat-kpi',
      tip: 'statistika',
      naslov: '📊 VUKOBAT KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${v.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Ocena', vrednost: v.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(v.trendMomentum)} ${v.trendMomentum.toUpperCase()}`, ikona: '🧭' },
          { naziv: 'Velocity', vrednost: formatVelocity(v.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Kritični domeni', vrednost: v.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snapshot count', vrednost: v.trendSnapshotCount, ikona: '📷' },
          { naziv: 'Autofinish', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'API ruta', vrednost: v.operativniKontekst.apiRute, ikona: '🔌' },
        ],
      },
    },
    {
      id: 'vukobat-domeni',
      tip: 'tabela',
      naslov: '📋 VUKOBAT domeni',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA', 'Confidence', 'Težina'],
        redovi: Object.values(v.domeni).map((domen) => [
          domen.naziv,
          `${domen.score}%`,
          formatVelocity(domen.velocity),
          `${trendIkona(domen.trendDirection)} ${domen.trendDirection}`,
          `${momentumIkona(domen.momentum)} ${domen.momentum}`,
          `${domen.slaThreshold}%`,
          `${domen.confidence}%`,
          `${Math.round(domen.tezina * 100)}%`,
        ]),
      },
    },
    {
      id: 'vukobat-progres',
      tip: 'progres',
      naslov: '📈 Operativni progres',
      redosled: 4,
      podaci: {
        progres: v.ukupanScore,
        poruka: `${v.konacnaOcena.replace(/_/g, ' ')} • ${v.trendMomentum.toUpperCase()} ritam • Velocity ${formatVelocity(v.ukupnaVelocity)}`,
      },
    },
    {
      id: 'vukobat-preporuke',
      tip: 'lista',
      naslov: '📌 Preporuke i readiness',
      redosled: 5,
      podaci: {
        stavke: [
          ...Object.values(v.domeni).map((domen) => (
            domen.score >= domen.slaThreshold
              ? `✅ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
              : `⚠️ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
          )),
          ...v.preporuke.map((preporuka) => `📌 ${preporuka}`),
        ],
      },
    },
    {
      id: 'vukobat-cta',
      tip: 'cta',
      naslov: '🚀 Kanonski VUKOBAT endpoint',
      redosled: 6,
      podaci: {
        opis: `Koristite /api/vukobat kao operativni source-of-truth za ${v.sistem}.`,
        stavke: [
          { naziv: 'Source of truth', vrednost: v.meta.sourceOfTruth, ikona: '🧭' },
          { naziv: 'Stranice', vrednost: v.operativniKontekst.stranice, ikona: '📄' },
          { naziv: 'Ukupno ruta', vrednost: v.operativniKontekst.ukupnoRuta, ikona: '🛣️' },
          { naziv: 'Dijagnostika', vrednost: v.operativniKontekst.dijagnostika, ikona: '🧪' },
          { naziv: 'OMEGA persone', vrednost: v.operativniKontekst.omegaPersone, ikona: '🧠' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/vukobat' },
          { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
          { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
