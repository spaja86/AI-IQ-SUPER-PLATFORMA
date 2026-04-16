import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ Menjacnica - Kripto Novcanik',
    verzija: APP_VERSION,
    status: 'aktivan',
    portfolio: {
      ukupnaVrednost: '$45,230.00',
      promena24h: '+$1,245.00 (+2.83%)',
      alokacija: [
        { valuta: 'BTC', procenat: '67%', kolicina: '0.45 BTC', vrednost: '$30,339' },
        { valuta: 'ETH', procenat: '31%', kolicina: '3.67 ETH', vrednost: '$14,020' },
        { valuta: 'SOL', procenat: '1%', kolicina: '2.44 SOL', vrednost: '$451' },
        { valuta: 'Ostalo', procenat: '1%', kolicina: 'Razno', vrednost: '$420' },
      ],
    },
    funkcije: [
      'Portfolio pregled sa ukupnom vrednoscu',
      'Pie Chart alokacija (Canvas)',
      'Lista svih kriptovaluta u portfoliu',
      'Istorija transakcija sa statusom',
      'Brze akcije — kupi, posalji, primi',
      'Uplata/Isplata — RSD, EUR, USD, kripto',
    ],
    brzeAkcije: ['Kupi kripto', 'Posalji kripto', 'Primi kripto', 'Uplata', 'Isplata'],
    timestamp: new Date().toISOString(),
  });
}
