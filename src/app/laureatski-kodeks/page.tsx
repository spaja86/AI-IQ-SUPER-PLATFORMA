import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiKodeksSekvence } from '@/lib/sekvence/laureatski-kodeks-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI KODEKS',
  description: `Kodeks matrica laureatskog centra i koherentnost kodeks impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiKodeks() {
  return (
    <AuthGuard stranica="LAUREATSKI KODEKS">
      <StranicaRenderer sekvence={laureatskiKodeksSekvence} />
    </AuthGuard>
  );
}
