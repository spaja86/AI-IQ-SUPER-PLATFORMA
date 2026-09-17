# EXTRIMLI DOKER / KURAT / IZEK / DOKAR Track

## Purpose

This track adds an ordered four-token overlay to EXTRIMLI without changing the locked SPAJAPRO sequence. It exists to keep downstream sync, technical risk, audit/review, and rollback posture aligned across EXTREM, EXTRONDOL, and SPAJA KOD.

## Scope lock

- Additive-only
- Ordered and mandatory token sequence
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Downstream linked repo: `spaja86/IO-OPENUI-AO`
- Does **not** modify SPAJAPRO `ODIT → KODER`

## Locked token sequence

| Order | Token | Stable meaning | Owner | Governance use |
| --- | --- | --- | --- | --- |
| 1 | `DOKER` | Downstream synchronization | EXTREM signal, EXTRONDOL evidence | Keeps `spaja86/IO-OPENUI-AO` explicit |
| 2 | `KURAT` | Technical conflict/freeze risk | EXTREM | Drives WAWE freeze/watch posture |
| 3 | `IZEK` | Audit and human-review checkpoint | EXTRONDOL | Binds release audit + review evidence |
| 4 | `DOKAR` | Rollback preservation | EXTRONDOL | Keeps rollback mandatory before promotion |

## Ownership split

### EXTREM

- Publishes the technical quartet signal
- Keeps freeze authority independent
- Exposes bounded statuses only

### EXTRONDOL

- Consumes the quartet for WAWE progression
- Maps it into downstream sync, audit/review, and rollback controls
- Preserves additive compatibility with existing EXTRONDOL payloads

### SPAJA KOD

- Exposes only a public-safe quartet summary
- Keeps internal mapping hidden
- Must not expose raw technical formulas or private governance details

## Acceptance criteria

1. `DOKER → KURAT → IZEK → DOKAR` order is fixed.
2. `DOKER` keeps downstream-sync semantics.
3. SPAJAPRO `ODIT → KODER` remains unchanged.
4. EXTREM can still trigger freeze independently.
5. EXTRONDOL aligns `IZEK` with release audit and human review.
6. EXTRONDOL keeps `DOKAR` tied to rollback readiness.
7. `spaja86/IO-OPENUI-AO` remains explicit as the downstream reference.
8. SPAJA KOD exposes only public-safe quartet status.
