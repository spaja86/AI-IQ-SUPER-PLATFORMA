import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'AI IQ Menjacnica — Svetska Menjacnica',
    appVerzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Svetska menjacnica koja drzi kurseve svega — BTC, SPAJA BTC i 150+ kripto valuta',
    spajaBtcPrompt: {
      naziv: 'SPAJA BTC',
      simbol: 'SPAJA',
      cena: '$892,500',
      opis: 'Ekskluzivna kripto valuta Kompanije SPAJA — mnogo skuplja od obicnog BTC-a',
      karakteristike: [
        'Sopstveni SPAJA Blockchain',
        'AI optimizacija',
        'Garantovana stabilnost',
        'Premium bezbednost',
        'Ekskluzivno na AI IQ Menjacnici',
      ],
    },
    kriptoKursevi: [
      { valuta: 'SPAJA BTC', simbol: 'SPAJA', cena: '$892,500', promena24h: '+3.8%' },
      { valuta: 'Bitcoin', simbol: 'BTC', cena: '$67,450', promena24h: '+2.4%' },
      { valuta: 'Ethereum', simbol: 'ETH', cena: '$3,820', promena24h: '+1.8%' },
      { valuta: 'Solana', simbol: 'SOL', cena: '$185', promena24h: '+5.1%' },
      { valuta: 'BNB', simbol: 'BNB', cena: '$612', promena24h: '+1.2%' },
      { valuta: 'USDT', simbol: 'USDT', cena: '$1.00', promena24h: '0.0%' },
    ],
    fiatKursevi: [
      { valuta: 'Evro', kod: 'EUR', kursRSD: '117.15', kursUSD: '$1.0845' },
      { valuta: 'Americki dolar', kod: 'USD', kursRSD: '108.05', kursUSD: '$1.00' },
      { valuta: 'Britanska funta', kod: 'GBP', kursRSD: '136.80', kursUSD: '$1.2660' },
      { valuta: 'Svajcarski franak', kod: 'CHF', kursRSD: '121.50', kursUSD: '$1.1245' },
      { valuta: 'Srpski dinar', kod: 'RSD', kursRSD: '1.00', kursUSD: '$0.0093' },
    ],
    statistika: {
      kriptoValute: '150+',
      fiatValute: '30+',
      dnevniPromet: '$2M+',
      aiTacnost: '94%',
      trgovackiParovi: '250+',
    },
    funkcije: [
      'SPAJA BTC — ekskluzivna kripto valuta',
      'Kripto trading (BTC, ETH, SOL, 150+ valuta)',
      'Fiat konverzija (30+ valuta)',
      'AI predikcije sa 94% tacnoscu',
      'Portfolio menadzment sa AI asistentom',
      'Real-time analitika',
    ],
    analiza: 'Ekstremno jaka menjacnica — sve se moze proveriti i analizirati',
    url: 'https://ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app/index.html',
    repo: 'spaja86/Ai-Iq-Menja-nica',
    timestamp: new Date().toISOString(),
  });
}
