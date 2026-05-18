import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaComplianceRizikSekvence } from '@/lib/sekvence/digitalna-industrija-compliance-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Compliance Rizik',
  description: `Centralni registar compliance rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaComplianceRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaComplianceRizikSekvence} />;
}
