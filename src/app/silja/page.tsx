import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { getSiljaSekvence } from '@/lib/sekvence/silja-page';

export const metadata: Metadata = {
  title: 'SILJA — Sistemska Inteligentna Logika Jezgra Automatizacije',
  description: `Cross-domain automation-intelligence engine kroz 6 operativnih domena za ${KOMPANIJA}.`,
};

export default function SiljaPage() {
  const sekvence = getSiljaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
