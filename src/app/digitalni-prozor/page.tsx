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

function safeDecode(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

export default async function DigitalniProzorPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const igricaIdDecoded = safeDecode(pickSingle(resolved.igricaId));
  const dimenzijaDecoded = safeDecode(pickSingle(resolved.dimenzija));

  if (igricaIdDecoded) {
    return <ProzorViewer igricaId={igricaIdDecoded} dimenzija={dimenzijaDecoded} />;
  }

  return <StranicaRenderer sekvence={digitalniProzorSekvence} />;
}
