import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const organizacijaSekvence: Sekvenca[] = [
  {
    id: 'org-hero',
    tip: 'hero',
    naslov: '🌍 Organizacija',
    podnaslov: 'Globalna organizaciona struktura Kompanije SPAJA',
    ikona: '🌍',
    redosled: 1,
    podaci: {
      opis: 'Organizaciona struktura Kompanije SPAJA obuhvata vise sektora, timova i projekata koji zajedno cine integrisani digitalni ekosistem.',
      dugmad: [
        { tekst: 'Kompanija', href: '/kompanija' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'org-tekst',
    tip: 'tekst',
    naslov: 'O organizacionoj strukturi',
    redosled: 2,
    podaci: {
      sadrzaj: 'Kompanija SPAJA je organizovana po principu distribuiranih timova gde svaki sektor ima autonomiju ali deli zajednicku infrastrukturu i ciljeve.',
      istaknuteStavke: [
        'Distribuirana organizacija sa centralnom koordinacijom',
        'Svaki sektor ima svoju AI personu za podrsku',
        'Zajednicka infrastruktura i alati',
        'Agilni pristup razvoju sa nedeljnim sprintovima',
      ],
    },
  },
  {
    id: 'org-statistika',
    tip: 'statistika',
    naslov: '📊 Organizacija u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Sektori', vrednost: 6, ikona: '🏛️' },
        { naziv: 'Timovi', vrednost: 12, ikona: '👥' },
        { naziv: 'Projekti', vrednost: stats.ukupnoPlatformi + stats.ukupnoProizvoda, ikona: '📋' },
        { naziv: 'Lokacije', vrednost: 3, ikona: '📍' },
      ],
    },
  },
  {
    id: 'org-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Organizaciona hijerarhija',
    redosled: 4,
    podaci: {
      nivoi: [
        { naziv: 'SPAJA Korporacija', ikona: '🏢', deca: ['Uprava', 'Tehnicki sektor', 'Finansijski sektor', 'AI sektor'] },
        { naziv: 'Uprava', ikona: '👔', deca: ['CEO', 'CTO', 'CFO', 'CAO (AI Officer)'] },
        { naziv: 'Tehnicki sektor', ikona: '💻', deca: ['Platform tim', 'Proizvod tim', 'DevOps tim'] },
        { naziv: 'Finansijski sektor', ikona: '💰', deca: ['Banka tim', 'Menjacnica tim', 'Rizik tim'] },
        { naziv: 'AI sektor', ikona: '🧠', deca: ['OMEGA AI tim', 'ML tim', 'Data tim'] },
      ],
    },
  },
  {
    id: 'org-kartice',
    tip: 'kartice',
    naslov: '🏛️ Organizacione jedinice',
    redosled: 5,
    podaci: {
      kartice: [
        { naslov: 'Uprava', opis: 'Strategijsko vodjenje kompanije', ikona: '👔', oznake: ['Strategija', 'Odluke', 'Vizija'] },
        { naslov: 'Tehnicki sektor', opis: 'Razvoj platformi i proizvoda', ikona: '💻', oznake: ['Platforme', 'IT Proizvodi', 'Infrastruktura'] },
        { naslov: 'Finansijski sektor', opis: 'Bankarski i menjacki servisi', ikona: '💰', oznake: ['Banka', 'Menjacnica', 'Investicije'] },
        { naslov: 'AI sektor', opis: 'Vestacka inteligencija i automatizacija', ikona: '🧠', oznake: ['OMEGA AI', 'ML modeli', 'Automatizacija'] },
        { naslov: 'Operacije', opis: 'Deploy, monitoring i infrastruktura', ikona: '⚙️', oznake: ['Vercel', 'GitHub', 'CI/CD'] },
        { naslov: 'Kvalitet', opis: 'Testiranje i osiguranje kvaliteta', ikona: '🧪', oznake: ['Testovi', 'QA', 'Auto-Popravka'] },
      ],
    },
  },
  {
    id: 'org-cta',
    tip: 'cta',
    naslov: '🚀 Saznajte vise',
    redosled: 6,
    podaci: {
      opis: 'Organizacija Kompanije SPAJA — struktura za uspeh u digitalnoj eri.',
      dugmad: [
        { tekst: 'Kompanija', href: '/kompanija' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
