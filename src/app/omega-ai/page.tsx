import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { omegaAISekvence } from '@/lib/sekvence/omega-ai-page';

export const metadata: Metadata = {
  title: 'OMEGA AI',
  description: '21 OMEGA AI persona u 8 oktava',
};

export default function OmegaAI() {
  return <StranicaRenderer sekvence={omegaAISekvence} />;
}
