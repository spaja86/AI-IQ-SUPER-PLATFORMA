import { StranicaRenderer } from '@/components/sekvence';
import { spajaProSekvence } from '@/lib/sekvence/spaja-pro-page';

export default function SpajaProPage() {
  return <StranicaRenderer sekvence={spajaProSekvence} />;
}
