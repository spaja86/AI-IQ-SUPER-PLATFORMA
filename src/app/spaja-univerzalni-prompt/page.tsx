import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaUniverzalniPromptSekvence } from '@/lib/sekvence/spaja-univerzalni-prompt-page';

export const metadata: Metadata = {
  title: 'SPAJA Univerzalni Prompt',
  description: 'SPAJA Univerzalni Prompt — 12 kategorija, 36 promptova',
};

export default function SpajaUniverzalniPrompt() {
  return <StranicaRenderer sekvence={spajaUniverzalniPromptSekvence} />;
}
