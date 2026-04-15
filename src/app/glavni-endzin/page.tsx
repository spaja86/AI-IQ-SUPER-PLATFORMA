import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { glavniEndzinSekvence } from '@/lib/sekvence/glavni-endzin-page';

export const metadata: Metadata = {
  title: 'Glavni Endžin Digitalne Industrije',
  description:
    'Glavni Endžin koji spaja SVE endžine u jedan veliki unificirani endžin. ' +
    'Automatski sklapa gotove proizvode i igrice, unapređuje sve platforme i sva poslovanja.',
};

export default function GlavniEndzin() {
  return <StranicaRenderer sekvence={glavniEndzinSekvence} />;
}
