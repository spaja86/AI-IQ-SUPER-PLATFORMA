import { StranicaRenderer } from '@/components/sekvence';
import { dimenzijeSekvence } from '@/lib/sekvence/dimenzije-page';

export default function Dimenzije() {
  return <StranicaRenderer sekvence={dimenzijeSekvence} />;
}
