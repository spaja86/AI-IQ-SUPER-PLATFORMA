import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { pocetnaSekvence } from '@/lib/sekvence/pocetna';

export const metadata: Metadata = {
  title: 'Početna — AI IQ SUPER PLATFORMA',
  description: 'Kompanija SPAJA — Digitalna Industrija. SpajaPro Prompt Engine v6-15, 21 OMEGA AI persona (40.000.562 ukupno), 95 igrica, Proksi mreža, SPAJA Mobilna Mreža. Unified platforma za upravljanje svim AI i IT projektima.',
};

export default function Home() {
  return <StranicaRenderer sekvence={pocetnaSekvence} />;
}
