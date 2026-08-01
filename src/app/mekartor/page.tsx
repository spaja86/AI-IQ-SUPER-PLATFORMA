import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getMekartorSekvence } from '@/lib/sekvence/mekartor-page';

export const metadata: Metadata = {
  title: 'Mekartor — Deploy-ready platform surface',
  description: 'Mekartor staged rollout surface with health checks, KPIs, and deployment governance integrated into AI IQ SUPER PLATFORMA.',
};

export default function MekartorPage() {
  return <StranicaRenderer sekvence={getMekartorSekvence()} />;
}
