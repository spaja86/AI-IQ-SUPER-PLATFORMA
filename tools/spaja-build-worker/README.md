# SPAJA development build worker v0.1

This separate development component compiles an approved **declarative page source** into a new static HTML artifact in a restricted Linux child process. It then optionally hands those bytes to the existing local deployment adapter. It does **not** run `next build`, install packages, execute repository scripts, start applications, or make a service publicly available.

The original fixture-only `deploy()` path and its defaults still work. A separately opted-in `deployBuiltArtifact()` accepts successful, SHA-256-verified build evidence for `spaja-build-prototype` in `dev` only. Existing control-plane fields `buildWorkerImplemented`, `executionEnabled`, and `availabilityVerified` stay false: no SPAJA SERVER build service was installed or enabled. PR #1366's registry is independent of this component.

## Run locally

Requirements: reviewed checkout, Node 24 with this repository's locked `tsx` dependency, Linux, trusted system `/usr/bin/python3` (tested with 3.12), and system `libseccomp.so.2` (tested with 2.5.5). The host must permit additional seccomp filters and resource limits. No dependency is downloaded or installed by a build. Missing requirements fail closed. The runtime is an operator-maintained prerequisite, not an artifact supplied by a build request.

```sh
# Plan only, no child build or activation:
node --import tsx tools/spaja-build-worker/demo.ts
# Explicit, temporary local demonstration: build v1/v2, activate, rollback, clean up:
node --import tsx tools/spaja-build-worker/demo.ts --execute-dev
# Regressions and actual kernel restrictions (no skipped security probes):
node --import tsx --test tools/spaja-build-worker/worker.test.ts
/usr/bin/python3 -I tools/spaja-build-worker/sandbox_test.py
# Existing adapter regressions:
node --import tsx src/tests/lib/deployment-provider.test.ts
```

The demo takes no repository URL, shell command, output directory, installer, dependency list, environment values or provider hook. Its approved fixture digest is fixed in reviewed code. `sourceRevision` records checkout provenance, with `checkoutDirty` reported; it does not assert that the source was fetched from that Git revision. The source SHA-256 identifies the exact UTF-8 bytes actually compiled.

## Trust and dependency boundary

`createBuildWorker()` is for trusted local developer code only. `executionEnabled` defaults false. The caller supplies a reviewed source-digest allowlist at construction, never from a remote job. Request keys are exact; unknown fields, other recipes, environments, platform IDs, unapproved source bytes and invalid provenance are rejected before process creation. The only recipe is `static-page-v1`: JSON with schemaVersion 1, title (1–120 characters) and 1–32 text paragraphs (up to 1,024 characters each). Duplicate keys and all extra source fields are rejected. Text is HTML-escaped; output includes a restrictive CSP and has no executable scripts or external assets.

The compiler snapshot must match the SHA-256 pinned in `worker.ts`, and is copied into a private job directory before launch. To change it, review the code and update its pin in the same PR. It uses only Python's standard library plus the system libseccomp ABI. There is no npm/pip install, lifecycle hook, network cache, credential forwarding or package-script execution. A future Next.js recipe needs a separately reviewed offline dependency preparation stage with pinned lockfile/integrities, no install scripts by default, immutable toolchain image/SBOM and independent supply-chain review. It is not enabled by relaxing this recipe.

The parent process, developer account, checkout, system interpreter/library and kernel are trusted. The child loads trusted libraries first, installs restrictions, then reads source. This is a real syscall/resource boundary for a constrained compiler, **not a general multi-tenant sandbox**. It does not protect against a malicious same-UID host process, administrator, compromised interpreter/library or kernel. The local artifact receipt is not a signature or an authentication protocol: never accept it over HTTP or from a different trust domain.

## Enforced limits

