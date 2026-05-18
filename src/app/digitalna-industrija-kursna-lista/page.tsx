import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaKursnaListaSekvence } from '@/lib/sekvence/digitalna-industrija-kursna-lista-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Kursna Lista',
  description: `Centralni registar kursne liste Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaKursnaListaPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaKursnaListaSekvence} />;
}
