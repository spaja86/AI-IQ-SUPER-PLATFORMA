import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { instrumentalSekvence } from '@/lib/sekvence/instrumental-page';

export const metadata: Metadata = {
  title: 'INSTRUMENTAL — povezani modul',
  description: 'Povezana tema unutar PADEŽI paketa za sredstvo, način i pratnju.',
};

export default function InstrumentalPage() {
  return <StranicaRenderer sekvence={instrumentalSekvence} />;
}
