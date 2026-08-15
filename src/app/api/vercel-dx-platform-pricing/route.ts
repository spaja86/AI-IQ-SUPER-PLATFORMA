import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { VERCEL_DX_PLATFORM_PRICING } from '@/lib/billing/vercel-dx-platform-pricing';
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
  return NextResponse.json({
    status: 'ok',
    route: '/api/vercel-dx-platform-pricing',
    verzija: APP_VERSION,
    pricing: VERCEL_DX_PLATFORM_PRICING,
    subscriptionPortfolio: {
      provider: 'Vercel',
      komercijalniTokovi: [
        { id: 'privreda', naziv: 'Privreda', cilj: 'Firme, preduzetnici, agencije i timovi.' },
        { id: 'gradjanstvo', naziv: 'Građanstvo', cilj: 'Fizička lica, individualni kreatori i freelance korisnici.' },
      ],
      formalPackages: getVendorFormalPackages('Vercel'),
      statusModel: VENDOR_SUBSCRIPTION_STATUS_MODEL,
      activationRules: VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
      legalAndTaxRules: VENDOR_SUBSCRIPTION_LEGAL_AND_TAX_RULES,
      finops: VENDOR_SUBSCRIPTION_FINOPS_FRAMEWORK,
      intakeFields: VENDOR_SUBSCRIPTION_INTAKE_FIELDS,
      procurement: VENDOR_SUBSCRIPTION_PROCUREMENT_FLOWS.find((flow) => flow.provider === 'Vercel'),
      auditPackage: VENDOR_SUBSCRIPTION_AUDIT_PACKAGE,
      goLiveSequence: VENDOR_SUBSCRIPTION_GO_LIVE_SEQUENCE,
      operationalModel: {
        providerRole: VENDOR_SUBSCRIPTION_OPERATIONAL_MODEL.vercel,
        splitNote: VENDOR_SUBSCRIPTION_OPERATIONAL_MODEL.github,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
