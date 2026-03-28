import { StranicaRenderer } from '@/components/sekvence';
import { promptSekvence } from '@/lib/sekvence/prompt-page';

export default function PromptPage() {
  return <StranicaRenderer sekvence={promptSekvence} />;
}
