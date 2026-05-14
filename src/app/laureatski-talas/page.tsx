import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiTalasSekvence } from '@/lib/sekvence/laureatski-talas-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI TALAS',
  description: `Talasna matrica laureatskog centra i koherentnost frekvencijskih čvorova — ${KOMPANIJA}`,
};

export default function LaureatskiTalas() {
  return (
    <AuthGuard stranica="LAUREATSKI TALAS">
      <StranicaRenderer sekvence={laureatskiTalasSekvence} />
    </AuthGuard>
  );
}
