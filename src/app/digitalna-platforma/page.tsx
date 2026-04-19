import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaPlatformaSekvence } from '@/lib/sekvence/digitalna-platforma-page';
import { APP_NAME, KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Platforma — SPAJA',
  description:
    `${APP_NAME} — kompletni digitalni ekosistem ${KOMPANIJA.replace('Kompanija ', 'Kompanije ')} sa AI, finansijama, igricama, deploy infrastrukturom i vise.`,
};

export default function DigitalnaPlatformaPage() {
  return <StranicaRenderer sekvence={digitalnaPlatformaSekvence} />;
}
