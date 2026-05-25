import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { palasterizacijaSekvence } from '@/lib/sekvence/palasterizacija-page';

export const metadata: Metadata = {
  title: 'Palasterizacija',
  description: 'Palasterizacija — novi platformski modul za standardizaciju i stabilizaciju procesa',
};

export default function PalasterizacijaPage() {
  return <StranicaRenderer sekvence={palasterizacijaSekvence} />;
}
