import { createAiiqBuildPlan, AIIQ_BUILD_PLAN_EXAMPLE } from '../src/lib/ai-iq-programski-jezik/build-plan';
if (process.argv.slice(2).length) { console.error('Fixed read-only example only; no commands accepted.'); process.exitCode = 1; }
else console.log(JSON.stringify(createAiiqBuildPlan(AIIQ_BUILD_PLAN_EXAMPLE), null, 2));
