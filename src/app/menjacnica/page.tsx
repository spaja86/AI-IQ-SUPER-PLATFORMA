import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { menjacnicaSekvence } from '@/lib/sekvence/menjacnica-page';

export const metadata: Metadata = {
  title: 'Menjačnica',
  description: 'SPAJA Menjačnica platforma',
};

export default function MenjacnicaPage() {
  return <StranicaRenderer sekvence={menjacnicaSekvence} />;
}
