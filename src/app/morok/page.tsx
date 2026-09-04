import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getMorokSekvence } from '@/lib/sekvence/morok-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'MOROK — Modularna Orkestracija Ritmova i Operativnog Kapaciteta',
  description: `Cross-domain operativno-ritmički kapacitetni engine kroz 6 domena za ${KOMPANIJA}.`,
};

export default function MorokPage() {
  const sekvence = getMorokSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
