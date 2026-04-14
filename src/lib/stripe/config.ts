// SpajaUltraOmegaCore -∞Ω+∞ — Stripe Konfiguracija
// Kompanija SPAJA — Digitalna Industrija
// Stripe klijent i definicije planova

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY nije postavljen u environment varijablama.');
  }

  _stripe = new Stripe(secretKey, {
    typescript: true,
  });

  return _stripe;
}

// Definicije planova — mapiraju se na Stripe Price ID-jeve
export interface SpajaPlan {
  id: string;
  naziv: string;
  opis: string;
  cenaEur: number;
  mesecno: boolean;
  stripePriceId: string;
  chatLimit: number;
  funkcije: string[];
}

export const PLANOVI: SpajaPlan[] = [
  {
    id: 'starter',
    naziv: 'Starter',
    opis: 'Besplatan plan za pocetnike',
    cenaEur: 0,
    mesecno: true,
    stripePriceId: '', // Besplatan — nema Stripe price
    chatLimit: 10,
    funkcije: [
      'SpajaPro AI — 10 poruka/mesec',
      'Pristup Dashboard-u',
      'Osnovni uvid u ekosistem',
    ],
  },
  {
    id: 'basic',
    naziv: 'Basic',
    opis: 'Plan za pojedince sa prosirenim mogucnostima',
    cenaEur: 9,
    mesecno: true,
    stripePriceId: process.env.STRIPE_PRICE_BASIC ?? '',
    chatLimit: 100,
    funkcije: [
      'SpajaPro AI — 100 poruka/mesec',
      'API pristup',
      'Chat istorija',
      'Email podrska',
    ],
  },
  {
    id: 'pro',
    naziv: 'Pro',
    opis: 'Profesionalni plan sa naprednim alatima',
    cenaEur: 29,
    mesecno: true,
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? '',
    chatLimit: 1000,
    funkcije: [
      'SpajaPro AI — 1.000 poruka/mesec',
      'Prioritetna podrska',
      'Napredna analitika',
      'API pristup bez ogranicenja',
      'Export podataka',
    ],
  },
  {
    id: 'enterprise',
    naziv: 'Enterprise',
    opis: 'Korporativni plan sa punom podrskom',
    cenaEur: 99,
    mesecno: true,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE ?? '',
    chatLimit: 10000,
    funkcije: [
      'SpajaPro AI — 10.000 poruka/mesec',
      'SLA garancija',
      'Dedicirana podrska',
      'Prilagodeni AI modeli',
      'Team pristup (do 25 clanova)',
      'Audit log',
    ],
  },
  {
    id: 'unlimited',
    naziv: 'Unlimited',
    opis: 'Neogranicen pristup svim funkcijama',
    cenaEur: 199,
    mesecno: true,
    stripePriceId: process.env.STRIPE_PRICE_UNLIMITED ?? '',
    chatLimit: -1, // Neograniceno
    funkcije: [
      'SpajaPro AI — Neograniceno',
      'Sve Enterprise funkcije',
      'Pristup svim platformama',
      'White-label opcija',
      'Neogranicen broj clanova tima',
      'Direktna linija podrske',
    ],
  },
];

export function getPlanById(id: string): SpajaPlan | undefined {
  return PLANOVI.find((p) => p.id === id);
}

export function getPlanByPriceId(priceId: string): SpajaPlan | undefined {
  return PLANOVI.find((p) => p.stripePriceId === priceId);
}
