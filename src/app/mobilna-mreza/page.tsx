import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { mobilnaMrezaSekvence } from '@/lib/sekvence/mobilna-mreza-page';

export const metadata: Metadata = {
  title: 'Mobilna Mreža',
  description: 'SPAJA Mobilna Mreža sa 4 centrale',
};

export default function MobilnaMreza() {
  return <StranicaRenderer sekvence={mobilnaMrezaSekvence} />;
}
