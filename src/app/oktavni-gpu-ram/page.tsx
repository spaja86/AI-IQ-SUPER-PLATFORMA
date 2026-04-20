import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { oktavniGPURAMSekvence } from '@/lib/sekvence/oktavni-gpu-ram-page';

export const metadata: Metadata = {
  title: 'Oktavni GPU/RAM Sistem — AI IQ SUPER PLATFORMA',
  description: 'Oktavni sistem u rasponu ekvalaturnog galaksipoznog sektora u matričnom jedinjenju izražen kroz grafičnu jedinicu GPU i RAM — za maksimalne performanse igrica na Digitalnom Kompjuteru',
};

export default function OktavniGPURAM() {
  return <StranicaRenderer sekvence={oktavniGPURAMSekvence} />;
}
