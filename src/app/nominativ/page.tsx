import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { nominativSekvence } from '@/lib/sekvence/nominativ-page';

export const metadata: Metadata = {
  title: 'NOMINATIV — povezani modul',
  description: 'Povezana tema uz AKUZATIV modul.',
};

export default function NominativPage() {
  return <StranicaRenderer sekvence={nominativSekvence} />;
}
