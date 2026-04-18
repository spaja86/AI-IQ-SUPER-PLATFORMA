import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { reklameIPartnerstvaSekvence } from '@/lib/sekvence/reklame-i-partnerstva-page';

export const metadata: Metadata = {
  title: 'Reklame & Partnerstva — Monetizacija',
  description: 'Reklamne kampanje, partnerstva iz svih branši i monetizacija Digitalne Industrije — Kompanija SPAJA',
};

export default function ReklameIPartnerstva() {
  return <StranicaRenderer sekvence={reklameIPartnerstvaSekvence} />;
}
