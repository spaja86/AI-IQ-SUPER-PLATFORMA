# EXTRIMLI — External GitHub Surface

**Status:** `ready-for-governance-implementation`  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**Primary persona:** `extrimli-core` (octave: 7, hipermreza node: 56)  
**Downstream repo:** `spaja86/IO-OPENUI-AO`

---

## 1. Purpose

Ovaj dokument definiše kanonsku **EXTRIMLI external/GitHub površinu** za Digitalna Industrija ekosistem.

Cilj je da EXTRIMLI ostane podeljen na dva jasno odvojena sloja:

- **sportsko / risk jezgro** — registri, risk engine, gear catalog, event lifecycle, weather i readiness
- **GitHub operativni sloj** — workflow orchestration, audit summary, label schema, release governance i downstream sync

---

## 2. Scope

| Surface | Path / artifact | Role |
|---|---|---|
| Core domain | `src/lib/extrimli/**`, `src/lib/extrimli-3/**`, `src/app/api/extrimli/**`, `src/app/api/extrimli-3/**` | Risk, gear, destruction, weather i readiness logika |
| DUEL KING domain | `src/lib/extrimli-duel-king/**`, `src/app/api/extrimli/duel-king/**` | Competitive-combat duel risk, readiness, gear clearance i tournament posture |
| Community domain | `src/lib/extrimli-cuz/**`, `src/app/api/extrimli-cuz/**` | Crew, mentorship, feed i reputation signali za Extendol/KORON |
| Unified Extendol domain | `src/lib/extrimli-extendol/**`, `src/app/api/extrimli/extendol/**` | Unified "maximum functionality for all" contract and aggregate readiness surface |
| KORON overlay domain | `src/lib/extrimli-koron/**`, `src/app/api/extrimli/koron/**` | Cross-surface readiness overlay, sync coverage i degraded posture |
| EXTRONDEND aggregation domain | `src/lib/extrimli-extrondend/**`, `src/app/api/extrimli/extrondend/**` | Dedicated aggregation and scoring contract (not alias) |
| EXTRONDOL orchestration domain | `src/lib/extrimli-extrondol/**`, `src/app/api/extrimli/extrondol/**` | Dedicated WAWE orchestration/readiness contract (not alias) |
| NIVO DUET / DINKOS integration domain | `src/lib/extrimli-extrondol/**`, `src/lib/duet/**`, `src/app/api/duet/**` | DUET signal mapping (`status/overallScore/warnings`) into EXTRONDOL WAWE orchestration with DINKOS contract lock |
| Export layer | `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/app/api/extrimli/instrukcija/**` | Snapshot i developer-facing export bundle |
| Quality gate | `.github/workflows/extrimli-validator.yml` | Standardni validator i KPI gate |
| MAKSIMUS integration gate | `.github/workflows/maksimus-validator.yml` | Verifikuje EXTRIMLI signal ingest i orchestration alignment |
| GitHub governance | `.github/workflows/extrimli-external-github.yml` | Audit, downstream reference i external surface provera |
| Deploy governance | `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml` | Build, rollout, rollback i production sign-off |
| Documentation | `docs/EXTRIMLI.md`, `docs/MULTI-REPO-LINKS.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md` | Source of truth za scope, downstream impact i acceptance |

---

## 3. EXTRIMLI EXTEMEL/EXTREMOL WAWE cilj

- Kontrolisan **WAWE rollout** od Vercel deploy toka ka Digitalna Industrija operativnom sloju.
- Jasna podela odgovornosti: **Vercel = runtime deploy source of truth**, **GitHub Actions = governance/audit/sync layer**.
- Obavezan audit trag i cross-repo veza ka `spaja86/IO-OPENUI-AO`.

---

## 4. GitHub operating model

- **Primary quality gate:** `extrimli-validator-agent`
- **Required labels:** `extrimli`, `extrimli:logic-change`, `extrimli:external-github`, `duel-king`, `duel-king:logic-change`, `extrondend:logic-change`, `extrondol:logic-change`, `nivo-duet:logic-change`, `dinkos:logic-change`, `agent:config-change`
- **Human review:** obavezan za workflow/config/cross-repo promene
- **Security boundary:** svi hook-ovi, tokeni i deploy kredencijali ostaju u GitHub/Vercel Secrets sloju
- **Runtime source of truth:** Vercel Git integracija
- **GitHub Actions role:** audit, governance i downstream coordination

### 4.1 B2B operating model

- EXTRONDOL je canonical B2B orchestration surface za organization-level consumers.
- Ownership model: `@spaja86` + `Kompanija SPAJA / Digitalna Industrija` ostaju contract/account owners.
- Operator model: WAWE orchestration, tenant onboarding, downstream sync, i operational approval ostaju odvojene odgovornosti.
- Partner model: `spaja86/IO-OPENUI-AO` je obavezni downstream B2B consumer kada koristi EXTRONDOL snapshot.
- Activation policy: nema B2B aktivacije bez contract approval, compliance review, downstream sync, i human review evidence.
- Audit policy: approvals, freeze reasons, rollback triggeri i downstream references moraju biti traceable u PR summary / workflow summary.

