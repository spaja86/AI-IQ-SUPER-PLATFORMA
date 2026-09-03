# ChatGPT Katalog

> SpajaUltraOmegaCore -∞Ω+∞ — Kompanija SPAJA — Digitalna Industrija

## Overview

**ChatGPT Katalog** is the repository’s primary discovery-and-recommendation surface for OpenAI/ChatGPT models, tools, and use-case templates inside AI-IQ-SUPER-PLATFORMA. It supports three core user flows with one shared source of truth in `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/lib/chatgpt-katalog`:

- catalog browsing and filtering
- side-by-side model comparison
- domain + budget recommendation

This module is intentionally **not** a live ChatGPT chat assistant. It is a curated static-reference catalog that helps users choose the right model or tool before implementation.

| Attribute | Value |
|-----------|-------|
| Persona ID | `chatgpt-katalog-core` |
| Module Version | `1.1.0` |
| Contract Version | `v1` |
| Scope | `discovery-and-recommendation` |
| Catalog Mode | `static-reference` |
| Octave | 10 |
| Hipermreza Node | 81 |
| Primary UI Page | `/chatgpt-katalog` |
| Linked Modules | Nova Generacija, Persona Bank, Digit Engine |
| Linked Repo | `spaja86/IO-OPENUI-AO` |

---

## Scope Boundaries

### Included
- browse models, tools, and templates from one UI
- compare 2–4 models on cost, speed, context, and capabilities
- recommend models based on domain, budget, and required capabilities
- expose stable metadata for linked modules and downstream consumers

### Excluded
- real-time syncing from OpenAI
- direct prompt execution or hosted chat sessions
- automatic writes to downstream linked repositories

---

## Static-Catalog Behavior

The registry is a **referential static catalog**. It is optimized for stability, repeatable tests, and predictable UI behavior.

Use this mode when:
- consistent automated tests matter more than live vendor updates
- downstream repos need a stable integration contract
- recommendation and comparison logic should not change unexpectedly

If live vendor refresh is ever required, it should be added as a **controlled sync process** rather than replacing the static registry contract.

---

## KPI Targets

| Metric | Target |
|--------|--------|
| Search evaluation | ≤ 50ms |
| Compare evaluation | ≤ 100ms |
| API response | ≤ 200ms |
| Registry lookup | ≤ 10ms |
| Test coverage | ≥ 90% |

---

## Registry Contents

### Models (8)
`gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`, `o1`, `o1-mini`, `o3-mini`, `gpt-4`

### Tools (10)
`dalle-3`, `whisper-1`, `tts-1`, `embeddings-3-small`, `embeddings-3-large`, `fine-tuning`, `moderation`, `assistants-api`, `responses-api`, `batch-api`

### Use Cases (10)
`uc-customer-support`, `uc-code-review`, `uc-data-analysis`, `uc-math-reasoning`, `uc-document-summarization`, `uc-image-analysis`, `uc-semantic-search`, `uc-content-moderation`, `uc-rag-assistant`, `uc-agentic-workflow`

---

## Primary UI Flow

`/chatgpt-katalog` is the main user-facing entry point.

It combines:
- catalog health snapshot
- advanced filters for type, status, capabilities, and input cost
- grouped result browsing (models, tools, use cases)
- compare staging for up to 4 models
- recommendation flow with direct compare handoff

---

## API Contract

### `GET /api/chatgpt-katalog`
List all entries with optional filters and pagination.

**Query params:** `query`, `type` (`model|tool|use-case`), `category`, `domain`, `tags`, `capabilities`, `status`, `page`, `pageSize`, `sortBy`, `maxInputCostPer1k`

**Response shape highlights:**
- `entries`
- `summary.models`
- `summary.tools`
- `summary.useCases`
- `summary.activeModels`
- `summary.matchedCapabilities`
- `summary.catalogMode`
- `summary.scope`

---

### `GET /api/chatgpt-katalog/[id]`
Get a single entry by ID.

