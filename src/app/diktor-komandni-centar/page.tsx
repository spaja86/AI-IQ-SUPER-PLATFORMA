import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { diktorCommandCenterSekvence } from '@/lib/sekvence/diktor-command-center-page';

export const metadata: Metadata = {
  title: 'DIKTOR Komandni Centar',
  description: 'Premium dark-cyber / glass command-center template za SPAJA B2B orkestraciju.',
};

export default function DiktorKomandniCentarPage() {
  return <StranicaRenderer sekvence={diktorCommandCenterSekvence} />;
}
