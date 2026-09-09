# POZADINE SVIH PROJEKCIJA — Projection Background Equivalence Module

## Purpose

`pozadine-svih-projekcija` is a deterministic, API-first module that formalizes and validates the canonical projection sequence:

`DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA`

The module evaluates whether an input projection is equivalent to this official signal-layer baseline.

## Scope boundaries

- **In scope**: canonical slug, strict equivalence logic (`==`), duplicate handling for `NIKOS`, unknown/empty fallback behavior, health report, API routes, tests, docs, and validator workflow.
- **Out of scope**: UI orchestration, persistence, and cross-repo runtime coupling.

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Determinism | Same input → same output |

## Contracts

| Field | Value |
|---|---|
| Display name | `POZADINE SVIH PROJEKCIJA` |
| Canonical slug | `pozadine-svih-projekcija` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `pozadine-svih-projekcija-core` |
| Octave / hipermreza node | `10 / 84` |
| Routes | `/api/pozadine-svih-projekcija/evaluate`, `/api/pozadine-svih-projekcija/health` |
| Linked-repo impact | `none` |

## Official layers and validation rules

Official ordered sequence (12 layers):

1. DUKER
2. NIKOS
3. ZINGO
4. NJUKER
5. ZINGAN
6. DISPO
7. DJAMA
8. FRIKO
9. DJAPRE
10. NIKOS
11. JAKRE
12. GIMBA

Rules:
- `NIKOS` **must** appear exactly 2 times for full equivalence.
- Unknown tokens produce `NEPOZNATO`.
- Empty/malformed inputs produce `INVALID`.
- Known-but-non-matching payloads produce `ODSTUPANJE`.
- Fully matching payloads produce `EKVIVALENTNA`.

## Input model

Each evaluation accepts:
- `projectionExpression` — space-separated layer expression (string)
- `layers` — explicit array of layers (string[])
- `signalStrength` — optional finite score `0..100`
- `strictOrder` — optional boolean (`true` by default)

At least one of `projectionExpression` or `layers` is required.

## Output model

- `equivalent` — whether the payload is equivalent to canonical sequence
- `status` — `INVALID | NEPOZNATO | ODSTUPANJE | EKVIVALENTNA`
- `recommendedAction` — remediation/confirmation action
- `orderMatch` — order-comparison result against canonical sequence
- `missingLayers`, `extraLayers`, `unknownLayers`
- `duplicateDelta` — expected vs actual token-count differences
- `matchRatio` — percent of matched known layers against canonical count
- `warnings` and `disclaimer` (always present)

## “==” business rule

`input == canonical` is true only when all conditions pass:
1. all tokens are known,
2. token counts match canonical counts exactly (including duplicate `NIKOS`),
3. if `strictOrder=true`, token order is identical to canonical sequence.

## Validation strategy

- Reject malformed payloads and missing core fields at route-shape level.
- Reject `NaN`/`Infinity`/out-of-range `signalStrength` in domain logic.
- Normalize tokens to uppercase trimmed values.
- Return explicit invalid results for unknown or malformed domain input.

## Security and operations

- No secrets in payloads or logs.
- Deterministic engine behavior.
- Aggregate-only health report; no input persistence.

## Linked repos

- No linked repository runtime change is required for v1.
- If downstream adoption starts, document it in `docs/MULTI-REPO-LINKS.md`.
