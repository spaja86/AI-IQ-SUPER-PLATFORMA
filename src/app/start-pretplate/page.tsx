import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { startPretplateSekvence } from '@/lib/sekvence/start-pretplate-page';

export const metadata: Metadata = {
  title: 'Start Pretplate',
  description: 'Javna startna površina za planove, checkout, portal i billing readiness.',
};

export default function StartPretplatePage() {
  return <StranicaRenderer sekvence={startPretplateSekvence} />;
}
