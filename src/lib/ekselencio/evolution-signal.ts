// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Evolution Signal
// Kompanija SPAJA — Digitalna Industrija

// ─── Evolution signal: slope of last 5 history values ────────────────────────
// Returns a value in [-1, +1] representing the trajectory direction.

export function computeEvolutionSignal(historyVector?: number[]): number {
  if (!Array.isArray(historyVector) || historyVector.length < 2) return 0;

  // Take last 5 finite values
  const finite = historyVector.filter((v) => Number.isFinite(v)).slice(-5);
  if (finite.length < 2) return 0;

  const n = finite.length;
  const xMean = (n - 1) / 2;
  const yMean = finite.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const dx = i - xMean;
    numerator += dx * (finite[i] - yMean);
    denominator += dx * dx;
  }

  if (denominator === 0) return 0;

  const slope = numerator / denominator;

  // Normalise: max possible slope when range is 0–100 over 5 steps ≈ 25/step
  const normalised = slope / 25;
  return Math.max(-1, Math.min(1, Math.round(normalised * 1000) / 1000));
}
