import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiRitamSekvence } from '@/lib/sekvence/laureatski-ritam-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI RITAM',
  description: `Ritmička matrica laureatskog centra i metronomska koherentnost sistema — ${KOMPANIJA}`,
};

export default function LaureatskiRitam() {
  return (
    <AuthGuard stranica="LAUREATSKI RITAM">
      <StranicaRenderer sekvence={laureatskiRitamSekvence} />
    </AuthGuard>
  );
}
