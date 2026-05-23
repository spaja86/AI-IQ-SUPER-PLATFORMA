import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getEnterpriseZahtevi, getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';
import { getKastlerSignalReadinessSummary } from '@/lib/kastler-tv-signal-request';

export async function GET() {
  const operativa = getOperativnaSpremnost();
  const zahtevi = getEnterpriseZahtevi();
  const kastlerTv = getKastlerSignalReadinessSummary();

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
    zahtevi,
    kastlerTv,
    summary: {
      ukupno: zahtevi.length,
      spremnoZaSlanje: zahtevi.filter((paket) => paket.status === 'spremno_za_slanje').length,
      poslato: zahtevi.filter((paket) => paket.status === 'poslato').length,
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
