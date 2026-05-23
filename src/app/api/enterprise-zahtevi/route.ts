import { NextResponse } from 'next/server';
import { APP_VERSION, OWNER_PHONE_NUMBER_ENV_KEY, OWNER_PHONE_DEFAULT } from '@/lib/constants';
import { getEnterpriseZahtevi, getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';
import { getKastlerSignalReadinessSummary } from '@/lib/kastler-tv-signal-request';
import { getOwnerIdentity } from '@/lib/owner-identity';
import { getOwnerPhoneVerifikacijaStatus } from '@/lib/owner-phone-auth';

export async function GET() {
  const operativa = getOperativnaSpremnost();
  const zahtevi = getEnterpriseZahtevi();
  const kastlerTv = getKastlerSignalReadinessSummary();

  // Owner identity & phone verification blocker
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? OWNER_PHONE_DEFAULT;
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);
  const ownerIdentity = getOwnerIdentity(phoneStatus);

  const ownerChecklist = ownerIdentity.vercel.checklist;
  const vercelBlokator = ownerIdentity.vercel.blokator;
  const vercelSpremnoZaSlanje = !vercelBlokator;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Enterprise Zahtevi — Vercel, GitHub i OpenAI',
    verzija: APP_VERSION,
    opis:
      'Ready-to-send enterprise paketi za Vercel, GitHub i OpenAI, pripremljeni za slanje preko kompanijskih mejlova i zvaničnih sales/contact formi.',
    kompanija: operativa.primarniOperativniNalog.kompanija,
    primarniFallback: operativa.primarniOperativniNalog.email,
    posiljalac: {
      sales: operativa.javniKontakti.find((kanal) => kanal.id === 'sales')?.email ?? 'sales@spaja.rs',
      business: operativa.javniKontakti.find((kanal) => kanal.id === 'business')?.email ?? 'business@spaja.rs',
      billing: operativa.javniKontakti.find((kanal) => kanal.id === 'billing')?.email ?? 'billing@spaja.rs',
      tech: operativa.javniKontakti.find((kanal) => kanal.id === 'tech')?.email ?? 'tech@spaja.rs',
      security:
        operativa.javniKontakti.find((kanal) => kanal.id === 'security')?.email ?? 'security@kompanija-spaja.rs',
    },
    ownerIdentity: {
      email: ownerIdentity.email,
      telefonStatus: ownerIdentity.telefon.status,
      maskiranTelefon: ownerIdentity.telefon.maskiranBroj,
      verifikovan: ownerIdentity.verifikovan,
      bankRacunId: ownerIdentity.bankRacun.id,
    },
    ownerChecklist,
    vercelBlokator,
    vercelSpremnoZaSlanje,
    zahtevi,
    kastlerTv,
    summary: {
      ukupno: zahtevi.length,
      spremnoZaSlanje: zahtevi.filter((paket) => paket.status === 'spremno_za_slanje').length,
      poslato: zahtevi.filter((paket) => paket.status === 'poslato').length,
      vercelOwnerPhoneVerified: ownerChecklist.phoneVerified,
      vercelOwnerAccountAktivan: ownerChecklist.ownerAccountAktivan,
      kastlerRequestStatus: kastlerTv.requestStatus,
      kastlerSignalLifecycle: kastlerTv.signalLifecycle,
      kanali: zahtevi.map((paket) => ({
        provajder: paket.provajder,
        status: paket.status,
        url: paket.kanalPodnosenja.url,
      })),
    },
    napomena:
      'Vercel, GitHub i OpenAI koriste zvanične sales/contact forme; OpenAI kanal je https://openai.com/contact-sales; ako dokumenta nisu digitalno razmenjiva, traži se kontakt/poziv/sastanak za potpisivanje ugovora.',
    timestamp: new Date().toISOString(),
  });
}
