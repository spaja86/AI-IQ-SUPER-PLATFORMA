# Source digest evidence v2

User-approved follow-up #1332. Evidence format v2 adds SHA256 digest of Git-tracked src/scripts/tools/package.json/package-lock.json/tsconfig.json/next.config.ts contents and names. Required lockfile, bounded listing/files/total bytes; rejects tracked symlinks/nonregular files. Before/after revision, dirty state and digest compared; inspector compares current digest too. v1 rejected rather than silently treated equally strong.

Does not hash node_modules, ignored config/secrets or whole OS/toolchain; no authentication/signature, race-proof snapshot or proof of dependency integrity. Hash is content comparison only. Reports always trusted=false, executionEnabled=false, Java/Next/deploy unverified. Transient edit-and-revert during checks can escape before/after checks. Review trusted checkout assumptions and do not hash private secrets in tracked scope.

Report saved outside repo by explicit operator redirect. Clean checkout run after local commit verifies selected tests with clean before/after observation; published verified bot SHA differs from local commit, so report becomes stale for another revision even with same content. Never reuse as proof for production.

Tests cover digest mismatch and existing envelope/claim/staleness boundaries; actual clean revision run performed separately. Full repo build/CI/Preview/JVM unverified. No dependency/config/workflow/deploy/payment changes. Human review required; rollback restores v1 inspector/report behavior. Digital computer CLI uses same inspector; browser ingestion remains deferred.
