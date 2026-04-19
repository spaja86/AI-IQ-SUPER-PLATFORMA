import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { omegaAISekvence } from '@/lib/sekvence/omega-ai-page';
import { OMEGA_AI_PERSONA_COUNT, OMEGA_AI_OKTAVA_COUNT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'OMEGA AI',
  description: `${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona u ${OMEGA_AI_OKTAVA_COUNT} oktava`,
};

export default function OmegaAI() {
  return <StranicaRenderer sekvence={omegaAISekvence} />;
}
