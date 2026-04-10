import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { omegaAiSuportSekvence } from '@/lib/sekvence/omega-ai-suport-page';

export const metadata: Metadata = {
  title: 'OMEGA AI Maksimalni Suport',
  description:
    'Maksimalni suport na OMEGA nivou — 21 persona, telefoni, mejlovi, dispeč sa korisnicima',
};

export default function OmegaAiSuportPage() {
  return <StranicaRenderer sekvence={omegaAiSuportSekvence} />;
}
