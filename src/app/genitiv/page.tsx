import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { genitivSekvence } from '@/lib/sekvence/genitiv-page';

export const metadata: Metadata = {
  title: 'GENITIV — povezani modul',
  description: 'Povezana tema uz AKUZATIV modul.',
};

export default function GenitivPage() {
  return <StranicaRenderer sekvence={genitivSekvence} />;
}
