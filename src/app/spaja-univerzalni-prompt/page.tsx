import { StranicaRenderer } from '@/components/sekvence';
import { spajaUniverzalniPromptSekvence } from '@/lib/sekvence/spaja-univerzalni-prompt-page';

export default function SpajaUniverzalniPrompt() {
  return <StranicaRenderer sekvence={spajaUniverzalniPromptSekvence} />;
}
