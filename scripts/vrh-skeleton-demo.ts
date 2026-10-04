import { SKELETON_DEMO, validateSkeletonProposal, VRH_LAYER_PROPOSAL } from '../src/lib/extrimli/vrh-skeleton-proposal';
// Synthetic fixtures are explicitly trusted only for this offline demonstration.
const evidence = new Set(['synthetic-input-test', 'synthetic-rotation-test']);
console.log(JSON.stringify({ mode: 'offline-synthetic-dry-run', layers: VRH_LAYER_PROPOSAL, proposal: SKELETON_DEMO, decision: validateSkeletonProposal(SKELETON_DEMO, evidence) }, null, 2));
