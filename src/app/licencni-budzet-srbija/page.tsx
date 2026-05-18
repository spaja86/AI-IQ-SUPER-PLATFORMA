import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { licencniBudzetSrbijaSekvence } from '@/lib/sekvence/licencni-budzet-srbija-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Licencni Budžet Srbija',
  description: `AI IQ World Bank budžetski plan nabavke svih licenci za Srbiju (RSD, po kategorijama i fazama) — ${KOMPANIJA}`,
};

export default function LicencniBudzetSrbijaPage() {
  return <StranicaRenderer sekvence={licencniBudzetSrbijaSekvence} />;
}
