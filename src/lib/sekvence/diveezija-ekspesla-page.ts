import type { Sekvenca } from '@/lib/types';
import { AUTOFINISH_COUNT, KOMPANIJA } from '@/lib/constants';
import { buildDivezijaEkspesla } from '@/lib/diveezija-ekspesla';

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

export function getDivezijaEkspeslaSekvence(): Sekvenca[] {
  const d = buildDivezijaEkspesla({ persistSnapshot: false });

  return [
    {
      id: 'diveezija-ekspesla-hero',
      tip: 'hero',
      naslov: '🔀 DIVEEZIJA EKSPESLA',
      podnaslov: `${KOMPANIJA} — Score ${d.ukupanScore}% • Velocity ${formatVelocity(d.ukupnaVelocity)} • ${momentumIkona(d.trendMomentum)} ${d.trendMomentum.toUpperCase()}`,
      ikona: '🔀',
      redosled: 1,
      podaci: {
        opis: `${d.sistem}. Engine prati 6 domena ekspresne logike i automatizacije: DIVERGENCIJA + ITERACIJA + VEKTORIZACIJA + EKSPANZIJA + EKSPRESNA LOGIKA + AUTOMATIZACIJA. Contract ${d.meta.contractVersion}, model ${d.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: DIVEEZIJA EKSPESLA', href: '/api/diveezija-ekspesla' },
          { tekst: 'VUKOBAT', href: '/vukobat', stil: 'sekundarno' },
          { tekst: 'AUTO', href: '/auto', stil: 'sekundarno' },
          { tekst: 'EKSTRENDEND', href: '/ekstrendend', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'diveezija-ekspesla-kpi',
      tip: 'statistika',
      naslov: '📊 DIVEEZIJA EKSPESLA KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${d.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Ocena', vrednost: formatOcena(d.konacnaOcena), ikona: '🏆' },
          { naziv: 'Momentum', vrednost: `${momentumIkona(d.trendMomentum)} ${d.trendMomentum.toUpperCase()}`, ikona: '🧭' },
          { naziv: 'Velocity', vrednost: formatVelocity(d.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Kritični domeni', vrednost: d.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'Snapshot count', vrednost: d.trendSnapshotCount, ikona: '📷' },
          { naziv: 'Autofinish', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'API rute', vrednost: d.operativniKontekst.apiRute, ikona: '🔌' },
        ],
      },
    },
    {
      id: 'diveezija-ekspesla-domeni',
      tip: 'tabela',
      naslov: '📋 DIVEEZIJA EKSPESLA domeni',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Velocity', 'Trend', 'Momentum', 'SLA', 'Confidence', 'Težina'],
        redovi: Object.values(d.domeni).map((domen) => [
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
      id: 'diveezija-ekspesla-progres',
      tip: 'progres',
      naslov: '📈 Operativni progres',
      redosled: 4,
      podaci: {
        progres: d.ukupanScore,
        poruka: `${formatOcena(d.konacnaOcena)} • ${d.trendMomentum.toUpperCase()} ritam • Velocity ${formatVelocity(d.ukupnaVelocity)}`,
      },
    },
    {
      id: 'diveezija-ekspesla-preporuke',
      tip: 'lista',
      naslov: '📌 Preporuke i readiness',
      redosled: 5,
      podaci: {
        stavke: [
          ...Object.values(d.domeni).map((domen) => (
            domen.score >= domen.slaThreshold
              ? `✅ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
              : `⚠️ ${domen.naziv} — ${domen.score}% / SLA ${domen.slaThreshold}%`
          )),
          ...d.preporuke.map((preporuka) => `📌 ${preporuka}`),
        ],
      },
    },
    {
      id: 'diveezija-ekspesla-cta',
      tip: 'cta',
      naslov: '🚀 Kanonski DIVEEZIJA EKSPESLA endpoint',
      redosled: 99,
      podaci: {
        opis: `Koristite /api/diveezija-ekspesla kao operativni source-of-truth za ${d.sistem}. ${KOMPANIJA} — Ekspresni Paralelni Engine Sistemske Logike i Automatizacije.`,
        stavke: [
          { naziv: 'Source of truth', vrednost: d.meta.sourceOfTruth, ikona: '🧭' },
          { naziv: 'Ukupan score', vrednost: `${d.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Momentum', vrednost: d.trendMomentum, ikona: momentumIkona(d.trendMomentum) },
          { naziv: 'Velocity', vrednost: formatVelocity(d.ukupnaVelocity), ikona: '⚡' },
          { naziv: 'Kritični domeni', vrednost: d.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/diveezija-ekspesla' },
          { tekst: 'VUKOBAT', href: '/api/vukobat', stil: 'sekundarno' },
          { tekst: 'AUTO', href: '/api/auto', stil: 'sekundarno' },
          { tekst: 'EKSTRENDEND', href: '/api/ekstrendend', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
