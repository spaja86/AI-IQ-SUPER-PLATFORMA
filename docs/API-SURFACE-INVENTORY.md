# API Surface Inventory

## Snapshot

Generated on: **2026-09-05**

Generation source:
- `python` aggregation over `src/app/api/**/route.ts`
- `python` aggregation over `src/tests/**/.test.*`

- Total route handlers (`src/app/api/**/route.ts`): **1480**
- Test suites:
  - `src/tests/lib`: **121**
  - `src/tests/api`: **41**
  - `src/tests/autofinish`: **1486**

## Highest-volume API domains (top-level)

| Domain | Route count | Owner scope |
|---|---:|---|
| `kripto-trezor` | 32 | Finance / treasury |
| `extrimli` | 22 | Extrimli core |
| `spaja-pro` | 18 | Platform engine |
| `extrimli-cuz` | 12 | Extrimli community |
| `auth` | 11 | Auth & identity |
| `chatgpt-katalog` | 6 | AI catalog |
| `gigatron` | 6 | Procurement / catalog |
| `repozit` | 3 | Repository management |

## Critical modules (contract locked)

- `extrimli`
- `gigatron`
- `duet`
- `digit-engine` (API slug: `digitron`)
- `repozit`

`digit-engine` remains the logic-level module surface; `digitron` is its API route slug.
This is a documented legacy compatibility exception under `docs/NAMING-CONVENTIONS.md`.

See: `docs/API-CONTRACT-STATUS.md`.

## Rationalization candidates

1. **Alias namespaces**
   - `konvencionalni-odnosi` and `konvenkcionalni-odnosi` both exist.
   - Canonical/alias mapping is defined in `docs/NAMING-CONVENTIONS.md`.
2. **Large legacy/autofinish surfaces**
   - Keep out of canonical PR test path unless high-risk or governance/config changes.
3. **Internal-only endpoints**
   - Mark clearly in docs and avoid external contract guarantees.

## Maintenance policy

- New route requires:
  1. test coverage in `src/tests/api` or `src/tests/lib`,
  2. source-of-truth documentation update,
  3. contract status declared (stable or experimental).

Current v1 additive module surface:
- `nude`: `/api/nude/evaluate`, `/api/nude/health` (experimental until broader adoption).
