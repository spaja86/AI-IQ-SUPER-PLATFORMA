import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'AI IQ World Bank — Digitalna Banka',
    appVerzija: APP_VERSION,
    status: 'aktivan',
    kamatnaStopaPrompt: {
      stopa: '40%',
      period: 'mesecno',
      opis: 'Pozitivna kamatna stopa od 40% mesecno na stedne racune',
      uslov: 'Mesec dana (30 dana) bez povlacenja sredstava',
      primeri: [
        { ulog: '1.000 RSD', zarada: '400 RSD', ukupno: '1.400 RSD' },
        { ulog: '5.000 RSD', zarada: '2.000 RSD', ukupno: '7.000 RSD' },
        { ulog: '10.000 RSD', zarada: '4.000 RSD', ukupno: '14.000 RSD' },
        { ulog: '50.000 RSD', zarada: '20.000 RSD', ukupno: '70.000 RSD' },
        { ulog: '100.000 RSD', zarada: '40.000 RSD', ukupno: '140.000 RSD' },
        { ulog: '1.000.000 RSD', zarada: '400.000 RSD', ukupno: '1.400.000 RSD' },
      ],
    },
    servisi: [
      'Stedni racun sa 40% kamatom',
      'Multi-valutni racuni (RSD, EUR, USD, GBP + kripto)',
      'Globalni transferi (Instant, SWIFT, Blockchain)',
      'AI-optimizovani krediti',
      'Investicije sa AI preporukama',
      'Real-time analitika i izvestaji',
    ],
    bezbednost: [
      'E2E enkripcija',
      'Biometricka autentifikacija',
      '2FA',
      'AI fraud detekcija',
    ],
    analiza: 'Ekstremno jaka banka — sve se moze proveriti i analizirati',
    ersteBankaDOOSmederevo: {
      naziv: 'ERSTE Banka DOO Smederevo',
      vlasnikRacuna: 'Digitalna Industrija',
      status: 'aktivan',
      racuni: [
        {
          tip: 'dinarski',
          valuta: 'RSD',
          brojRacuna: '025897158',
          opis: 'Dinarski racun za domace transakcije',
        },
        {
          tip: 'devizni',
          valuta: 'EUR',
          brojRacuna: '038971285',
          opis: 'Devizni racun u evrima za medjunarodne transakcije',
        },
        {
          tip: 'devizni',
          valuta: 'USD',
          brojRacuna: '05364215985',
          opis: 'Devizni racun u dolarima za globalne transakcije',
        },
      ],
      kartice: 'Izdate na ERSTE Banka DOO Smederevo',
    },
    url: 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/index.html',
    repo: 'spaja86/Ai-Iq-World-Bank',
    timestamp: new Date().toISOString(),
  });
}
