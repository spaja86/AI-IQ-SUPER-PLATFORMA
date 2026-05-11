import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { kriptoTrezorSekvence } from '@/lib/sekvence/kripto-trezor-page';

export const metadata: Metadata = {
  title: 'SPAJA Kripto Trezor — AI IQ SUPER PLATFORMA',
  description: 'Institucionalni kripto custody vault — cold storage, multi-sig i time-lock zaštita za sva SPAJA digitalna sredstva.',
};

export default function KriptoTrezorPage() {
  return <StranicaRenderer sekvence={kriptoTrezorSekvence} />;
}
