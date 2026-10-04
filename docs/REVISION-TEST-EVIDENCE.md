# Revision-bound local check report

User approved after #1331. New local evidence CLI runs fixed approved tests and reads Git HEAD/status before/after; timestamps, Node version and original check evidence retained. Dirty/untracked source or changed revision means sourceStable=false. Only clean unchanged HEAD can be reported current. No content digest for dirty files; deliberately never claims current verified evidence for dirty checkout. Dependencies/ignored files/toolchain beyond Node version are not cryptographically bound.

Create explicitly: `node scripts/revision-test-evidence.mjs --execute reference-tests > /tmp/report.json`
Inspect read-only: `npm run digitalni-kompjuter -- evidence /tmp/report.json`
Digital computer CLI delegates inspector only, never executes tests from evidence command. Browser catalog unchanged; no report upload/storage/UI integration yet. Write output outside checkout to avoid report itself causing dirty state.

Inspector checks envelope, dates, exact fixed ordered names/statuses/bounded report size, skipped consistency and false Java/Next/deploy flags; compares current revision/dirty state. statuses: stale,reported-passed,reported-failed. EVERY imported report remains trusted=false and executionEnabled=false. JSON can be forged; no signature, approval or trusted green dashboard claim. HEAD/status observations do not prevent transient edits during tests or prove dependency integrity.

Tests: real Git read, synthetic consistent report, dirty/revision stale, untrusted flags and malformed success claims. Actual fixed five tests pass in local dirty development tree; inspector correctly reports stale, not current success. JS syntax/diff checks run. Full repo build/CI/Preview/JVM unverified. No secrets/raw test output exposed, no service deployment/persistent storage/config/workflow changes. Human review before merge. Rollback removes evidence CLI/test/docs and digital computer evidence branch. Next trustworthy revision/dependency digest or signed CI provenance before browser ingestion.
