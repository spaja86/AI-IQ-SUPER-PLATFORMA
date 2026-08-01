import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { egzistencijaPravilnikSekvence } from '@/lib/sekvence/egzistencija-pravilnik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Egzistencija Pravilnik',
  description: `Pravilnik životnog ciklusa i tokova resursa (Priliv / Odliv) na platformi — ${KOMPANIJA}`,
};

export default function EgzistencijaPravilnikPage() {
  return <StranicaRenderer sekvence={egzistencijaPravilnikSekvence} />;
}
