import type { Sekvenca } from '@/lib/types';
import { omegaPersone, oktavniNazivi, getPersonePoOktavi, getBrojPoOktavi } from '@/lib/omega-ai';
import type { OktavniNivo } from '@/lib/omega-ai';
import { createSinhronizacija } from '@/lib/omega-ai-dispatch';

const brojPoOktavi = getBrojPoOktavi();
const sync = createSinhronizacija();

export const omegaAISekvence: Sekvenca[] = [
  {
    id: 'omega-hero',
    tip: 'hero',
    naslov: '🧠 OMEGA AI',
    podnaslov: '21 AI Persona — Sekvencijalni oktavni dispatch sa elastičnom sinhronizacijom',
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis: 'OMEGA AI je sistem od 21 specijalizovane AI persone organizovanih u 8 oktavnih nivoa. Persone se dispečuju sekvencijalno po oktavama sa elastičnom specijalizovanom sinhronizacijom — skeleton → inicijalizacija → obrada → sinhronizacija → završeno.',
      dugmad: [
        { tekst: 'AI Platforma', href: '/ai-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'omega-tekst',
    tip: 'tekst',
    naslov: 'Sekvencijalno dispečovanje sa elastičnom sinhronizacijom',
    redosled: 2,
    podaci: {
      sadrzaj: `OMEGA AI koristi oktavni sistem dispečovanja gde se 21 persona organizuje u 8 nivoa (oktava). Svaka oktava prolazi kroz 5 faza elastične sinhronizacije: skeleton (priprema UI), inicijalizacija (pokretanje persona), obrada (paralelno izvršavanje), sinhronizacija (čekanje završetka) i završeno (prelaz na sledeću oktavu).

Elastično tajmovanje automatski prilagođava vreme svake faze prema broju persona i težini oktave — niže oktave (Temelj, Zaštita) imaju veći prioritet i duže bazno vreme.`,
      istaknuteStavke: [
        'Oktava 1 (Temelj) — Arhitekta i Graditelj — bazno vreme: ' + sync.oktave[0].elasticnoVreme + 'ms',
        'Oktava 2 (Zaštita) — Čuvar i Lekar — bazno vreme: ' + sync.oktave[1].elasticnoVreme + 'ms',
        'Oktava 3 (Kvalitet) — Tester i Dokumentar — bazno vreme: ' + sync.oktave[2].elasticnoVreme + 'ms',
        'Oktava 4–8 — Kreacija → Evolucija — elastično skalirane oktave',
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
        { naziv: 'Sinhronizacija', vrednost: sync.status === 'kompletan' ? '100%' : sync.ukupniProgres + '%', ikona: '🔄' },
        { naziv: 'Mod', vrednost: sync.mod === 'sekvencijalni' ? 'Seq' : 'Par', ikona: '⚡' },
      ],
    },
  },
  {
    id: 'omega-tabela-oktave',
    tip: 'tabela',
    naslov: '🎵 Oktavni nivoi dispečovanja sa sinhronizacijom',
    redosled: 4,
    podaci: {
      zaglavlje: ['Oktava', 'Naziv', 'Persone', 'Br.', 'Elastic ms', 'Faza'],
      redovi: ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
        const persone = getPersonePoOktavi(nivo);
        const oktSync = sync.oktave[nivo - 1];
        return [
          `🎵 ${nivo}`,
          oktavniNazivi[nivo],
          persone.map((p) => `${p.ikona} ${p.naziv}`).join(', '),
          String(brojPoOktavi[nivo] ?? 0),
          String(oktSync.elasticnoVreme),
          oktSync.faza === 'zavrseno' ? '✅' : '⏳',
        ];
      }),
    },
  },
  {
    id: 'omega-progres',
    tip: 'progres',
    naslov: '🔄 Sinhronizacija oktavnog sistema',
    podnaslov: `Mod: ${sync.mod} | Status: ${sync.status}`,
    redosled: 5,
    podaci: {
      progres: sync.ukupniProgres,
      poruka: 'Elastična specijalizovana sinhronizacija — sve oktave sekvencijalno obrađene sa skeleton pre-renderingom.',
    },
  },
  {
    id: 'omega-kartice',
    tip: 'kartice',
    naslov: '👥 Sve OMEGA AI Persone',
    redosled: 6,
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
    redosled: 7,
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
    naslov: '⚡ Faze elastične sinhronizacije',
    redosled: 8,
    podaci: {
      stavke: [
        { ikona: '💀', naslov: 'Skeleton faza', opis: 'Priprema layout-a sa skeleton placeholder-ima za svaku oktavu pre učitavanja podataka' },
        { ikona: '🚀', naslov: 'Inicijalizacija', opis: 'Pokretanje persona unutar oktave — elastično tajmovanje prema prioritetu' },
        { ikona: '⚡', naslov: 'Obrada (paralelno)', opis: 'Persone iste oktave rade istovremeno za maksimalnu efikasnost' },
        { ikona: '🔄', naslov: 'Sinhronizacija', opis: 'Čekanje da sve persone u oktavi završe pre prelaska na sledeću' },
        { ikona: '✅', naslov: 'Završeno', opis: 'Oktava kompletirana — prelaz na sledeću oktavu u sekvenci' },
        { ikona: '📡', naslov: 'API pristup', opis: 'GET /api/omega-ai za programski pristup dispatch + sync sistemu' },
      ],
    },
  },
  {
    id: 'omega-cta',
    tip: 'cta',
    naslov: '🚀 OMEGA AI Dispatch + Sinhronizacija',
    redosled: 9,
    podaci: {
      opis: '21 AI persona u 8 oktava sa elastičnom specijalizovanom sinhronizacijom i skeleton pre-renderingom.',
      stavke: [
        { naziv: 'Persone', vrednost: omegaPersone.length, ikona: '👥' },
        { naziv: 'Oktave', vrednost: 8, ikona: '🎵' },
        { naziv: 'Sync', vrednost: '100%', ikona: '🔄' },
        { naziv: 'Status', vrednost: '✅', ikona: '✅' },
      ],
      dugmad: [
        { tekst: 'AI Platforma', href: '/ai-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
