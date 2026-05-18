import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaKursneRazlikeSekvence } from '@/lib/sekvence/digitalna-industrija-kursne-razlike-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Kursne Razlike',
  description: `Centralni registar kursnih razlika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaKursneRazlikePage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaKursneRazlikeSekvence} />;
}
