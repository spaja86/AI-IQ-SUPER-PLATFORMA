# Deployment Power-Resolution Plan

## 1) Operational meaning of "resolution of power"

In this repository, "Vercel does not give enough power" is normalized into measurable limits:

- **Performance limits**: request latency and cold-start behavior.
- **Scaling limits**: concurrent requests/jobs and sustained throughput.
- **Timeout limits**: max execution duration for API/cron workloads.
- **Build/deploy reliability**: failed runs, flaky deploys, and missing rollback paths.
- **Regional coverage**: latency and availability by deployment region.

## 2) Current deployment paths and ownership

| Path | Purpose | Owner |
|---|---|---|
| `.github/workflows/vercel-deploy.yml` | Manual fallback trigger for Vercel deploy hook | Platform Ops / deploy-bot policy |
| `vercel.json` | Runtime + cron behavior on Vercel | App Runtime Team |
| `.github/workflows/depon-deploy.yml` | Multi-phase DEPON deployment pipeline | DEPON platform owners |
| `.github/workflows/blockchain-deploy.yml` | Smart contract deployment workflow | Blockchain owners |
| `.github/workflows/omega-auto-build.yml` | CI quality gate (type-check, lint, tests, predeploy checks) | ci-bot |
| `.github/workflows/security-scanner.yml` | Security scan baseline (deps, secrets, CodeQL) | security-scanner |

## 3) Target deployment model

- **Keep Vercel** for Next.js frontend/SSR and low-latency edge-friendly API routes.
- **Move heavy compute / long-running jobs** to stronger compute layer (containerized worker platform).
- **Keep GitHub Actions** as release orchestration and governance gates.

## 4) Workload profile split and runtime assignment

| Workload class | Examples | Runtime target |
|---|---|---|
| UI / SSR pages | App routes, page rendering | Vercel |
| Low-latency APIs | Auth/session/status routes | Vercel |
| CPU / memory heavy processing | analytics aggregation, extreme processing, large batch jobs | Container/worker compute |
| Scheduled jobs / cron | health/evolution/verification jobs | Vercel cron for light jobs; worker scheduler for heavy jobs |

## 5) Release orchestration policy

All deploy workflows must enforce:

1. **Quality gates** before deploy:
   - Type-check
   - Smoke tests
   - Predeploy checks
   - Security checks (dependency/secret scanning baseline)
2. **Environment progression**:
   - `dev` → `staging` → `production`
   - production requires explicit confirmation.
3. **Rollback/failure controls**:
   - fail-fast on gate failure,
   - rollback trigger path documented in workflow summary,
   - stop deployment progression on failed phase.

## 6) Reliability controls

- Concurrency/locking by workflow + environment.
- Explicit run identity in summaries (run id, attempt, actor, ref).
- Post-deploy health verification for HTTP-serving targets.
- Standardized deployment audit summary for every run (`if: always()`).

## 7) Capacity and SLO targets

Use these defaults until service-specific overrides are approved:

| Metric | Target |
|---|---|
| API latency (p95) | ≤ 300ms |
| Error budget | 0.1% monthly (99.9% objective minimum) |
| Cold start | ≤ 1.5s p95 |
| Max job duration (serverless tier) | ≤ provider timeout minus 10% safety |
| Throughput | Defined per workload in release notes before production promotion |

## 8) Observability and incident response requirements

- Unified logs, metrics, and traces for Vercel + worker runtime.
- Alert routing with clear ownership (Platform Ops, Security, Feature Owner).
- Runbooks linked from deploy summaries for rollback and degraded modes.
- Incident timeline + RCA link required for production-impacting failures.

## 9) Multi-repo governance alignment

Per `AGENTS.md` and `.agent-config.json`:

- Maintain sync with linked repos (including `spaja86/IO-OPENUI-AO`).
- Keep dependency version coherence across shared packages/workflows.
- Preserve cross-repo references and audit links in PR/issue follow-up.
- Keep human-review gate mandatory before merge.

## 10) Rollout phases

1. **Phase 1**: baseline measurement + workload classification.
2. **Phase 2**: migrate one heavy path off Vercel to worker compute.
3. **Phase 3**: expand migration + enforce unified CI/CD gates.
4. **Phase 4**: finalize docs, ownership matrix, and operational handoff.
