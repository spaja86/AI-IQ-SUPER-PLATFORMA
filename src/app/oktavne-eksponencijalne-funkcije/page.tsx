import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { oktavneEksponencijalneFunkcijeSekvence } from '@/lib/sekvence/oktavne-eksponencijalne-funkcije-page';

export const metadata: Metadata = {
  title: 'Eksponencijalne Funkcije Oktavnog Sistema — Figuracioni Centar',
  description: 'Figuracioni centar eksponencijalnog objekta u funkcionalnim oktavama — f(x) = a*b^x+c, centroid, fokalna snaga, harmonicki indeks',
};

export default function OktavneEksponencijalneFunkcije() {
  return <StranicaRenderer sekvence={oktavneEksponencijalneFunkcijeSekvence} />;
}
