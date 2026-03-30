import { StranicaRenderer } from '@/components/sekvence';
import { menjacnicaSekvence } from '@/lib/sekvence/menjacnica-page';

export default function MenjacnicaPage() {
  return <StranicaRenderer sekvence={menjacnicaSekvence} />;
}
