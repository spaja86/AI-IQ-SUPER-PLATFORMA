import type { Sekvenca } from '@/lib/types';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA } from '@/lib/constants';
import { getDistribucijaModel } from '@/lib/distribucija';

const d = getDistribucijaModel();

function kanalStatusIkona(status: string): string {
  switch (status) {
    case 'aktivan':
      return '✅';
    case 'degradiran':
      return '⚠️';
    default:
      return '🛠️';
  }
}

export const distribucijaSekvence: Sekvenca[] = [
  {
    id: 'distribucija-hero',
    tip: 'hero',
    naslov: '📡 DISTRIBUCIJA',
    podnaslov: `Globalni modul distribucije — status ${d.status}, readiness ${d.readiness.status}`,
    ikona: '📡',
    redosled: 1,
    podaci: {
      opis: `${KOMPANIJA} centralizuje CDN, Edge, TV i API distribuciju kroz jedinstveni source of truth sa operativnim KPI metrikama i readiness modelom.`,
      dugmad: [
        { tekst: 'API Distribucija', href: '/api/distribucija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Status', href: '/api/status', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'distribucija-kpi',
    tip: 'statistika',
    naslov: '📊 KPI Distribucije',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Čvorovi', vrednost: d.kpi.ukupnoCvorova, ikona: '🧩' },
        { naziv: 'Aktivni čvorovi', vrednost: d.kpi.aktivnihCvorova, ikona: '✅' },
        { naziv: 'Kanali', vrednost: d.kpi.ukupnoKanala, ikona: '📦' },
        { naziv: 'Aktivni kanali', vrednost: d.kpi.aktivnihKanala, ikona: '🟢' },
        { naziv: 'Promet / dan', vrednost: `${d.kpi.dnevniPrometTb} TB`, ikona: '🚚' },
        { naziv: 'Prosečna latencija', vrednost: `${d.kpi.prosecnaLatencijaMs} ms`, ikona: '⚡' },
        { naziv: 'Error rate', vrednost: `${d.kpi.prosecniErrorRatePct}%`, ikona: '🛡️' },
        { naziv: 'Readiness score', vrednost: d.readiness.score, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'distribucija-cvorovi',
    tip: 'tabela',
    naslov: '🌍 Distribucioni čvorovi',
    redosled: 3,
    podaci: {
      zaglavlje: ['Čvor', 'Regija', 'Status', 'Latencija', 'Kapacitet'],
      redovi: d.cvorovi.map((cvor) => [
        cvor.naziv,
        cvor.regija,
        cvor.status,
        `${cvor.latencijaMs} ms`,
        `${cvor.kapacitetGbps} Gbps`,
      ]),
    },
  },
  {
    id: 'distribucija-kanali',
    tip: 'kartice',
    naslov: '🛰️ Kanali distribucije',
    redosled: 4,
    podaci: {
      kartice: d.kanali.map((kanal) => ({
        naslov: kanal.naziv,
        opis: `Tip: ${kanal.tip} | Status: ${kanal.status}`,
        ikona: kanalStatusIkona(kanal.status),
        oznake: [`${kanal.dnevniPrometTb} TB/dan`, `ERR ${kanal.errorRatePct}%`],
      })),
    },
  },
  {
    id: 'distribucija-readiness',
    tip: 'tekst',
    naslov: '🧭 Operativna spremnost distribucije',
    redosled: 5,
    podaci: {
      sadrzaj: `Readiness status je "${d.readiness.status}" sa score ${d.readiness.score}. Model je read-only i koristi /api/distribucija kao source of truth za UI i API potrošače.`,
      istaknuteStavke: [
        d.readiness.blokatori.length > 0 ? `Blokatori: ${d.readiness.blokatori.join(', ')}` : 'Nema aktivnih blokatora',
        `Preporuke: ${d.readiness.preporuke.join(' | ')}`,
        `Verzija: ${APP_VERSION}`,
      ],
    },
  },
  {
    id: 'distribucija-cta',
    tip: 'cta',
    naslov: '🚀 DISTRIBUCIJA modul aktivan',
    redosled: 99,
    podaci: {
      opis: `DISTRIBUCIJA modul je aktivan u režimu ${d.status}. Autofinish iteracija #${AUTOFINISH_COUNT}.`,
      stavke: [
        { naziv: 'Status', vrednost: d.status, ikona: '📶' },
        { naziv: 'Readiness', vrednost: d.readiness.status, ikona: '🧭' },
        { naziv: 'Čvorovi', vrednost: d.kpi.ukupnoCvorova, ikona: '🧩' },
        { naziv: 'Kanali', vrednost: d.kpi.ukupnoKanala, ikona: '📦' },
      ],
      dugmad: [
        { tekst: 'API /distribucija', href: '/api/distribucija' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
