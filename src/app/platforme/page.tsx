import { StranicaRenderer } from '@/components/sekvence';
import { platformeSekvence } from '@/lib/sekvence/platforme-page';

export default function Platforme() {
  return <StranicaRenderer sekvence={platformeSekvence} />;
}
