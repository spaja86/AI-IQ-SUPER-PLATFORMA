# MULTI-REPO-LINKS — Coordination Operating Model

## Purpose

This document formalizes coordination between `spaja86/AI-IQ-SUPER-PLATFORMA` and linked repositories, especially `spaja86/IO-OPENUI-AO`.

## Linked repository registry

| Repository | Relationship | Sync cadence | Sync fields | Status |
|---|---|---|---|---|
| `spaja86/IO-OPENUI-AO` | Primary linked product repo | Weekly + on cross-repo change | versions, labels, milestones, agent-config, docs, shared contracts | Active coordination |
| `platforms/io-openui-ao/` | Local mirror / documentation surface | Per repo change | README, ownership, migration notes | Tracked locally |
| Other linked platform repos | Follow-up only until formally registered | Manual | links, milestones, release notes | Pending registration |

## Required sync fields

- Dependency/version expectations for shared packages and workflows
- Label schema used by agents and reviewers
- Milestone names for roadmap delivery
- `.agent-config.json` expectations and agent enablement notes
- README and documentation links that point contributors across repos
- Follow-up issue or PR references for linked changes
- Feature-track metadata for race launches (labels, validation workflow, release docs)

## Shared label schema

| Label | Meaning |
|---|---|
| `agent:config-change` | CI, workflow, deploy, or agent config changed |
| `security:needs-review` | Security-sensitive or scanner-flagged change |
| `calculator:logic-change` | Calculator logic changed in linked repo |
| `calculator:validated` | Calculator validator completed successfully |
| `calculator:needs-review` | Calculator validator requires human follow-up |
| `race:another-races` | Back to Spaces for Another Races change set |
| `race:fairness-review` | Fairness-rule logic changed and requires focused review |
| `race:validated` | Race validation workflow and tests completed |
| `mekartor` | Mekartor release track change set |
| `mekartor:review` | Mekartor rollout/config change requires focused human review |
| `mekartor:validated` | Mekartor deploy/readiness validation completed |

## GIGATRON Label Schema

| Label | Meaning |
|---|---|
| `gigatron` | GIGATRON change set — requires GIGATRON validation |
| `gigatron:review` | GIGATRON change requires focused human review |
| `gigatron:validated` | GIGATRON validator and tests passed |
| `gigatron:needs-review` | GIGATRON validator requires human follow-up |
| `gigatron:logic-change` | GIGATRON catalog/procurement/affiliate logic changed |

## Version coherence policy

| Surface | Policy |
|---|---|
| Shared npm dependencies | Prefer minor-compatible alignment across linked repos |
| GitHub Actions | Prefer patch-exact alignment when workflow behavior is shared |
| Agent config fields | Keep schema-compatible and document field additions before rollout |
| Shared docs and cross-links | Update both repos in the same change window when links or responsibilities move |

## Cross-repo change workflow

1. Identify whether the change affects `IO-OPENUI-AO` behavior, docs, labels, milestones, or shared operational assumptions.
2. Record the impact in the PR template under **Cross-repo impact** and include OKRID linkage when mandatory.
3. For deploy, workflow, or shared-config changes, also document rollout, rollback, KPI impact, and environment-promotion notes in the PR.
4. Open or link the downstream PR / issue when the linked repo also needs updates.
5. Note the follow-up reference in commit, PR description, or linked issue trail.
6. Keep `.agent-config.json` aligned with any newly introduced coordination rule.

## OKRID alignment for cross-repo work

- Source standard: `docs/OKRID.md`
- Source registry: `docs/OKRID-REGISTRY.md`
- Required for cross-repo changes touching deploy/config/risky surfaces.
- Use canonical format: `OKRID-YYYY-TRACK-###`.
- Keep PR description, downstream references, and KPI status aligned with the same OKRID entry.

## Audit trail convention

Use explicit bidirectional references:

- `AI-IQ-SUPER-PLATFORMA#<number> -> IO-OPENUI-AO#<number>`
- `IO-OPENUI-AO#<number> -> AI-IQ-SUPER-PLATFORMA#<number>`

