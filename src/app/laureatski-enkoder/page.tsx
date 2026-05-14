import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { laureatskiEnkoderSekvence } from '@/lib/sekvence/laureatski-enkoder-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'LAUREATSKI ENKODER',
  description: `Enkoderska matrica laureatskog centra i koherentnost enkoderskih impulsa — ${KOMPANIJA}`,
};

export default function LaureatskiEnkoder() {
  return (
    <AuthGuard stranica="LAUREATSKI ENKODER">
      <StranicaRenderer sekvence={laureatskiEnkoderSekvence} />
    </AuthGuard>
  );
}
