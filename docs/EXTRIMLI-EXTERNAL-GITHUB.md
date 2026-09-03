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
| Export layer | `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/app/api/extrimli/instrukcija/**` | Snapshot i developer-facing export bundle |
| Quality gate | `.github/workflows/extrimli-validator.yml` | Standardni validator i KPI gate |
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
- **Required labels:** `extrimli`, `extrimli:logic-change`, `extrimli:external-github`, `agent:config-change`
- **Human review:** obavezan za workflow/config/cross-repo promene
- **Security boundary:** svi hook-ovi, tokeni i deploy kredencijali ostaju u GitHub/Vercel Secrets sloju
- **Runtime source of truth:** Vercel Git integracija
- **GitHub Actions role:** audit, governance i downstream coordination

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
| WAWE 1 — Pre-release validation | Pre-release quality lock | test/lint/KPI/security/label readiness |
| WAWE 2 — Build + Staging | Build i staging verifikacija na Vercel | build ≤ 3 min, staging smoke, governance evidence |
| WAWE 3 — Downstream sync | Cross-repo sync i reference usklađivanje | snapshot sync + `docs/MULTI-REPO-LINKS.md` audit references |
| WAWE 4 — Production rollout | Postepeni production rollout | 10% → 50% → 100% rings uz promotion guard |
| WAWE 5 — Resilience + Analytics | Post-release potvrda stabilnosti | resilience checks + analytics evidence + final audit |

---

## 7. Outbound artifacts to GitHub surface

EXTRIMLI GitHub sloj iznosi sledeće signale i snapshot-e:

- module health/status snapshot
- gear catalog snapshot
- DESTRUKCIJA asset snapshot
- instrukcija registry
- instrukcija export bundle
- KPI summary (eval, API, build, sync, audit coverage)

## 8. Downstream responsibilities

Za `spaja86/IO-OPENUI-AO` ostaju obavezni sledeći follow-up koraci:

1. preuzimanje EXTRIMLI snapshot-a preko `multi-repo-sync-agent`
2. evidencija `extrimli:external-github` label schema kompatibilnosti
3. praćenje `instrukcija` export bundle contract-a kod downstream potrošača
4. potvrda da su audit reference i workflow ownership usklađeni
5. obavezan follow-up issue kada downstream ostane delimično neusaglašen

## 9. Mandatory gate criteria

- KPI: evaluation ≤ 50ms, API ≤ 200ms, build ≤ 3 min
- Security boundary: bez sekreta u kodu, sve kroz GitHub/Vercel Secrets
- Human review obavezan pre promocije
- Label higijena: `extrimli:logic-change`, `extrimli:external-github`, `agent:config-change` (za config/workflow promene)
- Promotion freeze: release se zaustavlja kada KPI/audit/sync nije potpun

---

## 10. KPI

| KPI | Target |
|---|---|
| Risk / engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Build duration | ≤ 3 min |
| Downstream sync success | 100% |
| Audit evidence coverage | 100% |
| Human review before promotion | required |

## 11. Rollout / rollback

### Rollout

1. validator green
2. external GitHub governance workflow green
3. downstream references potvrđene u `docs/MULTI-REPO-LINKS.md`
4. human review evidentiran
5. deploy workflow promoviše staging pa production

### Rollback

1. zaustaviti promotion gate ako audit, sync ili label/reference higijena nije potpuna
2. vratiti prethodni known-good Vercel deployment ako deploy/health signal degradira
3. otvoriti downstream follow-up ako linked repo reference nisu usklađene
4. aktivirati incident escalation kada KPI targeti ostanu breached posle rollback-a

## 12. Done criteria

- Svi WAWE gate-ovi su prolazni i dokumentovani
- Audit summary sadrži rollout, rollback, KPI impact i downstream reference
- Cross-repo status potvrđen i spreman za human sign-off

---

## 13. Acceptance criteria

- Postoji kanonski dokument za EXTRIMLI external/GitHub surface
- EXTRIMLI validator pokriva export/instrukcija surface
- GitHub governance workflow postoji bez dupliranja deploy toka
- `docs/MULTI-REPO-LINKS.md` sadrži downstream i audit reference
- Digitalna Industrija surface prikazuje EXTRIMLI kao formalnu GitHub capability

## 14. Audit convention

```text
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-EXTERNAL-GITHUB -> IO-OPENUI-AO#<follow-up issue>
```
