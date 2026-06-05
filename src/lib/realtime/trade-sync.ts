import { broadcastToPlatforms } from './platform-broadcaster';

export async function syncTradeNotification(input: {
  tradeId: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  sourcePlatform?: string;
}) {
  await broadcastToPlatforms({
    type: 'trade.executed',
    sourcePlatform: input.sourcePlatform ?? 'menja-nica',
    payload: {
      tradeId: input.tradeId,
      userId: input.userId,
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      amount: input.amount,
    },
    createdAt: new Date().toISOString(),
  });

  return { synced: true, channel: 'trade.executed' };
}
