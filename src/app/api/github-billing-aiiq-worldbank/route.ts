import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  gitHubBillingRacun,
  gitHubBillingUloge,
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubOrgBillingModel,
  gitHubBillingAuditLog,
  gitHubBillingRolloutFaze,
  getGitHubBillingStatistike,
} from '@/lib/github-billing-aiiq-worldbank';
import {
  getVendorFormalPackages,
  VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
  VENDOR_SUBSCRIPTION_AUDIT_PACKAGE,
  VENDOR_SUBSCRIPTION_FINOPS_FRAMEWORK,
  VENDOR_SUBSCRIPTION_GO_LIVE_SEQUENCE,
  VENDOR_SUBSCRIPTION_INTAKE_FIELDS,
  VENDOR_SUBSCRIPTION_LEGAL_AND_TAX_RULES,
  VENDOR_SUBSCRIPTION_OPERATIONAL_MODEL,
  VENDOR_SUBSCRIPTION_PROCUREMENT_FLOWS,
  VENDOR_SUBSCRIPTION_STATUS_MODEL,
} from '@/lib/billing/vendor-subscriptions';

export async function GET() {
  const statistike = getGitHubBillingStatistike();

  return NextResponse.json({
    naziv: 'GitHub Billing — AI IQ World Bank Integracija',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    status: 'aktivan',
    opis: 'Centralizacija svih GitHub plaćanja kroz AI IQ World Bank. GLAVNI ENDŽIN i OMEGA AI upravljaju svim kupovinama za projekte Digitalne Industrije.',
    billingRacun: gitHubBillingRacun,
    orgBillingModel: gitHubOrgBillingModel,
    uloge: gitHubBillingUloge,
    budzet: gitHubBillingBudzet,
    pilotTransakcije: gitHubPilotTransakcije,
    rolloutFaze: gitHubBillingRolloutFaze,
    auditLog: gitHubBillingAuditLog,
    statistike,
    subscriptionPortfolio: {
      provider: 'GitHub',
      komercijalniTokovi: [
        { id: 'privreda', naziv: 'Privreda', cilj: 'Firme, preduzetnici, agencije i timovi.' },
        { id: 'gradjanstvo', naziv: 'Građanstvo', cilj: 'Fizička lica, individualni kreatori i freelance korisnici.' },
      ],
      formalPackages: getVendorFormalPackages('GitHub'),
      statusModel: VENDOR_SUBSCRIPTION_STATUS_MODEL,
      activationRules: VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
      legalAndTaxRules: VENDOR_SUBSCRIPTION_LEGAL_AND_TAX_RULES,
      finops: VENDOR_SUBSCRIPTION_FINOPS_FRAMEWORK,
      intakeFields: VENDOR_SUBSCRIPTION_INTAKE_FIELDS,
      procurement: VENDOR_SUBSCRIPTION_PROCUREMENT_FLOWS.find((flow) => flow.provider === 'GitHub') ?? null,
      auditPackage: VENDOR_SUBSCRIPTION_AUDIT_PACKAGE,
      goLiveSequence: VENDOR_SUBSCRIPTION_GO_LIVE_SEQUENCE,
      operationalModel: {
        providerRole: VENDOR_SUBSCRIPTION_OPERATIONAL_MODEL.github,
        splitNote: VENDOR_SUBSCRIPTION_OPERATIONAL_MODEL.vercel,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
