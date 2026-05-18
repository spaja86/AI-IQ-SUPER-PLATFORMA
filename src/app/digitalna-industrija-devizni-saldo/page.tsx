import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaDevizniSaldoSekvence } from '@/lib/sekvence/digitalna-industrija-devizni-saldo-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Devizni Saldo',
  description: `Centralni registar deviznog salda Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaDevizniSaldoPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaDevizniSaldoSekvence} />;
}
