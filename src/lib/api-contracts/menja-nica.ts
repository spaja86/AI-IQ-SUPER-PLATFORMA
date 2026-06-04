import { z } from 'zod';

export const MenjaNicaWalletCreateSchema = z.object({
  userId: z.string().uuid(),
  cryptocurrency: z.string().min(2).max(16),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  balance: z.number().nonnegative().default(0),
});

export const MenjaNicaWalletSchema = MenjaNicaWalletCreateSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['active', 'blocked']).default('active'),
  createdAt: z.string().datetime(),
});

export const MenjaNicaTradeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fromCurrency: z.string().min(2).max(16),
  toCurrency: z.string().min(2).max(16),
  fromAmount: z.number().positive(),
  toAmount: z.number().positive(),
  status: z.enum(['pending', 'executed', 'failed']),
  txHash: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type MenjaNicaWalletCreate = z.infer<typeof MenjaNicaWalletCreateSchema>;
export type MenjaNicaWallet = z.infer<typeof MenjaNicaWalletSchema>;
export type MenjaNicaTrade = z.infer<typeof MenjaNicaTradeSchema>;
