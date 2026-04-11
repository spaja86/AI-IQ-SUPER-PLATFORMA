import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaRenderMedijaSekvence } from '@/lib/sekvence/spaja-render-medija-page';

export const metadata: Metadata = {
  title: 'SPAJA Render za Slike i Video',
  description: 'SPAJA Render za Slike i Video — render medija sistem za SPAJA ekosistem',
};

export default function SpajaRenderMedijaPage() {
  return <StranicaRenderer sekvence={spajaRenderMedijaSekvence} />;
}
