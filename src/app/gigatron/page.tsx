import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getGigatronSekvence } from '@/lib/sekvence/gigatron-page';

export const metadata: Metadata = {
  title: 'GIGATRON — IT & Elektronika Procurement | AI IQ SUPER PLATFORMA',
  description: 'GIGATRON integraciona platforma za IT/elektroniku procurement, affiliate program i B2B supply chain u okviru Kompanija SPAJA Digitalna Industrija ekosistema.',
};

export default function GigatronPage() {
  return <StranicaRenderer sekvence={getGigatronSekvence()} />;
}