If only one repo changes immediately, document the deferred work as:

- `Follow-up required in spaja86/IO-OPENUI-AO`
- `No linked repo change required`

## INDEKSIRANJE 750 downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — INDEKSIRANJE 750 | `spaja86/IO-OPENUI-AO` — Follow-up required | Align `.agent-config.json` indexing flags and stage-monitoring labels |

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#INDEKSIRANJE-750 -> IO-OPENUI-AO#<follow-up issue>`

## Conflict resolution rules

- If labels or milestone names diverge, align the shared schema before feature rollout.
- If dependency versions diverge, prefer the repo that owns the runtime surface and open follow-up work for the consumer repo.
- If docs diverge from `.agent-config.json`, treat `.agent-config.json` as operational source of truth and update docs in the same change set.
- If rollout timing differs between repos, ship only the repo-local safe subset and document the blocked cross-repo dependency.

## Review expectations

- Human review remains required for critical changes.
- Security-sensitive cross-repo changes should include a security approver.
- Config and workflow changes should carry the `agent:config-change` label.
- Cross-repo work is not complete until docs, labels, and follow-up references are updated.

---

## Nova Generacija v2 Cross-Repo Contract

### Scope

The Nova Generacija release track introduces a new coordination layer for all changes that touch:

- `src/lib/spaja-pro-nova-generacija.ts` (SpajaPro 16 Hipermreza engine)
- `src/lib/evolucija/nova-generacija.ts` (Nova Generacija evolution engine)
- `src/lib/nova-generacija-gaming.ts` (Nova Generacija gaming mode)
- `platforms/nova-generacija/` (NG platform surface)
- `docs/NOVA-GENERACIJA.md` (NG specification)
- `.github/workflows/nova-generacija.yml` (NG CI workflow)

### Nova Generacija Label Schema

| Label | Meaning |
|---|---|
| `nova-generacija` | Nova Generacija change set — requires NG validation |
| `nova-generacija:review` | NG change requires focused human review |
| `nova-generacija:validated` | NG validation workflow and tests passed |
| `nova-generacija:needs-review` | NG validator requires human follow-up |

### Nova Generacija Linked Repos

| Repository | NG Sync Fields | Sync Trigger | Tracking Doc |
|---|---|---|---|
| `spaja86/IO-OPENUI-AO` | versions, labels, milestones, nova-generacija-gaming-refs | on-change + weekly | `docs/MULTI-REPO-LINKS.md` |
| Future linked repos | To be defined upon registration | Weekly | `docs/MULTI-REPO-LINKS.md` |

### Nova Generacija Cross-Repo Workflow

1. Identify whether the NG change affects `IO-OPENUI-AO` behavior, docs, labels, milestones, or shared gaming/calculator contracts.
2. Record the impact in the PR template under **Cross-repo impact**, noting `nova-generacija` scope.
3. Open or link the downstream PR / issue when the linked repo also needs NG-related updates.
4. Note the follow-up reference in commit, PR description, or linked issue trail.
5. Keep `.agent-config.json` `nova-generacija-agent.linkedReposV2` aligned with any newly added linked repo.
6. All Nova Generacija gaming changes must include a cross-repo fairness audit reference.

---

## DIREKŠN ZA PLATFORMU DEPLOY (SPAJA) — Audit Trail

### Initiative

Kanonska 12-fazna deploy sekvenca za AI IQ SUPER PLATFORMA ekosistem.

| Field | Value |
|---|---|
| Version | v42.35.0+ |
| Date | 2026-08-01 |
| Owner | @spaja86 |
| Tracking doc | `docs/DIREKŠN-DEPLOY-SPAJA.md` |
| Master checklist | `docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md` |

