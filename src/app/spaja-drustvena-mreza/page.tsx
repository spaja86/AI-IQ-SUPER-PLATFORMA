import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getSpajaDrustvenaMrezaSekvence } from '@/lib/sekvence/spaja-drustvena-mreza-page';

export const metadata: Metadata = {
  title: 'SPAJA Društvena Mreža — AI-IQ SUPER PLATFORMA',
  description: 'Repo-local društvena mreža za profile, feed, grupe, poruke, događaje i notifikacioni readiness u SPAJA ekosistemu.',
};

export default function SpajaDrustvenaMrezaPage() {
  const sekvence = getSpajaDrustvenaMrezaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
