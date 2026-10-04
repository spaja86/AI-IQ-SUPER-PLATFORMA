/** Offline proposal validator only. No runtime routes, execution or authorization. */
export const VRH_LAYER_PROPOSAL = {
  version: 'proposal-v1',
  epskiNadrazaj: { role: 'coordination-contract', octaveSemanticsVerified: false },
  senzacija: { role: 'design-profile', animationEnabled: false },
  imortal: { role: 'workshop-boundary', restoreImplemented: false },
  rempageKvatrul: { role: 'evidence-backed-link-proposals', executionEnabled: false },
  ownership: { technical: 'EXTREM', approval: 'EXTRONDOL', public: 'SPAJA KOD summary-only' },
} as const;

export interface SkeletonNode { id: string; input: string; output: string; }
export interface SkeletonLink { from: string; to: string; evidenceIds: string[]; }
export interface SkeletonProposal { nodes: SkeletonNode[]; links: SkeletonLink[]; }
export interface ProposalDecision {
  status: 'BLOCKED' | 'REVIEW_REQUIRED';
  reasons: string[];
  executionEnabled: false;
}

/** Evidence IDs must come from a separately verified registry, not caller assertions. */
export function validateSkeletonProposal(value: unknown, verifiedEvidence: ReadonlySet<string>): ProposalDecision {
  const reasons: string[] = [];
  const blocked = (reason: string): ProposalDecision => ({ status: 'BLOCKED', reasons: [reason], executionEnabled: false });
  if (!value || typeof value !== 'object') return blocked('invalid-proposal');
  const proposal = value as Partial<SkeletonProposal>;
  if (!Array.isArray(proposal.nodes) || !Array.isArray(proposal.links) ||
      proposal.nodes.length === 0 || proposal.nodes.length > 100 || proposal.links.length > 200) return blocked('invalid-size');
  const nodes = new Map<string, SkeletonNode>();
  const token = /^[a-z][a-z0-9-]{0,63}$/;
  for (const node of proposal.nodes) {
    if (!node || typeof node !== 'object' || typeof node.id !== 'string' || !token.test(node.id) ||
        typeof node.input !== 'string' || !token.test(node.input) || typeof node.output !== 'string' || !token.test(node.output)) return blocked('invalid-node');
    if (nodes.has(node.id)) return blocked('duplicate-node');
    nodes.set(node.id, node);
  }
  const edges = new Set<string>();
  const adjacency = new Map<string, string[]>();
  for (const link of proposal.links) {
    if (!link || typeof link !== 'object' || typeof link.from !== 'string' || typeof link.to !== 'string' ||
        !Array.isArray(link.evidenceIds) || link.evidenceIds.length === 0 || link.evidenceIds.length > 20 ||
        !link.evidenceIds.every(id => typeof id === 'string' && token.test(id))) return blocked('invalid-link');
    const from = nodes.get(link.from), to = nodes.get(link.to);
    if (!from || !to) return blocked('unknown-node');
    if (from.output !== to.input) reasons.push('type-mismatch');
    if (!link.evidenceIds.every(id => verifiedEvidence.has(id))) reasons.push('unverified-evidence');
    const key = `${link.from}:${link.to}`;
    if (edges.has(key)) reasons.push('duplicate-link');
    edges.add(key);
    adjacency.set(link.from, [...(adjacency.get(link.from) ?? []), link.to]);
  }
  const visiting = new Set<string>(), visited = new Set<string>();
  function cyclic(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    if ((adjacency.get(id) ?? []).some(cyclic)) return true;
    visiting.delete(id); visited.add(id); return false;
  }
  if ([...nodes.keys()].some(cyclic)) reasons.push('cycle');
  if (proposal.links.length === 0) reasons.push('no-links');
  return { status: reasons.length ? 'BLOCKED' : 'REVIEW_REQUIRED', reasons: [...new Set(reasons)].sort(), executionEnabled: false };
}

export const SENZACIJA_DEMO_PROFILE = {
  background: '#111827', foreground: '#ffffff', spacingPx: 16,
  reducedMotion: true, businessLogicChangesAllowed: false,
} as const;

export const SKELETON_DEMO: SkeletonProposal = {
  nodes: [
    { id: 'input', input: 'keyboard', output: 'rotation-command' },
    { id: 'rotation', input: 'rotation-command', output: 'scene-transform' },
    { id: 'cube', input: 'scene-transform', output: 'scene' },
  ],
  links: [
    { from: 'input', to: 'rotation', evidenceIds: ['synthetic-input-test'] },
    { from: 'rotation', to: 'cube', evidenceIds: ['synthetic-rotation-test'] },
  ],
};
