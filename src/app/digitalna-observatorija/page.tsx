import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaObservatorijaSekvence } from '@/lib/sekvence/digitalna-observatorija-page';

export const metadata: Metadata = {
  title: 'Digitalna Observatorija',
  description: 'Standalone observatorijum modul za astronomska posmatranja, sesije i alarme',
};

export default function DigitalnaObservatorijaPage() {
  return <StranicaRenderer sekvence={digitalnaObservatorijaSekvence} />;
}
