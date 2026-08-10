import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getEkspresSekvence } from '@/lib/sekvence/ekspres-page';

export const metadata: Metadata = {
  title: 'EKSPRES — Ekspresni Operativni Readiness Engine',
  description: 'Cross-domain engine za 4 operativna domena readiness-a: brzina, pouzdanost, automatizacija i kvalitet izlaza.',
};

export default function EkspresPage() {
  const sekvence = getEkspresSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
