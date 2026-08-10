// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom
// Kompanija SPAJA — Digitalna Industrija
//
// Global telecom operator registry covering major carriers across EU, US, APAC, LATAM, Africa, ME.

import type { TelecomOperator, TelecomRegion } from './types';

export const TELECOM_OPERATORS: TelecomOperator[] = [
  // ─── EU ───────────────────────────────────────────────────────────────────
  { id: 'vodafone-eu', name: 'Vodafone EU', region: 'EU', countries: ['DE', 'GB', 'IT', 'ES', 'NL', 'PT', 'GR', 'CZ', 'HU', 'RO'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'EUR', active: true },
  { id: 'deutsche-telekom', name: 'Deutsche Telekom', region: 'EU', countries: ['DE', 'PL', 'CZ', 'HU', 'SK', 'HR'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'EUR', active: true },
  { id: 'orange-eu', name: 'Orange EU', region: 'EU', countries: ['FR', 'ES', 'PL', 'RO', 'BE', 'MD', 'SK'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'EUR', active: true },
  { id: 'telecom-italia', name: 'TIM (Telecom Italia)', region: 'EU', countries: ['IT'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'EUR', active: true },
  { id: 'telefonica-eu', name: 'Telefónica EU', region: 'EU', countries: ['ES', 'DE', 'GB', 'CZ', 'SK'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'EUR', active: true },
  { id: 'mts-rs', name: 'MTS Serbia', region: 'EU', countries: ['RS'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'RSD', active: true },
  { id: 'a1-eu', name: 'A1 Telecom', region: 'EU', countries: ['AT', 'HR', 'RS', 'SI', 'BG', 'MK', 'BY'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'EUR', active: true },
  { id: 'swisscom', name: 'Swisscom', region: 'EU', countries: ['CH'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'CHF', active: true },

  // ─── US ───────────────────────────────────────────────────────────────────
  { id: 'att-us', name: 'AT&T', region: 'US', countries: ['US'], networkTypes: ['3G', '4G', '5G'], currency: 'USD', active: true },
  { id: 'tmobile-us', name: 'T-Mobile US', region: 'US', countries: ['US'], networkTypes: ['4G', '5G'], currency: 'USD', active: true },
  { id: 'verizon-us', name: 'Verizon', region: 'US', countries: ['US'], networkTypes: ['4G', '5G'], currency: 'USD', active: true },

  // ─── APAC ─────────────────────────────────────────────────────────────────
  { id: 'singtel', name: 'Singtel', region: 'APAC', countries: ['SG', 'AU', 'IN'], networkTypes: ['4G', '5G'], currency: 'SGD', active: true },
  { id: 'telstra', name: 'Telstra', region: 'APAC', countries: ['AU'], networkTypes: ['4G', '5G'], currency: 'AUD', active: true },
  { id: 'docomo', name: 'NTT Docomo', region: 'APAC', countries: ['JP'], networkTypes: ['4G', '5G'], currency: 'JPY', active: true },
  { id: 'china-mobile', name: 'China Mobile', region: 'APAC', countries: ['CN'], networkTypes: ['3G', '4G', '5G'], currency: 'CNY', active: true },
  { id: 'airtel', name: 'Airtel India', region: 'APAC', countries: ['IN'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'INR', active: true },

  // ─── LATAM ────────────────────────────────────────────────────────────────
  { id: 'claro-latam', name: 'Claro LATAM', region: 'LATAM', countries: ['BR', 'AR', 'CO', 'CL', 'MX', 'PE', 'EC'], networkTypes: ['3G', '4G', '5G'], currency: 'USD', active: true },
  { id: 'movistar-latam', name: 'Movistar LATAM', region: 'LATAM', countries: ['AR', 'CO', 'CL', 'PE', 'VE', 'UY'], networkTypes: ['3G', '4G', '5G'], currency: 'USD', active: true },
  { id: 'vivo-br', name: 'Vivo Brasil', region: 'LATAM', countries: ['BR'], networkTypes: ['4G', '5G'], currency: 'BRL', active: true },

  // ─── Africa ───────────────────────────────────────────────────────────────
  { id: 'mtn-africa', name: 'MTN Africa', region: 'Africa', countries: ['NG', 'ZA', 'GH', 'CM', 'CI', 'UG', 'RW', 'SD'], networkTypes: ['2G', '3G', '4G'], currency: 'USD', active: true },
  { id: 'vodacom', name: 'Vodacom', region: 'Africa', countries: ['ZA', 'TZ', 'MZ', 'CD', 'LS'], networkTypes: ['2G', '3G', '4G', '5G'], currency: 'ZAR', active: true },
  { id: 'airtel-africa', name: 'Airtel Africa', region: 'Africa', countries: ['KE', 'NG', 'TZ', 'UG', 'GH', 'ZM', 'MG'], networkTypes: ['2G', '3G', '4G'], currency: 'USD', active: true },

  // ─── ME ───────────────────────────────────────────────────────────────────
  { id: 'etisalat-ae', name: 'Etisalat (e&)', region: 'ME', countries: ['AE', 'EG', 'SA'], networkTypes: ['4G', '5G'], currency: 'AED', active: true },
  { id: 'stc-sa', name: 'STC Saudi Arabia', region: 'ME', countries: ['SA', 'BH', 'KW'], networkTypes: ['4G', '5G'], currency: 'SAR', active: true },
  { id: 'zain-me', name: 'Zain Group', region: 'ME', countries: ['KW', 'SA', 'IQ', 'JO', 'BH', 'SD', 'SS'], networkTypes: ['3G', '4G', '5G'], currency: 'USD', active: true },
];

// ─── Operator lookup helpers ──────────────────────────────────────────────────

export function getOperatorById(id: string): TelecomOperator | undefined {
  return TELECOM_OPERATORS.find((op) => op.id === id);
}

export function listOperators(region?: TelecomRegion): TelecomOperator[] {
  if (region) return TELECOM_OPERATORS.filter((op) => op.region === region && op.active);
  return TELECOM_OPERATORS.filter((op) => op.active);
}
