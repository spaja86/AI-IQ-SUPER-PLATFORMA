import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { vektorizacijaSekvence } from '@/lib/sekvence/vektorizacija-page';

export const metadata: Metadata = {
  title: 'Vektorizacija',
  description: `Vektorizacija — transformacija procesnog prostora i projekcija multi-dimenzionalnih entiteta — ${KOMPANIJA}`,
};

export default function VektorizacijaPage() {
  return <StranicaRenderer sekvence={vektorizacijaSekvence} />;
}
