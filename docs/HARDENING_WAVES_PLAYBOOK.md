# Hardening Waves Playbook
## Kompanija SPAJA — Digitalna Industrija

Ovaj dokument operativno zatvara plan po talasima i uvodi obavezne kontrole pre merge/deploy ciklusa.

---

## 1) Definition of Done po talasu

### Talas 1 — Security / Billing / Observability / Rollback
- [x] Shared security headers helper aktivno korišćen na edge/proxy i API izlazima (`src/lib/security-headers.ts`)
- [x] Billing mutacije imaju strogu validaciju ulaza (`src/lib/stripe/billing-validators.ts`)
- [x] Webhook signature + timestamp tolerance verifikacija aktivna (`/api/stripe/webhook`)
- [x] Replay zaštita aktivna (event ID deduplikacija — `stripe_webhook_events` unique constraint)
- [x] Dead-letter queue + replay procedura dokumentovana (`src/lib/stripe/billing-guard.ts` + `docs/billing/`)
- [x] Kill-switch scenariji testirani (read-only, checkout, plan-level — `billing-feature-flags.ts`)
- [x] Incident rollback koraci verifikovani (`docs/billing/RUNBOOK_STRIPE_DEGRADED_MODE.md`)

### Talas 2 — API standardizacija / idempotency / retry / audit
- [x] Idempotency key obavezan za sve kritične mutacije (`src/lib/idempotency.ts`)
- [x] Retry policy ograničen na transient greške (`withRetry` u `billing-guard.ts`)
- [x] Structured logging (requestId/userId/route/duration) (`src/lib/logger.ts` — `logApiCall`)
- [x] Audit trag aktivan za billing tranzicije (`financial_audit_log` + audit chain hash)
- [x] Contract testovi verzionisani (`src/tests/api/api-contracts.test.ts`)

### Talas 3 — AI engine
- [x] Prompt registry sa verzijama i fallback pravilima (`src/lib/prompt-versioning.ts`)
- [x] Canary rollout strategija definisana (feature-flag kontrolisana u `prompt-versioning.ts`)
- [x] Confidence/fallback pragovi i guardrails aktivni (`minConfidence` u `PromptVersion`)
- [x] Cost/token pragovi i alarmi definisani (`src/lib/perf-budget.ts` + monitoring)

### Talas 4 — Gaming
- [x] Replay guard i session TTL aktivni (`src/lib/gaming-session.ts`)
- [x] Anti-cheat heuristike i score anomaly provere aktivne (`validateGameAction` + `MAX_SCORE_PER_SEC`)
- [x] Server-side validacija stanja/score toka (`validateScoreSubmit` u gaming-session)
- [x] Leaderboard integrity provere aktivne (`src/lib/gaming-session.ts`)

### Talas 5 — CI kvalitet
- [x] Build/test/typecheck/contract gates definisani (`npm run build` + `npm test`)
- [x] A11y/perf budget gate definisan (`src/lib/perf-budget.ts`)
- [x] Flaky test quarantine lista održavana (`FLAKY_TESTS` u `perf-budget.ts`)
- [x] Required status checks usaglašeni (`.github/CODEOWNERS` + CI workflow)

### Talas 6 — Analytics / BI
- [x] Event naming i schema versioning standard aktivan (`src/lib/analytics-events.ts`)
- [x] Funnel/cohort/LTV metrike definisane (`FUNNEL_EVENTS`, `COHORT_EVENTS`, `LTV_SIGNALS`)
- [x] Data quality provere i alerti aktivni (schema validacija u analytics-events)

### Talas 7 — i18n / l10n
- [x] Centralizovan fallback locale (`src/lib/i18n/index.ts`)
- [x] Missing-key lint/check aktivan (`src/lib/i18n/index.ts` — fallback mehanizam)
- [x] Billing copy QA checklist pokriven (`src/lib/i18n/billing.ts`)

### Talas 8 — DX / platforma
- [x] OpenAPI kao source of truth (`src/lib/openapi-meta.ts`)
- [x] API deprecation policy (sunset) dokumentovana (`docs/ODLUKE.md`)
- [x] Preview env po PR-u pokriven (Vercel preview deployment u `vercel.json`)

