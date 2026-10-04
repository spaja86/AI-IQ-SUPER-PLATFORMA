# Real AI IQ compiler → read-only plan

User-approved follow-up #1326. compileAiiqBuildPlan calls existing compileAiiqLanguage in strict deterministic-only mode with AI feature disabled. Invalid/security-failed/BLOCKED/partial syntax/integration BLOCKED or deterministic-fallback-required produces blocked/null plan. Exact source lines must match returned AST; unsupported or ignored source text cannot silently authorize a plan. Then existing strict four-directive adapter validates policy. No arbitrary command execution.

Context requires sourceRevision40-hex and local/preview environment. SHA256 of exact source computed. Revision is caller supplied, explicitly revisionVerified=false; no Git authenticity or target deployment claim. No production environment allowed. Compiler throw propagates; no success fabricated.

Tests invoke real compiler. If actual integration blocked, blocked is valid expected outcome, not bypassed. Positive path additionally tested with explicitly synthetic unblocked fixture; not proof actual readiness. dependency-injected compiler exists for tests; production caller should use default and not arbitrary untrusted compiler injection. Plan remains proposed/read-only, executionEnabled/buildVerified=false. Compiler parsing success never means JVM/Next build success.

Targeted pipeline/adapter tests, lint/diff run. Full TypeScript compilation of broad compiler dependency tree, full platform build/CI/Preview/JVM not verified. No CLI user-source execution, build runner, secret/deployment/payment operation, dependency/config/workflow or canonical grammar changes. Human review before merge; rollback removes standalone wrapper/tests/docs. Next: fixed approved execution runner plus actual evidence; toolchain/Java translation remain prerequisites.

Recorded real compiler test outcome: blocked. Positive plan path passed only with synthetic unblocked fixture. All targeted tests/lint/diff checks PASS.
