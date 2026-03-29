import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const kompanijaSekvence: Sekvenca[] = [
  {
    id: 'kompanija-hero',
    tip: 'hero',
    naslov: '🏢 Kompanija SPAJA',
    podnaslov: 'Digitalna industrija koja spaja tehnologiju i inovacije',
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: 'Kompanija SPAJA je digitalna industrija koja upravlja sa vise platformi, IT proizvoda i AI agenata. Misija je da spoji sve aspekte digitalnog poslovanja u jedan ekosistem.',
      dugmad: [
        { tekst: 'Organizacija', href: '/organizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'kompanija-tekst',
    tip: 'tekst',
    naslov: 'Misija i vizija',
    redosled: 2,
    podaci: {
      sadrzaj: 'Kompanija SPAJA ima za cilj da postane lider u digitalnoj industriji kroz inovativne platforme, naprednu vestacku inteligenciju i jedinstveni ekosistem koji povezuje sve digitalne servise.',
      istaknuteStavke: [
        'Misija: Spajanje svih digitalnih servisa u jednu celinu',
        'Vizija: Globalna digitalna korporacija sa AI autonomijom',
        'Vrednosti: Inovacija, Pouzdanost, Skalabilnost',
        'Fokus: Platforme, AI agenti, Finansijski servisi',
      ],
    },
  },
  {
    id: 'kompanija-statistika',
    tip: 'statistika',
    naslov: '📊 Kompanija u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'AI Persone', vrednost: 21, ikona: '🧠' },
        { naziv: 'God. osnivanja', vrednost: 2024, ikona: '📅' },
      ],
    },
  },
  {
    id: 'kompanija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Struktura kompanije',
    redosled: 4,
    podaci: {
      nivoi: [
        { naziv: 'Kompanija SPAJA', ikona: '🏢', deca: ['Tehnologija', 'Finansije', 'AI Division', 'Operacije'] },
        { naziv: 'Tehnologija', ikona: '💻', deca: ['Platforme', 'IT Proizvodi', 'Infrastruktura'] },
        { naziv: 'Finansije', ikona: '💰', deca: ['Banka', 'Menjacnica', 'Investicije'] },
        { naziv: 'AI Division', ikona: '🧠', deca: ['OMEGA AI', 'ML Modeli', 'Automatizacija'] },
        { naziv: 'Operacije', ikona: '⚙️', deca: ['Deploy', 'Monitoring', 'Podrska'] },
      ],
    },
  },
  {
    id: 'kompanija-kartice',
    tip: 'kartice',
    naslov: '🏛️ Sektori kompanije',
    redosled: 5,
    podaci: {
      kartice: [
        { naslov: 'Tehnologija', opis: 'Razvoj platformi i IT proizvoda', ikona: '💻', oznake: ['Next.js', 'TypeScript', 'Vercel'] },
        { naslov: 'Finansije', opis: 'Digitalno bankarstvo i menjacnica', ikona: '💰', oznake: ['Banka', 'Menjacnica', 'Kripto'] },
        { naslov: 'AI Division', opis: '21 OMEGA AI persona za automatizaciju', ikona: '🧠', oznake: ['GPT-4', 'OpenAI', 'LangChain'] },
        { naslov: 'Operacije', opis: 'Deploy, monitoring i infrastruktura', ikona: '⚙️', oznake: ['Vercel', 'GitHub', 'CI/CD'] },
      ],
    },
  },
  {
    id: 'kompanija-cta',
    tip: 'cta',
    naslov: '🚀 Priduzite se ekosistemu',
    redosled: 6,
    podaci: {
      opis: 'Kompanija SPAJA — digitalna industrija buducnosti.',
      dugmad: [
        { tekst: 'Organizacija', href: '/organizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
