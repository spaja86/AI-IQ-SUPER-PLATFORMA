import type { Sekvenca } from '@/lib/types';
import { AUTOFINISH_COUNT, KOMPANIJA } from '@/lib/constants';
import { buildEkspriting } from '@/lib/ekspriting';

function formatOcena(ocena: string): string {
  return ocena.replace(/_/g, ' ');
}

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

export function getEkspritingSekvence(): Sekvenca[] {
  const e = buildEkspriting({ persistSnapshot: false });

  return [
    {
      id: 'ekspriting-hero',
      tip: 'hero',
      naslov: '✍️ EKSPRITING',
      podnaslov: `${KOMPANIJA} — Score ${e.ukupanScore}% • Velocity ${formatVelocity(e.ukupnaVelocity)} • ${momentumIkona(e.trendMomentum)} ${e.trendMomentum.toUpperCase()}`,
      ikona: '✍️',
      redosled: 1,
      podaci: {
        opis: `${e.sistem}. Engine prati 5 domena ekspresnog skriptinga i pisanja: EKSPRESNA SINTEZA + SKRIPTING LOGIKA + PISANJE TOKA + ITERATIVNO UREDIVANJE + TOKENIZACIJA SADRZAJA. Contract ${e.meta.contractVersion}, model ${e.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: EKSPRITING', href: '/api/ekspriting' },
          { tekst: 'DIVEEZIJA EKSPESLA', href: '/diveezija-ekspesla', stil: 'sekundarno' },
          { tekst: 'AUTO', href: '/auto', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'ekspriting-kpi',
      tip: 'statistika',
      naslov: '📊 EKSPRITING KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${e.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Ocena', vrednost: formatOcena(e.konacnaOcena), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(e.trendMomentum)} ${e.trendMomentum.toUpperCase()}`, ikona: '🧭' },
          { naziv: 'Velocity', vrednost: formatVelocity(e.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Kritični domeni', vrednost: e.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snapshot count', vrednost: e.trendSnapshotCount, ikona: '📷' },
          { naziv: 'Autofinish', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'API rute', vrednost: e.operativniKontekst.apiRute, ikona: '🔌' },
        ],
      },
    },
    {
      id: 'ekspriting-domeni',
      tip: 'tabela',
      naslov: '📋 EKSPRITING domeni',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA', 'Confidence', 'Težina'],
        redovi: Object.values(e.domeni).map((domen) => [
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
      id: 'ekspriting-progres',
      tip: 'progres',
      naslov: '📈 Operativni progres',
      redosled: 4,
      podaci: {
        progres: e.ukupanScore,
        poruka: `${formatOcena(e.konacnaOcena)} • ${e.trendMomentum.toUpperCase()} ritam • Velocity ${formatVelocity(e.ukupnaVelocity)}`,
      },
    },
    {
      id: 'ekspriting-preporuke',
      tip: 'lista',
      naslov: '📌 Preporuke i readiness',
      redosled: 5,
      podaci: {
        stavke: [
          ...Object.values(e.domeni).map((domen) => (
            domen.score >= domen.slaThreshold
              ? `✅ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
              : `⚠️ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
          )),
          ...e.preporuke.map((preporuka) => `📌 ${preporuka}`),
        ],
      },
    },
    {
      id: 'ekspriting-cta',
      tip: 'cta',
      naslov: '🚀 Kanonski EKSPRITING endpoint',
      redosled: 99,
      podaci: {
        opis: `Koristite /api/ekspriting kao operativni source-of-truth za ${e.sistem}. ${KOMPANIJA} — Ekspresni Skripting i Pisanje Engine.`,
        stavke: [
          { naziv: 'Source of truth', vrednost: e.meta.sourceOfTruth, ikona: '🧭' },
          { naziv: 'Ukupan score', vrednost: `${e.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: e.trendMomentum, ikona: momentumIkona(e.trendMomentum) },
          { naziv: 'Velocity', vrednost: formatVelocity(e.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Kritični domeni', vrednost: e.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/ekspriting' },
          { tekst: 'DIVEEZIJA EKSPESLA', href: '/api/diveezija-ekspesla', stil: 'sekundarno' },
          { tekst: 'AUTO', href: '/api/auto', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
