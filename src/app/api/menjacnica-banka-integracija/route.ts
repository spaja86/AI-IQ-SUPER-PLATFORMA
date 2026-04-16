import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ Menjacnica - Banka Integracija',
    verzija: APP_VERSION,
    status: 'aktivan',
    opis: 'AI IQ Menjacnica i AI IQ World Bank rade zajedno kao savrseni finansijski ekosistem',
    menjacnica: {
      naziv: 'AI IQ Menjacnica',
      funkcija: 'Kripto i fiat konverzija sa AI predikcijama',
      kriptoValute: '500+',
      fiatValute: '30+',
      aiTacnost: '94%',
      url: '/menjacnica',
    },
    banka: {
      naziv: 'AI IQ World Bank',
      funkcija: 'Stedni racuni sa 40% kamatom, krediti, investicije',
      kamatnaSstopa: '40%',
      racuni: '5000+',
      url: '/banka',
    },
    zajednicko: {
      bankarskiPartner: 'ERSTE Banka DOO Smederevo',
      vlasnik: 'Nikola Spajic',
      omegaAi: '40.000.562 persona',
      profesionalniMejl: '@banka.spaja.rs i @spaja.rs',
      podrzaneValute: ['RSD', 'EUR', 'USD', 'GBP', 'CHF', 'BTC', 'ETH', 'SOL', 'SPAJA BTC'],
    },
    prednosti: [
      'Instant konverzija izmedju banke i menjacnice bez provizije',
      'Zajednicki AI motor (Omega AI) za optimizaciju',
      'ERSTE Banka DOO Smederevo za fizicke racune (RSD/EUR/USD)',
      'Profesionalni mejl sistem za notifikacije o transakcijama',
      'Jedinstven login za oba sistema',
      'Portfolio upravljanje sa kombinovanim prikazom',
    ],
    timestamp: new Date().toISOString(),
  });
}
