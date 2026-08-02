import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { dativSekvence } from '@/lib/sekvence/dativ-page';

export const metadata: Metadata = {
  title: 'DATIV — povezani modul',
  description: 'Povezana tema uz AKUZATIV modul.',
};

export default function DativPage() {
  return <StranicaRenderer sekvence={dativSekvence} />;
}
