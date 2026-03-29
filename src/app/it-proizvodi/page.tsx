import { StranicaRenderer } from '@/components/sekvence';
import { itProizvodiSekvence } from '@/lib/sekvence/it-proizvodi-page';

export default function ITProizvodi() {
  return <StranicaRenderer sekvence={itProizvodiSekvence} />;
}
