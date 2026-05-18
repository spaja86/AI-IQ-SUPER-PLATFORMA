import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiIqWorldBankSekvence } from '@/lib/sekvence/ai-iq-world-bank-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI IQ World Bank — Sve o njoj',
  description: `AI IQ World Bank — sve o njoj: usluge, AI tehnologija, ERSTE računi, partneri, transferi, GitHub billing i ekosistem — ${KOMPANIJA}`,
};

export default function AiIqWorldBankPage() {
  return <StranicaRenderer sekvence={aiIqWorldBankSekvence} />;
}
