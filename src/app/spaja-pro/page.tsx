import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaProSekvence } from '@/lib/sekvence/spaja-pro-page';

export const metadata: Metadata = {
  title: 'SpajaPro',
  description: 'SpajaPro Engine verzije 6-15',
};

export default function SpajaProPage() {
  return <StranicaRenderer sekvence={spajaProSekvence} />;
}
