import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { vercelPriključenjeSekvence } from '@/lib/sekvence/vercel-priklucenje-page';

export const metadata: Metadata = {
  title: 'Vercel Priključenje',
  description: 'Konfiguracija Vercel infrastrukture — API token, KV store, deploy hook-ovi i ownership prenos za AI IQ SUPER PLATFORMA',
};

export default function VercelPriključenjePage() {
  return <StranicaRenderer sekvence={vercelPriključenjeSekvence} />;
}
