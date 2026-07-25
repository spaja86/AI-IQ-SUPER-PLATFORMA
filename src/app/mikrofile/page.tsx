import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { mikrofileSekvence } from '@/lib/sekvence/mikrofile-page';

export const metadata: Metadata = {
  title: 'MIKROFILE — Digitalna Industrija',
  description: `Centralni registar mikro-digitalnih fajlova i metapodataka — ${KOMPANIJA}`,
};

export default function MikrofilePage() {
  return <StranicaRenderer sekvence={mikrofileSekvence} />;
}
