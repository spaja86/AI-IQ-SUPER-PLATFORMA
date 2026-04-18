import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { glavniSistemNabavkaSekvence } from '@/lib/sekvence/glavni-sistem-nabavka-page';

export const metadata: Metadata = {
  title: 'Glavni Sistem Nabavke — Digitalna Industrija',
  description:
    'Glavni Sistem za nabavku spojen sa Glavnim Endžinom — troši pare iz AI IQ World Bank ' +
    'za kupovinu svega što je potrebno Digitalnoj Industriji. 50 digitalnih varijacija.',
};

export default function GlavniSistemNabavka() {
  return <StranicaRenderer sekvence={glavniSistemNabavkaSekvence} />;
}
