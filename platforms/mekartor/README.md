# Mekartor

> Repo-local deployable platform surface za AI IQ SUPER PLATFORMA deployment governance model.

## Uloga

`platforms/mekartor/` dokumentuje Mekartor kao novi deploy-ready surface koji koristi postojeći Vercel + GitHub Actions release model bez posebnog linked-repo rollout-a.

- Runtime surface: `/mekartor`
- Health endpoint: `/api/mekartor`
- Production URL: `https://ai-iq-super-platforma.vercel.app/mekartor`
- Manual fallback deploy: `VERCEL_DEPLOY_HOOK_MEKARTOR` (secret only)

## Deployment contract

- **Runtime:** Next.js 16
- **Promotion:** `dev → staging → production`
- **Rollout:** `10% canary → 50% staging → 100% production`
- **Observability:** Deploy Platforma health probe + first-24h audit review
- **Cross-repo impact:** No linked repo change required in `spaja86/IO-OPENUI-AO`

## Env & secret boundary

- `VERCEL_DEPLOY_HOOK_MEKARTOR` — optional fallback deploy hook
- `MEKARTOR_STATUS_WEBHOOK_URL` — optional status fan-out webhook
- `MEKARTOR_UPSTREAM_URL` — optional future upstream catalog source

Sve vrednosti ostaju isključivo u GitHub Secrets ili Vercel Environment Variables.

## KPI targets

| KPI | Target |
|---|---|
| Catalog sync latency p95 | ≤ 250ms |
| Health endpoint SLA | ≥ 99.95% |
| Build duration | ≤ 3 min |
| Error rate | < 0.2% |
| Manual deploy recovery | ≤ 15 min |
