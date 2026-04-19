import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiPlatformaSekvence } from '@/lib/sekvence/ai-platforma-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI Platforma',
  description: `AI platforma i modeli — ${KOMPANIJA}`,
};

export default function AIPlatformaPage() {
  return <StranicaRenderer sekvence={aiPlatformaSekvence} />;
}
