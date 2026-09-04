# FinOps & Enterprise Operating Model

## 1) Single source of truth for deploy/build
- **Primary:** Vercel Git integration handles production deploy/build.
- **GitHub Actions role:** quality gates (type-check, lint, tests), audit logs, governance checks.
- Manual Vercel deploy hook remains a fallback for controlled re-deploys.

## 2) FinOps controls
- Monthly budget tracking in USD.
- Alert thresholds at **50% / 75% / 90% / 100%**.
- Cost-center ownership is required for automation/config changes.

## 3) GitHub cost optimization policy
- Use workflow `concurrency` and `cancel-in-progress` on high-frequency pipelines.
- Avoid duplicate build/deploy steps in Actions when Vercel already performs deployment builds.
- Keep artifact/cache retention lean and aligned with operational needs.

## 4) Vercel cost optimization policy
- Limit manual deploy hooks to explicit operational cases.
- Prefer branch/PR deployment discipline to reduce unnecessary preview churn.
- Review cron/scheduled routes and keep only operationally justified jobs.

## 5) Enterprise vendor engagement model
- Maintain annual commercial review with both GitHub and Vercel.
- Track opportunities for volume discounts, support/SLA bundles, and compliance add-ons.
- Hold quarterly business review (QBR) cadence for roadmap and spend alignment.

## 6) Shared KPI framework
- Cost per deployment
- Cost per active user
- MTTR
- Build duration
- Deployment success rate

## 7) Governance gate
- PRs that modify automation/config (`.github/workflows/`, `.agent-config.json`, `vercel.json`) must include:
  - Cost impact estimate
  - Rollback plan
  - KPI impact
  - Cost center / owner
- High-impact PRs (config/deploy/cross-repo/risky feature tracks) must also include OKRID linkage (`OKRID-YYYY-TRACK-###`) and KPI status.

## 8) Non-stop collaboration cadence
- Named owner contacts for operations and procurement.
- Monthly operational review.
- Quarterly enterprise review.
- 24/7 escalation channel for critical incidents.

## 9) OKRID weekly governance cadence
- Weekly automated OKRID compliance summary via `.github/workflows/okrid-weekly-review.yml`.
- Track blocked PRs with missing OKRID linkage and escalate unresolved blockers in the next ops review.
