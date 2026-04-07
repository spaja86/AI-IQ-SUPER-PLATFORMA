import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { bankaSekvence } from '@/lib/sekvence/banka-page';

export const metadata: Metadata = {
  title: 'SPAJA Banka',
  description: 'SPAJA Banka platforma',
};

export default function BankaPage() {
  return <StranicaRenderer sekvence={bankaSekvence} />;
}
