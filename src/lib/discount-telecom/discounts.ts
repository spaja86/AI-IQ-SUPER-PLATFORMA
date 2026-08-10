// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom
// Kompanija SPAJA — Digitalna Industrija
//
// Sample discount rules and discount registry for global telecom operators.

import type { DiscountRule } from './types';

// Reference dates use far-future validity to stay active in demos / tests.
const FAR_FUTURE = '2099-12-31';
const PAST = '2000-01-01';

export const DISCOUNT_RULES: DiscountRule[] = [
  // ─── Vodafone EU ──────────────────────────────────────────────────────────
  {
    id: 'vodafone-eu-loyalty-10',
    operatorId: 'vodafone-eu',
    type: 'loyalty',
    valuePercent: 10,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'all'],
    exclusive: false,
    applicableNetworks: [],
    description: 'Vodafone EU — 10% loyalty discount for existing customers',
  },
  {
    id: 'vodafone-eu-bundle-5g-15',
    operatorId: 'vodafone-eu',
    type: 'bundle',
    valuePercent: 15,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'business'],
    exclusive: false,
    applicableNetworks: ['5G'],
    description: 'Vodafone EU — 15% bundle discount on 5G plans',
  },

  // ─── Deutsche Telekom ─────────────────────────────────────────────────────
  {
    id: 'dt-student-20',
    operatorId: 'deutsche-telekom',
    type: 'volume',
    valuePercent: 20,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['student'],
    exclusive: false,
    applicableNetworks: [],
    description: 'Deutsche Telekom — 20% student discount',
  },
  {
    id: 'dt-roaming-eu-10',
    operatorId: 'deutsche-telekom',
    type: 'roaming',
    valuePercent: 10,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['all'],
    exclusive: false,
    applicableNetworks: ['4G', '5G'],
    description: 'Deutsche Telekom — 10% roaming discount within EU',
  },

  // ─── MTS Serbia ───────────────────────────────────────────────────────────
  {
    id: 'mts-rs-loyalty-15',
    operatorId: 'mts-rs',
    type: 'loyalty',
    valuePercent: 15,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'all'],
    exclusive: false,
    applicableNetworks: [],
    description: 'MTS Serbia — 15% loyalty discount',
  },
  {
    id: 'mts-rs-senior-25',
    operatorId: 'mts-rs',
    type: 'seasonal',
    valuePercent: 25,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['senior'],
    exclusive: true,
    applicableNetworks: [],
    description: 'MTS Serbia — 25% exclusive senior discount',
  },

  // ─── AT&T ─────────────────────────────────────────────────────────────────
  {
    id: 'att-business-bundle-20',
    operatorId: 'att-us',
    type: 'bundle',
    valuePercent: 20,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['business'],
    exclusive: false,
    applicableNetworks: ['4G', '5G'],
    description: 'AT&T — 20% business bundle discount',
  },

  // ─── T-Mobile US ──────────────────────────────────────────────────────────
  {
    id: 'tmobile-event-5g-25',
    operatorId: 'tmobile-us',
    type: 'event',
    valuePercent: 25,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'all'],
    exclusive: false,
    applicableNetworks: ['5G'],
    description: 'T-Mobile US — 25% event promo on 5G plans',
  },

  // ─── Singtel ──────────────────────────────────────────────────────────────
  {
    id: 'singtel-volume-10',
    operatorId: 'singtel',
    type: 'volume',
    valuePercent: 10,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['business', 'all'],
    exclusive: false,
    applicableNetworks: ['4G', '5G'],
    description: 'Singtel — 10% volume discount for multi-line plans',
  },

  // ─── Airtel India ─────────────────────────────────────────────────────────
  {
    id: 'airtel-roaming-apac-15',
    operatorId: 'airtel',
    type: 'roaming',
    valuePercent: 15,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'business'],
    exclusive: false,
    applicableNetworks: ['4G'],
    description: 'Airtel India — 15% roaming discount across APAC',
  },

  // ─── MTN Africa ───────────────────────────────────────────────────────────
  {
    id: 'mtn-seasonal-20',
    operatorId: 'mtn-africa',
    type: 'seasonal',
    valuePercent: 20,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'all'],
    exclusive: false,
    applicableNetworks: [],
    description: 'MTN Africa — 20% seasonal promo discount',
  },

  // ─── Etisalat ─────────────────────────────────────────────────────────────
  {
    id: 'etisalat-5g-loyalty-12',
    operatorId: 'etisalat-ae',
    type: 'loyalty',
    valuePercent: 12,
    validFrom: PAST,
    validUntil: FAR_FUTURE,
    eligibleSegments: ['consumer', 'business'],
    exclusive: false,
    applicableNetworks: ['5G'],
    description: 'Etisalat — 12% loyalty discount on 5G plans',
  },
];

// ─── Discount lookup helpers ──────────────────────────────────────────────────

export function getDiscountsByOperator(operatorId: string): DiscountRule[] {
  return DISCOUNT_RULES.filter((d) => d.operatorId === operatorId);
}

export function getDiscountById(id: string): DiscountRule | undefined {
  return DISCOUNT_RULES.find((d) => d.id === id);
}

export function listDiscounts(operatorId?: string, region?: string): DiscountRule[] {
  if (operatorId) return DISCOUNT_RULES.filter((d) => d.operatorId === operatorId);
  return DISCOUNT_RULES;
}
