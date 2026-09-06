# CI & Test Strategy

## Canonical test entrypoint

- `npm run test` → canonical CI unit/integration gate
- `npm run test:ci` → alias used by workflow and agent config

## Layered test scripts

- `npm run test:core` → auth + spaja-ultra + glavni-endzin + api contract baseline
- `npm run test:autofinish:critical` → minimal high-signal autofinish route regression set
- `npm run test:billing`, `npm run test:brouvzer`, `npm run test:call-centar`, `npm run test:depon`, `npm run test:unit` → additional legacy suite folders
- `npm run test:lib` → recursive domain logic tests under `src/tests/lib`
- `npm run test:api` → recursive route contract tests under `src/tests/api`
- `npm run test:smoke` → minimal go-live smoke gate

## Required quality gates for PR validation

1. `npm run lint`
2. `npm run test`
3. `npm run test:smoke`
4. `npm run predeploy:check`
5. `npm run build`

## Changed-path strategy

- Always run full quality gate for:
  - changes in `.github/workflows/**`
  - changes in `.agent-config.json`
  - changes in `package.json` / `package-lock.json`
  - changes in auth, billing, deploy, security, or cross-repo governance surfaces
- `omega-auto-build` now enforces this behavior:
  - `push` → full `npm run test:ci`
  - `pull_request` → always `test:core`, then selective suites by changed paths
  - auto-upgrade to full `test:ci` when critical surfaces are touched
- `test:smoke` remains mandatory before merge.

## Notes

- `src/tests/autofinish/**` full sweep remains scheduled/batched; canonical `test` includes only `test:autofinish:critical`.
