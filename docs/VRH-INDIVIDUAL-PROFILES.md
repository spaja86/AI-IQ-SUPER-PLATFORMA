# VRH v0.2 individual-loop profiles

User approved staged implementation after all-loop audit. Adds 35 numerical reference profiles derived from existing SPAJA segment lists: 14 RANGE, 8 TARGET, 13 SEQUENCE. Algorithms not modified. Central dispatchVrhLoop routes version 0.2 through these profiles; old 0.1 validation/execution remains FOR-only and compatible.

Request: kind=loop-call, version=0.2, exact registered name, input. RANGE fields: start,end,step,target. TARGET: start,target,step. SEQUENCE: start,target,sequence. Every profile requires maxIterations,maxDurationMs,status. Family schemas deliberately include common superset fields (not every runner uses target/start). Numeric values finite, magnitude <=1e6; sequence <=1000 finite bounded elements. Both budgets integer 1..1000; canonical status only. Unknown/extra/missing fields fail. Sequence copied before dispatch.

Status is numerical runtime state, not external authorization. Limits reduce risk but are not OS sandboxing or proof of exact integer output: square/cube sums can exceed JavaScript safe integer range. These retain original floating-number semantics and MUST NOT be presented as financial arithmetic or Java int32 parity.

SPAJA, UMBREL, DURMITOR remain excluded. SPAJA requires reviewed segment transfer policy; UMBREL/DURMITOR require globally bounded nested execution. Existing direct runtime remains unchanged. No enable-all bypass for orchestrators. Java target rejected for every profile.

Spajascripte reference CALL syntax still supports FOR only. New profiles are central structured-request API, not 35 newly implemented DSL commands. parseLoopCall/validateLoopCall retain v0.1; callers use validateVrhProfileRequest for v0.2. No new network/API route/runtime engine or canonical authority override; local adapter only. NODE1450 still read-only.

Tests compare original runners against profiles for activated, disabled and iteration-limited cases across 35 names; also strict schema and unsupported-target failures. Parity is delegation verification, not independent proof of algorithm correctness. Existing 153 loop tests run plus FOR dispatcher/reference regressions. Timing excluded; full platform build/CI/Preview/JVM unverified.

Next separate phase: SPAJA composite schema, successful-export provenance and strict/fallback definition, recursion control, whole-graph iteration/time budgets and negative transfer tests. Do not insert all 38 into every branch. Human review required; no production merge/deploy/finance, config/dependency/workflow changes. Rollback removes v0.2 routing/module/test and leaves old FOR path untouched.
