import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { menjacnicaNovcanikSekvence } from '@/lib/sekvence/menjacnica-novcanik-page';

export const metadata: Metadata = {
  title: 'AI IQ MENJAČNICA — Profesionalni Novčanik',
  description: 'Profesionalni kripto novčanik integrisan sa AI IQ Menjačnicom — portfolio, P&L, orderbook i settlement.',
};

export default function MenjacnicaNovcanikPage() {
  return <StranicaRenderer sekvence={menjacnicaNovcanikSekvence} />;
}
