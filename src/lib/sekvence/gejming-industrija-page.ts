import type { Sekvenca } from '@/lib/types';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';
import { buildGejmingIndustrija } from '@/lib/gejming-industrija';

const r = buildGejmingIndustrija('system');

export const gejmingIndustrijaSekvence: Sekvenca[] = [
  {
    id: 'gejming-industrija-hero',
    tip: 'hero',
    naslov: '🎮 Gejming Industrija — Nad-sloj Gaming Ekosistema',
    podnaslov:
      'Pravljenje, dodavanje, izmišljanje, vizioniranje, stvaranje, eksploatisanje i omogućavanje starih i novih igrica',
    ikona: '🎮',
    redosled: 1,
    podaci: {
      opis:
        `Gejming industrija objedinjuje ceo gaming sistem: katalog (${r.pregled.ukupnoIgrica} igrica), ` +
        `lifecycle tokove, creation pipeline, distribuciju i pristup. Stare igrice: ${r.pregled.starihIgrica}, ` +
        `nove igrice: ${r.pregled.novihIgrica}.`,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Glavni Endžin', href: '/glavni-endzin', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'gejming-industrija-statistika',
    tip: 'statistika',
    naslov: '📊 Gejming Industrija — KPI',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Igrica', vrednost: r.pregled.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'Stare Igrice', vrednost: r.pregled.starihIgrica, ikona: '🕹️' },
        { naziv: 'Nove Igrice', vrednost: r.pregled.novihIgrica, ikona: '✨' },
        { naziv: 'Kategorije', vrednost: r.pregled.katalogKategorija, ikona: '🏷️' },
        { naziv: 'Aktivne', vrednost: r.pregled.aktivnihIgrica, ikona: '✅' },
        { naziv: 'Planirane', vrednost: r.pregled.planiranihIgrica, ikona: '📋' },
        { naziv: 'Gaming Endžini', vrednost: r.kpi.engineGamingEndzina, ikona: '⚙️' },
        { naziv: 'Prosečna Opt.', vrednost: `${r.pregled.prosecnaOptimizacija}%`, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'gejming-industrija-lifecycle',
    tip: 'tabela',
    naslov: '🔄 Lifecycle Igara',
    podnaslov: 'Vizioniranje → Izmišljanje → Stvaranje → Dodavanje → Omogućavanje → Eksploatisanje',
    redosled: 3,
    podaci: {
      zaglavlje: ['Faza', 'Opis', 'Broj igrica'],
      redovi: r.domeni.lifecycleIgara.tokovi.map((tok) => [
        tok.faza,
        tok.opis,
        String(tok.brojIgrica),
      ]),
    },
  },
  {
    id: 'gejming-industrija-domeni',
    tip: 'kartice',
    naslov: '🧩 Domenski opseg Gejming Industrije',
    redosled: 4,
    podaci: {
      kartice: [
        {
          naslov: '📚 Katalog igara',
          opis: `${r.pregled.ukupnoIgrica} igrica u ${r.pregled.katalogKategorija} kategorija.`,
          ikona: '📚',
          oznake: ['Katalog', 'Kategorije', 'Pregled'],
        },
        {
          naslov: '🔄 Lifecycle igara',
          opis: `Aktivne: ${r.domeni.lifecycleIgara.aktivne}, beta: ${r.domeni.lifecycleIgara.beta}, razvoj: ${r.domeni.lifecycleIgara.razvoj}, planirane: ${r.domeni.lifecycleIgara.planirane}.`,
          ikona: '🔄',
          oznake: ['Lifecycle', 'Status', 'Tokovi'],
        },
        {
          naslov: '🏗️ Game-creation pipeline',
          opis: `Kapacitet novih igrica: ${r.domeni.gameCreationPipeline.kapacitetNovihIgrica}.`,
          ikona: '🏗️',
          oznake: ['Pravljenje', 'Dodavanje', 'Stvaranje'],
        },
        {
          naslov: '💰 Distribucija i monetizacija',
          opis: `Primarni kanal: ${r.domeni.distribucijaMonetizacija.primarniKanal}.`,
          ikona: '💰',
          oznake: ['Distribucija', 'Monetizacija', 'Eksploatisanje'],
        },
        {
          naslov: '🔐 Pristup korisnika',
          opis: r.domeni.pristupKorisnika.primarniPristup,
          ikona: '🔐',
          oznake: ['Login', 'Omogućavanje', 'Pristup'],
        },
      ],
    },
  },
  {
    id: 'gejming-industrija-kategorije',
    tip: 'tabela',
    naslov: '🏷️ Katalog po kategorijama',
    redosled: 5,
    podaci: {
      zaglavlje: ['Kategorija', 'Broj igrica'],
      redovi: r.domeni.katalogIgara.poKategoriji.map((kat) => [
        kat.kategorija,
        String(kat.brojIgrica),
      ]),
    },
  },
  {
    id: 'gejming-industrija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Struktura Gejming Industrije',
    redosled: 6,
    podaci: {
      nivoi: [
        {
          naziv: 'Gejming Industrija',
          ikona: '🎮',
          deca: ['Katalog igara', 'Lifecycle', 'Creation pipeline', 'Distribucija/Monetizacija', 'Pristup'],
        },
        {
          naziv: 'Katalog i lifecycle',
          ikona: '📚',
          deca: [
            `Ukupno igrica: ${r.pregled.ukupnoIgrica}`,
            `Stare: ${r.pregled.starihIgrica}`,
            `Nove: ${r.pregled.novihIgrica}`,
            `Kategorije: ${r.pregled.katalogKategorija}`,
          ],
        },
        {
          naziv: 'Operativni kapacitet',
          ikona: '⚙️',
          deca: [
            `Gaming endžina: ${r.kpi.engineGamingEndzina}`,
            `Pokrenutih igrica: ${r.kpi.enginePokrenutihIgrica}`,
            `Sa prevučenim endžinom: ${r.kpi.gejmingSaPrevucenimEndzinom}`,
            `Aktivne sa endžinom: ${r.kpi.aktivneIgriceSaEndzinom}`,
          ],
        },
      ],
    },
  },
  {
    id: 'gejming-industrija-tekst',
    tip: 'tekst',
    naslov: '🧠 Operativna logika',
    redosled: 7,
    podaci: {
      sadrzaj:
        `Gejming industrija je objedinjeni nad-sloj nad postojećim gaming modulima. ` +
        `Povezuje katalog, lifecycle, kreiranje i distribuciju igara sa operativnim statusom sistema. ` +
        `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona učestvuju u kontinuiranoj evoluciji gaming tokova.`,
      istaknuteStavke: [
        'Pravljenje i stvaranje novih igara kroz pipeline faze',
        'Dodavanje i omogućavanje pristupa kroz platformske tokove',
        'Eksploatisanje kroz distribuciju, optimizaciju i monetizacione kanale',
        'Objedinjena analitika starih i novih igara',
      ],
    },
  },
  {
    id: 'gejming-industrija-cta',
    tip: 'cta',
    naslov: '🚀 Otvori Gejming Industriju',
    redosled: 8,
    podaci: {
      opis:
        `Gejming industrija integriše ${r.pregled.ukupnoIgrica} igrica, lifecycle i creation tokove, ` +
        `uz distribuciju i operativni nadzor kroz glavne gaming endžine.`,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
        { tekst: 'Digitalna Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Prijava', href: '/login', stil: 'sekundarno' },
      ],
    },
  },
];
