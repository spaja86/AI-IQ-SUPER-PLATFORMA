import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiIqWorldBankProcesiranjeSekvence } from '@/lib/sekvence/ai-iq-world-bank-procesiranje-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI IQ World Bank — Procesiranje Transakcija',
  description: `Aktivni sloj obrade: transakcije u obradi, kamatna obrada, AI fraud detekcija, SWIFT/blockchain rutiranje — ${KOMPANIJA}`,
};

export default function AiIqWorldBankProcesiranjePage() {
  return <><aside className="mx-auto max-w-5xl p-6" role="note"><h1>SIMULACIJA — bankarski prototip</h1><p>Prikazani računi, transferi, kamate, partnerstva i KPI su nepotvrđeni primeri, ne izvršene uplate ili garantovana zarada. Stvarna plaćanja i izdavanje kartica su isključeni.</p><a href="/bank-prototype">Autentifikovani prototip</a></aside><StranicaRenderer sekvence={aiIqWorldBankProcesiranjeSekvence} /></>;
}
