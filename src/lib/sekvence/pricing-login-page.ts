import type { Sekvenca } from '@/lib/types';
import { BILLING_UPGRADE_DISCLOSURE } from '@/lib/billing/upgrade-disclosure';
import { VERCEL_DX_PLATFORM_PRICING } from '@/lib/billing/vercel-dx-platform-pricing';

export const pricingLoginSekvence: Sekvenca[] = [
  {
    id: 'pricing-login-hero',
    tip: 'hero',
    naslov: '💰 Pricing & Login',
    podnaslov: 'SPAJA Pricing & Login — Planovi, registracija i pristup platformi',
    ikona: '💰',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Pricing & Login sistem nudi fleksibilne planove pretplate, visestruke metode prijave i jednostavan proces registracije za sve korisnike platforme.',
      dugmad: [
        { tekst: 'Pogledaj planove', href: '/pricing' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pricing-login-statistika',
    tip: 'statistika',
    naslov: '📊 Pricing & Login u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Planova', vrednost: '5', ikona: '📦' },
        { naziv: 'Login metoda', vrednost: '4', ikona: '🔑' },
        { naziv: 'Dozvola', vrednost: '12', ikona: '🛡️' },
        { naziv: 'Koraka registracije', vrednost: '5', ikona: '📝' },
      ],
    },
  },
  {
    id: 'pricing-login-kartice',
    tip: 'kartice',
    naslov: '💳 Planovi pretplate',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'Starter', opis: 'Osnovni plan za pojedince i pocetnike', ikona: '🌱', oznake: ['Besplatno', 'Osnovne funkcije', '1 korisnik'] },
        { naslov: 'Basic', opis: 'Plan za male timove sa prosirenim mogucnostima', ikona: '⭐', oznake: ['$9/mesec', 'API pristup', '5 korisnika'] },
        { naslov: 'Pro', opis: 'Profesionalni plan sa naprednim alatima', ikona: '🚀', oznake: ['$20/mesec (upgrade tok)', 'Prioritetna podrska', '25 korisnika'] },
        { naslov: 'Enterprise', opis: 'Korporativni plan sa punom podrskom', ikona: '🏢', oznake: ['Enterprise cena: kontaktirajte sales tim', 'SLA garancija', 'Custom seat model'] },
        { naslov: 'Unlimited', opis: 'Neogranicen pristup svim funkcijama', ikona: '♾️', oznake: ['$199/mesec', 'Sve funkcije', 'Neograniceno'] },
      ],
    },
  },
  {
    id: 'pricing-login-vercel-enterprise-note',
    tip: 'tekst',
    naslov: '🏢 Vercel Enterprise pricing',
    redosled: 4,
    podaci: {
      sadrzaj: VERCEL_DX_PLATFORM_PRICING.enterprisePricingNote,
      istaknuteStavke: [
        VERCEL_DX_PLATFORM_PRICING.dxPlatformIntro,
        VERCEL_DX_PLATFORM_PRICING.dxPlatformInvoiceInfo,
      ],
    },
  },
  {
    id: 'pricing-login-vercel-pro-addons-steps',
    tip: 'lista',
    naslov: '🧩 Pro plan add-ons — enablement steps',
    redosled: 5,
    podaci: {
      stavke: VERCEL_DX_PLATFORM_PRICING.proPlanAddonsSteps.map((step, index) => ({
        naslov: `${index + 1}. ${step.title}`,
        opis: step.description,
        ikona: '✅',
      })),
    },
  },
  {
    id: 'pricing-login-vercel-dx-platform-pricing-table',
    tip: 'tabela',
    naslov: '📊 DX Platform pricing (Pro plan billable resources)',
    podnaslov: 'Most resources are fixed monthly fees; Observability Plus is usage-based with no base fee.',
    redosled: 6,
    podaci: {
      zaglavlje: ['Resource', 'Included', 'Price'],
      redovi: VERCEL_DX_PLATFORM_PRICING.billableResources.map((resource) => [
        resource.resource,
        resource.included,
        resource.price,
      ]),
    },
  },
  {
    id: 'pricing-login-vercel-regional-pricing-and-sales',
    tip: 'cta',
    naslov: '📍 Regional pricing & sales',
    redosled: 7,
    podaci: {
      opis: `${VERCEL_DX_PLATFORM_PRICING.regionalPricing.description}\n${VERCEL_DX_PLATFORM_PRICING.salesCta.description}`,
      dugmad: [
        { tekst: 'Regional pricing page', href: VERCEL_DX_PLATFORM_PRICING.regionalPricing.link, stil: 'sekundarno' },
        { tekst: 'Schedule a call', href: VERCEL_DX_PLATFORM_PRICING.salesCta.scheduleCallUrl },
      ],
    },
  },
  {
    id: 'pricing-login-upgrade-summary',
    tip: 'tabela',
    naslov: '🧾 Internal SPAJA Upgrade Summary — Product / Cost',
    podnaslov: 'Kompanijski billing zahtev za interni upgrade tok',
    redosled: 8,
    podaci: {
      zaglavlje: ['Product', 'Cost'],
      redovi: [
        ...BILLING_UPGRADE_DISCLOSURE.lineItems.map((item) => [item.label, `$${item.costUsd}`]),
        ['Total', `$${BILLING_UPGRADE_DISCLOSURE.totalUsd} / month`],
      ],
    },
  },
  {
    id: 'pricing-login-upgrade-disclosure',
    tip: 'tekst',
    naslov: '⚖️ Internal SPAJA Upgrade Billing Disclosure',
    redosled: 9,
    podaci: {
      sadrzaj: `${BILLING_UPGRADE_DISCLOSURE.legalDisclosure}\n\n${BILLING_UPGRADE_DISCLOSURE.billingThresholdPolicy}`,
      istaknuteStavke: [
        `Internal product summary version: ${BILLING_UPGRADE_DISCLOSURE.version}`,
        'Internal kompanijski billing dispatch: sales@spaja.rs + billing@spaja.rs',
        'Primarni owner i account podaci se validiraju na backend dispatch sloju',
      ],
    },
  },
  {
    id: 'pricing-login-tekst',
    tip: 'tekst',
    naslov: 'O registraciji i pristupu',
    redosled: 10,
    podaci: {
      sadrzaj: 'SPAJA platforma nudi jednostavan proces registracije sa viseslojnom autentifikacijom. Korisnici mogu pristupiti putem email-a, Google naloga, GitHub-a ili telefona. Svaki plan ukljucuje razlicite nivoe dozvola i pristupa funkcijama.',
      istaknuteStavke: [
        'Registracija u 5 jednostavnih koraka',
        'Visestruke metode prijave (Email, Google, GitHub, Telefon)',
        'Fleksibilni planovi od besplatnog do neogranicenog',
        'Granularne dozvole po nivou pretplate',
      ],
    },
  },
  {
    id: 'pricing-login-cta',
    tip: 'cta',
    naslov: '🚀 Zapocnite odmah',
    podnaslov: 'Kreirajte besplatan nalog i isprobajte SpajaPro AI',
    redosled: 11,
    podaci: {
      dugmad: [
        { tekst: 'Registruj se besplatno', href: '/registracija' },
        { tekst: 'Prijavi se', href: '/login', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pricing-login-login',
    tip: 'login',
    naslov: '🔐 Prijava',
    podnaslov: 'Prijavite se na svoj nalog',
    redosled: 12,
    podaci: {
      opis: 'Unesite email i lozinku za pristup platformi.',
      metode: [
        { naziv: 'Google', ikona: '🌐', metod: 'google' },
        { naziv: 'GitHub', ikona: '🐙', metod: 'github' },
      ],
    },
  },
];
