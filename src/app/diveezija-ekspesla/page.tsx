import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getDivezijaEkspeslaSekvence } from '@/lib/sekvence/diveezija-ekspesla-page';

export const metadata: Metadata = {
  title: 'DIVEEZIJA EKSPESLA — Dinamična Inteligentna Vektorizovana Ekspanzija i Ekspresija',
  description: 'Cross-domain engine za 6 domena ekspresne logike i automatizacije: divergencija, iteracija, vektorizacija, ekspanzija, ekspresna logika i automatizacija.',
};

export default function DivezijaEkspeslaPage() {
  const sekvence = getDivezijaEkspeslaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
