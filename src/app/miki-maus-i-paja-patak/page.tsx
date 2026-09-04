import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { mikiMausIPajaPatakSekvence } from '@/lib/sekvence/miki-maus-i-paja-patak-page';

export const metadata: Metadata = {
  title: 'MIKI MAUS I PAJA PATAK',
  description: 'Narativni modul o partnerstvu, koordinaciji i timskom ritmu kroz sekvence i API izlaz',
};

export default function MikiMausIPajaPatakPage() {
  return <StranicaRenderer sekvence={mikiMausIPajaPatakSekvence} />;
}
