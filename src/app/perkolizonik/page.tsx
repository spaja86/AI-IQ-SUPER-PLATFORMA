import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { perkolizonikSekvence } from '@/lib/sekvence/perkolizonik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Perkolizonik',
  description: `Perkolizonik — operativna stabilizacija tokova i performansi sistema — ${KOMPANIJA}`,
};

export default function PerkolizonikPage() {
  return <StranicaRenderer sekvence={perkolizonikSekvence} />;
}

