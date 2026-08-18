# EXTRIMLI — Extreme Sports & Adventure Intelligence

## Overview

EXTRIMLI is the platform domain for extreme-sports risk evaluation, athlete progression, gear safety, and event readiness.

This repository now exposes two aligned surfaces:

| Version | Path | Status | Purpose |
|---|---|---|---|
| **v1** | `src/lib/extrimli/`, `src/app/api/extrimli/` | Active | Existing baseline registry, risk, gear, performance, event, and weather APIs |
| **v3** | `src/lib/extrimli-3/`, `src/app/api/extrimli-3/` | Active | Versioned expansion with sport-specific risk profiles, weather-integrated scoring, and athlete readiness signals |

## Module paths

| Surface | Path |
|---|---|
| v1 library | `src/lib/extrimli/` |
| v1 API routes | `src/app/api/extrimli/` |
| v3 library | `src/lib/extrimli-3/` |
| v3 API routes | `src/app/api/extrimli-3/` |
| Tests | `src/tests/lib/extrimli.test.ts`, `src/tests/lib/extrimli-3.test.ts` |

## EXTRIMLI v1 capabilities

- Sport registry
- Composite risk engine
- DESTRUKCIJA asset registry and destruction scoring
- Athlete performance tracker
- Gear catalog
- Event lifecycle and registration
- Weather adapter
- Health report

## EXTRIMLI 3 contract

### New capabilities

| Capability | Description |
|---|---|
| **Sport-specific risk profiles** | Each sport has its own multiplier, minimum experience, weighting priorities, and risk bias |
| **Integrated weather-aware risk** | Weather data is normalized and directly influences v3 risk scoring |
| **Athlete readiness signal** | Existing athlete session history is transformed into a readiness score and progress snapshot |
| **Richer health reporting** | v3 health includes profile count, evaluation count, last risk score, and last readiness score |

### Backward compatibility

- All v1 routes under `/api/extrimli/*` remain unchanged.
- EXTRIMLI 3 lives beside v1 as `/api/extrimli-3/*`.
- Existing EXTRIMLI tests continue to validate v1 behavior independently.

### Performance and validation rules

| KPI | Target |
|---|---|
| Risk evaluation | ≤ 50ms |
| DESTRUKCIJA evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Weather-sensitive sport without weather payload | Invalid |
| Unsupported destruction asset / dimension pair | Invalid |
| Unsupported sport / invalid numeric range | Invalid |
| NaN / Infinity / negative range leakage | 0 |

## DESTRUKCIJA capability

### Product boundary

- DESTRUKCIJA is implemented as a **new public EXTRIMLI capability inside the current v1 surface**.
- Existing EXTRIMLI contracts remain backward-compatible because DESTRUKCIJA is exposed through additive routes under `/api/extrimli/destruction/*`.

### Domain contract

| Area | Coverage |
|---|---|
| Asset types | `wall`, `tower`, `bridge`, `arena`, `vehicle`, `obstacle` |
| Materials | `concrete`, `steel`, `glass`, `wood`, `composite` |
| Dimensions | `360D`, `720D`, `1440D`, `2880D`, `5760D` |
| Outputs | `severityScore`, `severityLevel`, `fragmentCount`, `shockwaveRadiusM`, `rollbackRecommended` |
| Safety | Safe fragment cap, safe shockwave radius, degraded safety clamping |
| Invalid behavior | Unsupported asset/dimension pairs and non-finite ranges are invalid |
| Degraded mode | Over-limit outputs are returned with `degraded = true` and `degradedMode = safety-clamped-output` |

### DESTRUKCIJA routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/extrimli/destruction` | Evaluate destructive impact for a supported EXTRIMLI asset |
| POST | `/api/extrimli/destruction/preview` | Read-only simulation preview with degraded safety signaling |
| GET | `/api/extrimli/destruction/assets` | List destructible assets with optional filters |
| GET | `/api/extrimli/destruction/assets/[id]` | Retrieve a single destructible asset |
| GET | `/api/extrimli/destruction/health` | DESTRUKCIJA-specific health and metrics |

