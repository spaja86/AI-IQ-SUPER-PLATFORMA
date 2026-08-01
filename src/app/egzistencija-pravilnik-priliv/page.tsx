import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { egzistencijaPravilnikPrilivSekvence } from '@/lib/sekvence/egzistencija-pravilnik-priliv-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Egzistencija Pravilnik — Priliv',
  description: `Pravilnik prililva resursa: tipovi, limiti i validaciona pravila — ${KOMPANIJA}`,
};

export default function EgzistencijaPravilnikPrilivPage() {
  return <StranicaRenderer sekvence={egzistencijaPravilnikPrilivSekvence} />;
}
