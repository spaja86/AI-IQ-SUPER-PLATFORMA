import type { Sekvenca } from '@/lib/types';
import {
  TOTAL_PAGES,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_IGRICA,
  TOTAL_DIAGNOSTIKA,
  OMEGA_AI_PERSONA_UKUPNO,
  OMEGA_AI_PERSONA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  AUTOFINISH_COUNT,
} from '@/lib/constants';
import { spajaGeneratorEngine } from '@/lib/spaja-generator-engine';

export const digitalnaPlatformaSekvence: Sekvenca[] = [
  {
    id: 'digitalna-platforma-hero',
    tip: 'hero',
    naslov: '🌐 SPAJA PLATFORMA',
    podnaslov: 'Digitalna platforma za lakšu komunikaciju i saradnju između svih aktera',
    ikona: '🌐',
    redosled: 1,
    podaci: {
      opis: 'SPAJA PLATFORMA je sveobuhvatna digitalna platforma koja povezuje klijente, preduzeća, kompanije, banke i druge korisnike kroz jedinstven ekosistem za komunikaciju, saradnju i igrice.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Prijavi se', href: '/login', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-platforma-generator-brouvzer',
    tip: 'baner',
    naslov: '🔧 SPAJA Generator za Endžine u Digitalnom Brouvzeru',
    redosled: 1.5,
    podaci: {
      bedz: '🔧 Generator → 🌐 Brouvzer',
      opis:
        `SPAJA Generator za Endžine (${spajaGeneratorEngine.link}) dejstvuje direktno na SPAJA PLATFORMU. ` +
        'Prevlačenjem Generator Endžina preko SPAJA Digitalnog Brouvzera nastaje EKSTREMNI DIGITALNI BROUZER koji: ' +
        'otvara SPAJA PLATFORMU u platformi više puta za ekstremnu saradnju, ' +
        'prati sve korisnike (klijente, preduzeća, kompanije, banke) u realnom vremenu, ' +
        'i omogućava deploy, import i export podataka između svih aktera.',
      dugme: { tekst: 'Digitalni Brouvzer', href: '/spaja-digitalni-brouvzer' },
    },
  },
  {
    id: 'digitalna-platforma-statistika',
    tip: 'statistika',
    naslov: '📊 Platforma u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno ruta', vrednost: String(TOTAL_ROUTES), ikona: '🛤️' },
        { naziv: 'API endpointa', vrednost: String(TOTAL_API_ROUTES), ikona: '⚡' },
        { naziv: 'Stranica', vrednost: String(TOTAL_PAGES), ikona: '📄' },
        { naziv: 'Igrica', vrednost: String(TOTAL_IGRICA), ikona: '🎮' },
        { naziv: 'Dijagnostika', vrednost: String(TOTAL_DIAGNOSTIKA), ikona: '🔍' },
        { naziv: 'AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'digitalna-platforma-moduli',
    tip: 'kartice',
    naslov: '🧩 Moduli platforme',
    podnaslov: 'Svaki modul je nezavisna celina u okviru ekosistema',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'OMEGA AI',
          opis: `${OMEGA_AI_PERSONA_COUNT} AI persona sa ukupno ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr')} instanci — vestacka inteligencija najviseg nivoa`,
          ikona: '🧠',
          oznake: ['AI', 'ML', 'NLP', 'Vision'],
        },
        {
          naslov: 'SpajaPro AI Chat',
          opis: `${SPAJA_PRO_VERZIJA_COUNT} verzija SpajaPro AI asistenta sa naprednim conversational AI mogucnostima`,
          ikona: '🤖',
          oznake: ['Chat', 'Prompt', 'Asistent'],
        },
        {
          naslov: 'Banka & Menjacnica',
          opis: 'Digitalni finansijski sistem sa bankarskim operacijama, menjacnicom valuta i kripto podrskom',
          ikona: '🏦',
          oznake: ['Finansije', 'Valute', 'Kripto'],
        },
        {
          naslov: 'Igrice',
          opis: `${TOTAL_IGRICA} igrica u okviru gaming platforme — od retro do modernih AI-powered igara`,
          ikona: '🎮',
          oznake: ['Gaming', 'Arcade', 'Retro'],
        },
        {
          naslov: 'Digitalni Kompjuter',
          opis: 'Virtuelni kompjuter u browseru sa kompletnim operativnim sistemom i alatima',
          ikona: '🖥️',
          oznake: ['OS', 'Konzola', 'Alati'],
        },
        {
          naslov: 'Digitalni Brouvzer',
          opis: 'Integrisani web browser sa naprednim modulima za navigaciju i pretrazivanje',
          ikona: '🌐',
          oznake: ['Browser', 'Navigacija', 'Moduli'],
        },
        {
          naslov: 'Proksi Infrastruktura',
          opis: 'Proksi mreza sa WiFi antenom, GitHub deploy sistemom i naprednim rutiranjem',
          ikona: '📡',
          oznake: ['Proksi', 'WiFi', 'Deploy'],
        },
        {
          naslov: 'Mobilna Mreza',
          opis: '4 centrale sa pozivnim brojevima, digitalna mobilna mreza buducnosti',
          ikona: '📱',
          oznake: ['Mreza', 'Telefonija', '5G'],
        },
        {
          naslov: 'Monitoring & Dijagnostika',
          opis: `${TOTAL_DIAGNOSTIKA} dijagnostickih provera — monitoring u realnom vremenu, live pracenje i AI analitika`,
          ikona: '🔍',
          oznake: ['Monitoring', 'Live', 'Analitika'],
        },
        {
          naslov: 'Digitalni Televizor',
          opis: 'IPTV sistem sa kanalima, programom i naprednim streaming mogucnostima',
          ikona: '📺',
          oznake: ['TV', 'Stream', 'Kanali'],
        },
      ],
    },
  },
  {
    id: 'digitalna-platforma-autofinish',
    tip: 'progres',
    naslov: '🔄 Autofinish sistem',
    podnaslov: 'Automatsko zavrsavanje i optimizacija platforme',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Zavrsenih autofinish zadataka', vrednost: AUTOFINISH_COUNT, ukupno: 500 },
      ],
    },
  },
  {
    id: 'digitalna-platforma-bezbednost',
    tip: 'lista',
    naslov: '🛡️ Bezbednost i autentifikacija',
    podnaslov: 'Zero Trust arhitektura sa viseslojnom zastitom',
    redosled: 5,
    podaci: {
      stavke: [
        { naslov: 'Zero Trust', opis: 'Svaki zahtev se verifikuje — nema implicitnog poverenja', ikona: '🔒' },
        { naslov: 'AES-256-GCM', opis: 'Enkriptovan identity vault sa vojnom enkripcijom', ikona: '🔐' },
        { naslov: 'PBKDF2-SHA512', opis: 'Hesiranje lozinki sa 310.000 iteracija', ikona: '🗝️' },
        { naslov: 'JWT Token Rotation', opis: 'Automatska rotacija tokena za maksimalnu bezbednost', ikona: '🔄' },
        { naslov: '2FA/TOTP', opis: 'Dvofaktorska autentifikacija za dodatnu zastitu', ikona: '📲' },
        { naslov: 'Brute Force zastita', opis: '5 pokusaja / 15 minuta po IP adresi', ikona: '🛡️' },
        { naslov: 'Audit Log', opis: 'Kriptografski lanac revizijskih dogadjaja (blockchain-style)', ikona: '📋' },
        { naslov: 'RBAC', opis: '6 nivoa dozvola od VISITOR do OMEGA_CORE', ikona: '👥' },
      ],
    },
  },
  {
    id: 'digitalna-platforma-tehnologije',
    tip: 'kartice',
    naslov: '⚙️ Tehnoloski stek',
    redosled: 6,
    podaci: {
      kartice: [
        { naslov: 'Next.js 16', opis: 'React framework za produkcione web aplikacije', ikona: '▲', oznake: ['Frontend', 'SSR'] },
        { naslov: 'React 19', opis: 'UI biblioteka za interaktivne korisnicke interfejse', ikona: '⚛️', oznake: ['UI', 'Komponente'] },
        { naslov: 'TypeScript 6', opis: 'Tipizirani JavaScript za robusniji kod', ikona: '📘', oznake: ['Tipovi', 'DX'] },
        { naslov: 'Tailwind CSS 4', opis: 'Utility-first CSS framework za brz razvoj', ikona: '🎨', oznake: ['Stilovi', 'Responsive'] },
        { naslov: 'Vercel', opis: 'Platforma za deploy i hosting sa globalnim CDN-om', ikona: '🚀', oznake: ['Deploy', 'CDN'] },
        { naslov: 'OpenAI SDK', opis: 'Integracija sa najnaprednijim AI modelima', ikona: '🤖', oznake: ['GPT', 'AI'] },
      ],
    },
  },
  {
    id: 'digitalna-platforma-saradnja',
    tip: 'kartice',
    naslov: '🤝 Ekstremna saradnja i igrice',
    podnaslov: 'Digitalna platforma u platformi — više paralelnih prostora za rad i zabavu',
    redosled: 7,
    podaci: {
      kartice: [
        {
          naslov: 'Klijenti',
          opis: 'Brza i transparentna komunikacija sa kompanijama i podrskom u realnom vremenu',
          ikona: '🧑‍💼',
          oznake: ['Podrska', 'Poruke', 'Saradnja'],
        },
        {
          naslov: 'Preduzeća i kompanije',
          opis: 'Zajednički digitalni prostori za koordinaciju timova, projekata i partnerstava',
          ikona: '🏢',
          oznake: ['Projekti', 'Timovi', 'Partnerstva'],
        },
        {
          naslov: 'Banke i finansijski sektor',
          opis: 'Sigurna razmena podataka, finansijska koordinacija i digitalni tokovi odobrenja',
          ikona: '🏦',
          oznake: ['Finansije', 'Sigurnost', 'Workflow'],
        },
        {
          naslov: 'Platforma u platformi',
          opis: 'Otvaranje više digitalnih prostora unutar platforme za paralelnu saradnju i igrice',
          ikona: '🧩',
          oznake: ['Multi-space', 'Kolaboracija', 'Gaming'],
        },
      ],
    },
  },
  {
    id: 'digitalna-platforma-cta',
    tip: 'cta',
    naslov: '🚀 Pridruzite se platformi',
    podnaslov: 'Kreirajte besplatan nalog i istražite ceo ekosistem',
    redosled: 8,
    podaci: {
      dugmad: [
        { tekst: 'Prijavi se', href: '/login' },
        { tekst: 'Registruj se besplatno', href: '/registracija', stil: 'sekundarno' },
      ],
    },
  },
];
