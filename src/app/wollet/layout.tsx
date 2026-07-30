import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | AI IQ World Bank Wollet',
    default: 'AI IQ World Bank Wollet',
  },
};

export default function WolletLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
