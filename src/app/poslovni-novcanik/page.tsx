import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { poslovniNovcanikSekvence } from '@/lib/sekvence/poslovni-novcanik-page';

export const metadata: Metadata = {
  title: 'Poslovni Novčanik',
  description: 'Wallet modul povezan sa AI IQ World Bank skeletonom i platnim tokovima.',
};

export default function PoslovniNovcanikPage() {
  return <StranicaRenderer sekvence={poslovniNovcanikSekvence} />;
}
