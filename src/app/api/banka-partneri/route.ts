import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ World Bank — Partneri',
    verzija: APP_VERSION,
    status: 'aktivan',
    partneri: [
      {
        id: 'erste-banka',
        naziv: 'ERSTE Banka DOO Smederevo',
        tip: 'bankarski',
        opis: 'Zvanicni bankarski partner — dinarski i devizni racuni za Digitalnu Industriju',
        lokacija: 'Smederevo, Srbija',
        status: 'aktivan',
      },
      {
        id: 'kompanija-spaja',
        naziv: 'Kompanija SPAJA',
        tip: 'maticna',
        opis: 'Maticna kompanija koja upravlja celim digitalnim ekosistemom',
        url: 'https://www.kompanija-spaja.com',
        status: 'aktivan',
      },
      {
        id: 'omega-ai',
        naziv: 'Omega AI',
        tip: 'tehnoloski',
        opis: 'AI tehnoloski partner — 40.000.562 AI persona za naprednu analitiku',
        status: 'aktivan',
      },
      {
        id: 'ai-iq-menjacnica',
        naziv: 'AI IQ Menjacnica',
        tip: 'finansijski',
        opis: 'Partnerska menjacnica za konverziju valuta i kripto trgovinu',
        status: 'aktivan',
      },
      {
        id: 'vercel',
        naziv: 'Vercel',
        tip: 'hosting',
        opis: 'Hosting i deploy partner za sve digitalne platforme',
        status: 'aktivan',
      },
      {
        id: 'github',
        naziv: 'GitHub',
        tip: 'razvoj',
        opis: 'Platforma za razvoj koda i upravljanje repozitorijumima',
        status: 'aktivan',
      },
    ],
    ukupnoPartnera: 6,
    timestamp: new Date().toISOString(),
  });
}
