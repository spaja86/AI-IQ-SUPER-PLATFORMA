export interface VercelDxBillableResource {
  resource: string;
  included: string;
  price: string;
}

export interface VercelProAddonEnablementStep {
  title: string;
  description: string;
}

export interface VercelDxPlatformPricingContent {
  version: string;
  enterprisePricingNote: string;
  proPlanAddonsIntro: string;
  proPlanAddonsSteps: VercelProAddonEnablementStep[];
  regionalPricing: {
    description: string;
    link: string;
  };
  dxPlatformIntro: string;
  dxPlatformInvoiceInfo: string;
  billableResources: VercelDxBillableResource[];
  salesCta: {
    title: string;
    description: string;
    scheduleCallUrl: string;
    contactSalesUrl: string;
  };
}

export const VERCEL_DX_PLATFORM_PRICING: VercelDxPlatformPricingContent = {
  version: '2026-06-vercel-dx-platform-v1',
  enterprisePricingNote: 'For Enterprise pricing, contact our sales team.',
  proPlanAddonsIntro: 'To enable Pro plan add-ons on Vercel:',
  proPlanAddonsSteps: [
    {
      title: 'Open Vercel dashboard',
      description: 'Visit the Vercel dashboard and select your team from the team switcher.',
    },
    {
      title: 'Go to Billing settings',
      description: 'Open Settings in the sidebar and navigate to Billing.',
    },
    {
      title: 'Enable the add-on',
      description: "In the Add-Ons section, find the add-on you'd like to add and switch the toggle to Enabled.",
    },
    {
      title: 'Configure add-on',
      description: 'Configure the selected add-on as necessary for your team or project.',
    },
  ],
  regionalPricing: {
    description: 'See the regional pricing page for Managed Infrastructure pricing across different regions.',
    link: 'https://vercel.com/docs/pricing/managed-infrastructure/regional-pricing',
  },
  dxPlatformIntro:
    "Vercel's Developer Experience Platform (DX Platform) offers a monthly billed suite of tools and services focused on building, deploying, and optimizing web applications.",
  dxPlatformInvoiceInfo:
    'Most DX Platform resources are billed at a fixed monthly rate. Observability Plus uses usage-based pricing with no base fee.',
  billableResources: [
    { resource: 'Team seats', included: 'N/A', price: '$20 / month per additional paid seat' },
    { resource: 'Preview Deployment Suffix', included: 'Pro add-on', price: '$100 / month' },
    { resource: 'SAML Single Sign-On', included: 'Pro add-on', price: '$300 / month' },
    { resource: 'HIPAA BAA', included: 'Pro add-on', price: '$350 / month' },
    { resource: 'Flags Explorer', included: 'Pro add-on', price: '$250.00 / month' },
    { resource: 'Web Analytics Plus', included: 'Pro add-on', price: '$10 / month' },
    { resource: 'Speed Insights', included: 'Pro add-on', price: '$10 / month per project' },
  ],
  salesCta: {
    title: 'Want to talk to our team?',
    description: 'Schedule a call to learn more about Enterprise on Vercel.',
    scheduleCallUrl: 'https://vercel.com/contact/sales',
    contactSalesUrl: 'https://vercel.com/contact/sales',
  },
};
