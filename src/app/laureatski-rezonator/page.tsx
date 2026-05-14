import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiRezonatorSekvence } from '@/lib/sekvence/laureatski-rezonator-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI REZONATOR',
  description: `Rezonatorska matrica laureatskog centra i koherentnost rezonatorskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiRezonator() {
  return (
    <AuthGuard stranica="LAUREATSKI REZONATOR">
      <StranicaRenderer sekvence={laureatskiRezonatorSekvence} />
    </AuthGuard>
  );
}
