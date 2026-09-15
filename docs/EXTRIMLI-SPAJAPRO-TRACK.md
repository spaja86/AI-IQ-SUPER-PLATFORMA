# EXTRIMLI SPAJAPRO Track

## Purpose

SPAJAPRO is a new planning track layered on the existing EXTRIMLI stack. It does not replace EXTRIMLI, EXTREM, EXTRONDOL, or SPAJA KOD. Instead, it adds a locked interpretation sequence that translates technical and governance signals into one stable narrative for platform consumers.

## Scope lock

- Base runtime domain stays **EXTRIMLI**
- Technical signal engine stays **EXTREM** (`/api/extrimli/extrem`)
- Orchestration and governance layer stays **EXTRONDOL** (`/api/extrimli/extrondol`)
- Public-facing boundary stays **SPAJA KOD** (`/api/extrimli/spaja-kod`)
- Downstream linked repo remains **`spaja86/IO-OPENUI-AO`**

## Locked semantic sequence

| Order | Token | Stable meaning | Signal role | Governance use |
|---|---|---|---|---|
| 1 | `ODIT` | SPAJAPRO identity intro | identity/introduction | Locks the track as an EXTRIMLI extension |
| 2 | `DEKER` | Technical state | technical-state | Carries EXTREM readiness posture |
| 3 | `DUNOR` | Conflict/risk | conflict-risk | Carries DISKVIT conflict pressure |
| 4 | `SUMOR` | WAWE orchestration | orchestration | Marks current rollout stage |
| 5 | `OKET` | Freeze control | freeze | Activates promotion freeze on blockers |
| 6 | `DAKOR` | Promotion control | promotion | Marks next-step promotion readiness |
| 7 | `EKSER` | Audit gate | audit | Mirrors releaseAuditSummary readiness |
| 8 | `DOKER` | Downstream sync | downstream-sync | Keeps `spaja86/IO-OPENUI-AO` explicit |
| 9 | `DUKAR` | Human review | human-review | Requires review evidence before promotion |
| 10 | `DONAR` | Rollback control | rollback | Keeps rollback as a required gate |
| 11 | `KODER` | Final public-safe status | final-public-status | Exposed only through SPAJA KOD |

## Layer responsibilities

### EXTREM

EXTREM remains the technical signal engine for SPAJAPRO:

- readiness/watch/blocked posture
- DISKVIT conflict intensity
- independent freeze authority
- formula and resolution governance inputs

SPAJAPRO token mapping inside EXTREM is internal-only and exists to interpret those raw signals without changing the EXTREM surface purpose.

### EXTRONDOL

EXTRONDOL remains the orchestration layer for SPAJAPRO:

- maps EXTREM signals into WAWE 1–5 progression
- sets promotion freeze posture
- aligns audit, downstream sync, human review, and rollback gates
- keeps additive-only compatibility with the current EXTRONDOL contract

### SPAJA KOD

SPAJA KOD remains the only public boundary for SPAJAPRO output:

- internal token mappings remain hidden
- only the final `KODER` public-safe status is exposed
- external consumers receive readiness/governance posture, not internal mapping details

## Governance rules preserved

- WAWE 1–5 rollout remains canonical
- promotion freeze stays mandatory on blockers
- `releaseAuditSummary` remains required
- human review remains required
- rollback remains required
- downstream reference remains required

## Acceptance criteria

1. Token order is fixed as `ODIT → DEKER → DUNOR → SUMOR → OKET → DAKOR → EKSER → DOKER → DUKAR → DONAR → KODER`
2. Existing EXTRIMLI endpoints remain additive-only and non-breaking
3. EXTREM can still trigger freeze independently
4. EXTRONDOL still emits audit-ready rollout status
5. SPAJA KOD still hides internal mapping logic
6. Downstream reference to `spaja86/IO-OPENUI-AO` remains explicit

## Downstream impact

Linked consumers in `spaja86/IO-OPENUI-AO` should treat SPAJAPRO as a public governance/readiness posture obtained through SPAJA KOD and not as permission to consume internal EXTRIMLI token mappings directly.
