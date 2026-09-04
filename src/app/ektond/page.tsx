import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getEktondSekvence } from '@/lib/sekvence/ektond-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'EKTOND — Ekstremni Kondenzator Tokova Nadzora Digitalnog',
  description: `Cross-domain kondenzacija platformskih tokova kroz 6 domena za ${KOMPANIJA}.`,
};

export default async function EktondPage() {
  const sekvence = await getEktondSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
