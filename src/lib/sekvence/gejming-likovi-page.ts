import type { Sekvenca } from '@/lib/types';
import { OMEGA_AI_PERSONA_UKUPNO, TOTAL_GEJMING_ENTITETA } from '@/lib/constants';
import { buildGejmingLikovi } from '@/lib/gejming-likovi';

const r = buildGejmingLikovi('system');

export const gejmingLikoviSekvence: Sekvenca[] = [
  {
    id: 'gejming-likovi-hero',
    tip: 'hero',
    naslov: '🎭 Industrija Gejming Likova',
    podnaslov:
      'Dizajn likova, objekata, subjekata i svega što postoji za igrice — centralni katalog gaming entiteta AI IQ SUPER PLATFORMA',
    ikona: '🎭',
    redosled: 1,
    podaci: {
      opis:
        `Industrija Gejming Likova objedinjuje ${TOTAL_GEJMING_ENTITETA} gaming entiteta: ` +
        `igrivi likovi, NPC, objekti, subjekti, okruženja, sredstva, vozila, oružja i kostimi. ` +
        `Svaki entitet je vezan za konkretne igrice i dimenzionalni sistem (360D–5760D).`,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Gejming Industrija', href: '/gejming-industrija', stil: 'sekundarno' },
        { tekst: 'Dimenzije', href: '/dimenzije', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'gejming-likovi-statistika',
    tip: 'statistika',
    naslov: '📊 Industrija Gejming Likova — KPI',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Entiteta', vrednost: r.pregled.ukupnoEntiteta, ikona: '🎭' },
        { naziv: 'Igrivi Likovi', vrednost: r.pregled.likovaIgravih, ikona: '🦸' },
        { naziv: 'NPC Likovi', vrednost: r.pregled.npcLikova, ikona: '🤖' },
        { naziv: 'Objekti', vrednost: r.pregled.objekata, ikona: '📦' },
        { naziv: 'Subjekti', vrednost: r.pregled.subjekata, ikona: '🏛️' },
        { naziv: 'Okruženja', vrednost: r.pregled.okruzenja, ikona: '🌐' },
        { naziv: 'Kategorije Dizajna', vrednost: r.pregled.kategorijaCount, ikona: '🎨' },
        { naziv: 'Vezanih Igrica', vrednost: r.pregled.vezanihIgrica, ikona: '🎮' },
      ],
    },
  },
  {
    id: 'gejming-likovi-po-tipu',
    tip: 'tabela',
    naslov: '🗂️ Katalog po tipu entiteta',
    podnaslov: 'Likovi → NPC → Objekti → Subjekti → Okruženja → Sredstva → Vozila → Oružja → Kostimi',
    redosled: 3,
    podaci: {
      zaglavlje: ['Tip entiteta', 'Broj entiteta'],
      redovi: r.poTipu
        .filter((t) => t.brojEntiteta > 0)
        .map((t) => [t.tip, String(t.brojEntiteta)]),
    },
  },
  {
    id: 'gejming-likovi-domeni',
    tip: 'kartice',
    naslov: '🧩 Domenski opseg Industrije Gejming Likova',
    redosled: 4,
    podaci: {
      kartice: [
        {
          naslov: '🦸 Igrivi Likovi',
          opis: `${r.pregled.likovaIgravih} playable likova sa unikatnim atributima, sposobnostima i vizuelnim stilovima vezanim za dimenzionalni sistem.`,
          ikona: '🦸',
          oznake: ['Playable', 'Atributi', 'Sposobnosti'],
        },
        {
          naslov: '🤖 NPC Likovi',
          opis: `${r.pregled.npcLikova} AI-upravljanih likova koji pružaju izazove, pomoć i narativni kontekst. Prilagođavaju se dimenzijama.`,
          ikona: '🤖',
          oznake: ['NPC', 'AI-driven', 'Adaptivni'],
        },
        {
          naslov: '📦 Objekti',
          opis: `${r.pregled.objekata} interaktivnih objekata — portali, pojačivači, kontejneri i specifični alati igrica.`,
          ikona: '📦',
          oznake: ['Interaktivno', 'Portali', 'Pojačivači'],
        },
        {
          naslov: '🏛️ Subjekti',
          opis: `${r.pregled.subjekata} apstraktnih entiteta koji predstavljaju sistemske koncepte — Digitalna Industrija, OMEGA AI mreža, Proksi.`,
          ikona: '🏛️',
          oznake: ['Apstraktno', 'Sistemski', 'Koncepti'],
        },
        {
          naslov: '🌐 Okruženja',
          opis: `${r.pregled.okruzenja} gaming okruženja dizajniranih za različite kategorije — fantazija, sci-fi, retro, anime, horror.`,
          ikona: '🌐',
          oznake: ['Okruženja', 'Stilovi', 'Dimenzionalna'],
        },
        {
          naslov: '🛠️ Sredstva, Vozila, Oružja, Kostimi',
          opis: `${r.pregled.sredstava + r.pregled.vozila + r.pregled.oruzja + r.pregled.kostima} opremnih entiteta koji pojačavaju gaming iskustvo igrača.`,
          ikona: '🛠️',
          oznake: ['Oprema', 'Vozila', 'Kostimi'],
        },
      ],
    },
  },
  {
    id: 'gejming-likovi-po-kategoriji',
    tip: 'tabela',
    naslov: '🎨 Katalog po kategoriji dizajna',
    podnaslov: 'Fantazija · Sci-fi · Realizam · Retro · Anime · Horror · Sport · Istorija',
    redosled: 5,
    podaci: {
      zaglavlje: ['Kategorija dizajna', 'Broj entiteta'],
      redovi: r.poKategoriji
        .filter((k) => k.brojEntiteta > 0)
        .map((k) => [k.kategorija, String(k.brojEntiteta)]),
    },
  },
  {
    id: 'gejming-likovi-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Struktura Industrije Gejming Likova',
    redosled: 6,
    podaci: {
      nivoi: [
        {
          naziv: 'Industrija Gejming Likova',
          ikona: '🎭',
          deca: [
            'Igrivi likovi (playable)',
            'NPC likovi (AI-driven)',
            'Objekti i sredstva',
            'Subjekti (apstraktni entiteti)',
            'Okruženja i vozila',
            'Oružja i kostimi',
          ],
        },
        {
          naziv: 'Statistike entiteta',
          ikona: '📊',
          deca: [
            `Ukupno entiteta: ${r.pregled.ukupnoEntiteta}`,
            `Igrivi likovi: ${r.pregled.likovaIgravih}`,
            `NPC: ${r.pregled.npcLikova}`,
            `Objekti: ${r.pregled.objekata}`,
            `Okruženja: ${r.pregled.okruzenja}`,
            `Vozila + Oružja + Kostimi: ${r.pregled.vozila + r.pregled.oruzja + r.pregled.kostima}`,
          ],
        },
        {
          naziv: 'Dizajn i veze',
          ikona: '🎨',
          deca: [
            `Kategorije dizajna: ${r.pregled.kategorijaCount}`,
            `Vezanih igrica: ${r.pregled.vezanihIgrica}`,
            'Dimenzionalni sistem: 360D–5760D',
            `OMEGA AI persone: aktivne`,
          ],
        },
      ],
    },
  },
  {
    id: 'gejming-likovi-tekst',
    tip: 'tekst',
    naslov: '🧠 Operativna logika',
    redosled: 7,
    podaci: {
      sadrzaj:
        `Industrija Gejming Likova je centralni registar svih gaming entiteta — od igravih likova i NPC-ova, ` +
        `do objekata, subjekata, okruženja, sredstava, vozila, oružja i kostima. ` +
        `Svaki entitet je projektovan sa atributima, sposobnostima i vizuelnim stilom koji se prilagođava dimenzionalnom sistemu (360D–5760D). ` +
        `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona su inspiracija i pokretač kreativnog razvoja svakog entiteta.`,
      istaknuteStavke: [
        'Svaki entitet vezan za konkretnu igricu i dimenzionalni sistem',
        'Tipovi: lik-igriv, lik-npc, objekat, subjekat, okruzenje, sredstvo, vozilo, oruzje, kostim',
        'Kategorije dizajna: fantazija, sci-fi, realizam, retro, anime, horror, sport, istorija',
        'Atributi i sposobnosti specifični za svaki entitet i dimenziju',
        'Vizuelni stil inspirisan OMEGA AI personama i gaming žanrovima',
      ],
    },
  },
  {
    id: 'gejming-likovi-cta',
    tip: 'cta',
    naslov: '🚀 Istraži Gejming Entitete',
    redosled: 8,
    podaci: {
      opis:
        `Industrija Gejming Likova katalogizuje ${r.pregled.ukupnoEntiteta} entiteta ` +
        `kroz ${r.pregled.vezanihIgrica} igrica i ${r.pregled.kategorijaCount} kategorija dizajna.`,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Gejming Industrija', href: '/gejming-industrija', stil: 'sekundarno' },
        { tekst: 'Dimenzije', href: '/dimenzije', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
];
