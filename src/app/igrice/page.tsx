import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { igriceSekvence } from '@/lib/sekvence/igrice-page';

export const metadata: Metadata = {
  title: 'Igrice',
  description: '95 igrica u 18 kategorija — SPAJA Gaming ekosistem',
};

export default function Igrice() {
  return <StranicaRenderer sekvence={igriceSekvence} />;
}
