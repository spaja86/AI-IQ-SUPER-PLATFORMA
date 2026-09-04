import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { akuzativSekvence } from '@/lib/sekvence/akuzativ-page';

export const metadata: Metadata = {
  title: 'AKUZATIV — edukativni modul',
  description: 'Modul za akuzativ: pravila, nivoi težine, zadaci i validacija razumevanja.',
};

export default function AkuzativPage() {
  return <StranicaRenderer sekvence={akuzativSekvence} />;
}
