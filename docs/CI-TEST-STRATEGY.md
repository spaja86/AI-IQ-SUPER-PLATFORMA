# CI & Test Strategy

## Canonical test entrypoint

- `npm run test` → canonical CI unit/integration gate
- `npm run test:ci` → alias used by workflow and agent config

## Layered test scripts

- `npm run test:core` → auth + spaja-ultra + glavni-endzin + api contract baseline
- `npm run test:lib` → domain logic tests in `src/tests/lib/*.test.ts`
- `npm run test:api` → route contract tests in `src/tests/api/*.test.ts`
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
- For isolated domain changes, run:
  - `test:lib` + targeted `test:api` subset matching touched domain
  - plus `test:smoke` before merge

## Notes

- `src/tests/autofinish/**` is intentionally excluded from canonical `test` for daily CI speed and should be scheduled/batched.
