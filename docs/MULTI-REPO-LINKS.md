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
| `real-gun` | REAL GUN software/game safety-bound feature track |
| `real-gun:review` | REAL GUN change requires focused human + safety review |
| `real-gun:validated` | REAL GUN validation and safety checks completed |
| `great-sumbion` | GREAT SUMBION change set — requires focused validation |
| `great-sumbion:logic-change` | GREAT SUMBION score/tier logic changed |
| `great-sumbion:validated` | GREAT SUMBION validator and tests passed |
| `great-sumbion:needs-review` | GREAT SUMBION validator requires human follow-up |
| `paraksil` | PARAKSIL change set — requires focused validation |
| `paraksil:logic-change` | PARAKSIL module-validation logic changed |
| `paraksil:validated` | PARAKSIL validator and tests passed |
| `paraksil:needs-review` | PARAKSIL validator requires human follow-up |
| `trenazer` | TRENAŽER change set — requires focused validation |
| `trenazer:logic-change` | TRENAŽER readiness/recommendation logic changed |
| `trenazer:validated` | TRENAŽER validator and tests passed |
| `trenazer:needs-review` | TRENAŽER validator requires human follow-up |
| `dumbir` | ÐUMBIR change set — requires focused validation |
| `dumbir:logic-change` | ÐUMBIR ginger wellness contract or scoring logic changed |
| `dumbir:validated` | ÐUMBIR validator and tests passed |
| `dumbir:needs-review` | ÐUMBIR validator requires human follow-up |
| `mirikl` | MIRIKL GitHub + Vercel governance/release change set |
| `mirikl:logic-change` | MIRIKL deploy/config/cross-repo governance logic changed |
| `mirikl:review` | MIRIKL change requires focused human review |
| `mirikl:validated` | MIRIKL quality/security/deploy governance checks passed |
| `mirikl:needs-review` | MIRIKL validator or downstream governance needs follow-up |
| `eksluziv-network` | EKSLUZIV NETWORK domain-scoped deploy governance change set |
| `eksluziv-network:review` | EKSLUZIV NETWORK rollout/config change requires focused human review |
| `eksluziv-network:validated` | EKSLUZIV NETWORK gates, KPI evidence, and audit trail completed |
| `eksluziv-network:needs-review` | EKSLUZIV NETWORK domain or downstream governance requires follow-up |

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

## FOR ALL RLS Hardening downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — FOR ALL RLS hardening | `spaja86/IO-OPENUI-AO` — Follow-up required | Align RLS policy assumptions for shared Supabase usage and security docs references |

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#FOR-ALL-RLS-HARDENING -> IO-OPENUI-AO#<follow-up issue>`

## GREAT SUMBION downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — GREAT SUMBION weighted-score track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Current scope is repo-local module/API/validator; downstream runtime coupling must be tracked by follow-up issue |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#GREAT-SUMBION -> IO-OPENUI-AO#<follow-up issue>`

## TRENAŽER downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — TRENAŽER training-readiness track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Initial scope is repo-local engine/API/component/docs only; downstream consumer rollout must be tracked explicitly |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#TRENAZER -> IO-OPENUI-AO#<follow-up issue>`

## PARAKSIL downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — PARAKSIL module-validation sandbox | `spaja86/IO-OPENUI-AO` — No linked repo change required | Initial scope is repo-local validation engine/API/docs only; downstream shared-consumer rollout must be tracked explicitly |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#PARAKSIL -> IO-OPENUI-AO#<follow-up issue>`

## EPRINCIP downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EPRINCIP principle-alignment track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Initial scope is repo-local module/API/docs only; any downstream consumer must be tracked explicitly |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#EPRINCIP -> IO-OPENUI-AO#<follow-up issue>`

## REAL GUN downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — REAL GUN safety-bound track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Scope is documentation-level safety contract in this repo; future runtime coupling requires explicit downstream issue |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#REAL-GUN -> IO-OPENUI-AO#<follow-up issue>`

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

## EKSLUZIV NETWORK — Audit Trail

### Initiative

Domain-scoped deploy governance initiative for EKSLUZIV NETWORK, using segmented rollout rings and per-domain exit criteria across core platform, Nova Generacija, Mekartor, multi-repo sync, monitoring, and operativa.

