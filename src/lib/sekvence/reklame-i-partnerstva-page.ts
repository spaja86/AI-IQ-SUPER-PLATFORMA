import type { Sekvenca } from '@/lib/types';
import {
  reklame,
  partnerstva,
  monetizacijaKanali,
  getReklameMetrike,
  getReklameSummary,
} from '@/lib/reklame-i-partnerstva';
import { KOMPANIJA, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const metrike = getReklameMetrike();
const summary = getReklameSummary();

export const reklameIPartnerstvaSekvence: Sekvenca[] = [
  {
    id: 'reklame-hero',
    tip: 'hero',
    naslov: '📢 Reklame & Partnerstva — Monetizacija',
    podnaslov: `${KOMPANIJA} — Skaliranje Digitalne Industrije kroz reklame, partnerstva i monetizaciju`,
    ikona: '📢',
    redosled: 1,
    podaci: {
      opis: `Digitalna Industrija se skalira sa ${metrike.ukupnoReklama} reklamnih kampanja, ${metrike.ukupnoPartnerstava} partnerstava iz svih branši i ${metrike.monetizacijaKanala} kanala monetizacije. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona podržava celokupnu reklamnu infrastrukturu.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Pricing', href: '/pricing', stil: 'sekundarno' },
        { tekst: 'OMEGA Plasiranje', href: '/omega-projekat-plasiranje', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'reklame-statistika',
    tip: 'statistika',
    naslov: '📊 Reklamni ekosistem u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Reklame', vrednost: metrike.ukupnoReklama, ikona: '📢' },
        { naziv: 'Aktivne', vrednost: metrike.aktivnihReklama, ikona: '✅' },
        { naziv: 'U pripremi', vrednost: metrike.uPripremiReklama, ikona: '⏳' },
        { naziv: 'Planirane', vrednost: metrike.planiranihReklama, ikona: '📋' },
        { naziv: 'Partnerstva', vrednost: metrike.ukupnoPartnerstava, ikona: '🤝' },
        { naziv: 'Potpisana', vrednost: metrike.aktivnihPartnerstava, ikona: '✍️' },
        { naziv: 'U pregovorima', vrednost: metrike.uPregovorima, ikona: '💬' },
        { naziv: 'Monetizacija', vrednost: metrike.monetizacijaKanala, ikona: '💰' },
        { naziv: 'Aktivni kanali', vrednost: metrike.aktivnihKanala, ikona: '🟢' },
      ],
    },
  },
  {
    id: 'reklame-kampanje',
    tip: 'kartice',
    naslov: '🎯 Reklamne Kampanje',
    podnaslov: `${metrike.ukupnoReklama} kampanja — ${summary.status}`,
    redosled: 3,
    podaci: {
      kartice: reklame.map((r) => ({
        naslov: `${r.ikona} ${r.naziv}`,
        opis: r.poruka,
        ikona: r.ikona,
        oznake: [
          r.tip,
          r.status === 'aktivna' ? '✅ Aktivna' : r.status === 'u_pripremi' ? '⏳ U pripremi' : '📋 Planirana',
          r.ocekivaniDoseg,
        ],
      })),
    },
  },
  {
    id: 'reklame-tabela-kampanja',
    tip: 'tabela',
    naslov: '📋 Pregled svih reklamnih kampanja',
    podnaslov: 'Detalji o svakoj kampanji — tip, platforma, ciljna publika, doseg',
    redosled: 4,
    podaci: {
      zaglavlje: ['Reklama', 'Tip', 'Platforma', 'Ciljna Publika', 'Doseg', 'Status'],
      redovi: reklame.map((r) => [
        `${r.ikona} ${r.naziv}`,
        r.tip,
        r.platforma,
        r.ciljnaPublika,
        r.ocekivaniDoseg,
        r.status === 'aktivna' ? '✅ Aktivna' : r.status === 'u_pripremi' ? '⏳ U pripremi' : '📋 Planirana',
      ]),
    },
  },
  {
    id: 'reklame-partnerstva',
    tip: 'kartice',
    naslov: '🤝 Partnerstva iz svih branši',
    podnaslov: `${metrike.ukupnoPartnerstava} partnerstava — ${summary.partnerstvaStatus}`,
    redosled: 5,
    podaci: {
      kartice: partnerstva.map((p) => ({
        naslov: `${p.ikona} ${p.naziv}`,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [
          p.bransa,
          p.status === 'potpisano' ? '✅ Potpisano' : p.status === 'u_pregovorima' ? '💬 U pregovorima' : '📋 Planirano',
          ...p.benefiti.slice(0, 2),
        ],
      })),
    },
  },
  {
    id: 'reklame-tabela-partnerstava',
    tip: 'tabela',
    naslov: '📋 Pregled svih partnerstava',
    podnaslov: 'Branša, status, benefiti i kontakt za svako partnerstvo',
    redosled: 6,
    podaci: {
      zaglavlje: ['Partner', 'Branša', 'Status', 'Benefiti', 'Kontakt'],
      redovi: partnerstva.map((p) => [
        `${p.ikona} ${p.naziv}`,
        p.bransa,
        p.status === 'potpisano' ? '✅ Potpisano' : p.status === 'u_pregovorima' ? '💬 U pregovorima' : '📋 Planirano',
        p.benefiti.slice(0, 3).join(', '),
        p.kontakt,
      ]),
    },
  },
  {
    id: 'reklame-monetizacija',
    tip: 'kartice',
    naslov: '💰 Kanali monetizacije',
    podnaslov: `${metrike.monetizacijaKanala} kanala — ${summary.monetizacijaStatus}`,
    redosled: 7,
    podaci: {
      kartice: monetizacijaKanali.map((m) => ({
        naslov: `${m.ikona} ${m.naziv}`,
        opis: m.opis,
        ikona: m.ikona,
        oznake: [
          m.kanal,
          m.mesecniPrihod,
          m.status === 'aktivna' ? '✅ Aktivna' : m.status === 'u_pripremi' ? '⏳ U pripremi' : '📋 Planirana',
        ],
      })),
    },
  },
  {
    id: 'reklame-tekst-strategija',
    tip: 'tekst',
    naslov: '📈 Strategija skaliranja reklamnog sistema',
    redosled: 8,
    podaci: {
      sadrzaj: `${KOMPANIJA} skalira Digitalnu Industriju kroz višekanalni pristup reklamiranju i monetizaciji. Svaka platforma ima sopstvenu reklamnu kampanju prilagođenu ciljnoj publici. Partnerstva iz svih branši — od tehnologije, preko finansija i telekomunikacija, do gaming-a, zdravstva i medija — obezbeđuju širok doseg i diversifikovane prihode.`,
      istaknuteStavke: [
        'Višekanalni pristup: YouTube, LinkedIn, Google Ads, TikTok, Twitch, Discord i još',
        `${metrike.ukupnoReklama} reklamnih kampanja pokriva sve proizvode i servise`,
        `${metrike.ukupnoPartnerstava} partnerstava iz ${new Set(partnerstva.map((p) => p.bransa)).size} različitih branši`,
        `${metrike.monetizacijaKanala} kanala monetizacije — od reklama do licenciranja i API-ja`,
        'OMEGA AI persona podržava automatizovano reklamiranje 24/7',
        'Cilj: globalni doseg sa 10.000.000+ impresija mesečno',
        'Revenue target: €480.000+ mesečno iz svih kanala',
        'Affiliate program i sponzorstva za dodatne prihode',
      ],
    },
  },
  {
    id: 'reklame-baner',
    tip: 'baner',
    naslov: 'Monetizacija Digitalne Industrije — Sve Branše',
    redosled: 9,
    podaci: {
      bedz: '💰 Monetizacija',
      opis: `${KOMPANIJA} monetizuje ceo ekosistem sa ${metrike.ukupnoReklama} reklamnih kampanja i ${metrike.ukupnoPartnerstava} partnerstava. Od SpajaPro pretplata do API licenciranja — svaki kanal doprinosi rastu. Pridružite se kao partner!`,
      dugme: { tekst: 'Postani partner →', href: '/omega-ai-suport' },
    },
  },
  {
    id: 'reklame-cta',
    tip: 'cta',
    naslov: '🚀 Reklamirajte se sa nama — Pridružite se ekosistemu',
    redosled: 10,
    podaci: {
      opis: `Digitalna Industrija ${KOMPANIJA} nudi partnerstva za kompanije iz svih branši. ${metrike.ukupnoReklama} kampanja, ${metrike.ukupnoPartnerstava} partnera, ${metrike.monetizacijaKanala} kanala monetizacije. Skaliramo zajedno!`,
      stavke: [
        { naziv: 'Reklame', vrednost: metrike.ukupnoReklama, ikona: '📢' },
        { naziv: 'Partnerstva', vrednost: metrike.ukupnoPartnerstava, ikona: '🤝' },
        { naziv: 'Monetizacija', vrednost: metrike.monetizacijaKanala, ikona: '💰' },
        { naziv: 'Branše', vrednost: new Set(partnerstva.map((p) => p.bransa)).size, ikona: '🏢' },
        { naziv: 'Doseg', vrednost: '10M+', ikona: '🌍' },
      ],
      dugmad: [
        { tekst: 'Kontaktiraj nas', href: '/omega-ai-suport' },
        { tekst: 'OMEGA Plasiranje', href: '/omega-projekat-plasiranje', stil: 'sekundarno' },
        { tekst: 'Pricing & Planovi', href: '/pricing', stil: 'sekundarno' },
      ],
    },
  },
];
