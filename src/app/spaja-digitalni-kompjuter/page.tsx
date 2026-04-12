import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaDigitalniKompjuterSekvence } from '@/lib/sekvence/spaja-digitalni-kompjuter-page';

export const metadata: Metadata = {
  title: 'SPAJA Digitalni Kompjuter — AI IQ SUPER PLATFORMA',
  description: 'Kompletni digitalni kompjuter sa svim SPAJA komponentama — Maticna Ploca, Server, Procesor, GPU, Graficka, RAM, Hard Disk, BIOS, konzole i dzojstici — sve pokretano od SPAJA Generator za Endzine',
};

export default function SpajaDigitalniKompjuter() {
  return <StranicaRenderer sekvence={spajaDigitalniKompjuterSekvence} />;
}
