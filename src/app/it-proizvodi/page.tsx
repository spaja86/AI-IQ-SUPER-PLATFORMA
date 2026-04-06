import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { itProizvodiSekvence } from '@/lib/sekvence/it-proizvodi-page';

export const metadata: Metadata = {
  title: 'IT Proizvodi',
  description: 'Svi IT proizvodi digitalne industrije',
};

export default function ITProizvodi() {
  return <StranicaRenderer sekvence={itProizvodiSekvence} />;
}
