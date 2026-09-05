# API Contract Status

## Stable contracts (critical modules)

| Module | Stable surfaces | Contract signal |
|---|---|---|
| EXTRIMLI | `/api/extrimli/health`, `/api/extrimli/risk`, `/api/extrimli/sports`, `/api/extrimli/gear`, `/api/extrimli/events` | Versioned headers + degraded response strategy |
| GIGATRON | `/api/gigatron/health`, `/api/gigatron/catalog`, `/api/gigatron/inventory`, `/api/gigatron/order` | KPI-bearing health contract + deterministic catalog/order payloads |
| DUET | `/api/duet/evaluate`, `/api/duet/health` | Strict payload validation + explicit 200/422 behavior |
| DIGITRON | `/api/digitron/evaluate`, `/api/digitron/health` | Strict numeric validation + explicit 200/422 behavior |
| REPOZIT | `/api/repozit`, `/api/repozit/[id]`, `/api/repozit/health` | Filter validation + shared response/headers contract |

## Experimental / evolving surfaces

- New additive fields in module payloads are considered experimental until documented in the module source-of-truth docs and covered by route tests.
- New endpoints under module namespaces are experimental until they include:
  1. health surface alignment,
  2. route contract tests,
  3. documentation linkage in this file.

## Source-of-truth docs

- `docs/EXTRIMLI.md`
- `docs/GIGATRON.md`
- `docs/DUET.md`
- `docs/DIGITRON.md`
- `docs/REPOZIT.md`
