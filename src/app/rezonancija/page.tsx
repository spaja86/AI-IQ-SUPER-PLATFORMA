import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { rezonancijaSekvence } from '@/lib/sekvence/rezonancija-page';

export const metadata: Metadata = {
  title: 'Rezonancija',
  description: `Rezonancija — usklađivanje frekvencija i stabilizacija oscilatornih tokova — ${KOMPANIJA}`,
};

export default function RezonancijaPage() {
  return <StranicaRenderer sekvence={rezonancijaSekvence} />;
}
