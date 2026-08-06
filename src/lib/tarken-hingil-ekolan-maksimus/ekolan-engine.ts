// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS — Ekolan Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Ecological/environmental awareness layer:
// monitors system health, resource allocation, entropy signals.

export interface EkolanSystemState {
  healthScore: number;       // 0–100
  entropyLevel: number;      // 0.0–1.0 (0 = stable, 1 = chaotic)
  resourceUtilization: number; // 0.0–1.0
  anomalijaDetektovana: boolean;
  dijagnostikaLog: string[];
}

/**
 * Evaluira stanje sistema i detektuje anomalije.
 * U produkciji bi primao live sistemske metrike.
 */
export function evaluateSystemState(): EkolanSystemState {
  // Simulirani stabilni sistem — u produkciji: live metrike
  const healthScore = 92;
  const entropyLevel = 0.08;
  const resourceUtilization = 0.45;
  const anomalijaDetektovana = healthScore < 60 || entropyLevel > 0.7;
  const dijagnostikaLog: string[] = [];

  if (anomalijaDetektovana) {
    dijagnostikaLog.push(`Anomalija detektovana: health=${healthScore}, entropy=${entropyLevel}`);
  }

  if (resourceUtilization > 0.85) {
    dijagnostikaLog.push(`Visoka iskorišćenost resursa: ${(resourceUtilization * 100).toFixed(1)}%`);
  }

  if (dijagnostikaLog.length === 0) {
    dijagnostikaLog.push('Sistem stabilan — svi parametri u normalnom opsegu.');
  }

  return { healthScore, entropyLevel, resourceUtilization, anomalijaDetektovana, dijagnostikaLog };
}

/**
 * Izračunava ecological score na osnovu stanja sistema.
 * Visok score = zdravo, efikasno okruženje.
 */
export function computeEkolanScore(state: EkolanSystemState): number {
  const healthComponent = state.healthScore * 0.5;
  const entropyComponent = (1 - state.entropyLevel) * 100 * 0.3;
  const resourceComponent = (1 - state.resourceUtilization) * 100 * 0.2;
  return Math.max(0, Math.min(100, Math.round(healthComponent + entropyComponent + resourceComponent)));
}
