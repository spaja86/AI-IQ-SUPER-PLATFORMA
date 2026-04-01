import { StranicaRenderer } from '@/components/sekvence';
import { proksiWifiAntenaSekvence } from '@/lib/sekvence/proksi-wifi-antena-page';

export default function ProksiWifiAntena() {
  return <StranicaRenderer sekvence={proksiWifiAntenaSekvence} />;
}
