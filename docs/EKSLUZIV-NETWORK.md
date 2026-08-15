# EKSLUZIV NETWORK — Domain-Scoped Deploy Governance Track

## Scope i ownership

- **Track type**: release-governance / domain-scoped rollout initiative
- **Owner area**: Platform Ops + Automation + Release Engineering + domain owners
- **OKRID**: `OKRID-2026-EKSLUZIV-001`
- **Primary governance docs**:
  - `docs/DEPLOY-PORTFOLIO.md`
  - `docs/MIRIKL.md`
  - `docs/MULTI-REPO-LINKS.md`
  - `docs/OKRID-REGISTRY.md`
- **Primary workflows**:
  - `.github/workflows/deploy-platforma.yml`
  - `.github/workflows/vercel-deploy.yml`
  - `.github/workflows/omega-auto-build.yml`
  - `.github/workflows/security-scanner.yml`
  - `.github/workflows/mirikl-validator.yml`

## Purpose

EKSLUZIV NETWORK vodi deploy/gating režim za “singlamuraciju matričnog jedinjenja” kao interni naziv za **domenski fokusirano objedinjavanje rollout-a i governance sloja**, umesto kao jedan globalni release prekidač. Svaki domen ima sopstveni rollout izlaz, rollback granicu, KPI pragove i audit trag, uz postojeći MIRIKL + Deploy Platforma + multi-repo model.

## Release model alignment

- **Primarni deploy source of truth** ostaje **Vercel Git integracija**.
- **GitHub Actions** ostaje governance, quality-gate i audit sloj.
- `.github/workflows/deploy-platforma.yml` je **glavni rollout workflow** za ovu inicijativu.
- `.github/workflows/vercel-deploy.yml` ostaje **ručni fallback** za oporavak ili kontrolisanu promociju.
- Human review je obavezan za config/deploy/cross-repo promene.

## Domain matrix

| Domen | Cilj | Owner | Runtime / surface | Status | Quality gate | Rollout izlaz | Rollback granica |
|---|---|---|---|---|---|---|---|
| Core platforma | Stabilan deploy glavnog `src/` runtime-a | Platform Ops | `src/`, `/api/health`, `/api/status` | Active | build, lint, test, smoke, predeploy, security | `status=healthy`, `readyState=READY`, error-rate u zelenom | Rollback na prethodni Vercel deployment ako health/status padne |
| Nova Generacija | Segmentisana aktivacija NG feature-seta | AI / Platform / Automation | `platforms/nova-generacija/`, `/api/nova-generacija` | Active | NG KPI + standardni release gate | eval p99 ≤ 50ms, build ≤ 3 min, fairness 100% | Isključiti rollout prsten / vratiti flag na prethodni procenat |
| Mekartor | Repo-local katalog i rollout gateway | Platform Ops | `platforms/mekartor/`, `/mekartor`, `/api/mekartor` | Active | deploy-platforma + standardni release gate | health endpoint green, rollout 10% → 50% → 100% | Zaustaviti rollout i vratiti prethodni deployment |
| Linked repo integracije | Kontrola downstream uticaja | Platform Ops + Automation | `platforms/io-openui-ao/`, `docs/MULTI-REPO-LINKS.md`, `.agent-config.json` | Follow-up required | multi-repo sync + label/reference hygiene | downstream follow-up otvoren, sync coverage 100% | Suspendovati cross-repo promociju dok reference/config ne budu usklađene |
| Monitoring i audit | Vidljivost KPI, health i deploy stanja | Release Engineering | `public/deploy_status.json`, workflow summaries, `/api/deploy-portfolio` | Active | audit evidencija + status snapshot | svi audit summary signali i KPI evidencija prisutni | Obeležiti track `at-risk` i blokirati promociju |
| Operativa i incident response | Kontrolisan sign-off i oporavak | Operations | `docs/GO-LIVE.md`, `docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md` | Active | rollout/rollback dokumentovan | final sign-off checklist zatvorena | Aktivirati rollback plan po domenu |

## Registry mapping

| Surface | Registry / doc source | Health endpoint | Deployment status |
|---|---|---|---|
| AI IQ SUPER PLATFORMA | `src/lib/deploy/deploy-registry.ts`, `docs/DEPLOY-PORTFOLIO.md` | `https://ai-iq-super-platforma.vercel.app/api/health` | `aktivan` |
| Nova Generacija | `src/lib/deploy/deploy-registry.ts`, `docs/ROADMAP.md` | `https://ai-iq-super-platforma.vercel.app/api/nova-generacija` | `aktivan` |
| Mekartor | `src/lib/deploy/deploy-registry.ts`, `docs/DEPLOY-PORTFOLIO.md` | `https://ai-iq-super-platforma.vercel.app/api/mekartor` | `aktivan` |
| IO OPENUI AO | `docs/MULTI-REPO-LINKS.md`, local mirror `platforms/io-openui-ao/` | `https://io-openui-ao.vercel.app/` | linked follow-up |
| Kompanija SPAJA / Poslovni Novčanik | `src/lib/deploy/deploy-registry.ts` | project-specific | `u_pripremi` |

