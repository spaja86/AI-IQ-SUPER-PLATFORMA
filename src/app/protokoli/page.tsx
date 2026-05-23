import type { Metadata } from 'next';
import { KOMPANIJA } from '@/lib/constants';
import { ProtokoliDashboard } from './ProtokoliDashboard';

export const metadata: Metadata = {
  title: 'Protokoli Pregled — AI IQ SUPER PLATFORMA',
  description: `${KOMPANIJA} — centralizovan sistem za evidenciju, verifikaciju i upravljanje svim protokolima.`,
};

export default function ProtokoliPage() {
  return <ProtokoliDashboard />;
}
