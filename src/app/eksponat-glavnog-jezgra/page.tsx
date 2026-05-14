import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { eksponatGlavnogJezgraSekvence } from '@/lib/sekvence/eksponat-glavnog-jezgra-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'EKSPONAT GLAVNOG JEZGRA',
  description: `Eksponicionalni oblik cinemetričnog jedinjenja u oktavi u srazmernom centimentarnom sjedinjavanju sistematskog infrajedinkonalnog skvence — ${KOMPANIJA}`,
};

export default function EksponatGlavnogJezgra() {
  return (
    <AuthGuard stranica="EKSPONAT GLAVNOG JEZGRA">
      <StranicaRenderer sekvence={eksponatGlavnogJezgraSekvence} />
    </AuthGuard>
  );
}
