import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { unitTestoviSekvence } from '@/lib/sekvence/unit-testovi-page';

export const metadata: Metadata = {
  title: 'SPAJA Unit Testovi',
  description: 'SPAJA Unit Testovi — Automatizovano testiranje i kvalitet koda',
};

export default function UnitTestoviPage() {
  return <StranicaRenderer sekvence={unitTestoviSekvence} />;
}
