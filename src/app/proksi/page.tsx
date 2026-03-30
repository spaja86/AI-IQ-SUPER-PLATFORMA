import { StranicaRenderer } from '@/components/sekvence';
import { proksiSekvence } from '@/lib/sekvence/proksi-page';

export default function Proksi() {
  return <StranicaRenderer sekvence={proksiSekvence} />;
}