## Release gate before activation

EKSLUZIV NETWORK ne prelazi u sledeći rollout prsten dok nisu green sledeće provere:

- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:smoke`
- `npm run predeploy:check`
- `npm audit --audit-level=high`
- secret scanning bez kritičnih nalaza

Obavezno:

- `agent:config-change` label kada se menjaju workflow/config surface-i
- audit-ready PR opis sa rollout, rollback, KPI impact i cross-repo impact sekcijama
- human review pre merge-a

## EKSLUZIV NETWORK segmentacija

### Rollout prstenovi

| Prsten | Namena | Aktivaciono pravilo |
|---|---|---|
| Canary | Ograničena aktivacija za domen sa najvećim rizikom | samo ako standardni gate-ovi prođu i health ostane zelen |
| Staging | Šira validacija domenskih pretpostavki | samo ako canary KPI ostanu stabilni |
| Production | Finalna aktivacija | samo ako su KPI, rollback dokazi i downstream reference zatvoreni |

### Domenski naglasak

- Core platforma ne blokira Nova Generacija rollout ako NG ima zasebno zadovoljene izlaze.
- Linked repo domen se promoviše nezavisno od repo-local domena.
- Monitoring/audit domen mora ostati green za svaki drugi domen.

## Multi-repo koordinacija

- Linked repo procena za `spaja86/IO-OPENUI-AO`: **Follow-up required** kada se menjaju shared contracts, label schema, milestones ili Nova Generacija fairness pretpostavke.
- Bidirekcione reference ostaju obavezne u `docs/MULTI-REPO-LINKS.md`.
- `multi-repo-sync-agent` mora potvrditi sync coverage = 100% pre finalne promocije cross-repo domena.
- `calculator-validator-agent` ostaje downstream fairness validator kada promene dodiruju gaming/calculator assumptions.

**Audit convention:**

```text
AI-IQ-SUPER-PLATFORMA#EKSLUZIV-NETWORK -> IO-OPENUI-AO#<follow-up issue>
```

## KPI i operativni pragovi

| KPI | Prag | Owner |
|---|---|---|
| Build duration | ≤ 3 min | CI / Platform Ops |
| API latency p95 | ≤ 300ms | Platform Ops |
| Error rate | < 1% | Release Ops |
| Core health score | `status=healthy` i `zdravlje >= 80` | Operations |
| Nova Generacija eval p99 | ≤ 50ms | AI Engine |
| Nova Generacija fairness | 100% | Gaming / Automation |
| Mekartor health SLA | ≥ 99.95% | Platform Ops |
| Cross-repo sync coverage | 100% | Multi-repo coordination |
| Security scan coverage | 100% | Security |
| Audit evidence coverage | 100% rollout + rollback + KPI summary | Release Engineering |

## Rollback po domenu

| Domen | Trigger za zaustavljanje | Fallback stanje | Post-incident audit |
|---|---|---|---|
| Core platforma | health/status regresija, povećan error rate | prethodni Vercel deployment | workflow summary + `docs/GO-LIVE.md` evidencija |
| Nova Generacija | KPI/fairness pad ili build prekoračenje | vratiti feature flag procenat / prethodni deployment | NG KPI audit + downstream fairness reference |
| Mekartor | endpoint unhealthy ili rollout regresija | revert na prethodni deployment | Deploy Platforma audit summary |
| Linked repo integracije | neusaglašeni labels/config/references | blokirati promociju i otvoriti follow-up | `docs/MULTI-REPO-LINKS.md` ažuriranje |
| Monitoring i audit | nedostaje KPI ili deploy evidencija | blokirati promotion gate | MIRIKL / workflow summary zapis |
| Operativa | nekompletan sign-off ili rollback dokaz | stop release | release checklist + human review komentar |

## Formalni sign-off

Pre finalne produkcione promocije mora biti zatvoreno:

- [ ] rollout plan po domenu
- [ ] rollback plan po domenu
- [ ] KPI impact dokumentovan
- [ ] cross-repo impact dokumentovan
- [ ] downstream reference otvoren ili eksplicitno označen kao N/A
- [ ] human approval evidentiran
- [ ] audit summary prisutan u workflow ili PR opisu

Tek tada EKSLUZIV NETWORK dobija status **ready for final activation**.
