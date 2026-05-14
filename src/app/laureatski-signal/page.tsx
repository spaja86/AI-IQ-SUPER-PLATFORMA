import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiSignalSekvence } from '@/lib/sekvence/laureatski-signal-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI SIGNAL',
  description: `Signalna matrica laureatskog centra i koherentnost impulsa sistema — ${KOMPANIJA}`,
};

export default function LaureatskiSignal() {
  return (
    <AuthGuard stranica="LAUREATSKI SIGNAL">
      <StranicaRenderer sekvence={laureatskiSignalSekvence} />
    </AuthGuard>
  );
}