## 5. Locked source-of-truth artifacts

| Surface | Locked artifact |
|---|---|
| Canonical docs | `docs/EXTRIMLI.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md`, `docs/MULTI-REPO-LINKS.md` |
| Governance workflow | `.github/workflows/extrimli-external-github.yml` |
| Deploy workflows | `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml` |
| Quality gate | `.github/workflows/extrimli-validator.yml` |

---

## 6. WAWE phases (Vercel → Digitalna Industrija)

| WAWE | Purpose | Mandatory gates |
|---|---|---|
| WAWE 1 — Pre-release validation | Pre-release quality lock | test/lint/KPI/security/label readiness + B2B contract/compliance lock |
| WAWE 2 — Build + Staging | Build i staging verifikacija na Vercel | build ≤ 3 min, staging smoke, governance evidence, onboarding evidence |
| WAWE 3 — Downstream sync | Cross-repo sync i reference usklađivanje | snapshot sync + `docs/MULTI-REPO-LINKS.md` audit references + B2B consumer alignment |
| WAWE 4 — Production rollout | Postepeni production rollout | 10% → 50% → 100% rings uz promotion guard i operational approval |
| WAWE 5 — Resilience + Analytics | Post-release potvrda stabilnosti | resilience checks + analytics evidence + final audit + B2B support readiness |

---

## 7. Outbound artifacts to GitHub surface

EXTRIMLI GitHub sloj iznosi sledeće signale i snapshot-e:

- module health/status snapshot
- DUEL KING readiness/tournament snapshot
  - includes `telemetryStatus` plus `kurTelemetryStatus`, `durTelemetryStatus`, `molTelemetryStatus` to distinguish baseline/live/degraded in-game signal posture
- extendol unified health/readiness snapshot
- KORON overlay health/readiness snapshot
- EXTRONDEND aggregation snapshot
- EXTRONDOL orchestration snapshot
- NIVO DUET / DINKOS signal snapshot
- EXTRONDOL B2B scope snapshot
- EXTRONDOL B2B readiness snapshot
- gear catalog snapshot
- DESTRUKCIJA asset snapshot
- instrukcija registry
- instrukcija export bundle
- KPI summary (eval, API, build, sync, audit coverage)

## 8. EXTRIMLI ↔ MAKSIMUS alignment

- MAKSIMUS koristi `EXTRIMLI Extended` domen signal iz `/api/extrimli/extendol`.
- EXTRONDEND koristi `/api/extrimli/duel-king` + `/api/extrimli/extendol` + `/api/extrimli/koron` kao ulazne agregacione signale.
- EXTRONDOL koristi `/api/extrimli/extrondend` + `/api/extrimli/extendol` + `/api/extrimli/koron` za WAWE readiness orkestraciju.
- EXTRONDOL NIVO DUET sekcija koristi `/api/duet/evaluate` signal i mapira `valid`, `status`, `overallScore`, `warnings` u WAWE promotion guard logiku.
- Isti EXTRONDOL signal u B2B modu mapira onboarding hold, escalation i partner-readiness warning odluke bez menjanja WAWE modela.
- KORON surface `/api/extrimli/koron` mora ostati uključen u Extendol readiness i degraded evidenciju.
- DUEL KING surface `/api/extrimli/duel-king` mora ostati uključen u EXTRIMLI health story i downstream snapshot plan kada je first-class surface aktivan.
- Ako EXTRIMLI surface pređe KPI limit ili uđe u degraded mode, MAKSIMUS mora prijaviti preporuku za sanaciju.
- Governance evidencija mora sadržati oba gate-a: `extrimli-validator` i `maksimus-validator`.

## 8.1 Naming lock

- EXTRONDEND i EXTRONDOL su novi dedicated moduli i **nisu** alias-i Extendol/KORON surface-a.
- EXTRONDOL naming lock je eksplicitan: koristiti isključivo `EXTRONDOL` (ne `EXTRANDOL`).
- Source-of-truth endpointi: `/api/extrimli/extrondend` i `/api/extrimli/extrondol`.
- Ownership: `@spaja86`; trigger labels: `extrondend:logic-change`, `extrondol:logic-change`, `nivo-duet:logic-change`, `dinkos:logic-change`.

## 8.2 Domain strategy lock (SPAJA)

- Requested pattern `spaja.nivo*spaja` je nevalidan (wildcard ne može biti u sredini label-e).
- Canonical apex domain: `spaja.nivo-spaja`
- Canonical wildcard domain: `*.spaja.nivo-spaja`
- EXTRONDOL/DUET/DINKOS rollout ne sme preći WAWE gate kada ova strategija nije validirana.

