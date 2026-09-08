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
