// SpajaUltraOmegaCore -∞Ω+∞ — DIJAGNOZA Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  DijagnozaDifferential,
  DijagnozaHealthReport,
  DijagnozaInput,
  DijagnozaNextStep,
  DijagnozaResult,
  DijagnozaUrgency,
  DijagnozaVitals,
} from './types';
import {
  DIJAGNOZA_API_RESPONSE_MAX_MS,
  DIJAGNOZA_CONTRACT_VERSION,
  DIJAGNOZA_DISCLAIMER,
  DIJAGNOZA_MAX_DURATION_DAYS,
  DIJAGNOZA_MODULE_VERSION,
  DIJAGNOZA_PERFORMANCE_MAX_MS,
  DIJAGNOZA_PERSONA_ID,
} from './types';

// ─── In-memory metrics ───────────────────────────────────────────────────────

let evaluations = 0;
let lastUrgency: DijagnozaUrgency = 'LOW';

// ─── Symptom weight catalog ──────────────────────────────────────────────────

const SYMPTOM_WEIGHTS: Record<string, number> = {
  'bol u grudima': 40,
  'otežano disanje': 35,
  'kratkoća daha': 35,
  'gubitak svesti': 45,
  'paraliza': 45,
  'jak bol u glavi': 30,
  'temperatura': 20,
  'visoka temperatura': 30,
  'kašalj': 15,
  'curenje nosa': 10,
  'grlobolja': 12,
  'umor': 10,
  'muka': 12,
  'povraćanje': 15,
  'dijareja': 13,
  'bol u stomaku': 18,
  'bol u leđima': 15,
  'bol u grudima levo': 42,
  'drhtavica': 12,
  'znojenje': 10,
  'vrtoglavica': 18,
  'osip': 12,
  'otečene žlezde': 14,
  'gubitak apetita': 8,
  'gubitak težine': 15,
  'bol pri mokrenju': 16,
  'krv u urinu': 28,
  'krv u stolici': 30,
  'žutica': 25,
  'otežano gutanje': 18,
  'bol u zglobovima': 12,
  'otok noge': 20,
  'bol u nozi': 15,
};

// ─── Differential catalog ────────────────────────────────────────────────────

interface DifferentialRule {
  name: string;
  icdCode: string;
  keywords: string[];
  baseScore: number;
}

