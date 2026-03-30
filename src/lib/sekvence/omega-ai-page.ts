import type { Sekvenca } from '@/lib/types';
import { omegaPersone, oktavniNazivi, getPersonePoOktavi, getBrojPoOktavi } from '@/lib/omega-ai';
import type { OktavniNivo } from '@/lib/omega-ai';
import { createSinhronizacija, createMatricnoJezgro, createNeuroloskuMrezu } from '@/lib/omega-ai-dispatch';

const brojPoOktavi = getBrojPoOktavi();
const sync = createSinhronizacija();
const matrica = createMatricnoJezgro();
const neuro = createNeuroloskuMrezu();

export const omegaAISekvence: Sekvenca[] = [
  {
    id: 'omega-hero',
    tip: 'hero',
    naslov: '🧠 OMEGA AI — SpajaPro Prompt',
    podnaslov: '21 AI Persona × SpajaPro Prompt Engine — Oktavni dispatch + Matrično jezgro + Neurološka mreža',
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis: 'OMEGA AI je sistem od 21 specijalizovane AI persone, svaka sa SpajaPro Prompt-om, organizovanih u 8 oktavnih nivoa. SpajaPro engine (v6-15) zamenjuje ChatGPT i obrađuje sve Prompt-ove.',
      dugmad: [
        { tekst: 'Prompt Sistem', href: '/prompt' },
        { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
        { tekst: 'AI Platforma', href: '/ai-platforma', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'omega-tekst',
    tip: 'tekst',
    naslov: 'SpajaPro Prompt u oktavnom sistemu',
    redosled: 2,
    podaci: {
      sadrzaj: `OMEGA AI koristi SpajaPro Prompt engine (v6-15) umesto ChatGPT-a. Trostruki sistem: elastična sinhronizacija (skeleton → zavrseno), matrično jezgro (8×8 matrica sekvencionih odaziva) i neurološka mreža (sinaptičke veze između persona). Svaka persona ima SpajaPro Prompt.

Matrično jezgro modeluje interakcije između oktava — ekscitatorni, inhibitorni i modulatorni Prompt odazivi. Neurološka mreža modeluje persona kao čvorove sa sinaptičkim Prompt vezama.`,
      istaknuteStavke: [
        `Matrično jezgro: ${matrica.dimenzija}×${matrica.dimenzija} matrica, ${matrica.aktivnihVeza} aktivnih veza, prosečna jačina ${matrica.prosecnaJacina}`,
        `Neurološka mreža: ${neuro.ukupnoCvorova} čvorova, ${neuro.ukupnoSinapsi} sinapsi, prosečna aktivacija ${neuro.prosecnaAktivacija}`,
        `Elastična sinhronizacija: ${sync.oktave.length} oktava × 5 faza = sekvencijalni mod`,
        'SpajaPro Prompt: svaka persona koristi SpajaPro engine za sve zadatke',
        'Petlja Evolucija↔Temelj: modulatorni Prompt odaziv jačine 0.7',
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
        { naziv: 'Matrica', vrednost: `${matrica.dimenzija}×${matrica.dimenzija}`, ikona: '🧮' },
        { naziv: 'Sinapse', vrednost: neuro.ukupnoSinapsi, ikona: '🧬' },
      ],
    },
  },
  {
    id: 'omega-tabela-oktave',
    tip: 'tabela',
    naslov: '🎵 Oktavni nivoi sa sinhronizacijom i neurološkim klasterima',
    redosled: 4,
    podaci: {
      zaglavlje: ['Oktava', 'Naziv', 'Persone', 'Br.', 'Elastic ms', 'Sinapse', 'Aktivacija'],
      redovi: ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
        const persone = getPersonePoOktavi(nivo);
        const oktSync = sync.oktave[nivo - 1];
        const klaster = neuro.klasteri[nivo - 1];
        return [
          `🎵 ${nivo}`,
          oktavniNazivi[nivo],
          persone.map((p) => `${p.ikona} ${p.naziv}`).join(', '),
          String(brojPoOktavi[nivo] ?? 0),
          String(oktSync.elasticnoVreme),
          String(klaster.interneVeze + klaster.eksterneVeze),
          String(klaster.klasterAktivacija),
        ];
      }),
    },
  },
  {
    id: 'omega-tabela-matrica',
    tip: 'tabela',
    naslov: '🧮 Matrično jezgro — Sekvencioni odazivi (jačina)',
    redosled: 5,
    podaci: {
      zaglavlje: ['Izvor ↓ / Cilj →', ...([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((n) => `Okt ${n}`)],
      redovi: ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((izvor) => {
        const celije = ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((cilj) => {
          const odaziv = matrica.odazivi.find(
            (o) => o.izvornaOktava === izvor && o.ciljnaOktava === cilj,
          );
          if (!odaziv) return '—';
          const simbol = odaziv.tip === 'ekscitatorni' ? '↗' : odaziv.tip === 'inhibitorni' ? '↙' : '↔';
          return `${simbol} ${odaziv.jacina}`;
        });
        return [`🎵 ${izvor} ${oktavniNazivi[izvor]}`, ...celije];
      }),
    },
  },
  {
    id: 'omega-progres',
    tip: 'progres',
    naslov: '🔄 Sinhronizacija oktavnog sistema',
    podnaslov: `Mod: ${sync.mod} | Status: ${sync.status} | Matrica: ${matrica.status} | Neuro: ${neuro.status}`,
    redosled: 6,
    podaci: {
      progres: sync.ukupniProgres,
      poruka: `Elastična sinhronizacija kompletna. Matrično jezgro: ${matrica.aktivnihVeza}/${matrica.ukupnoVeza} aktivnih veza. Neurološka mreža: ${neuro.ukupnoSinapsi} sinapsi.`,
    },
  },
  {
    id: 'omega-kartice',
    tip: 'kartice',
    naslov: '👥 Sve OMEGA AI Persone sa SpajaPro Prompt-om',
    redosled: 7,
    podaci: {
      kartice: omegaPersone.map((p) => {
        const cvor = neuro.cvorovi.find((c) => c.personaId === p.id);
        return {
          naslov: `${p.ikona} ${p.naziv}`,
          opis: `${p.opis} | Prompt: ${p.prompt}`,
          ikona: p.ikona,
          oznake: [
            `Okt. ${p.oktavniNivo}`,
            p.kategorija,
            p.prioritet,
            `SpajaPro v${p.spajaProVerzija}`,
            `${cvor?.sinapse.length ?? 0} sinapsi`,
          ],
        };
      }),
    },
  },
  {
    id: 'omega-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Oktavna hijerarhija sa neurološkim klasterima',
    redosled: 8,
    podaci: {
      nivoi: ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
        const klaster = neuro.klasteri[nivo - 1];
        return {
          naziv: `Oktava ${nivo}: ${oktavniNazivi[nivo]} — ${klaster.interneVeze}↔${klaster.eksterneVeze} veza, akt: ${klaster.klasterAktivacija}`,
          ikona: '🎵',
          deca: getPersonePoOktavi(nivo).map((p) => {
            const cvor = neuro.cvorovi.find((c) => c.personaId === p.id);
            return `${p.ikona} ${p.naziv} (${cvor?.sinapse.length ?? 0} sin, akt: ${cvor?.aktivacija ?? 0})`;
          }),
        };
      }),
    },
  },
  {
    id: 'omega-lista',
    tip: 'lista',
    naslov: '⚡ Arhitektura sistema',
    redosled: 9,
    podaci: {
      stavke: [
        { ikona: '💀', naslov: 'Skeleton faza', opis: 'Priprema layout-a sa skeleton placeholder-ima za svaku oktavu pre učitavanja podataka' },
        { ikona: '🧮', naslov: 'Matrično jezgro', opis: `8×8 matrica sekvencionih odaziva — ${matrica.aktivnihVeza} aktivnih veza sa ekscitatornim, inhibitornim i modulatornim tipovima` },
        { ikona: '🧬', naslov: 'Neurološka mreža', opis: `${neuro.ukupnoCvorova} čvorova, ${neuro.ukupnoSinapsi} sinapsi — intra-oktavne, inter-oktavne i povratne veze` },
        { ikona: '🔄', naslov: 'Elastična sinhronizacija', opis: '5 faza po oktavi: skeleton → init → obrada → sync → završeno, sa težinskim faktorima' },
        { ikona: '♻️', naslov: 'Povratna petlja', opis: 'Evolucija (okt 8) → Temelj (okt 1) — modulatorni odaziv jačine 0.7 za kontinuirani napredak' },
        { ikona: '📡', naslov: 'API pristup', opis: 'GET /api/omega-ai za programski pristup dispatch + matrica + neuro sistemu' },
      ],
    },
  },
  {
    id: 'omega-cta',
    tip: 'cta',
    naslov: '🚀 OMEGA AI × SpajaPro Prompt — Kompletni sistem',
    redosled: 10,
    podaci: {
      opis: '21 AI persona × SpajaPro Prompt × 8 oktava × matrično jezgro × neurološka mreža = autonomni ekosistem.',
      stavke: [
        { naziv: 'Persone', vrednost: omegaPersone.length, ikona: '👥' },
        { naziv: 'Matrica', vrednost: `${matrica.aktivnihVeza} veza`, ikona: '🧮' },
        { naziv: 'Sinapse', vrednost: neuro.ukupnoSinapsi, ikona: '🧬' },
        { naziv: 'SpajaPro', vrednost: 'v6-15', ikona: '🌟' },
      ],
      dugmad: [
        { tekst: 'Prompt Sistem', href: '/prompt' },
        { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
        { tekst: 'AI Platforma', href: '/ai-platforma', stil: 'sekundarno' },
      ],
    },
  },
];
