# Spajascripte v0.1 — Java target prototype

Independent Node.js tooling, no TypeScript/Next build dependency. User-approved Java/JVM target and explicit watch-build workflow. VRH relation: proposed language tooling only; existing EXTREM/EXTRONDOL authority and no-new-runtime-route contracts are unchanged. Not a TypeScript replacement or automatic conversion of the platform.

## Grammar
One instruction per line. Blank lines and full-line # comments allowed.
- LET name = expression (immutable variable, unique lowercase name)
- PRINT expression
Expressions: decimal integers with optional minus and previously declared variables, joined by +. No strings, functions, loops, Java passthrough or arbitrary code. Maximum 16 KiB source, 100 statements, 32 terms per expression. Final expression values must fit signed int except -2147483648, currently not supported. Decimal literals normalized to avoid Java octal interpretation. No eval.

## Commands (from repository root)
node tools/spajascripte/cli.mjs check tools/spajascripte/example.spaja
node tools/spajascripte/cli.mjs emit tools/spajascripte/example.spaja
node tools/spajascripte/cli.mjs build tools/spajascripte/example.spaja
node tools/spajascripte/cli.mjs run tools/spajascripte/example.spaja
node tools/spajascripte/cli.mjs watch tools/spajascripte/example.spaja
node tools/spajascripte/compiler.test.mjs

Node 20+ and JDK 21 recommended for build/run/watch. `emit` prints Java without needing a JDK. `build` validates Java in a temporary directory and removes artifacts; it does not package a persistent executable. `run` explicitly compiles/runs the generated fixed class. Child tools use literal arguments (no shell), 10-second timeouts, bounded output and heap options. These are defensive limits, NOT an OS/container security sandbox. JAVA_TOOL_OPTIONS/JDK_JAVA_OPTIONS/_JAVA_OPTIONS cleared for child process. PATH/JDK must be trusted.

`watch` polls the named local source and compiles after changes; it NEVER automatically runs, deploys, edits source or pays anything. Watch errors are reported; Ctrl-C stops it. No agent authorization comes from source content.

## Verification
Parser/generator and negative/boundary tests pass; JS syntax/diff checks pass. Example expected output: 42. JVM integration test explicitly SKIPS when javac unavailable; a green parser result does not prove Java build.
Session sandbox lacks java/javac. `mise install java@21` failed on DNS/network access; generated Java was not compiled or executed here. With JDK installed, test script performs real CLI run and compares output against reference result. Continuous watch behavior has not been exercised with JDK. Full Next build/CI/Preview unverified; no deployment requested.

## Encryption is deferred
No encryption currently implemented and no key requested. Next phase: authenticated encryption using reviewed standard library, protected key input, nonce/key version policy, corruption and wrong-key tests, rotation/recovery design, plaintext lifetime control. Encryption at rest is distinct from automatic build reaction. Never store keys in repository or messages. Build requires temporary plaintext; do not claim encrypted execution or unbreakable protection.

## Next steps
Confirm JDK build/run, then add typed AST validation, functions/control flow and resource isolation in separate reviewed iterations. Real graphics/VR remain separate. Existing platform type errors are not fixed by this prototype. Human review before merge; rollback removes standalone tools/spajascripte only. No dependencies/config/workflows modified or cross-repo raw-data synchronization.

## AST pipeline update
Parser now exports structured program/statement/integer/identifier nodes with source line numbers. Validator checks externally supplied AST, declared-before-use immutable names, integer types and intermediate addition overflow. generateJava always validates AST; callers cannot inject raw Java expressions. compile remains compatible and additionally returns AST and validated statements. All arithmetic remains int32-only; functions, loops and encryption are not implemented.

Local parser/AST/generator tests and JS syntax checks pass. JVM still unavailable here; integration explicitly skipped. Full platform build/CI not verified. Intermediate overflow now fails even when a later negative term would bring the final sum back into range. This is intentional checked-arithmetic behavior, not Java wraparound.
