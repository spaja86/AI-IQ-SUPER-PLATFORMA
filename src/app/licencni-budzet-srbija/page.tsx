import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { licencniBudzetSrbijaSekvence } from '@/lib/sekvence/licencni-budzet-srbija-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Licencni Budzet Srbija',
  description: `Registar i plan licencnog budžeta za Srbiju — ${KOMPANIJA}`,
};

export default function LicencniBudzetSrbijaPage() {
  return <StranicaRenderer sekvence={licencniBudzetSrbijaSekvence} />;
}
