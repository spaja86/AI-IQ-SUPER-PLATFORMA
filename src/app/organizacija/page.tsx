import { StranicaRenderer } from '@/components/sekvence';
import { organizacijaSekvence } from '@/lib/sekvence/organizacija-page';

export default function OrganizacijaPage() {
  return <StranicaRenderer sekvence={organizacijaSekvence} />;
}
