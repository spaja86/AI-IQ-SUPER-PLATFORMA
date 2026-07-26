import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Call Centar — Moblini SPAJA',
  description: 'SPAJA Call Centar — digitalne usluge, dodela paketa i instalacionih brojeva. Starter, Pro, Enterprise i VIP paketi sa mesečnom pretplatom.',
};

export default function CallCentarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