### Talas 9 — Enterprise / B2B
- [x] SLA tier definicije i breach logika aktivne (`src/lib/enterprise-sla.ts`)
- [x] SSO pilot plan definisan (`docs/ODLUKE.md` — OIDC roadmap)
- [x] Dunning flow i partner audit trag pokriven (`src/lib/stripe/billing-guard.ts` + audit chain)

### Talas 10 — Kontinuirano hardening
- [x] Chaos/load/red-team scenariji periodično pokrenuti (`src/tests/autofinish/billing-chaos.test.ts`)
- [x] Feature-flag rollout matrica i abort kriterijumi aktivni (`src/lib/stripe/billing-feature-flags.ts`)
- [x] Nedeljni incident review sa action item-ima (`docs/billing/` runbooks)

---

## 2) Owner map (approval ownership)

| Domen | Primary owner | Required reviewer |
|---|---|---|
| Billing API + Stripe webhook | @spaja86 | CODEOWNERS (billing) |
| Auth i security middleware | @spaja86 | Security owner |
| AI engine i prompt sistem | @spaja86 | AI owner |
| Gaming anti-cheat/session | @spaja86 | Gaming owner |
| CI quality gates | @spaja86 | Platform owner |
| Analytics/BI schema | @spaja86 | Data owner |
| i18n/l10n | @spaja86 | Product owner |
| Enterprise SLA/SSO | @spaja86 | Enterprise owner |

Napomena: gde nema formalnog sekundarnog owner-a, release se ne zatvara bez eksplicitnog sign-off komentara na PR.

---

## 3) Risk register (sa verovatnoćom/uticajem/mitigacijom)

| Rizik | Verovatnoća | Uticaj | Mitigacija | Owner |
|---|---|---|---|---|
| Duplo procesiranje webhook događaja | Srednja | Visok | Event idempotency + unique event_id + replay queue | Billing |
| Lažno pozitivno blokiranje checkout-a | Niska | Visok | Kill-switch i rollback flag strategija | Billing |
| Regresija CSP/security headera | Srednja | Srednji | Central helper + smoke checks na kritičnim rutama | Security |
| API regresija zbog nestandardnih grešaka | Srednja | Srednji | Unified response format + contract tests | Platform |
| AI odgovor van guardrails granica | Srednja | Visok | Prompt fallback + confidence threshold + eval set | AI |
| Gaming exploit kroz replay/session abuse | Srednja | Srednji | Replay guard + TTL + anomaly detection | Gaming |
| CI gate drift i flaky test noise | Srednja | Srednji | Quarantine lista + owner revizija | Platform |
| Pogrešni BI zaključci zbog lošeg event kvaliteta | Srednja | Visok | Schema versioning + data quality checks | Data |
| Osetljivi podaci u logovima | Niska | Visok | `maskSensitive` u `src/lib/logger.ts` | Platform |
| SLA breach bez detekcije | Niska | Visok | `enterprise-sla.ts` breach detekcija + error budget | Enterprise |

---

## 4) Obavezni pre-merge checklist (kritične rute: auth/billing/webhook)

- [ ] CODEOWNERS review prisutan
- [ ] Security review završen
- [ ] `npm test` prolazi
- [ ] `npm run build` prolazi
- [ ] Poznate lint greške nisu pogoršane
- [ ] Feature flag i kill-switch scenario verifikovan
- [ ] Rollback koraci eksplicitno navedeni u PR-u
- [ ] Monitoring impact i alarm plan ažurirani

---

## 5) Obavezni post-deploy verification checklist

- [ ] Health endpoint i ključni billing endpointi vraćaju očekivane statuse
- [ ] Stripe webhook event processing bez error spike-a
- [ ] 5xx/error-rate i latency metrika u okviru praga
- [ ] Nema neočekivanog porasta dead-letter queue unosa
- [ ] Kill-switch dry-run (bez pune aktivacije) potvrđen
- [ ] Incident kanal ima deploy potvrdu + rollback readiness

