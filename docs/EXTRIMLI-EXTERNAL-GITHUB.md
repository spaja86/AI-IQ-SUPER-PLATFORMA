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
| EXTREM profiler domain | `src/lib/extrimli-extrem/**`, `src/app/api/extrimli/extrem/**` | DISKVIT browser-graphics bottleneck profiling and conflict-proportional optimization governance signal |
| NIVO DUET / DINKOS integration domain | `src/lib/extrimli-extrondol/**`, `src/lib/duet/**`, `src/app/api/duet/**` | DUET signal mapping (`status/overallScore/warnings`) into EXTRONDOL WAWE orchestration with DINKOS contract lock |
| Export layer | `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/app/api/extrimli/instrukcija/**` | Snapshot i developer-facing export bundle |
| Quality gate | `.github/workflows/extrimli-validator.yml` | Standardni validator i KPI gate |
| Governance conformance | `.github/workflows/extrimli-governance-conformance.yml` | Periodični drift + hard-gate conformance audit (weekly + manual) |
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
- **Required labels:** `extrimli`, `extrimli:logic-change`, `extrimli:external-github`, `duel-king`, `duel-king:logic-change`, `extrondend:logic-change`, `extrondol:logic-change`, `extrem:logic-change`, `nivo-duet:logic-change`, `dinkos:logic-change`, `agent:config-change`
- **Human review:** obavezan za workflow/config/cross-repo promene
- **Security boundary:** svi hook-ovi, tokeni i deploy kredencijali ostaju u GitHub/Vercel Secrets sloju
- **Runtime source of truth:** Vercel Git integracija
- **GitHub Actions role:** audit, governance i downstream coordination

### 4.1 ČOVEČANSTVU media publication lock

- `ČOVEČANSTVU` epilog package je additive EXTRIMLI / EXTREM / EXTRONDOL media track i nije novi runtime source-of-truth.
- Paket obuhvata samo:
  - master epilog text,
  - poster / carousel / hero-frame asset,
  - video storyboard + voiceover asset,
  - audit short summary,
  - governance checklist.
- Ownership split ostaje zaključan:
  - `EXTRIMLI` = domen priče i master paket,
  - `EXTREM` = tehnički signalni okvir (DOK/DIK/FOR),
  - `EXTRONDOL` = WAWE publication, audit, DAK/DUK governance,
  - `SPAJA KOD` = audit-safe public summary boundary.
- Public-safe boundary je obavezna:
  - dozvoljen je samo završni status, epilog i sažeta audit-safe poruka,
  - zabranjeno je objavljivanje sirovih EXTREM/EXTRONDOL formula, internih mapping-a ili privatnih governance detalja.
- Publish/promotion je dozvoljen samo kroz postojeći WAWE model i tek nakon eksplicitnog human-review checkpoint-a.

### 4.3 Seven-version operating envelope

- `Verzija 1–3` zatvaraju runtime/readiness osnovu
- `Verzija 4` zaključava EXTREM kao mandatory profiler gate
- `Verzija 5` zaključava EXTRONDOL kao primary WAWE orchestration surface
- `Verzija 6–7` završavaju multi-repo i enterprise operating model
- Shared roadmap contract ostaje `v1-7-roadmap` i mora ostati additive-only

### 4.4 Developer/Create repo-wide reflection lock

- `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` ostaje repo-wide reflection nad postojećim `VRH`, `RADNI TAKT`, `METRIČKO`, `SINEMETRIČKO` i `PARADIJOGONALNO` track-ovima.
- Centralni dokaz ostaje `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection`.
- `EXTREM` ostaje tehnički nosilac repo-wide rhythm/readiness signala, `EXTRONDOL` ostaje governance consumer za WAWE freeze/promotion/human-review/rollback odluke, a `SPAJA KOD` ostaje audit-safe public summary boundary.
- Dozvoljeni javni statusi ostaju `READY | WATCH | BLOCKED`; deterministički fallback ostaje obavezan za `NaN`, `Infinity`, prazne i konfliktne ulaze.
- PR execution lock ostaje obavezan: jedan PR mapira tačno jednu roadmap fazu i mora sadržati `roadmapStageId`, `measurableOutput`, `acceptanceEvidence`.
- Audit package lock ostaje obavezan: `rolloutPlan`, `rollbackPlan`, `kpiImpact`, `humanReviewStatus`, `downstreamReference`.

### 4.2 B2B operating model

