import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { pametniUgoвориSekvence } from '@/lib/sekvence/pametni-ugovori-page';

export const metadata: Metadata = {
  title: 'Pametni Ugovori — Digitalna Era | AI IQ SUPER PLATFORMA',
  description:
    'Blockchain pametni ugovori zamenjuju papirnu dokumentaciju — OMEGA AI digitalna industrija sa svim licencama, call centrom, dispečom i poslovnim mejlovima',
};

export default function PametniUgovoriPage() {
  return <StranicaRenderer sekvence={pametniUgoвориSekvence} />;
}
