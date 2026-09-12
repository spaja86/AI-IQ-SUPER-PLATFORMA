import type { Sekvenca } from '@/lib/types';
import { getEditorialMediji } from '@/lib/editorial-mediji';

const editorial = getEditorialMediji();

export const editorialMedijiSekvence: Sekvenca[] = [
  {
    id: 'editorial-hero',
    tip: 'hero',
    naslov: '📰 Editorial / Media Vertikala',
    podnaslov: 'Ljubavni romani · romani · stripovi · zabavnik · novine',
    ikona: '📰',
    redosled: 1,
    podaci: {
      opis: 'Jedinstvena media vertikala za web prikaz, čitljive listinge, arhivu izdanja i budući PDF/publishing tok.',
      dugmad: [
        { tekst: 'DIKTOR template', href: '/diktor-komandni-centar' },
        { tekst: 'EXTRIMLI Priče', href: '/extrimli-price', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'editorial-formati',
    tip: 'kartice',
    naslov: '📚 Formati sadržaja',
    redosled: 2,
    podaci: {
      kartice: editorial.formati.map((format) => ({
        naslov: format.naziv,
        opis: format.opis,
        ikona: '📖',
        oznake: [editorial.exportModelVersion, 'web-ready', 'pdf-ready'],
      })),
    },
  },
  {
    id: 'editorial-serijali',
    tip: 'tabela',
    naslov: '🗂️ Serijali, autori i status',
    redosled: 3,
    podaci: {
      zaglavlje: ['Serijal', 'Format', 'Autor', 'Status'],
      redovi: editorial.serijali.map((serijal) => [
        serijal.naziv,
        editorial.formati.find((format) => format.id === serijal.formatId)?.naziv ?? serijal.formatId,
        serijal.autor,
        serijal.status,
      ]),
    },
  },
  {
    id: 'editorial-archive',
    tip: 'lista',
    naslov: '🧾 Arhiva i publishing model',
    redosled: 4,
    podaci: {
      stavke: [
        ...editorial.arhiva.map((stavka) => ({ ikona: '🗃️', naslov: 'Arhiva', opis: stavka })),
        { ikona: '📄', naslov: 'Export model', opis: `Zajednički model: ${editorial.exportModelVersion}` },
      ],
    },
  },
];
