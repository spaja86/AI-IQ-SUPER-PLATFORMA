# EXTRIMLI — AI KLASTER TELEVIZIJA PRETPLATA (Legacy / Deprecated)

**Status:** deprecated-standalone-surface  
**Replacement surfaces:** `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md`  
**Migration mode:** additive-only, no breaking routes, no parallel source-of-truth

## 1) Legacy purpose

Ovaj dokument zadržava legacy pravila za `TELEVIZIJA` provider/distribution paket kao audit referencu tokom migracije.

## 2) Locked legacy rules (provider/distribution)

- Provider/distribution paket ostaje governance-only i ne uvodi nove runtime rute.
- `EXTREM (DOK/DIK/FOR)` ostaje tehnički signal readiness-a i konzistentnosti.
- `EXTRONDOL (DAK/DUK)` ostaje governance sloj (review, freeze/promotion, rollout/rollback).
- `SPAJA KOD` ostaje audit-safe summary-only boundary za javni izlaz.
- Komunikacioni format ostaje `READY | WATCH | BLOCKED` uz `blocker reason` i `review posture`.
- Cross-repo sync prema `spaja86/IO-OPENUI-AO` ostaje summary-only.
- Sirovi provider/distribution komercijalni detalji, interni scoring i payment internals ostaju repo-local.

## 3) WAWE + B2B gate obaveze

- Aktivacija je dozvoljena samo uz: `contract-approval`, `compliance-review`, `human-review`, `payment-verification`, `downstream-reference`.
- WAWE 1–5 redosled je obavezan (`wawe-1-pre-release-validation`, `wawe-2-build-and-staging`, `wawe-3-downstream-sync`, `wawe-4-progressive-rollout`, `wawe-5-resilience-and-final-audit`).

## 4) Migration reference

- Ovaj dokument je zadržan kao deprecated pointer dok se legacy reference ne ugase.
- Nova canonical poslovna traka je: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA`.
