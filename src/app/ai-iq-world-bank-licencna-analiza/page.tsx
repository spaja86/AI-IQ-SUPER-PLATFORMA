import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiiqWorldBankLicencnaAnalizaSekvence } from '@/lib/sekvence/ai-iq-world-bank-licencna-analiza-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI IQ WORLD BANK Licencna Analiza — Srbija',
  description: `Centralni registar licenci za Srbiju, gap analiza i nabavka — ${KOMPANIJA}`,
};

export default function AiiqWorldBankLicencnaAnalizaPage() {
  return <StranicaRenderer sekvence={aiiqWorldBankLicencnaAnalizaSekvence} />;
}
