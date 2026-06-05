import { z } from 'zod';

export const ErrorContractSchema = z.object({
  error: z.string(),
  code: z.string(),
  timestamp: z.string(),
  verzija: z.string(),
  details: z.unknown().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative().default(0),
});

export const OpenApiOperationMetaSchema = z.object({
  summary: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  operationId: z.string(),
});

export function toSuccessResponse<T>(data: T) {
  return {
    data,
    timestamp: new Date().toISOString(),
  };
}
