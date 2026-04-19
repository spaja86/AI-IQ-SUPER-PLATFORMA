import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { dnevnaRaspodelZaradeSekvence } from '@/lib/sekvence/dnevna-raspodela-zarade-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dnevna Raspodela Zarade — Distribucija na 3+1 račun',
  description: `Dnevna raspodela zarade — 96% na 3 ERSTE računa (RSD, EUR, USD) i 4% na Digitalnu Industriju u AI IQ World Bank — ${KOMPANIJA}`,
};

export default function DnevnaRaspodelaSaradePage() {
  return <StranicaRenderer sekvence={dnevnaRaspodelZaradeSekvence} />;
}
