export type PetljaKind =
  | 'FOR PETLJA'
  | 'ITCH PETLJA'
  | 'UR PELJA'
  | 'NIK PETLJA'
  | 'DOR PETLJA'
  | 'EXE PETLJA'
  | 'KUR PETLJA'
  | 'DAR PETLJA'
  | 'YU PETLJA'
  | 'ZAR PETLJA'
  | 'DER PETLJA'
  | 'GAR PETLJA'
  | 'ZUR PETLJA'
  | 'IZI PETLJA'
  | 'UK PETLJA'
  | 'ZUM PETLJA'
  | 'DURMITOR PETLJA'
  | 'UMBREL PETLJA';

export type PetljaReason = 'completed' | 'max-iterations' | 'time-limit' | 'invalid-input' | 'blocked-status';
export type PetljaStatus = 'MONSTER' | 'DISABLED' | 'ACTIVATED' | 'DEAD';
export type PetljaStatusInput = PetljaStatus | 'DISEBLED' | 'AKTIVEJT' | 'DED';

export interface PetljaInput {
  start?: number;
  end?: number;
  step?: number;
  target?: number;
  sequence?: number[];
  maxIterations?: number;
  maxDurationMs?: number;
  status?: PetljaStatusInput;
}

export interface PetljaTracePoint {
  iteration: number;
  value: number;
  accumulator: number;
}

export interface PetljaStatusTransition {
  from: PetljaStatus;
  to: PetljaStatus;
  reason: string;
  iteration: number;
}

export interface PetljaResult {
  kind: PetljaKind;
  goal: string;
  input: Required<Pick<PetljaInput, 'start' | 'end' | 'step' | 'target' | 'sequence' | 'maxIterations' | 'maxDurationMs' | 'status'>>;
  status: PetljaStatus;
  statusTrail: PetljaStatusTransition[];
  output: number;
  iterations: number;
  completed: boolean;
  reason: PetljaReason;
  warnings: string[];
  durationMs: number;
  trace: PetljaTracePoint[];
}

export interface PetljaRuntimeGuard {
  canContinue: () => { ok: boolean; reason?: Extract<PetljaReason, 'max-iterations' | 'time-limit'> };
  getIterations: () => number;
  getDurationMs: () => number;
  tick: () => void;
}

export const PETLJA_CONTRACT_VERSION = '1.0.0';
export const PETLJA_DEFAULT_MAX_ITERATIONS = 10_000;
export const PETLJA_DEFAULT_MAX_DURATION_MS = 50;
