# AI IQ PROGRAMSKI JEZIK — v1 (AI-native)

## 1) Cilj jezika

AI IQ Programski Jezik je AI-native DSL za:
- prompt definiciju,
- pravila i guardrail politiku,
- orkestraciju izvršavanja,
- automatsko odlučivanje uz obaveznu objašnjivost.

Model je "veštačka inteligencija" jer kombinuje deterministički sloj i AI sloj u jednom formalnom ugovoru, sa sigurnosnim fallback-om.

## 2) Formalna specifikacija v1

### Kanonski ugovor

| Polje | Vrednost |
|---|---|
| Display name | `AI IQ PROGRAMSKI JEZIK` |
| Slug | `ai-iq-programski-jezik` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `ai-iq-programski-jezik-core` |
| Routes | `/api/ai-iq-programski-jezik/evaluate`, `/api/ai-iq-programski-jezik/compile`, `/api/ai-iq-programski-jezik/health` |
| Feature flag | `ai-iq-programski-jezik-v1` |

### Sintaksa (v1)

Program je skup linija oblika:

`KEYWORD: value`

Podržani keyword-i:
- `INTENT`
- `RULE`
- `AI`
- `ORCHESTRATE`
- `OUTPUT`

### Semantika (v1)

- `INTENT` — poslovna namera i cilj AI toka.
- `RULE` — deterministički guardrail i policy ograničenja.
- `AI` — AI operacija (npr. proširenje prompta, sinteza).
- `ORCHESTRATE` — redosled i režim izvršavanja.
- `OUTPUT` — obavezna izlazna šema (status/score/warnings/action).

### EXTRIMLI-EXTRONDOL-EXTREM integration profile (additive)

- Profil ID: `EXTRIMLI-EXTRONDOL-EXTREM`
- Integracija je additive-only i ne menja postojeće AI IQ, EXTREM ili EXTRONDOL ugovore.
- Source-of-truth surface-ovi ostaju:
  - `/api/extrimli/extrem` (tehnički signal sloj)
  - `/api/extrimli/extrondol` (WAWE/governance sloj)

Signal mapiranje:
- `DOM` → EXTREM PETLJE DOM grupa (`DOMPRE`, `DOMBRE`, `DOMBRA`, `DOMBAR`, `DOMPOR`)
- `DIK` → EXTREM `DIK PETLJA`
- `DAK` → EXTRONDOL promocioni tok (`DAKOR`)
- `DUK` → EXTRONDOL human-review tok (`DUKAR`)

PROGRAMSKI JEZIK ANALIZA (ispitivanje eskalacije kodesnog zapleta):
- additive-only pod-profil unutar `EXTRIMLI-EXTRONDOL-EXTREM`
- objedinjuje `DOK + DIK` tehnički konflikt/readiness signal (EXTREM) sa `DAK + DUK` governance freeze/promotion/human-review signalom (EXTRONDOL)
- rezultat je audit-ready konsolidovani status (`READY | WATCH | BLOCKED`) sa `escalationScore`, `deterministicFallbackRequired`, `promotionFreeze`, `humanReviewRequired`, `rollbackPlanRequired`

PROGRAMSKI JEZIK PROUČAVANJA (analitika laboratorijskih slučajeva):
- additive-only profil unutar postojećeg `AI IQ PROGRAMSKI JEZIK` + `EXTRIMLI-EXTRONDOL-EXTREM` modela (bez novih source-of-truth ruta)
- formalizuje laboratorijski ulazni profil slučaja, determinističke metrike i konsolidovani status (`READY | WATCH | BLOCKED`)
- ownership split ostaje zaključan: `DOK + DIK` tehnički sloj u EXTREM, `DAK + DUK` governance sloj u EXTRONDOL
- koristi `PROGRAMSKI EKANALOG (razumevanje logike)` kao audit-ready interpretacioni sloj nad laboratorijskim rezultatima

### Tipovi podataka

- `mode/targetMode`: `DETERMINISTIC_ONLY | HYBRID | AI_NATIVE`
- score polja: konačni brojevi u granici `0..100`
- `fallbackConfigured`, `strictSecurity`, `featureFlagAiIqLanguage`: `boolean`

### AI-operacije

- prompt expansion
- contextual orchestration hints
- adaptive next-step synthesis
- human-readable rationale

### Ograničenja i sigurnosna pravila

- Zabranjeni su nevalidni ulazi (`NaN`, `Infinity`, negativni/out-of-range score).
- `strictSecurity=true` zahteva `RULE` sa `NO_SECRET` i `ALLOWLIST`.
- Bez aktivnog feature flag-a AI sloj se ne aktivira (deterministički fallback).

