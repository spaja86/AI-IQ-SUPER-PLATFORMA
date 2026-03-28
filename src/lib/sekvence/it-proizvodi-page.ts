import type { Sekvenca } from '@/lib/types';
import { itProizvodi, getBrojPoKategoriji } from '@/lib/it-proizvodi';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();
const brojPo = getBrojPoKategoriji();

export const itProizvodiSekvence: Sekvenca[] = [
  {
    id: 'it-hero',
    tip: 'hero',
    naslov: '⚡ IT Proizvodi',
    podnaslov: `${stats.ukupnoProizvoda} proizvoda u ${stats.kategorijeProizvoda} kategorija`,
    ikona: '⚡',
    redosled: 1,
    podaci: { opis: 'Svi IT proizvodi Kompanije SPAJA.' },
  },
  {
    id: 'it-statistika',
    tip: 'statistika',
    naslov: 'Pregled po kategorijama',
    redosled: 2,
    podaci: {
      stavke: Object.entries(brojPo).map(([kat, broj]) => {
        const ikonaMap: Record<string, string> = {
          ubrzanje: '⚡',
          monitoring: '📊',
          bezbednost: '🛡️',
          ai: '🧠',
          deploy: '🚀',
          integracija: '🔗',
          podaci: '📡',
          komunikacija: '💬',
        };
        return { naziv: kat, vrednost: broj, ikona: ikonaMap[kat] ?? '📦' };
      }),
    },
  },
  {
    id: 'it-kartice',
    tip: 'kartice',
    naslov: '⚡ Svi proizvodi',
    redosled: 3,
    podaci: {
      kartice: itProizvodi.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [...p.funkcije.slice(0, 2), p.uticaj],
      })),
    },
  },
  {
    id: 'it-cta',
    tip: 'cta',
    naslov: 'Misija: Sve na 100%',
    redosled: 4,
    podaci: {
      opis: 'Svaki IT proizvod pomaze ekosistemu da dostigne punu operativnost.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
];
