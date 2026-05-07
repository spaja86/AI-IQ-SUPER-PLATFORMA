# Hardening Waves Playbook
## Kompanija SPAJA — Digitalna Industrija

Ovaj dokument operativno zatvara plan po talasima i uvodi obavezne kontrole pre merge/deploy ciklusa.

---

## 1) Definition of Done po talasu

### Talas 1 — Security / Billing / Observability / Rollback
- [ ] Shared security headers helper aktivno korišćen na edge/proxy i API izlazima
- [ ] Billing mutacije imaju strogu validaciju ulaza
- [ ] Webhook signature + timestamp tolerance verifikacija aktivna
- [ ] Replay zaštita aktivna (event ID deduplikacija)
- [ ] Dead-letter queue + replay procedura dokumentovana
- [ ] Kill-switch scenariji testirani (read-only, checkout, plan-level)
- [ ] Incident rollback koraci verifikovani

### Talas 2 — API standardizacija / idempotency / retry / audit
- [ ] Idempotency key obavezan za sve kritične mutacije
- [ ] Retry policy ograničen na transient greške
- [ ] Structured logging (requestId/userId/route/duration)
- [ ] Audit trag aktivan za billing tranzicije
- [ ] Contract testovi verzionisani

### Talas 3 — AI engine
- [ ] Prompt registry sa verzijama i fallback pravilima
- [ ] Canary rollout strategija definisana
- [ ] Confidence/fallback pragovi i guardrails aktivni
- [ ] Cost/token pragovi i alarmi definisani

### Talas 4 — Gaming
- [ ] Replay guard i session TTL aktivni
- [ ] Anti-cheat heuristike i score anomaly provere aktivne
- [ ] Server-side validacija stanja/score toka
- [ ] Leaderboard integrity provere aktivne

### Talas 5 — CI kvalitet
- [ ] Build/test/typecheck/contract gates definisani
- [ ] A11y/perf budget gate definisan
- [ ] Flaky test quarantine lista održavana
- [ ] Required status checks usaglašeni

### Talas 6 — Analytics / BI
- [ ] Event naming i schema versioning standard aktivan
- [ ] Funnel/cohort/LTV metrike definisane
- [ ] Data quality provere i alerti aktivni

### Talas 7 — i18n / l10n
- [ ] Centralizovan fallback locale
- [ ] Missing-key lint/check aktivan
- [ ] Billing copy QA checklist pokriven

### Talas 8 — DX / platforma
- [ ] OpenAPI kao source of truth
- [ ] API deprecation policy (sunset) dokumentovana
- [ ] Preview env po PR-u pokriven

### Talas 9 — Enterprise / B2B
- [ ] SLA tier definicije i breach logika aktivne
- [ ] SSO pilot plan definisan
- [ ] Dunning flow i partner audit trag pokriven

### Talas 10 — Kontinuirano hardening
- [ ] Chaos/load/red-team scenariji periodično pokrenuti
- [ ] Feature-flag rollout matrica i abort kriterijumi aktivni
- [ ] Nedeljni incident review sa action item-ima

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

