import { z } from 'zod';

export const IoOpenUiUserCreateSchema = z.object({
  externalId: z.string().min(3).max(120),
  email: z.string().email(),
  displayName: z.string().min(2).max(120),
  presence: z.enum(['online', 'away', 'offline']).default('online'),
});

export const IoOpenUiUserSchema = IoOpenUiUserCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IoOpenUiUserCreate = z.infer<typeof IoOpenUiUserCreateSchema>;
export type IoOpenUiUser = z.infer<typeof IoOpenUiUserSchema>;
