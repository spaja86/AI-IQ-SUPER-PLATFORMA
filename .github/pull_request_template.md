## Summary

-

## Agent & Automation Checklist

> This repository uses automated agents. See [`AGENTS.md`](../AGENTS.md) for full policy.

- [ ] I have reviewed [`AGENTS.md`](../AGENTS.md) if this PR touches CI, deploy, security, or config
- [ ] No secrets, `.env` files, tokens, or credentials are committed
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] **Config/CI change** — PR labeled `agent:config-change` if `.github/workflows/` or `.agent-config.json` is modified
- [ ] **Cross-repo impact** — linked-repo impact described below (if applicable)
- [ ] Human review requested from appropriate code owner

### Cross-repo impact (if any)

> Describe any required follow-up in `IO-OPENUI-AO` or other linked repositories, or write "None".

-

## Billing Risk Assessment

- [ ] This PR touches billing/payment logic
- [ ] High-risk billing changes are present (webhook, checkout, replay, migrations)
- [ ] Security sign-off completed by code owner
- Security approver:

## Validation

- [ ] `npm test`
- [ ] `npm run build`
- [ ] Relevant billing endpoints tested

## Rollout Plan

- [ ] Feature flags configured
- [ ] Kill-switch fallback validated
- [ ] Monitoring/alerts updated
