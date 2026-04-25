import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaDigitalniBrouvzerSekvence } from '@/lib/sekvence/spaja-digitalni-brouvzer-page';
import BrouvzerViewer from '@/components/BrouvzerViewer';

export const metadata: Metadata = {
  title: 'SPAJA Digitalni Brouvzer — EKSTREMNI',
  description: 'EKSTREMNI DIGITALNI BROUZER sa sopstvenim motorom, bekendom i providnim frontendom — deploy, import, export, SPAJA BAZA integracija',
};

type Props = {
  searchParams: Promise<{ url?: string; igra?: string; igricaId?: string }>;
};

export default async function SpajaDigitalniBrouvzerPage({ searchParams }: Props) {
  const { url, igra, igricaId } = await searchParams;

  // Gaming engine tab — otvara igricu direktno bez iframe
  if (igricaId) {
    let decodedIgricaId = igricaId;
    try {
      decodedIgricaId = decodeURIComponent(igricaId);
    } catch {
      return <StranicaRenderer sekvence={spajaDigitalniBrouvzerSekvence} />;
    }
    return <BrouvzerViewer url="" igra="" igricaId={decodedIgricaId} />;
  }

  if (url) {
    let decodedUrl = url;
    let decodedIgra = igra ?? '';
    try {
      decodedUrl = decodeURIComponent(url);
      decodedIgra = decodeURIComponent(igra ?? '');
    } catch {
      // Invalid URI sequence — fall through to StranicaRenderer
      return <StranicaRenderer sekvence={spajaDigitalniBrouvzerSekvence} />;
    }
    return <BrouvzerViewer url={decodedUrl} igra={decodedIgra} />;
  }

  return <StranicaRenderer sekvence={spajaDigitalniBrouvzerSekvence} />;
}
