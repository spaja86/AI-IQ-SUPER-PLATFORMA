import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ekosistemSekvence } from '@/lib/sekvence/ekosistem-page';

export const metadata: Metadata = {
  title: 'Ekosistem',
  description: 'Celokupan pregled ekosistema Kompanije SPAJA',
};

export default function Ekosistem() {
  return <StranicaRenderer sekvence={ekosistemSekvence} />;
}
