import type { Sekvenca } from '@/lib/types';
import { getStoryOfLifeData } from '@/lib/story-of-life';

const data = getStoryOfLifeData();

export const storyOfLifeSekvence: Sekvenca[] = [
  {
    id: 'story-of-life-hero',
    tip: 'hero',
    naslov: '📖 STORY OF LIFE',
    podnaslov: 'Narativ evolucije AI IQ SUPER PLATFORMA sistema',
    ikona: '📖',
    redosled: 1,
    podaci: {
      opis: `${data.opis} Verzija modula: v${data.verzija}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
        { tekst: 'Autofinish', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'story-of-life-statistika',
    tip: 'statistika',
    naslov: '📊 Story KPI',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: data.statistika.platforme, ikona: '🌐' },
        { naziv: 'API rute', vrednost: data.statistika.apiRute, ikona: '🧩' },
        { naziv: 'Sekvence tipova', vrednost: data.statistika.sekvence, ikona: '🧱' },
        { naziv: 'OMEGA AI persona', vrednost: data.statistika.omegaPersona, ikona: '🧠' },
        { naziv: 'SpajaPro opseg', vrednost: `v${data.statistika.spajaProVerzije}`, ikona: '🚀' },
      ],
    },
  },
  {
    id: 'story-of-life-timeline',
    tip: 'tabela',
    naslov: '🗺️ Timeline',
    podnaslov: 'Faze razvoja i ključni ishodi',
    redosled: 3,
    podaci: {
      zaglavlje: ['Period', 'Fokus', 'Ishod'],
      redovi: data.timeline.map((faza) => [faza.period, faza.fokus, faza.ishod]),
    },
  },
  {
    id: 'story-of-life-signali',
    tip: 'kartice',
    naslov: '📡 Operativni signali',
    redosled: 4,
    podaci: {
      kartice: data.signali.map((signal) => ({
        naslov: signal.naziv,
        opis: signal.opis,
        ikona: signal.status === 'aktivno' ? '✅' : signal.status === 'stabilno' ? '🟢' : '🛠️',
        oznake: [signal.status.replace('_', '-')],
      })),
    },
  },
  {
    id: 'story-of-life-tekst',
    tip: 'tekst',
    naslov: '🧭 Story smer',
    redosled: 5,
    podaci: {
      sadrzaj:
        'STORY OF LIFE predstavlja pregled celog životnog ciklusa platforme: od temelja, preko skaliranja i automatizacije, do ekspanzije i sinhronizacije.',
      istaknuteStavke: [
        'Sekvence kao standard prikaza',
        'Jasna veza između narativa i operativnog stanja',
        'Mogućnost budućeg proširenja ka dinamičkim izvorima podataka',
      ],
    },
  },
  {
    id: 'story-of-life-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi kroz ekosistem',
    redosled: 6,
    podaci: {
      opis: 'Nastavi pregled kroz module koji prikazuju stanje, evoluciju i operativne tokove cele platforme.',
      dugmad: [
        { tekst: 'Autofinish Dashboard', href: '/autofinish' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'Story API', href: '/api/story-of-life', stil: 'sekundarno' },
      ],
    },
  },
];
