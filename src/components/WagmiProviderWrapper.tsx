'use client';

/**
 * 🔗 Wagmi Provider Wrapper — client-side
 *
 * Omogućava wagmi hooks u Next.js App Router arhitekturi.
 * Mora biti 'use client' jer koristi React Context.
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/blockchain/config';
import { useState } from 'react';

export default function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,    // 30 sekundi — blockchain podaci se retko menjaju
        gcTime: 5 * 60_000,   // 5 minuta cache
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
