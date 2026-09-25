# MULTI-REPO-LINKS — Coordination Operating Model

## Purpose

This document formalizes coordination between `spaja86/AI-IQ-SUPER-PLATFORMA` and linked repositories, especially `spaja86/IO-OPENUI-AO`.

## Linked repository registry

| Repository | Relationship | Sync cadence | Sync fields | Status |
|---|---|---|---|---|
| `spaja86/IO-OPENUI-AO` | Primary linked product repo | Weekly + on cross-repo change | versions, labels, milestones, agent-config, docs, shared contracts | Active coordination |
| `platforms/io-openui-ao/` | Local mirror / documentation surface | Per repo change | README, ownership, migration notes | Tracked locally |
| Other linked platform repos | Follow-up only until formally registered | Manual | links, milestones, release notes | Pending registration |

## `KRALJEVSTVO` ecosystem federation registry

| Domain | Relationship type | Role | Inbound / Outbound | Allowed summary signals | Forbidden raw/operational data | Downstream rule |
|---|---|---|---|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` | `runtime-integrated` | Central orchestration + governance hub | Inbound: linked domain summaries / Outbound: audit-safe registry + governance posture | `readiness`, `governance posture`, `approval status`, `blocker reason`, `downstream reference` | raw formulas, secrets, enforcement internals | Remains upstream source for ecosystem summary governance |
| `spaja86/IO-OPENUI-AO` | `summary-synced` | Primary downstream product surface | Inbound: upstream summary package / Outbound: follow-up issue, synced runbook evidence | audit-safe readiness/governance/public status only | raw EXTREM/EXTRONDOL internals, bank/KYC/payroll/security data | Must remain summary-only consumer |
| `AI IQ WORLD BANK` | `policy-linked` | Finance/governance frame | Inbound: approval/compliance/payment posture / Outbound: governance evidence | approval, compliance, payment-verification, payout-readiness, downstream reference | account numbers, KYC, statements, payment secrets | Follow-up only until linked repo adopts same audit-safe summary fields |
| `AI IQ MENJAČNICA` | `policy-linked` | Market/wallet operations layer | Inbound: payout posture + treasury readiness / Outbound: audit-safe market summary | readiness, payout posture, blocker reason, governance status | raw ledger data, wallet secrets, trading internals | Summary-only market posture across repos |
| `KOMPANIJA SPAJA` | `policy-linked` | Enterprise/operational umbrella | Inbound: rollout and owner signals / Outbound: enterprise summary | ownership, rollout posture, review state, downstream reference | HR/payroll internals, private contracts, credentials | Enterprise layer stays documentation/governance only downstream |
| `SVETSKA ORGANIZACIJA` | `policy-linked` | Global institutional frame | Inbound: legal/compliance posture / Outbound: audit-safe institutional summary | institutional readiness, ethics/compliance posture, blocker summary | sensitive identities, security maps, punitive procedures | Documentation/governance follow-up only |
| `OPENAI` | `external-provider` | External AI/provider boundary | Inbound: provider/compliance readiness / Outbound: provider dependency summary | provider status, compliance posture, activation blocker, downstream reference | API keys, billing credentials, provider-side secrets | External-provider boundary only, no mirrored runtime source-of-truth |
| `SPAJANIKOPENEVOLUTION` | `narrative-only` | Narrative/evolutionary ecosystem track | Inbound: bounded reflection signals / Outbound: documentation-safe narrative summary | narrative readiness, governance posture, audit reference | operational payloads, production formulas, security data | Narrative-only reflection, never runtime-coupled |

## `KRALJEVSTVO` execution model

- Initial scope lock remains `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA`.
- Existing ownership split remains canonical: `EXTREM` = technical signal, `EXTRONDOL` = WAWE/audit/freeze-promotion governance, `SPAJA KOD` = public summary boundary.
- New ecosystem links may be interpretative or audit-safe only; they must not create a parallel runtime source of truth.

### Four execution tracks

1. Technical domain integration
2. Governance and legal order
3. Enterprise / financial flows
4. Public / downstream reflection

### Expansion priority

1. `AI-IQ-SUPER-PLATFORMA ↔ spaja86/IO-OPENUI-AO`
2. `AI IQ WORLD BANK` + `AI IQ MENJAČNICA`
3. `KOMPANIJA SPAJA` + `SVETSKA ORGANIZACIJA`
4. `OPENAI` + `SPAJANIKOPENEVOLUTION`

### Rollout phases

| Phase | Scope | Output |
|---|---|---|
| `F1` | terminology + ecosystem charter | canonical domain naming and scope lock |
| `F2` | domain registry + ownership map | ecosystem registry and relation-type lock |
| `F3` | `IO-OPENUI-AO` downstream sync | summary-only sync rules and follow-up references |
| `F4` | `AI IQ WORLD BANK` + `AI IQ MENJAČNICA` bridge | finance/governance summary contract |
| `F5` | `KOMPANIJA SPAJA` + `SVETSKA ORGANIZACIJA` layer | enterprise/institutional summary package |
| `F6` | `OPENAI` provider boundary | external-provider compliance boundary |
| `F7` | unified `KRALJEVSTVO` audit summary | cross-domain audit-safe release snapshot |

## Required sync fields

- Dependency/version expectations for shared packages and workflows
- Label schema used by agents and reviewers
- Milestone names for roadmap delivery
- `.agent-config.json` expectations and agent enablement notes
- README and documentation links that point contributors across repos
- Follow-up issue or PR references for linked changes
- Feature-track metadata for race launches (labels, validation workflow, release docs)

## EXTRIMLI MASTER 3 downstream reference

| This repo | Linked repo | Note |
| --- | --- | --- |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI MASTER 3 coordinated release governance | `spaja86/IO-OPENUI-AO` — Follow-up required | Keep downstream rollout notes and WAWE/release-audit alignment in sync for EXTRIMLI + EXTRONDOL + EXTREM consumers, including canonical `ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA` governance signal fields |

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-MASTER-3 -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI SPAJAPRO downstream reference

| This repo | Linked repo | Note |
| --- | --- | --- |
| `AI-IQ-SUPER-PLATFORMA` — SPAJAPRO planning track over EXTRIMLI/EXTREM/EXTRONDOL | `spaja86/IO-OPENUI-AO` — Follow-up required | Downstream consumers must use SPAJA KOD public posture only; internal ODIT→KODER mapping stays repo-owned and hidden behind the public boundary |

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#SPAJAPRO-EXTRIMLI-TRACK -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI DOK/DIK/DAK/DUK/FOR consistency downstream reference

| This repo | Linked repo | Note |
| --- | --- | --- |
| `AI-IQ-SUPER-PLATFORMA` — `dokDikDakDukConsistencyHealth` contract over EXTREM + EXTRONDOL | `spaja86/IO-OPENUI-AO` — Follow-up required | Downstream sync must keep source-of-truth split (`DOK/DIK/FOR` technical in EXTREM, `DAK/DUK` governance in EXTRONDOL) and consume only audit-safe consistency status/reasons fields, including additive `programskiJezikProucavanja` + `programskiEkanalog` summary fields |

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-DOK-DIK-DAK-DUK-CONSISTENCY -> IO-OPENUI-AO#<follow-up issue>`

