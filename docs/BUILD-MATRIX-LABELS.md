# Build matrix labels — inactive metadata

`scripts/build-matrix-labels.json` registers `djer`, `dere`, `niks`, `dor`, `rin`, `ned` as metadata only. Their semantics are not defined. No commands, Codex integration, Python implementation or matrix-instance output processing are enabled. Existing Next.js build is unchanged and does not consume this file.

Validate loading and inactive state:

```bash
node --test src/tests/build-matrix-labels.test.mjs
```

A passing test verifies the configuration, not script generation or a successful application build. Enabling execution requires a separate implementation, tests and review.
