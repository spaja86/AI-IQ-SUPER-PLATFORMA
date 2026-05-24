import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiIqWorldBankProcesiranjeSekvence } from '@/lib/sekvence/ai-iq-world-bank-procesiranje-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI IQ World Bank — Procesiranje Transakcija',
  description: `Aktivni sloj obrade: transakcije u obradi, kamatna obrada, AI fraud detekcija, SWIFT/blockchain rutiranje — ${KOMPANIJA}`,
};

export default function AiIqWorldBankProcesiranjePage() {
  return <StranicaRenderer sekvence={aiIqWorldBankProcesiranjeSekvence} />;
}
