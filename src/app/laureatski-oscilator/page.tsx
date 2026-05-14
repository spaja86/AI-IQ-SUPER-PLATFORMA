import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiOscilatorSekvence } from '@/lib/sekvence/laureatski-oscilator-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI OSCILATOR',
  description: `Oscilatorska matrica laureatskog centra i koherentnost oscilatorskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiOscilator() {
  return (
    <AuthGuard stranica="LAUREATSKI OSCILATOR">
      <StranicaRenderer sekvence={laureatskiOscilatorSekvence} />
    </AuthGuard>
  );
}
