import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiTaktSekvence } from '@/lib/sekvence/laureatski-takt-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI TAKT',
  description: `Taktička matrica laureatskog centra i koherentnost metra sistema — ${KOMPANIJA}`,
};

export default function LaureatskiTakt() {
  return (
    <AuthGuard stranica="LAUREATSKI TAKT">
      <StranicaRenderer sekvence={laureatskiTaktSekvence} />
    </AuthGuard>
  );
}
