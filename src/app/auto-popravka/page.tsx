import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { autoPopravkaSekvence } from '@/lib/sekvence/auto-popravka-page';

export const metadata: Metadata = {
  title: 'Auto-Popravka',
  description: 'Autonomni sistem za popravku i dijagnostiku platforme',
};

export default function AutoPopravkaPage() {
  return <StranicaRenderer sekvence={autoPopravkaSekvence} />;
}