const DIFFERENTIAL_RULES: DifferentialRule[] = [
  {
    name: 'Akutni infarkt miokarda',
    icdCode: 'I21',
    keywords: ['bol u grudima', 'bol u grudima levo', 'kratkoća daha', 'znojenje', 'muka'],
    baseScore: 0,
  },
  {
    name: 'Pneumonija',
    icdCode: 'J18',
    keywords: ['kašalj', 'temperatura', 'visoka temperatura', 'otežano disanje', 'bol u grudima'],
    baseScore: 0,
  },
  {
    name: 'Grip (Influenza)',
    icdCode: 'J11',
    keywords: ['temperatura', 'kašalj', 'umor', 'grlobolja', 'curenje nosa', 'drhtavica', 'bol u leđima'],
    baseScore: 0,
  },
  {
    name: 'Gastroenteritis',
    icdCode: 'K59',
    keywords: ['muka', 'povraćanje', 'dijareja', 'bol u stomaku', 'umor'],
    baseScore: 0,
  },
  {
    name: 'Moždani udar',
    icdCode: 'I64',
    keywords: ['paraliza', 'jak bol u glavi', 'gubitak svesti', 'vrtoglavica', 'otežano gutanje'],
    baseScore: 0,
  },
  {
    name: 'Hipertenzivna kriza',
    icdCode: 'I10',
    keywords: ['jak bol u glavi', 'vrtoglavica', 'bol u grudima', 'kratkoća daha'],
    baseScore: 0,
  },
  {
    name: 'Infekcija urinarnog trakta',
    icdCode: 'N39',
    keywords: ['bol pri mokrenju', 'krv u urinu', 'temperatura', 'bol u leđima'],
    baseScore: 0,
  },
  {
    name: 'Alergijska reakcija',
    icdCode: 'T78',
    keywords: ['osip', 'otežano disanje', 'otok noge', 'kratkoća daha'],
    baseScore: 0,
  },
  {
    name: 'Duboka venska tromboza',
    icdCode: 'I80',
    keywords: ['otok noge', 'bol u nozi', 'crvenilo', 'kratkoća daha'],
    baseScore: 0,
  },
  {
    name: 'Hepatitis',
    icdCode: 'B19',
    keywords: ['žutica', 'umor', 'gubitak apetita', 'bol u stomaku', 'muka'],
    baseScore: 0,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeSymptomsToLower(symptoms: string[]): string[] {
  return symptoms.map((s) => s.trim().toLowerCase());
}

function computeSymptomScore(normalizedSymptoms: string[]): number {
  let total = 0;
  for (const symptom of normalizedSymptoms) {
    total += SYMPTOM_WEIGHTS[symptom] ?? 5;
  }
  return total;
}

function computeVitalsScore(vitals: DijagnozaVitals): { score: number; warnings: string[] } {
  let score = 0;
  const warnings: string[] = [];

  if (vitals.temperatureC !== undefined) {
    if (vitals.temperatureC > 40) {
      score += 35;
      warnings.push('temperatura iznad 40°C — hitno!');
    } else if (vitals.temperatureC > 38.5) {
      score += 20;
      warnings.push('visoka temperatura');
    } else if (vitals.temperatureC > 37.5) {
      score += 10;
    }
  }

  if (vitals.spO2Percent !== undefined) {
    if (vitals.spO2Percent < 90) {
      score += 40;
      warnings.push('SpO2 ispod 90% — kritično!');
    } else if (vitals.spO2Percent < 94) {
      score += 20;
      warnings.push('SpO2 ispod normalnog nivoa');
    }
  }

  if (vitals.pulseBpm !== undefined) {
    if (vitals.pulseBpm > 150 || vitals.pulseBpm < 40) {
      score += 30;
      warnings.push(`puls ${vitals.pulseBpm} BPM — van normalnog opsega`);
    } else if (vitals.pulseBpm > 120 || vitals.pulseBpm < 50) {
      score += 15;
      warnings.push(`puls ${vitals.pulseBpm} BPM — blago van normalnog opsega`);
    }
  }

  if (vitals.systolicMmHg !== undefined) {
    if (vitals.systolicMmHg > 180 || vitals.systolicMmHg < 70) {
      score += 25;
      warnings.push(`sistolni pritisak ${vitals.systolicMmHg} mmHg — van normalnog opsega`);
    }
  }

  if (vitals.diastolicMmHg !== undefined) {
    if (vitals.diastolicMmHg > 120 || vitals.diastolicMmHg < 40) {
      score += 20;
      warnings.push(`dijastolni pritisak ${vitals.diastolicMmHg} mmHg — van normalnog opsega`);
    }
  }

  return { score, warnings };
}

function computeDurationFactor(durationDays: number): number {
  if (durationDays < 3) return 1.0;
  if (durationDays <= 14) return 1.15;
  return 1.3;
}

function resolveUrgency(totalScore: number): DijagnozaUrgency {
  if (totalScore >= 70) return 'CRITICAL';
  if (totalScore >= 45) return 'HIGH';
  if (totalScore >= 20) return 'MEDIUM';
  return 'LOW';
}

function resolveNextStep(urgency: DijagnozaUrgency, durationDays: number): DijagnozaNextStep {
  if (urgency === 'CRITICAL') return 'EMERGENCY';
  if (urgency === 'HIGH') return 'DOCTOR';
  if (urgency === 'MEDIUM') return durationDays > 7 ? 'DOCTOR' : 'MONITORING';
  return 'REST';
}

function resolvePrimaryDiagnosis(urgency: DijagnozaUrgency, symptoms: string[]): string {
  if (urgency === 'CRITICAL' || urgency === 'HIGH') {
    if (symptoms.some((s) => s.includes('bol u grudima') || s.includes('kratkoća'))) {
      return 'Moguć kardiorespiratorna hitnost';
    }
    if (symptoms.some((s) => s.includes('paraliza') || s.includes('svest'))) {
      return 'Moguća neurološka hitnost';
    }
    if (symptoms.some((s) => s.includes('temperatura') || s.includes('kašalj') || s.includes('disanje'))) {
      return 'Respiratorna infekcija / pneumonija';
    }
    return 'Akutno stanje — hitna lekarska procena';
  }
  if (symptoms.some((s) => s.includes('temperatura') || s.includes('kašalj') || s.includes('grlobolja'))) {
    return 'Virusna respiratorna infekcija (grip/prehlada)';
  }
  if (symptoms.some((s) => s.includes('muka') || s.includes('dijareja') || s.includes('povraćanje'))) {
    return 'Gastroenteritis';
  }
  if (symptoms.some((s) => s.includes('umor') || s.includes('bol u leđima'))) {
    return 'Umor / mišićna napetost';
  }
  return 'Nespecifične tegobe — praćenje';
}

function computeDifferentials(normalizedSymptoms: string[]): DijagnozaDifferential[] {
  const scored = DIFFERENTIAL_RULES.map((rule) => {
    const matchCount = rule.keywords.filter((kw) => normalizedSymptoms.includes(kw)).length;
    const probability = matchCount === 0 ? 0 : Math.min(1, matchCount / rule.keywords.length + 0.05 * matchCount);
    return { name: rule.name, icdCode: rule.icdCode, probability };
  });

  return scored
    .filter((d) => d.probability > 0)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5)
    .map((d) => ({
      name: d.name,
      probability: Math.round(d.probability * 100) / 100,
      icdCode: d.icdCode,
    }));
}

function validateVitals(vitals: DijagnozaVitals): string | null {
  const { temperatureC, pulseBpm, systolicMmHg, diastolicMmHg, spO2Percent } = vitals;

  if (temperatureC !== undefined) {
    if (!Number.isFinite(temperatureC) || temperatureC < 30 || temperatureC > 45) {
      return 'temperatureC must be within 30..45°C';
    }
  }
  if (pulseBpm !== undefined) {
    if (!Number.isFinite(pulseBpm) || pulseBpm < 0 || pulseBpm > 300) {
      return 'pulseBpm must be within 0..300';
    }
  }
  if (systolicMmHg !== undefined) {
    if (!Number.isFinite(systolicMmHg) || systolicMmHg < 0 || systolicMmHg > 300) {
      return 'systolicMmHg must be within 0..300';
    }
  }
  if (diastolicMmHg !== undefined) {
    if (!Number.isFinite(diastolicMmHg) || diastolicMmHg < 0 || diastolicMmHg > 300) {
      return 'diastolicMmHg must be within 0..300';
    }
  }
  if (spO2Percent !== undefined) {
    if (!Number.isFinite(spO2Percent) || spO2Percent < 0 || spO2Percent > 100) {
      return 'spO2Percent must be within 0..100';
    }
  }
  return null;
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): DijagnozaResult {
  return {
    referenceId: referenceId ?? 'n/a',
    patientId: 'unknown',
    primaryDiagnosis: 'Nevalidni ulazni podaci',
    differentials: [],
    urgency: 'LOW',
    nextStep: 'REST',
    warnings: [warning],
    disclaimer: DIJAGNOZA_DISCLAIMER,
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function evaluateDijagnoza(input: DijagnozaInput): DijagnozaResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!input.profile || typeof input.profile !== 'object') {
    return invalidResult(input.referenceId, 'profile is required', start);
  }

  if (!Array.isArray(input.symptoms) || input.symptoms.length === 0) {
    return invalidResult(input.referenceId, 'symptoms must be a non-empty array', start);
  }

  if (!Number.isFinite(input.durationDays) || input.durationDays < 0) {
    return invalidResult(input.referenceId, 'durationDays must be a non-negative finite number', start);
  }

  if (input.durationDays > DIJAGNOZA_MAX_DURATION_DAYS) {
    return invalidResult(
      input.referenceId,
      `durationDays must not exceed ${DIJAGNOZA_MAX_DURATION_DAYS}`,
      start,
    );
  }

  const vitalsWarnings: string[] = [];
  let vitalsScore = 0;

  if (input.vitals) {
    const vitalsError = validateVitals(input.vitals);
    if (vitalsError) return invalidResult(input.referenceId, vitalsError, start);
    const vitalsResult = computeVitalsScore(input.vitals);
    vitalsScore = vitalsResult.score;
    vitalsWarnings.push(...vitalsResult.warnings);
  }

  const normalizedSymptoms = normalizeSymptomsToLower(input.symptoms);
  const symptomScore = computeSymptomScore(normalizedSymptoms);
  const durationFactor = computeDurationFactor(input.durationDays);
  const totalScore = Math.round((symptomScore + vitalsScore) * durationFactor);

  const urgency = resolveUrgency(totalScore);
  const nextStep = resolveNextStep(urgency, input.durationDays);
  const primaryDiagnosis = resolvePrimaryDiagnosis(urgency, normalizedSymptoms);
  const differentials = computeDifferentials(normalizedSymptoms);

  const warnings: string[] = [...vitalsWarnings];
  if (input.durationDays > 14) {
    warnings.push('tegobe traju duže od 2 nedelje — konsultujte lekara');
  }

  evaluations += 1;
  lastUrgency = urgency;

  return {
    referenceId: input.referenceId ?? 'n/a',
    patientId: input.profile.patientId?.trim() || 'anonymous-patient',
    primaryDiagnosis,
    differentials,
    urgency,
    nextStep,
    warnings,
    disclaimer: DIJAGNOZA_DISCLAIMER,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getDijagnozaHealthReport(): DijagnozaHealthReport {
  return {
    personaId: DIJAGNOZA_PERSONA_ID,
    contractVersion: DIJAGNOZA_CONTRACT_VERSION,
    moduleVersion: DIJAGNOZA_MODULE_VERSION,
    evaluations,
    lastUrgency,
    performanceMaxMs: DIJAGNOZA_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DIJAGNOZA_API_RESPONSE_MAX_MS,
  };
}

export function _resetDijagnozaMetrics(): void {
  evaluations = 0;
  lastUrgency = 'LOW';
}
