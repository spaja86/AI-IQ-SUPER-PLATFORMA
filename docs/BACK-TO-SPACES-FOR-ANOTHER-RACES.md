# Back to Spaces for Another Races

## Exact goal and success criteria

**Goal:** launch a fair, auditable, multi-platform space-racing mode coordinated across `AI-IQ-SUPER-PLATFORMA` and `IO-OPENUI-AO`.

### Success criteria
- Session completion rate: **>= 95%**
- Fairness-rule compliance: **100%**
- Server-side action evaluation: **<= 100ms**
- Cross-repo sync coverage for labels/references: **100%**

## Target users, platforms, and journeys

### Target users
- Existing gaming users on AI-IQ-SUPER-PLATFORMA
- IO-OPENUI-AO lab testers
- Competitive teams requiring anti-cheat + audit trail

### Supported platforms
- Web (primary)
- Mobile integration surface
- Linked-repo workflow (`spaja86/IO-OPENUI-AO`)

### Key user journeys
1. Lobby creation → dimension selection → fairness validation → race start
2. Live race → boost usage → collision penalty handling → scoring
3. PR label + workflow validation → cross-repo reference logging

## V1 scope

### Must-have
- Catalog + API exposure for the mode
- Core fairness constraints and edge-case validation
- Feature flag for controlled rollout
- Dedicated validation workflow for race-labeled changes
- Agent config and docs alignment

### Optional (post-v1)
- Tournament mode
- Advanced driver telemetry dashboards
- Seasonal cosmetic packs

## Narrative/theme assets and naming

- Mode title: **Back to Spaces for Another Races**
- League naming: **Another Races Galactic Circuit**
- Season naming: **Season Orbit-1**
- UI naming prefix: `ANOTHER-RACES`
- Automation tag: `race:another-races`

## Core mechanics, edge cases, fairness constraints

- Players per race: **2–8**
- Nitro boosts per player: **0–3**
- Collision penalty cap: **0–4000ms**
- Latency compensation cap: **0–250ms**
- Edge-case handling:
  - Duplicate player IDs rejected
  - Missing lobby IDs rejected
  - NaN/negative race result values normalized
  - Disconnected player score hard-set to `0`

## Repository update map

- Domain logic: `src/lib/back-to-spaces-another-races.ts`
- Game catalog integration: `src/lib/igrice.ts`
- Feature rollout control: `src/lib/feature-flags.ts`
- Count consistency: `src/lib/constants.ts`
- Tests: `src/tests/lib/back-to-spaces-another-races.test.ts`
- Automation: `.github/workflows/back-to-spaces-another-races.yml`
- Agent metadata: `.agent-config.json`
- Coordination docs: `docs/ROADMAP.md`, `docs/MULTI-REPO-LINKS.md`, `docs/GO-LIVE.md`

## Agent and automation requirements

- Labels:
  - `race:another-races`
  - `race:fairness-review`
  - `race:validated`
- Required validation paths:
  - `src/lib/back-to-spaces-another-races.ts`
  - `src/lib/igrice.ts`
  - `src/tests/lib/back-to-spaces-another-races.test.ts`
  - `.github/workflows/back-to-spaces-another-races.yml`
- Required checks:
  - Lint race-related lib files
  - Execute race domain tests
  - Execute gaming catalog regression tests

## Rollout, monitoring, fallback, post-release review

### Rollout
- Feature flag starts at **20%** on `staging` + `production`
- Promote to 100% only after fairness and reliability checks pass

### Monitoring
- Track completion rate, fairness violations, score anomalies, and CI drift

### Fallback
- Disable `gaming-back-to-spaces-another-races-v1` feature flag
- Keep catalog entry while routing players away from active race sessions

### Post-release review checklist
- Validate KPI targets
- Confirm no critical security findings
- Confirm cross-repo labels/references are synchronized
- Confirm no regression in `/api/igrice` and gaming catalog tests
