import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ioOpenUIAOGamingSekvence } from '@/lib/sekvence/io-openui-ao-gaming-platforma-page';
import { TOTAL_IGRICA } from '@/lib/constants';
import { GAMING_DOMAIN_VERSION } from '@/lib/io-openui-ao-gaming-platforma';

export const metadata: Metadata = {
  title: 'IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin',
  description: `IO/OPENUI/AO Gaming Platforma v${GAMING_DOMAIN_VERSION} - SPAJA Univerzalni Endzin prevucen preko svih ${TOTAL_IGRICA} igrica. Standardni URL: io-openui-ao.vercel.app`,
};

export default function IOOpenUIAOGamingPlatformaPage() {
  return <StranicaRenderer sekvence={ioOpenUIAOGamingSekvence} />;
}
