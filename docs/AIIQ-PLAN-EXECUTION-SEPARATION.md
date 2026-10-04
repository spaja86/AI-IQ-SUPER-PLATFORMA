# AI IQ plan / execution separation

Explicit user-approved policy change after #1328: constructing a read-only plan is distinct from authorizing execution. Invalid compiler result, failed security, compiler BLOCKED status, partial syntax or source/AST/policy mismatch still refuses plan. Integration overallBLOCKED/fallback-required is preserved in executionGate.integrationBlocked and diagnostics, but no longer suppresses safe read-only plan construction. Missing profile also marks execution integration blocked.

executionEnabled=false, authorizationGranted=false, promotionEnabled=false, deploymentEnabled=false, buildVerified=false ALWAYS, even if integration not blocked. No score/status gives authorization. Existing engine 50ms threshold, AI/freeze/governance policies unchanged; no executor introduced. Status proposed means reviewable artifact only; downstream must not use presence of plan as permission. Caller revision unverified remains explicit.

Tests real compiler returns proposed safe plan while all authorities disabled; synthetic blocked integration still emits visible execution block; invalid/security/partial syntax/compilerBLOCKED refuse. Adapter positive/negative regressions retained; targeted lint/diff. Full broad compiler typecheck/platform build/CI/Preview/JVM unverified. No actual build or deployments.

Human review required; rollback re-blocks artifact generation without changing original engine rules. No dependency/config/workflow/secret/payment or runtime route changes. Prior docs stating integration suppresses plan are historical and superseded by this narrow read-only policy. Next separately reviewed fixed executor requires explicit authorization and actual tool evidence, not reuse of plan status.
