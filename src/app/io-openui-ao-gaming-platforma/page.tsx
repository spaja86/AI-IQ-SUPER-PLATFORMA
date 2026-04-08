import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ioOpenUIAOGamingSekvence } from '@/lib/sekvence/io-openui-ao-gaming-platforma-page';

export const metadata: Metadata = {
  title: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
  description: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin prevučen preko svih 95 igrica. Standardni URL: www.ioopenuiao.ac',
};

export default function IOOpenUIAOGamingPlatformaPage() {
  return <StranicaRenderer sekvence={ioOpenUIAOGamingSekvence} />;
}
