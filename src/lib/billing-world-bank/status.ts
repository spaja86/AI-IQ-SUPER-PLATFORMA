/** Public capability description: never includes private ledger rows or credentials. */
export function billingWorldBankCapabilities() {
  return {
    environment: 'development-test' as const,
    paymentsEnabled: false as const,
    transfersEnabled: false as const,
    settlementVerified: false as const,
    productionReady: false as const,
    integrations: {
      spajaBillingToWorldBank: { status: 'implemented_test_only', source: 'synthetic-spaja-billing-events',
        endpoint: '/api/dev/spaja-billing/world-bank', evidence: 'docs/SPAJA-BILLING-WORLD-BANK-TEST.md' },
      stripeWebhook: { status: 'not_connected_to_test_ledger', sandboxVerified: false },
      supabaseLedger: { status: 'not_connected', migrationsApplied: false },
      bankSettlement: { status: 'not_integrated', verified: false },
    },
  };
}
