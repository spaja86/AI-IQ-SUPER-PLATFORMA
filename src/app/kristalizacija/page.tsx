import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { kristalizacijaSekvence } from '@/lib/sekvence/kristalizacija-page';

export const metadata: Metadata = {
  title: 'Kristalizacija',
  description: `Kristalizacija — stabilizacija procesnog jezgra i purifikacija izlaznih tokova — ${KOMPANIJA}`,
};

export default function KristalizacijaPage() {
  return <StranicaRenderer sekvence={kristalizacijaSekvence} />;
}
