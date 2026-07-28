import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getVukobatSekvence } from '@/lib/sekvence/vukobat-page';

export const metadata: Metadata = {
  title: 'VUKOBAT — Visoko Usklađena Komandna Orkestracija Budnosti, Analitike i Tokova',
  description: 'Cross-domain operativni engine za budnost, analitiku, komandnu usklađenost i automatizaciju platforme.',
};

export default function VukobatPage() {
  const sekvence = getVukobatSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