- EXTRONDOL je canonical B2B orchestration surface za organization-level consumers.
- EXTRONDOL `PRETPLATA ZA NEOGRANIČENO PROGRAMIRANJE I ALATE` na GitHub-u je canonical B2B enterprise paket, sa controlled-periodic klasifikacijom.
- Scope zaključavanje: enterprise seat model, Copilot/AI prava, private repo pristup, governance layer i business-critical support SLA.
- Ownership model: `@spaja86` + `Kompanija SPAJA / Digitalna Industrija` ostaju contract/account owners.
- Operator model: WAWE orchestration, tenant onboarding, downstream sync, i operational approval ostaju odvojene odgovornosti.
- Partner model: `spaja86/IO-OPENUI-AO` je obavezni downstream B2B consumer kada koristi EXTRONDOL snapshot.
- Activation policy: nema B2B aktivacije bez contract approval, compliance review, downstream sync, i human review evidence.
- Commercial/legal model lock: `primarySegment=privreda`, `supportedSegments=[privreda, gradjanstvo]`, `contractStatus=required-before-activation`, `paymentCycle=monthly-or-annual`.
- Additive-only V7 enterprise operating model uvodi `DEVELOPER AND CREATE / VRH PROGRAMSKOG EKVILADENTA / AI PLATE` kao GitHub organization-level paket za AI agente, Copilote i prateću automatizaciju, bez novih source-of-truth ruta.
- Paket zaključava razdvojene scope stubove: `seats`, `Copilot/AI prava`, `private repo pristup`, `governance`, `support SLA`, `human review`, `compliance`.
- `12.000 EUR nedeljno` nije nova master pretplata već `premium-rollout-regime` / `pilot-first` odluka unutar postojećeg `paymentCycle=monthly-or-annual` enterprise ugovora.
- Promocija weekly enterprise ponude je blokirana bez `contract approval`, `compliance review`, `human review`, `payment verification`, `downstream sync prema spaja86/IO-OPENUI-AO`, `rollback plan` i `FinOps guardrails` za unlimited interpretaciju.
- Linked repo preuzima samo audit-safe snapshot: `aiPlateEnterprisePackageStatus`, release audit status, roadmapStageId=`Verzija 7` i acceptance evidence; nikada paralelni source-of-truth za komercijalne detalje.
- `b2bReadiness.compliance.humanReviewComplete` je obavezno polje u EXTRONDOL B2B readiness sloju i mora blokirati promociju dok evidence nije prisutan.
- `b2bReadiness.downstreamSync.status` ne sme biti inferred iz lokalnog health stanja; ostaje `FOLLOW_UP_REQUIRED` dok linked-repo sync evidence nije eksplicitno potvrđen.
- `b2bReadiness.compliance.onboardingComplete` mora doći iz onboarding evidence; DUET signal ostaje governance input za onboarding hold, escalation i partner warnings.
- Governance evidence može biti ubrizgan kroz EXTRONDOL report builder ili workflow environment (`EXTRONDOL_AUDIT_TRAIL_COMPLETE`, `EXTRONDOL_HUMAN_REVIEW_COMPLETE`, `EXTRONDOL_DOWNSTREAM_SYNC_COMPLETE`, `EXTRONDOL_ONBOARDING_COMPLETE`) da bi contract data ostao tačan.
- Audit policy: approvals, freeze reasons, rollback triggeri i downstream references moraju biti traceable u PR summary / workflow summary.
- "Neograničeno" guardrails: fair-use i abuse protection su obavezni; FinOps pragovi `50/75/90/100`; freeze/rollback ostaju aktivni kada KPI/audit/payment nisu kompletni.

### 4.5 Vercel poslovna ponuda — GitHub subscription bridge (additive-only)

