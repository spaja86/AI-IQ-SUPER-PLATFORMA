import type { Sekvenca } from '@/lib/types';
import { getGoLiveDigitalnaIndustrija } from '@/lib/go-live-digitalna-industrija';

const goLive = getGoLiveDigitalnaIndustrija();

export const goLiveDigitalnaIndustrijaSekvence: Sekvenca[] = [
  {
    id: 'go-live-hero',
    tip: 'hero',
    naslov: '🚀 Zvaničan start Digitalne Industrije',
    podnaslov: 'Branding · pretplate · PDF · template · kampanje',
    ikona: '🚀',
    redosled: 1,
    podaci: {
      opis: 'Go-live površina objedinjuje reklamni materijal, rollout faze, KPI ciljeve i kanale lansiranja.',
      dugmad: [
        { tekst: 'Reklame & Partnerstva', href: '/reklame-i-partnerstva' },
        { tekst: 'Start Pretplate', href: '/start-pretplate', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'go-live-faze',
    tip: 'lista',
    naslov: '🗺️ Rollout faze',
    redosled: 2,
    podaci: {
      stavke: goLive.faze.map((faza, index) => ({
        ikona: '✅',
        naslov: `Faza ${index + 1}`,
        opis: faza,
      })),
    },
  },
  {
    id: 'go-live-kpi',
    tip: 'tabela',
    naslov: '📈 Launch KPI',
    redosled: 3,
    podaci: {
      zaglavlje: ['KPI', 'Cilj'],
      redovi: goLive.kpi.map((stavka) => [stavka.naziv, stavka.cilj]),
    },
  },
  {
    id: 'go-live-assets',
    tip: 'tekst',
    naslov: '📣 Reklamni materijal i kanali',
    redosled: 4,
    podaci: {
      sadrzaj: 'Go-live koristi postojeće reklamne i Digitalna Industrija module kao bazu za javni start i B2B outreach.',
      istaknuteStavke: [...goLive.materijali, ...goLive.kanali],
    },
  },
];
