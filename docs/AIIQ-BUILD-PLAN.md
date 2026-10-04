# AI IQ language AST → read-only build plan

User approved using AI IQ PROGRAMSKI JEZIK as intent/policy/orchestration layer. Inspected canonical parser: KEYWORD:value → AiiqLanguageAstNode[], compile output JSON AST (not Java binary). Existing compiler accepts more flexible programs; this adapter is a stricter optional subset and does not change existing grammar/evaluation/runtime routes.

createAiiqBuildPlan consumes typed AST (including ast from reviewed compile result) and requires exactly four unique directives:
INTENT: JAVA_BUILD / NEXT_BUILD / JAVA_AND_NEXT_BUILD
RULE: NO_SECRET ALLOWLIST HUMAN_REVIEW
ORCHESTRATE: CHECK_THEN_BUILD_THEN_TEST
OUTPUT: VERIFIED_BUILD_REPORT

OUTPUT names requested report, NOT an observed successful build. Returns proposed/read-only, all steps not-executed, executionEnabled/buildsExecuted/buildVerified=false. No command strings, spawn, filesystem writes, secrets, arbitrary AI instruction interpretation or actual authorization. Intent and RULE text cannot grant permissions. Java/JVM and Next builds remain separate targets with blockers; toolchain/build status unverified, named-loop Java translation unverified. NODE1450/VRH executor unchanged.

CLI fixed example: npx tsx scripts/aiiq-build-plan.ts
Test: npx tsx src/tests/lib/aiiq-build-plan.test.ts

Tests prove exact policies, target separation, deterministic plan, duplicate/missing/injection intent rejection and no-success claims. CLI uses literal fixture AST; real compiler→adapter integration and valid execution scheduling are NOT wired yet. Targeted lint/isolated strict module typecheck/diff run; full platform build/CI/Preview/JVM unverified. No readiness score substitutes for approval.

Next: wire reviewed compiler output through adapter, retain source revision/target/environment, then separately approved fixed local tool runners with true exit/log evidence. Do not call compile success Java/Next build success. Human review required; rollback removes standalone adapter/demo/test/docs. No dependencies/config/workflows, deploy/payments or raw downstream data changes. Context #1325.
