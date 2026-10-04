/** Explicit allowlist: never serialize the legacy financial/identity builder. */
export function buildBankPrototypeSummary() {
  return {
    name: 'AI IQ World Bank',
    environment: 'simulation' as const,
    paymentsEnabled: false as const,
    settlementVerified: false as const,
    accountIssuanceEnabled: false as const,
    cardIssuanceEnabled: false as const,
    invoiceBalance: null,
    notice: 'Prototip. Nema potvrđenog bankovnog salda, izdatih kartica ili izvršenih uplata.',
  };
}

/** Dependency-injected read-only handler: identity is verified by server, not request data. */
export async function readBankSession(
  authorization: string | null,
  verify: (header: string | null) => Promise<{ id: string } | null>,
) {
  if (!authorization?.startsWith('Bearer ') || !authorization.slice(7).trim()) {
    return { status: 401 as const };
  }
  const user = await verify(authorization);
  if (!user) return { status: 401 as const };
  return { status: 200 as const, data: { ...buildBankPrototypeSummary(), userId: user.id } };
}
