import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { dashboardSekvence } from '@/lib/sekvence/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Statistika i stanje ekosistema — kontrolna tabla',
};

export default function Dashboard() {
  return <StranicaRenderer sekvence={dashboardSekvence} />;
}
