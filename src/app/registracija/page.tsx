import type { Metadata } from 'next';
import RegistracijaForma from '@/components/RegistracijaForma';

export const metadata: Metadata = {
  title: 'Registracija',
  description: 'Kreirajte nalog na AI IQ SUPER PLATFORMA — pristup SpajaPro AI i celom ekosistemu Kompanije SPAJA',
};

export default function RegistracijaPage() {
  return <RegistracijaForma />;
}
