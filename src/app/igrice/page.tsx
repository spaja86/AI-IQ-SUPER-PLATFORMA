import { StranicaRenderer } from '@/components/sekvence';
import { igriceSekvence } from '@/lib/sekvence/igrice-page';

export default function Igrice() {
  return <StranicaRenderer sekvence={igriceSekvence} />;
}
