# ChatGPT Katalog

> SpajaUltraOmegaCore -∞Ω+∞ — Kompanija SPAJA — Digitalna Industrija

## Overview

**ChatGPT Katalog** is a structured catalog of OpenAI/ChatGPT models, tools, and use-case templates for the AI-IQ-SUPER-PLATFORMA. It enables platform users to search, compare, and integrate ChatGPT/OpenAI resources with a clean API contract.

| Attribute | Value |
|-----------|-------|
| Persona ID | `chatgpt-katalog-core` |
| Module Version | `1.0.0` |
| Contract Version | `v1` |
| Octave | 10 |
| Hipermreza Node | 81 |
| Linked Modules | Nova Generacija, Persona Bank, Digit Engine (node 80 ↔ 81) |

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
| ID | Name | Context | Status | Speed |
|----|------|---------|--------|-------|
| `gpt-4o` | GPT-4o | 128,000 | active | fast |
| `gpt-4o-mini` | GPT-4o mini | 128,000 | active | fast |
| `gpt-4-turbo` | GPT-4 Turbo | 128,000 | active | medium |
| `gpt-3.5-turbo` | GPT-3.5 Turbo | 16,385 | legacy | fast |
| `o1` | o1 | 200,000 | active | slow |
| `o1-mini` | o1-mini | 128,000 | active | medium |
| `o3-mini` | o3-mini | 200,000 | active | fast |
| `gpt-4` | GPT-4 | 8,192 | deprecated | slow |

### Tools (8)
`dalle-3`, `whisper-1`, `tts-1`, `embeddings-3-small`, `embeddings-3-large`, `fine-tuning`, `moderation`, `assistants-api`

### Use Cases (8)
`uc-customer-support`, `uc-code-review`, `uc-data-analysis`, `uc-math-reasoning`, `uc-document-summarization`, `uc-image-analysis`, `uc-semantic-search`, `uc-content-moderation`

---

## API Contract

### `GET /api/chatgpt-katalog`
List all entries with optional filters and pagination.

**Query params:** `query`, `type` (model|tool|use-case), `category`, `domain`, `tags`, `status`, `page`, `pageSize`, `sortBy`

```json
{
  "data": {
    "entries": [...],
    "total": 24,
    "page": 1,
    "pageSize": 20,
    "totalPages": 2,
    "disclaimer": "...",
    "contractVersion": "v1",
    "evaluationMs": 1.2
  }
}
```

---

### `GET /api/chatgpt-katalog/[id]`
Get a single entry by ID.

**Response 200:**
```json
{ "data": { "type": "model", "id": "gpt-4o", "name": "GPT-4o", ... } }
```
**Response 404:** Entry not found.

---

### `POST /api/chatgpt-katalog/search`
Search with a JSON body.

**Request:**
```json
{
  "query": "reasoning",
  "type": "model",
  "status": "active",
  "sortBy": "price-asc",
  "page": 1,
  "pageSize": 10
}
```

---

### `POST /api/chatgpt-katalog/compare`
Side-by-side comparison of 2–4 models.

**Request:**
```json
{ "modelIds": ["gpt-4o", "gpt-4o-mini", "o3-mini"] }
```

**Response:**
```json
{
  "data": {
    "models": [{ "modelId": "gpt-4o", "contextWindow": 128000, "inputPricePer1k": 0.005, ... }],
    "capabilityUnion": ["audio", "function-calling", "text", "vision", ...],
    "cheapestModelId": "gpt-4o-mini",
    "largestContextModelId": "gpt-4o",
    "fastestModelId": "gpt-4o",
    "disclaimer": "...",
    "contractVersion": "v1",
    "evaluationMs": 0.8
  }
}
```

---

### `POST /api/chatgpt-katalog/recommend`
Recommend the best model/tools for a domain and budget.

**Request:**
```json
{
  "domain": "customer-service",
  "budget": 5,
  "requiredCapabilities": ["text"],
  "preferSpeed": false
}
```

**Response:**
```json
{
  "data": {
    "recommendedModel": { "id": "gpt-4o-mini", ... },
    "alternativeModels": [...],
    "recommendedTools": [...],
    "relevantUseCases": [...],
    "reasoning": "Recommended GPT-4o mini for domain \"customer-service\" within budget of $5/1M tokens (cost-optimized).",
    "disclaimer": "...",
    "contractVersion": "v1",
    "evaluationMs": 0.5
  }
}
```

---

### `GET /api/chatgpt-katalog/health`
Module health and KPI status.

**Response:**
```json
{
  "data": {
    "status": "ok",
    "personaId": "chatgpt-katalog-core",
    "moduleVersion": "1.0.0",
    "contractVersion": "v1",
    "octave": 10,
    "hipermrezaNode": 81,
    "modelCount": 8,
    "toolCount": 8,
    "useCaseCount": 8,
    "totalEntries": 24,
    "activeModelCount": 6,
    "lastUpdated": "2026-08-18T15:00:00.000Z",
    "kpi": { "searchMaxMs": 50, "compareMaxMs": 100, "apiResponseMaxMs": 200, "registryLookupMaxMs": 10 }
  }
}
```

---

## Response Headers

All endpoints set these headers:
- `X-ChatGPT-Katalog-Contract-Version: v1`
- `X-ChatGPT-Katalog-Module-Version: 1.0.0`
- `X-ChatGPT-Katalog-Persona-Id: chatgpt-katalog-core`
- `X-ChatGPT-Katalog-Slug: chatgpt-katalog`

---

## File Structure

```
src/lib/chatgpt-katalog/
  types.ts              — All TypeScript types and constants
  registry.ts           — Static GPT model/tool/use-case catalog
  search-engine.ts      — Full-text + filter + sort + pagination
  compare-engine.ts     — Side-by-side model comparison
  recommendation-engine.ts — Domain+budget model recommendation
  katalog-engine.ts     — Health report + response headers
  index.ts              — Public exports

src/app/api/chatgpt-katalog/
  route.ts              — GET (list)
  [id]/route.ts         — GET by ID
  search/route.ts       — POST search
  compare/route.ts      — POST compare
  recommend/route.ts    — POST recommend
  health/route.ts       — GET health

src/components/chatgpt-katalog/
  index.tsx             — ModelCard, ToolCard, UseCaseCard, CompareTable,
                          RecommendationPanel, ChatGPTKatalogBrowser

src/tests/lib/chatgpt-katalog.test.ts    — 37 unit tests
src/tests/api/chatgpt-katalog-route.test.ts — 16 route tests
```

---

## Agent Integration

- **Validator**: `chatgpt-katalog-validator-agent`
- **Workflow**: `.github/workflows/chatgpt-katalog-validator.yml`
- **Trigger labels**: `chatgpt-katalog:logic-change`
- **Auto-labels**: `chatgpt-katalog:validated` / `chatgpt-katalog:needs-review`
- **Config**: `.agent-config.json` → `chatgpt-katalog-validator-agent`

---

## Disclaimer

> ChatGPT Katalog rezultati su automatski generisani. Informacije o modelima, cenama i performansama su referentne i mogu se razlikovati od aktuelnih OpenAI podataka.
