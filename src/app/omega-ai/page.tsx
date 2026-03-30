import { StranicaRenderer } from '@/components/sekvence';
import { omegaAISekvence } from '@/lib/sekvence/omega-ai-page';

export default function OmegaAI() {
  return <StranicaRenderer sekvence={omegaAISekvence} />;
}
