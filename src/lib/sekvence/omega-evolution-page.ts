import type { Sekvenca } from '@/lib/types';
import { getOmegaEvolutionPregled } from '@/lib/omega-evolution';

export function getOmegaEvolutionSekvence(): Sekvenca[] {
  const pregled = getOmegaEvolutionPregled();

  return [
    {
      id: 'omega-evolution-hero',
      tip: 'hero',
      naslov: '🧬 OmegaEvolution — Evolucija Platforme',
      podnaslov: 'Unifikovani evolucioni hub: OMEGA Evolucija Motor + SpajaPro 13 + Neuronska Evolucija + SpajaNikOpenEvolution brend',
      ikona: '🧬',
      redosled: 1,
      podaci: {
        opis: `Zdravlje platforme: ${pregled.status.platformaZdravlje}% • Ciklusi: ${pregled.status.ukupnoCiklusa} • SpajaPro 13 fitness cilj: ${pregled.status.spajaPro13CiljniFitness}`,
        dugmad: [
          { tekst: 'API: OmegaEvolution', href: '/api/omega-evolution' },
          { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
          { tekst: 'Evolucija Motor', href: '/api/evolucija', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'omega-evolution-statistika',
      tip: 'statistika',
      naslov: '📊 Evolucija u brojevima',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Zdravlje sistema', vrednost: `${pregled.status.platformaZdravlje}%`, ikona: '❤️' },
          { naziv: 'Ukupno ciklusa', vrednost: pregled.status.ukupnoCiklusa, ikona: '♻️' },
          { naziv: 'Uspesni ciklusi', vrednost: pregled.status.uspesnihCiklusa, ikona: '✅' },
          { naziv: 'OMEGA persone', vrednost: pregled.status.ukupnoPersona, ikona: '🧠' },
          { naziv: 'Oktave', vrednost: pregled.status.ukupnoOktava, ikona: '🎵' },
          { naziv: 'Neuronski slojevi', vrednost: pregled.status.neuronskiSlojevi, ikona: '🧬' },
          { naziv: 'Neuronski ciklusi', vrednost: pregled.status.neuronskiCiklusi, ikona: '🔁' },
          { naziv: 'SpajaPro meta-promptovi', vrednost: pregled.status.spajaPro13MetaPromptovi, ikona: '💬' },
        ],
      },
    },
    {
      id: 'omega-evolution-engine',
      tip: 'tabela',
      naslov: '⚙️ Evolucija Engine status',
      redosled: 3,
      podaci: {
        zaglavlje: ['Parametar', 'Vrednost'],
        redovi: [
          ['Verzija', pregled.status.verzija],
          ['Cron interval', pregled.status.cronInterval],
          ['Max issue po danu', String(pregled.status.maxIssuePoDanu)],
          ['Auto-merge', pregled.status.autoMerge ? 'DA' : 'NE'],
          ['Poslednji ciklus', pregled.status.poslednjiCiklus ?? 'N/A'],
          ['Sledeci ciklus', pregled.status.sledeciCiklus ?? 'N/A'],
          ['Autofinish iteracija', String(pregled.status.autofinishIteracija)],
        ],
      },
    },
    {
      id: 'omega-evolution-spajapro-neuro',
      tip: 'kartice',
      naslov: '🧪 SpajaPro 13 + Neuronska evolucija',
      redosled: 4,
      podaci: {
        kartice: [
          {
            naslov: `SpajaPro ${pregled.status.spajaPro13Verzija} — ${pregled.spajaPro13.kodnoIme}`,
            opis: `${pregled.spajaPro13.naziv} • status: ${pregled.spajaPro13.status} • max tokena: ${pregled.spajaPro13.maxTokena}`,
            ikona: '🚀',
            oznake: [
              `maxGeneracija ${pregled.status.spajaPro13MaxGeneracija}`,
              `mutacija ${pregled.status.spajaPro13MutacijaRate}`,
              `fitness ${pregled.status.spajaPro13CiljniFitness}`,
              `metaPrompti ${pregled.status.spajaPro13MetaPromptovi}`,
            ],
          },
          {
            naslov: 'OMEGA Neuronska Evolucija',
            opis: `Genetski algoritam ${pregled.neuronskaEvolucija.genetskiAlgoritam} • mutacijska stopa ${pregled.neuronskaEvolucija.mutacijskaStopa}`,
            ikona: '🧠',
            oznake: pregled.neuronskaEvolucija.ciklusi.map((c) => `C${c.ciklus} ${c.tacnost} (${c.status})`),
          },
        ],
      },
    },
    {
      id: 'omega-evolution-brand-hub',
      tip: 'kartice',
      naslov: '📺 SpajaNikOpenEvolution Brand Hub',
      redosled: 5,
      podaci: {
        kartice: [
          {
            naslov: `${pregled.brand.prikazNaziv} (${pregled.brand.youtubeHandle})`,
            opis: `${pregled.brand.opis} URL: ${pregled.brand.youtubeUrl}`,
            ikona: '📺',
            oznake: pregled.brand.kategorijeSadrzaja,
          },
        ],
      },
    },
    {
      id: 'omega-evolution-connections',
      tip: 'lista',
      naslov: '🔗 Connections i endpointi',
      redosled: 6,
      podaci: {
        stavke: pregled.endpointi.map((endpoint) => `• ${endpoint}`),
      },
    },
  ];
}
