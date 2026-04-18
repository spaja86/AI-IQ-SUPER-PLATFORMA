import type { Sekvenca } from '@/lib/types';
import { platforme, getUkupniProgres } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { generisaniEngini, getProsecnaOptimizacija } from '@/lib/spaja-generator-engine';

import { vizuelniResursi, osnivacProfil } from '@/lib/vizuelni-identitet';

const stats = getStatistike();
const dijagnostika = runDiagnostics();

const logoResurs = vizuelniResursi.find((r) => r.id === 'logo-digitalna-industrija');

export const pocetnaSekvence: Sekvenca[] = [
  {
    id: 'pocetna-logo',
    tip: 'slika',
    naslov: '🌀 Digitalna Industrija',
    podnaslov: `Kompanija SPAJA — osnivač ${osnivacProfil.punoIme}`,
    redosled: 0,
    podaci: {
      slike: logoResurs
        ? [{ url: logoResurs.url, alt: logoResurs.alt, sirina: 400, visina: 600 }]
        : [],
      raspored: 'kolona',
    },
  },
  {
    id: 'pocetna-hero',
    tip: 'hero',
    naslov: 'Kompanija SPAJA',
    podnaslov: 'AI IQ SUPER PLATFORMA — Digitalna Industrija sa SpajaPro Prompt Engine-om',
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: `Kompanija SPAJA upravlja sa ${stats.ukupnoProizvoda} IT proizvoda na ${stats.ukupnoPlatformi} platformi. SpajaPro engine (v6-15) sa ${stats.ukupnoPromptova} Prompt-ova pokreće ceo ekosistem. Zdravlje: ${dijagnostika.zdravlje}%. Autofinish ×${stats.autofinishBroj}.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Prompt', href: '/prompt', stil: 'sekundarno' },
        { tekst: 'SpajaPro', href: '/spaja-pro', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pocetna-login',
    tip: 'login',
    naslov: '🔐 Prijavi se u Digitalnu Industriju',
    podnaslov: 'Konektuj se na platformu i proveri da li sve radi',
    redosled: 2,
    podaci: {
      opis: `Prijavite se u Digitalnu Industriju Kompanije SPAJA. Pristupite ${stats.ukupnoPlatformi} platformama, ${stats.ukupnoProizvoda} IT proizvodima, ${stats.ukupnoOmegaPersona} OMEGA AI personama i kompletnom SpajaPro ekosistemu.`,
      metode: [
        { naziv: 'Google', ikona: '🔵', metod: 'google' },
        { naziv: 'GitHub', ikona: '🐙', metod: 'github' },
        { naziv: 'Telefon', ikona: '📱', metod: 'telefon' },
        { naziv: 'SpajaPro', ikona: '🚀', metod: 'spajapro' },
      ],
    },
  },
  {
    id: 'pocetna-statistika',
    tip: 'statistika',
    naslov: '📊 Ekosistem u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Aktivne', vrednost: stats.aktivnihPlatformi, ikona: '✅' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'OMEGA AI', vrednost: stats.ukupnoOmegaPersona, ikona: '🧠' },
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'SpajaPro', vrednost: `v6-15`, ikona: '🌟' },
        { naziv: 'Dimenzije', vrednost: stats.ukupnoDimenzija, ikona: '🌀' },
        { naziv: 'Stranice', vrednost: stats.ukupnoStranica, ikona: '📄' },
        { naziv: 'Rute', vrednost: stats.ukupnoRuta, ikona: '🗺️' },
        { naziv: 'Kompanije', vrednost: stats.ukupnoKompanija, ikona: '🏛️' },
        { naziv: 'Organizacije', vrednost: stats.ukupnoOrganizacija, ikona: '🏢' },
        { naziv: 'Engine-i', vrednost: stats.generatorEngina, ikona: '🔧' },
        { naziv: 'Zdravlje', vrednost: `${dijagnostika.zdravlje}%`, ikona: '💚' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
      ],
    },
  },
  {
    id: 'pocetna-progres',
    tip: 'progres',
    naslov: '🚀 Ukupni progres ekosistema',
    redosled: 4,
    podaci: {
      progres: getUkupniProgres(),
      poruka: 'Kada svi projekti dostignu 100%, sve se plasira na Vercel. SpajaPro Prompt engine pokreće automatizaciju.',
    },
  },
  {
    id: 'pocetna-platforme',
    tip: 'kartice',
    naslov: '🌐 Platforme u ekosistemu',
    podnaslov: `Pregled prvih 6 od ${stats.ukupnoPlatformi} platformi — sve sa SpajaPro Prompt integracijom`,
    redosled: 5,
    podaci: {
      kartice: platforme.slice(0, 6).map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        progres: p.progres,
        oznake: p.tehnologije,
        href: '/platforme',
      })),
    },
  },
  {
    id: 'pocetna-proizvodi',
    tip: 'kartice',
    naslov: '⚡ IT Proizvodi Kompanije SPAJA',
    podnaslov: `Pregled prvih 4 od ${stats.ukupnoProizvoda} proizvoda sa Prompt podrškom`,
    redosled: 6,
    podaci: {
      kartice: itProizvodi.slice(0, 4).map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: p.funkcije,
        href: '/it-proizvodi',
      })),
    },
  },
  {
    id: 'pocetna-preporuke',
    tip: 'kartice',
    naslov: '💡 Preporucujemo — Morate probati',
    podnaslov: 'Najzanimljiviji delovi Digitalne Industrije — izaberite i istrazite',
    redosled: 7,
    podaci: {
      kartice: [
        {
          naslov: '🤖 SpajaPro AI Chat',
          opis: 'Zamena za ChatGPT — SpajaPro engine v6-15 sa 10 verzija. Pitajte AI bilo sta o platformi, industriji ili vama.',
          ikona: '🤖',
          href: '/spaja-pro',
          oznake: ['AI', 'Chat', 'SpajaPro'],
        },
        {
          naslov: '💬 Prompt Konzola',
          opis: `${stats.ukupnoPromptova}+ programabilnih promptova. Izvrsite prompt, sacuvajte u istoriju, koristite parametre. Vasa licna AI laboratorija.`,
          ikona: '💬',
          href: '/prompt',
          oznake: ['Prompt', 'Engine', 'Parametri'],
        },
        {
          naslov: '🎮 Gaming Platforma',
          opis: `${stats.ukupnoIgrica} igrica u 18 kategorija — Dota 1350, TRANSFORMERS, BUBLI BABLI, Poker, Sabljarka, i jos mnogo toga.`,
          ikona: '🎮',
          href: '/io-openui-ao-gaming-platforma',
          oznake: ['Igrice', '18 Kategorija', 'Multiplayer'],
        },
        {
          naslov: '📺 Digitalni Televizor',
          opis: 'Univerzalni digitalni TV sa 12 kanala — zabava, sport, vesti, edukacija, muzika i jos mnogo toga u vasem browseru.',
          ikona: '📺',
          href: '/digitalni-televizor',
          oznake: ['TV', '12 Kanala', 'Streaming'],
        },
        {
          naslov: '🏦 SPAJA Banka',
          opis: 'Digitalna banka sa racunima, transferima, kreditima, investicijama i AI finansijskim savetnikom.',
          ikona: '🏦',
          href: '/banka',
          oznake: ['Finansije', 'Transferi', 'AI'],
        },
        {
          naslov: '💱 SPAJA Menjacnica',
          opis: 'Kripto i fiat menjacnica sa AI optimizacijom portfolio-a, real-time kursevima i analitickim alatima.',
          ikona: '💱',
          href: '/menjacnica',
          oznake: ['Kripto', 'Fiat', 'Trading'],
        },
        {
          naslov: '📡 Monitoring Live',
          opis: 'Twitch-like streaming platforma za pracenje svih sistema u realnom vremenu — health, API, deploy status.',
          ikona: '📡',
          href: '/monitoring-live',
          oznake: ['Live', 'Streaming', 'Monitoring'],
        },
        {
          naslov: '🌐 Digitalni Brouvzer',
          opis: 'SPAJA sopstveni web pregledac sa vlastitim render motorom i transparentnim frontend-om. Buducnost browsinga.',
          ikona: '🌐',
          href: '/spaja-digitalni-brouvzer',
          oznake: ['Brouvzer', 'Render', 'Engine'],
        },
      ],
    },
  },
  {
    id: 'pocetna-istrazite',
    tip: 'kartice',
    naslov: '🔍 Istrazite ceo ekosistem',
    podnaslov: `${stats.ukupnoStranica} stranica — svaka sa svojim funkcijama, AI promptovima i SpajaPro integracijom`,
    redosled: 8,
    podaci: {
      kartice: [
        { naslov: '🧠 OMEGA AI', opis: `${stats.ukupnoOmegaPersona} AI persona — 21 tipova sa 8 oktava`, ikona: '🧠', href: '/omega-ai', oznake: ['AI'] },
        { naslov: '🖥️ Digitalni Kompjuter', opis: 'SPAJA sopstveni virtualni kompjuter u browseru', ikona: '🖥️', href: '/spaja-digitalni-kompjuter', oznake: ['Kompjuter'] },
        { naslov: '🎬 Render Medija', opis: 'Renderovanje slika i video sadrzaja sa AI filterima', ikona: '🎬', href: '/spaja-render-medija', oznake: ['Medija'] },
        { naslov: '🔬 Laboratorija', opis: 'IO/OpenUI/AO eksperimentalna laboratorija', ikona: '🔬', href: '/io-openui-ao-laboratorija', oznake: ['Lab'] },
        { naslov: '📱 Mobilna Mreza', opis: `${stats.ukupnoMobilnihCentrala} centrale — sopstvena mobilna infrastruktura`, ikona: '📱', href: '/mobilna-mreza', oznake: ['Mobilna'] },
        { naslov: '🛡️ Proksi Mreza', opis: `${stats.ukupnoProksiCvorova} cvorova — globalna proxy infrastruktura`, ikona: '🛡️', href: '/proksi', oznake: ['Proksi'] },
        { naslov: '🌀 Dimenzije', opis: `${stats.ukupnoDimenzija} dimenzija — paralelni univerzumi podataka`, ikona: '🌀', href: '/dimenzije', oznake: ['Dimenzije'] },
        { naslov: '⚙️ Generator Engine', opis: `${generisaniEngini.length} engine-a sa ${getProsecnaOptimizacija()}% optimizacijom`, ikona: '⚙️', href: '/spaja-generator-engine', oznake: ['Engine'] },
        { naslov: '📞 OMEGA AI Suport', opis: 'AI podrska za korisnike — chat, ticket, live suport', ikona: '📞', href: '/omega-ai-suport', oznake: ['Suport'] },
        { naslov: '🔐 Bezbednost', opis: 'Zero Trust + AES-256-GCM + PBKDF2-SHA512', ikona: '🔐', href: '/security', oznake: ['Security'] },
        { naslov: '🏭 Industrija', opis: 'Pregled celokupne Digitalne Industrije', ikona: '🏭', href: '/industrija', oznake: ['Industrija'] },
        { naslov: '🚀 Deploy', opis: 'Vercel deploy status i konfiguracija', ikona: '🚀', href: '/deploy', oznake: ['Deploy'] },
      ],
    },
  },
  {
    id: 'pocetna-baner',
    tip: 'baner',
    naslov: 'SpajaPro Prompt Engine — Svuda u ekosistemu',
    redosled: 9,
    podaci: {
      bedz: '🌟 SpajaPro',
      opis: `SpajaPro 6-15 engine zamenjuje ChatGPT i donosi Prompt u svaki aspekt platforme. ${stats.ukupnoOmegaPersona} OMEGA AI persona × Prompt = autonomni ekosistem. SPAJA Generator prevlači ${generisaniEngini.length} engine-a sa ${getProsecnaOptimizacija()}% optimizacijom. Autofinish ×${stats.autofinishBroj} završen.`,
      dugme: { tekst: 'Istraži SpajaPro', href: '/spaja-pro' },
    },
  },
  {
    id: 'pocetna-cta',
    tip: 'cta',
    naslov: '🚀 Vercel Produkcija sa SpajaPro Prompt-om',
    redosled: 10,
    podaci: {
      opis: `AI IQ SUPER PLATFORMA v${stats.verzija} je deploirana na Vercel sa SpajaPro Prompt engine-om. ${dijagnostika.ukupnoProvera} dijagnostika, zdravlje ${dijagnostika.zdravlje}%. Autofinish ×${stats.autofinishBroj} — kontinualno poboljšanje.`,
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'OMEGA AI', vrednost: stats.ukupnoOmegaPersona, ikona: '🧠' },
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'SpajaPro', vrednost: `${stats.spajaProVerzija} verzija`, ikona: '🌟' },
        { naziv: 'Zdravlje', vrednost: `${dijagnostika.zdravlje}%`, ikona: '💚' },
        { naziv: 'Dijagnostike', vrednost: dijagnostika.ukupnoProvera, ikona: '🔍' },
      ],
      dugmad: [
        { tekst: 'Deploy Status', href: '/deploy' },
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine', stil: 'sekundarno' },
        { tekst: 'Auto-Popravka', href: '/auto-popravka', stil: 'sekundarno' },
      ],
    },
  },
];
