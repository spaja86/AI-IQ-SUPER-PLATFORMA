import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { gejmingLikoviSekvence } from '@/lib/sekvence/gejming-likovi-page';
import { KOMPANIJA, TOTAL_GEJMING_ENTITETA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Industrija Gejming Likova',
  description: `Dizajn likova, objekata, subjekata i svega što postoji za igrice — ${TOTAL_GEJMING_ENTITETA} entiteta — ${KOMPANIJA}`,
};

export default function GejmingLikoviPage() {
  return <StranicaRenderer sekvence={gejmingLikoviSekvence} />;
}
