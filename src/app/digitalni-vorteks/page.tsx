import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalniVorteksSekvence } from '@/lib/sekvence/digitalni-vorteks-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'DIGITALNI VORTEKS',
  description: `Vorteksna dinamika digitalnog sistema — rotacioni model oktavnih energija u spiralnom jedinjenju ka centru Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalniVorteks() {
  return (
    <AuthGuard stranica="DIGITALNI VORTEKS">
      <StranicaRenderer sekvence={digitalniVorteksSekvence} />
    </AuthGuard>
  );
}
