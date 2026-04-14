import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'ERSTE Banka DOO Smederevo - Racuni Digitalne Industrije',
    verzija: APP_VERSION,
    status: 'aktivan',
    banka: {
      naziv: 'ERSTE Banka DOO Smederevo',
      lokacija: 'Smederevo, Srbija',
      vlasnikRacuna: 'Digitalna Industrija',
    },
    racuni: [
      {
        tip: 'dinarski',
        valuta: 'RSD',
        brojRacuna: '025897158',
        opis: 'Dinarski racun za domace transakcije',
        status: 'aktivan',
      },
      {
        tip: 'devizni',
        valuta: 'EUR',
        brojRacuna: '038971285',
        opis: 'Devizni racun u evrima za medjunarodne transakcije',
        status: 'aktivan',
      },
      {
        tip: 'devizni',
        valuta: 'USD',
        brojRacuna: '05364215985',
        opis: 'Devizni racun u dolarima za globalne transakcije',
        status: 'aktivan',
      },
    ],
    kartice: {
      izdavac: 'ERSTE Banka DOO Smederevo',
      status: 'izdate i aktivne',
    },
    ukupnoRacuna: 3,
    podrzaneValute: ['RSD', 'EUR', 'USD'],
    timestamp: new Date().toISOString(),
  });
}
