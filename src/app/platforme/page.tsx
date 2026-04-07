import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { platformeSekvence } from '@/lib/sekvence/platforme-page';

export const metadata: Metadata = {
  title: 'Platforme',
  description: 'Sve platforme u ekosistemu Kompanije SPAJA',
};

export default function Platforme() {
  return <StranicaRenderer sekvence={platformeSekvence} />;
}
