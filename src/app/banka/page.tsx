import { StranicaRenderer } from '@/components/sekvence';
import { bankaSekvence } from '@/lib/sekvence/banka-page';

export default function BankaPage() {
  return <StranicaRenderer sekvence={bankaSekvence} />;
}
