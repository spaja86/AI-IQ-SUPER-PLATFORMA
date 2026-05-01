import type { Metadata } from 'next';
import WagmiProviderWrapper from '@/components/WagmiProviderWrapper';
import BlockchainTransakcije from '@/components/BlockchainTransakcije';

export const metadata: Metadata = {
  title: 'Blockchain — Pametni Ugovor',
  description: 'AI IQ World Bank pametni ugovor na Polygon blockchain-u — svaka transakcija je javno proverljiva na polygonscan.com',
};

export default function BlockchainPage() {
  return (
    <WagmiProviderWrapper>
      <BlockchainTransakcije />
    </WagmiProviderWrapper>
  );
}