All DESTRUKCIJA routes respond with headers:
- `X-Extrimli-Contract-Version: v1`
- `X-Extrimli-Destrukcija-Contract-Version: v1-destrukcija`
- `X-Extrimli-Destrukcija-Module-Version: 1.0.0`

## EXTRIMLI 3 library modules

| Module | File | Responsibility |
|---|---|---|
| Types | `src/lib/extrimli-3/types.ts` | v3 contract, profile, readiness, and health types |
| Profiles | `src/lib/extrimli-3/profiles.ts` | Sport-specific multipliers, weighting, and validation |
| Risk Engine | `src/lib/extrimli-3/risk-engine.ts` | Weather-aware risk scoring and athlete readiness integration |
| Index | `src/lib/extrimli-3/index.ts` | Public API surface |

## EXTRIMLI 3 API routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/extrimli-3/risk` | Weather-aware risk evaluation with optional `athleteId` history |
| GET | `/api/extrimli-3/sports` | List v3 sport risk profiles with linked sport metadata |
| GET | `/api/extrimli-3/health` | v3 health report |

All v3 routes respond with headers:
- `X-Extrimli3-Contract-Version: v3`
- `X-Extrimli3-Module-Version: 3.0.0`

## EKSTREMNO processing surface (`/api/ekstremno-procesuiranje-svega`)

### Goal
- Provide a no-500 extreme processing snapshot that aggregates core platform signals into one scheduler and readiness payload.
- Keep score interpretation stable over time with explicit domain weights and contract metadata.

### Aggregated signal sources
- `statistika`
- `auto-repair.diagnostics`
- `kompanija-spaja-operativa`
- `autofinish-petlja.summary`
- `autofinish-petlja.health`
- `proksi-github-deploy`

### KPI targets
- `throughputPerMin >= 1200`
- `latencyMsP95 <= 300`
- `errorRatePct <= 2`
- `queueDepth <= 80`

### Degraded policy
- Contract mode: `partial-payload-no-500`
- Behavior: endpoint returns HTTP 200 with degraded metadata and audit signal instead of hard-failing the API.
- Required metadata fields:
  - `meta.degraded`
  - `meta.degradedMode`
  - `meta.degradedSources`
  - `meta.auditSignal`
  - `meta.signalSources`
  - `meta.domainWeights`

### Response headers
- `X-Procesuiranje-Contract-Version`
- `X-Procesuiranje-Model-Version`
- `X-Procesuiranje-Source-Of-Truth`
- `X-Procesuiranje-Mode`
- `X-Procesuiranje-Degraded`
- `X-Procesuiranje-Degraded-Mode`
- `X-Procesuiranje-Degraded-Sources-Count`
- `X-Procesuiranje-Audit-Signal`
- `X-Procesuiranje-Queue-Depth`
- `X-Procesuiranje-Fairness-Index`

## EXTRIMLI 3 risk input

```json
{
  "sportId": "paragliding",
  "athleteExperience": 8,
  "terrainDifficulty": 4,
  "gearQualityIndex": 9,
  "athleteId": "ath-123",
  "weatherData": {
    "windSpeedKph": 12,
    "precipitationMm": 0,
    "temperatureC": 18,
    "visibilityKm": 10
  },
  "referenceId": "risk-check-001"
}
```

## Contract version

| Field | Value |
|---|---|
| `EXTRIMLI_CONTRACT_VERSION` | `v1` |
| `EXTRIMLI_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION` | `v1-destrukcija` |
| `EXTRIMLI_DESTRUKCIJA_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI3_CONTRACT_VERSION` | `v3` |
| `EXTRIMLI3_MODULE_VERSION` | `3.0.0` |
| `EXTRIMLI3_PERSONA_ID` | `extrimli-core` |
| Trigger labels | `extrimli:logic-change` |
| EKSTREMNO trigger labels | `extrimli:logic-change`, `ekstremno:logic-change` |
| Octave | 7 |
| Hipermreza node | 56 |

## Audit reference

```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-003 -> IO-OPENUI-AO#<follow-up issue>
```
