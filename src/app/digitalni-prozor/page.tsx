import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalniProzorSekvence } from '@/lib/sekvence/digitalni-prozor-page';
import ProzorViewer from '@/components/ProzorViewer';

export const metadata: Metadata = {
  title: 'DIGITALNI PROZOR — Aplikaciona Platforma',
  description: 'DIGITALNI PROZOR startup shell za pokretanje igrica iz DIGITALNI BROUVZER-a',
};

type SearchParams = {
  igricaId?: string | string[];
  dimenzija?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function pickSingle(v?: string | string[]): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default async function DigitalniProzorPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const igricaIdRaw = pickSingle(resolved.igricaId);
  const dimenzijaRaw = pickSingle(resolved.dimenzija);

  if (igricaIdRaw) {
    try {
      const decodedIgricaId = decodeURIComponent(igricaIdRaw);
      const decodedDimenzija = dimenzijaRaw ? decodeURIComponent(dimenzijaRaw) : undefined;
      return <ProzorViewer igricaId={decodedIgricaId} dimenzija={decodedDimenzija} />;
    } catch {
      return <StranicaRenderer sekvence={digitalniProzorSekvence} />;
    }
  }

  return <StranicaRenderer sekvence={digitalniProzorSekvence} />;
}

