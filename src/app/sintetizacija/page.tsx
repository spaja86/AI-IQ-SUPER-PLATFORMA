import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { sintetizacijaSekvence } from '@/lib/sekvence/sintetizacija-page';

export const metadata: Metadata = {
  title: 'Sintetizacija',
  description: `Sintetizacija — sinteza i integracija procesnih entiteta u koherentne strukture — ${KOMPANIJA}`,
};

export default function SintetizacijaPage() {
  return <StranicaRenderer sekvence={sintetizacijaSekvence} />;
}
