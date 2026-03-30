import { StranicaRenderer } from '@/components/sekvence';
import { mobilnaMrezaSekvence } from '@/lib/sekvence/mobilna-mreza-page';

export default function MobilnaMreza() {
  return <StranicaRenderer sekvence={mobilnaMrezaSekvence} />;
}