| Field | Value |
|---|---|
| Version | v42.35.0+ |
| Date | 2026-08-15 |
| Owner | @spaja86 |
| Tracking doc | `docs/EKSLUZIV-NETWORK.md` |
| OKRID | `OKRID-2026-EKSLUZIV-001` |
| Primary workflows | `.github/workflows/deploy-platforma.yml`, `.github/workflows/vercel-deploy.yml`, `.github/workflows/mirikl-validator.yml` |

### Cross-repo references

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EKSLUZIV NETWORK | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: labels, milestones, downstream references, nova-generacija-gaming-refs, agent-config compatibility |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Confirm shared label schema alignment for `eksluziv-network*` governance labels
- Open downstream follow-up when shared contracts, fairness assumptions, or linked rollout references move
- Confirm `multi-repo-sync-agent` sync coverage = 100%
- Update `docs/MULTI-REPO-LINKS.md` in IO-OPENUI-AO with the bidirectional EKSLUZIV NETWORK reference

**Audit convention for this initiative:**
```text
AI-IQ-SUPER-PLATFORMA#EKSLUZIV-NETWORK -> IO-OPENUI-AO#<follow-up issue>
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

## BASTAI — Audit Trail

### Scope

BASTAI je repo-local governance surface za subscription / billing / compliance tumačenje zahteva `PRETPLATA "BASTAI" PRIVREDNI DOPRINOS U IZNOSU 1 "BESKONAČAN" RAČUN`.

| Field | Value |
|---|---|
| Date | 2026-08-05 |
| Owner | @spaja86 |
| Tracking doc | `docs/BASTAI-PRETPLATA-PRIVREDNI-DOPRINOS.md` |
| OKRID | `OKRID-2026-BASTAI-001` |

### Cross-repo assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — BASTAI governance | `spaja86/IO-OPENUI-AO` | No linked repo change required |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#BASTAI -> No linked repo change required`
- `AI-IQ-SUPER-PLATFORMA#OKRID-2026-BASTAI-001 -> No linked repo change required`
- Human review remains required because this is a payment/compliance governance change.

---

## GROCKA VINOGRAD — Audit Trail

### Scope

GROCKA VINOGRAD je repo-local governance surface za `PRETPLATA za GROCKA VINOGRAD d.o.o. po privrednoj akciznosti`.

| Field | Value |
|---|---|
| Date | 2026-08-15 |
| Owner | @spaja86 |
| Tracking doc | `docs/GROCKA-VINOGRAD-PRETPLATA-PRIVREDNA-AKCIZNOST.md` |
| OKRID | `OKRID-2026-GROCKA-001` |

### Cross-repo assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — GROCKA VINOGRAD governance | `spaja86/IO-OPENUI-AO` | No linked repo change required |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#GROCKA-VINOGRAD -> No linked repo change required`
- `AI-IQ-SUPER-PLATFORMA#OKRID-2026-GROCKA-001 -> No linked repo change required`
- Human review remains required because this is a payment/compliance governance change.

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

---

## Persona Bank — Cross-Repo Sync

### Persona Bank Downstream Impact

The Persona Bank (`src/lib/persona-bank/`) is the unified source-of-truth for all platform personas.
On push to `main` (paths touching `src/lib/persona-bank/**`), the `multi-repo-sync-agent` syncs persona bank snapshots to `spaja86/IO-OPENUI-AO`.

### Persona Bank Label Schema

| Label | Meaning |
|---|---|
| `persona-bank:change` | Persona Bank change set — requires agent validation |
| `persona-bank:validated` | Persona Bank validation workflow and tests passed |
| `persona-bank:needs-review` | Persona Bank validator requires human follow-up |

### Persona Bank Cross-Repo Assessment

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — Persona Bank initial rollout | `spaja86/IO-OPENUI-AO` | Persona snapshot sync required on main push |

### Audit convention

- `AI-IQ-SUPER-PLATFORMA#PERSONA-BANK-001 -> IO-OPENUI-AO persona snapshot sync on main push`
- Future cross-repo sync triggered on any persona type/octave schema change.

