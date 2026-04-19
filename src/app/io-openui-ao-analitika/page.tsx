import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ioOpenUIAOAnalitikaSekvence } from '@/lib/sekvence/io-openui-ao-analitika-page';
import { TOTAL_IGRICA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'IO/OPENUI/AO Analitika — Gaming + Laboratorija',
  description: `IO/OPENUI/AO Analitika — kombinovana analitika Gaming Platforme (${TOTAL_IGRICA} igrica) i Laboratorije za Simulacije (10 simulacija)`,
};

export default function IOOpenUIAOAnalitika() {
  return <StranicaRenderer sekvence={ioOpenUIAOAnalitikaSekvence} />;
}
