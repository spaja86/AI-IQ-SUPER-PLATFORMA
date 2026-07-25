import type { Sekvenca } from '@/lib/types';
import { spajaProVerzije, getAktivneVerzije, getUkupnoMogucnosti } from '@/lib/spaja-pro';
import { omegaPersone, getBrojPoOktavi } from '@/lib/omega-ai';
import { proksiSignali, proksiCvorovi, getAktivniSignali, getBrojPovezanihPlatformi } from '@/lib/proksi';
import { mobilneCentrale, mobilniServisi, mobilniSignali, mreza1873G, getAktivneCentrale, getAktivniMobilniSignali } from '@/lib/mobilna-mreza';
import { runDiagnostics } from '@/lib/auto-repair';
import { podrazumevanaKonfiguracija } from '@/lib/evolucija/engine';
import { OMEGA_AI_PERSONA_COUNT, SPAJA_PRO_RANGE } from '@/lib/constants';

const aktivneVerzije = getAktivneVerzije();
const ukupnoMogucnosti = getUkupnoMogucnosti();
const brojPoOktavi = getBrojPoOktavi();
const ukupnoOktava = Object.keys(brojPoOktavi).length;
const aktivniSignali = getAktivniSignali();
const povezanihPlatformi = getBrojPovezanihPlatformi();
const aktivneCentrale = getAktivneCentrale();
const aktivniMobilniSignali = getAktivniMobilniSignali();
const dijagnostika = runDiagnostics();
const evolKonfig = podrazumevanaKonfiguracija;

