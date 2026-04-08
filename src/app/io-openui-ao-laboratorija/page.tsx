import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ioOpenUIAOLabSekvence } from '@/lib/sekvence/io-openui-ao-laboratorija-page';

export const metadata: Metadata = {
  title: 'IOOpenUIAO Laboratorija za Simulacije',
  description: 'IOOpenUIAO Laboratorija za Simulacije — simulaciona laboratorija za SPAJA ekosistem',
};

export default function IOOpenUIAOLabPage() {
  return <StranicaRenderer sekvence={ioOpenUIAOLabSekvence} />;
}
