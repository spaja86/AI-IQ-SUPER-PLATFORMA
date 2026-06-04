import { broadcastToPlatforms } from './platform-broadcaster';

export async function syncWalletUpdate(input: {
  walletId: string;
  userId: string;
  balance: number;
  currency: string;
  sourcePlatform?: string;
}) {
  await broadcastToPlatforms({
    type: 'wallet.updated',
    sourcePlatform: input.sourcePlatform ?? 'world-bank',
    payload: {
      walletId: input.walletId,
      userId: input.userId,
      balance: input.balance,
      currency: input.currency,
    },
    createdAt: new Date().toISOString(),
  });

  return { synced: true, channel: 'wallet.updated' };
}
