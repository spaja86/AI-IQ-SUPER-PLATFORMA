import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { goLiveDigitalnaIndustrijaSekvence } from '@/lib/sekvence/go-live-digitalna-industrija-page';

export const metadata: Metadata = {
  title: 'Go-Live Digitalna Industrija',
  description: 'Launch površina za reklamni materijal, KPI i rollout faze Digitalne Industrije.',
};

export default function GoLiveDigitalnaIndustrijaPage() {
  return <StranicaRenderer sekvence={goLiveDigitalnaIndustrijaSekvence} />;
}
