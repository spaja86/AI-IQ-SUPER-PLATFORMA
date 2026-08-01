# 🤝 CONTRIBUTING — AI-IQ-SUPER-PLATFORMA

## Purpose

This repository follows an **open-code** delivery model for the SPAJA deployment platform:

- code, docs, workflows, and governance rules stay reviewable in Git
- secrets, deploy hooks, private keys, and environment credentials stay outside the repo
- linked-repo changes must be tracked explicitly, especially for `spaja86/IO-OPENUI-AO`

## Scope boundaries

### Public in this repository

- application/runtime code
- documentation and rollout guidance
- GitHub workflow definitions
- agent policy and PR templates

### Operational-only controls

- GitHub Secrets
- Vercel environment variables and deploy hooks
- wallet/private keys
- production-only credentials and tokens

Do not commit `.env` files, tokens, API keys, webhook secrets, or private keys.

## Contribution flow

All changes should follow:

1. **Issue / change driver** — open or link an issue, bug report, roadmap item, or operational reason.
2. **Small PR** — ship the smallest safe change that moves the work forward.
3. **Review** — request human review for all merges; config, deploy, workflow, and security changes need especially explicit review.
4. **Release / promotion** — promote only after the required gates are green and rollout notes are documented.

## XP delivery expectations

- short iterations over large batches
- continuous integration on every PR/push
- test-first discipline for risky paths
- small, frequent releases
- human review as asynchronous pairing
- shared ownership through source-of-truth docs

## Required validation

Run the relevant existing checks before opening a PR:

```bash
npm test
npm run test:smoke
npm run predeploy:check
```

When the touched runtime surface supports it, also validate:

```bash
npm run build
npm run lint
```

## Required PR content

Every PR should include:

- summary of the change
- linked issue / reason for change
- validation evidence
- rollout plan
- rollback plan for deploy/config changes

If the change affects `IO-OPENUI-AO` or another linked repo, also include:

- **Cross-repo impact**
- downstream PR/issue reference or explicit “No linked repo change required”
- any sync-field updates required by `docs/MULTI-REPO-LINKS.md`

## Extra requirements for deploy / workflow / config changes

- add label `agent:config-change`
- describe `dev → staging → production` promotion intent when applicable
- include KPI impact and monitoring expectations
- preserve audit-ready workflow summaries and PR notes

## Security requirements

- never commit secrets
- use GitHub/Vercel secrets management
- keep dependency and secret scanning enabled
- request a security-aware reviewer for auth, billing, deploy, or dependency changes

## Linked-repo coordination

For cross-repo work with `spaja86/IO-OPENUI-AO`:

- record the downstream impact in the PR template
- update shared docs/config when the contract changes
- keep references bidirectional when follow-up work is required

## Source-of-truth references

- [`README.md`](./README.md)
- [`AGENTS.md`](./AGENTS.md)
- [`.agent-config.json`](./.agent-config.json)
- [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- [`docs/MULTI-REPO-LINKS.md`](./docs/MULTI-REPO-LINKS.md)
- [`docs/GO-LIVE.md`](./docs/GO-LIVE.md)
- [`docs/DEPLOYMENT-POWER-RESOLUTION.md`](./docs/DEPLOYMENT-POWER-RESOLUTION.md)