### Cross-repo references

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — DIREKŠN DEPLOY initiative | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: versions, labels, milestones, nova-generacija-gaming-refs, calculator-validator-agent fairness check |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Trigger `calculator-validator-agent` for gaming fairness verification
- Confirm label schema alignment with this repo's shared label registry
- Confirm `multi-repo-sync-agent` sync coverage = 100%
- Update `docs/MULTI-REPO-LINKS.md` in IO-OPENUI-AO with bidirectional DIREKŠN reference

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#DIREKŠN-DEPLOY -> IO-OPENUI-AO#<follow-up issue>
```

---

## MAKSIMUM ALL PLATFORMA DEPLOY — Audit Trail

### Initiative

Full production deployment of all 6 platforms in the AI IQ SUPER PLATFORMA ecosystem.

| Field | Value |
|---|---|
| Version | v42.35.0 |
| Date | 2026-08-01 |
| Owner | @spaja86 |
| Tracking doc | `docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md` |
| Changelog | `CHANGELOG.md` |

### Cross-repo references

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — MAKSIMUM DEPLOY initiative | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: versions, labels, milestones, nova-generacija-gaming-refs, multi-repo-sync-agent config |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Confirm label schema alignment with this repo's shared label registry
- Trigger `calculator-validator-agent` for gaming fairness verification
- Update `docs/MULTI-REPO-LINKS.md` in IO-OPENUI-AO with bidirectional reference to this initiative
- Confirm `multi-repo-sync-agent` sync coverage = 100%

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#MAKSIMUM-DEPLOY -> IO-OPENUI-AO#<follow-up issue>
```

---

### Nova Generacija KPI Enforcement

The `nova-generacija-agent` enforces these KPIs on every cross-repo change:

| KPI | Target | Enforced by |
|---|---|---|
| Action evaluation | ≤ 50ms | `.github/workflows/nova-generacija.yml` |
| Build duration | ≤ 3 min | Build step timeout |
| Uptime SLA | 99.99% | `enterprise-sla.ts` nova-generacija tier |
| Gaming completion rate | ≥ 95% | NG gaming fairness checks |
| Cross-repo sync coverage | 100% | `nova-generacija-agent` |
| Security scan coverage | 100% | `security-scanner` workflow |


---

## Mekartor Release Track — Audit Trail

### Scope

Mekartor je repo-local deployable surface u `spaja86/AI-IQ-SUPER-PLATFORMA` sa runtime rutama `/mekartor` i `/api/mekartor`.

### Cross-repo assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — Mekartor rollout | `spaja86/IO-OPENUI-AO` | No linked repo change required |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#MEKARTOR -> No linked repo change required`
- Human review remains required because this is a config/deploy change.

---

## REAL CREATE QVADERS — Audit Trail

### Scope

MASTER POKER contract extension for canonical `four-of-kind` detection under alias track `REAL CREATE QVADERS`.

### Cross-repo assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — REAL CREATE QVADERS | `spaja86/IO-OPENUI-AO` | No linked repo change required |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#REAL-CREATE-QVADERS -> No linked repo change required`

---

## MAKS PLAN NIVO LEVL — Audit Trail

### Initiative

Apsolutni maksimum operativni plan za AI IQ SUPER PLATFORMA — svih 16 nivoa od governance gate-a do final sign-off-a. Cilj: verzija v100.0.0 (SpajaPro 16 Nova Generacija).

| Field | Value |
|---|---|
| Version | v42.36.0 → v100.0.0 |
| Date | 2026-08-01 |
| Owner | @spaja86 |
| Tracking doc | `docs/MAKS-PLAN-NIVO-LEVL.md` |
| Changelog | `CHANGELOG.md` v42.36.0 |
| Deploy status | `public/deploy_status.json` |

