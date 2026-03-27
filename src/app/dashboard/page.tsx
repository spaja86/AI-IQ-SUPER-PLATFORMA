import { StranicaRenderer } from '@/components/sekvence';
import { dashboardSekvence } from '@/lib/sekvence/dashboard';

export default function Dashboard() {
  return <StranicaRenderer sekvence={dashboardSekvence} />;
}
