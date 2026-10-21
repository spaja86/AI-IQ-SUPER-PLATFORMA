/** Descriptive catalog only: no URL, credential, executable handler or activation API. */
export const OMEGA_KINDS = ['control', 'data', 'monitoring'] as const;
export const OMEGA_STATES = ['implemented', 'partial', 'planned'] as const;
export type OmegaKind = (typeof OMEGA_KINDS)[number];
export type OmegaState = (typeof OMEGA_STATES)[number];
export interface OmegaRelation<Id extends string = string> {
  id: string;
  from: Id;
  to: Id;
  kind: OmegaKind;
  state: OmegaState;
  purpose: string;
  contract: {
    trigger: string;
    payload: string;
    result: string;
    failure: string;
  };
  evidence: {
    code: readonly string[];
    tests: readonly string[];
    scope: string;
  };
  activation: { missing: readonly string[]; acceptance: string };
}
export function omegaRelationId(
  from: string,
  to: string,
  kind: string
): string {
  return `omega-${from}-${to}-${kind}`;
}
const record = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object' && !Array.isArray(x);
const text = (x: unknown): x is string =>
  typeof x === 'string' && x.trim().length > 0;
const strings = (x: unknown): x is string[] =>
  Array.isArray(x) && x.every(text);
const repoPath = (x: string) =>
  /^(src|pilot|docs)\/[\w./-]+$/.test(x) && !x.split('/').includes('..');

/** Accept unknown so JSON imports and future edits fail closed, not just TypeScript callers. */
export function validateOmegaCatalog(value: unknown): string[] {
  const errors: string[] = [];
  if (
    !record(value) ||
    !Array.isArray(value.modules) ||
    !Array.isArray(value.links)
  )
    return ['catalog: modules/links must be arrays'];
  if (
    !Number.isSafeInteger(value.referenceConnectionTarget) ||
    Number(value.referenceConnectionTarget) <= 0
  )
    errors.push('catalog: invalid target');
  const modules = new Map<string, string>();
  for (const entry of value.modules) {
    if (
      !record(entry) ||
      !text(entry.id) ||
      !/^[a-z][a-z0-9-]*$/.test(entry.id)
    ) {
      errors.push('module: invalid id');
      continue;
    }
    if (modules.has(entry.id)) errors.push(`module: duplicate ${entry.id}`);
    if (!['local', 'partial', 'planned'].includes(String(entry.state)))
      errors.push(`module: invalid state ${entry.id}`);
    modules.set(entry.id, String(entry.state));
  }
  const ids = new Set<string>(),
    identities = new Set<string>();
  for (const [index, link] of value.links.entries()) {
    const prefix = `link[${index}]`;
    if (!record(link)) {
      errors.push(`${prefix}: invalid relation`);
      continue;
    }
    if (!text(link.id) || ids.has(link.id))
      errors.push(`${prefix}: missing/duplicate id`);
    if (text(link.id)) ids.add(link.id);
    if (!modules.has(String(link.from)) || !modules.has(String(link.to)))
      errors.push(`${prefix}: unknown module reference`);
    if (link.from === link.to) errors.push(`${prefix}: self link`);
    if (!OMEGA_KINDS.includes(link.kind as OmegaKind))
      errors.push(`${prefix}: invalid kind`);
    if (!OMEGA_STATES.includes(link.state as OmegaState))
      errors.push(`${prefix}: invalid state`);
    const identity = JSON.stringify([link.from, link.to, link.kind]);
    if (identities.has(identity))
      errors.push(`${prefix}: duplicate directed relationship`);
    identities.add(identity);
    if (
      link.id !==
      omegaRelationId(String(link.from), String(link.to), String(link.kind))
    )
      errors.push(`${prefix}: noncanonical id`);
    if (!text(link.purpose)) errors.push(`${prefix}: missing purpose`);
    const contract = link.contract;
    if (
      !record(contract) ||
      !['trigger', 'payload', 'result', 'failure'].every((key) =>
        text(contract[key])
      )
    )
      errors.push(`${prefix}: incomplete contract`);
    const evidence = link.evidence;
    if (
      !record(evidence) ||
      !strings(evidence.code) ||
      !strings(evidence.tests) ||
      !text(evidence.scope)
    )
      errors.push(`${prefix}: invalid evidence`);
    else {
      if (![...evidence.code, ...evidence.tests].every(repoPath))
        errors.push(`${prefix}: invalid evidence path`);
      if (
        link.state !== 'planned' &&
        (!evidence.code.length || !evidence.tests.length)
      )
        errors.push(
          `${prefix}: implementation requires code and test evidence`
        );
    }
    const activation = link.activation;
    if (
      !record(activation) ||
      !strings(activation.missing) ||
      !text(activation.acceptance)
    )
      errors.push(`${prefix}: invalid activation criteria`);
    else if (
      link.state === 'implemented'
        ? activation.missing.length !== 0
        : activation.missing.length === 0
    )
      errors.push(`${prefix}: status contradicts missing work`);
    if (
      link.state !== 'planned' &&
      [link.from, link.to].some((id) => modules.get(String(id)) === 'planned')
    )
      errors.push(`${prefix}: implementation references a planned module`);
  }
  return errors;
}

export function summarizeOmegaRelations(
  links: readonly OmegaRelation[],
  target: number
) {
  return {
    described: links.length,
    implemented: links.filter((link) => link.state === 'implemented').length,
    partial: links.filter((link) => link.state === 'partial').length,
    planned: links.filter((link) => link.state === 'planned').length,
    target,
    remainingToDescribe: Math.max(0, target - links.length),
  };
}
