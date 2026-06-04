import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { PlatformSyncRequestSchema } from '@/lib/api-contracts/platforms';
import { enforceGatewayMiddleware } from '@/lib/platform-gateway/middleware';
import { emitWithRetry } from '@/lib/realtime/event-bus';
import { syncTradeNotification } from '@/lib/realtime/trade-sync';
import { syncWalletUpdate } from '@/lib/realtime/wallet-sync';

export async function POST(request: NextRequest) {
  try {
    const security = await enforceGatewayMiddleware(request, 'world-bank', 'platforms:sync');
    if (!security.ok) return security.response;

    const raw = (await request.json()) as unknown;
    const parsed = PlatformSyncRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return apiError('BAD_REQUEST', 'Nevalidan sync payload.', parsed.error.flatten());
    }

    const { sourcePlatform, targetPlatform, eventType, payload } = parsed.data;

    if (eventType === 'wallet.updated') {
      await syncWalletUpdate({
        walletId: String(payload['walletId'] ?? ''),
        userId: String(payload['userId'] ?? ''),
        balance: Number(payload['balance'] ?? 0),
        currency: String(payload['currency'] ?? 'USD'),
        sourcePlatform,
      });
    } else if (eventType === 'trade.executed') {
      await syncTradeNotification({
        tradeId: String(payload['tradeId'] ?? ''),
        userId: String(payload['userId'] ?? ''),
        fromCurrency: String(payload['fromCurrency'] ?? ''),
        toCurrency: String(payload['toCurrency'] ?? ''),
        amount: Number(payload['amount'] ?? 0),
        sourcePlatform,
      });
    } else {
      await emitWithRetry({
        type: 'sync.triggered',
        sourcePlatform,
        targetPlatform,
        payload,
        createdAt: new Date().toISOString(),
      });
    }

    return apiSuccess({
      triggered: true,
      sourcePlatform,
      targetPlatform: targetPlatform ?? 'all',
      eventType,
      payload,
    });
  } catch (error) {
    return apiInternalError('platform-sync', error);
  }
}
