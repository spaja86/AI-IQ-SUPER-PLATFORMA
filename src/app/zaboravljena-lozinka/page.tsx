import type { Metadata } from 'next';
import ZaboravljenaLozinkaForma from '@/components/ZaboravljenaLozinkaForma';

export const metadata: Metadata = {
  title: 'Zaboravljena lozinka — SPAJA Platforma',
  description:
    'Resetujte lozinku za pristup AI IQ SUPER PLATFORMA.',
};

export default function ZaboravljenaLozinkaPage() {
  return <ZaboravljenaLozinkaForma />;
}
