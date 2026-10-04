import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { bankaSekvence } from '@/lib/sekvence/banka-page';

export const metadata: Metadata = {
  title: 'SPAJA Banka',
  description: 'SPAJA Banka platforma',
};

export default function BankaPage() {
  return <><aside className="mx-auto max-w-5xl p-6" role="note"><h1>SIMULACIJA — bankarski prototip</h1><p>Prikazani računi, transferi, kamate, partnerstva i KPI su nepotvrđeni primeri, ne izvršene uplate ili garantovana zarada. Stvarna plaćanja i izdavanje kartica su isključeni.</p><a href="/bank-prototype">Autentifikovani prototip</a></aside><StranicaRenderer sekvence={bankaSekvence} /></>;
}
