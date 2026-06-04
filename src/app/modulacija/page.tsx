import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { modulacijaSekvence } from '@/lib/sekvence/modulacija-page';

export const metadata: Metadata = {
  title: 'Modulacija',
  description: `Modulacija — adaptivno kodovanje signala i višekanalni prenosni tokovi — ${KOMPANIJA}`,
};

export default function ModulacijaPage() {
  return <StranicaRenderer sekvence={modulacijaSekvence} />;
}
