import { NextResponse } from 'next/server';
import { getOwnerIdentity, getOwnerInstalacionaPoruka } from '@/lib/owner-identity';
import { getOwnerPhoneVerifikacijaStatus, getOwnerPoslednja_verifikacija } from '@/lib/owner-phone-auth';
import { APP_VERSION, KOMPANIJA, OWNER_PHONE_NUMBER_ENV_KEY } from '@/lib/constants';

/**
 * GET /api/owner-identity
 *
 * Vraća kompletan vlasnički identitet:
 *  - Status telefona (maskiran)
 *  - AI IQ WORLD BANK kanonski račun
 *  - Vercel ownership checklist i blokatori
 *  - Instalaciona poruka
 *
 * Telefon je uvek maskiran — pun broj se nikad ne vraća klijentu.
 *
 * Autofinish #1353
 */
export async function GET() {
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? '+38177-001-0001';
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);
  const poslednja_verifikacija = getOwnerPoslednja_verifikacija(telefonBroj);

  const identity = getOwnerIdentity(phoneStatus, poslednja_verifikacija);
  const instalacionaPoruka = getOwnerInstalacionaPoruka('dodela-broja', phoneStatus);

  return NextResponse.json({
    sistem: 'Owner Identity — Kompanija SPAJA',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    owner: {
      email: identity.email,
      ime: identity.ime,
      githubOwner: identity.githubOwner,
      verifikovan: identity.verifikovan,
    },
    telefon: {
      maskiranBroj: identity.telefon.maskiranBroj,
      status: identity.telefon.status,
      instalacioniSpremnost: identity.telefon.instalacioniSpremnost,
      poslednja_verifikacija: identity.telefon.poslednja_verifikacija,
    },
    bankRacun: {
      id: identity.bankRacun.id,
      banka: identity.bankRacun.banka,
      brojRacuna: identity.bankRacun.brojRacuna,
      tip: identity.bankRacun.tip,
      valuta: identity.bankRacun.valuta,
      status: identity.bankRacun.status,
      namena: identity.bankRacun.namena,
    },
    vercel: {
      accountEmail: identity.vercel.accountEmail,
      billingKontakt: identity.vercel.billingKontakt,
      status: identity.vercel.status,
      checklist: identity.vercel.checklist,
      zahtevaTelefonVerifikaciju: identity.vercel.zahtevaTelefonVerifikaciju,
      blokator: identity.vercel.blokator,
    },
    instalacionaPoruka,
    napomena: identity.napomena,
    timestamp: new Date().toISOString(),
  });
}
