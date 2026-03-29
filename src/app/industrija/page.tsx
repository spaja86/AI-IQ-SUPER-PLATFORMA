import { StranicaRenderer } from '@/components/sekvence';
import { industrijaSekvence } from '@/lib/sekvence/industrija';

export default function Industrija() {
  return <StranicaRenderer sekvence={industrijaSekvence} />;
}
