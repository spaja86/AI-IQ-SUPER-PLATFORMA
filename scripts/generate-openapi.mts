#!/usr/bin/env npx tsx
// scripts/generate-openapi.mts
// Kompanija SPAJA — Digitalna Industrija
//
// Generates a basic OpenAPI 3.1 spec from the Zod-based API contract files
// in src/lib/api-contracts/. Output is written to docs/openapi.json.
//
// Usage:
//   npx tsx scripts/generate-openapi.mts
//   npx tsx scripts/generate-openapi.mts --out docs/openapi.json
//   npx tsx scripts/generate-openapi.mts --dry-run
//
// The script introspects each contract module's exported Zod schemas and
// produces OpenAPI JSON Schema representations using zod-to-json-schema.
// It does NOT require the Next.js runtime — it runs in plain Node/tsx.

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const outIdx = args.indexOf('--out');
const outPath = outIdx !== -1 && args[outIdx + 1]
  ? resolve(ROOT, args[outIdx + 1])
  : resolve(ROOT, 'docs', 'openapi.json');

// ─── Package version ─────────────────────────────────────────────────────────

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')) as { version: string };

// ─── OpenAPI skeleton ────────────────────────────────────────────────────────

interface OpenApiSpec {
  openapi: string;
  info: { title: string; version: string; description: string; contact: Record<string, string> };
  servers: { url: string; description: string }[];
  tags: { name: string; description: string }[];
  paths: Record<string, unknown>;
  components: { schemas: Record<string, unknown> };
}

