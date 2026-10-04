# VRH mušema for UMBREL / DURMITOR

User requested term mušema rather than schema. Here mušema means explicit validation contract for allowed input fields, types and numerical budgets; no new algorithm meaning inferred.

v0.4 requests: kind=loop-call, name exactly UMBREL PETLJA or DURMITOR PETLJA, input fields start/end/step/target/sequence/maxIterations/maxDurationMs/status. Finite numeric magnitude <=1e6, sequence <=1000, integer budgets1..1000, canonical status. Extra/missing fields and nonfinite values rejected; sequence copied. Central VRH dispatcher routes to original functions with previously reviewed shared budget changes (#1322/#1323). No algorithm duplication.

Together v0.2 (35 individual), v0.3 (SPAJA) and v0.4 (two orchestrators), all38 registered functions have corresponding reference profiles. This is local structured dispatch, NOT38 Spajascripte syntax commands or Java implementations. v0.1/LET-CALL-PRINT grammar still FOR-only. SPAJA segment allowlists unchanged; recursive SPAJA, UMBREL/DURMITOR inside SPAJA remain disallowed. Separate profiles do not imply arbitrary graph integration.

Result is original PetljaResult with status/partial output/trace; consumers must check completed and reason. Time guards are best-effort, not hard realtime. Java rejected; no full-platform build, production readiness, VR/device performance or numerical financial accuracy claim. NODE1450 remains read-only planner.

Tests compare activated/sufficient, cap1, disabled and zero-step outcomes with direct runners for both names, assert total iterations capped, reject extra/malformed inputs/Java/unsupported names. Prior individual/SPAJA profiles and umbrella/mountain budget tests run. Targeted lint and isolated strict central dispatcher compilation/diff check run. Full repo build/CI/Preview/JVM unverified.

Human review before merge; no deployment/payments/dependency/config/workflow changes. Rollback removes v0.4 route/profile/test/docs, retains underlying shared-budget runtime. Existing documents that profiles were blocked are historical; this PR enables only reviewed bounded structured reference entry points. Future Spajascripte generic CALL adaptation and JVM parity remain separate.
