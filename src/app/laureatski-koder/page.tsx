import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiKoderSekvence } from '@/lib/sekvence/laureatski-koder-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI KODER',
  description: `Koderska matrica laureatskog centra i koherentnost koderskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiKoder() {
  return (
    <AuthGuard stranica="LAUREATSKI KODER">
      <StranicaRenderer sekvence={laureatskiKoderSekvence} />
    </AuthGuard>
  );
}