### Cross-repo references

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — MAKS PLAN NIVO LEVL (all 16 levels) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: versions, labels, milestones, nova-generacija-gaming-refs, calculator-validator-agent fairness, multi-repo-sync-agent config |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Trigger `calculator-validator-agent` for Nova Generacija gaming fairness verification
- Confirm label schema alignment (nova-generacija, race, mekartor labels) with this repo's shared label registry
- Update `docs/MULTI-REPO-LINKS.md` in IO-OPENUI-AO with bidirectional reference to MAKS PLAN NIVO LEVL
- Confirm `multi-repo-sync-agent` sync coverage = 100%
- Align `.agent-config.json` nova-generacija-agent configuration between repos

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#MAKS-PLAN-NIVO-LEVL -> IO-OPENUI-AO#<follow-up issue>
```

---

## GIGATRON — Audit Trail

### Scope

GIGATRON je repo-local deployable surface u `spaja86/AI-IQ-SUPER-PLATFORMA` sa runtime rutama `/gigatron`, `/gigatron/katalog`, `/gigatron/nabavka` i API rutama `/api/gigatron/*`.

| Field | Value |
|---|---|
| Version | v42.36.0+ |
| Date | 2026-08-02 |
| Owner | @spaja86 |
| Tracking doc | `docs/GIGATRON.md`, `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md` |
| Platform surface | `platforms/gigatron/` |
| Core libs | `src/lib/gigatron/` |
| Workflow | `.github/workflows/gigatron.yml` |
| OKRID | `OKRID-2026-GIGATRON-001` |

### Cross-repo assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — GIGATRON rollout | `spaja86/IO-OPENUI-AO` | No linked repo change required |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#GIGATRON -> No linked repo change required`
- `AI-IQ-SUPER-PLATFORMA#OKRID-2026-GIGATRON-001 -> No linked repo change required`
- Human review remains required because this is a payment/compliance governance change.

### GIGATRON KPI Enforcement

| KPI | Target | Enforced by |
|---|---|---|
| API response (catalog/order) | ≤ 200ms | `.github/workflows/gigatron.yml` |
| Catalog availability | 99.9% | gigatron-validator-agent |
| Order processing success rate | ≥ 99% | gigatron-validator-agent |
| Affiliate tracking accuracy | 100% | `gigatron-affiliate.test.ts` |
| Build duration | ≤ 3 min | Build step timeout |
| Security scan coverage | 100% | `security-scanner` workflow |
| Feature flag rollout | 10% → 50% → 100% | `feature-flags.ts` |

### GIGATRON Corporate Subscription Governance

- Governance source of truth: `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md`
- Scope: repo-local legal/compliance/billing workflow for high-value GIGATRON B2B subscriptions
- Activation rule: no subscription activation before `payment-confirmed`
- Blocking rule: non-verifiable or non-bankable amounts remain `blocked-until-validated`

---

## ANOTHER MAKS — Cross-Repo Contract

### Scope

ANOTHER MAKS je kreativan/generativni kognitivni agent, paralelan uz MAKSIMUS 2/3. Promene koje dira:

- `src/lib/another-maks/**` (ANOTHER MAKS engine, persona, orchestrator, store)
- `src/app/api/another-maks/**` (API route)
- `src/tests/lib/another-maks.test.ts` (unit tests)
- `.github/workflows/another-maks.yml` (CI workflow)
- `docs/ANOTHER-MAKS.md` (specifikacija)

### ANOTHER MAKS Label Schema

| Label | Meaning |
|---|---|
| `another-maks` | ANOTHER MAKS change set — requires agent validation |
| `another-maks:review` | ANOTHER MAKS change requires focused human review |
| `another-maks:validated` | ANOTHER MAKS validation workflow and tests passed |
| `another-maks:needs-review` | ANOTHER MAKS validator requires human follow-up |

### ANOTHER MAKS Cross-Repo Assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — ANOTHER MAKS initial rollout | `spaja86/IO-OPENUI-AO` | No linked repo change required for initial rollout |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#ANOTHER-MAKS-001 -> No linked repo change required`
- Future cross-repo sync triggered when ANOTHER MAKS persona sync or gaming integration requires IO-OPENUI-AO alignment.

### ANOTHER MAKS KPI Enforcement

| KPI | Target | Enforced by |
|---|---|---|
| Action evaluation p99 | ≤ 50ms | `.github/workflows/another-maks.yml` + test |
| Build duration | ≤ 3 min | Build step timeout |
| Uptime SLA | 99.99% | Monitoring |
| Linked agent coordination | MAKSIMUS 2 | `persona.ts` handoff logic |
| Security scan coverage | 100% | `another-maks-security` job |
