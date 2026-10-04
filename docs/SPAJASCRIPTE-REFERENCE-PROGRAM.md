# Spajascripte reference program: LET → CALL → PRINT

User-approved runnable integration after NODE 1450 review. Separate TypeScript/Node reference dialect; does NOT alter standalone Java compiler or claim Java parity. NODE 1450 remains read-only planner, not execution authority. Prior context #1314/#1315.

## Example
```text
LET start = 1
LET end = 3
CALL FOR PETLJA FROM start TO end STEP 1 LIMIT 10 TIMEOUT 1000 AS result
PRINT result.output
PRINT result.status
```
Run: `npx tsx scripts/spajascripte-reference-demo.ts`
Test: `npx tsx src/tests/lib/spajascripte-reference-program.test.ts`

LET supports immutable integer literals only, magnitude <=1,000,000. CALL supports only exact FOR PETLJA with literal or earlier numeric binding start/end/step and mandatory iteration/time bounds (1..1000). At most 100 instructions, 10 calls, 16Ki characters, so worst-case requested loop budget is bounded by ten one-second calls, plus host overhead; not an OS sandbox. No expressions, mutation, nested loops or other named-loop execution yet. Compile frontend parses full source and preflights all names/limits before any loop executes; per-runner semantic errors remain original result statuses.

PRINT supports only prior result.output/status/reason/completed/warnings. Numeric output is refused for incomplete loops; inspect reason/status instead. Full PetljaResult (including trace, warnings, guards and status transitions) retained in returned results. Input status ACTIVATED is a local numerical-runner state, NOT authorization for external effects. No eval, arbitrary JS/Java, network, deployment, finance or filesystem mutation. Values remain process-local; demo prints results only.

Result duration is nondeterministic. Existing FOR runtime is delegated unchanged; parity tests compare semantic fields. If a later output guard throws, earlier loops have already run in memory, but no partial report is returned or external output produced by library.

## Verification / boundaries
New integration tests, previous loop-adapter tests, read-only synthetic demo, targeted ESLint, isolated strict typecheck and diff check run locally. Full repo build/suite/CI, Preview and Java/JVM not verified. This dialect is not merged with the standalone Java AST; Java named loops remain unsupported. Do not claim support for all 38 loops or SPAJA orchestration. Encryption/VR not implemented.

NODE 1450 fixed read-only targets now include this module/test and report the reference-only combined flow as implemented; checksExecuted remains false for planner output. Next: add per-runner reference support and real JDK parity before Java target. No automatic all/cycle launch. Human review before merge; rollback removes standalone module/tests/demo/docs, leaving loop runtime and Java compiler intact. No dependencies/config/workflows or existing authority changes.
