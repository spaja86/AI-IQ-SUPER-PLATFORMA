import type { Metadata } from 'next';
import SubscriptionCheckout from '@/components/SubscriptionCheckout';

export const metadata: Metadata = {
  title: 'Pretplata',
  description: 'Izaberite SPAJA pretplatu i nastavite na bezbedan Stripe Checkout.',
};

export default function PretplataPage() {
  return <SubscriptionCheckout />;
}
