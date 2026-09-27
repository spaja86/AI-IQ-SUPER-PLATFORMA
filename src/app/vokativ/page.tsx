import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { vokativSekvence } from '@/lib/sekvence/vokativ-page';

export const metadata: Metadata = {
  title: 'VOKATIV — povezani modul',
  description: 'Povezana tema unutar PADEŽI paketa za dozivanje i direktno obraćanje.',
};

export default function VokativPage() {
  return <StranicaRenderer sekvence={vokativSekvence} />;
}
