# VRH loop registry — existing runtime adapter

User confirmed all loops and SPAJA function are in AI-IQ-SUPER-PLATFORMA and that runSpajaPetlja is the intended SPAJA function. This change adds an adapter, not a new canonical runtime or language rewrite.

src/lib/petlje/vrh-registry.ts maps all 38 PetljaKind values to the exact existing exported functions; completeness checked by Record<PetljaKind,...> and tests against index.ts exports. Source and GOAL metadata extracted from existing implementations, not invented. Frozen entries and own-property lookup reject prototype/unknown names. Import separately from petlje/vrh-registry; not re-exported from index to avoid cycles.

SPAJA already coordinates RANGE/TARGET/SEQUENCE segments and controlled export/import with strict/fallback policy. Adapter preserves those inputs and original results (statuses, traces, limits, warnings); it does not alter segment allowlists or force all loops into REPEAT. Existing PetljaInput/PetljaResult remain source of truth. resolveVrhLoop only resolves a function; it does not authorize execution or impose new universal limits. Callers must retain existing per-runner guard semantics and validate inputs; this is not an OS sandbox or security audit of every loop.

## Verification
New registry tests cover all runner identities, SPAJA identity, FOR delegation and rejection of unknown/prototype names. Existing petlje suite: 153 passed, 0 failed. Targeted lint/isolated typecheck are run separately. Full-platform build/CI/Preview and Java/JVM translation not verified.

## Next Spajascripte phase
First design an explicit loop-call AST with canonical name and structured PetljaInput, constrained permission and execution budgets. Use existing TypeScript runtime as reference oracle. Before Java target supports any named loop, port and compare that specific algorithm, statuses, limits and trace contract. Reject unsupported Java loop names, never map all 38 to for/REPEAT. SPAJA orchestration needs separate parity tests for transfers, segments and errors. This PR does NOT change Spajascripte parser/Java generator or add executable loop DSL commands.

No new runtime routes/engine, production deployments, payments, dependencies or configuration changes. Human review required. Rollback removes adapter/tests/docs only; existing loop implementations unchanged. Downstream raw runtime/evidence not synced; future integrations use reviewed contracts. Existing platform release blockers remain separate.

Targeted ESLint and isolated strict TypeScript compilation of registry and imported loop runtime: PASS. Full platform build not asserted.
