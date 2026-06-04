import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { PlatformSyncRequestSchema } from '@/lib/api-contracts/platforms';
import { enforceGatewayMiddleware } from '@/lib/platform-gateway/middleware';
import { emitWithRetry } from '@/lib/realtime/event-bus';
import { syncTradeNotification } from '@/lib/realtime/trade-sync';
import { syncWalletUpdate } from '@/lib/realtime/wallet-sync';

const WalletUpdatePayloadSchema = z.object({
  walletId: z.string().min(1),
  userId: z.string().min(1),
  balance: z.number(),
  currency: z.string().min(1),
});

const TradeExecutedPayloadSchema = z.object({
  tradeId: z.string().min(1),
  userId: z.string().min(1),
  fromCurrency: z.string().min(1),
  toCurrency: z.string().min(1),
  amount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const security = await enforceGatewayMiddleware(request, 'world-bank', 'platforms:sync');
    if (!security.ok) return security.response;

    const raw = (await request.json()) as unknown;
    const parsed = PlatformSyncRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return apiError('BAD_REQUEST', 'Invalid sync payload.', parsed.error.flatten());
    }

    const { sourcePlatform, targetPlatform, eventType, payload } = parsed.data;

    if (eventType === 'wallet.updated') {
      const parsedPayload = WalletUpdatePayloadSchema.safeParse(payload);
      if (!parsedPayload.success) {
        return apiError('BAD_REQUEST', 'Invalid wallet.updated payload.', parsedPayload.error.flatten());
      }
      await syncWalletUpdate({
        walletId: parsedPayload.data.walletId,
        userId: parsedPayload.data.userId,
        balance: parsedPayload.data.balance,
        currency: parsedPayload.data.currency,
        sourcePlatform,
      });
    } else if (eventType === 'trade.executed') {
      const parsedPayload = TradeExecutedPayloadSchema.safeParse(payload);
      if (!parsedPayload.success) {
        return apiError('BAD_REQUEST', 'Invalid trade.executed payload.', parsedPayload.error.flatten());
      }
      await syncTradeNotification({
        tradeId: parsedPayload.data.tradeId,
        userId: parsedPayload.data.userId,
        fromCurrency: parsedPayload.data.fromCurrency,
        toCurrency: parsedPayload.data.toCurrency,
        amount: parsedPayload.data.amount,
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
