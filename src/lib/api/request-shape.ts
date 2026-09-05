export function validateRequestShape(
  candidate: Record<string, unknown>,
  config: {
    requiredStringFields?: readonly string[];
    requiredFiniteNumberFields?: readonly string[];
  },
): string | null {
  const { requiredStringFields = [], requiredFiniteNumberFields = [] } = config;

  for (const field of requiredStringFields) {
    const value = candidate[field];
    if (value === undefined || value === null) return `${field} is required (string)`;
    if (typeof value !== 'string') return `${field} must be a string`;
    if (value.trim() === '') return `${field} must be a non-empty string`;
  }

  for (const field of requiredFiniteNumberFields) {
    const value = candidate[field];
    if (value === undefined || value === null) return `${field} is required (number)`;
    if (typeof value !== 'number') return `${field} must be a number`;
    if (!Number.isFinite(value)) return `${field} must be a finite number`;
  }

  return null;
}