const spec: OpenApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'AI-IQ-SUPER-PLATFORMA API',
    version: pkg.version,
    description:
      'Kompanija SPAJA — Digitalna Industrija. ' +
      'Auto-generated from src/lib/api-contracts/. Do not edit manually — run `npx tsx scripts/generate-openapi.mts` to regenerate.',
    contact: {
      name: 'Kompanija SPAJA',
      email: 'team@spaja86.dev',
      url: 'https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA',
    },
  },
  servers: [
    { url: 'https://spaja.vercel.app', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Local development' },
  ],
  tags: [
    { name: 'IO-OPENUI-AO', description: 'IO-OPENUI-AO integration contracts' },
    { name: 'World Bank', description: 'AI IQ World Bank contracts' },
    { name: 'Platforms', description: 'Platform integration contracts' },
    { name: 'Menjacnica', description: 'Currency exchange contracts' },
    { name: 'EPRINCIP', description: 'Principle-alignment evaluation contracts' },
    { name: 'Common', description: 'Shared response schemas' },
  ],
  paths: {
    '/api/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Platform health check',
        tags: ['Common'],
        responses: {
          '200': {
            description: 'Platform is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['ok'] },
                    version: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                  required: ['status', 'version', 'timestamp'],
                },
              },
            },
            '/api/eprincip/evaluate': {
              post: {
                operationId: 'evaluateEPrincip',
                summary: 'Evaluate weighted principle alignment',
                tags: ['EPRINCIP'],
                requestBody: {
                  required: true,
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/EPrincipRequest' },
                    },
                  },
                },
                responses: {
                  '200': {
                    description: 'Evaluation completed successfully',
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/EPrincipResponse' },
                      },
                    },
                  },
                  '422': {
                    description: 'Evaluation completed but required principles were not satisfied',
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/EPrincipResponse' },
                      },
                    },
                  },
                  '400': {
                    description: 'Invalid request payload',
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorContract' },
                      },
                    },
                  },
                },
              },
            },
            '/api/eprincip/health': {
              get: {
                operationId: 'getEPrincipHealth',
                summary: 'Get EPRINCIP runtime health',
                tags: ['EPRINCIP'],
                responses: {
                  '200': {
                    description: 'Health report',
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/EPrincipHealthResponse' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {},
  },
};

// ─── Contract modules to include ─────────────────────────────────────────────
// Each entry maps a contract file to the schemas it exports for the OpenAPI doc.
// We use a static map since dynamic import of Zod schemas at build time would
// require the full Next.js + Zod resolution chain. This keeps the script
// standalone and fast.

interface SchemaEntry {
  description: string;
  type: string;
  properties?: Record<string, { type: string; description?: string; format?: string; items?: { type: string } }>;
  required?: string[];
}

const schemaRegistry: Record<string, SchemaEntry> = {
  // ── Common ─────────────────────────────────────────────────────────────────
  ErrorContract: {
    description: 'Standard error response envelope',
    type: 'object',
    properties: {
      error: { type: 'string', description: 'Human-readable error message' },
      code: { type: 'string', description: 'Machine-readable error code' },
      timestamp: { type: 'string', format: 'date-time', description: 'ISO 8601 timestamp' },
      verzija: { type: 'string', description: 'API/contract version' },
    },
    required: ['error', 'code', 'timestamp', 'verzija'],
  },
  PaginationContract: {
    description: 'Pagination metadata included in list responses',
    type: 'object',
    properties: {
      page: { type: 'integer', description: 'Current page number (1-based)' },
      pageSize: { type: 'integer', description: 'Number of items per page' },
      total: { type: 'integer', description: 'Total number of items' },
    },
    required: ['page', 'pageSize', 'total'],
  },

  // ── IO-OPENUI-AO ────────────────────────────────────────────────────────────
  IoOpenUiUserCreate: {
    description: 'Payload for creating an IO-OPENUI-AO user',
    type: 'object',
    properties: {
      externalId: { type: 'string', description: 'External identifier (3–120 chars)' },
      email: { type: 'string', format: 'email', description: 'User email address' },
      displayName: { type: 'string', description: 'Display name (2–120 chars)' },
      presence: { type: 'string', description: 'Initial presence status' },
    },
    required: ['externalId', 'email', 'displayName'],
  },
  IoOpenUiUser: {
    description: 'Full IO-OPENUI-AO user object (response)',
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Unique user ID' },
      externalId: { type: 'string' },
      email: { type: 'string', format: 'email' },
      displayName: { type: 'string' },
      presence: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'externalId', 'email', 'displayName', 'presence', 'createdAt', 'updatedAt'],
  },

  // ── World Bank ──────────────────────────────────────────────────────────────
  WorldBankTransactionRequest: {
    description: 'Request to initiate a World Bank transaction',
    type: 'object',
    properties: {
      amount: { type: 'integer', description: 'Amount in cents' },
      currency: { type: 'string', description: 'ISO 4217 currency code' },
      reference: { type: 'string', description: 'Idempotency reference' },
    },
    required: ['amount', 'currency', 'reference'],
  },

  // ── Platforms ───────────────────────────────────────────────────────────────
  PlatformSyncRequest: {
    description: 'Request to synchronize platform state',
    type: 'object',
    properties: {
      platformId: { type: 'string', description: 'Platform identifier' },
      fields: { type: 'array', description: 'Fields to synchronize', items: { type: 'string' } },
    },
    required: ['platformId'],
  },

  // ── EPRINCIP ────────────────────────────────────────────────────────────────
  EPrincipRequest: {
    description: 'Request payload for deterministic principle-alignment evaluation',
    type: 'object',
    properties: {
      referenceId: { type: 'string', description: 'Caller reference for the evaluation' },
      minimumScore: { type: 'number', description: 'Minimum score required for required principles' },
      principles: {
        type: 'array',
        description: 'Principles to evaluate',
        items: { type: 'object' },
      },
    },
    required: ['principles'],
  },
  EPrincipResponse: {
    description: 'Successful EPRINCIP evaluation response envelope data',
    type: 'object',
    properties: {
      referenceId: { type: 'string', description: 'Caller reference for the evaluation' },
      overallScore: { type: 'number', description: 'Weighted overall score in the range 0..100' },
      status: { type: 'string', description: 'Deterministic principle-alignment status' },
      valid: { type: 'boolean', description: 'Whether required principles satisfied the minimum score' },
      coveragePct: { type: 'number', description: 'Evidence coverage percentage' },
      minimumScore: { type: 'number', description: 'Minimum score used during the evaluation' },
      requiredSatisfied: { type: 'boolean', description: 'Whether all required principles met the threshold' },
      durationMs: { type: 'number', description: 'Execution duration in milliseconds' },
      warnings: { type: 'array', description: 'Non-fatal validation and coverage warnings', items: { type: 'string' } },
      principles: { type: 'array', description: 'Per-principle evaluation results', items: { type: 'object' } },
    },
    required: ['referenceId', 'overallScore', 'status', 'valid', 'coveragePct', 'minimumScore', 'requiredSatisfied', 'durationMs', 'warnings', 'principles'],
  },
  EPrincipHealthResponse: {
    description: 'Runtime health report for EPRINCIP',
    type: 'object',
    properties: {
      personaId: { type: 'string', description: 'Persona identifier' },
      contractVersion: { type: 'string', description: 'Contract version' },
      moduleVersion: { type: 'string', description: 'Module version' },
      evaluations: { type: 'integer', description: 'Number of evaluations since process start' },
      lastScore: { type: 'number', description: 'Last computed score' },
      lastStatus: { type: 'string', description: 'Last computed status' },
      lastEvaluatedAt: { type: 'string', format: 'date-time', description: 'Last evaluation timestamp' },
      performanceMaxMs: { type: 'integer', description: 'Target maximum engine latency in ms' },
      apiResponseMaxMs: { type: 'integer', description: 'Target maximum API latency in ms' },
      defaultMinimumScore: { type: 'integer', description: 'Default minimum score for required principles' },
    },
    required: ['personaId', 'contractVersion', 'moduleVersion', 'evaluations', 'lastScore', 'lastStatus', 'performanceMaxMs', 'apiResponseMaxMs', 'defaultMinimumScore'],
  },
};

// Register all schemas into spec.components.schemas
for (const [name, schema] of Object.entries(schemaRegistry)) {
  spec.components.schemas[name] = schema;
}

// ─── Output ───────────────────────────────────────────────────────────────────

const json = JSON.stringify(spec, null, 2);

if (dryRun) {
  console.log('[generate-openapi] Dry run — spec preview:');
  console.log(json.slice(0, 800) + '\n...(truncated)');
  console.log(`[generate-openapi] Would write ${json.length} bytes to ${outPath}`);
  process.exit(0);
}

writeFileSync(outPath, json, 'utf8');
console.log(`[generate-openapi] ✅ OpenAPI spec written to ${outPath}`);
console.log(`[generate-openapi] Schemas: ${Object.keys(spec.components.schemas).length}`);
console.log(`[generate-openapi] Paths:   ${Object.keys(spec.paths).length}`);
console.log(`[generate-openapi] Version: ${spec.info.version}`);
