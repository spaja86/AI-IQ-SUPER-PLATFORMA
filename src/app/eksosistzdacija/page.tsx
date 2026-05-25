import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { eksosistzdacijaSekvence } from '@/lib/sekvence/eksosistzdacija-page';

export const metadata: Metadata = {
  title: 'Eksosistzdacija',
  description: 'Eksosistzdacija — modul za povezivanje i konsolidaciju ekosistemskih tokova',
};

export default function EksosistzdacijaPage() {
  return <StranicaRenderer sekvence={eksosistzdacijaSekvence} />;
}
