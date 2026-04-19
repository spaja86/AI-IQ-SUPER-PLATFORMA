import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';
import { sajtovi, getSajtoviPoKategoriji } from '@/lib/sajtovi';
import { generisaniEngini, getRepoEngini, getProsecnaOptimizacija } from '@/lib/spaja-generator-engine';
import { OMEGA_AI_PERSONA_UKUPNO, SPAJA_PRO_RANGE } from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { getGlavniEndzinStatistika } from '@/lib/glavni-endzin-digitalne-industrije';
import { igrice, getSveKategorijeIgrica } from '@/lib/igrice';
import { IOOPENUIAO_URL } from '@/lib/io-openui-ao-gaming-platforma';

const stats = getStatistike();
const geStats = getGlavniEndzinStatistika();
const kategorijeIgrica = getSveKategorijeIgrica();

export const industrijaSekvence: Sekvenca[] = [
  {
    id: 'industrija-hero',
    tip: 'hero',
    naslov: '🏭 ŽIVA FUNKCIONALNA Digitalna Industrija',
    podnaslov: 'AI IQ SUPER PLATFORMA — Sve je AKTIVNO, sve PROIZVODI',
    ikona: '🏭',
    redosled: 1,
    podaci: { opis: `Kompanija SPAJA kao ŽIVA FUNKCIONALNA digitalna industrija — sve platforme, kompanije, organizacije i proizvodi su AKTIVNI. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona rade non-stop. Promptovi svuda, AI svuda, produkcija svuda.` },
  },
  {
    id: 'industrija-vizuelni-prikaz',
    tip: 'slika',
    naslov: '🖼️ Digitalna Industrija — Vizuelni Prikaz',
    podnaslov: 'AI tehnologija, automatizacija i digitalna transformacija',
    redosled: 2,
    podaci: {
      opis: 'Vizuelni prikaz Digitalne Industrije — AI roboti, automatizovani sistemi i digitalna transformacija u akciji.',
      slike: [
        {
          url: 'https://github.com/user-attachments/assets/49fe809a-344d-4750-b31d-2ceae6195c59',
          alt: 'AI Robot sa hologramskim ekranom — Digitalna Industrija',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/8f1031e6-caa3-4fd1-b67b-9ff6073308ab',
          alt: 'Digitalna Industrija — AI tehnologija i automatizacija',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/45775123-3213-4abc-8988-3384b13028ff',
          alt: 'Digitalna Industrija — Vizija budućnosti',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/d62401fd-908d-4095-94a6-9d5bb17186b4',
          alt: 'Digitalna Industrija — AI upravljanje sistemima',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/103d2f5f-090e-42d5-b88f-9da81484b203',
          alt: 'Digitalna Industrija — Automatizovana produkcija',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/f4d02635-5947-4967-9e32-e7f4e424c0ea',
          alt: 'Digitalna Industrija — Napredna AI infrastruktura',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/e004f6c7-4166-4e6f-9b5a-581c4be366a1',
          alt: 'Digitalna Industrija — Digitalna transformacija',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/5b516e14-1518-42df-852c-736683eb33ab',
          alt: 'Digitalna Industrija — AI kreativni likovi',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/2e0c6266-f12a-45ba-8e05-3c9fa7250325',
          alt: 'Digitalna Industrija — Animirani AI svet',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/ebd6bebe-39fc-49ea-a7ac-0ce096bacee0',
          alt: 'Digitalna Industrija — AI generisani karakteri',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/99581c24-eca2-48c9-ad07-0eaa4509a0f0',
          alt: 'Digitalna Industrija — AI vizuelna produkcija',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/3f2ed236-4081-4d1f-b443-572ad4b7c4fd',
          alt: 'Digitalna Industrija — AI noir detektiv',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/be8540ce-d22d-434c-9a53-76adb69d0093',
          alt: 'Digitalna Industrija — Futuristicki AI agent',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/cbf82915-1916-452b-a410-91b0874565e0',
          alt: 'Digitalna Industrija — AI robotski ratnik',
          sirina: 600,
          visina: 900,
        },
        {
          url: 'https://github.com/user-attachments/assets/cb629cfd-98a7-4208-8781-9d02c7d2c3fd',
          alt: 'Digitalna Industrija — Cyberpunk AI vizija',
          sirina: 600,
          visina: 900,
        },
      ],
      raspored: 'galerija',
    },
  },
  {
    id: 'industrija-tekst',
    tip: 'tekst',
    naslov: 'ŽIVA FUNKCIONALNA Digitalna Industrija',
    redosled: 3,
    podaci: {
      sadrzaj: `Digitalna Industrija je ŽIVA FUNKCIONALNA korporacija gde kompanija SPAJA funkcioniše kao industrijski kompleks u digitalnom svetu. Svaka platforma je aktivna fabrika, svaki IT proizvod je funkcionalan alat, a ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE')} OMEGA AI persona su radnici koji automatizuju sve procese. PROMPTOVI su svuda — u svakoj platformi, svakom proizvodu, svakom agentu.`,
      istaknuteStavke: [
        'SVE platforme su AKTIVNE digitalne fabrike',
        'SVE kompanije su AKTIVNE i proizvode',
        'SVE organizacije su AKTIVNE i funkcionišu',
        'SVI IT Proizvodi su AKTIVNI specijalizovani alati',
        `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE')} OMEGA AI persona rade non-stop`,
        'PROMPTOVI su integrisani svuda u ekosistemu',
        'Ekosistem je ŽIVO FUNKCIONALAN — sve je u produkciji',
      ],
    },
  },
  {
    id: 'industrija-statistika',
    tip: 'statistika',
    naslov: '📊 ŽIVA Industrija u brojevima',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'OMEGA AI', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE'), ikona: '🧠' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
        { naziv: 'Engine-i', vrednost: stats.generatorEngina, ikona: '🔧' },
        { naziv: 'Repo Engine-i', vrednost: stats.generatorRepoEngina, ikona: '📦' },
        { naziv: 'Gen. Optimiz.', vrednost: `${stats.generatorOptimizacija}%`, ikona: '⚙️' },
        { naziv: 'Promptovi', vrednost: stats.ukupnoPromptova, ikona: '💬' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
      ],
    },
  },
  {
    id: 'industrija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Struktura industrije',
    redosled: 5,
    podaci: {
      nivoi: [
        { naziv: 'Digitalna Industrija', ikona: '🏭', deca: ['Kompanija SPAJA'] },
        { naziv: 'Kompanija SPAJA', ikona: '🏢', deca: [`Platforme (${stats.ukupnoPlatformi})`, `IT Proizvodi (${stats.ukupnoProizvoda})`, `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE')} OMEGA AI Persona`, 'OpenAI Platforma (Sopstvena)', 'Proksi Mreža', 'SPAJA Mobilna Mreža', 'SPAJA Generator za Endžine', `Glavni Endžin (${geStats.ukupnoSpojenih} endžina spojeno)`, `Promptovi (${stats.ukupnoPromptova})`, `Igrice (${stats.ukupnoIgrica})`] },
        { naziv: 'Platforme', ikona: '🌐', deca: ['Jezgro', 'Finansije', 'Globalno', 'AI', 'Alati'] },
        { naziv: 'Proksi Mreža', ikona: '📡', deca: ['Hipsoneurični Signal', 'Ekscentrični Modulator', 'Ekliptična Vez', 'Rezonantni Pojačavač'] },
        { naziv: 'SPAJA Mobilna Mreža', ikona: '📱', deca: ['+38177 Primarna', '+38188 Sekundarna', '+38178 Redundantna', '+38187 Globalna'] },
      ],
    },
  },
  {
    id: 'industrija-tabela',
    tip: 'tabela',
    naslov: '📋 Klasifikacija entiteta',
    redosled: 6,
    podaci: {
      zaglavlje: ['Entitet', 'Tip', 'Broj', 'Status'],
      redovi: [
        ['Platforme', 'AKTIVNE digitalne fabrike', String(stats.ukupnoPlatformi), '✅ SVE AKTIVNE'],
        ['IT Proizvodi', 'AKTIVNI alati i servisi', String(stats.ukupnoProizvoda), '✅ SVE AKTIVNO'],
        ['Digitalni Hardver', 'GPU/RAM/Kompjuter/Brauzer', '6 proizvoda', '✅ ZAKUP AKTIVAN'],
        ['OMEGA AI', 'AI persona — 40M persona', OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE'), '✅ AKTIVNI'],
        ['Promptovi', 'Univerzalni Prompt sistem', String(stats.ukupnoPromptova), '✅ SVI AKTIVNI'],
        ['Igrice', 'Dimenzionalne igrice', String(stats.ukupnoIgrica), '✅ SVE AKTIVNE'],
        ['Proksi Mreža', 'Signal infrastruktura', '6 signala / 5 čvorova', '✅ AKTIVNA'],
        ['SPAJA Mobilna', 'Mobilna mreža', '4 centrale / 5 servisa', '✅ AKTIVNA'],
        ['SPAJA Generator', 'Engine generator', `${generisaniEngini.length} engine-a / ${getRepoEngini().length} repo`, `✅ ${getProsecnaOptimizacija()}% opt.`],
        ['Organizacije', 'AKTIVNE strukture', String(stats.ukupnoOrganizacija), '✅ SVE AKTIVNE'],
        ['Kompanije', 'AKTIVNE kompanije', String(stats.ukupnoKompanija), '✅ SVE AKTIVNE'],
        ['GitHub Repozitorijumi', 'Izvorni kod ekosistema', '14 repo', '✅ SVI AKTIVNI'],
        ['OpenAI Platforma', 'SOPSTVENA platforma — NIJE partner', '1 platforma', '✅ AKTIVNA — Non-stop evolucija'],
      ],
    },
  },
  {
    id: 'industrija-platforme',
    tip: 'kartice',
    naslov: '🌐 Platforme Digitalne Industrije',
    podnaslov: `${platforme.length} AKTIVNIH platformi — svi linkovi vode na standardne domene`,
    redosled: 7,
    podaci: {
      kartice: platforme.map((p) => ({
        naslov: p.naziv,
        opis: p.opis.length > 120 ? p.opis.slice(0, 120) + '...' : p.opis,
        ikona: p.ikona,
        eksterniLink: `https://${p.deploy.domen}`,
        oznake: [p.kategorija, p.deploy.status, p.deploy.domen],
      })),
    },
  },
  {
    id: 'industrija-sajtovi-ekosistem',
    tip: 'kartice',
    naslov: '🌐 Repozitorijumi Ekosistema',
    podnaslov: 'GitHub repozitorijumi Digitalne Industrije — svi linkovi aktivni',
    redosled: 8,
    podaci: {
      kartice: getSajtoviPoKategoriji('ekosistem').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        href: s.url,
        oznake: ['GitHub Repo'],
      })),
    },
  },
  {
    id: 'industrija-digitalni-hardver',
    tip: 'kartice',
    naslov: '🖥️ Digitalni Hardver — Zakup kao Usluga',
    podnaslov: 'Digitalni kompjuteri, GPU, RAM, brauzeri — nedeljni, mesečni, godišnji zakup',
    redosled: 9,
    podaci: {
      kartice: [
        {
          naslov: '🖥️ Digitalni Kompjuter',
          opis: 'Kompletni digitalni kompjuter: GPU 8.700.000, RAM 276.000 GB, matična ploča. Zakup: nedeljno/mesečno/godišnje.',
          ikona: '🖥️',
          oznake: ['GPU 8.700.000', 'RAM 276.000 GB', 'Zakup'],
        },
        {
          naslov: '🎮 Digitalni GPU 8.700.000',
          opis: 'Ekstremni GPU sa 8.700.000 jezgara za AI, igrice, rendering. Zakup kao usluga.',
          ikona: '🎮',
          oznake: ['8.700.000 jezgara', 'AI/ML', 'Gaming'],
        },
        {
          naslov: '💾 Digitalni RAM 276.000 GB',
          opis: 'Ultra-brza RAM memorija 276.000 GB za masovne operacije.',
          ikona: '💾',
          oznake: ['276.000 GB', 'DDR6', 'HBM3'],
        },
        {
          naslov: '🎨 Digitalna Grafička Kartica',
          opis: 'Eksterna digitalna grafička kartica za rendering i AI upscaling.',
          ikona: '🎨',
          oznake: ['Ray Tracing', '8K', 'Zakup'],
        },
        {
          naslov: '🔌 Digitalna Matična Ploča',
          opis: 'Eksterna digitalna matična ploča — povezuje sve komponente.',
          ikona: '🔌',
          oznake: ['PCIe 6.0', 'Thunderbolt 5'],
        },
        {
          naslov: '🌐 Digitalni Brauzer',
          opis: 'SPAJA cloud brauzer za bezbedan pristup. Igrice, SpajaPro Prompt, VPN.',
          ikona: '🌐',
          oznake: ['Cloud', 'VPN', 'SpajaPro'],
        },
      ],
    },
  },
  {
    id: 'industrija-igrice',
    tip: 'kartice',
    naslov: '🎮 Igrice Digitalne Industrije',
    podnaslov: `${igrice.length} igrica u ${kategorijeIgrica.length} kategorija — sve se otvaraju i startupuju sa Digitalne Industrije`,
    redosled: 10,
    podaci: {
      kartice: igrice.map((i) => ({
        naslov: `${i.ikona} ${i.naziv}`,
        opis: i.opis.length > 120 ? i.opis.slice(0, 120) + '...' : i.opis,
        ikona: i.ikona,
        eksterniLink: i.link ?? IOOPENUIAO_URL,
        oznake: [i.kategorija, i.status, `D: ${i.podrazumevanaDimenzija}`],
      })),
    },
  },
  {
    id: 'industrija-openai-platforma',
    tip: 'kartice',
    naslov: '🤖 OpenAI Platforma — Sopstvena Platforma Digitalne Industrije',
    podnaslov: 'OpenAI NIJE partner — to je interna platforma Kompanije SPAJA koja non-stop evolvira unutar Digitalne Industrije',
    redosled: 11,
    podaci: {
      kartice: [
        {
          naslov: '🤖 OpenAI Platforma',
          opis: `SOPSTVENA platforma Digitalne Industrije. OpenAI API integrisan preko spaja86/openai-platform repo. SpajaPro v${SPAJA_PRO_RANGE} engine. Non-stop evolucija.`,
          ikona: '🤖',
          href: 'https://github.com/spaja86/openai-platform',
          oznake: ['Digitalna Industrija', 'Sopstvena Platforma', 'OpenAI API', `SpajaPro v${SPAJA_PRO_RANGE}`],
        },
        {
          naslov: '🔗 API Integracija',
          opis: 'OpenAI API ključ u spaja86/openai-platform repozitorijumu. Povezan sa celim ekosistemom za kontinuiranu evoluciju svih platformi.',
          ikona: '🔗',
          oznake: ['API', 'Evolucija', 'Ekosistem'],
        },
        {
          naslov: '🧠 OMEGA AI + OpenAI',
          opis: `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE')} OMEGA AI persona koriste OpenAI API za napredne AI operacije. SpajaPro Prompt sistem umesto ChatGPT-a.`,
          ikona: '🧠',
          oznake: ['OMEGA AI', '40M persona', 'SpajaPro'],
        },
        {
          naslov: '💰 Planovi i Cene',
          opis: 'Starter $29/mes, Profesionalni $79/mes, Biznis $199/mes, Enterprise $499/mes, Unlimited VIP $999/mes.',
          ikona: '💰',
          oznake: ['Starter $29', 'Pro $79', 'Biznis $199', 'Enterprise $499', 'VIP $999'],
        },
      ],
    },
  },
  {
    id: 'industrija-sajtovi-partneri',
    tip: 'kartice',
    naslov: '🤝 Tehnološki Partneri',
    podnaslov: 'Platforme i partneri koji podržavaju Digitalnu Industriju (OpenAI NIJE partner — to je sopstvena platforma)',
    redosled: 12,
    podaci: {
      kartice: getSajtoviPoKategoriji('tehnoloski-partner').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        href: s.url,
        oznake: ['Partner'],
      })),
    },
  },
  {
    id: 'industrija-najbolji-plan',
    tip: 'kartice',
    naslov: '👑 Najbolji Plan — SpajaPro Unlimited VIP',
    podnaslov: 'SpajaPro Unlimited VIP plan dostupan na svim delovima Digitalne Industrije i svim platformama',
    redosled: 13,
    podaci: {
      kartice: [
        {
          naslov: '👑 SpajaPro Unlimited VIP',
          opis: `Ultimativni plan — svi SpajaPro v${SPAJA_PRO_RANGE} endžini, beskonačne sesije, SPAJA BAZA, 50 paralelnih sesija, VIP podrška, pristup budućim verzijama. $999/mes ili $9.990/god.`,
          ikona: '👑',
          oznake: ['$999/mes', `v${SPAJA_PRO_RANGE}`, '∞ upiti', 'VIP'],
        },
        {
          naslov: '🏛️ SpajaPro Enterprise',
          opis: `Enterprise plan — svi v${SPAJA_PRO_RANGE} endžini, beskonačne sesije, dedicirani resursi, neograničeni upiti. $499/mes ili $4.990/god.`,
          ikona: '🏛️',
          oznake: ['$499/mes', `v${SPAJA_PRO_RANGE}`, '∞ upiti'],
        },
        {
          naslov: '🏢 SpajaPro Biznis',
          opis: `Poslovni plan — svi v${SPAJA_PRO_RANGE} endžini, SPAJA BAZA pristup, multifunkcionalni rad. $199/mes ili $1.990/god.`,
          ikona: '🏢',
          oznake: ['$199/mes', `v${SPAJA_PRO_RANGE}`, '2000 upita/dan'],
        },
        {
          naslov: '💼 SpajaPro Profesionalni',
          opis: 'Plan za profesionalce — v6-11 endžini, Google pretraga, slike. $79/mes ili $790/god.',
          ikona: '💼',
          oznake: ['$79/mes', 'v6-11', '500 upita/dan'],
        },
        {
          naslov: '🌱 SpajaPro Starter',
          opis: 'Početni plan — v6-8 endžini za upoznavanje sa SpajaPro sistemom. $29/mes ili $290/god.',
          ikona: '🌱',
          oznake: ['$29/mes', 'v6-8', '100 upita/dan'],
        },
      ],
    },
  },
  {
    id: 'industrija-sajtovi-drustvene',
    tip: 'kartice',
    naslov: '📱 Društvene Mreže',
    podnaslov: 'Pratite Digitalnu Industriju na društvenim mrežama',
    redosled: 14,
    podaci: {
      kartice: getSajtoviPoKategoriji('drustvena-mreza').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        href: s.url,
        oznake: ['Društvena mreža'],
      })),
    },
  },
  {
    id: 'industrija-sajtovi-statistika',
    tip: 'statistika',
    naslov: '🔗 Povezani Sajtovi i Repozitorijumi',
    redosled: 15,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Sajtova', vrednost: sajtovi.length, ikona: '🌐' },
        { naziv: 'Ekosistem Repo', vrednost: getSajtoviPoKategoriji('ekosistem').length, ikona: '🏭' },
        { naziv: 'Partneri', vrednost: getSajtoviPoKategoriji('tehnoloski-partner').length, ikona: '🤝' },
        { naziv: 'OpenAI Platforma', vrednost: 1, ikona: '🤖' },
        { naziv: 'Društvene Mreže', vrednost: getSajtoviPoKategoriji('drustvena-mreza').length, ikona: '📱' },
      ],
    },
  },
  {
    id: 'industrija-cta',
    tip: 'cta',
    naslov: '🚀 Istrazi ekosistem',
    redosled: 16,
    podaci: {
      opis: `ŽIVA FUNKCIONALNA Digitalna Industrija Kompanije SPAJA — SVE je AKTIVNO, SVE proizvodi. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('de-DE')} OMEGA AI persona. Glavni Endžin spaja ${geStats.ukupnoSpojenih} endžina i automatski sklapa gotove proizvode. Promptovi svuda.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Glavni Endžin', href: '/glavni-endzin', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Mobilna', href: '/mobilna-mreza', stil: 'sekundarno' },
        { tekst: 'Generator', href: '/spaja-generator-engine', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'industrija-cta-registracija',
    tip: 'cta',
    naslov: '🚀 Zapocnite sa Digitalnom Industrijom',
    podnaslov: 'Registrujte se i pristupite SpajaPro AI — realnom AI asistentu',
    ikona: '🚀',
    redosled: 17,
    podaci: {
      opis: 'Kreirajte besplatan nalog i isprobajte SpajaPro AI chatbot. Nadogradite plan za vise mogucnosti.',
      dugmad: [
        { tekst: 'Registruj se besplatno', href: '/registracija' },
        { tekst: 'Pogledaj planove', href: '/pricing', stil: 'sekundarno' },
        { tekst: 'SpajaPro AI Chat', href: '/spaja-pro', stil: 'sekundarno' },
      ],
    },
  },
];
