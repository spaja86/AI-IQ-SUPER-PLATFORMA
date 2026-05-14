import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiPulsSekvence } from '@/lib/sekvence/laureatski-puls-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI PULS',
  description: `Pulsna dinamika laureatskog centra u harmoničkoj rezonanci — ${KOMPANIJA}`,
};

export default function LaureatskiPuls() {
  return (
    <AuthGuard stranica="LAUREATSKI PULS">
      <StranicaRenderer sekvence={laureatskiPulsSekvence} />
    </AuthGuard>
  );
}