### Persona Bank KPI Enforcement

| KPI | Target | Enforced by |
|---|---|---|
| Persona lookup p99 | ≤ 10ms | `.github/workflows/persona-bank-validator.yml` + test |
| Bulk list p99 | ≤ 50ms | Test suite |
| Contract version | 1.0.0 | `src/lib/persona-bank/index.ts` |
| Max octaves | 16 | `PERSONA_BANK_MAX_OCTAVE` constant |
| Max hipermreza nodes | 256 | `PERSONA_BANK_MAX_HIPERMREZA_NODE` constant |
| Security scan coverage | 100% | `persona-bank-security` job |

---

## REAL BIK POK CREATE MAKSIMUM — Audit Trail

### Initiative

Governance and execution contract for the `REAL BIK POK CREATE MAKSIMUM` track, including requirements, phase gates, cross-repo dependencies, audit format, and release/rollback policy.

| Field | Value |
|---|---|
| Initiative ID | `REAL-BIK-POK-CREATE-MAKSIMUM-001` |
| Date | 2026-08-10 |
| Owner | @spaja86 |
| Tracking doc | `docs/REAL-BIK-POK-CREATE-MAKSIMUM.md` |

### Cross-repo references

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — REAL BIK POK CREATE MAKSIMUM | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: docs audit reference, shared labels, `.agent-config.json` compatibility, PR governance evidence |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add bidirectional initiative reference in linked-repo multi-repo doc
- Confirm shared label schema compatibility for governance/security gates
- Confirm `.agent-config.json` sync fields remain compatible for this initiative

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#REAL-BIK-POK-CREATE-MAKSIMUM -> IO-OPENUI-AO#<follow-up issue>
```

---

## Initiative: Discount Telecom Global Persona

| Field | Value |
|---|---|
| Initiative ID | `DISCOUNT-TELECOM-GLOBAL-001` |
| Date | 2026-08-10 |
| Owner | @spaja86 |
| Scope | `src/lib/discount-telecom/**`, `src/app/api/discount-telecom/**`, `src/components/discount-telecom/**` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — discount-telecom-global persona | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: operator catalog snapshots via multi-repo-sync-agent, persona-bank crossRepoRef, shared labels |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add `discount-telecom-global` persona cross-reference in linked-repo persona bank
- Sync operator catalog snapshots via `multi-repo-sync-agent`
- Confirm `discount-telecom:logic-change` label exists in linked repo label schema
- Register `discount-telecom-validator-agent` trigger in linked-repo `.agent-config.json`

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#DISCOUNT-TELECOM-GLOBAL-001 -> IO-OPENUI-AO#<follow-up issue>
```

---

## Initiative: MADAGASKAR Exotic Market Intelligence

| Field | Value |
|---|---|
| Initiative ID | `MADAGASKAR-EXOTIC-MARKET-001` |
| Date | 2026-08-11 |
| Owner | @spaja86 |
| Scope | `src/lib/madagaskar/**`, `src/app/api/madagaskar/**`, `src/components/madagaskar/**` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — madagaskar-exotic-market persona | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: exotic goods catalog snapshots via multi-repo-sync-agent, persona-bank crossRepoRef, shared labels |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add `madagaskar-exotic-market` persona cross-reference in linked-repo persona bank
- Sync exotic goods catalog snapshots via `multi-repo-sync-agent`
- Confirm `madagaskar:logic-change` label exists in linked repo label schema
- Register `madagaskar-validator-agent` trigger in linked-repo `.agent-config.json`

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#MADAGASKAR-EXOTIC-MARKET-001 -> IO-OPENUI-AO#<follow-up issue>
```

---

## MADAGASKAR 2 — Exotic Market Intelligence v2

| Field | Value |
|---|---|
| Date | 2026-08-11 |
| Owner | @spaja86 |
| Scope | `src/lib/madagaskar-2/**`, `src/app/api/madagaskar-2/**` |
| Contract | `MADAGASKAR2_CONTRACT_VERSION = v2`, `MADAGASKAR2_MODULE_VERSION = 2.0.0` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — MADAGASKAR 2 exotic goods catalog v2 | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: v2 exotic goods catalog snapshots (new goods: fungal, crystal, algae; Central-Africa, Himalaya, Arctic) via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync MADAGASKAR 2 exotic goods catalog v2 snapshots via `multi-repo-sync-agent`
- Add `madagaskar-2:logic-change` label to linked-repo label schema
- Update `madagaskar-validator-agent` trigger in linked-repo `.agent-config.json` to include v2 paths

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#MADAGASKAR-2-001 -> IO-OPENUI-AO#<follow-up issue>
```

---

## EXTRIMLI — Extreme Sports & Adventure Intelligence

| Field | Value |
|---|---|
| Date | 2026-08-12 |
| Owner | @spaja86 |
| Scope | `src/lib/extrimli/**`, `src/lib/extrimli-3/**`, `src/lib/procesuiranje-svega.ts`, `src/app/api/extrimli/**`, `src/app/api/extrimli-3/**`, `src/app/api/ekstremno-procesuiranje-svega/route.ts`, `src/components/extrimli/**` |
| Contract | `EXTRIMLI_CONTRACT_VERSION = v1`, `EXTRIMLI_MODULE_VERSION = 1.0.0`, `EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION = v1-destrukcija`, `EXTRIMLI3_CONTRACT_VERSION = v3`, `EXTRIMLI3_MODULE_VERSION = 3.0.0` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI gear catalog | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: gear catalog snapshots via multi-repo-sync-agent |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI DESTRUKCIJA asset catalog | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: destruction asset snapshots via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync EXTRIMLI gear catalog snapshots via `multi-repo-sync-agent`
- Sync EXTRIMLI DESTRUKCIJA asset snapshots via `multi-repo-sync-agent`
- Track EXTRIMLI 3 risk profile contract and readiness-scoring downstream impact
- Add `extrimli:logic-change` label to linked-repo label schema
- Add `ekstremno:logic-change` label for EKSTREMNO scheduler/contract updates
- Update `extrimli-validator-agent` trigger in linked-repo `.agent-config.json`
- Track DESTRUKCIJA contract headers/fields in linked API consumers
- Track EKSTREMNO degraded-mode audit headers/fields in linked API consumers

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-003 -> IO-OPENUI-AO#<follow-up issue>
```

## EXTRIMLI CUZ — Community & Social Hub

| Field | Value |
|---|---|
| Date | 2026-08-12 |
| Owner | @spaja86 |
| Scope | `src/lib/extrimli-cuz/**`, `src/app/api/extrimli-cuz/**`, `src/components/extrimli-cuz/**` |
| Contract | `CUZ_CONTRACT_VERSION = v1`, `CUZ_MODULE_VERSION = 1.0.0` |
| Persona | `extrimli-cuz-social` (octave: 7, hipermreza node: 57) |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI CUZ crew catalog | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: crew snapshots via multi-repo-sync-agent |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI CUZ mentor catalog | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: mentor snapshots via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync EXTRIMLI CUZ crew and mentor catalog snapshots via `multi-repo-sync-agent`
- Add `extrimli-cuz:logic-change` label to linked-repo label schema
- Update `extrimli-cuz-validator-agent` trigger in linked-repo `.agent-config.json`

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-CUZ-001 -> IO-OPENUI-AO#<follow-up issue>
```

---

## Agent Resilience — Kill Switch, Circuit Breaker & Self-Healing

| Field | Value |
|---|---|
| Module | `src/lib/agent-resilience/` |
| API | `src/app/api/agent-resilience/` |
| Scope | All agents across AI-IQ-SUPER-PLATFORMA |
| Contract | `AGENT_RESILIENCE_CONTRACT_VERSION = 1.0.0` |

## Digit Engine — 10-Digit Symbolic Intelligence Layer

| Field | Value |
|---|---|
| Date | 2026-08-12 |
| Owner | @spaja86 |
| Scope | `src/lib/digit-engine/**`, `src/app/api/digit-engine/**` |
| Contract | `DIGIT_ENGINE_CONTRACT_VERSION = v1`, `DIGIT_ENGINE_MODULE_VERSION = 1.0.0` |
| Persona | `digit-engine-core` (octave: 10, hipermreza node: 80) |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — agent-resilience health API | `spaja86/IO-OPENUI-AO` — Follow-up required | Platform-wide resilience state exposed via `/api/agent-resilience/health` |
| `AI-IQ-SUPER-PLATFORMA` — kill switch events | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: killed-agent state via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add `agent:resilience` label to linked-repo label schema
- Register `agent-resilience` entry in linked-repo `.agent-config.json`
- Subscribe to kill switch events from SUPER-PLATFORMA via webhook or nightly sync

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#AGENT-RESILIENCE-001 -> IO-OPENUI-AO#<follow-up issue>
| `AI-IQ-SUPER-PLATFORMA` — digit registry snapshots | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: digit registry snapshots via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync digit registry snapshots via `multi-repo-sync-agent`
- Add `digit-engine:change` label to linked-repo label schema
- Update `digit-engine-validator-agent` trigger in linked-repo `.agent-config.json`

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#DIGIT-ENGINE-001 -> IO-OPENUI-AO#<follow-up issue>
```


## MAKSIMUS — Analitički/Razvojni Apex Agent

| Field | Value |
|---|---|
| Date | 2026-08-14 |
| Owner | @spaja86 |
| Scope | `src/lib/maksimus/**`, `src/app/api/maksimus/**` |
| Contract | `MAKSIMUS_CONTRACT_VERSION = v1`, `MAKSIMUS_MODEL_VERSION = 1.0.0` |
| Persona | `maksimus` (octave: 13, hipermreza node: 128) |
| Linked Agent | `another-maks` (creative counterpart) |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — MAKSIMUS persona snapshots | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: MAKSIMUS persona snapshots via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync MAKSIMUS persona snapshots via `multi-repo-sync-agent`
- Add `maksimus:logic-change` label to linked-repo label schema
- Update `maksimus-validator-agent` trigger in linked-repo `.agent-config.json`

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#MAKSIMUS-001 -> IO-OPENUI-AO#<follow-up issue>
```


## EPEKM-D — Eksoidnig Permanent Email Maksim Denter

| Field | Value |
|---|---|
| Date | 2026-08-14 |
| Owner | @spaja86 |
| Scope | `src/lib/epekm-denter/**`, `src/app/api/epekm-denter/**`, `src/components/epekm-denter/**` |
| Contract | `EPEKM_CONTRACT_VERSION = v1`, `EPEKM_MODULE_VERSION = 1.0.0` |
| Persona | `epekm-denter-core` (octave: 11, hipermreza node: 88) |
| Linked Agents | `MAKSIMUS`, `ANOTHER MAKS`, `persona-bank-agent` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EPEKM-D email identity snapshots | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: email identity snapshots via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync EPEKM-D email identity snapshots via `multi-repo-sync-agent`
- Add `epekm-denter:logic-change` label to linked-repo label schema
- Update `epekm-denter-validator-agent` trigger in linked-repo `.agent-config.json`

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#EPEKM-D-001 -> IO-OPENUI-AO#<follow-up issue>
```

## MIRIKL — GitHub i Vercel governance

| Field | Value |
|---|---|
| Date | 2026-08-14 |
| Owner | @spaja86 |
| Scope | `docs/MIRIKL.md`, `.agent-config.json`, `.github/workflows/mirikl-validator.yml`, `.github/workflows/vercel-deploy.yml` |
| Tracking issue | `AI-IQ-SUPER-PLATFORMA#920` |
| OKRID | `OKRID-2026-MIRIKL-001` |
| Runtime model | Vercel = deploy/runtime source of truth, GitHub Actions = quality/audit/governance |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — MIRIKL governance baseline | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: MIRIKL labels, governance notes, and `.agent-config.json` compatibility |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add MIRIKL label schema compatibility (`mirikl`, `mirikl:logic-change`, `mirikl:review`, `mirikl:validated`, `mirikl:needs-review`)
- Record MIRIKL governance reference in linked repo multi-repo documentation
- Confirm downstream PR template still captures MIRIKL Cross-repo impact and audit evidence sections

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#OKRID-2026-MIRIKL-001 -> IO-OPENUI-AO#<follow-up issue>
```

## ZLATNI RAČUNI — Loyalty & Tier Platform Module

| Field | Value |
|---|---|
| Date | 2026-08-14 |
| Owner | @spaja86 |
| Scope | `src/lib/zlatni-racuni/**`, `src/app/api/zlatni-racuni/**`, `src/components/zlatni-racuni/**` |
| Persona | `zlatni-racuni-core` (octave: 3, hipermreza node: 24) |
| Validator | `zlatni-racuni-validator-agent` |
| Workflow | `.github/workflows/zlatni-racuni-validator.yml` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — ZLATNI RAČUNI loyalty module | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: tier snapshots (anonymized aggregate), labels, persona-bank registration |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add ZLATNI RAČUNI label schema (`zlatni-racuni`, `zlatni-racuni:logic-change`, `zlatni-racuni:validated`, `zlatni-racuni:needs-review`)
- Record ZLATNI RAČUNI downstream reference in linked repo documentation
- Sync zlatni-racuni-core persona to persona-bank in IO-OPENUI-AO

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#zlatni-racuni -> IO-OPENUI-AO#<follow-up issue>
```

## EKZIST — Existential Profiler & Life Meaning Engine

| Field | Value |
|---|---|
| Date | 2026-08-14 |
| Owner | @spaja86 |
| Scope | `src/lib/ekzist/**`, `src/app/api/ekzist/**`, `src/components/ekzist/**` |
| Persona | `ekzist-core` (octave: 2, hipermreza node: 16) |
| Validator | `ekzist-validator-agent` |
| Workflow | `.github/workflows/ekzist-validator.yml` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EKZIST existential profiling module | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: persona snapshot, labels, persona-bank registration |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add EKZIST label schema (`ekzist`, `ekzist:logic-change`, `ekzist:validated`, `ekzist:needs-review`)
- Record EKZIST downstream reference in linked repo documentation
- Sync ekzist-core persona to persona-bank in IO-OPENUI-AO

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#ekzist -> IO-OPENUI-AO#<follow-up issue>
```

## ÐUMBIR — Ginger Wellness Evaluation

| Field | Value |
|---|---|
| Date | 2026-08-15 |
| Owner | @spaja86 |
| Scope | `src/lib/dumbir/**`, `src/app/api/dumbir/**` |
| Persona | `dumbir-wellness-core` (octave: 12, hipermreza node: 96) |
| Validator | `dumbir-validator-agent` |
| Workflow | `.github/workflows/dumbir-validator.yml` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — ÐUMBIR ginger wellness module | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync labels and docs only if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add ÐUMBIR label schema (`dumbir`, `dumbir:logic-change`, `dumbir:validated`, `dumbir:needs-review`) only when the module is consumed downstream
- Record the canonical `dumbir` slug in linked repo documentation if external adoption starts
- Sync `dumbir-wellness-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#dumbir -> IO-OPENUI-AO#<optional follow-up issue>
```

## ADUTIV — Advantage Intelligence Engine

| Field | Value |
|---|---|
| Date | 2026-08-15 |
| Owner | @spaja86 |
| Scope | `src/lib/adutiv/**`, `src/app/api/adutiv/**`, `src/components/adutiv/**` |
| Persona | `adutiv-core` (octave: 14, hipermreza node: 112) |
| Validator | `adutiv-validator-agent` |
| Workflow | `.github/workflows/adutiv-validator.yml` |
| OKRID | `OKRID-2026-ADUTIV-001` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — ADUTIV advantage intelligence module | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync advantage portfolio snapshots if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add ADUTIV label schema (`adutiv`, `adutiv:logic-change`, `adutiv:validated`, `adutiv:needs-review`) only when the module is consumed downstream
- Record the canonical `adutiv` slug in linked repo documentation if external adoption starts
- Sync `adutiv-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#adutiv -> IO-OPENUI-AO#<optional follow-up issue>
```

## EKVIVALENT NETWORK — Equivalence Mapping Engine

| Field | Value |
|---|---|
| Date | 2026-08-15 |
| Owner | @spaja86 |
| Scope | `src/lib/ekvivalent-network/**`, `src/app/api/ekvivalent-network/**` |
| Persona | `ekvivalent-network-core` (octave: 15, hipermreza node: 120) |
| Validator | `ekvivalent-network-validator-agent` |
| Workflow | `.github/workflows/ekvivalent-network-validator.yml` |
| OKRID | `OKRID-2026-EKVIVALENT-NETWORK-001` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EKVIVALENT NETWORK equivalence mapping module | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync node/edge catalog snapshots if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add EKVIVALENT NETWORK label schema (`ekvivalent-network`, `ekvivalent-network:logic-change`, `ekvivalent-network:validated`, `ekvivalent-network:needs-review`) only when the module is consumed downstream
- Record the canonical `ekvivalent-network` slug in linked repo documentation if external adoption starts
- Sync `ekvivalent-network-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#ekvivalent-network -> IO-OPENUI-AO#<optional follow-up issue>
```

## ASTRONOMIK MONEY — Cosmic Financial Intelligence Engine

| Field | Value |
|---|---|
| Date | 2026-08-15 |
| Owner | @spaja86 |
| Scope | `src/lib/astronomik-money/**`, `src/app/api/astronomik-money/**` |
| Persona | `astronomik-money-core` (octave: 13, hipermreza node: 104) |
| Validator | `astronomik-money-validator-agent` |
| Workflow | `.github/workflows/astronomik-money-validator.yml` |
| OKRID | `OKRID-2026-ASTRONOMIK-MONEY-001` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — ASTRONOMIK MONEY cosmic portfolio engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync celestial asset catalog snapshots if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add ASTRONOMIK MONEY label schema (`astronomik-money`, `astronomik-money:logic-change`, `astronomik-money:validated`, `astronomik-money:needs-review`) only when the module is consumed downstream
- Record the canonical `astronomik-money` slug in linked repo documentation if external adoption starts
- Sync `astronomik-money-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#astronomik-money -> IO-OPENUI-AO#<optional follow-up issue>
```

## REKLAMITIN — Reprodukcion Advertising Engine (NOTE 14856)

| Field | Value |
|---|---|
| Date | 2026-08-17 |
| Owner | @spaja86 |
| Scope | `src/lib/reklamitin/**`, `src/app/api/reklamitin/**` |
| Persona | `reklamitin-core` (octave: 9, hipermreza node: 72) |
| Validator | `reklamitin-validator-agent` |
| Workflow | `.github/workflows/reklamitin-validator.yml` |
| OKRID | `OKRID-2026-REKLAMITIN-14856` |
| Note | 14856 — RADIKALNI NIVO |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — REKLAMITIN radical-level reproduction advertising engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync reproduction-ad catalog snapshots if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add REKLAMITIN label schema (`reklamitin`, `reklamitin:logic-change`, `reklamitin:validated`, `reklamitin:needs-review`) only when the module is consumed downstream
- Record the canonical `reklamitin` slug in linked repo documentation if external adoption starts
- Sync `reklamitin-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#reklamitin -> IO-OPENUI-AO#<optional follow-up issue>
```

## EXTRIMLI — Instrukcija Za Sve (Export Plan)

| Field | Value |
|---|---|
| Date | 2026-08-18 |
| Owner | @spaja86 |
| Scope | `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/app/api/extrimli/instrukcija/**` |
| Persona | `extrimli-core` (octave: 7, hipermreza node: 56) |
| Validator | `extrimli-validator-agent` |
| Endpoint | `GET /api/extrimli/instrukcija` — all modules; `GET /api/extrimli/instrukcija?module=<id>` — single |
| Export Bundle | `buildExtrimliExportBundle()` — sport registry + gear listing + instrukcija metadata |
| Bundle Version | `v1` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI instrukcija za sve export layer | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync instrukcija registry snapshots and export bundle if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Consume `GET /api/extrimli/instrukcija` for developer docs auto-generation
- Import `buildExtrimliExportBundle()` snapshot for catalog sync
- Extend `multiRepoSync.snapshots` with `instrukcija-registry` when downstream adoption starts

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#extrimli-instrukcija-za-sve -> IO-OPENUI-AO#<optional follow-up issue>
```
