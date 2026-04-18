import type { Sekvenca } from '@/lib/types';
import {
  glavniEndzinDigitalneIndustrije,
  getGlavniEndzinStatistika,
  getSklopljenePoTipu,
} from '@/lib/glavni-endzin-digitalne-industrije';
import { OMEGA_AI_PERSONA_UKUPNO, SPAJA_PRO_RANGE } from '@/lib/constants';

const stats = getGlavniEndzinStatistika();
const platformeSklopljene = getSklopljenePoTipu('platforma');
const igriceSklopljene = getSklopljenePoTipu('igrica');
const proizvodiSklopljeni = getSklopljenePoTipu('it-proizvod');

export const glavniEndzinSekvence: Sekvenca[] = [
  {
    id: 'glavni-endzin-hero',
    tip: 'hero',
    naslov: '🏭⚙️ Glavni Endžin Digitalne Industrije',
    podnaslov: `SVE endžine spojene u jedan — ${stats.ukupnoSpojenih} endžina, ${stats.ukupnoPlatformiPokrenutih + stats.ukupnoIgricaPokrenutih + stats.ukupnoProizvodaSklopljenih} sklopljenih proizvoda`,
    ikona: '🏭',
    redosled: 1,
    podaci: {
      opis: glavniEndzinDigitalneIndustrije.opis,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'glavni-endzin-tekst',
    tip: 'tekst',
    naslov: 'Zašto Glavni Endžin?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Do sada nismo spajali sve ENDŽINE u jedan veliki ENDŽIN. Sada je to rešeno. ' +
        'Glavni Endžin Digitalne Industrije spaja SVE — od SpajaPro Core do OMEGA AI Dispatch, ' +
        'od Gaming Dimenzionalnog Endžina do Proksi Signal Engine-a, od repo-specifičnih endžina ' +
        'do Backend Infrastrukturnih endžina. Automatski sklapa gotove proizvode i igrice, ' +
        'unapređuje sve platforme i sva poslovanja, i neprekidno evolvira.',
      istaknuteStavke: [
        `${stats.ukupnoSpojenih} endžina spojeno u JEDAN VELIKI ENDŽIN`,
        `${platformeSklopljene.length} platformi automatski sklopljeno`,
        `${igriceSklopljene.length} igrica automatski sklopljeno`,
        `${proizvodiSklopljeni.length} IT proizvoda automatski sklopljeno`,
        `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona koordinisano`,
        `SpajaPro v${SPAJA_PRO_RANGE} — svih 10 endžina integrisano`,
        'Kompletnost sistema: 100% — SVE je izniklo',
        'Neprekidna evolucija — nikad ne staje',
      ],
    },
  },
  {
    id: 'glavni-endzin-statistika',
    tip: 'statistika',
    naslov: '📊 Glavni Endžin u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Spojenih endžina', vrednost: stats.ukupnoSpojenih, ikona: '⚙️' },
        { naziv: 'Aktivnih', vrednost: stats.aktivnihEndžina, ikona: '✅' },
        { naziv: 'Optimizacija', vrednost: `${stats.prosecnaOptimizacija}%`, ikona: '🎯' },
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformiPokrenutih, ikona: '🌐' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgricaPokrenutih, ikona: '🎮' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvodaSklopljenih, ikona: '📦' },
        { naziv: 'Evolucija', vrednost: stats.evolucijaCiklusa, ikona: '🔄' },
        { naziv: 'Kompletnost', vrednost: `${stats.kompletnostSistema}%`, ikona: '💯' },
      ],
    },
  },
  {
    id: 'glavni-endzin-progres',
    tip: 'progres',
    naslov: '💯 Kompletnost sistema',
    redosled: 4,
    podaci: {
      progres: stats.kompletnostSistema,
      poruka: `Glavni Endžin Digitalne Industrije — ${stats.ukupnoSpojenih} endžina spojeno, sve platforme i proizvodi sklopljeni, kompletnost: ${stats.kompletnostSistema}%`,
    },
  },
  {
    id: 'glavni-endzin-tabela-tipovi',
    tip: 'tabela',
    naslov: '⚙️ Endžini po tipu',
    podnaslov: `${stats.ukupnoSpojenih} spojenih endžina u Glavnom Endžinu`,
    redosled: 5,
    podaci: {
      zaglavlje: ['Tip endžina', 'Broj', 'Status'],
      redovi: [
        ['🌟 Core', String(stats.coreEndžina), '✅ Svi spojeni'],
        ['🧠 AI', String(stats.aiEndžina), '✅ Svi spojeni'],
        ['🎮 Gaming', String(stats.gamingEndžina), '✅ Svi spojeni'],
        ['📡 Mreža', String(stats.mrezaEndžina), '✅ Svi spojeni'],
        ['💰 Finansije', String(stats.finansijeEndžina), '✅ Svi spojeni'],
        ['🚀 Deploy', String(stats.deployEndžina), '✅ Svi spojeni'],
        ['🔒 Bezbednost', String(stats.bezbednostEndžina), '✅ Svi spojeni'],
        ['📧 Komunikacija', String(stats.komunikacijaEndžina), '✅ Svi spojeni'],
        ['📦 Repo Engine', String(stats.repoEndžina), '✅ Svi spojeni'],
      ],
    },
  },
  {
    id: 'glavni-endzin-tabela-sklapanje',
    tip: 'tabela',
    naslov: '🔧 Automatsko sklapanje',
    podnaslov: 'Gotovi proizvodi automatski sklopljeni od Glavnog Endžina',
    redosled: 6,
    podaci: {
      zaglavlje: ['Tip', 'Sklopljeno', 'Status', 'Kompletnost'],
      redovi: [
        ['🌐 Platforme', String(platformeSklopljene.length), '✅ Sve sklopljene', '100%'],
        ['🎮 Igrice', String(igriceSklopljene.length), '✅ Sve sklopljene', '100%'],
        ['📦 IT Proizvodi', String(proizvodiSklopljeni.length), '✅ Svi sklopljeni', '100%'],
        ['Σ UKUPNO', String(platformeSklopljene.length + igriceSklopljene.length + proizvodiSklopljeni.length), '✅ SVE SKLOPLJENO', '100%'],
      ],
    },
  },
  {
    id: 'glavni-endzin-evolucija',
    tip: 'kartice',
    naslov: '🔄 Evolucioni ciklusi',
    podnaslov: `${glavniEndzinDigitalneIndustrije.evolucija.length} ciklusa — neprekidna evolucija`,
    redosled: 7,
    podaci: {
      kartice: glavniEndzinDigitalneIndustrije.evolucija.map((c) => ({
        naslov: c.naziv,
        opis: c.opis,
        ikona: c.faza === 'zavrsena' ? '✅' : c.faza === 'aktivna' ? '🔄' : '📋',
        oznake: [c.faza, `${c.napredak}%`],
      })),
    },
  },
  {
    id: 'glavni-endzin-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Glavnog Endžina',
    redosled: 8,
    podaci: {
      nivoi: [
        {
          naziv: 'Glavni Endžin Digitalne Industrije',
          ikona: '🏭⚙️',
          deca: [
            'SPAJA Generator za Endžine',
            'SpajaPro Multifunkcionalni Endžin',
            'SPAJA Univerzalni Endžin za Igrice',
            'OMEGA AI Dispatch Engine',
          ],
        },
        {
          naziv: 'SPAJA Generator za Endžine',
          ikona: '🔧',
          deca: [
            `Core endžini (${stats.coreEndžina})`,
            `AI endžini (${stats.aiEndžina})`,
            `Mreža endžini (${stats.mrezaEndžina})`,
            `Deploy endžini (${stats.deployEndžina})`,
            `Finansije endžini (${stats.finansijeEndžina})`,
            `Bezbednost endžini (${stats.bezbednostEndžina})`,
            `Repo endžini (${stats.repoEndžina})`,
          ],
        },
        {
          naziv: 'Automatsko sklapanje',
          ikona: '🔧',
          deca: [
            `Platforme (${platformeSklopljene.length})`,
            `Igrice (${igriceSklopljene.length})`,
            `IT Proizvodi (${proizvodiSklopljeni.length})`,
          ],
        },
        {
          naziv: 'Neprekidna evolucija',
          ikona: '🔄',
          deca: glavniEndzinDigitalneIndustrije.evolucija.map((c) => `${c.naziv} — ${c.napredak}%`),
        },
      ],
    },
  },
  {
    id: 'glavni-endzin-mogucnosti',
    tip: 'lista',
    naslov: '🚀 Mogućnosti Glavnog Endžina',
    redosled: 9,
    podaci: {
      stavke: glavniEndzinDigitalneIndustrije.mogucnosti,
    },
  },
  {
    id: 'glavni-endzin-baner',
    tip: 'baner',
    naslov: '💯 SVE je spojeno — SVE je sklopljeno — SVE je na 100%',
    redosled: 10,
    podaci: {
      poruka: `Glavni Endžin Digitalne Industrije — ${stats.ukupnoSpojenih} endžina spojeno u JEDAN, ` +
        `${platformeSklopljene.length + igriceSklopljene.length + proizvodiSklopljeni.length} proizvoda automatski sklopljeno. ` +
        'Neprekidna evolucija aktivna.',
      stil: 'info',
    },
  },
  {
    id: 'glavni-endzin-cta',
    tip: 'cta',
    naslov: '🏭 Istraži Glavni Endžin',
    redosled: 11,
    podaci: {
      opis: `Glavni Endžin Digitalne Industrije pokreće SVE — ${stats.ukupnoSpojenih} endžina, ` +
        `${platformeSklopljene.length + igriceSklopljene.length + proizvodiSklopljeni.length} sklopljenih proizvoda, neprekidna evolucija.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine', stil: 'sekundarno' },
        { tekst: 'Gaming', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
];