**Response 200:**
```json
{ "data": { "type": "model", "id": "gpt-4o", "name": "GPT-4o" } }
```

**Response 404:** Entry not found.

---

### `POST /api/chatgpt-katalog/search`
Search with a JSON body.

**Request example:**
```json
{
  "query": "reasoning",
  "type": "model",
  "capabilities": ["structured-outputs"],
  "maxInputCostPer1k": 0.005,
  "sortBy": "price-asc",
  "page": 1,
  "pageSize": 10
}
```

---

### `POST /api/chatgpt-katalog/compare`
Side-by-side comparison of 2–4 models.

**Response highlights:**
- `models`
- `capabilityUnion`
- `sharedCapabilities`
- `cheapestModelId`
- `largestContextModelId`
- `fastestModelId`
- `tradeoffs`

---

### `POST /api/chatgpt-katalog/recommend`
Recommend the best model/tools for a domain and budget.

**Request example:**
```json
{
  "domain": "software-development",
  "budget": 10,
  "requiredCapabilities": ["function-calling", "structured-outputs"],
  "preferSpeed": false
}
```

**Response highlights:**
- `recommendedModel`
- `alternativeModels`
- `recommendedTools`
- `relevantUseCases`
- `matchedUseCases`
- `budgetFit`
- `budgetPerMillionTokens`
- `candidateCount`
- `catalogMode`
- `scope`

---

### `GET /api/chatgpt-katalog/health`
Module health and KPI status.

**Response highlights:**
- `scope`
- `catalogMode`
- `linkedModules`
- `linkedRepos`
- `modelCount`
- `toolCount`
- `useCaseCount`
- `activeModelCount`

---

## Response Headers

All endpoints set these headers:
- `X-ChatGPT-Katalog-Contract-Version: v1`
- `X-ChatGPT-Katalog-Module-Version: 1.1.0`
- `X-ChatGPT-Katalog-Persona-Id: chatgpt-katalog-core`
- `X-ChatGPT-Katalog-Slug: chatgpt-katalog`
- `X-ChatGPT-Katalog-Display-Name: ChatGPT Katalog`

---

## Integration Boundaries

### Persona Bank
- consumes stable persona metadata (`chatgpt-katalog-core`)
- can reference health and registry metadata without requiring live vendor access

### Digit Engine
- neighboring node relationship remains `digit-engine` node 80 ↔ `chatgpt-katalog` node 81
- useful for catalog/index classification and linked module discovery

### Nova Generacija
- can consume recommendation and comparison outputs as a selection layer before AI workflow activation

### Linked repo: `spaja86/IO-OPENUI-AO`
- downstream adoption should consume the stable APIs rather than copying registry logic
- any future sync should snapshot the registry instead of depending on runtime scraping

---

## File Structure

```text
src/lib/chatgpt-katalog/
  types.ts
  registry.ts
  search-engine.ts
  compare-engine.ts
  recommendation-engine.ts
  katalog-engine.ts
  index.ts

src/app/chatgpt-katalog/
  page.tsx

src/app/api/chatgpt-katalog/
  route.ts
  [id]/route.ts
  search/route.ts
  compare/route.ts
  recommend/route.ts
  health/route.ts

src/components/chatgpt-katalog/
  index.tsx

src/tests/lib/chatgpt-katalog.test.ts
src/tests/api/chatgpt-katalog-route.test.ts
```

---

## Governance

- **Validator**: `chatgpt-katalog-validator-agent`
- **Workflow**: `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/.github/workflows/chatgpt-katalog-validator.yml`
- **Trigger labels**: `chatgpt-katalog:logic-change`
- **Auto-labels**: `chatgpt-katalog:validated` / `chatgpt-katalog:needs-review`
- **Config**: `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/.agent-config.json` → `chatgpt-katalog-validator-agent`

---

## Disclaimer

> ChatGPT Katalog rezultati su automatski generisani. Informacije o modelima, cenama i performansama su referentne i mogu se razlikovati od aktuelnih OpenAI podataka.
