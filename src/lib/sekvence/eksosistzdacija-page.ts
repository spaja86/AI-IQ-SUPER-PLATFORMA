import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const eksosistzdacijaSekvence: Sekvenca[] = [
  {
    id: 'eksosistzdacija-hero',
    tip: 'hero',
    naslov: '🧩 Eksosistzdacija',
    podnaslov: 'Novi modul za mapiranje i konsolidaciju ekosistemskih tokova',
    ikona: '🧩',
    redosled: 1,
    podaci: {
      opis: 'Eksosistzdacija je centralni modul za povezivanje platformi, procesa i AI podsistema u jedinstven operativni pregled.',
      dugmad: [
        { tekst: 'Ekosistem', href: '/ekosistem' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'eksosistzdacija-statistika',
    tip: 'statistika',
    naslov: '📊 Operativni pregled',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Platformi', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Ukupno Stranica', vrednost: stats.ukupnoStranica, ikona: '📄' },
        { naziv: 'Ukupno Ruta', vrednost: stats.ukupnoRuta, ikona: '🗺️' },
        { naziv: 'API Ruta', vrednost: stats.ukupnoAPIRuta, ikona: '🔌' },
      ],
    },
  },
  {
    id: 'eksosistzdacija-kartice',
    tip: 'kartice',
    naslov: '🧱 Ključni stubovi',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Mapiranje',
          opis: 'Jasan inventar svih ključnih ekosistemskih veza i zavisnosti.',
          ikona: '🗺️',
          oznake: ['Rute', 'Zavisnosti', 'Registar'],
        },
        {
          naslov: 'Stabilizacija',
          opis: 'Standardizovan operativni tok između stranica, API-ja i podsistema.',
          ikona: '🛡️',
          oznake: ['Usklađenost', 'Kontrola', 'Operativa'],
        },
        {
          naslov: 'Vidljivost',
          opis: 'Brži uvid u status platforme i spremnost za dalje evolutivne cikluse.',
          ikona: '👁️',
          oznake: ['Monitoring', 'Status', 'Spremnost'],
        },
      ],
    },
  },
  {
    id: 'eksosistzdacija-cta',
    tip: 'cta',
    naslov: '🚀 Pokreni Eksosistzdaciju',
    redosled: 4,
    podaci: {
      opis: 'Pristupi centralnom modulu i pokreni operativnu konsolidaciju kroz ekosistem.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
];
