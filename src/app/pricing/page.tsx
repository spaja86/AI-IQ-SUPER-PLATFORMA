import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { pricingLoginSekvence } from '@/lib/sekvence/pricing-login-page';

export const metadata: Metadata = {
  title: 'SPAJA Pricing & Login',
  description: 'SPAJA Pricing & Login — Planovi, registracija i pristup platformi',
};

export default function PricingPage() {
  return <StranicaRenderer sekvence={pricingLoginSekvence} />;
}
