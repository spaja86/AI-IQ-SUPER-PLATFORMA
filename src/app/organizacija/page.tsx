import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { organizacijaSekvence } from '@/lib/sekvence/organizacija-page';

export const metadata: Metadata = {
  title: 'Organizacija SPAJA',
  description: 'Interna organizaciona struktura SPAJA',
};

export default function OrganizacijaPage() {
  return <StranicaRenderer sekvence={organizacijaSekvence} />;
}
