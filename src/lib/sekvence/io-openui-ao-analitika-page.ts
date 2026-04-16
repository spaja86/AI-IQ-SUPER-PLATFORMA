import type { Sekvenca } from '@/lib/types';
import {
  simulacije,
  laboratorijskiAlati,
  ioOpenUIAOLaboratorija,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';
import {
  endzinNadIgricama,
  gamingStatistika,
  gamingKonfiguracija,
  ioOpenUIAOGamingPlatforma,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';

const labStatistika = getLaboratorijaStatistika();
const aktivnihSim = getAktivneSimulacije().length;

export const ioOpenUIAOAnalitikaSekvence: Sekvenca[] = [
  {
    id: 'analitika-hero',
    tip: 'hero',
    naslov: '📊 IO/OPENUI/AO Analitika',
    podnaslov: 'Kombinovana analitika Gaming Platforme i Laboratorije',
    ikona: '📊',
    redosled: 1,
    podaci: {
      opis: `IO/OPENUI/AO Analitika — Kompletna analitika za ${endzinNadIgricama.length} igrica i ${simulacije.length} simulacija. URL: ${IOOPENUIAO_URL}`,
      dugmad: [
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'analitika-tekst',
    tip: 'tekst',
    naslov: 'Šta je IO/OPENUI/AO Analitika?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'IO/OPENUI/AO Analitika je kombinovani pregled performansi i statusa celokupne IO/OPENUI/AO platforme. ' +
        'Obuhvata Gaming Platformu sa 95 igrica u 18 kategorija pokretanih SPAJA Univerzalnim Endžinom, ' +
        'kao i Laboratoriju za Simulacije sa 10 naučnih simulacija u 8 kategorija. ' +
        'Analitika prati optimizaciju, preciznost, aktivne module i zdravlje sistema.',
      istaknuteStavke: [
        `Gaming: ${endzinNadIgricama.length} igrica — ${gamingStatistika.prosecnaOptimizacija}% optimizacija`,
        `Lab: ${simulacije.length} simulacija — ${labStatistika.prosecnaPreciznost}% preciznost`,
        `${laboratorijskiAlati.length} laboratorijskih alata`,
        `${gamingStatistika.ukupnoKategorija} gaming kategorija`,
        `URL: ${IOOPENUIAO_URL}`,
        'Pokretano od SPAJA Generator za Endžine',
      ],
    },
  },
  {
    id: 'analitika-statistika',
    tip: 'statistika',
    naslov: '📈 IO/OPENUI/AO u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Igrice', vrednost: endzinNadIgricama.length, ikona: '🎮' },
        { naziv: 'Kategorije', vrednost: gamingStatistika.ukupnoKategorija, ikona: '📂' },
        { naziv: 'Optimizacija', vrednost: `${gamingStatistika.prosecnaOptimizacija}%`, ikona: '⚡' },
        { naziv: 'Simulacije', vrednost: simulacije.length, ikona: '🔬' },
        { naziv: 'Aktivne sim.', vrednost: aktivnihSim, ikona: '✅' },
        { naziv: 'Alati', vrednost: laboratorijskiAlati.length, ikona: '🔧' },
        { naziv: 'Preciznost', vrednost: `${labStatistika.prosecnaPreciznost}%`, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'analitika-gaming-progres',
    tip: 'progres',
    naslov: '🎮 Gaming Platforma — Optimizacija',
    redosled: 4,
    podaci: {
      progres: gamingStatistika.prosecnaOptimizacija,
      poruka: `SPAJA Univerzalni Endžin prevučen preko svih ${gamingStatistika.prevucenoEndžinom} igrica — prosečna optimizacija ${gamingStatistika.prosecnaOptimizacija}%.`,
    },
  },
  {
    id: 'analitika-lab-progres',
    tip: 'progres',
    naslov: '🔬 Laboratorija — Preciznost',
    redosled: 5,
    podaci: {
      progres: labStatistika.prosecnaPreciznost,
      poruka: `${aktivnihSim} aktivnih simulacija od ukupno ${simulacije.length} — prosečna preciznost ${labStatistika.prosecnaPreciznost}%.`,
    },
  },
  {
    id: 'analitika-gaming-tabela',
    tip: 'tabela',
    naslov: '🎮 Gaming kategorije — Pregled',
    redosled: 6,
    podaci: {
      zaglavlje: ['Kategorija', 'Broj igrica', 'Endžin status'],
      redovi: Object.entries(
        endzinNadIgricama.reduce<Record<string, number>>((acc, e) => {
          const kat = e.igricaKategorija;
          acc[kat] = (acc[kat] ?? 0) + 1;
          return acc;
        }, {}),
      ).map(([kat, br]) => [kat, `${br}`, '✅ Prevučen']),
    },
  },
  {
    id: 'analitika-lab-tabela',
    tip: 'tabela',
    naslov: '🔬 Simulacije — Pregled',
    redosled: 7,
    podaci: {
      zaglavlje: ['Simulacija', 'Kategorija', 'Status', 'Preciznost'],
      redovi: simulacije.map((s) => [
        s.naziv,
        s.kategorija,
        s.status,
        `${s.preciznost}%`,
      ]),
    },
  },
  {
    id: 'analitika-konfiguracija',
    tip: 'tabela',
    naslov: '⚙️ Konfiguracija platforme',
    redosled: 8,
    podaci: {
      zaglavlje: ['Parametar', 'Vrednost'],
      redovi: [
        ['URL', IOOPENUIAO_URL],
        ['Domen', gamingKonfiguracija.domen],
        ['Protokol', gamingKonfiguracija.protokol],
        ['Platforma ID', gamingKonfiguracija.platformaId],
        ['Lab verzija', ioOpenUIAOLaboratorija.verzija],
        ['Gaming verzija', ioOpenUIAOGamingPlatforma.verzija],
        ['Status', 'Aktivan'],
      ],
    },
  },
  {
    id: 'analitika-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ IO/OPENUI/AO Arhitektura',
    redosled: 9,
    podaci: {
      nivoi: [
        {
          naziv: 'IO/OPENUI/AO Platforma',
          ikona: '🌐',
          deca: ['Gaming Platforma', 'Laboratorija za Simulacije', 'Analitika'],
        },
        {
          naziv: 'Gaming Platforma',
          ikona: '🎮',
          deca: [`${endzinNadIgricama.length} igrica`, `${gamingStatistika.ukupnoKategorija} kategorija`, 'SPAJA Univerzalni Endžin'],
        },
        {
          naziv: 'Laboratorija za Simulacije',
          ikona: '🔬',
          deca: [`${simulacije.length} simulacija`, `${laboratorijskiAlati.length} alata`, `${labStatistika.ukupnoKategorija} kategorija`],
        },
        {
          naziv: 'Analitika',
          ikona: '📊',
          deca: ['Gaming performansi', 'Lab preciznost', 'Zdravlje sistema'],
        },
      ],
    },
  },
  {
    id: 'analitika-baner',
    tip: 'baner',
    naslov: 'IO/OPENUI/AO — Kompletna analitika',
    redosled: 10,
    podaci: {
      bedz: '📊 Analitika',
      opis: `IO/OPENUI/AO Analitika — ${endzinNadIgricama.length} igrica (${gamingStatistika.prosecnaOptimizacija}% optimizacija) + ${simulacije.length} simulacija (${labStatistika.prosecnaPreciznost}% preciznost). Pokretano od SPAJA Generatora za Endžine.`,
      dugme: { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma' },
    },
  },
  {
    id: 'analitika-cta',
    tip: 'cta',
    naslov: '🚀 IO/OPENUI/AO Infrastruktura',
    redosled: 11,
    podaci: {
      opis: `Celokupna IO/OPENUI/AO platforma — ${endzinNadIgricama.length} igrica, ${simulacije.length} simulacija, ${laboratorijskiAlati.length} alata. URL: ${IOOPENUIAO_URL}`,
      dugmad: [
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
