import type { WalletCardNetwork } from './types';

export interface CardValidationInput {
  number: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface CardValidationResult {
  valid: boolean;
  normalized: string;
  masked: string;
  network: WalletCardNetwork;
  luhnValid: boolean;
  lengthValid: boolean;
  expiryValid: boolean;
  reasons: string[];
}

const MAX_EXPIRY_YEARS_FROM_NOW = 20;

const NETWORK_PATTERNS: Array<{ network: WalletCardNetwork; regex: RegExp; lengths: number[] }> = [
  { network: 'visa', regex: /^4/, lengths: [13, 16, 19] },
  { network: 'mastercard', regex: /^(5[1-5]|2[2-7])/, lengths: [16] },
  { network: 'amex', regex: /^3[47]/, lengths: [15] },
  { network: 'diners', regex: /^3(?:0[0-5]|[68])/, lengths: [14] },
  { network: 'discover', regex: /^(6011|65|64[4-9])/, lengths: [16, 19] },
  { network: 'jcb', regex: /^35/, lengths: [16, 19] },
  { network: 'unionpay', regex: /^62/, lengths: [16, 17, 18, 19] },
];

export function normalizeCardNumber(input: string): string {
  return input.replace(/\D+/g, '');
}

export function maskCardNumber(number: string): string {
  if (number.length < 10) return '****';
  return `${number.slice(0, 6)}******${number.slice(-4)}`;
}

export function detectCardNetwork(number: string): WalletCardNetwork {
  for (const pattern of NETWORK_PATTERNS) {
    if (pattern.regex.test(number)) return pattern.network;
  }
  return 'unknown';
}

export function isLuhnValid(number: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number(number[i]);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isExpiryValid(month?: number, year?: number): boolean {
  if (!month || !year) return false;
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + MAX_EXPIRY_YEARS_FROM_NOW) return false;
  return true;
}

export function validateCardInput(input: CardValidationInput): CardValidationResult {
  const normalized = normalizeCardNumber(input.number);
  const network = detectCardNetwork(normalized);
  const reasons: string[] = [];

  const networkRule = NETWORK_PATTERNS.find((n) => n.network === network);
  const lengthValid = networkRule ? networkRule.lengths.includes(normalized.length) : normalized.length >= 12 && normalized.length <= 19;
  if (!lengthValid) reasons.push('Neispravna dužina broja kartice za prepoznati tip kartice.');

  const luhnValid = isLuhnValid(normalized);
  if (!luhnValid) reasons.push('Luhn validacija nije prošla.');

  const expiryValid = isExpiryValid(input.expiryMonth, input.expiryYear);
  if (!expiryValid) reasons.push('Datum isteka nije validan.');

  return {
    valid: lengthValid && luhnValid && expiryValid,
    normalized,
    masked: maskCardNumber(normalized),
    network,
    luhnValid,
    lengthValid,
    expiryValid,
    reasons,
  };
}
