import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { promptSekvence } from '@/lib/sekvence/prompt-page';
import SpajaProPromptKonzolaWrapper from '@/components/SpajaProPromptKonzolaWrapper';

export const metadata: Metadata = {
  title: 'Prompt — SpajaPro Konzola',
  description: 'Aktivni Prompt UI sa SpajaPro 6-15 engine-om — programirajte sa promptovima',
};

export default function PromptPage() {
  return (
    <>
      <SpajaProPromptKonzolaWrapper />
      <StranicaRenderer sekvence={promptSekvence} />
    </>
  );
}
