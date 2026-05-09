import type { Sekvenca } from '@/lib/types';

export const pametniUgoвориSekvence: Sekvenca[] = [
  {
    id: 'pametni-ugovori-hero',
    tip: 'hero',
    naslov: '📜 Pametni Ugovori — Digitalna Era',
    podnaslov:
      'Kraj papirnatih ugovora — OMEGA AI platforma pokreće digitalnu zakonsku infrastrukturu sa blockchain pametnim ugovorima, svim licencama i potpunom pravnom zaštitom',
    ikona: '📜',
    redosled: 1,
    podaci: {
      opis: 'Digitalna industrija SPAJA zamenjuje klasične papirne ugovore pametnim ugovorima na blockchain-u. Sve licence su aktivne, radnici OMEGA AI su opremljeni, call centar i dispeč su operativni.',
      dugmad: [
        { tekst: 'Blockchain', href: '/blockchain' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pametni-ugovori-statistika',
    tip: 'statistika',
    naslov: '📊 Digitalna infrastruktura u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Aktivnih licenci', vrednost: '100%', ikona: '✅' },
        { naziv: 'Pametnih ugovora', vrednost: 'Blockchain', ikona: '🔗' },
        { naziv: 'OMEGA AI radnici', vrednost: '21', ikona: '🤖' },
        { naziv: 'Call centar', vrednost: 'Aktivan', ikona: '📞' },
        { naziv: 'Poslovnih mejlova', vrednost: 'Aktivni', ikona: '📧' },
        { naziv: 'Dispeč sistem', vrednost: 'Online', ikona: '📡' },
      ],
    },
  },
  {
    id: 'pametni-ugovori-kartice',
    tip: 'kartice',
    naslov: '🔗 Digitalni poslovni ekosistem',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Pametni Ugovori',
          opis: 'Blockchain verifikovani ugovori zamenjuju papirnu dokumentaciju — transparentni, nepromenjivi i automatski izvršivi',
          ikona: '📜',
          oznake: ['Blockchain', 'Polygon', 'Automatski', 'Pravna snaga'],
        },
        {
          naslov: 'OMEGA AI Dispeč',
          opis: 'Centralni dispeč sistem za koordinaciju 21 OMEGA AI persona — real-time komunikacija i raspodela zadataka',
          ikona: '📡',
          oznake: ['Real-time', '21 persona', 'Koordinacija', 'SLA'],
        },
        {
          naslov: 'Digitalne Licence',
          opis: 'Sve poslovne licence su digitalne, verifikovane i aktivne — zakonski validno u digitalnom formatu',
          ikona: '🏅',
          oznake: ['Digitalne', 'Verifikovane', 'Aktivne', 'Zakonske'],
        },
        {
          naslov: 'Call Centar',
          opis: 'OMEGA AI call centar sa poslovnim mejlovima, telefonskim linijama i dispeč protokolima za svaki departman',
          ikona: '📞',
          oznake: ['24/7', 'Poslovni mejl', 'Direktna linija', 'Dispeč'],
        },
      ],
    },
  },
  {
    id: 'pametni-ugovori-lista',
    tip: 'lista',
    naslov: '✅ Prednosti digitalnih ugovora',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Transparentnost', opis: 'Svaka transakcija i ugovorni uslov je javno proverljiv na blockchain-u' },
        { naziv: 'Automatsko izvršenje', opis: 'Smart contract se automatski izvršava kada su ispunjeni uslovi — bez posrednika' },
        { naziv: 'Nepromenjivost', opis: 'Jednom zapisan ugovor ne može biti izmenjen ni od koje strane' },
        { naziv: 'Ušteda vremena', opis: 'Eliminacija papirne dokumentacije, potpisa i fizičke dostave ugovora' },
        { naziv: 'Pravna snaga', opis: 'Digitalni ugovori sa blockchain verifikacijom imaju pravnu snagu u EU regulativi' },
        { naziv: 'Integracija sa OMEGA AI', opis: 'Automatska koordinacija dispeč sistema, call centra i radnih naloga' },
      ],
    },
  },
];
