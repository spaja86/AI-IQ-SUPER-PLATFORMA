import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { igriceSekvence } from '@/lib/sekvence/igrice-page';
import { TOTAL_IGRICA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Igrice',
  description: `${TOTAL_IGRICA} igrica u 18 kategorija — SPAJA Gaming ekosistem`,
};

export default function Igrice() {
  return <StranicaRenderer sekvence={igriceSekvence} />;
}
