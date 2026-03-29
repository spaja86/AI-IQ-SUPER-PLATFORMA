import { StranicaRenderer } from '@/components/sekvence';
import { autoPopravkaSekvence } from '@/lib/sekvence/auto-popravka-page';

export default function AutoPopravkaPage() {
  return <StranicaRenderer sekvence={autoPopravkaSekvence} />;
}
