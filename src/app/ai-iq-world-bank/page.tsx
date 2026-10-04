import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiIqWorldBankSekvence } from '@/lib/sekvence/ai-iq-world-bank-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI IQ World Bank — Sve o njoj',
  description: `AI IQ World Bank — sve o njoj: usluge, AI tehnologija, ERSTE računi, partneri, transferi, GitHub billing i ekosistem — ${KOMPANIJA}`,
};

export default function AiIqWorldBankPage() {
  return <><aside className="mx-auto max-w-5xl p-6" role="note"><h1>SIMULACIJA — bankarski prototip</h1><p>Prikazani računi, transferi, kamate, partnerstva i KPI su nepotvrđeni primeri, ne izvršene uplate ili garantovana zarada. Stvarna plaćanja i izdavanje kartica su isključeni.</p><a href="/bank-prototype">Autentifikovani prototip</a></aside><StranicaRenderer sekvence={aiIqWorldBankSekvence} /></>;
}
