import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { demodulacijaSekvence } from '@/lib/sekvence/demodulacija-page';

export const metadata: Metadata = {
  title: 'Demodulacija',
  description: `Demodulacija — rekonstrukcija modulisanih tokova i verifikacija kvaliteta izlaza — ${KOMPANIJA}`,
};

export default function DemodulacijaPage() {
  return <StranicaRenderer sekvence={demodulacijaSekvence} />;
}