## 3) Izvršni model

### Deterministički engine

- schema + type validacija
- scoring i status mapiranje
- security/range guard-ovi
- preporučena akcija i warnings

### AI sloj

- AI-native orkestracija se aktivira samo kada su security + readiness + feature flag zadovoljeni.

### Fallback pravilo

Ako AI sloj nije spreman/blokiran, izvršava se `DETERMINISTIC_ONLY` putanja.

### Objašnjivost

Svaki rezultat mora da vrati: score, status, warnings, recommendedAction i disclaimer.
Svaki rezultat sada additive vraća i `integrationProfile` sa objedinjenim statusom za `DOM/DIK/DAK/DUK` i `overall` signal.

## 4) API-first površina

- `POST /api/ai-iq-programski-jezik/evaluate`
- `POST /api/ai-iq-programski-jezik/compile`
- `GET /api/ai-iq-programski-jezik/health`

Standardizovan output uključuje status, score i upozorenja.

## 5) Governance i quality gate

Obavezni gate-ovi pre aktivacije:
1. lint
2. unit + API tests
3. smoke
4. security scanning
5. human review
6. audit log

Release kriterijumi su blokirani ako security nije zelen ili fallback nije potvrđen.

Governance veza prema EXTRONDOL release modelu u `integrationProfile.governanceLink` obavezno uključuje:
- rollout snapshot (`currentStage`, `eligibleNextStage`)
- `promotionFreeze`
- `humanReviewRequired`
- `rollbackPlanRequired`
- downstream reference ka `spaja86/IO-OPENUI-AO`
- rollout stage vrednosti su `WAVE-1` do `WAVE-5` kao AI IQ alias preko EXTRONDOL WAWE progresije
- kada je objedinjeni DOK/DIK/DAK/DUK eskalacioni status `BLOCKED`, AI IQ izvršenje ostaje u determinističkom fallback režimu

## 6) Validator agent

Validator workflow:
- `.github/workflows/ai-iq-programski-jezik-validator.yml`

Kontrole:
- edge cases (`NaN`, `Infinity`, invalid shape)
- performanse (`evaluacija <= 50ms`, `API <= 200ms`)
- security pravila (`NO_SECRET`, `ALLOWLIST` pod strict režimom)

## 7) Paket dokumentacija i primer

Primer programa:

```txt
INTENT: AI-native orchestration
RULE: NO_SECRET output
RULE: ALLOWLIST tool=internal
AI: expand prompt graph
ORCHESTRATE: staged rollout
OUTPUT: status score warnings action
```

## 8) Fazni rollout

1. Interno testiranje (`DETERMINISTIC_ONLY`)
2. Parcijalna aktivacija (`HYBRID` + feature flag)
3. Puna aktivacija (`AI_NATIVE`) samo uz zelene KPI + security

## 8.1 Acceptance kriterijumi integration profila

- Deterministički output za iste ulaze (uključujući objedinjeni `DOM/DIK/DAK/DUK` status)
- Validacija edge-case scenarija (`NaN`, `Infinity`, prazni/nevalidni tokeni)
- Očuvanje postojećih API ugovora bez breaking promena (additive-only proširenje)

## 9) Multi-repo sinhronizacija

v1 je spreman za downstream sinhronizaciju prema `spaja86/IO-OPENUI-AO` kroz:
- usaglašene label-e,
- status/audit reference,
- ugovorene API surface reference.

## 10) Exit kriterijumi v1

- Stabilni i deterministički rezultati
- Merljiv kvalitet (`status/score/warnings`) kroz testove
- Security usklađenost
- Potvrđen human review pre promocije

## PROGRAMSKI JEZIK INFORMACIONIH TOKOVA

- `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` je additive-only interpretacioni/orkestracioni DSL profil u okviru `EXTRIMLI-EXTRONDOL-EXTREM` modela.
- Ne uvodi novi runtime niti nove breaking rute; koristi postojeći explainability, guardrail i deterministic fallback model iz AI IQ PROGRAMSKI JEZIK sloja.
- `FOR PETLJA` i `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` mapiraju se kao sekvencijalni numerički ulaz, dok `DOK + DIK` ostaju EXTREM tehnički dokaz, a `DAK + DUK` ostaju EXTRONDOL governance odluka.
- Dozvoljene status klase su `READY | WATCH | BLOCKED`.
- Degradacioni i fallback uslovi ostaju aktivni za `NaN`, `Infinity`, prazne sekvence, nevalidne opsege i svaki signal koji traži deterministic fallback.
