import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { issuerLicenseControlCenterSekvence } from '@/lib/sekvence/issuer-license-control-center-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Issuer License Control Center — Srbija',
  description: `Ovlašćenja za izdavanje licenci, status odobrenja, compliance i expirations — ${KOMPANIJA}`,
};

export default function IssuerLicenseControlCenterPage() {
  return <StranicaRenderer sekvence={issuerLicenseControlCenterSekvence} />;
}
