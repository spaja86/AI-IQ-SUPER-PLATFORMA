import { createHash } from 'node:crypto';
import { compileAiiqLanguage } from './engine';
import { createAiiqBuildPlan } from './build-plan';
import type { AiiqLanguageCompileResult } from './types';

export function compileAiiqBuildPlan(
  source: string,
  context: { sourceRevision: string; environment: 'local' | 'preview' },
  compiler: typeof compileAiiqLanguage = compileAiiqLanguage,
) {
  if (typeof source !== 'string' || source.length === 0 || source.length > 16384) throw new Error('Invalid source size');
  if (!context || !/^[a-f0-9]{40}$/.test(context.sourceRevision) || !['local', 'preview'].includes(context.environment)) throw new Error('Explicit revision/environment required');
  const provenance = { sourceHash: createHash('sha256').update(source).digest('hex'), sourceRevision: context.sourceRevision, environment: context.environment, revisionVerified: false };
  const result: AiiqLanguageCompileResult = compiler({ source, targetMode: 'DETERMINISTIC_ONLY', strictSecurity: true, featureFlagAiIqLanguage: false });
  const profile = result.integrationProfile;
  const blocked = !result.valid || !result.securityPass || result.status === 'BLOCKED' || result.syntaxScore !== 100 ||
    !profile || profile.unifiedSignalStatus.overall === 'BLOCKED' || profile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired;
  if (blocked) return { status: 'blocked' as const, provenance, compilerStatus: result.status, executionEnabled: false, buildVerified: false, plan: null };
  // Partial parser success must not ignore any source directive or malformed line.
  const lines = source.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length !== result.ast.length || lines.some((line, i) => line !== `${result.ast[i].op}: ${result.ast[i].value}`)) throw new Error('Source/AST exact policy mismatch');
  const plan = createAiiqBuildPlan(result.ast);
  return { status: 'proposed' as const, provenance, compilerStatus: result.status, executionEnabled: false, buildVerified: false, plan };
}
