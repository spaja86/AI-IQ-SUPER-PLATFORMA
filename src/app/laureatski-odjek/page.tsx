import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiOdjekSekvence } from '@/lib/sekvence/laureatski-odjek-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI ODJEK',
  description: `Odječna matrica laureatskog centra i koherentnost rezonantnih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiOdjek() {
  return (
    <AuthGuard stranica="LAUREATSKI ODJEK">
      <StranicaRenderer sekvence={laureatskiOdjekSekvence} />
    </AuthGuard>
  );
}
