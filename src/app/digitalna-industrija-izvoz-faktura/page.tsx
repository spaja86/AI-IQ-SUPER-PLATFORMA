import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaIzvozFakturaSekvence } from '@/lib/sekvence/digitalna-industrija-izvoz-faktura-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Izvoz Faktura',
  description: `Centralni registar izvoznih faktura Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaIzvozFakturaPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaIzvozFakturaSekvence} />;
}
