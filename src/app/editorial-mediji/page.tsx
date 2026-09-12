import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { editorialMedijiSekvence } from '@/lib/sekvence/editorial-mediji-page';

export const metadata: Metadata = {
  title: 'Editorial Mediji',
  description: 'Media vertikala za romane, stripove, novine i serijale.',
};

export default function EditorialMedijiPage() {
  return <StranicaRenderer sekvence={editorialMedijiSekvence} />;
}
