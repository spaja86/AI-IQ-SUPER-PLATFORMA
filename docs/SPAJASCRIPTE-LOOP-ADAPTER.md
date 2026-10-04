# Spajascripte named-loop reference adapter v0.1

User-approved next phase after VRH registry #1313. Adapter is standalone, not yet combined with LET/PRINT/IF/REPEAT compilation pipeline. No new runtime route/engine or existing authority changes.

## Syntax
One call only:
`LOOP {"name":"FOR PETLJA","input":{"start":1,"end":3,"step":1,"maxIterations":10,"maxDurationMs":1000,"status":"ACTIVATED"}}`
parseLoopCall yields loop-call AST. Input fields are mandatory; range numbers finite with magnitude <=1,000,000. Iteration and duration limits are integer 1..1000. Canonical statuses only. Exact registered names recognized, unknown/prototype keys rejected; all names other than FOR PETLJA fail at execution. Input limits do not grant permission for other actions.

FOR delegates to the exact existing runtime and returns its complete PetljaResult: output, status, warnings, reason, trace, iterations and duration. Existing invalid direction/zero-step/status handling is retained. Adapter does not change the algorithm or turn it into REPEAT. Runtime measured duration is nondeterministic; tests compare semantic fields, not timestamps. Time limit may stop sooner under load. No networking, payments or changes to external state.

## Run
`npx tsx scripts/spajascripte-loop-demo.ts`
`npx tsx src/tests/lib/spajascripte-loop-adapter.test.ts`
Reference target requires tsx/TypeScript module loading. This is deliberately separate from Java CLI; it is not a claim of standalone Node/Java support for 38 loops.

## Java boundary
executeLoopCall rejects java target. Existing Java parser explicitly rejects LOOP with unverified-translation message. JDK remains unavailable here; no JVM parity claim. Next phase: implement FOR's full result/status/guard contract on Java, then run per-algorithm parity with real JDK before enabling. Never translate other names to generic for. SPAJA segment export/import and orchestration need their own design/parity review.

## Verification and release
Targeted reference parity covers increasing/decreasing FOR, zero step, guard limit and blocked status; strict schema/unknown names/unsupported targets tested. Node compiler tests include explicit Java LOOP rejection; JVM test skips without javac. Full platform build/CI/Preview, persistent data, graphics and Java translation not verified. Human review before merge; rollback removes standalone adapter/demo/tests and restores prior generic Java rejection. No deployment, encryption or configuration changes.

Recorded: targeted adapter tests, Node compiler regression tests, demo, targeted ESLint, isolated strict typecheck and diff check PASS.
