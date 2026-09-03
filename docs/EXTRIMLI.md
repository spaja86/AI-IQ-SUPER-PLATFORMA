# EXTRIMLI — Extreme Sports & Adventure Intelligence

## Overview

EXTRIMLI is the platform domain for extreme-sports risk evaluation, athlete progression, gear safety, and event readiness.

This repository now exposes five aligned surfaces:

| Version | Path | Status | Purpose |
|---|---|---|---|
| **v1** | `src/lib/extrimli/`, `src/app/api/extrimli/` | Active | Existing baseline registry, risk, gear, performance, event, and weather APIs |
| **v3** | `src/lib/extrimli-3/`, `src/app/api/extrimli-3/` | Active | Versioned expansion with sport-specific risk profiles, weather-integrated scoring, and athlete readiness signals |
| **EXTRIMLI CUZ** | `src/lib/extrimli-cuz/`, `src/app/api/extrimli-cuz/` | Active | Community, mentorship, feed, and reputation surface used by Extendol and KORON |
| **Extendol (Extended)** | `src/lib/extrimli-extendol/`, `src/app/api/extrimli/extendol/` | Active | Unified “maximum functionality for all” contract that aggregates v1 + v3 + EXTRIMLI CUZ + KORON |
| **KORON** | `src/lib/extrimli-koron/`, `src/app/api/extrimli/koron/` | Active | Readiness overlay that summarizes cross-surface stability, sync coverage, and degraded posture |

## Module paths

| Surface | Path |
|---|---|
| v1 library | `src/lib/extrimli/` |
| v1 API routes | `src/app/api/extrimli/` |
| Extendol unified library | `src/lib/extrimli-extendol/` |
| Extendol unified API route | `src/app/api/extrimli/extendol/` |
| KORON overlay library | `src/lib/extrimli-koron/` |
| KORON overlay API route | `src/app/api/extrimli/koron/` |
| v3 library | `src/lib/extrimli-3/` |
| v3 API routes | `src/app/api/extrimli-3/` |
| EXTRIMLI CUZ library | `src/lib/extrimli-cuz/` |
| EXTRIMLI CUZ API routes | `src/app/api/extrimli-cuz/` |
| Tests | `src/tests/lib/extrimli.test.ts`, `src/tests/lib/extrimli-3.test.ts`, `src/tests/lib/extrimli-extendol.test.ts`, `src/tests/lib/extrimli-koron.test.ts`, `src/tests/lib/extrimli-cuz.test.ts`, `src/tests/api/extrimli-route.test.ts` |

## External GitHub surface

| Area | Source of truth |
|---|---|
| Canonical governance plan | `docs/EXTRIMLI-EXTERNAL-GITHUB.md` |
| Validator / quality gate | `.github/workflows/extrimli-validator.yml` |
| External GitHub governance | `.github/workflows/extrimli-external-github.yml` |
| Deploy orchestration | `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml` |
| Downstream references | `docs/MULTI-REPO-LINKS.md` |
| KORON overlay source | `src/lib/extrimli-koron/index.ts`, `src/app/api/extrimli/koron/route.ts` |
| Export layer | `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/app/api/extrimli/instrukcija/route.ts` |

This surface formalizes EXTRIMLI as a GitHub-oriented external capability for Digitalna Industrija while keeping the sports/risk runtime separate from audit, workflow, sync, and release governance concerns.

## EXTRIMLI EXTEMEL/EXTREMOL WAWE rollout model

EXTRIMLI koristi kontrolisan WAWE rollout iz Vercel deploy toka ka Digitalna Industrija operativnom sloju:

1. WAWE 1 — Pre-release validation (test/lint/KPI/security/labels)
2. WAWE 2 — Build + staging verifikacija na Vercel
3. WAWE 3 — Downstream sync + cross-repo reference usklađivanje
4. WAWE 4 — Production rollout ringovi (10% → 50% → 100%)
5. WAWE 5 — Post-release resilience + analytics potvrda

Promotion freeze je obavezan kada KPI/audit/sync nije potpun, uz rollback na prethodni known-good Vercel deployment.

