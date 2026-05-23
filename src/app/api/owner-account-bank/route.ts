import { NextResponse } from 'next/server';
import { getOwnerIdentity } from '@/lib/owner-identity';
import { getOwnerPhoneVerifikacijaStatus } from '@/lib/owner-phone-auth';
import { APP_VERSION, KOMPANIJA, OWNER_PHONE_NUMBER_ENV_KEY, OWNER_PHONE_DEFAULT } from '@/lib/constants';

/**
 * GET /api/owner-account-bank
 *
 * Kanonski vlasnički AI IQ WORLD BANK račun za billing i Vercel reference.
 *
 * Vraća:
 *  - Identifikator računa (DIGI-IND-001)
 *  - Vercel billing referentu
 *  - Billing kontakt kanal
 *  - Napomenu da se ovaj ID koristi u svim enterprise zahtevima
 */
export async function GET() {
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? OWNER_PHONE_DEFAULT;
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);
  const identity = getOwnerIdentity(phoneStatus);
  const racun = identity.bankRacun;

  return NextResponse.json({
    sistem: 'Owner Account — AI IQ WORLD BANK',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    vlasnik: {
      email: identity.email,
      ime: identity.ime,
    },
    racun: {
      id: racun.id,
      banka: racun.banka,
      brojRacuna: racun.brojRacuna,
      tip: racun.tip,
      valuta: racun.valuta,
      status: racun.status,
      namena: racun.namena,
    },
    vercelBillingRef: racun.brojRacuna,
    billingKontakt: identity.vercel.billingKontakt,
    ownerEmail: identity.vercel.accountEmail,
    napomena: `Kanonski vlasnički račun za sve billing reference: ${racun.brojRacuna}. Koristite ovaj ID u Vercel i GitHub Enterprise zahtevima.`,
    timestamp: new Date().toISOString(),
  });
}
