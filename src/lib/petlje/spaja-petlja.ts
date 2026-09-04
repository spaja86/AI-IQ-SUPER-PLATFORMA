import type {
  PetljaInput,
  PetljaKind,
  PetljaResult,
  SpajaImportTarget,
  SpajaSegmentConfig,
  SpajaSegmentKind,
  SpajaTransferField,
  SpajaTransferPolicy,
} from './types';
import {
  baseResult,
  blockedPetljaResult,
  buildGuard,
  createStatusTransition,
  finalizeResult,
  invalidPetljaResult,
  normalizeInput,
  resolveTerminalStatus,
  validateFiniteNumber,
  validateSequence,
} from './utils';
import { runForPetlja } from './for-petlja';
import { runItchPetlja } from './itch-petlja';
import { runUrPelja } from './ur-pelja';
import { runNikPetlja } from './nik-petlja';
import { runDorPetlja } from './dor-petlja';
import { runExePetlja } from './exe-petlja';
import { runKurPetlja } from './kur-petlja';
import { runDarPetlja } from './dar-petlja';
import { runYuPetlja } from './yu-petlja';
import { runZarPetlja } from './zar-petlja';
import { runDerPetlja } from './der-petlja';
import { runGarPetlja } from './gar-petlja';
import { runZurPetlja } from './zur-petlja';
import { runIziPetlja } from './izi-petlja';
import { runUkPetlja } from './uk-petlja';
import { runZumPetlja } from './zum-petlja';

const GOAL =
  'Pivotiranje između petlji kroz segmente uz kontrolisan export/import međurezultata.';

const SEGMENT_DEFAULT_LOOPS: Record<SpajaSegmentKind, PetljaKind[]> = {
  RANGE: ['FOR PETLJA', 'NIK PETLJA', 'DOR PETLJA', 'DAR PETLJA', 'GAR PETLJA', 'UK PETLJA', 'ZUM PETLJA'],
  TARGET: ['ITCH PETLJA', 'KUR PETLJA'],
  SEQUENCE: ['UR PELJA', 'EXE PETLJA', 'YU PETLJA', 'ZAR PETLJA', 'DER PETLJA', 'ZUR PETLJA', 'IZI PETLJA'],
};

const SEGMENT_ALLOWED_LOOPS: Record<SpajaSegmentKind, Set<PetljaKind>> = {
  RANGE: new Set(SEGMENT_DEFAULT_LOOPS.RANGE),
  TARGET: new Set(SEGMENT_DEFAULT_LOOPS.TARGET),
  SEQUENCE: new Set(SEGMENT_DEFAULT_LOOPS.SEQUENCE),
};

const RUNNERS: Record<PetljaKind, (input: PetljaInput) => PetljaResult> = {
  'FOR PETLJA': runForPetlja,
  'ITCH PETLJA': runItchPetlja,
  'UR PELJA': runUrPelja,
  'NIK PETLJA': runNikPetlja,
  'DOR PETLJA': runDorPetlja,
  'EXE PETLJA': runExePetlja,
  'KUR PETLJA': runKurPetlja,
  'DAR PETLJA': runDarPetlja,
  'YU PETLJA': runYuPetlja,
  'ZAR PETLJA': runZarPetlja,
  'DER PETLJA': runDerPetlja,
  'GAR PETLJA': runGarPetlja,
  'ZUR PETLJA': runZurPetlja,
  'IZI PETLJA': runIziPetlja,
  'UK PETLJA': runUkPetlja,
  'ZUM PETLJA': runZumPetlja,
  'SPAJA PETLJA': () => {
    throw new Error('SPAJA PETLJA ne može rekurzivno da pozove samu sebe');
  },
  'DURMITOR PETLJA': () => {
    throw new Error('DURMITOR PETLJA nije podržana u SPAJA segmentima');
  },
  'UMBREL PETLJA': () => {
    throw new Error('UMBREL PETLJA nije podržana u SPAJA segmentima');
  },
};

function resolveSegments(input: PetljaInput): SpajaSegmentConfig[] {
  if (Array.isArray(input.spajaSegments) && input.spajaSegments.length > 0) {
    return input.spajaSegments;
  }

  return [
    { segment: 'RANGE', importFromPrevious: false },
    { segment: 'TARGET', importFromPrevious: true },
    { segment: 'SEQUENCE', importFromPrevious: true },
  ];
}

function computeExportValue(part: PetljaResult, fields: SpajaTransferField[]): number | undefined {
  let value = 0;
  for (const field of fields) {
    if (field === 'output') value += Number.isFinite(part.output) ? part.output : 0;
    else if (field === 'iterations') value += part.iterations;
    else if (field === 'warnings-count') value += part.warnings.length;
  }
  return Number.isFinite(value) ? value : undefined;
}

function applyImport(input: PetljaInput, importTarget: SpajaImportTarget, value: number): PetljaInput {
  if (importTarget === 'target') return { ...input, target: value };
  if (importTarget === 'start') return { ...input, start: value };
  if (importTarget === 'end') return { ...input, end: value };
  return {
    ...input,
    sequence: [...(Array.isArray(input.sequence) ? input.sequence : []), value],
  };
}

