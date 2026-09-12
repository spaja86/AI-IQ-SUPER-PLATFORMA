import type { Sekvenca } from '@/lib/types';
import { getStartPretplateData } from '@/lib/start-pretplate';

const data = getStartPretplateData();

export const startPretplateSekvence: Sekvenca[] = [
  {
    id: 'start-pretplate-hero',
    tip: 'hero',
    naslov: '💳 Startuj sve pretplate',
    podnaslov: 'Checkout · portal · status · reconcile · onboarding',
    ikona: '💳',
    redosled: 1,
    podaci: {
      opis: 'Jedinstvena startna površina za javni subscription tok: pregled planova, readiness check, billing nadzor i Digitalna Industrija go/no-go model.',
      dugmad: [
        { tekst: 'Pricing', href: '/pricing' },
        { tekst: 'DIKTOR komandni centar', href: '/diktor-komandni-centar', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'start-pretplate-planovi',
    tip: 'tabela',
    naslov: '📦 Planovi i readiness',
    redosled: 2,
    podaci: {
      zaglavlje: ['Plan', 'Cena EUR', 'Stripe price', 'Chat limit', 'Ključne funkcije'],
      redovi: data.planovi.map((plan) => [
        plan.naziv,
        String(plan.cenaEur),
        plan.imaStripePrice ? 'konfigurisano' : 'nema Stripe price',
        String(plan.chatLimit),
        plan.funkcije.slice(0, 3).join(', '),
      ]),
    },
  },
  {
    id: 'start-pretplate-status',
    tip: 'lista',
    naslov: '🛡️ Status model i onboarding',
    redosled: 3,
    podaci: {
      stavke: [
        ...data.statusModel.map((status) => ({
          ikona: status.goNoGo === 'go' ? '✅' : '⛔',
          naslov: status.status,
          opis: status.opis,
        })),
        ...data.onboarding.map((korak) => ({
          ikona: '➡️',
          naslov: 'Onboarding',
          opis: korak,
        })),
      ],
    },
  },
  {
    id: 'start-pretplate-readiness',
    tip: 'tekst',
    naslov: '🔄 Billing readiness tok',
    redosled: 4,
    podaci: {
      sadrzaj: 'Pretplate se aktiviraju tek kada checkout, portal, status, reconcile i governance slojevi vrate konzistentan signal.',
      istaknuteStavke: data.readiness,
    },
  },
];