## 9. Downstream responsibilities

Za `spaja86/IO-OPENUI-AO` ostaju obavezni sledeći follow-up koraci:

1. preuzimanje EXTRIMLI snapshot-a preko `multi-repo-sync-agent`
2. evidencija `extrimli:external-github` label schema kompatibilnosti
3. praćenje `instrukcija` export bundle contract-a kod downstream potrošača
4. preuzimanje `/api/extrimli/koron` snapshot-a i provera polja `status`, `readinessScore`, `degradedSources`
5. preuzimanje `/api/extrimli/duel-king` snapshot-a i provera polja `duelMode`, `readinessScore`, `gearCleared`, `tournamentState`
   - plus signal contract fields: `kurContractVersion`, `durContractVersion`, `molContractVersion`
   - plus signal posture fields: `lastKurSignalStatus`, `lastDurSignalStatus`, `lastMolSignalStatus`
6. potvrda da su audit reference i workflow ownership usklađeni
7. obavezan follow-up issue kada downstream ostane delimično neusaglašen
8. mirror `nivo-duet:logic-change` i `dinkos:logic-change` label schema i povezati DUET signal mapiranje sa EXTRONDOL snapshot potrošačima
9. preuzimanje `b2bScope` + `b2bReadiness` polja iz `/api/extrimli/extrondol`
10. potvrda da su `rolloutRing`, `onboardingHold`, `rolloutFreeze`, `partnerReadinessWarnings` i `domainStrategy` mapirani u downstream B2B governance

## 10. Mandatory gate criteria

- KPI: evaluation ≤ 50ms, API ≤ 200ms, build ≤ 3 min
- DUEL KING mora imati explicit versioned contract polja i source-of-truth endpoint (core + KUR/DUR/MOL in-game signals)
- EXTRONDEND i EXTRONDOL moraju imati explicit versioned contract polja i source-of-truth endpoint
- NIVO DUET / DINKOS mapiranje mora imati isti KPI i security gate kao EXTRONDOL i DUET validatori
- EXTRONDOL B2B polja moraju ostati additive-only i backward-compatible
- B2B audit completeness: contract/onboarding/downstream-sync/operational approval status mora biti prisutan pre promocije
- Security boundary: bez sekreta u kodu, sve kroz GitHub/Vercel Secrets
- Human review obavezan pre promocije
- Label higijena: `extrimli:logic-change`, `extrimli:external-github`, `extrondend:logic-change`, `extrondol:logic-change`, `agent:config-change` (za config/workflow promene)
- Promotion freeze: release se zaustavlja kada KPI/audit/sync nije potpun
- KORON overlay mora ostati uključen u outbound artifacts i downstream sync checklist

---

## 11. KPI

| KPI | Target |
|---|---|
| Risk / engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Build duration | ≤ 3 min |
| Downstream sync success | 100% |
| Audit evidence coverage | 100% |
| Human review before promotion | required |

## 12. Rollout / rollback

### Rollout

1. validator green
2. external GitHub governance workflow green
3. downstream references potvrđene u `docs/MULTI-REPO-LINKS.md`
4. human review evidentiran
5. deploy workflow promoviše staging pa production
6. B2B contract, onboarding, downstream sync i operational approval su evidentirani

### Rollback

1. zaustaviti promotion gate ako audit, sync ili label/reference higijena nije potpuna
2. vratiti prethodni known-good Vercel deployment ako deploy/health signal degradira
3. otvoriti downstream follow-up ako linked repo reference nisu usklađene
4. aktivirati incident escalation kada KPI targeti ostanu breached posle rollback-a
5. zadržati B2B activation freeze kada contract/compliance/downstream evidence nije kompletan

## 13. Done criteria

- Svi WAWE gate-ovi su prolazni i dokumentovani
- Audit summary sadrži rollout, rollback, KPI impact i downstream reference
- Cross-repo status potvrđen i spreman za human sign-off

---

## 14. Acceptance criteria

- Postoji kanonski dokument za EXTRIMLI external/GitHub surface
- EXTRIMLI validator pokriva export/instrukcija/extendol surface
- EXTRIMLI validator pokriva DUEL KING surface
- EXTRIMLI validator pokriva i KORON overlay surface
- EXTRIMLI / EXTRONDOL / DUET validatori pokrivaju B2B additive contract fields i audit completeness
- GitHub governance workflow postoji bez dupliranja deploy toka
- MAKSIMUS validator potvrđuje ingest EXTRIMLI Extendol signala
- `docs/MULTI-REPO-LINKS.md` sadrži downstream i audit reference
- Digitalna Industrija surface prikazuje EXTRIMLI kao formalnu GitHub capability

## 15. Audit convention

```text
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTERNAL-GITHUB -> IO-OPENUI-AO#<follow-up issue>
```
