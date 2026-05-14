import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiEhoSekvence } from '@/lib/sekvence/laureatski-eho-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI EHO',
  description: `Eho matrica laureatskog centra i koherentnost povratne sprege impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiEho() {
  return (
    <AuthGuard stranica="LAUREATSKI EHO">
      <StranicaRenderer sekvence={laureatskiEhoSekvence} />
    </AuthGuard>
  );
}
