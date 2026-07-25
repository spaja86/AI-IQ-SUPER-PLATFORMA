import type { Sekvenca } from '@/lib/types';
import { buildMikrofile } from '@/lib/mikrofile';

const mikrofileData = buildMikrofile('system');
const poslednjiFajlovi = [...mikrofileData.stavke]
  .map((stavka) => ({ stavka, ts: Date.parse(stavka.timestamp) }))
  .sort((a, b) => b.ts - a.ts)
  .slice(0, 8)
  .map(({ stavka }) => stavka);

const tipIkone: Record<string, string> = {
  faktura: '🧾',
  licenca: '📜',
  ugovor: '🤝',
  izvestaj: '📊',
  akt: '🗂️',
  barkod: '🔢',
  ostalo: '📁',
};

export const mikrofileSekvence: Sekvenca[] = [
  {
    id: 'mikrofile-hero',
    tip: 'hero',
    naslov: '📁 MIKROFILE — Mikro-Digitalni Arhivski Sistem',
    podnaslov: 'Centralni registar mikro-digitalnih dokumenata i zapisa',
    ikona: '📁',
    redosled: 1,
    podaci: {
      opis:
        `Ukupno mikro-fajlova: ${mikrofileData.kpi.ukupnoFajlova}. ` +
        'Sistem objedinjeno prati fakture, licence, ugovore, izveštaje i BAR KOD reference.',
      dugmad: [
        { tekst: 'MIKROFILE API', href: '/api/mikrofile' },
        { tekst: 'BAR KOD', href: '/bar-kod', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'mikrofile-kpi',
    tip: 'statistika',
    naslov: '📊 KPI MIKROFILE sistema',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno fajlova', vrednost: mikrofileData.kpi.ukupnoFajlova, ikona: '📄' },
        // `ukupnaVelicina` je u bajtima; za UI je namerno zaokruženo na cele KB (÷1024).
        { naziv: 'Ukupna veličina (KB)', vrednost: Math.round(mikrofileData.kpi.ukupnaVelicina / 1024), ikona: '💾' },
        { naziv: 'Aktivni fajlovi', vrednost: mikrofileData.kpi.poStatusu.aktivan, ikona: '✅' },
        { naziv: 'Arhivirani fajlovi', vrednost: mikrofileData.kpi.poStatusu.arhiviran, ikona: '🗄️' },
      ],
    },
  },
  {
    id: 'mikrofile-tabela',
    tip: 'tabela',
    naslov: '📋 Registar mikro-fajlova',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Naziv', 'Tip', 'Status', 'Veličina (B)', 'Vlasnik', 'Timestamp'],
      redovi: mikrofileData.stavke.map((s) => [
        s.id,
        s.naziv,
        s.tip,
        s.status,
        String(s.velicina),
        s.vlasnik,
        s.timestamp,
      ]),
    },
  },
  {
    id: 'mikrofile-tip-distribucija',
    tip: 'kartice',
    naslov: '🧩 Distribucija po tipu fajla',
    redosled: 4,
    podaci: {
      kartice: Object.entries(mikrofileData.kpi.poTipu).map(([tip, broj]) => ({
        naslov: tip.toUpperCase(),
        opis: `Ukupno stavki: ${broj}`,
        ikona: tipIkone[tip] ?? '📁',
        oznake: ['mikrofile', `count:${broj}`],
      })),
    },
  },
  {
    id: 'mikrofile-poslednji',
    tip: 'lista',
    naslov: '🕒 Poslednje dodati fajlovi',
    redosled: 5,
    podaci: {
      stavke: poslednjiFajlovi.map((s) => ({
        ikona: tipIkone[s.tip] ?? '📁',
        naslov: s.naziv,
        opis: `${s.tip} • ${s.status} • ${s.vlasnik} • ${s.timestamp}`,
      })),
    },
  },
  {
    id: 'mikrofile-cta',
    tip: 'cta',
    naslov: '🚀 Integracija MIKROFILE sistema',
    redosled: 6,
    podaci: {
      opis: 'MIKROFILE API omogućava centralni uvid u mikro-digitalne dokumente sa BAR KOD i licencnim referencama.',
      dugmad: [
        { tekst: 'MIKROFILE API', href: '/api/mikrofile' },
        { tekst: 'BAR KOD API', href: '/api/bar-kod', stil: 'sekundarno' },
      ],
    },
  },
];
