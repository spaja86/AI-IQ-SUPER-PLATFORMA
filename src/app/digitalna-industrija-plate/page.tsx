import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaPlateSekvence } from '@/lib/sekvence/digitalna-industrija-plate-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Plate',
  description: `Centralni registar plata, fondova i poreskih obaveza Digitalne Industrije u Srbiji — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaPlate() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaPlateSekvence} />;
}