## AI PLATE downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — `AI PLATE` additive-only Vercel commercial/runtime package over EXTRIMLI / EXTREM / EXTRONDOL / SPAJA KOD
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Sync only audit-safe summary outputs (`developerAndCreateRepoWideReflection.aiPlateOffer.packageOutputs`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiPlateGovernance`, `spajaKod.publicSignals.aiPlateStatus`); invoices, payment methods, raw billing evidence, secrets, and internal governance formulas remain repo-local
- Downstream adoption remains follow-up only until the linked repo accepts the same summary contract

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#AI-PLATE-VERCEL-PACKAGE -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI ČOVEČANSTVU epilog package downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — `ČOVEČANSTVU` additive media track over EXTRIMLI / EXTREM / EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Downstream sync must consume only audit-safe outputs from the epilog package (`masterEpilog`, `posterSummary`, `videoStoryboardSummary`, `auditShortSummary`, `governanceChecklistStatus`); raw EXTREM/EXTRONDOL internals, formulas, and private governance mapping remain repo-local
- Implementation-package lock: downstream consumers may additionally mirror only audit-safe summary indicators (`publicSignals.developerAndCreateImplementationStatus`, `developerAndCreateImplementationPackage`, `developerAndCreateVisualReflection.packageOutputs`, `epilogijaCovecnosti.packageOutputs`) and must not copy raw EXTREM/EXTRONDOL technical or governance internals
- Narrative lock: user-facing package must preserve the same message across image/video/public summary — čovek želi čudo, `Sunce` i `Sunčanica` se spajaju, prirodni odnos prelazi u opasnost, čovečanstvo mora da čuva prirodu
- Governance lock: linked-repo publication remains blocked until human review, downstream reference, and rollback readiness are all explicit

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-COVECANSTVU-EPILOG -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI SINEMETRIČKO PROGRAMIRANJE downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — SINEMETRIČKO PROGRAMIRANJE additive track over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Sync only audit-safe governance/readiness outputs (`extremProfiler.sinemetrickoProgramiranje.readiness`, `sinemetrickoProgramiranje.waweImpact`, `releaseAuditSummary.sinemetrickoProgramiranjeGovernance`); internal matrix formulas and raw matrix payloads remain repo-local

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-SINEMETRICKO-PROGRAMIRANJE -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI objektno orijentisana prongilacija downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — Objektno orijentisana prongilacija over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Downstream consumers should sync only the audit-safe readiness/governance fields from EXTREM and EXTRONDOL; raw object-state internals remain hidden behind SPAJA KOD

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-OBJEKTNO-ORIJENTISANA-PRONGILACIJA -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI METRIČKO PROGRAMIRANJE downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — METRIČKO PROGRAMIRANJE additive track over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Sync only audit-safe readiness/governance outputs (`extremProfiler.metrikoProgramiranje.readiness`, `metrikoProgramiranje.waweImpact`, `releaseAuditSummary.metrikoProgramiranjeGovernance`, `spajaKod.publicSignals.metrikoProgramiranjeStatus`); declaration matrix and instance-positioning internals stay repo-local

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-METRICKO-PROGRAMIRANJE -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI PROGRAMSKI JEZIK PRETPOSTAVKA downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — PROGRAMSKI JEZIK PRETPOSTAVKA additive track over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Sync only audit-safe readiness/governance outputs (`extremProfiler.programskiJezikPretpostavka.readiness`, `programskiJezikPretpostavka.waweImpact`, `releaseAuditSummary.programskiJezikPretpostavkaGovernance`, `spajaKod.publicSignals.programskiJezikPretpostavkaStatus`); internal pretpostavka semantics, raw FOR payloads, and action-shape internals remain repo-local

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-PROGRAMSKI-JEZIK-PRETPOSTAVKA -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI objektno orijentisana reprodukcija downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — Objektno orijentisana reprodukcija over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Sync only audit-safe readiness/governance outputs (`extremProfiler.objektnoOrijentisanaReprodukcija.readiness`, `objektnoOrijentisanaReprodukcija.waweImpact`, `releaseAuditSummary.objektnoOrijentisanaReprodukcijaGovernance`); raw replay internals stay hidden behind SPAJA KOD

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-OBJEKTNO-ORIJENTISANA-REPRODUKCIJA -> IO-OPENUI-AO#<follow-up issue>`

## EXTRIMLI epic elikvadenti downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — Objektno orijentusano uzdizanje epskih elikvadenata over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Sync only audit-safe readiness/governance outputs (`extremProfiler.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness`, `epicElikvadenti.waweImpact`); raw controlled equivalents stay repo-local

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EPIC-ELIKVADENTI -> IO-OPENUI-AO#<follow-up issue>`

## KRALJEVSKI PRAVNI UNIVERZITET downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — KRALJEVSKI PRAVNI UNIVERZITET legal-governance track over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Downstream consumers must sync only audit-safe summarized fields (`extremProfiler.kraljevskiPravniUniverzitetTrack.readiness`, `kraljevskiPravniUniverzitetGovernance`, `releaseAuditSummary.kraljevskiPravniUniverzitetGovernance`, `spajaKod.publicSignals.kraljevskiPravniUniverzitetStatus`); doctrinal source material remains repo-local/documentation-only

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#KRALJEVSKI-PRAVNI-UNIVERZITET -> IO-OPENUI-AO#<follow-up issue>`

## ŽELEZARA / HBIS pretplata downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — Železara/HBIS subscription identity governance over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up required
- Note: Downstream consumers must sync only audit-safe identity/governance outputs (`extremProfiler.zelezaraPretplataIdentityTrack.readiness`, `zelezaraPretplataGovernance`, `releaseAuditSummary.zelezaraPretplataGovernance`, `spajaKod.publicSignals.zelezaraPretplataIdentityStatus`); public-safe output must return `Železara` whenever restore-old-name is marked mandatory

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#ZELEZARA-PRETPLATA-HBIS -> IO-OPENUI-AO#<follow-up issue>`

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
| `aktiviti-all` | AKTIVITI ALL change set — requires focused validation |
| `aktiviti-all:logic-change` | AKTIVITI ALL contract or readiness logic changed |
| `aktiviti-all:validated` | AKTIVITI ALL validator and tests passed |
| `aktiviti-all:needs-review` | AKTIVITI ALL validator requires human follow-up |
| `dumbir` | ÐUMBIR change set — requires focused validation |
| `dumbir:logic-change` | ÐUMBIR ginger wellness contract or scoring logic changed |
| `dumbir:validated` | ÐUMBIR validator and tests passed |
| `dumbir:needs-review` | ÐUMBIR validator requires human follow-up |
| `pilotrelax` | PILOTRELAX change set — requires focused validation |
| `pilotrelax:logic-change` | PILOTRELAX relaxation contract or scoring logic changed |
| `pilotrelax:validated` | PILOTRELAX validator and tests passed |
| `pilotrelax:needs-review` | PILOTRELAX validator requires human follow-up |
| `opkongo` | OPKONGO change set — requires focused validation |
| `opkongo:logic-change` | OPKONGO opportunity-progression contract or scoring logic changed |
| `opkongo:validated` | OPKONGO validator and tests passed |
| `opkongo:needs-review` | OPKONGO validator requires human follow-up |
| `spaja-drustvena-mreza` | SPAJA Društvena Mreža change set — requires focused validation |
| `spaja-drustvena-mreza:logic-change` | SPAJA Društvena Mreža profiles/feed/groups/messages/events logic changed |
| `spaja-drustvena-mreza:validated` | SPAJA Društvena Mreža validator and tests passed |
| `spaja-drustvena-mreza:needs-review` | SPAJA Društvena Mreža validator requires human follow-up |
| `nude` | NUDE change set — requires focused validation |
| `nude:logic-change` | NUDE readiness contract or scoring logic changed |
| `nude:validated` | NUDE validator and tests passed |
| `nude:needs-review` | NUDE validator requires human follow-up |
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

## DIREKT downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — DIREKT direct-communication track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Initial scope is repo-local module/API/docs only; any downstream consumer must be tracked explicitly |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#DIREKT -> IO-OPENUI-AO#<follow-up issue>`

## SPAJA Društvena Mreža downstream reference

- **This repo**: `AI-IQ-SUPER-PLATFORMA` — SPAJA Društvena Mreža v1
- **Linked repo**: `spaja86/IO-OPENUI-AO` — No linked repo change required
- **Note**: Current scope is repo-local profiles/feed/groups/messages/events/notifikacije surface; downstream runtime coupling is deferred until an IO-OPENUI-AO consumer exists

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#SPAJA-DRUSTVENA-MREZA -> IO-OPENUI-AO#<follow-up issue>`

## REAL GUN downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — REAL GUN safety-bound track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Scope is documentation-level safety contract in this repo; future runtime coupling requires explicit downstream issue |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#REAL-GUN -> IO-OPENUI-AO#<follow-up issue>`

## GAMES catalog downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — GAMES catalog/surface expansion | `spaja86/IO-OPENUI-AO` — No linked repo change required | Scope is registry + UI + API + runner compatibility metadata in this repo; downstream sync is optional follow-up only |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#GAMES-CATALOG -> IO-OPENUI-AO#<follow-up issue>`

## GAMELORD downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — GAMELORD standalone mode | `spaja86/IO-OPENUI-AO` — No linked repo change required | Scope is repo-local `src/lib/gamelord`, `/api/gamelord/*`, and games catalog metadata; downstream runtime sync is optional follow-up only |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#GAMELORD -> IO-OPENUI-AO#<follow-up issue>`

## REPOZIT downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — REPOZIT repository-management module | `spaja86/IO-OPENUI-AO` — Follow-up required | Maintain sync for repository references, labels/milestones expectations, and linked-repo audit trails when shared governance metadata changes |

Audit reference convention:

`AI-IQ-SUPER-PLATFORMA#REPOZIT -> IO-OPENUI-AO#<follow-up issue>`

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

**2026-09-04 contract-hardening update (DISCAUNT compatibility scope):**
- Contract remains `v1` (no breaking payload changes); only validation consistency and warning semantics were tightened.
- Linked repo action: pull latest operator/discount snapshots to keep parity with region-aware discount listing and inactive-operator handling.

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
| Scope | `src/lib/extrimli/**`, `src/lib/extrimli-3/**`, `src/lib/extrimli-duel-king/**`, `src/lib/extrimli-extrem/**`, `src/lib/procesuiranje-svega.ts`, `src/app/api/extrimli/**`, `src/app/api/extrimli/duel-king/**`, `src/app/api/extrimli/extrem/**`, `src/app/api/extrimli-3/**`, `src/app/api/ekstremno-procesuiranje-svega/route.ts`, `src/components/extrimli/**` |
| Contract | `EXTRIMLI_CONTRACT_VERSION = v1`, `EXTRIMLI_MODULE_VERSION = 1.0.0`, `EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION = v1-destrukcija`, `EXTRIMLI3_CONTRACT_VERSION = v3`, `EXTRIMLI3_MODULE_VERSION = 3.0.0`, `EXTRIMLI_DUEL_KING_CONTRACT_VERSION = v1-duel-king`, `EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION = v1-extrem-profiler` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI gear catalog | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: gear catalog snapshots via multi-repo-sync-agent |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI DESTRUKCIJA asset catalog | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: destruction asset snapshots via multi-repo-sync-agent |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI DUEL KING readiness snapshot | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: duel readiness / tournament posture snapshot via multi-repo-sync-agent |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTREM profiler snapshot | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: DISKVIT conflict profile (`conflictIntensity`, `optimizationTier`, freeze signal) via multi-repo-sync-agent |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI global licensing + activity coverage snapshot | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: `extremProfiler.businessLicensingSignals` + `b2bReadiness.globalLicensing` + coverage blockers via multi-repo-sync-agent |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Sync EXTRIMLI gear catalog snapshots via `multi-repo-sync-agent`
- Sync EXTRIMLI DESTRUKCIJA asset snapshots via `multi-repo-sync-agent`
- Sync EXTRIMLI DUEL KING readiness snapshots via `multi-repo-sync-agent`
- Sync EXTRIMLI EXTREM profiler snapshots via `multi-repo-sync-agent`
- Sync EXTRIMLI global licensing jurisdiction/activity readiness snapshots via `multi-repo-sync-agent`
- Track EXTRIMLI 3 risk profile contract and readiness-scoring downstream impact
- Track WAWE freeze blockers linked to global-license gaps in downstream governance docs
- Add `extrimli:logic-change` label to linked-repo label schema
- Add `duel-king:logic-change` label to linked-repo label schema
- Add `extrem:logic-change` label to linked-repo label schema
- Add `ekstremno:logic-change` label for EKSTREMNO scheduler/contract updates
- Update `extrimli-validator-agent` trigger in linked-repo `.agent-config.json`
- Track DESTRUKCIJA contract headers/fields in linked API consumers
- Track EKSTREMNO degraded-mode audit headers/fields in linked API consumers

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-003 -> IO-OPENUI-AO#<follow-up issue>
```

### EXTRIMLI — START Deploy (SPAJA Platform)

| Field | Value |
|-------|-------|
| **Deploy workflow** | `.github/workflows/extrimli-spaja-deploy.yml` |
| **Go-live tracking** | `docs/EXTRIMLI-START-DEPLOY.md` |
| **OKRID** | `OKRID-2026-EXTRIMLI-START-001` |
| **Persona** | `extrimli-core` (octave: 7, hipermreza node: 56) |
| **Canonical domain strategy** | `spaja.nivo-spaja` (apex) + `*.spaja.nivo-spaja` (wildcard) |

| Source (AI-IQ-SUPER-PLATFORMA) | Target (IO-OPENUI-AO) | Sync |
|------|------|------|
| EXTRIMLI gear catalog snapshot — START deploy | `spaja86/IO-OPENUI-AO` — Follow-up required | `multi-repo-sync-agent` post-deploy |
| EXTRIMLI v3 risk profiles — START deploy | `spaja86/IO-OPENUI-AO` — Follow-up required | Follow-up after v3 stabilization |
| EXTRIMLI START domain strategy reference | `spaja86/IO-OPENUI-AO` — Follow-up required | Mirror apex + wildcard convention in linked docs/runbooks |

**Downstream tasks (post START deploy):**
- Confirm gear catalog snapshot sync to IO-OPENUI-AO after first successful production deploy
- Add `extrimli:start-deploy` label to linked-repo label schema
- Update `extrimli-validator-agent` trigger in linked-repo `.agent-config.json` to include START deploy ref
- Track EXTRIMLI v1 + v3 API contract versions in linked repo consumers
- Verify `extrimli-core` persona (node: 56) registered in persona-bank post-deploy
- Mirror canonical DNS convention (`spaja.nivo-spaja` + `*.spaja.nivo-spaja`) u linked deploy dokumentaciji

```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-START-001 -> IO-OPENUI-AO#<follow-up issue>
```

### EXTRIMLI — TRANCE EXTREM Deploy (Platform SPAJA)

| Field | Value |
|-------|-------|
| **Deploy workflow** | `.github/workflows/extrimli-trance-extrem-deploy.yml` |
| **Go-live tracking** | `docs/EXTRIMLI-TRANCE-EXTREM.md` |
| **OKRID** | `OKRID-2026-EXTRIMLI-TRANCE-001` |
| **Persona** | `extrimli-core` (octave: 7, hipermreza node: 56) |
| **Phases** | Phase 1 Ignition → Phase 2 Build → Phase 3 Staging → Phase 4 Sync → Phase 5 Production → Phase 6 Resilience |

| Source (AI-IQ-SUPER-PLATFORMA) | Target (IO-OPENUI-AO) | Sync |
|---|---|---|
| EXTRIMLI gear catalog snapshot — Trance Extrem | `spaja86/IO-OPENUI-AO` — Follow-up required | `multi-repo-sync-agent` Phase 4 |
| EXTRIMLI v3 risk profiles — Trance Extrem | `spaja86/IO-OPENUI-AO` — Follow-up required | Follow-up after Trance Extrem stabilization |
| `.agent-config.json` extrimli block | `spaja86/IO-OPENUI-AO` — Follow-up required | `multi-repo-sync-agent` Phase 4 |
| `versionRoadmap` / `roadmapAlignment` governance snapshot | `spaja86/IO-OPENUI-AO` — Follow-up required | Mirror staged roadmap contract and primary-version audit in downstream governance docs |

**Downstream tasks (post Trance Extrem deploy):**
- Confirm gear catalog snapshot sync to IO-OPENUI-AO after Phase 4 multi-repo sync
- Verify `extrimli-core` persona (node: 56) active in persona-bank post Phase 4
- Confirm apex convergence ≥ 0.95 (node 56 → node 256) in Phase 6 resilience check
- Add `extrimli:trance-extrem` label to linked-repo label schema
- Verify `analytics-bot` captured deploy metrics (time, latency p95, error rate)
- Mirror `v1-7-roadmap` contract and `Verzija 5` orchestration alignment in linked EXTRIMLI governance consumers

```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-TRANCE-001 -> IO-OPENUI-AO#<follow-up issue>
```

### EXTRIMLI — External GitHub Surface

| Field | Value |
|---|---|
| Date | 2026-09-03 |
| Owner | @spaja86 |
| Scope | `docs/EXTRIMLI-EXTERNAL-GITHUB.md`, `.github/workflows/extrimli-external-github.yml`, `.github/workflows/extrimli-validator.yml`, `.github/workflows/extrimli-governance-conformance.yml`, `.agent-config.json`, `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/lib/extrimli-duel-king/**`, `src/lib/extrimli-extrondend/**`, `src/lib/extrimli-extrondol/**`, `src/lib/extrimli-extrem/**`, `src/app/api/extrimli/duel-king/**`, `src/app/api/extrimli/extrondend/**`, `src/app/api/extrimli/extrondol/**`, `src/app/api/extrimli/extrem/**`, `src/app/api/extrimli/instrukcija/**` |
| Quality gate | `extrimli-validator-agent` |
| Runtime source of truth | Vercel Git integration |
| GitHub Actions role | audit governance + downstream coordination |

### EXTRIMLI — Developer/Create Program

| Field | Value |
|---|---|
| Date | 2026-09-17 |
| Owner | @spaja86 |
| Program doc | `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md` |
| Source-of-truth routes | `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` |
| Change model | additive-only (no breaking changes) |
| Drift policy | drift-zero (`docs + types + routes + tests + workflows`) |
| PR execution lock | One PR = one roadmap stage + measurable output (`roadmapStageId`, `measurableOutput`, `acceptanceEvidence`) |
| Audit package lock | Standardized PR audit fields (`rolloutPlan`, `rollbackPlan`, `kpiImpact`, `humanReviewStatus`, `downstreamReference`) |

| Source (AI-IQ-SUPER-PLATFORMA) | Target (IO-OPENUI-AO) | Sync |
|---|---|---|
| Developer/Create roadmap lock (Verzije 1–7) | `spaja86/IO-OPENUI-AO` — Follow-up required | Mirror staged roadmap contract, `versionRoadmap.developerCreateLock`, and governance checkpoints in downstream runbooks |
| Developer/Create repo-wide reflection (`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection`, shared `READY/WATCH/BLOCKED` language, deterministic fallback discipline, and daily cadence lock (`morning-startup`, `deep-focus-block`, `midday-checkpoint`, `end-of-day-closeout`, priorities `1–3`, closeout `completed | carried-over | blocked`) across docs/types/routes/tests/workflows |
| Developer/Create canonical vocabulary + `OSNOVE / RISPEKT` protocol | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe evidence fields (`canonicalGovernanceVocabulary`, `osnoveRispektProtocol`, release-audit readiness status) while preserving additive-only/no-new-route policy and unchanged EXTREM↔EXTRONDOL ownership lock |
| Developer/Create four-track package + `Kompanija SPAJA / Digitalna Industrija` enterprise summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.canonicalScopeLock`, `developerAndCreateRepoWideReflection.fourTrackProgramPackage`, `developerAndCreateRepoWideReflection.currentImplementationStage.rolloutPlan`, `developerAndCreateRepoWideReflection.currentImplementationStage.rollbackPlan`, `developerAndCreateRepoWideReflection.currentImplementationStage.humanReviewStatus`, `developerAndCreateRepoWideReflection.currentImplementationStage.downstreamReference`, `spajaKod.developerAndCreateImplementationPackage.fourTrackSummary`, `spajaKod.developerAndCreateImplementationPackage.kompanijaSpajaDigitalnaIndustrijaSummary`) and never create a linked-repo business runtime source-of-truth |
| Developer/Create `AI KLASTER TELEVIZIJA PRETPLATA` legacy migration | `spaja86/IO-OPENUI-AO` — Follow-up required | Legacy package is deprecated as a standalone governance target; use `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md` + `docs/EXTRIMLI-EXTERNAL-GITHUB.md` as canonical migration surfaces and keep `docs/EXTRIMLI-AI-KLASTER-TELEVIZIJA-PRETPLATA.md` as legacy provider/distribution reference during transition; sync only summary-safe `ready/watch/blocked`, review posture, rollback posture and downstream reference fields (no raw commercial internals) |
| Developer/Create audio-vizuelni kontrabas paket | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.audioVisualKontrabasPackage.readinessStatus`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage.reviewPosture`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage.downstreamReference`, `spajaKod.publicSignals.developerAndCreateAudioVisualStatus`, `spajaKod.developerAndCreateVisualReflection.audioVisualKontrabasPackage`, `spajaKod.developerAndCreateImplementationPackage.audioVisualKontrabasSummary`) and keep raw glasovni, montažni i interni signalni detalji repo-local |
| Developer/Create smart programski jezik summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.canonicalName`, `developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.technicalProfile.status`, `developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.blockerReasons`, `developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.watchReasons`, `developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.reviewPosture`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.smartProgramskiJezikPackage.governanceMirror.downstreamReference`, `spajaKod.publicSignals.smartProgramskiJezikStatus`, `spajaKod.developerAndCreateImplementationPackage.smartProgramskiJezikSummary`) and keep raw EXTREM procenti i interni governance scoring detalji repo-local |
| Developer/Create `TELEVIZIJA` bounded media/distribution package | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields (`developerAndCreateRepoWideReflection.televizijaDistributionPackage.distributionStatus`, `developerAndCreateRepoWideReflection.televizijaDistributionPackage.blockerReasons`, `developerAndCreateRepoWideReflection.televizijaDistributionPackage.watchReasons`, `developerAndCreateRepoWideReflection.televizijaDistributionPackage.reviewPosture`, `developerAndCreateRepoWideReflection.televizijaDistributionPackage.providerPlanSummary`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.televizijaDistributionPackage.downstreamReference`, `spajaKod.publicSignals.televizijaDistributionStatus`, `spajaKod.developerAndCreateImplementationPackage.televizijaDistributionSummary`) and keep raw provider formulas, internal negotiations, payment details, placement tactics and any enforcement/bypass logic repo-local |
| Developer/Create vizuelizacija ekstremnog kvaliteta programski jezik bounded alias (`scenarioId=developer-create-vizuelizacija-ekstremnog-kvaliteta-oktavni-sistem`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields under `developerAndCreateRepoWideReflection`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance` and `spajaKod.developerAndCreateImplementationPackage` for canonical alias `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == VIZUELIZACIJA EKSTREMNOG KVALITETA PROGRAMSKI JEZIK (SPOZNAVANJE OBJEKTNIH PRIMESA U OKTAVNOM SISTEMU)` covering status, blocker/watch reasons, review posture, rollout/rollback posture, downstream reference, and bounded progression snapshot (`360D,720D,1440D,2880D,5760D` via `publicSignals.immersiveVisualization3dStatus`); keep raw EXTREM visual-quality scoring, internal oktavni interpretation, spatial audio internals and governance formulas repo-local |
| Developer/Create Napoleon Diskaveri bounded alias | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.napoleonDiskaveriSelectionTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.napoleonDiskaveriSelectionTrack`, `spajaKod.publicSignals.napoleonDiskaveriStatus`, `spajaKod.developerAndCreateImplementationPackage.napoleonDiskaveriSummary`) covering canonical alias, status, blocker/watch reasons, human-review posture and downstream reference; keep raw discovery/selection internals repo-local and do not create a downstream source-of-truth system |
| Developer/Create Eksperiment Programski Jezik bounded alias | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.eksperimentProgramskiJezikTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.eksperimentProgramskiJezikTrack`, `spajaKod.publicSignals.eksperimentProgramskiJezikStatus`, `spajaKod.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary`) covering canonical alias `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == EKSPERIMENT PROGRAMSKI JEZIK (PRODUKCIJA FILMSKOG I AUDIO REPERTOARA)`, status, blocker reason, human-review posture and downstream reference; ownership split remains `DOK/DIK/FOR=EXTREM`, `DAK/DUK=EXTRONDOL`, `SPAJA KOD=summary-only` and raw internals stay repo-local |
| Developer/Create Sarkazam / Privredna Grana Digitalizma bounded alias | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.sarkazamPrivrednaGranaDigitalizmaTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.sarkazamPrivrednaGranaDigitalizmaTrack`, `spajaKod.publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus`, `spajaKod.developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary`) covering canonical alias `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == SARKAZAM / PRIVREDNA GRANA DIGITALIZMA / PROJEKTI ENTUZIJAZMA PO ČINU OBLASTIMA`, status, blocker/watch reasons, review posture, downstream reference and bounded `oblast/čin` summary; keep raw interpretative narrative, internal governance detail and business logic repo-local |
| Developer/Create `DIJALIZA POGONSKOG OMOTAČA` interpretativni alias | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary references (`developerAndCreateRepoWideReflection.interpretationAliases`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.canonicalTerminologyMapping`) to confirm additive-only alias posture; no new runtime routes, no parallel source-of-truth, unchanged ownership split (`DOK/DIK/FOR=EXTREM`, `DAK/DUK=EXTRONDOL`, `SPAJA KOD=summary-only`) |
| Developer/Create `NOTES 1450` bounded work-continuation package | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.notes1450Track`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.notes1450Track`, `spajaKod.publicSignals.notes1450Status`, `spajaKod.developerAndCreateImplementationPackage.notes1450Summary`) covering canonical alias `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == NOTES 1450`, status, blocker/watch reasons, review posture, downstream reference and business-value summary; keep raw AI analysis, internal scoring and governance formulas repo-local |
| Developer/Create `POSLOVNA PONUDA` Vercel bridge paket | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.poslovnaPonudaTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.poslovnaPonudaTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.poslovnaPonudaTrack.wawePhase`, `spajaKod.publicSignals.poslovnaPonudaStatus`, `spajaKod.publicSignals.poslovnaPonudaWawePhase`, `spajaKod.developerAndCreateImplementationPackage.poslovnaPonudaSummary`) covering canonical alias `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA`, `github-subscription-bridge-until-in-person-meeting` posture, `READY/WATCH/BLOCKED`, blocker/review posture, WAWE phase and downstream reference; keep raw commercial negotiation context, internal EXTREM/EXTRONDOL formulas and payment internals repo-local |
| Developer/Create `INSPEKTORI` justice-path governance summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateRepoWideReflection.inspektori`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.inspektori`, `spajaKod.publicSignals.inspektoriStatus`, `spajaKod.publicSignals.inspektoriSummary`, `spajaKod.developerAndCreateImplementationPackage.inspektoriSummary`) covering status, active-university count, review posture, justice-path consistency and blocker reason; never sync raw investigations, operational-security procedures, sensitive identities/maps, tactics or repressive details downstream |
| Developer/Create `PRIVREDNI AKT / ZADRUGA / INSTRUMENT TABLA / VLASTELA REQUEST` governance summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-safe fields (`developerAndCreateUniversitySummary.zadrugaOperationalStatus`, `developerAndCreateUniversitySummary.instrumentTablaStatus`, `developerAndCreateUniversitySummary.payoutGovernancePosture`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.zadrugaGovernance.freezeRequired`) and keep raw governance/payment details repo-local; no new routes, no KYC/bank data downstream |
| Developer/Create `STOČARSTVO / VINOGRADARSTVO / POLJOPRIVREDNI FAKULTET / GRAĐEVINSKI FAKULTET / PEDAGOŠKI FAKULTET / PSIHOLOŠKI FAKULTET` bounded summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields (`developerAndCreateUniversitySummary.additiveFacultyAndAgricultureTracks`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks`) covering readiness, workforce/infrastructure posture, review posture and rollout freeze; keep raw project, labor and governance internals repo-local, keep psychological scope non-clinical, and do not create new routes downstream |
| Developer/Create `GRĐEVINARSKI FAKULTET / GRADITI TOPOLOGIJOM...` governance alias summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields (`developerAndCreateUniversitySummary.additiveFacultyAndAgricultureTracks.gradjevinskiAktReadiness`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.gradjevinskiAktReviewPosture`, `spajaKod.developerAndCreateImplementationPackage.građevinskiAktSummary`) covering `readiness`, `review posture`, `blocker reason`; do not sync raw formulas or introduce any runtime “po m²” source-of-truth downstream |
| AI PLATE enterprise package (`DEVELOPER AND CREATE / VRH PROGRAMSKOG EKVILADENTA / AI PLATE`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe snapshot fields: `aiPlateEnterprisePackageStatus`, `roadmapStageId=Verzija 7`, release audit status, activation blockers summary, downstream reference, acceptance evidence, `aiIdentityFinanceGovernance.catalogSummary`, `aiIdentityFinanceGovernance.packageOutputs`; do **not** create a linked-repo pricing or billing source-of-truth, but activation/promotion remains blocked until this audit-safe downstream snapshot evidence exists |
| AI IQ WORLD BANK prepiska + `BEZPOVRATNE SUBVENCIJE` governance (`AI LIČNA KARTA + AI BANKARSKI RAČUN`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe correspondence snapshot fields: `aiIdentityFinanceGovernance.aiIqWorldBankPrepiska`, `aiIdentityFinanceGovernance.bezpovratneSubvencijeGovernance`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance`, `spajaKod.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary`; never sync real bank records, KYC, raw statements, payment secrets, operational credentials, or introduce a linked-repo banking source-of-truth |
| KRALJEVSKI DRUŠTVENI POREDAK + `GRAĐEVINSKI AKT` + `KRALJEVSKA DOPUNA` governance | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields: `developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiDrustveniPoredak`, `spajaKod.developerAndCreateImplementationPackage.kraljevskiDrustveniPoredakSummary`; never sync raw eligibility records, KYC/bank data, sensitive social evidence, operational payout details, or create a linked-repo social/financial source-of-truth |
| KRALJEVSKI AKT BEZBEDNOSTI + `KRALJEVSKA PLATA` + `KRALJEVSKA VOJNA I POLICIJSKA OPREMA` bounded governance summary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields: `developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti`, `developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaVojnaIPolicijskaOprema`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti`, `spajaKod.publicSignals.kraljevskiAktBezbednostiStatus`, `spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary`, `spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary`, `spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaVojnaIPolicijskaOpremaSummary`; for `kraljevskaPlataSummary` sync only `approvalStatus`, `payoutReadinessStatus`, `paymentVerificationRequired`, `paymentVerificationStatus`, `blockerReason` i `publicSummary`; never sync tactical instructions, sensitive maps, operational identities, payroll/bank/KYC data, weaponization details, or raw governance formulas downstream |
| Developer/Create ČOVEČNOST audit visual (`scenarioId=covecnost-developer-create-vrh-radni-takt`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference`, `spajaKod.developerAndCreateVisualReflection`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-poker-zivotna-igra-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for kukuruz/priroda/bašta/čovečanstvo themes and must not promote source-text body/health phrases into runtime logic |
| Developer/Create URL-locked supplemental audit visuals (`scenarioId=covecanstvo-url-locked-ad9aff82-supplemental-visual-developer-create`, `covecanstvo-url-locked-85463ed4-supplemental-visual-developer-create`, `covecanstvo-url-locked-a508472d-supplemental-visual-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe summary fields (public label, narrative ID, bounded interpretation, readiness status) until exact titles/themes are confirmed; keep raw asset interpretation repo-local and do not introduce new runtime routes or alternate source-of-truth metadata downstream |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-epilog-mape-uma-slike-znacenje-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for mind-map/images-plus-meaning/learning/knowledge/creativity/collaboration/sustainability/peace/humanity-epilog themes |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-trijologija-davo-u-ruci-lisica-u-kavezu-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-blagoslov-darivati-bogpatiju-epilog-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for kraljevska-muzicka-povelja/epilog-u-covecanstvo/shared-world/shared-rhythm/spiritual-release/bounded-symbolic-governance themes and must not promote raw poster text into runtime logic, identity, finance, security, or religion-enforcement behavior |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for legal-citizenship/garden-productivity/humanity-epilog themes |
| Developer/Create KRALJEVSTVO / ČOVEČANSTVO supplemental audit visual (`scenarioId=kraljevstvo-covecanstvo-pravo-bica-znanje-tehnologija-ravnoteza-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for pravo-bića/postojanje, zajedništvo jednog sveta/jedne porodice, znanje/inovacija/tehnologija, produktivnost/razvoj/bolji svet, and priroda/čovek/tehnologija u ravnoteži themes |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for bozanstvo/pravoslavlje/covecanstvo themes |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-kraljevska-vodica-pravo-etika-mir-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for pravo/etika/pravda/mir/civic-order epilog themes, while raw poster references to force, punishment or doctrine must never become downstream runtime enforcement logic |
| Developer/Create KRALJEVSTVO supplemental audit visual (`scenarioId=kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for kraljevstvo/pravoslavlje/znanje/priroda/covecanstvo/jedan-svet-jedna-porodica/vecnost themes |
| Developer/Create KRALJEVSTVO professional global campaign supplemental audit visual (`scenarioId=kraljevstvo-profesionalna-globalna-kampanja-medijska-strategija-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for Nikola Spajić public-presentation/global-visibility, čovečanstvo/znanje/obrazovanje, priroda/život/tehnologija, porodica/društvo/zdravlje, pravda/budućnost/razvoj, profesionalni gejming, AI IQ WORLD BANK governance-patronage, and audit-safe media-strategy themes |
| Developer/Create ČOVEČANSTVO — EPILOG / KRALJEVSTVO / GILSKULTURE supplemental audit visual (`scenarioId=covecanstvo-epilog-kraljevstvo-gilskulture-znanje-mir-odgovornost-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for kraljevstvo/covecanstvo-epilog/znanje-citanje/deca-buduci-narastaji/priroda-covek-tehnologija-u-ravnotezi/mir-pravda-odgovornost themes, while raw poster references to `zakon silnog` or similar religious/punitive language must remain source-text-only and never become downstream runtime enforcement logic |
| Developer/Create KRALJEVSTVO supplemental audit visual (`scenarioId=kraljevstvo-zvanicno-moje-pravo-lice-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for kraljevstvo/zajednistvo/znanje/priroda/tehnologija/humanost themes |
| Developer/Create KRALJEVSKA KUĆA supplemental audit visual (`scenarioId=kraljevska-kuca-srbija-smederevo-jedan-planet-jedan-narod-jedna-buducnost-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-only audit-safe fields (`scenarioId`, readiness status, ownership lock summary, bounded thematic labels) from (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`); linked repo may consume only bounded legal/ethics/peace/civic-order epilog themes while raw “svetska organizacija / kraljevska institucija / zakon silnog” source text stays documentation/evidence-only and must never become downstream runtime enforcement logic |
| Developer/Create PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental audit visual (`scenarioId=kraljevski-poduhvat-vukovi-projekat-srbija-beli-vuk-crni-vuk-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only summary-only audit-safe fields (`scenarioId`, readiness status, ownership lock summary, bounded thematic labels) from (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`); keep raw visual interpretation and internal governance detail repo-local |
| Developer/Create AI identity-card supplemental audit visual (`scenarioId=licna-karta-ai-identitet-odgovorna-vestacka-inteligencija-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; activation/version/creator/purpose remain documentation cues only and must not become identity/auth/security payloads downstream |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-pontcerima-jutarnje-sunce-poprave-vid-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for vid/jutarnje-sunce/licno-iskustvo/epilog-covecanstvu themes |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-narastaj-u-prirodnom-cvatu-epilog-blagodarim-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for growth/seed-potential/light-opportunity/human-flourishing/gratitude themes |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for seed-growth/clean-input/planetary-stewardship/shared-world/small-change-large-impact/better-tomorrow themes |
| Developer/Create ČOVEČANSTVO supplemental audit visual (`scenarioId=covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe supplemental visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences`, `spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences`) and keep raw image interpretation repo-local; linked repo may consume only summary metadata for mental-reflection/understanding-thoughts/empathetic-humanity/shared-healing-metaphor/stronger-people-better-world themes |
| Developer/Create `ČOVEČANSTVO / OSEĆAJ OSEBENOSTI` companion audit visual (`scenarioId=covecanstvo-osecaj-osebenosti-developer-create-vrh-radni-takt`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync only audit-safe companion visual-summary fields (`developerAndCreateRepoWideReflection.covecnostAuditVisualReference.companionAuditVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences`, `spajaKod.developerAndCreateVisualReflection.companionAuditVisualReferences`) and keep raw image interpretation repo-local |
| Developer/Create current implementation phase (`roadmapStageId=v5-extrondol-release-audit-and-orchestration`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Keep downstream boundary audit-safe only until linked repo adopts the same summary fields; do not introduce new runtime routes |
| EXTREM freeze/warning separation and DISKVIT governance signal posture | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync runbook interpretation for warning vs blocked freeze triggers |
| EXTRONDOL orchestration core (`releaseAuditSummary`, `releaseReadinessScorecard`, `contractDriftReport`, `governanceConformance`) | `spaja86/IO-OPENUI-AO` — Follow-up required | Keep downstream governance consumers aligned with mandatory payload |
| Developer/Create PR execution + audit package lock | `spaja86/IO-OPENUI-AO` — Follow-up required | Mirror one-stage-per-PR mapping and standardized audit package fields in downstream PR governance |
| DOKER/KURAT/IZEK/DOKAR additive quartet track | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync public-safe quartet summary and downstream-sync interpretation without exposing internal mapping |
| Program expansion proposals (canary dashboard, PR single-pane summary, contract evolution log, rehearsal, KPI alarms) | `spaja86/IO-OPENUI-AO` — Follow-up required | Track implementation status and compatibility notes as additive governance features |

**Downstream tasks:**
- Mirror developer/create additive-only policy in linked governance docs
- Keep WAWE 1–5 + human-review hard gate alignment
- Confirm drift-zero enforcement expectations in downstream contract-change process, including `docs + types + routes + tests + workflows`
- Track proposal adoption as optional additive governance enhancements
- Mirror PR execution lock (`roadmapStageId`, `measurableOutput`, `acceptanceEvidence`) in downstream issue/PR templates
- Weekly enterprise AI package promotion must include downstream reference back to this repo plus an audit package; linked repo may consume summary status only, but the upstream package stays blocked until that summary snapshot is actually synchronized.
- Mirror operational audit package lock (`rolloutPlan`, `rollbackPlan`, `kpiImpact`, `humanReviewStatus`, `downstreamReference`) in downstream release workflow templates
- Mirror daily cadence governance artifact in downstream runbooks without introducing a new runtime task domain
- Until linked repo adopts the same audit-safe summary fields, keep Developer/Create repo-wide reflection sync as documentation/governance follow-up only

```text
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-DEVELOPER-CREATE-001 -> IO-OPENUI-AO#<follow-up issue>
```

### EXTRIMLI EXTEMEL/EXTREMOL WAWE map

| WAWE | Source stage | Downstream obligation (`spaja86/IO-OPENUI-AO`) |
|---|---|---|
| WAWE 1 | Pre-release validation (test/lint/KPI/security/labels) | Confirm label schema compatibility |
| WAWE 2 | Vercel build + staging checks | Confirm deploy/governance references stay aligned |
| WAWE 3 | Snapshot sync | Consume gear/export/instrukcija snapshots |
| WAWE 4 | Production rollout rings (10%→50%→100%) | Track rollout dependency and open follow-up if blocked |
| WAWE 5 | Resilience + analytics audit | Confirm cross-repo audit status and human sign-off readiness |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI external GitHub audit surface | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync audit references, labels i ownership matrica |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI instrukcija export bundle | `spaja86/IO-OPENUI-AO` — Follow-up required | Consume export bundle ako downstream docs/catalog sync koristi contract |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI module health snapshot | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync health/KPI summary za downstream observability |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI DUEL KING surface | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `readinessScore`, `duelRiskScore`, `gearCleared`, `tournamentState` snapshot (`/api/extrimli/duel-king`) |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI Extendol unified surface | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync unified readiness + acceptance criteria snapshot (`/api/extrimli/extendol`) |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI KORON overlay surface | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `status`, `readinessScore`, `degradedSources` snapshot (`/api/extrimli/koron`) |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTRONDEND aggregation surface | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `aggregationScore`, `readinessParityScore`, naming-lock acceptance (`/api/extrimli/extrondend`) |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTRONDOL orchestration surface | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync WAWE orchestration fields (`currentWawe`, `eligibleNextWawe`, `promotionFreeze`) (`/api/extrimli/extrondol`) |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTRONDOL B2B scope/readiness | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `b2bScope` ownership/roles/flow/SLA/audit fields + `b2bReadiness` tenant/support/compliance/downstream state |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTRONDOL PROVERA UPLATA | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `paymentVerification` gate (`status`, `invoiceResolutionPath`, `blockers`, `auditTimestamp`, `readinessImpact`) i vezu sa Vercel invoice governance pravilima |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTREM DISKVIT profiler | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `/api/extrimli/extrem` snapshot (`profile.conflictIntensity`, `profile.optimizationTier`, `governanceSignal.freezeRequired`) and mirror into EXTRONDOL WAWE governance runbook |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI governance conformance audit | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `releaseReadinessScorecard`, `canaryRingMetrics`, `incidentPlaybook`, `contractDriftReport`, `governanceConformance` from `/api/extrimli/extrondol` and weekly conformance workflow status |

### EXTRIMLI — World Bank to Persona bridge

| Field | Value |
|---|---|
| Source contract 1 | `/api/ai-iq-world-bank` |
| Source contract 2 | `/api/extrimli/health`, `/api/extrimli/extrondol` |
| Bridge contract | `/api/extrimli/world-bank-persona` |
| Persona target | `extrimli-core` |
| Governance gate | WAWE + promotion freeze + evidence lock (`contract`, `onboarding`, `downstream sync`, `audit`, `human review`) |
| Trigger | `extrimli:logic-change` + manual apply with `x-extrimli-bridge-token` (audit agent fixed to `extrimli-world-bank-persona-orchestrator`) |
| Ownership | `@spaja86 / Kompanija SPAJA / Digitalna Industrija` |

| Source (AI-IQ-SUPER-PLATFORMA) | Target (IO-OPENUI-AO) | Sync |
|---|---|---|
| EXTRIMLI World Bank persona snapshot (`extrimli-core`) | `spaja86/IO-OPENUI-AO` — Follow-up required | `multi-repo-sync-agent` syncs mapped persona attributes and lifecycle decision audit metadata |
| WAWE governance decision for persona promotion | `spaja86/IO-OPENUI-AO` — Follow-up required | Mirror `currentWawe`, `eligibleNextWawe`, `promotionFreeze`, and missing-evidence reasons in linked persona governance runbook |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI DISTANCE RATIO EKVILATER table | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `distanceRatioEkvilaterTable` summary + pairwise row fields (`distance`, `distanceRatio`, `equilateralAlignment`, `balanced`) from `/api/extrimli/extrondol` |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI NIVO DUET / DINKOS signal contract | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync DUET→WAWE map fields (`valid`, `status`, `overallScore`, `warnings`) + DINKOS lock metadata (`classification`, `triggerLabel`, `personaId`) from EXTRONDOL payload |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI EXTREM resolution vocabulary | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync additive EXTREM resolution fields (`resolutionReadiness.rezolucijaScore`, `ekodorState`, `rekulitiPoRauletu`, `discanInKibenState`) plus EXTRONDOL audit/downstream mirrors |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI START PROJEKAT governance payload | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `startProject` rollout/governance fields (`initiativeId`, `programName`, `orchestrationInputs.upstreamSurfaces`, `orchestrationInputs.duetRole`, `downstreamSync`, `qualityGates`, `auditRelease`) from `/api/extrimli/extrondol` |
| `AI-IQ-SUPER-PLATFORMA` — MAKSIMUS↔EXTRIMLI integration gate | `spaja86/IO-OPENUI-AO` — Follow-up required | Keep `maksimus-validator` and `extrimli-validator` trigger/schema alignment |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add `extrimli:external-github` label to linked-repo label schema
- Add `duel-king` and `duel-king:logic-change` labels to linked-repo label schema
- Add `extrem:logic-change` label to linked-repo label schema
- Track `agent:config-change` compatibility for EXTRIMLI governance changes
- Consume `buildExtrimliExportBundle()` snapshot kada linked repo koristi developer docs auto-generation
- Record EXTRIMLI external audit ownership i GitHub workflow references
- Align `extrimli:logic-change` and `agent:config-change` usage for Extendol+MAKSIMUS gate changes
- Track `/api/extrimli/extendol` contract compatibility in downstream consumers
- Track `/api/extrimli/koron` contract compatibility in downstream consumers
- Track `/api/extrimli/extrondend` contract compatibility in downstream consumers
- Track `/api/extrimli/extrondol` contract compatibility in downstream consumers
- Track additive B2B EXTRONDOL fields: `b2bScope.consumerModel`, `b2bScope.partnerOperatorRoles`, `b2bReadiness.tenant.rolloutRing`, `b2bReadiness.compliance.humanReviewComplete`, `b2bReadiness.compliance.blockers`, `b2bReadiness.governanceDecisions.partnerReadinessWarnings`
- Track governance conformance artifacts: `releaseReadinessScorecard`, `canaryRingMetrics`, `incidentPlaybook`, `contractDriftReport`, `governanceConformance`
- Track `paymentVerification` compatibility (`status`, `invoiceResolutionPath`, `evidence`, `blockers`, `auditTimestamp`, `readinessImpact`) for downstream governance consumers
- Track additive `distanceRatioEkvilaterTable` compatibility, including canonical field name plus requested-label alias `DISANCE RATOR EKVILATER`
- Track NIVO DUET / DINKOS contract compatibility (`valid`, `status`, `overallScore`, `warnings`, `dinkos.triggerLabel`, `dinkos.personaId`) in downstream consumers
- Track additive EXTREM resolution vocabulary compatibility (`resolutionReadiness.rezolucijaScore`, `ekodorState`, `rekulitiPoRauletu`, `discanInKibenState`) and EXTRONDOL mirrors in downstream consumers
- Track additive `startProject` compatibility (`initiativeId`, `programName`, `orchestrationInputs.upstreamSurfaces`, `orchestrationInputs.duetRole`, `downstreamSync.syncedContractFields`, `qualityGates.kpiTargets`, `auditRelease`)
- Confirm EXTRIMLI KORON overlay surface fields are mapped before promotion past WAWE 3
- Confirm EXTRONDEND/EXTRONDOL naming lock is mirrored in downstream docs and label schema
- Mirror label schema: `nivo-duet:logic-change`, `dinkos:logic-change`
- Mirror domain strategy lock: `spaja.nivo-spaja` (`EXTRONDOL_CANONICAL_APEX_DOMAIN`) + `*.spaja.nivo-spaja` (`EXTRONDOL_CANONICAL_WILDCARD_DOMAIN`); requested `spaja.nivo*spaja` remains invalid
- Confirm B2B activation remains blocked downstream until contract/onboarding/downstream-sync/human-review evidence is present
- Open mandatory follow-up issue ako downstream ostane delimično neusaglašen posle WAWE 3/4

**Audit convention for this initiative:**
```text
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTERNAL-GITHUB -> IO-OPENUI-AO#<follow-up issue>
IO-OPENUI-AO#<follow-up issue> -> AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTERNAL-GITHUB
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-NIVO-DUET-DINKOS-001 -> IO-OPENUI-AO#<follow-up issue>
```

**Extended audit convention:**
```text
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTENDOL-001 -> IO-OPENUI-AO#<follow-up issue>
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTRONDEND-001 -> IO-OPENUI-AO#<follow-up issue>
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTRONDOL-001 -> IO-OPENUI-AO#<follow-up issue>
AI-IQ-SUPER-PLATFORMA#MAKSIMUS-EXTRIMLI-001 -> IO-OPENUI-AO#<follow-up issue>
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
| Naming | Canonical: `EKZIST` / `ekzist`, Compatibility alias: `EXIST` |
| Scope | `src/lib/ekzist/**`, `src/app/api/ekzist/**`, `src/components/ekzist/**` |
| Persona | `ekzist-core` (octave: 2, hipermreza node: 16) |
| Validator | `ekzist-validator-agent` |
| Workflow | `.github/workflows/ekzist-validator.yml` |
| Contract spec | `docs/EKZIST.md` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EKZIST existential profiling module | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync: persona snapshot, labels, persona-bank registration |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add EKZIST label schema (`ekzist`, `ekzist:logic-change`, `ekzist:validated`, `ekzist:needs-review`)
- Record EKZIST downstream reference in linked repo documentation
- Sync ekzist-core persona to persona-bank in IO-OPENUI-AO
- Keep compatibility alias note (`EXIST` -> canonical `ekzist`) in downstream docs to avoid split labels/routes

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

## NUDE — Normalized Unified Deterministic Evaluation

| Field | Value |
|---|---|
| Scope | `src/lib/nude/**`, `src/app/api/nude/**` |
| Persona | `nude-balance-core` (octave: 8, hipermreza node: 65) |
| Validator | `nude-validator-agent` |
| Workflow | `.github/workflows/nude-validator.yml` |
| Contract | `v1` |
| Linked repo impact | `documentation-only` |

### Downstream policy

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — NUDE readiness module | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync labels/docs only if linked repo adopts the contract |

- Add NUDE label schema (`nude`, `nude:logic-change`, `nude:validated`, `nude:needs-review`) only when module is consumed downstream
- Record canonical `nude` slug in linked repo docs if external adoption starts
- Sync `nude-balance-core` persona to persona-bank only if repo-local v1 expands cross-repo

Audit reference convention (if downstream work is needed later):

AI-IQ-SUPER-PLATFORMA#nude -> IO-OPENUI-AO#<optional follow-up issue>
```

## PILOTRELAX — Relaxation Guidance

| Field | Value |
|---|---|
| Date | 2026-09-03 |
| Owner | @spaja86 |
| Scope | `src/lib/pilotrelax/**`, `src/app/api/pilotrelax/**` |
| Persona | `pilotrelax-calm-core` (octave: 7, hipermreza node: 58) |
| Validator | `pilotrelax-validator-agent` |
| Workflow | `.github/workflows/pilotrelax-validator.yml` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — PILOTRELAX relaxation module | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync labels and docs only if linked repo adopts the contract |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add PILOTRELAX label schema (`pilotrelax`, `pilotrelax:logic-change`, `pilotrelax:validated`, `pilotrelax:needs-review`) only when the module is consumed downstream
- Record the canonical `pilotrelax` slug in linked repo documentation if external adoption starts
- Sync `pilotrelax-calm-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#pilotrelax -> IO-OPENUI-AO#<optional follow-up issue>
```

## OPKONGO — Opportunity Progression & Commitment Guidance

| Field | Value |
|---|---|
| Date | 2026-09-04 |
| Owner | @spaja86 |
| Scope | `src/lib/opkongo/**`, `src/app/api/opkongo/**` |
| Persona | `opkongo-commit-core` (octave: 8, hipermreza node: 65) |
| Validator | `opkongo` label track |
| Workflow | `.github/workflows/opkongo-validator.yml` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — OPKONGO opportunity-progression module | `spaja86/IO-OPENUI-AO` — No linked repo change required | Current scope is repo-local module/API/docs only; downstream adoption can be tracked later |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Add OPKONGO label schema (`opkongo`, `opkongo:logic-change`, `opkongo:validated`, `opkongo:needs-review`) only when the module is consumed downstream
- Record the canonical `opkongo` slug in linked repo documentation if external adoption starts
- Sync `opkongo-commit-core` persona to persona-bank only if repo-local v1 expands cross-repo

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#opkongo -> IO-OPENUI-AO#<optional follow-up issue>
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

---

## ChatGPT Katalog — Multi-Repo Link

| Field | Value |
|-------|-------|
| Module | ChatGPT Katalog |
| Persona | `chatgpt-katalog-core` (octave: 10, hipermreza node: 81) |
| Validator | `chatgpt-katalog-validator-agent` |
| Scope | `discovery-and-recommendation` |
| Catalog mode | `static-reference` |
| Primary UI | `/chatgpt-katalog` |
| Endpoint | `GET /api/chatgpt-katalog` — list; `POST /api/chatgpt-katalog/search` — filtered search; `POST /api/chatgpt-katalog/compare` — compare; `POST /api/chatgpt-katalog/recommend` — recommend |
| Registry | 8 GPT models, 10 tools, 10 use-case templates |
| Linked modules | `nova-generacija`, `persona-bank`, `digit-engine` |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — ChatGPT Katalog source-of-truth registry and recommendation contract | `spaja86/IO-OPENUI-AO` — Follow-up optional | Consume the stable APIs or snapshot exports rather than duplicating registry logic |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Consume `GET /api/chatgpt-katalog` or `POST /api/chatgpt-katalog/search` for OpenAI model catalog browsing
- Import compare/recommend APIs for AI tool selection flows
- Extend `multiRepoSync.snapshots` with `chatgpt-katalog-registry` snapshot sourced from this repo’s static catalog
- Reuse `GET /api/chatgpt-katalog/health` for governance and persona metadata checks

**Downstream note:**
- No downstream breaking contract changes are introduced by this enhancement; added fields are additive.

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#chatgpt-katalog -> IO-OPENUI-AO#<optional follow-up>
```

---

## EKSELENCIO — Multi-Repo Link

| Field | Value |
|-------|-------|
| Module | EKSELENCIO — Excellence Intelligence Engine |
| Persona | `ekselencio-apex` (octave: 16, hipermreza node: 255) |
| Validator | `ekselencio-validator-agent` |
| OKRID | `OKRID-2026-EKSELENCIO-001` |
| Endpoint | `POST /api/ekselencio` — evaluate; `GET /api/ekselencio` — health |
| Framework | EKUARE RA EKSILARIUM (6 pillars: ES, KC, UOA, AR, RT, EV) |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — EKSELENCIO score engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync EKUARE RA score snapshots when downstream adoption starts |

**Potential follow-up in `spaja86/IO-OPENUI-AO`:**
- Consume `POST /api/ekselencio` for platform-wide excellence scoring
- Import EKUARE RA score as quality gate in calculator and gaming modules
- Extend `multiRepoSync.snapshots` with `ekselencio-score` snapshot

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#ekselencio -> IO-OPENUI-AO#<optional follow-up>
```

---

## TAJMING — Multi-Repo Link

| Field | Value |
|-------|-------|
| Module | TAJMING — Timing Intelligence Engine |
| Persona | `tajming-core` (octave: 5, hipermreza node: 41) |
| Validator | `tajming-validator-agent` |
| Endpoint | `POST /api/tajming/evaluate` — evaluate; `GET /api/tajming/health` — health |
| Focus | Circadian alignment, deadline proximity, action window scoring |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — TAJMING timing engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync timing score snapshots when downstream adoption starts |

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#tajming -> IO-OPENUI-AO#<optional follow-up>
```

---

## SWIMING — Multi-Repo Link

| Field | Value |
|-------|-------|
| Module | SWIMING — Swimming Performance & Wellness Engine |
| Persona | `swiming-core` (octave: 6, hipermreza node: 50) |
| Validator | `swiming-validator-agent` |
| Endpoint | `POST /api/swiming/evaluate` — evaluate; `GET /api/swiming/health` — health |
| Focus | Stroke efficiency, readiness scoring, caloric burn estimation, safety alerts |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — SWIMING readiness engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync swim readiness snapshots when downstream adoption starts |

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#swiming -> IO-OPENUI-AO#<optional follow-up>
```

---

## DRESING — Multi-Repo Link

| Field | Value |
|-------|-------|
| Module | DRESING — Outfit Intelligence & Dress-Code Advisor |
| Persona | `dresing-core` (octave: 4, hipermreza node: 33) |
| Validator | `dresing-validator-agent` |
| Endpoint | `POST /api/dresing/evaluate` — evaluate; `GET /api/dresing/health` — health |
| Focus | Dresscode alignment, weather adaptation, style coherence scoring |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — DRESING outfit engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync outfit recommendation snapshots when downstream adoption starts |

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#dresing -> IO-OPENUI-AO#<optional follow-up>
```

---

## DINOSAURUS-Trexar — Multi-Repo Link

| Field | Value |
|-------|-------|
| Module | DINOSAURUS-Trexar — Readiness & Tier Intelligence Engine |
| Persona | `dinosaurus-trexar-core` (octave: 10, hipermreza node: 81) |
| Validator | `dinosaurus-trexar-validator-agent` |
| Endpoint | `POST /api/dinosaurus-trexar/evaluate` — evaluate; `GET /api/dinosaurus-trexar/health` — health |
| Focus | Deterministic readiness scoring, threat adaptation, status/tier mapping |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — DINOSAURUS-Trexar evaluation engine | `spaja86/IO-OPENUI-AO` — Follow-up optional | Sync Trexar readiness snapshots when downstream adoption starts |

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#dinosaurus-trexar -> IO-OPENUI-AO#<optional follow-up>
```


## AKTIVITI ALL downstream reference

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — AKTIVITI ALL activity-readiness track | `spaja86/IO-OPENUI-AO` — No linked repo change required | Initial scope is repo-local module/API/validator/docs only; downstream consumer rollout must be tracked explicitly |

Audit reference convention (if downstream work is needed later):

`AI-IQ-SUPER-PLATFORMA#AKTIVITI-ALL -> IO-OPENUI-AO#<follow-up issue>`

---

## DIGITRON — Successor Digit Intelligence Layer

| Field | Value |
|---|---|
| Date | 2026-09-05 |
| Owner | @spaja86 |
| Scope | `src/lib/digitron/**`, `src/app/api/digitron/**` |
| Contract | `DIGITRON_CONTRACT_VERSION = v1`, `DIGITRON_MODULE_VERSION = 1.0.0` |
| Successor | `digit-engine` |
| Persona | `digitron-core` (octave: 10, hipermreza node: 81) |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — DIGITRON registry snapshots | `spaja86/IO-OPENUI-AO` — Follow-up required | Sync `digitron-registry` snapshots via `multi-repo-sync-agent` |

**Follow-up required in `spaja86/IO-OPENUI-AO`:**
- Add `digitron:logic-change` label to linked-repo label schema
- Add `digitron-validator-agent` trigger to linked-repo `.agent-config.json`
- Consume `/api/digitron/health` for contract and KPI metadata checks

**Audit convention for this initiative:**
```
AI-IQ-SUPER-PLATFORMA#DIGITRON-001 -> IO-OPENUI-AO#<follow-up issue>
```

---

## VLADARSKOG POREKLA — Campaign Landing/Registration Handoff

| Field | Value |
|---|---|
| Date | 2026-09-05 |
| Owner | `@spaja86` + IO-OPENUI-AO Web Experience tim |
| Scope | `docs/VLADARSKO-POREKLO-MANIFESTACIJA.md` |
| Landing slug | `/vladarskog-porekla` |
| Fallback slug | `/prijava/vladarskog-porekla` |
| Handoff/Audit ID | `VPOREKLO-2026-09` |
| Status | Draft (pending downstream issue/PR reference) |
| Downstream issue reference | TBD (dodati broj issue-ja u `spaja86/IO-OPENUI-AO`) |
| Downstream PR reference | TBD (dodati broj PR-a u `spaja86/IO-OPENUI-AO`) |
| Originating reference (this repo) | User task request: implement campaign plan for manifestacija „Vladarskog porekla“ (2026-09-05) |

### Downstream changes in `spaja86/IO-OPENUI-AO`

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — campaign content handoff | `spaja86/IO-OPENUI-AO` — Follow-up required | Implement `src/app/vladarskog-porekla/page.tsx` and `src/app/api/vladarskog-porekla/register/route.ts` per documented contract |

**Follow-up required in `spaja86/IO-OPENUI-AO` (draft handoff):**
- Open downstream issue for `VPOREKLO-2026-09` and back-link it in this section
- Implement landing sections: Hero + Program + Govornici i učesnici + Kontakt info (v1 static)
- Implement registration API with status codes (`201`, `400`, `409`, `500`) and documented payload contract
- Keep back-reference to source request in this repo (`VPOREKLO-2026-09`) for issue → PR → review trail

**Audit convention for this initiative (activate after downstream issue is opened):**
Koristiti format `AI-IQ-SUPER-PLATFORMA#VPOREKLO-2026-09 -> IO-OPENUI-AO#123` gde je `123` stvarni broj downstream issue-ja.

## EXTRIMLI informational flow downstream audit

- Downstream consumer: `spaja86/IO-OPENUI-AO`
- Upstream source: `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA`
- Scope: audit-safe downstream reference only
- Synced status fields: `extremProfiler.programskiJezikInformacionihTokova.readiness`, `programskiJezikInformacionihTokova.status`, `spajaKod.publicSignals.programskiJezikInformacionihTokovaStatus`
- Ownership lock: `FOR` + numerički tokovi = EXTREM/PETLJE technical source, `DOK/DIK` = EXTREM, `DAK/DUK` = EXTRONDOL, `SPAJA KOD` = public audit-safe summary
- EXTRIMLI governance conformance audit mora zadržati audit-ready public-safe summary bez otkrivanja internog pattern modela.


## EXTRIMLI PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA additive track over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up only / audit-safe summary sync
- Sync only audit-safe readiness/governance outputs (`extremProfiler.programskiJezikParadigmaOblikovanjeTela.readiness`, `programskiJezikParadigmaOblikovanjeTela.waweImpact`, `releaseAuditSummary.programskiJezikParadigmaOblikovanjeTelaGovernance`, `spajaKod.publicSignals.programskiJezikParadigmaOblikovanjeTelaStatus`); raw object-state, function-adaptation, delegation, and FOR internals remain repo-local

## Developer/Create AI IQ konferencija za štampu downstream reference

- This repo: `AI-IQ-SUPER-PLATFORMA` — `AI IQ KONFERENCIJA ZA ŠTAMPU (NOVINE, DIGITALNE NOVINE)` additive bounded media/documentation track over EXTRIMLI/EXTREM/EXTRONDOL
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up only / audit-safe summary sync
- Sync only audit-safe outputs (`developerAndCreateRepoWideReflection.aiIqKonferencijaZaStampuTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIqKonferencijaZaStampuTrack`, `spajaKod.publicSignals.aiIqKonferencijaZaStampuStatus`, `spajaKod.developerAndCreateImplementationPackage.aiIqKonferencijaZaStampuSummary`) covering status, blocker/watch posture, review posture, downstream reference and media summary; raw token groupings, raw EXTREM/EXTRONDOL formulas and internal evidence remain repo-local

## Developer/Create RADNI PROSTOR downstream reference

- Scope lock: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI PROSTOR`.
- Locked bounded token sequence (additive-only alias): `OKUR, DJUKUR, DAR, ZOR, IKON, ZULUM, DABRE, IZOS, JAKOR, DAPR, ZUKUR, ENTER, DIKAR, ZUMBUL, SIRGED, ZIKOR, DJENDER, ĆUR, NIKON, DERKO, ZUKAL, IKON, ZAJDI`.
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up only / audit-safe summary sync.
- Sync only audit-safe outputs (`developerAndCreateRepoWideReflection.radniProstorTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.radniProstorTrack`, `spajaKod.publicSignals.radniProstorStatus`, `spajaKod.developerAndCreateImplementationPackage.radniProstorSummary`) covering status, blocker/watch posture, review posture, downstream reference and token-lock coverage summary.
- Raw bounded-token interpretation internals and raw EXTREM/EXTRONDOL formulas remain repo-local.
- Ownership lock remains unchanged: `DOK/DIK/FOR -> EXTREM`, `DAK/DUK -> EXTRONDOL`, `SPAJA KOD -> summary-only`.

## Developer/Create AI IQ laboratorija downstream reference

- Scope lock: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ LABORATORIJA == LABORATORIJSKI NALAZI FAUNE I FLORE I GRAĐEVINSKOG MATERIJALA`.
- Locked bounded token sequence (additive-only alias): `ZUM, DUM, SAK, IK, MUN, DIKOT, DUN, ZAT, DJKUON, SIM, IKAR, DUKAR, IBAP, IRO, DUNOR, IBAN, UKOR, UTVAR, ZIPOT`.
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up only / audit-safe summary sync.
- Sync only audit-safe outputs (`developerAndCreateRepoWideReflection.aiIqLaboratorijaTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIqLaboratorijaTrack`, `spajaKod.publicSignals.aiIqLaboratorijaStatus`, `spajaKod.developerAndCreateImplementationPackage.aiIqLaboratorijaSummary`) covering status, blocker/watch posture, review posture, downstream reference and `nalazSummary`.
- Raw bounded-token interpretation internals, raw EXTREM/EXTRONDOL formulas and internal domain mappings (`AI IQ LABORATORIJA`, `FAUNA I FLORA`, `GRAĐEVINSKI MATERIJAL`) remain repo-local.
## Developer/Create KONSTRUKCIJE I PROJEKTOVANJE downstream reference

- Scope lock: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KONSTRUKCIJE I PROJEKTOVANJE`.
- Parent domain lock: `GRAĐEVINSKI FAKULTET / GRAĐEVINSKI AKT`.
- Linked repo: `spaja86/IO-OPENUI-AO` — Follow-up only / audit-safe summary sync.
- Sync only audit-safe outputs (`developerAndCreateRepoWideReflection.konstrukcijeIProjektovanjeTrack`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.konstrukcijeIProjektovanjeTrack`, `spajaKod.publicSignals.konstrukcijeIProjektovanjeStatus`, `spajaKod.developerAndCreateImplementationPackage.konstrukcijeIProjektovanjeSummary`) covering status, blocker/watch posture, review posture, downstream reference, publicBoundary, construction/design summary, and gradjevinski readiness summary.
- Raw bounded-token vocabulary, raw EXTREM/EXTRONDOL formulas, and internal governance evidence remain repo-local.
- Ownership lock remains unchanged: `DOK/DIK/FOR -> EXTREM`, `DAK/DUK -> EXTRONDOL`, `SPAJA KOD -> summary-only`.

## Developer/Create VRH Mape Uma global explanation sync

- Scope lock: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA`.
- Additive-only alias lock: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPA UMA` i `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ŽIVOPIS U DIGITALIZMU`.
- Downstream boundary for `spaja86/IO-OPENUI-AO` ostaje summary-only (bez sirovih EXTREM/EXTRONDOL formula).
- Obavezni public-safe signal paket za summary sync: `mape-uma, slike-plus-znacenje, ucenje, znanje, kreativnost, saradnja, odrzivost, mir`.
- Ownership ostaje nepromenjen: `DOK/DIK/FOR -> EXTREM`, `DAK/DUK -> EXTRONDOL`, `SPAJA KOD -> audit-safe-summary-only`.

## Developer/Create POSLOVNA PONUDA downstream reference

- Scope lock: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA`.
- Kanonska poruka ka Vercel-u ostaje governance artefakt: pozdrav, alternativna poslovna saradnja i prelazni model međusobne pretplate preko GitHub-a do fizičkog susreta.
- `github-subscription-bridge-until-in-person-meeting` ostaje privremeni operativni režim sa obaveznim aktivacionim uslovima: `contract-approval`, `compliance-review`, `human-review`, `payment-verification`, `downstream-reference`.
- Deaktivacija bridge režima je obavezna kada je fizički susret potvrđen ili kada je aktiviran freeze/rollback posture.
- Downstream boundary za `spaja86/IO-OPENUI-AO` ostaje summary-only: dozvoljeni su status (`READY | WATCH | BLOCKED`), blocker reason, review posture, WAWE faza i downstream reference.
- Ownership ostaje nepromenjen: `DOK/DIK/FOR -> EXTREM`, `DAK/DUK -> EXTRONDOL`, `SPAJA KOD -> audit-safe-summary-only`.
- Sirovi pregovarački/komercijalni detalji, interni scoring i payment internals ostaju repo-local.
