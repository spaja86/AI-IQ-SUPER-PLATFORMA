# REAL GUN — Safe Feature Contract (Software/Game Label Only)

## Scope confirmation

`REAL GUN` in this repository is treated strictly as a **software/game feature label**.

- It is **not** a real-weapon design or manufacturing effort.
- Any request that attempts physical weapon construction, optimization, or operational guidance is out of scope and must be rejected.

## Product requirements

| Field | Requirement |
|---|---|
| Purpose | Provide a controlled, non-harmful gameplay/simulation track with strict safety boundaries |
| Target users | Internal developers, QA, and end users of game/simulation surfaces |
| Allowed behavior | Virtual/statistical simulation, balancing, telemetry, fairness checks, educational abstractions |
| Disallowed behavior | Real weapon instructions, ballistic optimization for real-world harm, procurement guidance for weapons |
| Safety/legal constraints | Comply with repository security policy, human review policy, and no-harm boundary; never expose dangerous operational guidance |

## Repository impact map

| Surface | Path(s) | Impact |
|---|---|---|
| Core domain logic | `src/lib/real-gun/**` (new module path for future implementation) | Validation, policy enforcement, domain rules |
| API surface | `src/app/api/real-gun/**` (future) | Request validation, safe erroring, audit metadata |
| UI integration | `src/components/**`, `src/app/**`, `src/lib/sekvence/**` (future) | Safe messaging, user-facing constraints, feature exposure |
| i18n | `src/lib/i18n/index.ts` | Non-harmful labels and warning text |
| Docs | `docs/REAL-GUN.md`, `docs/MULTI-REPO-LINKS.md` | Contract, governance, cross-repo traceability |
| Agent/config workflow | `.agent-config.json`, `.github/workflows/**` (if changed later) | Validation gates, labels, and security checks |

## Feature contract (for implementation)

### Input schema (logical)
- `mode`: `simulation | training | disabled`
- `intent`: short string describing requested simulation action
- `context`: optional metadata (`locale`, `personaId`, `sessionId`)

### Output schema (logical)
- `allowed`: boolean
- `status`: `ok | rejected | review_required`
- `message`: user-facing safe explanation
- `warnings`: string[]
- `audit`: `{ contractVersion, evaluatedAt, ruleHits[] }`

### Validation rules
1. Reject empty or malformed input.
2. Reject dangerous/harmful intent patterns.
3. Reject attempts to obtain real-weapon build/use/optimization details.
4. Allow only non-harmful simulation or educational abstractions.
5. Enforce deterministic error responses with traceable audit metadata.

### Edge cases
- Empty object or invalid JSON → `rejected`.
- Overlong intent payload → `rejected`.
- Unknown mode value → `rejected`.
- Ambiguous intent → `review_required`.
- Missing context → allowed only if rules pass and no elevated risk flags.

### Performance and audit targets
- Evaluation latency target: `<= 50ms` per request.
- API response target: `<= 200ms`.
- Audit coverage: `100%` of requests produce a rule-evaluation record.

## Implementation slices

1. **Core logic**: add safe intent classifier + validation guardrails.
2. **API layer**: expose guarded endpoint(s) returning structured safe responses.
3. **UI layer**: display clear non-harmful scope and rejection reasons.
4. **Docs/cross-repo**: keep this contract and linked-repo references synchronized.

## Verification plan

- Unit tests for validation and edge cases (`allowed`, `rejected`, `review_required`).
- API integration tests for success/failure envelopes and status codes.
- Existing repo quality gates:
  - `npm run lint`
  - `npm test`
  - `npm run test:smoke`
  - `npm run build`
- Security checks:
  - secret scanning on changed files
  - dependency/security review via existing workflows

## Release controls

- PR must include:
  - Linked Issue / change driver
  - Cross-repo impact statement
  - Validation evidence
  - Rollout and rollback notes
- Required labels when applicable:
  - `security:needs-review` for sensitive logic
  - `agent:config-change` if workflow/config files are modified
- Required reviewers:
  - At least one human reviewer
  - Security reviewer when risk profile is elevated

### Rollback path
1. Revert feature-flag exposure or endpoint activation.
2. Revert to last stable commit.
3. Record rollback reason and KPI impact in PR/issue trail.

## Cross-repo status

- Current status: **No linked repo change required**.
- If future linked behavior is introduced, add bidirectional reference in `docs/MULTI-REPO-LINKS.md`:
  - `AI-IQ-SUPER-PLATFORMA#REAL-GUN -> IO-OPENUI-AO#<follow-up issue>`