export const mozeSveSekvence: Sekvenca[] = [
  {
    id: 'moze-sve-hero',
    tip: 'hero',
    naslov: '⚡ MOŽE SVE — SPAJA Super Hub',
    podnaslov: `Sve u jednom: SpajaPro ${SPAJA_PRO_RANGE} · ${OMEGA_AI_PERSONA_COUNT} OMEGA AI Persona · Proksi · 1873G Mobilna · Auto-Popravka · Autonomna Evolucija`,
    ikona: '⚡',
    redosled: 1,
    podaci: {
      opis: 'Jedinstveni hub koji agregira svih 6 core modula AI IQ SUPER PLATFORME Kompanije SPAJA. SpajaPro engine pokreće OMEGA AI, OMEGA AI vodi Evoluciju, Proksi napaja Mobilnu mrežu, a Auto-Popravka čuva sve sisteme.',
      dugmad: [
        { tekst: 'SpajaPro', href: '/spaja-pro' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Mobilna', href: '/mobilna-mreza', stil: 'sekundarno' },
        { tekst: 'Auto-Popravka', href: '/auto-popravka', stil: 'sekundarno' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'moze-sve-statistika',
    tip: 'statistika',
    naslov: '📊 Status svih modula — uživo',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'SpajaPro verzije', vrednost: spajaProVerzije.length, ikona: '🌟' },
        { naziv: 'OMEGA AI Persone', vrednost: OMEGA_AI_PERSONA_COUNT, ikona: '🧠' },
        { naziv: 'Proksi signali', vrednost: proksiSignali.length, ikona: '📡' },
        { naziv: 'Mobilne centrale', vrednost: mobilneCentrale.length, ikona: '📱' },
        { naziv: 'Zdravlje sistema', vrednost: dijagnostika.zdravlje, ikona: '🔧' },
        { naziv: 'Max issue/dan', vrednost: evolKonfig.maxIssuePoDanu, ikona: '🧬' },
      ],
    },
  },
  {
    id: 'moze-sve-kartice',
    tip: 'kartice',
    naslov: '🧩 6 Core Modula SPAJA Platforme',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: '🌟 SpajaPro Engine',
          opis: `AI engine koji zamenjuje ChatGPT. ${spajaProVerzije.length} verzija (${SPAJA_PRO_RANGE}), ${aktivneVerzije.length} aktivnih, ${ukupnoMogucnosti} mogućnosti.`,
          ikona: '🌟',
          oznake: [`${spajaProVerzije.length} verzija`, `${aktivneVerzije.length} aktivnih`, `${ukupnoMogucnosti} mogućnosti`, 'Zamena za ChatGPT'],
          href: '/spaja-pro',
        },
        {
          naslov: '🧠 OMEGA AI',
          opis: `${OMEGA_AI_PERSONA_COUNT} specijalizovanih AI persona u ${ukupnoOktava} oktavnih nivoa. Matrično jezgro, neurološka mreža i oktavni dispatch.`,
          ikona: '🧠',
          oznake: [`${OMEGA_AI_PERSONA_COUNT} persona`, `${ukupnoOktava} oktava`, 'Matrično jezgro', 'Neurološka mreža'],
          href: '/omega-ai',
        },
        {
          naslov: '📡 Proksi',
          opis: `Hipsoneurični signal sloj. ${proksiSignali.length} signala, ${proksiCvorovi.length} čvorova, ${aktivniSignali.length} aktivnih, ${povezanihPlatformi} platformi.`,
          ikona: '📡',
          oznake: [`${proksiSignali.length} signala`, `${proksiCvorovi.length} čvorova`, `${aktivniSignali.length} aktivnih`, '10²²⁸ TB'],
          href: '/proksi',
        },
        {
          naslov: '📱 Mobilna 1873G',
          opis: `SPAJA Mobilna Mreža — ${mreza1873G.opseg} opseg. ${mobilneCentrale.length} centrale, ${mobilniServisi.length} servisa, ${mobilniSignali.length} signala.`,
          ikona: '📱',
          oznake: [mreza1873G.opseg, `${mobilneCentrale.length} centrale`, `${mobilniServisi.length} servisa`, 'Bez antena'],
          href: '/mobilna-mreza',
        },
        {
          naslov: '🔧 Auto-Popravka',
          opis: `Samoiscelujući sistem. ${dijagnostika.ukupnoProvera} provera, zdravlje ${dijagnostika.zdravlje}%, ${dijagnostika.uspesnih} uspešnih.`,
          ikona: '🔧',
          oznake: [`${dijagnostika.ukupnoProvera} provera`, `${dijagnostika.zdravlje}% zdravlje`, `${dijagnostika.uspesnih} uspešnih`, 'Auto-repair'],
          href: '/auto-popravka',
        },
        {
          naslov: '🧬 Autonomna Evolucija',
          opis: `Omega Evolucioni Motor radi 24/7. Svakih 6h dijagnostika, max ${evolKonfig.maxIssuePoDanu} issue-a/dan, auto-merge za GitHub PRs.`,
          ikona: '🧬',
          oznake: ['Svakih 6h', `Max ${evolKonfig.maxIssuePoDanu} issue/dan`, 'Auto-merge', 'Cron job'],
          href: '/deploy',
        },
      ],
    },
  },
  {
    id: 'moze-sve-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ SPAJA Platform Stack — Kako moduli sarađuju',
    redosled: 4,
    podaci: {
      nivoi: [
        {
          naziv: '⚡ SpajaPro Engine — Temelj svega',
          ikona: '🌟',
          deca: aktivneVerzije.map(
            (v) => `${v.ikona} ${v.naziv} (${v.kodnoIme}) — pokreće OMEGA AI, Proksi i sve module`,
          ),
        },
        {
          naziv: '🧠 OMEGA AI — Inteligentni sloj',
          ikona: '🧠',
          deca: [
            `${OMEGA_AI_PERSONA_COUNT} persona u ${ukupnoOktava} oktava — svaka koristi SpajaPro Prompt`,
            'Oktavni dispatch: sekvencijalni 1→8, 5 faza po oktavi',
            'Matrično jezgro 8×8 + neurološka mreža',
            'Povratna petlja: Evolucija (okt 8) ↔ Temelj (okt 1)',
          ],
        },
        {
          naziv: '📡 Proksi + 📱 Mobilna — Mrežni sloj',
          ikona: '📡',
          deca: [
            `Proksi: ${aktivniSignali.length} aktivnih signala → napaja Mobilnu mrežu`,
            `Mobilna 1873G: ${aktivneCentrale.length} centrale, ${aktivniMobilniSignali.length} aktivnih signala`,
            `${mobilniServisi.length} mobilnih servisa (Glas HD, Podaci Turbo, Stream, IoT Mesh, Enterprise Link)`,
            'Signal bez antena — kružni povrat između pozivnika',
          ],
        },
        {
          naziv: '🔧 Auto-Popravka + 🧬 Evolucija — Autonomija',
          ikona: '🔧',
          deca: [
            `Auto-Popravka: ${dijagnostika.ukupnoProvera} provera, zdravlje ${dijagnostika.zdravlje}%`,
            `Evolucija: svakih 6h ciklus, max ${evolKonfig.maxIssuePoDanu} GitHub issue-a dnevno`,
            'Copilot agent automatski rešava issue-e i otvara PRs',
            'Auto-merge za PRs koji prolaze CI — nulta intervencija',
          ],
        },
      ],
    },
  },
  {
    id: 'moze-sve-tekst',
    tip: 'tekst',
    naslov: 'Šta je MOŽE SVE — SPAJA Super Hub?',
    redosled: 5,
    podaci: {
      sadrzaj: `MOŽE SVE je jedinstveni pogled na svih 6 core modula AI IQ SUPER PLATFORME Kompanije SPAJA. Platforma radi potpuno autonomno — SpajaPro engine (v${SPAJA_PRO_RANGE}) pokreće sve AI operacije, OMEGA AI orkestrira ${OMEGA_AI_PERSONA_COUNT} specijalizovanih persona, Proksi distribuira hipsoneurične signale, Mobilna mreža baca signal bez antena, Auto-Popravka čuva zdravlje sistema, a Autonomna Evolucija neprestano unapređuje platformu.`,
      istaknuteStavke: [
        `🌟 SpajaPro: ${spajaProVerzije.length} verzija (${SPAJA_PRO_RANGE}), ${aktivneVerzije.length} aktivnih, ${ukupnoMogucnosti} mogućnosti — potpuna zamena za ChatGPT`,
        `🧠 OMEGA AI: ${OMEGA_AI_PERSONA_COUNT} persona u ${ukupnoOktava} oktava — oktavni dispatch + matrično jezgro + neurološka mreža`,
        `📡 Proksi: ${proksiSignali.length} signala, ${proksiCvorovi.length} čvorova — hipsoneurični signal do ${povezanihPlatformi} platformi, kapacitet 10²²⁸ TB`,
        `📱 Mobilna 1873G: ${mobilneCentrale.length} centrale, ${mobilniServisi.length} servisa, ${mobilniSignali.length} signala — ${mreza1873G.opseg} opseg`,
        `🔧 Auto-Popravka: ${dijagnostika.ukupnoProvera} provera, zdravlje ${dijagnostika.zdravlje}%, ${dijagnostika.uspesnih} uspešnih dijagnoza`,
        `🧬 Evolucija: ciklus svakih 6h, max ${evolKonfig.maxIssuePoDanu} issue-a dnevno, auto-merge — nulta intervencija`,
      ],
    },
  },
  {
    id: 'moze-sve-lista',
    tip: 'lista',
    naslov: '⚡ Šta svaki modul može?',
    redosled: 6,
    podaci: {
      stavke: [
        {
          ikona: '🌟',
          naslov: 'SpajaPro Engine',
          opis: `${spajaProVerzije.length} verzija (${SPAJA_PRO_RANGE}) — zamenjuje ChatGPT, obrađuje sve Prompt-ove u ekosistemu sa do 1M tokena`,
        },
        {
          ikona: '🧠',
          naslov: 'OMEGA AI',
          opis: `${OMEGA_AI_PERSONA_COUNT} specijalizovanih AI persona u ${ukupnoOktava} oktavnih nivoa — orkestrira sve AI zadatke platforme`,
        },
        {
          ikona: '📡',
          naslov: 'Proksi',
          opis: `${proksiSignali.length} hipsoneuričnih signala kroz ${proksiCvorovi.length} čvorova — ${povezanihPlatformi} platformi, kapacitet 10²²⁸ TB po signalu`,
        },
        {
          ikona: '📱',
          naslov: 'Mobilna 1873G',
          opis: `${mobilneCentrale.length} centrale, ${mobilniSignali.length} signala — baca signal bez antena, opseg ${mreza1873G.opseg}`,
        },
        {
          ikona: '🔧',
          naslov: 'Auto-Popravka',
          opis: `${dijagnostika.ukupnoProvera} automatskih dijagnostičkih provera — detektuje, dijagnostikuje i popravlja bez intervencije`,
        },
        {
          ikona: '🧬',
          naslov: 'Autonomna Evolucija',
          opis: `Omega Evolucioni Motor — svakih 6h dijagnostika, GitHub Issues, Copilot agent rešava, auto-merge`,
        },
      ],
    },
  },
  {
    id: 'moze-sve-cta',
    tip: 'cta',
    naslov: '🚀 Istraži sve module',
    redosled: 7,
    podaci: {
      opis: 'AI IQ SUPER PLATFORMA Kompanije SPAJA radi autonomno 24/7. Istraži svaki modul.',
      stavke: [
        { naziv: 'SpajaPro verzije', vrednost: spajaProVerzije.length, ikona: '🌟' },
        { naziv: 'OMEGA AI Persone', vrednost: OMEGA_AI_PERSONA_COUNT, ikona: '🧠' },
        { naziv: 'Proksi signali', vrednost: proksiSignali.length, ikona: '📡' },
        { naziv: 'Zdravlje sistema', vrednost: dijagnostika.zdravlje, ikona: '🔧' },
      ],
      dugmad: [
        { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
