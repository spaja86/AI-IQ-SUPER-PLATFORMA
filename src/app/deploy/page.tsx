import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { deploySekvence } from '@/lib/sekvence/deploy-page';

export const metadata: Metadata = {
  title: 'Deploy',
  description: 'Status deploy-a svih platformi na Vercel',
};

export default function Deploy() {
  return <StranicaRenderer sekvence={deploySekvence} />;
}
