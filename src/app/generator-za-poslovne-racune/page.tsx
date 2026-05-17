import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { generatorZaPoslovneRacuneSekvence } from '@/lib/sekvence/generator-za-poslovne-racune-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Generator za Poslovne Račune',
  description: `AI IQ World Bank generator poslovnih računa (RSD/EUR/USD) za korisnike — ${KOMPANIJA}`,
};

export default function GeneratorZaPoslovneRacunePage() {
  return <StranicaRenderer sekvence={generatorZaPoslovneRacuneSekvence} />;
}
