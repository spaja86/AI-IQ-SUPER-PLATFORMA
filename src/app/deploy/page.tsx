import { StranicaRenderer } from '@/components/sekvence';
import { deploySekvence } from '@/lib/sekvence/deploy-page';

export default function Deploy() {
  return <StranicaRenderer sekvence={deploySekvence} />;
}
