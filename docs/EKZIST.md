# EKZIST (EXIST) — Existential Profiler & Life Meaning Engine

## Purpose

EKZIST is the canonical module name for existential profiling in this repository.
`EXIST` is a compatibility alias only; all contracts, routes, labels, and workflow wiring stay on the `ekzist` slug.

## Scope boundaries

- **In scope**: deterministic scoring engine, strict API validation, disclaimer, KPI headers, health report, tests, docs, and validator workflow.
- **Out of scope**: medical/psychotherapy diagnosis, persistence, user-history personalization, and cross-repo runtime coupling.

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Score bounds | 0..100 |
| Determinism | Same payload → same result |

## Contracts

| Field | Value |
|---|---|
| Display name | `EKZIST` |
| Alias | `EXIST` |
| Canonical slug | `ekzist` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `ekzist-core` |
| Octave / hipermreza node | `2 / 16` |
| Routes | `/api/ekzist/evaluate`, `/api/ekzist/health` |
| Validator | `.github/workflows/ekzist-validator.yml` |

## Input model

- `referenceId` — optional string
- `domains` — required non-empty array of `{ domain, score }`
  - `domain` must be one of: `MEANING | PURPOSE | IDENTITY | CONNECTION | AUTONOMY | LEGACY | TRANSCENDENCE | GROWTH`
  - `score` must be finite and in `0..100`
  - each domain can appear only once
- `lifePressures` — optional string array
- `ageGroup` — optional enum: `YOUTH | YOUNG_ADULT | ADULT | MIDLIFE | SENIOR`
- `sessionNotes` — optional string

## Output model

- `dominantVector`, `tier`, `balanceScore`, `dimensionScores`
- `recommendations` and `warnings`
- `disclaimer` (always present for valid and invalid outcomes)
- `valid`, `durationMs`

## Tier and warning rules

- Tier classification is deterministic from mean score + balance score:
  - `PEAK`, `ALIGNED`, `AWAKENING`, `SEARCHING`, `GROUNDED`
- Warning triggers:
  - domain score `< 10` → low-imbalance warning
  - domain score `> 95` → high-imbalance warning
  - semantic contract violations (unsupported domain/ageGroup, duplicates, out-of-range scores) → invalid result

## API boundary behavior

- **400 Bad Request**: malformed payload shape (invalid JSON, non-object body, wrong field types, missing/empty `domains`).
- **422 Unprocessable Entity**: semantically invalid values while payload shape is valid (unsupported enum/domain, duplicates, out-of-range numeric values).

## Response headers

Always present:

- `X-Ekzist-Contract-Version`
- `X-Ekzist-Module-Version`
- `X-Ekzist-Display-Name`
- `X-Ekzist-Canonical-Slug`
- `X-Ekzist-Persona-Id`
- `X-Ekzist-Eval-KPI-Ms`
- `X-Ekzist-Api-KPI-Ms`

Present on `/evaluate` results:

- `X-Ekzist-Tier`
- `X-Ekzist-Domain`
- `X-Ekzist-Valid`

## Security and operations

- No secrets are stored or returned by EKZIST surfaces.
- Validation fails explicitly; no silent fallback path.
- Health report exposes aggregate metadata only.
- Changes must pass lint/tests, secret scanning, code review, and CodeQL checks.

## Linked repo follow-up

- Keep downstream audit reference in `docs/MULTI-REPO-LINKS.md`.
- For `spaja86/IO-OPENUI-AO`, track label schema alignment and persona snapshot sync for `ekzist-core`.
