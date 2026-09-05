# Persona Bank — Architecture & Integration Guide

> **SpajaUltraOmegaCore -∞Ω+∞ — Kompanija SPAJA — Digitalna Industrija**

## Overview

The **Persona Bank** is the unified registry for all AI personas across the AI-IQ-SUPER-PLATFORMA. Every agent (MAKSIMUS 2/3, ANOTHER MAKS, Nova Generacija, GIGATRON, etc.) reads from and writes to this single source of truth, enabling cross-platform persona sync, lifecycle management, and analytics.

---

## Canonical Schema

```ts
interface Persona {
  id: string;
  name: string;
  type: PersonaType;       // creative | analytical | gaming | gigatron | nova-generacija | another-maks | maksimus | generic
  octave: number;          // 1–16
  hipermrezaNode: number;  // 1–256
  attributes: {
    traits: string[];
    skills: string[];
    tone: string;
    domain: string;
    [key: string]: unknown;
  };
  status: 'active' | 'dormant' | 'archived';
  linkedAgents: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  crossRepoRef?: string;   // IO-OPENUI-AO persona id
  auditLog: PersonaAuditEntry[];
}
```

---

## Module Structure

```
src/lib/persona-bank/
  types.ts      — canonical TypeScript types
  store.ts      — in-memory CRUD store with versioning, locking, audit log
  client.ts     — PersonaBankClient class used by all agents
  seed.ts       — initial seed personas for all platform agents
  index.ts      — public exports + constants
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/persona-bank` | List all personas (filters: `type`, `status`, `octave`, `agent`) |
| `POST` | `/api/persona-bank` | Register a new persona or bulk import (`{ personas: [...] }`) |
| `GET` | `/api/persona-bank/[id]` | Get single persona with full audit history |
| `PUT` | `/api/persona-bank/[id]` | Update persona attributes |
| `POST` | `/api/persona-bank/[id]` | Archive (soft-delete) a persona |
| `GET` | `/api/persona-bank/stats` | Aggregate stats: total, by status/type/octave/agent, stale count, octave coverage |

All write endpoints require the `X-Agent-Id` header.

---

## Agent Integration

All agents use the shared `PersonaBankClient`:

```ts
import { createPersonaBankClient } from '@/lib/persona-bank';

const client = createPersonaBankClient('my-agent-id');

// Register
const persona = client.register({ name: 'My Persona', type: 'creative', octave: 3, ... });

// Read
const p = client.get('persona-id');

// Update
client.update('persona-id', { attributes: { tone: 'bold' } });

// Archive (soft-delete)
client.archive('persona-id');

// List with filter
const creativePersonas = client.list({ type: 'creative', status: 'active' });

// Stats
const stats = client.stats();

// Bulk import
const { imported, errors } = client.bulkImport([...]);
```

### Agent-specific registration

| Agent | Persona Type | Registers on |
|-------|-------------|--------------|
| `another-maks-agent` | `another-maks` | Startup |
| `ci-bot` / `maksimus-2` | `maksimus` | Startup |
| `nova-generacija-agent` | `nova-generacija` | Weekly sync |
| `gigatron-validator-agent` | `gigatron` | PR trigger |
| `gaming` (calculator-validator) | `gaming` | PR trigger |
| `extrimli-world-bank-persona-orchestrator` | `extrimli` | EXTRIMLI World Bank persona bridge apply trigger |

---

## Lifecycle & Health (persona-bank-agent)

Nightly cron (`0 2 * * *`) via `.github/workflows/persona-bank-validator.yml`:

1. Detects dormant personas not updated in > 30 days → auto-archives
2. Generates health report: active/dormant/archived counts, octave coverage
3. Flags personas with missing `traits`, `skills`, or `domain` attributes

**Performance KPIs:**
- Persona lookup: ≤ 10ms
- Bulk list (all personas): ≤ 50ms

---

## Security & Governance

- All write operations require `X-Agent-Id` header
- Sensitive attributes (credentials, keys) must never be stored — reference GitHub Secrets
- Every mutation appends to `auditLog`: `{ agentId, timestamp, changeType, diff }`
- PR label `persona-bank:change` is auto-applied by CI on any persona-bank path change

---

## Cross-Repo Sync

Persona Bank snapshots are synced to `spaja86/IO-OPENUI-AO` via the `multi-repo-sync-agent`. Conflict resolution uses last-write-wins with version check. Sync status is logged in `docs/MULTI-REPO-LINKS.md`.

See: [MULTI-REPO-LINKS.md](./MULTI-REPO-LINKS.md)

### EXTRIMLI World Bank integration path

- Bridge endpoint: `POST /api/extrimli/world-bank-persona` (`GET` for preview)
- Source inputs:
  - `/api/ai-iq-world-bank` (financial/operational business signals)
  - `/api/extrimli/health` + `/api/extrimli/extrondol` (risk/readiness + WAWE governance gate)
- Persona target: `extrimli-core`
- Governance behavior:
  - `HOLD` lifecycle when WAWE promotion is frozen or evidence is missing
  - Conservative status target (`dormant`) under degraded posture
  - Apply mode is authenticated by `x-extrimli-bridge-token` and writes audit entries with fixed agent id `extrimli-world-bank-persona-orchestrator`

---

## Testing

```bash
npx tsx src/tests/lib/persona-bank.test.ts
```

33 unit tests cover: registration, upsert, update, archive, list filters, stats, bulk import, lifecycle, client API, seed data.

---

## Seed Personas

Defined in `src/lib/persona-bank/seed.ts`:

| ID | Name | Type | Octave |
|----|------|------|--------|
| `another-maks` | ANOTHER MAKS — Kreativni Agent | `another-maks` | 1 |
| `maksimus-2` | MAKSIMUS 2 — Analitički Agent | `maksimus` | 2 |
| `maksimus-3` | MAKSIMUS 3 — Razvojni Agent | `maksimus` | 3 |
| `nova-generacija-orchestrator` | Nova Generacija — Orkestratorski Agent | `nova-generacija` | 4 |
| `gigatron-procurement` | GIGATRON — Procurement Agent | `gigatron` | 5 |
| `gaming-fairness` | Gaming Fairness — Validator | `gaming` | 6 |

---

## Constants

| Constant | Value |
|----------|-------|
| `PERSONA_BANK_CONTRACT_VERSION` | `1.0.0` |
| `PERSONA_BANK_MAX_OCTAVE` | `16` |
| `PERSONA_BANK_MAX_HIPERMREZA_NODE` | `256` |
