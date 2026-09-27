import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { padeziSekvence } from '@/lib/sekvence/padezi-page';

export const metadata: Metadata = {
  title: 'PADEŽI — objedinjeni pregled',
  description:
    'Pregled svih sedam padeža kroz jedinstven edukativni i navigacioni obrazac unutar PADEŽI paketa.',
};

export default function PadeziPage() {
  return <StranicaRenderer sekvence={padeziSekvence} />;
}
