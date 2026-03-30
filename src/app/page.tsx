import { StranicaRenderer } from '@/components/sekvence';
import { pocetnaSekvence } from '@/lib/sekvence/pocetna';

export default function Home() {
  return <StranicaRenderer sekvence={pocetnaSekvence} />;
}
