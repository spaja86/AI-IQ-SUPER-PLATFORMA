import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ioOpenUIAOGamingSekvence } from '@/lib/sekvence/io-openui-ao-gaming-platforma-page';
import { TOTAL_IGRICA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
  description: `IO/OPENUI/AO Gaming Platforma - SPAJA Univerzalni Endzin prevucen preko svih ${TOTAL_IGRICA} igrica. Standardni URL: io-openui-ao.vercel.app`,
};

export default function IOOpenUIAOGamingPlatformaPage() {
  return <StranicaRenderer sekvence={ioOpenUIAOGamingSekvence} />;
}
