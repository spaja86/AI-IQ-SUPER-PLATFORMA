import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { egzistencijaPravilnikOdlivSekvence } from '@/lib/sekvence/egzistencija-pravilnik-odliv-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Egzistencija Pravilnik — Odliv',
  description: `Pravilnik odliva resursa: tipovi, limiti i validaciona pravila — ${KOMPANIJA}`,
};

export default function EgzistencijaPravilnikOdlivPage() {
  return <StranicaRenderer sekvence={egzistencijaPravilnikOdlivSekvence} />;
}
