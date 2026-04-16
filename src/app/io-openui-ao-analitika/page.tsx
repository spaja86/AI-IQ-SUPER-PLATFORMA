import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ioOpenUIAOAnalitikaSekve } from '@/lib/sekvence/io-openui-ao-analitika-page';

export const metadata: Metadata = {
  title: 'IO/OPENUI/AO Analitika — Gaming + Laboratorija',
  description: 'IO/OPENUI/AO Analitika — kombinovana analitika Gaming Platforme (95 igrica) i Laboratorije za Simulacije (10 simulacija)',
};

export default function IOOpenUIAOAnalitika() {
  return <StranicaRenderer sekvence={ioOpenUIAOAnalitikaSekve} />;
}
