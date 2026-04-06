import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { industrijaSekvence } from '@/lib/sekvence/industrija';

export const metadata: Metadata = {
  title: 'Industrija',
  description: 'O digitalnoj industriji — Kompanija SPAJA',
};

export default function Industrija() {
  return <StranicaRenderer sekvence={industrijaSekvence} />;
}
