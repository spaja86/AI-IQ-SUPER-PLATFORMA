import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaLicencniPortfolioSekvence } from '@/lib/sekvence/digitalna-industrija-licencni-portfolio-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Licencni Portfolio — Digitalna Industrija',
  description: `Centralni 4-nivoski registar svih licenci za legalan rad Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaLicencniPortfolioPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaLicencniPortfolioSekvence} />;
}
