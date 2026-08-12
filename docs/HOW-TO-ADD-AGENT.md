# HOW TO ADD A NEW AGENT — Onboarding Guide

> **Kompanija SPAJA — Digitalna Industrija**
>
> This guide walks you through adding a new domain validator or automation agent to AI-IQ-SUPER-PLATFORMA step by step, using a concrete worked example: adding a fictional `widget-validator-agent`.

---

## Overview

Every agent in this platform consists of four artifacts:

| Artifact | Path | Purpose |
|----------|------|---------|
| AGENTS.md entry | `AGENTS.md` | Human-readable registry and role definition |
| GitHub Actions workflow | `.github/workflows/<agent-name>.yml` | CI/CD automation |
| Agent config entry | `.agent-config.json` | Runtime config referenced by the workflow |
| Tests (if validator) | `src/tests/lib/<domain>.test.ts` | Correctness / KPI assertions |

---

## Step 1 — Define the agent in AGENTS.md

Open `AGENTS.md` and add a new `###` section under **Agent Roles**. Follow the existing pattern:

```markdown
### widget-validator-agent (NEW)
- **Role**: Validation of Widget logic — catalog, pricing, and edge case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/widget/**`, `src/app/api/widget/**`
- **Trigger**: PR with label `widget:logic-change`, push touching `widget` paths
- **Actions**:
  - Runs unit test suite for Widget logic (registry, engine, pricing)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative prices)
  - Checks performance KPI: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies
  - Auto-labels PRs with `widget:validated` or `widget:needs-review`
  - Leaves audit log in PR comment
```

Then add it to the **Registered Agents** table:

```markdown
| widget-validator-agent | Widget Validation | PR, Branch | @spaja86 | 📋 Ready | AI-IQ-SUPER-PLATFORMA (widget paths) |
```

---

## Step 2 — Create the GitHub Actions workflow

For **domain validators**, use the reusable `_validator-template.yml` via `workflow_call`. This gives you lint → typecheck → tests → security-scan → label → audit-log for free.

Create `.github/workflows/widget-validator.yml`:

```yaml
name: 🧩 Widget Validator

on:
  pull_request:
    paths:
      - 'src/lib/widget/**'
      - 'src/app/api/widget/**'
      - 'src/tests/lib/widget.test.ts'
      - '.github/workflows/widget-validator.yml'
    types: [opened, synchronize, reopened, labeled]
  push:
    branches: [main]
    paths:
      - 'src/lib/widget/**'
      - 'src/app/api/widget/**'
  workflow_dispatch:

concurrency:
  group: widget-validator-${{ github.head_ref || github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  validate:
    uses: spaja86/AI-IQ-SUPER-PLATFORMA/.github/workflows/_validator-template.yml@main
    with:
      domain: widget
      lint_paths: >-
        src/lib/widget
        src/app/api/widget
      test_commands: |
        npx tsx src/tests/lib/widget.test.ts
      scan_paths: >-
        src/lib/widget
        src/app/api/widget
      label: widget
      perf_eval_ms: 50
      perf_api_ms: 200
```

> **Note:** If your agent needs custom gates beyond what `_validator-template.yml` offers (e.g. deploy steps, external API calls), write a standalone workflow instead and follow the gate model: lint → test → smoke → predeploy → security.

---

## Step 3 — Add the agent config entry

Open `.agent-config.json` and add your agent under `"agents"`:

```json
"widget-validator-agent": {
  "enabled": true,
  "performanceThresholdMs": 50,
  "apiResponseThresholdMs": 200,
  "testSuite": "src/tests/lib/widget.test.ts",
  "scanPaths": ["src/lib/widget", "src/app/api/widget"]
}
```

---

## Step 4 — Write tests

Create `src/tests/lib/widget.test.ts`. Use the established test harness pattern:

```typescript
import { calculateWidget, WIDGET_PERFORMANCE_MAX_MS } from '../../lib/widget';

let passed = 0, failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void) {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}\n     ${msg}`);
    failed++; failures.push(`${name}: ${msg}`);
  }
}
function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function runTests() {
  // ─── Edge cases (required for all math modules) ───────────────────────
  console.log('\n🔎 [widget] Edge cases');

  await test('NaN input returns invalid result', () => {
    const r = calculateWidget({ price: NaN });
    assert(!r.valid, 'NaN price must be invalid');
  });

  await test('Infinity input returns invalid result', () => {
    const r = calculateWidget({ price: Infinity });
    assert(!r.valid, 'Infinity price must be invalid');
  });

  await test('negative price returns invalid result', () => {
    const r = calculateWidget({ price: -1 });
    assert(!r.valid, 'Negative price must be invalid');
  });

  // ─── Performance ──────────────────────────────────────────────────────
  console.log('\n🔎 [widget] Performance');

  await test(`calculateWidget completes within ${WIDGET_PERFORMANCE_MAX_MS}ms`, () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) calculateWidget({ price: 1000 });
    const avg = (Date.now() - start) / 100;
    assert(avg <= WIDGET_PERFORMANCE_MAX_MS, `avg ${avg.toFixed(2)}ms > ${WIDGET_PERFORMANCE_MAX_MS}ms`);
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) { for (const f of failures) console.error(`  - ${f}`); process.exit(1); }
}

runTests().catch(err => { console.error('Fatal:', err); process.exit(1); });
```

**Required edge cases for every math/calculation module:**
- NaN input → `result.valid === false`
- Infinity input → `result.valid === false`
- Negative quantity/price → `result.valid === false`
- Division by zero scenario (if applicable) → no crash, returns `valid === false`
- Zero input → explicitly tested (valid or invalid, but never NaN output)

---

## Step 5 — Open a PR and get human review

```bash
git checkout -b agent/widget-validator
# ... add all four artifacts ...
git add .
git commit -m "feat: add widget-validator-agent"
git push origin agent/widget-validator
```

In the PR description, include:
1. Link to this guide
2. The agent role table row you added
3. KPI targets (eval ≤ Xms, API ≤ Yms)
4. Downstream impact in `docs/MULTI-REPO-LINKS.md` (if cross-repo sync applies)

**Do not merge without at least one human review.** See Rule 2 in `AGENTS.md`.

---

## Step 6 — After merge: activate in AGENTS.md

Once the PR is merged and workflows are confirmed green, update the agent status in the Registered Agents table from `📋 Ready` to `✅ Active` or `🚀 Active`.

---

## Quality Gate Checklist

Before opening the PR, verify:

- [ ] `AGENTS.md` section and table row added
- [ ] `.github/workflows/<agent>.yml` created, using `_validator-template.yml` where possible
- [ ] `.agent-config.json` entry added
- [ ] `src/tests/lib/<domain>.test.ts` created with NaN/Infinity/negative/zero edge cases
- [ ] `npm run lint` passes for new files
- [ ] `npx tsc --noEmit` passes
- [ ] Tests run and pass locally: `npx tsx src/tests/lib/<domain>.test.ts`
- [ ] No secrets committed (run `npm run test:smoke` or check the secret-scanner workflow)
- [ ] `docs/MULTI-REPO-LINKS.md` updated if this agent syncs with `IO-OPENUI-AO`

---

## Rules summary

See `AGENTS.md` for the full rules. Key points:

1. All agents must leave audit logs in commit messages or PR comments
2. No merge without human review (except `auto-merge: allowed` branches)
3. Never commit secrets — use GitHub Secrets
4. Label PRs with `agent:config-change` when modifying CI/config files
5. All agent commits must be signed (`git commit -S`)

---

## Contact

- **Owner**: @spaja86
- **Email**: team@spaja86.dev
- **Repo**: [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
