import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { oktavneEksponencijalneFunkcijeSekvence } from '@/lib/sekvence/oktavne-eksponencijalne-funkcije-page';

export const metadata: Metadata = {
  title: 'Eksponencijalne Funkcije Oktavnog Sistema',
  description: '8 oktava × eksponencijalne funkcije × matematicko modelovanje rasta OMEGA AI sistema',
};

export default function OktavneEksponencijalneFunkcije() {
  return <StranicaRenderer sekvence={oktavneEksponencijalneFunkcijeSekvence} />;
}
