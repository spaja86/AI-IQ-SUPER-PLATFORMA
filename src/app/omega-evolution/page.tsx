import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getOmegaEvolutionSekvence } from '@/lib/sekvence/omega-evolution-page';

export const metadata: Metadata = {
  title: 'OmegaEvolution — Evolucija Platforme',
  description: 'Unifikovani evolucioni hub platforme: OMEGA evolucija, SpajaPro 13, neuronska evolucija i SpajaNikOpenEvolution.',
};

export default function OmegaEvolutionPage() {
  const sekvence = getOmegaEvolutionSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
