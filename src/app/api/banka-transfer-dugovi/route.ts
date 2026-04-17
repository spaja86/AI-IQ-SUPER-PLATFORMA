import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ World Bank — Transferi i Dugovi',
    verzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Pregled transfera sa AI IQ World Bank racuna i sumarni prikaz dugova prema partnerima',

    noviGenerisaniRacun: {
      brojRacuna: 'DIGI-IND-002-EUR',
      valuta: 'EUR',
      tip: 'digitalni-devizni',
      vlasnikRacuna: 'Digitalna Industrija',
      banka: 'AI IQ World Bank',
      namena: 'Placanje operativnih troskova (hosting, servisi, infrastruktura)',
      status: 'aktivan',
      datumOtvaranja: new Date().toISOString(),
    },

    transfer: {
      id: 'TRX-AIIQWB-001',
      izvor: {
        racun: 'DIGI-IND-001',
        banka: 'AI IQ World Bank',
        vlasnik: 'Digitalna Industrija',
      },
      destinacija: {
        racun: 'DIGI-IND-002-EUR',
        banka: 'AI IQ World Bank',
        vlasnik: 'Digitalna Industrija',
      },
      iznos: 10_000,
      valuta: 'EUR',
      opis: 'Transfer 10.000 EUR sa glavnog AI IQ World Bank racuna na novi generisani EUR racun',
      status: 'izvrseno',
      tip: 'interni-transfer',
      datum: new Date().toISOString(),
    },

    dugovi: {
      opis: 'Sumarni pregled dugova Digitalne Industrije prema servisima i partnerima',
      ukupnoDugovaUSD: 1_000,
      stavke: [
        {
          partner: 'Vercel',
          tip: 'hosting-i-deploy',
          iznos: 1_000,
          valuta: 'USD',
          opis: 'Dug za Vercel hosting i deploy servise — oko $1.000',
          status: 'aktivan',
          kategorija: 'infrastruktura',
          napomena: 'Ceka se konacna sumacija svih Vercel faktura za precizni iznos',
        },
      ],
      ukupnoStavki: 1,
      napomena: 'Dugovi se sumarisu — ceka se konacna potvrda iznosa. Trenutni procenjeni ukupni dug: ~$1.000 (Vercel).',
    },

    finansijskiPregled: {
      transferisano: '10.000 EUR',
      ukupnoDugova: '~$1.000 USD',
      statusDugova: 'u-procesu-sumiranja',
      napomena: 'Transfer od 10.000 EUR je izvrseno. Dugovi se sumarisu — za sada dugujemo Vercelu oko $1.000.',
    },

    timestamp: new Date().toISOString(),
  });
}
