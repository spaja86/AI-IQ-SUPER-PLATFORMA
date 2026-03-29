import { StranicaRenderer } from '@/components/sekvence';
import { kompanijaSekvence } from '@/lib/sekvence/kompanija-page';

export default function KompanijaPage() {
  return <StranicaRenderer sekvence={kompanijaSekvence} />;
}
