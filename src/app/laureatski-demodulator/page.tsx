import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiDemodulatorSekvence } from '@/lib/sekvence/laureatski-demodulator-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI DEMODULATOR',
  description: `Demodulatorska matrica laureatskog centra i koherentnost demodulatorskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiDemodulator() {
  return (
    <AuthGuard stranica="LAUREATSKI DEMODULATOR">
      <StranicaRenderer sekvence={laureatskiDemodulatorSekvence} />
    </AuthGuard>
  );
}
