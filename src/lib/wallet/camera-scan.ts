export const MIN_OCR_CONFIDENCE_THRESHOLD = 0.85;

export interface WalletScanPayload {
  consent: boolean;
  scanSessionId: string;
  extracted?: {
    maskedNumber: string;
    last4: string;
    expiryMonth?: number;
    expiryYear?: number;
    confidence: number;
  };
}

export function evaluateScanPayload(payload: WalletScanPayload) {
  if (!payload.consent) {
    return {
      accepted: false,
      requiresManualEntry: true,
      reason: 'Korisnički consent je obavezan pre obrade skena kartice.',
    };
  }

  if (!payload.extracted) {
    return {
      accepted: true,
      requiresManualEntry: true,
      reason: 'OCR nije dao rezultat; prelazak na ručni unos.',
    };
  }

  const confidenceLow = payload.extracted.confidence < MIN_OCR_CONFIDENCE_THRESHOLD;

  return {
    accepted: true,
    requiresManualEntry: confidenceLow,
    reason: confidenceLow
      ? 'Nizak OCR confidence; korisnik mora potvrditi i dopuniti ručno.'
      : 'Sken uspešan; nastavak na tokenizaciju nakon korisničke potvrde.',
  };
}
