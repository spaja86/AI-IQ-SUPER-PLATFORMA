# EXTRIMLI network activation gate review — 2026-10-30

Stacked follow-up to PR #1379, based on `8b7482e95d02453eb5b08195b74f82edf18eae8c`.
No deployment, DNS edit, certificate issuance, service reconfiguration or merge requested.

## Behavior

- Logical ID `spaja.nivo*spaja` is preserved. EXTRIMLI domain inputs are candidates only.
- EXTRONDOL nullable canonical exports preserve field names; consumers must tolerate null.
  EXTREM's summary string no longer declares an unverified canonical pair.
- EXTRONDOL domain acceptance and dependent B2B/release posture remain blocked.
- The workflow gate consumes the shared PR #1379 model. It accepts no evidence from
  dispatch, environment assertions or a repository JSON document. No trusted evidence
  ingestion is implemented, so its CLI always exits 1, emitting no activation outputs.
- Even synthetic complete domain/TLS evidence can only establish a diagnostic confirmed
  address; it cannot authorize a hook. Wildcard observations need separate integration.
- Deploy additionally requires manual dispatch from main and successful network gate.
  Push remains useful for validation but cannot reach the shared hook.
- Production confirmation, upstream validate/security/build/staging chain, downstream issue
  gate, environment selection and promotion freeze requirements remain in place.
- Added read-only PR regression workflow has no deployment environment, secrets or hook.

## Scope and release control review

Reviewed `.agent-config.json`, `scripts/predeploy-check.mjs`, Vercel governance/readiness,
EXTRONDOL acceptance/B2B fields and EXTRIMLI workflow dependencies. Predeploy's warning exit 0
is not release approval. Shared mapping always returns publicActivationAllowed=false.
Vercel remains provider-specific; Caddy's generator remains configuration-only, not an activator.

Other workflows (including `vercel-deploy.yml`, `extrimli-trance-extrem-deploy.yml` and
`deploy-platforma.yml`) and provider-side automatic integrations remain unchanged. This PR
protects this EXTRIMLI hook path; it is not a repository-wide or provider-side deployment lock.
No assertion about external Git integration protection, DNS ownership or existing services'
health is made. Independent release authorization and review are still required.
No runtime configuration, package/lockfile, credentials or linked repository is changed.
Downstream documentation describes the nullable contract; no downstream sync is executed.

## Local verification

- New gate regressions: 17/17, including CLI exit status under forged environment claims.
- START documentation: 4/4.
- EXTRONDOL: 64/64; missing-domain acceptance now correctly fails closed.
- EXTREM: 101/101.
- Existing network API/UI/governance: 4/4.
- Existing mapping/generator tests: 22 passed, 1 real Caddy integration skipped (no CADDY_BIN).
- TypeScript `tsc --noEmit`: exit 0.
- Scoped ESLint: exit 0, 11 existing unused-variable warnings; no errors.
- YAML parse and `git diff --check`: pass.
- Predeploy: exit 0, warning state (missing local env / existing contract warnings).

Full build, full repository suite, public DNS/TLS probing and remote CI are not certified.
`npm ci --ignore-scripts --no-audit --no-fund` used unchanged lockfile. No install hooks ran.

## Future unlock and rollback

Before any activation, separately review a trusted, freshness-bound registration/ownership/
DNS/TLS/application evidence channel plus billing, FinOps, quality, security, downstream and
human approval controls. Do not remove the unconditional block as a routine configuration edit.
Fresh TLS evidence must cover every served hostname (and wildcard separately if selected).
Revert this follow-up commit to undo code changes; no running service rollback is necessary.
