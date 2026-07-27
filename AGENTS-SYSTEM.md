# 🤖 OMEGA Agent Management System

## Overview

This document defines the architecture, governance, and lifecycle of autonomous agents in the OMEGA CI/CD pipeline.

**Agents are specialized task runners that automate:**
- Code reviews and validation (ci-bot)
- Deployments and releases (deploy-bot)
- System evolution and diagnostics (evolution-agent)
- Branch management (sync-bot)
- Auditing and compliance (audit-agent)

---

## Core Principles

### 1. **Transparency & Auditability**
- Every agent action is logged and auditable
- Commit messages include agent identifier and decision rationale
- Action audit trail cannot be modified or deleted

### 2. **Hierarchical Approval**
- **Level 1 (Autonomous):** Pre-approved operations (feature branches, auto-merges)
- **Level 2 (Supervised):** Requires human review before execution
- **Level 3 (Manual):** Requires explicit human authorization

### 3. **Security & Isolation**
- Agents operate with minimal required permissions
- Secrets are stored in GitHub Secrets/Vault, never in code
- Each agent has its own authentication context
- No agent-to-agent credential sharing

### 4. **Failure Recovery**
- All operations are reversible where possible
- Rollback procedures documented for each agent
- Failed operations create Issues for manual intervention

---

## Agent Roles & Responsibilities

### 🔍 **ci-bot** — Code Quality & Integration
**Purpose:** Enforce code quality standards, run automated tests, validate builds

| Aspect | Details |
|--------|---------|
| **Trigger** | Every push to `main` or `copilot/*` branches, PR updates |
| **Actions** | TypeScript compilation, ESLint checks, smoke tests |
| **Approval Level** | Autonomous (no human approval needed) |
| **Success Criteria** | All checks pass with 0 errors |
| **On Failure** | Creates Issue with detailed error report, blocks merge |
| **Permissions** | `contents:read`, `checks:write`, `issues:write` |

**Workflow:** `.github/workflows/omega-auto-build.yml`

```yaml
ci-bot Actions:
├─ TypeScript Type Checking
├─ ESLint Linting
└─ Smoke Tests (go-live validation)
```

---

### 🚀 **deploy-bot** — Deployment & Release Management
**Purpose:** Deploy validated code to staging/production, manage releases

| Aspect | Details |
|--------|---------|
| **Trigger** | Manual workflow dispatch, successful PR merge |
| **Actions** | Contract deployment, environment setup, smoke tests post-deploy |
| **Approval Level** | Supervised (requires human trigger + ci-bot validation) |
| **Success Criteria** | Deployment succeeds, post-deploy smoke tests pass |
| **On Failure** | Rolls back deployment, creates critical Issue, notifies team |
| **Permissions** | `contents:read`, `deployments:write`, `environments:read` |

**Workflow:** `.github/workflows/blockchain-deploy.yml`

```yaml
deploy-bot Actions:
├─ Validate previous ci-bot success
├─ Build application
├─ Deploy smart contracts to network
├─ Run post-deployment tests
└─ Update deployment status
```

**Deployment to Networks:**
- **Amoy (test):** Free testing, automated deployments
- **Polygon (production):** Manual approval via `workflow_dispatch` input

---

### 🧬 **evolution-agent** — System Diagnostics & Evolution
**Purpose:** Monitor system health, generate improvement issues, propose changes

| Aspect | Details |
|--------|---------|
| **Trigger** | Every 6 hours (scheduled), manual workflow dispatch |
| **Actions** | Diagnostics, type-check, linting, build validation, issue generation |
| **Approval Level** | Autonomous diagnostic, supervised execution |
| **Success Criteria** | System health ≥75%, issues created with improvements |
| **On Failure** | Reports health score, suggests manual intervention |
| **Permissions** | `contents:read`, `issues:write`, `pull-requests:write` |

**Workflow:** `.github/workflows/omega-evolucija.yml`

```yaml
evolution-agent Actions:
├─ Run system diagnostics
├─ Calculate health score (0-100)
├─ Generate improvement proposals
├─ Create Issues from proposals
└─ Generate dashboard report
```

**Health Score Ranges:**
- `100` = No errors, ready for auto-merge
- `75-99` = Minor issues, can proceed with review
- `50-74` = Significant issues, requires attention
- `25-49` = Critical issues, manual review mandatory
- `0-24` = System failure, emergency intervention required

---

### 🔀 **sync-bot** — Branch Synchronization
**Purpose:** Keep branches synchronized, merge PRs automatically, clean up old branches

