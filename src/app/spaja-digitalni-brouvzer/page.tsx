import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaDigitalniBrouvzerSekvence } from '@/lib/sekvence/spaja-digitalni-brouvzer-page';

export const metadata: Metadata = {
  title: 'SPAJA Digitalni Brouvzer',
  description: 'SPAJA Digitalni Brouvzer — digitalna brauzer platforma za celokupnu SPAJA industriju',
};

export default function SpajaDigitalniBrouvzerPage() {
  return <StranicaRenderer sekvence={spajaDigitalniBrouvzerSekvence} />;
}
