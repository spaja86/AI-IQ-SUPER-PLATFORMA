import type { Sekvenca } from '@/lib/types';
import {
  simulacije,
  laboratorijskiAlati,
  ioOpenUIAOLaboratorija,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';

const statistika = getLaboratorijaStatistika();
const aktivnihSim = getAktivneSimulacije().length;

export const ioOpenUIAOLabSekvence: Sekvenca[] = [
  {
    id: 'laboratorija-hero',
    tip: 'hero',
    naslov: '🔬 IOOpenUIAO Laboratorija za Simulacije',
    podnaslov: 'Simulaciona Laboratorija za celokupni SPAJA Ekosistem',
    ikona: '🔬',
    redosled: 1,
    podaci: {
      opis: `${ioOpenUIAOLaboratorija.opis} Link: ${ioOpenUIAOLaboratorija.link}`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Brouvzer', href: '/spaja-digitalni-brouvzer', stil: 'sekundarno' },
        { tekst: 'Render', href: '/spaja-render-medija', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laboratorija-tekst',
    tip: 'tekst',
    naslov: 'Šta je IOOpenUIAO Laboratorija za Simulacije?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'IOOpenUIAO Laboratorija za Simulacije izvodi razne naučne i tehničke simulacije za celokupni ' +
        'SPAJA ekosistem. Od kvantne fizike i hemijskih reakcija do AI treninga i ekonomskih modela — ' +
        'laboratorija pokriva 8 kategorija simulacija sa naprednim alatima za analizu i vizualizaciju.',
      istaknuteStavke: [
        `${simulacije.length} simulacija u ${statistika.ukupnoKategorija} kategorija`,
        `${laboratorijskiAlati.length} laboratorijskih alata`,
        `${aktivnihSim} aktivnih simulacija`,
        `Prosečna preciznost: ${statistika.prosecnaPreciznost}%`,
        'Pokretana od strane SPAJA Generator za Endžine',
        `Link: ${ioOpenUIAOLaboratorija.link}`,
      ],
    },
  },
  {
    id: 'laboratorija-statistika',
    tip: 'statistika',
    naslov: '📊 Laboratorija u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Simulacije', vrednost: simulacije.length, ikona: '🔬' },
        { naziv: 'Aktivne', vrednost: aktivnihSim, ikona: '✅' },
        { naziv: 'Alati', vrednost: laboratorijskiAlati.length, ikona: '🔧' },
        { naziv: 'Kategorije', vrednost: statistika.ukupnoKategorija, ikona: '📂' },
        { naziv: 'Preciznost', vrednost: `${statistika.prosecnaPreciznost}%`, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'laboratorija-progres',
    tip: 'progres',
    naslov: '🚀 Prosečna preciznost simulacija',
    redosled: 4,
    podaci: {
      progres: statistika.prosecnaPreciznost,
      poruka: `IOOpenUIAO Laboratorija ima ${aktivnihSim} aktivnih simulacija sa prosečnom preciznošću od ${statistika.prosecnaPreciznost}%.`,
    },
  },
  {
    id: 'laboratorija-kartice-simulacije',
    tip: 'kartice',
    naslov: '🔬 Simulacije',
    podnaslov: `${simulacije.length} simulacija u ${statistika.ukupnoKategorija} kategorija`,
    redosled: 5,
    podaci: {
      kartice: simulacije.map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        progres: s.preciznost,
        oznake: [s.kategorija, s.status, `v${s.verzija}`, `${s.preciznost}%`],
      })),
    },
  },
  {
    id: 'laboratorija-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija simulacija',
    redosled: 6,
    podaci: {
      zaglavlje: ['Simulacija', 'Kategorija', 'Verzija', 'Status', 'Preciznost'],
      redovi: simulacije.map((s) => [
        s.naziv,
        s.kategorija,
        `v${s.verzija}`,
        s.status,
        `${s.preciznost}%`,
      ]),
    },
  },
  {
    id: 'laboratorija-kartice-alati',
    tip: 'kartice',
    naslov: '🔧 Laboratorijski Alati',
    podnaslov: `${laboratorijskiAlati.length} alata za simulacije`,
    redosled: 7,
    podaci: {
      kartice: laboratorijskiAlati.map((a) => ({
        naslov: a.naziv,
        opis: a.opis,
        ikona: a.ikona,
        oznake: [a.tip],
      })),
    },
  },
  {
    id: 'laboratorija-lista-alati',
    tip: 'lista',
    naslov: '⚙️ Mogućnosti alata',
    podnaslov: 'Detaljan pregled mogućnosti svakog alata',
    redosled: 8,
    podaci: {
      stavke: laboratorijskiAlati.map((a) => ({
        ikona: a.ikona,
        naslov: a.naziv,
        opis: `${a.opis} — Mogućnosti: ${a.mogucnosti.join(', ')} | Tip: ${a.tip}`,
      })),
    },
  },
  {
    id: 'laboratorija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Laboratorije',
    redosled: 9,
    podaci: {
      nivoi: [
        {
          naziv: 'IOOpenUIAO Laboratorija za Simulacije',
          ikona: '🔬',
          deca: ['Simulacije', 'Laboratorijski Alati', 'SPAJA Generator za Endžine'],
        },
        {
          naziv: 'Simulacije',
          ikona: '🧪',
          deca: simulacije.map((s) => `${s.ikona} ${s.naziv}`),
        },
        {
          naziv: 'Laboratorijski Alati',
          ikona: '🔧',
          deca: laboratorijskiAlati.map((a) => `${a.ikona} ${a.naziv}`),
        },
      ],
    },
  },
  {
    id: 'laboratorija-baner',
    tip: 'baner',
    naslov: 'IOOpenUIAO Laboratorija — Naučne simulacije',
    redosled: 10,
    podaci: {
      bedz: '🔬 Laboratorija',
      opis: `IOOpenUIAO Laboratorija za Simulacije sa ${simulacije.length} simulacija u ${statistika.ukupnoKategorija} kategorija i ${laboratorijskiAlati.length} alata. Prosečna preciznost: ${statistika.prosecnaPreciznost}%. Pokretana od SPAJA Generatora za Endžine.`,
      dugme: { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
    },
  },
  {
    id: 'laboratorija-cta',
    tip: 'cta',
    naslov: '🚀 Laboratorija infrastruktura',
    redosled: 11,
    podaci: {
      opis: `IOOpenUIAO Laboratorija — ${simulacije.length} simulacija, ${laboratorijskiAlati.length} alata, ${statistika.prosecnaPreciznost}% prosečna preciznost. Celokupan simulacioni sistem za SPAJA ekosistem.`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Brouvzer', href: '/spaja-digitalni-brouvzer', stil: 'sekundarno' },
        { tekst: 'Render', href: '/spaja-render-medija', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
