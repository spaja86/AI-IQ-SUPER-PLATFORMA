import type { Sekvenca } from '@/lib/types';
import {
  nabavkaStavke,
  glavniSistemNabavka,
  getNabavkaStatistika,
  getNabavkaPoKategoriji,
} from '@/lib/glavni-sistem-nabavka';
import { getGlavniEndzinStatistika } from '@/lib/glavni-endzin-digitalne-industrije';

const stats = getNabavkaStatistika();
const endzinStats = getGlavniEndzinStatistika();

export const glavniSistemNabavkaSekvence: Sekvenca[] = [
  {
    id: 'nabavka-hero',
    tip: 'hero',
    naslov: '🏭💰 Glavni Sistem Nabavke — Digitalna Industrija',
    podnaslov: `${stats.ukupnoStavki} digitalnih varijacija kupljeno iz AI IQ World Bank — ukupno $${stats.ukupnoPotroseno.toLocaleString()} USD`,
    ikona: '💰',
    redosled: 1,
    podaci: {
      opis: glavniSistemNabavka.opis,
      dugmad: [
        { tekst: 'Glavni Endžin', href: '/glavni-endzin' },
        { tekst: 'Banka', href: '/banka', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'nabavka-tekst',
    tip: 'tekst',
    naslov: 'Glavni Endžin + Glavni Sistem = Jedna Celina',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Glavni Endžin Digitalne Industrije i Glavni Sistem Nabavke su sada SPOJENI u jednu celinu. ' +
        'Endžin pokreće SVE — od platformi do igrica, od AI persona do proksi mreže. ' +
        'Sistem troši pare iz AI IQ World Bank i kupuje sve što je potrebno Digitalnoj Industriji. ' +
        'Zajedno čine neraskidivu celinu koja automatski proizvodi, kupuje, unapređuje i evolvira.',
      istaknuteStavke: [
        `${stats.ukupnoStavki} digitalnih varijacija kupljeno`,
        `$${stats.ukupnoPotroseno.toLocaleString()} USD ukupno potrošeno`,
        `${stats.kategorija} kategorija nabavke`,
        `${stats.transakcija} transakcija izvršeno`,
        `${endzinStats.ukupnoSpojenih} endžina spojeno u Glavni Endžin`,
        'Banka izvor: AI IQ World Bank',
        'Sve kupljeno, sve isporučeno, sve aktivno',
      ],
    },
  },
  {
    id: 'nabavka-statistika',
    tip: 'statistika',
    naslov: '📊 Statistika Nabavke',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Digitalnih varijacija', vrednost: stats.ukupnoStavki, ikona: '🛒' },
        { naziv: 'Ukupno potrošeno', vrednost: `$${stats.ukupnoPotroseno.toLocaleString()}`, ikona: '💵' },
        { naziv: 'Kupljeno', vrednost: stats.kupljeno, ikona: '✅' },
        { naziv: 'Kategorija', vrednost: stats.kategorija, ikona: '📂' },
        { naziv: 'Transakcija', vrednost: stats.transakcija, ikona: '🔄' },
        { naziv: 'Kritičnih stavki', vrednost: stats.kriticnih, ikona: '🔴' },
        { naziv: 'Visoko prioritetnih', vrednost: stats.visokih, ikona: '🟡' },
        { naziv: 'Banka izvor', vrednost: 'AI IQ World Bank', ikona: '🏦' },
      ],
    },
  },
  {
    id: 'nabavka-strateske-figure',
    tip: 'kartice',
    naslov: '♛ Strateško-Digitalne Figure',
    podnaslov: 'Šahovske figure pretvorene u digitalne module',
    ikona: '♛',
    redosled: 4,
    podaci: {
      kartice: getNabavkaPoKategoriji('stratesko-digitalno').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-gaming',
    tip: 'kartice',
    naslov: '🎮 Gaming Varijacije',
    podnaslov: 'Nove gaming platforme i moduli',
    ikona: '🎮',
    redosled: 5,
    podaci: {
      kartice: getNabavkaPoKategoriji('gaming').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-komunikacije',
    tip: 'kartice',
    naslov: '📡 Komunikacije',
    podnaslov: 'Digitalni kanali komunikacije',
    ikona: '📡',
    redosled: 6,
    podaci: {
      kartice: getNabavkaPoKategoriji('komunikacije').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-infrastruktura',
    tip: 'kartice',
    naslov: '☁️ Infrastruktura',
    podnaslov: 'Cloud, CDN, Edge i mrežna infrastruktura',
    ikona: '☁️',
    redosled: 7,
    podaci: {
      kartice: getNabavkaPoKategoriji('infrastruktura').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-edukacija',
    tip: 'kartice',
    naslov: '🎓 Edukacija',
    podnaslov: 'Akademija, mentorstvo i certifikacija',
    ikona: '🎓',
    redosled: 8,
    podaci: {
      kartice: getNabavkaPoKategoriji('edukacija').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-poslovanje',
    tip: 'kartice',
    naslov: '💼 Poslovanje',
    podnaslov: 'CRM, ERP, HR, tenderi i smart ugovori',
    ikona: '💼',
    redosled: 9,
    podaci: {
      kartice: getNabavkaPoKategoriji('poslovanje').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-bezbednost',
    tip: 'kartice',
    naslov: '🛡️ Bezbednost',
    podnaslov: 'Firewall, VPN, antivirus i forenzika',
    ikona: '🛡️',
    redosled: 10,
    podaci: {
      kartice: getNabavkaPoKategoriji('bezbednost').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-kreativno',
    tip: 'kartice',
    naslov: '🎨 Kreativno',
    podnaslov: 'Dizajn, video, muzika i 3D modeliranje',
    ikona: '🎨',
    redosled: 11,
    podaci: {
      kartice: getNabavkaPoKategoriji('kreativno').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-zdravstvo',
    tip: 'kartice',
    naslov: '🏥 Zdravstvo',
    podnaslov: 'Telemedicina, farmacija i fitnes',
    ikona: '🏥',
    redosled: 12,
    podaci: {
      kartice: getNabavkaPoKategoriji('zdravstvo').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-globalno',
    tip: 'kartice',
    naslov: '🌍 Globalno',
    podnaslov: 'Ambasade, prevođenje, turizam, pošta i berza',
    ikona: '🌍',
    redosled: 13,
    podaci: {
      kartice: getNabavkaPoKategoriji('globalno').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-nauka',
    tip: 'kartice',
    naslov: '🔬 Nauka',
    podnaslov: 'Laboratorija, observatorija, genom i kvantni simulator',
    ikona: '🔬',
    redosled: 14,
    podaci: {
      kartice: getNabavkaPoKategoriji('nauka').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-transport',
    tip: 'kartice',
    naslov: '🚚 Transport',
    podnaslov: 'Logistika i fleet management',
    ikona: '🚚',
    redosled: 15,
    podaci: {
      kartice: getNabavkaPoKategoriji('transport').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, `$${s.cenaUSD.toLocaleString()}`, s.status],
      })),
    },
  },
  {
    id: 'nabavka-tabela',
    tip: 'tabela',
    naslov: '📋 Kompletna Lista Nabavke',
    podnaslov: `Svih ${nabavkaStavke.length} stavki`,
    ikona: '📋',
    redosled: 16,
    podaci: {
      zaglavlja: ['Ikona', 'Naziv', 'Kategorija', 'Cena', 'Status', 'Prioritet'],
      redovi: nabavkaStavke.map((s) => [
        s.ikona,
        s.naziv,
        s.kategorija,
        `$${s.cenaUSD.toLocaleString()}`,
        s.status,
        s.prioritet,
      ]),
    },
  },
  {
    id: 'nabavka-finansije',
    tip: 'baner',
    naslov: '💰 Finansijski Pregled',
    podnaslov: `Ukupno potrošeno: $${stats.ukupnoPotroseno.toLocaleString()} USD iz AI IQ World Bank`,
    ikona: '🏦',
    redosled: 17,
    stil: 'gradijent',
    podaci: {
      opis:
        `Glavni Sistem Nabavke je potrošio $${stats.ukupnoPotroseno.toLocaleString()} USD sa AI IQ World Bank računa ` +
        `za kupovinu ${stats.ukupnoStavki} digitalnih varijacija u ${stats.kategorija} kategorija. ` +
        'Sve transakcije su izvršene, svi proizvodi su isporučeni i aktivni u Digitalnoj Industriji.',
      dugmad: [
        { tekst: 'Banka Pregled', href: '/banka' },
        { tekst: 'API Endpoint', href: '/api/glavni-sistem-nabavka', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'nabavka-cta',
    tip: 'cta',
    naslov: 'Glavni Endžin + Glavni Sistem = Kompletna Digitalna Industrija',
    redosled: 18,
    podaci: {
      opis: 'Sve je spojeno, sve je kupljeno, sve je aktivno. Digitalna Industrija radi punom parom.',
      dugmad: [
        { tekst: 'Glavni Endžin', href: '/glavni-endzin' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
