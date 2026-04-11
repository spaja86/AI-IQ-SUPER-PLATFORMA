import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { oktavneEksponencijalneFunkcijeSekvence } from '@/lib/sekvence/oktavne-eksponencijalne-funkcije-page';

export const metadata: Metadata = {
  title: 'Oktavni Monolog Eksponencijalnog Ekvivalenta — OMEGA PROJEKAT',
  description: 'Oktavni monolog eksponencijalnog ekvivalenta prema matricnom jedinjenju egzocentricnog funkcionalnog jezgra u laucentricnom sistemu — OMEGA PROJEKAT',
};

export default function OktavneEksponencijalneFunkcije() {
  return <StranicaRenderer sekvence={oktavneEksponencijalneFunkcijeSekvence} />;
}
