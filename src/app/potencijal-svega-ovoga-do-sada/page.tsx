import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { potencijalSvegaOvogaDoSadaSekvence } from '@/lib/sekvence/potencijal-svega-ovoga-do-sada-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Potencijal Svega Ovoga Do Sada — Digitalna Industrija',
  description: `Agregacioni pregled potencijala platforme ${KOMPANIJA}: stanje sada, blokeri, unlock faktori i očekivani rast po domenima`,
};

export default function PotencijalSvegaOvogaDoSadaPage() {
  return <StranicaRenderer sekvence={potencijalSvegaOvogaDoSadaSekvence} />;
}