- Scope lock ostaje: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA`.
- Kanonska poruka ka Vercel-u ostaje governance artefakt: pozdrav, predlog alternativne saradnje i prelazni model međusobne pretplate preko GitHub-a do fizičkog susreta.
- Ownership split ostaje zaključan:
  - `EXTREM (DOK/DIK/FOR)` = tehnička spremnost i konzistentnost,
  - `EXTRONDOL (DAK/DUK)` = governance, human review, rollout/freeze/rollback,
  - `SPAJA KOD` = audit-safe public summary.
- Aktivacija bridge režima je dozvoljena samo uz `contract approval`, `compliance review`, `human review`, `payment verification`, `downstream reference`.
- Deaktivacija bridge režima je obavezna kada je fizički susret potvrđen ili kada je aktiviran `freeze/rollback` posture.
- Komunikacioni format ostaje `READY | WATCH | BLOCKED` uz obavezne `blocker reason` i `review posture` signale.
- Cross-repo sync prema `spaja86/IO-OPENUI-AO` ostaje summary-only; sirovi EXTREM/EXTRONDOL detalji i interni komercijalni scoring ostaju repo-local.

## 5. Locked source-of-truth artifacts

| Surface | Locked artifact |
|---|---|
| Canonical docs | `docs/EXTRIMLI.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md`, `docs/MULTI-REPO-LINKS.md` |
| Governance workflow | `.github/workflows/extrimli-external-github.yml` |
| Governance conformance workflow | `.github/workflows/extrimli-governance-conformance.yml` |
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
- EXTREM DISKVIT profiler snapshot
- shared `versionRoadmap` + `roadmapAlignment` snapshot
- NIVO DUET / DINKOS signal snapshot
- EXTRONDOL B2B scope snapshot
- EXTRONDOL B2B readiness snapshot
- gear catalog snapshot
- DESTRUKCIJA asset snapshot
- instrukcija registry
- instrukcija export bundle
- KPI summary (eval, API, build, sync, audit coverage)
- `ČOVEČANSTVU` epilog package summary (master text, poster, storyboard, audit short, governance checklist) kada je track aktiviran kao release/publication artifact

## 8. EXTRIMLI ↔ MAKSIMUS alignment

- MAKSIMUS koristi `EXTRIMLI Extended` domen signal iz `/api/extrimli/extendol`.
- EXTRONDEND koristi `/api/extrimli/duel-king` + `/api/extrimli/extendol` + `/api/extrimli/koron` kao ulazne agregacione signale.
- EXTRONDOL koristi `/api/extrimli/extrondend` + `/api/extrimli/extendol` + `/api/extrimli/koron` + `/api/extrimli/extrem` za WAWE readiness orkestraciju.
- EXTRONDOL NIVO DUET sekcija koristi `/api/duet/evaluate` signal i mapira `valid`, `status`, `overallScore`, `warnings` u WAWE promotion guard logiku.
- Isti EXTRONDOL signal u B2B modu mapira onboarding hold, escalation i partner-readiness warning odluke bez menjanja WAWE modela.
- EXTREM profiler signal (`DISKVIT` bottleneck, `conflictIntensity`, `optimizationTier`) je obavezan governance input za promotion freeze kada je konflikt visok ili KPI breach potvrđen.
- EXTREM profiler takođe normalizuje `REZOLUCIJA`, `EKODOR`, `REKULITI PO RAULETU`, `DISCAN`, i `KIBEN` kao additive governance vocabulary; EXTRONDOL mora propagirati taj resolution posture u rollout reasons, audit summary i downstream sync.
- KORON surface `/api/extrimli/koron` mora ostati uključen u Extendol readiness i degraded evidenciju.
- DUEL KING surface `/api/extrimli/duel-king` mora ostati uključen u EXTRIMLI health story i downstream snapshot plan kada je first-class surface aktivan.
- Ako EXTRIMLI surface pređe KPI limit ili uđe u degraded mode, MAKSIMUS mora prijaviti preporuku za sanaciju.
- Governance evidencija mora sadržati oba gate-a: `extrimli-validator` i `maksimus-validator`.
- Kada `ČOVEČANSTVU` epilog package ide u objavu, governance evidencija mora dodatno potvrditi: narrative lock, human-review status, downstream reference, i rollback readiness za slikovni/video paket.

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
9. mirror `extrem:logic-change` label schema i povezati DISKVIT profiler signal sa EXTRONDOL snapshot potrošačima
10. mirror additive resolution vocabulary fields iz EXTREM profiler-a (`resolutionReadiness.rezolucijaScore`, `ekodorState`, `rekulitiPoRauletu`, `discanInKibenState`)
11. preuzimanje `b2bScope` + `b2bReadiness` polja iz `/api/extrimli/extrondol`
12. potvrda da su `rolloutRing`, `onboardingHold`, `rolloutFreeze`, `partnerReadinessWarnings`, `domainStrategy` i `resolutionReadiness` mapirani u downstream B2B governance
13. mirror `versionRoadmap.contractVersion`, `deliverySequence` i `roadmapAlignment.primaryVersion` za linked-repo audit trag

## 10. Mandatory gate criteria

- KPI: evaluation ≤ 50ms, API ≤ 200ms, build ≤ 3 min
- DUEL KING mora imati explicit versioned contract polja i source-of-truth endpoint (core + KUR/DUR/MOL in-game signals)
- EXTRONDEND i EXTRONDOL moraju imati explicit versioned contract polja i source-of-truth endpoint
- NIVO DUET / DINKOS mapiranje mora imati isti KPI i security gate kao EXTRONDOL i DUET validatori
- EXTRONDOL B2B polja moraju ostati additive-only i backward-compatible
- `releaseReadinessScorecard`, `canaryRingMetrics`, `incidentPlaybook`, `contractDriftReport`, `governanceConformance` moraju ostati additive-only i bez promene source-of-truth ruta
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
| Governance conformance cadence | weekly (`0 4 * * 1`) |
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
