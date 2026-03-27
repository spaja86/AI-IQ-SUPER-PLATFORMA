import type { Sekvenca } from '@/lib/types';
import { omegaPersone, oktavniNazivi, getPersonePoOktavi, getBrojPoOktavi } from '@/lib/omega-ai';
import type { OktavniNivo } from '@/lib/omega-ai';

const brojPoOktavi = getBrojPoOktavi();

export const omegaAISekvence: Sekvenca[] = [
  {
    id: 'omega-hero',
    tip: 'hero',
    naslov: '🧠 OMEGA AI',
    podnaslov: '21 AI Persona — Sekvencijalni oktavni dispatch sistem',
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis: 'OMEGA AI je sistem od 21 specijalizovane AI persone organizovanih u 8 oktavnih nivoa. Persone se dispečuju sekvencijalno po oktavama — temelj, zaštita, kvalitet, kreacija, optimizacija, inteligencija, koordinacija, evolucija.',
      dugmad: [
        { tekst: 'AI Platforma', href: '/ai-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'omega-tekst',
    tip: 'tekst',
    naslov: 'Sekvencijalno dispečovanje u oktavnom sistemu',
    redosled: 2,
    podaci: {
      sadrzaj: 'OMEGA AI koristi oktavni sistem dispečovanja gde se 21 persona organizuje u 8 nivoa (oktava). Svaka oktava ima specifičnu ulogu u životnom ciklusu sistema. Persone unutar iste oktave rade paralelno, dok sledeća oktava čeka da prethodna završi.',
      istaknuteStavke: [
        'Oktava 1 (Temelj) — Arhitekta i Graditelj postavljaju osnove',
        'Oktava 2 (Zaštita) — Čuvar i Lekar osiguravaju bezbednost',
        'Oktava 3 (Kvalitet) — Tester i Dokumentar garantuju kvalitet',
        'Oktava 4–8 — Kreacija, Optimizacija, Inteligencija, Koordinacija, Evolucija',
      ],
    },
  },
  {
    id: 'omega-statistika',
    tip: 'statistika',
    naslov: 'OMEGA AI u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Persone', vrednost: omegaPersone.length, ikona: '👥' },
        { naziv: 'Oktave', vrednost: 8, ikona: '🎵' },
        { naziv: 'Kategorije', vrednost: 7, ikona: '📂' },
        { naziv: 'Operativnost', vrednost: '100%', ikona: '📈' },
      ],
    },
  },
  {
    id: 'omega-tabela',
    tip: 'tabela',
    naslov: '🎵 Oktavni nivoi dispečovanja',
    redosled: 4,
    podaci: {
      zaglavlje: ['Oktava', 'Naziv', 'Persone', 'Br.'],
      redovi: ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
        const persone = getPersonePoOktavi(nivo);
        return [
          `🎵 ${nivo}`,
          oktavniNazivi[nivo],
          persone.map((p) => `${p.ikona} ${p.naziv}`).join(', '),
          String(brojPoOktavi[nivo] ?? 0),
        ];
      }),
    },
  },
  {
    id: 'omega-kartice',
    tip: 'kartice',
    naslov: '👥 Sve OMEGA AI Persone',
    redosled: 5,
    podaci: {
      kartice: omegaPersone.map((p) => ({
        naslov: `${p.ikona} ${p.naziv}`,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [`Okt. ${p.oktavniNivo}`, p.kategorija, p.prioritet],
      })),
    },
  },
  {
    id: 'omega-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Oktavna hijerarhija',
    redosled: 6,
    podaci: {
      nivoi: ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => ({
        naziv: `Oktava ${nivo}: ${oktavniNazivi[nivo]}`,
        ikona: '🎵',
        deca: getPersonePoOktavi(nivo).map((p) => `${p.ikona} ${p.naziv}`),
      })),
    },
  },
  {
    id: 'omega-lista',
    tip: 'lista',
    naslov: '⚡ Kako radi dispatch',
    redosled: 7,
    podaci: {
      stavke: [
        { ikona: '1️⃣', naslov: 'Sekvencijalni redosled', opis: 'Oktave se izvršavaju redom 1→8, svaka mora završiti pre sledeće' },
        { ikona: '⚡', naslov: 'Paralelno unutar oktave', opis: 'Persone iste oktave rade istovremeno za maksimalnu efikasnost' },
        { ikona: '🔄', naslov: 'Automatska eskalacija', opis: 'Problemi se eskaliraju ka višim oktavama po potrebi' },
        { ikona: '📡', naslov: 'API pristup', opis: 'GET /api/omega-ai za programski pristup dispatch sistemu' },
      ],
    },
  },
  {
    id: 'omega-cta',
    tip: 'cta',
    naslov: '🚀 OMEGA AI Dispatch',
    redosled: 8,
    podaci: {
      opis: '21 AI persona u 8 oktava radi 24/7 sekvencijalnim dispečovanjem.',
      stavke: [
        { naziv: 'Persone', vrednost: omegaPersone.length, ikona: '👥' },
        { naziv: 'Oktave', vrednost: 8, ikona: '🎵' },
        { naziv: 'Status', vrednost: '100%', ikona: '✅' },
      ],
      dugmad: [
        { tekst: 'AI Platforma', href: '/ai-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
