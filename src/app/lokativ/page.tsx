import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { lokativSekvence } from '@/lib/sekvence/lokativ-page';

export const metadata: Metadata = {
  title: 'LOKATIV — povezani modul',
  description: 'Povezana tema unutar PADEŽI paketa za mesto, temu i predloške odnose.',
};

export default function LokativPage() {
  return <StranicaRenderer sekvence={lokativSekvence} />;
}
