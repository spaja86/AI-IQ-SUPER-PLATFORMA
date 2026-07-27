import type { Sekvenca } from '@/lib/types';
import {
  digitalnaObservatorija,
  observatorijaInstrumenti,
  observatorijaMete,
  observatorijaSesije,
  getObservatorijaStatistika,
  getOtvoreneAlarme,
} from '@/lib/digitalna-observatorija';

const statistika = getObservatorijaStatistika();
const otvoreniAlarmi = getOtvoreneAlarme();

export const digitalnaObservatorijaSekvence: Sekvenca[] = [
  {
    id: 'digitalna-observatorija-hero',
    tip: 'hero',
    naslov: '🔭 Digitalna Observatorija',
    podnaslov: 'Standalone modul za astronomska posmatranja i operativni nadzor',
    ikona: '🔭',
    redosled: 1,
    podaci: {
      opis: `${digitalnaObservatorija.opis} Link: ${digitalnaObservatorija.link}`,
      dugmad: [
        { tekst: 'Observatorija API', href: '/api/digitalna-observatorija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-observatorija-statistika',
    tip: 'statistika',
    naslov: '📊 Observatorija u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Instrumenti', vrednost: statistika.ukupnoInstrumenata, ikona: '🛰️' },
        { naziv: 'Aktivni', vrednost: statistika.aktivnihInstrumenata, ikona: '✅' },
        { naziv: 'Mete', vrednost: statistika.ukupnoMeta, ikona: '🌌' },
        { naziv: 'Otvoreni alarmi', vrednost: statistika.otvorenihAlarma, ikona: '🚨' },
      ],
    },
  },
  {
    id: 'digitalna-observatorija-tekst',
    tip: 'tekst',
    naslov: 'MVP opseg observatorijuma',
    redosled: 3,
    podaci: {
      sadrzaj: 'Digitalna Observatorija je read-only modul za pregled instrumenata, mete posmatranja, sesija i alarma, uz agregatne metrike za dashboard, API i dijagnostiku.',
      istaknuteStavke: [
        `${statistika.ukupnoInstrumenata} instrumenata (${statistika.aktivnihInstrumenata} aktivnih)`,
        `${statistika.ukupnoMeta} meta (${statistika.kriticnihMeta} kritičnih)`,
        `${statistika.ukupnoSesija} sesija (${statistika.aktivnihSesija} u toku)`,
        `${statistika.otvorenihAlarma} otvorenih alarma`,
      ],
    },
  },
  {
    id: 'digitalna-observatorija-instrumenti',
    tip: 'kartice',
    naslov: '🛰️ Instrumenti',
    redosled: 4,
    podaci: {
      kartice: observatorijaInstrumenti.map((instrument) => ({
        naslov: instrument.naziv,
        opis: `${instrument.tip} instrument — opseg ${instrument.opseg}, lokacija ${instrument.lokacija}`,
        ikona: '🛰️',
        oznake: [instrument.status, `${instrument.preciznost}% preciznost`],
      })),
    },
  },
  {
    id: 'digitalna-observatorija-mete',
    tip: 'kartice',
    naslov: '🌌 Nebeske mete',
    redosled: 5,
    podaci: {
      kartice: observatorijaMete.map((meta) => ({
        naslov: meta.naziv,
        opis: `${meta.tip} — magnituda ${meta.magnituda}, vidljivost ${meta.vidljivost}`,
        ikona: '✨',
        oznake: [meta.prioritet],
      })),
    },
  },
  {
    id: 'digitalna-observatorija-sesije',
    tip: 'tabela',
    naslov: '🗓️ Sesije posmatranja',
    redosled: 6,
    podaci: {
      zaglavlje: ['Sesija', 'Meta', 'Status', 'Trajanje', 'Signal'],
      redovi: observatorijaSesije.map((sesija) => {
        const meta = observatorijaMete.find((m) => m.id === sesija.metaId);
        return [
          sesija.naziv,
          meta?.naziv ?? sesija.metaId,
          sesija.status,
          sesija.trajanje,
          `${sesija.signal}%`,
        ];
      }),
    },
  },
  {
    id: 'digitalna-observatorija-alarmi',
    tip: 'lista',
    naslov: '🚨 Alarmi i anomalije',
    redosled: 7,
    podaci: {
      stavke: otvoreniAlarmi.map((alarm) => ({
        ikona: '🚨',
        naslov: alarm.naziv,
        opis: `${alarm.status} • ${alarm.ozbiljnost} — ${alarm.opis}`,
      })),
    },
  },
  {
    id: 'digitalna-observatorija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura observatorijuma',
    redosled: 8,
    podaci: {
      nivoi: [
        {
          naziv: 'Digitalna Observatorija',
          ikona: '🔭',
          deca: ['Instrumenti', 'Mete', 'Sesije', 'Alarmi'],
        },
        {
          naziv: 'Instrumenti',
          ikona: '🛰️',
          deca: observatorijaInstrumenti.map((i) => i.naziv),
        },
        {
          naziv: 'Mete',
          ikona: '🌌',
          deca: observatorijaMete.map((m) => m.naziv),
        },
      ],
    },
  },
  {
    id: 'digitalna-observatorija-cta',
    tip: 'cta',
    naslov: 'Poveži observatorijum sa ostatkom sistema',
    redosled: 9,
    podaci: {
      opis: 'Observatorija je integrisana sa API rutama, navigacijom, dashboard metrikama i auto-repair dijagnostikom.',
      dugmad: [
        { tekst: 'Observatorija Status API', href: '/api/digitalna-observatorija-status' },
        { tekst: 'Observatorija Pregled API', href: '/api/digitalna-observatorija-pregled', stil: 'sekundarno' },
      ],
    },
  },
];
