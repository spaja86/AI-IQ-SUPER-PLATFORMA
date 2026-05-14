import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiKodekSekvence } from '@/lib/sekvence/laureatski-kodek-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI KODEK',
  description: `Kodek matrica laureatskog centra i koherentnost kodek impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiKodek() {
  return (
    <AuthGuard stranica="LAUREATSKI KODEK">
      <StranicaRenderer sekvence={laureatskiKodekSekvence} />
    </AuthGuard>
  );
}
