import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getEkspritingSekvence } from '@/lib/sekvence/ekspriting-page';

export const metadata: Metadata = {
  title: 'EKSPRITING — Ekspresni Skripting i Pisanje Engine',
  description: 'Cross-domain engine za 5 domena ekspresnog skriptinga i pisanja: ekspresna sinteza, skripting logika, pisanje toka, iterativno uredivanje i tokenizacija sadrzaja.',
};

export default function EkspritingPage() {
  const sekvence = getEkspritingSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
