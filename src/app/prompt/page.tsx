import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { promptSekvence } from '@/lib/sekvence/prompt-page';

export const metadata: Metadata = {
  title: 'Prompt',
  description: 'Prompt sistem sa 28 promptova u 10 kategorija',
};

export default function PromptPage() {
  return <StranicaRenderer sekvence={promptSekvence} />;
}
