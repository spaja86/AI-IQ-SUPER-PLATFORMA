import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { kompanijaSekvence } from '@/lib/sekvence/kompanija-page';

export const metadata: Metadata = {
  title: 'Kompanija SPAJA',
  description: 'O matičnoj kompaniji SPAJA — Digitalna Industrija',
};

export default function KompanijaPage() {
  return <StranicaRenderer sekvence={kompanijaSekvence} />;
}
