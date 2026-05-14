import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiDekoderSekvence } from '@/lib/sekvence/laureatski-dekoder-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI DEKODER',
  description: `Dekoderska matrica laureatskog centra i koherentnost dekoderskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiDekoder() {
  return (
    <AuthGuard stranica="LAUREATSKI DEKODER">
      <StranicaRenderer sekvence={laureatskiDekoderSekvence} />
    </AuthGuard>
  );
}