| Aspect | Details |
|--------|---------|
| **Trigger** | Push to `copilot/*` branches, scheduled (6-hourly), workflow dispatch |
| **Actions** | Branch sync, auto-merge, cleanup merged branches |
| **Approval Level** | Autonomous (for feature branches), supervised (for main) |
| **Success Criteria** | Branches synchronized, no conflicts, PRs merged |
| **On Failure** | Rolls back merge, creates conflict resolution Issue |
| **Permissions** | `contents:write`, `pull-requests:write` |

**Workflows:**
- `.github/workflows/omega-mega-merge.yml` — Auto-merge all copilot/* branches to main
- `.github/workflows/omega-branch-sync.yml` — Bidirectional sync (branches ↔ main)
- `.github/workflows/omega-auto-merge.yml` — Smart PR merging
- `.github/workflows/omega-branch-cleanup.yml` — Merged branch cleanup

```yaml
sync-bot Operations:
├─ Merge branches → main (Faza 1)
├─ Sync main → branches (Faza 2)
├─ Auto-merge eligible PRs
├─ Delete merged branches
└─ Report sync status
```

---

### 🛡️ **audit-agent** — Compliance & Security
**Purpose:** Monitor agent actions, enforce policies, generate compliance reports

| Aspect | Details |
|--------|---------|
| **Trigger** | Every agent action, scheduled audit (daily), manual request |
| **Actions** | Log verification, policy enforcement, report generation |
| **Approval Level** | Autonomous monitoring |
| **Success Criteria** | All actions audit-logged, policies enforced |
| **On Failure** | Blocks non-compliant operation, escalates to humans |
| **Permissions** | `contents:read`, `issues:write`, `audit_log:read` |

**Auditable Events:**
- Agent authorization and authentication
- Commit signatures and author verification
- Secrets exposure detection
- Merge authorization traces
- Deployment history and rollbacks

---

## Agent Lifecycle

### Phase 1: Design & Review
1. **Define** agent purpose, triggers, and actions
2. **Document** in `AGENTS-SYSTEM.md`
3. **Create** workflow YAML with `# ═══ Agent: {name} ═══` header
4. **Review** with team and security audit

### Phase 2: Development & Testing
1. **Implement** workflow steps
2. **Add** error handling and rollback logic
3. **Test** with `workflow_dispatch` manually
4. **Validate** audit logging (check commit messages)
5. **Dry-run** on test branch (no production impact)

### Phase 3: Deployment & Monitoring
1. **Enable** workflow in `main` branch
2. **Monitor** first 10 executions for errors
3. **Create** runbook for failure scenarios
4. **Document** in AGENTS-SYSTEM.md under "Runbooks"

### Phase 4: Maintenance & Evolution
1. **Review** agent performance monthly
2. **Update** triggers and logic as needed
3. **Refactor** for efficiency improvements
4. **Archive** when no longer needed

---

## Adding a New Agent

### Step 1: Create Workflow YAML
```yaml
name: "🤖 {Agent Name}"

on:
  workflow_dispatch:
  schedule:
    - cron: '0 * * * *'  # Adjust based on agent purpose
  # Add other triggers (push, pull_request, etc.)

permissions:
  contents: read
  # Add minimal required permissions

jobs:
  {agent-name}:
    name: "{Agent Name}"
    runs-on: ubuntu-latest
    steps:
      - name: "Setup"
        uses: actions/checkout@v4
      
      - name: "{Agent Action 1}"
        run: |
          # Implementation here
      
      - name: "Log Action"
        run: |
          git config user.name "{agent-name}"
          git config user.email "{agent}@omega.bot"
          # Log to commit message or issue
```

### Step 2: Define Agent Configuration
Add entry to `.github/agents-config.yml`:
```yaml
agents:
  {agent-name}:
    approval_level: "autonomous|supervised|manual"
    triggers: ["push", "schedule", "workflow_dispatch"]
    permissions:
      contents: "read|write"
      pull_requests: "read|write"
    notification_channels:
      - slack: "#deployments"
      - issues: true
```

### Step 3: Document Agent in AGENTS-SYSTEM.md
Add section with table (see agent examples above)

### Step 4: Test & Monitor
1. Run with `workflow_dispatch` on test branch
2. Verify audit trail in commits/issues
3. Monitor for 1 week before full deployment

---

## Agent Communication & Coordination

### Agent-to-Agent Coordination
Agents coordinate through:
- **Git branches:** `copilot/agent-name` for agent-specific work
- **Issue labels:** `agent:{name}` for agent-owned issues
- **Commit messages:** `[{agent-name}] Action description`

### Example: CI-Bot → Deploy-Bot Pipeline
```
1. Developer pushes to main
2. ci-bot runs (TypeScript, ESLint, tests)
3. If ci-bot passes:
   - Creates PR with label `ready-for-deploy`
   - Triggers sync-bot for auto-merge
4. After merge to main:
   - evolution-agent creates deployment Issue
   - deploy-bot runs (if triggered or scheduled)
5. audit-agent logs all actions
```

---

## Runbooks (Troubleshooting)

### 🚨 CI-Bot Failed (TypeScript Error)
**Symptom:** `error TS2304: Cannot find name`
**Diagnosis:** Missing import or type definition
**Recovery:**
1. Check error in workflow run log
2. Fix type import in source code
3. Push fix, ci-bot will retry automatically

### 🚨 Deploy-Bot Failed (Contract Deployment)
**Symptom:** `Failed to connect to RPC endpoint`
**Diagnosis:** Network connectivity or RPC misconfiguration
**Recovery:**
1. Verify `POLYGON_RPC_URL` in GitHub Secrets
2. Check network status at https://status.polygon.technology/
3. Retry deployment with `workflow_dispatch`

### 🚨 Sync-Bot Merge Conflict
**Symptom:** `CONFLICT (content merge): ...: Merge conflict in ...`
**Diagnosis:** Branch has diverged from main
**Recovery:**
1. Check conflict report in workflow summary
2. Manually resolve on conflicted branch
3. Push fix, sync-bot will retry
4. Or delete branch and recreate from main

### 🚨 Agent Unauthorized (Permission Denied)
**Symptom:** `HttpError 403: Resource not accessible by integration`
**Diagnosis:** Agent token expired or has insufficient permissions
**Recovery:**
1. Check GitHub App permissions in Settings → Integrations
2. Regenerate GITHUB_TOKEN in workflow (use `secrets.GITHUB_TOKEN`)
3. Verify GitHub App has required permissions in manifest

---

## Security & Compliance

### Secrets Management
- **Never** commit secrets to repository
- **Always** use GitHub Secrets or Environment Secrets
- **Rotate** secrets quarterly
- **Audit** secret access in Actions logs

### Audit Trail
All agent actions must include:
```
[agent-name] Action
- What: Description of action performed
- Why: Reason for action (issue #123, auto-sync, etc.)
- Who: Which agent performed it
- When: Timestamp (in commit metadata)
```

### Policy Enforcement
- ✅ Agent actions must be reversible
- ✅ Deployment requires health check > 75%
- ✅ No direct merges to main by humans (use PR + auto-merge)
- ✅ All changes require audit trail
- ✅ Automation/config PRs moraju sadržavati procenu troška i rollback plan

### FinOps & Enterprise Operating Model
- Deploy source of truth: **Vercel Git integration**.
- GitHub Actions služi kao quality-gate sloj (type-check/lint/test), ne kao dupli deploy/build trošak.
- Budget alert pragovi: **50/75/90/100%** mesečnog budžeta.
- Obavezni cost-center/owner podaci za automation i config izmene.
- KPI okvir: cost per deployment, cost per active user, MTTR, build duration, deployment success rate.
- Operativni ritam: mesečni ops review + kvartalni business review (QBR) sa vendor kontaktima.

---

## Monitoring & Dashboards

### Key Metrics
- **Agent Success Rate:** % of successful executions
- **System Health Score:** 0-100 from diagnostics
- **Deployment Frequency:** Deployments per day/week
- **Mean Time to Recovery (MTTR):** Time to fix failures
- **Cost per Deployment:** Combined GitHub + Vercel cost efficiency
- **Cost per Active User:** Unit economics by active usage

### View Dashboard
1. Go to Repository → Actions
2. Filter by workflow (e.g., "🏗️ Omega Build")
3. Check recent runs and logs
4. Subscribe to workflow notifications

---

## FAQ

**Q: Can I manually merge without agents?**
A: No. Agents enforce quality gates. Manual merges bypass protection and reduce visibility.

**Q: What if evolution-agent proposes bad changes?**
A: Review the Issues it creates before auto-merging. You can reject/adjust before deploy.

**Q: How do I disable an agent temporarily?**
A: Disable workflow in `.github/workflows/{agent}.yml` via GitHub UI, or comment out triggers in YAML.

**Q: Can agents commit directly to main?**
A: No. Agents create PRs or branches, then use auto-merge logic with audit trails.

**Q: What's the difference between deploy-bot and evolution-agent?**
A: `deploy-bot` executes deployments (pushing code to production); `evolution-agent` diagnoses system health and proposes improvements via Issues.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-16 | Initial OMEGA agent system documentation |

---

**Last Updated:** 2026-07-16  
**Maintainer:** OMEGA Evolution System  
**Status:** 🟢 Active
