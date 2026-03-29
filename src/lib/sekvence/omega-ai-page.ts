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
    naslov: '🧠 OMEGA AI',
    podnaslov: '21 AI Persona — Oktavni dispatch + Matrično jezgro + Neurološka mreža',
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis: 'OMEGA AI je sistem od 21 specijalizovane AI persone organizovanih u 8 oktavnih nivoa. Sekvencionalna sistematizacija eksplicitira matrično jezgro (8×8 matrica odaziva) sa neurološkom mrežom sinaptičkih veza između persona.',
      dugmad: [
        { tekst: 'AI Platforma', href: '/ai-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'omega-tekst',
    tip: 'tekst',
    naslov: 'Sekvencionalna sistematizacija u oktavnom sistemu',
    redosled: 2,
    podaci: {
      sadrzaj: `OMEGA AI koristi trostruki sistem: elastičnu sinhronizaciju (skeleton → zavrseno), matrično jezgro (8×8 matrica sekvencionih odaziva) i neurološku mrežu (sinaptičke veze između persona).

Matrično jezgro modeluje interakcije između oktava — ekscitatorni odazivi (napred u sekvenci), inhibitorni (nazad — feedback), i modulatorni (samo-odaziv + petlja Evolucija↔Temelj). Svaka veza ima jačinu (0–1) i latenciju.

Neurološka mreža modeluje persona kao čvorove sa sinaptičkim vezama: intra-oktavne (unutar iste oktave), inter-oktavne (ka susednim) i povratne (Evolucija↔Temelj). Svaki čvor ima nivo aktivacije prema prioritetu.`,
      istaknuteStavke: [
        `Matrično jezgro: ${matrica.dimenzija}×${matrica.dimenzija} matrica, ${matrica.aktivnihVeza} aktivnih veza, prosečna jačina ${matrica.prosecnaJacina}`,
        `Neurološka mreža: ${neuro.ukupnoCvorova} čvorova, ${neuro.ukupnoSinapsi} sinapsi, prosečna aktivacija ${neuro.prosecnaAktivacija}`,
        `Elastična sinhronizacija: ${sync.oktave.length} oktava × 5 faza = sekvencijalni mod`,
        'Petlja Evolucija↔Temelj: modulatorni odaziv sa jačinom 0.7 za kontinuirani napredak',
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
    naslov: '👥 Sve OMEGA AI Persone',
    redosled: 7,
    podaci: {
      kartice: omegaPersone.map((p) => {
        const cvor = neuro.cvorovi.find((c) => c.personaId === p.id);
        return {
          naslov: `${p.ikona} ${p.naziv}`,
          opis: p.opis,
          ikona: p.ikona,
          oznake: [
            `Okt. ${p.oktavniNivo}`,
            p.kategorija,
            p.prioritet,
            `${cvor?.sinapse.length ?? 0} sinapsi`,
            `akt: ${cvor?.aktivacija ?? 0}`,
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
    naslov: '🚀 OMEGA AI — Kompletni sistem',
    redosled: 10,
    podaci: {
      opis: '21 AI persona × 8 oktava × matrično jezgro × neurološka mreža = sekvencionalna sistematizacija.',
      stavke: [
        { naziv: 'Persone', vrednost: omegaPersone.length, ikona: '👥' },
        { naziv: 'Matrica', vrednost: `${matrica.aktivnihVeza} veza`, ikona: '🧮' },
        { naziv: 'Sinapse', vrednost: neuro.ukupnoSinapsi, ikona: '🧬' },
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
