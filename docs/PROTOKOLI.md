# PROTOKOLI — Operational Control Center

## Purpose

PROTOKOLI is the repository-local operational control center for protocol registry, verification, lifecycle governance, incident handling, ownership, and audit visibility across the platform.
It extends the original read-heavy registry into a single module that exposes protocol metadata, verification snapshots, lifecycle proposals, and operator drill-down.

## Scope boundaries

- **In scope**: `/protokoli` UI, `/api/protokoli/**` routes, `src/lib/protokoli/**` registry/manager/verifier logic, runtime lifecycle state, audit logging, cron verification integration, and focused tests.
- **Out of scope**: cross-repository runtime synchronization, automatic approval workflows, external ticketing integrations, and durable persistence tables beyond the existing optional audit mirror.

## Module target state

PROTOKOLI is now modeled as an **operational control center**, not only as a passive registry.
The module tracks protocol ownership, criticality, environment, dependencies, SLO targets, verification outcomes, lifecycle proposals, approvals, rollbacks, and incident transitions.

## Contracts

| Field | Value |
|---|---|
| Display name | `PROTOKOLI` |
| Canonical route | `/protokoli` |
| Registry API | `/api/protokoli`, `/api/protokoli/[id]`, `/api/protokoli/status`, `/api/protokoli/export` |
| Verification API | `/api/protokoli/[id]/verifikuj`, `/api/protokoli/verifikacija-sve` |
| Lifecycle API | `/api/protokoli/[id]/status` |
| Runtime sources | `spaja-protokoli`, `autofinish-protokol-verifikacija`, `vlasnicki-vip-plan-dispatch-protokoli` |
| Registry strategy | `id + source priority dedup` |
| Operating model | `operativni-kontrolni-centar` |

## Protocol model

Every protocol record carries:

- canonical `id`, display `naziv`, `verzija`, `kategorija`, `status`, `opis`
- operational ownership: `vlasnik.tim`, `vlasnik.kontakt`, `vlasnik.uloga`
- operational risk context: `kriticnost`, `okruzenje`, `zavisnosti`
- service expectations: `slo.latencyTargetMs`, `slo.availabilityTargetPct`, `slo.maxIncidentResponseMin`
- source alignment: `izvor`, `vlasnickiModul`, `sourceOfTruth`
- runtime state: latest verification snapshot, last successful/failed verification timestamps, pending lifecycle proposals

## Verification layers

Each verification now runs deterministic checks across 6 layers:

1. **Struktura** — required fields, ownership, dependency sanity
2. **Bezbednost** — security signal presence for critical/security protocols
3. **Autentifikacija** — auth signal presence for auth-sensitive protocols
4. **Performanse** — measured latency against SLO-derived thresholds
5. **Integracija** — dependency declarations and repository source-of-truth path
6. **Compliance** — owner/contact, SLO bounds, environment rules, business-source alignment

## Lifecycle model

Supported lifecycle actions:

- `predlozi` — create a pending status change proposal with reason
- `odobri` — admin approval that executes a pending change
- `incident` — admin incident escalation
- `rollback` — admin rollback to the prior stable status

Every lifecycle action creates audit evidence and appears in protocol drill-down history.

## Status meaning

- `aktivan` — approved for active operational usage; must satisfy verification and ownership requirements
- `u-testu` — available for staged testing or partial rollout only
- `incident` — degraded or blocked due to failures requiring intervention
- `neaktivan` — intentionally disabled but still registered
- `deprecated` — retained for compatibility/history, not for new operational use

## Acceptance criteria for `aktivan`

A protocol should be considered `aktivan` only when:

- ownership is explicit and reachable
- source-of-truth is defined in the repository
- dependency chain is declared and non-self-referential
- latency stays within SLO-derived thresholds
- required security/auth signals are present for its category/criticality
- compliance check passes for owner, environment, and business rules
- there is no unresolved incident blocking active use

## Persistence model

Current persistence decision:

- **Code-defined and stable in Git**: canonical registry data and source priority rules
- **Runtime in-memory**: status overrides, verification snapshots, lifecycle proposal state
- **Best-effort production mirror**: audit records to `protokoli_audit_log` in Supabase when configured
- **Future durable persistence candidate**: status overrides and verification history if the module evolves into cross-instance operational control

## Cron and diagnostics integration

- `/api/cron/protokoli-verifikacija` now returns protocol summary plus escalated incident IDs.
- `/api/cron/healthcheck` now embeds richer PROTOKOLI summary so failures influence broader health diagnostics.
- Lifecycle and verification state remain repo-local runtime signals for now.

## Security and operations

- Admin-only operations are enforced for approval, rollback, and manual incident escalation.
- Proposal creation is allowed without strict admin gating so operational teams can submit change intent from the UI.
- No secrets or credentials are stored in protocol records.
- Audit logging remains mandatory for status and verification transitions.
