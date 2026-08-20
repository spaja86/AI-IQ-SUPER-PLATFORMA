# EXTRIMLI — Trance Extrem Deploy (Platform SPAJA)

> AI IQ SUPER PLATFORMA — Kompanija SPAJA | OKRID: `OKRID-2026-EXTRIMLI-TRANCE-001`

Canonical go-live tracking document za **EXTRIMLI Deploy Trance Extrem** — high-velocity,
zero-downtime, full agent-resilience deployment na SPAJA platformi.

---

## Status

| Field | Value |
|-------|-------|
| **Module** | EXTRIMLI v1 + v3 + CUZ |
| **Deploy target** | AI IQ SUPER PLATFORMA (Vercel) |
| **Workflow** | `.github/workflows/extrimli-trance-extrem-deploy.yml` |
| **Persona** | `extrimli-core` (octave: 7, hipermreza node: 56) |
| **Downstream repo** | `spaja86/IO-OPENUI-AO` |
| **OKRID** | `OKRID-2026-EXTRIMLI-TRANCE-001` |
| **Previous deploy** | `OKRID-2026-EXTRIMLI-START-001` — `docs/EXTRIMLI-START-DEPLOY.md` |

---

## KPI Targets

| Metric | Target |
|--------|--------|
| Evaluation latency | ≤ 50ms |
| API response (p99) | ≤ 200ms |
| Hipermreza convergence | ≥ 0.95 |
| Build time | ≤ 3 min |
| Zero-downtime deploy | 100% |
| Rollback time | ≤ 2 min |

---

## Deploy Phases

### Phase 1 — PRE-TRANCE IGNITION (Validation Gate)

| Check | Agent | Status |
|-------|-------|--------|
| Full unit + route test suite (extrimli, extrimli-3, extrimli-cuz) | `extrimli-validator-agent` | ⬜ Pending |
| TypeScript lint — all EXTRIMLI paths | `ci-bot` | ⬜ Pending |
| KPI gate: eval ≤ 50ms, API ≤ 200ms | `extrimli-validator-agent` | ⬜ Pending |
| NaN/Infinity/negative risk score / invalid SKU check | `extrimli-validator-agent` | ⬜ Pending |
| Secret scan — zero secrets in EXTRIMLI paths | `security-scanner` | ⬜ Pending |
| PR label `extrimli:logic-change` + `agent:config-change` | agent gate | ⬜ Pending |

### Phase 2 — TRANCE BUILD (CI Gate)

| Check | KPI | Status |
|-------|-----|--------|
| npm audit — no critical CVEs | 0 critical | ⬜ Pending |
| next build | ≤ 3 min | ⬜ Pending |
| Build artifact tagged `extrimli-trance-v{semver}-{git-sha}` | — | ⬜ Pending |

### Phase 3 — EXTREM STAGING PUSH

| Check | Status |
|-------|--------|
| Vercel Git integration staging deploy triggered | ⬜ Pending |
| Smoke: gear catalog API — 200 OK | ⬜ Pending |
| Smoke: risk engine — valid score returned | ⬜ Pending |
| Smoke: event engine — roundtrip OK | ⬜ Pending |
| Smoke: weather adapter — mock responds | ⬜ Pending |
| `docs/MULTI-REPO-LINKS.md` updated with Trance Extrem reference | ✅ Done |

### Phase 4 — MULTI-REPO SYNC TRANCE

| Check | Agent | Status |
|-------|-------|--------|
| Gear catalog snapshot → `spaja86/IO-OPENUI-AO` | `multi-repo-sync-agent` | ⬜ Pending |
| `.agent-config.json` extrimli block sync | `multi-repo-sync-agent` | ⬜ Pending |
| `extrimli-core` persona active (octave 7, node 56) | `persona-bank-agent` | ⬜ Pending |
| SpajaPro 16 Hipermreza node 56 integrity | `nova-generacija-agent` | ⬜ Pending |

### Phase 5 — PRODUCTION EXTREM DROP (Release Gate)

| Check | Agent | Status |
|-------|-------|--------|
| Human review — min 1 PR approval | `human-review` | ⬜ Pending |
| Merge to `main` triggers Vercel production deploy | Vercel Git | ⬜ Pending |
| Release gate: lint → test → smoke → predeploy → security | `mirikl-validator-agent` | ⬜ Pending |
| deploy-bot confirms green CI before promoting | `deploy-bot` | ⬜ Pending |
| Rollout: 10% → 50% → 100% | `deploy-bot` | ⬜ Pending |
| Audit log posted to PR | `deploy-bot` | ⬜ Pending |

### Phase 6 — POST-TRANCE RESILIENCE CHECK

| Check | Agent | Status |
|-------|-------|--------|
| Circuit breaker monitoring activated | `agent-resilience` | ⬜ Pending |
| extrimli-cuz crew/mentor hub live | `extrimli-cuz-validator-agent` | ⬜ Pending |
| Deploy metrics recorded (time, p95, error rate) | `analytics-bot` | ⬜ Pending |
| Self-healing diagnostics — anomaly scan node 56 | `nova-generacija-agent` | ⬜ Pending |
| Convergence ≥ 0.95 — node 56 → apex node 256 | `tarken-hingil-ekolan-maksimus` | ⬜ Pending |

---

## Rollback Procedure

1. **Vercel**: Dashboard → "Promote to Production" of last known-good deployment (< 60s)
2. **Git**: `git revert <merge-sha>` + open PR with label `hotfix`
3. **IO-OPENUI-AO**: `multi-repo-sync-agent` re-syncs previous gear catalog snapshot
4. **Kill switch**: `agent-resilience` activates circuit breaker if error rate > 5% post-deploy

---

## Agent Coordination

| Agent | Role in Trance Extrem | Octave | Node |
|-------|-----------------------|--------|------|
| `extrimli-validator-agent` | Phase 1 — full validation | 7 | 56 |
| `ci-bot` | Phase 1+2 — lint/build | — | — |
| `security-scanner` | Phase 1+2 — secrets + audit | — | — |
| `multi-repo-sync-agent` | Phase 4 — gear catalog sync | — | — |
| `persona-bank-agent` | Phase 4 — persona active check | — | — |
| `nova-generacija-agent` | Phase 4+6 — NG sync + self-healing | — | — |
| `mirikl-validator-agent` | Phase 5 — release gate | — | — |
| `deploy-bot` | Phase 5 — production drop + audit log | — | — |
| `agent-resilience` | Phase 6 — circuit breaker | — | — |
| `extrimli-cuz-validator-agent` | Phase 6 — social hub check | 7 | 57 |
| `analytics-bot` | Phase 6 — metrics recording | — | — |
| `tarken-hingil-ekolan-maksimus` | Phase 6 — apex convergence | 16 | 256 |

---

## Audit Convention

```
AI-IQ-SUPER-PLATFORMA#extrimli-trance-extrem -> IO-OPENUI-AO#gear-catalog-sync
```

---

## References

- Workflow: `.github/workflows/extrimli-trance-extrem-deploy.yml`
- Previous deploy: `docs/EXTRIMLI-START-DEPLOY.md` (`OKRID-2026-EXTRIMLI-START-001`)
- Module docs: `docs/EXTRIMLI.md`
- Multi-repo links: `docs/MULTI-REPO-LINKS.md`
- OKRID registry: `docs/OKRID-REGISTRY.md`
- Persona bank: `docs/PERSONA-BANK.md`
