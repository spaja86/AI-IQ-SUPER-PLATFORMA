import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaProSekvence } from '@/lib/sekvence/spaja-pro-page';
import SpajaProPromptKonzolaWrapper from '@/components/SpajaProPromptKonzolaWrapper';

export const metadata: Metadata = {
  title: 'SpajaPro Engine — Prompt Konzola',
  description: 'SpajaPro Engine verzije 6-15 sa aktivnim Prompt UI-jem',
};

export default function SpajaProPage() {
  return (
    <>
      <StranicaRenderer sekvence={spajaProSekvence} />
      <SpajaProPromptKonzolaWrapper />
    </>
  );
}
