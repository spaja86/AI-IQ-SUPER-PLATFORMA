import { z } from 'zod';
import { IoOpenUiUserSchema } from './io-openui';
import { MenjaNicaTradeSchema, MenjaNicaWalletSchema } from './menja-nica';
import { WorldBankAccountSchema, WorldBankTransactionSchema } from './world-bank';

export const PlatformIdSchema = z.enum(['io-openui-ao', 'menja-nica', 'world-bank']);
export type PlatformId = z.infer<typeof PlatformIdSchema>;

export const PlatformResourceSchema = z.enum(['users', 'wallets', 'trades', 'accounts', 'transactions']);

export const PlatformEntitySchema = z.union([
  IoOpenUiUserSchema,
  MenjaNicaWalletSchema,
  MenjaNicaTradeSchema,
  WorldBankAccountSchema,
  WorldBankTransactionSchema,
]);

export const PlatformSyncRequestSchema = z.object({
  sourcePlatform: PlatformIdSchema,
  targetPlatform: PlatformIdSchema.optional(),
  eventType: z.string().min(3),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export function getPlatformsOpenApiSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'AI-IQ Unified Platform Gateway',
      version: '1.0.0',
      description: 'Type-safe contracts for IO-OPENUI-AO, Menja-nica, and World Bank integrations.',
    },
    paths: {
      '/api/platforms/{platformId}/{resource}': {
        post: { summary: 'Create entity on target platform' },
        get: { summary: 'Fetch entity by id from target platform' },
      },
      '/api/platforms/health': { get: { summary: 'Unified platform health check' } },
      '/api/platforms/sync': { post: { summary: 'Trigger cross-platform synchronization' } },
    },
  };
}
