# API Surface Inventory

## Snapshot

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
- `digitron`
- `repozit`

`digit-engine` remains a logic-level library/test surface, while `digitron` is the canonical API slug.

See: `docs/API-CONTRACT-STATUS.md`.

## Rationalization candidates

1. **Alias namespaces**
   - `konvencionalni-odnosi` and `konvenkcionalni-odnosi` both exist.
   - Canonical slug: `konvencionalni-odnosi`; compatibility alias: `konvenkcionalni-odnosi` until migration ends.
2. **Large legacy/autofinish surfaces**
   - Keep out of canonical PR test path unless high-risk or governance/config changes.
3. **Internal-only endpoints**
   - Mark clearly in docs and avoid external contract guarantees.

## Maintenance policy

- New route requires:
  1. test coverage in `src/tests/api` or `src/tests/lib`,
  2. source-of-truth documentation update,
  3. contract status declared (stable or experimental).
