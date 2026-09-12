import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { extrimliPriceSekvence } from '@/lib/sekvence/extrimli-price-page';

export const metadata: Metadata = {
  title: 'EXTRIMLI Priče',
  description: 'Narativni/content sloj za igrice, bioskop i srodne branše.',
};

export default function ExtrimliPricePage() {
  return <StranicaRenderer sekvence={extrimliPriceSekvence} />;
}
