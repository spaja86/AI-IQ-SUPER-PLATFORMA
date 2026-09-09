# TACSKRIN — Canonical Equivalence Module

## Purpose

`tacskrin` is a deterministic, API-first module that validates equivalence to the official canonical sequence:

`REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE`

## Scope boundaries

- **In scope**: canonical slug, strict `input == canonical` logic, unknown/invalid handling, health report, API routes, tests, docs, and validator workflow.
- **Out of scope**: persistence, UI orchestration, and cross-repo runtime coupling.

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Determinism | Same input → same output |

## Contracts

| Field | Value |
|---|---|
| Display name | `TAČSKRIN` |
| Canonical slug | `tacskrin` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `tacskrin-core` |
| Octave / hipermreza node | `10 / 85` |
| Routes | `/api/tacskrin/evaluate`, `/api/tacskrin/health` |
| Linked-repo impact | `none` |

## Official layers and validation rules

Official ordered sequence (15 layers):

1. REAL
2. NIKOS
3. DIKOS
4. FRANKEN
5. DEMBA
6. GAKU
7. REKO
8. NAKUS
9. GOMBLE
10. GEPI
11. NAU
12. JUN
13. GOKON
14. APAR
15. DJUNDRE

Rules:
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
- `matchRatio` — percent of matched known layers against canonical count
- `warnings` and `disclaimer` (always present)

## “==” business rule

`input == canonical` is true only when all conditions pass:
1. all tokens are known,
2. token counts match canonical counts exactly,
3. if `strictOrder=true`, token order is identical to canonical sequence.

## Security and operations

- No secrets in payloads or logs.
- Deterministic engine behavior.
- Aggregate-only health report; no input persistence.

## Linked repos

- No linked repository runtime change is required for v1.
- If downstream adoption starts, document it in `docs/MULTI-REPO-LINKS.md`.
