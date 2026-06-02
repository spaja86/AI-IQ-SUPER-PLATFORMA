import type { Sekvenca } from '@/lib/types';
import { buildProcesuiranje3 } from '@/lib/procesuiranje-3';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA } from '@/lib/constants';

const p = buildProcesuiranje3();

export const procesuiranje3Sekvence: Sekvenca[] = [
  {
    id: 'proc-3-hero',
    tip: 'hero',
    naslov: '⚙️ PROCESUIRANJE 3 — Digitalna Industrija',
    podnaslov: `Kanonski v3 signal procesiranja za ${KOMPANIJA} — score ${p.ukupanScore}%`,
    ikona: '⚙️',
    redosled: 1,
    podaci: {
      opis: `Dual-run model (v2 + v3) sa novim SLA pragovima, trend signalom i history snapshot-ima. Contract: ${p.meta.contractVersion}, model: ${p.meta.modelVersion}.`,
      dugmad: [
        { tekst: 'API: Procesuiranje 3', href: '/api/procesuiranje-3' },
        { tekst: 'Procesuiranje Svega (v2)', href: '/api/procesuiranje-svega', stil: 'sekundarno' },
        { tekst: 'Maksimus 3', href: '/maksimus-3', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'proc-3-kpi',
    tip: 'statistika',
    naslov: '📊 KPI PROCESIRANJE 3',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupan score', vrednost: `${p.ukupanScore}%`, ikona: '🎯' },
        { naziv: 'Aktivnih procesa', vrednost: p.aktivnihProcesa, ikona: '🔄' },
        { naziv: 'Queue depth', vrednost: p.scheduler.queueDepth, ikona: '📥' },
        { naziv: 'Throughput/min', vrednost: p.score.throughputPerMin, ikona: '🚀' },
        { naziv: 'Latency p95', vrednost: `${p.score.latencyMsP95}ms`, ikona: '⏱️' },
        { naziv: 'Error rate', vrednost: `${p.score.errorRatePct}%`, ikona: '🧯' },
        { naziv: 'Trend', vrednost: `${p.trend.direction} (${p.trend.deltaScore >= 0 ? '+' : ''}${p.trend.deltaScore})`, ikona: '📈' },
        { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
        { naziv: 'Verzija', vrednost: `v${APP_VERSION}`, ikona: '🏷️' },
      ],
    },
  },
  {
    id: 'proc-3-domeni',
    tip: 'tabela',
    naslov: '📋 Domeni i pokrivenost',
    redosled: 3,
    podaci: {
      zaglavlje: ['Domen', 'Status', 'Procenat', 'Aktivnih', 'Završenih'],
      redovi: Object.values(p.domeni).map((domen) => [
        `${domen.ikona} ${domen.naziv}`,
        domen.status,
        `${domen.procenat}%`,
        domen.stavke.filter((s) => s.status === 'aktivno').length,
        domen.stavke.filter((s) => s.status === 'zavrseno').length,
      ]),
    },
  },
  {
    id: 'proc-3-sla',
    tip: 'lista',
    naslov: '🧪 SLA Acceptance Gate',
    redosled: 4,
    podaci: {
      stavke: [
        `${p.sla.prolaz.throughput ? '✅' : '⚠️'} Throughput >= ${p.sla.pragovi.throughputPerMin}/min`,
        `${p.sla.prolaz.latency ? '✅' : '⚠️'} Latency p95 <= ${p.sla.pragovi.latencyMsP95}ms`,
        `${p.sla.prolaz.errorRate ? '✅' : '⚠️'} Error rate <= ${p.sla.pragovi.maxErrorRatePct}%`,
        `${p.sla.prolaz.queueDepth ? '✅' : '⚠️'} Queue depth <= ${p.sla.pragovi.maxQueueDepth}`,
        `${p.sla.prolaz.runtimeReady ? '✅' : '⚠️'} Runtime readiness gate`,
        `${p.sla.prolaz.opsReady ? '✅' : '⚠️'} Ops readiness gate`,
      ],
    },
  },
  {
    id: 'proc-3-uska-grla',
    tip: 'lista',
    naslov: '🚨 Uska grla i preporuke',
    redosled: 5,
    podaci: {
      stavke: [
        ...p.uskaGrla.map((u) => `⚠️ ${u}`),
        ...p.preporuke.map((r) => `📌 ${r}`),
      ],
    },
  },
  {
    id: 'proc-3-history',
    tip: 'tabela',
    naslov: '🕐 Istorija score snapshot-a',
    redosled: 6,
    podaci: {
      zaglavlje: ['#', 'Score', 'Timestamp'],
      redovi: p.history.length > 0
        ? p.history.map((entry, i) => [String(i + 1), `${entry.score}%`, entry.timestamp])
        : [['—', '—', 'Nema prethodnih snapshot-a']],
    },
  },
  {
    id: 'proc-3-cta',
    tip: 'cta',
    naslov: '🛰️ Kanonski endpoint PROCESIRANJE 3',
    redosled: 99,
    podaci: {
      opis: `PROCESIRANJE 3 radi u dual-run režimu sa v2 bez prekida postojećih klijenata. Source-of-truth: ${p.meta.sourceOfTruth}.`,
      stavke: [
        { naziv: 'Contract', vrednost: p.meta.contractVersion, ikona: '📦' },
        { naziv: 'Model', vrednost: p.meta.modelVersion, ikona: '🧠' },
        { naziv: 'Kompatibilnost', vrednost: p.meta.compatibilityMode, ikona: '🔁' },
        { naziv: 'SLA ukupno', vrednost: p.sla.prolaz.ukupno ? 'PASS' : 'FAIL', ikona: p.sla.prolaz.ukupno ? '✅' : '⚠️' },
      ],
      dugmad: [
        { tekst: 'Otvori API', href: '/api/procesuiranje-3' },
        { tekst: 'Otvori stranicu v2', href: '/procesuiranje-svega', stil: 'sekundarno' },
      ],
    },
  },
];
