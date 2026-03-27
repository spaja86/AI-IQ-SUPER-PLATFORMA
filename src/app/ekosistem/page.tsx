import { StranicaRenderer } from '@/components/sekvence';
import { ekosistemSekvence } from '@/lib/sekvence/ekosistem-page';

export default function Ekosistem() {
  return <StranicaRenderer sekvence={ekosistemSekvence} />;
}
