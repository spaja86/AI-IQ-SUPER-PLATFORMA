# VRH language / scene demo

User-approved investigation follow-up. This PR does not replace TypeScript, weaken type checks, or fix all repo build errors.

## Findings
Canonical VRH contract describes bounded function/governance maps. AI IQ compiler parses KEYWORD: value into an AST and serializes JSON; its host implementation remains TypeScript. Two integration-profile calls omitted the required dekoracijeObjektnihPrimesaDeterministicFallbackRequired field. They now read the same readiness.deterministicFallbackRequired source as existing invalid-input paths.

The inspected DimenzijaBadge is a label component, not a renderer. 360D–5760D vocabulary is not proof of stereoscopic output. This demo interprets 360 as a rotation in degrees, not physical dimensions.

## Executable bounded example
Run `npx tsx scripts/language-scene-demo.ts` to execute a strict local demo program into a cube configuration. Run `npx tsx src/tests/lib/language-scene-demo.test.ts` for negative/boundary cases. Open /language-scene-demo to apply the same program to a CSS perspective cube. No network, AI, filesystem, payment, arbitrary code execution, eval or new dependencies. This is a separately named scene-demo dialect, not a claim that the canonical compiler now generates game binaries.

Grammar: exactly one INTENT: CUBE_DEMO, RULE: NO_SECRET ALLOWLIST, ORCHESTRATE: ROTATE_Y <angle>, OUTPUT: SCENE. Angle is finite in [-360,360]; unknown/duplicate operations fail closed.

## Verification limits and next phase
CSS 3D is a browser perspective effect, not stereoscopic VR or WebXR. Browser visual appearance, device support and headset behavior require manual testing. Future VR work needs a target device, renderer/runtime design and measured frame/input performance. Human review required; no production promotion. Rollback removes this standalone demo and reverts only the contract-field fix if a reviewed alternative preserves fallback semantics.

## Recorded checks
- New scene runner boundary/negative tests and CLI sample: pass.
- Targeted ESLint and diff check: pass; isolated strict TypeScript check of scene-demo.ts: pass.
- Full TypeScript diagnostic count decreases from 290 to 288; the two missing-field diagnostics in the language engine are removed. Existing unrelated build blockers remain. Full Next build is not verified.
- Existing language suite: 10 pass, 1 fails (repeat evaluation integration status stability). The same failure reproduces on an untouched archive of base commit 9113b4fc.
- Existing language API suite: 7 pass, 1 fails its 200ms timing threshold (285.4ms observed in local sandbox). This is not a measured production result; timing influenced by runtime load may contribute. No threshold was weakened.
- Browser and headset visual tests not performed. Draft PR only, not release approval.
