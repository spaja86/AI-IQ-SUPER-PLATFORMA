import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { omegaProjekatZvanicnoOtvaranjeSekvence } from '@/lib/sekvence/omega-projekat-zvanicno-otvaranje-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'OMEGA PROJEKAT — Zvanično Otvaranje',
  description: `Zvanično otvaranje OMEGA PROJEKTA prema monolizmima — verifikacija oktavnog monologa, matricno jedinjenje, egzocentrično jezgro — ${KOMPANIJA}`,
};

export default function OmegaProjekatZvanicnoOtvaranje() {
  return <StranicaRenderer sekvence={omegaProjekatZvanicnoOtvaranjeSekvence} />;
}