export function runSpajaPetlja(input: PetljaInput): PetljaResult {
  const normalized = normalizeInput(input);
  const result = baseResult('SPAJA PETLJA', GOAL, normalized);
  let status = result.status;
  const statusTrail = [...result.statusTrail];
  const transferPolicy: SpajaTransferPolicy = input.spajaTransferPolicy ?? 'strict';
  const exportFields: SpajaTransferField[] = input.spajaExportFields?.length ? input.spajaExportFields : ['output'];
  const importTarget: SpajaImportTarget = input.spajaImportTarget ?? 'target';
  const segments = resolveSegments(input);

  const errors = [
    ...validateFiniteNumber('start', normalized.start),
    ...validateFiniteNumber('end', normalized.end),
    ...validateFiniteNumber('step', normalized.step),
    ...validateFiniteNumber('target', normalized.target),
    ...validateSequence(normalized.sequence),
  ];

  if (normalized.maxIterations < 1) errors.push('maxIterations mora biti >= 1');
  if (normalized.maxDurationMs < 0) errors.push('maxDurationMs mora biti >= 0');
  if (!Array.isArray(segments) || segments.length === 0) errors.push('spajaSegments mora sadržati najmanje jedan segment');
  if (!['strict', 'fallback'].includes(transferPolicy)) errors.push('spajaTransferPolicy mora biti strict ili fallback');
  if (!['target', 'start', 'end', 'sequence'].includes(importTarget)) errors.push('spajaImportTarget mora biti target|start|end|sequence');
  if (!Array.isArray(exportFields) || exportFields.length === 0) errors.push('spajaExportFields mora sadržati najmanje jedno polje');

  for (const segment of segments) {
    const allowed = SEGMENT_ALLOWED_LOOPS[segment.segment];
    if (!allowed) {
      errors.push(`nepoznat segment: ${segment.segment}`);
      continue;
    }
    const loops = segment.loops ?? SEGMENT_DEFAULT_LOOPS[segment.segment];
    if (!Array.isArray(loops) || loops.length === 0) {
      errors.push(`segment ${segment.segment} mora imati najmanje jednu petlju`);
      continue;
    }
    for (const loop of loops) {
      if (!allowed.has(loop)) {
        errors.push(`petlja ${loop} nije dozvoljena u segmentu ${segment.segment}`);
      }
    }
  }

  if (errors.length > 0) {
    const transition = createStatusTransition(status, 'DISABLED', 'invalid-input', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return invalidPetljaResult(result, status, statusTrail, errors);
  }

  if (status !== 'ACTIVATED') {
    const transition = createStatusTransition(status, status, 'blocked-by-status', 0);
    status = transition.status;
    statusTrail.push(transition.entry);
    return blockedPetljaResult(result, status, statusTrail);
  }

  const guard = buildGuard(normalized.maxIterations, normalized.maxDurationMs);
  const trace = [];
  const warnings: string[] = [];
  let output = 0;
  let importedValue: number | undefined;
  let workingInput: PetljaInput = {
    ...normalized,
    sequence: [...normalized.sequence],
    status: 'ACTIVATED',
  };

  const startTransition = createStatusTransition(status, 'MONSTER', 'execution-start', guard.getIterations());
  status = startTransition.status;
  statusTrail.push(startTransition.entry);

  for (const segment of segments) {
    const loops = segment.loops ?? SEGMENT_DEFAULT_LOOPS[segment.segment];
    if (segment.importFromPrevious && importedValue !== undefined) {
      workingInput = applyImport(workingInput, importTarget, importedValue);
    }

    for (const loop of loops) {
      const decision = guard.canContinue();
      if (!decision.ok) {
        const terminal = resolveTerminalStatus(decision.reason!);
        const transition = createStatusTransition(status, terminal, `guard-stop:${decision.reason}`, guard.getIterations());
        status = transition.status;
        statusTrail.push(transition.entry);
        return finalizeResult(result, guard, decision.reason!, output, trace, warnings, status, statusTrail);
      }

      guard.tick();
      const part = RUNNERS[loop](workingInput);
      warnings.push(...part.warnings.map((warning) => `[${segment.segment}][${part.kind}] ${warning}`));
      statusTrail.push(
        ...part.statusTrail.map((entry) => ({
          ...entry,
          reason: `[${segment.segment}][${part.kind}] ${entry.reason}`,
        })),
      );

      const safeOutput = Number.isFinite(part.output) ? part.output : 0;
      output += safeOutput;
      trace.push({
        iteration: guard.getIterations(),
        value: safeOutput,
        accumulator: output,
      });

      if (!part.completed) {
        if (transferPolicy === 'strict') {
          const transition = createStatusTransition(status, part.status, `pivot-stop:${part.reason}`, guard.getIterations());
          status = transition.status;
          statusTrail.push(transition.entry);
          return finalizeResult(result, guard, part.reason, output, trace, warnings, status, statusTrail);
        }

        warnings.push(`[${segment.segment}][${part.kind}] fallback skip zbog ${part.reason}`);
        continue;
      }

      const exported = computeExportValue(part, exportFields);
      if (exported !== undefined) {
        importedValue = exported;
        workingInput = applyImport(workingInput, importTarget, importedValue);
      } else if (transferPolicy === 'strict') {
        const transition = createStatusTransition(status, 'DISABLED', 'pivot-export-invalid', guard.getIterations());
        status = transition.status;
        statusTrail.push(transition.entry);
        return finalizeResult(result, guard, 'invalid-input', output, trace, warnings, status, statusTrail);
      } else {
        warnings.push(`[${segment.segment}][${part.kind}] fallback skip zbog nevalidnog exporta`);
      }
    }
  }

  const terminal = resolveTerminalStatus('completed');
  const transition = createStatusTransition(status, terminal, 'completed', guard.getIterations());
  status = transition.status;
  statusTrail.push(transition.entry);
  return finalizeResult(result, guard, 'completed', output, trace, warnings, status, statusTrail);
}