## Locked source-of-truth set

- Docs: `docs/EXTRIMLI.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md`, `docs/MULTI-REPO-LINKS.md`
- Governance workflow: `.github/workflows/extrimli-external-github.yml`
- Deploy workflows: `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml`
- Quality gate: `.github/workflows/extrimli-validator.yml`
- KORON overlay route: `src/app/api/extrimli/koron/route.ts`

## EXTRIMLI v1 capabilities

- Sport registry
- Composite risk engine
- DESTRUKCIJA asset registry and destruction scoring
- Athlete performance tracker
- Gear catalog
- Event lifecycle and registration
- Weather adapter
- Health report

## EXTRIMLI Extendol unified contract (maximum functionality for all)

Extendol objedinjuje EXTRIMLI v1, EXTRIMLI v3, EXTRIMLI CUZ i KORON u jedan kanonski integracioni sloj.

- Source of truth endpoint: `/api/extrimli/extendol`
- Contract constants:
  - `EXTRIMLI_EXTENDOL_CONTRACT_VERSION = v1`
  - `EXTRIMLI_EXTENDOL_MODULE_VERSION = 1.0.0`
- Degraded policy: `partial-payload-no-500`

### Acceptance criteria (Extendol)

1. Jedinstveni ugovor je versioned i stabilan.
2. Pokriveni su svi ključni putanje funkcionalnosti:
   - sport/risk evaluation
   - gear i safety readiness
   - event lifecycle i registration
   - destruction safety flows
   - athlete progress/readiness
   - community reputation/mentorship
   - KORON readiness overlay i sync coverage
3. KPI targeti ostaju ≤ 50ms evaluacija i ≤ 200ms API response.
4. Unified readiness score koristi realne signale iz v1/v3/CUZ/KORON health surface-a.
5. Fallback vraća degradirani odgovor umesto HTTP 500.

## EXTRIMLI KORON overlay

KORON je novi EXTRIMLI capability koji radi kao readiness overlay nad postojećim v1, v3 i CUZ surface-ovima i objavljuje status za Extendol i downstream GitHub governance.

- Source of truth endpoint: `/api/extrimli/koron`
- Contract constants:
  - `EXTRIMLI_KORON_CONTRACT_VERSION = v1-koron`
  - `EXTRIMLI_KORON_MODULE_VERSION = 1.0.0`
- KORON publikuje:
  - `status`
  - `readinessScore`
  - `riskBalanceScore`
  - `communitySignalScore`
  - `destructionRecoveryScore`
  - `syncCoverageScore`
  - `degradedSources`
- Degraded policy: `partial-payload-no-500`

## MAKSIMUS ↔ EXTRIMLI responsibilities

- MAKSIMUS koristi `/api/extrimli/extendol` signal kao domen `EXTRIMLI Extended`.
- KORON status i degraded izvori moraju ostati prisutni u Extendol payload-u koji MAKSIMUS koristi.
- MAKSIMUS preporuke moraju uključiti EXTRIMLI degradaciju kada postoji.
- Integration gate pokriva oba workflow-a: `extrimli-validator` i `maksimus-validator`.

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
| `EXTRIMLI_EXTENDOL_CONTRACT_VERSION` | `v1` |
| `EXTRIMLI_EXTENDOL_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI3_PERSONA_ID` | `extrimli-core` |
| Trigger labels | `extrimli:logic-change` |
| External GitHub labels | `extrimli:external-github`, `agent:config-change` |
| EKSTREMNO trigger labels | `extrimli:logic-change`, `ekstremno:logic-change` |
| Octave | 7 |
| Hipermreza node | 56 |

## Audit reference

```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-003 -> IO-OPENUI-AO#<follow-up issue>
```

## References

- Canonical GitHub governance plan: `docs/EXTRIMLI-EXTERNAL-GITHUB.md`
- Validator workflow: `.github/workflows/extrimli-validator.yml`
- GitHub governance workflow: `.github/workflows/extrimli-external-github.yml`
- Deploy workflows: `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml`
- Multi-repo links: `docs/MULTI-REPO-LINKS.md`
