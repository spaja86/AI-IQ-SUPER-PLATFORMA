import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { polimerzacijaSekvence } from '@/lib/sekvence/polimerzacija-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Polimerzacija',
  description: `Polimerzacija — lančano vezivanje i kohezija procesnih jedinica — ${KOMPANIJA}`,
};

export default function PolimerzacijaPage() {
  return <StranicaRenderer sekvence={polimerzacijaSekvence} />;
}
