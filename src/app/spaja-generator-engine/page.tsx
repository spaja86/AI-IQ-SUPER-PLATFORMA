import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaGeneratorEngineSekvence } from '@/lib/sekvence/spaja-generator-engine-page';

export const metadata: Metadata = {
  title: 'SPAJA Generator za Endžine',
  description: 'SPAJA Generator za Endžine — engine generator za AI IQ SUPER PLATFORMA',
};

export default function SpajaGeneratorEnginePage() {
  return <StranicaRenderer sekvence={spajaGeneratorEngineSekvence} />;
}
