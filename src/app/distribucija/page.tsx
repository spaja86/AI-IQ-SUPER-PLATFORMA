import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { distribucijaSekvence } from '@/lib/sekvence/distribucija-page';

export const metadata: Metadata = {
  title: 'DISTRIBUCIJA — Globalni Operativni Modul',
  description: 'Centralni modul distribucije: čvorovi, kanali, KPI i operativna spremnost.',
};

export default function DistribucijaPage() {
  return <StranicaRenderer sekvence={distribucijaSekvence} />;
}

