# Central VRH numerical loop dispatcher

User approved VRH as the connection boundary after #1316. Existing validation and dispatch logic moved from Spajascripte-specific adapter to src/lib/petlje/vrh-dispatcher.ts, without widening support or duplicating algorithms. Spajascripte parser retains syntax only; compatibility validateLoopCall/executeLoopCall are exact delegates to VRH validateVrhLoopRequest/dispatchVrhLoop.

Flow: Spajascripte → VrhLoopRequest → shared validator → exact registered function → original PetljaResult. Existing LET/CALL/PRINT reference flow therefore uses the same VRH boundary. Complete status/reason/warnings/traces/limits preserved; no new result translation. This is central to these reference adapters, not a claim that every platform subsystem is now routed through VRH. Direct existing runner APIs remain available and unchanged.

Only FOR PETLJA execution profile enabled. Registry still lists 38 names; SPAJA and other loops fail closed at dispatcher execution. Java target rejected. NODE 1450 remains read-only planner; no authority granted by its output. Dispatcher is local numerical execution, not approval/authentication service or OS sandbox. Existing no-new-runtime-route/engine boundaries preserved; no new API route or parallel source-of-truth.

## Verification
New tests assert exact identity of Spajascripte delegates and shared VRH functions, direct FOR semantic parity and rejection of unsupported names/targets/limits. Existing adapter and combined reference flow regression tests run. Targeted lint, isolated strict typecheck and diff check run separately. Full platform build/CI/Preview, actual JVM execution and remaining runner profiles not verified.

## Next
Review per-runner profiles and their compatible input schemas; add one at a time with parity. SPAJA segment transfer needs its own profile/tests, not generic FOR input. Java requires real translation and JDK verification. No merge/deploy, external state, payments, dependencies or config changes. Human review required. Rollback restores old adapter-owned rules and removes dispatcher tests/docs; underlying algorithms unchanged.

Recorded: dispatcher, loop adapter and combined reference tests PASS; targeted ESLint, isolated strict typecheck and diff check PASS.
