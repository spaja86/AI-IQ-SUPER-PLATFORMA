import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaPlatformaSekvence } from '@/lib/sekvence/digitalna-platforma-page';

export default function DigitalnaPlatformaLoading() {
  return <StranicaRenderer sekvence={digitalnaPlatformaSekvence} skeleton />;
}
