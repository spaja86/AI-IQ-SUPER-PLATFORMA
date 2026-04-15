import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { glavniEndzinSekvence } from '@/lib/sekvence/glavni-endzin-page';
import GlavniEndzinDashboard from '@/components/GlavniEndzinDashboard';

export const metadata: Metadata = {
  title: 'Glavni Endžin Digitalne Industrije',
  description:
    'Glavni Endžin koji spaja SVE endžine u jedan veliki unificirani endžin. ' +
    'Automatski sklapa gotove proizvode i igrice, unapređuje sve platforme i sva poslovanja.',
};

export default function GlavniEndzin() {
  return (
    <div className="space-y-8">
      <GlavniEndzinDashboard />
      <StranicaRenderer sekvence={glavniEndzinSekvence} />
    </div>
  );
}
