# SPAJA deployment providers: bounded local prototype

Change driver: request of 17 October 2026 for a Vercel-independent first step.
OKRID-2026-SPAJADEPLOY-001: proposed release-governance track; owner @spaja86.
KPI: verified offline fixture deployment and rollback, no automatic activation,
no network/process execution in the worker, no public availability claim.

## Provider contract

`deployment-provider.ts` defines deploy receipts and compare-and-swap rollback.
`provider-adapters.ts` requires explicit `vercel` or `spaja-local`. Unknown providers
fail; failure never falls back to another provider. Capability metadata is separate
from the legacy Vercel project identifiers in `deploy-registry.ts`.

The optional Vercel adapter delegates to the existing trigger, preserving registry,
manual-trigger, confirmation-token and EXTRONDOL production gates. Hook success means
`accepted`, never verified application health. Revision/version on Vercel receipts are
caller-supplied provenance, not confirmation of the revision Vercel built. Vercel rollback
is explicitly unsupported. The existing HTTP route remains ADMIN-authenticated and
Vercel-only; it rejects other supplied providers and malformed JSON body shapes.
No HTTP/UI route imports or executes the local worker.

## Local execution and evidence

`createLocalDeploymentAdapter()` starts disabled. A trusted caller must explicitly use
`{ executionEnabled: true }`. Only `spaja-local-prototype` in `dev` is accepted;
staging/production remain blocked even with `DEPLOY_PRODUCTION`.
Requests contain no command, URL, filesystem path or working directory.

Fixed code constructs a static HTML probe. It does not build Next.js, execute checkout
code, run npm scripts, install packages, clone repositories, start a listener or provision
infrastructure. Its private temporary directory and release UUIDs are internally generated.
Each release records version, source revision, actor, timestamp and SHA-256. The file must
be regular (not a symbolic link), below 1 KiB, match the exact expected fixture content
and match its digest before activation. This is file verification, not HTTP health probing.

Active pointer and ledger are committed together with a same-directory rename; memory
advances only after publication succeeds. Failed candidates leave the active version
unchanged. `state.json` mirrors successful transitions. `inspect()` returns copies,
including blocked/failed attempts and rollback actor/previous version. Failed/blocked events
are mirrored to disk at the next successful transition. This unsigned evidence is not a
tamper-proof, durable production audit service. Crash recovery, fsync guarantees, restart
imports and multi-host locking are unsupported; operations within one instance serialize.

All receipts have `availabilityVerified: false`. `local-artifact` confirms only the fixed
probe. Revision is trusted-caller provenance; the demo reads Git HEAD and explicitly reports
dirty checkout state, rather than claiming HEAD identifies uncommitted code.

## Rollback, limits and trust

Rollback requires opt-in, an actor, a known session-owned target and
`expectedActiveDeploymentId` matching the current pointer. The target content/digest is
verified again. Stale active version, unknown/cross-session target, corrupt/missing/symlink
artifact or publication failure cannot advance the pointer. This changes only a local
artifact pointer, not database state, production traffic or a remote process.

Each session retains at most 20 releases (additional deployments are rejected), 100 audit
events and sub-1-KiB fixtures. `dispose()` deletes only its generated directory and closes
the session. The OS user/filesystem is trusted; these guards are not a sandbox against a
hostile same-user process. A general application build worker requires reviewed isolation,
resource/time limits, trusted artifact provenance, recovery, authentication and health checks.

## Reproduce

Install the existing locked dependencies in an isolated development checkout, then:

```sh
node --import tsx scripts/spaja-local-deploy.ts
node --import tsx scripts/spaja-local-deploy.ts --execute
node --import tsx src/tests/lib/deployment-provider.test.ts
node --import tsx src/tests/lib/deploy-trigger.test.ts
node --import tsx src/tests/autofinish/deploy-platforma-trigger-route.test.ts
```

The first command is plan-only. The explicit demo creates and verifies v1/v2, rolls back
to v1, prints JSON evidence and deletes the temporary directory. No Vercel credentials are
needed. Tests mock Vercel responses; no live hook is called. The new test is discovered by
the existing `test:lib` / `test:ci` runner.

## Review and release boundary

Reviewed AGENTS.md, .agent-config.json, deploy authorization, confirmation/governance gates
and SPAJA SERVER control-plane claims. No secrets, dependencies, workflows, infrastructure,
production configuration, payment behavior or authentication privilege are introduced.
The control-plane build-worker/execution/availability flags remain false: a dev fixture
does not establish a deployed application worker or publicly reachable server.

Changes are on an isolated review-fork branch with inherited workflows confirmed disabled.
No upstream feature branch, auto-merge label, production deploy or merge is authorized.
PR #1343 addresses upstream direct-merge workflows separately. Review current repository
protection and quality gates before any later release; do not infer approval from this demo.

Cost: temporary files only; no paid services. Rollout: draft PR, human review, resolve release
gate blockers, then a separately authorized infrastructure phase. Rollback this code change
by reverting the PR. The existing Vercel path remains available. No linked repository change
is required; IO-OPENUI-AO receives no jobs, operational data or secrets.
