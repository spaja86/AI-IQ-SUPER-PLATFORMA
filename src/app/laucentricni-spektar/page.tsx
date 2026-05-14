import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laucentricniSpektarSekvence } from '@/lib/sekvence/laucentricni-spektar-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUCENTRICNI SPEKTAR',
  description: `Spektralna analiza laucentričnog sistema — harmoničko razlaganje četiri koncentrična sloja oko laureatskog centra — ${KOMPANIJA}`,
};

export default function LaucentricniSpektar() {
  return (
    <AuthGuard stranica="LAUCENTRICNI SPEKTAR">
      <StranicaRenderer sekvence={laucentricniSpektarSekvence} />
    </AuthGuard>
  );
}
