import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiModulatorSekvence } from '@/lib/sekvence/laureatski-modulator-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI MODULATOR',
  description: `Modulatorska matrica laureatskog centra i koherentnost modulatorskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiModulator() {
  return (
    <AuthGuard stranica="LAUREATSKI MODULATOR">
      <StranicaRenderer sekvence={laureatskiModulatorSekvence} />
    </AuthGuard>
  );
}
