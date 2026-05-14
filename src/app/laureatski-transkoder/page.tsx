import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiTranskoderSekvence } from '@/lib/sekvence/laureatski-transkoder-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI TRANSKODER',
  description: `Transkoderska matrica laureatskog centra i koherentnost transkoderskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiTranskoder() {
  return (
    <AuthGuard stranica="LAUREATSKI TRANSKODER">
      <StranicaRenderer sekvence={laureatskiTranskoderSekvence} />
    </AuthGuard>
  );
}
