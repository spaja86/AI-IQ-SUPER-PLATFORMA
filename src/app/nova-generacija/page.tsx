import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getNovaGeneracijaSekvence } from '@/lib/sekvence/nova-generacija-page';

export const metadata: Metadata = {
  title: 'Nova Generacija — AI-IQ SUPER PLATFORMA v100',
  description: 'SpajaPro 16 Hipermreza Engine — 16×16 kvantna mreža sa 256 čvorova, 50 OMEGA AI persona u 16 oktava, self-healing arhitektura i cross-platform sinhronizacija.',
};

export default function NovaGeneracijaPage() {
  const sekvence = getNovaGeneracijaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
