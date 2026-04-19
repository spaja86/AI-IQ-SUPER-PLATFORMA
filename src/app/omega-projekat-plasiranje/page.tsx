import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { omegaProjekatPlasiranjeSekvence } from '@/lib/sekvence/omega-projekat-plasiranje-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'OMEGA PROJEKAT — Plasiranje',
  description: `Automatsko plasiranje OMEGA PROJEKTA i Digitalne Industrije u opticaj — ${KOMPANIJA}`,
};

export default function OmegaProjekatPlasiranje() {
  return <StranicaRenderer sekvence={omegaProjekatPlasiranjeSekvence} />;
}
