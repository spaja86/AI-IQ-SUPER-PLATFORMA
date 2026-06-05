import { z } from 'zod';

export const WorldBankAccountCreateSchema = z.object({
  userId: z.string().uuid(),
  accountNumber: z.string().min(10).max(34),
  currency: z.string().min(3).max(5).default('USD'),
  blockchainAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  initialBalance: z.number().nonnegative().default(0),
});

export const WorldBankAccountSchema = WorldBankAccountCreateSchema.extend({
  id: z.string().uuid(),
  balance: z.number().nonnegative(),
  status: z.enum(['active', 'blocked']).default('active'),
  createdAt: z.string().datetime(),
});

export const WorldBankTransactionCreateSchema = z.object({
  fromAccountId: z.string().uuid(),
  toAccountId: z.string().uuid(),
  amount: z.number().positive(),
  txHash: z.string().min(10),
});

export const WorldBankTransactionSchema = WorldBankTransactionCreateSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'failed']),
  createdAt: z.string().datetime(),
});

export type WorldBankAccountCreate = z.infer<typeof WorldBankAccountCreateSchema>;
export type WorldBankAccount = z.infer<typeof WorldBankAccountSchema>;
export type WorldBankTransactionCreate = z.infer<typeof WorldBankTransactionCreateSchema>;
export type WorldBankTransaction = z.infer<typeof WorldBankTransactionSchema>;