| Resource / capability | Limit / behavior |
| --- | --- |
| Source | 16 KiB, exact approved SHA-256 |
| Output | 64 KiB; overflow kills the child |
| Logs | 2 KiB; overflow kills the child; fixed compiler messages, no source echo |
| Wall time | 2 seconds, may be lowered by trusted options, never raised |
| CPU | Hard `RLIMIT_CPU` 2 seconds |
| Address space | Hard `RLIMIT_AS` 128 MiB, not an RSS/cgroup guarantee |
| Files / core dumps | `RLIMIT_FSIZE=0`, `RLIMIT_CORE=0`; child cannot create files |
| Descriptors | `RLIMIT_NOFILE=32`; launcher inherits only stdin/stdout/stderr |
| Child processes | Fork/clone/exec denied by default-deny seccomp; `RLIMIT_NPROC=0` is extra defense |
| Network / host paths | Socket and open/path syscalls denied after runtime initialization |
| Privileges | `no_new_privs`; no privilege-changing syscalls allowed |
| Concurrency / retention | One active job, 20 started jobs per worker session; latest 20 result records |

The seccomp allowlist contains only pipe I/O, in-memory allocation, signal handling, time, random and process-exit primitives. It denies all unlisted syscalls, including `io_uring`, process creation, network, file opens and attempts to change resource limits. No shell is used. Python runs with `-I -S`, a private working directory and a minimal environment containing only `NODE_ENV=development`. There is no unsafe-host fallback.

## Results, integrity and failure

Accepted jobs have random internal IDs and private directories. The parent records timestamps, duration, exit code/signal, bounded compiler messages, source/compiler/artifact SHA-256, status and reason in `result.json`, committed by rename. It writes and rereads the artifact to verify SHA-256. Results rejected before job creation are kept only in the bounded session history. The source and user environment are not written to logs. Audit storage is temporary, not durable infrastructure.

Only `succeeded` results contain artifact bytes and digest. Failed, rejected, timed-out or cancelled jobs cannot be activated through the new adapter entry point. Timeout and AbortSignal cancellation kill the actual child and wait for its close event before completing; disposal also cancels a running job. No automatic retries occur. A caller must explicitly start a new approved job after fixing the cause. Failed artifact/audit writes fail closed and remove publishable output; cleanup errors remain visible as `failed-artifact-cleanup-required`.

The local adapter independently checks provenance, result scope and SHA-256, copies the bytes into its own temporary directory, re-verifies them, and atomically updates its existing active pointer/ledger. A failure leaves the prior active version unchanged. Rollback retains the existing expected-active-ID guard and rejects altered/missing/symlink artifacts. `verified` means a local file was verified, not that a server is running. `availabilityVerified` is always false.

`dispose()` removes only internally generated temporary directories after stopping the child. The demo always disposes; records/artifacts exist only until session disposal. Abrupt parent/host failure can leave directories behind. Crash recovery, global quotas, retention service and a process reaper belong to the future server design.

## Remaining SPAJA SERVER work

1. Review and provision an unprivileged dedicated runner with immutable toolchain, cgroup CPU/memory/PID/disk quotas, job ownership, queue/admission control, timeouts and a crash reaper. Do not expose the current library as a public executor.
2. Add a separately reviewed real Next.js build recipe, offline locked dependencies and a verified artifact contract. Test hostile projects and dependency lifecycle behavior in that stronger isolation boundary.
3. Add authenticated control-plane/worker communication, persistent audit and artifact storage, signed provenance, serving processes, loopback health tests, routing/TLS, explicit promotion and durable rollback. Only measured evidence can change server availability/execution flags.

Rollout: draft PR, local review only; human security review and required repository gates precede any merge. Cost: no new service or paid infrastructure. Rollback: revert these additive worker files and adapter extension; existing fixture/provider behavior remains. No cross-repository runtime change or IO-OPENUI-AO adoption is required.

Reference mechanisms: [Linux seccomp](https://www.man7.org/linux/man-pages/man2/seccomp.2.html), [no_new_privs](https://www.kernel.org/doc/html/latest/userspace-api/no_new_privs.html), [Python resource limits](https://docs.python.org/3/library/resource.html).
