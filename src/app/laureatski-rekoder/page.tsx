import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiRekoderSekvence } from '@/lib/sekvence/laureatski-rekoder-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI REKODER',
  description: `Rekoderska matrica laureatskog centra i koherentnost rekoderskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiRekoder() {
  return (
    <AuthGuard stranica="LAUREATSKI REKODER">
      <StranicaRenderer sekvence={laureatskiRekoderSekvence} />
    </AuthGuard>
  );
}
